import { useEffect } from 'react'
import { Minimize2 } from 'lucide-react'
import { usePreferences } from '../lib/preferences'

/**
 * The way out of focus mode.
 *
 * Focus mode may never hide the sidebar, header, or footer — a keyboard user
 * who cannot see the nav has no route out of a preference they did not know
 * they turned on. So the exit has to be *imminent* rather than merely
 * available, and this component is that: a labelled button that only exists
 * while focus mode is on, carrying the same Escape chord that the document
 * listener below implements. Mounting the button and the shortcut together
 * means neither can outlive the state they belong to.
 */
export default function FocusModeExit() {
  const { focusMode, set } = usePreferences()

  useEffect(() => {
    if (!focusMode) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (event.ctrlKey || event.metaKey || event.altKey) return
      // A modal owns Escape while it is open: the mobile nav drawer closes
      // itself on the same key. The settings panel needs no guard because its
      // own handler calls stopPropagation before the event reaches document.
      if (document.querySelector('[aria-modal="true"]')) return
      set('focusMode', false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [focusMode, set])

  if (!focusMode) return null

  // Plain .button, not .button-primary: the accent is reserved for interaction
  // state and is never a fill, and a bordered button in the header is already
  // the most obvious thing there to press.
  return (
    <button
      type="button"
      onClick={() => set('focusMode', false)}
      // `hit-44` because this is the one header control that carries a text
      // label, and a labelled box is a wider box: it takes 64.4px of the
      // header's row at 130% text against 46.8px for the two icon-only
      // controls, which is what squeezes the breadcrumb to two characters at
      // 320px. The class adds 4px of transparent reach on every side, so the
      // 39.2px box becomes a 44px target without the row losing another 9.8px
      // to it. `shrink-0` is the header row's job, not this button's, and the
      // parent already carries it.
      className="hit-44 button border-accent text-accent-ink"
      aria-label="Exit focus mode"
      title="Exit focus mode (Escape)"
    >
      <Minimize2 className="h-4 w-4" />
      <span className="hidden sm:inline">Focus</span>
      <kbd className="hidden rounded border border-border-strong px-1 text-micro text-fg-muted sm:inline">
        Esc
      </kbd>
    </button>
  )
}
