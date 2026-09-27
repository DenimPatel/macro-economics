import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { SERIES_COLORS, TIER_META, TIER_ORDER } from '../design/tokens'

const SRC = join(__dirname, '..')
const CSS = readFileSync(join(SRC, 'index.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

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
 *  - `design/tokens.ts` is the palette module, the one place hex may live. It
 *    also holds `THEME_COLOR`, the `<meta name="theme-color">` values, which
 *    are written as hex because the browser reads them rather than CSS. They
 *    must match `--c-bg` in `index.css`.
 *  - this file, because it contains the patterns it searches for.
 *
 * `layout/theme.ts` used to be an exception here. It no longer is: the theme
 * colour tints moved into the palette module with the rest of the colour, and
 * the theme itself is a preference. The exception list shrinking is a
 * strengthening, not a loosening.
 */
const ALLOWED = new Set([join(SRC, 'design', 'tokens.ts'), __filename])

const sourceFiles = () => walk(SRC).filter((file) => !ALLOWED.has(file))

/* ------------------------------------------------------------------ *
 * Elevation scale contract
 *
 * The scale is the only sanctioned way to raise a surface off the canvas,
 * so it is worth guarding structurally: if a step stops being a two-layer
 * pair, or starts carrying a colour of its own, or stops being
 * distinguishable from the step below it, the "one canonical way to
 * express elevation" promise is quietly gone.
 * ------------------------------------------------------------------ */

const ELEV_STEPS = ['elev-0', 'elev-1', 'elev-2', 'elev-3', 'elev-4'] as const
const ELEV_THEMES = [':root', '.dark'] as const

/** The body of a top-level rule, with comments already stripped. */
function ruleBody(selector: string): string {
  const start = CSS.search(new RegExp(`^${selector.replace('.', '\\.')}\\s*\\{`, 'm'))
  expect(start, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(-1)
  const open = CSS.indexOf('{', start)
  return CSS.slice(open, CSS.indexOf('\n}', open))
}

function decl(selector: string, name: string): string {
  const found = ruleBody(selector).match(new RegExp(`${name}:\\s*([^;]+);`))
  expect(found, `${selector}: ${name}`).not.toBeNull()
  return (found as RegExpMatchArray)[1].replace(/\s+/g, ' ').trim()
}

interface Layer {
  offsetY: number
  blur: number
  spread: number
  alpha: number
}

/**
 * A layer is `offsetX offsetY blur [spread] rgb(<ink> / <alpha>)`, and the ink
 * must be the shared `--c-shadow-ink-ch` token. Anything else — a hex, a
 * Tailwind palette colour, a second ink — is a tinted shadow, which is the
 * one thing the scale forbids.
 */
function layers(value: string): Layer[] {
  const re = /(-?[\d.]+)(?:px)?\s+(-?[\d.]+)px\s+(-?[\d.]+)px(?:\s+(-?[\d.]+)px)?\s+rgb\(var\(--c-shadow-ink-ch\)\s*\/\s*([\d.]+)\)/g
  const found: Layer[] = []
  for (const m of value.matchAll(re)) {
    found.push({
      offsetY: Number(m[2]),
      blur: Number(m[3]),
      spread: m[4] === undefined ? 0 : Number(m[4]),
      alpha: Number(m[5]),
    })
  }
  // Anything the pattern did not consume is either stray syntax or a colour
  // that bypassed the ink token.
  expect(value.replace(re, '').replace(/[\s,]/g, ''), `unparsed shadow text in \`${value}\``).toBe('')
  return found
}

describe('elevation scale', () => {
  it.each(ELEV_THEMES)('%s defines every step and the lit edge', (selector) => {
    for (const step of ELEV_STEPS) {
      expect(decl(selector, `--${step}`), `${selector}: --${step}`).toBeTruthy()
    }
    expect(decl(selector, '--elev-0')).toBe('none')
    expect(decl(selector, '--elev-inset-hi'), `${selector}: --elev-inset-hi`).toMatch(
      /^rgb\(255 255 255 \/ [\d.]+\)$/,
    )
  })

  it.each(ELEV_THEMES)('%s: every step is a tight contact layer plus a deeper ambient one', (selector) => {
    for (const step of ELEV_STEPS.slice(1)) {
      const found = layers(decl(selector, `--${step}`))
      const label = `${selector}: --${step}`
      expect(found, `${label} layer count`).toHaveLength(2)

      const [contact, ambient] = found
      // The contact layer is the tight one; the ambient layer is the deep
      // one. A step where that inverts has swapped its own meaning.
      expect(contact.blur, `${label} contact blur`).toBeLessThan(ambient.blur)
      expect(contact.offsetY, `${label} contact offset`).toBeLessThanOrEqual(ambient.offsetY)
      // Ambient layers are pulled back with a negative spread so they do not
      // halo a small control; contact layers never spread at all.
      expect(ambient.spread, `${label} ambient spread`).toBeLessThan(0)
      expect(contact.spread, `${label} contact spread`).toBe(0)
      // Alphas only: never opaque, never so faint the layer is decorative.
      for (const layer of found) {
        expect(layer.alpha, `${label} alpha`).toBeGreaterThan(0)
        expect(layer.alpha, `${label} alpha`).toBeLessThan(0.8)
      }
    }
  })

  it.each(ELEV_THEMES)('%s: each step is perceptibly deeper than the one below', (selector) => {
    const parsed = ELEV_STEPS.slice(1).map((step) => layers(decl(selector, `--${step}`)))
    for (let i = 1; i < parsed.length; i += 1) {
      const lower = parsed[i - 1]
      const higher = parsed[i]
      const label = `${selector}: --${ELEV_STEPS[i + 1]} over --${ELEV_STEPS[i]}`
      // Both layers go deeper in alpha and the ambient layer widens. The
      // contact layer also widens past elev-2, because a floating object
      // stops casting a hairline — what must not happen is the pair
      // collapsing into a single blob, so the ambient layer has to stay
      // several times wider than the contact one at every step.
      for (let layer = 0; layer < 2; layer += 1) {
        expect(higher[layer].alpha, `${label} layer ${layer + 1} alpha`).toBeGreaterThan(
          lower[layer].alpha,
        )
      }
      expect(higher[1].blur, `${label} ambient blur`).toBeGreaterThan(lower[1].blur)
      expect(
        higher[1].blur / higher[0].blur,
        `${label} ambient:contact blur ratio`,
      ).toBeGreaterThanOrEqual(2.5)
    }
  })

  it('light-mode elevation is strong enough to see on a white card', () => {
    // The reason the light alphas sit where they do. `elev-1` is the resting
    // card on a near-white canvas, and the whole point of the scale is that
    // the card reads as raised with no help from the fill.
    const [contact, ambient] = layers(decl(':root', '--elev-1'))
    expect(contact.alpha).toBeGreaterThanOrEqual(0.06)
    expect(ambient.alpha).toBeGreaterThanOrEqual(0.1)
  })

  it('keeps the legacy shadow names alive as indirections onto the scale', () => {
    for (const [name, step] of [
      ['--shadow-card', '--elev-1'],
      ['--shadow-plate', '--elev-2'],
      ['--shadow-pop', '--elev-3'],
    ] as const) {
      expect(decl(':root', name), name).toBe(`var(${step})`)
    }
  })

  it.each(['.elev-1', '.elev-2', '.elev-3', '.elev-4'] as const)(
    '%s is self-contained, declaring its own shadow level and box-shadow',
    (cls) => {
      // Each class states both halves of the pair it needs, so reading one
      // class tells you everything it does. This is house style, not a
      // defence: an earlier version of this test claimed the CSS minifier
      // truncates an identical-declaration selector list to its last entry,
      // which is false. Measured against the built `dist/assets/*.css`,
      // esbuild 0.21.5 (Vite 5.4.21) merges adjacent identical rules and
      // keeps every selector, so a grouped `.elev-1, .elev-2 { … }` ships
      // with both selectors intact.
      const body = ruleBody(cls)
      expect(body, `${cls} sets --elev-shadow`).toContain(`--elev-shadow: var(--${cls.slice(1)})`)
      expect(body, `${cls} sets box-shadow`).toContain('box-shadow: var(--elev-shadow')
    },
  )

  it('exposes the scale as one canonical class vocabulary', () => {
    for (const cls of ['.elev-0', '.elev-1', '.elev-2', '.elev-3', '.elev-4', '.edge-lit']) {
      expect(CSS.includes(`${cls} {`), `missing \`${cls} {\``).toBe(true)
    }
    for (const cls of ['.elev-plate', '.elev-panel']) {
      expect(CSS.includes(`${cls} {`), `missing \`${cls} {\``).toBe(true)
    }
    // Source order, not specificity, is what lets `class="card elev-3"` lift
    // an existing card. If the utility block ever moves above the component
    // classes that guarantee silently stops being true.
    expect(CSS.indexOf('.elev-1 {')).toBeGreaterThan(CSS.indexOf('.visualization-container {'))
  })
})

/* ------------------------------------------------------------------ *
 * Preference contract
 *
 * `lib/preferences.ts` writes these onto <html> in JavaScript, but the
 * stylesheet has to be correct on its own: a reader whose module never
 * loaded — a failed chunk, a script error, an extension, a crawler — must get
 * the same page a reader with nothing stored gets. That only holds if the
 * neutral values live in `:root` rather than being supplied at runtime, so
 * the defaults are asserted here rather than trusted.
 * ------------------------------------------------------------------ */

describe('preference defaults in the stylesheet', () => {
  /**
   * `ruleBody` above escapes a leading `.` and nothing else, which is all the
   * elevation selectors need. Attribute selectors are full of regex
   * metacharacters, so this one escapes properly.
   */
  function attributeRule(selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const start = CSS.search(new RegExp(`^${escaped}\\s*\\{`, 'm'))
    expect(start, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(-1)
    const open = CSS.indexOf('{', start)
    return CSS.slice(open, CSS.indexOf('\n}', open))
  }

  it(':root declares every --pref-* property the contract writes', () => {
    // The values are the ones the site used before preferences existed, so
    // `html` and `body` resolve to exactly their previous rendering.
    expect(decl(':root', '--pref-text-scale')).toBe('1')
    expect(decl(':root', '--pref-measure')).toBe('70ch')
    expect(decl(':root', '--pref-line-height')).toBe('1.6')
    expect(decl(':root', '--pref-space')).toBe('1')
    expect(decl(':root', '--pref-motion-scale')).toBe('1')
  })

  it('scales the root font size from --pref-text-scale', () => {
    // Percent rather than `16px * scale`: a bare px would pin the reader's
    // own browser font size, which is a worse failure than not scaling.
    expect(ruleBody('html')).toMatch(/font-size:\s*calc\(100% \* var\(--pref-text-scale/)
  })

  it('consumes --pref-line-height on the body and --pref-measure on the prose', () => {
    expect(ruleBody('body')).toMatch(/line-height:\s*var\(--pref-line-height/)
    expect(ruleBody('.prose-lecture')).toMatch(/max-width:\s*var\(--pref-measure/)
  })

  it('kills transitions for an explicit reduced-motion preference', () => {
    // One rule per selector, because the three pseudo-class arms are the same
    // declaration stated three times and each should be findable on its own.
    // (An earlier version attributed this to a minifier that keeps only the
    // last selector; it does not — see the `.elev-N` note above.)
    expect(attributeRule("html[data-pref-motion='reduced']")).toContain('--pref-motion-scale: 0')
    for (const selector of [
      "html[data-pref-motion='reduced'] *",
      "html[data-pref-motion='reduced'] *::before",
      "html[data-pref-motion='reduced'] *::after",
    ]) {
      expect(attributeRule(selector), selector).toContain('transition-duration: 0.01ms !important')
    }
  })

  it('honours the OS motion preference in CSS, where a full-motion override cannot reach it', () => {
    expect(CSS).toContain('@media (prefers-reduced-motion: reduce)')
    // Three separate rules, one per pseudo-class target. See the note above.
    for (const selector of ['*', '*::before', '*::after']) {
      const block = CSS.match(
        new RegExp(`@media \\(prefers-reduced-motion: reduce\\) \\{\\s*${selector.replace('*', '\\*')} \\{([^}]*)\\}`, 'm'),
      )
      expect(block, `prefers-reduced-motion reset for ${selector}`).not.toBeNull()
      expect(block?.[1]).toContain('transition-duration: 0.01ms !important')
    }
  })

  it('keeps focus mode reversible and keeps navigation in the document', () => {
    // Focus mode is allowed to *reduce* chrome. It is not allowed to hide
    // the navigation: the only way out of focus mode would then be a control
    // that focus mode itself removed, and a keyboard user who entered it
    // could not leave. Guarded here because the natural next edit is to add
    // `display: none` to these rules and it would render fine.
    for (const selector of [
      ":root[data-pref-focus='on'] #main-content",
      ":root[data-pref-focus='on'] .prose-lecture",
      ":root[data-pref-focus='on'] header.sticky",
    ]) {
      expect(attributeRule(selector), selector).not.toMatch(/display:\s*none/)
    }
    expect(CSS).not.toMatch(/\[data-pref-focus='on'\][^{]*\{[^}]*visibility:\s*hidden/)
  })
})

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
