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
  design/     tokens + chart theme (all colours live here)
  layout/     shell, sidebar, header, theme toggle, table of contents
  pages/      one component per route
  content/    lecture loader, markdown renderer, metadata re-exports
  learning/   quiz, prediction, mini-tool, progress, concept map
  tools/      the simulations, lazy-loaded via registry.tsx
  components/ shared primitives
  lib/        calculations, csv, scenario links, sharing helpers
  tests/      vitest
```

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

## Legacy tools

Tools under `src/tools/` predate the shared design system. They are being moved
onto `design/chartTheme.ts` and the `components/` primitives one at a time;
their stricter lint rules are relaxed in `.eslintrc.cjs` until each is touched.
New code must satisfy the full rule set.
