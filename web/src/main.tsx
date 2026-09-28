import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// One family, self-hosted. Inter Variable carries prose, chrome, and the
// tabular numerals every readout depends on.
import '@fontsource-variable/inter/wght.css'
// NOTE: `components/ChartPrimitives` is deliberately NOT imported here, and
// its absence is worth about 330 kB. It is a side-effect module — it silences
// Recharts' series animation by mutating `defaultProps` on the component
// objects — and importing it for that side effect put the whole of Recharts,
// and the d3 and lodash modules under it, into the FIRST chunk. Measured on
// the production build, same tree, one line apart: 617.18 kB of raw JavaScript
// in the eager chunk with this import, 288.62 kB without. Nothing about the
// silencing changes, because the mutation runs when the module is evaluated
// and every module that renders a chart imports it directly (all twenty tools)
// or reaches it through `design/chartTheme`, which imports it for the same
// reason. A chart cannot be reached without passing the module that silences
// it — and that is now a test rather than a claim.
//
// `tests/suspense.test.tsx` holds both halves: nothing reachable from this
// file by a STATIC import brings in a charting or a markdown engine, and every
// module naming a Recharts component still resolves the one that silences it.
import './index.css'
import { startPreferenceSync } from './lib/preferences'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

// Apply the stored preferences (theme, text scale, measure, leading, density)
// before the first render. The inline script in index.html has already put
// them on <html> for the first paint; this keeps the document in step with
// the store from here on, and is the one call that installs the listener for
// a live OS colour scheme change.
startPreferenceSync()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
