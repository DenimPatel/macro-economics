import { useCallback, useEffect, useState } from 'react'
import {
  PREF_STORAGE_KEY,
  getSystemTheme,
  readPreferences,
  resolveTheme,
  subscribeSystemTheme,
  usePreferences,
} from '../lib/preferences'
import type { ThemePref } from '../lib/preferences'
import type { Theme } from '../design/tokens'

/**
 * React facade over the preference store's theme.
 *
 * The theme used to be its own source of truth here — a `macro-theme` key, a
 * `useState` copy, and a hand-written reading of the OS query. It is now one
 * field of `Preferences`, resolved in `lib/preferences.ts` and shared with
 * the no-flash script in `web/index.html`. This module keeps the old three
 * names working (`getInitialTheme`, `applyTheme`, `useTheme`) so nothing that
 * imported them has to change, and `ThemeToggle.tsx` is untouched.
 */

export type { Theme }
export { applyTheme, readPreferences } from '../lib/preferences'

/**
 * The theme is persisted inside the preferences envelope, not on its own.
 * Retained as an export because it used to name the storage key; nothing
 * writes a theme key of its own any more.
 */
export const STORAGE_KEY = PREF_STORAGE_KEY

/** The theme actually in effect: the preference, or the OS when it defers. */
export function getInitialTheme(): Theme {
  return resolveTheme(readPreferences().theme)
}

/**
 * The order the header toggle cycles the theme in: system, light, dark, back
 * to system. It is a cycle rather than a flip because the preference has three
 * values, and a two-state toggle can only ever reach two of them — a reader
 * who picked System in the settings panel could never get back to it from the
 * header. `nextTheme` is exported so the toggle's label can name the state the
 * click will land on without the order being written down twice.
 */
const THEME_CYCLE: Record<ThemePref, ThemePref> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

export function nextTheme(pref: ThemePref): ThemePref {
  return THEME_CYCLE[pref]
}

/**
 * Read the effective theme and toggle between light and dark.
 *
 * Toggling out of `'system'` writes an explicit choice, which is the only
 * thing a two-state toggle can mean: `'system'` is a deferral, not a third
 * colour. A live OS change repaints through `subscribeSystemTheme`, so the
 * icon here and the document both follow the OS while the preference is
 * `'system'`.
 *
 * `cycle` is the control the header actually uses, and `toggle` stays for a
 * caller that genuinely only wants the two explicit values. Both write the same
 * field through the same store, which is what keeps the toggle and the
 * settings panel's Appearance row from ever disagreeing.
 */
export function useTheme(): {
  theme: Theme
  pref: ThemePref
  cycle: () => void
  toggle: () => void
} {
  const pref = usePreferences((state) => state.theme)
  const [systemTheme, setSystemTheme] = useState<Theme>(getSystemTheme)
  const setPref = usePreferences((state) => state.set)

  useEffect(() => subscribeSystemTheme(setSystemTheme), [])

  const theme: Theme = pref === 'system' ? systemTheme : pref
  const toggle = useCallback(
    () => setPref('theme', theme === 'dark' ? 'light' : 'dark'),
    [setPref, theme],
  )
  const cycle = useCallback(() => setPref('theme', nextTheme(pref)), [setPref, pref])

  return { theme, pref, cycle, toggle }
}
