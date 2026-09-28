# Lecture 16: Growth Accounting and Conditional Convergence

## Overview

```summary
- Growth accounting decomposes output growth into contributions from capital, labor and technology
- The **Solow residual** is never observed directly; it is what is left once measurable inputs are accounted for
- Human capital explains income *levels* — it does not change the long-run growth rate
- TFP differences, not gaps in capital or schooling, account for most cross-country income differences
- **Conditional convergence**: countries grow fast only when far below their own steady state
```
This lecture completes the growth theory section by examining what our models can and cannot explain about cross-country income differences. We introduce growth accounting (the Solow residual) to decompose growth into contributions from capital, labor, and technology. We then extend the model to include human capital and explore conditional convergence - why some countries remain poor while others catch up.

## 1. Balanced Growth Path Revisited

```summary
- **Balanced growth**: every variable grows at a constant rate when technology grows at $g_A$ and population at $g_N$
- Normalizing by **effective workers** ($A \times N$) is what makes the steady-state diagram static — the curves stop shifting
- Per effective worker, output and capital are constant; per worker both grow at $g_A$; the totals grow at $g_A + g_N$
- **Only $g_A$** raises long-run living standards; capital per worker grows at $g_A$ because technology does, not because capital accumulated
- Cobb-Douglas with a labor share near 0.7 and a capital share near 0.3 has constant returns to scale
- Differentiating logs gives $g_Y = (1-\alpha)g_K + \alpha(g_A + g_N)$, and balanced growth collapses that to $g_{Y/N} = g_A$
```

### Complete Model Characteristics
In the Solow model with technological progress ($A$ grows at $g_A$) and population growth ($N$ grows at $g_N$), balanced growth occurs when all variables grow at constant rates.

### Key Normalization: Effective Workers
- **Effective Workers**: $A \times N$ (productivity times population)
- **Purpose**: Normalize variables by effective workers to achieve steady-state diagram where curves don't shift

### Balanced Growth Path Properties

| Variable | Growth Rate | Explanation |
|----------|-------------|-------------|
| Output per Effective Worker ($Y/AN$) | 0 | Constant (balanced growth definition) |
| Capital per Effective Worker ($K/AN$) | 0 | Constant (steady state in diagram) |
| **Output per Worker ($Y/N$)** | **$g_A$** | Only technology drives per capita growth |
| **Capital per Worker ($K/N$)** | **$g_A$** | Capital deepening at rate of tech progress |
| **Total Output ($Y$)** | **$g_A + g_N$** | Both drivers contribute to absolute growth |
| **Total Capital ($K$)** | **$g_A + g_N$** | Grows with effective workers |

**Critical Insight**: In the long run (balanced growth), only technological progress ($g_A$) drives growth in living standards (output per person).

### Example: Cobb-Douglas Production Function

Production function:
$$Y = K^{1-\alpha}(AN)^\alpha$$

**Properties**:
- Constant returns to scale: $(1-\alpha) + \alpha = 1$
- Capital share: $1-\alpha$ (approximately 0.3)
- Labor share: $\alpha$ (approximately 0.7)

Taking logs and derivatives:
$$\frac{\dot{Y}}{Y} = (1-\alpha) \frac{\dot{K}}{K} + \alpha \left(\frac{\dot{A}}{A} + \frac{\dot{N}}{N}\right)$$

Or:
$$g_Y = (1-\alpha)g_K + \alpha(g_A + g_N)$$

In **balanced growth**, $g_K = g_A + g_N$, so:
$$g_Y = (1-\alpha)(g_A + g_N) + \alpha(g_A + g_N) = g_A + g_N$$

For **output per worker**:
$$g_{Y/N} = g_Y - g_N = g_A$$

This confirms our table entries.

## 2. Growth Accounting: The Solow Residual

```summary
- Output growth, capital growth, labor growth and the labor share are all observable; **technological progress is not**
- Growth accounting infers technology growth as the leftover: $g_A = g_Y - (1-\alpha)g_K - \alpha g_N$
- Each input is weighted by its **factor share**, which competitive markets fix at payments equal to marginal products
- The **Solow residual** is the part of growth that measurable factor accumulation leaves unexplained
- It is also called **TFP** growth, or "the measure of our ignorance" — it swallows measurement error too
- Inside it sit technological innovation, organizational improvement, education, and reallocation toward more productive uses
```

### The Fundamental Problem
We can observe:
- $g_Y$: Output growth (from national accounts)
- $g_K$: Capital growth (investment minus depreciation)
- $g_N$: Labor force growth (population statistics)
- $\alpha$: Labor share (wage bill / total revenue ≈ 0.7)

But we cannot directly observe:
- $g_A$: Technological progress

**Goal**: Measure technological progress indirectly by accounting for all other contributions.

### The Solow Decomposition

From the production function, we can decompose output growth:
$$g_Y = (1-\alpha)g_K + \alpha g_N + g_A$$

**Interpretation**:
- $(1-\alpha)g_K$: Contribution of capital accumulation
- $\alpha g_N$: Contribution of labor force growth
- $g_A$: **Solow Residual** - contribution of Total Factor Productivity (TFP)

### Deriving the Formula

**Step 1**: Production function contribution logic
- If capital increases by 1%, output increases by $(1-\alpha)\%$
- Why $(1-\alpha)$? That's capital's share of income (under competitive markets)
- **Competitive market assumption**: Factor payments equal marginal products
  - Capital receives: $rK$ (rental rate × capital stock)
  - Labor receives: $wN$ (wage × employment)
  - Capital share: $\frac{rK}{Y} = 1-\alpha$
  - Labor share: $\frac{wN}{Y} = \alpha$

**Step 2**: Measuring each contribution
$$g_{Y,K} = (1-\alpha) g_K \quad \text{(growth due to capital)}$$
$$g_{Y,N} = \alpha g_N \quad \text{(growth due to labor)}$$

**Step 3**: Solve for the residual
$$g_A = g_Y - (1-\alpha)g_K - \alpha g_N$$

This is the **Solow residual** - the portion of growth not explained by measurable factor accumulation.

### What Does the Solow Residual Capture?

The residual $g_A$ captures everything not explained by $K$ and $N$:
1. **Technological innovation**: New inventions, better machinery
2. **Organizational improvements**: Better management, supply chains
3. **Education and skills**: Human capital improvements
4. **Reallocation**: Resources moving to more productive sectors
5. **Measurement error**: Mismeasurement of inputs or outputs

This is why it's sometimes called "Total Factor Productivity" (TFP) growth or the "measure of our ignorance."

## 3. Application: China's Growth (1978-2017)

```summary
- Between 1978 and 2017 China grew 7.2% a year: capital 9.2%, labor 1.7%, TFP 3.25%
- The three contributions sum to output growth: capital $2.76\%$, labor $1.19\%$, TFP $3.25\%$
- Capital grew faster than output, so $K/Y$ was rising — not the signature of balanced growth
- Balanced growth would put capital growth at $g_A + g_N = 4.95\%$; it ran at 9.2%, so this was **transitional growth**
- The mechanism is a starting $k$ below $k^*$: investment ran above steady-state needs and the saving-minus-depreciation gap drove catch-up
- The 4.95% long-run rate is likely an overestimate as $g_N$ turns negative and the catch-up boost fades; 3-5% is more realistic
- Pushing the saving rate further is near its limit at 45%+ of GDP; the durable options are TFP growth or immigration
```

### The Chinese Growth Miracle
Between 1978 (economic reforms) and 2017, China experienced extraordinary growth:

| Variable | Annual Growth Rate |
|----------|-------------------|
| Output ($g_Y$) | 7.2% |
| Capital ($g_K$) | 9.2% |
| Labor ($g_N$) | 1.7% |
| TFP ($g_A$) | 3.25% |

**Using growth accounting** (with $\alpha \approx 0.7$):
$$7.2\% = (0.3)(9.2\%) + (0.7)(1.7\%) + 3.25\%$$
$$7.2\% = 2.76\% + 1.19\% + 3.25\%$$

### Is This Balanced Growth?

**Question**: Does China's growth pattern look like a steady state?

**Answer**: No! Here's why:

**Clue 1**: Capital growing faster than output
- $g_K = 9.2\% > g_Y = 7.2\%$
- This means $K/Y$ is rising
- In balanced growth, $K$ and $Y$ should grow at same rate ($g_A + g_N$)

**Clue 2**: Check the balanced growth prediction
- Balanced growth rate should be: $g_A + g_N = 3.25\% + 1.7\% = 4.95\%$
- But capital growing at 9.2%, not 4.95%!

**Conclusion**: China was experiencing **transitional growth**, not balanced growth.

### Transitional Growth Dynamics

**What does this mean?**
- China's capital stock was **below its steady state level**
- Investment rate exceeded steady-state requirements
- Economy was in the "catching up" phase
- Growth was temporarily boosted above long-run rate

**Why was capital stock low?**
Potential reasons:
1. Command economy era (pre-1978) had low saving/investment
2. Cultural Revolution disrupted capital accumulation
3. Economic reforms suddenly increased saving rate (45%+ of GDP)
4. Opening to foreign investment

**The Solow diagram interpretation**:
- Initial $k$ (capital per effective worker) was below $k^*$ (steady state)
- Gap between saving curve $sf(k)$ and depreciation line $(n+\delta+g_A)k$ was positive
- This gap generated high investment and transitional growth

### Implications for China's Future

**Steady-state growth prediction**:
- Long-run growth = $g_A + g_N = 3.25\% + 1.7\% = 4.95\%$

**But this is likely an overestimate**:
1. **Population growth turning negative**: One-child policy aftermath
   - $g_N$ is declining, turning negative by 2020s
   - This directly reduces $g_Y$ in steady state
2. **Transitional growth ending**: As $k \to k^*$, growth boost from capital deepening disappears
3. **TFP growth may slow**: Harder to maintain 3.25% TFP growth as you approach technology frontier

**Realistic forecast**:
- Long-run growth likely around 3-5% (depending on TFP trends)
- Lower than 7.2% average of high-growth period
- Creates challenges for debt sustainability, employment

**Policy options to maintain growth**:
1. **Increase saving rate further**: Generates more transitional growth
   - Costly: Requires lower consumption
   - Limited upside: Already saving 45%+ of GDP
2. **Boost TFP growth**: R&D investment, education, institutional reforms
   - More sustainable but difficult to engineer
3. **Immigration**: Offset declining $g_N$
   - Politically challenging

## 4. Human Capital Extension

```summary
- Schooling varies enormously: about 13 years in the US, Korea and Japan against about 5 in Sub-Saharan Africa
- **Human capital** is $h = e^{\psi s}$, so each year of schooling is worth roughly $\approx 10\%$ and 10 years multiplies *human capital* by 2.72, so effective labor by $2.72^\alpha$ — about 1.40 at $\alpha=0.33$
- It moves the **level** of income per capita, not its long-run growth rate — schooling cannot rise forever
- Normalizing by workers rather than effective workers removes the $g_A$ term, leaving a break-even of $(\delta + n)$
- The balanced-growth solution $k = (s/(g_A+\delta+n))^{1/\alpha} Ah$ leaves capital per effective worker exactly as in the basic Solow model
- Steady-state income per worker is $A \cdot h \cdot (s/(g_A+\delta+n))^{(1-\alpha)/\alpha}$: technology, human capital and saving raise it, population growth lowers it
```

### Motivation
Education levels vary dramatically across countries:
- US, Korea, Japan: ~13 years average schooling
- Sub-Saharan Africa: ~5 years average schooling

Could this explain income differences?

### The Model

**Modified production function**:
$$Y = K^{1-\alpha}(AH)^\alpha$$

Where:
- $H = N \cdot h$ (human capital = population × human capital per worker)
- $h = e^{\psi \times s}$ (human capital as function of schooling years)
- $s$: Years of schooling
- $\psi$: Return to schooling (approximately 0.1)

**Interpretation**:
- Each additional year of schooling raises human capital by $\approx 10\%$
- 10 years of schooling: $h = e^{0.1 \times 10} = e^1 \approx 2.72$
  - This multiplies *human capital* $h$, not the labor force. Labor enters
    production inside $(Ah)^\alpha$, so effective labor is multiplied by
    $2.72^\alpha$ — about 1.40 at $\alpha = 0.33$, not 2.72

### Balanced Growth with Human Capital

**Key insight**: Human capital affects the **level** but not the long-run **growth rate** of income per capita.

**Why?**
- In steady state, $g_h = 0$ (can't increase schooling forever)
- Average schooling might rise from 5 to 13 years (transition)
- But can't rise from 13 to 100 years (physical/time constraint)

**Balanced growth properties** (same as before):
- Output per worker grows at $g_A$
- Total output grows at $g_A + g_N$

### Capital Accumulation with Human Capital

**Normalization**: Divide all variables by $N$ (workers, not effective workers)

Output per worker:
$$y = \frac{Y}{N} = \left(\frac{K}{N}\right)^{1-\alpha}(Ah)^\alpha = k^{1-\alpha}(Ah)^\alpha$$

**Capital accumulation equation**:
$$k_{t+1} - k_t = sy_t - (\delta + n)k_t$$

**Key difference from before**:
- Before: Normalized by $AN$, so had $(\delta + n + g_A)$ term
- Now: Normalized by $N$ only, so just $(\delta + n)$ term

**Steady-state condition**:
In balanced growth, $k$ (capital per worker) grows at rate $g_A$:
$$g_A = \frac{s y_t}{k_t} - (\delta + n)$$

### Solving for Steady-State Capital

From the steady-state condition:
$$g_A + \delta + n = \frac{s y_t}{k_t}$$

Substitute production function:
$$g_A + \delta + n = s \frac{k^{1-\alpha}(Ah)^\alpha}{k} = s k^{-\alpha}(Ah)^\alpha$$

Solve for $k$:
$$k = \left(\frac{s}{g_A + \delta + n}\right)^{1/\alpha} Ah$$

Define capital per effective worker:
$$\tilde{k} = \frac{k}{Ah} = \left(\frac{s}{g_A + \delta + n}\right)^{1/\alpha}$$

This is exactly the same as the basic Solow model!

### Steady-State Output per Worker

Output per worker:
$$y = k^{1-\alpha}(Ah)^\alpha = \left[\left(\frac{s}{g_A + \delta + n}\right)^{1/\alpha} Ah\right]^{1-\alpha}(Ah)^\alpha$$

Simplifying:
$$y = A \cdot h \cdot \left(\frac{s}{g_A + \delta + n}\right)^{(1-\alpha)/\alpha}$$

**Key components**:
1. **Technology**: $A$ (level of productivity)
2. **Human capital**: $h$ (education)
3. **Saving rate**: $s$ (positive effect on level)
4. **Population growth**: $n$ (negative effect on level)

## 5. Cross-Country Income Comparisons

```summary
- Each country's income ratio to the US decomposes into technology, human capital, saving and population growth
- **Solow's assumption**: the same $A$ everywhere, justified on the grounds that technology can be imported or copied
- Holding human capital equal leaves only saving, population growth and a constant depreciation rate
- That predicted world is far flatter than the real one — nowhere near the 30-fold differences observed
- **Conclusion**: capital and labor accumulation alone explain only a small fraction of cross-country income gaps
- Adding schooling boosts Japan and Korea, penalizes Sub-Saharan Africa, and raises dispersion somewhat
- Even with education, saving and population growth, the model still predicts a much flatter world than we observe
```

### Setting Up the Comparison

**Goal**: Explain why income per capita varies so much across countries.

**Method**: Compare country $i$ to the United States.

**Income ratio**:
$$\hat{y}_i = \frac{y_i}{y_{US}} = \frac{A_i \cdot h_i \cdot \left(\frac{s_i}{g_A + \delta + n_i}\right)^{(1-\alpha)/\alpha}}{A_{US} \cdot h_{US} \cdot \left(\frac{s_{US}}{g_A + \delta + n_{US}}\right)^{(1-\alpha)/\alpha}}$$

**Assumption 1**: Same technology ($A_i = A_{US}$)
- Solow's original assumption
- Justification: Technology can be imported/copied
- Questionable for many developing countries

Under this assumption:
$$\hat{y}_i = \frac{h_i}{h_{US}} \cdot \left[\frac{s_i}{s_{US}} \cdot \frac{g_A + \delta + n_{US}}{g_A + \delta + n_i}\right]^{(1-\alpha)/\alpha}$$

### First Experiment: Capital and Labor Only

**Ignore human capital**: Set $h_i = h_{US}$ for all countries.

**What can explain income differences?**
1. **Saving rates** ($s_i$): Higher saving $\Rightarrow$ higher income
2. **Population growth** ($n_i$): Higher $n$ $\Rightarrow$ lower income
3. **Depreciation** ($\delta$): Assume constant across countries

**Result**: The world would be much more equal!

**Graphical evidence**:
- Plot predicted $\hat{y}_i$ vs. actual $y_i/L_i$
- Points cluster much closer to equality than reality
- Cannot explain the 30-fold differences we observe

**Conclusion**: Capital and labor accumulation alone explain a small fraction of cross-country income differences.

### Second Experiment: Add Human Capital

**Now include education**: Measure $h_i$ using schooling data.

**What changes?**
- Countries with more education (Japan, Korea) get boost
- Countries with less education (Sub-Saharan Africa) get penalty
- Dispersion increases somewhat

**Result**: Still far from explaining observed differences.

**Key finding**: Even with education, saving rates, and population growth, the model predicts a much flatter world than we observe.

**The puzzle deepens**: What's missing?

## 6. The Role of Technology (TFP)

```summary
- Drop the equal-technology assumption and measure it directly: $A_i = y_i / (k_i^{1-\alpha} h_i^\alpha)$
- Relative TFP puts Singapore near the US at about 0.9, Mexico at about 0.6 and Kenya at about 0.3
- Relative TFP and relative output per worker are very strongly positively related
- **Between 50% and 67%** of cross-country income differences are attributable to TFP differences
- Poor countries are poor primarily because they are unproductive, not merely short of capital or education
- TFP is a basket: institutions, technology-adoption barriers, misallocation, market distortions, political instability, geography
- **The limit of growth theory**: the Solow model needs $A$ and never explains why it differs across countries
```

### Dropping the Equal Technology Assumption

**New approach**: Allow $A_i \neq A_{US}$ and measure it.

**Method**: Use growth accounting to compute TFP levels
$$A_i = \frac{y_i}{k_i^{1-\alpha} h_i^\alpha}$$

### Measuring Relative TFP

For each country, compute:
$$\hat{A}_i = \frac{A_i}{A_{US}}$$

**Data**:
- Singapore: $\hat{A} \approx 0.9$ (close to US)
- Mexico: $\hat{A} \approx 0.6$
- Kenya: $\hat{A} \approx 0.3$

### Technology and Income: The Key Relationship

**Plot**: Relative TFP ($\hat{A}_i$) vs. Relative output per worker ($\hat{y}_i$)

**Finding**: Very strong positive relationship!

**Quantitative result**: Between 50% and 67% of cross-country income differences can be attributed to TFP differences.

**Interpretation**:
- Poor countries are poor primarily because they are unproductive
- Not just because they lack capital or education
- Something about the way they organize production is inefficient

### What Does TFP Capture?

TFP differences reflect:
1. **Institutions**: Property rights, rule of law, corruption
2. **Barriers to technology adoption**: Lack of infrastructure, skills
3. **Misallocation**: Resources in wrong sectors/firms
4. **Market distortions**: Monopolies, trade barriers, financial repression
5. **Political instability**: Uncertainty deters investment
6. **Geography**: Disease burden, agricultural productivity

**Critical insight**: Growth theory (Solow model) tells us TFP is crucial, but doesn't explain why TFP differs. That requires institutional economics, political economy, etc.

## 7. Convergence Among Similar Countries

```summary
- **Absolute convergence** — poor countries growing faster than rich ones — does not hold unconditionally
- **Conditional convergence** does: countries converge to their own steady states, and those steady states differ
- Major industrial economies over 1870-2010 converged clearly — Japan far behind in 1870 grew fastest, the US and UK ahead grew slowly
- Japan is the textbook path: a gap in 1870, catch-up then war, the 1945-1990 "miracle", and growth rates equalized by 1990-2010
- It works because similar institutions, technology adoption and education give similar $A$ and $h$ — similar steady states
- Add the poor countries and the negative relationship disappears or reverses: some African countries were low-income in 1960 and stayed low-growth
- The reason is that poor countries have lower steady states, so they converge to those rather than to rich-country levels
```

### Conditional Convergence Concept

**Question**: Do poor countries grow faster than rich countries (absolute convergence)?

**Answer**: Not unconditionally. But if we compare countries with similar steady states, yes!

**Conditional convergence**: Countries converge to their own steady states, which may differ.

### Evidence: Rich Country Convergence

**Sample**: Major industrial economies (US, UK, France, Germany, Japan, Canada, Australia)

**Period**: 1870-2010

**Pattern**: Clear convergence
- Japan was far behind in 1870, grew very fast
- US/UK were ahead in 1870, grew more slowly
- By 2010, all countries have similar income per capita

**Why does this work?**
- Similar institutions (democracy, rule of law, property rights)
- Similar technology adoption capability
- Similar education systems
- Therefore, similar $A$ and $h$ (similar steady states)

**Graph interpretation**:
- Plot log income per capita (1870) vs. average growth rate (1870-2010)
- Strong negative relationship: poor countries in this group grew faster
- This is exactly what the Solow model predicts for countries converging to the same steady state

### Time Series: Visualizing Convergence

**Diagram**: Log income per capita over time
- **1870**: Japan far below US/UK
- **1900-1945**: Japan catching up, then war
- **1945-1990**: Rapid Japanese catch-up ("Japanese miracle")
- **1990-2010**: Convergence complete, growth rates equalize

**Other patterns**:
- Germany: Behind in 1870, caught up by 1900, war setback, catch-up again
- France: Steady convergence throughout
- US/UK: Always at frontier, moderate steady-state growth

### Why Doesn't Global Convergence Hold?

**Problem**: When we plot all countries (including poor ones), the negative relationship disappears or even reverses.

**Example**: Some African countries had low income in 1960 and low growth 1960-2010.

**Why?**
- They have different (lower) steady states
- Low $A$ (poor institutions, technology barriers)
- Converging to a low steady state, not to US/rich country levels

## 8. Conditional Convergence Framework

```summary
- **The hypothesis**: countries grow faster the further below their own steady state they are
- The gap $y_i/y_i^*$ is built from each country's own $A$, $h$, $s$ and $n$, and the prediction is $g_i = \lambda(1 - y_i/y_i^*)$
- $\lambda$, the convergence speed, is typically 2-3% per year
- A ratio below 1 means fast catch-up ahead, exactly 1 means growth at $g_A$, above 1 is rare and means slow growth
- Regressing 1970-2010 growth on the log of the 1970 gap across 100+ countries gives the predicted negative coefficient
- The fitted coefficient implies a convergence speed of about 2% a year
- **The key insight**: poor countries with low steady states catch up to their own low levels, not to the rich ones
```

### The Conditional Convergence Hypothesis

**Statement**: Countries grow faster when they are further below their own steady state.

**Formalization**: Define distance from steady state:
$$\text{Gap}_i = \frac{y_i}{y_i^*}$$

Where:
- $y_i$: Current output per worker
- $y_i^*$: Steady-state output per worker (computed using country's own $A_i$, $h_i$, $s_i$, $n_i$)

**Prediction**: Growth rate should be decreasing in Gap$_i$
$$g_i = \lambda \left(1 - \frac{y_i}{y_i^*}\right)$$

Where $\lambda$ is the convergence speed (typically 2-3% per year).

### Computing Country-Specific Steady States

**Step 1**: Measure country $i$'s fundamentals
- $A_i$: TFP level (from growth accounting)
- $h_i$: Human capital (from education data)
- $s_i$: Saving/investment rate
- $n_i$: Population growth rate

**Step 2**: Compute steady-state output per worker
$$y_i^* = A_i \cdot h_i \cdot \left(\frac{s_i}{g_A + \delta + n_i}\right)^{(1-\alpha)/\alpha}$$

**Step 3**: Compare actual to steady state
$$\frac{y_i(1970)}{y_i^*(1970)} = ?$$

- If $< 1$: Country below steady state (should grow fast)
- If $= 1$: Country at steady state (should grow at $g_A$)
- If $> 1$: Country above steady state (should grow slowly) - rare

### Evidence: Cross-Country Regression

**Regression specification**:
$$g_i = a + b \log\left(\frac{y_i(1970)}{y_i^*(1970)}\right) + \varepsilon_i$$

**Prediction**: $b < 0$ (negative relationship)

**Sample**: 100+ countries, 1970-2010

**Result**: Strong negative relationship (as predicted)
- Countries far below their steady state grew faster
- Countries close to their steady state grew at steady-state rate
- Coefficient $b$ implies convergence speed $\lambda \approx 2\%$ per year

**Interpretation**: Conditional on country-specific characteristics (TFP, education, saving), the Solow model works very well!

### Visualizing Conditional Convergence

**Scatter plot**:
- **X-axis**: $\log(y_i/y_i^*)$ in 1970 (distance from steady state)
- **Y-axis**: Average growth 1970-2010

**Observations**:
- **Japan**: Far below steady state in 1970 (war recovery), grew very fast
- **Botswana**: Below steady state, grew fast (but steady state was low)
- **US**: Close to steady state, grew at moderate pace
- **Some African countries**: Close to (low) steady state, grew slowly

**The key insight**: Poor countries with low steady states (low $A$, low $h$) don't catch up to rich countries. They catch up to their own lower steady states.

## 9. The Great Income Divergence

```summary
- Income per worker at the 90th percentile country against the 10th went from about 5:1 in 1870 to 15:1 in 1960 and 25:1 in 2000
- Living standards are not merely unequal — the gap between rich and poor has been widening
- In balanced growth $g_y = g_A$, so a persistent edge in TFP growth compounds the income ratio exponentially
- Rich countries have kept faster TFP growth: innovation is concentrated there, technology diffusion is slow, and poverty traps are self-reinforcing
- Inequality eased slightly over 2000-2020 as China grew 7-10% a year and India 6-8%, together a third of the world population
- China is likely to slow as transitional growth ends, India still has catch-up room, and Africa remains largely stagnant
```

### Rising Global Inequality

**Historical trend**: The spread of income per worker across countries has been increasing.

**Measure**: Ratio of the 90th percentile *country* to the 10th percentile *country* — a percentile of countries, not of workers within them
- **1870**: ~5:1
- **1960**: ~15:1
- **2000**: ~25:1
- **Recent**: Slight decline due to China/India growth

**What does this mean?**
- The world has become more unequal in terms of living standards
- Not just that poor countries are poor, but the gap is widening

### Why Is the Gap Growing?

**Solow model explanation**: Different rates of TFP growth
$$y = A \cdot h \cdot \left(\frac{s}{g_A + \delta + n}\right)^{(1-\alpha)/\alpha}$$

In balanced growth, $g_y = g_A$

**If** $g_{A,rich} > g_{A,poor}$, then gap widens:
$$\frac{y_{rich}(t)}{y_{poor}(t)} = \frac{y_{rich}(0)}{y_{poor}(0)} \times e^{(g_{A,rich} - g_{A,poor})t}$$

**Evidence**: Rich countries have maintained faster TFP growth than many poor countries.

**Why?**
1. **Innovation concentrated in rich countries**: R&D, universities, tech sector
2. **Technology diffusion barriers**: Poor countries can't adopt new technologies
3. **Institutional deterioration**: Some poor countries got worse institutions over time
4. **Poverty traps**: Low income $\Rightarrow$ low investment $\Rightarrow$ low TFP growth

### Recent Reversal (China and India)

**2000-2020**: Global inequality declined slightly

**Drivers**:
- **China**: Massive catch-up growth (7-10% per year)
- **India**: Accelerated growth after 1990s reforms (6-8% per year)
- Both countries have 1/3 of world population!

**Future**: Will this continue?
- China: Likely slowdown (transitional growth ending)
- India: Potential for continued catch-up
- Africa: Still mostly stagnant (institutional challenges)

## 10. What We've Learned and What We Haven't

```summary
- The Solow model explains balanced-growth facts, transitional dynamics, conditional convergence, and the effect of saving
- Saving raises the **level** of income, not its growth rate — it only buys a transitional boost
- The model **assumes** technology and its growth rate, so it cannot explain why TFP levels or TFP growth differ
- Long-run growth is handed to an exogenous $g_A$; explaining innovation needs endogenous growth theory
- Countries poor for centuries are a development trap, needing multiple equilibria and complementarities rather than this model
- The open fronts are institutional economics, endogenous growth, misallocation and structural transformation
```

### What the Solow Model Explains Well

1. **Balanced growth facts**:
   - Output per worker grows at rate of technological progress
   - Capital-output ratio stable over time
   - Factor shares (capital, labor) stable over time

2. **Transitional dynamics**:
   - Countries far below steady state grow fast (Japan, Korea, China)
   - Growth slows as countries approach steady state

3. **Conditional convergence**:
   - Countries with similar institutions/education converge to each other
   - Growth rates decline as countries approach their own steady states

4. **Role of saving/investment**:
   - Higher saving leads to higher income level (not higher growth rate)
   - Can generate transitional growth boost

### What the Solow Model Doesn't Explain

1. **Why TFP differs across countries**:
   - Model takes $A$ as exogenous
   - Doesn't explain institutions, barriers to technology adoption

2. **Why TFP growth differs across countries**:
   - Model assumes common $g_A$
   - Doesn't explain why some countries innovate/adopt faster

3. **Long-run growth**:
   - Growth ultimately driven by exogenous $g_A$
   - Need endogenous growth theory (Romer, etc.) to explain innovation

4. **Development traps**:
   - Why do some countries stay poor for centuries?
   - Need models with multiple equilibria, complementarities

### Beyond Growth Accounting: Next Steps

**Institutional economics** (Acemoglu, Robinson):
- Property rights, rule of law, political institutions
- Historical origins: colonization, geography

**Endogenous growth theory** (Romer, Aghion):
- R&D decisions, knowledge spillovers
- Scale effects, variety of goods

**Misallocation** (Hsieh, Klenow):
- Resources in wrong firms/sectors
- Distortions in credit markets, regulations

**Structural transformation** (Kuznets):
- Shift from agriculture to manufacturing to services
- Productivity gaps across sectors

## 11. Policy Implications

```summary
- For developing countries, higher investment buys transitional growth but does not by itself deliver long-run catch-up
- Education raises the income level by roughly 10% per year of schooling, but moving average schooling takes decades
- **Technology adoption** — trade openness, FDI, licensing — is the most important lever on TFP growth
- Institutional reform carries the highest long-run payoff and the hardest politics
- Don't expect automatic catch-up: convergence is conditional, and China's growth was driven by TFP, not by $K$ alone
- Advanced countries are living with slowing TFP growth, shrinking $g_N$ and environmental limits, and must lean on R&D, skills and reallocation
```

### For Developing Countries

**What works**:
1. **Increase investment**: Raise saving rate, attract foreign investment
   - Generates transitional growth
   - But not sufficient for long-run catch-up

2. **Improve education**: Invest in human capital
   - Raises income level significantly (10% per year of schooling)
   - But takes time (decades) to raise average education

3. **Technology adoption**: Remove barriers to importing technology
   - Trade openness, FDI, technology licensing
   - Most important for TFP growth

4. **Institutional reform**: Property rights, rule of law, reduce corruption
   - Hardest to implement but highest long-run payoff
   - Requires political will and stability

**What doesn't work**:
1. **Expecting automatic catch-up**: Convergence is conditional, not absolute
2. **Only accumulating capital**: China's growth driven by TFP, not just $K$
3. **Ignoring education**: Human capital essential complement to physical capital

### For Advanced Countries

**Maintaining growth**:
1. **R&D investment**: Push technology frontier forward
   - Public funding for basic research
   - IP protection, innovation incentives

2. **Education**: Keep skill levels rising
   - Especially STEM fields
   - Lifelong learning, retraining

3. **Reallocation**: Let resources flow to productive uses
   - Minimize distortions, zombie firms
   - Creative destruction (Schumpeter)

**Challenges**:
1. **Slowing TFP growth**: Measured $g_A$ declining in many advanced countries
2. **Aging populations**: $g_N < 0$ in many countries (Japan, Europe)
3. **Environmental constraints**: Climate change, resource limits

## 12. Summary

```summary
- Growth accounting splits output growth into capital, labor, and a Solow residual standing in for TFP
- Human capital raises the income level by about 10% per year of schooling without changing long-run growth
- Across countries TFP dominates: 50-67% of income differences, against 20-30% education and 10-20% capital — overlapping literature ranges, not a split that sums to 100%
- Conditional convergence means fast growth when far below your own steady state, so rich countries converge and poor ones largely do not
- The open mystery is why TFP levels and TFP growth rates differ so much — that needs institutional economics, not this model
```

### Key Concepts

**Growth Accounting**:
- Decompose growth into contributions from $K$, $N$, and $A$
- Solow residual measures TFP growth
- Most important tool for understanding growth sources

**Human Capital**:
- Education raises income level (10% per year of schooling)
- But doesn't change long-run growth rate
- Important for explaining cross-country differences

**Cross-Country Income Differences**:
- 50-67% due to TFP differences — the only share this note actually derives
- 20-30% due to education differences
- 10-20% due to capital accumulation differences

These are **overlapping ranges from the literature, not a partition that sums
to 100%** — added at their extremes they span 80-117%, and only the TFP range
comes from the growth accounting above. The other two are order-of-magnitude
figures: TFP dominates, and the split between education and capital is not
pinned down by anything here.

**Conditional Convergence**:
- Countries converge to their own steady states
- Fast convergence within groups (OECD, East Asia)
- Little convergence globally (different steady states)
- Poor countries often converging to low steady states

**The Big Mystery**:
- Why do TFP levels and growth rates differ so much?
- Growth theory can't answer this - need institutional economics, political economy

### Formulas to Remember

**Growth accounting**:
$$g_A = g_Y - (1-\alpha)g_K - \alpha g_N$$

**Steady-state output per worker** (with human capital):
$$y^* = A \cdot h \cdot \left(\frac{s}{g_A + \delta + n}\right)^{(1-\alpha)/\alpha}$$

**Convergence equation**:
$$g_i \approx g_A - \lambda \left(\log y_i - \log y_i^*\right)$$

Where $\lambda \approx 2\%$ (convergence speed).

### Looking Forward

**Next topic**: Open economy macroeconomics
- How do trade and capital flows affect growth?
- Exchange rates, current accounts, international financial markets
- Interaction between domestic and foreign economies

**Big picture**: Growth theory provides the foundation for understanding long-run prosperity. But institutions, policy, and technology diffusion determine whether countries actually achieve their potential.
