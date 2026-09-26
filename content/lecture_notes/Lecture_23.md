# Lecture 23: Expectations and Asset Pricing II - Equity

## Overview
This lecture extends the EPDV framework to equity pricing, analyzes how monetary and fiscal policy affect asset prices, and explores the role of expectations and risk premiums in financial markets.

## 1. Equity vs. Bonds: Key Differences

### 1. No Fixed Coupons
- **Bonds**: Promise fixed payments (coupons + face value).
- **Equity**: Pay dividends (variable, not guaranteed).
    - Companies set dividend **policy** (not commitment).
    - Can cut dividends to zero without default (e.g., regional banks during crises).

### 2. No Maturity
- **Bonds**: Have fixed maturity date (except perpetuities).
- **Equity**: Lasts as long as the company exists (in principle, forever).
    - No terminal date $\Rightarrow$ Always a "future price" term in valuation.

## 2. Equity Pricing via Arbitrage

### Setup
Compare two one-year investment strategies:
1. **Buy one-year bond**: Return = $1 + i_{1t}$.
2. **Buy stock, hold for one year, sell**: Pay $Q_t$ today, receive $E_t[D_{t+1}]$ (dividend) + $E_t[Q_{t+1}]$ (sale price).

### Arbitrage Condition (with Risk Premium)
$$1 + i_{1t} + x_s = \frac{E_t[D_{t+1}] + E_t[Q_{t+1}]}{Q_t}$$

- $x_s$: **Equity risk premium** (typically much larger than bond risk premium $x_b$).

### Stock Price Today
$$Q_t = \frac{E_t[D_{t+1}] + E_t[Q_{t+1}]}{1 + i_{1t} + x_s}$$

## 3. Fundamental Value of Equity

### Recursive Substitution
- At $t+1$: $Q_{t+1} = \frac{E_{t+1}[D_{t+2}] + E_{t+1}[Q_{t+2}]}{1 + i_{1,t+1} + x_s}$
- Substitute $E_t[Q_{t+1}]$ into $Q_t$ equation.
- Repeat infinitely.

### Result: Gordon Growth Model (Simplified)
$$Q_t = \sum_{n=1}^{\infty} \frac{E_t[D_{t+n}]}{(1 + i_{1t} + x_s)(1 + E_t[i_{1,t+1}] + x_s) \cdots}$$

**Interpretation**: Stock price = EPDV of **all future dividends** (discounted by interest rate + risk premium).

### Fundamental Value vs. Bubbles
- **Fundamental Value**: Based on expected dividends.
- **Bubbles**: Price exceeds any reasonable EPDV of dividends.
    - Example: Dot-com bubble, Bitcoin (2017), South Sea Bubble (Isaac Newton lost £20,000).
    - Newton: "I can calculate the motions of the heavenly bodies, but not the madness of people."

## 4. Policy Effects on Asset Prices

### A. Expansionary Monetary Policy ($\downarrow i$)

#### Effect on Bonds
- **Mechanism**: Lower $i$ $\Rightarrow$ Less discounting of future payments $\Rightarrow$ Higher bond prices.
- **Result**: **Bond prices $\uparrow$** (inverse relationship with interest rates).

#### Effect on Equity
- **Channel 1 (Discounting)**: Lower $i$ $\Rightarrow$ Less discounting of future dividends $\Rightarrow$ **$Q \uparrow$**.
- **Channel 2 (Output)**: Lower $i$ $\Rightarrow$ Expansionary $\Rightarrow$ $Y \uparrow$ $\Rightarrow$ Sales $\uparrow$ $\Rightarrow$ Dividends $\uparrow$ $\Rightarrow$ **$Q \uparrow$**.
- **Result**: **Equity prices $\uparrow\uparrow$** (stronger effect than bonds).

**Wealth Channel of Monetary Policy**: Fed cuts rates $\Rightarrow$ Asset prices rise $\Rightarrow$ Households feel wealthier $\Rightarrow$ Consumption $\uparrow$.

### B. Increase in Consumer Spending ($\uparrow C_0$)

#### Scenario 1: Fed Accommodates (Does Not React)
- **Bonds**: No change (interest rate unchanged).
- **Equity**: $C \uparrow$ $\Rightarrow$ Sales $\uparrow$ $\Rightarrow$ Dividends $\uparrow$ $\Rightarrow$ **$Q \uparrow$**.

#### Scenario 2: Fed Dislikes Overheating (Raises $i$)
- **Bonds**: Fed expected to hike $\Rightarrow$ $i \uparrow$ (anticipated) $\Rightarrow$ **Bond prices $\downarrow$**.
- **Equity**: Two offsetting effects:
    1. Higher dividends (direct effect): **$Q \uparrow$**.
    2. Fed fully offsets demand shock $\Rightarrow$ No change in $Y$ $\Rightarrow$ No change in dividends $\Rightarrow$ Only get discounting effect: **$Q \downarrow$**.
- **Result**: **Good news is bad news** for asset markets (common in 2022-2023).

**Key Insight**: Asset market response depends critically on **expected Fed reaction**.

## 5. Risk Premium and Market Volatility

### VIX ("Fear Index")
- Measures implied volatility from S&P 500 option prices.
- **High VIX** = High risk aversion (risk-off).
- **Low VIX** = Low risk aversion (risk-on).

### Example: COVID-19 Crash (March 2020)
- **VIX spiked** $\Rightarrow$ $x_s \uparrow\uparrow$ $\Rightarrow$ S&P 500 fell 35%.
- **Recovery**: VIX declined $\Rightarrow$ $x_s \downarrow$ $\Rightarrow$ S&P 500 rallied 114% (to end-2021).
    - Driven by: Fed easing ($i \downarrow$) + Risk appetite recovery ($x_s \downarrow$).

### Example: Regional Banking Crisis (May 2023)
- **First Republic collapse** $\Rightarrow$ Fear of contagion $\Rightarrow$ VIX spike $\Rightarrow$ S&P 500 intraday decline.
- **PacWest**: Circuit breakers triggered (halts trading when price falls too fast).

**Key Insight**: Risk premium ($x_s$) is a major driver of equity volatility.

## 6. Bubbles and Excess Volatility

### Historical Bubbles
- **Nikkei 225** (Japan, 1980s): 500% gain, then collapse.
- **Bitcoin** (2017): 1,500% gain, then 80% decline.
- **Dot-com Bubble** (1990s): Extreme valuations, then crash.

### Why Bubbles Occur
- Equity has **no terminal value** (unlike bonds) $\Rightarrow$ Future price always matters.
- If $E_t[Q_{t+n}]$ grows faster than discounting, price can explode (self-fulfilling).
- **Imagination** and **narratives** drive expectations.

### Excess Volatility
- Equity prices move **much more** than justified by changes in expected dividends.
- Large component driven by **speculative** factors (not fundamentals).

## 7. Real vs. Nominal Pricing

### Nominal vs. Real EPDV
- **Nominal**: Discount nominal cash flows by nominal interest rate.
- **Real**: Discount real cash flows by real interest rate ($r = i - \pi$).

**Result**: Same valuation (if consistent), but real terms clarify purchasing power.

## 8. Summary

### Asset Pricing Formula
- **Bonds**: $P_t = \frac{\text{Face Value}}{(1 + i)^n}$ (+ coupons if any).
- **Equity**: $Q_t = \sum_{n=1}^{\infty} \frac{E_t[D_{t+n}]}{\prod (1 + i_{t+k} + x_s)}$ (EPDV of dividends).

### Policy Effects
- **Expansionary Monetary Policy**: $\uparrow$ Bond prices, $\uparrow\uparrow$ Equity prices.
- **Aggregate Demand Shocks**: Effect depends on **expected Fed reaction**.
    - Fed accommodates $\Rightarrow$ Good news is good news.
    - Fed tightens $\Rightarrow$ Good news is bad news (2022-2023 environment).

### Risk Premium
- **Equity risk premium** ($x_s$) is large and volatile.
- **VIX** measures risk appetite; spikes during crises cause asset price collapses.

### Bubbles
- Equity prone to bubbles (no maturity $\Rightarrow$ future price always matters).
- Speculative component often dominates fundamentals.

**Next**: Integrate expectations into IS-LM model (permanent income, life-cycle theories).
