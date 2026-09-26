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
  components/ shared primitives (ui.tsx, ToolComponents.tsx)
  lib/        calculations, csv, scenario links, sharing helpers
  tests/      vitest
  index.css   token definitions and global styles
```

The actual colour values live in `src/index.css`, not in `design/`. See
**Design tokens** below.

## Adding a route

Declare it in `src/router.tsx`. Build internal links with `react-router-dom`
(`Link`/`NavLink`), never raw `<a href>`. The Pages base path is
`/macro-economics/`; reference `public/` assets with `import.meta.env.BASE_URL`.

## Adding a tool

1. `src/tools/MyTool.tsx` with a default export.
2. Register it in `src/store.ts` (`TOOLS`) and lazy-load it in
   `src/tools/registry.tsx`.
3. Link it from a lecture in `../content/lectures.ts`.
4. Add a test in `src/tests/`.

## Design tokens

Colours are defined once in `src/index.css` as space-separated RGB channels
(`--c-fg-ch: 28 25 23`) and exposed twice:

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
  `--c-tier-advanced-ink`, …), never `color-mix`. Mixing toward the surface
  lightens the text and drops it below AA.
- **Recharts series strokes** must be a plain hex from `SERIES_COLORS` via
  `chartColor(i)`. Recharts cannot resolve a `var(--…)` for a stroke, so CSS
  variables work for chart *chrome* but not for series *colours*.
- **No emoji** in source. Panels use `ToolCallout`, whose variants supply a
  lucide icon.

`src/tests/tokens.test.ts` and `src/tests/contrast.test.ts` enforce all of the
above; they fail the build if a hex literal or emoji reappears, or if a token
pair drops below its contrast floor.

