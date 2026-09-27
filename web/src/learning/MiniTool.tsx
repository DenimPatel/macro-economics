import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { MiniToolSpec } from '../../../content/lectures'
import { ToolRenderer } from '../tools/registry'
import { HeadingLevel } from '../lib/headingLevel'
import { TOOLS } from '../store'

/** A compact tool embedded inside a lecture. */
export default function MiniTool({ spec }: { spec: MiniToolSpec }) {
  const info = TOOLS[spec.toolId]

  /*
   * A mini-tool whose id is not in the registry is a dead end, and it used to
   * present itself as two different facts: the header fell back to printing the
   * raw id — `gdp-visualizer`, an internal slug, in the middle of a sentence
   * about the course — while the body below it said "This tool is not
   * available yet." One state, said once.
   *
   * It cannot happen with the metadata as committed (all 13 tool references in
   * `lectures.ts` resolve, checked), and it is here because `lectures.ts` is
   * hand-edited data: the failure mode of a typo is a box that says nothing,
   * and the failure mode of *this* fix being absent is a box that says two
   * contradictory things.
   */
  if (!info) {
    return (
      <section className="my-7 rounded-card border border-border bg-surface p-s-4">
        <p className="text-sm text-fg-muted">
          This lecture links an interactive tool that is not in the registry. The course index
          lists every tool that does exist.
        </p>
      </section>
    )
  }

  return (
    <section className="my-7 overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-border bg-surface-2 px-4 py-s-2">
        <span className="text-micro font-bold uppercase tracking-widest text-fg-subtle">
          Interactive
        </span>
        <span className="text-sm font-semibold text-fg">{info.title}</span>
        {spec.preset && (
          <span className="rounded-pill border border-border bg-surface px-2 py-0.5 text-micro font-semibold text-fg-muted">
            {spec.preset}
          </span>
        )}
        <Link
          to={`/tool/${spec.toolId}`}
          className="tap-clear ml-auto inline-flex items-center gap-1 text-xs font-semibold text-fg-muted no-underline hover:text-accent-ink active:text-accent"
        >
          Open full tool <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      {spec.caption && (
        <p className="border-b border-border px-4 py-s-2 text-sm text-fg-muted">{spec.caption}</p>
      )}
      {/* The lecture owns the page <h1> and the "Try it" section above this
          is an <h2>, so a tool inside it is an <h3>. At the tool's own
          default of <h1> every lecture that embeds a tool had two. */}
      <HeadingLevel.Provider value={3}>
        <div className="p-s-3">
          <ToolRenderer toolId={spec.toolId} />
        </div>
      </HeadingLevel.Provider>
    </section>
  )
}
