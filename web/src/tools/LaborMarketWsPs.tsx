import { useCallback, useMemo, useState } from 'react'
import {
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
} from 'recharts'
import {
  ToolHeader,
  ToolCallout,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

/** WS and PS keep a fixed economic identity across every chart and readout. */
const WS_STROKE = chartColor(2)
const PS_STROKE = chartColor(0)
const EQ_STROKE = chartColor(3)

/** Sign colours for the WS–PS gap. */
const EXCESS_HIGH = chartColor(4)
const EXCESS_LOW = PS_STROKE
const EXCESS_FLAT = chartColor(1)

/**
 * Labor Market WS/PS Diagram Component
 * 
 * Visualizes the Wage-Setting (WS) and Price-Setting (PS) curves
 * that determine the equilibrium real wage and natural rate of unemployment.
 * 
 * Economic Theory:
 * - WS Curve: Real wage workers can demand based on bargaining power and benefits
 * - PS Curve: Real wage firms are willing to pay based on their markup
 * - Equilibrium: Where WS = PS (natural rate of unemployment)
 */

interface DataPoint {
  unemployment: number
  wsWage: number
  psWage: number
}

interface EquilibriumPoint {
  unemployment: number
  realWage: number
}

export default function LaborMarketWsPs() {
  // Core parameters
  const [bargainingPower, setBargainingPower] = useState(0.5)
  const [firmMarkup, setFirmMarkup] = useState(0.2)
  const [benefitRate, setBenefitRate] = useState(0.4)
  const [laborProductivity, setLaborProductivity] = useState(1.0)
  const [scenarioMode, setScenarioMode] = useState<'baseline' | 'higher-unions' | 'more-competition'>('baseline')

  // Apply scenario presets
  let activeBargaining = bargainingPower
  let activeMarkup = firmMarkup
  let activeBenefits = benefitRate
  const activeProductivity = laborProductivity

  if (scenarioMode === 'higher-unions') {
    activeBargaining = 0.7
    activeBenefits = 0.55
  } else if (scenarioMode === 'more-competition') {
    activeMarkup = 0.1
  }

  /**
   * WS Curve Calculation
   * 
   * Wage-Setting (Worker Perspective):
   * W/P = z + (1 - z) * (1 - β*u)
   * 
   * Where:
   * - z: benefit replacement rate (unemployment benefits as % of wage)
   * - β: bargaining power parameter (sensitivity to unemployment)
   * - u: unemployment rate
   * 
   * Intuition:
   * - When u=0 (full employment): W/P = z + (1-z) = 1 (workers get full productivity)
   * - When u>0: W/P < 1 (unemployment weakens worker bargaining power)
   * - Higher z: Higher wage floor (better benefits)
   * - Higher β: More sensitive to unemployment (stronger bargaining power)
   */
  const calculateWSWage = useCallback(
    (unemployment: number): number => {
      // Ensure unemployment is between 0 and 1
      const u = Math.max(0, Math.min(1, unemployment))
      // WS Curve: workers demand higher wages when unemployment is low
      const wageFloor = activeBenefits * activeProductivity
      const wageResponsiveness =
        (1 - activeBenefits) * activeProductivity * (1 - activeBargaining * u)
      return wageFloor + wageResponsiveness
    },
    [activeBenefits, activeProductivity, activeBargaining],
  )

  /**
   * PS Curve Calculation
   * 
   * Price-Setting (Firm Perspective):
   * W/P = 1 / (1 + μ) * A
   * 
   * Where:
   * - μ: markup over marginal cost (firm pricing power)
   * - A: labor productivity (output per worker)
   * 
   * Intuition:
   * - Firms set prices as markup over marginal cost (wage)
   * - Higher markup → lower real wage firms are willing to pay
   * - PS curve is HORIZONTAL (doesn't depend on unemployment)
   * - Only shifts if markup or productivity changes
   */
  const calculatePSWage = useCallback((): number => {
    // PS Curve: firms offer a fixed real wage based on markup
    return activeProductivity / (1 + activeMarkup)
  }, [activeProductivity, activeMarkup])

  /**
   * Find Equilibrium Point
   * 
   * Natural Rate of Unemployment (u_n) occurs where WS = PS
   * At this point, inflation expectations are met (P = P^e)
   */
  const findEquilibrium = useCallback((): EquilibriumPoint => {
    const psWage = calculatePSWage()

    // Binary search to find unemployment where WS = PS
    let uLow = 0
    let uHigh = 1
    let equilibriumU = 0.5

    for (let i = 0; i < 50; i++) {
      const uMid = (uLow + uHigh) / 2
      const wsWage = calculateWSWage(uMid)

      if (wsWage > psWage) {
        uLow = uMid
      } else {
        uHigh = uMid
      }
      equilibriumU = uMid
    }

    return {
      unemployment: equilibriumU,
      realWage: calculatePSWage(),
    }
  }, [calculatePSWage, calculateWSWage])

  const equilibrium = useMemo(() => findEquilibrium(), [findEquilibrium])

  /**
   * Generate chart data points
   */
  const chartData = useMemo(() => {
    const data: DataPoint[] = []
    const psWage = calculatePSWage()
    
    for (let u = 0; u <= 1; u += 0.02) {
      data.push({
        unemployment: parseFloat(u.toFixed(3)),
        wsWage: calculateWSWage(u),
        psWage: psWage,
      })
    }
    return data
  }, [calculatePSWage, calculateWSWage])

  /**
   * Calculate policy effects
   */
  const policyImpact = useMemo(() => {
    const baselineEquilibrium = findEquilibrium()
    
    return {
      naturalRate: (baselineEquilibrium.unemployment * 100).toFixed(1),
      realWage: baselineEquilibrium.realWage.toFixed(3),
      wageFloor: (activeBenefits * activeProductivity).toFixed(3),
      firmOffering: (activeProductivity / (1 + activeMarkup)).toFixed(3),
    }
  }, [findEquilibrium, activeBenefits, activeProductivity, activeMarkup])

  /**
   * Analyze what happens at different unemployment rates
   */
  const analysisPoints = useMemo(() => {
    const psWage = calculatePSWage()
    const points = [
      { label: 'Low Unemployment (5%)', u: 0.05 },
      { label: 'Equilibrium', u: equilibrium.unemployment },
      { label: 'High Unemployment (15%)', u: 0.15 },
    ]
    
    return points.map(point => ({
      label: point.label,
      unemployment: point.u,
      wsWage: calculateWSWage(point.u),
      psWage: psWage,
      excess: calculateWSWage(point.u) - psWage,
    }))
  }, [equilibrium.unemployment, calculatePSWage, calculateWSWage])

  /** The datum shape the WS/PS chart carries per point. */
  interface WsPsPoint {
    unemployment: number
    wsWage: number
    psWage: number
  }

  /**
   * Custom tooltip for detailed information
   */
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { payload: WsPsPoint }[]
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      const excess = data.wsWage - data.psWage
      const excessPercent = ((excess / data.psWage) * 100).toFixed(1)

      return (
        <div className="stat-tile p-3 text-left text-xs">
          <p className="mb-1 font-bold text-fg">
            Unemployment: {(data.unemployment * 100).toFixed(1)}%
          </p>
          <p className="my-0.5" style={{ color: WS_STROKE }}>
            WS (Workers demand): {data.wsWage.toFixed(3)}
          </p>
          <p className="my-0.5" style={{ color: PS_STROKE }}>
            PS (Firms offer): {data.psWage.toFixed(3)}
          </p>
          <p
            className="mt-1 font-bold"
            style={{ color: excess > 0 ? EXCESS_HIGH : excess < 0 ? EXCESS_LOW : EXCESS_FLAT }}
          >
            {excess > 0 ? '↑ Wage pressure' : excess < 0 ? '↓ Employment pressure' : 'Equilibrium'}
            ({excessPercent}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="tool-card">
      <ToolHeader
        title="Labor Market WS/PS Diagram"
        description="Explore how wage-setting (WS) and price-setting (PS) curves determine the natural rate of unemployment and equilibrium real wage"
        badge="advanced"
      />

      {/* Main Chart */}
      <div className="visualization-container">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">WS/PS Equilibrium Diagram</h3>

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
          >
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="unemployment"
              label={{
                value: 'Unemployment Rate (fraction of labor force)',
                position: 'bottom',
                offset: 20,
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Real Wage (W/P)',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[0, 1.2]}
              {...chartTheme.axis}
            />
            <Tooltip content={<CustomTooltip />} cursor={chartTheme.cursor} />
            <Legend {...chartTheme.legend} />

            {/* WS Curve */}
            <Line
              type="monotone"
              dataKey="wsWage"
              stroke={WS_STROKE}
              strokeWidth={3}
              dot={false}
              name="WS Curve (Workers' Demands)"
              isAnimationActive={false}
            />

            {/* PS Curve */}
            <Line
              type="monotone"
              dataKey="psWage"
              stroke={PS_STROKE}
              strokeWidth={3}
              dot={false}
              name="PS Curve (Firms' Offers)"
              isAnimationActive={false}
            />

            {/* Equilibrium Point */}
            <ReferenceLine
              x={equilibrium.unemployment}
              stroke={EQ_STROKE}
              strokeDasharray="5 5"
              label={{
                value: `u_n = ${(equilibrium.unemployment * 100).toFixed(1)}%`,
                position: 'top',
                fill: EQ_STROKE,
                offset: 10,
              }}
            />
            <ReferenceLine
              y={equilibrium.realWage}
              stroke={EQ_STROKE}
              strokeDasharray="5 5"
              label={{
                value: `W/P = ${equilibrium.realWage.toFixed(3)}`,
                position: 'right',
                fill: EQ_STROKE,
                offset: 10,
              }}
            />

            {/* Equilibrium point marker */}
            <Scatter
              dataKey="wsWage"
              data={[{
                unemployment: equilibrium.unemployment,
                wsWage: equilibrium.realWage,
                psWage: equilibrium.realWage,
              }]}
              fill={chartColor(1)}
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <p className="mt-4 text-sm leading-relaxed text-fg-muted">
          <strong>Equilibrium:</strong> The natural rate of unemployment (u_n) occurs where the WS and PS curves intersect.
          At this point, inflation expectations are realized and the labor market is in equilibrium.
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-8 grid gap-8 lg:grid-cols-2">
        <div className="control-panel block">
          <h3 className="mb-4 font-serif text-lg font-bold text-fg">Worker Bargaining</h3>

          <SliderControl
            label="Bargaining Power"
            value={bargainingPower}
            min={0}
            max={1}
            step={0.05}
            onChange={setBargainingPower}
          />
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Higher values mean workers are more sensitive to unemployment (stronger negotiating position at low unemployment).
          </p>

          <SliderControl
            label="Unemployment Benefits (z)"
            value={benefitRate}
            min={0}
            max={0.8}
            step={0.05}
            onChange={setBenefitRate}
          />
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Higher benefits raise the wage floor, shifting the WS curve upward.
          </p>
        </div>

        <div className="control-panel block">
          <h3 className="mb-4 font-serif text-lg font-bold text-fg">Firm Pricing</h3>

          <SliderControl
            label="Markup (μ)"
            value={firmMarkup}
            min={0}
            max={0.5}
            step={0.02}
            onChange={setFirmMarkup}
          />
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Higher markup increases firm pricing power, lowering the real wage offered (PS curve down).
          </p>

          <SliderControl
            label="Labor Productivity (A)"
            value={laborProductivity}
            min={0.5}
            max={2}
            step={0.1}
            onChange={setLaborProductivity}
          />
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            Higher productivity allows higher real wages and shifts both curves upward.
          </p>
        </div>
      </div>

      {/* Scenario Buttons */}
      <ToolCallout label="Experiments" variant="try" title="Policy Scenarios">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              setScenarioMode('baseline')
              setBargainingPower(0.5)
              setFirmMarkup(0.2)
              setBenefitRate(0.4)
              setLaborProductivity(1.0)
            }}
            variant={scenarioMode === 'baseline' ? 'primary' : 'secondary'}
          >
            Baseline
          </Button>
          <Button
            onClick={() => {
              setScenarioMode('higher-unions')
              setBargainingPower(0.7)
              setFirmMarkup(0.2)
              setBenefitRate(0.55)
              setLaborProductivity(1.0)
            }}
            variant={scenarioMode === 'higher-unions' ? 'primary' : 'secondary'}
          >
            Stronger Unions
          </Button>
          <Button
            onClick={() => {
              setScenarioMode('more-competition')
              setBargainingPower(0.5)
              setFirmMarkup(0.1)
              setBenefitRate(0.4)
              setLaborProductivity(1.0)
            }}
            variant={scenarioMode === 'more-competition' ? 'primary' : 'secondary'}
          >
            More Competition
          </Button>
        </div>
      </ToolCallout>

      {/* Key Statistics */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox
          label="Natural Rate (u_n)"
          value={`${policyImpact.naturalRate}%`}
          tone="accent"
        />
        <StatBox label="Equilibrium Real Wage" value={policyImpact.realWage} tone="accent" />
        <StatBox label="Wage Floor (z·A)" value={policyImpact.wageFloor} tone="accent" />
        <StatBox
          label="Firm Offering (A/(1+μ))"
          value={policyImpact.firmOffering}
          tone="accent"
        />
      </div>

      {/* Detailed Analysis Table */}
      <div className="card mb-8 p-6">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Labor Market Dynamics at Different Unemployment Rates
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="px-3 py-2 text-left font-semibold text-fg">Scenario</th>
                <th className="px-3 py-2 text-right font-semibold text-fg">Unemployment</th>
                <th className="px-3 py-2 text-right font-semibold text-fg">WS (Demand)</th>
                <th className="px-3 py-2 text-right font-semibold text-fg">PS (Offer)</th>
                <th className="px-3 py-2 text-right font-semibold text-fg">Gap</th>
                <th className="px-3 py-2 text-center font-semibold text-fg">Situation</th>
              </tr>
            </thead>
            <tbody>
              {analysisPoints.map((point, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-border ${
                    Math.abs(point.excess) < 0.01 ? 'bg-tier-beginner/10' : 'bg-surface'
                  }`}
                >
                  <td
                    className={`px-3 py-2.5 text-left text-fg ${
                      point.excess === 0 ? 'font-bold' : ''
                    }`}
                  >
                    {point.label}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {(point.unemployment * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-right" style={{ color: WS_STROKE }}>
                    {point.wsWage.toFixed(3)}
                  </td>
                  <td className="px-3 py-2.5 text-right" style={{ color: PS_STROKE }}>
                    {point.psWage.toFixed(3)}
                  </td>
                  <td
                    className="px-3 py-2.5 text-right font-bold"
                    style={{
                      color:
                        point.excess > 0
                          ? EXCESS_HIGH
                          : point.excess < 0
                            ? EXCESS_LOW
                            : EXCESS_FLAT,
                    }}
                  >
                    {point.excess > 0 ? '+' : ''}
                    {(point.excess * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-center text-fg-muted">
                    {point.excess > 0.01 && 'Wage pressure'}
                    {point.excess < -0.01 && 'Employment pressure'}
                    {Math.abs(point.excess) < 0.01 && 'Equilibrium'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Economic Explanations */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoBox type="info" title="Wage-Setting (WS) Curve">
          <p>The WS curve shows the real wage workers demand given labor market conditions.</p>
          <p>
            <strong>Formula</strong>: W/P = z + (1 - z)(1 - β·u)
          </p>
          <p>
            <strong>Key Properties</strong>:
          </p>
          <ul className="mt-2">
            <li>Slopes downward: Low unemployment strengthens worker bargaining power</li>
            <li>Shift factors: Unemployment benefits (z), bargaining power (β), productivity (A)</li>
            <li>At u=0: W/P = 1 (workers get all of productivity)</li>
            <li>At high u: W/P ≈ z (workers stuck with benefit level)</li>
          </ul>
          <p className="mt-2">
            <strong>Policy Implications</strong>: Generous benefits and strong unions shift WS up,
            increasing natural rate
          </p>
        </InfoBox>

        <InfoBox type="info" title="Price-Setting (PS) Curve">
          <p>The PS curve shows the real wage firms are willing to pay based on their pricing power.</p>
          <p>
            <strong>Formula</strong>: W/P = A / (1 + μ)
          </p>
          <p>
            <strong>Key Properties</strong>:
          </p>
          <ul className="mt-2">
            <li>Horizontal: Doesn't depend on unemployment (firm pricing is exogenous)</li>
            <li>Higher markup → lower real wage offered</li>
            <li>Higher productivity → higher real wage offered</li>
          </ul>
          <p className="mt-2">
            <strong>Policy Implications</strong>: Competition and productivity improvements shift PS,
            affecting natural rate
          </p>
        </InfoBox>
      </div>

      <InfoBox type="success" title="Natural Rate of Unemployment (NAIRU)">
        <p>
          The natural rate is where WS and PS curves intersect. It's not determined by technology, but by
          institutional factors:
        </p>
        <ul className="mt-2">
          <li>Below u_n: WS &gt; PS → wage pressure → inflation rises</li>
          <li>Above u_n: WS &lt; PS → wage pressure falls → inflation declines</li>
          <li>↑ Bargaining power → ↑ u_n</li>
          <li>↑ Unemployment benefits → ↑ u_n</li>
          <li>↑ Competition (↓ markup) → ↓ u_n</li>
        </ul>
      </InfoBox>
    </div>
  )
}
