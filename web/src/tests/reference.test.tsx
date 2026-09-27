import type { ReactElement } from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Glossary from '../pages/Glossary'
import Syllabus from '../pages/Syllabus'
import CasesIndex from '../pages/CasesIndex'
import DataExplorer from '../pages/DataExplorer'
import ConceptMapPage from '../pages/ConceptMapPage'
import { GLOSSARY } from '../../../content/glossary'
import { LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'
import { markLectureComplete, toggleLectureComplete } from '../learning/progress'
import { matchesAllWords, matchCount } from '../lib/lookupSearch'
import { parseMoneySeries } from '../lib/csv'

/**
 * The reference pages: the five surfaces a returning reader opens to find one
 * thing, plus the lookup rule and the progress model they all read.
 *
 * These are the pages no earlier pass owned, and they are the pages a reader
 * comes to AFTER a lecture rather than before one, which is why they rot
 * quietly: nothing inside a lecture depends on the glossary, so a glossary
 * that cannot be searched is invisible to every other test in this suite.
 *
 * The assertions are grouped by the claim they defend:
 *
 *  - ONE LOOKUP RULE. Three surfaces now have a search box, and they are only
 *    useful together if they behave the same way. "money multiplier" has to
 *    find the multiplier on all three, which is the claim, and it is
 *    asserted against the data rather than against a hand-written example.
 *  - THE DATA PAGE IS A DATA PAGE. `/data` is the only page that fetches
 *    anything at runtime, so it is the only page that can fail — and a page
 *    that can fail is four states, not one. The CSV path is asserted too,
 *    because the site is served from a subpath and a bare leading slash is a
 *    404 in production that no test in this suite would otherwise catch.
 *  - NO COLOUR IS THE ONLY SIGNAL. The syllabus's completion state and the
 *    legend's hidden state are both "is this on or off", and both are
 *    asserted on the non-colour half so that removing the colour cannot
 *    remove the information.
 */

const SRC = join(__dirname, '..')

function readSource(relative: string): string {
  return readFileSync(join(SRC, relative), 'utf8')
}

/** Comments removed, so a note that quotes a class name is not a usage. */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

function renderAt(routePath: string, entry: string, element: ReactElement) {
  const router = createMemoryRouter([{ path: routePath, element }], { initialEntries: [entry] })
  return render(<RouterProvider router={router} />)
}

const DATASET = [
  'Date,M2_Money_Supply_Trillions,Federal_Funds_Rate_Percent',
  'Jan 2000,4.705,5.45',
  'Feb 2000,4.72,5.75',
  'Jan 2001,5.4,4.5',
  'Nov 2025,22.35,3.88',
].join('\n')

type FetchMode =
  | { kind: 'ok'; body: string }
  | { kind: 'fail'; status: number }
  | { kind: 'hang' }

/** The requests the page made, in order. Asserted on: the path is the claim. */
let requests: string[] = []
let mode: FetchMode = { kind: 'ok', body: DATASET }
let release: (() => void) | null = null

function stubFetch(): void {
  globalThis.fetch = ((input: RequestInfo | URL) => {
    requests.push(String(input))
    if (mode.kind === 'fail') {
      return Promise.resolve({ ok: false, status: mode.status } as Response)
    }
    if (mode.kind === 'ok') {
      return Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mode.kind === 'ok' ? mode.body : ''),
      } as Response)
    }
    return new Promise<Response>((resolve) => {
      release = () => resolve({ ok: true, status: 200, text: () => Promise.resolve('') } as Response)
    })
  }) as typeof fetch
}

beforeEach(() => {
  requests = []
  release = null
  mode = { kind: 'ok', body: DATASET }
  stubFetch()
  // jsdom has no layout and no scrolling, and the glossary's "back to search"
  // button calls both.
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

/** The chart plate, which is the only thing a Recharts page can be said to have. */
function dataPage() {
  return renderAt('/data', '/data', <DataExplorer />)
}

/* ================================================================== *
 * One lookup rule
 * ================================================================== */

describe('the lookup rule is one rule, and it is in one place', () => {
  it('needs every word of the query, in any order, and is case-insensitive', () => {
    // This is the rule `ToolsIndex` already had, and the reason the glossary
    // and the concept map now behave the same: a reader who types a phrase
    // ("money multiplier") is not making a mistake, and the one-string
    // substring it used to do returned nothing for it.
    expect(matchesAllWords('the money multiplier', 'money multiplier')).toBe(true)
    expect(matchesAllWords('the money multiplier', 'MULTIPLIER MONEY')).toBe(true)
    expect(matchesAllWords('the money multiplier', 'multiplier money')).toBe(true)
    expect(matchesAllWords('the money multiplier', 'money bank')).toBe(false)
    // An empty query matches everything, so the unfiltered list needs no
    // special case at the call site.
    expect(matchesAllWords('anything', '')).toBe(true)
    expect(matchesAllWords('anything', '   ')).toBe(true)
  })

  it('counts in the one format all three pages print', () => {
    expect(matchCount(3, 35)).toBe('3 of 35')
  })

  it('is what the tool index already did, asserted against the tool data', () => {
    // The point of centralising is that the existing surface does not change.
    // If `ToolsIndex` ever gets its own matcher back, this fails and the two
    // rules are visibly two again.
    const source = stripComments(readSource('pages/ToolsIndex.tsx'))
    expect(source).not.toMatch(/includes\(query|includes\(q\)/)
  })
})

/* ================================================================== *
 * The glossary
 * ================================================================== */

describe('the glossary', () => {
  const search = () => screen.getByLabelText(/search terms/i)
  const terms = () =>
    [...document.querySelectorAll('dl dt')].map((dt) => dt.textContent ?? '')

  it('lists every term, alphabetically, and says how many there are', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    const shown = terms()
    expect(shown).toHaveLength(GLOSSARY.length)
    expect([...shown].sort((a, b) => a.localeCompare(b))).toEqual(shown)
    expect(screen.getByText(`${GLOSSARY.length} of ${GLOSSARY.length} terms`)).toBeInTheDocument()
  })

  /** The terms a query selects, computed from the data the page reads. */
  const expectedTerms = (query: string) =>
    GLOSSARY.filter((entry) =>
      matchesAllWords(`${entry.term} ${entry.definition}`, query),
    )
      .map((entry) => entry.term)
      .sort((a, b) => a.localeCompare(b))

  it('finds a term by every word of a phrase, in any order', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    // Word order is ignored, so a reader who is hunting by memory types the
    // phrase however it comes out. The old one-substring match needed the
    // exact contiguous run, so "money multiplier" found nothing.
    fireEvent.change(search(), { target: { value: 'output gap' } })
    expect(terms()).toEqual(expectedTerms('output gap'))
    expect(terms()).toContain('Output gap')
    fireEvent.change(search(), { target: { value: 'GAP OUTPUT' } })
    expect(terms()).toEqual(expectedTerms('output gap'))
    // A three-word phrase, with the words in three different places.
    fireEvent.change(search(), { target: { value: 'natural rate unemployment' } })
    expect(terms()).toEqual(['Natural rate of unemployment'])
    // A phrase the old matcher could never find, because no definition
    // contains it contiguously.
    expect(GLOSSARY.some((e) => e.definition.includes('money multiplier'))).toBe(false)
  })

  it('searches the definition, which is where the distinguishing words are', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    // A word that is in no term at all. `autonomous` appears in exactly one
    // definition; a matcher on terms alone could never return that entry.
    const termOnly = GLOSSARY.map((e) => e.term.toLowerCase()).join(' ')
    expect(termOnly).not.toContain('autonomous')
    fireEvent.change(search(), { target: { value: 'autonomous' } })
    expect(terms()).toEqual(['Multiplier'])
    // And a word in no term but in several definitions, matched from the data
    // rather than from an example.
    fireEvent.change(search(), { target: { value: 'money' } })
    expect(terms()).toEqual(expectedTerms('money'))
    expect(terms().length).toBeGreaterThan(0)
  })

  it('reports the count, and only the matches', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    fireEvent.change(search(), { target: { value: 'multiplier' } })
    expect(screen.getByText(`1 of ${GLOSSARY.length} terms`)).toBeInTheDocument()
    expect(terms()).toEqual(['Multiplier'])
  })

  it('answers a query that matches nothing, and gets out of the way again', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    fireEvent.change(search(), { target: { value: 'hyperbolic' } })
    expect(screen.getByRole('heading', { name: /No term matches that/ })).toBeInTheDocument()
    expect(screen.queryByRole('definition')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Show all \d+ terms/ }))
    expect(screen.queryByRole('heading', { name: /No term matches that/ })).toBeNull()
    expect(terms()).toHaveLength(GLOSSARY.length)
    expect(search()).toHaveValue('')
  })

  it('offers a Clear while a query is in, and a way back to the field', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    expect(screen.queryByRole('button', { name: /Clear/ })).toBeNull()
    fireEvent.change(search(), { target: { value: 'multiplier' } })
    fireEvent.click(screen.getByRole('button', { name: /Clear/ }))
    expect(search()).toHaveValue('')
    // After a filter that leaves a list worth scrolling, there is a way back
    // to the field, and it is a button rather than a habit.
    fireEvent.change(search(), { target: { value: 'the' } })
    const back = screen.getByRole('button', { name: /Back to search/ })
    fireEvent.click(back)
    expect(search()).toHaveFocus()
    expect(window.scrollTo).toHaveBeenCalled()
  })

  it('shows which letters survive a filter, and hides the strip on request', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    const strip = () => screen.getByRole('button', { name: /index/i })
    expect(strip()).toHaveAttribute('aria-expanded', 'true')
    fireEvent.change(search(), { target: { value: 'multiplier' } })
    // One matching term, and the strip says which letter it is — the
    // scannability an index is for, without a jump that a re-flowed column
    // list cannot honour.
    expect(strip()).toHaveTextContent('M–M')
    fireEvent.click(strip())
    expect(strip()).toHaveAttribute('aria-expanded', 'false')
  })

  it('focuses the field on /, and only when nothing else is taking the key', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    expect(screen.getByText('/')).toBeInTheDocument()
    // Unmodified: a modifier belongs to the browser's own quick-find.
    for (const modifier of ['ctrlKey', 'metaKey', 'altKey'] as const) {
      fireEvent.keyDown(document, { key: '/', [modifier]: true })
      expect(search()).not.toHaveFocus()
    }
    fireEvent.keyDown(document, { key: '/' })
    expect(search()).toHaveFocus()
  })

  it('is inert on / while the reader is typing in something', () => {
    // The collision that matters: the handler must not steal the slash the
    // reader is typing INTO the field, and must not fire from another
    // control on the page either.
    renderAt('/glossary', '/glossary', <Glossary />)
    fireEvent.change(search(), { target: { value: 'a/b' } })
    expect(search()).toHaveValue('a/b')
    fireEvent.keyDown(search(), { key: '/' })
    expect(search()).toHaveValue('a/b')

    const other = document.createElement('input')
    document.body.appendChild(other)
    try {
      other.focus()
      fireEvent.keyDown(other, { key: '/' })
      expect(other).toHaveFocus()
    } finally {
      other.remove()
    }
  })

  it('is inert on / behind a modal, which owns the keyboard', () => {
    renderAt('/glossary', '/glossary', <Glossary />)
    const dialog = document.createElement('div')
    dialog.setAttribute('aria-modal', 'true')
    document.body.appendChild(dialog)
    try {
      fireEvent.keyDown(document, { key: '/' })
      expect(search()).not.toHaveFocus()
    } finally {
      dialog.remove()
    }
  })

  it('flows its definitions top-to-bottom, not half the list then back', () => {
    // A grid's second column is the BOTTOM half of the list, so a reader who
    // read the left column all the way down had to return to the top to carry
    // on. Multi-column fills the first column then starts the second.
    const { container } = renderAt('/glossary', '/glossary', <Glossary />)
    const list = container.querySelector('dl')!
    expect(list.className).toMatch(/\bcolumns-1\b/)
    expect(list.className).toMatch(/sm:columns-2\b/)
    // And one column until `sm`: below it a definition has the full width of
    // the page, so it cannot rag into two words a line at 390px.
    expect(list.className).not.toMatch(/sm:grid-cols-2/)
  })
})

/* ================================================================== *
 * The syllabus
 * ================================================================== */

describe('the syllabus', () => {
  it('says where a reader is, and where to go next', () => {
    try {
      for (const n of [1, 2]) markLectureComplete(n)
      renderAt('/syllabus', '/syllabus', <Syllabus />)
      expect(screen.getByText(`2 of ${LECTURES.length} lectures complete`)).toBeInTheDocument()
      // The first lecture in course order that is not done. A list of 25
      // rows is not a "where next" surface; this is. The same name appears in
      // its own row below, so the assertion is scoped to the block that
      // carries the label.
      const next = LECTURES.find((l) => l.n > 2)!
      expect(next).toBeDefined()
      const block = screen.getByText('Next:', { exact: false }).closest('p')!
      const link = within(block).getByRole('link', { name: `${next.n}. ${next.title}` })
      expect(link).toHaveAttribute('href', `/lecture/${next.n}`)
    } finally {
      for (const n of [1, 2]) toggleLectureComplete(n)
    }
  })

  it('puts a per-tier count on the section heading, which is where the home page puts it', () => {
    try {
      for (const n of [1, 2, 3]) markLectureComplete(n)
      const { container } = renderAt('/syllabus', '/syllabus', <Syllabus />)
      const beginner = LECTURES.filter((l) => l.tier === 'beginner')
      // The reader is already looking at the tier's lectures, so the count
      // next to the number of lectures is the only honest thing to add.
      expect(
        screen.getByText(`${3} of ${beginner.length} complete`),
      ).toBeInTheDocument()
      // And it is derived, not hard-coded: three of the beginner tier's rows
      // carry a complete state.
      const done = container.querySelectorAll('[aria-label$=": complete"]')
      expect(done.length).toBe(3)
    } finally {
      for (const n of [1, 2, 3]) toggleLectureComplete(n)
    }
  })

  it('states the completion state in words, so it does not depend on colour', () => {
    try {
      markLectureComplete(1)
      const { container } = renderAt('/syllabus', '/syllabus', <Syllabus />)
      // A 15% tint of a status hue on a surface is a colour. The accessible
      // name is the other half, and it is the half that survives.
      const done = screen.getByLabelText('Lecture 1: complete')
      const notDone = screen.getByLabelText('Lecture 2: not started')
      expect(done.className).toMatch(/text-ok-ink/)
      expect(notDone.className).not.toMatch(/text-ok-ink/)
      // And the visible half is a glyph, not just a number that changed hue.
      const check = done.querySelector('svg')
      expect(check).not.toBeNull()
      expect(notDone.querySelector('svg')).toBeNull()
      // Two lectures, two different states, and the unfinished one still
      // prints its number.
      expect(notDone).toHaveTextContent('2')
      expect(container.querySelectorAll('[aria-label^="Lecture"]')).toHaveLength(LECTURES.length)
    } finally {
      toggleLectureComplete(1)
    }
  })

  it('keeps the whole summary in the DOM, clamped for the eye', () => {
    const { container } = renderAt('/syllabus', '/syllabus', <Syllabus />)
    for (const lecture of LECTURES) {
      const summary = [...container.querySelectorAll('p')].find(
        (p) => p.getAttribute('title') === lecture.summary,
      )
      expect(summary, `lecture ${lecture.n} summary`).toBeDefined()
      // Clamped for the eye, never truncated in the DOM: the second half of a
      // summary is the part that says whether the lecture is the one wanted,
      // and `truncate` was deleting it. A `title` does not rescue that — it
      // is hover-only, absent on touch, and read as a description rather than
      // as content.
      expect(summary!.className).toMatch(/line-clamp-3/)
      expect(summary!.className).not.toMatch(/\btruncate\b/)
      expect(summary!.textContent).toContain(lecture.summary)
    }
  })

  it('caps the tool pills at two and never drops a tool without saying so', () => {
    // Today every lecture links at most two tools, so the overflow is dead
    // code — and dead code is exactly the thing that goes quietly wrong when
    // `content/lectures.ts` gains a third tool. The contract is the pair: a
    // cap, and a counted, named remainder beside it.
    expect(Math.max(...LECTURES.map((l) => l.tools.length))).toBeLessThanOrEqual(2)
    const { container } = renderAt('/syllabus', '/syllabus', <Syllabus />)
    // So today no row claims an overflow that does not exist.
    expect(container.textContent).not.toMatch(/\+\d/)
    // And the branch that would is present, with the hidden tools named.
    const source = stripComments(readSource('pages/Syllabus.tsx'))
    expect(source).toMatch(/lecture\.tools\.slice\(0, 2\)/)
    expect(source).toContain('Also in this lecture:')
  })

  it('shows the tool titles, not just their count', () => {
    // The count is a decision; the titles are what a reader matches against
    // the tool index. Both are on the row.
    const { container } = renderAt('/syllabus', '/syllabus', <Syllabus />)
    for (const lecture of LECTURES.filter((l) => l.tools.length > 0)) {
      const row = [...container.querySelectorAll('li')].find((li) =>
        li.textContent?.includes(`${lecture.n}. ${lecture.title}`),
      )!
      for (const toolId of lecture.tools) {
        expect(row.textContent, `lecture ${lecture.n}`).toContain(TOOLS[toolId]?.title ?? toolId)
        expect(
          within(row).getByRole('link', { name: TOOLS[toolId]?.title ?? toolId }),
        ).toHaveAttribute('href', `/tool/${toolId}`)
      }
    }
  })

  it('finds a lecture by number, title, or a word of its concepts', () => {
    renderAt('/syllabus', '/syllabus', <Syllabus />)
    const field = screen.getByLabelText(/find a lecture/i)
    const hrefs = () =>
      new Set(
        [...document.querySelectorAll('li a[href^="/lecture/"]')].map(
          (a) => a.getAttribute('href')!,
        ),
      )
    const expected = (query: string) =>
      LECTURES.filter((l) =>
        matchesAllWords(`${l.n} ${l.title} ${l.summary} ${l.concepts.join(' ')}`, query),
      ).map((l) => `/lecture/${l.n}`)

    // The haystack is the number, the title, the summary AND the concepts, so
    // a reader can search by the model or by the term it is called — and the
    // expected set is computed from the same data the page reads.
    fireEvent.change(field, { target: { value: 'phillips' } })
    expect(expected('phillips').length).toBeGreaterThan(1)
    expect(hrefs()).toEqual(new Set(expected('phillips')))
    expect(
      screen.getByText(`${expected('phillips').length} of ${LECTURES.length} lectures`),
    ).toBeInTheDocument()
    // A lecture number is a search term too, which is what a reader who was
    // told "lecture 9" types. It is a substring match, so "9" also finds 19
    // — the data says so and the page agrees with the data.
    fireEvent.change(field, { target: { value: '9' } })
    expect(hrefs()).toEqual(new Set(expected('9')))
    expect(expected('9')).toContain('/lecture/9')
  })

  it('answers a query that matches nothing, and gets out of the way again', () => {
    renderAt('/syllabus', '/syllabus', <Syllabus />)
    const field = screen.getByLabelText(/find a lecture/i)
    fireEvent.change(field, { target: { value: 'hyperbolic' } })
    expect(screen.getByRole('heading', { name: /No lecture matches that/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Show all \d+ lectures/ }))
    expect(screen.queryByRole('heading', { name: /No lecture matches that/ })).toBeNull()
    expect(field).toHaveValue('')
  })
})

/* ================================================================== *
 * The concept map
 * ================================================================== */

describe('the concept map', () => {
  const field = () => screen.getByLabelText(/find a concept/i)

  it('finds a concept and says what it found, out of what', () => {
    renderAt('/concepts', '/concepts', <ConceptMapPage />)
    const total = LECTURES.reduce((n, l) => n + l.concepts.length, 0)
    expect(screen.getByText(`${total} concepts in ${LECTURES.length} lectures`)).toBeInTheDocument()
    fireEvent.change(field(), { target: { value: 'multiplier' } })
    // The count is of MATCHING CONCEPTS — a card can match on its lecture
    // number and carry seven concepts of which one is the one that was typed,
    // so counting the concepts on a matching card answers a different
    // question. It is a substring match, so "multiplier" also finds
    // "fiscal multiplier" if the data has one.
    const matching = LECTURES.flatMap((l) => l.concepts).filter((c) =>
      matchesAllWords(c, 'multiplier'),
    )
    expect(matching.length).toBeGreaterThan(0)
    for (const concept of matching) {
      expect(screen.getAllByText(concept).length).toBeGreaterThan(0)
    }
    expect(screen.getByText(`${matching.length} of ${total} concepts`)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Beginner/ })).toBeInTheDocument()
    // And the cards that survive are the ones that carry a matching concept.
    const cards = [...document.querySelectorAll('.card')]
    expect(cards).toHaveLength(
      LECTURES.filter((l) => l.concepts.some((c) => matchesAllWords(c, 'multiplier'))).length,
    )
  })

  it('says so when a concept is taught in more than one lecture', () => {
    // Two of the 116 unique concepts are shared. A pill that hides that is
    // making a reader believe a term belongs to one lecture.
    const shared = new Map<string, number[]>()
    for (const lecture of LECTURES) {
      for (const concept of lecture.concepts) {
        shared.set(concept, [...(shared.get(concept) ?? []), lecture.n])
      }
    }
    const duplicated = [...shared.entries()].filter(([, lectures]) => lectures.length > 1)
    expect(duplicated.length).toBeGreaterThan(0)
    const { container } = renderAt('/concepts', '/concepts', <ConceptMapPage />)
    for (const [concept, lectures] of duplicated) {
      const pill = [...container.querySelectorAll('span')].find(
        (s) => s.textContent?.startsWith(concept) && s.className.includes('rounded-pill'),
      )
      expect(pill, concept).toBeDefined()
      expect(pill!.textContent).toContain(`+${lectures.length - 1}`)
      expect(pill!.getAttribute('title')).toBe(
        `Also listed in lecture ${lectures.slice(1).join(', ')}`,
      )
    }
  })

  it('answers a query that matches nothing, and points at the glossary', () => {
    renderAt('/concepts', '/concepts', <ConceptMapPage />)
    fireEvent.change(field(), { target: { value: 'hyperbolic' } })
    expect(screen.getByRole('heading', { name: /No concept matches that/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open the glossary' })).toHaveAttribute('href', '/glossary')
    fireEvent.click(screen.getByRole('button', { name: /Show all \d+ concepts/ }))
    expect(screen.queryByRole('heading', { name: /No concept matches that/ })).toBeNull()
  })

  it('keeps every card reachable from the keyboard, without nesting an anchor', () => {
    // The card holds a title link and tool links, so making the card a target
    // would be an anchor inside an anchor. The affordance it gets instead is a
    // real href to the field's id: focusable, and it works with no JS.
    const { container } = renderAt('/concepts', '/concepts', <ConceptMapPage />)
    expect(field().id).toBe('concept-search')
    const jumps = [...container.querySelectorAll('a[href="#concept-search"]')]
    expect(jumps.length).toBe(LECTURES.length)
    for (const jump of jumps) {
      // `closest` starts at the element itself, so this is the question that
      // matters: is there a LINK ancestor, i.e. an anchor inside an anchor?
      expect(jump.parentElement?.closest('a')).toBeNull()
    }
    fireEvent.click(jumps[0] as HTMLElement)
    expect(field()).toHaveFocus()
  })

  it('writes its pills at a size on the type scale, not an arbitrary one', () => {
    // `text-[0.72rem]` sat between `text-xs` and `text-micro` and matched
    // neither, so it was the one label on the page that was not a scale step
    // — and it was 0.03rem off every other pill in the site.
    const source = stripComments(readSource('learning/ConceptMap.tsx'))
    expect(source).not.toMatch(/text-\[[\d.]+rem\]/)
    expect(source).toMatch(/rounded-pill[^"]*text-micro/)
  })
})

/* ================================================================== *
 * The case index
 * ================================================================== */

describe('the case index', () => {
  it('shows every case, its period, and the lectures it needs', () => {
    const { container } = renderAt('/cases', '/cases', <CasesIndex />)
    const cards = [...container.querySelectorAll('a[href^="/case/"]')]
    expect(cards.length).toBe(4)
    for (const card of cards) {
      const href = card.getAttribute('href')!
      const text = card.textContent ?? ''
      expect(text).toMatch(/Open case/)
      // The period and the count are what a reader scans the row for.
      expect(text).toMatch(/Lecture \d/)
      expect(text).toMatch(/\d+ lectures?/)
      expect(href).toMatch(/^\/case\/[a-z0-9-]+$/)
    }
  })

  it('lines the Open case row up across the grid, so it is not a rhythm guess', () => {
    // `mt-auto` inside a flex column, not a fixed margin: four cards with
    // different summary lengths would otherwise put the affordance at four
    // different heights, which is the one alignment a grid of cards has.
    const { container } = renderAt('/cases', '/cases', <CasesIndex />)
    for (const card of container.querySelectorAll('a[href^="/case/"]')) {
      expect(card.className).toMatch(/flex-col/)
      const cta = [...card.querySelectorAll('span')].find((s) =>
        s.textContent?.includes('Open case'),
      )
      expect(cta?.className).toMatch(/mt-auto/)
    }
  })
})

/* ================================================================== *
 * The data explorer
 * ================================================================== */

describe('the data explorer asks for the CSV through the base path', () => {
  it('requests the file under the deployed prefix, not the server root', async () => {
    // THE production bug this file is here to catch. The site is served from
    // `/macro-economics/` on GitHub Pages, and `base` is set in `vite.config.ts`
    // to that prefix. A bare `/data/…csv` is a 404 in production and works
    // perfectly in `npm run dev`, which is the worst possible ratio of a
    // silently-broken path. This is asserted by REQUEST rather than by grep so
    // that a helper could not make it pass while building the same wrong URL.
    const { loadMoneySeries } = await import('../lib/csv')
    await loadMoneySeries()
    expect(requests).toEqual([
      `${import.meta.env.BASE_URL}data/us_money_market_monthly_2000_2025.csv`,
    ])
    // And the prefix is the one vite.config declares, not a default of `/`.
    expect(import.meta.env.BASE_URL).toBe('/macro-economics/')
    expect(readSource('lib/csv.ts')).toContain('import.meta.env.BASE_URL')
    // No other page builds a data path, so there is no second one to get wrong.
    expect(stripComments(readSource('pages/DataExplorer.tsx'))).not.toMatch(/["'`]\/data\//)
  })

  it('parses the file it actually ships, header included', () => {
    // Asserted against the real artifact rather than a sample, so a column
    // rename in the export cannot leave this page rendering an empty chart.
    const csv = readFileSync(join(SRC, '..', 'public', 'data', 'us_money_market_monthly_2000_2025.csv'), 'utf8')
    const points = parseMoneySeries(csv)
    expect(points.length).toBeGreaterThan(200)
    // `Mon YYYY`, with the year at the END. The axis formatter and the two
    // figure labels both read that year, and `slice(0, 4)` on this string
    // produces the label "M2 growth since Jan".
    expect(points[0]!.date).toMatch(/^[A-Z][a-z]{2} \d{4}$/)
    expect(points[0]!.date.slice(-4)).toBe('2000')
  })
})

describe('the data explorer is four states, not one', () => {
  it('reserves the plot geometry while loading, so the page does not jump', async () => {
    mode = { kind: 'hang' }
    const { container } = dataPage()
    // A layout that reserves 0px and then grows 400px when the data lands is a
    // page that moves under the reader, which is the same complaint as a
    // chart that animates.
    expect(container.querySelector('.plot-frame')).not.toBeNull()
    expect(screen.getByRole('status')).toHaveTextContent(/loading the dataset/i)
    // Not a shimmer: a shimmer is an animation, and a reader who asked for a
    // still page should get one whether or not the animation honours it.
    expect(readSource('index.css')).not.toMatch(/@keyframes[^{]*skeleton/i)
    release?.()
  })

  it('names what failed and offers a retry, because this page can genuinely fail', async () => {
    mode = { kind: 'fail', status: 404 }
    dataPage()
    await waitFor(() => expect(screen.getByRole('heading', { name: /did not load/i })).toBeInTheDocument())
    // The message carries the dataset and the HTTP status, because that is
    // what a reader reporting the problem has to be able to say.
    expect(screen.getByText(/404/)).toBeInTheDocument()
    expect(document.body.textContent).toContain('us_money_market_monthly_2000_2025.csv')
    // And a way out that is not a retry, for a reader who does not need the data.
    expect(screen.getByRole('link', { name: /Read the glossary/ })).toHaveAttribute('href', '/glossary')
  })

  it('re-runs the fetch when the reader asks it to', async () => {
    mode = { kind: 'fail', status: 500 }
    dataPage()
    await waitFor(() => expect(screen.getByRole('button', { name: /Try again/ })).toBeInTheDocument())
    expect(requests).toHaveLength(1)
    mode = { kind: 'ok', body: DATASET }
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }))
    await waitFor(() => expect(requests).toHaveLength(2))
    expect(screen.getByText(/monthly observations/)).toBeInTheDocument()
  })

  it('reports a fetch that succeeded and parsed to nothing as its own fault', async () => {
    // Different fault, different fix: a 404 and an empty file both render no
    // chart, and conflating them tells a reader to check the network when the
    // export script is what broke.
    mode = { kind: 'ok', body: 'Date,M2_Money_Supply_Trillions,Federal_Funds_Rate_Percent' }
    dataPage()
    await waitFor(() => expect(screen.getByRole('heading', { name: /was empty/i })).toBeInTheDocument())
    expect(screen.getByText(/not a network problem/i)).toBeInTheDocument()
  })

  it('draws the plot, the figures and the legend once the data is in', async () => {
    dataPage()
    await waitFor(() => expect(screen.getByText(/monthly observations/)).toBeInTheDocument())
    // 3 rows of real numbers, parsed by the real parser.
    expect(screen.getByText('$22.35T')).toBeInTheDocument()
    // Cumulative percent change, and the sign carried on the value.
    expect(screen.getByText('+375%')).toBeInTheDocument()
    // Percentage POINTS, not percent — a rate that goes 5.45 to 3.88 has
    // fallen 1.57 points, and 1.57% RELATIVE to 5.45 is a different number
    // that this page must not print.
    expect(screen.getByText('-1.57 pp')).toBeInTheDocument()
    expect(screen.getByText(/percentage points/)).toBeInTheDocument()
    // The year comes off the END of a `Mon YYYY` date.
    expect(screen.getByText(/M2 growth since 2000/)).toBeInTheDocument()
    // All three figures are the same class, so all three are columns. The
    // rate change was a bare `<span>` next to two `.stat-tile-value`s, which
    // is 1-2px of horizontal jitter against its neighbours.
    const values = [...document.querySelectorAll('.stat-tile-value')]
    expect(values).toHaveLength(3)
    expect(values.map((v) => v.textContent)).toEqual(['$22.35T', '+375%', '-1.57 pp'])
    // The class carries it in the stylesheet rather than as a utility, so that
    // is where the assertion has to be.
    const css = readSource('index.css').replace(/\/\*[\s\S]*?\*\//g, '')
    const rule = css.match(/\.stat-tile-value\s*\{([^}]*)\}/)![1]!
    expect(rule).toMatch(/font-variant-numeric:\s*tabular-nums/)
  })

  it('names the units on the axes, the legend and the tooltip', async () => {
    dataPage()
    await waitFor(() => expect(screen.getByText(/monthly observations/)).toBeInTheDocument())
    const legend = screen.getByRole('list')
    // Two axes, two units, and a legend that repeats them: a legend saying
    // "M2" beside an axis saying "$ trillions" makes the reader do the units.
    expect(within(legend).getByRole('button', { name: 'M2 money supply ($T)' })).toBeInTheDocument()
    expect(within(legend).getByRole('button', { name: 'Fed funds rate (%)' })).toBeInTheDocument()
    const source = stripComments(readSource('pages/DataExplorer.tsx'))
    expect(source).toContain("value: 'M2 ($ trillions)'")
    expect(source).toContain("value: 'Effective federal funds rate (%)'")
  })
})

describe('the data explorer legend is a control, like every other chart', () => {
  const legendButtons = async () => {
    dataPage()
    await waitFor(() => expect(screen.getByText(/monthly observations/)).toBeInTheDocument())
    return {
      m2: screen.getByRole('button', { name: 'M2 money supply ($T)' }),
      rate: screen.getByRole('button', { name: 'Fed funds rate (%)' }),
    }
  }

  it('replaced the inert Recharts legend with two operable buttons', async () => {
    const { m2, rate } = await legendButtons()
    // `aria-pressed` is TRUE while the series is VISIBLE, and the name does
    // not change, so the control is one button and not two.
    expect(m2.tagName).toBe('BUTTON')
    expect(m2).toHaveAttribute('aria-pressed', 'true')
    expect(rate).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(m2)
    expect(m2).toHaveAttribute('aria-pressed', 'false')
    // The non-colour half of the hidden state.
    expect(m2.className).toMatch(/is-inactive/)
    expect(rate.className).not.toMatch(/is-inactive/)
    expect(screen.getByRole('button', { name: 'Show all' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Show all' }))
    expect(m2).toHaveAttribute('aria-pressed', 'true')
    expect(m2.className).not.toMatch(/is-inactive/)
  })

  it('pins the domain on every axis, so a hide cannot rescale the plot', () => {
    // Recharts derives an auto-domain from the VISIBLE series, so without
    // `includeHidden` on all three, hiding one of two re-scales the axes and
    // every remaining line appears to move — a legend toggle asserting
    // something false about the data. Counted, not pattern-matched: a third
    // axis added without the prop is exactly the regression.
    const bare = stripComments(readSource('pages/DataExplorer.tsx'))
    const spreads = (bare.match(/\{\.\.\.chartTheme\.(?:axis|yAxis)\}/g) ?? []).length
    expect(spreads).toBe(3)
    expect((bare.match(/includeHidden/g) ?? []).length).toBe(spreads)
    // And each series is actually hidden rather than drawn pale.
    expect((bare.match(/hide=\{series\.isHidden\(/g) ?? []).length).toBe(2)
  })

  it('imports no Recharts component directly, so the boundary is one module', () => {
    // `charts.test.tsx` asserts that only `ChartPrimitives.tsx` silences a
    // Recharts component; a file importing the shells straight from the
    // library is a file reading four unreviewed defaults. The shells are
    // re-exported from that module, so the assertion is about the decision
    // and not about the import path alone.
    const source = readSource('pages/DataExplorer.tsx')
    expect(source).not.toMatch(/from ['"]recharts['"]/)
    const primitives = readSource('components/ChartPrimitives.tsx')
    for (const shell of ['CartesianGrid', 'LineChart', 'ResponsiveContainer', 'Tooltip', 'XAxis', 'YAxis']) {
      expect(primitives, shell).toContain(shell)
    }
    // And it no longer carries Recharts' own legend at all.
    expect(stripComments(source)).not.toMatch(/<Legend\b/)
    expect(stripComments(source)).toContain('<ChartLegend')
  })

  it('draws in the same 400px frame as every other chart on the site', () => {
    // It was the only chart in a 420px frame, on the argument that a second
    // y-axis and a legend need the room. Recharts positions its legend
    // absolutely INSIDE the plot box and reserves no height for it, so the
    // extra 20px made the axis shorter and pushed the x tick labels over the
    // plot. 400px is what makes a number mean the same height here and in a
    // tool. `density.test.ts` guards the declarations.
    const source = stripComments(readSource('pages/DataExplorer.tsx'))
    expect(source).toContain('className="plot-frame"')
    expect(source).not.toMatch(/h-\[[^\]]*px\]/)
  })
})

describe('the data explorer: the one control that draws nothing', () => {
  it('is a checkbox and not a legend chip', async () => {
    dataPage()
    await waitFor(() => expect(screen.getByText(/monthly observations/)).toBeInTheDocument())
    const overlay = screen.getByRole('checkbox', { name: /Theory overlay/ })
    expect(overlay).not.toBeChecked()
    expect(screen.queryByRole('button', { name: /Theory overlay/ })).toBeNull()
    fireEvent.click(overlay)
    expect(overlay).toBeChecked()
    expect(screen.getByRole('heading', { name: /What the models say/ })).toBeInTheDocument()
    // The legend is a list of things that remove something from the plot, and
    // this reveals prose. Putting it in the legend would put a control that
    // draws nothing in a list of controls that do.
    const legend = document.querySelector<HTMLElement>('.chart-legend')!
    expect(within(legend).getAllByRole('button')).toHaveLength(2)
  })

  it('labels its checkbox, so the control has a name and not just a box', async () => {
    dataPage()
    await waitFor(() => expect(screen.getByText(/monthly observations/)).toBeInTheDocument())
    // A native checkbox in a `<label>` is named by the label's text, which is
    // the whole accessible name: nothing else on the page is a control.
    const boxes = screen.getAllByRole('checkbox')
    expect(boxes).toHaveLength(1)
    expect(boxes[0]).toHaveAccessibleName('Theory overlay')
  })
})
