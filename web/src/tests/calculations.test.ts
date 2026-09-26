import { describe, expect, it } from 'vitest'
import {
  calculateBondPrice,
  calculateEquilibriumOutput,
  calculateInflationFromPhillipsCurve,
  calculateMultiplier,
  calculateRealInterestRate,
  calculateSolowSteadyState,
  formatNumber,
  generateMultiplierRounds,
} from '../lib/calculations'

describe('calculations', () => {
  it('computes the multiplier from the MPC', () => {
    expect(calculateMultiplier(0.6)).toBeCloseTo(2.5)
    expect(calculateMultiplier(0.5)).toBeCloseTo(2)
  })

  it('computes goods-market equilibrium output', () => {
    // multiplier 2.5 * (100 + 100 + 100 - 0.6*100) = 2.5 * 240 = 600
    expect(calculateEquilibriumOutput(100, 0.6, 100, 100, 100)).toBeCloseTo(600)
  })

  it('applies the Fisher equation', () => {
    expect(calculateRealInterestRate(5, 2)).toBeCloseTo(3)
    expect(calculateRealInterestRate(2, 4)).toBeCloseTo(-2)
  })

  it('prices a zero-coupon bond', () => {
    expect(calculateBondPrice(0, 100, 1, 0.05)).toBeCloseTo(95.238, 2)
  })

  it('prices a coupon bond at par when the coupon equals the discount rate', () => {
    const price = calculateBondPrice(5, 100, 3, 0.05)
    expect(price).toBeCloseTo(100, 1)
  })

  it('computes a positive Solow steady state', () => {
    const k = calculateSolowSteadyState(0.2, 0.01, 0.05, 0.3)
    expect(k).toBeGreaterThan(0)
  })

  it('maps unemployment above the natural rate to lower inflation', () => {
    const inflation = calculateInflationFromPhillipsCurve(6, 5, 2, 1)
    expect(inflation).toBeCloseTo(1)
  })

  it('accumulates multiplier rounds toward the multiplier limit', () => {
    const rounds = generateMultiplierRounds(1, 0.5, 40)
    expect(rounds[0].change).toBeCloseTo(1)
    expect(rounds[rounds.length - 1].cumulative).toBeCloseTo(2, 2)
  })

  it('formats numbers with fixed decimals', () => {
    expect(formatNumber(1234.5)).toBe('1,234.50')
  })
})
