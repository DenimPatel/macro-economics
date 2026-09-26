import React from 'react'
import { AlertTriangle, BookOpen, Info, Lightbulb, Target } from 'lucide-react'
import { TierBadge } from './ui'
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
      {title && <h3 className="note__title">{title}</h3>}
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

export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, badge }) => (
  <header className="tool-heading">
    <div className="tool-heading-row">
      <h1 className="tool-title">{title}</h1>
      {badge && <TierBadge tier={badge} />}
    </div>
    <p className="tool-description">{description}</p>
  </header>
)

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
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
  decimals,
}) => {
  const id = `slider-${label.replace(/\W+/g, '-').toLowerCase()}`
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
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-input"
        style={{ '--pct': fillPercent(value, min, max) } as React.CSSProperties}
      />
      <output className="control-value" htmlFor={id}>
        {value.toFixed(decimals ?? decimalsForStep(step))}
        {unit && ` ${unit}`}
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
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  unit,
  decimals,
}) => {
  const id = `number-${label.replace(/\W+/g, '-').toLowerCase()}`
  return (
    <div className="control-group">
      <label className="control-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="number-input"
      />
      <output className="control-value" htmlFor={id}>
        {value.toFixed(decimals ?? decimalsForStep(step))}
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

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  pressed,
}) => (
  <button
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
