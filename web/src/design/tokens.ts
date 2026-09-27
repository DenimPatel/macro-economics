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

/** A resolved theme, as opposed to the `'light' | 'dark' | 'system'` pref. */
export type Theme = 'light' | 'dark'

/**
 * Browser-chrome tint per theme, for `<meta name="theme-color">`. Kept in
 * step with the `--c-bg-ch` values in `index.css`; a stale value here shows
 * up as a wrong-coloured mobile address bar.
 *
 * These are hex because they are read by the browser rather than by CSS, so
 * they cannot come from a `-ch` channel var. `index.html` restates the same
 * two strings in its pre-module no-flash script, and
 * `tests/preferences.test.ts` fails if the two ever drift.
 */
export const THEME_COLOR: Record<Theme, string> = {
  light: '#f7f8fa',
  dark: '#090c11',
}

/**
 * Categorical palette for multi-series charts: seven fixed values, because a
 * series that changed colour when the theme changed would be a different
 * series. The only rule is that every one of them stays legible on every
 * surface a chart is actually drawn on, in both themes.
 *
 * The seven are series *slots*, not an ordinal ramp: index 0 is the series a
 * reader is meant to be looking at, 1-6 are the rest, so the order is a
 * convention and not a scale. `chartColor` wraps the array so a tool never
 * reaches into it, and it wraps rather than modding because the comment on
 * the export is the thing that says what the order means.
 *
 * Measured, and asserted in `tests/charts.test.tsx`, as contrast against the
 * four planes a chart is drawn on — the light card, the light plot well (the
 * canvas, which is `--plot-bg`), the dark card, and the dark plot well:
 *
 *   0  #0369a1  5.93 : 5.43 : 3.08 : 3.30
 *   1  #0d9488  3.74 : 3.43 : 4.89 : 5.23
 *   2  #b45309  5.02 : 4.60 : 3.64 : 3.90
 *   3  #7c3aed  5.70 : 5.21 : 3.21 : 3.44
 *   4  #c91340  5.75 : 5.26 : 3.18 : 3.40   was #be123c, which measured 2.91:1
 *                                              on the dark card: the one value
 *                                              that did not clear the 3:1 it
 *                                              claimed, lifted 15/255 in
 *                                              luminance with its hue and
 *                                              saturation untouched
 *   5  #4d7c0f  4.99 : 4.57 : 3.66 : 3.92
 *   6  #0e7490  5.36 : 4.90 : 3.41 : 3.66
 *
 * That is the contract, and it is now true of all seven. On `--c-surface-2`
 * in dark (2.63-4.16) four of the seven fall below 3:1; nothing on the site
 * draws a chart on a `surface-2` plate, and the plot well in `index.css` is
 * the colour a chart would be measured against if one ever did.
 *
 * What the contract does not buy is pairwise separation, and it cannot:
 * every value that clears 3:1 on the canvas has to sit inside a narrow band
 * of relative luminance, and a band that narrow cannot also separate seven
 * values from each other. Fifteen of the twenty-one pairs are within 1.2:1
 * of each other in luminance and are told apart by hue, by the name in the
 * legend and the name in the tooltip. That number is asserted rather than
 * hidden, and it was thirteen before the one correction above.
 */
export const SERIES_COLORS = [
  '#0369a1',
  '#0d9488',
  '#b45309',
  '#7c3aed',
  '#c91340',
  '#4d7c0f',
  '#0e7490',
] as const

export function seriesColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length]
}
