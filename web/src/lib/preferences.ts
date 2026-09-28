/**
 * User preferences: the store, the persistence, and the DOM contract.
 *
 * This module is the single source of truth for every reading preference —
 * including the theme, which used to live on its own in `layout/theme.ts`.
 * There is exactly one place a preference is stored, one place it is
 * validated, and one place it is written onto the document, so the inline
 * no-flash script in `web/index.html`, the zustand store, and the CSS in
 * `index.css` cannot disagree about what the user asked for.
 *
 * The CSS contract, in full. `applyPreferences` writes:
 *
 *   data-pref-theme         theme pref, as stored ('light' | 'dark' | 'system')
 *   data-pref-density       'compact' | 'comfortable' | 'spacious'
 *   data-pref-motion        'system' | 'reduced' | 'full'
 *   data-pref-measure       'narrow' | 'normal' | 'wide'
 *   data-pref-line-height   'tight' | 'normal' | 'relaxed'
 *   data-pref-focus         'on' | 'off'
 *   --pref-text-scale       unitless number, one of TEXT_SCALES
 *   --pref-measure          a `ch` length
 *   --pref-line-height      a unitless number
 *   --pref-space            a unitless density multiplier
 *
 * `index.css` declares the same names with neutral defaults in `:root`, so a
 * site that never runs this module still renders exactly as it did before
 * preferences existed. `chartGrid` is the one preference with no CSS
 * footprint — it is read by chart components in JavaScript.
 *
 * Importing this module has no side effects: nothing touches `document`,
 * `localStorage`, or `matchMedia` at import time, so it is safe under SSR and
 * safe to import from a test. Call `startPreferenceSync()` once at boot to
 * begin applying.
 */

import { create } from 'zustand'
import { THEME_COLOR } from '../design/tokens'
import type { Theme } from '../design/tokens'
import { beginThemeShift } from './themeShift'

export type { Theme }
export type ThemePref = 'light' | 'dark' | 'system'
export type DensityPref = 'compact' | 'comfortable' | 'spacious'
export type MotionPref = 'system' | 'reduced' | 'full'
export type MeasurePref = 'narrow' | 'normal' | 'wide'
export type DetailPref = 'sketch' | 'full'
export type LineHeightPref = 'tight' | 'normal' | 'relaxed'

export interface Preferences {
  /** Default 'system': follow the OS, and keep following it live. */
  theme: ThemePref
  /** Root font-size multiplier. One of TEXT_SCALES. */
  textScale: number
  /** Reading measure, applied as a `ch` width. */
  measure: MeasurePref
  lineHeight: LineHeightPref
  /** Padding/gap multiplier. One of SPACE_SCALE. */
  density: DensityPref
  motion: MotionPref
  /** Whether charts draw their grid lines. Read in JS, not in CSS. */
  chartGrid: boolean
  /** Reader / focus mode: reduce chrome and centre the reading column. */
  focusMode: boolean
  /**
   * Whether a lecture section opens with its argument or with its claims.
   *
   * A note is an argument and a re-reader wants the claims, so this is a
   * genuine per-reader choice rather than a density or a display setting. It
   * is a *default*: the per-section toggle on the page overrides it for that
   * section, in that visit, and a reader who finds themselves flipping every
   * one of eight toggles is describing their own preference and the site has
   * somewhere to put it.
   */
  lectureDetail: DetailPref
}

export const DEFAULT_PREFERENCES: Preferences = Object.freeze({
  theme: 'system',
  textScale: 1,
  measure: 'normal',
  lineHeight: 'normal',
  density: 'comfortable',
  motion: 'system',
  chartGrid: true,
  focusMode: false,
  lectureDetail: 'sketch',
})

/** The only accepted text scales. A slider cannot produce anything else. */
export const TEXT_SCALES = [0.9, 1, 1.15, 1.3] as const
export type TextScale = (typeof TEXT_SCALES)[number]

/**
 * Preference value -> CSS custom property value. These four tables ARE the
 * contract with `index.css`; `web/index.html` restates the same numbers
 * because it has to run before the module can load.
 *
 * The `normal` entries are the values the site already used before
 * preferences existed, which is what makes a fresh visitor see no change at
 * all: 70ch of prose, 1.6 leading, 1x density.
 */
export const MEASURE_CH: Record<MeasurePref, string> = {
  narrow: '62ch',
  normal: '70ch',
  wide: '82ch',
}

export const LINE_HEIGHT_VALUE: Record<LineHeightPref, string> = {
  tight: '1.4',
  normal: '1.6',
  relaxed: '1.8',
}

export const SPACE_SCALE: Record<DensityPref, string> = {
  compact: '0.85',
  comfortable: '1',
  spacious: '1.15',
}

/**
 * `system` and `full` are both 1 here on purpose. The distinction between
 * them is not "how much motion", it is "who is allowed to ask for it":
 *
 *   reduced  the user asked, here, at this site  -> 0
 *   system   nobody asked; the OS decides       -> 1, overridden below
 *            by `@media (prefers-reduced-motion: reduce)` in index.css
 *   full     the user asked for motion          -> 1, and it stays subject
 *            to the OS query, because a site
 *            toggle is not a substitute for an
 *            OS-level accessibility setting
 */
export const MOTION_SCALE: Record<MotionPref, string> = {
  system: '1',
  reduced: '0',
  full: '1',
}

/* ------------------------------------------------------------------ *
 * Persistence
 *
 * `macro-prefs` holds a versioned envelope:
 *
 *   { "v": 1, "prefs": { ... } }
 *
 * Reading is total: anything unrecognised degrades to defaults rather than
 * throwing, because a preferences layer that can wedge the app on a bad
 * value is worse than one that forgets a preference.
 * ------------------------------------------------------------------ */

export const PREF_STORAGE_KEY = 'macro-prefs'
export const PREF_STORAGE_VERSION = 1

/**
 * The pre-preferences theme key. Read once, only when `macro-prefs` is
 * entirely absent, and folded into `theme: 'light' | 'dark'` so an existing
 * visitor who chose a theme does not silently lose it. Nothing writes it any
 * more.
 */
export const LEGACY_THEME_STORAGE_KEY = 'macro-theme'

type PrefKey = keyof Preferences

const oneOf = <T extends string>(allowed: readonly T[]) => (value: unknown): boolean =>
  typeof value === 'string' && (allowed as readonly string[]).includes(value)

const isBool = (value: unknown): boolean => typeof value === 'boolean'

/**
 * Per-key validation. This table is the gate: nothing reaches the store, the
 * stylesheet, or the DOM without passing through it, which is what stops a
 * hand-edited `localStorage` value from producing, say, a `measure` the
 * stylesheet has no mapping for.
 */
const VALIDATORS: { [K in PrefKey]: (value: unknown) => boolean } = {
  theme: oneOf(['light', 'dark', 'system'] as const),
  textScale: (value) => typeof value === 'number' && (TEXT_SCALES as readonly number[]).includes(value),
  measure: oneOf(['narrow', 'normal', 'wide'] as const),
  lineHeight: oneOf(['tight', 'normal', 'relaxed'] as const),
  density: oneOf(['compact', 'comfortable', 'spacious'] as const),
  motion: oneOf(['system', 'reduced', 'full'] as const),
  chartGrid: isBool,
  lectureDetail: oneOf(['sketch', 'full'] as const),
  focusMode: isBool,
}

/** The keys that make up a `Preferences`. Mirrors the interface exactly. */
const PREF_KEYS = Object.keys(DEFAULT_PREFERENCES) as PrefKey[]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Merge an untrusted object over the defaults, keeping only recognised keys
 * whose values validate. Unknown keys are dropped, invalid values fall back
 * to the default, and a non-object input yields the defaults outright.
 *
 * Also used to narrow the live store state (which carries `set` and `reset`
 * alongside the preferences) down to exactly `Preferences`, so this is the
 * single place the key list has to be right.
 */
function sanitize(source: unknown): Preferences {
  const picked: Partial<Preferences> = {}
  if (isRecord(source)) {
    for (const key of PREF_KEYS) {
      const value = source[key]
      if (VALIDATORS[key](value)) {
        Object.assign(picked, { [key]: value })
      }
    }
  }
  return { ...DEFAULT_PREFERENCES, ...picked }
}

/**
 * `window.localStorage`, or null when it cannot be used. Reading the property
 * itself throws in some browsers when storage is blocked outright, so the
 * access is inside the try. `window.localStorage` is deliberate: Node 22
 * injects an incomplete `globalThis.localStorage` that shadows jsdom's under
 * vitest, and it does not have the full Storage API.
 */
function getStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    const storage = window.localStorage
    return storage && typeof storage.getItem === 'function' ? storage : null
  } catch {
    return null
  }
}

function readRaw(key: string): string | null {
  const storage = getStorage()
  if (!storage) return null
  try {
    return storage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, value: string): void {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(key, value)
  } catch {
    /* private mode, quota, or a disabled store: preferences are not worth
       an exception. The session still works, it just will not be remembered. */
  }
}

function migrate(raw: string | null): Preferences {
  if (raw === null) {
    // No envelope at all. One-shot adoption of the pre-preferences theme key
    // so an existing visitor keeps the theme they picked.
    const legacy = readRaw(LEGACY_THEME_STORAGE_KEY)
    if (legacy === 'dark' || legacy === 'light') return { ...DEFAULT_PREFERENCES, theme: legacy }
    return { ...DEFAULT_PREFERENCES }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
  if (!isRecord(parsed)) return { ...DEFAULT_PREFERENCES }

  // A payload from a newer build. Its shape is not knowable from here, and
  // guessing would be worse than forgetting, so it is dropped.
  if (typeof parsed.v === 'number' && parsed.v > PREF_STORAGE_VERSION) {
    return { ...DEFAULT_PREFERENCES }
  }

  // `v` present and current, or absent (an unversioned bare preference
  // object). Both merge over the defaults; a future `v: 2` migration reads
  // `parsed.v === PREF_STORAGE_VERSION` and transforms before merging.
  if ('prefs' in parsed) return sanitize(parsed.prefs)
  return sanitize(parsed)
}

function loadPreferences(): Preferences {
  return migrate(readRaw(PREF_STORAGE_KEY))
}

function persist(prefs: Preferences): void {
  writeRaw(
    PREF_STORAGE_KEY,
    JSON.stringify({ v: PREF_STORAGE_VERSION, prefs: { ...prefs } }),
  )
}

/* ------------------------------------------------------------------ *
 * Store
 * ------------------------------------------------------------------ */

export interface PreferencesState extends Preferences {
  /**
   * Set one preference. Values that fail validation are ignored rather than
   * stored, so the DOM can never receive a value the stylesheet has no
   * mapping for.
   */
  set: <K extends PrefKey>(key: K, value: Preferences[K]) => void
  /** Back to `DEFAULT_PREFERENCES`, persisted and re-applied. */
  reset: () => void
}

export const usePreferences = create<PreferencesState>()((set, get) => ({
  ...loadPreferences(),
  set: (key, value) => {
    if (!VALIDATORS[key](value)) return
    const next = { ...sanitize(get()), [key]: value } as Preferences
    persist(next)
    set(next)
  },
  reset: () => {
    const next = { ...DEFAULT_PREFERENCES }
    persist(next)
    set(next)
  },
}))

/** The current preferences, without subscribing. For non-React callers. */
export function readPreferences(): Preferences {
  return sanitize(usePreferences.getState())
}

/* ------------------------------------------------------------------ *
 * Theme
 *
 * `theme: 'system'` is resolved here and nowhere else. `layout/theme.ts` is
 * a thin React facade over these functions, so the toggle, the document
 * class, the browser-chrome tint, and the no-flash script all read one
 * answer.
 * ------------------------------------------------------------------ */

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** The OS colour scheme, or `'light'` if it cannot be read. */
export function getSystemTheme(): Theme {
  try {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

/** Turn a preference into the theme actually in effect. */
export function resolveTheme(pref: ThemePref): Theme {
  return pref === 'system' ? getSystemTheme() : pref
}

/**
 * Put a resolved theme on the document: the `.dark` class Tailwind keys off,
 * `color-scheme` so form controls and scrollbars follow, and the
 * `theme-color` meta so the mobile address bar does not show the wrong one.
 *
 * When the theme is genuinely CHANGING, the three writes happen behind a
 * short cross-fade — see `lib/themeShift.ts` for the veil and its three
 * teardown paths. Two things about that are load-bearing:
 *
 *  - It is gated on the theme actually changing. `applyTheme` is called from
 *    `applyPreferences` on EVERY preference write, so a reader nudging the
 *    text-size slider would otherwise get a 270ms veil over the page on
 *    every step of a drag. Density and text scale repaint instantly, which
 *    is correct: a preference that reflows the page should be legible as it
 *    moves, and a veil is a lie about that.
 *  - The writes stay in one place. The cross-fade only decides WHEN; what
 *    changes is still these three lines, so there is no second description of
 *    the theme anywhere.
 */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (!root) return

  const commit = () => {
    root.classList.toggle('dark', theme === 'dark')
    root.style.colorScheme = theme
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', THEME_COLOR[theme])
  }

  const isChanging = root.classList.contains('dark') !== (theme === 'dark')
  // `beginThemeShift` returns false whenever the fade cannot run — reduced
  // motion, no layout, SSR — and in that case the theme is applied directly,
  // which is also the behaviour under test where jsdom has no animations.
  if (!isChanging || !beginThemeShift(commit)) commit()
}

/**
 * One `matchMedia` listener, fanned out. Both `useTheme` (to repaint the
 * toggle's icon) and `startPreferenceSync` (to re-apply the document) need
 * to hear about a live OS change, and one listener is enough for both.
 */
const schemeListeners = new Set<(theme: Theme) => void>()

function fanOutSchemeChange(): void {
  const theme = getSystemTheme()
  for (const listener of schemeListeners) listener(theme)
}

function onSystemThemeChange(): void {
  fanOutSchemeChange()
}

function ensureSchemeListener(): void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
  try {
    const mql = window.matchMedia(DARK_QUERY)
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onSystemThemeChange)
    } else if (typeof mql.addListener === 'function') {
      // Safari below 14.
      mql.addListener(onSystemThemeChange)
    }
  } catch {
    /* ignore */
  }
}

/** Subscribe to live `prefers-color-scheme` changes. Returns an unsubscribe. */
export function subscribeSystemTheme(listener: (theme: Theme) => void): () => void {
  schemeListeners.add(listener)
  ensureSchemeListener()
  return () => {
    schemeListeners.delete(listener)
  }
}

/* ------------------------------------------------------------------ *
 * Applying
 * ------------------------------------------------------------------ */

/**
 * Write a preference set onto `<html>`. This is the whole DOM contract; the
 * stylesheet does nothing it cannot do from these attributes and properties.
 *
 * Safe to call with no `document` (SSR) and safe to call repeatedly.
 */
export function applyPreferences(prefs: Preferences): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (!root) return

  root.dataset.prefTheme = prefs.theme
  root.dataset.prefDensity = prefs.density
  root.dataset.prefMotion = prefs.motion
  root.dataset.prefMeasure = prefs.measure
  root.dataset.prefLineHeight = prefs.lineHeight
  root.dataset.prefFocus = prefs.focusMode ? 'on' : 'off'

  root.style.setProperty('--pref-text-scale', String(prefs.textScale))
  root.style.setProperty('--pref-measure', MEASURE_CH[prefs.measure])
  root.style.setProperty('--pref-line-height', LINE_HEIGHT_VALUE[prefs.lineHeight])
  root.style.setProperty('--pref-space', SPACE_SCALE[prefs.density])

  // The theme is a preference too, so it is applied from the same place. No
  // second writer, no second source of truth.
  applyTheme(resolveTheme(prefs.theme))
}

let stopSync: (() => void) | null = null

/**
 * Start (or reuse) the single subscription that keeps the document in step
 * with the store: every `set` / `reset` re-applies, and a live OS colour
 * scheme change re-applies while the theme preference is `'system'`.
 *
 * Idempotent, and it returns the teardown. Nothing here runs at import time;
 * `main.tsx` calls it once at boot.
 */
export function startPreferenceSync(): () => void {
  if (stopSync) return stopSync
  applyPreferences(readPreferences())
  const unsubscribeStore = usePreferences.subscribe(() => {
    applyPreferences(readPreferences())
  })
  const unsubscribeSystem = subscribeSystemTheme(() => {
    if (readPreferences().theme === 'system') applyPreferences(readPreferences())
  })
  stopSync = () => {
    unsubscribeStore()
    unsubscribeSystem()
    stopSync = null
  }
  return stopSync
}
