# Lecture 20: The Mundell-Fleming Model

## Overview

```summary
- **Mundell-Fleming** is IS-LM opened to the world: goods market openness and financial market openness at once
- Goods market openness is the net exports term; financial market openness is uncovered interest parity
- The exchange rate stops being a parameter and becomes an **endogenous price**, pinned down by arbitrage
- The payoff is the short-run interaction between monetary policy, fiscal policy and that exchange rate
- Take capital mobility to its limit and the **regime** rather than the instrument decides which policy works: monetary under a float, fiscal under a peg
```
The Mundell-Fleming model extends IS-LM to an open economy with both goods market and financial market openness. It explains exchange rate determination and the interaction between monetary policy, fiscal policy, and exchange rates in the short run.

## 1. Motivation: Exchange Rate Fluctuations

```summary
- The dollar **appreciated** before 2022, because the US tightened before the rest of the world
- It **depreciated** after 2022, as markets came to expect the US to peak in tightening while Europe and Japan kept going
- The **key driver** is relative interest rate expectations across countries
- **US**: limited further hikes, then cuts
- **Europe**: a more prolonged hiking cycle, on energy shocks and inflation
- **Japan**: at the zero lower bound for decades, with minimal expected changes
```

### Recent Dynamics (2020s)
- **Dollar Appreciation (pre-2022)**: US tightened monetary policy before rest of world.
- **Dollar Depreciation (post-2022)**: Markets expect US to peak in tightening while Europe/Japan continue.
- **Key Driver**: Relative interest rate expectations across countries.

### Policy Rate Paths
- **US**: Markets expect limited further hikes, then cuts.
- **Europe**: Expects more prolonged hiking cycle (energy shocks, inflation).
- **Japan**: Has been at zero lower bound for decades; minimal expected changes.

## 2. The Mundell-Fleming Model: Structure

```summary
- The IS equation gains a **net exports** term: $NX = X(Y^*, E) - IM(Y, E)$
- $NX$ falls with domestic income $Y$ (more imports), rises with foreign income $Y^*$ (more exports), and falls with the exchange rate $E$
- **Short-run assumptions**: prices are fixed, and nominal equals real, so $r = i$ and $\epsilon = E$
- **UIP** is the arbitrage condition that pins $E$: the domestic rate is the foreign rate plus expected depreciation
- $E^e$ is held **fixed** for now, as an exogenous parameter — the simplification the analysis runs on, to be relaxed later
- **LM** closes the model as $i = \bar{i}$: the central bank sets the nominal interest rate directly
```

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

```summary
- The starting point is $i = i^*$: with nothing expected to change, $E = E^e$
- **Rate hike**: once the domestic rate $i \uparrow$ exceeds the foreign rate, domestic bonds pay a higher return
- Arbitrage then demands an expected **depreciation** to cancel that higher return
- With $E^e$ fixed, the only way to deliver the expected depreciation is to appreciate $E$ today — the capital loss offsets the interest gain
- So $i \uparrow \Rightarrow E \uparrow$ today $\Rightarrow$ depreciation expected tomorrow, and returns are equalized
- **A stronger dollar expected tomorrow** ($E^e \uparrow$): everyone buys dollars now, so $E$ jumps today, one-for-one with $E^e$ when $i = i^*$
```

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

```summary
- The model is drawn as an **IS-LM** panel, output $Y$ against $i$, and a **UIP** panel, the exchange rate $E$ against $i$
- The open-economy **IS** curve is **flatter** than the closed-economy one, because imports leak demand abroad
- $\uparrow G$ or $\downarrow T$ shifts IS right, but by less than in a closed economy
- $\uparrow Y^*$ shifts IS right through higher exports; $\uparrow E^e$ shifts it left through the appreciation
- The **UIP** curve is **upward sloping** in $(E, i)$: a higher $i$ is sustainable only at a more appreciated $E$
- UIP passes through $i = i^*$, where $E = E^e$
- $\uparrow i^*$ shifts UIP left (depreciation); $\uparrow E^e$ shifts it right (appreciation)
```

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

```summary
- **Monetary tightening ($\uparrow i$)**: output falls and the currency appreciates, so the shock hits output twice
- The first channel is investment, the one a closed economy has: $i \uparrow \Rightarrow I \downarrow \Rightarrow Y \downarrow$
- The second is net exports, and that is why monetary policy is **more powerful** in the open economy, especially for a small one
- **Fiscal expansion ($\uparrow G$) with the Fed holding $i$ fixed**: output rises, but by less than in a closed economy, because imports leak
- The same expansion leaves $E$ unchanged — unless the Fed hikes against the overheating, which appreciates the currency
- **Higher expected future rate ($\uparrow E^e$)**: IS shifts left and UIP right, so the currency appreciates today and output falls — contractionary
- **Foreign shocks**: $\downarrow Y^*$ lowers output with $E$ unchanged; $\uparrow i^*$ depreciates the currency, and its effect on $Y$ is taken up in Lecture 21
```

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
- **Result**: $E \downarrow$ (depreciation), effect on $Y$ depends on net export response. Lecture 21 takes it up.

## 6. Which Instrument Works: Float or Peg

```summary
- Everything above runs on **imperfect capital mobility**, where UIP is a pressure rather than an equality. Send mobility to the limit and UIP binds exactly: $i = i^*$, and the exchange rate becomes the adjustment variable instead of a free price
- That limit is what makes the **regime**, rather than the instrument, the thing that decides policy effectiveness — the same spending increase and the same rate cut give opposite answers under a float and under a peg
- **Under a float, monetary policy wins.** The central bank sets the rate, the currency is free to depreciate, net exports rise, and the investment effect is reinforced rather than offset
- **Under a peg, fiscal policy wins.** Holding the parity means the central bank accommodates the extra demand instead of letting the rate rise, so nothing is crowded out and the currency does not appreciate to undo the spending
- The mechanism is the same in both directions: under a float the **appreciation** crowds fiscal policy out, and under a peg the **defence of the parity** takes back the monetary expansion. The regime decides which of the two leakages is switched on
- The **impossibility of the trinity** is the same result seen from the outside: a country with a free capital account, a fixed exchange rate and an independent interest rate can have at most two of the three
- So "monetary policy is powerful" and "monetary policy is powerless" are both true statements about the Mundell-Fleming model — they are statements about the **regime**, and a reader who quotes one without the regime has quoted nothing
```

### The Limit the Model Is Running Toward

Sections 2 to 5 keep capital mobility **imperfect**: UIP is the arbitrage condition that pins $E$, but the domestic rate is still set by the central bank, so the two can be out of line. The standard Mundell-Fleming result assumes **perfect capital mobility** instead, and that limit is worth doing on its own because it produces a *ranking* of instruments rather than a ranking of interest rates.

- **$i = i^*$ exactly.** Arbitrage is too fast and too complete for a spread to survive, so the domestic rate is pinned to the foreign rate whatever the central bank does.
- **The exchange rate absorbs the difference.** With $i$ no longer free, $E$ is the variable that moves — and it moves enough to hold the parity of returns.

Two regimes are possible, and they differ in exactly one respect: whether the central bank is *allowed* to let $E$ move.

### Monetary Expansion ($\downarrow i$)

**Under a floating rate**:
1. The central bank cuts $i$. It has no parity to satisfy, so the cut stands.
2. Lower $i$ lowers investment $\Rightarrow Y \downarrow$.
3. Lower $i$ means the currency depreciates $\Rightarrow NX \uparrow \Rightarrow Y \uparrow$.
4. The two channels **reinforce**: $\boxed{\text{monetary policy is effective}}$

**Under a fixed rate**:
1. The central bank cuts $i$, but the parity immediately pulls it back to $i^*$.
2. To hold $1.00$ against the dollar, the central bank has to **sell foreign reserves and buy its own currency**, which contracts the money supply.
3. The contraction undoes the expansion. What is left is the small remainder that imperfect mobility fails to arbitrage away — under a **perfect** limit, nothing.
4. $\boxed{\text{monetary policy is ineffective}}$

### Fiscal Expansion ($\uparrow G$)

**Under a floating rate**:
1. $G \uparrow$ shifts IS right $\Rightarrow Y \uparrow$.
2. Higher $Y$ raises $i$, which pulls in capital.
3. Capital inflow **appreciates** the currency $\Rightarrow NX \downarrow$.
4. The appreciation crowds out the spending: $\boxed{\text{fiscal policy is ineffective}}$

**Under a fixed rate**:
1. $G \uparrow$ shifts IS right $\Rightarrow Y \uparrow$, and $Y$ can go a long way.
2. The central bank **accommodates** the extra demand rather than letting $i$ rise, because the parity forbids it.
3. Nothing is crowded out, and the currency does not appreciate, so nothing is undone.
4. $\boxed{\text{fiscal policy is effective}}$

### The Ranking, and Why It Inverts

| Regime | Monetary expansion | Fiscal expansion |
|--------|--------------------|-------------------|
| **Floating** | Effective | Ineffective |
| **Fixed** | Ineffective | Effective |

The ranking inverts between the two regimes, and the reason is that **the regime decides which leakage is switched on**. Under a float, the exchange rate is free, and appreciation is what undoes fiscal expansion. Under a peg, the exchange rate is pinned, and defending the parity is what undoes monetary expansion. One of those two leakages is always doing the work; you get to choose which by choosing the regime.

This is why Section 5's conclusion — that monetary policy has *two* channels and is stronger than in a closed economy — is a claim about a **float compared with a closed economy**, and not a claim about a float compared with a peg. The closed economy has a fixed nominal exchange rate by assumption and no capital mobility at all, so the comparison it licenses is the one the section makes. Once the exchange rate is free to move, the comparison that matters is the one in this table.

### The Impossible Trinity

The regime result is the interior of a larger fact usually called the **impossible trinity** or **Mundell-Fleming trilemma**. A country cannot have all three of:

1. **Free capital mobility** — no controls on cross-border financial flows.
2. **A fixed exchange rate** — a credible peg with reserves behind it.
3. **An independent monetary policy** — an interest rate the central bank chooses.

Any two are fine; all three contradict. Pick a peg and capital must be controlled, or the peg is a lie. Let capital move and the peg can only be held by surrendering the interest rate. Float and the interest rate is the central bank's to set, because the exchange rate is the one thing absorbing the pressure.

### Policy Mix Under Regimes

The regime is not a policy choice made once — it is the choice that determines which policy is available:

- **Small open economy, floating**: run **monetary** policy. The rate and the currency do the work, and the trade balance is not available as an instrument because it adjusts.
- **Small open economy, pegged**: run **fiscal** policy, and accept the imported business cycle. This is the choice behind the European Exchange Rate Mechanism, and the reason a member could not set its own rate in the crisis of 1992.
- **Intermediate regimes** — a managed float, a band, a rate that is defended only sometimes — are what most countries actually run, and they are best read as a choice about *how much* of each instrument to keep.

## 7. Key Takeaways

```summary
- **Mundell-Fleming = IS-LM + UIP + an open economy**: three pieces, not two
- Monetary policy has **two channels**, investment and net exports, which makes it stronger than in a closed economy — a comparison against a closed economy, not against a peg
- Fiscal policy has a **smaller multiplier** because of the leakage to imports, and no effect on $E$ when $i$ is unchanged
- **UIP determines the exchange rate**, given $i$, $i^*$ and $E^e$
- **The regime decides which instrument works**: monetary under a float, fiscal under a peg, and the ranking inverts because the regime switches which leakage is on
- The **impossible trinity** is the same fact from outside the model: free capital mobility, a fixed rate and an independent interest rate are two out of three, never three
- **Expectations matter**: a change in $E^e$ moves today's exchange rate immediately, which is the asset-pricing point, and the net export channel matters most for **small open economies**
```

- **Mundell-Fleming = IS-LM + UIP + Open Economy**
- **Two Channels for Monetary Policy**: Investment + Net Exports (more powerful in open economy than in a closed one).
- **Fiscal Policy**: Smaller multiplier (leakage to imports); no effect on $E$ if $i$ unchanged.
- **Exchange Rate Determination**: UIP (arbitrage condition) determines $E$ given $i, i^*, E^e$.
- **Regime Comparison**: Monetary effective under a float, fiscal effective under a peg; the ranking inverts because appreciation crowds out fiscal expansion under a float and parity defence takes back monetary expansion under a peg.
- **Impossible Trinity**: Free capital mobility, a fixed exchange rate and an independent interest rate — at most two.
- **Expectations Matter**: Changes in $E^e$ have immediate effects on current $E$ (asset pricing).
- **Small vs. Large Economies**: Net export channel more important for small open economies (US less affected).

**Next**: Complete analysis of foreign shocks and extensions to flexible exchange rates.
