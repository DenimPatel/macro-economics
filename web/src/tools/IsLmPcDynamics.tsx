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
  AreaChart,
  Area,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

interface DynamicDataPoint {
  quarter: number
  output: number
  interestRate: number
  inflation: number
  unemployment: number
  isShock: boolean
}

export default function IsLmPcDynamics() {
  const [shockSize, setShockSize] = useState(100)
  const [showDataOverlay, setShowDataOverlay] = useState(true)
  const [fedReaction, setFedReaction] = useState<'passive' | 'aggressive'>('aggressive')
  const [timePeriod, setTimePeriod] = useState(0)

  // Simulated dynamic adjustment path
  const dynamicData: DynamicDataPoint[] = [
    { quarter: 1, output: 100, interestRate: 5, inflation: 2, unemployment: 4.5, isShock: true },
    { quarter: 2, output: 105, interestRate: 6, inflation: 2.5, unemployment: 4.2, isShock: true },
    { quarter: 3, output: 108, interestRate: 7, inflation: 3.0, unemployment: 4.0, isShock: true },
    { quarter: 4, output: 110, interestRate: 8, inflation: 3.5, unemployment: 3.8, isShock: true },
    { quarter: 5, output: 112, interestRate: 9, inflation: 4.0, unemployment: 3.6, isShock: true },
    { quarter: 6, output: 114, interestRate: 10, inflation: 4.5, unemployment: 3.4, isShock: true },
    { quarter: 7, output: 115, interestRate: 11, inflation: 5.0, unemployment: 3.2, isShock: true },
    { quarter: 8, output: 116, interestRate: 12, inflation: 5.5, unemployment: 3.0, isShock: true },
    { quarter: 9, output: 117, interestRate: 11, inflation: 5.2, unemployment: 3.1, isShock: false },
    { quarter: 10, output: 118, interestRate: 10, inflation: 4.8, unemployment: 3.2, isShock: false },
    { quarter: 11, output: 119, interestRate: 9, inflation: 4.5, unemployment: 3.3, isShock: false },
    { quarter: 12, output: 120, interestRate: 8, inflation: 4.2, unemployment: 3.4, isShock: false },
    { quarter: 13, output: 121, interestRate: 7, inflation: 4.0, unemployment: 3.5, isShock: false },
    { quarter: 14, output: 122, interestRate: 6, inflation: 3.8, unemployment: 3.6, isShock: false },
    { quarter: 15, output: 123, interestRate: 5, inflation: 3.5, unemployment: 3.7, isShock: false },
    { quarter: 16, output: 124, interestRate: 4, inflation: 3.2, unemployment: 3.8, isShock: false },
  ]

  // Simulate Fed reaction
  const simulateFedReaction = () => {
    const baseOutput = 100
    const baseInterestRate = 5
    const baseInflation = 2
    const baseUnemployment = 4.5
    
    // Shock effect
    const shockEffect = shockSize * 0.01
    
    // Fed reaction
    const fedEffect = fedReaction === 'aggressive' ? -1.5 : -0.5
    
    return {
      output: baseOutput + shockEffect,
      interestRate: baseInterestRate + (shockEffect * 0.5) + fedEffect,
      inflation: baseInflation + (shockEffect * 0.3),
      unemployment: baseUnemployment - (shockEffect * 0.1),
    }
  }
  
  const fedResult = simulateFedReaction()

  return (
    <div className="tool-card">
      <ToolHeader
        title="IS-LM-PC Dynamic Adjustment"
        description="Watch economy move from short-run to medium-run equilibrium after demand shocks."
        badge="intermediate"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <SliderControl
            label="Demand Shock Size"
            value={shockSize}
            min={50}
            max={200}
            step={10}
            onChange={setShockSize}
            unit=""
          />
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Fed Reaction
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                onClick={() => setFedReaction('passive')}
                variant={fedReaction === 'passive' ? 'primary' : 'secondary'}
              >
                Passive
              </Button>
              <Button
                onClick={() => setFedReaction('aggressive')}
                variant={fedReaction === 'aggressive' ? 'primary' : 'secondary'}
              >
                Aggressive
              </Button>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button
            onClick={() => setShowDataOverlay(!showDataOverlay)}
            variant={showDataOverlay ? 'primary' : 'secondary'}
          >
            {showDataOverlay ? 'Hide Data' : 'Show Data'}
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Dynamic Adjustment Path
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dynamicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="output" 
                stroke="#3b82f6" 
                fill="#dbeafe" 
                name="Output (Y)"
              />
              <Area 
                type="monotone" 
                dataKey="interestRate" 
                stroke="#f59e0b" 
                fill="#fef3c7" 
                name="Interest Rate (r)"
              />
              <Area 
                type="monotone" 
                dataKey="inflation" 
                stroke="#10b981" 
                fill="#d1fae5" 
                name="Inflation (π)"
              />
              <Area 
                type="monotone" 
                dataKey="unemployment" 
                stroke="#8b5cf6" 
                fill="#ede9fe" 
                name="Unemployment (u)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Quarter-by-Quarter Dynamics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dynamicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="output" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Output"
                />
                <Line 
                  type="monotone" 
                  dataKey="interestRate" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Interest Rate"
                />
                <Line 
                  type="monotone" 
                  dataKey="inflation" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Inflation"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatBox label="Output" value={fedResult.output.toFixed(1)} />
              <StatBox label="Interest Rate" value={fedResult.interestRate.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={fedResult.inflation.toFixed(1)} unit="%" />
              <StatBox label="Unemployment" value={fedResult.unemployment.toFixed(1)} unit="%" />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                Dynamic Adjustment Process
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                {fedReaction === 'aggressive' 
                  ? "Aggressive Fed reaction (tightening) reduces inflation but also slows output growth. The economy converges to a new equilibrium with lower inflation and slightly lower output."
                  : "Passive Fed reaction allows inflation to rise more but keeps output growth higher. The economy converges to a higher inflation equilibrium."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📉 The Adjustment Process</strong>
          <p>Quarter 1-4: Initial demand shock causes output to rise, interest rates to increase, and inflation to rise</p>
          <p>Quarter 5-8: As inflation rises, Fed responds with tighter monetary policy</p>
          <p>Quarter 9+: Economy converges to new equilibrium with lower output growth and stable inflation</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Phillips Curve Dynamics</strong>
          <p>As inflation rises, the Phillips Curve shifts upward</p>
          <p>This creates a trade-off between output and inflation in the short-run</p>
          <p>Eventually, the economy reaches a new medium-run equilibrium</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Policy Implications</strong>
          <p>Central banks must balance short-run stabilization with long-run price stability</p>
          <p>Aggressive policy can reduce inflation but may slow growth</p>
          <p>Passive policy allows faster growth but risks higher inflation</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Insights from Dynamic Adjustment
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Short-Run vs Long-Run:</strong> In the short-run, there's a trade-off between output and inflation.
            In the long-run, the economy returns to its natural rate of unemployment regardless of inflation.
          </li>
          <li>
            <strong>Policy Effectiveness:</strong> The effectiveness of monetary policy depends on the Fed's reaction function.
            Aggressive tightening can reduce inflation but may slow growth.
          </li>
          <li>
            <strong>Expectations:</strong> If people expect higher inflation, the Phillips Curve shifts upward.
            This makes it harder for policymakers to achieve low inflation without sacrificing output.
          </li>
          <li>
            <strong>Time Horizon:</strong> The adjustment process takes several quarters to complete.
            This is why policy decisions must account for lags in economic effects.
          </li>
          <li>
            <strong>Stability:</strong> The dynamic adjustment shows how the economy naturally moves toward equilibrium.
            This provides a framework for understanding economic fluctuations and policy responses.
          </li>
        </ul>
      </div>
    </div>
  )
}
