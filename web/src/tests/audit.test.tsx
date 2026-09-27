/**
 * The quality pass's regression guard.
 *
 * Everything asserted here is something that WAS broken and was measured
 * broken, either in a browser or through the real markdown pipeline. A guard
 * that only asserts what was already true is a test that cannot fail, and a
 * test that cannot fail is worse than no test because it is counted.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import { visit } from 'unist-util-visit'
import { promoteDisplayMath } from '../content/markdownComponents'
import { applyScenarioParams, clearControls, registerControl, snapshotControls } from '../lib/controlRegistry'
import { lecturesTeaching, lectureNumbersFor } from '../lib/taughtIn'
import { LECTURES, type ToolId } from '../../../content/lectures'

const NOTES = join(__dirname, '..', '..', '..', 'content', 'lecture_notes')
const CSS = readFileSync(join(__dirname, '..', 'index.css'), 'utf8')

/* ================================================================== *
 * 1. A currency dollar can never sit inside inline math
 * ================================================================== */

/** The mdast root, without importing `mdast` types for one annotation. */
type Mdast = ReturnType<ReturnType<typeof unified>['parse']>

function parseNotes(md: string): Mdast {
  const p = unified().use(remarkParse).use(remarkGfm).use(remarkMath)
  return p.parse(promoteDisplayMath(md)) as Mdast
}

function renderNotes(md: string): Mdast {
  const p = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
  return p.runSync(p.parse(promoteDisplayMath(md))) as Mdast
}

describe('a currency dollar is never a math delimiter', () => {
  /**
   * Every one of these is a way the `Lecture_8.md:207` defect recurred, named
   * after what the READER SAW, not after the syntax. Each was measured in
   * Chromium against a production build before the repair.
   */
  const observed = [
    // `$W = \$20/hour$` — the escape is inside the span, so the `$` after the
    // backslash CLOSES it, and the next `$` opens a runaway. The reader got
    // `Workers won't accept W = \20/hour$` and, on the next line, the whole
    // phrase `to maintain constant real wage` swallowed into one equation.
    'unescaped-dollars',
    // `$\$0.5 \text{B}$` — a leading `$$` opened a math span and the rest was
    // swallowed; `Lecture_3.md:268` showed the reader literal `$\$0.5 \text{B}$`.
    'doubled-delimiter',
    // `$200,000$` after prose text — two currency amounts paired with each
    // other, so `$100 + $200` rendered as the equation `100 +` and the dollar
    // signs vanished.
    'paired-currency',
    // `$P = 1.25 \times 20 = \$25$` — a real equation with a currency amount
    // welded to the end of it, which is the one shape that cannot be repaired
    // by escaping alone.
    'trailing-currency',
  ] as const

  it('no note renders a backslash into its prose', () => {
    // The single loudest symptom, and the cheapest to assert. If a math span
    // closed early, the LaTeX that followed it becomes a TEXT node, and a text
    // node in a lecture is the reader's sentence. There is no legitimate
    // backslash in the prose of these notes.
    const offenders: string[] = []
    for (const file of readdirSync(NOTES).filter((f) => f.endsWith('.md'))) {
      visit(parseNotes(readFileSync(join(NOTES, file), 'utf8')) as never, (node: never) => {
        const n = node as { type: string; value?: string }
        if (n.type === 'text' && typeof n.value === 'string' && n.value.includes('\\')) {
          offenders.push(`${file}: ${JSON.stringify(n.value.slice(0, 60))}`)
        }
      })
    }
    expect(offenders, `a math span closed early in:\n${offenders.join('\n')}`).toEqual([])
  })

  it.each(observed)('no inline math span is a mis-paired currency amount (%s)', () => {
    const offenders: string[] = []
    for (const file of readdirSync(NOTES).filter((f) => f.endsWith('.md'))) {
      visit(parseNotes(readFileSync(join(NOTES, file), 'utf8')) as never, (node: never) => {
        const n = node as { type: string; value?: string }
        if (n.type !== 'inlineMath') return
        const v = n.value ?? ''
        // Commands are masked before the prose test, because `\approx pr` is
        // mathematics and `Car workers (` is a panel heading.
        const masked = v.replace(/\\[a-zA-Z]+/g, '§')
        // KaTeX has no currency command (`\textdollar` and `\mathdollar` both
        // fail, measured), so an escaped dollar can only ever mean "a `$`
        // closed this span early".
        const why =
          v.includes('\\$')
            ? 'escaped-dollar-inside-inline-math'
            : /\\$/.test(v)
              ? 'truncated-at-backslash'
              : // A comma-grouped number is never the first token of real
                // mathematics here; it is a currency amount acting as a
                // delimiter, paired with the next `$` on the line.
                /^\d{1,3},\d/.test(v)
                ? 'currency-amount-opened-the-span'
                : // A number followed by a lowercase word is prose that got
                  // scanned as maths: `$300 to $200` renders as `300 to `.
                  /^\d[\d,.]*\s+[a-z]{2,}/.test(v)
                  ? 'number-then-word'
                  : // Two adjacent lowercase words.
                    /[a-z]{2,}\s+[a-z]{2,}/.test(masked) &&
                    !/\\text|\\underbrace/.test(v)
                    ? 'prose-inside-math'
                    : null
        if (why) offenders.push(`${file}: inlineMath(${JSON.stringify(v.slice(0, 50))}) — ${why}`)
      })
    }
    expect(offenders, `currency used as a math delimiter in:\n${offenders.join('\n')}`).toEqual([])
  })

  it('no note fails to render its mathematics', () => {
    const errors: string[] = []
    for (const file of readdirSync(NOTES).filter((f) => f.endsWith('.md'))) {
      visit(renderNotes(readFileSync(join(NOTES, file), 'utf8')) as never, (node: never) => {
        const n = node as { properties?: { className?: unknown } }
        const cn = n.properties?.className
        if (Array.isArray(cn) && cn.map(String).includes('katex-error')) errors.push(file)
      })
    }
    expect(errors, 'KaTeX could not parse a span').toEqual([])
  })
})

/* ================================================================== *
 * 2. The comment that said the minifier eats selectors was false
 * ================================================================== */

describe('no comment claims a minifier behaviour this toolchain does not have', () => {
  /**
   * Measured with the project's own esbuild (0.21.5, driven by Vite 5.4.21):
   * adjacent rules with identical declaration blocks are MERGED and every
   * selector survives; rules that are not adjacent are left alone; and the
   * grouped and separate-per-selector forms minify to byte-identical output.
   * So the claim that a grouped selector list "ships as its last selector
   * only" is false, and a comment repeating it is a false statement in the
   * source about the artefact the source produces.
   */
  const falseClaims = [
    /collapses? a rule\s+whose selectors/i,
    /ships only the last/i,
    /ship as (its|the) last selector/i,
    /truncating minifier/i,
    /minifier cannot drop/i,
    /the minifier would ship/i,
    /disappears in production/i,
  ]

  it('index.css makes none of them', () => {
    const offenders: string[] = []
    CSS.split('\n').forEach((line, i) => {
      for (const claim of falseClaims) {
        if (claim.test(line)) offenders.push(`index.css:${i + 1}: ${line.trim()}`)
      }
    })
    expect(offenders, `false minifier claims in:\n${offenders.join('\n')}`).toEqual([])
  })
})

/* ================================================================== *
 * 3. The sticky header is 3.5rem and moves with the text scale
 * ================================================================== */

describe('the sticky header offset is stated in the unit that survives a text scale', () => {
  it('does not claim a fixed pixel height for the header', () => {
    // `h-14` is 3.5rem, which is 50.4px at textScale 0.9, 56px at 1 and 72.8px
    // at 1.3. A `top: 56px` would be correct on exactly one of those and wrong
    // on the other two, and wrong in the direction that puts content under a
    // bar that is now taller than the offset reserved for it.
    const offenders = CSS.split('\n')
      .map((line, i) => [i + 1, line] as const)
      .filter(([, line]) => /sticky header/i.test(line) && /\b56px\b/.test(line))
    expect(offenders.map(([n]) => n)).toEqual([])
  })
})

/* ================================================================== *
 * 4. Display type can wrap
 * ================================================================== */

describe('a display heading can wrap inside its column', () => {
  it('carries a wrap policy, and it is `break-word` rather than `anywhere`', () => {
    // Measured in Chromium before the fix: "Macroeconomics" is 357px of
    // 44.2px type against a 278px column at a 320px viewport with the reader's
    // text at 130%, which put 57px of the document past the viewport at 320
    // and 17px at 360. The overflow only existed at text sizes above 100% —
    // the case a reader asks for and the one where a broken frame does the
    // most harm.
    const block = /:where\(([^)]*text-display[^)]*)\)\s*\{([^}]*)\}/.exec(CSS)
    expect(block, 'no wrap policy on the display sizes').not.toBeNull()
    const [, selectors, body] = block as unknown as [string, string, string]
    for (const size of ['.text-display-sm', '.text-display-md', '.text-display-lg']) {
      expect(selectors).toContain(size)
    }
    expect(body).toMatch(/hyphens:\s*auto/)
    expect(body).toMatch(/overflow-wrap:\s*break-word/)
    // `anywhere` also lowers the box's min-content width, which a heading
    // does not need: it needs to wrap. `index.css` states that same
    // distinction for `:where(a, code, …)` and the two must not disagree.
    expect(body).not.toMatch(/overflow-wrap:\s*anywhere/)
  })
})

/* ================================================================== *
 * 5. The article header and the prose share one box
 * ================================================================== */

describe('the lecture page has one reading column, not two widths', () => {
  it('puts the article header inside the article column', () => {
    // The header used to sit above the `flex items-start gap-10` row as a
    // sibling of the contents rail, so it was as wide as the page and
    // `max-w-3xl` capped it at 768px while the prose beside it was capped by
    // the column — 678px at a 1280px viewport. One document, two right-hand
    // edges, 90px apart, measured. Worse, 768px is WIDER than the reader's own
    // maximum measure (70ch = 750.72px), so the widest block on the page was
    // the one block that ignored the settings panel's promise.
    const source = readFileSync(join(__dirname, '..', 'pages', 'LecturePage.tsx'), 'utf8')
    const column = source.indexOf('className="min-w-0 flex-1"')
    expect(column, 'no article column found').toBeGreaterThan(-1)
    const header = source.indexOf('<header className="reading-col')
    const rail = source.indexOf('<TableOfContents')
    expect(header, 'the header must be a reading-col').toBeGreaterThan(-1)
    expect(header, 'the header must be inside the article column').toBeGreaterThan(column)
    expect(header, 'the header must come before the contents rail').toBeLessThan(rail)
  })

  it('gives every block in the article the reading measure, not a fixed width', () => {
    // Six `max-w-3xl` meant the reading-width preference did nothing for the
    // header, the prediction, the video block, the quiz or the prev/next.
    const source = readFileSync(join(__dirname, '..', 'pages', 'LecturePage.tsx'), 'utf8')
    // Matched inside a className only: the width is named in the comment above
    // the header, which is where the reader of this file learns why it is gone.
    expect(source, 'a fixed 48rem column is still in the article').not.toMatch(
      /className="[^"]*max-w-3xl/,
    )
    expect((source.match(/reading-col/g) ?? []).length).toBeGreaterThanOrEqual(7)
  })
})

/* ================================================================== *
 * 6. The share link round-trips
 * ================================================================== */

describe('the scenario link carries the controls and restores them', () => {
  const control = (key: string, min: number, max: number, value: number) =>
    registerControl({ key, min, max, get: () => value, set: () => {} })

  it('encodes what the controls hold', () => {
    clearControls()
    control('G', 50, 150, 120)
    control('T', 20, 80, 35)
    expect(snapshotControls()).toEqual({ G: 120, T: 35 })
    clearControls()
  })

  it('clamps an arriving value to the bounds of the control it names', () => {
    clearControls()
    const set = vi.fn()
    registerControl({ key: 'beta', min: 2, max: 20, get: () => 10, set })
    // A hand-edited or stale link. Measured before the repair: nothing
    // clamped, and the model received a number its own slider cannot show.
    applyScenarioParams({ beta: 9999 })
    expect(set).toHaveBeenCalledWith(20)
    set.mockClear()
    applyScenarioParams({ beta: -5 })
    expect(set).toHaveBeenCalledWith(2)
    clearControls()
  })

  it('refuses an ambiguous key rather than guessing which panel owns it', () => {
    // `IsLmExplorer` has two "Government Spending (G)" sliders with DIFFERENT
    // bounds (50-150 in the IS panel, 50-200 in the comparison panel), so one
    // label cannot name one parameter. Encoding whichever mounted last would
    // produce a link that opens, looks authoritative, and configures the wrong
    // panel.
    clearControls()
    const a = { key: 'G', min: 50, max: 150, get: () => 100, set: vi.fn() }
    const b = { key: 'G', min: 50, max: 200, get: () => 120, set: vi.fn() }
    const offA = registerControl(a)
    const offB = registerControl(b)
    expect(snapshotControls()).toEqual({})
    applyScenarioParams({ G: 140 })
    expect(a.set).not.toHaveBeenCalled()
    expect(b.set).not.toHaveBeenCalled()
    offA()
    offB()
    clearControls()
  })

  it('spends a key once, so a remount is not driven twice', () => {
    clearControls()
    const set = vi.fn()
    registerControl({ key: 'M', min: 0, max: 10, get: () => 1, set })
    const spent = new Set<string>()
    applyScenarioParams({ M: 7 }, spent)
    applyScenarioParams({ M: 7 }, spent)
    expect(set).toHaveBeenCalledTimes(1)
    clearControls()
  })

  it('leaves the tool alone for a link naming another tool', () => {
    clearControls()
    const set = vi.fn()
    registerControl({ key: 'P', min: 0, max: 1, get: () => 0.5, set })
    // `ToolPage` only calls `applyScenarioParams` when
    // `incoming.toolId === toolId`; this pins the payload shape that check
    // depends on, so a codec change cannot make it vacuous.
    expect({ toolId: 'gdp-visualizer', params: { P: 0.9 } }.toolId).not.toBe('is-lm-explorer')
    expect(set).not.toHaveBeenCalled()
    clearControls()
  })
})

/* ================================================================== *
 * 7. The "Taught in" lookup is indexed, not rescanned
 * ================================================================== */

describe('the taught-in lookup is built once', () => {
  it('returns the same lectures a per-call filter would', () => {
    // The memo replaced `LECTURES.filter((l) => l.tools.includes(toolId))` run
    // per card: 20 cards x 25 lectures x the tools array, on every render of
    // the index and on every keystroke of its filter box. The assertion is
    // equality with the original expression, so the optimisation cannot
    // quietly change the answer.
    for (const lecture of LECTURES) {
      for (const toolId of lecture.tools) {
        const expected = LECTURES.filter((l) => l.tools.includes(toolId)).map((l) => l.n)
        expect(lectureNumbersFor(toolId as ToolId)).toEqual(expected)
      }
    }
  })

  it('answers "no lecture teaches this" with an empty list', () => {
    expect(lecturesTeaching('not-a-real-tool' as ToolId)).toEqual([])
  })
})
