import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { Tier, ToolId } from '../../../content/lectures'
import { TIER_META } from '../design/tokens'
import { TOOLS } from '../store'
import { useProgress } from '../learning/progress'

export function TierBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier]
  return <span className={meta.badge}>{meta.label}</span>
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <header className="mb-8 max-w-3xl">
      {eyebrow && (
        <p className="mb-2 text-micro font-bold uppercase tracking-widest text-accent">{eyebrow}</p>
      )}
      <h1 className="font-serif text-display-md font-bold text-fg">{title}</h1>
      {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </header>
  )
}

export function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="card p-4 text-center">
      <div className="font-serif text-display-sm font-bold text-fg tabular-nums">{value}</div>
      <div className="mt-1 text-micro font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
    </div>
  )
}

export function ToolCard({ toolId }: { toolId: ToolId }) {
  const info = TOOLS[toolId]
  if (!info) return null
  return (
    <Link
      to={`/tool/${toolId}`}
      className="card group flex flex-col p-4 no-underline transition-colors hover:border-accent"
    >
      <div className="mb-2 flex items-center gap-2">
        <TierBadge tier={info.category} />
      </div>
      <h3 className="font-serif text-base font-bold text-fg group-hover:text-accent">{info.title}</h3>
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-fg-muted">{info.description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent">
        Open tool <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

export function ContinueBanner() {
  const { lastPath, completedLectures } = useProgress()
  if (!lastPath || lastPath === '/') return null
  return (
    <Link
      to={lastPath}
      className="mb-6 flex items-center gap-3 rounded-card border border-accent/30 bg-accent/5 px-4 py-3 text-sm no-underline"
    >
      <TrendingUp size={16} className="shrink-0 text-accent" aria-hidden="true" />
      <span className="font-semibold text-accent-ink">Continue where you left off</span>
      <span className="ml-auto text-xs text-fg-muted">
        {completedLectures.length} lecture{completedLectures.length === 1 ? '' : 's'} complete
      </span>
    </Link>
  )
}
