/**
 * The registry a share link is built from, and the reason a share link can
 * be trusted.
 *
 * A scenario link is a promise: "open this and the sliders sit where I left
 * them". For a long time nothing on this site kept that promise in either
 * direction — `ToolPage` encoded whatever sat in the store, the store was
 * never written, and a `?s=` arriving in the URL was never read. The button
 * said "Copy scenario link" and copied a link with nothing in it.
 *
 * The obvious fix is a per-tool spec: a flat record of every control's key,
 * bounds and setter, hand-written beside each tool. That was measured before
 * it was written, and the measurement is why this file exists instead. The
 * bounds of a control live in exactly one place — the `min` / `max` props on
 * its `SliderControl` — and there are 119 of those call sites across the
 * twenty tools. A spec would have to transcribe all of them, which is the
 * "two literals for one number" hazard `lib/toolReset.ts` was written to
 * delete, and the failure mode of a mistyped bound is worse than a missing
 * feature: the link opens, it looks authoritative, and it shows a tool
 * configured to values the sharer never saw.
 *
 * So the registry is fed by the control itself. `SliderControl` and
 * `NumberInput` already hold the number, the bounds and the setter as props;
 * registering on mount costs one effect and no new prop, and a control can
 * then never be encoded at a bound it does not enforce, because the bound
 * being encoded IS the bound the input uses. Adding a control to a tool adds
 * it to the link. Forgetting one is not expressible.
 *
 * `key` is the control's label by default, because that is the only
 * per-control identifier on all 119 call sites today. A tool with two
 * identically-labelled controls passes `paramKey` to disambiguate — measured
 * across all twenty tool pages, exactly one tool needs it: `IsLmExplorer`
 * carries an IS-LM panel and an IS-PC panel whose four shared labels
 * ("Government Spending (G)", "Taxes (T)", "Money Supply (M)", "Price Level
 * (P)") have DIFFERENT bounds, so one label cannot name one parameter.
 *
 * A collision nobody disambiguates is refused rather than guessed. An
 * ambiguous key is left out of the link and counted, so the page can report
 * "10 of 12" instead of quietly encoding whichever panel mounted last — a link
 * that opens, looks authoritative, and configures the wrong panel is worse
 * than one that admits it is incomplete.
 *
 * Scope is one mounted tool. `ToolPage` clears the registry when the page
 * unmounts, so a control from a tool the reader has navigated away from can
 * never be encoded into a link for the tool in front of them.
 */
import type { ScenarioParams } from '../store'

export interface RegisteredControl {
  key: string
  /**
   * The label the reader sees, kept alongside the key so a payload can be
   * resolved by either.
   *
   * `paramKey` is how one parameter keeps one identity while wearing two
   * labels — `FiscalPolicyExperiments` mounts "Change in Autonomous
   * Consumption", "Change in Government Spending" and "Change in Spending" on
   * three panels, all backed by the same state, and a link built on one panel
   * could not be applied on another because the key in the payload was not
   * among the keys mounted. One key fixes that. But the key is then not the
   * text on the control, and a reader — or a test, or a link written before
   * the change — still says the label. Resolving by both is what keeps the
   * key an identity without making the label a second, competing one.
   */
  label: string
  min: number
  max: number
  /** The value the control holds right now. */
  get: () => number
  /** Commit a value, already clamped to the control's own bounds. */
  set: (value: number) => void
}

const controls = new Map<string, RegisteredControl[]>()
const listeners = new Set<() => void>()

/**
 * Every mounted control whose visible label is `label`, in insertion order.
 * A label with more than one owner resolves to nothing, for the same reason an
 * ambiguous key does.
 */
function controlsByLabel(label: string): RegisteredControl[] {
  return registeredControls().filter((control) => control.label === label)
}

function notify(): void {
  for (const listener of listeners) listener()
}

/** Register a control. The returned function unregisters it. */
export function registerControl(control: RegisteredControl): () => void {
  const existing = controls.get(control.key)
  if (existing) existing.push(control)
  else controls.set(control.key, [control])
  notify()
  return () => {
    const list = controls.get(control.key)
    if (!list) return
    const at = list.indexOf(control)
    // Only remove the registration this cleanup owns. React remounts a
    // control (a conditional panel, a preset switch) by registering the new
    // one before the old one's cleanup runs, and an unconditional delete
    // would drop the live control and leave a link that silently omits it.
    if (at >= 0) list.splice(at, 1)
    if (list.length === 0) controls.delete(control.key)
    notify()
  }
}

/** Every control currently mounted, in insertion order. */
export function registeredControls(): RegisteredControl[] {
  return [...controls.values()].flat()
}

/** Keys claimed by more than one mounted control, which cannot be shared. */
export function ambiguousKeys(): string[] {
  return [...controls.entries()].filter(([, list]) => list.length > 1).map(([key]) => key)
}

/** The values a share link should carry. Ambiguous keys are left out. */
export function snapshotControls(): ScenarioParams {
  const params: ScenarioParams = {}
  for (const [key, list] of controls) {
    if (list.length !== 1) continue
    const value = list[0].get()
    if (Number.isFinite(value)) params[key] = value
  }
  return params
}

/**
 * Apply an arriving scenario, clamped to the bounds of the control it names.
 *
 * `spent` accumulates the keys already handed to a control, so a control that
 * mounts late still receives its value while a control that remounts is not
 * driven a second time. Pass a fresh `Set` for a fresh application.
 *
 * Returns how many parameters reached a control. A key with no matching
 * control is ignored rather than invented: a link from a model revision that
 * has since dropped a control should leave the reader looking at the tool as
 * it is now, not at a control the link made up.
 */
export function applyScenarioParams(params: ScenarioParams, spent?: Set<string>): number {
  let applied = 0
  for (const [key, raw] of Object.entries(params)) {
    if (spent?.has(key)) continue
    // The key is the identity and is tried first. The label is the fallback,
    // so a payload that names what the reader sees still lands — which is the
    // case for every link written before a `paramKey` was added, and for the
    // one a reader types by hand.
    let list = controls.get(key)
    if (!list) {
      const byLabel = controlsByLabel(key)
      if (byLabel.length === 1) list = byLabel
    }
    // An ambiguous key has no single owner, so there is nothing to apply the
    // value TO. Ignoring it is the same rule as an unknown key: no control
    // moves, and the link restores everything it can name unambiguously.
    if (!list || list.length !== 1 || !Number.isFinite(raw)) continue
    const [control] = list
    const clamped = Math.min(Math.max(raw, control.min), control.max)
    control.set(clamped)
    spent?.add(key)
    applied++
  }
  return applied
}

/** Subscribe to control mount/unmount. `ToolPage` uses it to time the read. */
export function subscribeControls(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Drop every registration. Called when the tool page unmounts. */
export function clearControls(): void {
  controls.clear()
  notify()
}
