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
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

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
    { name: 'Consumption (C)', value: consumption, color: '#3b82f6' },
    { name: 'Investment (I)', value: investment, color: '#10b981' },
    { name: 'Government (G)', value: governmentSpending, color: '#f59e0b' },
    { name: 'Net Exports (X-M)', value: netExports, color: netExports >= 0 ? '#8b5cf6' : '#ef4444' },
  ]

  // ============================================
  // INCOME APPROACH: GDP = Wages + Profits + Rent
  // ============================================
  const gdpIncome = wages + profits + rent

  const incomeData: IncomeData[] = [
    { name: 'Wages (Labor Income)', value: wages, color: '#3b82f6' },
    { name: 'Profits (Capital Income)', value: profits, color: '#10b981' },
    { name: 'Rent (Land/Property)', value: rent, color: '#f59e0b' },
  ]

  // ============================================
  // PRODUCTION APPROACH: GDP = Sum of Value Added
  // ============================================
  const gdpProduction = agriculture + manufacturing + services

  const productionData: ProductionData[] = [
    { sector: 'Agriculture', valueAdded: agriculture, color: '#10b981' },
    { sector: 'Manufacturing', valueAdded: manufacturing, color: '#3b82f6' },
    { sector: 'Services', valueAdded: services, color: '#f59e0b' },
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
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Economy Scenarios</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('expenditure')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'expenditure' ? '#3b82f6' : 'transparent',
            color: activeTab === 'expenditure' ? 'white' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'expenditure' ? '2px solid #3b82f6' : 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'expenditure' ? '600' : '400',
          }}
        >
          📊 Expenditure Approach
        </button>
        <button
          onClick={() => setActiveTab('income')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'income' ? '#3b82f6' : 'transparent',
            color: activeTab === 'income' ? 'white' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'income' ? '2px solid #3b82f6' : 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'income' ? '600' : '400',
          }}
        >
          💰 Income Approach
        </button>
        <button
          onClick={() => setActiveTab('production')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'production' ? '#3b82f6' : 'transparent',
            color: activeTab === 'production' ? 'white' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'production' ? '2px solid #3b82f6' : 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'production' ? '600' : '400',
          }}
        >
          🏭 Production Approach
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'comparison' ? '#3b82f6' : 'transparent',
            color: activeTab === 'comparison' ? 'white' : '#64748b',
            border: 'none',
            borderBottom: activeTab === 'comparison' ? '2px solid #3b82f6' : 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: activeTab === 'comparison' ? '600' : '400',
          }}
        >
          ⚖️ Comparison
        </button>
      </div>

      {/* EXPENDITURE APPROACH TAB */}
      {activeTab === 'expenditure' && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Expenditure Approach: GDP = C + I + G + (X - M)
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <InfoBox type="info">
              <strong>Expenditure Approach:</strong> Measures GDP by summing all final expenditures in the economy.
              Consumption (C) is what households spend, Investment (I) is business capital spending, Government (G) is public spending,
              and Net Exports (X-M) captures international trade. This is the most commonly used approach.
            </InfoBox>
          </div>

          {/* Controls */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Adjust Components ($ trillions)</h3>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatBox label="Consumption (C)" value={consumption.toFixed(1)} unit="T" />
            <StatBox label="Investment (I)" value={investment.toFixed(1)} unit="T" />
            <StatBox label="Government (G)" value={governmentSpending.toFixed(1)} unit="T" />
            <StatBox label="Net Exports (X-M)" value={netExports.toFixed(1)} unit="T" highlight={netExports > 0} />
            <StatBox label="Total GDP" value={gdpExpenditure.toFixed(1)} unit="T" highlight />
          </div>

          {/* Bar Chart */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Composition of GDP</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={expenditureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Amount ($ Trillions)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: any) => `$${value.toFixed(1)}T`} />
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
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Component Breakdown (%)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Consumption</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {componentPcts.consumptionPct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Investment</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {componentPcts.investmentPct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Government</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {componentPcts.governmentPct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Net Exports</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: netExports >= 0 ? '#8b5cf6' : '#ef4444' }}>
                    {componentPcts.exportsPct}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Insights */}
          <div style={{ marginBottom: '1rem' }}>
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Income Approach: GDP = Wages + Profits + Rent
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <InfoBox type="info">
              <strong>Income Approach:</strong> Measures GDP by summing all incomes earned in producing output.
              Every dollar of production must be paid out as income to someone—either workers (wages),
              business owners (profits), or property owners (rent). In a closed economy, total income produced = total output.
              This is the fundamental macro accounting identity.
            </InfoBox>
          </div>

          {/* Controls */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Adjust Income Components ($ trillions)</h3>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatBox label="Wages (Labor)" value={wages.toFixed(1)} unit="T" />
            <StatBox label="Profits (Capital)" value={profits.toFixed(1)} unit="T" />
            <StatBox label="Rent (Land)" value={rent.toFixed(1)} unit="T" />
            <StatBox label="Total GDP" value={gdpIncome.toFixed(1)} unit="T" highlight />
          </div>

          {/* Pie Chart */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Income Distribution Breakdown</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value.toFixed(1)}T`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {incomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `$${value.toFixed(1)}T`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Income Distribution */}
          {showBreakdown && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Income Share (% of GDP)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Labor's Share</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {incomePcts.wagesPct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Capital's Share</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {incomePcts.profitsPct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Land's Share</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {incomePcts.rentPct}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Insights */}
          <div style={{ marginBottom: '1rem' }}>
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Production Approach: GDP = Sum of Value Added by Sector
          </h2>

          <div style={{ marginBottom: '2rem' }}>
            <InfoBox type="info">
              <strong>Production Approach:</strong> Measures GDP by summing the value added at each stage of production.
              Each firm's value added = its revenue minus what it paid for intermediate inputs from other firms.
              This avoids double-counting: we don't count both the steel and the car, only the car's value added (the difference).
              By sector, this shows the structure of the economy.
            </InfoBox>
          </div>

          {/* Controls */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Adjust Sector Value Added ($ trillions)</h3>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <StatBox label="Agriculture & Mining" value={agriculture.toFixed(1)} unit="T" />
            <StatBox label="Manufacturing" value={manufacturing.toFixed(1)} unit="T" />
            <StatBox label="Services" value={services.toFixed(1)} unit="T" />
            <StatBox label="Total GDP" value={gdpProduction.toFixed(1)} unit="T" highlight />
          </div>

          {/* Bar Chart */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Value Added by Sector</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis label={{ value: 'Value Added ($ Trillions)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: any) => `$${value.toFixed(1)}T`} />
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
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Economic Structure (% of GDP)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Agriculture</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {productionPcts.agriculturePct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Manufacturing</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {productionPcts.manufacturingPct}%
                  </div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>Services</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {productionPcts.servicesPct}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Insights */}
          <div style={{ marginBottom: '1rem' }}>
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
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
            Cross-Method Verification
          </h2>

          <div style={{ marginBottom: '2rem' }}>
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
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>GDP by Approach</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '0.875rem', color: '#0c4a6e', marginBottom: '0.5rem' }}>Expenditure Approach</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0c4a6e' }}>
                  ${gdpExpenditure.toFixed(1)}T
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#dcfce7', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '0.875rem', color: '#15803d', marginBottom: '0.5rem' }}>Income Approach</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#15803d' }}>
                  ${gdpIncome.toFixed(1)}T
                </div>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#fef08a', borderRadius: '6px', border: '1px solid #fcd34d' }}>
                <div style={{ fontSize: '0.875rem', color: '#854d0e', marginBottom: '0.5rem' }}>Production Approach</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#854d0e' }}>
                  ${gdpProduction.toFixed(1)}T
                </div>
              </div>
            </div>
          </div>

          {/* Discrepancy Analysis */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Measurement Consistency</h3>
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: discrepancyPercent < 2 ? '#dcfce7' : discrepancyPercent < 5 ? '#fef08a' : '#fee2e2',
                borderRadius: '6px',
                border:
                  discrepancyPercent < 2
                    ? '1px solid #bbf7d0'
                    : discrepancyPercent < 5
                      ? '1px solid #fcd34d'
                      : '1px solid #fecaca',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                Max Discrepancy Across Approaches
              </div>
              <div
                style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: discrepancyPercent < 2 ? '#15803d' : discrepancyPercent < 5 ? '#854d0e' : '#991b1b',
                }}
              >
                {discrepancyPercent.toFixed(2)}%
              </div>
              {discrepancyPercent < 2 && (
                <div style={{ fontSize: '0.875rem', color: '#15803d', marginTop: '0.5rem' }}>
                  ✓ Excellent consistency (typical for real-world GDP data)
                </div>
              )}
              {discrepancyPercent >= 2 && discrepancyPercent < 5 && (
                <div style={{ fontSize: '0.875rem', color: '#854d0e', marginTop: '0.5rem' }}>
                  ⚠ Good consistency but some discrepancy—adjust components to align approaches
                </div>
              )}
              {discrepancyPercent >= 5 && (
                <div style={{ fontSize: '0.875rem', color: '#991b1b', marginTop: '0.5rem' }}>
                  ⚠ Significant discrepancy—align the three approaches for proper GDP measurement
                </div>
              )}
            </div>
          </div>

          {/* Comparison Chart */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>GDP Comparison Across Methods</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="approach" />
                <YAxis label={{ value: 'GDP ($ Trillions)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: any) => `$${value.toFixed(1)}T`} />
                <Bar dataKey="gdp" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Breakdown Table */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Detailed Breakdown Table</h3>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.875rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#e2e8f0', fontWeight: '600' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1' }}>Method</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>Component 1</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>Component 2</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>Component 3</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #cbd5e1' }}>Total GDP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: '#dbeafe' }}>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1', fontWeight: '600' }}>
                      Expenditure
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      C: ${consumption.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      I: ${investment.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      G: ${governmentSpending.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #cbd5e1', fontWeight: '600', color: '#0c4a6e' }}>
                      ${gdpExpenditure.toFixed(1)}T
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#dcfce7' }}>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1', fontWeight: '600' }}>
                      Income
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      Wages: ${wages.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      Profits: ${profits.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      Rent: ${rent.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #cbd5e1', fontWeight: '600', color: '#15803d' }}>
                      ${gdpIncome.toFixed(1)}T
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#fef08a' }}>
                    <td style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #cbd5e1', fontWeight: '600' }}>
                      Production
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      Ag: ${agriculture.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      Mfg: ${manufacturing.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #cbd5e1' }}>
                      Svc: ${services.toFixed(1)}T
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #cbd5e1', fontWeight: '600', color: '#854d0e' }}>
                      ${gdpProduction.toFixed(1)}T
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Learning */}
          <div style={{ marginBottom: '1rem' }}>
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
      <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
        <Button onClick={() => setShowBreakdown(!showBreakdown)} variant="secondary">
          {showBreakdown ? '📊 Hide' : '📊 Show'} Percentage Breakdown
        </Button>
      </div>
    </div>
  )
}
