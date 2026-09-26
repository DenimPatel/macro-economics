import React from 'react'

interface ToolHeaderProps {
  title: string
  description: string
  badge?: string
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ title, description, badge }) => (
  <div style={{ marginBottom: '2rem' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
      <h1 className="tool-title">{title}</h1>
      {badge && <span className={`badge ${badge}`}>{badge}</span>}
    </div>
    <p className="tool-description">{description}</p>
  </div>
)

interface SliderControlProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}

export const SliderControl: React.FC<SliderControlProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit,
}) => (
  <div className="control-group">
    <label className="control-label">{label}</label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="slider-input"
    />
    <div className="control-value">
      {value.toFixed(2)}
      {unit && ` ${unit}`}
    </div>
  </div>
)

interface NumberInputProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  unit?: string
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  unit,
}) => (
  <div className="control-group">
    <label className="control-label">{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      min={min}
      max={max}
      step={step}
      style={{
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #cbd5e1',
        fontSize: '1rem',
      }}
    />
    <div className="control-value">
      {value.toFixed(2)}
      {unit && ` ${unit}`}
    </div>
  </div>
)

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`button button-${variant}`}
    style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    {children}
  </button>
)

interface StatBoxProps {
  label: string
  value: string | number
  unit?: string
  highlight?: boolean
  change?: string
  color?: 'blue' | 'green' | 'red' | 'amber' | 'purple'
}

export const StatBox: React.FC<StatBoxProps> = ({ label, value, unit, highlight, change, color = 'blue' }) => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: '#dbeafe', border: '#bfdbfe', text: '#0c4a6e' },
    green: { bg: '#dcfce7', border: '#bbf7d0', text: '#15803d' },
    red: { bg: '#fee2e2', border: '#fecaca', text: '#7f1d1d' },
    amber: { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
    purple: { bg: '#e9d5ff', border: '#d8b4fe', text: '#6b21a8' },
  }

  const colorStyle = highlight ? colorMap[color] : { bg: '#f1f5f9', border: '#e2e8f0', text: '#1e293b' }

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: colorStyle.bg,
        borderRadius: '6px',
        border: `1px solid ${colorStyle.border}`,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colorStyle.text }}>
        {value}
        {unit && ` ${unit}`}
      </div>
      {change && (
        <div style={{ fontSize: '0.8rem', marginTop: '0.25rem', color: colorStyle.text, opacity: 0.85 }}>
          {change}
        </div>
      )}
    </div>
  )
}

interface InfoBoxProps {
  children?: React.ReactNode
  title?: string
  content?: string
  type?: 'info' | 'warning' | 'success'
}

export const InfoBox: React.FC<InfoBoxProps> = ({ children, title, content, type = 'info' }) => {
  const bgColor: Record<string, string> = {
    info: '#dbeafe',
    warning: '#fef08a',
    success: '#dcfce7',
  }
  const textColor: Record<string, string> = {
    info: '#0c4a6e',
    warning: '#854d0e',
    success: '#15803d',
  }
  const borderColor: Record<string, string> = {
    info: '#bfdbfe',
    warning: '#fcd34d',
    success: '#bbf7d0',
  }

  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: bgColor[type],
        borderLeft: `4px solid ${borderColor[type]}`,
        borderRadius: '4px',
        color: textColor[type],
        fontSize: '0.875rem',
        lineHeight: '1.5',
      }}
      >
        {title && <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>}
        {content ?? children}
      </div>
    )
  }
