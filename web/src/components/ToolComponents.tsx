import React, { useEffect, useId, useRef, useState } from 'react'
import { AlertTriangle, BookOpen, Info, Lightbulb, RotateCcw, Target } from 'lucide-react'
import { TierBadge } from './ui'
import { registerControl } from '../lib/controlRegistry'
import { useHeadingLevel } from '../lib/headingLevel'
import type { Tier } from '../../../content/lectures'

/**
 * Shared tool primitives.
 *
 * Every one of the 20 tools imports from this module, so it is the single
 * choke point for the tool design. Colour here is expressed as
 * `color-mix()` over the CSS custom properties in `index.css`, never as hex:
 *
 *   fill / border  ->  color-mix(in srgb, var(--c-X) N%, var(--c-surface))
 *   text           ->  var(--c-X-ink)
 *
 * Text must not use `color-mix`, because mixing toward the surface lightens
 * it and drops it below the AA contrast threshold.
 */

/* ------------------------------------------------------------------ *
 * Note
 * ------------------------------------------------------------------ */

export type NoteVariant = 'lesson' | 'try' | 'insight' | 'warning' | 'info'

/**
 * Five variants, two colours. `try` is the interactive block and gets the
 * accent; `warning` gets the caution hue. The rest are neutral, so the one
 * thing a reader is invited to touch is the one thing that stands out.
 */
const NOTE_STYLE: Record<NoteVariant, { cls: string; icon: React.ElementType }> = {
  lesson: { cls: 'note', icon: BookOpen },
  try: { cls: 'note note--try', icon: Target },
  insight: { cls: 'note', icon: Lightbulb },
  warning: { cls: 'note note--warning', icon: AlertTriangle },
  info: { cls: 'note', icon: Info },
}

interface NoteProps {
  /** Eyebrow label above the body, e.g. "Lesson 1". */
  label: string
  variant?: NoteVariant
  /** Optional heading rendered inside the note body. */
  title?: string
  /**
   * The heading level the title renders at, 3 by default.
   *
   * A note is usually a child of a section the tool wrote as an `h2`, so `h3`
   * is right seventeen times out of twenty. In the three tools whose FIRST
   * heading is a note — `IsLmExplorer` and `ModernISCurve`, which use their
   * notes as the section headings, and the two real-rate tools, which open
   * with one before their first `h2` — an `h3` there made the tool's outline
   * go `h1` straight to `h3`, which is a skipped level and a reader moving by
   * heading hears the page title and then a peer of nothing. Those call sites
   * pass 2.
   *
   * The level is the TAG. `.note__title` is a class, so the rendered size is
   * the same at either level and only the outline changes.
   */
  headingLevel?: 2 | 3
  children?: React.ReactNode
}

/**
 * The note replaces the ad-hoc "Lesson" / "Try It" / insight panels the tools
 * used to hand-roll with inline styles and emoji headers.
 */
export const ToolNote: React.FC<NoteProps> = ({
  label,
  variant = 'lesson',
  title,
  headingLevel = 3,
  children,
}) => {
  const { cls, icon: Icon } = NOTE_STYLE[variant]
  return (
    <section className={cls}>
      <div className="note__head">
        <span className="note__icon">
          <Icon size={13} aria-hidden="true" />
        </span>
        <p className="note__label">{label}</p>
      </div>
      {title &&
        (headingLevel === 2 ? (
          <h2 className="note__title">{title}</h2>
        ) : (
          <h3 className="note__title">{title}</h3>
        ))}
      <div className="note__body">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */

interface ToolHeaderProps {
  title: string
  description: string
  /** Tier id, e.g. "beginner". Rendered as a chip with its level meter. */
  badge?: Tier
}

/**
 * The tool's title, at whatever level the page it is on needs.
 *
 * `h1` by default, because a tool on `/tool/:id` IS the page and this is the
 * one place its subject is named. A tool embedded in a case study or a
 * lecture is not: the case or the lecture already owns the `h1`, and
 * rendering a second one gave those pages two. `useHeadingLevel` reads the
 * level from the nearest provider, so no tool file has to know which of the
 * three it is in. See `lib/headingLevel.tsx`.
 */
export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, badge }) => {
  const level = useHeadingLevel()
  return (
    <header className="tool-heading">
      <div className="tool-heading-row">
        {level === 1 ? (
          <h1 className="tool-title">{title}</h1>
        ) : level === 2 ? (
          <h2 className="tool-title">{title}</h2>
        ) : (
          <h3 className="tool-title">{title}</h3>
        )}
        {badge && <TierBadge tier={badge} />}
      </div>
      <p className="tool-description">{description}</p>
    </header>
  )
}

/* ------------------------------------------------------------------ *
 * Controls
 * ------------------------------------------------------------------ */

/**
 * Derive a sensible display precision from the control's step, so a step of
 * 0.005 does not render as "0.01" and a step of 5 does not render "5.00".
 */
function decimalsForStep(step: number): number {
  if (!Number.isFinite(step) || step <= 0) return 2
  if (step >= 1) return 0
  if (step >= 0.1) return 1
  if (step >= 0.01) return 2
  return 3
}

/**
 * Fill fraction for the slider track. A native range input has no way to
 * paint "how far along am I", so the CSS gradient reads this custom property.
 * It is a number, not a colour, which is why the no-inline-colour rule holds.
 *
 * Nothing else about the control is written here. The track gradient, the
 * hover swell, the press swell, the focus ring on the thumb, the disabled
 * thumb, `touch-action: pan-y` and the suppressed tap flash are all rules on
 * `.slider-input` in `index.css`, which is why the twenty tools that drag
 * this slider all get the same states and why none of them can grow a
 * partial one.
 */
function fillPercent(value: number, min: number, max: number): string {
  if (max <= min) return '0%'
  const pct = ((value - min) / (max - min)) * 100
  return `${Math.min(100, Math.max(0, pct))}%`
}

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  unit?: string
  /** Overrides the precision inferred from `step`. */
  decimals?: number
  /**
   * The key this control carries in a share link. Defaults to `label`, and a
   * tool with two identically-labelled controls must set it, because the two
   * can have different bounds and one label cannot name one parameter. See
   * `lib/controlRegistry.ts`.
   */
  paramKey?: string
}

/**
 * The control twenty tools share, and the reason a slider is a usable
 * control rather than a decoration.
 *
 * Four things here are not obvious, and each of them was a defect first.
 *
 * **The id is generated, not derived from the label.** It used to be
 * `` `slider-${label.replace(/\W+/g, '-').toLowerCase()}` ``, which is a
 * duplicate-id factory: seventeen tool files declare the same label twice
 * — `IsLmExplorer` alone has two "Government Spending (G)" sliders, one in
 * the IS-curve panel and one in the Scenario A panel — so the second
 * `<label htmlFor>` pointed at the FIRST input. The second control had a
 * visible label, a `type="range"`, and no accessible name at all, and
 * clicking its label moved the other tool's slider. `useId` is unique per
 * element instance and per render pass, so the association is now correct
 * by construction rather than by every tool happening to label its controls
 * differently.
 *
 * **`aria-valuetext` carries the unit and the precision.** A native range
 * input exposes `aria-valuenow`, so the number is already in the
 * accessibility tree — but the bare number, with no unit, and often
 * truncated: a reader hears "50" for the money supply and for the price
 * level and for output. `aria-valuetext` is the string form of the same
 * fact, and it is written from the same `decimalsForStep` the visible
 * readout uses, so what is spoken is what is printed.
 *
 * **The value is printed, live, below the track** — a 1.25rem
 * `.control-value` that updates on every input event, so the number under a
 * slider moves while it is being dragged rather than after it. A drag that
 * only reports itself on release means the reader is steering by the shape
 * of the curve.
 *
 * **The hit area is 24px and lives in the CSS, not here.** See
 * `.slider-input` in `index.css`: the padding and its matching negative
 * margin are both there, precisely so that solving the target size does not
 * add an element to this component and re-lay-out every control panel.
 */
export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
  decimals,
  paramKey,
}) => {
  const id = useId()
  const places = decimals ?? decimalsForStep(step)
  const text = `${value.toFixed(places)}${unit ? ` ${unit}` : ''}`
  // The share registry, fed from the props this control already holds. See
  // `lib/controlRegistry.ts` for why the control registers itself rather than
  // a per-tool spec listing the same numbers: the bound encoded into a shared
  // link is then the bound this input enforces, by construction.
  const current = useRef({ value, onChange })
  current.current = { value, onChange }
  useEffect(() => {
    if (!Number.isFinite(min) || !Number.isFinite(max)) return
    return registerControl({
      key: paramKey ?? label,
      min,
      max,
      get: () => current.current.value,
      set: (next) => current.current.onChange(next),
    })
  }, [paramKey, label, min, max])
  return (
    <div className="control-group">
      <label className="control-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const next = Number.parseFloat(e.target.value)
          // A range input can report `NaN` transiently (an emptied value in
          // a browser that lets it, a synthetic event), and a `NaN` that
          // reaches a tool's model is a `NaN` in every derived series and
          // every readout beside the chart. Dropping the event is the whole
          // fix: there is no other value the control could be showing.
          if (Number.isFinite(next)) onChange(next)
        }}
        aria-valuetext={text}
        className="slider-input"
        style={{ '--pct': fillPercent(value, min, max) } as React.CSSProperties}
      />
      {/* The visible half of the same fact, and deliberately not a live
       * region: `<output>` carries an implicit `role="status"`, so leaving
       * it live would announce every value a slider passes through on the
       * way to the one the reader wanted — on a 0.1 step from 0.5 to 2.0
       * that is fifteen announcements. The slider's own `aria-valuetext`
       * announces the value the control actually has. */}
      <output className="control-value" htmlFor={id} aria-hidden="true">
        {text}
      </output>
    </div>
  )
}

interface NumberInputProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  unit?: string
  /** Overrides the precision inferred from `step`. */
  decimals?: number
  /**
   * The key this control carries in a share link. Defaults to `label`, and a
   * tool with two identically-labelled controls must set it, because the two
   * can have different bounds and one label cannot name one parameter. See
   * `lib/controlRegistry.ts`.
   */
  paramKey?: string
}

/**
 * A typed number field, and the reason it keeps a draft.
 *
 * The version this replaces was `onChange={(e) => onChange(parseFloat(e.target.value))}`,
 * and `parseFloat('')` is `NaN`. So the ordinary act of selecting a number
 * to retype it — which empties the field for exactly as long as it takes to
 * press a digit — pushed `NaN` into the model, and from there into every
 * derived series and every readout on the page. A chart that has been given
 * `NaN` does not recover when the number is finished: `NaN` propagates
 * through a `.map` the same way it propagates through arithmetic.
 *
 * So the field holds its own text, and it distinguishes three states that
 * the old one conflated:
 *
 *  - the text is not a number (`''`, `'-'`, `'1e'`) — nothing is committed
 *    and `aria-invalid` is false, because the reader is mid-keystroke and
 *    telling them the field is invalid at that instant is noise;
 *  - the text is a number outside `[min, max]` — `aria-invalid` is TRUE, the
 *    field says what the range is, and the value is NOT committed, so the
 *    model keeps the last good number while the reader finishes typing. It
 *    is deliberately not CLAMPED into the model: the reader typed 900 into a
 *    field capped at 800, and silently moving the chart to 800 while the
 *    field reads 900 is a number they did not enter. Blur snaps the field
 *    back to what the model holds, so the mismatch is over rather than
 *    permanent;
 *  - the text is a number in range — it is committed on every keystroke, so
 *    the chart responds as the number is typed.
 *
 * On blur the draft is reconciled to the real value, so tabbing away can
 * never leave a field reading something the model does not hold.
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  unit,
  decimals,
  paramKey,
}) => {
  const id = useId()
  const places = decimals ?? decimalsForStep(step)
  const [draft, setDraft] = useState<string | null>(null)
  const shown = draft ?? value.toFixed(places)
  const parsed = Number.parseFloat(shown)
  const isNumber = shown.trim() !== '' && Number.isFinite(parsed)
  const outOfRange = isNumber && (parsed < (min ?? -Infinity) || parsed > (max ?? -Infinity))
  const invalid = outOfRange

  // A number field is a shareable control too, so it registers like a
  // slider. An unbounded field registers with no bounds, which makes the
  // clamp in `applyScenarioParams` a pass-through — correct, because a field
  // with no declared range has nothing to clamp to.
  const current = useRef({ value, onChange })
  current.current = { value, onChange }
  useEffect(() => {
    const lo = min ?? Number.NEGATIVE_INFINITY
    const hi = max ?? Number.POSITIVE_INFINITY
    return registerControl({
      key: paramKey ?? label,
      min: lo === Number.NEGATIVE_INFINITY ? -Number.MAX_VALUE : lo,
      max: hi === Number.POSITIVE_INFINITY ? Number.MAX_VALUE : hi,
      get: () => current.current.value,
      set: (next) => current.current.onChange(next),
    })
  }, [paramKey, label, min, max])


  return (
    <div className="control-group">
      <label className="control-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={shown}
        onChange={(e) => {
          const text = e.target.value
          setDraft(text)
          const next = Number.parseFloat(text)
          // Out of range is NOT clamped into the model, and that is the whole
          // decision in this component. Clamping is the friendlier-looking
          // choice and it is a lie: the reader typed 900 into a field capped
          // at 800, the chart moved to 800, and nothing on the screen said
          // the number they entered was not the number they got. Here the
          // field keeps what was typed, says so, and the model holds its
          // last good value until the reader finishes — at which point blur
          // snaps the field back to what the model actually has, and the
          // mismatch is over rather than permanent.
          // The range test is made against `next`, the value being typed,
          // and not against the `outOfRange` computed for the PREVIOUS
          // render. Reading the stale one commits the first out-of-range
          // keystroke and rejects the second, which is worse than either
          // behaviour alone.
          const inRange = next >= (min ?? -Infinity) && next <= (max ?? Infinity)
          if (text.trim() !== '' && Number.isFinite(next) && inRange) onChange(next)
        }}
        onBlur={() => setDraft(null)}
        min={min}
        max={max}
        step={step}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-range` : undefined}
        className="number-input"
      />
      {invalid && (
        <p className="control-hint" id={`${id}-range`}>
          Enter a value between {min} and {max}
        </p>
      )}
      <output className="control-value" htmlFor={id} aria-hidden="true">
        {value.toFixed(places)}
        {unit && ` ${unit}`}
      </output>
    </div>
  )
}

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  /** Marks the button as a toggle and reflects its state. */
  pressed?: boolean
}

/**
 * The shared button. Every state it can be in is owned by `.button` in
 * `index.css` — hover, press, disabled, and the `[aria-pressed='true']`
 * selected state — so a tool that renders one gets the whole model for free
 * and a tool cannot come out at 60% disabled because it invented its own
 * utility.
 *
 * `pressed` is the reason that state exists at all: the attribute was
 * already being emitted here and rendered as nothing, so a toggle's only
 * signal was the accessibility tree. The selected treatment is a
 * `surface-2` fill with a real border — the same vocabulary as a selected
 * nav row and a selected quiz option. It is deliberately not an accent wash.
 *
 * `type="button"` is written out because the default is `submit`. No tool
 * wraps its controls in a `<form>` today, so nothing is submitted by
 * accident; that is a property of twenty call sites rather than of this
 * component, and the default it would rely on is the one HTML picks, not
 * the one we want.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  pressed,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={pressed}
    className={`button button-${variant}`}
  >
    {children}
  </button>
)

/**
 * State dot for a toggle button. Replaces a literal checkmark character so
 * the indicator is styled by the theme rather than baked into the text, and
 * so no emoji-like glyph ends up in source.
 */
export const ToggleDot: React.FC<{ on: boolean }> = ({ on }) => (
  <span
    aria-hidden="true"
    className={`mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full align-middle ${
      on ? 'bg-fg' : 'bg-border-strong'
    }`}
  />
)

/* ------------------------------------------------------------------ *
 * Reset
 * ------------------------------------------------------------------ */

interface ToolControlBarProps {
  onReset: () => void
  /** Disables the reset when nothing has moved, which is also what tells a
   * reader the tool is already at its starting point. */
  dirty?: boolean
  children?: React.ReactNode
}

/**
 * The row a tool's secondary actions live in, with the reset in it.
 *
 * Reset is `secondary`, never `primary`. A tool's primary action is the one
 * that runs a scenario or starts a simulation; reset undoes a detour, and
 * the reader who just arrived should not be invited to press it. It is
 * `disabled` while clean rather than hidden, so its position does not move
 * the first time a slider is dragged.
 *
 * The `reset`/`dirty` pair itself comes from `useToolReset` in
 * `lib/toolReset.ts` — a hook cannot be exported from a module of
 * components, and the reason it lives in its own file is the one that
 * matters: five tools had hand-written `resetToDefault` functions that
 * re-typed every default value, so `useState(50)` and `setX(50)` were two
 * literals in two places and the one edited during a model change was the
 * one nobody edits.
 */
export const ToolControlBar: React.FC<ToolControlBarProps> = ({ onReset, dirty = true, children }) => (
  <div className="button-group">
    {children}
    <Button variant="secondary" onClick={onReset} disabled={!dirty}>
      <RotateCcw size={14} aria-hidden="true" />
      Reset to defaults
    </Button>
  </div>
)

/* ------------------------------------------------------------------ *
 * Readouts
 * ------------------------------------------------------------------ */

export type StatTone = 'accent' | 'positive' | 'negative' | 'caution' | 'neutral'

/**
 * Tone names predate the `ok` / `warn` / `bad` tokens and are referenced
 * directly by several tools, so they are kept — but the fill is now flat and
 * only the value carries the colour.
 */
const STAT_TONE_CLASS: Record<StatTone, string> = {
  accent: 'stat-tile stat-tile--accent',
  positive: 'stat-tile stat-tile--positive',
  negative: 'stat-tile stat-tile--negative',
  caution: 'stat-tile stat-tile--caution',
  neutral: 'stat-tile stat-tile--neutral',
}

interface StatBoxProps {
  label: string
  value: string | number
  unit?: string
  change?: string
  tone?: StatTone
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, unit, change, tone = 'neutral' }) => (
  <div className={STAT_TONE_CLASS[tone]}>
    <div className="stat-tile-label">{label}</div>
    <div className="stat-tile-value">
      {value}
      {unit && ` ${unit}`}
    </div>
    {change && <div className="stat-tile-change">{change}</div>}
  </div>
)

interface InfoBoxProps {
  children?: React.ReactNode
  title?: string
  content?: string
  type?: 'info' | 'warning' | 'success'
}

const INFO_BOX_CLASS: Record<NonNullable<InfoBoxProps['type']>, string> = {
  info: 'note',
  warning: 'note note--warning',
  success: 'note note--try',
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  title,
  content,
  type = 'info',
}) => {
  const Icon = type === 'warning' ? AlertTriangle : type === 'success' ? Lightbulb : Info
  return (
    <aside className={INFO_BOX_CLASS[type]}>
      <div className="note__head">
        <span className="note__icon">
          <Icon size={13} aria-hidden="true" />
        </span>
        <p className="note__label">
          {title ?? (type === 'warning' ? 'Watch out' : type === 'success' ? 'Note' : 'Info')}
        </p>
      </div>
      <div className="note__body">{content ?? children}</div>
    </aside>
  )
}
