/* eslint-disable react-refresh/only-export-components -- helpers live beside the renderer intentionally. */
/**
 * Markdown rendering for lecture notes: GFM tables, KaTeX math, and heading
 * anchors. Heading ids are generated here with the same `slugify` used to build
 * the table of contents, so the two can never drift.
 */
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/**
 * Make a line that is entirely `$$ ... $$` a display-equation *block*.
 *
 * This is the largest real defect in the lecture body, and it has two causes.
 *
 * The first is CommonMark: a line that continues a paragraph is a lazy
 * continuation line, and `remark-math` read `$$...$$` in inline position.
 * Across the 25 notes that is 400 of the 433 display equations, and it left
 * `.prose-lecture .katex-display` matching nothing at all — measured on
 * `/lecture/16`: 171 `.katex` elements, **zero** `.katex-display`. So the
 * `overflow-x: auto` that keeps a wide equation inside the measure was dead
 * CSS, and the `\begin{cases}` system in Lecture 5 came out as a second run
 * of text on the same line rather than a stacked pair.
 *
 * Blank lines alone are not enough, which is the second cause and the reason
 * this exists as a transform at all. `micromark-extension-math` only opens a
 * *flow* math block when the `$$` fence is followed by a space or a line
 * ending — `$$Y = K$$` is rejected, because `Y` is neither. One-line display
 * equations therefore have to be written as a fence with the expression on its
 * own line:
 *
 *     $$
 *     Y = K
 *     $$
 *
 * Which is what the notes' own 33 already-correct equations look like, and
 * what this rewrites the other 400 to. The block count on `/lecture/16` goes
 * from 0 to 35.
 *
 * The third cause is indentation. Four spaces at the start of a line is an
 * *indented code block*, not a flush display equation, and eight equations in
 * Lectures 8 and 9 are indented that way — so they were rendering as monospace
 * source with `\frac{...}` visible in it.
 *
 * Deliberately minimal, and it only ever inserts blank lines, strips leading
 * whitespace, and moves the expression onto its own line:
 *
 *  - fenced code blocks are copied through verbatim, so a `$$` inside a fence
 *    is never mistaken for mathematics;
 *  - a line that merely *contains* `$$` is left alone, because that is inline
 *    maths in prose and it already renders correctly. Two lines in Lecture 10
 *    open with an equation and continue as a sentence
 *    (`$$L(i)$$ is a decreasing function of $i$`); making those blocks would
 *    mean rewriting the sentence, not just its layout;
 *  - a multi-line `$$` fence is left exactly as it is, which is why the
 *    `\begin{cases}` block in Lecture 5 is untouched;
 *  - the expression itself is never altered beyond trimming its margins.
 */
function isDisplayLine(trimmed: string): boolean {
  return (
    trimmed.length > 4 && trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed !== '$$$$'
  )
}

export function promoteDisplayMath(markdown: string): string {
  const source = markdown.split('\n')
  const out: string[] = []
  let inFence = false
  for (let i = 0; i < source.length; i++) {
    const line = source[i]
    if (/^\s*(?:```|~~~)/.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }
    if (inFence || !isDisplayLine(line.trim())) {
      out.push(line)
      continue
    }
    // The blank line before is what makes it a block: without it the `$$` is
    // a lazy continuation line and the paragraph swallows it.
    if (out.length > 0 && out[out.length - 1].trim() !== '') out.push('')
    const expression = line.trim().slice(2, -2).trim()
    out.push('$$', expression.replace(/^[ \t]{4,}/, ''), '$$')
    // And a blank line after, so the line below is not read as a continuation
    // of the equation instead of starting its own block.
    if (i + 1 < source.length && source[i + 1].trim() !== '') out.push('')
  }
  return out.join('\n')
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join('')
  if (typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: ReactNode } }).props
    return nodeText(props?.children)
  }
  return ''
}

function HeadingWithAnchor({ level, children }: { level: 2 | 3; children: ReactNode }) {
  const text = nodeText(children)
  const id = slugify(text)
  const Tag = level === 2 ? 'h2' : 'h3'
  return (
    <Tag id={id} className="group">
      {children}
      <a href={`#${id}`} className="anchor-link" aria-label={`Link to ${text}`}>
        #
      </a>
    </Tag>
  )
}

export interface Heading {
  level: number
  text: string
  id: string
}

/** Extract h2/h3 headings for the table of contents, skipping fenced code. */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  let inFence = false
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line)
    if (match) {
      const text = match[2].replace(/[*_`$]/g, '').trim()
      headings.push({ level: match[1].length, text, id: slugify(text) })
    }
  }
  return headings
}

/**
 * The headings a table of contents can actually navigate to.
 *
 * A lecture body is a run of section cards, and everything below `##` lives
 * inside a disclosure that may be closed. A link to such a heading is a link
 * to a node that is not in the DOM: the reader clicks "Mechanism", the page
 * does not move, and the contents has advertised a target it does not have.
 *
 * So the contents lists the sections and nothing else. A `##` heading is the
 * one level that is always rendered — `LectureSectionCard` puts it outside the
 * toggle — which makes the `##` set exactly the set of reachable targets.
 * Strip the section numbers for the same reason the card does: the number is
 * rendered beside the heading, and a contents entry that repeats it reads as
 * a typo.
 */
export function contentsHeadings(markdown: string): Heading[] {
  return extractHeadings(markdown)
    .filter((h) => h.level === 2)
    .map((h) => {
      const m = /^(\d+)[.)]?\s+(.+)$/.exec(h.text)
      return m ? { ...h, text: m[2] } : h
    })
}

export function Markdown({ children, id }: { children: string; id?: string }) {
  return (
    <div className="prose-lecture" id={id}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({ children: c }) => <HeadingWithAnchor level={2}>{c}</HeadingWithAnchor>,
          h2: ({ children: c }) => <HeadingWithAnchor level={2}>{c}</HeadingWithAnchor>,
          h3: ({ children: c }) => <HeadingWithAnchor level={3}>{c}</HeadingWithAnchor>,
          table: ({ children: c }) => (
            // The single horizontal scroller. `index.css` keeps
            // `overflow-x` here rather than on the `<table>`, so a table
            // wider than the measure scrolls inside this wrapper instead of
            // growing a nested scroller of its own.
            <div className="table-scroll">
              <table>{c}</table>
            </div>
          ),
          a: ({ href, children: c }) => {
            const external = href?.startsWith('http')
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
              >
                {c}
              </a>
            )
          },
        }}
      >
        {promoteDisplayMath(children)}
      </ReactMarkdown>
    </div>
  )
}
