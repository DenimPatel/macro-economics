import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { LECTURES } from '../../../content/lectures'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { useProgress } from './progress'
import { TOOLS } from '../store'

/** Grid of concepts, each linking to where it is taught and practised. */
export default function ConceptMap() {
  const { completedLectures } = useProgress()

  const groups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    entries: LECTURES.filter((l) => l.tier === tier && l.concepts.length > 0).map((lecture) => ({
      lecture,
      concepts: lecture.concepts,
    })),
  })).filter((g) => g.entries.length > 0)

  return (
    <div className="space-y-8">
      {groups.map(({ tier, meta, entries }) => (
        <section key={tier}>
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${meta.stripe}`} />
            <h2 className="text-lg font-bold text-fg">{meta.label}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(({ lecture, concepts }) => {
              const done = completedLectures.includes(lecture.n)
              return (
                <div key={lecture.n} className="card p-4">
                  <div className="mb-2 flex items-start gap-2">
                    <Link
                      to={`/lecture/${lecture.n}`}
                      className="text-sm font-semibold no-underline hover:underline"
                    >
                      {lecture.n}. {lecture.title}
                    </Link>
                    {done && <Check size={15} className="ml-auto mt-0.5 shrink-0 text-tier-beginner" />}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {concepts.map((concept) => (
                      <span
                        key={concept}
                        className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.72rem] text-fg-muted"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                  {lecture.tools.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-2 text-xs">
                      {lecture.tools.map((toolId) => (
                        <Link key={toolId} to={`/tool/${toolId}`} className="no-underline hover:underline">
                          {TOOLS[toolId]?.title ?? toolId}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
