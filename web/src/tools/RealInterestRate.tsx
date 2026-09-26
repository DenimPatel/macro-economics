import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

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
    if (rate < 5) return { label: 'Attractive', color: '#10b981' }
    if (rate <= 7) return { label: 'Moderate', color: '#f59e0b' }
    return { label: 'Expensive', color: '#ef4444' }
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatBox label="Nominal Rate (i)" value={nominalRate.toFixed(1)} unit="%" />
        <StatBox label="Expected Inflation (π^e)" value={expectedInflation.toFixed(1)} unit="%" />
        <StatBox label="Real Interest Rate (r)" value={realRate.toFixed(1)} unit="%" highlight />
        <StatBox label="Cost Assessment" value={costLevel.label} />
      </div>

      {/* Fisher Equation Explanation */}
      <div style={{ marginBottom: '2rem' }}>
        <InfoBox type="info">
          <strong>Fisher Equation: r = i - π^e</strong>
          <br />
          Your nominal rate ({nominalRate.toFixed(1)}%) minus expected inflation ({expectedInflation.toFixed(1)}%) equals a real rate of{' '}
          <strong>{realRate.toFixed(1)}%</strong>. This is what savers actually earn and what borrowers truly pay in
          purchasing power terms.
        </InfoBox>
      </div>

      {/* Investment Decision Indicator */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: isAttractive ? '#dcfce7' : '#fee2e2',
          borderLeft: `4px solid ${isAttractive ? '#16a34a' : '#dc2626'}`,
          borderRadius: '4px',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: isAttractive ? '#16a34a' : '#dc2626',
              minWidth: '60px',
            }}
          >
            {investmentDecision}
          </div>
          <div>
            <div style={{ fontWeight: '600', color: isAttractive ? '#15803d' : '#991b1b', marginBottom: '0.25rem' }}>
              Investment Decision
            </div>
            <div style={{ fontSize: '0.875rem', color: isAttractive ? '#15803d' : '#7f1d1d' }}>
              {investmentReason}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '0.85rem', color: isAttractive ? '#166534' : '#7f1d1d', fontStyle: 'italic' }}>
          Firms compare the real interest rate (their borrowing cost) to expected project returns. When real rates are
          low, projects become more attractive.
        </div>
      </div>

      {/* Comparison Mode Selection */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.75rem', color: '#1e293b' }}>
            Compare Scenarios:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            <button
              onClick={() => setComparisonMode('none')}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `2px solid ${comparisonMode === 'none' ? '#3b82f6' : '#cbd5e1'}`,
                backgroundColor: comparisonMode === 'none' ? '#eff6ff' : '#f8fafc',
                color: comparisonMode === 'none' ? '#1e40af' : '#64748b',
                fontWeight: comparisonMode === 'none' ? '600' : '500',
                cursor: 'pointer',
              }}
            >
              No Comparison
            </button>
            <button
              onClick={() => setComparisonMode('same-real')}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `2px solid ${comparisonMode === 'same-real' ? '#3b82f6' : '#cbd5e1'}`,
                backgroundColor: comparisonMode === 'same-real' ? '#eff6ff' : '#f8fafc',
                color: comparisonMode === 'same-real' ? '#1e40af' : '#64748b',
                fontWeight: comparisonMode === 'same-real' ? '600' : '500',
                cursor: 'pointer',
              }}
            >
              Same Real Rate
            </button>
            <button
              onClick={() => setComparisonMode('same-nominal')}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `2px solid ${comparisonMode === 'same-nominal' ? '#3b82f6' : '#cbd5e1'}`,
                backgroundColor: comparisonMode === 'same-nominal' ? '#eff6ff' : '#f8fafc',
                color: comparisonMode === 'same-nominal' ? '#1e40af' : '#64748b',
                fontWeight: comparisonMode === 'same-nominal' ? '600' : '500',
                cursor: 'pointer',
              }}
            >
              Same Nominal Rate
            </button>
            <button
              onClick={() => setComparisonMode('historical')}
              style={{
                padding: '0.75rem',
                borderRadius: '6px',
                border: `2px solid ${comparisonMode === 'historical' ? '#3b82f6' : '#cbd5e1'}`,
                backgroundColor: comparisonMode === 'historical' ? '#eff6ff' : '#f8fafc',
                color: comparisonMode === 'historical' ? '#1e40af' : '#64748b',
                fontWeight: comparisonMode === 'historical' ? '600' : '500',
                cursor: 'pointer',
              }}
            >
              Historical
            </button>
          </div>
        </div>

        {/* Scenario Comparison Visualization */}
        {comparisonMode !== 'none' && comparisonData.length > 0 && (
          <div className="visualization-container">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
              {comparisonMode === 'same-real'
                ? 'Same Real Rate (3%), Different Nominal + Inflation'
                : comparisonMode === 'same-nominal'
                  ? 'Same Nominal Rate (5%), Different Inflation Expectations'
                  : 'Historical Real Interest Rates'}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
                <Legend />
                {comparisonMode !== 'historical' && (
                  <>
                    <Bar dataKey="nominal" fill="#3b82f6" name="Nominal Rate" />
                    <Bar dataKey="inflation" fill="#f59e0b" name="Expected Inflation" />
                  </>
                )}
                <Bar dataKey="real" fill="#10b981" name="Real Rate" />
              </BarChart>
            </ResponsiveContainer>

            {/* Comparison Insights */}
            <div style={{ marginTop: '1.5rem' }}>
              {comparisonMode === 'same-real' && (
                <InfoBox type="success">
                  <strong>Key Insight:</strong> Even though nominal rates differ, all three scenarios produce a 3% real
                  rate. Firms care about REAL borrowing costs, not nominal rates. A 6% nominal rate with 3% inflation
                  is equivalent to 3% nominal with 0% inflation—both cost the same in real terms.
                </InfoBox>
              )}
              {comparisonMode === 'same-nominal' && (
                <InfoBox type="warning">
                  <strong>Inflation Expectations Matter:</strong> The same 5% nominal rate yields different real rates
                  (3%, 1%, -1%) depending on inflation expectations. If people expect 6% inflation, the real cost of
                  borrowing becomes NEGATIVE—lenders actually pay borrowers in real terms! This happened during the
                  1970s stagflation.
                </InfoBox>
              )}
              {comparisonMode === 'historical' && (
                <InfoBox type="info">
                  <strong>Historical Context:</strong> Notice the 2010s: 0.25% nominal with 1.5% inflation created a
                  -1.25% real rate. Savers were being punished! This low-rate regime (2008-2021) boosted asset prices
                  (wealth effect) but squeezed savers. By 2023, the Fed raised rates to fight inflation, normalizing
                  real rates.
                </InfoBox>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Historical Real Rates Timeline */}
      <div className="visualization-container">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Historical Real Interest Rates (1950s–2023)
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={historicalContext}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: number) => value.toFixed(2)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="nominal"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Nominal Rate"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="inflation"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Inflation"
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="real"
              stroke="#10b981"
              strokeWidth={3}
              name="Real Rate"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Educational Insights Section */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>🏦 Why SVB Failed (2023)</h4>
          <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
            SVB locked in low-coupon bonds when real rates were negative (2010s). When real rates rose from -1% to
            +2%, bond values plummeted. The bank faced a real rate squeeze: liabilities (deposits) now demanded higher
            returns than their assets could provide.
          </p>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '6px', borderLeft: '4px solid #ca8a04' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontWeight: '600' }}>📊 Wealth Effect & Asset Prices</h4>
          <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#854d0e', lineHeight: '1.5' }}>
            Low real rates → Lower discount rates → Higher stock/real estate prices. When real rates rise, asset
            valuations fall. This is how Fed policy transmits to household wealth and consumption. Higher real rates
            make future cash flows worth less in today's dollars.
          </p>
        </div>

        <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #16a34a' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#15803d', fontWeight: '600' }}>💰 Savers vs. Borrowers</h4>
          <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#15803d', lineHeight: '1.5' }}>
            Negative real rates (like 2010s) punish savers but help borrowers. Retired people living on savings lose
            purchasing power. Young borrowers (students, first-time homebuyers) thrive. Positive real rates reverse
            this: savers benefit, but debt becomes expensive.
          </p>
        </div>
      </div>

      {/* Fisher Equation Deep Dive */}
      <div style={{ marginTop: '2rem' }}>
        <InfoBox type="info">
          <strong>The Fisher Equation in Action:</strong>
          <br />
          <br />
          <strong>Scenario 1: Current Market</strong> - Nominal: {nominalRate.toFixed(1)}%, Inflation: {expectedInflation.toFixed(1)}% →
          Real: <strong>{realRate.toFixed(1)}%</strong>
          {realRate < 0 && ' (NEGATIVE! Lenders lose to inflation)'}
          {realRate > 7 && ' (HIGH! Investment becomes expensive)'}
          <br />
          <br />
          <strong>Policy Insight:</strong> Central banks can't directly control real rates—only nominal rates. Real
          rates depend on expectations. If the Fed raises nominal rates but inflation expectations rise equally, real
          rates stay flat. This happened in the 1970s when inflation expectations became unanchored.
          <br />
          <br />
          <strong>Forward Guidance:</strong> Modern central banks shape real rates by managing inflation <em>expectations</em>.
          If people believe the Fed will keep inflation at 2%, expected inflation stays low, real rates rise when the
          Fed tightens. This credibility is everything.
        </InfoBox>
      </div>
    </div>
  )
}
