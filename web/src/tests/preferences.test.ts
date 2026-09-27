import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_COLOR } from '../design/tokens'
import {
  DEFAULT_PREFERENCES,
  LEGACY_THEME_STORAGE_KEY,
  LINE_HEIGHT_VALUE,
  MEASURE_CH,
  PREF_STORAGE_KEY,
  PREF_STORAGE_VERSION,
  SPACE_SCALE,
  TEXT_SCALES,
} from '../lib/preferences'

/**
 * The preferences layer is the one module every later change to reading,
 * viewing, and interaction runs through, so these tests are about the
 * contract as much as the code: what is stored, what is accepted, what
 * reaches the document, and what happens when the browser is hostile.
 *
 * Every case re-imports the module so it observes a fresh store, the way a
 * page load would. `vi.resetModules()` alone is not enough: the store is a
 * module-level singleton, and localStorage is what seeds it.
 *
 * The static imports above are only used for the constants the
 * no-flash-script test compares against; those are the same in every
 * instance of the module, so the reload in `freshPrefs` does not matter.
 */

const INDEX_HTML = readFileSync(join(__dirname, '..', '..', 'index.html'), 'utf8')
/** `index.css` with its comments stripped, so a declaration inside prose is
 *  not mistaken for a rule. */
const INDEX_CSS = readFileSync(join(__dirname, '..', 'index.css'), 'utf8').replace(
  /\/\*[\s\S]*?\*\//g,
  '',
)

type Prefs = typeof import('../lib/preferences')

/** A fresh module, seeded from whatever is in storage right now. */
async function freshPrefs(): Promise<Prefs> {
  vi.resetModules()
  return import('../lib/preferences')
}

function clearStorage(): void {
  try {
    window.localStorage.clear()
  } catch {
    /* a previous case may have left a hostile storage in place */
  }
  const root = document.documentElement
  root.removeAttribute('style')
  for (const attribute of [
    'data-pref-theme',
    'data-pref-density',
    'data-pref-motion',
    'data-pref-measure',
    'data-pref-line-height',
    'data-pref-focus',
  ]) {
    root.removeAttribute(attribute)
  }
  root.classList.remove('dark')
}


/** Install a controllable `matchMedia` and restore it afterwards. */
function stubMatchMedia(initial: 'light' | 'dark') {
  let scheme = initial
  const listeners = new Set<() => void>()
  const original = window.matchMedia
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes('dark') ? scheme === 'dark' : false
    },
    media: query,
    onchange: null,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
    addListener: (fn: () => void) => listeners.add(fn),
    removeListener: (fn: () => void) => listeners.delete(fn),
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia

  return {
    set(next: 'light' | 'dark') {
      scheme = next
      for (const fn of listeners) fn()
    },
    listeners,
    restore() {
      window.matchMedia = original
    },
  }
}

beforeEach(clearStorage)
afterEach(clearStorage)

/** A localStorage whose every method throws, as in a locked-down profile. */
function breakStorage(): void {
  const hostile = {
    get length(): number {
      throw new Error('denied')
    },
    clear: () => {
      throw new Error('denied')
    },
    getItem: () => {
      throw new Error('denied')
    },
    key: () => {
      throw new Error('denied')
    },
    removeItem: () => {
      throw new Error('denied')
    },
    setItem: () => {
      throw new Error('denied')
    },
  }
  Object.defineProperty(window, 'localStorage', { value: hostile, configurable: true })
}

describe('preferences: defaults', () => {
  it('starts from the documented defaults with nothing stored', async () => {
    const prefs = await freshPrefs()
    expect(prefs.readPreferences()).toEqual({
      theme: 'system',
      textScale: 1,
      measure: 'normal',
      lineHeight: 'normal',
      density: 'comfortable',
      motion: 'system',
      chartGrid: true,
      focusMode: false,
    })
    expect(prefs.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })
  })

  it('exposes every accepted value of every enum', async () => {
    const prefs = await freshPrefs()
    expect(prefs.TEXT_SCALES).toEqual([0.9, 1, 1.15, 1.3])
    expect(Object.keys(prefs.MEASURE_CH)).toEqual(['narrow', 'normal', 'wide'])
    expect(Object.keys(prefs.LINE_HEIGHT_VALUE)).toEqual(['tight', 'normal', 'relaxed'])
    expect(Object.keys(prefs.SPACE_SCALE)).toEqual(['compact', 'comfortable', 'spacious'])
    expect(Object.keys(prefs.MOTION_SCALE)).toEqual(['system', 'reduced', 'full'])
  })

  it('resolves theme: system from the OS, and an explicit pref from nothing else', async () => {
    const media = stubMatchMedia('dark')
    try {
      const prefs = await freshPrefs()
      expect(prefs.resolveTheme('system')).toBe('dark')
      expect(prefs.resolveTheme('light')).toBe('light')
      expect(prefs.resolveTheme('dark')).toBe('dark')
    } finally {
      media.restore()
    }
  })
})

describe('preferences: persistence', () => {
  it('round-trips a full preference set through localStorage', async () => {
    const first = await freshPrefs()
    first.usePreferences.getState().set('density', 'compact')
    first.usePreferences.getState().set('measure', 'wide')
    first.usePreferences.getState().set('textScale', 1.3)
    first.usePreferences.getState().set('lineHeight', 'relaxed')
    first.usePreferences.getState().set('chartGrid', false)
    first.usePreferences.getState().set('focusMode', true)

    // The envelope is versioned, so a later build can tell what it is
    // looking at instead of guessing.
    const stored = JSON.parse(window.localStorage.getItem('macro-prefs') as string)
    expect(stored.v).toBe(1)
    expect(stored.prefs.density).toBe('compact')
    expect(stored.prefs.measure).toBe('wide')
    expect(stored.prefs.textScale).toBe(1.3)
    expect(stored.prefs.lineHeight).toBe('relaxed')
    expect(stored.prefs.chartGrid).toBe(false)
    expect(stored.prefs.focusMode).toBe(true)

    // A reload — new module, same storage — sees the same thing.
    const second = await freshPrefs()
    expect(second.readPreferences()).toEqual(first.readPreferences())
  })

  it('round-trips a single preference change per session without leaking the others', async () => {
    const first = await freshPrefs()
    first.usePreferences.getState().set('density', 'spacious')
    first.usePreferences.getState().set('theme', 'dark')
    const second = await freshPrefs()
    expect(second.readPreferences().density).toBe('spacious')
    expect(second.readPreferences().theme).toBe('dark')
    expect(second.readPreferences().measure).toBe('normal')
  })

  it('falls back to defaults on corrupt JSON, without throwing', async () => {
    window.localStorage.setItem('macro-prefs', '{not json at all')
    const prefs = await freshPrefs()
    expect(() => prefs.readPreferences()).not.toThrow()
    expect(prefs.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })
  })

  it('falls back to defaults when the stored value is JSON but not a shape', async () => {
    for (const raw of ['null', '[]', '"dark"', '42']) {
      clearStorage()
      window.localStorage.setItem('macro-prefs', raw)
      const prefs = await freshPrefs()
      expect(prefs.readPreferences(), raw).toEqual({ ...prefs.DEFAULT_PREFERENCES })
    }
  })

  it('merges a partial stored shape over the defaults', async () => {
    window.localStorage.setItem(
      'macro-prefs',
      JSON.stringify({ v: 1, prefs: { density: 'compact', focusMode: true } }),
    )
    const prefs = await freshPrefs()
    expect(prefs.readPreferences()).toEqual({
      ...prefs.DEFAULT_PREFERENCES,
      density: 'compact',
      focusMode: true,
    })
  })

  it('accepts an unversioned bare preference object, and drops unknown keys', async () => {
    // The shape a build without a version field would have written.
    window.localStorage.setItem(
      'macro-prefs',
      JSON.stringify({ density: 'compact', somethingRemoved: 42, nested: { a: 1 } }),
    )
    const prefs = await freshPrefs()
    expect(prefs.readPreferences().density).toBe('compact')
    expect(Object.keys(prefs.readPreferences()).sort()).toEqual(
      Object.keys(prefs.DEFAULT_PREFERENCES).sort(),
    )
  })

  it('drops values that fail validation and keeps the default for that key', async () => {
    window.localStorage.setItem(
      'macro-prefs',
      JSON.stringify({
        v: 1,
        prefs: {
          theme: 'ultraviolet',
          measure: 42,
          density: 'COSY',
          textScale: 1.07,
          lineHeight: null,
          chartGrid: 'yes',
          focusMode: 1,
        },
      }),
    )
    const prefs = await freshPrefs()
    expect(prefs.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })
  })

  it('ignores a payload written by a newer version', async () => {
    window.localStorage.setItem(
      'macro-prefs',
      JSON.stringify({ v: 99, prefs: { density: 'compact', measure: 'wide' } }),
    )
    const prefs = await freshPrefs()
    expect(prefs.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })
  })

  it('adopts the pre-preferences theme key when there is no envelope at all', async () => {
    window.localStorage.setItem('macro-theme', 'dark')
    const prefs = await freshPrefs()
    expect(prefs.readPreferences().theme).toBe('dark')
    expect(prefs.readPreferences().density).toBe('comfortable')
  })

  it('does not let the legacy key override an explicit stored theme', async () => {
    window.localStorage.setItem('macro-theme', 'dark')
    window.localStorage.setItem('macro-prefs', JSON.stringify({ v: 1, prefs: { theme: 'light' } }))
    const prefs = await freshPrefs()
    expect(prefs.readPreferences().theme).toBe('light')
  })

  it('does not resurrect the legacy key after a corrupt envelope', async () => {
    window.localStorage.setItem('macro-theme', 'dark')
    window.localStorage.setItem('macro-prefs', 'garbage')
    const prefs = await freshPrefs()
    expect(prefs.readPreferences().theme).toBe('system')
  })

  it('refuses to store a value the stylesheet has no mapping for', async () => {
    const prefs = await freshPrefs()
    const state = prefs.usePreferences.getState()
    state.set('textScale', 1.07 as number)
    state.set('measure', 'cosy' as 'normal')
    expect(prefs.readPreferences().textScale).toBe(1)
    expect(prefs.readPreferences().measure).toBe('normal')
  })
})

describe('preferences: degraded environments', () => {
  it('degrades silently when localStorage throws on every call', async () => {
    const original = window.localStorage
    breakStorage()
    try {
      const prefs = await freshPrefs()
      expect(prefs.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })
      expect(() => prefs.usePreferences.getState().set('density', 'compact')).not.toThrow()
      // Usable in-session even though nothing can be remembered: the session
      // store is the source of truth, storage is only a cache of it.
      expect(prefs.readPreferences().density).toBe('compact')
    } finally {
      Object.defineProperty(window, 'localStorage', { value: original, configurable: true })
    }
  })

  it('survives a missing matchMedia', async () => {
    const original = window.matchMedia
    window.matchMedia = undefined as unknown as typeof window.matchMedia
    try {
      const prefs = await freshPrefs()
      expect(prefs.getSystemTheme()).toBe('light')
      expect(() => prefs.applyPreferences(prefs.readPreferences())).not.toThrow()
      expect(document.documentElement.dataset.prefTheme).toBe('system')
    } finally {
      window.matchMedia = original
    }
  })
})

describe('preferences: the document contract', () => {
  it('writes every attribute and property for a representative set', async () => {
    const prefs = await freshPrefs()
    prefs.applyPreferences({
      ...prefs.DEFAULT_PREFERENCES,
      theme: 'dark',
      density: 'compact',
      motion: 'reduced',
      measure: 'wide',
      lineHeight: 'tight',
      focusMode: true,
      textScale: 1.15,
    })
    const root = document.documentElement
    expect(root.dataset.prefTheme).toBe('dark')
    expect(root.dataset.prefDensity).toBe('compact')
    expect(root.dataset.prefMotion).toBe('reduced')
    expect(root.dataset.prefMeasure).toBe('wide')
    expect(root.dataset.prefLineHeight).toBe('tight')
    expect(root.dataset.prefFocus).toBe('on')
    expect(root.style.getPropertyValue('--pref-text-scale')).toBe('1.15')
    expect(root.style.getPropertyValue('--pref-measure')).toBe('82ch')
    expect(root.style.getPropertyValue('--pref-line-height')).toBe('1.4')
    expect(root.style.getPropertyValue('--pref-space')).toBe('0.85')
    // The theme is applied from the same call, so there is no second writer.
    expect(root.classList.contains('dark')).toBe(true)
    expect(root.style.colorScheme).toBe('dark')
  })

  it('is reversible: focus off and the defaults come back off again', async () => {
    const prefs = await freshPrefs()
    prefs.applyPreferences({ ...prefs.DEFAULT_PREFERENCES, focusMode: true, measure: 'narrow' })
    expect(document.documentElement.dataset.prefFocus).toBe('on')
    prefs.applyPreferences({ ...prefs.DEFAULT_PREFERENCES })
    expect(document.documentElement.dataset.prefFocus).toBe('off')
    expect(document.documentElement.style.getPropertyValue('--pref-measure')).toBe('70ch')
  })

  it('re-asserts the document on every store change while sync is running', async () => {
    const prefs = await freshPrefs()
    const stop = prefs.startPreferenceSync()
    try {
      prefs.usePreferences.getState().set('density', 'spacious')
      expect(document.documentElement.dataset.prefDensity).toBe('spacious')
      expect(document.documentElement.style.getPropertyValue('--pref-space')).toBe('1.15')
      prefs.usePreferences.getState().set('focusMode', true)
      expect(document.documentElement.dataset.prefFocus).toBe('on')
    } finally {
      stop()
    }
  })

  it('keeps the theme-color meta in step with the theme', async () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)
    try {
      const prefs = await freshPrefs()
      prefs.applyTheme('dark')
      expect(meta.getAttribute('content')).toBe(THEME_COLOR.dark)
      prefs.applyTheme('light')
      expect(meta.getAttribute('content')).toBe(THEME_COLOR.light)
    } finally {
      meta.remove()
    }
  })
})

describe('preferences: theme follows a live OS change', () => {
  it('repaints when the OS scheme changes while the preference is system', async () => {
    const media = stubMatchMedia('light')
    try {
      const prefs = await freshPrefs()
      const stop = prefs.startPreferenceSync()
      try {
        expect(document.documentElement.classList.contains('dark')).toBe(false)

        media.set('dark')
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(document.documentElement.style.colorScheme).toBe('dark')

        media.set('light')
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      } finally {
        stop()
      }
    } finally {
      media.restore()
    }
  })

  it('ignores the OS while the theme preference is explicit', async () => {
    const media = stubMatchMedia('light')
    try {
      window.localStorage.setItem('macro-prefs', JSON.stringify({ v: 1, prefs: { theme: 'dark' } }))
      const prefs = await freshPrefs()
      const stop = prefs.startPreferenceSync()
      try {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        media.set('light')
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      } finally {
        stop()
      }
    } finally {
      media.restore()
    }
  })

  it('is dark on the very first frame for a system-preference reader in a dark OS', async () => {
    // The property that makes the inline script worth keeping: an OS-dark
    // reader with nothing stored must not see a light frame first.
    const media = stubMatchMedia('dark')
    try {
      const prefs = await freshPrefs()
      prefs.applyPreferences(prefs.readPreferences())
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    } finally {
      media.restore()
    }
  })

  it('unsubscribes cleanly, so a later OS change repaints nothing', async () => {
    const media = stubMatchMedia('light')
    try {
      const prefs = await freshPrefs()
      const stop = prefs.startPreferenceSync()
      media.set('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      stop()
      document.documentElement.classList.remove('dark')
      media.set('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    } finally {
      media.restore()
    }
  })
})

describe('preferences: reset', () => {
  it('restores every default and persists the reset', async () => {
    const prefs = await freshPrefs()
    const state = prefs.usePreferences.getState()
    state.set('theme', 'dark')
    state.set('density', 'compact')
    state.set('focusMode', true)
    state.set('chartGrid', false)
    state.set('textScale', 0.9)

    prefs.usePreferences.getState().reset()
    expect(prefs.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })

    const reloaded = await freshPrefs()
    expect(reloaded.readPreferences()).toEqual({ ...prefs.DEFAULT_PREFERENCES })
  })

  it('re-applies the defaults to the document on reset', async () => {
    const prefs = await freshPrefs()
    const stop = prefs.startPreferenceSync()
    try {
      prefs.usePreferences.getState().set('theme', 'dark')
      prefs.usePreferences.getState().set('density', 'spacious')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      prefs.usePreferences.getState().reset()
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(document.documentElement.dataset.prefDensity).toBe('comfortable')
      expect(document.documentElement.style.getPropertyValue('--pref-space')).toBe('1')
    } finally {
      stop()
    }
  })
})

describe('preferences: the no-flash script agrees with the module', () => {
  /** The body of the inline boot script in `web/index.html`. */
  const script = INDEX_HTML.slice(INDEX_HTML.indexOf('<script>'), INDEX_HTML.indexOf('</script>'))

  it('is present and runs before the module entry point', () => {
    expect(INDEX_HTML).toContain('localStorage.getItem(PREF_KEY)')
    expect(INDEX_HTML.indexOf('var PREF_KEY')).toBeLessThan(
      INDEX_HTML.indexOf('src="/src/main.tsx"'),
    )
  })

  it('names the same storage keys', () => {
    expect(script).toContain(`var PREF_KEY = '${PREF_STORAGE_KEY}'`)
    expect(script).toContain(`var LEGACY_THEME_KEY = '${LEGACY_THEME_STORAGE_KEY}'`)
    expect(script).toContain(`var PREF_VERSION = ${PREF_STORAGE_VERSION}`)
  })

  it('writes the same attributes and custom properties', () => {
    for (const attribute of [
      'data-pref-theme',
      'data-pref-density',
      'data-pref-motion',
      'data-pref-measure',
      'data-pref-line-height',
      'data-pref-focus',
    ]) {
      expect(script, attribute).toContain(attribute)
    }
    for (const property of [
      '--pref-text-scale',
      '--pref-measure',
      '--pref-line-height',
      '--pref-space',
    ]) {
      expect(script, property).toContain(property)
    }
  })

  it('carries the same value tables, so the first frame is not a different page', () => {
    for (const value of TEXT_SCALES) {
      expect(script, `text scale ${value}`).toContain(String(value))
    }
    for (const ch of Object.values(MEASURE_CH)) {
      expect(script, `measure ${ch}`).toContain(ch)
    }
    for (const leading of Object.values(LINE_HEIGHT_VALUE)) {
      expect(script, `line height ${leading}`).toContain(leading)
    }
    for (const space of Object.values(SPACE_SCALE)) {
      expect(script, `space ${space}`).toContain(space)
    }
  })

  it('carries the same browser-chrome tints', () => {
    for (const tint of Object.values(THEME_COLOR)) {
      expect(script, `theme colour ${tint}`).toContain(tint)
    }
  })

  it('starts from the same defaults, so an unstored reader sees no change', () => {
    // The script's `var prefs = {...}` literal has to be the module's
    // `DEFAULT_PREFERENCES`, field for field. If a default moves, the page a
    // reader gets before the module loads stops matching the page they get
    // after it, which is a one-frame change nobody would notice in review.
    for (const [key, value] of Object.entries(DEFAULT_PREFERENCES)) {
      const literal = String(value).replace('.', '\\.')
      expect(script, `${key}: ${String(value)}`).toMatch(
        new RegExp(`${key}: (${typeof value === 'string' ? `'${literal}'` : literal})`),
      )
    }
  })
})

describe('preferences: the stylesheet consumes all three of them', () => {
  /** The body of the first top-level rule with this exact selector. */
  function ruleBody(selector: string): string {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const start = INDEX_CSS.search(new RegExp(`^${escaped}\\s*\\{`, 'm'))
    expect(start, `missing \`${selector} {\` rule in index.css`).toBeGreaterThan(-1)
    const open = INDEX_CSS.indexOf('{', start)
    return INDEX_CSS.slice(open, INDEX_CSS.indexOf('\n}', open))
  }

  /**
   * A CSS custom property is only as good as the rules that read it. Each of
   * these three used to be written to the document and read by exactly one
   * selector, and in two cases that one selector was shadowed by a hard-coded
   * value further down the cascade — so the control did nothing at all in the
   * place a reader would notice.
   */
  it('reaches the lecture body, not just the body element', () => {
    // `.prose-lecture` used to pin `line-height: 1.75`, which beat
    // `body { line-height: var(--pref-line-height) }` on source order.
    // Measured on `/lecture/16`: 29.75px of leading at both 1.4 and 1.8.
    expect(ruleBody('.prose-lecture')).toMatch(/line-height:\s*var\(--read-line\)/)
    expect(ruleBody(':root')).toMatch(/--read-line:\s*calc\(var\(--pref-line-height/)
  })

  it('reaches every reading column, through one class', () => {
    // The page header, the deck under a title, and the case-study summary were
    // all on a hard-coded `max-w-3xl`, which is a rem width: at 130% text the
    // header measured 923px beside a 580px body column.
    expect(ruleBody('.reading-col')).toMatch(/max-width:\s*var\(--pref-measure/)
    for (const selector of ['.prose-lecture', '.note__body', '.tool-description']) {
      expect(ruleBody(selector), selector).toMatch(/max-width:\s*var\(--pref-measure/)
    }
  })

  it('scales the root from --pref-text-scale with every type size in rem', () => {
    // The scale was never the broken one — Tailwind's own `fontSize` scale is
    // rem — but there is no reason to leave room for it to become broken.
    expect(ruleBody('html')).toMatch(/font-size:\s*calc\(100% \* var\(--pref-text-scale/)
    expect(INDEX_CSS).not.toMatch(/font-size:\s*[\d.]+px/)
  })

  it('unhooks the screen preferences in print, so a PDF is not a screenshot', () => {
    const start = INDEX_CSS.indexOf('@media print')
    expect(start).toBeGreaterThan(-1)
    // Slicing from the print block excludes the `:root` defaults, so a match
    // here can only be the print override.
    const block = INDEX_CSS.slice(start)
    // A reader on 130% would otherwise print 11pt body text beside headings
    // and table cells at 1.3x, because those are rem and rem follows the root.
    for (const [property, value] of [
      ['--pref-text-scale', '1'],
      ['--pref-line-height', '1.45'],
      ['--pref-measure', 'none'],
    ]) {
      expect(block, property).toMatch(
        new RegExp(`${property}:\\s*${value.replace('.', '\\.')};`),
      )
    }
  })
})
