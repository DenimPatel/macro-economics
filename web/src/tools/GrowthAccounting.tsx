import { useState } from 'react'
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Cell } from 'recharts'
import { ChartBar, ChartPie } from '../components/ChartPrimitives'
import {
  Button,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'
import { useHiddenSeries } from '../lib/chartSeries'
import { ChartLegend } from '../components/ChartLegend'

/** Series keep a fixed economic identity across every chart in this tool. */
const CAPITAL_FILL = chartColor(0)
const LABOR_FILL = chartColor(1)
const TFP_FILL = chartColor(2)
const TOTAL_GROWTH_FILL = chartColor(3)

/** Layout shared by the chart and readout blocks. */
const CONTROL_GRID = 'grid gap-s-6 sm:grid-cols-2'
const SPLIT = 'grid gap-s-6 lg:grid-cols-2'
const STAT_GRID = 'mb-s-6 grid grid-cols-2 gap-s-3'

interface GrowthDataPoint {
  year: number
  growthRate: number
  capitalContribution: number
  laborContribution: number
  tfpContribution: number
  totalContribution: number
}

/**
 * The country whose growth record the reader is looking at. Annotated rather
 * than narrowed, because a literal `'us'` in the record would make
 * `useState(DEFAULTS.country)` infer the single value `'us'` and the two other
 * country buttons would not assign to it.
 */
type Country = 'us' | 'china' | 'japan'

/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 *
 * `country` is in here because it is a control and was not in the record:
 * `useState<'us' | 'china' | 'japan'>('us')` held it outside every copy of the
 * defaults, so a reader who switched to China, moved the time period, pressed
 * Reset, and got the time period back with China still selected and a caption
 * about the time period over a chart of the wrong country. A reset that undoes
 * one of the two things the reader did is a reset that misreports what it does.
 */
const DEFAULTS = {
  country: 'us' as Country,
  timePeriod: 2000,
}

export default function GrowthAccounting() {
  const decomp = useHiddenSeries(['capital', 'labor', 'tfp', 'total'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  const [country, setCountry] = useState<Country>(DEFAULTS.country)
  const [timePeriod, setTimePeriod] = useState(DEFAULTS.timePeriod)

  const { reset, dirty } = useToolReset(
    {
      country,
      timePeriod,
    },
    {
      setCountry,
      setTimePeriod,
    },
    DEFAULTS,
  )

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
            <label className="mb-s-2 block font-medium">
              Country
            </label>
            <div className="flex gap-s-2">
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

      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Growth Decomposition Over Time
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={currentCountryData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')} dataKey="year" {...chartTheme.axis} includeHidden />
            <YAxis
              key={chartTheme.axisKey('y')} {...chartTheme.yAxis} includeHidden />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <ChartBar hide={decomp.isHidden('capital')} dataKey="capitalContribution" fill={CAPITAL_FILL} name="Capital Contribution" />
            <ChartBar hide={decomp.isHidden('labor')} dataKey="laborContribution" fill={LABOR_FILL} name="Labor Contribution" />
            <ChartBar hide={decomp.isHidden('tfp')} dataKey="tfpContribution" fill={TFP_FILL} name="TFP Contribution" />
            <ChartBar hide={decomp.isHidden('total')} dataKey="growthRate" fill={TOTAL_GROWTH_FILL} name="Total Growth" />
          </BarChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'capital', label: 'Capital Contribution', color: CAPITAL_FILL },
            { key: 'labor', label: 'Labor Contribution', color: LABOR_FILL },
            { key: 'tfp', label: 'TFP Contribution', color: TFP_FILL },
            { key: 'total', label: 'Total Growth', color: TOTAL_GROWTH_FILL },
          ]}
          hidden={decomp.hidden}
          onToggle={decomp.toggle}
          onShowAll={decomp.showAll}
        />
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Contribution Shares (2000)
        </h2>
        <div className={SPLIT}>
          <ResponsiveContainer width="100%" height={400}>
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
              {/*
               * No legend on this one, deliberately. A pie is ONE series cut
               * into slices, so there is nothing to hide: `hide` on a slice
               * removes part of the quantity being displayed, and a pie with
               * a slice missing is not a pie any more. Buttons here would
               * also be a lie — clickable, focusable, and inert.
               *
               * It is not information loss either: every slice already
               * carries its own name and percentage as a direct label, so
               * the legend repeated, in a column, what the slices say.
               */}
            </PieChart>
          </ResponsiveContainer>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Capital Contribution" value={currentData.capitalContribution.toFixed(1)} unit="%" />
              <StatBox label="Labor Contribution" value={currentData.laborContribution.toFixed(1)} unit="%" />
              <StatBox label="TFP Contribution" value={currentData.tfpContribution.toFixed(1)} unit="%" />
              <StatBox label="Total Growth" value={currentData.growthRate.toFixed(1)} unit="%" />
            </div>
        <TileReadout>
          All four tiles are the four segments of one stacked bar — total growth
          with capital, labour and TFP as its parts — so each is a segment
          height and Total Growth is the whole of the stack, not a fifth series.
          The chart is ten bars, one per year, and the year matters: these are{' '}
          {currentData.year}'s, not the last bar's. The second chart holds that
          year on its own, which is where to read the shares rather than the
          levels.
        </TileReadout>
              

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

      <div className="mt-s-8 grid gap-s-6 sm:grid-cols-2 lg:grid-cols-3">
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

      <ToolNote label="Reference" variant="info" title="Key Insights from Growth Accounting" headingLevel={2}>
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
