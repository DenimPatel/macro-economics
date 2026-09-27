import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  ChartLine,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from '../components/ChartPrimitives'
import { ChartLegend } from '../components/ChartLegend'
import { useHiddenSeries } from '../lib/chartSeries'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { loadMoneySeries, type MoneySeriesPoint } from '../lib/csv'
import { PageHeader } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/**
 * The data explorer, which is the one page on the site that can fail.
 *
 * Everything else on the site is content compiled into the bundle. This page
 * fetches a CSV at runtime, and a fetch can fail for reasons that have nothing
 * to do with the reader: the file is not in the artifact, the network blipped,
 * a proxy returned an HTML error page. So the page is written as four states
 * rather than as "data, hopefully" — loading, failed, empty, loaded — and the
 * two failure states are the ones that carry the work:
 *
 *  - LOADING is a quiet plate with the plot's real geometry in it, not a
 *    sentence. The plot frame is 420px on this page and a layout that reserves
 *    0px for it and then jumps 420px when the data lands is a page that moves
 *    under the reader's eye, which is the same complaint as a chart that
 *    animates.
 *  - FAILED says what failed and offers a retry that re-runs the fetch. The
 *    message names the dataset and the HTTP status because that is what a
 *    reader reporting the problem needs, and the buttons are a real retry and
 *    a real way to the page that is not broken.
 *  - EMPTY is its own state: the fetch succeeded and the parser returned no
 *    rows, which is a different fault with a different fix than a 404 and is
 *    reported differently.
 *
 * THE SERIES. Two y-axes and two units, which is the bar on this page and not
 * the bar on a tool: M2 is trillions of dollars and the federal funds rate is
 * a percentage, and drawing them on one scale is a chart that is wrong rather
 * than a chart that is busy. The axis labels carry their units (`M2 ($
 * trillions)`, `Effective federal funds rate (%)`) and the series names repeat
 * them, because the legend is the thing a reader matches against the axis and
 * a legend that says "M2" while the axis says "$T" makes them do the units
 * themselves.
 *
 * The third control is not a series. "Theory overlay" reveals the prose about
 * what the models say about the two lines, so it is a checkbox and not a
 * legend chip: putting it in the legend would put a control that draws nothing
 * in a list of controls that remove something.
 *
 * THE DOMAIN DOES NOT MOVE. `includeHidden` on both y-axes and on the x-axis
 * is the load-bearing prop. Recharts computes an auto-domain from the VISIBLE
 * series, so hiding one of two would re-scale the axis and every remaining
 * line would appear to move — a false statement about the data, produced by a
 * legend toggle. `includeHidden` pins the domain to all the series and only
 * the hidden one leaves.
 *
 * The axis `key`s are suffixed per axis, and that is the same lesson
 * `chartTheme.axisKey` documents: React deduplicates keys among siblings, so
 * two axes carrying `axis-y-1.3` between them means one of them is dropped
 * from reconciliation. On a tool with one x and one y there is nothing to
 * collide with; this page has THREE axes, so the two y axes differ by the
 * series they carry, and the suffix still carries the text scale so the
 * remount-and-re-measure path is intact. (The browser said so out loud, once:
 * "Encountered two children with the same key".)
 *
 * THE UNITS ON THE FIGURES. Three numbers, three different shapes, and a
 * wrong unit on a data page is a real failure rather than a typo:
 *  - M2 level: `$21.85T`, dollars, trillions, two decimals.
 *  - M2 growth: `%`, cumulative percent change across the whole window.
 *  - Rate change: `pp`, percentage POINTS and not percent — a rate that goes
 *    from 5.5% to 4.5% has fallen 100 basis points and 18% RELATIVE to 5.5%,
 *    and the number on this page is the first of those. It is the one figure
 *    whose unit is routinely reported wrong, so its label says "pp" as well as
 *    its value.
 * All three are `tabular-nums`; the third one was a bare `<span>` and its
 * 1-2px of horizontal jitter against its two neighbours was the reason this
 * paragraph exists.
 *
 * `dateFormat` is named rather than left to the data: the CSV carries ISO
 * dates, so the default tick would be `2020-01` at the far end and `2019-12`
 * at the near one — the last two ticks two characters apart.
 */
type Status = 'loading' | 'error' | 'empty' | 'ready'

/** The two series names, in one place: the legend and the tooltip share them. */
const M2_LABEL = 'M2 money supply ($T)'
const RATE_LABEL = 'Fed funds rate (%)'

/**
 * The dataset's `Date` column is `Mon YYYY` — `Jan 2000`, `Nov 2025` — so the
 * year is at the END of the string, not the start. Getting that wrong is what
 * makes `date.slice(0, 4)` produce a label reading "M2 growth since Jan".
 */
function yearOf(date: string): string {
  const match = /\b(\d{4})$/.exec(date)
  return match ? match[1] : date
}

/**
 * Axis ticks, not the data's own labels.
 *
 * Recharts prints the category value verbatim, so the raw tick would be
 * `Jan 2000` on every twelfth tick and `Dec 2000` on the one beside it —
 * two labels a year is too coarse for a 26-year series and the reader cannot
 * tell which decade a tick belongs to. A January tick therefore prints the
 * year ALONE, which is the only tick on the axis that can be read without
 * counting the ones before it, and every other month prints its own month and
 * a two-digit year. The full `Mon YYYY` is still in the tooltip label and in
 * the figures below the plot, so nothing is lost by abbreviating here.
 */
function formatTick(date: string): string {
  const [month, year] = date.split(' ')
  if (!month || !year) return date
  return month === 'Jan' ? year : `${month} ${year.slice(2)}`
}

export default function DataExplorer() {
  useDocumentTitle(
    'Data explorer',
    'US M2 money supply and the effective federal funds rate, monthly, with a theory overlay.',
  )
  // Re-reads the axis `key` so Recharts re-measures its tick labels after the
  // reader changes the text size. The same call every tool makes.
  useChartTextScaleSignal()

  const [data, setData] = useState<MoneySeriesPoint[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)
  const [showTheory, setShowTheory] = useState(false)
  const series = useHiddenSeries(['m2', 'fedFunds'])

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    setMessage(null)
    loadMoneySeries()
      .then((points) => {
        if (cancelled) return
        setData(points)
        // A fetch that resolves with no rows is a fourth state, not an
        // empty version of the third: the file was found and did not parse,
        // which is a different fault with a different fix.
        setStatus(points.length > 0 ? 'ready' : 'empty')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setData([])
        setMessage(err instanceof Error ? err.message : 'Could not load data')
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const summary = useMemo(() => {
    if (data.length < 2) return null
    const first = data[0]
    const last = data[data.length - 1]
    return {
      first,
      last,
      m2Growth: ((last.m2 - first.m2) / first.m2) * 100,
      rateChange: last.fedFunds - first.fedFunds,
    }
  }, [data])

  return (
    <div>
      <PageHeader
        eyebrow="Real data"
        title="Data explorer: money and interest rates"
        description="US M2 money supply and the effective federal funds rate, monthly, 2000–2025. Hide a series in the legend, or open the theory overlay to connect the two lines to the models."
      />

      {/* The controls are above the plate whether or not there is a plate, so
          the page does not change height when the data arrives. The rows are
          literal gaps: the flex gap between the legend row and the plate is
          the gap inside one composite control object, and the three checkboxes
          are native inputs whose own hit area is theirs. */}
      <div className="mb-s-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 text-fg-muted">
          <input
            type="checkbox"
            checked={showTheory}
            onChange={(e) => setShowTheory(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
          Theory overlay
        </label>
        {status === 'ready' && (
          <span className="text-xs tabular-nums text-fg-subtle">
            {data.length} monthly observations, {summary?.first.date} to {summary?.last.date}
          </span>
        )}
      </div>

      {status === 'loading' && (
        <div className="card p-s-5" role="status">
          <p className="text-sm text-fg-muted">Loading the dataset…</p>
          {/* The plate's real geometry, in the plate's own colour. Not a
              shimmer: a shimmer is an animation, and a reader who has asked
              for a still page gets one whether or not the animation honours
              it. This is a shape, and it is quiet. */}
          <div className="plot-frame mt-s-3 flex flex-col gap-s-3" aria-hidden="true">
            <div className="h-3 w-2/5 rounded bg-surface-2" />
            <div className="h-2 w-4/5 rounded bg-surface-2" />
            <div className="h-2 w-3/5 rounded bg-surface-2" />
            <div className="h-2 w-11/12 rounded bg-surface-2" />
            <div className="h-2 w-2/3 rounded bg-surface-2" />
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="card p-s-6">
          <h2 className="text-base font-semibold text-fg">The dataset did not load</h2>
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8em]">
              data/us_money_market_monthly_2000_2025.csv
            </code>{' '}
            is fetched at runtime, so this page can fail on a network or a deploy
            where the rest of the site cannot.
            {message && <span className="text-bad-ink"> {message}</span>}
          </p>
          <div className="mt-s-4 flex flex-wrap gap-s-2">
            <button type="button" onClick={retry} className="button button-primary">
              Try again
            </button>
            <Link to="/glossary" className="button button-secondary no-underline">
              Read the glossary
            </Link>
          </div>
        </div>
      )}

      {status === 'empty' && (
        <div className="card p-s-6">
          <h2 className="text-base font-semibold text-fg">The dataset was empty</h2>
          <p className="mt-s-2 text-sm leading-relaxed text-fg-muted">
            The file was fetched and read, and it contained no rows this page could plot — so
            this is not a network problem. The money-market, IS-LM and Phillips-curve tools all
            work without it.
          </p>
          <div className="mt-s-4 flex flex-wrap gap-s-2">
            <button type="button" onClick={retry} className="button button-primary">
              Try again
            </button>
            <Link to="/tools" className="button button-secondary no-underline">
              Open a tool instead
            </Link>
          </div>
        </div>
      )}

      {status === 'ready' && (
        <div className="card p-s-5">
          <div className="plot-frame">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  key={chartTheme.axisKey('x')}
                  dataKey="date"
                  tickFormatter={formatTick}
                  includeHidden
                  {...chartTheme.axis}
                />
                <YAxis
                  key={`${chartTheme.axisKey('y')}-m2`}
                  yAxisId="left"
                  includeHidden
                  {...chartTheme.yAxis}
                  label={{
                    value: 'M2 ($ trillions)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'var(--c-fg-muted)',
                    fontSize: 'var(--chart-tick-size)',
                  }}
                />
                <YAxis
                  key={`${chartTheme.axisKey('y')}-rate`}
                  yAxisId="right"
                  orientation="right"
                  includeHidden
                  {...chartTheme.yAxis}
                  label={{
                    value: 'Effective federal funds rate (%)',
                    angle: 90,
                    position: 'insideRight',
                    fill: 'var(--c-fg-muted)',
                    fontSize: 'var(--chart-tick-size)',
                  }}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number, name: string) => [
                    name === M2_LABEL ? `$${value.toFixed(2)}T` : `${value.toFixed(2)}%`,
                    name,
                  ]}
                />
                <ChartLine
                  yAxisId="left"
                  type="monotone"
                  dataKey="m2"
                  name={M2_LABEL}
                  stroke={chartColor(0)}
                  hide={series.isHidden('m2')}
                />
                <ChartLine
                  yAxisId="right"
                  type="monotone"
                  dataKey="fedFunds"
                  name={RATE_LABEL}
                  stroke={chartColor(3)}
                  hide={series.isHidden('fedFunds')}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ChartLegend
            items={[
              { key: 'm2', label: M2_LABEL, color: chartColor(0) },
              { key: 'fedFunds', label: RATE_LABEL, color: chartColor(3) },
            ]}
            hidden={series.hidden}
            onToggle={series.toggle}
            onShowAll={series.showAll}
          />
        </div>
      )}

      {summary && status === 'ready' && (
        <div className="mt-s-4 grid gap-s-3 sm:grid-cols-3">
          <div className="stat-tile">
            <p className="stat-tile-label">M2, latest</p>
            <p className="stat-tile-value">${summary.last.m2.toFixed(2)}T</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">
              M2 growth since {yearOf(summary.first.date)}
            </p>
            <p className="stat-tile-value">
              {summary.m2Growth >= 0 ? '+' : ''}
              {summary.m2Growth.toFixed(0)}%
            </p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">
              Rate change since {yearOf(summary.first.date)} (percentage points)
            </p>
            <p className="stat-tile-value">
              {summary.rateChange >= 0 ? '+' : ''}
              {summary.rateChange.toFixed(2)} pp
            </p>
          </div>
        </div>
      )}

      {showTheory && (
        <div className="card mt-s-4 p-s-5 text-sm leading-relaxed text-fg-muted">
          <h2 className="mb-s-2 text-base font-semibold text-fg">What the models say</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              The quantity equation <em>MV = PY</em> links money growth to inflation and real growth.
              Long M2 expansions without matching output growth show up later in the price level.
            </li>
            <li>
              Liquidity preference (Lecture 4) says the interest rate clears money demand and supply.
              The large M2 expansions of 2020–2021 coincided with near-zero policy rates, the flat
              section of money demand.
            </li>
            <li>
              The 2022–2023 tightening is the reverse experiment: rapid rate increases pulled money
              growth down and, with a lag, inflation.
            </li>
          </ul>
          <p className="mt-s-3 text-xs text-fg-subtle">
            Correlations here are suggestive, not causal. Use the tools to isolate one mechanism at a
            time.
          </p>
        </div>
      )}

      <p className="mt-s-5 text-xs text-fg-subtle">
        Source:{' '}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8em]">
          data/us_money_market_monthly_2000_2025.csv
        </code>
        , exported by{' '}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.8em]">
          analysis/export.py
        </code>
        . Money stock on the left axis, the policy rate on the right; the two scales are
        independent, so the crossing of the lines is not a value.
      </p>
    </div>
  )
}
