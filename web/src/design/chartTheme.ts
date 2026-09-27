import { useSyncExternalStore } from 'react'
import type { TooltipProps } from 'recharts'
import '../components/ChartPrimitives'
import { ChartTooltip } from '../components/ChartTooltip'
import { readPreferences, usePreferences } from '../lib/preferences'
import { SERIES_COLORS } from './tokens'

/**
 * The theme every chart on the site reads. Tools never hand-pick a
 * colour, a font size or a grid style; they spread these objects, so
 * there is exactly one definition of what a chart's chrome is, and a
 * change here reaches all twenty tools and the data explorer at once.
 *
 * Every value is a `var(--c-…)` string rather than a resolved colour, so
 * a chart restyles when the theme flips with nothing to re-mount. SVG
 * presentation attributes accept `var()` and resolve it, which is what
 * makes that work: Recharts writes `fill` and `font-size` as attributes,
 * not as inline styles, and both are CSS properties underneath.
 *
 * The properties are getters rather than a frozen object so the module
 * can answer "what is the theme now" for preferences that are not in the
 * stylesheet at all. `chartGrid` is one: it is a boolean, it has no CSS
 * footprint of its own, and a getter is what makes it correct on the
 * read that happens after the switch rather than the read that happened
 * at import.
 */

/* ------------------------------------------------------------------ *
 * The `chartGrid` preference
 *
 * Two halves, on purpose, because a preference that only works on the
 * charts that happen to re-render is not a preference.
 *
 * 1. `chartTheme.grid` reads the flag, so a chart mounting after the
 *    switch gets a correct DOM as well as correct props.
 * 2. The flag is mirrored onto `<html data-chart-grid>` and `index.css`
 *    keys one rule off it, so the ~40 charts already on screen repaint
 *    immediately, with no tool opting in and no re-render.
 *
 * The subscription is registered on first read rather than at import, so
 * importing this module still has no side effects on a document that has
 * no charts. */
const subscribers = new Set<() => void>()
let watching = false

function mirrorGridFlag(): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.chartGrid = readPreferences().chartGrid ? 'on' : 'off'
}

function watchPreferences(): void {
  if (watching || typeof document === 'undefined') return
  watching = true
  mirrorGridFlag()
  usePreferences.subscribe(() => {
    mirrorGridFlag()
    for (const notify of subscribers) notify()
  })
}

function subscribe(onChange: () => void): () => void {
  watchPreferences()
  subscribers.add(onChange)
  return () => {
    subscribers.delete(onChange)
  }
}

function textScale(): number {
  watchPreferences()
  return readPreferences().textScale
}

function gridOn(): boolean {
  watchPreferences()
  return readPreferences().chartGrid
}

/**
 * Re-renders a component when a reading preference the charts care about
 * changes. No tool needs this today — the `chartGrid` half of the
 * preference reaches mounted charts through `index.css` — but the
 * `textScale` half does not: Recharts measures tick label widths once, in
 * `componentDidMount`, and a bigger tick font with a stale measurement is
 * a collision, not a scale.
 */
export function useChartTextScale(): number {
  watchPreferences()
  return useSyncExternalStore(subscribe, textScale, textScale)
}

/**
 * The same subscription with no return value, for a component that only has
 * to re-render.
 *
 * `useChartTextScale()` is the awkward shape for the one caller that matters:
 * a tool does not want the number, it wants the axis `key` in
 * `chartTheme.axis` / `chartTheme.yAxis` to be re-read, and the key is
 * computed in the TOOL's render — inside `<YAxis {...chartTheme.yAxis} />`.
 * A tool that subscribed in one of its own children would re-render that
 * child and leave the tool's render, and with it the key, untouched. So
 * every tool calls this once at the top of itself and reads nothing back.
 */
export function useChartTextScaleSignal(): void {
  useSyncExternalStore(subscribe, textScale, textScale)
}

/** A reference line in its own series colour, so it wears series slot `i`. */
export const REFERENCE_COLORS = SERIES_COLORS

/**
 * Wraps the array so a tool reads `chartColor(0)` and never
 * `SERIES_COLORS[0] % 7`, and so the comment on the palette — which is
 * what says what the slots mean — is the only place the order is defined.
 */
export const chartColor = (i: number): string => SERIES_COLORS[i % SERIES_COLORS.length] as string

/**
 * The shared tooltip, as a Recharts `content` prop.
 *
 * Recharts types `content` in terms of the chart's value type, and
 * TypeScript will infer that value type from this prop before a tool's own
 * `formatter` has a say — and then take the wider of the two candidates,
 * which breaks every tool whose `formatter` declares its parameter as
 * `number`. Naming the type here pins the inference in one place instead
 * of twenty, and the component is generic, so nothing is lost: it handles
 * a string or an array value perfectly well.
 */
const tooltipContent: NonNullable<TooltipProps<number, string>['content']> = ChartTooltip

/**
 * The axis props, built fresh on every read.
 *
 * A fresh object matters and is not an accident: `CartesianAxis` implements
 * `shouldComponentUpdate` as a shallow compare of its props, and `tick` is
 * a nested object, so a shared literal would let the axis skip a render
 * while the reader's density and text-size preferences had changed. The
 * getter gives every read a new identity, which is what keeps a re-render
 * reaching the axis at all — the necessary half of the text-scale story.
 * The other half, the `key` that makes the axis actually re-MEASURE, is
 * `chartTheme.axisKey`.
 */
function axisProps() {
  return {
    stroke: 'var(--c-border)',
    tick: { fill: 'var(--c-fg)', fontSize: 'var(--chart-tick-size)' },
    axisLine: { stroke: 'transparent' },
    tickLine: { stroke: 'var(--c-border)' },
    minTickGap: 12,
  }
}


export const chartTheme = {
  /* The categorical series, as the tools ask for them. Index 0 is the
   * series a reader is meant to be looking at; the seven are one ordinal
   * ramp in the file and none of them is a status colour. */
  colors: SERIES_COLORS,

  /* Chart margins, in px. A Recharts margin is a number, so it cannot be
   * a `var()`; the bottom is room for the axis tick labels plus the
   * legend, which Recharts positions inside the plot box rather than
   * outside it. */
  margin: { top: 8, right: 8, bottom: 8, left: 8 } as const,

  /**
   * Horizontal major gridlines only, in the dedicated grid token.
   *
   * `fill` is not decoration: Recharts draws a `Background` rect at the
   * plot offset whenever `fill` is set, which is the one supported way to
   * get a background that covers the plot box and not the axis gutter. It
   * is the canvas colour, so the plot is a recess in both themes — see
   * `--plot-bg` in index.css for why not `surface-2`.
   *
   * `vertical` is off for a reason beyond the house style: vertical rules
   * through a line chart are read as a series, and a second thing saying
   * the same numbers is the problem this file exists to avoid.
   */
  get grid() {
    const on = gridOn()
    return {
      stroke: 'var(--c-grid)',
      strokeDasharray: '0',
      fill: 'var(--plot-bg)',
      horizontal: on,
      vertical: false,
    }
  },

  /* The axis. Tick text is data, not chrome, so it takes `--fg` rather
   * than the `--fg-subtle` the labels used to use, and it takes its size
   * from `--chart-tick-size` so the reader's text scale reaches it.
   *
   * `minTickGap` is the tick-collision rule, and it is worth stating
   * plainly because it is a trade. Recharts walks the ticks from the far
   * end and keeps one only if its label's near edge clears the last label
   * it kept, plus `minTickGap` — so the number is the clearance between
   * two neighbouring labels, and the ticks that get dropped are the ones
   * that were going to be unreadable anyway.
   *
   * The number is 12 rather than Recharts' 5 because the labels grow.
   * Measured in this font, a tick label is 7.0px per character at 11px, so
   * 130% makes it 9.1px and a label that was 8px of clear space is
   * 8 - 2.1*chars wide: five characters at 130% need 10.5px of clearance
   * to stay apart, and five characters is as long as a tick label gets
   * here. Twelve leaves a margin and costs nothing measurable — on the
   * tightest chart in the tools the ticks are 40px apart and a label is
   * 21px, so no tick is dropped at 12 that was not already dropped at 5.
   *
   * The one thing `minTickGap` cannot do is fix a chart that is already
   * open, and that is what the `key` in `axisProps` is for. Recharts
   * measures its tick labels ONCE, in `CartesianAxis.componentDidMount`:
   * it reads the computed `font-size` and `letter-spacing` off the first
   * rendered tick, stores them in state, and hands them to `renderTicks`
   * for the rest of the axis's life. There is no `componentDidUpdate`
   * refresh, because there is nothing to refresh from — the measurement
   * is a `getComputedStyle` read and the value it produced is now state.
   * So a reader who changes the text size on an open chart gets tick
   * labels at the NEW width and a tick-selection decision made at the OLD
   * one, and `minTickGap` has nothing left to do about it: twelve is a
   * fudge factor standing in for a measurement that should not be stale.
   *
   * The axis line stays transparent while the grid is doing the work, and
   * `index.css` turns it back on under `data-chart-grid="off"`, so the
   * two are never on screen together.
   *
   * This is the X axis's object. See `chartTheme.yAxis`. */
  get axis() {
    return axisProps()
  },

  /**
   * The same axis, for the y — and the only difference between the two
   * objects is the `key` inside them, which is a real difference rather
   * than a second way of spelling the first.
   *
   * Re-measuring means re-running `componentDidMount`, and a remount is
   * the only mechanism that does that, so the key carries the text scale.
   * The obvious version of this is a bug, and it is worth recording why:
   * `<XAxis>` and `<YAxis>` are SIBLINGS, both spread one object, and a
   * `key` carried in a shared object is the same string on both. React
   * deduplicates keys within a level, so the second axis was dropped from
   * reconciliation — and a tool lost an axis with nothing on the page to
   * explain it. The key is therefore per-orientation (`axis-x-` /
   * `axis-y-`), and the two getters are the reason that is true: a tool
   * spreading `chartTheme.yAxis` onto a `<YAxis>` cannot collide with the
   * `<XAxis>` beside it no matter what the reader does to the text size.
   */
  get yAxis() {
    return axisProps()
  },

  /**
   * The key an axis must carry, keyed on the reader's text size.
   *
   * Recharts measures its tick labels ONCE, in `CartesianAxis.componentDidMount`:
   * it reads the computed `font-size` and `letter-spacing` off the first
   * rendered tick, stores them in state, and hands them to `renderTicks` for
   * the rest of the axis's life. There is no `componentDidUpdate` refresh,
   * because there is nothing to refresh from — the measurement is a
   * `getComputedStyle` read and the value it produced is now state. A reader
   * who changes the text size on an open chart therefore gets tick labels at
   * the NEW width and a tick-selection decision made at the OLD one, and
   * `minTickGap` has nothing left to do about it: twelve is a fudge factor
   * standing in for a measurement that should not be stale.
   *
   * Re-running a `componentDidMount` means a remount, and a remount means a
   * `key`. The two obvious places to put that key are both wrong:
   *
   *  - In a SHARED object. `<XAxis>` and `<YAxis>` are siblings, and if the
   *    key came out of one object both would carry the same string. React
   *    deduplicates keys within a level, so the second axis was dropped from
   *    reconciliation and a tool lost an axis with nothing on the page to
   *    explain it. This is the bug an earlier attempt shipped.
   *  - In the props object, and spread. It works — React extracts `key` from
   *    a spread exactly as it would from JSX literal syntax — but React 19
   *    logs `A props object containing a "key" prop is being spread into JSX`
   *    for every one, which on a three-chart page is a dozen console errors
   *    a developer cannot act on, and it is a deprecated pattern.
   *
   * So it is written at the call site, from this function, with the
   * orientation in the string. Every axis in `web/src/tools` carries
   * `key={chartTheme.axisKey('x')}` or `('y')`, which is why the two
   * orientations can never collide no matter what the reader does to the text
   * size.
   *
   * What it costs: the axis subtree — ticks, tick text, axis line, label — is
   * discarded and rebuilt, at most four times in a session, and only when the
   * size actually changes. The plot, the grid, the series and the tooltip are
   * untouched, and Recharts re-reads the axis geometry from the `viewBox` it
   * already had.
   */
  axisKey(orientation: 'x' | 'y'): string {
    return `axis-${orientation}-${textScale()}`
  },

  /**
   * The hover cursor. A solid `--border-strong` line at 1.76:1 on white was
   * too faint for the one mark the reader is actively tracking, and
   * `--fg-subtle` is still chrome: a hairline, a colour that is not in the
   * series palette, and no dash, because a dashed cursor turns the plot
   * into a spreadsheet.
   */
  cursor: { stroke: 'var(--c-fg-subtle)', strokeWidth: 1 } as const,

  /**
   * The tooltip. The box is `.chart-tooltip` in `index.css` — the hairline,
   * the `elev-3` shadow, the type scale and the value column are all there
   * — so this object carries only what is genuinely per-chart.
   *
   * `isAnimationActive: false` is not decoration. Recharts' `Tooltip` is
   * absent from the motion test's "inert" list, and it is in fact the one
   * chart component that still animates: `animationBegin` defaults to 400
   * and it tweens the tooltip's position, so the box lags the pointer.
   */
  get tooltip() {
    return {
      content: tooltipContent,
      isAnimationActive: false,
      animationDuration: 0,
    }
  },

  /**
   * The legend. `inactiveColor` is wired to a token so that the first
   * chart to hide a series does not drop its label to Recharts' default
   * grey, and `index.css` strikes the label through, so the hidden state
   * is not carried by colour alone.
   */
  get legend() {
    return {
      iconType: 'plainline' as const,
      iconSize: 16,
      inactiveColor: 'var(--c-fg-subtle)',
      wrapperStyle: {
        fontSize: 'var(--chart-legend-size)',
        color: 'var(--c-fg-muted)',
      },
    }
  },

  /**
   * A ReferenceLine in a tool's own colour: the one place chrome is allowed
   * to wear a series colour, because it *is* the series. Dashed so that a
   * policy level and a data series never look like the same mark.
   */
  reference: {
    stroke: 'var(--c-fg-subtle)',
    strokeWidth: 1.5,
    strokeDasharray: '4 4',
    fill: 'var(--c-fg-subtle)',
  } as const,

  /**
   * The zero baseline, for a chart that wants one.
   *
   * Recharts draws no zero line: `YAxis` draws its line at the domain's
   * left edge, and the grid draws one line per tick, all of them equal. So
   * "is this series above or below zero" is currently a thing the reader
   * has to find by eye among identical hairlines, on a chart where the
   * answer is usually the whole point.
   *
   * This is a solid `--border-strong` line, deliberately a different
   * weight from `reference`: a baseline is a fact about the data, and a
   * threshold is an annotation about the data, and they should not be the
   * same mark. Wire it as
   * `<ReferenceLine y={0} {...chartTheme.baseline} />`.
   */
  baseline: {
    stroke: 'var(--c-border-strong)',
    strokeWidth: 1.5,
  } as const,
} as const

/**
 * The area-fill rule, recorded here because it is the one chart decision
 * that is a claim about the data rather than a claim about the chrome.
 *
 * A fill under a line says the area *means* something — the integral from
 * zero — so it is only honest where that is what the reader is being
 * shown, and it is always a flat wash of the series colour at a low
 * opacity, which is what `fill={chartColor(i)} fillOpacity={0.15}` in the
 * tools already does. No gradient ever crosses a plot: a gradient under a
 * single series is a fade and is survivable, but a gradient whose value
 * varies with a bar's height is a second, wrong encoding of the same
 * number sitting beside the right one. Nothing in the site does this
 * today, and the rule is here so that the first thing which does has to
 * answer for it.
 */
