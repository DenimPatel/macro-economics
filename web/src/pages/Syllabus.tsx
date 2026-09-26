import { Link } from 'react-router-dom'
import { Check, ExternalLink } from 'lucide-react'
import { LECTURES } from '../../../content/lectures'
import { LevelMeter, PageHeader } from '../components/ui'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { TOOLS } from '../store'
import { useProgress } from '../learning/progress'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Syllabus() {
  const { completedLectures } = useProgress()
  useDocumentTitle(
    'Syllabus',
    `The whole course at a glance: ${LECTURES.length} lectures in four tiers, each linked to its source video, its tools, and a short quiz.`,
  )

  const groups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: LECTURES.filter((l) => l.tier === tier),
  })).filter((g) => g.lectures.length > 0)

  const total = LECTURES.length
  const done = completedLectures.length
  const pct = Math.round((done / total) * 100)

  // Derived from the lecture data rather than hard-coded, so adding or
  // re-tagging a review lecture cannot leave this note stale.
  const reviewNumbers = LECTURES.filter((l) => l.review)
    .map((l) => l.n)
    .sort((a, b) => a - b)
  const reviewList =
    reviewNumbers.length === 0
      ? 'None'
      : reviewNumbers.length === 1
        ? `${reviewNumbers[0]}`
        : `${reviewNumbers.slice(0, -1).join(', ')} and ${reviewNumbers[reviewNumbers.length - 1]}`

  return (
    <div>
      <PageHeader
        eyebrow="Syllabus"
        title="The whole course at a glance"
        description={`${LECTURES.length} lectures in four tiers, each linked to its source video, its tools, and a short quiz. Progress is saved on this device.`}
      />

      <div className="mb-12 max-w-md">
        <div className="mb-2 flex justify-between text-xs text-fg-muted">
          <span>
            {done} of {total} lectures complete
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course completion"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {groups.map(({ tier, meta, lectures }) => (
        <section key={tier} className="mb-12">
          <div className="mb-4 flex items-center gap-2.5">
            <LevelMeter tier={tier} />
            <h2 className="text-xl font-semibold tracking-tight text-fg">{meta.label}</h2>
            <span className="text-xs text-fg-subtle">
              {lectures.length} lecture{lectures.length === 1 ? '' : 's'}
            </span>
          </div>
          <ul className="space-y-1.5">
            {lectures.map((lecture) => {
              const isDone = completedLectures.includes(lecture.n)
              return (
                <li key={lecture.n}>
                  <div className="card flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-3">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums ${
                        isDone ? 'bg-ok/15 text-ok-ink' : 'bg-surface-2 text-fg-muted'
                      }`}
                    >
                      {isDone ? <Check size={14} aria-hidden="true" /> : lecture.n}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/lecture/${lecture.n}`}
                        className="text-sm font-semibold text-fg no-underline hover:text-accent-ink"
                      >
                        {lecture.title}
                      </Link>
                      <p className="truncate text-xs text-fg-subtle">{lecture.summary}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {lecture.review && <span className="badge">Review</span>}
                      {lecture.tools.slice(0, 2).map((toolId) => (
                        <Link
                          key={toolId}
                          to={`/tool/${toolId}`}
                          className="rounded-pill border border-border bg-surface px-2 py-0.5 text-micro text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-accent-ink"
                        >
                          {TOOLS[toolId]?.title ?? toolId}
                        </Link>
                      ))}
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-micro text-fg-subtle no-underline hover:text-accent-ink"
                        title="Source video"
                      >
                        Video <ExternalLink size={11} aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <p className="text-xs text-fg-subtle">
        Review lectures ({reviewList}) consolidate earlier material and have no new tools.
      </p>
    </div>
  )
}
