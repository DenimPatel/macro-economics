import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import { visit } from 'unist-util-visit'
import { promoteDisplayMath } from '../content/markdownComponents'

/**
 * The strongest statement available short of a browser: run the notes through
 * the same plugin chain the page uses and count what comes out. Before the
 * transform, `/lecture/16` produced 171 `.katex` elements and zero
 * `.katex-display` ones, which is why every display-equation rule in
 * `index.css` was dead code and a 400-equation portion of the course was
 * typeset as inline maths welded to the end of a sentence.
 */
function pipeline() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
}

function countDisplayBlocks(markdown: string): number {
  const processor = pipeline()
  const tree = processor.runSync(processor.parse(promoteDisplayMath(markdown)))
  let displays = 0
  let inline = 0
  visit(tree, (node) => {
    const className = classesOf(node)
    if (className.includes('katex-display')) displays++
    else if (className[0] === 'katex') inline++
  })
  expect(displays + inline).toBeGreaterThan(0)
  return displays
}

function countInlineMath(markdown: string): number {
  let inline = 0
  visit(pipeline().parse(promoteDisplayMath(markdown)), (node: { type: string }) => {
    if (node.type === 'inlineMath') inline++
  })
  return inline
}

/**
 * `visit` walks every hast node and most of them have no `properties`, so the
 * narrowing lives here once rather than in each callback.
 */
function classesOf(node: unknown): string[] {
  const className = (node as { properties?: Record<string, unknown> }).properties?.className
  return Array.isArray(className) ? className.map(String) : []
}

const NOTES = join(__dirname, '..', '..', '..', 'content', 'lecture_notes')
const read = (name: string): string => readFileSync(join(NOTES, name), 'utf8')

describe('display equations survive the render', () => {
  it('turns a one-line `$$` into a display block rather than inline maths', () => {
    const md = 'Production function:\n$$Y = K^{1-\\alpha}$$'
    const processor = pipeline()
    const before = processor.runSync(processor.parse(md))
    const after = processor.runSync(processor.parse(promoteDisplayMath(md)))
    const displays = (tree: typeof before): number => {
      let n = 0
      visit(tree, (node) => {
        if (classesOf(node).includes('katex-display')) n++
      })
      return n
    }
    expect(displays(before)).toBe(0)
    expect(displays(after)).toBe(1)
  })

  it('keeps inline maths inline', () => {
    // The transform must not swallow the `$...$` that runs through every
    // paragraph of every note.
    expect(countInlineMath('Growth in $A$ is $g_A$.')).toBe(2)
  })

  it('renders Lecture 5 as 7 display blocks, including its `cases` system', () => {
    // The `\begin{cases}` system was the only equation in the notes already
    // written in the fenced form, so it is the ground truth for "this is what
    // a display block looks like here" — and the other six now match it.
    expect(countDisplayBlocks(read('Lecture_5.md'))).toBe(7)
  })

  it('renders Lecture 16 as 35 display blocks, up from 0', () => {
    expect(countDisplayBlocks(read('Lecture_16.md'))).toBe(35)
  })

  it('renders every lecture that writes a `$$` at all as display blocks', () => {
    const files = readdirSync(NOTES).filter((name) => name.endsWith('.md'))
    const empty: string[] = []
    let total = 0
    for (const file of files) {
      const markdown = read(file)
      if (!markdown.includes('$$')) continue
      const displays = countDisplayBlocks(markdown)
      total += displays
      if (displays === 0) empty.push(file)
    }
    expect(empty).toEqual([])
    // 439 blocks, then 441 when Lecture 24 gained the general term of the
    // machine-EPDV sum and Lecture 23 the exact Fisher relation behind "the two
    // routes agree": the 437 one-line display equations across the 23
    // lectures that use them, plus the two the notes already wrote in the
    // fenced form — the `\begin{cases}` system in Lecture 5, and the
    // money-demand equation in Lecture 4, which could not stay inline
    // because a currency `$` closes an inline math span in this pipeline (see
    // `audit.test.tsx`) — plus the four one-line equations above Lecture
    // 23's old total, which are the Gordon derivation. Lectures 1 and 19
    // contain no `$$` at all and are not counted. The invariant is the line
    // above this comment: no lecture that writes a `$$` renders zero display
    // blocks.
    expect(total).toBe(441)
  })

  it('keeps all 35 of Lecture 16\'s display equations as display blocks', () => {
    // This is the guard, and it is a count on `displays` for a reason: a change
    // in the plugin chain that moved an equation between the two modes — a `$$`
    // fence that stopped promoting, a currency `$` closing a span early — shows
    // up as a DISPLAY equation turning into an inline one, and that is what
    // `displays` below catches exactly.
    //
    // The inline count used to be pinned to the same figure. That was a blunt
    // instrument for the same guard, and it fired on an ordinary content edit:
    // four more inline expressions, none of them a mode shift, and the pipeline
    // had not changed at all. Content only ever ADDS inline maths, so it is a
    // floor here; a genuine demotion shows up as `displays` falling below 35,
    // which is the failure this is for.
    const processor = pipeline()
    const tree = processor.runSync(processor.parse(promoteDisplayMath(read('Lecture_16.md'))))
    let displays = 0
    let inline = 0
    visit(tree, (node) => {
      const className = classesOf(node)
      if (className.includes('katex-display')) displays++
      else if (className[0] === 'katex') inline++
    })
    expect(displays, 'a display equation stopped rendering as display').toBe(35)
    expect(inline, 'the note lost inline maths').toBeGreaterThanOrEqual(171)
  })
})
