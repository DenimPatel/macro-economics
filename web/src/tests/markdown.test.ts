import { describe, expect, it } from 'vitest'
import { extractHeadings, slugify } from '../content/markdownComponents'

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
