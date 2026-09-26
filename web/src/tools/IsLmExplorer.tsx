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
import { formatNumber } from '../lib/calculations'

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

  // Model parameters
  const C0 = 40
  const alpha = 0.15 // Investment sensitivity to output (reduced to avoid singularity)
  const [beta, setBeta] = useState(10) // Investment sensitivity to interest rate (user-adjustable)
  const [gamma, setGamma] = useState(5) // Money demand sensitivity to interest rate (user-adjustable)
  const mpc = 0.6
  const [comparisonMode, setComparisonMode] = useState(false)

  // Calculate IS curve: Y = C(Y-T) + I(Y,r) + G
  // => Y = C0 + mpc*(Y-T) + (I0 + alpha*Y - beta*r) + G
  // => Y*(1 - mpc - alpha) = C0 - mpc*T + I0 - beta*r + G
  // => Y = [C0 - mpc*T + I0 + G - beta*r] / (1 - mpc - alpha)
  const calculateISCurve = (G: number, T: number, I0: number) => {
    const data = []
    // Generate points from r=0 to r=25 with finer granularity
    for (let r = 0; r <= 25; r += 0.25) {
      const denominator = 1 - mpc - alpha
      const numerator = C0 - mpc * T + I0 + G - beta * r
      const Y = numerator / denominator
      // Include all points in range, don't filter
      data.push({ r: parseFloat(r.toFixed(2)), Y: parseFloat(Y.toFixed(2)), curve: 'IS' })
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

      {/* EDUCATIONAL SECTION 1: IS CURVE */}
      <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#047857' }}>📚 Lesson 1: The IS Curve (Investment = Saving)</h3>
        
        <div style={{ marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.7', color: '#1e293b' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>What is the IS Curve?</strong> The IS curve shows the relationship between output (Y) and interest rate (r) in the goods market when investment equals saving. It's derived from the equilibrium condition Y = C + I + G.
          </p>
          
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Key Formula:</strong> Y = C(Y-T) + I(r) + G
          </p>
          
          <ul style={{ marginLeft: '1.5rem', marginBottom: '0.75rem', lineHeight: '1.8' }}>
            <li><strong>C = C₀ + c₁(Y - T)</strong>: Consumption increases with income</li>
            <li><strong>I = I₀ - β·r</strong>: Investment <em>decreases</em> with interest rate (higher rates → fewer projects are profitable)</li>
            <li><strong>G:</strong> Government spending (exogenous)</li>
          </ul>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Why does IS slope downward?</strong> When interest rates rise → Investment falls → Aggregate demand falls → Output must fall to restore equilibrium. Hence, higher r ↔ lower Y.
          </p>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>What shifts the IS curve?</strong> Changes in fiscal policy (G or T) shift the IS curve:
          </p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>↑G (expansionary)</strong>: IS shifts RIGHT (output ↑ at each interest rate)</li>
            <li><strong>↑T (contractionary)</strong>: IS shifts LEFT (output ↓ at each interest rate)</li>
            <li><strong>↓I₀ (worse investment climate)</strong>: IS shifts LEFT</li>
          </ul>
        </div>
      </div>

      {/* INTERACTIVE SECTION 1: IS CURVE EXPLORER */}
      <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #16a34a' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#166534' }}>🎯 Try It: Adjust IS Curve Parameters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* IS Curve Controls */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.25rem', color: '#1e293b' }}>IS Curve Parameters</h4>
            <div className="control-panel">
              <SliderControl
                label="Government Spending (G)"
                value={G_a}
                min={50}
                max={150}
                onChange={setG_a}
              />
              <SliderControl
                label="Taxes (T)"
                value={T_a}
                min={20}
                max={80}
                onChange={setT_a}
              />
              <SliderControl
                label="Base Investment (I₀)"
                value={I0_a}
                min={20}
                max={100}
                onChange={setI0_a}
              />
              <SliderControl
                label="Interest Rate Sensitivity (β)"
                value={beta}
                min={2}
                max={20}
                onChange={setBeta}
              />
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                <strong>What to observe:</strong> As you increase G, the IS curve shifts RIGHT. As you increase T, it shifts LEFT. Changes in I₀ shift the curve in the same direction as G changes.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6' }}>
                <strong>Curve Slope:</strong> The parameter β (interest rate sensitivity) controls the IS curve's slope. Higher β → steeper slope (investment less sensitive to rates). Lower β → flatter slope (investment more sensitive to rates).
              </p>
            </div>
          </div>

          {/* IS Curve Chart */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.25rem', color: '#1e293b' }}>IS Curve</h4>
            {isCurveA.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={isCurveA} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="Y"
                    type="number"
                    domain={[0, 500]}
                    ticks={[0, 100, 200, 300, 400, 500]}
                    allowDataOverflow={true}
                    label={{ value: 'Output (Y)', position: 'insideBottomRight', offset: -5, fill: '#666' }}
                    stroke="#999"
                  />
                  <YAxis
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    allowDataOverflow={true}
                    label={{ value: 'Interest Rate (r)', angle: -90, position: 'insideLeft', fill: '#666' }}
                    stroke="#999"
                  />
                  <Tooltip
                    formatter={(value: number) => value.toFixed(2)}
                    labelFormatter={(label: number) => `Y = ${label.toFixed(1)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="r"
                    stroke="#10b981"
                    dot={false}
                    strokeWidth={2}
                    name="IS Curve"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                <p style={{ color: '#999' }}>No data to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDUCATIONAL SECTION 2: LM CURVE */}
      <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '6px', borderLeft: '4px solid #3b82f6' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>📚 Lesson 2: The LM Curve (Liquidity Money)</h3>
        
        <div style={{ marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.7', color: '#1e293b' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>What is the LM Curve?</strong> The LM curve shows the relationship between output (Y) and interest rate (r) in the money market when money supply equals money demand. It's derived from the equilibrium condition M/P = L.
          </p>
          
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Key Formula:</strong> M/P = L(Y, r)
          </p>
          
          <ul style={{ marginLeft: '1.5rem', marginBottom: '0.75rem', lineHeight: '1.8' }}>
            <li><strong>M/P:</strong> Real money supply (fixed by central bank)</li>
            <li><strong>L(Y):</strong> Money demand <em>increases</em> with output (higher income → more spending → more money needed)</li>
            <li><strong>L(r):</strong> Money demand <em>decreases</em> with interest rate (higher rates → higher cost of holding money → hold less)</li>
          </ul>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Why does LM slope upward?</strong> When output increases → Money demand rises → Interest rate must rise (to clear money market). Hence, higher Y ↔ higher r.
          </p>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>What shifts the LM curve?</strong> Changes in monetary policy (M or P) shift the LM curve:
          </p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>↑M (expansionary)</strong>: LM shifts RIGHT (lower rates at each output level)</li>
            <li><strong>↓M (contractionary)</strong>: LM shifts LEFT (higher rates at each output level)</li>
            <li><strong>↑P (inflation)</strong>: LM shifts LEFT (real money supply falls)</li>
          </ul>
        </div>
      </div>

      {/* INTERACTIVE SECTION 2: LM CURVE EXPLORER */}
      <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0ea5e9' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', color: '#164e63' }}>🎯 Try It: Adjust LM Curve Parameters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* LM Curve Controls */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.25rem', color: '#1e293b' }}>LM Curve Parameters</h4>
            <div className="control-panel">
              <SliderControl
                label="Money Supply (M)"
                value={M_a}
                min={80}
                max={250}
                onChange={setM_a}
              />
              <SliderControl
                label="Price Level (P)"
                value={P_a}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={setP_a}
              />
              <SliderControl
                label="Money Demand Sensitivity (γ)"
                value={gamma}
                min={1}
                max={30}
                onChange={setGamma}
              />
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                <strong>What to observe:</strong> As you increase M, the LM curve shifts RIGHT (lower interest rates at each output level). As you increase P, the LM curve shifts LEFT (real money supply decreases).
              </p>
              <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6' }}>
                <strong>Curve Slope:</strong> The LM curve's slope is determined by money demand sensitivity (γ). The slope = 1/γ, so higher γ means steeper LM curve (more interest rate sensitivity to output changes).
              </p>
            </div>
          </div>

          {/* LM Curve Chart */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '1.25rem', color: '#1e293b' }}>LM Curve</h4>
            {lmCurveA.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lmCurveA} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="Y"
                    type="number"
                    domain={[0, 500]}
                    ticks={[0, 100, 200, 300, 400, 500]}
                    allowDataOverflow={true}
                    label={{ value: 'Output (Y)', position: 'insideBottomRight', offset: -5, fill: '#666' }}
                    stroke="#999"
                  />
                  <YAxis
                    domain={[0, 20]}
                    ticks={[0, 5, 10, 15, 20]}
                    allowDataOverflow={true}
                    label={{ value: 'Interest Rate (r)', angle: -90, position: 'insideLeft', fill: '#666' }}
                    stroke="#999"
                  />
                  <Tooltip
                    formatter={(value: number) => value.toFixed(2)}
                    labelFormatter={(label: number) => `Y = ${label.toFixed(1)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="r"
                    stroke="#0ea5e9"
                    dot={false}
                    strokeWidth={2}
                    name="LM Curve"
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px' }}>
                <p style={{ color: '#999' }}>No data to display</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EDUCATIONAL SECTION 3: IS-LM EQUILIBRIUM */}
      <div style={{ marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#fef3c7', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#92400e' }}>📚 Lesson 3: IS-LM Equilibrium</h3>
        
        <div style={{ marginBottom: '1rem', fontSize: '0.95rem', lineHeight: '1.7', color: '#1e293b' }}>
          <p style={{ marginBottom: '0.75rem' }}>
            <strong>What is IS-LM Equilibrium?</strong> The intersection of the IS and LM curves determines the equilibrium output (Y*) and interest rate (r*) where both the goods market and money market clear simultaneously.
          </p>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Graphical Intuition:</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '0.75rem', lineHeight: '1.8' }}>
            <li>Points <em>above</em> IS: Investment {'>'} Saving (excess demand → excess output → demand pushes output up)</li>
            <li>Points <em>below</em> IS: Investment {'<'} Saving (excess saving → insufficient demand → output falls)</li>
            <li>Points <em>above</em> LM: Money demand {'>'} Money supply (interest rates rise to equilibrate)</li>
            <li>Points <em>below</em> LM: Money demand {'<'} Money supply (interest rates fall to equilibrate)</li>
          </ul>

          <p style={{ marginBottom: '0.75rem' }}>
            <strong>Policy Implications:</strong>
          </p>
          <ul style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
            <li><strong>Fiscal Policy (↑G):</strong> Shifts IS right → Output ↑, Interest rate ↑ (crowding out: higher rates discourage investment)</li>
            <li><strong>Monetary Policy (↑M):</strong> Shifts LM right → Output ↑, Interest rate ↓ (less crowding out)</li>
            <li><strong>Combined:</strong> Fiscal + Monetary can amplify output increases with minimal rate increases</li>
          </ul>
        </div>
      </div>

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

      {/* INSIGHT: Crowding Out */}
      {comparisonMode && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fecaca', borderRadius: '6px', borderLeft: '4px solid #dc2626' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#7f1d1d' }}>⚠️ Crowding Out Effect</h4>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#5a1a1a', marginBottom: '0.5rem' }}>
            When fiscal policy increases without accompanying monetary expansion, interest rates rise, discouraging private investment. This is "crowding out."
          </p>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', color: '#5a1a1a' }}>
            <strong>Your results:</strong> If Δr &gt; 0 (rates rose), look for the output gain to be smaller than predicted by the multiplier alone, because investment fell.
          </p>
        </div>
      )}

      {/* INSIGHT: Policy Effectiveness */}
      {comparisonMode && (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', color: '#0c2d6b' }}>💡 Policy Effectiveness Comparison</h4>
          <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#1e3a8a', marginLeft: '1.5rem' }}>
            <li><strong>Fiscal policy alone:</strong> Raises output but also raises rates (crowding out reduces gains)</li>
            <li><strong>Monetary policy alone:</strong> Raises output and lowers rates (no crowding out, investment encouraged)</li>
            <li><strong>Combined policy:</strong> Maximum output gain with minimal rate increases (best of both worlds)</li>
          </ul>
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
              domain={[0, 700]}
              ticks={[0, 100, 200, 300, 400, 500, 600, 700]}
              allowDataOverflow={true}
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

      {/* Detailed Curve Explanations */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#15803d' }}>
          📈 Understanding the Curves
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem', color: '#15803d' }}>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#15803d' }}>IS Curve Characteristics</h4>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><strong>Slope:</strong> Negative (downward sloping)</li>
              <li><strong>Reason:</strong> Higher interest rates reduce investment, decreasing aggregate demand and output</li>
              <li><strong>Shifts:</strong> Due to changes in G, T, C₀, I₀, or consumer confidence</li>
              <li><strong>Shape:</strong> Typically linear but can be curved depending on model assumptions</li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#15803d' }}>LM Curve Characteristics</h4>
            <ul style={{ marginLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><strong>Slope:</strong> Positive (upward sloping)</li>
              <li><strong>Reason:</strong> Higher income increases money demand, requiring higher interest rates to maintain equilibrium</li>
              <li><strong>Shifts:</strong> Due to changes in M or P</li>
              <li><strong>Shape:</strong> Typically linear but can be curved in more advanced models</li>
            </ul>
          </div>
        </div>
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

      {/* Try This Section */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f3e8ff', borderRadius: '6px', borderLeft: '4px solid #a855f7' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#6b21a8' }}>
          💡 Try These Experiments
        </h3>
        <div style={{ fontSize: '0.875rem', lineHeight: '1.8', color: '#6b21a8', marginLeft: '0.5rem' }}>
          <p style={{ marginBottom: '1rem', fontWeight: '500' }}>Click "Compare Two Scenarios" and try these experiments:</p>
          <ol style={{ marginLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Fiscal Stimulus Alone:</strong> Keep Scenario A as baseline. In Scenario B, increase G by 30. Watch output rise but interest rate rise too (crowding out effect visible).
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Monetary Response to Fiscal:</strong> Same as above, but also increase M by 30 in Scenario B. Output rises more and rate increase is smaller!
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Monetary Policy Alone:</strong> Keep Scenario A as baseline. In Scenario B, increase M by 40 only (keep G unchanged). Output rises and rates FALL—investment is encouraged!
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Tax Cut vs. Spending Increase:</strong> In Scenario B, decrease T by 20 (instead of increasing G). Output rises but by less than the same dollar amount in spending—this is the tax multiplier effect.
            </li>
            <li style={{ marginBottom: '0.75rem' }}>
              <strong>Inflation Effect on Money:</strong> In Scenario B, increase P (price level) with M unchanged. This reduces real money supply (M/P falls), raising rates and crowding out private investment.
            </li>
          </ol>
        </div>
      </div>

      {/* Applications and Uses */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fff7ed', borderRadius: '6px', borderLeft: '4px solid #f97316' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#ea580c' }}>
          🎯 Applications of IS-LM Model
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.5rem', color: '#ea580c' }}>
          <li>
            <strong>Economic Analysis:</strong> Analyze the effects of fiscal and monetary policy on output and interest rates
          </li>
          <li>
            <strong>Policy Design:</strong> Determine optimal combinations of fiscal and monetary policy to achieve desired outcomes
          </li>
          <li>
            <strong>Recession Analysis:</strong> Understand how to stimulate the economy during downturns
          </li>
          <li>
            <strong>Inflation Control:</strong> Analyze how to cool down overheating economies
          </li>
          <li>
            <strong>International Policy:</strong> Basis for Mundell-Fleming model in open economies
          </li>
        </ul>
        <p style={{ fontSize: '0.875rem', marginTop: '1rem', color: '#ea580c' }}>
          The IS-LM model is a fundamental tool for understanding how the goods market and money market interact to determine national income and interest rates in the short run.
        </p>
      </div>
    </div>
  )
}
