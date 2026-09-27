# Lecture 7: Extensions to IS-LM - Nominal vs. Real Interest Rates and Credit Spreads

## Overview
This lecture extends the basic IS-LM model along two realistic dimensions that significantly enhance its explanatory power for real-world macroeconomic phenomena:
1. **Nominal vs. Real Interest Rates**: Distinguishing between interest rates in dollar terms versus goods terms, and the role of expected inflation.
2. **Credit Spreads (Risk Premia)**: Introducing the wedge between safe government borrowing rates and the risky rates at which corporations actually borrow.

These extensions are critical for understanding modern macroeconomic crises, particularly the Global Financial Crisis (2008-2009) and the COVID-19 pandemic response. They explain why conventional monetary policy can become ineffective and what unconventional policy tools central banks might deploy.

**Key Insight**: Even when the central bank controls the nominal policy rate, the **real borrowing cost** for firms—which determines investment decisions—depends on both expected inflation and credit market conditions. These two channels can move independently from monetary policy, creating powerful shocks to the economy.

## 1. Nominal vs. Real Interest Rates

### 1.1 Definitions

#### Nominal Interest Rate ($i$)
- **Definition**: Interest rate expressed in dollar (or currency) terms.
- **Example**: If you invest \$100 in a one-year bond with nominal rate $i = 10\%$, you receive \$110 in one year.
- **Formula**: $\text{Return} = \text{Principal} \times (1 + i)$

**Characteristics**:
- Most financial instruments in the US are denominated in nominal terms.
- The Federal Reserve directly sets short-term nominal interest rates (Federal Funds Rate).
- Directly observable in financial markets.

#### Real Interest Rate ($r$)
- **Definition**: Interest rate expressed in terms of goods (a basket like CPI).
- **Example**: If you invest 1 unit of goods today at real rate $r = 3\%$, you receive 1.03 units of goods next year.
- **Interpretation**: Measures the true purchasing power gain from saving.

**Characteristics**:
- Less commonly traded directly (though TIPS—Treasury Inflation-Protected Securities—exist in US).
- What matters for real economic decisions (investment, consumption of durables).
- Must be calculated from nominal rates and inflation expectations.

### 1.2 The Fisher Equation: Linking Nominal and Real Rates

#### Derivation
Consider two investment strategies starting with 1 unit of goods today:

**Strategy 1: Real Bond (Direct)**
- Invest 1 unit of goods in a real bond.
- Receive $(1 + r_t)$ units of goods at time $t+1$.

**Strategy 2: Nominal Bond (Indirect)**
- Convert 1 unit of goods to $P_t$ dollars (today's price level).
- Invest $P_t$ dollars in a nominal bond.
- Receive $P_t(1 + i_t)$ dollars at time $t+1$.
- Convert back to goods: $\frac{P_t(1 + i_t)}{P_{t+1}^e}$ units of goods (expected).

**Arbitrage Condition**: In equilibrium, both strategies must yield the same expected return:
$$(1 + r_t) = (1 + i_t) \frac{P_t}{P_{t+1}^e}$$

#### Expected Inflation
Define **expected inflation** between $t$ and $t+1$:
$$\pi_{t+1}^e = \frac{P_{t+1}^e - P_t}{P_t}$$

This implies:
$$\frac{P_t}{P_{t+1}^e} = \frac{1}{1 + \pi_{t+1}^e}$$

Substituting into the arbitrage condition:
$$(1 + r_t) = \frac{1 + i_t}{1 + \pi_{t+1}^e}$$

#### Linear Approximation (Fisher Equation)
For small interest rates and inflation (typical in developed economies):
$$r_t \approx i_t - \pi_{t+1}^e$$

**Interpretation**: The real interest rate equals the nominal rate minus expected inflation.

**Example**:
- Nominal interest rate: $i = 6\%$
- Expected inflation: $\pi^e = 3\%$
- Real interest rate: $r \approx 6\% - 3\% = 3\%$

Even though you receive 6% more dollars, goods are 3% more expensive, so your purchasing power only increases by 3%.

### 1.3 Why Real Rates Matter for Investment

**Question**: Why do firms care about real rates, not nominal rates, when making investment decisions?

**Answer**: Firms invest to produce and sell goods in the future. Their decision depends on comparing:
- **Cost of Borrowing**: The interest rate they must pay.
- **Revenue from Investment**: The value of goods they'll produce and sell.

#### Thought Experiment
**Scenario 1**: Zero Inflation
- Nominal rate: $i = 5\%$
- Real rate: $r = 5\%$
- A project yielding 7% real return is profitable (7% > 5%).

**Scenario 2**: 10% Inflation
- Nominal rate: $i = 15\%$ (Fed raised rates to offset inflation)
- Expected inflation: $\pi^e = 10\%$
- Real rate: $r = 15\% - 10\% = 5\%$
- **The same project** is still profitable!

**Why?**: The goods you produce will sell for 10% more dollars next year. Your nominal revenue increases by 10%, exactly offsetting the higher nominal interest rate. The **real profitability** (in goods terms) is unchanged.

**Conclusion**: Investment depends on $r$, not $i$. If $r$ remains constant, doubling both $i$ and $\pi^e$ doesn't change investment incentives.

### 1.4 Historical Evidence: Great Recession (2008-2009)

#### The Setup
The Global Financial Crisis created a severe recession. The Fed responded by cutting the nominal interest rate to near zero.

**Data** (approximate from lecture figures):
- **Pre-Crisis (2007)**:
  - Nominal rate ($i$): ~5%
  - Real rate ($r$): ~2%
  - Expected inflation ($\pi^e$): ~2-3%

- **Crisis Peak (2009)**:
  - Nominal rate ($i$): ~0% (zero lower bound)
  - Real rate ($r$): ~4%
  - Expected inflation ($\pi^e$): ~-4% (deflationary expectations!)

#### Key Observations

**1. Real Rates Rose Despite Fed Easing**
Even though the Fed cut nominal rates aggressively, **real rates increased**. This perverse outcome occurred because expected inflation collapsed faster than nominal rates.

**2. Deflation Fears**
Expected inflation turned **negative** (deflation), reaching approximately -4%. Deflation expectations arose from:
- Massive demand collapse (unemployment, wealth destruction).
- Precedent from Japan's "lost decade."
- Financial market panic and deleveraging.

**3. Policy Implication**
The Fed "lost control" of the real interest rate. Even at $i = 0\%$:
$$r = i - \pi^e = 0\% - (-4\%) = 4\%$$

A **4% real rate** during a severe recession is highly contractionary, explaining the depth and persistence of the downturn.

**4. The Zero Lower Bound Problem**
Nominal rates cannot go significantly below zero (people would hoard cash). This constraint becomes binding when:
- Economy needs very low real rates (recession).
- Expected inflation is low or negative (deflation).
- Result: $r = i - \pi^e$ cannot be lowered enough via conventional monetary policy.

### 1.5 COVID-19 Episode: Negative Real Rates (2020-2021)

The COVID pandemic created a different dynamic—a supply-side shock with unusual inflation behavior.

#### Initial Shock (March-April 2020)
- **Recession fears**: Expected inflation initially fell (like 2008).
- **Policy response**: Fed cut $i$ to 0% immediately.
- **Result**: Brief spike in real rates (similar to 2008 pattern).

#### Recovery Phase (2021)
Unlike the Great Recession, **inflation surged** due to:
- **Supply chain disruptions**: Bottlenecks in production and shipping.
- **Fiscal stimulus**: Massive government spending ($3+ trillion).
- **Pent-up demand**: Reopening after lockdowns.
- **Labor shortages**: Workers leaving workforce ("Great Resignation").

**Data** (2021):
- Nominal rate: $i \approx 0\%$ (Fed kept rates at zero)
- Expected inflation: $\pi^e \approx 4-5\%$
- Real rate: $r \approx 0\% - 4\% = -4\%$

#### Implications of Negative Real Rates

**Highly Stimulative**:
- Borrowing costs effectively negative in real terms.
- Strong incentive for investment, asset purchases, speculation.

**Asset Price Boom**:
- Equity markets soared (S&P 500, NASDAQ).
- Real estate prices surged.
- Cryptocurrencies and "meme stocks" flourished.

**Fed's Dilemma** (2022):
Eventually, the Fed decided inflation was not "transitory" and began raising rates aggressively. But initial rate hikes didn't immediately raise real rates because expected inflation kept rising.

#### The Tightening Problem (2022-2023)
**Challenge**: The Fed wants to tighten financial conditions (raise $r$), but:
- Raising $i$ is straightforward.
- But if $\pi^e$ rises alongside $i$, then $r = i - \pi^e$ may not increase much.

**Breakthrough** (August 2022):
- **Jackson Hole Speech**: Fed Chair Powell gave a "hawkish" speech committing to do "whatever it takes" to reduce inflation.
- **Effect**: Convinced markets that inflation would come down ($\pi^e$ fell).
- **Result**: Real rates rose sharply, triggering stock market decline (especially tech stocks).

**Current Challenge** (2023, as of lecture):
- Fed continues raising $i$, but $\pi^e$ has stopped declining.
- Real rates have plateaued or even declined slightly.
- **Problem**: Financial conditions not tightening as intended.

## 2. Credit Spreads (Risk Premia)

### 2.1 Definitions and Concepts

#### Riskless Interest Rate
- **Definition**: Interest rate on safe assets with essentially zero default risk.
- **Examples**: US Treasury bonds, German Bunds, Swiss government bonds.
- **Notation**: $r$ (real) or $i$ (nominal) when referring to Treasuries.

#### Risky Borrowing Rate
Most corporations and households cannot borrow at the Treasury rate. They face a **risk premium**:
$$r^f = r + x$$

Where:
- $r^f$: Real interest rate firms actually pay ("$f$" for firms).
- $r$: Safe real interest rate (Treasury rate).
- $x$: **Risk premium** or **credit spread**.

#### Credit Spread ($x$)
- **Definition**: The extra interest rate charged on risky debt above the safe rate.
- **Measured as**: Yield on corporate bonds minus yield on Treasuries of same maturity.
- **Example**: If 10-year Treasury yields 4% and Boeing's 10-year bond yields 7%, then $x = 3\%$.

### 2.2 Determinants of Credit Spreads

The risk premium $x$ compensates lenders for two factors:

#### 1. Probability of Default ($p$)
- **Definition**: Likelihood that the borrower will fail to repay the loan.
- **Sources**:
  - Credit rating agencies (Moody's, S&P, Fitch).
  - Historical default rates by rating category.
  - Market-implied probabilities from Credit Default Swaps (CDS).

**Example**:
- AAA-rated bonds: $p \approx 0.01\%$ (virtually no default risk).
- BBB-rated bonds: $p \approx 0.5\%$ (investment grade, moderate risk).
- High-yield bonds ("junk"): $p \approx 5-10\%$ (substantial default risk).

#### 2. Risk Aversion of Investors
- **Definition**: Investors' unwillingness to bear uncertainty.
- **Effect**: Even if expected default probability is $p$, investors may demand compensation exceeding $p$ because they dislike risk.
- **Variation**: Risk aversion fluctuates dramatically over the business cycle.

**Key Point**: In practice, separating these two effects is difficult. We can think of the "perceived probability of default" as including both the actuarial probability and an extra premium due to risk aversion.

### 2.3 Deriving the Credit Spread Formula

#### Setup
Consider a risk-neutral investor choosing between:
- **Safe bond**: Pays $(1 + r)$ with certainty.
- **Risky bond**: Pays $(1 + r^f)$ with probability $(1 - p)$, and $0$ with probability $p$ (default, zero recovery).

#### Indifference Condition
Expected return on risky bond must equal return on safe bond:
$$(1 - p)(1 + r^f) + p \cdot 0 = (1 + r)$$

Simplify:
$$(1 - p)(1 + r^f) = (1 + r)$$

Solve for $r^f$:
$$1 + r^f = \frac{1 + r}{1 - p}$$

$$r^f = \frac{1 + r}{1 - p} - 1 = \frac{1 + r - (1 - p)}{1 - p} = \frac{r + p}{1 - p}$$

For small $p$ (approximation):
$$r^f \approx r + \frac{p}{1 - p} \approx r + p + p^2 + \cdots \approx r + p$$

Thus, the **credit spread**:
$$x \equiv r^f - r \approx p$$

**More precisely**:
$$x = \frac{p(1 + r)}{1 - p}$$

#### Interpretation
- Credit spread is **increasing** in default probability $p$.
- For small $p$, spread approximately equals $p$.
- For large $p$, spread grows faster than $p$ (convex relationship).

**Example**:
- $r = 3\%$, $p = 5\%$ (high-yield bond):
$$x = \frac{0.05 \times 1.03}{1 - 0.05} = \frac{0.0515}{0.95} \approx 5.4\%$$

So the firm must pay $r^f \approx 3\% + 5.4\% = 8.4\%$.

### 2.4 Cyclical Behavior of Credit Spreads

Credit spreads are **strongly countercyclical**:
- **Recessions**: Spreads widen dramatically ($x \uparrow\uparrow$).
- **Expansions**: Spreads narrow ($x \downarrow$).

#### Why Spreads Rise in Recessions

**1. Higher Actual Default Rates**
- Firms' revenues fall, making debt service harder.
- Weaker balance sheets increase bankruptcy risk.
- Objectively, $p$ rises.

**2. Increased Risk Aversion**
- Investors become more fearful, demanding higher compensation for any risk.
- "Flight to safety": Money flows from corporate bonds to Treasuries.
- Even if $p$ doesn't change much, perceived $p$ spikes.

**3. Liquidity Concerns**
- Corporate bond markets can become illiquid during crises.
- Harder to sell bonds quickly without taking a loss.
- Investors demand extra premium for illiquidity.

### 2.5 Historical Evidence: Great Recession

#### Credit Spread Data (High-Yield Bonds)
**Pre-Crisis (2006-2007)**:
- Credit spread: $x \approx 3-4\%$ (typical for high-yield).
- Interpretation: Markets relatively calm, low perceived default risk.

**Crisis Peak (2008)**:
- Credit spread: $x \approx 20\%$ (spiked to unprecedented levels).
- Interpretation: Massive fear, perceived default probabilities extremely high.
- **Impact**: Corporate borrowing costs exploded, even for healthy firms.

**Recovery (2009-2010)**:
- Spreads gradually declined as financial panic subsided.
- By 2010: $x \approx 5-7\%$ (still elevated but improving).

#### Policy Implication
The credit spread shock was a **major contractionary force** independent of monetary policy:
- Fed cut the safe rate ($r$) to zero.
- But corporate borrowing costs $(r + x)$ remained very high due to massive $x$.
- Investment collapsed not just from low aggregate demand, but from inability to borrow affordably.

### 2.6 Historical Evidence: COVID-19

#### Initial Spike (March 2020)
- Credit spread: Jumped from ~4% to ~11% (high-yield).
- **Trigger**: Uncertainty about pandemic duration, lockdowns, corporate survival.
- **Specific sectors hit hard**: Airlines, hospitality, retail.

#### Policy Response
Unlike 2008, the Fed acted **immediately and forcefully**:
- Cut policy rate to zero (within weeks).
- Announced **corporate bond purchase programs** (unprecedented for Fed).
  - Primary Market Corporate Credit Facility (PMCCF).
  - Secondary Market Corporate Credit Facility (SMCCF).
- **Goal**: Directly reduce $x$ by buying corporate bonds.

#### Effect
- Credit spreads quickly fell back to ~4-5% by summer 2020.
- **Key insight**: Mere announcement of Fed support was enough (Fed barely used the facilities).
- Markets regained confidence that Fed would backstop corporate credit.

#### Recent Period (2022-2023)
- Spreads remained relatively low (~4-5%) despite Fed tightening.
- **Fed's frustration**: Wanted to tighten financial conditions, but $x$ not rising.
- Only very recently (late 2023) have spreads begun to widen modestly.

## 3. The Extended IS-LM Model

### 3.1 Modifications to the Standard Model

#### LM Curve: No Change
$$i = \bar{i}$$

The central bank still sets the **nominal** interest rate. This is the Fed's direct policy instrument (Federal Funds Rate).

**Key Point**: The Fed controls $i$, but not $r$, and definitely not $(r + x)$.

#### IS Curve: Modified Investment Function
In the standard model:
$$Y = C(Y - T) + I(Y, i) + G$$

**Problem**: This assumes investment depends on the nominal rate $i$. But we now know investment depends on the **real borrowing cost**.

**Corrected Model**:
$$Y = C(Y - T) + I(Y, r^f) + G$$

Where the **real borrowing cost**:
$$r^f = i - \pi^e + x$$

**Full IS Equation**:
$$Y = C(Y - T) + I\left(Y, i - \pi^e + x\right) + G$$

#### New Parameters in IS Curve
The IS curve now depends on:
- $G$: Government spending (as before).
- $T$: Taxes (as before).
- $i$: Nominal interest rate set by Fed (as before).
- $\pi^e$: **Expected inflation** (new parameter).
- $x$: **Credit spread** (new parameter).

**Interpretation**: $\pi^e$ and $x$ are exogenous variables (parameters) in the short-run IS-LM model. Later in the course, we'll endogenize inflation. For now, we treat them as given and analyze their effects.

### 3.2 How $\pi^e$ and $x$ Shift the IS Curve

#### Effect of Expected Inflation ($\pi^e$)
**Increase in Expected Inflation** ($\pi^e \uparrow$):
- Real borrowing cost: $r^f = i - \pi^e + x \downarrow$ (falls).
- Investment: $I \uparrow$ (cheaper to borrow in real terms).
- Aggregate demand: $Z \uparrow$.
- **IS curve shifts RIGHT** (expansionary).

**Mechanism**: For a given nominal rate $i$, higher expected inflation means goods will be more expensive in the future, reducing the real cost of borrowing today. Firms find more projects profitable.

**Graphical Representation**:
- In $(Y, i)$ space: IS shifts right.
- In ZZ-curve diagram (Lecture 3): ZZ shifts up for any given $i$.

#### Effect of Credit Spread ($x$)
**Increase in Credit Spread** ($x \uparrow$):
- Real borrowing cost: $r^f = i - \pi^e + x \uparrow$ (rises).
- Investment: $I \downarrow$ (more expensive to borrow).
- Aggregate demand: $Z \downarrow$.
- **IS curve shifts LEFT** (contractionary).

**Mechanism**: Even if the Fed keeps $i$ constant and inflation expectations are stable, a rise in credit spreads (due to financial crisis, increased risk aversion, etc.) raises the effective cost of borrowing for firms. Investment falls, contracting the economy.

**Graphical Representation**:
- In $(Y, i)$ space: IS shifts left.
- In ZZ-curve diagram: ZZ shifts down for any given $i$.

### 3.3 The IS-LM Diagram with Extensions

#### Setup
- **Vertical axis**: Nominal interest rate $i$.
- **Horizontal axis**: Output $Y$.
- **LM curve**: Horizontal line at $i = \bar{i}$ (Fed's target rate).
- **IS curve**: Downward sloping, but depends on $\pi^e$ and $x$.

#### Equilibrium
Intersection of IS and LM determines:
- Output: $Y^*$
- Interest rate: $i^* = \bar{i}$ (set by Fed)

**Important**: The **real borrowing cost** determining investment is:
$$r^f = \bar{i} - \pi^e + x$$

This is **not** shown directly on the diagram but is implicit in the IS curve position.

### 3.4 Policy Experiments

#### Experiment 1: Increase in Expected Inflation ($\pi^e \uparrow$)

**Scenario**: Markets become more optimistic about future growth, or Fed successfully raises inflation expectations.

**Effects**:
1. Real borrowing cost falls: $r^f = i - \pi^e + x \downarrow$.
2. IS curve shifts **RIGHT**.
3. Output increases: $Y \uparrow$.
4. (If Fed accommodates, $i$ unchanged.)

**Intuition**: This acts like an **expansionary monetary policy**, even though the Fed didn't change $i$. The real rate fell automatically because inflation expectations rose.

**Historical Example**:
- **2021**: Supply shocks raised inflation and inflation expectations. Combined with $i = 0\%$, this created very negative real rates, fueling economic boom and asset price surge.

#### Experiment 2: Increase in Credit Spread ($x \uparrow$)

**Scenario**: Financial crisis, bank failures, or panic increases perceived default risk.

**Effects**:
1. Real borrowing cost rises: $r^f = i - \pi^e + x \uparrow$.
2. IS curve shifts **LEFT**.
3. Output falls: $Y \downarrow$.
4. (If Fed accommodates, $i$ unchanged, but this isn't enough.)

**Intuition**: This acts like a **contractionary monetary policy shock**, even though the Fed didn't raise rates. The effective borrowing cost for firms increased due to credit market disruption.

**Historical Example**:
- **2008**: Credit spreads exploded ($x \uparrow$ by ~20 percentage points for high-yield). This was a massive contractionary shock, overwhelming the Fed's attempts to cut $i$.

#### Experiment 3: Fed Response to Credit Spread Shock

**Scenario**: Credit spread rises ($x \uparrow$), and Fed attempts to offset by cutting $i$.

**Initial Shock**:
- $x \uparrow$ shifts IS left.
- Output would fall significantly.

**Policy Response**:
- Fed cuts $i$ (LM shifts down).
- This shifts IS back to the right (partially offsetting the $x$ shock).

**Outcome**:
- If Fed cuts $i$ by exactly $\Delta x$, then $r^f = (i - \Delta x) - \pi^e + (x + \Delta x) = i - \pi^e + x$ (unchanged).
- Investment unchanged, output unchanged.
- **Full offset is possible** if Fed can cut rates enough.

**Problem: Zero Lower Bound**:
- If $i$ is already near zero, Fed cannot cut further.
- $x$ shock cannot be fully offset.
- Economy falls into deep recession.

**Historical Example**:
- **2008-2009**: $x$ rose ~20 points, but Fed could only cut $i$ by ~5 points (from 5% to 0%). Net effect: Real borrowing costs rose, economy collapsed.

#### Experiment 4: Combined Shock (Great Recession)

**Scenario**: Simultaneous credit crisis and deflation fears.

**Shocks**:
1. Credit spread rises: $x \uparrow$ (say, +15 points).
2. Expected inflation falls: $\pi^e \downarrow$ (say, -6 points, from +2% to -4%).

**Effect on Real Borrowing Cost**:
$$\Delta r^f = \Delta i - \Delta \pi^e + \Delta x = 0 - (-6) + 15 = +21 \text{ percentage points}$$

Even with $i$ cut to zero, real borrowing costs increased by **21 percentage points**.

**IS-LM Diagram**:
- IS shifts massively **LEFT** (both $x \uparrow$ and $\pi^e \downarrow$ are contractionary).
- LM shifts down to zero (Fed's maximum response).
- New equilibrium: $Y$ much lower (deep recession).

**Policy Implication**: Conventional monetary policy (cutting $i$) is **insufficient**. Fed "out of ammunition" in conventional sense.

## 4. Unconventional Monetary Policy

### 4.1 The Problem
When $i$ hits the zero lower bound but the economy needs further stimulus, conventional monetary policy is exhausted. The Fed cannot cut $i$ below zero (or only marginally, due to cash hoarding).

**Constraint**:
$$i \geq 0$$

**But the economy needs**:
$$r^f = i - \pi^e + x \text{ to be very low}$$

**Options**:
1. Raise $\pi^e$ (inflation expectations).
2. Lower $x$ (credit spreads).

### 4.2 Large-Scale Asset Purchases (QE)

#### Quantitative Easing
**Definition**: Central bank purchases long-term government bonds and other assets (mortgages, corporate bonds) to directly influence long-term interest rates and risk premia.

**Traditional Monetary Policy**:
- Target: Very short-term Treasury rates (overnight Federal Funds Rate).
- Assets: Minimal holdings of short-term Treasuries.

**Quantitative Easing**:
- Target: Long-term Treasury yields, mortgage rates, corporate bond yields.
- Assets: Massive holdings of 10-year Treasuries, mortgage-backed securities (MBS), even corporate bonds.

**Mechanism**:
- Fed buys long-term bonds $\rightarrow$ Demand for bonds rises $\rightarrow$ Bond prices rise $\rightarrow$ Yields fall.
- For corporate bonds: Direct reduction in $x$ by increasing demand for risky assets.

#### Applications

**Great Recession (2008-2009)**:
- **QE1, QE2, QE3**: Fed purchased $3.5+ trillion in long-term Treasuries and MBS.
- **Effect**: Long-term Treasury yields fell from ~4% to ~2%. Mortgage rates fell from ~6% to ~3.5%.
- **Limited corporate bond purchases**: Focused on Treasuries and MBS.

**COVID-19 (2020)**:
- **Innovation**: Fed created facilities to purchase **corporate bonds** directly.
  - Primary Market Corporate Credit Facility (PMCCF).
  - Secondary Market Corporate Credit Facility (SMCCF).
- **Goal**: Directly target $x$ (credit spreads).
- **Effect**: Credit spreads fell sharply just from announcement (Fed barely used facilities).

**International Examples**:
- **Japan**: Bank of Japan purchases equities (ETFs) directly.
- **European Central Bank**: Bought corporate bonds, covered bonds.
- **Hong Kong (1997)**: Government directly purchased equities during Asian Financial Crisis.

### 4.3 Forward Guidance

#### Definition
**Forward Guidance**: Central bank communicates future policy intentions to influence expectations.

**Goal**: Raise expected inflation ($\pi^e$) or lower expected future interest rates.

#### Mechanism
If Fed commits to keeping $i = 0$ for an extended period (e.g., "through 2025"), then:
- Markets expect low rates to persist.
- Long-term rates fall (average of expected future short rates).
- Expected inflation may rise (persistent stimulus).
- Real rates fall: $r = i - \pi^e \downarrow$.

#### Challenges
- **Credibility**: Will Fed actually follow through, or change policy if conditions improve?
- **Time-inconsistency**: Fed may want to raise rates sooner if inflation rises unexpectedly.
- **Communication**: Markets must understand and believe the commitment.

**Historical Example**:
- **2012-2015**: Fed pledged to keep rates near zero until unemployment fell below 6.5% or inflation exceeded 2.5%. This helped keep long-term rates low and supported recovery.

### 4.4 Fiscal Policy as Complement

When monetary policy is constrained by the zero lower bound, **fiscal policy** becomes more important:

#### Automatic Stabilizers
- Unemployment insurance, progressive taxes, welfare programs.
- These cushion the fall in aggregate demand automatically.

#### Discretionary Fiscal Stimulus
- Increased government spending: Infrastructure, defense, transfers.
- Tax cuts: Rebates, payroll tax holidays.

**Example**:
- **2009**: American Recovery and Reinvestment Act ($800 billion stimulus).
- **2020-2021**: CARES Act, American Rescue Plan ($3+ trillion combined).

**Effectiveness**: Fiscal multiplier is **larger** at the zero lower bound because:
- Fed won't raise rates to offset (since already at zero).
- No "crowding out" via interest rate channel.

## 5. Summary and Key Takeaways

### Main Concepts

#### 1. Fisher Equation
$$r \approx i - \pi^e$$
- Real rate = Nominal rate - Expected inflation.
- Investment depends on $r$, not $i$.

#### 2. Credit Spreads
$$r^f = r + x$$
- Firms borrow at risky rate $r^f$, not safe rate $r$.
- Spread $x$ is countercyclical (high in recessions).

#### 3. Extended IS-LM
$$Y = C(Y - T) + I(Y, i - \pi^e + x) + G$$
- IS depends on $i$, $\pi^e$, and $x$.
- $\pi^e \uparrow$ or $x \downarrow$ shifts IS right (expansionary).
- $\pi^e \downarrow$ or $x \uparrow$ shifts IS left (contractionary).

### Historical Episodes

#### Great Recession (2008-2009)
- **Shocks**: $x \uparrow\uparrow$ (credit crisis), $\pi^e \downarrow\downarrow$ (deflation fears).
- **Policy**: Fed cut $i$ to zero, but $r^f = i - \pi^e + x$ remained high.
- **Result**: Deep recession, slow recovery.
- **Lesson**: Conventional monetary policy can become ineffective.

#### COVID-19 (2020-2021)
- **Initial shock**: $x \uparrow$ (panic), $\pi^e \downarrow$ (uncertainty).
- **Policy**: Fed cut $i$ to zero, launched corporate bond purchases.
- **Supply shock**: $\pi^e \uparrow\uparrow$ (bottlenecks, stimulus).
- **Result**: Real rates turned deeply negative ($r \approx -4\%$), fueling recovery and asset boom.

#### Recent Challenge (2022-2023)
- **Fed goal**: Raise $r$ to cool economy, fight inflation.
- **Problem**: Raising $i$ doesn't raise $r$ if $\pi^e$ rises simultaneously.
- **Breakthrough**: Jackson Hole speech (August 2022) lowered $\pi^e$, finally raising $r$.
- **Ongoing challenge**: Credit spreads remain low, limiting financial tightening.

### Policy Implications

#### For Monetary Policy
1. **Control nominal rate ($i$), not real rate ($r$)**: Real rate depends on inflation expectations (partially outside Fed control).
2. **Zero lower bound matters**: When $i \approx 0$, further easing requires unconventional tools.
3. **Credit conditions matter**: Fed may need to intervene in credit markets directly during financial crises.

#### For Financial Stability
1. **Monitor credit spreads**: Sharp widening signals financial stress, requires policy response.
2. **Prevent deflation**: Negative expected inflation amplifies recessions even if nominal rates are zero.
3. **Communication is powerful**: Fed's ability to shape expectations ($\pi^e$) is a key tool at zero bound.

### Looking Ahead
In upcoming lectures, we will:
- **Endogenize inflation**: How is $\pi$ (and $\pi^e$) determined? (Phillips Curve, expectations formation)
- **Long-run vs. short-run**: Reconciling price flexibility in long run with stickiness in short run.
- **Open economy**: How do these concepts extend to exchange rates and international capital flows?

## 6. Mathematical Appendix

### A. Exact Fisher Equation
Starting from:
$$(1 + r_t) = (1 + i_t) \frac{P_t}{P_{t+1}^e}$$

Define:
$$\pi_{t+1}^e = \frac{P_{t+1}^e - P_t}{P_t}$$

Then:
$$\frac{P_t}{P_{t+1}^e} = \frac{1}{1 + \pi_{t+1}^e}$$

Substitute:
$$(1 + r_t) = \frac{1 + i_t}{1 + \pi_{t+1}^e}$$

Expand:
$$1 + r_t = \frac{1 + i_t}{1 + \pi_{t+1}^e} \approx (1 + i_t)(1 - \pi_{t+1}^e) = 1 + i_t - \pi_{t+1}^e - i_t \pi_{t+1}^e$$

For small $i_t$ and $\pi_{t+1}^e$, drop the product term $i_t \pi_{t+1}^e$:
$$r_t \approx i_t - \pi_{t+1}^e$$

**Error**: The approximation error is $i_t \pi_{t+1}^e$. For $i_t = 5\%$ and $\pi_{t+1}^e = 3\%$, the error is $0.05 \times 0.03 = 0.15\%$ (negligible).

### B. Credit Spread Derivation (With Recovery)

More generally, assume recovery rate $\theta$ (fraction of principal recovered in default).

**Expected return on risky bond**:
$$(1 - p)(1 + r^f) + p(1 + \theta) = (1 + r)$$

Solve for $r^f$:
$$(1 - p)(1 + r^f) = (1 + r) - p(1 + \theta)$$

$$1 + r^f = \frac{(1 + r) - p(1 + \theta)}{1 - p}$$

$$r^f = \frac{(1 + r) - p(1 + \theta) - (1 - p)}{1 - p} = \frac{r - p\theta}{1 - p}$$

Credit spread:
$$x = r^f - r = \frac{r - p\theta}{1 - p} - r = \frac{r - p\theta - r(1 - p)}{1 - p} = \frac{rp - p\theta}{1 - p} = \frac{p(r - \theta)}{1 - p}$$

**Special cases**:
- $\theta = 0$ (zero recovery): $x = \frac{pr}{1 - p} \approx pr \approx p$ (for small $p$).
- $\theta = -1$ (lose principal): $x = \frac{p(r + 1)}{1 - p}$ (larger spread).

### C. IS Curve with Extensions (Formal)

**Goods market equilibrium**:
$$Y = C(Y - T) + I(Y, r^f) + G$$

**Investment function** (linear approximation):
$$I = \bar{I} - b(r^f - \bar{r})$$
where $b > 0$ is the interest sensitivity of investment.

**Real borrowing cost**:
$$r^f = i - \pi^e + x$$

**Substitute**:
$$I = \bar{I} - b(i - \pi^e + x - \bar{r})$$

**Full equilibrium**:
$$Y = C(Y - T) + \bar{I} - b(i - \pi^e + x - \bar{r}) + G$$

**Solve for IS curve**:
$$Y = \frac{1}{1 - c_1}\left[\bar{C} - c_1 T + \bar{I} - b(i - \pi^e + x - \bar{r}) + G\right]$$

**Comparative statics**:
- $\frac{dY}{di} = -\frac{b}{1 - c_1} < 0$ (downward sloping IS).
- $\frac{dY}{d\pi^e} = \frac{b}{1 - c_1} > 0$ (higher expected inflation shifts IS right).
- $\frac{dY}{dx} = -\frac{b}{1 - c_1} < 0$ (higher credit spread shifts IS left).

**Note**: Effects of $i$, $\pi^e$, and $x$ on output are symmetric (enter as $i - \pi^e + x$). A 1 percentage point increase in $x$ has the same effect as a 1 percentage point decrease in $\pi^e$ or a 1 percentage point increase in $i$.
