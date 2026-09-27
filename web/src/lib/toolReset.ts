/**
 * Reset, for a tool's controls.
 *
 * Five of the twenty tools had a reset button and the other fifteen did
 * not, which is a worse split than it looks: the reader who has dragged a
 * slider through a long comparison and wants the tool's starting point back
 * finds it on five pages out of twenty. More to the point, the five were
 * written the same way and were already drifting.
 *
 * Every one of them was a hand-written `resetToDefault` that re-typed the
 * default values:
 *
 *   const [savingsRate, setSavingsRate] = useState(0.2)   // <- one copy
 *   const resetToDefault = () => { setSavingsRate(0.2) }  // <- another
 *
 * Two literals for one number, in two files' worth of lines, with nothing
 * connecting them. A default changed during a model revision updates the
 * `useState` (it is the one under the cursor) and silently does not update
 * the reset, so "Reset to defaults" returns to a value the tool no longer
 * uses and looks like it worked.
 *
 * This hook removes the second copy rather than trying to police it. A tool
 * declares ONE `DEFAULTS` object, its `useState` calls read from that
 * object, and it passes the same object here. `dirty` is derived from a
 * comparison on every render instead of being tracked with a flag, so a
 * control that is dragged back to its default disables the button on its
 * own — and a tool that adds a control without listing it in `DEFAULTS`
 * simply never resets that control, which fails visibly instead of
 * quietly.
 */

/** A value a tool control can hold. */
export type ToolValue = number | string | boolean

export interface ToolReset {
  reset: () => void
  /** False when every control listed in the defaults is already there. */
  dirty: boolean
}

/**
 * `set` + the value's name, so a tool's call site reads exactly like its
 * declarations:
 *
 *   const [G_a, setG_a] = useState(DEFAULTS.G_a)
 *   useToolReset({ G_a, T_a }, { setG_a, setT_a }, DEFAULTS)
 *
 * The key is derived from the value's key rather than typed out, so adding a
 * control to `current` without adding its setter is a type error at the call
 * site instead of a control that silently never resets.
 */
export type ToolSetters<V> = {
  [K in keyof V as `set${Capitalize<string & K>}`]: (value: V[K]) => void
}

export function useToolReset<V extends Record<string, ToolValue>>(
  current: V,
  setters: ToolSetters<V>,
  defaults: V,
): ToolReset {
  const keys = Object.keys(defaults) as (keyof V)[]

  const reset = () => {
    for (const key of keys) {
      const label = String(key)
      const name = `set${label.charAt(0).toUpperCase()}${label.slice(1)}` as keyof ToolSetters<V>
      const set = setters[name]
      if (set) (set as (value: V[keyof V]) => void)(defaults[key])
    }
  }

  const dirty = keys.some((key) => current[key] !== defaults[key])

  return { reset, dirty }
}
