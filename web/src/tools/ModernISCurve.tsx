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
  ReferenceLine,
  ComposedChart,
  Bar,
  BarChart,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'
import { formatNumber } from '../lib/calculations'

interface ISCurveData {
  realRate: number
  outputGapNK: number // Modern NK IS curve
  outputGapTextbook: number // Textbook IS curve
  outputLevel: number
}

export default function ModernISCurve() {
  // === Textbook IS Curve Parameters ===
  const [G, setG] = useState(100) // Government spending
  const [T, setT] = useState(50) // Taxes
  const [C0] = useState(40) // Autonomous consumption
  const mpc = 0.6 // Marginal propensity to consume
  const [beta, setBeta] = useState(15) // Investment sensitivity to interest rate
  const [I0, setI0] = useState(50) // Autonomous investment

  // === Modern NK IS Curve Parameters ===
  const [sigma, setSigma] = useState(1.5) // Intertemporal elasticity of substitution
  const [rNatural, setRNatural] = useState(2) // Natural real rate (%)
  const [expectedGrowth, setExpectedGrowth] = useState(2.5) // Expected future growth (%)
  const [termPremium, setTermPremium] = useState(0.5) // Term premium on long-term rates (%)
  const [creditSpread, setCreditSpread] = useState(0) // Credit spread from policy rate (%)
  const [expectedInflation, setExpectedInflation] = useState(2) // Expected inflation (%)
  const [nominalRate, setNominalRate] = useState(4.5) // Nominal policy rate (%)

  // === Visualization Parameters ===
  const [showTextbook, setShowTextbook] = useState(true)
  const [showModern, setShowModern] = useState(true)
  const [showFinancialConditions, setShowFinancialConditions] = useState(true)
  const [tab, setTab] = useState<'curves' | 'decomposition' | 'conditions'>('curves')

  // === Calculate Textbook IS Curve ===
  // Y = [C0 - mpc*T + I0 + G - beta*r] / (1 - mpc)
  const calculateTextbookIS = (): ISCurveData[] => {
    const data: ISCurveData[] = []
    const denominator = 1 - mpc
    for (let r = -2; r <= 8; r += 0.2) {
      const numerator = C0 - mpc * T + I0 + G - beta * r
      const Y = numerator / denominator
      // For comparison: assume potential Y = 120
      const outputGap = ((Y - 120) / 120) * 100
      data.push({
        realRate: parseFloat(r.toFixed(2)),
        outputGapTextbook: parseFloat(outputGap.toFixed(2)),
        outputGapNK: 0, // Will be filled below
        outputLevel: parseFloat(Y.toFixed(2)),
      })
    }
    return data
  }

  // === Calculate Modern NK IS Curve ===
  // x_t = E[x_{t+1}] - (1/σ)(r_t - r_n)
  // Simplified version (assuming stable expectations):
  // x = -(1/σ)(r - r_n)
  const calculateModernIS = (textbookData: ISCurveData[]): ISCurveData[] => {
    return textbookData.map((d) => ({
      ...d,
      outputGapNK: parseFloat((-(1 / sigma) * (d.realRate - rNatural)).toFixed(2)),
    }))
  }

  const curveData = calculateModernIS(calculateTextbookIS())

  // Compute real rates
  const realPolicyRate = nominalRate - expectedInflation
  const effectiveRealRate = realPolicyRate + termPremium + creditSpread
  const realRateGap = effectiveRealRate - rNatural

  // === Find Current Equilibrium ===
  const currentOutputGapNK = -(1 / sigma) * (realRateGap)

  // === Financial Conditions Index (simplified) ===
  // Combines term premium, credit spread, and policy rate relative to natural
  const financialConditionsIndex =
    (realPolicyRate - rNatural) * 0.5 + // Policy stance
    termPremium * 0.3 + // Term premium
    creditSpread * 0.2 // Credit conditions

  // === Fiscal Impulse Impact ===
  // Baseline multiplier (from textbook: 1/(1-mpc))
  const multiplier = 1 / (1 - mpc)
  const fiscalImpulse = Math.abs(G - 100) // Change from baseline
  const demandEffect = fiscalImpulse * multiplier

  // === Data for Decomposition Chart ===
  const decompositionData = [
    {
      component: 'Policy Rate\nEffect',
      contribution: -(1 / sigma) * (realPolicyRate - rNatural),
    },
    {
      component: 'Term\nPremium',
      contribution: -(1 / sigma) * termPremium,
    },
    {
      component: 'Credit\nSpread',
      contribution: -(1 / sigma) * creditSpread,
    },
    {
      component: 'Fiscal\nImpulse',
      contribution: (fiscalImpulse / 100) * 5, // Scale for visualization
    },
    {
      component: 'Growth\nExpectations',
      contribution: (expectedGrowth - 2.5) * 0.5,
    },
  ]

  return (
    <div className="tool-card">
      <ToolHeader
        title="Modern IS Curve: From Textbook to Markets"
        description="Upgrade your understanding of the IS relationship. Compare the simple textbook IS curve with the modern New Keynesian IS curve used by central banks and macro traders. Manipulate real financing conditions and see output respond."
        badge="advanced"
      />

      <div className="controls-section">
        <h3 className="section-title">📊 Monetary & Financial Conditions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SliderControl
            label="Nominal Policy Rate (i)"
            value={nominalRate}
            onChange={setNominalRate}
            min={0}
            max={8}
            step={0.25}
            unit="%"
          />

          <SliderControl
            label="Expected Inflation (πᵉ)"
            value={expectedInflation}
            onChange={setExpectedInflation}
            min={0}
            max={5}
            step={0.25}
            unit="%"
          />

          <SliderControl
            label="Natural Real Rate (rⁿ)"
            value={rNatural}
            onChange={setRNatural}
            min={-2}
            max={4}
            step={0.25}
            unit="%"
          />

          <SliderControl
            label="Term Premium"
            value={termPremium}
            onChange={setTermPremium}
            min={-1}
            max={3}
            step={0.25}
            unit="%"
          />

          <SliderControl
            label="Credit Spread"
            value={creditSpread}
            onChange={setCreditSpread}
            min={-0.5}
            max={2}
            step={0.1}
            unit="%"
          />

          <SliderControl
            label="Elasticity of Substitution (σ)"
            value={sigma}
            onChange={setSigma}
            min={0.5}
            max={3}
            step={0.1}
          />
        </div>

        <h3 className="section-title mt-6">💰 Fiscal & Real Sector</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SliderControl
            label="Government Spending (G)"
            value={G}
            onChange={setG}
            min={50}
            max={200}
            step={5}
            unit="units"
          />

          <SliderControl
            label="Taxes (T)"
            value={T}
            onChange={setT}
            min={0}
            max={100}
            step={5}
            unit="units"
          />

          <SliderControl
            label="Autonomous Investment (I₀)"
            value={I0}
            onChange={setI0}
            min={20}
            max={80}
            step={5}
            unit="units"
          />

          <SliderControl
            label="Investment Rate Sensitivity (β)"
            value={beta}
            onChange={setBeta}
            min={5}
            max={30}
            step={1}
          />

          <SliderControl
            label="Expected Future Growth"
            value={expectedGrowth}
            onChange={setExpectedGrowth}
            min={0}
            max={5}
            step={0.25}
            unit="%"
          />
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            onClick={() => setShowTextbook(!showTextbook)}
            variant={showTextbook ? 'primary' : 'secondary'}
          >
            {showTextbook ? '✓ Textbook IS' : 'Textbook IS'}
          </Button>
          <Button
            onClick={() => setShowModern(!showModern)}
            variant={showModern ? 'primary' : 'secondary'}
          >
            {showModern ? '✓ Modern NK IS' : 'Modern NK IS'}
          </Button>
          <Button
            onClick={() => setShowFinancialConditions(!showFinancialConditions)}
            variant={showFinancialConditions ? 'primary' : 'secondary'}
          >
            {showFinancialConditions ? '✓ Fin. Conditions' : 'Fin. Conditions'}
          </Button>
        </div>
      </div>

      {/* === TAB NAVIGATION === */}
      <div className="tabs-section mt-4">
        <div className="flex gap-2 border-b-2 border-gray-200">
          <button
            onClick={() => setTab('curves')}
            className={`px-4 py-2 font-medium ${
              tab === 'curves'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            IS Curves
          </button>
          <button
            onClick={() => setTab('decomposition')}
            className={`px-4 py-2 font-medium ${
              tab === 'decomposition'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Output Gap Decomposition
          </button>
          <button
            onClick={() => setTab('conditions')}
            className={`px-4 py-2 font-medium ${
              tab === 'conditions'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Financial Conditions
          </button>
        </div>
      </div>

      {/* === TAB CONTENT === */}

      {tab === 'curves' && (
        <div className="mt-6">
          <div className="chart-container">
            <h3 className="chart-title">Textbook vs. Modern IS Curves</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>Textbook IS:</strong> Negatively sloped; output is a function of real interest rate via
              investment and multiplier.
              <br />
              <strong>Modern NK IS:</strong> Output gap responds to deviation of real rate from natural rate.
              Steeper (more sensitive) when σ is low.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={curveData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="realRate"
                  label={{ value: 'Real Interest Rate (%)', position: 'insideBottomRight', offset: -5 }}
                  type="number"
                />
                <YAxis label={{ value: 'Output Gap (%) or Output Level', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(val: any) => val.toFixed(2)} />
                <Legend />
                <ReferenceLine x={rNatural} stroke="#999" strokeDasharray="5 5" label={`r^n = ${rNatural}%`} />
                {showTextbook && (
                  <Line
                    type="monotone"
                    dataKey="outputGapTextbook"
                    stroke="#ef4444"
                    dot={false}
                    name="Textbook IS (Output Gap %)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                )}
                {showModern && (
                  <Line
                    type="monotone"
                    dataKey="outputGapNK"
                    stroke="#3b82f6"
                    dot={false}
                    name="Modern NK IS (Output Gap %)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                )}
                {/* Mark current equilibrium */}
                <ReferenceLine
                  x={realPolicyRate}
                  stroke="#10b981"
                  strokeDasharray="5 5"
                  label={`Current r = ${realPolicyRate.toFixed(2)}%`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* === KEY STATISTICS === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <StatBox
              label="Real Policy Rate"
              value={`${formatNumber(realPolicyRate, 2)}%`}
              color="blue"
            />
            <StatBox
              label="Real Rate Gap"
              value={`${formatNumber(realRateGap, 2)}%`}
              color={realRateGap > 0 ? 'red' : 'green'}
            />
            <StatBox
              label="NK Output Gap"
              value={`${formatNumber(currentOutputGapNK, 2)}%`}
              color={Math.abs(currentOutputGapNK) > 2 ? 'red' : 'blue'}
            />
          </div>

          <InfoBox type="info">
            <h4 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>💡 Understanding the Curves</h4>
            <p><strong>Textbook IS Curve:</strong> The simple IS curve shows output as a downward-sloping function of the real interest rate. Higher real rates reduce investment, which via the multiplier reduces aggregate demand.</p>
            <p style={{marginTop: '0.5rem'}}><strong>Modern NK IS Curve:</strong> What matters is not the absolute real rate, but how it compares to the natural rate. When r &gt; rⁿ, monetary policy is restrictive and output falls below potential.</p>
            <p style={{marginTop: '0.5rem'}}><strong>Why the Difference Matters:</strong> The modern IS directly incorporates expectations of future growth and rates. Financial frictions enter explicitly as wedges tightening conditions independent of the policy rate alone.</p>
          </InfoBox>
        </div>
      )}

      {tab === 'decomposition' && (
        <div className="mt-6">
          <div className="chart-container">
            <h3 className="chart-title">What Drives the Output Gap? (NK IS Decomposition)</h3>
            <p className="text-sm text-gray-600 mb-4">
              The modern IS curve shows output gap = -(1/σ) × (r - rⁿ). Break down the sources of tightness/looseness.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={decompositionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="component" />
                <YAxis label={{ value: 'Contribution to Output Gap (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(val: any) => val.toFixed(2)} />
                <Bar dataKey="contribution" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* === DECOMPOSITION DETAILS === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="stat-box-custom bg-blue-50 p-4 rounded">
              <h4 className="font-bold text-blue-900">Policy Rate Effect</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(-(1 / sigma) * (realPolicyRate - rNatural), 2)}%
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Real policy rate ({formatNumber(realPolicyRate, 2)}%) is {formatNumber(realRateGap, 2)}% above natural.
              </p>
            </div>

            <div className="stat-box-custom bg-purple-50 p-4 rounded">
              <h4 className="font-bold text-purple-900">Financial Frictions</h4>
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(-(1 / sigma) * (termPremium + creditSpread), 2)}%
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Term premium + Credit spread add {formatNumber(termPremium + creditSpread, 2)}% to tightness.
              </p>
            </div>

            <div className="stat-box-custom bg-green-50 p-4 rounded">
              <h4 className="font-bold text-green-900">Fiscal Impulse</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatNumber(demandEffect, 1)} units
              </p>
              <p className="text-sm text-gray-700 mt-2">
                G = {formatNumber(G, 0)} generates {formatNumber(demandEffect, 1)} units via multiplier.
              </p>
            </div>

            <div className="stat-box-custom bg-orange-50 p-4 rounded">
              <h4 className="font-bold text-orange-900">Growth Expectations</h4>
              <p className="text-2xl font-bold text-orange-600">
                {formatNumber(expectedGrowth, 2)}%
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Baseline = 2.5%. Higher expectations raise permanent income and natural rate.
              </p>
            </div>
          </div>

          <InfoBox type="warning">
            <h4 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>📌 Key Insights from Decomposition</h4>
            <p><strong>The output gap is determined by:</strong></p>
            <ol style={{listStylePosition: 'inside', marginTop: '0.5rem'}}>
              <li><strong>Real Rate Gap (r - rⁿ):</strong> The fundamental IS driver.</li>
              <li><strong>Financial Frictions:</strong> Term premiums, credit spreads, liquidity conditions.</li>
              <li><strong>Fiscal Impulse:</strong> Government spending and taxes shift IS directly.</li>
              <li><strong>Growth Expectations:</strong> If households expect stronger future growth, permanent income rises.</li>
            </ol>
            <p style={{marginTop: '0.5rem'}}><strong>Implication:</strong> Central banks cannot look only at the policy rate. When spreads spike, the economy tightens even if i falls.</p>
          </InfoBox>
        </div>
      )}

      {tab === 'conditions' && (
        <div className="mt-6">
          <div className="chart-container">
            <h3 className="chart-title">Financial Conditions Index & Components</h3>
            <p className="text-sm text-gray-600 mb-4">
              Real financing conditions = Policy rate + Term premium + Credit spread, all relative to natural rate.
              Tighter conditions (positive values) imply lower output gaps.
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={[{ name: 'Current', realRate: realPolicyRate, termPrem: termPremium, credSpread: creditSpread }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Rate Level (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="realRate" fill="#3b82f6" name="Real Policy Rate" stackId="a" />
                <Bar dataKey="termPrem" fill="#f59e0b" name="Term Premium" stackId="a" />
                <Bar dataKey="credSpread" fill="#ef4444" name="Credit Spread" stackId="a" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* === FINANCIAL CONDITIONS SCORECARD === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <StatBox
              label="Effective Real Rate"
              value={`${formatNumber(effectiveRealRate, 2)}%`}
              color="blue"
            />
            <StatBox
              label="Financial Conditions Index"
              value={`${formatNumber(financialConditionsIndex, 2)}`}
              color={financialConditionsIndex > 0 ? 'red' : 'green'}
            />
            <StatBox
              label="Term Premium Effect"
              value={`${formatNumber(termPremium, 2)}%`}
              color={termPremium > 1 ? 'red' : 'blue'}
            />
            <StatBox
              label="Credit Spread Effect"
              value={`${formatNumber(creditSpread, 2)}%`}
              color={creditSpread > 0.5 ? 'red' : 'green'}
            />
          </div>

          <InfoBox type="warning">
            <h4 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>🏦 Modern Macro View: Beyond the Policy Rate</h4>
            <p><strong>Why Central Banks Care About Financial Conditions, Not Just i:</strong></p>
            <ol style={{listStylePosition: 'inside', marginTop: '0.5rem'}}>
              <li><strong>Term Premium:</strong> When investors demand higher yields (flight to safety), the 10y-2y spread widens. This tightens conditions for long-term borrowers even if the 2y stays flat.</li>
              <li><strong>Credit Spreads:</strong> In crisis, BAA–UST spreads blow out. Companies face a wedge between the Fed rate and their actual cost of capital.</li>
              <li><strong>Liquidity:</strong> During March 2020, even short-term money markets froze. The policy rate was irrelevant if no lending happened.</li>
            </ol>
            <p style={{marginTop: '0.5rem'}}><strong>Modern Central Banking Toolkit:</strong> Policy rate, QE/QT, lending facilities, forward guidance, and macroprudential policy all work together to control financial conditions.</p>
          </InfoBox>

          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 className="font-bold text-yellow-900 mb-2">🎯 2022–2024 Tightening Cycle Example</h4>
            <p className="text-sm text-gray-700">
              The Fed raised i from ~0% to 5.5% to fight inflation. But the output gap didn't fall as much as the
              textbook IS suggested because:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
              <li>
                <strong>Expectations anchored:</strong> After 2020 surge, expectations settled ~2%. Real rate = 3.5%
                relative to rⁿ ≈ 0.5%.
              </li>
              <li>
                <strong>Natural rate rose:</strong> Tighter labor market, fiscal support, green capex → rⁿ moved up,
                so r - rⁿ was less dramatic.
              </li>
              <li>
                <strong>Financial resilience:</strong> Banks, corporates had strong balance sheets. Credit spreads
                never spiked (unlike 2008, 2020). So lending continued.
              </li>
              <li>
                <strong>Fiscal drag built in:</strong> Student loan pause ended, COVID transfers wound down. This
                fiscal headwind partially offset monetary tightening.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* === FOOTER: BRIDGE TO POLICY === */}
      <InfoBox type="success">
        <h4 style={{fontWeight: 'bold', marginBottom: '0.5rem'}}>🔗 How to Use This Tool as a Trader/Policymaker</h4>
        <p><strong>For Central Bankers:</strong> Estimate rⁿ, monitor term premiums and credit spreads in real-time. Calibrate policy using the NK IS. Recognize that QE, forward guidance, and lending facilities also tighten/loosen financial conditions beyond i alone.</p>
        <p style={{marginTop: '0.5rem'}}><strong>For Macro Traders:</strong> When spreads widen, expect demand destruction even if i is unchanged. When policy rate is above natural AND spreads are tight, the economy is double-squeezed. Use decomposition to ask: "Is tightening from policy rates, spreads, or growth expectations?"</p>
        <p style={{marginTop: '0.5rem'}}><strong>For Investors:</strong> Evaluate whether current financial conditions are restrictive (output gap negative) or supportive. Real rate 2–3% above natural = growth likely slowing. Credit spread {'>'} 400 bps = significant tail risk.</p>
      </InfoBox>
    </div>
  )
}
