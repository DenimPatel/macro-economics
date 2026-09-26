import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { Tier, ToolId } from '../../../content/lectures'
import { TIER_META } from '../design/tokens'
import { TOOLS } from '../store'
import { useProgress } from '../learning/progress'

/**
 * Four cells, the first `level` filled. This is what communicates difficulty:
 * the four tier hues are one ordinal azure ramp and are near neighbours by
 * design, so colour alone cannot carry the ordering.
 */
export function LevelMeter({ tier }: { tier: Tier }) {
  const { level } = TIER_META[tier]
  return (
    <span className={TIER_META[tier].dot} role="img" aria-label={`Level ${level} of 4`}>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className="level-cell" />
      ))}
    </span>
  )
}

export function TierBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier]
  return (
    <span className={meta.badge}>
      <LevelMeter tier={tier} />
      {meta.label}
    </span>
  )
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
        <p className="mb-2.5 text-micro font-bold uppercase tracking-widest text-fg-subtle">
          {eyebrow}
        </p>
      )}
      <h1 className="text-display-md font-bold text-fg">{title}</h1>
      {description && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </header>
  )
}

/**
 * A single number in the course-at-a-glance strip. Rendered as `dt`/`dd` so
 * the strip can be a real `dl`; `order-*` puts the value above the label
 * without inverting the markup.
 */
export function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col">
      <dd className="order-1 text-display-sm font-bold tabular-nums text-fg">{value}</dd>
      <dt className="order-2 mt-1 text-micro font-semibold uppercase tracking-wider text-fg-subtle">
        {label}
      </dt>
    </div>
  )
}

export function ToolCard({ toolId }: { toolId: ToolId }) {
  const info = TOOLS[toolId]
  if (!info) return null
  const index = (Object.keys(TOOLS) as ToolId[]).indexOf(toolId) + 1
  return (
    <Link
      to={`/tool/${toolId}`}
      className="card group flex flex-col p-4 no-underline transition-shadow hover:shadow-plate"
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-micro font-semibold tabular-nums text-fg-subtle">
          {String(index).padStart(2, '0')}
        </span>
        <TierBadge tier={info.category} />
      </div>
      <h3 className="text-base font-semibold text-fg transition-colors group-hover:text-accent-ink">
        {info.title}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-fg-muted">{info.description}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-fg-muted transition-colors group-hover:text-accent-ink">
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
      className="mb-7 flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-3 text-sm no-underline transition-colors hover:border-border-strong"
    >
      <TrendingUp size={16} className="shrink-0 text-accent" aria-hidden="true" />
      <span className="font-semibold text-fg">Continue where you left off</span>
      <span className="ml-auto text-xs text-fg-subtle">
        {completedLectures.length} lecture{completedLectures.length === 1 ? '' : 's'} complete
      </span>
    </Link>
  )
}
