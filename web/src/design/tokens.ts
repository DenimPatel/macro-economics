/**
 * Design tokens. One source of truth for the tier metadata and the chart
 * series palette. The colour values themselves live as CSS custom properties
 * in `index.css`, which is what the Tailwind theme maps onto.
 *
 * Do not hard-code colours in components.
 *
 * Note: the tier ramp is four ordinal steps of a *single* azure hue, not a
 * rainbow. Ordering is carried by `TierMeta.level` and the level meter, not by
 * hue, which is what lets the accent own interaction. Status meaning
 * (correct / wrong / caution) lives on separate `ok` / `warn` / `bad` tokens —
 * an earlier version overloaded `tier-beginner` for "correct answer", which had
 * nothing to do with difficulty.
 */

import type { Tier } from '../../../content/lectures'

export type { Tier }

export interface TierMeta {
  id: Tier
  label: string
  /** 1 (entry) to 4 (most demanding). Drives the level meter. */
  level: 1 | 2 | 3 | 4
  /**
   * Classes for a chip in the current theme. These are component classes
   * rather than Tailwind colour utilities on purpose: Tailwind silently drops
   * an opacity modifier (`bg-x/15`) when the colour is a bare `var(...)`, so
   * those utilities compile to nothing.
   */
  badge: string
  /** Level-meter classes: four cells, the first `level` filled. */
  dot: string
  /** Tailwind classes for the tier's step of the ordinal ramp. */
  stripe: string
  /** Hairline separator for a learning-path group. */
  band: string
}

export const TIER_META: Record<Tier, TierMeta> = {
  beginner: {
    id: 'beginner',
    label: 'Beginner',
    level: 1,
    badge: 'tier-chip',
    dot: 'level-meter level-meter--1',
    stripe: 'bg-tier-beginner',
    band: 'section-band',
  },
  intermediate: {
    id: 'intermediate',
    label: 'Intermediate',
    level: 2,
    badge: 'tier-chip',
    dot: 'level-meter level-meter--2',
    stripe: 'bg-tier-intermediate',
    band: 'section-band',
  },
  advanced: {
    id: 'advanced',
    label: 'Advanced',
    level: 3,
    badge: 'tier-chip',
    dot: 'level-meter level-meter--3',
    stripe: 'bg-tier-advanced',
    band: 'section-band',
  },
  'case-study': {
    id: 'case-study',
    label: 'Case Study',
    level: 4,
    badge: 'tier-chip',
    dot: 'level-meter level-meter--4',
    stripe: 'bg-tier-case',
    band: 'section-band',
  },
}

export const TIER_ORDER: Tier[] = ['beginner', 'intermediate', 'advanced', 'case-study']

/**
 * Categorical palette for multi-series charts. Unchanged by the visual
 * redesign: it was already contrast-vetted and distinct, and chart series are
 * a different problem from the tier ramp. Every value clears 3:1 against both
 * the light surface (#ffffff) and the dark surface (#11151c), since chart
 * strokes are non-text UI.
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
