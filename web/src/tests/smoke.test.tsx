import type { ReactElement } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { Area, Bar, Line, Pie, Scatter } from 'recharts'
import Home from '../pages/Home'
import ToolPage from '../pages/ToolPage'
import IsLmExplorer from '../tools/IsLmExplorer'
import { ChartLine, ChartArea, ChartBar, ChartScatter, ChartPie } from '../components/ChartPrimitives'

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

/**
 * The visual pass replaced hand-written styles with a token system, so the
 * invariant worth locking down is that no colour literal ever comes back — a
 * stray hard-coded `backgroundColor` renders a light panel on the dark theme
 * and is invisible to the other suites.
 */
function literalColours(container: HTMLElement): string[] {
  const offenders: string[] = []
  for (const el of container.querySelectorAll<HTMLElement>('[style]')) {
    const style = el.getAttribute('style') ?? ''
    // `--pct: 42%` and `width: 40%` are fine. Hex and rgb()/hsl() are not.
    // Assembled from fragments so this file does not itself contain a hex
    // literal, which `tokens.test.ts` would rightly flag.
    const hex = new RegExp(`#${'[0-9a-fA-F]'}{3,8}`)
    const func = new RegExp(`\\b${'(rgba?|hsla?)'}$\\(`)
    if (hex.test(style) || func.test(style)) offenders.push(`${el.tagName}[style="${style}"]`)
  }
  return offenders
}

describe('no inline colour literals', () => {
  it('renders the home page without a colour in any style attribute', () => {
    const { container } = renderAt('/', '/', <Home />)
    expect(literalColours(container)).toEqual([])
  })

  it('renders a full tool without a colour in any style attribute', () => {
    // IsLmExplorer is the heaviest tool: five notes, a stat grid, a filled
    // slider track, and four Recharts surfaces.
    const { container } = render(
      <RouterProvider
        router={createMemoryRouter([{ path: '/', element: <IsLmExplorer /> }], {
          initialEntries: ['/'],
        })}
      />,
    )
    expect(literalColours(container)).toEqual([])
    // The filled-track custom property is a number, and must be present.
    expect(container.querySelector<HTMLElement>('.slider-input')?.style.getPropertyValue('--pct')).toMatch(
      /%$/,
    )
  })
})

describe('chart series configuration', () => {
  it('exports the Recharts series by identity, not as wrappers', () => {
    // Recharts locates the series to plot by comparing child element types
    // against its own `Line` / `Area` / ... by reference. A wrapper component
    // that renders one inside is invisible to it: the chart renders axes and
    // grid, then silently plots nothing. Guarding this is the only cheap way to
    // catch a re-introduction of the wrapper form.
    expect(ChartLine).toBe(Line)
    expect(ChartArea).toBe(Area)
    expect(ChartBar).toBe(Bar)
    expect(ChartScatter).toBe(Scatter)
    expect(ChartPie).toBe(Pie)
  })

  it('disables series animation and sets a stroke weight by default', () => {
    // Guards the fix for the slider-drag stutter: if this ever stops being
    // applied, ~120 charts quietly re-animate on every frame again and no
    // other suite notices.
    for (const Series of [Line, Area, Bar, Scatter, Pie]) {
      expect(Series.defaultProps).toMatchObject({ isAnimationActive: false, strokeWidth: 2.25 })
    }
  })
})
