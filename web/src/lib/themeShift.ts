/**
 * The theme cross-fade.
 *
 * A theme switch repaints every custom property in the document on one
 * frame, so the page used to snap from white to black. The animation itself
 * is CSS — `body.theme-shift-out::after` and `body.theme-shift-in::after`
 * in `index.css` — because a pseudo-element veil is the only cross-fade
 * that covers a document whose elements each set their own `color` and
 * `background-color`, and the only one that can do so without leaving a
 * compositing layer on all of them.
 *
 * This module owns the half CSS cannot: WHEN to run it, WHEN to stop, and
 * what happens when the reader toggles the theme four times in a row.
 *
 * ## The failure modes this exists to survive
 *
 * **Left mid-transition.** A veil removed by a timer nobody cleared, or by
 * an `animationend` that never fires, is a full-viewport opaque rectangle
 * over the site. Three things have to hold for that to be impossible and all
 * three are here: the cleanup listens for `animationend` AND
 * `animationcancel`, a run counter discards handlers belonging to a
 * superseded run, and a wall-clock backstop fires regardless of whether any
 * event arrived. Under reduced motion the CSS rules are gated out of
 * existence by a selector, so there is nothing to leave behind in the first
 * place.
 *
 * **A rapid second toggle landing mid-fade.** `beginThemeShift` removes
 * both classes before starting, which cancels the in-flight animation and
 * fires `animationcancel` — handled by the same cleanup. The new run then
 * fades the veil in again. The reader sees a veil that dips and recovers,
 * not a page frozen at half brightness.
 *
 * **The first paint.** Nothing here runs at import time or at boot. The
 * classes are added at the instant of a toggle, and the no-flash script in
 * `index.html` has never heard of them, so a cold load paints exactly as it
 * did before this module existed.
 *
 * **Reduced motion.** `shouldCrossFade` reads `--pref-motion-scale` from
 * the computed style of `<html>` rather than re-implementing either half of
 * the preference. That is the point of reading the custom property: it is
 * already `0` for `motion: 'reduced'` AND for the OS asking, so this module
 * cannot disagree with `index.css` about when motion is allowed.
 *
 * **jsdom.** There is no layout and no animation engine, so an unmocked
 * module here would leave a pending timer in every test that touches the
 * theme. The same `getClientRects` probe `SettingsPanel` uses tells the two
 * environments apart, and without layout the fade is skipped outright — which
 * is also the correct behaviour for a document that cannot animate.
 */

/** Classes written to `<body>`, in the order they are used. */
const OUT_CLASS = 'theme-shift-out'
const IN_CLASS = 'theme-shift-in'

/**
 * Wall-clock backstop. Comfortably longer than `--dur-fast` + `--dur-base`
 * (120ms + 150ms), so it only ever fires when the animation events genuinely
 * did not arrive — a backgrounded tab throttles the frame clock and can
 * deliver `animationend` very late.
 */
const BACKSTOP_MS = 600

/**
 * Monotonic run counter. Every scheduled callback checks that it still owns
 * the current run, which is what makes a superseded `animationend` a no-op
 * instead of a second teardown of somebody else's veil.
 */
let generation = 0

/**
 * Whether the document can animate at all.
 *
 * jsdom ships no layout engine, so every element there reports an empty box
 * list. This is the same probe as `SettingsPanel`'s `HAS_LAYOUT`, for the same
 * reason: a browser check and a jsdom check have to be told apart before
 * either of them is trusted.
 */
function hasLayout(): boolean {
  if (typeof document === 'undefined') return false
  const body = document.body
  return body !== null && body.getClientRects().length > 0
}

/**
 * Whether the reader has asked for a still page, by either route.
 *
 * `--pref-motion-scale` is `0` for `motion: 'reduced'` and for
 * `@media (prefers-reduced-motion: reduce)`, and `1` otherwise, so one
 * computed-style read covers both. Exported because this is the assertion
 * that matters: if the two halves of the preference ever stop setting it, the
 * fade would silently start playing for a reader who asked for stillness.
 */
export function shouldCrossFade(): boolean {
  if (typeof document === 'undefined') return false
  const root = document.documentElement
  if (!root) return false
  try {
    return getComputedStyle(root).getPropertyValue('--pref-motion-scale').trim() !== '0'
  } catch {
    return false
  }
}

/** What the veil is doing right now. `null` when nothing is running. */
export function activeThemeShift(): 'out' | 'in' | null {
  if (typeof document === 'undefined' || !document.body) return null
  if (document.body.classList.contains(OUT_CLASS)) return 'out'
  if (document.body.classList.contains(IN_CLASS)) return 'in'
  return null
}

/** Drop both classes. Exported so a test can assert the resting state. */
export function clearThemeShift(): void {
  if (typeof document === 'undefined' || !document.body) return
  document.body.classList.remove(OUT_CLASS)
  document.body.classList.remove(IN_CLASS)
}

/**
 * Cover the old theme, call `onCovered`, then uncover the new one.
 *
 * `onCovered` is where the theme class is flipped: the veil is already
 * painted in the DESTINATION canvas colour, because `--c-bg` re-resolves the
 * instant `.dark` lands, so the swap has to happen while the veil is fully
 * opaque or the page would be seen half-and-half.
 *
 * Returns `true` when the fade is running and `onCovered` WILL be called, and
 * `false` when it was skipped — the caller then applies the theme itself.
 */
export function beginThemeShift(onCovered: () => void): boolean {
  if (typeof document === 'undefined' || !document.body) return false
  if (!hasLayout() || !shouldCrossFade()) return false

  generation += 1
  const run = generation
  let settled = false

  // Cancels whatever was in flight and fires `animationcancel` on it, whose
  // handler is a no-op because its run is now stale.
  clearThemeShift()
  document.body.classList.add(OUT_CLASS)

  const finish = () => {
    if (settled || run !== generation) return
    settled = true
    // Out-phase done: the veil is opaque, so this is the moment to swap.
    onCovered()
    // And the theme is now in place behind an opaque veil, so uncover it.
    if (run !== generation) return
    document.body.classList.remove(OUT_CLASS)
    document.body.classList.add(IN_CLASS)
    const end = () => {
      if (run !== generation) return
      document.body.classList.remove(IN_CLASS)
    }
    document.body.addEventListener('animationend', end, { once: true })
    document.body.addEventListener('animationcancel', end, { once: true })
    window.setTimeout(end, BACKSTOP_MS)
  }

  document.body.addEventListener('animationend', finish, { once: true })
  document.body.addEventListener('animationcancel', finish, { once: true })
  // A reader who navigates, or a tab that goes to the background, can leave
  // the out-phase with no event at all. Without this the veil stays.
  window.setTimeout(finish, BACKSTOP_MS)
  return true
}
