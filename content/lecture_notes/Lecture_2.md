# Lecture 2: Definitions - GDP, Unemployment, and Inflation

## Overview
This lecture establishes the formal definitions of key macroeconomic variables: GDP (Gross Domestic Product), unemployment, and inflation. Unlike microeconomics, where concepts like "output" and "price" are straightforward, macroeconomics requires careful aggregation across millions of goods and services. We explore three equivalent methods of measuring GDP, distinguish nominal from real GDP, and examine current labor market and inflation data.

**Context**: Current environment features high inflation, supply chain disruptions (COVID, China reopening), and the war in Ukraine affecting energy prices.

## 1. Why Definitions Matter in Macro

### The Aggregation Problem
- **Microeconomics**: Definitions are obvious.
    - Output of a car factory = Number of cars.
    - Price of a car = Dollar price of one car.
- **Macroeconomics**: Millions of goods and services produced simultaneously.
    - **Question**: What is "the output" of the US economy?
    - **Challenge**: How do we add apples, oranges, health services, financial services, and entertainment into a single number?

**Key Insight**: Macro definitions require sophisticated aggregation techniques. The US National Income and Product Accounts (NIPA) were only developed in the late 1940s (post-WWII). Before that, proxies like industrial production were used.

## 2. Gross Domestic Product (GDP)

### Definition
**GDP (Gross Domestic Product)**: The total market value of all **final goods and services** produced within a country during a given period (typically one year or one quarter).

**Key Points**:
- **Flow Variable**: GDP measures production over a period of time (e.g., "US GDP in 2022 was $23 trillion").
- **Domestic**: Produced within the country's borders (regardless of ownership nationality).
- **Final Goods**: Excludes intermediate goods to avoid double counting.

**Why "Gross" and not "Net"?** Gross means we don't subtract depreciation of capital. Net Domestic Product (NDP) would subtract depreciation, but we typically use GDP.

### Three Equivalent Methods of Measuring GDP

We use a **simple two-firm economy** to illustrate:
- **Firm 1 (Steel Company)**: Revenue from sales = $100.
- **Firm 2 (Car Company)**: Buys steel for $100, sells cars for $200.

**Question**: What is GDP? Is it $300 (sum of all revenues) or $200 (final goods only)?

**Answer**: GDP = $200 (final goods only). Here's why, shown three ways:

#### Method 1: Final Goods Approach
$$\text{GDP} = \text{Value of final goods and services produced}$$

- **Final Goods**: Goods purchased by end-users (consumers, firms for investment, government, foreigners).
- **Intermediate Goods**: Goods used as inputs in production (e.g., steel used to make cars).

**In our example**:
- Cars are final goods (sold to consumers) = $200.
- Steel is an intermediate good (used to make cars), so **excluded**.

**Robustness Test**: Suppose the car company merges with the steel company (vertical integration).
- Now steel production is "in-house" (not sold externally).
- GDP = $200 (only final output: cars).
- **Result**: GDP unchanged by ownership structure. This confirms we should only count final goods.

**Key Insight**: Counting only final goods ensures GDP is invariant to organizational structure (vertical integration, outsourcing, etc.).

#### Method 2: Value Added Approach
$$\text{GDP} = \sum \text{Value Added by all firms}$$

**Value Added**: Revenue minus cost of intermediate inputs.
- **Steel Company**: Value Added = $100 - $0 = $100 (no intermediate inputs).
- **Car Company**: Value Added = $200 - $100 = $100 (revenue minus steel purchases).
- **Total GDP** = $100 + $100 = $200.

**Key Insight**: Value Added approach avoids double counting by subtracting intermediate inputs at each stage.

#### Method 3: Income Approach
$$\text{GDP} = \text{Sum of all incomes earned in the economy}$$

**Income Categories**:
1. **Labor Income (Wages)**: Payments to workers.
2. **Capital Income (Profits)**: Payments to owners of firms and capital.
3. **Taxes** (in realistic economies).

**In our example**:
- **Wages**: Steel workers ($80) + Car workers ($70) = $150.
- **Profits**: Steel company ($20) + Car company ($30) = $50.
- **Total GDP** = $150 + $50 = $200.

**Fundamental Identity (Closed Economy)**:
$$\text{Production} = \text{Income}$$

**Why This Matters for Macro** (but not for Micro):
- In **micro**, a car company's income can be spent on anything (food, entertainment, housing).
- In **macro** (closed economy), aggregate income **must** be spent on the aggregate good produced (no other economy to buy from).
- **Implication**: In macro, what is produced = what is earned = what is spent (circular flow).

**Key Insight**: This production-income-expenditure equivalence is fundamental to macroeconomic analysis. It's a distinctive feature of macro absent in micro.

### Summary: All Three Methods Yield GDP = $200
- **Final Goods Approach**: Sum only final goods ($200).
- **Value Added Approach**: Sum value added across all firms ($200).
- **Income Approach**: Sum all incomes (wages + profits = $200).

**Why Use Multiple Methods?** Cross-validation—discrepancies indicate measurement errors.

## 3. Nominal vs. Real GDP

### The Problem: Separating Quantity from Prices
- **Nominal GDP** can grow for two reasons:
    1. **Real Growth**: More goods/services produced.
    2. **Inflation**: Higher prices for the same goods/services.
- **Goal**: Isolate real production growth by removing the effect of price changes.

### Definitions

#### Nominal GDP ($\$Y$)
$$\text{Nominal GDP}_t = \sum_{i} P_{it} \times Q_{it}$$

- $P_{it}$: Current price of good $i$ in year $t$.
- $Q_{it}$: Quantity of good $i$ produced in year $t$.
- **Example**: US Nominal GDP in 2023 ≈ $24 trillion.

#### Real GDP ($Y$)
$$\text{Real GDP}_t = \sum_{i} P_{i,\text{base}} \times Q_{it}$$

- $P_{i,\text{base}}$: Constant price from a **base year** (e.g., 2012).
- $Q_{it}$: Quantity of good $i$ produced in year $t$ (changes over time).

**Key Feature**: Real GDP uses constant prices → removes effect of inflation → measures true production growth.

### Numerical Example

**Simple Economy** (produces only cars):

| Year | Quantity (Cars) | Price ($/car) | Nominal GDP | Real GDP (Base 2012) |
|------|----------------|---------------|-------------|----------------------|
| 2011 | 10             | $20,000       | $200,000    | $240,000             |
| 2012 | 12             | $24,000       | $288,000    | $288,000             |
| 2013 | 13             | $26,000       | $338,000    | $312,000             |

**Calculations**:
- **Nominal GDP (2011)**: $10 \times 20,000 = \$200,000$.
- **Real GDP (2011)**: $10 \times 24,000 = \$240,000$ (using 2012 prices).
- **Nominal GDP (2012)**: $12 \times 24,000 = \$288,000$.
- **Real GDP (2012)**: $12 \times 24,000 = \$288,000$ (**equal** because 2012 is the base year).
- **Nominal GDP (2013)**: $13 \times 26,000 = \$338,000$.
- **Real GDP (2013)**: $13 \times 24,000 = \$312,000$ (using 2012 prices).

**Observations**:
1. **Base Year Property**: Nominal GDP = Real GDP in the base year (2012).
2. **Growth Rates Differ**: Nominal GDP growing faster than Real GDP (due to inflation).

### US Example (1960-2018)
- **Nominal GDP**: Increased by factor of **38x**.
- **Real GDP**: Increased by factor of **5.7x**.
- **Implication**: Most nominal GDP growth was due to inflation, not real production growth.

**Key Insight**: Always use **Real GDP** when analyzing economic growth. Nominal GDP is misleading, especially over long periods or in high-inflation countries (e.g., Argentina: chronic recession but nominal GDP "exploding" due to 10,000%+ inflation).

### Convention in This Course
- **$\$Y$**: Nominal GDP (with dollar sign).
- **$Y$**: Real GDP (no dollar sign).
- **First Part of Course (up to Quiz 1)**: Prices fixed → focus on Real GDP.

## 4. GDP Growth and Recessions

### US GDP Growth (Historical Context)
- **Typical Growth Rate**: ~2% per year (real GDP).
- **Recessions** (shaded areas): Periods of negative or very low growth.
    - **Great Recession (2007-2009)**: GDP contracted significantly; unemployment peaked at 10%.
    - **COVID-19 Recession (2020)**: Massive contraction (~-30% annualized in Q2 2020), but rapid recovery in 2021 as economy reopened.

**Informal Recession Definition**: Two consecutive quarters of negative GDP growth (not the official NBER definition, but close).

**Key Insight**: GDP growth is the primary indicator of economic health. Recessions = periods of falling output and rising unemployment.

## 5. Unemployment

### Definitions

#### Labor Market Categories
1. **Employed**: Persons with jobs.
2. **Unemployed**: Persons who:
    - Do **not** have a job.
    - **Are actively looking** for a job (searched in the last 2 weeks).
3. **Not in Labor Force**: Persons who do not have a job and are **not** looking.
    - Examples: Students, retirees, discouraged workers, stay-at-home parents.

#### Key Concepts
- **Labor Force** ($L$): $L = \text{Employed} + \text{Unemployed}$.
- **Unemployment Rate** ($u$):
$$u = \frac{\text{Unemployed}}{\text{Labor Force}} = \frac{\text{Unemployed}}{\text{Employed} + \text{Unemployed}}$$

- **Participation Rate**:
$$\text{Participation Rate} = \frac{\text{Labor Force}}{\text{Working-Age Population}}$$

**Important**: Unemployment rate is unemployment divided by **labor force**, not total population.

### Measurement: Current Population Survey (CPS)
- **Method**: Monthly survey of ~60,000 households.
- **Questions**: Employment status, job search activity over past two weeks.

### Discouraged Workers
- **Definition**: People who want a job but have stopped searching (e.g., after repeated rejections).
- **Classification**: Counted as **not in labor force** (not unemployed).
- **Issue**: During recessions, discouraged workers spike → unemployment rate **understates** labor market weakness.
    - **Solution**: Use broader measures (e.g., U-6, which includes discouraged workers and part-time workers seeking full-time work).

**Key Insight**: The unemployment rate can be misleading during severe recessions if many workers become discouraged and drop out of the labor force.

## 6. Current US Labor Market (2023)

### Unemployment Rate: Historically Low
- **Current**: ~3.5% (lowest since early 1960s).
- **Great Recession Peak**: 10%.
- **COVID Peak**: 14.7%.
- **Normal**: 5-6%.

**Paradox**: Why is such low unemployment a "problem"?
- **Answer**: Tight labor market → Wage pressures → Inflation (as discussed in Lecture 1).

### Participation Rate: The Missing Workers
- **Trend (1960s-1990s)**: Sharp rise in participation rate.
    - **Cause**: Women entering the workforce (major social/economic shift).
- **Trend (2000-2020)**: Gradual decline (aging population, earlier retirements).
- **COVID Shock**: Participation rate dropped sharply in 2020.
    - **Reasons**: Childcare/eldercare responsibilities, early retirements, sector-specific (e.g., restaurants) job losses.
- **Current Issue**: Participation rate **has not recovered** to pre-COVID levels.
    - **Implication**: Labor force smaller than expected → Severe labor shortages → Upward wage pressure.

**Federal Reserve Miscalculation**: Fed expected participation rate to bounce back fully. It didn't → Fed underestimated inflationary pressures from tight labor market.

**Key Insight**: Low unemployment rate in 2023 partly reflects strong demand, but also reflects **reduced labor supply** (low participation). This combination fuels wage inflation.

## 7. Inflation

### Definition
**Inflation** ($\pi$): A sustained rise in the **general price level**.
- Not about relative prices (e.g., cars becoming more expensive than hotels).
- About **all prices** rising on average.

**Deflation**: Negative inflation (prices falling). Example: Japan (1990s-2010s).

### Measuring Inflation

#### The Price Level ($P_t$)
- **Challenge**: How do we define "the price" when there are millions of goods?
- **Solution**: Construct a price index (weighted average of many prices).

#### Method 1: GDP Deflator
$$\text{GDP Deflator}_t = \frac{\text{Nominal GDP}_t}{\text{Real GDP}_t}$$

- **Interpretation**: Ratio of nominal to real GDP.
- **Inflation Rate** (using GDP Deflator):
$$\pi_t = \frac{P_t - P_{t-1}}{P_{t-1}} \times 100\%$$

- **Usage**: Economists prefer this, but rarely mentioned in media.

#### Method 2: Consumer Price Index (CPI)
- **Construction**: Tracks the cost of a **fixed basket** of goods and services consumed by typical households.
    - Basket includes: Food, housing, transportation, medical care, entertainment, etc.
- **Inflation Rate** (using CPI):
$$\pi_t^{\text{CPI}} = \frac{\text{CPI}_t - \text{CPI}_{t-1}}{\text{CPI}_{t-1}} \times 100\%$$

- **Usage**: Most commonly cited in media; directly relevant to consumers.

#### Core CPI
- **Definition**: CPI excluding **food and energy** (volatile components).
- **Rationale**: Food and energy prices fluctuate wildly due to weather, geopolitics → not indicative of underlying inflation trends.
- **Current**: Even Core CPI is elevated (~6%+), so inflation problem is **not** just volatile components.

**Recent Debate**: Some argue to also exclude **shelter** (housing costs), which is sticky and lagged. But even with these exclusions, inflation remains high.

**Key Insight**: No matter which price index you use, the US (and most of the world) has an inflation problem in 2023—far above the 2% target.

### GDP Deflator vs. CPI: Key Differences
1. **Basket**: GDP Deflator covers all goods produced (including investment goods); CPI covers only consumer goods.
2. **Weights**: GDP Deflator uses current weights (Paasche index); CPI uses fixed weights (Laspeyres index).
3. **Imports**: CPI includes imported goods; GDP Deflator does not (GDP is domestic production).

**Practical Implication**: The two move closely together in most periods, so the choice rarely matters for broad analysis.

## 8. International Comparisons

### China: Catch-Up Growth

#### Historical Growth Rates
- **1980s-2000s**: ~10% annual real GDP growth.
- **2010s**: ~6-7% (slowing).
- **2022**: ~3% (COVID-related slowdown).

**Why So Fast (Historically)?**
- **Catch-Up Growth**: Starting from a very low income level → high marginal returns to capital and technology adoption.
- **Convergence**: Poor countries can grow faster than rich countries (explained in Lecture 14-16 on growth theory).

**Current Concerns**:
- **Slowing Growth**: China worried about "getting old before getting rich."
- **Demographic Challenges**: One-child policy → aging population → shrinking labor force.

#### COVID-19 Impact
- **Zero-COVID Policy**: Extremely strict lockdowns → significant economic contraction.
- **Reopening (Late 2022/Early 2023)**: Expected boom (similar to US post-COVID bounce in 2021).

**Key Insight**: China's slowdown is partly structural (convergence, demographics) and partly COVID-related. Reopening will boost growth temporarily, but long-run trend is declining growth rates.

### Japan: The Deflationary Trap

#### Post-War Boom (1950s-1980s)
- **1960s**: Very high growth (~10%), similar to China's recent experience.
- **Reason**: Catch-up growth after WWII devastation.

#### The Bubble and Crash (Late 1980s-Early 1990s)
- **Late 1980s**: Massive asset price bubble (equities, real estate).
    - **Example**: Imperial Palace grounds in Tokyo worth as much as entire state of California (absurd valuation).
- **Early 1990s**: Bubble burst → decades of stagnation ("Lost Decades").
- **Growth Since 1990**: Very low (~0-1% annually).

#### The Deflation Problem
- **Inflation Rate**: Near zero or negative (deflation) for most of 1990s-2010s.
- **Problem**: Deflation makes monetary policy ineffective.
    - **Mechanism**: Real interest rate = Nominal rate - Inflation. If inflation is negative, real rates are high even when nominal rates are zero → difficult to stimulate the economy.
- **Current (2023)**: Japan finally has inflation above 2% (for the first time in decades).

**China's Fear**: China worries about following Japan's path—slowdown happening before reaching high income levels.

**Key Insight**: Japan's experience shows that financial bubbles followed by deflation can trap an economy in prolonged stagnation. Demographics (aging) exacerbate the problem.

## 9. Summary

### Key Definitions
1. **GDP**: Total value of final goods and services produced in an economy during a period.
    - **Three Methods**: Final goods, value added, income (all equivalent).
2. **Nominal GDP**: Measured using current prices ($\$Y$).
3. **Real GDP**: Measured using constant (base year) prices ($Y$).
    - **Use Real GDP** for growth analysis.
4. **Unemployment Rate**: $u = \frac{\text{Unemployed}}{\text{Labor Force}}$.
    - **Unemployed**: No job + actively searching.
5. **Participation Rate**: $\frac{\text{Labor Force}}{\text{Working-Age Population}}$.
6. **Inflation**: Sustained rise in the general price level.
    - **GDP Deflator**: $\frac{\text{Nominal GDP}}{\text{Real GDP}}$.
    - **CPI**: Cost of a fixed basket of consumer goods.
    - **Core CPI**: Excludes food and energy.

### Current Economic Conditions (2023)
- **US**: Low unemployment (~3.5%), high inflation (~6-8%), rising interest rates.
- **Participation Rate**: Below pre-COVID levels → labor supply constrained → wage pressures.
- **Global**: Nearly all countries have inflation above 2%.
- **China**: Reopening from Zero-COVID → expected boom, but long-run growth slowing.
- **Japan**: Finally escaping deflation after decades of stagnation.

### Key Insights
1. **Production = Income** in a closed economy (distinctive macro feature).
2. **Always use Real GDP** to analyze economic growth (remove inflation effects).
3. **Unemployment rate can be misleading** if participation rate shifts (discouraged workers).
4. **Inflation is a macro problem** even though low unemployment + high wages sound good for individuals.

### Coming Up
- **Lecture 3**: First model—how is equilibrium GDP determined in the short run? (The goods market and the multiplier).

**Next**: We begin building models to understand how GDP, unemployment, and inflation interact.
