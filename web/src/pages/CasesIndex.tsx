import { Link } from 'react-router-dom'
import { ArrowRight, Play } from 'lucide-react'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { PageHeader, TierBadge } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/**
 * Four cards, and the question this page has to answer.
 *
 * Which episode do I open, and what does it need from me first. That is why
 * the hierarchy is period, then title, then what happened, then the lectures
 * it draws on: the case and the period are what a reader scans for, the
 * lectures are the prerequisite they check, and the summary is the reason they
 * care. A filter over four items would be noise — there is nothing to narrow —
 * so there is none, and the whole grid is above the fold at 1280.
 *
 * The lecture pills are `text` and not links. They are inside a `<Link>`, and
 * a nested anchor is invalid HTML whose click would resolve to the card
 * anyway; the honest version of the link is the case page itself, which lists
 * the same lectures with their titles.
 *
 * The gap above the pills was 0.875rem — exactly between `--space-3` and
 * `--space-4`, so it was a value the density preference could not reach. It
 * rounds UP to `s-4`, the same decision `.tool-description` records in
 * `index.css` for the same reason: on a rhythm value, rounding up is what
 * pairs with the surface below, and 2px on a four-card grid is not a change
 * anyone can see.
 */
export default function CasesIndex() {
  useDocumentTitle(
    'Case studies',
    'The models applied to real episodes. Each case opens the simulation that fits it, with the lectures it draws on.',
  )

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Case studies"
        description="The models applied to real episodes. Each case opens the simulation that fits it, with the lectures it draws on."
      />
      <div className="grid gap-s-3 md:grid-cols-2">
        {CASE_STUDIES.map((study) => {
          const lectures = study.relatedLectures
            .map((n) => LECTURES.find((l) => l.n === n))
            .filter((l): l is NonNullable<typeof l> => Boolean(l))
          return (
            <Link
              key={study.id}
              to={`/case/${study.slug}`}
              className="card lift group flex flex-col p-s-5 no-underline"
            >
              <div className="mb-s-2 flex items-center gap-2">
                <TierBadge tier="case-study" />
                <span className="text-xs tabular-nums text-fg-subtle">{study.period}</span>
              </div>
              <h2 className="text-base font-semibold text-fg transition-colors group-hover:text-accent-ink">
                {study.title}
              </h2>
              <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">{study.summary}</p>
              {/* The lectures it needs, and the number of them: a reader
                  deciding whether to open a case is deciding whether they have
                  met the model yet, and "3 lectures" is more decision than a
                  row of pills is. */}
              <div className="mt-s-4 flex flex-wrap items-center gap-1.5">
                {lectures.map((lecture) => (
                  <span
                    key={lecture.n}
                    className="rounded-pill border border-border px-2 py-0.5 text-micro text-fg-muted"
                  >
                    Lecture {lecture.n}
                  </span>
                ))}
                <span className="text-micro tabular-nums text-fg-subtle">
                  {lectures.length} lecture{lectures.length === 1 ? '' : 's'}
                </span>
              </div>
              {/* `mt-auto` rather than a fixed margin: the card is a flex
                  column so that "Open case" sits on the same line across a
                  row of four cards whose summaries are different lengths,
                  which is the one alignment this grid was missing. */}
              <span className="mt-auto inline-flex items-center gap-1 pt-s-4 text-xs font-semibold text-fg-muted transition-colors group-hover:text-accent-ink">
                <Play size={12} aria-hidden="true" />
                Open case
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
