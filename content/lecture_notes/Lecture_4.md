# Lecture 4: Financial Markets and Interest Rate Determination

## Overview

```summary
- The whole financial system is reduced to two assets — money and bonds — and one decision: how much wealth to hold in each
- The equilibrium interest rate is set where the money supply, which the Fed controls, meets money demand, which nominal income and the interest rate determine
- **Open market operations** — the Fed buying and selling bonds — are the mechanism through which the rate is moved
- Banks and the **Federal Funds Rate** carry that same mechanism into the real world
- Context: the Fed is hiking aggressively (2022-2023) to fight inflation, so rate determination is a live question, not an abstraction
```
This lecture introduces financial markets and explains how the central bank (Federal Reserve) determines interest rates. We develop a simple model with two assets—money and bonds—to understand the portfolio decision households face. The equilibrium interest rate is determined by money supply (controlled by the Fed) and money demand (determined by nominal income and interest rates). We explore **open market operations** (buying/selling bonds) as the mechanism through which the Fed controls interest rates, and introduce the role of banks and the **Federal Funds Rate**.

**Context**: The Fed is aggressively hiking interest rates (2022-2023) to fight inflation. Understanding how interest rates are determined is essential for understanding monetary policy.

## 1. Why Study Financial Markets?

```summary
- **Two short-run tools**: fiscal policy, which is government spending and taxes, and monetary policy, which is the interest rate
- **Fiscal policy is direct** — the government buys goods and demand rises at once — but slow, because it needs Congressional approval
- **Monetary policy is indirect**: the central bank buys or sells bonds, rates change, and investment and consumption follow
- Monetary policy wins on speed: the FOMC can meet and move rates quickly
- The central bank can only buy and sell financial assets, never goods, so the real economy is reached only through financial markets
```

### Monetary Policy: The Fastest Policy Tool

**Two Main Short-Run Policy Tools**:
1. **Fiscal Policy** (Lecture 3): Government spending ($G$) and taxes ($T$).
    - **Direct Effect**: Government buys goods → Increases aggregate demand directly.
    - **Drawback**: Slow—requires Congressional approval.
2. **Monetary Policy** (This Lecture): Interest rates controlled by the central bank.
    - **Indirect Effect**: Central bank buys/sells bonds → Changes interest rates → Affects investment and consumption.
    - **Advantage**: Fast and nimble—Federal Open Market Committee (FOMC) can meet and change rates quickly.

**Key Insight**: Monetary policy is **faster** than fiscal policy, but **more indirect** (must go through financial markets).

### Monetary Policy Works Through Financial Markets

**The Central Bank's Challenge**:
- **Mandate**: Stabilize output, avoid recessions, maintain price stability (goods market objectives).
- **Tools**: Can only buy/sell financial assets (bonds), not goods.
    - **Cannot** go out and buy hamburgers to increase demand (fiscal policy can).
    - **Can** buy bonds, which affects interest rates, which then affects investment and consumption.

**Implication**: Understanding monetary policy requires understanding **financial markets**.

## 2. The Federal Reserve System

```summary
- **Board of Governors**: 7 members in Washington, D.C., nominated by the President and confirmed by the Senate, one of whom is the Chair
- **12 regional Federal Reserve Banks** cover the country; the Boston Fed's is the building made of recycled aluminum
- The **FOMC** sets the policy interest rate, the Federal Funds Rate
- Voting members: the 7 governors, the New York Fed president, and 4 rotating regional bank presidents
- New York's president is a permanent voter because New York is the financial heart of the US — the Fed communicates with markets and executes open market operations through it
- Central banking is an academic pipeline: Chair Powell and Bank of Japan Governor Ueda sit in post, and MIT PhD alumni now hold the Fed, the ECB, the Bank of Israel and the Reserve Bank of Australia
```

### Key Figures

#### Jerome Powell
- **Role**: Chair of the Federal Reserve (2018-present).
- **Significance**: Most watched person in financial markets—his decisions determine interest rates.

#### Katsuo Ueda
- **Role**: Governor of the Bank of Japan (appointed 2023).
- **Background**: MIT PhD alumnus (Economics Department has produced many central bankers).

**MIT Econ PhD Alumni in Central Banking**:
- **Ben Bernanke**: Fed Chair during 2008 Financial Crisis.
- **Mario Draghi**: ECB President during European debt crisis ("Whatever it takes" speech).
- **Stanley Fischer**: Governor of Bank of Israel.
- **Philip Lowe**: Governor of Reserve Bank of Australia.

### Institutional Structure

#### Board of Governors
- **Location**: Washington, D.C.
- **Composition**: 7 members.
- **Appointment**: Nominated by the President, confirmed by the Senate.
- **Chair**: One of the 7 governors (currently Jerome Powell).

#### Regional Federal Reserve Banks
- **Number**: 12 banks across the US (e.g., Boston, New York, San Francisco).
- **Boston Fed**: Distinctive building made of recycled aluminum near the waterfront.

#### Federal Open Market Committee (FOMC)
- **Role**: Sets the **policy interest rate** (Federal Funds Rate).
- **Voting Members**:
    - **7 Governors** (permanent voters).
    - **President of New York Fed** (permanent voter, due to NY's role as financial center).
    - **4 Regional Bank Presidents** (rotating voters).

**Why NY Fed President Always Votes**: New York is the financial heart of the US—the NY Fed communicates with financial markets and executes open market operations.

## 3. A Simple Model of Financial Markets

```summary
- **Two assets only**: money ($M$), which pays zero interest ($i_M = 0$), and bonds ($B$), which pay a positive return
- Money buys liquidity and pays nothing; bonds earn a return but are illiquid, since a bond must be sold before it can be spent
- A one-year Treasury bill bought at 95 and repaid at 100 returns 5.3%
- **The portfolio decision**: how much wealth to hold as money against how much as bonds
- High rates make holding money expensive and push portfolios toward bonds; low rates make liquidity cheap and pull them back toward money
- The decision barely mattered at near-zero rates from 2008-2020; at around 5% in 2022-2023, giving up the return to hold cash is a real cost
- That decision is what creates a **demand for money that moves with the interest rate**
```

### Two Assets Only

We simplify the financial system to **two assets**:

#### 1. Money ($M$)
- **Characteristics**:
    - Used for **transactions** (buying goods/services).
    - Pays **zero interest** ($i_M = 0$).
- **Examples**: Cash (currency), checkable deposits (checking accounts).
- **Advantage**: Liquidity (can buy anything immediately).
- **Disadvantage**: No return.

#### 2. Bonds ($B$)
- **Characteristics**:
    - Pay **positive interest** ($i > 0$).
    - **Cannot** be used directly for transactions.
- **Example**: One-year US Treasury bill (buy for \$95, receive \$100 in one year → 5.3% return).
- **Advantage**: Earn return.
- **Disadvantage**: Illiquid (must sell bond to get cash for transactions).

**The Portfolio Decision**: How much wealth to hold in money vs. bonds?

### The Trade-Off

**Trade-Off**:
- **High interest rates** → High opportunity cost of holding money → Bias portfolio toward bonds.
- **Low interest rates** → Low opportunity cost of holding money → Bias portfolio toward money (liquidity convenience).

**Historical Context**:
- **2008-2020**: Interest rates near zero → Portfolio decision not very important (everyone held cash).
- **2022-2023**: Interest rates ~5% → Portfolio decision matters a lot (giving up 5% return by holding cash).

**Key Insight**: The portfolio decision creates a **demand for money** that depends on the interest rate.

## 4. Money Demand

```summary
- **Money demand $M^d$** is a liquidity preference function — Keynes's term — of nominal income and the interest rate
- The **interest rate moves you along the curve**: a higher rate raises the opportunity cost of holding money, so less money is held
- **Nominal income shifts the curve** right, so more money is held at every rate
- Nominal rather than real income, because money is denominated in dollars: doubling prices means doubling the money needed for the same real transactions
- Rising real output raises money demand too, through more transactions
- The diagram puts money on the horizontal axis and the interest rate on the vertical, so the curve slopes down
```

### Money Demand Function
$$M^d = L(\$Y, i)$$

**Notation**: $M^d$ = Money demand, $L$ = Liquidity preference function (Keynes's term).

### Determinants of Money Demand

#### 1. Interest Rate ($i$): Movement Along Curve

$$\frac{\partial M^d}{\partial i} < 0$$

**Interpretation**: Higher interest rates → Lower money demand.

**Why?**
- Higher $i$ → Higher opportunity cost of holding money → Hold less money, more bonds.
- Lower $i$ → Lower opportunity cost → Hold more money.

**Graphical Representation**: Downward-sloping money demand curve in ($M$, $i$) space.

#### 2. Nominal Income (\$$Y = P \times Y$): Shifts Curve

$$\frac{\partial M^d}{\partial \$Y} > 0$$

**Interpretation**: Higher nominal income → Higher money demand (curve shifts right).

**Why Use Nominal (Not Real) Income?**

**Example 1** (Real output increases, prices fixed):
- Real GDP $\uparrow$ → More transactions → Need more money.

**Example 2** (Prices double, real output fixed):
- Same real transactions, but prices 2x higher → Need 2x more dollars to conduct same transactions.

**Conclusion**: Money demand depends on **nominal** income (\$$Y = P \times Y$), not just real income ($Y$), because money is denominated in **dollars**.

### Money Demand Diagram

- **Axes**: Money ($M$) on horizontal, Interest rate ($i$) on vertical.
- **Curve**: Downward-sloping (higher $i$ → lower $M^d$).
- **Shifts**: \$$\uparrow Y$ shifts curve **right** (for any given $i$, demand more money).

## 5. Equilibrium Interest Rate (Simple Model: No Banks)

```summary
- **The money supply is set exogenously** at a fixed level, and only the central bank may produce currency
- **Equilibrium is $M^s = M^d$**: a vertical supply line meeting a downward-sloping demand curve
- The intersection pins down the equilibrium interest rate
- The division of labour: the central bank chooses the quantity of money, the market chooses the rate that clears it
- Neither gets its way alone — the rate is the price that makes everyone's portfolio decision balance
```

### Money Supply

**Assumption**: Central bank controls money supply exogenously.
$$M^s = \bar{M}$$

**Key Point**: Only the central bank can produce currency (printing money is illegal for anyone else).

### Equilibrium Condition
$$M^s = M^d$$

**Graphical Representation**:
- **Money Supply**: Vertical line at $M = \bar{M}$ (independent of $i$).
- **Money Demand**: Downward-sloping curve.
- **Equilibrium**: Intersection determines the interest rate $i^*$.

**Key Insight**: The central bank sets $M$, and the market determines $i$ to equate supply and demand.

## 6. Monetary Policy: Changing the Interest Rate

```summary
- **Expansionary: up in money, down in the rate** — a larger supply leaves an excess supply of money at the old rate
- People restore balance by demanding more money, and they only do that once the rate falls
- **Contractionary: down in money, up in the rate** — a smaller supply leaves excess demand, and the rate must rise to shrink money demand back to it
- In both directions the rate moves until the market clears; the money supply is the instrument and the rate is the outcome
- The current tightening is the contractionary case: with inflation at 8%, the Fed has been shrinking the money supply, and the target has gone from 0.25% to 5.00% in the twelve months from March 2022
```

### Expansionary Monetary Policy ($\uparrow M$)

**Mechanism**:
1. Central bank **increases** money supply: $M$ shifts **right**.
2. At the old interest rate, **excess supply** of money (people holding more money than they want).
3. To restore equilibrium, people must **demand** more money.
4. When do people demand more money? When $i \downarrow$ (lower opportunity cost).
5. **Result**: Interest rate **falls** to new equilibrium.

**Summary**: $\uparrow M$ → $\downarrow i$ (Expansionary).

### Contractionary Monetary Policy ($\downarrow M$)

**Mechanism**:
1. Central bank **decreases** money supply: $M$ shifts **left**.
2. At the old interest rate, **excess demand** for money.
3. Interest rate must **rise** to reduce money demand back to the (now lower) supply.

**Summary**: $\downarrow M$ → $\uparrow i$ (Contractionary).

### Current Policy (2022-2023): Hiking Rates

- **Context**: Inflation at 8% (far above 2% target).
- **Policy Response**: Fed raising interest rates aggressively (0.25% → 5.00% between March 2022 and March 2023).
- **Mechanism**: Fed **reducing** money supply → Interest rates **rising**.

## 7. Why Central Banks Don't Target Money Supply Anymore

```summary
- **Pre-1980s practice**: central banks targeted a monetary aggregate, set the money supply, and let the market settle the rate
- Money demand shifts constantly — predictably, for holidays, weekends and the Super Bowl, and unpredictably, for payment technology and the Y2K cash withdrawals of 1999-2000
- With the money supply pinned, a demand curve that keeps shifting means a rate that fluctuates wildly; Super Bowl weekend alone sends it spiking
- **Volatile rates are costly**: firms cannot plan investment, households cannot plan borrowing
- **Modern practice**: announce the rate — "we're setting the interest rate at 5%" — and adjust the money supply continuously behind it to hold the target as demand shifts
- The money supply change is never announced: "cutting rates by 50 basis points" is a rate announcement, and the supply is the silent adjustment behind it
```

### Historical Practice (Pre-1980s)

**Old Approach**: Central banks targeted **monetary aggregates** ($M$).
- Set $M = \bar{M}$.
- Let market determine $i$.

### The Problem: Volatile Interest Rates

**Issue**: Money demand shifts frequently due to:
- **Predictable Factors**: Holidays, weekends, Super Bowl (people buy more goods → need more cash).
- **Unpredictable Factors**: Financial innovations, payment technology changes.
- **Example**: Y2K panic (1999-2000)—people withdrew cash fearing ATMs would fail → Huge spike in money demand.

**Result**: If $M$ is fixed and $M^d$ shifts frequently → $i$ fluctuates wildly.
- **Example**: Super Bowl weekend → $M^d \uparrow$ → At fixed $M$, $i$ spikes.

**Key Insight**: Volatile interest rates are disruptive (firms can't plan investment, households can't plan borrowing).

### Modern Practice (Post-1980s)

**New Approach**: Central banks target **interest rates** ($i$), not money supply.
- Fed announces: "We're setting the interest rate at 5%."
- Fed adjusts $M$ continuously to keep $i$ at target (even as $M^d$ shifts).

**Advantage**: Stable interest rates, even though money demand fluctuates.

**Key Insight**: When the Fed says "We're cutting rates by 50 basis points," they're implicitly increasing the money supply, but they don't announce the money supply change.

## 8. Shifts in Money Demand: Why Central Banks Must Be Active

```summary
- In a typical year, about 2% inflation and about 2% real growth together lift nominal income by roughly 4%
- Higher nominal income shifts money demand right by about the same 4%
- So holding the interest rate at its target requires growing the money supply by about 4% every year
- Fail to accommodate that and the rate rises on its own — a contractionary tightening nobody chose
- Even a central bank with the single aim of a constant rate has to be active, expanding the money supply continuously
```

### Nominal Income Growth → Rightward Shift in $M^d$

**Typical Year**:
- **Inflation**: ~2% → $P \uparrow$ → \$$Y \uparrow$.
- **Real Growth**: ~2% → $Y \uparrow$ → \$$Y \uparrow$.
- **Combined**: Nominal income grows ~4% → $M^d$ shifts **right** by ~4%.

**Implication**: If Fed wants to **maintain** the interest rate at $i^*$:
- Must **increase** $M$ by ~4% to accommodate higher money demand.
- **Failure to do so** → Interest rate rises unintentionally (contractionary).

**Key Insight**: Even to maintain a constant interest rate, the central bank must continuously expand the money supply to match growth in nominal income and money demand.

## 9. Open Market Operations: How the Fed Changes Money Supply

```summary
- **Open market operations** are the central bank's purchases and sales of bonds in the public bond market, not directly from the Treasury
- "Open" because anyone can trade there — the operations are transparent
- **Expansionary**: the Fed buys bonds and pays by creating money, so the public holds more money and fewer bonds, and the rate falls
- **Contractionary**: the Fed sells bonds, the public pays with money that leaves circulation, and the rate rises
- On the central bank's balance sheet, an expansion adds a million dollars of bonds to assets and a million dollars of money to liabilities — both sides grow
- The size of the balance sheet is a record of accumulated policy: about 1 trillion dollars before 2008, about 9 trillion by 2022 after the crisis and COVID
```

### What Are Open Market Operations?

**Definition**: Purchases or sales of bonds by the central bank in the **open market** (public bond market, not directly from the Treasury).

**Why "Open Market"?** Operations occur in public markets where anyone can trade (transparency).

### Expansionary Open Market Operation

**Goal**: Increase money supply → Lower interest rate.

**Mechanism**:
1. Fed **buys bonds** from the public (financial institutions, households).
2. Fed pays for bonds by **creating money** (printing currency or crediting bank reserves).
3. Public now holds **more money**, **fewer bonds**.
4. Money supply $\uparrow$ → Interest rate $\downarrow$.

**Analogy**: Fed goes to the bond market with a "big bag of cash" and buys bonds.

### Contractionary Open Market Operation

**Goal**: Decrease money supply → Raise interest rate.

**Mechanism**:
1. Fed **sells bonds** to the public.
2. Public pays for bonds with money.
3. Fed **removes money** from circulation (destroys it).
4. Money supply $\downarrow$ → Interest rate $\uparrow$.

### Central Bank Balance Sheet

**Assets**: Bonds (Treasury securities).

**Liabilities**: Money (currency issued).

**Expansionary Operation** ($1 million example):
- **Assets**: Bonds $\uparrow$ by $1 million.
- **Liabilities**: Money $\uparrow$ by $1 million.
- **Result**: Balance sheet **expands** (both sides grow by $1 million).

**Historical Context**:
- **Pre-2008**: Fed balance sheet ~$1 trillion (small).
- **Post-2008**: Global Financial Crisis + COVID-19 → Massive expansionary operations → Balance sheet ~$9 trillion (2022).

**Key Insight**: The size of the central bank's balance sheet reflects cumulative expansionary policy (buying bonds to fight recessions).

## 10. Bond Prices and Interest Rates: The Inverse Relationship

```summary
- A one-year zero-coupon bond bought for price $P_B$ and repaid at 100 earns $i = (100 - P_B) / P_B$
- Bought at 95 that return is 5.3 per cent; bought at 100 it is nothing at all
- So bond prices and interest rates are inversely related — a higher price is a lower rate
- **Expansionary policy through this lens**: the Fed's demand for bonds raises their prices, and higher prices lower the rate
- **Contractionary policy**: bond sales flood the market, prices fall, and the rate rises
- This is a second route to the same result as open market operations — the Fed moves bond prices, and prices move the rate mechanically
```

### Bond Pricing Formula

**Setup**: One-year zero-coupon bond.
- **Today**: Buy bond for price $P_B$.
- **One year from now**: Receive $100 (face value).

**Interest Rate** (return on bond):
$$i = \frac{100 - P_B}{P_B}$$

**Example 1** (Price = $95):
$$i = \frac{100 - 95}{95} = \frac{5}{95} \approx 5.3\%$$

**Example 2** (Price = $100):
$$i = \frac{100 - 100}{100} = 0\%$$

**Inverse Relationship**:
$$\frac{\partial i}{\partial P_B} < 0$$

- **Higher bond price** → **Lower interest rate**.
- **Lower bond price** → **Higher interest rate**.

### Open Market Operations and Bond Prices

**Expansionary Policy** (Fed buys bonds):
1. Fed enters bond market with huge demand for bonds.
2. Demand for bonds $\uparrow$ → Bond prices $\uparrow$ (basic supply-demand).
3. Bond prices $\uparrow$ → Interest rates $\downarrow$ (inverse relationship).

**Contractionary Policy** (Fed sells bonds):
1. Fed floods bond market with supply of bonds.
2. Supply of bonds $\uparrow$ → Bond prices $\downarrow$.
3. Bond prices $\downarrow$ → Interest rates $\uparrow$.

**Key Insight**: Another way to understand open market operations—Fed directly affects bond prices, which mechanically affects interest rates.

## 11. The Role of Banks: Introducing Realism

```summary
- **Banks are intermediaries** between households and the central bank: they create money through checkable deposits, and they hold reserves at the Fed
- Deposits are money to a household but a **liability** to the bank that owes them — one instrument, two roles
- The Fed's liabilities are currency and reserves, so **$H$ = currency + reserves** is high-powered money, the part the Fed controls directly
- **Total money $M$** is currency plus checkable deposits, so $M > H$: the difference is money the banks created
- A reserve requirement of $\theta$ means a bank parks that fraction of deposits at the Fed — at $\theta = 0.1$, 100 dollars of deposits requires 10 in reserves, held so withdrawals can be met
- Drop currency and reserve demand is the requirement times money demand, so demand for high-powered money is the same liquidity preference scaled by $\theta$
- Equilibrium therefore runs through the **reserve market**, and dividing $H^s$ by $\theta$ lands back on the same curve — the rate is set exactly as in the simple model
```

### Why Add Banks to the Model?

**In Reality**: Financial system has intermediaries (banks) between households and the central bank.

**Two Key Roles of Banks**:
1. **Create money**: Checkable deposits (checking accounts) are money—you can write checks, use debit cards.
2. **Hold reserves**: Banks deposit a fraction of their deposits at the central bank (called **reserves**).

### Bank Balance Sheets

**Assets**:
- **Loans**: Money lent to borrowers.
- **Bonds**: Government securities purchased.
- **Reserves**: Deposits at the central bank.

**Liabilities**:
- **Deposits**: Money owed to depositors (checkable accounts).

**Key Point**: Deposits are **money** for households (can use for transactions), but they're **liabilities** for banks.

### Central Bank Balance Sheet (With Banks)

**Assets**: Bonds (Treasury securities).

**Liabilities**:
- **Currency**: Cash held by the public.
- **Reserves**: Deposits by banks at the central bank.

**Central Bank Money** (also called **High-Powered Money** or **Monetary Base**):
$$H = \text{Currency} + \text{Reserves}$$

**Key Distinction**:
- **Central Bank Money** ($H$): Currency + Reserves—directly controlled by the Fed.
- **Total Money** ($M$): Currency + Checkable Deposits—includes money created by banks.

**Relationship**: $M > H$ (banks create additional money through deposits).

### Reserve Requirements

**Definition**: Banks must hold a **fraction** ($\theta$) of their deposits as reserves at the central bank.
- **Example**: $\theta = 0.1$ (10%) → For every \$100 in deposits, bank must hold \$10 in reserves.

**Purpose**: Regulatory requirement—ensures banks have liquidity to meet withdrawal demands.

### Money Demand and Reserve Demand

**Assumption** (Simplified): No one holds currency—all money is in checking accounts.

**Money Demand** (same as before):

$$
M^d = L(\$Y, i)
$$

**Reserve Demand**: Banks demand reserves to back deposits.
$$R^d = \theta \times M^d$$

**Example**: If \$$M^d = 1,000 \text{ billion}$ and $\theta = 0.1$:
$$R^d = 0.1 \times \$1,000 \text{B} = \$100 \text{ billion}$$

**Demand for Central Bank Money**:
$$H^d = \theta \times M^d = \theta \times L(\$Y, i)$$

### Equilibrium with Banks

**Money Market Equilibrium** (as before):
$$M^s = M^d$$

**Reserve Market Equilibrium** (new):
$$H^s = H^d = \theta \times M^d$$

**Central Bank Control**: Fed controls $H^s$ (high-powered money supply).

**Solving for Interest Rate**:
$$H^s = \theta \times L(\$Y, i)$$

Rearrange:
$$\frac{H^s}{\theta} = L(\$Y, i)$$

**Result**: Same downward-sloping money demand curve, but scaled by $\theta$.

**Key Insight**: The mechanism is **identical** to the simple model—equilibrium in the **reserve market** (not the full money market) determines the interest rate.

## 12. The Federal Funds Rate

```summary
- **The Federal Funds Rate** is the interest rate in the overnight market where banks lend reserves to one another
- Banks short of their requirement borrow overnight from banks holding excess reserves
- The market runs every night at very large volume, which is what makes it the anchor rate
- **The Fed targets the rate, it does not set it**: if it drifts above target the Fed injects reserves by buying bonds, and if below it drains them by selling
- A worked example: a bank with 10 million in deposits, needing 1 million in reserves but holding 0.8, borrows the missing 0.2 overnight at the funds rate
- **Transmission**: Treasury bills at 3-month and 1-year move closely with it, corporate bonds move in tandem at a higher level, and mortgages follow longer-term Treasuries
- So the Fed controls one overnight rate and influences the whole **term structure** only indirectly
```

### Definition

**Federal Funds Rate**: The interest rate in the **market for reserves** (market where banks lend reserves to each other overnight).

**Why This Market Matters**:
- Banks that are **short on reserves** (below required $\theta \times \text{Deposits}$) borrow from banks with **excess reserves**.
- This overnight lending market is active every night (huge volume of transactions).

**Example**:
- Bank A has \$10 million in deposits, needs \$1 million in reserves ($\theta = 0.1$), but only has \$0.8 million → **Borrows** \$0.2 million overnight.
- Bank B has excess reserves → **Lends** $0.2 million to Bank A at the Federal Funds Rate.

### Fed's Control Over the Federal Funds Rate

**Mechanism**:
1. Fed **targets** a specific Federal Funds Rate (e.g., 5.00%-5.25% range).
2. If **rate rises above target**: Banks need more reserves → Fed **injects reserves** (buys bonds) → Rate falls back to target.
3. If **rate falls below target**: Too many reserves in system → Fed **drains reserves** (sells bonds) → Rate rises back to target.

**Key Insight**: The Fed doesn't directly "set" the rate—it **targets** the rate and adjusts $H^s$ (reserve supply) continuously to hit the target.

### Federal Funds Rate vs. Other Interest Rates

**Direct Control**: Fed controls the **Federal Funds Rate** (overnight rate in reserve market).

**Indirect Effect**: Federal Funds Rate affects **other interest rates** in the economy (transmission mechanism):
- **Treasury Bills** (3-month, 1-year): Move closely with Fed Funds Rate.
- **Corporate Bonds**: Higher rates, but move in tandem.
- **Mortgage Rates**: Influenced by longer-term Treasury rates.

**Key Insight**: By controlling the Federal Funds Rate, the Fed indirectly influences the entire **term structure** of interest rates.

## 13. Recent History: Federal Funds Rate (2019-2023)

```summary
- **2019**: the rate sat around 2.5%, the tail of the 2015-2018 hiking cycle just before cuts began
- **March 2020**: the Fed cut to 0-0.25% after output collapsed and unemployment hit 14.7%, and held there for about two years
- **The zero lower bound**: a negative rate pays less than cash under the mattress, so nobody would hold bonds, money demand goes effectively infinite, and zero is the floor for nominal rates
- At that floor conventional monetary policy is exhausted — the constraint that binds in a deep recession
- **2021-2023**: inflation above 8% pulled the Fed into the fastest hiking pace since the 1980s, from 0.25% to 5.00% across nine hikes in the year from March 2022, four of them 25 basis points and two of them 100
- The Fed was behind the curve in 2021 and is still catching up
```

### Pre-COVID (2019)
- **Rate**: ~2.5%.
- **Context**: Fed had been hiking rates (2015-2018), then began cutting as economy slowed.

### COVID Shock (March 2020)
- **Action**: Fed cut rates to **0-0.25%** (effective zero).
- **Reason**: Massive economic shock—output collapsed, unemployment spiked to 14.7%.
- **Duration**: Rates remained at zero for ~2 years (2020-2022).

### Zero Lower Bound (ZLB)
**Why Can't Rates Go Below Zero?**
- If $i < 0$, bonds pay negative return.
- **Alternative**: Hold cash (pays 0%) under the mattress.
- **Result**: No one would hold bonds at $i < 0$ → Demand for money infinite.
- **Implication**: **Zero is the floor** for nominal interest rates (ZLB).

**Policy Constraint**: At ZLB, conventional monetary policy is exhausted (cannot cut rates further).

### Post-COVID Inflation (2021-2023)
- **Problem**: Inflation surged to 8%+ (far above 2% target).
- **Fed Response**: Aggressive rate hikes—**fastest pace since the 1980s**.
    - Seven hikes in 2022 alone took the target from 0.25% to 4.50%, in steps of 25, 25, 75, 100, 50, 100 and 50 basis points; two more 25-point hikes in early 2023 reached 5.00%.
- **Current Rate** (as of early 2023): ~5%.

**Key Insight**: Fed is "catching up" after being slow to respond to inflation (was "behind the curve" in 2021).

## 14. Summary

```summary
- Money is liquid but pays nothing; bonds pay a return but are not liquid, and that trade-off is what every rate in this lecture turns on
- Money demand falls with the interest rate and rises with nominal income, so equilibrium is $M^s = M^d$, or $H^s = H^d$ once banks are in the model
- **Expansionary** policy raises $M$ (or $H$) and lowers $i$; **contractionary** policy does the reverse, and open market operations are the instrument that does it
- **The Fed targets a rate, not a money supply**: it sets the funds rate by targeting it and letting high-powered money adjust, and the zero lower bound is where that approach runs out
- Next: fit the goods market and these financial markets together in the **IS-LM** model
```

### Key Concepts

1. **Two Assets**: Money (liquid, zero return) vs. Bonds (illiquid, positive return).
2. **Money Demand**: falls with the interest rate, rises with nominal income.
    - $\frac{\partial M^d}{\partial i} < 0$ (downward-sloping curve).
    - A rise in nominal income shifts the curve right.
3. **Equilibrium Interest Rate**: Determined by $M^s = M^d$ (or $H^s = H^d$ with banks).
4. **Monetary Policy**:
    - **Expansionary**: $\uparrow M$ (or $\uparrow H$) → $\downarrow i$.
    - **Contractionary**: $\downarrow M$ (or $\downarrow H$) → $\uparrow i$.
5. **Open Market Operations**: Fed buys/sells bonds to change money supply.
    - **Buy bonds** → Inject money → Lower interest rates.
    - **Sell bonds** → Remove money → Raise interest rates.
6. **Bond Prices and Interest Rates**: Inverse relationship.
    - $P_B \uparrow$ → $i \downarrow$.
    - Fed buying bonds raises bond prices → lowers interest rates.

### Institutional Details

1. **Federal Reserve System**:
    - **7 Governors** + **12 Regional Banks**.
    - **FOMC** sets policy (11 voting members).
2. **Federal Funds Rate**: Interest rate in the overnight reserve market—the rate the Fed targets.
3. **Central Bank Money** ($H$): Currency + Reserves—directly controlled by the Fed.
4. **Banks Create Money**: Checkable deposits expand money supply beyond $H$.
5. **Reserve Requirements**: Banks hold fraction $\theta$ of deposits as reserves.

### Key Insights

1. **Modern Monetary Policy**: Central banks target interest rates (not money supply) because money demand is too volatile.
2. **Zero Lower Bound**: Nominal interest rates cannot go below zero—major constraint during deep recessions.
3. **Transmission Through Financial Markets**: Monetary policy affects the real economy indirectly (through interest rates → investment/consumption).
4. **Fed's Current Challenge** (2023): Hiking rates aggressively to fight inflation, risking recession.

### Coming Up
- **Lecture 5**: Integrate financial markets (this lecture) with goods market (Lecture 3) → **IS-LM Model**.
- **Understand**: How does a change in interest rates (monetary policy) affect equilibrium output?

**Next**: The IS-LM model—the workhorse of short-run macroeconomics.
