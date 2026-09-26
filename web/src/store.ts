import { create } from 'zustand'
import type { Tier, ToolId } from '../../content/lectures'

export interface ToolInfo {
  title: string
  category: Tier
  description: string
}

/**
 * Tool registry. Add a tool here, then lazy-load it in `tools/registry.tsx`
 * and link it from a lecture in `content/lectures.ts`.
 */
export const TOOLS: Record<ToolId, ToolInfo> = {
  'gdp-visualizer': {
    title: 'GDP Measurement Visualizer',
    category: 'beginner',
    description:
      'Explore three approaches to GDP measurement: final goods, value added, and income approaches.',
  },
  'multiplier-simulator': {
    title: 'Multiplier Effect Simulator',
    category: 'beginner',
    description:
      'Watch government spending cascade through rounds of consumption and see how the multiplier amplifies a shock.',
  },
  'fiscal-policy-experiments': {
    title: 'Keynesian Cross Policy Experiments',
    category: 'beginner',
    description:
      'The three foundational fiscal policy experiments: consumption shocks, government spending changes, and tax policy.',
  },
  'is-lm-explorer': {
    title: 'IS-LM Equilibrium Explorer',
    category: 'beginner',
    description:
      'Adjust fiscal and monetary policy and watch the IS and LM curves shift to a new equilibrium.',
  },
  'modern-is-curve': {
    title: 'Modern IS Curve: From Textbook to Markets',
    category: 'advanced',
    description:
      'Compare textbook and New Keynesian IS curves, financial conditions, term premiums, and monetary transmission.',
  },
  'phillips-curve': {
    title: 'Phillips Curve',
    category: 'intermediate',
    description:
      'The unemployment-inflation relationship and the historical evolution of the Phillips curve.',
  },
  'phillips-curve-tradeoff': {
    title: 'Phillips Curve Trade-Off',
    category: 'intermediate',
    description: 'Supply shocks, demand shocks, and inflation expectations in the Phillips curve framework.',
  },
  'real-interest-rate': {
    title: 'Real Interest Rate',
    category: 'intermediate',
    description: 'An interactive visualization of real versus nominal interest rates.',
  },
  'real-interest-rate-calculator': {
    title: 'Real Interest Rate Calculator',
    category: 'intermediate',
    description:
      'Master the Fisher equation and see how inflation surprises redistribute wealth and affect decisions.',
  },
  'labor-market': {
    title: 'Labor Market',
    category: 'intermediate',
    description: 'Labor market dynamics and the wage-employment relationship.',
  },
  'labor-market-wsps': {
    title: 'Labor Market: WS/PS Diagram',
    category: 'intermediate',
    description:
      'Wage-setting and price-setting curves determine the natural rate of unemployment and the equilibrium real wage.',
  },
  'is-lm-pc-dynamics': {
    title: 'IS-LM-PC Dynamic Adjustment',
    category: 'intermediate',
    description: 'Watch the economy move from short-run to medium-run equilibrium after demand shocks.',
  },
  'solow-simulator': {
    title: 'Solow Growth Model',
    category: 'advanced',
    description: 'Capital accumulation and the steady state; vary the saving rate and see the steady state shift.',
  },
  'mundell-fleming': {
    title: 'Mundell-Fleming Policy Lab',
    category: 'advanced',
    description: 'Compare policy effectiveness under fixed and floating exchange rates.',
  },
  'asset-pricing': {
    title: 'Asset Pricing Calculator (EPDV)',
    category: 'advanced',
    description:
      'Calculate the present value of future cash flows and see how discount rates affect bond and stock prices.',
  },
  'growth-accounting': {
    title: 'Growth Accounting Tool',
    category: 'advanced',
    description: 'Decompose country growth into capital, labor, and TFP contributions.',
  },
  'crisis-2008': {
    title: '2008 Financial Crisis',
    category: 'case-study',
    description: 'Timeline: credit spreads spike, IS shifts, and unemployment rises toward the zero lower bound.',
  },
  'crisis-covid': {
    title: 'COVID Shock 2020-2023',
    category: 'case-study',
    description: 'Supply versus demand shocks and the fiscal and monetary policy response.',
  },
  'crisis-svb': {
    title: 'SVB Banking Crisis & Fisher Equation',
    category: 'case-study',
    description: 'Why a real-rate squeeze caused SVB losses and why sharp rate hikes stress the financial system.',
  },
  'speculative-attack': {
    title: 'Speculative Attack on a Fixed Peg',
    category: 'case-study',
    description: 'Bank-run mechanics on a currency peg: reserve depletion and defense mechanisms.',
  },
}

export interface ScenarioParams {
  [key: string]: number
}

interface AppState {
  showDataOverlay: boolean
  setShowDataOverlay: (show: boolean) => void
  /** Live scenario parameters for the active tool, used for sharing. */
  scenario: { toolId: ToolId; params: ScenarioParams } | null
  setScenario: (toolId: ToolId, params: ScenarioParams) => void
  clearScenario: () => void
}

export const useAppStore = create<AppState>((set) => ({
  showDataOverlay: false,
  setShowDataOverlay: (show) => set({ showDataOverlay: show }),
  scenario: null,
  setScenario: (toolId, params) => set({ scenario: { toolId, params } }),
  clearScenario: () => set({ scenario: null }),
}))
