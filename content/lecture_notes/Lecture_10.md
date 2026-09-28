# Lecture 10: Comprehensive Review for Quiz 1

## Overview

```summary
- Recaps lectures 1-8: definitions, the goods market, financial markets, IS-LM, the risk and inflation extensions, and the labor market
- What to hold onto: key concepts, the equations, graphical analysis, and policy applications
- Roughly two-thirds of Quiz 1 is IS-LM analysis, so the model's mechanics matter more than the definitions
- The thread running through it: build the goods market, add financial markets to get IS-LM, then shock it with risk and inflation
- The labor market is in scope but carries less weight on the quiz
```
This lecture provides a comprehensive review of material from Lectures 1-8, covering basic definitions, the goods market, financial markets, the IS-LM model, extensions incorporating risk and inflation, and the labor market. This review emphasizes key concepts, equations, graphical analysis, and policy applications. Approximately two-thirds of Quiz 1 will focus on IS-LM analysis.

---

## 1. Measuring Aggregate Output (GDP)

```summary
- **Aggregate measurement must avoid double counting**: in the two-firm example the steel worth USD 100 is an intermediate input, so the naive 100 + 200 = 300 is wrong and GDP is 200
- **Three equivalent methods** — final goods, value added (revenue minus intermediate inputs), and income (wages plus profits) — all give the same answer, 200
- **Value added and income survive a merger**: if the two firms combine, GDP is still 200, where the naive sum would wrongly fall from 300 to 200
- **Nominal GDP** values output at current prices and **real GDP** at base-year prices, so 2013 output is USD 288,000 real against USD 300,000 nominal
- **The base year only matters with multiple goods**, because relative prices move over time; with a single good the growth rate is unaffected
- **Unemployment rate** is the unemployed over the labor force — employed plus those actively seeking work — not over total population
- **Inflation** is the rate of change of the price level, and more than one index exists — the GDP deflator, the CPI, and others
```

### The Measurement Problem
At the individual firm level, measuring output is straightforward. At the aggregate level, we must avoid double-counting intermediate goods.

### Example: Two-Firm Economy
- **Steel Company**: Produces $100 of steel (all sold to car company as intermediate input)
- **Car Company**: Produces $200 of cars (final goods)
- **Naive Sum**: \$100 + \$200 = \$300 (WRONG - double counts steel)
- **Correct GDP**: $200

### Three Equivalent Methods for Measuring GDP

#### Method 1: Final Goods Approach
- **Definition**: GDP = Sum of value of all final goods only
- **Final Goods**: Goods sold to end users, not as inputs to other firms
- **Example**: Only cars ($200) are final goods, steel is intermediate
- **Result**: GDP = $200

#### Method 2: Value Added Approach
- **Definition**: Value Added = Revenue - Cost of Intermediate Inputs
- **Steel Company**:
    - Revenue = $100
    - Intermediate inputs = $0
    - Value added = $100
- **Car Company**:
    - Revenue = $200
    - Intermediate inputs = $100 (steel)
    - Value added = \$200 - \$100 = \$100
- **Total Value Added**: \$100 + \$100 = \$200
- **Result**: GDP = $200

#### Method 3: Income Approach
- **Definition**: GDP = Sum of all incomes (wages + profits)
- **Steel Company**:
    - Wages = $80
    - Profits = $20
    - Total income = $100
- **Car Company**:
    - Wages = $70
    - Profits = $30
    - Total income = $100
- **Total Income**: \$100 + \$100 = \$200
- **Result**: GDP = $200

### Key Properties
1. **All three methods yield identical results**
2. **Immune to organizational structure changes**: If the two companies merged, GDP would still be $200
3. **Avoids double counting**: Unlike naive summation, which would incorrectly change from \$300 to \$200 upon merger

### Nominal vs. Real GDP

#### Definitions
- **Nominal GDP**: $\text{GDP}_{\text{nominal}} = P_t \times Q_t$ (measured at current prices)
- **Real GDP**: $\text{GDP}_{\text{real}} = P_{\text{base}} \times Q_t$ (measured at base year prices)

#### Example: Single Good Economy (Cars)
| Year | Quantity | Price | Nominal GDP | Real GDP (base=2012) |
|------|----------|-------|-------------|---------------------|
| 2012 | 10 | $24,000 | $240,000 | $240,000 |
| 2013 | 12 | $25,000 | $300,000 | $288,000 |
| 2014 | 13 | $26,000 | $338,000 | $312,000 |

- **Real GDP in 2012**: \$24,000 × 10 = \$240,000
- **Real GDP in 2013**: \$24,000 × 12 = \$288,000 (NOT \$25,000 × 12)
- **Real GDP in 2014**: \$24,000 × 13 = \$312,000

#### Note on Multiple Goods
- With one good, choice of base year doesn't affect growth rate
- With multiple goods, base year matters because relative prices change over time

### Other Key Definitions

#### Unemployment Rate
$$u = \frac{\text{Number of Unemployed}}{\text{Labor Force}}$$
- **Note**: Denominator is labor force, NOT total population
- Labor Force = Employed + Unemployed (actively seeking work)

#### Inflation Rate
$$\pi_t = \frac{P_t - P_{t-1}}{P_{t-1}} = \frac{\Delta P}{P}$$
- Multiple price indices exist: GDP deflator, CPI, etc.

---

## 2. The Goods Market: Keynesian Cross Model

```summary
- **Closed-economy aggregate demand** is $Z = C + I + G$ — no exports or imports, and net exports are not on Quiz 1
- **Consumption** is $C = c_0 + c_1(Y - T)$: autonomous consumption $c_0$, an MPC $c_1$ between 0 and 1, applied to disposable income
- **Equilibrium is $Y = Z$**, so output is demand-determined, and solving gives $Y = \frac{1}{1-c_1}[c_0 + I + G - c_1 T]$
- **The multiplier is $1/(1-c_1)$**: an extra unit of autonomous spending is echoed back round after round — with $c_1 = 0.5$ it is 2
- **Graphically**, aggregate demand has vertical intercept $c_0 + I + G - c_1 T$ and slope $c_1$, and it shifts up when $c_0$, $I$ or $G$ rises or $T$ falls
- **The same equilibrium condition is $S_{private} + S_{government} = I$** — private saving $Y - T - C$ plus the budget surplus $T - G$
- **Paradox of savings**: if everyone tries to save more, income falls far enough that total saving does not rise. Lecture 3's name for it; "paradox of thrift" is the same result
```

### Components of Aggregate Demand (Closed Economy)
$$Z = C + I + G$$
- **Closed Economy Assumption**: No exports or imports (not on Quiz 1)
- $C$: Consumption
- $I$: Investment
- $G$: Government expenditure

### The Consumption Function
$$C = c_0 + c_1(Y - T)$$

#### Parameters
- **$c_0$**: Autonomous consumption (consumption when disposable income = 0)
- **$c_1$**: Marginal Propensity to Consume (MPC)
    - $0 < c_1 < 1$
    - Interpretation: Out of an additional dollar of disposable income, $c_1$ is consumed
- **$Y - T$**: Disposable income (income minus taxes)

#### Properties
- **Upward sloping** in disposable income
- **Slope** = $c_1$ < 1

### Equilibrium Condition
$$Y = Z$$
Output equals aggregate demand (demand-determined output).

### Solving for Equilibrium Output
Starting from:
$$Y = c_0 + c_1(Y - T) + I + G$$

Rearranging:
$$Y - c_1 Y = c_0 + I + G - c_1 T$$
$$Y(1 - c_1) = c_0 + I + G - c_1 T$$

**Equilibrium Output**:
$$Y = \frac{1}{1-c_1} [c_0 + I + G - c_1 T]$$

### The Multiplier

#### Definition
$$\text{Multiplier} = \frac{1}{1-c_1} > 1$$

#### Interpretation
- An increase in autonomous spending (e.g., $\Delta G = 1$) leads to a larger increase in equilibrium output
- **Why?**: Initial spending increase generates income, which is partly consumed, generating more income, etc.
- **Example**: If $c_1 = 0.5$, then multiplier = $\frac{1}{1-0.5} = 2$

#### Multiplier Effect in Action
If $\Delta c_0 = 1$:
1. Initial increase in demand: $\Delta Z = 1$
2. Output rises by 1 (to meet demand)
3. Income rises by 1, consumption rises by $c_1$
4. Demand rises further by $c_1$, output rises by $c_1$
5. Process continues...
6. **Final change in output**: $\Delta Y = \frac{1}{1-c_1} > 1$

### Graphical Representation

#### Aggregate Demand Curve
- **Equation**: $Z = c_0 + c_1(Y - T) + I + G$
- **Vertical intercept**: $c_0 + I + G - c_1 T$
- **Slope**: $c_1$ (less than 1)

#### Equilibrium
- **45-degree line**: Points where $Y = Z$
- **Intersection**: Determines equilibrium output $Y^*$
- At equilibrium: Aggregate demand = Aggregate supply

### Shifts in Aggregate Demand

#### Upward Shifts (Expansionary)
- Increase in $c_0$ (consumer confidence)
- Increase in $I$ (investment optimism)
- Increase in $G$ (government spending)
- Decrease in $T$ (tax cuts)

#### Example: Increase in $c_0$
- Aggregate demand shifts up by $\Delta c_0$
- Equilibrium output increases by $\frac{1}{1-c_1} \Delta c_0$ (multiplier effect)

### Alternative Equilibrium Condition: Saving = Investment

#### Derivation
Starting from $Y = C + I + G$:
$$Y - C - G = I$$
$$(Y - T - C) + (T - G) = I$$
$$S_{\text{private}} + S_{\text{government}} = I$$

Where:
- **Private Saving**: $S_{\text{private}} = Y - T - C$
- **Government Saving**: $S_{\text{government}} = T - G$ (budget surplus)

### The Paradox of Savings (Paradox of Thrift)

#### Scenario
Suppose consumers decide to save more: $c_0 \downarrow$

#### What Happens?
1. **Aggregate demand decreases**: $Z$ shifts down
2. **Output falls**: $Y \downarrow$ (through multiplier)
3. **Income falls**: Since $Y = \text{Income}$
4. **Actual saving**: $S = Y - T - C$ may fall (or stay constant) because income fell

#### Interpretation
- Individual attempts to save more lead to lower aggregate income
- In equilibrium, total saving doesn't increase (or even decreases)
- **Paradox of savings**: virtue at the individual level (thrift) becomes vice at the aggregate level

#### Alternative Explanation (Saving-Investment Framework)
- If, for any given $Y$, saving increases, then $S > I$ (imbalance)
- To restore equilibrium ($S = I$), output must fall
- Lower $Y$ reduces saving, restoring $S = I$

---

## 3. Financial Markets

```summary
- **Two assets only**: money (cash) and bonds, and the whole model is a money market equilibrium
- **Money demand** rises with nominal income and falls with $i$, because $i$ is the opportunity cost of holding cash
- **Equilibrium is $M^s = M^d$** — at $i^*$, the money the central bank supplies is the money the public wants to hold
- **Modern policy targets the interest rate**: the Fed picks $i^*$ and supplies whatever money is needed, the reverse of setting $M$ and letting $i$ float
- **Open market operations implement it**: buying bonds adds to the Fed's assets and to currency in circulation, raising $M^s$ and lowering $i$; selling does the reverse
- **Bond prices and rates move inversely**: $i = (F - P_B)/P_B$, so a bond bought at 95 against a face value of 100 yields 5.26, and a price equal to face value yields nothing
- **That identity is the mechanism**: a bond purchase bids the price up, and a higher price is a lower rate
```

### Simplifying Assumptions
- Only two assets: **Money** (cash) and **Bonds**
- Focus on money market equilibrium

### Money Demand
$$M^d = \$Y \cdot L(i)$$

#### Determinants
1. **Nominal Income (\$$Y$)**:
    - $M^d$ increasing in \$$Y$
    - Interpretation: Higher income means more transactions, need more money
2. **Interest Rate ($i$)**:
    - $M^d$ decreasing in $i$
    - Interpretation: $i$ is opportunity cost of holding cash (return on bonds)
    - Example: When $i = 5\%$, holding cash costs you 5% per year

#### Functional Form
$$L(i)$$ is a decreasing function of $i$

### Money Supply
- **Controlled by the Central Bank**
- Denoted $M^s$ or simply $M$

### Equilibrium in Money Market
$$M^s = M^d$$

At equilibrium interest rate $i^*$, money supply equals money demand.

### Modern Monetary Policy Implementation

#### Interest Rate Targeting
- **Modern approach**: Central bank sets target interest rate $i^*$
- Then supplies whatever money ($M$) is needed to achieve that rate
- **Contrast**: Old approach was to set $M$ and let $i$ adjust

#### Why Interest Rate Targeting?
- Interest rates directly affect investment decisions
- More predictable and transparent
- Better communication tool

### Open Market Operations (OMO)

#### Expansionary Monetary Policy (Lowering $i$)
1. **Action**: Fed buys bonds from private sector
2. **Payment**: Fed gives cash (money) in exchange
3. **Effect on Balance Sheet**:
    - **Assets**: More bonds
    - **Liabilities**: More currency in circulation (cash is a Fed liability)
4. **Market Effect**:
    - Money supply increases: $M^s \uparrow$
    - Interest rate decreases: $i \downarrow$

#### Contractionary Monetary Policy (Raising $i$)
1. **Action**: Fed sells bonds to private sector
2. **Payment**: Fed receives cash in exchange
3. **Effect**: Money supply decreases, interest rate increases

### Bond Prices and Interest Rates

#### The Inverse Relationship
For a one-year bond with face value $F$:
$$i = \frac{F - P_B}{P_B}$$

Where:
- $P_B$: Current price of bond
- $F$: Face value (payment at maturity)

#### Example
- Face value: $F =$ \$100
- Current price: $P_B =$ \$95
- Interest rate: $i = \frac{100-95}{95} = \frac{5}{95} \approx 5.26\%$

#### Intuition for OMO Effect
1. Fed buys bonds (expansionary policy)
2. High demand for bonds pushes $P_B \uparrow$
3. Since $i = \frac{F - P_B}{P_B}$, when $P_B \uparrow$, then $i \downarrow$

#### Extreme Case
If $P_B =$ \$100 = F$, then $i = 0\%$

---

## 4. The IS-LM Model

```summary
- **Investment becomes endogenous**, $I = I(Y, i)$: it rises with output (accelerator effect) and falls with the interest rate (cost of borrowing)
- **The IS curve is downward sloping** in $(Y, i)$: each $i$ pins down an equilibrium $Y$, because a higher $i$ cuts investment, then demand, then output
- **Movement along IS vs. shift of IS**: a change in $i$ moves you along the curve, while a change in $G$, $T$ or $c_0$ shifts the whole curve
- **The LM curve is horizontal at the policy rate** — the Fed sets $i$ and supplies the money to hit it, so $M$ is endogenous; equilibrium $(Y^*, i^*)$ is where IS and LM cross with both markets clearing
- **Fiscal policy shifts IS, monetary policy shifts LM**, and the IS multiplier now carries the investment response, $1/(1-c_1 - d_1)$ with $d_1 = \frac{\partial I}{\partial Y}$
- **A balanced budget change is still expansionary**: $G$ and $T$ rising together leave net demand $(1 - c_1)\Delta G > 0$, and falling together leave it negative
- **Policy mixes offset each other** — contractionary fiscal plus expansionary monetary can hold output constant while improving the budget — but at the **zero lower bound**, with $i = 0$ and recession persisting, monetary policy is simply powerless
```

The IS-LM model integrates goods and financial markets to determine equilibrium output and interest rates.

### Building the IS Curve: Goods Market Equilibrium

#### Making Investment Endogenous
In the basic model, $I$ was exogenous (fixed). Now:
$$I = I(Y, i)$$

#### Investment Function Properties
1. **Increasing in $Y$**: $\frac{\partial I}{\partial Y} > 0$
    - Higher output/income increases investment (accelerator effect)
    - Interpretation: Firms invest more when the economy is strong
2. **Decreasing in $i$**: $\frac{\partial I}{\partial i} < 0$
    - Higher interest rates increase cost of borrowing
    - Interpretation: More expensive to finance investment projects

### The IS Curve: Derivation

#### Equilibrium Condition
$$Y = C + I(Y, i) + G$$
$$Y = c_0 + c_1(Y - T) + I(Y, i) + G$$

#### Key Insight
- For each interest rate $i$, there is an equilibrium level of output $Y$
- The IS curve traces out these $(i, Y)$ combinations

#### Slope of IS Curve
- **Downward sloping** in $(Y, i)$ space
- **Why?**:
    - Higher $i$ reduces investment $I$
    - Lower investment reduces aggregate demand
    - Lower demand requires lower $Y$ to maintain equilibrium

#### Constructing the IS Curve
1. Start with initial interest rate $i_0$
2. Find equilibrium output $Y_0$ (from Keynesian cross)
3. Plot point $(Y_0, i_0)$ on IS curve
4. Increase interest rate to $i_1 > i_0$
5. Investment falls, aggregate demand shifts down
6. New equilibrium output $Y_1 < Y_0$
7. Plot point $(Y_1, i_1)$ on IS curve
8. Connect points to trace IS curve

### Shifts in the IS Curve

#### Rightward Shifts (Expansionary)
For any given $i$, output is higher.

**Causes**:
- $G \uparrow$ (increased government spending)
- $T \downarrow$ (tax cuts)
- $c_0 \uparrow$ (increased consumer confidence)
- Autonomous investment increases

#### Leftward Shifts (Contractionary)
For any given $i$, output is lower.

**Causes**:
- $G \downarrow$ (decreased government spending)
- $T \uparrow$ (tax increases)
- $c_0 \downarrow$ (decreased consumer confidence)

#### Important Distinction
- **Movement along IS**: Change in $i$ (caused by monetary policy)
- **Shift of IS**: Change in parameters other than $i$ (e.g., $G$, $T$, $c_0$)

### The LM Curve: Financial Market Equilibrium

#### In Modern Policy Framework
The central bank sets the interest rate $i$ directly.

**LM Curve**: Horizontal line at $i = i^{\text{policy}}$

#### Interpretation
- Fed chooses target interest rate
- Supplies whatever money is needed to achieve that rate
- Money supply is endogenous, interest rate is exogenous

#### Shifts in LM Curve
- **Downward shift**: Expansionary monetary policy ($i \downarrow$)
- **Upward shift**: Contractionary monetary policy ($i \uparrow$)

### IS-LM Equilibrium

#### Finding Equilibrium
- **Intersection of IS and LM** determines equilibrium $(Y^*, i^*)$
- At this point:
    - Goods market in equilibrium: $Y = Z$
    - Financial market in equilibrium: $M^s = M^d$

### Policy Analysis Using IS-LM

#### 1. Expansionary Fiscal Policy

**Action**: Increase $G$ or decrease $T$

**Effects**:
1. IS curve shifts right
2. For given $i$, output increases
3. New equilibrium: Higher $Y$, same $i$ (if Fed doesn't react)

**Graphical Analysis**:
- IS shifts right from IS$_0$ to IS$_1$
- LM remains horizontal at $i^*$
- Equilibrium moves from $(Y_0, i^*)$ to $(Y_1, i^*)$
- $Y_1 > Y_0$

**Multiplier Still Applies**:
$$\Delta Y = \frac{1}{1-c_1-d_1} \Delta G$$
where $d_1 = \frac{\partial I}{\partial Y}$ captures investment response to output

#### 2. Contractionary Fiscal Policy

**Action**: Decrease $G$ or increase $T$

**Effects**:
1. IS curve shifts left
2. Equilibrium output decreases

**Example**: Fiscal austerity, deficit reduction

#### 3. Balanced Budget Change

**Question**: What if $\Delta G = \Delta T$ (same magnitude)?

**Answer**: IS still shifts!

**Why?**:
- $\Delta G$ affects demand one-for-one: $\Delta Z = \Delta G$
- $\Delta T$ affects demand through consumption: $\Delta Z = -c_1 \Delta T$
- Net effect: $\Delta Z = \Delta G - c_1 \Delta T = (1 - c_1)\Delta G > 0$ (if both increase)

**Direction**:
- If $\Delta G = \Delta T > 0$: IS shifts right (expansionary)
- If $\Delta G = \Delta T < 0$: IS shifts left (contractionary)

**Key Insight**: Balanced budget expansion is still expansionary (though less than deficit-financed)

#### 4. Expansionary Monetary Policy

**Action**: Fed lowers interest rate ($i \downarrow$)

**Effects**:
1. LM shifts down
2. Lower $i$ stimulates investment
3. Higher investment increases aggregate demand
4. Output increases through multiplier

**Mechanism**:
$$i \downarrow \Rightarrow I \uparrow \Rightarrow Z \uparrow \Rightarrow Y \uparrow \Rightarrow C \uparrow \Rightarrow Z \uparrow \Rightarrow Y \uparrow \text{ (multiplier)}$$

**Graphical Analysis**:
- LM shifts down from LM$_0$ ($i_0$) to LM$_1$ ($i_1$)
- IS remains unchanged
- Equilibrium moves from $(Y_0, i_0)$ to $(Y_1, i_1)$
- $Y_1 > Y_0$ and $i_1 < i_0$

**Implementation**: Open market purchase of bonds

#### 5. Contractionary Monetary Policy

**Action**: Fed raises interest rate ($i \uparrow$)

**Effects**:
1. LM shifts up
2. Higher $i$ reduces investment
3. Output decreases

**Use**: Combat inflation or overheating economy

### Policy Mixes

The four mixes are the four corners of one grid — expansionary or contractionary fiscal, crossed with expansionary or contractionary monetary. Two of the four are the cases a course usually stops at; the interesting one is the corner where the two pull against each other.

#### Mix 1: Fighting a Recession
**Combination**: Expansionary fiscal + Expansionary monetary

**Actions**:
- Increase $G$ and/or decrease $T$ (IS shifts right)
- Decrease $i$ (LM shifts down)

**Effects**:
- Very strong increase in $Y$
- Both policies work in same direction

**Historical Examples**:
- COVID-19 pandemic (2020): Massive fiscal stimulus + near-zero interest rates
- Global Financial Crisis (2008-09): Fiscal stimulus + aggressive rate cuts

#### Mix 2: Fiscal Consolidation with Monetary Offset
**Combination**: Contractionary fiscal + Expansionary monetary

**Goal**: Reduce budget deficit without causing recession

**Actions**:
- Decrease $G$ or increase $T$ (IS shifts left)
- Decrease $i$ (LM shifts down) to offset

**Effects**:
- Output can remain constant: $\Delta Y = 0$
- Improved fiscal position (lower deficit)
- Lower interest rates

**Example**: "Austerity with monetary accommodation"

#### Mix 3: Overheating with Monetary Resistance
**Combination**: Expansionary fiscal + Contractionary monetary

**Distinguishing condition**: The fiscal side is *not* the one that has to change. The story is an economy already near capacity, where the government is still spending — transfers, defence, pandemic-era support — and the central bank has to lean against it alone.

**Actions**:
- Fiscal stays expansionary, or contracts too slowly to matter (IS stays put, or drifts right)
- Increase $i$ (LM shifts up) far enough to hold $Y$ at its target despite the fiscal push

**Effects**:
- Output is held roughly constant while $i$ rises: the rate does all the tightening
- The interest rate ends up higher than in any mix without the offset
- This is the mix in which the policy rate is doing work nobody voted for, and it is the one that produces the fastest tightening

**Historical Example**:
- 2021-2023: large fiscal transfers alongside Fed hikes to 5.25%

#### Mix 4: Both Policies Contractionary
**Combination**: Both contractionary

**When Used**: Fighting inflation, cooling overheated economy

**Effects**:
- Strong contraction in output
- The hardest mix to land politically, because both instruments point the same way and there is nothing left to offset a mistake

### The Zero Lower Bound (ZLB)

#### The Problem
- Nominal interest rates cannot go significantly below zero
- If $i = 0$ and recession persists, monetary policy is ineffective
- Cannot lower $i$ further to stimulate investment

#### When Does This Matter?
1. Deep recessions requiring very low rates
2. Low inflation or deflation environment
3. When optimal policy rate would be negative

#### Historical Examples
- Japan (1990s-2000s): Lost decade with $i \approx 0$
- United States (2008-2015): Fed funds rate at 0-0.25%
- Europe (2010s): Even negative rates in some countries

#### Implications
- **Fiscal policy becomes more important**: When monetary policy is constrained
- **Unconventional monetary policy**: Quantitative easing, forward guidance
- **Need for higher inflation targets**: Creates more room to cut rates

---

## 5. The Extended IS-LM Model: Risk and Inflation

```summary
- **Two problems with the basic model**: firms care about the real cost of borrowing, not the nominal rate, and they do not borrow at the risk-free Treasury rate
- **Fisher equation**: $r = i - \pi^e$, so with $i = 5\%$ and expected inflation of 2% the real rate is 3%
- **Credit spread**: $x = i_{corporate} - i_{Treasury}$ pays investors for default risk and risk aversion, and widens in recessions under flight to quality; a default-probability model gives $x \approx \frac{\theta}{1-\theta}$
- **Extended investment function**: $I = I(Y, i - \pi^e + x)$ — the three components enter the effective real cost of capital symmetrically, so an equal-sized change in $i$, $\pi^e$ or $x$ has an equal effect
- **A spread shock** raises that cost, cuts investment and shifts IS left — in 2008 spreads went from 1% to 5% and even $i = 0$ could not offset them; higher expected inflation does the reverse
- **The Fed can neutralize a financial shock** by cutting $i$ by exactly the rise in $x$, $\Delta i = -\Delta x$, leaving the IS curve unmoved — and with conditions easing in 2023 it raised rates instead
- **Deflation at the zero lower bound is the worst case**: at $i = 0$ with $\pi^e = -2\%$ and $x = 3\%$, the effective rate is still 5%, investment collapses, and only fiscal or unconventional policy is left
```

### Motivation for Extensions

#### Problem 1: Real vs. Nominal Interest Rates
- Firms care about **real cost of borrowing**, not nominal rate
- With inflation, real and nominal rates differ

#### Problem 2: Credit Spreads
- Firms don't borrow at risk-free rate (Treasury rate)
- They pay a premium over risk-free rate due to default risk

### The Real Interest Rate

#### Fisher Equation
$$r = i - \pi^e$$

Where:
- $r$: Real interest rate
- $i$: Nominal interest rate (what we observe)
- $\pi^e$: Expected inflation

#### Interpretation
- Real interest rate = nominal rate minus inflation
- If $i = 5\%$ and $\pi^e = 2\%$, then $r = 3\%$
- Real rate is the actual purchasing power cost of borrowing

### The Credit Spread (Risk Premium)

#### Definition
$$x = i_{\text{corporate}} - i_{\text{Treasury}}$$

Where:
- $x$: Credit spread (risk premium)
- $i_{\text{corporate}}$: Interest rate on corporate bonds
- $i_{\text{Treasury}}$: Risk-free rate (government bonds)

#### Why Credit Spreads Exist
1. **Default risk**: Corporations can go bankrupt
2. **Risk aversion**: Investors require compensation for risk
3. **Varies over business cycle**:
    - Low during booms (investor optimism)
    - High during recessions (investor pessimism, "flight to quality")

#### Formal Representation
Expected return on risky bond = Risk-free return:
$$(1-\theta)(1+i_{\text{corporate}}) = 1 + i_{\text{Treasury}}$$

Where $\theta$ is probability of default.

This implies:
$$x \approx \frac{\theta}{1-\theta}$$

### Extended Investment Function

#### New Specification
$$I = I(Y, r + x) = I(Y, i - \pi^e + x)$$

#### Interpretation
- Investment depends on **effective real borrowing cost**: $r + x$
- Firms face: Nominal rate $i$, minus expected inflation $\pi^e$, plus credit spread $x$

### The Extended IS Curve

#### Equilibrium Condition
$$Y = C + I(Y, i - \pi^e + x) + G$$

#### New Parameters in IS
Three interest rate components enter symmetrically:
1. $+i$ (contractionary)
2. $-\pi^e$ (expansionary)
3. $+x$ (contractionary)

#### Key Insight: Symmetric Effects
The effects are symmetric:
- $\Delta i = +100$ bp has same effect as $\Delta x = +100$ bp
- $\Delta i = +100$ bp has same effect as $\Delta \pi^e = -100$ bp
- All work through same channel: effective cost of capital for firms

### Policy Analysis with Extensions

#### 1. Increase in Credit Spreads ($\Delta x > 0$)

**Cause**: Financial crisis, increased risk aversion, "flight to quality"

**Effect on Investment**:
- Higher effective borrowing cost: $(i - \pi^e + x) \uparrow$
- Investment decreases: $I \downarrow$

**Effect on IS Curve**:
- IS shifts **left** (contractionary)
- For any given $i$, output is lower

**Effect on Output**:
- If Fed doesn't respond: $Y \downarrow$ (recession)

**Example**: 2008 Financial Crisis
- Credit spreads spiked (e.g., from 1% to 5%)
- Even with Fed cutting $i$ to 0%, $(i - \pi^e + x)$ remained high
- Deep recession resulted

#### 2. Increase in Expected Inflation ($\Delta \pi^e > 0$)

**Effect on Investment**:
- Lower real interest rate: $(i - \pi^e + x) \downarrow$
- Investment increases: $I \uparrow$

**Effect on IS Curve**:
- IS shifts **right** (expansionary)
- For any given $i$, output is higher

**Effect on Output**:
- If Fed doesn't respond: $Y \uparrow$ (expansion)

#### 3. Fed Response to Financial Conditions

**Scenario**: Credit spreads increase by 100 bp

**Fed Goal**: Maintain current output level

**Required Action**:
- Decrease $i$ by exactly 100 bp
- This keeps $(i - \pi^e + x)$ constant
- IS curve doesn't move, output unchanged

**Formula**:
$$\Delta i = -\Delta x$$ (to offset)

**Current Example (2023)**:
- Financial conditions loosened (spreads compressed, stocks up)
- Fed responded by raising rates more than expected
- Goal: Offset easier financial conditions to control inflation

#### 4. Deflation and the ZLB

**Scenario**: $i = 0$, but $\pi^e < 0$ (deflation) and $x$ is high

**Problem**:
- Real borrowing cost: $(0 - \pi^e + x) = (-\pi^e) + x$
- If $\pi^e = -2\%$ and $x = 3\%$, then effective rate = $2\% + 3\% = 5\%$
- Very high real borrowing cost despite zero nominal rate!

**Result**:
- Investment collapses
- Deep recession/depression
- **Liquidity trap**: Monetary policy ineffective

**Historical Example**: Great Depression (1930s)
- Deflation: $\pi^e < 0$
- High credit spreads due to bank failures
- Nominal rates near zero but real rates very high
- Output collapsed

**Policy Response**:
- Need fiscal policy (monetary policy ineffective)
- Unconventional monetary policy (if possible)
- Prevent deflation expectations from forming

### Summary: Extended IS-LM

**Key Equation**:
$$I = I(Y, \underbrace{i - \pi^e + x}_{\text{effective real cost}})$$

**Three channels affect investment**:
1. **Nominal interest rate $i$**: Controlled by Fed
2. **Expected inflation $\pi^e$**: Driven by expectations
3. **Credit spread $x$**: Driven by financial conditions

**Policy Implications**:
- Fed must monitor all three components
- Financial shocks ($\Delta x$) can require policy response
- ZLB is more severe with deflation or high credit spreads

---

## 6. The Labor Market and Natural Rate of Unemployment

```summary
- **Medium run**: prices adjust, so output is no longer demand-determined and unemployment returns to $u_n$ — against the short run, where IS-LM holds prices fixed
- **Notation**: $W$ nominal wage, $P$ price level, $W/P$ real wage, $u$ unemployment rate, $L$ employment, $U$ unemployment
- **Production is $Y = N$**: one worker makes one unit of output, so $MPL = 1$ and the marginal cost of hiring one more worker is $W$
- **Price setting**: markup pricing $P = (1 + m)W$ implies a maximum real wage of $W/P = 1/(1+m)$ — a horizontal line that does not depend on unemployment
- **Wage setting**: $W/P = \frac{P^e}{P} F(u, z)$, with $F$ decreasing in $u$ and increasing in $z$; with correct expectations it is just $F(u, z)$ — a downward-sloping line
- **The natural rate** $u_n$ is the intersection, $F(u_n, z) = \frac{1}{1+m}$ — an equilibrium rate set by structure ($m$, $z$), not a desirable one
- **Both a higher markup and more bargaining power raise $u_n$**: each shifts one curve away from the other, and only higher unemployment restores the intersection — the trade-off behind Europe's higher $u_n$ than the United States
```

This section introduces medium-run analysis where prices can adjust. Will appear on Quiz 1 but less prominently than IS-LM.

### Labor Market Framework

#### Key Variables
- $W$: Nominal wage
- $P$: Price level
- $W/P$: Real wage
- $u$: Unemployment rate
- $L$: Employment
- $U$: Unemployment

### The Production Function

#### Specification
$$Y = N$$

Where $N$ is employment (number of workers).

#### Interpretation
- Very simple: one worker produces one unit of output
- **Marginal product of labor**: $MPL = 1$
- **Marginal cost of production**: $MC = W$ (cost of hiring one more worker)

### Price Setting by Firms

#### Markup Pricing
Firms set price as a markup over marginal cost:
$$P = (1 + m) \times MC = (1 + m) W$$

Where:
- $m$: Markup (e.g., $m = 0.2$ means 20% markup)
- Reflects market power, competition level

#### Implied Real Wage (Price Setting)
Rearranging:
$$\frac{W}{P} = \frac{1}{1+m}$$

**Interpretation**:
- Maximum real wage firms are willing to pay
- Determined by markup
- **Horizontal line** in $(W/P, u)$ space
- Does not depend on unemployment

### Wage Setting by Workers

#### Wage Setting Equation
$$W = P^e \cdot F(u, z)$$

Where:
- $P^e$: Expected price level
- $u$: Unemployment rate
- $z$: Institutional/structural factors (bargaining power, unemployment benefits, etc.)

#### Properties of $F(u, z)$
1. **Decreasing in $u$**: $\frac{\partial F}{\partial u} < 0$
    - Higher unemployment weakens workers' bargaining position
    - Lower wage demands when unemployment is high
2. **Increasing in $z$**: $\frac{\partial F}{\partial z} > 0$
    - Higher $z$ means more bargaining power
    - Examples: stronger unions, higher unemployment benefits

#### Real Wage (Wage Setting)
In real terms:
$$\frac{W}{P} = \frac{P^e}{P} \cdot F(u, z)$$

If $P = P^e$ (expectations correct):
$$\frac{W}{P} = F(u, z)$$

**Graph**: Downward sloping in $(W/P, u)$ space

### The Natural Rate of Unemployment

#### Definition
The natural rate $u_n$ is the unemployment rate when **actual price equals expected price**: $P = P^e$

#### Finding $u_n$: Equilibrium Condition
Set wage-setting equal to price-setting:
$$F(u_n, z) = \frac{1}{1+m}$$

This equation determines $u_n$.

#### Graphical Representation
- **Price-setting line**: Horizontal at $W/P = \frac{1}{1+m}$
- **Wage-setting curve**: Downward sloping, $W/P = F(u, z)$
- **Intersection**: Natural rate $u_n$

#### Why "Natural"?
- **Misleading term**: Nothing inherently "natural" or desirable
- Better term: "equilibrium unemployment rate"
- Reflects structural features of economy ($m$, $z$)

### Comparative Statics: Changes in Natural Rate

#### 1. Increase in Markup ($\Delta m > 0$)

**Cause**: Reduced competition, increased market power, oil shocks (raising costs)

**Effect on Price Setting**:
$$\frac{1}{1+m} \downarrow \text{ (price-setting line shifts down)}$$

**New Equilibrium**:
- Lower real wage offered by firms
- Workers unwilling to accept lower wage at $u_n$
- Unemployment must rise to $u_n' > u_n$
- Higher unemployment forces workers to accept lower real wage

**Result**: $u_n \uparrow$ (natural rate increases)

#### 2. Increase in Worker Bargaining Power ($\Delta z > 0$)

**Causes**:
- Stronger unions
- Higher unemployment benefits
- Better worker protections
- Labor market regulations

**Effect on Wage Setting**:
- For any given $u$, workers demand higher $W/P$
- Wage-setting curve shifts **up**

**New Equilibrium**:
- At $u_n$, workers now demand real wage higher than $\frac{1}{1+m}$
- Firms unwilling to pay higher wage
- Unemployment must rise to $u_n' > u_n$
- Higher unemployment moderates wage demands back to $\frac{1}{1+m}$

**Result**: $u_n \uparrow$ (natural rate increases)

**Interpretation**:
- Benefits to workers ($\uparrow z$) are offset by higher equilibrium unemployment
- Policy trade-off: worker protection vs. employment level

#### Cross-Country Example
- **Europe**: Higher labor protections ($z$ higher) → typically higher $u_n$
- **United States**: Lower labor protections ($z$ lower) → typically lower $u_n$
- Trade-off between job security/benefits and unemployment rate

### Key Takeaways: Labor Market

1. **Natural rate is endogenous**: Depends on structural parameters ($m$, $z$)
2. **Not a policy target per se**: But policies affect it through $m$ and $z$
3. **Short-run vs. medium-run**:
    - Short-run (IS-LM): Prices fixed, output demand-determined
    - Medium-run: Prices adjust, unemployment returns to $u_n$
4. **Important for later**: Phillips curve, inflation dynamics (not on Quiz 1)

---

## 7. Summary and Quiz Preparation

```summary
- **Six areas**: measurement, goods market, financial markets, IS-LM, extended IS-LM, labor market — with IS-LM carrying 60-70% of the quiz
- **Know cold**: all three GDP methods, the multiplier, the IS and LM curves and their shifts, the symmetric $i$, $\pi^e$, $x$ investment function, and $F(u_n, z) = \frac{1}{1+m}$
- **Three skills**: solve algebraically for equilibrium output and policy offsets, draw and shift the diagrams correctly, and explain mechanisms and their limits such as the zero lower bound
- **Five classic mistakes**: movement along versus shift, $1/c_1$ instead of $1/(1-c_1)$, sign errors on the balanced budget, forgetting $i$, $\pi^e$ and $x$, and shifting the wrong labor-market curve
- **The aim is mechanisms, not formulas** — and in particular how one policy can be used to offset another
```

### What You Must Know Cold

#### 1. GDP Measurement
- All three methods and why they're equivalent
- Nominal vs. real GDP calculations
- Base year concept

#### 2. Goods Market
- Consumption function: $C = c_0 + c_1(Y-T)$
- Equilibrium condition: $Y = Z$
- **Solving for equilibrium output**
- Multiplier: $\frac{1}{1-c_1}$
- Graphical analysis (Keynesian cross)
- Paradox of savings

#### 3. Financial Markets
- Money demand: increasing in income, decreasing in $i$
- Equilibrium: $M^s = M^d$
- Open market operations
- Bond prices and interest rates (inverse relationship)

#### 4. IS-LM Model (Most Important!)
- **Deriving IS curve** from goods market
- **IS slope**: downward in $(Y, i)$ space
- **IS shifts**:
    - Right: $\uparrow G$, $\downarrow T$, $\uparrow c_0$
    - Left: $\downarrow G$, $\uparrow T$, $\downarrow c_0$
- **LM curve**: horizontal at policy rate $i$
- **Finding equilibrium**: IS-LM intersection
- **Policy experiments**:
    - Fiscal policy (shifts IS)
    - Monetary policy (shifts LM)
    - Policy mixes
    - Balanced budget changes
- **Graphical analysis**: Must be able to draw and shift curves correctly

#### 5. Extended IS-LM
- Investment function: $I = I(Y, i - \pi^e + x)$
- Symmetric effects of $i$, $\pi^e$, and $x$
- Credit spread shocks
- Inflation expectation shocks
- Fed offsetting financial conditions
- Zero lower bound problems

#### 6. Labor Market (Less Emphasis)
- Wage setting: $W/P = F(u, z)$, decreasing in $u$
- Price setting: $W/P = \frac{1}{1+m}$, horizontal
- Natural rate: $F(u_n, z) = \frac{1}{1+m}$
- Effects of $\Delta m$ and $\Delta z$ on $u_n$

### Problem-Solving Skills

1. **Algebraic**:
    - Solve for equilibrium output given parameters
    - Calculate multiplier effects
    - Find required policy changes to achieve target output

2. **Graphical**:
    - Draw and label IS-LM diagrams correctly
    - Show shifts vs. movements along curves
    - Identify new equilibrium after shocks

3. **Conceptual**:
    - Explain mechanisms (e.g., how monetary policy affects output)
    - Compare policy effectiveness
    - Understand trade-offs and limitations (e.g., ZLB)

### Common Mistakes to Avoid

1. **Confusing movements along vs. shifts**:
    - Change in $i$ → movement along IS
    - Change in $G$ → shift of IS

2. **Wrong multiplier calculation**:
    - Remember $\frac{1}{1-c_1}$, not $\frac{1}{c_1}$

3. **Sign errors in balanced budget**:
    - $\Delta G = \Delta T > 0$ is still expansionary
    - Net effect: $(1-c_1)\Delta G$

4. **Forgetting the extended IS components**:
    - All three ($i$, $\pi^e$, $x$) affect investment
    - They enter symmetrically

5. **Labor market**:
    - Both $\Delta m \uparrow$ and $\Delta z \uparrow$ increase $u_n$
    - Don't confuse which curve shifts

### Approximate Quiz Breakdown

- **IS-LM Analysis**: ~60-70%
    - Basic IS-LM
    - Policy experiments
    - Extended IS-LM with risk and inflation
- **Goods Market / Financial Markets**: ~15-20%
- **Labor Market**: ~10-15%
- **Definitions / Measurement**: ~5-10%

### Final Advice

"If you understood what I said today, you're in good shape." - Professor Caballero

- **Practice solving problems algebraically and graphically**
- **Understand mechanisms, not just formulas**
- **Know how to offset one policy with another**
- **Be prepared for balanced budget scenarios**
- **Understand the extended IS-LM thoroughly** (risk, inflation, ZLB)
