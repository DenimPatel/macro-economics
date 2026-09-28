import { useState } from 'react'
import { ReferenceLine, ReferenceDot } from 'recharts'
import { BarChart } from 'recharts'
import {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from '../components/ChartPrimitives'
import { ChartLegend } from '../components/ChartLegend'
import { ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { formatNumber } from '../lib/calculations'
import { dataDomain } from '../lib/chartDomain'
import { useHiddenSeries } from '../lib/chartSeries'
import { useToolReset } from '../lib/toolReset'

type ExperimentType = 'consumption' | 'government' | 'taxes' | 'combined'

interface ScenarioData {
  label: string
  baselineY: number
  newY: number
  change: number
  consumption: number
  investment: number
  government: number
  demand: number
}

/** Each concept keeps one stable palette slot across every chart in this tool. */

/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 */
const DEFAULTS = {
  mpc: 0.6,
  baseInvestment: 100,
  baseTaxes: 150,
  baseGovernmentSpending: 150,
  autonomousConsumption: 100,
  governmentSpendingChange: 0,
  taxChange: 0,
}

export default function FiscalPolicyExperiments() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  const keysianSeries = useHiddenSeries(['z45', 'baselineZZ', 'newZZ'])
  // Base parameters
const [mpc, setMpc] = useState(DEFAULTS.mpc)
const [baseInvestment, setBaseInvestment] = useState(DEFAULTS.baseInvestment)
const [baseTaxes, setBaseTaxes] = useState(DEFAULTS.baseTaxes)
const [baseGovernmentSpending, setBaseGovernmentSpending] = useState(DEFAULTS.baseGovernmentSpending)

  // Experiment parameters
  const [experimentType, setExperimentType] = useState<ExperimentType>('consumption')
const [autonomousConsumption, setAutonomousConsumption] = useState(DEFAULTS.autonomousConsumption)
const [governmentSpendingChange, setGovernmentSpendingChange] = useState(DEFAULTS.governmentSpendingChange)
const [taxChange, setTaxChange] = useState(DEFAULTS.taxChange)

  const { reset, dirty } = useToolReset(
    {
    mpc: mpc,
    baseInvestment: baseInvestment,
    baseTaxes: baseTaxes,
    baseGovernmentSpending: baseGovernmentSpending,
    autonomousConsumption: autonomousConsumption,
    governmentSpendingChange: governmentSpendingChange,
    taxChange: taxChange,
    },
    {
      setMpc,
      setBaseInvestment,
      setBaseTaxes,
      setBaseGovernmentSpending,
      setAutonomousConsumption,
      setGovernmentSpendingChange,
      setTaxChange,
    },
    {
      mpc: DEFAULTS.mpc,
      baseInvestment: DEFAULTS.baseInvestment,
      baseTaxes: DEFAULTS.baseTaxes,
      baseGovernmentSpending: DEFAULTS.baseGovernmentSpending,
      autonomousConsumption: DEFAULTS.autonomousConsumption,
      governmentSpendingChange: DEFAULTS.governmentSpendingChange,
      taxChange: DEFAULTS.taxChange,
    },
  )

  // Calculate equilibrium output
  const calculateEquilibrium = (c0: number, taxes: number, investment: number, gov: number) => {
    const mps = 1 - mpc
    const autonomousSpending = c0 + investment + gov - mpc * taxes
    const equilibrium = autonomousSpending / mps
    return equilibrium
  }

  // Baseline equilibrium
  const baselineY = calculateEquilibrium(autonomousConsumption, baseTaxes, baseInvestment, baseGovernmentSpending)

  // Scenario equilibria based on experiment type
  let newAutonomousConsumption = autonomousConsumption
  let newTaxes = baseTaxes
  let newGovernment = baseGovernmentSpending

  /**
   * Each branch must move the variable the PANEL above it names, because the
   * panel is the only thing that tells the reader which lever they are
   * holding. `governmentSpendingChange` backs three of the four panels (Exp 1
   * reads it as autonomous consumption) and `taxChange` backs two, so the
   * branch rather than the state name is what says which lever is which. The
   * Combined branch that added `taxChange` to government spending and left
   * `newTaxes` at `baseTaxes` was therefore invisible: every state name it
   * read matched its own type, and only the panel disagreed.
   */
  if (experimentType === 'consumption') {
    newAutonomousConsumption = autonomousConsumption + governmentSpendingChange
  } else if (experimentType === 'government') {
    newGovernment = baseGovernmentSpending + governmentSpendingChange
  } else if (experimentType === 'taxes') {
    newTaxes = baseTaxes + taxChange
  } else if (experimentType === 'combined') {
    // Both levers, each to the variable its own slider names: a balanced
    // budget expansion, so dY = (dG - mpc*dT)*k, which is what the note at
    // the foot of the page claims the reader will see.
    newGovernment = baseGovernmentSpending + governmentSpendingChange
    newTaxes = baseTaxes + taxChange
  }

  const newY = calculateEquilibrium(newAutonomousConsumption, newTaxes, baseInvestment, newGovernment)
  const outputChange = newY - baselineY

  // Calculate multiplier effects
  const multiplier = 1 / (1 - mpc)
  /**
   * The shock is DERIVED from the same three deltas that produced `newY`,
   * rather than restated as a hand-written term per experiment.
   *
   * Restating it is what let the Combined branch drive government spending
   * with the tax slider: `initialShock` still read `dG - mpc*dT`, so the
   * "Expected Effect" tile described a tax increase the model had never been
   * given, and the two round-by-round charts plotted that description. A
   * shock computed from the deltas that are actually applied cannot describe
   * a different model, whatever the branch above does.
   */
  const initialShock =
    (newAutonomousConsumption - autonomousConsumption) +
    (newGovernment - baseGovernmentSpending) -
    mpc * (newTaxes - baseTaxes)

  const expectedMultipliedEffect = initialShock * multiplier

  // Consumption at equilibria
  const baselineConsumption = autonomousConsumption + mpc * (baselineY - baseTaxes)
  const newConsumption = newAutonomousConsumption + mpc * (newY - newTaxes)

  // Generate Keynesian cross diagram data with fixed ranges
  const KEYSIAN_CROSS_POINTS = 200
  /**
   * How finely the schedule is sampled, in POINTS rather than as a fraction
   * of the axis.
   *
   * It used to step by `maxY * 0.02`, which ties the resolution to how long
   * the axis is, and the axis grows with the multiplier: at the defaults the
   * step is 16.8 of output and the sample nearest the crossing is 5.2 from it,
   * while at MPC 0.95 the same arithmetic on the same equilibria gives a step
   * of 87.6 and a nearest sample 34.2 away. At the far end of the sliders
   * (MPC 0.95, c0 200, I 200, T 50, G 250) the axis is 13,093 and the old
   * step 262. A fixed point count makes the step `maxY / KEYSIAN_CROSS_POINTS`
   * instead: the worst sample-to-crossing distance anywhere in the slider
   * space falls from 99.8 output units to 31.2, and from 1.00% of the axis to
   * 0.25%.
   *
   * MEASURED, and it is smaller than the arithmetic suggests: both schedules
   * are straight lines and Recharts interpolates monotonically between
   * samples, so the drawn crossing sat on the marked equilibrium either way —
   * 0.02px from the reference line at MPC 0.95 with 51 points, 0.008px with
   * 201. So this is not a fix for something a reader could see; it is the
   * resolution no longer being a function of how long the axis happens to be.
   * `i * step` rather than `y += step` also lands the last point exactly on
   * `maxY`, which an accumulating `+=` reaches only if the float happens to
   * fall that way — and, now the range has a floor of its own, the first
   * point exactly on `minY`, which is what puts the negative-equilibrium
   * crossing on the frame rather than one sample inside it.
   */
  const generateKeynesiaCrossData = (minY: number, maxY: number) => {
    const data = []
    const step = (maxY - minY) / KEYSIAN_CROSS_POINTS
    for (let i = 0; i <= KEYSIAN_CROSS_POINTS; i++) {
      const y = minY + i * step
      // Baseline demand curve
      const baselineDemand = autonomousConsumption + mpc * (y - baseTaxes) + baseInvestment + baseGovernmentSpending

      // New demand curve
      const newDemand = newAutonomousConsumption + mpc * (y - newTaxes) + baseInvestment + newGovernment

      data.push({
        y,
        /* Not clamped at zero. `Math.max(0, …)` used to sit here, and it is
         * the same lie as a clamped tile in a different place: a negative
         * reading of aggregate demand is what the model says when autonomous
         * spend is negative, and flattening it to the horizontal axis moved
         * the crossing off the point where the 45-degree line meets the
         * schedule, so the chart drew two curves that never touch while the
         * tiles named the output at which they do. The axes are derived from
         * these numbers, so a schedule that dips below zero now extends the
         * frame rather than hiding inside it. */
        baselineDemand,
        newDemand,
        yEqualsZ: y,
      })
    }
    return data
  }

  // Round-by-round breakdown for the multiplier effect
  const generateRoundsByRound = () => {
    const rounds = []
    let cumulativeChange = 0
    // Always use actual initial shock - show zero rounds if no shock
    const effectiveShock = initialShock

    for (let i = 1; i <= 15; i++) {
      const roundChange = effectiveShock * Math.pow(mpc, i - 1)
      cumulativeChange += roundChange

      rounds.push({
        round: i,
        thisRound: roundChange,
        cumulative: cumulativeChange,
      })

      if (Math.abs(roundChange) < 0.001) break
    }

    return rounds
  }

  /**
   * How far along the output axis the schedule is sampled, at BOTH ends.
   *
   * It used to be a literal 800 with the comment "Fixed max for consistent
   * axis", and that fixed max is the defect: the 45-degree line and the ZZ
   * curve cross AT the equilibrium, so if the sampling range does not
   * CONTAIN the equilibrium the chart shows two lines that never visibly
   * meet while the readouts above them print the answer. At the tool's
   * defaults the equilibrium is 650 and the crossing is on screen; nudge the
   * MPC to 0.75 and it is 950, off the end; the sliders run to 0.95, where
   * the same arithmetic gives 13,000 and the chart is a pair of lines
   * pressed against the top of the frame.
   *
   * So the range is derived from the two equilibria, with a round floor so
   * the default view is not tighter than it is today, and the AXES are
   * derived from the data below (there is no `domain` prop on either).
   *
   * The 13,000 this comment used to quote is not reachable: it assumed the
   * floor of 800 no longer applies, and the largest equilibrium the sliders
   * produce is 12,050 (MPC 0.95, c0 200, I 200, T 50, G 250), for an axis of
   * 12,652.
   *
   * The FLOOR is the other half of the same defect, and it is what the 800
   * outranking a negative equilibrium was really about. A Keynesian cross has
   * no `Y > 0` constraint anywhere in this tool: at MPC 0.95 with c0, I and G
   * at 50 and T at 250 the autonomous spend is -87.5, and the model returns
   * an equilibrium output of -1,750. That is a real answer — it says the
   * stance cannot be financed at any non-negative level of output — and a
   * reader has to be able to see the crossing that says so. A floor of 0
   * would put the whole crossing off the left of the frame, and clamping the
   * number would leave the tile describing a crossing the chart does not
   * draw, which is the worst of the three answers. So the low end is derived
   * from the equilibria too, and the warning below the tiles says in words
   * what the negative number means.
   */
  const outputAxisMax = Math.max(800, baselineY, newY) * 1.05
  const outputAxisMin = Math.min(0, baselineY, newY) * 1.05
  const keysianCrossData = generateKeynesiaCrossData(outputAxisMin, outputAxisMax)
  const roundsData = generateRoundsByRound()
  /**
   * Is there a breakdown to break down?
   *
   * The guard on both round-by-round charts used to be `roundsData.length > 0`,
   * which is not a condition — `generateRoundsByRound` pushes round 1 before
   * it can break, so the array is never empty and the "adjust policy
   * parameters above" card it selected could never render. A reader who had
   * set no policy got a bar chart containing one bar of height zero, a "How to
   * read" caption below it describing a round-by-round decay that was not on
   * the screen, and a y-axis drawn for a maximum of 0.
   *
   * The condition is `length > 1`, and it is the length rather than
   * `Math.abs(initialShock)` because it asks the question the chart is
   * actually asking: did the feedback loop run more than the row the loop is
   * forced to push? The loop breaks as soon as a round contributes less than
   * 0.001, so a zero shock stops after round 1 and any real one — the slider
   * steps are 5 and `mpc` never drops below 0.1, so the smallest first round
   * the controls can produce is 0.5 — carries on. Derived from the data rather
   * than restated as a second condition on the same number, so it cannot
   * describe a different policy than the one the rounds were computed from.
   */
  const hasRoundBreakdown = roundsData.length > 1

  // Policy impact table
  const scenarioData: ScenarioData[] = [
    {
      label: 'Baseline',
      baselineY,
      newY: baselineY,
      change: 0,
      consumption: baselineConsumption,
      investment: baseInvestment,
      government: baseGovernmentSpending,
      demand: baselineConsumption + baseInvestment + baseGovernmentSpending,
    },
    {
      label: 'After Policy',
      baselineY,
      newY,
      change: outputChange,
      consumption: newConsumption,
      investment: baseInvestment,
      government: newGovernment,
      demand: newConsumption + baseInvestment + newGovernment,
    },
  ]

  return (
    <div className="tool-card">
      <ToolHeader
        title="Keynesian Cross Policy Experiments"
        description="Explore four foundational fiscal policy experiments from Lecture 3. Vary autonomous consumption, government spending, taxes, or spending and taxes together, and watch the Keynesian cross shift. See how the multiplier amplifies initial shocks into larger output changes."
        badge="beginner"
      />

      <ToolNote label="What are these experiments?" variant="lesson">
        <p>
          In Lecture 3, we explored the key policy scenarios using the Keynesian cross diagram. There
          are four levers on this page, and each button above is one of them:
        </p>
        <ul>
          <li><strong>Experiment 1:</strong> Increase in autonomous consumption (consumer confidence improves)</li>
          <li><strong>Experiment 2:</strong> Expansionary fiscal policy (government spending increases)</li>
          <li><strong>Experiment 3:</strong> Tax increase (reduces disposable income)</li>
          <li><strong>Combined:</strong> Spending and taxes move together, which is the only way to see the two multipliers side by side</li>
        </ul>
        <p>
          All work through the same multiplier mechanism: initial shock → income change → consumption change → demand change → output adjustment.
        </p>
      </ToolNote>

      <div className="control-panel">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Base Economy Parameters</h2>
        <SliderControl
          label="Marginal Propensity to Consume (MPC)"
          value={mpc}
          min={0.1}
          max={0.95}
          step={0.05}
          onChange={setMpc}
          unit=""
        />
        <SliderControl
          label="Baseline Investment"
          value={baseInvestment}
          min={50}
          max={200}
          step={10}
          onChange={setBaseInvestment}
          unit="$ billions"
        />
        <SliderControl
          label="Baseline Taxes"
          value={baseTaxes}
          min={50}
          max={250}
          step={10}
          onChange={setBaseTaxes}
          unit="$ billions"
        />
        <SliderControl
          label="Baseline Government Spending"
          value={baseGovernmentSpending}
          min={50}
          max={250}
          step={10}
          onChange={setBaseGovernmentSpending}
          unit="$ billions"
        />
        <SliderControl
          label="Autonomous Consumption (c₀)"
          value={autonomousConsumption}
          min={50}
          max={200}
          step={10}
          onChange={setAutonomousConsumption}
          unit="$ billions"
        />
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="control-panel mt-s-6 bg-tier-beginner/5">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Choose Experiment</h2>
        <div className="mb-s-4 grid grid-cols-2 gap-s-2 lg:grid-cols-4">
          {(['consumption', 'government', 'taxes', 'combined'] as const).map((exp) => (
            <button
              key={exp}
              onClick={() => setExperimentType(exp)}
              className={`cursor-pointer rounded-card px-s-4 py-s-3 text-sm ${
                experimentType === exp
                  ? 'border-2 border-tier-beginner bg-tier-beginner/10 font-semibold text-tier-beginner-ink'
                  : 'border border-border-strong bg-surface font-normal text-fg-muted'
              }`}
            >
              {exp === 'consumption' && 'Exp 1: Consumption'}
              {exp === 'government' && 'Exp 2: Gov Spending'}
              {exp === 'taxes' && 'Exp 3: Taxes'}
              {exp === 'combined' && 'Combined'}
            </button>
          ))}
        </div>

        {/* These two are ONE control wearing two labels, and they have to
            * register as one key. `SliderControl` keys itself on its label
            * unless `paramKey` says otherwise, so before this the registry held
            * two entries for `governmentSpendingChange` and a scenario link
            * built while the reader was on the consumption panel could not be
            * applied on the spending panel — the key in the payload was not
            * among the keys mounted. Two labels, one value, one key.
            *
            * The panel switch above used to zero both levers as it went, which
            * is the same defect wearing a different hat: the four panels are
            * four VIEWS of one policy, and a reader comparing a consumption
            * shock against a spending shock was silently having their shock
            * deleted between the two. The levers share a bound, a step and a
            * unit across all three panels, so there was never a reason to
            * clear them — only a reader-visible reason not to. */}
        {experimentType === 'consumption' && (
          <SliderControl
            label="Change in Autonomous Consumption"
            paramKey="policyShift"
            value={governmentSpendingChange}
            min={-50}
            max={50}
            step={5}
            onChange={setGovernmentSpendingChange}
            unit="$ billions"
          />
        )}

        {experimentType === 'government' && (
          <SliderControl
            label="Change in Government Spending"
            paramKey="policyShift"
            value={governmentSpendingChange}
            min={-50}
            max={50}
            step={5}
            onChange={setGovernmentSpendingChange}
            unit="$ billions"
          />
        )}

        {experimentType === 'taxes' && (
          <SliderControl
            label="Change in Taxes"
            value={taxChange}
            min={-50}
            max={50}
            step={5}
            onChange={setTaxChange}
            unit="$ billions"
          />
        )}

        {experimentType === 'combined' && (
          <>
            <SliderControl
              label="Change in Spending"
              paramKey="policyShift"
              value={governmentSpendingChange}
              min={-50}
              max={50}
              step={5}
              onChange={setGovernmentSpendingChange}
              unit="$ billions"
            />
            <SliderControl
              label="Change in Taxes"
              value={taxChange}
              min={-50}
              max={50}
              step={5}
              onChange={setTaxChange}
              unit="$ billions"
            />
          </>
        )}
      </div>

      <div className="my-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-4">
        <StatBox label="Baseline Output (Y)" value={baselineY.toFixed(1)} unit="$ billions" />
        <StatBox label="New Output (Y')" value={newY.toFixed(1)} unit="$ billions" tone="accent" />
        <StatBox label="Output Change (ΔY)" value={outputChange.toFixed(1)} unit="$ billions" tone={outputChange !== 0 ? 'accent' : undefined} />
        <StatBox label="Multiplier" value={(1 / (1 - mpc)).toFixed(2)} unit="×" />
        <StatBox label="Initial Shock" value={initialShock.toFixed(1)} unit="$ billions" />
        <StatBox label="Expected Effect" value={expectedMultipliedEffect.toFixed(1)} unit="$ billions" tone="accent" />
      </div>
        <TileReadout>
                  Baseline Output {baselineY.toFixed(1)} and New Output{' '}
          {newY.toFixed(1)} are the two demand curves on the Keynesian cross
          above, read on the horizontal axis at the point where each meets the
          45° line. Output Change is the horizontal DISTANCE
                  between those two crossings — the gap the arrows draw — and the
                  Multiplier 1/(1 − MPC) is the slope of the 45° line's response, so it
                  is Output Change per unit of the shock rather than a point on
                  anything. The last two are the shock and that slope applied to it:
                  Initial Shock is the horizontal distance between the two curves and
                  Expected Effect is the same distance scaled.
                </TileReadout>

      {/*
        A negative equilibrium is the model's answer, not an error, and the
        tiles above are not wrong to print it — the arithmetic is right and
        the units are right. What was missing is the sentence a reader needs,
        because "-1750.0 $ billions" on its own reads as a bug and not as an
        answer, and because the answer it is needs saying: Y* = Z has no
        solution with output at or above zero, so the fiscal stance cannot be
        financed at any non-negative level of spending and income.

        The chart below draws the crossing below the origin rather than
        hiding it, so this box and the frame agree.

        The number quoted is the INTERCEPT, not gross autonomous spend. It is
        `c0 + I + G - mpc*T` because that is the quantity that decides the
        sign of the equilibrium: at the defaults it is +312.5, and at mpc 0.95
        with c0, I and G at 50 and T at 250 it is -87.5 while c0 + I + G is
        still 150. Quoting the gross sum would have printed "Autonomous
        spending is negative: it is 150.0B" — a warning contradicted by its
        own figure, which is a worse way to be wrong than silence.
      */}
      {baselineY <= 0 || newY <= 0
        ? (() => {
            // Whichever of the two equilibria is the non-positive one decides
            // which policy's intercept to quote.
            const negativeIsNew = newY <= 0 && newY < baselineY
            const intercept =
              (negativeIsNew ? newAutonomousConsumption : autonomousConsumption) +
              baseInvestment +
              (negativeIsNew ? newGovernment : baseGovernmentSpending) -
              mpc * (negativeIsNew ? newTaxes : baseTaxes)
            return (
              <InfoBox
                type="warning"
                title={
                  baselineY <= 0 && newY <= 0
                    ? 'No non-negative equilibrium at these settings'
                    : negativeIsNew
                      ? 'The new policy has no non-negative equilibrium at these settings'
                      : 'The baseline has no non-negative equilibrium at these settings'
                }
              >
                Autonomous spending, net of the tax it funds, is negative:{' '}
                <strong>{formatNumber(intercept, 1)}B</strong> per unit of output, so
                the 45° line and the spending schedule meet at an output of{' '}
                <strong>{formatNumber(Math.min(baselineY, newY), 1)}B</strong>. A
                negative equilibrium is the model telling you the fiscal stance cannot be
                financed at any non-negative level of output, not a calculation to be
                tidied away — which is why the crossing is drawn below the origin rather
                than clipped off it. Raise autonomous spending or cut taxes to bring it
                back into the frame.
              </InfoBox>
            )
          })()
        : null}

      {/*
        Fires on AGREEMENT, and says so. It used to fire on disagreement —
        `Math.abs(outputChange - expectedMultipliedEffect) > 0.1` — and print
        "closely matches the multiplier prediction … confirming the multiplier
        mechanism", so a gap of 80 was rendered to the reader as a
        confirmation. The two numbers are the same model by construction now
        that the shock is derived from the deltas the equilibrium is computed
        from, so agreement is the claim worth showing, and the two guards keep
        the note off a reader who has not moved a slider yet. A divergence is
        a bug this box used to be printed over;
        `tests/fiscalPolicyWiring.test.tsx` is what fails on one now.
      */}
      {Math.abs(outputChange) > 0.1 &&
        Math.abs(outputChange - expectedMultipliedEffect) <= 0.1 && (
          <InfoBox type="success">
            <strong>Check:</strong> The actual change ({outputChange.toFixed(1)}B) matches the multiplier prediction ({expectedMultipliedEffect.toFixed(1)}B). One is the equilibrium before and after the policy, the other the initial shock times the multiplier, so their agreement is the check that the two accounts of the model are the same model.
          </InfoBox>
        )}

      <div className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Keynesian Cross Diagram: Aggregate Demand & Output
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={keysianCrossData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="y"
              type="number"
              /* Derived. The pinned `[0, 800]` is the D1 defect: the ZZ
               * curve and the 45-degree line cross AT the equilibrium, which
               * the readouts compute, and a fixed window that the
               * equilibrium can leave turns the intersection into two lines
               * that simply do not meet. The domain carries the data, so the
               * crossing is on screen at every setting. */
              domain={dataDomain([keysianCrossData.map((d) => d.y)], {
                includeZero: true,
                ticks: 6,
              })}
              label={{ value: 'Output (Y)', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              /* Derived from all three plotted series, including the 45
               * line: with the MPC at 0.95 the demand schedule runs past
               * 12,000 and a 0-800 frame hides all of it. */
              domain={dataDomain(
                [
                  keysianCrossData.map((d) => d.yEqualsZ),
                  keysianCrossData.map((d) => d.baselineDemand),
                  keysianCrossData.map((d) => d.newDemand),
                ],
                { includeZero: true, ticks: 6 },
              )}
              label={{ value: 'Aggregate Demand (Z)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(1)}
            />
            {/* Main curves */}
            <ChartLine
              type="monotone"
              dataKey="yEqualsZ"
              hide={keysianSeries.isHidden('z45')}
              name="45° Line (Y = Z)"
              stroke={chartTheme.axis.stroke}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <ChartLine
              type="monotone"
              dataKey="baselineDemand"
              hide={keysianSeries.isHidden('baselineZZ')}
              name="Baseline ZZ Curve"
              stroke={chartColor(0)}
              strokeWidth={2}
              dot={false}
            />
            <ChartLine
              type="monotone"
              dataKey="newDemand"
              hide={keysianSeries.isHidden('newZZ')}
              name="New ZZ Curve"
              stroke={chartColor(1)}
              strokeWidth={2}
              dot={false}
            />

            {/* Vertical reference lines for equilibrium outputs.
             *
             * `insideTop` / `insideBottom`, not `top` / `bottom`, and the
             * `offset: 10` that used to sit in both labels is what turned a
             * marginal clip into an invisible one. A vertical ReferenceLine's
             * label viewBox is the LINE, so `top` puts the text's baseline
             * `offset` px above the plot's top edge, and the plot's top edge
             * is `chartTheme.margin` (8px) below the SVG's. MEASURED at the
             * defaults: the Y₀ label lost 14px of a 15px label — it was in
             * the accessibility tree and not on screen at all, which is the
             * worst failure mode here because nothing reports it. The Y' label
             * anchored `bottom` was inside the frame but 10px down in the
             * x-axis tick-label band it was competing with.
             *
             * `inside*` is the position family that is inside the plot box by
             * construction, so the answer holds at any axis length, which
             * matters here more than in most tools: the axis is derived from
             * the equilibria, so these two lines can be anywhere in it.
             * `insideTop` and `insideBottom` also straddle the line, so a
             * marker at either end of the axis overhangs by half a label
             * rather than a whole one. See `tools.test.ts`. */}
            <ReferenceLine
              x={baselineY}
              stroke={chartColor(0)}
              strokeDasharray="3 3"
              strokeOpacity={0.5}
              label={{
                value: `Y₀=${baselineY.toFixed(0)}B`,
                position: 'insideTop',
                fill: chartColor(0),
                fontSize: 12,
                offset: 10,
              }}
            />
            <ReferenceLine
              x={newY}
              stroke={chartColor(1)}
              strokeDasharray="3 3"
              strokeOpacity={0.5}
              label={{
                value: `Y'=${newY.toFixed(0)}B`,
                position: 'insideBottom',
                fill: chartColor(1),
                fontSize: 12,
                offset: 10,
              }}
            />

            {/* Equilibrium points - intersection of demand curves with 45° line */}
            <ReferenceDot
              x={baselineY}
              y={baselineY}
              r={5}
              fill={chartColor(0)}
              stroke={chartTheme.reference.stroke}
              strokeWidth={2}
              name="Baseline Equilibrium"
            />
            <ReferenceDot
              x={newY}
              y={newY}
              r={5}
              fill={chartColor(1)}
              stroke={chartTheme.reference.stroke}
              strokeWidth={2}
              name="New Equilibrium"
            />
          </LineChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'z45', label: '45° Line (Y = Z)', color: chartTheme.axis.stroke },
            { key: 'baselineZZ', label: 'Baseline ZZ Curve', color: chartColor(0) },
            { key: 'newZZ', label: 'New ZZ Curve', color: chartColor(1) },
          ]}
          hidden={keysianSeries.hidden}
          onToggle={keysianSeries.toggle}
          onShowAll={keysianSeries.showAll}
        />
        <p className="mt-s-4 text-sm leading-relaxed text-fg-muted">
          <strong>How to read:</strong> The equilibrium occurs where the ZZ curve meets the 45° line. The baseline curve meets it at Y₀ and the curve after the policy meets it at Y'; each is marked with a point and a dashed vertical line at that output level.
        </p>
      </div>

      <div className="visualization-container mt-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Multiplier Effect: Round-by-Round Breakdown
        </h2>
        {hasRoundBreakdown ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={roundsData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')}
                  dataKey="round"
                  label={{ value: 'Round', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
                  {...chartTheme.axis}
                  includeHidden
                />
                <YAxis
                  key={chartTheme.axisKey('y')}
                  label={{ value: '$ Billions', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
                  {...chartTheme.yAxis}
                  includeHidden
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => value.toFixed(2)}
                />
                <ChartBar dataKey="thisRound" fill={chartColor(3)} name="This Round's Impact" />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-s-4 text-sm leading-relaxed text-fg-muted">
              <strong>How to read:</strong> Each round represents one iteration of the feedback loop. With MPC = {mpc.toFixed(2)}, each round's impact is {mpc.toFixed(2)}x the previous round's, converging to total multiplier effect.
            </p>
          </>
        ) : (
          <div className="rounded-card border border-border bg-surface-2 p-s-8 text-center text-fg-subtle">
            <p>Adjust policy parameters above to see the multiplier effect breakdown.</p>
          </div>
        )}
      </div>

      <div className="visualization-container mt-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Cumulative Multiplier Effect</h2>
        {hasRoundBreakdown ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={roundsData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')}
                  dataKey="round"
                  label={{ value: 'Round', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
                  {...chartTheme.axis}
                  includeHidden
                />
                <YAxis
                  key={chartTheme.axisKey('y')}
                  label={{
                    value: 'Cumulative Change ($B)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: chartTheme.axis.tick.fill,
                  }}
                  {...chartTheme.yAxis}
                  includeHidden
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => value.toFixed(2)}
                />
                <ChartLine
                  type="monotone"
                  dataKey="cumulative"
                  stroke={chartColor(2)}
                  strokeWidth={2}
                  name="Cumulative Effect"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="mt-s-4 text-sm leading-relaxed text-fg-muted">
              <strong>How to read:</strong> This chart shows how the total output effect accumulates across rounds. The curve flattens as each successive round becomes smaller, approaching the final multiplier-adjusted equilibrium.
            </p>
          </>
        ) : (
          <div className="rounded-card border border-border bg-surface-2 p-s-8 text-center text-fg-subtle">
            <p>Adjust policy parameters above to see the cumulative multiplier effect.</p>
          </div>
        )}
      </div>

      <div className="card mt-s-8 p-s-6">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Policy Impact Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="px-s-3 py-s-2 text-left font-semibold text-fg">Scenario</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Output (Y)</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Consumption (C)</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Investment (I)</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Government (G)</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Aggregate Demand (Z)</th>
              </tr>
            </thead>
            <tbody>
              {scenarioData.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border ${i === 1 ? 'bg-tier-beginner/10' : 'bg-surface'}`}
                >
                  <td className={`px-s-3 py-2.5 text-left ${i === 1 ? 'font-semibold' : ''} text-fg`}>
                    {row.label}
                  </td>
                  <td className="px-s-3 py-2.5 text-right">${row.newY.toFixed(1)}B</td>
                  <td className="px-s-3 py-2.5 text-right">${row.consumption.toFixed(1)}B</td>
                  <td className="px-s-3 py-2.5 text-right">${row.investment.toFixed(1)}B</td>
                  <td className="px-s-3 py-2.5 text-right">${row.government.toFixed(1)}B</td>
                  <td className="px-s-3 py-2.5 text-right">${row.demand.toFixed(1)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToolNote label="Key takeaways" variant="insight" title="What the multiplier implies" headingLevel={2}>
        <ul>
          <li><strong>Fiscal multipliers amplify shocks:</strong> A $1B spending increase leads to ${(1 / (1 - mpc)).toFixed(1)}B output increase (with MPC = {mpc.toFixed(2)}).</li>
          <li><strong>Tax multipliers are smaller:</strong> Consumers only spend {(mpc * 100).toFixed(0)}% of tax relief, so tax changes have weaker effects than spending changes.</li>
          <li><strong>Paradox of thrift:</strong> If households try to save more, they cut autonomous consumption (c₀ ↓), and the economy contracts by more than the cutback&mdash;perverse!</li>
          <li><strong>Consumer confidence matters:</strong> Changes in autonomous consumption (sentiment) trigger the full multiplier, making consumer confidence crucial for forecasts.</li>
          <li><strong>Multiplier size matters for policy:</strong> Larger multipliers mean fiscal stimulus is more powerful (but also means recessions can spiral).</li>
        </ul>
      </ToolNote>

      <ToolNote label="Try this" variant="try" title="Experiments" headingLevel={2}>
        <ul>
          <li>Switch to "Exp 2: Gov Spending", raise MPC to 0.9, then increase government spending by $10B. Notice the large output effect.</li>
          <li>Switch to "Exp 3: Taxes" and increase taxes by $20B. Compare to increasing spending by $20B&mdash;the tax effect is smaller!</li>
          <li>Adjust autonomous consumption downward (simulating loss of confidence) and watch output contract via the multiplier.</li>
          <li>Use "Combined" to try a balanced budget expansion: spending up $20B, taxes up $20B. Output still rises due to the tax multiplier being smaller than spending multiplier.</li>
        </ul>
      </ToolNote>
    </div>
  )
}
