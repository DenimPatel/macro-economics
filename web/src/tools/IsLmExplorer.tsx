import { useState } from 'react'
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { ChartLine } from '../components/ChartPrimitives'
import {
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { ChartLegend } from '../components/ChartLegend'
import { useHiddenSeries } from '../lib/chartSeries'
import { dataDomain } from '../lib/chartDomain'
import { useToolReset } from '../lib/toolReset'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'

/** IS and LM keep a fixed economic identity across every chart in this tool. */
const IS_STROKE = chartColor(0)
const LM_STROKE = chartColor(3)

/** Layout shared by the "controls beside chart" blocks. */
const SPLIT = 'grid gap-s-8 lg:grid-cols-2'

const NOTE_BOX = 'mt-s-6 rounded-card border border-border bg-surface p-s-4'

/**
 * One copy of every starting value.
 *
 * The upper panels' ranges differ from the Scenario A/B panel's — `beta`
 * is 2..20 here and `I₀` is 20..100 here against 20..80 there — so the two
 * sets of sliders are two views of the same state over different windows,
 * and a reader can park `I₀` at 90 in one panel and find the other panel
 * has silently moved it to 80. The defaults below are the ones the page
 * opens at, and `useToolReset` reads the same object the `useState` calls
 * do, so "Reset to defaults" cannot drift from them.
 */
const DEFAULTS = {
  G_a: 100,
  T_a: 50,
  M_a: 150,
  P_a: 1.0,
  I0_a: 50,
  G_b: 120,
  T_b: 50,
  M_b: 150,
  P_b: 1.0,
  I0_b: 50,
  beta: 10,
  gamma: 5,
  // Deliberately not `as const` and not `satisfies`: either one narrows the
  // fields to literal types, and `useState(DEFAULTS.G_a)` would then infer
  // `useState<100>` — a setter that only accepts the number it started as.
  // The completeness check that matters is the `useToolReset` call below,
  // whose `defaults: V` has to carry every key `current` does.
  comparison: false,
}

/**
 * The interest-rate range the curves are SAMPLED over, which is a property
 * of `calculateISCurve` / `calculateLMCurve` and not of the reader's
 * settings. The charts below put their r axis exactly on it — the first
 * chart used `[0, 20]` for a curve sampled to 25, so the top fifth of the
 * IS curve was drawn past the plot edge and clipped.
 */
const IS_RATE_RANGE: [number, number] = [0, 25]
const LM_RATE_RANGE: [number, number] = [0, 20]

/**
 * A rate is a percentage, and the axis label says `r` rather than `r (%)`, so
 * the unit has to come with the number. Three of this tool's four charts
 * print it through this formatter and one — the diagram — did not, which is
 * the D5 defect: a reader comparing `3.5` on one chart with `3.50` on the
 * next has no way to know they are the same quantity.
 */
const asRate = (value: number) => `${value.toFixed(2)}%`

export default function IsLmExplorer() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  // Scenario A parameters
  const [G_a, setG_a] = useState(DEFAULTS.G_a)
  const [T_a, setT_a] = useState(DEFAULTS.T_a)
  const [M_a, setM_a] = useState(DEFAULTS.M_a)
  const [P_a, setP_a] = useState(DEFAULTS.P_a)
  const [I0_a, setI0_a] = useState(DEFAULTS.I0_a)

  // Scenario B parameters
  const [G_b, setG_b] = useState(DEFAULTS.G_b)
  const [T_b, setT_b] = useState(DEFAULTS.T_b)
  const [M_b, setM_b] = useState(DEFAULTS.M_b)
  const [P_b, setP_b] = useState(DEFAULTS.P_b)
  const [I0_b, setI0_b] = useState(DEFAULTS.I0_b)

  // Model parameters
  const C0 = 40
  const alpha = 0.15 // Investment sensitivity to output (reduced to avoid singularity)
  const [beta, setBeta] = useState(DEFAULTS.beta) // Investment sensitivity to interest rate (user-adjustable)
  const [gamma, setGamma] = useState(DEFAULTS.gamma) // Money demand sensitivity to interest rate (user-adjustable)
  const mpc = 0.6
  // Named for the value rather than the verb so `useToolReset`'s derived
  // setter key (`set` + the value's name) resolves, and so the reset reads
  // the same way every other control in the tool does.
  const [comparison, setComparison] = useState<boolean>(DEFAULTS.comparison)
  const comparisonMode = comparison

  const { reset, dirty } = useToolReset(
    { G_a, T_a, M_a, P_a, I0_a, G_b, T_b, M_b, P_b, I0_b, beta, gamma, comparison: comparisonMode },
    {
      setG_a,
      setT_a,
      setM_a,
      setP_a,
      setI0_a,
      setG_b,
      setT_b,
      setM_b,
      setP_b,
      setI0_b,
      setBeta,
      setGamma,
      setComparison,
    },
    {
      G_a: DEFAULTS.G_a,
      T_a: DEFAULTS.T_a,
      M_a: DEFAULTS.M_a,
      P_a: DEFAULTS.P_a,
      I0_a: DEFAULTS.I0_a,
      G_b: DEFAULTS.G_b,
      T_b: DEFAULTS.T_b,
      M_b: DEFAULTS.M_b,
      P_b: DEFAULTS.P_b,
      I0_b: DEFAULTS.I0_b,
      beta: DEFAULTS.beta,
      gamma: DEFAULTS.gamma,
      comparison: DEFAULTS.comparison,
    },
  )

  // The IS-LM diagram's series, keyed so a legend can hide one and so the
  // tooltip's rows are addressable by key rather than by position. The key
  // names double as the legend's identity, which is why they are built here
  // and not inside the JSX.
  const series = useHiddenSeries(['IS', 'LM', 'IS-B', 'LM-B'])
  const showB = comparisonMode

  // Calculate IS curve: Y = C(Y-T) + I(Y,r) + G
  // => Y = C0 + mpc*(Y-T) + (I0 + alpha*Y - beta*r) + G
  // => Y*(1 - mpc - alpha) = C0 - mpc*T + I0 - beta*r + G
  // => Y = [C0 - mpc*T + I0 + G - beta*r] / (1 - mpc - alpha)
  const calculateISCurve = (G: number, T: number, I0: number) => {
    const data = []
    // Generate points from r=0 to r=25 with finer granularity
    for (let r = 0; r <= 25; r += 0.25) {
      const denominator = 1 - mpc - alpha
      const numerator = C0 - mpc * T + I0 + G - beta * r
      const Y = numerator / denominator
      // Include all points in range, don't filter
      data.push({ r: parseFloat(r.toFixed(2)), Y: parseFloat(Y.toFixed(2)), curve: 'IS' })
    }
    return data
  }

  // Calculate LM curve: M/P = L(Y,r)
  // => M/P = Y - gamma*r
  // => Y = M/P + gamma*r
  //
  // The `Y >= 0 && Y <= 300` filter this used to carry was a second, hidden
  // domain: it discarded points rather than clipping them, so the LM chart
  // showed a shortened curve. It was reachable — the panels let M reach 250
  // and P reach 0.5, so M/P reaches 500 and EVERY point was discarded and
  // the chart fell through to "No data to display" while the readout beside
  // it carried a number. The filter is gone and the axis is derived from the
  // curve instead, which is where that constraint belonged.
  const calculateLMCurve = (M: number, P: number) => {
    const data = []
    for (let r = 0; r <= 20; r += 0.5) {
      const Y = M / P + gamma * r
      data.push({ r: parseFloat(r.toFixed(1)), Y: parseFloat(Y.toFixed(2)), curve: 'LM' })
    }
    return data
  }

  // Find equilibrium intersection
  const findEquilibrium = (G: number, T: number, M: number, P: number, I0: number) => {
    // Solve system:
    // IS: Y = (C0 - mpc*T + I0 + G - beta*r) / (1 - mpc - alpha)
    // LM: Y = M/P + gamma*r
    // Setting equal and solving for r:
    const a = beta + gamma * (1 - mpc - alpha)
    const b = C0 - mpc * T + I0 + G - (1 - mpc - alpha) * (M / P)
    const r_eq = b / a
    const Y_eq = M / P + gamma * r_eq

    // Calculate investment and money demand at equilibrium
    const I_eq = I0 + alpha * Y_eq - beta * r_eq
    const L_eq = Y_eq - gamma * r_eq

    return {
      Y: Math.max(0, Y_eq),
      r: Math.max(0, r_eq),
      I: Math.max(0, I_eq),
      L: Math.max(0, L_eq),
    }
  }

  // Generate data for current scenario
  const isCurveA = calculateISCurve(G_a, T_a, I0_a)
  const lmCurveA = calculateLMCurve(M_a, P_a)
  const equilibrium_a = findEquilibrium(G_a, T_a, M_a, P_a, I0_a)

  const isCurveB = calculateISCurve(G_b, T_b, I0_b)
  const lmCurveB = calculateLMCurve(M_b, P_b)
  const equilibrium_b = findEquilibrium(G_b, T_b, M_b, P_b, I0_b)

  /**
   * The diagram's series, each under its OWN y key.
   *
   * All four lines plot the same field — the diagram's vertical axis is the
   * interest rate — so they were all `dataKey="r"`, and each carried its own
   * `data` array. Recharts copes: it plots a line per graphical item. But
   * the tooltip's rows then all claim the same `dataKey`, which is what made
   * the shared tooltip's React key collide until it was given the row index
   * as a tiebreak, and it leaves any `dataKey`-keyed formatter — the natural
   * way to give the IS curve a different precision from the LM curve —
   * ambiguous. `yIS` / `yLM` are the same number under a name that says
   * which line it belongs to, which is the whole fix.
   */
  const plotIsA = isCurveA.map((d) => ({ ...d, yIS: d.r }))
  const plotLmA = lmCurveA.map((d) => ({ ...d, yLM: d.r }))
  const plotIsB = isCurveB.map((d) => ({ ...d, yIS: d.r }))
  const plotLmB = lmCurveB.map((d) => ({ ...d, yLM: d.r }))

  /**
   * The diagram plots `(Y, r)` pairs, so every series contributes its `Y` to
   * the horizontal extent and its `r` to the vertical one. Both are derived,
   * and the EQUILIBRIUM is included: it used to be a number in a chip
   * beside the plot, computed and never plotted, so it could sit above the
   * axis top while the number kept moving. It is in the domain and it is
   * drawn, as a `ReferenceDot` below.
   *
   * Including it is why this domain can be very wide. The sliders admit an
   * output of four figures — `T` at 100 against `G` at 200 is a deficit far
   * outside anything the panels suggest — and the honest response to that is
   * a wider axis, not a clipped curve. The alternative, pinning the domain
   * and hiding the overflow, is the defect.
   */
  const diagramDomain = dataDomain(
    [
      isCurveA.map((d) => d.Y),
      lmCurveA.map((d) => d.Y),
      equilibrium_a.Y,
      showB ? isCurveB.map((d) => d.Y) : [],
      showB ? lmCurveB.map((d) => d.Y) : [],
      showB ? equilibrium_b.Y : [],
    ],
    { includeZero: true, ticks: 6 },
  )
  const diagramRateDomain = dataDomain(
    [
      isCurveA.map((d) => d.r),
      lmCurveA.map((d) => d.r),
      equilibrium_a.r,
      showB ? isCurveB.map((d) => d.r) : [],
      showB ? lmCurveB.map((d) => d.r) : [],
      showB ? equilibrium_b.r : [],
    ],
    { includeZero: true, ticks: 5 },
  )

  const outputChange = equilibrium_b.Y - equilibrium_a.Y
  const rateChange = equilibrium_b.r - equilibrium_a.r

  return (
    <div className="tool-card">
      <ToolHeader
        title="IS-LM Equilibrium Explorer"
        description="Adjust fiscal and monetary policy parameters. Watch how IS and LM curves shift and equilibrium output and interest rates adjust. Explore crowding out, the multiplier effect at different interest rates, and policy effectiveness."
        badge="beginner"
      />

      {/* Lesson 1 */}
      <ToolNote
          headingLevel={2}
        label="Lesson 1"
        variant="lesson"
        title="The IS Curve (Investment = Saving)"
      >
        <p>
          <strong>What is the IS Curve?</strong> The IS curve shows the relationship between
          output (Y) and interest rate (r) in the goods market when investment equals saving.
          It is derived from the equilibrium condition Y = C + I + G.
        </p>
        <p>
          <strong>Key Formula:</strong> Y = C(Y-T) + I(r) + G
        </p>
        <ul>
          <li>
            <strong>C = C₀ + c₁(Y - T)</strong>: Consumption increases with income
          </li>
          <li>
            <strong>I = I₀ - β·r</strong>: Investment <em>decreases</em> with interest rate (higher
            rates mean fewer projects are profitable)
          </li>
          <li>
            <strong>G:</strong> Government spending (exogenous)
          </li>
        </ul>
        <p>
          <strong>Why does IS slope downward?</strong> When interest rates rise, investment falls,
          aggregate demand falls, and output must fall to restore equilibrium. Hence, higher r is
          paired with lower Y.
        </p>
        <p>
          <strong>What shifts the IS curve?</strong> Changes in fiscal policy (G or T) shift the IS
          curve:
        </p>
        <ul>
          <li>
            <strong>G up (expansionary)</strong>: IS shifts RIGHT (output up at each interest rate)
          </li>
          <li>
            <strong>T up (contractionary)</strong>: IS shifts LEFT (output down at each interest
            rate)
          </li>
          <li>
            <strong>I₀ down (worse investment climate)</strong>: IS shifts LEFT
          </li>
        </ul>
      </ToolNote>

      {/* Interactive: IS */}
      <ToolNote label="Try it" variant="try" title="Adjust IS Curve Parameters"
        headingLevel={2}>
        <div className={SPLIT}>
          <div>
            <h2 className="mb-s-4 text-label-sm font-semibold text-fg">IS Curve Parameters</h2>
            <div className="control-panel">
              <SliderControl paramKey="G_a" label="Government Spending (G)" value={G_a} min={50} max={150} onChange={setG_a} />
              <SliderControl paramKey="T_a" label="Taxes (T)" value={T_a} min={20} max={80} onChange={setT_a} />
              <SliderControl
                paramKey="I0_a"
                label="Base Investment (I₀)"
                value={I0_a}
                min={20}
                max={100}
                onChange={setI0_a}
              />
              <SliderControl
                paramKey="beta"
                label="Interest Rate Sensitivity (β)"
                value={beta}
                min={2}
                max={20}
                onChange={setBeta}
              />
            </div>

            <div className={NOTE_BOX}>
              <p>
                <strong>What to observe:</strong> As you increase G, the IS curve shifts RIGHT. As
                you increase T, it shifts LEFT. Changes in I₀ shift the curve in the same direction
                as G changes.
              </p>
              <p className="mt-s-2">
                <strong>Curve Slope:</strong> The parameter β (interest rate sensitivity) controls
                the IS curve's slope. Higher β means a steeper slope (investment less sensitive to
                rates). Lower β means a flatter slope (investment more sensitive to rates).
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-s-4 text-label-sm font-semibold text-fg">IS Curve</h2>
            {isCurveA.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={isCurveA} margin={chartTheme.margin}>
                  <CartesianGrid {...chartTheme.grid} />
                  <XAxis
                    key={chartTheme.axisKey('x')}
                    dataKey="Y"
                    type="number"
                    /* Derived, and the hard-coded `ticks` go with it: a tick
                     * list written for `[0, 500]` prints 100-unit labels on
                     * a domain of `[-400, 700]` and prints almost none on
                     * one of `[-2000, 1400]`. Recharts picks from the
                     * domain, and picks it correctly. */
                    domain={dataDomain([isCurveA.map((d) => d.Y)], { ticks: 5 })}
                    label={{
                      value: 'Output (Y)',
                      position: 'insideBottomRight',
                      offset: -5,
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.axis}
                    includeHidden
                  />
                  <YAxis
                    key={chartTheme.axisKey('y')}
                    /* The rate axis is the curve's own sampling range. It
                     * used to be `[0, 20]` with `allowDataOverflow` for a
                     * curve sampled to `r = 25`, so a fifth of the IS curve
                     * was drawn past the top edge and clipped. */
                    domain={IS_RATE_RANGE}
                    label={{
                      value: 'Interest Rate (r)',
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
                    formatter={(value: number) => asRate(value)}
                    labelFormatter={(label: number) => `Output (Y) = ${label.toFixed(1)}`}
                  />
                  <ChartLine
                    type="monotone"
                    dataKey="r"
                    stroke={IS_STROKE}
                    dot={false}
                    strokeWidth={2}
                    name="IS Curve"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              /* The empty state reserves the plot's own frame, so the two
               * panels in this row are the same height whether or not there
               * is a curve, and the page does not jump when one appears. It
               * is a `<div>` and not a container, so it cannot carry a height
               * PROP the way every plot does — hence the class, and hence
               * `tools.test.tsx` holding both spellings to the same number
               * rather than only the one a chart can write.
               *
               * The number is spelled in words on purpose. The plot-height test
               * classifies every `height={…}` by WHERE it was written, and a
               * number written inside a comment is written inside a comment. */
              <div className="flex h-[400px] items-center justify-center rounded-card border border-border bg-surface-2">
                <p className="text-sm text-fg-subtle">No data to display</p>
              </div>
            )}
          </div>
        </div>
      </ToolNote>

      {/* Lesson 2 */}
      <ToolNote
          headingLevel={2}
        label="Lesson 2"
        variant="lesson"
        title="The LM Curve (Liquidity Money)"
      >
        <p>
          <strong>What is the LM Curve?</strong> The LM curve shows the relationship between
          output (Y) and interest rate (r) in the money market when money supply equals money
          demand. It is derived from the equilibrium condition M/P = L.
        </p>
        <p>
          <strong>Key Formula:</strong> M/P = L(Y, r)
        </p>
        <ul>
          <li>
            <strong>M/P:</strong> Real money supply (fixed by central bank)
          </li>
          <li>
            <strong>L(Y):</strong> Money demand <em>increases</em> with output (higher income means
            more spending and more money needed)
          </li>
          <li>
            <strong>L(r):</strong> Money demand <em>decreases</em> with interest rate (higher rates
            mean a higher cost of holding money, so hold less)
          </li>
        </ul>
        <p>
          <strong>Why does LM slope upward?</strong> When output increases, money demand rises, and
          the interest rate must rise to clear the money market. Hence, higher Y is paired with
          higher r.
        </p>
        <p>
          <strong>What shifts the LM curve?</strong> Changes in monetary policy (M or P) shift the LM
          curve:
        </p>
        <ul>
          <li>
            <strong>M up (expansionary)</strong>: LM shifts RIGHT (lower rates at each output level)
          </li>
          <li>
            <strong>M down (contractionary)</strong>: LM shifts LEFT (higher rates at each output
            level)
          </li>
          <li>
            <strong>P up (inflation)</strong>: LM shifts LEFT (real money supply falls)
          </li>
        </ul>
      </ToolNote>

      {/* Interactive: LM */}
      <ToolNote label="Try it" variant="try" title="Adjust LM Curve Parameters"
        headingLevel={2}>
        <div className={SPLIT}>
          <div>
            <h2 className="mb-s-4 text-label-sm font-semibold text-fg">LM Curve Parameters</h2>
            <div className="control-panel">
              <SliderControl paramKey="M_a" label="Money Supply (M)" value={M_a} min={80} max={250} onChange={setM_a} />
              <SliderControl
                paramKey="P_a"
                label="Price Level (P)"
                value={P_a}
                min={0.5}
                max={2.0}
                step={0.1}
                onChange={setP_a}
              />
              <SliderControl
                paramKey="gamma"
                label="Money Demand Sensitivity (γ)"
                value={gamma}
                min={1}
                max={30}
                onChange={setGamma}
              />
            </div>

            <div className={NOTE_BOX}>
              <p>
                <strong>What to observe:</strong> As you increase M, the LM curve shifts RIGHT
                (lower interest rates at each output level). As you increase P, the LM curve shifts
                LEFT (real money supply decreases).
              </p>
              <p className="mt-s-2">
                <strong>Curve Slope:</strong> The LM curve's slope is determined by money demand
                sensitivity (γ). The slope is 1/γ, so higher γ means a steeper LM curve (more
                interest rate sensitivity to output changes).
              </p>
            </div>
          </div>

          <div>
            <h2 className="mb-s-4 text-label-sm font-semibold text-fg">LM Curve</h2>
            {lmCurveA.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lmCurveA} margin={chartTheme.margin}>
                  <CartesianGrid {...chartTheme.grid} />
                  <XAxis
                    key={chartTheme.axisKey('x')}
                    dataKey="Y"
                    type="number"
                    /* Derived. This is the chart the `Y <= 300` filter used to
                     * feed: with M at 250 and P at 0.5 the real money supply
                     * is 500, every point was discarded, and the "No data to
                     * display" panel appeared while the readout beside it
                     * carried a live number. */
                    domain={dataDomain([lmCurveA.map((d) => d.Y)], {
                      includeZero: true,
                      ticks: 5,
                    })}
                    label={{
                      value: 'Output (Y)',
                      position: 'insideBottomRight',
                      offset: -5,
                      fill: chartTheme.axis.tick.fill,
                    }}
                    {...chartTheme.axis}
                    includeHidden
                  />
                  <YAxis
                    key={chartTheme.axisKey('y')}
                    /* `calculateLMCurve` samples r to 20, so `[0, 20]` is the
                     * curve's own range and is not a guess. */
                    domain={LM_RATE_RANGE}
                    label={{
                      value: 'Interest Rate (r)',
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
                    formatter={(value: number) => asRate(value)}
                    labelFormatter={(label: number) => `Output (Y) = ${label.toFixed(1)}`}
                  />
                  <ChartLine
                    type="monotone"
                    dataKey="r"
                    stroke={LM_STROKE}
                    dot={false}
                    strokeWidth={2}
                    name="LM Curve"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              /* As the IS panel above: the same reserved frame, and the same
               * reason it is spelled as a class. */
              <div className="flex h-[400px] items-center justify-center rounded-card border border-border bg-surface-2">
                <p className="text-sm text-fg-subtle">No data to display</p>
              </div>
            )}
          </div>
        </div>
      </ToolNote>

      {/* Lesson 3 */}
      <ToolNote label="Lesson 3" variant="lesson" title="IS-LM Equilibrium"
        headingLevel={2}>
        <p>
          <strong>What is IS-LM Equilibrium?</strong> The intersection of the IS and LM curves
          determines the equilibrium output (Y*) and interest rate (r*) where both the goods market
          and money market clear simultaneously.
        </p>
        <p>
          <strong>Graphical Intuition:</strong>
        </p>
        <ul>
          <li>
            Points <em>above</em> IS: Investment greater than Saving (excess demand, so output is
            pushed up)
          </li>
          <li>
            Points <em>below</em> IS: Investment less than Saving (excess saving, so output falls)
          </li>
          <li>
            Points <em>above</em> LM: Money demand greater than Money supply (interest rates rise to
            equilibrate)
          </li>
          <li>
            Points <em>below</em> LM: Money demand less than Money supply (interest rates fall to
            equilibrate)
          </li>
        </ul>
        <p>
          <strong>Policy Implications:</strong>
        </p>
        <ul>
          <li>
            <strong>Fiscal Policy (G up):</strong> Shifts IS right, so output up and interest rate
            up (crowding out: higher rates discourage investment)
          </li>
          <li>
            <strong>Monetary Policy (M up):</strong> Shifts LM right, so output up and interest rate
            down (less crowding out)
          </li>
          <li>
            <strong>Combined:</strong> Fiscal and monetary policy can amplify output increases with
            minimal rate increases
          </li>
        </ul>
      </ToolNote>

      {/* Comparison toggle */}
      <label className="mb-s-8 flex cursor-pointer items-center gap-s-2 text-sm font-medium text-fg">
        <input
          type="checkbox"
          checked={comparison}
          onChange={(e) => setComparison(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-accent"
        />
        Compare Two Scenarios
      </label>

      <ToolControlBar onReset={reset} dirty={dirty} />

      <div className="mb-s-8 grid gap-s-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-s-5 text-lg font-semibold tracking-tight text-fg">Scenario A</h2>
          <div className="control-panel">
            <SliderControl
              label="Government Spending (G)"
              value={G_a}
              min={50}
              max={200}
              step={10}
              onChange={setG_a}
              unit="units"
            />
            <SliderControl
              label="Taxes (T)"
              value={T_a}
              min={20}
              max={100}
              step={5}
              onChange={setT_a}
              unit="units"
            />
            <SliderControl
              label="Money Supply (M)"
              value={M_a}
              min={50}
              max={200}
              step={10}
              onChange={setM_a}
              unit="units"
            />
            <SliderControl
              label="Price Level (P)"
              value={P_a}
              min={0.8}
              max={1.2}
              step={0.1}
              onChange={setP_a}
            />
            <SliderControl
              label="Investment Intercept (I₀)"
              value={I0_a}
              min={20}
              max={80}
              step={5}
              onChange={setI0_a}
              unit="units"
            />
          </div>
        </div>

        {comparisonMode && (
          <div>
            <h2 className="mb-s-5 text-lg font-semibold tracking-tight text-fg">Scenario B</h2>
            <div className="control-panel">
              <SliderControl
                paramKey="G_b"
                label="Government Spending (G)"
                value={G_b}
                min={50}
                max={200}
                step={10}
                onChange={setG_b}
                unit="units"
              />
              <SliderControl
                paramKey="T_b"
                label="Taxes (T)"
                value={T_b}
                min={20}
                max={100}
                step={5}
                onChange={setT_b}
                unit="units"
              />
              <SliderControl
                paramKey="M_b"
                label="Money Supply (M)"
                value={M_b}
                min={50}
                max={200}
                step={10}
                onChange={setM_b}
                unit="units"
              />
              <SliderControl
                paramKey="P_b"
                label="Price Level (P)"
                value={P_b}
                min={0.8}
                max={1.2}
                step={0.1}
                onChange={setP_b}
              />
              <SliderControl
                paramKey="I0_b"
                label="Investment Intercept (I₀)"
                value={I0_b}
                min={20}
                max={80}
                step={5}
                onChange={setI0_b}
                unit="units"
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-s-8">
        <h2 className="mb-s-4 text-micro font-bold uppercase tracking-widest text-fg-subtle">
          Equilibrium Results
        </h2>
        <div className="grid grid-cols-2 gap-s-3 lg:grid-cols-4">
          <StatBox label="Output (Y*)" value={equilibrium_a.Y.toFixed(2)} tone="accent" />
          <StatBox label="Interest Rate (r*)" value={equilibrium_a.r.toFixed(2)} unit="%" />
          <StatBox label="Investment at Eq." value={equilibrium_a.I.toFixed(2)} unit="units" />
          <StatBox label="Money Demand (L)" value={equilibrium_a.L.toFixed(2)} unit="units" />
        </div>
          <TileReadout>
                    Output {equilibrium_a.Y.toFixed(2)} and the interest rate{' '}
          {equilibrium_a.r.toFixed(2)} are the two curves' crossing, so those
          two tiles are a point on the IS-LM diagram below. Investment at Eq.
                    and Money Demand (L) are the two values that CROSSING is built from —
                    I = Ī − βr and L = k̄Y − hY − (h/P)i, evaluated at (Y*, r*) — and
                    they are on no axis, because the diagram's axes are Y and r and both
                    of these are off-picture quantities read off the curves. The Δ tiles
                    in the second row are the differences between scenario A and scenario
                    B: the distance between the two crossings on each axis.
                  </TileReadout>
      </div>

      {comparisonMode && (
        <>
          <div className="mb-s-8">
            <h2 className="mb-s-4 text-micro font-bold uppercase tracking-widest text-fg-subtle">
              Policy Impact Comparison
            </h2>
            <div className="grid grid-cols-2 gap-s-3 lg:grid-cols-4">
              <StatBox
                label="Output Change (ΔY)"
                value={`${outputChange >= 0 ? '+' : ''}${outputChange.toFixed(2)}`}
                tone={outputChange >= 0 ? 'positive' : 'negative'}
              />
              <StatBox
                label="Interest Rate Change (Δr)"
                value={`${rateChange >= 0 ? '+' : ''}${rateChange.toFixed(2)}%`}
                tone={rateChange >= 0 ? 'negative' : 'positive'}
              />
              <StatBox label="Scenario B Output" value={equilibrium_b.Y.toFixed(2)} tone="accent" />
              <StatBox label="Scenario B Rate" value={`${equilibrium_b.r.toFixed(2)}%`} tone="accent" />
            </div>
          </div>

          <ToolNote label="Watch out" variant="warning" title="Crowding Out Effect"
        headingLevel={2}>
            <p>
              When fiscal policy increases without accompanying monetary expansion, interest rates
              rise, discouraging private investment. This is &quot;crowding out.&quot;
            </p>
            <p>
              <strong>Your results:</strong> If Δr is positive (rates rose), look for the output gain
              to be smaller than predicted by the multiplier alone, because investment fell.
            </p>
          </ToolNote>

          <ToolNote label="Insight" variant="insight" title="Policy Effectiveness Comparison"
        headingLevel={2}>
            <ul>
              <li>
                <strong>Fiscal policy alone:</strong> Raises output but also raises rates (crowding
                out reduces gains)
              </li>
              <li>
                <strong>Monetary policy alone:</strong> Raises output and lowers rates (no crowding
                out, investment encouraged)
              </li>
              <li>
                <strong>Combined policy:</strong> Maximum output gain with minimal rate increases
                (best of both worlds)
              </li>
            </ul>
          </ToolNote>
        </>
      )}

      {/* IS-LM diagram */}
      <figure className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">IS-LM Diagram</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={plotIsA} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="Y"
              label={{
                value: 'Output (Y)',
                position: 'insideBottomRight',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              /* Derived from every series AND from the equilibrium, which is
               * the whole of D1. This axis was pinned to `[0, 700]` with
               * `allowDataOverflow`, and the equilibrium was a number in a
               * chip below the plot that nothing bounded: park T at 100
               * against G at 200 and Y* runs past 700 while the plotted
               * curves stop at the frame and the number keeps moving. The
               * axis now contains the answer, and the answer is drawn. */
              domain={diagramDomain}
              /* The domain is computed from ALL the series, hidden ones
               * included. Without this, hiding a series re-scales both axes
               * and every remaining series appears to move — a legend
               * toggle that changes the numbers on the plot. */
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Interest Rate (r)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              domain={diagramRateDomain}
              {...chartTheme.yAxis}
              includeHidden
            />
            {/* The formatter is the D5 fix and it is two lines of it. This
             * tooltip was the only one in the tool with no `formatter`, so
             * the diagram printed `r` as a bare `3.5` / `15.5` where every
             * other chart printed two decimals and a unit; `labelFormatter`
             * names the horizontal quantity, which the raw tick labels
             * (0/7/14/21/28) never did. */}
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => asRate(value)}
              labelFormatter={(label: number) => `Output (Y) = ${label.toFixed(1)}`}
            />
            {/* The equilibrium, plotted. `findEquilibrium` solves the model
             * directly rather than intersecting two sampled arrays, so the
             * point it returns is the answer and the two curves are an
             * illustration; showing it on the plot is what lets a reader see
             * whether the curves actually cross where the number says. */}
            <ReferenceDot
              x={equilibrium_a.Y}
              y={equilibrium_a.r}
              r={5}
              fill={chartColor(1)}
              stroke="var(--plot-bg)"
              strokeWidth={2}
              isFront
            />
            {showB && (
              <ReferenceDot
                x={equilibrium_b.Y}
                y={equilibrium_b.r}
                r={6}
                fill="none"
                stroke={chartColor(1)}
                strokeWidth={2}
                isFront
              />
            )}
            <ChartLine
              type="monotone"
              dataKey="yIS"
              stroke={IS_STROKE}
              dot={false}
              name="IS Curve"
              data={plotIsA}
              strokeWidth={2}
              hide={series.isHidden('IS')}
            />
            <ChartLine
              type="monotone"
              dataKey="yLM"
              stroke={LM_STROKE}
              dot={false}
              name="LM Curve"
              data={plotLmA}
              strokeWidth={2}
              hide={series.isHidden('LM')}
            />
            {showB && (
              <>
                <ChartLine
                  type="monotone"
                  dataKey="yIS"
                  stroke={IS_STROKE}
                  strokeOpacity={0.55}
                  dot={false}
                  name="IS-B"
                  data={plotIsB}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  hide={series.isHidden('IS-B')}
                />
                <ChartLine
                  type="monotone"
                  dataKey="yLM"
                  stroke={LM_STROKE}
                  strokeOpacity={0.55}
                  dot={false}
                  name="LM-B"
                  data={plotLmB}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  hide={series.isHidden('LM-B')}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'IS', label: 'IS Curve', color: IS_STROKE },
            { key: 'LM', label: 'LM Curve', color: LM_STROKE },
            ...(showB
              ? [
                  { key: 'IS-B', label: 'IS-B', color: IS_STROKE },
                  { key: 'LM-B', label: 'LM-B', color: LM_STROKE },
                ]
              : []),
          ]}
          hidden={series.hidden}
          onToggle={series.toggle}
          onShowAll={series.showAll}
        />

        {/* Equilibrium readouts */}
        <div className="mt-s-4 flex flex-wrap gap-s-3">
          <div className="rounded-card border border-tier-advanced/30 bg-tier-advanced/5 px-s-3 py-s-2">
            <div className="text-micro font-bold uppercase tracking-widest text-tier-advanced-ink">
              Scenario A equilibrium
            </div>
            <div className="mt-s-1 text-sm text-fg-muted tabular-nums">
              Y* = {equilibrium_a.Y.toFixed(2)} | r* = {equilibrium_a.r.toFixed(2)}%
            </div>
          </div>
          {comparisonMode && (
            <div className="rounded-card border border-tier-case/30 bg-tier-case/5 px-s-3 py-s-2">
              <div className="text-micro font-bold uppercase tracking-widest text-tier-case-ink">
                Scenario B equilibrium
              </div>
              <div className="mt-s-1 text-sm text-fg-muted tabular-nums">
                Y* = {equilibrium_b.Y.toFixed(2)} | r* = {equilibrium_b.r.toFixed(2)}%
              </div>
            </div>
          )}
        </div>
      </figure>

      {/* Explanations */}
      <ToolNote label="Overview" variant="info" title="How IS-LM Works"
        headingLevel={2}>
        <ul>
          <li>
            <strong>IS Curve (Investment-Saving):</strong> Shows combinations of Y and r where the
            goods market clears. Higher r reduces investment, lowering equilibrium Y. When G rises,
            IS shifts right (higher Y at each r).
          </li>
          <li>
            <strong>LM Curve (Liquidity-Money):</strong> Shows combinations of Y and r where the
            money market clears. Higher Y increases money demand, raising r. When M rises, LM shifts
            right (lower r at each Y).
          </li>
          <li>
            <strong>Equilibrium:</strong> Where IS and LM intersect. At this point, both goods and
            money markets are in equilibrium.
          </li>
        </ul>
      </ToolNote>

      <ToolNote label="Reference" variant="lesson" title="Understanding the Curves"
        headingLevel={2}>
        <div className="grid gap-s-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-s-2 text-label-sm font-semibold text-fg">IS Curve Characteristics</h2>
            <ul>
              <li>
                <strong>Slope:</strong> Negative (downward sloping)
              </li>
              <li>
                <strong>Reason:</strong> Higher interest rates reduce investment, decreasing
                aggregate demand and output
              </li>
              <li>
                <strong>Shifts:</strong> Due to changes in G, T, C₀, I₀, or consumer confidence
              </li>
              <li>
                <strong>Shape:</strong> Typically linear but can be curved depending on model
                assumptions
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-s-2 text-label-sm font-semibold text-fg">LM Curve Characteristics</h2>
            <ul>
              <li>
                <strong>Slope:</strong> Positive (upward sloping)
              </li>
              <li>
                <strong>Reason:</strong> Higher income increases money demand, requiring higher
                interest rates to maintain equilibrium
              </li>
              <li>
                <strong>Shifts:</strong> Due to changes in M or P
              </li>
              <li>
                <strong>Shape:</strong> Typically linear but can be curved in more advanced models
              </li>
            </ul>
          </div>
        </div>
      </ToolNote>

      <ToolNote label="Insight" variant="insight" title="Policy Effects"
        headingLevel={2}>
        <div className="grid gap-s-6 sm:grid-cols-2">
          <div>
            <strong>Fiscal Expansion (G up or T down):</strong>
            <ul className="mt-s-2">
              <li>IS shifts right, so Y up and r up</li>
              <li>Higher rates crowd out private investment</li>
              <li>Multiplier effect depends on monetary policy response</li>
            </ul>
          </div>
          <div>
            <strong>Monetary Expansion (M up):</strong>
            <ul className="mt-s-2">
              <li>LM shifts right, so Y up and r down</li>
              <li>Lower rates boost private investment</li>
              <li>
                More effective in a liquidity trap, when r is already low
              </li>
            </ul>
          </div>
        </div>
      </ToolNote>

      <ToolNote label="Go deeper" variant="info" title="Advanced Concepts"
        headingLevel={2}>
        <ul>
          <li>
            <strong>Crowding Out:</strong> Fiscal expansion raises interest rates, crowding out
            private investment. Try increasing G and notice that r increases, which reduces I in the
            equilibrium results.
          </li>
          <li>
            <strong>Multiplier Effect:</strong> The impact of fiscal policy on output depends on the
            interest rate response. With flexible money supply (M rising too), the multiplier is
            stronger.
          </li>
          <li>
            <strong>Monetary Policy Effectiveness:</strong> Monetary policy is most effective when
            the LM curve is steep (sensitive to Y changes). It is ineffective in a liquidity trap,
            where LM is horizontal.
          </li>
          <li>
            <strong>Policy Mix:</strong> Fiscal expansion plus monetary contraction raises rates and
            crowds out investment. Fiscal expansion plus monetary expansion keeps rates stable and
            the multiplier strong.
          </li>
        </ul>
      </ToolNote>

      <ToolNote label="Try it" variant="try" title="Experiments"
        headingLevel={2}>
        <p>Enable &quot;Compare Two Scenarios&quot; and try these:</p>
        <ol>
          <li>
            <strong>Fiscal Stimulus Alone:</strong> Keep Scenario A as baseline. In Scenario B,
            increase G by 30. Watch output rise but interest rate rise too (crowding out effect
            visible).
          </li>
          <li>
            <strong>Monetary Response to Fiscal:</strong> Same as above, but also increase M by 30 in
            Scenario B. Output rises more and the rate increase is smaller.
          </li>
          <li>
            <strong>Monetary Policy Alone:</strong> Keep Scenario A as baseline. In Scenario B,
            increase M by 40 only (keep G unchanged). Output rises and rates fall, so investment is
            encouraged.
          </li>
          <li>
            <strong>Tax Cut vs. Spending Increase:</strong> In Scenario B, decrease T by 20 (instead
            of increasing G). Output rises but by less than the same dollar amount in spending. This
            is the tax multiplier effect.
          </li>
          <li>
            <strong>Inflation Effect on Money:</strong> In Scenario B, increase P (price level) with
            M unchanged. This reduces real money supply (M/P falls), raising rates and crowding out
            private investment.
          </li>
        </ol>
      </ToolNote>

      <InfoBox title="Applications of the IS-LM Model" type="info">
        <ul>
          <li>
            <strong>Economic Analysis:</strong> Analyze the effects of fiscal and monetary policy on
            output and interest rates
          </li>
          <li>
            <strong>Policy Design:</strong> Determine optimal combinations of fiscal and monetary
            policy to achieve desired outcomes
          </li>
          <li>
            <strong>Recession Analysis:</strong> Understand how to stimulate the economy during
            downturns
          </li>
          <li>
            <strong>Inflation Control:</strong> Analyze how to cool down overheating economies
          </li>
          <li>
            <strong>International Policy:</strong> Basis for the Mundell-Fleming model in open
            economies
          </li>
        </ul>
        <p className="mt-s-3">
          The IS-LM model is a fundamental tool for understanding how the goods market and money
          market interact to determine national income and interest rates in the short run.
        </p>
      </InfoBox>
    </div>
  )
}
