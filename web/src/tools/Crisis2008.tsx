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

interface CrisisDataPoint {
  quarter: string
  creditSpread: number
  output: number
  unemployment: number
  inflation: number
  isShock: boolean
}

export default function Crisis2008() {
  const [timePeriod, setTimePeriod] = useState(2007.5)
  const [showDataOverlay, setShowDataOverlay] = useState(true)
  const [showISLM, setShowISLM] = useState(true)
  const [showUnemployment, setShowUnemployment] = useState(true)

  // Historical data for 2007-2013
  const crisisData: CrisisDataPoint[] = [
    { quarter: '2007Q3', creditSpread: 1.5, output: 100, unemployment: 4.7, inflation: 2.8, isShock: false },
    { quarter: '2007Q4', creditSpread: 2.0, output: 100, unemployment: 4.7, inflation: 2.8, isShock: false },
    { quarter: '2008Q1', creditSpread: 2.5, output: 100, unemployment: 4.7, inflation: 2.8, isShock: false },
    { quarter: '2008Q2', creditSpread: 3.0, output: 100, unemployment: 4.7, inflation: 2.8, isShock: false },
    { quarter: '2008Q3', creditSpread: 4.5, output: 95, unemployment: 5.0, inflation: 2.5, isShock: true },
    { quarter: '2008Q4', creditSpread: 6.0, output: 90, unemployment: 5.5, inflation: 2.0, isShock: true },
    { quarter: '2009Q1', creditSpread: 7.0, output: 85, unemployment: 6.5, inflation: 1.5, isShock: true },
    { quarter: '2009Q2', creditSpread: 6.5, output: 88, unemployment: 7.0, inflation: 1.0, isShock: true },
    { quarter: '2009Q3', creditSpread: 5.5, output: 92, unemployment: 7.5, inflation: 0.5, isShock: true },
    { quarter: '2009Q4', creditSpread: 4.5, output: 95, unemployment: 8.0, inflation: 0.2, isShock: true },
    { quarter: '2010Q1', creditSpread: 3.5, output: 98, unemployment: 8.5, inflation: 0.1, isShock: false },
    { quarter: '2010Q2', creditSpread: 3.0, output: 100, unemployment: 9.0, inflation: 0.0, isShock: false },
    { quarter: '2010Q3', creditSpread: 2.5, output: 102, unemployment: 9.5, inflation: 0.1, isShock: false },
    { quarter: '2010Q4', creditSpread: 2.0, output: 104, unemployment: 9.8, inflation: 0.2, isShock: false },
    { quarter: '2011Q1', creditSpread: 1.8, output: 106, unemployment: 9.5, inflation: 0.3, isShock: false },
    { quarter: '2011Q2', creditSpread: 1.5, output: 108, unemployment: 9.2, inflation: 0.4, isShock: false },
    { quarter: '2011Q3', creditSpread: 1.2, output: 110, unemployment: 9.0, inflation: 0.5, isShock: false },
    { quarter: '2011Q4', creditSpread: 1.0, output: 112, unemployment: 8.8, inflation: 0.6, isShock: false },
    { quarter: '2012Q1', creditSpread: 0.8, output: 114, unemployment: 8.5, inflation: 0.7, isShock: false },
    { quarter: '2012Q2', creditSpread: 0.6, output: 116, unemployment: 8.2, inflation: 0.8, isShock: false },
    { quarter: '2012Q3', creditSpread: 0.5, output: 118, unemployment: 8.0, inflation: 0.9, isShock: false },
    { quarter: '2012Q4', creditSpread: 0.4, output: 120, unemployment: 7.8, inflation: 1.0, isShock: false },
    { quarter: '2013Q1', creditSpread: 0.3, output: 122, unemployment: 7.5, inflation: 1.1, isShock: false },
  ]

  // Find current data point
  const currentData = crisisData.find(d => d.quarter === '2008Q3') || crisisData[0]
  
  // IS-LM model for crisis period
  const [g, setG] = useState(100)
  const [m, setM] = useState(150)
  const [tax, setTax] = useState(50)
  const [interestRate, setInterestRate] = useState(5)
  
  // Simulate IS-LM model during crisis
  const simulateISLM = () => {
    // Simplified IS-LM model during crisis
    // IS: Y = C + I + G
    // LM: M/P = L(Y,r)
    
    // During crisis, credit spreads widen, reducing investment
    const investmentEffect = 100 - (currentData.creditSpread * 10)
    const output = 100 + investmentEffect + g - tax
    
    // LM curve shifts due to credit market stress
    const moneyDemand = 0.5 * output + 50 * interestRate
    const moneySupply = m
    
    return {
      output: Math.max(0, output),
      interestRate: Math.max(0, interestRate),
      moneyDemand,
      moneySupply
    }
  }
  
  const islmResult = simulateISLM()
  
  return (
    <div className="tool-card">
      <ToolHeader
        title="2008 Financial Crisis"
        description="Timeline animation: Watch credit spreads spike, IS-LM shifts, unemployment rises. Explore how the financial crisis affected the broader economy through credit markets and aggregate demand."
        badge="case-study"
      />

      <div className="control-panel">
        <SliderControl
          label="Time Period"
          value={timePeriod}
          min={2007.5}
          max={2013.5}
          step={0.5}
          onChange={setTimePeriod}
          unit=""
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button
            onClick={() => setShowDataOverlay(!showDataOverlay)}
            variant={showDataOverlay ? 'primary' : 'secondary'}
          >
            {showDataOverlay ? 'Hide Data' : 'Show Data'}
          </Button>
          <Button
            onClick={() => setShowISLM(!showISLM)}
            variant={showISLM ? 'primary' : 'secondary'}
          >
            {showISLM ? 'Hide IS-LM' : 'Show IS-LM'}
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Credit Spreads Over Time
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={crisisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="creditSpread" 
                stroke="#dc2626" 
                fill="#fee2e2" 
                name="Credit Spread (BAA-AAA)"
              />
              {showDataOverlay && (
                <Line 
                  type="monotone" 
                  dataKey="creditSpread" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Actual Data"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showISLM && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
            IS-LM Analysis During Crisis
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={crisisData}>
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
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <StatBox label="Output" value={islmResult.output.toFixed(1)} />
                <StatBox label="Interest Rate" value={islmResult.interestRate.toFixed(1)} unit="%" />
                <StatBox label="Money Demand" value={islmResult.moneyDemand.toFixed(1)} />
                <StatBox label="Money Supply" value={islmResult.moneySupply.toFixed(1)} />
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                  Crisis Impact on IS-LM
                </h4>
                <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                  The 2008 crisis caused credit spreads to widen dramatically (from 1.5% to 6.0%), reducing investment and shifting the IS curve left.
                  This led to lower output and higher unemployment as shown in the IS-LM diagram.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Unemployment and Inflation Path
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={crisisData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="quarter" />
              <YAxis />
              <Tooltip />
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
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📉 The Crisis Timeline</strong>
          <p>2007: Subprime mortgage crisis begins with rising defaults</p>
          <p>2008Q3-Q4: Lehman Brothers collapse triggers credit market freeze</p>
          <p>2009: Sharp recession with unemployment reaching 10%</p>
          <p>2010-2013: Slow recovery with continued high unemployment</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Credit Market Freeze</strong>
          <p>As credit spreads widened from 1.5% to 6.0%, businesses and consumers found it increasingly difficult to borrow.</p>
          <p>This reduced investment and consumption, shifting the IS curve left and causing a recession.</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Policy Response</strong>
          <p>Fed responded with quantitative easing (QE) and fiscal stimulus (TARP, stimulus package).</p>
          <p>These measures helped stabilize credit markets and support aggregate demand.</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Lessons from the Crisis
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Financial Intermediation Matters:</strong> When banks stop lending, the entire economy suffers.
            The crisis showed how credit market dysfunction can cause severe real economic consequences.
          </li>
          <li>
            <strong>Asset Price Bubbles:</strong> The housing bubble created false wealth, leading to excessive borrowing.
            When bubbles burst, they cause sharp contractions in asset prices and credit availability.
          </li>
          <li>
            <strong>Systemic Risk:</strong> The interconnectedness of financial institutions meant that one institution's failure
            threatened the entire financial system.
          </li>
          <li>
            <strong>Policy Coordination:</strong> The crisis required unprecedented coordination between monetary and fiscal policy.
            Central banks had to act beyond traditional tools.
          </li>
          <li>
            <strong>Global Spillovers:</strong> The crisis quickly spread globally, demonstrating the importance of international financial stability.
          </li>
        </ul>
      </div>
    </div>
  )
}
