import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Variable fonts, self-hosted. The `opsz` build of Literata carries both the
// optical-size and weight axes, which is what long-form prose wants.
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/literata/opsz.css'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
