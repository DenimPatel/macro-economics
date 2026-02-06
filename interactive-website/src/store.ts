import { create } from 'zustand'

export type ToolId = 
  | 'gdp-visualizer'
  | 'multiplier-simulator'
  | 'fiscal-policy-experiments'
  | 'is-lm-explorer'
  | 'phillips-curve'
  | 'phillips-curve-tradeoff'
  | 'real-interest-rate'
  | 'real-interest-rate-calculator'
  | 'labor-market'
  | 'labor-market-wsps'
  | 'is-lm-pc-dynamics'
  | 'solow-simulator'
  | 'mundell-fleming'
  | 'asset-pricing'
  | 'growth-accounting'
  | 'crisis-2008'
  | 'crisis-covid'
  | 'crisis-svb'
  | 'speculative-attack'

export type Category = 'beginner' | 'intermediate' | 'advanced' | 'case-study'

interface AppState {
  currentTool: ToolId
  showDataOverlay: boolean
  setCurrentTool: (toolId: ToolId) => void
  setShowDataOverlay: (show: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentTool: 'multiplier-simulator',
  showDataOverlay: false,
  setCurrentTool: (toolId) => set({ currentTool: toolId }),
  setShowDataOverlay: (show) => set({ showDataOverlay: show }),
}))

export const TOOLS: Record<ToolId, { title: string; category: Category; description: string }> = {
  'gdp-visualizer': {
    title: 'GDP Measurement Visualizer',
    category: 'beginner',
    description: 'Explore three approaches to GDP measurement: final goods, value added, and income approaches.',
  },
  'multiplier-simulator': {
    title: 'Multiplier Effect Simulator',
    category: 'beginner',
    description: 'Watch government spending cascade through rounds of consumption. See how multiplier effects amplify initial shocks.',
  },
  'fiscal-policy-experiments': {
    title: 'Keynesian Cross Policy Experiments',
    category: 'beginner',
    description: 'Explore the three foundational fiscal policy experiments from Lecture 3: consumption shocks, government spending changes, and tax policy.',
  },
  'is-lm-explorer': {
    title: 'IS-LM Equilibrium Explorer',
    category: 'beginner',
    description: 'Adjust fiscal and monetary policy. Watch how IS and LM curves shift and new equilibrium emerges.',
  },
  'phillips-curve': {
    title: 'Phillips Curve',
    category: 'intermediate',
    description: 'Explore the unemployment-inflation relationship and historical evolution of the Phillips Curve.',
  },
  'phillips-curve-tradeoff': {
    title: 'Phillips Curve Trade-Off',
    category: 'intermediate',
    description: 'Understand supply shocks, demand shocks, and inflation expectations in the Phillips Curve framework.',
  },
  'real-interest-rate': {
    title: 'Real Interest Rate',
    category: 'intermediate',
    description: 'Interactive visualization of real vs nominal interest rates.',
  },
  'real-interest-rate-calculator': {
    title: 'Real Interest Rate Calculator',
    category: 'intermediate',
    description: 'Master the Fisher Equation. See how inflation surprises redistribute wealth and affect decisions.',
  },
  'labor-market': {
    title: 'Labor Market',
    category: 'intermediate',
    description: 'Explore labor market dynamics and wage-employment relationships.',
  },
  'labor-market-wsps': {
    title: 'Labor Market: WS/PS Diagram',
    category: 'intermediate',
    description: 'Wage-setting and price-setting curves determine natural rate of unemployment and equilibrium wage.',
  },
  'is-lm-pc-dynamics': {
    title: 'IS-LM-PC Dynamic Adjustment',
    category: 'intermediate',
    description: 'Watch economy move from short-run to medium-run equilibrium after demand shocks.',
  },
  'solow-simulator': {
    title: 'Solow Growth Model',
    category: 'advanced',
    description: 'Capital accumulation determines long-run growth. Vary savings rate and see steady state shift.',
  },
  'mundell-fleming': {
    title: 'Mundell-Fleming Policy Lab',
    category: 'advanced',
    description: 'Compare monetary policy effectiveness under fixed vs. floating exchange rates.',
  },
  'asset-pricing': {
    title: 'Asset Pricing Calculator (EPDV)',
    category: 'advanced',
    description: 'Calculate present value of future cash flows. See how discount rates affect bond and stock prices.',
  },
  'growth-accounting': {
    title: 'Growth Accounting Tool',
    category: 'advanced',
    description: 'Decompose country growth into capital, labor, and TFP contributions.',
  },
  'crisis-2008': {
    title: '2008 Financial Crisis',
    category: 'case-study',
    description: 'Timeline animation: Watch credit spreads spike, IS-LM shifts, unemployment rises.',
  },
  'crisis-covid': {
    title: 'COVID Shock 2020-2023',
    category: 'case-study',
    description: 'Supply vs. demand shocks. Compare fiscal and monetary policy responses.',
  },
  'crisis-svb': {
    title: 'SVB Banking Crisis & Fisher Equation',
    category: 'case-study',
    description: 'Understand why real rate squeeze caused SVB losses and why rate hikes break the system.',
  },
  'speculative-attack': {
    title: 'Speculative Attack on Fixed Peg',
    category: 'case-study',
    description: 'Bank run mechanics on currency pegs. Watch reserves drain and defense mechanisms.',
  },
}
