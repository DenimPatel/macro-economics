import { useState } from 'react'
import { Target } from 'lucide-react'
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
  ToggleDot,
  InfoBox,
} from '../components/ToolComponents'
import { formatNumber } from '../lib/calculations'
import { chartTheme, chartColor } from '../design/chartTheme'

/**
 * Each economic concept keeps one stable series index across every chart in
 * this tool, so a colour always means the same thing.
 */
const TEXTBOOK_STROKE = chartColor(0)
const NK_STROKE = chartColor(1)
const DECOMPOSITION_FILL = chartColor(2)

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

      <div>
        <h3 className="mb-3 text-label-sm font-semibold text-fg">
          Monetary &amp; Financial Conditions
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <h3 className="mb-3 mt-6 text-label-sm font-semibold text-fg">
          Fiscal &amp; Real Sector
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => setShowTextbook(!showTextbook)}
            variant={showTextbook ? 'primary' : 'secondary'}
            aria-pressed={showTextbook}
          >
            <ToggleDot on={showTextbook} /> Textbook IS
          </Button>
          <Button
            onClick={() => setShowModern(!showModern)}
            variant={showModern ? 'primary' : 'secondary'}
            aria-pressed={showModern}
          >
            <ToggleDot on={showModern} /> Modern NK IS
          </Button>
          <Button
            onClick={() => setShowFinancialConditions(!showFinancialConditions)}
            variant={showFinancialConditions ? 'primary' : 'secondary'}
            aria-pressed={showFinancialConditions}
          >
            <ToggleDot on={showFinancialConditions} /> Fin. Conditions
          </Button>
        </div>
      </div>

      {/* === TAB NAVIGATION === */}
      <div className="mt-4">
        <div className="flex gap-2 border-b-2 border-border">
          <button
            onClick={() => setTab('curves')}
            className={`px-4 py-2 font-medium ${
              tab === 'curves'
                ? 'border-b-2 border-accent text-accent-ink'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            IS Curves
          </button>
          <button
            onClick={() => setTab('decomposition')}
            className={`px-4 py-2 font-medium ${
              tab === 'decomposition'
                ? 'border-b-2 border-accent text-accent-ink'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Output Gap Decomposition
          </button>
          <button
            onClick={() => setTab('conditions')}
            className={`px-4 py-2 font-medium ${
              tab === 'conditions'
                ? 'border-b-2 border-accent text-accent-ink'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Financial Conditions
          </button>
        </div>
      </div>

      {/* === TAB CONTENT === */}

      {tab === 'curves' && (
        <div className="mt-6">
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-fg">
              Textbook vs. Modern IS Curves
            </h3>
            <p className="mb-4 text-sm text-fg-muted">
              <strong>Textbook IS:</strong> Negatively sloped; output is a function of real interest rate via
              investment and multiplier.
              <br />
              <strong>Modern NK IS:</strong> Output gap responds to deviation of real rate from natural rate.
              Steeper (more sensitive) when σ is low.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={curveData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  dataKey="realRate"
                  label={{
                    value: 'Real Interest Rate (%)',
                    position: 'insideBottomRight',
                    offset: -5,
                    fill: chartTheme.axis.tick.fill,
                  }}
                  type="number"
                  {...chartTheme.axis}
                />
                <YAxis
                  label={{
                    value: 'Output Gap (%) or Output Level',
                    angle: -90,
                    position: 'insideLeft',
                    fill: chartTheme.axis.tick.fill,
                  }}
                  {...chartTheme.axis}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(val: number) => val.toFixed(2)}
                />
                <Legend {...chartTheme.legend} />
                <ReferenceLine
                  {...chartTheme.reference}
                  x={rNatural}
                  label={`r^n = ${rNatural}%`}
                />
                {showTextbook && (
                  <Line
                    type="monotone"
                    dataKey="outputGapTextbook"
                    stroke={TEXTBOOK_STROKE}
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
                    stroke={NK_STROKE}
                    dot={false}
                    name="Modern NK IS (Output Gap %)"
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                )}
                {/* Mark current equilibrium */}
                <ReferenceLine
                  {...chartTheme.reference}
                  x={realPolicyRate}
                  label={`Current r = ${realPolicyRate.toFixed(2)}%`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* === KEY STATISTICS === */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatBox
              label="Real Policy Rate"
              value={`${formatNumber(realPolicyRate, 2)}%`}
              tone="accent"
            />
            <StatBox
              label="Real Rate Gap"
              value={`${formatNumber(realRateGap, 2)}%`}
              tone={realRateGap > 0 ? 'negative' : 'positive'}
            />
            <StatBox
              label="NK Output Gap"
              value={`${formatNumber(currentOutputGapNK, 2)}%`}
              tone={Math.abs(currentOutputGapNK) > 2 ? 'negative' : 'accent'}
            />
          </div>

          <InfoBox type="info">
            <h4 className="mb-2 text-label-sm font-semibold text-fg">Understanding the Curves</h4>
            <p><strong>Textbook IS Curve:</strong> The simple IS curve shows output as a downward-sloping function of the real interest rate. Higher real rates reduce investment, which via the multiplier reduces aggregate demand.</p>
            <p><strong>Modern NK IS Curve:</strong> What matters is not the absolute real rate, but how it compares to the natural rate. When r &gt; rⁿ, monetary policy is restrictive and output falls below potential.</p>
            <p><strong>Why the Difference Matters:</strong> The modern IS directly incorporates expectations of future growth and rates. Financial frictions enter explicitly as wedges tightening conditions independent of the policy rate alone.</p>
          </InfoBox>
        </div>
      )}

      {tab === 'decomposition' && (
        <div className="mt-6">
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-fg">
              What Drives the Output Gap? (NK IS Decomposition)
            </h3>
            <p className="mb-4 text-sm text-fg-muted">
              The modern IS curve shows output gap = -(1/σ) × (r - rⁿ). Break down the sources of tightness/looseness.
            </p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={decompositionData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="component" {...chartTheme.axis} />
                <YAxis
                  label={{
                    value: 'Contribution to Output Gap (%)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: chartTheme.axis.tick.fill,
                  }}
                  {...chartTheme.axis}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(val: number) => val.toFixed(2)}
                />
                <Bar dataKey="contribution" fill={DECOMPOSITION_FILL} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* === DECOMPOSITION DETAILS === */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-card border border-tier-intermediate/30 bg-tier-intermediate/5 p-4">
              <h4 className="font-bold text-tier-intermediate-ink">Policy Rate Effect</h4>
              <p className="text-2xl font-bold tabular-nums text-tier-intermediate">
                {formatNumber(-(1 / sigma) * (realPolicyRate - rNatural), 2)}%
              </p>
              <p className="mt-2 text-sm text-fg-muted">
                Real policy rate ({formatNumber(realPolicyRate, 2)}%) is {formatNumber(realRateGap, 2)}% above natural.
              </p>
            </div>

            <div className="rounded-card border border-tier-case/30 bg-tier-case/5 p-4">
              <h4 className="font-bold text-tier-case-ink">Financial Frictions</h4>
              <p className="text-2xl font-bold tabular-nums text-tier-case">
                {formatNumber(-(1 / sigma) * (termPremium + creditSpread), 2)}%
              </p>
              <p className="mt-2 text-sm text-fg-muted">
                Term premium + Credit spread add {formatNumber(termPremium + creditSpread, 2)}% to tightness.
              </p>
            </div>

            <div className="rounded-card border border-tier-beginner/30 bg-tier-beginner/5 p-4">
              <h4 className="font-bold text-tier-beginner-ink">Fiscal Impulse</h4>
              <p className="text-2xl font-bold tabular-nums text-tier-beginner">
                {formatNumber(demandEffect, 1)} units
              </p>
              <p className="mt-2 text-sm text-fg-muted">
                G = {formatNumber(G, 0)} generates {formatNumber(demandEffect, 1)} units via multiplier.
              </p>
            </div>

            <div className="rounded-card border border-accent/30 bg-accent/5 p-4">
              <h4 className="font-bold text-accent-ink">Growth Expectations</h4>
              <p className="text-2xl font-bold tabular-nums text-accent">
                {formatNumber(expectedGrowth, 2)}%
              </p>
              <p className="mt-2 text-sm text-fg-muted">
                Baseline = 2.5%. Higher expectations raise permanent income and natural rate.
              </p>
            </div>
          </div>

          <InfoBox type="warning">
            <h4 className="mb-2 text-label-sm font-semibold text-fg">Key Insights from Decomposition</h4>
            <p><strong>The output gap is determined by:</strong></p>
            <ol className="list-inside">
              <li><strong>Real Rate Gap (r - rⁿ):</strong> The fundamental IS driver.</li>
              <li><strong>Financial Frictions:</strong> Term premiums, credit spreads, liquidity conditions.</li>
              <li><strong>Fiscal Impulse:</strong> Government spending and taxes shift IS directly.</li>
              <li><strong>Growth Expectations:</strong> If households expect stronger future growth, permanent income rises.</li>
            </ol>
            <p><strong>Implication:</strong> Central banks cannot look only at the policy rate. When spreads spike, the economy tightens even if i falls.</p>
          </InfoBox>
        </div>
      )}

      {tab === 'conditions' && (
        <div className="mt-6">
          <div className="chart-container">
            <h3 className="chart-title">Financial Conditions Index & Components</h3>
            <p className="mb-4 text-sm leading-relaxed text-fg-muted">
              Real financing conditions = Policy rate + Term premium + Credit spread, all relative to natural rate.
              Tighter conditions (positive values) imply lower output gaps.
            </p>

            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={[{ name: 'Current', realRate: realPolicyRate, termPrem: termPremium, credSpread: creditSpread }]} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="name" {...chartTheme.axis} />
                <YAxis
                  label={{ value: 'Rate Level (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
                  {...chartTheme.axis}
                />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <Legend {...chartTheme.legend} />
                <Bar dataKey="realRate" fill={chartColor(0)} name="Real Policy Rate" stackId="a" />
                <Bar dataKey="termPrem" fill={chartColor(2)} name="Term Premium" stackId="a" />
                <Bar dataKey="credSpread" fill={chartColor(4)} name="Credit Spread" stackId="a" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* === FINANCIAL CONDITIONS SCORECARD === */}
          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <StatBox
              label="Effective Real Rate"
              value={`${formatNumber(effectiveRealRate, 2)}%`}
              tone="accent"
            />
            <StatBox
              label="Financial Conditions Index"
              value={`${formatNumber(financialConditionsIndex, 2)}`}
              tone={financialConditionsIndex > 0 ? 'negative' : 'positive'}
            />
            <StatBox
              label="Term Premium Effect"
              value={`${formatNumber(termPremium, 2)}%`}
              tone={termPremium > 1 ? 'negative' : 'accent'}
            />
            <StatBox
              label="Credit Spread Effect"
              value={`${formatNumber(creditSpread, 2)}%`}
              tone={creditSpread > 0.5 ? 'negative' : 'positive'}
            />
          </div>

          <InfoBox type="warning" title="Modern macro view: beyond the policy rate">
            <p>
              <strong>Why central banks care about financial conditions, not just i:</strong>
            </p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              <li><strong>Term Premium:</strong> When investors demand higher yields (flight to safety), the 10y-2y spread widens. This tightens conditions for long-term borrowers even if the 2y stays flat.</li>
              <li><strong>Credit Spreads:</strong> In crisis, BAA–UST spreads blow out. Companies face a wedge between the Fed rate and their actual cost of capital.</li>
              <li><strong>Liquidity:</strong> During March 2020, even short-term money markets froze. The policy rate was irrelevant if no lending happened.</li>
            </ol>
            <p className="mt-2">
              <strong>Modern central banking toolkit:</strong> Policy rate, QE/QT, lending facilities, forward guidance, and macroprudential policy all work together to control financial conditions.
            </p>
          </InfoBox>

          <div className="tool-callout tool-callout--insight mt-6">
            <p className="tool-callout-label">
              <Target size={15} aria-hidden="true" />
              Example
            </p>
            <h4 className="tool-callout-title">2022–2024 tightening cycle</h4>
            <div className="tool-callout-body">
              <p>
                The Fed raised i from ~0% to 5.5% to fight inflation. But the output gap didn't fall as much as the
                textbook IS suggested because:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
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
        </div>
      )}

      {/* === FOOTER: BRIDGE TO POLICY === */}
      <InfoBox type="success" title="How to use this tool as a trader or policymaker">
        <p>
          <strong>For central bankers:</strong> Estimate rⁿ, monitor term premiums and credit spreads in real-time.
          Calibrate policy using the NK IS. Recognize that QE, forward guidance, and lending facilities also
          tighten or loosen financial conditions beyond i alone.
        </p>
        <p className="mt-2">
          <strong>For macro traders:</strong> When spreads widen, expect demand destruction even if i is unchanged.
          When the policy rate is above natural AND spreads are tight, the economy is double-squeezed. Use
          decomposition to ask: "Is tightening from policy rates, spreads, or growth expectations?"
        </p>
        <p className="mt-2">
          <strong>For investors:</strong> Evaluate whether current financial conditions are restrictive (output gap
          negative) or supportive. Real rate 2–3% above natural = growth likely slowing. Credit spread &gt; 400 bps =
          significant tail risk.
        </p>
      </InfoBox>
    </div>
  )
}
