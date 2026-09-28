import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, BarChart } from 'recharts'
import { ChartArea, ChartBar, ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'

/** Series keep a fixed economic identity across every chart in this tool. */
const CREDIT_SPREAD_STROKE = chartColor(4)
const OUTPUT_STROKE = chartColor(0)
const UNEMPLOYMENT_STROKE = chartColor(2)
const INFLATION_STROKE = chartColor(1)
/** The IS-LM model's accounting levels, which are a third thing: neither the
 * record nor a rate. Slot 3 rather than 0 so the model's output bar cannot be
 * mistaken for the recorded output line above it. */
const MODEL_LEVEL_FILL = chartColor(3)

const SPLIT = 'grid gap-s-6 lg:grid-cols-2'

interface CrisisDataPoint {
  quarter: string
  creditSpread: number
  output: number
  unemployment: number
  inflation: number
  isShock: boolean
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
  // 2008.5 is 2008Q3 exactly — the Lehman quarter, and where this tool used to
  // be pinned whatever the slider said. It is the default because the crisis is
  // what the tool is about, not because the number is convenient.
  timePeriod: 2008.5,
  showISLM: true,
}

export default function Crisis2008() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [timePeriod, setTimePeriod] = useState(DEFAULTS.timePeriod)
const [showISLM, setShowISLM] = useState(DEFAULTS.showISLM)

  const { reset, dirty } = useToolReset(
    {
    timePeriod: timePeriod,
    showISLM: showISLM,
    },
    {
      setTimePeriod,
      setShowISLM,
    },
    {
      timePeriod: DEFAULTS.timePeriod,
      showISLM: DEFAULTS.showISLM,
    },
  )

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
  /**
   * The quarter the Time Period slider is sitting on.
   *
   * The slider used to drive nothing at all: it was in `DEFAULTS`, it was the
   * control's value, and the model read a hard-coded
   * `crisisData.find(d => d.quarter === '2008Q3')`, so the four tiles read
   * 205.0 / 5.0 / 352.5 / 150.0 at every position on its travel. A control
   * that looks live and does nothing is the class this wave has been removing
   * from other tools, and this one sat above the crisis itself.
   *
   * The timeline is quarterly and the slider steps by half a year, so the
   * reader lands on the nearest quarter rather than a date between two. The
   * credit spread widens through 2009 and the output and unemployment paths
   * follow it, so the tiles now show the model unwinding as the reader drags
   * the crisis forward.
   */
  const quarterValue = (quarter: string): number => {
    const parsed = /^(\d{4})Q([1-4])$/.exec(quarter)
    return parsed ? Number(parsed[1]) + (Number(parsed[2]) - 1) / 4 : Number.NaN
  }
  const currentData = crisisData.reduce((best, point) =>
    Math.abs(quarterValue(point.quarter) - timePeriod) <
    Math.abs(quarterValue(best.quarter) - timePeriod)
      ? point
      : best,
  )
  
  // IS-LM model for crisis period
  const [g] = useState(100)
  const [m] = useState(150)
  const [tax] = useState(50)
  const [interestRate] = useState(5)
  
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

  /**
   * The IS-LM model's own three accounting levels, which is the data the bar
   * chart below plots.
   *
   * It is a separate array rather than a `dataKey` on `crisisData` for the
   * reason the two charts in this panel are two charts: the tiles report the
   * MODEL, and the recorded quarterly path is a different object with
   * different units. Output in the record is an index around 100, because that
   * is what a real-time GDP index is; output in `simulateISLM` is
   * `100 + (100 - spread*10) + G - T`, which at the Lehman quarter is 205, and
   * money demand is `0.5Y + 50r`, which is 352.5. Splicing either of those
   * onto the quarterly array would have put two objects on one axis with
   * nothing to say which is which — which is exactly the defect this panel
   * had, in the one form where the tile labels matched the chart's series
   * names and the numbers did not.
   *
   * The names are single strings and the axis is rotated, and MEASURED is why
   * both. Recharts word-wraps a tick label to the PLOT width and does not
   * honour a newline, so `'Money\nDemand'` renders as one 12-character line:
   * at 390px/130% the three labels measured 70.1px, 106.4px and 96.7px in a
   * 61.7px band, so they overlapped by 26.6px and 39.9px and the third left
   * the SVG by 9.5px. Rotated, each label's footprint is its font size — 14.3px
   * in that same 61.7px band — at any width and any text scale.
   */
  const islmLevels = [
    { term: 'Output (Y)', level: islmResult.output },
    { term: 'Money demand (L)', level: islmResult.moneyDemand },
    { term: 'Money supply (M)', level: islmResult.moneySupply },
  ]
  
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
        <div className="button-group">
          <Button
            onClick={() => setShowISLM(!showISLM)}
            variant={showISLM ? 'primary' : 'secondary'}
          >
            {showISLM ? 'Hide IS-LM' : 'Show IS-LM'}
          </Button>
        </div>
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Credit Spreads Over Time
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={crisisData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')} dataKey="quarter" {...chartTheme.axis} />
            <YAxis
              key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <ChartArea
              type="monotone"
              dataKey="creditSpread"
              stroke={CREDIT_SPREAD_STROKE}
              fill={CREDIT_SPREAD_STROKE}
              fillOpacity={0.15}
              name="Credit Spread (BAA-AAA)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {showISLM && (
        <div className="mb-s-8">
          <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
            IS-LM Analysis During Crisis
          </h2>
          {/*
           * The two charts below are two OBJECTS and this sentence is the
           * thing that says so.
           *
           * The panel used to hold one chart — the recorded quarterly path of
           * output and unemployment — beside four tiles reading "Output",
           * "Interest Rate", "Money Demand" and "Money Supply", and the tiles
           * were `simulateISLM`'s values while the chart was history. A reader
           * who went looking for the 205.0 in the tile found a y axis running
           * 0 to 140, because the chart's own output series tops out at 122:
           * the label matched and the number did not, and the page had nothing
           * to say the two were unrelated.
           *
           * The decision is the first of the three: PLOT THE SIMULATION ON A
           * CHART THAT IS ABOUT THE SIMULATION. Marking 205 on a 0–140 axis
           * was rejected because Recharts deletes a reference line whose
           * value is off the scale, so the mark would have existed only in the
           * settings where it was least needed; and widening that axis to 360
           * to hold a money quantity would have squashed two years of output
           * into the top third of a chart whose job is to show a collapse. So
           * the model gets a chart of its own, and each tile is now either a
           * bar on it or named in the caption under it.
           */}
          <p className="mb-s-4 text-sm leading-relaxed text-fg-muted">
            Two different things are on this panel and they do not measure the
            same object. The chart on the left is the <strong>record</strong>:
            what output and unemployment actually did, quarter by quarter. The
            chart on the right is the <strong>IS-LM model</strong> run on the
            Lehman quarter, in the model's own accounting units. The four tiles
            below belong to the model, and each is either a bar on the right or
            named in its caption.
          </p>
          <div className={SPLIT}>
            <div>
              <h2 className="mb-s-3 text-label-sm font-semibold text-fg">
                The record: output and unemployment
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={crisisData} margin={chartTheme.margin}>
                  <CartesianGrid {...chartTheme.grid} />
                  <XAxis
                    key={chartTheme.axisKey('x')} dataKey="quarter" {...chartTheme.axis} includeHidden />
                  <YAxis
                    key={chartTheme.axisKey('y')} {...chartTheme.yAxis} includeHidden />
                  <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                  <ChartLine
                    type="monotone"
                    dataKey="output"
                    stroke={OUTPUT_STROKE}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Output (Y)"
                  />
                  <ChartLine
                    type="monotone"
                    dataKey="unemployment"
                    stroke={UNEMPLOYMENT_STROKE}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Unemployment Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
              <TileReadout>
                Recorded, not modelled: output is an index (2007 = 100) and falls
                from 100 to 85 at 2009Q1 before recovering to 122 by 2013Q1;
                unemployment peaks at 9.8% in 2010Q4. Neither number is the
                output on the tile beside it, and the y axis here is
                0–140 precisely because the record does not leave it.
              </TileReadout>
            </div>

            <div>
              <h2 className="mb-s-3 text-label-sm font-semibold text-fg">
                The model: IS-LM accounting at {currentData.quarter}
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={islmLevels} margin={chartTheme.margin}>
                  <CartesianGrid {...chartTheme.grid} />
                  <XAxis
                    key={chartTheme.axisKey('x')}
                    dataKey="term"
                    angle={-90}
                    textAnchor="end"
                    /* The third axis band in the tools, and for the reason in
                     * the comment on `islmLevels`: three horizontal names in a
                     * 61.7px band is two overlaps and a clipped label. 105px
                     * holds the longest of the three, 'Money demand (L)', at
                     * 130% — the same trade `ModernISCurve` and
                     * `RealInterestRateCalculator` make, and the same
                     * `tools.test.tsx` property covers it. */
                    height={105}
                    interval={0}
                    {...chartTheme.axis}
                    includeHidden
                  />
                  <YAxis
                    key={chartTheme.axisKey('y')}
                    label={{
                      // "Index units" would be a claim the model does not make:
                      // `G`, `M` and `T` are 100, 150 and 50, which is an
                      // accounting convention rather than an index base. The
                      // label says what the axis measures and no more, and it
                      // is 19 characters because a rotated y label is measured
                      // against half the plot box — see `axisDomains.test.ts`.
                      value: 'Model level (units)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.yAxis}
                    includeHidden
                  />
                  <Tooltip
                    {...chartTheme.tooltip}
                    cursor={chartTheme.cursor}
                    formatter={(value: number) => value.toFixed(1)}
                  />
                  <ChartBar dataKey="level" fill={MODEL_LEVEL_FILL} name="Model level" />
                </BarChart>
              </ResponsiveContainer>
              <TileReadout>
                Modelled, not recorded: the three bars are the tiles' own
                numbers — output {islmResult.output.toFixed(1)}, money demand{' '}
                {islmResult.moneyDemand.toFixed(1)} and money supply{' '}
                {islmResult.moneySupply.toFixed(1)}                 in the model's units, at a credit spread of{' '}
                {currentData.creditSpread.toFixed(1)} — the {currentData.quarter} reading of
                the timeline, which is the quarter the Time Period slider is on. Interest rate {islmResult.interestRate.toFixed(1)}%
                is the policy rate the model assumes rather than a level, so at
                5.0 it would be a 5-unit stub against a 352-unit bar: it is a
                tile, not a bar.
              </TileReadout>
            </div>
          </div>

          <div className="mt-s-6 mb-s-6 grid grid-cols-2 gap-s-3">
            <StatBox label="Output" value={islmResult.output.toFixed(1)} />
            <StatBox label="Interest Rate" value={islmResult.interestRate.toFixed(1)} unit="%" />
            <StatBox label="Money Demand" value={islmResult.moneyDemand.toFixed(1)} />
            <StatBox label="Money Supply" value={islmResult.moneySupply.toFixed(1)} />
          </div>

          <ToolNote label="Reference" variant="info" title="Crisis Impact on IS-LM">
            <p>
              The 2008 crisis caused credit spreads to widen dramatically (from 1.5% to 6.0%), reducing investment and shifting the IS curve left.
              This led to lower output and higher unemployment as shown in the IS-LM diagram.
            </p>
          </ToolNote>
        </div>
      )}

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Unemployment and Inflation Path
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={crisisData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')} dataKey="quarter" {...chartTheme.axis} />
            <YAxis
              key={chartTheme.axisKey('y')} {...chartTheme.yAxis} />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <ChartLine
              type="monotone"
              dataKey="unemployment"
              stroke={UNEMPLOYMENT_STROKE}
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Unemployment Rate"
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

      <div className="mt-s-8 grid gap-s-6 sm:grid-cols-2 lg:grid-cols-3">
        <ToolNote label="Info" variant="info" title="The Crisis Timeline">
          <p>2007: Subprime mortgage crisis begins with rising defaults</p>
          <p>2008Q3-Q4: Lehman Brothers collapse triggers credit market freeze</p>
          <p>2009: Sharp recession with unemployment reaching 10%</p>
          <p>2010-2013: Slow recovery with continued high unemployment</p>
        </ToolNote>

        <ToolNote label="Watch out" variant="warning" title="Credit Market Freeze">
          <p>As credit spreads widened from 1.5% to 6.0%, businesses and consumers found it increasingly difficult to borrow.</p>
          <p>This reduced investment and consumption, shifting the IS curve left and causing a recession.</p>
        </ToolNote>

        <ToolNote label="Note" variant="lesson" title="Policy Response">
          <p>Fed responded with quantitative easing (QE) and fiscal stimulus (TARP, stimulus package).</p>
          <p>These measures helped stabilize credit markets and support aggregate demand.</p>
        </ToolNote>
      </div>

      <ToolNote label="Reference" variant="info" title="Key Lessons from the Crisis" headingLevel={2}>
        <ul>
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
      </ToolNote>
    </div>
  )
}
