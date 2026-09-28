# Lecture 15: Technological Progress and Growth

## Overview

```summary
- The Solow model is extended with population growth and then with labor-augmenting technological change
- Diminishing returns to capital mean capital accumulation alone cannot sustain growth in living standards
- Labour-augmenting technology $A$ acts as if the economy had more workers: each worker becomes a more productive input
- Normalizing by effective labor $AN$ brings the model back to the same per-worker diagram as before
- In steady state output per worker grows at $g_A$ alone, so the question of the lecture is what sets that rate
```

This lecture introduces technological progress into the Solow growth model, showing how it enables sustained long-run growth in living standards. We extend the model with population growth to include labor-augmenting technological change and analyze its implications for economic growth across countries.

## 1. Review: The Solow Model with Population Growth

```summary
- Constant returns to scale in capital and labor; labor force and population are interchangeable in a growth model
- Closed economy, no deficit: $I_t = S_t = s Y_t$, so the saving rate $s$ is a fixed share of income
- Normalizing by population turns the model into $y = f(k)$, increasing in $k$ at a decreasing rate
- With population growing at $g_N$: $k_{t+1} - k_t \approx s f(k_t) - (\delta + g_N) k_t$
- Three forces on capital per worker: investment per worker pushes up, depreciation and population dilution push down
- **Population dilution is mechanical**: $k = K/N$ is a ratio, so a growing denominator lowers it even with $K$ unchanged
- A higher $g_N$ rotates the break-even line up, and both $k^*$ and $y^*$ fall even though total output rises to the higher $g_N$
```

### Basic Setup (from Lecture 14)
Starting point: Production function with constant returns to scale in capital ($K$) and labor ($N$).
$$Y = F(K, N)$$

**Note**: In growth models, we use labor force and population interchangeably. Over the long run, these aggregates move in tandem, making the distinction less important for growth analysis.

### Capital Accumulation Equation
$$K_{t+1} = K_t - \delta K_t + I_t$$

Where:
- $K_{t+1} - K_t$: Change in capital stock
- $\delta K_t$: Depreciation of existing capital
- $I_t$: Investment

**Key Assumption (Closed Economy, No Deficit)**:
$$I_t = S_t = s Y_t$$

Investment equals saving, and saving is proportional to income (saving rate $s$).

### Normalization by Population

**Production Function (Per Capita)**:
$$y = f(k) \quad \text{where } y = Y/N, \quad k = K/N$$

- $y$: Output per worker
- $k$: Capital per worker
- $f(k)$: Increasing in $k$ at a decreasing rate (diminishing returns)

### Dynamics with Population Growth

**With Population Growing at Rate $g_N$**:

Starting from capital accumulation equation, divide by $N_{t+1}$:
$$\frac{K_{t+1}}{N_{t+1}} = \frac{K_t}{N_{t+1}}(1 - \delta) + \frac{s Y_t}{N_{t+1}}$$

**Key Step**: Multiply and divide by $N_t$ to express in per-worker terms:
$$\frac{K_{t+1}}{N_{t+1}} = \frac{K_t}{N_t} \frac{N_t}{N_{t+1}}(1 - \delta) + \frac{Y_t}{N_t} \frac{N_t}{N_{t+1}} s$$

**Approximation**: For small $g_N$:
$$\frac{N_t}{N_{t+1}} = \frac{1}{1 + g_N} \approx 1 - g_N$$

**Result** (dropping second-order terms like $\delta \cdot g_N$):
$$k_{t+1} - k_t \approx s f(k_t) - (\delta + g_N) k_t$$

**Interpretation**:
- $s f(k_t)$: **Investment per worker** (increases capital per worker)
- $\delta k_t$: **Depreciation** (reduces capital per worker as machines break down)
- $g_N k_t$: **Population dilution** (reduces capital per worker as population grows)

### Why Does Population Growth Reduce Capital Per Worker?

**Mechanical Effect**: Suppose capital stock $K$ doesn't change, but population grows.
- Denominator of $k = K/N$ is growing $\Rightarrow$ $k$ falls. It is a ratio, so it settles at
  whatever capital the new residents bring with them, and it never goes negative — $K \ge 0$
- **Population dilution**: Need investment just to maintain the same $k$ as population expands

**Policy Implication**: Fast population growth requires more investment to maintain the same capital-labor ratio.

### Steady State Analysis (With Population Growth)

**Steady State Condition**: $k_{t+1} = k_t$ (capital per worker constant)
$$s f(k^*) = (\delta + g_N) k^*$$

**Graphical Representation**:
- **Blue curve**: $f(k)$ (production function per worker)
- **Green curve**: $s f(k)$ (saving/investment per worker)
- **Red line**: $(\delta + g_N) k$ (break-even investment line)

**Steady State**: Where green curve intersects red line.

### Impact of Higher Population Growth

**Experiment**: Increase $g_N$ from initial steady state.

**Effect**:
- **Red line rotates up** (steeper slope)
- At old steady state, now: Investment $<$ Break-even investment
- **Capital per worker declines** to new (lower) steady state

**Intuition**: Higher population growth "dilutes" capital faster. With unchanged saving rate, economy settles at lower $k^*$ and $y^*$.

**Output Growth vs. Output Per Capita**:
- **Total output growth rate**: Increases to higher $g_N$ (more people $\Rightarrow$ more output)
- **Output per worker**: Lower level in new steady state (each worker has less capital)
- **During transition**: Output grows, but less than population (so output per capita falls)

## 2. The Limits of Capital Accumulation

```summary
- Diminishing returns to capital carry the economy to a steady state where capital per worker and output per worker are both constant
- In that steady state, without technology, output grows only because population grows, so living standards stagnate
- Most countries — the U.S., Europe, Asia — have in fact sustained growth in output per worker over time
- So capital accumulation is not the source of long-run growth; something else is needed
```

### Why Capital Accumulation Cannot Drive Long-Run Growth

**Problem**: Due to diminishing returns to capital, economies converge to steady state where:
- Capital per worker is **constant**
- Output per worker is **constant**
- No growth in living standards (output per capita)

**In steady state** (without technological progress):
- Output grows only because population grows
- Living standards (output per worker) stagnate

**Empirical Reality**: Most countries experience sustained growth in output per worker over time (U.S., Europe, Asia).

**Conclusion**: Need another source of growth beyond capital accumulation.

## 3. Technological Progress: The Engine of Sustained Growth

```summary
- **Total Factor Productivity** captures improvements in technology over time, and U.S. TFP has grown steadily for decades
- Technology shows up as more output from the same inputs, better products, entirely new products, and greater variety
- **Labour-augmenting** production function $Y = F(K, AN)$: technology acts as if the economy had more workers
- $AN$ is **effective labor**, labor units in efficiency terms, so a higher $A$ makes each worker a better input
- $g_A$ is the growth rate of $A$ — the quantity this lecture will hand the role of engine
- Modelled this way because it is simple, reuses the same diagrams, and is equivalent to other specifications under certain conditions
```

### What is Technological Progress?

**Total Factor Productivity (TFP)**: Captures improvements in technology over time.

**Empirical Evidence**: TFP in the U.S. has been growing steadily over decades (see TFP index chart from lecture).

### Forms of Technological Progress

1. **More Output from Same Inputs**:
   - 10 machines + 10 workers used to produce 12 units
   - Now produce 14, 15, 16 units with same inputs
   - **Efficiency gains**

2. **Better Products**:
   - Not more cars, but better cars
   - Better computers, better medical devices
   - **Quality improvements**

3. **New Products**:
   - Goods that didn't exist before (smartphones, AI tools)
   - Satisfy needs that were previously unmet
   - **Product innovation**

4. **Greater Variety**:
   - More types of products within categories
   - Better matches between consumer needs and available goods
   - **Welfare gains from variety**

### Modeling Technological Progress

**Production Function with Labor-Augmenting Technology**:
$$Y = F(K, AN)$$

Where:
- $A$: State of technology (TFP level)
- $AN$: **Effective labor** (labor units in efficiency terms)
- $g_A$: Growth rate of $A$ (rate of technological progress)

**Interpretation**: Technology acts as if economy has more workers.
- With same number of people ($N$), higher $A$ means more "effective workers"
- Each worker becomes a better input (more productive)

**Why Model This Way?**
- Simple and tractable
- Allows us to use same diagrams as before
- Equivalent to other specifications (e.g., output-augmenting, capital-augmenting) under certain conditions

## 4. The Solow Model with Technological Progress

```summary
- Normalize by effective labor $AN$ instead of population: constant returns to scale return $\tilde{y} = f(\tilde{k})$
- The law of motion is the old one plus a third term: $\tilde{k}_{t+1} - \tilde{k}_t \approx s f(\tilde{k}_t) - (\delta + g_N + g_A) \tilde{k}_t$
- **Break-even investment has three components**: depreciation, population growth, and technological progress
- The $g_A$ term is dilution too — if $A$ grows and $K$ does not, capital per effective worker falls
- So faster technological progress demands more investment just to hold $\tilde{k}$ constant
- Steady state: $s f(\tilde{k}^*) = (\delta + g_N + g_A) \tilde{k}^*$, where the green curve meets the red line
- In that steady state capital and output per effective worker are both constant
```

### Normalization by Effective Labor

**Key Insight**: To find steady state, normalize by effective labor ($AN$) instead of population ($N$).

**Production Function**:
$$Y = F(K, AN)$$

**By constant returns to scale**, set $x = 1/(AN)$:
$$\frac{Y}{AN} = F\left(\frac{K}{AN}, 1\right)$$

**Define**:
- $\tilde{y} = Y/(AN)$: Output per effective worker
- $\tilde{k} = K/(AN)$: Capital per effective worker

**Result**:
$$\tilde{y} = f(\tilde{k})$$

Same functional form as before, but now in terms of effective labor.

### Capital Accumulation Dynamics

**Start with Basic Equation**:
$$K_{t+1} = (1 - \delta)K_t + s Y_t$$

**Divide by $A_{t+1} N_{t+1}$**:
$$\frac{K_{t+1}}{A_{t+1} N_{t+1}} = \frac{K_t}{A_{t+1} N_{t+1}}(1 - \delta) + \frac{s Y_t}{A_{t+1} N_{t+1}}$$

**Multiply and divide by $A_t N_t$**:
$$\tilde{k}_{t+1} = \tilde{k}_t \frac{A_t N_t}{A_{t+1} N_{t+1}}(1 - \delta) + s \tilde{y}_t \frac{A_t N_t}{A_{t+1} N_{t+1}}$$

**Approximation**: For small $g_A$ and $g_N$:
$$\frac{A_t N_t}{A_{t+1} N_{t+1}} = \frac{1}{(1 + g_A)(1 + g_N)} \approx 1 - g_A - g_N$$

(Dropping second-order terms like $g_A \cdot g_N$)

**Final Dynamics Equation**:
$$\tilde{k}_{t+1} - \tilde{k}_t \approx s f(\tilde{k}_t) - (\delta + g_N + g_A) \tilde{k}_t$$

### Break-Even Investment (Three Components)

**Capital per effective worker** declines due to:

1. **Depreciation** ($\delta \tilde{k}$): Physical wear and tear of capital
2. **Population Growth** ($g_N \tilde{k}$): More people dilute capital per person
3. **Technological Progress** ($g_A \tilde{k}$): Higher $A$ means more effective workers, diluting capital per effective worker

**Intuition for $g_A$ Term**:
- If $A$ grows but $K$ doesn't, then $K/(AN)$ falls
- Need investment to keep up with growing productivity per worker
- Faster technological progress $\Rightarrow$ Need more investment to maintain $\tilde{k}$

### Steady State with Technological Progress

**Steady State Condition**: $\tilde{k}_{t+1} = \tilde{k}_t$ (capital per effective worker constant)
$$s f(\tilde{k}^*) = (\delta + g_N + g_A) \tilde{k}^*$$

**Graphical Representation**:
- **Blue curve**: $f(\tilde{k})$ (output per effective worker)
- **Green curve**: $s f(\tilde{k})$ (saving per effective worker)
- **Red line**: $(\delta + g_N + g_A) \tilde{k}$ (break-even investment per effective worker)

**Steady State**: Where green curve = red line.

**In Steady State**:
- Capital per effective worker ($\tilde{k}$): **Constant**
- Output per effective worker ($\tilde{y}$): **Constant**

## 5. Growth Rates in Steady State

```summary
- The question the section answers: if $\tilde{k}$ and $\tilde{y}$ are constant, what is growing? $A$ and $N$
- Since $y = \tilde{y} \cdot A$, output per worker grows at $g_A$ — at the rate of technological progress
- Capital per worker $k = \tilde{k} \cdot A$ grows at $g_A$ too, so capital intensity rises with productivity
- Total output $Y = \tilde{y} A N$ grows at $g_A + g_N$, and total capital $K$ must grow at that same rate to keep $\tilde{k}$ constant
- $A$ and $N$ are exogenous; every other steady-state growth rate in the table is just them added up
```

### Deriving Steady State Growth Rates

**Question**: If $\tilde{k}$ and $\tilde{y}$ are constant, what is growing?

#### Output Per Worker ($y = Y/N$)

**Relationship**:
$$y = \frac{Y}{N} = \frac{Y}{AN} \cdot A = \tilde{y} \cdot A$$

**Growth Rate**:
- $\tilde{y}$ is constant (growth rate = 0)
- $A$ grows at rate $g_A$
- **Therefore**: $y$ grows at rate $g_A$

$$g_y = g_{\tilde{y}} + g_A = 0 + g_A = g_A$$

**Key Result**: Output per worker grows at rate of technological progress.

#### Capital Per Worker ($k = K/N$)

**Relationship**:
$$k = \frac{K}{N} = \frac{K}{AN} \cdot A = \tilde{k} \cdot A$$

**Growth Rate**:
$$g_k = g_{\tilde{k}} + g_A = 0 + g_A = g_A$$

**Key Result**: Capital per worker also grows at rate $g_A$ (capital intensity increases with productivity).

#### Total Output ($Y$)

**Relationship**:
$$Y = \tilde{y} \cdot AN = \tilde{y} \cdot A \cdot N$$

**Growth Rate**:
$$g_Y = g_{\tilde{y}} + g_A + g_N = 0 + g_A + g_N = g_A + g_N$$

**Key Result**: Total output grows at rate of technological progress plus population growth.

#### Total Capital ($K$)

**Similarly**:
$$g_K = g_A + g_N$$

Capital stock must grow at same rate as output to maintain constant $\tilde{k}$.

### Summary Table: Steady State Growth Rates

| Variable | Symbol | Growth Rate | Interpretation |
|----------|--------|-------------|----------------|
| Output per effective worker | $\tilde{y} = Y/(AN)$ | 0 | Constant (steady state) |
| Capital per effective worker | $\tilde{k} = K/(AN)$ | 0 | Constant (steady state) |
| Output per worker | $y = Y/N$ | $g_A$ | Living standards grow with technology |
| Capital per worker | $k = K/N$ | $g_A$ | Capital intensity grows with technology |
| Total output | $Y$ | $g_A + g_N$ | Technology + population |
| Total capital | $K$ | $g_A + g_N$ | Technology + population |
| Labor/Population | $N$ | $g_N$ | Exogenous |
| Technology | $A$ | $g_A$ | Exogenous |

**Critical Insight**: $g_A$ is the **only** source of sustained growth in living standards (output per worker).

## 6. Policy Experiments and Implications

```summary
- **Higher saving rate**: the green curve shifts up, $\tilde{k}^*$ and $\tilde{y}^*$ rise, and output per worker reaches a permanently higher level
- But the path only shifts up in parallel: a higher $s$ buys transitional growth, then the slope returns to $g_A$
- So the saving rate affects levels, not long-run growth rates
- **Higher $g_A$**: the red line rotates up and $\tilde{k}^*$ falls, because the economy cannot keep pace with faster dilution
- The lower $\tilde{y}$ is deceptive — since $y = \tilde{y} \cdot A$, output per worker grows faster as $A$ grows much faster
- During the transition output per worker grows *slower* than the new steady-state rate, then jumps once the new steady state is reached
- A higher $g_A$ permanently raises the long-run growth rate, which a higher $s$ cannot do
```

### Increase in Saving Rate ($s \uparrow$)

**Effect on Diagram**:
- Green curve ($s f(\tilde{k})$) shifts **up**
- At old steady state, now: Investment $>$ Break-even investment
- Economy moves to **higher** steady state $\tilde{k}^*$ and $\tilde{y}^*$

**Transitional Dynamics**:
- Capital per effective worker grows (faster than $g_A + g_N$)
- Output per effective worker grows (faster than zero)
- **Transitional growth**: Output per worker grows faster than $g_A$ temporarily

**Long-Run Effect**:
- Higher **level** of output per worker
- But **growth rate** returns to $g_A$ (unchanged)

**In log space** (output per worker):
- Old path: Growing at slope $g_A$
- New path: Same slope $g_A$, but higher level (parallel shift up)
- Transition period: Growth rate $> g_A$ (converging to new path)

**Conclusion**: Saving rate affects **levels**, not long-run **growth rates**.

### Increase in Technological Progress ($g_A \uparrow$)

**Effect on Diagram**:
- Red line ($(\delta + g_N + g_A) \tilde{k}$) rotates **up** (steeper)
- At old steady state, now: Investment $<$ Break-even investment
- Capital per effective worker **declines** to new (lower) steady state

**Why Does $\tilde{k}$ Fall?**
- Faster technological progress means effective labor grows faster
- With unchanged saving rate, cannot keep up with dilution from rapid $A$ growth
- Economy settles at lower capital per effective worker

**But This is Deceptive!**

**What Happens to Output Per Worker?**
- $y = \tilde{y} \cdot A$
- Even though $\tilde{y}$ falls slightly (lower $\tilde{k}^*$), $A$ grows much faster
- **Net effect**: $y$ grows faster (new growth rate = higher $g_A$)

**Transitional Dynamics**:
- During transition, growth rate of $y$ is **slower** than new steady state rate
- Why? Capital per effective worker is declining (drag on growth)
- Once reach new steady state, growth rate jumps to new (higher) $g_A$

**In log space** (output per worker):
- Old path: Slope $g_A$
- New path: Steeper slope (new $g_A$)
- Transition: Growth rate between old and new $g_A$ (below new steady state rate)

**Key Lesson**: Increase in $g_A$ permanently raises long-run growth rate (unlike increase in $s$).

## 7. The Asian Miracle: A Growth Decomposition

```summary
- Japan, South Korea, Taiwan and Singapore grew at 8-12% a year, and China later posted similarly high growth
- **Cause one is a low initial capital stock**: war and colonialism left $k$ far below steady state, and diminishing returns bind less at low $k$
- **Cause two is a dramatic rise in saving rates**: Japan's rose from 15% to 35%, China's reached 40-50%, shifting the green curve up
- Low $k$ plus high $s$ gives very fast transitional growth, sustainable for decades while the catch-up lasts
- **The slowdown is the model working**: capital has caught up and $s$ cannot rise much further, so growth falls to ~2-3% in Japan, Korea and Taiwan and 5-6% in China
- Once at steady state output grows at $g_A + g_N$ and output per worker at $g_A$ alone — so with $g_N$ falling or negative, only a higher $g_A$ sustains growth
- Hence China's investment in R&D, AI and green technology: catch-up economies have to become technology leaders, not just adopters
```

### Fast Growth in Southeast Asia (1960s-1990s)

**Observations**:
- Japan, South Korea, Taiwan, Singapore: Growth rates of 8-12% per year
- Later: China (1990s-2010s) with similarly high growth rates
- **Question**: What drove this exceptional growth?

### Sources of Fast Growth

**1. Low Initial Capital Stock** (Convergence):
- Many Asian economies had low $k$ after WWII (Japan) or colonialism (Korea, Taiwan)
- Starting far below steady state $\Rightarrow$ Fast transitional growth
- Diminishing returns less binding when $k$ is low

**2. Dramatic Increase in Saving Rate**:
- Japan: Saving rate rose from 15% to 35%
- Korea/Taiwan: Similar increases
- China: Saving rate reached 40-50%
- This shifts green curve up $\Rightarrow$ Rapid capital accumulation

**Combination**:
- Low initial $k$ + high saving rate $\Rightarrow$ Very fast transitional growth
- Growth rates of 10-12% sustainable for decades during catch-up phase

### The Slowdown Problem

**What Happens Now?**
- Capital per worker has caught up (approaching world frontier)
- Saving rates cannot go much higher (already very high)
- **Growth rates declining** (Japan, Korea, Taiwan now ~2-3%, China slowing to 5-6%)

**Fighting the Solow Model**:
- Policymakers concerned about slowdown (China especially)
- But model predicts: Transitional growth must end
- Once reach steady state, total output grows at $g_A + g_N$ and output per worker at $g_A$ alone

**Challenge**:
- $g_A$: Must innovate (harder for catch-up countries)
- $g_N$: Declining or negative in many Asian economies (aging populations)

**Only Solution**: **Increase $g_A$** (become technology leaders, not just adopters).

**Why China is Obsessed with Technology**:
- To maintain growth at 5-6%, need higher $g_A$ (especially as $g_N \to 0$ or negative)
- Massive investment in R&D, AI, green technology
- Understanding: Solow model says $g_A$ is only source of sustained per capita growth

## 8. Cross-Country Growth Patterns

```summary
- **Unconditional convergence is weak**: poor countries do not automatically catch up with rich ones
- **Conditional convergence is strong**: controlling for saving rates, institutions and education, low initial income predicts faster growth
- Countries converge to *their own* steady state, set by $s$, $g_N$, $g_A$ and institutions — not to one common level
- A low steady state comes from a low $s$, high $g_N$ without productivity gains, low $g_A$, and high effective depreciation from conflict or weak property rights
- Raising $s$ alone is not enough: it is a levels effect, not a growth effect
- The growth lever is $g_A$ — education, R&D, openness to technology transfer and institutions
```

### Convergence Hypothesis

**Prediction**: Countries with lower $k$ (relative to steady state) should grow faster.
- Diminishing returns less binding when $k$ is low
- More room for capital accumulation

**Conditional Convergence**:
- Countries converge to **their own** steady state (determined by $s$, $g_N$, $g_A$, institutions)
- Not all countries converge to same level (different steady states)

**Empirical Evidence**:
- **Unconditional convergence**: Weak (poor countries don't automatically catch up to rich countries)
- **Conditional convergence**: Strong (controlling for saving rates, institutions, education, growth rates negatively related to initial income)

### Why Some Countries Stay Poor

**Model Suggests**:
- Low steady state $\tilde{k}^*$ due to:
  - Low saving rate ($s$)
  - High population growth ($g_N$) without productivity gains
  - Low technological progress ($g_A$): Poor institutions, low education, barriers to technology adoption
  - High effective depreciation (conflict, poor property rights)

**Policy Implications**:
- Increasing $s$ alone insufficient (levels effect, not growth effect)
- Must address $g_A$: Education, R&D, openness to technology transfer, institutions

## 9. The Role of Technological Progress: Summary

```summary
- $g_A$ is the only source of sustained growth in output per worker, because capital accumulation runs into diminishing returns — and per capita too, once population growth is netted off
- A higher $g_A$ raises the return to capital, so it amplifies investment and is complementary to human and physical capital
- Technology spills across borders through trade, FDI and imitation, though the leaders benefit most
- Institutions like MIT generate new technology, train human capital, and supply $g_A$ for the U.S. and the world
- Contrast the instruments: infrastructure spending raises $K$ and gives levels only, education is partly levels and partly $g_A$, R&D subsidies raise $g_A$ directly and permanently
```

### Why $g_A$ is Critical

**1. Only Source of Sustained Growth**:
- Capital accumulation has diminishing returns
- Only technological progress can drive long-run increases in living standards
- The model's result is stated per worker: $y$ grows at $g_A$. Output **per capita** is $y \times (L/N)$, so it grows at $g_A - g_N$ — a lower rate, and the gap is exactly population growth. "Per worker" and "per capita" are not the same series and the note uses both, deliberately, in the two places they are the right one.

**2. Amplifies Effect of Other Factors**:
- Higher $g_A$ $\Rightarrow$ More incentive to invest (returns to capital higher)
- Human capital and physical capital complementary with technology

**3. Spillovers Across Countries**:
- Technology diffuses internationally (trade, FDI, imitation)
- World's $g_A$ benefits all countries (though leaders benefit most)

### The Importance of MIT and Innovation

**What MIT Does** (and similar institutions):
- Generates new technology (increases $A$)
- Trains human capital (increases effective labor)
- Contributes to $g_A$ for the U.S. and world

**Long-Run Impact**:
- Innovation from universities, R&D labs, firms drives $g_A$
- This is the **only sustainable way** to increase living standards indefinitely

**Contrast with Other Policies**:
- Infrastructure spending (increases $K$): Levels effect, not growth effect
- Education spending (increases human capital): Partly a levels effect, partly increases $g_A$ (if generates innovation)
- R&D subsidies: Directly increase $g_A$ (permanent growth effect)

## 10. Extensions and Caveats

```summary
- **$g_A$ is exogenous in this model**; in reality R&D, education, institutions and market size all bear on it
- Endogenous growth theory is the literature that lets $g_A$ respond to economic decisions, and lies beyond this course
- **Other specifications**: capital-augmenting $Y = F(BK, N)$ and Hicks-neutral $Y = AF(K, N)$ join the labor-augmenting form, and under balanced growth all are equivalent in steady state
- **Human capital**: $AN$ folds education and skills into effective labor, so education acts much like technological progress
- **Resource constraints**: the model ignores natural resources, energy and the environment, so growth may run into limits unless technology can substitute for them
```

### What Determines $g_A$?

**In this model**: $g_A$ is exogenous (taken as given).

**In reality**: $g_A$ is determined by:
- R&D investment (private and public)
- Education and human capital
- Institutions (property rights, rule of law, openness)
- Market size (larger markets incentivize more innovation)

**Endogenous Growth Theory**: Models where $g_A$ responds to economic decisions (beyond this course).

### Other Forms of Technological Progress

**Labor-Augmenting** (used here): $Y = F(K, AN)$
- Technology acts like more workers

**Capital-Augmenting**: $Y = F(BK, N)$
- Technology makes capital more productive

**Hicks-Neutral**: $Y = AF(K, N)$
- Technology scales up output for given inputs

**Under certain conditions** (balanced growth), all specifications equivalent in steady state.

### Human Capital

**Extension**: Can think of $AN$ as:
- $A$: Technology
- $N$: Raw labor
- $AN$: Effective labor (includes education, skills)

**Education** increases effective labor, similar to technological progress.

### Resource Constraints

**This model ignores**: Natural resources, energy, environment.

**Extensions**: Include resources $\Rightarrow$ Growth may be constrained unless technology can substitute (e.g., green technology, efficiency gains).

## 11. Key Takeaways

```summary
- Capital accumulation alone cannot sustain output-per-worker growth; diminishing returns make it a levels effect at best
- Technological progress, $g_A$, is the only source of sustained growth in living standards
- In steady state output per worker grows at $g_A$ and total output at $g_A + g_N$
- The saving rate sets levels, not long-run growth: fast growth needs low initial capital plus a high saving rate, and that phase ends
- Sustained growth needs higher $g_A$ — innovation, education, institutions — as population growth slows or reverses; next is growth accounting
```

1. **Capital accumulation alone cannot sustain growth** in output per worker due to diminishing returns.

2. **Technological progress ($g_A$) is the only source of sustained growth** in living standards.

3. **In steady state** with technology:
   - Output per worker grows at rate $g_A$
   - Total output grows at rate $g_A + g_N$

4. **Saving rate** affects **levels** (transitional growth), not long-run **growth rates**.

5. **Policy implications**:
   - To grow fast: Increase saving rate, start with low capital (transitional growth)
   - To sustain growth: Increase $g_A$ through innovation, education, institutions

6. **Asian miracle**: Combination of low initial capital + high saving rates $\Rightarrow$ Fast transitional growth.

7. **Future growth** (China, developed world): Depends critically on increasing $g_A$ as population growth slows or reverses.

8. **The role of innovation**: Universities, R&D, and technological innovation are fundamental to long-run prosperity.

**Next Steps**: Growth accounting (how to measure contributions of capital, labor, and technology to growth).
