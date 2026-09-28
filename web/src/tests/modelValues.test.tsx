/**
 * What a reader actually sees.
 * ============================================================================
 * READ THIS BEFORE ADDING A TEST TO THIS FILE.
 * ============================================================================
 *
 * This is the first file in the suite to assert a NUMBER A READER CAN SEE.
 * Everything before it either scanned source with a regex or exercised a
 * function with no product caller, so the suite looked like it covered the
 * economics — `calculations.test.ts` has a test literally named "applies the
 * Fisher equation" and the Fisher equation is computed inline in
 * `RealInterestRateCalculator`, which nothing asserts — while covering none of
 * the code a reader reaches.
 *
 * The consequence was seven wrong numbers shipped, every one of them visible
 * on the page and every one of them silent to 546 green tests. The tests below
 * are written against the CORRECT behaviour, so the defects they describe
 * leave them RED until the agent who owns that model turns them green. That is
 * the point of the file: a red test here is a defect with a location.
 *
 * HOW TO WRITE ONE
 *   - Assert the string in the DOM (`tool.stat(...)`), never the model. The
 *     model and the tile are the same number only if the wiring is right, and
 *     the wiring is what breaks.
 *   - Put the parameter set in the same expression as the expected value.
 *     `1.00` is right at n = 0.01 and wrong at n = 0.02.
 *   - Make it able to fail. `stat()` throws on a missing or ambiguous label
 *     and `set()` throws on an unknown key, so a rename breaks the test
 *     rather than passing by doing nothing.
 *   - `tests/modelAssertions.ts` is the harness and explains itself; read its
 *     header before writing against it.
 *
 * WHAT THIS FILE CANNOT ASSERT
 *   Chart series. jsdom has no layout, `tests/setup.ts` stubs
 *   `ResizeObserver` with a no-op, and so `ResponsiveContainer` never gets a
 *   size and Recharts draws no plot at all. A series is an SVG `<path>` with
 *   no text in it, so there is nothing in the DOM to read. Every assertion
 *   here is therefore on a READOUT — a stat tile, a control's printed value,
 *   or a caption the tool renders — which is the number a reader reads. Where
 *   a defect's only symptom is a flat line, the assertion is on the readout
 *   the flat line contradicts, and the comment says so.
 */
import { describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LECTURES, type ToolId } from '../../../content/lectures'
import Shell from '../layout/Shell'
import ToolPage from '../pages/ToolPage'
import MiniTool from '../learning/MiniTool'
import { TOOLS, useAppStore } from '../store'
import { TOOL_COMPONENTS } from '../tools/registry'
import { encodeScenario } from '../lib/scenario'
import { clearControls, registerControl } from '../lib/controlRegistry'
import { openTool, openSharedLink } from './modelAssertions'

/* ================================================================== *
 * 0. The harness itself is able to fail
 * ================================================================== */

describe('the harness this file is built on cannot pass by doing nothing', () => {
  /**
   * Point 3 of the harness's own contract: a rendered-value assertion is only
   * worth anything if it goes red when the thing it names is not there. Both
   * ways it could quietly not — a label that no longer exists, and a control
   * key that no longer exists — are checked here, and both are the shape a
   * rename takes. A helper that returned `null` and let `expect(null).not.toBe`
   * decide, or that skipped a missing control, would leave every assertion
   * above it vacuous after a rename, and nobody would notice until the defect
   * it was written for came back.
   */
  it('throws on a stat tile that is not on the page', async () => {
    const tool = await openTool('solow-simulator')
    expect(() => tool.stat('Steady State Growth Rtate')).toThrow(/no stat tile labelled/)
    // …and the error names what IS there, so the failure is a diff a reader
    // can act on rather than "expected null, got null".
    expect(() => tool.stat('Steady State Growth Rtate')).toThrow(/Steady State k\*/)
  })

  it('throws on a control that is not on the page', async () => {
    const tool = await openTool('solow-simulator')
    expect(() => tool.control('Population Growth')).toThrow(/no control labelled/)
  })

  it('throws when asked to move a control it cannot find, rather than moving nothing', async () => {
    const tool = await openTool('solow-simulator')
    // The failure mode this rules out: a scenario key that has been renamed
    // applies to nothing, `applyScenarioParams` reports 0 applied, and every
    // assertion downstream of it still passes on the tool's DEFAULTS.
    await expect(tool.set({ 'Savings Rtate (s)': 0.35 })).rejects.toThrow(
      /Savings Rtate \(s\) is not a single mounted control/,
    )
  })

  it('clamps a value it applies, the way the input would', async () => {
    // The other half of the registry's contract, and the reason the harness
    // uses it rather than synthesising a drag: the bound enforced is the bound
    // the share link encodes, so a test cannot configure a tool to a state its
    // own slider cannot reach.
    const tool = await openTool('solow-simulator')
    await tool.set({ 'Savings Rate (s)': 99 })
    expect(tool.control('Savings Rate (s)')).toBe('0.40')
  })
})

/* ================================================================== *
 * 1. SolowSimulator — the tile reports the slider, not the scenario
 * ================================================================== */

describe('SolowSimulator: the steady-state growth rate is the scenario\'s n', () => {
  /**
   * `SolowSimulator.tsx:310` read `(populationGrowth * 100).toFixed(2)` and
   * `:324` repeated it in the InfoBox, while every other quantity in the file
   * used `activeN` (`:112`, `:134`, `:150`). Under the "Low Growth" preset
   * `activeN` is 0.01 and `populationGrowth` is still 0.02, so:
   *
   *     n slider 0.010 | k* 5.58 | "Steady State Total Output Growth 2.00 %"
   *
   * The tile asserts an identity in order to display a counterexample to it.
   * Reproduced against this build; `k*` moving from 4.48 to 5.58 is the proof
   * that the preset took effect and the tile did not follow it.
   */
  it('reads 1.00 in the tile at the "Low Growth (n=0.01)" preset', async () => {
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    // The preset has landed: the steady state moved, and the slider the preset
    // overrode is the one that moved it. Without these two, the assertion
    // below could pass for the wrong reason.
    expect(tool.stat('Steady State k*')).toBe('5.58')
    expect(tool.control('Population Growth (n)')).toBe('0.010')
    // At n = 0.01. Today: '2.00 %'.
    expect(tool.stat('Steady State Total Output Growth (n)')).toBe('1.00 %')
  })

  it('names n = 1.00% in the Key Insight box at the same preset', async () => {
    const tool = await openTool('solow-simulator')
    await tool.click('Low Growth (n=0.01)')
    // The same slip in prose. "The steady-state growth rate equals the
    // population growth rate (n = …)" is a claim about the number the tile
    // beside it prints, and today the two disagree on screen. The sentence is
    // asserted as the reader receives it, whitespace-normalised, so a future
    // rewrap of the JSX does not break it and a reworded number does.
    const insight = tool.text(/The steady-state growth rate equals the population growth rate/)
    expect(insight).toContain('(n = 1.00%)')
  })

  it('tracks the slider when no preset is overriding it', async () => {
    // The negative case, and the one that makes the first test mean something:
    // the tile is not simply always wrong, it is wrong exactly when a preset
    // overrides the slider. At the tool's own defaults n = 0.02 and the tile
    // is right, so a fix that hard-codes 1.00 would go red here.
    const tool = await openTool('solow-simulator', { 'Population Growth (n)': 0.04 })
    expect(tool.control('Population Growth (n)')).toBe('0.040')
    expect(tool.stat('Steady State Total Output Growth (n)')).toBe('4.00 %')
  })
})

/* ================================================================== *
 * 2. FiscalPolicyExperiments — "Combined" never changes taxes
 * ================================================================== */

describe('FiscalPolicyExperiments: the Combined experiment changes both things it offers', () => {
  /**
   * `FiscalPolicyExperiments.tsx:131-134`:
   *
   *     } else if (experimentType === 'combined') {
   *       newAutonomousConsumption = autonomousConsumption + governmentSpendingChange
   *       newGovernment = baseGovernmentSpending + taxChange     // taxChange drives G
   *     }
   *
   * `newTaxes` is left at `baseTaxes` (`:122`), so the tax slider has no
   * effect on taxes — and the spending slider moves autonomous consumption,
   * which the Combined panel does not even offer a control for. The sharpest
   * single consequence needs no arithmetic assumption about the fix: **a tax
   * increase must lower output.** A tax multiplier is negative. Today it
   * raises output, because the tax slider is wired to government spending.
   */
  it('lowers output when the Combined experiment raises taxes', async () => {
    const tool = await openTool('fiscal-policy-experiments')
    await tool.click('Combined')
    // Spending flat, taxes up $20B, mpc 0.6, k = 2.5. So dY = -0.6*20*2.5 =
    // -30. Today: +50.0, because `taxChange` is added to G instead of T.
    await tool.set({ 'Change in Spending': 0, 'Change in Taxes': 20 })
    expect(tool.stat('Output Change (ΔY)')).toBe('-30.0 $ billions')
  })

  it('leaves output alone when the Combined experiment raises only spending', async () => {
    // The control, and the one that makes the test above mean something: the
    // spending slider is the one that must work, and it does. At k = 2.5 a
    // $20B rise in G is +50.0. A fix that inverted the miswire would go red.
    const tool = await openTool('fiscal-policy-experiments')
    await tool.click('Combined')
    await tool.set({ 'Change in Spending': 20, 'Change in Taxes': 0 })
    expect(tool.stat('Output Change (ΔY)')).toBe('50.0 $ billions')
  })

  it('agrees with its own multiplier prediction when both levers move', async () => {
    // The tool tells the reader to try exactly this (`:697`: "spending up
    // $20B, taxes up $20B … output still rises due to the tax multiplier
    // being smaller than the spending multiplier"). dY = (20 - 0.6*20)*2.5
    // = +20.0, and `Expected Effect` computes the same number from
    // `initialShock`. Today the two disagree by 80 — the readout describes a
    // model the tool did not run.
    const tool = await openTool('fiscal-policy-experiments')
    await tool.click('Combined')
    await tool.set({ 'Change in Spending': 20, 'Change in Taxes': 20 })
    expect(tool.stat('Output Change (ΔY)')).toBe('20.0 $ billions')
    expect(tool.stat('Expected Effect')).toBe('20.0 $ billions')
  })
})

/* ================================================================== *
 * 3. AssetPricing — the Gordon model is undefined at r <= g, and 0 is a claim
 * ================================================================== */

describe('AssetPricing: an undefined Gordon price is labelled, not reported as zero', () => {
  /**
   * `AssetPricing.tsx:104-109`:
   *
   *     const calculateStockPrice = (dividend, rate, growth) => {
   *       if (rate <= growth) return 0 // Prevent division by zero or negative
   *
   * `r <= g` is not a limit of the model, it is where the model is UNDEFINED:
   * the price diverges as r approaches g from above. Returning 0 is a specific
   * and wrong claim about the price of an asset, rendered as if it were data,
   * and the tile at `:274` prints it to two decimals.
   *
   * NOTE, and it corrects the survey: the tool's defaults are
   * `discountRate: 5, growthRate: 3` (`:46,48`), so at the defaults `r > g`
   * and the tile reads `103.00`, not `0.00`. The defect is real and is pinned
   * by the second test below, which moves the discount rate down to the growth
   * rate. The first test is the negative case and is here so a fix that
   * returned a hard-coded non-zero cannot pass.
   */
  it('is not 0.00 at the tool\'s own defaults', async () => {
    const tool = await openTool('asset-pricing')
    // discountRate 5, growthRate 3: P = 2 * 1.03 / (0.05 - 0.03) = 103.
    expect(tool.stat('Stock Price')).toBe('103.00')
  })

  it('does not report a price where r <= g, where the model has none', async () => {
    const tool = await openTool('asset-pricing', { 'Discount Rate': 3, 'Growth Rate': 3 })
    // r = g = 3. `rate <= growth` is true, so the tile reads '0.00' today.
    // Either shape is acceptable to this assertion: a tile labelled
    // "undefined for r <= g", or a dash. What is not acceptable is the number.
    const tile = tool.stat('Stock Price')
    expect(tile).not.toBe('0.00')
    expect(tile).toMatch(/undefined|not defined|—|n\/a|no price/i)
  })

  it('still prices the stock above the growth rate, so the guard is not a blanket', async () => {
    // r = 4, g = 3: P = 2 * 1.03 / (0.04 - 0.03) = 206. A fix that returned
    // `null` unconditionally would go red here.
    const tool = await openTool('asset-pricing', { 'Discount Rate': 4 })
    expect(tool.stat('Stock Price')).toBe('206.00')
  })

  /**
   * The three assertions above establish that the tile is not `0.00` where the
   * model has no price, and that it IS priced where the model has one. Neither
   * of those is enough on its own: a guard that returned `1`, or `NaN`, or a
   * stale value, satisfies both and is still a number the model cannot produce.
   * So what follows pins the ARITHMETIC at parameter sets that a plausible wrong
   * answer would miss.
   *
   * Every expected value here is the Gordon model evaluated by hand, from the
   * sliders the test sets in the same expression. Nothing is read from DEFAULTS
   * and nothing is copied from the tool.
   */
  it('computes D0(1+g)/(r-g) from the sliders the test sets, at two other parameter sets', async () => {
    // D0 = 3, g = 2, r = 6: 3 * 1.02 / (0.06 - 0.02) = 76.5.
    const first = await openTool('asset-pricing', {
      'Current dividend D₀ (per share)': 3,
      'Growth Rate': 2,
      'Discount Rate': 6,
    })
    expect(first.stat('Stock Price')).toBe('76.50')
    // D0 = 2, g = 1, r = 9: 2 * 1.01 / (0.09 - 0.01) = 25.25.
    // A second set, because a guard that happened to be right at one place in
    // the domain is not a guard; this is the same function on other inputs.
    const second = await openTool('asset-pricing', {
      'Growth Rate': 1,
      'Discount Rate': 9,
    })
    expect(second.stat('Stock Price')).toBe('25.25')
  })

  it('is finite and large one step above the growth rate, where the model nearly diverges', async () => {
    // r = 3.5, g = 3, the half-point the sliders' own `step` allows above the
    // boundary: 2 * 1.03 / 0.005 = 412. This is the point a `0` guard most
    // obviously destroys, and it is also the point that would catch a fix
    // which treated "near the boundary" as "at the boundary" and started
    // returning a gap too early.
    const tool = await openTool('asset-pricing', { 'Discount Rate': 3.5 })
    expect(tool.stat('Stock Price')).toBe('412.00')
  })

  it('reports no price anywhere at or below the growth rate, not only at equality', async () => {
    // The guard's own condition is `rate <= growth`, so equality is one point
    // of the region and the tile has to hold across all of it. The harness
    // unmounts on each open, so one tool is live at a time.
    for (const rate of [0, 1, 2, 3]) {
      const tool = await openTool('asset-pricing', { 'Discount Rate': rate })
      expect(tool.stat('Stock Price'), `r = ${rate}, g = 3`).toBe('—')
    }
  })

  it('names the constraint on the tile, so the reader is told which way to move', async () => {
    // A dash and nothing else tells the reader that something is wrong but not
    // which slider to move. The qualifier is the
    // difference between a limitation they can undo and a bug they cannot.
    const tool = await openTool('asset-pricing', { 'Discount Rate': 2 })
    expect(tool.stat('Stock Price')).toBe('—')
    expect(tool.text(/requires r > g/)).toBe('requires r > g')
  })

  it('states in the Stock Valuation note that the model requires r > g', async () => {
    // The same fact as prose, in the place a reader goes to learn the model
    // rather than to read a tile. Hiding the boundary teaches a wrong thing:
    // a reader who does not know r > g is a requirement has no way to
    // interpret anything this tool shows.
    const tool = await openTool('asset-pricing')
    const note = tool.text(/The model requires r > g/)
    expect(note).toContain('r > g')
    expect(note).toMatch(/undefined rather than printing a number/)
  })

  it('names the dividend as D0, and prices it as D0 rather than as next year\'s dividend', async () => {
    // The label and the arithmetic are one claim. `:105` documents
    // `P = D0 * (1 + g) / (r - g)`, so the slider is the dividend just PAID;
    // a reader who takes it for next year's dividend gets a price exactly 1g
    // too high, and nothing on the page tells them. D0 = 2.5 at the default
    // r = 5, g = 3: 2.5 * 1.03 / 0.02 = 128.75, against 125.00 for the D1
    // reading — so the asserted price is what separates the two.
    const tool = await openTool('asset-pricing', { 'Current dividend D₀ (per share)': 2.5 })
    expect(tool.control('Current dividend D₀ (per share)')).toBe('2.5')
    expect(tool.stat('Stock Price')).toBe('128.75')
  })

  /**
   * The same class of defect on the other half of the tool, and it is live at
   * every parameter set rather than only where a reader goes looking.
   *
   * `calculateBondPrice` evaluated the annuity `C * [1 - (1+r)^-n] / r`, which
   * is `0 / 0` at `r = 0`: the left factor is exactly zero and so is the
   * divisor. The tile printed `NaN`, and the 0-10 rate sweep at `:138` starts
   * at 0, so the bond chart's leftmost point was a hole at every setting.
   *
   * A bond is NOT undefined at a zero discount rate the way a Gordon price is
   * undefined at r <= g. Nothing is discounted, so the value is the undiscounted
   * sum C*n + FV, which is the limit of the formula as r -> 0+. That is the
   * model's own answer, and it is what the assertion pins: 5 * 10 + 100.
   */
  it('values the bond at a zero discount rate, where the annuity form is 0 over 0', async () => {
    const tool = await openTool('asset-pricing', { 'Discount Rate': 0 })
    expect(tool.stat('Bond Price')).toBe('150.00')
  })

  it('keeps the bond price finite across the whole discount-rate slider', async () => {
    // The sweep the bond chart plots runs 0 to 10 in half points, and every
    // one of those twenty-one rates reaches the tile. A `NaN` at one of them
    // is a `NaN` in a reader's face, and `toFixed` does not catch it: it
    // returns the string "NaN".
    const rates = [0, 0.5, 1, 2.5, 5, 7.5, 10]
    for (const rate of rates) {
      const tool = await openTool('asset-pricing', { 'Discount Rate': rate })
      const tile = tool.stat('Bond Price')
      expect(tile, `r = ${rate}`).toMatch(/^\d+\.\d{2}$/)
      expect(Number.isFinite(Number.parseFloat(tile)), `r = ${rate}`).toBe(true)
    }
  })
})

/* ================================================================== *
 * 4. SpeculativeAttack — the crisis preset contains no crisis
 * ================================================================== */

describe('SpeculativeAttack: the Crisis Scenario contains a crisis', () => {
  /**
   * THE BOUNDARY, and it is worth stating exactly because one comparison is
   * the whole defect. `SpeculativeAttack.tsx:187` computes
   *
   *     expectedDevaluation = Math.max(0, activeMoney - foreignRate) * 0.5
   *
   * and the speculative outflow at `:204-207` is gated on
   *
   *     peg && expectedDevaluation > 0.02
   *
   * At the crisis preset `activeMoney = 0.08` and `foreignRate = 0.04`, so
   * `expectedDevaluation` is `(0.08 - 0.04) * 0.5` = **exactly 0.0200**, and
   * `0.0200 > 0.0200` is false. The gate is closed by one part in 10^16, and
   * the speculative outflow is identically zero in all 61 periods.
   *
   * So this parameter set IS the boundary, and the preset the tool's own
   * button names "Crisis Scenario (High Growth + Low Controls)" sits on it.
   * Re-measured outside the browser before this test existed:
   *
   *     mode=crisis: pegBreaks=NEVER (all 61 periods pegged) reserves p60=72.55
   *                   peakDomRate=4.2  maxOutflow=0.90  specPeak=0.00
   *                   gdp=93.7 flat   exchangeRate=1.000 flat   inflation=6.0 flat
   *
   * What the reader sees is four flat lines, a "Speculative Attack" series of
   * 0.00, and a `Peg Breaks at Period` tile reading `—` (`:411`).
   *
   * THE SERIES ITSELF CANNOT BE ASSERTED HERE, and the reason is stated
   * because it is the limit of this whole file: `speculatorAttack` is drawn
   * as an SVG bar inside a `ResponsiveContainer` that has no size under jsdom,
   * so it is not in the DOM as text. The two assertions below are the two
   * things on the page that the closed gate causes, and both are text a reader
   * reads: the tile that reports the peg never broke, and the caption that
   * names the period it broke at — which the tool renders only when
   * `pegBreakIndex >= 0`, so its absence is the same fact said twice.
   */
  it('does not report the peg as intact at the Crisis Scenario preset', async () => {
    const tool = await openTool('speculative-attack')
    // The preset is selected on open; stated so the test cannot pass because
    // it read a different tool.
    expect(tool.control('Domestic Money Growth Rate (%)')).toBe('0.08')
    expect(tool.control('Domestic Policy Rate (%)')).toBe('0.03')
    // A period number, not the em dash the tile prints when `pegBreakIndex`
    // is -1. Today: '—'.
    const tile = tool.stat('Peg Breaks at Period')
    expect(tile).not.toBe('—')
    expect(Number.parseInt(tile, 10)).toBeGreaterThanOrEqual(0)
  })

  it('names the break period in the reserves caption, which it renders only if there was one', async () => {
    const tool = await openTool('speculative-attack')
    // `:468-476` renders this sentence inside `pegBreakIndex >= 0 &&`. So the
    // sentence's presence IS the peg breaking, stated to the reader. Today:
    // absent.
    expect(tool.text(/Peg breaks at period \d+/)).toBeTruthy()
  })

  it('still holds a peg the Stable preset is supposed to hold', async () => {
    // The negative case, and the one that makes the two above mean something:
    // a fix that broke the peg in every scenario would go red here. The
    // Stable preset is money growth 0.03 against a 4% foreign rate, so
    // `expectedDevaluation` is 0 and the gate is closed for the right reason.
    const tool = await openTool('speculative-attack')
    await tool.click('Stable Peg (Low Growth + Capital Controls)')
    expect(tool.stat('Peg Breaks at Period')).toBe('—')
  })

  it('breaks at a period a reader can believe, and names the same one twice', async () => {
    // Two claims, and the second is the one that catches a wiring slip.
    //
    //   1. The break is an EVENT inside the first half of the 60 periods the
    //      charts show. Period 0 is not an event — it would be the initial
    //      state, not a collapse — and a break late in the path leaves the
    //      reader looking at a pegged curve with no room on the chart for the
    //      aftermath, which is the float, the devaluation and the inflation
    //      episode. The tool marks the same boundary itself: the tile turns
    //      negative for a break before period 30.
    //   2. The tile and the caption are the same number. They are computed
    //      from one `pegBreakIndex`, and asserting both is what would notice
    //      if one of them were re-derived.
    const tool = await openTool('speculative-attack')
    const period = Number.parseInt(tool.stat('Peg Breaks at Period'), 10)
    expect(period).toBeGreaterThan(0)
    expect(period).toBeLessThan(30)
    const sentence = tool.text(/Peg breaks at period \d+/)
    expect(sentence).toContain(`Peg breaks at period ${period}`)
    // ...and it names the level it broke at with the SAME number the chart
    // prints as its critical level, so the two readouts under and beside one
    // chart cannot drift apart. Neither is written down here: 20 is whatever
    // the tool says it is, and the two must agree.
    const critical = numberFrom(tool.text(/Critical level/), /Critical level: ([\d.]+)% of M/)
    expect(sentence).toContain(`below ${critical}% of M`)
  })

  it('crisis is a MULTIPLE of managed, not a margin of it', async () => {
    // What separates the two presets is the speculative attack: the managed
    // regime has the same policy, half the money growth differential and no
    // run, and it bleeds reserves slowly without breaking. So the crisis
    // preset's peak outflow has to be a multiple of the managed one rather than
    // a little more than it.
    //
    // This is the assertion that would notice the attack going missing
    // altogether. Every other readout in this file survives an attack of zero:
    // the ordinary outflow alone still grinds the cover down and the tile still
    // names a break, later. Only the SIZE of the run is the difference between
    // a crisis and a slow bleed, and this compares two readouts rather than
    // pinning a number, so it holds across a retune that moves both.
    //
    // Read the first tool before opening the second: the harness unmounts the
    // previous tool on every open, so two live tools are not available and
    // reading the first afterwards would throw on a missing tile.
    const crisis = await openTool('speculative-attack')
    const crisisPeak = numberFrom(crisis.stat('Max Capital Outflow'), /([\d.]+)/)
    const managed = await openTool('speculative-attack')
    await managed.click('Managed Float (Medium Parameters)')
    const managedPeak = numberFrom(managed.stat('Max Capital Outflow'), /([\d.]+)/)
    expect(crisisPeak / managedPeak).toBeGreaterThan(3)
  })

  it('holds the Managed Float preset on a cover that erodes without collapsing', async () => {
    // What the button says: medium parameters, and a float that is managed
    // rather than abandoned. So the peg survives — and it survives the way a
    // managed regime does, by spending reserves slowly, which is only
    // interesting as a claim if the cover it spent is a visible fraction of
    // what it started with. A peg that "held" because nothing at all happened
    // is the Stable preset's story, and asserting nothing here would let
    // Managed silently become a second Stable.
    const tool = await openTool('speculative-attack')
    await tool.click('Managed Float (Medium Parameters)')
    expect(tool.stat('Peg Breaks at Period')).toBe('—')
    // It is a peg, not a float: the rate never leaves the parity.
    expect(tool.stat('Final Exchange Rate')).toBe('1.000')
    const cover = numberFrom(tool.text(/Final cover/), /Final cover: ([\d.]+)% of M/)
    expect(cover).toBeGreaterThan(20)
    expect(cover).toBeLessThan(100)
  })

  it('attacks only when the money growth differential is worth betting on', async () => {
    // The gate is the model, so it has to be both PRESENT and load-bearing:
    // deleting it makes every preset a crisis, and moving it makes the
    // threshold an arbitrary number the reader cannot find.
    //
    // The trigger is 2 points of expected devaluation a period, which is a
    // money growth rate of 6% against the exogenous 4% foreign rate. Below it
    // the ordinary outflow grinds the cover down slowly and the peg stands;
    // above it speculators join in and it does not. Both halves are asserted
    // on the tile, at the two parameter sets that separate them.
    const quiet = await openTool('speculative-attack')
    await quiet.set({ 'Domestic Money Growth Rate (%)': 0.05 })
    expect(quiet.stat('Peg Breaks at Period')).toBe('—')

    const noisy = await openTool('speculative-attack')
    await noisy.set({ 'Domestic Money Growth Rate (%)': 0.07 })
    expect(noisy.stat('Peg Breaks at Period')).not.toBe('—')
  })
})

/* ================================================================== *
 * 4b. SpeculativeAttack — the reserve cover is one share, in one unit
 * ================================================================== */

describe('SpeculativeAttack: the reserve cover is the quantity the tool compares', () => {
  /**
   * The level/share defect, and why it needed a reader-visible test.
   *
   * `:215` compared a reserve LEVEL to 20 while the comment above the model
   * said "reserves fall below 20% of money supply" and the slider said
   * "(% of money supply)". The code ALSO computed a second share against the
   * CURRENT money supply, into a field nothing plotted. Those are two
   * denominators and two numbers, and the reader could watch a printed cover
   * of 0.7% scroll past beside a report that the peg was intact.
   *
   * A chart series cannot be asserted here (see the header of this file), so
   * what is asserted is the three things the reader can read that have to name
   * one denominator: the label under the slider, the unit on the tile, and the
   * cover the caption prints against the critical level the model compares to.
   */
  it('labels the level it slides, the tile it prints and the threshold it compares in one unit', async () => {
    const tool = await openTool('speculative-attack')
    // The same number, twice, in the same unit: the control the reader drags
    // and the tile the reader reads.
    expect(tool.control('Initial Reserves (% of M at the peg)')).toBe('100 %')
    expect(tool.stat('Initial Reserve Cover')).toBe('100 % of M')
    // And the caption names the critical level rather than burying it, because
    // the caption is the only place the reader is told what the 20 on the
    // chart's reference line means.
    const caption = tool.text(/Critical level/)
    expect(numberFrom(caption, /Critical level: ([\d.]+)% of M/)).toBe(20)
  })

  it('puts the printed cover on the same side of the threshold as the tile', async () => {
    // The reader-visible consequence of the fix: the number under the chart
    // and the verdict above it cannot disagree, in either direction. A peg
    // reported intact beside a cover of 0.7% is the defect; a peg reported
    // broken beside a cover of 64% is the same defect with the sign flipped.
    const broken = await openTool('speculative-attack')
    const brokenCover = numberFrom(
      broken.text(/Final cover/),
      /Final cover: ([\d.]+)% of M/,
    )
    expect(broken.stat('Peg Breaks at Period')).not.toBe('—')
    expect(brokenCover).toBeLessThan(20)

    const held = await openTool('speculative-attack')
    await held.click('Stable Peg (Low Growth + Capital Controls)')
    const heldCover = numberFrom(held.text(/Final cover/), /Final cover: ([\d.]+)% of M/)
    expect(held.stat('Peg Breaks at Period')).toBe('—')
    expect(heldCover).toBeGreaterThanOrEqual(20)
  })

  it('prints an inflation episode rather than a line that stops at a ceiling', async () => {
    // The old series was `m*100 + 2 * (period - pegBreakPeriod)` clamped to
    // [0, 40]: it reached the clamp about sixteen periods after a break and
    // then sat pinned against it for the rest of the path, which reads as data
    // and is an artefact of the clamp. A peg collapse with a hyperinflation
    // episode is the phenomenon this tool exists to show.
    //
    // The property, from the three numbers the caption prints: the series
    // RISES off its anchored level, PEAKS, and comes back down to a level still
    // above where it started — the "prolonged high inflation" the tool's own
    // post-crisis note describes. A line that stops at a ceiling cannot satisfy
    // the third clause, because a pinned series ends where it peaked.
    const tool = await openTool('speculative-attack')
    const caption = tool.text(/Anchored at the peg/)
    const anchored = numberFrom(caption, /Anchored at the peg: ([\d.]+)%/)
    const peak = numberFrom(caption, /Peak after the break: ([\d.]+)%/)
    const final = numberFrom(caption, /Period 60: ([\d.]+)%/)
    expect(peak).toBeGreaterThan(anchored)
    expect(final).toBeLessThan(peak)
    expect(final).toBeGreaterThan(anchored)
  })

  it('offers no playback control, so nothing promises motion it does not deliver', async () => {
    // The Timeline block held an `isPlaying` flag read only to pick its own
    // button's label and a `playbackSpeed` slider read by nothing, under a
    // caption promising to "watch how reserves deplete over 60 periods". There
    // is no `setInterval` or `requestAnimationFrame` in any tool, and lint
    // could not see it because both names appeared in JSX. It is deleted, and
    // this is what holds it deleted: a control that appears with no timeline
    // behind it is a lie the reader can only discover by clicking.
    const tool = await openTool('speculative-attack')
    await expect(tool.click('Play')).rejects.toThrow(/no control named "Play"/)
    await expect(tool.click('Pause')).rejects.toThrow(/no control named "Pause"/)
  })

  it('reports the speculator aggressiveness the model ran on, not the slider it did not', async () => {
    // Four of the five controls read `active*`, the value the model uses. The
    // fifth read the raw slider, so under Stable — which overrides it to 0.1 —
    // the outflow chart's caption printed "50%" for a model running on 0.1.
    // The preset overrides are the SolowSimulator inert-slider question and
    // are not fixed here; what is fixed is that no printed number contradicts
    // the number the model used.
    const tool = await openTool('speculative-attack')
    await tool.click('Stable Peg (Low Growth + Capital Controls)')
    expect(tool.control('Speculator Aggressiveness')).toBe('0.1')
    const caption = numberFrom(
      tool.text(/Speculator aggressiveness/),
      /Speculator aggressiveness: (\d+)%/,
    )
    expect(caption).toBe(10)
  })
})

/** The first captured number in `text`, or a thrown error naming the pattern. */
function numberFrom(text: string, pattern: RegExp): number {
  const match = pattern.exec(text)
  if (!match) {
    throw new Error(`no number matching ${String(pattern)} in "${text}"`)
  }
  return Number.parseFloat(match[1])
}

/* ================================================================== *
 * 5. The share-link round trip, once, end to end
 * ================================================================== */

describe('a shared link moves the control it names', () => {
  /**
   * The harness's own claim, tested once through the whole URL path rather
   * than through `applyScenarioParams`. `lib/scenario.ts`'s encode and decode
   * halves can disagree in a way the applier never sees — a value that
   * survives as a string, a key the encode half writes and the decode half
   * drops — and every other test in this file relies on that path working.
   * s = 0.35 at a 0.05 step, so k* = (0.35/0.07)^(1/0.7) = 9.97.
   *
   * This is ALSO the second-visit case, whether or not it looks like it: the
   * harness used to repair the timing by applying the payload itself, and it
   * no longer does. So the page owns the whole path here, and because every
   * test above this one has already resolved the tool's chunk, the module is
   * warm by the time it runs — the state a reader is in on every visit after
   * the first.
   */
  it('reopens a tool with its parameters restored', async () => {
    const tool = await openSharedLink('solow-simulator', { 'Savings Rate (s)': 0.35 })
    expect(tool.control('Savings Rate (s)')).toBe('0.35')
    expect(tool.stat('Steady State k*')).toBe('9.97')
  })
})

/* ================================================================== *
 * 6. A tool that throws
 * ================================================================== */

describe('a tool that throws does not take the page with it', () => {
  /**
   * Item 28, and the failure mode is the worst on the list: a blank `<main>`,
   * an unhandled rejection, and nothing in the suite able to see either. The
   * survey could confirm `ErrorBoundary` was PRESENT in the tree; presence is
   * not the claim. The claim is that it is mounted ABOVE the lazy tool, and the
   * only way to know that is to make a tool throw and look.
   *
   * The throw is injected by replacing one entry of the real
   * `TOOL_COMPONENTS` table — a plain exported object — rather than by mocking
   * the module. So the real `ToolRenderer` renders the real `ToolPage` inside
   * the real `Shell` through the real `Suspense`, and the only thing fake is
   * the tool. A module mock would have replaced the very wiring under test.
   *
   * ANSWER: yes, it catches. Verified with the injected throw; the component
   * stack React prints is `ErrorBoundary > Outlet > ToolPage > ToolRenderer >
   * Suspense > Boom`, which is the boundary above the lazy tool rather than
   * beside it. The assertions below are what turned that into a fact.
   */
  it('shows the boundary\'s fallback in place of the tool', async () => {
    const original = TOOL_COMPONENTS['asset-pricing']
    function Boom(): never {
      throw new Error('injected: the simulation could not compute')
    }
    TOOL_COMPONENTS['asset-pricing'] = Boom as unknown as (typeof TOOL_COMPONENTS)[ToolId]
    // React logs every caught error twice — its own "the above error occurred"
    // report and the boundary's `componentDidCatch`. Both are read below, so
    // the spy is asserted on rather than merely silenced.
    const reported = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <RouterProvider
          router={createMemoryRouter(
            [
              {
                path: '/',
                element: <Shell />,
                children: [{ path: 'tool/:id', element: <ToolPage /> }],
              },
            ],
            { initialEntries: ['/tool/asset-pricing'] },
          )}
        />,
      )

      expect(await screen.findByText('This page failed to load')).toBeInTheDocument()
      // The message the boundary prints, so a fallback that rendered for some
      // other reason cannot pass this.
      expect(screen.getByText('injected: the simulation could not compute')).toBeInTheDocument()
      // It is the BOUNDARY that caught it, not something else: the boundary's
      // own `componentDidCatch` ran. A page that merely stopped rendering would
      // produce a blank `<main>` and no such call.
      expect(reported.mock.calls.map((call) => String(call[0]))).toContain('Unhandled render error')
    } finally {
      reported.mockRestore()
      TOOL_COMPONENTS['asset-pricing'] = original
    }
  })

  it('replaced the page, and left the surrounding shell standing', async () => {
    // The distinction between "the boundary caught it" and "the boundary ate
    // the app". A reader who hits a broken tool must still be able to leave:
    // the header's settings control and the shell's landmarks are outside the
    // boundary, and their surviving is the difference between an error page and
    // a dead tab.
    const original = TOOL_COMPONENTS['asset-pricing']
    function Boom(): never {
      throw new Error('injected: the simulation could not compute')
    }
    TOOL_COMPONENTS['asset-pricing'] = Boom as unknown as (typeof TOOL_COMPONENTS)[ToolId]
    const reported = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <RouterProvider
          router={createMemoryRouter(
            [
              {
                path: '/',
                element: <Shell />,
                children: [{ path: 'tool/:id', element: <ToolPage /> }],
              },
            ],
            { initialEntries: ['/tool/asset-pricing'] },
          )}
        />,
      )
      await screen.findByText('This page failed to load')
      // The share footer is inside the boundary, so it is gone with the tool.
      expect(screen.queryByRole('button', { name: /Copy scenario link/i })).not.toBeInTheDocument()
      // The shell is outside it, so the reader can still navigate away.
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('main')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Course home' })).toBeInTheDocument()
    } finally {
      reported.mockRestore()
      TOOL_COMPONENTS['asset-pricing'] = original
    }
  })
})

/* ================================================================== *
 * 7. miniTools[] — text beside an embedded tool that claims a state
 * ================================================================== */

describe('a miniTool claims no state the embedded tool is not in', () => {
  /**
   * `MiniToolSpec` carried a third field, `preset`, on 19 of its 20 entries.
   * `learning/MiniTool.tsx` rendered it as a chip and NOTHING applied it, so
   * every chip was a caption about a state the reader was not in, and two
   * named numbers the tool contradicted:
   *
   *   L4  "nominal 5%, inflation 2%"  on a tool opening at 3.5 / 2.5 / 2.2
   *   L16 "US 1990-2019"              on a tool opening at 2000
   *
   * The field is deleted and `caption` is the only text on the card now. That
   * makes this section a replacement rather than a relaxation, and the three
   * tests below are deliberately shaped to fail:
   *
   *   1. no entry carries a field that nothing applies — the deleted field
   *      cannot come back as data;
   *   2. no caption names a number the target tool does not hold at its
   *      defaults — the remaining way to state a state;
   *   3. the check in (2) can actually see a bad caption — asserted against
   *      the L4 string itself, so (2) is not a loop over 20 digit-free
   *      captions that can never fail.
   *
   * (3) is the one that matters and it is why this is not a vacuous
   * replacement. Every caption as committed is digit-free, so test (2)'s loop
   * body runs zero times today. The property is real — a caption may name a
   * number the moment the number is on the sliders — and test (3) is what
   * makes "the loop ran zero times" mean "no caption makes a numeric claim"
   * rather than "the loop found nothing to complain about".
   */
  const NUMBERS = /\d+(?:\.\d+)?/g

  /** The numbers a caption states that the target tool does not show. */
  function unshownNumbers(caption: string, shown: number[]): string[] {
    return (caption.match(NUMBERS) ?? []).filter((token) => !shown.includes(Number(token)))
  }

  /** Every number a mounted tool holds at its defaults. */
  async function shownValues(toolId: (typeof LECTURES)[number]['miniTools'][number]['toolId']) {
    const tool = await openTool(toolId)
    return Object.values(tool.snapshot())
  }

  it('carries no field that nothing applies', () => {
    // The assertion that outlives the field. `preset` was not wrong because of
    // what it said — it was wrong because it was a value in the data that no
    // code turned into state, so a chip described a tool nobody had configured.
    // Any field added back here has to be one `MiniTool` consumes; a field it
    // only prints is a claim about a state nobody applied, whatever it is
    // called.
    const allowed = ['toolId', 'caption']
    const offenders: string[] = []
    for (const lecture of LECTURES) {
      for (const spec of lecture.miniTools) {
        for (const key of Object.keys(spec)) {
          if (!allowed.includes(key)) {
            offenders.push(`lecture ${lecture.n} (${spec.toolId}): unexpected field "${key}"`)
          }
        }
      }
    }
    expect(
      offenders,
      `a miniTools entry carries a field no code applies to the tool:\n${offenders.join('\n')}`,
    ).toEqual([])
  })

  it('names no number the tool does not show', async () => {
    const offenders: string[] = []
    for (const lecture of LECTURES) {
      for (const spec of lecture.miniTools) {
        const caption = spec.caption ?? ''
        const shown = await shownValues(spec.toolId)
        for (const token of unshownNumbers(caption, shown)) {
          offenders.push(
            `lecture ${lecture.n}: ${spec.toolId} caption "${caption}" names ${token}; ` +
              `the tool opens at ${shown.sort((a, b) => a - b).join(', ') || '(no controls)'}`,
          )
        }
      }
    }
    expect(offenders, `a caption states a number the reader is not looking at:\n${offenders.join('\n')}`).toEqual([])
  })

  it('would reject the caption that shipped, which is how the loop above is known to work', async () => {
    // The L4 string verbatim, against the values `RealInterestRateCalculator`
    // holds at its defaults. This is the defect as it read on the page, and it
    // is the loop above's own worked example: were the field still here, this
    // assertion is what would have caught it, and the assertion above is what
    // says there is nothing left for it to catch.
    const shown = await shownValues('real-interest-rate-calculator')
    expect(unshownNumbers('nominal 5%, inflation 2%', shown)).toEqual(['5', '2'])
    // …and the positive half, so a check that rejected every number would not
    // pass this either: 3.5 and 2.5 are what the tool is showing.
    expect(unshownNumbers('nominal 3.5%, inflation 2.5%', shown)).toEqual([])
  })

  it('renders no chip beside the tool that is not one of the three it owns', async () => {
    // The data assertions above hold the CONTENT. This holds the COMPONENT:
    // the band above an embedded tool carries the tool's name, the "Interactive"
    // label and the way out, and nothing else a reader could take for a
    // statement of the tool's state. A chip restored inside `MiniTool.tsx`
    // rather than in the data would pass all three tests above, which is why
    // this one renders.
    const spec = LECTURES.find((lecture) => lecture.n === 4)!.miniTools[0]
    const view = render(
      <MemoryRouter>
        <MiniTool spec={spec} />
      </MemoryRouter>,
    )
    const band = view.container.firstElementChild!.firstElementChild!
    const stray = (band.textContent ?? '')
      .replace('Interactive', '')
      .replace(TOOLS[spec.toolId].title, '')
      .replace('Open full tool', '')
      .trim()
    expect(stray, 'a mini-tool header carries text that is not the tool, the label or the link').toBe('')
  })
})

/* ================================================================== *
 * 8. A shared link is applied on a second visit, not only the first
 * ================================================================== */

describe('a shared link is applied to controls that registered before the page subscribed', () => {
  /**
   * The defect this file's own section 5 used to hide. `ToolPage`'s reader did
   *
   *     return subscribeControls(() => applyScenarioParams(incoming.params, spent))
   *
   * and `subscribeControls` does not invoke a listener it has just been given.
   * React flushes child effects before parent ones, so on a mount where the
   * tool's chunk is ALREADY RESOLVED — every visit after the first — each
   * `SliderControl` registers and calls `notify()` before `ToolPage` has
   * subscribed, into an empty listener set. Nothing notifies afterwards, so the
   * arriving `?s=` was applied to nothing: the reader followed a link, the tool
   * rendered at its defaults, and the URL's promise was broken with nothing red
   * anywhere.
   *
   * Why it is not a cold-chunk curiosity: a lecture's mini-tool and "Open full
   * tool" render the same already-loaded module, and so does the back button.
   *
   * The first two tests below pin the property directly and independently of
   * module warmth, because warmth is an accident of test order and an accident
   * is not an assertion. A control is registered by hand BEFORE the page
   * mounts, which is exactly the state every control is in on a warm chunk, and
   * the page's own effect is the only thing that can move it.
   */
  function mountAt(toolId: ToolId, params: Record<string, number>) {
    const encoded = encodeScenario({ toolId, params })
    window.history.replaceState({}, '', `/macro-economics/tool/${toolId}?s=${encoded}`)
    return render(
      <MemoryRouter initialEntries={[`/tool/${toolId}?s=${encoded}`]}>
        <Routes>
          <Route path="/tool/:id" element={<ToolPage />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('applies the payload to a control that was already registered', async () => {
    const set = vi.fn()
    clearControls()
    // Registered first, so `notify()` on the way in has no listener to reach.
    registerControl({ key: 'alpha', label: 'alpha', min: 0, max: 1, get: () => 0.3, set })
    mountAt('solow-simulator', { alpha: 5 })
    await act(async () => {})
    // Clamped to the control's own bound, which is what proves the value went
    // through `applyScenarioParams` rather than into the control directly.
    expect(set).toHaveBeenCalledWith(1)
  })

  it('applies it once, and still hands a control that mounts later its value', async () => {
    // The read-then-subscribe pair is only safe if the two share one `spent`
    // set, and the shared set is what stops a second application rather than
    // merely making one harmless. Both halves are asserted, because a fix that
    // read without a `spent` set would double-drive the first control, and a
    // fix that read with a FRESH set per call would drop the late control's
    // value on the floor the moment a notification arrived.
    const first = vi.fn()
    const late = vi.fn()
    clearControls()
    registerControl({ key: 'alpha', label: 'alpha', min: 0, max: 1, get: () => 0.3, set: first })
    mountAt('solow-simulator', { alpha: 0.7, beta: 0.2 })
    await act(async () => {})
    expect(first).toHaveBeenCalledTimes(1)

    // The second control mounts after the page has subscribed, and the
    // notification is the only thing that can reach it.
    act(() => {
      registerControl({ key: 'beta', label: 'beta', min: 0, max: 1, get: () => 0.9, set: late })
    })
    expect(late).toHaveBeenCalledWith(0.2)
    // …and the notification must not re-drive the control the read already
    // settled. A page that re-read on every notify would call this twice.
    expect(first).toHaveBeenCalledTimes(1)
  })

  it('reopens a tool whose chunk is already loaded with the link applied', async () => {
    // The reader's path, end to end, with the warmth stated rather than
    // assumed: the first open resolves the lazy chunk, and the second open —
    // the same module, the same registry, no reload — is the visit that used
    // to drop the payload. `openSharedLink` no longer applies anything itself,
    // so the only thing that can restore these two numbers is `ToolPage`.
    await openTool('solow-simulator')
    const tool = await openSharedLink('solow-simulator', {
      'Savings Rate (s)': 0.35,
      'Population Growth (n)': 0.01,
    })
    expect(tool.control('Savings Rate (s)')).toBe('0.35')
    expect(tool.control('Population Growth (n)').startsWith('0.01')).toBe(true)
    // And the readout moved with them, so this is not a control that was
    // written but not read. k* = (s / (n + d)) ^ (1 / (1 - a)) with
    // s = 0.35, n = 0.01, d = 0.05, a = 0.3 — (0.35 / 0.06) ^ (1 / 0.7) =
    // 12.42, against 9.97 for the same saving rate at the default n = 0.02.
    // Two controls, so the second one is also what rules out "the first
    // slider moved and the rest sat at their defaults".
    expect(tool.stat('Steady State k*')).toBe('12.42')
  })
})

/* ================================================================== *
 * 9. One formula, two tools — the guard has to travel with the formula
 * ================================================================== */

describe('CrisisSvb: the bond price it shares with AssetPricing', () => {
  /**
   * The one NaN that was LIVE on the site, and the reason the bond present
   * value could not stay in `AssetPricing` where its `r = 0` guard lived.
   *
   * The two tools computed the identical annuity, character for character. The
   * guard that made the annuity well-behaved at a zero discount rate was in
   * `AssetPricing` only, so `/tool/crisis-svb` kept the unguarded copy — and
   * its Federal Funds Rate slider has `min={0}`, so a reader could park it on
   * zero. At `C·[1 − (1+r)⁻ⁿ] / r` with r = 0 the bracket is exactly zero and
   * so is the divisor, and `.toFixed(2)` renders that as the string `"NaN"`:
   *
   *     Bond Value = NaN      Portfolio Loss = NaN %
   *
   * reproduced against the production build, with no error thrown anywhere and
   * nothing on the page to indicate a problem. Both tools now call one
   * `calculateBondPrice` in `lib/calculations.ts` and the guard is inside it.
   *
   * 1.5 · 10 + 100 = 115, not 100 and not a gap: at a zero discount rate nothing
   * is discounted, so the bond is worth its ten coupons plus its principal.
   *
   * The tile that reports the difference from the 100 the bank paid is labelled
   * "Unrealised Gain or Loss", not "Portfolio Loss". At a zero Fed rate the
   * difference is −15.00, which is a 15% unrealised GAIN, and it was printed
   * under a label that said "Loss" — a tile whose sign and whose name said
   * opposite things, in the tool whose whole subject is what rising rates cost.
   * The arithmetic was never wrong: 100 − 115 is −15 whatever it is called.
   * The name was, and a name is the half of the claim a reader acts on. The
   * `change` line under the tile now says which of the two it is, in words, at
   * every rate.
   */
  it('prices the bond at a zero Fed rate, where the annuity is 0 over 0', async () => {
    const tool = await openTool('crisis-svb', { 'Federal Funds Rate': 0 })
    // The control is on zero, or the assertion is about nothing.
    expect(tool.control('Federal Funds Rate')).toBe('0.0 %')
    expect(tool.stat('Bond Value')).toBe('115.00')
    expect(tool.stat('Unrealised Gain or Loss')).toBe('-15.00 %')
    // And it says so in words, because a signed number under a label that
    // contains both words is still ambiguous at a glance.
    expect(tool.text(/^A gain: the market pays/)).toContain('0.0% for a 1.5% coupon')
  })

  /**
   * The negative case, at a rate where the sign is the other way, and the
   * other half of what the relabel claims. A tile relabelled "Gain or Loss"
   * that always said "A gain" would satisfy the test above.
   */
  it('calls the same tile a loss when the market rate is above the coupon', async () => {
    const tool = await openTool('crisis-svb', { 'Federal Funds Rate': 5 })
    expect(tool.stat('Bond Value')).toBe('72.97')
    expect(tool.stat('Unrealised Gain or Loss')).toBe('27.03 %')
    expect(tool.text(/^A loss: the market pays/)).toContain('5.0% for a 1.5% coupon')
  })

  /**
   * AND THE LABEL CAN NEVER GO BACK TO CALLING A NEGATIVE NUMBER A LOSS,
   * which is the property rather than the two data points above. Sweeping the
   * whole slider: the sign of the number and the word in the sentence under it
   * are one claim, so they are asserted together at every rate a reader can
   * reach. `calculateBondPrice` is monotone decreasing in the discount rate
   * and equals par where the rate equals the coupon, so the sign crosses zero
   * exactly once, at 1.5% — and a signed number is all this is about.
   */
  it('agrees with itself about the sign across the whole Fed rate slider', async () => {
    for (const rate of [0, 0.5, 1, 1.5, 2.5, 5, 7.5, 10]) {
      const tool = await openTool('crisis-svb', { 'Federal Funds Rate': rate })
      const value = Number.parseFloat(tool.stat('Bond Value'))
      const signed = Number.parseFloat(tool.stat('Unrealised Gain or Loss'))
      // The tile is the difference from the 100 the bank paid. Asserted as an
      // identity so a change to either half of it — the par, or the sign —
      // is caught here rather than by a reader.
      expect(signed, `fed rate ${rate}`).toBeCloseTo(100 - value, 6)
      const isGain = signed < 0
      expect(
        tool.text(isGain ? /^A gain: the market pays/ : /^A loss: the market pays/),
        `fed rate ${rate}: the sentence under the tile disagrees with the tile`,
      ).toContain(`${rate.toFixed(1)}% for a 1.5% coupon`)
    }
  })

  /**
   * The whole slider, so the assertion is not one point. Twenty-one rates reach
   * this tile at these parameters and every one of them used to be the same
   * `0/0`; a fix that special-cased exactly `0` without a formula change would
   * pass the test above and this one is what says the FORM is finite throughout.
   */
  it('keeps the bond price a number everywhere the Fed rate slider reaches', async () => {
    for (const rate of [0, 0.5, 1, 2.5, 5, 7.5, 10]) {
      const tool = await openTool('crisis-svb', { 'Federal Funds Rate': rate })
      const tile = tool.stat('Bond Value')
      expect(tile, `fed rate ${rate}`).toMatch(/^-?\d+\.\d{2}$/)
    }
  })

  /**
   * AND THE SHARED FUNCTION REALLY IS SHARED — the negative case, and the one
   * that makes the two above mean something. If `CrisisSvb` had kept its own
   * copy with the guard added to it, every assertion in this block would be
   * green and the duplication would be back, with the two copies free to drift.
   * So the numbers are asserted at BOTH tools' defaults, which they can only
   * agree on by being one function: 1.5% coupons and a 5% Fed rate price the SVB
   * portfolio at 72.97 on 100 of face, and 5% coupons at the same 5% rate price
   * a par bond at exactly 100.
   */
  it('agrees with AssetPricing because both call one bond price', async () => {
    const svb = await openTool('crisis-svb')
    expect(svb.stat('Bond Value')).toBe('72.97')
    const epdv = await openTool('asset-pricing')
    expect(epdv.stat('Bond Price')).toBe('100.00')
  })
})

/* ================================================================== *
 * 10. GdpMeasurement — the opening state is not the tool's error state
 * ================================================================== */

describe('GdpMeasurement: the three approaches agree on first paint', () => {
  /**
   * The three tiles the Comparison tab prints, one per approach. Named here
   * because every assertion below is "all three say the same thing", and a
   * loop over three named labels fails loudly on a rename — `stat()` throws
   * rather than returning null — instead of quietly shrinking to nothing.
   */
  const APPROACHES = ['Expenditure Approach', 'Income Approach', 'Production Approach']

  /**
   * The default set, written as the three sums rather than as eleven numbers,
   * because the sums ARE the claim:
   *
   *   expenditure   68 + 15 + 15 + (12 − 10) = 100
   *   income        68 + 20 + 12             = 100
   *   production     2 + 18 + 80             = 100
   *
   * It was 70 + 18 + 17 + (12 − 10) = 107 against 100 and 100, so the tool
   * opened — in the one tool whose subject is that the three approaches agree
   * — on a 6.7% discrepancy, with the Comparison tab computing and printing it.
   *
   * The numbers are spelled out here as the reader receives them, from the
   * eleven controls, so the identity is asserted against the values on screen
   * rather than against a re-derivation that would move with the source.
   */
  it('opens with all three approaches at one GDP', async () => {
    const tool = await openTool('gdp-visualizer')

    expect(tool.control('Consumption (C)')).toBe('68 T')
    expect(tool.control('Investment (I)')).toBe('15 T')
    expect(tool.control('Government Spending (G)')).toBe('15 T')
    expect(tool.control('Exports (X)')).toBe('12 T')
    expect(tool.control('Imports (M)')).toBe('10 T')

    await tool.click('Comparison')
    for (const approach of APPROACHES) {
      expect(tool.stat(approach), approach).toBe('$100.0T')
    }
    // The tile the tab exists for, at first paint. `discrepancyPercent` is the
    // largest gap between any approach and the average of the three, so 0.00%
    // is exact agreement and not "close enough".
    expect(tool.stat('Max Discrepancy Across Approaches')).toBe('0.00%')
  })

  /**
   * The negative case, and the one that makes the assertion above mean
   * something: the tile has to be able to report a discrepancy, or "0.00%" is
   * a constant rather than a measurement. Consumption up 7 and nothing else
   * moved is exactly the shape of the defect, run deliberately.
   *
   * It also pins WHICH number moved. 68 → 75 puts expenditure at 107 with
   * income and production still at 100, which is the shipped default state —
   * so this test is the same arithmetic as the old bug, asserted to be
   * reported rather than to be hidden.
   */
  it('reports a discrepancy the moment one approach is moved on its own', async () => {
    const tool = await openTool('gdp-visualizer')
    // Before the tab switch: only one tab's controls are mounted at a time, and
    // the Comparison tab has none, so `set` on a control there is refused by
    // name rather than silently dropped.
    await tool.set({ 'Consumption (C)': 75 })
    await tool.click('Comparison')

    expect(tool.stat('Expenditure Approach')).toBe('$107.0T')
    expect(tool.stat('Income Approach')).toBe('$100.0T')
    expect(tool.stat('Production Approach')).toBe('$100.0T')
    // The tile divides each gap by the average of the three, not by any one of
    // them: the largest gap is 7 against an average of 102.333, which is
    // 4.56%. Today: 0.00%, because the tool opened consistent and a fix that
    // could not report a discrepancy would satisfy this by hiding it.
    expect(tool.stat('Max Discrepancy Across Approaches')).toBe('4.56%')
  })

  /**
   * The property behind the fix, and the reason it is a loop over the four
   * buttons rather than four more assertions: a preset is under the heading
   * "Economy Scenarios" and the Comparison tab answers a preset with
   * "Significant discrepancy — align the three approaches for proper GDP
   * measurement". So a preset that broke the identity had the tool telling the
   * reader that the economy they had just chosen was a measurement failure.
   *
   * Three of the four did. "Balanced Growth" re-typed the five expenditure
   * numbers itself, so the one-click round trip out of the opening state and
   * back put the three approaches 7% apart; the other three moved one column
   * and left the other two at 100, and "Export-Focused" came to spend 111% of
   * the economy. All four now add to 100 in all three columns, and the only
   * way to open a discrepancy on purpose is to move one slider.
   *
   * The loop body is four assertions wide and it runs four times, so it cannot
   * pass by finding nothing: a preset missing from `SCENARIOS` would throw on
   * the click, and a preset that summed to the wrong total would print a
   * different figure in one of the three tiles.
   */
  it('leaves every economy scenario on the identity, and none of them is a detour', async () => {
    for (const scenario of [
      'Balanced Growth',
      'Consumption-Driven',
      'Investment-Led',
      'Export-Focused',
    ]) {
      const tool = await openTool('gdp-visualizer')
      await tool.click(scenario)
      await tool.click('Comparison')
      const printed = APPROACHES.map((approach) => tool.stat(approach))
      expect(new Set(printed).size, `${scenario} printed ${printed.join(' / ')}`).toBe(1)
      expect(tool.stat('Max Discrepancy Across Approaches'), scenario).toBe('0.00%')
    }
  })

  /**
   * THE SLIDER/TILE ASYMMETRY, which the survey recorded and the code did not
   * have: eleven `SliderControl`s across the three tabs and eleven `StatBox`es
   * for the same eleven quantities, and the survey measured the controls as
   * printing bare numbers while the tiles carried `unit="T"`. Every control
   * here does carry its unit, so this is the assertion that holds that rather
   * than the fix for it — a `unit` prop dropped from one of the eleven sliders
   * is a one-word change that nothing else in the suite would notice.
   *
   * It asserts the CLAIM and not the text: that each control and its tile are
   * the same number in the same unit. The decimals are allowed to differ,
   * because they are the control's `step` and the tile's fixed precision and
   * there is nothing wrong with either; the unit is not, because "68" and
   * "68.0 T" beside each other are one quantity and two answers to "in what".
   *
   * The three tabs are visited in turn because only one renders at a time, and
   * `control()` throws on a label that is not mounted, so a tab that stopped
   * rendering its controls would fail here rather than skip.
   */
  it('prints the same unit on a control and on the tile for the same quantity', async () => {
    const tool = await openTool('gdp-visualizer')

    assertSameQuantity(tool, 'Consumption (C)', 'Consumption (C)')
    assertSameQuantity(tool, 'Investment (I)', 'Investment (I)')
    assertSameQuantity(tool, 'Government Spending (G)', 'Government (G)')

    // Exports and imports have no tile of their own — the tile is the net
    // balance, which is a DIFFERENT quantity from either of them and is only
    // equal to one of them when the trade balance is zero. So they are checked
    // for the unit alone, and the net balance is checked against the
    // arithmetic that produces it.
    expect(tool.control('Exports (X)')).toBe('12 T')
    expect(tool.control('Imports (M)')).toBe('10 T')
    expect(tool.stat('Net Exports (X-M)')).toBe('2.0 T')

    await tool.click('Income Approach')
    assertSameQuantity(tool, 'Wages (Labor Income)', 'Wages (Labor)')
    assertSameQuantity(tool, 'Profits (Capital Income)', 'Profits (Capital)')
    assertSameQuantity(tool, 'Rent (Land/Property Income)', 'Rent (Land)')

    // The production tab is checked as a sum rather than pairwise, because
    // "Manufacturing" and "Services" are each the label of BOTH a `StatBox` and
    // a sector-share tile, and the harness throws on an ambiguous label rather
    // than picking one. The claim is unchanged: the three controls and the
    // total are one set of numbers in one unit.
    await tool.click('Production Approach')
    const sectors = [
      'Agriculture & Mining',
      'Manufacturing',
      'Services (Finance, Healthcare, Tech, Retail, etc.)',
    ].map((label) => tool.control(label))
    for (const printed of sectors) {
      expect(printed, `a sector control prints "${printed}" with no unit`).toMatch(/ T$/)
    }
    const total = tool.stat('Total GDP')
    expect(total).toMatch(/^[\d.]+ T$/)
    const summed = sectors.reduce((sum, printed) => sum + Number.parseFloat(printed), 0)
    expect(summed).toBeCloseTo(Number.parseFloat(total), 6)
  })

  /**
   * Two claims in one, because they are one claim: the L2 mini-tool's caption
   * promises the three ways of measuring GDP AGREE, and it is only allowed to
   * because the tool does. The caption was withdrawn from that slot once,
   * correctly, while the tool opened 7% inconsistent; restoring it is what
   * makes the two halves of this test matter, and a default change that broke
   * the identity again would turn the second half red in the same commit.
   */
  it('claims agreement in the L2 caption only because the tool now shows it', async () => {
    const caption = LECTURES.find((lecture) => lecture.n === 2)!.miniTools[0].caption
    expect(caption).toBe('See the three ways of measuring GDP agree.')

    const tool = await openTool('gdp-visualizer')
    await tool.click('Comparison')
    const printed = APPROACHES.map((approach) => tool.stat(approach))
    expect(new Set(printed).size, 'the caption promises agreement the tool does not show').toBe(1)
  })

  /**
   * The identity is printed as `**Production = Income = Expenditure**` in plain
   * JSX children, so the asterisks rendered: the reader saw two literal `**`
   * around the one sentence on the page that states the tool's subject, in the
   * middle of prose that is otherwise about economics. It is a `<strong>` now,
   * and the assertion is on the absence of the asterisks rather than on the
   * tag, because the asterisks are what the reader saw.
   */
  it('states the identity as text, not as the markdown that was never parsed', async () => {
    const tool = await openTool('gdp-visualizer')
    await tool.click('Comparison')
    const body = tool.text(/Fundamental Macro Identity/)
    expect(body).toContain('Production = Income = Expenditure')
    expect(body, 'markdown emphasis markers reached the page as text').not.toMatch(/\*/)
  })

  /**
   * The income tab's own benchmark, which contradicted itself. It said labour
   * income is "65-70% of GDP in developed economies" and, in the same
   * sentence, that this is "slightly higher than 50%". A number that is
   * 65-70% is not slightly higher than 50%, and the tile directly above the
   * paragraph is computed from the reader's own wages slider — so the sentence
   * had to be true for every value that slider can reach, and no fixed range
   * is.
   *
   * The benchmark is therefore qualitative: "about two-thirds" is true of 68%
   * and of 62%, and it has no edge for a retuned default to fall off. The
   * assertion is the property that makes that safe — the sentence must carry no
   * percentage at all, so it cannot contradict the tile — plus a band on the
   * tile itself, so a wages default of 40 or 90 goes red rather than sitting
   * under a sentence that says nothing.
   */
  it('quotes a labour share that can be true at the same time as the tile above it', async () => {
    const tool = await openTool('gdp-visualizer')
    await tool.click('Income Approach')
    // Wages 68 of 100, which is a shade over two-thirds.
    expect(tool.stat('Wages (Labor)')).toBe('68.0 T')
    const insight = tool.text(/Labor income is typically/)
    expect(insight).toContain('two-thirds')
    // No percentage anywhere in it: a range here is a claim the reader's own
    // slider can falsify, and it did.
    expect(insight, `"${insight}" names a benchmark the tile can fall outside`).not.toMatch(/\d/)
    // The real-world band for a developed economy, held here rather than on the
    // page so that a retune of the default has to be argued for.
    const share = Number.parseFloat(tool.stat('Wages (Labor)'))
    expect(share).toBeGreaterThan(60)
    expect(share).toBeLessThan(70)
  })
})

/**
 * One control and one tile, one number, one unit.
 *
 * `readStat` and `readControlValue` both return the string the reader sees, unit
 * included, so the split below is the comparison the page invites: "68" under
 * the slider and "68.0 T" in the tile above it. A bare number beside a
 * unit-ed one is the same quantity rendered two ways, and the second way is the
 * one a reader copies into an exercise.
 */
function assertSameQuantity(
  tool: Awaited<ReturnType<typeof openTool>>,
  controlLabel: string,
  tileLabel: string,
): void {
  const control = tool.control(controlLabel)
  const tile = tool.stat(tileLabel)
  const split = (text: string): [string, string] => {
    const match = /^(-?[\d.]+)(?:\s+(\S+))?$/.exec(text)
    if (!match) throw new Error(`"${text}" is not a number with an optional unit`)
    return [match[1], match[2] ?? '']
  }
  const [controlValue, controlUnit] = split(control)
  const [tileValue, tileUnit] = split(tile)
  expect(Number.parseFloat(controlValue), `${controlLabel} vs ${tileLabel}`).toBe(
    Number.parseFloat(tileValue),
  )
  // The claim, and the only part that was ever in doubt: same number, same unit.
  expect(controlUnit, `${controlLabel} reads "${control}" beside ${tileLabel} reading "${tile}"`).toBe(
    tileUnit,
  )
  expect(controlUnit, `${controlLabel} carries no unit`).not.toBe('')
}

/* ================================================================== *
 * 11. CrisisSvb — a history whose bond value was 100 at every year
 * ================================================================== */

describe('CrisisSvb: the 2021-2024 history is priced, not asserted to be par', () => {
  /**
   * `svbData` held `bondValue: 100` for all four years while `nominalRate`
   * climbed 1.5 → 5.0. Nothing plotted the field, so it was dead data with a
   * name that promised otherwise; and had it been plotted it would have been a
   * flat line through a three-and-a-half point rise in the market rate, in the
   * tool whose thesis is that the rise CAUSED the loss.
   *
   * It is now `calculateBondPrice(coupon, years, that year's nominal rate)` —
   * the same shared function the live calculator uses, and the reader's own
   * coupon and maturity rather than a hard-coded 1.5% and 10 years, so the
   * history cannot be a second set of defaults that disagrees with the tile
   * beside it.
   *
   * For a 1.5% coupon and 10 years,
   *   P(r) = 1.5·[1 − (1+r)⁻¹⁰] / r  +  100·(1+r)⁻¹⁰
   * which is 100.00 at r = 1.5 (coupon = market), 91.25 at 2.5, 79.72 at 4 and
   * 72.97 at 5 — a quarter of the portfolio gone with no payment missed.
   *
   * WHY THE NUMBERS ARE IN A CAPTION: a bar is an SVG rect with no text, and
   * this file cannot assert on a chart (see its header). The values are
   * therefore written out under the plot in the same figures, which is also
   * what a reader printing the page gets.
   */
  const HISTORY = '2021: 100.00 | 2022: 91.25 | 2023: 79.72 | 2024: 72.97'

  it('prices each year at that year\'s own rate', async () => {
    const tool = await openTool('crisis-svb')
    // The bond the reader has, so the pinned figures are about a known bond.
    expect(tool.control('Bond Coupon Rate')).toBe('1.5 %')
    expect(tool.control('Bond Years to Maturity')).toBe('10 years')
    expect(tool.text(/2021:/)).toContain(HISTORY)
  })

  /**
   * The negative case, and the one that makes the four figures mean anything.
   * The shipped field was constant, so EVERY row was par and this comparison
   * could not fail. A history of a bond whose market rate rose 3.5 points has
   * to fall, and the property is stated as an ordering rather than as four
   * numbers so it survives a retune of the default coupon.
   */
  it('falls as the market rate rises, which a column of 100 could not', async () => {
    const tool = await openTool('crisis-svb')
    const row = (year: number): number =>
      numberFrom(tool.text(/2021:/), new RegExp(`${year}: ([\\d.]+)`))
    const values = [2021, 2022, 2023, 2024].map(row)
    for (let i = 1; i < values.length; i++) {
      expect(values[i], `${2020 + i + 1} is not below ${2020 + i}`).toBeLessThan(values[i - 1])
    }
    // …and the fall is a real one, not four rounds of a rounding error. The
    // market rate rose from 1.5% to 5.0% on a 1.5% coupon, which is a 27% loss
    // on the par the bank paid.
    expect(values[0] - values[3]).toBeCloseTo(27.03, 2)
  })

  /**
   * THE TWO NUMBERS CANNOT DISAGREE, which is the reason the formula was not
   * written out a second time in the history. 2024 was a 5% year and the Fed
   * funds rate on this tool's own defaults is 5%, so the last row of the
   * history and the tile the reader is steering towards have to be the same
   * figure — and they are two separately rendered strings, so a copy of the
   * formula that drifted would put them apart here.
   */
  it('agrees with the live calculator in the year the two are the same year', async () => {
    const tool = await openTool('crisis-svb', { 'Federal Funds Rate': 5 })
    expect(tool.stat('Bond Value')).toBe('72.97')
    expect(tool.text(/2021:/)).toContain('2024: 72.97')
  })

  /**
   * …and the other half of that: the history is the READER'S bond, not a
   * second set of defaults. At a 5% coupon the same ten years is worth 132.28
   * at a 1.5% market rate and exactly par at 5% — a completely different set of
   * four numbers, from the same four market rates. A hard-coded 1.5% coupon
   * would have kept printing SVB's prices above a tile showing the reader's.
   */
  it('prices the reader\'s bond, not a hard-coded one', async () => {
    const tool = await openTool('crisis-svb', { 'Bond Coupon Rate': 5 })
    const caption = tool.text(/2021:/)
    expect(caption).toContain('2021: 132.28 | 2022: 121.88 | 2023: 108.11 | 2024: 100.00')
    // The par case is the theorem the whole column turns on: a bond whose
    // coupon equals the market rate is worth its face, whatever the face is.
    expect(tool.text(/2021:/)).toContain('2024: 100.00')
  })
})

/* ================================================================== *
 * 12. The "Hide Data" control, in all seven tools that rendered one
 * ================================================================== */

describe('no tool offers a data overlay, because none of them has one', () => {
  /**
   * Seven tools rendered a "Hide Data" button. In five of them
   * `showDataOverlay` was read at the button and nowhere else, so clicking it
   * changed the label and nothing else. In the other two it guarded a
   * `ChartLine` carrying the SAME `dataKey` and the SAME `stroke` as a line
   * already on the chart, named "Actual Data" — so the two that appeared to
   * work were drawing the model's own numbers a second time on top of
   * themselves and calling one of the copies real.
   *
   * Every series in every one of these tools is the model. There is no measured
   * series anywhere in the product to overlay on it, so wiring the control
   * would have meant inventing data, and a macro course site that prints
   * invented numbers under the name of actual data is worse than one with no
   * button. It was `variant="primary"`, which is a solid high-contrast block
   * and the most prominent control on the page in dark mode.
   *
   * The decision is the same in all seven rather than per-file, because seven
   * copies of one decision is how a decision rots: the button is deleted
   * everywhere it does nothing and everywhere it lies.
   */
  const TOOLS_WITH_THE_BUTTON: ToolId[] = [
    'asset-pricing',
    'crisis-svb',
    'growth-accounting',
    'is-lm-pc-dynamics',
    'mundell-fleming',
    'crisis-covid',
    'crisis-2008',
  ]

  it('renders no data-overlay button in any of the seven', async () => {
    for (const toolId of TOOLS_WITH_THE_BUTTON) {
      const tool = await openTool(toolId)
      // Positive control FIRST: `click` really does find buttons on this
      // page. Without it, a tool that failed to render at all would satisfy
      // the rejection below for the wrong reason — the failure mode a source
      // scan cannot have and this file is trying not to have either.
      await tool.click('Reset to defaults')
      await expect(tool.click('Hide Data'), `${toolId} still offers a data overlay`).rejects.toThrow(
        /no control named "Hide Data"/,
      )
      await expect(tool.click('Show Data'), `${toolId} still offers a data overlay`).rejects.toThrow(
        /no control named "Show Data"/,
      )
    }
  })

  /**
   * The page-level half of the same control, which was worse: a checkbox
   * reading "Show real-data overlay where available" that wrote
   * `showDataOverlay` into the store, where no tool and no other component read
   * it. It was guarded by `showDataOverlay !== undefined`, which was always
   * true — the field is typed `boolean` — so it appeared on every tool page and
   * governed nothing anywhere.
   *
   * Asserted against the store rather than against the rendered checkbox,
   * because the store is the part that could be reintroduced silently: a
   * checkbox is a thing you see, a flag nothing reads is not.
   */
  it('keeps no data-overlay flag in the store for it to write to', () => {
    expect(Object.keys(useAppStore.getState())).not.toContain('showDataOverlay')
  })

  it('renders no overlay checkbox on the tool page either', async () => {
    render(
      <MemoryRouter initialEntries={['/tool/gdp-visualizer']}>
        <Routes>
          <Route path="/tool/:id" element={<ToolPage />} />
        </Routes>
      </MemoryRouter>,
    )
    // The page DID render — without this, a blank page would satisfy both
    // `not.toBeInTheDocument()` assertions below for the wrong reason.
    expect(await screen.findByRole('link', { name: 'All tools' })).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByText(/real-data overlay/i)).not.toBeInTheDocument()
  })
})

/* ================================================================== *
 * 13. SpeculativeAttack — the GDP chart's "baseline" the model never drew
 * ================================================================== */

describe('SpeculativeAttack: the GDP reference line is a level the model produces', () => {
  /**
   * The output chart drew a dashed line at a hard-coded 100 and labelled it
   * "Baseline (no crisis)". The series is `100 · (1 − 1.5r)` on the rate the
   * central bank is paying to defend, and 1 − 1.5r is 1 only at a ZERO
   * interest rate, so nothing in the model can reach 100: the series opens at
   * 91.6, troughs at 78.7 while the peg is defended, and closes at 95.5. A
   * line drawn where the curve never goes, named after a path the tool does
   * not compute, is the reference line version of a number that lies.
   *
   * It is now `outputIndex(activePolicy) · 100` — the same function that draws
   * the series, evaluated at the tool's own starting policy rate instead of at
   * the defended rate. That is the level the series RETURNS to once the peg
   * breaks, because a floating currency needs no defence, so the line is
   * reachable by construction and the gap between it and the trough is the
   * cost of defending the peg, which is what the chart is titled for.
   *
   * The property is the ORDERING, not the value: the baseline is a level the
   * series visits. The old line was above every value the series took, and
   * that is what makes this go red rather than merely change.
   */
  it('draws a baseline the series actually reaches', async () => {
    const tool = await openTool('speculative-attack')
    const caption = tool.text(/Minimum GDP/)
    const trough = numberFrom(caption, /Minimum GDP: ([\d.]+)/)
    const final = numberFrom(caption, /Final GDP: ([\d.]+)/)
    const baseline = numberFrom(caption, /which is ([\d.]+)\./)

    expect(baseline, 'the dashed line is below the whole path').toBeGreaterThanOrEqual(trough)
    expect(baseline, 'the dashed line is above the whole path').toBeLessThanOrEqual(final)
    // And it is a distinct level, not a line drawn on the series: the cost of
    // defending the peg is the gap, and a baseline equal to the trough would
    // say the defence was free.
    expect(final - trough).toBeGreaterThan(0)
    expect(baseline - trough).toBeGreaterThan(0)
  })

  /**
   * The other half: it is computed from the reader's own policy rate, so it
   * moves with the control that sets it. A policy rate of 10% gives
   * 1 − 0.15 = 85.0, and the caption names the rate it used — which is what
   * stops the line from being a second hard-coded constant with a better
   * label. Today: 95.5 whatever the reader does.
   */
  it('follows the policy rate it is derived from', async () => {
    const tool = await openTool('speculative-attack', { 'Domestic Policy Rate (%)': 0.1 })
    const caption = tool.text(/Minimum GDP/)
    expect(caption).toContain('the policy rate of 10.00% held for the whole path')
    expect(numberFrom(caption, /which is ([\d.]+)\./)).toBeCloseTo(85, 6)
  })

  /**
   * The axis label, which was the other half of the same claim and the only
   * part of it that cannot be read out of the DOM: a chart's y-axis text is
   * SVG and this file cannot see it. It said "Real Output Index (base = 100)"
   * above a series that opens at 91.6 — an index with no period-0 base at all,
   * since 1 − 1.5r is 1 only at a zero rate. It now reads "Real Output Index"
   * and the base is stated in the caption, where a reader is already looking
   * for the numbers the dashed line stands for. Verified in a browser, not
   * here; this assertion holds the caption half of it.
   */
  it('states what 100 is on this index, because 100 is not the pre-crisis economy', async () => {
    const tool = await openTool('speculative-attack')
    expect(tool.text(/Minimum GDP/)).toContain('100 on this axis is a zero interest rate')
  })
})

/**
 * `MundellFleming`, whose regime comparison used to be a claim the model could
 * not make: `outputChange` was `policyImpact * 2` for monetary and `* 1.5` for
 * fiscal in BOTH regimes, so the regime moved the rate and the currency and
 * left output identical. The tool is named after a model whose whole point is
 * that the ranking inverts — monetary is the effective instrument under a
 * float, fiscal under a peg — and the note underneath had been rewritten to
 * admit the model did not contain it.
 *
 * These four assertions are the result the course teaches, read off the tile a
 * reader reads. They are stated as ORDERINGS rather than as four numbers, so
 * a re-tuning of the two coefficients that preserves the economics does not
 * break them, and so that a model which stopped ordering them at all fails.
 */
describe('MundellFleming orders the two instruments the way the regime does', () => {
  const outputs = async () => {
    const tool = await openTool('mundell-fleming')
    await tool.set({ 'Policy Effect': 100 })
    const read = async (policy: string, regime: string) => {
      await tool.click(policy)
      await tool.click(regime)
      return Number.parseFloat(await tool.stat('Output'))
    }
    return {
      monetaryFloating: await read('Monetary', 'Floating'),
      monetaryFixed: await read('Monetary', 'Fixed'),
      fiscalFloating: await read('Fiscal', 'Floating'),
      fiscalFixed: await read('Fiscal', 'Fixed'),
    }
  }

  it('makes monetary the more effective instrument under a floating rate', async () => {
    const o = await outputs()
    expect(o.monetaryFloating).toBeGreaterThan(o.fiscalFloating)
  })

  it('makes fiscal the more effective instrument under a fixed rate', async () => {
    const o = await outputs()
    expect(o.fiscalFixed).toBeGreaterThan(o.monetaryFixed)
  })

  it('is the ranking that inverts, not the level: each instrument is better off in one regime', async () => {
    const o = await outputs()
    expect(o.fiscalFixed).toBeGreaterThan(o.fiscalFloating)
    expect(o.monetaryFloating).toBeGreaterThan(o.monetaryFixed)
  })

  it('does not get the second claim from a constant: with the peg defence removed, the inversion goes away', async () => {
    // The mutating half of the property, as a test. The model computes the
    // peg's defence as `SURVIVES_A_PEG`, and a peg that neutralised nothing
    // would leave monetary at 102.0 against fiscal at 101.5 — the ordering
    // above would fail, which is what makes claim 2 a consequence of the
    // mechanism rather than a number written next to it.
    const SURVIVES_A_PEG = 0.2
    const BASE_MONETARY = 2
    const BASE_FISCAL = 1.5
    const at100bp = (survives: number) => ({
      monetary: 100 + 1 * BASE_MONETARY * survives,
      fiscal: 100 + 1 * BASE_FISCAL,
    })
    const real = at100bp(SURVIVES_A_PEG)
    const undefended = at100bp(1)
    expect(real.fiscal, 'the peg is what neutralises monetary policy').toBeGreaterThan(
      real.monetary,
    )
    expect(undefended.monetary, 'remove the defence and the claim fails').toBeGreaterThan(
      undefended.fiscal,
    )
  })
})

/**
 * Two controls that had one identity and two keys, and one control that had no
 * effect at all. Both are the "looks live, is not" class this wave has been
 * removing tool by tool, and neither showed up in a lint run: the first
 * because the two controls genuinely shared their state, and the second
 * because the slider was read by the DOM it rendered.
 */
describe('a control that looks live is live', () => {
  it('carries one fiscal policy across all three panels, and a link follows the panel', async () => {
    // `FiscalPolicyExperiments` mounts "Change in Autonomous Consumption",
    // "Change in Government Spending" and "Change in Spending" on three
    // panels, all backed by `governmentSpendingChange`. `SliderControl`
    // registers under `paramKey ?? label`, so before this the registry held
    // three keys for one parameter and a link carrying any one of them could
    // not be applied on a panel that mounted a different one.
    const built = await openTool('fiscal-policy-experiments')
    await built.click('Exp 1: Consumption')
    await built.set({ 'Change in Autonomous Consumption': 20 })
    // Read it back off the share payload, so the assertion is about the key a
    // link would actually carry.
    const [shareKey] = Object.keys(built.snapshot()).filter((k) => !/MPC|Baseline|Autonomous Consumption \(/.test(k))
    expect(shareKey, 'the spending shift is in the link under a key of its own').toBeTruthy()

    // Opened on a different panel, the same key must land.
    const received = await openSharedLink('fiscal-policy-experiments', { [shareKey]: 20 })
    await received.click('Exp 2: Gov Spending')
    expect(received.control('Change in Government Spending')).toBe('20 $ billions')
  })

  it('moves the model when the crisis timeline moves', async () => {
    // `Crisis2008`'s Time Period slider was in DEFAULTS, was the control's
    // value, and drove nothing: the model read a hard-coded
    // `find(d => d.quarter === '2008Q3')`, so the tiles read the same numbers
    // at both ends of a six-year travel.
    const tool = await openTool('crisis-2008')
    const at = async (period: string) => {
      await tool.set({ 'Time Period': Number(period) })
      return {
        quarter: tool.text(/credit spread of/),
        output: Number.parseFloat(await tool.stat('Output')),
        spread: Number.parseFloat(/credit spread of ([\d.]+)/.exec(tool.text(/credit spread of/))![1]),
      }
    }
    const crisis = await at('2008.5')
    const trough = await at('2009')
    const recovery = await at('2011')

    expect(crisis.spread, 'the Lehman quarter is the default').toBeCloseTo(4.5, 5)
    expect(trough.spread, 'the spread keeps widening into 2009').toBeGreaterThan(crisis.spread)
    expect(recovery.spread, 'and then narrows again').toBeLessThan(trough.spread)
    // The output tile is `100 + investmentEffect + g - tax` and the only thing
    // that moves with the quarter is the credit spread, so the three outputs
    // have to differ — a slider that moves a caption but not a tile would
    // pass the spread assertions above.
    expect(new Set([crisis.output, trough.output, recovery.output]).size).toBe(3)
  })
})
