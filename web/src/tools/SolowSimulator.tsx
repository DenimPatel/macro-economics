import { useState } from 'react'
import { LineChart, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartArea, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  InfoBox,
  SliderControl,
  StatBox,
  ToolControlBar,
  ToolHeader,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { ChartLegend } from '../components/ChartLegend'
import { useHiddenSeries } from '../lib/chartSeries'
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

  // Apply scenario presets
  let activeS = savingsRate
  let activeN = populationGrowth
  const activeD = depreciationRate
  const activeAlpha = capitalShare
  const activeK0 = initialK

  if (scenarioMode === 'high-savings') {
    activeS = 0.35
  } else if (scenarioMode === 'low-growth') {
    activeN = 0.01
  }

  // Calculate steady state
  const kStar = Math.pow(activeS / (activeN + activeD), 1 / (1 - activeAlpha))
  const yStar = Math.pow(kStar, activeAlpha)
  const cStar = (1 - activeS) * yStar
  const investmentRateSS = activeS * yStar

  // Calculate time to 90% of steady state
  let timeToConvergence = 0
  let tempK = activeK0
  while (tempK < 0.9 * kStar && timeToConvergence < 1000) {
    tempK = activeS * Math.pow(tempK, activeAlpha) + (1 - activeD) * tempK
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

      // Update for next period
      const investment = activeS * y
      k = investment + (1 - activeD) * k
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
    // Base scenario (s=0.2, n=0.02, δ=0.05)
    const baseS = 0.2
    const baseN = 0.02
    const baseD = 0.05
    const alpha = 0.3

    const baseK = Math.pow(baseS / (baseN + baseD), 1 / (1 - alpha))
    const baseY = Math.pow(baseK, alpha)

    // High savings scenario (s=0.35)
    const highS = 0.35
    const highK = Math.pow(highS / (baseN + baseD), 1 / (1 - alpha))
    const highY = Math.pow(highK, alpha)

    // Low growth scenario (n=0.01)
    const lowN = 0.01
    const lowK = Math.pow(baseS / (lowN + baseD), 1 / (1 - alpha))
    const lowY = Math.pow(lowK, alpha)

    return [
      {
        name: 'Base (s=0.2)',
        k: parseFloat(baseK.toFixed(2)),
        y: parseFloat(baseY.toFixed(3)),
      },
      {
        name: 'High Savings (s=0.35)',
        k: parseFloat(highK.toFixed(2)),
        y: parseFloat(highY.toFixed(3)),
      },
      {
        name: 'Low Growth (n=0.01)',
        k: parseFloat(lowK.toFixed(2)),
        y: parseFloat(lowY.toFixed(3)),
      },
    ]
  }

  const solowDiagram = generateSolowDiagram()
  const timePath = generateTimePath()
  const scenarios = generateScenarioComparison()


  return (
    <div className="tool-card">
      <ToolHeader
        title="Solow Growth Model Simulator"
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
            onChange={setSavingsRate}
          />
          <SliderControl
            label="Population Growth (n)"
            value={activeN}
            min={0.01}
            max={0.05}
            step={0.005}
            onChange={setPopulationGrowth}
          />
          <SliderControl
            label="Depreciation Rate (δ)"
            value={activeD}
            min={0.01}
            max={0.1}
            step={0.01}
            onChange={setDepreciationRate}
          />
          <SliderControl
            label="Capital Share (α)"
            value={activeAlpha}
            min={0.2}
            max={0.4}
            step={0.05}
            onChange={setCapitalShare}
          />
          <SliderControl
            label="Initial Capital per Worker (k₀)"
            value={activeK0}
            min={0.5}
            max={3.0}
            step={0.1}
            onChange={setInitialK}
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
            onClick={() => setScenarioMode('high-savings')}
            variant={scenarioMode === 'high-savings' ? 'primary' : 'secondary'}
          >
            High Savings (s=0.35)
          </Button>
          <Button
            onClick={() => setScenarioMode('low-growth')}
            variant={scenarioMode === 'low-growth' ? 'primary' : 'secondary'}
          >
            Low Growth (n=0.01)
          </Button>
        </div>
      </div>

      {/* Key Results */}
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-3">
        <StatBox label="Steady State k*" value={kStar.toFixed(2)} tone="accent" />
        <StatBox label="Steady State y*" value={yStar.toFixed(3)} tone="accent" />
        <StatBox
          label="Steady State Growth Rate"
          value={(populationGrowth * 100).toFixed(2)}
          unit="%"
          tone="accent"
        />
        <StatBox label="Consumption per Worker (c*)" value={cStar.toFixed(3)} />
        <StatBox label="Investment Rate (ss)" value={investmentRateSS.toFixed(3)} />
        <StatBox label="Time to 90% Convergence" value={timeToConvergence} unit="years" />
      </div>

      {/* Educational Insight */}
      <div className="mb-s-8">
        <InfoBox type="success" title="Key Insight">
          <p>
            The steady-state growth rate equals the population growth rate (n ={' '}
            {(populationGrowth * 100).toFixed(2)}%). Notice that changing the savings rate shifts the
            level of steady-state capital and output but does NOT change the long-run growth rate!
            Only technological progress (not modeled here) can increase long-run per-capita growth.
          </p>
        </InfoBox>
      </div>

      {/* Solow Diagram */}
      <div className="visualization-container mb-s-8">
        <h3 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Solow Diagram: Capital per Worker Dynamics
        </h3>
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
        <p className="mt-s-2 text-xs text-fg-subtle tabular-nums">
          Steady state k* = {kStar.toFixed(2)} (marked where investment line crosses depreciation line)
        </p>
      </div>

      {/* Time Path */}
      <div className="visualization-container mb-s-8">
        <h3 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Capital Accumulation Over Time: Path to Steady State
        </h3>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          The economy converges to steady state. If below k*, investment exceeds depreciation, capital grows.
          If above k*, depreciation exceeds investment, capital shrinks. The convergence speed depends on distance from k*.
        </p>
        <ResponsiveContainer width="100%" height={350}>
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
        <p className="mt-s-2 text-xs text-fg-subtle tabular-nums">
          Starting from k₀ = {activeK0.toFixed(1)}, the economy reaches 90% of steady state in {timeToConvergence} years.
          Steady states: k* = {kStar.toFixed(2)}, y* = {yStar.toFixed(3)}
        </p>
      </div>

      {/* Scenario Comparison */}
      <div className="visualization-container mb-s-8">
        <h3 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Scenario Comparison: Effects on Steady State
        </h3>
        <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
          Compare different parameter combinations. Notice that higher savings raises k* and y* but growth rate stays at n.
          Lower population growth increases both k* and y*, AND increases long-run per-capita growth rate!
        </p>
        <div className="grid grid-cols-1 gap-s-3 lg:grid-cols-2">
          {scenarios.map((scenario) => (
            <div key={scenario.name} className="stat-tile stat-tile--neutral p-s-4 text-left">
              <div className="text-base font-semibold text-fg">{scenario.name}</div>
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
            Increasing savings rate causes temporary acceleration (transition to higher k*),
            but long-run per-capita growth remains at n. To permanently accelerate growth, need
            technological progress. This explains why Asian &quot;growth miracles&quot; eventually slowed
            as they caught up.
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
