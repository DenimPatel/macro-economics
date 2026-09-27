import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart } from 'recharts'
import { ChartArea, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
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

interface DynamicDataPoint {
  quarter: number
  output: number
  interestRate: number
  inflation: number
  unemployment: number
  isShock: boolean
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
  shockSize: 100,
  showDataOverlay: true,
}

export default function IsLmPcDynamics() {
  const phoenix = useHiddenSeries(['output', 'rate', 'inflation'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [shockSize, setShockSize] = useState(DEFAULTS.shockSize)
const [showDataOverlay, setShowDataOverlay] = useState(DEFAULTS.showDataOverlay)

  const { reset, dirty } = useToolReset(
    {
    shockSize: shockSize,
    showDataOverlay: showDataOverlay,
    },
    {
      setShockSize,
      setShowDataOverlay,
    },
    {
      shockSize: DEFAULTS.shockSize,
      showDataOverlay: DEFAULTS.showDataOverlay,
    },
  )
  const [fedReaction, setFedReaction] = useState<'passive' | 'aggressive'>('aggressive')

  // Simulated dynamic adjustment path
  const dynamicData: DynamicDataPoint[] = [
    { quarter: 1, output: 100, interestRate: 5, inflation: 2, unemployment: 4.5, isShock: true },
    { quarter: 2, output: 105, interestRate: 6, inflation: 2.5, unemployment: 4.2, isShock: true },
    { quarter: 3, output: 108, interestRate: 7, inflation: 3.0, unemployment: 4.0, isShock: true },
    { quarter: 4, output: 110, interestRate: 8, inflation: 3.5, unemployment: 3.8, isShock: true },
    { quarter: 5, output: 112, interestRate: 9, inflation: 4.0, unemployment: 3.6, isShock: true },
    { quarter: 6, output: 114, interestRate: 10, inflation: 4.5, unemployment: 3.4, isShock: true },
    { quarter: 7, output: 115, interestRate: 11, inflation: 5.0, unemployment: 3.2, isShock: true },
    { quarter: 8, output: 116, interestRate: 12, inflation: 5.5, unemployment: 3.0, isShock: true },
    { quarter: 9, output: 117, interestRate: 11, inflation: 5.2, unemployment: 3.1, isShock: false },
    { quarter: 10, output: 118, interestRate: 10, inflation: 4.8, unemployment: 3.2, isShock: false },
    { quarter: 11, output: 119, interestRate: 9, inflation: 4.5, unemployment: 3.3, isShock: false },
    { quarter: 12, output: 120, interestRate: 8, inflation: 4.2, unemployment: 3.4, isShock: false },
    { quarter: 13, output: 121, interestRate: 7, inflation: 4.0, unemployment: 3.5, isShock: false },
    { quarter: 14, output: 122, interestRate: 6, inflation: 3.8, unemployment: 3.6, isShock: false },
    { quarter: 15, output: 123, interestRate: 5, inflation: 3.5, unemployment: 3.7, isShock: false },
    { quarter: 16, output: 124, interestRate: 4, inflation: 3.2, unemployment: 3.8, isShock: false },
  ]

  // Simulate Fed reaction
  const simulateFedReaction = () => {
    const baseOutput = 100
    const baseInterestRate = 5
    const baseInflation = 2
    const baseUnemployment = 4.5
    
    // Shock effect
    const shockEffect = shockSize * 0.01
    
    // Fed reaction
    const fedEffect = fedReaction === 'aggressive' ? -1.5 : -0.5
    
    return {
      output: baseOutput + shockEffect,
      interestRate: baseInterestRate + (shockEffect * 0.5) + fedEffect,
      inflation: baseInflation + (shockEffect * 0.3),
      unemployment: baseUnemployment - (shockEffect * 0.1),
    }
  }
  
  const fedResult = simulateFedReaction()

  return (
    <div className="tool-card">
      <ToolHeader
        title="IS-LM-PC Dynamic Adjustment"
        description="Watch economy move from short-run to medium-run equilibrium after demand shocks."
        badge="intermediate"
      />

      <div className="control-panel">
        <div className="grid grid-cols-1 gap-s-6 lg:grid-cols-2">
          <SliderControl
            label="Demand Shock Size"
            value={shockSize}
            min={50}
            max={200}
            step={10}
            onChange={setShockSize}
          />
          <div>
            <span className="control-label mb-s-2 block">Fed Reaction</span>
            <div className="flex gap-s-2">
              <Button
                onClick={() => setFedReaction('passive')}
                variant={fedReaction === 'passive' ? 'primary' : 'secondary'}
              >
                Passive
              </Button>
              <Button
                onClick={() => setFedReaction('aggressive')}
                variant={fedReaction === 'aggressive' ? 'primary' : 'secondary'}
              >
                Aggressive
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-s-4 flex gap-s-2">
          <Button
            onClick={() => setShowDataOverlay(!showDataOverlay)}
            variant={showDataOverlay ? 'primary' : 'secondary'}
          >
            {showDataOverlay ? 'Hide Data' : 'Show Data'}
          </Button>
        </div>
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Dynamic Adjustment Path</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicData} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis
                key={chartTheme.axisKey('x')} dataKey="quarter" {...chartTheme.axis} includeHidden />
              <YAxis
                key={chartTheme.axisKey('y')} {...chartTheme.yAxis} includeHidden />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <ChartArea
                type="monotone"
                dataKey="output"
                stroke={chartColor(0)}
                fill={chartColor(0)}
                fillOpacity={0.15}
                name="Output (Y)"
              />
              <ChartArea
                type="monotone"
                dataKey="interestRate"
                stroke={chartColor(2)}
                fill={chartColor(2)}
                fillOpacity={0.15}
                name="Interest Rate (r)"
              />
              <ChartArea
                type="monotone"
                dataKey="inflation"
                stroke={chartColor(1)}
                fill={chartColor(1)}
                fillOpacity={0.15}
                name="Inflation (π)"
              />
              <ChartArea
                type="monotone"
                dataKey="unemployment"
                stroke={chartColor(3)}
                fill={chartColor(3)}
                fillOpacity={0.15}
                name="Unemployment (u)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Quarter-by-Quarter Dynamics</h2>
        <div className="grid gap-s-6 lg:grid-cols-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="quarter" {...chartTheme.axis} includeHidden />
                <YAxis
                  key={chartTheme.axisKey('y')} {...chartTheme.yAxis} includeHidden />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <ChartLine
                  type="monotone"
                  dataKey="output"
                  hide={phoenix.isHidden('output')}
                  stroke={chartColor(0)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Output"
                />
                <ChartLine
                  type="monotone"
                  dataKey="interestRate"
                  hide={phoenix.isHidden('rate')}
                  stroke={chartColor(2)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Interest Rate"
                />
                <ChartLine
                  type="monotone"
                  dataKey="inflation"
                  hide={phoenix.isHidden('inflation')}
                  stroke={chartColor(1)}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Inflation"
                />
              </LineChart>
            </ResponsiveContainer>
            <ChartLegend
              items={[
                { key: 'output', label: 'Output', color: chartColor(0) },
                { key: 'inflation', label: 'Inflation', color: chartColor(1) },
                { key: 'rate', label: 'Interest Rate', color: chartColor(2) },
              ]}
              hidden={phoenix.hidden}
              onToggle={phoenix.toggle}
              onShowAll={phoenix.showAll}
            />
          </div>

          <div>
            <div className="mb-s-6 grid grid-cols-2 gap-s-3">
              <StatBox label="Output" value={fedResult.output.toFixed(1)} tone="accent" />
              <StatBox label="Interest Rate" value={fedResult.interestRate.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={fedResult.inflation.toFixed(1)} unit="%" />
              <StatBox label="Unemployment" value={fedResult.unemployment.toFixed(1)} unit="%" />
            </div>

            <ToolNote label="Current setting" variant="info" title="Dynamic Adjustment Process">
              <p>
                {fedReaction === 'aggressive'
                  ? "Aggressive Fed reaction (tightening) reduces inflation but also slows output growth. The economy converges to a new equilibrium with lower inflation and slightly lower output."
                  : "Passive Fed reaction allows inflation to rise more but keeps output growth higher. The economy converges to a higher inflation equilibrium."}
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mt-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-3">
        <InfoBox type="info" title="The Adjustment Process">
          <p>Quarter 1-4: Initial demand shock causes output to rise, interest rates to increase, and inflation to rise</p>
          <p>Quarter 5-8: As inflation rises, Fed responds with tighter monetary policy</p>
          <p>Quarter 9+: Economy converges to new equilibrium with lower output growth and stable inflation</p>
        </InfoBox>

        <InfoBox type="warning" title="Phillips Curve Dynamics">
          <p>As inflation rises, the Phillips Curve shifts upward</p>
          <p>This creates a trade-off between output and inflation in the short-run</p>
          <p>Eventually, the economy reaches a new medium-run equilibrium</p>
        </InfoBox>

        <InfoBox type="success" title="Policy Implications">
          <p>Central banks must balance short-run stabilization with long-run price stability</p>
          <p>Aggressive policy can reduce inflation but may slow growth</p>
          <p>Passive policy allows faster growth but risks higher inflation</p>
        </InfoBox>
      </div>

      <ToolNote
        label="Key insights"
        variant="insight"
        title="Insights from Dynamic Adjustment"
      >
        <ul>
          <li>
            <strong>Short-Run vs Long-Run:</strong> In the short-run, there's a trade-off between output and inflation.
            In the long-run, the economy returns to its natural rate of unemployment regardless of inflation.
          </li>
          <li>
            <strong>Policy Effectiveness:</strong> The effectiveness of monetary policy depends on the Fed's reaction function.
            Aggressive tightening can reduce inflation but may slow growth.
          </li>
          <li>
            <strong>Expectations:</strong> If people expect higher inflation, the Phillips Curve shifts upward.
            This makes it harder for policymakers to achieve low inflation without sacrificing output.
          </li>
          <li>
            <strong>Time Horizon:</strong> The adjustment process takes several quarters to complete.
            This is why policy decisions must account for lags in economic effects.
          </li>
          <li>
            <strong>Stability:</strong> The dynamic adjustment shows how the economy naturally moves toward equilibrium.
            This provides a framework for understanding economic fluctuations and policy responses.
          </li>
        </ul>
      </ToolNote>
    </div>
  )
}
