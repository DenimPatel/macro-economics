import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SERIES_COLORS, TIER_META, TIER_ORDER } from '../design/tokens'

const SRC = join(__dirname, '..')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (entry === 'node_modules' || entry === 'dist') return []
    if (statSync(full).isDirectory()) return walk(full)
    return /\.(ts|tsx|css)$/.test(entry) ? [full] : []
  })
}

const HEX = /#[0-9a-fA-F]{3,8}\b/
/**
 * Deliberate exceptions:
 *  - `design/tokens.ts` is the palette module, the one place hex may live.
 *  - `layout/theme.ts` holds the `theme-color` meta values, which are written
 *    as hex because they are read by the browser, not by CSS. They must match
 *    `--c-bg` in `index.css`.
 *  - this file, because it contains the patterns it searches for.
 */
const ALLOWED = new Set([
  join(SRC, 'design', 'tokens.ts'),
  join(SRC, 'layout', 'theme.ts'),
  __filename,
])

const sourceFiles = () => walk(SRC).filter((file) => !ALLOWED.has(file))

describe('design token contract', () => {
  const offenders = sourceFiles()
    .filter((file) => HEX.test(readFileSync(file, 'utf8')))
    .map((file) => relative(SRC, file))

  it('has no hardcoded hex colors outside design/tokens.ts', () => {
    expect(offenders).toEqual([])
  })

  it('has no Tailwind default-palette colour utilities', () => {
    // `bg-yellow-50 text-gray-700` is just as theme-locked as a hex literal —
    // it renders a light block on the dark surface. Only the semantic token
    // names in tailwind.config.ts are allowed.
    const palette =
      /\b(?:text|bg|border|ring|divide|from|to|via|fill|stroke|shadow|accent|outline|decoration|caret)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/
    const files = sourceFiles()
      .filter((file) => /\.(tsx|ts)$/.test(file))
      .filter((file) => palette.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(files).toEqual([])
  })

  it('uses one type family', () => {
    // The site previously set every heading in a second, warm display face,
    // which is most of what made it read as a reading nook rather than an
    // instrument. `font-serif` would now compile to nothing anyway, since
    // `fontFamily.serif` is gone from tailwind.config.ts — but a silently
    // empty utility is exactly the kind of drift these tests exist to catch.
    const serif = sourceFiles()
      .filter((file) => /\.(tsx|css)$/.test(file))
      .filter((file) => /font-serif/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(serif).toEqual([])

    const family = sourceFiles()
      .filter((file) => /literata/i.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(family).toEqual([])
  })

  it('has no accent-coloured left or top rules', () => {
    // A coloured left rule on a callout or an active nav row is the single
    // most recognisable tell of the previous identity. Variants now separate
    // by icon tile and label, and the active route is a filled row.
    //
    // A plain `border-t` / `border-b` is allowed: those are the ordinary
    // horizontal separators the layout is built from.
    const rules = sourceFiles()
      .filter((file) => /\.(tsx|css)$/.test(file))
      .filter((file) => /\bborder-l(?:-|\b)|\bborder-t-[1-9]/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(rules).toEqual([])
  })

  it('keeps status meaning off the tier ramp', () => {
    // `tier-beginner` used to mean "correct answer" and `tier-case` "wrong
    // answer". Correctness and caution now live on ok / warn / bad.
    const files = ['learning', 'pages']
      .map((dir) => join(SRC, dir))
      .flatMap((dir) => walk(dir))
      .filter((file) => /\.(tsx|ts)$/.test(file))
      .filter((file) => /tier-(beginner|intermediate|advanced|case)\b/.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(files).toEqual([])
  })

  it('has no emoji in source', () => {
    // AGENTS.md forbids emoji in committed source. The variation selector is
    // matched outside the class: including it inside a `/u` character class is
    // what trips `no-misleading-character-class`.
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\u{FE0F}?/u
    const withEmoji = sourceFiles()
      .filter((file) => emoji.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(withEmoji).toEqual([])
  })

  it('defines a chip, meter, and band class for every tier', () => {
    for (const tier of TIER_ORDER) {
      const meta = TIER_META[tier]
      expect(meta.badge, `${tier} badge`).toMatch(/^tier-chip/)
      expect(meta.dot, `${tier} dot`).toMatch(/^level-meter level-meter--\d$/)
      expect(meta.band, `${tier} band`).toMatch(/^section-band/)
      expect(meta.stripe, `${tier} stripe`).toMatch(/^bg-tier-/)
    }
  })

  it('numbers the tiers so ordering does not depend on colour', () => {
    // The four tiers are one ordinal azure ramp on purpose. If the levels stop
    // being 1..4 in `TIER_ORDER`, the level meters read as noise again.
    expect(TIER_ORDER.map((tier) => TIER_META[tier].level)).toEqual([1, 2, 3, 4])
  })

  it('has enough distinct series colors for multi-series charts', () => {
    expect(new Set(SERIES_COLORS).size).toBe(SERIES_COLORS.length)
    expect(SERIES_COLORS.length).toBeGreaterThanOrEqual(6)
  })
})
