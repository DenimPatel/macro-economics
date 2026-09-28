import { useEffect, useRef, useState } from 'react'
import { readingPercent, readingProgress } from '../lib/readingProgress'

interface Props {
  /** Id of the element the bar measures. Absent until the Markdown resolves. */
  targetId: string
  label: string
}

/**
 * Reading progress through the article, drawn as a hairline on the bottom edge
 * of the sticky header.
 *
 * Placement is the whole design: absolutely positioned inside the header, so it
 * shifts no layout, cannot overlap the article, and cannot end up under the
 * cross-fade veil's z-order fight (the veil is `z-index: 90` over the whole
 * viewport and is *supposed* to cross-fade over everything, the bar included).
 * At 390px it is still 2px tall and full width, so it survives small screens
 * without a second breakpoint.
 *
 * ARIA: `role="progressbar"` with an explicit value, not `aria-hidden`. A
 * sighted-only affordance would be a genuine gap, because "how much of this
 * lecture is left" is exactly the question a screen-reader reader asks when
 * deciding whether to keep going. `progressbar` is not a live region, so the
 * value is not announced on every scroll tick — it is read when the reader
 * navigates to it or queries it, which is the right cadence. State changes are
 * also quantised to whole percents, so the node is at most 101 updates per read.
 */
export default function ReadingProgress({ targetId, label }: Props) {
  const rail = useRef<HTMLDivElement>(null)
  const last = useRef(0)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const measure = () => {
      const bar = rail.current
      if (!bar) return
      const article = document.getElementById(targetId)
      const fraction = readingProgress(
        article
          ? {
              top: article.getBoundingClientRect().top + window.scrollY,
              height: article.offsetHeight,
            }
          : null,
        window.scrollY,
        window.innerHeight,
      )
      // The bar is written straight to the DOM so a 23 000px lecture does not
      // re-render React on every scroll event. React state carries only the
      // whole-percent value aria-valuenow needs.
      bar.style.setProperty('--read-progress', fraction.toFixed(4))
      const next = readingPercent(fraction)
      if (next !== last.current) {
        last.current = next
        setPercent(next)
      }
    }

    measure()
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)

    // Scroll and resize are not the only things that move the article. Opening
    // one section's disclosure makes every section below it taller, and the
    // reader has not scrolled, so neither event fires — measured on
    // /lecture/3: expanding the first section grew the article by 379px and
    // left the bar reading 30% when the article was 37% read, and it stayed
    // there until the reader happened to scroll. A rail that answers "how much
    // is left" cannot be wrong by that much between the click and the next
    // scroll, so the article is observed rather than polled.
    //
    // The catch is that the article does not exist when this effect runs. The
    // bar is in the Shell and the article is in the page body, and the page
    // body is rendered only once the markdown has resolved — so the first
    // `getElementById` returns null, and an observer built against null watches
    // nothing, which is worth stating because it is why attaching one directly
    // looked right and measured as doing nothing. So the document is watched
    // for the article instead, and that watcher disconnects itself the moment
    // it has what it came for.
    let observer: ResizeObserver | null = null
    const watch = new MutationObserver(() => {
      const article = document.getElementById(targetId)
      if (!article) return
      watch.disconnect()
      measure()
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(measure)
        observer.observe(article)
      }
    })
    watch.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
      observer?.disconnect()
      watch.disconnect()
    }
  }, [targetId])

  return (
    <div
      ref={rail}
      className="read-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className="read-progress-fill" />
    </div>
  )
}
