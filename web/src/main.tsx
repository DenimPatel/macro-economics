import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// One family, self-hosted. Inter Variable carries prose, chrome, and the
// tabular numerals every readout depends on.
import '@fontsource-variable/inter/wght.css'
// Applies the shared Recharts series defaults before any tool renders.
import './components/ChartPrimitives'
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
