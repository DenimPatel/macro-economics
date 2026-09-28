import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import Shell from './layout/Shell'

/**
 * The twelve pages, as dynamic imports.
 *
 * These were static imports, and the cost of that was measurable on the first
 * paint. `LecturePage` reaches `content/markdownComponents.tsx`, which is
 * KaTeX plus the whole micromark/mdast/remark pipeline, and `DataExplorer`
 * reaches `design/chartTheme`, which is Recharts and the d3 and lodash
 * modules under it. All twelve page components sat in the eager chunk, so a
 * reader who had decided not to open a lecture or a tool still downloaded
 * 947 kB of raw JavaScript for the privilege, and the home page alone fetched
 * 353.6 kB of JS where it now fetches 96.0. `tools/registry.tsx` has
 * lazy-loaded its twenty tools this way all along; the pages never got the
 * same treatment.
 *
 * The path strings below are unchanged and are the same path strings as
 * before. Only the module load moved.
 *
 * The bare namespace object, NOT `.then((m) => m.default)`. The explicit form
 * is the usual advice for `React.lazy` and it is the advice for a CommonJS
 * module, where `import()` hands back `{ default: module.exports }` and the
 * component is one level further in. Every page here is ESM with a default
 * export, so `import()` already hands back `{ default: Component }` and the
 * extra unwrap is redundant — and in this TypeScript/React-types pair it does
 * not merely fail to help, it fails to COMPILE: inside `lazy`'s contextual
 * position the `then` overload infers its result against
 * `Promise<{ default: ComponentType }>` and produces
 * `Promise<{ default: never } | (() => Element)>`, which is assignable to
 * nothing. Measured, not remembered. The bare form still holds the property
 * that matters, which is the one worth a test: a page that loses its default
 * export is a compile error here ("Property 'default' is missing"), not a
 * runtime "Element type is invalid" on whichever route renders it.
 *
 * The single boundary these suspend into lives in `layout/Shell.tsx`, around
 * the `<Outlet />`, and its fallback is `components/ui.tsx`'s `PageSkeleton`.
 * It is there rather than above `<Shell />` for the reason the component's
 * comment gives: the chrome is the frame, and the frame should not vanish
 * because one page's module is in flight.
 */
const Home = lazy(() => import('./pages/Home'))
const Syllabus = lazy(() => import('./pages/Syllabus'))
const LecturePage = lazy(() => import('./pages/LecturePage'))
const ToolsIndex = lazy(() => import('./pages/ToolsIndex'))
const ToolPage = lazy(() => import('./pages/ToolPage'))
const CasesIndex = lazy(() => import('./pages/CasesIndex'))
const CaseStudyPage = lazy(() => import('./pages/CaseStudyPage'))
const ConceptMapPage = lazy(() => import('./pages/ConceptMapPage'))
const DataExplorer = lazy(() => import('./pages/DataExplorer'))
const Glossary = lazy(() => import('./pages/Glossary'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Strip the trailing slash Vite adds so React Router's basename matches. */
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Shell />,
      children: [
        { index: true, element: <Home /> },
        { path: 'syllabus', element: <Syllabus /> },
        { path: 'lecture/:n', element: <LecturePage /> },
        { path: 'tools', element: <ToolsIndex /> },
        { path: 'tool/:id', element: <ToolPage /> },
        { path: 'cases', element: <CasesIndex /> },
        { path: 'case/:slug', element: <CaseStudyPage /> },
        { path: 'concepts', element: <ConceptMapPage /> },
        { path: 'data', element: <DataExplorer /> },
        { path: 'glossary', element: <Glossary /> },
        { path: 'about', element: <About /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename },
)
