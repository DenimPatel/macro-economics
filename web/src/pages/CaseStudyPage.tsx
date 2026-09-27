import { Link, useParams } from 'react-router-dom'
import { caseStudyBySlug, CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { ToolRenderer } from '../tools/registry'
import { TierBadge } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { HeadingLevel } from '../lib/headingLevel'

/**
 * One case study: what happened, the simulation that fits it, the lectures it
 * draws on, and the other three.
 *
 * The last part is the reason this page is not a dead end. Four case studies
 * is a set a reader can hold in their head, and until now the only way from
 * one to another was back to the index and down again — the breadcrumb is a
 * way out, not a way on. Three pills under a hairline is the whole fix, and
 * it is the same affordance the "related lectures" pills above already use,
 * so it costs no new vocabulary.
 *
 * The frame around the simulation stays a hairline and a fill rather than a
 * raised plate, and that is not an oversight. The tool draws its chart in a
 * recessed well on the canvas colour, so the frame is a lid over a well; give
 * the lid the same `--elev-2` as the well's surround and the tool page has two
 * raised objects and no depth left to spend. The home page's hero figure is
 * the opposite case — a figure standing on the canvas with nothing under it —
 * which is why that one is `elev-2 edge-lit` and this one is not.
 */
export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? caseStudyBySlug(slug) : undefined
  // A case study carries the SAME `title` as the tool it embeds, and three of
  // the four pairs happen to differ by a word so the collision was invisible.
  // The fourth did not: `/case/speculative-attack-on-a-peg` and
  // `/tool/speculative-attack` both read "Speculative Attack on a Fixed Peg —
  // MacroEconomics", so a tab list or a screen-reader title list offered the
  // same entry twice. The kind is added here rather than disambiguating one
  // page, so the four case pages follow a rule and the rule is visible in the
  // tab. Nothing on the page changes: the `h1` is `study.title`.
  useDocumentTitle(study ? `${study.title} (case study)` : 'Case study', study?.summary)

  if (!study) {
    return (
      <div className="card p-s-6">
        <h1 className="text-xl font-semibold tracking-tight text-fg">Case study not found</h1>
        <p className="mt-s-2 text-sm text-fg-muted">
          There is no case study at <span className="font-mono">{`/case/${slug ?? ''}`}</span>.{' '}
          <Link to="/cases" className="tap-clear no-underline hover:underline active:opacity-70">
            The four case studies are on one page
          </Link>
          .
        </p>
      </div>
    )
  }

  const related = study.relatedLectures
    .map((n) => LECTURES.find((l) => l.n === n))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))

  const others = CASE_STUDIES.filter((other) => other.slug !== study.slug)

  return (
    <div>
      <nav className="mb-s-5 text-xs text-fg-subtle" aria-label="Breadcrumb">
        <Link
          to="/cases"
          className="tap-clear text-fg-subtle no-underline hover:text-accent-ink active:opacity-70"
        >
          Case studies
        </Link>{' '}
        <span aria-hidden="true">/</span> {study.title}
      </nav>

      <header className="reading-col mb-s-8">
        <div className="mb-s-3 flex items-center gap-2">
          <TierBadge tier="case-study" />
          <span className="text-xs tabular-nums text-fg-subtle">{study.period}</span>
        </div>
        <h1 className="text-display-md font-bold text-fg">{study.title}</h1>
        <p className="mt-s-3 leading-relaxed text-fg-muted">{study.summary}</p>
        <div className="mt-s-4 flex flex-wrap gap-s-2">
          {related.map((lecture) => (
            <Link
              key={lecture.n}
              to={`/lecture/${lecture.n}`}
              className="tap-clear rounded-pill border border-border bg-surface px-3 py-1 text-xs text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-accent-ink active:border-fg-subtle"
            >
              Lecture {lecture.n}: {lecture.title}
            </Link>
          ))}
        </div>
      </header>

      {/* The case owns the page <h1>; the tool below it is a section OF the
          case, so its title is an <h2>. Left at the tool's own default of
          <h1> this page had two. */}
      <HeadingLevel.Provider value={2}>
        <div className="rounded-plate border border-border bg-surface p-s-4">
          <ToolRenderer toolId={study.tool} />
        </div>
      </HeadingLevel.Provider>

      <nav
        className="mt-s-6 flex flex-wrap items-center gap-x-s-3 gap-y-s-2 border-t border-border pt-s-4"
        aria-label="Other case studies"
      >
        <p className="text-micro font-bold uppercase tracking-widest text-fg-subtle">
          Other cases
        </p>
        {others.map((other) => (
          <Link
            key={other.id}
            to={`/case/${other.slug}`}
            className="tap-clear rounded-pill border border-border bg-surface px-3 py-1 text-xs text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-accent-ink active:border-fg-subtle"
          >
            {other.title}
            <span className="tabular-nums text-fg-subtle"> · {other.period}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
