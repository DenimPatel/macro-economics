import { useState } from 'react'
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartBar } from '../components/ChartPrimitives'
import {
  InfoBox,
  SliderControl,
  StatBox,
  TileReadout,
  ToolControlBar,
  ToolHeader,
  ToolNote,
} from '../components/ToolComponents'
import { generateMultiplierRounds, formatNumber } from '../lib/calculations'
import { chartColor, chartTheme, useChartTextScaleSignal } from '../design/chartTheme'
import { useToolReset } from '../lib/toolReset'

const CUMULATIVE_STROKE = chartColor(0)
const PER_ROUND_STROKE = chartColor(1)

/**
 * One copy of this tool's starting values.
 *
 * The `useState` calls below read from it, so a default that is revised
 * here cannot leave "Reset to defaults" returning to a number the tool no
 * longer opens at — the failure mode of the five hand-written resets this
 * replaced, each of which re-typed every default in a second list.
 */
const DEFAULTS = {
  mpc: 0.6,
  governmentSpending: 100,
}

export default function MultiplicerSimulator() {
  // Re-renders the tool when the reader changes the text size, so that the
  // axis `key` inside `chartTheme.axis` / `chartTheme.yAxis` is re-read and
  // Recharts re-measures its tick labels. Recharts measures them once, in
  // `componentDidMount`, and there is no other way to refresh that number.
  useChartTextScaleSignal()
const [mpc, setMpc] = useState(DEFAULTS.mpc)
const [governmentSpending, setGovernmentSpending] = useState(DEFAULTS.governmentSpending)

  const { reset, dirty } = useToolReset(
    {
    mpc: mpc,
    governmentSpending: governmentSpending,
    },
    {
      setMpc,
      setGovernmentSpending,
    },
    {
      mpc: DEFAULTS.mpc,
      governmentSpending: DEFAULTS.governmentSpending,
    },
  )

  const multiplier = 1 / (1 - mpc)
  const maxChange = governmentSpending * multiplier
  const roundsData = generateMultiplierRounds(governmentSpending, mpc, 8)

  return (
    <div className="tool-card">
      <ToolHeader
        title="Multiplier Effect Simulator"
        description="Watch government spending cascade through the economy. An initial $1 billion spending increase generates consumption in subsequent rounds, amplifying total GDP impact through the multiplier effect."
        badge="beginner"
      />

      <div className="control-panel">
        <SliderControl
          label="Marginal Propensity to Consume (MPC)"
          value={mpc}
          min={0.1}
          max={0.95}
          step={0.05}
          onChange={setMpc}
        />
        <SliderControl
          label="Government Spending Increase"
          value={governmentSpending}
          min={10}
          max={500}
          step={10}
          onChange={setGovernmentSpending}
          unit="$B"
        />
      </div>

      <ToolControlBar onReset={reset} dirty={dirty} />
      <div className="mb-s-8 grid grid-cols-2 gap-s-3 lg:grid-cols-4">
        <StatBox label="Multiplier" value={multiplier.toFixed(2)} tone="accent" />
        <StatBox label="Initial Spending" value={formatNumber(governmentSpending)} unit="$B" />
        <StatBox label="Total GDP Impact" value={formatNumber(maxChange)} unit="$B" tone="accent" />
        <StatBox
          label="Additional Output"
          value={formatNumber(maxChange - governmentSpending)}
          unit="$B"
        />
      </div>
        <TileReadout>
                  The multiplier 1/(1 − MPC) is the SLOPE of the cumulative line rather
                  than a point on it, so it is the ratio of the plateau to the first
                  bar: {formatNumber(maxChange / roundsData[0].change)} here. Initial
                  Spending is the first bar of the round-by-round chart, Total GDP
                  Impact is where the cumulative line levels off, and Additional Output
                  — the part of the total that was not the first round — is the gap
                  between that plateau and the first bar. It is on no axis, because it
                  is a difference between two of them rather than either one.
                </TileReadout>

      <div className="mb-s-8">
        <InfoBox type="info" title="How it works">
          <p>
            When government spends $1B, firms produce that output (Round 1). Workers earn $1B income
            and consume {(mpc * 100).toFixed(0)}% = ${(governmentSpending * mpc).toFixed(1)}B (Round
            2). This creates new demand, then output, then income, then consumption cycles. Each
            round is {(mpc * 100).toFixed(0)}% smaller, converging to a total impact of $
            {maxChange.toFixed(1)}B.
          </p>
        </InfoBox>
      </div>

      <div className="visualization-container">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">
          Multiplier Rounds: Cumulative GDP Impact
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={roundsData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="round"
              label={{ value: 'Round', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{
                value: 'Cumulative $ Billions',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <ChartBar dataKey="cumulative" fill={CUMULATIVE_STROKE} name="Cumulative GDP Impact" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="visualization-container mt-s-8">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Round-by-Round Breakdown</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={roundsData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              key={chartTheme.axisKey('x')}
              dataKey="round"
              label={{ value: 'Round', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
              includeHidden
            />
            <YAxis
              key={chartTheme.axisKey('y')}
              label={{ value: '$ Billions', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.yAxis}
              includeHidden
            />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <ChartBar dataKey="change" fill={PER_ROUND_STROKE} name="Spending This Round" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card mt-s-8 p-s-6">
        <h2 className="mb-s-4 text-lg font-semibold tracking-tight text-fg">Rounds Detail Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="px-s-2 py-s-2 text-left font-semibold text-fg">Round</th>
                <th className="px-s-2 py-s-2 text-right font-semibold text-fg">Spending This Round</th>
                <th className="px-s-2 py-s-2 text-right font-semibold text-fg">Cumulative Total</th>
              </tr>
            </thead>
            <tbody>
              {roundsData.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'}`}
                >
                  <td className="px-s-2 py-s-2 text-left">{row.round}</td>
                  <td className="px-s-2 py-s-2 text-right">${row.change.toFixed(2)}B</td>
                  <td className="px-s-2 py-s-2 text-right font-semibold text-fg">
                    ${row.cumulative.toFixed(2)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToolNote label="Key insights" variant="insight" title="What the model implies" headingLevel={2}>
        <ul>
          <li>
            Higher MPC means a stronger multiplier. If people spend 80¢ of each $1 earned, the
            multiplier is 5x.
          </li>
          <li>
            Lower MPC means a weaker multiplier. If people save more, the feedback loop breaks
            faster.
          </li>
          <li>In open economies, imports leak demand out, reducing the multiplier.</li>
          <li>This model assumes sticky prices and excess capacity (short-run assumption).</li>
        </ul>
      </ToolNote>
    </div>
  )
}
