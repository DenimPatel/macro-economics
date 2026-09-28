import { describe, expect, it } from 'vitest'
import { dataDomain, niceStep } from '../lib/chartDomain'

/**
 * The axis contract, which until this file had none.
 *
 * `lib/chartDomain.ts` is the one place on the site that decides where a
 * chart's axis starts and stops, and it was referenced by exactly one thing:
 * a regex in `tools.test.tsx` that asserts a tool CALLS it. Nothing tested
 * what it returns, and both of its documented failure modes are silent —
 * a domain that clips data reads as a curve that stops, which looks like a
 * fact about the model rather than about the axis, and a domain that produces
 * `413.27` gives a reader a tick label they cannot match against a tooltip.
 *
 * The properties below are the module's own promises, read off its source
 * rather than assumed. Where a promise has an exception the source states
 * (the flat-series early return, the sub-0.01 step) the exception is asserted
 * too, because a test that quietly assumes the happy path is a test that goes
 * green on a domain nobody would ship.
 */

/** Is `value` a 1 / 2 / 2.5 / 5 / 10 x 10^n number? */
function onTheLadder(value: number): boolean {
  if (!Number.isFinite(value) || value <= 0) return false
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalised = value / magnitude
  return [1, 2, 2.5, 5, 10].some((rung) => Math.abs(normalised - rung) < 1e-9)
}

/** Every rung of the ladder across a wide range of decades. */
function everyRung(min: number, max: number): number[] {
  const rungs: number[] = []
  for (let decade = -12; decade <= 12; decade += 1) {
    for (const rung of [1, 2, 2.5, 5]) {
      const value = rung * 10 ** decade
      if (value >= min && value <= max) rungs.push(value)
    }
  }
  return rungs
}

/**
 * The step both bounds are on, or null.
 *
 * "Snapped" is asserted as a COMMON GRID rather than as two round numbers,
 * because that is the weaker and more useful claim and it is the one that
 * holds: `[0, 125]` is two round numbers but they are not on a grid a tick
 * label can use. A grid counts as snapped when at least two intervals span
 * it, so a single-step domain (which would draw one label) does not qualify.
 */
function gridStep(low: number, high: number): number | null {
  const width = high - low
  if (!(width > 0)) return null
  for (const step of everyRung(width / 4096, width * 64)) {
    const a = low / step
    const b = high / step
    if (Math.abs(a - Math.round(a)) < 1e-6 && Math.abs(b - Math.round(b)) < 1e-6) {
      if (Math.round(b - a) >= 2) return step
    }
  }
  return null
}

/**
 * Series drawn from the tools' own callers, at shapes the twenty tools
 * actually produce: a percentage that runs 0 to 8, a level that runs 0 to
 * 13,000, a rate that sits within a hair of a round number, and a degenerate
 * flat series. The first three are the shapes whose wrong domain a reader
 * notices; the fourth is the shape whose wrong domain a reader does not.
 */
const SERIES: ReadonlyArray<{ why: string; values: number[] }> = [
  { why: 'an output index, 0 to 100', values: [0, 100] },
  { why: 'a real rate sweep, 0 to 8 in halves', values: Array.from({ length: 17 }, (_, i) => i / 2) },
  { why: 'the Keynesian cross at MPC 0.95', values: [0, 13_000] },
  { why: 'a share of reserves, 100 down to 0.7', values: Array.from({ length: 61 }, (_, i) => 100 * Math.pow(0.965, i)) },
  { why: 'a near-round pair, 19.99 to 20.01', values: [19.99, 20.01] },
  { why: 'a negative band, -413 to -17', values: [-413, -17] },
  { why: 'a spread of eight decades, 1e-4 to 3e-4', values: [1e-4, 3e-4] },
  { why: 'a single point repeated, so the range is flat', values: [4.2, 4.2, 4.2] },
]

const TICKS = [3, 4, 5, 6, 8, 10]

/* ================================================================== *
 * 1. It contains every finite value
 * ================================================================== */

describe('a data domain contains every value it was given', () => {
  it.each(SERIES.map((s) => [s.why, s.values] as const))(
    'brackets the series for %s',
    (_why, values) => {
      const min = Math.min(...values)
      const max = Math.max(...values)
      for (const ticks of TICKS) {
        for (const includeZero of [false, true]) {
          for (const pad of [0, 0.04, 0.2]) {
            const [low, high] = dataDomain([values], { ticks, includeZero, pad })
            expect(low, `low at ticks ${ticks}, zero ${includeZero}, pad ${pad}`).toBeLessThanOrEqual(min)
            expect(high, `high at ticks ${ticks}, zero ${includeZero}, pad ${pad}`).toBeGreaterThanOrEqual(max)
          }
        }
      }
    },
  )

  it('contains every value when the caller passes several series at once', () => {
    // `dataDomain` flattens on purpose: a domain derived from one of two
    // plotted series is the same defect as a pinned one, because the other
    // series leaves the frame and nothing on the screen says so.
    const [low, high] = dataDomain([[1, 2, 3], [4, 5, 900], [7, 8, 9]], { pad: 0 })
    expect(low).toBeLessThanOrEqual(1)
    expect(high).toBeGreaterThanOrEqual(900)
  })

  it('contains every value when the caller passes a flat list of numbers', () => {
    const [low, high] = dataDomain([-12, 5, 88, 300], { pad: 0 })
    expect(low).toBeLessThanOrEqual(-12)
    expect(high).toBeGreaterThanOrEqual(300)
  })

  it('ignores a non-finite value rather than poisoning the domain with it', () => {
    // One `NaN` in a series must not take the axis with it: `Math.min` over a
    // list containing `NaN` is `NaN`, and a domain of `[NaN, NaN]` is an
    // axis Recharts cannot draw. The module filters first, and this is that.
    const [low, high] = dataDomain([10, 20, NaN, 30, Infinity, -Infinity], { pad: 0 })
    expect(Number.isFinite(low)).toBe(true)
    expect(Number.isFinite(high)).toBe(true)
    expect(low).toBeLessThanOrEqual(10)
    expect(high).toBeGreaterThanOrEqual(30)
  })
})

/* ================================================================== *
 * 2. It rounds OUTWARD. Inward rounding is the clip.
 * ================================================================== */

describe('a data domain rounds outward, never inward', () => {
  it('leaves a bound that already sits on a round number exactly where it is', () => {
    // The witness for the ROUNDING DIRECTION. An inward low side (`ceil`)
    // would give `[20, 80]` -> `[20, 80]` still, because 20 is exact; the
    // inward HIGH side (`floor`) would give `[20, 60]`, which drops the 80
    // off the axis and is precisely the silent clip the module exists to
    // prevent. Both bounds are stated, so a reversal on either side is red.
    expect(dataDomain([20, 80], { pad: 0 })).toEqual([20, 80])
  })

  it('extends a range by a whole step rather than by nothing', () => {
    // The 2.5 rung, which is the reason it is on the ladder at all. A span of
    // 109 asks for a step of 21.8, normalises to 2.18, and without the 2.5
    // rung jumps the 2-to-5 gap to 50 — a domain of `[100, 250]` for data in
    // `[101, 209]`, more than half the plot empty. 25 gives `[100, 225]`.
    expect(dataDomain([100, 209], { pad: 0 })).toEqual([100, 225])
    expect(niceStep(21.8)).toBe(25)
  })

  it('pushes both bounds further out when padding, so no line sits on the frame', () => {
    // The default 0.04 pad exists because a line whose maximum lands exactly
    // on a snapped boundary is drawn ON the frame, and a line on the frame is
    // indistinguishable from a line clipped there. With `pad: 0` a series
    // ending on 200 has its line on the axis; with the default it does not.
    const [bareLow, bareHigh] = dataDomain([100, 200], { pad: 0 })
    const [paddedLow, paddedHigh] = dataDomain([100, 200])
    expect(paddedLow).toBeLessThan(bareLow)
    expect(paddedHigh).toBeGreaterThan(bareHigh)
  })

  it('keeps a side pinned to zero by `includeZero` at zero, not below it', () => {
    // `includeZero` exists for a quantity where zero is a real value rather
    // than an arbitrary floor, and a value that is real is not padded past.
    const [low] = dataDomain([4, 80], { includeZero: true })
    expect(low).toBe(0)
  })

  it('gives a flat series a window instead of a zero-height domain', () => {
    // The one documented exception to snapping, and it is an early return
    // rather than a path through the ladder: a series that never varies gets
    // 10% either side, because `[4.2, 4.2]` is an axis Recharts renders as an
    // empty plot. This is asserted so that the exception stays deliberate.
    const [low, high] = dataDomain([4.2, 4.2, 4.2], { pad: 0 })
    expect(low).toBeLessThan(4.2)
    expect(high).toBeGreaterThan(4.2)
    expect(dataDomain([0, 0, 0], { pad: 0 })).toEqual([-1, 1])
  })
})

/* ================================================================== *
 * 3. It snaps to the 1 / 2 / 2.5 / 5 ladder
 * ================================================================== */

describe('a domain step comes off the 1 / 2 / 2.5 / 5 ladder', () => {
  it('rounds every raw span up onto a rung, at every magnitude', () => {
    // The property, not a table: for a decade-by-decade sweep, whatever comes
    // out is `m * 10^n` with `m` on the ladder. A hand-maintained table of
    // expected steps would be edited every time a rung was retuned, and that
    // is how the real invariant gets lost.
    for (let exponent = -6; exponent <= 6; exponent += 0.05) {
      const decade = 10 ** exponent
      for (const multiple of [1, 1.2, 2, 2.3, 2.5, 3, 4.9, 5, 9.9]) {
        const raw = decade * multiple
        expect(onTheLadder(niceStep(raw)), `niceStep(${raw}) = ${niceStep(raw)}`).toBe(true)
      }
    }
  })

  it('never returns a step it cannot divide a real axis by', () => {
    // `niceStep` is total, and the total cases are the ones a sweep of real
    // spans never reaches: a non-finite or non-positive raw step is not a
    // step, and a caller that divided by the result would produce `NaN`.
    for (const raw of [0, -1, -0.0001, Number.NaN, Infinity, -Infinity]) {
      expect(onTheLadder(niceStep(raw)), `niceStep(${raw})`).toBe(true)
    }
  })

  it.each(SERIES.map((s) => [s.why, s.values] as const))(
    'puts both bounds on one ladder grid for %s',
    (_why, values) => {
      for (const ticks of TICKS) {
        for (const includeZero of [false, true]) {
          const [low, high] = dataDomain([values], { ticks, includeZero })
          const step = gridStep(low, high)
          // The failure this guards is a domain that hands Recharts raw data
          // bounds: `[-12.3456, 88.7654]` is on no grid at all, and the
          // symptom is a tick label like `413.27` that a reader cannot match
          // against the tooltip beside it.
          expect(step, `no ladder grid for [${low}, ${high}] at ${ticks} ticks`).not.toBeNull()
        }
      }
    },
  )
})

/* ================================================================== *
 * 4. Empty input
 * ================================================================== */

describe('a domain with nothing in it is still a drawable axis', () => {
  it('is [0, 1] for no input at all', () => {
    expect(dataDomain([])).toEqual([0, 1])
  })

  it('is [0, 1] when every input was non-finite', () => {
    // Same code path, different reason: a series that is all `NaN` reaches
    // `flat.length === 0` after filtering, not before. The two are the same
    // answer because the filter is what makes the count meaningful.
    expect(dataDomain([NaN, Infinity, -Infinity, NaN])).toEqual([0, 1])
  })

  it('is [0, 1] for an empty array of empty arrays', () => {
    expect(dataDomain([[], []])).toEqual([0, 1])
  })

  it('is [0, 1] whatever the options say', () => {
    // A caller asking for a zero-pinned axis on no data must not get a
    // degenerate one; the default exists so a chart with nothing to plot
    // still has two numbers to hand Recharts.
    expect(dataDomain([], { includeZero: true, ticks: 10, pad: 0.5 })).toEqual([0, 1])
  })
})

/* ================================================================== *
 * 5. The spread limit
 * ================================================================== */

describe('a domain survives a series longer than a spread can carry', () => {
  /**
   * The length that breaks it, measured rather than quoted.
   *
   * Measured on this repo's Node 22 (V8 12.4): `Math.min(...a)` over 124,000
   * numbers returns a number, and over 130,000 it throws
   * `RangeError: Maximum call stack size exceeded`. 200,000 is past the limit
   * with room to spare, so the test is a real guard rather than a probe that
   * happens to sit under the cap on this machine and over it on a reader's.
   */
  const BEYOND_THE_SPREAD_LIMIT = 200_000

  it('does not throw on a series that would blow the argument list', () => {
    const series = Array.from({ length: BEYOND_THE_SPREAD_LIMIT }, (_, i) => (i % 1000) + 1)
    // Proof the length is what it claims to be, so a future edit cannot
    // quietly shrink the array and leave the guard asserting nothing.
    expect(series).toHaveLength(BEYOND_THE_SPREAD_LIMIT)
    let domain: [number, number] = [0, 0]
    expect(() => {
      domain = dataDomain([series])
    }).not.toThrow()
    expect(domain[0]).toBeLessThanOrEqual(1)
    expect(domain[1]).toBeGreaterThanOrEqual(1000)
  })

  it('depends on the data\'s extent, not on how many points produced it', () => {
    // The control for the loop above, and the invariant a loop can break that
    // a spread cannot: a domain is a function of the minimum and the maximum,
    // so 100,000 points spanning `[1, 1000]` must give exactly what two points
    // spanning `[1, 1000]` give. A loop that sampled, or started from the
    // wrong element, or ran one short, would return a different domain — and a
    // hard-coded expected value would not catch it, because the wrong answer
    // would be just as stable.
    const min = 1
    const max = 1000
    const series = Array.from({ length: 100_000 }, (_, i) => {
      // The extremes appear exactly once each, at opposite ends, so a single
      // skipped element is enough to lose one of them.
      if (i === 0) return min
      if (i === 99_999) return max
      return 400 + ((i * 7919) % 100)
    })
    expect(dataDomain([series])).toEqual(dataDomain([[min, max]]))
  })
})
