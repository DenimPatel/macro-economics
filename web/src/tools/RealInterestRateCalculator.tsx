import { useState } from 'react'
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
} from 'recharts'
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
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'
import { useHiddenSeries } from '../lib/chartSeries'
import { ChartLegend } from '../components/ChartLegend'
import { dataDomain } from '../lib/chartDomain'

interface ScenarioData {
  scenario: string
  nominalRate: number
  inflationRate: number
  expectedInflation: number
  realRate: number
  expectedRealRate: number
}

/**
 * The five scenarios as the bar chart's x axis spells them, which is not how
 * the tooltip, the data or the section heading spell them.
 *
 * The axis is the only one of those places with a hard geometric budget — the
 * plot is 214px wide at 390px and five categories divide it into 42.8px bands
 * — and a category label has to fit its band. It is a separate map rather
 * than a second `scenario` field because the full name has to survive
 * everywhere else: it is what the tooltip prints, and a tooltip that said
 * "Scenario: Deflation" when the axis said "Scenario: 2" would be a defect of
 * the same class this map exists to fix.
 *
 * `tickFormatter` receives the raw payload value, not the tick text, so the
 * tooltip is unaffected by this.
 */
const SCENARIO_TICK_LABELS: Record<string, string> = {
  'Normal Economy': 'Normal',
  'High Inflation': 'High infl.',
  Deflation: 'Deflation',
  Disinflation: 'Disinflation',
  'Stagflation (1970s)': 'Stagflation',
}


interface TimeSeriesData {
  period: string
  nominalRate: number
  actualInflation: number
  expectedInflation: number
  realRate: number
  expectedRealRate: number
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
  nominalRate: 3.5,
  actualInflation: 2.5,
  expectedInflation: 2.2,
}


export default function RealInterestRateCalculator() {
  const actualVsExpected = useHiddenSeries(['realActual', 'realExpected'])
  const scenarios = useHiddenSeries(['nominal', 'inflation', 'real'])
  const historical = useHiddenSeries(['realHist', 'nominalHist', 'inflationHist'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [nominalRate, setNominalRate] = useState(DEFAULTS.nominalRate)
const [actualInflation, setActualInflation] = useState(DEFAULTS.actualInflation)
const [expectedInflation, setExpectedInflation] = useState(DEFAULTS.expectedInflation)

  const { reset, dirty } = useToolReset(
    {
    nominalRate: nominalRate,
    actualInflation: actualInflation,
    expectedInflation: expectedInflation,
    },
    {
      setNominalRate,
      setActualInflation,
      setExpectedInflation,
    },
    {
      nominalRate: DEFAULTS.nominalRate,
      actualInflation: DEFAULTS.actualInflation,
      expectedInflation: DEFAULTS.expectedInflation,
    },
  )
  const [scenarioMode, setScenarioMode] = useState<
    'custom' | 'high-inflation' | 'deflation' | 'disinflation' | 'stagflation'
  >('custom')

  // Apply scenario presets
  let activeNominal = nominalRate
  let activeActual = actualInflation
  let activeExpected = expectedInflation

  if (scenarioMode === 'high-inflation') {
    activeNominal = 4.5
    activeActual = 5.5
    activeExpected = 5.0
  } else if (scenarioMode === 'deflation') {
    activeNominal = 0.5
    activeActual = -1.5
    activeExpected = -1.0
  } else if (scenarioMode === 'disinflation') {
    activeNominal = 5.0
    activeActual = 1.5
    activeExpected = 3.0
  } else if (scenarioMode === 'stagflation') {
    activeNominal = 3.0
    activeActual = 8.0
    activeExpected = 7.5
  }

  // Fisher Equation: r = i - π
  const realRate = activeNominal - activeActual
  const expectedRealRate = activeNominal - activeExpected

  // Interest rate shock effects (illustrative borrowing/lending decisions)
  const borrowingIncentive =
    realRate < 0 ? 'Very High (borrowing is profitable!)' :
    realRate < 2 ? 'High (borrowing is attractive)' :
    realRate < 4 ? 'Moderate (borrowing is reasonable)' : 'Low (borrowing is expensive)'

  const savingIncentive =
    realRate < 0 ? 'Very Low (savings eroded)' :
    realRate < 2 ? 'Low (real returns are modest)' :
    realRate < 4 ? 'Moderate (decent real returns)' : 'High (strong incentive to save)'

  // Scenario data showing typical values
  const scenarioComparison: ScenarioData[] = [
    {
      scenario: 'Normal Economy',
      nominalRate: 3.5,
      inflationRate: 2.5,
      expectedInflation: 2.5,
      realRate: 1.0,
      expectedRealRate: 1.0,
    },
    {
      scenario: 'High Inflation',
      nominalRate: 4.5,
      inflationRate: 5.5,
      expectedInflation: 5.0,
      realRate: -1.0,
      expectedRealRate: -0.5,
    },
    {
      scenario: 'Deflation',
      nominalRate: 0.5,
      inflationRate: -1.5,
      expectedInflation: -1.0,
      realRate: 2.0,
      expectedRealRate: 1.5,
    },
    {
      scenario: 'Disinflation',
      nominalRate: 5.0,
      inflationRate: 1.5,
      expectedInflation: 3.0,
      realRate: 3.5,
      expectedRealRate: 2.0,
    },
    {
      scenario: 'Stagflation (1970s)',
      nominalRate: 3.0,
      inflationRate: 8.0,
      expectedInflation: 7.5,
      realRate: -5.0,
      expectedRealRate: -4.5,
    },
  ]

  // Time series showing historical contexts
  const timeSeriesData: TimeSeriesData[] = [
    {
      period: '2010s',
      nominalRate: 1.5,
      actualInflation: 1.8,
      expectedInflation: 2.0,
      realRate: -0.3,
      expectedRealRate: -0.5,
    },
    {
      period: '2020 (COVID)',
      nominalRate: 0.25,
      actualInflation: 1.2,
      expectedInflation: 1.5,
      realRate: -0.95,
      expectedRealRate: -1.25,
    },
    {
      period: '2021',
      nominalRate: 0.25,
      actualInflation: 4.7,
      expectedInflation: 2.5,
      realRate: -4.45,
      expectedRealRate: -2.25,
    },
    {
      period: '2022',
      nominalRate: 3.0,
      actualInflation: 8.0,
      expectedInflation: 6.5,
      realRate: -5.0,
      expectedRealRate: -3.5,
    },
    {
      period: '2023',
      nominalRate: 5.33,
      actualInflation: 3.4,
      expectedInflation: 3.5,
      realRate: 1.93,
      expectedRealRate: 1.83,
    },
    {
      period: '2024',
      nominalRate: 4.5,
      actualInflation: 2.8,
      expectedInflation: 2.5,
      realRate: 1.7,
      expectedRealRate: 2.0,
    },
  ]

  // Generate comparison data showing how real rates change with different nominal rates
  const generateNominalRateComparison = () => {
    const data = []
    for (let i = -2; i <= 8; i += 0.5) {
      data.push({
        nominalRate: parseFloat(i.toFixed(1)),
        realRateActual: parseFloat((i - activeActual).toFixed(2)),
        realRateExpected: parseFloat((i - activeExpected).toFixed(2)),
      })
    }
    return data
  }

  const nominalComparison = generateNominalRateComparison()

  /**
   * The three rate axes on this page, each computed from the series it draws.
   *
   * Every one of them carried a literal pair, and a literal pair on a Recharts
   * axis is not what it looks like: with `allowDataOverflow` false — which
   * `tools.test.tsx` requires site-wide, correctly, because the alternative
   * clips a series past the plot edge with nothing on screen saying so — a
   * numeric `domain` is a FLOOR and a CEILING rather than the drawn range, and
   * Recharts widens it to whatever the data needs. So the written bounds and
   * the drawn bounds were different numbers with nothing on the page to say
   * so, and the written ones were the ones a reader of the source believed.
   *
   * MEASURED, at the defaults, in Chromium on the production build:
   *
   *  - Fisher chart, `[-5, 8]`: the data over i ∈ [-2, 8] is [-4.5, 5.8], so
   *    the drawn axis really is [-5, 8] and the prop is live THERE. Drag i to
   *    -2 and inflation to 10 and the drawn axis becomes [-12, 8] with ticks
   *    -12 -7 -2 3 8 — one bound snapped to a round 8 and the other sitting
   *    on a data point, which is the tell that a pin and a fit have been
   *    mixed. Widening the prop would have changed nothing at those settings.
   *  - Scenario bars, `[-6, 6]`: 1970s stagflation has inflation 8.0, so the
   *    drawn axis is [-6, 8] and the ceiling in the source is not the ceiling
   *    on the screen.
   *  - History, `[-6, 6]`: 2022 has inflation 8.0, same answer.
   *
   * None of the three clipped its data — Recharts' widening is why — so this
   * is not a fix for marks outside a frame. It is the removal of a claim in
   * the source that the page contradicts, in favour of a bound that is
   * computed, follows the sliders, and cannot be half right.
   *
   * `includeZero` on all three because zero is the single most load-bearing
   * line on this page: the tool's own copy branches on `realRate < 0` three
   * times and each chart draws `chartTheme.baseline` there, so a domain that
   * stopped short of zero on an all-positive series would put the baseline
   * outside the frame and take the sign question with it.
   */
  const fisherRateDomain = dataDomain(
    [
      nominalComparison.map((d) => d.realRateActual),
      nominalComparison.map((d) => d.realRateExpected),
    ],
    { includeZero: true },
  )
  const scenarioRateDomain = dataDomain(
    [
      scenarioComparison.map((d) => d.nominalRate),
      scenarioComparison.map((d) => d.inflationRate),
      scenarioComparison.map((d) => d.realRate),
    ],
    { includeZero: true },
  )
  const historyRateDomain = dataDomain(
    [
      timeSeriesData.map((d) => d.nominalRate),
      timeSeriesData.map((d) => d.actualInflation),
      timeSeriesData.map((d) => d.realRate),
    ],
    { includeZero: true },
  )

  return (
    <div className="tool-card">
      <ToolHeader
        title="Real Interest Rate Calculator"
        description="Understand the Fisher Equation and why central banks care about real (not nominal) interest rates. Explore how inflation affects the real returns on savings and the real costs of borrowing. See why negative real rates can distort economic decisions."
        badge="intermediate"
      />

      <div className="control-panel">
        <div className="grid grid-cols-1 gap-s-6 lg:grid-cols-3">
          <SliderControl
            label="Nominal Interest Rate (i)"
            value={activeNominal}
            min={-2}
            max={8}
            step={0.1}
            onChange={setNominalRate}
            unit="%"
          />
          <SliderControl
            label="Actual Inflation Rate (π)"
            value={activeActual}
            min={-3}
            max={10}
            step={0.1}
            onChange={setActualInflation}
            unit="%"
          />
          <SliderControl
            label="Expected Inflation (π^e)"
            value={activeExpected}
            min={-3}
            max={10}
            step={0.1}
            onChange={setExpectedInflation}
            unit="%"
          />
        </div>

        <div className="mt-s-6 flex flex-wrap gap-s-2">
          <Button
            onClick={() => setScenarioMode('custom')}
            variant={scenarioMode === 'custom' ? 'primary' : 'secondary'}
          >
            Custom
          </Button>
          <Button
            onClick={() => setScenarioMode('high-inflation')}
            variant={scenarioMode === 'high-inflation' ? 'primary' : 'secondary'}
          >
            High Inflation
          </Button>
          <Button
            onClick={() => setScenarioMode('deflation')}
            variant={scenarioMode === 'deflation' ? 'primary' : 'secondary'}
          >
            Deflation
          </Button>
          <Button
            onClick={() => setScenarioMode('disinflation')}
            variant={scenarioMode === 'disinflation' ? 'primary' : 'secondary'}
          >
            Disinflation
          </Button>
          <Button
            onClick={() => setScenarioMode('stagflation')}
            variant={scenarioMode === 'stagflation' ? 'primary' : 'secondary'}
          >
            Stagflation
          </Button>
        </div>
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      {/* Key Statistics */}
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-3">
        <StatBox label="Nominal Rate" value={activeNominal.toFixed(2)} unit="%" tone="accent" />
        <StatBox label="Actual Inflation" value={activeActual.toFixed(2)} unit="%" />
        <StatBox label="Expected Inflation" value={activeExpected.toFixed(2)} unit="%" />
        <StatBox label="Real Rate (Actual)" value={realRate.toFixed(2)} unit="%" tone="accent" />
        <StatBox
          label="Expected Real Rate"
          value={expectedRealRate.toFixed(2)}
          unit="%"
          tone="accent"
        />
        <StatBox
          label="Inflation Surprise"
          value={(activeActual - activeExpected).toFixed(2)}
          unit="%"
          tone={Math.abs(activeActual - activeExpected) > 0.5 ? 'accent' : undefined}
        />
      </div>
        <TileReadout>
                  Nominal Rate, Actual Inflation and Expected Inflation restate the
                  three sliders and each prints its own value under its track. Real
                  Rate (Actual) and Expected Real Rate are the two lines of the chart
                  below, i − π and i − π^e, and the gap between them is what the chart
                  exists to show. The Inflation Surprise is that gap in inflation
                  points — {(actualInflation - expectedInflation >= 0 ? 'above' : 'below')}{' '}
                  actual expectations by{' '}
                  {Math.abs(actualInflation - expectedInflation).toFixed(2)} — and it is
                  on no axis, because it is a difference between two of them.
                </TileReadout>

      {/* Fisher Equation Explanation */}
      <div className="mb-s-8">
        <InfoBox type="info" title="Fisher Equation">
          <p className="font-mono text-[0.95rem] text-fg">
            Real Interest Rate (r) = Nominal Rate (i) &minus; Inflation (π)
          </p>
          <p className="mt-s-3">
            The <strong>real interest rate</strong> measures the true economic cost of borrowing and
            benefit of saving, <strong>after accounting for inflation</strong>. A 5% nominal rate with
            4% inflation only gives you 1% real return!
          </p>
        </InfoBox>
      </div>

      {/* Economic Implications */}
      <div className="mb-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-3">
        <ToolNote
          headingLevel={2}
          label="Borrowers"
          variant={realRate < 0 ? 'warning' : 'insight'}
          title="Borrowing Incentive"
        >
          <p>{borrowingIncentive}</p>
          {realRate < 0 && (
            <p className="italic">
              Negative real rates make borrowing highly attractive&mdash;you pay back less in real terms
              than you borrowed!
            </p>
          )}
        </ToolNote>

        <ToolNote
          headingLevel={2}
          label="Savers"
          variant={realRate < 2 ? 'insight' : 'try'}
          title="Saving Incentive"
        >
          <p>{savingIncentive}</p>
          {realRate < 0 && (
            <p className="italic">
              Negative real rates punish savers&mdash;your money loses purchasing power!
            </p>
          )}
        </ToolNote>

        <ToolNote
          headingLevel={2}
          label="Expectations"
          variant="info"
          title="Real vs. Expected"
        >
          <p>
            {Math.abs(activeActual - activeExpected) < 0.5
              ? 'Inflation close to expectations (good forecasting)'
              : `Inflation ${
                  activeActual > activeExpected ? 'higher' : 'lower'
                } than expected (unexpected changes hurt planning)`}
          </p>
        </ToolNote>
      </div>

      {/* Fisher Equation Visualization */}
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          How Real Rates Change with Nominal Rates (at current {activeActual.toFixed(1)}% inflation)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={nominalComparison} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="nominalRate"
              type="number"
              label={{
                value: 'Nominal Interest Rate (%)',
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
                value: 'Real Interest Rate (%)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={fisherRateDomain}
              {...chartTheme.yAxis}
              includeHidden
            />
            {/* Zero real rate. This is the single most load-bearing baseline
             * on the site: the tool's own copy branches on `realRate < 0`
             * three times above, and the chart it sits under is where a
             * reader checks that sign. */}
            <ReferenceLine y={0} {...chartTheme.baseline} />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : value)}
              labelFormatter={(label) => `Nominal Rate: ${label.toFixed(1)}%`}
            />
            <ChartLine
              type="monotone"
              hide={actualVsExpected.isHidden('realActual')}
              dataKey="realRateActual"
              stroke={chartColor(4)}
              name={`Real Rate = i − ${activeActual.toFixed(1)}%`}
              strokeWidth={3}
              dot={false}
            />
            <ChartLine
              type="monotone"
              hide={actualVsExpected.isHidden('realExpected')}
              dataKey="realRateExpected"
              stroke={chartColor(0)}
              name={`Expected Real Rate = i − ${activeExpected.toFixed(1)}%`}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            {
              key: 'realActual',
              label: `Real Rate = i − ${activeActual.toFixed(1)}%`,
              color: chartColor(4),
            },
            {
              key: 'realExpected',
              label: `Expected Real Rate = i − ${activeExpected.toFixed(1)}%`,
              color: chartColor(0),
            },
          ]}
          hidden={actualVsExpected.hidden}
          onToggle={actualVsExpected.toggle}
          onShowAll={actualVsExpected.showAll}
        />
      </div>

      {/* Scenario Comparison */}
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Real Rates Across Economic Scenarios
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={scenarioComparison} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="scenario"
              angle={-90}
              textAnchor="end"
              /* Not a plot height, and the only `height` in this tool that is
               * not 400. On a cartesian axis `height` is the band the tick
               * LABELS are given. Raising it to 400 would buy an empty 300px
               * under the plot and shrink the plot to nothing, which is the
               * opposite of the point. The normalisation test knows the
               * difference: it requires every `ResponsiveContainer` height to
               * be the one value and allows exactly one other `height` in the
               * tools, on an axis.
               *
               * VERTICAL, and that is the fix for a collision the angle could
               * not solve. At -45 a label's horizontal footprint is
               * `width x cos45`, so no rotation but zero can make a long name
               * fit a 42.8px band, and at 390px the five bands are 42.8px
               * wide: MEASURED, four overlapping pairs at gaps of -21.0,
               * -3.8, -12.4 and -42.6px at textScale 1.0, and -26.8, -9.6,
               * -18.2 and -48.4px at 1.3 — identical at plot heights of 300,
               * 350 and 400, because a label's footprint is a function of its
               * LENGTH and the plot's WIDTH, not of how tall the plot is. At
               * -90 the footprint is the font size instead of the string
               * length, so 11px of label sits in a 42.8px band and the
               * collision cannot recur at any width or text size. What the
               * angle does cost is depth, which is what this band is: 100px
               * held the 19-character "Stagflation (1970s)" at 16px and is
               * sized for the longest SHORT label instead.
               *
               * The 12px `tick` override that stood here pinned the category
               * labels to a fixed size, which is the reader's text-size
               * preference ignored on one axis of the site. `chartTheme.axis`
               * already carries `--chart-tick-size`, so it is dropped and the
               * band is sized for the scale that preference can reach. */
              height={120}
              interval={0}
              tickFormatter={(value: string) => SCENARIO_TICK_LABELS[value] ?? value}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Interest Rate (%)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={scenarioRateDomain}
              {...chartTheme.yAxis}
              includeHidden
            />
            {/* Zero real rate again, on a bar chart whose bars genuinely
             * cross it: the stagflation scenario sits at -5 and the
             * disinflation one at +3.5, and the sign is the finding. */}
            <ReferenceLine y={0} {...chartTheme.baseline} />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(1)}%` : value)}
              labelFormatter={(label) => `Scenario: ${label}`}
            />
            <ChartBar hide={scenarios.isHidden('nominal')} dataKey="nominalRate" fill={chartColor(0)} name="Nominal Rate" />
            <ChartBar hide={scenarios.isHidden('inflation')} dataKey="inflationRate" fill={chartColor(2)} name="Inflation Rate" />
            <ChartBar hide={scenarios.isHidden('real')} dataKey="realRate" fill={chartColor(1)} name="Real Rate" />
          </BarChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'nominal', label: 'Nominal Rate', color: chartColor(0) },
            { key: 'inflation', label: 'Inflation Rate', color: chartColor(2) },
            { key: 'real', label: 'Real Rate', color: chartColor(1) },
          ]}
          hidden={scenarios.hidden}
          onToggle={scenarios.toggle}
          onShowAll={scenarios.showAll}
        />
      </div>

      {/* Historical Context */}
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Historical Real Interest Rates</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={timeSeriesData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="period"
              label={{
                value: 'Time Period',
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
                value: 'Interest Rate (%)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={historyRateDomain}
              {...chartTheme.yAxis}
              includeHidden
            />
            {/* Zero nominal rate, which on this chart is the effective lower
             * bound: the timeline's lowest values are 0.1% and 0.25%, and
             * the reader is meant to see how close to zero a policy rate
             * gets, not to compare two positive rates. */}
            <ReferenceLine y={0} {...chartTheme.baseline} />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : value)}
            />
            <ChartArea
              type="monotone"
              hide={historical.isHidden('realHist')}
              dataKey="realRate"
              fill={chartColor(4)}
              stroke={chartColor(4)}
              name="Actual Real Rate"
              fillOpacity={0.3}
              strokeOpacity={0.9}
            />
            <ChartLine
              type="monotone"
              hide={historical.isHidden('nominalHist')}
              dataKey="nominalRate"
              stroke={chartColor(0)}
              name="Nominal Rate"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <ChartLine
              type="monotone"
              hide={historical.isHidden('inflationHist')}
              dataKey="actualInflation"
              stroke={chartColor(2)}
              name="Inflation"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'realHist', label: 'Actual Real Rate', color: chartColor(4) },
            { key: 'nominalHist', label: 'Nominal Rate', color: chartColor(0) },
            { key: 'inflationHist', label: 'Inflation', color: chartColor(2) },
          ]}
          hidden={historical.hidden}
          onToggle={historical.toggle}
          onShowAll={historical.showAll}
        />
        <ToolNote label="Key observations" variant="insight" title="Reading the history">
          <ul>
            <li>
              <strong>2010s:</strong> Near-zero or negative real rates supported economic recovery but kept savers
              underwater.
            </li>
            <li>
              <strong>2021-2022:</strong> Massive negative real rates as Fed lagged inflation, making borrowing
              irresistible.
            </li>
            <li>
              <strong>2023-2024:</strong> Fed hiking finally pushed real rates positive, cooling inflation and supporting
              savers.
            </li>
          </ul>
        </ToolNote>
      </div>

      {/* Educational Content */}
      <div className="mb-s-4">
        <InfoBox type="warning" title="Why real rates matter for economic decisions">
          <ul className="mt-s-2">
            <li>
              <strong>Savers:</strong> Negative real rates erode purchasing power. If you save at 1% nominal but
              inflation is 4%, you lose 3% in real buying power annually.
            </li>
            <li>
              <strong>Borrowers:</strong> Negative real rates make debt cheap. Companies and households have strong
              incentives to borrow and invest, fueling demand and inflation.
            </li>
            <li>
              <strong>Asset Prices:</strong> Low real rates make risky assets (stocks, real estate) more attractive
              relative to safe bonds, pushing up valuations.
            </li>
            <li>
              <strong>Investment Decisions:</strong> Firms compare project returns to real borrowing costs. Negative
              real rates justify marginal projects that would be rejected otherwise.
            </li>
            <li>
              <strong>Currency Markets:</strong> Countries with persistently negative real rates see capital outflows
              as investors seek positive returns elsewhere.
            </li>
          </ul>
        </InfoBox>
      </div>

      <div>
        <InfoBox type="info" title="Expected vs. actual real rates">
          <ul className="mt-s-2">
            <li>
              <strong>Expected Real Rate (r^e = i − π^e):</strong> What borrowers and savers expect when making
              decisions. Forward-looking.
            </li>
            <li>
              <strong>Actual Real Rate (r = i − π):</strong> Known only after inflation materializes. Measures true
              outcome.
            </li>
            <li>
              <strong>Inflation Surprises:</strong> When actual inflation exceeds expectations, real returns on
              borrowing/saving diverge from what was anticipated. This redistributes wealth from savers to borrowers.
            </li>
            <li>
              <strong>Central Bank Credibility:</strong> If the Fed is credible, expected and actual inflation align,
              reducing surprises and economic uncertainty.
            </li>
          </ul>
        </InfoBox>
      </div>
    </div>
  )
}
