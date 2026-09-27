import type { ReactElement } from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import ToolsIndex from '../pages/ToolsIndex'
import CaseStudyPage from '../pages/CaseStudyPage'
import NotFound from '../pages/NotFound'
import ToolPage from '../pages/ToolPage'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'
import type { ToolId } from '../../../content/lectures'
import { markLectureComplete, toggleLectureComplete } from '../learning/progress'

/**
 * The entry pages, and the three things they are actually for.
 *
 * Every route here is the first or the last thing a visitor sees, which is
 * also why they are the pages the earlier passes never reached: nothing inside
 * a lecture depends on the home page, so nothing in a lecture breaks when the
 * home page is wrong. That is exactly the code that rots.
 *
 * The assertions are grouped by the claim they defend:
 *
 *  - ORIENTATION. The home page has to say where the reader is in a 25-lecture
 *    course, and the tool index has to be findable at 20 items. Those are the
 *    two features the brief asked for and the two that can silently stop.
 *  - THE MEASURE. `ch` resolves against an element's own font size, so a
 *    reading column and the prose it introduces were two different widths for
 *    the same nominal measure. jsdom has no layout, so the rendered width
 *    cannot be asserted here; what CAN be is the thing that causes it, which
 *    is the two elements disagreeing about their font size.
 *  - HONESTY. A dead end that links to dead ends, a figure whose grid is a
 *    different colour from every real chart, a button that copies nothing, and
 *    an internal navigation that bypasses the router. None of these are
 *    visible in a screenshot of a page that works.
 */

const SRC = join(__dirname, '..')
const CSS = readFileSync(join(SRC, 'index.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

function readSource(relative: string): string {
  return readFileSync(join(SRC, relative), 'utf8')
}

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

function renderAt(routePath: string, entry: string, element: ReactElement) {
  const router = createMemoryRouter([{ path: routePath, element }], { initialEntries: [entry] })
  return render(<RouterProvider router={router} />)
}

/** The route table in `router.tsx`, as full paths, splat excluded. */
function staticRoutePaths(): Set<string> {
  const source = readFileSync(join(SRC, 'router.tsx'), 'utf8')
  const paths = [...source.matchAll(/path:\s*'([^':]+)'/g)].map((m) => m[1])
  return new Set(paths.map((p) => (p.startsWith('/') ? p : `/${p}`)))
}

afterEach(cleanup)

/** Lecture and tool titles go into matchers, and they contain `.` and `-`. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/* ================================================================== *
 * The home page
 * ================================================================== */

describe('home page: the sections a first-time visitor arrives at', () => {
  it('renders all four sections in order', () => {
    renderAt('/', '/', <Home />)
    const headings = screen
      .getAllByRole('heading', { level: 2 })
      .map((h) => h.textContent)
    expect(headings).toEqual(['Learning paths', 'Featured tools', 'Case studies', 'How to use this site'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/move the curves/i)
  })

  it('states the size of the course from the data, not from a literal', () => {
    renderAt('/', '/', <Home />)
    expect(
      screen.getByText(
        new RegExp(`${LECTURES.length} lectures, ${Object.keys(TOOLS).length} simulation tools`)
      )
    ).toBeInTheDocument()
  })

  it('is a real dl whose values are the course size', () => {
    const { container } = renderAt('/', '/', <Home />)
    const strip = container.querySelector('dl')
    expect(strip).not.toBeNull()
    const terms = [...strip!.querySelectorAll('dt')].map((dt) => dt.textContent)
    const values = [...strip!.querySelectorAll('dd')].map((dd) => dd.textContent)
    expect(terms).toEqual(['Lectures', 'Interactive tools', 'Case studies', 'Lecture tiers'])
    expect(values).toEqual([
      String(LECTURES.length),
      String(Object.keys(TOOLS).length),
      String(CASE_STUDIES.length),
      '3',
    ])
    // The band is a band: hairlines, no fill, no card.
    expect(strip!.className).toMatch(/border-y/)
    expect(strip!.className).not.toMatch(/\bcard\b|bg-surface/)
    // The value is a figure, so its digits are columns.
    expect(strip!.querySelector('dd')!.className).toMatch(/tabular-nums/)
  })

  it('points each learning path at the first lecture of that tier', () => {
    renderAt('/', '/', <Home />)
    for (const tier of ['beginner', 'intermediate', 'advanced'] as const) {
      const first = LECTURES.filter((l) => l.tier === tier)[0]
      const link = screen.getByRole('link', { name: new RegExp(`Begin at lecture ${first.n}\\b`) })
      expect(link).toHaveAttribute('href', `/lecture/${first.n}`)
    }
  })

  it('names the lectures in a tier as runs, not as a span that includes other tiers', () => {
    // The tiers interleave: 7, 8 and 9 sit between 6 and 10, so "Lectures 1-10"
    // for a seven-lecture tier claims four lectures that belong to another row.
    renderAt('/', '/', <Home />)
    const row = screen.getByRole('link', { name: /Begin at lecture 1\b/ }).closest('li')!
    const beginner = LECTURES.filter((l) => l.tier === 'beginner').map((l) => l.n)
    // Round trip: expand the runs the row actually prints and compare with the
    // tier. That is stronger than either "contains 1-6, 10" or "not 1-10" —
    // it fails if a lecture is missing AND if a lecture from another tier is
    // included, which is the mistake a first-and-last range makes.
    const printed = (row.textContent ?? '').split(' · ')[1] ?? ''
    const expanded = printed.split(', ').flatMap((part) => {
      const [from, to] = part.split('–')
      if (!to) return [Number(from)]
      const run: number[] = []
      for (let n = Number(from); n <= Number(to); n += 1) run.push(n)
      return run
    })
    expect(expanded).toEqual(beginner)
  })

  it('shows the tools, with the lectures that teach each one', () => {
    renderAt('/', '/', <Home />)
    const card = screen.getByRole('link', { name: /IS-LM Equilibrium Explorer/ })
    const taught = LECTURES.filter((l) => l.tools.includes('is-lm-explorer')).map((l) => l.n)
    expect(card).toHaveAttribute('href', '/tool/is-lm-explorer')
    expect(card).toHaveTextContent(
      taught.length === 1 ? 'Taught in lecture' : `Taught in lectures ${taught[0]}`,
    )
  })

  it('raises the hero figure on the elevation scale, not the legacy alias', () => {
    const { container } = renderAt('/', '/', <Home />)
    const figure = container.querySelector('figure')
    expect(figure).not.toBeNull()
    // The plate the figure sits in: elev-2 with the lit edge, and the plate's
    // own composite class nowhere on it.
    const plate = figure!.closest('div')!
    expect(plate.className).toMatch(/elev-2/)
    expect(plate.className).toMatch(/edge-lit/)
    expect(plate.className).not.toMatch(/shadow-card|shadow-plate/)
  })
})

describe('home page: what a returning reader is told', () => {
  it('tells a reader with progress how far along they are and what is next', () => {
    try {
      for (const n of [1, 2, 3]) markLectureComplete(n)
      renderAt('/', '/', <Home />)
      expect(screen.getByText(`3 of ${LECTURES.length} complete.`)).toBeInTheDocument()
      const done = [1, 2, 3]
      const next = LECTURES.filter((l) => !done.includes(l.n)).sort((a, b) => a.n - b.n)[0]
      const link = screen.getByRole('link', { name: new RegExp(`Next: ${next.n}\\.`) })
      expect(link).toHaveAttribute('href', `/lecture/${next.n}`)
      // The first tier is partly done, so its row carries both a count and a
      // resume point rather than a "Begin" that would throw the reader back to
      // lecture 1.
      const beginner = LECTURES.filter((l) => l.tier === 'beginner')
      expect(
        screen.getByRole('link', { name: new RegExp(`Continue at lecture 4\\b`) })
      ).toHaveAttribute('href', '/lecture/4')
      expect(
        screen.getByText(`${done.length} of ${beginner.length} complete`)
      ).toBeInTheDocument()
    } finally {
      for (const n of [1, 2, 3]) toggleLectureComplete(n)
    }
  })

  it('says nothing about progress to a reader who has none', () => {
    renderAt('/', '/', <Home />)
    expect(screen.queryByText(new RegExp(`of ${LECTURES.length} complete`))).not.toBeInTheDocument()
    expect(screen.queryByText(/^Next: /)).not.toBeInTheDocument()
  })
})

/* ================================================================== *
 * The hero figure
 * ================================================================== */

describe('the hero figure', () => {
  it('draws its grid with the chart token, so it reads as the same instrument', () => {
    const source = readSource('components/HeroFigure.tsx')
    expect(source).toContain("stroke: 'var(--c-grid)'")
    expect(source).not.toMatch(/GRID[^}]*var\(--c-border\)/)
    // And the token is a real one, defined in both themes.
    expect(CSS).toMatch(/--c-grid:/)
    expect(decl(':root', '--c-grid')).not.toBe('')
  })

  it('scales its labels with the reader text size without moving the geometry', () => {
    const source = readSource('components/HeroFigure.tsx')
    // A viewBox is in user units, so the labels have to ask for the root
    // multiplier themselves or they shrink relative to the prose at 130%.
    expect(source).toMatch(/fontSize: 'calc\(11px \* var\(--pref-text-scale, 1\)\)'/)
    expect(source).toMatch(/fontSize: 'calc\(10\.5px \* var\(--pref-text-scale, 1\)\)'/)
    // The Bézier invariant: both curves' control points share an x, so at
    // t=0.5 they land on the equilibrium marker.
    expect(source).toMatch(/d="M52 58C130 96 210 150 296 186"/)
    expect(source).toMatch(/d="M52 182C130 156 210 96 296 52"/)
    expect(source).toMatch(/cx="171" cy="123"/)
  })

  it('is described once, by a caption both audiences can read', () => {
    const { container } = renderAt('/', '/', <Home />)
    const caption = container.querySelector('figcaption')
    // Complete enough to stand on its own: the axes, the shape, and the marker.
    expect(caption?.textContent).toMatch(/output \(Y\) against the interest rate \(r\)/)
    expect(caption?.textContent).toMatch(/where the two cross/)
    // The drawing carries no name of its own, so the caption is not read twice.
    const svg = container.querySelector('figure svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('role')
    expect(svg).not.toHaveAttribute('aria-label')
    // `fill="var(--c-x)"` is silently invalid: presentation attributes are not
    // CSS, so the whole style move exists to keep colours in declarations.
    for (const node of container.querySelectorAll('svg *')) {
      for (const attr of ['fill', 'stroke'] as const) {
        if (!node.hasAttribute(attr)) continue
        expect(node.getAttribute(attr), `${node.tagName}[${attr}]`).not.toMatch(/var\(/)
      }
    }
  })
})

/* ================================================================== *
 * The tool index
 * ================================================================== */

describe('tool index', () => {
  const search = () => screen.getByLabelText(/search tools/i)

  it('lists every registered tool, alphabetised, and says how many there are', () => {
    const { container } = renderAt('/tools', '/tools', <ToolsIndex />)
    const titles = [...container.querySelectorAll('h3')].map((h) => h.textContent)
    expect(titles).toHaveLength(Object.keys(TOOLS).length)
    expect([...titles].sort((a, b) => a!.localeCompare(b!))).toEqual(titles)
    expect(screen.getByText(`${Object.keys(TOOLS).length} of ${Object.keys(TOOLS).length} tools`)).toBeInTheDocument()
  })

  it('finds a tool by any word of its name or description', () => {
    const { container } = renderAt('/tools', '/tools', <ToolsIndex />)
    fireEvent.change(search(), { target: { value: 'curve phillips' } })
    const titles = [...container.querySelectorAll('h3')].map((h) => h.textContent)
    expect(titles.length).toBeGreaterThan(0)
    for (const t of titles) expect(t!.toLowerCase()).toContain('phillips')
  })

  it('matches case-insensitively and ignores a missing term only by finding nothing', () => {
    renderAt('/tools', '/tools', <ToolsIndex />)
    fireEvent.change(search(), { target: { value: 'MUNDELL' } })
    expect(screen.getByRole('heading', { name: /Mundell-Fleming Policy Lab/ })).toBeInTheDocument()
  })

  it('composes the query with the tier filter', () => {
    const { container } = renderAt('/tools', '/tools', <ToolsIndex />)
    fireEvent.click(screen.getByRole('button', { name: 'Beginner' }))
    const beginner = (Object.keys(TOOLS) as ToolId[]).filter((id) => TOOLS[id].category === 'beginner')
    expect(container.querySelectorAll('h3')).toHaveLength(beginner.length)
    fireEvent.change(search(), { target: { value: 'multiplier' } })
    const titles = [...container.querySelectorAll('h3')].map((h) => h.textContent)
    expect(titles).toEqual(['Multiplier Effect Simulator'])
  })

  it('answers a query that matches nothing, and gets out of the way again', () => {
    renderAt('/tools', '/tools', <ToolsIndex />)
    fireEvent.change(search(), { target: { value: 'hyperbolic' } })
    expect(screen.getByRole('heading', { name: /No tool matches that/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Show all 20 tools/ })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Show all \d+ tools/ }))
    expect(screen.queryByRole('heading', { name: /No tool matches that/ })).not.toBeInTheDocument()
    expect(search()).toHaveValue('')
  })

  it('reports the selected filter to assistive technology, and offers a way back', () => {
    renderAt('/tools', '/tools', <ToolsIndex />)
    const all = screen.getByRole('button', { name: 'All' })
    const advanced = screen.getByRole('button', { name: 'Advanced' })
    expect(all).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(advanced)
    expect(advanced).toHaveAttribute('aria-pressed', 'true')
    expect(all).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(screen.getByRole('button', { name: /Clear/ }))
    expect(all).toHaveAttribute('aria-pressed', 'true')
  })
})

/* ================================================================== *
 * The case study page
 * ================================================================== */

describe('case study page', () => {
  const study = CASE_STUDIES[0]

  it('frames the simulation and links the lectures it draws on', () => {
    renderAt('/case/:slug', `/case/${study.slug}`, <CaseStudyPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(study.title)
    const related = study.relatedLectures
      .map((n) => LECTURES.find((l) => l.n === n))
      .filter(Boolean)
    for (const lecture of related) {
      expect(screen.getByRole('link', { name: new RegExp(`Lecture ${lecture!.n}:`) })).toHaveAttribute(
        'href',
        `/lecture/${lecture!.n}`
      )
    }
  })

  it('offers the other case studies, so one is not a dead end', () => {
    renderAt('/case/:slug', `/case/${study.slug}`, <CaseStudyPage />)
    const others = CASE_STUDIES.filter((s) => s.slug !== study.slug)
    expect(others).toHaveLength(CASE_STUDIES.length - 1)
    for (const other of others) {
      expect(screen.getByRole('link', { name: new RegExp(other.title) })).toHaveAttribute(
        'href',
        `/case/${other.slug}`
      )
    }
  })

  it('says so when the slug is not one of them, and points at the index', () => {
    renderAt('/case/:slug', '/case/not-a-case', <CaseStudyPage />)
    expect(screen.getByRole('heading', { name: /Case study not found/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /one page/ })).toHaveAttribute('href', '/cases')
  })
})

/* ================================================================== *
 * The tool page chrome
 * ================================================================== */

describe('tool page chrome', () => {
  it('says which lectures teach the tool, as a lookup a reader can click', () => {
    renderAt('/tool/:id', '/tool/is-lm-explorer', <ToolPage />)
    const related = LECTURES.filter((l) => l.tools.includes('is-lm-explorer'))
    expect(related.length).toBeGreaterThan(0)
    for (const lecture of related) {
      const name = new RegExp(`^${lecture.n}\\. ${escapeRegExp(lecture.title)}$`)
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', `/lecture/${lecture.n}`)
    }
  })

  it('will not offer to copy a scenario link that would carry nothing', () => {
    // `SliderControl` and `NumberInput` register themselves in
    // `lib/controlRegistry.ts`, so a link carries exactly the controls the tool
    // has mounted. Rendered here the tool body never mounts — the router is
    // given the page in isolation, and the tool is a lazy chunk — so nothing
    // registers, and the control reports that rather than encoding an empty
    // payload.
    //
    // The wording changed once from "this tool has no settings on screen" to
    // "loading", because that first sentence was false for every one of the
    // twenty tools: they all have controls, and the empty registry during the
    // download window was being read as a tool that has none. The assertion
    // that matters is the one above it — the control is disabled, and it is
    // described rather than silently inert.
    renderAt('/tool/:id', '/tool/is-lm-explorer', <ToolPage />)
    const button = screen.getByRole('button', { name: /Copy scenario link/ })
    expect(button).toBeDisabled()
    const describedBy = button.getAttribute('aria-describedby')
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!)?.textContent).toMatch(
      /loading the simulation, so there is nothing to share yet/i,
    )
    // A tool that has mounted and still has nothing to say is a different
    // state, and the copy for it must not claim the tool is still loading.
    expect(document.getElementById(describedBy!)?.textContent).not.toMatch(
      /has no settings on screen/i,
    )
  })

  it('says so when the id is not a tool, and links the real index', () => {
    renderAt('/tool/:id', '/tool/not-a-tool', <ToolPage />)
    expect(screen.getByRole('heading', { name: /Tool not found/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /lists all 20/ })).toHaveAttribute('href', '/tools')
  })
})

/* ================================================================== *
 * The dead end
 * ================================================================== */

describe('the 404', () => {
  /** Every internal address the dead end offers, as the router sees them. */
  function deadEndLinks(): string[] {
    const { container, unmount } = renderAt('*', '/no/such/page', <NotFound />)
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href') ?? '')
    unmount()
    return hrefs
  }

  it('links only to routes that exist', () => {
    // Read the route table rather than repeating it, so a route that is
    // renamed or deleted fails here instead of shipping a second dead end.
    for (const href of deadEndLinks()) {
      expect(staticRoutePaths().has(href), `${href} is not a route in router.tsx`).toBe(true)
    }
  })

  it('covers every static route, so nothing is unreachable from the dead end', () => {
    const hrefs = deadEndLinks()
    for (const path of staticRoutePaths()) {
      if (path.includes('*')) continue
      expect(hrefs, `${path} is not linked from the 404`).toContain(path)
    }
  })

  it('echoes the address it rejected, so the reader knows which link is wrong', () => {
    renderAt('*', '/no/such/page', <NotFound />)
    expect(screen.getByText('/no/such/page')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found')
  })

  it('explains the three dynamic routes in terms of the real data', () => {
    renderAt('*', `/lecture/${LECTURES.length + 40}`, <NotFound />)
    expect(
      screen.getByText(new RegExp(`The course has ${LECTURES.length} lectures, numbered 1 to`))
    ).toBeInTheDocument()

    cleanup()
    renderAt('*', '/lecture', <NotFound />)
    expect(screen.getByText(/A lecture needs its number/)).toBeInTheDocument()

    cleanup()
    renderAt('*', '/tool/gdp', <NotFound />)
    expect(screen.getByText(/no tool called "gdp"/)).toBeInTheDocument()

    cleanup()
    renderAt('*', '/case/nope', <NotFound />)
    expect(screen.getByText(/no case study called "nope"/)).toBeInTheDocument()
  })

  it('says nothing it cannot know about an address it does not recognise', () => {
    renderAt('*', '/whatever', <NotFound />)
    expect(screen.queryByText(/needs its number/)).not.toBeInTheDocument()
    expect(screen.queryByText(/There is no/)).not.toBeInTheDocument()
  })
})

/* ================================================================== *
 * The measure
 * ================================================================== */

describe('the reading measure', () => {
  it('resolves ch at the same font size in a reading column and in the prose', () => {
    // This is the fix for the rag, and it is the whole fix: `ch` is resolved
    // against the element's own font size, so 70ch at 16px and 70ch at
    // 1.0625rem are two different widths — measured, 706.56px and 750.72px in
    // Chromium at the default settings, a 44.16px step in the right edge of
    // every page whose header introduces a `.prose-lecture` body. Asserting
    // the two declarations are equal asserts the disagreement cannot come back;
    // jsdom has no layout, so the rendered width is not assertable here.
    expect(decl('.reading-col', 'font-size')).toBe(decl('.prose-lecture', 'font-size'))
    expect(decl('.reading-col', 'max-width')).toBe('var(--pref-measure, 70ch)')
    expect(decl('.prose-lecture', 'max-width')).toBe('var(--pref-measure, 70ch)')
  })

  it('does not let a page header put its own font size back', () => {
    // The deck is a paragraph of prose at the prose size, not `text-base`.
    expect(readSource('components/ui.tsx')).not.toMatch(/reading-col[^"]*\btext-base\b/)
  })

  it('leaves the focus-mode compensation intact', () => {
    // Focus mode wraps the prose in a padded plate and adds the padding to the
    // measure so the CONTENT box still comes out at the measure.
    expect(ruleBody(":root[data-pref-focus='on'] .prose-lecture")).toMatch(
      /max-width:\s*calc\(var\(--pref-measure[^)]*\) \+ 2 \* var\(--space-6\) \+ 2px\)/
    )
  })
})

/* ================================================================== *
 * The rules these pages have to keep
 * ================================================================== */

const ENTRY_PAGES = [
  'pages/Home.tsx',
  'pages/ToolsIndex.tsx',
  'pages/CaseStudyPage.tsx',
  'pages/About.tsx',
  'pages/NotFound.tsx',
  'pages/ToolPage.tsx',
  'pages/Glossary.tsx',
  'pages/Syllabus.tsx',
  'pages/CasesIndex.tsx',
  'pages/ConceptMapPage.tsx',
  'pages/DataExplorer.tsx',
  'learning/ConceptMap.tsx',
  'components/ui.tsx',
  'components/HeroFigure.tsx',
]

describe('the entry pages stay inside the rules', () => {
  it('never navigates internally with a raw anchor', () => {
    for (const file of ENTRY_PAGES) {
      const source = readSource(file)
      for (const [, value] of source.matchAll(/<a\b[^>]*?\bhref=(["'`])([^"'`]*)\1/g)) {
        // Either an absolute URL, a local asset through BASE_URL, or a
        // same-page fragment. Internal navigation belongs to the router, so
        // those are the only three cases there is — and the fragment is the
        // fourth thing a raw anchor is legitimately for: a target on the
        // current page, which `Link` would turn into a route change.
        const external = /^https?:\/\//.test(value)
        const asset = value.includes('import.meta.env.BASE_URL')
        const fragment = /^#\S+$/.test(value)
        expect(external || asset || fragment, `${file}: <a href="${value}">`).toBe(true)
      }
      // A local asset addressed from the root breaks under a base path.
      expect(source, file).not.toMatch(/\b(?:src|href)\s*=\s*(?:\{)?["'`]\/(?!\/)/)
    }
  })

  it('leaves only the documented spacing values on the literal scale', () => {
    // A converted value has to be pixel-identical at `--pref-space: 1`, so
    // anything not on the 12-step scale stays a literal rather than being
    // snapped to a neighbour that is not the size it was. Padding on an
    // individual tap target stays literal too: `compact` must not shrink the
    // thing a reader has to hit. What is left here is the list, with a reason.
    const OFF_SCALE_OR_TAP_TARGET: Record<string, string[]> = {
      'pages/Home.tsx': [
        'gap-1', // icon and its label, inside one link
        'gap-2', // badge and its caption
        'gap-2.5', // 0.625rem, between the two hero buttons: off-scale
        'gap-14', // 3.5rem, the wide-viewport hero gutter: off-scale
        'mb-14', // 3.5rem, the section rhythm: off-scale
        'mt-1.5', // 0.375rem, under a case-study summary: off-scale
        'mt-7', // 1.75rem, under the hero buttons: off-scale
      ],
      'pages/ToolsIndex.tsx': [
        'gap-1', // icon and its label, inside the Clear button
        'gap-2', // level meter and its label, inside a filter pill
        'px-3.5',
        'py-1.5', // filter pill padding: a tap target
      ],
      'pages/CaseStudyPage.tsx': [
        'gap-2', // badge and its caption
        'px-3',
        'py-1', // lecture and case pills: tap targets
      ],
      'pages/About.tsx': ['gap-2.5'], // 0.625rem between the closing buttons: off-scale
      'pages/NotFound.tsx': [],
      'pages/ToolPage.tsx': [
        'gap-1.5', // checkbox and its label
        'mb-7', // 1.75rem above the taught-in band: off-scale
        'mr-1', // after a label, before the values it labels
        'px-2.5',
        'py-0.5', // lecture pills: tap targets
        'px-3',
        'py-1.5', // the All tools pill and the share button: tap targets
      ],
      'pages/Syllabus.tsx': [
        'gap-x-3', // 0.75rem between the three parts of one lecture row
        'gap-y-2', // 0.5rem, the same row wrapping at 390px
        'mb-2', // 0.5rem, between the progress figures and the bar
        'px-3.5', // 0.875rem, the row's side inset: a width decision
        'px-2',
        'py-0.5', // tool pills: tap targets
        'gap-1', // the play glyph and its label, inside the video link
        'gap-1.5', // the gap inside one composite group of pills
        'gap-2.5', // 0.625rem, level meter and its section label: off-scale
        'py-2.5', // the search field: a hit area
        'space-y-1.5', // 0.375rem, the gap between two lecture rows
      ],
      'pages/Glossary.tsx': [
        'py-2.5', // the search field: a hit area
        'gap-1', // icon and its label, inside Clear and Back to search
        'gap-y-1', // 0.25rem, the count/clear/hint row wrapping at 390px
        'px-1', // the / kbd, a 1px box outline rather than a control
        'px-2',
        'py-0.5', // the <code> spans in a definition: inline, not a target
      ],
      'pages/CasesIndex.tsx': [
        'gap-2', // badge and its period, inside the card's first row
        'px-2',
        'py-0.5', // lecture pills: tap targets
        'gap-1', // the play glyph, its label and the arrow, in "Open case"
        'gap-1.5', // the gap inside one composite group of pills
      ],
      'pages/ConceptMapPage.tsx': [],
      'learning/ConceptMap.tsx': [
        'gap-1', // the arrow and its label, in "Go to search"
        'gap-1.5', // the interior gap between two pills
        'gap-2', // the checkbox-style gap, level meter and its label
        'gap-2.5', // 0.625rem, level meter and its section label: off-scale
        'gap-x-3', // 0.75rem between the two tool links in a card footer
        'gap-y-1', // 0.25rem, the count/clear row wrapping at 390px
        'mt-0.5', // 0.125rem, aligning the tick with the title's cap height
        'px-2',
        'py-0.5', // concept pills: not tap targets, but 0.125rem is the pill
        'py-2.5', // the search field: a hit area
        'space-y-10', // 2.5rem, the gap between the four tier sections: past
        // the top of the 12-step scale, and a page rhythm rather than a gap
        // between two objects
      ],
      'pages/DataExplorer.tsx': [
        'gap-x-5', // 1.25rem between the three series toggles
        'gap-y-2', // 0.5rem, the same row wrapping
        'gap-2', // the interior gap of a checkbox and its label
        'px-1.5',
        'py-0.5', // <code> spans: inline, not tap targets
        'space-y-2', // 0.5rem between the three theory bullets
        'pl-5', // 1.25rem, the list indent: a measure, not a rhythm
        'py-px', // 1px, the / kbd: a box outline, not a control
      ],
      'components/ui.tsx': [
        'gap-1', // icon and its label, inside a link or a heading row
        'gap-2', // badge and its caption
        'gap-3', // gap inside a stat figure, between value and label
        'px-4', // the axis label, outside the stat figure: tap target
      ],
      'components/HeroFigure.tsx': ['m-0'], // figure: the UA default margin, off-scale
    }
    const SPACING = /(?<![\w-])(?:[a-z]+:)*(p[xytrbl]?|m[xytrbl]?|gap|gap-[xy]|space-[xy])-(\d+(?:\.\d+)?)(?![\w-])/g
    for (const [file, allowed] of Object.entries(OFF_SCALE_OR_TAP_TARGET)) {
      const found = new Set(
        [...readSource(file).matchAll(SPACING)].map((m) => `${m[0].replace(/^[a-z]+:/, '')}`)
      )
      for (const value of found) {
        expect(allowed, `${file}: \`${value}\` is off the density scale with no reason`).toContain(value)
      }
    }
  })
})
