# Lecture 11: The IS-LM-PC Model

## Overview
This lecture introduces the IS-LM-PC model, which integrates the IS-LM framework (short run) with the Phillips Curve (medium run). This unified model allows us to analyze not only the immediate impact of policies and shocks but also their dynamics over time, distinguishing between short-run and medium-run effects. It is the central workhorse model for understanding business cycle fluctuations and monetary policy.

## Current Events: The Collapse of Silicon Valley Bank (SVB)

### Background
On March 10, 2023, Silicon Valley Bank (SVB), the 16th largest bank in the US by asset size ($209 billion), was shut down by the FDIC following a classic bank run. This was the largest bank failure since Washington Mutual during the 2008 Global Financial Crisis.

### Causes of the Collapse

#### 1. Tech Sector Downturn
- SVB served primarily tech startups and venture-backed companies.
- As the tech sector struggled in 2022 (difficulty raising capital, falling valuations), companies began withdrawing deposits to fund operations.
- Net deposit outflows accelerated throughout 2022.

#### 2. Investment Strategy and Interest Rate Risk
- SVB grew rapidly during 2020-2021, doubling its asset size.
- Rather than making risky loans, SVB invested heavily in long-term (10-year) Treasury bonds.
- **Problem**: These bonds were purchased when interest rates were near zero.
- When the Fed began aggressive rate hikes in 2022, bond prices fell sharply (inverse relationship between yields and prices).
- **Unrealized Losses**: SVB held approximately $80 billion in securities with significant unrealized losses.

#### 3. Accounting Rules and Liquidity Crisis
- Banks need not recognize losses on securities held to maturity (unless sold).
- As deposit withdrawals continued, SVB needed liquidity.
- Forced to sell securities, SVB realized $1.8 billion in losses.
- CEO announced need to raise $2.25 billion in new equity to cover the losses.

#### 4. Bank Run Dynamics
- News of capital raising spread rapidly via social media and venture capital networks.
- **Coordination Failure**: Each depositor rational to withdraw, but collective action caused failure.
- **Uninsured Deposits**: Approximately 95% of SVB deposits exceeded FDIC insurance limit ($250,000).
    - Most banks have majority of deposits insured (small savers).
    - SVB concentrated in large business accounts.
- Attempted withdrawals exceeded $42 billion in single day (Thursday, March 9).

#### 5. Venture Capital Amplification
- VC firms, seeing trouble, instructed all portfolio companies to withdraw immediately.
- Created self-fulfilling prophecy: fear of failure caused the failure.

### Policy Response

#### Weekend Emergency Measures
1. **Full Deposit Guarantee**: FDIC invoked "systemic risk exception" to guarantee all deposits (not just under $250k).
    - Protected small businesses using SVB for payroll.
    - Prevented contagion to other regional banks.

2. **Bank Term Funding Program (BTFP)**:
    - Fed created new facility allowing banks to pledge securities at par value (not market value) for loans.
    - Removed need for fire sales of depreciated bonds.
    - Addressed the specific vulnerability that brought down SVB.

### Macro Connections to Course Material

#### Risk Premium ($x$) and the Expanded IS-LM Model
- **Credit Spreads Spike**: Banking sector stress increased borrowing costs for private sector.
- From Lecture 7: Increase in $x$ shifts IS curve left (contractionary).
    - Higher $x$ $\Rightarrow$ Higher cost of borrowing for firms $\Rightarrow$ Lower investment $\Rightarrow$ Lower aggregate demand.
- **Fed Response**: When $x$ rises exogenously, Fed can offset by lowering policy rate.
    - Maintains total borrowing cost ($i + x$) constant.

#### Market Expectations of Fed Policy
- Before SVB crisis: Markets expected 50 basis point hike at March 22 meeting.
    - Economic data coming in "hot" (strong labor market, inflation picking up again).
    - Expected value of next hike exceeded 40 basis points.
- After SVB crisis: Expected value collapsed to 15 basis points.
    - About 50% probability of 25bp hike.
    - About 50% probability of pause (0bp).
- **Reasoning**: Financial stability concerns dominate inflation concerns.
    - Something "broke" from aggressive tightening.
    - Fed may need to slow or pause hiking cycle.

#### Regulatory Failures and Lessons
1. **Dodd-Frank Rollback (2018)**:
    - Originally, banks above $50 billion subject to strict stress tests.
    - Threshold raised to $250 billion (SVB lobbied for this).
    - SVB fell just below new threshold ($209B), avoiding stringent oversight.

2. **Concentration Risk**:
    - Single sector exposure (tech) in deposits.
    - Single sector exposure (long-term Treasuries) in assets.
    - No diversification in funding sources.

3. **Interest Rate Risk Management**:
    - Failure to hedge duration risk during period of rising rates.
    - Regulator (San Francisco Fed) apparently missed this vulnerability.

4. **Speed of Modern Bank Runs**:
    - Digital banking + social media = runs happen in hours, not days.
    - Traditional regulatory response too slow.

## The IS-LM-PC Model: Structure and Components

### 1. Motivation for the Model

#### What IS-LM Tells Us (Short Run)
- Determines equilibrium output ($Y$) given monetary and fiscal policy.
- Assumes prices fixed in the short run.
- Cannot address: What happens to inflation? How do things evolve over time?

#### What the Phillips Curve Adds (Medium Run)
- Links output to inflation dynamics.
- Shows how economy adjusts from short-run equilibrium to medium-run equilibrium.
- Allows analysis of disinflation, overheating, and stabilization policies.

### 2. The Three Components

#### IS Curve (Goods Market Equilibrium)
- **Equation**: $Y = C(Y - T) + I(Y, r) + G$
- **Key Change**: Now expressed in terms of **real interest rate** ($r$), not nominal rate ($i$).
- **Interpretation**: Higher real rate $\Rightarrow$ Lower investment $\Rightarrow$ Lower output.
- **Graphical Representation**: Downward sloping in $(r, Y)$ space.

#### LM Curve (Monetary Policy Rule)
- **Modern Specification**: $r = \bar{r}$
- **Interpretation**: Central bank sets the real interest rate directly.
    - In practice, Fed sets nominal rate ($i$) and adjusts for expected inflation ($\pi^e$).
    - Assuming Fed can control $r$: $r = i - \pi^e$.
    - Most of the time (away from zero lower bound), Fed can achieve any desired $r$.
- **Graphical Representation**: Horizontal line in $(r, Y)$ space.

#### Phillips Curve (Inflation Dynamics)
- **Original Form** (unemployment): $\pi_t - \pi^e_t = -\alpha (u_t - u_n)$
    - Inflation exceeds expectations when unemployment below natural rate.
- **Transformed to Output Form**:
    - Start with production function: $Y = N$ (output equals employment).
    - Employment: $N = L(1 - u)$ where $L$ is labor force.
    - Potential output: $Y_n = L(1 - u_n)$
    - **Output gap**: $Y - Y_n = -L(u - u_n)$
    - Therefore: $u - u_n = -(Y - Y_n)/L$

- **Phillips Curve in Output Space**:
$$\pi_t - \pi^e_t = \lambda(Y_t - Y_n)$$
where $\lambda = \alpha / L$.

- **Interpretation**:
    - $Y > Y_n$ (positive output gap) $\Rightarrow$ $\pi > \pi^e$ (inflation rises).
    - $Y < Y_n$ (negative output gap) $\Rightarrow$ $\pi < \pi^e$ (inflation falls).
    - $Y = Y_n$ $\Rightarrow$ $\pi = \pi^e$ (inflation stable).

- **Graphical Representation**: Upward sloping in $(Y, \pi)$ space.
    - Why upward? Higher output $\Rightarrow$ Lower unemployment $\Rightarrow$ Wage pressure $\Rightarrow$ Price pressure $\Rightarrow$ Higher inflation.

### 3. The Natural Rate of Interest ($r_n$ or $r^*$)

#### Definition
The **natural rate of interest** (also called neutral rate, Wicksellian rate, or $r^*$) is the real interest rate that equates output with potential output:
$$Y(r_n) = Y_n$$

- Defined **implicitly** by solving the IS equation with $Y = Y_n$.
- $r_n$ is the rate at which goods market clears at full employment.

#### Interpretation
- If Fed sets $r = r_n$: Output remains at potential, inflation stable.
- If Fed sets $r < r_n$: Output exceeds potential, inflation rises (economy overheats).
- If Fed sets $r > r_n$: Output falls below potential, inflation falls (economy cools).

#### Determinants of $r_n$
$r_n$ is determined by real factors (not monetary policy):
1. **Productivity growth**: Higher trend growth $\Rightarrow$ Higher $r_n$ (more investment opportunities).
2. **Consumer preferences**: Higher desire to save $\Rightarrow$ Lower $r_n$ (excess saving).
3. **Fiscal policy**: Expansionary fiscal policy $\Rightarrow$ Higher $r_n$ (competes for resources).
4. **Demographics**: Aging population $\Rightarrow$ Higher saving $\Rightarrow$ Lower $r_n$.
5. **Investment opportunities**: Fewer profitable projects $\Rightarrow$ Lower $r_n$.

#### Why $r_n$ Matters for Policy
- Fed must estimate $r_n$ to determine appropriate policy stance.
- **Tight policy**: $r > r_n$ (contractionary).
- **Loose policy**: $r < r_n$ (expansionary).
- **Problem**: $r_n$ is unobservable and time-varying.

## The IS-LM-PC Model: Dynamics and Equilibrium

### 1. Short-Run Equilibrium

#### Determining Output
- **IS-LM intersection** determines output in the short run.
- Given Fed's choice of $\bar{r}$, output determined by IS curve: $Y = Y(\bar{r})$.
- **Nothing new here**: Same logic as standard IS-LM model.

#### Reading Inflation Pressure
- Once we know $Y$, Phillips Curve tells us inflation dynamics.
- Plot $(Y, \pi)$ on Phillips Curve diagram.
- **Three cases**:
    1. $Y > Y_n$: $\pi > \pi^e$ (inflation rising).
    2. $Y = Y_n$: $\pi = \pi^e$ (inflation stable).
    3. $Y < Y_n$: $\pi < \pi^e$ (inflation falling).

#### Example: Economy Overheating
- Suppose Fed sets $r$ too low: $\bar{r} < r_n$.
- IS-LM: Output determined at $Y_1 > Y_n$.
- Phillips Curve: $\pi_1 - \pi^e = \lambda(Y_1 - Y_n) > 0$.
- **Change in inflation**: $\Delta \pi = \pi_1 - \pi^e > 0$ (inflation accelerating).

### 2. Medium-Run Adjustment

#### The Problem with Persistent Gaps
- If $Y \neq Y_n$, inflation either rising or falling.
- **Central bank mandate**: Maintain price stability (typically 2% inflation target).
- Fed cannot tolerate persistent inflation changes.
- **Must act**: Adjust $r$ to bring output back to potential.

#### Adjustment Mechanism
1. **Initial position**: $r < r_n$, so $Y > Y_n$ and inflation rising.
2. **Fed observes** inflation exceeding target.
3. **Fed responds**: Hikes real interest rate ($\bar{r} \uparrow$).
4. **IS-LM**: Higher $r$ $\Rightarrow$ Lower $Y$ (movement along IS curve).
5. **Phillips Curve**: As $Y$ declines toward $Y_n$, rate of inflation increase slows.
6. **Process continues** until $r = r_n$ and $Y = Y_n$.
7. **Final outcome**: $\pi = \pi^e$ (inflation stable).

#### Graphical Representation
- **Top panel** (IS-LM space): Fed raises $\bar{r}$ from initial level up to $r_n$.
    - LM curve shifts up (higher horizontal line).
    - Output declines along IS curve from $Y_1$ to $Y_n$.
- **Bottom panel** (Phillips Curve space): Economy moves along PC curve.
    - As $Y$ falls, $\pi - \pi^e$ declines.
    - At $Y = Y_n$, $\pi = \pi^e$ (vertical line at $Y_n$).

### 3. Short Run vs. Medium Run: Key Distinctions

#### Short Run
- **Time horizon**: Weeks to months.
- **Determined by**: IS-LM (aggregate demand).
- **Variables determined**: Output ($Y$), real interest rate ($r$).
- **Monetary policy**: Fully effective in influencing output.
- **Prices**: Treated as sticky (not adjusting).

#### Medium Run
- **Time horizon**: Quarters to a few years.
- **Determined by**: Supply-side factors (labor market, potential output).
- **Variables determined**: Potential output ($Y_n$), natural rate of unemployment ($u_n$), natural real rate ($r_n$).
- **Monetary policy**: Neutral (affects only nominal variables).
- **Inflation**: Adjusts to bring economy to potential.

## The Role of Inflation Expectations

### 1. Two Models of Expectations

#### Adaptive Expectations: $\pi^e_t = \pi_{t-1}$
- Agents use last period's inflation to forecast future inflation.
- **Backward-looking**: Based on experience, not forward-looking analysis.
- **Implication**: If inflation rises, expectations rise next period.
- **Problem for central banks**: Creates inflation inertia.

#### Anchored Expectations: $\pi^e_t = \bar{\pi}$
- Agents believe central bank will hit its inflation target in medium run.
- **Forward-looking**: Based on credibility of monetary authority.
- **Implication**: Even if inflation temporarily deviates, expectations remain at target.
- **Benefit for central banks**: Easier to stabilize inflation.

### 2. Disinflation Under Different Expectations

#### Scenario: Economy with High Inflation
- Suppose $\pi = 9\%$ (as US experienced in 2022).
- Central bank wants to return to 2% target.
- How does expectation formation affect required policy?

#### Case 1: Anchored Expectations ($\pi^e = 2\%$)

**Policy Task**:
- Need to bring inflation from 9% down to 2%.
- Phillips Curve: $\pi - \pi^e = \lambda(Y - Y_n)$
- Currently: $9\% - 2\% = \lambda(Y - Y_n)$, so $Y > Y_n$ (positive gap).
- **Solution**: Raise $r$ until $Y = Y_n$.
    - At $Y = Y_n$: $\pi - \pi^e = 0$, so $\pi = 2\%$ (back to target).

**Outcome**:
- No recession required.
- Only need to eliminate output gap (slow growth to trend, not negative growth).
- If economy growing over time, just need below-trend growth for a period.

**Example**:
- Initial: $r = -1\%$, $r_n = 1\%$, $Y_1 > Y_n$, $\pi = 9\%$.
- Fed action: Raise $r$ from $-1\%$ to $1\%$ (200bp hike).
- Result: $Y$ falls to $Y_n$, $\pi$ stabilizes at $2\%$.
- No period of negative growth, just slower growth during adjustment.

#### Case 2: Adaptive Expectations ($\pi^e = \pi_{-1}$)

**Policy Task**:
- Initial: $\pi = 9\%$, so $\pi^e = 9\%$ next period.
- Phillips Curve becomes: $\pi - 9\% = \lambda(Y - Y_n)$.
- If Fed only raises $r$ to $r_n$: $Y = Y_n$ $\Rightarrow$ $\pi = 9\%$ (inflation stays high!).
- **Problem**: Inflation expectations now anchored at 9%, not 2%.

**Solution (Requires Recession)**:
- Need $\pi < \pi^e$ to bring expectations down.
- To get $\pi = 2\%$ when $\pi^e = 9\%$: $2\% - 9\% = \lambda(Y - Y_n)$.
- Requires: $Y < Y_n$ (negative output gap of -7%!).
- **Must raise $r$ well above $r_n$** to create recession.

**Multi-Period Process**:
- Period 1: Raise $r$ well above $r_n$, create $Y \ll Y_n$, $\pi$ falls to (say) 6%.
- Period 2: $\pi^e$ now 6%, continue tight policy, $\pi$ falls to 4%.
- Period 3: $\pi^e$ now 4%, continue tight policy, $\pi$ falls to 3%.
- Period 4: $\pi^e$ now 3%, continue tight policy, $\pi$ falls to 2%.
- Period 5: $\pi^e$ now 2%, can finally set $r = r_n$ and $Y = Y_n$.

**Outcome**:
- Deep, prolonged recession required.
- Multiple years of $Y < Y_n$ to "wring out" inflation expectations.
- High unemployment, significant output loss.

#### Historical Example: Volcker Disinflation (1980-82)
- Inflation peaked at 14% in 1980.
- Fed Chair Paul Volcker raised policy rate above 15%.
- Created severe recession (unemployment reached 10.8%).
- Took 3-4 years to bring inflation back to acceptable levels.
- Necessary because expectations had become unanchored in 1970s.

### 3. Why Central Banks Care About Credibility

#### The Inflation Target as Anchor
- Modern central banks announce explicit inflation targets (typically 2%).
- Constant communication about commitment to target.
- **Goal**: Keep $\pi^e = \bar{\pi} = 2\%$ at all times.

#### Benefits of Anchored Expectations
1. **Easier stabilization**: Can respond to shocks without causing deep recessions.
2. **Lower sacrifice ratio**: Less output lost per percentage point of disinflation.
3. **Automatic stabilizer**: If inflation rises temporarily, expected inflation doesn't follow, so real rates rise automatically (fiscal-like stabilization).
4. **Policy credibility**: Markets trust central bank, reducing need for extreme actions.

#### Risks of Losing Credibility
- If expectations become unanchored: $\pi^e = \pi_{-1}$.
- Creates inflation inertia, requires recessions to disinflate.
- Difficult to rebuild credibility once lost (see 1970s US experience).

#### Current Situation (2022-2023)
- US inflation peaked at 9% (June 2022).
- Fed raised rates from 0% to 5.25% (March 2023).
- **Key question**: Are expectations still anchored at 2%?
- **Evidence**: Survey-based expectations remain near 2% for medium term.
- **Implication**: If credibility holds, can return to 2% inflation without deep recession (requires only $Y \approx Y_n$, not $Y \ll Y_n$).

## The Neutrality of Money

### 1. Short Run vs. Medium Run

#### Short Run (IS-LM): Money is Not Neutral
- Monetary policy affects real variables: output ($Y$), employment ($N$), unemployment ($u$).
- Mechanism: Fed changes $r$ $\Rightarrow$ Investment changes $\Rightarrow$ Output changes.
- **Real effects**: Fed's actions have real consequences for production and employment.

#### Medium Run (Natural Rate): Money is Neutral
- Monetary policy does not affect real variables: $Y_n$, $u_n$, $r_n$.
- These determined by real factors:
    - Labor force ($L$), price-setting behavior, wage-setting behavior (for $u_n$).
    - Productivity, preferences, fiscal policy (for $r_n$).
- **Nominal effects only**: Fed determines average inflation ($\bar{\pi}$) and nominal interest rate ($i = r_n + \bar{\pi}$).

### 2. What Central Banks Can and Cannot Do

#### What Central Banks CAN Do (Short Run)
- Stabilize output around potential during shocks.
- Smooth business cycles (reduce volatility of $Y$ around $Y_n$).
- Example: Recession $\Rightarrow$ Lower $r$ $\Rightarrow$ Boost $Y$ back toward $Y_n$.

#### What Central Banks CANNOT Do (Medium Run)
- Permanently raise output above potential.
- Permanently lower unemployment below natural rate.
- Attempt to do so only causes accelerating inflation.
- **Trade-off**: In medium run, can only choose inflation rate, not output level.

#### Example: 1960s US Policy Mistake
- Policymakers believed they could maintain $u < u_n$ permanently.
- Kept monetary policy loose for extended period.
- Result: Rising inflation throughout late 1960s and 1970s.
- Eventually forced Volcker disinflation (painful recession).

### 3. Implications for Policy Design

#### Dual Mandate (Fed's Objectives)
1. **Price stability**: Keep inflation near 2% target.
2. **Maximum employment**: Keep output near potential ($Y \approx Y_n$).

**Interpretation**:
- Short run: Trade-off between objectives (can temporarily boost $Y$ above $Y_n$ at cost of higher inflation).
- Medium run: No trade-off (can only achieve price stability; employment determined by supply side).

#### Optimal Policy Strategy
1. Identify potential output ($Y_n$) and natural rate ($r_n$).
2. Set policy to keep output near potential: $r \approx r_n$.
3. Allow automatic adjustment: If shock pushes $Y$ away from $Y_n$, adjust $r$ to bring it back.
4. Maintain credibility: Keep $\pi^e$ anchored so adjustments don't require recessions.

## Current Macroeconomic Environment (2023)

### 1. The Post-COVID Inflation Surge

#### Origins (2020-2021)
- **Demand shock**: Massive fiscal stimulus (checks to households, expanded unemployment insurance).
- **Monetary accommodation**: Fed kept rates near zero through 2021.
- **Supply constraints**: COVID disruptions reduced potential output ($Y_n \downarrow$).
- **Result**: Large positive output gap ($Y \gg Y_n$), inflation rose from 2% to 9%.

#### Was Policy "Behind the Curve"?
- Fed kept $r < r_n$ for too long (through 2021).
- **Reasons**:
    1. Expected supply recovery: Thought $Y_n$ would bounce back quickly (didn't happen).
    2. Transitory narrative: Believed inflation was temporary (some supply-side, some base effects).
    3. Risk management: Scarred by 2010s experience of too-low inflation, wanted to "run economy hot."
- **Result**: By early 2022, clear that inflation was persistent and expectations at risk of becoming unanchored.

### 2. The Tightening Cycle (2022-2023)

#### Fed's Response
- March 2022: First rate hike (25bp).
- Followed by multiple 75bp and 50bp hikes (unusually aggressive).
- Peak rate: 5.25% (March 2023).
- Real rate went from approximately -4% (2021) to +2% (early 2023).

#### The Challenge: Finding $r_n$
- Is $r_n$ still around 1% (pre-COVID estimate)?
- Or has $r_n$ risen (due to fiscal stimulus, deglobalization, energy transition investment)?
- **If $r_n$ higher**: Current policy not as tight as it seems.
- **If $r_n$ unchanged**: Current policy quite restrictive.

### 3. The SVB Crisis and Policy Implications

#### New Considerations (March 2023)
- Banking stress adds risk premium ($x$) to borrowing costs.
- Equivalent to additional monetary tightening even if Fed doesn't hike.
- **Trade-off**:
    - Inflation still elevated (need higher $r$).
    - Financial stability concerns (argue for lower $r$ or pause).

#### Market Expectations Shift
- Pre-SVB: Expected 50bp hike at March meeting.
- Post-SVB: Expected pause or 25bp hike at most.
- **Reasoning**: Increase in $x$ substitutes for increase in $r$.
    - Total borrowing cost: $r + x$.
    - If $x$ rises, Fed need not raise $r$ as much.

#### Fed's Eventual Decision (March 22, 2023)
- Fed hiked 25bp (continued tightening, but at slower pace).
- Acknowledged financial stability concerns.
- Emphasized commitment to price stability.
- **Interpretation**: Balancing act between inflation and financial stability.

## Summary and Key Takeaways

### The IS-LM-PC Framework
- **Integrates** short-run demand analysis (IS-LM) with medium-run supply-side constraints (Phillips Curve).
- **Three curves**:
    1. **IS**: Goods market equilibrium (output depends negatively on real rate).
    2. **LM**: Monetary policy rule (Fed sets real rate).
    3. **PC**: Inflation dynamics (inflation rises when output exceeds potential).

### How the Three Curves Interact
1. **IS-LM determines short-run output**: Given Fed's choice of $r$, IS curve determines $Y$.
2. **PC determines inflation pressure**: Given $Y$, Phillips Curve determines whether inflation rising or falling.
3. **Fed adjusts LM over time**: If inflation deviating from target, Fed changes $r$ (shifts LM) to move output toward potential.
4. **Medium-run equilibrium**: Process continues until $r = r_n$, $Y = Y_n$, and $\pi = \pi^e$.

### The Natural Rate of Interest ($r_n$)
- Defined as real rate that equates output with potential.
- Determined by real factors, not monetary policy.
- Central bank must estimate $r_n$ to calibrate policy stance.
- Setting $r < r_n$ causes overheating; setting $r > r_n$ causes slack.

### Inflation Expectations are Critical
- **Anchored expectations** ($\pi^e = \bar{\pi}$): Easier to stabilize inflation, no recession needed to disinflate.
- **Adaptive expectations** ($\pi^e = \pi_{-1}$): Creates inertia, requires recession to disinflate.
- Central bank credibility essential to maintaining anchor.

### Neutrality of Money
- **Short run**: Monetary policy affects real variables (output, employment).
- **Medium run**: Monetary policy neutral, affects only nominal variables (inflation, nominal interest rate).
- Real variables determined by supply-side factors in medium run.

### Policy Implications
- Central bank can stabilize output around potential in short run.
- Cannot permanently alter real variables (attempting to do so causes inflation).
- Must balance short-run stabilization with medium-run price stability.
- Maintaining credibility allows less costly adjustments.
