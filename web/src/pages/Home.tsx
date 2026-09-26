import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'
import { ContinueBanner, PageHeader, Stat, TierBadge, ToolCard } from '../components/ui'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import type { ToolId } from '../../../content/lectures'

const FEATURED: ToolId[] = [
  'multiplier-simulator',
  'is-lm-explorer',
  'phillips-curve-tradeoff',
  'solow-simulator',
  'mundell-fleming',
  'crisis-2008',
]

export default function Home() {
  const tierGroups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: LECTURES.filter((l) => l.tier === tier),
  })).filter((g) => g.lectures.length > 0)

  return (
    <div>
      <ContinueBanner />
      <PageHeader
        eyebrow="Interactive macroeconomics"
        title="Read the lecture, then move the curves yourself"
        description="Twenty-five lectures, twenty simulation tools, four crisis case studies, and real US data — one course, built so that every idea has something to try."
      >
        <div className="flex flex-wrap gap-2">
          <Link to="/syllabus" className="button button-primary no-underline">
            Start the course
          </Link>
          <Link to="/tools" className="button button-secondary no-underline">
            Browse the tools
          </Link>
        </div>
      </PageHeader>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat value={LECTURES.length} label="Lectures" />
        <Stat value={Object.keys(TOOLS).length} label="Interactive tools" />
        <Stat value={CASE_STUDIES.length} label="Case studies" />
        <Stat value={4} label="Difficulty tiers" />
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-fg">Learning paths</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tierGroups.map(({ tier, meta, lectures }) => (
            <div key={tier} className="card p-5">
              <div className="mb-2 flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${meta.stripe}`} />
                <h3 className="text-base font-bold text-fg">{meta.label}</h3>
                <span className="ml-auto text-xs text-fg-subtle">
                  Lectures {lectures[0].n}–{lectures[lectures.length - 1].n}
                </span>
              </div>
              <p className="mb-3 text-sm text-fg-muted">
                {lectures.length} lectures ·{' '}
                {lectures.reduce((sum, l) => sum + l.tools.length, 0)} linked tools
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lectures.slice(0, 4).map((lecture) => (
                  <Link
                    key={lecture.n}
                    to={`/lecture/${lecture.n}`}
                    className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs text-fg-muted no-underline hover:text-accent"
                  >
                    {lecture.n}. {lecture.title.length > 28 ? `${lecture.title.slice(0, 28)}…` : lecture.title}
                  </Link>
                ))}
              </div>
              <Link
                to={`/lecture/${lectures[0].n}`}
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold no-underline hover:underline"
              >
                Begin path <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-fg">Featured tools</h2>
          <Link to="/tools" className="inline-flex items-center gap-1 text-sm font-semibold no-underline hover:underline">
            All tools <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((toolId) => (
            <ToolCard key={toolId} toolId={toolId} />
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-fg">Case studies</h2>
          <Link to="/cases" className="inline-flex items-center gap-1 text-sm font-semibold no-underline hover:underline">
            All cases <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <Link key={study.id} to={`/case/${study.slug}`} className="card p-4 no-underline hover:border-accent">
              <div className="mb-1 flex items-center gap-2">
                <TierBadge tier="case-study" />
                <span className="text-xs text-fg-subtle">{study.period}</span>
              </div>
              <h3 className="text-sm font-bold text-fg">{study.title}</h3>
              <p className="mt-1 text-xs text-fg-muted">{study.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-accent" />
          <h2 className="text-base font-bold text-fg">How to use this site</h2>
        </div>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-fg-muted">
          <li>Read a lecture. Each one opens with a prediction you commit to before the answer.</li>
          <li>Try the embedded mini-tool right where the idea appears.</li>
          <li>Check your understanding with the quiz; your progress is saved on this device.</li>
          <li>Use the concept map to find the lecture or tool for any term you meet again.</li>
        </ol>
      </section>
    </div>
  )
}
