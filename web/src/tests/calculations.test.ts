/**
 * ==================================================================
 * WHAT THIS FILE COVERS, AND WHAT IT DOES NOT. READ IT BEFORE TRUSTING IT.
 * ==================================================================
 *
 * Every export tested below is imported by a tool a reader opens, and the last
 * describe block is the test that keeps that true. That was not the case when
 * this file was written: it held nine tests, and five of them asserted
 * functions with NO product caller anywhere in `web/src`. The filenames and the
 * test names both promised coverage the assertions did not provide — there was
 * a test named "applies the Fisher equation" and the Fisher equation is
 * computed inline in `RealInterestRateCalculator` and asserted nowhere — so a
 * green run of this file was not evidence that the economics worked, and seven
 * wrong numbers shipped with it green.
 *
 * The four tests that asserted dead exports are GONE, and that is a reduction in
 * this file's count, not a regression. A test of a function no reader can reach
 * is not coverage; it is a claim about coverage, which is worse, because the
 * next agent reads the test name and stops looking. The four were:
 *
 *   "computes the multiplier from the MPC"            → `calculateMultiplier`
 *   "computes goods-market equilibrium output"         → `calculateEquilibriumOutput`
 *   "applies the Fisher equation"                      → `calculateRealInterestRate`
 *   "maps unemployment above the natural rate to lower inflation"
 *                                                      → `calculateInflationFromPhillipsCurve`
 *
 * The functions went with them. `RealInterestRateCalculator` and
 * `RealInterestRate` each compute their own real rate next to the sliders that
 * drive it, which is the right home for a formula only one place needs.
 *
 * WHAT THIS FILE STILL CANNOT DO: assert a number a READER SEES. Everything
 * here is a pure function, called directly. Whether the tile shows the number
 * the model computed is a separate question with a separate answer, and the
 * file that answers it is `tests/modelValues.test.tsx` — mount the tool, read
 * the DOM. `tests/solowWiring.test.tsx` holds the same promise for one tool
 * over a table of states. If you are about to assert that a tool prints the
 * right number, that is the file to open, not this one.
 *
 * WHAT LIVES WHERE NOW. `lib/calculations.ts` holds a formula only when TWO
 * places compute it and the two have to keep agreeing: the bond present value
 * (`AssetPricing`, `CrisisSvb`), the Solow steady state (`SolowSimulator`), the
 * multiplier round table (`MultiplicerSimulator`) and `formatNumber`. Each tool
 * otherwise owns its own model, written beside the controls that drive it. The
 * two describe blocks at the end of this file are what hold that arrangement in
 * place, because the failure it prevents is invisible from the inside: a
 * fourteenth export nobody imports, or a fifth written-out copy of an
 * expression that four places have to agree on.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as calculations from '../lib/calculations'
import {
  calculateBondPrice,
  calculateSolowSteadyState,
  formatNumber,
  generateMultiplierRounds,
} from '../lib/calculations'

const SRC = join(__dirname, '..')
const TOOLS = join(SRC, 'tools')

/* ================================================================== *
 * 1. The bond present value — AssetPricing and CrisisSvb
 * ================================================================== */

describe('calculateBondPrice: the present value both bond tools print', () => {
  /**
   * PAR IS THE IDENTITY, not a convenient number. A bond whose coupon rate
   * equals the discount rate is worth exactly its face value, because the
   * coupons plus the principal are the cash flows a par bond was written
   * against. That is AssetPricing's own opening state — coupon 5%, ten years,
   * discount rate 5% — and its "Bond Price" tile reads 100.00.
   *
   * This is the assertion that catches a unit slip in either direction. A
   * caller that passed 5 where the function wanted 0.05 discounts at 500% and
   * prices the same bond at 12.79; one that passed 0.05 where it wanted 5
   * discounts at 0.005% and gets 114.53. Neither is a subtle wrong answer —
   * both are the right shape and a different number.
   */
  it('prices a coupon bond at par when the coupon rate equals the discount rate', () => {
    expect(calculateBondPrice(5, 10, 5)).toBeCloseTo(100, 2)
  })

  /**
   * The direction, which is the thing the two tools are FOR. `AssetPricing`
   * sweeps the discount rate 0 to 10 and its whole chart is the claim that bond
   * prices fall as the rate rises; `CrisisSvb`'s case study is that a rate hike
   * destroyed SVB's bond portfolio. A formula that returned a rising price would
   * satisfy the par identity at exactly one point and invert both stories, and
   * neither of the two assertions above would notice.
   */
  it('falls below par above the coupon rate and rises above it below', () => {
    // 5% coupon. Discounting at 10 leaves the coupons worth less than they pay,
    // so the bond is worth less than 100; discounting at 2 leaves them worth
    // more, and the bond is worth more than 100.
    expect(calculateBondPrice(5, 10, 10)).toBeLessThan(100)
    expect(calculateBondPrice(5, 10, 2)).toBeGreaterThan(100)
  })

  /**
   * The two tools' own opening states, as the strings their tiles print. The
   * parameter sets are written in the call rather than read from a `DEFAULTS`
   * record, because a test that imported the tool's defaults would assert that
   * the tool agrees with itself.
   *
   *   AssetPricing  coupon 5,  10 years, r 5  →  100.00  (its par bond)
   *   CrisisSvb     coupon 1.5, 10 years, r 5 →   72.97  (the SVB portfolio)
   *
   * The second is the number the whole SVB case study turns on: a portfolio of
   * long 1.5% bonds is worth 72.97 on 100 of face once the market rate is 5%,
   * which is a 27.03 loss. If the extraction had changed the units, the coupon
   * would have been read as a payment rather than a rate on the face, and this
   * is the assertion that says it was not.
   */
  it('is the number both tools print at their own defaults', () => {
    expect(calculateBondPrice(5, 10, 5).toFixed(2)).toBe('100.00')
    expect(calculateBondPrice(1.5, 10, 5).toFixed(2)).toBe('72.97')
  })

  /**
   * r = 0, WHERE THE ANNUITY IS 0 OVER 0.
   *
   * `C·[1 − (1+r)⁻ⁿ] / r` is `0/0` at r = 0: the bracket is exactly zero and so
   * is the divisor. `.toFixed(2)` turns that into the string `"NaN"`, so the
   * tile reads NaN and nothing throws. A bond is NOT undefined at a zero
   * discount rate the way a Gordon price is undefined at r ≤ g — nothing is
   * discounted, so the value is the undiscounted sum C·n + FV, which is the
   * limit of the formula as r → 0+. That is the model's own answer, and it is
   * the one both tools now get from one place.
   *
   * BOTH CALLERS CAN REACH IT, which is the reason the guard had to travel with
   * the formula rather than staying in `AssetPricing` where it was written:
   * AssetPricing's 0–10 sweep begins at 0 at every parameter set, and
   * CrisisSvb's Federal Funds Rate slider has `min={0}`. Before the extraction
   * the guard was in one tool and the identical unguarded formula was in the
   * other, so `/tool/crisis-svb` showed a reader `Bond Value: NaN` and
   * `Portfolio Loss: NaN %` the moment they parked the fed rate on zero. The
   * end-to-end half of this is in `modelValues.test.tsx`, mounted through the
   * real page.
   */
  it('values the bond at a zero discount rate, where the annuity is 0 over 0', () => {
    expect(calculateBondPrice(5, 10, 0)).toBe(150) // 5·10 + 100
    expect(calculateBondPrice(1.5, 10, 0)).toBe(115) // 1.5·10 + 100
  })

  /**
   * THE COUPON IS A RATE ON THE FACE, NOT THE ANNUAL PAYMENT.
   *
   * Both tools' sliders are labelled "Bond Coupon Rate" with `unit="%"`, and
   * both wrote the slider's value straight into the annuity as the dollar
   * payment. At a face of 100 those are the same number, so it was right by
   * coincidence of the face value rather than by the arithmetic; a face of 1000
   * would have made every coupon ten times too small. `couponPercent / 100 ×
   * faceValue` states which is which, and this is the assertion that would go
   * red if someone reverted to passing the rate as the payment.
   */
  it('reads the coupon as a rate on the face value rather than as the payment', () => {
    // A 5% coupon on a 1000 par pays 50 a year, so at par it is worth 1000 —
    // not 100. Passing the rate in as the payment would give 500.
    expect(calculateBondPrice(5, 10, 5, 1000)).toBeCloseTo(1000, 6)
  })
})

/* ================================================================== *
 * 2. The Solow steady state — SolowSimulator
 * ================================================================== */

describe('calculateSolowSteadyState: the steady state SolowSimulator prints', () => {
  /**
   * ONE ROW PER STATE THE SCENARIO BUTTONS CAN PRODUCE.
   *
   * The tool prints k* in four places that used to be two written-out copies of
   * the same expression: the headline tile, the Base card beside it, and the two
   * fixed reference cards. `solowWiring.test.tsx` asserts that what the page
   * prints is what the model ran on, recomputing the model from the values THE
   * SLIDERS ARE SHOWING; this table pins the arithmetic itself, so the two
   * halves cannot each be right about different numbers. The last two rows are
   * the reference cards' own parameters, which are literals in the tool and not
   * the reader's settings.
   */
  const STATES: [what: string, s: number, n: number, d: number, a: number, k: number][] = [
    ['the tool defaults', 0.2, 0.02, 0.05, 0.3, 4.48],
    ['the High Savings card', 0.35, 0.02, 0.05, 0.3, 9.97],
    ['the Low Growth card', 0.2, 0.01, 0.05, 0.3, 5.58],
    ['a high capital share', 0.2, 0.02, 0.05, 0.4, 5.75],
  ]

  it.each(STATES)('is (s/(n+δ))^(1/(1−α)) at %s', (_what, s, n, d, a, k) => {
    expect(calculateSolowSteadyState(s, n, d, a)).toBeCloseTo(k, 2)
  })

  /**
   * THE MODEL'S OWN DEFINITION, which no literal can substitute for.
   *
   * The Solow diagram on that page draws investment `s·k^α` and break-even
   * investment `(n+δ)·k` and says the steady state is where they CROSS. So the
   * identity is `s·y* = (n+δ)·k*` with `y* = k*^α` — and it holds only for the
   * right exponent. A formula that computed `(s/(n+δ))^(1/α)`, or used δ where
   * the model uses n+δ, or inverted the exponent, still returns a positive
   * number and would pass a "is it greater than zero" test; it would not
   * intersect the other line on the chart beside it. This is asserted across a
   * table rather than at the defaults so that a formula cannot be right at one
   * parameter set and wrong at the next.
   */
  it.each(STATES)('is the capital stock where investment covers break-even at %s', (_w, s, n, d, a) => {
    const k = calculateSolowSteadyState(s, n, d, a)
    const y = Math.pow(k, a)
    expect(s * y).toBeCloseTo((n + d) * k, 6)
  })

  /**
   * THE THREE COMPARISONS THAT TOOL'S OWN CAPTION MAKES, stated as directions
   * so they survive a retune that moves both sides. One parameter at a time,
   * because a test that moved all of them at once would pass if only one were
   * wired.
   *
   * The caption under the scenario cards says higher savings raises k* and y*,
   * that lower population growth raises both, and (by naming depreciation in the
   * `Depreciation ((n+δ)k)` legend) that it enters the break-even term. All
   * three are checked here, and so is the half the caption keeps repeating —
   * that k* and y* move TOGETHER, which holds unconditionally because
   * y* = k*^α is increasing in k* for every α > 0.
   *
   * The capital share is deliberately NOT asserted, and the reason is worth
   * recording rather than papering over. k* = (s/(n+δ))^(1/(1−α)) has a base
   * that the reader can move either side of 1: at s = 0.2, δ = 0.05, n = 0.02
   * the base is 2.86 and a higher α RAISES k* (4.48 → 5.75); at s = 0.1,
   * δ = 0.1, n = 0.05 it is 0.67 and a higher α LOWERS it. Both endpoints are
   * inside that tool's own slider ranges. So there is no single direction to
   * assert, and an α row above states the model's real behaviour rather than a
   * simplification of it.
   */
  it('moves the way the tool\'s captions say it does', () => {
    const base = { s: 0.2, n: 0.02, d: 0.05, a: 0.3 }
    const at = (over: Partial<typeof base>) => {
      const { s, n, d, a } = { ...base, ...over }
      const k = calculateSolowSteadyState(s, n, d, a)
      return { k, y: Math.pow(k, a) }
    }
    expect(at({ s: 0.35 }).k).toBeGreaterThan(at({}).k)
    expect(at({ n: 0.01 }).k).toBeGreaterThan(at({}).k)
    expect(at({ d: 0.1 }).k).toBeLessThan(at({}).k)
    // k* and y* together, which is the pairing the caption keeps asserting.
    expect(at({ s: 0.35 }).y).toBeGreaterThan(at({}).y)
    expect(at({ n: 0.01 }).y).toBeGreaterThan(at({}).y)
  })
})

/* ================================================================== *
 * 3. The multiplier round table — MultiplicerSimulator
 * ================================================================== */

describe('generateMultiplierRounds: the table MultiplicerSimulator prints', () => {
  /**
   * Unchanged from before, and still live: `MultiplicerSimulator` imports this
   * for its round-by-round chart and its table. The claim is the geometric sum's
   * limit, `ΔY → initialShock / (1 − mpc)`, approached from below — a cascade
   * that converged on something else, or that was cumulative from the first
   * round, would satisfy neither end.
   */
  it('accumulates multiplier rounds toward the multiplier limit', () => {
    const rounds = generateMultiplierRounds(1, 0.5, 40)
    expect(rounds[0].change).toBeCloseTo(1)
    expect(rounds[rounds.length - 1].cumulative).toBeCloseTo(2, 2)
  })
})

/* ================================================================== *
 * 4. formatNumber — the string two tools read every number through
 * ================================================================== */

describe('formatNumber: the string a number becomes before a reader sees it', () => {
  it('formats with fixed decimals and thousands separators', () => {
    expect(formatNumber(1234.5)).toBe('1,234.50')
    expect(formatNumber(100, 0)).toBe('100')
    expect(formatNumber(-0.5, 1)).toBe('-0.5')
  })

  /**
   * ITEM 22. `NaN.toLocaleString()` is the string `"NaN"` and
   * `Infinity.toLocaleString()` is `"∞"`, and every caller hands this function's
   * result straight to a `StatBox` or a chart tooltip — so a division by zero
   * anywhere upstream reached a reader as a number-shaped claim with no error
   * logged and nothing on the page to notice. The three values below are the
   * whole non-finite domain: `NaN` from a bad division, `Infinity` from
   * dividing by zero or a diverging model (a Gordon price at r ≤ g is the live
   * example), and `-Infinity` from the same with a sign.
   *
   * `—` is the mark `AssetPricing` and `SpeculativeAttack` already print for a
   * quantity the model has no value for, so the site has one glyph for "there
   * is no number here". Not `0`: a substituted zero is a specific and wrong
   * claim about a quantity, printed to two decimals as though it were measured.
   */
  it('prints a dash for a value that is not a number, not the words NaN or ∞', () => {
    expect(formatNumber(Number.NaN)).toBe('—')
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('—')
    expect(formatNumber(Number.NEGATIVE_INFINITY)).toBe('—')
  })

  /**
   * The same claim as a PROPERTY rather than a list of three, because the list
   * cannot notice a fourth kind of non-finite input and neither can it notice a
   * future edit that reintroduces one. `0` and a large finite value are in the
   * domain on purpose: a guard written as `if (num)` would swallow them, and a
   * guard written as `num < 1e21` would mangle the last of them.
   */
  it('never returns a number-shaped string for a value that is not a number', () => {
    for (const value of [Number.NaN, Infinity, -Infinity, 0, -0.5, 1e21, -1e21]) {
      const shown = formatNumber(value)
      expect(shown, `formatNumber(${value})`).not.toMatch(/NaN|∞/)
      // Either the dash or a well-formed fixed-decimal number: nothing else is
      // an acceptable thing for this function to hand a stat tile.
      expect(shown, `formatNumber(${value})`).toMatch(/^(—|-?[\d,]+(?:\.\d+)?)$/)
    }
  })
})

/* ================================================================== *
 * 5. One formula, one copy
 *
 * The four blocks above can all be green while the repository is back where it
 * started: a tool that writes the bond annuity out inline passes every
 * assertion above, because none of them looks at the tools. These blocks are
 * the ones that fail.
 * ================================================================== */

/**
 * Source with its COMMENTS removed, and its string literals left intact.
 *
 * Comments have to go because several of these assertions are about what a file
 * COMPUTES, and a comment naming the same expression — `SolowSimulator`'s
 * "(s/δ)^(1/(1-α)) = 7.25" note about the dilution, for instance — is
 * documentation rather than a second copy of the formula. A naive `//` strip
 * would also eat the `//` inside a URL string, so the scanner consumes strings
 * as units and leaves what is inside them alone.
 */
function code(file: string): string {
  const source = readFileSync(file, 'utf8')
  let out = ''
  let i = 0
  while (i < source.length) {
    const two = source.slice(i, i + 2)
    if (two === '//') {
      while (i < source.length && source[i] !== '\n') i++
      continue
    }
    if (two === '/*') {
      i += 2
      while (i < source.length && source.slice(i, i + 2) !== '*/') i++
      i += 2
      continue
    }
    const char = source[i]
    if (char === "'" || char === '"' || char === '`') {
      out += char
      i++
      while (i < source.length && source[i] !== char) {
        if (source[i] === '\\') {
          out += source[i]
          i++
        }
        out += source[i]
        i++
      }
      out += source[i] ?? ''
      i++
      continue
    }
    out += char
    i++
  }
  return out
}

/** Every `.ts`/`.tsx` under `dir`, recursively. */
function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.tsx?$/.test(entry.name) ? [path] : []
  })
}

/**
 * `true` when the source imports `name` from `lib/calculations`.
 *
 * A named import only. A namespace or default import from that module would be
 * a miss, and a miss is the dangerous direction here — it would read as "no
 * caller" — so the form the repository uses is asserted positively by the tests
 * below rather than assumed to be the only one that works.
 */
function imports(source: string, name: string): boolean {
  const bindings = source.match(
    /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"][^'"]*lib\/calculations['"]/g,
  )
  if (!bindings) return false
  return bindings.some((statement) =>
    statement
      .slice(statement.indexOf('{') + 1, statement.indexOf('}'))
      .split(',')
      .some((part) => {
        const bound = part.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0]
        return bound === name
      }),
  )
}

describe('the formulas in lib/calculations.ts are the ones the tools use', () => {
  it('has both bond tools import the bond price rather than each write its own', () => {
    for (const file of ['AssetPricing.tsx', 'CrisisSvb.tsx']) {
      const source = code(join(TOOLS, file))
      expect(imports(source, 'calculateBondPrice'), `${file} does not import it`).toBe(true)
      // A second local definition under either name: the two tools called it
      // `calculateBondPrice` and `calculateBondValue` respectively, and a
      // rename is how a duplicate hides from a scan that looked for one name.
      expect(source, `${file} declares its own bond price`).not.toMatch(
        /(?:const|function)\s+calculateBond(?:Price|Value)\b/,
      )
      // The annuity itself, written out. `Math.pow(1 + …)` is a discounted
      // power term, and discounting a cash flow is what this one formula is
      // for, so a tool that evaluates one has re-derived it.
      expect(source, `${file} writes the discounted-power term itself`).not.toMatch(
        /Math\.pow\(\s*1\s*\+/,
      )
    }
  })

  it('has the Solow tool import the steady state rather than write it out twice', () => {
    const source = code(join(TOOLS, 'SolowSimulator.tsx'))
    expect(imports(source, 'calculateSolowSteadyState')).toBe(true)
    expect(source).not.toMatch(/(?:const|function)\s+calculateSolowSteadyState\b/)
    // `(s/(n+δ))^(1/(1−α))` is the only expression in that tool whose BASE is a
    // ratio — every other `Math.pow` there takes a single capital stock, and
    // `y = k^α` is a one-token production function rather than a formula worth
    // sharing. So a power of a ratio is the shape of a written-out steady state.
    expect(source).not.toMatch(/Math\.pow\(\s*[\w.]+\s*\/\s*\(/)
  })

  /**
   * THE WHOLE POINT OF THE FILE, as one property: every export has a product
   * caller. Eleven of the thirteen it used to hold had none, and a dead export
   * is not a small thing — it is a function someone will read, believe, and
   * assume is exercised.
   *
   * Scoped to `web/src` minus `tests/`, which is the survey's scope and the
   * right one: the question is whether a READER can reach the function, and a
   * test is not a reader. If an import ever appears outside `web/src` this
   * would need widening, and the failure mode of forgetting is one red test.
   */
  it('has no export without a product caller', () => {
    const product = walk(SRC)
      .filter((file) => !file.includes(`${join('src', 'tests')}`))
      .map((file) => code(file))
    const orphans = Object.keys(calculations).filter(
      (name) => !product.some((source) => imports(source, name)),
    )
    expect(
      orphans,
      'these exports are reachable from no tool or page. Either a tool should ' +
        'call one, or it should be deleted: a formula only two places need ' +
        'belongs in lib/calculations.ts, and a formula only zero places need ' +
        'belongs nowhere.',
    ).toEqual([])
  })

  /**
   * The scan above, shown to be able to return a MISS as well as a hit, so
   * "no orphans" is read as "it looked and found nothing" rather than as "the
   * loop cannot fire". A positive and a negative on the same scan: the name
   * that IS imported by two tools, and one that was exported here until it was
   * deleted for carrying an unstated unit, and is imported by nothing because
   * it no longer exists.
   */
  it('would report an export that nothing imports', () => {
    const product = walk(SRC)
      .filter((file) => !file.includes(`${join('src', 'tests')}`))
      .map((file) => code(file))
    const called = (name: string) => product.some((source) => imports(source, name))
    expect(called('calculateBondPrice')).toBe(true)
    expect(called('calculateSolowSteadyState')).toBe(true)
    expect(called('calculateAggregateSupply')).toBe(false)
  })
})
