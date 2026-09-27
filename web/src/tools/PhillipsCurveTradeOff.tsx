import { useState } from 'react'
import { ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ChartLine, ChartScatter } from '../components/ChartPrimitives'
import {
  InfoBox,
  SliderControl,
  StatBox,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'
import { useHiddenSeries } from '../lib/chartSeries'
import { ChartLegend } from '../components/ChartLegend'

/**
 * PhillipsCurveTradeOff Component
 *
 * Visualizes the Phillips Curve relationship between inflation and unemployment,
 * including:
 * - The expectations-augmented Phillips Curve
 * - Supply shocks (shifts in the curve)
 * - Demand shocks (movements along the curve)
 * - Expected vs. actual inflation
 * - Natural rate of unemployment
 */

interface PhillipsCurvePoint {
  unemployment: number
  inflation: number
  type: 'equilibrium' | 'history' | 'original'
}

interface ChartData {
  unemployment: number
  inflation: number
  curve: string
  originalCurve?: number
}

/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 */
const DEFAULTS = {
  expectedInflation: 2.0,
  naturalUnemployment: 4.5,
  showAnnotations: true,
}

export default function PhillipsCurveTradeOff() {
  const tradeoff = useHiddenSeries(['original', 'current', 'historical', 'equilibrium'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  // Control parameters
const [expectedInflation, setExpectedInflation] = useState(DEFAULTS.expectedInflation)
  const [supplyShock, setSupplyShock] = useState(0) // Percentage point shift
const [naturalUnemployment, setNaturalUnemployment] = useState(DEFAULTS.naturalUnemployment)
  const [demandShock, setDemandShock] = useState(0) // Shifts IS curve, affects unemployment
  const [phillipsSensitivity, setPhillipsSensitivity] = useState(0.5) // α coefficient
  const [historicalMode, setHistoricalMode] = useState<'modern' | 'pre1970' | 'stagflation'>('modern')
const [showAnnotations, setShowAnnotations] = useState(DEFAULTS.showAnnotations)

  const { reset, dirty } = useToolReset(
    {
    expectedInflation: expectedInflation,
    naturalUnemployment: naturalUnemployment,
    showAnnotations: showAnnotations,
    },
    {
      setExpectedInflation,
      setNaturalUnemployment,
      setShowAnnotations,
    },
    {
      expectedInflation: DEFAULTS.expectedInflation,
      naturalUnemployment: DEFAULTS.naturalUnemployment,
      showAnnotations: DEFAULTS.showAnnotations,
    },
  )

  // Supply shock parameters (oil shocks, cost-push factors)
  // Higher supply shocks shift Phillips Curve up
  const markupShock = supplyShock

  /**
   * Generate Phillips Curve data
   * Base equation: π = π^e + (m + z) - α(u - u*)
   * Where:
   * - π: inflation rate
   * - π^e: expected inflation
   * - m + z: supply shocks (markups, labor institutions)
   * - α: Phillips sensitivity coefficient
   * - u: unemployment rate
   * - u*: natural rate of unemployment
   */
  const generatePhillipsCurve = (): ChartData[] => {
    const data: ChartData[] = []
    const minUnemployment = Math.max(1, naturalUnemployment - 4)
    const maxUnemployment = naturalUnemployment + 4

    for (let u = minUnemployment; u <= maxUnemployment; u += 0.2) {
      // Original curve (no supply shocks)
      const originalInflation =
        expectedInflation - phillipsSensitivity * (u - naturalUnemployment)

      // Current curve (with supply shocks)
      const currentInflation =
        expectedInflation + markupShock - phillipsSensitivity * (u - naturalUnemployment)

      data.push({
        unemployment: parseFloat(u.toFixed(1)),
        inflation: parseFloat(currentInflation.toFixed(2)),
        originalCurve: parseFloat(originalInflation.toFixed(2)),
        curve: 'Phillips Curve',
      })
    }

    return data
  }

  /**
   * Calculate current equilibrium point
   * Demand shocks move the economy along the Phillips Curve
   * Positive demand shock → lower unemployment
   */
  const calculateEquilibrium = () => {
    // Demand shocks affect unemployment
    // Positive demand shock reduces unemployment, moves up the curve
    const equilibriumUnemployment = naturalUnemployment - demandShock * 0.5

    // Calculate inflation at this unemployment level
    const equilibriumInflation =
      expectedInflation +
      markupShock -
      phillipsSensitivity * (equilibriumUnemployment - naturalUnemployment)

    return {
      unemployment: Math.max(0, equilibriumUnemployment),
      inflation: equilibriumInflation,
    }
  }

  /**
   * Generate historical data points based on mode
   * Shows how Phillips Curve relationship has evolved
   */
  const generateHistoricalData = (): PhillipsCurvePoint[] => {
    const points: PhillipsCurvePoint[] = []

    if (historicalMode === 'pre1970') {
      // Pre-1970s: Stable, downward-sloping Phillips Curve
      // Low, anchored inflation expectations
      points.push(
        { unemployment: 3.5, inflation: 3.5, type: 'history' },
        { unemployment: 4.0, inflation: 2.8, type: 'history' },
        { unemployment: 4.5, inflation: 2.2, type: 'history' },
        { unemployment: 5.0, inflation: 1.5, type: 'history' },
        { unemployment: 6.0, inflation: 0.5, type: 'history' }
      )
    } else if (historicalMode === 'stagflation') {
      // 1970s-80s: Stagflation period
      // Oil shocks + de-anchored expectations
      // Phillips Curve shifted up and scattered
      points.push(
        { unemployment: 4.0, inflation: 8.5, type: 'history' },
        { unemployment: 5.0, inflation: 9.2, type: 'history' },
        { unemployment: 6.0, inflation: 11.0, type: 'history' },
        { unemployment: 7.0, inflation: 9.5, type: 'history' },
        { unemployment: 8.5, inflation: 10.2, type: 'history' },
        { unemployment: 9.0, inflation: 6.5, type: 'history' }
      )
    }

    return points
  }

  const phillipsCurveData = generatePhillipsCurve()
  const equilibrium = calculateEquilibrium()
  const historicalData = generateHistoricalData()

  /**
   * Calculate inflation costs of reducing unemployment (policy trade-off)
   */
  const calculatePolicyTradeOff = () => {
    const targetUnemployment = Math.max(0, naturalUnemployment - 1)
    const currentEquilibrium = calculateEquilibrium()

    const inflationCost =
      expectedInflation +
      markupShock -
      phillipsSensitivity * (targetUnemployment - naturalUnemployment) -
      currentEquilibrium.inflation

    return {
      unemploymentReduction: currentEquilibrium.unemployment - targetUnemployment,
      inflationIncrease: inflationCost,
      ratio: Math.abs(inflationCost / Math.max(0.1, targetUnemployment - currentEquilibrium.unemployment)),
    }
  }

  const tradeOff = calculatePolicyTradeOff()

  /**
   * Explain movement along vs. shift of curve
   */
  const getMovementExplanation = () => {
    if (demandShock !== 0) {
      return demandShock > 0
        ? 'Expansionary policy reduces unemployment → Movement UP the Phillips Curve'
        : 'Contractionary policy increases unemployment → Movement DOWN the Phillips Curve'
    }
    if (supplyShock !== 0) {
      return supplyShock > 0
        ? 'Negative supply shock (e.g., oil price shock) → Phillips Curve SHIFTS UP'
        : 'Positive supply shock → Phillips Curve SHIFTS DOWN'
    }
    if (expectedInflation !== 2.0) {
      return 'Changes in inflation expectations → Phillips Curve SHIFTS'
    }
    return 'Adjust controls to see how the Phillips Curve responds'
  }

  return (
    <div className="tool-container">
      <ToolHeader
        title="Phillips Curve Trade-Off"
        description="Explore the relationship between inflation and unemployment, supply shocks, expectations, and policy trade-offs"
        badge="intermediate"
      />

      <ToolControlBar onReset={reset} dirty={dirty} />

      <div className="mb-s-8 grid gap-s-8 lg:grid-cols-2">
        {/* Control Panel */}
        <div className="control-panel block">
          <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Controls</h2>

          <SliderControl
            label="Expected Inflation Rate"
            value={expectedInflation}
            min={0}
            max={6}
            step={0.1}
            onChange={setExpectedInflation}
            unit="%"
          />

          <SliderControl
            label="Supply Shock"
            value={supplyShock}
            min={-3}
            max={3}
            step={0.1}
            onChange={setSupplyShock}
            unit="pp"
          />

          <SliderControl
            label="Natural Rate of Unemployment"
            value={naturalUnemployment}
            min={2}
            max={7}
            step={0.1}
            onChange={setNaturalUnemployment}
            unit="%"
          />

          <SliderControl
            label="Demand Shock"
            value={demandShock}
            min={-2}
            max={2}
            step={0.1}
            onChange={setDemandShock}
          />

          <SliderControl
            label="Phillips Sensitivity (α)"
            value={phillipsSensitivity}
            min={0.2}
            max={1.5}
            step={0.1}
            onChange={setPhillipsSensitivity}
          />

          <div className="mt-s-6">
            <span className="control-label mb-s-2 block">Historical Period</span>
            <div className="flex flex-wrap gap-s-2">
              {(['modern', 'pre1970', 'stagflation'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setHistoricalMode(mode)}
                  aria-pressed={historicalMode === mode}
                  className={`rounded-pill px-s-4 py-s-2 text-sm font-medium transition-colors ${
                    historicalMode === mode
                      ? 'bg-accent text-accent-fg'
                      : 'bg-surface text-fg-muted hover:border-accent'
                  }`}
                >
                  {mode === 'modern' && 'Modern'}
                  {mode === 'pre1970' && 'Pre-1970s'}
                  {mode === 'stagflation' && 'Stagflation'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-s-4 flex items-center gap-s-2">
            <input
              type="checkbox"
              id="annotations"
              checked={showAnnotations}
              onChange={(e) => setShowAnnotations(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-accent"
            />
            <label htmlFor="annotations" className="cursor-pointer text-sm text-fg-muted">
              Show Annotations
            </label>
          </div>
        </div>

        {/* Key Statistics */}
        <div className="flex flex-col gap-s-3">
          <StatBox
            label="Current Unemployment"
            value={`${equilibrium.unemployment.toFixed(2)}%`}
            change={
              demandShock > 0
                ? `↓ ${(naturalUnemployment - equilibrium.unemployment).toFixed(2)}pp below natural rate`
                : demandShock < 0
                  ? `↑ ${(equilibrium.unemployment - naturalUnemployment).toFixed(2)}pp above natural rate`
                  : `= Natural rate of ${naturalUnemployment.toFixed(2)}%`
            }
            tone="accent"
          />

          <StatBox
            label="Current Inflation"
            value={`${equilibrium.inflation.toFixed(2)}%`}
            change={
              equilibrium.inflation > expectedInflation
                ? `↑ ${(equilibrium.inflation - expectedInflation).toFixed(2)}pp above expectations`
                : `↓ ${(expectedInflation - equilibrium.inflation).toFixed(2)}pp below expectations`
            }
          />

          <StatBox
            label="Natural Rate of Unemployment"
            value={`${naturalUnemployment.toFixed(2)}%`}
            change="NAIRU: Non-accelerating inflation rate of unemployment"
          />

          <StatBox
            label="Policy Trade-Off"
            value={
              tradeOff.unemploymentReduction > 0
                ? `${tradeOff.unemploymentReduction.toFixed(2)}% unemployment reduction`
                : 'Not applicable'
            }
            change={
              tradeOff.unemploymentReduction > 0
                ? `Costs ${tradeOff.inflationIncrease.toFixed(2)}pp inflation increase`
                : 'Use demand shock slider'
            }
            tone={tradeOff.unemploymentReduction > 0 ? 'caution' : 'neutral'}
          />
        </div>
      </div>

      {/* Main Chart */}
      <div className="visualization-container mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Phillips Curve {historicalMode === 'modern' ? '(Modern)' : ''}
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            data={phillipsCurveData}
          >
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="unemployment"
              name="Unemployment Rate (%)"
              label={{
                value: 'Unemployment Rate (%)',
                position: 'insideBottom',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[Math.max(1, naturalUnemployment - 4), naturalUnemployment + 4]}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              dataKey="inflation"
              name="Inflation Rate (%)"
              label={{
                value: 'Inflation Rate (%)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[-2, 12]}
              {...chartTheme.yAxis}
              includeHidden
            />
            {/* Zero inflation, for the same reason as the Phillips curve
             * chart, and more sharply here: this tool's scenarios include
             * explicit DEFLATION shocks, so the reader is being asked to read
             * a sign off this axis. */}
            <ReferenceLine y={0} {...chartTheme.baseline} />

            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) =>
                typeof value === 'number' ? value.toFixed(2) : String(value)
              }
            />


            {/* Original Phillips Curve (without supply shocks) */}
            {supplyShock !== 0 && (
              <ChartLine
                type="monotone"
                dataKey="originalCurve"
                hide={tradeoff.isHidden('original')}
                stroke={chartTheme.axis.stroke}
                strokeDasharray="5 5"
                name="Original Curve (no shock)"
              />
            )}

            {/* Current Phillips Curve */}
            <ChartLine
              type="monotone"
              dataKey="inflation"
              hide={tradeoff.isHidden('current')}
              stroke={chartColor(0)}
              strokeWidth={2}
              name="Phillips Curve"
              dot={false}
            />

            {/* Historical data points */}
            {historicalData.length > 0 && (
              <ChartScatter
                hide={tradeoff.isHidden('historical')}
                name={`Historical Data (${historicalMode})`}
                data={historicalData.map((p) => ({
                  unemployment: p.unemployment,
                  inflation: p.inflation,
                }))}
                fill={chartColor(2)}
                fillOpacity={0.6}
              />
            )}

            {/* Current equilibrium point */}
            <ChartScatter
              hide={tradeoff.isHidden('equilibrium')}
              name="Current Equilibrium"
              data={[{ unemployment: equilibrium.unemployment, inflation: equilibrium.inflation }]}
              fill={chartColor(4)}
              shape="circle"
            />

            {/* Natural rate of unemployment line */}
            <ReferenceLine
              x={naturalUnemployment}
              stroke={chartTheme.reference.stroke}
              strokeDasharray="3 3"
              label={{
                value: `NAIRU (${naturalUnemployment.toFixed(1)}%)`,
                position: 'top',
                fill: chartTheme.reference.fill,
              }}
            />

            {/* Expected inflation line */}
            <ReferenceLine
              y={expectedInflation}
              stroke={chartTheme.reference.stroke}
              strokeDasharray="3 3"
              label={{
                value: `Expected Inflation (${expectedInflation.toFixed(1)}%)`,
                position: 'right',
                fill: chartTheme.reference.fill,
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'original', label: 'Original Curve (no shock)', color: chartTheme.axis.stroke },
            { key: 'current', label: 'Phillips Curve', color: chartColor(0) },
            { key: 'historical', label: `Historical Data (${historicalMode})`, color: chartColor(2) },
            { key: 'equilibrium', label: 'Current Equilibrium', color: chartColor(4) },
          ]}
          hidden={tradeoff.hidden}
          onToggle={tradeoff.toggle}
          onShowAll={tradeoff.showAll}
        />

        {showAnnotations && (
          <ToolNote label="Annotation" variant="info" title="Current Movement">
            <p>{getMovementExplanation()}</p>
          </ToolNote>
        )}
      </div>

      {/* Explanation Sections */}
      <div className="mb-s-8 grid gap-s-4 lg:grid-cols-2">
        <InfoBox
          title="Phillips Curve Equation"
          content={`
The Expectations-Augmented Phillips Curve:

π = π^e + (m + z) - α(u - u*)

Where:
• π = Inflation rate
• π^e = Expected inflation
• m + z = Supply shocks (oil prices, labor institutions)
• α = Sensitivity coefficient
• u = Unemployment rate
• u* = Natural rate of unemployment (NAIRU)

Key Insight: Lower unemployment → Higher inflation, but only temporarily if expectations adjust.
          `}
        />

        <InfoBox
          title="Movements vs. Shifts"
          content={`
Two Types of Changes:

MOVEMENT ALONG THE CURVE:
• Caused by demand shocks
• Temporary trade-off: Lower unemployment
• Inflation rises as you move up
• Example: Expansionary monetary policy

SHIFT OF THE CURVE:
• Caused by supply shocks or expectation changes
• Permanent or long-lasting change
• Example: Oil price shocks shift curve upward
• De-anchored expectations shift curve up
• Better supply conditions shift curve down
          `}
        />
      </div>

      {/* Historical Context */}
      <InfoBox
        title="Historical Evolution of the Phillips Curve"
        content={`
PRE-1970s: STABLE TRADE-OFF
• Inflation expectations were anchored (~2%)
• Clear negative relationship between inflation and unemployment
• Policymakers thought they could "choose" a point on the curve
• Example: Accept 4% inflation for 3% unemployment

1970s-1980s: THE BREAKDOWN (STAGFLATION)
• Oil shocks (1973, 1979) shifted the curve up
• Inflation expectations de-anchored
• Inflation persisted even as unemployment rose
• New equation: Δπ = -(αu) (change in inflation, not level)

1990s-2019: RE-ANCHORING
• Fed credibility restored low inflation expectations
• Phillips Curve stabilized again
• Relationship weakened but not eliminated
• Forward guidance helped anchor expectations

2020s: FLATNESS PUZZLE
• Phillips Curve appears flatter than pre-2008
• May reflect: globalization, flexible pricing, changing worker bargaining power
• But 2021-2023 inflation surge re-emphasized its importance
        `}
      />

      {/* Policy Implications */}
      <ToolNote label="Policy" variant="warning" title="Policy Implications">
        <ul>
          <li>
            <strong>Expectations Matter:</strong> Anchoring inflation expectations prevents the
            Phillips Curve from shifting up, allowing better policy trade-offs.
          </li>
          <li>
            <strong>Supply Shocks Are Costly:</strong> They shift the curve up, making unemployment
            reduction even more inflationary. Example: 1970s stagflation.
          </li>
          <li>
            <strong>No Free Lunch:</strong> Permanently reducing unemployment below the natural rate
            requires accelerating inflation.
          </li>
          <li>
            <strong>Credibility:</strong> A central bank that promises low inflation can shift
            expectations and improve the trade-off.
          </li>
          <li>
            <strong>Supply-Side Policies:</strong> Reduce the natural unemployment rate through
            education, labor market policies, etc.
          </li>
        </ul>
      </ToolNote>
    </div>
  )
}
