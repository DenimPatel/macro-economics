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
 *     Recharts defaults it to `true` with a 1500ms tween and re-runs the tween
 *     on *every* data change, so dragging a slider in a tool that had not
 *     opted out re-animated every chart on every frame. It also ignores
 *     `prefers-reduced-motion`, which is a correctness bug rather than a
 *     preference. A chart in a course is a diagram to read; it does not need
 *     to perform a reveal each time a coefficient moves.
 *
 * Imported for its side effect from `main.tsx` and from `chartTheme.ts`.
 * Caller props still win, so a single chart can override any of it.
 */
import { Area, Bar, Line, Pie, Scatter } from 'recharts'

/** Stroke defaults for a continuous series. */
const seriesDefaults = {
  isAnimationActive: false,
  strokeWidth: 2.25,
  dot: false,
  activeDot: { r: 4, strokeWidth: 0 },
}

/**
 * Recharts types each series' `defaultProps` as its own literal shape, so a
 * loop over all five produces a union that no single object is assignable to.
 * Widening to a record is honest here: the assignment is the same for all of
 * them, and the caller-visible prop types are unchanged.
 */
type SeriesWithDefaults = { defaultProps?: Record<string, unknown> }

for (const Series of [Line, Area, Bar, Scatter, Pie] as SeriesWithDefaults[]) {
  Series.defaultProps = { ...Series.defaultProps, ...seriesDefaults }
}

export const ChartLine = Line
export const ChartArea = Area
export const ChartBar = Bar
export const ChartScatter = Scatter
export const ChartPie = Pie
