/**
 * SolowSimulator: what the page prints is what the model ran on.
 * ============================================================================
 * READ `modelValues.test.tsx` AND `modelAssertions.ts` FIRST. This file uses
 * the same harness and the same three rules, and inherits the same one limit:
 * jsdom has no layout, so `ResponsiveContainer` gets no size, Recharts draws no
 * plot, and a curve is an SVG `<path>` with no text in it. Every assertion
 * below is therefore on a READOUT — a stat tile, a control's printed value, a
 * scenario card, a caption — which is the number a reader reads.
 *
 * WHAT THIS FILE HOLDS THAT `modelValues.test.tsx` DOES NOT
 *   1. THE INVARIANT, OVER A TABLE OF PRESETS. The two tests in that file pin
 *      one preset and one number. This file states the property: at every state
 *      the buttons can produce, every quantity a reader can read that names a
 *      model input equals the value the model actually used — and it checks
 *      that by recomputing the model from the parameter values THE SLIDERS ARE
 *      SHOWING and comparing, so a row cannot pass by matching a literal that
 *      happens to be what the tool prints today. Adding a preset to the table
 *      adds a row; changing the model changes every row.
 *   2. THE CONTROL A PRESET HAS OVERRIDDEN. The survey's inert-slider defect
 *      was that a preset substituted its own value for the model's, so a
 *      slider the preset owned wrote state nothing read. This tool now writes
 *      the preset THROUGH to the sliders, and the test that pins that is the
 *      one that would have failed before: move the slider and watch the page
 *      change. Asserting the preset is inert would have passed on the old code
 *      for the wrong reason, so this file asserts the opposite choice
 *      explicitly — including that the input is not disabled.
 *   3. THE "Base" SCENARIO CARD, WHICH WAS INVISIBLE AT THE DEFAULTS. Three
 *      cards were derived from literals, and the base card coincided with k*
 *      on first paint, so the defect only appeared after a drag. Every
 *      assertion about the base card here is made AFTER a slider has moved.
 */
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { openTool, type MountedTool } from './modelAssertions'

/* ------------------------------------------------------------------ *
 * Reading what a reader reads
 * ------------------------------------------------------------------ */

/** The first captured number in `text`, or a thrown error naming the pattern. */
function numberFrom(text: string, pattern: RegExp): number {
  const match = pattern.exec(text)
  if (!match) throw new Error(`no number matching ${String(pattern)} in "${text}"`)
  return Number.parseFloat(match[1])
}

/** The number a readout prints, with its unit stripped off. */
function printedNumber(readout: string, what: string): number {
  const parsed = Number.parseFloat(readout)
  if (Number.isNaN(parsed)) throw new Error(`${what} reads "${readout}", which is not a number`)
  return parsed
}

/**
 * The three card titles, as whole-title patterns.
 *
 * A looser one such as `/^High Savings/` matches two elements on the page —
 * this card and the preset button above it — and `getByText` throws on more
 * than one match. Spelling out the "— fixed" is the fix for that, and it has
 * the useful side effect of pinning the label that tells the reader which cards
 * answer to the sliders.
 */
const BASE_CARD = /^Base — your settings/
const HIGH_SAVINGS_CARD = /^High Savings \(s=[\d.]+\) — fixed$/
const LOW_GROWTH_CARD = /^Low Growth \(n=[\d.]+\) — fixed$/

function cardElement(title: RegExp): HTMLElement {
  const heading = screen.getByText(title)
  const card = heading.closest<HTMLElement>('.stat-tile')
  if (!card) throw new Error(`"${heading.textContent}" is not inside a scenario card`)
  return card
}

/**
 * One line of a scenario card: the child element whose own text starts with
 * `prefix`.
 *
 * Read per line rather than off the card's `textContent`, because JSX drops
 * the whitespace between sibling elements — the card's text runs
 * "α = 0.35Steady State k*: 4.09" — so a substring assertion across two lines
 * depends on a space the source does not contain. Throwing on a missing line is
 * what keeps a renamed readout from passing as an absent one.
 */
function cardLine(title: RegExp, prefix: string): string {
  const card = cardElement(title)
  const line = [...card.children]
    .map((child) => (child.textContent ?? '').replace(/\s+/g, ' ').trim())
    .find((text) => text.startsWith(prefix))
  if (!line) {
    throw new Error(
      `no "${prefix}…" line on the card "${card.textContent}"; it has ` +
        `${card.children.length} lines: ${[...card.children]
          .map((child) => `"${(child.textContent ?? '').trim()}"`)
          .join(', ')}`,
    )
  }
  return line
}

/** The whole card, one line per element, for "does it say fixed" assertions. */
function cardTitled(title: RegExp): string {
  return [...cardElement(title).children]
    .map((child) => (child.textContent ?? '').replace(/\s+/g, ' ').trim())
    .join(' | ')
}

/** The k* a scenario card prints. */
function cardK(title: RegExp): number {
  return numberFrom(cardLine(title, 'Steady State k*:'), /([\d.]+)$/)
}

/** The y* a scenario card prints. */
function cardY(title: RegExp): number {
  return numberFrom(cardLine(title, 'Steady State y*:'), /([\d.]+)$/)
}

/** The parameter line a scenario card prints, e.g. `s = 0.20, n = 0.020, …`. */
function cardParameters(title: RegExp): string {
  return cardLine(title, 's = ')
}

/** The variant class the scenario buttons use to show which one is selected. */
function selectedPreset(name: string): string {
  return screen.getByRole('button', { name }).className
}

/**
 * The five model inputs, read from the control the reader steers by.
 *
 * The printed string, not an internal value: the claim being tested is that
 * what the slider SHOWS is what the model USED, so the test has to start from
 * the printed number or it is asserting the model against itself.
 */
function inputs(tool: MountedTool) {
  return {
    s: printedNumber(tool.control('Savings Rate (s)'), 'Savings Rate (s)'),
    n: printedNumber(tool.control('Population Growth (n)'), 'Population Growth (n)'),
    d: printedNumber(tool.control('Depreciation Rate (δ)'), 'Depreciation Rate (δ)'),
    alpha: printedNumber(tool.control('Capital Share (α)'), 'Capital Share (α)'),
    k0: printedNumber(tool.control('Initial Capital per Worker (k₀)'), 'k₀'),
  }
}

/** The Solow steady state, from the printed inputs. `k* = (s/(n+δ))^(1/(1-α))`. */
function steadyState({ s, n, d, alpha }: ReturnType<typeof inputs>) {
  const k = Math.pow(s / (n + d), 1 / (1 - alpha))
  return { k, y: Math.pow(k, alpha), c: (1 - s) * Math.pow(k, alpha), i: s * Math.pow(k, alpha) }
}

/**
 * The years the path takes to reach 90% of k*, computed the way the tool
 * computes it: `k(t+1) = (s·k^α + (1-δ)·k) / (1 + n)`.
 *
 * This re-derivation is the one place in the file that duplicates the model,
 * and it is here for a stated reason. The reader consequence of the recursion
 * is a chart, and a chart cannot be asserted here; the tile "Time to 90%
 * Convergence" is the one readout a reader can read that the path produces, so
 * pinning it to the loop the chart draws is what keeps the two together. The
 * `(1 + n)` divisor is the whole point: with it missing the loop reports 23
 * years at the defaults and the curve it is supposed to describe flattens at
 * k = 7.25, which is not the k* = 4.48 the tiles beside it report.
 */
function yearsToNinetyPercent({ s, n, d, alpha, k0 }: ReturnType<typeof inputs>, kStar: number) {
  let k = k0
  let years = 0
  while (k < 0.9 * kStar && years < 1000) {
    k = (s * Math.pow(k, alpha) + (1 - d) * k) / (1 + n)
    years += 1
  }
  return years
}

/* ------------------------------------------------------------------ *
 * 1. The invariant, over a table of presets
 * ------------------------------------------------------------------ */

/**
 * One row per state the scenario buttons can produce, and the two inputs that
 * row expects the sliders to be showing afterwards.
 *
 * The `s` and `n` are written here rather than imported from the tool: a test
 * that imported the preset table would assert that the tool agrees with itself.
 * The button NAMES are the reader-visible contract, and the numbers are the
 * model's, so a retune that moves either one has to change this table — which
 * is the point of a table rather than three hand-written expectations.
 */
const PRESETS: [button: string, s: number, n: number][] = [
  ['Custom Parameters', 0.2, 0.02],
  ['High Savings (s=0.35)', 0.35, 0.02],
  ['Low Growth (n=0.01)', 0.2, 0.01],
]

describe('SolowSimulator: at every preset, what the page prints is what the model ran on', () => {
  it.each(PRESETS)('%s: every readout equals the model run on the printed inputs', async (button, s, n) => {
    const tool = await openTool('solow-simulator')
    await tool.click(button)

    // The preset landed, and the sliders the reader steers by are showing the
    // parameters the row expects. Without this, a button that did nothing would
    // satisfy every assertion below on the tool's own defaults.
    expect(printedNumber(tool.control('Savings Rate (s)'), 's')).toBeCloseTo(s, 2)
    expect(printedNumber(tool.control('Population Growth (n)'), 'n')).toBeCloseTo(n, 3)

    const p = inputs(tool)
    const model = steadyState(p)

    // The two headline tiles. `toBeCloseTo` at the tile's own precision rather
    // than an exact string, so a legitimate retune that moves a digit on both
    // sides does not fail, and a value that is wrong in the second decimal
    // does.
    expect(printedNumber(tool.stat('Steady State k*'), 'k*')).toBeCloseTo(model.k, 2)
    expect(printedNumber(tool.stat('Steady State y*'), 'y*')).toBeCloseTo(model.y, 3)
    expect(printedNumber(tool.stat('Consumption per Worker (c*)'), 'c*')).toBeCloseTo(model.c, 3)
    expect(printedNumber(tool.stat('Investment per Worker (i*)'), 'i*')).toBeCloseTo(model.i, 3)

    // The identity this tool exists to demonstrate, as a string: the tile is a
    // percentage with a unit, and the unit is part of what the reader reads.
    // n comes from the row above, in the same expression.
    expect(tool.stat('Steady State Total Output Growth (n)')).toBe(`${(n * 100).toFixed(2)} %`)

    // …and the same identity in prose. A tile that is right beside a sentence
    // quoting a different number is the defect this file was written for, and
    // prose is the half a stat-tile assertion cannot reach.
    expect(tool.text(/The steady-state growth rate equals the population growth rate/)).toContain(
      `(n = ${(n * 100).toFixed(2)}%)`,
    )

    // The time path, as far as jsdom can see it: the years on the tile are the
    // years the recursion the chart draws takes, and the caption under that
    // chart names the same number and the same k* as the tiles above it.
    const years = yearsToNinetyPercent(p, model.k)
    expect(tool.stat('Time to 90% Convergence')).toBe(`${years} years`)
    const pathCaption = tool.text(/reaches 90% of steady state in/)
    expect(pathCaption).toContain(`in ${years} years`)
    expect(pathCaption).toContain(`k* = ${model.k.toFixed(2)}`)
    expect(pathCaption).toContain(`y* = ${model.y.toFixed(3)}`)

    // The Solow diagram's caption quotes the same k* the tile does. These are
    // two hand-written strings, and nothing but this assertion connects them.
    expect(tool.text(/Steady state k\* = /)).toContain(`Steady state k* = ${model.k.toFixed(2)}`)
  })

  it('names every model input on the scenario card it built them from', async () => {
    // The cards print k* and y* without saying which parameters produced them.
    // With the base card derived from the live controls, that is the difference
    // between "a comparison" and "three numbers"; the line of parameters on
    // each card is what makes the comparison readable, and this is what holds
    // it there.
    const tool = await openTool('solow-simulator')
    await tool.set({ 'Capital Share (α)': 0.35, 'Population Growth (n)': 0.03 })
    const p = inputs(tool)
    expect(cardParameters(BASE_CARD)).toBe(
      `s = ${p.s.toFixed(2)}, n = ${p.n.toFixed(3)}, δ = ${p.d.toFixed(2)}, α = ${p.alpha.toFixed(2)}`,
    )
    // …and each fixed card names the parameters IT was computed from, which are
    // the reference baseline and not the reader's settings.
    expect(cardParameters(HIGH_SAVINGS_CARD)).toBe('s = 0.35, n = 0.020, δ = 0.05, α = 0.30')
    expect(cardParameters(LOW_GROWTH_CARD)).toBe('s = 0.20, n = 0.010, δ = 0.05, α = 0.30')
  })
})

/* ------------------------------------------------------------------ *
 * 2. A preset writes through; it does not shadow a slider
 * ------------------------------------------------------------------ */

describe('SolowSimulator: a preset is a set of slider positions, not a shadow copy', () => {
  it('writes the preset through to the slider it sets', async () => {
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    // The control the reader steers by now reads the preset's value. The old
    // design reached this too — the slider was handed `activeN` — so this
    // assertion is necessary but not sufficient; the two below are the ones
    // that would have failed.
    expect(tool.control('Population Growth (n)')).toBe('0.010')
    expect(tool.stat('Steady State Total Output Growth (n)')).toBe('1.00 %')
  })

  it('lets a slider a preset has set still drive the model', async () => {
    // THE assertion for the inert-slider defect. The old code substituted the
    // preset's value for the model's, so under Low Growth this write landed in
    // `populationGrowth`, which nothing read: the control moved, `dirty` went
    // true, and the page printed exactly the same numbers. Today the tile
    // follows the control.
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    await tool.set({ 'Population Growth (n)': 0.03 })
    expect(tool.control('Population Growth (n)')).toBe('0.030')
    expect(tool.stat('Steady State Total Output Growth (n)')).toBe('3.00 %')
    // k* moves with it, so this is not one tile catching up with another: at
    // s = 0.2, δ = 0.05, α = 0.3, n = 0.03 gives (0.2/0.08)^(1/0.7) = 3.70.
    expect(tool.stat('Steady State k*')).toBe('3.70')
  })

  it('leaves the control enabled, because a preset does not disable it', async () => {
    // The alternative fix was to disable the slider a preset owns. Whichever a
    // tool chooses, the control has to say which — a disabled input would be
    // announced as unavailable, and this asserts the choice is the other one
    // rather than leaving it to be discovered.
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    const slider = screen.getByLabelText('Population Growth (n)')
    expect(slider).not.toBeDisabled()
    expect(slider).not.toHaveAttribute('aria-disabled')
  })

  it('stops claiming the preset once the reader has driven a slider', async () => {
    // A preset button that keeps its selected treatment above a hand-edited
    // page is the same class of lie as the tile: a label naming a state the
    // page is not in. The buttons show selection with `variant`, and the
    // selected one is `button-primary`.
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    expect(selectedPreset('Low Growth (n=0.01)')).toContain('button-primary')
    await tool.set({ 'Population Growth (n)': 0.03 })
    expect(selectedPreset('Low Growth (n=0.01)')).toContain('button-secondary')
    expect(selectedPreset('Custom Parameters')).toContain('button-primary')
  })

  it('lets Reset undo a preset, and returns the page to Custom', async () => {
    // A preset sets controls, so Reset is live the moment one is applied —
    // `useToolReset` derives `dirty` by comparing the state against DEFAULTS,
    // and the preset's write-through is a real difference in that state. Reset
    // restores the sliders AND the mode, so the two do not fight: the preset
    // writes values, Reset writes the opening values, and the page ends where
    // it opened rather than with a mode naming a set of parameters it no longer
    // holds.
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    await tool.click('High Savings (s=0.35)')
    await tool.click('Reset to defaults')
    expect(tool.control('Population Growth (n)')).toBe('0.020')
    expect(tool.control('Savings Rate (s)')).toBe('0.20')
    expect(tool.stat('Steady State Total Output Growth (n)')).toBe('2.00 %')
    expect(selectedPreset('Custom Parameters')).toContain('button-primary')
    expect(selectedPreset('High Savings (s=0.35)')).toContain('button-secondary')
  })
})

/* ------------------------------------------------------------------ *
 * 3. The scenario cards
 * ------------------------------------------------------------------ */

describe('SolowSimulator: the Base scenario card follows the sliders', () => {
  it('prints the same k* as the tile, before and after a slider moves', async () => {
    // The reason this needed a test: at the tool's own defaults the base card
    // was computed from the same literals the tool defaulted to, so it
    // coincided with k* and the defect was invisible on first paint. The
    // assertion that carries it is the one made after a move.
    const tool = await openTool('solow-simulator')
    expect(cardK(BASE_CARD)).toBeCloseTo(printedNumber(tool.stat('Steady State k*'), 'k*'), 2)
    await tool.set({ 'Savings Rate (s)': 0.35 })
    // 9.97 = (0.35/0.07)^(1/0.7). The old card printed 4.48 here, unchanged
    // from the defaults, beside a tile reading 9.97.
    expect(cardK(BASE_CARD)).toBeCloseTo(9.97, 2)
    expect(cardK(BASE_CARD)).toBeCloseTo(printedNumber(tool.stat('Steady State k*'), 'k*'), 2)
  })

  it('tracks every parameter the base card is built from, not only the savings rate', async () => {
    // The card is derived from all four of them, so a reader who moves the
    // depreciation or the capital share must see it move too. One parameter at
    // a time, because a change in all four at once would pass even if only one
    // of them were wired.
    for (const [control, value] of [
      ['Depreciation Rate (δ)', 0.09],
      ['Capital Share (α)', 0.4],
      ['Population Growth (n)', 0.045],
      ['Initial Capital per Worker (k₀)', 2.5],
    ] as [string, number][]) {
      const tool = await openTool('solow-simulator')
      const before = cardK(BASE_CARD)
      await tool.set({ [control]: value })
      const model = steadyState(inputs(tool))
      expect(cardK(BASE_CARD), `${control} → ${value}`).toBeCloseTo(model.k, 2)
      // k₀ changes the path, not the steady state, so that row is the one that
      // must NOT move: it is asserted as equal rather than as different.
      if (control !== 'Initial Capital per Worker (k₀)') {
        expect(cardK(BASE_CARD), `${control} → ${value}`).not.toBeCloseTo(before, 2)
      }
    }
  })

  it('leaves the two reference cards where they are, and says they are fixed', async () => {
    // A comparison needs something to compare against, so the reference cards
    // do not move — but a reader has to be able to tell which of the three
    // answers to the controls. The caption below used to claim all three were
    // "different parameter combinations" while all three ignored every control.
    //
    // The harness unmounts the previous tool on every open, so the first state
    // is read into numbers before the second is mounted.
    await openTool('solow-simulator')
    const referenceBefore = {
      base: cardK(BASE_CARD),
      high: cardK(HIGH_SAVINGS_CARD),
      low: cardK(LOW_GROWTH_CARD),
    }
    expect(selectedPreset('Custom Parameters')).toContain('button-primary')

    const moved = await openTool('solow-simulator')
    await moved.set({ 'Savings Rate (s)': 0.1, 'Depreciation Rate (δ)': 0.1 })
    // The Base card moved; the reference cards did not.
    expect(cardK(BASE_CARD)).not.toBeCloseTo(referenceBefore.base, 2)
    expect(cardK(HIGH_SAVINGS_CARD)).toBeCloseTo(referenceBefore.high, 2)
    expect(cardK(LOW_GROWTH_CARD)).toBeCloseTo(referenceBefore.low, 2)
    // The reference cards' own arithmetic, which is unchanged by the fix and
    // must stay unchanged: s = 0.35 at n = 0.02 gives k* 9.97 / y* 1.993, and
    // n = 0.01 at s = 0.2 gives k* 5.58 / y* 1.675.
    expect(cardK(HIGH_SAVINGS_CARD)).toBeCloseTo(9.97, 2)
    expect(cardY(HIGH_SAVINGS_CARD)).toBeCloseTo(1.993, 3)
    expect(cardK(LOW_GROWTH_CARD)).toBeCloseTo(5.58, 2)
    expect(cardY(LOW_GROWTH_CARD)).toBeCloseTo(1.675, 3)

    // The reader can tell which card answers to the controls.
    expect(cardTitled(HIGH_SAVINGS_CARD)).toContain('fixed')
    expect(cardTitled(LOW_GROWTH_CARD)).toContain('fixed')
    expect(cardTitled(BASE_CARD)).not.toContain('fixed')
  })

  it('says in the caption which card the sliders drive', async () => {
    // The block is headed "Scenario Analysis" and captioned "Compare different
    // parameter combinations", both of which read as a response to the controls
    // directly above them. The sentence that tells the reader which card does
    // is what makes the labels mean something.
    const tool = await openTool('solow-simulator')
    const caption = tool.text(/Compare different parameter combinations/)
    expect(caption).toMatch(/Base card follows the sliders/)
    expect(caption).toMatch(/fixed reference points/)
    // And the growth-rate claim in the same caption agrees with the identity
    // the Key Insight box states. It used to say a lower population growth rate
    // RAISES the long-run growth rate, which is the opposite of what the tile
    // beside it reports — at n = 0.01 the growth rate is 1%, not 2%.
    expect(caption).toMatch(/LOWERS the growth rate/)
  })
})
