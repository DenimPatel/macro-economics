import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart } from 'recharts'
import { ChartArea, ChartLine } from '../components/ChartPrimitives'
import { ChartLegend } from '../components/ChartLegend'
import {
  Button,
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useHiddenSeries } from '../lib/chartSeries'
import { useToolReset } from '../lib/toolReset'

interface MundellFlemingDataPoint {
  year: number
  output: number
  interestRate: number
  exchangeRate: number
  inflation: number
  isFloating: boolean
}

/** The instrument being moved. */
type PolicyType = 'monetary' | 'fiscal'

/** The regime the comparison is drawn in. */
type ExchangeRateType = 'fixed' | 'floating'

/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 *
 * The two regime switches are in the record for the same reason `policyEffect`
 * is, and they are the more important half of it. They were three
 * `useState`s holding bare literals, so Reset moved the one slider and left
 * both button groups wherever the reader had left them — a reader who picked
 * "Fixed", moved the policy effect and pressed Reset got the effect back with
 * the fixed-rate regime still selected and a comparison of the wrong two
 * regimes. The literals are annotated at the fields for the reason
 * `useState(DEFAULTS.x)` would otherwise infer a single value that the other
 * button cannot assign to.
 */
const DEFAULTS = {
  policyEffect: 50,
  policyType: 'monetary' as PolicyType,
  exchangeRateType: 'floating' as ExchangeRateType,
}

/**
 * The legend items, declared once for both charts. `chartColor(i)` is the
 * only way a series colour is written in a tool, and this is the one place
 * in the file that pairs an index with a name — so a series cannot be drawn
 * in one colour and labelled as another.
 */
const MF_LEGEND = [
  { key: 'output', label: 'Output (Y)', color: chartColor(0) },
  { key: 'interestRate', label: 'Interest Rate (r)', color: chartColor(2) },
  { key: 'exchangeRate', label: 'Exchange Rate', color: chartColor(1) },
  { key: 'inflation', label: 'Inflation (π)', color: chartColor(3) },
]

export default function MundellFleming() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  const [policyType, setPolicyType] = useState<PolicyType>(DEFAULTS.policyType)
  const [policyEffect, setPolicyEffect] = useState(DEFAULTS.policyEffect)
  const [exchangeRateType, setExchangeRateType] = useState<ExchangeRateType>(
    DEFAULTS.exchangeRateType,
  )

  /**
   * One hidden-series set for the tool's two charts, deliberately. They plot
   * the same model at two scales — a ten-year path and a five-point
   * comparison — so a reader asking to hide the exchange rate means it in
   * both, and two independent sets would make them press the same control
   * twice to say one thing.
   */
  const series = useHiddenSeries(['output', 'interestRate', 'exchangeRate', 'inflation'])

  const { reset, dirty } = useToolReset(
    {
      policyEffect,
      policyType,
      exchangeRateType,
    },
    {
      setPolicyEffect,
      setPolicyType,
      setExchangeRateType,
    },
    DEFAULTS,
  )

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

  // Policy effect, in basis points, entering the model as a fraction of a
  // percentage point: 100 on the slider is one point off the rate.
  const policyImpact = policyEffect * 0.01

  let outputChange = 0
  let interestRateChange = 0
  let exchangeRateChange = 0
  const inflationChange = 0

  /**
   * The model's two coefficients, and the whole of what makes the regime
   * matter. They are properties of the ECONOMY, not of the verdict: neither
   * is keyed on the policy type, so the ranking the course teaches falls out
   * of the arithmetic instead of being written into it.
   */
  // How much of a monetary expansion survives a defended peg.
  //
  // Under a float the central bank sets the rate and there is no parity to
  // satisfy, so the rate cut stands. Under a peg the parity pins the rate to
  // the world rate and the currency is defended by buying and selling
  // reserves — which contracts and expands the money supply, i.e. moves the
  // rate back. The monetary instrument under a peg is not the rate at all; it
  // is the money supply, and the parity condition rather than policy sets it.
  // What imperfect capital mobility leaves behind, once the defence has run,
  // is the small remainder. Set this to 1 and monetary policy becomes as
  // effective under a peg as under a float, and the fiscal claim below stops
  // holding — which is the test that the peg is doing the work.
  const SURVIVES_A_PEG = 0.2
  // How strongly net exports answer the currency, per unit of the exchange
  // rate. A depreciation raises net exports, hence the negative sign. Set it
  // to 0 and the exchange rate stops mattering to output at all, which is the
  // test that the currency channel is doing its half.
  const NX_TO_EXCHANGE_RATE = -2
  // The direct demand effect of each instrument, before either channel.
  // A rate cut works through investment; a spending increase shifts IS. These
  // are the textbook shapes, and the regime is what tilts them against each
  // other — it does not set them.
  const BASE_MONETARY = 2
  const BASE_FISCAL = 1.5

  if (policyType === 'monetary') {
    // Monetary expansion: the rate falls and the currency depreciates with it
    // unless something is holding it up. `survives` is the share of the move
    // the peg's defence cannot take back — it applies to the output effect as
    // well as to the rate, because what the defence does is contract the
    // money supply, and the money supply is what moved output in the first
    // place. Scaling only the rate would leave the output tile claiming a
    // monetary expansion under a peg that the model has already undone.
    const survives = exchangeRateType === 'fixed' ? SURVIVES_A_PEG : 1
    interestRateChange = -policyImpact * survives
    exchangeRateChange = exchangeRateType === 'floating' ? -policyImpact * 0.5 : 0
    outputChange = policyImpact * BASE_MONETARY * survives
  } else {
    // Fiscal expansion: spending rises, the rate follows it up, and the
    // currency appreciates — which is what erodes the spending under a float.
    interestRateChange = exchangeRateType === 'floating' ? policyImpact : policyImpact * 0.5
    exchangeRateChange = exchangeRateType === 'floating' ? policyImpact * 0.3 : 0
    outputChange = policyImpact * BASE_FISCAL
  }

  // Output is the direct effect plus the exchange rate's contribution through
  // net exports. Under a peg the exchange rate does not move, so that term is
  // zero — which is the whole reason a peg is the better place to run fiscal
  // policy: the appreciation that would undo the spending never happens.
  outputChange += NX_TO_EXCHANGE_RATE * exchangeRateChange

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
        <div className="grid grid-cols-1 gap-s-6 lg:grid-cols-3">
          <div>
            <span className="control-label mb-s-2 block">Policy Type</span>
            <div className="flex gap-s-2">
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
            unit="bp"
          />

          <div>
            <span className="control-label mb-s-2 block">Exchange Rate Regime</span>
            <div className="flex gap-s-2">
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

      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Policy Effectiveness Comparison</h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={mfData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            {/* `includeHidden` on both axes, on every chart with an
              * interactive legend. Recharts derives an auto-domain from
              * the VISIBLE series, so without it, hiding output would
              * rescale the y axis and the three remaining series would
              * appear to move — a legend toggle that changes the numbers
              * on the plot. */}
            <XAxis
              key={chartTheme.axisKey('x')} dataKey="year" includeHidden {...chartTheme.axis} />
            <YAxis
              key={chartTheme.axisKey('y')} includeHidden {...chartTheme.yAxis} />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <ChartArea
              type="monotone"
              dataKey="output"
              stroke={chartColor(0)}
              fill={chartColor(0)}
              fillOpacity={0.15}
              name="Output (Y)"
              hide={series.isHidden('output')}
            />
            <ChartArea
              type="monotone"
              dataKey="interestRate"
              stroke={chartColor(2)}
              fill={chartColor(2)}
              fillOpacity={0.15}
              name="Interest Rate (r)"
              hide={series.isHidden('interestRate')}
            />
            <ChartArea
              type="monotone"
              dataKey="exchangeRate"
              stroke={chartColor(1)}
              fill={chartColor(1)}
              fillOpacity={0.15}
              name="Exchange Rate"
              hide={series.isHidden('exchangeRate')}
            />
            <ChartArea
              type="monotone"
              dataKey="inflation"
              stroke={chartColor(3)}
              fill={chartColor(3)}
              fillOpacity={0.15}
              name="Inflation (π)"
              hide={series.isHidden('inflation')}
            />
          </AreaChart>
        </ResponsiveContainer>
        {/* This chart had NO legend at all — four series, three of them in a
         * range an order of magnitude below output, and nothing on the plot
         * naming which line was which. That is the defect a legend is for,
         * and the fix is the same one everywhere else: the names become
         * buttons. */}
        <ChartLegend
          items={MF_LEGEND}
          hidden={series.hidden}
          onToggle={series.toggle}
          onShowAll={series.showAll}
        />
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Policy Impact Summary</h2>
        <div className="grid gap-s-6 lg:grid-cols-2">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mfData.slice(0, 5)} margin={chartTheme.margin}>
              <CartesianGrid {...chartTheme.grid} />
              <XAxis
                key={chartTheme.axisKey('x')} dataKey="year" includeHidden {...chartTheme.axis} />
              <YAxis
                key={chartTheme.axisKey('y')} includeHidden {...chartTheme.yAxis} />
              <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
              <ChartLine
                type="monotone"
                dataKey="output"
                stroke={chartColor(0)}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Output"
                hide={series.isHidden('output')}
              />
              <ChartLine
                type="monotone"
                dataKey="interestRate"
                stroke={chartColor(2)}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Interest Rate"
                hide={series.isHidden('interestRate')}
              />
              <ChartLine
                type="monotone"
                dataKey="exchangeRate"
                stroke={chartColor(1)}
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Exchange Rate"
                hide={series.isHidden('exchangeRate')}
              />
            </LineChart>
          </ResponsiveContainer>
          <ChartLegend
            items={MF_LEGEND}
            hidden={series.hidden}
            onToggle={series.toggle}
            onShowAll={series.showAll}
          />

          <div>
            <div className="mb-s-6 grid grid-cols-2 gap-s-3">
              <StatBox label="Output" value={policyResult.output.toFixed(1)} tone="accent" />
              <StatBox label="Interest Rate" value={policyResult.interestRate.toFixed(1)} unit="%" />
              <StatBox label="Exchange Rate" value={policyResult.exchangeRate.toFixed(2)} />
              <StatBox label="Inflation" value={policyResult.inflation.toFixed(1)} unit="%" />
            </div>
              <TileReadout>
                These four tiles are the model's response to the move you have dialled in, and
                that response is a single point rather than a path — output{' '}
                {policyResult.output.toFixed(1)}, interest rate{' '}
                {policyResult.interestRate.toFixed(1)}%, exchange rate{' '}
                {policyResult.exchangeRate.toFixed(2)}, inflation{' '}
                {policyResult.inflation.toFixed(1)}%. These four move with the policy type and
                the regime — that is the comparison the tool is for. Nothing on either chart
                carries them: both charts are the same decade path, from base output of 100, a
                base rate of 5% and a pegged 1.00 exchange rate, and a decade of recorded data
                is not a policy response. The arithmetic behind the ordering is the note
                underneath.
              </TileReadout>

            <ToolNote label="Current setting" variant="info" title="Policy Effectiveness">
              <p>
                {policyType === 'monetary'
                  ? (exchangeRateType === 'floating'
                      ? "Monetary expansion is the effective instrument under a floating rate. The central bank has no parity to defend, so it can hold the rate down and the currency is free to depreciate with it — and a cheaper currency is net exports, which is the second channel in the output tile above."
                      : "Monetary expansion is largely neutralised under a fixed rate. The parity pins the domestic rate to the world rate, so the central bank defends the currency by buying and selling reserves, which contracts the money supply the policy just expanded. What the model leaves is the part the defence could not take back, and the exchange rate does not move at all.")
                  : (exchangeRateType === 'floating'
                      ? "Fiscal expansion is the weaker instrument under a floating rate. The extra spending raises the domestic rate, which pulls in capital and appreciates the currency, and the fall in net exports offsets much of the spending. The appreciation is the leakage — and it is the term the output tile above subtracts."
                      : "Fiscal expansion is the effective instrument under a fixed rate. Holding the parity means the central bank accommodates the extra demand instead of letting the rate rise, so nothing crowds out private spending, and the currency does not appreciate to undo it. The exchange rate does not move, so the offset that erodes fiscal policy under a float is simply absent.")}
              </p>
              <p className="mt-s-2">
                Switch the policy type and the regime and watch the four outputs order
                themselves: under a float monetary beats fiscal, under a peg fiscal beats
                monetary. That ordering is the result, not an input — the two coefficients
                that produce it are properties of the economy, and the comment on them says
                which is which.
              </p>
            </ToolNote>
          </div>
        </div>
      </div>

      <div className="mt-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-3">
        <InfoBox type="info" title="Mundell-Fleming Framework">
          <p>Small open economy with imperfect capital mobility</p>
          <p>IS-LM-PC model extended to international capital flows</p>
          <p>Exchange rate regime determines policy effectiveness</p>
        </InfoBox>

        <InfoBox type="warning" title="Impossible Trinity">
          <p>Cannot simultaneously have fixed exchange rates, free capital mobility, and independent monetary policy</p>
          <p>Must choose two of three options</p>
          <p>Fixed exchange rates require sacrificing monetary independence</p>
        </InfoBox>

        <InfoBox type="success" title="Policy Implications">
          <p>Floating rates allow monetary policy to focus on domestic objectives</p>
          <p>Fixed rates require coordination with international monetary policy</p>
          <p>Capital controls can provide alternative policy flexibility</p>
        </InfoBox>
      </div>

      <ToolNote label="Key insights" variant="insight" title="Insights from Mundell-Fleming" headingLevel={2}>
        <ul>
          <li>
            <strong>Exchange Rate Regimes:</strong> The choice of exchange rate regime fundamentally affects policy effectiveness.
            Fixed rates limit monetary autonomy but provide exchange rate stability.
          </li>
          <li>
            <strong>Capital Mobility:</strong> Imperfect capital mobility means that monetary policy is less effective in a fixed rate system.
            Capital flows offset most of any attempt to change interest rates, and the central bank unwinds what is left to hold the parity.
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
      </ToolNote>
    </div>
  )
}
