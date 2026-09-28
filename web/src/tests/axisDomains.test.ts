import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chartTheme } from '../design/chartTheme'

/**
 * What an axis has to contain, and what it has to be able to say.
 *
 * THE DEFECT: a tile, a caption or a mark on a tool page reporting a value
 * its own chart's axis does not contain. It is the worst class in the tools
 * because the two halves of the page disagree without either looking broken.
 * It is also invisible in a snapshot, and mostly invisible to a single-slider
 * pass, because the domain usually contains one slider's extreme and not the
 * next one's — the two halves only part company at a COMBINATION.
 *
 * WHAT jsdom CAN SEE, and therefore what this file asserts:
 *
 *   1. that an axis LABEL's size is a token the reader's text scale reaches,
 *      applied by one rule scoped to the axis, because a rotated y label's
 *      LENGTH is measured against half the plot box and the browser's 16px
 *      put eight of them over it;
 *   2. that the shared axis-props object does not carry a `label` key, which
 *      every tool's own `label` prop would silently overwrite — the one that
 *      would look like a fix and do nothing;
 *   3. that no axis in the tools declares a numeric domain without saying why
 *      that bound is safe;
 *   4. that a rotated CATEGORY label is vertical, since a diagonal one's
 *      footprint grows with its length and a vertical one's does not;
 *   5. that a rotated y label is short enough to fit half a plot.
 *
 * WHAT IT CANNOT, and why the geometry lives in a browser: `setup.ts` stubs
 * `ResizeObserver` as a no-op, so `ResponsiveContainer` never gets a size,
 * Recharts draws nothing, and there is no box to measure. Every geometric
 * number quoted in these comments was measured in Chromium against the
 * production build, at 1280px and 390px, at textScale 1.0 and 1.3. The
 * invariants below are the source-level shapes those measurements said were
 * load-bearing; they cannot be re-derived here, and pretending otherwise
 * would be the pinned-total mistake.
 */

const SRC = join(__dirname, '..')
const TOOLS = join(SRC, 'tools')
const RAW_CSS = readFileSync(join(SRC, 'index.css'), 'utf8')
/**
 * The same file with its comments removed, and every CSS assertion below reads
 * THIS rather than the raw text.
 *
 * Not tidiness: the comment that explains the axis-label rule quotes the rule
 * verbatim, quotes the selector, and names `g.recharts-cartesian-axis` in
 * prose. A regex over the raw file therefore finds a "rule" whose selector is a
 * paragraph and which tests as scoped, and the assertion that the rule is
 * scoped to the axis passes whether or not the real rule is — which is exactly
 * how it behaved the first time this was written, and the only reason a
 * mutation that deleted the scope came back green.
 */
const CSS = RAW_CSS.replace(/\/\*[\s\S]*?\*\//g, '')
const toolFiles = readdirSync(TOOLS).filter((f) => f.endsWith('.tsx'))
const toolSource = (file: string): string => readFileSync(join(TOOLS, file), 'utf8')

/**
 * One cartesian axis element, as source.
 *
 * Every `<XAxis>` and `<YAxis>` in the tools is self-closing, so the first
 * `/>` after the opening tag ends the element — and the opening tag and its
 * `/>` count are asserted equal to the element count in the test below, so a
 * tool that adopts a non-self-closing axis fails the test rather than
 * silently shortening every element after it to the next axis.
 */
interface AxisElement {
  file: string
  tag: 'XAxis' | 'YAxis'
  /** Offset of `<XAxis` in the file, for looking backwards. */
  at: number
  text: string
}

const axisElements = (file: string): AxisElement[] => {
  const source = toolSource(file)
  const out: AxisElement[] = []
  for (const m of source.matchAll(/<(XAxis|YAxis)\b/g)) {
    const rest = source.slice(m.index + m[0].length)
    const end = rest.indexOf('/>')
    if (end === -1) continue
    out.push({ file, tag: m[1] as 'XAxis' | 'YAxis', at: m.index, text: rest.slice(0, end) })
  }
  return out
}

const allAxes = (): AxisElement[] => toolFiles.flatMap(axisElements)

/**
 * The element with its `label` prop removed.
 *
 * A comment inside `label={{ … }}` is a comment about the label, and a test
 * that accepted one would be satisfied by a file that had thought about its
 * axis label and nothing else — which is the state every one of these bounds
 * was in. What has to be on the record is the reason for the BOUND.
 */
const withoutLabelProp = (text: string): string => text.replace(/label=\{\{[\s\S]*?\}\}/g, 'label={…}')

describe('the axis label, and the bound a rotated one has to fit', () => {
  it('sizes the axis label from a token the reader text scale reaches', () => {
    // Four numbers govern the size of chart text, and the axis LABEL was not
    // one of them: every one of the 41 axes writes its own `label={{ … }}` and
    // none of them wrote a `fontSize`, so each inherited the browser's 16px —
    // larger than the 11px ticks it names, and the only text on a chart that
    // ignored `--pref-text-scale` in both directions at once. A reader at 130%
    // got 20.8px axis labels and 14.3px ticks.
    const token = /--chart-axis-label-size:\s*([^;]+);/.exec(CSS)
    expect(token, '--chart-axis-label-size must be defined in index.css').not.toBeNull()
    // A bare px would be a chart type the reader cannot change, which is the
    // defect again in a different key. `max()` of a px floor and a rem is the
    // form `--chart-tick-size` already uses, and it is why the value is
    // asserted by SHAPE rather than by the number: the number is a legibility
    // choice and the shape is the contract.
    expect(token![1], 'the axis-label size must scale with the reader text size').toMatch(
      /max\([^)]*rem/,
    )
    // The tick size is the same token's neighbour, and the label must not be a
    // different size from the numbers it names: a label at a different size
    // reads as a different kind of object.
    expect(token![1].replace(/\s+/g, '')).toBe(
      /--chart-tick-size:\s*([^;]+);/.exec(CSS)![1].replace(/\s+/g, ''),
    )
  })

  it('applies that token to the axis LABEL, and to nothing else', () => {
    // Recharts puts the SAME `recharts-label` class on a ReferenceLine's
    // label, and those carry an explicit `fontSize: 12` as a presentation
    // attribute — which a CSS declaration outranks. An unscoped
    // `.recharts-label` rule would therefore restyle every dashed threshold
    // label on the site to a size nobody chose, which is why the selector
    // names the axis: a reference label is inside `g.recharts-reference-line`
    // and an axis label inside `g.recharts-cartesian-axis`, so the axis is
    // reachable on its own.
    const rules = [...CSS.matchAll(/([^{}]*\.recharts-label[^{}]*)\{([^}]*)\}/g)].map((m) => ({
      selector: m[1].trim(),
      body: m[2],
    }))
    expect(rules.length, 'a rule that applies the axis-label size').toBeGreaterThan(0)
    const scoped = rules.filter((r) => /\.recharts-cartesian-axis\b/.test(r.selector))
    expect(
      scoped.length,
      `the rule must be scoped to the cartesian axis, and the rules found were ${JSON.stringify(rules.map((r) => r.selector))}`,
    ).toBeGreaterThan(0)
    for (const rule of scoped) {
      expect(rule.body, `${rule.selector} must set the font size from the token`).toContain(
        'var(--chart-axis-label-size)',
      )
    }
    expect(
      rules.filter((r) => !/\.recharts-cartesian-axis\b/.test(r.selector)),
      'no unscoped .recharts-label rule, which would reach the reference-line labels',
    ).toEqual([])
  })

  it('keeps the size OUT of the shared axis props, where every tool would overwrite it', () => {
    // `axisProps()` is spread into every axis as `{...chartTheme.axis}` or
    // `{...chartTheme.yAxis}`, and every tool writes its own `label` BEFORE
    // the spread. A `label` key on the shared object would be clobbered by the
    // tool's own label on all 41 axes: the line would read like a fix, the
    // build would pass, and every axis label on the site would lose its text.
    // Asserted on the object rather than on the source, because the object is
    // what the tools actually consume.
    expect(chartTheme.axis, 'chartTheme.axis must not carry a label').not.toHaveProperty('label')
    expect(chartTheme.yAxis, 'chartTheme.yAxis must not carry a label').not.toHaveProperty('label')
    // The coupling that makes it load-bearing, so the reason above cannot rot
    // into "a label key is fine now": a tool that spread first and labelled
    // second would change the answer, and the next reader deserves to know
    // which convention the file is on.
    const labelled = toolFiles.filter((f) =>
      /label=\{\{[\s\S]*?\}\}[\s\S]*?\{\.\.\.chartTheme\.(?:yAxis|axis)\}/.test(toolSource(f)),
    )
    expect(labelled.length, 'tools that write label before the shared spread').toBeGreaterThan(0)
  })
})

describe('an axis domain is either computed from the data or says why it is not', () => {
  it('parses every axis element, so a missed axis cannot pass as a clean file', () => {
    // The scan is the whole test, so a parser that quietly found nothing would
    // report a clean site. This pins the two counts against each other.
    for (const file of toolFiles) {
      const source = toolSource(file)
      const opened = (source.match(/<XAxis\b/g) ?? []).length + (source.match(/<YAxis\b/g) ?? []).length
      const parsed = axisElements(file).length
      expect(parsed, `${file}: every cartesian axis parsed as a self-closing element`).toBe(opened)
    }
    expect(allAxes().length, 'cartesian axes found across the tools').toBeGreaterThan(20)
  })

  it('gives every numeric domain a comment that is about the bound', () => {
    // A literal `domain` is the trap this file exists for, and it is a trap
    // because of a Recharts detail that is not visible on the page: with
    // `allowDataOverflow` false — which the tools require site-wide, and
    // correctly, since the alternative clips a series past the plot edge with
    // nothing on screen saying so — a numeric `domain` is a FLOOR and a
    // CEILING rather than the drawn range, and Recharts widens it to whatever
    // the data needs. So the number in the source is not the number on the
    // axis, and at the settings where they part company there is nothing on
    // the page to say so.
    //
    // MEASURED, in Chromium on the production build: `RealInterestRateCalculator`
    // wrote `[-5, 8]` and drew `[-12, 8]` at i = -2 and inflation 10; two
    // `[-6, 6]` axes drew `[-6, 8]` because 1970s stagflation and 2022 both
    // print 8.0% inflation. `PhillipsCurve` wrote `[-3, 10]` and drew both
    // curves 27.2px outside the plot at the DEFAULTS. `LaborMarket` wrote
    // `[0, 12]` against an equilibrium of 55.56%, which Recharts'
    // `ifOverflow: 'discard'` turned into a deleted mark.
    //
    // The requirement is not "no literals" — a rate scale with a real bound
    // deserves a pin, and four of these axes have one. It is that the pin has
    // to be argued for where the next reader can find it, so that a bound
    // nobody has thought about is visible as such.
    const unjustified: string[] = []
    let literals = 0
    for (const axis of allAxes()) {
      const m = /domain=\{/.exec(axis.text)
      if (!m) continue
      // An identifier, a call, or a `'auto'` bound is not a pin: it is either
      // computed or deferred to the data. Only a pair of numbers is a claim.
      if (!/domain=\{\s*\[/.test(axis.text)) continue
      literals += 1
      const before = withoutLabelProp(axis.text).slice(0, m.index)
      if (!/\/\*|\/\//.test(before)) {
        unjustified.push(
          `${axis.file} <${axis.tag}> ${/domain=\{([^}]*)\}/.exec(axis.text)![1].trim()}`,
        )
      }
    }
    expect(literals, 'numeric axis domains across the tools').toBeGreaterThan(4)
    expect(unjustified, 'axis domains with no stated reason').toEqual([])
  })

  it('computes the bound of an axis that a slider can push out of it', () => {
    // A pin is allowed — the test above is what demands a reason for one — but
    // a bound that has to FOLLOW the data cannot be a pair of numbers, and
    // the three tools whose domains were wrong are the three where a slider
    // moves the data the axis has to contain. Asserted as a coupling rather
    // than as "no literals", because two of the three legitimately keep a
    // pinned axis: `LaborMarket`'s real-wage window is bounded by the model
    // and `PhillipsCurve`'s unemployment axis is the scale the two curves are
    // compared ALONG.
    //
    // What is asserted is that the axis carrying the tool's headline MARK is
    // computed from the value that mark reports, so the two cannot drift.
    const laborMarket = toolSource('LaborMarket.tsx')
    const unemploymentDomain = /const unemploymentDomain = dataDomain\(([\s\S]*?)\n\s*\)/.exec(
      laborMarket,
    )
    expect(unemploymentDomain, 'LaborMarket derives its unemployment axis').not.toBeNull()
    // Both marks: the NAIRU line and the equilibrium line, and the equilibrium
    // only while the model found one.
    // Fed in the axis's OWN unit. The model works in a fraction and the axis is
    // a percent, so the conversion has to happen where the value is handed over
    // — and it has to be the SAME expression the marks are drawn at, or the
    // axis and the mark it contains are in two different units and the domain
    // is quietly meaningless. This is the whole of the bug this tool had: a
    // domain pinned at [0, 12] against a mark at 55.56.
    expect(
      unemploymentDomain![1],
      'the equilibrium mark is fed in percent, the unit the axis is labelled in',
    ).toMatch(/equilibrium\.unemployment\s*\*\s*100/)
    expect(unemploymentDomain![1], 'the NAIRU mark is fed in percent too').toMatch(
      /naturalRate\s*\*\s*100/,
    )
    // And the marks themselves, so the conversion cannot be changed on one side
    // only.
    expect(laborMarket, 'the NAIRU line is drawn in percent').toContain('x={naturalRate * 100}')
    expect(laborMarket, 'the equilibrium line is drawn in percent').toContain(
      'x={equilibrium.unemployment * 100}',
    )
    expect(laborMarket, 'the axis is labelled in percent').toContain("value: 'Unemployment Rate (%)'")
    expect(
      /<XAxis[\s\S]*?domain=\{unemploymentDomain\}/.test(laborMarket),
      'the axis that carries those marks is the derived one',
    ).toBe(true)

    const phillips = toolSource('PhillipsCurve.tsx')
    const inflationDomain = /const inflationDomain = dataDomain\(([\s\S]*?)\n\s*\)/.exec(phillips)
    expect(inflationDomain, 'PhillipsCurve derives its inflation axis').not.toBeNull()
    // The two dots. The implied inflation is the one the tiles report and the
    // one that left the frame at both ends; the natural-rate marker is the one
    // Recharts DELETES rather than clips when it is out of range.
    expect(inflationDomain![1], 'the derived axis is fed the current position').toContain(
      'impliedInflation',
    )
    expect(inflationDomain![1], 'the derived axis is fed the natural-rate marker').toContain(
      'NATURAL_RATE_MARKER_Y',
    )
    expect(
      /<YAxis[\s\S]*?domain=\{inflationDomain\}/.test(phillips),
      'the axis that carries those dots is the derived one',
    ).toBe(true)

    // The third tool had three axes and all three carried a literal, none of
    // which was the axis that was drawn.
    const calculator = toolSource('RealInterestRateCalculator.tsx')
    const derived = [...calculator.matchAll(/const (\w+RateDomain) = dataDomain\(/g)].map(
      (m) => m[1],
    )
    expect(derived, 'derived rate domains in RealInterestRateCalculator').toHaveLength(3)
    for (const name of derived) {
      expect(
        new RegExp(`domain=\\{${name}\\}`).test(calculator),
        `an axis actually uses ${name}`,
      ).toBe(true)
    }
  })
})

describe('a rotated label, and the box it has to fit', () => {
  it('turns a CATEGORY label vertically, because a diagonal one cannot fit a band', () => {
    // `RealInterestRateCalculator`'s scenario bar chart rotated its five
    // category names -45deg, and at 390px the plot is 214px wide, so the
    // bands are 42.8px each. A -45 label's horizontal footprint is
    // `width x cos45`, so no amount of shortening gets a real name into
    // 42.8px: MEASURED, four overlapping pairs at gaps of -21.0, -3.8, -12.4
    // and -42.6px at textScale 1.0 and -26.8, -9.6, -18.2 and -48.4px at 1.3,
    // identical at plot heights of 300, 350 and 400px — a label's footprint is
    // a function of its LENGTH and the plot's WIDTH, not of how tall the plot
    // is. At -90 the footprint is the font size instead of the string length,
    // so 11px of label sits in a 42.8px band at every width and text size.
    //
    // 0 is fine (the axis is unrotated, as everywhere else on the site) and 90
    // is the point; the assertion is that nothing in between exists.
    const offenders: string[] = []
    for (const axis of allAxes()) {
      for (const m of axis.text.matchAll(/angle=\{(-?\d+)\}/g)) {
        const angle = Number(m[1])
        if (angle !== 0 && Math.abs(angle) !== 90) {
          offenders.push(`${axis.file} <${axis.tag}> angle={${angle}}`)
        }
      }
    }
    expect(offenders, 'diagonally rotated axis labels').toEqual([])
    // Non-vacuity: a rotated category axis exists today, and it is the one
    // this is about. If every chart became unrotated the rule would still hold
    // and would be worth nothing.
    expect(
      allAxes().filter((a) => /angle=\{-?90\}/.test(a.text)).length,
      'vertically rotated axis labels',
    ).toBeGreaterThan(0)
  })

  it('keeps a rotated y label inside half the plot box, which is 25 characters', () => {
    // A rotated y label is anchored at the axis's vertical middle and grows
    // UPWARD from that anchor, so its length is measured against half the plot
    // box, not the whole of it: 177px of a 354px plot, at every plot height,
    // which is why a taller plot never fixed one. At `--chart-axis-label-size`
    // the 130% value of 14.3px that is about 25 characters.
    //
    // MEASURED before the token existed, at 16px and 20.8px: eight labels over
    // the bound, the worst `Exchange Rate (units foreign/$)` by 126px and
    // `Unemployment Rate (fraction of labor force)` by 153px. After the size
    // change three were still over and are shortened in the tools that own
    // them; the bound below is the arithmetic, so a label that is exactly at
    // it is at the edge rather than inside it.
    const offenders: string[] = []
    let rotated = 0
    for (const axis of allAxes()) {
      if (!/angle:\s*-90/.test(axis.text)) continue
      rotated += 1
      const m = /label=\{\{[\s\S]*?value:\s*'([^']*)'/.exec(axis.text)
      if (!m) continue
      if ([...m[1]].length > 25) offenders.push(`${axis.file} <${axis.tag}> ${JSON.stringify(m[1])}`)
    }
    expect(rotated, 'rotated y-axis labels found').toBeGreaterThan(10)
    expect(offenders, 'rotated y labels longer than half a plot box').toEqual([])
  })
})
