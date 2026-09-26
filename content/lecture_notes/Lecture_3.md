# Lecture 3: The Goods Market and Aggregate Demand

## Overview
This lecture introduces the first model of output determination in the short run. We analyze how equilibrium GDP is determined by **aggregate demand** in a closed economy. The key mechanism—the **multiplier effect**—shows how an initial change in demand (e.g., from government spending or consumer confidence) generates larger changes in equilibrium output through feedback loops between production, income, and consumption. We also explore fiscal policy and the **Paradox of Savings**, a counterintuitive result where attempts to save more can reduce aggregate output.

**Context**: Economists forecast a 65% probability of recession within 12 months (as of 2023). Understanding output determination is essential to forecasting recessions.

## 1. Forecasting Recessions: Why Do We Need Models?

### Survey of Professional Economists
- **Question**: What is the probability of a recession within the next 12 months?
- **Current Answer (2023)**: ~65% probability—historically very high.
- **Typical Periods**: Recession probability usually <10%; spikes near/during recessions.

**How Do Economists Forecast Recessions?**
- Explicitly or implicitly, they use **models of equilibrium output determination**.
- They observe factors (consumer confidence, interest rates, fiscal policy) and run them through a model to predict whether output will decline (recession) or grow (expansion).

**Goal of This Course**: Build progressively richer models of output determination.

## 2. Three Time Horizons for Output Determination

### Short Run (Focus of Lectures 3-10)
- **Time Frame**: Within a year or so.
- **Mechanism**: Output determined primarily by **aggregate demand**.
- **Assumption**: Prices are sticky (fixed)—little movement in goods prices (asset prices may move).
- **Application**: Business cycle analysis (recessions, booms, expansions).

### Medium Run (Lectures 11-13)
- **Time Frame**: Prices begin to adjust sufficiently.
- **Mechanism**: Interaction between demand and supply; wage-price dynamics.
- **Application**: Inflation-unemployment trade-offs (Phillips Curve).

### Long Run (Lectures 14-17)
- **Time Frame**: Decades.
- **Mechanism**: Output determined by **supply factors**—capital, labor, technology.
- **Application**: Growth theory (Why does China grow faster than the US?).

**Key Distinction**:
- **Short/Medium Run** → Business cycle (demand-driven).
- **Long Run** → Growth (supply-driven: capital accumulation, technological progress).

## 3. The Core Short-Run Mechanism: Demand → Production → Income → Demand

### The Feedback Loop
1. **Change in Demand** → Change in Production.
2. **Change in Production** → Change in Income (Production = Income, from national accounts).
3. **Change in Income** → Change in Demand (consumers spend part of extra income).
4. **Repeat**: This creates a **multiplier effect**.

**Key Insight**: In the short run, output is demand-determined. This is why **consumer confidence** matters so much—if consumers are depressed, demand falls, triggering a recession.

**Why Focus on Demand?**
- Short-run assumption: Firms have **unused capacity** (idle factories, unemployed workers).
- Firms can adjust output quickly in response to demand changes.
- Contrast with long run: Output constrained by capital, labor, technology.

## 4. Components of Aggregate Demand

### Definitions

#### 1. Consumption ($C$)
- **Definition**: Goods and services purchased by households.
- **Share of GDP**: ~70% (largest component).
- **Why It Matters**: University of Michigan Consumer Sentiment Index closely watched by economists/financial markets.

#### 2. Investment ($I$)
- **Definition**: $I = \text{Nonresidential Investment} + \text{Residential Investment}$.
    - **Nonresidential**: Equipment, factories, machinery.
    - **Residential**: Houses, apartment buildings.
- **Share of GDP**: ~18% (substantial, but smaller than consumption).

#### 3. Government Spending ($G$)
- **Definition**: Purchases of goods/services by federal, state, local government.
- **Important Exclusion**: Government **transfers** (e.g., COVID stimulus checks) are **not** part of $G$.
    - Transfers are like **negative taxes** (enter through $T$, not $G$).
- **Share of GDP**: ~17%.

#### 4. Net Exports ($X - IM$)
- **Exports ($X$)**: Purchases of US goods by foreigners.
- **Imports ($IM$)**: Purchases of foreign goods by US residents.
- **For Now**: Assume closed economy → $X = IM = 0$ (we open the economy in Lecture 19).

#### 5. Inventory Investment
- **Definition**: Difference between production and sales (unintended accumulation/decumulation of inventories).
- **Importance**: Small (volatile but not systematically important).
- **For This Course**: Assume inventory investment = 0 (unless explicitly stated).

### Aggregate Demand Formula (Closed Economy)
$$Z = C + I + G$$

**Interpretation**: Demand for domestically-produced goods.
- Consumption ($C$): Households demand domestic goods.
- Investment ($I$): Firms demand capital goods (domestic).
- Government ($G$): Government demands domestic goods/services.
- (Later: Add $X - IM$ for open economy.)

### US Composition of GDP (2018 Example)
- **Consumption**: 68% of GDP.
- **Investment**: 18% (13% nonresidential, 5% residential).
- **Government**: 17%.
- **Net Exports**: Small (~-3%, trade deficit).
- **Inventory Investment**: ~0.1% (volatile but tiny on average).

## 5. Modeling Consumption: The Behavioral Assumption

### Consumption Function
$$C = C(Y_D)$$

**Assumption**: Consumption is an **increasing function** of disposable income ($Y_D$).
- If disposable income rises, households consume more.

### Disposable Income ($Y_D$)
$$Y_D = Y - T$$

- $Y$: Income (= Output = GDP).
- $T$: Taxes (net of transfers).
- $Y_D$: What households have available to consume or save.

### Linear Consumption Function
$$C = c_0 + c_1 (Y - T)$$

**Parameters**:
1. **$c_0$: Autonomous Consumption** (Intercept).
    - Consumption independent of current income.
    - Captures:
        - **Consumer confidence**: If optimistic about future, consume more today even with same current income.
        - **Wealth effects**: If stock market doubles, consume more (not modeled explicitly here).
    - **Example**: If expect economy to boom next year, increase consumption today (captured by higher $c_0$).

2. **$c_1$: Marginal Propensity to Consume (MPC)** (Slope).
    - **Definition**: Share of an extra dollar of disposable income that is consumed.
    - **Range**: $0 < c_1 < 1$.
    - **Example**: If you get $1 extra income and spend $0.60 on consumption, then $c_1 = 0.6$.
    - **Interpretation**: $c_1 = 0.6$ means you consume 60¢ and save 40¢ of each extra dollar.

### Graphical Representation
- **Axes**: Disposable income ($Y_D$) on x-axis, Consumption ($C$) on y-axis.
- **Intercept**: $c_0$ (autonomous consumption).
- **Slope**: $c_1$ (MPC).
- **Shape**: Upward-sloping line with slope between 0 and 1.

**Key Insight**: The consumption function is the **only behavioral assumption** in this model. Everything else follows from definitions and equilibrium conditions.

## 6. Determining Equilibrium Output

### Step 1: Aggregate Demand Function
$$Z = C + I + G$$

Substitute the consumption function:
$$Z = c_0 + c_1 (Y - T) + I + G$$

Rearrange:
$$Z = [c_0 + I + G - c_1 T] + c_1 Y$$

**Key Feature**: Aggregate demand is an **increasing function of output** ($Y$).
- **Slope**: $c_1$ (the MPC).
- **Intercept**: $c_0 + I + G - c_1 T$ (autonomous components).

### Step 2: Equilibrium Condition
$$Y = Z$$

**Interpretation**: In equilibrium, production (output, $Y$) equals demand ($Z$).

**Important Distinction**:
- **$Z = c_0 + c_1 (Y - T) + I + G$** is a **function** (holds everywhere).
- **$Y = Z$** is an **equilibrium condition** (holds only at equilibrium).

**Common Mistake**: Treating $Y = Z$ as a function. It's not—it's a condition that pins down equilibrium.

### Step 3: Solve for Equilibrium Output
Substitute aggregate demand into equilibrium condition:
$$Y = c_0 + c_1 (Y - T) + I + G$$

Rearrange:
$$Y - c_1 Y = c_0 + I + G - c_1 T$$

$$Y (1 - c_1) = c_0 + I + G - c_1 T$$

$$Y = \frac{1}{1 - c_1} [c_0 + I + G - c_1 T]$$

**Equilibrium Output Formula**:
$$\boxed{Y = \frac{1}{1 - c_1} [c_0 + I + G - c_1 T]}$$

## 7. The Multiplier

### Definition
$$\text{Multiplier} = \frac{1}{1 - c_1}$$

**Why "Multiplier"?**
- Since $0 < c_1 < 1$, we have $\frac{1}{1 - c_1} > 1$.
- Example: If $c_1 = 0.6$, then Multiplier = $\frac{1}{1 - 0.6} = \frac{1}{0.4} = 2.5$.

### Interpretation
An **autonomous** increase in spending (e.g., $\Delta G = \$1 \text{ billion}$) leads to a **larger** increase in equilibrium output:
$$\Delta Y = \text{Multiplier} \times \Delta G = \frac{1}{1 - c_1} \times \$1 \text{ billion}$$

**Example**: If $c_1 = 0.6$ and $\Delta G = \$1 \text{ billion}$:
$$\Delta Y = 2.5 \times \$1 \text{ billion} = \$2.5 \text{ billion}$$

### Why Does the Multiplier Exist?

**Mechanism** (for $\Delta G = \$1 \text{ billion}$, $c_1 = 0.6$):

1. **Round 1**: Government spends $\$1 \text{ billion}$ → Output $\uparrow \$1 \text{ billion}$ → Income $\uparrow \$1 \text{ billion}$.
2. **Round 2**: Households receive $\$1 \text{ billion}$ extra income → Consume $c_1 \times \$1 \text{ billion} = \$0.6 \text{ billion}$ → Demand $\uparrow \$0.6 \text{ billion}$ → Output $\uparrow \$0.6 \text{ billion}$ → Income $\uparrow \$0.6 \text{ billion}$.
3. **Round 3**: Households receive $\$0.6 \text{ billion}$ extra income → Consume $c_1 \times \$0.6 \text{ billion} = \$0.36 \text{ billion}$ → Output $\uparrow \$0.36 \text{ billion}$.
4. **Continue**: $\$0.216 \text{ billion}$, $\$0.13 \text{ billion}$, ...

**Total Effect** (geometric series):
$$\Delta Y = \$1 \text{B} \times (1 + 0.6 + 0.36 + 0.216 + \ldots) = \$1 \text{B} \times \frac{1}{1 - 0.6} = \$2.5 \text{B}$$

**Key Insight**: The multiplier is **larger** when $c_1$ (MPC) is larger. If consumers spend a high share of extra income, the feedback loop is stronger.

### Policy Relevance: Size of the Multiplier
- **Large Multiplier** (high $c_1$): Small fiscal stimulus generates large output increase.
- **Small Multiplier** (low $c_1$): Large fiscal stimulus needed to boost output significantly.

**Debate During Great Recession (2008-2009)**:
- Economists disagreed about the size of the multiplier.
- Estimates ranged from 0.5 to 2.5, with major policy implications (how much stimulus to inject?).

## 8. The Keynesian Cross Diagram

### Setup
- **Horizontal Axis**: Output/Income ($Y$).
- **Vertical Axis**: Aggregate Demand ($Z$).

### Two Lines
1. **Aggregate Demand ($ZZ$)**: $Z = c_0 + c_1 (Y - T) + I + G$.
    - **Intercept**: $c_0 + I + G - c_1 T$.
    - **Slope**: $c_1$ (MPC, between 0 and 1).
    - **Why Flatter Than 45°?** Because $c_1 < 1$ (households don't spend all extra income).

2. **45-Degree Line**: $Z = Y$ (equilibrium condition).
    - **Why 45°?** Any point on this line has $Z = Y$ (vertical distance = horizontal distance).
    - This is **not a function**—it's the locus of points satisfying the equilibrium condition.

### Equilibrium Point
- **Intersection** of $ZZ$ curve and 45° line.
- At this point: Aggregate demand = Output.
- **Off equilibrium** (e.g., to the left of intersection): $Z > Y$ (demand exceeds output).
- **Off equilibrium** (to the right): $Z < Y$ (output exceeds demand).

### Key Insight
- **Only one point** (the intersection) satisfies $Y = Z$.
- The $ZZ$ curve can be evaluated everywhere (it's a function), but equilibrium holds only at the intersection.

## 9. Policy Experiments

### Experiment 1: Increase in Autonomous Consumption ($\Delta c_0 = +\$1 \text{ billion}$)

**Interpretation**: Consumer confidence improves—households consume more at any given income level.

**Algebraic Effect**:
$$\Delta Y = \frac{1}{1 - c_1} \times \Delta c_0 = \frac{1}{1 - c_1} \times \$1 \text{B}$$

**Example** ($c_1 = 0.5$):
$$\Delta Y = \frac{1}{0.5} \times \$1 \text{B} = \$2 \text{B}$$

**Graphical Analysis** (Keynesian Cross):

1. **Step A→B**: $ZZ$ curve shifts **up** by $\$1 \text{B}$ (parallel shift).
    - Distance A→B = $\$1 \text{B}$ (initial increase in autonomous consumption).
2. **Step B→C**: Output immediately adjusts to meet demand → Output $\uparrow \$1 \text{B}$.
    - Distance B→C = $\$1 \text{B}$ (vertical distance to 45° line).
3. **Step C→D**: Income $\uparrow \$1 \text{B}$ → Consumption $\uparrow c_1 \times \$1 \text{B} = \$0.5 \text{B}$ (if $c_1 = 0.5$).
    - Distance C→D = $\$0.5 \text{B}$ (movement along new $ZZ$ curve).
4. **Step D→E**: Output adjusts again → Output $\uparrow \$0.5 \text{B}$ → Income $\uparrow \$0.5 \text{B}$.
5. **Continue**: $\$0.25 \text{B}$, $\$0.125 \text{B}$, ... → Converge to new equilibrium at $Y' = Y + \$2 \text{B}$.

**Key Takeaway**: A $\$1 \text{B}$ increase in autonomous spending leads to $\$2 \text{B}$ increase in output (if $c_1 = 0.5$). The multiplier amplifies the initial shock.

### Experiment 2: Expansionary Fiscal Policy ($\Delta G = +\$1 \text{ billion}$)

**Mechanism**: Identical to increase in $c_0$.
- $ZZ$ curve shifts up by $\$1 \text{B}$.
- Multiplier effect: $\Delta Y = \frac{1}{1 - c_1} \times \$1 \text{B}$.

**Fiscal Multiplier**: A $\$1 increase in government spending raises output by more than $\$1.

### Experiment 3: Tax Increase ($\Delta T = +\$1 \text{ billion}$)

**Effect on Aggregate Demand**:
$$Z = c_0 + c_1 (Y - T) + I + G$$

Increase in $T$ reduces disposable income:
$$\Delta Z = -c_1 \Delta T = -c_1 \times \$1 \text{B}$$

**Effect on Equilibrium Output**:
$$\Delta Y = \frac{1}{1 - c_1} \times (-c_1 \Delta T) = -\frac{c_1}{1 - c_1} \times \$1 \text{B}$$

**Example** ($c_1 = 0.6$, $\Delta T = +\$1 \text{B}$):
$$\Delta Y = -\frac{0.6}{0.4} \times \$1 \text{B} = -\$1.5 \text{B}$$

**Key Insight**: Tax increases are **contractionary** (reduce output), but less contractionary per dollar than government spending is expansionary.
- **Why?** Consumers only reduce spending by $c_1$ (save the rest), so initial shock smaller.

## 10. Alternative Derivation: Investment = Saving

### Definitions
- **Private Saving** ($S$): $S = Y - T - C$ (disposable income minus consumption).
- **Public Saving** ($T - G$): Government budget balance (surplus if positive, deficit if negative).

### Equilibrium Condition (Alternative Form)
$$I = S + (T - G)$$

**Interpretation**: Investment = Private Saving + Public Saving.

**Equivalence to $Y = Z$**:
$$I = (Y - T - C) + (T - G)$$
$$I = Y - C - G$$
$$Y = C + I + G = Z$$

**Why This Matters**: The curve we'll study later—**IS curve**—stands for "Investment = Saving."

### Graphical Representation
- **Horizontal Axis**: Output ($Y$).
- **Vertical Axis**: Investment ($I$) and Saving ($S + T - G$).
- **Investment**: Horizontal line (assumed constant at $\bar{I}$).
- **Saving**: Upward-sloping line with slope $1 - c_1$ (marginal propensity to save).
- **Equilibrium**: Where Investment line intersects Saving line.

## 11. The Paradox of Savings

### The Question
- **Individual Level**: Saving more is good (increases wealth).
- **Aggregate Level**: Is saving more good for the economy?

**Answer (Short Run)**: **No**—attempts to save more can **reduce** equilibrium output and may not even increase total saving.

### Mechanism (Using IS Derivation)

**Scenario**: Households decide to save more for any given level of income.
- **Effect**: Private saving function shifts **up**.
- **Problem**: Now $S > I$ (more saving than investment) → **Not an equilibrium**.

**How Does Equilibrium Restore?**
- Investment ($I$) is fixed (exogenous).
- Public saving ($T - G$) is fixed (exogenous).
- **Only endogenous variable**: Output ($Y$).

**Result**: Output must **fall** to reduce saving back to $I$.
- Lower $Y$ → Lower income → Lower saving → Equilibrium restored at lower output.

**Paradox**: Attempts to save more lead to a **recession** (lower $Y$). In equilibrium, total saving may be **unchanged** (still equals $I$) or even lower if recession is severe.

### Mechanism (Using Keynesian Cross)

**Scenario**: Households save more → $c_0$ falls (autonomous consumption declines).
- **Effect**: $ZZ$ curve shifts **down**.
- **Result**: Equilibrium output falls.
- **Multiplier Effect**: Output falls by **more** than the initial decline in consumption (multiplier works in reverse).

**Key Insight**: What is true for an individual (saving more makes you richer) is **not** true for the economy as a whole (everyone saving more causes a recession). This is **Fallacy of Composition**.

### When Does the Paradox Matter?
- **Normal/Recession Times**: Paradox holds—attempts to save more are contractionary.
- **Overheated Economy** (like 2023): Higher saving would be **beneficial** (reduce demand → lower inflation).

**Policy Implication**: During recessions, governments try to **boost confidence** and **discourage excessive saving** to prevent spiraling declines in output.

## 12. Fiscal Policy: Expansionary vs. Contractionary

### Definitions

#### Expansionary Fiscal Policy
- **Increase $G$** (government spending) or **Decrease $T$** (taxes).
- **Effect**: Shifts $ZZ$ curve **up** → Output $\uparrow$ (boom).
- **Use**: Fight recessions.

#### Contractionary Fiscal Policy
- **Decrease $G$** or **Increase $T$**.
- **Effect**: Shifts $ZZ$ curve **down** → Output $\downarrow$ (slowdown/recession).
- **Use**: Cool overheated economy (reduce inflation pressure).

### Current Policy Stance (2023)
- **Fed's Goal**: Cool the economy (contractionary).
- **Method**: Raise interest rates (monetary policy—covered in Lecture 5+).
- **Communication Strategy**: Fed officials make speeches emphasizing tightening to **reduce confidence** and dampen consumption/investment.

**Effect of Fed Speeches**:
- Financial markets react immediately (equity prices fall).
- Consumers eventually respond (reduce spending).
- **Goal**: Induce a mild recession to bring down inflation.

## 13. Summary

### Key Concepts
1. **Short-Run Output Determination**: Output determined by aggregate demand ($Y = Z$).
2. **Aggregate Demand**: $Z = C + I + G$ (closed economy).
3. **Consumption Function**: $C = c_0 + c_1 (Y - T)$.
    - $c_0$: Autonomous consumption.
    - $c_1$: Marginal propensity to consume (MPC).
4. **Equilibrium Output**:
$$Y = \frac{1}{1 - c_1} [c_0 + I + G - c_1 T]$$
5. **Multiplier**: $\frac{1}{1 - c_1} > 1$.
    - Amplifies shocks to autonomous spending.
    - Larger when $c_1$ is larger (consumers spend more of extra income).

### Key Diagrams
1. **Keynesian Cross**: Intersection of $ZZ$ curve (aggregate demand) and 45° line ($Y = Z$).
2. **Investment = Saving**: Intersection of horizontal $I$ line and upward-sloping $S$ curve.

### Policy Implications
1. **Fiscal Policy**:
    - $\uparrow G$ or $\downarrow T$ → Expansionary (output $\uparrow$).
    - $\downarrow G$ or $\uparrow T$ → Contractionary (output $\downarrow$).
2. **Multiplier Effect**: Government spending increases output by **more** than the initial spending (due to feedback loops).
3. **Paradox of Savings**: Attempts to save more can backfire, causing recessions in the short run.

### Key Insights
1. **Demand Drives Output** (short run): Firms produce whatever demand requires (unused capacity).
2. **Multiplier Mechanism**: Initial demand shock → Output change → Income change → Consumption change → Further output change → ...
3. **Macro ≠ Micro**: What's good for individuals (saving more) may harm the aggregate economy (Paradox of Savings).
4. **Consumer Confidence Matters**: Changes in $c_0$ (sentiment) can drive recessions or booms.

### Coming Up
- **Lecture 4**: Introduce financial markets—interest rates, money demand/supply, central bank policy.
- **Lecture 5**: Integrate goods market (this lecture) with financial markets → **IS-LM model**.

**Next**: We add financial markets and monetary policy to understand how interest rates affect output.
