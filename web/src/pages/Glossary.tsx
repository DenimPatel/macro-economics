import { useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUp, Search, X } from 'lucide-react'
import { GLOSSARY } from '../../../content/glossary'
import { PageHeader } from '../components/ui'
import { matchCount, matchesAllWords, useSearchFocusShortcut } from '../lib/lookupSearch'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/**
 * The glossary, and the question it has to answer: which term was that.
 *
 * A reader who arrives here has a word in mind and wants the definition in
 * under a second. The page is ordered alphabetically so the answer is
 * available without typing at all, and the search is there for the reader who
 * does not remember whether the course calls it `LM curve` or `money demand`.
 *
 * MATCHING. `matchesAllWords` in `lib/lookupSearch`, shared with the tool index
 * and the concept map: every word of the query, in any order, against the term
 * AND the definition. The old rule was one substring, which made the two
 * phrases a reader actually types — "money multiplier", "natural rate" — both
 * return nothing, on a page whose whole job is to be found.
 *
 * THE INDEX STRIP. Thirty-five terms, sorted, in two columns from `md`. A–Z is
 * the right instrument here and a letter-jump is not: the columns are CSS
 * grid columns, so a filtered list re-flows into them and "B" has no stable row
 * to scroll to. A strip that highlights the letters that have matches and says
 * so — `A–F` when a query is in and all twenty-six when one is not — gives the
 * scannability an index is for without pretending a row exists.
 *
 * THE COLUMNS. `sm:columns-2` rather than a grid. A grid's second column is
 * the bottom half of the list, so a reader who read the left column all the
 * way down had to return to the top to carry on; CSS multi-column fills
 * top-to-bottom then starts the next column, so the second column is the next
 * term and nothing has to be remembered or re-found. The cost is that the
 * columns are balanced rather than fixed, which is a scroll-position cost and
 * not a comprehension one. Below `sm` there is one column, so at 390px a
 * definition has the full width of the page to wrap in and cannot rag into
 * two words a line.
 */
export default function Glossary() {
  useDocumentTitle(
    'Glossary',
    'Key macroeconomics terms, each linked to the lecture where it is introduced.',
  )
  const [query, setQuery] = useState('')
  const [showJump, setShowJump] = useState(true)
  const searchId = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  useSearchFocusShortcut(searchRef)

  const sorted = useMemo(
    () => [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term)),
    [],
  )

  const entries = useMemo(() => {
    const trimmed = query.trim()
    if (trimmed === '') return sorted
    return sorted.filter((entry) =>
      matchesAllWords(`${entry.term} ${entry.definition}`, trimmed),
    )
  }, [query, sorted])

  const filtering = query.trim().length > 0

  /** The letters a filtered list actually contains, for the index strip. */
  const letters = useMemo(() => {
    const present = new Set(entries.map((entry) => entry.term.charAt(0).toUpperCase()))
    const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const active = all.filter((letter) => present.has(letter))
    return { all, active, range: active.length > 0 ? `${active[0]}–${active[active.length - 1]}` : null }
  }, [entries])

  return (
    <div>
      <PageHeader
        eyebrow="Reference"
        title="Glossary"
        description="Key terms, each linked to the lecture where it is introduced."
      />

      <div className="mb-s-5 max-w-md">
        <label
          htmlFor={searchId}
          className="text-micro font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Search terms
        </label>
        <div className="relative mt-s-2">
          <Search
            size={15}
            className="pointer-events-none absolute left-s-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            id={searchId}
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Money multiplier, output gap…"
            autoComplete="off"
            // The search field is a hit area, so its `py-2.5` stays literal.
            className="w-full rounded-card border border-border bg-surface py-2.5 pl-s-8 pr-s-3 text-sm text-fg placeholder:text-fg-subtle"
          />
        </div>
        {/* The count, the clear, and the shortcut hint on one row, so the
            field's own state and the way to undo it are the same object. */}
        <div className="mt-s-2 flex flex-wrap items-center gap-x-s-3 gap-y-1 text-xs text-fg-subtle">
          <span className="tabular-nums" data-glossary-count>
            {matchCount(entries.length, sorted.length)} terms
          </span>
          {filtering && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="tap-clear inline-flex items-center gap-1 font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
            >
              <X size={13} aria-hidden="true" /> Clear
            </button>
          )}
          <span className="ml-auto inline-flex items-center gap-s-1">
            Press
            <kbd className="rounded border border-border bg-surface-2 px-1 py-px font-mono text-micro text-fg-muted">
              /
            </kbd>
            to search
          </span>
        </div>
      </div>

      {/* The A–Z index. Collapsible because a strip of twenty-six letters is
          chrome on a page whose subject is a list of words, and a reader who
          wants it has a control to ask for it with.

          The letters are `aria-hidden` on purpose. A screen reader walking
          twenty-six single-character elements is being read an alphabet, which
          is noise next to a list it can navigate; what the strip actually
          says — how many letters survived the filter, and which span — is in
          the button's own text, so nothing is lost. A weight and a colour step
          are the non-colour-safe half being carried by weight, and the whole
          row duplicates the alphabetical order of the list beneath it. */}
      <nav className="mb-s-4" aria-label="Glossary index">
        <button
          type="button"
          onClick={() => setShowJump((open) => !open)}
          aria-expanded={showJump}
          className="tap-clear inline-flex items-center gap-1 text-micro font-semibold uppercase tracking-wider text-fg-subtle no-underline hover:text-accent-ink active:opacity-70"
        >
          {showJump ? 'Hide index' : 'Show index'}
          {filtering && letters.range && (
            <span className="tabular-nums normal-case text-fg-muted">{letters.range}</span>
          )}
        </button>
        {showJump && (
          <p className="mt-s-2 flex flex-wrap items-baseline gap-x-s-2 gap-y-s-1 text-sm tabular-nums text-fg-muted">
            {letters.all.map((letter) => {
              const here = letters.active.includes(letter)
              return (
                <span
                  key={letter}
                  className={here ? 'font-semibold text-fg' : 'text-fg-subtle'}
                >
                  {letter}
                </span>
              )
            })}
          </p>
        )}
      </nav>

      {entries.length > 0 ? (
        <>
          <dl className="columns-1 gap-x-s-8 sm:columns-2">
            {entries.map((entry) => (
              <div key={entry.term} className="mb-s-4 border-b border-border pb-s-3">
                <dt className="text-sm font-semibold text-fg">{entry.term}</dt>
                <dd className="mt-s-1 text-sm leading-relaxed text-fg-muted">
                  {entry.definition}
                  {entry.lecture != null && (
                    <>
                      {' '}
                      <Link
                        to={`/lecture/${entry.lecture}`}
                        className="tap-clear whitespace-nowrap text-xs text-accent-ink no-underline hover:underline active:opacity-70"
                      >
                        Lecture {entry.lecture}
                      </Link>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {/* With the index strip, the letters already say how far down the
              list to look; this is the answer to the other half of the same
              question, which is "how do I get back to the field".

              The scroll is instant rather than smooth, which is the same
              choice `Shell` makes on a route change: `scrollTo` with an
              explicit `behavior: 'smooth'` overrides the stylesheet's
              reduced-motion `scroll-behavior: auto !important`, and this
              button is also a focus move, so two animations at once is one
              too many. */}
          {entries.length > 4 && (
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0 })
                const field = searchRef.current
                field?.focus()
                field?.select()
              }}
              className="tap-clear mt-s-2 inline-flex items-center gap-1 text-xs font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
            >
              <ArrowUp size={13} aria-hidden="true" /> Back to search
            </button>
          )}
        </>
      ) : (
        <div className="card p-s-6">
          <h2 className="text-base font-semibold text-fg">No term matches that</h2>
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Nothing in the glossary matches{' '}
            <span className="font-semibold text-fg">{query.trim()}</span>. Definitions are
            searched as well as terms, so try the words the course uses rather than the
            words you remember.
          </p>
          <div className="mt-s-4 flex flex-wrap gap-s-2">
            <button
              type="button"
              onClick={() => setQuery('')}
              className="button button-secondary"
            >
              Show all {sorted.length} terms
            </button>
            <Link to="/concepts" className="button button-secondary no-underline">
              Browse the concept map
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
