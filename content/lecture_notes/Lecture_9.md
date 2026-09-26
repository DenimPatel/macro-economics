# Lecture 9: The Phillips Curve

## Overview
This lecture introduces one of the most important relationships in macroeconomics: the Phillips Curve, which describes the trade-off between unemployment and inflation. We derive this relationship from the wage-setting and price-setting equations, examine its evolution over time, and explore its critical implications for monetary policy and expectations formation.

## 1. Historical Origins of the Phillips Curve

### A.W. Phillips (1958)
- **Discovery**: A.W. Phillips, an economist at the London School of Economics (LSE), documented an empirical relationship using historical data for the UK (1861-1957).
- **Finding**: A stable **negative correlation** between the unemployment rate and the rate of wage inflation.
- **Key Observation**: At very low levels of unemployment, economies typically experienced very high levels of inflation; conversely, at very high levels of unemployment, they experienced low inflation or even deflation.

### Samuelson & Solow (1960)
- **Extension**: Paul Samuelson and Robert Solow replicated Phillips' work using US data (1900-1960).
- **Naming**: They named this empirical relationship the "Phillips Curve" in honor of A.W. Phillips.
- **Significance**: The relationship became a central concept in macroeconomic policy, suggesting a menu of choices between unemployment and inflation.

### Early Data (1900-1960)
- The data showed a clear downward-sloping relationship.
- **Historical Context**: This period included the Great Depression (high unemployment, deflation) and various expansions (low unemployment, higher inflation).
- **Initial Interpretation**: Policymakers believed they could exploit this trade-off—accepting slightly higher inflation to achieve lower unemployment.

## 2. Theoretical Foundation: Deriving the Phillips Curve

### Starting Ingredients (From Lectures 7-8)

#### Wage Setting Equation (WS)
$$W = P^e \cdot F(u, z)$$

- $W$: Nominal wage
- $P^e$: Expected price level
- $u$: Unemployment rate
- $z$: Catchall variable for labor market institutions (unemployment benefits, bargaining power, etc.)
- $F(u, z)$: **Decreasing in $u$**, **Increasing in $z$**

**Economic Intuition**:
- **Higher unemployment ($u \uparrow$)**: Workers are "scared"—more likely to lose jobs and harder to find new ones if unemployed. Firms have more bargaining power (easier to replace workers). Result: Lower wage demands ($W \downarrow$).
- **Higher institutional support ($z \uparrow$)**: Stronger unemployment benefits, unions, etc., embolden workers to demand higher wages ($W \uparrow$).

#### Price Setting Equation (PS)
$$P = (1 + m) W$$

- $P$: Price level
- $m$: Markup over marginal cost (wage)
- Firms set prices by marking up wages (assuming one worker produces one unit).

**Economic Intuition**:
- Firms need to cover costs and earn profits.
- Higher wages $\Rightarrow$ Higher costs $\Rightarrow$ Higher prices (given constant markup).

### Combining WS and PS

Substitute the wage-setting equation into the price-setting equation:
$$P = P^e (1+m) F(u, z)$$

This gives us a relationship between the **price level** and unemployment (conditional on expected prices).

### Functional Form Assumption

For tractability, assume $F(u, z)$ is locally linear:
$$F(u, z) = 1 - \alpha u + z$$

where $\alpha > 0$ captures the sensitivity of wages to unemployment.

Substituting:
$$P = P^e (1+m)(1 - \alpha u + z)$$

**Interpretation**:
- For given expected prices $P^e$, markups $m$, and institutions $z$:
- Higher unemployment $\Rightarrow$ Lower wages $\Rightarrow$ Lower prices.

### From Price Levels to Inflation Rates

The Phillips Curve relates **inflation** (not price levels) to unemployment. To get there:

**Step 1**: Divide both sides by $P_{t-1}$ (previous period's price level):
$$\frac{P_t}{P_{t-1}} = \frac{P^e_t}{P_{t-1}} (1+m)(1 - \alpha u_t + z)$$

**Step 2**: Recognize that:
$$\frac{P_t}{P_{t-1}} = 1 + \pi_t$$
where $\pi_t$ is the inflation rate.

**Step 3**: For expected inflation:
$$\pi^e_t = \frac{P^e_t - P_{t-1}}{P_{t-1}} \implies \frac{P^e_t}{P_{t-1}} = 1 + \pi^e_t$$

**Note**: We use $P_{t-1}$ (not $P^e_{t-1}$) in the denominator because at time $t$, agents **know** what happened at $t-1$—there's no expectation needed for past data.

**Step 4**: Substitute into the equation:
$$(1 + \pi_t) = (1 + \pi^e_t)(1+m)(1 - \alpha u_t + z)$$

**Step 5**: Apply the log approximation. For small $x$, $\log(1+x) \approx x$:
$$\log(1 + \pi_t) \approx \pi_t$$
$$\log(1 + \pi^e_t) \approx \pi^e_t$$
$$\log(1 + m) \approx m$$
$$\log(1 - \alpha u_t + z) \approx -\alpha u_t + z$$

Taking logs of both sides:
$$\pi_t \approx \pi^e_t + m + z - \alpha u_t$$

### The Basic Phillips Curve
$$\boxed{\pi_t = \pi^e_t + (m + z) - \alpha u_t}$$

**Interpretation**:
- **Negative relationship**: Higher unemployment $\Rightarrow$ Lower inflation (holding expectations, markups, and institutions constant).
- **Economics**: Same intuition as before—higher unemployment lowers wages, which lowers prices, which lowers inflation.
- **Three components**:
    1. **Expected inflation** ($\pi^e_t$): Baseline expectation.
    2. **Supply shocks** ($m + z$): Changes in markups (e.g., oil shocks) or labor market institutions.
    3. **Demand pressure** ($-\alpha u_t$): Tightness of the labor market.

## 3. Evolution of the Phillips Curve Over Time

### Period 1: The Original Phillips Curve (Pre-1970s)

#### Context
- **Low, stable inflation**: Inflation in the US and UK was generally low and stable (0-2%).
- **Well-anchored expectations**: People expected inflation to remain around historical averages.

#### Expectations Assumption
$$\pi^e_t = \bar{\pi} \quad \text{(constant)}$$

This means expected inflation is "anchored" at some long-run average $\bar{\pi}$ (e.g., 2%).

#### Simplified Phillips Curve
$$\pi_t = \bar{\pi} + (m + z) - \alpha u_t$$

or equivalently:
$$\pi_t = \text{constant} - \alpha u_t$$

**Result**: A **stable, downward-sloping line** relating inflation to unemployment.

#### Policy Implications (1960s)
- **Perceived Trade-Off**: Policymakers (including advisors Samuelson and Solow) believed they could choose a point on this curve.
- **Exploitation**: The US government pursued expansionary policies to lower unemployment, accepting slightly higher inflation.
- **Initial Success**: The curve was relatively flat, so unemployment fell significantly without much inflation (early 1960s).
- **Diminishing Returns**: As unemployment fell further, the curve became steeper (convex), and inflation accelerated (late 1960s).

### Period 2: The Breakdown (1970s)

#### What Happened?
If you plot the same data for **1970-1995**, the negative relationship **disappears**. The data is scattered all over the place—no clear pattern.

**Question**: Had Mr. Phillips been born later and estimated his regression in the 1970s, would there be a curve named after him?
**Answer**: Probably not. He would have found no relationship.

#### Why Did the Relationship Break Down?

**Two Main Causes**:

1. **Oil Shocks (Supply Shocks)**:
    - 1973: OPEC oil embargo.
    - 1979: Iranian Revolution.
    - **Effect on $m$**: Firms faced higher energy costs $\Rightarrow$ Needed to increase markups to cover costs $\Rightarrow$ $m \uparrow$.
    - **Result**: For any given level of unemployment, inflation was higher.
    - **Graphically**: The Phillips Curve **shifted up**.

2. **De-Anchoring of Inflation Expectations**:
    - As inflation persisted at high levels, people **stopped believing** it would return to 2%.
    - **Adaptive Expectations**: Instead of expecting $\bar{\pi}$, people began forming expectations based on recent inflation:
        $$\pi^e_t = \pi_{t-1}$$
    - **Implication**: Expected inflation became **endogenous** (moving with actual inflation), rather than fixed.

### Period 3: The Accelerationist Phillips Curve (1970s-1990s)

#### General Expectations Model
A more flexible model for expectations:
$$\pi^e_t = (1 - \theta) \bar{\pi} + \theta \pi_{t-1}$$

- $\theta$: Weight on recent inflation (persistence parameter).
- $\theta = 0$: Anchored expectations ($\pi^e_t = \bar{\pi}$).
- $\theta = 1$: Fully adaptive expectations ($\pi^e_t = \pi_{t-1}$).

#### The Accelerationist Case ($\theta = 1$)
During the 1970s-1980s, $\theta \approx 1$ (empirical estimates).

**Expectations**:
$$\pi^e_t = \pi_{t-1}$$

**Phillips Curve**:
$$\pi_t = \pi_{t-1} + (m + z) - \alpha u_t$$

**Rearrange**:
$$\boxed{\pi_t - \pi_{t-1} = (m + z) - \alpha u_t}$$

**Interpretation**:
- Now the Phillips Curve relates the **change in inflation** to unemployment.
- Low unemployment $\Rightarrow$ Inflation **accelerates** ($\pi_t > \pi_{t-1}$).
- High unemployment $\Rightarrow$ Inflation **decelerates** ($\pi_t < \pi_{t-1}$).

**Why "Accelerationist"?**
- Because it describes inflation **acceleration** (or deceleration), not just the level.
- **Implication**: Very low unemployment doesn't just produce high inflation—it produces **rising** inflation, which can spiral out of control.

#### Empirical Fit
When you estimate the accelerationist Phillips Curve on 1970s-1990s data, you recover a **negative relationship** (between $\Delta \pi$ and $u$).

**Conclusion**: The theory still works—you just need the right specification for expectations.

### Period 4: Re-Anchoring (Mid-1990s - 2019)

#### The Volcker Disinflation
- **Paul Volcker** (Fed Chair, 1979-1987): Aggressively raised interest rates to break the back of inflation.
- **Cost**: Deep recession (1981-1982), unemployment peaked at ~10.8%.
- **Benefit**: Inflation fell from ~14% (1980) to ~3% (1983).
- **Key Achievement**: Re-anchored inflation expectations around 2%.

#### Global Adoption
- Other central banks (e.g., ECB, Bank of England, Latin American central banks) followed suit.
- **Inflation targeting regimes**: Explicit 2% targets became the norm.

#### Return to the Original Phillips Curve
By the mid-1990s:
- $\theta \approx 0$ again (expectations re-anchored).
- $\pi^e_t \approx 2\%$ (stable, independent of recent inflation).
- **Result**: The original downward-sloping relationship between **inflation** and **unemployment** returned.

#### Data (1995-2019)
Plotting inflation vs. unemployment for this period shows a **clear negative relationship** again (similar to the 1960s).

**Success of Monetary Policy**: Central banks successfully maintained low, stable inflation for ~25 years ("Great Moderation").

## 4. The Natural Rate of Unemployment ($u_n$)

### Definition
The **natural rate of unemployment** ($u_n$) is the unemployment rate at which:
$$\pi_t = \pi^e_t$$

**Meaning**: Actual inflation equals expected inflation—there are no "surprises."

### Why "Natural"?
- **Not divinely ordained**: It's not a fixed number given by nature or God.
- **Structural**: It's determined by labor market institutions ($z$), markups ($m$), and wage-setting behavior.
- **Equilibrium**: It's the unemployment rate at which the wage-setting and price-setting equations are consistent.

### Derivation

From the Phillips Curve:
$$\pi_t = \pi^e_t + (m + z) - \alpha u_t$$

Set $\pi_t = \pi^e_t$:
$$0 = (m + z) - \alpha u_n$$

Solve for $u_n$:
$$\boxed{u_n = \frac{m + z}{\alpha}}$$

### Determinants of $u_n$

#### 1. Markups ($m$)
- **Higher $m$**: Firms want to pay lower real wages (to maintain profits).
- Workers (at the original unemployment level) won't accept lower real wages.
- **Equilibrium**: Unemployment must rise to weaken workers' bargaining power.
- **Result**: $u_n \uparrow$ when $m \uparrow$.

#### 2. Labor Market Institutions ($z$)
- **Higher $z$**: Workers demand higher real wages (e.g., stronger unions, generous unemployment benefits).
- Firms aren't willing to pay higher real wages.
- **Equilibrium**: Unemployment must rise to reduce wage demands.
- **Result**: $u_n \uparrow$ when $z \uparrow$.

#### 3. Wage Sensitivity ($\alpha$)
- **Higher $\alpha$**: Wages are more responsive to unemployment.
- **Result**: A smaller increase in unemployment is needed to restore equilibrium $\Rightarrow$ $u_n \downarrow$ when $\alpha \uparrow$.

### Phillips Curve in Terms of the Unemployment Gap

From the Phillips Curve:
$$\pi_t = \pi^e_t + (m + z) - \alpha u_t$$

We know that:
$$m + z = \alpha u_n$$

Substitute:
$$\pi_t = \pi^e_t + \alpha u_n - \alpha u_t$$

Rearrange:
$$\boxed{\pi_t - \pi^e_t = -\alpha (u_t - u_n)}$$

**Interpretation**:
- **Unemployment below natural rate** ($u_t < u_n$): "Tight" labor market $\Rightarrow$ **Upward pressure on inflation** ($\pi_t > \pi^e_t$).
- **Unemployment above natural rate** ($u_t > u_n$): "Slack" labor market $\Rightarrow$ **Downward pressure on inflation** ($\pi_t < \pi^e_t$).
- **Unemployment at natural rate** ($u_t = u_n$): No pressure $\Rightarrow$ Inflation equals expectations.

**This is the form most commonly used by central banks.**

## 5. Policy Implications and Current Context (2020s)

### The Challenge of Estimating $u_n$

- **Problem**: The natural rate is **not directly observable**.
- **Estimates**: Economists use statistical methods, but estimates are uncertain and vary.
- **Real-time challenge**: When unemployment is falling, policymakers must guess whether they're approaching $u_n$ (and risking inflation) or if there's still slack.

### Example Estimate: US Natural Rate Over Time

A typical estimate shows:
- **Blue Line**: Estimated natural rate of unemployment.
- **Red Line**: Actual unemployment rate.

#### Episode 1: Great Recession (2008-2013)
- **$u_t \gg u_n$**: Unemployment far above the natural rate (peaked at 10%).
- **Prediction**: Strong **downward pressure** on inflation.
- **Reality**: Inflation fell below 2%, even briefly negative (deflation).
- **Implication**: The gap correctly predicted disinflationary pressure.

#### Episode 2: Pre-COVID Expansion (2016-2019)
- **$u_t < u_n$**: Unemployment fell below most estimates of the natural rate (reached ~3.5%).
- **Expected**: Upward pressure on inflation.
- **Reality**: Inflation remained stubbornly around 1.5-2% (didn't accelerate much).
- **Mystery**: Suggested either:
    1. The natural rate had declined (not captured by models), or
    2. The Phillips Curve had "flattened" (inflation less responsive to unemployment).

#### Episode 3: Post-COVID (2021-2023)
- **$u_t \ll u_n$**: Unemployment fell rapidly (reached ~3.4% in 2023).
- **Supply shocks**: Pandemic disruptions, supply chain bottlenecks, energy prices.
- **Result**: Inflation surged to ~9% (June 2022).
- **Implication**: Negative unemployment gap + supply shocks = very high inflation.

### Current Policy Debate (2022-2023)

**Question**: Is a recession necessary to bring inflation back to 2%?

#### View 1: Yes, Recession is Necessary
- **Logic**: The Phillips Curve says $u_t > u_n$ is needed to bring $\pi_t < \pi^e_t$.
- If $\pi^e_t \approx 5-6\%$ (unanchored), then we need $u_t \gg u_n$ to bring inflation back to 2%.
- **Implication**: The Fed must induce a recession (raise unemployment significantly).

#### View 2: Maybe Not (Fed's Initial Hope)
- **Alternative indicators**: Other measures of labor market tightness (job openings, quits rate, hiring flows) are improving.
- **Supply-side healing**: Bottlenecks resolving, energy prices moderating $\Rightarrow$ $m \downarrow$.
- **If expectations stay anchored** ($\pi^e_t \approx 2-3\%$): Only a modest rise in unemployment is needed.
- **Implication**: A "soft landing" (disinflation without recession) is possible.

#### The Central Role of Expectations
**Critical Variable**: $\pi^e_t$ (expected inflation).

##### Scenario A: Expectations Stay Anchored ($\pi^e_t \approx 2\%$)
- **Phillips Curve**:
    $$\pi_t = 2\% - \alpha(u_t - u_n)$$
- **To bring $\pi_t$ to 2%**: Just need $u_t = u_n$ (close the gap).
- **Cost**: Modest rise in unemployment (not a deep recession).

##### Scenario B: Expectations Become Unanchored ($\pi^e_t \approx 6\%$)
- **Phillips Curve**:
    $$\pi_t = 6\% - \alpha(u_t - u_n)$$
- **To bring $\pi_t$ to 2%**: Need $\pi_t = 2\% = 6\% - \alpha(u_t - u_n)$
    $$\alpha(u_t - u_n) = 4\%$$
    $$u_t - u_n = \frac{4\%}{\alpha}$$
- **Implication**: Unemployment must rise **far above** $u_n$ (deep recession).
- **Cost**: Severe recession to "break" expectations and bring them back down.

### What Happened in 2022-2023?

#### Summer 2022: Near-Miss
- **One-year expected inflation** crept up to ~6% (based on surveys and market measures).
- **Fed response**: Very hawkish speeches (Powell at Jackson Hole), aggressive rate hikes.
- **Result**: Expectations quickly fell back to ~2.5-3%.
- **Success**: Avoided full de-anchoring.

#### 2023-2024: Continued Uncertainty
- Expected inflation fluctuates between 2.5-3.5%.
- **Fed's goal**: Keep expectations anchored to avoid needing a deep recession.
- **Risk**: If inflation lingers at 5-6% and expectations rise again, a recession may become unavoidable.

### The Role of Credibility
- **Volcker's lesson**: Aggressive action + clear communication can re-anchor expectations.
- **Fed's challenge**: Balance tightening enough to control inflation without triggering a severe recession.
- **Anchor or spiral**: The difference between a soft landing and a hard landing depends on $\theta$ (persistence of expectations).

## 6. Additional Factors and Extensions

### Supply Shocks (Oil, Pandemics, Wars)
- **Effect on $m$**: Higher energy costs $\Rightarrow$ Firms mark up more $\Rightarrow$ $m \uparrow$.
- **Phillips Curve shifts**: For given $u$, inflation is higher.
- **Historical examples**:
    - 1973-1974: OPEC embargo.
    - 1979-1980: Iranian Revolution.
    - 2021-2022: Pandemic supply chain disruptions, Russia-Ukraine war.

### Labor Market Institutions ($z$)
- **Unemployment benefits**: More generous benefits $\Rightarrow$ Higher reservation wages $\Rightarrow$ $z \uparrow$ $\Rightarrow$ $u_n \uparrow$.
- **Unions**: Stronger unions $\Rightarrow$ Higher wage demands $\Rightarrow$ $z \uparrow$ $\Rightarrow$ $u_n \uparrow$.
- **COVID example**: Emergency pandemic benefits (2020-2021) likely raised $z$ temporarily, contributing to wage growth and inflation.

### Labor Force Participation
- **Definition**: Share of working-age population in the labor force (employed or actively seeking work).
- **Post-COVID decline**: Many workers retired early or dropped out due to health concerns.
- **Effect**: Tighter labor market (lower unemployment) for given employment $\Rightarrow$ More wage pressure.
- **Policy relevance**: Increasing participation could ease inflation without raising unemployment.

### Immigration
- **US context**: Immigration flows declined during COVID (~500,000 workers/year lost).
- **Effect**: Reduced labor supply $\Rightarrow$ Tighter labor market $\Rightarrow$ Upward wage pressure.
- **Policy tool**: Increasing immigration could help cool wage growth without requiring higher unemployment.

## 7. Summary

### Historical Evolution
1. **1900-1960s**: Stable negative relationship (anchored expectations).
2. **1970s-1980s**: Breakdown due to oil shocks and de-anchored expectations (accelerationist Phillips Curve).
3. **1990s-2019**: Re-anchoring and return to original relationship (successful monetary policy).
4. **2020s**: New challenges from pandemic shocks and inflation surge.

### Key Equations

#### Basic Phillips Curve
$$\pi_t = \pi^e_t + (m + z) - \alpha u_t$$

#### Natural Rate of Unemployment
$$u_n = \frac{m + z}{\alpha}$$

#### Phillips Curve (Unemployment Gap Form)
$$\pi_t - \pi^e_t = -\alpha(u_t - u_n)$$

#### Accelerationist Phillips Curve ($\theta = 1$)
$$\pi_t - \pi_{t-1} = (m + z) - \alpha u_t$$

### Policy Takeaways
- **Expectations are critical**: Anchored expectations allow disinflation without severe recessions.
- **Natural rate is structural**: Changes in $m$ and $z$ shift $u_n$ (not just cyclical).
- **Trade-offs exist**: In the short run, there's tension between unemployment and inflation goals.
- **Long run**: No permanent trade-off if expectations adjust (accelerationist view).

### Current Relevance
- **Fed's challenge**: Bring inflation from ~6% to 2% without triggering a deep recession.
- **Battle on expectations**: Success depends on keeping $\pi^e_t$ anchored near 2%.
- **Uncertainty**: Estimating $u_n$ in real time is difficult; policy risks missing on either side (too tight or too loose).

**Next Lectures**: We'll integrate the Phillips Curve into the IS-LM framework to build a complete model of output, unemployment, and inflation dynamics (the IS-LM-PC model).
