# Lecture 2: Definitions - GDP, Unemployment, and Inflation

## Overview

```summary
- The lecture fixes the definitions of **GDP, unemployment and inflation** — the variables the rest of the course moves
- In micro, output is a count and price is one price; in macro both have to be aggregated across millions of goods and services
- GDP turns out to be measurable three equivalent ways, and nominal has to be separated from real
- The backdrop: high inflation, supply chain disruption from COVID and China's reopening, and the war in Ukraine raising energy prices
- Definitions, not models — the first model arrives in Lecture 3
```
This lecture establishes the formal definitions of key macroeconomic variables: GDP (Gross Domestic Product), unemployment, and inflation. Unlike microeconomics, where concepts like "output" and "price" are straightforward, macroeconomics requires careful aggregation across millions of goods and services. We explore three equivalent methods of measuring GDP, distinguish nominal from real GDP, and examine current labor market and inflation data.

**Context**: Current environment features high inflation, supply chain disruptions (COVID, China reopening), and the war in Ukraine affecting energy prices.

## 1. Why Definitions Matter in Macro

```summary
- **The aggregation problem**: in micro, output is a number of cars and price is one car's dollar price; in macro both have to be built from millions of goods and services
- "What is the output of the US economy?" has no obvious answer — apples, health services, banking and entertainment do not add up on their own
- Macro definitions therefore require sophisticated aggregation techniques, not a lookup
- The NIPA was only developed in the late 1940s, after WWII; before that, industrial production was the proxy
- The same words mean something different at the aggregate level, which is why the definitions are worth a lecture
```

### The Aggregation Problem
- **Microeconomics**: Definitions are obvious.
    - Output of a car factory = Number of cars.
    - Price of a car = Dollar price of one car.
- **Macroeconomics**: Millions of goods and services produced simultaneously.
    - **Question**: What is "the output" of the US economy?
    - **Challenge**: How do we add apples, oranges, health services, financial services, and entertainment into a single number?

**Key Insight**: Macro definitions require sophisticated aggregation techniques. The US National Income and Product Accounts (NIPA) were only developed in the late 1940s (post-WWII). Before that, proxies like industrial production were used.

## 2. Gross Domestic Product (GDP)

```summary
- **GDP**: the total market value of all final goods and services produced within a country's borders in a given period
- A **flow** measured over a year or a quarter, **domestic** by location rather than by ownership, and **final** because intermediate goods are excluded to avoid double counting
- "Gross" means depreciation is not deducted — net domestic product would deduct it, but GDP is the measure in use
- A two-firm economy fixes the number: a steel mill sells for 100 dollars, the car maker buys that steel and sells cars for 200, so GDP is 200 and not the 300 of all revenues
- **Final goods approach**: the cars count and the steel does not, and merging the firms into one vertical company leaves GDP unchanged
- **Value added approach**: revenue minus intermediate inputs at every stage — 100 for the steel mill, 100 for the car maker
- **Income approach**: 150 of wages and 50 of profits reach the same 200, so production = income = spending; taxes are zero in this stripped example and must be added back in a real one
```

### Definition
**GDP (Gross Domestic Product)**: The total market value of all **final goods and services** produced within a country during a given period (typically one year or one quarter).

**Key Points**:
- **Flow Variable**: GDP measures production over a period of time (e.g., "US GDP in 2022 was $25.7 trillion").
- **Domestic**: Produced within the country's borders (regardless of ownership nationality).
- **Final Goods**: Excludes intermediate goods to avoid double counting.

**Why "Gross" and not "Net"?** Gross means we don't subtract depreciation of capital. Net Domestic Product (NDP) would subtract depreciation, but we typically use GDP.

### Three Equivalent Methods of Measuring GDP

We use a **simple two-firm economy** to illustrate:
- **Firm 1 (Steel Company)**: Revenue from sales = $100.
- **Firm 2 (Car Company)**: Buys steel for \$100, sells cars for \$200.

**Question**: What is GDP? Is it \$300 (sum of all revenues) or \$200 (final goods only)?

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
- **Steel Company**: Value Added = \$100 - \$0 = \$100 (no intermediate inputs).
- **Car Company**: Value Added = \$200 - \$100 = \$100 (revenue minus steel purchases).
- **Total GDP** = \$100 + \$100 = \$200.

**Key Insight**: Value Added approach avoids double counting by subtracting intermediate inputs at each stage.

#### Method 3: Income Approach
$$\text{GDP} = \text{Sum of all incomes earned in the economy}$$

**Income Categories**:
1. **Labor Income (Wages)**: Payments to workers.
2. **Capital Income (Profits)**: Payments to owners of firms and capital.
3. **Rent and land income**: What the ownership of land and natural resources pays out. The GDP Visualizer beside this lecture splits income into exactly three parts — wages, profits and rent — which is the same list with the government and the rest of the world left out.
4. **Taxes less subsidies**: Collected by the government net of the transfers it pays back. It is a genuine part of national income and a real country's accounts include it, so a list that stops at wages and profits has to say it is a list for the stripped example.
5. **Net factor income from abroad**: What residents earn on foreign assets less what foreigners earn on domestic ones, which is zero in a closed economy.

**In our example**:
- **Wages**: Steel workers (\$80) + Car workers (\$70) = \$150.
- **Profits**: Steel company (\$20) + Car company (\$30) = \$50.
- **Rent**: \$0, the example economy owns no land.
- **Taxes**: \$0, because the example economy is deliberately stripped of government.
- **Total GDP** = \$150 + \$50 + \$0 + \$0 = \$200.

**Fundamental Identity (Closed Economy)**:
$$\text{Production} = \text{Income}$$

**Why This Holds**:
- Every dollar of value added is someone's income, by construction. The \$200 of cars is \$150 paid out as wages and \$50 retained as profit — the *same* \$200 counted from the producing side and the receiving side. The income approach adds up the other side of the value-added arithmetic, not a separate fact.
- The example's three methods are three routes to one number, so "wages + profits = GDP" is true here only because taxes and foreign income are zero. A reader who carries the identity into a real economy without adding them back will be short by exactly the tax take.

**And Why It Matters for Macro** (but not for Micro):
- In **micro**, a car company's income can be spent on anything (food, entertainment, housing).
- In **macro** (closed economy), every dollar of income is spent on the aggregate good produced, because there is no other economy to buy from.
- **Implication**: what is produced = what is earned = what is spent. Production = income is accounting; production = spending is the circular flow, and only the second one is a statement about macro.

### Summary: All Three Methods Yield GDP = $200
- **Final Goods Approach**: Sum only final goods ($200).
- **Value Added Approach**: Sum value added across all firms ($200).
- **Income Approach**: Sum all incomes (wages + profits, plus rent and taxes in a real economy = $200 here).

**Why Use Multiple Methods?** Cross-validation—discrepancies indicate measurement errors.

## 3. Nominal vs. Real GDP

```summary
- **Nominal GDP** can rise for two reasons at once: more output, or higher prices on the same output
- **Real GDP** values every good at fixed base-year prices, which strips out inflation and leaves production growth alone
- A car-only economy over three years shows them splitting: nominal runs 200,000 → 288,000 → 338,000 while real runs only 240,000 → 288,000 → 312,000
- The two are equal in the base year by construction, and nominal growth runs ahead of real everywhere else
- Across 1960-2018 US nominal GDP rose 38x while real GDP rose 5.7x — most nominal growth was price, not production
- **Always analyse growth in real GDP**; nominal misleads over long periods and in high-inflation economies such as Argentina
- Course convention: nominal carries a dollar sign, real does not, and prices are held fixed until Quiz 1
```

### The Problem: Separating Quantity from Prices
- **Nominal GDP** can grow for two reasons:
    1. **Real Growth**: More goods/services produced.
    2. **Inflation**: Higher prices for the same goods/services.
- **Goal**: Isolate real production growth by removing the effect of price changes.

### Definitions

#### Nominal GDP (\$$Y$)
$$\text{Nominal GDP}_t = \sum_{i} P_{it} \times Q_{it}$$

- $P_{it}$: Current price of good $i$ in year $t$.
- $Q_{it}$: Quantity of good $i$ produced in year $t$.
- **Example**: US Nominal GDP in 2023 ≈ $27.7 trillion.

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
- **Nominal GDP (2011)**: \$10 × 20,000 = \$200,000
- **Real GDP (2011)**: \$10 × 24,000 = \$240,000 (using 2012 prices).
- **Nominal GDP (2012)**: \$12 × 24,000 = \$288,000
- **Real GDP (2012)**: \$12 × 24,000 = \$288,000 (**equal** because 2012 is the base year).
- **Nominal GDP (2013)**: \$13 × 26,000 = \$338,000
- **Real GDP (2013)**: \$13 × 24,000 = \$312,000 (using 2012 prices).

**Observations**:
1. **Base Year Property**: Nominal GDP = Real GDP in the base year (2012).
2. **Growth Rates Differ**: Nominal GDP growing faster than Real GDP (due to inflation).

### US Example (1960-2018)
- **Nominal GDP**: Increased by factor of **38x**.
- **Real GDP**: Increased by factor of **5.7x**.
- **Implication**: Most nominal GDP growth was due to inflation, not real production growth.

**Key Insight**: Always use **Real GDP** when analyzing economic growth. Nominal GDP is misleading, especially over long periods or in high-inflation countries (e.g., Argentina: chronic recession but nominal GDP "exploding" due to 10,000%+ inflation).

### Convention in This Course
- **\$$Y$**: Nominal GDP (with dollar sign).
- **$Y$**: Real GDP (no dollar sign).
- **First Part of Course (up to Quiz 1)**: Prices fixed → focus on Real GDP.

## 4. GDP Growth and Recessions

```summary
- Real GDP typically grows around 2% a year, and a recession is a stretch of negative or very low growth
- The Great Recession (2007-2009) contracted output significantly and took unemployment to 10%
- COVID-19 (2020) was far deeper but far shorter: about -30% annualized in the second quarter, then a rapid 2021 recovery
- "Recession" here means two consecutive quarters of negative growth — close to, but not, the official NBER definition
- Growth is the primary indicator of economic health, and a recession is falling output alongside rising unemployment
```

### US GDP Growth (Historical Context)
- **Typical Growth Rate**: ~2% per year (real GDP).
- **Recessions** (shaded areas): Periods of negative or very low growth.
    - **Great Recession (2007-2009)**: GDP contracted significantly; unemployment peaked at 10%.
    - **COVID-19 Recession (2020)**: Massive contraction (~-30% annualized in Q2 2020), but rapid recovery in 2021 as economy reopened.

**Informal Recession Definition**: Two consecutive quarters of negative GDP growth (not the official NBER definition, but close).

**Key Insight**: GDP growth is the primary indicator of economic health. Recessions = periods of falling output and rising unemployment.

## 5. Unemployment

```summary
- **Unemployed** means no job *and* actively looking — anyone who has stopped searching is not in the labor force at all
- **Labor force** is employed plus unemployed, and the **unemployment rate** divides by the labor force, not by the total population
- **Participation rate** is the labor force over the working-age population, so it moves whenever people stop looking for work
- **Discouraged workers** have given up searching after repeated rejections; they are counted as out of the labor force, so the rate understates weakness in a recession
- The figures come from the **Current Population Survey**: a monthly survey of about 77,000 households, asking about employment status and recent job search
- U-6 widens the definition to include discouraged workers and part-timers seeking full-time work
```

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
- **Method**: Monthly survey of ~77,000 households.
- **Questions**: Employment status, job search activity over past two weeks.

### Discouraged Workers
- **Definition**: People who want a job but have stopped searching (e.g., after repeated rejections).
- **Classification**: Counted as **not in labor force** (not unemployed).
- **Issue**: During recessions, discouraged workers spike → unemployment rate **understates** labor market weakness.
    - **Solution**: Use broader measures (e.g., U-6, which includes discouraged workers and part-time workers seeking full-time work).

**Key Insight**: The unemployment rate can be misleading during severe recessions if many workers become discouraged and drop out of the labor force.

## 6. Current US Labor Market (2023)

```summary
- Unemployment is about 3.5%, the lowest since the early 1960s, against a 5-6% norm, a 10% Great Recession peak and a 14.7% COVID peak
- Such low unemployment is a problem because a tight labor market pushes wages up, and wages drive inflation
- Participation rose sharply through the 1960s-1990s as women entered the workforce, then declined gradually over 2000-2020
- It dropped sharply in 2020 and has still not recovered, so the labor force is smaller than expected and shortages push wages up
- The Fed assumed participation would bounce back fully and so underestimated the resulting inflationary pressure
- A strong demand story and a shrunken labor supply are both behind 2023's low unemployment, and both fuel wage inflation
```

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

```summary
- **Inflation** is a sustained rise in the general price level, not a shift in relative prices
- **Deflation** is negative inflation — Japan lived with it through the 1990s-2010s
- "The price level" is not observable, so it is built as a weighted average of many prices
- **GDP deflator** is nominal over real GDP and is the index economists prefer; **CPI** tracks a fixed basket of household consumption and is the one the media cite
- **Core CPI** drops food and energy as volatile noise, yet even it runs above 6% — so the inflation problem is not just those components
- Some argue to drop sticky, lagged shelter costs as well, and inflation stays high on every exclusion
- The two indices differ in basket, weights and imported goods, but they move closely together, so the choice rarely changes the story
```

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

```summary
- **China** grew about 10% a year in real terms through the 1980s-2000s, then 6-7% in the 2010s and roughly 3% in 2022
- That was **catch-up growth**: high marginal returns to capital and to adopting existing technology from a very low income base, so poor countries can converge on rich ones
- The slowdown is structural — aging after the one-child policy, and the fear of "getting old before getting rich" — with Zero-COVID lockdowns adding the cyclical part
- Reopening from late 2022 should bring a temporary boom like the US saw in 2021, but the long-run trend is lower growth
- **Japan** is the warning: roughly 10% catch-up growth in the 1960s, an asset bubble in the late 1980s, then 0-1% growth and near-zero or negative inflation through the 1990s-2010s
- **Deflation traps**: when inflation is negative, real rates stay high even at a zero nominal rate, so monetary policy cannot stimulate the economy
- Japan finally broke above 2% inflation in 2023, and China is watching for the same path
```

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

```summary
- GDP is the value of final output and is measurable three equivalent ways, but growth is always analysed in **real** GDP
- Unemployment is unemployed over the labor force, and participation is labor force over working-age population — so the rate can look healthy while the labor force has shrunk
- Inflation is a sustained rise in the general price level, measured by the GDP deflator, the CPI or core CPI, and on every measure 2023 sits far above the 2% target
- **Production = income** in a closed economy — a circular flow microeconomics does not have
- 2023 in one line: US unemployment near 3.5% with inflation around 6-8%, China's reopening boom against a slowing trend, Japan escaping deflation
```

### Key Definitions
1. **GDP**: Total value of final goods and services produced in an economy during a period.
    - **Three Methods**: Final goods, value added, income (all equivalent).
2. **Nominal GDP**: Measured using current prices (\$$Y$).
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
