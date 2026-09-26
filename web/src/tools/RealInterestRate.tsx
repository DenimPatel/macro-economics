import { useState } from 'react'
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  ToolHeader,
  ToolNote,
  SliderControl,
  StatBox,
  InfoBox,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

interface Scenario {
  name: string
  nominal: number
  inflation: number
}

export default function RealInterestRate() {
  // Main scenario controls
  const [nominalRate, setNominalRate] = useState(6)
  const [expectedInflation, setExpectedInflation] = useState(3)
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
        title="Real Interest Rate Calculator"
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

      {/* Fisher Equation Results */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox label="Nominal Rate (i)" value={nominalRate.toFixed(1)} unit="%" />
        <StatBox label="Expected Inflation (π^e)" value={expectedInflation.toFixed(1)} unit="%" />
        <StatBox label="Real Interest Rate (r)" value={realRate.toFixed(1)} unit="%" tone="accent" />
        <StatBox label="Cost Assessment" value={costLevel.label} tone={costLevel.tone} />
      </div>

      {/* Fisher Equation Explanation */}
      <div className="mb-8">
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
      <ToolNote
        label="Investment decision"
        variant={isAttractive ? 'insight' : 'warning'}
        title="Project viability at the current real rate"
      >
        <div className="mb-3 flex items-center gap-4">
          <span
            className={`text-display-sm font-bold tabular-nums ${
              isAttractive ? 'text-tier-beginner-ink' : 'text-tier-case-ink'
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
      <div className="mb-8">
        <div className="mb-3">
          <span className="control-label mb-3 block">Compare Scenarios</span>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
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
                className={`rounded-card border-2 p-3 font-medium transition-colors ${
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
            <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">
              {comparisonMode === 'same-real'
                ? 'Same Real Rate (3%), Different Nominal + Inflation'
                : comparisonMode === 'same-nominal'
                  ? 'Same Nominal Rate (5%), Different Inflation Expectations'
                  : 'Historical Real Interest Rates'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="name" {...chartTheme.axis} />
                <YAxis
                  label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
                  {...chartTheme.axis}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => value.toFixed(2)}
                />
                <Legend {...chartTheme.legend} />
                {comparisonMode !== 'historical' && (
                  <>
                    <ChartBar dataKey="nominal" fill={chartColor(0)} name="Nominal Rate" />
                    <ChartBar dataKey="inflation" fill={chartColor(2)} name="Expected Inflation" />
                  </>
                )}
                <ChartBar dataKey="real" fill={chartColor(1)} name="Real Rate" />
              </BarChart>
            </ResponsiveContainer>

            {/* Comparison Insights */}
            <div className="mt-6">
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
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-fg">
          Historical Real Interest Rates (1950s–2023)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={historicalContext} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis dataKey="period" {...chartTheme.axis} />
            <YAxis
              label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend {...chartTheme.legend} />
            <ChartLine
              type="monotone"
              dataKey="nominal"
              stroke={chartColor(0)}
              strokeWidth={2}
              name="Nominal Rate"
              connectNulls
            />
            <ChartLine
              type="monotone"
              dataKey="inflation"
              stroke={chartColor(2)}
              strokeWidth={2}
              name="Inflation"
              connectNulls
            />
            <ChartLine
              type="monotone"
              dataKey="real"
              stroke={chartColor(1)}
              strokeWidth={3}
              name="Real Rate"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Educational Insights Section */}
      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
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
      <div className="mt-8">
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
