/**
 * Shared Recharts theme so every tool's axes, grid, and cursor look the same.
 * Tools may still pass their own series colours for economic identity, but the
 * chrome should come from here.
 *
 * Colours are expressed as `var(--c-*)` strings rather than resolved hex.
 * Recharts passes them straight to SVG attributes, so this is what makes
 * charts theme-reactive for free: every tool that spreads this object follows
 * the light/dark toggle without knowing it exists.
 *
 * The chrome is deliberately quiet — a solid hairline grid, no axis lines, no
 * tick stubs, no dashed cursor. A chart in a course is a diagram to be read,
 * not a spreadsheet to be admired, and every one of those marks is a line the
 * eye has to skip past before reaching the data.
 */
import { SERIES_COLORS } from './tokens'
// Side effect: applies the shared `isAnimationActive: false` and stroke weight
// to every Recharts series. Imported here as well as in `main.tsx` so that any
// consumer of this module — including tests — gets the configured series.
import '../components/ChartPrimitives'

export const chartTheme = {
  margin: { top: 8, right: 16, bottom: 8, left: 8 },
  axis: {
    // Kept because every tool spreads this object into `XAxis`/`YAxis`, and
    // several also read `.stroke` directly for a `ReferenceLine` colour.
    // `axisLine` below wins over it, so the axis itself draws no line.
    stroke: 'var(--c-border)',
    tick: { fill: 'var(--c-fg-subtle)', fontSize: 11 },
    axisLine: { stroke: 'transparent' },
    tickLine: { stroke: 'transparent' },
  },
  grid: {
    stroke: 'var(--c-border)',
    vertical: false,
  },
  cursor: { stroke: 'var(--c-border-strong)', strokeWidth: 1 },
  tooltip: {
    contentStyle: {
      background: 'var(--c-surface-raised)',
      border: '1px solid var(--c-border-strong)',
      borderRadius: 10,
      boxShadow: 'var(--shadow-plate)',
      fontSize: 12,
      padding: '8px 10px',
      color: 'var(--c-fg)',
    },
    labelStyle: { color: 'var(--c-fg)', fontWeight: 600 },
    itemStyle: { color: 'var(--c-fg-muted)', padding: 0 },
  },
  legend: {
    iconType: 'plainline',
    iconSize: 14,
    wrapperStyle: { fontSize: 12, color: 'var(--c-fg-muted)' },
  },
  /** Reference line / target markers. */
  reference: {
    stroke: 'var(--c-fg-subtle)',
    strokeDasharray: '4 4',
    fill: 'var(--c-fg-subtle)',
  },
  colors: SERIES_COLORS,
} as const

/** Convenience for a chart series' stroke colour by index. */
export function chartColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length]
}
