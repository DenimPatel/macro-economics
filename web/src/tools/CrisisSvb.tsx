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

interface BondDataPoint {
  year: number
  nominalRate: number
  inflation: number
  realRate: number
  bondValue: number
}

export default function CrisisSvb() {
  const [fedRate, setFedRate] = useState(5.0)
  const [inflation, setInflation] = useState(4.0)
  const [bondCoupon, setBondCoupon] = useState(1.5)
  const [bondYears, setBondYears] = useState(10)
  const [showDataOverlay, setShowDataOverlay] = useState(true)

  // Calculate real interest rate using Fisher equation
  const realRate = fedRate - inflation
  
  // Calculate bond value using present value formula
  const calculateBondValue = (coupon: number, years: number, rate: number) => {
    // Simplified bond valuation formula
    // PV = C * [1 - (1+r)^(-n)] / r + FV / (1+r)^n
    // For simplicity, we'll use a basic approximation
    const annualPayment = coupon
    const faceValue = 100
    const presentValue = (annualPayment * (1 - Math.pow(1 + rate/100, -years)) / (rate/100)) + 
                         (faceValue / Math.pow(1 + rate/100, years))
    return presentValue
  }
  
  // Historical data for SVB scenario
  const svbData: BondDataPoint[] = [
    { year: 2021, nominalRate: 1.5, inflation: 1.5, realRate: 0.0, bondValue: 100 },
    { year: 2022, nominalRate: 2.5, inflation: 2.5, realRate: 0.0, bondValue: 100 },
    { year: 2023, nominalRate: 4.0, inflation: 3.0, realRate: 1.0, bondValue: 100 },
    { year: 2024, nominalRate: 5.0, inflation: 4.0, realRate: 1.0, bondValue: 100 },
  ]

  // Calculate portfolio value for different scenarios
  const portfolioValue = calculateBondValue(bondCoupon, bondYears, fedRate)
  const portfolioLoss = 100 - portfolioValue

  return (
    <div className="tool-card">
      <ToolHeader
        title="SVB Banking Crisis & Fisher Equation"
        description="Understand why real rate squeeze caused SVB losses and why rate hikes break the system."
        badge="case-study"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <SliderControl
            label="Federal Funds Rate"
            value={fedRate}
            min={0}
            max={10}
            step={0.5}
            onChange={setFedRate}
            unit="%"
          />
          <SliderControl
            label="Inflation Rate"
            value={inflation}
            min={0}
            max={10}
            step={0.5}
            onChange={setInflation}
            unit="%"
          />
          <SliderControl
            label="Bond Coupon Rate"
            value={bondCoupon}
            min={0}
            max={10}
            step={0.5}
            onChange={setBondCoupon}
            unit="%"
          />
          <SliderControl
            label="Bond Years to Maturity"
            value={bondYears}
            min={1}
            max={30}
            step={1}
            onChange={setBondYears}
            unit="years"
          />
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
          Real Interest Rate Analysis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={svbData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="realRate" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Real Interest Rate"
                />
                <Line 
                  type="monotone" 
                  dataKey="nominalRate" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Nominal Interest Rate"
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
          
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatBox label="Nominal Rate" value={fedRate.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={inflation.toFixed(1)} unit="%" />
              <StatBox label="Real Rate" value={realRate.toFixed(1)} unit="%" highlight />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                Fisher Equation: r = i - π
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                The real interest rate is the nominal rate minus expected inflation.
                When inflation expectations are low but Fed raises rates, real rates rise significantly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Bond Portfolio Value Analysis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Initial Value', value: 100 },
                { name: 'Current Value', value: portfolioValue },
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
              <StatBox label="Bond Value" value={portfolioValue.toFixed(2)} />
              <StatBox label="Portfolio Loss" value={portfolioLoss.toFixed(2)} unit="%" />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '6px', borderLeft: '4px solid #ca8a04' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#854d0e', fontWeight: '600' }}>
                SVB's Real Rate Squeeze
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#854d0e', lineHeight: '1.5' }}>
                SVB had long-term bonds locked in at 1.5% coupons when real rates were low (2010s).
                When Fed raised rates to 5% with 4% inflation, real rates rose to 1%.
                The bond portfolio's market value fell significantly, causing losses.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📉 The SVB Crisis</strong>
          <p>SVB had a large portfolio of long-term bonds with low coupons (1.5%) from the 2010s</p>
          <p>When Fed raised rates to combat inflation, real rates rose significantly</p>
          <p>These bonds lost substantial market value, creating losses for the bank</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Real Rate Squeeze</strong>
          <p>When real rates rise above the coupon rate on existing bonds, their market value falls</p>
          <p>SVB's bonds were worth less than their book value, triggering a liquidity crisis</p>
          <p>This illustrates how interest rate risk can devastate financial institutions</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Policy Lessons</strong>
          <p>Central banks must carefully consider the impact of rate changes on financial stability</p>
          <p>Financial institutions need robust risk management for interest rate exposure</p>
          <p>Regulators should monitor institutions with large bond portfolios</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Insights from SVB
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Interest Rate Risk:</strong> Banks with large bond portfolios face significant interest rate risk.
            When rates rise, bond values fall, potentially creating losses that exceed capital.
          </li>
          <li>
            <strong>Duration Mismatch:</strong> SVB had long-duration assets (bonds) matched with short-duration liabilities (deposits).
            This mismatch amplified losses when rates rose.
          </li>
          <li>
            <strong>Market Discipline:</strong> The market's reaction to declining bond values triggered a bank run.
            This shows how financial markets can amplify banking crises.
          </li>
          <li>
            <strong>Regulatory Oversight:</strong> The crisis highlighted the need for better monitoring of financial institutions' interest rate exposures.
          </li>
          <li>
            <strong>Policy Transmission:</strong> The SVB crisis demonstrated how monetary policy affects financial stability.
            Rapid rate increases can create instability in financial markets.
          </li>
        </ul>
      </div>
    </div>
  )
}
