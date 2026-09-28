/**
 * Turns a lecture note into the sections a reader can skim or study.
 *
 * The notes in `content/lecture_notes/` are the source of truth for lecture
 * prose and this file does not duplicate a word of them. What it adds is a
 * boundary: a note is a sequence of `##` sections, and a reader who already
 * knows the material wants the claims, not the argument that builds to them.
 *
 * ## Why this splits a STRING rather than walking the AST
 *
 * The obvious place to do this is a remark plugin, and the pipeline already
 * has two (`remark-gfm`, `remark-math`) plus the `promoteDisplayMath` pass. It
 * would still be the wrong place, for one reason: a section is not a single
 * mdast node. A section is an `h2` and everything up to the next `h2`, and
 * React renders that as a heading and a *sibling* subtree, not as one element.
 * Grouping them in the AST means inventing a node type, a handler, and a
 * custom component that receives children as a tree rather than as prose —
 * and `ReactMarkdown` passes children, not a wrapper. Splitting the string
 * first means each side of the toggle is an independent document, which is
 * what a disclosure is: two things that are hidden and shown independently, so
 * they cannot interact as nested markdown (a `##` inside a detail block would
 * otherwise have to be re-parented, and the TOC's heading extraction would
 * have to know which block a heading came from).
 *
 * ## The two halves
 *
 * `summary` is authored, in the note, as a fenced block:
 *
 * ```summary
 * - Defines macro as the study of aggregates, not of individuals
 * - The four key variables: inflation, unemployment, exchange rates, GDP
 * ```
 *
 * A bullet is a CLAIM and the prose below it is an ARGUMENT. They are not
 * summaries of each other and neither is derivable from the other, which is
 * why the summary is written rather than computed. A section that has no
 * authored summary falls back to the bold-lead bullets already in its prose,
 * so a section is never blank — but a derived summary is a first draft, and
 * `derivedCount` exists so that fact is visible rather than assumed.
 */

export interface LectureSection {
  /** Stable within a note, and what the toggle button's `aria-controls` uses. */
  id: string
  /** The `##` heading text, markdown-free. Empty for a note's preamble. */
  heading: string
  /**
   * The heading exactly as the note wrote it, number and all.
   *
   * It is kept because the section's anchor target is derived from it, and the
   * contents list derives its own from the same line. The card renders
   * `heading` and `ordinal` separately, so nothing else needs the raw form —
   * but the anchor has to be built from the same string the contents built its
   * own from, and the one that is guaranteed to still be around is this.
   */
  raw: string
  /** Numbered prefix carried over from the heading, e.g. `3` for `## 3. …`. */
  ordinal: string | null
  /** Markdown for the always-visible bullet list. */
  summary: string
  /** Markdown for the prose behind the toggle. Empty when there is none. */
  detail: string
  /** True when `summary` was taken from the prose rather than authored. */
  derived: boolean
  /** The `#fragment` this section's heading answers to. Empty for a preamble. */
  anchor: string
}

/** The fence language that marks an authored summary. */
export const SUMMARY_LANG = 'summary'

const FENCE = /^(`{3,}|~{3,})([A-Za-z0-9_-]*)\s*$/

/**
 * Split a note into sections on its `##` headings.
 *
 * A note opens with a preamble between the title and its first `##` — the
 * `## Overview` in most notes, or a short abstract in a few. It becomes the
 * first section with an empty heading, so a note with no preamble simply does
 * not produce one and the first section is the first real heading.
 */
export function splitSections(markdown: string): LectureSection[] {
  const lines = markdown.split('\n')
  const sections: LectureSection[] = []
  let heading = ''
  let rawHeading = ''
  let ordinal: string | null = null
  let body: string[] = []

  const flush = () => {
    const text = body.join('\n').trim()
    if (!heading && !text) return
    const { summary, detail, derived } = extractSummary(text)
    sections.push({
      id: sectionId(heading, sections.length),
      heading,
      raw: rawHeading,
      ordinal,
      summary,
      detail,
      derived,
      anchor: rawHeading ? headingAnchor(rawHeading) : '',
    })
  }

  for (const line of lines) {
    const match = /^##\s+(.*)$/.exec(line)
    // A `##` inside a fence is not a heading, and one of these notes has a
    // lesson that shows a markdown example. Honour the fence or the split
    // lands mid-block.
    if (match && !insideFence(body)) {
      flush()
      const raw = match[1].trim()
      // A numbered heading is numbered ONCE. The card renders the ordinal in
      // its own column so the numbers can line up down the page, which means
      // the heading has to give the number up — or the card reads
      // "11. What is Macroeconomics?" for section 1.
      const numbered = /^(\d+)[.)]?\s+(.*)$/.exec(raw)
      ordinal = numbered ? numbered[1] : null
      heading = numbered ? numbered[2].trim() : raw
      rawHeading = raw
      body = []
    } else {
      body.push(line)
    }
  }
  flush()
  return sections
}

/** Whether the line that would become a heading is inside an open fence. */
function insideFence(soFar: string[]): boolean {
  let open: string | null = null
  for (const l of soFar) {
    const m = FENCE.exec(l)
    if (!m) continue
    if (open === null) open = m[1][0]
    else if (m[1][0] === open) open = null
  }
  return open !== null
}

/**
 * Split a section's body into its authored summary and the rest.
 *
 * A section may carry at most one summary block. A second one is a content
 * error rather than a merge, because there is no honest way to guess which of
 * two the author meant — and silently concatenating them would put the second
 * in the detail pane, where it would read as an argument.
 */
export function extractSummary(body: string): {
  summary: string
  detail: string
  derived: boolean
} {
  const lines = body.split('\n')
  const summaryAt: number[] = []
  for (let i = 0; i < lines.length; i++) {
    const open = FENCE.exec(lines[i])
    if (!open || open[2] !== SUMMARY_LANG) continue
    const marker = open[1][0]
    let j = i + 1
    const block: string[] = []
    while (j < lines.length) {
      const close = FENCE.exec(lines[j])
      if (close && close[1][0] === marker && close[2] === '') break
      block.push(lines[j])
      j++
    }
    summaryAt.push(i)
    void block
  }

  if (summaryAt.length === 0) {
    return { summary: deriveSummary(body), detail: body.trim(), derived: true }
  }

  const [first] = summaryAt
  // Everything before and after the fenced block is detail.
  const detail = [...lines.slice(0, first), ...lines.slice(afterFence(lines, first))]
    .join('\n')
    .trim()

  // Re-read the block, this time keeping it.
  const open = FENCE.exec(lines[first])!
  const marker = open[1][0]
  const block: string[] = []
  let j = first + 1
  while (j < lines.length) {
    const close = FENCE.exec(lines[j])
    if (close && close[1][0] === marker && close[2] === '') break
    block.push(lines[j])
    j++
  }
  return { summary: block.join('\n').trim(), detail, derived: false }
}

/** The index just past the fence that opens at `start`. */
function afterFence(lines: string[], start: number): number {
  const marker = FENCE.exec(lines[start])![1][0]
  let j = start + 1
  while (j < lines.length) {
    const close = FENCE.exec(lines[j])
    if (close && close[1][0] === marker && close[2] === '') return j + 1
    j++
  }
  return lines.length
}

/**
 * A first-draft summary for a section that has no authored one: its own
 * bold-lead bullets, verbatim.
 *
 * These notes are written in a consistent voice — `- **Term**: what it means`
 * — so the bullets are already claims and already skimmable. What this cannot
 * do is choose between them, or say what a section of pure prose is *about*,
 * which is why an authored summary is preferred and why `derived` is carried
 * all the way to the page.
 */
export function deriveSummary(body: string): string {
  const out: string[] = []
  for (const line of body.split('\n')) {
    if (/^\s*-\s+\*\*.+\*\*/.test(line)) out.push(line.trim())
  }
  return out.join('\n')
}

/** A stable, collision-free id for a section. */
export function sectionId(heading: string, index: number): string {
  const slug = heading
    .toLowerCase()
    .replace(/^\d+[.)]?\s*/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `section-${index}-${slug || 'preamble'}`
}

/**
 * The `#fragment` a `##` heading answers to.
 *
 * This is the one place the two halves of the lecture page agree on how a
 * heading becomes an anchor, and it is here rather than in the card because
 * the other half of the agreement — `contentsHeadings` in
 * `content/markdownComponents.tsx` — is derived from the markdown by a
 * different function. Two functions reading the same line is the shape that
 * produced the dead contents list this fixes: the card took its id from
 * React's `useId()` while the contents took its from a slug, so all 25
 * lectures shipped a rail of links that moved the page nowhere and a scroll
 * spy that never left its first entry.
 *
 * The rule is therefore stated once, in full, and mirrored exactly by the
 * contents side: lowercase, drop everything that is not a letter, digit, space
 * or hyphen, spaces to hyphens. Emphasis markers and `$` go before that,
 * because the contents list strips them from the label it prints and must
 * strip them from the fragment it links to as well.
 *
 * A heading is NOT rendered as markdown anywhere — the card prints it as
 * text — so a note that writes `$u_n$` or `**bold**` in a `##` gets the
 * markers on screen. That is a note-authoring problem, not a slug problem,
 * and `check-note.mjs` and the rendered-output sweep are what catch it.
 */
export function headingAnchor(rawHeading: string): string {
  return rawHeading
    .replace(/[*_`$]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** How many sections of a note have no authored summary. */
export function derivedCount(sections: LectureSection[]): number {
  return sections.filter((s) => s.derived).length
}

/** The plain-text claim list, for tests and for a note's own summary line. */
export function summaryItems(summary: string): string[] {
  return summary
    .split('\n')
    .map((l) => l.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean)
}
