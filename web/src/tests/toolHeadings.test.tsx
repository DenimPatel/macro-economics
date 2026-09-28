/**
 * What a reader moving by heading finds on the twenty tool pages.
 * ============================================================================
 *
 * The tool contract in `tools.test.tsx` holds the heading VOCABULARY: a tool
 * writes `h2` and nothing else, and the one `h3` producer is `ToolComponents`.
 * This file holds the other half, which the vocabulary cannot see — where a
 * heading LANDS.
 *
 * `ToolNote`'s default title level is 3, and 3 is right for an aside: a note
 * inside a section the tool already wrote as an `h2`. It is wrong for a note
 * that is itself a section, and the rule that was written down to prevent that
 * only described notes at the TOP of a page. Thirteen of the twenty tools
 * carried a note between or after their `h2` sections at the default, so their
 * outline read `… h2, h2, h3`: a reader's heading list shows a closing "Key
 * insights" note as a child of whichever section happened to be last, and
 * `LaborMarket`'s "Inflation Pressures" note as a child of the WS/PS diagram
 * with the policy experiment underneath it.
 *
 * These are asserted against the RENDERED pages rather than against the source,
 * for one reason: "is this note a top-level block of the tool" is a statement
 * about the DOM, not about the text. A source scan would have to re-derive the
 * nesting, and the nesting is the thing. The scan cannot be satisfied by
 * finding nothing, either — the number of notes it looked at is asserted, and
 * so is the number of top-level ones, which is the population the whole
 * assertion is about.
 *
 * The h1 assertions are here for the same reason they are not in
 * `tools.test.tsx`: the name on `/tools`, the name in the breadcrumb and the
 * name in the tab all come from the `TOOLS` registry, and the name on the page
 * came from the tool. Two tools rendered the SAME `<h1>`, and four more
 * rendered a second name for themselves.
 */
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { createElement } from 'react'
import ToolPage from '../pages/ToolPage'
import { clearControls } from '../lib/controlRegistry'
import { TOOLS } from '../store'
import type { ToolId } from '../../../content/lectures'

/**
 * A view a note is hidden behind until the reader asks for it.
 *
 * `ModernISCurve` keeps its "Financial Conditions" panel behind a tab, so its
 * one note is not in the default DOM. A check that only opened each tool would
 * have missed it — and it already passes `headingLevel={2}`, so it would have
 * been a miss with no consequence today. It is listed anyway, because a
 * conditional note is exactly the kind of thing a default-view scan cannot see
 * and the next agent is the one who adds the next one.
 */
const EXTRA_VIEWS: Partial<Record<ToolId, string>> = {
  'modern-is-curve': 'Financial Conditions',
}

afterEach(() => {
  cleanup()
  clearControls()
})

async function openToolPage(toolId: ToolId) {
  cleanup()
  const view = render(
    createElement(
      MemoryRouter,
      { initialEntries: [`/tool/${toolId}`] },
      createElement(
        Routes,
        null,
        createElement(Route, { path: '/tool/:id', element: createElement(ToolPage) }),
      ),
    ),
  )
  await within(view.container).findByRole('heading', { level: 1 }, { timeout: 4000 })
  const extra = EXTRA_VIEWS[toolId]
  if (extra) {
    // Looked up BY NAME and pressed, rather than pressed by position: a click
    // on the wrong control leaves the view short, the note unasserted, and the
    // test green. `findByRole` throws if the control is not there, so a renamed
    // tab fails instead of quietly asserting nothing.
    const tab = await within(view.container).findByRole('button', { name: extra })
    await act(async () => {
      fireEvent.click(tab)
    })
  }
  return view
}

/**
 * The tool's own root: the element `ToolHeader` sits in.
 *
 * Deliberately not a class name. Fourteen tools use `.tool-card`, one uses
 * `.tool-container`, and a scan keyed on either would quietly skip a tool whose
 * wrapper is renamed — which is the "it found nothing" failure with a class
 * list in it. `ToolHeader`'s `header.tool-heading` is the one element every
 * tool renders through the shared component, and its parent is by definition
 * the tool's root.
 */
function toolRoot(container: HTMLElement): HTMLElement {
  const header = container.querySelector<HTMLElement>('.tool-heading')
  const root = header?.parentElement
  if (!root) throw new Error('no ToolHeader, so no tool root')
  return root as HTMLElement
}

interface Note {
  title: string
  tag: string
  topLevel: boolean
}

function notesIn(container: HTMLElement): Note[] {
  const root = toolRoot(container)
  return [...container.querySelectorAll<HTMLElement>('.note__title')].map((el) => ({
    title: (el.textContent ?? '').trim(),
    tag: el.tagName,
    topLevel: el.closest('section')?.parentElement === root,
  }))
}

const toolIds = Object.keys(TOOLS) as ToolId[]

describe('a note is at the level of the thing it is', () => {
  it('renders a top-level note as a section, and only a nested one as an aside', async () => {
    const offenders: string[] = []
    let notes = 0
    let topLevel = 0
    for (const toolId of toolIds) {
      const view = await openToolPage(toolId)
      for (const note of notesIn(view.container)) {
        notes++
        if (note.topLevel) {
          topLevel++
          if (note.tag !== 'H2') offenders.push(`${toolId}: "${note.title}" is ${note.tag}, a top-level note`)
        }
      }
    }
    // The population the assertion is about, counted rather than assumed. A
    // scan that found no notes — because the root lookup broke, or the class
    // on the note's title was renamed — would report no offenders and pass.
    expect(notes, 'no ToolNote titles were found on any tool page').toBeGreaterThan(0)
    expect(topLevel, 'no top-level ToolNote was found, so the rule was vacuous').toBeGreaterThan(0)
    expect(offenders, 'a note that is a top-level block of its tool, one level below the sections').toEqual([])
  })

  it('leaves no skipped level between the page title and the first section', async () => {
    // The reason the default exists at all, and the shape the old rule
    // covered: a tool whose first heading is a note needs the note at 2, or the
    // outline runs `h1 → h3`. Asserted on the outline rather than on the prop
    // so it holds whichever way a tool is written.
    const offenders: string[] = []
    let deepest = 0
    for (const toolId of toolIds) {
      const view = await openToolPage(toolId)
      let previous = 1
      for (const heading of view.container.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
        const level = Number(heading.tagName[1])
        if (level > previous + 1) {
          offenders.push(`${toolId}: h${previous} → h${level} at "${(heading.textContent ?? '').trim()}"`)
        }
        previous = level
        deepest = Math.max(deepest, level)
      }
    }
    // The scan has to have walked real outlines. A heading query that matched
    // nothing would leave `deepest` at its initial value and pass.
    expect(deepest, 'no headings beyond the h1 were found on any tool page').toBeGreaterThan(1)
    expect(offenders, 'a heading more than one level below the one before it').toEqual([])
  })
})

describe('a tool page is named once', () => {
  it('heads the page with the name the index and the breadcrumb use', async () => {
    // The registry name is what `/tools` lists, what the breadcrumb on the tool
    // page prints, what the document title is set from, and what every lecture
    // link says. The `<h1>` came from the tool instead, so a page could answer
    // "what is this page about" with a second name — and two tools answered it
    // with the same one, which is the failure a heading list cannot survive.
    const offenders: string[] = []
    for (const toolId of toolIds) {
      const view = await openToolPage(toolId)
      const h1 = view.container.querySelector('h1')?.textContent?.trim() ?? ''
      if (h1 !== TOOLS[toolId].title) {
        offenders.push(`${toolId}: <h1> "${h1}" is not the registry's "${TOOLS[toolId].title}"`)
      }
    }
    expect(toolIds.length, 'no tools were checked').toBeGreaterThan(0)
    expect(offenders, 'a tool page whose heading is not the name it is listed under').toEqual([])
  })
})
