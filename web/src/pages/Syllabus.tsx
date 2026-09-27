import { useId, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ExternalLink, Play } from 'lucide-react'
import { LECTURES } from '../../../content/lectures'
import { LevelMeter, PageHeader } from '../components/ui'
import { TIER_META, TIER_ORDER, type Tier } from '../design/tokens'
import { TOOLS } from '../store'
import { useProgress } from '../learning/progress'
import { matchCount, matchesAllWords } from '../lib/lookupSearch'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/**
 * The syllabus: all twenty-five lectures, their tier, what they cover, their
 * tools, their review flag and their video. And the progress on all of it.
 *
 * The page is the course's map, so the two questions it has to answer are
 * "where am I" and "what next", and the second one is not answered by a list.
 * A returning reader has to be able to find their next unfinished lecture
 * without reading 25 rows, which is what the search and the "Next" link are
 * for; the same all-words rule as the tool index and the glossary is in
 * `lib/lookupSearch`, so a query behaves the same in all three.
 *
 * THE SUMMARY, AND WHY IT IS A `title` AND NOT A TRUNCATION.
 * `truncate` was silently destroying the second half of every summary, and on
 * this page that half is the part that tells a reader whether a lecture is the
 * one they want: "Why macro is not just micro writ large, the big variables,
 * and how aggregate outcomes produce paradoxes like…" says the lecture is
 * about macro basics; the rest names the paradoxes, which is the deciding
 * information. A `title` attribute does not fix that — it is a hover-only
 * affordance, it does not exist on touch at all, and a screen reader reads it
 * as the element's description rather than as content. So the summary is
 * clamped to three lines and the *whole* of it is in the DOM, the name, and
 * the `title`. A `<details>` per row was the alternative and was rejected: 25
 * disclosures is 25 more tab stops on the page a reader uses to scan.
 *
 * THE TOOL PILLS. `+1` with a `title` naming the hidden tool, which is the
 * difference between a card that is honest about being a sample and a card
 * that has quietly dropped a link. Nine of the twenty-five lectures have more
 * than two tools, so this is not a rare case.
 *
 * THE COMPLETION STATE IS TWO SIGNALS, NOT ONE. A `bg-ok/15 text-ok-ink`
 * disc is a colour, and the tint is 15% of a status hue on a surface — a
 * reader who cannot separate that from the neutral `bg-surface-2` disc has no
 * way to know a lecture is done. The `Check` glyph is the other half, and it
 * is the one that survives. The number is deliberately replaced by the glyph
 * rather than shown beside it, because "7" with a tick on it is one claim and
 * "7" next to a tick is two.
 */
export default function Syllabus() {
  const { completedLectures } = useProgress()
  useDocumentTitle(
    'Syllabus',
    `The whole course at a glance: ${LECTURES.length} lectures in four tiers, each linked to its source video, its tools, and a short quiz.`,
  )
  const [query, setQuery] = useState('')
  const searchId = useId()

  const total = LECTURES.length
  const done = completedLectures.length
  const pct = Math.round((done / total) * 100)

  const matches = useMemo(
    () =>
      LECTURES.filter((lecture) =>
        matchesAllWords(
          `${lecture.n} ${lecture.title} ${lecture.summary} ${lecture.concepts.join(' ')}`,
          query,
        ),
      ),
    [query],
  )

  const groups = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: matches.filter((l) => l.tier === tier),
  })).filter((g) => g.lectures.length > 0)

  /** The first lecture in course order that is not done, for a reader in. */
  const next = useMemo(
    () => LECTURES.find((lecture) => !completedLectures.includes(lecture.n)),
    [completedLectures],
  )

  const filtering = query.trim().length > 0

  // Derived from the lecture data rather than hard-coded, so adding or
  // re-tagging a review lecture cannot leave this note stale.
  const reviewNumbers = LECTURES.filter((l) => l.review)
    .map((l) => l.n)
    .sort((a, b) => a - b)
  const reviewList =
    reviewNumbers.length === 0
      ? 'None'
      : reviewNumbers.length === 1
        ? `${reviewNumbers[0]}`
        : `${reviewNumbers.slice(0, -1).join(', ')} and ${reviewNumbers[reviewNumbers.length - 1]}`

  return (
    <div>
      <PageHeader
        eyebrow="Syllabus"
        title="The whole course at a glance"
        description={`${LECTURES.length} lectures in four tiers, each linked to its source video, its tools, and a short quiz. Progress is saved on this device.`}
      />

      <div className="mb-s-12 max-w-md">
        <div className="mb-2 flex justify-between text-xs text-fg-muted">
          <span>
            {done} of {total} lectures complete
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course completion"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-slow"
            style={{ width: `${pct}%` }}
          />
        </div>
        {next && (
          <p className="mt-s-3 text-sm text-fg-muted">
            <span className="text-fg-subtle">Next: </span>
            <Link
              to={`/lecture/${next.n}`}
              className="tap-clear font-semibold text-accent-ink no-underline hover:underline active:opacity-70"
            >
              {next.n}. {next.title}
            </Link>
          </p>
        )}
      </div>

      <div className="mb-s-6 max-w-md">
        <label
          htmlFor={searchId}
          className="text-micro font-semibold uppercase tracking-wider text-fg-subtle"
        >
          Find a lecture
        </label>
        <div className="relative mt-s-2">
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Number, title, topic, concept…"
            autoComplete="off"
            // The search field is a hit area, so its `py-2.5` stays literal.
            className="w-full rounded-card border border-border bg-surface py-2.5 pl-s-3 pr-s-3 text-sm text-fg placeholder:text-fg-subtle"
          />
        </div>
        <p className="mt-s-2 text-xs tabular-nums text-fg-subtle">
          <span>
            {matchCount(matches.length, total)} lectures
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

      {matches.length === 0 ? (
        <div className="card p-s-6">
          <h2 className="text-base font-semibold text-fg">No lecture matches that</h2>
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            Nothing in the course matches <span className="font-semibold text-fg">{query.trim()}</span>.
            A query matches a lecture's number, its title, its summary and its concepts, so try
            the model or the term rather than a sentence.
          </p>
          <div className="mt-s-4">
            <button type="button" onClick={() => setQuery('')} className="button button-secondary">
              Show all {total} lectures
            </button>
          </div>
        </div>
      ) : (
        groups.map(({ tier, meta, lectures }) => {
          const tierDone = lectures.filter((l) => completedLectures.includes(l.n)).length
          return (
            <section key={tier} className="mb-s-12">
              <div className="mb-s-4 flex flex-wrap items-center gap-2.5">
                <LevelMeter tier={tier} />
                <h2 className="text-xl font-semibold tracking-tight text-fg">{meta.label}</h2>
                <span className="text-xs text-fg-subtle">
                  {lectures.length} lecture{lectures.length === 1 ? '' : 's'}
                </span>
                {/* The per-tier count, from the home page. On the home page it
                    is a "3 of 7 complete" line on a path; here the tier is a
                    section heading over exactly those lectures, so the reader
                    is already looking at them and the count is the only
                    honest thing to put next to the number of lectures. */}
                {!filtering && tierDone > 0 && (
                  <span className="text-xs tabular-nums text-fg-muted">
                    {tierDone} of {LECTURES.filter((l) => l.tier === tier).length} complete
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {lectures.map((lecture) => {
                  const isDone = completedLectures.includes(lecture.n)
                  const extraTools = lecture.tools.slice(2)
                  return (
                    <li key={lecture.n}>
                      {/* The row's block padding is a density step and its side
                          inset is not: the side inset decides how far the title
                          can run before it wraps, which is a width decision and
                          not a density one. */}
                      <div className="card flex flex-wrap items-center gap-x-3 gap-y-2 px-3.5 py-s-3">
                        {/* `aria-label` here is the tier heading, so "3. Title"
                            in a list of lectures is not read as "Level 1 of 4".
                            `Complete`/`Not started` is the whole completion
                            state in words, and the visible glyph is the other
                            half. */}
                        <span
                          aria-label={`Lecture ${lecture.n}: ${isDone ? 'complete' : 'not started'}`}
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums ${
                            isDone ? 'bg-ok/15 text-ok-ink' : 'bg-surface-2 text-fg-muted'
                          }`}
                        >
                          {isDone ? (
                            <Check size={14} aria-hidden="true" />
                          ) : (
                            <span aria-hidden="true">{lecture.n}</span>
                          )}
                        </span>
                        {/* `min-w-40` is load-bearing, and it is a SIZE and not
                            a density step, so it stays literal.
                            The card is `flex-wrap`, and flex breaks a line on
                            each item's FLEX-BASIS, not on its grown width. The
                            chips row's basis is `auto`, so it is measured at its
                            max-content width — a lecture with two long tool
                            titles is a ~640px item — while the title column's
                            basis is 0 and it is only a `grow`. The row was
                            therefore sized FIRST and the title column handed
                            whatever was left, which on some cards was 2px:
                            "6. The IS-LM Model (Part II): Applications and
                            Policy Analysis" rendered 1400px tall at three
                            characters a line.
                            `min-width` clamps the hypothetical main size, so a
                            floor on the title column is taken into account
                            BEFORE the line is broken and the chips row wraps
                            below it instead. Which cards broke depended on the
                            length of a tool's name, not on the viewport, and
                            the worst cases were at 640-900px rather than at
                            390px, so a `sm:`-scoped fix would have been a
                            guess. */}
                        <div className="min-w-40 flex-1">
                          <Link
                            to={`/lecture/${lecture.n}`}
                            className="tap-clear text-sm font-semibold text-fg no-underline hover:text-accent-ink active:opacity-70"
                          >
                            {lecture.n}. {lecture.title}
                          </Link>
                          <p
                            className="line-clamp-3 text-xs leading-relaxed text-fg-subtle"
                            title={lecture.summary}
                          >
                            {lecture.summary}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {lecture.review && <span className="badge">Review</span>}
                          {lecture.tools.slice(0, 2).map((toolId) => (
                            <Link
                              key={toolId}
                              to={`/tool/${toolId}`}
                              className="tap-clear rounded-pill border border-border bg-surface px-2 py-0.5 text-micro text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-accent-ink active:border-fg-subtle"
                            >
                              {TOOLS[toolId]?.title ?? toolId}
                            </Link>
                          ))}
                          {extraTools.length > 0 && (
                            <span
                              className="tabular-nums text-micro text-fg-subtle"
                              title={`Also in this lecture: ${extraTools
                                .map((id) => TOOLS[id]?.title ?? id)
                                .join(', ')}`}
                            >
                              +{extraTools.length}
                            </span>
                          )}
                          <a
                            href={lecture.videoUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="tap-clear inline-flex items-center gap-1 text-micro text-fg-subtle no-underline hover:text-accent-ink active:opacity-70"
                            title="Source video"
                          >
                            <Play size={11} aria-hidden="true" />
                            Video <ExternalLink size={11} aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })
      )}

      <p className="text-xs text-fg-subtle">
        Review lectures ({reviewList}) consolidate earlier material and have no new tools.
      </p>
    </div>
  )
}
