/**
 * Shared Recharts theme so every tool's axes, grid, and cursor look the same.
 * Tools may still pass their own series colours for economic identity, but the
 * chrome should come from here.
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
  tooltip: {
    contentStyle: {
      background: 'var(--c-surface)',
      border: '1px solid var(--c-border)',
      borderRadius: 8,
      fontSize: 12,
      color: 'var(--c-fg)',
    },
    labelStyle: { color: 'var(--c-fg)', fontWeight: 600 },
  },
  legend: {
    wrapperStyle: { fontSize: 12, color: 'var(--c-fg-muted)' },
  },
  colors: SERIES_COLORS,
} as const

/** Convenience for a chart series' stroke colour by index. */
export function chartColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length]
}
