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

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms…"
        className="mb-6 w-full max-w-md rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg outline-none placeholder:text-fg-subtle focus:border-accent"
      />

      <dl className="grid gap-3 md:grid-cols-2">
        {entries.map((entry) => (
          <div key={entry.term} className="card p-4">
            <dt className="text-sm font-bold text-fg">{entry.term}</dt>
            <dd className="mt-1 text-sm text-fg-muted">
              {entry.definition}
              {entry.lecture != null && (
                <>
                  {' '}
                  <Link to={`/lecture/${entry.lecture}`} className="whitespace-nowrap text-xs">
                    Lecture {entry.lecture}
                  </Link>
                </>
              )}
            </dd>
          </div>
        ))}
      </dl>

      {entries.length === 0 && <p className="text-sm text-fg-muted">No terms match “{query}”.</p>}
    </div>
  )
}
