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
  ToolCallout,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

/** Each concept keeps one colour across all six charts. */
const DOMESTIC_STROKE = chartColor(0)
const OUTFLOW_STROKE = chartColor(1)
const FOREIGN_STROKE = chartColor(2)
const CRISIS_STROKE = chartColor(4)

/**
 * Chart series colours. Each series keeps one stable identity across all six
 * charts in this tool: the domestic real quantities, the exogenous foreign rate,
 * ordinary capital outflow, and the speculative attack.
 */

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
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-lg font-bold text-fg">Crisis Parameters</h2>
        <div className="control-panel">
          <SliderControl
            label="Domestic Money Growth Rate"
            value={activeMoney}
            min={0.01}
            max={0.15}
            step={0.01}
            onChange={setMoneyGrowthRate}
            unit="%"
          />
          <SliderControl
            label="Domestic Policy Rate"
            value={activePolicy}
            min={0.01}
            max={0.25}
            step={0.01}
            onChange={setPolicyRate}
            unit="%"
          />
          <SliderControl
            label="Capital Controls Strength"
            value={activeControls}
            min={0}
            max={1}
            step={0.1}
            onChange={setCapitalControls}
            unit=""
          />
          <SliderControl
            label="Initial Reserves (% of money supply)"
            value={initialReserves}
            min={20}
            max={150}
            step={10}
            onChange={setInitialReserves}
            unit="%"
          />
          <SliderControl
            label="Speculator Aggressiveness"
            value={specAggressiveness}
            min={0}
            max={1}
            step={0.1}
            onChange={setSpecAggressiveness}
            unit=""
          />
        </div>
      </div>

      {/* Scenario Buttons */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-lg font-bold text-fg">Scenario Analysis</h2>
        <div className="mb-4 flex flex-wrap gap-2">
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
      <div className="mb-8 rounded-card bg-surface-2 p-4">
        <h3 className="mb-3 text-label-sm font-semibold text-fg">Timeline</h3>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => setIsPlaying(!isPlaying)} variant="primary">
            {isPlaying ? 'Pause' : 'Play'}
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
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Watch how reserves deplete over 60 periods. The peg breaks when reserves exhausted.
        </p>
      </div>

      {/* Critical Metrics */}
      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatBox
          label="Foreign Policy Rate"
          value={foreignRate.toFixed(1)}
          unit="%"
        />
        <StatBox
          label="Initial Reserves"
          value={initialReserves.toFixed(0)}
          unit="% of M"
          tone={initialReserves < 50 ? 'negative' : 'neutral'}
        />
        <StatBox
          label="Peg Breaks at Period"
          value={pegBreakIndex >= 0 ? pegBreakIndex : '—'}
          tone={pegBreakIndex >= 0 && pegBreakIndex < 30 ? 'negative' : 'neutral'}
        />
        <StatBox
          label="Peak Defense Rate"
          value={peakRate.toFixed(2)}
          unit="%"
          tone={peakRate > 15 ? 'caution' : 'neutral'}
        />
        <StatBox
          label="Max Capital Outflow"
          value={maxOutflow.toFixed(2)}
          unit="per period"
          tone="accent"
        />
        <StatBox
          label="Final Exchange Rate"
          value={finalData.exchangeRate.toFixed(3)}
          tone={finalData.exchangeRate > 1.1 ? 'negative' : 'neutral'}
        />
      </div>

      {/* Educational Boxes */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <InfoBox type="info" title="The fundamental inconsistency">
          With fixed exchange rates, the domestic interest rate must equal the foreign rate (UIP with no expected depreciation).
          But if domestic money is growing faster than foreign money, this is unsustainable—people expect depreciation eventually.
          To defend the peg and prevent immediate depreciation, the central bank must raise rates above the foreign rate,
          contradicting the fundamental inconsistency.
        </InfoBox>

        <InfoBox type="warning" title="The reserve loss">
          When speculators attack (exchange domestic currency for reserves), the central bank loses reserves to defend the peg.
          With limited reserves, defense becomes impossible. Once reserves are exhausted, the peg must collapse.
          Watch how capital outflows accelerate when expectations of devaluation strengthen!
        </InfoBox>

        <InfoBox type="info" title="The interest rate paradox">
          The higher the interest rate raised to defend the peg, the more the domestic recession deepens (Y ↓).
          This economic deterioration actually INCREASES the likelihood of devaluation—making the speculative attack self-fulfilling!
          Defenders face an impossible choice: contract the economy or lose the peg.
        </InfoBox>

        <InfoBox type="success" title="Capital controls as escape valve">
          Capital controls can slow the rate of reserve loss by restricting speculators' ability to exchange currency.
          However, they're not a permanent solution—determined speculators find ways around them.
          Countries must eventually choose: float the currency or maintain credibility through consistent policy.
        </InfoBox>
      </div>

      {/* Reserve Depletion Chart */}
      <div className="visualization-container mb-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Central Bank Reserves: The Countdown to Crisis
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-fg-muted">
          Reserves deplete as speculators exchange domestic currency for hard currency reserves.
          {pegBreakIndex >= 0 && (
            <span>
              {' '}
              <strong className="text-tier-case-ink">
                Peg breaks at period {pegBreakIndex}
              </strong>
              when reserves fall below the critical threshold.
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Reserves (% of money supply)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[0, 'auto']}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            <ReferenceLine
              y={20}
              stroke={CRISIS_STROKE}
              strokeDasharray="5 5"
              label={{ value: 'Critical Level (20%)', fill: CRISIS_STROKE }}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: CRISIS_STROKE, fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="reserves"
              stroke={DOMESTIC_STROKE}
              fill={DOMESTIC_STROKE}
              fillOpacity={0.2}
              name="Reserves (hard currency)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-fg-subtle tabular-nums">
          Initial reserves: {initialReserves.toFixed(0)}% of money supply | Final reserves: {finalData.reserves.toFixed(2)}%
        </p>
      </div>

      {/* Interest Rate Defense */}
      <div className="visualization-container mb-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Interest Rate Defense: The Cost of Defending the Peg
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-fg-muted">
          As speculators attack and reserves deplete, the central bank must raise interest rates to defend the peg.
          Notice how the domestic rate diverges from the foreign rate when the peg is under threat.
          {pegBreakIndex >= 0 && (
            <span>
              {' '}
              After period {pegBreakIndex}, the peg breaks and the domestic rate can fall back toward sustainable levels.
            </span>
          )}
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{ value: 'Interest Rate (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              domain={[0, 30]}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend {...chartTheme.legend} />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: CRISIS_STROKE, fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Line
              type="monotone"
              dataKey="domesticRate"
              stroke={DOMESTIC_STROKE}
              strokeWidth={2}
              name="Domestic Rate (defense effort)"
            />
            <Line
              type="monotone"
              dataKey="foreignRate"
              stroke={FOREIGN_STROKE}
              strokeWidth={2}
              name="Foreign Rate (exogenous)"
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-fg-subtle tabular-nums">
          Peak domestic rate: {peakRate.toFixed(2)}% | Foreign rate: {(foreignRate * 100).toFixed(2)}%
        </p>
      </div>

      {/* Capital Outflows and Speculative Attack */}
      <div className="visualization-container mb-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Capital Outflows and Speculative Attack
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-fg-muted">
          Capital outflows accelerate when speculators sense the peg is doomed. The &quot;speculative
          attack&quot; shows when organized speculators actively rush to exchange the domestic currency,
          hoping to trigger the devaluation they've been anticipating. This self-fulfilling prophecy is
          the hallmark of currency crises.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{ value: 'Outflow per Period', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(2)}
            />
            <Legend {...chartTheme.legend} />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: CRISIS_STROKE, fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Bar
              dataKey="capitalOutflow"
              stackId="a"
              fill={OUTFLOW_STROKE}
              name="Normal Outflow (rate differential)"
            />
            <Bar
              dataKey="speculatorAttack"
              stackId="a"
              fill={CRISIS_STROKE}
              name="Speculative Attack"
            />
          </ComposedChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-fg-subtle tabular-nums">
          Max outflow per period: {maxOutflow.toFixed(2)} | Speculator aggressiveness: {(specAggressiveness * 100).toFixed(0)}%
        </p>
      </div>

      {/* GDP Contraction from Defense */}
      <div className="visualization-container mb-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Real Output Contraction: The Recession Cost
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-fg-muted">
          Defending the peg requires raising interest rates, which contracts investment and consumption.
          GDP falls as rates rise. Notice the deepest recession occurs right when the peg breaks—the point
          where the fundamental inconsistency becomes unsustainable. After the break, rates can fall and recovery begins
          (though with high inflation expectations).
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Real Output Index (base = 100)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[0, 120]}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(1)}
            />
            <ReferenceLine
              y={100}
              stroke={chartTheme.axis.stroke}
              strokeDasharray="5 5"
              label={{ value: 'Baseline (no crisis)', fill: chartTheme.reference.fill }}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: CRISIS_STROKE, fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="gdp"
              stroke={DOMESTIC_STROKE}
              fill={DOMESTIC_STROKE}
              fillOpacity={0.2}
              name="Real GDP Index"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-fg-subtle tabular-nums">
          Minimum GDP: {Math.min(...attackData.map((d) => d.gdp)).toFixed(1)} | Final GDP: {finalData.gdp.toFixed(1)}
        </p>
      </div>

      {/* Exchange Rate Path */}
      <div className="visualization-container mb-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Exchange Rate: From Peg to Floating Depreciation
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-fg-muted">
          The exchange rate (in units of foreign currency per unit of domestic currency) is held constant at 1.0 while
          the peg is defended. Once the peg breaks and the currency floats, rapid depreciation occurs—the domestic
          currency weakens as speculators who bet on devaluation are proven right.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{
                value: 'Exchange Rate (units foreign/$)',
                angle: -90,
                position: 'insideLeft',
                fill: chartTheme.axis.tick.fill,
              }}
              domain={[0.95, 'auto']}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(3)}
            />
            <ReferenceLine
              y={1.0}
              stroke={OUTFLOW_STROKE}
              strokeDasharray="5 5"
              label={{ value: 'Peg level (1.0)', fill: OUTFLOW_STROKE }}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: CRISIS_STROKE, fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Line
              type="monotone"
              dataKey="exchangeRate"
              stroke={DOMESTIC_STROKE}
              strokeWidth={2}
              name="Exchange Rate"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-fg-subtle tabular-nums">
          Exchange rate at period 0: 1.0 | Final exchange rate: {finalData.exchangeRate.toFixed(3)} ({((finalData.exchangeRate - 1) * 100).toFixed(1)}% depreciation)
        </p>
      </div>

      {/* Inflation Expectations */}
      <div className="visualization-container mb-8">
        <h3 className="mb-4 font-serif text-lg font-bold text-fg">
          Inflation Expectations: The Loss of Price Stability
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-fg-muted">
          With the peg in place, inflation expectations remain anchored (based on money growth rate).
          Once the peg breaks and the exchange rate depreciates, inflation expectations rise sharply due to:
          (1) import price increases from depreciation, (2) loss of credibility, (3) continued rapid money growth.
          This is why currency crises often lead to high inflation regimes.
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={attackData} margin={chartTheme.margin}>
            <CartesianGrid {...chartTheme.grid} />
            <XAxis
              dataKey="period"
              label={{ value: 'Time Period', position: 'insideBottomRight', offset: -5, fill: chartTheme.axis.tick.fill }}
              {...chartTheme.axis}
            />
            <YAxis
              label={{ value: 'Expected Inflation (%)', angle: -90, position: 'insideLeft', fill: chartTheme.axis.tick.fill }}
              domain={[0, 'auto']}
              {...chartTheme.axis}
            />
            <Tooltip
              {...chartTheme.tooltip}
              cursor={chartTheme.cursor}
              formatter={(value: number) => value.toFixed(1)}
            />
            {pegBreakIndex >= 0 && (
              <ReferenceLine
                x={pegBreakIndex}
                stroke={CRISIS_STROKE}
                strokeDasharray="5 5"
                label={{ value: 'PEG BREAKS', position: 'top', fill: CRISIS_STROKE, fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="inflationExpectation"
              stroke={CRISIS_STROKE}
              fill={CRISIS_STROKE}
              fillOpacity={0.2}
              name="Expected Inflation"
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="mt-2 text-xs text-fg-subtle tabular-nums">
          Initial expected inflation: {(activeMoney * 50).toFixed(1)}% | Final expected inflation: {finalData.inflationExpectation.toFixed(1)}%
        </p>
      </div>

      {/* Historical Context */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-lg font-bold text-fg">Historical Examples</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <ToolCallout label="1992" variant="warning" title="ERM Crisis (UK)">
            <p>
              British pound pegged in European Exchange Rate Mechanism. German reunification raised German interest rates.
              UK raised rates to 15% to defend. Speculators (Soros) attacked reserves. Peg broke in hours. GDP contraction
              but long-run recovery after float allowed lower rates. Lesson: Policy inconsistency makes peg indefensible.
            </p>
          </ToolCallout>

          <ToolCallout label="1994-95" variant="warning" title="Mexico Crisis">
            <p>
              Peso pegged to USD. Rapid money growth + current account deficit. Peso devaluation expected.
              Mexico tried to defend with high rates but ran out of reserves. Lost peg. Depreciation + domestic recession.
              High inflation followed. Only recovered with IMF bailout + structural reforms + eventual currency stabilization.
            </p>
          </ToolCallout>

          <ToolCallout label="1997-98" variant="warning" title="Asian Financial Crisis">
            <p>
              Thai baht pegged to USD despite current account deficits and rising interest rates. Speculators attacked.
              Thailand lost reserves and eventually float forced. Contagion spread across Asia. Currencies depreciated 40-80%.
              Severe recessions followed. Shows how pegs can be vulnerable to self-fulfilling speculative attacks
              even with strong fundamentals.
            </p>
          </ToolCallout>

          <ToolCallout label="1998" variant="insight" title="Hong Kong: Successful Defense">
            <p>
              Hong Kong dollar pegged to USD via currency board. During Asian crisis, speculators attacked.
              Hong Kong raised interest rates to 300%+ to defend. Government bought stock index to signal commitment.
              Speculators eventually gave up. Peg held. Hong Kong avoided devaluation but suffered severe recession.
              Shows extreme credibility can defend peg even with massive attack.
            </p>
          </ToolCallout>

          <ToolCallout label="Post-1999" variant="insight" title="Eurozone: Unified Currency">
            <p>
              Countries gave up independent currency for Euro. No devaluation possible—no peg to break!
              However, creates rigidity: deficit countries cannot devalue to regain competitiveness. 2010-2015 Eurozone crisis
              showed danger: Greece, Portugal, Ireland faced very high unemployment because couldn't devalue.
              Fiscal transfers within Eurozone partially compensate. Lesson: Currency union prevents speculative attacks but limits flexibility.
            </p>
          </ToolCallout>

          <ToolCallout label="2022" variant="warning" title="Russia: War & Peg Defense">
            <p>
              After invasion, ruble faced massive depreciation expectations. Russia raised rates from 4% to 20%+, implemented
              capital controls, and intervened heavily in forex market. Peg successfully defended—ruble stabilized at higher
              level. However, high rates and controls stifle growth. Shows capital controls + extreme rates can work but
              at huge economic cost. Fundamental adjustment (fiscal discipline) ultimately required.
            </p>
          </ToolCallout>
        </div>
      </div>

      {/* Technical Explanation */}
      <div className="mb-8">
        <details className="group cursor-pointer">
          <summary className="select-none text-label-sm font-semibold text-fg-muted transition-colors hover:text-fg">
            Technical Details: The Math Behind the Crisis
          </summary>
          <div className="prose-lecture mt-4 text-sm">
            <p>
              <strong>Uncovered Interest Parity (UIP):</strong> With a fixed peg, the domestic interest rate must satisfy:{' '}
              <code>i_domestic = i_foreign + (expected depreciation)</code>. If peg is credible, expected depreciation = 0, so{' '}
              <code>i_domestic = i_foreign</code>.
            </p>
            <p>
              <strong>The Inconsistency:</strong> If domestic money grows faster than foreign money, long-run equilibrium requires
              domestic currency to depreciate. But if market expects devaluation, the domestic rate must be raised to defend the
              peg. Once speculators believe devaluation is inevitable, they attack reserves, forcing the devaluation that was only
              expected before. This is a <strong>self-fulfilling prophecy</strong>.
            </p>
            <p>
              <strong>Reserve Loss Mechanism:</strong> Each unit of capital outflow depletes reserves (assuming central bank must
              &quot;buy&quot; domestic currency by selling reserves). The rate of reserve loss is proportional to:
            </p>
            <ul>
              <li>Rate differential (i_foreign + expected_depreciation - i_domestic)</li>
              <li>Speculator aggressiveness (how quickly they attack once they see vulnerability)</li>
              <li>Openness (inverse of capital controls)</li>
            </ul>
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
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-lg font-bold text-fg">Policy Insights</h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <InfoBox type="warning" title="The fundamental inconsistency trilemma">
            <p>
              A country cannot simultaneously have: (1) fixed exchange rate, (2) free capital flows, (3) independent monetary policy.
              Choose two. Hong Kong (1 + 2 = no independence). US (2 + 3 = floating rate). China (1 + 3 = capital controls).
              Every sustainable regime requires sacrificing one objective.
            </p>
          </InfoBox>

          <InfoBox type="info" title="Reserve adequacy matters">
            <p>
              Countries defending a peg need sufficient foreign reserves to withstand a sustained attack. The IMF uses rules of thumb:
              3-6 months of imports, 100%+ of short-term debt. Low reserves invite attack. This explains why emerging markets
              build large reserve buffers (self-insurance against crisis).
            </p>
          </InfoBox>

          <InfoBox type="success" title="Credibility is key">
            <p>
              Central bank credibility determines attack intensity. If markets believe commitment is unwavering, speculators don't attack—
              or attacks fail because markets expect successful defense. But credibility takes years to build and seconds to lose.
              One breach (like the UK breaking the ERM promise in 1992) destroys it for years.
            </p>
          </InfoBox>

          <InfoBox type="warning" title="Capital controls as temporary tool">
            <p>
              Controls slow outflows but don't stop determined speculators. They also distort the economy (capital misallocation).
              Long-term solution requires fixing the fundamental problem: either align domestic policy with exchange rate regime,
              or switch to floating rate. Temporary controls buy time for adjustment, not permanent solution.
            </p>
          </InfoBox>

          <InfoBox type="info" title="Floating currencies provide flexibility">
            <p>
              Floating regimes allow interest rate and exchange rate to adjust simultaneously, maintaining arbitrage equilibrium
              (UIP). No speculative attack is possible because markets price in expected depreciation. Tradeoff: exchange rate volatility
              complicates business planning. Most modern economies use managed floats (intervening to smooth but not target rate).
            </p>
          </InfoBox>

          <InfoBox type="success" title="International support matters">
            <p>
              IMF rescue packages provide foreign exchange to defend pegs (supplementing inadequate reserves). BUT IMF typically conditions
              support on policy adjustment (austerity, monetary tightening, structural reform). This is often politically difficult,
              explaining why countries sometimes reject IMF support and lose peg anyway (e.g., Russia 1998, Argentina 2001).
            </p>
          </InfoBox>
        </div>
      </div>

      {/* Summary Box */}
      <ToolCallout label="In one paragraph" variant="lesson" title="Key Takeaway">
        <p>
          <strong>Fixed exchange rate pegs are vulnerable to self-fulfilling speculative attacks</strong> when:
          (1) underlying fundamentals are unsustainable (rapid money growth exceeds foreign rate),
          (2) the central bank has insufficient reserves to defend,
          (3) speculators coordinate their attack once they perceive weakness.
        </p>
        <p>
          Defending the peg requires raising interest rates to compensate for expected depreciation, but high rates
          contract the economy—often making the speculative attack self-fulfilling.
        </p>
        <p>
          The only sustainable fixed peg regimes are those backed by either: (a) consistent fundamental policies (low money growth),
          (b) massive foreign exchange reserves (Hong Kong, Singapore), or (c) extreme credibility + capital controls (China).
          Most developing countries eventually move to floating rates, which better accommodate shocks and reduce crisis vulnerability.
        </p>
      </ToolCallout>
    </div>
  )
}
