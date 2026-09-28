/**
 * FiscalPolicyExperiments: every experiment moves the variable its own panel
 * names.
 * ============================================================================
 *
 * `modelValues.test.tsx` holds the two assertions that were red against the
 * Combined miswire — a tax increase has to LOWER output, and the two levers
 * together have to agree with the tool's own multiplier prediction. This file
 * is the other half: the INVARIANT behind both, written so the class cannot
 * come back through a different experiment.
 *
 * WHY A SEPARATE FILE. `modelValues.test.tsx` is one tool per describe block
 * and three other agents own reds in it, so this is a per-tool file rather
 * than a fourth block in a shared one. It uses the same harness
 * (`tests/modelAssertions.ts`) and the same contract: assert the string the
 * reader reads, state the parameter set in the same expression as the
 * expected value, and let `stat()`/`set()` throw so a rename breaks the test
 * rather than passing by doing nothing.
 *
 * WHAT IT CANNOT ASSERT, and why the assertions are shaped the way they are.
 * jsdom has no layout, so Recharts draws no plot and the ZZ curve itself is
 * not readable here (see `NO_CHART_DATA` in the harness). What IS readable is
 * the three numbers a reader compares when they look at that chart: the
 * `Output Change` tile, the `Initial Shock` tile and the `Multiplier` tile.
 * So the invariant is asserted where it is decidable — on the output the
 * miswired lever produces — and the chart follows from it, because the chart
 * plots `newY` and the two round-by-round charts plot the same shock the
 * tiles print.
 *
 * MPC 0.8 is used throughout rather than the tool's default 0.6, so k = 5 and
 * mpc = 0.8 are stated in the arithmetic below rather than inherited. The
 * numbers are deliberately NOT the ones the default view produces: a fix that
 * hard-coded the default answer, or one that made every experiment behave
 * alike, has to go red on at least one row of the table.
 */
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { openTool } from './modelAssertions'
import type { ScenarioParams } from '../store'

/** The number out of a stat tile, with its unit and separators stripped. */
function number(tile: string): number {
  const parsed = Number.parseFloat(tile.replace(/[^0-9.-]/g, ''))
  if (Number.isNaN(parsed)) throw new Error(`no number in stat tile "${tile}"`)
  return parsed
}

const MPC_08 = { 'Marginal Propensity to Consume (MPC)': 0.8 }

interface Experiment {
  /** The button the reader clicks to get this panel. */
  panel: string
  /** The sliders the panel offers, and the value the reader sets. */
  params: Record<string, number>
  /** The output change the named lever must produce, at MPC 0.8. */
  dY: number
}

const MPC = 0.8

/**
 * The whole invariant as a table, one row per lever each panel offers.
 *
 * Each expected value is `dY` written out from the model rather than copied
 * from the tool: a rise in autonomous spending or in G is worth k, a rise in
 * T is worth `-mpc * k`, and the Combined panel is the sum of the two because
 * it moves both at once. A row the tool answers with any other number is a
 * row where the panel and the branch under it have come apart.
 */
const EXPERIMENTS: Experiment[] = [
  {
    panel: 'Exp 1: Consumption',
    params: { 'Change in Autonomous Consumption': 20 },
    dY: 100, // 20 * k = 20 * 5
  },
  {
    panel: 'Exp 2: Gov Spending',
    params: { 'Change in Government Spending': 20 },
    dY: 100, // 20 * k
  },
  {
    panel: 'Exp 3: Taxes',
    params: { 'Change in Taxes': 20 },
    // The sign is the assertion. A tax multiplier is negative, so a panel
    // whose tax slider RAISES output is a panel whose slider is wired to
    // something else — which is exactly what the Combined panel did.
    dY: -80, // -0.8 * 20 * 5
  },
  {
    panel: 'Combined',
    params: { 'Change in Spending': 20, 'Change in Taxes': 20 },
    // (20 - 0.8*20) * 5 = 20. Neither lever on its own gives 20 here, and
    // their sum does not either, so this row fails for any wiring that
    // applies the two changes one at a time to the same variable.
    dY: 20,
  },
  {
    panel: 'Combined',
    params: { 'Change in Spending': 20, 'Change in Taxes': -20 },
    // A tax CUT alongside a spending RISE: (20 + 16) * 5 = 180. The strongest
    // row against the old miswire, which sent the tax change to G and so
    // cancelled the two levers instead of compounding them.
    dY: 180,
  },
  {
    panel: 'Combined',
    params: { 'Change in Spending': -20, 'Change in Taxes': 20 },
    dY: -180, // (-20 - 16) * 5
  },
  {
    panel: 'Combined',
    params: { 'Change in Spending': 50, 'Change in Taxes': -50 },
    dY: 450, // (50 + 40) * 5
  },
]

describe('FiscalPolicyExperiments: every experiment moves the variable its own panel names', () => {
  it.each(EXPERIMENTS)(
    '$panel with $params moves output by $dY',
    async ({ panel, params, dY }) => {
      const tool = await openTool('fiscal-policy-experiments', MPC_08)
      // Clicking a panel zeroes both change sliders, so it has to come
      // before the lever is set.
      await tool.click(panel)
      await tool.set(params)
      expect(tool.stat('Output Change (ΔY)')).toBe(`${dY.toFixed(1)} $ billions`)
    },
  )

  it('holds at a high multiplier, where a miswire is not a rounding error', async () => {
    // MPC 0.95, the top of the slider: k = 20. The same three levers, where a
    // $20B difference in the shock is a $400B difference in output, so this
    // cannot be a display-rounding artefact of the table above.
    const tool = await openTool('fiscal-policy-experiments', {
      'Marginal Propensity to Consume (MPC)': 0.95,
    })
    await tool.click('Combined')
    await tool.set({ 'Change in Spending': 20, 'Change in Taxes': 20 })
    // (20 - 0.95*20) * 20 = 20. The spending and tax effects very nearly
    // cancel here, so the row is only right if BOTH are applied.
    expect(tool.stat('Output Change (ΔY)')).toBe('20.0 $ billions')
  })

  it('means the same thing wherever it is named the same', async () => {
    // The cross-panel form of the same invariant, and the one a reader would
    // notice first: "Change in Taxes" is one lever whether it is reached from
    // Exp 3 or from Combined, and a $20B shift of the intercept is a $20B
    // shift of the intercept whether the panel calls it autonomous
    // consumption or government spending. Five mounts because the harness
    // unmounts the previous tool on every open, so each reading is taken
    // BEFORE the next one is opened; a comparison across panels cannot be
    // done inside a single mount.
    const spending = await openTool('fiscal-policy-experiments', MPC_08)
    await spending.click('Exp 2: Gov Spending')
    await spending.set({ 'Change in Government Spending': 20 })
    const spendingD = spending.stat('Output Change (ΔY)')

    const combinedSpending = await openTool('fiscal-policy-experiments', MPC_08)
    await combinedSpending.click('Combined')
    await combinedSpending.set({ 'Change in Spending': 20, 'Change in Taxes': 0 })
    expect(combinedSpending.stat('Output Change (ΔY)')).toBe(spendingD)

    const consumption = await openTool('fiscal-policy-experiments', MPC_08)
    await consumption.click('Exp 1: Consumption')
    await consumption.set({ 'Change in Autonomous Consumption': 20 })
    expect(consumption.stat('Output Change (ΔY)')).toBe(spendingD)

    const taxes = await openTool('fiscal-policy-experiments', MPC_08)
    await taxes.click('Exp 3: Taxes')
    await taxes.set({ 'Change in Taxes': 20 })
    const taxesD = taxes.stat('Output Change (ΔY)')

    const combinedTaxes = await openTool('fiscal-policy-experiments', MPC_08)
    await combinedTaxes.click('Combined')
    await combinedTaxes.set({ 'Change in Spending': 0, 'Change in Taxes': 20 })
    // The failing comparison, stated as a comparison: the same named lever,
    // in the two panels that offer it, has to be worth the same thing. Before
    // the fix these were '50.0 $ billions' and '-30.0 $ billions'.
    expect(combinedTaxes.stat('Output Change (ΔY)')).toBe(taxesD)
  })

  it('reports the initial shock the branch it is under actually applied', async () => {
    // The second readout. `Output Change` is the equilibrium recomputed, and
    // `Initial Shock` is the lever the branch moved; the two describe the
    // same model only if the second one is derived from the first one's
    // inputs. A $20B spending rise and a $20B tax rise are worth 20 and -16
    // of shock respectively, and the tiles have to say so.
    const tool = await openTool('fiscal-policy-experiments', MPC_08)
    await tool.click('Combined')
    await tool.set({ 'Change in Spending': 20, 'Change in Taxes': 20 })
    expect(number(tool.stat('Initial Shock'))).toBeCloseTo(20 - MPC * 20, 5)
    expect(number(tool.stat('Expected Effect'))).toBeCloseTo(
      number(tool.stat('Output Change (ΔY)')),
      5,
    )
    // And the multiplier tile is the one the reader divides by, not a second
    // independently rounded copy of something else. At mpc 0.8, k = 5.
    expect(number(tool.stat('Multiplier'))).toBeCloseTo(5, 5)
  })
})

describe('FiscalPolicyExperiments: the note about the multiplier is true of its condition', () => {
  it('says the two numbers match when they match, and prints both of them', async () => {
    const tool = await openTool('fiscal-policy-experiments', MPC_08)
    await tool.click('Combined')
    await tool.set({ 'Change in Spending': 20, 'Change in Taxes': 20 })
    const note = tool.text(/Check:/)
    // The sentence has to carry the two numbers it is about. An earlier
    // version fired on DIVERGENCE and printed "closely matches the
    // multiplier prediction (20.0B), confirming the multiplier mechanism"
    // while the actual change beside it read 100.0 — so the wording alone is
    // the assertion, and the numbers in it are what tie it to the tiles.
    expect(note).toContain('20.0B')
    expect(note).toMatch(/matches the multiplier prediction/)
    // …and it must not be the old sentence, which asserted agreement while
    // the condition beneath it tested for disagreement.
    expect(note).not.toMatch(/closely matches/)
    expect(note).not.toMatch(/confirming the multiplier mechanism/)
  })

  it('says nothing when there is no policy to check', async () => {
    // A note about agreement, printed over a policy the reader has not
    // chosen, is a claim about zero. `text()` throws when nothing matches,
    // which is the only way this file can assert an ABSENCE: the harness
    // refuses to return null and let an `expect(null)` decide.
    const tool = await openTool('fiscal-policy-experiments')
    expect(() => tool.text(/multiplier prediction/)).toThrow(/nothing rendered matching/)
  })
})

describe('FiscalPolicyExperiments: the two round-by-round charts, in the state with no policy in it', () => {
  /**
   * `generateRoundsByRound` pushes round 1 before it can break, so the array is
   * never empty. Both charts guarded on `roundsData.length > 0`, which is
   * therefore not a condition: the "adjust policy parameters above" card those
   * guards selected could not render, and a reader who had set no policy got a
   * bar chart of one bar at height zero, a "How to read" caption describing a
   * decay that was not on the screen, and a y-axis scaled for a maximum of 0.
   *
   * A zero-height bar is the wrong state to leave a reader in. The model is
   * not saying "nothing to see" — it is saying "you have not chosen a policy
   * yet", and the two read very differently: one is a dead end, the other is an
   * instruction. So the card is what the guard selects, and these assertions
   * hold both halves — the card AND the absence of the caption, because a card
   * shown next to a chart that is also shown is not a fix.
   */
  it('offers a way to start rather than a chart of nothing', async () => {
    const tool = await openTool('fiscal-policy-experiments')
    // `text()` throws when nothing matches, so each of these is the ABSENCE
    // being asserted rather than a `null` being compared to something.
    expect(tool.text(/Adjust policy parameters above/)).toMatch(
      /multiplier effect breakdown/,
    )
    expect(tool.text(/Adjust policy parameters above to see the cumulative/)).toMatch(
      /cumulative multiplier effect/,
    )
    expect(() => tool.text(/Each round represents one iteration/)).toThrow(
      /nothing rendered matching/,
    )
    expect(() => tool.text(/accumulates across rounds/)).toThrow(/nothing rendered matching/)
  })

  it('draws both charts as soon as there is a policy to decompose', async () => {
    const tool = await openTool('fiscal-policy-experiments', {
      'Change in Autonomous Consumption': 20,
    })
    expect(tool.text(/Each round represents one iteration/)).toMatch(
      /converging to total multiplier effect/,
    )
    expect(tool.text(/accumulates across rounds/)).toMatch(/flattens as each successive round/)
    // The card is gone, not merely pushed down the page: the same string, the
    // same tool, one policy apart.
    expect(() => tool.text(/Adjust policy parameters above/)).toThrow(/nothing rendered matching/)
  })

  it('comes back when the policy goes back to nothing, on either panel', async () => {
    // The lever is not the shock's SIZE but whether there is one, and the two
    // panels get there differently: Exp 1 moves the intercept by the slider
    // directly, Exp 3 moves it by `mpc` times the slider, and the Combined
    // panel can cancel the two against each other. A guard written against the
    // slider's value rather than against the rounds would pass the first two
    // and fail this one.
    for (const panel of ['Exp 1: Consumption', 'Exp 3: Taxes', 'Combined']) {
      const tool = await openTool('fiscal-policy-experiments')
      await tool.click(panel)
      const lever: ScenarioParams =
        panel === 'Combined'
          ? { 'Change in Spending': 20, 'Change in Taxes': 20 }
          : panel === 'Exp 3: Taxes'
            ? { 'Change in Taxes': 20 }
            : { 'Change in Autonomous Consumption': 20 }
      await tool.set(lever)
      expect(tool.text(/Each round represents one iteration/), panel).toMatch(/converging/)

      // A zero shock. On the Combined panel the two levers cancel only at
      // `Change in Spending = mpc * Change in Taxes`, and at MPC 0.6 with a step
      // of 5 there is no slider position that lands on 12 — so the reachable
      // zero there is both levers at rest, which is the state a reader is in
      // after switching to the panel and touching nothing.
      const zeroing: ScenarioParams =
        panel === 'Combined'
          ? { 'Change in Spending': 0, 'Change in Taxes': 0 }
          : panel === 'Exp 3: Taxes'
            ? { 'Change in Taxes': 0 }
            : { 'Change in Autonomous Consumption': 0 }
      await tool.set(zeroing)
      expect(tool.text(/Adjust policy parameters above/), panel).toMatch(/breakdown/)
      expect(() => tool.text(/Each round represents one iteration/), panel).toThrow(
        /nothing rendered matching/,
      )
    }
  })
})

describe('FiscalPolicyExperiments: the count in the copy is the count of the panels', () => {
  it('says four everywhere it says a number, and three nowhere', async () => {
    const tool = await openTool('fiscal-policy-experiments')
    // On the page: the description the tool page heads itself with, and the
    // note that explains the panels. Both are read out of the DOM, so this
    // fails if the copy drifts from what a reader is shown.
    expect(tool.text(/fiscal policy experiments/i)).toMatch(/^Explore four /)
    expect(tool.text(/^Combined:/)).toMatch(/the two multipliers side by side/)

    // …and in the two places a reader meets the tool before opening it: the
    // registry card on `/tools`, and the `TOOLS` entry the document title is
    // built from.
    const strip = (source: string) =>
      source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
    // `__dirname` is `web/src/tests`, so the registry is one level up and the
    // tool is beside it.
    const SRC = join(__dirname, '..')
    const store = strip(readFileSync(join(SRC, 'store.ts'), 'utf8'))
    const tool0 = strip(readFileSync(join(SRC, 'tools', 'FiscalPolicyExperiments.tsx'), 'utf8'))
    const entry = store.match(
      /'fiscal-policy-experiments':\s*\{[\s\S]*?description:\s*'([^']*)'/,
    )
    const header = tool0.match(/<ToolHeader[\s\S]*?description="([^"]*)"/)
    // The positive control, and the reason the three assertions below cannot
    // pass by finding nothing: two `undefined`s satisfy `not.toMatch(/three/)`.
    expect(entry?.[1], 'no fiscal description in the TOOLS registry').toBeTypeOf('string')
    expect(header?.[1], 'no ToolHeader description in the tool').toBeTypeOf('string')
    for (const copy of [entry![1], header![1]]) {
      expect(copy, 'a description that no longer counts the panels').toMatch(/^Four |^Explore four /)
      expect(copy, 'a description still promising three').not.toMatch(/three/i)
    }
  })
})

describe('FiscalPolicyExperiments: the prose names what the page renders', () => {
  it('describes the two equilibria without naming a colour', async () => {
    // The caption used to say "the blue point … the green point", and
    // `chartColor(1)` is a teal. A caption that names a colour rots the
    // moment the palette does, so it is asserted the other way round: the
    // sentence has to survive a palette change, which means it cannot mention
    // one. The pattern is the cross chart's own opening clause, because the
    // other two charts also carry a "How to read".
    const tool = await openTool('fiscal-policy-experiments')
    const caption = tool.text(/The equilibrium occurs where the ZZ curve/)
    expect(caption).toContain('Y₀')
    expect(caption).toContain("Y'")
    expect(caption).not.toMatch(/blue|green|teal|red/i)
  })

  it('names the paradox of thrift, and names the variable it is about', async () => {
    // "If households try to save more (c₀ ↓)" described a fall in AUTONOMOUS
    // CONSUMPTION as an increase in saving, and called the result the
    // paradox of savings. The arithmetic was right and stays right; the
    // parenthetical and the name were both wrong, and both rot into a
    // reader's misreading of a textbook result.
    const tool = await openTool('fiscal-policy-experiments')
    const item = tool.text(/Paradox of/)
    expect(item).toMatch(/Paradox of thrift/i)
    expect(item).not.toMatch(/Paradox of Savings/i)
    expect(item).toMatch(/autonomous consumption \(c₀ ↓\)/)
  })

  it('sends the reader to the panel that has the lever the instruction names', async () => {
    // The tool opens on Exp 1, whose only lever is autonomous consumption. An
    // instruction that says "increase government spending" without saying
    // which panel to switch to is asking for a lever the panel in front of
    // the reader does not have.
    const tool = await openTool('fiscal-policy-experiments')
    const item = tool.text(/Notice the large output effect/)
    expect(item).toMatch(/Exp 2: Gov Spending/)
  })
})
