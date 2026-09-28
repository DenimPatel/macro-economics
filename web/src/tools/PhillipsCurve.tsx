import { useState } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
  ComposedChart,
} from 'recharts'
import { ChartLine, ChartScatter } from '../components/ChartPrimitives'
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

/** Each concept keeps one stable palette slot across every chart in this tool. */
const TRADITIONAL_STROKE = chartColor(3)
const EXPECTATIONS_STROKE = chartColor(0)
const LOW_EXPECTATIONS_STROKE = chartColor(1)
const HIGH_EXPECTATIONS_STROKE = chartColor(4)
const CURRENT_STROKE = chartColor(2)
const NATURAL_RATE_STROKE = chartColor(5)
const DECADE_1960S = chartColor(3)
const DECADE_1970S = chartColor(4)
const DECADE_1980S = chartColor(1)
const DECADE_2000S = chartColor(6)
const DECADE_2020S = chartColor(2)

/**
 * Where the natural-rate marker is drawn, in percent.
 *
 * It is a named constant rather than a literal in the JSX because the axis
 * domain is computed from it: a marker outside the domain is not clipped, it
 * is deleted — Recharts' `ReferenceDot` returns `null` when the coordinate is
 * out of range — so a second copy of the number is a second chance for the
 * mark and the frame to disagree.
 */
const NATURAL_RATE_MARKER_Y = -2.5

/** One sampled point on the unemployment axis, in percent and percent. */
interface CurvePoint {
  unemployment: number
  traditional: number
  expectations: number
}

/** A sampled point plus the two expectations-shifted curves the comparison
 *  mode adds beside it. */
interface ComparisonPoint extends CurvePoint {
  lowExpectations: number
  highExpectations: number
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
  expectedInflation: 2,
  naturalUnemployment: 4.5,
  philipsCurveAlpha: 1.0,
  currentUnemployment: 5.0,
  showTraditional: true,
  showHistorical: true,
  comparisonMode: false,
}

export default function PhillipsCurve() {
  // The two `ReferenceDot`s on this chart — "Current Position" and the natural
  // rate — are deliberately absent. A reference dot is an annotation on the
  // plot, not a series with a data line behind it, and Recharts' `ReferenceDot`
  // has no `hide` prop to give it: a legend row for one would be a focusable,
  // clickable button that did nothing when pressed, which is the defect this
  // legend exists to remove.
  const phillips = useHiddenSeries(['traditional', 'expectations', 'lowExpectations', 'highExpectations'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [expectedInflation, setExpectedInflation] = useState(DEFAULTS.expectedInflation)
const [naturalUnemployment, setNaturalUnemployment] = useState(DEFAULTS.naturalUnemployment)
const [philipsCurveAlpha, setPhilipsCurveAlpha] = useState(DEFAULTS.philipsCurveAlpha)
const [currentUnemployment, setCurrentUnemployment] = useState(DEFAULTS.currentUnemployment)
const [showTraditional, setShowTraditional] = useState(DEFAULTS.showTraditional)
const [showHistorical, setShowHistorical] = useState(DEFAULTS.showHistorical)
const [comparisonMode, setComparisonMode] = useState(DEFAULTS.comparisonMode)

  const { reset, dirty } = useToolReset(
    {
    expectedInflation: expectedInflation,
    naturalUnemployment: naturalUnemployment,
    philipsCurveAlpha: philipsCurveAlpha,
    currentUnemployment: currentUnemployment,
    showTraditional: showTraditional,
    showHistorical: showHistorical,
    comparisonMode: comparisonMode,
    },
    {
      setExpectedInflation,
      setNaturalUnemployment,
      setPhilipsCurveAlpha,
      setCurrentUnemployment,
      setShowTraditional,
      setShowHistorical,
      setComparisonMode,
    },
    {
      expectedInflation: DEFAULTS.expectedInflation,
      naturalUnemployment: DEFAULTS.naturalUnemployment,
      philipsCurveAlpha: DEFAULTS.philipsCurveAlpha,
      currentUnemployment: DEFAULTS.currentUnemployment,
      showTraditional: DEFAULTS.showTraditional,
      showHistorical: DEFAULTS.showHistorical,
      comparisonMode: DEFAULTS.comparisonMode,
    },
  )

  // Generate curve data points
  const generateCurveData = (): CurvePoint[] => {
    const data: CurvePoint[] = []
    for (let u = 0; u <= 10; u += 0.5) {
      // Traditional Phillips Curve: π = 5 - 1.5(u - u_n)
      // This mimics 1960s behavior with inflation bias
      const traditionalInflation = 5 - 1.5 * (u - 4)

      // Expectations-augmented Phillips Curve: π = π^e - α(u - u_n)
      const expectationsInflation = expectedInflation - philipsCurveAlpha * (u - naturalUnemployment)

      data.push({
        unemployment: parseFloat(u.toFixed(1)),
        traditional: parseFloat(traditionalInflation.toFixed(2)),
        expectations: parseFloat(expectationsInflation.toFixed(2)),
      })
    }
    return data
  }

  // Historical data points to overlay
  const historicalData = [
    // 1960s: Phillips curve trade-off was clear
    { unemployment: 3.5, inflation: 3.5, period: '1960s', color: DECADE_1960S },
    { unemployment: 4.0, inflation: 4.2, period: '1960s', color: DECADE_1960S },
    { unemployment: 4.5, inflation: 5.0, period: '1960s', color: DECADE_1960S },
    // 1970s: Stagflation breaks Phillips Curve
    { unemployment: 5.5, inflation: 8.5, period: '1970s', color: DECADE_1970S },
    { unemployment: 6.0, inflation: 11.0, period: '1970s', color: DECADE_1970S },
    { unemployment: 7.5, inflation: 9.5, period: '1970s', color: DECADE_1970S },
    // 1980s: Volcker disinflation
    { unemployment: 8.0, inflation: 5.5, period: '1980s', color: DECADE_1980S },
    { unemployment: 7.0, inflation: 4.2, period: '1980s', color: DECADE_1980S },
    // 2000s: Great Moderation
    { unemployment: 4.5, inflation: 2.5, period: '2000s', color: DECADE_2000S },
    { unemployment: 5.0, inflation: 3.0, period: '2000s', color: DECADE_2000S },
    // 2020s: Pandemic/Post-pandemic
    { unemployment: 3.5, inflation: 3.5, period: '2020s', color: DECADE_2020S },
    { unemployment: 4.0, inflation: 4.2, period: '2020s', color: DECADE_2020S },
  ]

  const curveData = generateCurveData()

  // Calculate implied inflation at current unemployment
  const impliedInflationExpectations =
    expectedInflation - philipsCurveAlpha * (currentUnemployment - naturalUnemployment)
  const impliedInflationTraditional = 5 - 1.5 * (currentUnemployment - 4)
  const impliedInflation = showTraditional ? impliedInflationTraditional : impliedInflationExpectations

  // Inflation surprise
  const inflationSurprise = impliedInflation - expectedInflation

  // Comparison mode data (low vs high expectations)
  // EMPTY when the comparison is off, rather than `curveData`: the chart below
  // still selects between the two, and an array that is empty when it carries
  // no data is the one the domain can be computed from without a second
  // `comparisonMode` test that could fall out of step with the series the
  // chart actually draws.
  const comparisonData: ComparisonPoint[] = comparisonMode
    ? curveData.map((d) => ({
        ...d,
        lowExpectations: expectedInflation - 2 - philipsCurveAlpha * (d.unemployment - naturalUnemployment),
        highExpectations: expectedInflation + 2 - philipsCurveAlpha * (d.unemployment - naturalUnemployment),
      }))
    : []

  /**
   * The inflation axis, computed from everything this chart marks.
   *
   * It was `domain={[-3, 10]}`, and the chart was outside it in BOTH
   * directions at the defaults: the traditional curve is
   * `5 - 1.5(u - 4)` sampled over u ∈ [0, 10], so it runs 11 at u = 0 and -4
   * at u = 10 — 27.2px off the top of the plot box and 27.2px off the bottom
   * of it, MEASURED at 1280px and 390px at both text scales. A 1970s
   * historical point sits at 11.0 for the same reason. The current-position
   * dot leaves the frame as soon as the reader moves a slider: at
   * `Current Unemployment = 10` the tile reads -4.00%, and at
   * π^e = -2, u_n = 7, α = 2, u = 0 it reads 11.00%, one point above a
   * ceiling of 10.
   *
   * A curve that stops looks like a fact about the model, so the domain
   * follows the data. Every value fed in is one the chart actually draws, and
   * the two series the buttons can switch OFF are left out when they are off —
   * a hidden series must not hold the axis open, which is the same reason
   * `includeHidden` is on the axis and the reason this list is built from
   * the same conditionals the series are drawn under.
   *
   * `includeZero` because zero is the question this chart asks: the sign of
   * inflation is the finding, `chartTheme.baseline` is drawn there, and
   * deflation is a different regime rather than a lower point on the same one.
   */
  const inflationDomain = dataDomain(
    [
      curveData.map((d) => d.expectations),
      showTraditional ? curveData.map((d) => d.traditional) : [],
      comparisonData.map((d) => d.lowExpectations),
      comparisonData.map((d) => d.highExpectations),
      ...(showHistorical ? historicalData.map((d) => d.inflation) : []),
      impliedInflation,
      NATURAL_RATE_MARKER_Y,
    ],
    { includeZero: true },
  )

  return (
    <div className="tool-card">
      <ToolHeader
        title="Phillips Curve"
        description="Explore the relationship between unemployment and inflation. From the 1960s Phillips Curve to modern expectations-augmented models, understand why central bank credibility matters for inflation control."
        badge="intermediate"
      />

      <div className="control-panel">
        <div className="grid gap-s-6 lg:grid-cols-2">
          <SliderControl
            label="Expected Inflation (π^e)"
            value={expectedInflation}
            min={-2}
            max={6}
            step={0.5}
            onChange={setExpectedInflation}
            unit="%"
          />
          <SliderControl
            label="Natural Unemployment Rate (u_n)"
            value={naturalUnemployment}
            min={3}
            max={7}
            step={0.5}
            onChange={setNaturalUnemployment}
            unit="%"
          />
          <SliderControl
            label="Phillips Curve Sensitivity (α)"
            value={philipsCurveAlpha}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={setPhilipsCurveAlpha}
            unit=""
          />
          <SliderControl
            label="Current Unemployment Rate"
            value={currentUnemployment}
            min={0}
            max={10}
            step={0.5}
            onChange={setCurrentUnemployment}
            unit="%"
          />
        </div>

        <div className="mt-s-6 flex flex-wrap gap-s-4">
          <Button
            onClick={() => setShowTraditional(!showTraditional)}
            variant={showTraditional ? 'primary' : 'secondary'}
          >
            {showTraditional ? 'Traditional PC' : 'Expectations-Augmented PC'}
          </Button>
          <Button
            onClick={() => setShowHistorical(!showHistorical)}
            variant={showHistorical ? 'primary' : 'secondary'}
          >
            {showHistorical ? 'Hide Historical' : 'Show Historical'}
          </Button>
          <Button
            onClick={() => setComparisonMode(!comparisonMode)}
            variant={comparisonMode ? 'primary' : 'secondary'}
          >
            {comparisonMode ? 'Comparison ON' : 'Comparison OFF'}
          </Button>
        </div>
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-4">
        <StatBox
          label="Current Unemployment"
          value={currentUnemployment.toFixed(1)}
          unit="%"
          tone="accent"
        />
        <StatBox
          label="Implied Inflation"
          value={impliedInflation.toFixed(2)}
          unit="%"
          tone="accent"
        />
        <StatBox
          label="Expected Inflation"
          value={expectedInflation.toFixed(2)}
          unit="%"
        />
        <StatBox
          label="Inflation Surprise"
          value={inflationSurprise.toFixed(2)}
          unit="%"
          tone={Math.abs(inflationSurprise) > 0.5 ? 'accent' : undefined}
        />
      </div>
        <TileReadout>
                  Current Unemployment is the dot's x and Implied Inflation is its y,
                  so the two are the same point read twice and both are on the chart;
                  Expected Inflation is the line the dot is measured against. The
                  Inflation Surprise is the vertical distance between the dot and that
                  line — {(impliedInflation - expectedInflation >= 0 ? 'above' : 'below')}{' '}
                  it by{' '}
                  {Math.abs(impliedInflation - expectedInflation).toFixed(2)} points —
                  and it is on no axis, because it is a distance rather than either
                  quantity.
                </TileReadout>

      <div className="mb-s-8">
        <InfoBox type="info">
          <strong>What's shown:</strong> The{' '}
          {showTraditional ? (
            <>
              <span className="font-semibold text-fg">Traditional Phillips Curve</span> (1960s) assumes a
              stable trade-off: lower unemployment → higher inflation. Policy makers can permanently exploit this
              trade-off.
            </>
          ) : (
            <>
              <span className="font-semibold text-fg">Expectations-Augmented Phillips Curve</span> shows that
              inflation depends on both unemployment AND expected inflation. As expectations change (due to
              central bank credibility), the entire curve shifts.
            </>
          )}
        </InfoBox>
      </div>

      <div className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          {showTraditional ? 'Traditional vs Expectations-Augmented Phillips Curves' : 'Phillips Curve Analysis'}
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={comparisonMode ? comparisonData : curveData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="unemployment"
              type="number"
              label={{
                value: 'Unemployment Rate (%)',
                position: 'insideBottomRight',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
              /* Pinned, and it is the one axis on this chart that is. The
               * unemployment rate is a bounded quantity — the sliders run
               * 0–10% and the historical decade points are all inside it — and
               * it is the axis the two curves are compared ALONG, so a domain
               * that moved with the y data would slide the plot box under a
               * stationary curve for no gain. Everything the chart plots and
               * reports on this axis is inside [0, 10], so there is nothing
               * here for a derived domain to catch. */
              domain={[0, 10]}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Inflation Rate (%)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={inflationDomain}
              {...chartTheme.yAxis}
              includeHidden
            />
            {/* The zero baseline, and this is the chart it exists for. On a
             * Phillips curve the sign of inflation is the question the whole
             * tool asks — deflation against a positive rate is a different
             * regime, not a lower point on the same one — and the y axis
             * spans it by construction now, so a reader was finding zero by
             * eye among identical gridlines. `chartTheme.baseline` is a solid
             * `--border-strong` line where `chartTheme.reference` is a
             * dashed annotation: zero is a fact about the data, not a
             * threshold somebody chose. */}
            <ReferenceLine y={0} {...chartTheme.baseline} />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : value)}
              labelFormatter={(label) => `Unemployment: ${label.toFixed(1)}%`}
            />

            {showTraditional ? (
              <>
                <ChartLine
                  type="monotone"
                  dataKey="traditional"
                  hide={phillips.isHidden('traditional')}
                  stroke={TRADITIONAL_STROKE}
                  name="Traditional PC (1960s)"
                  strokeWidth={2}
                  dot={false}
                />
                <ChartLine
                  type="monotone"
                  dataKey="expectations"
                  hide={phillips.isHidden('expectations')}
                  stroke={EXPECTATIONS_STROKE}
                  name="Expectations-Augmented PC"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </>
            ) : (
              <>
                <ChartLine
                  type="monotone"
                  dataKey="expectations"
                  hide={phillips.isHidden('expectations')}
                  stroke={EXPECTATIONS_STROKE}
                  name={`Phillips Curve (π^e = ${expectedInflation.toFixed(1)}%)`}
                  strokeWidth={3}
                  dot={false}
                />
                {comparisonMode && (
                  <>
                    <ChartLine
                      type="monotone"
                      dataKey="lowExpectations"
                    hide={phillips.isHidden('lowExpectations')}
                      stroke={LOW_EXPECTATIONS_STROKE}
                      name="Low Expectations (π^e - 2%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <ChartLine
                      type="monotone"
                      dataKey="highExpectations"
                    hide={phillips.isHidden('highExpectations')}
                      stroke={HIGH_EXPECTATIONS_STROKE}
                      name="High Expectations (π^e + 2%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </>
                )}
              </>
            )}

            {/* Current point on curve */}
            <ReferenceDot
              x={currentUnemployment}
              y={impliedInflation}
              r={6}
              fill={CURRENT_STROKE}
              stroke={CURRENT_STROKE}
              strokeWidth={2}
              name="Current Position"
            />

            {/* Natural rate vertical line */}
            <ReferenceDot
              x={naturalUnemployment}
              y={NATURAL_RATE_MARKER_Y}
              r={3}
              fill={NATURAL_RATE_STROKE}
              stroke={NATURAL_RATE_STROKE}
              name={`Natural Rate (u_n = ${naturalUnemployment.toFixed(1)}%)`}
            />

            {/* Historical data overlay */}
            {showHistorical && (
              <ChartScatter
                data={historicalData}
                fill="transparent"
                name="Historical Data"
              >
                {historicalData.map((point, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={point.unemployment}
                    y={point.inflation}
                    r={4}
                    fill={point.color}
                    stroke={point.color}
                    fillOpacity={0.6}
                  />
                ))}
              </ChartScatter>
            )}
          </ComposedChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'traditional', label: 'Traditional PC (1960s)', color: TRADITIONAL_STROKE },
            {
              key: 'expectations',
              label: `Phillips Curve (π^e = ${expectedInflation.toFixed(1)}%)`,
              color: EXPECTATIONS_STROKE,
            },
            { key: 'lowExpectations', label: 'Low Expectations (π^e - 2%)', color: LOW_EXPECTATIONS_STROKE },
            { key: 'highExpectations', label: 'High Expectations (π^e + 2%)', color: HIGH_EXPECTATIONS_STROKE },
          ]}
          hidden={phillips.hidden}
          onToggle={phillips.toggle}
          onShowAll={phillips.showAll}
        />
      </div>

      {showHistorical && (
        <div className="mt-s-6 rounded-card border border-tier-intermediate/30 bg-tier-intermediate/5 p-s-4">
          <p className="mb-s-2 text-sm text-fg">
            <strong>Historical Periods:</strong>
          </p>
          <div className="flex flex-wrap gap-s-6 text-sm">
            <div className="flex items-center gap-s-2">
              <div className="h-3 w-3 rounded-sm bg-tier-case" />
              <span>1960s: Stable trade-off</span>
            </div>
            <div className="flex items-center gap-s-2">
              <div className="h-3 w-3 rounded-sm bg-tier-advanced" />
              <span>1970s: Stagflation</span>
            </div>
            <div className="flex items-center gap-s-2">
              <div className="h-3 w-3 rounded-sm bg-tier-beginner" />
              <span>1980s: Disinflation</span>
            </div>
            <div className="flex items-center gap-s-2">
              <div className="h-3 w-3 rounded-sm bg-tier-intermediate" />
              <span>2000s: Great Moderation</span>
            </div>
            <div className="flex items-center gap-s-2">
              <div className="h-3 w-3 rounded-sm bg-accent" />
              <span>2020s: Post-pandemic</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-s-8 grid gap-s-6 lg:grid-cols-3">
        <InfoBox type="info">
          <strong>The Phillips Curve Trade-Off</strong>
          <p>In the 1960s, economist A.W. Phillips found an inverse relationship: lower unemployment led to higher inflation. Policy makers thought they could choose points on this curve to maximize employment or minimize inflation.</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>The 1970s Problem: Stagflation</strong>
          <p>The Phillips Curve broke down. High inflation AND high unemployment coexisted (stagflation). Economists realized expectations matter: when workers expect inflation, they demand higher wages, shifting the entire curve.</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>Modern Understanding: NAIRU</strong>
          <p>The Non-Accelerating Inflation Rate of Unemployment (NAIRU) is the unemployment rate consistent with stable inflation. Below NAIRU, inflation rises. Above NAIRU, inflation falls. The curve shifts with expected inflation.</p>
        </InfoBox>

        <InfoBox type="info">
          <strong>Why Expectations Matter</strong>
          <p>When the Fed commits to low inflation and gains credibility, workers expect low inflation. Firms don't raise prices as aggressively. The Phillips Curve shifts down, allowing lower unemployment without runaway inflation.</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>Policy Implication: No Long-Run Trade-Off</strong>
          <p>In the long run, the Phillips Curve becomes vertical at the natural rate. Policymakers cannot permanently reduce unemployment below NAIRU via inflation—any attempt just raises expected inflation and shifts the curve.</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>Optimal Policy</strong>
          <p>Keep inflation expectations anchored near target via credible communication and follow-through. This keeps the Phillips Curve stable and predictable, allowing stable low inflation with sustainable employment.</p>
        </InfoBox>
      </div>

      <ToolNote label="Key Insights & Experiments" variant="insight">
        <ul>
          <li>
            <strong>Shift Expected Inflation:</strong> Increase π^e to 6%. Notice the entire curve shifts up. At
            the same unemployment rate, inflation is now 4% higher. Central bank credibility matters!
          </li>
          <li>
            <strong>Move along vs Shift:</strong> Changing current unemployment slides along the curve (movement).
            Changing expected inflation shifts the entire curve (shock).
          </li>
          <li>
            <strong>Natural Rate Effects:</strong> Increase u_n to 6%. This could reflect labor market changes
            (demographics, automation). The relationship between unemployment and inflation weakens.
          </li>
          <li>
            <strong>Sensitivity Parameter α:</strong> Higher α means stronger unemployment response to inflation.
            Low α (0.5) = weak trade-off. High α (2.0) = steep trade-off. Modern estimates: α ≈ 0.5-1.0.
          </li>
          <li>
            <strong>1970s Lesson:</strong> Oil shocks raised expected inflation sharply. The Phillips Curve shifted
            up massively, creating stagflation. No unemployment level could maintain stable inflation.
          </li>
          <li>
            <strong>2020s Challenge:</strong> Pandemic caused massive inflation expectations shock. Central banks
            had to raise rates aggressively to restore credibility and shift expectations back down.
          </li>
        </ul>
      </ToolNote>
    </div>
  )
}
