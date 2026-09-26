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
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  return atob(padded + pad)
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
