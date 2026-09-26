/* eslint-disable react-refresh/only-export-components -- the registry is a lookup table, not a fast-refresh boundary. */
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import type { ToolId } from '../../../content/lectures'

type ToolComponent = LazyExoticComponent<ComponentType>

/**
 * Lazy-load every tool so only the active one is fetched. Register a new tool
 * here and in `store.ts` (TOOLS) and link it from `content/lectures.ts`.
 */
export const TOOL_COMPONENTS: Record<ToolId, ToolComponent> = {
  'gdp-visualizer': lazy(() => import('./GdpMeasurement')),
  'multiplier-simulator': lazy(() => import('./MultiplicerSimulator')),
  'fiscal-policy-experiments': lazy(() => import('./FiscalPolicyExperiments')),
  'is-lm-explorer': lazy(() => import('./IsLmExplorer')),
  'modern-is-curve': lazy(() => import('./ModernISCurve')),
  'phillips-curve': lazy(() => import('./PhillipsCurve')),
  'phillips-curve-tradeoff': lazy(() => import('./PhillipsCurveTradeOff')),
  'real-interest-rate': lazy(() => import('./RealInterestRate')),
  'real-interest-rate-calculator': lazy(() => import('./RealInterestRateCalculator')),
  'labor-market': lazy(() => import('./LaborMarket')),
  'labor-market-wsps': lazy(() => import('./LaborMarketWsPs')),
  'is-lm-pc-dynamics': lazy(() => import('./IsLmPcDynamics')),
  'solow-simulator': lazy(() => import('./SolowSimulator')),
  'mundell-fleming': lazy(() => import('./MundellFleming')),
  'asset-pricing': lazy(() => import('./AssetPricing')),
  'growth-accounting': lazy(() => import('./GrowthAccounting')),
  'crisis-2008': lazy(() => import('./Crisis2008')),
  'crisis-covid': lazy(() => import('./CrisisCovid')),
  'crisis-svb': lazy(() => import('./CrisisSvb')),
  'speculative-attack': lazy(() => import('./SpeculativeAttack')),
}

export function LoadingTool() {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-fg-muted">
      Loading simulation…
    </div>
  )
}

export function ToolRenderer({ toolId }: { toolId: ToolId }) {
  const Component = TOOL_COMPONENTS[toolId]
  if (!Component) {
    return <p className="text-sm text-fg-muted">This tool is not available yet.</p>
  }
  return (
    <Suspense fallback={<LoadingTool />}>
      <Component />
    </Suspense>
  )
}
