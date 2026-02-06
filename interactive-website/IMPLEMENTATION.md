# Implementation Guide: Interactive Macroeconomics Website

## Project Status Summary

**Completed**:
✅ Full React + TypeScript + Vite project scaffolding  
✅ Zustand state management setup  
✅ 4 core UI components (ToolHeader, SliderControl, StatBox, InfoBox)  
✅ Economic calculation utilities (multiplier, equilibrium, inflation, etc.)  
✅ Sharing/export utilities (JSON, CSV, URL encoding)  
✅ Sidebar navigation with tool categories  
✅ Multiplier Effect Simulator (fully functional)  
✅ 13 tool placeholders (ready for implementation)  
✅ Professional styling (Tailwind CSS + custom CSS)  
✅ Responsive design framework  

**Next Steps**: Implement remaining 14 tools with full visualizations

---

## Quick Start

### 1. Install Dependencies
```bash
cd /Users/denimpatel/Desktop/macro-economics/interactive-website
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open `http://localhost:5173` in browser.

### 3. Test Multiplier Tool
Navigate to "🟢 Beginner" → "Multiplier Effect Simulator"
- Drag MPC slider (0.1-0.95)
- Adjust government spending
- Watch output, multiplier rounds update in real-time

---

## Implementation Roadmap: Next 14 Tools

### Phase 1: Tier 1 Beginner Tools (Lectures 1-6)

#### Tool 2: IS-LM Equilibrium Explorer
**Location**: `src/tools/IsLmExplorer.tsx`

**Visualization**: 
- Two-panel layout: Left (IS-LM diagram), Right (Parameter controls)
- IS curve: `Y = C + I(r) + G` (downward sloping in r)
- LM curve: `M/P = L(Y, r)` (upward sloping)

**Interactions**:
- Fiscal policy: Slider for ΔG → IS shifts right
- Monetary policy: Slider for ΔM → LM shifts right
- Tax policy: Slider for ΔT → IS shifts

**Key Formulas** (add to `utils/calculations.ts`):
```typescript
// IS Curve: Investment depends on output and interest rate
const investmentIS = (output: number, rate: number, sensitivity: number) => 
  100 + 0.2 * output - 20 * rate

// LM Curve: Money demand equals supply
const moneyDemand = (output: number, rate: number) => 
  0.5 * output - 50 * rate

// Equilibrium: Solve simultaneously for Y and r
```

**Chart Library**: Recharts LineChart with dual axes (Y, r)

**Educational Content**:
- Detailed explanation of why IS curve is downward sloping
- Explanation of why LM curve is upward sloping
- Discussion of policy effectiveness and crowding out
- Real-world applications of IS-LM model

---

#### Tool 3: Phillips Curve Trade-Off (Partial)
**Location**: `src/tools/PhillipsCurve.tsx`

**Visualization**:
- X-axis: Unemployment rate (0-10%)
- Y-axis: Inflation rate (-2% to 10%)
- Two curves: Traditional Phillips Curve + Expectations-Augmented

**Controls**:
- Expected inflation slider
- Natural unemployment rate slider
- Historical data toggle (1960s, 1970s, 1980s, 2000s, 2020s)

**Key Formula**:
$$\pi = \pi^e - \alpha(u - u_n)$$

---

### Phase 2: Tier 2 Intermediate Tools (Lectures 7-12)

#### Tool 4: Real Interest Rate Calculator
**Location**: `src/tools/RealInterestRate.tsx`

**Visualization**:
- Input boxes: Nominal rate, Expected inflation
- Output: Real rate (calculated via Fisher Equation)
- Multiple scenarios side-by-side (e.g., 6% nominal + 3% inflation = 3% real)

**Key Formula**:
$$r = i - \pi^e$$

**Educational Feature**: Show same real rate achieved different ways (6% nominal, 3% inflation = 3% nominal, 0% inflation)

---

#### Tool 5: Labor Market WS/PS Diagram
**Location**: `src/tools/LaborMarket.tsx`

**Visualization**:
- X-axis: Unemployment rate (0-10%)
- Y-axis: Real wage (relative to productivity)
- WS curve: Upward sloping (wage setting by workers/unions)
- PS curve: Downward sloping (price setting by firms)

**Controls**:
- Union bargaining power (shifts WS up)
- Firm markup (shifts PS down)
- Watch equilibrium unemployment change

**Key Concept**: Intersection determines equilibrium unemployment and wage

---

#### Tool 6: IS-LM-PC Dynamic Adjustment
**Location**: `src/tools/IsLmPcDynamics.tsx`

**Visualization**:
- Three panels: IS-LM (top), Phillips Curve (bottom-left), Time path (bottom-right)
- Animation showing economy trajectory over 8 quarters

**Scenario**: Positive demand shock (ΔG = +100)
1. **Quarter 1**: IS shifts right → output ↑, r ↑
2. **Quarters 2-4**: As inflation rises (Phillips Curve), Fed raises rate → LM shifts left
3. **Quarter 5+**: Converges to new equilibrium at higher inflation

**Advanced Feature**: Toggle Fed reaction function (aggressive vs. passive)

---

### Phase 3: Tier 3 Advanced Tools (Lectures 13-25)

#### Tool 7: Solow Growth Model
**Location**: `src/tools/SolowSimulator.tsx`

**Visualization**:
- Solow diagram: Capital per worker (k) vs. Investment per worker / Depreciation
- Point showing current k, steady state k*, convergence path

**Controls**:
- Savings rate (affects investment line height)
- Depreciation rate
- Population growth rate
- Technology level (shifts production function)

**Animation**: Year-by-year capital accumulation over 100 years

---

#### Tool 8: Mundell-Fleming Policy Lab
**Location**: `src/tools/MundellFleming.tsx`

**Visualization**:
- Three panels: IS-LM (top), UIP line (bottom-left), Exchange rate (bottom-right)
- OR: Single 3D-like view showing all relationships

**Scenarios**:
1. **Monetary expansion, floating rate**: LM shifts right → output ↑, rate ↓ → currency depreciation
2. **Monetary expansion, fixed rate**: Fed forced to maintain rate → M contracts → ineffective

**Controls**:
- Fixed/Floating toggle
- Policy levers (G, M, etc.)
- Capital mobility slider

---

#### Tool 9: Asset Pricing Calculator (EPDV)
**Location**: `src/tools/AssetPricing.tsx`

**Visualization**:
- Two sections: Bonds and Equity
- Inputs: Coupon/dividend, years to maturity/perpetuity, discount rate
- Output: Current price, sensitivity to rate changes

**Bonds Example**:
- $100 coupon, 10 years, varying discount rates (2% → 8%)
- See inverse relationship: higher rate → lower price

**Equity Example**:
- Gordon Growth Model: Price = Dividend × (1 + g) / (r - g)
- Show impact of changing required return or growth expectations

---

#### Tool 10: Growth Accounting Tool
**Location**: `src/tools/GrowthAccounting.tsx`

**Visualization**:
- Pie chart: Decomposition of growth into capital, labor, TFP (Solow residual)
- Cross-country comparison: US vs. China vs. Japan

**Input**:
- Country growth rate
- Factor growth rates (capital, labor)
- Auto-calculates TFP

**Historical Data**:
- Long-run US growth decomposition (1950-2024)
- Show changing role of capital vs. TFP over time

---

### Phase 4: Tier 4 Crisis Case Studies

#### Tool 11: 2008 Financial Crisis
**Location**: `src/tools/Crisis2008.tsx`

**Timeline**: 2007Q3 → 2013Q1 (slider for year/quarter)

**Visualization** (3 panels):
1. Credit spreads over time (BAA-AAA spread spikes 2008-2009)
2. IS-LM diagram showing how credit spreads widen → demand shock
3. Unemployment + inflation over time

**Narrative**: 
- 2007: Subprime mortgage crisis begins
- 2008Q3-Q4: Lehman collapse, credit markets freeze
- 2009-2010: Recovery begins with Fed QE, fiscal stimulus
- 2012-2013: Still high unemployment, FOMC debating taper

**Educational**: Show real data overlaid on IS-LM-PC model

---

#### Tool 12: COVID Shock 2020-2023
**Location**: `src/tools/CrisisCovid.tsx`

**Toggle**: Supply shock vs. Demand shock vs. Combined

**Visualization**:
- IS-LM-PC showing combined shock dynamics
- Timeline of fiscal/monetary policy responses
- Outcomes comparison: different policy mixes

**Scenarios**:
1. **Demand shock only** (lockdowns kill consumption): Output ↓, inflation ↓
2. **Supply shock only** (supply chain disruptions): Output ↓, inflation ↑ (stagflation)
3. **Combined + Fiscal/Monetary response**: Show actual 2020-2023 path

---

#### Tool 13: SVB Banking Crisis & Fisher Equation
**Location**: `src/tools/CrisisSvb.tsx`

**Key Story**: Real interest rate squeeze broke SVB's business model

**Visualization**:
- Fisher Equation breakdown: 6% nominal (2021) → 0.5% real with low inflation
- As Fed raises (5% by 2023) with inflation still 4% → 1% real
- But bond portfolio locked in 1.5% coupons → negative real loss

**Interactive**: Adjust Fed rate and inflation → see portfolio loss/gain

---

#### Tool 14: Speculative Attack on Fixed Peg
**Location**: `src/tools/SpeculativeAttack.tsx`

**Visualization**:
- Fixed exchange rate peg under attack
- Central bank reserves depletion over time (animated bar chart)
- Interest rate defense mechanism (policy rate rises)
- Output contraction from tight policy

**Historical Example Buttons**: 
- 1992 ERM Crisis (British pound)
- 2001 Argentina crisis
- 1997 Asian crisis

**Educational**: Show why impossible trinity makes defense costly

---

## File Structure After Implementation

```
src/tools/
├── MultiplicerSimulator.tsx ✅ [DONE - 400 lines]
├── IsLmExplorer.tsx        [TODO - 350 lines]
├── PhillipsCurve.tsx       [TODO - 300 lines]
├── RealInterestRate.tsx    [TODO - 250 lines]
├── LaborMarket.tsx         [TODO - 280 lines]
├── IsLmPcDynamics.tsx      [TODO - 400 lines]
├── SolowSimulator.tsx      [TODO - 350 lines]
├── MundellFleming.tsx      [TODO - 450 lines]
├── AssetPricing.tsx        [TODO - 320 lines]
├── GrowthAccounting.tsx    [TODO - 300 lines]
├── Crisis2008.tsx          [TODO - 380 lines]
├── CrisisCovid.tsx         [TODO - 360 lines]
├── CrisisSvb.tsx           [TODO - 290 lines]
└── SpeculativeAttack.tsx   [TODO - 310 lines]

src/utils/
├── calculations.ts [DONE - 150 lines]
└── sharing.ts      [DONE - 80 lines]

src/components/
├── Sidebar.tsx              [DONE - 70 lines]
└── ToolComponents.tsx       [DONE - 180 lines]
```

**Total Code**: ~5,500 lines (multiplier done, 13 tools to build)

---

## Data Integration (Phase 5)

### US Economic Data (2000-2025)

Create `src/data/economicData.ts`:

```typescript
export const usEconomicData = [
  { year: 2000, unemployment: 4.0, inflation: 3.4, gdpGrowth: 4.1, rate: 6.5 },
  { year: 2001, unemployment: 4.7, inflation: 2.8, gdpGrowth: 1.0, rate: 3.9 },
  // ... through 2025
]

// Categorize by economic regime
export const recessions = [
  { start: 2007, end: 2009, name: '2008 Financial Crisis' },
  { start: 2020, end: 2020, name: 'COVID Recession' },
]
```

### Data Overlay Toggle
```typescript
// In each tool:
const { showDataOverlay } = useAppStore()

{showDataOverlay && (
  <Line
    dataKey="actualInflation"
    stroke="#ef4444"
    strokeDasharray="5 5"
    name="Actual Data"
  />
)}
```

---

## Deployment Options

### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
cd /Users/denimpatel/Desktop/macro-economics/interactive-website
vercel
# Follow prompts, connects to GitHub
# Auto-deploys on push to main
```

### Option 2: Netlify
```bash
npm run build
# Drag `dist/` folder to Netlify drop zone
# OR: `netlify deploy --prod`
```

### Option 3: GitHub Pages
```bash
# Add to package.json:
"homepage": "https://username.github.io/macro-interactive",
"deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

---

## Testing Checklist

Before marking each tool complete:

- [ ] All sliders respond (0 lag)
- [ ] Charts update in real-time
- [ ] Stat boxes display correct calculations
- [ ] Comparison mode works (scenario A vs B)
- [ ] Export buttons functional (JSON, CSV)
- [ ] Mobile responsive (tablet view)
- [ ] Accessibility: keyboard navigation works
- [ ] No console errors

---

## Next Immediate Actions

1. **Test current setup**:
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:5173
   # Verify Multiplier Simulator works
   ```

2. **Build IS-LM Explorer next**:
   - Most versatile tool
   - Core to lectures 4-12
   - Will use in other tools later

3. **Add real data**:
   - Creates immediate credibility
   - Historical overlays make theory tangible

---

## Performance Tips

- Use `useMemo` for expensive calculations
- Recharts: Limit data points to <1000 for smooth animations
- Lazy load tools (already implemented in App.tsx)
- Consider virtualization if tables >500 rows

---

**Status**: 🟢 Ready to deploy  
**Next Phase**: Implement Tools 2-15 (estimated 4-6 weeks at 1-2 tools/week)
**Questions**: Refer to Multiplier tool as reference implementation
