import { Monitor, Moon, Sun } from 'lucide-react'
import { nextTheme, useTheme } from './theme'
import type { ThemePref } from '../lib/preferences'

const LABEL: Record<ThemePref, string> = {
  light: 'light',
  dark: 'dark',
  system: 'system',
}

/**
 * What each state actually does, in the words a reader would use. The icon
 * shows the *preference*, not the resolved theme, so a reader who has chosen
 * System can see that they have: a moon here would claim an explicit choice
 * they did not make.
 */
const HINT: Record<ThemePref, string> = {
  light: 'always light',
  dark: 'always dark',
  system: 'follows your system',
}

/**
 * The quick theme control in the header: a three-state cycle rather than a
 * two-state flip.
 *
 * The theme is also editable as a row in the settings panel, and that used to
 * be two controls for one preference with different reach — a flip could only
 * ever produce an explicit light or dark, so a reader who had put the theme
 * back to System in the panel had no way back from the header. Both now write
 * `theme` through the one store, both read it back from there, and both can
 * reach all three states, so neither is a privileged path to the preference.
 *
 * The accessible name carries the current state *and* the state the next click
 * lands on, which is the part a cycle cannot show visually.
 */
export default function ThemeToggle() {
  const { pref, cycle } = useTheme()
  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${LABEL[pref]}, ${HINT[pref]}. Switch to ${LABEL[nextTheme(pref)]}.`}
      title={`Theme: ${LABEL[pref]} — switch to ${LABEL[nextTheme(pref)]}`}
      // `h-9 w-9` and not a spacing step: a header control is a 36px hit
      // area that the density preference must not be able to shrink.
      //
      // `hit-44` is the other half of that sentence. 36x36 clears WCAG 2.5.8
      // and misses the 44px guideline; the class adds 4px of transparent hit
      // area on every side through a pseudo-element, so the box a reader sees
      // stays 36px and the box a finger gets is 44px. The header's controls sit
      // in a `gap-2` (8px) row, so 4px of slop on each side meets the
      // neighbour's own 4px and touches nothing.
      //
      // `pref-tap` carries the transition and the suppressed tap flash;
      // `active:bg-surface` is the press state, and it is a FILL rather than
      // a further colour step because the icon changes on every click — the
      // reader has already been told the control responded, and a second,
      // quieter press signal on top of a different glyph is noise.
      //
      // There is no "selected" state here and there should not be one. This
      // is a three-state CYCLE, not a toggle: `aria-pressed` would claim a
      // binary on/off that the control does not have, and a filled resting
      // state would claim a choice the reader has not made. The current
      // preference is in the accessible name and the icon, which is where a
      // cycle has to put it.
      className="hit-44 pref-tap tap-clear inline-flex h-9 w-9 items-center justify-center rounded-control border border-border bg-surface-2 text-fg-muted hover:text-fg active:bg-surface"
    >
      {pref === 'system' ? (
        <Monitor size={16} />
      ) : pref === 'dark' ? (
        <Moon size={16} />
      ) : (
        <Sun size={16} />
      )}
    </button>
  )
}
