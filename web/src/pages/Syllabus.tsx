import { Link } from 'react-router-dom'
import { Check, ExternalLink } from 'lucide-react'
import { LECTURES } from '../../../content/lectures'
import { PageHeader } from '../components/ui'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { TOOLS } from '../store'
import { useProgress } from '../learning/progress'

export default function Syllabus() {
  const { completedLectures } = useProgress()

  const groups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: LECTURES.filter((l) => l.tier === tier),
  })).filter((g) => g.lectures.length > 0)

  const total = LECTURES.length
  const done = completedLectures.length

  return (
    <div>
      <PageHeader
        eyebrow="Syllabus"
        title="The whole course at a glance"
        description="Twenty-five lectures in four tiers, each linked to its source video, its tools, and a short quiz. Progress is saved on this device."
      />

      <div className="mb-6 max-w-md">
        <div className="mb-1 flex justify-between text-xs text-fg-muted">
          <span>
            {done} of {total} lectures complete
          </span>
          <span>{Math.round((done / total) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(done / total) * 100}%` }}
          />
        </div>
      </div>

      {groups.map(({ tier, meta, lectures }) => (
        <section key={tier} className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${meta.stripe}`} />
            <h2 className="text-lg font-bold text-fg">{meta.label}</h2>
            <span className="text-xs text-fg-subtle">{lectures.length} lectures</span>
          </div>
          <div className="space-y-2">
            {lectures.map((lecture) => {
              const isDone = completedLectures.includes(lecture.n)
              return (
                <div
                  key={lecture.n}
                  className="card flex flex-wrap items-center gap-x-3 gap-y-2 p-3.5"
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      isDone ? 'bg-tier-beginner/15 text-tier-beginner' : 'bg-surface-2 text-fg-muted'
                    }`}
                  >
                    {isDone ? <Check size={14} /> : lecture.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/lecture/${lecture.n}`}
                      className="text-sm font-semibold text-fg no-underline hover:text-accent"
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
                        className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.7rem] text-fg-muted no-underline hover:text-accent"
                      >
                        {TOOLS[toolId]?.title ?? toolId}
                      </Link>
                    ))}
                    <a
                      href={lecture.videoUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 text-[0.7rem] text-fg-subtle no-underline hover:text-accent"
                      title="Source video"
                    >
                      Video <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      <p className="text-xs text-fg-subtle">
        Review lectures (10, 18, 25) consolidate earlier material and have no new tools.
      </p>
    </div>
  )
}
