# Lecture 22: Expectations and Asset Pricing I - Bonds

## Overview

```summary
- **Expected present discounted value (EPDV)**: an asset is worth today the discounted value of the cash flows it is expected to pay
- The lecture runs one chain: discounting, then bond pricing, then the yield curve, then risk premiums
- Bonds come first because their cash flows are known in advance, so the only unknowns are the discount rates
- Everything after the definition simplifies that same arithmetic — constant rates, constant payments, a perpetuity
```
This lecture introduces the concept of expected present discounted value (EPDV) and applies it to pricing bonds. It covers discounting future cash flows, bond pricing, yield curves, and the role of risk premiums.

## 1. Motivation: Why Asset Prices Move

```summary
- **First Republic**: the second-largest US bank failure, sold to JPMorgan after 100B in deposits ran out
- **Equities**: S&P 500 volatility traces back to COVID, policy support, inflation and the Fed's hikes
- **Bonds**: long-duration Treasury ETFs fell 40% as interest rates rose
- Long maturity is what concentrates the damage — that 40% loss is a rate story, not a credit story
- The common thread: prices move on **expectations** about future cash flows, interest rates and risk
```

### Recent Events
- **First Republic Bank**: Collapsed and sold to JPMorgan (second-largest US bank failure, $100B deposit outflow).
- **Equity Markets**: S&P 500 volatility driven by COVID, policy support, inflation, Fed hikes.
- **Bond Markets**: Long-duration Treasury ETFs experienced 40% declines due to rising interest rates.

### Key Insight
Asset prices move dramatically based on **expectations** about the future (cash flows, interest rates, risk).

## 2. Expected Present Discounted Value (EPDV)

```summary
- The problem: you pay today in current dollars and the asset pays back in future dollars
- **Time itself has a price** — a dollar today beats a dollar a year from now, because it can be invested
- Discounting inverts that: a dollar arriving a year later is worth 1/(1 + i) today
- Each flow is divided by the *product* of the one-period rates up to its date, so a distant flow is discounted more
- **EPDV** is the sum: today's flow undiscounted, next year's divided by one plus i, the year after by two rates
- Under uncertainty the same sum is taken over **expectations** formed at time t — for cash flows and for rates alike
```

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
- The one-period rate $i_t$ is **not** wrapped in an expectation, and that is deliberate rather than an oversight: $i_t$ has already happened, so the rate applied to the first discount factor is known at time $t$. Only $i_{t+1}$ and beyond are genuinely unknown, which is why the second factor carries $E_t[\cdot]$ and the first does not. The bond formula in Section 4 uses the same split — $i_{1t}$ bare, $E_t[i_{1,t+1}]$ inside the expectation — so the two halves of the lecture are making one distinction, not two.

## 3. Special Cases

```summary
- Four simplifications of the same sum, each isolating one thing: the rate, the payment, or the horizon
- **Constant rate**: the discount factors become a geometric series, one term per year
- **Constant payment**: factor the payment out and what is left is a pure geometric series in 1/(1 + i)
- **Finite horizon n**: the infinite series truncates, giving a closed form in n
- **Perpetuity**: a level payment starting today is worth $Z$ plus $Z/i$; start the stream one year later and the leading $Z$ is gone, which is the entire difference between the two
- The punchline: as the rate goes to zero the price goes to infinity — low rates inflate asset prices
```

### Constant Interest Rate ($i$ constant)
$$V_t = Z_t + \frac{Z_{t+1}}{1 + i} + \frac{Z_{t+2}}{(1 + i)^2} + \cdots$$

### Constant Payment ($Z$ constant)
$$V_t = Z \left(1 + \frac{1}{1 + i} + \frac{1}{(1 + i)^2} + \cdots\right)$$

### Constant Rate & Payment (Finite Horizon $n$)
$$V_t = Z \frac{1 - (1 + i)^{-n}}{i/(1 + i)}$$

### Perpetuity (Payment Starts Today)
$$V_t = Z + \frac{Z}{i}$$

### Perpetuity (First Payment at $t+1$)
$$V_t = \frac{Z}{i}$$

The two differ by exactly one $Z$, and the timing is the whole difference: a level payment that starts **today** is worth one payment plus the stream beyond it, while a stream whose first payment is **one year away** is worth the tail only. Both are usually written $Z/i$ in a textbook that silently means the second; print the first one as $Z/i$ and the label is wrong.

**Key Insight**: As $i \to 0$, $V_t \to \infty$ (low interest rates inflate asset prices).

## 4. Bond Pricing

```summary
- **Maturity** is the years to final payment, **face value** the principal repaid, **coupons** the periodic interest that may be zero
- A **zero-coupon** bond pays its face value once at maturity and nothing before
- **One-year**: price is 100/(1 + i), so a higher one-year rate means a lower price
- **Two-year**: price is 100 over the product of this year's rate and next year's expected rate — both push price down
- **Arbitrage** reaches the same price from the other side: holding the two-year bond for a year must earn the one-year return
- The two routes coincide, and that is the point — no free lunch in the bond price
```

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

```summary
- **Yield to maturity**: the constant rate that equates a bond's price to its EPDV — one number standing in for a whole path of rates
- The two-year bond's yield prices it as 100/(1 + i) squared, the compounded form
- **Expectation hypothesis**: equating that to the EPDV price makes the long rate the average of today's and next year's expected short rates
- So a long-term rate is an average of expected short-term rates, not a rate with a life of its own
- The step is an approximation: the arithmetic average stands in for the geometric one
```

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

```summary
- The **yield curve** plots yield against maturity — the term structure of interest rates
- **Upward sloping**: short rates are expected to rise, the normal shape in expansions
- **Inverted**: short rates are expected to fall, the shape that shows up before cuts and around recessions
- November 2000 was upward sloping into the 2001 recession; June 2001 and 2023 were inverted, the Fed cutting or set to ease
- The short end is set by the Fed's overnight rate; the long end is pure expectation about future short rates
- That is why an inverted curve reads as a recession signal: it is the Fed's rate against what markets expect next
```

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

```summary
- Even with no default risk, a bond sold before maturity carries **price risk**: you do not know next year's price
- A one-year bond has none of it, because you hold it to maturity and collect the face value
- **Risk-adjusted arbitrage** adds a premium to the one-year rate, so the longer bond has to beat it to be worth holding
- The **term premium** enters the two-year yield as half that premium — compensation for exactly this price risk
- It is usually positive, but pre-2020 it was negative, because long bonds hedged against crises and rates fell in downturns
- 2022-2023 flipped it positive, with inflation risk dominating and long rates rising with inflation shocks
```

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

```summary
- **EPDV** is the core tool for valuing future cash flows
- **Discounting** converts future dollars to present value, so a payment's date is part of its value
- **Bond prices** are inversely related to interest rates
- The **yield curve** reflects expectations of future short rates, plus a risk premium
- The **term premium** compensates for holding longer-maturity bonds, which carry price risk
```

- **EPDV**: Core tool for valuing future cash flows.
- **Discounting**: Interest rates convert future dollars to present value.
- **Bond Prices**: Inversely related to interest rates.
- **Yield Curve**: Reflects expectations of future short rates (+ risk premium).
- **Term Premium**: Compensation for holding longer-maturity bonds (price risk).

**Next**: Apply EPDV to equity pricing and understand policy effects on asset prices.
