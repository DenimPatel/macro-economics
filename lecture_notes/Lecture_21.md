# Lecture 21: Exchange Rate Regimes

## Overview
This lecture analyzes different exchange rate regimes (fixed vs. floating), their implications for policy autonomy, and the costs and benefits of each regime. It also covers speculative attacks and how expectations drive exchange rate dynamics.

## 1. Review: Mundell-Fleming Shocks (Floating Regime)

### Increase in Expected Exchange Rate ($\uparrow E^e$)
- **UIP**: Shifts **right** (for same $i$, need higher $E$).
- **IS**: Shifts **left** (appreciation $\rightarrow$ $NX \downarrow$).
- **Result**: $E \uparrow$ (appreciation), $Y \downarrow$ (contractionary).

### Foreign Output Decline ($\downarrow Y^*$)
- **UIP**: No change.
- **IS**: Shifts **left** (exports decline).
- **Result**: $Y \downarrow$, $E$ unchanged (unless Fed responds).

### Foreign Interest Rate Increase ($\uparrow i^*$)
- **UIP**: Shifts **left** (depreciation needed to expect appreciation).
- **IS**: Shifts **right** (depreciation $\rightarrow$ $NX \uparrow$).
- **Result**: $E \downarrow$ (depreciation), $Y \uparrow$ (expansionary if $i$ unchanged).

**Why IS Shifts Right**:
- $i^* \uparrow$ $\Rightarrow$ Domestic bond less attractive $\Rightarrow$ $E \downarrow$ (depreciation today).
- Depreciation $\Rightarrow$ Domestic goods cheaper $\Rightarrow$ Exports rise, Imports fall $\Rightarrow$ $NX \uparrow$ $\Rightarrow$ IS shifts right.

## 2. Exchange Rate Regimes

### Floating (Flexible) Exchange Rate
- **Definition**: Exchange rate freely adjusts to equilibrate financial markets (UIP holds).
- **Examples**: US-Euro, US-Japan, US-UK, Australia, Canada, Sweden.
- **Characteristics**:
    - Independent monetary policy.
    - Exchange rate volatility.
    - Clean floats (Euro, Yen) vs. Managed floats (emerging markets).

### Fixed (Pegged) Exchange Rate
- **Definition**: Exchange rate fixed to another currency (or basket).
- **Examples**: Hong Kong (pegged to USD), Eurozone (common currency), Singapore (target zone vs. basket).
- **Implication**: If credible peg, then $E = E^e = \bar{E}$ (constant).
    - UIP $\Rightarrow$ $i = i^*$ (no expected appreciation/depreciation).
    - **Loss of Monetary Policy Independence**: Must follow foreign central bank's policy.

### Hybrid Regimes
- **Most countries** have hybrid systems between pure float and pure peg.
- **Examples**:
    - **Managed Floats**: Brazil, South Africa, Colombia (intervene frequently, inflation trends).
    - **Target Zones**: Singapore (basket peg within narrow bands, secret weights).
    - **Capital Controls**: China (semi-pegged, can deviate $i$ from $i^*$ due to capital controls).

## 3. Policy Under Different Regimes

### Floating Exchange Rate

#### Recession Response:
- **Fiscal Policy**: Expansionary ($\uparrow G$) $\Rightarrow$ IS shifts right $\Rightarrow$ $Y \uparrow$ (smaller multiplier than closed economy).
- **Monetary Policy**: Cut interest rate ($\downarrow i$) $\Rightarrow$ Two channels:
    1. Investment $\uparrow$ (traditional).
    2. $E \downarrow$ (depreciation) $\Rightarrow$ $NX \uparrow$ (expenditure switching).
    - **More Powerful** than closed economy (net export channel reinforces investment channel).

### Fixed Exchange Rate

#### Recession Response:
- **Fiscal Policy**: Same as floating (expansionary $\uparrow G$ $\Rightarrow$ $Y \uparrow$).
- **Monetary Policy**: **No independence**. Must follow foreign country's policy ($i = i^*$).
    - If recession is **country-specific** (not global), cannot use monetary policy tool.
    - **Example**: Hong Kong must follow US interest rate policy exactly.

#### Costs of Fixed Regime:
1. **Loss of Policy Tool**: No ability to adjust $i$ for domestic cycle.
2. **Misalignment with Foreign Cycle**: If foreign country not in recession, their policy inappropriate for you.

## 4. Speculative Attacks

### Mechanism
- **Scenario**: Fixed exchange rate, but markets lose confidence ($E^e \downarrow$).
- **UIP**: $E_t = \frac{1 + i_t}{1 + i^*_t} E^e_{t+1}$
    - If $E^e \downarrow$ (expect devaluation), then $E_t \downarrow$ (pressure to depreciate).
- **Defense**: To maintain peg, must raise $i \uparrow\uparrow$ (offset expected depreciation with interest rate differential).

### Cost of Defense
- **Domestic Recession**: High interest rates contract output ($Y \downarrow$).
- **Example**: Russia (2022 invasion) raised rates from 4-5% to 20% to defend ruble.

### Historical Examples

#### ERM Crisis (1992)
- **Context**: European Monetary System (narrow bands around exchange rates).
- **Trigger**: German reunification $\Rightarrow$ Expansionary fiscal policy $\Rightarrow$ German interest rates $\uparrow$ $\Rightarrow$ Deutschmark appreciation.
- **Response**:
    - **France**: Raised rates, defended peg, suffered recession.
    - **UK**: Gave up, left ERM (allowed pound to depreciate).
- **Outcome**: System collapsed; later replaced by Euro (common currency, no speculative attacks possible).

#### Argentina & Turkey
- **Pattern**: Chronic speculative attacks due to:
    - Low credibility.
    - Insufficient reserves.
    - High inflation.
- **Cycle**: Attempt to stabilize $\rightarrow$ Attack $\rightarrow$ Raise $i$ $\rightarrow$ Recession $\rightarrow$ Abandon peg $\rightarrow$ Repeat.

## 5. Volatility of Floating Rates

### Excess Volatility Problem
- Exchange rates fluctuate **more than fundamentals** (productivity, demand shocks) justify.
- **Why?**: Forward-looking nature of UIP.

### Recursive UIP
$$E_t = \frac{1 + i_t}{1 + i^*_t} \frac{1 + i_{t+1}^e}{1 + i^*_{t+1,e}} \frac{1 + i_{t+2}^e}{1 + i^*_{t+2,e}} \cdots E^e_{t+N}$$

- **Current exchange rate** depends on:
    - Expected path of domestic interest rates.
    - Expected path of foreign interest rates.
    - Long-run expected exchange rate ($E^e_{t+N}$).
- **Problem**: Expectations about distant future are highly volatile and driven by "imagination" (news, sentiment, narratives).
- **Result**: Exchange rates overreact to news, creating noise unrelated to current fundamentals.

### Costs of Excess Volatility
- **Transaction Costs**: Harder to plan trade and investment.
- **Financial Risk**: Currency exposure adds risk to cross-border investment.
- **Example**: Russia (2022) - ruble collapsed on invasion news, then recovered (not due to fundamentals, but massive rate hikes).

## 6. Choosing an Exchange Rate Regime

### Case for Fixed Exchange Rate
**When to Peg?**
1. **Similar Shocks**: If shocks are correlated with the anchor country, foreign monetary policy appropriate for you.
    - **Example**: Eurozone (similar business cycles across members).
2. **High Fiscal Capacity**: Can fight recessions with fiscal policy (don't need monetary policy).
    - **Example**: Hong Kong (large reserves, flexible fiscal policy).
3. **Flexible Domestic Prices/Wages**: If $P$ adjusts easily, nominal peg doesn't constrain real exchange rate.
    - **Example**: Hong Kong (flexible labor markets).
4. **Low Inflation Credibility**: Peg to anchor credibility of low-inflation country.
    - **Example**: Argentina (attempted currency board to import US credibility).
5. **High Trade Integration**: Reduces transaction costs if trade heavily with anchor country.
    - **Example**: Eurozone (frequent cross-border transactions).

### Case for Floating Exchange Rate
**When to Float?**
1. **Idiosyncratic Shocks**: If shocks differ from trading partners, need independent monetary policy.
2. **Low Fiscal Capacity**: Need monetary policy as stabilization tool.
3. **Rigid Prices/Wages**: Need nominal exchange rate to adjust real exchange rate.
4. **Credible Monetary Policy**: Can achieve low inflation without anchor.
5. **Large Economy**: Less exposed to external shocks; net export channel less important (e.g., US).

## 7. Summary

- **Fixed Exchange Rate**: $E = \bar{E}$ $\Rightarrow$ $i = i^*$ $\Rightarrow$ No monetary policy independence.
    - **Benefits**: Reduces volatility, lowers transaction costs, anchors inflation expectations.
    - **Costs**: Lose policy tool, vulnerable to speculative attacks, must suffer foreign shocks.
- **Floating Exchange Rate**: $E$ adjusts freely $\Rightarrow$ Independent monetary policy.
    - **Benefits**: Can respond to domestic shocks, no speculative attacks on currency.
    - **Costs**: Excess volatility, complicates trade/investment decisions.
- **Speculative Attacks**: If $E^e \downarrow$, must raise $i$ to defend peg $\Rightarrow$ Domestic recession.
- **Most Regimes Are Hybrid**: Managed floats, target zones, capital controls (e.g., China, Singapore, Brazil).
- **Expectations Matter**: Exchange rates driven by expected future policies and distant fundamentals (excess volatility).

**Next**: Financial markets, asset pricing, and expectations.
