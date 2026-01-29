export const calculateMultiplier = (mpc: number): number => {
  return 1 / (1 - mpc)
}

export const calculateEquilibriumOutput = (
  c0: number,
  mpc: number,
  investment: number,
  governmentSpending: number,
  taxes: number,
): number => {
  const multiplier = calculateMultiplier(mpc)
  return multiplier * (c0 + investment + governmentSpending - mpc * taxes)
}

export const calculateConsumption = (
  c0: number,
  mpc: number,
  income: number,
  taxes: number,
): number => {
  return c0 + mpc * (income - taxes)
}

export const calculateAggregateSupply = (price: number, naturalRate: number): number => {
  return naturalRate + (price - 1) * 100
}

export const calculateInflationFromPhillipsCurve = (
  unemployment: number,
  naturalRate: number,
  expectedInflation: number,
  sensitivity: number = 1,
): number => {
  return expectedInflation - sensitivity * (unemployment - naturalRate)
}

export const calculateRealInterestRate = (nominalRate: number, expectedInflation: number): number => {
  return nominalRate - expectedInflation
}

export const calculateBondPrice = (
  coupon: number,
  faceValue: number,
  yearsToMaturity: number,
  discountRate: number,
): number => {
  let price = 0
  for (let t = 1; t <= yearsToMaturity; t++) {
    price += coupon / Math.pow(1 + discountRate, t)
  }
  price += faceValue / Math.pow(1 + discountRate, yearsToMaturity)
  return price
}

export const calculateEquityPrice = (
  dividend: number,
  dividendGrowth: number,
  requiredReturn: number,
): number => {
  if (requiredReturn <= dividendGrowth) return Infinity
  return (dividend * (1 + dividendGrowth)) / (requiredReturn - dividendGrowth)
}

export const calculateSolowSteadyState = (
  savingsRate: number,
  populationGrowth: number,
  depreciationRate: number,
  alpha: number = 0.3,
): number => {
  const k = Math.pow(savingsRate / (populationGrowth + depreciationRate), 1 / (1 - alpha))
  return k
}

export const calculateLaborMarketEquilibrium = (
  bargainingPower: number,
  markup: number,
  unemploymentRate: number,
): { realWage: number; inflation: number } => {
  const realWage = bargainingPower * (1 - unemploymentRate)
  const inflation = (1 / markup - realWage) * 100
  return { realWage, inflation }
}

export const generateMultiplierRounds = (
  initialShock: number,
  mpc: number,
  rounds: number = 10,
): { round: number; change: number; cumulative: number }[] => {
  const results = []
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

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export const formatPercent = (num: number, decimals: number = 1): string => {
  return `${formatNumber(num * 100, decimals)}%`
}
