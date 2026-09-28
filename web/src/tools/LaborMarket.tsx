import { useState } from 'react'
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { ChartLine } from '../components/ChartPrimitives'
import {
  Button,
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToggleDot,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'
import { useHiddenSeries } from '../lib/chartSeries'
import { ChartLegend } from '../components/ChartLegend'
import { dataDomain } from '../lib/chartDomain'

interface EquilibriumPoint {
  unemployment: number
  realWage: number
  exists: boolean
}

interface CurvePoint {
  /** Unemployment in PERCENT, which is the unit the x axis and every label
   *  on this page use. The model works in a fraction; the conversion happens
   *  once, here. */
  unemployment: number
  ws: number
  ps: number
}

/**
 * The window the curves are drawn over when the intersection is inside it.
 *
 * 12% is the textbook window and it is the floor, not the extent: the
 * equilibrium is solved in a FRACTION and `findEquilibrium` treats
 * `u > 1` as out of range, so a reader can still put u* anywhere in
 * [0, 100]% — the sliders reach that at low bargaining power with high
 * benefits, and `Lecture_8.md` section 7 derives the natural rate with no
 * bound at all. See `widestUnemployment` for what that used to cost.
 */
const DIAGRAM_U_MAX = 0.12

/** The sampling step, in the model's fraction. One percentage point. */
const CURVE_STEP = 0.01


/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 */
/**
 * mu has to stay small enough that the gap between full-employment output
 * and the price-setting wage is a plausible distance. `findEquilibrium`
 * solves `z + (1-z)(1 - beta*u) = 1/(1+mu)` for u, and the left side starts
 * at exactly 1, so u* is very nearly the gap `mu/(1+mu)` divided by the WS
 * slope `(1-z)*beta`. At mu = 0.2 the price-setting wage is 0.833 — a 17%
 * distance that a slope of -0.6 cannot cross until u = 0.56, which is where
 * these defaults used to open: a labour-market tool whose first tile read
 * 55.56% unemployment, a number no developed economy has had since 1945.
 * At mu = 0.05 the gap is 4.8% and the two curves cross at 7.94%, with the
 * natural rate (z = 0) at 4.76% — the 4-5% `Lecture_8.md` calibrates
 * against in its own sections 3 and 10.
 */
const DEFAULTS = {
  bargainingPower: 1.0,
  firmMarkup: 0.05,
  benefitRate: 0.4,
  laborForce: 100,
  compareScenarios: false,
}

export default function LaborMarket() {
  const wsps = useHiddenSeries(['ps', 'ws'])
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
  // Core parameters
const [bargainingPower, setBargainingPower] = useState(DEFAULTS.bargainingPower)
const [firmMarkup, setFirmMarkup] = useState(DEFAULTS.firmMarkup)
const [benefitRate, setBenefitRate] = useState(DEFAULTS.benefitRate)
const [laborForce, setLaborForce] = useState(DEFAULTS.laborForce)

  // Scenario comparison mode
const [compareScenarios, setCompareScenarios] = useState(DEFAULTS.compareScenarios)

  const { reset, dirty } = useToolReset(
    {
    bargainingPower: bargainingPower,
    firmMarkup: firmMarkup,
    benefitRate: benefitRate,
    laborForce: laborForce,
    compareScenarios: compareScenarios,
    },
    {
      setBargainingPower,
      setFirmMarkup,
      setBenefitRate,
      setLaborForce,
      setCompareScenarios,
    },
    {
      bargainingPower: DEFAULTS.bargainingPower,
      firmMarkup: DEFAULTS.firmMarkup,
      benefitRate: DEFAULTS.benefitRate,
      laborForce: DEFAULTS.laborForce,
      compareScenarios: DEFAULTS.compareScenarios,
    },
  )

  // WS Curve: W/P = (1 - α*u + β*z) where α captures bargaining elasticity
  // Modified to: W/P = z + (1 - z) * (1 - bargainingPower * u)
  const calculateWSCurve = (
    unemployment: number,
    beta: number,
    z: number,
  ): number => {
    // z is benefit replacement rate, beta is bargaining sensitivity
    // Higher benefits and higher bargaining power → higher wage floor
    return z + (1 - z) * (1 - beta * unemployment)
  }

  // PS Curve: W/P = 1/(1+μ) - horizontal line
  const calculatePSCurve = (markup: number): number => {
    return 1 / (1 + markup)
  }

  // Find equilibrium: where WS = PS
  const findEquilibrium = (
    beta: number,
    mu: number,
    z: number,
  ): EquilibriumPoint => {
    const psWage = calculatePSCurve(mu)
    const wsIntercept = z + (1 - z) // At u=0
    const wsSlope = -(1 - z) * beta

    // WS: W/P = wsIntercept + wsSlope * u
    // PS: W/P = psWage
    // Solve: wsIntercept + wsSlope * u = psWage
    const u = (psWage - wsIntercept) / wsSlope

    if (u < 0 || u > 1) {
      return { unemployment: 0.5, realWage: psWage, exists: false }
    }

    return {
      unemployment: u,
      realWage: psWage,
      exists: true,
    }
  }

  const equilibrium = findEquilibrium(bargainingPower, firmMarkup, benefitRate)

  // Generate curve data for visualization
  //
  // `uMax` is how far out the curves are drawn, and it is the window the
  // reader can SEE rather than a constant. It was `0.12` for every setting,
  // which is the textbook window and is fine right up until the intersection
  // is not inside it: `findEquilibrium` solves in a fraction and accepts any
  // u in [0, 1], so when the reader sets a low beta with high benefits the
  // sampled curves stop at 12% and the equilibrium line Recharts discards
  // entirely. Drawing the same two formulas out to the intersection, and
  // letting the axis follow the data, puts the mark and its frame on the page
  // together. The defaults no longer need it — u* is 7.94%, inside the
  // textbook window — so this is the fallback for a reader's own settings,
  // not a concession to a badly calibrated default.
  const generateCurveData = (
    beta: number,
    mu: number,
    z: number,
    uMax: number,
  ): CurvePoint[] => {
    const point = (u: number): CurvePoint => ({
      // Convert to percentage. The `Math.round` is the tooltip's precision:
      // `u = 5.6%` and not `u = 5.6000000000000005%`.
      unemployment: Math.round(u * 1000) / 10,
      ws: Math.max(0.4, calculateWSCurve(u, beta, z)),
      ps: calculatePSCurve(mu),
    })
    const data: CurvePoint[] = []
    // A step COUNT, not `u += CURVE_STEP`: adding 0.01 fifty-six times lands
    // on 0.5600000000000001, and whether the loop then keeps or drops its
    // last sample depends on which way the drift falls.
    const steps = Math.floor(uMax / CURVE_STEP)
    for (let i = 0; i <= steps; i += 1) data.push(point(i * CURVE_STEP))
    // The intersection itself, so the two curves MEET on the screen instead
    // of stopping a step short of it — which is what a WS/PS diagram is for.
    // When there is no intersection `uMax` is `DIAGRAM_U_MAX`, which is
    // already the last grid sample, and this adds nothing.
    const end = Math.round(uMax * 1000) / 10
    const last = data[data.length - 1]
    if (last && last.unemployment !== end) data.push(point(uMax))
    return data
  }

  const widestUnemployment = equilibrium.exists
    ? Math.max(DIAGRAM_U_MAX, equilibrium.unemployment)
    : DIAGRAM_U_MAX

  const curveData = generateCurveData(
    bargainingPower,
    firmMarkup,
    benefitRate,
    widestUnemployment,
  )

  // Scenario data for comparison
  const weakUnionsEquilibrium = findEquilibrium(0.2, firmMarkup, benefitRate)
  const strongUnionsEquilibrium = findEquilibrium(0.8, firmMarkup, benefitRate)
  const highMarkupEquilibrium = findEquilibrium(
    bargainingPower,
    0.4,
    benefitRate,
  )
  const lowMarkupEquilibrium = findEquilibrium(bargainingPower, 0.1, benefitRate)

  /**
   * How a scenario card prints its own `u*`.
   *
   * The four cards below call `findEquilibrium` with parameters the reader did
   * not choose, and every one of them can land outside `u <= 1` at settings
   * the main sliders do allow — at beta = 0.1, mu = 0.5, z = 0.8 all four do,
   * so all four were printing the model's `0.5` placeholder as "50.00%" under
   * a heading that promises a comparison. They take the same branch as the
   * headline tile, because a scenario card that reports the model's absence is
   * the only honest thing it can do when the model has nothing to report.
   */
  const scenarioUnemployment = (point: EquilibriumPoint): string =>
    point.exists ? `${(point.unemployment * 100).toFixed(2)}%` : '—'

  // Calculate inflation pressures
  const naturalRate = 0.05 // Assumed NAIRU
  /**
   * Whether the two curves met at all, decided ONCE and read everywhere.
   *
   * `findEquilibrium` returns `unemployment: 0.5` when the intersection falls
   * outside `u <= 1`, and that `0.5` is a placeholder: it is not a solution, it
   * is the number the model had to return because it had no other. Every
   * readout that used to consume it — the headline tile, the headcount, the
   * diagnosis note, the caption — printed the placeholder in the same shape as
   * a result, so at beta = 0.1, mu = 0.5, z = 0.8 the page claimed an
   * equilibrium unemployment of 50.00% and a 50.0m headcount with no
   * intersection anywhere in the diagram. `exists` is now consulted at each of
   * those four sites instead of the value being read blindly, which is the
   * whole difference between a tile that reports the model and a tile that
   * reports the model's absence.
   */
  const equilibriumFound = equilibrium.exists

  /**
   * The gap between the two wages, which is what decides whether the labour
   * market is tight or slack — and which is well defined whether or not the
   * curves cross. At `u = 0` the WS wage is exactly 1, so the sign of
   * `1 - PS` is the sign of the pressure at full employment, and it does not
   * need an equilibrium to exist. This is how the diagnosis note keeps
   * answering when there is no equilibrium to diagnose: it reports the
   * pressure the model CAN compute rather than inventing an `u*` to compare
   * against the NAIRU.
   */
  const wagePressureAtFullEmployment = 1 - equilibrium.realWage
  const unemploymentPressure =
    wagePressureAtFullEmployment > 0 ? 'Inflationary Pressure' : 'Deflationary Pressure'
  const wageInflationSign = wagePressureAtFullEmployment > 0 ? '+' : ''

  /**
   * The unemployment axis, computed from everything the chart draws.
   *
   * It was `domain={[0, 12]}` — a pin, and a pin Recharts silently widens
   * anyway (`allowDataOverflow` is false everywhere on this site, so a
   * numeric domain is a floor and a ceiling rather than the range), which
   * made it worse than a plain pin: the written pair and the drawn pair
   * disagreed with nothing on the page to say so. It also could not contain
   * the one number the tool leads with.
   *
   * Every value fed in is one the chart actually marks: the sampled curve, the
   * NAIRU line, and the equilibrium line when the model found one. When the
   * model did NOT find one — `u* > 1`, which the sliders can reach — there is
   * no equilibrium mark, so the fallback is left out of the domain too, and
   * the axis does not stretch towards a number nothing is drawn at.
   *
   * `includeZero` because zero is a real value on a rate axis rather than an
   * arbitrary floor: full employment is the left end of the quantity.
   */
  const unemploymentDomain = dataDomain(
    [
      curveData.map((point) => point.unemployment),
      naturalRate * 100,
      ...(equilibrium.exists ? [equilibrium.unemployment * 100] : []),
    ],
    { includeZero: true },
  )

  /**
   * Headcount, which is the one number on this page no axis can carry — and
   * `null` when there is no equilibrium to count from, rather than a headcount
   * derived from the model's placeholder.
   */
  const employmentLevel = equilibriumFound
    ? laborForce * (1 - equilibrium.unemployment)
    : null
  /**
   * The same fraction, for the caption. Separate from the headcount only
   * because the caption prints it in per-cent and the tile in millions, and
   * two divisions of the same number by the same denominator is one more
   * place for them to disagree.
   */
  const employmentShare = equilibriumFound ? (1 - equilibrium.unemployment) * 100 : null

  return (
    <div className="tool-card">
      <ToolHeader
        title="Labor Market"
        description="Explore how wage-setting and price-setting curves determine equilibrium unemployment and real wages. Analyze the effects of union bargaining power, firm markups, and unemployment benefits on labor market outcomes."
        badge="intermediate"
      />

      <div className="control-panel">
        <SliderControl
          label="Union Bargaining Power (β)"
          value={bargainingPower}
          min={0.1}
          max={1.0}
          step={0.1}
          onChange={setBargainingPower}
          unit=""
        />
        <SliderControl
          label="Firm Markup (μ)"
          value={firmMarkup}
          min={0.05}
          max={0.5}
          step={0.05}
          onChange={setFirmMarkup}
          unit=""
        />
        <SliderControl
          label="Benefits Replacement Rate (z)"
          value={benefitRate}
          min={0}
          max={0.8}
          step={0.1}
          onChange={setBenefitRate}
          unit=""
        />
        <SliderControl
          label="Labor Force"
          value={laborForce}
          min={90}
          max={110}
          step={5}
          onChange={setLaborForce}
          unit="millions"
        />
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-4">
        {/*
         * `—` and no unit when the model found no intersection, which is the
         * site's existing idiom for a quantity the model did not compute:
         * `SpeculativeAttack` prints it for a peg that never breaks and
         * `AssetPricing` for `r <= g`. A percentage is not printed beside it
         * because "— %" still reads as a rate that happens to be small, and
         * the unit is what makes the shape legible at a glance.
         */}
        <StatBox
          label="Equilibrium Unemployment (u*)"
          value={equilibriumFound ? (equilibrium.unemployment * 100).toFixed(2) : '—'}
          unit={equilibriumFound ? '%' : undefined}
          tone="accent"
        />
        <StatBox
          label="Equilibrium Real Wage (W/P)*"
          value={equilibrium.realWage.toFixed(3)}
          tone="accent"
        />
        <StatBox
          label="Natural Rate (NAIRU)"
          value={(naturalRate * 100).toFixed(1)}
          unit="%"
        />
        <StatBox
          label="Employment Level"
          value={employmentLevel === null ? '—' : employmentLevel.toFixed(1)}
          unit={employmentLevel === null ? undefined : 'millions'}
          tone="accent"
        />
      </div>

      <div className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">WS/PS Equilibrium Diagram</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={curveData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="unemployment"
              label={{
                value: 'Unemployment Rate (%)',
                position: 'insideBottomRight',
                offset: -5,
                fill: chartTheme.axis.tick.fill,
              }}
              type="number"
              domain={unemploymentDomain}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Real Wage (W/P)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              /* A fixed window, and a real one: the WS curve is
               * `z + (1 - z)(1 - βu)`, which starts at exactly 1 and falls as
               * u rises, and the PS wage is `1 / (1 + μ)`, which over the
               * slider's range 0.1–0.5 is 0.909–0.667. So every value this
               * chart can draw is inside [0.4, 1.0] and the top of the window
               * is the headroom above it. The `Math.max(0.4, …)` floor on the
               * WS curve is why the bottom is 0.4 and not 0. */
              domain={[0.4, 1.2]}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) =>
                typeof value === 'number' ? value.toFixed(3) : value
              }
              labelFormatter={(label) =>
                `u = ${typeof label === 'number' ? label.toFixed(1) : label}%`
              }
            />
            {/* PS Curve (horizontal) */}
            <ChartLine
              type="monotone"
              dataKey="ps"
              hide={wsps.isHidden('ps')}
              stroke={chartColor(4)}
              strokeWidth={2}
              name="PS Curve (Price-Setting)"
              dot={false}
            />
            {/* WS Curve (upward sloping) */}
            <ChartLine
              type="monotone"
              dataKey="ws"
              hide={wsps.isHidden('ws')}
              stroke={chartColor(0)}
              strokeWidth={2}
              name="WS Curve (Wage-Setting)"
              dot={false}
            />
            {/* Natural rate marker.
             *
             * `insideTop`, not `top`. A vertical ReferenceLine's `viewBox`
             * is the line itself, so `top` puts the label's baseline above
             * the PLOT, and the plot's top edge is only `chartTheme.margin`
             * (8px) below the SVG's: a 15px label anchored there loses 8px
             * off the top and the rest is gone, with the node still in the
             * accessibility tree. MEASURED at the defaults: 8.5px of a 14.5px
             * label clipped. The `inside*` family is the only position that
             * is inside the plot box by construction. */}
            <ReferenceLine
              x={naturalRate * 100}
              stroke={chartColor(3)}
              strokeDasharray="5 5"
              label={{
                value: `NAIRU (${(naturalRate * 100).toFixed(1)}%)`,
                // `insideTop` CENTRES the text on the line, so half of it
                // hangs off whichever side the line is nearer, and with a
                // derived domain the NAIRU is not always in the same place: it
                // sits at 5/high, and high runs from 12 to 100 across the
                // slider space, so the line can end up 11px from the left edge
                // of a 214px plot with a 78px label on it. MEASURED: 2px of
                // label outside the plot. `insideTopLeft` starts the text AT the
                // line and runs it right, and this mark is always in the left
                // region — it is a constant 5% of an axis whose floor is 12 —
                // so it cannot leave the frame from either side.
                position: 'insideTopLeft',
                fill: chartColor(3),
                fontSize: 12,
              }}
            />
            {/* Equilibrium point - add custom dot */}
            {equilibrium.exists && (
              /* `insideRight` for the same reason, and the direction matters
               * more than the position name: `insideRight` anchors the text
               * at the plot's right edge and lets it run LEFT, so it cannot
               * overrun the frame however far right the reader drags the
               * equilibrium. A bare `right` starts the text at the line and
               * runs right, which is off the edge whenever u* is large.
               *
               * And the line itself is DRAWN. It carried `strokeWidth={0}`,
               * which is a degenerate element: Recharts still creates the
               * node, still places the label off it, and paints nothing — so
               * the tool's headline number had a caption hanging in the plot
               * with no rule under it, and a reader checking whether the mark
               * matched the tile was looking at one line and one piece of
               * text where the diagram has two lines everywhere else. It is
               * dashed like the NAIRU, because it is the same kind of mark.
               *
               * It is also the element that made the domain load-bearing.
               * Recharts' default `ifOverflow: 'discard'` returns `null` for
               * the WHOLE line — mark, label and all — when its `x` is off
               * the scale (`ReferenceLine.getEndPoints`), so a domain that
               * cannot reach u* does not clip this, it deletes it: no line, no
               * label, and nothing in the accessibility tree either. The
               * domain above is what keeps it in the document. */
              <ReferenceLine
                x={equilibrium.unemployment * 100}
                stroke={chartColor(1)}
                strokeDasharray="5 5"
                label={{
                  value: `Equilibrium (u*: ${(equilibrium.unemployment * 100).toFixed(1)}%)`,
                  // The counterpart to the NAIRU's `insideTopLeft`, and for
                  // the same reason. `insideRight` anchors the text at the
                  // plot's right edge and lets it run LEFT, which is what makes
                  // it safe however far right the reader drags the
                  // equilibrium: u* reaches 95.24% at β = 0.7, z = 0.5, μ = 0.5
                  // and the domain goes to 100 to hold it, and this line then
                  // stands at the right edge of the frame. A bare `right`
                  // starts the text at the line and runs right, which is off
                  // the edge whenever u* is large — and `insideTop` centres it,
                  // which is half off the edge in the same case.
                  position: 'insideRight',
                  fill: chartColor(1),
                  fontSize: 12,
                  fontWeight: 'bold',
                }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <ChartLegend
          items={[
            { key: 'ps', label: 'PS Curve (Price-Setting)', color: chartColor(4) },
            { key: 'ws', label: 'WS Curve (Wage-Setting)', color: chartColor(0) },
          ]}
          hidden={wsps.hidden}
          onToggle={wsps.toggle}
          onShowAll={wsps.showAll}
        />
        {/* The four tiles above this plot, restated in the units the plot
         * uses, and the two of them that are not on it.
         *
         * `Employment Level` is a headcount and this diagram's axes are a
         * rate and a real wage, so there is nowhere on the chart to mark it —
         * a dot at 44.4 would have to be placed against an axis that does not
         * measure people, which is a mark that asserts a comparison the chart
         * cannot support. So it is named here in the same pipe-separated
         * caption the other tools use, with the fraction of the labour force
         * that is employed spelled out, because that fraction is the one
         * reading of the number a reader CAN locate: it is the gap between
         * the two dashed lines and the right-hand edge of the axis.
         *
         * The no-intersection branch is the other half of the tile rule, and
         * it says which BOUNDARY was crossed rather than only that something is
         * wrong. The model solves in a fraction and treats `u > 1` as out of
         * range, so `u*` is not merely "large" at beta = 0.1, mu = 0.5, z = 0.8
         * — it is above the whole admissible interval, and the diagram is
         * drawn to 12% precisely because there is nothing further right to
         * draw. A reader who is told the reason can fix it: raise beta, cut the
         * markup, or raise benefits. */}
        <TileReadout>
          {equilibriumFound
            ? `Intersection: u* = ${(equilibrium.unemployment * 100).toFixed(2)}% of the labour force at W/P = ${equilibrium.realWage.toFixed(3)}`
            : `No intersection anywhere in u ≤ 100%: the wage-setting and price-setting wages are apart at every unemployment rate, so there is no u* to mark. The only real wage on this page is the price-setting one, W/P = ${equilibrium.realWage.toFixed(3)}; raise β, cut the markup, or raise benefits until the two meet`}{' '}
          | NAIRU = {(naturalRate * 100).toFixed(1)}%
          {employmentShare === null
            ? ' | Employment: — , a headcount derived from u*, and there is no u* to derive it from'
            : ` | Employment: ${employmentLevel!.toFixed(1)}m of ${laborForce.toFixed(1)}m (${employmentShare.toFixed(1)}% of the labour force) — a headcount, so it is on neither axis of a diagram that plots a rate against a real wage`}
        </TileReadout>
      </div>

      {/*
       * These three read as `--c-fg`, which is what their `<strong>` labels
       * already wore. They were on the tier ramp's beginner value, which is a
       * statement about where a lecture sits in the course and not about a
       * labour market — and the note they sit in is called "Inflation
       * Pressures" while the surrounding body copy is `--c-fg-muted`, so the
       * tint was doing no work except disagreeing with its own neighbours.
       */}
      <ToolNote label="Diagnosis" variant="insight" title="Inflation Pressures" headingLevel={2}>
        <div className="grid grid-cols-1 gap-s-4 sm:grid-cols-3">
          <div>
            <strong className="text-fg">Unemployment vs NAIRU:</strong>
            <p className="mt-s-2 text-fg">
              {/*
               * The fourth reader of the placeholder, and the one that was
               * hardest to see: this printed "u* (50.0%) > NAIRU (5.0%) → Slack
               * labor market" at settings where there is no u* at all, so a
               * comparison the reader cannot reconstruct — a number the model
               * never produced, against a benchmark — was being made in prose
               * with no mark on the diagram to check it against. The branches
               * now split on whether the model found an intersection at all.
               */}
              {equilibriumFound
                ? equilibrium.unemployment < naturalRate
                  ? `u* (${(equilibrium.unemployment * 100).toFixed(1)}%) < NAIRU (${(naturalRate * 100).toFixed(1)}%) → Tight labor market`
                  : `u* (${(equilibrium.unemployment * 100).toFixed(1)}%) > NAIRU (${(naturalRate * 100).toFixed(1)}%) → Slack labor market`
                : `No u* to compare — the curves do not cross for u ≤ 100%, so neither "below" nor "above" the NAIRU (${(naturalRate * 100).toFixed(1)}%) is defined`}
            </p>
          </div>
          <div>
            <strong className="text-fg">Wage Inflation Pressure:</strong>
            <p className="mt-s-2 text-fg">
              {unemploymentPressure} {wageInflationSign}
            </p>
          </div>
          <div>
            <strong className="text-fg">Expected Impact:</strong>
            <p className="mt-s-2 text-fg">
              {/*
               * Read off the wage gap at full employment rather than off `u*`,
               * which is the one quantity here that may not exist. The sign is
               * the same thing either way when there IS an intersection —
               * `u* < NAIRU` and `WS(0) > PS` are both "the demanded wage is
               * above the offered one" — and it is still true when there
               * is not.
               */}
              {wagePressureAtFullEmployment > 0
                ? 'Wages rising faster than productivity → Inflation'
                : 'Wage growth below productivity → Disinflation'}
            </p>
          </div>
        </div>
      </ToolNote>

      <div className="mb-s-8 grid grid-cols-1 gap-s-3 sm:grid-cols-2">
        <Button
          variant={compareScenarios ? 'primary' : 'secondary'}
          onClick={() => setCompareScenarios(true)}
          pressed={compareScenarios}
        >
          <ToggleDot on={compareScenarios} /> Scenario Analysis
        </Button>
        <Button
          variant={!compareScenarios ? 'primary' : 'secondary'}
          onClick={() => setCompareScenarios(false)}
          pressed={!compareScenarios}
        >
          <ToggleDot on={!compareScenarios} /> Policy Experiments
        </Button>
      </div>

      {compareScenarios ? (
        <div>
          <div className="visualization-container mb-s-8">
            <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Scenario A: Weak vs Strong Unions</h2>
            <div className="grid grid-cols-1 gap-s-3 sm:grid-cols-2">
              <ToolNote label="Scenario A" variant="try" title="Weak Unions (β = 0.2)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {scenarioUnemployment(weakUnionsEquilibrium)}
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong>{' '}
                  {weakUnionsEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-s-3 text-xs opacity-90">
                  Limited bargaining power → Lower real wages, Lower unemployment
                </p>
              </ToolNote>
              <ToolNote label="Scenario B" variant="info" title="Strong Unions (β = 0.8)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {scenarioUnemployment(strongUnionsEquilibrium)}
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong>{' '}
                  {strongUnionsEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-s-3 text-xs opacity-90">
                  Strong bargaining power → Higher real wages, Higher unemployment
                </p>
              </ToolNote>
            </div>
          </div>

          <InfoBox type="info" title="Key insight">
            <p>
              Strong unions increase real wages but at the cost of higher equilibrium unemployment.
              There is an inherent trade-off: workers in unions get higher wages, but fewer workers are
              employed overall. This explains why more unionized labor markets (like Nordic countries)
              often have higher structural unemployment rates compared to more competitive labor
              markets.
            </p>
          </InfoBox>
        </div>
      ) : (
        <div>
          <div className="visualization-container mb-s-8">
            <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
              Policy Experiment: Firm Markup Effects
            </h2>
            <div className="grid grid-cols-1 gap-s-3 sm:grid-cols-2">
              <ToolNote label="Scenario A" variant="insight" title="Low Markup (μ = 0.1)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {scenarioUnemployment(lowMarkupEquilibrium)}
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong> {lowMarkupEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-s-3 text-xs opacity-90">
                  Competitive market → Higher real wages, Lower unemployment
                </p>
              </ToolNote>
              <ToolNote label="Scenario B" variant="warning" title="High Markup (μ = 0.4)">
                <p>
                  <strong className="text-fg">u*:</strong>{' '}
                  {scenarioUnemployment(highMarkupEquilibrium)}
                </p>
                <p>
                  <strong className="text-fg">W/P:</strong> {highMarkupEquilibrium.realWage.toFixed(3)}
                </p>
                <p className="mt-s-3 text-xs opacity-90">
                  Monopoly power → Lower real wages, Higher unemployment
                </p>
              </ToolNote>
            </div>
          </div>

          <InfoBox type="warning" title="Policy implication">
            <p>
              Increasing firm markups (through reduced competition or monopoly power) shifts the PS
              curve down, reducing both real wages AND equilibrium employment. Antitrust enforcement
              and removing barriers to entry improve both wage levels and employment. This explains why
              regulatory capture and monopolistic behavior can harm workers.
            </p>
          </InfoBox>
        </div>
      )}

      <ToolNote label="Educational insights" variant="lesson" title="Reading the WS/PS model" headingLevel={2}>
        <ul>
          <li>
            <strong>WS Curve Intuition:</strong> Higher unemployment weakens workers' bargaining position (fewer outside options). Also, more generous unemployment benefits raise the reservation wage, shifting WS up.
          </li>
          <li>
            <strong>PS Curve Intuition:</strong> Firms set prices as a markup over costs. The real wage paid depends only on this markup—not on unemployment. PS is always horizontal.
          </li>
          <li>
            <strong>Why Generous Benefits Can Backfire:</strong> Higher unemployment benefits (z) shift WS up, raising the equilibrium unemployment rate. Workers get higher wages, but fewer are employed. This is the unemployment-wage trade-off.
          </li>
          <li>
            <strong>International Variation:</strong> Scandinavian countries have high benefits (z) and strong unions (β) but manage lower unemployment through active labor market policies and coordination. The US has lower benefits and weaker unions, resulting in lower structural unemployment but lower wages.
          </li>
          <li>
            <strong>Firm Competition Effects:</strong> Greater product market competition → lower markups → PS curve shifts up → higher real wages AND lower unemployment. This is why deregulation and antitrust enforcement benefit workers.
          </li>
          <li>
            <strong>Natural Rate of Unemployment:</strong> The NAIRU is determined by institutional factors (union strength, benefits, markups), not demand. Demand-side policies cannot permanently lower it—they only create inflation.
          </li>
        </ul>
      </ToolNote>
    </div>
  )
}
