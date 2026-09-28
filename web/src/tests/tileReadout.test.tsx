/**
 * The locatable-tile rule, held.
 *
 * `AGENTS.md` states the rule; this states that the twenty tools keep it. Two
 * halves, and the split is deliberate:
 *
 *  1. "A tile row is never the ONLY place its numbers appear." Every tool that
 *     renders a `StatBox` also renders a `TileReadout` whose body interpolates
 *     a value, so the page says the numbers in the place they belong — as a
 *     mark, as a series, or as a sentence that says which of the three it is.
 *     This is mechanical and it is checked mechanically.
 *
 *  2. "A tile never prints a value the model did not compute." Rendered and
 *     asserted in both directions, so the assertion cannot pass by the tile
 *     never printing anything.
 *
 * What this file deliberately does NOT do is try to work out WHICH tiles in
 * which tools are un-plotted. That is not a source-scan job and the attempt is
 * worth recording: a classifier that matched a tile's label words against the
 * file's `dataKey`s, series names and axis labels reported all four of
 * `Crisis2008`'s tiles as LOCATED — "Output", "Money Demand", "Interest Rate"
 * and "Money Supply" are all words the file contains, on the historical
 * quarterly series. Every one of them was reporting a different quantity from
 * the chart beside it, which is the whole defect this wave was chartered to
 * close. A word match cannot see that a label and a series can share a word
 * and disagree about what they measure, so the scan asserts that a caption
 * EXISTS and carries a number, and leaves the judgement to the caption.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import LaborMarket from '../tools/LaborMarket'

const TOOLS = join(__dirname, '..', 'tools')
const toolFiles = readdirSync(TOOLS).filter((f) => f.endsWith('.tsx') && f !== 'registry.tsx')

/**
 * A `TileReadout` that carries a number, not a sentence.
 *
 * The interpolation is the point: a caption that names a quantity without ever
 * printing its value is the shape of the defect, and a test that only counted
 * `<TileReadout>`s would pass on a page of empty ones. An explicit
 * `{expression}` in the element's own JSX children is the test for it — the
 * scan is over the element's text, so a `{...}` inside a nested comment or a
 * sibling element does not count.
 */
describe('the locatable-tile rule', () => {
  it('gives every tool with tiles a caption that carries a number', () => {
    const offenders: string[] = []
    for (const file of toolFiles) {
      const source = readFileSync(join(TOOLS, file), 'utf8')
      if (!source.includes('<StatBox')) continue
      const captions = source.match(/<TileReadout>[\s\S]*?<\/TileReadout>/g) ?? []
      if (!captions.some((c) => /\{[^{}]+\}/.test(c))) offenders.push(file)
    }
    expect(offenders, 'tools whose tile row is the only place their numbers appear').toEqual([])
  })

  it('leaves no tool with tiles out of the rule, and no scan that can pass by finding nothing', () => {
    // Non-vacuity, stated as a property of the tree rather than a count to
    // maintain: the rule only means something if the tools have tile rows AND
    // captions, and a scan that matched nothing would satisfy the assertion
    // above for the same reason an empty list does.
    const withTiles = toolFiles.filter((f) =>
      readFileSync(join(TOOLS, f), 'utf8').includes('<StatBox'),
    )
    expect(withTiles.length, 'tools with a tile row').toBeGreaterThan(15)
    const withCaption = withTiles.filter((f) =>
      readFileSync(join(TOOLS, f), 'utf8').includes('<TileReadout>'),
    )
    expect(withCaption, 'tools with a tile row and a caption').toEqual(withTiles)
    // And the caption must be the COMPONENT, not a hand-written paragraph in
    // the same class string. Scoped to the primitive's exact signature, which
    // is what the tools wrote before it existed: `tabular-nums` on its own is
    // a table or a card number and has nothing to do with this.
    const CAPTION_CLASSES = 'className="mt-s-2 text-xs text-fg-subtle tabular-nums"'
    const byHand = withTiles.filter((f) =>
      readFileSync(join(TOOLS, f), 'utf8').includes(CAPTION_CLASSES),
    )
    expect(byHand, 'tools with a hand-written caption instead of the primitive').toEqual([])
  })

  it('prints a number when the model has one and the no-value mark when it does not', () => {
    // The defaults: the two curves meet well inside the admissible range, so
    // the tile is a number. Without this direction the assertion below would
    // pass on a tile that never printed anything at all, which is the
    // vacuous version of this test.
    const { unmount } = render(<LaborMarket />)
    // The value node carries its unit as a sibling span, so the assertion is on
    // the number and not on the whole tile's text.
    const tileValue = (label: string) =>
      screen.getByText(label).parentElement?.querySelector('.stat-tile-value')?.textContent?.trim()
    // A band, not a pin. The number that used to be here was 55.56%: the WS
    // line starts at exactly 1, so u* is very nearly the price-setting gap
    // `mu/(1+mu)` over the WS slope, and a markup of 0.2 put that gap at 17%
    // — a labour-market tool opening on a figure no developed economy has
    // recorded since 1945. Pinning whatever the default happens to be would
    // let that class of mistake return silently; the property is that the
    // default is a rate a reader recognises, and that the three readouts
    // derived from it agree with one another.
    const printed = tileValue('Equilibrium Unemployment (u*)') ?? ''
    const uStar = Number.parseFloat(printed)
    expect(uStar, 'the printed value is a number').not.toBeNaN()
    expect(uStar, 'a developed economy opens below 20% unemployment').toBeLessThan(20)
    expect(uStar, 'and above zero').toBeGreaterThan(0)
    // The headcount and the caption are read from the same u*, so tying them
    // to it is what stops the three readouts drifting apart.
    const employment = Number.parseFloat(tileValue('Employment Level') ?? '')
    expect(employment, '100m labour force, less the unemployed').toBeCloseTo(
      100 * (1 - uStar / 100),
      1,
    )
    expect(
      screen.getByText(new RegExp(`Intersection: u\\* = ${uStar.toFixed(2)}%`)),
    ).toBeTruthy()
    unmount()

    // beta = 0.1, mu = 0.5, z = 0.8: the intersection is at u = 6.67, which is
    // outside u <= 1, and `findEquilibrium` returns a placeholder rather than
    // a solution. Every readout of it — the tile, the headcount, the
    // diagnosis note and the caption — has to read that absence rather than
    // the placeholder.
    cleanup()
    render(<LaborMarket />)
    const set = (label: string, value: string) => {
      const slider = screen.getByLabelText(label) as HTMLInputElement
      fireEvent.change(slider, { target: { value } })
    }
    set('Union Bargaining Power (β)', '0.1')
    set('Firm Markup (μ)', '0.5')
    set('Benefits Replacement Rate (z)', '0.8')

    const absent = (label: string) =>
      screen.getByText(label).parentElement?.querySelector('.stat-tile-value')?.textContent?.trim()
    expect(absent('Equilibrium Unemployment (u*)')).toBe('—')
    expect(absent('Employment Level')).toBe('—')
    // The number the placeholder used to produce, asserted absent from the
    // whole page: this is what a reader was shown before.
    expect(document.body.textContent).not.toContain('50.00')
    // And the caption says WHICH boundary was crossed, not merely that
    // something is wrong.
    expect(screen.getByText(/No intersection anywhere in u ≤ 100%/)).toBeTruthy()
    expect(screen.getByText(/u\* to compare/)).toBeTruthy()
    // The four scenario cards read the same helper, so they read `—` too.
    // Counted in the page's text rather than with a query, because each is a
    // `<p>` that also contains the label and `getAllByText` would not see it.
    const marks = (document.body.textContent?.match(/—/g) ?? []).length
    expect(marks, "the two tiles and four scenario cards reading '—'").toBeGreaterThanOrEqual(6)
  })
})
