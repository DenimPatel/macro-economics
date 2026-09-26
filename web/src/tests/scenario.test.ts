import { describe, expect, it } from 'vitest'
import { decodeScenario, encodeScenario, scenarioFromSearch } from '../lib/scenario'

describe('scenario links', () => {
  it('round-trips a scenario', () => {
    const scenario = { toolId: 'is-lm-explorer' as const, params: { G: 150, M: 100 } }
    const decoded = decodeScenario(encodeScenario(scenario))
    expect(decoded).toEqual(scenario)
  })

  it('produces a URL-safe token', () => {
    const encoded = encodeScenario({ toolId: 'solow-simulator' as const, params: { s: 0.2 } })
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
  })

  it('reads a scenario from a search string', () => {
    const token = encodeScenario({ toolId: 'phillips-curve' as const, params: { u: 6 } })
    const scenario = scenarioFromSearch(`?s=${token}`)
    expect(scenario?.toolId).toBe('phillips-curve')
    expect(scenario?.params.u).toBe(6)
  })

  it('returns null for invalid input', () => {
    expect(decodeScenario('not-base64!!')).toBeNull()
    expect(scenarioFromSearch('?s=zzzz')).toBeNull()
    expect(scenarioFromSearch('')).toBeNull()
  })
})
