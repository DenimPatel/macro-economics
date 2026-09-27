import { useEffect, useState } from 'react'
import type { Heading } from '../content/markdownComponents'

/**
 * How far the spy has to travel, in CSS pixels, before the next heading takes
 * over. Taken from the live DOM so it follows the text-size preference: the
 * sticky header is `h-14`, which is 3.5rem and therefore 50.4px at 90% text and
 * 72.8px at 130%, so a hard-coded pixel band would drift by more than 20px
 * across the range the settings panel offers.
 */
function stickyChromeHeight(): number {
  const header = document.querySelector('header.sticky')?.getBoundingClientRect().height ?? 0
  const bar = document.querySelector('.lecture-bar')?.getBoundingClientRect().height ?? 0
  return Math.round(header + bar) + 16
}

/**
 * Scroll-spy for the contents list. Returns the id of the section the reader is
 * in, or null when the lecture has no headings at all.
 *
 * Two details matter more than the mechanism:
 *
 * 1. It never clears. When no heading sits in the band — which is most of a
 *    long lecture, because sections are longer than a viewport — the previous
 *    answer stands. That is what makes "exactly one entry is current" true at
 *    all times rather than intermittently true, and it is why a 57-heading
 *    lecture does not flicker as the reader scrolls.
 * 2. It starts at the first heading. The IntersectionObserver only fires once a
 *    heading actually crosses the band, so initialising to null left the list
 *    with no current entry until the first scroll — and a restored scroll
 *    position could leave it with none at all, which is what a reader arriving
 *    on `#a-section` saw.
 *
 * Both the desktop rail and the mobile disclosure read this one hook, so 57
 * headings are observed once rather than twice.
 */
export function useScrollSpy(headings: Heading[]): string | null {
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null)

  useEffect(() => {
    if (headings.length === 0) {
      setActive(null)
      return
    }
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    setActive((current) => current ?? elements[0].id)
    // jsdom has no IntersectionObserver, and a browser without one still gets a
    // correct — if less responsive — list from the first-heading default.
    if (typeof IntersectionObserver === 'undefined') return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }
        // First in document order, so scrolling up does not latch onto a
        // heading further down the page.
        const first = elements.find((el) => visible.has(el.id))
        if (first) setActive(first.id)
      },
      { rootMargin: `-${stickyChromeHeight()}px 0px -70% 0px`, threshold: 0 },
    )
    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [headings])

  return active
}
