# Lecture 4: Financial Markets and Interest Rate Determination

## Overview
This lecture introduces financial markets and explains how the central bank (Federal Reserve) determines interest rates. We develop a simple model with two assets—money and bonds—to understand the portfolio decision households face. The equilibrium interest rate is determined by money supply (controlled by the Fed) and money demand (determined by nominal income and interest rates). We explore **open market operations** (buying/selling bonds) as the mechanism through which the Fed controls interest rates, and introduce the role of banks and the **Federal Funds Rate**.

**Context**: The Fed is aggressively hiking interest rates (2022-2023) to fight inflation. Understanding how interest rates are determined is essential for understanding monetary policy.

## 1. Why Study Financial Markets?

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
- **Policy Response**: Fed raising interest rates aggressively (0% → 5% in ~18 months).
- **Mechanism**: Fed **reducing** money supply → Interest rates **rising**.

## 7. Why Central Banks Don't Target Money Supply Anymore

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

**Money Demand**: $M^d = L($\$$Y, i$ (same as before).

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
    - 2022: 0% → 2% → 3% → 4% → 5% (seven consecutive hikes of 50-75 basis points).
- **Current Rate** (as of early 2023): ~5%.

**Key Insight**: Fed is "catching up" after being slow to respond to inflation (was "behind the curve" in 2021).

## 14. Summary

### Key Concepts

1. **Two Assets**: Money (liquid, zero return) vs. Bonds (illiquid, positive return).
2. **Money Demand**: $M^d = L($\$$Y, i$.
    - $\frac{\partial M^d}{\partial i} < 0$ (downward-sloping curve).
    - $\frac{\partial M^d}{\partial}$ \$$Y$ $> 0$ (shifts curve right).
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
