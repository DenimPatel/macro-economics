import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen, fireEvent, act, cleanup } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { ChartLegend } from '../components/ChartLegend'
import { useHiddenSeries } from '../lib/chartSeries'
import { useToolReset } from '../lib/toolReset'
import { SliderControl, NumberInput, ToolControlBar } from '../components/ToolComponents'
import { chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { dataDomain, niceStep } from '../lib/chartDomain'
import { usePreferences } from '../lib/preferences'

/**
 * The tool contract.
 *
 * Everything in this file is about one thing: a tool page is the only page
 * on the site where a reader CONTROLS something, and it was the only page
 * whose controls were not built on the shared system. The tools were
 * density-blind, their legends were lists, their resets existed on five of
 * twenty, and five of the twenty charts had a pinned axis domain that a
 * computed readout could walk straight out of.
 *
 * The assertions are mostly STRUCTURAL, over `web/src/tools` as source,
 * because the defects this file exists for are not visible in a snapshot of
 * one tool: they are a class of mistake repeated across twenty files, and a
 * per-file test would pass on a tool that had not been converted while the
 * other nineteen were.
 */

const SRC = join(__dirname, '..')
const TOOLS = join(SRC, 'tools')
const CSS = readFileSync(join(SRC, 'index.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const CHART_THEME = readFileSync(join(SRC, 'design', 'chartTheme.ts'), 'utf8')
const CHART_LEGEND = readFileSync(join(SRC, 'components', 'ChartLegend.tsx'), 'utf8')
const TOOL_COMPONENTS = readFileSync(join(SRC, 'components', 'ToolComponents.tsx'), 'utf8')
const CHART_TOOLTIP = readFileSync(join(SRC, 'components', 'ChartTooltip.tsx'), 'utf8')

// `registry.tsx` is the lazy-load table, not a tool, and it has no default
// component export; the test is about the twenty that do.
const toolFiles = readdirSync(TOOLS)
  .filter((f) => f.endsWith('.tsx') && f !== 'registry.tsx')
  .sort()
/** Source with comments removed, for the scans that look for an API and
 * must not be fooled by a note about it. Several of the comments in this
 * diff name the very API they replaced, which is correct for a reader and
 * wrong for a regex. */
const stripComments = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')

const toolSource = (file: string): string => readFileSync(join(TOOLS, file), 'utf8')

/**
 * The byte range each self-closing element of one kind occupies in a file.
 *
 * Needed because the height test has to decide WHERE a `height={N}` was
 * written, and a value-keyed lookup cannot do that: the same number is
 * legitimately on a container and illegitimately on a wrapper div, and only
 * the position tells them apart. Every `<XAxis>`, `<YAxis>` and
 * `<ResponsiveContainer>` in the tools is self-closing, so the first `/>` after
 * the opening tag ends the element.
 *
 * `axisDomains.test.ts` asserts that equality for the two axis tags — that
 * every one opened is one this parser closed — so a tool that adopted a
 * non-self-closing axis fails there rather than quietly shortening every
 * element after it here.
 */
function elementRanges(
  source: string,
  open: RegExp,
): { tag: string; from: number; to: number }[] {
  const out: { tag: string; from: number; to: number }[] = []
  for (const m of source.matchAll(open)) {
    const rest = source.slice(m.index + m[0].length)
    const end = rest.indexOf('/>')
    if (end === -1) continue
    out.push({ tag: m[1] ?? 'element', from: m.index, to: m.index + m[0].length + end + 2 })
  }
  return out
}

function ruleBodies(selector: string): string[] {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const out: string[] = []
  const re = new RegExp(`^\\s*${escaped}\\s*\\{`, 'gm')
  let hit = re.exec(CSS)
  while (hit) {
    const open = CSS.indexOf('{', hit.index)
    const close = CSS.indexOf('\n}', open)
    out.push(CSS.slice(open + 1, close))
    hit = re.exec(CSS)
  }
  return out
}

function ruleBody(selector: string): string {
  const bodies = ruleBodies(selector)
  expect(bodies.length, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(0)
  return bodies[0]
}

function decl(selector: string, name: string): string {
  const found = ruleBody(selector).match(new RegExp(`${name}:\\s*([^;]+);`))
  expect(found, `${selector}: ${name}`).not.toBeNull()
  return (found as RegExpMatchArray)[1].replace(/\s+/g, ' ').trim()
}

afterEach(() => {
  cleanup()
  // The preference store is module-level and persists between tests in a
  // file, and two of the tests below change the reader's text size, so
  // every test that changes it puts it back.
  usePreferences.setState({ textScale: 1, density: 'comfortable' })
})

/* ------------------------------------------------------------------ *
 * Density reaches the tools
 * ------------------------------------------------------------------ */

describe('the density preference reaches a tool page', () => {
  /**
   * The steps the conversion deliberately LEFT LITERAL, and the complete
   * list of them. These are not on the `--space-*` scale: `2.5` and `1.5`
   * are 0.625rem and 0.375rem and `0.5` is 0.125rem, and the contract is
   * that a converted class is pixel-identical at the default density, so an
   * off-grid step stays literal rather than being snapped to a neighbour
   * 2.4px away. Listed here so that "the only literals are the ones we
   * meant" is a claim this file can check, and so the note above can be
   * falsified when a step stops being deliberate.
   */
  const DELIBERATE_OFF_GRID = ['py-2.5', 'my-0.5', 'mt-1.5', 'space-y-1.5']

  /**
   * One spacing utility, matched with its decimal intact so that `py-2.5`
   * is identified as `py-2.5` and not truncated to the `py-2` that happens
   * to be a valid class in its own right.
   */
  const SPACING = /\b(?:[mp][trblxy]?-(?:s-)?\d+(?:\.\d+)?|gap(?:-[xy])?-(?:s-)?\d+(?:\.\d+)?|space-[xy]-(?:s-)?\d+(?:\.\d+)?)/g
  const ON_SCALE = /\b(?:[mp][trblxy]?-s-\d+|gap(?:-[xy])?-s-\d+|space-[xy]-s-\d+)/g

  it('binds the tool internals to the --space-* scale, not to Tailwind default steps', () => {
    // The conversion is a class of change across twenty files, so it is
    // counted in total and per-file rather than asserted on one tool. What
    // is asserted is the INVARIANT — every tool converted, no tool reverted,
    // and the only spacing left off the scale is the set we meant to leave
    // off it — rather than the size of the batch, which moves for any
    // legitimate reason: a new control, a refactor, a fixed unit label. A
    // test that has to be edited every time the file legitimately changes
    // teaches the next contributor to edit it without thinking, and that is
    // how the real invariant below gets lost.
    let total = 0
    const perTool: Record<string, number> = {}
    const offGrid = new Map<string, string[]>()
    for (const file of toolFiles) {
      const source = toolSource(file)
      const all = source.match(SPACING) ?? []
      perTool[file] = (source.match(ON_SCALE) ?? []).length
      total += all.length
      for (const token of all) {
        if (/-s-/.test(token)) continue
        offGrid.set(token, [...(offGrid.get(token) ?? []), file])
      }
    }
    const onScaleTotal = Object.values(perTool).reduce((a, b) => a + b, 0)

    // Every tool is converted, not the big ones and the small ones. The
    // floor is 80% of the smallest converted tool (CrisisSvb, 10 on-scale
    // utilities), so a legitimate edit that adds or removes a control does
    // not trip it and a reverted tool does. A tool taken back to Tailwind
    // default steps lands on 0; a partial revert of the SMALLEST tool lands
    // below 8.
    const belowFloor = Object.entries(perTool)
      .filter(([, n]) => n < 8)
      .map(([f, n]) => `${f} (${n} on scale)`)
    expect(belowFloor, 'tools with fewer than 8 spacing utilities on the --space-* scale').toEqual([])

    // The only spacing left off the scale is the set declared above. This is
    // the assertion that replaces the two exact totals: it is a property of
    // the tree rather than a measurement of it, and a single `p-4` reaching
    // any of the twenty files fails it.
    const unexpected = [...offGrid.keys()].filter((t) => !DELIBERATE_OFF_GRID.includes(t))
    expect(unexpected, 'Tailwind default steps that are neither on the scale nor declared deliberate').toEqual([])
    // ...and the deliberate ones are still there, so the list above is a
    // description of the tree and not an aspiration.
    const gone = DELIBERATE_OFF_GRID.filter((t) => !offGrid.has(t))
    expect(gone, 'off-grid steps listed as deliberate that no longer appear').toEqual([])

    // The share on the scale stays high: this is the "the conversion
    // happened at all" signal, and it is a coarse one on purpose. An
    // unconverted tree is 0.0 and a half-reverted tree is near 0.5. The
    // previous threshold of 0.97 was 0.15 points clear of the value the
    // pass produced, which is the same snapshot-of-one-pass failure as a
    // pinned total, in continuous form — and the deliberate exceptions
    // above put a hard ceiling on the attainable ratio, so no threshold
    // near the ceiling is a statement about the design rather than about
    // the day the counting was done.
    expect(onScaleTotal / total, 'share of tool spacing that is on the scale').toBeGreaterThan(0.9)
    // Every tool is converted, not the big ones and the small ones.
    const untouched = Object.entries(perTool).filter(([, n]) => n === 0).map(([f]) => f)
    expect(untouched).toEqual([])
  })

  it('leaves every plot height a literal, so two charts stay comparable by eye', () => {
    // `density.test.ts` owns the rule that a plot frame may not carry a
    // `var()` or an `s-*` utility. This is the other half of the same
    // reasoning stated as a measurement: a shorter plot RE-SCALES the y axis,
    // so the same curve sits at a different height and a reader comparing
    // two tools by eye is comparing two pictures of different things.
    for (const file of toolFiles) {
      const source = toolSource(file)
      expect(source, file).not.toMatch(/height=\{['"][^'"]*s-/)
      expect(source, file).not.toMatch(/h-\[[^\]]*\]\s*[^"'`]*var\(/)
      expect(source, file).not.toMatch(/h-s-/)
      expect(source, file).not.toMatch(/h-\[s-/)
    }
  })

  it('gives every plot the same height, and writes that height in one place', () => {
    // The height a plot is drawn at is a SIZE, and a size with a single
    // correct value in twenty tools. Five values across thirteen files was
    // the state this replaces: `300`, `320`, `350` and `400`, four files
    // carrying two of them at once, and two spellings of the same fact
    // (`height={N}` on the container, `h-[Npx]` on a wrapper div) which let
    // the same tool disagree with itself. The reason one value: a shorter
    // plot RE-SCALES the y axis, so the same curve sits at a different
    // height and a reader comparing two tools by eye is comparing two
    // pictures of different things.
    //
    // MEASURED in Chromium against the production build, on the densest
    // chart (IsLmExplorer, three series) and the most label-dense one
    // (SpeculativeAttack, six charts), at 1280px and 390px and at
    // textScale 1.0 and 1.3, sweeping the three candidates:
    //
    //   y-axis labels clipped   300: 7 of 12 charts (worst 103.4px)
    //   at textScale 1.0        350: 5 of 12 (worst 78.4px)
    //                           400: 2 of 12 (worst 53.4px)
    //   at textScale 1.3        300: 12 of 12 (worst 175.0px)
    //                           350:  9 of 12 (worst 150.0px)
    //                           400:  5 of 12 (worst 125.0px)
    //   y-axis tick min gap     300: 38.6px   350: 52.9px   400: 67.1px
    //
    // 400 is the best of the three, not a clean sweep, and the residue at the
    // time of writing was the two long rotated axis labels in
    // SpeculativeAttack: a label anchored at the axis's vertical middle grows
    // UPWARD from its anchor, so one longer than half the plot is clipped
    // however tall the plot is. That was a chart-chrome fix rather than a
    // height one — the label carried no `fontSize` and fell back to the
    // browser's 16px — and it has since been made: the axis label now takes
    // `--chart-axis-label-size`, and `axisDomains.test.ts` holds the token,
    // the rule and the character budget a rotated label has to fit. RE-MEASURED
    // on the production build at 1280px and 390px, textScale 1.0 and 1.3, over
    // every panel of every tool: 19 of the 25 distinct axis labels were
    // clipped at some width and scale, 16 of them by more than 5px, and the
    // worst by 152.5px. One label is clipped now, by 4.3px, in one tool at
    // one width.
    //
    // The x-tick collision recorded here is likewise fixed, and it was never a
    // height problem: the only collision found, in RealInterestRateCalculator's
    // rotated scenario bar chart at 390px, was 4 overlapping pairs at a -42.6px
    // gap at textScale 1.0 and -48.4px at 1.3 — IDENTICAL at 300, 350 and 400.
    // It belonged to the width and the label angle, and it is gone because the
    // category axis is now vertical, where a label's footprint is the font size
    // rather than the length of its string.
    //
    // 400 is also the tallest, and growing a plot is the safe direction:
    // shrinking is what makes labels collide.
    const PLOT_HEIGHT = 400

    const seen = new Map<string, string[]>()
    const record = (value: string, where: string) => {
      if (!seen.has(value)) seen.set(value, [])
      seen.get(value)!.push(where)
    }

    // A container states its own height. Every one must be the one value, and
    // every tool that draws a chart must state it at all, so a rename that
    // dropped the prop cannot pass by asserting nothing.
    const filesWithPlots: string[] = []
    for (const file of toolFiles) {
      const source = toolSource(file)
      const plots = [
        ...source.matchAll(/<ResponsiveContainer\b[^>]*?\bheight=\{(\d+)\}/gs),
      ].map((m) => m[1])
      if (plots.length === 0) continue
      filesWithPlots.push(file)
      plots.forEach((v) => record(v, `${file} <ResponsiveContainer>`))
    }
    expect(
      filesWithPlots.length,
      'tools that state a plot height on the container',
    ).toBe(toolFiles.length)

    // The retired spelling. A wrapper div that only exists to size a
    // `height="100%"` container is a second place to hold the same number,
    // and it is the one place a chart height could still be reached from CSS
    // — which `density.test.ts` calls out. A plot says it on the container.
    for (const file of toolFiles) {
      const source = toolSource(file)
      expect(source, `${file} must not size a plot with a wrapper div`).not.toMatch(
        /<ResponsiveContainer\b[^>]*height="100%"/,
      )
    }

    // The one `h-[Npx]` that survives is a plot's RESERVED FRAME, not a
    // plot: a `<div>` has no `height` prop, so the two empty states that
    // stand in for a chart with no data to draw spell the same number as a
    // class. It is in the same class of facts and it is held to the same
    // value, or a chart would appear and the page would jump.
    for (const file of toolFiles) {
      for (const m of toolSource(file).matchAll(/h-\[(\d+)px\]/g)) {
        record(m[1], `${file} reserved frame`)
      }
    }

    // Anything else numeric that is called a height is a cartesian axis
    // giving room for its tick LABELS, and the band is a legitimate exception
    // to the one value: normalising it to 400 would buy an empty band under
    // the plot and shrink the plot itself. It is on an `XAxis` or a `YAxis`,
    // and that is the whole exemption.
    for (const file of toolFiles) {
      const source = toolSource(file)
      for (const axis of source.matchAll(/<(XAxis|YAxis)\b[\s\S]*?\/>/g)) {
        for (const m of axis[0].matchAll(/\bheight=\{(\d+)\}/g)) {
          record(`axis label band ${m[1]}`, `${file} <${axis[1]}>`)
        }
      }
    }

    const offenders = [...seen.entries()].filter(([value]) => value !== String(PLOT_HEIGHT) && !value.startsWith('axis label band'))
    expect(offenders, 'plot heights that are not the one value').toEqual([])

    /* ---------------------------------------------------------------- *
     * The exemption, stated as the PROPERTY rather than as a count.
     *
     * This replaces `expect(axisBands).toHaveLength(1)`. That assertion said
     * there is exactly one exempt band in the tools, which is true of the tree
     * it was written against and stops being true the moment a second
     * category axis needs vertical tick labels — which is the ordinary reason
     * to add one. A test that has to be edited whenever a file legitimately
     * changes teaches the next contributor to edit it without thinking, and
     * the edit it invites here is "bump 1 to 2", which asserts nothing about
     * either band.
     *
     * The property, which survives any number of bands:
     *
     *   EVERY `height={N}` written in a tool is one of exactly two things —
     *   the plot height on a `<ResponsiveContainer>`, or a tick-label band
     *   inside a cartesian axis element. Nothing else may carry one.
     *
     * And it is classified by OCCURRENCE, not by value, which is the part the
     * count could not express. The loop this replaces skipped a `height={N}`
     * whenever the same number appeared anywhere on a container, so a
     * `<div height={400}>` in a file that also has a 400px plot was exempt,
     * and a wrapper div carrying `height={120}` was exempt by proxy from an
     * unrelated axis band elsewhere in the same file. Both are plots that have
     * drifted, and a value-keyed check cannot see either. The mutation that
     * proves this one can: a `height={N}` on a wrapper div, in a file whose
     * axis carries the same N.
     * ---------------------------------------------------------------- */
    const bands: string[] = []
    const strayHeights: string[] = []
    for (const file of toolFiles) {
      const source = toolSource(file)
      const axes = elementRanges(source, /<(XAxis|YAxis)\b/g)
      const containers = elementRanges(source, /<ResponsiveContainer\b/g)
      for (const h of source.matchAll(/\bheight=\{(\d+)\}/g)) {
        const at = h.index ?? 0
        const axis = axes.find((r) => at >= r.from && at < r.to)
        if (axis) {
          bands.push(`${file} <${axis.tag}> height={${h[1]}}`)
          continue
        }
        // A container's height is the one value, and the offender list above
        // is what holds it there; nothing to add here.
        if (containers.some((r) => at >= r.from && at < r.to)) continue
        strayHeights.push(
          `${file}: height={${h[1]}} on neither a <ResponsiveContainer> nor a cartesian axis`,
        )
      }
    }
    // Non-vacuity first. A band assertion that found no band would be a test of
    // a tree with no rotated axis in it, passing for the same reason a scan
    // that matched nothing passes — and the exemption above is the one thing
    // in this test that can be satisfied by the tools simply not having any.
    expect(bands, 'tick-label bands the exemption was written for').not.toHaveLength(0)
    expect(strayHeights, 'plot heights that are not the one value').toEqual([])
  })

  it('draws every ReferenceLine label inside the plot, where it cannot be clipped', () => {
    // Recharts gives a ReferenceLine's label the LINE as its viewBox, so
    // `position: 'top'` on a vertical line puts the text ABOVE the plot and
    // `position: 'right'` on a horizontal one puts it past the right edge.
    // The plot box is `chartTheme.margin` (8px) from the SVG on every side,
    // so there is no room there for a label of any size: the text leaves the
    // SVG viewport, which clips it, while the node stays in the document and
    // so in the accessibility tree. MEASURED in Chromium, at the defaults, at
    // 1280px and 390px in both themes: `Y₀=650B` in
    // `FiscalPolicyExperiments` lost 14px of a 15px label — present for a
    // screen reader and not on screen at all — `W/P = 0.833` in
    // `LaborMarketWsPs` lost 74.9px of 94.9px, `Expected Inflation (2.0%)` in
    // `PhillipsCurveTradeOff` 166.9px of 191.8px, and `NAIRU (5.0%)` in
    // `LaborMarket` 8.5px of 14.5px. The `inside*` positions are the family
    // that is inside the plot box by construction, so the answer holds at any
    // axis length — which matters in the tools whose axis is derived from the
    // quantity being labelled.
    //
    // Comments are stripped first. A tool explains WHY it uses `insideTop`,
    // and a scan of raw source would read that explanation as the bug.
    const offenders: string[] = []
    for (const file of toolFiles) {
      const code = toolSource(file)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '')
      for (const open of code.matchAll(/<(ReferenceLine|ReferenceArea)\b/g)) {
        // The element's own props: from the opening tag to the `/>` that
        // closes it. Nothing in a ReferenceLine is self-closing but itself,
        // so the first `/>` is the right end and the window cannot run on
        // into the next element and pick up its positions.
        const rest = code.slice(open.index + open[0].length)
        const end = rest.indexOf('/>')
        const props = end === -1 ? rest : rest.slice(0, end)
        const bad = /\bposition:\s*'(top|bottom|left|right)'/.exec(props)
        if (bad) offenders.push(`${file}: ${open[1]} label uses position: '${bad[1]}'`)
      }
    }
    expect(offenders, 'ReferenceLine labels positioned outside the plot').toEqual([])
  })

  it('keeps every axis key unique per orientation, so a sibling cannot be dropped', () => {
    // The bug this replaces: the key came out of a SHARED props object, so
    // `<XAxis>` and `<YAxis>` carried the same string, React deduplicated
    // keys within a level, and the second axis was dropped from
    // reconciliation. The check is that no two axes in one file share a key,
    // which is only possible because the key is written per orientation.
    for (const file of toolFiles) {
      const source = toolSource(file)
      const keys = [...source.matchAll(/key=\{chartTheme\.axisKey\('([xy])'\)\}/g)].map((m) => m[1])
      expect(keys.length, `${file} axes carrying a key`).toBeGreaterThan(0)
      const xCount = keys.filter((k) => k === 'x').length
      const yCount = keys.filter((k) => k === 'y').length
      expect(xCount, `${file} x-axis keys`).toBe((source.match(/<XAxis\b/g) ?? []).length)
      expect(yCount, `${file} y-axis keys`).toBe((source.match(/<YAxis\b/g) ?? []).length)
    }
  })

  it('never carries a `key` inside a spread props object, which React 19 deprecates', () => {
    // React still honours it, and it still re-measures the axis, but it logs
    // `A props object containing a "key" prop is being spread into JSX` for
    // every one — a dozen console errors on a three-chart page, none of them
    // actionable, and a deprecated pattern besides.
    expect(CHART_THEME, 'chartTheme must not put a key in a props object').not.toMatch(
      /key:\s*`axis-/,
    )
    expect(CHART_THEME, 'axisProps must not return a key').not.toMatch(/function axisProps[\s\S]*?key:/)
  })
})

/* ------------------------------------------------------------------ *
 * The heading outline
 * ------------------------------------------------------------------ */

describe('a tool authors h2s, and the h3 slot belongs to the note primitive', () => {
  /**
   * Every heading LEVEL a source file writes, in source order.
   *
   * Comments come off first, for the reason `stripComments` exists and is worth
   * restating here: several comments in this tree explain the rule this file
   * asserts, and the correct way to explain a rule is to name the thing being
   * banned — so a scan of raw source reads its own documentation as the
   * violation. That is not a corner case, it is the ordinary case, and a scan
   * that cannot be quoted in a comment is a scan the next agent will disable.
   *
   * The unit is the TAG, not a class name. The classes are the styling and they
   * are deliberately allowed to vary (a chart heading, an uppercase eyebrow and
   * a `text-lg` section title are all `h2` in this tree); the tag is the only
   * thing a screen reader's heading list or a browser's find-by-heading can
   * see, so it is the only thing the invariant can be about.
   */
  const headingLevels = (source: string): number[] => [
    ...stripComments(source).matchAll(/<h([1-6])\b/g),
  ].map((m) => Number(m[1]))

  /**
   * The scanner above is the whole test, so it is held to being able to fail.
   *
   * A source scan has exactly one interesting failure mode and it is silent: a
   * regex that never matches reports an empty offender list for every file and
   * the assertion passes on a tree that violates the rule in every file. The
   * mutation that causes it is boring — a `\b` dropped, a lookahead tightened,
   * the capture group moved out of the match — and nothing else in this file
   * would notice. So the scanner is run here against sources that are known to
   * contain what it is supposed to find, including the two shapes that are
   * easy to get wrong: a multi-line opening tag, and a tag that appears only
   * inside a comment.
   */
  it('finds what is there and ignores what is only written about', () => {
    expect(
      headingLevels('<h1>a</h1><h2 className="x">b</h2><h3>c</h3><h4>d</h4><h5>e</h5><h6>f</h6>'),
      'one of each level, in order',
    ).toEqual([1, 2, 3, 4, 5, 6])
    // The multi-line form, which every heading in a tool that wraps its title
    // onto a second line uses.
    expect(headingLevels('<h2\n  className="mb-s-4 text-lg"\n>\n  Title\n</h2>')).toEqual([2])
    // Not a heading: a close tag, and a class name that merely contains one.
    expect(headingLevels('</h3><div className="h3" />')).toEqual([])
    // A comment that names the tag is prose about the rule, not the rule
    // broken. This is the case `stripComments` exists for and it is a
    // correctness requirement here, not tidiness: without it the comments
    // added alongside this fix would have turned the assertion red.
    expect(headingLevels('{/* was an <h3> until the promotion */} <h2>x</h2>')).toEqual([2])
    expect(headingLevels('// an <h3> in a line comment\n<h2>x</h2>')).toEqual([2])
  })

  /**
   * The rule `AGENTS.md` states: a tool's own sections are `h2`, and `h3` is
   * the note primitive's title level. Thirty-four tool-authored `h3`s said
   * otherwise, spread over five files, and the damage is that the slot had
   * two occupants: a tool's own section title and a `ToolNote` title occupied
   * the same place in the outline, so a reader moving by heading could not
   * tell a section of the tool from an aside inside one. `SpeculativeAttack`
   * was the worst case because it did it to ITSELF — two `h2`s, then six
   * chart headings at `h3` carrying `text-lg`, the same visual weight as the
   * `h2`s one level down.
   *
   * Nothing here counts headings. The count moves for a legitimate reason
   * (a section added, a tool rewritten), and a test that has to be edited
   * every time the file legitimately changes is a test that gets edited the
   * first time something illegitimate changes too. The property is the
   * vocabulary: one `h3` producer, and it is not a tool.
   */
  it('writes no h3 of its own, and no level above or below the one a section may use', () => {
    const offenders: string[] = []
    for (const file of toolFiles) {
      const source = toolSource(file)
      // The scan has to have run over the file and not over a comment-stripped
      // husk of it, or "no offenders" is a statement about the stripper.
      expect(stripComments(source).length, `${file} was not scanned`).toBeGreaterThan(0)
      for (const level of headingLevels(source)) {
        if (level !== 2) {
          offenders.push(`${file}: <h${level}> — a tool section is <h2>`)
        }
      }
    }
    expect(offenders, 'headings authored in a tool file that are not <h2>').toEqual([])
  })

  /**
   * The same vocabulary, one step further out: not WHICH level a title is at,
   * but how a SECTION title is set. A promotion from `h3` to `h2` is a change
   * of level, and the class list is not part of it — so thirteen `<h3>` section
   * titles in `GdpMeasurement` became `<h2>`s without `tracking-tight`, leaving
   * five and thirteen sibling section titles in that one file set two ways.
   * `tracking-tight` at 18px/600 is -0.45px of letter spacing: a quarter of a
   * pixel, which is why it is invisible in a screenshot and obvious when a
   * reader's eye tracks down a column of headings and finds one of them
   * drifting.
   *
   * Scoped to section titles rather than to every `<h2>`, and the discriminator
   * is `text-lg font-semibold`, which is the signature of that role. Two tools
   * also write `<h2>` for other jobs — `ModernISCurve`'s two-axis comparison
   * labels, `IsLmExplorer`'s lesson sub-headings and `chart-title` — and those
   * are deliberately smaller, because they are not sections and should not
   * look like them. Asserting over every `<h2>` would have demanded they match
   * a section title, which is the opposite of what makes them legible.
   *
   * `tags` is the positive control: a pattern that matched no section title
   * leaves it at zero and every `offenders` list below is empty.
   */
  it('sets every section title the way the other section titles are set', () => {
    const offenders: string[] = []
    let tags = 0
    for (const file of toolFiles) {
      const source = stripComments(toolSource(file))
      for (const m of source.matchAll(/<h2\b[^>]*>/g)) {
        const cls = m[0].match(/className="([^"]*)"/)?.[1] ?? ''
        if (!/\btext-lg\b/.test(cls) || !/\bfont-semibold\b/.test(cls)) continue
        tags++
        if (!/\btracking-tight\b/.test(cls)) {
          offenders.push(`${file}: section title "${cls}" is not tracking-tight`)
        }
      }
    }
    expect(tags, 'no section title was found in any tool, so the scan was vacuous').toBeGreaterThan(0)
    expect(offenders, 'section titles of one role, set two ways').toEqual([])
  })

  /**
   * The positive control for the assertion above, and the reason the `h3` is
   * allowed to exist at all.
   *
   * `ToolComponents` is the one place a tool's `h3` may be written, and it
   * writes it twice: `ToolNote`'s title (the `headingLevel` default of 3) and
   * `ToolHeader`'s own title when a tool is embedded in a lecture, where the
   * lecture's "Try it" is already an `h2`. Both are asserted to be PRESENT,
   * because a rule expressed only as a prohibition is a rule a later agent can
   * satisfy by deleting the thing that is allowed. If someone promoted the
   * note's title to `h2` and deleted the conditional in the header to make
   * this green, the note would be a peer of the section it sits in and every
   * lecture would have a duplicate `h1` again.
   */
  it('leaves the h3 to ToolComponents, and keeps the two it needs there', () => {
    const levels = headingLevels(TOOL_COMPONENTS)
    // `ToolNote`: one `h2` and one `h3`, chosen by `headingLevel`. `ToolHeader`:
    // an `h1`, an `h2` and an `h3`, chosen by the page the tool is on.
    expect(
      levels.filter((l) => l === 3).length,
      'the note title and the embedded-tool title',
    ).toBe(2)
    expect(
      levels.filter((l) => l === 2).length,
      'the note title and the case-study tool title',
    ).toBe(2)
    expect(levels.filter((l) => l === 1).length, 'the one h1 a tool page owns').toBe(1)
  })
})

/* ------------------------------------------------------------------ *
 * The axis
 * ------------------------------------------------------------------ */

describe('the axis is re-measured when the reader changes the text size', () => {
  function Probe() {
    // Shaped exactly like a tool: `useChartTextScaleSignal()` re-renders the
    // component when the reader's text size changes, and the key is read in
    // THAT component's render. If the scale is not in the key, the key does
    // not change, React does not remount, and Recharts goes on using the
    // font size it measured when the chart first opened. Subscribing inside
    // a child would re-render the child and not the component that reads the
    // key, which is why the hook returns nothing.
    useChartTextScaleSignal()
    return (
      <div>
        <span data-testid="x-key">{chartTheme.axisKey('x')}</span>
        <span data-testid="y-key">{chartTheme.axisKey('y')}</span>
      </div>
    )
  }

  it('changes the key when the preference changes, and keeps the two apart', () => {
    usePreferences.setState({ textScale: 1 })
    render(<Probe />)
    const beforeX = screen.getByTestId('x-key').textContent
    const beforeY = screen.getByTestId('y-key').textContent
    expect(beforeX).not.toBe(beforeY)
    act(() => usePreferences.setState({ textScale: 1.3 }))
    expect(screen.getByTestId('x-key').textContent).not.toBe(beforeX)
    expect(screen.getByTestId('y-key').textContent).not.toBe(beforeY)
    expect(screen.getByTestId('x-key').textContent).not.toBe(screen.getByTestId('y-key').textContent)
  })

  it('is read fresh on every access, so the axis is not skipped by a shallow prop compare', () => {
    // `CartesianAxis.shouldComponentUpdate` shallow-compares its props, and
    // `tick` is a nested object. A shared literal would let the axis skip the
    // render entirely when the reader's preferences had changed, so the
    // object has to be new on every read.
    expect(chartTheme.axis).not.toBe(chartTheme.axis)
    expect(chartTheme.yAxis).not.toBe(chartTheme.yAxis)
    expect(chartTheme.axis).not.toBe(chartTheme.yAxis)
  })

  it('separates the y axis from the x axis, and every tool asks for the right one', () => {
    expect(chartTheme.yAxis, 'a tool spreading `axis` onto a <YAxis> is the bug').toBeDefined()
    for (const file of toolFiles) {
      const source = toolSource(file)
      const yTags = (source.match(/<YAxis\b/g) ?? []).length
      const ySpreads = (source.match(/\{\.\.\.chartTheme\.yAxis\}/g) ?? []).length
      const xTags = (source.match(/<XAxis\b/g) ?? []).length
      const xSpreads = (source.match(/\{\.\.\.chartTheme\.axis\}/g) ?? []).length
      expect(ySpreads, `${file} <YAxis> count`).toBe(yTags)
      expect(xSpreads, `${file} <XAxis> count`).toBe(xTags)
    }
  })
})

/* ------------------------------------------------------------------ *
 * A domain that contains its data
 * ------------------------------------------------------------------ */

describe('a chart axis domain contains what the chart draws', () => {
  it('snaps outward to round numbers and never below the data', () => {
    // Containment plus roundness, asserted as PROPERTIES rather than as exact
    // tuples, because the exact step depends on the span: a test that pins a
    // tuple fails on a retune of the ladder instead of on a defect.
    const cases = [
      [101, 209],
      [-413, 87],
      [412, 480],
      [0.04, 0.11],
      [1234, 5678],
    ]
    for (const [dataLow, dataHigh] of cases) {
      const [lo, hi] = dataDomain([dataLow, dataHigh])
      expect(lo, `low bound for ${dataLow}..${dataHigh}`).toBeLessThanOrEqual(dataLow)
      expect(hi, `high bound for ${dataLow}..${dataHigh}`).toBeGreaterThanOrEqual(dataHigh)
    }
  })

  it('includes zero only when asked, because zero is a real value only sometimes', () => {
    const [lo, hi] = dataDomain([412, 480])
    expect(lo).toBe(400)
    expect(hi).toBeGreaterThan(480)
    const [zeroLo, zeroHi] = dataDomain([412, 480], { includeZero: true })
    expect(zeroLo, 'a zero-pinned domain never pads past zero').toBe(0)
    expect(zeroHi).toBeGreaterThanOrEqual(480)
  })

  it('pads a little, so a line on the frame is not mistaken for a clipped one', () => {
    // A series whose maximum lands on a snapped boundary puts the line ON the
    // frame, and a line on the frame is indistinguishable from a line that
    // was clipped there — the exact ambiguity this module exists to remove.
    expect(dataDomain([0, 500], { pad: 0 })).toEqual([0, 500])
    const padded = dataDomain([0, 500])
    expect(padded[1]).toBeGreaterThan(500)
    expect(padded[1], 'the pad costs no more than one step').toBeLessThanOrEqual(600)
  })

  it('takes EVERY series, so a second line cannot leave the frame behind the first', () => {
    const one = dataDomain([100, 200])
    const both = dataDomain([[100, 200], [400, 900]])
    expect(both[1]).toBeGreaterThan(one[1])
  })

  it('survives the inputs a chart really hands it', () => {
    expect(dataDomain([])).toEqual([0, 1])
    expect(dataDomain([7])[1]).toBeGreaterThan(7)
    expect(dataDomain([5, 5])[0]).toBeLessThan(5)
    // Non-finite values come from a division by zero in a tool's own maths
    // and must not poison the domain with NaN.
    const safe = dataDomain([1, 2, Number.NaN, Number.POSITIVE_INFINITY])
    expect(Number.isFinite(safe[0])).toBe(true)
    expect(Number.isFinite(safe[1])).toBe(true)
    expect(safe[0]).toBeLessThanOrEqual(1)
  })

  it('uses a countable step, so a tick label is a number a reader can compare', () => {
    expect(niceStep(0.37)).toBe(0.5)
    expect(niceStep(7)).toBe(10)
    // 21.8 normalises to 2.18, and without a 2.5 rung the ladder jumps that
    // to 50 — a domain of [100, 250] for data living in [101, 209].
    expect(niceStep(21.8)).toBe(25)
    expect(niceStep(23)).toBe(25)
    expect(niceStep(60)).toBe(100)
    expect(niceStep(0)).toBe(1)
    expect(niceStep(Number.NaN)).toBe(1)
  })

  it('replaced every `allowDataOverflow` in the app, and pinned nothing to a data range', () => {
    // `allowDataOverflow` does not extend an axis; it tells Recharts to
    // generate ticks only inside the domain, and a series that leaves the
    // range is drawn past the plot edge and clipped with nothing on screen
    // saying so. There were five uses, all in one tool.
    for (const file of toolFiles) {
      expect(stripComments(toolSource(file)), `${file} still uses allowDataOverflow`).not.toMatch(
        /allowDataOverflow/,
      )
    }
  })

  it('leaves no chart in the IS-LM tool with a hard-coded domain', () => {
    const source = toolSource('IsLmExplorer.tsx')
    expect(source).not.toMatch(/domain=\{\[\s*\d/)
    // And the two rate axes are pinned to the range the curves are SAMPLED
    // over, which is a property of the model rather than a guess.
    expect(source).toMatch(/const IS_RATE_RANGE: \[number, number\] = \[0, 25\]/)
    expect(source).toMatch(/const LM_RATE_RANGE: \[number, number\] = \[0, 20\]/)
    // The equilibrium is drawn, not only printed: it used to be a number in
    // a chip that the axis could not contain.
    expect((source.match(/<ReferenceDot/g) ?? []).length).toBeGreaterThanOrEqual(2)
  })

  it('formats the IS-LM diagram tooltip to the same precision as every other chart', () => {
    const source = toolSource('IsLmExplorer.tsx')
    // The D5 defect: this tooltip was the only one in the tool with no
    // `formatter`, so `r` printed as a bare `3.5` where the other charts
    // printed `3.50` and a unit.
    const tooltips = [...source.matchAll(/<Tooltip\b([\s\S]*?)\/>/g)].map((m) => m[1])
    expect(tooltips.length).toBeGreaterThanOrEqual(3)
    for (const t of tooltips) {
      expect(t, 'an IS-LM tooltip without a formatter').toMatch(/formatter=/)
      expect(t, 'a rate tooltip without a labelFormatter').toMatch(/labelFormatter=/)
    }
    expect(source).toMatch(/const asRate = \(value: number\) => `\$\{value\.toFixed\(2\)\}%`/)
  })

  it('gives the two lines in the IS-LM diagram different data keys', () => {
    // Four lines, one field. `dataKey="r"` on all of them is legal in
    // Recharts and ambiguous everywhere else: the tooltip's rows all claim
    // the same key, which is what made the shared tooltip's React key
    // collide.
    const source = toolSource('IsLmExplorer.tsx')
    const diagram = source.slice(source.indexOf('IS-LM Diagram'))
    const keys = [...diagram.matchAll(/<ChartLine[\s\S]*?dataKey="([^"]+)"/g)].map((m) => m[1])
    expect(keys).toContain('yIS')
    expect(keys).toContain('yLM')
    expect(keys).not.toContain('r')
  })
})

/* ------------------------------------------------------------------ *
 * The zero baseline
 * ------------------------------------------------------------------ */

describe('the zero baseline is applied where zero is the question, and nowhere else', () => {
  const BASELINED = ['PhillipsCurve.tsx', 'PhillipsCurveTradeOff.tsx', 'RealInterestRateCalculator.tsx']

  it('is on the charts whose sign is the finding, and on no others', () => {
    const applied: string[] = []
    for (const file of toolFiles) {
      const n = (toolSource(file).match(/\{\.\.\.chartTheme\.baseline\}/g) ?? []).length
      for (let i = 0; i < n; i += 1) applied.push(file)
    }
    expect([...new Set(applied)].sort()).toEqual([...BASELINED].sort())
    // Three charts in the interest-rate tool, one each in the two
    // Phillips-curve tools. Counted, because "a baseline was added" is not
    // the same claim as "the right number of them were".
    expect(applied.length).toBe(5)
  })

  it('is a solid line at the border strength, distinct from a dashed threshold', () => {
    // A fact about the data and an annotation about the data are not the
    // same mark, so they differ in dash as well as in weight — which means
    // they are still tellable apart when a reader cannot separate
    // `--border-strong` from `--fg-subtle`.
    expect(chartTheme.baseline).toEqual({ stroke: 'var(--c-border-strong)', strokeWidth: 1.5 })
    const reference = chartTheme.reference as unknown as Record<string, unknown>
    expect(reference.strokeDasharray, 'a threshold line is dashed').toBe('4 4')
    expect(chartTheme.baseline).not.toHaveProperty('strokeDasharray')
    expect(chartTheme.baseline.stroke).not.toBe(reference.stroke)
  })
})

/* ------------------------------------------------------------------ *
 * The legend is a control
 * ------------------------------------------------------------------ */

describe('a legend item is a button a keyboard can reach', () => {
  function Harness({ onShowAll }: { onShowAll?: () => void }) {
    const [keys] = useState(() => ['IS', 'LM'])
    const series = useHiddenSeries(keys)
    return (
      <div>
        <ChartLegend
          items={[
            { key: 'IS', label: 'IS Curve', color: 'var(--c-series-1)' },
            { key: 'LM', label: 'LM Curve', color: 'var(--c-series-2)' },
          ]}
          hidden={series.hidden}
          onToggle={series.toggle}
          onShowAll={onShowAll}
        />
        <span data-testid="hidden">{series.hidden.join(',')}</span>
      </div>
    )
  }

  it('is a real button with a stable name and a pressed state that means VISIBLE', () => {
    render(<Harness />)
    const is = screen.getByRole('button', { name: 'IS Curve' })
    const lm = screen.getByRole('button', { name: 'LM Curve' })
    // The accessible name does not change with the state, so the control is
    // one button and not two. The other polarity reads as "this button is
    // currently hiding IS Curve".
    expect(is).toHaveAttribute('aria-pressed', 'true')
    expect(lm).toHaveAttribute('aria-pressed', 'true')
    expect(is.tagName).toBe('BUTTON')
    fireEvent.click(is)
    expect(is).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'IS Curve' })).toHaveTextContent('IS Curve')
  })

  it('marks the hidden series in a way that does not depend on colour', () => {
    // Colour is the signal a reader with two series close in luminance
    // cannot use, so the strike is the state. `.chart-legend-item.is-active`
    // is asserted in the stylesheet test below; this is the class the
    // component actually emits.
    render(<Harness />)
    const is = screen.getByRole('button', { name: 'IS Curve' })
    expect(is.className).not.toMatch(/is-inactive/)
    fireEvent.click(is)
    expect(is.className).toMatch(/is-inactive/)
  })

  it('offers a way back, and the way back is only there when it is needed', () => {
    const { rerender } = render(<Harness />)
    expect(screen.queryByRole('button', { name: 'Show all' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'IS Curve' }))
    rerender(<Harness onShowAll={() => {}} />)
    expect(screen.getByRole('button', { name: 'Show all' })).toBeTruthy()
  })

  it('drops a key whose series has left the chart, so nothing hides by accident', () => {
    function Switching() {
      const [keys, setKeys] = useState(() => ['IS', 'LM'])
      const series = useHiddenSeries(keys)
      return (
        <div>
          <button onClick={() => setKeys(['LM'])}>scenario</button>
          <ChartLegend
            items={[{ key: 'IS', label: 'IS Curve', color: 'var(--c-series-1)' }]}
            hidden={series.hidden}
            onToggle={series.toggle}
          />
          <span data-testid="hidden">{series.hidden.join(',')}</span>
        </div>
      )
    }
    render(<Switching />)
    fireEvent.click(screen.getByRole('button', { name: 'IS Curve' }))
    expect(screen.getByTestId('hidden')).toHaveTextContent('IS')
    fireEvent.click(screen.getByRole('button', { name: 'scenario' }))
    // A tool that switches scenario replaces its series, and a stale key
    // would hide whatever took its place.
    expect(screen.getByTestId('hidden')).toHaveTextContent('')
  })

  it('states in the component that the three wirings are all required together', () => {
    // A half-wired legend is worse than no legend, so the contract is written
    // down where the next reader of a chart will find it.
    for (const needle of ['hide={isHidden(key)}', 'includeHidden', 'drops any row carrying']) {
      expect(CHART_LEGEND.replace(/\s+/g, ' '), needle).toContain(needle.replace(/\s+/g, ' '))
    }
  })

  it('pins the domain on every chart that has one, so a hide cannot rescale the plot', () => {
    // This is the decision the primitive had to make and the one thing a
    // reader cannot see is wrong: Recharts derives an auto-domain from the
    // VISIBLE series, so without `includeHidden`, hiding one of two series
    // re-scales both axes and every remaining series appears to move.
    for (const file of toolFiles) {
      const source = toolSource(file)
      if (!source.includes('ChartLegend')) continue
      expect(source, `${file} legend without includeHidden`).toMatch(/includeHidden/)
      // Comment-stripped, because the note explaining the wiring quotes the
      // prop it is describing.
      const bare = stripComments(source)
      expect((bare.match(/\{\.\.\.chartTheme\.(?:axis|yAxis)\}/g) ?? []).length,
        `${file} axes without includeHidden`).toBe(
        (bare.match(/includeHidden/g) ?? []).length,
      )
    }
  })

  it('keeps the tooltip from claiming a value for a series the plot has dropped', () => {
    // Recharts' `getTooltipContent` walks EVERY graphical item, hidden ones
    // included, and stamps `hide` on the entry, so the shared tooltip has to
    // drop the row itself. Without this a legend toggle leaves a row
    // asserting a value the chart is no longer drawing.
    expect(CHART_TOOLTIP).toMatch(/entry\.type !== 'none' && !entry\.hide/)
  })

  it('replaced Recharts\u2019 inert legend on the charts that have one', () => {
    // Recharts renders a `<li>` with no tabindex, no role and no handler,
    // so a legend was a list of names that nothing could act on and no
    // keyboard could reach: eighteen of them across eleven tools. Three tools
    // were converted first and the rest after.
    //
    // The pinned list below is the finished set, and the assertion that
    // actually matters is the one after it — that ZERO tools still render an
    // inert legend. A list of three was true when it was written and would
    // have gone quietly false as the rest of the work landed, which is the
    // property of this test worth fixing: a snapshot of progress is not a
    // statement about the code.
    const converted = toolFiles.filter((f) => toolSource(f).includes('ChartLegend')).sort()
    expect(converted).toEqual([
      'FiscalPolicyExperiments.tsx',
      'GrowthAccounting.tsx',
      'IsLmExplorer.tsx',
      'IsLmPcDynamics.tsx',
      'LaborMarket.tsx',
      'LaborMarketWsPs.tsx',
      'ModernISCurve.tsx',
      'MundellFleming.tsx',
      'PhillipsCurve.tsx',
      'PhillipsCurveTradeOff.tsx',
      'RealInterestRate.tsx',
      'RealInterestRateCalculator.tsx',
      'SolowSimulator.tsx',
      'SpeculativeAttack.tsx',
    ])
    for (const file of toolFiles) {
      expect(toolSource(file), `${file} still renders Recharts' inert <Legend>`).not.toMatch(
        /<Legend\b/,
      )
    }
    // One primitive per chart, not per tool, so two charts on one page cannot
    // hide each other's series.
    expect((toolSource('MundellFleming.tsx').match(/<ChartLegend/g) ?? []).length).toBe(2)
    expect((toolSource('SolowSimulator.tsx').match(/<ChartLegend/g) ?? []).length).toBe(2)
    expect((toolSource('RealInterestRateCalculator.tsx').match(/<ChartLegend/g) ?? []).length).toBe(3)
    // And the four-series AreaChart in the open-economy tool, which had no
    // legend at all.
    expect(toolSource('MundellFleming.tsx')).not.toMatch(/<Legend\b/)
  })
})

/* ------------------------------------------------------------------ *
 * The stylesheet
 * ------------------------------------------------------------------ */

describe('the legend and the slider target are drawn, not just declared', () => {
  it('strikes the hidden label through, and gives the chip a focus ring', () => {
    expect(decl('.chart-legend-item.is-inactive .chart-legend-label', 'text-decoration')).toBe(
      'line-through',
    )
    expect(decl('.chart-legend-item:focus-visible', 'outline')).toContain('var(--c-accent)')
    // A pill, so the target is not a 2px rule.
    expect(decl('.chart-legend-item', 'border-radius')).toBe('var(--radius-pill)')
    expect(decl('.chart-legend-item', 'border')).toContain('1px')
    // Density-bound, so a legend row is spaced by the reader's preference.
    expect(decl('.chart-legend', 'gap')).toContain('var(--space-')
  })

  it('buys a 24px target on a 4px track without moving the panel', () => {
    // The technique, and the reason for each of the four declarations:
    // padding makes the border box taller (a range input's hit area is its
    // border box), the negative block margin takes the height back out of
    // the flow, `background-clip: content-box` keeps the padding invisible,
    // and `box-sizing: content-box` is what stops Tailwind's preflight from
    // making `height: 4px` the border box — which under `border-box` left
    // the content box at 0 and the gradient painted into nothing.
    expect(decl('.slider-input', 'padding-block')).toBe('10px')
    expect(decl('.slider-input', 'margin-block')).toBe('-10px')
    expect(decl('.slider-input', 'background-clip')).toBe('content-box')
    expect(decl('.slider-input', '-webkit-background-clip')).toBe('content-box')
    expect(decl('.slider-input', 'box-sizing')).toBe('content-box')
    // 4 + 2x10 - 2x10 = 4: the margin box the layout consumes is what it
    // was before any of this.
    const padding = Number.parseFloat(decl('.slider-input', 'padding-block'))
    const margin = Number.parseFloat(decl('.slider-input', 'margin-block'))
    const height = Number.parseFloat(decl('.slider-input', 'height'))
    expect(height + 2 * padding + 2 * margin).toBe(height)
    // And the track is still 4px, which is the whole reason for the clip.
    expect(decl('.slider-input', 'height')).toBe('4px')
    // A vertical swipe still scrolls the page, so the taller target does
    // not cost a phone its scroll.
    expect(decl('.slider-input', 'touch-action')).toBe('pan-y')
    // `background`, not `background-image`, would reset the clip declared
    // above it; the shorthand appearing after the clip is the bug.
    const body = ruleBody('.slider-input')
    expect(body.indexOf('background-clip'), 'background-clip must precede the background').toBeLessThan(
      body.indexOf('background-image'),
    )
    expect(body, 'the shorthand background would undo background-clip').not.toMatch(/[\s;]background:/)
  })
})

/* ------------------------------------------------------------------ *
 * Controls
 * ------------------------------------------------------------------ */

describe('a control is labelled, live, and typed into safely', () => {
  it('associates the label with the input by an id that is unique per instance', () => {
    // The id used to be derived from the label text, which is a duplicate-id
    // factory: seventeen tool files declare the same label twice, and
    // `IsLmExplorer` alone has two "Government Spending (G)" sliders, so the
    // second control's visible label pointed at the FIRST input and clicking
    // it moved the other slider.
    render(
      <>
        <SliderControl label="Government Spending (G)" value={100} min={50} max={200} onChange={() => {}} />
        <SliderControl label="Government Spending (G)" value={120} min={50} max={200} onChange={() => {}} />
      </>,
    )
    const inputs = screen.getAllByLabelText('Government Spending (G)') as HTMLInputElement[]
    expect(inputs).toHaveLength(2)
    expect(inputs[0].id).not.toBe(inputs[1].id)
    expect(inputs[0].value).toBe('100')
    expect(inputs[1].value).toBe('120')
  })

  it('declares min, max and step, so the native keyboard behaviour lands on sensible values', () => {
    render(<SliderControl label="Beta" value={10} min={2} max={20} step={0.5} onChange={() => {}} />)
    const input = screen.getByLabelText('Beta') as HTMLInputElement
    expect(input.type).toBe('range')
    expect(input.min).toBe('2')
    expect(input.max).toBe('20')
    expect(input.step).toBe('0.5')
  })

  it('carries the unit and the printed precision in aria-valuetext', () => {
    // A native range exposes `aria-valuenow`, so the number is already in
    // the accessibility tree — as a bare number, with no unit, so a reader
    // hears "50" for the money supply, the price level and the output.
    render(
      <SliderControl
        label="Money Supply (M)"
        value={150}
        min={50}
        max={250}
        unit="units"
        decimals={0}
        onChange={() => {}}
      />,
    )
    const input = screen.getByLabelText('Money Supply (M)')
    expect(input).toHaveAttribute('aria-valuetext', '150 units')
  })

  it('does not let a non-finite value into the model', () => {
    // jsdom coerces an invalid `value` on a range input to the midpoint
    // before the event fires, so the guard is exercised through the
    // component's own handler rather than through a synthetic event value.
    const seen: number[] = []
    render(<SliderControl label="G" value={100} min={50} max={200} onChange={(v) => seen.push(v)} />)
    const input = screen.getByLabelText('G') as HTMLInputElement
    fireEvent.change(input, { target: { value: '180' } })
    expect(seen).toEqual([180])
    const source = readFileSync(join(SRC, 'components', 'ToolComponents.tsx'), 'utf8')
    expect(source, 'the range handler must guard on isFinite').toMatch(
      /Number\.isFinite\(next\)\) onChange\(next\)/,
    )
  })

  it('keeps the printed value out of the accessibility tree, so it is not announced twice', () => {
    // `<output>` carries an implicit `role="status"`, so leaving it live
    // would announce every value a slider passes through on the way to the
    // one the reader wanted — on a 0.1 step from 0.5 to 2.0, fifteen
    // announcements.
    render(<SliderControl label="G" value={100} min={50} max={200} onChange={() => {}} />)
    const group = screen.getByLabelText('G').closest('.control-group')!
    expect(group.querySelector('output')).toHaveAttribute('aria-hidden', 'true')
  })

  it('refuses to commit a typed value that is out of range, rather than clamping it', () => {
    // The version this replaces was `onChange(parseFloat(e.target.value))`,
    // and `parseFloat('')` is `NaN` — so selecting a number to retype it
    // pushed `NaN` into the model, and from there into every derived series
    // and every readout on the page. `NumberInput` is not used by any tool
    // today, so this is the shared control's own guarantee rather than a
    // regression in a page.
    expect(TOOL_COMPONENTS).toMatch(/Number\.isFinite\(next\)/)
    const seen: number[] = []
    render(
      <NumberInput
        label="Y"
        value={650}
        min={0}
        max={800}
        step={5}
        onChange={(v) => seen.push(v)}
      />,
    )
    const input = screen.getByLabelText('Y') as HTMLInputElement
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.change(input, { target: { value: '-5' } })
    expect(seen, 'an empty or negative-then-typed field must not commit').toEqual([])
    fireEvent.change(input, { target: { value: '900' } })
    // Clamping would move the chart to 800 while the field reads 900: a
    // number the reader did not enter, with nothing on screen saying so.
    expect(seen).toEqual([])
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Enter a value between 0 and 800')).toBeTruthy()
    fireEvent.blur(input)
    // Tabbing away reconciles the field to what the model actually holds.
    expect(input.value).toBe('650')
  })

  it('gives every button an explicit type, so a control panel cannot submit a form', () => {
    render(<ToolControlBar onReset={() => {}} dirty />)
    const reset = screen.getByRole('button', { name: /Reset to defaults/ })
    expect(reset).toHaveAttribute('type', 'button')
    expect(reset).toHaveClass('button-secondary')
  })
})

/* ------------------------------------------------------------------ *
 * Reset
 * ------------------------------------------------------------------ */

describe('a tool offers one reset, and it returns to the tool\u2019s real defaults', () => {
  it('is present in all twenty tools, in the same component, as a secondary action', () => {
    expect(toolFiles).toHaveLength(20)
    for (const file of toolFiles) {
      const source = toolSource(file)
      expect(source, `${file} has no reset`).toMatch(/<ToolControlBar\b/)
      expect(source, `${file} reset without the shared hook`).toMatch(/useToolReset\(/)
      // One copy of the defaults: the old resets re-typed every value next
      // to the `useState` that already held it, and the copy that was
      // edited during a model change was the one nobody edits.
      expect((source.match(/useState\(\s*DEFAULTS\./g) ?? []).length, `${file} initialisers`).toBeGreaterThan(1)
      expect(source, `${file} has a hand-written reset left over`).not.toMatch(/resetToDefault/)
    }
    // No tool builds its own reset button any more.
    for (const file of toolFiles) {
      expect(toolSource(file), `${file} still has an ad-hoc reset button`).not.toMatch(
        /Reset All/,
      )
    }
  })

  it('derives `dirty` rather than tracking it, so a control returned by hand disables the button', () => {
    function Harness() {
      const [g, setG] = useState(100)
      const { reset, dirty } = useToolReset({ g }, { setG }, { g: 100 })
      return (
        <div>
          <span data-testid="g">{g}</span>
          <ToolControlBar onReset={reset} dirty={dirty} />
        </div>
      )
    }
    render(<Harness />)
    const reset = screen.getByRole('button', { name: /Reset to defaults/ })
    expect(reset).toBeDisabled()
    act(() => fireEvent.click(reset))
    expect(screen.getByTestId('g')).toHaveTextContent('100')
  })

  it('sends every control in its record back, and leaves the panel enabled while it is clean', () => {
    const seen: number[] = []
    function Harness() {
      const [a, setA] = useState(1)
      const [b, setB] = useState(2)
      const [c, setC] = useState(3)
      const { reset, dirty } = useToolReset(
        { a, b, c },
        { setA, setB, setC },
        { a: 1, b: 2, c: 3 },
      )
      return (
        <div>
          <span data-testid="v">{`${a}${b}${c}`}</span>
          <button onClick={() => setB(9)}>move</button>
          <button onClick={() => { seen.push(a, b, c); reset() }}>reset</button>
          <span data-testid="dirty">{String(dirty)}</span>
        </div>
      )
    }
    render(<Harness />)
    expect(screen.getByTestId('dirty')).toHaveTextContent('false')
    fireEvent.click(screen.getByRole('button', { name: 'move' }))
    expect(screen.getByTestId('v')).toHaveTextContent('193')
    expect(screen.getByTestId('dirty')).toHaveTextContent('true')
    fireEvent.click(screen.getByRole('button', { name: 'reset' }))
    expect(seen).toEqual([1, 9, 3])
    expect(screen.getByTestId('v')).toHaveTextContent('123')
    expect(screen.getByTestId('dirty')).toHaveTextContent('false')
  })
})
