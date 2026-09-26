# Lecture 14: The Solow Growth Model

## Overview
This lecture introduces the **Solow Growth Model**, the foundational framework for understanding long-run economic growth. Developed by Robert Solow (MIT Nobel Laureate, 1987), this model explains how capital accumulation drives growth and why countries converge to steady states. We analyze the dynamics of capital accumulation, the role of savings rates, and the implications for long-run growth.

**Key Context (March 2023)**: The Fed hiked rates by 25bps as expected, but signaled potential pauses due to banking stress (SVB crisis).

## 1. The Central Mechanism of Growth Theory

### The Circular Flow of Capital Accumulation
The Solow model revolves around a fundamental feedback loop:

```
Capital Stock (K) → Output (Y) → Savings (S) → Investment (I) → Capital Accumulation (ΔK) → Back to K
```

**Key Insight**: Unlike short-run macro (Keynesian multiplier), long-run growth is driven by **capital accumulation**.

### Distinction from Short-Run Models
- **Short-Run (IS-LM)**: Focus on aggregate demand, prices sticky, unemployment matters.
- **Long-Run (Growth)**: Focus on supply side, capital accumulation, full employment assumed.
- **Time Scale**: Capital accumulates slowly (decades), unlike short-run fluctuations (quarters).

## 2. The Basic Solow Model (No Population Growth, No Technology)

### 2.1 Assumptions

1. **Constant Population**: $N = \bar{N}$ (fixed labor supply).
2. **Closed Economy**: $I = S$ (no international capital flows).
3. **No Government**: $G = T = 0$ (simplification).
4. **Constant Returns to Scale (CRS)**: $F(\lambda K, \lambda N) = \lambda F(K, N)$.

### 2.2 Production Function

**Aggregate Form**:
$$Y = F(K, N)$$

**Properties**:
- $\frac{\partial F}{\partial K} > 0$: More capital increases output (marginal product of capital).
- $\frac{\partial^2 F}{\partial K^2} < 0$: **Diminishing marginal returns** to capital.
- $\frac{\partial F}{\partial N} > 0$: More labor increases output.

**Per Worker Form** (dividing by $N$):
$$y = \frac{Y}{N} = f(k)$$

where:
- $y \equiv \frac{Y}{N}$: Output per worker.
- $k \equiv \frac{K}{N}$: Capital per worker.
- $f(k) = F(k, 1)$: Production function in intensive form.

**Key Property**: $f'(k) > 0$ and $f''(k) < 0$ (increasing and concave).

**Intuition for Concavity**: With fixed labor, adding more capital yields diminishing returns. Each additional machine has less labor to work with, so output increases at a decreasing rate.

### 2.3 Savings and Investment

**Saving Function** (proportional to income):
$$S = s Y$$

where $s \in (0, 1)$ is the **saving rate** (exogenous parameter).

**Why Proportional?** (vs. Short-Run Model with $C_0$):
- **Short-Run**: Consumption has autonomous component ($C = C_0 + c_1 Y_d$) capturing wealth effects, asset prices, etc.
- **Long-Run**: These factors (wealth, asset prices) scale with income over time, so proportional form is reasonable approximation.

**Equilibrium** (closed economy):
$$I = S = s Y$$

**In Per Worker Terms**:
$$\frac{I}{N} = s \frac{Y}{N} = s f(k)$$

### 2.4 Capital Accumulation Equation

**Aggregate Form**:
$$K_{t+1} = K_t - \delta K_t + I_t$$

where $\delta \in (0, 1)$ is the **depreciation rate** (fraction of capital that breaks down each period).

**Components**:
- $K_t$: Existing capital stock.
- $-\delta K_t$: Capital lost to depreciation.
- $I_t$: New investment (gross investment).

**Per Worker Form** (dividing by $N$):
$$k_{t+1} = k_t(1 - \delta) + s f(k_t)$$

**Change in Capital per Worker**:
$$\Delta k = k_{t+1} - k_t = s f(k_t) - \delta k_t$$

**Fundamental Equation of the Solow Model**:
$$\boxed{\Delta k = s f(k) - \delta k}$$

**Interpretation**:
- $s f(k)$: **Investment per worker** (adds to capital stock).
- $\delta k$: **Depreciation per worker** (subtracts from capital stock).
- $\Delta k > 0$: Capital per worker is **growing** (investment exceeds depreciation).
- $\Delta k < 0$: Capital per worker is **shrinking** (depreciation exceeds investment).
- $\Delta k = 0$: **Steady state** (capital per worker constant).

## 3. The Solow Diagram

### 3.1 The Basic Diagram

**Axes**:
- Horizontal: $k$ (capital per worker).
- Vertical: Output, investment, depreciation (all per worker).

**Three Curves**:
1. **Production Function** (blue): $y = f(k)$
   - **Concave** (diminishing returns).
   - Shows output per worker for each level of capital per worker.

2. **Investment per Worker** (green): $s f(k)$
   - **Scaled-down version** of production function (multiply by $s < 1$).
   - Shows savings/investment per worker.

3. **Depreciation per Worker** (red): $\delta k$
   - **Linear** line through origin (slope = $\delta$).
   - Shows capital lost to depreciation.

**Key Point**: The vertical distance between green and red lines is $\Delta k$ (change in capital per worker).

### 3.2 Steady State ($k^*$)

**Definition**: A steady state is a point where capital per worker is constant ($\Delta k = 0$).

**Condition**:
$$s f(k^*) = \delta k^*$$

**Graphically**: Steady state occurs where investment curve intersects depreciation line.

**Properties at Steady State**:
- $\Delta k = 0$: Capital per worker is constant.
- $y^* = f(k^*)$: Output per worker is constant.
- **Growth rate of output per worker = 0**.

**Important**: Since $N$ is constant, if $y$ is constant, then total output $Y = yN$ is also constant. **No growth in steady state**.

### 3.3 Solving for Steady State (Example)

**Cobb-Douglas Production Function**:
$$F(K, N) = K^{1/2} N^{1/2}$$

**Per Worker Form**:
$$y = f(k) = k^{1/2}$$

**Steady State Condition**:
$$s k^{1/2} = \delta k$$

**Solving for $k^*$**:
$$k^{1/2} = \frac{\delta}{s} k$$
$$k^{-1/2} = \frac{\delta}{s}$$
$$\boxed{k^* = \left(\frac{s}{\delta}\right)^2}$$

**Output per Worker at Steady State**:
$$\boxed{y^* = f(k^*) = \frac{s}{\delta}}$$

**Key Result**: Doubling the saving rate ($s \uparrow 2s$) doubles steady-state output per worker ($y^*$) but quadruples steady-state capital per worker ($k^*$).

**Why?** Diminishing returns require much more capital to achieve double the output.

## 4. Dynamics and Convergence

### 4.1 Transitional Dynamics

**Starting Below Steady State** ($k_0 < k^*$):
- At low $k$, investment $> $ depreciation ($s f(k) > \delta k$).
- $\Delta k > 0$: Capital per worker **grows**.
- Economy moves **rightward** along horizontal axis.
- Growth rate **positive** but **declining** over time (approaching steady state).

**Starting Above Steady State** ($k_0 > k^*$):
- At high $k$, investment $< $ depreciation ($s f(k) < \delta k$).
- $\Delta k < 0$: Capital per worker **shrinks**.
- Economy moves **leftward**.
- Eventually converges to $k^*$.

**Key Insight**: Regardless of initial conditions, economy converges to $k^*$ (stable steady state).

### 4.2 Transitional Growth

**Definition**: **Transitional growth** is growth that occurs as an economy moves from initial capital stock to steady state.

**Characteristics**:
- Growth is **temporary** (not sustained).
- Growth rate is **highest** when far from steady state.
- Growth rate **declines** as economy approaches steady state.
- Eventually, growth rate returns to **zero** at steady state.

**Explanation for Cross-Country Growth Patterns**:
- **Poorer countries** (low $k$) tend to grow **faster** (catching up).
- **Rich countries** (near $k^*$) grow **slower** (already at steady state).
- This explains the **downward-sloping** relationship between initial income and growth rates observed in OECD countries.

**Notable Exception**: Africa has not exhibited catch-up growth (institutional, conflict, and governance issues).

## 5. Comparative Statics: Policy Experiments

### 5.1 Increase in Savings Rate ($s \uparrow$)

**Initial Condition**: Economy at steady state $k^*$ (no growth).

**Shock**: Savings rate increases ($s \uparrow s'$).

**Which Curve Moves?**
- **Red line** ($\delta k$): **No change** (unrelated to savings).
- **Blue line** ($f(k)$): **No change** (technology unchanged).
- **Green line** ($s f(k)$): **Shifts up** (scaled by higher $s$).

**Graphical Analysis**:
1. Investment curve shifts up.
2. At old steady state, now $s' f(k^*) > \delta k^*$.
3. $\Delta k > 0$: Capital starts accumulating.
4. Economy moves **rightward** toward new steady state $k^{**}$.

**Dynamics Over Time**:
- **Short Run** (immediately after shock):
  - Output $y$ **cannot jump** (capital stock is fixed, slow to adjust).
  - Savings rate jumps, but investment takes time to accumulate capital.

- **Transition Period**:
  - Capital accumulates ($\Delta k > 0$).
  - Output per worker **rises** ($y$ moves up along production function).
  - Growth rate **positive** but **declining** over time.

- **New Steady State**:
  - Capital per worker reaches $k^{**} > k^*$.
  - Output per worker reaches $y^{**} > y^*$.
  - Growth rate returns to **zero**.

**Conclusion**: Higher savings rate leads to:
- **Higher level** of output per worker (permanently).
- **Temporarily higher growth rate** (during transition).
- **No effect on long-run growth rate** (returns to zero).

**Historical Example: Asian Miracle (1960s-1980s)**:
- Countries like South Korea, Taiwan, Singapore dramatically increased savings rates.
- Experienced rapid growth (8-10% per year) for decades.
- Much of this growth was **transitional** (moving from low $k$ to higher $k^*$).

### 5.2 Consumption and the Golden Rule

**Consumption per Worker**:
$$c = y - s y = (1 - s) y = (1 - s) f(k)$$

**At Steady State**:
$$c^* = (1 - s) f(k^*)$$

**Key Question**: Does higher savings rate increase or decrease consumption?

**Two Opposing Forces**:
1. **Higher $s$** directly reduces consumption share: $(1 - s) \downarrow$.
2. **Higher $s$** indirectly increases output: $y^* \uparrow$ (via higher $k^*$).

**Net Effect Depends on Initial Savings Rate**:

**Case 1: Low Initial $s$**
- Economy at low $k$, so $f'(k)$ is **high** (steep part of production function).
- Small increase in $s$ leads to large increase in $k^*$ and $y^*$.
- **Output effect dominates**: $c^* \uparrow$.

**Case 2: High Initial $s$**
- Economy at high $k$, so $f'(k)$ is **low** (flat part of production function).
- Increase in $s$ leads to small increase in $y^*$.
- **Savings effect dominates**: $c^* \downarrow$.

**Golden Rule Savings Rate** ($s_{GR}$):
- The savings rate that **maximizes steady-state consumption** $c^*$.
- **Condition**: $f'(k_{GR}^*) = \delta$ (marginal product of capital equals depreciation rate).
- **Intuition**: Invest just enough to maintain capital stock; consume the rest.

**Example (Cobb-Douglas)**:
$$f(k) = k^{1/2}$$
$$f'(k) = \frac{1}{2} k^{-1/2}$$

Setting $f'(k^*) = \delta$:
$$\frac{1}{2 \sqrt{k^*}} = \delta$$
$$k^* = \frac{1}{4 \delta^2}$$

Using $k^* = (s/\delta)^2$:
$$s_{GR} = 0.5$$

**Optimal savings rate is 50%** in this example.

**Dynamic Inefficiency**: If $s > s_{GR}$, economy is **over-saving** (consuming less than possible). Could increase consumption by reducing savings.

**Historical Context: Asian Miracle Critique**:
- Countries like Singapore had savings rates 40-50%.
- Critics argued: "Yes, output is growing, but consumption isn't growing as fast. Are people actually better off?"
- Counterargument: High savings necessary for catch-up; can reduce later.

### 5.3 Numerical Example

**Assume**: $f(k) = k^{1/2}$, $\delta = 0.1$ (10% depreciation).

**Steady State Values**:

| $s$ | $k^* = (s/\delta)^2$ | $y^* = s/\delta$ | $c^* = (1-s) \cdot y^*$ |
|-----|----------------------|------------------|-------------------------|
| 0   | 0                    | 0                | 0                       |
| 0.1 | 1                    | 1.0              | 0.9                     |
| 0.2 | 4                    | 2.0              | 1.6                     |
| 0.3 | 9                    | 3.0              | 2.1                     |
| 0.4 | 16                   | 4.0              | 2.4                     |
| 0.5 | 25                   | 5.0              | 2.5 (maximum)           |
| 0.6 | 36                   | 6.0              | 2.4                     |
| 0.7 | 49                   | 7.0              | 2.1                     |
| 1.0 | 100                  | 10.0             | 0                       |

**Observations**:
- Consumption peaks at $s = 0.5$ (Golden Rule).
- Beyond $s = 0.5$, higher savings **reduces** consumption (dynamic inefficiency).
- At $s = 1$, output is maximized but consumption is zero (everyone saves everything).

### 5.4 Time Path After Savings Shock

**Transition Dynamics** (from $s = 0.1$ to $s = 0.2$):

**Time 0** (shock occurs):
- $k = 1$ (old steady state).
- $s$ jumps from 0.1 to 0.2.
- Output $y = 1$ (unchanged immediately).
- Investment jumps to $0.2 \times 1 = 0.2$ (was 0.1 before).

**Time 1-50** (transition):
- Capital accumulates: $k$ grows from 1 toward 4.
- Output rises: $y$ grows from 1 toward 2.
- Growth rate is positive but declining.

**Time 50+** (new steady state):
- $k = 4$, $y = 2$, $c = 1.6$.
- Growth rate returns to zero.

**Key Timing Result**: Takes approximately **50 years** to reach new steady state (slow adjustment due to capital accumulation).

## 6. China: A Case Study

**Context**:
- **1980s**: Very low capital stock ($k$ far below $k^*$).
- **Policy Shift**: Dramatic increase in savings rate (40-50%) and opening to foreign investment.
- **Result**: 8-15% annual growth for 30+ years.

**Solow Model Interpretation**:
- Large gap between $s f(k)$ and $\delta k$ (investment far exceeds depreciation).
- Rapid capital accumulation (transitional growth).

**Current Challenge** (2020s):
- Growth rate slowing (now 4-6%, down from 10%+).
- **Why?** Approaching steady state ($k \rightarrow k^*$).
- Diminishing returns kicking in (each unit of new capital adds less output).

**Policy Implications**:
- **Cannot sustain high growth** through capital accumulation alone.
- Need alternative growth sources: **technology** (next lecture), human capital, productivity improvements.

**Quote from Lecture**: "This is sometimes called the easy part of growth. It's sort of running out in China."

## 7. Adding Population Growth

### 7.1 Motivation

**Historical Context**:
- For centuries, output growth was driven by **population growth**, not per capita growth.
- **Malthusian Era**: Population growth kept per capita income constant (food scarcity constraint).
- **Modern Era**: Many developed countries have low or negative population growth (Europe, Japan, South Korea, China).

**Model Modification**: Relax assumption of constant $N$.

### 7.2 New Assumption

**Population Growth**:
$$N_{t+1} = N_t (1 + g_N)$$

where $g_N$ is the **population growth rate** (can be positive or negative).

### 7.3 Capital Accumulation with Population Growth

**Aggregate Form** (unchanged):
$$K_{t+1} = K_t(1 - \delta) + I_t$$

**Per Worker Form** (now tricky):
$$\frac{K_{t+1}}{N_{t+1}} = \frac{K_t(1 - \delta)}{N_{t+1}} + \frac{I_t}{N_{t+1}}$$

**Conversion** (multiply and divide by $N_t$):
$$k_{t+1} = \frac{N_t}{N_{t+1}} k_t (1 - \delta) + \frac{N_t}{N_{t+1}} \frac{I_t}{N_t}$$

**Using $N_{t+1} = N_t (1 + g_N)$**:
$$k_{t+1} = \frac{k_t (1 - \delta)}{1 + g_N} + \frac{s f(k_t)}{1 + g_N}$$

**Approximation** ($g_N$ small):
$$\frac{1}{1 + g_N} \approx 1 - g_N$$

**Change in Capital per Worker**:
$$\Delta k = k_{t+1} - k_t \approx s f(k_t) - \delta k_t - g_N k_t$$

**Fundamental Equation with Population Growth**:
$$\boxed{\Delta k = s f(k) - (\delta + g_N) k}$$

### 7.4 Interpretation

**Economic Meaning**:
$$\underbrace{s f(k)}_{\text{Investment per worker}} - \underbrace{\delta k}_{\text{Depreciation}} - \underbrace{g_N k}_{\text{Capital dilution}}$$

**Three Components**:
1. **Investment**: Adds to capital per worker.
2. **Depreciation**: Subtracts from capital stock (machines break down).
3. **Capital Dilution**: Subtracts from capital per worker (new workers need to be equipped).

**Key Insight**: To maintain constant $k$, must:
- Replace depreciated capital ($\delta k$).
- Equip new workers with capital ($g_N k$).

**Example**: If $g_N = 0.02$ (2% population growth) and $k = 100$:
- Need to invest $2$ units just to maintain $k = 100$ (equip 2 new workers).
- This is **in addition to** replacing depreciated capital.

### 7.5 Steady State with Population Growth

**Steady State Condition**:
$$s f(k^*) = (\delta + g_N) k^*$$

**Modified Solow Diagram**:
- **Green line**: $s f(k)$ (unchanged).
- **Red line**: $(\delta + g_N) k$ (steeper than before, rotates upward).

**Effect of Higher Population Growth** ($g_N \uparrow$):
- Red line rotates **upward** (steeper).
- New intersection at **lower** $k^*$ and $y^*$.
- **Intuition**: More investment needed to equip new workers, leaving less for deepening capital per worker.

### 7.6 Growth in Steady State with Population Growth

**At Steady State**:
- $\Delta k = 0$: Capital per worker is **constant** ($k = k^*$).
- Output per worker is **constant** ($y = y^*$).

**But Total Output is Growing**:
$$Y = y \times N$$

If $y$ is constant and $N$ grows at $g_N$, then:
$$\text{Growth rate of } Y = g_N$$

**Key Result**: In steady state with population growth:
- **Output per worker growth = 0**.
- **Total output growth = $g_N$** (population growth rate).

**Historical Significance**: For most of human history, economic growth was driven entirely by population growth, not productivity improvements.

### 7.7 Counterintuitive Result

**Question**: If population growth increases ($g_N \uparrow$), what happens to:
1. Output per worker ($y$)?
2. Total output ($Y$)?
3. Growth rate of total output?

**Answers**:
1. $y \downarrow$ (lower steady-state capital per worker).
2. $Y$ grows **faster** (grows at higher $g_N$).
3. Growth rate of $Y$ increases (from $g_N$ to $g_N'$).

**Intuition**:
- Higher population growth **lowers living standards** ($y$ falls).
- But it **raises total output** ($Y$ grows faster).
- **Trade-off**: More people vs. higher income per person.

**Modern Context**:
- **Aging societies** (Japan, Europe): $g_N < 0$ (shrinking labor force).
  - Implies **negative output growth** (unless productivity improves).
  - Major policy concern: How to maintain living standards with shrinking population?

## 8. Limitations of the Solow Model

### 8.1 No Sustained Per Capita Growth

**Key Limitation**: In steady state, output per worker is **constant** (zero growth).

**Reality**: Advanced economies have experienced sustained per capita growth for 200+ years (1-2% per year).

**What's Missing?** **Technological progress** (next lecture).

### 8.2 Exogenous Savings Rate

**Model Assumption**: Savings rate $s$ is exogenous (given).

**Reality**: Savings decisions are **endogenous** (households choose how much to save based on interest rates, income expectations, etc.).

**Extension**: **Ramsey-Cass-Koopmans model** (optimal savings, not covered in this course).

### 8.3 No Role for Institutions, Policies

**Model Assumption**: All countries have access to same technology ($f(k)$ is universal).

**Reality**: Institutions, governance, property rights, education systems differ dramatically across countries.

**Why Doesn't Africa Catch Up?** Solow model predicts convergence, but Africa hasn't converged due to:
- Weak institutions.
- Political instability.
- Poor infrastructure.
- Low human capital.

**Extension**: **Endogenous growth theory** (technology depends on investment in R&D, education, etc.).

## 9. Key Takeaways

### 9.1 Core Insights

1. **Capital Accumulation Drives Transitional Growth**: Economies grow as they accumulate capital toward steady state.

2. **Diminishing Returns Limit Growth**: Concave production function means capital accumulation cannot sustain growth indefinitely.

3. **Steady State Has Zero Per Capita Growth**: In long run, output per worker is constant (no growth without technology).

4. **Savings Rate Affects Level, Not Long-Run Growth**: Higher savings increases $y^*$ but not long-run growth rate.

5. **Convergence**: Poor countries (low $k$) grow faster than rich countries (high $k$), leading to catch-up (conditional convergence).

6. **Population Growth**: Increases total output growth but lowers output per worker in steady state.

### 9.2 Policy Implications

**To Increase Living Standards** ($y^*$):
- Increase savings rate $s$ (but beware of over-saving beyond Golden Rule).
- Reduce depreciation rate $\delta$ (better infrastructure, maintenance).
- Slow population growth $g_N$ (demographic transition).

**But**: These policies only increase the **level** of income, not the **growth rate** (in long run).

**For Sustained Growth**: Need technological progress (next lecture).

### 9.3 The Solow Diagram: Master This

**Axes**: $k$ (horizontal), $y$ (vertical).

**Curves**:
- **Blue**: $f(k)$ (production function, concave).
- **Green**: $s f(k)$ (investment, scaled-down production function).
- **Red**: $(\delta + g_N) k$ (depreciation + dilution, linear).

**Steady State**: Where green intersects red.

**Dynamics**:
- Left of steady state: $\Delta k > 0$ (capital accumulates).
- Right of steady state: $\Delta k < 0$ (capital declines).

**Comparative Statics**: Practice shifting curves for changes in $s$, $\delta$, $g_N$, and technology (next lecture).

## 10. Summary Table

| Variable | Meaning | Effect on Steady State |
|----------|---------|------------------------|
| $s \uparrow$ | Higher savings rate | $k^* \uparrow$, $y^* \uparrow$, $c^*$ ambiguous |
| $\delta \uparrow$ | Higher depreciation | $k^* \downarrow$, $y^* \downarrow$, $c^* \downarrow$ |
| $g_N \uparrow$ | Higher population growth | $k^* \downarrow$, $y^* \downarrow$, growth of $Y \uparrow$ |
| $f(k)$ shifts up | Technological progress | $k^* \uparrow$, $y^* \uparrow$, $c^* \uparrow$ (next lecture) |

## 11. Key Equations Reference

**Production Function (Per Worker)**:
$$y = f(k)$$

**Capital Accumulation (No Population Growth)**:
$$\Delta k = s f(k) - \delta k$$

**Capital Accumulation (With Population Growth)**:
$$\Delta k = s f(k) - (\delta + g_N) k$$

**Steady State Condition**:
$$s f(k^*) = (\delta + g_N) k^*$$

**Consumption (Per Worker)**:
$$c = (1 - s) f(k)$$

**Golden Rule**:
$$f'(k_{GR}^*) = \delta$$

**Example (Cobb-Douglas: $f(k) = k^{1/2}$)**:
$$k^* = \left(\frac{s}{\delta + g_N}\right)^2$$
$$y^* = \frac{s}{\delta + g_N}$$

## 12. Practice Problems (Quiz Preparation)

### Problem 1: Increase in Depreciation Rate
**Question**: Starting at steady state, depreciation rate increases ($\delta \uparrow$). Using Solow diagram, analyze effects on $k^*$, $y^*$, and transition dynamics.

**Answer**:
- Red line rotates **upward** (steeper).
- New steady state has **lower** $k^{**}$ and $y^{**}$.
- Transition: Capital declines ($\Delta k < 0$) until reaching new steady state.

### Problem 2: Comparing Countries
**Question**: Two countries (A and B) have same technology and depreciation, but Country A has $s_A = 0.2$ and Country B has $s_B = 0.4$. Compare steady states and growth rates.

**Answer**:
- Country B has **higher** $k_B^* > k_A^*$ and $y_B^* > y_A^*$ (double in Cobb-Douglas example).
- In steady state, **both have zero per capita growth**.
- During transition, Country B grows **faster** than Country A.

### Problem 3: Golden Rule
**Question**: For $f(k) = k^{1/2}$ and $\delta = 0.1$, find the Golden Rule savings rate and maximum steady-state consumption.

**Answer**:
- Golden Rule: $f'(k^*) = \delta \Rightarrow \frac{1}{2\sqrt{k^*}} = 0.1 \Rightarrow k^* = 25$.
- Using $k^* = (s/\delta)^2 = 25 \Rightarrow s = 0.5$.
- $y^* = 5$, $c^* = 0.5 \times 5 = 2.5$.

**Next Lecture**: We relax the assumption of constant technology and introduce **technological progress** (the Solow model with productivity growth). This will allow us to explain sustained long-run growth in output per worker.
