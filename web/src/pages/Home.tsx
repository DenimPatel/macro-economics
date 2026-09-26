import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { CASE_STUDIES, LECTURES, type ToolId } from '../../../content/lectures'
import { TOOLS } from '../store'
import { ContinueBanner, LevelMeter, Stat, TierBadge, ToolCard } from '../components/ui'
import HeroFigure from '../components/HeroFigure'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { useDocumentTitle } from '../lib/useDocumentTitle'

const FEATURED: ToolId[] = [
  'multiplier-simulator',
  'is-lm-explorer',
  'phillips-curve-tradeoff',
  'solow-simulator',
  'mundell-fleming',
  'crisis-2008',
]

const STEPS: string[] = [
  'Read a lecture. Each one opens with a prediction you commit to before the answer.',
  'Try the embedded mini-tool right where the idea appears.',
  'Check your understanding with the quiz; your progress is saved on this device.',
  'Use the concept map to find the lecture or tool for any term you meet again.',
]

export default function Home() {
  useDocumentTitle()

  const tierGroups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: LECTURES.filter((l) => l.tier === tier),
  })).filter((g) => g.lectures.length > 0)

  return (
    <div>
      <ContinueBanner />

      <section className="mb-14 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="mb-3 text-micro font-bold uppercase tracking-widest text-accent-ink">
            Interactive macroeconomics
          </p>
          <h1 className="text-display-lg font-bold text-fg">
            Read the lecture, then move the curves yourself
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
            {LECTURES.length} lectures, {Object.keys(TOOLS).length} simulation tools,{' '}
            {CASE_STUDIES.length} crisis case studies, and real US data — one course, built so
            that every idea has something to try.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Link to="/syllabus" className="button button-primary no-underline">
              Start the course
            </Link>
            <Link to="/tools" className="button button-secondary no-underline">
              Browse the tools
            </Link>
          </div>
        </div>

        <div className="rounded-plate border border-border bg-surface p-5 shadow-card">
          <HeroFigure />
        </div>
      </section>

      <dl className="mb-14 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-border py-5 sm:grid-cols-4">
        <Stat value={LECTURES.length} label="Lectures" />
        <Stat value={Object.keys(TOOLS).length} label="Interactive tools" />
        <Stat value={CASE_STUDIES.length} label="Case studies" />
        <Stat value={tierGroups.length} label="Lecture tiers" />
      </dl>

      <section className="mb-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Learning paths</h2>
          <Link
            to="/syllabus"
            className="inline-flex items-center gap-1 text-sm font-semibold text-fg-muted no-underline hover:text-accent-ink"
          >
            Full syllabus <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/* The level rail replaces four tinted cards. The four tier hues are one
            ordinal ramp, so identity comes from the meter and the ordering,
            not from a block of colour. */}
        <ul className="space-y-3">
          {tierGroups.map(({ tier, meta, lectures }) => (
            <li key={tier} className="card p-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <LevelMeter tier={tier} />
                <span className="text-sm font-semibold text-fg">{meta.label}</span>
                <span className="text-xs tabular-nums text-fg-subtle">
                  Lectures {lectures[0].n}–{lectures[lectures.length - 1].n}
                </span>
                <span className="text-xs text-fg-subtle">
                  {lectures.length} lecture{lectures.length === 1 ? '' : 's'} ·{' '}
                  {lectures.reduce((sum, l) => sum + l.tools.length, 0)} linked tools
                </span>
                <Link
                  to={`/lecture/${lectures[0].n}`}
                  className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-accent-ink no-underline hover:underline"
                >
                  Begin path <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Featured tools</h2>
          <Link
            to="/tools"
            className="inline-flex items-center gap-1 text-sm font-semibold text-fg-muted no-underline hover:text-accent-ink"
          >
            All {Object.keys(TOOLS).length} tools <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((toolId) => (
            <ToolCard key={toolId} toolId={toolId} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Case studies</h2>
          <Link
            to="/cases"
            className="inline-flex items-center gap-1 text-sm font-semibold text-fg-muted no-underline hover:text-accent-ink"
          >
            All cases <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.id}
              to={`/case/${study.slug}`}
              className="card p-4 no-underline transition-shadow hover:shadow-plate"
            >
              <div className="mb-2 flex items-center gap-2">
                <TierBadge tier="case-study" />
                <span className="text-xs tabular-nums text-fg-subtle">{study.period}</span>
              </div>
              <h3 className="text-sm font-semibold text-fg">{study.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{study.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={17} className="text-fg-subtle" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-fg">How to use this site</h2>
        </div>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="shrink-0 text-sm font-bold tabular-nums text-fg-subtle">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm leading-relaxed text-fg-muted">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
