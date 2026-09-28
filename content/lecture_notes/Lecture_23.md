# Lecture 23: Expectations and Asset Pricing II - Equity

## Overview
```summary
- EPDV carries over to equity, where the payoff is a **dividend stream** rather than a promised coupon
- The lecture runs one chain: what equity promises, how arbitrage prices it, what that price is worth fundamentally
- Policy moves asset prices twice over — through the **discount rate** and through the **cash flows being discounted**
- Expectations and the risk premium, not dividends alone, are what make equity prices volatile
- The lecture ends on the **Gordon Growth Model**, where the condition the sum needs in order to converge is a real restriction, not a formality
```
This lecture extends the EPDV framework to equity pricing, analyzes how monetary and fiscal policy affect asset prices, and explores the role of expectations and risk premiums in financial markets.

## 1. Equity vs. Bonds: Key Differences
```summary
- **Bonds** promise fixed payments, coupons plus face value; **equity** pays a dividend that is variable and not guaranteed
- A dividend **policy** is not a commitment — a bank can cut its dividend to zero without defaulting
- **Maturity**: a bond has a fixed terminal date, save perpetuities; an equity has none, lasting as long as the company exists
- No terminal date means there is always a **future price** term in an equity valuation, and never one in a bond's
- That single difference is why equity cannot be priced like a bond — the cash flow never ends, so the price to be paid later never stops mattering
```

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
```summary
- Compare holding a one-year bond against holding the stock a year and selling; equal payoffs, no profit either way
- The stockholder receives **a dividend and a sale price**, so both terms carry expectations: $E_t[D_{t+1}]$ and $E_t[Q_{t+1}]$
- The condition carries a risk premium $x_s$ on the equity side, not just an interest rate — without it this is an equality only for a certain payoff
- **$x_s$ is much larger than the bond risk premium $x_b$**: the equity claim absorbs far more risk for the same money
- Solved for the price, $Q_t$ is the same discounting form as a bond, one period out and with $x_s$ added to the rate
- Fundamental value is therefore always stated relative to a *next-period* price — the term a bond at maturity never needs
```

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
```summary
- Substituting the one-period equation into itself and repeating forever makes the price the EPDV of **all future dividends**, each discounted at the interest rate plus the risk premium
- The sum closes only under two assumptions: the required return is the same in every period, and dividends grow at a constant rate $g$ forever
- **$D_1 \equiv E_t[D_{t+1}]$ is next period's expected dividend, not this year's** — the sum starts at $n = 1$, so the first term is $D_1$ discounted one period
- **The series must converge**, so the model is defined only while $g < i_{1t} + x_s$: growth is a floor under the required return, not a free good
- The closed form is $Q_t = D_1 / (i_{1t} + x_s - g)$ — the required return is the divisor, which resolves §2's paradox, and within it a higher return lowers the price while a higher $g$ raises it
- At $g$ equal to the required return the denominator hits zero and the price is infinite; pushed above, the series diverges outright — neither is a valuation, and that is the constraint's real point
- **Fundamental value** is the EPDV of expected dividends; a **bubble** is a price exceeding any reasonable such EPDV
```

### Recursive Substitution
- At $t+1$: $Q_{t+1} = \frac{E_{t+1}[D_{t+2}] + E_{t+1}[Q_{t+2}]}{1 + i_{1,t+1} + x_s}$
- Substitute $E_t[Q_{t+1}]$ into $Q_t$ equation.
- Repeat infinitely.

### Result: Gordon Growth Model (Simplified)
$$Q_t = \sum_{n=1}^{\infty} \frac{E_t[D_{t+n}]}{(1 + i_{1t} + x_s)(1 + E_t[i_{1,t+1}] + x_s) \cdots}$$

**Interpretation**: Stock price = EPDV of **all future dividends** (discounted by interest rate + risk premium).

### Closing the Sum: The Gordon Growth Model

The infinite sum is only useful if it sums. Take the two assumptions the closed form needs — the required return is the same in every period, and dividends grow at a constant rate $g$ forever:

$$E_t[D_{t+n}] = D_1 (1 + g)^{n-1}, \qquad D_1 \equiv E_t[D_{t+1}]$$

Factoring the first dividend out leaves a geometric series in the ratio $\frac{1 + g}{1 + i_{1t} + x_s}$:

$$Q_t = \frac{D_1}{1 + i_{1t} + x_s} \sum_{n=0}^{\infty} \left(\frac{1 + g}{1 + i_{1t} + x_s}\right)^n$$

**Step 1: The Series Must Converge.** A geometric series sums only when its ratio is below 1, so the model is defined only when:

$$g < i_{1t} + x_s$$

**Step 2: Apply the Closed Form** $\sum_{n=0}^{\infty} q^n = \frac{1}{1-q}$:

$$Q_t = \frac{D_1}{1 + i_{1t} + x_s} \cdot \frac{1}{1 - \frac{1 + g}{1 + i_{1t} + x_s}} = \frac{D_1}{i_{1t} + x_s - g}$$

**The Constraint Is the Point**: When $g$ reaches the required return, the denominator hits zero and the formula returns an infinite price; push $g$ above it and the series diverges outright. Neither is a valuation — both say *no finite price is consistent with dividends growing forever at a rate the market discounts that heavily*. A modest $g$ is therefore harmless, but it is a FLOOR under the required return, and that is the divisor paradox of §2 resolved.

**Reading the Formula**:
- $D_1$ is **next** period's expected dividend, not this year's: the sum starts at $n = 1$, so the first term is $D_1$ discounted one period
- Required return $\uparrow$ $\Rightarrow$ price $\downarrow$ (more discounting)
- $g \uparrow$ $\Rightarrow$ price $\uparrow$, the whole time remaining inside the constraint

### Fundamental Value vs. Bubbles
- **Fundamental Value**: Based on expected dividends.
- **Bubbles**: Price exceeds any reasonable EPDV of dividends.
    - Example: Dot-com bubble, Bitcoin (2017), South Sea Bubble (Isaac Newton lost £20,000).
    - Newton: "I can calculate the motions of the heavenly bodies, but not the madness of people."

## 4. Policy Effects on Asset Prices
```summary
- **Bonds**: a rate cut means less discounting, so bond prices rise — price and rate move in opposite directions
- **Equity** has two channels that point the same way: less discounting raises $Q$, and expansion lifts $Y$, then sales, then dividends
- Equity therefore responds more than bonds to the same cut — two channels against one
- The **wealth channel** runs policy to prices to spending: cut rates, assets rise, households feel wealthier, consumption rises
- A rise in consumer spending is ambiguous until the **expected Fed reaction** is specified, because the two scenarios give opposite answers
- **Fed accommodates**: dividends rise, equity rises, bonds are flat — good news is good news
- **Fed tightens**: anticipated $i \uparrow$ hits bond prices, and the offsetting demand shock cancels the dividend gain, leaving equity to fall on the discounting effect alone — good news is bad news, as in 2022-2023
```

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
- **Equity**: The Fed's reaction decides which effect there is — and the
    two are alternatives, not terms to add together:
    1. **If the Fed accommodates** (Scenario 1): no offset, so demand and
       sales rise, dividends rise, and **$Q \uparrow$**.
    2. **If the Fed fully offsets** the demand shock: $Y$ is held at its old
       level, dividends are *unchanged*, and all that is left is the
       discounting effect of a higher rate, so **$Q \downarrow$**.

    The second is not a partial correction to the first — it removes the
    dividend channel the first depends on. Treating the two as magnitudes
    that partly cancel puts both signs live at once, which is the one thing
    this scenario exists to rule out.
- **Result**: **Good news is bad news** for asset markets (common in 2022-2023).

**Key Insight**: Asset market response depends critically on **expected Fed reaction**.

## 5. Risk Premium and Market Volatility
```summary
- The **VIX** reads implied volatility off S&P 500 option prices, so it measures risk aversion rather than any cash flow
- High VIX is risk-off and high risk aversion; low VIX is risk-on
- **March 2020**: the VIX spiked, the equity risk premium $x_s$ jumped, and the S&P 500 fell 35% — a risk premium move, not a dividend move
- **The recovery** ran the same chain in reverse: VIX down, $x_s$ down, S&P 500 up 114% to end-2021 on Fed easing and returning risk appetite together
- **May 2023**: First Republic's collapse put contagion fear into the VIX and the S&P 500 fell intraday, with PacWest's circuit breakers halting trading
- Both episodes move prices by moving $x_s$, which is why the risk premium is the main driver of equity volatility
```

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
```summary
- The precedent repeats: the Nikkei 225 up 500% then collapsing, Bitcoin up 1,500% in 2017 then down 80%, and the dot-com extreme before its crash
- **No terminal value** is the structural reason equity is bubble-prone — with no maturity, the future price never leaves the valuation
- If $E_t[Q_{t+n}]$ grows faster than discounting, the price can explode, and the expectation of that is self-fulfilling
- **Imagination and narrative** drive those expectations, so a runaway price need not be anchored to any dividend forecast
- **Excess volatility**: equity prices move much more than changes in expected dividends justify — speculation, not fundamentals, carries a large share of the variation
```

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
```summary
- **Nominal** pricing discounts nominal cash flows at the nominal interest rate
- **Real** pricing discounts real cash flows at the real interest rate, $r = i - \pi$
- The two give the **same valuation** provided the cash flows and the rate are chosen consistently
- The real version is the one that speaks to purchasing power — what a discounted dividend actually buys
```

### Nominal vs. Real EPDV
- **Nominal**: Discount nominal cash flows by nominal interest rate.
- **Real**: Discount real cash flows by real interest rate ($r = i - \pi$).

**Result**: Same valuation (if consistent), but real terms clarify purchasing power.

### Why "Same Valuation" Is a Claim and Not a Restatement

Start with one unit of a real dividend, due next period.

- **Nominal route**: the cash flow is worth $1$ in today's currency, so its nominal present value is $\frac{1}{1+i}$. Deflating that by expected inflation gives $\frac{1}{(1+i)(1+\pi^e)}$ in real terms.
- **Real route**: the same dividend is one real unit, so its real present value is $\frac{1}{1+r}$.

Setting them equal is not free — it *is* the Fisher relation:

$$\frac{1}{1+r} = \frac{1}{(1+i)(1+\pi^e)} \quad\Longleftrightarrow\quad 1 + r = \frac{1 + i}{1 + \pi^e}$$

So the two routes agree **if and only if** the interest rate, the inflation rate and the cash flow are the consistent triple. This is why $r = i - \pi$ is an approximation and not the identity: the exact statement carries the product, and the two coincide to first order only when the rates are small. At $i = 10\%$ and $\pi^e = 4\%$, $r = i - \pi$ says 6%, while the exact relation gives $\frac{1.10}{1.04} - 1 \approx 5.8\%$ — a difference that is small in one direction and does not stay small when the rates are large.

The practical rule: **quote a real discount rate only against a real cash flow.** Mix a nominal rate with a real cash flow and you have not computed a purchasing-power valuation at all; you have computed a nominal one and called it something else.

## 8. Summary
```summary
- **Bonds** are a discounted face value plus coupons; **equity** is the EPDV of a dividend stream, discounted at $i_{t+k} + x_s$
- A monetary easing raises bond prices once and equity prices twice, through discounting and through dividends
- Any aggregate demand shock resolves one way or the other depending on the **expected Fed reaction** — accommodating makes good news good, tightening makes it bad
- The **equity risk premium** is large and volatile, and the VIX is its market thermometer; its spikes come with collapses
- Equity has no maturity, so the future price never stops mattering and speculation often dominates fundamentals
```

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
