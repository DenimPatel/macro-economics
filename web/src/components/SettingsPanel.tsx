import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Check, Info, SlidersHorizontal, X } from 'lucide-react'
import clsx from 'clsx'
import {
  DEFAULT_PREFERENCES,
  LINE_HEIGHT_VALUE,
  MEASURE_CH,
  TEXT_SCALES,
  usePreferences,
} from '../lib/preferences'
import type {
  DensityPref,
  LineHeightPref,
  MeasurePref,
  MotionPref,
  Preferences,
  TextScale,
  ThemePref,
} from '../lib/preferences'

/**
 * The preferences control surface: one icon button in the sticky header, and
 * one floating panel that edits every reading preference in the same place.
 *
 * **It is deliberately NOT modal.** The panel is anchored to a button in a
 * header that never leaves the screen, it does not cover the page, and nothing
 * in it is destructive or long enough to justify locking the page behind a
 * veil. So it carries `role="dialog"` *without* `aria-modal`: the dialog
 * semantics (a labelled container, focus moved in on open, Tab cycling inside
 * it, Escape to leave) are all kept, and the reader keeps their place on the
 * page and their browser chrome while they flip a reading preference. A modal
 * here would cost a focus trap, a scroll lock, and a scrim to buy nothing.
 *
 * The trade is that focus is confined while the panel is open, so the trap, the
 * Escape handler, the outside-pointerdown handler, and the route-change close
 * are the whole dismissal story. Each is implemented below; none of them is
 * optional.
 *
 * The theme is edited here as well as by the header's `ThemeToggle`. Both write
 * the same field through the same store, both read it back from the same store,
 * and the toggle cycles all three states, so neither is a privileged path to
 * it — see `layout/ThemeToggle.tsx`.
 */

/* ------------------------------------------------------------------ *
 * Focus plumbing
 * ------------------------------------------------------------------ */

/** Elements that can hold focus. Same selector the navigation drawer uses. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * jsdom ships no layout engine, so every element there reports an empty box
 * list and `offsetParent` is always null. Probing the document body is how the
 * two environments are told apart: in a browser the box list is the honest
 * test for "is this thing actually on screen", and under jsdom the attribute
 * checks are all there is to go on. Without this the focus trap would find an
 * empty panel and quietly do nothing in tests, which is the one place it most
 * needs proving.
 */
const HAS_LAYOUT =
  typeof document !== 'undefined' && document.body.getClientRects().length > 0

function focusableWithin(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => {
      if (el.getAttribute('aria-hidden') === 'true') return false
      if (HAS_LAYOUT)
        return el.getClientRects().length > 0 || el === document.activeElement
      return true
    }
  )
}

/**
 * Distance from the trigger's own edge to the panel's edge. The trigger sits
 * 10px inside a 56px header, so 10px of margin seats the panel exactly on the
 * header's bottom border — connected to the header rather than emerging from
 * inside it — and the measurement below adds the other 10px so the max height
 * leaves the same gap at the viewport edge.
 */
const PANEL_GAP = 20
/** Below this the panel stops being a settings panel and becomes a sliver. */
const MIN_PANEL_HEIGHT = 160

/* ------------------------------------------------------------------ *
 * Option tables
 * ------------------------------------------------------------------ */

interface SegmentedOption<T extends string | number> {
  value: T
  label: string
  /**
   * Overrides the option's accessible name. Needed when the visible label is
   * abbreviated for width: WCAG 2.5.3 wants the accessible name to contain the
   * visible text, so a cell reading `130` is named `130%`.
   */
  ariaLabel?: string
}

const THEME_OPTIONS: SegmentedOption<ThemePref>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

const MEASURE_OPTIONS: SegmentedOption<MeasurePref>[] = [
  { value: 'narrow', label: 'Narrow' },
  { value: 'normal', label: 'Normal' },
  { value: 'wide', label: 'Wide' },
]

const LINE_HEIGHT_OPTIONS: SegmentedOption<LineHeightPref>[] = [
  { value: 'tight', label: 'Tight' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed' },
]

const DENSITY_OPTIONS: SegmentedOption<DensityPref>[] = [
  { value: 'compact', label: 'Compact' },
  // "Normal", not "Comfortable": it is what the store calls it, it is what the
  // other two middle options are called, and it is the only label in the panel
  // short enough to survive a 130% text scale on a 390px phone without being
  // clipped mid-word.
  { value: 'comfortable', label: 'Normal' },
  { value: 'spacious', label: 'Spacious' },
]

const MOTION_OPTIONS: SegmentedOption<MotionPref>[] = [
  { value: 'system', label: 'System' },
  { value: 'reduced', label: 'Reduced' },
  { value: 'full', label: 'Full' },
]

/** Descriptive word for each text scale, next to the percentage readout. */
const TEXT_SIZE_WORDS: Record<string, string> = {
  '0.9': 'Small',
  '1': 'Default',
  '1.15': 'Large',
  '1.3': 'Largest',
}

const TEXT_SIZE_OPTIONS: SegmentedOption<TextScale>[] = TEXT_SCALES.map(
  (scale) => ({
    value: scale,
    // Bare numbers, with the unit in the row label and in each option's
    // accessible name. `130%` in the cell is the first thing to be clipped when
    // a 130% text scale meets a 390px phone, and a clipped percentage is worse
    // than one that never claimed to have a sign.
    label: String(Math.round(scale * 100)),
    ariaLabel: `${Math.round(scale * 100)}%`,
  })
)

/* ------------------------------------------------------------------ *
 * Reduced motion, live
 * ------------------------------------------------------------------ */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function matchesReducedMotion(): boolean {
  try {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return false
    return window.matchMedia(REDUCED_MOTION_QUERY).matches
  } catch {
    return false
  }
}

/**
 * Whether the OS is currently asking for reduced motion.
 *
 * The motion row needs this to say out loud what `motion: 'full'` cannot do.
 * `full` deliberately does not override the OS query, because an OS-level
 * accessibility setting is not something a per-site toggle gets to overrule;
 * the consequence is that `full` and `system` render identically, and a control
 * that looked like it had overridden the OS while quietly not doing so would
 * be the dishonest option. So the panel states it instead of implying it.
 */
function useOsReducedMotion(): boolean {
  const [reduced, setReduced] = useState(matchesReducedMotion)

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return
    let mql: MediaQueryList
    try {
      mql = window.matchMedia(REDUCED_MOTION_QUERY)
    } catch {
      return
    }
    const onChange = () => setReduced(mql.matches)
    onChange()
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    }
    // Safari below 14.
    if (typeof mql.addListener === 'function') {
      mql.addListener(onChange)
      return () => mql.removeListener(onChange)
    }
    return
  }, [])

  return reduced
}

/* ------------------------------------------------------------------ *
 * Rows
 * ------------------------------------------------------------------ */

interface SegmentedProps<T extends string | number> {
  /** Also the radio group name, so the browser groups the inputs natively. */
  name: string
  label: string
  description: string
  /** Short value shown at the right of the label, e.g. a percentage. */
  readout?: string
  value: T
  options: SegmentedOption<T>[]
  onChange: (value: T) => void
}

/**
 * One multi-option row: a visible label, a plain-language explanation, and a
 * segmented control.
 *
 * The options are real `<input type="radio">` inside a `radiogroup`, clipped
 * out of sight with `sr-only` and drawn by their labels. That is not a
 * shortcut, it is the point: a native radio group brings single-selection, the
 * checked state, and arrow-key movement from the user agent, so a screen reader
 * announces "3 of 3, checked" and a keyboard walks the options with arrow keys
 * without a line of script. Only the focus ring has to be re-stated, because a
 * 1px-clipped input has nowhere to draw one — hence `peer-focus-visible` on the
 * label.
 *
 * Arrow keys are also handled explicitly, and `preventDefault` replaces the
 * native behaviour. Two reasons: the native walk stops at the ends of a group
 * rather than wrapping, and an explicit handler is the difference between a
 * behaviour that can be tested and one that can only be believed.
 */
function Segmented<T extends string | number>({
  name,
  label,
  description,
  readout,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  const labelId = `${name}-label`
  const descriptionId = `${name}-description`

  const onKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    const group = event.currentTarget.closest('[role="radiogroup"]')
    if (!group) return
    const inputs = Array.from(
      group.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    )
    const index = inputs.indexOf(event.currentTarget)
    if (index < 0) return
    const end = inputs.length - 1
    let next: number
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = index === end ? 0 : index + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        next = index === 0 ? end : index - 1
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = end
        break
      default:
        return
    }
    event.preventDefault()
    const target = inputs[next]
    target.focus()
    target.click()
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className="grid gap-1.5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-label-sm font-semibold text-fg">
          {label}
        </span>
        {readout && (
          <span className="shrink-0 text-micro font-semibold tabular-nums text-fg-subtle">
            {readout}
          </span>
        )}
      </div>
      <p id={descriptionId} className="text-xs leading-relaxed text-fg-muted">
        {description}
      </p>
      <div className="flex gap-1">
        {options.map((option) => {
          const id = `${name}-${option.value}`
          const selected = option.value === value
          return (
            <div key={String(option.value)} className="min-w-0 flex-1">
              <input
                type="radio"
                id={id}
                name={name}
                value={String(option.value)}
                aria-label={option.ariaLabel}
                checked={selected}
                onChange={() => onChange(option.value)}
                onKeyDown={onKeyDown}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={clsx(
                  // STRUCTURAL: a 28px option cell. Not on the scale, and
                  // not to be put on it — see the hit-area note in `:root`.
                  //
                  // `active:` is the press state and it moves the BORDER only
                  // for the selected cell, so a second tap on the choice
                  // already made still reads as a press. An unselected cell
                  // steps its background instead, which is the same
                  // `surface-2` the hover uses: there is no "darker than
                  // selected" fill to reach for, and inventing one would
                  // make the press look like a selection.
                  'pref-tap flex cursor-pointer items-center justify-center gap-1 rounded-md border px-1 py-1.5',
                  selected
                    ? 'border-border-strong bg-accent/10 font-semibold text-accent-ink active:border-fg-subtle'
                    : 'border-border font-medium text-fg-muted hover:bg-surface-2 hover:text-fg active:bg-surface-2',
                  'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2'
                )}
              >
                <span className="truncate text-xs leading-tight">
                  {option.label}
                </span>
                {selected && (
                  <Check
                    size={12}
                    strokeWidth={3}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                )}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SwitchRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/**
 * One on/off row. A real checkbox carrying `role="switch"`: "on" and "off"
 * rather than "checked", which is what a setting that takes effect the moment
 * you touch it actually is.
 *
 * The whole row is a `<label>`, so the description is part of the hit area, and
 * the input is named by `aria-labelledby` rather than by the label's own text —
 * otherwise the accessible name would be the title and the sentence under it
 * read as one thirty-word string.
 *
 * `active:opacity-80` is the press state. A native checkbox draws its own
 * pressed state under a pointer, but on touch the label is the target and
 * nothing about it acknowledged the tap — the whole row dims instead, which is
 * the same "fired" signal a switch gives.
 */
function SwitchRow({ label, description, checked, onChange }: SwitchRowProps) {
  const labelId = useId()
  const descriptionId = useId()
  return (
    <label className="tap-clear flex cursor-pointer items-start gap-2.5 transition-opacity active:opacity-80">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        className="mt-0.5 h-4 w-4 shrink-0 [accent-color:var(--c-accent)]"
      />
      <span className="grid gap-0.5">
        <span id={labelId} className="text-label-sm font-semibold text-fg">
          {label}
        </span>
        <span
          id={descriptionId}
          className="text-xs leading-relaxed text-fg-muted"
        >
          {description}
        </span>
      </span>
    </label>
  )
}

/* ------------------------------------------------------------------ *
 * Panel
 * ------------------------------------------------------------------ */

function isDefault(prefs: Preferences): boolean {
  return (Object.keys(DEFAULT_PREFERENCES) as (keyof Preferences)[]).every(
    (key) => prefs[key] === DEFAULT_PREFERENCES[key]
  )
}

interface Placement {
  side: 'below' | 'above'
  maxHeight: number
}

const PANEL_TITLE = 'Reading and display settings'

export default function SettingsControl() {
  const prefs = usePreferences()
  const { pathname } = useLocation()
  const osReduced = useOsReducedMotion()

  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<Placement | null>(null)

  const anchorRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const panelId = useId()
  const titleId = useId()

  const close = useCallback(() => setOpen(false), [])

  // Navigating away with a popover still open leaves it floating over a page
  // it no longer belongs to, so the route is a dismissal. Nothing is restored
  // here: the reader did not ask to leave, they asked to read somewhere else.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Move focus in on open, and hand it back to the trigger on close. The
  // element is captured now rather than read in the cleanup, which would race
  // with unmount — the same reasoning as the navigation drawer's trap.
  useEffect(() => {
    if (!open) return
    const returnFocusTo = triggerRef.current
    panelRef.current?.focus()
    return () => {
      returnFocusTo?.focus()
    }
  }, [open])

  // Outside pointerdown closes. Capture phase, so a component that stops
  // propagation on its own pointerdown cannot leave the panel stuck open. A
  // press that *starts* inside the panel never reaches the close branch, which
  // is the whole reason this listens on `pointerdown` and not on `click`.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (anchorRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', onPointerDown, true)
  }, [open])

  // Position. The panel is `absolute` inside the sticky header rather than
  // `fixed` on purpose: `backdrop-blur` on the header makes it the containing
  // block for fixed descendants, and focus mode *removes* that filter, so a
  // `fixed` panel would jump every time a reader turned focus mode on.
  //
  // Below is the preferred side and above is the fallback; whichever is chosen,
  // the panel scrolls internally rather than overflowing. The measurement is in
  // a layout effect so the first paint is already the corrected one, and it
  // re-runs on the text scale because the panel's own text scales with it.
  useEffect(() => {
    if (!open) return
    const place = () => {
      const trigger = triggerRef.current
      const panel = panelRef.current
      if (!trigger || !panel) return
      const rect = trigger.getBoundingClientRect()
      const below = window.innerHeight - rect.bottom - PANEL_GAP
      const above = rect.top - PANEL_GAP
      const side: Placement['side'] = below >= above ? 'below' : 'above'
      setPlacement({
        side,
        maxHeight: Math.max(MIN_PANEL_HEIGHT, side === 'below' ? below : above),
      })
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [open, prefs.textScale])

  const atDefaults = isDefault(prefs)
  const changedCount = (
    Object.keys(DEFAULT_PREFERENCES) as (keyof Preferences)[]
  ).filter((key) => prefs[key] !== DEFAULT_PREFERENCES[key]).length

  const onAnchorKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      close()
      return
    }
    if (event.key !== 'Tab') return
    const panel = panelRef.current
    if (!panel) return
    const items = focusableWithin(panel)
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    const active = document.activeElement
    // The panel itself takes focus on open, so Shift+Tab from it has to be
    // caught as well as the usual first/last pair.
    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const onReset = () => {
    prefs.reset()
    // Reset disables the button that was just pressed, and a disabled button
    // cannot hold focus — so the focus would drop to the body and the reader
    // would have to tab back in from the top. Hand it to the close button,
    // which is the first thing in the panel and is always there.
    closeRef.current?.focus()
  }

  return (
    <div
      ref={anchorRef}
      onKeyDown={onAnchorKeyDown}
      className="relative shrink-0"
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        aria-label={PANEL_TITLE}
        title={PANEL_TITLE}
        // STRUCTURAL: `h-9 w-9` is a hit area. The density scale is
        // deliberately not used for the size of a control a finger has to
        // find, only for the space around it. `hit-44` adds 4px of
        // transparent reach on every side without touching that 36px box, so
        // the target a finger gets is the 44px the guideline asks for and the
        // header keeps the proportions it was drawn at. The trigger's
        // neighbours are 8px away, which is exactly the slop.
        //
        // `aria-expanded:*` is this control's selected state: the panel is
        // open, and the fill says so. The accent is not used for it —
        // `surface-2` plus full-strength `fg` is what an open control looks
        // like everywhere else on the site.
        className="hit-44 pref-tap tap-clear inline-flex h-9 w-9 items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg active:bg-surface-2 aria-expanded:bg-surface-2 aria-expanded:text-fg"
      >
        <SlidersHorizontal size={16} aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          // The panel is focused programmatically so that focus lands inside the
          // dialog on open, and it is not in the tab ring. The global
          // `:focus-visible` rule would still paint a two-pixel azure frame
          // around the whole panel, which reads like a selection error, so the
          // override has to be `!important`: that rule is emitted after the
          // utilities layer and would otherwise win on source order. The ring
          // the reader actually needs appears on the first control they reach
          // with Tab.
          style={
            placement ? { maxHeight: `${placement.maxHeight}px` } : undefined
          }
          className={clsx(
            'pref-pop elev-4 edge-lit absolute right-0 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col',
            // The cap below is a FIRST-PAINT value only. The placement effect
            // measures the trigger against `window.innerHeight` — the visible
            // height, not the large one — and writes the result inline on the
            // same commit, so the dynamic-unit class here never governs a
            // frame the reader sees. It is `dvh` rather than `vh` anyway so
            // that the fallback is not a box taller than the screen on a
            // phone with the URL bar showing, and the inline style replaces it
            // either way. A Tailwind arbitrary value cannot carry a fallback
            // pair, which is the only reason this is not a class.
            'max-h-[calc(100dvh-4rem)] overflow-hidden rounded-plate border border-border bg-raised !outline-none',
            // The horizontal clamp is in rem, and rem moves with the text scale,
            // so it tightens exactly when the panel's own labels get wider.
            // Verified at the worst combination a phone can produce: 390px wide
            // at 130% text, which still leaves 16px clear on the left.
            placement?.side === 'above'
              ? 'bottom-full mb-2.5'
              : 'top-full mt-2.5'
          )}
        >
          <div className="flex shrink-0 items-center gap-2 border-b border-border px-3.5 py-2.5">
            <SlidersHorizontal
              size={14}
              className="shrink-0 text-fg-subtle"
              aria-hidden="true"
            />
            <h2 id={titleId} className="text-label-sm font-semibold text-fg">
              {PANEL_TITLE}
            </h2>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close settings"
              title="Close settings"
              className="pref-tap tap-clear ml-auto inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-fg-muted hover:text-fg active:bg-surface-2"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto overscroll-contain px-3.5 py-3.5">
            <Segmented
              name="pref-theme"
              label="Appearance"
              description="System follows your operating system and keeps following it, even if you change it later. The header's sun and moon cycle the same three options."
              value={prefs.theme}
              options={THEME_OPTIONS}
              onChange={(value) => prefs.set('theme', value)}
            />
            <Segmented
              name="pref-text-size"
              label="Text size (%)"
              description={`${TEXT_SIZE_WORDS[String(prefs.textScale)]}. Scales every text size on the site, equations and tables included.`}
              readout={`${Math.round(prefs.textScale * 100)}%`}
              value={prefs.textScale}
              options={TEXT_SIZE_OPTIONS}
              onChange={(value) => prefs.set('textScale', value)}
            />
            <Segmented
              name="pref-measure"
              label="Reading width"
              description="How much text runs across one line of prose. Narrower is easier to track; wider fits more on screen."
              readout={MEASURE_CH[prefs.measure]}
              value={prefs.measure}
              options={MEASURE_OPTIONS}
              onChange={(value) => prefs.set('measure', value)}
            />
            <Segmented
              name="pref-line-height"
              label="Line spacing"
              description="The leading on body text. Taller leading helps a tired eye stay on the line."
              readout={LINE_HEIGHT_VALUE[prefs.lineHeight]}
              value={prefs.lineHeight}
              options={LINE_HEIGHT_OPTIONS}
              onChange={(value) => prefs.set('lineHeight', value)}
            />
            <Segmented
              name="pref-density"
              label="Density"
              description="Padding and gaps around controls, cards, and tables — how much breathing room the layout leaves itself."
              value={prefs.density}
              options={DENSITY_OPTIONS}
              onChange={(value) => prefs.set('density', value)}
            />
            <Segmented
              name="pref-motion"
              label="Motion"
              description={
                osReduced
                  ? 'Your system is asking for reduced motion, so this setting cannot turn animation on.'
                  : 'System follows your operating system. Reduced removes animation from this site.'
              }
              value={prefs.motion}
              options={MOTION_OPTIONS}
              onChange={(value) => prefs.set('motion', value)}
            />
            {osReduced && (
              <p className="-mt-1 flex items-start gap-1.5 text-xs leading-relaxed text-fg-muted">
                <Info
                  size={13}
                  className="mt-0.5 shrink-0 text-fg-subtle"
                  aria-hidden="true"
                />
                <span>
                  <span className="font-semibold text-fg">Full</span> does not
                  override that. A system-level accessibility setting is not
                  something a per-site control gets to overrule, so Full and
                  System look identical here.
                </span>
              </p>
            )}
            <div className="grid gap-3 border-t border-border pt-3.5">
              <SwitchRow
                label="Chart grid lines"
                description="Draw the horizontal and vertical guides behind every chart."
                checked={prefs.chartGrid}
                onChange={(value) => prefs.set('chartGrid', value)}
              />
              <SwitchRow
                label="Focus mode"
                description="A reading aid: it centres the text column and calms the page. Navigation stays visible, so you can always get back out."
                checked={prefs.focusMode}
                onChange={(value) => prefs.set('focusMode', value)}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 border-t border-border px-3.5 py-2.5">
            <p className="text-micro text-fg-subtle">
              {atDefaults ? 'Using the defaults' : `${changedCount} changed`}
            </p>
            <button
              type="button"
              onClick={onReset}
              disabled={atDefaults}
              // `disabled:*` here is a genuine belt-and-braces rather than a
            // duplicate of `.button:disabled`, because this is a Tailwind
            // button rather than a `.button`, and the reset button has to keep
            // its own resting fill. The `disabled:hover:bg-transparent` is the
            // part that matters: without it a disabled control still answers
            // the pointer.
            className="pref-tap tap-clear ml-auto inline-flex items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1.5 text-xs font-semibold text-fg hover:bg-surface-2 active:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
