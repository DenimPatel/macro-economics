# Lecture 25: Review for Quiz 3

## Overview
This lecture reviews material for Quiz 3, covering open economy (Mundell-Fleming), asset pricing (bonds and equity), and expectations in IS-LM. **~73% of quiz** relates to Mundell-Fleming model.

## 1. Open Economy: Goods Market Only

### Demand for Domestic Goods vs. Domestic Demand
- **Domestic Demand** ($D$): $D = C(Y - T) + I(Y, i) + G$ (what residents buy).
- **Demand for Domestic Goods** ($Z$): $Z = D + X - IM$ (what domestic producers sell).

### Net Exports
$$NX = X(Y^*, \epsilon) - IM(Y, \epsilon)$$

- **Exports**: $\frac{\partial X}{\partial Y^*} > 0$, $\frac{\partial X}{\partial \epsilon} < 0$ (appreciation $\Rightarrow$ less exports).
- **Imports**: $\frac{\partial IM}{\partial Y} > 0$, $\frac{\partial IM}{\partial \epsilon} > 0$ (appreciation $\Rightarrow$ more imports).
- **Assumption (Always Holds on Quiz)**: $\frac{\partial NX}{\partial \epsilon} < 0$ (appreciation worsens net exports).

### ZZ Curve Diagram
1. Start with $DD = C + I + G$ (domestic demand).
2. Subtract $IM(Y, \epsilon)$ $\Rightarrow$ Shifts down + rotates (flatter, due to $\frac{\partial IM}{\partial Y} > 0$).
3. Add $X(Y^*, \epsilon)$ $\Rightarrow$ Parallel shift up (exports not function of $Y$).
4. Result: $ZZ$ curve (demand for domestic goods).

**Key Point**: $ZZ - DD = NX$ (vertical distance = trade balance).

### Equilibrium
$$Y = Z \quad \text{(45° line intersection)}$$

- **Trade Surplus**: $ZZ > DD$ (output low, imports low).
- **Trade Deficit**: $ZZ < DD$ (output high, imports high).

### Multiplier
- **Open economy multiplier < Closed economy** (import leakage: $\frac{\partial IM}{\partial Y} > 0$).

### Policy Experiments
1. **$\uparrow G$**: IS shifts right $\Rightarrow$ $Y \uparrow$ (less than closed), $NX \downarrow$ (trade deficit worsens).
2. **$\uparrow Y^*$**: $X \uparrow$ $\Rightarrow$ ZZ shifts up $\Rightarrow$ $Y \uparrow$, $NX \uparrow$ (trade surplus improves).
3. **$\downarrow \epsilon$** (depreciation): $X \uparrow$, $IM \downarrow$ $\Rightarrow$ ZZ shifts up $\Rightarrow$ $Y \uparrow$, $NX \uparrow$ (expenditure switching).

## 2. Mundell-Fleming Model (**~73% of Quiz**)

### Components
1. **IS (Open Economy)**: $Y = C(Y - T) + I(Y, i) + G + NX(Y, Y^*, E)$.
2. **UIP**: $E_t = \frac{1 + i_t}{1 + i^*_t} E^e_{t+1}$ (uncovered interest parity).
3. **LM**: $i = \bar{i}$ (central bank sets rate).

### Assumptions
- **Sticky prices**: $P = \text{constant}$ $\Rightarrow$ Real exchange rate = Nominal exchange rate ($\epsilon = E$).
- **Fixed expected exchange rate**: $E^e_{t+1} = \bar{E}^e$ (parameter, not endogenous).

### UIP Condition (Critical)
$$E_t = \frac{1 + i_t}{1 + i^*_t} E^e_{t+1}$$

**Approximation**:
$$i_t \approx i^*_t + \frac{E^e_{t+1} - E_t}{E_t}$$

**Interpretation**: Domestic rate = Foreign rate + Expected depreciation of domestic currency.

**Key Results**:
- $\uparrow i$ (domestic) $\Rightarrow$ $E \uparrow$ (appreciation today $\Rightarrow$ expect depreciation tomorrow).
- $\uparrow i^*$ $\Rightarrow$ $E \downarrow$ (depreciation today $\Rightarrow$ expect appreciation tomorrow).
- $\uparrow E^e$ $\Rightarrow$ $E \uparrow$ (appreciation today, one-for-one if $i = i^*$).

### UIP Diagram
- **Axes**: $E$ (horizontal), $i$ (vertical).
- **Upward sloping**: Higher $i$ requires higher $E$ (to generate expected depreciation).
- **Key Point**: When $i = i^*$, then $E = E^e$ (no expected change $\Rightarrow$ no interest differential).

**Shifts**:
- $\uparrow i^*$: UIP shifts **left** (depreciation).
- $\uparrow E^e$: UIP shifts **right** (appreciation).

### IS Curve (Open Economy)
- **Steeper than closed economy** (less sensitive to $i$ due to import leakage).
- **Interest rate has two effects**:
    1. **Investment channel**: $\uparrow i$ $\Rightarrow$ $\downarrow I$ $\Rightarrow$ $\downarrow Y$.
    2. **Net export channel**: $\uparrow i$ $\Rightarrow$ $E \uparrow$ (via UIP) $\Rightarrow$ $NX \downarrow$ $\Rightarrow$ $\downarrow Y$.
- **Result**: Monetary policy **more powerful** in open economy (two contractionary channels).

### Mundell-Fleming Diagram
1. **Top**: IS-LM (determines $Y$ and $i$).
2. **Bottom**: UIP (determines $E$ given $i$).

### Policy Experiments

#### 1. Contractionary Monetary Policy ($\uparrow i$)
- **IS-LM**: LM shifts up $\Rightarrow$ $Y \downarrow$ (investment $\downarrow$ + $NX \downarrow$).
- **UIP**: Move along curve $\Rightarrow$ $E \uparrow$ (appreciation).

#### 2. Expansionary Fiscal Policy ($\uparrow G$, Fed accommodates)
- **IS-LM**: IS shifts right $\Rightarrow$ $Y \uparrow$ (smaller multiplier than closed economy).
- **UIP**: No change (LM unchanged $\Rightarrow$ $i$ unchanged $\Rightarrow$ $E$ unchanged).

#### 3. Increase in Expected Exchange Rate ($\uparrow E^e$)
- **UIP**: Shifts **right** $\Rightarrow$ $E \uparrow$ (appreciation).
- **IS**: Shifts **left** (appreciation $\Rightarrow$ $NX \downarrow$).
- **Result**: $Y \downarrow$, $E \uparrow$ (contractionary).

#### 4. Foreign Output Decline ($\downarrow Y^*$)
- **IS**: Shifts **left** (exports $\downarrow$).
- **UIP**: No change.
- **Result**: $Y \downarrow$, $E$ unchanged (unless Fed responds).

#### 5. Foreign Interest Rate Increase ($\uparrow i^*$)
- **UIP**: Shifts **left** $\Rightarrow$ $E \downarrow$ (depreciation).
- **IS**: Shifts **right** (depreciation $\Rightarrow$ $NX \uparrow$).
- **Result**: $E \downarrow$, $Y \uparrow$ (if domestic $i$ unchanged).

## 3. Fixed vs. Floating Exchange Rates

### Fixed Exchange Rate (Peg)
- **Definition**: $E = E^e = \bar{E}$ (constant).
- **UIP Implication**: $i = i^*$ (no expected change $\Rightarrow$ no interest differential).
- **Loss of Monetary Independence**: Central bank must follow foreign policy.

**Example**: Hong Kong (pegged to USD) $\Rightarrow$ Hong Kong policy rate tracks US Fed rate exactly.

### Speculative Attack
- **Scenario**: Markets lose confidence, expect $E^e \downarrow$ (devaluation).
- **UIP**: To maintain peg ($E$ constant), must raise $i \uparrow\uparrow$ (offset expected depreciation).
- **Cost**: **Domestic recession** (high rates contract economy).

**Examples**:
- **ERM Crisis (1992)**: German reunification $\Rightarrow$ German rates $\uparrow$ $\Rightarrow$ UK/France forced to raise rates $\Rightarrow$ Recessions $\Rightarrow$ UK left ERM.
- **Argentina/Turkey**: Chronic attacks due to low credibility, insufficient reserves.

### Floating Exchange Rate
- **Benefits**: Independent monetary policy, no speculative attacks.
- **Costs**: **Excess volatility** (driven by expectations of distant future, narratives).

**Recursive UIP**: $E_t$ depends on expected paths of $i$ and $i^*$ far into future $\Rightarrow$ Highly sensitive to news/sentiment.

### Choosing a Regime

**Fixed Exchange Rate Preferable If**:
1. **Similar shocks** to anchor country (foreign policy appropriate).
2. **High fiscal capacity** (can fight recessions with fiscal policy).
3. **Flexible domestic prices/wages** (real exchange rate adjusts even if nominal fixed).
4. **Low inflation credibility** (import anchor's credibility).
5. **High trade integration** (reduces transaction costs).

**Examples**: Eurozone (similar cycles), Hong Kong (large reserves + flexible markets).

## 4. Asset Pricing

### Expected Present Discounted Value (EPDV)
$$V_t = Z_t + \frac{E_t[Z_{t+1}]}{1 + i_t} + \frac{E_t[Z_{t+2}]}{(1 + i_t)(1 + E_t[i_{t+1}])} + \cdots$$

**Key Insight**: \$1 received in $n$ years worth $\frac{1}{\prod_{k=0}^{n-1} (1 + i_{t+k})}$ today.

### Bond Pricing
- **One-year bond**: $P_{1t} = \frac{100}{1 + i_{1t}}$.
- **Two-year bond**: $P_{2t} = \frac{100}{(1 + i_{1t})(1 + E_t[i_{1,t+1}])}$.

**Inverse Relationship**: $\uparrow i$ $\Rightarrow$ $\downarrow P$ (less discounting of future payments).

### Yield to Maturity
**Definition**: Constant rate that equates price to EPDV.

$$P_{2t} = \frac{100}{(1 + i_{2t})^2} \quad \Rightarrow \quad i_{2t} \approx \frac{i_{1t} + E_t[i_{1,t+1}]}{2}$$

**Expectation Hypothesis**: Long rate = Average of expected short rates (+ term premium).

### Yield Curve
- **Upward sloping**: Expect rising rates (expansions, pre-tightening).
- **Inverted**: Expect falling rates (recessions, Fed expected to ease).
- **Current (2023)**: Inverted (markets expect Fed to cut after inflation peak).

### Equity Pricing
$$Q_t = \sum_{n=1}^{\infty} \frac{E_t[D_{t+n}]}{\prod (1 + i + x_s)}$$

- **No maturity** $\Rightarrow$ Always future price term (prone to bubbles).
- **No fixed coupons** $\Rightarrow$ Dividends risky.

## 5. Expectations in IS-LM

### Consumption: Permanent Income
$$C = c_0 + c_1(Y - T) + c_2 \times (\text{Financial Wealth} + \text{Human Wealth})$$

- **Human Wealth**: EPDV of future labor income.
- **Permanent changes** have large effects; **temporary changes** have small effects.

### Investment: EPDV of Profits
$$I = I(V_t, Y, i) \quad \text{where } V_t = \text{EPDV of future profits}$$

### Augmented IS-LM
$$Z = C(Y, T, i, \mathbf{E[Y], E[T], E[i]}) + I(Y, i, \mathbf{E[Y], E[i]}) + G$$

- **IS is steeper**: Current $i$ has small effect (future matters more).
- **Forward Guidance**: Commit to future $i$ path $\Rightarrow$ Shift IS $\Rightarrow$ Larger effect.

### Policy Implications
1. **Temporary tax cut**: Small effect (wealth unchanged).
2. **Permanent tax cut**: Large effect (human wealth $\uparrow$).
3. **Monetary policy**: Effective only if convinces markets of persistent change.
4. **Fiscal consolidation**: Usually contractionary, but can be expansionary if dramatically improves expectations (Ireland example).

## 6. Key Formulas

### Mundell-Fleming
- **UIP**: $i_t \approx i^*_t + \frac{E^e_{t+1} - E_t}{E_t}$
- **IS**: $Y = C(Y - T) + I(Y, i) + G + NX(Y, Y^*, E)$
- **NX**: $\frac{\partial NX}{\partial \epsilon} < 0$ (appreciation worsens trade balance)

### Asset Pricing
- **EPDV**: $V_t = \sum_{n=0}^{\infty} \frac{E_t[Z_{t+n}]}{\prod_{k=0}^{n-1} (1 + i_{t+k})}$
- **Bond price**: $P_{nt} = \frac{100}{(1 + i_{nt})^n}$
- **Yield**: $i_{2t} \approx \frac{i_{1t} + E_t[i_{1,t+1}]}{2} + \text{term premium}$

### Expectations-Augmented Consumption
- $C = c_1(Y - T) + c_2 \times (\text{EPDV of assets} + \text{EPDV of labor income})$

## 7. Study Tips

1. **Master Mundell-Fleming diagrams** (73% of quiz).
2. **Practice all comparative statics**: $\uparrow G, \uparrow i, \uparrow i^*, \uparrow E^e, \uparrow Y^*$.
3. **Understand UIP deeply**: Why does $\uparrow i$ cause appreciation? (Expected depreciation offsets interest differential).
4. **Know EPDV formula**: Apply to bonds, equity, human wealth.
5. **Distinguish temporary vs. permanent**: Small vs. large effects on wealth.

**Good luck on Quiz 3!**
