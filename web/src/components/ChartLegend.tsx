import type { LegendItem } from '../lib/chartSeries'

/**
 * The chart legend, as a control.
 *
 * Recharts' `<Legend>` is the reason this file exists. It renders a `<li>`
 * per series with no `tabIndex`, no `role` and no handler, so on this site
 * a legend was a list of names: twenty-one of them across fourteen tools,
 * none of which a reader could act on and none of which a keyboard could
 * reach. The strike-through rule for a hidden series was already in
 * `index.css` and nothing set `hide` on anything, which is the same absence
 * seen from the other side.
 *
 * So this is not a wrapper around Recharts' legend. It is a `<ul>` of real
 * `<button>`s rendered beside the chart, and it is only correct in
 * combination with two other things a chart must do — which is why both are
 * in this comment rather than left to the next reader:
 *
 *  1. `hide={isHidden(key)}` on each `<ChartLine>`, so the series is
 *     actually removed and not merely drawn pale.
 *  2. `includeHidden` on the axes, so the DOMAIN does not move. Recharts
 *     computes an auto-domain from the visible series only —
 *     `generateCategoricalChart.js` filters the graphical items on `hide`
 *     unless the axis itself sets `includeHidden` — so without it, hiding
 *     one of two series re-scales both axes and every remaining series
 *     appears to move. This is the one decision here that was not open: a
 *     legend toggle that re-scales the plot is a false statement about the
 *     data, so the domain stays pinned to all the series and only the
 *     hidden one leaves.
 *
 * Nothing else is needed for the tooltip: Recharts' `getTooltipContent`
 * walks every graphical item, hidden ones included, and stamps `hide` on
 * the entry, and the shared `ChartTooltip` already drops any row carrying
 * it. So the tooltip follows the legend without this file knowing that a
 * tooltip exists.
 *
 * The button's accessible name is the series label and does not change;
 * `aria-pressed` is TRUE while the series is VISIBLE. The other polarity
 * (pressed = hidden) reads as "this button is currently hiding GDP" and
 * makes the control announce itself as two different things depending on
 * state. A reader who cannot see the swatch gets the state, the label, and
 * — from the strike — the non-colour half of it.
 */

interface ChartLegendProps {
  items: LegendItem[]
  hidden: string[]
  onToggle: (key: string) => void
  /** Renders a "Show all" reset when anything is hidden. */
  onShowAll?: () => void
}

/**
 * `role="list"` is redundant in the accessibility tree and is written out
 * anyway because of the browser: `list-style: none` removes the marker in
 * Safari, and VoiceOver honours that removal too, so a list of buttons
 * announced with no list role and no item count is a worse experience than
 * the rule was introduced to fix.
 */
export function ChartLegend({ items, hidden, onToggle, onShowAll }: ChartLegendProps) {
  return (
    <ul className="chart-legend" role="list">
      {items.map((item) => {
        const isHidden = hidden.includes(item.key)
        return (
          <li key={item.key}>
            <button
              type="button"
              className={`chart-legend-item${isHidden ? ' is-inactive' : ''}`}
              aria-pressed={!isHidden}
              onClick={() => onToggle(item.key)}
            >
              {/* No inline colour when hidden: the rule for the inactive
               * swatch is in `index.css`, and an inline `background-color`
               * would outrank it. */}
              <span
                className="chart-legend-swatch"
                style={isHidden ? undefined : { backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="chart-legend-label">{item.label}</span>
            </button>
          </li>
        )
      })}
      {onShowAll && hidden.length > 0 && (
        <li>
          <button type="button" className="chart-legend-item" onClick={onShowAll}>
            <span className="chart-legend-label">Show all</span>
          </button>
        </li>
      )}
    </ul>
  )
}
