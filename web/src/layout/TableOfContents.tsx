import { useEffect, useState } from 'react'
import type { Heading } from '../content/markdownComponents'

/**
 * Sticky lecture table of contents built from the rendered headings.
 *
 * Flat and indented rather than a vertical rail, and it tracks the section you
 * are reading with an IntersectionObserver. A table of contents that cannot
 * tell you where you are is a list of links.
 */
export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (headings.length === 0) return
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // First visible heading in document order wins, so scrolling up does
        // not latch onto a heading further down the page.
        const first = elements.find((el) => visible.has(el.id))
        if (first) setActive(first.id)
      },
      // Bias the band towards the top of the viewport: a heading is "current"
      // once it reaches reading position, not once its last pixel appears.
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null
  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <nav aria-label="On this page">
        <div className="sticky top-20">
          <p className="mb-2.5 text-micro font-bold uppercase tracking-widest text-fg-subtle">
            On this page
          </p>
          <ul className="space-y-0.5 text-sm">
            {headings.map((heading, i) => {
              const isActive = active === heading.id
              return (
                <li key={`${heading.id}-${i}`} className={heading.level === 3 ? 'pl-3' : ''}>
                  <a
                    href={`#${heading.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`block rounded py-0.5 pl-2 leading-snug no-underline transition-colors ${
                      isActive
                        ? 'bg-accent/10 font-semibold text-accent-ink'
                        : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
