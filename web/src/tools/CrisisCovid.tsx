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
  BarChart,
  Bar,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

interface CovidDataPoint {
  year: number
  output: number
  unemployment: number
  inflation: number
  supplyShock: boolean
  demandShock: boolean
}

export default function CrisisCovid() {
  const [shockType, setShockType] = useState<'demand' | 'supply' | 'combined'>('combined')
  const [showDataOverlay, setShowDataOverlay] = useState(true)
  const [fiscalPolicy, setFiscalPolicy] = useState(100)
  const [monetaryPolicy, setMonetaryPolicy] = useState(50)
  const [timePeriod, setTimePeriod] = useState(2020)

  // Historical data for 2020-2023
  const covidData: CovidDataPoint[] = [
    { year: 2020, output: 100, unemployment: 4.0, inflation: 2.0, supplyShock: false, demandShock: true },
    { year: 2021, output: 105, unemployment: 5.0, inflation: 3.0, supplyShock: false, demandShock: false },
    { year: 2022, output: 102, unemployment: 4.5, inflation: 6.0, supplyShock: true, demandShock: false },
    { year: 2023, output: 104, unemployment: 4.2, inflation: 4.0, supplyShock: false, demandShock: false },
  ]

  // Simulate different policy responses
  const simulatePolicyResponse = () => {
    let outputChange = 0
    let unemploymentChange = 0
    let inflationChange = 0
    
    if (shockType === 'demand') {
      // Demand shock: lockdowns reduce consumption
      outputChange = -15
      unemploymentChange = 3
      inflationChange = -2
    } else if (shockType === 'supply') {
      // Supply shock: supply chain disruptions
      outputChange = -10
      unemploymentChange = 1
      inflationChange = 4
    } else {
      // Combined shock
      outputChange = -12
      unemploymentChange = 2
      inflationChange = 1
    }
    
    // Policy response effects
    const fiscalEffect = fiscalPolicy * 0.02
    const monetaryEffect = monetaryPolicy * 0.01
    
    return {
      output: Math.max(0, 100 + outputChange + fiscalEffect + monetaryEffect),
      unemployment: Math.max(0, 4.0 + unemploymentChange),
      inflation: Math.max(0, 2.0 + inflationChange),
    }
  }
  
  const policyResult = simulatePolicyResponse()

  return (
    <div className="tool-card">
      <ToolHeader
        title="COVID Shock 2020-2023"
        description="Supply vs. demand shocks. Compare fiscal and monetary policy responses."
        badge="case-study"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <SliderControl
            label="Policy Response: Fiscal Stimulus"
            value={fiscalPolicy}
            min={0}
            max={200}
            step={10}
            onChange={setFiscalPolicy}
            unit=""
          />
          <SliderControl
            label="Policy Response: Monetary Easing"
            value={monetaryPolicy}
            min={0}
            max={100}
            step={5}
            onChange={setMonetaryPolicy}
            unit=""
          />
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Shock Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                onClick={() => setShockType('demand')}
                variant={shockType === 'demand' ? 'primary' : 'secondary'}
              >
                Demand Shock
              </Button>
              <Button
                onClick={() => setShockType('supply')}
                variant={shockType === 'supply' ? 'primary' : 'secondary'}
              >
                Supply Shock
              </Button>
              <Button
                onClick={() => setShockType('combined')}
                variant={shockType === 'combined' ? 'primary' : 'secondary'}
              >
                Combined
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
          Output, Unemployment, and Inflation Path
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={covidData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="output" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Output (Y)"
              />
              <Line 
                type="monotone" 
                dataKey="unemployment" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Unemployment Rate"
              />
              <Line 
                type="monotone" 
                dataKey="inflation" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Inflation Rate"
              />
              {showDataOverlay && (
                <Line 
                  type="monotone" 
                  dataKey="output" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Actual Data"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Policy Response Comparison
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Output', value: policyResult.output },
                { name: 'Unemployment', value: policyResult.unemployment },
                { name: 'Inflation', value: policyResult.inflation },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatBox label="Output" value={policyResult.output.toFixed(1)} />
              <StatBox label="Unemployment" value={policyResult.unemployment.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={policyResult.inflation.toFixed(1)} unit="%" />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                Policy Response Effects
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                {shockType === 'demand' && 
                  "Demand shock (lockdowns) reduced output by 15% and increased unemployment by 3 points. Fiscal and monetary policy helped offset these effects."}
                {shockType === 'supply' && 
                  "Supply shock (supply chain disruptions) reduced output by 10% and increased inflation by 4 points. Monetary policy alone couldn't address this."}
                {shockType === 'combined' && 
                  "Combined shock reduced output by 12% and increased unemployment by 2 points. Both fiscal and monetary policy were needed to stabilize the economy."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📉 The 2020-2023 Shock</strong>
          <p>2020: Global pandemic caused massive demand shock with lockdowns and reduced consumption</p>
          <p>2021: Recovery began with fiscal stimulus and monetary easing</p>
          <p>2022: Supply chain disruptions created stagflationary pressure</p>
          <p>2023: Gradual normalization with continued policy support</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Dual Nature of the Shock</strong>
          <p>The pandemic created both demand and supply shocks simultaneously.</p>
          <p>Demand shock from lockdowns reduced consumption and investment.</p>
          <p>Supply shock from disrupted supply chains increased costs and reduced production.</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Policy Response</strong>
          <p>Massive fiscal stimulus (trillions in government spending)</p>
          <p>Unprecedented monetary easing (near-zero rates, QE programs)</p>
          <p>Central banks coordinated internationally to prevent systemic collapse</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Lessons from the Pandemic
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Unprecedented Policy Response:</strong> The scale of fiscal and monetary policy response was unprecedented in peacetime.
          </li>
          <li>
            <strong>Supply Chain Vulnerabilities:</strong> The crisis exposed fragility in global supply chains, prompting discussions about reshoring and diversification.
          </li>
          <li>
            <strong>Policy Coordination:</strong> Effective coordination between fiscal and monetary policy was crucial for stabilizing the economy.
          </li>
          <li>
            <strong>Unequal Impact:</strong> The pandemic disproportionately affected certain sectors and demographics, highlighting inequality concerns.
          </li>
          <li>
            <strong>Technology Acceleration:</strong> The crisis accelerated digital transformation and remote work adoption.
          </li>
        </ul>
      </div>
    </div>
  )
}
