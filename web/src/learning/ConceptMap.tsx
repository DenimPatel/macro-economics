import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { LECTURES } from '../../../content/lectures'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { useProgress } from './progress'
import { TOOLS } from '../store'
import { LevelMeter } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/** Grid of concepts, each linking to where it is taught and practised. */
export default function ConceptMap() {
  const { completedLectures } = useProgress()
  useDocumentTitle(
    'Concept map',
    'Every concept in the course, linked to the lecture that teaches it and the tool that practises it.',
  )

  const groups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    entries: LECTURES.filter((l) => l.tier === tier && l.concepts.length > 0).map((lecture) => ({
      lecture,
      concepts: lecture.concepts,
    })),
  })).filter((g) => g.entries.length > 0)

  return (
    <div className="space-y-10">
      {groups.map(({ tier, meta, entries }) => (
        <section key={tier}>
          <div className="mb-4 flex items-center gap-2.5">
            <LevelMeter tier={tier} />
            <h2 className="text-xl font-semibold tracking-tight text-fg">{meta.label}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map(({ lecture, concepts }) => {
              const done = completedLectures.includes(lecture.n)
              return (
                <div key={lecture.n} className="card p-4">
                  <div className="mb-2.5 flex items-start gap-2">
                    <Link
                      to={`/lecture/${lecture.n}`}
                      className="text-sm font-semibold text-fg no-underline hover:text-accent-ink"
                    >
                      {lecture.n}. {lecture.title}
                    </Link>
                    {done && (
                      <Check
                        size={15}
                        className="ml-auto mt-0.5 shrink-0 text-ok"
                        aria-label="Completed"
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {concepts.map((concept) => (
                      <span
                        key={concept}
                        className="rounded-pill bg-surface-2 px-2 py-0.5 text-[0.72rem] text-fg-muted"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>
                  {lecture.tools.length > 0 && (
                    <div className="mt-3.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-2.5 text-xs">
                      {lecture.tools.map((toolId) => (
                        <Link
                          key={toolId}
                          to={`/tool/${toolId}`}
                          className="text-accent-ink no-underline hover:underline"
                        >
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
