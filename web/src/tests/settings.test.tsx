import type { ReactElement } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { Link, MemoryRouter } from 'react-router-dom'
import SettingsControl from '../components/SettingsPanel'
import ThemeToggle from '../layout/ThemeToggle'
import {
  DEFAULT_PREFERENCES,
  PREF_STORAGE_KEY,
  PREF_STORAGE_VERSION,
  usePreferences,
} from '../lib/preferences'

/**
 * The settings panel is the only part of the preferences layer a reader ever
 * touches, so these tests are about the two things nothing else can check for
 * it: that every control is reachable and correctly labelled by keyboard
 * alone, and that what it writes actually lands in the store and in storage.
 *
 * `fireEvent` throughout, not `userEvent`: `@testing-library/user-event` is not
 * a dependency of this project and adding one for a settings panel would be a
 * heavier change than the feature. jsdom has no layout engine, so the panel's
 * focus trap falls back to its no-layout branch (see `HAS_LAYOUT` in
 * `SettingsPanel.tsx`) and the trap boundaries can be asserted directly instead
 * of being wished for.
 */

afterEach(cleanup)

beforeEach(() => {
  window.localStorage.clear()
  usePreferences.setState({ ...DEFAULT_PREFERENCES })
  document.documentElement.removeAttribute('data-pref-theme')
  document.documentElement.classList.remove('dark')
})

/** The panel reads the location, so every case renders inside a router. */
function renderControl(children: ReactElement = <SettingsControl />) {
  return render(<MemoryRouter>{children}</MemoryRouter>)
}

function trigger(): HTMLElement {
  return screen.getByRole('button', { name: 'Reading and display settings' })
}

function openPanel(): HTMLElement {
  fireEvent.click(trigger())
  return screen.getByRole('dialog', { name: 'Reading and display settings' })
}

/** One multi-option row, by its visible label. */
function row(panel: HTMLElement, name: string): HTMLElement {
  return within(panel).getByRole('radiogroup', { name })
}

/** One option within a row, by its own label. Scoped, because "Normal" and
 *  "System" each appear on two different rows. */
function option(
  panel: HTMLElement,
  rowName: string,
  optionName: string
): HTMLElement {
  return within(row(panel, rowName)).getByRole('radio', { name: optionName })
}

function storedPrefs(): Record<string, unknown> {
  const raw = window.localStorage.getItem(PREF_STORAGE_KEY)
  expect(raw, 'preferences were not persisted').toBeTruthy()
  return (JSON.parse(raw as string) as { prefs: Record<string, unknown> }).prefs
}

describe('settings trigger', () => {
  it('is a labelled dialog trigger that reports its state', () => {
    renderControl()
    const button = trigger()
    expect(button).toHaveAttribute('aria-haspopup', 'dialog')
    expect(button).toHaveAttribute('title', 'Reading and display settings')
    expect(button.getAttribute('aria-controls')).toBeTruthy()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('toggles the panel and reflects the state on the trigger', () => {
    renderControl()
    fireEvent.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(trigger())
    expect(trigger()).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('is rendered at every breakpoint rather than hidden below `sm`', () => {
    // The header drops its GitHub link below `sm`; the settings control is the
    // one thing that must survive, because it is the only route to the
    // preferences on a phone.
    renderControl()
    expect(trigger().className).not.toMatch(/\bhidden\b/)
  })
})

describe('settings panel semantics', () => {
  it('is a non-modal dialog, deliberately', () => {
    // `aria-modal` is asserted absent, not merely unset: a panel that claimed
    // to be modal while leaving the page live and focusable would lie to
    // assistive technology about what is still reachable.
    renderControl()
    const panel = openPanel()
    expect(panel).not.toHaveAttribute('aria-modal')
    expect(panel.tabIndex).toBe(-1)
    // Focus moves in on open, so the reader is inside the dialog immediately
    // rather than still on the trigger with Tab to discover the panel.
    expect(panel).toHaveFocus()
  })

  it('names and explains every multi-option row', () => {
    renderControl()
    const panel = openPanel()
    const groups = within(panel).getAllByRole('radiogroup')
    expect(groups).toHaveLength(6)
    for (const group of groups) {
      const labelId = group.getAttribute('aria-labelledby') as string
      const descriptionId = group.getAttribute('aria-describedby') as string
      expect(
        document.getElementById(labelId)?.textContent,
        'row label'
      ).toBeTruthy()
      expect(
        document.getElementById(descriptionId)?.textContent,
        'row description'
      ).toBeTruthy()
    }
  })

  it('exposes the two booleans as switches with a name and a description', () => {
    renderControl()
    const panel = openPanel()
    for (const name of ['Chart grid lines', 'Focus mode']) {
      const control = within(panel).getByRole('switch', { name })
      const describedBy = control.getAttribute('aria-describedby') as string
      expect(
        document.getElementById(describedBy)?.textContent,
        name
      ).toBeTruthy()
    }
  })

  it('builds the text size row out of the four exact stops', () => {
    // Exact stops, not a continuous range: the store validates against
    // `TEXT_SCALES`, and a value between two stops would be one the stylesheet
    // has no mapping for.
    renderControl()
    const panel = openPanel()
    const group = row(panel, 'Text size (%)')
    const radios = within(group).getAllByRole('radio')
    expect(radios.map((radio) => (radio as HTMLInputElement).value)).toEqual([
      '0.9',
      '1',
      '1.15',
      '1.3',
    ])
  })

  it('names each text size option with its unit, though the cell omits it', () => {
    // The cells drop the percent sign so that `130%` is not the first thing
    // clipped at a 130% text scale on a 390px phone, and each option's
    // accessible name puts it back. WCAG 2.5.3 is satisfied either way: the
    // name still contains the visible text.
    renderControl()
    const panel = openPanel()
    const group = row(panel, 'Text size (%)')
    const radios = within(group).getAllByRole('radio') as HTMLInputElement[]
    // The label's first span is the visible cell text; the rest of the label
    // holds the check glyph that marks the selected option.
    expect(
      radios.map((radio) => radio.labels?.[0]?.firstElementChild?.textContent)
    ).toEqual(['90', '100', '115', '130'])
    for (const name of ['90%', '100%', '115%', '130%']) {
      expect(within(group).getByRole('radio', { name })).toBeInTheDocument()
    }
  })

  it('shares one radio group per row, so the browser sees one control per preference', () => {
    renderControl()
    const panel = openPanel()
    for (const name of [
      'Appearance',
      'Reading width',
      'Line spacing',
      'Density',
      'Motion',
    ]) {
      const inputs = Array.from(
        row(panel, name).querySelectorAll<HTMLInputElement>(
          'input[type="radio"]'
        )
      )
      expect(inputs.length).toBeGreaterThan(1)
      expect(
        new Set(inputs.map((input) => input.name)).size,
        `${name} group`
      ).toBe(1)
    }
  })
})

describe('settings panel dismissal', () => {
  it('closes on Escape and returns focus to the trigger', () => {
    renderControl()
    const button = trigger()
    fireEvent.click(button)
    const panel = screen.getByRole('dialog')
    expect(panel).toHaveFocus()

    fireEvent.keyDown(panel, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(button).toHaveFocus()
  })

  it('traps Tab inside the panel and wraps at both ends', () => {
    renderControl()
    fireEvent.click(trigger())
    const panel = screen.getByRole('dialog')
    const close = within(panel).getByRole('button', { name: 'Close settings' })
    const reset = within(panel).getByRole('button', { name: 'Reset' })

    // Reset is disabled at the defaults, and a disabled control is correctly
    // absent from the tab ring — so make the panel non-default first, and the
    // trap has to cope with the ring changing rather than trapping on a dead
    // element.
    fireEvent.click(within(panel).getByRole('switch', { name: 'Focus mode' }))
    expect(reset).toBeEnabled()

    reset.focus()
    fireEvent.keyDown(reset, { key: 'Tab' })
    expect(close).toHaveFocus()

    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true })
    expect(reset).toHaveFocus()

    // Shift+Tab from the panel container itself, which is where focus lands on
    // open, has to wrap forward rather than out of the dialog.
    panel.focus()
    fireEvent.keyDown(panel, { key: 'Tab', shiftKey: true })
    expect(reset).toHaveFocus()
  })

  it('closes on an outside pointerdown but not on one that starts inside', () => {
    renderControl()
    fireEvent.click(trigger())
    const panel = screen.getByRole('dialog')

    fireEvent.pointerDown(row(panel, 'Density'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on a route change so nothing is left floating over a new page', () => {
    renderControl(
      <>
        <Link to="/syllabus">Syllabus</Link>
        <SettingsControl />
      </>
    )
    fireEvent.click(trigger())
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Syllabus' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})

describe('settings panel writes through', () => {
  it('stores a segmented choice and persists it', () => {
    renderControl()
    const panel = openPanel()
    fireEvent.click(option(panel, 'Reading width', 'Wide'))

    expect(usePreferences.getState().measure).toBe('wide')
    expect(storedPrefs().measure).toBe('wide')
    expect(option(panel, 'Reading width', 'Wide')).toBeChecked()
    expect(option(panel, 'Reading width', 'Normal')).not.toBeChecked()
  })

  it('persists an exact text scale rather than a free value', () => {
    renderControl()
    const panel = openPanel()
    fireEvent.click(option(panel, 'Text size (%)', '130%'))

    expect(usePreferences.getState().textScale).toBe(1.3)
    expect(storedPrefs().textScale).toBe(1.3)
  })

  it('moves through a row with the arrow keys, selecting as it goes', () => {
    renderControl()
    const panel = openPanel()
    const radios = within(row(panel, 'Density')).getAllByRole('radio')

    radios[0].focus()
    fireEvent.keyDown(radios[0], { key: 'ArrowRight' })
    expect(radios[1]).toHaveFocus()
    expect(usePreferences.getState().density).toBe('comfortable')

    fireEvent.keyDown(radios[1], { key: 'End' })
    expect(radios[2]).toHaveFocus()
    expect(usePreferences.getState().density).toBe('spacious')

    // Past the last option the walk wraps to the first, which the native
    // browser behaviour stops short of doing.
    fireEvent.keyDown(radios[2], { key: 'ArrowRight' })
    expect(radios[0]).toHaveFocus()
    expect(usePreferences.getState().density).toBe('compact')

    fireEvent.keyDown(radios[0], { key: 'ArrowLeft' })
    expect(radios[2]).toHaveFocus()
    expect(usePreferences.getState().density).toBe('spacious')
  })

  it('toggles the booleans through the store', () => {
    renderControl()
    const panel = openPanel()
    const focusMode = within(panel).getByRole('switch', { name: 'Focus mode' })
    const grid = within(panel).getByRole('switch', { name: 'Chart grid lines' })
    expect(focusMode).not.toBeChecked()
    expect(grid).toBeChecked()

    fireEvent.click(focusMode)
    expect(usePreferences.getState().focusMode).toBe(true)
    expect(storedPrefs().focusMode).toBe(true)
    expect(
      within(panel).getByRole('switch', { name: 'Focus mode' })
    ).toBeChecked()

    fireEvent.click(grid)
    expect(usePreferences.getState().chartGrid).toBe(false)
    expect(storedPrefs().chartGrid).toBe(false)
  })

  it('resets to the defaults and disables itself once there', () => {
    renderControl()
    const panel = openPanel()
    expect(within(panel).getByRole('button', { name: 'Reset' })).toBeDisabled()

    fireEvent.click(option(panel, 'Line spacing', 'Relaxed'))
    fireEvent.click(within(panel).getByRole('switch', { name: 'Focus mode' }))
    expect(within(panel).getByRole('button', { name: 'Reset' })).toBeEnabled()

    fireEvent.click(within(panel).getByRole('button', { name: 'Reset' }))
    expect(usePreferences.getState()).toMatchObject({ ...DEFAULT_PREFERENCES })
    expect(storedPrefs()).toMatchObject({ ...DEFAULT_PREFERENCES })
    expect(
      JSON.parse(window.localStorage.getItem(PREF_STORAGE_KEY) as string).v
    ).toBe(PREF_STORAGE_VERSION)
    // Re-query: the button handle is stale once React has re-rendered with the
    // value that disabled it.
    expect(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Reset' })
    ).toBeDisabled()
  })

  it('hands focus somewhere real when Reset disables the button under it', () => {
    // A disabled button cannot hold focus, so without this the reader's focus
    // would land on the body and Tab would restart from the top of the page.
    renderControl()
    const panel = openPanel()
    fireEvent.click(within(panel).getByRole('switch', { name: 'Focus mode' }))
    within(panel).getByRole('button', { name: 'Reset' }).focus()

    fireEvent.click(within(panel).getByRole('button', { name: 'Reset' }))
    expect(
      within(screen.getByRole('dialog')).getByRole('button', {
        name: 'Close settings',
      })
    ).toHaveFocus()
  })
})

describe('theme is one preference with two controls', () => {
  function both() {
    return (
      <>
        <ThemeToggle />
        <SettingsControl />
      </>
    )
  }

  it('keeps the header toggle and the panel row in step, in both directions', () => {
    renderControl(both())
    const panel = openPanel()
    expect(option(panel, 'Appearance', 'System')).toBeChecked()

    // Panel -> header.
    fireEvent.click(option(panel, 'Appearance', 'Dark'))
    expect(usePreferences.getState().theme).toBe('dark')
    expect(
      screen.getByRole('button', {
        name: 'Theme: dark, always dark. Switch to system.',
      })
    ).toBeInTheDocument()
    expect(option(panel, 'Appearance', 'Dark')).toBeChecked()

    // Header -> panel. The header control cycles all three states, so System
    // stays reachable from it; a two-state flip could never get back there.
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Theme: dark, always dark. Switch to system.',
      })
    )
    expect(usePreferences.getState().theme).toBe('system')
    expect(option(panel, 'Appearance', 'System')).toBeChecked()
  })

  it('persists a theme chosen in the panel', () => {
    renderControl(both())
    const panel = openPanel()
    fireEvent.click(option(panel, 'Appearance', 'Dark'))

    // `startPreferenceSync` is what carries the store onto <html>; the panel
    // writes to the store and nothing else, so the wiring is asserted here
    // rather than assumed.
    expect(usePreferences.getState().theme).toBe('dark')
    expect(storedPrefs().theme).toBe('dark')
  })

  it('names the theme it will switch to, so a cycle is not a guess', () => {
    renderControl(<ThemeToggle />)
    expect(
      screen.getByRole('button', {
        name: 'Theme: system, follows your system. Switch to light.',
      })
    ).toBeInTheDocument()
  })
})
