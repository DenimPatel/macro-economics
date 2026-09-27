import type { RefObject } from 'react'
import { useEffect } from 'react'

/**
 * One lookup-search rule for the three pages that have one.
 *
 * The site grew three search surfaces in three passes and they did not agree.
 * The tool index matched every word of the query against a tool's title and
 * description; the glossary matched one substring against a term and a
 * definition, so `money multiplier` — the phrase a reader types, and the name
 * the course uses elsewhere — found nothing, while `multi` found a dozen
 * entries nobody wanted. Two search boxes that behave differently is worse than
 * one: the second one teaches the reader that the first one is unreliable.
 *
 * So the rule is the tool index's, in one function, and both now call it:
 *
 *  - Split on whitespace. Every word must appear somewhere in the haystack,
 *    case-insensitively. Word order is ignored, so "curve phillips" and
 *    "phillips curve" are the same query, which is what a reader who is
 *    hunting by memory types.
 *  - Substring, not fuzzy. A reader who mistypes gets nothing, and every
 *    surface that can return nothing has an empty state that says so and
 *    offers a way back. Fuzzy matching would quietly reorder a
 *    hand-checked alphabetical list, and an index whose order moves under the
 *    reader is not an index.
 *  - The haystack is the caller's, because what a term is made of is a fact
 *    about the surface: a glossary entry searches its term AND its
 *    definition, because the definition is where the distinguishing words
 *    are. A concept-map card searches its concepts AND the lecture title,
 *    because "Phillips" is a concept name on nine cards and a lecture title
 *    on none of them.
 */
export function matchesAllWords(haystack: string, query: string): boolean {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (words.length === 0) return true
  const text = haystack.toLowerCase()
  return words.every((word) => text.includes(word))
}

/** "12 of 35" — one string, so every lookup page counts the same way. */
export function matchCount(shown: number, total: number): string {
  return `${shown} of ${total}`
}

/**
 * The `/` shortcut, and the collision analysis that decides it is safe.
 *
 * A page-level key handler takes a key away from the reader, and the
 * obligation is to enumerate what the key was already doing:
 *
 *  - `/` is unmodified punctuation. Nothing types it into prose except a
 *    reader who is typing, and a reader who is typing is inside a control —
 *    the guard below returns for every `input`, `textarea`, `select` and
 *    `contenteditable`, so the field's own value is never hijacked. This is
 *    the same guard `LecturePage`'s `[`/`]` handler uses, for the same reason.
 *  - Any modifier disqualifies the event. Firefox's quick-find, Chrome's and
 *    Safari's, are `/` with a modifier, and a handler that ran on those would
 *    steal a shortcut that already exists rather than collide with nothing.
 *  - Inert behind a modal, for the same reason Escape is: Escape belongs to
 *    whatever is open. The settings dialog carries `aria-modal="true"`, so
 *    pressing `/` with it open focuses a field the reader cannot see.
 *  - `event.key`, not `event.code`, so the slash pressed is the slash the
 *    reader's layout produces. `/` is `Shift+7` on a US layout; `event.code`
 *    would fire on the 7 of a French AZERTY.
 *  - `/` does not scroll. It is the one character a reader is least likely to
 *    need to type, and the search field is the only thing it can do.
 *  - Discoverable: the hint is printed next to the field, so the shortcut is
 *    advertised on the page rather than being folklore.
 *  - `preventDefault()` is called only when the focus actually moves. A
 *    `/` that does not move the focus stays available to the browser.
 */
export function useSearchFocusShortcut(
  inputRef: RefObject<HTMLInputElement | null>,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.key !== '/') return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          (typeof target.closest === 'function' && target.closest('[contenteditable="true"]')))
      ) {
        return
      }
      if (document.querySelector('[aria-modal="true"]')) return
      const input = inputRef.current
      if (!input) return
      event.preventDefault()
      input.focus()
      input.select()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [inputRef, enabled])
}
