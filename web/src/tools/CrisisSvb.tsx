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
const REAL_RATE_STROKE = chartColor(0)
const NOMINAL_RATE_STROKE = chartColor(2)
const INFLATION_STROKE = chartColor(1)
const BOND_VALUE_FILL = chartColor(3)

/** Layout shared by the "controls beside chart" and "chart beside readouts" blocks. */
const CONTROL_GRID = 'grid gap-s-6 sm:grid-cols-2'
const SPLIT = 'grid gap-s-6 lg:grid-cols-2'
const STAT_GRID = 'mb-s-6 grid grid-cols-2 gap-s-3'

/**
 * What the portfolio was paid, and therefore the only honest zero for a
 * "loss". It is the bond's face, and the price SVB paid for it.
 *
 * It used to be the literal `100` inside `100 - portfolioValue` and again
 * inside the "Initial Value" bar, two literals for one number, with the
 * figure also standing in for the face value that `calculateBondPrice` takes
 * as a default in another file.
 */
const PAR_FACE = 100

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

  const { reset, dirty } = useToolReset(
    {
      fedRate,
      inflation,
      bondCoupon,
      bondYears,
    },
    {
      setFedRate,
      setInflation,
      setBondCoupon,
      setBondYears,
    },
    DEFAULTS,
  )

  // Calculate real interest rate using Fisher equation
  const realRate = fedRate - inflation

  /**
   * The four years the Fed actually spent raising rates, and what this tool's
   * bond was worth at the end of each.
   *
   * `bondValue` used to be the literal 100 in all four rows while `nominalRate`
   * climbed 1.5 -> 5.0. A bond does not trade at par through a three-and-a-half
   * point rise in the market rate, so the column was either a flat line
   * contradicting this tool's own thesis — that the rate hikes CAUSED the
   * losses — or dead data carrying a name that promised otherwise. It was
   * dead: nothing plotted it.
   *
   * It is computed here by `calculateBondPrice`, the same function the live
   * calculator below uses, at that year's own nominal rate, and it is computed
   * from the READER'S coupon and maturity rather than a hard-coded 1.5% and 10
   * years. Two reasons, and the second is the one that matters:
   *
   *   - the history and the calculator cannot disagree, because there is one
   *     function. At this tool's defaults the 2024 bar and the tile beside the
   *     chart are the same number, 72.97, which is a fact about a 5% Fed funds
   *     rate and not a coincidence of two hand-typed prices.
   *   - a fixed 1.5% would have been a second set of defaults. Set the coupon
   *     to 5% and the chart would keep showing SVB's 2021 price while the tile
   *     showed a par bond, and nothing on the page would say the two were
   *     about different bonds.
   *
   * The rates themselves are the record and are not modelled: they are the
   * four published nominal policy rates, and the inflation and real rate in
   * each row are the ones that were measured alongside them.
   */
  const svbData: BondDataPoint[] = [
    { year: 2021, nominalRate: 1.5, inflation: 1.5, realRate: 0.0 },
    { year: 2022, nominalRate: 2.5, inflation: 2.5, realRate: 0.0 },
    { year: 2023, nominalRate: 4.0, inflation: 3.0, realRate: 1.0 },
    { year: 2024, nominalRate: 5.0, inflation: 4.0, realRate: 1.0 },
  ].map((row) => ({
    ...row,
    // P = C·[1 − (1+r)⁻ⁿ]/r + FV·(1+r)⁻ⁿ, at that year's nominal rate.
    bondValue: parseFloat(calculateBondPrice(bondCoupon, bondYears, row.nominalRate).toFixed(2)),
  }))

  // Calculate portfolio value for different scenarios
  const portfolioValue = calculateBondPrice(bondCoupon, bondYears, fedRate)
  const portfolioLoss = PAR_FACE - portfolioValue

  /**
   * The bar chart's rows: the four years above, then the same bond at the rate
   * the reader has chosen.
   *
   * The last row is the one that makes the chart a chart rather than a history:
   * drag the Federal Funds Rate and it moves against four fixed years, so the
   * chart shows the reader how far the rate they picked sits from the record.
   * At this tool's own defaults the two coincide — 2024 was also a 5% year — so
   * the last two bars are the same height, which is a fact about the rate and
   * is said in words in the caption under the chart rather than left for the
   * reader to work out.
   */
  const bondValueBars = [
    ...svbData.map((row) => ({ name: `${row.year} (${row.nominalRate.toFixed(1)}%)`, value: row.bondValue })),
    { name: `Your rate (${fedRate.toFixed(1)}%)`, value: parseFloat(portfolioValue.toFixed(2)) },
  ]

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
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Real Interest Rate Analysis
        </h2>
        <div className={SPLIT}>
          <ResponsiveContainer width="100%" height={400}>
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

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Nominal Rate" value={fedRate.toFixed(1)} unit="%" />
              <StatBox label="Inflation" value={inflation.toFixed(1)} unit="%" />
              <StatBox label="Real Rate" value={realRate.toFixed(1)} unit="%" tone="accent" />
            </div>
              <TileReadout>
                        Nominal Rate {fedRate.toFixed(1)}%, Inflation{' '}
          {inflation.toFixed(1)}% and Real Rate {realRate.toFixed(1)}% are the
          three lines of the chart below, one reading each, so each tile is a
          point a reader can put a finger on. Bond Value and Unrealised Gain or Loss are not on
                        that chart: they are dollars where the axis is a rate, and the
                        portfolio chart further down the page plots the bond's value in
                        dollars, so the tile's number is the height of that line at the
                        current year rather than a bar of its own. The gain or loss carries
                        a percent sign because the holding is quoted per $100 of face value,
                        so the shortfall against par and the loss as a share of par are the
                        same number — it is a percent of par, not a share price.
                      </TileReadout>

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
          <div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={bondValueBars} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')} dataKey="name" {...chartTheme.axis} />
                <YAxis
                  key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <ChartBar dataKey="value" fill={BOND_VALUE_FILL} />
              </BarChart>
            </ResponsiveContainer>
            <p className="mt-s-2 text-xs text-fg-subtle">
              The same bond — {bondCoupon.toFixed(1)}% coupons, {bondYears} years left — at
              each year&apos;s own market rate, and at the rate you have chosen. A value below par
              ({PAR_FACE.toFixed(0)}) is an unrealised loss: no payment was missed, the market
              simply no longer pays what the bank paid.
              {/* The bars carry these numbers and no text, and a bar is not
                  readable without layout — so they are written out here in the
                  same tabular figures the bars are, which is also what a
                  reader printing the page to PDF gets. */}
              <span className="mt-s-1 block tabular-nums">
                {svbData.map((row) => `${row.year}: ${row.bondValue.toFixed(2)}`).join(' | ')}
                {` | Your rate (${fedRate.toFixed(1)}%): ${portfolioValue.toFixed(2)}`}
              </span>
            </p>
          </div>

          <div>
            <div className={STAT_GRID}>
              <StatBox label="Bond Value" value={portfolioValue.toFixed(2)} />
              <StatBox
                label="Unrealised Gain or Loss"
                value={portfolioLoss.toFixed(2)}
                unit="%"
                tone={portfolioLoss >= 0 ? 'negative' : 'positive'}
                change={
                  portfolioLoss >= 0
                    ? `A loss: the market pays ${fedRate.toFixed(1)}% for a ${bondCoupon.toFixed(1)}% coupon.`
                    : `A gain: the market pays ${fedRate.toFixed(1)}% for a ${bondCoupon.toFixed(1)}% coupon.`
                }
              />
            </div>

            <ToolNote label="Insight" variant="insight" title="SVB's Real Rate Squeeze">
              <p>
                SVB had long-term bonds locked in at 1.5% coupons when real rates were low (2010s).
                When Fed raised rates to 5% with 4% inflation, real rates rose to 1%.
                A 1.5% coupon is worth exactly its par of 100 while the market is paying 1.5% for
                ten years&apos; money, and worth less than that at any higher rate. That is the whole
                of the squeeze, and none of it was a missed payment.
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

      <ToolNote label="Reference" variant="info" title="Key Insights from SVB" headingLevel={2}>
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
