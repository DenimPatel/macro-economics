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

## Commands

Run from the repository root:

```bash
npm run dev        # vite dev server (web/)
npm run build      # tsc && vite build
npm run test       # vitest
npm run lint       # eslint, max-warnings 0
npm run typecheck  # tsc --noEmit
npm run format     # prettier --write
```

Always run `npm run lint`, `npm run typecheck`, and `npm run test` before
considering web work done.

## Layout

```
content/   markdown + lectures.ts metadata (no build code)
web/src/
  design/     tokens and chart theme (colors live here, not inline)
  layout/     shell, sidebar, header, theme toggle, TOC
  pages/      route components
  content/    lecture loader + metadata + markdown components
  learning/   quiz, prediction, mini-tool, progress, concept map
  tools/      interactive simulations (lazy-loaded via registry.tsx)
  components/ shared primitives (ToolHeader, SliderControl, StatBox, ...)
  lib/        calculations, sharing/scenario, csv helpers
  tests/      vitest
```

## Rules

- TypeScript strict; no `any` in new code.
- Route paths are declared in `web/src/router.tsx`; build links with
  `react-router-dom`, never raw `<a href>` for internal navigation.
- The Pages base path is `/macro-economics/`. Reference static assets from
  `public/` with `import.meta.env.BASE_URL`, never a leading `/`.
- Keep charts consistent: use `design/chartTheme.ts` for chrome and
  `chartColor(i)` from `design/tokens.ts` for series strokes. Import the
  series from `components/ChartPrimitives.tsx`; they are identity aliases
  because Recharts detects series by component reference.
- Colour lives in `web/src/index.css` as `-ch` channel vars plus an azure
  accent. The accent means interaction only: never a background wash, never a
  primary-button fill. Do not add `border-l` or a numbered `border-t` as an
  accent — a test rejects both.
- Status meaning (correct / wrong / caution) uses `--c-ok`, `--c-warn`,
  `--c-bad`. The four `--c-tier-*` values are one ordinal azure ramp and
  encode difficulty, never correctness.
- One type family. There is no display serif; `font-serif` is rejected by a
  test.
- Do not commit `node_modules/`, `dist/`, `venv/`, `.DS_Store`, or
  `.playwright-mcp/`.
- No emojis in committed source or docs unless explicitly requested.

## Adding a tool

1. Create `web/src/tools/MyTool.tsx` exporting a default component.
2. Add it to the `TOOLS` registry in `web/src/store.ts` (id, title, category,
   description).
3. Lazy-load and route it in `web/src/tools/registry.tsx`.
4. Link it from the relevant lecture in `content/lectures.ts`.
5. Add a smoke test in `web/src/tests/`.
