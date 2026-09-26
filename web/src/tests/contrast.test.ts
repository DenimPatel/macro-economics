import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Contrast audit for the token palette.
 *
 * Parses the `-ch` channel vars straight out of `index.css` so the numbers
 * under test are the ones the browser will actually resolve, in both themes.
 */

const CSS = readFileSync(join(__dirname, '..', 'index.css'), 'utf8')

type Channels = [number, number, number]

/**
 * Pull the `-ch` declarations out of a top-level rule. Anchored to the start
 * of a line and required to be followed by `{`, so a selector mentioned in a
 * comment above the real rule is not mistaken for the rule itself.
 */
function block(selector: string): Record<string, Channels> {
  const re = new RegExp(`^${selector.replace('.', '\\.')}\\s*\\{`, 'm')
  const start = CSS.search(re)
  expect(start, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(-1)
  const open = CSS.indexOf('{', start)
  const close = CSS.indexOf('\n}', open)
  const body = CSS.slice(open, close)
  const vars: Record<string, Channels> = {}
  for (const m of body.matchAll(/--c-([a-z0-9-]+)-ch:\s*(\d+)\s+(\d+)\s+(\d+);/g)) {
    vars[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])]
  }
  return vars
}

const LIGHT = block(':root')
const DARK = block('.dark')

function luminance([r, g, b]: Channels): number {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function contrast(a: Channels, b: Channels): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const TIER_KEYS = ['tier-beginner', 'tier-intermediate', 'tier-advanced', 'tier-case'] as const

const THEMES = [
  ['light', LIGHT],
  ['dark', DARK],
] as const

describe('palette contrast', () => {
  it.each(THEMES)('%s theme defines the full token set', (name, vars) => {
    for (const key of [
      'bg',
      'surface',
      'surface-raised',
      'surface-2',
      'border',
      'border-strong',
      'fg',
      'fg-muted',
      'fg-subtle',
      'accent',
      'accent-ink',
      'accent-fg',
      'code-bg',
    ]) {
      expect(vars[key], `${name}: --c-${key}-ch`).toBeDefined()
    }
    for (const tier of TIER_KEYS) {
      expect(vars[tier], `${name}: --c-${tier}-ch`).toBeDefined()
      expect(vars[`${tier}-ink`], `${name}: --c-${tier}-ink-ch`).toBeDefined()
    }
  })

  it.each(THEMES)('%s theme: body text clears 4.5:1 on every surface', (_name, vars) => {
    for (const surface of ['bg', 'surface', 'surface-raised', 'surface-2', 'code-bg']) {
      for (const fg of ['fg', 'fg-muted']) {
        expect(
          contrast(vars[fg], vars[surface]),
          `${fg} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it.each(THEMES)('%s theme: tier ink text clears 4.5:1 on surface', (_name, vars) => {
    for (const tier of TIER_KEYS) {
      expect(
        contrast(vars[`${tier}-ink`], vars.surface),
        `${tier}-ink on surface`,
      ).toBeGreaterThanOrEqual(4.5)
    }
    expect(contrast(vars['accent-ink'], vars.surface), 'accent-ink on surface').toBeGreaterThanOrEqual(4.5)
  })

  it.each(THEMES)('%s theme: accent clears 4.5:1 on surface (links, active nav)', (_name, vars) => {
    expect(contrast(vars['accent-ink'], vars.surface)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(THEMES)('%s theme: accent-fg clears 4.5:1 on accent (buttons)', (_name, vars) => {
    expect(contrast(vars['accent-fg'], vars.accent)).toBeGreaterThanOrEqual(4.5)
  })

  it.each(THEMES)('%s theme: borders are visible against the surface', (_name, vars) => {
    // Deliberately not 3:1. `--c-border` is a decorative card edge and
    // `--c-border-strong` is a resting input edge; in a warm paper scheme both
    // are intentionally soft. The 3:1 requirement is carried by the focus
    // ring instead, which the next assertion enforces.
    expect(contrast(vars.border, vars.surface), 'border vs surface').toBeGreaterThanOrEqual(1.25)
    expect(contrast(vars['border-strong'], vars.surface), 'border-strong vs surface').toBeGreaterThanOrEqual(1.4)
  })

  it.each(THEMES)('%s theme: focus ring clears 3:1 on every surface it sits on', (_name, vars) => {
    // The global `:focus-visible` outline is the site's only 3:1 affordance, so
    // it has to hold up against bg, surface, and the raised surface.
    for (const surface of ['bg', 'surface', 'surface-raised', 'surface-2']) {
      expect(contrast(vars.accent, vars[surface]), `accent focus ring on ${surface}`).toBeGreaterThanOrEqual(3)
    }
  })

  it.each(THEMES)('%s theme: tier hues clear 3:1 as chart strokes', (_name, vars) => {
    for (const tier of TIER_KEYS) {
      expect(contrast(vars[tier], vars.surface), `${tier} stroke vs surface`).toBeGreaterThanOrEqual(3)
    }
  })

  it('light and dark are genuinely different themes', () => {
    expect(contrast(LIGHT.bg, DARK.bg)).toBeGreaterThan(10)
  })
})
