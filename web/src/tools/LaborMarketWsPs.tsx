import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  ScatterChart,
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
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

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
  let activeProductivity = laborProductivity

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
  const calculateWSWage = (unemployment: number): number => {
    // Ensure unemployment is between 0 and 1
    const u = Math.max(0, Math.min(1, unemployment))
    // WS Curve: workers demand higher wages when unemployment is low
    const wageFloor = activeBenefits * activeProductivity
    const wageResponsiveness = (1 - activeBenefits) * activeProductivity * (1 - activeBargaining * u)
    return wageFloor + wageResponsiveness
  }

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
  const calculatePSWage = (): number => {
    // PS Curve: firms offer a fixed real wage based on markup
    return (activeProductivity / (1 + activeMarkup))
  }

  /**
   * Find Equilibrium Point
   * 
   * Natural Rate of Unemployment (u_n) occurs where WS = PS
   * At this point, inflation expectations are met (P = P^e)
   */
  const findEquilibrium = (): EquilibriumPoint => {
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
  }

  const equilibrium = useMemo(() => findEquilibrium(), [
    activeBargaining,
    activeMarkup,
    activeBenefits,
    activeProductivity,
  ])

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
  }, [activeBargaining, activeMarkup, activeBenefits, activeProductivity])

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
  }, [activeBargaining, activeMarkup, activeBenefits, activeProductivity])

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
  }, [equilibrium.unemployment, activeBargaining, activeMarkup, activeBenefits, activeProductivity])

  /**
   * Custom tooltip for detailed information
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      const excess = data.wsWage - data.psWage
      const excessPercent = ((excess / data.psWage) * 100).toFixed(1)
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '12px',
        }}>
          <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
            Unemployment: {(data.unemployment * 100).toFixed(1)}%
          </p>
          <p style={{ margin: '2px 0', color: '#ff7300' }}>
            WS (Workers demand): {data.wsWage.toFixed(3)}
          </p>
          <p style={{ margin: '2px 0', color: '#0088fe' }}>
            PS (Firms offer): {data.psWage.toFixed(3)}
          </p>
          <p style={{ margin: '4px 0 0 0', color: excess > 0 ? '#ff6b6b' : '#51cf66', fontWeight: 'bold' }}>
            {excess > 0 ? '↑ Wage pressure' : excess < 0 ? '↓ Employment pressure' : 'Equilibrium'}
            ({excessPercent}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div style={{ padding: '2rem' }}>
      <ToolHeader
        title="Labor Market WS/PS Diagram"
        description="Explore how wage-setting (WS) and price-setting (PS) curves determine the natural rate of unemployment and equilibrium real wage"
        badge="advanced"
      />

      {/* Main Chart */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>WS/PS Equilibrium Diagram</h3>
        
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="unemployment"
              label={{
                value: 'Unemployment Rate (fraction of labor force)',
                position: 'bottom',
                offset: 20,
              }}
              type="number"
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <YAxis
              label={{
                value: 'Real Wage (W/P)',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }}
              domain={[0, 1.2]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '1rem' }} />

            {/* WS Curve */}
            <Line
              type="monotone"
              dataKey="wsWage"
              stroke="#ff7300"
              strokeWidth={3}
              dot={false}
              name="WS Curve (Workers' Demands)"
              isAnimationActive={false}
            />

            {/* PS Curve */}
            <Line
              type="monotone"
              dataKey="psWage"
              stroke="#0088fe"
              strokeWidth={3}
              dot={false}
              name="PS Curve (Firms' Offers)"
              isAnimationActive={false}
            />

            {/* Equilibrium Point */}
            <ReferenceLine
              x={equilibrium.unemployment}
              stroke="#8884d8"
              strokeDasharray="5 5"
              label={{
                value: `u_n = ${(equilibrium.unemployment * 100).toFixed(1)}%`,
                position: 'top',
                fill: '#8884d8',
                offset: 10,
              }}
            />
            <ReferenceLine
              y={equilibrium.realWage}
              stroke="#8884d8"
              strokeDasharray="5 5"
              label={{
                value: `W/P = ${equilibrium.realWage.toFixed(3)}`,
                position: 'right',
                fill: '#8884d8',
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
              fill="#22c55e"
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
          <strong>Equilibrium:</strong> The natural rate of unemployment (u_n) occurs where the WS and PS curves intersect.
          At this point, inflation expectations are realized and the labor market is in equilibrium.
        </p>
      </div>

      {/* Control Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ marginTop: 0 }}>Worker Bargaining</h3>

          <SliderControl
            label="Bargaining Power"
            value={bargainingPower}
            min={0}
            max={1}
            step={0.05}
            onChange={setBargainingPower}
            unit="(sensitivity to unemployment)"
          />
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Higher values mean workers are more sensitive to unemployment (stronger negotiating position at low unemployment).
          </p>

          <SliderControl
            label="Unemployment Benefits (z)"
            value={benefitRate}
            min={0}
            max={0.8}
            step={0.05}
            onChange={setBenefitRate}
            unit="(% of wage)"
          />
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Higher benefits raise the wage floor, shifting the WS curve upward.
          </p>
        </div>

        <div style={{
          backgroundColor: '#fff',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ marginTop: 0 }}>Firm Pricing</h3>

          <SliderControl
            label="Markup (μ)"
            value={firmMarkup}
            min={0}
            max={0.5}
            step={0.02}
            onChange={setFirmMarkup}
            unit="(over marginal cost)"
          />
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Higher markup increases firm pricing power, lowering the real wage offered (PS curve down).
          </p>

          <SliderControl
            label="Labor Productivity (A)"
            value={laborProductivity}
            min={0.5}
            max={2}
            step={0.1}
            onChange={setLaborProductivity}
            unit="(output per worker)"
          />
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Higher productivity allows higher real wages and shifts both curves upward.
          </p>
        </div>
      </div>

      {/* Scenario Buttons */}
      <div style={{
        backgroundColor: '#f0f9ff',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        border: '1px solid #bfdbfe',
      }}>
        <h3 style={{ marginTop: 0 }}>Policy Scenarios</h3>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
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
      </div>

      {/* Key Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <StatBox
          label="Natural Rate (u_n)"
          value={`${policyImpact.naturalRate}%`}
          color="blue"
        />
        <StatBox label="Equilibrium Real Wage" value={policyImpact.realWage} color="blue" />
        <StatBox label="Wage Floor (z·A)" value={policyImpact.wageFloor} color="blue" />
        <StatBox label="Firm Offering (A/(1+μ))" value={policyImpact.firmOffering} color="blue" />
      </div>

      {/* Detailed Analysis Table */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem',
      }}>
        <h3 style={{ marginTop: 0 }}>Labor Market Dynamics at Different Unemployment Rates</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.9rem',
          }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Scenario</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Unemployment</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>WS (Demand)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>PS (Offer)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Gap</th>
                <th style={{ padding: '0.75rem', textAlign: 'center' }}>Situation</th>
              </tr>
            </thead>
            <tbody>
              {analysisPoints.map((point, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: Math.abs(point.excess) < 0.01 ? '#f0fdf4' : undefined,
                  }}
                >
                  <td style={{ padding: '0.75rem', fontWeight: point.excess === 0 ? 'bold' : 'normal' }}>
                    {point.label}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    {(point.unemployment * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ff7300' }}>
                    {point.wsWage.toFixed(3)}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#0088fe' }}>
                    {point.psWage.toFixed(3)}
                  </td>
                  <td style={{
                    padding: '0.75rem',
                    textAlign: 'right',
                    color: point.excess > 0 ? '#ff6b6b' : point.excess < 0 ? '#0088fe' : '#22c55e',
                    fontWeight: 'bold',
                  }}>
                    {point.excess > 0 ? '+' : ''}{(point.excess * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    {point.excess > 0.01 && '📈 Wage Pressure'}
                    {point.excess < -0.01 && '📉 Employment Pressure'}
                    {Math.abs(point.excess) < 0.01 && '⚖️ Equilibrium'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Economic Explanations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        <InfoBox type="info">
          <strong>Wage-Setting (WS) Curve</strong>
          <p>The WS curve shows the real wage workers demand given labor market conditions.</p>
          <p><strong>Formula</strong>: W/P = z + (1 - z)(1 - β·u)</p>
          <p><strong>Key Properties</strong>:</p>
          <ul style={{marginTop: '0.5rem'}}>
            <li>Slopes downward: Low unemployment strengthens worker bargaining power</li>
            <li>Shift factors: Unemployment benefits (z), bargaining power (β), productivity (A)</li>
            <li>At u=0: W/P = 1 (workers get all of productivity)</li>
            <li>At high u: W/P ≈ z (workers stuck with benefit level)</li>
          </ul>
          <p><strong>Policy Implications</strong>: Generous benefits and strong unions shift WS up, increasing natural rate</p>
        </InfoBox>

        <InfoBox type="info">
          <strong>Price-Setting (PS) Curve</strong>
          <p>The PS curve shows the real wage firms are willing to pay based on their pricing power.</p>
          <p><strong>Formula</strong>: W/P = A / (1 + μ)</p>
          <p><strong>Key Properties</strong>:</p>
          <ul style={{marginTop: '0.5rem'}}>
            <li>Horizontal: Doesn't depend on unemployment (firm pricing is exogenous)</li>
            <li>Higher markup → lower real wage offered</li>
            <li>Higher productivity → higher real wage offered</li>
          </ul>
          <p><strong>Policy Implications</strong>: Competition and productivity improvements shift PS, affecting natural rate</p>
        </InfoBox>
      </div>

      <InfoBox type="success">
        <strong>Natural Rate of Unemployment (NAIRU)</strong>
        <p>The natural rate is where WS and PS curves intersect. It's not determined by technology, but by institutional factors:</p>
        <ul style={{marginTop: '0.5rem'}}>
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
