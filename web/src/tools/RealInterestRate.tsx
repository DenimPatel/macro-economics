import { useState } from 'react'
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, ReferenceLine } from 'recharts'
import { ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
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

interface Scenario {
  name: string
  nominal: number
  inflation: number
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
  nominalRate: 6,
  expectedInflation: 3,
}

export default function RealInterestRate() {
  const compare = useHiddenSeries(['nominal', 'inflation', 'real'])
  const history = useHiddenSeries(['nominalH', 'inflationH', 'realH'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  // Main scenario controls
const [nominalRate, setNominalRate] = useState(DEFAULTS.nominalRate)
const [expectedInflation, setExpectedInflation] = useState(DEFAULTS.expectedInflation)

  const { reset, dirty } = useToolReset(
    {
    nominalRate: nominalRate,
    expectedInflation: expectedInflation,
    },
    {
      setNominalRate,
      setExpectedInflation,
    },
    {
      nominalRate: DEFAULTS.nominalRate,
      expectedInflation: DEFAULTS.expectedInflation,
    },
  )
  const [comparisonMode, setComparisonMode] = useState<'none' | 'same-real' | 'same-nominal' | 'historical'>('none')

  // Calculated values using Fisher Equation: r = i - π^e
  const realRate = nominalRate - expectedInflation

  // Investment decision logic
  const projectReturn = 5
  const isAttractive = realRate < projectReturn
  const investmentDecision = isAttractive ? 'GO' : 'NO-GO'
  const investmentReason = isAttractive
    ? `Real rate (${realRate.toFixed(1)}%) < Project return (${projectReturn}%) → Project is profitable`
    : `Real rate (${realRate.toFixed(1)}%) ≥ Project return (${projectReturn}%) → Better to invest in bonds`

  // Cost classification
  const getCostLevel = (rate: number) => {
    if (rate < 5) return { label: 'Attractive', tone: 'positive' as const }
    if (rate <= 7) return { label: 'Moderate', tone: 'caution' as const }
    return { label: 'Expensive', tone: 'negative' as const }
  }

  const costLevel = getCostLevel(realRate)

  // Scenario comparison data
  const sameRealScenarios: Scenario[] = [
    { name: '6% + 3% inflation', nominal: 6, inflation: 3 },
    { name: '3% + 0% inflation', nominal: 3, inflation: 0 },
    { name: '5% + 2% inflation', nominal: 5, inflation: 2 },
  ]

  const sameNominalScenarios: Scenario[] = [
    { name: 'Low inflation', nominal: 5, inflation: 2 },
    { name: 'Moderate inflation', nominal: 5, inflation: 4 },
    { name: 'High inflation', nominal: 5, inflation: 6 },
  ]

  const historicalScenarios: Scenario[] = [
    { name: '1950s (Cheap Money)', nominal: 2.5, inflation: 2 },
    { name: '2010s (Negative Real)', nominal: 0.25, inflation: 1.5 },
    { name: '2023 (Normalized)', nominal: 5, inflation: 4 },
  ]

  const getScenarioData = () => {
    let scenarios: Scenario[] = []
    if (comparisonMode === 'same-real') {
      scenarios = sameRealScenarios
    } else if (comparisonMode === 'same-nominal') {
      scenarios = sameNominalScenarios
    } else if (comparisonMode === 'historical') {
      scenarios = historicalScenarios
    }

    return scenarios.map((s) => ({
      ...s,
      real: s.nominal - s.inflation,
    }))
  }

  const comparisonData = getScenarioData()

  // Historical context data for line chart
  const historicalContext = [
    { period: '1950s', nominal: 2.5, inflation: 2, real: 0.5 },
    { period: '1960s', nominal: 5, inflation: 2.2, real: 2.8 },
    { period: '1970s', nominal: 9, inflation: 7, real: 2 },
    { period: '1980s', nominal: 14, inflation: 5.5, real: 8.5 },
    { period: '1990s', nominal: 5.5, inflation: 2.9, real: 2.6 },
    { period: '2000s', nominal: 3.5, inflation: 2.7, real: 0.8 },
    { period: '2010s', nominal: 0.25, inflation: 1.5, real: -1.25 },
    { period: '2023', nominal: 5, inflation: 4, real: 1 },
  ]

  return (
    <div className="tool-card">
      <ToolHeader
        title="Real Interest Rate"
        description="Master the Fisher Equation (r = i - π^e) and understand how nominal rates, inflation expectations, and real rates shape investment decisions, wealth effects, and monetary policy transmission."
        badge="intermediate"
      />

      {/* Main Controls Section */}
      <div className="control-panel">
        <SliderControl
          label="Nominal Interest Rate (i)"
          value={nominalRate}
          min={-2}
          max={10}
          step={0.5}
          onChange={setNominalRate}
          unit="%"
        />
        <SliderControl
          label="Expected Inflation (π^e)"
          value={expectedInflation}
          min={-2}
          max={8}
          step={0.5}
          onChange={setExpectedInflation}
          unit="%"
        />
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      {/* Fisher Equation Results */}
      <div className="mb-s-3 grid grid-cols-2 gap-s-3 lg:grid-cols-4">
        <StatBox label="Nominal Rate (i)" value={nominalRate.toFixed(1)} unit="%" />
        <StatBox label="Expected Inflation (π^e)" value={expectedInflation.toFixed(1)} unit="%" />
        <StatBox label="Real Interest Rate (r)" value={realRate.toFixed(1)} unit="%" tone="accent" />
        <StatBox label="Cost Assessment" value={costLevel.label} tone={costLevel.tone} />
      </div>

      {/*
       * The caption the four tiles above were missing, and the reason it has
       * to sit here rather than under a chart: this tile row is the top of the
       * page, so the chart nearest `r` is the historical one further down, and
       * a reader who cannot tell from the tile that `r` is marked three
       * hundred pixels below is exactly the reader this is for.
       *
       * So it names where each of the four is. `i` and `π^e` are route 2 of
       * the rule — they restate the two sliders, and a slider prints its own
       * value under its track, so the number and the thing that produced it
       * are side by side. `r` is route 1: a dashed mark on the historical
       * chart. `Cost Assessment` is a VERDICT rather than a number, which is
       * why it has no counterpart to look for.
       */}
      <TileReadout>
        i = {nominalRate.toFixed(1)}% and π^e = {expectedInflation.toFixed(1)}% are
        the two sliders above, and each prints its own value under its track.
        r = {realRate.toFixed(1)}% is not a slider: it is the dashed `r` line
        on the historical chart at the bottom of this page, which is where the
        reader can see it against the recorded path. Cost Assessment
        is a verdict on that r against a 5% hurdle, not a rate — the bands
        are under 5% (attractive), 5–7% (moderate) and over 7% (expensive).
      </TileReadout>
      <div className="mb-s-8" />

      {/* Fisher Equation Explanation */}
      <div className="mb-s-8">
        <InfoBox type="info" title="Fisher Equation: r = i − π^e">
          <p>
            Your nominal rate ({nominalRate.toFixed(1)}%) minus expected inflation (
            {expectedInflation.toFixed(1)}%) equals a real rate of{' '}
            <strong>{realRate.toFixed(1)}%</strong>. This is what savers actually earn and what
            borrowers truly pay in purchasing power terms.
          </p>
        </InfoBox>
      </div>

      {/* Investment Decision Indicator */}
      {/*
       * The verdict wears a STATUS ink, not a tier ink. The four tier values
       * are one ordinal azure ramp and they mean how hard a lecture is; this
       * number means whether a project clears its hurdle rate, and reading it
       * as "beginner-level" is the reader being told a fact about the
       * economics with a vocabulary that has nothing to do with it. `ok` and
       * `bad` are the tokens for a pass and a fail, and the note around it
       * already switches between the insight and warning variants to say the
       * same thing twice.
       */}
      <ToolNote
        headingLevel={2}
        label="Investment decision"
        variant={isAttractive ? 'insight' : 'warning'}
        title="Project viability at the current real rate"
      >
        <div className="mb-s-3 flex items-center gap-s-4">
          <span
            className={`text-display-sm font-bold tabular-nums ${
              isAttractive ? 'text-ok-ink' : 'text-bad-ink'
            }`}
          >
            {investmentDecision}
          </span>
          <div>
            <p className="font-semibold text-fg">vs. a {projectReturn}% project return</p>
            <p className="text-sm">{investmentReason}</p>
          </div>
        </div>
        <p className="text-sm italic opacity-90">
          Firms compare the real interest rate (their borrowing cost) to expected project returns. When
          real rates are low, projects become more attractive.
        </p>
      </ToolNote>

      {/* Comparison Mode Selection */}
      <div className="mb-s-8">
        <div className="mb-s-3">
          <span className="control-label mb-s-3 block">Compare Scenarios</span>
          <div className="grid grid-cols-2 gap-s-2 lg:grid-cols-4">
            {(
              [
                ['none', 'No Comparison'],
                ['same-real', 'Same Real Rate'],
                ['same-nominal', 'Same Nominal Rate'],
                ['historical', 'Historical'],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setComparisonMode(mode)}
                aria-pressed={comparisonMode === mode}
                className={`rounded-card border-2 p-s-3 font-medium transition-colors ${
                  comparisonMode === mode
                    ? 'border-accent bg-accent/10 text-accent-ink'
                    : 'border-border bg-surface text-fg-muted hover:border-accent/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario Comparison Visualization */}
        {comparisonMode !== 'none' && comparisonData.length > 0 && (
          <div className="visualization-container">
            <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
              {comparisonMode === 'same-real'
                ? 'Same Real Rate (3%), Different Nominal + Inflation'
                : comparisonMode === 'same-nominal'
                  ? 'Same Nominal Rate (5%), Different Inflation Expectations'
                  : 'Historical Real Interest Rates'}
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={comparisonData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="name" {...chartTheme.axis} includeHidden />
                <YAxis
                  key={chartTheme.axisKey('y')}
                  label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
                  {...chartTheme.yAxis}
                  includeHidden
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => value.toFixed(2)}
                />
                {comparisonMode !== 'historical' && (
                  <>
                    <ChartBar hide={compare.isHidden('nominal')} dataKey="nominal" fill={chartColor(0)} name="Nominal Rate" />
                    <ChartBar hide={compare.isHidden('inflation')} dataKey="inflation" fill={chartColor(2)} name="Expected Inflation" />
                  </>
                )}
                <ChartBar hide={compare.isHidden('real')} dataKey="real" fill={chartColor(1)} name="Real Rate" />
              </BarChart>
            </ResponsiveContainer>
            <ChartLegend
              items={[
                { key: 'nominal', label: 'Nominal Rate', color: chartColor(0) },
                { key: 'inflation', label: 'Expected Inflation', color: chartColor(2) },
                { key: 'real', label: 'Real Rate', color: chartColor(1) },
              ]}
              hidden={compare.hidden}
              onToggle={compare.toggle}
              onShowAll={compare.showAll}
            />
            <TileReadout>
              The three scenarios are fixed, and none of them is your setting
              unless you have set it to one of them: your own r ={' '}
              {realRate.toFixed(1)}% is the dashed line on the historical chart
              below, and the bars here are the comparison cases the buttons
              above name. Hiding a bar changes what is drawn, never what the
              tile says.
            </TileReadout>

            {/* Comparison Insights */}
            <div className="mt-s-6">
              {comparisonMode === 'same-real' && (
                <InfoBox type="success" title="Key insight">
                  <p>
                    Even though nominal rates differ, all three scenarios produce a 3% real rate. Firms
                    care about REAL borrowing costs, not nominal rates. A 6% nominal rate with 3%
                    inflation is equivalent to 3% nominal with 0% inflation&mdash;both cost the same in
                    real terms.
                  </p>
                </InfoBox>
              )}
              {comparisonMode === 'same-nominal' && (
                <InfoBox type="warning" title="Inflation expectations matter">
                  <p>
                    The same 5% nominal rate yields different real rates (3%, 1%, -1%) depending on
                    inflation expectations. If people expect 6% inflation, the real cost of borrowing
                    becomes NEGATIVE&mdash;lenders actually pay borrowers in real terms! This happened
                    during the 1970s stagflation.
                  </p>
                </InfoBox>
              )}
              {comparisonMode === 'historical' && (
                <InfoBox type="info" title="Historical context">
                  <p>
                    Notice the 2010s: 0.25% nominal with 1.5% inflation created a -1.25% real rate. Savers
                    were being punished! This low-rate regime (2008-2021) boosted asset prices (wealth
                    effect) but squeezed savers. By 2023, the Fed raised rates to fight inflation,
                    normalizing real rates.
                  </p>
                </InfoBox>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Historical Real Rates Timeline */}
      <div className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Historical Real Interest Rates (1950s–2023)
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={historicalContext} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')} dataKey="period" {...chartTheme.axis} includeHidden />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            <ChartLine
              type="monotone"
              hide={history.isHidden('nominalH')}
              dataKey="nominal"
              stroke={chartColor(0)}
              strokeWidth={2}
              name="Nominal Rate"
              connectNulls
            />
            <ChartLine
              type="monotone"
              hide={history.isHidden('inflationH')}
              dataKey="inflation"
              stroke={chartColor(2)}
              strokeWidth={2}
              name="Inflation"
              connectNulls
            />
            <ChartLine
              type="monotone"
              hide={history.isHidden('realH')}
              dataKey="real"
              stroke={chartColor(1)}
              strokeWidth={3}
              name="Real Rate"
              connectNulls
            />
            {/*
             * The reader's own real rate, as a MARK on the recorded path.
             *
             * The defect this replaces: the tile reads "Real Interest Rate (r)
             * −10.0 %" and the only chart on the page is a 1950s–2023 average
             * whose y axis runs about −5 to 15, so at i = −2 and π^e = 8 the
             * number the tool leads with was not on the page anywhere. Widening
             * the axis to −12 to make room for it was rejected: an axis that
             * runs to −12 because a slider is at −10 is a claim about the
             * record, and the record's lowest decade average is −1.25.
             *
             * Three things keep the mark from claiming that −10% is an
             * observation:
             *
             *  1. DASHED, from `chartTheme.reference`, which the baseline test
             *     holds distinct from `chartTheme.baseline` for exactly this
             *     reason — a fact about the data is a solid line, an annotation
             *     on the data is a dashed one, and they are still tellable apart
             *     when a reader cannot separate the two greys.
             *  2. The label says whose it is. "Your r" cannot be mistaken for a
             *     decade, and `insideTopLeft` starts the text at the line's left
             *     end — which for a horizontal line is the plot's left edge — so
             *     it cannot leave the frame at the right at any width.
             *  3. `ifOverflow: 'extendDomain'`, and this is the load-bearing
             *     half. Recharts' default is `discard`, which DELETES the whole
             *     line when its value is off the scale — no rule, no label,
             *     nothing in the accessibility tree — so without this the mark
             *     would exist at exactly the settings that need it most and
             *     vanish above r = 15. The axis therefore stretches only as far
             *     as the reader's own setting requires, and at the defaults
             *     (r = 3, inside the recorded range) it does not move at all.
             *     That is the trade being made: a reader who drives r to −10
             *     sees a history drawn in the top two thirds of the frame, and
             *     the caption below says why. The alternative — a mark that is
             *     silently absent — is the defect.
             */}
            <ReferenceLine
              y={realRate}
              {...chartTheme.reference}
              ifOverflow="extendDomain"
              label={{
                /* `r = X%` and not "Your r = X%": MEASURED, the longer label
                 * is 88.5px against a plot of 71.8px at 320px/130%, and an
                 * `inside*Left` anchor starts at the PLOT's left edge, so the
                 * 19.5px it does not fit leaves the SVG — 13.7px of it, in
                 * light and dark. `insideTopRight` would move the overhang to
                 * the left, where it lands on the y tick labels instead of
                 * off the page; there is no side that puts 88.5px inside 71.8.
                 *
                 * So the label is 59px and the CAPTION is what says whose it
                 * is, which is the right way round anyway: the mark carries the
                 * symbol and the number, and the prose says that the symbol is
                 * the reader's own setting rather than a decade. `r` is the
                 * tile's own symbol — "Real Interest Rate (r)" — so the two
                 * readings of the mark are the same reading of the same
                 * letter. */
                value: `r = ${realRate.toFixed(1)}%`,
                position: 'insideTopLeft',
                fill: chartColor(0),
                fontSize: 12,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'nominalH', label: 'Nominal Rate', color: chartColor(0) },
            { key: 'inflationH', label: 'Inflation', color: chartColor(2) },
            { key: 'realH', label: 'Real Rate', color: chartColor(1) },
          ]}
          hidden={history.hidden}
          onToggle={history.toggle}
          onShowAll={history.showAll}
        />
        <TileReadout>
          The three lines are decade averages, and the dashed `r` line is not
          one of them. It is the reader's OWN real rate — the same `r` the tile
          at the top of this page reports, at {realRate.toFixed(1)}% — drawn
          here so the reader can see how far it sits from the recorded path
          rather than having to hold it in their head. It is a threshold and
          not an observation: dashed, which is how every threshold on this
          site is drawn and how `chartTheme.reference` differs from
          `chartTheme.baseline`, and carrying no decade, no quarter and no
          series name. The y axis stretches to reach it only when the setting is
          outside the recorded range, which is why it can read below −1.25% and
          why no decade's average does — the nearest recorded real rate is the
          2010s at −1.25%, and at the defaults this r of{' '}
          {realRate.toFixed(1)}% sits between the 2000s and the 1990s.
        </TileReadout>
      </div>

      {/* Educational Insights Section */}
      <div className="mt-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-3">
        <ToolNote label="Case study" variant="warning" title="Why SVB failed (2023)">
          <p>
            SVB locked in low-coupon bonds when real rates were negative (2010s). When real rates rose
            from -1% to +2%, bond values plummeted. The bank faced a real rate squeeze: liabilities
            (deposits) now demanded higher returns than their assets could provide.
          </p>
        </ToolNote>

        <ToolNote label="Markets" variant="insight" title="Wealth effect & asset prices">
          <p>
            Low real rates → Lower discount rates → Higher stock/real estate prices. When real rates
            rise, asset valuations fall. This is how Fed policy transmits to household wealth and
            consumption. Higher real rates make future cash flows worth less in today's dollars.
          </p>
        </ToolNote>

        <ToolNote label="Distribution" variant="info" title="Savers vs. borrowers">
          <p>
            Negative real rates (like 2010s) punish savers but help borrowers. Retired people living on
            savings lose purchasing power. Young borrowers (students, first-time homebuyers) thrive.
            Positive real rates reverse this: savers benefit, but debt becomes expensive.
          </p>
        </ToolNote>
      </div>

      {/* Fisher Equation Deep Dive */}
      <div className="mt-s-8">
        <InfoBox type="info" title="The Fisher Equation in Action">
          <p>
            <strong>Scenario 1: Current Market</strong> — Nominal: {nominalRate.toFixed(1)}%,
            Inflation: {expectedInflation.toFixed(1)}% → Real:{' '}
            <strong>{realRate.toFixed(1)}%</strong>
            {realRate < 0 && ' (NEGATIVE! Lenders lose to inflation)'}
            {realRate > 7 && ' (HIGH! Investment becomes expensive)'}
          </p>
          <p>
            <strong>Policy Insight:</strong> Central banks can't directly control real rates—only
            nominal rates. Real rates depend on expectations. If the Fed raises nominal rates but
            inflation expectations rise equally, real rates stay flat. This happened in the 1970s when
            inflation expectations became unanchored.
          </p>
          <p>
            <strong>Forward Guidance:</strong> Modern central banks shape real rates by managing
            inflation <em>expectations</em>. If people believe the Fed will keep inflation at 2%,
            expected inflation stays low, real rates rise when the Fed tightens. This credibility is
            everything.
          </p>
        </InfoBox>
      </div>
    </div>
  )
}
