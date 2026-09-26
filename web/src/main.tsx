import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// One family, self-hosted. Inter Variable carries prose, chrome, and the
// tabular numerals every readout depends on.
import '@fontsource-variable/inter/wght.css'
// Applies the shared Recharts series defaults before any tool renders.
import './components/ChartPrimitives'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
