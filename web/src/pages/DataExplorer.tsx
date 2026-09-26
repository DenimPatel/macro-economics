import { useEffect, useMemo, useState } from 'react'
import { CartesianGrid, Legend, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartLine } from '../components/ChartPrimitives'
import { loadMoneySeries, type MoneySeriesPoint } from '../lib/csv'
import { chartTheme } from '../design/chartTheme'
import { PageHeader } from '../components/ui'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function DataExplorer() {
  useDocumentTitle(
    'Data explorer',
    'US M2 money supply and the effective federal funds rate, monthly, with a theory overlay.',
  )
  const [data, setData] = useState<MoneySeriesPoint[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showM2, setShowM2] = useState(true)
  const [showRate, setShowRate] = useState(true)
  const [showTheory, setShowTheory] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadMoneySeries()
      .then((points) => {
        if (!cancelled) setData(points)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load data')
      })
    return () => {
      cancelled = true
    }
  }, [])

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
        description="US M2 money supply and the effective federal funds rate, monthly, 2000–2025. Toggle the theory overlay to connect the series to the models."
      />

      <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <label className="inline-flex cursor-pointer items-center gap-2 text-fg-muted">
          <input
            type="checkbox"
            checked={showM2}
            onChange={(e) => setShowM2(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
          M2 money supply
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-fg-muted">
          <input
            type="checkbox"
            checked={showRate}
            onChange={(e) => setShowRate(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
          Federal funds rate
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-fg-muted">
          <input
            type="checkbox"
            checked={showTheory}
            onChange={(e) => setShowTheory(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-accent"
          />
          Theory overlay
        </label>
      </div>

      {error && <p className="text-sm text-bad-ink">{error}</p>}
      {!error && data.length === 0 && <p className="text-sm text-fg-subtle">Loading data…</p>}

      {data.length > 0 && (
        <div className="card p-5">
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis
                  dataKey="date"
                  stroke={chartTheme.axis.stroke}
                  tick={chartTheme.axis.tick}
                  axisLine={chartTheme.axis.axisLine}
                  tickLine={chartTheme.axis.tickLine}
                  minTickGap={40}
                />
                <YAxis
                  yAxisId="left"
                  stroke={chartTheme.axis.stroke}
                  tick={chartTheme.axis.tick}
                  axisLine={chartTheme.axis.axisLine}
                  tickLine={chartTheme.axis.tickLine}
                  label={{
                    value: 'M2 ($T)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'var(--c-fg-muted)',
                    fontSize: 11,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke={chartTheme.axis.stroke}
                  tick={chartTheme.axis.tick}
                  axisLine={chartTheme.axis.axisLine}
                  tickLine={chartTheme.axis.tickLine}
                  label={{
                    value: 'Rate (%)',
                    angle: 90,
                    position: 'insideRight',
                    fill: 'var(--c-fg-muted)',
                    fontSize: 11,
                  }}
                />
                <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
                <Legend {...chartTheme.legend} />
                {showM2 && (
                  <ChartLine
                    yAxisId="left"
                    type="monotone"
                    dataKey="m2"
                    name="M2 money supply ($T)"
                    stroke={chartTheme.colors[0]}
                    strokeWidth={2}
                    dot={false}
                  />
                )}
                {showRate && (
                  <ChartLine
                    yAxisId="right"
                    type="monotone"
                    dataKey="fedFunds"
                    name="Federal funds rate (%)"
                    stroke={chartTheme.colors[3]}
                    strokeWidth={2}
                    dot={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {summary && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="stat-tile">
            <p className="stat-tile-label">M2, latest</p>
            <p className="stat-tile-value">${summary.last.m2.toFixed(2)}T</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">M2 growth since 2000</p>
            <p className="stat-tile-value">+{summary.m2Growth.toFixed(0)}%</p>
          </div>
          <div className="stat-tile">
            <p className="stat-tile-label">Rate change since 2000</p>
            <p className="stat-tile-value">
              {summary.rateChange >= 0 ? '+' : ''}
              {summary.rateChange.toFixed(2)} pp
            </p>
          </div>
        </div>
      )}

      {showTheory && (
        <div className="card mt-4 p-5 text-sm leading-relaxed text-fg-muted">
          <h2 className="mb-2 text-base font-semibold text-fg">What the models say</h2>
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
          <p className="mt-3 text-xs text-fg-subtle">
            Correlations here are suggestive, not causal. Use the tools to isolate one mechanism at a
            time.
          </p>
        </div>
      )}

      <p className="mt-5 text-xs text-fg-subtle">
        Source: <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.8em]">data/us_money_market_monthly_2000_2025.csv</code>,
        exported by{' '}
        <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[0.8em]">analysis/export.py</code>.
      </p>
    </div>
  )
}
