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
const REAL_RATE_STROKE = chartColor(0)
const NOMINAL_RATE_STROKE = chartColor(2)
const INFLATION_STROKE = chartColor(1)
const BOND_VALUE_FILL = chartColor(3)

/** Layout shared by the "controls beside chart" and "chart beside readouts" blocks. */
const CONTROL_GRID = 'grid gap-s-6 sm:grid-cols-2'
const SPLIT = 'grid gap-s-6 lg:grid-cols-2'
const STAT_GRID = 'mb-s-6 grid grid-cols-2 gap-s-3'

interface BondDataPoint {
  year: number
  nominalRate: number
  inflation: number
  realRate: number
  bondValue: number
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
  fedRate: 5.0,
  inflation: 4.0,
  bondCoupon: 1.5,
  bondYears: 10,
  showDataOverlay: true,
}

export default function CrisisSvb() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [fedRate, setFedRate] = useState(DEFAULTS.fedRate)
const [inflation, setInflation] = useState(DEFAULTS.inflation)
const [bondCoupon, setBondCoupon] = useState(DEFAULTS.bondCoupon)
const [bondYears, setBondYears] = useState(DEFAULTS.bondYears)
const [showDataOverlay, setShowDataOverlay] = useState(DEFAULTS.showDataOverlay)

  const { reset, dirty } = useToolReset(
    {
    fedRate: fedRate,
    inflation: inflation,
    bondCoupon: bondCoupon,
    bondYears: bondYears,
    showDataOverlay: showDataOverlay,
    },
    {
      setFedRate,
      setInflation,
      setBondCoupon,
      setBondYears,
      setShowDataOverlay,
    },
    {
      fedRate: DEFAULTS.fedRate,
      inflation: DEFAULTS.inflation,
      bondCoupon: DEFAULTS.bondCoupon,
      bondYears: DEFAULTS.bondYears,
      showDataOverlay: DEFAULTS.showDataOverlay,
    },
  )

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
        <div className={CONTROL_GRID}>
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
          Real Interest Rate Analysis
        </h2>
        <div className={SPLIT}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={svbData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="year" {...chartTheme.axis} />
                <YAxis
                  key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <ChartLine
                  type="monotone"
                  dataKey="realRate"
                  stroke={REAL_RATE_STROKE}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Real Interest Rate"
                />
                <ChartLine
                  type="monotone"
                  dataKey="nominalRate"
                  stroke={NOMINAL_RATE_STROKE}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Nominal Interest Rate"
                />
                <ChartLine
                  type="monotone"
                  dataKey="inflation"
                  stroke={INFLATION_STROKE}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Inflation Rate"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Nominal Rate" value={fedRate.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={inflation.toFixed(1)} unit="%" />
              <StatBox label="Real Rate" value={realRate.toFixed(1)} unit="%" tone="accent" />
            </div>

            <ToolNote label="Formula" variant="info" title="Fisher Equation: r = i - π">
              <p>
                The real interest rate is the nominal rate minus expected inflation.
                When inflation expectations are low but Fed raises rates, real rates rise significantly.
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Bond Portfolio Value Analysis
        </h2>
        <div className={SPLIT}>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Initial Value', value: 100 },
                { name: 'Current Value', value: portfolioValue },
              ]} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="name" {...chartTheme.axis} />
                <YAxis
                  key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <ChartBar dataKey="value" fill={BOND_VALUE_FILL} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Bond Value" value={portfolioValue.toFixed(2)} />
              <StatBox label="Portfolio Loss" value={portfolioLoss.toFixed(2)} unit="%" />
            </div>

            <ToolNote label="Insight" variant="insight" title="SVB's Real Rate Squeeze">
              <p>
                SVB had long-term bonds locked in at 1.5% coupons when real rates were low (2010s).
                When Fed raised rates to 5% with 4% inflation, real rates rose to 1%.
                The bond portfolio's market value fell significantly, causing losses.
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mt-s-8 grid gap-s-6 sm:grid-cols-2 lg:grid-cols-3">
        <ToolNote label="Info" variant="info" title="The SVB Crisis">
          <p>SVB had a large portfolio of long-term bonds with low coupons (1.5%) from the 2010s</p>
          <p>When Fed raised rates to combat inflation, real rates rose significantly</p>
          <p>These bonds lost substantial market value, creating losses for the bank</p>
        </ToolNote>

        <ToolNote label="Watch out" variant="warning" title="Real Rate Squeeze">
          <p>When real rates rise above the coupon rate on existing bonds, their market value falls</p>
          <p>SVB's bonds were worth less than their book value, triggering a liquidity crisis</p>
          <p>This illustrates how interest rate risk can devastate financial institutions</p>
        </ToolNote>

        <ToolNote label="Note" variant="lesson" title="Policy Lessons">
          <p>Central banks must carefully consider the impact of rate changes on financial stability</p>
          <p>Financial institutions need robust risk management for interest rate exposure</p>
          <p>Regulators should monitor institutions with large bond portfolios</p>
        </ToolNote>
      </div>

      <ToolNote label="Reference" variant="info" title="Key Insights from SVB">
        <ul>
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
      </ToolNote>
    </div>
  )
}
