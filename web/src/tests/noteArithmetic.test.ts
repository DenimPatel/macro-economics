/**
 * The numbers a lecture prints as arithmetic are true.
 *
 * Two of the 25 notes carried a display equation that asserted an identity its
 * own operands did not satisfy, and both were wrong in the same direction: a
 * figure in a table was edited, or arrived from somewhere else, and the
 * equation that consumes it was left asserting the old total.
 *
 *   - `Lecture_16.md:120-121` wrote `7.2% = (0.3)(9.2%) + (0.7)(1.7%) + 4.2%`
 *     with `4.2%` in the TFP row of its China table. The right-hand side is
 *     8.15%, so the identity that defines the Solow residual was false on the
 *     page that introduces the residual, and every number downstream of it
 *     (the balanced-growth rate `g_A + g_N = 5.9%`) inherited the error.
 *   - `Lecture_13.md:176` listed Japan's 1950-2017 average annual growth as
 *     4.1% beside a 5.5x gain over those 67 years, which is 2.6% a year. 4.1%
 *     is Japan's 1950s-70s rate and cannot be averaged over the full span.
 *
 * A previous wave fixed 57 escaping defects in these files and 400 display
 * equations that rendered inline, and a structural survey checked for TODO
 * markers and truncated sentences. None of that can see an equation that is
 * syntactically perfect and arithmetically false, because the only thing that
 * knows it is wrong is the arithmetic.
 *
 * So this asserts the invariant over the whole corpus rather than a list of
 * the two: every equation in every note whose two sides are both arithmetic
 * is evaluated and compared. Seven equations qualify today, so the scan is
 * not vacuous, and it cannot be made vacuous by editing prose — a new
 * arithmetic claim joins the set automatically. The two that were false are
 * proved by mutation: put `4.2%` back into `Lecture_16.md` and the first
 * test goes red on that line.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { visit } from 'unist-util-visit'
import { promoteDisplayMath } from '../content/markdownComponents'

const NOTES = join(__dirname, '..', '..', '..', 'content', 'lecture_notes')

/**
 * `\%` is a unit, not an operator, and which way it scales matters: the
 * spread example in `Lecture_7.md` writes `0.05 \times 0.03 = 0.15\%`, which
 * is true only if the right-hand side is a hundredth of `0.15`. So a
 * percentage becomes a division by 100 rather than being dropped, and
 * `2\% + 3\% = 5\%` then holds as `0.02 + 0.03 = 0.05` rather than needing
 * to be lucky.
 *
 * `\frac` is rewritten to a division because otherwise every identity the
 * growth notes state — and several the multiplier notes state — is invisible
 * to the scan.
 */
function normalise(value: string): string {
  let out = value
  for (let pass = 0; pass < 4 && out.includes('\\frac'); pass++) {
    out = out.replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
  }
  return out
    .replace(/(\\?\d*\.?\d+)\\%/g, '(($1)/100)')
    .replace(/\\times/g, '*')
    .replace(/\\approx/g, '~')
    .replace(/\\,/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * True when the equation has nothing in it but arithmetic, so both sides can
 * be evaluated. `\text{...}`, a subscript, a Greek letter, a `\delta` — all of
 * those mean the two sides are statements about a model, not numbers, and are
 * somebody else's test to own.
 */
const ARITHMETIC_ONLY = /^[0-9\s+\-*/().,=~]+$/

/**
 * A left-to-right parser for the four operators and parentheses these notes
 * use, written rather than pulled in because `eval` on note text is not a thing
 * anyone should ship and the grammar is four lines.
 *
 * Returns `null` for anything it cannot parse exactly, so an unhandled
 * expression is skipped rather than silently read as zero.
 */
function evaluate(expression: string): number | null {
  let i = 0
  const source = expression
  const skip = () => {
    while (i < source.length && /\s/.test(source[i])) i++
  }
  const factor = (): number | null => {
    skip()
    const start = i
    if (source[i] === '(') {
      i++
      const inner = sum()
      skip()
      if (source[i] !== ')') return null
      i++
      return inner
    }
    let negative = false
    while (source[i] === '+' || source[i] === '-') {
      if (source[i] === '-') negative = !negative
      i++
      skip()
    }
    const digits = /^\d+(\.\d+)?/.exec(source.slice(i))
    if (!digits) {
      i = start
      return null
    }
    i += digits[0].length
    return negative ? -Number(digits[0]) : Number(digits[0])
  }
  const product = (): number | null => {
    let left = factor()
    while (left !== null) {
      skip()
      const op = source[i]
      if (op === '*' || op === '/') {
        i++
        const right = factor()
        if (right === null) return null
        left = op === '*' ? left * right : right === 0 ? null : left / right
        continue
      }
      // Juxtaposition is multiplication in this corpus — the growth-accounting
      // identity in `Lecture_16.md` writes the capital share as `(0.3)(9.2%)`,
      // and a parser that stops there reads the identity as false, which is the
      // one way this file could report a false alarm rather than a real one.
      if (source[i] === '(' || (source[i] !== undefined && /[0-9.]/.test(source[i]))) {
        const right = factor()
        if (right === null) return null
        left *= right
        continue
      }
      return left
    }
    return null
  }
  const sum = (): number | null => {
    let left = product()
    while (left !== null) {
      skip()
      const op = source[i]
      if (op !== '+' && op !== '-') return left
      i++
      const right = product()
      if (right === null) return null
      left = op === '+' ? left + right : left - right
    }
    return null
  }
  const value = sum()
  skip()
  return i === source.length ? value : null
}

interface Arithmetic {
  file: string
  raw: string
  /** Adjacent `lhs = rhs` pairs, flattened so a chain is checked pairwise. */
  pairs: { left: number; right: number; exact: boolean }[]
}

/**
 * Every math span in the notes whose normalised form is arithmetic only and
 * which contains at least one COMPLETE equality — `= 1` and a lone `\approx
 * 10%` are fragments of an expression that a neighbouring span owns, and
 * neither is a claim this file can judge.
 */
function arithmeticClaims(): Arithmetic[] {
  const claims: Arithmetic[] = []
  for (const file of readdirSync(NOTES).filter((name) => name.endsWith('.md')).sort()) {
    const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMath)
    const tree = processor.parse(promoteDisplayMath(readFileSync(join(NOTES, file), 'utf8')))
    visit(tree, (node: unknown) => {
      const span = node as { type?: string; value?: string }
      if (span.type !== 'math' && span.type !== 'inlineMath') return
      const raw = (span.value ?? '').trim()
      if (!/[0-9]/.test(raw)) return
      const value = normalise(raw)
      if (!ARITHMETIC_ONLY.test(value)) return
      // Split on `=` only, so a `~` stays inside the operand it belongs to and
      // separates the strict from the approximate pairs.
      const sides = value.split('=')
      if (sides.length < 2) return
      const pairs: Arithmetic['pairs'] = []
      for (let s = 0; s < sides.length - 1; s++) {
        const left = evaluate(sides[s])
        const right = evaluate(sides[s + 1])
        if (left === null || right === null) continue
        const exact = !sides[s].includes('~') && !sides[s + 1].includes('~')
        pairs.push({ left, right, exact })
      }
      if (pairs.length === 0) return
      claims.push({ file, raw, pairs })
    })
  }
  return claims
}

describe('the arithmetic reader', () => {
  // The parser is the part of this file that can go wrong quietly: a
  // `return null` on a shape it does not handle is skipped by the scan rather
  // than reported, so an unhandled form would shrink the set of claims under
  // test. These are the four shapes the corpus actually uses.
  it.each([
    ['1/0.5', [2, 2]],
    ['(0.3)(9.2)', [2.76, 2.76]],
    ['((7.2)/100)', [0.072, 0.072]],
    ['2 + 3 * 4', [14, 14]],
    ['1 - 2 - 3', [-4, -4]],
    ['10 / 4 / 5', [0.5, 0.5]],
  ])('evaluates %s', (source, [expected]) => {
    expect(evaluate(source)).toBeCloseTo(expected, 6)
  })

  it('refuses rather than guesses', () => {
    // A trailing operator, an unclosed paren, and a letter: each must come back
    // null, so an expression this parser cannot judge is skipped and not
    // quietly read as zero.
    for (const source of ['1 +', '(1 + 2', 'x + 1', '1 + 2 )']) {
      expect(evaluate(source), source).toBeNull()
    }
  })
})

describe('an equation a note prints as arithmetic is true', () => {
  const claims = arithmeticClaims()

  it('finds arithmetic claims to judge, so the scan cannot pass by finding nothing', () => {
    // The positive control, and the reason this file is not a vacuous test.
    // Seven today: `Lecture_3.md` multiplier, `Lecture_7.md` spread example,
    // `Lecture_10.md` two, `Lecture_14.md` investment share, `Lecture_16.md`
    // two. A corpus edit that stopped the scanner from finding them would make
    // every other assertion in this file pass for the wrong reason.
    expect(claims.length).toBeGreaterThanOrEqual(7)
  })

  it('holds every one of them', () => {
    const wrong: string[] = []
    for (const claim of claims) {
      for (const pair of claim.pairs) {
        // 0.5% relative for an exact identity, 2% for one written `\approx`.
        // The notes round to one or two decimals, so a tighter tolerance
        // would report the rounding as the error. Relative rather than
        // absolute, because `\%` normalisation puts most of these claims near
        // 0.07, where an absolute 0.005 is a 7% tolerance.
        const tolerance = pair.exact ? 0.005 : 0.02
        const scale = Math.max(Math.abs(pair.left), Math.abs(pair.right))
        const off = Math.abs(pair.left - pair.right)
        if (scale === 0 ? off > 0 : off / scale > tolerance) {
          wrong.push(
            `${claim.file}: ${JSON.stringify(claim.raw)} — ` +
              `${pair.left} vs ${pair.right}`,
          )
        }
      }
    }
    expect(wrong, `an identity these notes print is false:\n${wrong.join('\n')}`).toEqual([])
  })

  it('judges the two that were false, so the fix is the thing being guarded', () => {
    // Named rather than counted, because the count is the thing this file is
    // arguing against pinning. `Lecture_16.md` is the Solow residual identity
    // its own China table feeds, and `Lecture_13.md` is the convergence table
    // whose rate column has to agree with its own ratio column.
    const lecture16 = claims.filter((claim) => claim.file === 'Lecture_16.md')
    expect(lecture16.length, 'the growth-accounting identity left the corpus').toBeGreaterThanOrEqual(2)
    for (const claim of lecture16) {
      for (const pair of claim.pairs) {
        expect(pair.left).toBeCloseTo(pair.right, 3)
      }
    }
    const lecture13 = readFileSync(join(NOTES, 'Lecture_13.md'), 'utf8')
    // 5.5x over the 67 years the table spans, as a compound annual rate.
    const ratio = 5.5
    const years = 2017 - 1950
    const implied = (Math.pow(ratio, 1 / years) - 1) * 100
    expect(implied).toBeCloseTo(2.6, 1)
    expect(lecture13).toMatch(/\|\s*\*\*Japan\*\*\s*\|\s*\$6,800\s*\|\s*\$37,200\s*\|\s*2\.6%/)
  })
})
