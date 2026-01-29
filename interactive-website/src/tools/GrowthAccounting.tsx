import { ToolHeader } from '../components/ToolComponents'

export default function GrowthAccounting() {
  return (
    <div className="tool-card">
      <ToolHeader
        title="Growth Accounting Tool"
        description="Decompose country growth into capital, labor, and TFP contributions."
        badge="advanced"
      />
      <p style={{ color: '#64748b' }}>Tool coming soon...</p>
    </div>
  )
}
