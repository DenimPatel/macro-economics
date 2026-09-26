import type { ReactElement } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import ToolPage from '../pages/ToolPage'

afterEach(cleanup)

function renderAt(routePath: string, entry: string, element: ReactElement) {
  const router = createMemoryRouter([{ path: routePath, element }], { initialEntries: [entry] })
  return render(<RouterProvider router={router} />)
}

describe('page smoke tests', () => {
  it('renders the home page with the course heading', () => {
    renderAt('/', '/', <Home />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByText(/Read the lecture/i)).toBeInTheDocument()
  })

  it('renders a tool page header for a registered tool', () => {
    renderAt('/tool/:id', '/tool/multiplier-simulator', <ToolPage />)
    expect(screen.getByText('Multiplier Effect Simulator')).toBeInTheDocument()
    expect(screen.getByText(/Copy scenario link/i)).toBeInTheDocument()
  })
})
