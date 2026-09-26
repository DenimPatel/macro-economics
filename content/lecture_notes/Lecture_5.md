# Lecture 5: The IS-LM Model (Part I)

## Overview
The IS-LM model is the workhorse model for understanding the **joint determination of output (Y) and the interest rate (i)**. It combines:
- **IS Curve**: Equilibrium in the **goods market** (Investment-Savings)
- **LM Curve**: Equilibrium in the **financial market** (Liquidity-Money)

This model is fundamental for analyzing monetary and fiscal policy, and forms the basis for modern central bank thinking (including the Federal Reserve).

---

## 1. Current Economic Context (2022-2023)

### Wealth Increase During COVID Recovery
- **Dramatic Rise in Net Worth**: US household wealth increased significantly during and after the COVID recovery.
- **Sources of Wealth Increase**:
  1. **Asset Price Appreciation** (Main Driver):
     - Massive equity market rallies
     - Skyrocketing house prices
     - Despite 2022 decline, wealth remains elevated relative to pre-COVID trend
  2. **Excess Savings** (Important for Lower-Income Segments):
     - Incomes remained stable or increased (due to government transfers)
     - Consumption opportunities limited during lockdowns
     - Resulted in $2.7-2.8 trillion in excess savings

### Implications for Aggregate Demand
- **Wealth Effect**: Higher wealth → higher consumption → increased aggregate demand
- **Desaving Phase**: Consumers now spending accumulated savings
  - Saving rate dropped below historical averages
  - Formula: Saving Rate = Income - Consumption
  - Lower saving rate → higher consumption relative to income
- **Credit Expansion**: Lower-income segments borrowing (credit cards) to fund consumption even after depleting excess savings

### Consumption Patterns Post-COVID
- **Services Consumption** (~2/3 of consumption):
  - Collapsed during COVID
  - Fully recovered and now **above trend**
  - Examples: Travel, restaurants, hotels
- **Goods Consumption** (~1/3 of consumption):
  - Initially collapsed, then spiked during COVID (gadgets, home equipment)
  - Slowing down but still **above trend**

### The Overheating Problem
- **Current Situation**: Very high aggregate demand relative to productive capacity
- **Consequence**: High inflation (mechanism to be studied in ~6 lectures)
- **Policy Response**: Fed implementing **contractionary monetary policy** (raising interest rates) to cool the economy
- **Relevance**: The IS-LM model explains exactly how this works

---

## 2. The IS Curve (Goods Market Equilibrium)

### Building on Lecture 3
The IS curve extends the goods market model from Lecture 3 by making **investment endogenous**.

**Lecture 3 Model**:
$$Y = C(Y - T) + I + G$$
- Only consumption was endogenous
- Investment (I) was exogenous (constant)

**Lecture 5 Enhancement**:
$$Y = C(Y - T) + I(Y, i) + G$$
- Investment is now a **function** of output and interest rate

### Investment Function: $I = I(Y, i)$

#### Dependence on Output ($Y$)
- **Positive Relationship**: $\frac{\partial I}{\partial Y} > 0$
- **Mechanism**: Higher sales → firms invest more to expand capacity
- **Interpretation**: Investment has a "marginal propensity to invest" similar to consumption's marginal propensity to consume

#### Dependence on Interest Rate ($i$)
- **Negative Relationship**: $\frac{\partial I}{\partial i} < 0$
- **Mechanisms**:
  1. **Borrowing Cost**: Most investment is debt-financed. Higher $i$ → more expensive to borrow → less investment
  2. **Opportunity Cost**: Even without borrowing, higher $i$ means higher opportunity cost of using funds for physical investment versus financial investment

**Important Note**: This is **real investment** (purchase of capital goods: equipment, structures, machinery), **NOT** financial investment (bonds, stocks). Financial investments belong to the financial market, not goods market.

### The IS Relation

**Definition**: The IS curve represents all combinations of $(Y, i)$ consistent with equilibrium in the goods market.

**Equilibrium Condition**:
$$Y = C(Y - T) + I(Y, i) + G$$

This defines a **relationship** between $Y$ and $i$, not just a single point.

### Deriving the IS Curve Graphically

**Step 1**: Start with the Goods Market Diagram (ZZ curve)
- Horizontal axis: Output ($Y$)
- Vertical axis: Aggregate Demand ($Z$)
- 45° line: $Y = Z$ (equilibrium condition)
- ZZ curve: Aggregate demand as function of output

**Key Difference from Lecture 3**:
- ZZ curve is **steeper** than before
- **Reason**: Both consumption AND investment now increase with $Y$
  - Slope = MPC + MPI (marginal propensity to consume + marginal propensity to invest)
- **New Parameter**: Interest rate ($i$) is now a parameter of the ZZ curve

**Step 2**: Trace the IS Curve
1. **Point A**: Start with interest rate $i_0$ → ZZ curve → equilibrium output $Y_0$
   - This gives us one point: $(Y_0, i_0)$

2. **Point A'**: Increase interest rate to $i_1 > i_0$
   - **Effect**: ZZ curve shifts **down**
   - **Reason**: Higher $i$ → lower investment → lower aggregate demand for any given $Y$
   - **Multiplier Effect**: Output falls by more than the initial decline in investment
   - New equilibrium: $(Y_1, i_1)$ where $Y_1 < Y_0$

3. **Repeat**: Continue varying $i$ to trace entire curve

**Result**: The IS curve is **downward sloping** in $(Y, i)$ space.

### Why Is the IS Curve Downward Sloping?

**Logic**:
- Suppose we increase $i$ but keep $Y$ constant
- Higher $i$ → lower investment → aggregate demand falls below output
- **Excess Supply** in goods market (demand insufficient to support that output)
- To restore equilibrium, output must fall
- Therefore: Higher $i$ requires lower $Y$ for equilibrium → downward sloping

**Mathematical Intuition**:
$$\frac{dY}{di}\bigg|_{IS} = \frac{\partial I/\partial i}{1 - (\partial C/\partial Y + \partial I/\partial Y)} < 0$$
- Numerator: Negative (investment falls with $i$)
- Denominator: Positive but less than 1 (1 minus total marginal propensity to spend)
- Result: Negative slope

---

## 3. Movements Along vs. Shifts of the IS Curve

### Movement Along the IS Curve
- **Cause**: Change in interest rate only
- **Interpretation**: Moving from one equilibrium point to another on the **same** IS curve
- **Example**: Fed raises interest rate → move up along IS → lower equilibrium output

### Shifts of the IS Curve
- **Cause**: Change in **exogenous** demand factors (anything in the model except $i$)
- **Interpretation**: Entire curve moves to a new position

#### What Shifts IS to the LEFT (Contractionary)?
1. **Tax Increase** ($T \uparrow$):
   - Lower disposable income → lower consumption → lower aggregate demand → lower output
   - Magnitude: $\Delta Y = -\frac{c_1}{1 - c_1 - i_1} \Delta T$ (where $i_1 = \partial I/\partial Y$)

2. **Government Spending Decrease** ($G \downarrow$):
   - Direct reduction in aggregate demand
   - Multiplier effect amplifies the decline

3. **Consumer Confidence Decline** ($c_0 \downarrow$):
   - Autonomous consumption falls
   - Examples: Wealth decline, increased uncertainty, pessimism
   - This captures the wealth effects discussed at the beginning

4. **Investment Sentiment Decline** ($i_0 \downarrow$):
   - Autonomous investment falls (e.g., due to uncertainty about future)

#### What Shifts IS to the RIGHT (Expansionary)?
- Opposite of above: $T \downarrow$, $G \uparrow$, $c_0 \uparrow$, $i_0 \uparrow$

**How to Verify a Shift**:
- Go back to the ZZ diagram
- For a given interest rate, see if aggregate demand shifts
- If yes → IS curve shifts
- Example: $T \uparrow$ → ZZ shifts down → for same $i$, equilibrium $Y$ is lower → IS shifts left

---

## 4. The LM Curve (Financial Market Equilibrium)

### Traditional LM Derivation

**Equilibrium Condition**: Real money supply = Real money demand
$$\frac{M}{P} = Y \cdot L(i)$$

Where:
- $M/P$: Real money supply
- $Y \cdot L(i)$: Real money demand
  - Increases with $Y$ (transaction demand)
  - Decreases with $i$ (opportunity cost of holding money)

**Traditional LM** (if central bank targets $M$):
- Fix $M$ → Trace combinations of $(Y, i)$ that satisfy equilibrium
- **Shape**: Upward sloping
- **Logic**: $Y \uparrow$ → money demand $\uparrow$ → if $M$ fixed, then $i$ must $\uparrow$ to reduce money demand and restore equilibrium

### Modern LM Curve: Interest Rate Targeting

**Modern Practice**: Central banks (Fed, ECB, etc.) target the **interest rate** directly, not money supply.

**How It Works**:
1. Central bank announces target rate: $i = \bar{i}$
2. Central bank supplies whatever $M$ is needed to maintain that rate
3. If output changes and central bank doesn't want to change $i$:
   - Money demand changes: $\Delta(Y \cdot L(i))$
   - Central bank adjusts $M$ to accommodate: $\Delta M = P \cdot \Delta(Y \cdot L(i))$

**Example**:
- Fed sets $i = \bar{i}$
- Output rises unexpectedly: $Y \uparrow$
- If Fed doesn't react: Money demand $\uparrow$ → upward pressure on $i$
- Fed response: Provide more $M$ → keeps $i = \bar{i}$

**Result**: Modern LM is **HORIZONTAL** at the target rate $\bar{i}$

$$\text{Modern LM: } i = \bar{i}$$

**Interpretation**: The central bank accommodates any level of output at the target interest rate by adjusting money supply.

### What Shifts the Modern LM?

**Answer**: ONLY changes in the central bank's target interest rate.

- **Contractionary Monetary Policy**: Fed raises target rate → LM shifts **up**
- **Expansionary Monetary Policy**: Fed lowers target rate → LM shifts **down**

**Life Is Simpler Now**:
- In the past: Changes in money demand ($L$) or money supply ($M$) would shift LM
- Now: Only the Fed's decision matters

**Why Fed Changes Rates** (Fed is not just "moody"):
- Responding to inflation
- Responding to unemployment
- Responding to economic overheating (current situation)
- Forced by circumstances (e.g., COVID, financial crises)

**Risks of Rapid Rate Changes**:
- Can "break" something in financial system
- Example: Highly leveraged institutions (banks, hedge funds) can fail
- 2022-2023: Fed raised rates very fast to combat inflation → risky but nothing major broke (lucky)
- UK: Near-crisis with pension funds during rapid rate increases

---

## 5. IS-LM Equilibrium

### Finding Equilibrium

**Setup**: Two curves in $(Y, i)$ space, two unknowns $(Y, i)$

$$
\begin{cases}
\text{IS}: Y = C(Y - T) + I(Y, i) + G \\
\text{LM}: i = \bar{i}
\end{cases}
$$

**Solution**: Point A where IS and LM intersect
- At Point A: **Both** goods market and financial markets are in equilibrium
- This is the **only** point consistent with both equilibria

### Understanding Disequilibrium Points

#### Points on LM but Right of IS
- **Financial markets**: In equilibrium (on LM)
- **Goods market**: NOT in equilibrium
- **Problem**: **Excess Supply** of goods
  - Output too high for the level of demand
  - Firms cannot sell all they produce
  - Need to reduce output to restore equilibrium

#### Points on LM but Left of IS
- **Financial markets**: In equilibrium (on LM)
- **Goods market**: NOT in equilibrium
- **Problem**: **Excess Demand** for goods
  - Demand exceeds output
  - Need to increase output to restore equilibrium

#### Points on IS but Above LM
- **Goods market**: In equilibrium (on IS)
- **Financial markets**: NOT in equilibrium
- **Problem**: Interest rate too high
  - **Excess Demand for Money** (equivalently: excess supply of bonds)
  - Money demand > money supply at that $(Y, i)$ combination

#### Points on IS but Below LM
- **Goods market**: In equilibrium (on IS)
- **Financial markets**: NOT in equilibrium
- **Problem**: Interest rate too low
  - **Excess Supply of Money** (equivalently: excess demand for bonds)

---

## 6. Policy Analysis with IS-LM

### Fiscal Contraction ($T \uparrow$ or $G \downarrow$)

**Which Curve Moves?** IS (goods market affected)

**Direction**: IS shifts **left**

**Mechanism**:
1. Higher taxes (or lower $G$) → disposable income falls (or aggregate demand falls directly)
2. Consumption declines
3. Aggregate demand falls → ZZ shifts down
4. Multiplier effect → output falls by more than initial decline in demand
5. New IS curve to the left of original

**New Equilibrium** (assuming Fed doesn't react):
- Fed keeps LM at same position: $i = \bar{i}$
- New equilibrium: Point A' where new IS intersects unchanged LM
- **Result**:
  - Output falls: $Y' < Y$
  - Interest rate unchanged: $i' = i = \bar{i}$

**Graphical Summary**:
```
Initial: Point A (Y₀, i₀)
IS shifts left
New equilibrium: Point A' (Y₁, i₀) where Y₁ < Y₀
```

**Key Insight**: With horizontal LM (modern central banking), fiscal policy directly affects output without changing interest rates (unless the Fed responds).

### Fiscal Expansion ($G \uparrow$ or $T \downarrow$)

**Which Curve Moves?** IS

**Direction**: IS shifts **right**

**Example**: COVID-19 fiscal stimulus
- Large transfers to households (especially low-income)
- $G$ increased dramatically
- IS shifted significantly right

**New Equilibrium** (Fed accommodates):
- Output increases: $Y' > Y$
- Interest rate unchanged if Fed accommodates

**Historical Context**:
- COVID-19 recession saw the **largest combined monetary and fiscal policy package in history**
- Massive fiscal expansion + Fed keeping rates at zero
- Result: Strong recovery but eventual overheating → inflation

---

## 7. Key Takeaways

1. **IS Curve**:
   - Represents goods market equilibrium
   - Downward sloping: higher $i$ → lower $I$ → lower $Y$
   - Shifts: Fiscal policy, consumer/business confidence, wealth effects

2. **Modern LM Curve**:
   - Horizontal at central bank's target rate
   - Represents central bank's policy stance
   - Shifts: Only when central bank changes target rate

3. **Equilibrium**:
   - Unique point where both markets clear
   - Determined by intersection of IS and LM

4. **Policy Framework**:
   - This is how central banks (including the Fed) think
   - IS-LM provides the foundation; real models add more equations
   - Essential for understanding monetary and fiscal policy interactions

5. **Current Application**:
   - Overheating economy (high aggregate demand)
   - Fed raising rates (LM shifts up) to cool economy
   - Understanding requires IS-LM framework

**Next Lecture**: More policy experiments, combinations of fiscal and monetary policy, and applications to recent economic events.

---

## Important Questions to Consider

1. **Always ask first**: Which curve moves? (IS or LM?)
   - Fiscal/demand shocks → IS
   - Monetary policy → LM

2. What happens to points off equilibrium?
   - Identify which market is in disequilibrium
   - Identify direction of imbalance (excess supply vs. excess demand)

3. How do multiplier effects work in the IS-LM framework?
   - Initial shock to aggregate demand
   - Multiplier amplifies through ZZ curve
   - Final change in output determined by IS-LM equilibrium
