import { useState } from 'react'
import { LineChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartArea, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { ChartLegend } from '../components/ChartLegend'
import { useHiddenSeries } from '../lib/chartSeries'
import { calculateSolowSteadyState } from '../lib/calculations'
import { useToolReset } from '../lib/toolReset'

interface SolowData {
  k: number
  y: number
  investment: number
  depreciation: number
}

interface TimePathData {
  year: number
  k: number
  y: number
}

/**
 * One copy of this tool's starting values. The `useState` calls below read
 * from it, so "Reset to defaults" cannot return to a number the tool no
 * longer opens at — the failure mode of a hand-written reset that re-typed
 * every default in a second list.
 */
const DEFAULTS = {
  savingsRate: 0.2,
  depreciationRate: 0.05,
  populationGrowth: 0.02,
  capitalShare: 0.3,
  initialK: 1.0,
  scenarioMode: 'custom' as SolowScenario,
}

/** Named so the reset record can hold it: a bare inline union in
 * `useState<...>(DEFAULTS.scenarioMode)` would widen to `string` and stop
 * being assignable to the state it resets. */
type SolowScenario = 'custom' | 'high-savings' | 'low-growth'

/**
 * The two numbers a preset button sets. Each is written once here and read by
 * both the handler that applies it and the label the reader clicks, because
 * each used to be written twice: `setSavingsRate(0.35)` next to
 * "High Savings (s=0.35)". A retune that fixed one and not the other is a
 * button that lies about its own name, which is the same defect as a tile that
 * prints a number the model did not use.
 *
 * They are NOT in `DEFAULTS`, deliberately. `useToolReset` walks that record's
 * keys and derives a setter name from each, so a nested preset table would be
 * iterated by a reset that has no setter to call for it. Reset's job is to
 * return the tool to where it OPENS — Custom, at 0.2 and 0.02 — and a preset is
 * a second starting point reached by undoing the sliders it wrote.
 */
const PRESET_SAVINGS_RATE = 0.35
const PRESET_POPULATION_GROWTH = 0.01

/**
 * `s = 0.20, n = 0.020, δ = 0.05, α = 0.30` — the inputs a scenario card was
 * built from, at the precision the sliders above print them in. A card that
 * gives k* and y* without naming the parameters behind them is the defect this
 * file had: the reader cannot tell which of the three cards answers to the
 * controls.
 */
function parameters(s: number, n: number, d: number, alpha: number): string {
  return `s = ${s.toFixed(2)}, n = ${n.toFixed(3)}, δ = ${d.toFixed(2)}, α = ${alpha.toFixed(2)}`
}

export default function SolowSimulator() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  // Control parameters
  const [savingsRate, setSavingsRate] = useState(DEFAULTS.savingsRate)
  const [depreciationRate, setDepreciationRate] = useState(DEFAULTS.depreciationRate)
  const [populationGrowth, setPopulationGrowth] = useState(DEFAULTS.populationGrowth)
  const [capitalShare, setCapitalShare] = useState(DEFAULTS.capitalShare)
  const [initialK, setInitialK] = useState(DEFAULTS.initialK)
  const [scenarioMode, setScenarioMode] = useState<SolowScenario>(DEFAULTS.scenarioMode)

  /**
   * One hidden-series set for the tool's two charts, for the same reason
   * `MundellFleming` shares one across its two: they draw the same model at
   * two zoom levels, so "hide consumption" is one request, not two.
   */
  const series = useHiddenSeries(['production', 'investment', 'depreciation', 'k', 'y'])

  const { reset, dirty } = useToolReset(
    {
    savingsRate: savingsRate,
    depreciationRate: depreciationRate,
    populationGrowth: populationGrowth,
    capitalShare: capitalShare,
    initialK: initialK,
    scenarioMode: scenarioMode,
    },
    {
      setSavingsRate,
      setDepreciationRate,
      setPopulationGrowth,
      setCapitalShare,
      setInitialK,
      setScenarioMode,
    },
    {
      savingsRate: DEFAULTS.savingsRate,
      depreciationRate: DEFAULTS.depreciationRate,
      populationGrowth: DEFAULTS.populationGrowth,
      capitalShare: DEFAULTS.capitalShare,
      initialK: DEFAULTS.initialK,
      scenarioMode: DEFAULTS.scenarioMode,
    },
  )

  /**
   * The values the model runs on. They are aliases of the state rather than
   * overrides of it: a preset used to substitute its own value here, so a
   * slider the preset had overridden wrote `populationGrowth`, which nothing
   * read — the control moved, Reset lit up, and no number on the page changed.
   * A preset now writes through to the state (see `applyPreset`), so the
   * model, the sliders, the tiles and Reset all hold one value per parameter.
   */
  const activeS = savingsRate
  const activeN = populationGrowth
  const activeD = depreciationRate
  const activeAlpha = capitalShare
  const activeK0 = initialK

  /**
   * A preset is a shortcut for a set of slider positions, not a separate mode
   * the sliders cannot reach: it writes through to the state it names, so
   * nothing on the page is ever running on a value the reader cannot see or
   * edit. `dirty` is then true the moment a preset is applied — a preset sets
   * controls, so Reset is live — and Reset returns the tool to Custom.
   */
  const applyPreset = (mode: SolowScenario) => {
    if (mode === 'high-savings') setSavingsRate(PRESET_SAVINGS_RATE)
    if (mode === 'low-growth') setPopulationGrowth(PRESET_POPULATION_GROWTH)
    setScenarioMode(mode)
  }

  /**
   * A manual edit hands the page back to "Custom Parameters". Without this the
   * preset button keeps its selected treatment after the reader has dragged
   * the very slider it set, so a highlighted "Low Growth (n=0.01)" sits above
   * a page running at n = 0.03 — the same class of lie as a tile printing the
   * slider's value next to the model's.
   */
  const onEdit = (setter: (value: number) => void) => (value: number) => {
    setter(value)
    setScenarioMode('custom')
  }

  // Calculate steady state
  const kStar = calculateSolowSteadyState(activeS, activeN, activeD, activeAlpha)
  const yStar = Math.pow(kStar, activeAlpha)
  const cStar = (1 - activeS) * yStar
  const investmentPerWorkerSS = activeS * yStar

  // Calculate time to 90% of steady state
  let timeToConvergence = 0
  let tempK = activeK0
  while (tempK < 0.9 * kStar && timeToConvergence < 1000) {
    // The `(1 + n)` divisor is the per-worker form the "Model Equations" panel
    // prints: without it the path converges on (s/δ)^(1/(1-α)) = 7.25 at the
    // defaults, which is not the k* = 4.48 the tiles, the Solow diagram and
    // the caption under the chart all report.
    tempK = (activeS * Math.pow(tempK, activeAlpha) + (1 - activeD) * tempK) / (1 + activeN)
    timeToConvergence++
  }

  // Generate Solow diagram data (production function, investment, and depreciation)
  const generateSolowDiagram = (): SolowData[] => {
    const data: SolowData[] = []
    const maxK = Math.max(kStar * 1.5, 4)
    const step = maxK / 50

    for (let k = step; k <= maxK; k += step) {
      const y = Math.pow(k, activeAlpha)
      const investment = activeS * y
      const depreciation = (activeN + activeD) * k

      data.push({
        k: parseFloat(k.toFixed(2)),
        y: parseFloat(y.toFixed(3)),
        investment: parseFloat(investment.toFixed(3)),
        depreciation: parseFloat(depreciation.toFixed(3)),
      })
    }
    return data
  }

  // Generate time path showing convergence to steady state
  const generateTimePath = (): TimePathData[] => {
    const data: TimePathData[] = []
    let k = activeK0
    let y = Math.pow(k, activeAlpha)

    for (let year = 0; year <= 100; year += 1) {
      data.push({
        year,
        k: parseFloat(k.toFixed(3)),
        y: parseFloat(y.toFixed(3)),
      })

      // Update for next period. Same per-worker form as the convergence loop
      // above, and for the same reason: the `-n` dilution is what makes this
      // path converge on the k* the rest of the tool reports.
      const investment = activeS * y
      k = (investment + (1 - activeD) * k) / (1 + activeN)
      y = Math.pow(k, activeAlpha)

      // Stop if converged
      if (Math.abs(k - kStar) < 0.001) {
        for (let futureYear = year + 1; futureYear <= 100; futureYear += 1) {
          data.push({
            year: futureYear,
            k: parseFloat(kStar.toFixed(3)),
            y: parseFloat(yStar.toFixed(3)),
          })
        }
        break
      }
    }
    return data
  }

  // Generate comparison scenarios
  const generateScenarioComparison = () => {
    // The two reference cards are computed from literals, on purpose: a card
    // that answered to a slider would not be a fixed point to compare against,
    // it would be a second copy of the Base card.
    //
    // This function used to compute THREE cards from literals — the base card
    // included — so every card ignored every control on the page while sitting
    // in a block headed "Scenario Analysis" and captioned "Compare different
    // parameter combinations". At the tool's own defaults the base card
    // coincided with `kStar`, so the disagreement was invisible until the
    // reader moved anything. The base card is now the reader's own parameter
    // set, and the two reference cards say they are fixed.
    const refS = 0.2
    const refN = 0.02
    const refD = 0.05
    const refAlpha = 0.3
    const steadyState = (s: number, n: number) => {
      const k = calculateSolowSteadyState(s, n, refD, refAlpha)
      return { k, y: Math.pow(k, refAlpha) }
    }

    // High savings scenario (s=0.35)
    const high = steadyState(PRESET_SAVINGS_RATE, refN)
    // Low growth scenario (n=0.01)
    const low = steadyState(refS, PRESET_POPULATION_GROWTH)

    return [
      {
        id: 'base',
        name: 'Base — your settings',
        parameters: parameters(activeS, activeN, activeD, activeAlpha),
        k: kStar,
        y: yStar,
      },
      {
        id: 'high-savings',
        name: `High Savings (s=${PRESET_SAVINGS_RATE}) — fixed`,
        parameters: parameters(PRESET_SAVINGS_RATE, refN, refD, refAlpha),
        k: high.k,
        y: high.y,
      },
      {
        id: 'low-growth',
        name: `Low Growth (n=${PRESET_POPULATION_GROWTH}) — fixed`,
        parameters: parameters(refS, PRESET_POPULATION_GROWTH, refD, refAlpha),
        k: low.k,
        y: low.y,
      },
    ]
  }

  const solowDiagram = generateSolowDiagram()
  const timePath = generateTimePath()
  const scenarios = generateScenarioComparison()


  return (
    <div className="tool-card">
      <ToolHeader
        title="Solow Growth Model"
        description="Explore how savings, population growth, and depreciation determine the steady-state capital stock and output. Learn why growth accounting shows technology is the key to long-run growth."
        badge="advanced"
      />

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Model Parameters</h2>
        <div className="control-panel">
          <SliderControl
            label="Savings Rate (s)"
            value={activeS}
            min={0.1}
            max={0.4}
            step={0.05}
            onChange={onEdit(setSavingsRate)}
          />
          <SliderControl
            label="Population Growth (n)"
            value={activeN}
            min={0.01}
            max={0.05}
            step={0.005}
            onChange={onEdit(setPopulationGrowth)}
          />
          <SliderControl
            label="Depreciation Rate (δ)"
            value={activeD}
            min={0.01}
            max={0.1}
            step={0.01}
            onChange={onEdit(setDepreciationRate)}
          />
          <SliderControl
            label="Capital Share (α)"
            value={activeAlpha}
            min={0.2}
            max={0.4}
            step={0.05}
            onChange={onEdit(setCapitalShare)}
          />
          <SliderControl
            label="Initial Capital per Worker (k₀)"
            value={activeK0}
            min={0.5}
            max={3.0}
            step={0.1}
            onChange={onEdit(setInitialK)}
          />
        </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Scenario Analysis</h2>
        <div className="flex flex-wrap gap-s-2">
          <Button
            onClick={() => setScenarioMode('custom')}
            variant={scenarioMode === 'custom' ? 'primary' : 'secondary'}
          >
            Custom Parameters
          </Button>
          <Button
            onClick={() => applyPreset('high-savings')}
            variant={scenarioMode === 'high-savings' ? 'primary' : 'secondary'}
          >
            High Savings (s={PRESET_SAVINGS_RATE})
          </Button>
          <Button
            onClick={() => applyPreset('low-growth')}
            variant={scenarioMode === 'low-growth' ? 'primary' : 'secondary'}
          >
            Low Growth (n={PRESET_POPULATION_GROWTH})
          </Button>
        </div>
        <p className="mt-s-3 text-sm leading-relaxed text-fg-muted">
          A preset moves the sliders it sets and leaves the rest where you left them, so you can keep
          adjusting from there. Move any slider yourself and the tool returns to Custom Parameters.
        </p>
      </div>

      {/* Key Results */}
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-3">
        <StatBox label="Steady State k*" value={kStar.toFixed(2)} tone="accent" />
        <StatBox label="Steady State y*" value={yStar.toFixed(3)} tone="accent" />
        <StatBox
          label="Steady State Total Output Growth (n)"
          value={(activeN * 100).toFixed(2)}
          unit="%"
          tone="accent"
        />
        <StatBox label="Consumption per Worker (c*)" value={cStar.toFixed(3)} />
        {/* `s·y*` is the level of investment per worker at the steady state.
            The "rate" of investment is s, and naming that word here while
            printing a level is the same defect as a tile naming a quantity the
            model does not compute. */}
        <StatBox label="Investment per Worker (i*)" value={investmentPerWorkerSS.toFixed(3)} />
        <StatBox label="Time to 90% Convergence" value={timeToConvergence} unit="years" />
      </div>

      {/* Educational Insight */}
      <div className="mb-s-8">
        <InfoBox type="success" title="Key Insight">
          <p>
            The steady-state growth rate equals the population growth rate (n ={' '}
            {(activeN * 100).toFixed(2)}%). Notice that changing the savings rate shifts the
            level of steady-state capital and output but does NOT change the long-run growth rate!
            Only technological progress (not modeled here) can increase long-run per-capita growth.
          </p>
        </InfoBox>
      </div>

      {/* Solow Diagram */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Solow Diagram: Capital per Worker Dynamics
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          Investment line (sf(k)) shows capital investment. Depreciation line ((n+δ)k) shows capital wearing away and dilution from population growth.
          At k* where lines intersect, investment = depreciation, and capital per worker is stable.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={solowDiagram} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="k"
              label={{
                value: 'Capital per Worker (k)',
                position: 'insideBottomRight',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
{...chartTheme.axis}
includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Output/Capital per Worker',
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
              formatter={(value: number) => value.toFixed(3)}
            />
            <ChartArea
              type="monotone"
              dataKey="y"
              stroke={chartColor(0)}
              fill={chartColor(0)}
              fillOpacity={0.2}
              name="Production (y = k^α)"
              hide={series.isHidden('production')}
            />
            <ChartArea
              type="monotone"
              dataKey="investment"
              stroke={chartColor(1)}
              fill={chartColor(1)}
              fillOpacity={0.2}
              name="Investment (sy)"
              hide={series.isHidden('investment')}
            />
            <ChartLine
              type="monotone"
              dataKey="depreciation"
              stroke={chartColor(4)}
              strokeWidth={2}
              name="Depreciation ((n+δ)k)"
              hide={series.isHidden('depreciation')}
            />
          </AreaChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'production', label: 'Production (y = k^α)', color: chartColor(0) },
            { key: 'investment', label: 'Investment (sy)', color: chartColor(1) },
            { key: 'depreciation', label: 'Depreciation ((n+δ)k)', color: chartColor(4) },
          ]}
          hidden={series.hidden}
          onToggle={series.toggle}
          onShowAll={series.showAll}
        />
        {/*
         * All six tiles, and which of them this chart can carry.
         *
         * Three can: `k*` is the crossing, `y*` is the production curve's
         * height there, and `i* = s·y*` is the investment line at the same
         * `k` — the reader can put a finger on each.
         *
         * Three cannot, and each for a different reason worth naming, because
         * "it is somewhere else on the page" is only helpful if the page says
         * where:
         *
         *  - `c* = (1−s)y*` is a LEVEL and is genuinely on this plot, as the
         *    vertical gap between the production curve and the investment line
         *    at `k*`. It has no mark of its own because a dot at 1.255 would be
         *    placed against an axis that measures output per worker, and the
         *    gap is the mark.
         *  - the STEADY-STATE GROWTH RATE is a RATE and this chart's two axes
         *    are levels in units per worker. A mark would assert a comparison
         *    between 2.00% and a capital stock, which the chart cannot support,
         *    so it is named here and its real home is the next chart: it is the
         *    slope of `k*` against time.
         *  - the TIME TO 90% CONVERGENCE is a number of years, and the next
         *    chart's x axis is years. It is named on both.
         */}
        <TileReadout>
          Steady state k* = {kStar.toFixed(2)}, where the investment line
          crosses the depreciation line | y* = {yStar.toFixed(3)} is the height
          of the production curve at that k, and i* ={' '}
          {investmentPerWorkerSS.toFixed(3)} is the investment line at the
          same k | c* = {cStar.toFixed(3)} is the gap between the two curves
          there, so it is a height on this chart but not a line of its own |
          Steady State Total Output Growth {(activeN * 100).toFixed(2)}% is n itself: a
          rate, and both of this chart's axes are levels in units per worker, so
          it belongs to the time-path chart below as the slope of k* — not to
          this one
        </TileReadout>
      </div>

      {/* Time Path */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Capital Accumulation Over Time: Path to Steady State
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          The economy converges to steady state. If below k*, investment exceeds depreciation, capital grows.
          If above k*, depreciation exceeds investment, capital shrinks. The convergence speed depends on distance from k*.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={timePath} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="year"
              label={{ value: 'Years', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
{...chartTheme.axis}
includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Capital per Worker (k)',
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
              formatter={(value: number) => value.toFixed(3)}
            />
            <ChartLine
              type="monotone"
              dataKey="k"
              stroke={chartColor(0)}
              strokeWidth={2}
              name="Capital per Worker (k)"
              hide={series.isHidden('k')}
            />
            <ChartLine
              type="monotone"
              dataKey="y"
              stroke={chartColor(1)}
              strokeWidth={2}
              name="Output per Worker (y)"
              hide={series.isHidden('y')}
            />
          </LineChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'k', label: 'Capital per Worker (k)', color: chartColor(0) },
            { key: 'y', label: 'Output per Worker (y)', color: chartColor(1) },
          ]}
          hidden={series.hidden}
          onToggle={series.toggle}
          onShowAll={series.showAll}
        />
        {/*
         * The two tiles this chart can carry outright — `k*` and `y*` are its
         * asymptotes, so they are the flat end of both lines — plus the two it
         * exists to place. "Time to 90% convergence" is a point on THIS
         * chart's x axis, and the growth rate is this chart's slope, so between
         * the two of them the pair the Solow diagram could not carry is
         * locatable here rather than only in prose.
         */}
        <TileReadout>
          Starting from k₀ = {activeK0.toFixed(1)}, the economy reaches 90% of
          steady state in {timeToConvergence} years — read that year off the x
          axis, where the k line first sits at {kStar.toFixed(2)} × 0.9 ={' '}
          {(kStar * 0.9).toFixed(2)}. Steady states: k* = {kStar.toFixed(2)},
          y* = {yStar.toFixed(3)} | Steady State Total Output Growth{' '}
          {(activeN * 100).toFixed(2)}%: on THIS chart rather than the
          previous one, because the axes are a level and a number of years, and
          a rate is the slope of the k line between them. Raising s moves both
          levels and this rate not at all — the rate is n, and n is the
          dilution term in the accumulation equation, not anything on the
          diagram.
        </TileReadout>
      </div>

      {/* Scenario Comparison */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Scenario Comparison: Effects on Steady State
        </h2>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          Compare different parameter combinations. The Base card follows the sliders above, so it
          reads k* and y* for whatever the model is running on; the other two are fixed reference
          points and do not move. Notice that higher savings raises k* and y* but growth rate stays
          at n. Lower population growth raises both k* and y* as well, and LOWERS the growth rate,
          because that rate is n.
        </p>
        <div className="grid grid-cols-1 gap-s-3 lg:grid-cols-2">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="stat-tile stat-tile--neutral p-s-4 text-left">
              <div className="text-base font-semibold text-fg">{scenario.name}</div>
              <div className="mt-1.5 text-xs text-fg-subtle tabular-nums">{scenario.parameters}</div>
              <div className="mt-1.5 text-sm text-fg-muted tabular-nums">
                Steady State k*:{' '}
                <span className="font-semibold text-accent-ink">{scenario.k.toFixed(2)}</span>
              </div>
              <div className="text-sm text-fg-muted tabular-nums">
                Steady State y*:{' '}
                <span className="font-semibold text-accent-ink">{scenario.y.toFixed(3)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Boxes */}
      <div className="mb-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-2">
        <InfoBox type="info" title="Diminishing Returns to Capital">
          <p>
            As capital grows, each additional unit of capital produces less output.
            This is why the production function y = k^α curves (α &lt; 1). Rich countries with high k
            grow slower than poor countries catching up, all else equal.
          </p>
        </InfoBox>

        <InfoBox type="info" title="Convergence Hypothesis">
          <p>
            Poor countries can catch up to rich countries if they have the same savings rates,
            population growth, and depreciation rates. This happens because returns to capital are
            highest when capital is scarce! Limited data supports absolute convergence, but conditional
            convergence (controlling for differences) is strong.
          </p>
        </InfoBox>

        <InfoBox type="success" title="Technology is Key">
          <p>
            The Solow model shows that in steady state, output per worker grows only with
            technological progress (A in Y = A·K^α·L^(1-α)). Long-run growth is &quot;exogenous&quot; —
            driven by technology, not savings. This explains why all countries eventually grow at
            similar rates despite different savings behavior.
          </p>
        </InfoBox>

        <InfoBox type="warning" title="Capital Deepening vs. Growth">
          <p>
            Increasing the savings rate causes a temporary acceleration (the transition to a higher
            k*), but the long-run TOTAL growth rate is n either way — in this model output per
            worker is flat at 0% once k* is reached, and n is the rate of aggregate output, diluted
            across a faster-growing population. To permanently accelerate growth per worker, need
            technological progress. This explains why Asian &quot;growth miracles&quot; eventually
            slowed as they caught up.
          </p>
        </InfoBox>
      </div>

      {/* Technical Details */}
      <div className="mb-s-8">
        <details className="group cursor-pointer">
          <summary className="text-label-sm select-none font-semibold text-fg-muted transition-colors hover:text-fg">
            Model Equations
          </summary>
          <div className="prose-lecture mt-s-3 text-sm">
            <div>
              Production function: Y<sub>t</sub> = K<sub>t</sub><sup>α</sup> · L<sub>t</sub><sup>1-α</sup>
            </div>
            <div className="mt-s-2">
              Capital accumulation: K<sub>t+1</sub> = sY<sub>t</sub> + (1-δ)K<sub>t</sub>
            </div>
            <div className="mt-s-2">
              Per-worker form: k<sub>t+1</sub> = sy<sub>t</sub>/(1+n) + (1-δ)k<sub>t</sub>/(1+n)
            </div>
            <div className="mt-s-2">
              Steady state: k* = (s/(n+δ))<sup>1/(1-α)</sup>
            </div>
            <div className="mt-s-2">
              Steady state output: y* = (k*)<sup>α</sup>
            </div>
            <div className="mt-s-2">
              Convergence speed: Higher when further from k*; Slower near steady state
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}
