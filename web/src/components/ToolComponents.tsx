import React from 'react'
import { AlertTriangle, BookOpen, Info, Lightbulb, Target } from 'lucide-react'

/**
 * Shared tool primitives.
 *
 * Every one of the 20 tools imports from this module, so it is the single
 * choke point for the tool design migration. Colour here is expressed as
 * `color-mix()` over the CSS custom properties in `index.css`, never as hex:
 *
 *   fill / border  ->  color-mix(in srgb, var(--c-X) N%, var(--c-surface))
 *   text           ->  var(--c-X-ink)
 *
 * Text must not use `color-mix`, because mixing toward the surface lightens
 * it and drops it below the AA contrast threshold.
 */

/* ------------------------------------------------------------------ *
 * Callout
 * ------------------------------------------------------------------ */

export type CalloutVariant = 'lesson' | 'try' | 'insight' | 'warning' | 'info'

const CALLOUT_STYLE: Record<CalloutVariant, { chip: string; icon: React.ElementType }> = {
  lesson: { chip: 'tool-callout tool-callout--lesson', icon: BookOpen },
  try: { chip: 'tool-callout tool-callout--try', icon: Target },
  insight: { chip: 'tool-callout tool-callout--insight', icon: Lightbulb },
  warning: { chip: 'tool-callout tool-callout--warning', icon: AlertTriangle },
  info: { chip: 'tool-callout tool-callout--info', icon: Info },
}

interface ToolCalloutProps {
  /** Eyebrow label above the body, e.g. "Lesson 1". */
  label: string
  variant?: CalloutVariant
  /** Optional heading rendered inside the callout body. */
  title?: string
  children?: React.ReactNode
}

/**
 * Replaces the ad-hoc "Lesson" / "Try It" / insight panels the tools used to
 * hand-roll with inline styles and emoji headers.
 */
export const ToolCallout: React.FC<ToolCalloutProps> = ({
  label,
  variant = 'lesson',
  title,
  children,
}) => {
  const { chip, icon: Icon } = CALLOUT_STYLE[variant]
  return (
    <section className={chip}>
      <p className="tool-callout-label">
        <Icon size={15} aria-hidden="true" />
        {label}
      </p>
      {title && <h3 className="tool-callout-title">{title}</h3>}
      <div className="tool-callout-body">{children}</div>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Header
 * ------------------------------------------------------------------ */

interface ToolHeaderProps {
  title: string
  description: string
  badge?: string
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, badge }) => (
  <header className="tool-heading">
    <div className="tool-heading-row">
      <h1 className="tool-title">{title}</h1>
      {badge && <span className={`badge ${badge}`}>{badge}</span>}
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
      on ? 'bg-accent-fg' : 'bg-border-strong'
    }`}
  />
)

/* ------------------------------------------------------------------ *
 * Readouts
 * ------------------------------------------------------------------ */

export type StatTone = 'accent' | 'positive' | 'negative' | 'caution' | 'neutral'

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

const INFO_BOX_CLASS = {
  info: 'tool-callout tool-callout--info',
  warning: 'tool-callout tool-callout--warning',
  success: 'tool-callout tool-callout--lesson',
} as const

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  title,
  content,
  type = 'info',
}) => {
  const Icon = type === 'warning' ? AlertTriangle : type === 'success' ? Lightbulb : Info
  return (
    <aside className={INFO_BOX_CLASS[type]}>
      <p className="tool-callout-label">
        <Icon size={15} aria-hidden="true" />
        {title ?? (type === 'warning' ? 'Watch out' : type === 'success' ? 'Note' : 'Info')}
      </p>
      <div className="tool-callout-body">{content ?? children}</div>
    </aside>
  )
}
