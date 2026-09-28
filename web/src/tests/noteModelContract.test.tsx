/**
 * A lecture and the tool beside it must say the same thing.
 *
 * Sixteen agents changed this site's tool models. The notes were written
 * against the models as they were, so every claim a note makes about a model
 * is now a claim that can be false, and the two halves of the course sit on
 * the same page: a reader works through `Lecture_23.md` and then opens the
 * Gordon calculator. A course where the lecture teaches one thing and the
 * tool beside it teaches another is worse than a course with a shabbier tool.
 *
 * Nothing in the suite held that pair together. `calculations.test.ts` pins
 * formulas against their callers, `modelValues.test.tsx` pins values against
 * the sliders, and both are one-directional: a tool can be self-consistent
 * and still contradict the lecture, which is exactly the shape of the five
 * disagreements this file records. Each contract below is a PAIR — the note
 * has to keep saying the thing, and the tool has to keep doing it — and each
 * one is an executable check against the mounted tool rather than a comment
 * about what somebody once read.
 *
 * Every contract also asserts the falsifying case where one exists, because a
 * contract that only asserts agreement cannot tell a model that agrees from a
 * model that has stopped computing anything. `gdp-visualizer` has to produce
 * three DIFFERENT totals when one component is moved, or "they agree" is
 * vacuous; `asset-pricing` has to produce a NUMBER as well as a dash, or the
 * dash is what it always prints.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { openTool, type MountedTool } from './modelAssertions'
import type { ToolId } from '../../../content/lectures'

const NOTES = join(__dirname, '..', '..', '..', 'content', 'lecture_notes')
const note = (name: string): string => readFileSync(join(NOTES, name), 'utf8')

/**
 * The number out of a rendered value.
 *
 * A tile that prints a unit prints it INSIDE the value the reader sees —
 * `'100.0 T'`, `'650.0 $ billions'`, `'55.56 %'` — which is the string the
 * harness deliberately hands back, and `Number()` on any of them is `NaN`.
 * Taking the leading run of digits, dots and one sign is the model value as
 * displayed; the comparison that matters here is a sign or an equality, not a
 * precision past what the tile prints.
 */
function numeric(printed: string): number {
  const match = /-?\d[\d.]*/.exec(printed)
  if (!match) throw new Error(`no number in ${JSON.stringify(printed)}`)
  return Number.parseFloat(match[0])
}

/** One note's claim, and the tool behaviour that has to go with it. */
interface Contract {
  /** The file the prose lives in. */
  lecture: string
  /** What the note has to keep asserting. Matched against the raw markdown. */
  claim: RegExp
  /** Why the claim is stated that way, for whoever reads this in a year. */
  because: string
  tool: ToolId
  check(tool: MountedTool): Promise<void>
}

const CONTRACTS: Contract[] = [
  {
    lecture: 'Lecture_2.md',
    claim: /### Summary: All Three Methods Yield GDP = \$200/,
    because:
      'The note teaches the three approaches as three routes to ONE number, ' +
      'which is the whole reason a statistical discrepancy exists. The tool ' +
      'used to open 7% apart, so a reader who took the note literally and then ' +
      'read the tool found the identity failing on the first screen.',
    tool: 'gdp-visualizer',
    async check(tool) {
      // The three approaches are three tabs rather than three tiles, so the
      // comparison the note claims has to be driven tab by tab.
      const tabs: [string, string][] = [
        ['Expenditure Approach', 'expenditure'],
        ['Income Approach', 'income'],
        ['Production Approach', 'production'],
      ]
      // Read the slider while the tab that owns it is the one on screen: the
      // expenditure components live on the expenditure tab, and a control the
      // page is not showing is not a control the reader can move.
      const g = await tool.value('Government Spending (G)')
      const readAll = async (): Promise<string[]> => {
        const values: string[] = []
        for (const [button] of tabs) {
          await tool.click(button)
          values.push(tool.stat('Total GDP'))
        }
        return values
      }
      const atDefaults = await readAll()
      expect(
        new Set(atDefaults).size,
        `the three approaches disagree at the defaults: ${atDefaults.join(' / ')}`,
      ).toBe(1)
      // The falsifying case. Agreement that cannot be broken is not agreement,
      // it is a model that stopped responding to its own inputs. G is an
      // expenditure-side component, so the route that moves is the
      // expenditure one and the other two are untouched — which is the whole
      // content of the note's "the three approaches measure the same thing":
      // they agree only while the two sets of inputs are consistent with each
      // other, and the tool's own job is to let the reader break that.
      await tool.click('Expenditure Approach')
      await tool.set({ 'Government Spending (G)': g + 1 })
      const moved = await readAll()
      expect(moved[0], 'the expenditure route ignored its own G').not.toBe(atDefaults[0])
      expect(moved[1], 'the income route moved with an expenditure slider').toBe(atDefaults[1])
      expect(moved[2], 'the production route moved with an expenditure slider').toBe(atDefaults[2])
    },
  },
  {
    lecture: 'Lecture_3.md',
    claim: /### Experiment 2: Expansionary Fiscal Policy[\s\S]{0,600}?raises output by more than/,
    because:
      'The note runs three policy experiments and states the sign of each. ' +
      'The tool has the same three plus a combined one, so a sign flip in any ' +
      'of the three would leave a reader who followed the note unable to ' +
      'reproduce what the tool shows.',
    tool: 'fiscal-policy-experiments',
    async check(tool) {
      const base = numeric(await tool.stat('Baseline Output (Y)'))
      // Each button names a lever and the panel above it mounts that lever's
      // slider, so the order is button THEN slider: the panel is what the
      // reader moves, and a control the page is not showing cannot be set.
      await tool.click('Exp 1: Consumption')
      await tool.set({ 'Change in Autonomous Consumption': 5 })
      expect(numeric(await tool.stat('New Output (Y\')'))).toBeGreaterThan(base)
      await tool.click('Exp 2: Gov Spending')
      await tool.set({ 'Change in Government Spending': 5 })
      expect(numeric(await tool.stat('New Output (Y\')'))).toBeGreaterThan(base)
      await tool.click('Exp 3: Taxes')
      await tool.set({ 'Change in Taxes': 5 })
      expect(numeric(await tool.stat('New Output (Y\')'))).toBeLessThan(base)
      // The lever the note does not have: both dials together, which the tool
      // now moves as a balanced-budget expansion rather than reading the tax
      // slider and discarding it.
      await tool.click('Combined')
      await tool.set({ 'Change in Spending': 20, 'Change in Taxes': 20 })
      expect(numeric(await tool.stat('New Output (Y\')'))).toBeGreaterThan(base)
    },
  },
  {
    lecture: 'Lecture_8.md',
    claim: /\$\$u_n = F\^\{-1\}\\left\(\\frac\{1\}\{1 \+ m\}, z\\right\)\$\$/,
    because:
      'The note derives the natural rate as the intersection of the wage- and ' +
      'price-setting curves and puts NO upper bound on it, so the equilibrium ' +
      'unemployment the tool reports is a number the lecture has already ' +
      'licensed. The tool used to sample the curve only to 12%, which pinned ' +
      'u* low and hid the out-of-range case the note allows.',
    tool: 'labor-market',
    async check(tool) {
      // Markup above the wage-setting line's intercept puts the WS/PS
      // intersection outside u in [0,1], which the note permits because it
      // never bounded the solution.
      await tool.set({
        'Union Bargaining Power (β)': 0.2,
        'Firm Markup (μ)': 0.5,
        'Benefits Replacement Rate (z)': 0.2,
      })
      expect(await tool.stat('Equilibrium Unemployment (u*)')).toBe('—')
      // The falsifying case: a dash that is always a dash is a tile that
      // stopped computing, not a model that has a domain edge. And the note's
      // `u_n` is not a small number, so a value under 12% would mean the
      // sampling had been narrowed back down.
      await tool.set({
        'Union Bargaining Power (β)': 0.5,
        'Firm Markup (μ)': 0.2,
        'Benefits Replacement Rate (z)': 0.4,
      })
      const solved = await tool.stat('Equilibrium Unemployment (u*)')
      expect(solved).not.toBe('—')
      const value = numeric(solved)
      expect(value).toBeGreaterThan(12)
      expect(value).toBeLessThanOrEqual(100)
    },
  },
  {
    lecture: 'Lecture_14.md',
    claim: /\*\*Output per worker growth = 0\*\*[\s\S]{0,120}?\*\*Total output growth = \$g_N\$\*\*/,
    because:
      'The note is explicit that the balanced-growth rate of output PER worker ' +
      'is zero and that the positive rate is an AGGREGATE one. The tool grew a ' +
      'tile off the same parameter, and the sentence beside it called that ' +
      'number "per-capita growth", which is the one claim in the pair that a ' +
      'reader could check in ten seconds and find false.',
    tool: 'solow-simulator',
    async check(tool) {
      const n = await tool.value('Population Growth (n)')
      const tile = await tool.stat('Steady State Total Output Growth (n)')
      expect(tile).toBe(`${(n * 100).toFixed(2)} %`)
      // The falsifying case: a tile wired to the savings rate would pass the
      // assertion above at the defaults and fail this one.
      const s = await tool.value('Savings Rate (s)')
      await tool.set({ 'Savings Rate (s)': s + 0.01 })
      expect(await tool.stat('Steady State Total Output Growth (n)')).toBe(tile)
    },
  },
  {
    lecture: 'Lecture_23.md',
    claim: /\$\$g < i_\{1t\} \+ x_s\$\$/,
    because:
      'The closed form and its domain were the note\'s missing half: the tool ' +
      'was the only place in the course that said the Gordon price does not ' +
      'exist at r <= g, and it said it in a tile change line. The note carries ' +
      'the derivation now, and this holds the tool to it.',
    tool: 'asset-pricing',
    async check(tool) {
      // r <= g: the note's constraint, and the tile the model has no number for.
      await tool.set({ 'Growth Rate': 10, 'Discount Rate': 0 })
      expect(await tool.stat('Stock Price'), 'Gordon is defined at or below g').toBe('—')
      // The bond beside it is defined at every discount rate, including the
      // zero this note also teaches, so a dash here would be the same mistake
      // in the other direction.
      expect(await tool.stat('Bond Price')).not.toBe('—')
      // The falsifying case: r strictly above g is inside the domain, so the
      // dash above has to be a boundary and not a constant.
      await tool.set({ 'Growth Rate': 0, 'Discount Rate': 10 })
      expect(await tool.stat('Stock Price')).not.toBe('—')
    },
  },
]

describe('a lecture and its tool say the same thing', () => {
  it('has contracts, so the pair is not unguarded by an empty list', () => {
    // The failure mode the prompt for this pass named: a source-scan test that
    // finds nothing and passes. This asserts the contracts exist, that each
    // names a real note, and that no two of them share one — a duplicated
    // entry would inflate the count without adding a claim.
    expect(CONTRACTS.length).toBeGreaterThanOrEqual(5)
    const lectures = CONTRACTS.map((c) => c.lecture)
    expect(new Set(lectures).size, 'two contracts name the same lecture').toBe(lectures.length)
    for (const file of lectures) {
      expect(() => note(file), `${file} does not exist`).not.toThrow()
    }
  })

  it.each(CONTRACTS.map((c) => [c.lecture, c] as const))(
    '%s keeps its claim, and the tool keeps satisfying it',
    async (_lecture, contract) => {
      // The note half. A reword that drops the economics fails here rather than
      // in a reader's head, and the message says which sentence.
      expect(note(contract.lecture), `${contract.lecture} no longer claims ${contract.claim}`).toMatch(
        contract.claim,
      )
      const tool = await openTool(contract.tool)
      await contract.check(tool)
    },
  )
})
