import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { PageHeader, TierBadge } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

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
      <div className="grid gap-3 md:grid-cols-2">
        {CASE_STUDIES.map((study) => {
          const lectures = study.relatedLectures
            .map((n) => LECTURES.find((l) => l.n === n))
            .filter((l): l is NonNullable<typeof l> => Boolean(l))
          return (
            <Link
              key={study.id}
              to={`/case/${study.slug}`}
              className="card p-5 no-underline transition-shadow hover:shadow-plate"
            >
              <div className="mb-2.5 flex items-center gap-2">
                <TierBadge tier="case-study" />
                <span className="text-xs tabular-nums text-fg-subtle">{study.period}</span>
              </div>
              <h2 className="text-base font-semibold text-fg">{study.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{study.summary}</p>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {lectures.map((lecture) => (
                  <span
                    key={lecture.n}
                    className="rounded-pill border border-border px-2 py-0.5 text-micro text-fg-muted"
                  >
                    Lecture {lecture.n}
                  </span>
                ))}
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-fg-muted">
                Open case <ArrowRight size={13} aria-hidden="true" />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
