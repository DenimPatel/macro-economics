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
    return () => {
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
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
