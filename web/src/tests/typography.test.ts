import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import tailwind from '../../tailwind.config'
import { LINE_HEIGHT_VALUE, MEASURE_CH, TEXT_SCALES } from '../lib/preferences'

/**
 * The typography contract, asserted against the stylesheet and the Tailwind
 * theme rather than against a rendering. Everything here exists because one
 * of these properties silently stopped working and nothing failed.
 *
 * The two that had actually gone inert:
 *
 *  - `--pref-line-height` reached `body` and stopped. `.prose-lecture` pinned
 *    `line-height: 1.75`, so choosing `tight` or `relaxed` changed the
 *    navigation and left every paragraph of every lecture exactly as it was.
 *    Measured on `/lecture/16` at `--pref-line-height: 1.4` and `1.8`: the
 *    computed line height was 29.75px in both cases.
 *
 *  - `--pref-measure` reached `.prose-lecture` and `.note__body` and stopped.
 *    The page header, the deck under every title, and the case-study summary
 *    were all on a hard-coded `max-w-3xl`, which is a `rem` width: at 130%
 *    text the header was 923px wide while the body column beside it was
 *    580px, and the two no longer shared a left edge or a right edge.
 *
 * The other one is a trap rather than a bug. `--pref-text-scale` multiplies
 * the root font size, so every `rem` and `em` in the site already follows it
 * — Tailwind v3's own `fontSize` scale is `rem` too. A `px` anywhere in the
 * type scale would be the one label on the page that refused to grow, and it
 * would be invisible in review, so it is asserted here.
 */

const SRC = join(__dirname, '..')
const CSS = readFileSync(join(SRC, 'index.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

type FontSizeEntry = [string, Record<string, string>]

/**
 * The Tailwind `fontSize` scale, typed. `Config['theme']` is a deep partial of
 * a much wider theme type, so the entries come back as a union of array
 * shapes; this is the one place that is narrowed, rather than at each use.
 */
function fontSizeScale(): Record<string, FontSizeEntry> {
  return (tailwind.theme.extend.fontSize ?? {}) as unknown as Record<string, FontSizeEntry>
}

/** The body of the first top-level rule with this exact selector. */
function ruleBody(selector: string): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const start = CSS.search(new RegExp(`^${escaped}\\s*\\{`, 'm'))
  expect(start, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(-1)
  const open = CSS.indexOf('{', start)
  return CSS.slice(open, CSS.indexOf('\n}', open))
}

function decl(selector: string, name: string): string {
  const found = ruleBody(selector).match(new RegExp(`${name}:\\s*([^;]+);`))
  expect(found, `${selector}: ${name}`).not.toBeNull()
  return (found as RegExpMatchArray)[1].replace(/\s+/g, ' ').trim()
}

/**
 * The body of an `@media print { ... }` block, matched to its closing brace
 * rather than to the first `}` so the nested rules inside it do not truncate
 * the result.
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
 * Evaluate a `--read-*` expression for one value of `--pref-line-height`. The
 * expressions are restricted to `calc(var(--pref-line-height, D) * M)` and
 * `calc(var(--pref-line-height, D) / M)`, so this does not have to be a real
 * CSS engine — it has to be honest about the three numbers the reader can
 * actually pick.
 */
function readVar(name: string, lineHeight: string): number {
  const expression = decl(':root', name)
  const match = expression.match(
    /^calc\(var\(--pref-line-height,\s*([\d.]+)\)\s*([*/])\s*([\d.]+)\)$/,
  )
  expect(match, `--read-* must be a single calc() over --pref-line-height: ${expression}`).not.toBeNull()
  const [, fallback, operator, factor] = match as RegExpMatchArray
  const base = lineHeight === '' ? Number(fallback) : Number(lineHeight)
  return operator === '*' ? base * Number(factor) : base / Number(factor)
}

describe('the reading scale is a function of the reader\'s leading', () => {
  it('derives both reading variables from --pref-line-height alone', () => {
    // Not preferences themselves: nothing writes them, and they must stay out
    // of the persistence contract, which is why they are not in
    // `lib/preferences.ts`. They exist so the prose, the block rhythm and the
    // heading gaps all move together instead of being re-declared per surface.
    expect(decl(':root', '--read-lead')).toMatch(/^calc\(var\(--pref-line-height/)
    expect(decl(':root', '--read-line')).toMatch(/^calc\(var\(--pref-line-height/)
  })

  it('resolves to the values the site used before preferences existed', () => {
    // `normal` must be a page nobody can tell apart from the old one, or the
    // preference has changed the default reading experience rather than
    // offering one.
    const normal = LINE_HEIGHT_VALUE.normal
    expect(readVar('--read-lead', normal)).toBeCloseTo(1, 5)
    expect(readVar('--read-line', normal)).toBeCloseTo(1.75, 5)
  })

  it('gives all three settings a distinct prose leading, in order', () => {
    const lines = (Object.keys(LINE_HEIGHT_VALUE) as (keyof typeof LINE_HEIGHT_VALUE)[]).map(
      (key) => readVar('--read-line', LINE_HEIGHT_VALUE[key]),
    )
    expect(lines[0]).toBeLessThan(lines[1])
    expect(lines[1]).toBeLessThan(lines[2])
    expect(new Set(lines).size).toBe(3)
  })

  it('opens the block rhythm with the leading, so relaxed is not just taller', () => {
    // A `relaxed` reader who also gets proportionally larger gaps gets a page
    // that reads as an endless scroll. The block gap is a smaller multiple of
    // the leading change than the leading itself.
    const leads = (Object.keys(LINE_HEIGHT_VALUE) as (keyof typeof LINE_HEIGHT_VALUE)[]).map(
      (key) => readVar('--read-lead', LINE_HEIGHT_VALUE[key]),
    )
    expect(leads[0]).toBeLessThan(1)
    expect(leads[1]).toBeCloseTo(1, 5)
    expect(leads[2]).toBeGreaterThan(1)
  })
})

describe('--pref-line-height reaches the surfaces that hold text', () => {
  it('is not shadowed by a hard-coded leading on the lecture body', () => {
    // The defect this replaces. `.prose-lecture { line-height: 1.75 }` won on
    // source order against `body { line-height: var(--pref-line-height) }` and
    // the control did nothing below the header.
    expect(ruleBody('.prose-lecture')).toMatch(/line-height:\s*var\(--read-line\)/)
    expect(ruleBody('.prose-lecture')).not.toMatch(/line-height:\s*1\.75/)
  })

  it('reaches the note body and the tool deck', () => {
    expect(ruleBody('.note__body')).toMatch(/line-height:\s*calc\(var\(--read-line\)/)
    expect(ruleBody('.tool-description')).toMatch(/line-height:\s*calc\(var\(--read-line\)/)
    // Still on the body, for every element that sets no leading of its own.
    expect(ruleBody('body')).toMatch(/line-height:\s*var\(--pref-line-height/)
  })

  it('scales the block gap and the heading gaps with the leading', () => {
    // `em`, not a fixed rem: the gap has to grow with the type as well as with
    // the leading, or a 130% page keeps 1x paragraph spacing.
    expect(ruleBody('.prose-lecture > * + *')).toMatch(
      /margin-top:\s*calc\([\d.]+em \* var\(--read-lead\)\)/,
    )
    for (const heading of ['h2', 'h3', 'h4']) {
      expect(ruleBody(`.prose-lecture ${heading}`), heading).toMatch(
        /margin-top:\s*calc\([\d.]+em \* var\(--read-lead\)\)/,
      )
    }
  })

  it('keeps the heading gaps proportional to each heading at the default', () => {
    // `2em` on a 1.5rem h2 is the 3rem it was. Asserted as the ratio so a
    // future edit to the heading size cannot quietly break the relationship
    // between the two declarations.
    const size = (heading: string): number => {
      const found = ruleBody(`.prose-lecture ${heading}`).match(/font-size:\s*([\d.]+)rem/)
      expect(found, `${heading} font-size`).not.toBeNull()
      return Number((found as RegExpMatchArray)[1])
    }
    const gap = (heading: string): number => {
      const found = ruleBody(`.prose-lecture ${heading}`).match(
        /margin-top:\s*calc\(([\d.]+)em \* var\(--read-lead\)\)/,
      )
      expect(found, `${heading} margin-top`).not.toBeNull()
      return Number((found as RegExpMatchArray)[1])
    }
    // 2em x 1.5rem = 3rem, 1.5em x 1.1875rem = 2.25rem, and so on: every gap
    // is the old rem value at the default, expressed against its own heading.
    expect(gap('h2') * size('h2')).toBeCloseTo(3, 3)
    expect(gap('h3') * size('h3')).toBeCloseTo(2.25, 3)
    expect(gap('h4') * size('h4')).toBeCloseTo(1.75, 3)
  })
})

describe('--pref-measure reaches every reading column', () => {
  it('is one class, and the prose is its other consumer', () => {
    expect(decl('.reading-col', 'max-width')).toBe('var(--pref-measure, 70ch)')
    expect(decl('.prose-lecture', 'max-width')).toBe('var(--pref-measure, 70ch)')
    expect(decl('.note__body', 'max-width')).toBe('var(--pref-measure, 70ch)')
  })

  it('reaches the tool deck, which is a paragraph and not a panel', () => {
    expect(decl('.tool-description', 'max-width')).toBe('var(--pref-measure, 70ch)')
  })

  it('does not reach a control panel, a chart plate, or a tool card', () => {
    // A 62ch slider panel is not a narrower panel, it is a broken one. These
    // are the rules that would break if `.reading-col` were applied by class
    // name matching rather than deliberately.
    for (const selector of ['.control-panel', '.visualization-container', '.tool-card']) {
      expect(ruleBody(selector), selector).not.toMatch(/var\(--pref-measure/)
    }
  })

  it('covers every value the preference can hold', () => {
    for (const measure of Object.values(MEASURE_CH)) {
      expect(measure).toMatch(/^\d+ch$/)
    }
  })
})

describe('the type scale is in rem, so the text-size preference is real', () => {
  it('has no px font size anywhere in the stylesheet', () => {
    // The root font size is the one thing `--pref-text-scale` moves. A single
    // `font-size: 12px` is the one label on the page that refuses to grow with
    // everything around it.
    expect(CSS).not.toMatch(/font-size:\s*[\d.]+px/)
  })

  it('has no px in the Tailwind fontSize scale', () => {
    for (const [name, [size, options]] of Object.entries(fontSizeScale())) {
      expect(size, name).toMatch(/(rem|em|%)$/)
      // A unitless line height survives the type growing underneath it; a px
      // one would not, and would also make the scale unresponsive to the
      // reader's own browser font size.
      expect(options.lineHeight, name).toMatch(/^[\d.]+$/)
    }
  })

  it('keeps the prose size in the Tailwind scale equal to the prose rule', () => {
    // `text-prose` and `.prose-lecture` are two declarations of one size; a
    // drift between them is a visible half-step at the seam.
    expect(fontSizeScale().prose[0]).toBe(decl('.prose-lecture', 'font-size'))
  })

  it('offers all four text scales, and every one of them is a root multiplier', () => {
    expect(TEXT_SCALES).toEqual([0.9, 1, 1.15, 1.3])
    expect(ruleBody('html')).toMatch(/font-size:\s*calc\(100% \* var\(--pref-text-scale/)
  })

  it('points the maxWidth token at the preference instead of a number', () => {
    const widths = tailwind.theme.extend.maxWidth as Record<string, string>
    expect(widths.prose).toBe('var(--pref-measure, 70ch)')
  })
})

describe('long-form reading: equations, tables, code, and anchors', () => {
  it('never clips a display equation in the block axis', () => {
    // `overflow-y: hidden` next to `overflow-x: auto` made the block a
    // clipping container, which is the wrong thing to be around a
    // `\begin{cases}` (Lecture 5) or a nested `\frac` (Lecture 16). It also
    // cost the block its bottom padding: the stylesheet sizes
    // `::-webkit-scrollbar` at 10px, and a scrolling equation paid all 10px
    // out of 8px of padding.
    const rule = ruleBody('.prose-lecture .katex-display')
    expect(rule).toMatch(/overflow-x:\s*auto/)
    expect(rule).not.toMatch(/overflow-y:\s*hidden/)
    expect(rule).not.toMatch(/overflow:\s*hidden/)
  })

  it('gives a scrolling equation room for the scrollbar it grows', () => {
    const padding = decl('.prose-lecture .katex-display', 'padding')
    const [, , bottom] = padding.split(' ')
    expect(Number.parseFloat(bottom)).toBeGreaterThanOrEqual(0.625)
  })

  it('keeps a swipe across a wide equation or table off the page behind it', () => {
    // On a touch device the default is to chain, which reads as the page
    // sliding out from under your finger.
    for (const selector of ['.prose-lecture .katex-display', '.prose-lecture .table-scroll', '.prose-lecture pre']) {
      expect(ruleBody(selector), selector).toMatch(/overscroll-behavior-x:\s*contain/)
    }
  })

  it('makes the wrapper the only horizontal scroller around a table', () => {
    // `display: block` on a `<table>` made the table a second nested scroll
    // container pinned to `width: 100%`, so the outer wrapper could never be
    // the thing that scrolled and the geometry no longer matched the table.
    expect(ruleBody('.prose-lecture .table-scroll')).toMatch(/overflow-x:\s*auto/)
    expect(ruleBody('.prose-lecture table')).not.toMatch(/display:\s*block/)
    expect(ruleBody('.prose-lecture table')).not.toMatch(/overflow-x:\s*auto/)
  })

  it('breaks a long identifier in code, and only in code', () => {
    // `anywhere` rather than `break-word` for an inline code span: a data
    // series name or a symbol is expected to be one unbreakable token there,
    // and `break-word` leaves it overflowing when it exceeds the column.
    expect(ruleBody('.prose-lecture code')).toMatch(/overflow-wrap:\s*anywhere/)
    expect(ruleBody('.prose-lecture pre code')).toMatch(/overflow-wrap:\s*normal/)
  })

  it('says something when the reader jumps to a heading', () => {
    expect(CSS).toMatch(/\.prose-lecture :target\s*\{/)
    // Interaction-only accent, at the same alpha family `.nav-link.active`
    // uses. Not a coloured left rule and not a numbered top rule, both of
    // which the token contract rejects.
    expect(ruleBody('.prose-lecture :target')).toMatch(
      /background-color:\s*color-mix\(in srgb, var\(--c-accent\)/,
    )
  })

  it('gives selection a colour that is not the page background', () => {
    expect(CSS).toMatch(/::selection\s*\{/)
    expect(ruleBody('::selection')).toMatch(/background-color:/)
  })
})

describe('text wrapping is behind a feature query, and balanced only where it helps', () => {
  it('guards both values, so a browser that knows neither keeps the rest', () => {
    expect(CSS).toMatch(/@supports \(text-wrap: pretty\) \{/)
  })

  it('applies balance to headings and to nothing that is a paragraph', () => {
    const block = CSS.slice(CSS.indexOf('@supports (text-wrap: pretty)'))
    const balanced = block.match(/[^{}]*\{[^}]*text-wrap: balance[^}]*\}/g) ?? []
    expect(balanced.length).toBeGreaterThan(0)
    for (const rule of balanced) {
      expect(rule).not.toMatch(/\bp\b/)
      expect(rule).not.toMatch(/\bli\b/)
    }
  })

  it('applies pretty to the paragraph-level elements', () => {
    const block = CSS.slice(CSS.indexOf('@supports (text-wrap: pretty)'))
    const pretty = block.match(/[^{}]*\{[^}]*text-wrap: pretty[^}]*\}/g) ?? []
    expect(pretty.length).toBe(1)
    for (const selector of ['p', 'li', 'blockquote']) {
      expect(pretty[0], selector).toContain(selector)
    }
  })
})

describe('print still prints a lecture', () => {
  it('unhooks the screen preferences rather than printing them', () => {
    // The root font size is `calc(100% * var(--pref-text-scale))`, so a reader
    // on 130% would otherwise print 11pt body text next to headings and table
    // cells at 1.3x, because those are `rem` and `rem` follows the root.
    const block = printBlock()
    for (const [property, value] of [
      ['--pref-text-scale', '1'],
      ['--pref-line-height', '1.45'],
      ['--pref-measure', 'none'],
    ]) {
      expect(block, property).toMatch(new RegExp(`${property}:\\s*${value.replace('.', '\\.')};`))
    }
  })

  it('still pins the lecture body to 11pt and drops the measure', () => {
    const block = printBlock()
    expect(block).toMatch(/\.prose-lecture \{[^}]*max-width: none;[^}]*font-size: 11pt;/)
  })

  it('does not print the anchor wash or the selection colour', () => {
    // A `:target` block is a grey rectangle beside every heading whose id the
    // printed URL happens to name, and it is the one rule above that would
    // follow the URL into the PDF.
    const block = printBlock()
    expect(block).toMatch(/\.prose-lecture :target \{[^}]*background: none;/)
    expect(block).toMatch(/::selection \{[^}]*background: none;/)
  })

  it('unscrolls what cannot scroll on paper', () => {
    // There is no scrollbar in a PDF, so a code block or a wide table would be
    // cut at the right margin with nothing to indicate it. `.katex-display` is
    // excluded: a KaTeX expression is one unbreakable box.
    const block = printBlock()
    expect(block).toMatch(/\.prose-lecture \.table-scroll,[^}]*overflow: visible;/)
    expect(block).not.toMatch(/\.katex-display,[^}]*overflow: visible;/)
  })
})
