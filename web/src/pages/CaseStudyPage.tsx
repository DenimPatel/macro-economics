import { Link, useParams } from 'react-router-dom'
import { caseStudyBySlug, LECTURES } from '../../../content/lectures'
import { ToolRenderer } from '../tools/registry'
import { TierBadge } from '../components/ui'

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? caseStudyBySlug(slug) : undefined

  if (!study) {
    return (
      <div className="card p-6">
        <h1 className="text-xl font-bold text-fg">Case study not found</h1>
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
      <nav className="mb-4 text-xs text-fg-subtle">
        <Link to="/cases" className="text-fg-subtle no-underline hover:text-accent">
          Case studies
        </Link>{' '}
        / {study.title}
      </nav>

      <header className="mb-6 max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <TierBadge tier="case-study" />
          <span className="text-xs text-fg-subtle">{study.period}</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-fg">{study.title}</h1>
        <p className="mt-2 text-base text-fg-muted">{study.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {related.map((lecture) => (
            <Link
              key={lecture.n}
              to={`/lecture/${lecture.n}`}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-fg-muted no-underline hover:text-accent"
            >
              Lecture {lecture.n}: {lecture.title}
            </Link>
          ))}
        </div>
      </header>

      <div className="rounded-xl border border-border bg-surface p-3">
        <ToolRenderer toolId={study.tool} />
      </div>
    </div>
  )
}
