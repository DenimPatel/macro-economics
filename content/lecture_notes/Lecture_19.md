# Lecture 19: Open Economy - Goods Market

## Overview

```summary
- The IS model gains a foreign sector: what an economy produces is no longer what its own residents demand
- **Two new parameters**: foreign output ($Y^*$) and the real exchange rate ($\epsilon$)
- Exports depend on foreign income and the real exchange rate; imports depend on domestic income and the real exchange rate
- Trade shrinks the multiplier, because part of any demand increase leaks into imports
- Financial markets stay closed for now — the exchange rate is a parameter, and financial openness comes later in the Mundell-Fleming model
```
This lecture extends the IS model to an open economy, introducing trade and the real exchange rate while keeping financial markets closed for now.

## 1. Key Concepts in Openness

```summary
- **Real exchange rate $\epsilon = E \times P / P^*$**: $E$ counts foreign currency per unit of domestic currency, so $E \uparrow$ is an **appreciation** — and every note in the open-economy block uses that one convention
- **Real appreciation** ($\epsilon \uparrow$): domestic goods become more expensive relative to foreign goods
- **Real depreciation** ($\epsilon \downarrow$): domestic goods become cheaper relative to foreign goods
- **Uncovered interest parity**: the domestic rate equals the foreign rate plus the expected **appreciation** of the domestic currency, which is a rise in $E$ under this convention
- Many textbooks write $E$ the other way round and get to the same equation as "expected *depreciation*"; the equation is what matters, because a rate cut delivers a rise in expected $E$ and an attack on a peg delivers a fall
- UIP is what makes expected returns on domestic and foreign bonds equal once they are expressed in the same currency
- Financial openness is deliberately held back here: UIP is named in this lecture and integrated later in the Mundell-Fleming model
```

### Real Exchange Rate (ε)
- **Definition**: $\epsilon = \frac{E \times P}{P^*}$
    - $E$: Nominal exchange rate (units of foreign currency per unit of domestic currency)
    - $P$: Domestic price level
    - $P^*$: Foreign price level
- **Real Appreciation** ($\epsilon \uparrow$): Domestic goods become more expensive relative to foreign goods.
- **Real Depreciation** ($\epsilon \downarrow$): Domestic goods become cheaper relative to foreign goods.

### Uncovered Interest Parity (UIP)
- **Condition**: $(1 + i_t) = \frac{E_t}{E^e_{t+1}} (1 + i^*_t)$
- **Approximation**: $i_t \approx i^*_t + \frac{E^e_{t+1} - E_t}{E_t}$
    - Domestic interest rate = Foreign interest rate + Expected **appreciation** of the domestic currency.
- **Read the sign before the word**: $(E^e_{t+1} - E_t)/E_t > 0$ means $E$ is expected to **rise**, and under this course's convention a rising $E$ is an **appreciation** — more units of foreign currency per unit of domestic currency is a stronger domestic currency. A lot of textbooks write $E$ the other way round, so the same formula appears there as "expected *depreciation*". The equation is the same; only which end of the currency pair is being counted changes. What matters here is the equation, because everything downstream uses it: an expected rise in $E$ is what a rate cut delivers, and an expected fall in $E$ is what a speculative attack on a peg creates.
- **Interpretation**: In equilibrium, expected returns on domestic and foreign bonds (in same currency) must be equal.
- **Note**: This lecture focuses on goods markets only; UIP will be integrated later in the Mundell-Fleming model.

## 2. Demand for Domestic Goods vs. Domestic Demand for Goods

```summary
- **Domestic demand for goods ($D$)** is what domestic residents buy, wherever it is produced: $D = C(Y-T) + I(Y, r) + G$
- **Demand for domestic goods ($Z$)** is what anyone buys of domestically-produced output, whoever consumes it: $Z = D + X - IM/E$
- In a closed economy the two were the same; in an open economy $Z \neq D$, because imports and exports sit between them
- **Exports $X = X(Y^*, \epsilon)$** rise with foreign income and fall with the real exchange rate — appreciation prices foreigners out
- **Imports $IM = IM(Y, \epsilon)$** rise with domestic income and rise with the real exchange rate — appreciation makes foreign goods cheaper
- Both new parameters, $Y^*$ and $\epsilon$, enter as shifters of the whole demand schedule, moving what is demanded of domestic goods at every level of $Y$
```

### Key Distinction (Open Economy)
- **Domestic Demand for Goods** ($D$): $D = C(Y-T) + I(Y, r) + G$
    - What domestic residents demand (from anywhere).
- **Demand for Domestic Goods** ($Z$): $Z = D + X - IM/E$
    - What is demanded of domestically-produced goods (by anyone).
    - In closed economy: $Z = D$ (they were the same).
    - In open economy: $Z \neq D$ due to imports and exports.

### Exports ($X$)
- $X = X(Y^*, \epsilon)$
- **Increasing in Foreign Income** ($Y^* \uparrow \rightarrow X \uparrow$): Higher foreign income increases foreign demand for our goods.
- **Decreasing in Real Exchange Rate** ($\epsilon \uparrow \rightarrow X \downarrow$): Appreciation makes our goods more expensive for foreigners.

### Imports ($IM$)
- $IM = IM(Y, \epsilon)$
- **Increasing in Domestic Income** ($Y \uparrow \rightarrow IM \uparrow$): Higher income increases consumption of all goods, including imports.
- **Increasing in Real Exchange Rate** ($\epsilon \uparrow \rightarrow IM \uparrow$): Appreciation makes foreign goods cheaper, increasing imports.

## 3. Equilibrium in the Goods Market (Open Economy)

```summary
- **Equilibrium** is $Y = Z$, with $Z = C(Y-T) + I(Y, r) + G + X(Y^*, \epsilon) - IM(Y, \epsilon)/E$
- The **ZZ curve** plots demand for domestic goods against domestic output; equilibrium output is where it crosses the 45° line
- ZZ is **flatter** than the closed economy DD curve
- **The open-economy multiplier is smaller**: $dY/dG < 1/(1-c_1)$, because part of every rise in consumption is spent on imports rather than on domestic output
- **Net exports**: $NX = X - IM/E = Z - D$ — the trade balance is exactly the wedge between the two demand concepts
- A surplus goes with low output and few imports, a deficit with high output and many imports, and the balance is zero where ZZ and DD coincide
```

### Equilibrium Condition
- $Y = Z = C(Y-T) + I(Y, r) + G + X(Y^*, \epsilon) - IM(Y, \epsilon)/E$
- **ZZ Curve**: Demand for domestic goods as a function of domestic output.
- **Diagram**:
    - ZZ curve intersects 45° line to determine equilibrium output $Y$.
    - ZZ is **flatter** than the closed economy DD curve.

### Multiplier Effect (Open Economy)
- **Smaller Multiplier**: Opening reduces the multiplier because part of the demand increase "leaks" to imports.
- **Why?**: When $Y \uparrow$, $C \uparrow$, but part of $\Delta C$ goes to imports, not domestic goods.
- Result: $\frac{dY}{dG} < \frac{1}{1-c_1}$ (open) compared to closed economy multiplier.

### Trade Balance
- **Net Exports** ($NX$): $NX = X - IM/E = Z - D$
- **Trade Balance = 0** when ZZ = DD.
- **Trade Surplus** ($NX > 0$): When $Y$ is low (imports are low).
- **Trade Deficit** ($NX < 0$): When $Y$ is high (imports are high).

## 4. Policy Experiments

```summary
- **Fiscal expansion** ($\Delta G > 0$) shifts ZZ up and raises $Y$, but by less than it would in a closed economy
- It worsens the trade balance ($NX \downarrow$): the higher $Y$ pulls in imports, while exports are unchanged because they depend on $Y^*$, not on $Y$
- **A foreign demand shock** ($\Delta Y^* > 0$) lifts exports, shifts ZZ up, raises $Y$ — and improves the trade balance
- The foreign demand shock beats domestic fiscal expansion on both counts: it improves the trade balance rather than worsening it, and it needs no fiscal deficit
- **Real depreciation** ($\epsilon \downarrow$) is expansionary and improves the trade balance, on the assumption that the volume effect dominates the price effect outside the very short run
- **Expenditure switching**: depreciation moves spending, domestic and foreign, toward domestic goods, which is why it lifts $NX$ and $Y$ together
- Pairing depreciation with **fiscal contraction** raises $NX$ and leaves $Y$ unchanged; holding the currency artificially low to boost exports is the "mercantilist" policy China was accused of
```

### Fiscal Expansion ($\Delta G > 0$)
- **Effect on Output**: ZZ shifts up $\rightarrow$ $Y \uparrow$ (but less than in closed economy).
- **Effect on Trade Balance**: $NX \downarrow$ (trade deficit worsens).
    - Higher $Y$ increases imports.
    - Exports unchanged (depends on $Y^*$, not $Y$).

### Foreign Demand Shock ($\Delta Y^* > 0$)
- **Effect on Output**: Exports $\uparrow$ $\rightarrow$ ZZ shifts up $\rightarrow$ $Y \uparrow$.
- **Effect on Trade Balance**: $NX \uparrow$ (trade surplus improves).
- **Note**: Preferable to domestic fiscal expansion because:
    1. Improves trade balance (vs. worsening it).
    2. No fiscal deficit required.

### Real Depreciation ($\epsilon \downarrow$)
- **Assumption**: Volume effect dominates price effect (realistic except very short run).
    - Net exports increase with depreciation: $NX \uparrow$ when $\epsilon \downarrow$.
- **Effect on Output**: ZZ shifts up $\rightarrow$ $Y \uparrow$ (expansionary).
- **Effect on Trade Balance**: $NX \uparrow$ (improves).
- **Expenditure Switching**: Depreciation shifts expenditure (domestic and foreign) toward domestic goods.

### Combined Policy: Depreciation + Fiscal Contraction
- **Goal**: Improve trade balance without changing output.
- **Mechanism**:
    - Depreciation: Improves $NX$, increases $Y$ (expansionary).
    - Fiscal contraction ($\downarrow G$): Reduces $Y$ (contractionary).
- **Result**: $NX \uparrow$, $Y$ unchanged.
- **Historical Example**: China (late 1990s–2000s) accused of "mercantilist policies" (keeping currency artificially low to boost exports).

## 5. Summary

```summary
- **Open economy insight**: $Z \neq D$ — demand for domestic goods and domestic demand for goods are now different quantities
- **Two new parameters**: foreign output ($Y^*$) and the real exchange rate ($\epsilon$)
- **Smaller multipliers**: import leakage reduces how far any demand-side policy moves output
- **Trade balance**: $X - IM/E = Z - D$; a surplus goes with low output and a deficit with high output, and depreciation improves it by expenditure switching
- **Cross-country spillovers** run through $Y^*$ — China's currency is the case — and financial openness, the Mundell-Fleming model, is next
```

- **Open Economy Insight**: $Z \neq D$ due to trade.
- **New Parameters**: Foreign output ($Y^*$), real exchange rate ($\epsilon$).
- **Smaller Multipliers**: Import leakage reduces fiscal policy effectiveness.
- **Trade Balance**: Determined by $Z - D = X - IM/E$.
- **Depreciation**: Improves trade balance and is expansionary (expenditure switching).
- **Cross-Country Spillovers**: Policy in one country (e.g., China) affects others through $Y^*$.

**Next**: Integrate financial openness (Mundell-Fleming model).
