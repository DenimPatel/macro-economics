import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  ToolHeader,
  SliderControl,
  StatBox,
  Button,
  InfoBox,
} from '../components/ToolComponents'

interface GrowthDataPoint {
  year: number
  growthRate: number
  capitalContribution: number
  laborContribution: number
  tfpContribution: number
  totalContribution: number
}

export default function GrowthAccounting() {
  const [country, setCountry] = useState<'us' | 'china' | 'japan'>('us')
  const [showDataOverlay, setShowDataOverlay] = useState(true)
  const [timePeriod, setTimePeriod] = useState(2000)

  // Historical growth data for different countries
  const growthData: Record<string, GrowthDataPoint[]> = {
    us: [
      { year: 1950, growthRate: 3.0, capitalContribution: 1.2, laborContribution: 1.5, tfpContribution: 0.3, totalContribution: 3.0 },
      { year: 1960, growthRate: 3.5, capitalContribution: 1.4, laborContribution: 1.6, tfpContribution: 0.5, totalContribution: 3.5 },
      { year: 1970, growthRate: 2.5, capitalContribution: 1.0, laborContribution: 1.2, tfpContribution: 0.3, totalContribution: 2.5 },
      { year: 1980, growthRate: 3.0, capitalContribution: 1.2, laborContribution: 1.4, tfpContribution: 0.4, totalContribution: 3.0 },
      { year: 1990, growthRate: 3.2, capitalContribution: 1.3, laborContribution: 1.5, tfpContribution: 0.4, totalContribution: 3.2 },
      { year: 2000, growthRate: 2.8, capitalContribution: 1.1, laborContribution: 1.3, tfpContribution: 0.4, totalContribution: 2.8 },
      { year: 2010, growthRate: 1.8, capitalContribution: 0.8, laborContribution: 1.0, tfpContribution: 0.0, totalContribution: 1.8 },
      { year: 2020, growthRate: 1.5, capitalContribution: 0.7, laborContribution: 0.9, tfpContribution: 0.0, totalContribution: 1.5 },
    ],
    china: [
      { year: 1950, growthRate: 2.0, capitalContribution: 1.0, laborContribution: 0.8, tfpContribution: 0.2, totalContribution: 2.0 },
      { year: 1960, growthRate: 2.5, capitalContribution: 1.2, laborContribution: 1.0, tfpContribution: 0.3, totalContribution: 2.5 },
      { year: 1970, growthRate: 3.0, capitalContribution: 1.5, laborContribution: 1.2, tfpContribution: 0.3, totalContribution: 3.0 },
      { year: 1980, growthRate: 6.0, capitalContribution: 3.0, laborContribution: 2.0, tfpContribution: 1.0, totalContribution: 6.0 },
      { year: 1990, growthRate: 8.0, capitalContribution: 4.0, laborContribution: 2.5, tfpContribution: 1.5, totalContribution: 8.0 },
      { year: 2000, growthRate: 8.5, capitalContribution: 4.5, laborContribution: 2.8, tfpContribution: 1.2, totalContribution: 8.5 },
      { year: 2010, growthRate: 9.0, capitalContribution: 5.0, laborContribution: 3.0, tfpContribution: 1.0, totalContribution: 9.0 },
      { year: 2020, growthRate: 5.5, capitalContribution: 3.0, laborContribution: 2.0, tfpContribution: 0.5, totalContribution: 5.5 },
    ],
    japan: [
      { year: 1950, growthRate: 3.5, capitalContribution: 1.5, laborContribution: 1.8, tfpContribution: 0.2, totalContribution: 3.5 },
      { year: 1960, growthRate: 4.0, capitalContribution: 1.8, laborContribution: 2.0, tfpContribution: 0.2, totalContribution: 4.0 },
      { year: 1970, growthRate: 3.0, capitalContribution: 1.2, laborContribution: 1.5, tfpContribution: 0.3, totalContribution: 3.0 },
      { year: 1980, growthRate: 2.5, capitalContribution: 1.0, laborContribution: 1.2, tfpContribution: 0.3, totalContribution: 2.5 },
      { year: 1990, growthRate: 1.0, capitalContribution: 0.5, laborContribution: 0.8, tfpContribution: 0.2, totalContribution: 1.0 },
      { year: 2000, growthRate: 0.5, capitalContribution: 0.3, laborContribution: 0.4, tfpContribution: 0.1, totalContribution: 0.5 },
      { year: 2010, growthRate: 0.2, capitalContribution: 0.1, laborContribution: 0.2, tfpContribution: 0.0, totalContribution: 0.2 },
      { year: 2020, growthRate: 0.1, capitalContribution: 0.0, laborContribution: 0.1, tfpContribution: 0.0, totalContribution: 0.1 },
    ],
  }

  const currentCountryData = growthData[country]
  const currentData = currentCountryData.find(d => d.year === 2000) || currentCountryData[0]

  // Calculate contribution shares for pie chart
  const pieData = [
    { name: 'Capital', value: currentData.capitalContribution },
    { name: 'Labor', value: currentData.laborContribution },
    { name: 'TFP', value: currentData.tfpContribution },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b']

  return (
    <div className="tool-card">
      <ToolHeader
        title="Growth Accounting Tool"
        description="Decompose country growth into capital, labor, and TFP contributions."
        badge="advanced"
      />

      <div className="control-panel">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Country
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                onClick={() => setCountry('us')}
                variant={country === 'us' ? 'primary' : 'secondary'}
              >
                United States
              </Button>
              <Button
                onClick={() => setCountry('china')}
                variant={country === 'china' ? 'primary' : 'secondary'}
              >
                China
              </Button>
              <Button
                onClick={() => setCountry('japan')}
                variant={country === 'japan' ? 'primary' : 'secondary'}
              >
                Japan
              </Button>
            </div>
          </div>
          
          <SliderControl
            label="Time Period"
            value={timePeriod}
            min={1950}
            max={2020}
            step={10}
            onChange={setTimePeriod}
            unit=""
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button
            onClick={() => setShowDataOverlay(!showDataOverlay)}
            variant={showDataOverlay ? 'primary' : 'secondary'}
          >
            {showDataOverlay ? 'Hide Data' : 'Show Data'}
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Growth Decomposition Over Time
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentCountryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="capitalContribution" fill="#3b82f6" name="Capital Contribution" />
              <Bar dataKey="laborContribution" fill="#10b981" name="Labor Contribution" />
              <Bar dataKey="tfpContribution" fill="#f59e0b" name="TFP Contribution" />
              <Bar dataKey="growthRate" fill="#8b5cf6" name="Total Growth" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>
          Contribution Shares (2000)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <StatBox label="Capital Contribution" value={currentData.capitalContribution.toFixed(1)} unit="%" />
              <StatBox label="Labor Contribution" value={currentData.laborContribution.toFixed(1)} unit="%" />
              <StatBox label="TFP Contribution" value={currentData.tfpContribution.toFixed(1)} unit="%" />
              <StatBox label="Total Growth" value={currentData.growthRate.toFixed(1)} unit="%" />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '6px', borderLeft: '4px solid #0284c7' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0c4a6e', fontWeight: '600' }}>
                Growth Accounting Principles
              </h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.5' }}>
                Growth accounting decomposes total economic growth into contributions from:
                <br />
                - Capital accumulation (investment)
                <br />
                - Labor force growth and productivity
                <br />
                - Total Factor Productivity (TFP) improvements
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <InfoBox type="info">
          <strong>📈 Growth Patterns by Country</strong>
          <p>United States: Stable growth with TFP contributing more in recent decades</p>
          <p>China: Rapid growth driven by capital accumulation and labor force expansion</p>
          <p>Japan: Declining growth with TFP becoming increasingly important</p>
        </InfoBox>

        <InfoBox type="warning">
          <strong>⚠️ The Role of TFP</strong>
          <p>Total Factor Productivity (TFP) represents technological progress and efficiency improvements</p>
          <p>TFP growth is often the most important driver of long-term economic growth</p>
          <p>It's harder to measure and explain than capital or labor contributions</p>
        </InfoBox>

        <InfoBox type="success">
          <strong>✅ Policy Implications</strong>
          <p>Investment in R&D and innovation drives TFP growth</p>
          <p>Education and training improve labor productivity</p>
          <p>Infrastructure investments enhance capital efficiency</p>
        </InfoBox>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
          📊 Key Insights from Growth Accounting
        </h3>
        <ul style={{ fontSize: '0.875rem', lineHeight: '1.8', marginLeft: '1.5rem', color: '#475569' }}>
          <li>
            <strong>Capital vs. Labor:</strong> In developing economies, capital accumulation typically contributes more to growth than labor.
            In developed economies, TFP becomes the dominant factor.
          </li>
          <li>
            <strong>TFP Importance:</strong> TFP growth is often the most difficult to explain but is crucial for sustained long-term growth.
            It reflects technological progress, organizational improvements, and efficiency gains.
          </li>
          <li>
            <strong>Policy Focus:</strong> Countries aiming for sustained growth should focus on improving TFP through innovation, education, and institutional quality.
          </li>
          <li>
            <strong>Convergence:</strong> Developing countries can grow faster by adopting existing technologies (catch-up effect).
            Developed countries must rely more on innovation and productivity improvements.
          </li>
          <li>
            <strong>Measurement Challenges:</strong> Accurate growth accounting requires reliable data on capital stocks, labor input, and productivity.
            These measurements can be imperfect, affecting conclusions.
          </li>
        </ul>
      </div>
    </div>
  )
}
