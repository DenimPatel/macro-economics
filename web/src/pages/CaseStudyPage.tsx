import { Link, useParams } from 'react-router-dom'
import { caseStudyBySlug, LECTURES } from '../../../content/lectures'
import { ToolRenderer } from '../tools/registry'
import { TierBadge } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? caseStudyBySlug(slug) : undefined
  useDocumentTitle(study?.title ?? 'Case study', study?.summary)

  if (!study) {
    return (
      <div className="card p-6">
        <h1 className="text-xl font-semibold tracking-tight text-fg">Case study not found</h1>
        <p className="mt-2 text-sm text-fg-muted">
          <Link to="/cases">Back to case studies</Link>.
        </p>
      </div>
    )
  }

  const related = study.relatedLectures
    .map((n) => LECTURES.find((l) => l.n === n))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))

  return (
    <div>
      <nav className="mb-5 text-xs text-fg-subtle" aria-label="Breadcrumb">
        <Link to="/cases" className="text-fg-subtle no-underline hover:text-accent-ink">
          Case studies
        </Link>{' '}
        <span aria-hidden="true">/</span> {study.title}
      </nav>

      <header className="mb-8 max-w-3xl">
        <div className="mb-3 flex items-center gap-2">
          <TierBadge tier="case-study" />
          <span className="text-xs tabular-nums text-fg-subtle">{study.period}</span>
        </div>
        <h1 className="text-display-md font-bold text-fg">{study.title}</h1>
        <p className="mt-3 text-base leading-relaxed text-fg-muted">{study.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {related.map((lecture) => (
            <Link
              key={lecture.n}
              to={`/lecture/${lecture.n}`}
              className="rounded-pill border border-border bg-surface px-3 py-1 text-xs text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-accent-ink"
            >
              Lecture {lecture.n}: {lecture.title}
            </Link>
          ))}
        </div>
      </header>

      <div className="rounded-plate border border-border bg-surface p-4">
        <ToolRenderer toolId={study.tool} />
      </div>
    </div>
  )
}
