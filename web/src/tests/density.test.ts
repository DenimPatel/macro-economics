import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import tailwind from '../../tailwind.config'
import { SPACE_SCALE } from '../lib/preferences'

/**
 * The density contract, asserted against the stylesheet and the Tailwind
 * theme rather than against a rendering.
 *
 * The defect this replaces was not a bug so much as an absence. `--pref-space`
 * was written to `<html>` by the preferences layer and read by exactly two
 * declarations — the sidebar's section padding and the nav row — so a reader
 * who picked `compact`, reloaded, and looked at a tool page saw a control
 * panel, a chart plate and a stat-tile row at exactly the same size as before.
 * A preference with almost no reach is worse than no preference at all,
 * because it is a control that looks broken.
 *
 * The fix is a scale: the multiplier appears in twelve `--space-*` steps and
 * nowhere else, and every inset, gap and rhythm on the site is written in
 * those steps. Everything below is about keeping that true, and about the
 * smaller and more interesting half of the job — the list of dimensions that
 * must NOT move, because their value is a fact about the thing being drawn or
 * about how a hand reaches it rather than a matter of taste.
 */

const SRC = join(__dirname, '..')
const RAW_CSS = readFileSync(join(SRC, 'index.css'), 'utf8')
const CSS = RAW_CSS.replace(/\/\*[\s\S]*?\*\//g, '')

/**
 * The body of the first top-level rule with this exact selector. Anchored to
 * the start of a line, so a selector inside a media query — which this
 * stylesheet indents — is never mistaken for the top-level rule.
 */
function ruleBody(selector: string): string {
  const bodies = ruleBodies(selector)
  expect(
    bodies.length,
    `missing \`${selector} {\` rule in index.css`
  ).toBeGreaterThan(0)
  return bodies[0]
}

/**
 * Every top-level rule body for this selector. A selector can legitimately
 * appear twice: `.card, .tool-card` declares the surface and `.tool-card`
 * then declares its own padding, and a reader of the stylesheet thinks of
 * those as one rule.
 */
function ruleBodies(selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`^${escaped}\\s*\\{`, 'gm')
  const bodies: string[] = []
  for (const match of CSS.matchAll(re)) {
    const start = match.index ?? 0
    const open = CSS.indexOf('{', start)
    bodies.push(CSS.slice(open, CSS.indexOf('\n}', open)))
  }
  return bodies
}

/** The value of a declaration in any top-level rule for this selector. */
function decl(selector: string, name: string): string {
  const re = new RegExp(`${name}:\\s*([^;]+);`)
  for (const body of ruleBodies(selector)) {
    const found = body.match(re)
    if (found) return (found as RegExpMatchArray)[1].replace(/\s+/g, ' ').trim()
  }
  throw new Error(`${selector}: ${name} is not declared`)
}

/**
 * The body of an `@media print { ... }` block, matched to its closing brace
 * so the nested rules inside it do not truncate the result.
 */
function printBlock(): string {
  const start = CSS.indexOf('@media print')
  expect(start, 'missing @media print block in index.css').toBeGreaterThan(-1)
  let depth = 0
  for (let i = CSS.indexOf('{', start); i < CSS.length; i++) {
    if (CSS[i] === '{') depth++
    else if (CSS[i] === '}' && --depth === 0) return CSS.slice(start, i + 1)
  }
  throw new Error('unterminated @media print block')
}

/**
 * The spacing scale, as the numbers it is built from. `1` is a grid step whose
 * rem factor is exactly 1; the other two are the two off-grid steps and the
 * plate inset, each of which is the value the design already used.
 */
const STEPS = {
  '--space-hair': 0.15,
  '--space-tight': 0.4,
  '--space-1': 0.25,
  '--space-2': 0.5,
  '--space-3': 0.75,
  '--space-4': 1,
  '--space-5': 1.25,
  '--space-6': 1.5,
  '--space-8': 2,
  '--space-10': 2.5,
  '--space-inset': 1.35,
  '--space-12': 3,
} as const

const STEP_NAMES = Object.keys(STEPS) as (keyof typeof STEPS)[]

/** The rem factor a step is built from, parsed out of its declaration. */
function stepRem(name: string): number {
  const expression = decl(':root', name)
  const match = expression.match(
    /^calc\(([\d.]+)rem \* var\(--pref-space(?:,\s*[\d.]+)?\)\)$/
  )
  expect(
    match,
    `${name} must be \`calc(<rem> * var(--pref-space))\`: ${expression}`
  ).not.toBeNull()
  return Number((match as RegExpMatchArray)[1])
}

describe('the spacing scale is the only consumer of --pref-space', () => {
  it('defines every step, and each is a rem length times the multiplier', () => {
    for (const name of STEP_NAMES) {
      expect(stepRem(name), name).toBe(STEPS[name])
    }
  })

  it('gives every step its own fallback, so a bare var() is right without JS', () => {
    // `index.css` is the only source of these values, and a reader whose
    // preferences module never loaded still resolves `--space-4` to 1rem
    // rather than to nothing.
    for (const name of STEP_NAMES) {
      expect(decl(':root', name), name).toMatch(/var\(--pref-space,\s*1\)/)
    }
  })

  it('multiplies by the multiplier in exactly the steps and nowhere else', () => {
    // The whole point of the scale: one place to change, no second site where
    // a gap is expressed in its own rem value. A stray
    // `calc(2rem * var(--pref-space))` in a rule below would be a gap that
    // quietly does not round to a step, and the next agent would have no way
    // to know it exists.
    const consumers = CSS.match(/var\(--pref-space/g) ?? []
    expect(consumers).toHaveLength(STEP_NAMES.length)
  })

  it('keeps the grid steps ordered, and the off-grid steps named for their job', () => {
    const grid = [
      '--space-1',
      '--space-2',
      '--space-3',
      '--space-4',
      '--space-5',
      '--space-6',
      '--space-8',
      '--space-10',
      '--space-12',
    ]
    const sizes = grid.map((name) => STEPS[name as keyof typeof STEPS])
    for (let i = 1; i < sizes.length; i += 1) {
      expect(sizes[i], `${grid[i]} over ${grid[i - 1]}`).toBeGreaterThan(
        sizes[i - 1]
      )
    }
    // A numeric scale that is not monotonic is a trap: `p-s-7` would have to
    // mean something smaller than `p-s-6`, so the off-grid values get names.
    expect(STEPS['--space-hair']).toBeLessThan(STEPS['--space-1'])
    expect(STEPS['--space-tight']).toBeGreaterThan(STEPS['--space-1'])
    expect(STEPS['--space-tight']).toBeLessThan(STEPS['--space-2'])
    expect(STEPS['--space-inset']).toBeGreaterThan(STEPS['--space-5'])
    expect(STEPS['--space-inset']).toBeLessThan(STEPS['--space-6'])
  })

  it('resolves to the values the site used before density existed', () => {
    // `--pref-space: 1` has to be a page nobody can tell apart from the old
    // one, so every step's rem factor IS the pre-preference number. The
    // per-surface assertion is the next test; this is the scale-level one.
    expect(decl(':root', '--pref-space')).toBe('1')
    for (const name of STEP_NAMES) {
      expect(stepRem(name) * Number(SPACE_SCALE.comfortable), name).toBe(
        STEPS[name]
      )
    }
  })

  it('gives all three settings a distinct, monotonic result', () => {
    const order = ['compact', 'comfortable', 'spacious'] as const
    const at = (density: (typeof order)[number]) =>
      STEP_NAMES.map((name) => stepRem(name) * Number(SPACE_SCALE[density]))
    const [compact, comfortable, spacious] = order.map(at)
    for (let i = 0; i < compact.length; i += 1) {
      expect(compact[i], `${STEP_NAMES[i]} compact`).toBeLessThan(
        comfortable[i]
      )
      expect(spacious[i], `${STEP_NAMES[i]} spacious`).toBeGreaterThan(
        comfortable[i]
      )
    }
    expect(new Set(order.map(at).map((sizes) => sizes.join(','))).size).toBe(3)
  })

  it('keeps every step a positive length at every setting the reader can pick', () => {
    // `SPACE_SCALE` is the only writer of `--pref-space` and it is a closed
    // set of three positive numbers, so a negative or NaN multiplier cannot
    // reach a `calc()`. This asserts the closed set rather than trusting it.
    for (const [density, value] of Object.entries(SPACE_SCALE)) {
      expect(Number.isFinite(Number(value)), density).toBe(true)
      expect(Number(value), density).toBeGreaterThan(0)
      for (const name of STEP_NAMES) {
        expect(
          stepRem(name) * Number(value),
          `${name} at ${density}`
        ).toBeGreaterThan(0)
      }
    }
  })
})

describe('the surfaces that spend vertical space are on the scale', () => {
  /**
   * The rules the density preference has to reach, with the step each one is
   * allowed to use. A value that is not in this table is either a bug (a
   * density-bound rule reading a raw rem) or a deliberate exception, and the
   * deliberate exceptions are the subject of the next describe block.
   */
  const DENSITY_BOUND: [string, string][] = [
    ['.control-panel', 'padding'],
    ['.control-panel', 'gap'],
    ['.control-group', 'gap'],
    ['.visualization-container', 'padding'],
    ['.tool-card', 'padding'],
    ['.tool-card', 'margin-bottom'],
    ['.tool-heading', 'margin-bottom'],
    ['.tool-description', 'margin-bottom'],
    ['.note', 'padding'],
    ['.note', 'gap'],
    ['.note', 'margin-bottom'],
    ['.stat-tile', 'padding'],
    ['.stat-tile-label', 'margin-bottom'],
    ['.stat-tile-change', 'margin-top'],
    ['.button-group', 'gap'],
    ['.badge', 'padding'],
    ['.tier-chip', 'padding'],
    ['.prose-lecture th,\n.prose-lecture td', 'padding'],
  ]

  it('binds every block padding and gap to a step, not to a rem value', () => {
    for (const [selector, property] of DENSITY_BOUND) {
      const value = decl(selector, property)
      expect(value, `${selector} { ${property} }`).toMatch(
        /var\(--space-[a-z0-9-]+\)/
      )
      expect(value, `${selector} { ${property} }`).not.toMatch(/[\d.]+rem/)
      expect(value, `${selector} { ${property} }`).not.toMatch(
        /var\(--pref-space/
      )
    }
  })

  it("scales the nav rows' block axis and leaves their column inset literal", () => {
    // A side inset is a width decision: shrinking it changes how a lecture
    // title wraps inside a 264px column, which is a different thing from
    // taking the air out of the row.
    expect(decl('.section-title', 'padding')).toBe(
      'var(--space-5) 0.75rem var(--space-tight)'
    )
    expect(decl('.nav-link', 'padding')).toBe('var(--space-tight) 0.6rem')
    expect(decl('.section-title', 'margin-top')).toBe('var(--space-1)')
  })

  it('reaches the control panel on all three of its own numbers', () => {
    // The densest thing on a tool page, and the reason `compact` is worth
    // having: a six-slider panel spends 43px on its own padding and gap
    // before a control is drawn.
    expect(decl('.control-panel', 'padding')).toBe('var(--space-inset)')
    expect(decl('.control-panel', 'gap')).toBe('var(--space-inset)')
    expect(decl('.control-panel', 'margin-bottom')).toBe('var(--space-8)')
    expect(decl('.control-group', 'gap')).toBe('var(--space-2)')
  })

  it('takes the air out of a table without touching its type', () => {
    // Row padding scales; the numerals do not. A data table is read, not
    // skimmed, and 0.9375rem is the smallest type the prose column allows.
    const cells = ruleBody('.prose-lecture th,\n.prose-lecture td')
    expect(cells).toMatch(
      /padding:\s*var\(--space-2\) var\(--space-3\) var\(--space-2\) 0/
    )
    expect(decl('.prose-lecture table', 'font-size')).toBe('0.9375rem')
  })

  it("leaves the sidebar nav row's hairline off the scale", () => {
    // A 1px rule between rows, deliberately not `var(--space-1)`: at 0.85 a
    // scaled hairline computes to 0.85px and the browser rounds it to 0 or 1
    // depending on where it lands.
    expect(decl('.nav-link', 'margin')).toBe('1px 0.5rem')
  })

  it('does not reach the reading column twice', () => {
    // `.prose-lecture` block gaps are `em` of `--read-lead`, the reader's
    // leading. Binding them to `--pref-space` as well would apply two
    // preferences to one gap.
    for (const selector of [
      '.prose-lecture > * + *',
      '.prose-lecture h2',
      '.prose-lecture li + li',
    ]) {
      expect(ruleBody(selector), selector).not.toMatch(/var\(--space-/)
    }
    // The list's indent is a measure, not a rhythm value.
    expect(decl('.prose-lecture ul,\n.prose-lecture ol', 'padding-left')).toBe(
      '1.4rem'
    )
  })
})

describe('the dimensions that must not move', () => {
  it('keeps the chart plot area a fixed height, bound to no scale', () => {
    // A shorter plot re-scales the y-axis, so the same curve sits at a
    // different height and two tools stop being comparable by eye. This is a
    // correctness property, not a taste one.
    expect(decl(':root', '--plot-h')).toBe('400px')
    expect(decl(':root', '--plot-h'), '--plot-h').not.toMatch(/var\(--/)
    expect(decl('.recharts-responsive-container', 'height')).toBe(
      'var(--plot-h)'
    )
  })

  it('gives the data explorer the SAME plot geometry as every tool', () => {
    // It was the only chart on the site in a 420px frame, on the argument
    // that a second y-axis and a legend need the room. They do not: Recharts
    // positions its legend absolutely inside the plot box and reserves no
    // height for it, so the extra 20px made the AXIS shorter and pushed the
    // x tick labels down over the plot. 400px puts this page's right-hand
    // rate axis on the same pixel scale as every tool's left-hand one, which
    // is the only reason a height like this is fixed in the first place.
    expect(decl('.plot-frame', 'height')).toBe('var(--plot-h)')
  })

  /**
   * There is ONE plot height on this site, and this is the assertion that
   * says so.
   *
   * `--plot-h-tall: 420px` was declared beside `--plot-h` and read by
   * nothing, and the test that covered it counted its own single occurrence in
   * `:root` and called that a guard. Pinning a dead declaration is not a
   * guard: it makes a token nobody reads look load-bearing, and the next
   * agent to need a second height wires it up on the strength of a green tick
   * that only ever measured the token's own existence.
   *
   * So the property is the one that was true all along — no second plot
   * height — stated over every `height:` this stylesheet writes, so a
   * re-derived 420px is caught wherever it is written rather than only where
   * a reviewer happened to look.
   *
   * The `plotHeights` list is the positive control, and it is the reason this
   * cannot pass by finding nothing: a broken pattern reports an empty list, the
   * empty list satisfies every `not.toContain` below, and the suite goes green
   * on a stylesheet that no longer declares a plot height at all. `toContain
   * ('400px')` is what makes that a failure instead.
   */
  it('leaves the site with one plot height, and 420px nowhere in it', () => {
    const plotHeights = [...CSS.matchAll(/(?:^|[;{\s])(--plot-h[a-z-]*)\s*:\s*([^;}]+)/g)]
    expect(
      plotHeights.map((m) => m[1]),
      'the pattern found no plot HEIGHT token, so the checks below are vacuous'
    ).toContain('--plot-h')
    // ONE. A second declared height is the defect this replaces: it looks like
    // a supported second geometry, so a future agent wires a chart into it on
    // the strength of a declaration rather than a measurement.
    expect(
      plotHeights.map((m) => m[1]),
      'a second plot height token, declared and read by nothing'
    ).toEqual(['--plot-h'])
    // Both plot frames on the site resolve that one token, so a 400px plot is
    // 400px whatever drew it.
    for (const frame of ['.recharts-responsive-container', '.plot-frame']) {
      expect(decl(frame, 'height'), frame).toBe('var(--plot-h)')
    }
    // And 420px is gone from the file, comments included: a reviewer reading
    // the note on `.plot-frame` should not be able to find the number either.
    expect(RAW_CSS, 'the retired height survives as a literal').not.toMatch(/420px/)
  })

  it("leaves the tools' own plot frames on fixed pixels", () => {
    // `web/src/tools` draws into `h-[300px]` frames and hands Recharts
    // `height="100%"`, so the frame is the plot geometry, not a layout
    // utility. An arbitrary value carrying a var in it would be the same
    // mistake as the plot height, and it is the one place in the app a chart
    // height could still be reached from.
    const dir = join(SRC, 'tools')
    const files = readdirSync(dir).filter((entry) => entry.endsWith('.tsx'))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      const source = readFileSync(join(dir, file), 'utf8')
      for (const height of source.match(/(?:min-)?h-\[[^\]]*\]/g) ?? []) {
        expect(height, file).not.toMatch(/var\(--/)
      }
      // And nothing in a tool reaches the scale by the back door either.
      expect(source, file).not.toMatch(/\b[hw]-[a-z]*-s-/)
    }
  })

  it('never scales a minimum size, so a 44px target cannot become 37px', () => {
    // Nothing declares a `min-height` at all today, which is exactly why
    // this is worth guarding: the natural next edit in a density pass is to
    // add `min-height: var(--space-6)` somewhere, and that is the edit that
    // makes a control too small to hit.
    const minHeights = CSS.match(/min-(?:height|block-size):[^;]+;/g) ?? []
    for (const value of minHeights) {
      expect(value).not.toMatch(/var\(--space-|var\(--pref-space/)
    }
  })

  it('keeps a button and a number field at their hit-area size', () => {
    // Both are already under the 44px guideline, which is a separate decision
    // and not this one's: what matters here is that density cannot take the
    // four pixels that are left. The space a button gives back is the space
    // AROUND it, which `.button-group` does scale.
    expect(decl('.button', 'padding')).toBe('0.55rem 1rem')
    expect(decl('.number-input', 'padding')).toBe('0.5rem 0.65rem')
    expect(decl('.skip-link', 'padding')).toBe('0.6rem 1rem')
    expect(decl('.button-group', 'gap')).toBe('var(--space-3)')
  })

  it('keeps the header and the skip link structural in the components too', () => {
    // The header is 56px and `position: sticky`; the settings trigger and the
    // theme toggle are 36px squares. All of them are literal utilities, which
    // is why the `s-*` namespace below could not have reached them.
    const shell = readFileSync(join(SRC, 'layout', 'Shell.tsx'), 'utf8')
    const settings = readFileSync(
      join(SRC, 'components', 'SettingsPanel.tsx'),
      'utf8'
    )
    const toggle = readFileSync(join(SRC, 'layout', 'ThemeToggle.tsx'), 'utf8')
    expect(shell).toMatch(/h-14 items-center/)
    for (const source of [shell, settings, toggle]) {
      expect(source).not.toMatch(/\b[hw]-[a-z]*-s-/)
    }
    // The option cells and the reset button in the settings panel.
    expect(settings).toMatch(/py-1\.5/)
  })

  it('leaves a scrollbar allowance alone', () => {
    // `::-webkit-scrollbar` is 10px. `--space-3` at compact is 10.2px, which
    // is a fifth of a pixel of headroom over a scrollbar that decides whether
    // the last column of a wide table is reachable at all.
    expect(decl('.prose-lecture .table-scroll', 'padding-right')).toBe('0.9rem')
    // And the same allowance under a display equation, whose own vertical
    // extents come from KaTeX's fraction bars and scripts.
    expect(decl('.prose-lecture .katex-display', 'padding')).toBe(
      '0.5rem 0.9rem 1rem 0'
    )
    expect(decl('.prose-lecture .katex-display', 'margin')).toBe('0.5rem 0')
  })

  it('binds nothing inside the print block to the scale', () => {
    // Paper is a fixed width, the print block is written in points, and
    // `--pref-space` is deliberately left alone there so a reader's chosen
    // padding is not reflowed on top of the other pinned preferences.
    const block = printBlock()
    expect(block).not.toMatch(/--pref-space/)
    expect(block).not.toMatch(/--space-/)
  })
})

describe('the scale reaches TypeScript through one namespace', () => {
  const spacing = tailwind.theme.extend.spacing as Record<string, string>

  it('adds only s-* keys, so no width or height utility can reach the scale', () => {
    // `theme.spacing` backs `w-*` and `h-*` as well as padding and gap.
    // Redefining `4` would turn `h-4 w-4` — a 16px checkbox, and in the
    // settings panel a hit area — into `calc(1rem * var(--pref-space))`. A
    // separate namespace is what lets a class be visibly density-bound.
    for (const key of Object.keys(spacing)) {
      expect(key, key).toMatch(/^s-/)
    }
  })

  it('points every key at the matching step, and at nothing else', () => {
    for (const [name, rem] of Object.entries(STEPS)) {
      const key = `s-${name.replace('--space-', '')}`
      expect(spacing[key], key).toBe(`var(${name})`)
      // Each key points at a distinct var, and no two steps share a
      // declaration, so there is nothing here for a minifier to merge.
      expect(rem).toBeGreaterThan(0)
    }
    expect(Object.keys(spacing).sort()).toEqual(
      Object.keys(STEPS)
        .map((name) => `s-${name.replace('--space-', '')}`)
        .sort()
    )
  })

  it('uses the scale in the shared primitives, so page internals get it free', () => {
    const ui = readFileSync(join(SRC, 'components', 'ui.tsx'), 'utf8')
    // The page header and the tool card are on the syllabus, the tools index,
    // the home page, every case-study grid and every tool page. Converting
    // them here is what makes those pages density-aware without touching a
    // single one of their own files.
    for (const cls of ['mb-s-8', 'p-s-4', 'mt-s-1', 'mb-s-6']) {
      expect(ui, cls).toContain(cls)
    }
  })
})

describe('radii are tokens, and are not spacing steps', () => {
  const radii = tailwind.theme.extend.borderRadius as Record<string, string>

  it('defines four radii in :root, and the Tailwind tokens read them', () => {
    // One definition, two consumers: the stylesheet reads the var directly
    // and `tailwind.config.ts` points its tokens at the same var, so
    // `rounded-card` in TSX and `.card` cannot drift apart.
    expect(decl(':root', '--radius-control')).toBe('8px')
    expect(decl(':root', '--radius-card')).toBe('10px')
    expect(decl(':root', '--radius-plate')).toBe('12px')
    expect(decl(':root', '--radius-pill')).toBe('999px')
    expect(radii).toEqual({
      control: 'var(--radius-control)',
      card: 'var(--radius-card)',
      plate: 'var(--radius-plate)',
      pill: 'var(--radius-pill)',
    })
  })

  it('gives the stylesheet and the utilities the same corners', () => {
    // `rounded-lg` is 8px and `rounded-xl` is 12px, which are `control` and
    // `plate`. The six places that used them now name them.
    for (const selector of ['.button', '.number-input', '.skip-link']) {
      expect(decl(selector, 'border-radius'), selector).toBe(
        'var(--radius-control)'
      )
    }
    for (const selector of [
      '.control-panel',
      '.visualization-container',
      '.elev-panel',
    ]) {
      expect(decl(selector, 'border-radius'), selector).toBe(
        'var(--radius-plate)'
      )
    }
    for (const selector of ['.badge', '.tier-chip']) {
      expect(decl(selector, 'border-radius'), selector).toBe(
        'var(--radius-pill)'
      )
    }
    expect(decl('.card,\n.tool-card', 'border-radius')).toBe(
      'var(--radius-card)'
    )
    expect(decl('.note', 'border-radius')).toBe('var(--radius-card)')
    expect(decl('.stat-tile', 'border-radius')).toBe('var(--radius-card)')
    expect(decl('.elev-plate', 'border-radius')).toBe('var(--radius-card)')
  })

  it('does not scale a corner with density', () => {
    // A corner is a shape. A shape that changes with a spacing preference
    // reads as a rendering fault, not as a preference.
    for (const name of [
      '--radius-control',
      '--radius-card',
      '--radius-plate',
      '--radius-pill',
    ]) {
      expect(decl(':root', name), name).not.toMatch(/var\(/)
    }
    expect(RAW_CSS).toMatch(/--radius-card: 10px;/)
  })
})
