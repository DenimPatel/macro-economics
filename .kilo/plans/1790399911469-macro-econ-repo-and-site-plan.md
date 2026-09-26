# MacroEconomics — Repo Reorganization + GitHub Pages Course Site

## Goal

Turn the loose `macro-economics` folder into a well-organized, maintainable repository, and publish a unified interactive course site to
`https://denimpatel.github.io/macro-economics/` — lecture notes, interactive tools, case studies, quizzes, and real-data explorer under one design system and one deploy pipeline.

Implementation requires an implementation-capable agent (this plan only defines the work).

---

## Locked decisions

| Decision | Choice |
|---|---|
| Repo structure | Organized monorepo: `web/`, `content/`, `analysis/`, `data/`, `assets/`, `docs/` |
| Site scope | Unified course site: rendered lecture notes **+** existing interactive tools |
| Routing | `react-router-dom` `BrowserRouter` + `404.html` SPA fallback; clean URLs |
| Content pipeline | Markdown in `content/lecture_notes/` is source of truth; runtime render via `import.meta.glob` + `react-markdown` + KaTeX; metadata map for tiers/tools/quiz |
| Design | Clean academic, light default + persisted dark toggle; tier color coding |
| Deploy / CI | Official GitHub Pages Actions (`configure-pages` → `upload-pages-artifact` → `deploy-pages`) + separate CI (eslint, tsc, vitest, build) |
| Data | Python stays in `analysis/`; an export step writes CSV/PNG into the web app |
| Interactive v1 | All eight: live tools, inline mini-tools in lectures, prediction prompts, quizzes, progress/resume, shareable scenario URLs, concept map, real-data explorer |

---

## Current-state findings (must-fix)

1. **No `origin` remote is configured locally** (`git remote -v` is empty). User expects `https://github.com/DenimPatel/macro-economics`. Add it.
2. **No `.github/workflows/` exists**, yet Pages was "enabled using GitHub Action". Without a workflow the Pages build has nothing to run. Must add `ci.yml` + `deploy.yml` and set Pages source to **GitHub Actions** in repo Settings → Pages.
3. **`interactive-website/vite.config.ts` has no `base`.** A project page needs `base: '/macro-economics/'` or all assets 404.
4. **No router.** App is a single `currentTool` state switch (`src/App.tsx`), so no deep links.
5. **No tests, no typecheck/lint in any pipeline.** Root `.gitignore` has a typo (`*. venv`) and does not ignore `.DS_Store`, `node_modules`, `dist`, `.vite`, `__pycache__`.
6. **Loose files at root**: `debug_yt.py` (throwaway), `All_Lecture_Notes.pdf` (binary that shows as `modified`), `.DS_Store`, `venv/`, `.vite/`, `.claude/settings.local.json`.
7. Existing tools are self-contained TSX (mostly Recharts + inline styles); only 4 import `utils/calculations`. They work but don't share a design system. Treat token migration as incremental, not a rewrite.

---

## Target repo structure

```
macro-economics/
├─ .github/workflows/ci.yml           # lint + typecheck + test + build on push/PR
├─ .github/workflows/deploy.yml       # build web/ -> Pages; emit 404.html
├─ .gitignore                         # node_modules, dist, .DS_Store, venv, .vite, __pycache__, .env
├─ .editorconfig
├─ AGENTS.md                          # dev/agent conventions
├─ CONTRIBUTING.md                    # how to add a lecture, tool, quiz, dataset
├─ LICENSE                            # MIT (matches current interactive-website README)
├─ README.md                          # overview, live link, structure, quickstart
├─ package.json                       # root scripts: web:dev, web:build, test, lint, format, data:export
├─ content/
│  ├─ lectures.ts                     # metadata map: id, title, tier, video, tools[], concepts[], quiz
│  ├─ syllabus.md                     # generated from lectures.txt (title + YouTube URL)
│  ├─ lecture_notes/Lecture_1..25.md
│  └─ transcripts/Lecture_1..25.txt
├─ analysis/
│  ├─ fetch_transcripts.py
│  ├─ requirements.txt
│  ├─ interest-rate-vs-money-supply/  # existing .py + notebook
│  ├─ export.py                       # CSV + chart PNG/SVG -> web/public/data, assets/charts
│  └─ README.md
├─ data/
│  └─ us_money_market_monthly_2000_2025.csv
├─ assets/
│  ├─ All_Lecture_Notes.pdf
│  └─ charts/*.png
├─ docs/                              # existing *_IMPLEMENTATION.md, PROJECT_STATUS.md, etc.
└─ web/                               # renamed from interactive-website/
   ├─ index.html  vite.config.ts  tailwind.config.ts  tsconfig.json  .eslintrc.cjs  .prettierrc
   ├─ public/                         # favicon.svg, og-image, data/*.csv, 404 handled by build step
   └─ src/
      ├─ main.tsx  App.tsx  router.tsx
      ├─ design/tokens.ts  design/chartTheme.ts
      ├─ layout/{Shell,Sidebar,Header,Footer,ThemeToggle,TableOfContents}.tsx
      ├─ pages/{Home,Syllabus,LecturePage,ToolsIndex,ToolPage,CaseStudies,CaseStudyPage,ConceptMap,DataExplorer,Glossary,About,NotFound}.tsx
      ├─ content/{loadLectures.ts,lectures.ts,markdownComponents.tsx}
      ├─ learning/{Quiz.tsx,Prediction.tsx,MiniTool.tsx,progress.ts,ConceptMap.tsx}
      ├─ tools/                       # existing 20 tools (paths updated)
      ├─ components/                  # ToolHeader, SliderControl, StatBox, InfoBox, Card, Callout, Formula
      ├─ lib/{calculations.ts,sharing.ts,csv.ts,scenario.ts}
      └─ tests/                       # vitest
```

Move files with `git mv` to preserve history. Update all imports (alias `@/*` still resolves to `web/src/*`).

---

## Website information architecture

Routes (under `base '/macro-economics/'`, `BrowserRouter`):

- `/` — **Home**: hero, course-at-a-glance stats (25 lectures, 20 tools, 4 case studies), three learning-path cards (Beginner L1–6, Intermediate L7–12, Advanced L13–24), featured live tool, link to PDF.
- `/syllabus` — table of all 25 lectures with tier, video link, mapped tools, completion tick; links into lecture pages.
- `/lecture/:n` — **LecturePage**: rendered Markdown, sticky TOC, KaTeX math, callouts, inline mini-tool(s), prediction prompt, quiz, related tools, prev/next, "mark complete".
- `/tools` — filterable grid by tier/topic.
- `/tool/:id` — **ToolPage**: title + tier badge, "Concept" explainer panel, live tool, real-vs-theory data overlay toggle, share-scenario + reset, related lectures.
- `/cases` and `/case/:id` — 2008, COVID, SVB, speculative attack; timeline-driven narrative + embedded tool.
- `/concepts` — **Concept map**: concept grid linking to lectures/tools, ticked by progress.
- `/data` — **Data Explorer**: real US series (money supply vs rates, inflation, unemployment) with theory overlay.
- `/glossary` — key macro terms with anchored definitions.
- `/about` — sources/attribution, how to run locally, license.
- `*` — NotFound.

Reuse GitLearn patterns: curriculum rail, LessonPanel, Prediction, ConceptMap, `localStorage` progress (`loadProgress`/`saveProgress`).

---

## Design system (`web/src/design/`)

- `tokens.ts`: semantic colors (bg, surface, border, fg, muted, accent), tier colors (beginner green / intermediate amber / advanced red / case-study purple), spacing, radii, font stacks, shadow. Consumed by Tailwind theme extension **and** Recharts.
- `chartTheme.ts`: axis/grid/tooltip/line palette so all tools look consistent.
- Light default, dark via `class` strategy + `ThemeToggle`, persisted in `localStorage`.
- Typography: readable serif or high-quality sans headings, ~68ch measure for lecture prose; tool pages full-width two-column (controls | chart).
- Primitives in `components/` replace ad-hoc inline styles in `ToolComponents.tsx`; migrate tools incrementally, don't block the site on it.

---

## Interactive features spec

1. **Live parameter tools** — keep existing tools; wrap in `ToolPage` chrome (header, concept panel, share/reset, related lectures). Register all 20 in `content/lectures.ts` tool registry.
2. **Inline mini-tools** — `MiniTool.tsx` renders a compact, preset configuration of a tool (props: `toolId`, `preset`, `lockedControls`) inside a lecture section via a Markdown directive/custom component (e.g. `<MiniTool toolId="multiplier-simulator" preset="..." />`).
3. **Prediction prompts** — `Prediction.tsx`: student commits a guess (direction/value) before the answer is revealed; stored per lecture step. Port GitLearn's `Prediction` behavior.
4. **Quizzes** — `Quiz.tsx`: MCQ with instant per-option feedback, explanation, score; questions authored in `content/lectures.ts`.
5. **Progress + resume** — `learning/progress.ts`: completed lectures, quiz scores, last visited page in `localStorage`; surfaces on Syllabus, concept map, and a curriculum rail.
6. **Shareable scenario URLs** — extend `lib/sharing.ts` to encode tool params in search params (`?scenario=...`) so any scenario is a real deep link; add Copy-link and Reset.
7. **Concept map** — concept list with links to the teaching lecture and practising tool, ticked when complete.
8. **Real-data explorer** — `lib/csv.ts` + Recharts over exported CSVs, with theory-overlay toggle (reuse `showDataOverlay` from the store).

---

## Content pipeline

- `web/src/content/loadLectures.ts`: `import.meta.glob('../../../content/lecture_notes/*.md', { query: '?raw', import: 'default' })`, parse leading `# Lecture N: Title`, order by N.
- Render with `react-markdown` + `remark-gfm` + `remark-math` + `rehype-katex` + `rehype-slug` + `rehype-autolink-headings`; style via `markdownComponents.tsx` (headings, tables, blockquotes → callouts, bold key terms).
- `content/lectures.ts`: typed array `{ n, slug, title, tier, videoUrl, tools: ToolId[], concepts: string[], quiz: QuizQuestion[], miniTools: MiniToolSpec[] }`. No driving decisions from localStorage.
- Add `katex` CSS import in `main.tsx`.
- Delete `debug_yt.py`; keep `fetch_transcripts.py` under `analysis/`.

### Provisional lecture → tier / tools map (confirm against note content during implementation)

| Tier | Lectures | Primary tools |
|---|---|---|
| Beginner | 1–6 | 1: concept map; 2: `gdp-visualizer`; 3: `multiplier-simulator`, `fiscal-policy-experiments`; 4: `real-interest-rate`, `real-interest-rate-calculator`; 5–6: `is-lm-explorer` |
| Intermediate | 7–12 | 7: `modern-is-curve`, `real-interest-rate`; 8: `labor-market`, `labor-market-wsps`; 9: `phillips-curve`, `phillips-curve-tradeoff`; 11–12: `is-lm-pc-dynamics` |
| Advanced | 13–24 | 13–15: `solow-simulator`; 15–16: `growth-accounting`; 17–21: `mundell-fleming`, `speculative-attack`; 22–23: `asset-pricing`; 24: `modern-is-curve`, `is-lm-explorer` |
| Reviews | 10, 18, 25 | review + quiz pages only |
| Case studies | — | `crisis-2008`, `crisis-covid`, `crisis-svb`, `speculative-attack` |

---

## Data pipeline

- `analysis/export.py` reads `data/us_money_market_monthly_2000_2025.csv` and the source pickles, writes normalized CSVs to `web/public/data/` and static charts to `assets/charts/`.
- Root script `npm run data:export` (and a `prebuild` copy in `web/`) ensures the site always has current data; no hand-copied numbers.
- Heavy/static figures use exported PNG/SVG; interactive overlays use CSV in Recharts.
- `All_Lecture_Notes.pdf` → `assets/`, linked from Home and About. Optionally add `analysis/build-pdf.sh` (pandoc) and stop committing regenerated binaries.

---

## Deployment & CI

**`.github/workflows/ci.yml`** (on `push` to any branch + `pull_request`):
```
setup-node 20 -> cache npm (web/package-lock.json) -> npm ci (web) ->
npm run lint -> npx tsc --noEmit -> npm test -> npm run build
```

**`.github/workflows/deploy.yml`** (on `push` to `main`):
```
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: pages, cancel-in-progress: true }
build job: checkout -> setup-node -> npm ci -> npm run build ->
  cp web/dist/index.html web/dist/404.html -> upload-pages-artifact(path: web/dist)
deploy job: needs build -> environment: github-pages -> deploy-pages
```

Manual one-time steps (document in README):
1. `git remote add origin git@github.com:DenimPatel/macro-economics.git` then `git push -u origin main`.
2. Repo Settings → Pages → Source = **GitHub Actions**.
3. Confirm `web/vite.config.ts`: `base: '/macro-economics/'`.

`web/package.json` adds: `typecheck`, `test` (vitest), `test:watch`, `lint`, `format`; `build = tsc && vite build`.

---

## Implementation plan (ordered)

**Phase 0 — repo hygiene & git wiring**
1. Add `origin`, verify branch `main`, `git push -u origin main`.
2. Rewrite `.gitignore`; remove `.DS_Store`, `debug_yt.py`, committed `.vite/`, `.claude/settings.local.json` from tracking.
3. `git mv` into the target structure: `interactive-website` → `web`, notes/transcripts → `content/`, Python → `analysis/`, CSV → `data/`, PDF → `assets/`, existing `*.md` → `docs/`. Fix all relative imports.
4. Add root `package.json` scripts, `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `LICENSE`, `.editorconfig`.

**Phase 1 — make it deploy at all**
5. `web/vite.config.ts`: add `base: '/macro-economics/'`.
6. Add `ci.yml` and `deploy.yml`; set Pages source; push an empty-ish build and confirm the live URL loads.
7. Add `404.html` copy in the deploy build.

**Phase 2 — app shell, routing, design system**
8. Add `react-router-dom`, `react-markdown`, `remark-gfm`, `remark-math`, `rehype-katex`, `katex`, `rehype-slug`, `rehype-autolink-headings`, `vitest`.
9. `design/tokens.ts`, `chartTheme.ts`, Tailwind theme extension; `Shell`, `Sidebar` (nav to routes), `Header`, `Footer`, `ThemeToggle`, `TableOfContents`; light/dark persisted.
10. `router.tsx` with all routes; convert `App.tsx` from state-switch to `<Outlet/>`; keep `tools` lazy-loaded.

**Phase 3 — content + core pages**
11. `content/lectures.ts` (full metadata + quizzes + mini-tool specs) and `loadLectures.ts`; render `LecturePage` with math, TOC, callouts, prev/next.
12. `Syllabus`, `Home`, `ToolsIndex`, `ToolPage` (chrome around existing tools), `About`, `NotFound`.
13. `MiniTool`, `Prediction`, `Quiz`, `progress.ts`; wire into `LecturePage`.
14. `ConceptMap`, `Glossary`.

**Phase 4 — data + case studies**
15. `analysis/export.py` + `data:export`; `DataExplorer` with theory overlay.
16. `CasesIndex` + `CaseStudyPage` for the four crises; embed relevant tools.
17. `scenario.ts`: deep-link scenario params; Copy-link/Reset on `ToolPage`.

**Phase 5 — quality & polish**
18. Vitest: unit tests for `lib/calculations.ts`, scenario encode/decode, lecture loader, quiz scoring; smoke-render a representative tool.
19. ESLint/Prettier clean, `tsc --noEmit` clean; remove dead code (`ToolComponents` inline-style duplicates after migration).
20. README with live link, structure, quickstart, and "how to add a lecture/tool/quiz"; CONTRIBUTING; attribution/sources.

**Phase 6 — incremental tool design migration (optional, post-launch)**
21. Move tools onto `chartTheme` + primitives one at a time, each with a smoke test; never break `main`.

---

## Validation

- Local: `npm ci && npm run lint && npx tsc --noEmit && npm test && npm run build && npm run preview`; deep-link reload test for `/lecture/3`, `/tool/is-lm-explorer`, unknown path → `NotFound`.
- Assert built asset URLs are prefixed `/macro-economics/`.
- CI: `ci.yml` green on a test branch; `deploy.yml` green on `main`.
- Live: `https://denimpatel.github.io/macro-economics/` returns 200; reloading a deep link and pasting a `?scenario=` link both work; dark toggle persists.
- Content: all 25 lectures load, math renders, every mapped tool opens, every quiz scores.

---

## Risks / open questions

- **Pages source must be set manually** to "GitHub Actions"; if it was set to a branch, the artifact deploy won't publish. Verify before debugging the workflow.
- **Binary churn**: `All_Lecture_Notes.pdf` is committed and modified. Decide whether to keep committing it or generate it in `analysis/` and attach to Releases. Recommended: generate, keep latest in `assets/`.
- **Tool refactor scope**: 20 tools / ~9,500 lines with inline styles. Phase 6 is deliberately incremental; do not rewrite tools to ship the site.
- **Lecture→tool mapping** is provisional; confirm each mapping against the note's "Overview" while authoring `lectures.ts`.
- **KaTeX bundle size**: acceptable, but lazy-load the math plugin on lecture routes if initial load is heavy.
- **Quiz answer quality**: questions must be authored/verified, not auto-generated, or the site loses credibility.

## Out of scope

User accounts/backend, instructor dashboard, AI tutor, multi-language, VR, real-time data APIs. `fetch_transcripts.py` remains a manual analysis utility, not part of the build.
