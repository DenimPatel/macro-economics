# MacroEconomics

An interactive macroeconomics course: 25 lectures of written notes, ~20 live
simulation tools, four crisis case studies, and a real-data explorer — all in one
site.

**Live: https://denimpatel.github.io/macro-economics/**

## What this is

The repository pairs a taught course with tools you can play with:

- **25 lecture notes** (Markdown) covering GDP and inflation definitions, the
  goods and financial markets, IS–LM, the labour market, the Phillips curve,
  IS–LM–PC dynamics, the Solow model and growth accounting, the open economy and
  Mundell–Fleming, exchange-rate regimes, and asset pricing.
- **Interactive simulations** — multiplier, Keynesian cross, IS–LM, IS–LM–PC,
  WS/PS labour market, Phillips curve, Solow, Mundell–Fleming, EPDV asset
  pricing, growth accounting, and more.
- **Case studies** — 2008, COVID, the SVB failure, and speculative attacks on
  pegged exchange rates.
- **Real data** — US money, interest-rate, inflation, and unemployment series
  with a theory-overlay toggle.
- **Learning support** — prediction prompts, quizzes with feedback, a concept
  map, and progress that resumes where you left off.

Each lecture page embeds the tools that belong to it, so reading and doing sit
side by side.

## Repository layout

```
content/      course source of truth: lecture notes, transcripts, syllabus,
              and lectures.ts (tier / video / tools / quiz metadata)
web/          the Vite + React + TypeScript site (deployed to GitHub Pages)
analysis/     Python analysis and the data export pipeline
data/         canonical datasets (CSV)
assets/       compiled PDF and pre-rendered charts
docs/         project history, implementation notes, status docs
```

Notes live in `content/lecture_notes/` and are rendered by the site at build
time — edit Markdown and the site updates. `content/lectures.ts` is the only
place that maps a lecture to its tier, video, tools, concepts, and quiz.

## Running locally

Requires Node.js 20+.

```bash
npm install --prefix web
npm run dev            # http://localhost:5173/macro-economics/
```

Other useful scripts (run from the repository root):

```bash
npm run build          # type-check and build web/ to web/dist
npm run preview        # preview the production build
npm run test           # vitest
npm run lint           # eslint
npm run typecheck      # tsc --noEmit
npm run format         # prettier --write
npm run data:export    # regenerate CSVs/charts into web/public/data and assets
```

## Adding content

- **A lecture** — add `content/lecture_notes/Lecture_N.md` and an entry in
  `content/lectures.ts`. The loader orders by the `# Lecture N:` heading.
- **A tool** — add a component in `web/src/tools/`, register it in
  `web/src/content/lectures.ts` (tool registry), and lazy-load it in
  `web/src/tools/registry.tsx`.
- **A quiz** — add `quiz` questions to the lecture's metadata entry.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Deployment

Pushing to `main` builds `web/` and publishes it to GitHub Pages via
`.github/workflows/deploy.yml` (official Pages actions). CI
(`.github/workflows/ci.yml`) runs lint, type-check, tests, and build on every
push and pull request.

The site is served under `/macro-economics/`; that base path is set in
`web/vite.config.ts`. A `404.html` copy of the app makes deep links and reloads
work on Pages.

> **One-time setup:** in repo Settings → Pages, set **Source = GitHub Actions**.
> If it is set to a branch, the artifact deploy will not publish.

## Attribution

Course content follows the MIT OpenCourseWare macroeconomics lecture series
(YouTube playlist `PLUl4u3cNGP62EXoZ4B3_Ob7lRRwpGQxkb`); `content/lectures.txt`
lists the source videos. The interactive tools are original implementations for
educational use.

## License

MIT — see [LICENSE](LICENSE).
