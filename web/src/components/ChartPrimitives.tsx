/**
 * Chart series defaults.
 *
 * Every chart in the 20 tools and the data explorer renders through these five
 * identifiers, which is how ~120 charts end up with one consistent look. There
 * are two things to know about why it is done this way.
 *
 * 1. These are *identity aliases*, not wrapper components. Recharts finds the
 *    series to plot by comparing child element types against `Line`, `Area`,
 *    and friends by reference. A function component that renders `<Line />`
 *    inside is invisible to it: the chart renders its axes and grid and then
 *    silently plots nothing. So `ChartLine` must be the very same object as
 *    Recharts' `Line`, and the shared behaviour has to be applied through
 *    `defaultProps` instead of through JSX.
 *
 * 2. `isAnimationActive` is set to `false` for the same reason everywhere.
 *    Recharts defaults it to `true` with a 1500ms tween and re-runs the tween
 *    on *every* data change, so dragging a slider in a tool that had not
 *    opted out re-animated every chart on every frame. It also ignores
 *    `prefers-reduced-motion`, which is a correctness bug rather than a
 *    preference. A chart in a course is a diagram to read; it does not need
 *    to perform a reveal each time a coefficient moves.
 *
 *    The second group exists because the series are not the only thing
 *    Recharts animates. `ReferenceDot` and `ReferenceLine` both default to
 *    animating their position, and the tools use them heavily — eleven
 *    `ReferenceLine`s in `SpeculativeAttack`, three `ReferenceDot`s in
 *    `PhillipsCurve` — so every one of those markers was gliding from its old
 *    coordinate to its new one on each frame of a slider drag. That group
 *    gets the animation flag and NOTHING else: a `strokeWidth` of 2.25 on a
 *    2px reference line is a different decision, and silently applying the
 *    series defaults to annotation geometry is how a chart ends up with
 *    marker lines heavier than the data.
 *
 * Imported for its side effect from `main.tsx` and from `chartTheme.ts`.
 * Caller props still win, so a single chart can override any of it.
 */
import { Area, Bar, Brush, Line, Pie, ReferenceArea, ReferenceDot, ReferenceLine, Scatter } from 'recharts'

/** Stroke defaults for a continuous series. */
const seriesDefaults = {
  isAnimationActive: false,
  strokeWidth: 2.25,
  dot: false,
  activeDot: { r: 4, strokeWidth: 0 },
}

/**
 * Recharts types each series' `defaultProps` as its own literal shape, so a
 * loop over all of them produces a union that no single object is assignable
 * to. Widening to a record is honest here: the assignment is the same for all
 * of them, and the caller-visible prop types are unchanged.
 */
type SeriesWithDefaults = { defaultProps?: Record<string, unknown> }

/** Everything that draws DATA, and therefore carries the stroke defaults. */
const DATA_SERIES = [Line, Area, Bar, Scatter, Pie] as SeriesWithDefaults[]

/**
 * Everything that draws an ANNOTATION on top of data, and therefore carries the
 * animation flag alone. `isAnimationActive` is a boolean prop on all four and
 * means the same thing on all four: "tween from the previous render".
 *
 * A tool that reaches for a Recharts component NOT in either list is a tool
 * that animates on every data change, and `tests/motion.test.ts` fails the
 * build on one — which is the point of keeping these two lists short and
 * visible.
 */
const ANNOTATIONS = [ReferenceLine, ReferenceArea, ReferenceDot, Brush] as SeriesWithDefaults[]

const NO_ANIMATION = { isAnimationActive: false }

for (const Series of DATA_SERIES) {
  Series.defaultProps = { ...Series.defaultProps, ...seriesDefaults }
}

for (const Annotation of ANNOTATIONS) {
  Annotation.defaultProps = { ...Annotation.defaultProps, ...NO_ANIMATION }
}

export const ChartLine = Line
export const ChartArea = Area
export const ChartBar = Bar
export const ChartScatter = Scatter
export const ChartPie = Pie

/**
 * The chart SHELLS, re-exported from the same module as the series.
 *
 * These seven are inert — none of them animates on a data change, which is
 * why `motion.test.tsx` lists them separately from the nine above — but that
 * is not the reason they live here. The reason is that a `recharts` import is
 * an import of the LIBRARY, and the library has opinions this site has
 * overridden: it animates series by default, it measures tick labels once, it
 * draws its own tooltip, and it renders a legend that is a list of names with
 * no handler on it. A file that imports `LineChart` and `XAxis` and
 * `Tooltip` from `recharts` is reading four separate default behaviours with
 * no marker on any of them; a file that imports them from here is reading the
 * same four objects through the one module that says what this site wants
 * done with them. It is the difference between a shared decision and twenty
 * four coincidences.
 *
 * The tools still import these from `recharts` directly and nothing breaks,
 * because a re-export is the same object: the silencing above is a
 * `defaultProps` mutation on the component itself, not a wrapper, which is
 * the property `charts.test.tsx` asserts. Until they are converted, the test
 * that guards the boundary is the union check in `motion.test.tsx` and the
 * mutation check in `charts.test.tsx`, not a rule about import lines.
 */
export {
  CartesianGrid,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

