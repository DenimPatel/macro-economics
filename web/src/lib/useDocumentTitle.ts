import { useEffect } from 'react'

const SITE = 'MacroEconomics'
const DEFAULT_DESCRIPTION =
  'Interactive macroeconomics: 25 lectures, live simulation tools, crisis case studies, and a real-data explorer.'

/**
 * Per-route document title and description.
 *
 * A single-page app otherwise leaves every tab, every bookmark, and every
 * search result reading "MacroEconomics — Interactive Course", which makes the
 * 25 lectures indistinguishable from each other in a browser history.
 */
export function useDocumentTitle(title?: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE}` : `${SITE} — Interactive Course`

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description ?? DEFAULT_DESCRIPTION
  }, [title, description])
}
