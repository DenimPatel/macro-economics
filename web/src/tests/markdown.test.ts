import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { extractHeadings, promoteDisplayMath, slugify } from '../content/markdownComponents'

/** A bare `$$`, one line of expression, a closing `$$` — and nothing inside a
 *  code fence. The multi-line `\begin{cases}` block in Lecture 5 is four lines
 *  and so is not one of these. */
function isThreeLineFence(lines: string[], start: number): boolean {
  if (lines[start]?.trim() !== '$$') return false
  if (lines[start - 1]?.trim() === '$$') return false
  return lines[start + 2]?.trim() === '$$' && lines[start + 1]?.trim() !== ''
}

function threeLineFences(lines: string[]): number {
  let inFence = false
  let count = 0
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(?:```|~~~)/.test(lines[i])) inFence = !inFence
    if (!inFence && isThreeLineFence(lines, i)) count++
  }
  return count
}

describe('slugify', () => {
  it('lowercases and hyphenates whitespace', () => {
    expect(slugify('The IS Curve')).toBe('the-is-curve')
  })

  it('strips punctuation but keeps the whitespace that surrounded it', () => {
    // "L(Y, r)" loses its parens and comma but the space between them remains,
    // so the slug keeps a hyphen there. Punctuation never becomes a hyphen.
    expect(slugify('Money Demand: L(Y, r)')).toBe('money-demand-ly-r')
    expect(slugify('Fiscal policy!')).toBe('fiscal-policy')
  })

  it('preserves digits and existing hyphens', () => {
    expect(slugify('Lecture 7 - Solow Model')).toBe('lecture-7---solow-model')
  })

  it('collapses runs of whitespace into one hyphen', () => {
    expect(slugify('a   b')).toBe('a-b')
  })

  it('returns an empty string for punctuation-only input', () => {
    expect(slugify('!!!')).toBe('')
  })
})

describe('extractHeadings', () => {
  it('collects h2 and h3 with their level, text, and id', () => {
    const md = ['## Goods Market', '', 'Some prose.', '', '### Money Market'].join('\n')
    expect(extractHeadings(md)).toEqual([
      { level: 2, text: 'Goods Market', id: 'goods-market' },
      { level: 3, text: 'Money Market', id: 'money-market' },
    ])
  })

  it('ignores h1 and h4 and below', () => {
    const md = ['# Title', '#### Too deep', '## Kept'].join('\n')
    expect(extractHeadings(md)).toEqual([{ level: 2, text: 'Kept', id: 'kept' }])
  })

  it('skips headings inside fenced code blocks', () => {
    const md = ['## Real', '```bash', '## not a heading', '```', '## Also Real'].join('\n')
    expect(extractHeadings(md).map((h) => h.text)).toEqual(['Real', 'Also Real'])
  })

  it('handles an unterminated fence without emitting its contents', () => {
    const md = ['## Real', '```', '## trapped'].join('\n')
    expect(extractHeadings(md).map((h) => h.text)).toEqual(['Real'])
  })

  it('strips inline emphasis, code, and math delimiters from the label', () => {
    const md = '## The **multiplier** and $1/(1-c)$'
    expect(extractHeadings(md)).toEqual([
      { level: 2, text: 'The multiplier and 1/(1-c)', id: 'the-multiplier-and-11-c' },
    ])
  })

  it('returns an empty list for input with no headings', () => {
    expect(extractHeadings('Just prose.\n\nMore prose.')).toEqual([])
  })
})

describe('promoteDisplayMath', () => {
  it('separates a `$$` line from the paragraph above it', () => {
    // The defect this exists for. A line that continues a paragraph is a lazy
    // continuation line, so `remark-math` read `$$...$$` in inline position
    // and the equation rendered welded to the end of the sentence. Across the
    // 25 notes that was 400 of the 433 display equations, and it left
    // `.prose-lecture .katex-display` matching nothing at all.
    expect(promoteDisplayMath('Production function:\n$$Y = K$$')).toBe(
      'Production function:\n\n$$\nY = K\n$$',
    )
  })

  it('fences the expression, because micromark will not open a flow block otherwise', () => {
    // `micromark-extension-math` only starts a *flow* math block when the `$$`
    // is followed by a space or a line ending, so blank lines alone leave the
    // equation as an `inlineMath` node inside a `<p>` and never a
    // `.katex-display`. This is the assertion the whole function rests on.
    expect(promoteDisplayMath('$$x = 1$$')).toBe('$$\nx = 1\n$$')
  })

  it('is a no-op on markdown that already has the fence and the blank lines', () => {
    const md = 'Production function:\n\n$$\nY = K\n$$\n\nTaking logs:'
    expect(promoteDisplayMath(md)).toBe(md)
  })

  it('is idempotent', () => {
    const once = promoteDisplayMath('Step 2:\n$$a$$\n$$b$$')
    expect(promoteDisplayMath(once)).toBe(once)
  })

  it('leaves inline maths alone', () => {
    // A line that merely contains `$$` is prose with maths in it, and it
    // already renders correctly.
    const md = 'Growth in $A$ is $g_A$ and $$\\dot{Y}/Y$$ falls.'
    expect(promoteDisplayMath(md)).toBe(md)
  })

  it('leaves a line that opens with an equation and continues as a sentence', () => {
    // Two lines in Lecture 10 are written this way. Promoting the leading
    // equation would mean rewriting the sentence, not just its layout, so
    // they stay inline maths and read as the sentence they are.
    const md = '$$L(i)$$ is a decreasing function of $i$'
    expect(promoteDisplayMath(md)).toBe(md)
  })

  it('trims the margins of the expression and nothing else', () => {
    expect(promoteDisplayMath('$$   x   =   1   $$')).toBe('$$\nx   =   1\n$$')
  })

  it('dedents an equation, because four spaces is an indented code block', () => {
    // Eight equations in Lectures 8 and 9 are indented, so they were
    // rendering as monospace source with the LaTeX visible in it. Dedenting
    // is the whole repair; the notes' other equations already sit at the
    // margin.
    expect(promoteDisplayMath('- A bullet\n    $$x = 1$$')).toBe('- A bullet\n\n$$\nx = 1\n$$')
  })

  it('puts a shallow indent at the margin too', () => {
    // One to three spaces is still a paragraph rather than an indented code
    // block, so there is no bug to repair here — but a promoted equation is a
    // block, and a block belongs at the margin, which is where all 433 of them
    // end up.
    expect(promoteDisplayMath('Label\n  $$x = 1$$')).toBe('Label\n\n$$\nx = 1\n$$')
  })

  it('ignores a `$$` inside a fenced code block', () => {
    const md = ['```bash', 'echo $$HOME', '```', '', 'Real text.'].join('\n')
    expect(promoteDisplayMath(md)).toBe(md)
  })

  it('handles two consecutive equations as two blocks', () => {
    // Lecture 16 writes `$$g_{Y,K} = ...$$` and `$$g_{Y,N} = ...$$` on
    // adjacent lines as a two-step derivation. As one paragraph they came out
    // as two runs of text side by side; as blocks they stack.
    expect(promoteDisplayMath('Step 2:\n$$a$$\n$$b$$')).toBe('Step 2:\n\n$$\na\n$$\n\n$$\nb\n$$')
  })

  it('handles a fence that opens and closes on the same line', () => {
    const md = 'Inline ``code`` above\n$$x$$'
    expect(promoteDisplayMath(md)).toBe('Inline ``code`` above\n\n$$\nx\n$$')
  })

  it('does not add a leading blank line at the top of a document', () => {
    expect(promoteDisplayMath('$$x$$')).toBe('$$\nx\n$$')
  })

  it('leaves a multi-line display block alone', () => {
    // The `\begin{cases}` system in Lecture 5 is already correctly fenced,
    // and its bare `$$` lines are not display lines by this definition.
    const md = ['Setup:', '', '$$', '\\begin{cases}', '\\end{cases}', '$$', '', 'Done.'].join(
      '\n',
    )
    expect(promoteDisplayMath(md)).toBe(md)
  })

  it('promotes every display equation in the real lecture notes', () => {
    // The end-to-end statement of the fix, against the content itself rather
    // than a fixture. A promoted equation is a bare `$$` fence with the
    // expression alone on the middle line, blank line either side.
    //
    // The count is taken as a difference against the source, so the one
    // multi-line `\begin{cases}` fence in Lecture 5 — which is already in
    // this shape and is four lines long, not three — is not mistaken for one.
    const dir = join(__dirname, '..', '..', '..', 'content', 'lecture_notes')
    const files = readdirSync(dir).filter((name) => name.endsWith('.md'))
    expect(files.length).toBeGreaterThan(0)
    let promoted = 0
    for (const file of files) {
      const source = readFileSync(join(dir, file), 'utf8')
      const lines = promoteDisplayMath(source).split('\n')
      promoted += threeLineFences(lines) - threeLineFences(source.split('\n'))
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() !== '$$' || !isThreeLineFence(lines, i)) continue
        expect(lines[i - 1]?.trim(), `${file}:${i + 1} needs a blank line above`).toBe('')
        expect(lines[i], `${file}:${i + 1} must be at the margin`).toBe('$$')
        expect(lines[i + 1].trim(), `${file}:${i + 1} must not be empty`).not.toBe('')
        expect(lines[i + 1], `${file}:${i + 1} must be flush`).toBe(lines[i + 1].trim())
        expect(lines[i + 2]?.trim(), `${file}:${i + 1} must be closed`).toBe('$$')
        expect(lines[i + 3]?.trim(), `${file}:${i + 2} needs a blank line below`).toBe('')
      }
    }
    // Every one-line display equation in the notes, which was 433 when this
    // count was taken: 33 of them already sat on their own line and 8 were
    // indented four spaces, so before the transform they were 433 inline
    // expressions — 392 welded to the end of the sentence above, 33 centred
    // nowhere, and 8 rendered as monospace LaTeX source.
    //
    // 437 now, and the four are the Gordon derivation in Lecture 23: the
    // infinite sum reached a closed form the lecture had never carried, and
    // every step of it is a display equation. A pinned total is only a useful
    // guard if it moves when a lecture legitimately gains an equation, so the
    // invariant to watch is the one above this line — a fenced block per
    // equation, at the margin, with a blank line either side.
    expect(promoted).toBe(437)
  })

  it('leaves exactly the two sentence-shaped equations in Lecture 10', () => {
    // Lines that open with `$$` and continue as a sentence are prose, not
    // equations to be promoted, and they are enumerated so a third one
    // appearing anywhere else is a visible change rather than a silent one.
    const dir = join(__dirname, '..', '..', '..', 'content', 'lecture_notes')
    const residual: string[] = []
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.md'))) {
      const lines = promoteDisplayMath(readFileSync(join(dir, file), 'utf8')).split('\n')
      let inFence = false
      for (const line of lines) {
        if (/^\s*(?:```|~~~)/.test(line)) inFence = !inFence
        if (inFence) continue
        const trimmed = line.trim()
        if (trimmed.startsWith('$$') && !trimmed.endsWith('$$') && trimmed.length > 4) {
          residual.push(`${file}:${trimmed}`)
        }
      }
    }
    expect(residual).toEqual([
      'Lecture_10.md:$$L(i)$$ is a decreasing function of $i$',
      'Lecture_10.md:$$\\Delta i = -\\Delta x$$ (to offset)',
    ])
  })
})
