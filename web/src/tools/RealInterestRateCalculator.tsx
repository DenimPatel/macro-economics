import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

interface ScenarioData {
  scenario: string
  nominalRate: number
  inflationRate: number
  expectedInflation: number
  realRate: number
  expectedRealRate: number
}

interface TimeSeriesData {
  period: string
  nominalRate: number
  actualInflation: number
  expectedInflation: number
  realRate: number
  expectedRealRate: number
}

export default function RealInterestRateCalculator() {
  const [nominalRate, setNominalRate] = useState(3.5)
  const [actualInflation, setActualInflation] = useState(2.5)
  const [expectedInflation, setExpectedInflation] = useState(2.2)
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

  return (
    <div className="tool-card">
      <ToolHeader
        title="Real Interest Rate Calculator"
        description="Understand the Fisher Equation and why central banks care about real (not nominal) interest rates. Explore how inflation affects the real returns on savings and the real costs of borrowing. See why negative real rates can distort economic decisions."
        badge="intermediate"
      />

      <div className="control-panel">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
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

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
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

      {/* Key Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <StatBox label="Nominal Rate" value={activeNominal.toFixed(2)} unit="%" highlight />
        <StatBox label="Actual Inflation" value={activeActual.toFixed(2)} unit="%" />
        <StatBox label="Expected Inflation" value={activeExpected.toFixed(2)} unit="%" />
        <StatBox label="Real Rate (Actual)" value={realRate.toFixed(2)} unit="%" highlight />
        <StatBox label="Expected Real Rate" value={expectedRealRate.toFixed(2)} unit="%" highlight />
        <StatBox
          label="Inflation Surprise"
          value={(activeActual - activeExpected).toFixed(2)}
          unit="%"
          highlight={Math.abs(activeActual - activeExpected) > 0.5}
        />
      </div>

      {/* Fisher Equation Explanation */}
      <div style={{ marginBottom: '2rem' }}>
        <InfoBox type="info">
          <strong>📐 Fisher Equation:</strong>
          <br />
          <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', marginTop: '0.5rem', display: 'block' }}>
            Real Interest Rate (r) = Nominal Rate (i) − Inflation (π)
          </span>
          <br />
          The <strong>real interest rate</strong> measures the true economic cost of borrowing and benefit of
          saving, <strong>after accounting for inflation</strong>. A 5% nominal rate with 4% inflation only gives you
          1% real return!
        </InfoBox>
      </div>

      {/* Economic Implications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div
          style={{
            padding: '1rem',
            backgroundColor: realRate < 0 ? '#fee2e2' : '#dcfce7',
            border: `2px solid ${realRate < 0 ? '#fca5a5' : '#86efac'}`,
            borderRadius: '0.5rem',
          }}
        >
          <strong>💰 Borrowing Incentive:</strong>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{borrowingIncentive}</div>
          {realRate < 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontStyle: 'italic' }}>
              Negative real rates make borrowing highly attractive—you pay back less in real terms than you borrowed!
            </div>
          )}
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: realRate < 2 ? '#fef3c7' : '#e0e7ff',
            border: `2px solid ${realRate < 2 ? '#fcd34d' : '#a5b4fc'}`,
            borderRadius: '0.5rem',
          }}
        >
          <strong>🏦 Saving Incentive:</strong>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>{savingIncentive}</div>
          {realRate < 0 && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', fontStyle: 'italic' }}>
              Negative real rates punish savers—your money loses purchasing power!
            </div>
          )}
        </div>

        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            border: '2px solid #0ea5e9',
            borderRadius: '0.5rem',
          }}
        >
          <strong>📊 Real vs. Expected:</strong>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            {Math.abs(activeActual - activeExpected) < 0.5
              ? '✓ Inflation close to expectations (good forecasting)'
              : `✗ Inflation ${
                  activeActual > activeExpected ? 'higher' : 'lower'
                } than expected (unexpected changes hurt planning)`}
          </div>
        </div>
      </div>

      {/* Fisher Equation Visualization */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          How Real Rates Change with Nominal Rates (at current {activeActual.toFixed(1)}% inflation)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={nominalComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="nominalRate"
              type="number"
              label={{ value: 'Nominal Interest Rate (%)', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              label={{ value: 'Real Interest Rate (%)', angle: -90, position: 'insideLeft' }}
              domain={[-5, 8]}
            />
            <Tooltip
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : value)}
              labelFormatter={(label) => `Nominal Rate: ${label.toFixed(1)}%`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="realRateActual"
              stroke="#ef4444"
              name={`Real Rate = i − ${activeActual.toFixed(1)}%`}
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="realRateExpected"
              stroke="#3b82f6"
              name={`Expected Real Rate = i − ${activeExpected.toFixed(1)}%`}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scenario Comparison */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Real Rates Across Economic Scenarios
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={scenarioComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="scenario"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Interest Rate (%)', angle: -90, position: 'insideLeft' }}
              domain={[-6, 6]}
            />
            <Tooltip
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(1)}%` : value)}
              labelFormatter={(label) => `Scenario: ${label}`}
            />
            <Legend />
            <Bar dataKey="nominalRate" fill="#0ea5e9" name="Nominal Rate" />
            <Bar dataKey="inflationRate" fill="#f97316" name="Inflation Rate" />
            <Bar dataKey="realRate" fill="#10b981" name="Real Rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Historical Context */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Historical Real Interest Rates
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -10 }}
            />
            <YAxis
              label={{ value: 'Interest Rate (%)', angle: -90, position: 'insideLeft' }}
              domain={[-6, 6]}
            />
            <Tooltip
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : value)}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="realRate"
              fill="#ef4444"
              stroke="#dc2626"
              name="Actual Real Rate"
              opacity={0.3}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="nominalRate"
              stroke="#0ea5e9"
              name="Nominal Rate"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={true}
            />
            <Line
              type="monotone"
              dataKey="actualInflation"
              stroke="#f97316"
              name="Inflation"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          <strong>Key Observations:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
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
        </div>
      </div>

      {/* Educational Content */}
      <div style={{ marginBottom: '1rem' }}>
        <InfoBox type="warning">
          <strong>⚡ Why Real Rates Matter for Economic Decisions:</strong>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
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
        <InfoBox type="info">
          <strong>📚 Expected vs. Actual Real Rates:</strong>
          <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
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
