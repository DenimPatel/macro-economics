# Lecture 22: Expectations and Asset Pricing I - Bonds

## Overview
This lecture introduces the concept of expected present discounted value (EPDV) and applies it to pricing bonds. It covers discounting future cash flows, bond pricing, yield curves, and the role of risk premiums.

## 1. Motivation: Why Asset Prices Move

### Recent Events
- **First Republic Bank**: Collapsed and sold to JPMorgan (second-largest US bank failure, $100B deposit outflow).
- **Equity Markets**: S&P 500 volatility driven by COVID, policy support, inflation, Fed hikes.
- **Bond Markets**: Long-duration Treasury ETFs experienced 40% declines due to rising interest rates.

### Key Insight
Asset prices move dramatically based on **expectations** about the future (cash flows, interest rates, risk).

## 2. Expected Present Discounted Value (EPDV)

### The Problem
- You pay for an asset **today** (in current dollars).
- The asset pays cash flows **in the future** (future dollars).
- **Question**: How do we compare payments across time?

### The Solution: Discounting

**Why discount the future?**
- \$1 today > \$1 one year from now (can invest and earn interest).
- If \$1 invested today yields $\text{1} \times (1 + i_t)$ next year, then \$1 next year is worth $\frac{1}{1 + i_t}$ today.

**Key Formula**: Value of \$1 received in $n$ years:
$$\text{Value today} = \frac{1}{(1 + i_t)(1 + i_{t+1}) \cdots (1 + i_{t+n-1})}$$

### General EPDV Formula (Known Future)
$$V_t = Z_t + \frac{Z_{t+1}}{1 + i_t} + \frac{Z_{t+2}}{(1 + i_t)(1 + i_{t+1})} + \cdots$$

- $Z_t$: Cash flow at time $t$ (received today, no discounting).
- $Z_{t+1}$: Cash flow one year from now (discount by $1 + i_t$).
- $Z_{t+2}$: Cash flow two years from now (discount by product of two rates).

### EPDV with Uncertainty (Expected Future)
$$V_t = Z_t + \frac{E_t[Z_{t+1}]}{1 + i_t} + \frac{E_t[Z_{t+2}]}{(1 + i_t)(1 + E_t[i_{t+1}])} + \cdots$$

- Replace unknown future cash flows and interest rates with **expectations** formed at time $t$.

## 3. Special Cases

### Constant Interest Rate ($i$ constant)
$$V_t = Z_t + \frac{Z_{t+1}}{1 + i} + \frac{Z_{t+2}}{(1 + i)^2} + \cdots$$

### Constant Payment ($Z$ constant)
$$V_t = Z \left(1 + \frac{1}{1 + i} + \frac{1}{(1 + i)^2} + \cdots\right)$$

### Constant Rate & Payment (Finite Horizon $n$)
$$V_t = Z \frac{1 - (1 + i)^{-n}}{i/(1 + i)}$$

### Perpetuity (Constant Payment Forever)
$$V_t = \frac{Z}{i}$$

**Ex-Dividend Perpetuity** (first payment at $t+1$):
$$V_t = \frac{Z}{i}$$

**Key Insight**: As $i \to 0$, $V_t \to \infty$ (low interest rates inflate asset prices).

## 4. Bond Pricing

### Bond Characteristics
- **Maturity ($n$)**: Number of years until final payment.
- **Face Value**: Principal repaid at maturity (e.g., $100).
- **Coupons**: Periodic interest payments (may be zero).

### One-Year Bond
- Pays $100 one year from now.
- **Price**: $P_{1t} = \frac{100}{1 + i_{1t}}$
- **Inverse Relationship**: Higher $i_{1t}$ $\Rightarrow$ Lower $P_{1t}$.

### Two-Year Bond
- Pays $100 two years from now (zero-coupon).
- **Price**: $P_{2t} = \frac{100}{(1 + i_{1t})(1 + E_t[i_{1,t+1}])}$
- **Inverse Relationship**: Higher $i_{1t}$ or $E_t[i_{1,t+1}]$ $\Rightarrow$ Lower $P_{2t}$.

### Arbitrage Pricing (Alternative Method)
Compare two strategies for investing $1 for one year:
1. **Buy one-year bond**: Return = $1 + i_{1t}$.
2. **Buy two-year bond, sell after one year**: Pay $P_{2t}$ today, receive $E_t[P_{1,t+1}]$ next year.

**Arbitrage Condition**:
$$1 + i_{1t} = \frac{E_t[P_{1,t+1}]}{P_{2t}}$$

**Result**: Same price as EPDV method:
$$P_{2t} = \frac{E_t[P_{1,t+1}]}{1 + i_{1t}} = \frac{100}{(1 + i_{1t})(1 + E_t[i_{1,t+1}])}$$

## 5. Yield to Maturity

### Definition
The **constant** annual interest rate that equates the bond price to its EPDV.

**Two-Year Bond**:
$$P_{2t} = \frac{100}{(1 + i_{2t})^2}$$

Where $i_{2t}$ is the **two-year yield**.

### Expectation Hypothesis
From $P_{2t} = \frac{100}{(1 + i_{1t})(1 + E_t[i_{1,t+1}])} = \frac{100}{(1 + i_{2t})^2}$:

$$i_{2t} \approx \frac{i_{1t} + E_t[i_{1,t+1}]}{2}$$

**Interpretation**: Long-term rate = Average of expected short-term rates.

## 6. Yield Curve (Term Structure)

### Definition
Relationship between **maturity** and **yield** (plot $i_n$ vs. $n$).

### Shapes
- **Upward Sloping** (steep): Markets expect rising short-term rates (normal in expansions).
    - Example: November 2000 (pre-recession, Fed expected to tighten).
- **Downward Sloping** (inverted): Markets expect falling short-term rates (common in recessions or before cuts).
    - Example: June 2001 (recession, Fed cut rates).
    - Example: Today (2023, inflation peak passed, Fed expected to ease).

### Why Shapes Change
- **Fed controls short end** (overnight rate).
- **Long end** determined by expectations of future short rates.
- **Steep curve**: Fed tight today, expect loosening soon.
- **Inverted curve**: Fed tight today, expect easing later (recession signal).

## 7. Risk and Term Premiums

### Price Risk (No Default Risk)
- **One-year bond**: No price risk (receive $100 at maturity).
- **Two-year bond held for one year**: Price risk (don't know $P_{1,t+1}$).

### Risk-Adjusted Arbitrage
$$1 + i_{1t} + x_b = \frac{E_t[P_{1,t+1}]}{P_{2t}}$$

- $x_b$: **Risk premium** for holding longer-maturity bond.

### Term Premium in Yields
$$i_{2t} \approx \frac{i_{1t} + E_t[i_{1,t+1}]}{2} + \frac{x_b}{2}$$

- **Term premium** ($x_b$): Compensation for price risk.
- Usually positive (longer bonds riskier), but can be negative (hedging value).

### Recent Example
- **Pre-2020**: $x_b < 0$ (long bonds hedged against crises, rates fell in downturns).
- **2022-2023**: $x_b > 0$ (inflation risk dominates, rates rise with inflation shocks).

## 8. Summary

- **EPDV**: Core tool for valuing future cash flows.
- **Discounting**: Interest rates convert future dollars to present value.
- **Bond Prices**: Inversely related to interest rates.
- **Yield Curve**: Reflects expectations of future short rates (+ risk premium).
- **Term Premium**: Compensation for holding longer-maturity bonds (price risk).

**Next**: Apply EPDV to equity pricing and understand policy effects on asset prices.
