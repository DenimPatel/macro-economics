# Lecture 13: Introduction to Economic Growth

## Overview
This lecture marks the transition from short-run/medium-run analysis (business cycles) to long-run economic growth. We examine why growth matters, how to measure it across countries and time periods, and introduce the fundamental framework for understanding the sources of growth.

## 1. Transition from Short Run to Long Run

### Important Policy Caveat: Speed Can Kill

Before leaving the short/medium run completely, a critical lesson about macroeconomic policy implementation:

**In Financial Crises**: Require overwhelming and rapid response.
- **Why?**: Things happen so fast that even healthy corporations cannot adjust.
- Prices become non-informative, fire sales occur, decision-making breaks down.
- **Policy Response**: Large and fast ("overwhelming force").

**In Normal Times** (e.g., Interest Rate Hiking): Require gradualism.
- **Why?**: For sufficiently large adjustments, something can break.
- The danger: Banks are highly leveraged (small capital relative to assets), so small asset price changes can destroy capital.

### Historical Episodes of Interest Rate Hikes Breaking Things

| Year | Event | What Broke |
|------|-------|------------|
| **1982** | Volcker Hikes | Latin American Debt Crisis ("Lost Decade") |
| | | - Massive capital flows to emerging markets reversed |
| | | - US banks distressed → emerging market crisis |
| **1989-1990** | Fed Hikes | Savings & Loan Crisis |
| | | - Small regional banks couldn't withstand sharp rate rise |
| | | - Similar to 2023 SVB concerns |
| **1990-1991** | Fed Hikes | Japanese Bubble Burst |
| | | - Real estate collapsed in Japan |
| | | - Japan hasn't recovered growth trajectory since |
| **1994-1995** | Fed Hikes | Mexican "Tequila" Crisis |
| | | - Emerging market bond markets exploded |
| | | - Capital flows to emerging markets tightened |
| **2004-2006** | Fed Hikes | Great Financial Crisis (2008) |
| | | - House prices steadily rising during hikes |
| | | - Financial assets built on housing wealth |
| | | - Hikes stopped appreciation → reversal → crisis |
| **2022-2023** | Fed Hikes | Regional Banking Stress (SVB, etc.) |
| | | - Already seeing tremors |
| | | - Unknown what else might blow up |

**Key Insight**: You don't know exactly what will blow up, but history shows something typically does. This is why the Fed practices gradualism when hiking.

---

## 2. Why Growth Matters: The Big Picture

### IMF World Economic Outlook (Growth Forecasts)

| Region | 2022 (Actual) | 2023 (Forecast) | 2024 (Forecast) |
|--------|---------------|-----------------|-----------------|
| **World** | 3.4% | 3.0% | 3.1% |
| **Advanced Economies** | 2.7% | 1.3% | 1.4% |
| **Emerging Markets & Developing** | 3.9% | 4.0% | 4.2% |

**Key Observation**: Regardless of year, emerging markets grow faster than advanced economies.
- **Near-term forecasts** (2023): Dominated by cyclical factors (recessions, booms, IS-LM-PC dynamics).
- **Further-out forecasts** (2024): Dominated by structural trends (growth models we'll study now).

**Question to Answer**: Why do emerging markets systematically grow faster than advanced economies?

### Growth Dominates Business Cycles Over Time

**US GDP (1890-2017)**:
- Real GDP increased **50-fold** (in constant 2012 dollars).
- Compare to business cycle fluctuations: 2-3% up and down.
- **Lesson**: Over longer horizons, you can almost ignore business cycles—it's all about the trend.

**The Great Depression**:
- The only visible disruption in the 130-year trend.
- Even the Great Depression looks small relative to the long-run trend.

### Population Growth vs. GDP Growth

**US Population Growth (1890-2017)**:
- From 63 million → 320 million (5-fold increase).

**Two Different Measures**:
1. **Total GDP**: Increased 50-fold.
2. **GDP per Capita**: Increased only 10-fold (not 50-fold).

**Why This Matters**:
- Total GDP growth captures both population growth and productivity/living standards.
- **GDP per Capita** measures welfare/well-being more accurately.
- The "final pie" is 50x larger, but you have 5x more people to split it among.

### The Declining Role of Population Growth

**Historical**: Steady, high population growth was normal.
- This contributed significantly to GDP growth.

**Current Trend**: Many major regions have zero or negative population growth:
- Japan, South Korea, China
- Most of continental Europe
- Parts of Latin America

**Implication**: Going forward, GDP growth must come from productivity/technology, not population growth.

---

## 3. Measuring Growth: GDP per Capita and PPP

### Within-Country Comparisons: Real GDP per Capita

For a single country over time (e.g., 40-70 years):
- **Reasonable**: Use real GDP per capita (constant prices).
- **Not Perfect**: For very long periods (300+ years), price adjustments become complex.

### Cross-Country Comparisons: The PPP Problem

**Problem**: Exchange rate-based comparisons are misleading.
- Example: US GDP per capita = \$70,000; Italy GDP per capita = \$50,000.
- This comparison doesn't capture true differences in living standards.

**Why?**: Prices differ dramatically across countries.
- Poorer countries have much cheaper goods (especially food and non-tradeables).
- Using market exchange rates understates living standards in poor countries.

**Solution**: **Purchasing Power Parity (PPP) Adjustment**.

### PPP Adjustment: The Logic

**Goal**: Compare real purchasing power, not nominal dollars.

**Method**: Value a common basket of goods at a common set of prices (e.g., US prices).

### Example: US vs. Russia

**Assumptions**:
- Both consume cars and food.
- Cars and food bundles are identical quality in both countries.

**US Household**:
- Buys: 1 car/year (\$10,000) + 1 food bundle/year (\$10,000)
- **Total**: $20,000/year

**Russian Household**:
- Buys: 0.07 cars/year (40,000 rubles) + 1 food bundle/year (80,000 rubles)
- **Total**: 120,000 rubles/year

**Exchange Rate**: 60 rubles per dollar.

#### Without PPP Adjustment
- Convert Russian consumption: 120,000 rubles ÷ 60 = **$2,000/year**
- **Ratio**: US is 10x richer than Russia (\$20,000 ÷ \$2,000 = 10).

#### With PPP Adjustment
- Value Russian consumption at US prices:
  - 0.07 cars × \$10,000 = \$700
  - 1 food bundle × \$10,000 = \$10,000
  - **Total**: $10,700/year
- **Ratio**: US is only 1.87x richer than Russia (\$20,000 ÷ \$10,700 = 1.87).
- Russia is 53% as rich as the US, not 10%.

**Key Insight**: The Russian household consumes fewer cars (changes less frequently—once every 15 years vs. annually), but the food bundle is the same. Valuing at common prices reveals true consumption differences.

### Where to Find PPP-Adjusted Data

- **Penn World Tables**: Comprehensive PPP-adjusted national accounts for most countries.
  - Problem: Not updated frequently.
- **FRED**: Has PPP-adjusted data for some countries (using one of the Penn datasets).

---

## 4. Empirical Patterns in Growth

### Pattern 1: Growth Rates and Initial Income (1950-2017)

**Developed Economies**:

| Country | GDP per Capita (1950) | GDP per Capita (2017) | Average Annual Growth | Ratio (2017/1950) |
|---------|------------------------|------------------------|------------------------|-------------------|
| **Japan** | $6,800 | $37,200 | 2.6% | 5.5x |
| **France** | $7,000 | $39,300 | 2.6% | 5.6x |
| **UK** | $9,000 | $38,500 | 2.1% | 4.3x |
| **US** | $15,200 | $58,000 | 2.0% | 3.8x |

**Key Pattern**: **Richer countries tend to grow slower**.
- The richest country (US in 1950) had the lowest growth rate.
- The poorest countries in 1950 (Japan and France) grew fastest.
- Each row is one number: the 67 years of growth are the ratio, not the rate. A 5.5x gain over
  67 years is $\frac{1}{67}(5.5)^{1/67} - 1 \approx 2.6\%$ a year, which is what the rate column
  reports — and it is why Japan's postwar 1950s-70s figure of 8-10% cannot be used for a
  1950-2017 average.

### Pattern 2: Convergence Among Developed Countries

**Broader Evidence** (25 developed countries, 1950-1987):
- **Scatter Plot**: GDP per capita (1950) on x-axis, Average Annual Growth Rate on y-axis.
- **Clear Pattern**: **Downward sloping relationship**.
  - Countries with lower GDP in 1950 grew faster.
  - Countries with higher GDP in 1950 grew slower.

**Visual Evidence**:
- 1950: Large dispersion in GDP per capita across countries.
- 2018: Much smaller dispersion.
- **Interpretation**: Convergence—poorer countries catching up to richer countries.

### Pattern 3: Convergence Within Regions, Not Globally

**By Region**:
- **OECD (blue squares)**: Clear negative relationship (convergence).
- **Asia (green triangles)**: Negative relationship, slightly noisier.
- **Sub-Saharan Africa (red)**: No convergence pattern at all.

**Why Africa Doesn't Converge**:
- Political conflicts, wars, institutional failures.
- Factors outside standard economic models.
- **Scope of This Course**: We'll focus on OECD/Asia patterns (blue/green).

### Historical Acceleration: The Modern Growth Era

**Very Long-Run Trends**:
- **Before 1850**: Flat growth rates (Malthusian era).
- **1850-1950**: Rapid acceleration in Western Europe and Western Hemisphere.
- **Post-1950**: Global acceleration (except Sub-Saharan Africa).

**The Malthusian Era** (pre-1850):
- Population grew when harvests were good.
- Food constraints limited population growth.
- Most people worked in agriculture; little room for growth.
- **Takeaway**: If you took this course in year 1000 or during the Renaissance, you wouldn't study growth—it didn't exist.

**Modern Era**: Growth is a very modern phenomenon (last 150-200 years).

### Pattern 4: Growth Makes a Huge Difference

**Comparing Countries Over 1950-2016**:

**Example 1: Taiwan vs. Democratic Republic of Congo**
- **1950**: Both had GDP per capita ≈ $1,700.
- **2016**:
  - **Taiwan**: $50,000 (grew by 30x).
  - **DRC**: $800 (declined by 0.5x).
- **Today**: Taiwan is one of the richest economies; DRC is one of the poorest.

**The Asian Tigers**:
- Taiwan, Singapore, Hong Kong, South Korea.
- Grew very fast from 1960s onwards.
- Today: Among the richest economies in the world.

**Lesson**: Small differences in growth rates, sustained over decades, create massive differences in living standards.

---

## 5. The Production Function Framework

### From Short Run to Long Run: What Changes?

| Timeframe | Focus | Production Concerns |
|-----------|-------|---------------------|
| **Short Run** | Aggregate Demand | Supply side ignored; demand determines output. |
| **Medium Run** | Wage Bargaining | Production function: $Y = N$ (labor only). |
| | | Capital ignored (doesn't change much at business cycle frequency). |
| **Long Run** | Growth | Must model capital accumulation explicitly. |
| | | Capital stock changes significantly over decades. |

### The Aggregate Production Function

$$Y = F(K, N)$$

**Inputs**:
- $Y$: Output (GDP)
- $K$: Capital stock (machinery, buildings, equipment, infrastructure)
- $N$: Labor (workers; assume full employment, so $N =$ population)

**Properties**:

#### 1. Constant Returns to Scale (CRS)

**Definition**: If you scale all inputs by $x$, output scales by $x$.

$$F(xK, xN) = xY$$

**Interpretation**:
- If you increase capital and labor by 10%, output increases by 10%.
- The production function is scalable.
- **Example**: Doubling a factory (same machines, same workers) doubles output.

#### 2. Decreasing Returns to Capital (Diminishing Marginal Product)

**Definition**: As you increase capital ($K$) for a fixed amount of labor ($N$), the extra output generated decreases.

$$\frac{\partial^2 Y}{\partial K^2} < 0$$

**Intuition**:
- Each additional unit of capital works with fewer and fewer workers.
- Capital and labor are complementary; fixing one makes the other scarce.

**Example**:
- Start with 100 workers, 100 machines → 100 units of output.
- Add 10 machines (now 110) → +7 units of output (not +10).
- Add 10 more machines (now 120) → +5 units of output (not +7).
- Add 10 more machines (now 130) → +3 units of output (not +5).

**Why?**: With fixed labor, each new machine has fewer workers to operate it effectively.

#### 3. Decreasing Returns to Labor

**Symmetric Logic**: If you fix capital and increase only labor, each additional worker contributes less output.

---

## 6. The Per-Worker Production Function

### Deriving Per-Worker Form

Using Constant Returns to Scale, set $x = \frac{1}{N}$:

$$F\left(\frac{K}{N}, \frac{N}{N}\right) = \frac{Y}{N}$$

$$F\left(\frac{K}{N}, 1\right) = \frac{Y}{N}$$

Define $k \equiv \frac{K}{N}$ (capital per worker) and $y \equiv \frac{Y}{N}$ (output per worker):

$$y = f(k)$$

**Interpretation**: Output per worker depends on capital per worker.

### Properties of $f(k)$

1. **Positive Slope**: $f'(k) > 0$ (more capital per worker → more output per worker).
2. **Concave**: $f''(k) < 0$ (decreasing returns to capital per worker).

### Graphical Representation

**Diagram: Production Function**
- **X-axis**: Capital per worker ($k = K/N$)
- **Y-axis**: Output per worker ($y = Y/N$)
- **Curve**: $y = f(k)$ is upward sloping and concave.

**Key Features**:
- **At low $k$**: Steep slope (high marginal product of capital).
  - Small increase in $k$ → large increase in $y$.
  - Capital is scarce; adding capital has big impact.
- **At high $k$**: Flat slope (low marginal product of capital).
  - Same increase in $k$ → small increase in $y$.
  - Capital is abundant; adding capital has small impact.

**Why Concave?**: Decreasing returns to capital.

---

## 7. Sources of Growth: Two Channels

Based on $y = f(k)$, there are only **two ways** to increase output per worker:

### Channel 1: Capital Accumulation (Moving Along the Curve)

**Mechanism**: Increase $k = \frac{K}{N}$ (capital per worker).

**Effect**: $y$ increases (move up along the production function).

**Limitation**: Decreasing returns to capital.
- As $k$ increases, the gain in $y$ gets smaller and smaller.
- **Cannot sustain growth indefinitely** through capital accumulation alone.

**Example**:
- Poor country (low $k$): Investing in machines yields large output gains.
- Rich country (high $k$): Investing in machines yields small output gains.

**This explains convergence**: Poor countries can grow fast by accumulating capital, while rich countries face diminishing returns.

### Channel 2: Technological Progress (Shifting the Curve Up)

**Mechanism**: The function $f(\cdot)$ itself shifts upward.

**Effect**: For the same $k$, you now produce more $y$.

**Interpretation**: Better technology, better management, better institutions.

**Key Difference**:
- **Capital accumulation**: Subject to diminishing returns (cannot sustain growth).
- **Technological progress**: Not subject to diminishing returns (can sustain growth indefinitely).

**Example**:
- Same number of machines and workers, but better software → higher output.

---

## 8. Preview of Next Lectures

### Lecture 14: The Solow Model (Capital Accumulation)

**Focus**: Channel 1—Capital Accumulation.

**Questions to Answer**:
1. How does capital accumulate over time?
2. Why do poor countries grow faster than rich countries?
3. What determines the steady-state level of capital per worker?
4. Can capital accumulation alone sustain long-run growth?

**Key Insight**: The Solow model explains **convergence** but **not sustained growth**.

### Lecture 15: Technological Progress

**Focus**: Channel 2—Technological Progress.

**Questions to Answer**:
1. How do we model shifts in the production function?
2. What drives technological progress?
3. Can technological progress sustain growth indefinitely?

**Key Insight**: Technological progress is the engine of **sustained long-run growth**.

---

## 9. Summary

### Key Takeaways

1. **Growth Dominates**: Over long periods, trend growth (10x-50x) dwarfs business cycle fluctuations (2-3%).

2. **Population Matters**: GDP growth ≠ welfare growth. Must use GDP per capita.

3. **PPP Adjustment**: Essential for cross-country comparisons. Poorer countries have cheaper goods; market exchange rates mislead.

4. **Empirical Pattern**: **Convergence** among developed/emerging countries (poorer grow faster than richer).
   - Explained by decreasing returns to capital.

5. **Growth is Modern**: Didn't exist before 1850 (Malthusian era). Acceleration post-1950.

6. **Growth Matters**: Small differences in growth rates → huge differences in living standards over decades.
   - Example: Taiwan (30x growth) vs. DRC (0.5x) from same starting point in 1950.

7. **Production Function**: $Y = F(K, N)$ with:
   - Constant returns to scale (scalability).
   - Decreasing returns to capital/labor (diminishing marginal products).

8. **Per-Worker Form**: $y = f(k)$ where $y = Y/N$, $k = K/N$.
   - Concave (decreasing returns).

9. **Two Sources of Growth**:
   - **Capital Accumulation** ($k \uparrow$): Moving along $f(k)$ (explains convergence, limited by diminishing returns).
   - **Technological Progress**: Shifting $f(k)$ upward (explains sustained growth).

### Looking Ahead

- **Next Lecture**: Solow Model—Capital Accumulation and Convergence.
- **Future Lecture**: Technological Progress and Sustained Growth.

---

## Appendix: Key Formulas

### PPP Adjustment
$$\text{Real Consumption (PPP)} = \sum (\text{Quantities consumed}) \times (\text{Common prices})$$

### Production Function Properties
- **Constant Returns to Scale**: $F(xK, xN) = xY$
- **Decreasing Returns to Capital**: $\frac{\partial^2 Y}{\partial K^2} < 0$
- **Per-Worker Form**: $y = f(k)$ where $k = K/N$, $y = Y/N$

### Concavity
$$f'(k) > 0, \quad f''(k) < 0$$

- $f'(k)$: Marginal product of capital (positive).
- $f''(k)$: Diminishing marginal product (negative).
