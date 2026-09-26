# Lecture 24: Expectations in IS-LM

## Overview
This lecture integrates expectations into the IS-LM framework, introducing permanent income and life-cycle theories of consumption, and analyzing how forward-looking behavior affects policy effectiveness.

## 1. Motivation: Expectations Matter for All Agents

### Why the Static IS-LM Overweights the Present
- **Consumption**: Depends on current disposable income ($Y - T$).
- **Investment**: Depends on current output ($Y$) and current interest rate ($i$).

### Reality: The Future Dominates Decisions
- **Consumers**: Care about lifetime income (permanent income, human wealth).
- **Firms**: Invest based on expected future profits (not current sales).
- **Governments**: Long-term fiscal sustainability matters.
- **Foreign Investors**: Future political/economic conditions drive FDI.

**Key Insight**: Expectations about the future often matter **more** than current conditions.

## 2. Consumption with Expectations

### Permanent Income Hypothesis (Milton Friedman)
- **Core Idea**: Consumption depends on **permanent income** (expected average lifetime income), not current income.
- **Implication**: Temporary income changes have **small** effects; permanent changes have **large** effects.

### Life-Cycle Theory (Franco Modigliani)
- **Core Idea**: Individuals smooth consumption over their lifetime.
    - **Young**: Borrow (income < consumption).
    - **Middle-aged**: Save heavily (income > consumption, prepare for retirement).
    - **Old**: Dissave (income < consumption, live off savings).

### Wealth-Based Consumption Function
$$C = c_0 + c_1 \times \text{(Total Wealth)}$$

**Total Wealth** = Financial Wealth + Human Wealth

#### Financial Wealth
$$\text{Financial Wealth} = \text{EPDV of asset cash flows} - \text{Debts}$$
- Includes stocks, bonds, real estate, expected inheritances.
- **Borrowing against wealth**: Rich often borrow against assets (tax advantages) rather than selling.

#### Human Wealth
$$\text{Human Wealth} = \text{EPDV of future labor income}$$
- For most people, **human wealth >> financial wealth**.
- Example: Students have low current income but high human wealth $\Rightarrow$ Borrow/consume more than current income.

### Realistic Consumption Function
$$C = c_0 + c_1 (Y - T) + c_2 \times \text{(Total Wealth)}$$

- **Current income** ($Y - T$) matters: Liquidity constraints, hand-to-mouth consumers.
- **Wealth** matters: Forward-looking, captures permanent income effects.

**Interpretation of $c_0$ in Static IS-LM**: Captured consumer confidence, expectations $\Rightarrow$ Now we model this explicitly via wealth.

## 3. Investment with Expectations

### Value of a Machine
Firm buys machine for price $P_K$ (normalize to 1). Machine depreciates at rate $\delta$ (geometric).

**EPDV of Machine**:
$$V_t = \frac{E_t[\pi_{t+1}]}{1 + i_t} + \frac{(1 - \delta) E_t[\pi_{t+2}]}{(1 + i_t)(1 + E_t[i_{t+1}])} + \cdots$$

- $\pi_{t+n}$: Expected profits in year $n$.
- $(1 - \delta)^{n-1}$: Probability machine still works in year $n$.

**Investment Decision**: Buy machine if $V_t > P_K$.

### Investment Function with Expectations
$$I = I(V_t, Y_t, i_t)$$

- **$V_t$ (EPDV of future profits)**: $\uparrow V_t$ $\Rightarrow$ $\uparrow I$ (main driver).
- **$Y_t$ (current output)**: Relaxes financial constraints (internal funds).
- **$i_t$ (interest rate)**: Borrowing cost + discounting effect.

**Key Insight**: Future expected profits matter more than current conditions.

### Simplification: Use Yield Curve
Firms don't need to forecast future short rates $i_{t+1}, i_{t+2}, \ldots$
- Can use current term structure: $i_{2t}, i_{3t}, \ldots$ (market already incorporates expectations).

## 4. Expectations-Augmented IS-LM

### Augmented Aggregate Demand
$$Z = C(Y, T, i, \mathbf{Y^e, T^e, i^e, \ldots}) + I(Y, i, \mathbf{Y^e, i^e, \ldots}) + G$$

- **Current variables**: $Y, T, i, G$.
- **Future expectations** (bolded): $E_t[Y_{t+1}], E_t[T_{t+1}], E_t[i_{t+1}], \ldots$

**Signs** (same as static model):
- $\frac{\partial Z}{\partial Y} > 0$, $\frac{\partial Z}{\partial Y^e} > 0$ (higher future income $\Rightarrow$ higher human wealth).
- $\frac{\partial Z}{\partial T} < 0$, $\frac{\partial Z}{\partial T^e} < 0$ (higher future taxes $\Rightarrow$ lower human wealth).
- $\frac{\partial Z}{\partial i} < 0$, $\frac{\partial Z}{\partial i^e} < 0$ (higher future rates $\Rightarrow$ lower EPDV).

### IS Curve: Much Steeper
- **Why?**: Moving $i_t$ alone (without changing $E_t[i_{t+1}]$) has **small** effect.
- **Movement along IS**: Small $\Delta Y$ for given $\Delta i$ (most of value comes from future).

### Recovering Monetary Policy Power: Shift IS
- **Cut $i_t$ AND convince markets $E_t[i_{t+1}] \downarrow$** $\Rightarrow$ IS shifts **right**.
- **Mechanism**:
    1. Lower future rates $\Rightarrow$ Higher EPDV (consumption + investment).
    2. Lower future rates $\Rightarrow$ Higher future $Y$ $\Rightarrow$ Higher human wealth $\Rightarrow$ Higher consumption.

**Forward Guidance**: Central banks emphasize future policy path to maximize impact.

## 5. Policy Implications

### A. Temporary vs. Permanent Changes

#### Temporary Tax Cut
- **Current effect**: $\downarrow T$ $\Rightarrow$ $\uparrow (Y - T)$ $\Rightarrow$ $\uparrow C$ (small).
- **Wealth effect**: No change (human wealth = EPDV of future income, which is unchanged).
- **Result**: **Small multiplier** (most of windfall saved).

#### Permanent Tax Cut
- **Current effect**: $\downarrow T$ $\Rightarrow$ $\uparrow (Y - T)$ $\Rightarrow$ $\uparrow C$ (small).
- **Wealth effect**: $\downarrow E_t[T_{t+1}]$ $\Rightarrow$ $\uparrow$ Human wealth $\Rightarrow$ $\uparrow C$ (large).
- **Result**: **Large multiplier** (similar to static IS-LM).

**Key Insight**: Permanent fiscal changes have much larger effects than temporary changes.

### B. Monetary Policy with Forward Guidance

#### Scenario 1: Cut $i_t$ Only (No Forward Guidance)
- **Effect**: Small movement along steep IS $\Rightarrow$ $\Delta Y$ is small.

#### Scenario 2: Cut $i_t$ + Commit to Low $i_{t+1}$
- **Direct effect**: Movement along IS (small).
- **Expectation effect**: IS shifts right (large).
    - Lower $E_t[i_{t+1}]$ $\Rightarrow$ Higher EPDV $\Rightarrow$ $\uparrow I, C$.
    - Lower $E_t[i_{t+1}]$ $\Rightarrow$ Higher $E_t[Y_{t+1}]$ $\Rightarrow$ Higher human wealth $\Rightarrow$ $\uparrow C$.
- **Result**: **Much larger $\Delta Y$**.

**Modern Central Banking**: Fed/ECB speeches emphasize policy path ("higher for longer", "patient approach") to shape expectations.

### C. Fiscal Policy and Expectations

#### Standard Effect: Contractionary
- $\downarrow G$ $\Rightarrow$ IS shifts left $\Rightarrow$ $Y \downarrow$ (direct effect dominates).

#### Expansionary Fiscal Contraction (Rare)
Can occur if fiscal consolidation dramatically improves expectations:
1. **Removes uncertainty**: Fiscal crisis risk eliminated $\Rightarrow$ $\uparrow E_t[Y_{t+1}]$ $\Rightarrow$ $\uparrow$ Human wealth $\Rightarrow$ $\uparrow C$.
2. **Enables monetary easing**: Central bank cuts rates in response $\Rightarrow$ $E_t[i_{t+1}] \downarrow$ $\Rightarrow$ IS shifts right.

**Example: Ireland (Late 1980s)**
- **Context**: Chronic fiscal deficits, economic stagnation, dominated political discourse.
- **Policy**: Aggressive fiscal consolidation (deficit reduction).
- **Result**:
    - $Y$ **increased** (GDP growth accelerated).
    - Unemployment rose (lagging indicator), but consumption + investment surged.
    - Household savings rate plummeted (optimism about future).
- **Why?**: Removed fiscal uncertainty $\Rightarrow$ Expectations improved $\Rightarrow$ Offset contractionary direct effect.

**Caveat**: This is **rare**. Most fiscal contractions are contractionary (direct effect dominates). Requires extreme starting conditions (chronic crisis, high uncertainty).

## 6. The Greenspan Conundrum

### Context
- **Alan Greenspan** (Fed Chair, 1987-2006): Widely regarded as successful.
- **Problem (mid-2000s)**: Economy overheating, Fed raised short rates, but **long rates fell**.

### Mechanism
- Fed hiked short rates $\Rightarrow$ But couldn't convince markets of persistent tightening.
- Long rates = Average of expected future short rates $\Rightarrow$ Markets expected Fed to reverse course.
- **Result**: Fed ineffective (couldn't cool economy via long-rate channel).

### Actual Cause
- **External factor**: Massive capital inflows from China (savings glut) pushed down long rates.
- **Lesson**: Expectations matter, but sometimes external forces dominate.

## 7. Summary

### Consumption
- Depends on **total wealth** (financial + human), not just current income.
- **Permanent changes** have much larger effects than temporary changes.

### Investment
- Driven by **EPDV of future profits** (not current sales alone).
- Firms can use term structure (no need to forecast rates).

### IS-LM with Expectations
- **IS is steeper**: Current policy variables have smaller effects.
- **Shift IS via expectations**: Future policy commitments restore power.

### Policy Lessons
1. **Temporary policies** are weak (wealth barely changes).
2. **Permanent policies** are strong (wealth changes significantly).
3. **Forward guidance** is critical for monetary policy effectiveness.
4. **Fiscal contractions** can be expansionary if expectations improve dramatically (rare).

**Central Banking = Expectations Management**: Policy actions matter less than communication about future policy path.

**Next**: Review for Quiz 3 (open economy, asset pricing, expectations).
