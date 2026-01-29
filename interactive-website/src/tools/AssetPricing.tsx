import { ToolHeader } from '../components/ToolComponents'

export default function AssetPricing() {
  return (
    <div className="tool-card">
      <ToolHeader
        title="Asset Pricing Calculator (EPDV)"
        description="Calculate present value of future cash flows. See how discount rates affect bond and stock prices."
        badge="advanced"
      />
      <p style={{ color: '#64748b' }}>Tool coming soon...</p>
    </div>
  )
}
