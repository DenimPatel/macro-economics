# Lecture 6: The IS-LM Model (Part II) - Applications and Policy Analysis

## Overview

```summary
- This lecture stops building the model and starts using it: IS-LM is run against policy combinations and real-world scenarios
- The through-line is always the same question — which curve moves, fiscal or monetary
- Fiscal and monetary policy can reinforce each other or cancel each other out, and the mix determines the interest rate as well as output
- The zero lower bound is the recurring constraint: once rates are at zero, conventional monetary policy is exhausted
- Unconventional policy (QE) is what is left when the short rate cannot go lower
- The COVID-19 policy response is the case study that ties all of it together
```

This lecture applies the IS-LM framework to analyze various policy combinations and real-world scenarios, with special focus on the COVID-19 policy response. We examine how monetary and fiscal policies work together (or in conflict), explore the zero lower bound problem, and discuss unconventional monetary policy.

---

## 1. IS-LM Model Review

```summary
- **IS**: $Y = C(Y - T) + I(Y, i) + G$ — goods market equilibrium, downward sloping in $(Y, i)$ and steeper than in Lecture 3 because investment now responds to output
- The slope reflects the MPC plus the MPI; $i$ is a parameter of the ZZ curve, and the whole curve is traced by moving that parameter
- Raise $i$ and investment falls, the ZZ curve shifts down, and the **multiplier** takes output down by more than investment fell
- **Modern LM**: central banks set $i$ directly, so LM is a **horizontal line** at the target — the Fed supplies whatever money output demands
- The traditional LM would slope upward if the central bank targeted $M$; under the modern one, only the Fed's rate decision moves it
```

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

```summary
- **Movement along IS**: the interest rate changes and nothing else — taxes, government spending, confidence and autonomous consumption are all held fixed
- **Shift of IS**: any change in an exogenous demand factor *other* than the interest rate, so you are on a different IS curve
- $G \uparrow$ shifts IS right; $T \uparrow$, weaker confidence or a wealth shock shift it left
- **The test**: hold $i$ fixed and ask whether aggregate demand has moved — if it has, the curve shifted rather than the point moving
- Worked through the ZZ diagram: $T \uparrow$ cuts disposable income, then consumption, so equilibrium $Y$ is lower at the *same* $i$
```

### Movement Along the IS Curve
- **Cause**: Interest rate changes (only)
- **What's held constant**: Taxes, government spending, consumer confidence, autonomous consumption
- **Interpretation**: Tracing different equilibrium points on the **same** IS
- **Example**: a wealth shock cuts autonomous consumption, aggregate demand falls, and the new equilibrium arrives at a higher $i$ and lower $Y$ — same IS, different point. A Fed hike is *not* this example: it shifts LM, which is what Section 4 covers. With modern LM horizontal, the intersection moves off the old one and both $i$ and $Y$ change together

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

```summary
- Fiscal policy is a **goods market** policy: it moves IS and leaves LM where it is
- **Contractionary** ($T \uparrow$ or $G \downarrow$) shifts IS **left** — higher taxes cut disposable income and consumption, or lower $G$ cuts demand directly, and the multiplier amplifies the decline
- **Expansionary** ($T \downarrow$ or $G \uparrow$) shifts IS **right** by the same route
- With a horizontal LM and an accommodating Fed, the whole effect lands on output: $Y$ falls or rises while $i$ is unchanged
- Confidence, wealth and business sentiment are **non-policy equivalents** — they shift IS left in exactly the same way that contractionary fiscal policy does
- What fiscal has that monetary does not is **targeting**: it can be aimed at particular groups, which is why the COVID response was large transfers to low-income households
```

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

```summary
- Monetary policy is a **financial market** policy: it moves LM and leaves IS where it is. A cut shifts LM down, a hike shifts it up
- **Why a cut is expansionary**: at the old output the lower $i$ raises investment, so aggregate demand exceeds output — there is excess demand for goods and no goods market equilibrium
- Output must rise to absorb that excess demand, and the multiplier carries it past the initial investment gain
- **Implementation** is open market operations: buy bonds, announce the new target, then keep supplying money — because money demand grows as the economy expands, the final money supply increase is larger than the first injection
- **Contractionary** is the same mechanism in reverse: a hike shifts LM up and output falls
- The 2022-2023 hiking cycle is that case in the wild: aggressive hikes to combat inflation, cooling an overheated economy
```

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

```summary
- **"All in"** (IS right, LM down) gives the largest possible output gain; it is the deep-recession case, and monetary goes first because it is decided overnight
- The argument for pairing them: fiscal can target people and structural problems that a rate change cannot reach
- **Zero lower bound**: at $i = 0$ money demand is perfectly elastic, so injections cannot move the rate and conventional policy is exhausted — Japan's answer was decades of fiscal expansion
- **QE**: with the overnight rate pinned, the central bank buys long Treasuries, MBS, corporate bonds and fallen angels to compress term and risk spreads instead; the balance sheet goes from modest to massive
- **Consolidation with accommodation** (IS left, LM down): output roughly unchanged, the deficit improves, the interest rate falls — the way to fix fiscal accounts without a recession
- **Conflict** (IS right, LM up): the output effect is ambiguous but $i$ certainly rises, and the government will be unhappy — the 2021 US case, where the Fed stayed behind the curve and paid in inflation
```

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

```summary
- The shock was unprecedented on every axis: an economy imploding into severe recession, a health crisis that required lockdown, and a split between devastated services and booming goods
- The Fed cut to zero within March 2020, exhausting conventional policy while the economy was still in free fall
- The answer was massive QE — long Treasuries, MBS, investment-grade corporate bonds and fallen angels — taking the balance sheet from roughly 4 trillion dollars to 9 trillion
- **Fiscal was the larger half**: about 20% of GDP across all packages, comparable only to wartime spending
- In order: direct transfers (stimulus checks, enhanced unemployment benefits), then PPP small-business support, then state and local aid, then infrastructure
- Almost every country ran a similar fiscal expansion, so this was a global response, not a US one
- Short and medium term it prevented a depression; the same size, held too long, is what produced the overheating and inflation of 2021-2022
```

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

```summary
- The central fact of the evidence is **long and variable lags** — a rate change is a decision about the future, not the present
- **Output and employment** show almost nothing immediately, peak 5-6 quarters out, and are still working 8+ quarters later
- **Unemployment** is the mirror image of employment, with the same slow build; the 2022-2023 hikes have not yet reached their peak
- **Prices respond slowest of all**, which is the awkward part: the inflation fight is judged before the evidence of it has arrived
- The current dilemma in numbers: inflation still around 6%, rates raised rapidly over 8 months, full effects 6+ quarters away, over-tightening a live risk
- Rapid tightening has historically **broken something** — leveraged institutions failing, financial instability — and so far 2022-2023 has got away with it
- Financial markets price policy instantly, real activity responds over quarters, so the two need different observation windows
```

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

```summary
- **Always ask which curve moves.** Fiscal policy and demand shocks move IS; monetary policy moves LM
- Neither moves the other's curve directly — a policy reaches the other curve only by changing the Fed's response or the economy's expectations, which is a separate decision
- The common mistake is swapping them, and the reason is that the two policies operate in different markets
- Movement along IS is the interest rate changing with LM and every other exogenous factor held fixed; a shift of IS is any of those other factors changing instead
- A point off the IS-LM intersection is a **disequilibrium**: one market is in equilibrium and the other has excess supply or excess demand, and the adjustment mechanism is the real content of the analysis
```

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

```summary
- Fiscal policy shifts IS; with a horizontal LM and an accommodating Fed the whole effect lands on output and the interest rate does not move
- Monetary policy shifts LM, works through the investment channel, and takes 6+ quarters for its full effect to show up
- The combinations: **"all in"** for deep recessions, consolidation with accommodation to fix the deficit accounts, and open conflict where the central bank leans against an expansionary fiscal stance — the corner that needs the largest rate move
- The zero lower bound is the hard constraint — Japan for decades, the US and Europe in 2008-2015 and 2020-2021 — and it forces the choice between fiscal and unconventional policy
- COVID-19 was the largest peacetime response, fiscal at about 20% of GDP plus rates to zero and enormous QE: it prevented a depression and created the overheating problem
- IS-LM is fundamental to how central banks think, practical for policy analysis, and the foundation for the macro debates ahead
```

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

```summary
- The distinction to have automatic: a movement along IS is the interest rate alone with LM held fixed, a shift of IS is anything else
- Only the central bank's policy decision shifts LM; every other exogenous demand factor shifts IS
- The multiplier runs through the ZZ curve, so output moves further than the spending or investment change that started it
- The zero lower bound and the liquidity trap are one problem: when money demand is perfectly elastic, more liquidity stimulates nothing
- Policy combinations come in three shapes — all in, consolidation with accommodation, and outright conflict
- Lags are what make the hard part hard: the effect of a rate change peaks several quarters out, so every decision is taken under uncertainty about its own consequences
- The one question that answers most of it: which curve moves?
```

- [ ] Understand movements along vs. shifts of IS
- [ ] Understand movements along vs. shifts of LM
- [ ] Know what shifts IS (all exogenous demand factors except $i$)
- [ ] Know what shifts LM (only central bank's policy decision)
- [ ] Understand multiplier effects through ZZ curve
- [ ] Understand zero lower bound and liquidity trap
- [ ] Understand policy combinations (all in, consolidation, conflicts)
- [ ] Understand monetary policy lags
- [ ] Can analyze any policy scenario by asking "which curve moves?"
