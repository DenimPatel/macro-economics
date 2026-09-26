# web

The site: Vite + React + TypeScript, deployed to GitHub Pages.

## Commands

```bash
npm install
npm run dev         # http://localhost:5173/macro-economics/
npm run build       # tsc && vite build -> dist/
npm run preview
npm run test        # vitest
npm run typecheck   # tsc --noEmit
npm run lint        # eslint, max-warnings 0
npm run format      # prettier --write
```

## Structure

```
src/
  design/     tier metadata, series palette, chart theme
  layout/     shell, sidebar, header, theme toggle, table of contents
  pages/      one component per route
  content/    lecture loader, markdown renderer, metadata re-exports
  learning/   quiz, prediction, mini-tool, progress, concept map
  tools/      the simulations, lazy-loaded via registry.tsx
  components/ shared primitives (ui.tsx, ToolComponents.tsx, ChartPrimitives.tsx)
  lib/        calculations, csv, scenario links, useDocumentTitle
  tests/      vitest
  index.css   token definitions and global styles
```

The actual colour values live in `src/index.css`, not in `design/`. See
**Design tokens** below.

## Identity

Cool neutral "instrument" scheme, one accent, one type family. Three rules carry
most of the design:

- **The accent means interaction.** Links, focus, active nav, slider fill. It is
  never a background wash, and it is never the primary button fill — that is
  inverted (`--c-fg` on `--c-bg`) so that a page with twenty of them still reads
  calmly.
- **No accent-coloured edge.** No `border-l`, no numbered `border-t`, no tinted
  border. A callout separates by icon tile and label; the active nav row is a
  filled row. `tokens.test.ts` fails the build if one reappears.
- **One family, Inter, for everything,** including all lecture prose. There is no
  display serif, so `font-serif` is gone from the Tailwind config and is
  likewise enforced by a test.

## Adding a route

Declare it in `src/router.tsx`. Build internal links with `react-router-dom`
(`Link`/`NavLink`), never raw `<a href>`. Call `useDocumentTitle` from
`src/lib/useDocumentTitle.ts` in the page so the tab and search result are
specific. The Pages base path is `/macro-economics/`; reference `public/` assets
with `import.meta.env.BASE_URL`.

## Adding a tool

1. `src/tools/MyTool.tsx` with a default export.
2. Register it in `src/store.ts` (`TOOLS`) and lazy-load it in
   `src/tools/registry.tsx`.
3. Link it from a lecture in `../content/lectures.ts`.
4. Add a test in `src/tests/`.

## Design tokens

Colours are defined once in `src/index.css` as space-separated RGB channels
(`--c-fg-ch: 12 17 24`) and exposed twice:

- `rgb(var(--c-fg-ch) / <alpha-value>)` in `tailwind.config.ts`, so Tailwind's
  opacity modifier works. Pointing the theme at the plain `var(--c-fg)` instead
  makes every `bg-x/10` utility compile to **nothing**, silently.
- `rgb(var(--c-fg-ch))` as `--c-fg`, which is what `color-mix()` rules and
  Recharts consume.

The numbers appear exactly once, in the `-ch` var, so the two forms cannot
drift. `.dark` only overrides the `-ch` vars.

Rules for anything themed:

- **Fills and borders** are derived with
  `color-mix(in srgb, var(--c-X) N%, var(--c-surface))`.
- **Text on a tint** must use a dedicated `-ink` var (`--c-accent-ink`,
  `--c-tier-advanced-ink`, `--c-ok-ink`, …), never `color-mix`. Mixing toward
  the surface lightens the text and drops it below AA.
- **Tiers are ordinal, not categorical.** `--c-tier-*` is one azure hue at four
  steps. Difficulty is communicated by the level meter and the label, never by
  hue, which is what leaves the accent free. Status meaning — correct, wrong,
  caution — lives on `--c-ok` / `--c-warn` / `--c-bad` and must not borrow a tier
  token.
- **SVG colours go through `style`, not presentation attributes.** `fill="var(--c-x)"`
  is silently invalid: `var()` is a CSS value and presentation attributes are not
  CSS declarations, so the attribute form renders black. See
  `components/HeroFigure.tsx`.
- **Recharts series strokes** must be a plain hex from `SERIES_COLORS` via
  `chartColor(i)`. Recharts cannot resolve a `var(--…)` for a stroke, so CSS
  variables work for chart *chrome* but not for series *colours*.
- **No emoji** in source. Notes use `ToolNote`, whose variants supply a lucide icon.
- **No raw Recharts series in a tool.** Import `ChartLine` / `ChartArea` /
  `ChartBar` / `ChartScatter` / `ChartPie` from `components/ChartPrimitives`.
  Those are identity aliases, not wrapper components: Recharts finds the series
  to plot by comparing element types against its own `Line` by reference, so a
  wrapper renders axes and grid and then silently plots nothing. Shared defaults
  (`isAnimationActive: false`, stroke weight) are applied through `defaultProps`
  on the same module.

`src/tests/tokens.test.ts`, `src/tests/contrast.test.ts`, and
`src/tests/smoke.test.tsx` enforce all of the above; they fail the build if a hex
literal or emoji reappears, if a token pair drops below its contrast floor, or if
a colour comes back into an inline style.
