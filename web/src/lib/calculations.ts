/**
 * The formulas more than one place has to agree on.
 *
 * This file once held thirteen exports and eleven of them had no caller
 * anywhere in the product, while the tools a reader actually opens re-derived
 * every formula inline: the bond present value written out character for
 * character in two tools, the Solow steady state written out twice inside one
 * tool. That is the worst of both states at once — a green test asserting a
 * function nobody can reach, and a triplicated expression in the code that
 * actually runs. Nothing forces two written-out copies of an expression to stay
 * the same expression; the day one of them is revised, the tool prints two
 * different answers side by side and both look authoritative.
 *
 * SO THE RULE IS NARROW ON PURPOSE. A formula belongs here when TWO places
 * compute it and the two have to keep agreeing. Not because it is a formula,
 * and not because it might be wanted later — that second reason is how the
 * thirteen arrived. Everything else belongs to the tool that owns the model,
 * written beside the controls that drive it and commented with the equation it
 * evaluates.
 *
 * What is here, and who depends on it:
 *
 *   calculateBondPrice        AssetPricing, CrisisSvb
 *   calculateSolowSteadyState SolowSimulator
 *   generateMultiplierRounds  MultiplicerSimulator
 *   formatNumber              MultiplicerSimulator, ModernISCurve
 *
 * A fifth, `calculateLaborMarketEquilibrium`, was here until it was deleted
 * rather than documented. It took an `unemploymentRate`, computed
 * `bargainingPower * (1 - unemploymentRate)` and then multiplied the result by
 * 100, which is only meaningful if that parameter is a FRACTION — so a caller
 * passing `5` for "5 percent" gets a real wage of zero and an inflation of
 * several hundred percent, silently. With no caller the question was never
 * forced, and a function whose one hard question is a unit it does not state is
 * a trap rather than a function.
 *
 * `tests/calculations.test.ts` covers what is here, including the assertion that
 * these are the only copies. `tests/modelValues.test.tsx` covers the numbers a
 * reader actually sees, which is the coverage the eleven dead exports were
 * standing in for.
 */

/**
 * Bond present value: what a stream of coupons plus the principal is worth
 * today.
 *
 *   P = C · [1 − (1+r)⁻ⁿ] / r  +  FV · (1+r)⁻ⁿ
 *
 * `couponPercent` and `discountRatePercent` are PERCENTAGES, and the names say
 * so because the unit is the whole answer: both calling tools' sliders print
 * their rates with `unit="%"`, and an earlier version of this file took a
 * FRACTION instead and had no caller, which is a conversion waiting for someone
 * to forget it. `faceValue` defaults to 100, the par both tools assume, and the
 * annual payment is `couponPercent / 100 × faceValue` — which is why writing
 * `coupon` straight into the annuity was right at a face of 100 and would have
 * been a 10× error at any other one.
 *
 * r = 0 IS DEFINED for a bond, unlike a Gordon price at r ≤ g, so it must not
 * come back as a gap or a zero. At a zero discount rate nothing is discounted
 * and the value is the undiscounted sum C·n + FV, which is the limit of the
 * formula as r → 0+ — the model's own answer rather than a patch. Without the
 * branch below the annuity is 0/0: the bracket `1 − (1+r)⁻ⁿ` is exactly zero and
 * so is the divisor `r`, and `NaN.toFixed(2)` is the string `"NaN"`, so the
 * tile reads NaN with no error thrown anywhere. Both callers can reach r = 0:
 * AssetPricing's 0–10 discount-rate sweep begins there at EVERY parameter set,
 * and CrisisSvb's Federal Funds Rate slider has `min={0}`.
 */
export const calculateBondPrice = (
  couponPercent: number,
  years: number,
  discountRatePercent: number,
  faceValue: number = 100,
): number => {
  const annualPayment = (couponPercent / 100) * faceValue
  if (discountRatePercent === 0) return annualPayment * years + faceValue
  const r = discountRatePercent / 100
  return (
    (annualPayment * (1 - Math.pow(1 + r, -years))) / r + faceValue / Math.pow(1 + r, years)
  )
}

/**
 * Solow steady-state capital per worker:  k* = (s / (n + δ))^(1 / (1 − α)).
 *
 * All four inputs are FRACTIONS, not percentages, and the argument names and
 * the Solow sliders agree on that: the tool prints `0.20` for a 20% savings
 * rate and `0.020` for 2% population growth, so a caller reading the call site
 * cannot get the unit wrong.
 *
 * This lived inside `SolowSimulator` twice — once for the headline tile and the
 * Base card, once for the two fixed reference cards — and that is the reason it
 * is here rather than written out again. A steady state the tiles and the
 * scenario cards compute separately is a steady state that can disagree with
 * itself, and nothing in the tool would report it.
 */
export const calculateSolowSteadyState = (
  savingsRate: number,
  populationGrowth: number,
  depreciationRate: number,
  alpha: number = 0.3,
): number => {
  return Math.pow(savingsRate / (populationGrowth + depreciationRate), 1 / (1 - alpha))
}

/**
 * The round-by-round cascade of a Keynesian spending multiplier: round i spends
 * `initialShock · mpcⁱ`, and the cumulative column is the running total the
 * `MultiplicerSimulator` chart plots and its table prints.
 *
 * The values are rounded to four places on the way out, which is what the tool's
 * own table shows; the geometric sum itself is exact and is not what is being
 * reported here.
 */
export const generateMultiplierRounds = (
  initialShock: number,
  mpc: number,
  rounds: number = 10,
): { round: number; change: number; cumulative: number }[] => {
  const results: { round: number; change: number; cumulative: number }[] = []
  let cumulative = 0

  for (let i = 0; i < rounds; i++) {
    const change = initialShock * Math.pow(mpc, i)
    cumulative += change
    results.push({
      round: i + 1,
      change: parseFloat(change.toFixed(4)),
      cumulative: parseFloat(cumulative.toFixed(4)),
    })
  }

  return results
}

/**
 * A number as the string a reader reads: fixed decimals, thousands separators,
 * `en-US` grouping.
 *
 * NON-FINITE INPUT RETURNS AN EM DASH — not `"NaN"`, not `"∞"`. Both used to
 * pass straight through, because `NaN.toLocaleString()` is the string `"NaN"`
 * and `Infinity.toLocaleString()` is `"∞"`, and every caller hands the result to
 * a `StatBox` or a chart tooltip. So a division by zero anywhere upstream used
 * to reach a reader as a number-shaped claim with no error logged and nothing on
 * the page to notice. A dash is the same mark `AssetPricing` uses for a Gordon
 * price the model cannot produce and `SpeculativeAttack` uses for a break period
 * that has not happened, so "there is no number here" is one glyph across the
 * site rather than four, and it is honest in a way that neither `"NaN"` nor a
 * substituted `0` is not.
 *
 * A caller that decorates the result owns the punctuation it puts around it, so
 * a dash inside a `%` template reads `—%`. Neither caller can reach it — both
 * take slider-bounded values — and it is still better than a percentage of NaN.
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  if (!Number.isFinite(num)) return '—'
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
