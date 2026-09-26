import { useState } from 'react'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'
import { chartTheme, chartColor } from '../design/chartTheme'

/**
 * Chart series colours. The legacy inline palette mapped slot-for-slot across
 * all three approaches (first component blue, second green, third amber), so the
 * slots stay stable and each one is reused by every chart in this file.
 */
const SERIES_1 = chartColor(0)
const SERIES_2 = chartColor(1)
const SERIES_3 = chartColor(2)
const SERIES_4 = chartColor(3)
const SERIES_5 = chartColor(4)

/**
 * Interface for expenditure approach data
 */
interface ExpenditureData {
  name: string
  value: number
  color: string
}

/**
 * Interface for income approach data
 */
interface IncomeData {
  name: string
  value: number
  color: string
}

/**
 * Interface for production approach data
 */
interface ProductionData {
  sector: string
  valueAdded: number
  color: string
}

/**
 * Interface for historical time series comparison
 */
interface TimeSeriesData {
  approach: string
  gdp: number
}

export default function GdpMeasurement() {
  // State for Expenditure Approach (C + I + G + (X-M))
  const [consumption, setConsumption] = useState(70)
  const [investment, setInvestment] = useState(18)
  const [governmentSpending, setGovernmentSpending] = useState(17)
  const [exports, setExports] = useState(12)
  const [imports, setImports] = useState(10)

  // State for Income Approach (Wages + Profits + Rent)
  const [wages, setWages] = useState(68)
  const [profits, setProfits] = useState(20)
  const [rent, setRent] = useState(12)

  // State for Production Approach (Value Added by Sector)
  const [agriculture, setAgriculture] = useState(2)
  const [manufacturing, setManufacturing] = useState(18)
  const [services, setServices] = useState(80)

  // UI State
  const [activeTab, setActiveTab] = useState<'expenditure' | 'income' | 'production' | 'comparison'>('expenditure')
  const [scenarioMode, setScenarioMode] = useState<'balanced' | 'consumption-driven' | 'investment-led' | 'export-focused'>('balanced')
  const [showBreakdown, setShowBreakdown] = useState(true)

  // Apply scenario presets
  const applyScenario = (scenario: typeof scenarioMode) => {
    setScenarioMode(scenario)
    switch (scenario) {
      case 'consumption-driven':
        // Strong consumer demand
        setConsumption(75)
        setInvestment(15)
        setGovernmentSpending(16)
        setExports(10)
        setImports(12)
        break
      case 'investment-led':
        // Business investment focus (capital accumulation)
        setConsumption(65)
        setInvestment(25)
        setGovernmentSpending(16)
        setExports(12)
        setImports(10)
        break
      case 'export-focused':
        // Trade surplus driven growth
        setConsumption(68)
        setInvestment(16)
        setGovernmentSpending(15)
        setExports(20)
        setImports(8)
        break
      case 'balanced':
      default:
        // Balanced growth
        setConsumption(70)
        setInvestment(18)
        setGovernmentSpending(17)
        setExports(12)
        setImports(10)
        break
    }
  }

  // ============================================
  // EXPENDITURE APPROACH: GDP = C + I + G + (X - M)
  // ============================================
  const netExports = exports - imports
  const gdpExpenditure = consumption + investment + governmentSpending + netExports

  const expenditureData: ExpenditureData[] = [
    { name: 'Consumption (C)', value: consumption, color: SERIES_1 },
    { name: 'Investment (I)', value: investment, color: SERIES_2 },
    { name: 'Government (G)', value: governmentSpending, color: SERIES_3 },
    { name: 'Net Exports (X-M)', value: netExports, color: netExports >= 0 ? SERIES_4 : SERIES_5 },
  ]

  // ============================================
  // INCOME APPROACH: GDP = Wages + Profits + Rent
  // ============================================
  const gdpIncome = wages + profits + rent

  const incomeData: IncomeData[] = [
    { name: 'Wages (Labor Income)', value: wages, color: SERIES_1 },
    { name: 'Profits (Capital Income)', value: profits, color: SERIES_2 },
    { name: 'Rent (Land/Property)', value: rent, color: SERIES_3 },
  ]

  // ============================================
  // PRODUCTION APPROACH: GDP = Sum of Value Added
  // ============================================
  const gdpProduction = agriculture + manufacturing + services

  const productionData: ProductionData[] = [
    { sector: 'Agriculture', valueAdded: agriculture, color: SERIES_2 },
    { sector: 'Manufacturing', valueAdded: manufacturing, color: SERIES_1 },
    { sector: 'Services', valueAdded: services, color: SERIES_3 },
  ]

  // ============================================
  // VERIFICATION: All three approaches should equal same GDP
  // ============================================
  const averageGdp = (gdpExpenditure + gdpIncome + gdpProduction) / 3
  const discrepancyPercent = Math.max(
    Math.abs(gdpExpenditure - averageGdp) / averageGdp * 100,
    Math.abs(gdpIncome - averageGdp) / averageGdp * 100,
    Math.abs(gdpProduction - averageGdp) / averageGdp * 100
  )

  // Prepare time series data for comparison view
  const comparisonData: TimeSeriesData[] = [
    { approach: 'Expenditure', gdp: gdpExpenditure },
    { approach: 'Income', gdp: gdpIncome },
    { approach: 'Production', gdp: gdpProduction },
  ]

  // Component structure helper
  const renderComponentSizes = () => {
    const total = gdpExpenditure
    return {
      consumptionPct: ((consumption / total) * 100).toFixed(1),
      investmentPct: ((investment / total) * 100).toFixed(1),
      governmentPct: ((governmentSpending / total) * 100).toFixed(1),
      exportsPct: ((netExports / total) * 100).toFixed(1),
    }
  }

  const componentPcts = renderComponentSizes()

  // Income distribution
  const renderIncomeDistribution = () => {
    const total = gdpIncome
    return {
      wagesPct: ((wages / total) * 100).toFixed(1),
      profitsPct: ((profits / total) * 100).toFixed(1),
      rentPct: ((rent / total) * 100).toFixed(1),
    }
  }

  const incomePcts = renderIncomeDistribution()

  // Production structure
  const renderProductionStructure = () => {
    const total = gdpProduction
    return {
      agriculturePct: ((agriculture / total) * 100).toFixed(1),
      manufacturingPct: ((manufacturing / total) * 100).toFixed(1),
      servicesPct: ((services / total) * 100).toFixed(1),
    }
  }

  const productionPcts = renderProductionStructure()

  return (
    <div className="tool-card">
      <ToolHeader
        title="GDP Measurement Approaches"
        description="Explore the three equivalent methods of measuring GDP: Expenditure, Income, and Production. Understand how they all capture the same economic activity and verify that they yield identical results."
        badge="intermediate"
      />

      {/* Scenario Selection */}
      <div className="mb-8">
        <h2 className="mb-4 font-serif text-lg font-bold text-fg">Economy Scenarios</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => applyScenario('balanced')}
            variant={scenarioMode === 'balanced' ? 'primary' : 'secondary'}
          >
            Balanced Growth
          </Button>
          <Button
            onClick={() => applyScenario('consumption-driven')}
            variant={scenarioMode === 'consumption-driven' ? 'primary' : 'secondary'}
          >
            Consumption-Driven
          </Button>
          <Button
            onClick={() => applyScenario('investment-led')}
            variant={scenarioMode === 'investment-led' ? 'primary' : 'secondary'}
          >
            Investment-Led
          </Button>
          <Button
            onClick={() => applyScenario('export-focused')}
            variant={scenarioMode === 'export-focused' ? 'primary' : 'secondary'}
          >
            Export-Focused
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('expenditure')}
          className={`cursor-pointer px-6 py-3 text-[0.95rem] ${
            activeTab === 'expenditure'
              ? 'border-b-2 border-accent bg-accent font-semibold text-accent-fg'
              : 'border-b-2 border-transparent font-normal text-fg-muted'
          }`}
        >
          Expenditure Approach
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`cursor-pointer px-6 py-3 text-[0.95rem] ${
            activeTab === 'income'
              ? 'border-b-2 border-accent bg-accent font-semibold text-accent-fg'
              : 'border-b-2 border-transparent font-normal text-fg-muted'
          }`}
        >
          Income Approach
        </button>
        <button
          onClick={() => setActiveTab('production')}
          className={`cursor-pointer px-6 py-3 text-[0.95rem] ${
            activeTab === 'production'
              ? 'border-b-2 border-accent bg-accent font-semibold text-accent-fg'
              : 'border-b-2 border-transparent font-normal text-fg-muted'
          }`}
        >
          Production Approach
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`cursor-pointer px-6 py-3 text-[0.95rem] ${
            activeTab === 'comparison'
              ? 'border-b-2 border-accent bg-accent font-semibold text-accent-fg'
              : 'border-b-2 border-transparent font-normal text-fg-muted'
          }`}
        >
          Comparison
        </button>
      </div>

      {/* EXPENDITURE APPROACH TAB */}
      {activeTab === 'expenditure' && (
        <div>
          <h2 className="mb-4 font-serif text-lg font-bold text-fg">
            Expenditure Approach: GDP = C + I + G + (X - M)
          </h2>

          <div className="mb-8">
            <InfoBox type="info">
              <strong>Expenditure Approach:</strong> Measures GDP by summing all final expenditures in the economy.
              Consumption (C) is what households spend, Investment (I) is business capital spending, Government (G) is public spending,
              and Net Exports (X-M) captures international trade. This is the most commonly used approach.
            </InfoBox>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Adjust Components ($ trillions)</h3>
            <div className="control-panel">
              <SliderControl
                label="Consumption (C)"
                value={consumption}
                min={40}
                max={100}
                step={1}
                onChange={setConsumption}
                unit="T"
              />
              <SliderControl
                label="Investment (I)"
                value={investment}
                min={5}
                max={40}
                step={1}
                onChange={setInvestment}
                unit="T"
              />
              <SliderControl
                label="Government Spending (G)"
                value={governmentSpending}
                min={5}
                max={40}
                step={1}
                onChange={setGovernmentSpending}
                unit="T"
              />
              <SliderControl
                label="Exports (X)"
                value={exports}
                min={5}
                max={30}
                step={1}
                onChange={setExports}
                unit="T"
              />
              <SliderControl
                label="Imports (M)"
                value={imports}
                min={5}
                max={30}
                step={1}
                onChange={setImports}
                unit="T"
              />
            </div>
          </div>

          {/* Key Results */}
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <StatBox label="Consumption (C)" value={consumption.toFixed(1)} unit="T" />
            <StatBox label="Investment (I)" value={investment.toFixed(1)} unit="T" />
            <StatBox label="Government (G)" value={governmentSpending.toFixed(1)} unit="T" />
            <StatBox
              label="Net Exports (X-M)"
              value={netExports.toFixed(1)}
              unit="T"
              tone={netExports > 0 ? 'accent' : undefined}
            />
            <StatBox label="Total GDP" value={gdpExpenditure.toFixed(1)} unit="T" tone="accent" />
          </div>

          {/* Bar Chart */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Composition of GDP</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={expenditureData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="name" {...chartTheme.axis} />
                <YAxis
                  label={{
                    value: 'Amount ($ Trillions)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: chartTheme.axis.tick.fill,
                  }}
                  {...chartTheme.axis}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => `${value.toFixed(1)}T`}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {expenditureData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Percentages */}
          {showBreakdown && (
            <div className="mb-8">
              <h3 className="mb-4 font-serif text-base font-bold text-fg">Component Breakdown (%)</h3>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <div className="stat-tile stat-tile--accent">
                  <div className="stat-tile-label">Consumption</div>
                  <div className="stat-tile-value">{componentPcts.consumptionPct}%</div>
                </div>
                <div className="stat-tile stat-tile--positive">
                  <div className="stat-tile-label">Investment</div>
                  <div className="stat-tile-value">{componentPcts.investmentPct}%</div>
                </div>
                <div className="stat-tile stat-tile--caution">
                  <div className="stat-tile-label">Government</div>
                  <div className="stat-tile-value">{componentPcts.governmentPct}%</div>
                </div>
                <div
                  className={`stat-tile ${
                    netExports >= 0 ? 'stat-tile--accent' : 'stat-tile--negative'
                  }`}
                >
                  <div className="stat-tile-label">Net Exports</div>
                  <div className="stat-tile-value">{componentPcts.exportsPct}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Insights */}
          <div className="mb-4">
            <InfoBox type="success">
              <strong>Economic Insight:</strong> In the US economy, consumption typically accounts for 65-70% of GDP.
              This makes sense: in a market economy, household spending is the largest component. Notice that
              net exports {netExports > 0 ? 'is positive (trade surplus)' : 'is negative (trade deficit)'}, reflecting{' '}
              {netExports > 0 ? 'more exports than imports' : 'more imports than exports'}.
            </InfoBox>
          </div>
        </div>
      )}

      {/* INCOME APPROACH TAB */}
      {activeTab === 'income' && (
        <div>
          <h2 className="mb-4 font-serif text-lg font-bold text-fg">
            Income Approach: GDP = Wages + Profits + Rent
          </h2>

          <div className="mb-8">
            <InfoBox type="info">
              <strong>Income Approach:</strong> Measures GDP by summing all incomes earned in producing output.
              Every dollar of production must be paid out as income to someone—either workers (wages),
              business owners (profits), or property owners (rent). In a closed economy, total income produced = total output.
              This is the fundamental macro accounting identity.
            </InfoBox>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Adjust Income Components ($ trillions)</h3>
            <div className="control-panel">
              <SliderControl
                label="Wages (Labor Income)"
                value={wages}
                min={40}
                max={100}
                step={1}
                onChange={setWages}
                unit="T"
              />
              <SliderControl
                label="Profits (Capital Income)"
                value={profits}
                min={5}
                max={50}
                step={1}
                onChange={setProfits}
                unit="T"
              />
              <SliderControl
                label="Rent (Land/Property Income)"
                value={rent}
                min={5}
                max={40}
                step={1}
                onChange={setRent}
                unit="T"
              />
            </div>
          </div>

          {/* Key Results */}
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatBox label="Wages (Labor)" value={wages.toFixed(1)} unit="T" />
            <StatBox label="Profits (Capital)" value={profits.toFixed(1)} unit="T" />
            <StatBox label="Rent (Land)" value={rent.toFixed(1)} unit="T" />
            <StatBox label="Total GDP" value={gdpIncome.toFixed(1)} unit="T" tone="accent" />
          </div>

          {/* Pie Chart */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Income Distribution Breakdown</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart margin={chartTheme.margin}>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(1)}T`}
                  outerRadius={100}
                  fill={SERIES_1}
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => `${value.toFixed(1)}T`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Income Distribution */}
          {showBreakdown && (
            <div className="mb-8">
              <h3 className="mb-4 font-serif text-base font-bold text-fg">Income Share (% of GDP)</h3>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <div className="stat-tile stat-tile--accent">
                  <div className="stat-tile-label">Labor's Share</div>
                  <div className="stat-tile-value">{incomePcts.wagesPct}%</div>
                </div>
                <div className="stat-tile stat-tile--positive">
                  <div className="stat-tile-label">Capital's Share</div>
                  <div className="stat-tile-value">{incomePcts.profitsPct}%</div>
                </div>
                <div className="stat-tile stat-tile--caution">
                  <div className="stat-tile-label">Land's Share</div>
                  <div className="stat-tile-value">{incomePcts.rentPct}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Insights */}
          <div className="mb-4">
            <InfoBox type="success">
              <strong>Economic Insight:</strong> Labor income typically accounts for 65-70% of GDP in developed economies
              (slightly higher than 50% due to inclusion of fringe benefits). This reflects that labor is the primary factor of production.
              The income approach reveals the distribution of wealth creation: notice what fraction goes to workers vs. capital owners.
              This is central to debates about inequality.
            </InfoBox>
          </div>
        </div>
      )}

      {/* PRODUCTION APPROACH TAB */}
      {activeTab === 'production' && (
        <div>
          <h2 className="mb-4 font-serif text-lg font-bold text-fg">
            Production Approach: GDP = Sum of Value Added by Sector
          </h2>

          <div className="mb-8">
            <InfoBox type="info">
              <strong>Production Approach:</strong> Measures GDP by summing the value added at each stage of production.
              Each firm's value added = its revenue minus what it paid for intermediate inputs from other firms.
              This avoids double-counting: we don't count both the steel and the car, only the car's value added (the difference).
              By sector, this shows the structure of the economy.
            </InfoBox>
          </div>

          {/* Controls */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Adjust Sector Value Added ($ trillions)</h3>
            <div className="control-panel">
              <SliderControl
                label="Agriculture & Mining"
                value={agriculture}
                min={0}
                max={10}
                step={0.5}
                onChange={setAgriculture}
                unit="T"
              />
              <SliderControl
                label="Manufacturing"
                value={manufacturing}
                min={5}
                max={40}
                step={1}
                onChange={setManufacturing}
                unit="T"
              />
              <SliderControl
                label="Services (Finance, Healthcare, Tech, Retail, etc.)"
                value={services}
                min={30}
                max={120}
                step={1}
                onChange={setServices}
                unit="T"
              />
            </div>
          </div>

          {/* Key Results */}
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatBox label="Agriculture & Mining" value={agriculture.toFixed(1)} unit="T" />
            <StatBox label="Manufacturing" value={manufacturing.toFixed(1)} unit="T" />
            <StatBox label="Services" value={services.toFixed(1)} unit="T" />
            <StatBox label="Total GDP" value={gdpProduction.toFixed(1)} unit="T" tone="accent" />
          </div>

          {/* Bar Chart */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Value Added by Sector</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={productionData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="sector" {...chartTheme.axis} />
                <YAxis
                  label={{
                    value: 'Value Added ($ Trillions)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: chartTheme.axis.tick.fill,
                  }}
                  {...chartTheme.axis}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => `${value.toFixed(1)}T`}
                />
                <Bar dataKey="valueAdded" radius={[8, 8, 0, 0]}>
                  {productionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Structure */}
          {showBreakdown && (
            <div className="mb-8">
              <h3 className="mb-4 font-serif text-base font-bold text-fg">Economic Structure (% of GDP)</h3>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <div className="stat-tile stat-tile--positive">
                  <div className="stat-tile-label">Agriculture</div>
                  <div className="stat-tile-value">{productionPcts.agriculturePct}%</div>
                </div>
                <div className="stat-tile stat-tile--accent">
                  <div className="stat-tile-label">Manufacturing</div>
                  <div className="stat-tile-value">{productionPcts.manufacturingPct}%</div>
                </div>
                <div className="stat-tile stat-tile--caution">
                  <div className="stat-tile-label">Services</div>
                  <div className="stat-tile-value">{productionPcts.servicesPct}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Insights */}
          <div className="mb-4">
            <InfoBox type="success">
              <strong>Economic Insight:</strong> Modern developed economies are dominated by services
              ({productionPcts.servicesPct}% in this example), reflecting deindustrialization and the rise of finance, healthcare,
              and technology. This contrasts with developing economies where agriculture and manufacturing are larger shares.
              The shift toward services is a hallmark of economic development.
            </InfoBox>
          </div>
        </div>
      )}

      {/* COMPARISON TAB */}
      {activeTab === 'comparison' && (
        <div>
          <h2 className="mb-4 font-serif text-lg font-bold text-fg">
            Cross-Method Verification
          </h2>

          <div className="mb-8">
            <InfoBox type="info">
              <strong>Why All Three Methods?</strong> In a well-measured economy, all three approaches should yield
              the same GDP. Discrepancies indicate measurement errors. The existence of three independent methods
              is powerful: it's a built-in check on data quality. If the income approach and expenditure approach diverge,
              statisticians investigate to find the error.
              <br />
              <br />
              <strong>Understanding Discrepancies:</strong> Small discrepancies (typically &lt; 2%) are normal in practice due to:
              <br />
              <br />
              • Statistical differences in methodology
              <br />
              • Timing issues in data collection
              <br />
              • Double counting in some approaches
              <br />
              • Missing transactions in official statistics
              <br />
              <br />
              Large discrepancies (&gt; 5%) suggest measurement problems that require investigation.
            </InfoBox>
          </div>

          {/* Key Results - All Approaches */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">GDP by Approach</h3>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
              <div className="stat-tile stat-tile--accent">
                <div className="stat-tile-label">Expenditure Approach</div>
                <div className="stat-tile-value">${gdpExpenditure.toFixed(1)}T</div>
              </div>
              <div className="stat-tile stat-tile--positive">
                <div className="stat-tile-label">Income Approach</div>
                <div className="stat-tile-value">${gdpIncome.toFixed(1)}T</div>
              </div>
              <div className="stat-tile stat-tile--caution">
                <div className="stat-tile-label">Production Approach</div>
                <div className="stat-tile-value">${gdpProduction.toFixed(1)}T</div>
              </div>
            </div>
          </div>

          {/* Discrepancy Analysis */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Measurement Consistency</h3>
            <div
              className={`stat-tile ${
                discrepancyPercent < 2
                  ? 'stat-tile--positive'
                  : discrepancyPercent < 5
                    ? 'stat-tile--caution'
                    : 'stat-tile--negative'
              }`}
            >
              <div className="stat-tile-label">Max Discrepancy Across Approaches</div>
              <div className="stat-tile-value">{discrepancyPercent.toFixed(2)}%</div>
              {discrepancyPercent < 2 && (
                <div className="stat-tile-change">
                  Excellent consistency (typical for real-world GDP data)
                </div>
              )}
              {discrepancyPercent >= 2 && discrepancyPercent < 5 && (
                <div className="stat-tile-change">
                  Good consistency but some discrepancy—adjust components to align approaches
                </div>
              )}
              {discrepancyPercent >= 5 && (
                <div className="stat-tile-change">
                  Significant discrepancy—align the three approaches for proper GDP measurement
                </div>
              )}
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">GDP Comparison Across Methods</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData} margin={chartTheme.margin}>
                <CartesianGrid {...chartTheme.grid} />
                <XAxis dataKey="approach" {...chartTheme.axis} />
                <YAxis
                  label={{
                    value: 'GDP ($ Trillions)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: chartTheme.axis.tick.fill,
                  }}
                  {...chartTheme.axis}
                />
                <Tooltip
                  {...chartTheme.tooltip}
                  cursor={chartTheme.cursor}
                  formatter={(value: number) => `${value.toFixed(1)}T`}
                />
                <Bar dataKey="gdp" fill={SERIES_1} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="mb-8">
            <h3 className="mb-4 font-serif text-base font-bold text-fg">Detailed Breakdown Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full overflow-hidden rounded-card border-collapse bg-surface text-sm">
                <thead>
                  <tr className="bg-surface-2 font-semibold">
                    <th className="border-b border-border px-3 py-3 text-left">Method</th>
                    <th className="border-b border-border px-3 py-3 text-center">Component 1</th>
                    <th className="border-b border-border px-3 py-3 text-center">Component 2</th>
                    <th className="border-b border-border px-3 py-3 text-center">Component 3</th>
                    <th className="border-b border-border px-3 py-3 text-right">Total GDP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-tier-intermediate/5">
                    <td className="border-b border-border px-3 py-3 text-left font-semibold">
                      Expenditure
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      C: ${consumption.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      I: ${investment.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      G: ${governmentSpending.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-right font-semibold tabular-nums text-tier-intermediate-ink">
                      ${gdpExpenditure.toFixed(1)}T
                    </td>
                  </tr>
                  <tr className="bg-tier-beginner/5">
                    <td className="border-b border-border px-3 py-3 text-left font-semibold">
                      Income
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      Wages: ${wages.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      Profits: ${profits.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      Rent: ${rent.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-right font-semibold tabular-nums text-tier-beginner-ink">
                      ${gdpIncome.toFixed(1)}T
                    </td>
                  </tr>
                  <tr className="bg-accent/5">
                    <td className="border-b border-border px-3 py-3 text-left font-semibold">
                      Production
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      Ag: ${agriculture.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      Mfg: ${manufacturing.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-center tabular-nums">
                      Svc: ${services.toFixed(1)}T
                    </td>
                    <td className="border-b border-border px-3 py-3 text-right font-semibold tabular-nums text-accent-ink">
                      ${gdpProduction.toFixed(1)}T
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Learning */}
          <div className="mb-4">
            <InfoBox type="success">
              <strong>Fundamental Macro Identity:</strong> In a closed economy with perfect measurement:
              <br />
              <br />
              **Production = Income = Expenditure**
              <br />
              <br />
              This is NOT true for individual households or firms (a firm can have revenues differ from costs or spending).
              But for the entire economy, it MUST be true. What is produced must be earned as income and spent. This production-income-expenditure
              equivalence is the cornerstone of macroeconomic analysis and distinguishes macro from micro.
            </InfoBox>
          </div>
        </div>
      )}

      {/* Toggle Breakdown */}
      <div className="mt-8 border-t border-border pt-4">
        <Button onClick={() => setShowBreakdown(!showBreakdown)} variant="secondary">
          {showBreakdown ? 'Hide' : 'Show'} Percentage Breakdown
        </Button>
      </div>
    </div>
  )
}
