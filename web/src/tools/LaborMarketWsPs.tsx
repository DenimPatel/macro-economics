import { useCallback, useMemo, useState } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts'
import { ChartLine, ChartScatter } from '../components/ChartPrimitives'
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
import { dataDomain } from '../lib/chartDomain'
import { useHiddenSeries } from '../lib/chartSeries'
import { ChartLegend } from '../components/ChartLegend'
import { useToolReset } from '../lib/toolReset'

/** WS and PS keep a fixed economic identity across every chart and readout. */
const WS_STROKE = chartColor(2)
const PS_STROKE = chartColor(0)
const EQ_STROKE = chartColor(3)

/** Sign colours for the WS–PS gap. */
const EXCESS_HIGH = chartColor(4)
const EXCESS_LOW = PS_STROKE
const EXCESS_FLAT = chartColor(1)

/**
 * Labor Market WS/PS Diagram Component
 * 
 * Visualizes the Wage-Setting (WS) and Price-Setting (PS) curves
 * that determine the equilibrium real wage and natural rate of unemployment.
 * 
 * Economic Theory:
 * - WS Curve: Real wage workers can demand based on bargaining power and benefits
 * - PS Curve: Real wage firms are willing to pay based on their markup
 * - Equilibrium: Where WS = PS (natural rate of unemployment)
 */

interface DataPoint {
  unemployment: number
  wsWage: number
  psWage: number
}

interface EquilibriumPoint {
  unemployment: number
  realWage: number
}

/**
 * One copy of this tool's starting values. The `useState` calls below read
 * from it, so "Reset to defaults" cannot return to a number the tool no
 * longer opens at — the failure mode of a hand-written reset that re-typed
 * every default in a second list.
 */
const DEFAULTS = {
  bargainingPower: 0.5,
  firmMarkup: 0.2,
  benefitRate: 0.4,
  laborProductivity: 1.0,
  scenarioMode: 'baseline' as ScenarioMode,
}

/** Named so the reset record can hold it: a bare inline union in
 * `useState<...>(DEFAULTS.scenarioMode)` would widen to `string` and stop
 * being assignable to the state it resets. */
type ScenarioMode = 'baseline' | 'higher-unions' | 'more-competition'

export default function LaborMarketWsPs() {
  const wsps = useHiddenSeries(['wsWage', 'psWage'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  // Core parameters
  const [bargainingPower, setBargainingPower] = useState(DEFAULTS.bargainingPower)
  const [firmMarkup, setFirmMarkup] = useState(DEFAULTS.firmMarkup)
  const [benefitRate, setBenefitRate] = useState(DEFAULTS.benefitRate)
  const [laborProductivity, setLaborProductivity] = useState(DEFAULTS.laborProductivity)
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>(DEFAULTS.scenarioMode)

  const { reset, dirty } = useToolReset(
    {
    bargainingPower: bargainingPower,
    firmMarkup: firmMarkup,
    benefitRate: benefitRate,
    laborProductivity: laborProductivity,
    scenarioMode: scenarioMode,
    },
    {
      setBargainingPower,
      setFirmMarkup,
      setBenefitRate,
      setLaborProductivity,
      setScenarioMode,
    },
    {
      bargainingPower: DEFAULTS.bargainingPower,
      firmMarkup: DEFAULTS.firmMarkup,
      benefitRate: DEFAULTS.benefitRate,
      laborProductivity: DEFAULTS.laborProductivity,
      scenarioMode: DEFAULTS.scenarioMode,
    },
  )

  // Apply scenario presets
  let activeBargaining = bargainingPower
  let activeMarkup = firmMarkup
  let activeBenefits = benefitRate
  const activeProductivity = laborProductivity

  if (scenarioMode === 'higher-unions') {
    activeBargaining = 0.7
    activeBenefits = 0.55
  } else if (scenarioMode === 'more-competition') {
    activeMarkup = 0.1
  }

  /**
   * WS Curve Calculation
   * 
   * Wage-Setting (Worker Perspective):
   * W/P = z + (1 - z) * (1 - β*u)
   * 
   * Where:
   * - z: benefit replacement rate (unemployment benefits as % of wage)
   * - β: bargaining power parameter (sensitivity to unemployment)
   * - u: unemployment rate
   * 
   * Intuition:
   * - When u=0 (full employment): W/P = z + (1-z) = 1 (workers get full productivity)
   * - When u>0: W/P < 1 (unemployment weakens worker bargaining power)
   * - Higher z: Higher wage floor (better benefits)
   * - Higher β: More sensitive to unemployment (stronger bargaining power)
   */
  const calculateWSWage = useCallback(
    (unemployment: number): number => {
      // Ensure unemployment is between 0 and 1
      const u = Math.max(0, Math.min(1, unemployment))
      // WS Curve: workers demand higher wages when unemployment is low
      const wageFloor = activeBenefits * activeProductivity
      const wageResponsiveness =
        (1 - activeBenefits) * activeProductivity * (1 - activeBargaining * u)
      return wageFloor + wageResponsiveness
    },
    [activeBenefits, activeProductivity, activeBargaining],
  )

  /**
   * PS Curve Calculation
   * 
   * Price-Setting (Firm Perspective):
   * W/P = 1 / (1 + μ) * A
   * 
   * Where:
   * - μ: markup over marginal cost (firm pricing power)
   * - A: labor productivity (output per worker)
   * 
   * Intuition:
   * - Firms set prices as markup over marginal cost (wage)
   * - Higher markup → lower real wage firms are willing to pay
   * - PS curve is HORIZONTAL (doesn't depend on unemployment)
   * - Only shifts if markup or productivity changes
   */
  const calculatePSWage = useCallback((): number => {
    // PS Curve: firms offer a fixed real wage based on markup
    return activeProductivity / (1 + activeMarkup)
  }, [activeProductivity, activeMarkup])

  /**
   * Find Equilibrium Point
   * 
   * Natural Rate of Unemployment (u_n) occurs where WS = PS
   * At this point, inflation expectations are met (P = P^e)
   */
  const findEquilibrium = useCallback((): EquilibriumPoint => {
    const psWage = calculatePSWage()

    // Binary search to find unemployment where WS = PS
    let uLow = 0
    let uHigh = 1
    let equilibriumU = 0.5

    for (let i = 0; i < 50; i++) {
      const uMid = (uLow + uHigh) / 2
      const wsWage = calculateWSWage(uMid)

      if (wsWage > psWage) {
        uLow = uMid
      } else {
        uHigh = uMid
      }
      equilibriumU = uMid
    }

    return {
      unemployment: equilibriumU,
      realWage: calculatePSWage(),
    }
  }, [calculatePSWage, calculateWSWage])

  const equilibrium = useMemo(() => findEquilibrium(), [findEquilibrium])

  /**
   * Generate chart data points
   */
  const chartData = useMemo(() => {
    const data: DataPoint[] = []
    const psWage = calculatePSWage()
    
    for (let u = 0; u <= 1; u += 0.02) {
      data.push({
        unemployment: parseFloat(u.toFixed(3)),
        wsWage: calculateWSWage(u),
        psWage: psWage,
      })
    }
    return data
  }, [calculatePSWage, calculateWSWage])

  /**
   * Calculate policy effects
   */
  const policyImpact = useMemo(() => {
    const baselineEquilibrium = findEquilibrium()
    
    return {
      naturalRate: (baselineEquilibrium.unemployment * 100).toFixed(1),
      realWage: baselineEquilibrium.realWage.toFixed(3),
      wageFloor: (activeBenefits * activeProductivity).toFixed(3),
      firmOffering: (activeProductivity / (1 + activeMarkup)).toFixed(3),
    }
  }, [findEquilibrium, activeBenefits, activeProductivity, activeMarkup])

  /**
   * Analyze what happens at different unemployment rates
   */
  const analysisPoints = useMemo(() => {
    const psWage = calculatePSWage()
    const points = [
      { label: 'Low Unemployment (5%)', u: 0.05 },
      { label: 'Equilibrium', u: equilibrium.unemployment },
      { label: 'High Unemployment (15%)', u: 0.15 },
    ]
    
    return points.map(point => ({
      label: point.label,
      unemployment: point.u,
      wsWage: calculateWSWage(point.u),
      psWage: psWage,
      excess: calculateWSWage(point.u) - psWage,
    }))
  }, [equilibrium.unemployment, calculatePSWage, calculateWSWage])

  /** The datum shape the WS/PS chart carries per point. */
  interface WsPsPoint {
    unemployment: number
    wsWage: number
    psWage: number
  }

  /**
   * Custom tooltip for detailed information
   */
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: { payload: WsPsPoint }[]
  }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload
      const excess = data.wsWage - data.psWage
      const excessPercent = ((excess / data.psWage) * 100).toFixed(1)

      return (
        <div className="stat-tile p-s-3 text-left text-xs">
          <p className="mb-s-1 font-bold text-fg">
            Unemployment: {(data.unemployment * 100).toFixed(1)}%
          </p>
          <p className="my-0.5" style={{ color: WS_STROKE }}>
            WS (Workers demand): {data.wsWage.toFixed(3)}
          </p>
          <p className="my-0.5" style={{ color: PS_STROKE }}>
            PS (Firms offer): {data.psWage.toFixed(3)}
          </p>
          <p
            className="mt-s-1 font-bold"
            style={{ color: excess > 0 ? EXCESS_HIGH : excess < 0 ? EXCESS_LOW : EXCESS_FLAT }}
          >
            {excess > 0 ? '↑ Wage pressure' : excess < 0 ? '↓ Employment pressure' : 'Equilibrium'}
            ({excessPercent}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="tool-card">
      <ToolHeader
        title="Labor Market: WS/PS Diagram"
        description="Explore how wage-setting (WS) and price-setting (PS) curves determine the natural rate of unemployment and equilibrium real wage"
        badge="advanced"
      />

      {/* Main Chart */}
      <div className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">WS/PS Equilibrium Diagram</h2>

        <ResponsiveContainer width="100%" height={400}>
          {/*
           * The margins, and the arithmetic behind every number in them.
           *
           * Recharts lays a vertical chart out as
           * `plotX = margin.left + yAxisSize`, with `yAxisSize` fixed at 60
           * whether or not the y tick labels need it — the widest here is
           * `0.35`, 29.7px. So the old `left: 60` put 120px in front of the
           * plot, of which 60px was dead space, and `right: 30` another 30.
           * MEASURED at every width: 120 + 30 of gutter, and a PLOT of 106px at
           * 390px and 36px at 320px. Thirty-six pixels of plot is not a
           * diagram, and it is the whole of the other two faults on this
           * chart, neither of which was ever about the label or the font:
           * the 136px x-axis label centred on a 68px plot at 130% hung 34px off
           * each side and 4.3px of that LEFT THE SVG (at 320px/100% it clipped
           * by 4.5px), and the `W/P` line's right-anchored label hung 65px left
           * of the plot at 390/130%. One margin, both faults.
           *
           * `right: 28` is not a round number and it is the one that is easy to
           * get wrong, so here is where it comes from. The x-axis label is
           * centred on the PLOT, and the plot's centre is
           * `svgWidth - leftGutter - plotWidth/2` from the SVG's left, so the
           * frame a centred label can use is `svgWidth - leftGutter +
           * rightGutter` — the left gutter is subtracted twice, once whole and
           * once as half the plot, because the 60px y-axis band pushes the plot
           * right of centre and everything to the right of the label has to
           * come out of `right`. At 320px/130% the SVG is 147.6px and the label
           * is 102.2px, so `right >= 22.6` and the frame holds the label.
           * MEASURED across (left, right) in {8, 24, 32, 40} x {8, 12, 20, 28,
           * 36} at three widths and two text scales: 8/8 clips 15.2px at
           * 320/130%, 8/20 clips 1.2px, 8/28 clips NOTHING and costs 20px of a
           * 747px plot at 1280. 8/36 also clips nothing and costs 36px, which
           * buys a narrower plot to defend against a viewport the site does not
           * have to support as well.
           *
           * The y-axis LABEL is why the left margin was reduced to 8 and not to
           * 0. It is `insideLeft`, so it does not WIDEN the gutter — Recharts
           * draws it at `margin.left - 7.1 + offset` — but it does need the
           * gutter to be there: at `offset: -10` the reduced margin clipped it
           * by 9.1px, which is a new defect introduced by a fix. `offset: 12`
           * puts it 12.9px inside at every width, clear of the y tick labels
           * (which end at `plotX - 10`).
           *
           * `top` and `bottom` are UNCHANGED, and deliberately: they are the
           * headroom the `u_n` mark's label needs and the x label's 20px offset
           * plus a line of x tick labels, and together they are what makes this
           * plot 300px tall inside a 400px frame — the same 300 its sibling
           * `LaborMarket` draws, which is the comparison the 400px rule exists
           * to protect. Everything here is horizontal. Reclaiming 20px of
           * `bottom` would have been the easy way to buy the label room and it
           * would have re-scaled the y axis against a chart a reader is meant
           * to be comparing it with.
           */}
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 28, left: 8, bottom: 80 }}
          >
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="unemployment"
              label={{
                // "Unemployment" and not "Unemployment Rate", and the ticks are
                // why. `tickFormatter` below prints 0% … 100%, so the word
                // "Rate" is the half of the old 19-character name that the
                // numbers beside it were already saying — and it is the half
                // that costs the label its frame. MEASURED: 19 characters is
                // 136.2px at 130% and leaves the SVG by 15.2px at 320px even
                // after the margins above were fixed; 12 characters is 102.2px
                // and leaves it by nothing, at every width and both text
                // scales. "Unemployment" is also the quantity name the table
                // below the diagram uses in its first column, and the tile
                // above it in the first row, so the page now says one thing in
                // one name.
                value: 'Unemployment',
                position: 'bottom',
                offset: 20,
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              /* A fraction of the labor force, so [0, 1] is a real bound and
               * the axis stays pinned: it is a percentage the reader
               * already knows the shape of, and the whole point of the
               * chart is where the curves cross inside it. */
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Real Wage (W/P)',
                angle: -90,
                position: 'insideLeft',
                offset: 12,
                fill: chartTheme.axis.tick.fill,
              }}
              /* Derived, and this was the same D1 defect the sibling
               * `LaborMarket` tool was checked for and does not have.
               *
               * Labor productivity `A` runs 0.5 to 2, and both series are
               * proportional to it: the WS curve is `A * (z + (1-z)(1-βu))`
               * and its value at full employment is exactly `A`. So the top
               * of the WS curve reaches 2.0 and the top of PS is
               * `2 / 1.1 = 1.82`, against a domain pinned at 1.2. The top
               * 40% of the WS curve and the PS line itself were drawn past
               * the frame and clipped, with no cue — and the readouts
               * beside the chart, which are computed and were never bounded
               * by the axis, carried the larger numbers the whole time. */
              domain={dataDomain(
                [chartData.map((d) => d.wsWage), chartData.map((d) => d.psWage), equilibrium.realWage],
                { includeZero: true, ticks: 5 },
              )}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip content={<CustomTooltip />} cursor={chartTheme.cursor} />
            {/* WS Curve */}
            <ChartLine
              type="monotone"
              dataKey="wsWage"
              hide={wsps.isHidden('wsWage')}
              stroke={WS_STROKE}
              strokeWidth={3}
              dot={false}
              name="WS Curve (Workers' Demands)"
            />

            {/* PS Curve */}
            <ChartLine
              type="monotone"
              dataKey="psWage"
              hide={wsps.isHidden('psWage')}
              stroke={PS_STROKE}
              strokeWidth={3}
              dot={false}
              name="PS Curve (Firms' Offers)"
            />

            {/* Equilibrium Point.
             *
             * `insideTop` and `insideRight`, not `top` and `right`. A
             * ReferenceLine's label viewBox is the LINE, so a bare `top`
             * anchors the text above the plot — and the plot's top edge is
             * `chartTheme.margin` (8px) below the SVG's, so the label is
             * clipped by however much of it is taller than 8px plus the
             * `offset` it was given. `offset: 10` made that certain: 10px
             * above a plot top that is 8px from the SVG top puts the text
             * entirely outside the frame. MEASURED: `u_n = 55.6%` lost 5.5px
             * of 19.5 at 1280px and 6px of 20 at 390px; `W/P = 0.833`,
             * anchored `right` with `offset: 10`, lost 74.9px of 94.9px —
             * four fifths of it, in the a11y tree and not on screen.
             *
             * The `inside*` positions are the fix rather than a bigger
             * margin, because the margin is a global and a label that
             * overhangs the plot by its own height would need a margin
             * nobody can afford. See `tools.test.tsx` for the invariant. */}
            <ReferenceLine
              x={equilibrium.unemployment}
              stroke={EQ_STROKE}
              strokeDasharray="5 5"
              label={{
                value: `u_n = ${(equilibrium.unemployment * 100).toFixed(1)}%`,
                /* WHICH inside position, and this is the half that was still
                 * broken. `insideTop` centres the text on the line, so half of
                 * it hangs off whichever side the line is nearer — and the
                 * binary search in `findEquilibrium` returns `u_n` up to 1.0
                 * at settings the sliders reach, which puts the line hard
                 * against the right edge of a `[0, 1]` axis. MEASURED: 51px of
                 * an 87px label outside the plot at 1280px, in the
                 * accessibility tree and not on screen.
                 *
                 * The fix is a side, not a margin, and the choice costs
                 * nothing that was documented: `insideTopRight` anchors the
                 * text's END at the line and runs it LEFT,
                 * `insideTopLeft` anchors its START and runs it RIGHT, and the
                 * line is past the middle of a `[0, 1]` axis exactly when
                 * `u_n > 0.5`. The property given up is the one the `[0, 1]`
                 * pin is for — that a reader comparing two runs of this tool
                 * sees the same 0–100% frame — and it is NOT given up: the
                 * domain is untouched and only the label's SIDE moves. What is
                 * given up instead is the label's consistent side, so the mark
                 * reads at the right of the plot at high `u_n` and at the left
                 * at low `u_n`. That is the cheaper of the two, because a
                 * label that is off the page is not a comparison.
                 *
                 * The explicit `fontSize` is the other half of the fit, and its
                 * own separate defect — see the note on the real-wage line's
                 * label below, which is the same omission and the same
                 * measurement. */
                position: equilibrium.unemployment > 0.5 ? 'insideTopRight' : 'insideTopLeft',
                fill: EQ_STROKE,
                fontSize: 12,
                offset: 10,
              }}
            />
              <ReferenceLine
                y={equilibrium.realWage}
                stroke={EQ_STROKE}
                strokeWidth={2}
                label={{
                  value: `W/P = ${equilibrium.realWage.toFixed(3)}`,
                  position: 'insideRight',
                  fill: EQ_STROKE,
                  /* One of four reference-line labels on the site that had no
                   * explicit `fontSize`, so it inherited the ROOT size rather
                   * than the chart's — 16px at 100% and 20.8px at 130%, where
                   * the other five reference labels are 12 and the axis label
                   * is 14.3. That is not a rounding detail: MEASURED at
                   * 320px/130%, this label was 123.1px wide against a 51.9px
                   * plot and hung 12.3px off the LEFT of the SVG, and the
                   * `u_n` label's 132.3px hung 22.6px off. `index.css`
                   * already says these labels carry an explicit size — that is
                   * why the axis-label rule is scoped to `.recharts-cartesian-axis`
                   * so it cannot restyle them by accident — and these four were
                   * the ones that made the statement untrue.
                   *
                   * A bare `fontSize` prop cannot be fixed in the theme for the
                   * reason the CSS comment gives for the AXIS label: a `label`
                   * key in the shared object would be overwritten by every
                   * tool's own `label` prop. So it is written out, four times,
                   * and `charts.test.tsx` holds that every reference-line label
                   * in the tools has one. */
                  fontSize: 12,
                  offset: 10,
                }}
              />

            {/* Equilibrium point marker */}
            <ChartScatter
              dataKey="wsWage"
              data={[{
                unemployment: equilibrium.unemployment,
                wsWage: equilibrium.realWage,
                psWage: equilibrium.realWage,
              }]}
              fill={chartColor(1)}
              shape="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'wsWage', label: "WS Curve (Workers' Demands)", color: WS_STROKE },
            { key: 'psWage', label: "PS Curve (Firms' Offers)", color: PS_STROKE },
          ]}
          hidden={wsps.hidden}
          onToggle={wsps.toggle}
          onShowAll={wsps.showAll}
        />

        <p className="mt-s-4 text-sm leading-relaxed text-fg-muted">
          <strong>Equilibrium:</strong> The natural rate of unemployment (u_n) occurs where the WS and PS curves intersect.
          At this point, inflation expectations are realized and the labor market is in equilibrium.
        </p>
      </div>

      {/* Control Panel */}
      <div className="mb-s-8 grid gap-s-8 lg:grid-cols-2">
        <div className="control-panel block">
          <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Worker Bargaining</h2>

          <SliderControl
            label="Bargaining Power"
            value={bargainingPower}
            min={0}
            max={1}
            step={0.05}
            onChange={setBargainingPower}
          />
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Higher values mean workers are more sensitive to unemployment (stronger negotiating position at low unemployment).
          </p>

          <SliderControl
            label="Unemployment Benefits (z)"
            value={benefitRate}
            min={0}
            max={0.8}
            step={0.05}
            onChange={setBenefitRate}
          />
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Higher benefits raise the wage floor, shifting the WS curve upward.
          </p>
        </div>

      <ToolControlBar onReset={reset} dirty={dirty} />

        <div className="control-panel block">
          <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Firm Pricing</h2>

          <SliderControl
            label="Markup (μ)"
            value={firmMarkup}
            min={0}
            max={0.5}
            step={0.02}
            onChange={setFirmMarkup}
          />
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Higher markup increases firm pricing power, lowering the real wage offered (PS curve down).
          </p>

          <SliderControl
            label="Labor Productivity (A)"
            value={laborProductivity}
            min={0.5}
            max={2}
            step={0.1}
            onChange={setLaborProductivity}
          />
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Higher productivity allows higher real wages and shifts both curves upward.
          </p>
        </div>
      </div>

      {/* Scenario Buttons */}
      <ToolNote label="Experiments" variant="try" title="Policy Scenarios" headingLevel={2}>
        <div className="flex flex-wrap gap-s-2">
          <Button
            onClick={() => {
              setScenarioMode('baseline')
              setBargainingPower(0.5)
              setFirmMarkup(0.2)
              setBenefitRate(0.4)
              setLaborProductivity(1.0)
            }}
            variant={scenarioMode === 'baseline' ? 'primary' : 'secondary'}
          >
            Baseline
          </Button>
          <Button
            onClick={() => {
              setScenarioMode('higher-unions')
              setBargainingPower(0.7)
              setFirmMarkup(0.2)
              setBenefitRate(0.55)
              setLaborProductivity(1.0)
            }}
            variant={scenarioMode === 'higher-unions' ? 'primary' : 'secondary'}
          >
            Stronger Unions
          </Button>
          <Button
            onClick={() => {
              setScenarioMode('more-competition')
              setBargainingPower(0.5)
              setFirmMarkup(0.1)
              setBenefitRate(0.4)
              setLaborProductivity(1.0)
            }}
            variant={scenarioMode === 'more-competition' ? 'primary' : 'secondary'}
          >
            More Competition
          </Button>
        </div>
      </ToolNote>

      {/* Key Statistics */}
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-4">
        <StatBox
          label="Natural Rate (u_n)"
          value={`${policyImpact.naturalRate}%`}
          tone="accent"
        />
        <StatBox label="Equilibrium Real Wage" value={policyImpact.realWage} tone="accent" />
        <StatBox label="Wage Floor (z·A)" value={policyImpact.wageFloor} tone="accent" />
        <StatBox
          label="Firm Offering (A/(1+μ))"
          value={policyImpact.firmOffering}
          tone="accent"
        />
      </div>
        <TileReadout>
                  Natural Rate {policyImpact.naturalRate} and Equilibrium Real Wage{' '}
          {policyImpact.realWage} are the two dashed marks on the diagram
          above, so each tile is a point on it. The other two
                  are the two CURVES at a stated point rather than marks: the wage
                  floor z·A is where the WS curve meets the left edge of the plot, at
                  u = 0, and the firm offering A/(1+μ) is the height of the PS line,
                  which is horizontal. Read them off the two lines and the table below
                  lists both at three unemployment rates.
                </TileReadout>

      {/* Detailed Analysis Table */}
      <div className="card mb-s-8 p-s-6">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Labor Market Dynamics at Different Unemployment Rates
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="px-s-3 py-s-2 text-left font-semibold text-fg">Scenario</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Unemployment</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">WS (Demand)</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">PS (Offer)</th>
                <th className="px-s-3 py-s-2 text-right font-semibold text-fg">Gap</th>
                <th className="px-s-3 py-s-2 text-center font-semibold text-fg">Situation</th>
              </tr>
            </thead>
            <tbody>
              {analysisPoints.map((point, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-border ${
                    Math.abs(point.excess) < 0.01 ? 'bg-tier-beginner/10' : 'bg-surface'
                  }`}
                >
                  <td
                    className={`px-s-3 py-2.5 text-left text-fg ${
                      point.excess === 0 ? 'font-bold' : ''
                    }`}
                  >
                    {point.label}
                  </td>
                  <td className="px-s-3 py-2.5 text-right">
                    {(point.unemployment * 100).toFixed(1)}%
                  </td>
                  <td className="px-s-3 py-2.5 text-right" style={{ color: WS_STROKE }}>
                    {point.wsWage.toFixed(3)}
                  </td>
                  <td className="px-s-3 py-2.5 text-right" style={{ color: PS_STROKE }}>
                    {point.psWage.toFixed(3)}
                  </td>
                  <td
                    className="px-s-3 py-2.5 text-right font-bold"
                    style={{
                      color:
                        point.excess > 0
                          ? EXCESS_HIGH
                          : point.excess < 0
                            ? EXCESS_LOW
                            : EXCESS_FLAT,
                    }}
                  >
                    {point.excess > 0 ? '+' : ''}
                    {(point.excess * 100).toFixed(1)}%
                  </td>
                  <td className="px-s-3 py-2.5 text-center text-fg-muted">
                    {point.excess > 0.01 && 'Wage pressure'}
                    {point.excess < -0.01 && 'Employment pressure'}
                    {Math.abs(point.excess) < 0.01 && 'Equilibrium'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Economic Explanations */}
      <div className="mb-s-8 grid grid-cols-1 gap-s-4 lg:grid-cols-2">
        <InfoBox type="info" title="Wage-Setting (WS) Curve">
          <p>The WS curve shows the real wage workers demand given labor market conditions.</p>
          <p>
            <strong>Formula</strong>: W/P = z + (1 - z)(1 - β·u)
          </p>
          <p>
            <strong>Key Properties</strong>:
          </p>
          <ul className="mt-s-2">
            <li>Slopes downward: Low unemployment strengthens worker bargaining power</li>
            <li>Shift factors: Unemployment benefits (z), bargaining power (β), productivity (A)</li>
            <li>At u=0: W/P = 1 (workers get all of productivity)</li>
            <li>At high u: W/P ≈ z (workers stuck with benefit level)</li>
          </ul>
          <p className="mt-s-2">
            <strong>Policy Implications</strong>: Generous benefits and strong unions shift WS up,
            increasing natural rate
          </p>
        </InfoBox>

        <InfoBox type="info" title="Price-Setting (PS) Curve">
          <p>The PS curve shows the real wage firms are willing to pay based on their pricing power.</p>
          <p>
            <strong>Formula</strong>: W/P = A / (1 + μ)
          </p>
          <p>
            <strong>Key Properties</strong>:
          </p>
          <ul className="mt-s-2">
            <li>Horizontal: Doesn't depend on unemployment (firm pricing is exogenous)</li>
            <li>Higher markup → lower real wage offered</li>
            <li>Higher productivity → higher real wage offered</li>
          </ul>
          <p className="mt-s-2">
            <strong>Policy Implications</strong>: Competition and productivity improvements shift PS,
            affecting natural rate
          </p>
        </InfoBox>
      </div>

      <InfoBox type="success" title="Natural Rate of Unemployment (NAIRU)">
        <p>
          The natural rate is where WS and PS curves intersect. It's not determined by technology, but by
          institutional factors:
        </p>
        <ul className="mt-s-2">
          <li>Below u_n: WS &gt; PS → wage pressure → inflation rises</li>
          <li>Above u_n: WS &lt; PS → wage pressure falls → inflation declines</li>
          <li>↑ Bargaining power → ↑ u_n</li>
          <li>↑ Unemployment benefits → ↑ u_n</li>
          <li>↑ Competition (↓ markup) → ↓ u_n</li>
        </ul>
      </InfoBox>
    </div>
  )
}
