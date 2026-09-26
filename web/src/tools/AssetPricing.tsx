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
  rate: number
  price: number
}

interface EquityDataPoint {
  rate: number
  price: number
}

export default function AssetPricing() {
  const [coupon, setCoupon] = useState(5)
  const [years, setYears] = useState(10)
  const [discountRate, setDiscountRate] = useState(5)
  const [dividend, setDividend] = useState(2)
  const [growthRate, setGrowthRate] = useState(3)
  const [showDataOverlay, setShowDataOverlay] = useState(true)

  // Calculate bond price using present value formula
  const calculateBondPrice = (coupon: number, years: number, rate: number) => {
    // PV = C * [1 - (1+r)^(-n)] / r + FV / (1+r)^n
    const annualPayment = coupon
    const faceValue = 100
    const presentValue = (annualPayment * (1 - Math.pow(1 + rate/100, -years)) / (rate/100)) + 
                         (faceValue / Math.pow(1 + rate/100, years))
    return presentValue
  }

  // Calculate stock price using Gordon Growth Model
  const calculateStockPrice = (dividend: number, rate: number, growth: number) => {
    // P = D0 * (1 + g) / (r - g)
    if (rate <= growth) return 0 // Prevent division by zero or negative
    const price = dividend * (1 + growth/100) / ((rate/100) - (growth/100))
    return price
  }

  // Generate bond price data for different discount rates
  const bondData: BondDataPoint[] = []
  for (let rate = 0; rate <= 10; rate += 0.5) {
    const price = calculateBondPrice(coupon, years, rate)
    bondData.push({ rate, price })
  }

  // Generate stock price data for different discount rates
  const equityData: EquityDataPoint[] = []
  for (let rate = 0; rate <= 10; rate += 0.5) {
    const price = calculateStockPrice(dividend, rate, growthRate)
    equityData.push({ rate, price })
  }

  // Calculate current prices
  const bondPrice = calculateBondPrice(coupon, years, discountRate)
  const stockPrice = calculateStockPrice(dividend, discountRate, growthRate)

  return (
    <div className="tool-card">
      <ToolHeader
        title="Asset Pricing Calculator (EPDV)"
        description="Calculate present value of future cash flows. See how discount rates affect bond and stock prices."
        badge="advanced"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <SliderControl
            label="Bond Coupon Rate"
            value={coupon}
            min={0}
            max={10}
            step={0.5}
            onChange={setCoupon}
            unit="%"
          />
          <SliderControl
            label="Bond Years to Maturity"
            value={years}
            min={1}
            max={30}
            step={1}
            onChange={setYears}
            unit="years"
          />
          <SliderControl
            label="Discount Rate"
            value={discountRate}
            min={0}
            max={10}
            step={0.5}
            onChange={setDiscountRate}
            unit="%"
          />
          <SliderControl
            label="Dividend (per share)"
            value={dividend}
            min={0}
            max={10}
            step={0.1}
            onChange={setDividend}
            unit=""
          />
          <SliderControl
            label="Growth Rate"
            value={growthRate}
            min={0}
            max={10}
            step={0.5}
            onChange={setGrowthRate}
            unit="%"
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
          Bond Price vs. Discount Rate
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bondData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rate" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Bond Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Stock Price vs. Discount Rate
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rate" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Stock Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Current Asset Valuation
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Bond Price', value: bondPrice },
                { name: 'Stock Price', value: stockPrice },
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
              <StatBox label="Bond Price" value={bondPrice.toFixed(2)} />
              <StatBox label="Stock Price" value={stockPrice.toFixed(2)} />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                Present Value Principle
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                Assets are valued based on the present value of their expected future cash flows.
                Higher discount rates reduce present values, making assets less valuable.
                Lower discount rates increase present values, making assets more valuable.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📉 Bond Valuation</strong>
          <p>Bonds pay fixed coupon payments and return principal at maturity</p>
          <p>As discount rates rise, bond prices fall (inverse relationship)</p>
          <p>Longer maturity bonds are more sensitive to interest rate changes</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ Stock Valuation</strong>
          <p>Stocks pay dividends and are valued based on expected future dividends</p>
          <p>Gordon Growth Model assumes constant dividend growth</p>
          <p>Higher growth rates increase stock values, but also increase risk</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Practical Applications</strong>
          <p>Investors use these models to compare asset values</p>
          <p>Central banks monitor asset prices for financial stability</p>
          <p>Companies use valuation models for investment decisions</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Insights from Asset Pricing
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Present Value:</strong> The fundamental principle that all assets are valued based on the present value of their expected future cash flows.
          </li>
          <li>
            <strong>Discount Rate:</strong> The discount rate represents the opportunity cost of capital and risk premium.
            Higher rates make future cash flows worth less today.
          </li>
          <li>
            <strong>Risk and Return:</strong> Higher-risk assets require higher discount rates, reducing their present value.
            This is the basis for risk-return trade-offs in finance.
          </li>
          <li>
            <strong>Interest Rate Sensitivity:</strong> Bonds are particularly sensitive to interest rate changes.
            Duration measures this sensitivity.
          </li>
          <li>
            <strong>Valuation Models:</strong> Different models (bond pricing, Gordon Growth, DCF) are used depending on the asset type and characteristics.
          </li>
        </ul>
      </div>
    </div>
  )
}
