# Contributing

Thanks for helping improve the course. This project is content plus a small
React app; most contributions are one of three kinds.

## Add or edit a lecture

1. Create `content/lecture_notes/Lecture_N.md`. The first line must be
   `# Lecture N: Title` — the loader reads the number and title from it.
2. Add a matching entry to `content/lectures.ts`:

```ts
{
  n: 26,
  tier: 'advanced',
  videoUrl: 'https://youtu.be/...',
  tools: ['solow-simulator'],
  concepts: ['steady state', 'convergence'],
  miniTools: [{ toolId: 'solow-simulator', preset: 'default' }],
  quiz: [
    {
      question: '...',
      options: ['...', '...'],
      answer: 0,
      explanation: '...',
    },
  ],
}
```

3. Run `npm run dev` and check the lecture renders, math works, and the quiz
   scores.

Math uses `$inline$` and `$$display$$` (KaTeX). Callouts use blockquotes.
Tables use GFM pipe tables.

## Add a tool

1. Create `web/src/tools/MyTool.tsx` (default export, self-contained).
2. Register it in `web/src/store.ts` under `TOOLS` with an id, title, category,
   and description.
3. Lazy-load it in `web/src/tools/registry.tsx` so only the active tool ships.
4. Reference its id from the appropriate lecture in `content/lectures.ts`.
5. Add a smoke test in `web/src/tests/`.

Formulas belong in `web/src/lib/calculations.ts` so they are testable and
shared.

## Data and charts

Python analysis lives in `analysis/`. `analysis/export.py` writes normalized
CSVs to `web/public/data/` and charts to `assets/charts/`. Run
`npm run data:export` after changing a dataset. Do not hand-copy numbers into
components.

## Before opening a PR

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

All four must pass. Keep pull requests focused: one lecture, one tool, or one
fix at a time.

## Commit messages

Short imperative subject lines (`add Mundell-Fleming tool`, `fix IS-LM axis
labels`), with a body when the change needs explanation. Do not commit
generated output or dependencies.
