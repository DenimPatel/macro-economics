import { useAppStore } from './store'
import Sidebar from './components/Sidebar'
import { lazy, Suspense } from 'react'

const GdpMeasurement = lazy(() => import('./tools/GdpMeasurement'))
const MultiplicerSimulator = lazy(() => import('./tools/MultiplicerSimulator'))
const IsLmExplorer = lazy(() => import('./tools/IsLmExplorer'))
const PhillipsCurveTradeOff = lazy(() => import('./tools/PhillipsCurveTradeOff'))
const PhillipsCurve = lazy(() => import('./tools/PhillipsCurve'))
const RealInterestRateCalculator = lazy(() => import('./tools/RealInterestRateCalculator'))
const RealInterestRate = lazy(() => import('./tools/RealInterestRate'))
const LaborMarket = lazy(() => import('./tools/LaborMarket'))
const LaborMarketWsPs = lazy(() => import('./tools/LaborMarketWsPs'))
const IsLmPcDynamics = lazy(() => import('./tools/IsLmPcDynamics'))
const SolowSimulator = lazy(() => import('./tools/SolowSimulator'))
const MundellFleming = lazy(() => import('./tools/MundellFleming'))
const AssetPricing = lazy(() => import('./tools/AssetPricing'))
const GrowthAccounting = lazy(() => import('./tools/GrowthAccounting'))
const Crisis2008 = lazy(() => import('./tools/Crisis2008'))
const CrisisCovid = lazy(() => import('./tools/CrisisCovid'))
const CrisisSvb = lazy(() => import('./tools/CrisisSvb'))
const SpeculativeAttack = lazy(() => import('./tools/SpeculativeAttack'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <div className="animate-spin mb-4 text-3xl">⟳</div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

const NotFound = () => (
  <div className="tool-card">
    <h1 className="tool-title">Tool Not Found</h1>
    <p className="tool-description">The requested tool is not available yet.</p>
  </div>
)

export default function App() {
  const currentTool = useAppStore((state) => state.currentTool)

  const renderTool = () => {
    const cases: Record<string, JSX.Element> = {
      'gdp-visualizer': <GdpMeasurement />,
      'multiplier-simulator': <MultiplicerSimulator />,
      'is-lm-explorer': <IsLmExplorer />,
      'phillips-curve': <PhillipsCurve />,
      'phillips-curve-tradeoff': <PhillipsCurveTradeOff />,
      'real-interest-rate': <RealInterestRate />,
      'real-interest-rate-calculator': <RealInterestRateCalculator />,
      'labor-market': <LaborMarket />,
      'labor-market-wsps': <LaborMarketWsPs />,
      'is-lm-pc-dynamics': <IsLmPcDynamics />,
      'solow-simulator': <SolowSimulator />,
      'mundell-fleming': <MundellFleming />,
      'asset-pricing': <AssetPricing />,
      'growth-accounting': <GrowthAccounting />,
      'crisis-2008': <Crisis2008 />,
      'crisis-covid': <CrisisCovid />,
      'crisis-svb': <CrisisSvb />,
      'speculative-attack': <SpeculativeAttack />,
    }

    return cases[currentTool] || <NotFound />
  }

  return (
    <div className="container-main">
      <Sidebar />
      <main className="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          {renderTool()}
        </Suspense>
      </main>
    </div>
  )
}
