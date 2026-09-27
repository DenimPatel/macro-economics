import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { CASE_STUDIES, LECTURES, type ToolId } from '../../../content/lectures'
import { TOOLS } from '../store'
import { ContinueBanner, LevelMeter, Stat, TierBadge, ToolCard } from '../components/ui'
import HeroFigure from '../components/HeroFigure'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { useProgress } from '../learning/progress'
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

/**
 * Lecture numbers as runs, not as a span.
 *
 * The obvious rendering — `lectures[0].n` to `lectures[lectures.length - 1].n`
 * — says "Lectures 1-10" for a tier that is 1, 2, 3, 4, 5, 6 and 10, because
 * 7, 8 and 9 are Intermediate: the tiers interleave, and a range drawn from
 * the first and last member claims four lectures that belong to another row.
 * On a page whose job is to tell a reader where they are, a number that
 * includes somebody else's lectures is worse than no number.
 */
function formatRuns(numbers: number[]): string {
  const sorted = [...numbers].sort((a, b) => a - b)
  const runs: string[] = []
  let start = sorted[0]
  let last = sorted[0]
  for (const n of sorted.slice(1)) {
    if (n === last + 1) {
      last = n
      continue
    }
    runs.push(start === last ? `${start}` : `${start}–${last}`)
    start = n
    last = n
  }
  runs.push(start === last ? `${start}` : `${start}–${last}`)
  return runs.join(', ')
}

export default function Home() {
  useDocumentTitle()
  const { completedLectures } = useProgress()
  const done = new Set(completedLectures)

  const tierGroups = TIER_ORDER.map((tier: Tier) => {
    const lectures = LECTURES.filter((l) => l.tier === tier)
    const incomplete = lectures.filter((l) => !done.has(l.n))
    return {
      tier,
      meta: TIER_META[tier],
      lectures,
      completed: lectures.length - incomplete.length,
      next: incomplete[0],
    }
  }).filter((g) => g.lectures.length > 0)

  // The lowest-numbered lecture the reader has not finished, which is the next
  // thing to do whatever order they have been reading in.
  const nextLecture = LECTURES.filter((l) => !done.has(l.n)).sort((a, b) => a.n - b.n)[0]

  return (
    <div>
      <ContinueBanner />

      <section className="mb-14 grid items-center gap-s-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="mb-s-3 text-micro font-bold uppercase tracking-widest text-accent-ink">
            Interactive macroeconomics
          </p>
          <h1 className="text-display-lg font-bold text-fg">
            Read the lecture, then move the curves yourself
          </h1>
          <p className="mt-s-5 max-w-xl text-base leading-relaxed text-fg-muted">
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

        {/*
          `elev-2 edge-lit`, not `shadow-card`. The hero holds a figure, and
          the elevation scale already has a name for a surface that holds a
          figure: `--elev-2`, "chart plates", paired with the 1px lit top edge
          that is the only thing giving a raised surface depth in light mode.
          `shadow-card` was the legacy alias for `--elev-1`, so the one diagram
          on the page sat a full step below every plate a real chart is drawn
          on. `.elev-2` composes with `.edge-lit` through `--elev-shadow` and
          `--elev-inset`, so nothing here can drop the lit edge.
        */}
        <div className="elev-2 edge-lit rounded-plate border border-border bg-surface p-s-5">
          <HeroFigure />
        </div>
      </section>

      {/*
        The stat strip stays a BAND, and that is the decision worth recording:
        a hairline is this identity's vocabulary for a horizontal division
        (`.section-band`, the breadcrumb rules, the prev/next rule), and
        putting a fill behind four numbers would make the lightest object on
        the page a filled plate. What makes it excellent is that it is one
        aligned row of figures — `dl`/`dt`/`dd` so the values and their labels
        are actually related, `tabular-nums` so the digits line up, and the
        four labels at `fg-muted` so a caption is not a grey line that happens
        to sit under a black number.
      */}
      <dl className="mb-14 grid grid-cols-2 gap-x-s-6 gap-y-s-4 border-y border-border py-s-5 sm:grid-cols-4">
        <Stat value={LECTURES.length} label="Lectures" />
        <Stat value={Object.keys(TOOLS).length} label="Interactive tools" />
        <Stat value={CASE_STUDIES.length} label="Case studies" />
        <Stat value={tierGroups.length} label="Lecture tiers" />
      </dl>

      <section className="mb-14">
        <div className="mb-s-6 flex items-baseline justify-between gap-s-4">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Learning paths</h2>
          <Link
            to="/syllabus"
            className="tap-clear inline-flex items-center gap-1 text-sm font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
          >
            Full syllabus <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        {/*
          The returning reader's position, in one line, from the progress store
          that already exists. The home page used to tell a reader who had
          finished nine lectures exactly the same thing it told somebody who
          had just arrived, and left them to find the syllabus to work out
          which lecture to open next. This is the whole of the fix: the count
          they have, and the next unread lecture, named and linked. Nothing
          new is tracked, and there is no account — `useProgress` is the same
          localStorage the sidebar's course-progress bar and `ContinueBanner`
          already read.
        */}
        {completedLectures.length > 0 && nextLecture && (
          <p className="mb-s-5 text-sm text-fg-muted">
            <span className="tabular-nums">
              {completedLectures.length} of {LECTURES.length} complete.
            </span>{' '}
            <Link
              to={`/lecture/${nextLecture.n}`}
              className="tap-clear font-semibold text-accent-ink no-underline hover:underline active:opacity-70"
            >
              Next: {nextLecture.n}. {nextLecture.title} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </p>
        )}

        {/* The level rail replaces four tinted cards. The four tier hues are one
            ordinal ramp, so identity comes from the meter and the ordering,
            not from a block of colour.

            Each row is TWO lines because it now answers two questions — what
            this path is, and where the reader is in it. One line had to carry
            the tier, the lecture numbers, two counts and the entry point, at
            three type sizes and two weights, and the entry point was the
            loudest thing in a row whose subject is a tier. The entry point
            moved to its own line under a hairline, where it is the only
            accent-coloured thing on the card and cannot be mistaken for one of
            the facts, and the facts moved above the rule. */}
        <ul className="space-y-s-3">
          {tierGroups.map(({ tier, meta, lectures, completed, next }) => {
            const target = next ?? lectures[0]
            const toolCount = lectures.reduce((sum, l) => sum + l.tools.length, 0)
            const entryLabel =
              completed === 0
                ? `Begin at lecture ${target.n}`
                : next
                  ? `Continue at lecture ${next.n}`
                  : `Revisit lecture ${target.n}`
            return (
              <li key={tier} className="card p-s-4">
                <div className="flex flex-wrap items-center gap-x-s-4 gap-y-s-2">
                  <LevelMeter tier={tier} />
                  <span className="text-sm font-semibold text-fg">{meta.label}</span>
                  <span className="ml-auto text-xs tabular-nums text-fg-subtle">
                    {lectures.length} lecture{lectures.length === 1 ? '' : 's'} ·{' '}
                    {formatRuns(lectures.map((l) => l.n))} · {toolCount} linked tools
                  </span>
                </div>
                <div className="mt-s-3 flex flex-wrap items-center gap-x-s-4 gap-y-s-2 border-t border-border pt-s-3">
                  {completed > 0 && (
                    <span className="text-xs tabular-nums text-fg-muted">
                      {completed} of {lectures.length} complete
                    </span>
                  )}
                  <Link
                    to={`/lecture/${target.n}`}
                    className="tap-clear ml-auto inline-flex items-center gap-1 text-sm font-semibold text-accent-ink no-underline hover:underline active:opacity-70"
                  >
                    {entryLabel} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-14">
        <div className="mb-s-6 flex items-baseline justify-between gap-s-4">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Featured tools</h2>
          <Link
            to="/tools"
            className="tap-clear inline-flex items-center gap-1 text-sm font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
          >
            All {Object.keys(TOOLS).length} tools <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-s-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((toolId) => (
            <ToolCard key={toolId} toolId={toolId} />
          ))}
        </div>
      </section>

      <section className="mb-14">
        <div className="mb-s-6 flex items-baseline justify-between gap-s-4">
          <h2 className="text-xl font-semibold tracking-tight text-fg">Case studies</h2>
          <Link
            to="/cases"
            className="tap-clear inline-flex items-center gap-1 text-sm font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
          >
            All cases <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-s-3 sm:grid-cols-2">
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.id}
              to={`/case/${study.slug}`}
              className="card lift p-s-4 no-underline"
            >
              <div className="mb-s-2 flex items-center gap-2">
                <TierBadge tier="case-study" />
                <span className="text-xs tabular-nums text-fg-subtle">{study.period}</span>
              </div>
              <h3 className="text-sm font-semibold text-fg">{study.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{study.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="card p-s-6">
        <div className="mb-s-4 flex items-center gap-2">
          <BookOpen size={17} className="text-fg-subtle" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-fg">How to use this site</h2>
        </div>
        <ol className="grid gap-s-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step} className="flex gap-s-3">
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
