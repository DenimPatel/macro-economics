import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GLOSSARY } from '../../../content/glossary'
import { PageHeader } from '../components/ui'

export default function Glossary() {
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

      <label className="mb-6 block max-w-md">
        <span className="sr-only">Search glossary terms</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-card border border-border bg-surface px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-subtle focus:border-accent"
        />
      </label>

      <dl className="grid gap-3 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.term} className="card p-4">
            <dt className="font-serif text-sm font-bold text-fg">{entry.term}</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-fg-muted">
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
