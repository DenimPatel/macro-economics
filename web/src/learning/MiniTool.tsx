import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { MiniToolSpec } from '../../../content/lectures'
import { ToolRenderer } from '../tools/registry'
import { TOOLS } from '../store'

/** A compact tool embedded inside a lecture. */
export default function MiniTool({ spec }: { spec: MiniToolSpec }) {
  const info = TOOLS[spec.toolId]
  return (
    <section className="my-6 overflow-hidden rounded-card border border-border bg-surface">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-border bg-surface-2 px-4 py-2.5">
        <span className="text-micro font-bold uppercase tracking-widest text-fg-subtle">
          Interactive
        </span>
        <span className="font-serif text-sm font-bold text-fg">{info?.title ?? spec.toolId}</span>
        {spec.preset && (
          <span className="rounded-pill bg-accent/12 px-2 py-0.5 text-micro font-semibold text-accent-ink">
            {spec.preset}
          </span>
        )}
        <Link
          to={`/tool/${spec.toolId}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold no-underline hover:underline"
        >
          Open full tool <ArrowUpRight size={13} aria-hidden="true" />
        </Link>
      </div>
      {spec.caption && (
        <p className="border-b border-border px-4 py-2 text-sm text-fg-muted">{spec.caption}</p>
      )}
      <div className="p-2">
        <ToolRenderer toolId={spec.toolId} />
      </div>
    </section>
  )
}
