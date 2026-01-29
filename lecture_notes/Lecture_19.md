# Lecture 19: Open Economy - Goods Market

## Overview
This lecture extends the IS model to an open economy, introducing trade and the real exchange rate while keeping financial markets closed for now.

## 1. Key Concepts in Openness

### Real Exchange Rate (ε)
- **Definition**: $\epsilon = \frac{E \times P}{P^*}$
    - $E$: Nominal exchange rate (units of domestic currency per foreign currency)
    - $P$: Domestic price level
    - $P^*$: Foreign price level
- **Real Appreciation** ($\epsilon \uparrow$): Domestic goods become more expensive relative to foreign goods.
- **Real Depreciation** ($\epsilon \downarrow$): Domestic goods become cheaper relative to foreign goods.

### Uncovered Interest Parity (UIP)
- **Condition**: $(1 + i_t) = \frac{E_t}{E^e_{t+1}} (1 + i^*_t)$
- **Approximation**: $i_t \approx i^*_t + \frac{E^e_{t+1} - E_t}{E_t}$
    - Domestic interest rate = Foreign interest rate + Expected appreciation of domestic currency
- **Interpretation**: In equilibrium, expected returns on domestic and foreign bonds (in same currency) must be equal.
- **Note**: This lecture focuses on goods markets only; UIP will be integrated later in the Mundell-Fleming model.

## 2. Demand for Domestic Goods vs. Domestic Demand for Goods

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

- **Open Economy Insight**: $Z \neq D$ due to trade.
- **New Parameters**: Foreign output ($Y^*$), real exchange rate ($\epsilon$).
- **Smaller Multipliers**: Import leakage reduces fiscal policy effectiveness.
- **Trade Balance**: Determined by $Z - D = X - IM/E$.
- **Depreciation**: Improves trade balance and is expansionary (expenditure switching).
- **Cross-Country Spillovers**: Policy in one country (e.g., China) affects others through $Y^*$.

**Next**: Integrate financial openness (Mundell-Fleming model).
