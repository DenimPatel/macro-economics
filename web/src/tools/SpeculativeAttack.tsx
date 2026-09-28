import { useState } from 'react'
import { LineChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts'
import { ChartArea, ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartTheme, chartColor, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'
import { useHiddenSeries } from '../lib/chartSeries'
import { ChartLegend } from '../components/ChartLegend'

/** Each concept keeps one colour across all six charts. */
const DOMESTIC_STROKE = chartColor(0)
const OUTFLOW_STROKE = chartColor(1)
const FOREIGN_STROKE = chartColor(2)
const CRISIS_STROKE = chartColor(4)

/* ------------------------------------------------------------------ *
 * The units the model counts in
 * ------------------------------------------------------------------ */

/**
 * The money supply the peg was set at, which is what every reserve number in
 * this tool is a share of. `reserves = 100` is a fully-backed peg.
 *
 * THE DENOMINATOR IS THE MONEY SUPPLY *AT THE PEG*, and saying so is the whole
 * of the `CRISIS_THRESHOLD` question. This tool used to compute a second share
 * against the CURRENT money supply, name it `reservesPercent`, and compare a
 * third quantity — the raw reserve level — to 20, while the comment, the
 * slider label and the y axis all said "percent of the money supply". Those
 * are two different denominators and two different numbers, and the peg could
 * be reported intact while the printed cover read 0.7%.
 *
 * Against the current supply the peg "breaks" at every preset including
 * Stable, with no attack anywhere in the model: 8% money growth divides the
 * cover by 1.08^t on its own, so the break would be caused by the denominator
 * growing and would teach the reader nothing about currency crises. Against
 * `MONEY_SUPPLY_AT_PEG` the cover only falls when capital leaves, so the
 * reserve chart shows the thing it is titled "The Countdown to Crisis" about.
 *
 * The slider, the y axis, the reference line, the stat tile and the caption
 * all name this one denominator in the same unit, and the comparison in the
 * loop is a share against a share.
 */
const MONEY_SUPPLY_AT_PEG = 100

/**
 * Critical reserve cover, as a share of `MONEY_SUPPLY_AT_PEG`: below this the
 * central bank has too little left to sell to defend the parity, and the peg
 * collapses. Drawn as the reference line on the reserve chart at the same
 * value, in the same unit.
 */
const CRISIS_THRESHOLD = 20

/**
 * How far the expected devaluation has to exceed, in points per period, before
 * speculators mount a run. Below it the negative carry on domestic currency is
 * not worth the cost of a one-way bet: reserves still bleed away, because the
 * rate the central bank refuses to pay is a guaranteed loss, but slowly, and a
 * peg can sit on that drip indefinitely. Above it they attack, and the attack
 * is on the devaluation BEYOND this level rather than on all of it, so the run
 * is hard zero below the trigger and starts from nothing above it.
 *
 * Two points is two points of money growth over the world rate, so the trigger
 * is a money growth rate of 6% against the exogenous 4%. The crisis preset is
 * 4 points over and Managed is 1, so one is well past this and the other is
 * well short — no preset sits ON it, which is how a preset can be a crisis.
 */
const ATTACK_TRIGGER = 0.02

/**
 * How much worse a thinning reserve cover makes the same fundamental
 * inconsistency look. At zero cover the market prices the currency at
 * `1 + CREDIBILITY_MULTIPLIER` times the devaluation the money growth
 * differential implies on its own; at full cover the term is zero.
 *
 * This is the self-fulfilling half of the crisis — the reason a defence that
 * is failing accelerates rather than grinds — and it is MULTIPLIED BY THE
 * FUNDAMENTALS so that it can only ever accelerate a run they have already
 * started. A tool where the run can begin with no underlying inconsistency
 * would break the peg of a country running a 3% money growth against a 4%
 * world rate, which is a stable peg, not a crisis.
 */
const CREDIBILITY_MULTIPLIER = 4

/**
 * Scale of the speculative run, in percentage points of the money supply at
 * the peg per period. Calibrated, not derived: the point of the number is
 * that a run CAN exhaust a fully-backed buffer inside the 60 periods the
 * charts show, which is what a run does. The old value was a fifth of this
 * and no reachable set of sliders could exhaust the buffer in 60 periods — a
 * peg that cannot be broken by any parameter a reader can reach is a peg that
 * is not being tested.
 */
const ATTACK_SCALE = 200

/** The share of the UIP rate the central bank actually pays while defending. */
const DEFENCE_EFFORT = 0.7

/** No central bank defends past this, and past it the defence is hopeless. */
const MAX_DEFENCE_RATE = 0.25

/** Periods for the post-collapse depreciation drift to halve. */
const DEPRECIATION_DECAY = 12

/** Share of a depreciation that reaches domestic prices. */
const PASS_THROUGH = 0.4

/** The pegged rate, and the level the exchange-rate chart's reference line is
 * drawn at. Units of foreign currency per foreign unit, so above 1 is a weaker
 * domestic currency. */
const PEG_RATE = 1.0

/**
 * Real output as a fraction of trend:  Y/Y* = 1 − 1.5r, floored at 0.7.
 *
 * One function, and it is here rather than in `lib/calculations.ts` because
 * both callers are in this file: the loop that draws the series, and the
 * baseline the GDP chart's reference line is drawn at. A baseline computed by
 * a second copy of the expression is a baseline that can quietly stop being the
 * same model as the line it is supposed to be a baseline for.
 */
const outputIndex = (rate: number): number => Math.max(0.7, 1 - rate * 1.5)

/** Peak credibility premium after a collapse, and the two speeds it decays at. */
const INFLATION_PEAK = 35
const INFLATION_BUILD = 3
const INFLATION_DECAY = 30

/**
 * Speculative Attack on Fixed Peg Visualization
 * 
 * This component simulates currency crisis dynamics under fixed exchange rate regimes.
 * It demonstrates how speculative attacks arise from fundamental inconsistencies
 * and loss of confidence, ultimately leading to reserve depletion and peg collapse.
 * 
 * Key themes from Lecture 21 (Exchange Rate Regimes):
 * - Fixed pegs require monetary policy independence to be sacrificed
 * - Speculators attack when they expect devaluation
 * - Defending peg requires high interest rates, causing domestic recession
 * - Insufficient reserves cannot sustain defense indefinitely
 */

type ScenarioMode = 'crisis' | 'stable' | 'managed'

/**
 * The tool's starting point, in one place.
 *
 * These are the literals that used to sit next to each `useState`, which is
 * the copy nobody edits during a model change: the `useState` and the reset
 * function each carried the number, and a retune fixed one of them. The
 * initialisers read from here, so the slider a reader starts at and the one
 * "Reset" returns to are the same value by construction.
 *
 * `scenarioMode` is here for the same reason and not because a scenario is a
 * model input. A scenario is a PRESET of the five values above, so leaving it
 * out of the reset is what makes Reset inert: pick "Stable Peg", and the five
 * values under the sliders have not moved, `dirty` is false, and the button
 * that is supposed to put the tool back does nothing a reader can see. The
   * scenario row is the third thing a reader detours through, so it belongs in
   * the thing that undoes detours. The hand-written reset this replaced did
   * set it, and that is the behaviour being kept.
   */
const DEFAULTS = {
  moneyGrowthRate: 0.08,
  policyRate: 0.03,
  capitalControls: 0.3,
  initialReserves: 100,
  specAggressiveness: 0.5,
  scenarioMode: 'crisis' as ScenarioMode,
  // Deliberately not `as const` and not `satisfies`: either one narrows the
  // fields to literal types, and `useState(DEFAULTS.x)` would then infer a
  // union rather than `number`, and the slider's `onChange` would not assign
  // to it. `scenarioMode` is annotated at the field instead, because a
  // literal `useState(DEFAULTS.scenarioMode)` would infer the single value
  // `'crisis'` and a preset button could not assign to it.
}

interface AttackData {
  period: number
  /**
   * Reserve cover: the reserves as a share of `MONEY_SUPPLY_AT_PEG`, which is
   * the quantity `CRISIS_THRESHOLD` is compared against and the quantity the
   * reserve chart plots. One number, one denominator, one unit.
   */
  reserves: number
  domesticRate: number
  foreignRate: number
  capitalOutflow: number
  speculatorAttack: number
  exchangeRate: number
  gdp: number
  inflationExpectation: number
  pegged: boolean
}

export default function SpeculativeAttack() {
  /*
   * One `useHiddenSeries` per chart, not one per tool. The state is component
   * state rather than a preference, and two charts on one page must not be able
   * to hide each other's series: a reader who turns off "Speculative Attack" in
   * the outflow chart means that stack, not the rate chart.
   *
   * The reserves chart is deliberately absent. It has one series and no legend,
   * so there is nothing to toggle, and a control for a single series would be a
   * button whose only effect is to hide the only thing on screen.
   */
  // Re-renders the tool when the reader changes the text size, so that the
  // axis key carried on every axis below is re-read and Recharts re-measures
  // its tick labels. Recharts measures them once, in `componentDidMount`, and
  // there is no other way to refresh that number. Without this line each key
  // is a string computed once and never again: correct, and inert — and the
  // symptom is tick labels colliding at 130% with no error anywhere.
  useChartTextScaleSignal()
  const ratesChart = useHiddenSeries(['domesticRate', 'foreignRate'])
  const outflowChart = useHiddenSeries(['capitalOutflow', 'speculatorAttack'])
  // Control parameters
  const [moneyGrowthRate, setMoneyGrowthRate] = useState(DEFAULTS.moneyGrowthRate) // 8% domestic money growth
  const [policyRate, setPolicyRate] = useState(DEFAULTS.policyRate) // 3% domestic policy rate
  const [capitalControls, setCapitalControls] = useState(DEFAULTS.capitalControls) // 30% capital restriction
  const [initialReserves, setInitialReserves] = useState(DEFAULTS.initialReserves) // Initial reserves as % of money supply
  const [specAggressiveness, setSpecAggressiveness] = useState(DEFAULTS.specAggressiveness) // How aggressively speculators attack
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>(DEFAULTS.scenarioMode)

  const { reset, dirty } = useToolReset(
    {
      moneyGrowthRate,
      policyRate,
      capitalControls,
      initialReserves,
      specAggressiveness,
      scenarioMode,
    },
    {
      setMoneyGrowthRate,
      setPolicyRate,
      setCapitalControls,
      setInitialReserves,
      setSpecAggressiveness,
      setScenarioMode,
    },
    DEFAULTS,
  )

  // Scenario presets
  let activeMoney = moneyGrowthRate
  let activePolicy = policyRate
  let activeControls = capitalControls
  let activeAgg = specAggressiveness

  if (scenarioMode === 'stable') {
    activeMoney = 0.03 // Low money growth
    activePolicy = 0.04 // Policy matches foreign rate
    activeControls = 0.7 // Strong capital controls
    activeAgg = 0.1 // Low aggression
  } else if (scenarioMode === 'managed') {
    activeMoney = 0.05
    activePolicy = 0.035
    activeControls = 0.5
    activeAgg = 0.3
  }

  const foreignRate = 0.04 // 4% foreign policy rate (exogenous)

  /**
   * Simulate the speculative attack dynamics.
   *
   * The chain, in the order the loop walks it:
   *  1. Money growing faster than the world money supply means the currency is
   *     worth less every period. The shadow rate — the rate the market would
   *     pay without a peg — is `i* + (m - m*)`, and that gap IS the expected
   *     devaluation. It used to be credited at half (`* 0.5`, "partial
   *     adjustment of expectations"), which is a fudge with no economic
   *     content that happened to place the crisis preset exactly on the
   *     attack gate: 8% against 4% gave precisely 0.02, and `0.02 > 0.02` is
   *     false, so the speculative outflow was identically zero in all 61
   *     periods of a tool titled "Speculative Attack".
   *  2. UIP then requires the defended rate to be `i* + expected
   *     devaluation`, and a central bank holding the parity has to pay it.
   *  3. It cannot pay all of it — a rate that high contracts the very economy
   *     being defended — so the gap it leaves is a guaranteed loss on domestic
   *     currency. That is the ordinary outflow, and it exists at any money
   *     growth above the world rate, attack or no attack.
   *  4. Speculators add their own outflow once the expected devaluation is
   *     worth a one-way bet, and they keep attacking while the peg holds.
   *  5. Both drain the reserve cover, and a thinner cover makes the same
   *     inconsistency look worse, which raises the expected devaluation again.
   *     That is the self-fulfilling step, and it is multiplied by the
   *     fundamentals so it can only ACCELERATE a run they have already begun.
   *  6. Below the critical cover the central bank has nothing left to sell, the
   *     peg collapses, and the currency floats and depreciates.
   */
  const generateAttackPath = (): AttackData[] => {
    const data: AttackData[] = []
    let reserveCover = initialReserves
    let peg = true
    let pegBreakPeriod = -1
    let exchangeRate = PEG_RATE
    let previousExchangeRate = PEG_RATE

    for (let period = 0; period <= 60; period++) {
      // Step 1: The expected devaluation, from the money growth differential and
      // from what is left in reserve. Both are shares of the same base.
      const moneyGrowthDifferential = Math.max(0, activeMoney - foreignRate)
      const coverShortfall = Math.max(0, 1 - reserveCover / MONEY_SUPPLY_AT_PEG)
      const expectedDevaluation = peg
        ? moneyGrowthDifferential * (1 + CREDIBILITY_MULTIPLIER * coverShortfall)
        : 0

      // Step 2: The rate defending the peg requires, and the rate it gets.
      // UIP: i_domestic = i_foreign + expected devaluation. The central bank
      // pays DEFENCE_EFFORT of that — all of it would mean the recession the
      // defence is meant to avoid — so the rate gap below is never closed.
      const defendingRate = Math.min(foreignRate + expectedDevaluation, MAX_DEFENCE_RATE)
      const actualRate =
        peg && defendingRate > activePolicy
          ? Math.max(activePolicy, defendingRate * DEFENCE_EFFORT)
          : activePolicy

      // Step 3: Capital outflow. The rate gap is the ordinary loss; the
      // speculative attack is on the devaluation BEYOND what speculators will
      // tolerate, which is a hard zero below ATTACK_TRIGGER and the whole of the
      // run above it. Note what the trigger is compared against: the EXPECTED
      // devaluation, so a thin reserve cover can open a run on its own once the
      // fundamentals have made one possible — and it can never open one on its
      // own, because the credibility term is multiplied by the fundamentals.
      const rateGap = foreignRate + expectedDevaluation - actualRate
      const naturalOutflow = Math.max(0, rateGap * 50) // Base outflow from rate differential
      const devaluationBeyondTolerance = Math.max(0, expectedDevaluation - ATTACK_TRIGGER)
      const speculativeOutflow = peg
        ? activeAgg *
          (1 - activeControls) *
          Math.pow(devaluationBeyondTolerance, 1.5) *
          ATTACK_SCALE
        : 0
      // The run stops when the peg does: a floating currency is no longer the
      // one-way bet that produced the outflows, so reserves stop draining and
      // the countdown ends at the break rather than sliding on for another
      // thirty periods.
      const totalOutflow = peg ? naturalOutflow + speculativeOutflow : 0

      // Step 4: Every unit of outflow is a unit of reserve cover spent, which is
      // what the technical detail at the foot of this page says happens.
      reserveCover = Math.max(0, reserveCover - totalOutflow)

      // Step 5: The peg is sustainable while the cover clears the critical
      // level. A share against a share, in percent of the money supply the peg
      // was set at, which is the same number the reference line is drawn at.
      if (peg && reserveCover < CRISIS_THRESHOLD) {
        peg = false
        pegBreakPeriod = period
      }

      // Step 6: Once it breaks the currency floats and depreciates at the money
      // growth differential, decaying as the new rate is accepted and the
      // central bank tightens. Compounding the full differential for the rest
      // of the chart instead — the previous `Math.pow(1 + m * 0.8, n)` — put
      // the final rate at 1080% devaluation, which no axis can label.
      const periodsSinceBreak = peg ? 0 : period - pegBreakPeriod
      if (!peg) {
        exchangeRate *= 1 + moneyGrowthDifferential * Math.exp(-periodsSinceBreak / DEPRECIATION_DECAY)
      }

      // Step 7: GDP contraction from the defence rate. High rates cut
      // investment and consumption, and the trough lands on the break.
      const gdpEffect = outputIndex(actualRate) // GDP can drop to 70% with 20% rates

      // Step 8: Inflation expectations. Under the peg the currency does not
      // move and expectations sit at the money growth rate. After the break
      // they are money growth, plus the share of the depreciation that reaches
      // prices, plus a credibility premium that is built over a few periods and
      // given back over a few dozen. That shape is the point: the old formula
      // added two points per period and clamped at 40, so within sixteen
      // periods of a break the series was pinned against the ceiling and the
      // reader saw a line that stopped, not an inflation episode.
      const depreciationRate =
        peg || previousExchangeRate <= 0 ? 0 : (exchangeRate / previousExchangeRate - 1) * 100
      const credibilityPremium = peg
        ? 0
        : INFLATION_PEAK *
          (1 - Math.exp(-periodsSinceBreak / INFLATION_BUILD)) *
          Math.exp(-periodsSinceBreak / INFLATION_DECAY)
      const inflationExpectation =
        activeMoney * 100 + PASS_THROUGH * depreciationRate + credibilityPremium

      data.push({
        period,
        reserves: parseFloat(reserveCover.toFixed(2)),
        domesticRate: parseFloat((actualRate * 100).toFixed(2)),
        foreignRate: parseFloat((foreignRate * 100).toFixed(2)),
        capitalOutflow: parseFloat(totalOutflow.toFixed(2)),
        speculatorAttack: parseFloat(speculativeOutflow.toFixed(2)),
        exchangeRate: parseFloat(exchangeRate.toFixed(3)),
        gdp: parseFloat((gdpEffect * 100).toFixed(1)),
        inflationExpectation: parseFloat(inflationExpectation.toFixed(1)),
        pegged: peg,
      })
      previousExchangeRate = exchangeRate
    }

    return data
  }

  const attackData = generateAttackPath()

  // Find critical moment
  const pegBreakIndex = attackData.findIndex((d) => !d.pegged)
  const peakRate =
    pegBreakIndex >= 0
      ? Math.max(...attackData.slice(0, pegBreakIndex + 5).map((d) => d.domesticRate))
      : Math.max(...attackData.map((d) => d.domesticRate))

  // Calculate final outcomes
  const initialData = attackData[0]
  const finalData = attackData[attackData.length - 1]
  const maxOutflow = Math.max(...attackData.map((d) => d.capitalOutflow))
  // The inflation episode is a peak and a decay, so the number that describes it
  // is the peak. Printing only the first and last values of a series that
  // rises to four times the first in between describes nothing.
  const peakInflation = Math.max(...attackData.map((d) => d.inflationExpectation))
  // The lowest output anywhere in the path, which is the cost of the defence.
  const troughGdp = Math.min(...attackData.map((d) => d.gdp))

  /**
   * The GDP chart's reference line: output at NO defence at all, which is the
   * same `outputIndex` evaluated at the tool's own starting policy rate rather
   * than at the defended rate the loop pays.
   *
   * It was the literal 100, labelled "Baseline (no crisis)". Nothing in this
   * model can produce 100: `outputIndex` returns 1 only at a zero interest
   * rate, and the moment the peg is under any pressure at all the central bank
   * is paying more than its policy rate. So the series started at 91.6, fell to
   * 78.7 while the peg was defended, and finished at 95.5 — never once
   * touching the line drawn to say where it would have been without the crisis.
   * The reader was shown a number the tool had not computed and a name for it
   * the model had not produced.
   *
   * 95.5 is not a guess. It is exactly the level the series RETURNS to once the
   * peg breaks, because a floating currency needs no defence, so `actualRate`
   * falls back to `activePolicy`. So the line is not "no crisis" — it is "no
   * defence", and the gap between the trough and the line is what defending
   * the peg cost, which is what this chart is titled for. The label says so and
   * the number is in the caption below the plot, so the line cannot be
   * mistaken for a level the series fails to reach.
   */
  const noDefenceGdp = outputIndex(activePolicy) * 100

  return (
    <div className="tool-card">
      <ToolHeader
        title="Speculative Attack on a Fixed Peg"
        description="Explore how inconsistent domestic and foreign policies create currency crisis dynamics. Watch as speculators attack the central bank's reserves, forcing abandonment of the exchange rate peg. From Lecture 21: How fixed regimes can collapse when underlying fundamentals are unsustainable."
        badge="advanced"
      />

      {/* Control Panel */}

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Crisis Parameters</h2>
        <div className="control-panel">
          {/* The unit is in the label and `unit` is empty on purpose, and the
           * number does not move. These two are the only sliders in the
           * twenty tools whose range is a fraction (0.01–0.15 and 0.01–0.25)
           * while the same quantity is printed as a percentage everywhere
           * else on the page — the rate chart's y axis is "Interest Rate (%)",
           * its caption is `peakRate.toFixed(2)}%`, and `AttackData.domesticRate`
           * is stored pre-multiplied by 100. So `unit="%"` on a 0.08 value
           * printed "0.08 %" above a chart reading "8.00 %" for the same
           * number: two figures for one quantity, 100x apart. Multiplying the
           * readout by 100 would paper over it and be worse, because every
           * reader of this tool has learned to type `0.08` to get 8% — a field
           * that silently stops accepting the number it accepted is a bigger
           * failure than a unit written in the wrong place. So the label says
           * (%) and the value stays exactly what the model and the slider
           * agree on. */}
          <SliderControl
            label="Domestic Money Growth Rate (%)"
            value={activeMoney}
            min={0.01}
            max={0.15}
            step={0.01}
            onChange={setMoneyGrowthRate}
            unit=""
          />
          <SliderControl
            label="Domestic Policy Rate (%)"
            value={activePolicy}
            min={0.01}
            max={0.25}
            step={0.01}
            onChange={setPolicyRate}
            unit=""
          />
          <SliderControl
            label="Capital Controls Strength"
            value={activeControls}
            min={0}
            max={1}
            step={0.1}
            onChange={setCapitalControls}
            unit=""
          />
          <SliderControl
            label="Initial Reserves (% of M at the peg)"
            value={initialReserves}
            min={20}
            max={150}
            step={10}
            onChange={setInitialReserves}
            unit="%"
          />
          <SliderControl
            label="Speculator Aggressiveness"
            value={activeAgg}
            min={0}
            max={1}
            step={0.1}
            onChange={setSpecAggressiveness}
            unit=""
          />
        </div>
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />

      {/* Scenario Buttons */}
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Scenario Analysis</h2>
        <div className="mb-s-4 flex flex-wrap gap-s-2">
          <Button
            onClick={() => setScenarioMode('crisis')}
            variant={scenarioMode === 'crisis' ? 'primary' : 'secondary'}
          >
            Crisis Scenario (High Growth + Low Controls)
          </Button>
          <Button
            onClick={() => setScenarioMode('stable')}
            variant={scenarioMode === 'stable' ? 'primary' : 'secondary'}
          >
            Stable Peg (Low Growth + Capital Controls)
          </Button>
          <Button
            onClick={() => setScenarioMode('managed')}
            variant={scenarioMode === 'managed' ? 'primary' : 'secondary'}
          >
            Managed Float (Medium Parameters)
          </Button>
        </div>
      </div>

      {/* Critical Metrics */}
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-3">
        <StatBox
          label="Foreign Policy Rate"
          value={(foreignRate * 100).toFixed(1)}
          unit="%"
        />
        <StatBox
          label="Initial Reserve Cover"
          value={initialReserves.toFixed(0)}
          unit="% of M"
          tone={initialReserves < 50 ? 'negative' : 'neutral'}
        />
        <StatBox
          label="Peg Breaks at Period"
          value={pegBreakIndex >= 0 ? pegBreakIndex : '—'}
          tone={pegBreakIndex >= 0 && pegBreakIndex < 30 ? 'negative' : 'neutral'}
        />
        <StatBox
          label="Peak Defense Rate"
          value={peakRate.toFixed(2)}
          unit="%"
          tone={peakRate > 15 ? 'caution' : 'neutral'}
        />
        <StatBox
          label="Max Capital Outflow"
          value={maxOutflow.toFixed(2)}
          unit="per period"
          tone="accent"
        />
        <StatBox
          label="Final Exchange Rate"
          value={finalData.exchangeRate.toFixed(3)}
          tone={finalData.exchangeRate > 1.1 ? 'negative' : 'neutral'}
        />
      </div>

      {/* Educational Boxes */}
      <div className="mb-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-2">
        <InfoBox type="info" title="The fundamental inconsistency">
          With fixed exchange rates, the domestic interest rate must equal the foreign rate (UIP with no expected depreciation).
          But if domestic money is growing faster than foreign money, this is unsustainable—people expect depreciation eventually.
          To defend the peg and prevent immediate depreciation, the central bank must raise rates above the foreign rate,
          contradicting the fundamental inconsistency.
        </InfoBox>

        <InfoBox type="warning" title="The reserve loss">
          When speculators attack (exchange domestic currency for reserves), the central bank loses reserves to defend the peg.
          With limited reserves, defense becomes impossible. Once reserves are exhausted, the peg must collapse.
          Watch how capital outflows accelerate when expectations of devaluation strengthen!
        </InfoBox>

        <InfoBox type="info" title="The interest rate paradox">
          The higher the interest rate raised to defend the peg, the more the domestic recession deepens (Y ↓).
          This economic deterioration actually INCREASES the likelihood of devaluation—making the speculative attack self-fulfilling!
          Defenders face an impossible choice: contract the economy or lose the peg.
        </InfoBox>

        <InfoBox type="success" title="Capital controls as escape valve">
          Capital controls can slow the rate of reserve loss by restricting speculators' ability to exchange currency.
          However, they're not a permanent solution—determined speculators find ways around them.
          Countries must eventually choose: float the currency or maintain credibility through consistent policy.
        </InfoBox>
      </div>

      {/* Reserve Depletion Chart */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Central Bank Reserves: The Countdown to Crisis
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          Reserves deplete as speculators exchange domestic currency for hard currency reserves.
          {pegBreakIndex >= 0 && (
            <span>
              {' '}
              {/* Caution, not difficulty. The break is the event this tool
                  exists to produce, and the tier ramp's darkest value said
                  "hardest lecture in the course" about a line the model
                  drew. `--c-warn-ink` is the token for something the reader
                  should watch, and this is it. */}
              <strong className="text-warn-ink">
                Peg breaks at period {pegBreakIndex}
              </strong>
              , when the cover falls below {CRISIS_THRESHOLD}% of M.
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                // Short on purpose: the rotated axis label is drawn at the full
                // text size in a 350px plot, and anything past about twenty
                // characters runs off the top of it. "M" is the money supply the
                // peg was set at, named in full on the slider above and in the
                // caption under this chart.
                value: 'Reserves (% of M)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              /* Pinned at zero on purpose, and `'auto'` on the other end, which
              * is not a pin at all: Recharts resolves `'auto'` from the data,
              * so this pair says "the floor is zero" and nothing more. Zero is
              * the floor because a share of M cannot go below it, and because
              * it makes the vertical distance down to the critical line
              * readable as a fraction of the M2 the attack starts against —
              * the same reason the critical line is drawn at a round 20%. */
              domain={[0, 'auto']}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            <ReferenceLine
              y={CRISIS_THRESHOLD}
              stroke={CRISIS_STROKE}
              strokeDasharray="5 5"
              label={{ value: `Critical Level (${CRISIS_THRESHOLD}%)`, fill: CRISIS_STROKE }}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                // insideTopLeft, not top: on a vertical line `top` puts the
                // label above the plot and the SVG clips it. These markers were
                // written before a break was possible, so none had ever shown.
                label={{
                  value: 'PEG BREAKS',
                  position: 'insideTopLeft',
                  fill: CRISIS_STROKE,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ChartArea
              type="monotone"
              dataKey="reserves"
              stroke={DOMESTIC_STROKE}
              fill={DOMESTIC_STROKE}
              fillOpacity={0.2}
              name="Reserves (hard currency)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <TileReadout>
          Initial cover: {initialReserves.toFixed(0)}% of M | Final cover: {finalData.reserves.toFixed(2)}% of M | Critical level: {CRISIS_THRESHOLD}% of M
        </TileReadout>
      </div>

      {/* Interest Rate Defense */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Interest Rate Defense: The Cost of Defending the Peg
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          As speculators attack and reserves deplete, the central bank must raise interest rates to defend the peg.
          Notice how the domestic rate diverges from the foreign rate when the peg is under threat.
          {pegBreakIndex >= 0 && (
            <span>
              {' '}
              After period {pegBreakIndex}, the peg breaks and the domestic rate can fall back toward sustainable levels.
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{ value: 'Interest Rate (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              /* Pinned, and the pin is the ruler: a nominal rate has a natural
              * ceiling, 30% is the policy-rate limit the historical context
              * was built under, and 2023's nominal rate is 5.3%. Derived from
              * the data the axis would shrink to about 0–6% and this tool's
              * whole subject — 5pp and 7pp hikes — would look like a
              * collapse. The interest rate is one of the five channels the
              * reader is meant to compare, so its scale must not move when a
              * slider does. */
              domain={[0, 30]}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                // insideTopLeft, not top: on a vertical line `top` puts the
                // label above the plot and the SVG clips it. These markers were
                // written before a break was possible, so none had ever shown.
                label={{
                  value: 'PEG BREAKS',
                  position: 'insideTopLeft',
                  fill: CRISIS_STROKE,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ChartLine
              type="monotone"
              dataKey="domesticRate"
              hide={ratesChart.isHidden('domesticRate')}
              stroke={DOMESTIC_STROKE}
              strokeWidth={2}
              name="Domestic Rate (defense effort)"
            />
            <ChartLine
              type="monotone"
              dataKey="foreignRate"
              hide={ratesChart.isHidden('foreignRate')}
              stroke={FOREIGN_STROKE}
              strokeWidth={2}
              name="Foreign Rate (exogenous)"
            />
          </LineChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'domesticRate', label: 'Domestic Rate (defense effort)', color: DOMESTIC_STROKE },
            { key: 'foreignRate', label: 'Foreign Rate (exogenous)', color: FOREIGN_STROKE },
          ]}
          hidden={ratesChart.hidden}
          onToggle={ratesChart.toggle}
          onShowAll={ratesChart.showAll}
        />
        <TileReadout>
          Peak domestic rate: {peakRate.toFixed(2)}% | Foreign rate: {(foreignRate * 100).toFixed(2)}%
        </TileReadout>
      </div>

      {/* Capital Outflows and Speculative Attack */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Capital Outflows and Speculative Attack
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          Capital outflows accelerate when speculators sense the peg is doomed. The &quot;speculative
          attack&quot; shows when organized speculators actively rush to exchange the domestic currency,
          hoping to trigger the devaluation they've been anticipating. This self-fulfilling prophecy is
          the hallmark of currency crises.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{ value: 'Outflow per Period', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                // insideTopLeft, not top: on a vertical line `top` puts the
                // label above the plot and the SVG clips it. These markers were
                // written before a break was possible, so none had ever shown.
                label={{
                  value: 'PEG BREAKS',
                  position: 'insideTopLeft',
                  fill: CRISIS_STROKE,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ChartBar
              dataKey="capitalOutflow"
              hide={outflowChart.isHidden('capitalOutflow')}
              stackId="a"
              fill={OUTFLOW_STROKE}
              name="Normal Outflow (rate differential)"
            />
            <ChartBar
              dataKey="speculatorAttack"
              hide={outflowChart.isHidden('speculatorAttack')}
              stackId="a"
              fill={CRISIS_STROKE}
              name="Speculative Attack"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'capitalOutflow', label: 'Normal Outflow (rate differential)', color: OUTFLOW_STROKE },
            { key: 'speculatorAttack', label: 'Speculative Attack', color: CRISIS_STROKE },
          ]}
          hidden={outflowChart.hidden}
          onToggle={outflowChart.toggle}
          onShowAll={outflowChart.showAll}
        />
        <TileReadout>
          Max outflow per period: {maxOutflow.toFixed(2)} | Speculator aggressiveness: {(activeAgg * 100).toFixed(0)}%
        </TileReadout>
      </div>

      {/* GDP Contraction from Defense */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Real Output Contraction: The Recession Cost
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          Defending the peg requires raising interest rates, which contracts investment and consumption.
          GDP falls as rates rise. Notice the deepest recession occurs right when the peg breaks—the point
          where the fundamental inconsistency becomes unsustainable. After the break, rates can fall and recovery begins
          (though with high inflation expectations).
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                // The index has no period-0 base: it is 1 − 1.5r, so 100 is
                // output at a ZERO interest rate and not output before the
                // crisis. The old label said "(base = 100)" next to a series
                // that starts at 91.6, which named an index this chart is not.
                // The base is stated in the caption under the plot, where there
                // is room for it and where a reader is already looking for the
                // numbers the dashed line stands for.
                value: 'Real Output Index',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              /* An index, pinned to its own definition rather than to the data
              * it happens to contain: 100 IS potential output, so the axis has
              * to show 0, a collapse, as well as whatever the boom above trend
              * reaches, and 120 is the largest value this series has produced.
              * Derived, it would rescale on every move of the output-shock
              * slider — which is exactly when a reader is holding two
              * settings in their head. */
              domain={[0, 120]}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(1)}
            />
            <ReferenceLine
              y={noDefenceGdp}
              stroke={chartTheme.axis.stroke}
              strokeDasharray="5 5"
              // insideTopRight, not the default: Recharts places a horizontal
              // reference line's label to the RIGHT of the plot box, which is
              // the 8px margin from the SVG on that side, so a label of any
              // width leaves the viewport and is clipped. The node is still in
              // the document, so a screen reader announces a line the reader
              // cannot see.
              label={{
                value: 'No rate defence',
                position: 'insideTopRight',
                fill: chartTheme.reference.fill,
              }}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                // insideTopLeft, not top: on a vertical line `top` puts the
                // label above the plot and the SVG clips it. These markers were
                // written before a break was possible, so none had ever shown.
                label={{
                  value: 'PEG BREAKS',
                  position: 'insideTopLeft',
                  fill: CRISIS_STROKE,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ChartArea
              type="monotone"
              dataKey="gdp"
              stroke={DOMESTIC_STROKE}
              fill={DOMESTIC_STROKE}
              fillOpacity={0.2}
              name="Real GDP Index"
            />
          </AreaChart>
        </ResponsiveContainer>
        <TileReadout>
          Minimum GDP: {troughGdp.toFixed(1)} | Final GDP: {finalData.gdp.toFixed(1)} | The
          dashed line is output at no defence at all — the policy rate of{' '}
          {(activePolicy * 100).toFixed(2)}% held for the whole path — which is
          {' '}{noDefenceGdp.toFixed(1)}. 100 on this axis is a zero interest
          rate, not the economy before the crisis.
        </TileReadout>
      </div>

      {/* Exchange Rate Path */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Exchange Rate: From Peg to Floating Depreciation
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          The exchange rate (in units of foreign currency per unit of domestic currency) is held constant at 1.0 while
          the peg is defended. Once the peg breaks and the currency floats, rapid depreciation occurs—the domestic
          currency weakens as speculators who bet on devaluation are proven right.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                // The unit is in the prose directly above this chart and
                // in the caption directly below it, and it used to be here too:
                // 31 characters is longer than the 25 a rotated label can
                // afford in half a 354px plot at 130% text, so 28px of it was
                // clipped off the top at every height. The name is what the
                // axis has to carry; the unit has somewhere else to be.
                value: 'Exchange Rate',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              /* The peg floor here is a FACT about the chart rather than a
              * choice about the data: the question the chart asks is whether
              * the exchange rate can hold 1.0, so an axis starting anywhere
              * else would hide the answer. 0.95 is one 0.05 under the peg, so
              * a break is legible as a line leaving the frame rather than as a
              * line quietly crossing a gridline. The ceiling is the data's,
              * because there is no reason to cap a rate that is already off
              * the peg. */
              domain={[0.95, 'auto']}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(3)}
            />
            <ReferenceLine
              y={1.0}
              stroke={OUTFLOW_STROKE}
              strokeDasharray="5 5"
              label={{ value: 'Peg level (1.0)', fill: OUTFLOW_STROKE }}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                // insideTopLeft, not top: on a vertical line `top` puts the
                // label above the plot and the SVG clips it. These markers were
                // written before a break was possible, so none had ever shown.
                label={{
                  value: 'PEG BREAKS',
                  position: 'insideTopLeft',
                  fill: CRISIS_STROKE,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ChartLine
              type="monotone"
              dataKey="exchangeRate"
              stroke={DOMESTIC_STROKE}
              strokeWidth={2}
              name="Exchange Rate"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <TileReadout>
          Exchange rate at period 0: 1.0 | Final exchange rate: {finalData.exchangeRate.toFixed(3)} ({((finalData.exchangeRate - 1) * 100).toFixed(1)}% depreciation)
        </TileReadout>
      </div>

      {/* Inflation Expectations */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Inflation Expectations: The Loss of Price Stability
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          With the peg in place, inflation expectations remain anchored (based on money growth rate).
          Once the peg breaks and the exchange rate depreciates, inflation expectations rise sharply due to:
          (1) import price increases from depreciation, (2) loss of credibility, (3) continued rapid money growth.
          This is why currency crises often lead to high inflation regimes.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{ value: 'Expected Inflation (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              /* Pinned at zero for the same reason the reserves axis is, and
              * here it is load-bearing rather than tidy: this tool's scenarios
              * include NEGATIVE expected inflation, so a reader has to be
              * able to see which side of zero the series is on, and a domain
              * derived from the data could begin at a positive number. The
              * ceiling is the data's. */
              domain={[0, 'auto']}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(1)}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                // insideTopLeft, not top: on a vertical line `top` puts the
                // label above the plot and the SVG clips it. These markers were
                // written before a break was possible, so none had ever shown.
                label={{
                  value: 'PEG BREAKS',
                  position: 'insideTopLeft',
                  fill: CRISIS_STROKE,
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
            <ChartArea
              type="monotone"
              dataKey="inflationExpectation"
              stroke={CRISIS_STROKE}
              fill={CRISIS_STROKE}
              fillOpacity={0.2}
              name="Expected Inflation"
            />
          </AreaChart>
        </ResponsiveContainer>
        <TileReadout>
          Anchored at the peg: {initialData.inflationExpectation.toFixed(1)}% | Peak after the break: {peakInflation.toFixed(1)}% | Period 60: {finalData.inflationExpectation.toFixed(1)}%
        </TileReadout>
      </div>

      {/* Historical Context */}
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Historical Examples</h2>
        <div className="grid grid-cols-1 gap-s-3 lg:grid-cols-2">
          <ToolNote label="1992" variant="warning" title="ERM Crisis (UK)">
            <p>
              British pound pegged in European Exchange Rate Mechanism. German reunification raised German interest rates.
              UK raised rates to 15% to defend. Speculators (Soros) attacked reserves. Peg broke in hours. GDP contraction
              but long-run recovery after float allowed lower rates. Lesson: Policy inconsistency makes peg indefensible.
            </p>
          </ToolNote>

          <ToolNote label="1994-95" variant="warning" title="Mexico Crisis">
            <p>
              Peso pegged to USD. Rapid money growth + current account deficit. Peso devaluation expected.
              Mexico tried to defend with high rates but ran out of reserves. Lost peg. Depreciation + domestic recession.
              High inflation followed. Only recovered with IMF bailout + structural reforms + eventual currency stabilization.
            </p>
          </ToolNote>

          <ToolNote label="1997-98" variant="warning" title="Asian Financial Crisis">
            <p>
              Thai baht pegged to USD despite current account deficits and rising interest rates. Speculators attacked.
              Thailand lost reserves and eventually float forced. Contagion spread across Asia. Currencies depreciated 40-80%.
              Severe recessions followed. Shows how pegs can be vulnerable to self-fulfilling speculative attacks
              even with strong fundamentals.
            </p>
          </ToolNote>

          <ToolNote label="1998" variant="insight" title="Hong Kong: Successful Defense">
            <p>
              Hong Kong dollar pegged to USD via currency board. During Asian crisis, speculators attacked.
              Hong Kong raised interest rates to 300%+ to defend. Government bought stock index to signal commitment.
              Speculators eventually gave up. Peg held. Hong Kong avoided devaluation but suffered severe recession.
              Shows extreme credibility can defend peg even with massive attack.
            </p>
          </ToolNote>

          <ToolNote label="Post-1999" variant="insight" title="Eurozone: Unified Currency">
            <p>
              Countries gave up independent currency for Euro. No devaluation possible—no peg to break!
              However, creates rigidity: deficit countries cannot devalue to regain competitiveness. 2010-2015 Eurozone crisis
              showed danger: Greece, Portugal, Ireland faced very high unemployment because couldn't devalue.
              Fiscal transfers within Eurozone partially compensate. Lesson: Currency union prevents speculative attacks but limits flexibility.
            </p>
          </ToolNote>

          <ToolNote label="2022" variant="warning" title="Russia: War & Peg Defense">
            <p>
              After invasion, ruble faced massive depreciation expectations. Russia raised rates from 4% to 20%+, implemented
              capital controls, and intervened heavily in forex market. Peg successfully defended—ruble stabilized at higher
              level. However, high rates and controls stifle growth. Shows capital controls + extreme rates can work but
              at huge economic cost. Fundamental adjustment (fiscal discipline) ultimately required.
            </p>
          </ToolNote>
        </div>
      </div>

      {/* Technical Explanation */}
      <div className="mb-s-8">
        <details className="group cursor-pointer">
          <summary className="select-none text-label-sm font-semibold text-fg-muted transition-colors hover:text-fg">
            Technical Details: The Math Behind the Crisis
          </summary>
          <div className="prose-lecture mt-s-4 text-sm">
            <p>
              <strong>Uncovered Interest Parity (UIP):</strong> With a fixed peg, the domestic interest rate must satisfy:{' '}
              <code>i_domestic = i_foreign + (expected depreciation)</code>. If peg is credible, expected depreciation = 0, so{' '}
              <code>i_domestic = i_foreign</code>.
            </p>
            <p>
              <strong>The Inconsistency:</strong> If domestic money grows faster than foreign money, long-run equilibrium requires
              domestic currency to depreciate. But if market expects devaluation, the domestic rate must be raised to defend the
              peg. Once speculators believe devaluation is inevitable, they attack reserves, forcing the devaluation that was only
              expected before. This is a <strong>self-fulfilling prophecy</strong>.
            </p>
            <p>
              <strong>Reserve Loss Mechanism:</strong> Each unit of capital outflow depletes reserves (assuming central bank must
              &quot;buy&quot; domestic currency by selling reserves). The rate of reserve loss is proportional to:
            </p>
            <ul>
              <li>Rate differential (i_foreign + expected_depreciation - i_domestic)</li>
              <li>Speculator aggressiveness (how quickly they attack once they see vulnerability)</li>
              <li>Openness (inverse of capital controls)</li>
            </ul>
            <p>
              <strong>Crisis Threshold:</strong> Once reserves fall below some critical level (typically 20-30% of monetary base),
              the central bank can no longer defend. Market knows this, so the attack becomes self-fulfilling. Expected depreciation
              jumps, speculators rush to exchange, and the peg collapses in a matter of hours or days.
            </p>
            <p>
              <strong>Post-Crisis Dynamics:</strong> After the peg breaks, the currency depreciates until the interest rate differential
              matches expected depreciation. Inflation expectations rise due to pass-through from depreciation. Recovery requires either:
              (a) credibly tightening money growth to match expected inflation, or (b) waiting for expectations to adjust downward.
              This is why many crisis countries experience prolonged high inflation.
            </p>
          </div>
        </details>
      </div>

      {/* Policy Implications */}
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Policy Insights</h2>
        <div className="grid grid-cols-1 gap-s-4 lg:grid-cols-2">
          <InfoBox type="warning" title="The fundamental inconsistency trilemma">
            <p>
              A country cannot simultaneously have: (1) fixed exchange rate, (2) free capital flows, (3) independent monetary policy.
              Choose two. Hong Kong (1 + 2 = no independence). US (2 + 3 = floating rate). China (1 + 3 = capital controls).
              Every sustainable regime requires sacrificing one objective.
            </p>
          </InfoBox>

          <InfoBox type="info" title="Reserve adequacy matters">
            <p>
              Countries defending a peg need sufficient foreign reserves to withstand a sustained attack. The IMF uses rules of thumb:
              3-6 months of imports, 100%+ of short-term debt. Low reserves invite attack. This explains why emerging markets
              build large reserve buffers (self-insurance against crisis).
            </p>
          </InfoBox>

          <InfoBox type="success" title="Credibility is key">
            <p>
              Central bank credibility determines attack intensity. If markets believe commitment is unwavering, speculators don't attack—
              or attacks fail because markets expect successful defense. But credibility takes years to build and seconds to lose.
              One breach (like the UK breaking the ERM promise in 1992) destroys it for years.
            </p>
          </InfoBox>

          <InfoBox type="warning" title="Capital controls as temporary tool">
            <p>
              Controls slow outflows but don't stop determined speculators. They also distort the economy (capital misallocation).
              Long-term solution requires fixing the fundamental problem: either align domestic policy with exchange rate regime,
              or switch to floating rate. Temporary controls buy time for adjustment, not permanent solution.
            </p>
          </InfoBox>

          <InfoBox type="info" title="Floating currencies provide flexibility">
            <p>
              Floating regimes allow interest rate and exchange rate to adjust simultaneously, maintaining arbitrage equilibrium
              (UIP). No speculative attack is possible because markets price in expected depreciation. Tradeoff: exchange rate volatility
              complicates business planning. Most modern economies use managed floats (intervening to smooth but not target rate).
            </p>
          </InfoBox>

          <InfoBox type="success" title="International support matters">
            <p>
              IMF rescue packages provide foreign exchange to defend pegs (supplementing inadequate reserves). BUT IMF typically conditions
              support on policy adjustment (austerity, monetary tightening, structural reform). This is often politically difficult,
              explaining why countries sometimes reject IMF support and lose peg anyway (e.g., Russia 1998, Argentina 2001).
            </p>
          </InfoBox>
        </div>
      </div>

      {/* Summary Box */}
      <ToolNote label="In one paragraph" variant="lesson" title="Key Takeaway" headingLevel={2}>
        <p>
          <strong>Fixed exchange rate pegs are vulnerable to self-fulfilling speculative attacks</strong> when:
          (1) underlying fundamentals are unsustainable (rapid money growth exceeds foreign rate),
          (2) the central bank has insufficient reserves to defend,
          (3) speculators coordinate their attack once they perceive weakness.
        </p>
        <p>
          Defending the peg requires raising interest rates to compensate for expected depreciation, but high rates
          contract the economy—often making the speculative attack self-fulfilling.
        </p>
        <p>
          The only sustainable fixed peg regimes are those backed by either: (a) consistent fundamental policies (low money growth),
          (b) massive foreign exchange reserves (Hong Kong, Singapore), or (c) extreme credibility + capital controls (China).
          Most developing countries eventually move to floating rates, which better accommodate shocks and reduce crisis vulnerability.
        </p>
      </ToolNote>
    </div>
  )
}
