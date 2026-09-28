/**
 * Shareable scenario links. A tool's parameters are encoded into a base64url
 * query parameter so a configuration can be pasted into chat or an assignment.
 *
 * `saveScenario`/`loadScenario` in `sharing.ts` remain for file export; these
 * helpers are for URLs.
 */
import type { ToolId } from '../../../content/lectures'
import type { ScenarioParams } from '../store'

export interface Scenario {
  toolId: ToolId
  params: ScenarioParams
}

function toBase64Url(value: string): string {
  return btoa(toBinaryString(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return fromBinaryString(atob(padded + pad))
}

/**
 * The payload is base64'd as UTF-8 BYTES rather than as the string's own code
 * units, because the share key is a control's visible LABEL and 27 of them
 * across eleven of the twenty tools are not Latin-1: `Autonomous Consumption
 * (c₀)`, `Output Change (ΔY)`, `Firm Markup (μ)`, `Capital Share (α)`,
 * `Expected Inflation (π)`, `Depreciation Rate (δ)`.
 *
 * `btoa` is specified to throw `InvalidCharacterError` on a character above
 * U+00FF, so it threw on all of them, and it threw INSIDE the share button's
 * try block — which is why the button's failure state existed for a tool whose
 * link could never have been built, and why the message under it claimed an
 * address bar that had nothing in it. The bug was invisible from the tool
 * page: the control looked like it had failed to copy.
 *
 * For a payload that was ASCII to begin with — which is every link that ever
 * worked — the UTF-8 bytes are the string's own code units, so the encoding is
 * byte-for-byte the old one and every existing link still decodes. The decode
 * half mirrors it, and a legacy ASCII link decodes to the same string, so this
 * is additive in both directions.
 */
function toBinaryString(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  // A chunked loop rather than `String.fromCharCode(...bytes)`: the spread
  // passes every byte as an argument, and a lecture-sized payload would blow
  // the argument limit on a page whose whole subject is long text.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return binary
}

function fromBinaryString(binary: string): string {
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function encodeScenario(scenario: Scenario): string {
  return toBase64Url(JSON.stringify(scenario))
}

export function decodeScenario(encoded: string): Scenario | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as Scenario
    if (!parsed || typeof parsed.toolId !== 'string' || typeof parsed.params !== 'object') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

/** Read a `?s=` scenario from a search string. */
export function scenarioFromSearch(search: string): Scenario | null {
  const encoded = new URLSearchParams(search).get('s')
  return encoded ? decodeScenario(encoded) : null
}

/** Build a shareable absolute URL for a tool scenario. */
export function scenarioUrl(toolId: ToolId, params: ScenarioParams): string {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}tool/${toolId}`
  return `${base}?s=${encodeScenario({ toolId, params })}`
}
