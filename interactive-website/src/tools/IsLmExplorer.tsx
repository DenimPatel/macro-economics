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
  ScatterChart,
  Scatter,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'
import { formatNumber } from '../utils/calculations'

export default function IsLmExplorer() {
  // Scenario A parameters
  const [G_a, setG_a] = useState(100)
  const [T_a, setT_a] = useState(50)
  const [M_a, setM_a] = useState(150)
  const [P_a, setP_a] = useState(1.0)
  const [I0_a, setI0_a] = useState(50)

  // Scenario B parameters
  const [G_b, setG_b] = useState(120)
  const [T_b, setT_b] = useState(50)
  const [M_b, setM_b] = useState(150)
  const [P_b, setP_b] = useState(1.0)
  const [I0_b, setI0_b] = useState(50)

  // Model parameters (constant)
  const C0 = 40
  const alpha = 0.4 // Investment sensitivity to output
  const beta = 10 // Investment sensitivity to interest rate
  const gamma = 5 // Money demand sensitivity to interest rate
  const mpc = 0.6
  const [comparisonMode, setComparisonMode] = useState(false)

  // Calculate IS curve: Y = C(Y-T) + I(Y,r) + G
  // => Y = C0 + mpc*(Y-T) + (I0 + alpha*Y - beta*r) + G
  // => Y*(1 - mpc - alpha) = C0 - mpc*T + I0 - beta*r + G
  // => Y = [C0 - mpc*T + I0 + G - beta*r] / (1 - mpc - alpha)
  const calculateISCurve = (G: number, T: number, I0: number) => {
    const data = []
    for (let r = 0; r <= 20; r += 0.5) {
      const denominator = 1 - mpc - alpha
      const numerator = C0 - mpc * T + I0 + G - beta * r
      const Y = numerator / denominator
      if (Y >= 0 && Y <= 300) {
        data.push({ r: parseFloat(r.toFixed(1)), Y: parseFloat(Y.toFixed(2)), curve: 'IS' })
      }
    }
    return data
  }

  // Calculate LM curve: M/P = L(Y,r)
  // => M/P = Y - gamma*r
  // => Y = M/P + gamma*r
  const calculateLMCurve = (M: number, P: number) => {
    const data = []
    for (let r = 0; r <= 20; r += 0.5) {
      const Y = M / P + gamma * r
      if (Y >= 0 && Y <= 300) {
        data.push({ r: parseFloat(r.toFixed(1)), Y: parseFloat(Y.toFixed(2)), curve: 'LM' })
      }
    }
    return data
  }

  // Find equilibrium intersection
  const findEquilibrium = (G: number, T: number, M: number, P: number, I0: number) => {
    // Solve system:
    // IS: Y = (C0 - mpc*T + I0 + G - beta*r) / (1 - mpc - alpha)
    // LM: Y = M/P + gamma*r
    // Setting equal and solving for r:
    const a = beta + gamma * (1 - mpc - alpha)
    const b = C0 - mpc * T + I0 + G - (1 - mpc - alpha) * (M / P)
    const r_eq = b / a
    const Y_eq = M / P + gamma * r_eq

    // Calculate investment and money demand at equilibrium
    const I_eq = I0 + alpha * Y_eq - beta * r_eq
    const L_eq = Y_eq - gamma * r_eq

    return {
      Y: Math.max(0, Y_eq),
      r: Math.max(0, r_eq),
      I: Math.max(0, I_eq),
      L: Math.max(0, L_eq),
    }
  }

  // Generate data for current scenario
  const isCurveA = calculateISCurve(G_a, T_a, I0_a)
  const lmCurveA = calculateLMCurve(M_a, P_a)
  const equilibrium_a = findEquilibrium(G_a, T_a, M_a, P_a, I0_a)

  const isCurveB = calculateISCurve(G_b, T_b, I0_b)
  const lmCurveB = calculateLMCurve(M_b, P_b)
  const equilibrium_b = findEquilibrium(G_b, T_b, M_b, P_b, I0_b)

  // Merge curves for chart
  const chartData_a = [...isCurveA, ...lmCurveA]
  const chartData_comparison = [
    ...isCurveA.map((d) => ({ ...d, scenario: 'A', curve: 'IS-A' })),
    ...lmCurveA.map((d) => ({ ...d, scenario: 'A', curve: 'LM-A' })),
    ...isCurveB.map((d) => ({ ...d, scenario: 'B', curve: 'IS-B' })),
    ...lmCurveB.map((d) => ({ ...d, scenario: 'B', curve: 'LM-B' })),
  ]

  const outputChange = equilibrium_b.Y - equilibrium_a.Y
  const rateChange = equilibrium_b.r - equilibrium_a.r

  return (
    <div className="tool-card">
      <ToolHeader
        title="IS-LM Equilibrium Explorer"
        description="Adjust fiscal and monetary policy parameters. Watch how IS and LM curves shift and equilibrium output and interest rates adjust. Explore crowding out, the multiplier effect at different interest rates, and policy effectiveness."
        badge="beginner"
      />

      {/* Toggle Comparison Mode */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label style={{ fontSize: '0.95rem', fontWeight: '500' }}>
          <input
            type="checkbox"
            checked={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.checked)}
            style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          />
          Compare Two Scenarios
        </label>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Scenario A Controls */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b' }}>
            Scenario {comparisonMode ? 'A (Blue)' : ''}
          </h3>
          <div className="control-panel">
            <SliderControl
              label="Government Spending (G)"
              value={G_a}
              min={50}
              max={200}
              step={10}
              onChange={setG_a}
              unit="units"
            />
            <SliderControl
              label="Taxes (T)"
              value={T_a}
              min={20}
              max={100}
              step={5}
              onChange={setT_a}
              unit="units"
            />
            <SliderControl
              label="Money Supply (M)"
              value={M_a}
              min={50}
              max={200}
              step={10}
              onChange={setM_a}
              unit="units"
            />
            <SliderControl
              label="Price Level (P)"
              value={P_a}
              min={0.8}
              max={1.2}
              step={0.1}
              onChange={setP_a}
              unit=""
            />
            <SliderControl
              label="Investment Intercept (I₀)"
              value={I0_a}
              min={20}
              max={80}
              step={5}
              onChange={setI0_a}
              unit="units"
            />
          </div>
        </div>

        {/* Scenario B Controls (only if comparison mode) */}
        {comparisonMode && (
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b' }}>
              Scenario B (Red)
            </h3>
            <div className="control-panel">
              <SliderControl
                label="Government Spending (G)"
                value={G_b}
                min={50}
                max={200}
                step={10}
                onChange={setG_b}
                unit="units"
              />
              <SliderControl
                label="Taxes (T)"
                value={T_b}
                min={20}
                max={100}
                step={5}
                onChange={setT_b}
                unit="units"
              />
              <SliderControl
                label="Money Supply (M)"
                value={M_b}
                min={50}
                max={200}
                step={10}
                onChange={setM_b}
                unit="units"
              />
              <SliderControl
                label="Price Level (P)"
                value={P_b}
                min={0.8}
                max={1.2}
                step={0.1}
                onChange={setP_b}
                unit=""
              />
              <SliderControl
                label="Investment Intercept (I₀)"
                value={I0_b}
                min={20}
                max={80}
                step={5}
                onChange={setI0_b}
                unit="units"
              />
            </div>
          </div>
        )}
      </div>

      {/* Stat Boxes - Scenario A */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#64748b' }}>
          Equilibrium Results
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <StatBox label="Output (Y*)" value={equilibrium_a.Y.toFixed(2)} highlight />
          <StatBox label="Interest Rate (r*)" value={equilibrium_a.r.toFixed(2)} unit="%" />
          <StatBox label="Investment at Eq." value={equilibrium_a.I.toFixed(2)} unit="units" />
          <StatBox label="Money Demand (L)" value={equilibrium_a.L.toFixed(2)} unit="units" />
        </div>
      </div>

      {/* Comparison Results */}
      {comparisonMode && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#15803d' }}>
            Policy Impact Comparison
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Output Change (ΔY)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: outputChange >= 0 ? '#15803d' : '#dc2626' }}>
                {outputChange >= 0 ? '+' : ''}{outputChange.toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Interest Rate Change (Δr)</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: rateChange >= 0 ? '#dc2626' : '#15803d' }}>
                {rateChange >= 0 ? '+' : ''}{rateChange.toFixed(2)}%
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Scenario B Output</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                {equilibrium_b.Y.toFixed(2)}
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Scenario B Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                {equilibrium_b.r.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          IS-LM Diagram
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={comparisonMode ? chartData_comparison : chartData_a}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="Y"
              label={{ value: 'Output (Y)', position: 'insideBottomRight', offset: -5 }}
              type="number"
            />
            <YAxis label={{ value: 'Interest Rate (r)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            {!comparisonMode ? (
              <>
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#3b82f6"
                  dot={false}
                  name="IS Curve"
                  data={isCurveA}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#ef4444"
                  dot={false}
                  name="LM Curve"
                  data={lmCurveA}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#3b82f6"
                  strokeOpacity={0.6}
                  dot={false}
                  name="IS-A"
                  data={isCurveA}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#0c4a6e"
                  strokeOpacity={0.8}
                  dot={false}
                  name="LM-A"
                  data={lmCurveA}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#fca5a5"
                  strokeOpacity={0.6}
                  dot={false}
                  name="IS-B"
                  data={isCurveB}
                  strokeWidth={2}
                  isAnimationActive={false}
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="r"
                  stroke="#991b1b"
                  strokeOpacity={0.8}
                  dot={false}
                  name="LM-B"
                  data={lmCurveB}
                  strokeWidth={2}
                  isAnimationActive={false}
                  strokeDasharray="5 5"
                />
              </>
            )}
            <Legend />
          </LineChart>
        </ResponsiveContainer>

        {/* Equilibrium Points Overlay */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '4px', borderLeft: '3px solid #3b82f6' }}>
            <div style={{ fontSize: '0.75rem', color: '#0c4a6e', fontWeight: '600' }}>SCENARIO A EQUILIBRIUM</div>
            <div style={{ fontSize: '0.9rem', color: '#0c4a6e', marginTop: '0.25rem' }}>
              Y* = {equilibrium_a.Y.toFixed(2)} | r* = {equilibrium_a.r.toFixed(2)}%
            </div>
          </div>
          {comparisonMode && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '4px', borderLeft: '3px solid #ef4444' }}>
              <div style={{ fontSize: '0.75rem', color: '#991b1b', fontWeight: '600' }}>SCENARIO B EQUILIBRIUM</div>
              <div style={{ fontSize: '0.9rem', color: '#991b1b', marginTop: '0.25rem' }}>
                Y* = {equilibrium_b.Y.toFixed(2)} | r* = {equilibrium_b.r.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Insights */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#0c4a6e' }}>
          📌 How IS-LM Works
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.5rem', color: '#0c4a6e' }}>
          <li>
            <strong>IS Curve (Investment-Saving):</strong> Shows combinations of Y and r where goods market clears.
            Higher r reduces investment, lowering equilibrium Y. When G↑, IS shifts right (higher Y at each r).
          </li>
          <li>
            <strong>LM Curve (Liquidity-Money):</strong> Shows combinations of Y and r where money market clears.
            Higher Y increases money demand, raising r. When M↑, LM shifts right (lower r at each Y).
          </li>
          <li>
            <strong>Equilibrium:</strong> Where IS and LM intersect. At this point, both goods and money markets
            are in equilibrium.
          </li>
        </ul>
      </div>

      {/* Policy Effects */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fef08a', borderRadius: '6px', borderLeft: "4px solid #ca8a04" }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#854d0e' }}>
          💡 Policy Effects
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', color: '#854d0e' }}>
          <div>
            <strong>Fiscal Expansion (G↑ or T↓):</strong>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>IS shifts right → Y↑, r↑</li>
              <li>Higher rates crowd out private investment</li>
              <li>Multiplier effect depends on monetary policy response</li>
            </ul>
          </div>
          <div>
            <strong>Monetary Expansion (M↑):</strong>
            <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>LM shifts right → Y↑, r↓</li>
              <li>Lower rates boost private investment</li>
              <li>More effective in liquidity trap (when r is already low)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advanced Insights */}
      <div style={{ padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#15803d' }}>
          🔬 Advanced Concepts
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.5rem', color: '#15803d' }}>
          <li>
            <strong>Crowding Out:</strong> Fiscal expansion raises interest rates, crowding out private investment.
            Try increasing G—notice r increases, which reduces I in the equilibrium results.
          </li>
          <li>
            <strong>Multiplier Effect:</strong> The impact of fiscal policy on output depends on the interest rate response.
            With flexible money supply (M↑ together), the multiplier is stronger.
          </li>
          <li>
            <strong>Monetary Policy Effectiveness:</strong> Monetary policy is most effective when the LM curve is steep
            (sensitive to Y changes). It's ineffective in a liquidity trap (horizontal LM).
          </li>
          <li>
            <strong>Policy Mix:</strong> Fiscal expansion + monetary contraction raises rates and crowds out investment.
            Fiscal expansion + monetary expansion keeps rates stable and multiplier strong.
          </li>
        </ul>
      </div>
    </div>
  )
}
