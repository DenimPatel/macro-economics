# Lecture 20: The Mundell-Fleming Model

## Overview
The Mundell-Fleming model extends IS-LM to an open economy with both goods market and financial market openness. It explains exchange rate determination and the interaction between monetary policy, fiscal policy, and exchange rates in the short run.

## 1. Motivation: Exchange Rate Fluctuations

### Recent Dynamics (2020s)
- **Dollar Appreciation (pre-2022)**: US tightened monetary policy before rest of world.
- **Dollar Depreciation (post-2022)**: Markets expect US to peak in tightening while Europe/Japan continue.
- **Key Driver**: Relative interest rate expectations across countries.

### Policy Rate Paths
- **US**: Markets expect limited further hikes, then cuts.
- **Europe**: Expects more prolonged hiking cycle (energy shocks, inflation).
- **Japan**: Has been at zero lower bound for decades; minimal expected changes.

## 2. The Mundell-Fleming Model: Structure

### IS Equation (Open Economy)
$$Y = C(Y - T) + I(Y, i) + G + NX(Y, Y^*, E)$$

- **Net Exports**: $NX = X(Y^*, E) - IM(Y, E)$
    - $NX$ decreasing in $Y$ (higher income $\rightarrow$ more imports).
    - $NX$ increasing in $Y^*$ (higher foreign income $\rightarrow$ more exports).
    - $NX$ decreasing in $E$ (appreciation $\rightarrow$ exports fall, imports rise).

### Assumptions (Short Run)
- **Fixed Prices**: $P = P^* = \text{constant}$ (no inflation).
- **Nominal = Real**:
    - Real interest rate = Nominal interest rate ($r = i$).
    - Real exchange rate = Nominal exchange rate ($\epsilon = E$).

### Uncovered Interest Parity (UIP)
$$E_t = \frac{1 + i_t}{1 + i^*_t} E^e_{t+1}$$

- **Approximation**: $i_t \approx i^*_t + \frac{E^e_{t+1} - E_t}{E_t}$
- **Interpretation**: Domestic interest rate = Foreign interest rate + Expected depreciation of domestic currency.
- **Key Assumption (for now)**: $E^e_{t+1}$ is **fixed** (exogenous parameter).
    - Simplifies analysis; will be relaxed later.

### LM (Monetary Policy)
$$i = \bar{i}$$
- Central bank sets the nominal interest rate.

## 3. Understanding UIP

### Why Does $i \uparrow$ Cause $E \uparrow$ (Appreciation)?

**Starting Point**: $i = i^*$, so $E = E^e$ (no expected change).

**Scenario**: Domestic interest rate increases ($i \uparrow$).

- **Logic**: If $i > i^*$, domestic bonds pay higher return.
- **Arbitrage**: To maintain equal expected returns, must expect domestic currency to depreciate ($E_{t+1} < E_t$).
- **Mechanism**: Given $E^e$ is fixed, only way to generate expected depreciation is to appreciate $E_t$ **today**.
    - If $E_t > E^e$, then expect $E$ to fall (depreciation) from $t$ to $t+1$.
    - This capital loss offsets higher interest rate differential.

**Equilibrium**: $i \uparrow$ $\Rightarrow$ $E \uparrow$ (appreciation today) $\Rightarrow$ Expect depreciation tomorrow $\Rightarrow$ Returns equalized.

### Why Does $E^e \uparrow$ Cause $E \uparrow$ (Appreciation)?

- **Logic**: If expect dollar to be stronger in future ($E^e \uparrow$), everyone wants to buy dollars now.
- **Result**: Current exchange rate $E$ jumps immediately (one-for-one with $E^e$ if $i = i^*$).
- **Why?**: If $E$ didn't jump, domestic bonds would offer same interest rate **plus** expected capital gain (violates UIP).

## 4. The Mundell-Fleming Diagram

### Three-Panel Diagram
1. **Top Left: IS-LM** (Output $Y$ vs. Interest Rate $i$)
2. **Bottom: UIP** (Exchange Rate $E$ vs. Interest Rate $i$)

### IS Curve (Open Economy)
- **Slope**: Flatter than closed economy (import leakage).
- **Shifts**:
    - $\uparrow G$ or $\downarrow T$: IS shifts **right** (but smaller effect than closed economy).
    - $\uparrow Y^*$: IS shifts **right** (higher exports).
    - $\uparrow E^e$: IS shifts **left** (appreciation $\rightarrow$ lower net exports).

### UIP Curve
- **Slope**: Upward sloping ($E$ vs. $i$).
- **Interpretation**: Higher $i$ requires higher $E$ (appreciation) to generate expected depreciation.
- **Special Point**: If $i = i^*$, then $E = E^e$.
- **Shifts**:
    - $\uparrow i^*$: UIP shifts **left** (depreciation).
    - $\uparrow E^e$: UIP shifts **right** (appreciation).

## 5. Policy Experiments

### Contractionary Monetary Policy ($\uparrow i$)
- **IS-LM**: Output falls ($Y \downarrow$).
- **UIP**: Exchange rate appreciates ($E \uparrow$).
- **Two Channels** (why monetary policy more powerful in open economy):
    1. **Investment Channel** (closed economy): $i \uparrow$ $\Rightarrow$ $I \downarrow$ $\Rightarrow$ $Y \downarrow$.
    2. **Net Export Channel** (open economy): $i \uparrow$ $\Rightarrow$ $E \uparrow$ $\Rightarrow$ $NX \downarrow$ $\Rightarrow$ $Y \downarrow$.
- **Result**: More powerful than closed economy (especially for small open economies).

### Expansionary Fiscal Policy ($\uparrow G$, accommodated by Fed)
- **Assumption**: Fed keeps $i$ constant (LM doesn't shift).
- **IS-LM**: Output increases ($Y \uparrow$), but **less** than in closed economy (import leakage).
- **UIP**: No change in $E$ (since $i$ unchanged).
- **Note**: In practice, if fiscal expansion causes overheating, Fed may raise $i$ $\Rightarrow$ $E \uparrow$.

### Increase in Expected Exchange Rate ($\uparrow E^e$)
- **IS**: Shifts **left** (current $E$ appreciates $\Rightarrow$ $NX \downarrow$).
- **UIP**: Shifts **right** (for same $i$, need higher $E$).
- **Result**: $E \uparrow$ (appreciation), $Y \downarrow$ (contractionary).

### Foreign Output Shock ($\downarrow Y^*$)
- **IS**: Shifts **left** (exports fall).
- **UIP**: No change.
- **Result**: $Y \downarrow$, $E$ unchanged (unless Fed reacts by cutting $i$).

### Foreign Interest Rate Increase ($\uparrow i^*$)
- **IS**: May shift depending on how $E$ changes (to be analyzed).
- **UIP**: Shifts **left** (depreciation).
    - For same $i$, now need lower $E$ (depreciation) to expect appreciation and equalize returns.
- **Result**: $E \downarrow$ (depreciation), effect on $Y$ depends on net export response (analyzed next lecture).

## 6. Key Takeaways

- **Mundell-Fleming = IS-LM + UIP + Open Economy**
- **Two Channels for Monetary Policy**: Investment + Net Exports (more powerful in open economy).
- **Fiscal Policy**: Smaller multiplier (leakage to imports); no effect on $E$ if $i$ unchanged.
- **Exchange Rate Determination**: UIP (arbitrage condition) determines $E$ given $i, i^*, E^e$.
- **Expectations Matter**: Changes in $E^e$ have immediate effects on current $E$ (asset pricing).
- **Small vs. Large Economies**: Net export channel more important for small open economies (US less affected).

**Next**: Complete analysis of foreign shocks and extensions to flexible exchange rates.
