import { useMemo, useState } from 'react'
import { TOOLS } from '../store'
import { PageHeader, ToolCard } from '../components/ui'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import type { ToolId } from '../../../content/lectures'

type Filter = Tier | 'all'

export default function ToolsIndex() {
  const [filter, setFilter] = useState<Filter>('all')

  const grouped = useMemo(() => {
    const ids = Object.keys(TOOLS) as ToolId[]
    return ids
      .filter((id) => filter === 'all' || TOOLS[id].category === filter)
      .sort((a, b) => TOOLS[a].title.localeCompare(TOOLS[b].title))
  }, [filter])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...TIER_ORDER.map((tier) => ({ id: tier as Filter, label: TIER_META[tier].label })),
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Interactive tools"
        description="Every simulation in the course. Each one is linked from the lecture that introduces it."
      />

      <div className="mb-7 flex flex-wrap gap-2">
        {filters.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            className={`rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === id
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border bg-surface text-fg-muted hover:border-accent hover:text-fg'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="self-center pl-1 text-xs text-fg-subtle tabular-nums">
          {grouped.length} tool{grouped.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {grouped.map((toolId) => (
          <ToolCard key={toolId} toolId={toolId} />
        ))}
      </div>
    </div>
  )
}
