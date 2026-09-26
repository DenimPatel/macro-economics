/**
 * Design tokens. One source of truth for the tier metadata and the chart
 * series palette. The colour values themselves live as CSS custom properties
 * in `index.css`, which is what the Tailwind theme maps onto.
 *
 * Do not hard-code colours in components.
 *
 * Note: the tier ramp is deliberately teal -> sky -> indigo -> violet. There
 * is no red, because red in this context reads as a failure state and
 * "advanced" is not one.
 */

import type { Tier } from '../../../content/lectures'

export type { Tier }

export interface TierMeta {
  id: Tier
  label: string
  /**
   * Classes for a badge/pill in the current theme. These are component
   * classes rather than Tailwind colour utilities on purpose: Tailwind
   * silently drops an opacity modifier (`bg-x/15`) when the colour is a bare
   * `var(...)`, so those utilities compile to nothing.
   */
  badge: string
  /** Tailwind classes for a left border / accent stripe. */
  stripe: string
  /** Tailwind classes for a tinted section band, used on the landing page. */
  band: string
}

export const TIER_META: Record<Tier, TierMeta> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    badge: 'tier-chip tier-chip--beginner',
    stripe: 'bg-tier-beginner',
    band: 'section-band section-band--beginner',
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    badge: 'tier-chip tier-chip--intermediate',
    stripe: 'bg-tier-intermediate',
    band: 'section-band section-band--intermediate',
  },
  advanced: {
    id: 'advanced',
    label: 'Advanced',
    badge: 'tier-chip tier-chip--advanced',
    stripe: 'bg-tier-advanced',
    band: 'section-band section-band--advanced',
  },
  'case-study': {
    id: 'case-study',
    label: 'Case Study',
    badge: 'tier-chip tier-chip--case',
    stripe: 'bg-tier-case',
    band: 'section-band section-band--case',
  },
}

export const TIER_ORDER: Tier[] = ['beginner', 'intermediate', 'advanced', 'case-study']

/**
 * Categorical palette for multi-series charts. Chosen to hold at least 3:1
 * contrast against both the light surface (#fffdfa) and the dark surface
 * (#1c1917), since chart strokes are non-text UI and must clear 3:1 in
 * either theme.
 */
export const SERIES_COLORS = [
  '#0369a1',
  '#0d9488',
  '#b45309',
  '#7c3aed',
  '#be123c',
  '#4d7c0f',
  '#0e7490',
] as const

export function seriesColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length]
}
