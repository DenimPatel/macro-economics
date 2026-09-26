/**
 * Design tokens. One source of truth for the palette, tier colours, and chart
 * theme. Consumed by the Tailwind theme (via the CSS variables in index.css)
 * and by Recharts through `chartTheme.ts`. Do not hard-code colours in
 * components.
 */

import type { Tier } from '../../../content/lectures'

export type { Tier }

export interface TierMeta {
  id: Tier
  label: string
  /** Tailwind classes for a badge/pill in the current theme. */
  badge: string
  /** Tailwind classes for a left border / accent stripe. */
  stripe: string
  /** Hex used for charts and inline SVG. */
  color: string
}

export const TIER_META: Record<Tier, TierMeta> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    badge: 'bg-tier-beginner/15 text-tier-beginner border border-tier-beginner/30',
    stripe: 'bg-tier-beginner',
    color: '#16a34a',
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    badge: 'bg-tier-intermediate/15 text-tier-intermediate border border-tier-intermediate/30',
    stripe: 'bg-tier-intermediate',
    color: '#d97706',
  },
  advanced: {
    id: 'advanced',
    label: 'Advanced',
    badge: 'bg-tier-advanced/15 text-tier-advanced border border-tier-advanced/30',
    stripe: 'bg-tier-advanced',
    color: '#dc2626',
  },
  'case-study': {
    id: 'case-study',
    label: 'Case Study',
    badge: 'bg-tier-case/15 text-tier-case border border-tier-case/30',
    stripe: 'bg-tier-case',
    color: '#7c3aed',
  },
}

export const TIER_ORDER: Tier[] = ['beginner', 'intermediate', 'advanced', 'case-study']

/** Categorical palette for multi-series charts. */
export const SERIES_COLORS = [
  '#2563eb',
  '#16a34a',
  '#d97706',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#db2777',
] as const

export function seriesColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length]
}
