import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ToolHeader,
  ToolCallout,
  SliderControl,
  StatBox,
  InfoBox,
} from '../components/ToolComponents'
import { generateMultiplierRounds, formatNumber } from '../lib/calculations'
import { chartTheme, chartColor } from '../design/chartTheme'

const CUMULATIVE_STROKE = chartColor(0)
const PER_ROUND_STROKE = chartColor(1)

export default function MultiplicerSimulator() {
  const [mpc, setMpc] = useState(0.6)
  const [governmentSpending, setGovernmentSpending] = useState(100)

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

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox label="Multiplier" value={multiplier.toFixed(2)} tone="accent" />
        <StatBox label="Initial Spending" value={formatNumber(governmentSpending)} unit="$B" />
        <StatBox label="Total GDP Impact" value={formatNumber(maxChange)} unit="$B" tone="accent" />
        <StatBox
          label="Additional Output"
          value={formatNumber(maxChange - governmentSpending)}
          unit="$B"
        />
      </div>

      <div className="mb-8">
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
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Multiplier Rounds: Cumulative GDP Impact
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={roundsData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="round"
              label={{ value: 'Round', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Cumulative $ Billions',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              {...chartTheme.axis}
            />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <Bar dataKey="cumulative" fill={CUMULATIVE_STROKE} name="Cumulative GDP Impact" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="visualization-container mt-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">Round-by-Round Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={roundsData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="round"
              label={{ value: 'Round', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{ value: '$ Billions', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <Tooltip {...chartTheme.tooltip} cursor={chartTheme.cursor} />
            <Bar dataKey="change" fill={PER_ROUND_STROKE} name="Spending This Round" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card mt-8 p-6">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">Rounds Detail Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm tabular-nums">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="px-2 py-2 text-left font-semibold text-fg">Round</th>
                <th className="px-2 py-2 text-right font-semibold text-fg">Spending This Round</th>
                <th className="px-2 py-2 text-right font-semibold text-fg">Cumulative Total</th>
              </tr>
            </thead>
            <tbody>
              {roundsData.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border ${i % 2 === 0 ? 'bg-surface' : 'bg-surface-2'}`}
                >
                  <td className="px-2 py-2 text-left">{row.round}</td>
                  <td className="px-2 py-2 text-right">${row.change.toFixed(2)}B</td>
                  <td className="px-2 py-2 text-right font-semibold text-fg">
                    ${row.cumulative.toFixed(2)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ToolCallout label="Key insights" variant="insight" title="What the model implies">
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
      </ToolCallout>
    </div>
  )
}
