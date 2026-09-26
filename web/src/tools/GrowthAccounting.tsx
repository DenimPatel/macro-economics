import { useState } from 'react'
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Cell } from 'recharts'
import { ChartBar, ChartPie } from '../components/ChartPrimitives'
import {
  ToolHeader,
  ToolNote,
  SliderControl,
  StatBox,
  Button,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

/** Series keep a fixed economic identity across every chart in this tool. */
const CAPITAL_FILL = chartColor(0)
const LABOR_FILL = chartColor(1)
const TFP_FILL = chartColor(2)
const TOTAL_GROWTH_FILL = chartColor(3)

/** Layout shared by the chart and readout blocks. */
const CONTROL_GRID = 'grid gap-6 sm:grid-cols-2'
const CHART_BOX = 'h-[300px]'
const SPLIT = 'grid gap-6 lg:grid-cols-2'
const STAT_GRID = 'mb-6 grid grid-cols-2 gap-3'

interface GrowthDataPoint {
  year: number
  growthRate: number
  capitalContribution: number
  laborContribution: number
  tfpContribution: number
  totalContribution: number
}

export default function GrowthAccounting() {
  const [country, setCountry] = useState<'us' | 'china' | 'japan'>('us')
  const [showDataOverlay, setShowDataOverlay] = useState(true)
  const [timePeriod, setTimePeriod] = useState(2000)

  // Historical growth data for different countries
  const growthData: Record<string, GrowthDataPoint[]> = {
    us: [
      { year: 1950, growthRate: 3.0, capitalContribution: 1.2, laborContribution: 1.5, tfpContribution: 0.3, totalContribution: 3.0 },
      { year: 1960, growthRate: 3.5, capitalContribution: 1.4, laborContribution: 1.6, tfpContribution: 0.5, totalContribution: 3.5 },
      { year: 1970, growthRate: 2.5, capitalContribution: 1.0, laborContribution: 1.2, tfpContribution: 0.3, totalContribution: 2.5 },
      { year: 1980, growthRate: 3.0, capitalContribution: 1.2, laborContribution: 1.4, tfpContribution: 0.4, totalContribution: 3.0 },
      { year: 1990, growthRate: 3.2, capitalContribution: 1.3, laborContribution: 1.5, tfpContribution: 0.4, totalContribution: 3.2 },
      { year: 2000, growthRate: 2.8, capitalContribution: 1.1, laborContribution: 1.3, tfpContribution: 0.4, totalContribution: 2.8 },
      { year: 2010, growthRate: 1.8, capitalContribution: 0.8, laborContribution: 1.0, tfpContribution: 0.0, totalContribution: 1.8 },
      { year: 2020, growthRate: 1.5, capitalContribution: 0.7, laborContribution: 0.9, tfpContribution: 0.0, totalContribution: 1.5 },
    ],
    china: [
      { year: 1950, growthRate: 2.0, capitalContribution: 1.0, laborContribution: 0.8, tfpContribution: 0.2, totalContribution: 2.0 },
      { year: 1960, growthRate: 2.5, capitalContribution: 1.2, laborContribution: 1.0, tfpContribution: 0.3, totalContribution: 2.5 },
      { year: 1970, growthRate: 3.0, capitalContribution: 1.5, laborContribution: 1.2, tfpContribution: 0.3, totalContribution: 3.0 },
      { year: 1980, growthRate: 6.0, capitalContribution: 3.0, laborContribution: 2.0, tfpContribution: 1.0, totalContribution: 6.0 },
      { year: 1990, growthRate: 8.0, capitalContribution: 4.0, laborContribution: 2.5, tfpContribution: 1.5, totalContribution: 8.0 },
      { year: 2000, growthRate: 8.5, capitalContribution: 4.5, laborContribution: 2.8, tfpContribution: 1.2, totalContribution: 8.5 },
      { year: 2010, growthRate: 9.0, capitalContribution: 5.0, laborContribution: 3.0, tfpContribution: 1.0, totalContribution: 9.0 },
      { year: 2020, growthRate: 5.5, capitalContribution: 3.0, laborContribution: 2.0, tfpContribution: 0.5, totalContribution: 5.5 },
    ],
    japan: [
      { year: 1950, growthRate: 3.5, capitalContribution: 1.5, laborContribution: 1.8, tfpContribution: 0.2, totalContribution: 3.5 },
      { year: 1960, growthRate: 4.0, capitalContribution: 1.8, laborContribution: 2.0, tfpContribution: 0.2, totalContribution: 4.0 },
      { year: 1970, growthRate: 3.0, capitalContribution: 1.2, laborContribution: 1.5, tfpContribution: 0.3, totalContribution: 3.0 },
      { year: 1980, growthRate: 2.5, capitalContribution: 1.0, laborContribution: 1.2, tfpContribution: 0.3, totalContribution: 2.5 },
      { year: 1990, growthRate: 1.0, capitalContribution: 0.5, laborContribution: 0.8, tfpContribution: 0.2, totalContribution: 1.0 },
      { year: 2000, growthRate: 0.5, capitalContribution: 0.3, laborContribution: 0.4, tfpContribution: 0.1, totalContribution: 0.5 },
      { year: 2010, growthRate: 0.2, capitalContribution: 0.1, laborContribution: 0.2, tfpContribution: 0.0, totalContribution: 0.2 },
      { year: 2020, growthRate: 0.1, capitalContribution: 0.0, laborContribution: 0.1, tfpContribution: 0.0, totalContribution: 0.1 },
    ],
  }

  const currentCountryData = growthData[country]
  const currentData = currentCountryData.find(d => d.year === 2000) || currentCountryData[0]

  // Calculate contribution shares for pie chart
  const pieData = [
    { name: 'Capital', value: currentData.capitalContribution },
    { name: 'Labor', value: currentData.laborContribution },
    { name: 'TFP', value: currentData.tfpContribution },
  ]

  const COLORS = [CAPITAL_FILL, LABOR_FILL, TFP_FILL]

  return (
    <div className="tool-card">
      <ToolHeader
        title="Growth Accounting Tool"
        description="Decompose country growth into capital, labor, and TFP contributions."
        badge="advanced"
      />

      <div className="control-panel">
        <div className={CONTROL_GRID}>
          <div>
            <label className="mb-2 block font-medium">
              Country
            </label>
            <div className="flex gap-2">
              <Button
                onClick={() => setCountry('us')}
                variant={country === 'us' ? 'primary' : 'secondary'}
              >
                United States
              </Button>
              <Button
                onClick={() => setCountry('china')}
                variant={country === 'china' ? 'primary' : 'secondary'}
              >
                China
              </Button>
              <Button
                onClick={() => setCountry('japan')}
                variant={country === 'japan' ? 'primary' : 'secondary'}
              >
                Japan
              </Button>
            </div>
          </div>

          <SliderControl
            label="Time Period"
            value={timePeriod}
            min={1950}
            max={2020}
            step={10}
            onChange={setTimePeriod}
            unit=""
          />
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

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">
          Growth Decomposition Over Time
        </h3>
        <div className={CHART_BOX}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentCountryData} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis dataKey="year" {...chartTheme.axis} />
              <YAxis {...chartTheme.axis} />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <Legend {...chartTheme.legend} />
              <ChartBar dataKey="capitalContribution" fill={CAPITAL_FILL} name="Capital Contribution" />
              <ChartBar dataKey="laborContribution" fill={LABOR_FILL} name="Labor Contribution" />
              <ChartBar dataKey="tfpContribution" fill={TFP_FILL} name="TFP Contribution" />
              <ChartBar dataKey="growthRate" fill={TOTAL_GROWTH_FILL} name="Total Growth" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">
          Contribution Shares (2000)
        </h3>
        <div className={SPLIT}>
          <div className={CHART_BOX}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={chartTheme.margin}>
                <ChartPie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill={CAPITAL_FILL}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </ChartPie>
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <Legend {...chartTheme.legend} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Capital Contribution" value={currentData.capitalContribution.toFixed(1)} unit="%" />
              <StatBox label="Labor Contribution" value={currentData.laborContribution.toFixed(1)} unit="%" />
              <StatBox label="TFP Contribution" value={currentData.tfpContribution.toFixed(1)} unit="%" />
              <StatBox label="Total Growth" value={currentData.growthRate.toFixed(1)} unit="%" />
            </div>

            <ToolNote label="Reference" variant="info" title="Growth Accounting Principles">
              <p>
                Growth accounting decomposes total economic growth into contributions from:
                <br />
                - Capital accumulation (investment)
                <br />
                - Labor force growth and productivity
                <br />
                - Total Factor Productivity (TFP) improvements
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ToolNote label="Info" variant="info" title="Growth Patterns by Country">
          <p>United States: Stable growth with TFP contributing more in recent decades</p>
          <p>China: Rapid growth driven by capital accumulation and labor force expansion</p>
          <p>Japan: Declining growth with TFP becoming increasingly important</p>
        </ToolNote>

        <ToolNote label="Watch out" variant="warning" title="The Role of TFP">
          <p>Total Factor Productivity (TFP) represents technological progress and efficiency improvements</p>
          <p>TFP growth is often the most important driver of long-term economic growth</p>
          <p>It's harder to measure and explain than capital or labor contributions</p>
        </ToolNote>

        <ToolNote label="Note" variant="lesson" title="Policy Implications">
          <p>Investment in R&D and innovation drives TFP growth</p>
          <p>Education and training improve labor productivity</p>
          <p>Infrastructure investments enhance capital efficiency</p>
        </ToolNote>
      </div>

      <ToolNote label="Reference" variant="info" title="Key Insights from Growth Accounting">
        <ul>
          <li>
            <strong>Capital vs. Labor:</strong> In developing economies, capital accumulation typically contributes more to growth than labor.
            In developed economies, TFP becomes the dominant factor.
          </li>
          <li>
            <strong>TFP Importance:</strong> TFP growth is often the most difficult to explain but is crucial for sustained long-term growth.
            It reflects technological progress, organizational improvements, and efficiency gains.
          </li>
          <li>
            <strong>Policy Focus:</strong> Countries aiming for sustained growth should focus on improving TFP through innovation, education, and institutional quality.
          </li>
          <li>
            <strong>Convergence:</strong> Developing countries can grow faster by adopting existing technologies (catch-up effect).
            Developed countries must rely more on innovation and productivity improvements.
          </li>
          <li>
            <strong>Measurement Challenges:</strong> Accurate growth accounting requires reliable data on capital stocks, labor input, and productivity.
            These measurements can be imperfect, affecting conclusions.
          </li>
        </ul>
      </ToolNote>
    </div>
  )
}
