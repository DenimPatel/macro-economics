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

interface MundellFlemingDataPoint {
  year: number
  output: number
  interestRate: number
  exchangeRate: number
  inflation: number
  isFloating: boolean
}

export default function MundellFleming() {
  const [policyType, setPolicyType] = useState<'monetary' | 'fiscal'>('monetary')
  const [policyEffect, setPolicyEffect] = useState(50)
  const [exchangeRateType, setExchangeRateType] = useState<'fixed' | 'floating'>('floating')
  const [showDataOverlay, setShowDataOverlay] = useState(true)

  // Simulated Mundell-Fleming model data
  const mfData: MundellFlemingDataPoint[] = [
    { year: 2000, output: 100, interestRate: 5, exchangeRate: 1.0, inflation: 2, isFloating: true },
    { year: 2001, output: 102, interestRate: 6, exchangeRate: 1.05, inflation: 2.5, isFloating: true },
    { year: 2002, output: 104, interestRate: 7, exchangeRate: 1.1, inflation: 3, isFloating: true },
    { year: 2003, output: 106, interestRate: 8, exchangeRate: 1.15, inflation: 3.5, isFloating: true },
    { year: 2004, output: 108, interestRate: 9, exchangeRate: 1.2, inflation: 4, isFloating: true },
    { year: 2005, output: 110, interestRate: 10, exchangeRate: 1.25, inflation: 4.5, isFloating: true },
    { year: 2006, output: 112, interestRate: 11, exchangeRate: 1.3, inflation: 5, isFloating: true },
    { year: 2007, output: 114, interestRate: 12, exchangeRate: 1.35, inflation: 5.5, isFloating: true },
    { year: 2008, output: 116, interestRate: 11, exchangeRate: 1.3, inflation: 5.2, isFloating: true },
    { year: 2009, output: 118, interestRate: 10, exchangeRate: 1.25, inflation: 4.8, isFloating: true },
    { year: 2010, output: 120, interestRate: 9, exchangeRate: 1.2, inflation: 4.5, isFloating: true },
  ]

  // Simulate policy effects
  const simulatePolicyEffect = () => {
    const baseOutput = 100
    const baseInterestRate = 5
    const baseExchangeRate = 1.0
    const baseInflation = 2
    
    // Policy effect
    const policyImpact = policyEffect * 0.01
    
    // Different effects based on policy type and exchange rate regime
    let outputChange = 0
    let interestRateChange = 0
    let exchangeRateChange = 0
    let inflationChange = 0
    
    if (policyType === 'monetary') {
      // Monetary expansion
      outputChange = policyImpact * 2
      interestRateChange = -policyImpact
      if (exchangeRateType === 'floating') {
        exchangeRateChange = -policyImpact * 0.5  // Currency depreciates
      } else {
        // Fixed exchange rate: Fed must sterilize
        exchangeRateChange = 0
        interestRateChange = -policyImpact * 0.5  // Fed raises rates to defend
      }
    } else {
      // Fiscal expansion
      outputChange = policyImpact * 1.5
      interestRateChange = policyImpact
      if (exchangeRateType === 'floating') {
        exchangeRateChange = policyImpact * 0.3  // Currency appreciates
      } else {
        // Fixed exchange rate: Fed must sterilize
        exchangeRateChange = 0
        interestRateChange = policyImpact * 0.5  // Fed raises rates to defend
      }
    }
    
    return {
      output: baseOutput + outputChange,
      interestRate: baseInterestRate + interestRateChange,
      exchangeRate: baseExchangeRate + exchangeRateChange,
      inflation: baseInflation + inflationChange,
    }
  }
  
  const policyResult = simulatePolicyEffect()

  return (
    <div className="tool-card">
      <ToolHeader
        title="Mundell-Fleming Policy Lab"
        description="Compare monetary policy effectiveness under fixed vs. floating exchange rates."
        badge="advanced"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Policy Type
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                onClick={() => setPolicyType('monetary')}
                variant={policyType === 'monetary' ? 'primary' : 'secondary'}
              >
                Monetary
              </Button>
              <Button
                onClick={() => setPolicyType('fiscal')}
                variant={policyType === 'fiscal' ? 'primary' : 'secondary'}
              >
                Fiscal
              </Button>
            </div>
          </div>
          
          <SliderControl
            label="Policy Effect"
            value={policyEffect}
            min={0}
            max={100}
            step={5}
            onChange={setPolicyEffect}
            unit=""
          />
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Exchange Rate Regime
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                onClick={() => setExchangeRateType('fixed')}
                variant={exchangeRateType === 'fixed' ? 'primary' : 'secondary'}
              >
                Fixed
              </Button>
              <Button
                onClick={() => setExchangeRateType('floating')}
                variant={exchangeRateType === 'floating' ? 'primary' : 'secondary'}
              >
                Floating
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
          Policy Effectiveness Comparison
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mfData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
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
                dataKey="exchangeRate" 
                stroke="#10b981" 
                fill="#d1fae5" 
                name="Exchange Rate"
              />
              <Area 
                type="monotone" 
                dataKey="inflation" 
                stroke="#8b5cf6" 
                fill="#ede9fe" 
                name="Inflation (π)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Policy Impact Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mfData.slice(0, 5)}>
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
                  dataKey="exchangeRate" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Exchange Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatBox label="Output" value={policyResult.output.toFixed(1)} />
              <StatBox label="Interest Rate" value={policyResult.interestRate.toFixed(1)} unit="%" />
              <StatBox label="Exchange Rate" value={policyResult.exchangeRate.toFixed(2)} />
              <StatBox label="Inflation" value={policyResult.inflation.toFixed(1)} unit="%" />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                Policy Effectiveness
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                {policyType === 'monetary' 
                  ? (exchangeRateType === 'floating'
                      ? "Monetary expansion is highly effective in a floating exchange rate system. Output increases, interest rates fall, and the currency depreciates."
                      : "Monetary expansion is less effective in a fixed exchange rate system. The central bank must sterilize the policy to maintain the peg, limiting its impact.")
                  : (exchangeRateType === 'floating'
                      ? "Fiscal expansion is moderately effective in a floating exchange rate system. Output increases, interest rates rise, and the currency appreciates."
                      : "Fiscal expansion is less effective in a fixed exchange rate system. The central bank must raise interest rates to defend the peg, offsetting the fiscal stimulus.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📉 Mundell-Fleming Framework</strong>
          <p>Small open economy with perfect capital mobility</p>
          <p>IS-LM-PC model extended to international capital flows</p>
          <p>Exchange rate regime determines policy effectiveness</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Impossible Trinity</strong>
          <p>Cannot simultaneously have fixed exchange rates, free capital mobility, and independent monetary policy</p>
          <p>Must choose two of three options</p>
          <p>Fixed exchange rates require sacrificing monetary independence</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Policy Implications</strong>
          <p>Floating rates allow monetary policy to focus on domestic objectives</p>
          <p>Fixed rates require coordination with international monetary policy</p>
          <p>Capital controls can provide alternative policy flexibility</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Insights from Mundell-Fleming
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Exchange Rate Regimes:</strong> The choice of exchange rate regime fundamentally affects policy effectiveness.
            Fixed rates limit monetary autonomy but provide exchange rate stability.
          </li>
          <li>
            <strong>Capital Mobility:</strong> Perfect capital mobility means that monetary policy is less effective in a fixed rate system.
            Capital flows will offset any attempts to change interest rates.
          </li>
          <li>
            <strong>Policy Trade-offs:</strong> The model shows that policymakers must choose between exchange rate stability, monetary independence, and capital mobility.
          </li>
          <li>
            <strong>Real World Applications:</strong> Many countries have adopted intermediate regimes (like China's managed float) to balance these trade-offs.
          </li>
          <li>
            <strong>Global Integration:</strong> In our interconnected world, domestic policy decisions have international spillovers.
            The Mundell-Fleming model helps understand these interactions.
          </li>
        </ul>
      </div>
    </div>
  )
}
