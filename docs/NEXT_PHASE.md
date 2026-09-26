# 🚀 Next Phase: Building Remaining 10 Tools

**Current Status**: 5/15 tools complete (33%) ✅  
**Dev Server**: Running at http://localhost:5173 ✅  
**Next Goal**: Implement remaining 10 tools

---

## 📋 Tools Pipeline (Recommended Build Order)

### Phase 1: Intermediate Tools (2 tools)
These build on existing tools and are relatively straightforward:

**1. IS-LM-PC Dynamic Adjustment** (Intermediate)
- **Description**: Watch economy move from short-run to medium-run equilibrium after demand shocks
- **Key Features**:
  - Start from IS-LM equilibrium
  - Introduce demand/supply shock
  - PC curve shifts as expectations adjust
  - Animated movement to new equilibrium
  - Show price level changes and time path
- **Dependencies**: IS-LM logic + Phillips Curve logic + Animation
- **Estimated Lines**: 450-500

**2. Asset Pricing Calculator (EPDV)** (Advanced)
- **Description**: Calculate present value of future cash flows for bonds and stocks
- **Key Features**:
  - Discounted expected present value (EPDV) formula
  - Bond pricing with maturity and coupon
  - Stock pricing with dividend and growth rate
  - Comparison: Market price vs calculated PV
  - Scenario analysis (changing discount rates)
- **Dependencies**: None (standalone)
- **Estimated Lines**: 380-420

---

### Phase 2: Open Economy Tools (1 tool)

**3. Mundell-Fleming Policy Lab** (Advanced)
- **Description**: Compare monetary policy effectiveness under fixed vs floating exchange rates
- **Key Features**:
  - IS curve (same as IS-LM)
  - LM curve + exchange rate feedback
  - Fixed peg scenario: Monetary policy ineffective, fiscal policy super-effective
  - Floating rate scenario: Monetary policy effective, fiscal policy weak
  - Real-time diagrams showing capital flow effects
- **Dependencies**: IS-LM Explorer logic
- **Estimated Lines**: 500-550

---

### Phase 3: Advanced Analysis Tools (1 tool)

**4. Growth Accounting Tool** (Advanced)
- **Description**: Decompose country growth into capital, labor, and TFP contributions
- **Key Features**:
  - Cobb-Douglas decomposition: ΔY = αΔK + (1-α)ΔL + ΔA
  - Input sliders: Capital growth (0-8%), Labor growth (0-4%), Output growth observed
  - Solver for TFP residual
  - Historical examples: US vs China vs Japan
  - Chart: Show contribution breakdown by component
- **Dependencies**: None (computation-focused)
- **Estimated Lines**: 350-400

---

### Phase 4: Case Studies (4 tools)

**5. 2008 Financial Crisis Timeline** (Case Study)
- **Description**: Interactive timeline showing credit crisis evolution
- **Key Features**:
  - Timeline slider: Aug 2007 → Dec 2008
  - Multiple overlaid metrics:
    - Credit spreads (TED spread)
    - IS-LM shifts (demand collapse)
    - Unemployment rising
    - Fed response (interest rate cuts)
  - Annotated events (Bear Stearns, Lehman, TARP)
  - ComposedChart showing multiple series
- **Dependencies**: IS-LM logic, economic data
- **Estimated Lines**: 450-500

**6. COVID Shock 2020-2023** (Case Study)
- **Description**: Supply vs demand shocks and policy response
- **Key Features**:
  - Timeline: Q1 2020 → Q4 2023
  - Two phases: Supply shock (2020-2021) + Demand recovery + inflation (2021-2023)
  - Show Phillips Curve shifts
  - Policy comparison: Fiscal (stimulus) vs Monetary (QE, rate hikes)
  - Unemployment, inflation, growth paths
- **Dependencies**: Phillips Curve logic, economic data
- **Estimated Lines**: 420-480

**7. SVB Banking Crisis & Fisher Equation** (Case Study)
- **Description**: Why rate hikes broke SVB and the Fisher Equation mechanics
- **Key Features**:
  - Interactive timeline: 2020-2023
  - Show: Rates near zero (2020-2021) → rates rise (2022-2023)
  - SVB losses grow as real rates become positive
  - Wealth effect: Asset prices fall → bank losses
  - Interactively adjust rates and see SVB's P&L
  - Fisher Equation: How negative real rates -> positive real rates
- **Dependencies**: Real Interest Rate logic, economic data
- **Estimated Lines**: 400-450

**8. Speculative Attack on Fixed Peg** (Case Study)
- **Description**: Mechanics of currency crisis when peg is attacked
- **Key Features**:
  - Fixed exchange rate peg
  - Foreign reserves bar (depletes as central bank defends)
  - Speculators attack (market pressure to devalue)
  - Sliders: Interest rate differential, attack severity
  - Show: Either reserves drain → peg breaks, OR rates spike to stop attack
  - Historical examples: 1997 Asian crisis, 1992 ERM crisis
- **Dependencies**: None (simulation-focused)
- **Estimated Lines**: 420-480

---

## 🛠️ Recommended Implementation Strategy

### Option A: Serial Implementation (One at a time)
- **Time per tool**: ~30-45 minutes
- **Total time**: 5-7 hours for 10 tools
- **Advantage**: Each tool tested thoroughly before next
- **Disadvantage**: Slower overall progress

### Option B: Parallel Subagents (Recommended) ✨
- **Launch 5 subagents simultaneously** for 5 tools
- **Time per batch**: ~15 minutes (parallel)
- **Total time**: 2 batches × 15 min = 30 minutes
- **Advantage**: 10x faster development
- **Disadvantage**: Need to verify each tool after

### Option C: Mixed Strategy (Best of Both)
- **Batch 1**: Launch 4 subagents for intermediate/advanced tools
  - IS-LM-PC Dynamic
  - Asset Pricing
  - Mundell-Fleming
  - Growth Accounting
- **Batch 2**: Launch 4 subagents for crisis case studies
  - 2008 Financial Crisis
  - COVID Shock
  - SVB Banking Crisis
  - Speculative Attack
- **Time**: 2 batches × 15 min = 30 minutes total

---

## 📝 How to Submit to Subagent

**Template for each tool**:

```
Build [Tool Name] tool: /Users/denimpatel/Desktop/macro-economics/interactive-website/src/tools/[FileName].tsx

REQUIREMENTS:
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]
...

PARAMETERS:
- [Slider 1]: [min-max]
- [Slider 2]: [min-max]
...

VISUALIZATIONS:
- [Chart Type 1]: [what it shows]
- [Chart Type 2]: [what it shows]

EDUCATIONAL CONTENT:
- [Insight 1]
- [Insight 2]

COMPARISON MODE: [How scenario comparison works]

Code pattern: Follow [Similar Tool].tsx
Return complete, working code only. ~[estimated lines] lines.
```

---

## ✅ Integration Checklist (After Subagent Returns Code)

For each new tool file created:

- [ ] File created with complete code: `src/tools/[FileName].tsx`
- [ ] Tool is already imported in `src/App.tsx` (lazy-loaded)
- [ ] Tool is already registered in `src/store.ts`
- [ ] Sidebar automatically shows it (no changes needed)
- [ ] Open http://localhost:5173 in browser
- [ ] Click tool in sidebar
- [ ] Verify sliders work and chart updates
- [ ] Verify comparison mode works
- [ ] Check educational text displays
- [ ] Test with extreme values (min/max)

---

## 🎯 Files to Know

### Already Set Up (No Changes Needed)
- `src/store.ts` - All 15 tools registered
- `src/App.tsx` - All tools lazy-loaded
- `src/components/Sidebar.tsx` - Auto-shows registered tools
- `src/components/ToolComponents.tsx` - 6 reusable components ready

### Reference Implementations
- `src/tools/MultiplicerSimulator.tsx` - Simple tool (140 lines)
- `src/tools/IsLmExplorer.tsx` - Complex tool (486 lines)
- `src/tools/SolowSimulator.tsx` - Advanced tool (416 lines)

### Utilities Available
- `src/utils/calculations.ts` - 12 pre-coded formulas
- `src/utils/sharing.ts` - Export/import scenarios

---

## 🚀 Ready to Launch?

**Current Command Option**:
```bash
# Start dev server if not running
cd /Users/denimpatel/Desktop/macro-economics/interactive-website
npm run dev

# Then use subagents to build remaining tools
```

**Your Input Needed**:
1. Which batch of tools to build first?
2. Parallel (all at once) or serial (one at a time)?
3. Any specific priorities?

---

## 📊 Full Project Status

| Phase | Status | Tools | Completion |
|-------|--------|-------|------------|
| Infrastructure | ✅ Complete | N/A | 100% |
| Beginner Tools | ✅ Complete | 2/2 | 100% |
| Intermediate Tools | 🟡 In Progress | 3/4 | 75% |
| Advanced Tools | ⏳ Pending | 1/4 | 25% |
| Case Studies | ⏳ Pending | 0/4 | 0% |
| Data Integration | ⏳ Pending | N/A | 0% |
| Production Deploy | ⏳ Pending | N/A | 0% |

---

**Next Step**: Decide on implementation strategy and confirm which tools to build next.
