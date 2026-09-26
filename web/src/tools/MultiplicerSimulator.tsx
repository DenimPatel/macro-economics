import { useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'
import { generateMultiplierRounds, calculateEquilibriumOutput, formatNumber } from '../lib/calculations'

export default function MultiplicerSimulator() {
  const [mpc, setMpc] = useState(0.6)
  const [governmentSpending, setGovernmentSpending] = useState(100)
  const [showRounds, setShowRounds] = useState(true)

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
          unit=""
        />
        <SliderControl
          label="Government Spending Increase"
          value={governmentSpending}
          min={10}
          max={500}
          step={10}
          onChange={setGovernmentSpending}
          unit="$ billions"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatBox label="Multiplier" value={multiplier.toFixed(2)} highlight />
        <StatBox label="Initial Spending" value={formatNumber(governmentSpending)} unit="$ billions" />
        <StatBox label="Total GDP Impact" value={formatNumber(maxChange)} unit="$ billions" highlight />
        <StatBox label="Additional Output" value={formatNumber(maxChange - governmentSpending)} unit="$ billions" />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <InfoBox type="info">
          <strong>How it works:</strong> When government spends $1B, firms produce that output (Round 1). Workers earn $1B income and consume {(mpc * 100).toFixed(0)}% = ${(governmentSpending * mpc).toFixed(1)}B (Round 2). This creates new demand → output → income → consumption cycles. Each round is {(mpc * 100).toFixed(0)}% smaller, converging to total impact of ${maxChange.toFixed(1)}B.
        </InfoBox>
      </div>

      <div className="visualization-container">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Multiplier Rounds: Cumulative GDP Impact
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={roundsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Cumulative $ Billions', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="cumulative" fill="#3b82f6" name="Cumulative GDP Impact" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="visualization-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Round-by-Round Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={roundsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: '$ Billions', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="change" fill="#10b981" name="Spending This Round" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Rounds Detail Table
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600' }}>Round</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600' }}>Spending This Round</th>
                <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600' }}>Cumulative Total</th>
              </tr>
            </thead>
            <tbody>
              {roundsData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '0.5rem', textAlign: 'left' }}>{row.round}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right' }}>${row.change.toFixed(2)}B</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: '600' }}>${row.cumulative.toFixed(2)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📌 Key Insights</h4>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.5rem' }}>
          <li>Higher MPC → Stronger multiplier. If people spend 80¢ of each $1 earned, multiplier is 5x.</li>
          <li>Lower MPC → Weaker multiplier. If people save more, feedback loop breaks faster.</li>
          <li>In open economies, imports leak demand out, reducing the multiplier.</li>
          <li>This model assumes sticky prices and excess capacity (short-run assumption).</li>
        </ul>
      </div>
    </div>
  )
}
