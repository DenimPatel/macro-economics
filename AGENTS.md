# AGENTS.md

Conventions for AI agents and contributors working in this repository.

## Ground truth

- `content/lecture_notes/*.md` is the source of truth for lecture prose. Never
  duplicate it into TSX; the site renders it at build time.
- `content/lectures.ts` is the single place that maps a lecture to its tier,
  video URL, tools, concepts, mini-tools, and quiz. Update it when adding a
  lecture or tool.
- `web/src/lib/calculations.ts` holds economic formulas. Tools and tests import
  from there; don't re-derive formulas inline.
- Colour is defined once, in `web/src/index.css`, as `--c-*-ch` channel triples
  plus an azure accent, and exposed to TS through `web/src/design/tokens.ts`.
  `web/src/design/chartTheme.ts` owns chart chrome. There is no third place.

## Commands

Run from the repository root. All four of the first five are the gate.

```bash
npm run typecheck  # tsc --noEmit
npm run lint       # eslint, max-warnings 0
npm run test       # vitest run
npm run build      # tsc && vite build
npm run dev        # vite dev server (web/)
npm run preview    # serve the production build, on the real base path
```

Use `npm run preview` for anything about deployment, routing, base paths or
assets. The dev server and the built site differ in exactly the ways that
matter here.

**`npm run format` is not part of the gate, and running it is destructive.**
`web/.prettierrc` sets `printWidth: 80`; the committed style is written to
about 100. `prettier --check` therefore reports 93 files, most of them never
touched by hand, and `--write` would reformat all of them. Format the lines you
write and leave the rest alone.

**Restart the dev server after editing `web/tailwind.config.ts`.** Vite does not
re-read it, and a stale config fails silently — utilities simply stop existing
and nothing errors.

## Layout

```
content/   markdown + lectures.ts metadata (no build code)
web/src/
  design/     tokens.ts (colour, elevation) and chartTheme.ts (chart chrome)
  layout/     Shell, Sidebar, LectureBar, ReadingProgress, TableOfContents,
              ThemeToggle, FocusModeExit, useScrollSpy, theme
  pages/      one component per route, plus NotFound
  content/    loadLectures.ts (markdown loader) and markdownComponents.tsx
  learning/   Quiz, Prediction, MiniTool, ConceptMap, progress store
  tools/      the 20 simulations, lazy-loaded via registry.tsx
  components/ ToolComponents (tool primitives), ui (page primitives),
              ChartPrimitives, ChartLegend, ChartTooltip, SettingsPanel,
              HeroFigure, BrandMark, ErrorBoundary
  lib/        calculations, chartDomain, chartSeries, controlRegistry, csv,
              headingLevel, lookupSearch, preferences, readingProgress,
              scenario, sharing, taughtIn, themeShift, toolReset,
              useDocumentTitle
  tests/      vitest, 21 files
```

`lib/headingLevel` and `lib/toolReset` are the two a new tool is most likely to
need and least likely to find.

## Rules

### Typography and colour

- One type family (Inter). There is no display serif; `font-serif` is rejected
  by a test.
- No hex outside `design/tokens.ts` and `index.css`. No Tailwind default-palette
  colour utilities.
- Text tokens clear 4.5:1 on every surface, in both themes. `contrast.test.ts`
  computes it; do not eyeball a new pair.
- Status meaning (correct / wrong / caution) uses `--c-ok`, `--c-warn`,
  `--c-bad`. The four `--c-tier-*` values are one ordinal azure ramp and encode
  difficulty, never correctness. Never a tier colour for a pass or a fail.
- The accent means interaction: the focus ring, the selected state, the reading
  progress fill. It is not a decorative wash and not a primary-button fill — a
  dark neutral fills primary buttons and inverts in dark mode. A selected chip
  or tab may use `bg-accent/10` with `border-accent` because that is the
  selected state; what is forbidden is an accent wash behind content.
- Do not add `border-l` or a numbered `border-t` as an accent. A test rejects
  both.

### The four token scales

Each has one definition in `index.css`, one consumer set, and its own test.
Never hard-code one of these values in TSX.

- **Spacing.** `--space-hair … --space-12` are the only things
  `--pref-space` may multiply, and the only ones that are. The `s-*` namespace
  in `tailwind.config.ts` (`p-s-4`, `gap-s-2`, `space-y-s-3`) is the
  density-bound half; plain `p-4` stays literal. A class you can see is
  density-bound; a class you cannot is a size. In `web/src/tools` every spacing
  utility is on the scale and `tools.test.ts` holds that. Four step VALUES are
  deliberately left literal — `py-2.5`, `my-0.5`, `mt-1.5`, `space-y-1.5` —
  because they are off the 12-step grid, and the test holds that list too, so
  a fifth literal fails rather than passing quietly.
- **Elevation.** `--elev-0 … --elev-4` and `--elev-inset-hi`, with the
  `.elev-N` utilities and `.lift`. `.lift` changes `--elev-shadow` so a card's
  own inset top edge survives the hover; `hover:shadow-plate` overwrites
  `box-shadow` wholesale and loses it. `tokens.test.ts` owns the order.
- **Motion.** `--dur-fast`, `--dur-base`, `--dur-slow` and nothing else. The
  `transitionDuration.DEFAULT` override exists because `transition-colors`
  hard-codes its own duration and otherwise ignores `--pref-motion-scale`.
  `motion.test.tsx` counts the tokens.
- **Radius.** `--radius-control/card/plate/pill`, consumed by
  `borderRadius` in the Tailwind config. Radii do not scale with density: a
  corner is a shape, and a shape that moves with a spacing preference reads as
  a rendering fault.

### Charts

- Chrome comes from `design/chartTheme.ts`, series strokes from
  `chartColor(i)`. Import the series from `components/ChartPrimitives.tsx`;
  they are identity aliases because Recharts detects a series by component
  reference.
- Every `YAxis` gets `{...chartTheme.yAxis}`; an `XAxis` gets
  `{...chartTheme.axis}`. They are different objects — `axis` is for the
  categorical x, `yAxis` for a value axis.
- Every axis carries `key={chartTheme.axisKey('x' | 'y')}` AND
  `includeHidden`. Recharts measures tick labels once, in `componentDidMount`,
  and there is no other way to refresh that number: the key remounts the axis
  when the text scale changes, and `includeHidden` keeps a hidden series'
  domain in play. **The key is inert without
  `useChartTextScaleSignal()`** — a tool that omits the call computes a correct
  key once and never re-reads it, and the symptom is colliding tick labels at
  130% with no error anywhere.
- A chart with more than one series needs `ChartLegend` fed by
  `useHiddenSeries`, and a single-series chart must not have one: a control
  whose only effect is to hide the only thing on screen is a dead button.
- A plot height is a SIZE and stays literal. In practice that means a
  `ResponsiveContainer height={300}` prop or an `h-[300px]` wrapper, never a
  `var()` and never an `s-*` utility: a plot is not a density step, and
  `--plot-h` in `index.css` is for the one page-level frame, not for the
  twenty tools. `tools.test.ts` and `density.test.ts` between them reject
  `h-s-`, `h-[s-…]`, a `var()` inside `h-[…]`, and an `s-` inside a `height`
  prop. The reason to care is comparison, not consistency: a shorter plot
  RE-SCALES the y axis, so the same curve sits at a different height and a
  reader comparing two tools by eye is comparing two pictures of different
  things.

### Tools

- One `DEFAULTS` record, read by the `useState` initialisers and by
  `useToolReset`, so a retune cannot fix one copy of a number and leave the
  other. `useToolReset` derives the setters and the `dirty` flag; do not
  hand-write a `resetToDefault`, and do not leave the two copies of a default
  in the file. A scenario button that overwrites the sliders belongs in
  `DEFAULTS` too, or Reset is inert while it is selected.
- `<ToolControlBar onReset={reset} dirty={dirty} />` under the header.
- `ToolHeader` is the page `<h1>` on `/tool/:id` and takes its level from
  `HeadingLevel` elsewhere, so a case study or a lecture embedding a tool does
  not get two. Do not hard-code an `h1` in a tool.
- A tool's top-level sections are `h2`; `ToolNote` titles are `h3`. An outline
  that goes `h1` straight to `h3` is a defect, not a style.
- Call `useChartTextScaleSignal()` (see Charts).

### Shell and pages

- Route paths are declared in `web/src/router.tsx`; build internal links with
  `react-router-dom`, never a raw `<a href>`.
- The Pages base path is `/macro-economics/`. Reference static assets from
  `public/` with `import.meta.env.BASE_URL`, never a leading `/`. A leading `/`
  is what breaks a hard reload on a deep link.
- Every route sets its own `useDocumentTitle`, and the titles are unique.
- One `<h1>` per page, and heading levels never skip.
- Primary nav rows are 35px on a fine pointer and 44px on a coarse one, via
  `@media (pointer: coarse)`. That is deliberate: `.hit-44` is forbidden on the
  nav rows because they sit about 36px apart and the hit areas would share
  pixels, and a mouse does not need 44px.
- The `@media print` block is load-bearing — printing a lecture to PDF is a
  documented use case. One selector per rule, each with a reason. A print
  stylesheet hides SUBTREES: check a rule with `getClientRects().length`, not
  with `getComputedStyle(el).display`, which reports a descendant of a hidden
  element as visible.
- A flex row where one child is `flex-1` (basis 0) and a sibling is
  auto-width metadata will give the space to the sibling, because wrapping
  breaks on flex-basis and not on grown width. Give the text column a
  `min-w-*` floor, or the titles collapse to two characters a line on some
  cards and not others.

### Tests

Assert the invariant, not the batch. A pinned total or a threshold set a hair
clear of the measured value has to be edited every time the file legitimately
changes, and that is how the real invariant gets lost: state the property
("every tool is converted", "the only off-scale spacing is the list we meant to
leave off"), make it fail when the property is false, and prove it by breaking
the tree and watching it go red. A test nobody has seen fail is not evidence.

Several tests scan raw source with a regex, which means a COMMENT mentioning
`p-4` or `resetToDefault` or an axis key will trip them. If a test fails on a
string you only wrote in prose, reword the prose; the assertion is about code.

### Repo

- Do not commit `node_modules/`, `dist/`, `venv/`, `.DS_Store`, or
  `.playwright-mcp/`.
- No emojis in committed source or docs unless explicitly requested.
- Comment the reasoning, not the mechanic: what breaks, what was measured, and
  why the obvious alternative is wrong. Do not narrate the edit.

## Adding a tool

1. Create `web/src/tools/MyTool.tsx` exporting a default component.
2. Add it to the `TOOLS` registry in `web/src/store.ts` (id, title, category,
   description).
3. Lazy-load and route it in `web/src/tools/registry.tsx`.
4. Link it from the relevant lecture in `content/lectures.ts`.
5. Give it a `DEFAULTS` record read by both the `useState` initialisers and
   `useToolReset`, a `<ToolControlBar>`, `useChartTextScaleSignal()`, and — if
   it has a chart — `chartTheme` axes with `axisKey` and `includeHidden`, and a
   `ChartLegend` if more than one series.
6. `h2` for its top-level sections, `s-*` for every spacing utility, a literal
   height for the plot.
7. Add a smoke test in `web/src/tests/`.
