/**
 * The section splitter, and the property every note in the course has to
 * satisfy for the sketch/full toggle to work at all.
 *
 * The failure this guards is specific and was measured, not imagined: a note
 * with no `##` heading, or a section whose prose disappears, or a summary
 * fence that never closes. Each produces a lecture that renders as a wall of
 * text with a toggle that reveals nothing, and each renders without an error.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { cleanup, render } from '@testing-library/react'
import {
  splitSections,
  extractSummary,
  deriveSummary,
  summaryItems,
  headingAnchor,
  SUMMARY_LANG,
  type LectureSection,
} from '../content/lectureSections'
import { contentsHeadings } from '../content/markdownComponents'
import { LectureBody } from '../components/LectureBody'

afterEach(cleanup)

const NOTES_DIR = join(process.cwd(), '..', 'content', 'lecture_notes')
const noteFiles = readdirSync(NOTES_DIR)
  .filter((f) => /^Lecture_\d+\.md$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]))

const readNote = (f: string) => readFileSync(join(NOTES_DIR, f), 'utf8')
/** The loader strips the title heading; the tests do the same. */
const body = (f: string) => readNote(f).replace(/^\s*#\s+Lecture\s+\d+:.*(\r?\n)?/i, '')

describe('splitSections', () => {
  it('splits on ## and keeps every heading', () => {
    const md = '## One\n\na\n\n## Two\n\nb\n'
    const sections = splitSections(md)
    expect(sections.map((s) => s.heading)).toEqual(['One', 'Two'])
    expect(sections[0].detail).toBe('a')
    expect(sections[1].detail).toBe('b')
  })

  it('keeps a preamble before the first heading as a section with no heading', () => {
    const sections = splitSections('intro text\n\n## One\n\na\n')
    expect(sections).toHaveLength(2)
    expect(sections[0].heading).toBe('')
    expect(sections[0].detail).toBe('intro text')
    expect(sections[1].heading).toBe('One')
  })

  it('takes a numbered heading\'s ordinal OFF the heading, not on top of it', () => {
    // The card renders the ordinal in its own column. If the heading kept its
    // number too, section 1 would read "11. What is Macroeconomics?".
    const sections = splitSections('## 3. The Goods Market\n\nx\n')
    expect(sections[0].ordinal).toBe('3')
    expect(sections[0].heading).toBe('The Goods Market')
  })

  it('leaves an unnumbered heading\'s ordinal null', () => {
    expect(splitSections('## Overview\n\nx\n')[0].ordinal).toBeNull()
  })

  it('does not split on a ## inside a fenced block', () => {
    // These notes teach markdown by showing markdown, and a lesson that opens
    // a fence containing a heading would otherwise be cut in half.
    const md = ['## Real', '', '```md', '## Not a heading', '```', '', 'more'].join('\n')
    const sections = splitSections(md)
    expect(sections).toHaveLength(1)
    expect(sections[0].detail).toContain('## Not a heading')
  })

  it('gives every section a unique id', () => {
    const sections = splitSections('## A\n\nx\n\n## A\n\ny\n')
    expect(new Set(sections.map((s) => s.id)).size).toBe(sections.length)
  })

  it('returns nothing for an empty body', () => {
    expect(splitSections('')).toEqual([])
    expect(splitSections('   \n\n  \n')).toEqual([])
  })

  it('anchors a heading on the whole `##` line, number included', () => {
    // The contents strips the number from the LABEL but keeps it in the
    // fragment, because that is what `slugify` did to the raw line before
    // either existed. Matching the label instead would renumber every anchor
    // in the course and break any URL a reader has bookmarked.
    expect(splitSections('## 3. The Goods Market\n\nx\n')[0].anchor).toBe(
      '3-the-goods-market',
    )
    expect(splitSections('## Overview\n\nx\n')[0].anchor).toBe('overview')
  })

  it('strips emphasis and math markers, as the contents side does', () => {
    // The contents prints the label with `[*_`$]` removed, so the fragment has
    // to drop the same characters or the two disagree on the same line.
    expect(headingAnchor('4. The Natural Rate ($u_n$)')).toBe(
      '4-the-natural-rate-un',
    )
    expect(headingAnchor('2. Mundell-Fleming (**73%**)')).toBe('2-mundell-fleming-73')
  })
})

/**
 * The property that was false on all 25 notes and that nothing detected.
 *
 * `LectureSectionCard` took its heading id from React's `useId()` while
 * `contentsHeadings` took its from a slug of the markdown, so the "On this
 * page" rail and the mobile disclosure listed real-looking links that resolved
 * to nothing, and `useScrollSpy` — which observes `getElementById` — found no
 * elements and left the first entry marked current for the whole lecture.
 * Every page looked finished and none of its navigation worked, which is why
 * 769 tests did not see it: each side was correct on its own.
 *
 * The assertion is the join, not either half.
 */
describe('every section the contents lists has a heading that answers to it', () => {
  it('agrees on every anchor in all 25 notes', () => {
    for (const f of noteFiles) {
      const md = body(f)
      const listed = contentsHeadings(md).map((h) => h.id)
      const rendered = splitSections(md)
        .filter((s) => s.heading)
        .map((s) => s.anchor)
      expect(
        listed,
        `${f}: the contents lists ${listed.length} targets and the page renders ${rendered.length} headings — the two are built from different functions and have drifted`,
      ).toEqual(rendered)
    }
  })

  it('leaves no duplicate fragments, so a link cannot land on the wrong section', () => {
    for (const f of noteFiles) {
      const anchors = splitSections(body(f))
        .filter((s) => s.heading)
        .map((s) => s.anchor)
      const dupes = anchors.filter((a, i) => anchors.indexOf(a) !== i)
      expect(dupes, `${f} has two sections answering to the same #fragment`).toEqual([])
    }
  })

  it('gives a heading-bearing section a heading even with no ordinal', () => {
    // A `##` with no number and a `##` with a number render as the same kind
    // of card, and the unnumbered one is the one most likely to be forgotten
    // when the anchor is being worked out by hand.
    const sections = splitSections('## Overview\n\na\n\n## 1. Later\n\nb\n')
    expect(sections.filter((s) => s.heading).map((s) => s.anchor)).toEqual([
      'overview',
      '1-later',
    ])
  })

  it('puts the anchor on the DOM, which is the half a source-only check misses', () => {
    // The two tests above compare markdown to markdown. This one closes the
    // chain: what the reader clicks has to be what the page rendered, and a
    // card that reached for `useId()` — which is what every one of these
    // lectures did — passes both of the others and still leaves a dead rail.
    for (const f of ['Lecture_1.md', 'Lecture_16.md', 'Lecture_25.md']) {
      const md = body(f)
      const { container, unmount } = render(createElement(LectureBody, { markdown: md }))
      const rendered = [...container.querySelectorAll('h2')].map((h) => h.id)
      expect(rendered, `${f}: a heading on the page answers to no listed target`).toEqual(
        contentsHeadings(md).map((h) => h.id),
      )
      expect(rendered, `${f}: a heading kept a React useId() instead of a slug`)
        .not.toContainEqual(expect.stringContaining(':r'))
      unmount()
    }
  })
})

describe('extractSummary', () => {
  const fence = ['```' + SUMMARY_LANG, '- one', '- two', '```'].join('\n')

  it('lifts an authored summary out of the detail', () => {
    const { summary, detail, derived } = extractSummary(['## x', '', fence, '', 'prose'].join('\n'))
    expect(derived).toBe(false)
    expect(summaryItems(summary)).toEqual(['one', 'two'])
    expect(detail).toContain('prose')
    expect(detail).not.toContain('- one')
  })

  it('accepts a tilde fence and a longer fence', () => {
    const tilde = ['~~~~summary', '- one', '~~~~'].join('\n')
    expect(extractSummary(tilde).summary).toBe('- one')
  })

  it('derives from the prose when there is no authored summary, and says so', () => {
    const prose = ['- **Term**: a claim.', '', 'A paragraph with no bullets.', '', '- **Other**: b.'].join('\n')
    const { summary, detail, derived } = extractSummary(prose)
    expect(derived).toBe(true)
    expect(summaryItems(summary)).toEqual(['**Term**: a claim.', '**Other**: b.'])
    // A derived summary is drawn from the prose, so the prose must survive.
    expect(detail).toContain('A paragraph with no bullets.')
  })

  it('keeps a nested bullet in a derived summary', () => {
    const prose = '- **Top**: a\n  - nested detail'
    expect(summaryItems(deriveSummary(prose))).toEqual(['**Top**: a'])
  })

  it('reports a detail that is empty when the whole section was the summary', () => {
    const { detail } = extractSummary(fence)
    expect(detail).toBe('')
  })
})

/**
 * The property over all 25 notes. A note that breaks it renders as prose with
 * a toggle that reveals nothing, which is why it has never failed loudly.
 */
describe('every lecture note can be read either way', () => {
  const sectionsFor = (f: string): LectureSection[] => splitSections(body(f))

  it('covers all 25 notes', () => {
    expect(noteFiles).toHaveLength(25)
  })

  it('splits every note into at least two sections', () => {
    for (const f of noteFiles) {
      expect(sectionsFor(f).length, `${f} produced no usable sections`).toBeGreaterThanOrEqual(2)
    }
  })

  it('gives every section a summary, so a collapsed section is never blank', () => {
    for (const f of noteFiles) {
      for (const s of sectionsFor(f)) {
        // The preamble renders as prose and carries no toggle, so it is the
        // one section allowed to have no summary.
        if (!s.heading) continue
        expect(
          summaryItems(s.summary).length,
          `${f} § "${s.heading}" has no bullet to show a reader who wants the sketch`,
        ).toBeGreaterThan(0)
      }
    }
  })

  it('keeps every heading-bearing section\'s detail non-empty, or has no toggle to dead-end on', () => {
    for (const f of noteFiles) {
      for (const s of sectionsFor(f)) {
        if (!s.heading) continue
        expect(s.detail.trim().length, `${f} § "${s.heading}" has prose the toggle cannot reach`).toBeGreaterThan(0)
      }
    }
  })

  it('never loses a character of prose: the summary is a view, not a replacement', () => {
    // A whole-note invariant rather than a per-section one: the risk is that
    // the SPLITTER drops a chunk, and a per-section check would not see it,
    // because a line belonging to section 4 is not supposed to appear in
    // section 1. Every line of prose must survive somewhere.
    for (const f of noteFiles) {
      const sections = sectionsFor(f)
      const kept = sections.map((s) => `${s.detail}\n${s.summary}`).join('\n')
      for (const line of body(f).split('\n')) {
        const t = line.trim()
        if (!t || t.startsWith('##') || t.startsWith('```')) continue
        expect(kept, `${f} dropped a line: ${t.slice(0, 60)}`).toContain(t)
      }
    }
  })

  it('has an authored summary on every section, not only a derived one', () => {
    // A derived summary is the section's own bold-lead bullets, so a note
    // that relies on it throughout still works — but the *toggle* is only
    // worth having when the sketch is a deliberate list of claims, and this is
    // the assertion that makes the authoring work visible. Reported per note
    // rather than as a ratio, because a ratio lets one well-authored note hide
    // twenty that are not.
    const derivedByNote = noteFiles.map((f) => ({
      file: f,
      derived: sectionsFor(f).filter((s) => s.heading && s.derived).length,
    }))
    const total = derivedByNote.reduce((n, x) => n + x.derived, 0)
    expect(
      total,
      `sections still on a derived summary, by note: ${derivedByNote
        .filter((x) => x.derived > 0)
        .map((x) => `${x.file}=${x.derived}`)
        .join(' ')}`,
    ).toBe(0)
  })
})
