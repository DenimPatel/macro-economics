/**
 * Shared Recharts theme so every tool's axes, grid, and cursor look the same.
 * Tools may still pass their own series colours for economic identity, but the
 * chrome should come from here.
 *
 * Colours are expressed as `var(--c-*)` strings rather than resolved hex.
 * Recharts passes them straight to SVG attributes, so this is what makes
 * charts theme-reactive for free: every tool that spreads this object follows
 * the light/dark toggle without knowing it exists.
 */
import { SERIES_COLORS } from './tokens'

export const chartTheme = {
  margin: { top: 8, right: 16, bottom: 8, left: 8 },
  axis: {
    stroke: 'var(--c-fg-subtle)',
    tick: { fill: 'var(--c-fg-muted)', fontSize: 12 },
    axisLine: { stroke: 'var(--c-border)' },
    tickLine: { stroke: 'var(--c-border)' },
  },
  grid: {
    stroke: 'var(--c-border)',
    strokeDasharray: '3 3',
    vertical: false,
  },
  cursor: { stroke: 'var(--c-border-strong)', strokeWidth: 1 },
  tooltip: {
    contentStyle: {
      background: 'var(--c-surface-raised)',
      border: '1px solid var(--c-border-strong)',
      borderRadius: 12,
      boxShadow: '0 10px 30px -14px rgba(28, 25, 23, 0.35)',
      fontSize: 12,
      color: 'var(--c-fg)',
    },
    labelStyle: { color: 'var(--c-fg)', fontWeight: 600 },
    itemStyle: { color: 'var(--c-fg-muted)' },
  },
  legend: {
    wrapperStyle: { fontSize: 12, color: 'var(--c-fg-muted)' },
  },
  /** Reference line / target markers. */
  reference: {
    stroke: 'var(--c-accent)',
    strokeDasharray: '4 4',
    fill: 'var(--c-fg-muted)',
  },
  colors: SERIES_COLORS,
} as const

/** Convenience for a chart series' stroke colour by index. */
export function chartColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length]
}
