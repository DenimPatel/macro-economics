# Lecture 12: The IS-LM-PC Model - Dynamics and Policy Analysis

## Overview
This lecture completes the IS-LM-PC framework by analyzing its dynamic properties and policy implications. We examine how the economy adjusts from short-run to medium-run equilibrium, the role of inflation expectations, and how policymakers respond to various economic shocks. Special emphasis is placed on the ongoing banking crisis and its macroeconomic implications.

## 1. The Complete IS-LM-PC Framework

### The Three Building Blocks

#### IS Curve (Goods Market)
$$Y = C(Y - T) + I(Y, r) + G$$

- **Definition**: Combinations of output ($Y$) and real interest rate ($r$) that equilibrate the goods market.
- **Key Property**: Downward sloping in $(Y, r)$ space.
    - Higher $r$ $\Rightarrow$ Lower investment ($I \downarrow$) $\Rightarrow$ Lower output ($Y \downarrow$).
- **Shifts**:
    - Fiscal expansion ($G \uparrow$ or $T \downarrow$): IS shifts **right**.
    - Financial shock ($x \uparrow$): IS shifts **left** (credit tightening).
    - Confidence shock ($c_0 \downarrow$): IS shifts **left**.

#### Monetary Policy Rule (LM Simplification)
$$r = \bar{r}$$

- **Assumption**: Central bank controls the **real interest rate** directly (simplification).
- **Reality**: Central bank controls **nominal** interest rate ($i$), and $r = i - \pi^e$.
- **Why simplify?**: Cleaner diagrams; avoids shifting curves when inflation changes.
- **Key Point**: Central bank adjusts $r$ based on inflation outcomes.

#### Phillips Curve (Labor Market + Inflation)
$$\pi_t = \pi^e_t + \lambda (Y_t - Y_n)$$

**Output Gap Version**:
- Original PC: $\pi_t - \pi^e_t = \alpha (u_n - u_t)$
- Production function: $Y = N = L(1 - u)$
- Potential output: $Y_n = L(1 - u_n)$
- Output gap: $Y - Y_n = L(u_n - u)$

**Result**: $\pi_t - \pi^e_t = \lambda (Y_t - Y_n)$ where $\lambda = \alpha/L$

- **Key Property**: Upward sloping in $(Y, \pi - \pi^e)$ space.
    - If $Y > Y_n$ (positive output gap): Inflation **rises** ($\pi > \pi^e$).
    - If $Y < Y_n$ (negative output gap): Inflation **falls** ($\pi < \pi^e$).
    - If $Y = Y_n$ (zero output gap): Inflation **stable** ($\pi = \pi^e$).

### The Output Gap Concept

**Definition**: $\text{Output Gap} = Y - Y_n$

- **Positive Gap** ($Y > Y_n$):
    - Unemployment **below** natural rate ($u < u_n$).
    - Economy "running hot" / "overheating".
    - Labor market tight $\Rightarrow$ Wage pressure $\Rightarrow$ Price pressure $\Rightarrow$ Inflation rises.
- **Negative Gap** ($Y < Y_n$):
    - Unemployment **above** natural rate ($u > u_n$).
    - Economy "running cold" / in recession.
    - Labor market slack $\Rightarrow$ Wage pressure falls $\Rightarrow$ Disinflation / deflation.
- **Zero Gap** ($Y = Y_n$):
    - Unemployment at natural rate ($u = u_n$).
    - No pressure on inflation.
    - **Medium-run equilibrium**.

### Potential Output ($Y_n$)

**Definition**: Output when unemployment equals natural rate.

$$Y_n = L(1 - u_n)$$

- **Interpretation**: "Sustainable" level of output without accelerating inflation.
- **Not Fixed**: $Y_n$ changes with:
    - Labor force size ($L$).
    - Natural rate of unemployment ($u_n$).
    - Productivity (not in this simple model).

## 2. Short Run vs. Medium Run Equilibrium

### Short Run (IS-LM Intersection)

**Determination**: Output determined by intersection of IS and LM (central bank's chosen $r$).

$$Y^{SR} = \text{IS}(r, G, T, x, \text{confidence}, \ldots)$$

**Key Feature**: $Y^{SR}$ need **not** equal $Y_n$.
- Any level of output is a valid short-run equilibrium.
- IS-LM determines output; no constraint that $Y = Y_n$.

**Implications**:
- If $Y^{SR} > Y_n$: Inflation **accelerating** (Phillips curve).
- If $Y^{SR} < Y_n$: Inflation **decelerating** (Phillips curve).
- If $Y^{SR} = Y_n$: Inflation **stable** (lucky case).

### Medium Run (Full Adjustment)

**Determination**: Output returns to potential output.

$$Y^{MR} = Y_n$$

**Mechanism**: Central bank adjusts interest rate in response to inflation.
- If inflation rising ($Y > Y_n$): CB raises $r$ $\Rightarrow$ IS-LM intersection moves left $\Rightarrow$ $Y \downarrow$.
- If inflation falling ($Y < Y_n$): CB lowers $r$ $\Rightarrow$ IS-LM intersection moves right $\Rightarrow$ $Y \uparrow$.
- Process continues until $Y = Y_n$ and inflation stabilizes.

**Medium-Run Equilibrium Conditions**:
1. $Y = Y_n$ (output at potential).
2. $\pi = \pi^e$ (inflation stable).
3. $r = r_n$ (interest rate at natural rate).

### The Natural Rate of Interest ($r_n$ or $r^*$)

**Definition**: Real interest rate that delivers $Y = Y_n$ given current IS curve.

**Implicit Definition**: $Y_n = C(Y_n - T) + I(Y_n, r_n) + G$

**Key Properties**:
- Not a constant; changes with:
    - Fiscal policy ($G, T$).
    - Confidence ($c_0$).
    - Credit conditions ($x$).
    - Foreign demand, demographics, productivity, etc.
- Central bank cannot observe $r_n$ directly; must infer from inflation.
- If CB sets $r < r_n$: Economy overheats ($Y > Y_n$), inflation rises.
- If CB sets $r > r_n$: Economy cools ($Y < Y_n$), inflation falls.
- If CB sets $r = r_n$: Economy at potential ($Y = Y_n$), inflation stable.

## 3. Inflation Expectations and Anchoring

### Two Models of Expectations

#### Model 1: Unanchored Expectations (Adaptive)
$$\pi^e_t = \pi_{t-1}$$

- Expectations = Last period's inflation.
- **Problem**: If inflation rises, expectations follow $\Rightarrow$ Persistence.
- **Implication**: Hard to reduce inflation without recession.

#### Model 2: Anchored Expectations (Credible Central Bank)
$$\pi^e_t = \pi^* = 2\%$$

- Expectations pinned to central bank target.
- **Benefit**: Inflation shocks don't become persistent.
- **Implication**: Can reduce inflation without deep recession (soft landing possible).

### Why Anchoring Matters

**Scenario**: Economy overheats; inflation rises to 9%.

#### With Unanchored Expectations:
1. $\pi = 9\%$ $\Rightarrow$ $\pi^e = 9\%$ next period.
2. To reduce inflation, need $Y < Y_n$ (recession).
3. Inflation falls slowly: $9\% \rightarrow 8\% \rightarrow 7\% \rightarrow \ldots \rightarrow 2\%$.
4. Long recession required ("hard landing").

#### With Anchored Expectations:
1. $\pi = 9\%$ but $\pi^e = 2\%$ (people trust Fed).
2. CB raises $r$ to cool economy ($Y \downarrow$ toward $Y_n$).
3. As $Y \rightarrow Y_n$, inflation falls quickly to $2\%$.
4. Shorter, milder recession ("soft landing").

**Central Bank Credibility**: The most valuable asset a central bank has.
- Built over decades of hitting inflation targets.
- Lost quickly if central bank "falls behind the curve".
- Explains why central banks react aggressively to inflation surprises.

## 4. The Deflationary Trap and the Zero Lower Bound

### The Problem

**Scenario**: Deep recession with low/negative inflation.

- Economy needs **negative real interest rate** to boost demand: $r < 0$.
- Central bank controls **nominal rate**: $i = r + \pi^e$.
- If $i = 0$ (zero lower bound) and $\pi^e < 0$ (deflation), then $r = 0 - \pi^e > 0$.

**Vicious Cycle**:
1. Recession $\Rightarrow$ Deflation ($\pi < 0$).
2. $\pi^e \downarrow$ (expectations turn negative).
3. $r = i - \pi^e = 0 - \pi^e > 0$ (real rate **rises** even though nominal rate at zero).
4. Higher $r$ $\Rightarrow$ Lower $Y$ $\Rightarrow$ More deflation.
5. Spiral deepens.

**Result**: Monetary policy impotent; economy stuck in deflationary trap.

### Historical Example: The Great Depression (1929-1933)

| Year | Unemployment | Nominal Rate ($i$) | Inflation ($\pi$) | Real Rate ($r$) |
|------|--------------|-------------------|------------------|-----------------|
| 1929 | 3% | 5% | 0% | 5% |
| 1930 | 9% | 4% | -2.5% | 6.5% |
| 1931 | 16% | 2% | -9% | 11% |
| 1932 | 24% | 1% | -10% | 11% |

**What Happened**:
- Fed lowered nominal rates from 5% to 1%.
- But deflation accelerated (0% $\rightarrow$ -10%).
- Real interest rate **rose** from 5% to 11%.
- Fed was "pushing on a string" - monetary policy ineffective.
- Unemployment reached 25%.

**Lesson**: Central banks must act **aggressively** to prevent deflation.
- 2008 Global Financial Crisis: Fed learned lesson, cut rates to zero **immediately**.
- Avoided Great Depression 2.0.

### Modern Solutions to ZLB

1. **Quantitative Easing (QE)**: Buy long-term bonds $\Rightarrow$ Lower long-term rates.
2. **Forward Guidance**: Promise to keep rates low for extended period $\Rightarrow$ Raise inflation expectations.
3. **Negative Interest Rates**: Europe, Japan experimented with $i < 0$ (limited success).
4. **Fiscal Policy**: If monetary policy impotent, fiscal expansion ($G \uparrow$) becomes critical.

## 5. Dynamic Adjustment to Aggregate Demand Shocks

### Case Study: Fiscal Consolidation (Austerity)

**Shock**: Government cuts deficit ($G \downarrow$ or $T \uparrow$).

#### Short Run (Impact Effect)

**IS-LM Diagram**:
- IS shifts **left** (lower autonomous spending).
- For given $r$, output falls to $Y_1 < Y_n$.

**Phillips Curve Diagram**:
- Economy now at $Y_1 < Y_n$ (negative output gap).
- Inflation **declines**: $\pi_1 < \pi^e$ (disinflation).

**Immediate Effects**:
- Output $\downarrow$ (recession).
- Unemployment $\uparrow$.
- Inflation $\downarrow$ (or deflation if severe).

#### Medium Run (Adjustment Process)

**Central Bank Reaction**:
- Observes falling inflation.
- Lowers interest rate: $r \downarrow$.
- IS-LM intersection moves **right**: $Y \uparrow$ toward $Y_n$.

**Mechanism**:
- Lower $r$ $\Rightarrow$ Higher investment ($I \uparrow$).
- Higher $I$ offsets lower $G$ (crowding in).
- Output gradually returns to $Y_n$.

**Final Equilibrium** (Medium Run):
- Output: $Y = Y_n$ (back to potential).
- Interest rate: $r < r_{\text{initial}}$ (lower than before consolidation).
- Composition: More investment ($I$), less government spending ($G$).
- Inflation: Stable at target (or slightly below if expectations adjusted).

#### Speed of Adjustment: Key Disagreements

**Why Don't We Adjust Quickly?**

1. **Monetary Policy Lags** ("Long and Variable Lags" - Milton Friedman):
    - Recognition lag: Takes time to realize economy in recession.
    - Decision lag: Central bank meets infrequently (6-8 times/year).
    - Implementation lag: Rate cuts take 6-18 months to affect economy.
2. **Zero Lower Bound**: If rates already low, CB cannot cut much.
3. **Uncertainty About $Y_n$**: Central bank doesn't know potential output; must infer from inflation.

**Policy Debates**:
- **Advocates of Slow Consolidation**: "Adjustment is slow and painful; spread cuts over many years."
- **Advocates of Fast Consolidation**: "Markets reward credibility; adjustment faster than models predict."

**Historical Evidence**: Mixed. Greece (2010s) suffered prolonged depression; UK (1990s) recovered relatively quickly.

## 6. Dynamic Adjustment to Supply Shocks

### Case Study: Oil Price Shock

**Shock**: Oil price spikes $\Rightarrow$ Higher production costs $\Rightarrow$ Markup ($m$) increases.

#### Impact on Natural Rate of Unemployment

**Wage-Setting Relation**: $W = P^e F(u, z)$ (unchanged).

**Price-Setting Relation**: $P = (1 + m) W$ (markup rises).

**Real Wage Implied by Price-Setting**: $\frac{W}{P} = \frac{1}{1 + m}$ (falls when $m \uparrow$).

**New Equilibrium**: Requires higher unemployment to reduce wage demands.

$$u_n \uparrow \quad \text{when} \quad m \uparrow$$

**Potential Output Falls**: $Y_n = L(1 - u_n) \downarrow$ when $u_n \uparrow$.

#### Short Run (Impact Effect)

**Phillips Curve Diagram**:
- PC shifts **left** (lower $Y_n$).
- If output unchanged ($Y = Y_{\text{old}}$), now $Y > Y_n^{\text{new}}$.
- Inflation **surges**: $\pi \uparrow\uparrow$.

**IS-LM Diagram**:
- No immediate shift (supply shock doesn't affect goods market directly).
- Output unchanged initially.

**Immediate Effects**:
- Output unchanged (or slight decline if CB reacts).
- Inflation $\uparrow\uparrow$ (supply-side inflation).
- Unemployment unchanged initially.

#### Central Bank Dilemma

**Two Objectives**:
1. Stabilize inflation (requires raising $r$).
2. Stabilize output (requires keeping $r$ unchanged or lowering).

**Tradeoff**: Cannot achieve both.

**Options**:
- **Accommodate shock**: Keep $r$ unchanged.
    - Pro: Avoids recession.
    - Con: Inflation spirals (if expectations unanchored).
- **Fight inflation**: Raise $r$ aggressively.
    - Pro: Keeps inflation near target.
    - Con: Causes recession ($Y \downarrow$ to new, lower $Y_n$).

#### Medium Run (Adjustment Process)

**If CB Fights Inflation**:
- Raises $r$ $\Rightarrow$ IS-LM intersection moves **left**.
- Output falls to new, lower $Y_n$.
- Inflation stabilizes at target.

**Result**: **Stagflation** (stagnant output + high inflation) during transition.

**If CB Accommodates**:
- Keeps $r$ unchanged.
- Inflation stays high: $\pi > \pi^e$.
- If expectations unanchored: $\pi^e \uparrow$ $\Rightarrow$ Wage demands $\uparrow$ $\Rightarrow$ Further inflation.
- Risk of inflation spiral.

#### Historical Example: 1970s Oil Shocks

**US Experience**:
- 1973-74: Oil prices quadrupled.
- Inflation rose from 3% to 12%.
- Fed accommodated (kept rates low) $\Rightarrow$ Inflation persisted.
- 1979-80: Second oil shock.
- Fed (Volcker) finally raised rates aggressively (20%).
- Deep recession (1981-82) but inflation fell to 3%.

**Lesson**: Supply shocks are difficult; require accepting either high inflation or recession.

### Case Study: COVID-19 Supply Disruptions (2020-2022)

**Shocks**:
1. Supply chains disrupted (China lockdowns, shipping).
2. Labor force participation fell (early retirements, long COVID).
3. Energy shock (2022 Russia-Ukraine war).

**Central Bank Mistake (with hindsight)**:
- Fed thought supply shocks "transitory".
- Kept rates near zero through 2021.
- Inflation rose to 9% (June 2022).

**Why the Mistake?**:
- Some disruptions (chips, shipping) did resolve quickly.
- But labor force participation stayed low $\Rightarrow$ $Y_n \downarrow$ persistently.
- By the time Fed realized, inflation already high.

**Current Situation** (March 2023):
- Fed hiked aggressively (0% to 5% in one year).
- Inflation falling (9% $\rightarrow$ 6%).
- But now banking crisis emerges $\Rightarrow$ New complications.

## 7. Long and Variable Lags in Monetary Policy

### Milton Friedman's Insight

**Quote**: "Monetary policy acts on the economy with long and variable lags."

**Implications**:
1. **Long**: Takes 6-18 months for rate changes to affect output.
2. **Variable**: Lag length unpredictable; depends on financial conditions, expectations, etc.

### Why Lags Matter

**Scenario**: Fed raises rates aggressively (as in 2022-2023).

**Question**: Has Fed done enough? Too much? Too little?

**Problem**: Effects not yet visible.
- Inflation still high today (lagged response).
- But economy may crash in 6 months (future response).
- Fed "flying blind" - can't see the full effects of past actions.

**Analogy**: Driving a car with a fogged windshield and delayed steering.

### Non-Linearities: When Things Break

**Pattern**:
- Rate hikes work slowly at first.
- Economy seems resilient (unemployment low, spending strong).
- Suddenly, "something breaks" (bank failure, credit crunch).
- Economy collapses quickly.

**Why?**:
- Financial system amplifies shocks.
- Small cracks become large fissures.
- Confidence evaporates suddenly.

**Current Situation** (March 2023):
- Fed hiked 4.5% in one year.
- Economy held up... until Silicon Valley Bank failed (March 10).
- Now markets fear broader credit crunch.

## 8. Current Events: Banking Crisis and Policy Response

### The Silicon Valley Bank Collapse (March 2023)

#### What Happened?

**Timeline**:
- **March 8**: SVB announces large losses on bond portfolio.
- **March 9**: Depositors panic; bank run begins.
- **March 10**: SVB fails; FDIC takes over (second-largest bank failure in US history).
- **March 12**: Government announces blanket deposit insurance.

**Why Did SVB Fail?**:
1. SVB held long-term bonds (10-year Treasuries).
2. Rates rose sharply (0% to 5%).
3. Bond prices fell (duration risk).
4. Mark-to-market losses $\Rightarrow$ Capital eroded.
5. Depositors lost confidence $\Rightarrow$ Run $\Rightarrow$ Failure.

**Not a 2008-Style Crisis** (yet):
- SVB held safe assets (Treasuries), not subprime mortgages.
- Losses due to interest rate risk, not credit risk.
- Systemic risk: Other banks face similar unrealized losses.

### Credit Shock: The $x$ Effect

**Recall from Lecture 10**: Investment depends on borrowing costs.

$$I = I(Y, r + x)$$

- $r$: Risk-free rate (controlled by Fed).
- $x$: Credit spread / risk premium.

**Banking Crisis $\Rightarrow$ $x \uparrow$**:
- Banks tighten lending standards.
- Small businesses can't get loans.
- Commercial real estate, mortgages affected.

**Effect on IS Curve**: Shifts **left** (for given $r$, less investment).

$$Y \downarrow \quad \text{for given} \quad r$$

### Implications for Monetary Policy

#### Before SVB Crisis (March 1-9):
- Inflation still 6% (target: 2%).
- Labor market strong (unemployment 3.6%).
- Markets expected 50 basis point hike on March 22.

#### After SVB Crisis (March 10-present):
- Credit crunch fear: $x \uparrow$ $\Rightarrow$ IS shifts left.
- Deflationary pressure emerges.
- Markets now expect **no hike** (or even cut).

**Fed's Dilemma**:
- **Problem 1**: Inflation still too high (6%).
- **Problem 2**: Financial instability / credit crunch.
- **Cannot solve both**: Raising $r$ fights inflation but worsens credit crunch.

**Market Expectations** (Diagram from lecture):
- **Before**: Peak Fed Funds rate 5.6% (by June 2023).
- **After**: Peak Fed Funds rate 5.0% (by May 2023), then cuts to 4.1% by end of year.

**Interpretation**: Markets believe credit crunch will do Fed's job.
- Higher $x$ acts like higher $r$ $\Rightarrow$ Demand cools $\Rightarrow$ Inflation falls.
- Fed can pause hikes (or even cut to prevent recession).

### Flight to Safety

**Treasury Yields Collapsed**:
- 1-year Treasury: 5.1% (March 9) $\rightarrow$ 4.3% (March 15).
- Drop of 80 basis points in one week.

**Why?**:
- Investors flee risky assets (bank stocks, corporate bonds).
- Buy safe assets (Treasuries, gold).
- Expect Fed to cut rates (lowers future yields).

**Inflation Expectations Fell**:
- 1-year breakeven inflation: 5.0% $\rightarrow$ 3.8%.
- Markets expect recession $\Rightarrow$ Disinflation.

### Credit Suisse Crisis (March 15)

**Second Shoe Drops**:
- Credit Suisse (major European bank) faces run.
- Stock price falls 35% in one day.
- Credit default swaps (insurance against default) spike to crisis levels.

**Contagion Fears**:
- If Credit Suisse fails, will other European banks follow?
- Will US banks face renewed pressure?

**Broader Market Reaction**:
- European bank stocks fall 10-15%.
- US bank stocks fall 5-10%.
- VIX (volatility index / "fear gauge") spikes.

### How to Analyze Banking Crisis in IS-LM-PC Framework

**Step 1: Identify the Shock**
- Credit shock: $x \uparrow$ (risk premium rises).
- Confidence shock: $c_0 \downarrow$ (consumers scared).

**Step 2: Short-Run Effect (IS-LM)**
- IS shifts **left**: $Y \downarrow$ for given $r$.
- If Fed doesn't react: Output falls, unemployment rises.

**Step 3: Inflation Response (Phillips Curve)**
- Lower output: $Y < Y_n$ $\Rightarrow$ Negative output gap.
- Inflation **falls**: $\pi \downarrow$ (disinflationary pressure).

**Step 4: Central Bank Reaction** (Medium Run)
- Observes falling inflation (or falling inflation expectations).
- **Cuts interest rate**: $r \downarrow$.
- Two channels:
    1. **Direct**: Lower $r$ boosts investment.
    2. **Indirect**: Lower $r$ partially offsets higher $x$ ($r + x$ is what matters).

**Step 5: Medium-Run Equilibrium**
- Output returns to $Y_n$ (assuming credit crunch temporary).
- Interest rate lower than before: $r < r_{\text{initial}}$.
- Credit spread elevated but stabilized: $x$ high but not rising.

### Silver Lining of High Inflation (Current Environment)

**Why High Inflation Helps Central Bank Response**:

**Recall**: Real rate = Nominal rate - Expected inflation.
$$r = i - \pi^e$$

**If Starting from High Inflation** ($\pi^e = 5\%$):
- Can cut nominal rate to zero: $i = 0$.
- Real rate becomes **negative**: $r = 0 - 5\% = -5\%$.
- Large stimulus possible.

**If Starting from Low Inflation** ($\pi^e = 0\%$):
- Can cut nominal rate to zero: $i = 0$.
- Real rate stuck at **zero**: $r = 0 - 0\% = 0\%$.
- Hit zero lower bound immediately.

**Current Situation**:
- Inflation 6%, expectations 4-5%.
- Fed has room to cut nominal rates from 5% to 0%.
- Real rate could fall to -5% if needed.
- **Much more policy space than 2008** (when inflation already low).

**Paradox**: High inflation is a **problem** (Fed needs to fight it), but also a **tool** (allows aggressive cuts if crisis worsens).

## 9. Key Takeaways

### IS-LM-PC Framework Recap

**Three Equations**:
1. **IS**: $Y = C(Y - T) + I(Y, r + x) + G$ (goods market).
2. **LM**: $r = \bar{r}$ (central bank sets rate).
3. **PC**: $\pi = \pi^e + \lambda(Y - Y_n)$ (inflation dynamics).

### Short Run vs. Medium Run

**Short Run** (IS-LM alone):
- Output determined by IS-LM intersection.
- Can be away from potential: $Y \neq Y_n$.
- Creates inflation/deflation pressure.

**Medium Run** (IS-LM-PC together):
- Central bank reacts to inflation.
- Output returns to potential: $Y = Y_n$.
- Interest rate adjusts to natural rate: $r = r_n$.

### Aggregate Demand vs. Supply Shocks

**Demand Shocks** (fiscal policy, credit crunch):
- **Short run**: Output and inflation move **together**.
    - Expansionary: $Y \uparrow$, $\pi \uparrow$.
    - Contractionary: $Y \downarrow$, $\pi \downarrow$.
- **Medium run**: Output returns to $Y_n$; interest rate adjusts.

**Supply Shocks** (oil prices, productivity):
- **Short run**: Output and inflation move **opposite**.
    - Negative supply shock: $Y \downarrow$, $\pi \uparrow$ (stagflation).
- **Medium run**: $Y_n$ permanently changes; central bank must accept lower output or higher inflation.

### Importance of Inflation Expectations

**Anchored Expectations** ($\pi^e = 2\%$):
- Shocks don't become persistent.
- Soft landings possible.
- Central bank credibility critical.

**Unanchored Expectations** ($\pi^e = \pi_{-1}$):
- Shocks amplified.
- Hard landings required.
- Deep recessions needed to reduce inflation.

### Deflationary Trap

**Zero Lower Bound**: Most dangerous scenario.
- Deflation $\Rightarrow$ Real rates rise $\Rightarrow$ Deeper recession $\Rightarrow$ More deflation.
- Monetary policy impotent.
- Requires aggressive fiscal policy.

### Long and Variable Lags

**Central Banking Is Hard**:
- Can't observe $Y_n$ or $r_n$ directly.
- Long lags between action and outcome.
- Non-linearities: "Something breaks" suddenly.
- Must balance multiple objectives (inflation, employment, financial stability).

### Current Crisis in Context

**March 2023 Banking Crisis**:
- Credit shock ($x \uparrow$) shifts IS left.
- Does some of Fed's work (cools demand).
- But creates financial stability risk.
- Fed must balance: Fight inflation vs. Prevent credit crunch.
- Markets expect fewer rate hikes, earlier cuts.

**Historical Parallel**: 2008 Financial Crisis (but much less severe so far).

**Key Difference**: Fed has policy space (inflation high, can cut rates deeply if needed).

**Next Steps**: Wait and see if credit crunch spreads or stabilizes.

## 10. Summary Table: Shock Analysis in IS-LM-PC

| Shock Type | IS Shift | PC Shift | Short-Run Effect | CB Reaction | Medium-Run Effect |
|------------|----------|----------|------------------|-------------|-------------------|
| **Fiscal Expansion** ($G \uparrow$) | Right | None | $Y \uparrow$, $\pi \uparrow$ | Raise $r$ | $Y = Y_n$, $r$ higher |
| **Fiscal Contraction** ($G \downarrow$) | Left | None | $Y \downarrow$, $\pi \downarrow$ | Lower $r$ | $Y = Y_n$, $r$ lower, $I$ higher |
| **Credit Crunch** ($x \uparrow$) | Left | None | $Y \downarrow$, $\pi \downarrow$ | Lower $r$ | $Y = Y_n$, $r$ lower (if $x$ temporary) |
| **Oil Shock** ($m \uparrow$) | None | Left ($Y_n \downarrow$) | $\pi \uparrow$, $Y$ stable initially | Raise $r$ | $Y = Y_n^{\text{new}}$ (lower), $\pi$ stable |
| **Confidence Shock** ($c_0 \downarrow$) | Left | None | $Y \downarrow$, $\pi \downarrow$ | Lower $r$ | $Y = Y_n$, $r$ lower (if temporary) |

## 11. Looking Ahead

**Next Topics** (subject to change if crisis escalates):
- **Long-run growth**: Solow model, technological progress.
- **Expectations and asset prices**: How forward-looking behavior affects macro outcomes.
- **Financial crises in depth**: Leverage, bank runs, systemic risk (if current crisis worsens).

**For Now**: Monitor banking situation closely. The next few weeks will determine whether this is:
1. **Contained crisis**: A few bank failures, policy response stabilizes system, economy continues (base case).
2. **Spreading crisis**: Credit crunch deepens, more bank failures, recession emerges (tail risk).

**"Interesting times"**: We are living through real-time application of IS-LM-PC model. Pay attention to data, market reactions, and policy responses.
