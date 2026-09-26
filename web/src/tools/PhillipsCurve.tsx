import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
  ComposedChart,
  Scatter,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

export default function PhillipsCurve() {
  const [expectedInflation, setExpectedInflation] = useState(2)
  const [naturalUnemployment, setNaturalUnemployment] = useState(4.5)
  const [philipsCurveAlpha, setPhilipsCurveAlpha] = useState(1.0)
  const [currentUnemployment, setCurrentUnemployment] = useState(5.0)
  const [showTraditional, setShowTraditional] = useState(true)
  const [showHistorical, setShowHistorical] = useState(true)
  const [comparisonMode, setComparisonMode] = useState(false)

  // Generate curve data points
  const generateCurveData = () => {
    const data = []
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
    { unemployment: 3.5, inflation: 3.5, period: '1960s', color: '#8b5cf6' },
    { unemployment: 4.0, inflation: 4.2, period: '1960s', color: '#8b5cf6' },
    { unemployment: 4.5, inflation: 5.0, period: '1960s', color: '#8b5cf6' },
    // 1970s: Stagflation breaks Phillips Curve
    { unemployment: 5.5, inflation: 8.5, period: '1970s', color: '#dc2626' },
    { unemployment: 6.0, inflation: 11.0, period: '1970s', color: '#dc2626' },
    { unemployment: 7.5, inflation: 9.5, period: '1970s', color: '#dc2626' },
    // 1980s: Volcker disinflation
    { unemployment: 8.0, inflation: 5.5, period: '1980s', color: '#059669' },
    { unemployment: 7.0, inflation: 4.2, period: '1980s', color: '#059669' },
    // 2000s: Great Moderation
    { unemployment: 4.5, inflation: 2.5, period: '2000s', color: '#0891b2' },
    { unemployment: 5.0, inflation: 3.0, period: '2000s', color: '#0891b2' },
    // 2020s: Pandemic/Post-pandemic
    { unemployment: 3.5, inflation: 3.5, period: '2020s', color: '#ea580c' },
    { unemployment: 4.0, inflation: 4.2, period: '2020s', color: '#ea580c' },
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
  const comparisonData = comparisonMode
    ? curveData.map((d) => ({
        ...d,
        lowExpectations: expectedInflation - 2 - philipsCurveAlpha * (d.unemployment - naturalUnemployment),
        highExpectations: expectedInflation + 2 - philipsCurveAlpha * (d.unemployment - naturalUnemployment),
      }))
    : curveData

  return (
    <div className="tool-card">
      <ToolHeader
        title="Phillips Curve Trade-Off"
        description="Explore the relationship between unemployment and inflation. From the 1960s Phillips Curve to modern expectations-augmented models, understand why central bank credibility matters for inflation control."
        badge="intermediate"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
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

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Button
            onClick={() => setShowTraditional(!showTraditional)}
            variant={showTraditional ? 'primary' : 'secondary'}
          >
            {showTraditional ? '📊 Traditional PC' : 'Expectations-Augmented PC'}
          </Button>
          <Button
            onClick={() => setShowHistorical(!showHistorical)}
            variant={showHistorical ? 'primary' : 'secondary'}
          >
            {showHistorical ? '📈 Hide Historical' : 'Show Historical'}
          </Button>
          <Button
            onClick={() => setComparisonMode(!comparisonMode)}
            variant={comparisonMode ? 'primary' : 'secondary'}
          >
            {comparisonMode ? '🔄 Comparison ON' : 'Comparison OFF'}
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatBox
          label="Current Unemployment"
          value={currentUnemployment.toFixed(1)}
          unit="%"
          highlight
        />
        <StatBox
          label="Implied Inflation"
          value={impliedInflation.toFixed(2)}
          unit="%"
          highlight
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
          highlight={Math.abs(inflationSurprise) > 0.5}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <InfoBox type="info">
          <strong>📌 What's shown:</strong> The{' '}
          {showTraditional ? (
            <>
              <span style={{ fontWeight: 'bold' }}>Traditional Phillips Curve</span> (1960s) assumes a
              stable trade-off: lower unemployment → higher inflation. Policy makers can permanently exploit this
              trade-off.
            </>
          ) : (
            <>
              <span style={{ fontWeight: 'bold' }}>Expectations-Augmented Phillips Curve</span> shows that
              inflation depends on both unemployment AND expected inflation. As expectations change (due to
              central bank credibility), the entire curve shifts.
            </>
          )}
        </InfoBox>
      </div>

      <div className="visualization-container">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          {showTraditional ? 'Traditional vs Expectations-Augmented Phillips Curves' : 'Phillips Curve Analysis'}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={comparisonMode ? comparisonData : curveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="unemployment"
              type="number"
              label={{ value: 'Unemployment Rate (%)', position: 'insideBottomRight', offset: -10 }}
              domain={[0, 10]}
            />
            <YAxis
              label={{ value: 'Inflation Rate (%)', angle: -90, position: 'insideLeft' }}
              domain={[-3, 10]}
            />
            <Tooltip
              formatter={(value) => (typeof value === 'number' ? `${value.toFixed(2)}%` : value)}
              labelFormatter={(label) => `Unemployment: ${label.toFixed(1)}%`}
            />
            <Legend />

            {showTraditional ? (
              <>
                <Line
                  type="monotone"
                  dataKey="traditional"
                  stroke="#8b5cf6"
                  name="Traditional PC (1960s)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="expectations"
                  stroke="#3b82f6"
                  name="Expectations-Augmented PC"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  isAnimationActive={true}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="expectations"
                  stroke="#3b82f6"
                  name={`Phillips Curve (π^e = ${expectedInflation.toFixed(1)}%)`}
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={true}
                />
                {comparisonMode && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="lowExpectations"
                      stroke="#10b981"
                      name="Low Expectations (π^e - 2%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      isAnimationActive={true}
                    />
                    <Line
                      type="monotone"
                      dataKey="highExpectations"
                      stroke="#dc2626"
                      name="High Expectations (π^e + 2%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                      isAnimationActive={true}
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
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Current Position"
            />

            {/* Natural rate vertical line */}
            <ReferenceDot
              x={naturalUnemployment}
              y={-2.5}
              r={3}
              fill="#6366f1"
              stroke="#6366f1"
              name={`Natural Rate (u_n = ${naturalUnemployment.toFixed(1)}%)`}
            />

            {/* Historical data overlay */}
            {showHistorical && (
              <Scatter
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
              </Scatter>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {showHistorical && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px' }}>
          <p style={{ fontSize: '0.875rem', color: '#0c4a6e', marginBottom: '0.5rem' }}>
            <strong>Historical Periods:</strong>
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#8b5cf6', borderRadius: '2px' }} />
              <span>1960s: Stable trade-off</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#dc2626', borderRadius: '2px' }} />
              <span>1970s: Stagflation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#059669', borderRadius: '2px' }} />
              <span>1980s: Disinflation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#0891b2', borderRadius: '2px' }} />
              <span>2000s: Great Moderation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ea580c', borderRadius: '2px' }} />
              <span>2020s: Post-pandemic</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>🔍 The Phillips Curve Trade-Off</strong>
          <p>In the 1960s, economist A.W. Phillips found an inverse relationship: lower unemployment led to higher inflation. Policy makers thought they could choose points on this curve to maximize employment or minimize inflation.</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ The 1970s Problem: Stagflation</strong>
          <p>The Phillips Curve broke down. High inflation AND high unemployment coexisted (stagflation). Economists realized expectations matter: when workers expect inflation, they demand higher wages, shifting the entire curve.</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✓ Modern Understanding: NAIRU</strong>
          <p>The Non-Accelerating Inflation Rate of Unemployment (NAIRU) is the unemployment rate consistent with stable inflation. Below NAIRU, inflation rises. Above NAIRU, inflation falls. The curve shifts with expected inflation.</p>
        </InfoBox>

        <InfoBox type="info">
          <strong>💡 Why Expectations Matter</strong>
          <p>When the Fed commits to low inflation and gains credibility, workers expect low inflation. Firms don't raise prices as aggressively. The Phillips Curve shifts down, allowing lower unemployment without runaway inflation.</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚡ Policy Implication: No Long-Run Trade-Off</strong>
          <p>In the long run, the Phillips Curve becomes vertical at the natural rate. Policymakers cannot permanently reduce unemployment below NAIRU via inflation—any attempt just raises expected inflation and shifts the curve.</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>🎯 Optimal Policy</strong>
          <p>Keep inflation expectations anchored near target via credible communication and follow-through. This keeps the Phillips Curve stable and predictable, allowing stable low inflation with sustainable employment.</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>📊 Key Insights & Experiments</h4>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#15803d' }}>
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
      </div>
    </div>
  )
}
