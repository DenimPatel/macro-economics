# Interactive Macroeconomics Educational Website

An interactive, web-based platform for exploring macroeconomic concepts through dynamic visualizations, simulations, and policy scenario tools.

## Overview

This project transforms macro-economics lectures into an engaging, hands-on learning experience. Students can adjust economic parameters (savings rates, government spending, interest rates, etc.) and **immediately see** how the economy responds through animated charts and real-time calculations.

### Features

- **15+ Interactive Tools** across 4 difficulty tiers
- **Dynamic Visualizations** using Recharts for economic diagrams
- **Policy Scenario Experiments** - Compare fiscal/monetary policy outcomes
- **Real Data Integration** - Historical US economic data overlays (2000-2025)
- **Scenario Sharing** - Export and share analysis with classmates/instructors
- **Responsive Design** - Works on desktop and tablets

## Project Structure

```
interactive-website/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx              # Navigation sidebar
│   │   └── ToolComponents.tsx       # Reusable UI components
│   ├── tools/
│   │   ├── MultiplicerSimulator.tsx ✅ (Completed)
│   │   ├── IsLmExplorer.tsx         ⏳ (Placeholder)
│   │   ├── PhillipsCurve.tsx        ⏳
│   │   ├── RealInterestRate.tsx     ⏳
│   │   ├── LaborMarket.tsx          ⏳
│   │   ├── IsLmPcDynamics.tsx       ⏳
│   │   ├── SolowSimulator.tsx       ⏳
│   │   ├── MundellFleming.tsx       ⏳
│   │   ├── AssetPricing.tsx         ⏳
│   │   ├── GrowthAccounting.tsx     ⏳
│   │   └── Crisis*.tsx              ⏳ (4 case studies)
│   ├── utils/
│   │   ├── calculations.ts          # Economic formulas
│   │   └── sharing.ts               # Export/share functionality
│   ├── store.ts                     # Zustand state management
│   ├── App.tsx                      # Main app shell
│   └── index.css                    # Global styles + Tailwind
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md (this file)
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone and navigate to project**
   ```bash
   cd /Users/denimpatel/Desktop/macro-economics/interactive-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Interactive Tools

### Tier 1: Beginner (Lectures 1-6)

- **Multiplier Effect Simulator** ✅
  - Watch government spending cascade through economy
  - See consumption feedback rounds amplify GDP impact
  - Adjust MPC to understand multiplier strength

- **IS-LM Equilibrium Explorer** ✅
  - Fiscal & monetary policy controls
  - Watch IS and LM curves shift in real-time
  - Compare equilibrium across scenarios
  - Understand curve slopes and economic intuition
  - Explore crowding out, multiplier effects, and policy effectiveness

- **Phillips Curve Trade-Off** (Placeholder)
  - Unemployment vs. inflation trade-off
  - Expectations-augmented curve shifts
  - Historical data overlay

### Tier 2: Intermediate (Lectures 7-12)

- **Real Interest Rate Calculator**
  - Fisher Equation: Nominal Rate = Real Rate + Expected Inflation
  - See why real rates matter for investment decisions
  - Compare rate regimes

- **Labor Market: WS/PS Diagram**
  - Wage-setting and price-setting equilibrium
  - Wage bargaining power adjustments
  - Unemployment determination

- **IS-LM-PC Dynamic Adjustment**
  - Watch economy move from short-run to medium-run
  - Fed policy response to demand shocks
  - Inflation expectations evolution

### Tier 3: Advanced (Lectures 13-25)

- **Solow Growth Model**
  - Capital per worker vs. investment/depreciation
  - Savings rate effects on steady state
  - Population growth impact on growth per capita

- **Mundell-Fleming Policy Lab**
  - Three-panel diagram (IS-LM + UIP + Exchange Rate)
  - Fixed vs. floating regime comparison
  - International spillovers

- **Asset Pricing Calculator (EPDV)**
  - Expected Present Discounted Value of cash flows
  - Bond and equity pricing
  - Discount rate sensitivity

- **Growth Accounting Tool**
  - Decompose growth into capital, labor, TFP
  - Cross-country comparisons
  - Solow residual calculation

### Tier 4: Case Studies & Crisis Scenarios

- **2008 Financial Crisis**
  - Timeline animation of crisis dynamics
  - Credit spread shocks, employment collapse
  - IS-LM-PC model application to real data

- **COVID Shock 2020-2023**
  - Supply vs. demand shock scenarios
  - Fiscal stimulus, monetary accommodation
  - Inflation outcome comparison

- **SVB Banking Crisis & Fisher Equation**
  - Real rate squeeze mechanics
  - Why rate hikes break financial system
  - Portfolio reallocation effects

- **Speculative Attack on Fixed Peg**
  - Bank run dynamics on currency peg
  - Reserve depletion and defense mechanisms
  - Historical examples (ERM 1992, Argentina)

## Key Concepts Covered

### Micro vs. Macro Paradoxes
- **Paradox of Savings**: Aggregate saving attempts → recession
- **"Good News is Bad News"**: Strong employment → Fed rate hike expected → stocks fall

### Multiplier & Feedback Loops
- Initial demand shock → production → income → consumption cascade
- Feedback strength depends on MPC (marginal propensity to consume)
- Leakages (imports, taxes) reduce multiplier in open economy

### Equilibrium Across Multiple Markets
- Goods market (IS): Production = Demand
- Financial market (LM): Money demand = Money supply
- Labor market (Phillips Curve): Inflation dynamics
- Foreign market (UIP): Exchange rate determination

### Time Horizons
- **Short-run**: Demand-driven, sticky prices, output variable
- **Medium-run**: Inflation expectations matter, Phillips Curve
- **Long-run**: Supply-driven, capital accumulation, technology

## Calculation Engine

All economic formulas are computed in `src/utils/calculations.ts`:

- Multiplier: `1 / (1 - MPC)`
- Equilibrium Output: `Multiplier × (Autonomous Demand - MPC × Taxes)`
- Phillips Curve Inflation: `Expected Inflation - β × (Unemployment - Natural Rate)`
- Real Interest Rate: `Nominal Rate - Expected Inflation`
- EPDV Bond Price: `Σ(Coupon / (1 + r)^t) + FaceValue / (1 + r)^T`
- Solow Steady State Capital: `(Savings Rate / (Population Growth + Depreciation))^(1/(1-α))`

## State Management

Uses **Zustand** for lightweight state:

- Current tool selection
- Data overlay toggle (real vs. theoretical)
- URL-based scenario loading

```typescript
const { currentTool, setCurrentTool, showDataOverlay } = useAppStore()
```

## Sharing & Export Features

### Save Scenarios
```typescript
// Encode parameters to URL
const scenario = saveScenario('is-lm-explorer', { G: 150, M: 100, r: 0.05 })
// Share URL with scenario parameter
```

### Export Data
```typescript
// Download as JSON or CSV
downloadAsJSON(resultsData, 'is-lm-results.json')
downloadAsCSV(roundsData, 'multiplier-rounds.csv')
```

## Styling

- **CSS Framework**: Tailwind CSS for responsive utility-first design
- **Custom CSS**: `src/index.css` for economic chart styling and layouts
- **Color Scheme**: Dark sidebar (slate-800), light content area (gray-50)
- **Components**: Sliders, buttons, stat boxes, info boxes with consistent design

## Performance Considerations

- **Lazy Loading**: Tools load on-demand to reduce initial bundle size
- **Memoization**: Calculation-heavy functions optimized with useMemo
- **Chart Optimization**: Recharts ResponsiveContainer for efficient rendering
- **CSS-in-JS**: Inline styles preferred over external for component scope

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## Future Enhancements

### High Priority
1. Complete all 15 tools with full visualizations
2. Integrate real US economic data (2000-2025)
3. Add animation/transitions for equilibrium adjustment
4. Implement scenario comparison (A/B side-by-side)

### Medium Priority
5. Interactive curve dragging (move IS/LM curves by mouse)
6. API backend for user accounts and scenario persistence
7. Multi-language support
8. Instructor dashboard (track student progress)

### Nice-to-Have
9. VR/3D visualization for complex models
10. AI tutor chatbot (ask questions about tools)
11. Mobile-responsive worksheets
12. YouTube video integration per tool
13. Peer collaboration features

## Development Workflow

### Adding a New Tool

1. **Create tool file** in `src/tools/`:
   ```tsx
   import { ToolHeader, SliderControl } from '../components/ToolComponents'
   
   export default function MyTool() {
     // State + calculations
     return (
       <div className="tool-card">
         <ToolHeader title="..." description="..." badge="beginner" />
         {/* Controls + Visualizations */}
       </div>
     )
   }
   ```

2. **Register in store** (`src/store.ts`):
   ```ts
   'my-tool': { title: 'My Tool', category: 'beginner', description: '...' }
   ```

3. **Add to App.tsx** lazy loading:
   ```tsx
   const MyTool = lazy(() => import('./tools/MyTool'))
   ```

4. **Test navigation** - Tool appears in sidebar automatically

### Updating Calculations

- Edit formulas in `src/utils/calculations.ts`
- All tools referencing that function auto-update
- Type-safe parameter passing via TypeScript

## Team & Contributors

**Original Concept**: Based on macroeconomics lecture series by [Professor Name]

**Development**: Interactive platform implementation for educational enhancement

## License

MIT License - Free for educational use

## Support & Questions

For issues, suggestions, or questions:
1. Check README and inline comments
2. Review Calculation.ts for formula definitions
3. Reference TOOLS constant in store.ts for tool metadata

---

**Last Updated**: January 2026
**Status**: 🟢 Core Framework Complete | 🟡 Tools 1/15 Implemented | 🔴 Advanced Features Pending
