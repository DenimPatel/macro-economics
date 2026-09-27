import { useLayoutEffect, useRef } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from 'react'
import type { Heading } from '../content/markdownComponents'

function stateOf(index: number, activeIndex: number): 'read' | 'current' | 'upcoming' {
  if (index === activeIndex) return 'current'
  // "Read" here means only that the reader has scrolled past the heading; it is
  // not the course completion flag, which lives on the lecture itself.
  return activeIndex > 0 && index < activeIndex ? 'read' : 'upcoming'
}

interface ListProps {
  headings: Heading[]
  activeId: string | null
}

function onListKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
  // Purely additive: every link is still a normal tab stop. Arrow keys only add
  // a faster path through a list that can be 63 rows long.
  const step: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 }
  const delta = step[event.key]
  if (delta === undefined) return
  const links = Array.from(event.currentTarget.children).map(
    (row) => row.firstElementChild,
  ) as HTMLAnchorElement[]
  const from = links.findIndex((link) => link === document.activeElement)
  if (from < 0) return
  const next = Math.min(links.length - 1, Math.max(0, from + delta))
  event.preventDefault()
  links[next]?.focus()
}

function ContentsList({ headings, activeId }: ListProps) {
  const list = useRef<HTMLUListElement>(null)
  // Fall back to the first row if the spy's id has no row, so the list always
  // has exactly one current entry and never none.
  const found = headings.findIndex((heading) => heading.id === activeId)
  const activeIndex = found >= 0 ? found : 0

  useLayoutEffect(() => {
    // Keep the current entry in view inside the list's own scroller. The
    // arithmetic is done by hand rather than with scrollIntoView because that
    // would also scroll the page, turning a 57-row list into a scroll-hijack.
    const container = list.current
    if (!container) return
    const row = container.children[activeIndex] as HTMLElement | undefined
    if (!row) return
    const top = row.offsetTop
    const bottom = top + row.offsetHeight
    if (top < container.scrollTop) container.scrollTop = top - 8
    else if (bottom > container.scrollTop + container.clientHeight) {
      container.scrollTop = bottom - container.clientHeight + 8
    }
  }, [activeIndex])

  return (
    <ul ref={list} className="contents-list contents-scroll" onKeyDown={onListKeyDown}>
      {headings.map((heading, i) => {
        const state = stateOf(i, activeIndex)
        return (
          <li
            key={`${heading.id}-${i}`}
            className={heading.level === 3 ? 'contents-sub' : undefined}
          >
            <a
              href={`#${heading.id}`}
              data-state={state}
              aria-current={state === 'current' ? 'location' : undefined}
            >
              {heading.text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export interface TableOfContentsProps {
  headings: Heading[]
  activeId: string | null
}

/**
 * The reading rail: a contents list pinned beside the article from 1280px up.
 * Below that the same list is rendered inline as a disclosure (see
 * `ContentsDisclosure`), so a 390px reader is not left without a way to jump
 * around a 57-heading lecture.
 *
 * The list is its own scroll container capped to the viewport. Before this,
 * Lecture 16's 57 entries made the sticky block 2079px tall inside a 900px
 * window: the top stuck and everything below the fold was unreachable, because
 * `position: sticky` does not clip and does not scroll its own overflow.
 */
export default function TableOfContents({ headings, activeId }: TableOfContentsProps) {
  if (headings.length === 0) return null
  return (
    <aside className="hidden w-56 shrink-0 xl:block" aria-labelledby="toc-heading">
      <div className="sticky top-20">
        <p
          id="toc-heading"
          className="mb-3 text-micro uppercase tracking-widest text-fg-subtle"
        >
          On this page
        </p>
        <nav aria-label="On this page">
          <ContentsList headings={headings} activeId={activeId} />
        </nav>
      </div>
    </aside>
  )
}

export interface ContentsDisclosureProps {
  headings: Heading[]
  activeId: string | null
  detailRef: RefObject<HTMLDetailsElement>
}

/**
 * The same contents list as a disclosure, for viewports too narrow for the
 * rail. `<details>` rather than a button wrapping a hidden list, so the open
 * state is real without script.
 */
export function ContentsDisclosure({ headings, activeId, detailRef }: ContentsDisclosureProps) {
  if (headings.length === 0) return null
  return (
    <details ref={detailRef} id="lecture-contents" className="toc-disclosure xl:hidden">
      <summary>Contents ({headings.length})</summary>
      <nav aria-label="On this page" className="mt-3">
        <ContentsList headings={headings} activeId={activeId} />
      </nav>
    </details>
  )
}
