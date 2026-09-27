import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Search } from 'lucide-react'
import { LECTURES } from '../../../content/lectures'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { useProgress } from './progress'
import { TOOLS } from '../store'
import { LevelMeter, PageHeader } from '../components/ui'
import { matchCount, matchesAllWords } from '../lib/lookupSearch'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/** A literal id, not `useId`, so the card's `href` fragment below resolves. */
const SEARCH_ID = 'concept-search'

/**
 * The concept map, and who it is for.
 *
 * A reader looking for one term. That is the whole job, and it is the job the
 * page could not do: 118 pills across 25 cards, grouped by tier, is a map of
 * the course's STRUCTURE and not an index of its vocabulary. "Where is
 * multiplier taught?" was answerable only by reading every card. So there is a
 * search, and it is the SAME search as the tool index and the glossary —
 * every word of the query, in any order, from `lib/lookupSearch` — because a
 * third rule on a third lookup page would be a third thing for a reader to
 * learn. It matches the concepts AND the lecture number and title, so both
 * "multiplier" and "goods market" work.
 *
 * HIERARCHY. The lecture is the entry point and the concepts are the payload,
 * which is why the lecture number and title are one link at the top of the
 * card and the pills below are plain text. A pill that navigated somewhere
 * would have to navigate to the same lecture the card already links to, and a
 * reader would have two routes to one place and no way to choose.
 *
 * A CARD IS NOT A LINK. It holds a title link and tool links, so making the
 * card a target would put an anchor inside an anchor — invalid HTML, and the
 * click would go to the card anyway. What it gets instead is the session's
 * "Go to search" affordance: a real `href` to the field's id, so it is a
 * focusable target (the card is fully keyboard-reachable), it still works with
 * no JavaScript, and it asks for nothing the field above it cannot do.
 *
 * SHARED CONCEPTS. `expectations` and `depreciation` are each listed by two
 * lectures — two of 116 unique concepts, so this is a rarity and not a
 * feature. A pill for one of them carries a `+1` and a title naming the other
 * lecture, which is a fact about the pill rather than a promise about a
 * cross-reference feature the course does not otherwise have.
 */
export default function ConceptMap() {
  const { completedLectures } = useProgress()
  useDocumentTitle(
    'Concept map',
    'Every concept in the course, linked to the lecture that teaches it and the tool that practises it.',
  )
  const [query, setQuery] = useState('')

  /** Every concept to the lectures that list it, so a shared one can say so. */
  const conceptIndex = useMemo(() => {
    const index = new Map<string, number[]>()
    for (const lecture of LECTURES) {
      for (const concept of lecture.concepts) {
        const lectures = index.get(concept)
        if (lectures) lectures.push(lecture.n)
        else index.set(concept, [lecture.n])
      }
    }
    return index
  }, [])

  const groups = useMemo(
    () =>
      TIER_ORDER.map((tier: Tier) => ({
        tier,
        meta: TIER_META[tier],
        entries: LECTURES.filter(
          (lecture) =>
            lecture.tier === tier &&
            lecture.concepts.length > 0 &&
            matchesAllWords(
              `${lecture.n} ${lecture.title} ${lecture.concepts.join(' ')}`,
              query,
            ),
        ).map((lecture) => ({ lecture, concepts: lecture.concepts })),
      })).filter((group) => group.entries.length > 0),
    [query],
  )

  const shown = groups.reduce((count, group) => count + group.entries.length, 0)
  /**
   * The concepts that MATCH, not the concepts on the cards that matched. A
   * card can match on its lecture number and carry seven concepts of which one
   * is the one the reader typed, and "5 of 118 concepts" against a query for
   * one of them is a count that answers a different question.
   */
  const matchedConcepts = groups.reduce(
    (count, group) =>
      count +
      group.entries.reduce(
        (n, entry) =>
          n + entry.concepts.filter((c) => matchesAllWords(c, query)).length,
        0,
      ),
    0,
  )
  const conceptTotal = LECTURES.reduce((count, lecture) => count + lecture.concepts.length, 0)
  const filtering = query.trim().length > 0

  return (
    <div>
      <PageHeader
        eyebrow="Study aid"
        title="Concept map"
        description="Every idea in the course, grouped by tier, linking to where it is taught and where you can practise it. Ticks appear as you complete lectures."
      />

      <div className="mb-s-6 max-w-md">
        <label
          htmlFor={SEARCH_ID}
          className="text-micro font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Find a concept
        </label>
        <div className="relative mt-s-2">
          <Search
            size={15}
            className="pointer-events-none absolute left-s-3 top-1/2 -translate-y-1/2 text-fg-subtle"
            aria-hidden="true"
          />
          <input
            id={SEARCH_ID}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Multiplier, Phillips curve, expectations…"
            autoComplete="off"
            // The search field is a hit area, so its `py-2.5` stays literal.
            className="w-full rounded-card border border-border bg-surface py-2.5 pl-s-8 pr-s-3 text-sm text-fg placeholder:text-fg-subtle"
          />
        </div>
        <p className="mt-s-2 text-xs tabular-nums text-fg-subtle">
          <span>
            {filtering
              ? `${matchCount(matchedConcepts, conceptTotal)} concepts`
              : `${conceptTotal} concepts in ${LECTURES.length} lectures`}
          </span>
          {filtering && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => setQuery('')}
                className="tap-clear font-semibold text-fg-muted no-underline hover:text-accent-ink active:opacity-70"
              >
                Clear
              </button>
            </>
          )}
        </p>
      </div>

      {shown === 0 ? (
        <div className="card p-s-6">
          <h2 className="text-base font-semibold text-fg">No concept matches that</h2>
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            No lecture lists{' '}
            <span className="font-semibold text-fg">{query.trim()}</span> among its concepts. A
            query matches a concept name, a lecture number and a lecture title — the{' '}
            <Link
              to="/glossary"
              className="tap-clear text-accent-ink no-underline hover:underline active:opacity-70"
            >
              glossary
            </Link>{' '}
            searches the definitions as well as the terms.
          </p>
          <div className="mt-s-4 flex flex-wrap gap-s-2">
            <button type="button" onClick={() => setQuery('')} className="button button-secondary">
              Show all {conceptTotal} concepts
            </button>
            <Link to="/glossary" className="button button-secondary no-underline">
              Open the glossary
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(({ tier, meta, entries }) => (
            <section key={tier}>
              <div className="mb-s-4 flex items-center gap-2.5">
                <LevelMeter tier={tier} />
                <h2 className="text-xl font-semibold tracking-tight text-fg">{meta.label}</h2>
                {filtering && (
                  <span className="text-xs tabular-nums text-fg-subtle">
                    {entries.length} lecture{entries.length === 1 ? '' : 's'}
                  </span>
                )}
              </div>
              <div className="grid gap-s-3 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map(({ lecture, concepts }) => {
                  const done = completedLectures.includes(lecture.n)
                  return (
                    <div key={lecture.n} className="card flex flex-col p-s-4">
                      <div className="mb-s-2 flex items-start gap-2">
                        <Link
                          to={`/lecture/${lecture.n}`}
                          className="tap-clear text-sm font-semibold text-fg no-underline hover:text-accent-ink active:opacity-70"
                        >
                          {lecture.n}. {lecture.title}
                        </Link>
                        {done && (
                          <Check
                            size={15}
                            className="ml-auto mt-0.5 shrink-0 text-ok"
                            aria-label="Completed"
                          />
                        )}
                      </div>
                      {/* The session's affordance, for a card that is not
                          itself a link. The hash jump is instant, for the
                          reason the glossary's is: an explicit
                          `behavior: 'smooth'` would override the reduced-motion
                          `scroll-behavior` reset, and a focus move is not a
                          place for a second animation. */}
                      <a
                        href={`#${SEARCH_ID}`}
                        onClick={() => {
                          window.scrollTo({ top: 0 })
                          document.getElementById(SEARCH_ID)?.focus()
                        }}
                        className="tap-clear mb-s-1 flex items-center gap-1 self-start text-micro font-semibold text-fg-subtle no-underline hover:text-accent-ink active:opacity-70"
                      >
                        Go to search <ArrowRight size={12} aria-hidden="true" />
                      </a>
                      <div className="flex flex-wrap gap-1.5">
                        {concepts.map((concept) => {
                          const here = conceptIndex.get(concept) ?? [lecture.n]
                          const others = here.filter((n) => n !== lecture.n)
                          return (
                            <span
                              key={concept}
                              title={
                                others.length > 0
                                  ? `Also listed in lecture ${others.join(', ')}`
                                  : undefined
                              }
                              className="rounded-pill bg-surface-2 px-2 py-0.5 text-micro text-fg-muted"
                            >
                              {concept}
                              {others.length > 0 && (
                                <span className="tabular-nums text-fg-subtle">
                                  {' '}
                                  +{others.length}
                                </span>
                              )}
                            </span>
                          )
                        })}
                      </div>
                      {lecture.tools.length > 0 && (
                        <div className="mt-s-3 flex flex-wrap gap-x-3 gap-y-1 border-t border-border pt-s-2 text-xs">
                          {lecture.tools.map((toolId) => (
                            <Link
                              key={toolId}
                              to={`/tool/${toolId}`}
                              className="tap-clear text-accent-ink no-underline hover:underline active:opacity-70"
                            >
                              {TOOLS[toolId]?.title ?? toolId}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
