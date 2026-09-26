import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { GLOSSARY } from '../../../content/glossary'
import { PageHeader } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function Glossary() {
  useDocumentTitle(
    'Glossary',
    'Key macroeconomics terms, each linked to the lecture where it is introduced.',
  )
  const [query, setQuery] = useState('')

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? GLOSSARY.filter(
          (entry) =>
            entry.term.toLowerCase().includes(q) || entry.definition.toLowerCase().includes(q),
        )
      : GLOSSARY
    return [...filtered].sort((a, b) => a.term.localeCompare(b.term))
  }, [query])

  return (
    <div>
      <PageHeader
        eyebrow="Reference"
        title="Glossary"
        description="Key terms, each linked to the lecture where it is introduced."
      />

      <div className="mb-7 max-w-md">
        <label className="relative block">
          <span className="sr-only">Search glossary terms</span>
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="w-full rounded-card border border-border bg-surface py-2.5 pl-9 pr-3.5 text-sm text-fg placeholder:text-fg-subtle focus:border-accent"
          />
        </label>
        <p className="mt-2 text-xs tabular-nums text-fg-subtle">
          {entries.length} of {GLOSSARY.length} terms
        </p>
      </div>

      <dl className="grid gap-x-6 gap-y-5 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.term} className="border-b border-border pb-4">
            <dt className="text-sm font-semibold text-fg">{entry.term}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-fg-muted">
              {entry.definition}
              {entry.lecture != null && (
                <>
                  {' '}
                  <Link
                    to={`/lecture/${entry.lecture}`}
                    className="whitespace-nowrap text-xs text-accent-ink no-underline hover:underline"
                  >
                    Lecture {entry.lecture}
                  </Link>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {entries.length === 0 && (
        <p className="text-sm text-fg-muted">
          No terms match “{query}”. Try a shorter search, or browse the{' '}
          <Link to="/concepts" className="text-accent-ink">
            concept map
          </Link>
          .
        </p>
      )}
    </div>
  )
}
