import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart } from 'recharts'
import { ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  SliderControl,
  StatBox,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'

/** Series keep a fixed economic identity across every chart in this tool. */
const BOND_PRICE_STROKE = chartColor(0)
const STOCK_PRICE_STROKE = chartColor(1)
const VALUATION_BAR_FILL = chartColor(3)

/** Layout shared by the chart and readout blocks. */
const CONTROL_GRID = 'grid gap-s-6 sm:grid-cols-2'
const CHART_BOX = 'h-[300px]'
const SPLIT = 'grid gap-s-6 lg:grid-cols-2'
const STAT_GRID = 'mb-s-6 grid grid-cols-2 gap-s-3'

interface BondDataPoint {
  rate: number
  price: number
}

interface EquityDataPoint {
  rate: number
  price: number
}

/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 */
const DEFAULTS = {
  coupon: 5,
  years: 10,
  discountRate: 5,
  dividend: 2,
  growthRate: 3,
  showDataOverlay: true,
}

export default function AssetPricing() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [coupon, setCoupon] = useState(DEFAULTS.coupon)
const [years, setYears] = useState(DEFAULTS.years)
const [discountRate, setDiscountRate] = useState(DEFAULTS.discountRate)
const [dividend, setDividend] = useState(DEFAULTS.dividend)
const [growthRate, setGrowthRate] = useState(DEFAULTS.growthRate)
const [showDataOverlay, setShowDataOverlay] = useState(DEFAULTS.showDataOverlay)

  const { reset, dirty } = useToolReset(
    {
    coupon: coupon,
    years: years,
    discountRate: discountRate,
    dividend: dividend,
    growthRate: growthRate,
    showDataOverlay: showDataOverlay,
    },
    {
      setCoupon,
      setYears,
      setDiscountRate,
      setDividend,
      setGrowthRate,
      setShowDataOverlay,
    },
    {
      coupon: DEFAULTS.coupon,
      years: DEFAULTS.years,
      discountRate: DEFAULTS.discountRate,
      dividend: DEFAULTS.dividend,
      growthRate: DEFAULTS.growthRate,
      showDataOverlay: DEFAULTS.showDataOverlay,
    },
  )

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
        <div className={CONTROL_GRID}>
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
        
        <div className="button-group">
          <Button
            onClick={() => setShowDataOverlay(!showDataOverlay)}
            variant={showDataOverlay ? 'primary' : 'secondary'}
          >
            {showDataOverlay ? 'Hide Data' : 'Show Data'}
          </Button>
        </div>
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Bond Price vs. Discount Rate
        </h2>
        <div className={CHART_BOX}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bondData} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis
                key={chartTheme.axisKey('x')} dataKey="rate" {...chartTheme.axis} />
              <YAxis
                key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <ChartLine
                type="monotone"
                dataKey="price"
                stroke={BOND_PRICE_STROKE}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Bond Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Stock Price vs. Discount Rate
        </h2>
        <div className={CHART_BOX}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityData} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis
                key={chartTheme.axisKey('x')} dataKey="rate" {...chartTheme.axis} />
              <YAxis
                key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <ChartLine
                type="monotone"
                dataKey="price"
                stroke={STOCK_PRICE_STROKE}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Stock Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Current Asset Valuation
        </h2>
        <div className={SPLIT}>
          <div className={CHART_BOX}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Bond Price', value: bondPrice },
                { name: 'Stock Price', value: stockPrice },
              ]} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="name" {...chartTheme.axis} />
                <YAxis
                  key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <ChartBar dataKey="value" fill={VALUATION_BAR_FILL} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Bond Price" value={bondPrice.toFixed(2)} />
              <StatBox label="Stock Price" value={stockPrice.toFixed(2)} />
            </div>

            <ToolNote label="Reference" variant="info" title="Present Value Principle">
              <p>
                Assets are valued based on the present value of their expected future cash flows.
                Higher discount rates reduce present values, making assets less valuable.
                Lower discount rates increase present values, making assets more valuable.
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mt-s-8 grid gap-s-6 sm:grid-cols-2 lg:grid-cols-3">
        <ToolNote label="Info" variant="info" title="Bond Valuation">
          <p>Bonds pay fixed coupon payments and return principal at maturity</p>
          <p>As discount rates rise, bond prices fall (inverse relationship)</p>
          <p>Longer maturity bonds are more sensitive to interest rate changes</p>
        </ToolNote>

        <ToolNote label="Watch out" variant="warning" title="Stock Valuation">
          <p>Stocks pay dividends and are valued based on expected future dividends</p>
          <p>Gordon Growth Model assumes constant dividend growth</p>
          <p>Higher growth rates increase stock values, but also increase risk</p>
        </ToolNote>

        <ToolNote label="Note" variant="lesson" title="Practical Applications">
          <p>Investors use these models to compare asset values</p>
          <p>Central banks monitor asset prices for financial stability</p>
          <p>Companies use valuation models for investment decisions</p>
        </ToolNote>
      </div>

      <ToolNote label="Reference" variant="info" title="Key Insights from Asset Pricing">
        <ul>
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
      </ToolNote>
    </div>
  )
}
