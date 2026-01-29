# Lecture 18: Review for Quiz 2

## Overview
This lecture reviews the material covered in the second part of the course, which will be the subject of Quiz 2. It consolidates key concepts from the labor market, Phillips curve, IS-LM-PC model, and economic growth theory.

## 1. The Labor Market & Natural Rate of Unemployment

### Building Blocks of the Labor Market Model

#### Wage Setting (WS) Equation
$$W_t = P^e_t \times F(u_t, z)$$

Dividing by expected price level:
$$\frac{W_t}{P^e_t} = F(u_t, z)$$

**Key Properties**:
- **Decreasing in unemployment** ($\partial F/\partial u < 0$): Higher unemployment weakens worker bargaining power and makes unemployment more costly (harder to find jobs).
- **Increasing in institutional parameters** ($\partial F/\partial z > 0$): Higher $z$ represents:
    - Greater union bargaining power.
    - More generous unemployment benefits.
    - Stronger labor market protections.
- **Depends on expected price level**: Workers negotiate nominal wages but care about real wages, so they base demands on what they expect prices to be during the contract period.

#### Price Setting (PS) Equation

**Production Function** (simplified): $Y = N$ (one unit of labor produces one unit of output).
- **Marginal Cost**: $MC = W$ (wage per unit of labor).

**Pricing by Firms** (markup pricing):
$$P = W \times (1 + m)$$

Where $m$ is the markup over marginal cost, capturing:
- Market power (degree of competition).
- Other costs not explicitly modeled (capital depreciation, overhead, etc.).

**Real Wage Offered by Firms**:
$$\frac{W}{P} = \frac{1}{1 + m}$$

**Key Insight**: Higher markup ($m \uparrow$) means lower real wage offered by firms.

### Equilibrium: Natural Rate of Unemployment

#### Definition of Natural Rate ($u_n$)
- The unemployment rate at which **actual price equals expected price** ($P_t = P^e_t$).
- **Not truly "natural"** - depends on structural parameters ($m, z$), not biological constants.

#### Solving for $u_n$
At natural rate, real wage demanded equals real wage offered:
$$F(u_n, z) = \frac{1}{1 + m}$$

For a specific functional form (e.g., $F(u, z) = z - \alpha u$):
$$z - \alpha u_n = \frac{1}{1 + m}$$

Solving:
$$u_n = \frac{1}{\alpha}\left(z - \frac{1}{1 + m}\right)$$

### Comparative Statics: What Changes $u_n$?

#### Increase in Bargaining Power ($z \uparrow$)
- **WS Curve**: Shifts **up** (workers demand higher real wage at any unemployment rate).
- **PS Curve**: Unchanged (firms' markup unchanged).
- **Result**: $u_n \uparrow$ (natural rate of unemployment rises).
- **Intuition**: Higher wage demands inconsistent with firms' willingness to pay; only way to restore equilibrium is for unemployment to rise (weakens worker bargaining power).

#### Increase in Markup ($m \uparrow$)
- **WS Curve**: Unchanged.
- **PS Curve**: Shifts **down** (firms offer lower real wage).
- **Result**: $u_n \uparrow$ (natural rate of unemployment rises).
- **Intuition**: Lower real wage offered is inconsistent with worker demands at initial $u_n$; unemployment must rise to lower wage demands.

## 2. From Labor Market to Inflation: The Phillips Curve

### Deriving the Phillips Curve

**Starting Point**: Wage setting equation
$$W_t = P^e_t \times F(u_t, z)$$

**Linearize** $F$:
$$W_t = P^e_t (z - \alpha u_t)$$

**Substitute into price setting**:
$$P_t = W_t (1 + m) = P^e_t (z - \alpha u_t)(1 + m)$$

**Divide by $P_{t-1}$**:
$$\frac{P_t}{P_{t-1}} = \frac{P^e_t}{P_{t-1}} (z - \alpha u_t)(1 + m)$$

**Define inflation rates**:
- $\pi_t = \frac{P_t - P_{t-1}}{P_{t-1}}$
- $\pi^e_t = \frac{P^e_t - P_{t-1}}{P_{t-1}}$

**After approximations** (assuming $(1 + \pi_t) \approx 1 + \pi_t$ for small $\pi$):
$$\pi_t = \pi^e_t + (m + z) - \alpha u_t$$

### Modern Form: Expectations-Augmented Phillips Curve

**Using Natural Rate**:
At $u_n$: $\pi = \pi^e$ (by definition).

This gives:
$$\pi^e + (m + z) - \alpha u_n = \pi^e$$

Therefore:
$$(m + z) = \alpha u_n$$

**Substituting back**:
$$\pi_t = \pi^e_t + \alpha u_n - \alpha u_t$$

$$\pi_t - \pi^e_t = -\alpha(u_t - u_n)$$

**In terms of output gap** (using Okun's Law: $u_t - u_n \approx -\beta(Y_t - Y_n)/Y_n$):
$$\pi_t - \pi^e_t = \lambda(Y_t - Y_n)$$

Where $\lambda = \alpha \beta L / Y_n$ (positive constant).

### Inflation Expectations: Anchored vs. Unanchored

#### Anchored Expectations ($\theta = 0$)
$$\pi^e_t = \bar{\pi}$$

Where $\bar{\pi}$ is the central bank's inflation target (e.g., 2% in US).

**Phillips Curve** becomes:
$$\pi_t = \bar{\pi} - \alpha(u_t - u_n)$$

**Interpretation**: Inflation deviates from target when unemployment deviates from natural rate, but expectations remain anchored at target.

**Characteristics**:
- Credible central bank (strong anti-inflation reputation).
- Temporary inflation shocks don't affect long-run expectations.
- **Example**: US currently (2023) - inflation rose to 5%, but long-run expectations remain ~2.5%.

#### Unanchored Expectations ($\theta = 1$)
$$\pi^e_t = \pi_{t-1}$$

**Phillips Curve** becomes:
$$\pi_t - \pi_{t-1} = -\alpha(u_t - u_n)$$

**Interpretation**: Change in inflation (acceleration/deceleration) depends on unemployment gap.

**Characteristics**:
- Weak central bank credibility.
- People extrapolate past inflation into future.
- **Example**: US in 1970s - inflation spiraled as expectations became unanchored.

### Implications for Policy

#### With Anchored Expectations
- **Positive output gap** ($Y > Y_n$): $\pi > \bar{\pi}$ (inflation above target).
- **Policy Response**: Raise interest rates to close output gap.
- **Outcome**: Inflation returns to target without persistent deviation.

#### With Unanchored Expectations
- **Positive output gap** ($Y > Y_n$): $\pi_t > \pi_{t-1}$ (inflation accelerating).
- **Problem**: Inflation doesn't stabilize - it keeps rising.
- **Policy Response**: Must create **negative** output gap ($Y < Y_n$) for extended period to bring inflation down.
- **Cost**: Severe recession required to disinflate (Volcker disinflation 1980-82).

### The Phillips Curve in Historical Context

#### 1960s: Apparent Stable Trade-off
- **Observation**: Downward-sloping Phillips Curve ($\pi$ vs. $u$).
- **Interpretation**: Policymakers thought they could permanently lower unemployment by accepting higher inflation.
- **Reality**: Expectations were implicitly anchored at low inflation levels.

#### 1970s: Breakdown
- **Observation**: No clear relationship - high inflation **and** high unemployment (stagflation).
- **Causes**:
    1. **Supply shocks** (oil price shocks): $m \uparrow$ shifts Phillips Curve up.
    2. **Unanchored expectations**: $\theta \rightarrow 1$ (people expected high inflation to persist).
- **Result**: Vertical or positively-sloped relationship in $(\pi, u)$ space.

#### 1980s-Present: Credibility Restoration
- **Volcker disinflation** (1980-82): Fed raised rates dramatically, caused recession.
- **Outcome**: Expectations re-anchored; Phillips Curve relationship restored.
- **Current**: Most advanced economies have anchored expectations ($\theta \approx 0$).

## 3. The IS-LM-PC Model

### Structure of the Model

#### IS Curve (Goods Market Equilibrium)
$$Y = C(Y - T) + I(Y, r) + G$$

**Key Features**:
- Output determined by aggregate demand.
- **Decreasing in real interest rate** ($r$): Higher $r$ reduces investment.
- **Shifts**: Changes in $G, T$ (fiscal policy), or exogenous demand shocks (confidence, financial conditions captured by $x$ in $I(Y, r, x)$).

#### LM (Monetary Policy Rule)
$$r = \bar{r}$$

**Simplification**: Central bank directly sets the real interest rate.
- In reality, sets nominal rate $i$, but with fixed $\pi^e$, can think of setting $r$.

#### Phillips Curve (Inflation Dynamics)
$$\pi_t - \pi^e_t = \lambda(Y_t - Y_n)$$

**Key Features**:
- Links output gap to inflation deviation from expectations.
- Provides constraint on how long output can deviate from potential.

### Short Run vs. Medium Run

#### Short Run (IS-LM)
- **Time Horizon**: Months to a year.
- **Prices**: Sticky (inflation doesn't adjust).
- **Output**: Demand-determined (can deviate from $Y_n$).
- **Policy**: Monetary or fiscal policy can move output.

#### Medium Run (IS-LM-PC)
- **Time Horizon**: Several years.
- **Prices**: Adjust gradually via Phillips Curve.
- **Output**: Converges to $Y_n$ (supply-side constraint binds).
- **Policy**: Cannot keep output above $Y_n$ indefinitely without accelerating inflation.

### Policy Analysis with IS-LM-PC

#### Example 1: Output Above Potential

**Initial Situation**:
- IS-LM equilibrium at $Y_1 > Y_n$.
- Phillips Curve: $\pi_1 > \pi^e$ (inflation above expectations).

**Problem**: Inflation rising (if expectations unanchored, accelerating).

**Policy Response** (Central Bank):
1. **Raise real interest rate**: $r \uparrow$ (shift LM up or move along IS).
2. **Output falls**: New equilibrium at $Y_2 < Y_1$.
3. **Iterate**: Continue raising $r$ until $Y = Y_n$.

**Medium-Run Equilibrium**:
- Output: $Y = Y_n$ (output gap closed).
- Inflation: $\pi = \pi^e$ (stable inflation).
- Interest rate: $r = r_n$ (natural rate of interest).

#### Example 2: Fiscal Expansion from Equilibrium

**Shock**: $\Delta G > 0$ (government spending increases).

**Short Run**:
- IS shifts **right**.
- Output increases: $Y_1 > Y_n$ (positive output gap).
- Inflation: $\pi_1 > \pi^e$ (above expectations).

**Medium Run**:
- Central bank raises $r$ to combat inflation.
- Output returns to $Y_n$.
- Result: Fiscal expansion has **no long-run effect on output**.
- **Crowding out**: Higher $r$ reduces investment; $\Delta I = -\Delta G$ in long run.

#### Example 3: Supply Shock (e.g., Oil Price Increase)

**Shock**: Markup increases ($m \uparrow$), e.g., due to higher energy costs.

**Effects**:
1. **Natural rate of unemployment rises**: $u_n \uparrow$ (from WS-PS analysis).
2. **Natural level of output falls**: $Y_n \downarrow$ (fewer people employed).
3. **Phillips Curve shifts left**: For any $Y$, inflation now higher (positive supply shock).

**Policy Dilemma** (if central bank doesn't recognize $Y_n$ has fallen):
- **Initially**: At old output $Y_0$, now $Y_0 > Y_n$ (positive output gap).
- **Phillips Curve**: Inflation starts rising.
- **Central bank reaction**: Must raise $r$ to bring $Y$ down to new (lower) $Y_n$.
- **Outcome**: Recession is **necessary** to stabilize inflation.

**Historical Example**: 1970s oil shocks led to both recession and inflation (stagflation).

### Zero Lower Bound (ZLB) and Deflationary Spirals

#### The ZLB Problem

**Scenario**: Economy in recession, needs negative real interest rate to reach $Y_n$.
$$r_n < 0$$

But nominal rate constrained:
$$i \geq 0$$

**Fisher Equation**: $r = i - \pi^e$

**Problem**: If $\pi^e \approx 0$ (or negative), then $r = i - 0 \geq 0 > r_n$ (real rate too high).

#### Deflationary Spiral Mechanism

**Starting Point**: $Y < Y_n$ (recession), $i = 0$ (ZLB binding).

**Step 1**: Phillips Curve implies $\pi < \pi^e$ (deflation).

**Step 2**: Deflation causes $\pi^e \downarrow$ (if expectations not anchored).

**Step 3**: Lower $\pi^e$ raises real rate: $r = i - \pi^e = 0 - \pi^e \uparrow$.

**Step 4**: Higher $r$ reduces demand further: $Y \downarrow$.

**Step 5**: Return to Step 1 (vicious cycle).

**Result**: Self-reinforcing downward spiral.

#### Policy Responses at ZLB

**Monetary Policy (Limited)**:
- **Quantitative Easing** (QE): Buy long-term bonds to lower long-term rates.
- **Forward Guidance**: Promise to keep rates low even after recovery (affects expectations).
- **Negative nominal rates**: Some central banks (ECB, BoJ) went slightly negative.

**Fiscal Policy (Primary Tool)**:
- **Expansionary fiscal policy**: $\Delta G > 0$ or $\Delta T < 0$.
- Shifts IS right, raises output without needing lower interest rates.
- **Historical Example**: Japan used massive fiscal stimulus (1990s-2000s), leading to high public debt.

**Inflation Expectations Management**:
- Commit to higher inflation target temporarily (raise $\pi^e$ to lower real rate).

## 4. Economic Growth: The Solow Model

### Motivation: Growth Facts

#### Fact 1: Convergence Among Similar Countries
- **Observation**: Countries with similar institutions but lower initial GDP/capita grow faster.
- **Evidence**: OECD countries (1950-2020) show negative relationship between initial income and growth rate.
- **Interpretation**: Convergence toward common steady state.

#### Fact 2: Persistent Inequality Across Countries
- **Observation**: Some countries (Sub-Saharan Africa) remain poor despite decades.
- **Evidence**: Income gap between richest and poorest countries increased from 20:1 (1950) to 40:1+ (2020).
- **Interpretation**: Different steady states due to differences in technology, institutions.

#### Fact 3: Growth Miracles and Disasters
- **Miracles**: South Korea, Taiwan, China (rapid growth from low levels).
- **Disasters**: Argentina (relative decline), Zimbabwe (absolute decline).

### Production Function and Key Assumptions

#### Cobb-Douglas Production Function
$$Y = F(K, N) = K^\alpha N^{1-\alpha}$$

**Properties**:
1. **Constant Returns to Scale** (CRS): $F(\lambda K, \lambda N) = \lambda F(K, N)$.
    - Doubling all inputs doubles output.
2. **Diminishing Returns to Each Factor**: $\frac{\partial^2 Y}{\partial K^2} < 0$, $\frac{\partial^2 Y}{\partial N^2} < 0$.
    - Increasing one input (holding other fixed) yields progressively smaller output gains.

**Special Case** (used in lecture): $\alpha = 0.5$
$$Y = \sqrt{K} \times \sqrt{N} = \sqrt{K \times N}$$

#### Intensive Form (Per Worker)

**Dividing by $N$**:
$$\frac{Y}{N} = F\left(\frac{K}{N}, 1\right) = f(k)$$

Where $k = K/N$ (capital per worker) and $y = Y/N$ (output per worker).

**For Cobb-Douglas**:
$$y = k^\alpha$$

**Graphical Representation**: Concave function (diminishing returns).
- Slope $= f'(k) = MPK$ (marginal product of capital).
- As $k \uparrow$, output rises but at decreasing rate.

### Solow Model Without Technological Progress

#### Key Equations

**1. Production Function**:
$$y = f(k)$$

**2. Savings = Investment**:
$$I = S = sY$$

Where $s$ is the (exogenous) savings rate ($0 < s < 1$).

**3. Capital Accumulation**:
$$K_{t+1} = K_t - \delta K_t + I_t$$

Where $\delta$ is the depreciation rate ($0 < \delta < 1$).

**Per Worker Form**:
$$k_{t+1} = k_t - \delta k_t + s f(k_t)$$

Or:
$$\Delta k = s f(k) - \delta k$$

#### Steady State

**Definition**: $\Delta k = 0$ (capital per worker constant).

**Condition**:
$$s f(k^*) = \delta k^*$$

**Interpretation**:
- **Investment per worker** ($sf(k)$) exactly offsets **depreciation per worker** ($\delta k$).
- Capital stock neither growing nor shrinking.

**Graphical Solution**:
- Plot $sf(k)$ (concave, increasing) and $\delta k$ (linear, through origin).
- Intersection determines $k^*$.

#### Dynamics: Convergence to Steady State

**If $k < k^*$**:
- Investment ($sf(k)$) > Depreciation ($\delta k$).
- $\Delta k > 0$ (capital per worker rising).
- Economy accumulates capital, moving right toward $k^*$.

**If $k > k^*$**:
- Investment ($sf(k)$) < Depreciation ($\delta k$).
- $\Delta k < 0$ (capital per worker falling).
- Economy decumulates capital, moving left toward $k^*$.

**At $k = k^*$**:
- $\Delta k = 0$ (steady state).
- Output per worker constant: $\Delta y = 0$.

#### Growth Rates in Steady State (No Population Growth)

**Capital per worker**: $g_k = 0$.
**Output per worker**: $g_y = 0$.
**Total output**: $g_Y = 0$ (if $N$ constant).

**Key Implication**: No long-run growth in living standards without technological progress.

### Comparative Statics: Changes in Savings Rate

#### Increase in Savings Rate ($s \uparrow$)

**Effect on Diagram**:
- $sf(k)$ curve shifts **up** (more investment at every $k$).
- New steady state: $k^* \uparrow$ (higher capital per worker).

**Dynamics** (if initially at old steady state):
- $sf(k)$ now exceeds $\delta k$ (investment > depreciation).
- $\Delta k > 0$ (capital accumulates).
- Economy grows **faster than steady state** during transition.
- Eventually converges to new (higher) steady state.

**Long-Run Effect**:
- **Level effect**: Higher $y^*$ (richer in steady state).
- **Growth effect**: None - still $g_y = 0$ in new steady state.
- **Transitional growth**: Faster growth during transition from old to new steady state.

**Policy Implication**: Saving can explain growth miracles (e.g., East Asia 1960s-1980s) but only temporary acceleration, not permanent increase in growth rate.

### Solow Model with Population Growth

#### Modification

**Population grows** at rate $g_N$:
$$N_{t+1} = (1 + g_N) N_t$$

**Capital Accumulation** (per worker):
$$\Delta k = sf(k) - (\delta + g_N) k$$

**Intuition for $g_N k$ term**:
- To keep $k$ constant, must not only replace depreciation ($\delta k$).
- Also need to equip new workers with capital ($g_N k$).
- **Total required investment**: $(\delta + g_N) k$.

#### New Steady State

**Condition**:
$$sf(k^*) = (\delta + g_N) k^*$$

**Diagram**:
- Now plot $sf(k)$ vs. $(\delta + g_N) k$ (steeper line).
- Intersection determines $k^*$ (lower than before for same $s$).

#### Growth Rates in Steady State

**Capital per worker**: $g_k = 0$ (by definition of steady state).
**Output per worker**: $g_y = 0$ (since $k$ constant and $y = f(k)$).
**Total capital**: $g_K = g_N$ (capital grows to equip new workers).
**Total output**: $g_Y = g_N$ (output grows with population).

**Key Implication**: Population growth is a source of GDP growth, but not growth in living standards (GDP/capita).

### Solow Model with Technological Progress

#### Modeling Technology

**Labor-Augmenting Technological Progress**:
$$Y = F(K, AN)$$

Where:
- $A$ = Technology level (or "efficiency of labor").
- $AN$ = Effective labor (number of workers in efficiency units).

**Growth Rate of Technology**:
$$A_{t+1} = (1 + g_A) A_t$$

#### Effective Worker Units

**Redefine** variables in terms of effective workers:
- $\tilde{k} = \frac{K}{AN}$ (capital per effective worker).
- $\tilde{y} = \frac{Y}{AN}$ (output per effective worker).

**Production Function** (intensive form):
$$\tilde{y} = f(\tilde{k})$$

#### Capital Accumulation (Per Effective Worker)

$$\Delta \tilde{k} = s f(\tilde{k}) - (\delta + g_N + g_A) \tilde{k}$$

**Intuition for $g_A \tilde{k}$ term**:
- To keep $\tilde{k} = K/(AN)$ constant, need to:
    1. Replace depreciation: $\delta k$.
    2. Equip new workers: $g_N k$.
    3. Equip existing workers with better technology: $g_A k$.
- **Total required investment**: $(\delta + g_N + g_A) \tilde{k}$.

#### Steady State with Technological Progress

**Condition**:
$$sf(\tilde{k}^*) = (\delta + g_N + g_A) \tilde{k}^*$$

**Diagram**:
- Plot $sf(\tilde{k})$ vs. $(\delta + g_N + g_A) \tilde{k}$.
- Intersection determines $\tilde{k}^*$.

#### Growth Rates in Steady State

**Capital per effective worker**: $g_{\tilde{k}} = 0$.
**Output per effective worker**: $g_{\tilde{y}} = 0$.

**But in terms of actual workers**:

**Capital per worker**:
$$k = \frac{K}{N} = A \tilde{k}$$
$$g_k = g_A + g_{\tilde{k}} = g_A$$

**Output per worker**:
$$y = \frac{Y}{N} = A \tilde{y}$$
$$g_y = g_A + g_{\tilde{y}} = g_A$$

**Total output**:
$$Y = AN \tilde{y}$$
$$g_Y = g_A + g_N + g_{\tilde{y}} = g_A + g_N$$

**Key Implications**:
1. **Long-run growth in living standards** (GDP/capita) is **entirely driven by technological progress** ($g_A$).
2. Savings rate, depreciation, etc. affect **levels** but not **long-run growth rates**.
3. **Population growth** adds to GDP growth but not GDP/capita growth.

### Convergence and Conditional Convergence

#### Unconditional Convergence (Fails Empirically)

**Prediction**: If all countries have same $(s, \delta, g_N, g_A)$, then:
- Poor countries (low $k$) should grow faster than rich countries (high $k$).
- Eventually, all converge to same steady state.

**Reality**: Not observed globally.
- Many poor countries (e.g., Sub-Saharan Africa) remain poor.
- No evidence of unconditional convergence.

#### Conditional Convergence (Holds Empirically)

**Prediction**: Countries converge to **their own** steady states, which differ due to:
- Different savings rates ($s$).
- Different population growth ($g_N$).
- Different human capital levels ($H$).
- Different technology levels ($A$) and growth rates ($g_A$).

**Evidence**:
- Within groups of similar countries (OECD), conditional convergence observed.
- Controlling for determinants of steady state, poor countries do grow faster.

**Policy Implication**: To raise long-run income, need to:
1. Increase $s$ (transitional growth).
2. Lower $g_N$ (raises $k^*$ and $y^*$).
3. Invest in human capital ($H$).
4. **Most important**: Improve technology ($A$) and institutions that foster innovation ($g_A$).

### Growth Accounting: Solow Residual

#### Decomposing Growth

**Cobb-Douglas Production Function**:
$$Y = K^\alpha (AN)^{1-\alpha}$$

**Taking logs and differentiating**:
$$g_Y = \alpha g_K + (1 - \alpha)(g_A + g_N)$$

**Rearranging**:
$$g_A = g_Y - \alpha g_K - (1-\alpha) g_N$$

**Or** (including human capital $H$):
$$g_A = g_Y - \alpha g_K - \beta g_H - (1 - \alpha - \beta) g_N$$

**Solow Residual**: The part of output growth not explained by growth in measured inputs (capital, labor, human capital).
- Interpreted as **Total Factor Productivity (TFP) growth**.

#### Findings from Growth Accounting

**Advanced Economies**:
- Roughly 50% of growth explained by capital accumulation.
- Roughly 50% by TFP growth ($g_A$).

**Cross-Country Income Differences**:
- Differences in $K, H$ explain some variation.
- Large residual: Differences in $A$ (technology/efficiency).
- **Interpretation**: Institutions, policies, geography affect $A$.

**Policy Implication**: Policies that improve TFP (innovation, education quality, rule of law) are crucial for long-run prosperity.

## 5. Key Takeaways for Quiz 2

### Labor Market
- Understand derivation of natural rate of unemployment from WS-PS model.
- Know how $z$ (bargaining power) and $m$ (markup) affect $u_n$.
- Natural rate is not constant - depends on structural parameters.

### Phillips Curve
- Derive Phillips Curve from wage-price dynamics.
- Distinguish anchored vs. unanchored expectations (critical for policy).
- Understand output gap form: $\pi - \pi^e = \lambda(Y - Y_n)$.

### IS-LM-PC
- Analyze short-run (IS-LM) vs. medium-run (convergence to $Y_n$).
- Policy responses: monetary (change $r$) vs. fiscal (change $G, T$).
- Supply shocks shift Phillips Curve and change $Y_n$.
- ZLB creates deflationary spiral; fiscal policy becomes primary tool.

### Solow Growth Model
- Derive steady state: $sf(k^*) = (\delta + g_N + g_A)k^*$.
- Understand dynamics: countries below steady state grow faster (convergence).
- Comparative statics: $s \uparrow$ raises $k^*, y^*$ (level effect) but not long-run $g_y$ (growth effect).
- With technological progress: $g_y = g_A$ (only source of sustained growth in living standards).
- Conditional convergence: countries converge to different steady states depending on $s, g_N, A$.
