import { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

interface SolowData {
  k: number
  y: number
  investment: number
  depreciation: number
}

interface TimePathData {
  year: number
  k: number
  y: number
}

export default function SolowSimulator() {
  // Control parameters
  const [savingsRate, setSavingsRate] = useState(0.2)
  const [depreciationRate, setDepreciationRate] = useState(0.05)
  const [populationGrowth, setPopulationGrowth] = useState(0.02)
  const [capitalShare, setCapitalShare] = useState(0.3)
  const [initialK, setInitialK] = useState(1.0)
  const [scenarioMode, setScenarioMode] = useState<'custom' | 'high-savings' | 'low-growth'>('custom')

  // Apply scenario presets
  let activeS = savingsRate
  let activeN = populationGrowth
  let activeD = depreciationRate
  let activeAlpha = capitalShare
  let activeK0 = initialK

  if (scenarioMode === 'high-savings') {
    activeS = 0.35
  } else if (scenarioMode === 'low-growth') {
    activeN = 0.01
  }

  // Calculate steady state
  const kStar = Math.pow(activeS / (activeN + activeD), 1 / (1 - activeAlpha))
  const yStar = Math.pow(kStar, activeAlpha)
  const cStar = (1 - activeS) * yStar
  const investmentRateSS = activeS * yStar
  const depreciationSS = (activeN + activeD) * kStar

  // Calculate time to 90% of steady state
  let timeToConvergence = 0
  let tempK = activeK0
  while (tempK < 0.9 * kStar && timeToConvergence < 1000) {
    tempK = activeS * Math.pow(tempK, activeAlpha) + (1 - activeD) * tempK
    timeToConvergence++
  }

  // Generate Solow diagram data (production function, investment, and depreciation)
  const generateSolowDiagram = (): SolowData[] => {
    const data: SolowData[] = []
    const maxK = Math.max(kStar * 1.5, 4)
    const step = maxK / 50

    for (let k = step; k <= maxK; k += step) {
      const y = Math.pow(k, activeAlpha)
      const investment = activeS * y
      const depreciation = (activeN + activeD) * k

      data.push({
        k: parseFloat(k.toFixed(2)),
        y: parseFloat(y.toFixed(3)),
        investment: parseFloat(investment.toFixed(3)),
        depreciation: parseFloat(depreciation.toFixed(3)),
      })
    }
    return data
  }

  // Generate time path showing convergence to steady state
  const generateTimePath = (): TimePathData[] => {
    const data: TimePathData[] = []
    let k = activeK0
    let y = Math.pow(k, activeAlpha)

    for (let year = 0; year <= 100; year += 1) {
      data.push({
        year,
        k: parseFloat(k.toFixed(3)),
        y: parseFloat(y.toFixed(3)),
      })

      // Update for next period
      const investment = activeS * y
      k = investment + (1 - activeD) * k
      y = Math.pow(k, activeAlpha)

      // Stop if converged
      if (Math.abs(k - kStar) < 0.001) {
        for (let futureYear = year + 1; futureYear <= 100; futureYear += 1) {
          data.push({
            year: futureYear,
            k: parseFloat(kStar.toFixed(3)),
            y: parseFloat(yStar.toFixed(3)),
          })
        }
        break
      }
    }
    return data
  }

  // Generate comparison scenarios
  const generateScenarioComparison = () => {
    // Base scenario (s=0.2, n=0.02, δ=0.05)
    const baseS = 0.2
    const baseN = 0.02
    const baseD = 0.05
    const alpha = 0.3

    const baseK = Math.pow(baseS / (baseN + baseD), 1 / (1 - alpha))
    const baseY = Math.pow(baseK, alpha)

    // High savings scenario (s=0.35)
    const highS = 0.35
    const highK = Math.pow(highS / (baseN + baseD), 1 / (1 - alpha))
    const highY = Math.pow(highK, alpha)

    // Low growth scenario (n=0.01)
    const lowN = 0.01
    const lowK = Math.pow(baseS / (lowN + baseD), 1 / (1 - alpha))
    const lowY = Math.pow(lowK, alpha)

    return [
      {
        name: 'Base (s=0.2)',
        k: parseFloat(baseK.toFixed(2)),
        y: parseFloat(baseY.toFixed(3)),
      },
      {
        name: 'High Savings (s=0.35)',
        k: parseFloat(highK.toFixed(2)),
        y: parseFloat(highY.toFixed(3)),
      },
      {
        name: 'Low Growth (n=0.01)',
        k: parseFloat(lowK.toFixed(2)),
        y: parseFloat(lowY.toFixed(3)),
      },
    ]
  }

  const solowDiagram = generateSolowDiagram()
  const timePath = generateTimePath()
  const scenarios = generateScenarioComparison()

  const resetToDefault = () => {
    setSavingsRate(0.2)
    setDepreciationRate(0.05)
    setPopulationGrowth(0.02)
    setCapitalShare(0.3)
    setInitialK(1.0)
    setScenarioMode('custom')
  }

  return (
    <div className="tool-card">
      <ToolHeader
        title="Solow Growth Model Simulator"
        description="Explore how savings, population growth, and depreciation determine the steady-state capital stock and output. Learn why growth accounting shows technology is the key to long-run growth."
        badge="advanced"
      />

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Model Parameters</h2>
        <div className="control-panel">
          <SliderControl
            label="Savings Rate (s)"
            value={activeS}
            min={0.1}
            max={0.4}
            step={0.05}
            onChange={setSavingsRate}
            unit=""
          />
          <SliderControl
            label="Population Growth (n)"
            value={activeN}
            min={0.01}
            max={0.05}
            step={0.005}
            onChange={setPopulationGrowth}
            unit=""
          />
          <SliderControl
            label="Depreciation Rate (δ)"
            value={activeD}
            min={0.01}
            max={0.1}
            step={0.01}
            onChange={setDepreciationRate}
            unit=""
          />
          <SliderControl
            label="Capital Share (α)"
            value={activeAlpha}
            min={0.2}
            max={0.4}
            step={0.05}
            onChange={setCapitalShare}
            unit=""
          />
          <SliderControl
            label="Initial Capital per Worker (k₀)"
            value={activeK0}
            min={0.5}
            max={3.0}
            step={0.1}
            onChange={setInitialK}
            unit=""
          />
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Scenario Analysis</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button
            onClick={() => setScenarioMode('custom')}
            variant={scenarioMode === 'custom' ? 'primary' : 'secondary'}
          >
            Custom Parameters
          </Button>
          <Button
            onClick={() => setScenarioMode('high-savings')}
            variant={scenarioMode === 'high-savings' ? 'primary' : 'secondary'}
          >
            High Savings (s=0.35)
          </Button>
          <Button
            onClick={() => setScenarioMode('low-growth')}
            variant={scenarioMode === 'low-growth' ? 'primary' : 'secondary'}
          >
            Low Growth (n=0.01)
          </Button>
          <Button onClick={resetToDefault} variant="secondary">
            Reset All
          </Button>
        </div>
      </div>

      {/* Key Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatBox label="Steady State k*" value={kStar.toFixed(2)} highlight />
        <StatBox label="Steady State y*" value={yStar.toFixed(3)} highlight />
        <StatBox label="Steady State Growth Rate" value={(populationGrowth * 100).toFixed(2)} unit="%" highlight />
        <StatBox label="Consumption per Worker (c*)" value={cStar.toFixed(3)} />
        <StatBox label="Investment Rate (ss)" value={(investmentRateSS).toFixed(3)} />
        <StatBox label="Time to 90% Convergence" value={timeToConvergence} unit="years" />
      </div>

      {/* Educational Insight */}
      <div style={{ marginBottom: '2rem' }}>
        <InfoBox type="success">
          <strong>Key Insight:</strong> The steady-state growth rate equals the population growth rate (n = {(populationGrowth * 100).toFixed(2)}%). 
          Notice that changing the savings rate shifts the level of steady-state capital and output but does NOT change the long-run growth rate! 
          Only technological progress (not modeled here) can increase long-run per-capita growth.
        </InfoBox>
      </div>

      {/* Solow Diagram */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Solow Diagram: Capital per Worker Dynamics
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          Investment line (sf(k)) shows capital investment. Depreciation line ((n+δ)k) shows capital wearing away and dilution from population growth.
          At k* where lines intersect, investment = depreciation, and capital per worker is stable.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={solowDiagram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="k" label={{ value: 'Capital per Worker (k)', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Output/Capital per Worker', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: any) => value.toFixed(3)} />
            <Legend />
            <Area type="monotone" dataKey="y" stroke="#3b82f6" fill="#93c5fd" name="Production (y = k^α)" />
            <Area type="monotone" dataKey="investment" stroke="#10b981" fill="#a7f3d0" name="Investment (sy)" />
            <Line type="monotone" dataKey="depreciation" stroke="#ef4444" strokeWidth={2} name="Depreciation ((n+δ)k)" />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Steady state k* = {kStar.toFixed(2)} (marked where investment line crosses depreciation line)
        </p>
      </div>

      {/* Time Path */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Capital Accumulation Over Time: Path to Steady State
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          The economy converges to steady state. If below k*, investment exceeds depreciation, capital grows.
          If above k*, depreciation exceeds investment, capital shrinks. The convergence speed depends on distance from k*.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={timePath}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Capital per Worker (k)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: any) => value.toFixed(3)} />
            <Legend />
            <Line type="monotone" dataKey="k" stroke="#3b82f6" strokeWidth={2} name="Capital per Worker (k)" />
            <Line type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} name="Output per Worker (y)" />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Starting from k₀ = {activeK0.toFixed(1)}, the economy reaches 90% of steady state in {timeToConvergence} years.
          Steady states: k* = {kStar.toFixed(2)}, y* = {yStar.toFixed(3)}
        </p>
      </div>

      {/* Scenario Comparison */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Scenario Comparison: Effects on Steady State
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          Compare different parameter combinations. Notice that higher savings raises k* and y* but growth rate stays at n.
          Lower population growth increases both k* and y*, AND increases long-run per-capita growth rate!
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {scenarios.map((scenario) => (
            <div
              key={scenario.name}
              style={{
                padding: '1rem',
                backgroundColor: '#f1f5f9',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1e293b' }}>
                {scenario.name}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                Steady State k*: <span style={{ fontWeight: '600', color: '#0c4a6e' }}>{scenario.k.toFixed(2)}</span>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                Steady State y*: <span style={{ fontWeight: '600', color: '#0c4a6e' }}>{scenario.y.toFixed(3)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <InfoBox type="info">
          <strong>📊 Diminishing Returns to Capital:</strong> As capital grows, each additional unit of capital produces less output.
          This is why the production function y = k^α curves (α &lt; 1). Rich countries with high k grow slower than poor countries
          catching up, all else equal.
        </InfoBox>

        <InfoBox type="info">
          <strong>🔄 Convergence Hypothesis:</strong> Poor countries can catch up to rich countries if they have the same savings rates,
          population growth, and depreciation rates. This happens because returns to capital are highest when capital is scarce!
          Limited data supports absolute convergence, but conditional convergence (controlling for differences) is strong.
        </InfoBox>

        <InfoBox type="success">
          <strong>🚀 Technology is Key:</strong> The Solow model shows that in steady state, output per worker grows only with
          technological progress (A in Y = A·K^α·L^(1-α)). Long-run growth is "exogenous" - driven by technology, not savings.
          This explains why all countries eventually grow at similar rates despite different savings behavior.
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Capital Deepening vs. Growth:</strong> Increasing savings rate causes temporary acceleration (transition to higher k*),
          but long-run per-capita growth remains at n. To permanently accelerate growth, need technological progress. This explains why
          Asian "growth miracles" eventually slowed as they caught up.
        </InfoBox>
      </div>

      {/* Technical Details */}
      <div style={{ marginBottom: '2rem' }}>
        <details style={{ cursor: 'pointer' }}>
          <summary style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b', userSelect: 'none' }}>
            📐 Model Equations
          </summary>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '4px', marginTop: '0.5rem', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            <div>Production function: Y<sub>t</sub> = K<sub>t</sub><sup>α</sup> · L<sub>t</sub><sup>1-α</sup></div>
            <div style={{ marginTop: '0.5rem' }}>Capital accumulation: K<sub>t+1</sub> = sY<sub>t</sub> + (1-δ)K<sub>t</sub></div>
            <div style={{ marginTop: '0.5rem' }}>Per-worker form: k<sub>t+1</sub> = sy<sub>t</sub>/(1+n) + (1-δ)k<sub>t</sub>/(1+n)</div>
            <div style={{ marginTop: '0.5rem' }}>Steady state: k* = (s/(n+δ))<sup>1/(1-α)</sup></div>
            <div style={{ marginTop: '0.5rem' }}>Steady state output: y* = (k*)<sup>α</sup></div>
            <div style={{ marginTop: '0.5rem' }}>Convergence speed: Higher when further from k*; Slower near steady state</div>
          </div>
        </details>
      </div>
    </div>
  )
}
