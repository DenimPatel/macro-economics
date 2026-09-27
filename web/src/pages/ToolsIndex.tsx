import { useId, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { TOOLS } from '../store'
import { LevelMeter, PageHeader, ToolCard } from '../components/ui'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import type { ToolId } from '../../../content/lectures'
import { useDocumentTitle } from '../lib/useDocumentTitle'

type Filter = Tier | 'all'

/**
 * The tool index, and the question it has to answer.
 *
 * A tier filter narrows twenty tools to six or seven, which is not the same
 * problem as finding one tool among twenty. Someone arriving here usually has
 * a name in mind ("the Phillips curve one", "the thing with the money
 * supply") rather than a tier, and the tier filter cannot help them: the
 * Phillips curve is in Intermediate and the trade-off version is too, so the
 * best the pills could do was hand back both and let them read. Search is the
 * control that matches the question, and the two compose — a tier narrows the
 * haystack, a query finds the needle in it.
 *
 * What it matches: the title and the description, case-insensitively, on
 * every word of the query rather than the whole phrase, so "curve phillips"
 * finds the Phillips Curve. Substring, not fuzzy — a reader who typos gets
 * nothing, which the empty state has to answer for, and a fuzzy matcher on
 * twenty items would silently reorder a hand-checked alphabetical list.
 *
 * `ToolCard` carries the lectures that teach each tool, so the search result
 * is still an index: you can find the tool and see where in the course it
 * belongs without opening it.
 */
export default function ToolsIndex() {
  useDocumentTitle(
    'Interactive tools',
    'Every simulation in the course. Each one is linked from the lecture that introduces it.',
  )
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const searchId = useId()

  const all = useMemo(() => Object.keys(TOOLS) as ToolId[], [])

  const grouped = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
    return all
      .filter((id) => filter === 'all' || TOOLS[id].category === filter)
      .filter((id) => {
        if (terms.length === 0) return true
        const haystack = `${TOOLS[id].title} ${TOOLS[id].description}`.toLowerCase()
        return terms.every((term) => haystack.includes(term))
      })
      .sort((a, b) => TOOLS[a].title.localeCompare(TOOLS[b].title))
  }, [all, filter, query])

  const filters: { id: Filter; label: string; tier?: Tier }[] = [
    { id: 'all', label: 'All' },
    ...TIER_ORDER.map((tier) => ({
      id: tier as Filter,
      label: TIER_META[tier].label,
      tier: tier as Tier,
    })),
  ]

  const filtering = query.trim().length > 0 || filter !== 'all'

  function reset() {
    setQuery('')
    setFilter('all')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Practice"
        title="Interactive tools"
        description="Every simulation in the course. Each one is linked from the lecture that introduces it."
      />

      <div className="mb-s-5 flex flex-col gap-s-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-s-2">
          <label
            htmlFor={searchId}
            className="text-micro font-semibold uppercase tracking-wider text-fg-subtle"
          >
            Search tools
          </label>
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-s-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Curve, multiplier, money supply"
              autoComplete="off"
              className="w-full max-w-md rounded-control border border-border bg-surface py-s-2 pl-s-8 pr-s-3 text-sm text-fg placeholder:text-fg-subtle"
            />
          </div>
        </div>
        <p className="text-xs tabular-nums text-fg-subtle">
          {grouped.length} of {all.length} tools
        </p>
      </div>

      {/*
        The pill padding is deliberately NOT on the density scale
        (`px-3.5 py-1.5`, literal). These are tap targets, and a density
        preference is a request about how much air the page has, not about how
        big a control gets to be. `compact` must not shrink the thing a reader
        has to hit. The gap between them, and the space between this row and
        the grid, are `s-*` steps because those are rhythm.
      */}
      <div className="mb-s-6 flex flex-wrap items-center gap-s-2">
        {filters.map(({ id, label, tier }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            aria-pressed={filter === id}
            // The level meter inside carries its own `aria-label` ("Level 1 of
            // 4"), which inside a button becomes part of the button's name:
            // "Level 1 of 4 Beginner", a level of nothing in particular. The
            // name a filter is announced with should be the tier.
            aria-label={label}
            className={`tap-clear inline-flex items-center gap-2 rounded-pill border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === id
                ? 'border-transparent bg-fg text-bg active:bg-fg-muted'
                : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg active:border-fg-subtle'
            }`}
          >
            {tier && <LevelMeter tier={tier} />}
            {label}
          </button>
        ))}
        {filtering && (
          <button
            type="button"
            onClick={reset}
            className="tap-clear inline-flex items-center gap-1 text-xs font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
          >
            <X size={13} aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      {grouped.length > 0 ? (
        <>
          {/* The grid is a section of this page and the page header is its
              `h1`, so the twenty card titles are `h3`s with no `h2` above
              them — a skipped level, and a reader moving by heading hears the
              page title and then twenty peers of nothing. The section has a
              visible name already ("20 of 20 tools", the count line above), so
              this gives that section a heading rather than inventing one: it
              is carried to assistive technology and off the screen, and the
              twenty `h3` card titles now sit one level below it. */}
          <h2 className="sr-only">All tools</h2>
          <div className="grid gap-s-3 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.map((toolId) => (
              <ToolCard key={toolId} toolId={toolId} />
            ))}
          </div>
        </>
      ) : (
        <div className="card p-s-6">
          <h2 className="text-base font-semibold text-fg">No tool matches that</h2>
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Nothing in the {filter === 'all' ? 'course' : TIER_META[filter].label.toLowerCase()}{' '}
            matches <span className="font-semibold text-fg">{query.trim()}</span>. Tools are
            titled after the model they draw, so try the model — IS-LM, Solow, Phillips — or the
            quantity you want to move.
          </p>
          <div className="mt-s-4">
            <button type="button" onClick={reset} className="button button-secondary">
              Show all {all.length} tools
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
