import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart } from 'recharts'
import { ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  SliderControl,
  StatBox,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'

/** Series keep a fixed economic identity across every chart in this tool. */
const OUTPUT_STROKE = chartColor(0)
const UNEMPLOYMENT_STROKE = chartColor(2)
const INFLATION_STROKE = chartColor(1)
const POLICY_BAR_FILL = chartColor(3)

/** Layout shared by the chart and readout blocks. */
const CONTROL_GRID = 'grid gap-s-6 sm:grid-cols-2'
const CHART_BOX = 'h-[300px]'
const SPLIT = 'grid gap-s-6 lg:grid-cols-2'
const STAT_GRID = 'mb-s-6 grid grid-cols-2 gap-s-3'

interface CovidDataPoint {
  year: number
  output: number
  unemployment: number
  inflation: number
  supplyShock: boolean
  demandShock: boolean
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
  showDataOverlay: true,
  fiscalPolicy: 100,
  monetaryPolicy: 50,
}

export default function CrisisCovid() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  const [shockType, setShockType] = useState<'demand' | 'supply' | 'combined'>('combined')
const [showDataOverlay, setShowDataOverlay] = useState(DEFAULTS.showDataOverlay)
const [fiscalPolicy, setFiscalPolicy] = useState(DEFAULTS.fiscalPolicy)
const [monetaryPolicy, setMonetaryPolicy] = useState(DEFAULTS.monetaryPolicy)

  const { reset, dirty } = useToolReset(
    {
    showDataOverlay: showDataOverlay,
    fiscalPolicy: fiscalPolicy,
    monetaryPolicy: monetaryPolicy,
    },
    {
      setShowDataOverlay,
      setFiscalPolicy,
      setMonetaryPolicy,
    },
    {
      showDataOverlay: DEFAULTS.showDataOverlay,
      fiscalPolicy: DEFAULTS.fiscalPolicy,
      monetaryPolicy: DEFAULTS.monetaryPolicy,
    },
  )

  // Historical data for 2020-2023
  const covidData: CovidDataPoint[] = [
    { year: 2020, output: 100, unemployment: 4.0, inflation: 2.0, supplyShock: false, demandShock: true },
    { year: 2021, output: 105, unemployment: 5.0, inflation: 3.0, supplyShock: false, demandShock: false },
    { year: 2022, output: 102, unemployment: 4.5, inflation: 6.0, supplyShock: true, demandShock: false },
    { year: 2023, output: 104, unemployment: 4.2, inflation: 4.0, supplyShock: false, demandShock: false },
  ]

  // Simulate different policy responses
  const simulatePolicyResponse = () => {
    let outputChange = 0
    let unemploymentChange = 0
    let inflationChange = 0
    
    if (shockType === 'demand') {
      // Demand shock: lockdowns reduce consumption
      outputChange = -15
      unemploymentChange = 3
      inflationChange = -2
    } else if (shockType === 'supply') {
      // Supply shock: supply chain disruptions
      outputChange = -10
      unemploymentChange = 1
      inflationChange = 4
    } else {
      // Combined shock
      outputChange = -12
      unemploymentChange = 2
      inflationChange = 1
    }
    
    // Policy response effects
    const fiscalEffect = fiscalPolicy * 0.02
    const monetaryEffect = monetaryPolicy * 0.01
    
    return {
      output: Math.max(0, 100 + outputChange + fiscalEffect + monetaryEffect),
      unemployment: Math.max(0, 4.0 + unemploymentChange),
      inflation: Math.max(0, 2.0 + inflationChange),
    }
  }
  
  const policyResult = simulatePolicyResponse()

  return (
    <div className="tool-card">
      <ToolHeader
        title="COVID Shock 2020-2023"
        description="Supply vs. demand shocks. Compare fiscal and monetary policy responses."
        badge="case-study"
      />

      <div className="control-panel">
        <div className={CONTROL_GRID}>
          <SliderControl
            label="Policy Response: Fiscal Stimulus"
            value={fiscalPolicy}
            min={0}
            max={200}
            step={10}
            onChange={setFiscalPolicy}
            unit=""
          />
          <SliderControl
            label="Policy Response: Monetary Easing"
            value={monetaryPolicy}
            min={0}
            max={100}
            step={5}
            onChange={setMonetaryPolicy}
            unit=""
          />
          <div>
            <label className="mb-s-2 block font-medium">
              Shock Type
            </label>
            <div className="flex gap-s-2">
              <Button
                onClick={() => setShockType('demand')}
                variant={shockType === 'demand' ? 'primary' : 'secondary'}
              >
                Demand Shock
              </Button>
              <Button
                onClick={() => setShockType('supply')}
                variant={shockType === 'supply' ? 'primary' : 'secondary'}
              >
                Supply Shock
              </Button>
              <Button
                onClick={() => setShockType('combined')}
                variant={shockType === 'combined' ? 'primary' : 'secondary'}
              >
                Combined
              </Button>
            </div>
          </div>
        </div>

        <div className="button-group">
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
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Output, Unemployment, and Inflation Path
        </h2>
        <div className={CHART_BOX}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={covidData} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis
                key={chartTheme.axisKey('x')} dataKey="year" {...chartTheme.axis} />
              <YAxis
                key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <ChartLine
                type="monotone"
                dataKey="output"
                stroke={OUTPUT_STROKE}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Output (Y)"
              />
              <ChartLine
                type="monotone"
                dataKey="unemployment"
                stroke={UNEMPLOYMENT_STROKE}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Unemployment Rate"
              />
              <ChartLine
                type="monotone"
                dataKey="inflation"
                stroke={INFLATION_STROKE}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Inflation Rate"
              />
              {showDataOverlay && (
                <ChartLine
                  type="monotone"
                  dataKey="output"
                  stroke={OUTPUT_STROKE}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Actual Data"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Policy Response Comparison
        </h2>
        <div className={SPLIT}>
          <div className={CHART_BOX}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Output', value: policyResult.output },
                { name: 'Unemployment', value: policyResult.unemployment },
                { name: 'Inflation', value: policyResult.inflation },
              ]} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="name" {...chartTheme.axis} />
                <YAxis
                  key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <ChartBar dataKey="value" fill={POLICY_BAR_FILL} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Output" value={policyResult.output.toFixed(1)} />
              <StatBox label="Unemployment" value={policyResult.unemployment.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={policyResult.inflation.toFixed(1)} unit="%" />
            </div>

            <ToolNote label="Reference" variant="info" title="Policy Response Effects">
              <p>
                {shockType === 'demand' &&
                  "Demand shock (lockdowns) reduced output by 15% and increased unemployment by 3 points. Fiscal and monetary policy helped offset these effects."}
                {shockType === 'supply' &&
                  "Supply shock (supply chain disruptions) reduced output by 10% and increased inflation by 4 points. Monetary policy alone couldn't address this."}
                {shockType === 'combined' &&
                  "Combined shock reduced output by 12% and increased unemployment by 2 points. Both fiscal and monetary policy were needed to stabilize the economy."}
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mt-s-8 grid gap-s-6 sm:grid-cols-2 lg:grid-cols-3">
        <ToolNote label="Info" variant="info" title="The 2020-2023 Shock">
          <p>2020: Global pandemic caused massive demand shock with lockdowns and reduced consumption</p>
          <p>2021: Recovery began with fiscal stimulus and monetary easing</p>
          <p>2022: Supply chain disruptions created stagflationary pressure</p>
          <p>2023: Gradual normalization with continued policy support</p>
        </ToolNote>

        <ToolNote label="Watch out" variant="warning" title="Dual Nature of the Shock">
          <p>The pandemic created both demand and supply shocks simultaneously.</p>
          <p>Demand shock from lockdowns reduced consumption and investment.</p>
          <p>Supply shock from disrupted supply chains increased costs and reduced production.</p>
        </ToolNote>

        <ToolNote label="Note" variant="lesson" title="Policy Response">
          <p>Massive fiscal stimulus (trillions in government spending)</p>
          <p>Unprecedented monetary easing (near-zero rates, QE programs)</p>
          <p>Central banks coordinated internationally to prevent systemic collapse</p>
        </ToolNote>
      </div>

      <ToolNote label="Reference" variant="info" title="Key Lessons from the Pandemic">
        <ul>
          <li>
            <strong>Unprecedented Policy Response:</strong> The scale of fiscal and monetary policy response was unprecedented in peacetime.
          </li>
          <li>
            <strong>Supply Chain Vulnerabilities:</strong> The crisis exposed fragility in global supply chains, prompting discussions about reshoring and diversification.
          </li>
          <li>
            <strong>Policy Coordination:</strong> Effective coordination between fiscal and monetary policy was crucial for stabilizing the economy.
          </li>
          <li>
            <strong>Unequal Impact:</strong> The pandemic disproportionately affected certain sectors and demographics, highlighting inequality concerns.
          </li>
          <li>
            <strong>Technology Acceleration:</strong> The crisis accelerated digital transformation and remote work adoption.
          </li>
        </ul>
      </ToolNote>
    </div>
  )
}
