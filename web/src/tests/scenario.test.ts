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

  /**
   * The share key is a control's visible LABEL, and the labels on this site
   * are written in the notation the course uses: `c₀`, `ΔY`, `β`, `μ`, `π`,
   * `α`, `σ`, `γ`, `δ`. Twenty-seven of them across eleven of the twenty tools
   * are outside Latin-1, and `btoa` is specified to THROW on those rather than
   * to mangle them — so before the encoder took UTF-8 bytes, the share button
   * on those eleven tools could not build a link at all, and the failure
   * surfaced as "the clipboard was not available".
   *
   * The assertion is a round trip on a real label rather than a note about
   * `btoa`, because the defect was never that `btoa` exists: it is that the
   * label a reader sees is the label the link has to carry, and nothing held
   * the two together.
   */
  it('carries a control label the course actually writes', () => {
    const scenario = {
      toolId: 'fiscal-policy-experiments' as const,
      params: { 'Autonomous Consumption (c₀)': 140, 'Change in Taxes (ΔT)': -20 },
    }
    expect(decodeScenario(encodeScenario(scenario))).toEqual(scenario)
  })

  /**
   * And the wire format has not moved for anyone: UTF-8 of an ASCII string is
   * that string's own bytes, so a link encoded before this change still decodes
   * to the same payload. Asserted against `btoa` directly rather than against a
   * golden string, so it is a property of the encoding and not a snapshot.
   */
  it('leaves an ASCII link byte-for-byte what it always was', () => {
    const ascii = JSON.stringify({ toolId: 'solow-simulator', params: { s: 0.2 } })
    const legacy = btoa(ascii).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    expect(encodeScenario({ toolId: 'solow-simulator' as const, params: { s: 0.2 } })).toBe(legacy)
    // …and a legacy token still decodes, which is the half that matters to a
    // link already sitting in somebody's chat history.
    expect(decodeScenario(legacy)?.params).toEqual({ s: 0.2 })
  })
})
