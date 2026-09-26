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
} from 'recharts'
import {
  ToolHeader,
  ToolCallout,
  SliderControl,
  StatBox,
  Button,
  ToggleDot,
  InfoBox,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

interface EquilibriumPoint {
  unemployment: number
  realWage: number
  exists: boolean
}

export default function LaborMarket() {
  // Core parameters
  const [bargainingPower, setBargainingPower] = useState(0.5)
  const [firmMarkup, setFirmMarkup] = useState(0.2)
  const [benefitRate, setBenefitRate] = useState(0.4)
  const [laborForce, setLaborForce] = useState(100)

  // Scenario comparison mode
  const [compareScenarios, setCompareScenarios] = useState(false)

  // WS Curve: W/P = (1 - α*u + β*z) where α captures bargaining elasticity
  // Modified to: W/P = z + (1 - z) * (1 - bargainingPower * u)
  const calculateWSCurve = (
    unemployment: number,
    beta: number,
    z: number,
  ): number => {
    // z is benefit replacement rate, beta is bargaining sensitivity
    // Higher benefits and higher bargaining power → higher wage floor
    return z + (1 - z) * (1 - beta * unemployment)
  }

  // PS Curve: W/P = 1/(1+μ) - horizontal line
  const calculatePSCurve = (markup: number): number => {
    return 1 / (1 + markup)
  }

  // Find equilibrium: where WS = PS
  const findEquilibrium = (
    beta: number,
    mu: number,
    z: number,
  ): EquilibriumPoint => {
    const psWage = calculatePSCurve(mu)
    const wsIntercept = z + (1 - z) // At u=0
    const wsSlope = -(1 - z) * beta

    // WS: W/P = wsIntercept + wsSlope * u
    // PS: W/P = psWage
    // Solve: wsIntercept + wsSlope * u = psWage
    const u = (psWage - wsIntercept) / wsSlope

    if (u < 0 || u > 1) {
      return { unemployment: 0.5, realWage: psWage, exists: false }
    }

    return {
      unemployment: u,
      realWage: psWage,
      exists: true,
    }
  }

  const equilibrium = findEquilibrium(bargainingPower, firmMarkup, benefitRate)

  // Generate curve data for visualization
  const generateCurveData = (
    beta: number,
    mu: number,
    z: number,
  ) => {
    const data = []
    for (let u = 0; u <= 0.12; u += 0.01) {
      data.push({
        unemployment: Math.round(u * 1000) / 10, // Convert to percentage
        ws: Math.max(0.4, calculateWSCurve(u, beta, z)),
        ps: calculatePSCurve(mu),
      })
    }
    return data
  }

  const curveData = generateCurveData(bargainingPower, firmMarkup, benefitRate)

  // Scenario data for comparison
  const weakUnionsEquilibrium = findEquilibrium(0.2, firmMarkup, benefitRate)
  const strongUnionsEquilibrium = findEquilibrium(0.8, firmMarkup, benefitRate)
  const highMarkupEquilibrium = findEquilibrium(
    bargainingPower,
    0.4,
    benefitRate,
  )
  const lowMarkupEquilibrium = findEquilibrium(bargainingPower, 0.1, benefitRate)

  // Calculate inflation pressures
  const naturalRate = 0.05 // Assumed NAIRU
  const unemploymentPressure =
    equilibrium.unemployment < naturalRate
      ? 'Inflationary Pressure'
      : 'Deflationary Pressure'
  const wageInflationSign =
    equilibrium.unemployment < naturalRate ? '+' : ''

  return (
    <div className="tool-card">
      <ToolHeader
        title="Labor Market: WS/PS Diagram"
        description="Explore how wage-setting and price-setting curves determine equilibrium unemployment and real wages. Analyze the effects of union bargaining power, firm markups, and unemployment benefits on labor market outcomes."
        badge="intermediate"
      />

      <div className="control-panel">
        <SliderControl
          label="Union Bargaining Power (β)"
          value={bargainingPower}
          min={0.1}
          max={1.0}
          step={0.1}
          onChange={setBargainingPower}
          unit=""
        />
        <SliderControl
          label="Firm Markup (μ)"
          value={firmMarkup}
          min={0.1}
          max={0.5}
          step={0.05}
          onChange={setFirmMarkup}
          unit=""
        />
        <SliderControl
          label="Benefits Replacement Rate (z)"
          value={benefitRate}
          min={0}
          max={0.8}
          step={0.1}
          onChange={setBenefitRate}
          unit=""
        />
        <SliderControl
          label="Labor Force"
          value={laborForce}
          min={90}
          max={110}
          step={5}
          onChange={setLaborForce}
          unit="millions"
        />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox
          label="Equilibrium Unemployment (u*)"
          value={(equilibrium.unemployment * 100).toFixed(2)}
          unit="%"
          tone="accent"
        />
        <StatBox
          label="Equilibrium Real Wage (W/P)*"
          value={equilibrium.realWage.toFixed(3)}
          tone="accent"
        />
        <StatBox
          label="Natural Rate (NAIRU)"
          value={(naturalRate * 100).toFixed(1)}
          unit="%"
        />
        <StatBox
          label="Employment Level"
          value={(laborForce * (1 - equilibrium.unemployment)).toFixed(1)}
          unit="millions"
          tone="accent"
        />
      </div>

      <div className="visualization-container">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">WS/PS Equilibrium Diagram</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={curveData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="unemployment"
              label={{
                value: 'Unemployment Rate (%)',
                position: 'insideBottomRight',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              domain={[0, 12]}
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Real Wage (W/P)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[0.4, 1.2]}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) =>
                typeof value === 'number' ? value.toFixed(3) : value
              }
              labelFormatter={(label) =>
                `u = ${typeof label === 'number' ? label.toFixed(1) : label}%`
              }
            />
            <Legend {...chartTheme.legend} />
            {/* PS Curve (horizontal) */}
            <Line
              type="monotone"
              dataKey="ps"
              stroke={chartColor(4)}
              strokeWidth={2}
              name="PS Curve (Price-Setting)"
              dot={false}
              isAnimationActive={false}
            />
            {/* WS Curve (upward sloping) */}
            <Line
              type="monotone"
              dataKey="ws"
              stroke={chartColor(0)}
              strokeWidth={2}
              name="WS Curve (Wage-Setting)"
              dot={false}
              isAnimationActive={false}
            />
            {/* Natural rate marker */}
            <ReferenceLine
              x={naturalRate * 100}
              stroke={chartColor(3)}
              strokeDasharray="5 5"
              label={{
                value: `NAIRU (${(naturalRate * 100).toFixed(1)}%)`,
                position: 'top',
                fill: chartColor(3),
                fontSize: 12,
              }}
            />
            {/* Equilibrium point - add custom dot */}
            {equilibrium.exists && (
              <ReferenceLine
                x={equilibrium.unemployment * 100}
                stroke={chartColor(1)}
                strokeWidth={0}
                label={{
                  value: `Equilibrium (u*: ${(equilibrium.unemployment * 100).toFixed(1)}%)`,
                  position: 'right',
                  fill: chartColor(1),
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ToolCallout label="Diagnosis" variant="insight" title="Inflation Pressures">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <strong className="text-fg">Unemployment vs NAIRU:</strong>
            <p className="mt-2 text-tier-beginner-ink">
              {equilibrium.unemployment < naturalRate
                ? `u* (${(equilibrium.unemployment * 100).toFixed(1)}%) < NAIRU (${(naturalRate * 100).toFixed(1)}%) → Tight labor market`
                : `u* (${(equilibrium.unemployment * 100).toFixed(1)}%) > NAIRU (${(naturalRate * 100).toFixed(1)}%) → Slack labor market`}
            </p>
          </div>
          <div>
            <strong className="text-fg">Wage Inflation Pressure:</strong>
            <p className="mt-2 text-tier-beginner-ink">
              {unemploymentPressure} {wageInflationSign}
            </p>
          </div>
          <div>
            <strong className="text-fg">Expected Impact:</strong>
            <p className="mt-2 text-tier-beginner-ink">
              {equilibrium.unemployment < naturalRate
                ? 'Wages rising faster than productivity → Inflation'
                : 'Wage growth below productivity → Disinflation'}
            </p>
          </div>
        </div>
      </ToolCallout>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant={compareScenarios ? 'primary' : 'secondary'}
          onClick={() => setCompareScenarios(true)}
          pressed={compareScenarios}
        >
          <ToggleDot on={compareScenarios} /> Scenario Analysis
        </Button>
        <Button
          variant={!compareScenarios ? 'primary' : 'secondary'}
          onClick={() => setCompareScenarios(false)}
          pressed={!compareScenarios}
        >
          <ToggleDot on={!compareScenarios} /> Policy Experiments
        </Button>
      </div>

      {compareScenarios ? (
        <div>
          <div className="visualization-container mb-8">
            <h3 className="mb-4 font-serif text-lg font-bold text-fg">Scenario A: Weak vs Strong Unions</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ToolCallout label="Scenario A" variant="try" title="Weak Unions (β = 0.2)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {(weakUnionsEquilibrium.unemployment * 100).toFixed(2)}%
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong>{' '}
                  {weakUnionsEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-3 text-xs opacity-90">
                  Limited bargaining power → Lower real wages, Lower unemployment
                </p>
              </ToolCallout>
              <ToolCallout label="Scenario B" variant="info" title="Strong Unions (β = 0.8)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {(strongUnionsEquilibrium.unemployment * 100).toFixed(2)}%
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong>{' '}
                  {strongUnionsEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-3 text-xs opacity-90">
                  Strong bargaining power → Higher real wages, Higher unemployment
                </p>
              </ToolCallout>
            </div>
          </div>

          <InfoBox type="info" title="Key insight">
            <p>
              Strong unions increase real wages but at the cost of higher equilibrium unemployment.
              There is an inherent trade-off: workers in unions get higher wages, but fewer workers are
              employed overall. This explains why more unionized labor markets (like Nordic countries)
              often have higher structural unemployment rates compared to more competitive labor
              markets.
            </p>
          </InfoBox>
        </div>
      ) : (
        <div>
          <div className="visualization-container mb-8">
            <h3 className="mb-4 font-serif text-lg font-bold text-fg">
              Policy Experiment: Firm Markup Effects
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ToolCallout label="Scenario A" variant="insight" title="Low Markup (μ = 0.1)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {(lowMarkupEquilibrium.unemployment * 100).toFixed(2)}%
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong> {lowMarkupEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-3 text-xs opacity-90">
                  Competitive market → Higher real wages, Lower unemployment
                </p>
              </ToolCallout>
              <ToolCallout label="Scenario B" variant="warning" title="High Markup (μ = 0.4)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {(highMarkupEquilibrium.unemployment * 100).toFixed(2)}%
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong> {highMarkupEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-3 text-xs opacity-90">
                  Monopoly power → Lower real wages, Higher unemployment
                </p>
              </ToolCallout>
            </div>
          </div>

          <InfoBox type="warning" title="Policy implication">
            <p>
              Increasing firm markups (through reduced competition or monopoly power) shifts the PS
              curve down, reducing both real wages AND equilibrium employment. Antitrust enforcement
              and removing barriers to entry improve both wage levels and employment. This explains why
              regulatory capture and monopolistic behavior can harm workers.
            </p>
          </InfoBox>
        </div>
      )}

      <ToolCallout label="Educational insights" variant="lesson" title="Reading the WS/PS model">
        <ul>
          <li>
            <strong>WS Curve Intuition:</strong> Higher unemployment weakens workers' bargaining position (fewer outside options). Also, more generous unemployment benefits raise the reservation wage, shifting WS up.
          </li>
          <li>
            <strong>PS Curve Intuition:</strong> Firms set prices as a markup over costs. The real wage paid depends only on this markup—not on unemployment. PS is always horizontal.
          </li>
          <li>
            <strong>Why Generous Benefits Can Backfire:</strong> Higher unemployment benefits (z) shift WS up, raising the equilibrium unemployment rate. Workers get higher wages, but fewer are employed. This is the unemployment-wage trade-off.
          </li>
          <li>
            <strong>International Variation:</strong> Scandinavian countries have high benefits (z) and strong unions (β) but manage lower unemployment through active labor market policies and coordination. The US has lower benefits and weaker unions, resulting in lower structural unemployment but lower wages.
          </li>
          <li>
            <strong>Firm Competition Effects:</strong> Greater product market competition → lower markups → PS curve shifts up → higher real wages AND lower unemployment. This is why deregulation and antitrust enforcement benefit workers.
          </li>
          <li>
            <strong>Natural Rate of Unemployment:</strong> The NAIRU is determined by institutional factors (union strength, benefits, markups), not demand. Demand-side policies cannot permanently lower it—they only create inflation.
          </li>
        </ul>
      </ToolCallout>
    </div>
  )
}
