import '@testing-library/jest-dom'

/**
 * Node 22 ships an experimental `localStorage` that lacks the full Storage API,
 * and it can shadow jsdom's. Install a complete in-memory implementation.
 */
function installMemoryStorage(): void {
  const store = new Map<string, string>()
  const storage: Storage = {
    get length() {
      return store.size
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? store.get(key)! : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => void store.delete(key),
    setItem: (key: string, value: string) => void store.set(key, String(value)),
  }
  Object.defineProperty(window, 'localStorage', { value: storage, configurable: true })
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
}

if (typeof window.localStorage?.clear !== 'function') {
  installMemoryStorage()
}

/** jsdom lacks ResizeObserver, which Recharts' ResponsiveContainer needs. */
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
}

/**
 * jsdom does not implement `window.scrollTo`, and `layout/Shell.tsx` calls it
 * with an options object on every route change. Without this, mounting the
 * shell in a test prints a fifteen-line "Not implemented" stack per test and
 * buries the failures that matter. Same class of gap as `ResizeObserver`
 * above, and the same reason it belongs here rather than in each test.
 *
 * Unconditional, unlike the `ResizeObserver` stub above: jsdom DOES define
 * `scrollTo`, as a function whose only body is a call to its own
 * `notImplemented`, so there is nothing to detect. No test scrolls — a
 * document with no layout has nowhere to scroll to — and `reading.test.tsx`
 * asserts against `window.scrollY`, which this does not touch.
 */
window.scrollTo = (() => {}) as unknown as typeof window.scrollTo

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
