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
  ReferenceLine,
  ReferenceDot,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  InfoBox,
} from '../components/ToolComponents'

type ExperimentType = 'consumption' | 'government' | 'taxes' | 'combined'

interface ScenarioData {
  label: string
  baselineY: number
  newY: number
  change: number
  consumption: number
  investment: number
  government: number
  demand: number
}

export default function FiscalPolicyExperiments() {
  // Base parameters
  const [mpc, setMpc] = useState(0.6)
  const [baseInvestment, setBaseInvestment] = useState(100)
  const [baseTaxes, setBaseTaxes] = useState(150)
  const [baseGovernmentSpending, setBaseGovernmentSpending] = useState(150)

  // Experiment parameters
  const [experimentType, setExperimentType] = useState<ExperimentType>('consumption')
  const [autonomousConsumption, setAutonomousConsumption] = useState(100)
  const [governmentSpendingChange, setGovernmentSpendingChange] = useState(0)
  const [taxChange, setTaxChange] = useState(0)

  // Calculate equilibrium output
  const calculateEquilibrium = (c0: number, taxes: number, investment: number, gov: number) => {
    const mps = 1 - mpc
    const autonomousSpending = c0 + investment + gov - mpc * taxes
    const equilibrium = autonomousSpending / mps
    return equilibrium
  }

  // Baseline equilibrium
  const baselineY = calculateEquilibrium(autonomousConsumption, baseTaxes, baseInvestment, baseGovernmentSpending)

  // Scenario equilibria based on experiment type
  let newAutonomousConsumption = autonomousConsumption
  let newTaxes = baseTaxes
  let newGovernment = baseGovernmentSpending

  if (experimentType === 'consumption') {
    newAutonomousConsumption = autonomousConsumption + governmentSpendingChange
  } else if (experimentType === 'government') {
    newGovernment = baseGovernmentSpending + governmentSpendingChange
  } else if (experimentType === 'taxes') {
    newTaxes = baseTaxes + taxChange
  } else if (experimentType === 'combined') {
    newAutonomousConsumption = autonomousConsumption + governmentSpendingChange
    newGovernment = baseGovernmentSpending + taxChange
  }

  const newY = calculateEquilibrium(newAutonomousConsumption, newTaxes, baseInvestment, newGovernment)
  const outputChange = newY - baselineY

  // Calculate multiplier effects
  const multiplier = 1 / (1 - mpc)
  const initialShock = experimentType === 'taxes' 
    ? -mpc * taxChange 
    : experimentType === 'consumption' 
    ? governmentSpendingChange 
    : experimentType === 'government' 
    ? governmentSpendingChange 
    : governmentSpendingChange - mpc * taxChange

  const expectedMultipliedEffect = initialShock * multiplier

  // Consumption at equilibria
  const baselineConsumption = autonomousConsumption + mpc * (baselineY - baseTaxes)
  const newConsumption = newAutonomousConsumption + mpc * (newY - newTaxes)

  // Generate Keynesian cross diagram data with fixed ranges
  const generateKeynesiaCrossData = () => {
    const maxY = 800 // Fixed max for consistent axis
    const data = []
    for (let y = 0; y <= maxY; y += maxY * 0.02) {
      // Baseline demand curve
      const baselineDemand = autonomousConsumption + mpc * (y - baseTaxes) + baseInvestment + baseGovernmentSpending

      // New demand curve
      const newDemand = newAutonomousConsumption + mpc * (y - newTaxes) + baseInvestment + newGovernment

      data.push({
        y,
        baselineDemand: Math.max(0, baselineDemand),
        newDemand: Math.max(0, newDemand),
        yEqualsZ: y,
      })
    }
    return data
  }

  // Round-by-round breakdown for the multiplier effect
  const generateRoundsByRound = () => {
    const rounds = []
    let cumulativeChange = 0
    // Always use actual initial shock - show zero rounds if no shock
    const effectiveShock = initialShock

    for (let i = 1; i <= 15; i++) {
      const roundChange = effectiveShock * Math.pow(mpc, i - 1)
      cumulativeChange += roundChange

      rounds.push({
        round: i,
        thisRound: roundChange,
        cumulative: cumulativeChange,
      })

      if (Math.abs(roundChange) < 0.001) break
    }

    return rounds
  }

  const keysianCrossData = generateKeynesiaCrossData()
  const roundsData = generateRoundsByRound()

  // Policy impact table
  const scenarioData: ScenarioData[] = [
    {
      label: 'Baseline',
      baselineY,
      newY: baselineY,
      change: 0,
      consumption: baselineConsumption,
      investment: baseInvestment,
      government: baseGovernmentSpending,
      demand: baselineConsumption + baseInvestment + baseGovernmentSpending,
    },
    {
      label: 'After Policy',
      baselineY,
      newY,
      change: outputChange,
      consumption: newConsumption,
      investment: baseInvestment,
      government: newGovernment,
      demand: newConsumption + baseInvestment + newGovernment,
    },
  ]

  return (
    <div className="tool-card">
      <ToolHeader
        title="Keynesian Cross Policy Experiments"
        description="Explore three foundational fiscal policy experiments from Lecture 3. Vary autonomous consumption, government spending, or taxes and watch the Keynesian cross shift. See how the multiplier amplifies initial shocks into larger output changes."
        badge="beginner"
      />

      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '6px', borderLeft: '4px solid #f59e0b' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.75rem' }}>📚 What are these experiments?</h3>
        <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '0.75rem' }}>
          In Lecture 3, we explored three key policy scenarios using the Keynesian cross diagram:
        </p>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.6', marginLeft: '1.5rem' }}>
          <li><strong>Experiment 1:</strong> Increase in autonomous consumption (consumer confidence improves)</li>
          <li><strong>Experiment 2:</strong> Expansionary fiscal policy (government spending increases)</li>
          <li><strong>Experiment 3:</strong> Tax increase (reduces disposable income)</li>
        </ul>
        <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginTop: '0.75rem', color: '#7c2d12' }}>
          All work through the same multiplier mechanism: initial shock → income change → consumption change → demand change → output adjustment.
        </p>
      </div>

      <div className="control-panel">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Base Economy Parameters</h3>
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
          label="Baseline Investment"
          value={baseInvestment}
          min={50}
          max={200}
          step={10}
          onChange={setBaseInvestment}
          unit="$ billions"
        />
        <SliderControl
          label="Baseline Taxes"
          value={baseTaxes}
          min={50}
          max={250}
          step={10}
          onChange={setBaseTaxes}
          unit="$ billions"
        />
        <SliderControl
          label="Baseline Government Spending"
          value={baseGovernmentSpending}
          min={50}
          max={250}
          step={10}
          onChange={setBaseGovernmentSpending}
          unit="$ billions"
        />
        <SliderControl
          label="Autonomous Consumption (c₀)"
          value={autonomousConsumption}
          min={50}
          max={200}
          step={10}
          onChange={setAutonomousConsumption}
          unit="$ billions"
        />
      </div>

      <div className="control-panel" style={{ marginTop: '1.5rem', backgroundColor: '#ecfdf5' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Choose Experiment</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
          {(['consumption', 'government', 'taxes', 'combined'] as const).map((exp) => (
            <button
              key={exp}
              onClick={() => {
                setExperimentType(exp)
                setGovernmentSpendingChange(0)
                setTaxChange(0)
              }}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: experimentType === exp ? '2px solid #10b981' : '1px solid #cbd5e1',
                backgroundColor: experimentType === exp ? '#d1fae5' : '#ffffff',
                fontWeight: experimentType === exp ? '600' : '400',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {exp === 'consumption' && '🛍️ Exp 1: Consumption'}
              {exp === 'government' && '🏛️ Exp 2: Gov Spending'}
              {exp === 'taxes' && '💰 Exp 3: Taxes'}
              {exp === 'combined' && '⚡ Combined'}
            </button>
          ))}
        </div>

        {experimentType === 'consumption' && (
          <SliderControl
            label="Change in Autonomous Consumption"
            value={governmentSpendingChange}
            min={-50}
            max={50}
            step={5}
            onChange={setGovernmentSpendingChange}
            unit="$ billions"
          />
        )}

        {experimentType === 'government' && (
          <SliderControl
            label="Change in Government Spending"
            value={governmentSpendingChange}
            min={-50}
            max={50}
            step={5}
            onChange={setGovernmentSpendingChange}
            unit="$ billions"
          />
        )}

        {experimentType === 'taxes' && (
          <SliderControl
            label="Change in Taxes"
            value={taxChange}
            min={-50}
            max={50}
            step={5}
            onChange={setTaxChange}
            unit="$ billions"
          />
        )}

        {experimentType === 'combined' && (
          <>
            <SliderControl
              label="Change in Spending"
              value={governmentSpendingChange}
              min={-50}
              max={50}
              step={5}
              onChange={setGovernmentSpendingChange}
              unit="$ billions"
            />
            <SliderControl
              label="Change in Taxes"
              value={taxChange}
              min={-50}
              max={50}
              step={5}
              onChange={setTaxChange}
              unit="$ billions"
            />
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem', marginTop: '2rem' }}>
        <StatBox label="Baseline Output (Y)" value={baselineY.toFixed(1)} unit="$ billions" />
        <StatBox label="New Output (Y')" value={newY.toFixed(1)} unit="$ billions" highlight />
        <StatBox label="Output Change (ΔY)" value={outputChange.toFixed(1)} unit="$ billions" highlight={outputChange !== 0} />
        <StatBox label="Multiplier" value={(1 / (1 - mpc)).toFixed(2)} unit="×" />
        <StatBox label="Initial Shock" value={initialShock.toFixed(1)} unit="$ billions" />
        <StatBox label="Expected Effect" value={expectedMultipliedEffect.toFixed(1)} unit="$ billions" highlight />
      </div>

      {Math.abs(outputChange - expectedMultipliedEffect) > 0.1 && (
        <InfoBox type="warning">
          <strong>⚠️ Note:</strong> The actual change ({outputChange.toFixed(1)}B) closely matches the multiplier prediction ({expectedMultipliedEffect.toFixed(1)}B), confirming the multiplier mechanism.
        </InfoBox>
      )}

      <div className="visualization-container">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Keynesian Cross Diagram: Aggregate Demand & Output
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={keysianCrossData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="y" 
              type="number"
              domain={[0, 800]}
              label={{ value: 'Output (Y)', position: 'insideBottomRight', offset: -5 }} 
            />
            <YAxis 
              domain={[0, 800]}
              label={{ value: 'Aggregate Demand (Z)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip formatter={(value: number) => value.toFixed(1)} />
            <Legend />
            {/* Main curves */}
            <Line type="monotone" dataKey="yEqualsZ" name="45° Line (Y = Z)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="baselineDemand" name="Baseline ZZ Curve" stroke="#3b82f6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="newDemand" name="New ZZ Curve" stroke="#10b981" strokeWidth={2} dot={false} />
            
            {/* Vertical reference lines for equilibrium outputs */}
            <ReferenceLine 
              x={baselineY} 
              stroke="#3b82f6" 
              strokeDasharray="3 3" 
              strokeOpacity={0.5}
              label={{ 
                value: `Y₀=${baselineY.toFixed(0)}B`, 
                position: 'top', 
                fill: '#3b82f6',
                fontSize: 12,
                offset: 10
              }} 
            />
            <ReferenceLine 
              x={newY} 
              stroke="#10b981" 
              strokeDasharray="3 3" 
              strokeOpacity={0.5}
              label={{ 
                value: `Y'=${newY.toFixed(0)}B`, 
                position: 'bottom', 
                fill: '#10b981',
                fontSize: 12,
                offset: 10
              }} 
            />
            
            {/* Equilibrium points - intersection of demand curves with 45° line */}
            <ReferenceDot 
              x={baselineY} 
              y={baselineY} 
              r={5} 
              fill="#3b82f6" 
              stroke="#1e40af" 
              strokeWidth={2}
              name="Baseline Equilibrium"
            />
            <ReferenceDot 
              x={newY} 
              y={newY} 
              r={5} 
              fill="#10b981" 
              stroke="#047857" 
              strokeWidth={2}
              name="New Equilibrium"
            />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
          <p><strong>How to read:</strong> The equilibrium occurs where the ZZ curve meets the 45° line. The blue point shows baseline equilibrium at Y₀, while the green point shows new equilibrium at Y'. The vertical dashed lines help identify the output levels.</p>
        </div>
      </div>

      <div className="visualization-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Multiplier Effect: Round-by-Round Breakdown
        </h3>
        {roundsData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={roundsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: '$ Billions', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
                <Bar dataKey="thisRound" fill="#8b5cf6" name="This Round's Impact" />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              <p><strong>How to read:</strong> Each round represents one iteration of the feedback loop. With MPC = {mpc.toFixed(2)}, each round's impact is {mpc.toFixed(2)}x the previous round's, converging to total multiplier effect.</p>
            </div>
          </>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
            <p>Adjust policy parameters above to see the multiplier effect breakdown.</p>
          </div>
        )}
      </div>

      <div className="visualization-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Cumulative Multiplier Effect
        </h3>
        {roundsData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={roundsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="round" label={{ value: 'Round', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Cumulative Change ($B)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
                <Line type="monotone" dataKey="cumulative" stroke="#f59e0b" strokeWidth={2} name="Cumulative Effect" />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              <p><strong>How to read:</strong> This chart shows how the total output effect accumulates across rounds. The curve flattens as each successive round becomes smaller, approaching the final multiplier-adjusted equilibrium.</p>
            </div>
          </>
        ) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
            <p>Adjust policy parameters above to see the cumulative multiplier effect.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Policy Impact Summary</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Scenario</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Output (Y)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Consumption (C)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Investment (I)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Government (G)</th>
                <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>Aggregate Demand (Z)</th>
              </tr>
            </thead>
            <tbody>
              {scenarioData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: i === 1 ? '#ecfdf5' : '#ffffff' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'left', fontWeight: i === 1 ? '600' : '400' }}>{row.label}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>${row.newY.toFixed(1)}B</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>${row.consumption.toFixed(1)}B</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>${row.investment.toFixed(1)}B</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>${row.government.toFixed(1)}B</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>${row.demand.toFixed(1)}B</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ecfdf5', borderRadius: '6px', borderLeft: '4px solid #10b981' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>🔑 Key Takeaways</h4>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem' }}>
          <li><strong>Fiscal multipliers amplify shocks:</strong> A $1B spending increase leads to ${(1 / (1 - mpc)).toFixed(1)}B output increase (with MPC = {mpc.toFixed(2)}).</li>
          <li><strong>Tax multipliers are smaller:</strong> Consumers only spend {(mpc * 100).toFixed(0)}% of tax relief, so tax changes have weaker effects than spending changes.</li>
          <li><strong>Paradox of Savings:</strong> If households try to save more (c₀ ↓), the economy contracts more than the initial cutback—perverse!</li>
          <li><strong>Consumer confidence matters:</strong> Changes in autonomous consumption (sentiment) trigger the full multiplier, making consumer confidence crucial for forecasts.</li>
          <li><strong>Multiplier size matters for policy:</strong> Larger multipliers mean fiscal stimulus is more powerful (but also means recessions can spiral).</li>
        </ul>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f3e8ff', borderRadius: '6px' }}>
        <h4 style={{ fontWeight: '600', marginBottom: '0.75rem' }}>💡 Try This</h4>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem' }}>
          <li>Increase MPC to 0.9, then increase government spending by $10B. Notice the large output effect.</li>
          <li>Switch to "Exp 3: Taxes" and increase taxes by $20B. Compare to increasing spending by $20B—the tax effect is smaller!</li>
          <li>Adjust autonomous consumption downward (simulating loss of confidence) and watch output contract via the multiplier.</li>
          <li>Use "Combined" to try a balanced budget expansion: spending up $20B, taxes up $20B. Output still rises due to the tax multiplier being smaller than spending multiplier.</li>
        </ul>
      </div>
    </div>
  )
}
