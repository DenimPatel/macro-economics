import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { render } from '@testing-library/react'
import { MotionConfig, useReducedMotion } from 'framer-motion'
import { describe, expect, it, vi } from 'vitest'
import tailwind from '../../tailwind.config'
import { clearThemeShift, activeThemeShift, beginThemeShift, shouldCrossFade } from '../lib/themeShift'

/**
 * The motion and interaction contract.
 *
 * Most of what this file asserts is about the ABSENCE of a thing, and that is
 * the point. The site's reduced-motion story was three CSS rules that zeroed
 * `transition-duration` and `animation-duration`, which is complete for
 * everything CSS animates and for nothing else:
 *
 *   - framer-motion drives its animations on `requestAnimationFrame` and
 *     writes inline `transform`/`opacity` every frame. A stylesheet duration
 *     is not in that loop. (The root now carries
 *     `MotionConfig reducedMotion="user"`, asserted below.)
 *   - Recharts animates series AND annotations on mount and on every data
 *     change, and it ignores `prefers-reduced-motion` outright.
 *   - `scroll-behavior: smooth` was gated by a MEDIA query only, so the
 *     in-app `motion: 'reduced'` preference did not reach it — the preference
 *     a reader set at this site, in this site, did nothing for every `#`
 *     anchor in the notes.
 *
 * The other half is the duration vocabulary. Before this file, `0.12s`,
 * `0.15s`, `140ms` and Tailwind's `duration-300` were four different
 * spellings of four different numbers, and only the first two multiplied
 * `--pref-motion-scale`. A duration token that nothing is required to use is
 * a token that gets bypassed, so the check here is structural: there are
 * exactly three of them, and the stylesheet contains no other time literal.
 *
 * Read together with `density.test.ts` (which owns the spacing scale),
 * `typography.test.ts` (which owns the type scale) and `tokens.test.ts`
 * (which owns the palette and the elevation scale). Every one of those files
 * fails on a specific, described regression; so does this one.
 */

const SRC = join(__dirname, '..')
const RAW_CSS = readFileSync(join(SRC, 'index.css'), 'utf8')
const CSS = RAW_CSS.replace(/\/\*[\s\S]*?\*\//g, '')

/** The body of a top-level rule, with comments already stripped. */
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

function ruleBody(selector: string): string {
  const bodies = ruleBodies(selector)
  expect(bodies.length, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(0)
  return bodies[0]
}

function decl(selector: string, name: string): string {
  const re = new RegExp(`${name}:\\s*([^;]+);`)
  for (const body of ruleBodies(selector)) {
    const found = body.match(re)
    if (found) return (found as RegExpMatchArray)[1].replace(/\s+/g, ' ').trim()
  }
  throw new Error(`${selector}: ${name} is not declared`)
}

/**
 * The body of an `@media (...) { ... }` block, matched to its closing brace so
 * the nested rules inside it do not truncate the result.
 */
function mediaBlock(query: string, from = 0): string {
  const start = CSS.indexOf(query, from)
  expect(start, `missing \`${query}\` in index.css`).toBeGreaterThan(-1)
  let depth = 0
  for (let i = CSS.indexOf('{', start); i < CSS.length; i++) {
    if (CSS[i] === '{') depth++
    else if (CSS[i] === '}' && --depth === 0) return CSS.slice(start, i + 1)
  }
  throw new Error(`unterminated ${query} block`)
}

/**
 * The body of an `@keyframes name { ... }` block, matched to its closing brace
 * so the rules that follow it do not leak into the check.
 */
function keyframes(name: string): string {
  const start = CSS.indexOf(`@keyframes ${name} {`)
  expect(start, `missing @keyframes ${name} in index.css`).toBeGreaterThan(-1)
  let depth = 0
  for (let i = CSS.indexOf('{', start); i < CSS.length; i++) {
    if (CSS[i] === '{') depth++
    else if (CSS[i] === '}' && --depth === 0) return CSS.slice(start, i + 1)
  }
  throw new Error(`unterminated @keyframes ${name}`)
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    if (entry === 'node_modules' || entry === 'dist') return []
    if (statSync(full).isDirectory()) return walk(full)
    return /\.(ts|tsx)$/.test(entry) ? [full] : []
  })
}

/**
 * Source with its comments removed.
 *
 * Necessary rather than fussy: every check below is about what the code
 * DOES, and half of this codebase's comments are about what it deliberately
 * does not do. A prose mention of `hover:shadow-plate` inside an explanation
 * of why `hover:shadow-plate` was removed is the single most likely way to
 * trip a source scan, and it would be a false failure every single time.
 *
 * `//` is only recognised at the start of a line, so a URL in a string
 * attribute — `https://github.com/...` — is not mistaken for a comment.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '')
}

function readSource(file: string): string {
  return stripComments(readFileSync(join(SRC, file), 'utf8'))
}

/**
 * The files this pass owns. Every one of them has been audited against the
 * duration vocabulary, the interaction-state model and the focus rule, so
 * every one of them is in scope for the checks below. `tools/` is deliberately
 * absent: those are agent 9's, and the checks are written so that adding a
 * file to this list is a deliberate act rather than a `walk`.
 */
const OWNED = [
  'index.css',
  'App.tsx',
  join('lib', 'themeShift.ts'),
  join('components', 'ui.tsx'),
  join('components', 'ToolComponents.tsx'),
  join('components', 'SettingsPanel.tsx'),
  join('layout', 'Shell.tsx'),
  join('layout', 'Sidebar.tsx'),
  join('layout', 'ThemeToggle.tsx'),
  join('layout', 'TableOfContents.tsx'),
  join('learning', 'Quiz.tsx'),
  join('learning', 'Prediction.tsx'),
  join('learning', 'MiniTool.tsx'),
  join('pages', 'Home.tsx'),
  join('pages', 'CasesIndex.tsx'),
  join('pages', 'CaseStudyPage.tsx'),
  join('pages', 'Syllabus.tsx'),
  join('pages', 'ToolsIndex.tsx'),
  join('pages', 'LecturePage.tsx'),
  join('pages', 'ToolPage.tsx'),
  join('pages', 'Glossary.tsx'),
  join('pages', 'DataExplorer.tsx'),
  join('pages', 'ConceptMapPage.tsx'),
  join('learning', 'ConceptMap.tsx'),
  join('lib', 'lookupSearch.ts'),
]

/* ================================================================== *
 * Duration vocabulary
 * ================================================================== */

describe('three duration tokens, and nothing else', () => {
  /** The three steps, with the millisecond value each one preserves. */
  const STEPS = { '--dur-fast': 120, '--dur-base': 150, '--dur-slow': 300 } as const
  const STEP_NAMES = Object.keys(STEPS) as (keyof typeof STEPS)[]

  it('defines each one as a millisecond value times the motion scale', () => {
    for (const name of STEP_NAMES) {
      expect(decl(':root', name), name).toBe(
        `calc(${STEPS[name]}ms * var(--pref-motion-scale, 1))`,
      )
    }
  })

  it('is the only place in the stylesheet that multiplies the motion scale', () => {
    // The mirror of `density.test.ts`'s "--pref-space appears exactly N times".
    // A `calc(120ms * var(--pref-motion-scale))` written into a rule body is a
    // duration that has forgotten which step it is, and nothing downstream
    // could tell.
    const consumers = CSS.match(/var\(--pref-motion-scale/g) ?? []
    expect(consumers).toHaveLength(STEP_NAMES.length)
  })

  it('keeps the three steps ordered, and named for what the transition does', () => {
    // Not just ascending: the gap between fast and base has to be small enough
    // that they are interchangeable-feeling, and the gap to slow has to be
    // obvious. A scale where `--dur-base` and `--dur-slow` differ by 10ms would
    // be three names for one duration.
    const [fast, base, slow] = STEP_NAMES.map((name) => STEPS[name])
    expect(fast).toBeLessThan(base)
    expect(base).toBeLessThan(slow)
    expect(base - fast).toBeLessThanOrEqual(50)
    expect(slow - base).toBeGreaterThan(100)
  })

  it('resolves to the durations the site used before tokens existed', () => {
    // Every value in `STEPS` is a number that was already written by hand
    // somewhere in this stylesheet or in a className, so a reader with nothing
    // stored cannot tell the difference. The numbers are checked against those
    // sites below rather than trusted.
    expect(decl(':root', '--pref-motion-scale')).toBe('1')
    expect(STEPS['--dur-fast']).toBe(120)
    expect(STEPS['--dur-base']).toBe(150)
    expect(STEPS['--dur-slow']).toBe(300)
  })

  it('routes every transition in the stylesheet through a token', () => {
    for (const [selector, name] of [
      ['.skip-link', 'transition'],
      ['.nav-link', 'transition'],
      ['.slider-input::-webkit-slider-thumb', 'transition'],
      ['.slider-input::-moz-range-thumb', 'transition'],
      ['.button', 'transition'],
      ['.number-input', 'transition'],
      ['.pref-tap', 'transition'],
      ['.pref-pop', 'animation'],
      ['.anchor-link', 'transition'],
      ['.lift', 'transition'],
    ] as const) {
      expect(decl(selector, name), `${selector} { ${name} }`).toMatch(
        /var\(--dur-(fast|base|slow)\)/,
      )
    }
  })

  it('leaves no bare time literal anywhere in the stylesheet', () => {
    // The reduced-motion reset is the one legitimate `0.01ms` — it is a
    // duration rather than a removal, so that an element which stops matching a
    // transition rule does not keep animating from an inherited one. It is
    // named here so that a second literal is a failure.
    //
    // The three token declarations are excluded because they ARE the
    // vocabulary; the scan is over everything the tokens are supposed to have
    // replaced.
    const tokens = ruleBody(':root')
    const rest = CSS.replace(tokens, '')
    const offenders = (rest.match(/\b\d*\.?\d+m?s\b/g) ?? []).filter((v) => v !== '0.01ms')
    expect(offenders).toEqual([])
    // And the literal count inside `:root` is exactly the three tokens.
    expect(tokens.match(/\b\d+m?s\b/g) ?? []).toEqual(['120ms', '150ms', '300ms'])
    // In seconds, which is how the old values were written. Zero of them.
    expect(CSS).not.toMatch(/[\d.]+s\s+ease/)
  })

  it('leaves no duration literal in the components it owns', () => {
    for (const file of OWNED.filter((f) => f.endsWith('.tsx'))) {
      const source = readSource(file)
      // `duration-300`, `duration-[450ms]`, `animate-pulse`, and anything else
      // that reaches past the token table.
      for (const match of source.match(/\b(?:duration|animate)-[a-z0-9[\]-]+/g) ?? []) {
        expect(match, file).toMatch(/^duration-(fast|base|slow)$/)
      }
      // `0.01ms` is the reduced-motion reset, which is quoted in prose here for
      // the same reason the tokens themselves are excluded above.
      const literals = (source.match(/\b\d*\.?\d+m?s\b/g) ?? []).filter((v) => v !== '0.01ms')
      expect(literals, file).toEqual([])
    }
  })

  it('exposes the same three names to TSX, and no numeric ones', () => {
    const durations = tailwind.theme.extend.transitionDuration as Record<string, string>
    // `DEFAULT` is the load-bearing key and the reason the whole extension
    // exists. Tailwind's `transition-colors` is a `transitionProperty` utility
    // and `transitionProperty` reads its duration from
    // `transitionDuration.DEFAULT` — so without this, the eighteen
    // `transition-colors` sites on the site were a literal `0.15s` that
    // ignored `--pref-motion-scale`. Found by reading a computed style in the
    // browser after the tokens already existed; a source grep cannot see it,
    // because the literal is emitted by the utility, not written by hand.
    expect(durations).toEqual({
      DEFAULT: 'var(--dur-base)',
      fast: 'var(--dur-fast)',
      base: 'var(--dur-base)',
      slow: 'var(--dur-slow)',
    })
    // The two places that animate a width now read the token, which is the
    // whole reason the `duration-*` utilities were re-pointed: a Tailwind
    // numeric duration does not know a reader can ask for a still page.
    for (const file of [join('layout', 'Sidebar.tsx'), join('pages', 'Syllabus.tsx')]) {
      expect(readFileSync(join(SRC, file), 'utf8'), file).toContain('duration-slow')
    }
  })

  it('reaches the Tailwind transition-property utilities too', () => {
    // Eighteen `transition-colors` sites live in `layout/`, `learning/`,
    // `components/`, `pages/` and four tools. They are all "a colour
    // acknowledging a press or a selection", which is what `--dur-base` is for,
    // and all eighteen of them were 150ms of un-scalable literal.
    const sites = walk(SRC)
      .filter((file) => !file.endsWith(join('tests', 'motion.test.tsx')))
      .filter((file) => /\btransition-(?:colors|all|opacity|transform)\b/.test(stripComments(readFileSync(file, 'utf8'))))
    // A guard on the guard: if a future pass removes every one of them this
    // count changes and the assertion stops being about the mechanism.
    expect(sites.length).toBeGreaterThan(5)
    expect(tailwind.theme.extend.transitionDuration.DEFAULT).toBe('var(--dur-base)')
  })
})

/* ================================================================== *
 * Reduced motion is complete
 * ================================================================== */

describe('reduced motion reaches every mechanism on the page', () => {
  const RESET_PROPERTIES = [
    'animation-duration: 0.01ms !important',
    'animation-iteration-count: 1 !important',
    'transition-duration: 0.01ms !important',
    'scroll-behavior: auto !important',
  ]

  it('resets the attribute and the media query, on all three pseudo targets', () => {
    // `tokens.test.ts` already asserts the `transition-duration` half. What it
    // does not check is that the root element itself is covered: `html[...] *`
    // is the DESCENDANTS only, so before this pass the root was the one element
    // in the document whose own transitions kept running under an explicit
    // `motion: 'reduced'`.
    const attribute = ruleBody("html[data-pref-motion='reduced']")
    for (const property of RESET_PROPERTIES.filter((p) => !p.startsWith('scroll'))) {
      expect(attribute, property).toContain(property)
    }
    for (const selector of ["*", '*::before', '*::after']) {
      const body = CSS.match(
        new RegExp(
          `html\\[data-pref-motion='reduced'\\] ${selector.replace('*', '\\*')}\\s*\\{([^}]*)\\}`,
        ),
      )
      expect(body, selector).not.toBeNull()
      for (const property of RESET_PROPERTIES) {
        expect(body?.[1], `${selector}: ${property}`).toContain(property)
      }
    }
  })

  it('zeros the motion scale from BOTH the attribute and the media query', () => {
    // This is the single value `lib/themeShift.ts` reads to decide whether a
    // theme cross-fade may play. If the media query stopped setting it, a
    // reader whose OS asks for less motion would get the fade.
    expect(ruleBody("html[data-pref-motion='reduced']")).toContain('--pref-motion-scale: 0')
    const media = mediaBlock('@media (prefers-reduced-motion: reduce)')
    expect(media).toMatch(/html\s*\{[^}]*--pref-motion-scale:\s*0/)
    expect(media).toMatch(/html\s*\{[^}]*scroll-behavior:\s*auto/)
  })

  it('turns smooth scrolling off for the in-app preference, not only for the OS', () => {
    // The media gate alone was the bug: `html { scroll-behavior: smooth }`
    // inside `@media (prefers-reduced-motion: no-preference)` is specificity
    // (0,0,1) and the attribute rule is (0,1,1), so it happened to lose — but
    // only because the attribute rule sits LATER in the file. That is a
    // coincidence, not a relationship, and the first edit that moves either
    // block gives a reader who asked for a still page an animated jump to
    // every `#` in a lecture. The `:not()` makes it order-independent.
    const gate = mediaBlock('@media (prefers-reduced-motion: no-preference)', 0)
    const smooth = gate.match(/html[^{]*\{[^}]*scroll-behavior:\s*smooth/)
    expect(smooth, 'the no-preference gate').not.toBeNull()
    expect(smooth?.[0]).toContain(":not([data-pref-motion='reduced'])")
    // And there is exactly one `scroll-behavior: smooth` in the document.
    expect(CSS.match(/scroll-behavior:\s*smooth/g) ?? []).toHaveLength(1)
  })

  it('has nothing animating on a frame timer', () => {
    // `requestAnimationFrame` and an animating `setInterval` are invisible to
    // a `transition-duration` reset, because neither one has a duration. There
    // are none; the assertion is here so the next person who adds one finds out
    // in CI rather than from a reader.
    const offenders = walk(SRC)
      .filter((file) => !file.endsWith(join('tests', 'motion.test.tsx')))
      .filter((file) => /requestAnimationFrame|setInterval\(/.test(stripComments(readFileSync(file, 'utf8'))))
      .map((file) => relative(SRC, file))
    expect(offenders).toEqual([])
  })

  it('carries the OS query into framer-motion at the app root', () => {
    // CSS cannot do this. framer-motion writes inline `transform` and `opacity`
    // every frame, so a `transition-duration: 0.01ms !important` in a universal
    // selector is not in its loop at all. `MotionConfig reducedMotion="user"` is
    // the one switch that reaches it, and it belongs at the root because a
    // per-component `useReducedMotion` is a thing someone can forget.
    const app = readFileSync(join(SRC, 'App.tsx'), 'utf8')
    expect(app).toContain('from \'framer-motion\'')
    expect(app).toMatch(/<MotionConfig reducedMotion="user">/)
  })

  it('and that root config actually reports the OS setting to a component', () => {
    // The source assertion above would pass on a typo'd string literal, so this
    // is the behavioural half: a component under the root config sees the OS
    // preference through framer-motion's own hook.
    //
    // Only the ASKING direction is tested. framer-motion resolves the media
    // query once and caches it for the life of the module, so the negative case
    // would need a second process to observe honestly — and it is the positive
    // direction that is this app's contract. A reader whose OS asks and who
    // does not get `true` here has a site that animates at them.
    const Probe = () => {
      const reduced = useReducedMotion()
      return <span data-testid="probe">{reduced === null ? 'unknown' : String(reduced)}</span>
    }

    const original = window.matchMedia
    window.matchMedia = ((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia
    try {
      const { container } = render(
        <MotionConfig reducedMotion="user">
          <Probe />
        </MotionConfig>,
      )
      expect(container.textContent).toBe('true')
    } finally {
      window.matchMedia = original
    }
  })

  it('silences every Recharts component the app can reach', () => {
    // Recharts ignores `prefers-reduced-motion` entirely: `isAnimationActive`
    // defaults to true with a 1500ms tween that re-runs on EVERY data change,
    // which is why dragging a slider used to re-animate the whole chart per
    // frame. The series are handled in `ChartPrimitives.tsx`, and so are the
    // ANNOTATIONS — `ReferenceDot` and `ReferenceLine` animate their position
    // too, and the tools use them heavily (eleven `ReferenceLine`s in
    // `SpeculativeAttack`, three `ReferenceDot`s in `PhillipsCurve`), so every
    // one of those markers was gliding from its old coordinate to its new one
    // on each frame of a drag.
    //
    // A named list rather than a parse of the source: the assertion is about
    // which components are SILENCED, and reading that out of the module's own
    // syntax would make the test agree with whatever the module happens to say.
    const DATA_SERIES = ['Line', 'Area', 'Bar', 'Scatter', 'Pie']
    const ANNOTATIONS = ['ReferenceLine', 'ReferenceArea', 'ReferenceDot', 'Brush']

    const primitives = readSource('components/ChartPrimitives.tsx')
    for (const component of [...DATA_SERIES, ...ANNOTATIONS]) {
      expect(primitives, component).toMatch(
        new RegExp(`const (?:DATA_SERIES|ANNOTATIONS) = \\[[^\\]]*\\b${component}\\b`),
      )
    }
    expect(primitives).toContain('isAnimationActive: false')
    // The annotations get the animation flag and NOTHING else: a `strokeWidth`
    // of 2.25 on a 2px reference line is a different decision, and applying
    // the series defaults to annotation geometry is how a chart ends up with
    // marker lines heavier than the data.
    const noAnimation = primitives.match(/const NO_ANIMATION = \{([^}]*)\}/)
    expect(noAnimation, 'NO_ANIMATION').not.toBeNull()
    const properties = (noAnimation?.[1] ?? '')
      .split(',')
      .map((p) => p.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
    expect(properties).toEqual(['isAnimationActive: false'])

    // No tool overrides it.
    const overrides = walk(join(SRC, 'tools'))
      .concat(walk(join(SRC, 'pages')))
      .filter((file) => /isAnimationActive/.test(stripComments(readFileSync(file, 'utf8'))))
      .map((file) => relative(SRC, file))
    expect(overrides).toEqual([])

    // And every Recharts identifier the app imports is either silenced or
    // genuinely inert. A tool that reaches for `Funnel` or `Treemap` next week
    // is a tool that animates on every data change, and the failure should be
    // this test rather than a surprise in a lecture.
    const inert = new Set([
      'XAxis',
      'YAxis',
      'ZAxis',
      'CartesianGrid',
      'Tooltip',
      'Legend',
      'ResponsiveContainer',
      'Cell',
      'Label',
      'LabelList',
      'LineChart',
      'AreaChart',
      'BarChart',
      'ComposedChart',
      'ScatterChart',
      'PieChart',
    ])
    const silenced = new Set([...DATA_SERIES, ...ANNOTATIONS])
    const imported = new Set<string>()
    for (const file of walk(SRC)) {
      const source = stripComments(readFileSync(file, 'utf8'))
      for (const match of source.matchAll(/import\s*\{([^}]*)\}\s*from\s*'recharts'/g)) {
        for (const name of (match[1] ?? '').split(',')) {
          const trimmed = name.trim().split(/\s+as\s+/)[0]
          if (trimmed) imported.add(trimmed)
        }
      }
    }
    const unhandled = [...imported].filter((n) => !silenced.has(n) && !inert.has(n))
    expect(unhandled).toEqual([])
  })
})

/* ================================================================== *
 * The theme cross-fade
 * ================================================================== */

describe('the theme cross-fade cannot be left half-done', () => {
  it('runs on a veil, never on a transition on the colours', () => {
    // A transition on `background-color` on `*` is the documented way to leave
    // a permanent compositing layer on every element in the document, and
    // `transition` is not an inherited property, so it would not have covered
    // the elements that set their own colour anyway.
    expect(CSS).not.toMatch(/^\s*\*\s*\{[^}]*transition/s)
    for (const phase of ['out', 'in']) {
      const body = CSS.match(
        new RegExp(
          `html:not\\(\\[data-pref-motion='reduced'\\]\\) body\\.theme-shift-${phase}::after\\s*\\{([^}]*)\\}`,
        ),
      )
      expect(body, `theme-shift-${phase}`).not.toBeNull()
      expect(body?.[1]).toMatch(/position:\s*fixed/)
      // The whole point: a 270ms veil must never swallow a click.
      expect(body?.[1]).toMatch(/pointer-events:\s*none/)
      expect(body?.[1]).toMatch(/z-index:\s*90/)
    }
  })

  it('is gated so it cannot exist under reduced motion at all', () => {
    // Not a preference: a `0ms` animation with `forwards` holds its last
    // keyframe, and the out-phase's last keyframe is `opacity: 1`. A
    // half-guarded cross-fade would therefore black the page out permanently
    // instead of merely failing to fade.
    const rules = CSS.match(/body\.theme-shift-(?:out|in)::after/g) ?? []
    // Two gated rules, plus the two that take the veil out in print.
    expect(rules).toHaveLength(4)
    const gated = CSS.match(/@media \(prefers-reduced-motion: no-preference\)/g) ?? []
    expect(gated.length).toBeGreaterThanOrEqual(2)
    const print = CSS.slice(CSS.indexOf('@media print'))
    expect(print).toMatch(/body\.theme-shift-out::after\s*\{\s*display:\s*none/)
    expect(print).toMatch(/body\.theme-shift-in::after\s*\{\s*display:\s*none/)
  })

  it('animates opacity only — no layout, no colour, no filter', () => {
    for (const name of ['theme-veil-in', 'theme-veil-out']) {
      const block = keyframes(name)
      expect(block, name).toMatch(/opacity:/)
      expect(block, name).not.toMatch(
        /(background|color|transform|filter|width|height|top|left|all|inset|translate)\s*[;:]/,
      )
    }
  })

  it('skips the fade whenever the reader has asked for stillness', () => {
    // `--pref-motion-scale` is the single value both halves of the preference
    // write, so reading it here means this module cannot disagree with
    // `index.css` about when motion is allowed.
    //
    // The value is written directly rather than asserted ambiently, because
    // jsdom does not resolve custom properties out of a stylesheet: an
    // unstated read here would be empty, which is neither `0` nor a real
    // answer, and the assertion that matters is the one where it IS 0.
    const root = document.documentElement
    const at = (value: string) => {
      root.style.setProperty('--pref-motion-scale', value)
      return shouldCrossFade()
    }
    try {
      expect(at('0')).toBe(false)
      expect(at('1')).toBe(true)
    } finally {
      root.style.removeProperty('--pref-motion-scale')
    }
  })

  it('has a resting state a test can assert and a caller can force', () => {
    expect(activeThemeShift()).toBeNull()
    document.body.classList.add('theme-shift-out')
    expect(activeThemeShift()).toBe('out')
    document.body.classList.add('theme-shift-in')
    expect(activeThemeShift()).toBe('out')
    clearThemeShift()
    expect(activeThemeShift()).toBeNull()
  })

  it('is a no-op without layout, which is what keeps jsdom free of timers', () => {
    // The `applyTheme` contract is that the theme is applied synchronously when
    // the fade cannot run. Several hundred assertions elsewhere depend on that,
    // and a pending 600ms backstop in every one of them would be a much worse
    // failure than a missing animation.
    const commit = vi.fn()
    expect(beginThemeShift(commit)).toBe(false)
    expect(commit).not.toHaveBeenCalled()
    expect(activeThemeShift()).toBeNull()
  })
})

/* ================================================================== *
 * Elevation on hover
 * ================================================================== */

describe('elevation on hover preserves the lit edge', () => {
  it('is one mechanism, and it changes a custom property rather than box-shadow', () => {
    const rest = ruleBody('.lift')
    expect(rest).toContain('--elev-shadow: var(--elev-1)')
    expect(rest).toContain('--elev-inset: inset 0 1px 0 var(--elev-inset-hi)')
    expect(rest).toMatch(/box-shadow:\s*var\(--elev-shadow\),\s*var\(--elev-inset\)/)

    // The whole fix. A `box-shadow` written on the hover rule would replace
    // both layers with one, which is exactly what `hover:shadow-plate` did to
    // every card on the site.
    for (const selector of ['.lift:hover', '.lift.is-hover']) {
      const body = ruleBody(selector)
      expect(body, selector).toContain('--elev-shadow: var(--elev-2)')
      expect(body, selector).not.toMatch(/box-shadow:/)
      expect(body, selector).not.toMatch(/--elev-inset:/)
    }
  })

  it('writes the two hover halves as two rules, not one selector list', () => {
    // The two halves are two different mechanisms — a pointer and a script —
    // and the test wants them findable apart. (An earlier version of this
    // comment claimed the production minifier would ship only the last
    // selector and no card would lift. That is false: esbuild 0.21.5, as
    // driven by Vite 5.4.21, merges adjacent identical rules and keeps every
    // selector — measured against the built `dist/assets/*.css`.)
    const list = CSS.match(/\.lift:hover\s*,\s*\.lift\.is-hover\s*\{/)
    expect(list).toBeNull()
  })

  it('lifts by one step and one pixel, with no scale and no layout property', () => {
    expect(ruleBody('.lift:hover')).toMatch(/transform:\s*translateY\(-1px\)/)
    for (const selector of ['.lift', '.lift:hover', '.lift.is-hover']) {
      const body = ruleBody(selector)
      // A scale re-flows the text inside the card, so a grid of twenty of them
      // would re-wrap every description as the pointer crossed it.
      expect(body, selector).not.toMatch(/scale\(/)
      // And nothing that can move a sibling.
      for (const property of ['width', 'height', 'margin', 'padding', 'top', 'left', 'font-size', 'border-width']) {
        expect(body, `${selector}: ${property}`).not.toMatch(new RegExp(`(?:^|\\s)${property}:`))
      }
    }
  })

  it('is one step, and the two steps are adjacent on the scale', () => {
    // `--elev-2` is the step the scale's own documentation names as "hovered
    // cards", so the lift lands where the vocabulary already says it should.
    expect(decl(':root', '--elev-1')).not.toBe(decl(':root', '--elev-2'))
    expect(decl(':root', '--elev-2')).not.toBe(decl(':root', '--elev-3'))
  })

  it('makes every composable surface in the stylesheet use the same form', () => {
    for (const selector of [
      '.card,\n.tool-card',
      '.control-panel',
      '.visualization-container',
      '.elev-plate',
      '.elev-panel',
      '.lift',
    ]) {
      const body = ruleBody(selector)
      expect(body, selector).toContain('--elev-shadow: var(--elev-')
      expect(body, selector).toMatch(/box-shadow:\s*var\(--elev-shadow\),\s*var\(--elev-inset\)/)
    }
  })

  it('makes the Tailwind shadow utilities inset-preserving too', () => {
    // A bare `var(--elev-2)` writes `box-shadow` wholesale, so a utility is
    // exactly as capable of dropping the lit edge as a hand-written rule. The
    // table now reads the inset out of the same property the surface set, and
    // `0 0 0 0` is the fallback that keeps the utility usable on a surface
    // that never declared one.
    const shadows = tailwind.theme.extend.boxShadow as Record<string, string>
    for (const [name, value] of Object.entries(shadows)) {
      expect(value, name).toMatch(/^var\(--elev-\d\), var\(--elev-inset, 0 0 0 0\)$/)
    }
  })

  it('leaves no site that would clobber the inset on hover', () => {
    const offenders = OWNED.map((file) => [file, readSource(file)] as const)
      .filter(([, source]) => /hover:shadow-|hover:elev|hover:box-shadow/.test(source))
      .map(([file]) => file)
    expect(offenders).toEqual([])
  })

  it('leaves the recessed family recessed', () => {
    // `.note` and `.stat-tile` take NO elevation on purpose: a `surface-2` fill
    // is a RECESSED well — it is darker than the surface it sits in — and a
    // cast shadow would assert the opposite of what the fill already says. The
    // natural next edit in a depth pass is to give them a hover, so the hole is
    // guarded rather than described.
    for (const selector of ['.note', '.stat-tile']) {
      const body = ruleBody(selector)
      expect(body, selector).not.toMatch(/box-shadow:/)
      expect(body, selector).not.toMatch(/--elev-shadow:/)
    }
  })
})

/* ================================================================== *
 * The interaction state model
 * ================================================================== */

describe('every interactive surface has the whole state set', () => {
  /**
   * `rest` is the base rule, so it is not a column here. `sel` is the
   * current/selected state, which only a control with a selection has.
   *
   * `.button` is `active: false` and that is a fact, not an omission: a
   * button has two fills and a press that steps one of them has to say which.
   * The two variants carry it, and a third variant would have to as well —
   * which is why `Button` in `ToolComponents.tsx` is a two-variant union
   * rather than a free-form className.
   */
  const STATES: { cls: string; hover: boolean; active: boolean; focus: boolean; disabled: boolean; sel?: boolean }[] = [
    { cls: '.nav-link', hover: true, active: true, focus: true, disabled: true, sel: true },
    { cls: '.button', hover: true, active: false, focus: true, disabled: true, sel: true },
    { cls: '.button-primary', hover: true, active: true, focus: true, disabled: true },
    { cls: '.button-secondary', hover: true, active: true, focus: true, disabled: true },
    { cls: '.slider-input', hover: true, active: true, focus: true, disabled: true, sel: true },
    { cls: '.number-input', hover: true, active: true, focus: true, disabled: true },
    { cls: '.skip-link', hover: false, active: true, focus: true, disabled: false },
  ]

  it('declares every state it claims, as its own rule', () => {
    for (const state of STATES) {
      // A compound selector still counts: `.nav-link:active:not(.active)` is
      // the press state for a row that is not the current route, and it is
      // written that way because a current row's press is a different colour.
      const has = (suffix: string) =>
        new RegExp(`${state.cls.replace('.', '\\.')}${suffix}[^{]*\\{`).test(CSS)
      expect(has(':hover'), `${state.cls}:hover`).toBe(state.hover)
      expect(has(':active'), `${state.cls}:active`).toBe(state.active)
      expect(has(':disabled'), `${state.cls}:disabled`).toBe(state.disabled)
    }
  })

  it('gives a toggle button a selected state, and only a toggle button', () => {
    // The shared `Button` primitive has taken a `pressed` prop since before
    // this pass and emitted `aria-pressed` from it, and nothing rendered that
    // state — a pressed toggle was pixel-identical to an unpressed one, so the
    // only signal was the attribute in the accessibility tree. It is one rule
    // rather than three because the point is that a tool cannot render a
    // toggle whose selected state differs from another tool's.
    expect(ruleBody(".button[aria-pressed='true']")).toMatch(/background-color:/)
    expect(ruleBody(".button[aria-pressed='true']")).toMatch(/border-color:/)
    // Bare `[aria-pressed]` is not the target: the primitive omits the
    // attribute entirely when it is not a toggle, and a bare selector would
    // also match `aria-pressed="false"`.
    expect(CSS).not.toMatch(/\.button\[aria-pressed\]\s*\{/)
    // And every control that DOES have a selection says so through the
    // attribute rather than a bespoke class: the nav row, the button, the
    // slider, the segmented settings options, the tools-index filter and the
    // lecture's "mark complete".
    const carriers = walk(SRC)
      .filter((file) => !file.endsWith(join('tests', 'motion.test.tsx')))
      .filter((file) => /aria-pressed|aria-current|aria-expanded|\.active|elev-/.test(stripComments(readFileSync(file, 'utf8'))))
    expect(carriers.length).toBeGreaterThan(4)
  })

  it('carries the ring on the element the browser will actually focus', () => {
    // One rule, contrast-guarded by `contrast.test.ts`, and nothing in the files
    // this pass owns may suppress it.
    //
    // There are exactly three suppressions on the site, and each is a container
    // that is focused PROGRAMMATICALLY rather than reached by Tab, where a ring
    // would frame something the reader did not tab to:
    //
    //   `.slider-input:focus-visible`  a 4px-tall track has nowhere to draw a
    //                                  2px outline, so the ring moved to the thumb
    //   the settings panel             `!important`, because the global rule is
    //                                  emitted AFTER the utilities layer and
    //                                  would otherwise win on source order
    //   `<main id="main-content">`     the skip link's target
    expect(ruleBody('.slider-input:focus-visible')).toMatch(/outline:\s*none/)
    expect(readSource('components/SettingsPanel.tsx')).toContain('!outline-none')
    expect(readSource('layout/Shell.tsx')).toContain('outline-none')
    for (const file of OWNED.filter(
      (f) => f.endsWith('.tsx') && !f.includes('SettingsPanel') && !f.includes('Shell.tsx'),
    )) {
      const source = readSource(file)
      expect(source, file).not.toMatch(/\boutline-none\b/)
      expect(source, file).not.toMatch(/focus:outline-none/)
    }
  })

  it('has no press state on a surface that cannot be pressed', () => {
    // A `.badge` labels a score and a `.tier-chip` labels a difficulty. Neither
    // is a button and neither is in the tab order, so a `:hover` on either
    // would be a promise the DOM does not keep. "This element has no hover
    // state" has to be distinguishable from "this element was missed", because
    // the second reading is the one a later pass acts on.
    for (const selector of ['.badge', '.tier-chip', '.level-cell', '.tier-swatch']) {
      const bodies = ruleBodies(selector)
      expect(bodies.length, selector).toBeGreaterThan(0)
      for (const body of bodies) {
        expect(body, selector).not.toMatch(/:(hover|active|focus)\b/)
        expect(body, selector).not.toMatch(/transition:/)
      }
    }
  })

  it('suppresses the tap flash only where a real press state replaces it', () => {
    // `-webkit-tap-highlight-color` is the grey box Chrome and Safari flash under
    // a finger. Suppressing it globally — which is the reflex — would strip the
    // only feedback from every link that has no `:active` rule. So
    // `.tap-clear` is opt-in, and every site carrying it has a press.
    expect(ruleBody('.tap-clear')).toMatch(/-webkit-tap-highlight-color:\s*transparent/)
    for (const file of OWNED.filter((f) => f.endsWith('.tsx'))) {
      const lines = readSource(file).split('\n')
      lines.forEach((line, i) => {
        if (!/\btap-clear\b/.test(line)) return
        const window = lines.slice(Math.max(0, i - 6), i + 7).join('\n')
        // `.pref-tap` already suppresses it, and the branch strings that
        // carry the `active:` are a few lines below the class list.
        expect(window, `${file}:${i + 1}`).toMatch(/active:|pref-tap/)
      })
    }
  })
})

/* ================================================================== *
 * Pointer honesty
 * ================================================================== */

describe('hover is a pointer affordance, not a touch one', () => {
  it('gates the rules that would stick after a tap', () => {
    // `:hover` sticks on a touch device. A navigation drawer full of rows left
    // lit up is a drawer that looks broken the moment you use it, because the
    // drawer closes on navigation and the rows are never revisited. A card's
    // stuck lift leaves one card a pixel high until the next tap, which is a
    // blemish rather than a broken control — so `.lift:hover` is deliberately
    // NOT gated, and this is the asymmetry stated out loud.
    const gated = CSS.match(/@media \(hover: hover\) and \(pointer: fine\)/g) ?? []
    expect(gated.length).toBeGreaterThanOrEqual(2)
    const block = CSS.slice(CSS.indexOf('@media (hover: hover) and (pointer: fine)'))
    expect(block.slice(0, block.indexOf('\n}'))).toMatch(/\.nav-link:hover\s*\{/)
    expect(block).toMatch(/\.slider-input:hover::(-webkit|moz)-slider-thumb\s*\{/)
    // And `:active` stays outside, because it is the state a finger gets.
    expect(CSS).toMatch(/\.nav-link:active:not\(\.active\)\s*\{/)
    expect(CSS).toMatch(/\.slider-input:active::(-webkit|moz)-slider-thumb\s*\{/)
  })

  it('gives the touch reader an anchor it can see, measured against 3:1', () => {
    // The heading anchor is the one place a hover rule carries INFORMATION: the
    // `#` is invisible until the heading is approached. On a coarse pointer
    // there is no approach, so it is permanently present at 0.8 — absent would
    // leave a zero-opacity, focusable, tappable one-character target with
    // nothing to say it is there.
    expect(ruleBody('.anchor-link')).toMatch(/transition:\s*opacity var\(--dur-fast\)/)
    const coarse = mediaBlock('@media (hover: none)')
    expect(coarse).toMatch(/\.anchor-link\s*\{[^}]*opacity:\s*0\.8/)
    for (const [name, vars] of THEMES) {
      expect(anchorContrast(vars), `${name}: touch anchor`).toBeGreaterThanOrEqual(3)
    }
  })

  it('lets a vertical swipe past the slider and stops nothing else', () => {
    // `touch-action: none` on a 4px-tall control would mean every miss is a
    // dead end on a phone. `pan-y` is the same split `overscroll-behavior-x:
    // contain` makes for the scrolling code blocks and wide tables.
    expect(decl('.slider-input', 'touch-action')).toBe('pan-y')
    expect(decl('.slider-input', '-webkit-tap-highlight-color')).toBe('transparent')
  })
})

/* ================================================================== *
 * Scrollbars and selection
 * ================================================================== */

describe('scrollbars and selection hold up in both engines', () => {
  it('gives Firefox a scrollbar that fits the space reserved for it', () => {
    // `::-webkit-scrollbar` is the mechanism the layout is tuned around: a
    // persistently visible scrollbar is how a reader knows a table or an
    // equation continues past the measure, and `.table-scroll` and
    // `.katex-display` reserve 0.9rem of right padding because of the 10px.
    // Firefox ignores those pseudo-elements and its default is around 15px
    // with a different footprint, so the last column of a wide table would be
    // clipped rather than merely tight.
    expect(decl('::-webkit-scrollbar', 'width')).toBe('10px')
    expect(decl('.prose-lecture .table-scroll', 'padding-right')).toBe('0.9rem')

    // The standard properties are gated on a POSITIVE Blink/WebKit probe, and
    // the probe is the whole difficulty. Per CSSOM Scrollbars, EITHER standard
    // property being non-`auto` makes the user agent ignore
    // `::-webkit-scrollbar`, so an ungated (or wrongly-gated) block silently
    // deletes the site's scrollbar in Chrome rather than adding one to Firefox.
    //
    // The gate that reads like the right one is wrong: Chromium reports `false`
    // for `CSS.supports('selector(::webkit-scrollbar)')` while implementing the
    // pseudo-elements, so `@supports not selector(::-webkit-scrollbar)` applies
    // everywhere. `:-webkit-any-link` is a real Blink/WebKit-only pseudo-class,
    // which is the direction the probe needs to run in.
    const block = CSS.match(
      /@supports not \(selector\(:-webkit-any-link\)\) \{([^}]*\{[^}]*\}[^}]*)\}/,
    )
    expect(block, 'the Firefox-only scrollbar block').not.toBeNull()
    expect(block?.[1]).toMatch(/scrollbar-width:\s*thin/)
    expect(block?.[1]).toMatch(/scrollbar-color:\s*var\(--c-border-strong\) transparent/)
    // `html`, so both inherited properties reach every scrollbox on the page.
    expect(block?.[1]).toMatch(/html\s*\{/)
    // And the wrong gate must not come back.
    expect(CSS).not.toMatch(/@supports not selector\(::-webkit-scrollbar\)/)
    // `scrollbar-width` appears exactly once, so there is no second, ungated
    // declaration that would win in a Blink engine.
    expect(CSS.match(/scrollbar-width:/g) ?? []).toHaveLength(1)
  })

  it('keeps ::selection legible over KaTeX in both themes', () => {
    // The explicit `color` is the load-bearing declaration: it applies to every
    // element including the hundreds of spans KaTeX builds per display
    // equation, and a selection split across a line break would otherwise be
    // half accent ink and half prose colour — a highlight that reads as a
    // rendering fault. Pinning the foreground makes the wash a background
    // change only.
    const body = ruleBody('::selection')
    expect(body).toMatch(/background-color:\s*color-mix\(in srgb, var\(--c-accent\) 22%, transparent\)/)
    expect(body).toMatch(/color:\s*var\(--c-fg\)/)
    for (const [name, vars] of THEMES) {
      // Legible: the glyphs on the wash are the normal, contrast-guarded text
      // colour, so this is exactly the text-on-surface contract applied to a
      // background the reader chose.
      expect(selectionContrast(vars), `${name}: fg on selection`).toBeGreaterThanOrEqual(4.5)
      // And visible, which is a different requirement: a selection the same
      // luminance as the page is not a selection at all.
      expect(selectionVisibility(vars), `${name}: selection vs surface`).toBeGreaterThan(1.12)
    }
  })
})

/* ------------------------------------------------------------------ *
 * Colour maths for the two measured assertions above. The same
 * definitions as `contrast.test.ts`, kept local so this file does not
 * have to reach into another test's internals.
 * ------------------------------------------------------------------ */

type Channels = [number, number, number]

function themeVars(selector: string): Record<string, Channels> {
  const start = CSS.search(new RegExp(`^${selector.replace('.', '\\.')}\\s*\\{`, 'm'))
  expect(start, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(-1)
  const open = CSS.indexOf('{', start)
  const vars: Record<string, Channels> = {}
  for (const m of CSS.slice(open, CSS.indexOf('\n}', open)).matchAll(/--c-([a-z0-9-]+)-ch:\s*(\d+)\s+(\d+)\s+(\d+);/g)) {
    vars[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])]
  }
  return vars
}

const THEMES = [
  ['light', themeVars(':root')],
  ['dark', themeVars('.dark')],
] as const

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

/** Composite one channel triple over another at a given alpha. */
function over(fg: Channels, bg: Channels, alpha: number): Channels {
  return [0, 1, 2].map(
    (i) => Math.round(alpha * fg[i] + (1 - alpha) * bg[i]),
  ) as Channels
}

/**
 * `--c-fg` on the wash `::selection` paints — the accent at 22% over the
 * surface. This is the pair that has to clear 4.5:1 in both themes, because
 * the selection is now painted on top of every element in the document
 * including the KaTeX spans, and a highlight a reader cannot read is not a
 * highlight.
 */
function selectionContrast(vars: Record<string, Channels>): number {
  return contrast(vars.fg, over(vars.accent, vars.surface, 0.22))
}

/**
 * The touch-visible heading anchor: `--c-fg-subtle` at the `0.8` the
 * `(hover: none)` rule uses, over the canvas. A non-text control is held to
 * 3:1 rather than 4.5:1, and the number is asserted rather than assumed —
 * 0.7 looks the same and is 2.76:1 in light, which is why it is not the one.
 */
const ANCHOR_TOUCH_OPACITY = 0.8
function anchorContrast(vars: Record<string, Channels>): number {
  return contrast(over(vars['fg-subtle'], vars.bg, ANCHOR_TOUCH_OPACITY), vars.bg)
}

/** The selection has to be VISIBLE, not just legible: a different luminance. */
function selectionVisibility(vars: Record<string, Channels>): number {
  return contrast(over(vars.accent, vars.surface, 0.22), vars.surface)
}
