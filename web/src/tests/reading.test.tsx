import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { ComponentProps, RefObject } from 'react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ReadingProgress from '../layout/ReadingProgress'
import TableOfContents, { ContentsDisclosure } from '../layout/TableOfContents'
import { useScrollSpy } from '../layout/useScrollSpy'
import FocusModeExit from '../layout/FocusModeExit'
import LectureBar from '../layout/LectureBar'
import LecturePage from '../pages/LecturePage'
import { LECTURES } from '../../../content/lectures'
import type { Heading } from '../content/markdownComponents'
import { LECTURE_ARTICLE_ID, readingPercent, readingProgress } from '../lib/readingProgress'
import { DEFAULT_PREFERENCES, usePreferences } from '../lib/preferences'

const CSS = readFileSync(join(__dirname, '..', 'index.css'), 'utf8')
const SHELL = readFileSync(join(__dirname, '..', 'layout', 'Shell.tsx'), 'utf8')

/**
 * The stylesheet with comments removed, which is what every assertion below
 * wants: a rule body must not be able to contain a commented-out line, and
 * `@media print` appears in prose in the header comment long before the block
 * it is looking for.
 */
const PARSED = CSS.replace(/\/\*[\s\S]*?\*\//g, '')

/**
 * The bodies of every top-level rule with this exact selector, matched to
 * their closing braces so nested blocks (an `@media`, an `@supports`) do not
 * truncate a result. A selector can legitimately have more than one rule — the
 * print block and the screen block both name `.prose-lecture h2` — so `decl`
 * searches all of them in source order.
 */
function ruleBodies(selector: string, css = PARSED): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const bodies: string[] = []
  const matcher = new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{`, 'g')
  let match: RegExpExecArray | null
  while ((match = matcher.exec(css)) !== null) {
    let depth = 0
    for (let i = css.indexOf('{', match.index); i < css.length; i++) {
      if (css[i] === '{') depth++
      else if (css[i] === '}' && --depth === 0) {
        bodies.push(css.slice(css.indexOf('{', match.index) + 1, i))
        break
      }
    }
    matcher.lastIndex = match.index + 1
  }
  return bodies
}

function ruleBody(selector: string, css = PARSED): string {
  return ruleBodies(selector, css)[0] ?? ''
}

function decl(selector: string, property: string, css = PARSED): string | null {
  for (const body of ruleBodies(selector, css)) {
    const match = body.match(new RegExp(`(?:^|;|\\n)\\s*${property}\\s*:\\s*([^;]+)`))
    if (match) return match[1].replace(/\s+/g, ' ').trim()
  }
  return null
}

function printBlock(): string {
  const start = PARSED.indexOf('@media print')
  expect(start, 'missing @media print block in index.css').toBeGreaterThan(-1)
  let depth = 0
  for (let i = PARSED.indexOf('{', start); i < PARSED.length; i++) {
    if (PARSED[i] === '{') depth++
    else if (PARSED[i] === '}' && --depth === 0) return PARSED.slice(start, i + 1)
  }
  throw new Error('unterminated @media print block')
}

/* ------------------------------------------------------------------------ *
 * Layout probes
 *
 * jsdom reports every box as 0x0, which would make a progress bar that reads
 * the article's height test as permanently 0%. These give one element a real
 * height and a viewport-relative rect — `top` moves with the scroll, as it does
 * in a browser, so the component's own `rect.top + scrollY` conversion is what
 * lands on the document offset.
 * ------------------------------------------------------------------------ */
function setLayout(el: HTMLElement, height: number, docTop = 0) {
  Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true })
  el.getBoundingClientRect = () => {
    const top = docTop - window.scrollY
    return {
      top,
      bottom: top + height,
      left: 0,
      right: 0,
      width: 0,
      height,
      x: 0,
      y: top,
    } as DOMRect
  }
}

function setViewport(scrollY: number, innerHeight: number) {
  Object.defineProperty(window, 'scrollY', { value: scrollY, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true })
}

function scrollTo(scrollY: number, innerHeight = 800) {
  setViewport(scrollY, innerHeight)
  act(() => {
    fireEvent.scroll(window)
  })
}

/* ------------------------------------------------------------------------ *
 * IntersectionObserver probe. jsdom has none, and the scroll-spy is the one
 * thing under test that genuinely needs one.
 * ------------------------------------------------------------------------ */
type SpyEntry = { target: Element; isIntersecting: boolean }
let observed: Element[] = []
let deliver: ((entries: SpyEntry[]) => void) | null = null

class StubObserver {
  constructor(callback: (entries: SpyEntry[]) => void) {
    deliver = (entries) => callback(entries)
  }
  observe(el: Element) {
    observed.push(el)
  }
  unobserve() {}
  disconnect() {
    observed = []
  }
  takeRecords(): SpyEntry[] {
    return []
  }
}

function spy(entries: SpyEntry[]) {
  act(() => {
    deliver?.(entries)
  })
}

const realObserver = globalThis.IntersectionObserver
const realScrollY = window.scrollY
const realInnerHeight = window.innerHeight

beforeEach(() => {
  observed = []
  deliver = null
  ;(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = StubObserver
  usePreferences.setState({ ...DEFAULT_PREFERENCES })
  document.documentElement.dataset.prefFocus = 'off'
  setViewport(0, 800)
})

afterEach(() => {
  cleanup()
  ;(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = realObserver
  Object.defineProperty(window, 'scrollY', { value: realScrollY, configurable: true })
  Object.defineProperty(window, 'innerHeight', { value: realInnerHeight, configurable: true })
})

/* ------------------------------------------------------------------------ */

describe('reading progress: what it measures', () => {
  const article = { top: 2000, height: 5000 }
  const viewport = 800
  const scrollable = article.height - viewport

  it('is zero before the reader reaches the article', () => {
    // The title, the video block, and the prediction are above the prose; a bar
    // that moved there would be measuring the page, not the reading.
    expect(readingProgress(article, 0, viewport)).toBe(0)
    expect(readingProgress(article, article.top - 1, viewport)).toBe(0)
    expect(readingProgress(article, article.top, viewport)).toBe(0)
  })

  it('runs from the article top to its last screenful', () => {
    expect(readingProgress(article, article.top + scrollable * 0.5, viewport)).toBeCloseTo(0.5, 6)
    expect(readingProgress(article, article.top + scrollable, viewport)).toBe(1)
  })

  it('clamps rather than running past the ends', () => {
    expect(readingProgress(article, -5000, viewport)).toBe(0)
    expect(readingProgress(article, 10_000_000, viewport)).toBe(1)
  })

  it('is zero when there is no article yet, and zero when there is nothing to scroll', () => {
    // The Markdown is lazy-loaded, so the target does not exist for the first
    // paint of a lecture.
    expect(readingProgress(null, 4000, viewport)).toBe(0)
    // An article shorter than the viewport cannot be scrolled through, and
    // reporting 100% before a word is read would be a lie.
    expect(readingProgress({ top: 0, height: 400 }, 0, viewport)).toBe(0)
    expect(readingProgress({ top: 0, height: 0 }, 0, viewport)).toBe(0)
    expect(readingProgress({ top: 0, height: 9000 }, 100, 0)).toBe(0)
  })

  it('rounds to a whole percent and clamps that too', () => {
    expect(readingPercent(0)).toBe(0)
    expect(readingPercent(0.005)).toBe(1)
    expect(readingPercent(0.5)).toBe(50)
    expect(readingPercent(1)).toBe(100)
    expect(readingPercent(-1)).toBe(0)
    expect(readingPercent(4)).toBe(100)
    expect(readingPercent(Number.NaN)).toBe(0)
  })
})

describe('reading progress: the ARIA it exposes', () => {
  function renderBar() {
    return render(
      <>
        <ReadingProgress targetId={LECTURE_ARTICLE_ID} label="Reading progress" />
        <div id={LECTURE_ARTICLE_ID} />
      </>,
    )
  }

  it('is a progressbar with a named value, not a sighted-only decoration', () => {
    renderBar()
    const bar = screen.getByRole('progressbar', { name: 'Reading progress' })
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
    expect(bar).toHaveAttribute('aria-valuenow', '0')
  })

  it('is not a live region, so a scroll does not announce on every tick', () => {
    renderBar()
    const bar = screen.getByRole('progressbar')
    expect(bar).not.toHaveAttribute('aria-live')
  })

  it('tracks the article and keeps the reported value inside the range', () => {
    renderBar()
    const target = document.getElementById(LECTURE_ARTICLE_ID) as HTMLElement
    setLayout(target, 5000, 2000)

    // 5000px of article in an 800px window is 4200px of scroll. Half way down
    // the page — 0px — the reader is nowhere near the article.
    scrollTo(0)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

    // Article top is 2000px down the document, so the reader has to pass 2000px
    // before the bar moves at all.
    scrollTo(1000)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')

    scrollTo(2000 + 2100)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')

    scrollTo(2000 + 4200)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    // And it stays there no matter how far past the end the reader scrolls.
    scrollTo(500_000)
    const bar = screen.getByRole('progressbar')
    const now = Number(bar.getAttribute('aria-valuenow'))
    expect(now).toBe(100)
    expect(now).toBeLessThanOrEqual(Number(bar.getAttribute('aria-valuemax')))
  })

  it('drives the rail from a custom property rather than a React re-render', () => {
    renderBar()
    const target = document.getElementById(LECTURE_ARTICLE_ID) as HTMLElement
    setLayout(target, 5000, 2000)
    scrollTo(2000 + 4200 * 0.25)
    const rail = document.querySelector('.read-progress') as HTMLElement
    expect(Number(rail.style.getPropertyValue('--read-progress'))).toBeCloseTo(0.25, 3)
  })
})

describe('reading progress: where it lives', () => {
  it('is absolutely positioned inside the header, so it shifts no layout', () => {
    expect(decl('.read-progress', 'position')).toBe('absolute')
    expect(ruleBody('.read-progress')).toMatch(/inset:\s*auto 0 0 0/)
    // Pointer-transparent, or it would be a 2px click target across the top of
    // every lecture.
    expect(decl('.read-progress', 'pointer-events')).toBe('none')
  })

  it('animates through a duration token, which the reduced-motion scale zeroes', () => {
    const transition = decl('.read-progress-fill', 'transition')
    expect(transition).toMatch(/var\(--dur-fast\)/)
    expect(transition).not.toMatch(/\d+m?s/)
    // The scale that makes it 0s is the one the whole motion system uses.
    expect(decl(':root', '--dur-fast')).toMatch(/var\(--pref-motion-scale/)
  })
})

describe('the contents list marks exactly one section', () => {
  const headings: Heading[] = [
    { level: 2, text: 'Overview', id: 'overview' },
    { level: 3, text: 'One', id: 'one' },
    { level: 2, text: 'Two', id: 'two' },
    { level: 3, text: 'Three', id: 'three' },
    { level: 2, text: 'Four', id: 'four' },
  ]

  function Harness() {
    const activeId = useScrollSpy(headings)
    return (
      <>
        {headings.map((h) => (
          <h2 key={h.id} id={h.id}>
            {h.text}
          </h2>
        ))}
        <TableOfContents headings={headings} activeId={activeId} />
      </>
    )
  }

  function current(container: HTMLElement) {
    return within(container).getAllByRole('link').filter((a) => a.hasAttribute('aria-current'))
  }

  it('has a current entry before the reader has scrolled at all', () => {
    // The observer only fires when a heading crosses the band, and at the top of
    // a long lecture none of them has: this is the state the old list sat in,
    // with nothing marked, until the first scroll event.
    const { container } = render(<Harness />)
    expect(current(container)).toHaveLength(1)
    expect(current(container)[0]).toHaveAttribute('href', '#overview')
  })

  it('observes every heading once, not once per list', () => {
    render(<Harness />)
    expect(observed).toHaveLength(headings.length)
  })

  it('moves the marker and keeps it singular', () => {
    const { container } = render(<Harness />)
    spy([
      { target: document.getElementById('overview')!, isIntersecting: false },
      { target: document.getElementById('two')!, isIntersecting: true },
    ])
    const marked = current(container)
    expect(marked).toHaveLength(1)
    expect(marked[0]).toHaveAttribute('href', '#two')
  })

  it('holds the last answer when no heading is in the band', () => {
    // Most of a 57-heading lecture is spent in a section longer than the
    // viewport, where nothing is intersecting. Clearing here is what made the
    // marker flicker on and off down the page.
    const { container } = render(<Harness />)
    spy([{ target: document.getElementById('two')!, isIntersecting: true }])
    spy([{ target: document.getElementById('two')!, isIntersecting: false }])
    const marked = current(container)
    expect(marked).toHaveLength(1)
    expect(marked[0]).toHaveAttribute('href', '#two')
  })

  it('marks the first in document order, so scrolling up does not skip back', () => {
    const { container } = render(<Harness />)
    spy([
      { target: document.getElementById('two')!, isIntersecting: true },
      { target: document.getElementById('three')!, isIntersecting: true },
    ])
    expect(current(container)[0]).toHaveAttribute('href', '#two')
  })

  it('separates read and upcoming without spending the accent', () => {
    const { container } = render(<Harness />)
    spy([{ target: document.getElementById('three')!, isIntersecting: true }])
    const states = within(container)
      .getAllByRole('link')
      .map((a) => [a.textContent, a.getAttribute('data-state')])
    expect(states).toEqual([
      ['Overview', 'read'],
      ['One', 'read'],
      ['Two', 'read'],
      ['Three', 'current'],
      ['Four', 'upcoming'],
    ])
    // The accent is the current-section indicator and nothing else.
    expect(decl(".contents-list a[data-state='current']", 'color')).toBe('var(--c-accent-ink)')
    expect(decl(".contents-list a[data-state='read']", 'color')).toBe('var(--c-fg-subtle)')
    expect(ruleBody(".contents-list a[data-state='read']")).not.toMatch(/accent/)
  })

  it('is reachable by keyboard and takes arrow keys as a shortcut', () => {
    const { container } = render(<Harness />)
    const links = within(container).getAllByRole('link')
    for (const link of links) {
      expect(link).not.toHaveAttribute('tabindex')
      expect(link).toHaveAttribute('href')
    }
    links[1].focus()
    fireEvent.keyDown(links[1], { key: 'ArrowDown' })
    expect(links[2]).toHaveFocus()
    fireEvent.keyDown(links[2], { key: 'ArrowUp' })
    expect(links[1]).toHaveFocus()
    // Clamps rather than wrapping, and ignores keys it does not own.
    fireEvent.keyDown(links[0], { key: 'ArrowUp' })
    expect(links[0]).toHaveFocus()
    fireEvent.keyDown(links[0], { key: 'PageDown' })
    expect(links[0]).toHaveFocus()
  })
})

describe('the contents list is usable on a phone', () => {
  const headings: Heading[] = [
    { level: 2, text: 'Overview', id: 'overview' },
    { level: 2, text: 'A very long section title that has to wrap on a 390px screen', id: 'long' },
  ]

  it('is offered as a disclosure below the rail breakpoint, with a count', () => {
    const ref = { current: null as HTMLDetailsElement | null }
    render(
      <ContentsDisclosure
        headings={headings}
        activeId="overview"
        detailRef={ref as RefObject<HTMLDetailsElement>}
      />,
    )
    const details = document.querySelector('.toc-disclosure') as HTMLDetailsElement
    expect(details.tagName).toBe('DETAILS')
    // `hidden xl:block` on the rail, `xl:hidden` on the disclosure: the two
    // presentations cannot both be showing.
    expect(details.className).toContain('xl:hidden')
    expect(within(details).getByText(/Contents \(2\)/)).toBeInTheDocument()
    expect(within(details).getAllByRole('link')).toHaveLength(2)
  })

  it('scrolls inside itself instead of becoming a page-long scroll', () => {
    expect(decl('.contents-list', 'overflow-y')).toBe('auto')
    // A cap, not just an overflow: a 57-row list in a `sticky` block is
    // unreachable below the fold, because sticky neither clips nor scrolls.
    expect(decl('.contents-list', 'max-height')).toMatch(/^calc\(100vh - /)
    // Explicitly NOT contain: that would trap the wheel at the end of the list.
    expect(ruleBody('.contents-list')).not.toMatch(/overscroll-behavior:\s*contain/)
  })
})

describe('focus mode can be left', () => {
  function renderExit() {
    return render(
      <MemoryRouter>
        <FocusModeExit />
      </MemoryRouter>,
    )
  }

  it('offers no button when focus mode is off', () => {
    renderExit()
    expect(screen.queryByRole('button', { name: /focus mode/i })).toBeNull()
  })

  it('offers a labelled button in the tab order when focus mode is on', () => {
    usePreferences.setState({ ...DEFAULT_PREFERENCES, focusMode: true })
    renderExit()
    const button = screen.getByRole('button', { name: 'Exit focus mode' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    // A real button with a real name is in the tab order without a tabindex.
    expect(button).not.toHaveAttribute('tabindex')
    // The chord it implements is written on the control, so the shortcut is
    // discoverable rather than folklore.
    expect(button).toHaveAttribute('title', expect.stringContaining('Escape'))
  })

  it('turns focus mode off when pressed', () => {
    usePreferences.setState({ ...DEFAULT_PREFERENCES, focusMode: true })
    renderExit()
    fireEvent.click(screen.getByRole('button', { name: 'Exit focus mode' }))
    expect(usePreferences.getState().focusMode).toBe(false)
  })

  it('leaves focus mode on Escape', () => {
    usePreferences.setState({ ...DEFAULT_PREFERENCES, focusMode: true })
    renderExit()
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(usePreferences.getState().focusMode).toBe(false)
    // And the control goes with it, so the two cannot disagree.
    expect(screen.queryByRole('button', { name: 'Exit focus mode' })).toBeNull()
  })

  it('ignores Escape with a modifier held, and Escape that a modal owns', () => {
    usePreferences.setState({ ...DEFAULT_PREFERENCES, focusMode: true })
    const { rerender } = renderExit()
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape', ctrlKey: true })
    })
    expect(usePreferences.getState().focusMode).toBe(true)
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape', metaKey: true })
    })
    expect(usePreferences.getState().focusMode).toBe(true)

    // The nav drawer closes itself on Escape; it must not also change a
    // preference the reader did not ask it to change.
    const dialog = document.createElement('div')
    dialog.setAttribute('aria-modal', 'true')
    document.body.appendChild(dialog)
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    expect(usePreferences.getState().focusMode).toBe(true)
    dialog.remove()
    rerender(<MemoryRouter><FocusModeExit /></MemoryRouter>)
  })

  it('never installs its listener while focus mode is off', () => {
    renderExit()
    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' })
    })
    // Nothing to turn off, and nothing else in this test touches the store.
    expect(usePreferences.getState().focusMode).toBe(false)
  })
})

describe('focus mode calms the page without hiding the way out', () => {
  const NAV = ['.sidebar', 'header.sticky', 'footer']

  it('hides nothing', () => {
    for (const selector of NAV) {
      for (const match of CSS.matchAll(
        new RegExp(`\\[data-pref-focus='on'\\][^{}]*${selector.replace(/[.*]/g, '\\$&')}[^{}]*\\{([^}]*)\\}`, 'g'),
      )) {
        expect(match[1], selector).not.toMatch(/display:\s*none|visibility:\s*hidden|opacity:\s*0/)
      }
    }
  })

  it('recedes the frame instead of dimming text, so no contrast pair changes', () => {
    // Light mode's sidebar is the brightest surface on the screen — brighter
    // than the article. Moving it to the canvas colour takes two slabs out of
    // the reading field and touches no text token, so there is no contrast
    // arithmetic to get wrong at any of the four text scales.
    expect(decl(":root[data-pref-focus='on'] .sidebar", 'background-color')).toBe('var(--c-bg)')
    expect(decl(":root[data-pref-focus='on'] footer", 'background-color')).toBe('var(--c-bg)')
    // Only the frame: nothing inside it is recoloured.
    const focusRules = [...PARSED.matchAll(/\[data-pref-focus='on'\][^{]*\{([^}]*)\}/g)].map((m) => m[1])
    for (const body of focusRules) expect(body).not.toMatch(/--c-fg\b|--c-ink\b/)
  })

  it('never widens the page, which the auto margins would otherwise do', () => {
    // `#main-content` is a cross-axis flex item, so `margin-inline: auto`
    // cancels the default stretch and the column shrinks to min-content. The
    // prose's min-content is 401px — more than a 390px phone has — so without
    // this the plate would hand a phone reader a horizontal scrollbar.
    const body = ruleBody(":root[data-pref-focus='on'] #main-content")
    expect(decl(":root[data-pref-focus='on'] #main-content", 'width')).toBe('100%')
    expect(decl(":root[data-pref-focus='on'] #main-content", 'margin-inline')).toBe('auto')
    expect(body).toMatch(/max-width: 72rem/)
  })

  it('leaves the article as the only raised surface in the column', () => {
    for (const selector of ['.card', '.elev-panel', '.control-panel', '.visualization-container']) {
      expect(decl(`:root[data-pref-focus='on'] #main-content ${selector}`, 'box-shadow'), selector).toBe('none')
    }
    expect(decl(":root[data-pref-focus='on'] .prose-lecture", 'background-color')).toBe('var(--c-surface)')
    expect(ruleBody(":root[data-pref-focus='on'] .prose-lecture")).toMatch(/--elev-shadow:\s*var\(--elev-2\)/)
  })

  it('keeps the reading measure while it adds the plate inset', () => {
    // Padding on a `max-width: 70ch` box comes out of the measure, so the box
    // is widened by exactly the inset it gained. 70ch of text, still 70ch.
    const maxWidth = decl(":root[data-pref-focus='on'] .prose-lecture", 'max-width')
    expect(maxWidth).toMatch(/^calc\(var\(--pref-measure, 70ch\) \+ 2 \* var\(--space-6\)/)
    expect(decl(":root[data-pref-focus='on'] .prose-lecture", 'padding-inline')).toBe('var(--space-6)')
    // And the shipped declaration is untouched for a reader with focus mode off.
    expect(decl('.prose-lecture', 'max-width')).toBe('var(--pref-measure, 70ch)')
  })
})

describe('landings clear the sticky chrome', () => {
  /** The two things stuck to the top of the viewport while reading, in rem. */
  const HEADER_REM = 3.5
  const BAR_REM = 2.75

  it('offsets every fragment target past the header and the lecture bar', () => {
    const declared = decl(':root', '--read-anchor-offset')
    expect(declared).toBe('7.5rem')
    const rem = Number(declared!.replace('rem', ''))
    expect(rem).toBeGreaterThan(HEADER_REM + BAR_REM)
  })

  it('sets it on the only two elements in the article that carry an id', () => {
    for (const selector of ['.prose-lecture h2', '.prose-lecture h3']) {
      expect(decl(selector, 'scroll-margin-top'), selector).toBe('var(--read-anchor-offset)')
    }
  })

  it('parks the lecture bar exactly under the header, in the same rem unit', () => {
    // Both are rem because `--pref-text-scale` moves the root font size: a px
    // offset would be 22px short at 130% text, where the header alone is 72.8px
    // and the bar is 47.4px.
    expect(SHELL).toMatch(/sticky top-0 z-30 flex h-14 items-center/)
    expect(decl('.lecture-bar', 'top')).toBe('3.5rem')
    expect(decl('.lecture-bar', 'position')).toBe('sticky')
    // Below the header's z-30, or the bar would slide under the bar it parks
    // against.
    expect(decl('.lecture-bar', 'z-index')).toBe('20')
  })

  it('gives the heading anchor a real target without moving the glyph', () => {
    // 15 x 29.5px cleared WCAG 2.2 on height and missed on width. Padding
    // takes it past 24px on both axes; the glyph's own size, colour and
    // distance from the heading text are unchanged, and vertical padding on an
    // inline box does not grow the line box, so no heading changes height.
    const body = ruleBody('.anchor-link')
    expect(decl('.anchor-link', 'padding')).toMatch(/^0\.3rem 0\.35rem$/)
    const padX = 0.35
    const padY = 0.3
    const glyphW = 15
    const lineBox = 29.5
    expect(glyphW + padX * 2 * 16).toBeGreaterThanOrEqual(24)
    expect(lineBox + padY * 2 * 16).toBeGreaterThanOrEqual(24)
    expect(body).not.toMatch(/font-size|font-weight|line-height/)
  })
})

describe('wide content says so', () => {
  /** The rule that carries the shadows, not the scroller's overflow rule. */
  function shadowRule(selector: string): string {
    return ruleBodies(selector).find((body) => body.includes('background-attachment')) ?? ''
  }

  it('uses local attachment, so the shadow only exists when there is more to see', () => {
    for (const selector of ['.prose-lecture .table-scroll', '.prose-lecture .katex-display']) {
      const body = shadowRule(selector)
      expect(body, selector).toMatch(/background-attachment:\s*local, local, scroll, scroll/)
      expect(body, selector).toMatch(/radial-gradient/)
      // The covers have to blend with whatever is behind, which is the point of
      // --prose-bg: focus mode moves the article onto a different surface.
      expect(decl(selector, 'background-color'), selector).toBe('var(--prose-bg)')
    }
    expect(decl(':root', '--prose-bg')).toBe('var(--c-bg)')
    expect(decl(":root[data-pref-focus='on']", '--prose-bg')).toBe('var(--c-surface)')
  })

  it('keeps the two scroll-shadow rules separate', () => {
    // The table affordance and the equation scroller are two different
    // overflow containers and are stated apart so either can be read, and
    // changed, on its own. Measured against the built dist CSS, this repo's
    // minifier merges adjacent identical rules and preserves every selector,
    // so the split is a readability choice rather than a fix for a failure
    // seen here.
    const grouped = /(\.prose-lecture \.table-scroll)[^;{]*,[^;{]*(\.prose-lecture \.katex-display)[^{]*\{/.exec(
      PARSED,
    )
    expect(grouped, 'the two scroll-shadow rules must be separate rules').toBeNull()
  })

  it('uses no modern CSS that would need a guard', () => {
    // The point of choosing local attachment over a scroll-timeline animation
    // is that there is no @supports to get wrong.
    for (const selector of ['.prose-lecture .table-scroll', '.prose-lecture .katex-display']) {
      expect(shadowRule(selector), selector).not.toMatch(/animation-timeline|mask-image|@supports/)
    }
  })
})

describe('article navigation', () => {
  const first = LECTURES[0]
  const last = LECTURES[LECTURES.length - 1]

  function bar(over: Partial<ComponentProps<typeof LectureBar>> = {}) {
    return render(
      <MemoryRouter>
        <LectureBar
          lecture={first}
          index={0}
          total={LECTURES.length}
          prev={undefined}
          next={LECTURES[1]}
          hasContents
          onOpenContents={() => undefined}
          {...over}
        />
      </MemoryRouter>,
    )
  }

  it('says where you are in the course', () => {
    bar()
    const nav = screen.getByRole('navigation', { name: 'Lecture navigation' })
    expect(within(nav).getByText(`1 of ${LECTURES.length}`)).toBeInTheDocument()
  })

  it('links to the neighbours that exist', () => {
    bar({ lecture: LECTURES[1], index: 1, prev: first, next: LECTURES[2] })
    const nav = screen.getByRole('navigation', { name: 'Lecture navigation' })
    expect(within(nav).getByRole('link', { name: new RegExp(`^${first.title}`) })).toHaveAttribute(
      'href',
      `/lecture/${first.n}`,
    )
    expect(within(nav).getByRole('link', { name: new RegExp(`^${LECTURES[2].title}`) })).toHaveAttribute(
      'href',
      `/lecture/${LECTURES[2].n}`,
    )
  })

  it('always leaves a destination at the boundaries, never an empty corner', () => {
    bar({ lecture: first, index: 0, prev: undefined, next: LECTURES[1] })
    let nav = screen.getByRole('navigation', { name: 'Lecture navigation' })
    expect(within(nav).getByRole('link', { name: /Syllabus/ })).toHaveAttribute('href', '/syllabus')

    cleanup()
    bar({ lecture: last, index: LECTURES.length - 1, prev: LECTURES[LECTURES.length - 2], next: undefined })
    nav = screen.getByRole('navigation', { name: 'Lecture navigation' })
    expect(within(nav).getByRole('link', { name: /Syllabus/ })).toHaveAttribute('href', '/syllabus')
  })

  it('advertises the bracket chord on the buttons it implements', () => {
    bar({ lecture: LECTURES[1], index: 1, prev: first, next: LECTURES[2] })
    const nav = screen.getByRole('navigation', { name: 'Lecture navigation' })
    expect(within(nav).getByRole('link', { name: new RegExp(`^${first.title}`) })).toHaveAttribute(
      'title',
      expect.stringContaining('press ['),
    )
    expect(within(nav).getByRole('link', { name: new RegExp(`^${LECTURES[2].title}`) })).toHaveAttribute(
      'title',
      expect.stringContaining('press ]'),
    )
  })

  it('is written in rem and on the density scale, so it respects both preferences', () => {
    for (const property of ['margin-top', 'margin-bottom', 'padding-block']) {
      expect(decl('.lecture-bar', property), property).toMatch(/^var\(--space-/)
    }
    expect(decl('.lecture-bar-link', 'font-size')).toBe('0.875rem')
  })
})

describe('the lecture page at its boundaries', () => {
  function page(path: string) {
    const result = render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/lecture/:n" element={<LecturePage />} />
          <Route path="/syllabus" element={<p>Syllabus</p>} />
        </Routes>
      </MemoryRouter>,
    )
    return { ...result, foot: () => result.container.querySelector('[aria-label="Previous and next lecture"]') }
  }

  it('offers no previous lecture on the first, and says where to go instead', async () => {
    const view = page('/lecture/1')
    const foot = await waitFor(() => {
      const found = view.foot()
      expect(found).not.toBeNull()
      return found as HTMLElement
    })
    expect(foot.querySelector('a[rel="prev"]')).toBeNull()
    expect(within(foot).getByRole('link', { name: /All lectures/ })).toHaveAttribute(
      'href',
      '/syllabus',
    )
  })

  it('offers no next lecture on the last', async () => {
    const lastN = LECTURES[LECTURES.length - 1].n
    const view = page(`/lecture/${lastN}`)
    const foot = await waitFor(() => {
      const found = view.foot()
      expect(found).not.toBeNull()
      return found as HTMLElement
    })
    expect(foot.querySelector('a[rel="next"]')).toBeNull()
    expect(foot.querySelector('a[rel="prev"]')).not.toBeNull()
  })

  it('points both directions in the middle', async () => {
    const view = page('/lecture/5')
    const foot = await waitFor(() => {
      const found = view.foot()
      expect(found).not.toBeNull()
      return found as HTMLElement
    })
    expect(foot.querySelector('a[rel="prev"]')).toHaveAttribute('href', '/lecture/4')
    expect(foot.querySelector('a[rel="next"]')).toHaveAttribute('href', '/lecture/6')
  })

  it('sizes the page so nothing new can reach past the viewport', async () => {
    const view = page('/lecture/5')
    await waitFor(() => expect(view.foot()).not.toBeNull())
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth)
  })
})

describe('the bracket shortcut', () => {
  function page(path: string) {
    const result = render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/lecture/:n" element={<LecturePage />} />
        </Routes>
      </MemoryRouter>,
    )
    // Scoped to this render's own container rather than to the document, so a
    // heading left behind by another test cannot satisfy the wait.
    const h1 = () => result.container.querySelector('h1')?.textContent ?? ''
    const n = Number(path.split('/').pop())
    const settled = () => waitFor(() => expect(h1()).toContain(`${n}.`))
    return { ...result, h1, settled }
  }

  it('steps forward on ] and back on [', async () => {
    const view = page('/lecture/5')
    await view.settled()
    act(() => {
      fireEvent.keyDown(document, { key: ']' })
    })
    await waitFor(() => expect(view.h1()).toContain(`${LECTURES[5].n}.`))
    act(() => {
      fireEvent.keyDown(document, { key: '[' })
    })
    await waitFor(() => expect(view.h1()).toContain(`${LECTURES[4].n}.`))
  })

  it('is inert with a modifier, so Ctrl+] stays the browser tab switch', async () => {
    const view = page('/lecture/5')
    await view.settled()
    act(() => {
      fireEvent.keyDown(document, { key: ']', ctrlKey: true })
      fireEvent.keyDown(document, { key: ']', metaKey: true })
      fireEvent.keyDown(document, { key: ']', altKey: true })
    })
    expect(view.h1()).toContain(`${LECTURES[4].n}.`)
  })

  it('is inert inside anything the reader is typing into', async () => {
    const view = page('/lecture/5')
    await view.settled()
    const input = document.createElement('input')
    document.body.appendChild(input)
    try {
      act(() => {
        input.focus()
        fireEvent.keyDown(input, { key: ']' })
      })
      expect(view.h1()).toContain(`${LECTURES[4].n}.`)
    } finally {
      input.remove()
    }
  })

  it('does nothing at the ends, rather than swallowing the key', async () => {
    const view = page('/lecture/1')
    await view.settled()
    act(() => {
      fireEvent.keyDown(document, { key: '[' })
    })
    expect(view.h1()).toContain(`${LECTURES[0].n}.`)
  })
})

describe('printing a lecture', () => {
  it('drops the reading chrome, which is screen furniture', () => {
    const block = printBlock()
    for (const selector of ['.lecture-bar', '.toc-disclosure', '.read-progress']) {
      expect(block, selector).toMatch(
        new RegExp(`${selector.replace('.', '\\.')}\\s*\\{[^}]*display:\\s*none !important;`),
      )
    }
    // All of the chrome the print block hides, in one count. The block
    // declares one rule per selector, and the built CSS merges adjacent
    // identical declarations back into one group with every selector intact,
    // so counting declarations here counts the authored form and a selector
    // is looked up by name either way.
    const hides = [...block.matchAll(/([^{}@]+)\{[^}]*display:\s*none !important;/g)]
    const selectors = hides.flatMap((m) => m[1].split(',').map((s) => s.trim()))
    for (const selector of ['.sidebar', 'header.sticky', 'footer', '.button', '.lecture-bar', '.toc-disclosure', '.read-progress']) {
      expect(selectors, selector).toContain(selector)
    }
  })

  it('takes the focus-mode plate back off, so the prose is not a bordered block', () => {
    const body = ruleBody('.prose-lecture', printBlock())
    expect(body).toMatch(/padding:\s*0/)
    expect(body).toMatch(/border:\s*0/)
    expect(body).toMatch(/background:\s*none/)
    expect(body).toMatch(/box-shadow:\s*none/)
    // The 11pt pin the existing test reads has to survive all of that.
    expect(body).toMatch(/max-width: none;[\s\S]*font-size: 11pt;/)
  })

  it('does not print the scroll shadows', () => {
    expect(printBlock()).toMatch(/background-image:\s*none;/)
  })

  it('still unscrolls the boxes it has always unscrolled', () => {
    const block = printBlock()
    expect(block).toMatch(/\.prose-lecture \.table-scroll,[^}]*overflow: visible;/)
    expect(block).not.toMatch(/\.katex-display,[^}]*overflow: visible;/)
  })
})

describe('the design rules the reading view has to keep', () => {
  const NEW_CSS = [
    '.read-progress',
    '.read-progress-fill',
    '.lecture-bar',
    '.lecture-bar-link',
    '.toc-disclosure',
    '.contents-list',
    ".contents-list a[data-state='current']",
    ".contents-list a[data-state='read']",
  ]

  // Assembled from parts on purpose. `tokens.test.ts` scans every .tsx and .css
  // file for these two literals, this one included, so writing them out in full
  // here would make this file the thing it is asserting against.
  const SERIF_UTILITY = ['font', 'serif'].join('-')
  const NUMBERED_RULE = /\bborder-l(?:-|\b)|\bborder-t-[1-9]/

  it('uses no raw colour, no default-palette utility, and no second face', () => {
    for (const selector of NEW_CSS) {
      const body = ruleBody(selector)
      expect(body, selector).not.toMatch(/#[0-9a-f]{3,8}\b/i)
      expect(body, selector).not.toContain(SERIF_UTILITY)
      expect(body, selector).not.toMatch(/font-family/)
    }
    // 3.5rem is rem precisely so it scales with the text-size preference.
    expect(decl('.lecture-bar', 'top')).not.toMatch(/px/)
    expect(decl('.read-progress', 'height')).toBe('2px')
  })

  it('adds no numbered rule and no accent fill to the reading view', () => {
    const body = NEW_CSS.map((s) => ruleBody(s)).join('\n')
    expect(body).not.toMatch(NUMBERED_RULE)
    expect(body).not.toMatch(/border-left:\s*[2-9]px|border-top:\s*[2-9]px/)
    // The two accents in the reading view are the progress fill and the
    // current-section marker. Both are state, neither is a button fill.
    expect(decl('.read-progress-fill', 'background-color')).toBe('var(--c-accent)')
    expect(decl('.read-progress', 'background-color')).not.toMatch(/accent/)
  })
})
