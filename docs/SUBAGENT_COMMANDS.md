# 🤖 Subagent Batch Commands

Copy-paste these commands to launch parallel subagents for rapid tool development.

---

## 🟦 Batch 1: Intermediate + Advanced Tools (4 tools - ~15 min)

### Command 1: IS-LM-PC Dynamic Adjustment
```
Build IS-LM-PC Dynamic Adjustment tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/IsLmPcDynamics.tsx

CORE REQUIREMENTS:
1. Show short-run equilibrium (IS-LM intersection)
2. Apply shock: User selects demand or supply shock
3. Watch PC curve shift based on inflation expectations
4. Animated transition to medium-run equilibrium
5. Display final output, interest rate, inflation, unemployment

FEATURES:
- Scenario selector: Positive/Negative demand shock, Positive/Negative supply shock
- Initial equilibrium marked with blue dot
- Shock animation (IS/LM curves shift)
- PC curve updates as expectations adjust
- Final equilibrium marked with red dot
- Path line shows transition
- Key metrics displayed: Y, r, π, u

PARAMETERS:
- Shock size: -20 to +20 (% shift)
- Inflation expectations adjustment speed: 0.1 to 0.9
- MPC: 0.6 to 0.95
- Money supply: 100 to 200
- Government spending: 50 to 150

VISUALIZATIONS:
- ComposedChart showing initial IS-LM, shifted IS-LM, and PC curve
- StatBox for initial vs final equilibrium
- Animated path showing adjustment process

COMPARISON MODE:
- Compare demand shock vs supply shock outcomes
- Show why supply shocks cause stagflation, demand shocks cause normal adjustment

CODE PATTERN: Follow IsLmExplorer.tsx and PhillipsCurve.tsx
Return complete, working code only. ~480 lines.
```

### Command 2: Asset Pricing Calculator (EPDV)
```
Build Asset Pricing Calculator tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/AssetPricing.tsx

CORE REQUIREMENTS:
1. Calculate EPDV (Discounted Expected Present Value)
2. Bond pricing: PV = Coupon/(1+r)^1 + Coupon/(1+r)^2 + ... + (Coupon+Principal)/(1+r)^n
3. Stock pricing: PV = Dividend×(1+g) / (r - g) [Gordon growth model]
4. Compare market price vs calculated PV
5. Show impact of interest rate changes

FEATURES:
- Two modes: Bond Pricing and Stock Pricing
- Bond sliders:
  - Coupon rate: 0.5% to 10%
  - Years to maturity: 1 to 30
  - Par value: $100 (fixed)
  - Discount rate: -2% to 10%
- Stock sliders:
  - Annual dividend: $0 to $5
  - Growth rate: 0% to 8%
  - Required return: 2% to 15%
- Comparison mode: Show how rate changes affect PV
- Timeline showing cash flows for bonds

VISUALIZATIONS:
- BarChart: Calculated PV vs Market Price
- AreaChart: Bond cash flows over time with PV contribution
- LineChart: How PV changes as discount rate varies

EDUCATIONAL CONTENT:
- EPDV formula explanation
- Why high interest rates reduce PV
- Duration concept for bonds
- Equity risk premium concept

CODE PATTERN: Follow MultiplicerSimulator.tsx
Return complete, working code only. ~400 lines.
```

### Command 3: Mundell-Fleming Policy Lab
```
Build Mundell-Fleming Policy Lab tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/MundellFleming.tsx

CORE REQUIREMENTS:
1. Open economy IS-LM model with exchange rate
2. Show two exchange rate regimes: Fixed peg and Floating
3. Demonstrate policy effectiveness differs by regime
4. Real-time equilibrium calculation

FEATURES:
- Regime selector: Fixed exchange rate vs Floating
- Base parameters: G, T, M, P (same as IS-LM)
- New parameters:
  - Foreign interest rate: 1% to 6%
  - Capital mobility: 0 (low) to 1 (high)
  - Exchange rate (floating regime): 0.8 to 1.2
- Shock buttons: Increase G, Increase M, Increase i_foreign
- Show capital flow response (hot money)

REGIME DIFFERENCES:
- Fixed Peg:
  - Monetary policy ineffective (reserves adjust to maintain peg)
  - Fiscal policy super-effective (capital inflows offset consumption)
  - Capital inflows shown as automatic LM shift
- Floating:
  - Monetary policy effective (depreciation increases exports)
  - Fiscal policy weak (appreciation reduces exports)
  - Show exchange rate changes in response to policy

VISUALIZATIONS:
- ComposedChart showing IS, LM, and capital flow lines
- Stat boxes: Y, r, exchange rate, capital inflow/outflow
- Animated curves showing regime-specific responses

COMPARISON MODE:
- Compare fixed vs floating response to same shock
- Show capital flows in each regime

CODE PATTERN: Follow IsLmExplorer.tsx
Return complete, working code only. ~520 lines.
```

### Command 4: Growth Accounting Tool
```
Build Growth Accounting Tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/GrowthAccounting.tsx

CORE REQUIREMENTS:
1. Decompose output growth: ΔY = αΔK + (1-α)ΔL + ΔA
2. Calculate Solow residual (TFP)
3. Show contribution breakdown
4. Compare countries

FEATURES:
- Manual input mode:
  - Output growth: 0% to 8%
  - Capital growth: 0% to 10%
  - Labor growth: 0% to 4%
  - Capital share α: 0.2 to 0.4
  - Solver calculates: TFP residual
- Preset country scenarios:
  - USA (α=0.35, ΔY≈2%, ΔK≈3%, ΔL≈0.5%)
  - China (α=0.35, ΔY≈6%, ΔK≈8%, ΔL≈0.2%)
  - Japan (α=0.35, ΔY≈1%, ΔK≈1%, ΔL≈-0.2%)
  - Germany (α=0.35, ΔY≈1.5%, ΔK≈2%, ΔL≈0%)
  - India (α=0.3, ΔY≈6%, ΔK≈7%, ΔL≈1.8%)

VISUALIZATIONS:
- BarChart: Stacked contributions (Capital in red, Labor in blue, TFP in green)
- Stat boxes: Total growth rate and TFP growth rate
- Table: Full decomposition breakdown
- LineChart: Growth evolution over 30 years (if historical data provided)

COMPARISON MODE:
- Compare decomposition across 2 countries
- Show why USA has slower growth (low TFP) vs China (high capital)

EDUCATIONAL CONTENT:
- TFP importance for long-run competitiveness
- Why capital investment alone insufficient
- Diminishing returns to capital

CODE PATTERN: Follow MultiplicerSimulator.tsx
Return complete, working code only. ~380 lines.
```

---

## 🟦 Batch 2: Case Study Tools (4 tools - ~15 min)

### Command 5: 2008 Financial Crisis
```
Build 2008 Financial Crisis tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/Crisis2008.tsx

CORE REQUIREMENTS:
1. Interactive timeline slider: Aug 2007 to Dec 2008
2. Show multiple economic indicators updating in parallel
3. Annotate key events (Bear Stearns, Lehman, TARP)
4. Show IS-LM shifts and Fed response

FEATURES:
- Timeline slider: 0 (Aug 2007) to 16 (Dec 2008) months
- Multiple overlaid metrics:
  - TED spread (0.5% baseline → peaks 4.6%)
  - Credit spreads (corporate bonds)
  - IS shift indicator (-10 to 0 units)
  - Fed funds rate (5.25% → 0.25%)
  - Unemployment (4.7% → 7.3%)
- Event annotations:
  - Aug 2007: Credit crunch begins
  - Sep 2008: Bear Stearns rescue
  - Sep 2008: Lehman bankruptcy
  - Oct 2008: TARP authorization
  - Dec 2008: Fed cuts to zero
- Policy response shown: Fed cuts rates, then hits zero lower bound

VISUALIZATIONS:
- ComposedChart: TED spread (line) + Fed rate (bar) over time
- Line chart: Unemployment rising
- InfoBox explaining each phase

EDUCATIONAL CONTENT:
- Credit crunch amplifies recession
- Why monetary policy became ineffective (ZLB)
- Financial accelerator mechanism
- Why fiscal stimulus needed when rates at zero

CODE PATTERN: Follow IsLmExplorer.tsx
Return complete, working code only. ~460 lines.
```

### Command 6: COVID Shock 2020-2023
```
Build COVID Shock 2020-2023 tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/CrisisCovid.tsx

CORE REQUIREMENTS:
1. Show two distinct phases: Supply shock (2020-2021) + Demand recovery + Inflation (2021-2023)
2. Display Phillips Curve shifting
3. Show policy response (fiscal + monetary)
4. Economic outcomes: Unemployment, inflation, growth

FEATURES:
- Timeline slider: Q1 2020 to Q4 2023 (16 quarters)
- Three panels updating together:
  - Panel 1: Unemployment (10% peak Q2 2020 → 3.7% Q4 2023)
  - Panel 2: Inflation (1% 2020 → 4% 2021-2022 → 3% 2023)
  - Panel 3: Policy response (Fiscal stimulus + Fed QE 2020-2021, Rate hikes 2022-2023)
- Phillips curve overlay: Show how expectations adjusted
- Scenario comparison: What if no fiscal stimulus vs actual response

PHASES:
- Phase 1 (Q1-Q2 2020): Supply shock, demand collapse
  - Unemployment spikes, inflation stays low
  - Phillips curve shifts right (stagflation fears)
  - Fed cuts rates to zero, launches QE
  - Fiscal stimulus ($3T)
- Phase 2 (Q3-Q4 2020 to Q1 2021): Rapid recovery
  - Demand bounces back, unemployment falls
  - But supply lags → bottlenecks → inflation rises
  - Stimulus continues
- Phase 3 (Q2-Q4 2021): Inflation spirals
  - Inflation reaches 7%+
  - Fed realizes "transitory" was wrong
  - Phillips curve shifts up (expectations rising)
- Phase 4 (2022-2023): Disinflation
  - Fed hikes rates 0% → 5.33%
  - Inflation falls but unemployment rises
  - Wage-price spiral contained

VISUALIZATIONS:
- ComposedChart: Multiple series (unemployment, inflation, Fed rate)
- ReferenceLine: Natural rate of unemployment and target inflation
- LineChart: Phillips curve positions at different dates

COMPARISON MODE:
- Compare actual response to alternative (e.g., no stimulus)
- Show different inflation outcomes

CODE PATTERN: Follow Crisis2008.tsx
Return complete, working code only. ~450 lines.
```

### Command 7: SVB Banking Crisis & Fisher Equation
```
Build SVB Banking Crisis tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/CrisisSvb.tsx

CORE REQUIREMENTS:
1. Show why rapid rate hikes broke SVB
2. Demonstrate Fisher Equation: r = i - π
3. Illustrate wealth effect: Rising rates → Asset losses → Bank insolvency
4. Interactive scenario: Adjust rates and see SVB's P&L

FEATURES:
- Timeline: 2020 to 2023 (real data from Fed)
- Two curves on chart:
  - Nominal rate (Federal funds rate): 0.25% (2020-2021) → 5.33% (2023)
  - Inflation: 1% (2020) → 7% (2022) → 3% (2023)
- Calculator shows real rate over time
- SVB scenario simulation:
  - Holdings: $91B bonds with 1.6% yield (bought in 2019 at near-zero rates)
  - When rates rise to 5%, bond values crash (longer duration bonds more sensitive)
  - Deposit flight (customers pull deposits seeking higher yields)
  - Forced asset sales at losses
- Interactive sliders (hypothetical scenarios):
  - Set nominal rate: -2% to 8%
  - Set inflation: -2% to 8%
  - Calculate real rate and show impact on bond portfolio
- Stat boxes: Current real rate, bond portfolio loss, deposit outflow scenario

VISUALIZATIONS:
- LineChart: Nominal rate + inflation → real rate derived
- AreaChart: Bond portfolio value declining as rates rise
- BarChart: Fisher decomposition (nominal = real + inflation)
- Stat boxes: Real rate, bond loss, risk level

EDUCATIONAL CONTENT:
- Why near-zero rates created bond risk
- Duration risk concept (longer bonds lose more when rates rise)
- Why rate hikes are dangerous for financial system
- Difference between nominal and real rates
- Wealth effect on bank insolvency

COMPARISON MODE:
- Compare scenarios: Gradual rate rise vs fast hike
- Show why speed of hikes mattered

CODE PATTERN: Follow RealInterestRate.tsx
Return complete, working code only. ~430 lines.
```

### Command 8: Speculative Attack on Fixed Peg
```
Build Speculative Attack tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/SpeculativeAttack.tsx

CORE REQUIREMENTS:
1. Simulate currency crisis on fixed exchange rate peg
2. Show foreign reserves depleting as central bank defends
3. Demonstrate either peg breaks or interest rates spike to stop attack
4. Historical crisis context

FEATURES:
- Fixed peg: 1 domestic = X foreign currency (e.g., 1 peso = 1 dollar)
- Initial conditions:
  - Foreign reserves: $10B
  - Money supply: $9B
  - Interest rate differential: 0% (domestic = foreign rate)
- Attack simulation:
  - Speculators attack slider: 0 (no attack) to 100 (massive attack)
  - Attack purchases domestic currency, sells foreign currency
  - Central bank loses reserves defending peg
  - Eventually: Either (A) Reserves depleted → peg breaks, OR (B) Interest rates rise → attack stops
- Interest rate response:
  - When attack starts, central bank can raise rates to defend peg
  - Higher rates attract capital inflows to help defend
  - But higher rates hurt domestic economy
  
MECHANICS:
- User slides "Attack intensity" from 0 to 100
- Chart shows:
  - Foreign reserves (declining bar)
  - Interest rate (rising to defend peg)
  - Exchange rate (fixed at peg, then breaks)
- Stat boxes:
  - Time to peg break if defending (if attack continues)
  - Interest rate required to stop attack
  - Reserves remaining
  - Capital flow pressure

VISUALIZATIONS:
- AreaChart: Foreign reserves declining
- LineChart: Interest rates rising
- ComposedChart: Multiple series over attack timeline
- Stat boxes: Key metrics

HISTORICAL SCENARIOS:
- 1997 Asian crisis (Thai baht)
- 1992 ERM crisis (pound)
- Multiple pressure scenarios showing why pegs eventually break

EDUCATIONAL CONTENT:
- Impossible trinity: Free capital flows + fixed exchange rate + independent monetary policy (pick 2)
- Why interest rate defense has limits
- Moral hazard in defending pegs
- When speculative attacks are self-fulfilling (expectations matter)

CODE PATTERN: Follow SolowSimulator.tsx
Return complete, working code only. ~450 lines.
```

---

## 📋 Files That Will Be Created

```
✅ Already Exist (from previous implementation):
- src/tools/MultiplicerSimulator.tsx
- src/tools/IsLmExplorer.tsx
- src/tools/PhillipsCurve.tsx
- src/tools/RealInterestRate.tsx
- src/tools/LaborMarket.tsx
- src/tools/SolowSimulator.tsx

⏳ Will Be Created by Batch 1:
- src/tools/IsLmPcDynamics.tsx
- src/tools/AssetPricing.tsx
- src/tools/MundellFleming.tsx
- src/tools/GrowthAccounting.tsx

⏳ Will Be Created by Batch 2:
- src/tools/Crisis2008.tsx
- src/tools/CrisisCovid.tsx
- src/tools/CrisisSvb.tsx
- src/tools/SpeculativeAttack.tsx
```

---

## ✅ After Subagent Returns Code

For each tool file:
1. Copy the code returned by subagent
2. Paste into the corresponding `.tsx` file
3. Save the file
4. Dev server auto-reloads (HMR)
5. New tool appears in sidebar
6. Click to test

**No manual registration needed** - all tools are already registered in `store.ts` and `App.tsx`!

---

## 🚀 Quick Start

**To launch Batch 1**, copy each command above to subagent separately (or use parallel mode if available).

**Expected Total Time**:
- Batch 1: ~15 minutes (4 tools in parallel)
- Batch 2: ~15 minutes (4 tools in parallel)
- **Total: 30 minutes** to complete all 15 tools!

---

**Status After Both Batches**: 15/15 tools complete (100%) ✅
