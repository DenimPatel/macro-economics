import { useState } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

/**
 * Speculative Attack on Fixed Peg Visualization
 * 
 * This component simulates currency crisis dynamics under fixed exchange rate regimes.
 * It demonstrates how speculative attacks arise from fundamental inconsistencies
 * and loss of confidence, ultimately leading to reserve depletion and peg collapse.
 * 
 * Key themes from Lecture 21 (Exchange Rate Regimes):
 * - Fixed pegs require monetary policy independence to be sacrificed
 * - Speculators attack when they expect devaluation
 * - Defending peg requires high interest rates, causing domestic recession
 * - Insufficient reserves cannot sustain defense indefinitely
 */

interface AttackData {
  period: number
  reserves: number
  reservesPercent: number
  domesticRate: number
  foreignRate: number
  capitalOutflow: number
  speculatorAttack: number
  exchangeRate: number
  gdp: number
  inflationExpectation: number
  pegged: boolean
}

export default function SpeculativeAttack() {
  // Control parameters
  const [moneyGrowthRate, setMoneyGrowthRate] = useState(0.08) // 8% domestic money growth
  const [policyRate, setPolicyRate] = useState(0.03) // 3% domestic policy rate
  const [capitalControls, setCapitalControls] = useState(0.3) // 30% capital restriction
  const [initialReserves, setInitialReserves] = useState(100) // Initial reserves as % of money supply
  const [specAggressiveness, setSpecAggressiveness] = useState(0.5) // How aggressively speculators attack
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [scenarioMode, setScenarioMode] = useState<'crisis' | 'stable' | 'managed'>('crisis')

  // Scenario presets
  let activeMoney = moneyGrowthRate
  let activePolicy = policyRate
  let activeControls = capitalControls
  let activeAgg = specAggressiveness

  if (scenarioMode === 'stable') {
    activeMoney = 0.03 // Low money growth
    activePolicy = 0.04 // Policy matches foreign rate
    activeControls = 0.7 // Strong capital controls
    activeAgg = 0.1 // Low aggression
  } else if (scenarioMode === 'managed') {
    activeMoney = 0.05
    activePolicy = 0.035
    activeControls = 0.5
    activeAgg = 0.3
  }

  const foreignRate = 0.04 // 4% foreign policy rate (exogenous)

  /**
   * Simulate the speculative attack dynamics
   * Key mechanism:
   * 1. If domestic money growth > foreign rate, expectations of devaluation form
   * 2. If devaluation is expected, UIP requires: i = i* + (expected depreciation)
   * 3. To defend peg (prevent depreciation), must raise i dramatically
   * 4. High rates cause GDP to contract
   * 5. Speculators see writing on wall - attack reserves
   * 6. Once reserves exhausted, peg must collapse
   */
  const generateAttackPath = (): AttackData[] => {
    const data: AttackData[] = []
    let reserves = initialReserves
    let peg = true
    let pegBreakPeriod = -1

    // Parameters
    const initialMoneySupply = 100
    const initialExchangeRate = 1.0 // Pegged to foreign currency
    const crisisThreshold = 20 // Peg breaks when reserves fall below 20% of money supply

    for (let period = 0; period <= 60; period++) {
      // Step 1: Calculate expected depreciation based on money growth differential
      const moneyGrowthDifferential = activeMoney - foreignRate
      const expectedDevaluation = Math.max(0, moneyGrowthDifferential) * 0.5 // Partial adjustment of expectations

      // Step 2: Determine policy rate needed to defend peg
      // UIP: i_domestic = i_foreign + expected_depreciation
      let defendingRate = foreignRate + expectedDevaluation
      let actualRate = activePolicy

      if (peg && expectedDevaluation > 0.01) {
        // If expectations of devaluation form, must raise rates to defend
        defendingRate = Math.min(foreignRate + expectedDevaluation, 0.25) // Max 25% rate
        actualRate = Math.max(activePolicy, defendingRate * 0.7) // Gradually adjust
      }

      // Step 3: Calculate capital outflow pressure
      // Higher is lower domestic rate relative to foreign rate = outflow pressure
      const rateGap = foreignRate + expectedDevaluation - actualRate
      const naturalOutflow = Math.max(0, rateGap * 50) // Base outflow from rate differential
      const speculativeOutflow =
        peg && expectedDevaluation > 0.02
          ? activeAgg * (1 - activeControls) * Math.pow(expectedDevaluation, 1.5) * 30
          : 0
      const totalOutflow = naturalOutflow + speculativeOutflow

      // Step 4: Update reserves
      const moneySupply = initialMoneySupply * Math.pow(1 + activeMoney, period)
      reserves = Math.max(0, reserves - totalOutflow * 0.5) // Reserves decline with outflows

      // Step 5: Check if peg is sustainable
      if (peg && reserves < crisisThreshold) {
        peg = false
        pegBreakPeriod = period
      }

      // Step 6: Calculate exchange rate
      let exchangeRate = initialExchangeRate
      if (!peg) {
        // After peg breaks, exchange rate depreciates based on money growth
        const periodsSinceBrake = period - pegBreakPeriod
        exchangeRate = initialExchangeRate * Math.pow(1 + activeMoney * 0.8, periodsSinceBrake)
      }

      // Step 7: GDP contraction from high rates
      // High interest rates reduce investment and consumption
      const rateLevel = actualRate
      const gdpEffect = Math.max(0.7, 1 - rateLevel * 1.5) // GDP can drop to 70% with 20% rates
      const gdp = gdpEffect * 100

      // Step 8: Inflation expectations rise
      // With depreciation or if peg lost credibility, inflation expectations rise
      const inflationExpectation = !peg
        ? activeMoney * 100 + (period - pegBreakPeriod) * 2
        : activeMoney * 50 + expectedDevaluation * 100

      data.push({
        period,
        reserves: parseFloat(Math.max(0, reserves).toFixed(2)),
        reservesPercent: parseFloat((reserves / moneySupply * 100).toFixed(1)),
        domesticRate: parseFloat((actualRate * 100).toFixed(2)),
        foreignRate: parseFloat((foreignRate * 100).toFixed(2)),
        capitalOutflow: parseFloat(totalOutflow.toFixed(2)),
        speculatorAttack: parseFloat(speculativeOutflow.toFixed(2)),
        exchangeRate: parseFloat(exchangeRate.toFixed(3)),
        gdp: parseFloat(gdp.toFixed(1)),
        inflationExpectation: parseFloat(Math.max(0, Math.min(40, inflationExpectation)).toFixed(1)),
        pegged: peg,
      })
    }

    return data
  }

  const attackData = generateAttackPath()

  // Find critical moment
  const pegBreakIndex = attackData.findIndex((d) => !d.pegged)
  const pegBreakReserves = pegBreakIndex >= 0 ? attackData[pegBreakIndex].reserves : null
  const peakRate =
    pegBreakIndex >= 0
      ? Math.max(...attackData.slice(0, pegBreakIndex + 5).map((d) => d.domesticRate))
      : Math.max(...attackData.map((d) => d.domesticRate))

  // Calculate final outcomes
  const finalData = attackData[attackData.length - 1]
  const maxOutflow = Math.max(...attackData.map((d) => d.capitalOutflow))

  const resetToDefault = () => {
    setMoneyGrowthRate(0.08)
    setPolicyRate(0.03)
    setCapitalControls(0.3)
    setInitialReserves(100)
    setSpecAggressiveness(0.5)
    setScenarioMode('crisis')
    setIsPlaying(false)
  }

  return (
    <div className="tool-card">
      <ToolHeader
        title="Speculative Attack on Fixed Peg"
        description="Explore how inconsistent domestic and foreign policies create currency crisis dynamics. Watch as speculators attack the central bank's reserves, forcing abandonment of the exchange rate peg. From Lecture 21: How fixed regimes can collapse when underlying fundamentals are unsustainable."
        badge="advanced"
      />

      {/* Control Panel */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Crisis Parameters</h2>
        <div className="control-panel">
          <SliderControl
            label="Domestic Money Growth Rate"
            value={activeMoney}
            min={0.01}
            max={0.15}
            step={0.01}
            onChange={setMoneyGrowthRate}
            unit="%" !== 'crisis'}
          />
          <SliderControl
            label="Domestic Policy Rate"
            value={activePolicy}
            min={0.01}
            max={0.25}
            step={0.01}
            onChange={setPolicyRate}
            unit="%" !== 'crisis'}
          />
          <SliderControl
            label="Capital Controls Strength"
            value={activeControls}
            min={0}
            max={1}
            step={0.1}
            onChange={setCapitalControls}
            unit="" !== 'crisis'}
          />
          <SliderControl
            label="Initial Reserves (% of money supply)"
            value={initialReserves}
            min={20}
            max={150}
            step={10}
            onChange={setInitialReserves}
            unit="%" !== 'crisis'}
          />
          <SliderControl
            label="Speculator Aggressiveness"
            value={specAggressiveness}
            min={0}
            max={1}
            step={0.1}
            onChange={setSpecAggressiveness}
            unit="" !== 'crisis'}
          />
        </div>
      </div>

      {/* Scenario Buttons */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Scenario Analysis</h2>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <Button
            onClick={() => setScenarioMode('crisis')}
            variant={scenarioMode === 'crisis' ? 'primary' : 'secondary'}
          >
            Crisis Scenario (High Growth + Low Controls)
          </Button>
          <Button
            onClick={() => setScenarioMode('stable')}
            variant={scenarioMode === 'stable' ? 'primary' : 'secondary'}
          >
            Stable Peg (Low Growth + Capital Controls)
          </Button>
          <Button
            onClick={() => setScenarioMode('managed')}
            variant={scenarioMode === 'managed' ? 'primary' : 'secondary'}
          >
            Managed Float (Medium Parameters)
          </Button>
          <Button onClick={resetToDefault} variant="secondary">
            Reset All
          </Button>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem' }}>Timeline</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary">
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Button>
          <SliderControl
            label="Playback Speed"
            value={playbackSpeed}
            min={0.5}
            max={3}
            step={0.5}
            onChange={setPlaybackSpeed}
            unit="x"
          />
        </div>
        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
          Watch how reserves deplete over 60 periods. The peg breaks when reserves exhausted.
        </p>
      </div>

      {/* Critical Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatBox
          label="Foreign Policy Rate"
          value={foreignRate.toFixed(1)}
          unit="%"
        />
        <StatBox
          label="Initial Reserves"
          value={initialReserves.toFixed(0)}
          unit="% of M"
          highlight={initialReserves < 50}
        />
        <StatBox
          label="Peg Breaks at Period"
          value={pegBreakIndex >= 0 ? pegBreakIndex : '—'}
          highlight={pegBreakIndex >= 0 && pegBreakIndex < 30}
        />
        <StatBox
          label="Peak Defense Rate"
          value={peakRate.toFixed(2)}
          unit="%"
          highlight={peakRate > 15}
        />
        <StatBox
          label="Max Capital Outflow"
          value={maxOutflow.toFixed(2)}
          unit="per period"
          highlight
        />
        <StatBox
          label="Final Exchange Rate"
          value={finalData.exchangeRate.toFixed(3)}
          highlight={finalData.exchangeRate > 1.1}
        />
      </div>

      {/* Educational Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <InfoBox type="info">
          <strong>🔍 The Fundamental Inconsistency:</strong>
          With fixed exchange rates, the domestic interest rate must equal the foreign rate (UIP with no expected depreciation).
          But if domestic money is growing faster than foreign money, this is unsustainable—people expect depreciation eventually.
          To defend the peg and prevent immediate depreciation, the central bank must raise rates above the foreign rate, 
          contradicting the fundamental inconsistency.
        </InfoBox>

        <InfoBox type="warning">
          <strong>📉 The Reserve Loss:</strong>
          When speculators attack (exchange domestic currency for reserves), the central bank loses reserves to defend the peg.
          With limited reserves, defense becomes impossible. Once reserves are exhausted, the peg must collapse.
          Watch how capital outflows accelerate when expectations of devaluation strengthen!
        </InfoBox>

        <InfoBox type="info">
          <strong>📊 The Interest Rate Paradox:</strong>
          The higher the interest rate raised to defend the peg, the more the domestic recession deepens (Y ↓).
          This economic deterioration actually INCREASES the likelihood of devaluation—making the speculative attack self-fulfilling!
          Defenders face an impossible choice: contract the economy or lose the peg.
        </InfoBox>

        <InfoBox type="success">
          <strong>🛡️ Capital Controls as Escape Valve:</strong>
          Capital controls can slow the rate of reserve loss by restricting speculators' ability to exchange currency.
          However, they're not a permanent solution—determined speculators find ways around them.
          Countries must eventually choose: float the currency or maintain credibility through consistent policy.
        </InfoBox>
      </div>

      {/* Reserve Depletion Chart */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Central Bank Reserves: The Countdown to Crisis
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          Reserves deplete as speculators exchange domestic currency for hard currency reserves.
          {pegBreakIndex >= 0 && (
            <span>
              {' '}
              <strong style={{ color: '#dc2626' }}>
                Peg breaks at period {pegBreakIndex}
              </strong>
              when reserves fall below the critical threshold.
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={attackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }} />
            <YAxis
              label={{ value: 'Reserves (% of money supply)', angle: -90, position: 'insideLeft' }}
              domain={[0, 'auto']}
            />
            <Tooltip formatter={(value: any) => value.toFixed(2)} />
            <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="5 5" label="Critical Level (20%)" />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="reserves"
              stroke="#3b82f6"
              fill="#93c5fd"
              name="Reserves (hard currency)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Initial reserves: {initialReserves.toFixed(0)}% of money supply | Final reserves: {finalData.reserves.toFixed(2)}%
        </p>
      </div>

      {/* Interest Rate Defense */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Interest Rate Defense: The Cost of Defending the Peg
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          As speculators attack and reserves deplete, the central bank must raise interest rates to defend the peg.
          Notice how the domestic rate (blue) diverges from the foreign rate (orange) when the peg is under threat.
          {pegBreakIndex >= 0 && (
            <span>
              {' '}
              After period {pegBreakIndex}, the peg breaks and the domestic rate can fall back toward sustainable levels.
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={attackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Interest Rate (%)', angle: -90, position: 'insideLeft' }} domain={[0, 30]} />
            <Tooltip formatter={(value: any) => value.toFixed(2)} />
            <Legend />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Line
              type="monotone"
              dataKey="domesticRate"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Domestic Rate (defense effort)"
            />
            <Line type="monotone" dataKey="foreignRate" stroke="#f59e0b" strokeWidth={2} name="Foreign Rate (exogenous)" />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Peak domestic rate: {peakRate.toFixed(2)}% | Foreign rate: {(foreignRate * 100).toFixed(2)}%
        </p>
      </div>

      {/* Capital Outflows and Speculative Attack */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Capital Outflows and Speculative Attack
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          Capital outflows accelerate when speculators sense the peg is doomed. The "speculative attack" (red) shows
          when organized speculators actively rush to exchange the domestic currency, hoping to trigger the devaluation
          they've been anticipating. This self-fulfilling prophecy is the hallmark of currency crises.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={attackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Outflow per Period', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value: any) => value.toFixed(2)} />
            <Legend />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Bar dataKey="capitalOutflow" stackId="a" fill="#10b981" name="Normal Outflow (rate differential)" />
            <Bar dataKey="speculatorAttack" stackId="a" fill="#ef4444" name="Speculative Attack" />
          </ComposedChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Max outflow per period: {maxOutflow.toFixed(2)} | Speculator aggressiveness: {(specAggressiveness * 100).toFixed(0)}%
        </p>
      </div>

      {/* GDP Contraction from Defense */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Real Output Contraction: The Recession Cost
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          Defending the peg requires raising interest rates, which contracts investment and consumption.
          GDP falls as rates rise. Notice the deepest recession occurs right when the peg breaks—the point
          where the fundamental inconsistency becomes unsustainable. After the break, rates can fall and recovery begins
          (though with high inflation expectations).
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={attackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Real Output Index (base = 100)', angle: -90, position: 'insideLeft' }} domain={[0, 120]} />
            <Tooltip formatter={(value: any) => value.toFixed(1)} />
            <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="5 5" label="Baseline (no crisis)" />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area type="monotone" dataKey="gdp" stroke="#3b82f6" fill="#93c5fd" name="Real GDP Index" />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Minimum GDP: {Math.min(...attackData.map((d) => d.gdp)).toFixed(1)} | Final GDP: {finalData.gdp.toFixed(1)}
        </p>
      </div>

      {/* Exchange Rate Path */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Exchange Rate: From Peg to Floating Depreciation
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          The exchange rate (in units of foreign currency per unit of domestic currency) is held constant at 1.0 while
          the peg is defended. Once the peg breaks and the currency floats, rapid depreciation occurs—the domestic
          currency weakens as speculators who bet on devaluation are proven right.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={attackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }} />
            <YAxis
              label={{ value: 'Exchange Rate (units foreign/$)', angle: -90, position: 'insideLeft' }}
              domain={[0.95, 'auto']}
            />
            <Tooltip formatter={(value: any) => value.toFixed(3)} />
            <ReferenceLine y={1.0} stroke="#10b981" strokeDasharray="5 5" label="Peg level (1.0)" />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Line
              type="monotone"
              dataKey="exchangeRate"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Exchange Rate"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Exchange rate at period 0: 1.0 | Final exchange rate: {finalData.exchangeRate.toFixed(3)} ({((finalData.exchangeRate - 1) * 100).toFixed(1)}% depreciation)
        </p>
      </div>

      {/* Inflation Expectations */}
      <div className="visualization-container" style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Inflation Expectations: The Loss of Price Stability
        </h3>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
          With the peg in place, inflation expectations remain anchored (based on money growth rate).
          Once the peg breaks and the exchange rate depreciates, inflation expectations rise sharply due to:
          (1) import price increases from depreciation, (2) loss of credibility, (3) continued rapid money growth.
          This is why currency crises often lead to high inflation regimes.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={attackData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5 }} />
            <YAxis
              label={{ value: 'Expected Inflation (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 'auto']}
            />
            <Tooltip formatter={(value: any) => value.toFixed(1)} />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke="#dc2626"
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: '#dc2626', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="inflationExpectation"
              stroke="#ef4444"
              fill="#fecaca"
              name="Expected Inflation"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Initial expected inflation: {(activeMoney * 50).toFixed(1)}% | Final expected inflation: {finalData.inflationExpectation.toFixed(1)}%
        </p>
      </div>

      {/* Historical Context */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Historical Examples</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#7f1d1d' }}>1992 ERM Crisis (UK)</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              British pound pegged in European Exchange Rate Mechanism. German reunification raised German interest rates.
              UK raised rates to 15% to defend. Speculators (Soros) attacked reserves. Peg broke in hours. GDP contraction
              but long-run recovery after float allowed lower rates. Lesson: Policy inconsistency makes peg indefensible.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#7f1d1d' }}>1994-1995 Mexico Crisis</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Peso pegged to USD. Rapid money growth + current account deficit. Peso devaluation expected.
              Mexico tried to defend with high rates but ran out of reserves. Lost peg. Depreciation + domestic recession.
              High inflation followed. Only recovered with IMF bailout + structural reforms + eventual currency stabilization.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#7f1d1d' }}>1997-1998 Asian Financial Crisis</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Thai baht pegged to USD despite current account deficits and rising interest rates. Speculators attacked.
              Thailand lost reserves and eventually float forced. Contagion spread across Asia. Currencies depreciated 40-80%.
              Severe recessions followed. Shows how pegs can be vulnerable to self-fulfilling speculative attacks
              even with strong fundamentals.
            </p>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f0fdf4',
              borderLeft: '4px solid #10b981',
              borderRadius: '4px',
            }}
          >
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>Hong Kong: Successful Defense (1998)</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Hong Kong dollar pegged to USD via currency board. During Asian crisis, speculators attacked.
              Hong Kong raised interest rates to 300%+ to defend. Government bought stock index to signal commitment.
              Speculators eventually gave up. Peg held. Hong Kong avoided devaluation but suffered severe recession.
              Shows extreme credibility can defend peg even with massive attack.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderLeft: '4px solid #10b981', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>Eurozone: Unified Currency (post-1999)</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Countries gave up independent currency for Euro. No devaluation possible—no peg to break!
              However, creates rigidity: deficit countries cannot devalue to regain competitiveness. 2010-2015 Eurozone crisis
              showed danger: Greece, Portugal, Ireland faced very high unemployment because couldn't devalue.
              Fiscal transfers within Eurozone partially compensate. Lesson: Currency union prevents speculative attacks but limits flexibility.
            </p>
          </div>

          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#7f1d1d' }}>2022 Russia: War & Peg Defense</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              After invasion, ruble faced massive depreciation expectations. Russia raised rates from 4% to 20%+, implemented
              capital controls, and intervened heavily in forex market. Peg successfully defended—ruble stabilized at higher
              level. However, high rates and controls stifle growth. Shows capital controls + extreme rates can work but
              at huge economic cost. Fundamental adjustment (fiscal discipline) ultimately required.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Explanation */}
      <div style={{ marginBottom: '2rem' }}>
        <details style={{ cursor: 'pointer' }}>
          <summary style={{ fontSize: '0.9rem', fontWeight: '600', color: '#64748b', userSelect: 'none' }}>
            📐 Technical Details: The Math Behind the Crisis
          </summary>
          <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b', lineHeight: '1.6' }}>
            <p>
              <strong>Uncovered Interest Parity (UIP):</strong> With a fixed peg, the domestic interest rate must satisfy:{' '}
              <code style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '2px' }}>
                i_domestic = i_foreign + (expected depreciation)
              </code>
              <br />
              If peg is credible, expected depreciation = 0, so{' '}
              <code style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '2px' }}>
                i_domestic = i_foreign
              </code>
              .
            </p>
            <p>
              <strong>The Inconsistency:</strong> If domestic money grows faster than foreign money, long-run equilibrium requires
              domestic currency to depreciate. But if market expects devaluation, the domestic rate must be raised to defend the
              peg. Once speculators believe devaluation is inevitable, they attack reserves, forcing the devaluation that was only
              expected before. This is a <strong>self-fulfilling prophecy</strong>.
            </p>
            <p>
              <strong>Reserve Loss Mechanism:</strong> Each unit of capital outflow depletes reserves (assuming central bank must
              "buy" domestic currency by selling reserves). The rate of reserve loss is proportional to:
              <br />
              - Rate differential (i_foreign + expected_depreciation - i_domestic)
              <br />
              - Speculator aggressiveness (how quickly they attack once they see vulnerability)
              <br />- Openness (inverse of capital controls)
            </p>
            <p>
              <strong>Crisis Threshold:</strong> Once reserves fall below some critical level (typically 20-30% of monetary base),
              the central bank can no longer defend. Market knows this, so the attack becomes self-fulfilling. Expected depreciation
              jumps, speculators rush to exchange, and the peg collapses in a matter of hours or days.
            </p>
            <p>
              <strong>Post-Crisis Dynamics:</strong> After the peg breaks, the currency depreciates until the interest rate differential
              matches expected depreciation. Inflation expectations rise due to pass-through from depreciation. Recovery requires either:
              (a) credibly tightening money growth to match expected inflation, or (b) waiting for expectations to adjust downward.
              This is why many crisis countries experience prolonged high inflation.
            </p>
          </div>
        </details>
      </div>

      {/* Policy Implications */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Policy Insights</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <InfoBox type="warning">
            <strong>⚠️ The Fundamental Inconsistency Trilemma:</strong>
            A country cannot simultaneously have: (1) fixed exchange rate, (2) free capital flows, (3) independent monetary policy.
            Choose two. Hong Kong (1 + 2 = no independence). US (2 + 3 = floating rate). China (1 + 3 = capital controls).
            Every sustainable regime requires sacrificing one objective.
          </InfoBox>

          <InfoBox type="info">
            <strong>💡 Reserve Adequacy Matters:</strong>
            Countries defending a peg need sufficient foreign reserves to withstand a sustained attack. The IMF uses rules of thumb:
            3-6 months of imports, 100%+ of short-term debt. Low reserves invite attack. This explains why emerging markets
            build large reserve buffers (self-insurance against crisis).
          </InfoBox>

          <InfoBox type="success">
            <strong>✅ Credibility is Key:</strong>
            Central bank credibility determines attack intensity. If markets believe commitment is unwavering, speculators don't attack—
            or attacks fail because markets expect successful defense. But credibility takes years to build and seconds to lose.
            One breach (like the UK breaking the ERM promise in 1992) destroys it for years.
          </InfoBox>

          <InfoBox type="warning">
            <strong>⚠️ Capital Controls as Temporary Tool:</strong>
            Controls slow outflows but don't stop determined speculators. They also distort the economy (capital misallocation).
            Long-term solution requires fixing the fundamental problem: either align domestic policy with exchange rate regime,
            or switch to floating rate. Temporary controls buy time for adjustment, not permanent solution.
          </InfoBox>

          <InfoBox type="info">
            <strong>📊 Floating Currencies Provide Flexibility:</strong>
            Floating regimes allow interest rate and exchange rate to adjust simultaneously, maintaining arbitrage equilibrium
            (UIP). No speculative attack is possible because markets price in expected depreciation. Tradeoff: exchange rate volatility
            complicates business planning. Most modern economies use managed floats (intervening to smooth but not target rate).
          </InfoBox>

          <InfoBox type="success">
            <strong>🌍 International Support Matters:</strong>
            IMF rescue packages provide foreign exchange to defend pegs (supplementing inadequate reserves). BUT IMF typically conditions
            support on policy adjustment (austerity, monetary tightening, structural reform). This is often politically difficult,
            explaining why countries sometimes reject IMF support and lose peg anyway (e.g., Russia 1998, Argentina 2001).
          </InfoBox>
        </div>
      </div>

      {/* Summary Box */}
      <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#92400e' }}>Key Takeaway</h3>
        <p style={{ fontSize: '0.9rem', color: '#78350f', margin: 0, lineHeight: '1.5' }}>
          <strong>Fixed exchange rate pegs are vulnerable to self-fulfilling speculative attacks</strong> when:
          (1) underlying fundamentals are unsustainable (rapid money growth exceeds foreign rate),
          (2) the central bank has insufficient reserves to defend,
          (3) speculators coordinate their attack once they perceive weakness.
          <br />
          <br />
          Defending the peg requires raising interest rates to compensate for expected depreciation, but high rates
          contract the economy—often making the speculative attack self-fulfilling.
          <br />
          <br />
          The only sustainable fixed peg regimes are those backed by either: (a) consistent fundamental policies (low money growth),
          (b) massive foreign exchange reserves (Hong Kong, Singapore), or (c) extreme credibility + capital controls (China).
          Most developing countries eventually move to floating rates, which better accommodate shocks and reduce crisis vulnerability.
        </p>
      </div>
    </div>
  )
}
