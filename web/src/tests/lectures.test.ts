import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'

const TIERS = ['beginner', 'intermediate', 'advanced', 'case-study']

describe('course metadata', () => {
  it('has 25 lectures numbered 1..25 with unique slugs', () => {
    expect(LECTURES).toHaveLength(25)
    const numbers = LECTURES.map((l) => l.n).sort((a, b) => a - b)
    expect(numbers).toEqual(Array.from({ length: 25 }, (_, i) => i + 1))
    expect(new Set(LECTURES.map((l) => l.slug)).size).toBe(25)
  })

  it('uses a valid tier and a source video for every lecture', () => {
    for (const lecture of LECTURES) {
      expect(TIERS).toContain(lecture.tier)
      expect(lecture.videoUrl).toMatch(/^https:\/\//)
      expect(lecture.summary.length).toBeGreaterThan(0)
    }
  })

  it('references only registered tools', () => {
    const known = new Set(Object.keys(TOOLS))
    for (const lecture of LECTURES) {
      for (const toolId of lecture.tools) expect(known.has(toolId)).toBe(true)
      for (const spec of lecture.miniTools) expect(known.has(spec.toolId)).toBe(true)
      if (lecture.review) expect(lecture.tools).toHaveLength(0)
    }
  })

  it('has well-formed quizzes', () => {
    for (const lecture of LECTURES) {
      expect(lecture.quiz.length).toBeGreaterThan(0)
      for (const question of lecture.quiz) {
        expect(question.options.length).toBeGreaterThanOrEqual(2)
        expect(question.answer).toBeGreaterThanOrEqual(0)
        expect(question.answer).toBeLessThan(question.options.length)
        expect(question.explanation.length).toBeGreaterThan(0)
      }
    }
  })

  it('has well-formed case studies', () => {
    const known = new Set(Object.keys(TOOLS))
    const numbers = new Set(LECTURES.map((l) => l.n))
    expect(CASE_STUDIES.length).toBeGreaterThan(0)
    for (const study of CASE_STUDIES) {
      expect(known.has(study.tool)).toBe(true)
      for (const n of study.relatedLectures) expect(numbers.has(n)).toBe(true)
    }
  })

  it('has a markdown note on disk for every lecture', () => {
    const notesDir = path.resolve(process.cwd(), '../content/lecture_notes')
    expect(existsSync(notesDir)).toBe(true)
    const files = new Set(readdirSync(notesDir))
    for (const lecture of LECTURES) {
      expect(files.has(`Lecture_${lecture.n}.md`)).toBe(true)
    }
  })
})
