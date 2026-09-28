# Lecture 25: Review for Quiz 3

## Overview

```summary
- Quiz 3 covers three things: the open economy, asset pricing for bonds and equity, and expectations inside IS-LM
- **Mundell-Fleming is ~73% of the quiz** — the open-economy IS, the LM that fixes the interest rate, and UIP
- The rest splits between discounting future cash flows and the way expectations enter saving and investment
- Every result here is a *system*, not a single market: the exchange rate is where the interest rate, the trade balance and expectations meet
```
This lecture reviews material for Quiz 3, covering open economy (Mundell-Fleming), asset pricing (bonds and equity), and expectations in IS-LM. **~73% of quiz** relates to Mundell-Fleming model.

## 1. Open Economy: Goods Market Only

```summary
- **Domestic demand** ($D = C + I + G$) is what residents buy; **demand for domestic goods** ($Z = D + X - IM$) is what domestic producers sell
- **Exports** rise with foreign output and fall with appreciation; **imports** rise with domestic output and with appreciation, so appreciation always worsens net exports
- **ZZ curve**: subtract imports (shifts down and rotates flatter), then add exports (a parallel shift up, because exports do not depend on $Y$)
- Equilibrium is where ZZ crosses the 45° line, and the **vertical distance from DD to ZZ is net exports** — above it a surplus, below it a deficit
- The **open economy multiplier is smaller** than the closed-economy one, because imports leak out of the extra demand
- **Policy**: $\uparrow G$ raises $Y$ and worsens $NX$; $\uparrow Y^*$ and a depreciation both raise $Y$ and $NX$ (expenditure switching)
```

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

## 2. Mundell-Fleming Model (~73% of Quiz)

```summary
- **Three pieces solve together**: open-economy IS, LM as $i = \bar{i}$ (the central bank sets the rate), and UIP which pins the exchange rate; sticky prices and a fixed $E^e$ are what make the system solvable
- **UIP**: domestic rate = foreign rate + expected depreciation — so $\uparrow i$ appreciates $E$ today, $\uparrow i^*$ depreciates it, and $\uparrow E^e$ appreciates it one-for-one when $i = i^*$
- The **UIP curve slopes upward** in $(E, i)$ and passes through $E = E^e$ when $i = i^*$; $\uparrow i^*$ shifts it left, $\uparrow E^e$ shifts it right
- **open-economy IS is flatter** than the closed-economy one: $\uparrow i$ cuts output through investment and again through $E \uparrow \Rightarrow NX \downarrow$, so monetary policy is *more* powerful
- The **Mundell-Fleming diagram is stacked** — IS-LM on top sets $Y$ and $i$, UIP below turns that $i$ into $E$
- **Contractionary monetary policy** shifts LM up ($Y \downarrow$, $E \uparrow$); **expansionary fiscal policy** shifts IS right ($Y \uparrow$ by a smaller multiplier, $E$ unchanged)
- **The other three**: $\uparrow E^e$ appreciates and contracts output; $\downarrow Y^*$ cuts output with $E$ unchanged; $\uparrow i^*$ depreciates and *raises* output
```

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
- **Flatter than closed economy** — *more* sensitive to $i$, because import leakage adds a second channel rather than damping the first.
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

```summary
- **A peg fixes $E = E^e = \bar{E}$**, and UIP then forces $i = i^*$ — the central bank gives up monetary independence, as Hong Kong does when it tracks the Fed
- **A speculative attack** is a rise in expected $E$ — a devaluation means more foreign currency per unit, so $E^e \uparrow$ forces $E_t$ up today. Holding the peg needs rates raised, and the cost is a domestic recession
- **ERM, 1992-93**: German reunification pushed German rates up, the UK and France were forced to follow, both went into recession, and the UK left the ERM in September 1992
- **Argentina and Turkey** are the chronic cases — low credibility and insufficient reserves rather than one bad shock
- **Floating** buys policy independence and immunity to attacks, and pays for it with excess volatility, because recursive UIP ties $E$ to expected far-future interest rate paths and to narratives
- **Choose a peg** when shocks resemble the anchor's, fiscal capacity is high, wages and prices are flexible, inflation credibility is low, and trade is highly integrated
```

### Fixed Exchange Rate (Peg)
- **Definition**: $E = E^e = \bar{E}$ (constant).
- **UIP Implication**: $i = i^*$ (no expected change $\Rightarrow$ no interest differential).
- **Loss of Monetary Independence**: Central bank must follow foreign policy.

**Example**: Hong Kong (pegged to USD) $\Rightarrow$ Hong Kong policy rate tracks US Fed rate exactly.

### Speculative Attack
- **Scenario**: Markets lose confidence and expect a **devaluation** — a weaker domestic currency is more foreign currency per unit, so $E^e \uparrow$ is the expectation of one.
- **UIP**: To maintain the peg ($E$ constant), must raise $i \uparrow\uparrow$, because $E_t = E^e_{t+1}(1+i_t)/(1+i^*_t)$ and only a higher $i$ cancels a higher $E^e$.
- **Cost**: **Domestic recession** (high rates contract economy).

**Examples**:
- **ERM Crisis (1992-93)**: German reunification $\Rightarrow$ German rates $\uparrow$ $\Rightarrow$ UK/France forced to raise rates $\Rightarrow$ Recessions $\Rightarrow$ UK left ERM (16 September 1992; the ERM itself fell the following September).
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

```summary
- **EPDV** values a payment stream by discounting every payment at the whole path of short rates, so a dollar received in $n$ years is worth $1/\prod(1 + i_{t+k})$ today
- **Worked**: the one-year bond is $100/(1 + i_{1t})$, the two-year is $100/[(1 + i_{1t})(1 + E_t[i_{1,t+1}])]$ — next year's expected rate sits in the second factor
- **Bond prices fall as rates rise**, because less of each future payment survives discounting
- **Yield to maturity** is the single constant rate that equates price to EPDV; the expectation hypothesis makes the long rate the average of expected short rates, plus a term premium
- The **yield curve is a forecast**: upward sloping in expansions and before tightening, inverted when the Fed is expected to ease — 2023 is inverted
- **Equity is the same discount applied to dividends**, with no maturity and no fixed coupons, so it always carries a future price term and its dividends are risky
```

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
$$Q_t = \sum_{n=1}^{\infty} \frac{E_t[D_{t+n}]}{\prod_{n=1}^{\infty} (1 + i_t + x_t)}$$

Where $x_t$ is the equity risk premium — the extra return a holder of equity requires over a risk-free bond — and the subscript is $t$ like every other quantity in this note, not $s$.

- **No maturity** $\Rightarrow$ Always future price term (prone to bubbles).
- **No fixed coupons** $\Rightarrow$ Dividends risky.

## 5. Expectations in IS-LM

```summary
- **Consumption depends on wealth, not only on current income**: permanent income adds financial wealth plus human wealth, the EPDV of future labor income
- **Permanent changes to wealth move consumption; temporary changes barely move it**
- **Investment is the EPDV of future profits**, so expectations enter through $V_t$ and not only through the current interest rate
- **Augmented IS-LM** steepens the IS curve, because the *expected* path of $Y$ and $i$ matters more than today's rate
- **Forward guidance** commits to a future $i$ path, shifts the IS curve, and makes monetary policy more powerful
- **Policy read**: a temporary tax cut does little, a permanent one does a lot, monetary policy works only if it changes persistent expectations, and consolidation is contractionary unless it dramatically improves them (Ireland)
```

### Consumption: Permanent Income
$$C = c_0 + c_1(Y - T) + c_2 \times (\text{Financial Wealth} + \text{Human Wealth})$$

- **Human Wealth**: EPDV of future labor income.
- **Permanent changes** have large effects; **temporary changes** have small effects.

### Investment: EPDV of Profits
$$I = I(V_t, Y, i) \quad \text{where } V_t = \text{EPDV of future profits}$$

### Augmented IS-LM
$$Z = C(Y, T, i, \mathbf{E[Y], E[T], E[i]}) + I(Y, i, \mathbf{E[Y], E[i]}) + G$$

- **IS is flatter**: current $i$ reaches demand only through the expected *future* path, so output is more sensitive to it than in the simple IS.
- **Forward Guidance**: Commit to future $i$ path $\Rightarrow$ Shift IS $\Rightarrow$ Larger effect.

### Policy Implications
1. **Temporary tax cut**: Small effect (wealth unchanged).
2. **Permanent tax cut**: Large effect (human wealth $\uparrow$).
3. **Monetary policy**: Effective only if convinces markets of persistent change.
4. **Fiscal consolidation**: Usually contractionary, but can be expansionary if dramatically improves expectations (Ireland example).

## 6. Key Formulas

```summary
- **UIP**: $i_t \approx i^*_t + (E^e_{t+1} - E_t)/E_t$ — the interest differential *is* expected depreciation
- **Open-economy IS**: $Y = C + I + G + NX(Y, Y^*, E)$ — output includes net exports, and appreciation worsens the trade balance
- **EPDV**: one sum, each payment discounted by the product of one plus the short rate — the same formula prices bonds, equity and human wealth
- **Bond price** $P_{nt} = 100/(1 + i_{nt})^n$, and the **two-year yield** is the average of the one-year rate and next year's expected one-year rate, plus a term premium
- **Consumption** is disposable income plus a marginal propensity to spend out of the EPDV of assets and of future labor income
```

### Mundell-Fleming
- **UIP**: $i_t \approx i^*_t + \frac{E^e_{t+1} - E_t}{E_t}$
- **IS**: $Y = C(Y - T) + I(Y, i) + G + NX(Y, Y^*, E)$
- **NX**: $\frac{\partial NX}{\partial \epsilon} < 0$ (appreciation worsens trade balance)

### Asset Pricing
- **EPDV**: $V_t = \sum_{n=0}^{\infty} \frac{E_t[Z_{t+n}]}{\prod_{k=0}^{n-1} (1 + i_{t+k})}$
- **Bond price**: $P_{nt} = \frac{100}{(1 + i_{nt})^n}$
- **Yield**: $i_{2t} \approx \frac{i_{1t} + E_t[i_{1,t+1}]}{2} + \text{term premium}$

### Expectations-Augmented Consumption
- $C = c_0 + c_1(Y - T) + c_2 \times (\text{EPDV of assets} + \text{EPDV of labor income})$

## 7. Study Tips

```summary
- **Master the Mundell-Fleming diagrams** — 73% of the quiz rests on them
- **Practise all five comparative statics**: $\uparrow G$, $\uparrow i$, $\uparrow i^*$, $\uparrow E^e$, $\uparrow Y^*$
- **Understand why $\uparrow i$ appreciates**: the expected depreciation it creates offsets the interest differential
- **Know the EPDV formula** and reuse it for bonds, equity and human wealth
- **Separate temporary from permanent** changes — the small and the large effects on wealth
```

1. **Master Mundell-Fleming diagrams** (73% of quiz).
2. **Practice all comparative statics**: $\uparrow G, \uparrow i, \uparrow i^*, \uparrow E^e, \uparrow Y^*$.
3. **Understand UIP deeply**: Why does $\uparrow i$ cause appreciation? (Expected depreciation offsets interest differential).
4. **Know EPDV formula**: Apply to bonds, equity, human wealth.
5. **Distinguish temporary vs. permanent**: Small vs. large effects on wealth.

**Good luck on Quiz 3!**
