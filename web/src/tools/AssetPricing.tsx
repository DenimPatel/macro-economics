import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart } from 'recharts'
import { ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { calculateBondPrice } from '../lib/calculations'
import { useToolReset } from '../lib/toolReset'

/** Series keep a fixed economic identity across every chart in this tool. */
const BOND_PRICE_STROKE = chartColor(0)
const STOCK_PRICE_STROKE = chartColor(1)
const VALUATION_BAR_FILL = chartColor(3)

/** Layout shared by the chart and readout blocks. */
const CONTROL_GRID = 'grid gap-s-6 sm:grid-cols-2'
const SPLIT = 'grid gap-s-6 lg:grid-cols-2'
const STAT_GRID = 'mb-s-6 grid grid-cols-2 gap-s-3'

interface BondDataPoint {
  rate: number
  price: number
}

interface EquityDataPoint {
  rate: number
  /** `null` where the Gordon model is undefined, which Recharts draws as a gap. */
  price: number | null
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

  const { reset, dirty } = useToolReset(
    {
    coupon: coupon,
    years: years,
    discountRate: discountRate,
    dividend: dividend,
    growthRate: growthRate,
    },
    {
      setCoupon,
      setYears,
      setDiscountRate,
      setDividend,
      setGrowthRate,
    },
    {
      coupon: DEFAULTS.coupon,
      years: DEFAULTS.years,
      discountRate: DEFAULTS.discountRate,
      dividend: DEFAULTS.dividend,
      growthRate: DEFAULTS.growthRate,
    },
  )

  /**
   * Gordon Growth Model: P = D0 * (1 + g) / (r - g).
   *
   * `dividend` is D0 — the dividend just paid — which is why the slider names
   * it. The dividend the numerator grows is NEXT year's, and conflating the
   * two prices the same stock 5% too high.
   *
   * `null` below r = g rather than a number, because there is no number: the
   * model is undefined there, diverging as r approaches g from above. It used
   * to return 0, which is not a neutral guard — 0 is a specific claim that the
   * asset is worthless, printed to two decimals as if it were a valuation. The
   * one thing that is true at r <= g is that no price exists, so the tile says
   * that and the chart leaves a gap.
   */
  const calculateStockPrice = (
    dividend: number,
    rate: number,
    growth: number,
  ): number | null => {
    if (rate <= growth) return null
    return dividend * (1 + growth / 100) / (rate / 100 - growth / 100)
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

  // The stock's bar is omitted, not drawn at zero, when the model is undefined.
  // A category label with no rectangle over it reads as a valuation of zero —
  // the same wrong claim the tile used to make, one chart to the left of where
  // the reader would look for the correction.
  const valuationBars = [
    { name: 'Bond Price', value: bondPrice },
    ...(stockPrice === null ? [] : [{ name: 'Stock Price', value: stockPrice }]),
  ]

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
            label="Current dividend D₀ (per share)"
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
        
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Bond Price vs. Discount Rate
        </h2>
        <ResponsiveContainer width="100%" height={400}>
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

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Stock Price vs. Discount Rate
        </h2>
        <ResponsiveContainer width="100%" height={400}>
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
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Current Asset Valuation
        </h2>
        <div className={SPLIT}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={valuationBars} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis
                key={chartTheme.axisKey('x')} dataKey="name" {...chartTheme.axis} />
              <YAxis
                key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <ChartBar dataKey="value" fill={VALUATION_BAR_FILL} />
            </BarChart>
          </ResponsiveContainer>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Bond Price" value={bondPrice.toFixed(2)} />
              {/* An em dash rather than a word: `.stat-tile-value` is a numeric
                  slot at 1.5rem with tabular figures, and at 130% text its
                  content box in this two-column grid holds about six
                  characters. `undefined` is one unbreakable nine-character
                  token, so it cannot wrap — it bled 24px past the card border
                  at 130% and would bleed further on any narrower layout.
                  `SpeculativeAttack.tsx` uses the same dash for the same kind
                  of domain edge. The `change` line carries the reason, so the
                  tile never shows a number AND never shows a bare shrug. */}
              <StatBox
                label="Stock Price"
                value={stockPrice === null ? '—' : stockPrice.toFixed(2)}
                change={stockPrice === null ? 'requires r > g' : undefined}
              />
            </div>
              <TileReadout>
                Both tiles are the two bars on the third chart, one reading each: Bond Price is
                the bond price at the yield you have set, and Stock Price is the Gordon result.
                The bond price is defined at every discount rate, so it is a number whenever a
                yield is set; the stock price is not, because the Gordon denominator r − g goes
                to zero as the required return reaches the growth rate and the model stops having
                an answer. That is the case the tile prints — a dash, and the caption owes the
                reason: at r ≤ g = {growthRate.toFixed(1)}% there is no finite discounted price to
                report. The second chart carries the same boundary from the other side: the stock
                price curve begins only where r exceeds g, so push growth up far enough and the
                line leaves the page entirely.
              </TileReadout>

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
          <p>
            The model requires r &gt; g. At or below the growth rate there is no
            price to report, so the tile above says the price is undefined rather
            than printing a number the model cannot produce.
          </p>
        </ToolNote>

        <ToolNote label="Note" variant="lesson" title="Practical Applications">
          <p>Investors use these models to compare asset values</p>
          <p>Central banks monitor asset prices for financial stability</p>
          <p>Companies use valuation models for investment decisions</p>
        </ToolNote>
      </div>

      <ToolNote label="Reference" variant="info" title="Key Insights from Asset Pricing" headingLevel={2}>
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
