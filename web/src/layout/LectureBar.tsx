import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, List } from 'lucide-react'
import type { LectureMeta } from '../../../content/lectures'

export interface LectureBarProps {
  lecture: LectureMeta
  index: number
  total: number
  prev: LectureMeta | undefined
  next: LectureMeta | undefined
  /** Whether the lecture has a contents list worth jumping to. */
  hasContents: boolean
  onOpenContents: () => void
}

/**
 * Where am I, and what is next — available at any scroll depth.
 *
 * A lecture is 2 000 to 27 000px tall, so prev/next at the foot of the page is
 * a destination a reader has to scroll 25 000px to reach. This bar parks
 * directly under the sticky header and carries position, neighbours, and a
 * route back to the contents. It is density-aware because it is built from
 * `--space-*` like everything else, and it collapses to numbers below `lg`,
 * where a title and an arrow do not both fit.
 *
 * Progress reads as `n of 25` with a rail, which is position, not completion.
 * The accent fill follows the same vocabulary as the sidebar's course-progress
 * bar: progress is a state, and this is the one place in the reading view
 * where a state belongs on a fill.
 */
export default function LectureBar({
  lecture,
  index,
  total,
  prev,
  next,
  hasContents,
  onOpenContents,
}: LectureBarProps) {
  const fraction = total > 0 ? (index + 1) / total : 0
  return (
    <nav className="lecture-bar" aria-label="Lecture navigation">
      {prev ? (
        <Link
          to={`/lecture/${prev.n}`}
          rel="prev"
          className="lecture-bar-link hit-44"
          title={`Previous lecture: ${prev.title} (press [)`}
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden truncate lg:inline">{prev.title}</span>
          <span className="lg:hidden">{prev.n}</span>
        </Link>
      ) : (
        <Link to="/syllabus" className="lecture-bar-link hit-44" title="Back to the syllabus">
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden truncate lg:inline">Syllabus</span>
        </Link>
      )}

      {/* The rail is the one thing in this row that is allowed to give way,
        *  and only because there is nowhere else for the space to come from.
        *  `shrink-0` made it 62.4px of immovable object at 130% text, the
        *  `n of 25` beside it is 70.4px of `whitespace-nowrap`, and the two of
        *  them plus an 8px gap is 140.8px against 114px the flex line had
        *  left: the bar measured 285px of scrollWidth in a 278px box at 320px
        *  wide, and 7px of it was the bar itself and the rest was the two
        *  links past the right edge of a 320px phone. `min-w-6` is the floor,
        *  because a rail squeezed to nothing is a rounding error rather than
        *  a rail, and `w-12` / `sm:w-20` are unchanged at every width where
        *  there was room for them in the first place. */}
      <div className="flex min-w-0 items-center gap-2 px-1 text-sm text-fg-muted">
        <span className="tabular-nums whitespace-nowrap">
          {lecture.n} of {total}
        </span>
        <span className="progress-fill h-1 w-12 min-w-6 shrink sm:w-20" aria-hidden="true">
          <span className="progress-bar" style={{ width: `${fraction * 100}%` }} />
        </span>
      </div>

      {hasContents && (
        <button
          type="button"
          onClick={onOpenContents}
          className="lecture-bar-link hit-44 xl:hidden"
          title="Jump to the contents"
        >
          <List className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Contents</span>
        </button>
      )}

      {next ? (
        <Link
          to={`/lecture/${next.n}`}
          rel="next"
          className="lecture-bar-link hit-44"
          title={`Next lecture: ${next.title} (press ])`}
        >
          <span className="hidden truncate lg:inline">{next.title}</span>
          <span className="lg:hidden">{next.n}</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      ) : (
        <Link to="/syllabus" className="lecture-bar-link hit-44" title="Back to the syllabus">
          <span className="hidden truncate lg:inline">Syllabus</span>
          <ArrowRight className="h-4 w-4 shrink-0" />
        </Link>
      )}
    </nav>
  )
}
