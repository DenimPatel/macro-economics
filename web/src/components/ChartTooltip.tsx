import type { ReactNode } from 'react'
import type { DefaultTooltipContentProps } from 'recharts'

/**
 * The site's one tooltip, in place of Recharts' default markup.
 *
 * Why this is a component rather than a style object: the default tooltip
 * is a `<p>` of the axis label followed by a `<ul>` whose rows are
 * `swatch | name | ':' | value` laid out in a flex column with `gap: 0`, so
 * the value sits immediately after the series name instead of in a column.
 * A reader comparing two series is comparing digit strings, and digit
 * strings only compare if they line up. The same markup also hardcodes
 * `white-space: nowrap` and a 10px padding, so a long series name runs off
 * a 390px screen instead of wrapping and the box ignores the type scale.
 *
 * It is wired in through `chartTheme.tooltip.content`, so every chart on
 * the site gets it and no tool has to ask. A tool that passes `formatter`
 * or `labelFormatter` keeps them: this component applies them the way
 * Recharts' own default does, including the `[value, name]` tuple a
 * formatter returns and the `entry.formatter` that overrides the shared
 * one. It also drops a row whose series has been hidden, which is what
 * keeps the tooltip honest once a legend can be operated.
 *
 * The props type is Recharts' own, so the two cannot drift: a chart that
 * passes a `formatter` this component ignores would be a bug in the
 * component, not a silently wrong number in a tool.
 */
type Value = number | string | (number | string)[]
type Name = number | string

export type ChartTooltipProps<TValue extends Value = Value, TName extends Name = Name> =
  DefaultTooltipContentProps<TValue, TName> & {
    active?: boolean
    hideLabel?: boolean
  }

const isNumOrStr = (value: unknown): value is number | string =>
  typeof value === 'number' || typeof value === 'string'

/** A two-element numeric value reads as a range, not as a pair. */
function defaultFormat<TValue extends Value>(value: TValue): TValue | string {
  if (Array.isArray(value) && isNumOrStr(value[0]) && isNumOrStr(value[1])) {
    return `${value[0]} ~ ${value[1]}`
  }
  return value
}

export function ChartTooltip<TValue extends Value, TName extends Name>(props: ChartTooltipProps<TValue, TName>) {
  const { active, payload, label, hideLabel, formatter, labelFormatter, labelStyle, itemStyle } = props
  if (!active || !payload?.length) return null

  const head: ReactNode = labelFormatter && label != null ? labelFormatter(label, payload) : (label as ReactNode)

  return (
    <div className="chart-tooltip" role="tooltip" style={props.contentStyle}>
      {!hideLabel && head != null && (
        <div className="chart-tooltip-label" style={labelStyle}>
          {head}
        </div>
      )}
      <ul className="chart-tooltip-rows">
        {payload
          // Two filters, and the second one is load-bearing. Recharts'
          // `getTooltipContent` walks EVERY graphical item, hidden ones
          // included, and stamps `hide` on the entry it builds for each —
          // so a legend toggle that hid a series would otherwise leave its
          // row sitting in the tooltip claiming a value the plot is no
          // longer drawing. `type: 'none'` is the older half of the same
          // rule, for a tool that suppresses a row with a `tooltipType`.
          .filter((entry) => entry.type !== 'none' && !entry.hide)
          .map((entry, index) => {
            const apply = entry.formatter ?? formatter ?? defaultFormat
            let value: ReactNode = entry.value
            let name: ReactNode = entry.name
            if (entry.value != null && entry.name != null) {
              const formatted = apply(entry.value, entry.name, entry, index, payload)
              if (Array.isArray(formatted)) {
                value = formatted[0]
                name = formatted[1]
              } else {
                value = formatted
              }
            }
            return (
              <li
                className="chart-tooltip-row"
                // The index is in the key because a chart can and does put two
                // series on one dataKey — the IS-LM diagram plots Y against r
                // twice over — and a key built from `dataKey` alone is then
                // the same string twice.
                key={`tooltip-item-${String(entry.dataKey ?? entry.name ?? 'row')}-${index}`}
                style={itemStyle}
              >
                <span className="chart-tooltip-swatch" style={{ backgroundColor: entry.color }} aria-hidden="true" />
                {isNumOrStr(name) ? <span className="chart-tooltip-name">{name}</span> : <span />}
                <span className="chart-tooltip-value">
                  {value}
                  {entry.unit ? <span className="chart-tooltip-unit"> {entry.unit}</span> : null}
                </span>
              </li>
            )
          })}
      </ul>
    </div>
  )
}
