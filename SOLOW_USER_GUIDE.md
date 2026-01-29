# Solow Growth Model Simulator - Quick Reference Guide

## What This Tool Does

The Solow Growth Model Simulator helps you understand how **capital accumulation** and **factor productivity** determine long-run economic growth. It demonstrates why **technology, not savings, drives long-run growth**.

## The Key Economic Insight

In steady state:
- **Savings rate** determines HOW RICH we are (level of k* and y*)
- **Population growth** determines HOW FAST we grow (growth rate = n)
- **Technology** is needed to permanently increase growth

## How to Use

### 1. Understand the Default Setup
- Savings Rate: 20% (s = 0.2)
- Population Growth: 2% (n = 0.02)
- Depreciation: 5% (δ = 0.05)
- Capital Share: 30% (α = 0.3)

### 2. Read the Results
The top stats show:
- **k*** = steady-state capital per worker
- **y*** = steady-state output per worker
- **Growth Rate** = n (2% in default case)
- **Convergence Time** = years to reach 90% of k*

### 3. View the Solow Diagram
- **Blue area** = production function (how much output from each unit of capital)
- **Green area** = investment (how much we save/invest per unit of capital)
- **Red line** = depreciation (capital wearing away + population dilution)
- **Intersection** = equilibrium where investment = depreciation

### 4. Watch the Time Path
Shows how capital per worker evolves over 100 years:
- Starts at k₀ (your chosen initial capital)
- Moves toward k* (the steady state)
- Slows down as it approaches k* (diminishing marginal returns)

### 5. Try the Scenarios

#### Scenario: Increase Savings (0.2 → 0.35)
Click "High Savings (s=0.35)" and notice:
- ✓ k* increases (richer economy)
- ✓ y* increases (higher output per worker)
- ✗ Growth rate STAYS at 2%!

**Why?** Higher savings means faster accumulation initially, but once at higher capital level, growth slows to match population growth. Rich countries save more but don't grow faster in steady state.

#### Scenario: Lower Population Growth (0.02 → 0.01)
Click "Low Growth (n=0.01)" and notice:
- ✓ k* increases (more capital per worker)
- ✓ y* increases (more output per worker)
- ✓ Growth rate INCREASES to 1%!

**Why?** With slower population growth, capital per worker grows faster in steady state. Japan/Europe with low population growth can sustain higher per-capita growth than fast-growing developing countries.

## Explore With Sliders

### What happens when you...

**Increase Savings Rate:**
- k* goes up → economy becomes richer
- Temporary growth acceleration (during transition)
- Long-run growth rate unchanged
- Example: China's high savings in 1990s-2010s

**Decrease Depreciation:**
- k* goes up → less capital worn away
- y* increases → more productive capital stock
- Slower convergence → takes longer to reach new k*
- Example: Better infrastructure maintenance

**Increase Population Growth:**
- k* goes down → more people dilutes capital
- Economy becomes poorer (lower y*)
- Faster growth rate but lower level
- Example: Sub-Saharan Africa vs. Japan

**Increase Capital Share (α):**
- Production more dependent on capital
- k* increases (capital becomes more valuable)
- Larger convergence speed (faster adjustment)

**Start from High k₀:**
- If you start above k*, depreciation > investment
- Capital per worker falls back toward k*
- Shows economy "adjusts down" if too much capital

**Start from Low k₀:**
- If you start below k*, investment > depreciation
- Capital per worker grows toward k*
- Shows convergence from poor to rich steady state

## The Four Key Lessons

### 1. Diminishing Returns to Capital
- Y = K^α with α = 0.3 means y is curved, not linear
- Each extra unit of capital is less productive than the last
- Rich countries with high k grow slower than poor countries
- This is why growth slows as economy develops

### 2. Convergence is Possible
- If two countries have same (s, n, δ, α), they converge to same k*
- Poor country with low k grows faster (catch-up)
- East Asian "miracle" (1960s-1990s): Fast growth by catching up
- But convergence requires same parameters (institutions, technology)

### 3. Technology Drives Long-Run Growth
- In pure Solow model, steady-state growth = n (population growth)
- To grow faster, need y = A·k^α with A increasing
- A = "total factor productivity" or "technology"
- Growth accounting shows A (tech) is most important source of growth

### 4. Why Savings Rate Doesn't Matter for Growth
- Intuition: More savings → faster capital accumulation initially
- But once capital stock is high, capital deepening slows
- Workers have lots of capital already; adding more helps less
- Growth eventually just matches population growth regardless of s

## Common Experiments to Try

| Goal | How to Get There | What to Observe |
|------|-----------------|-----------------|
| See catch-up growth | Low k₀ (0.5) | Fast initial growth, slows near k* |
| Compare poor vs rich | Run with k₀=0.5 and k₀=2.5 | Rich country has less convergence time |
| Effect of policy | Adjust depreciation (infrastructure) | k* increases with better maintenance |
| Growth without savings | Keep s constant, increase n | Better growth rate despite same savings |
| Why Asia caught up | High s, low n, start from low k₀ | Rapid convergence to high k* |

## The Math (If You Care)

The core equation for convergence is:
```
k(t+1) = s·k(t)^α / (1+n) + (1-δ)·k(t) / (1+n)
```

This updates capital per worker based on:
- Investment from savings: s·k^α
- Capital remaining after depreciation: (1-δ)·k
- Dilution from population growth: divide by (1+n)

At steady state, k(t+1) = k(t) = k*, which gives:
```
k* = (s / (n+δ))^(1/(1-α))
```

The convergence speed is FASTEST when far from k*, and SLOWEST near k* (because diminishing returns flatten out the dynamics).

## Key Takeaway for Policy

- **For richer country:** Increase technology/productivity (not captured in this model)
- **For poorer country:** Could increase savings OR lower population growth OR improve institutions
- **For all countries:** Focus on institutions and technology for long-run growth
- **Savings matters** for transitional growth and living standards (level), but NOT for long-run per-capita growth rate

---

**Remember:** This model explains why all developed countries eventually grow at similar rates (~2-3% per capita) despite huge differences in savings rates. The answer: technology convergence, not capital deepening.
