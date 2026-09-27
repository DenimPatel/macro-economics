# Lecture 6: The IS-LM Model (Part II) - Applications and Policy Analysis

## Overview
This lecture applies the IS-LM framework to analyze various policy combinations and real-world scenarios, with special focus on the COVID-19 policy response. We examine how monetary and fiscal policies work together (or in conflict), explore the zero lower bound problem, and discuss unconventional monetary policy.

---

## 1. IS-LM Model Review

### The IS Curve (Goods Market Equilibrium)
**Key Equation**:
$$Y = C(Y - T) + I(Y, i) + G$$

**Properties**:
- **Downward sloping** in $(Y, i)$ space
- **Steeper than Lecture 3** because investment now depends on $Y$
  - Slope reflects: MPC + MPI (marginal propensity to consume + invest)
- **Interest rate is a parameter** of the ZZ curve

**Derivation Logic**:
1. Fix interest rate at $i_0$ → Find equilibrium output $Y_0$ using ZZ diagram
2. Raise interest rate to $i_1$ → Investment falls → ZZ shifts down → Output falls to $Y_1$
3. Repeat to trace entire IS curve

**Key Mechanism**:
- $i \uparrow$ → $I \downarrow$ (investment falls)
- Aggregate demand shifts down
- **Multiplier effect**: Output falls by MORE than initial investment decline
- Final decline in $Y$ is amplified through consumption and investment feedback

### The Modern LM Curve (Financial Market Equilibrium)

**Traditional Formulation**:
$$\frac{M}{P} = Y \cdot L(i)$$
- Would give upward-sloping LM if central bank targets $M$

**Modern Practice**: Central banks target interest rate directly

$$\text{Modern LM: } i = \bar{i}$$

- **Horizontal** at the target rate
- Central bank adjusts $M$ to accommodate any output level
- Result: LM is a **flat line** at the Fed's chosen rate

**Why Modern LM is Simpler**:
- Old days: Changes in $M$ or money demand would shift LM
- Now: Only Fed's policy decision shifts LM
- Fed announces rate target, then supplies whatever $M$ is needed

---

## 2. Movements Along vs. Shifts: Critical Distinction

### Movement Along the IS Curve
- **Cause**: Interest rate changes (only)
- **What's held constant**: Taxes, government spending, consumer confidence, autonomous consumption
- **Interpretation**: Tracing different equilibrium points on the **same** IS
- **Example**: Fed raises $i$ → move up along IS → lower $Y$

### Shift of the IS Curve
- **Cause**: Change in any **exogenous** demand factor except interest rate
- **What's held constant**: The structural parameters of the economy
- **Interpretation**: Moving to a **different** IS curve
- **Examples**:
  - $T \uparrow$ → IS shifts **left** (contractionary)
  - $G \uparrow$ → IS shifts **right** (expansionary)
  - Consumer confidence $\downarrow$ → IS shifts **left**
  - Wealth $\downarrow$ (affects $c_0$) → IS shifts **left**

**How to Verify**: Go back to the ZZ diagram
- For a **given** interest rate, does aggregate demand change?
- If yes → IS shifts
- Example: $T \uparrow$ → Disposable income $\downarrow$ → Consumption $\downarrow$ → ZZ shifts down → For same $i$, equilibrium $Y$ is lower → IS shifts left

---

## 3. Fiscal Policy in IS-LM

### Contractionary Fiscal Policy ($T \uparrow$ or $G \downarrow$)

**Which Curve Moves?** IS (goods market policy)

**Direction**: IS shifts **left**

**Mechanism**:
1. Higher taxes → Lower disposable income → Consumption falls
   - OR: Lower $G$ → Aggregate demand falls directly
2. Aggregate demand curve (ZZ) shifts down
3. Multiplier effect amplifies the decline
4. New IS curve to the left of original

**Equilibrium Impact** (assuming Fed doesn't respond):
- Output **falls**: $Y' < Y$
- Interest rate **unchanged**: $i' = i = \bar{i}$ (Fed maintains target)

**Non-Policy Equivalents**:
- Consumer confidence decline
- Wealth shock (negative wealth effect)
- Business investment sentiment decline
- These shift IS left just like contractionary fiscal policy

### Expansionary Fiscal Policy ($T \downarrow$ or $G \uparrow$)

**Direction**: IS shifts **right**

**Equilibrium Impact**:
- Output **rises**: $Y' > Y$
- Interest rate unchanged (if Fed accommodates)

**Use Cases**:
- Recessions (stimulate demand)
- Can target specific groups (unlike monetary policy)
- COVID stimulus: Large transfers, especially to low-income households

---

## 4. Monetary Policy in IS-LM

### Expansionary Monetary Policy (Rate Cut: $i \downarrow$)

**Which Curve Moves?** LM (financial market policy)

**Direction**: LM shifts **down**

**Why Is It Expansionary?**

**Step 1**: Fed cuts interest rate from $i_0$ to $i_1$
- Suppose output stayed at $Y_0$
- Is there equilibrium in goods market? **NO**
- **Problem**: At lower $i$, investment increases → Aggregate demand > Output
- **Excess demand** for goods

**Step 2**: Output must rise to restore equilibrium
- Lower $i$ → Higher $I$ → Higher aggregate demand
- Multiplier kicks in: Consumption also rises with income
- New equilibrium: Higher output $Y_1 > Y_0$

**Implementation**: Open Market Operations
1. Fed buys bonds from banks → Injects money into system
2. Initially: Money supply $\uparrow$ → Interest rate $\downarrow$ (overnight)
3. Communication: Fed announces target rate (e.g., "50 basis points cut")
4. **But Fed's job isn't done**: As output expands, money demand increases
5. Fed must **continue** providing more money to maintain the lower rate
6. Final money supply increase is **larger** than initial injection

**Key Insight**: Modern LM means Fed accommodates increased money demand as economy expands

### Contractionary Monetary Policy (Rate Hike: $i \uparrow$)

**Direction**: LM shifts **up**

**Effect**: Output falls

**Current Example (2022-2023)**:
- Fed raised rates aggressively to combat inflation
- Cooling overheated economy

---

## 5. Policy Combinations and Scenarios

### Scenario 1: "All In" - Both Policies Expansionary

**Policy Mix**:
- Expansionary fiscal policy: IS shifts **right**
- Expansionary monetary policy: LM shifts **down**

**Combined Effect**:
- **Large increase in output**: Both policies reinforce each other
- Maximum stimulative impact

**When Used?**:
- **Deep recessions** (most important use case)
  - Monetary policy first (faster, overnight decision)
  - Add fiscal when monetary alone isn't enough
- **Advantages of using both**:
  1. Fiscal can **target** specific groups (monetary is "blunt")
     - Example: COVID transfers to service sector workers who lost jobs
  2. Fiscal can address structural issues monetary policy cannot
  3. Combined firepower for severe crises

**Historical Example**: COVID-19 recession (discussed below)

---

### Scenario 2: The Zero Lower Bound and Liquidity Trap

#### The Problem

**Zero Lower Bound (ZLB)**:
- Nominal interest rates cannot go (much) below zero
- When $i = 0$, conventional monetary policy becomes ineffective

**Why ZLB Binds**:
- At $i = 0$, no opportunity cost of holding money vs. bonds
- People indifferent between money and bonds
- Central bank can inject more money, but **cannot push rate lower**
- **Liquidity Trap**: Economy is "trapped" - more liquidity doesn't stimulate

**Graphical Representation**:
- Money demand becomes **perfectly elastic** (horizontal) at $i = 0$
- No matter how much money central bank injects, rate stays at zero

#### Historical Context: Japan

**Japan's Lost Decades**:
- Financial bubble burst: Late 1980s / Early 1990s
- Interest rates hit zero and stayed there for **decades**
- Chronic recessions with no conventional monetary policy tool available
- **Solution**: Massive fiscal expansions (since monetary policy exhausted)

#### COVID-19 and the Zero Lower Bound

**Timeline**:
- COVID shock hits: Early 2020
- Fed's immediate response: Cut rates **aggressively to zero**
- US stuck at ZLB during entire COVID period
- No more conventional monetary policy available

**Implication**: Heavy reliance on fiscal policy (shown below)

---

### Scenario 3: Unconventional Monetary Policy (QE)

#### Background

**Problem**: What can central banks do at the zero lower bound?

**Solution**: Unconventional monetary policy
- **Not** standard short-term interest rate policy
- Interventions in other financial markets

#### What Is Quantitative Easing (QE)?

**Definition**: Central bank purchases of longer-term and riskier assets

**Standard Monetary Policy** (Conventional):
- Fed buys/sells **short-term Treasury bonds**
- Affects **overnight federal funds rate**

**Quantitative Easing** (Unconventional):
Central bank expands beyond short-term Treasuries to:
1. **Long-term Treasury bonds**
   - Reduces term premium (long-term vs. short-term rate spread)
2. **Mortgage-Backed Securities (MBS)**
   - Fannie Mae and Freddie Mac securities
   - Supports housing market
3. **Corporate bonds**
   - Investment-grade corporate debt
   - Directly lowers business borrowing costs
4. **"Fallen Angels"**
   - Companies that were investment-grade before crisis but downgraded
   - Examples: Airlines, cruises, hotels (during COVID)

**Why It Works**:
- Multiple interest rates in economy (not just one like in our model)
- Risk spreads between different assets
- Central bank can target these spreads even when short-term rate is zero
- Operates "like" monetary policy but through different channels

#### Balance Sheet Expansion

**Traditional Monetary Policy**:
```
Before: Assets: Bonds    After: Assets: More Bonds
        Liabilities: Money        Liabilities: More Money
```
- Balance sheet expands, but modestly

**Quantitative Easing**:
- **Massive** balance sheet expansion
- Fed buys huge quantities of diverse assets
- Both assets and liabilities (money) expand dramatically

**Fed's Balance Sheet Evolution**:
- **Pre-2008**: ~$1 trillion (stable, unremarkable)
- **Global Financial Crisis (2008-2009)**:
  - First time US hit ZLB
  - Massive expansion via QE
- **Recovery (2010-2019)**:
  - Continued QE during slow recovery
  - Financial sector was compromised, took years to heal
  - Then began unwinding (reducing balance sheet)
- **COVID-19 (2020)**:
  - Interest rates to zero immediately
  - **Enormous** QE: Balance sheet to ~$9 trillion
  - Largest expansion in Fed history
- **Current (2022-2023)**:
  - Unwinding QE to fight inflation
  - Gradually reducing balance sheet

**International Context**:
- European Central Bank (ECB): Similar pattern
- Bank of Japan: Even more extreme, started earlier (1990s)
  - Japan has been doing this for decades
  - Balance sheet looks like continuous expansion

---

### Scenario 4: Fiscal Consolidation with Monetary Accommodation

**Policy Mix**:
- Contractionary fiscal policy: IS shifts **left** (reduce deficit)
- Expansionary monetary policy: LM shifts **down** (offset recession risk)

**Net Effect**:
- Output roughly **unchanged** (policies offset each other)
- Government deficit **improves** (fiscal consolidation achieved)
- Interest rate **lower**

**When Used?**:
- **Fiscal deficit is unsustainable** (debt accumulation problematic)
- **Economy is NOT overheating** (no inflation problem)
- Government wants to "fix fiscal accounts" without causing recession

**Mechanism**:
1. Treasury announces fiscal contraction (higher $T$ or lower $G$)
2. Central bank recognizes this would cause recession
3. Central bank has mandate for price stability and output near potential
4. Central bank cuts rates to offset contractionary fiscal impact
5. (Often implicit coordination, not explicit)

**Political Economy**:
- Government may complain: "You're fighting our policy!"
- But that's the point of **central bank independence**
- Central bank must offset inappropriate fiscal stimulus/contraction

**Counterexample - Current US (2022-2023)**:
- If US announced 5% fiscal contraction today
- Fed would likely **not** cut rates
- Why? Economy is **overheating**
- Fiscal contraction would be welcome to cool economy

---

### Scenario 5: Fiscal Expansion with Monetary Tightening (Conflict)

**Policy Mix**:
- Expansionary fiscal policy: IS shifts **right**
- Contractionary monetary policy: LM shifts **up**

**Net Effect**:
- Output impact **ambiguous** (depends on relative magnitudes)
- Interest rate **rises**
- Government likely **unhappy** with central bank

**When This Occurs**:
- **Uncoordinated policies** (conflict between Treasury and Fed)
- Government spends, but central bank thinks economy is overheating
- Central bank offsets fiscal stimulus to prevent inflation

**Recent Example: United States (2021)**

**Background**:
- Early 2021: Large fiscal expansion
  - Transfers to households
  - Infrastructure spending
- **Problem**: Economy was already near full employment
  - Supply constrained
  - Not much spare capacity

**What Should Have Happened**:
- Fed should have raised rates immediately to offset
- This would be the "fiscal expansion + monetary tightening" scenario

**What Actually Happened**:
- Fed did **not** respond for a long time
- Fed was "behind the curve"
- Result: **Overheating economy** → Inflation

**Why Fed Didn't Respond**:
- Thought inflation would be "transitory"
- Expected supply side to recover faster
- Hoped dis-inflationary dynamics would dominate
- Also: Russian invasion of Ukraine (2022) → Oil price spike → More inflation
- By the time Fed responded (late 2021/2022), inflation was entrenched

**Assessment**:
- Fed made a mistake in not responding
- Very uncertain environment (COVID unprecedented)
- May have been right over 3-year horizon
- But everything "compressed into 3 months" → problem

**Lesson**: This scenario shows importance of central bank independence and coordination

---

## 6. COVID-19 Policy Response: A Case Study

### The Shock

**Nature of Crisis**:
- **Unprecedented**: Economy "imploding" into severe recession
- **Unique**: Health crisis requiring lockdowns
- **Sectoral**: Some sectors devastated (services), others booming (goods)

### Monetary Policy Response

**Immediate Action**:
- Fed cut interest rates **aggressively** to zero
- Happened very quickly (March 2020)

**Problem**: Now at zero lower bound
- Conventional monetary policy exhausted
- Economy still in free fall

**Unconventional Response**:
- Massive QE program
- Purchased:
  - Long-term Treasuries
  - Mortgage-backed securities
  - Corporate bonds (investment grade)
  - "Fallen angels" bonds
- Balance sheet expansion: ~\$4 trillion → ~\$9 trillion

### Fiscal Policy Response

**Scale**: Unprecedented in peacetime
- Total fiscal expansion: **~20% of GDP** (combining all packages)
- Comparable only to **wartime** spending
- Multiple rounds of stimulus

**Components**:
1. **Direct transfers** to households
   - Stimulus checks
   - Enhanced unemployment benefits
2. **Small business support**
   - Paycheck Protection Program (PPP)
3. **State and local government aid**
4. **Infrastructure spending** (later)

**International Context**:
- Similar massive fiscal responses **worldwide**
- Not unique to US
- Global coordination of fiscal expansion
- Exception: China (different approach, different reasons)

### The "All In" Policy Package

**Visualization**:
```
IS: Massive shift RIGHT (fiscal expansion)
LM: Massive shift DOWN (monetary expansion, then stuck at zero + QE)
Result: Large increase in output (recovery from deep recession)
```

**Outcome**:
- **Short-term**: Successful at preventing depression
- **Medium-term**: Economy recovered strongly
- **Long-term problem**: Overheating → Inflation (by 2021-2022)

**Hindsight Assessment**:
- Policy response may have been **too large** or **too prolonged**
- Difficult to calibrate in real time during crisis
- Better to err on side of too much stimulus than too little?
- Debate ongoing

---

## 7. Empirical Evidence: How Monetary Policy Actually Works

### Time Lags in Monetary Policy

**Key Challenge**: Monetary policy works with **"long and variable lags"**

**Empirical Evidence** (From VAR studies):

#### Effect on Output/Sales
- **Immediate**: Almost no effect (takes time for impact)
- **Peak effect**: 5-6 quarters (1.5 years) after rate change
- **Long-lasting**: Effects persist for 8+ quarters

#### Effect on Employment
- **Pattern**: Similar to output - slow build-up
- **Peak**: 5-6 quarters after shock
- **Problem**: Hard to know real-time impact

#### Effect on Unemployment
- **Mirror image** of employment
- Slow rise over 6+ quarters
- **Current concern (2022-2023)**:
  - Unemployment very low now
  - But Fed has raised rates aggressively
  - Full impact not yet felt
  - Where will unemployment end up?

#### Effect on Prices/Inflation
- **Slowest response** of all variables
- Takes **very long time** to see full impact on inflation
- **Policy Challenge**:
  - Inflation still high now (2022-2023)
  - But Fed has done a lot
  - Need to wait for effects
  - Risk of over-tightening

**Quote**: *"Monetary policy works with long and variable lags"* (Famous statement)

### Current Policy Dilemma (2022-2023)

**The Tension**:
1. **Inflation**: Still around 6% (unacceptably high)
2. **Fed Action**: Raised rates rapidly over 8 months
3. **Lag Problem**: Full effects won't be felt for 6+ more quarters
4. **Risk**: Over-tightening could cause deep recession

**Questions**:
- Has Fed done enough?
- Should Fed do more now?
- Or wait to see effects of past tightening?
- Will consumers and markets have patience?

**Historical Pattern**: When Fed raises rates quickly, something often "breaks"
- Highly leveraged institutions fail
- Financial instability
- 2022-2023: So far lucky, nothing major has broken

### Time Scales: Financial vs. Real Economy

**Financial Markets**:
- React **instantly** to policy announcements
- Asset prices adjust within minutes/hours
- Interest rates adjust overnight

**Real Economy (Output, Employment)**:
- React with **long lags**
- Begin to see effects: 1 quarter later
- Peak effects: 5-6 quarters later
- Continued effects: 8+ quarters

**Implication for Analysis**:
- When studying impact on asset prices: Look at small windows (minutes around announcement)
- When studying impact on real activity: Look over quarters

---

## 8. Key Principles for IS-LM Analysis

### Always Ask: Which Curve Moves?

**Fiscal Policy / Demand Shocks**:
- Moves **IS curve** (goods market)
- Examples: $T$, $G$, $c_0$, $i_0$, confidence shocks
- Does **not** move LM (unless Fed responds)

**Monetary Policy**:
- Moves **LM curve** (financial market)
- Central bank's interest rate target
- Does **not** move IS (unless it affects expectations/confidence)

**Common Mistake**: Thinking fiscal policy moves LM or monetary policy moves IS
- Fiscal and monetary policies operate in **different markets**
- They can **respond** to each other, but that's a separate decision

### Movements Along vs. Shifts

**Critical for exam questions**:
- **Movement along** = Only interest rate changes
- **Shift** = Other exogenous factors change

### Understanding Disequilibrium

**Points off the IS-LM intersection**:
- Not both markets in equilibrium
- Identify which market has excess supply/demand
- Understand adjustment mechanism

---

## 9. Summary

### Core IS-LM Results

1. **Fiscal Policy**:
   - Shifts IS curve
   - With horizontal LM: Direct impact on output, no interest rate change (if Fed accommodates)

2. **Monetary Policy**:
   - Shifts LM curve
   - Works through investment channel
   - Long lags (6+ quarters for full effect)

3. **Policy Combinations**:
   - "All in" for deep recessions
   - Consolidation with accommodation for deficit reduction
   - Conflicts when policies misaligned

### Real-World Applications

1. **Zero Lower Bound**:
   - Major constraint on conventional monetary policy
   - Requires fiscal policy and/or unconventional monetary policy
   - Japan (decades), US/Europe (2008-2015, 2020-2021)

2. **Unconventional Monetary Policy**:
   - QE and other balance sheet tools
   - Effective at ZLB
   - Massive scale during crises

3. **COVID-19 Response**:
   - Largest policy response in peacetime history
   - Both fiscal (~20% GDP) and monetary (rates to zero + huge QE)
   - Successful at preventing depression
   - Created overheating problem

4. **Current Challenges**:
   - Fighting inflation with monetary tightening
   - Uncertainty about lags
   - Risk of over-correction

### Key Takeaway

The IS-LM model is:
- **Fundamental** to central bank thinking (Fed, ECB, etc.)
- **Practical** for policy analysis
- **Flexible** enough to analyze diverse scenarios
- **Foundation** for understanding macro policy debates

**For Quiz**: Master which curve moves, understand mechanisms, be able to analyze policy combinations.

---

## Important Concepts Checklist

- [ ] Understand movements along vs. shifts of IS
- [ ] Understand movements along vs. shifts of LM
- [ ] Know what shifts IS (all exogenous demand factors except $i$)
- [ ] Know what shifts LM (only central bank's policy decision)
- [ ] Understand multiplier effects through ZZ curve
- [ ] Understand zero lower bound and liquidity trap
- [ ] Understand policy combinations (all in, consolidation, conflicts)
- [ ] Understand monetary policy lags
- [ ] Can analyze any policy scenario by asking "which curve moves?"
