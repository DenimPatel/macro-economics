import { createBrowserRouter } from 'react-router-dom'
import Shell from './layout/Shell'
import Home from './pages/Home'
import Syllabus from './pages/Syllabus'
import LecturePage from './pages/LecturePage'
import ToolsIndex from './pages/ToolsIndex'
import ToolPage from './pages/ToolPage'
import CasesIndex from './pages/CasesIndex'
import CaseStudyPage from './pages/CaseStudyPage'
import ConceptMapPage from './pages/ConceptMapPage'
import DataExplorer from './pages/DataExplorer'
import Glossary from './pages/Glossary'
import About from './pages/About'
import NotFound from './pages/NotFound'

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
