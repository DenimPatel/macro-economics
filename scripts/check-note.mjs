/**
 * Check ONE lecture note, so an agent editing a single file does not have to
 * run the whole suite to know it did its job.
 *
 * The suite's version of this is a site-wide property (every note is covered),
 * which is the assertion that matters and the one CI runs. This is the local
 * loop: it names the file it is looking at and prints what is still missing.
 *
 *   node --experimental-strip-types scripts/check-note.mjs Lecture_4
 */
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const FENCE = '`'.repeat(3)
const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const name = process.argv[2]

if (!name) {
  console.error('usage: node scripts/check-note.mjs Lecture_4')
  process.exit(2)
}

const file = join(root, 'content', 'lecture_notes', `Lecture_${name}.md`)
const raw = readFileSync(file, 'utf8')

// Split on `##` outside a fence, exactly as web/src/content/lectureSections.ts does.
const lines = raw.split('\n')
const sections = []
let heading = null
let body = []
let fence = null
const flush = () => {
  if (heading === null && !body.join('\n').trim()) return
  sections.push({ heading, body: body.join('\n') })
}
for (const line of lines) {
  const f = /^(`{3,}|~{3,})([A-Za-z0-9_-]*)\s*$/.exec(line)
  if (f) {
    if (fence === null) fence = f[1][0]
    else if (f[1][0] === fence) fence = null
  }
  if (fence === null && /^##\s+/.test(line)) {
    flush()
    heading = line.replace(/^##\s+/, '').trim()
    body = []
  } else {
    body.push(line)
  }
}
flush()

let failures = 0
const fail = (m) => {
  failures++
  console.log(`  FAIL  ${m}`)
}

console.log(`Lecture_${name}.md — ${sections.length} section(s)`)

const seenIds = new Set()
for (const s of sections) {
  const label = s.heading ?? '(preamble)'
  if (!s.heading) continue // the preamble is prose by design and carries no toggle
  if (seenIds.has(s.heading)) fail(`duplicate heading "${label}"`)
  seenIds.add(s.heading)

  // The authored summary, if any.
  let bullets = []
  let authored = false
  const m = /```summary\n([\s\S]*?)\n```/.exec(s.body)
  if (m) {
    authored = true
    bullets = m[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('- '))
  }

  if (!authored) {
    fail(`"${label}" — no ${FENCE}summary${FENCE} block (a derived fallback is not an authored one)`)
  } else {
    if (bullets.length === 0) fail(`"${label}" — the summary block has no bullets`)
    if (bullets.length < 2) console.log(`  warn  "${label}" — only ${bullets.length} bullet(s)`)
    if (bullets.length > 8) {
      fail(`"${label}" — ${bullets.length} bullets; a sketch is 4-7, this is a transcript`)
    }
    for (const b of bullets) {
      const t = b.slice(2)
      if (t.length < 12) fail(`"${label}" — bullet too short to be a claim: ${t}`)
      if (t.length > 260) fail(`"${label}" — bullet is a paragraph (${t.length} chars), not a claim`)
      if (/^\s*\d+\.\s/.test(t)) fail(`"${label}" — an ordered list inside a summary; use "-"`)
    }
    // A summary may not introduce a number the section's own prose does not
    // contain. A re-read that meets a figure never saw is worse than one that
    // does not.
    const prose = s.body.replace(/```summary\n[\s\S]*?\n```/g, '')
    for (const num of bullets.join('\n').match(/\d+(?:[.,]\d+)?%?/g) ?? []) {
      const core = num.replace(/[%.,]/g, '').replace(/^0+/, '')
      if (core.length < 2) continue // 1, 2, 3 are usually counts, not figures
      if (!prose.includes(num)) {
        fail(`"${label}" — summary cites ${num}, which the section's prose does not`)
      }
    }
    if (/\$\$/.test(m[1])) fail(`"${label}" — a summary must not contain a display equation`)
    if (/\\\$/.test(m[1])) fail(`"${label}" — an escaped dollar: this is the bug that broke 57 lines of prose`)

    // An odd number of unescaped `$` leaves the math delimiter open, and the
    // rest of the bullet renders as raw LaTeX. It is the same failure as an
    // escaped dollar, seen from the other side, and it renders as garbage
    // rather than as an error.
    const dollars = (m[1].match(/(?<!\\)\$/g) ?? []).length
    if (dollars % 2 !== 0) {
      fail(`"${label}" — ${dollars} unescaped dollar signs: the math delimiter is left open`)
    }

    // `**$X$**` nests emphasis inside emphasis. KaTeX replaces the inline
    // formula with its own DOM, so the bold never reaches any of it and the
    // reader gets a formula that is not bold among text that is.
    if (/\*\*\s*\$[^$]*\$\s*\*\*/.test(m[1])) {
      fail(`"${label}" — bold wrapping a formula (**$X$**); bold the words, not the maths`)
    }

    // A bullet is a claim. A line carrying a fraction or a long identity is
    // an equation that wanted to be a sentence.
    const maths = (m[1].match(/\$[^$]+\$/g) ?? []).filter((x) => /\\frac|\\sum|\\int/.test(x))
    if (maths.length > 0) {
      console.log(`  warn  "${label}" — a bullet carries a fraction or integral; check it is a claim`)
    }
  }
}

if (failures === 0) {
  console.log('  ok    every section has an authored, claim-shaped summary')
} else {
  console.log(`  ${failures} problem(s)`)
}
process.exit(failures === 0 ? 0 : 1)
