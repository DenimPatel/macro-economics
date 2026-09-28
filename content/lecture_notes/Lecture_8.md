# Lecture 8: The Labor Market

## Overview

```summary
- The labor market is where a fixed-price, demand-determined model has to give way to supply constraints
- Two reasons it sits at the center of macro: the unemployment rate reads the economy's health, and labor market conditions are a primary driver of inflation
- The chain running through the whole lecture: labor market tightness sets wages, wages set prices
- IS-LM is the short run; this lecture starts the medium run, and the Phillips Curve comes next
```
This lecture introduces the labor market as the foundation for understanding inflation dynamics. We transition from the IS-LM model (fixed prices, demand-determined output) to the medium-run model where supply constraints and labor market tightness affect prices. The labor market is crucial because: (1) unemployment is a key macroeconomic health indicator, and (2) labor market conditions are a primary driver of inflation.

## 1. Motivation: Why Labor Markets Matter for Macro

```summary
- **Two reasons the labor market is macro's center**: the unemployment rate signals the economy's health, and tight labor markets are a main driver of inflation
- The 2023 backdrop: inflation ~6%, still far above the Fed's 2% target, with unemployment at 3.4% — the lowest since the 1960s
- Labor force participation has still not recovered to its pre-COVID trend, so some would-be workers are missing from the rate altogether
- The Fed holds rates high precisely *because* labor market conditions are "very tight": it reads tightness as persistent inflation pressure
- The lecture's question is why a tight labor market creates inflation, and the answer runs through wages to prices
```
### Two Key Reasons
1. **Unemployment as Economic Indicator**: The unemployment rate signals the overall health of the economy.
2. **Labor Market and Inflation**: Tight labor markets are a main driver of inflation.

### Current Context (2023)
- **US Inflation**: ~6% (down from peaks but still well above the Fed's 2% target)
- **Labor Market**: Extremely tight
    - Unemployment rate: 3.4% (lowest since the 1960s)
    - Labor force participation: Not fully recovered to pre-COVID trend
- **Fed Policy**: High interest rates maintained because "labor market conditions are very tight," suggesting persistent inflation pressure

### The Central Question
**Why does a tight labor market create inflation?** This lecture begins to answer this by examining how labor market conditions affect wages, which in turn affect prices.

## 2. Transition: From Short Run to Medium Run

```summary
- IS-LM assumed **fixed prices** and **demand-determined output**: whatever aggregate demand wanted, firms produced at constant prices
- Those assumptions are cheap when there is slack — in a recession a firm can expand without hitting a constraint, and prices move slowly anyway
- They fail once **supply constraints bind**: firms cannot find the workers to meet demand, so they raise prices instead
- The repair is to **endogenize inflation** in four steps — wage-setting, price-setting, the Phillips Curve, then an IS-LM-PC model that puts supply back beside demand
- This lecture is step one: wages, and why they end up where they do
```
### IS-LM Limitations
The IS-LM model (Lectures 3-7) made two key assumptions:
1. **Fixed Prices**: $P = \bar{P}$ (completely sticky)
2. **Demand-Determined Output**: Whatever aggregate demand wanted, firms produced at constant prices

These assumptions work well for:
- **Recessions**: Plenty of slack, firms can expand without hitting constraints
- **Short-run analysis**: Prices adjust slowly

These assumptions fail when:
- **Supply constraints bind**: Firms struggle to find workers
- **Labor markets are tight**: Difficult to expand production
- **Inflationary pressures emerge**: Firms raise prices because they can't meet demand at old prices

### The New Framework
We will now **endogenize inflation** by:
1. Understanding wage determination (today's lecture)
2. Connecting wages to prices (price-setting behavior)
3. Deriving the Phillips Curve (next lecture)
4. Integrating supply and demand (IS-LM-PC model)

## 3. Labor Market Structure and Definitions

```summary
- **Labor force** $L$ = employed $N$ + unemployed $U$ — the denominator of the unemployment rate, and emphatically not the population
- **Unemployment rate** $u = U/L$: the share of the labor force without a job; the share of the population is a different, wrong statistic
- **LFPR** and **EPOP** both divide by the civilian noninstitutional population, the 260M left after dropping the under-16s, the incarcerated and the armed forces
- The pyramid narrows 330M → 260M → a 162M labor force, with 98M of the remainder out of the labor force entirely
- A rate is a **net** number: in January 2023 unemployment fell to 3.4% even as 28,000 more people counted as unemployed, because employment rose 894,000 against 866,000 new entrants
- **Unemployment is countercyclical** — near 10% at the 2009 peak, a brief spike to ~15% in COVID — while EPOP trends down after 2000 and still sits 2-3 percentage points off trend
- LFPR at 62.5% and EPOP at 60% are both still short of pre-COVID, so the headline rate omits workers who never came back
```
### Population Breakdown (US, circa 2018)
Starting from total population and narrowing to those actively working:

```
Total Population (330M)
    ↓
Civilian Noninstitutional Population (260M)
    [Excludes: under 16, incarcerated, armed forces]
    ↓
    ├─ Labor Force (162M) = Employed + Unemployed
    │   ├─ Employed (156M)
    │   └─ Unemployed (6M)
    │
    └─ Out of Labor Force (98M)
       [Retirees, students, discouraged workers, etc.]
```

### Key Definitions
- **Labor Force** ($L$): $L = N + U$ (employed + unemployed)
- **Unemployment Rate**:
    **Note**: NOT unemployment divided by total population
    $$u = \frac{U}{L} = \frac{\text{Unemployed}}{\text{Labor Force}}$$

- **Labor Force Participation Rate**:
    $$\text{LFPR} = \frac{L}{\text{Civilian Noninstitutional Population}}$$

- **Employment-to-Population Ratio**:
    $$\text{EPOP} = \frac{N}{\text{Civilian Noninstitutional Population}}$$

### Recent Data (January 2023)
- **Unemployment Rate**: 3.4% (historically very low)
- **Change in Unemployment**: -28,000 workers
    - **But**: This is net of two large offsetting flows:
        - Employment increased: +894,000
        - Labor force increased: +866,000
    - **Interpretation**: Strong job creation, but also people entering labor force (out of labor force → employed/unemployed)
- **LFPR**: 62.5% (still below pre-COVID trend)
- **EPOP**: 60% (recovering but off trend)

### Historical Patterns (1950s-Present)
- **Unemployment Rate**:
    - Countercyclical: Rises sharply in recessions (peaks ~10% in 2009), falls in expansions
    - Pre-COVID low: ~3.5% (similar to today)
    - COVID spike: Brief surge to ~15% (unprecedented speed)
    - Current: 3.4% (record low, matching 1960s levels)

- **Employment Rate (EPOP)**:
    - Upward trend (1950s-2000): Driven by rising female labor force participation
    - Decline post-2000: Demographics (aging), discouraged workers, structural changes
    - COVID collapse: Sharp drop as workers left labor force
    - Incomplete recovery: Currently at pre-COVID levels but **off trend** (missing ~2-3 percentage points)

## 4. Labor Market Dynamics: Flows Not Stocks

```summary
- The labor market is a **flow** system, not a stock: millions of people change status in a typical month even when the unemployment rate barely moves
- Gross flows swamp net changes — a 28K swing sits on top of 1.8M workers entering unemployment and 2M of them leaving it for a job
- **Job-to-job moves** (~3M a month) never touch the unemployment rate at all: people go straight from one job to the next
- Many workers bypass unemployment entirely, flowing straight between employment and out of the labor force
- **Job-finding rate**: the share of unemployed who find work each month; it moves inversely with $u$, a near-perfect negative correlation
- High $u$ means firms are not hiring, so spells run longer, and both the newly laid-off and the long-term jobless are frightened
- Low $u$ means layoffs are unlikely and alternatives plentiful, so a worker can credibly threaten to leave — bargaining power rises
```
### Why Flows Matter
The labor market is not static. Each month, millions of workers change status.

### Monthly Labor Flows (Typical Month, 2018)
```
Employment (132M)
    ↓↑ 3M (Job-to-Job)
    ↓ 1.8M → Unemployment
    ↑ 2M ← Unemployment
    ↓ 3.7M → Out of Labor Force
    ↑ 3.4M ← Out of Labor Force

Unemployment (8.6M)
    ↓ 2M → Employment
    ↑ 1.8M ← Employment
    ↓ 1.5M → Out of Labor Force
    ↑ 1.3M ← Out of Labor Force

Out of Labor Force (79M)
    ↓ 3.4M → Employment
    ↑ 3.7M ← Employment
    ↓ 1.3M → Unemployment
    ↑ 1.5M ← Unemployment
```

### Key Insights from Flows
1. **Large Gross Flows**: Even when unemployment changes by small amounts (e.g., -28K), the underlying flows are enormous (millions)
2. **Job-to-Job Transitions**: ~3M workers switch jobs each month without unemployment
3. **Out of Labor Force Matters**: Many workers bypass unemployment entirely (especially during COVID)

### The Job-Finding Rate
**Definition**: Percentage of unemployed workers who find a job each month.

**Relationship to Unemployment**:
- **High Unemployment** ($u \uparrow$) $\Rightarrow$ **Low Job-Finding Rate** ($\downarrow$)
    - **Why?** Firms aren't hiring aggressively; more competition for fewer jobs
    - **Result**: Unemployed workers stay unemployed longer (duration $\uparrow$)

- **Low Unemployment** ($u \downarrow$) $\Rightarrow$ **High Job-Finding Rate** ($\uparrow$)
    - **Why?** Firms hiring aggressively; plentiful vacancies
    - **Result**: Unemployed workers find jobs quickly (duration $\downarrow$)

**Empirical Relationship**: Nearly perfect negative correlation (inverted scale shows unemployment and job-finding rate move together)

### Implications for Workers
When unemployment is **high** (recessions), workers face two risks:
1. **Employed Workers**: Higher probability of job loss (firms laying off)
2. **Unemployed Workers**: Lower probability of finding job (longer spells)

**Combined Effect**: High unemployment is **scary** for workers. This fear weakens their bargaining power.

When unemployment is **low** (today), workers have:
1. **Job Security**: Low probability of layoff
2. **Job Opportunities**: Easy to find new job if desired

**Combined Effect**: Low unemployment strengthens workers' bargaining power. They can credibly threaten to leave.

## 5. Wage Determination (Wage-Setting Relation)

```summary
- **Wage-setting**: $W = P^e F(u, z)$ — the nominal wage is the expected price level times a real wage that falls with $u$ and rises with $z$
- Whether wages are set by unions (US density ~10%, 30-50%+ in parts of Europe and Japan) or negotiated one worker at a time, the macroeconomic determinants are the same
- **Expected prices ($P^e$)**: wages are sticky, so it is *expected* prices that set them; if $P^e > P$ workers demand a higher nominal wage to protect real purchasing power
- **Unemployment ($u$)**: high unemployment makes workers easy to replace and firms unafraid of quits, so workers accept less; low unemployment reverses it — the 2023 restaurant industry, wages rising 10%+
- **Institutions ($z$)**: a catch-all for structural bargaining power — benefits, firing costs, employment protection, minimum wage, unions, regulation. The US is low-$z$; France and Germany high-$z$; the Nordics pair it with active labor market policy
- **Reservation wage**: the wage at which a worker is indifferent between working and not. Firms almost always pay above it, to retain workers, avoid turnover and elicit effort
- Divided by $P^e$ the relation is a real wage, $W/P^e = F(u, z)$: downward-sloping in $u$, so the wage-setting curve slopes down in $(u, W/P)$ space
```
### Institutional Background

#### Collective Bargaining
- **Unions**: Set wages through collective negotiation
    - **US**: Union density low (~10%) and declining (much higher in 1950s-1970s)
    - **Europe/Japan**: Much higher union density (30-50%+ in some countries)
    - **Levels**: Firm-level, industry-level, or national-level bargaining

#### Individual Bargaining
- **High-skill workers**: More likely to negotiate individually (idiosyncratic, specialized skills)
- **Low-skill workers**: Often face posted wages (less negotiation)

### Key Point: Macro Drivers Are Similar
Regardless of whether wages are set by unions or individuals, the **macroeconomic determinants** are the same:
1. Labor market tightness (unemployment rate)
2. Expected future prices (inflation)
3. Institutional factors (bargaining power)

### The Reservation Wage
**Definition**: The wage at which a worker is **indifferent** between being employed vs. unemployed.

**Fact of Life**: Actual wages typically **exceed** reservation wages.
- Workers prefer employment but have limited bargaining power
- Firms pay more than minimum to retain workers, avoid turnover, elicit effort

### Wage-Setting Equation (Aggregated)
$$W = P^e F(u, z)$$

Where:
- $W$: **Nominal wage** (dollars per hour)
- $P^e$: **Expected price level** (what workers expect prices to be during wage contract)
- $u$: **Unemployment rate** (measures labor market tightness)
- $z$: **Institutional factors** (unemployment benefits, firing costs, minimum wage, union strength, etc.)

### Understanding Each Component

#### 1. Expected Price Level ($P^e$): Why It Matters
**Question**: Why do wages depend on expected prices, not just current prices?

**Answer**: Wages are sticky. Once set, they last for a period (typically 1 year or more).
- If $P^e = P$ (no expected inflation): Workers demand wage sufficient for current purchasing power
- If $P^e > P$ (expect inflation): Workers demand **higher nominal wage** to maintain real purchasing power

**Example**:
- Current price level: $P = 100$
- Expected price level next year: $P^e = 110$ (10% inflation expected)
- Workers won't accept $W =$ \$20/hour if they expect prices to rise 10%
- They'll demand $W =$ \$22/hour to maintain constant real wage ($W/P^e = 22/110 = 0.20$)

**Why $\partial W / \partial P^e > 0$**:
$$\frac{\partial W}{\partial P^e} > 0$$
Higher expected prices $\Rightarrow$ Workers demand higher nominal wages to protect real purchasing power.

#### 2. Unemployment Rate ($u$): Bargaining Power Channel
$$\frac{\partial F}{\partial u} < 0 \quad \Rightarrow \quad \frac{\partial W}{\partial u} < 0$$

**Why is wage decreasing in unemployment?**

**Worker Perspective** (high unemployment):
1. **Job Loss Risk**: "If I push too hard, I might get fired, and it's hard to find another job"
2. **Low Outside Options**: "Even if I quit, I'll struggle to find work elsewhere"
3. **Weak Bargaining Position**: "The firm knows I'm replaceable"

**Firm Perspective** (high unemployment):
1. **Easy to Replace Workers**: "Plenty of qualified candidates in the market"
2. **Less Fear of Quits**: "Workers won't leave because alternatives are scarce"
3. **Strong Bargaining Position**: "We can offer lower wages and still attract talent"

**Result**: High $u$ $\Rightarrow$ Low $W$ (workers accept lower wages)

**Opposite for Low Unemployment** (today's situation):
- **Worker**: "I can easily find another job if you don't pay me well"
- **Firm**: "We desperately need to retain workers; competitors are poaching"
- **Result**: Low $u$ $\Rightarrow$ High $W$ (wage pressures)

**Current Example** (2023): Restaurant industry
- Unemployment extremely low
- Restaurants struggling to hire
- Wages rising rapidly (10%+ in some cases)
- Firms very afraid of losing current workers

#### 3. Institutional Factors ($z$): Structural Bargaining Power
$$\frac{\partial F}{\partial z} > 0 \quad \Rightarrow \quad \frac{\partial W}{\partial z} > 0$$

**What is $z$?** A catch-all variable representing factors that **structurally strengthen workers' bargaining power**.

**Examples of High $z$**:
1. **Generous Unemployment Benefits**: Workers less desperate (can afford to wait for better offer)
2. **High Firing Costs**: Firms hesitant to fire (workers have job security)
3. **Strong Employment Protection Laws**: Difficult to lay off workers (European labor markets)
4. **High Minimum Wage**: Floor on wages
5. **Strong Unions**: Collective bargaining power
6. **Tight Labor Regulations**: Restrictions on hours, conditions, etc.

**Cross-Country Variation**:
- **US**: Relatively low $z$ (at-will employment, weak unions, modest unemployment insurance)
- **France/Germany**: High $z$ (strong employment protection, generous benefits, powerful unions)
- **Nordics**: High $z$ but combined with active labor market policies (training, reemployment support)

### Wage-Setting as Real Wage Relation
Divide both sides by $P^e$:
$$\frac{W}{P^e} = F(u, z)$$

**Interpretation**: For a given expected price level, workers demand a real wage that:
- **Decreases** with unemployment (weaker bargaining power)
- **Increases** with institutional strength ($z$)

**Graphical Representation**: Downward-sloping curve in $(u, W/P)$ space (holding $z$ constant)

## 6. Price Determination (Price-Setting Relation)

```summary
- Production is $Y = A N$, and with productivity pinned at $A = 1$ one more worker is exactly one more unit of output
- Hiring that extra worker costs $W$, so **marginal cost is the wage**: $MC = W$
- **Markup pricing**: $P = (1 + m) W$ — the firm's price is its labor cost times one plus its markup, with $m > 0$ because competition is imperfect
- Worked example: a 20-dollar hourly wage at a 0.25 markup prices the unit at $1.25 \times 20 = 25$ dollars
- What sets $m$: market structure, how price-sensitive demand is, barriers to entry, and input costs that rise without being fully picked up in value-added
- Divided out, **the real wage is pinned by the markup**: $W/P = 1/(1+m)$, horizontal in $(u, W/P)$ and independent of unemployment
- A higher $m$ is a lower real wage — the firm keeps a larger share of revenue as profit
```
### Production Function (Simplified)
$$Y = A N$$

Where:
- $Y$: Aggregate output (GDP)
- $N$: Employment (number of workers)
- $A$: Labor productivity (output per worker)

**Further Simplification**: Set $A = 1$
$$Y = N$$

**Interpretation**: To produce one more unit of output, need one more worker.

### Marginal Cost of Production
**Question**: What does it cost the firm to produce one additional unit of output?

**Answer**:
1. Need one more worker ($\Delta N = 1$ for $\Delta Y = 1$)
2. Worker costs $W$ (the wage)
3. Therefore, **Marginal Cost = $W$**

$$MC = W$$

### Price-Setting Equation: Markup Pricing
Firms set prices as a markup over marginal cost:
$$P = (1 + m) W$$

Where:
- $m$: **Markup** (e.g., $m = 0.2$ means 20% markup)
- $m > 0$: Positive due to imperfect competition, market power

**Example**:
- Wage: $W =$ \$20/hour
- Markup: $m = 0.25$ (25%)
- Price: $P = 1.25 \times 20 =$ \$25 per unit

**What Determines $m$?**
1. **Market Structure**: Monopolistic competition, oligopoly (higher $m$), vs. perfect competition ($m \to 0$)
2. **Demand Elasticity**: If consumers sensitive to price, firms keep $m$ low
3. **Entry Barriers**: Harder to enter market $\Rightarrow$ Higher $m$
4. **Input Costs**: If non-labor costs (energy, materials) rise but not well-measured in value-added, effective $m$ increases

### Price-Setting as Real Wage Relation
Divide both sides by $P$ and rearrange:
$$P = (1 + m) W \quad \Rightarrow \quad \frac{W}{P} = \frac{1}{1 + m}$$

**Critical Insight**: The real wage is pinned down by the markup.
- Firms are willing to pay real wage of $\frac{1}{1 + m}$
- **Not a function of unemployment** or any other variable (in this simple model)
- Horizontal line in $(u, W/P)$ space

### Intuition: Why Is Real Wage Fixed by Markup?
1. Firms set $P = (1 + m) W$ regardless of economic conditions (taking $m$ as given)
2. Rearranging: $W/P = 1/(1 + m)$
3. The real wage firms offer is purely determined by their desired markup

**Comparative Statics**:
- $m \uparrow$ (markup increases) $\Rightarrow$ $W/P \downarrow$ (real wage falls)
- Firms take a larger share of revenue as profits, leaving less for workers

## 7. Equilibrium: The Natural Rate of Unemployment

```summary
- **Natural rate $u_n$**: the unemployment rate at which expected prices equal actual prices, $P^e = P$ — the medium-run equilibrium, nothing more
- Set the two relations equal, $F(u_n, z) = 1/(1+m)$, and $u_n$ is whatever unemployment makes workers' real wage demand equal the real wage the firm's markup pays
- "Natural" is a misnomer: $u_n$ is not optimal, not unchangeable, and says nothing about nature. The honest names are structural or equilibrium rate (Friedman and Phelps, 1960s)
- It approximates the long-run **average** unemployment rate because forecast errors cancel — $P^e$ too high pushes $u$ below $u_n$, too low pushes it above
- Graphically a downward-sloping wage-setting curve crosses a horizontal price-setting line at $1/(1+m)$; the crossing pins down both $u_n$ and the equilibrium real wage
- $u_n$ is **stable**: right of it firms offer more than workers demand and hire, pushing $u$ back down; left of it workers demand more than firms will pay, so hiring falls and $u$ rises
```
### Definition of Natural Rate ($u_n$)
**The Natural Rate of Unemployment** is the unemployment rate when **expected prices equal actual prices**:
$$P^e = P$$

**Key Point**: "Natural" is a misnomer. It's not:
- Optimal
- Unchangeable
- Determined by nature/God
- Necessarily desirable

It's simply the **medium-run equilibrium** unemployment rate when expectations are correct.

### Why Is It Called "Natural"?
Historical naming (Milton Friedman, Edmund Phelps, 1960s). Better terms:
- **Structural unemployment rate**
- **Equilibrium unemployment rate**
- **Medium-run unemployment rate**

### Why Does It Approximate the Long-Run Average?
If people aren't systematically wrong about prices:
- Sometimes $P^e > P$ (overestimate inflation) $\Rightarrow$ $u < u_n$
- Sometimes $P^e < P$ (underestimate inflation) $\Rightarrow$ $u > u_n$
- **On average**: $P^e = P$ $\Rightarrow$ $u = u_n$

Therefore, $u_n$ is a good proxy for the **average unemployment rate** over longer periods (when forecast errors cancel out).

### Deriving the Natural Rate

#### Step 1: Wage-Setting (with $P^e = P$)
$$W = P^e F(u, z) \quad \Rightarrow \quad W = P F(u, z)$$

Divide by $P$:
$$\frac{W}{P} = F(u, z)$$

When we solve for equilibrium assuming $P^e = P$, the resulting unemployment rate is $u_n$:
$$\frac{W}{P} = F(u_n, z)$$

#### Step 2: Price-Setting
$$\frac{W}{P} = \frac{1}{1 + m}$$

#### Step 3: Equilibrium Condition
Set wage-setting equal to price-setting:
$$F(u_n, z) = \frac{1}{1 + m}$$

**Solve for $u_n$**:
$$u_n = F^{-1}\left(\frac{1}{1 + m}, z\right)$$

**Interpretation**: The natural rate is determined by:
1. **Markup** ($m$): Higher markup $\Rightarrow$ Higher $u_n$
2. **Institutions** ($z$): Stronger worker bargaining power $\Rightarrow$ Higher $u_n$ (paradoxically)

### Graphical Determination

**Axes**:
- Horizontal: Unemployment rate ($u$)
- Vertical: Real wage ($W/P$)

**Wage-Setting (WS) Curve**:
- **Slope**: Downward (higher $u$ $\Rightarrow$ lower $W/P$)
- **Position**: Shifts up if $z \uparrow$ (stronger bargaining power)

**Price-Setting (PS) Curve**:
- **Slope**: Horizontal (real wage independent of $u$)
- **Position**: $W/P = \frac{1}{1 + m}$
- Shifts down if $m \uparrow$ (higher markup)

**Equilibrium**: Intersection of WS and PS determines $u_n$ and equilibrium real wage.

```
W/P
 ↑
 |     WS
 |    ╱
 |   ╱
 |  ╱
 |─────────── PS (horizontal at 1/(1+m))
 |         ╱
 |        ╱
 └────────────→ u
            u_n
```

### Stability of Equilibrium

**To the Right of $u_n$** (unemployment too high):
- Workers demand: $W/P = F(u, z)$ (low, because high $u$)
- Firms offer: $W/P = \frac{1}{1 + m}$ (same as always)
- **Result**: Firms offering **more** than workers demand $\Rightarrow$ Firms hire $\Rightarrow$ $u \downarrow$ (back toward $u_n$)

**To the Left of $u_n$** (unemployment too low):
- Workers demand: $W/P = F(u, z)$ (high, because low $u$)
- Firms offer: $W/P = \frac{1}{1 + m}$ (same as always)
- **Result**: Workers demand **more** than firms offer $\Rightarrow$ Firms reluctant to hire, may fire $\Rightarrow$ $u \uparrow$ (back toward $u_n$)

**Conclusion**: $u_n$ is stable equilibrium.

## 8. Comparative Statics: What Shifts the Natural Rate?

```summary
- The price-setting curve is the rigid one, and it is horizontal, so a shift in either curve can only be absorbed by a **change in $u_n$** — unemployment is the escape valve
- **Bargaining power up ($z \uparrow$)**: richer benefits, employment protection, unions and a higher minimum wage shift wage-setting up and leave price-setting put, so $u_n \uparrow$ — stronger bargaining power buys higher unemployment
- **Markup up ($m \uparrow$)**: less competition, oil shocks and tech market power shift price-setting down and leave wage-setting put, so $u_n \uparrow$ again, with workers settling for a lower real wage
- **Markup down ($m \downarrow$)**: deregulation, trade liberalization and a productivity boom shift price-setting up and $u_n \downarrow$ — the 1990s US took unemployment to ~4% with real wages rising and no inflation
- **Bargaining power down ($z \downarrow$)**: declining unionization and weaker employment protection shift wage-setting down and $u_n \downarrow$; US union membership fell from ~25% in the 1970s to ~10% in the 2000s as $u_n$ slid from ~6-7% to ~4-5%
- France in the 1980s is the $z \uparrow$ case: unemployment climbed from ~6% to 12-15% by the late 1980s, and decades of high unemployment followed
- The 1970s oil shocks — the OPEC embargo and the Iranian revolution — are the $m \uparrow$ case: US unemployment went from 4-5% in the 1960s to 7-10% in the 1970s-1980s, and stagflation with it
```
### 1. Increase in Bargaining Power ($z \uparrow$)

**Examples**:
- Increase in unemployment benefits
- Stricter employment protection laws
- Stronger unions
- Higher minimum wage

**Effect on Wage-Setting**:
- WS curve shifts **up/right**
- For any $u$, workers demand higher $W/P$

**Effect on Price-Setting**:
- PS curve unchanged (firms' markup unaffected)

**New Equilibrium**:
- WS shifts up, but PS is horizontal (real wage can't change in equilibrium)
- **Only way to restore equilibrium**: $u_n \uparrow$
- Higher unemployment reduces workers' bargaining power back down until $W/P$ demand falls to $\frac{1}{1 + m}$

**Mathematical Intuition**:
$$F(u_n, z) = \frac{1}{1 + m}$$
- $z \uparrow$ $\Rightarrow$ $F(\cdot)$ increases (for given $u_n$)
- Right-hand side unchanged
- **Restore equality**: Need $u_n \uparrow$ to bring $F(\cdot)$ back down (since $\frac{\partial F}{\partial u} < 0$)

**Graphical**:
```
W/P
 ↑
 |     WS'(z high)
 |    ╱╱
 |   ╱╱ WS (z low)
 |  ╱╱
 |─────────── PS
 | ╱╱
 |╱╱
 └────────────→ u
    u_n  u_n'
```

**Real-World Example: France (1980s)**
- **Policy**: Major labor market reforms in early 1980s under Mitterrand government
    - Increased employment protection (harder to fire)
    - Expanded unemployment benefits
    - Stronger union rights
    - Higher minimum wage
- **Short-Run**: Real wages rose, workers celebrated
- **Medium-Run**: Unemployment rate soared from ~6% to 12-15% by late 1980s
- **Mechanism**:
    1. $z \uparrow$ $\Rightarrow$ Workers demanded higher wages
    2. Firms couldn't sustain higher real wages (PS curve pinned by markup)
    3. Firms reduced hiring, increased layoffs
    4. Unemployment rose until workers' demands came back down
- **Long-Run**: Decades of high unemployment, slow growth
- **Recent**: France has been gradually unwinding some of these policies (Macron reforms)

### 2. Increase in Markup ($m \uparrow$)

**Examples**:
- Reduced competition (mergers, lax antitrust enforcement)
- Oil price shocks (increases effective markup if not well-measured in value-added)
- Productivity decline (if firms maintain prices, effective markup rises)
- Increased market power (tech monopolies, network effects)

**Effect on Price-Setting**:
- PS curve shifts **down**
- Firms now offer lower real wage: $\frac{W}{P} = \frac{1}{1 + m} \downarrow$

**Effect on Wage-Setting**:
- WS curve unchanged (workers' bargaining power unaffected)

**New Equilibrium**:
- At old $u_n$, workers demand more than firms offer (gap opens)
- **Only way to restore equilibrium**: $u_n \uparrow$
- Higher unemployment reduces workers' wage demands until they accept lower real wage $\frac{1}{1 + m}$

**Mathematical Intuition**:
$$F(u_n, z) = \frac{1}{1 + m}$$
- $m \uparrow$ $\Rightarrow$ Right-hand side $\downarrow$
- Left-hand side unchanged (for given $u_n$)
- **Restore equality**: Need $u_n \uparrow$ to bring $F(u_n, z)$ down (since $\frac{\partial F}{\partial u} < 0$)

**Graphical**:
```
W/P
 ↑
 |     WS
 |    ╱
 |   ╱
 |─────────── PS (m low)
 |  ╱
 |─────────── PS'(m high)
 | ╱
 |╱
 └────────────→ u
    u_n  u_n'
```

**Real-World Example: Oil Shocks (1970s)**
- **Event**: OPEC oil embargo (1973) and Iranian Revolution (1979) $\Rightarrow$ Oil prices quadrupled
- **Effect on Markup**:
    - Firms' costs rose (energy is input)
    - If value-added accounting doesn't fully adjust, effective $m$ rises
    - Real wage firms can afford to pay fell
- **Result**:
    - $u_n$ increased in most advanced economies
    - US unemployment: Rose from 4-5% (1960s) to 7-10% (1970s-1980s)
    - Stagflation: High unemployment + High inflation (next lecture explains inflation part via Phillips Curve)
- **Recovery**: As oil prices stabilized (1980s-1990s), $u_n$ gradually declined

### 3. Decrease in Markup ($m \downarrow$)

**Examples**:
- Increased competition (deregulation, trade liberalization, antitrust enforcement)
- Positive productivity shock ($A \uparrow$ in full model)
- Technological innovation reducing costs

**Effect**: Opposite of markup increase
- PS curve shifts **up**
- Firms can afford to pay higher real wage
- At old $u_n$, firms offer more than workers demand
- **Result**: $u_n \downarrow$ (lower equilibrium unemployment)

**Real-World Example: US (1990s)**
- **Productivity boom**: Tech revolution (internet, computers)
- **Effect**: $A \uparrow$ and/or $m \downarrow$
- **Result**:
    - Unemployment fell to ~4% (below previous estimates of $u_n \approx 6\%$)
    - Real wages rose
    - Low inflation despite tight labor market (productivity gains offset wage pressures)

### 4. Decrease in Bargaining Power ($z \downarrow$)

**Examples**:
- Declining unionization (US since 1970s)
- Reduced unemployment benefits
- Weakening of employment protection

**Effect**: Opposite of bargaining power increase
- WS curve shifts **down/left**
- At old $u_n$, workers demand less than firms offer
- **Result**: $u_n \downarrow$ (lower equilibrium unemployment)

**Real-World Example: US (1980s-2000s)**
- **Union Decline**: Membership fell from ~25% (1970s) to ~10% (2000s)
- **Effect**: $z \downarrow$
- **Result**:
    - $u_n$ declined from ~6-7% (1970s) to ~5% (1990s) to ~4-5% (2000s)
    - Real wage growth moderated (but unemployment lower on average)

## 9. Key Takeaways

```summary
- The labor market is flows, not stocks: a tiny change in the unemployment rate sits on top of millions of monthly moves between jobs, unemployment and inactivity
- **Wage-setting** $W/P^e = F(u, z)$: the real wage falls with unemployment and rises with institutional strength, so the curve slopes down
- **Price-setting** $W/P = 1/(1+m)$: the real wage is set by the firm's markup, not by unemployment, so the curve is horizontal
- **Equilibrium** $F(u_n, z) = 1/(1+m)$ is where the two cross, at correct expectations — and "natural" is a label, not a verdict
- Both comparative statics point the same way: a stronger $z$ or a higher $m$ can only be absorbed by a higher $u_n$
- Next, with $P^e \ne P$ the Phillips Curve turns this into an inflation story: $u < u_n$ pushes wages and prices up
```
### 1. Labor Market Dynamics
- Unemployment rate is not just a stock; massive flows underneath (millions moving each month)
- Job-finding rate strongly countercyclical (hard to find jobs in recessions)
- High unemployment scares workers (bargaining power falls)

### 2. Wage Determination (WS)
$$\frac{W}{P} = F(u, z)$$
- Real wage **decreases** with unemployment (bargaining power channel)
- Real wage **increases** with institutional strength ($z$)
- Downward-sloping curve in $(u, W/P)$ space

### 3. Price Determination (PS)
$$\frac{W}{P} = \frac{1}{1 + m}$$
- Real wage determined by markup (firms' pricing power)
- **Independent** of unemployment (horizontal curve)
- Higher markup $\Rightarrow$ Lower real wage

### 4. Natural Rate of Unemployment ($u_n$)
$$F(u_n, z) = \frac{1}{1 + m}$$
- Equilibrium when $P^e = P$ (correct expectations)
- "Natural" is misleading—it's not optimal or fixed
- Depends on structural factors ($m$, $z$)
- Approximates medium-run average unemployment

### 5. Comparative Statics
- $z \uparrow$ (stronger unions, higher benefits) $\Rightarrow$ $u_n \uparrow$ (paradoxically hurts workers in medium run)
- $m \uparrow$ (less competition, higher markups) $\Rightarrow$ $u_n \uparrow$ (lower real wages or higher unemployment)
- Both shifts lead to higher unemployment (the "escape valve" for restoring equilibrium)

### 6. Why This Matters for Inflation (Next Lecture)
- Today's model determines $u_n$ (medium-run equilibrium)
- But what if $P^e \neq P$? (Expectations wrong)
- **Phillips Curve** will show:
    - When $u < u_n$: Upward pressure on wages/prices (inflation accelerates)
    - When $u > u_n$: Downward pressure on wages/prices (inflation decelerates)
- This connects labor market to inflation dynamics

## 10. Current Policy Relevance (2023)

```summary
- Unemployment at 3.4% sits well below consensus $u_n$ of ~4-5%, so wage pressure is on, and the Fed raises rates to walk $u$ back up toward $u_n$
- Five indicators all read **very tight**: 3.4% unemployment, an EPOP still below trend, 5-6% wage growth, near-record job openings (JOLTS), and a high quits rate
- Unless unemployment rises, those readings mean sustained wage and inflation pressures
- The open question is whether $u_n$ itself has moved: some argued it fell to ~3.5% before COVID, which would make today's unemployment consistent with stable inflation
- Demographics, long COVID and early retirements could instead have *raised* $u_n$
- The Fed is aiming for a soft landing — $u$ up to ~4.5% gently — though unemployment has historically risen by more than 2 percentage points in recessions
```
### Why Is the Fed Keeping Rates High?
1. **Unemployment = 3.4%**: Well below most estimates of $u_n$ (consensus ~4-5%)
2. **Implication**: $u < u_n$ $\Rightarrow$ Wage pressures $\Rightarrow$ Inflation pressures (via Phillips Curve)
3. **Fed Goal**: Raise rates $\Rightarrow$ Slow economy $\Rightarrow$ Raise $u$ toward $u_n$ $\Rightarrow$ Reduce wage/inflation pressures

### Labor Market "Tightness" Indicators
1. **Unemployment Rate**: 3.4% (record low)
2. **EPOP**: Still below trend (missing workers due to early retirements, COVID, etc.)
3. **Wage Growth**: 5-6% year-over-year (above inflation target + productivity growth)
4. **Job Openings**: Near record highs (JOLTS data)
5. **Quits Rate**: High (workers confident they can find better jobs)

All point to **very tight** labor market $\Rightarrow$ Sustained wage/inflation pressures unless unemployment rises.

### Open Questions
1. **Has $u_n$ Changed?**
    - Pre-COVID: Some argued $u_n$ fell to ~3.5% (we sustained it without high inflation)
    - Post-COVID: Demographics, long COVID, early retirements may have raised $u_n$
2. **Will Wage Growth Slow?**
    - If $u_n$ unchanged (~4-5%), need $u$ to rise to cool wages
    - If $u_n$ has fallen (~3.5%), current unemployment consistent with stable inflation
3. **Soft Landing vs. Recession?**
    - Fed hopes to raise $u$ gently (to ~4.5%) without recession
    - History suggests difficult: Unemployment usually rises >2 percentage points in recessions

## 11. Limitations of This Model

```summary
- **Constant markup**: in reality $m$ varies with demand, and whether it is procyclical is left open
- **Constant productivity**: $A = 1$ is an extreme simplification, and growth theory later drops it
- **One labor market**: in reality it is heterogeneous — skilled against unskilled, across sectors and regions, each with its own tightness
- **No capital**: the full model adds investment and capital accumulation
- **Static expectations**: $P^e = P$ is held throughout here; Lecture 9 relaxes it, Lecture 11 puts it back together with demand in IS-LM-PC
```
### What We've Assumed Away
1. **Constant Markup**: In reality, $m$ varies with demand (procyclical?)
2. **Constant Productivity**: $A = 1$ is extreme simplification
3. **One Labor Market**: In reality, heterogeneous (skilled vs. unskilled, sectors, regions)
4. **No Capital**: Full model includes investment, capital accumulation
5. **Static Expectations**: Next lecture relaxes $P^e = P$

### What's Next
- **Lecture 9**: Phillips Curve (what happens when $P^e \neq P$? Inflation dynamics)
- **Lecture 11**: IS-LM-PC model (integrating demand, supply, and inflation)
- **Later**: Growth theory (endogenizing $A$, capital, long-run trends)

## 12. Historical Context: The Natural Rate Debate

```summary
- 1958: the Phillips Curve finds a negative correlation between unemployment and wage growth, and the Keynesian reading is a permanent policy tradeoff
- 1968: Friedman and Phelps deny any long-run tradeoff — holding $u$ below $u_n$ buys low unemployment only at the cost of accelerating inflation
- Stagflation in the 1970s vindicated them: oil shocks raised $u_n$, and pushing unemployment below the new rate delivered high inflation and high unemployment together
- Modern consensus: the natural rate exists, but it is not constant (it moves with $m$ and $z$), not precisely known — the Fed puts it near 4.5 per cent, with a wide band around that — and not normative
- Two puzzles remain: 2018-2019 ran 3.5 per cent unemployment with inflation near 2%, and 2022-2023 brought rapid inflation with unemployment only modestly below the historical $u_n$
```
### Origins (1960s)
- **Phillips Curve Discovery (1958)**: Negative correlation between unemployment and wage growth
- **Keynesian View**: Permanent tradeoff (can choose low unemployment at cost of higher inflation)
- **Friedman-Phelps Critique (1968)**:
    - No long-run tradeoff
    - Only temporary deviations from "natural rate" $u_n$
    - Attempting to keep $u < u_n$ causes accelerating inflation

### Stagflation (1970s)
- High unemployment + High inflation (contradicted simple Phillips Curve)
- Vindicated natural rate view (oil shocks raised $u_n$, attempts to lower $u$ below new $u_n$ caused inflation)

### Modern Consensus
- Natural rate exists but:
    - Not constant (varies over time with $m, z$)
    - Not precisely known (Fed estimates $u_n \approx 4.5\%$ but uncertain)
    - Not normative (not "optimal," just equilibrium)

### Recent Puzzles
- **Pre-COVID (2018-2019)**: $u = 3.5\%$, yet inflation stayed near 2% (was $u_n$ lower than thought?)
- **Post-COVID (2022-2023)**: Rapid inflation despite unemployment only modestly below historical $u_n$ (were there additional shocks? Supply chains? Expectations?)

These puzzles motivate ongoing research in labor macroeconomics.

---

**Next Lecture**: The Phillips Curve (connecting unemployment to inflation dynamics)
