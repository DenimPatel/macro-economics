/**
 * The harness for asserting what a reader SEES.
 *
 * ============================================================================
 * WHY THIS FILE EXISTS
 * ============================================================================
 *
 * Until this file, not one assertion in the suite checked a number a reader
 * could read. `tools.test.tsx` scans tool source with a regex, and
 * `calculations.test.ts` exercises exports in `lib/calculations.ts` that ten
 * of thirteen have no product caller for. So the suite looked like it covered
 * the economics — the filenames and test names promise it — while covering
 * none of the code a reader reaches. Seven defects shipped on top of that
 * gap, and every one of them was a wrong number on the page: a stat tile that
 * reported the slider instead of the scenario, a tax control that changed
 * nothing, a Gordon price that read `0.00`, a crisis preset with no crisis in
 * it.
 *
 * ============================================================================
 * WHAT MAKES AN ASSERTION HERE HONEST
 * ============================================================================
 *
 * An assertion built on this harness is honest only if all three of these
 * hold. They are the three ways a rendered-value test goes wrong, and each
 * has happened in this repository's own history.
 *
 * 1. IT ASSERTS THE RENDERED STRING, NOT THE MODEL.
 *    `stat('Steady State Total Output Growth')` returns what is in the `.stat-tile`
 *    element a reader looks at, unit included. Asserting the tool's internal
 *    `activeN * 100` would pass while the tile read the slider's value — which
 *    is precisely the `SolowSimulator` defect. The model and the tile are the
 *    same number only if the wiring is right, and the wiring is the thing
 *    under test.
 *
 * 2. IT STATES THE PARAMETER SET IT IS AT.
 *    A number with no parameters is not a claim. `1.00` for the steady-state
 *    growth rate is right at `n = 0.01` and wrong at `n = 0.02`, so the
 *    assertion has to say which. That is what `openTool(toolId, params)` and
 *    `setControls` are for: the parameter set is part of the call, in the same
 *    expression as the expected value, so it cannot drift away from it.
 *
 * 3. IT CAN FAIL.
 *    A guard that cannot go red is not a guard; it is a comment with an
 *    `expect` in it. Two ways that happens here, both avoided below:
 *      - a `queryBy*` that returns `null` and a test that then compares
 *        `null` to a number (fails, good) versus a test that skips when the
 *        element is missing (passes, worthless). `stat()` THROWS on a missing
 *        tile, so a renamed label breaks the test loudly.
 *      - a control that was never found, so "the value did not change" is
 *        trivially true. `setControls` THROWS on an unknown key, so a renamed
 *        slider cannot pass by doing nothing.
 *    `openTool` also waits for the tool's own chunk to resolve (see LAZY
 *    below), so an assertion cannot accidentally run against a loading frame.
 *
 * ============================================================================
 * A WORKED EXAMPLE
 * ============================================================================
 *
 * The `SolowSimulator` defect: `activeN` is 0.01 under the "Low Growth"
 * preset, but the tile read `(populationGrowth * 100).toFixed(2)`, so it kept
 * printing the slider's 0.02. A test of the model passes today:
 *
 *     expect(0.01 * 100).toBeCloseTo(1)          // green forever, sees nothing
 *
 * A test of the rendered tile fails today, which is the point:
 *
 *     const tool = await openTool('solow-simulator')
 *     await tool.click('Low Growth (n=0.01)')
 *     expect(tool.stat('Steady State Total Output Growth (n)')).toBe('1.00 %')
 *     //  ^ at n = 0.01. Today: '2.00 %'.
 *
 * Note what it does NOT do: it does not import the tool, does not re-derive
 * `k* = (s/(n+d))^(1/(1-a))`, and does not read `DEFAULTS`. The value comes
 * out of the DOM, which is the only place a reader's number exists.
 *
 * ============================================================================
 * WHY A SCENARIO ROUND TRIP, NOT A DRAG
 * ============================================================================
 *
 * To move a control there are two options and the obvious one is worse.
 *
 * Synthesising a drag means finding the `<input type="range">` for a label,
 * computing a value on its own `min`/`max`/`step` grid, and dispatching an
 * `input` event React will accept. It is brittle in three ways that all bite
 * on this codebase specifically: the step is a float in nine of the twenty
 * tools, so a synthesised value can land off the grid and be snapped; a
 * control may be a `NumberInput` rather than a `SliderControl`, with a draft
 * state that only commits in-range keystrokes; and a preset may OVERRIDE the
 * value you set, which is the `SolowSimulator` inert-slider defect and which a
 * drag cannot distinguish from a drag that worked.
 *
 * The share link is the mechanism this site already ships, already tests, and
 * already promises to readers: `SliderControl` and `NumberInput` register
 * themselves in `lib/controlRegistry.ts` with their key, their bounds and
 * their setter, and `applyScenarioParams` walks a payload and clamps each
 * value into the bounds of the control that claims it. So the harness sets a
 * control by writing the payload of a scenario link and letting the page's own
 * reader apply it. Two consequences worth having:
 *
 *   - the setter it calls is the setter the input calls, so a test cannot
 *     accidentally reach a state the reader cannot reach;
 *   - an unknown or ambiguous key is REFUSED, not guessed. `setControls`
 *     turns that refusal into a thrown error, which is the guard in point 3
 *     above: a renamed slider fails the test instead of passing by doing
 *     nothing.
 *
 * `openSharedLink` goes one step further and does the whole URL round trip —
 * base64url encode, `?s=`, decode, and then nothing else, because the page's
 * own reader does the applying — because that is the path a reader with a
 * pasted link actually walks, and the encode and decode halves can disagree in
 * ways `applyScenarioParams` alone would not see.
 */
import { createElement } from 'react'
import { act, cleanup, fireEvent, render, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach } from 'vitest'
import ToolPage from '../pages/ToolPage'
import { encodeScenario, scenarioFromSearch } from '../lib/scenario'
import {
  applyScenarioParams,
  clearControls,
  registeredControls,
  snapshotControls,
  type RegisteredControl,
} from '../lib/controlRegistry'
import { useAppStore, type ScenarioParams } from '../store'
import type { ToolId } from '../../../content/lectures'

/* ------------------------------------------------------------------ *
 * The mounted tool
 * ------------------------------------------------------------------ */

export interface MountedTool {
  /**
   * The string in the `.stat-tile` whose `.stat-tile-label` is `label`,
   * whitespace-normalised and including the unit the tile prints.
   *
   * Throws when there is no such tile, and when there is more than one — a
   * helper that returns the first match would let a duplicated label pass.
   */
  stat(label: string): string

  /**
   * Every `.stat-tile` carrying `label`, in document order.
   *
   * `stat` throws on a second match because a duplicated label is a defect for
   * a reader. This is the other half of that: a tool that renders the SAME
   * label once per approach — `gdp-visualizer` prints `Total GDP` three times,
   * once for expenditure, once for income and once for production — cannot be
   * read through `stat` at all, and a contract that needs to compare the three
   * would otherwise have to reach into the DOM.
   *
   * Throws when there are none, because an empty array would let a test that
   * forgot to rename a label pass.
   */
  stats(label: string): string[]

  /**
   * The string printed under the control labelled `label`: the `.control-value`
   * element the reader steers by, with its unit. Throws on a missing or
   * ambiguous label.
   */
  control(label: string): string

  /**
   * The number the control labelled `label` currently holds, read from the
   * share registry's own accessor rather than from the printed string, so it
   * is the model value and not a rounding of it.
   */
  value(label: string): number

  /**
   * Move controls by scenario key, the way an arriving `?s=` does: clamped to
   * the bounds the input enforces, and refused outright for a key no mounted
   * control claims.
   *
   * Throws if any key is unknown or claimed by two controls, so a renamed
   * slider cannot pass by silently moving nothing.
   */
  set(params: ScenarioParams): Promise<void>

  /** Click a button or preset by its visible name. */
  click(name: string): Promise<void>

  /**
   * The text of the SMALLEST rendered element containing `pattern`, so an
   * assertion about a sentence gets the sentence's own block and not the whole
   * page. Throws when nothing matches, naming the pattern and listing the
   * paragraphs it did render — a helper that returned the page text and let
   * `toContain` decide would pass for a match on the wrong block.
   */
  text(pattern: RegExp): string

  /** Every share key currently mounted, with the value it holds. */
  snapshot(): ScenarioParams
}

/** Whitespace-normalised text, because JSX wraps prose across lines. */
function text(element: Element | null, what: string): string {
  if (!element) throw new Error(`no ${what} rendered`)
  return (element.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** `queryAllBy` on a class, scoped to the rendered container. */
function byClass(root: HTMLElement, className: string): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(`.${className}`)]
}

/**
 * The rendered value of a stat tile, found by its label.
 *
 * `StatBox` in `components/ToolComponents.tsx` is three sibling divs —
 * `.stat-tile-label`, `.stat-tile-value`, optionally `.stat-tile-change` —
 * inside a `.stat-tile`. Matching on the label text is the only handle,
 * because the tile carries no `aria-label` and no `data-*` hook.
 *
 * Only tiles that HAVE a `.stat-tile-label` are considered, and that is not
 * cosmetic: `SolowSimulator` hand-writes `className="stat-tile stat-tile--…"`
 * for its scenario-comparison cards, which carry no label element at all. A
 * helper that treated those as candidates would report them as a missing
 * label rather than as "not a `StatBox`".
 *
 * If a tool ever renders a tile outside `StatBox` it is hand-written and this
 * will not find it, which is the safe direction: the helper reports what the
 * shared component printed.
 */
function readStat(root: HTMLElement, label: string): string {
  const labelled = (tile: HTMLElement): string =>
    text(tile.querySelector('.stat-tile-label'), 'stat label')
  const tiles = byClass(root, 'stat-tile').filter(
    (tile) => tile.querySelector('.stat-tile-label') !== null && labelled(tile) === label,
  )
  if (tiles.length === 0) {
    const all = byClass(root, 'stat-tile')
      .filter((tile) => tile.querySelector('.stat-tile-label') !== null)
      .map((tile) => `"${labelled(tile)}"`)
    throw new Error(`no stat tile labelled "${label}". Rendered: ${all.join(', ')}`)
  }
  if (tiles.length > 1) throw new Error(`${tiles.length} stat tiles labelled "${label}"`)
  // The unit is a text node inside `.stat-tile-value`, so the value string
  // carries it: `'1.00 %'`. That is what the reader reads, and stripping the
  // unit would make the assertion weaker than the screen.
  return text(tiles[0].querySelector('.stat-tile-value'), 'stat value')
}

/** Every value of every tile carrying `label`, in document order. */
function readStats(root: HTMLElement, label: string): string[] {
  const tiles = byClass(root, 'stat-tile').filter((tile) => {
    const named = tile.querySelector('.stat-tile-label')
    return named !== null && text(named, 'stat label') === label
  })
  if (tiles.length === 0) {
    const all = byClass(root, 'stat-tile')
      .filter((tile) => tile.querySelector('.stat-tile-label') !== null)
      .map((tile) => `"${text(tile.querySelector('.stat-tile-label'), 'stat label')}"`)
    throw new Error(`no stat tile labelled "${label}". Rendered: ${all.join(', ')}`)
  }
  return tiles.map((tile) => text(tile.querySelector('.stat-tile-value'), 'stat value'))
}

/** The value printed under a labelled control. */
function readControlValue(root: HTMLElement, label: string): string {
  const groups = controlGroups(root, label)
  return text(groups[0].querySelector('.control-value'), 'control value')
}

/** The one `.control-group` whose `<label>` is `label`, or a throw. */
function controlGroups(root: HTMLElement, label: string): HTMLElement[] {
  const groups = byClass(root, 'control-group').filter((group) => {
    const named = group.querySelector<HTMLLabelElement>('label.control-label')
    return named ? text(named, 'control label') === label : false
  })
  if (groups.length === 0) {
    const all = byClass(root, 'control-group').map(
      (group) => `"${text(group.querySelector('label.control-label'), 'control label')}"`,
    )
    throw new Error(`no control labelled "${label}". Rendered: ${all.join(', ')}`)
  }
  if (groups.length > 1) throw new Error(`${groups.length} controls labelled "${label}"`)
  return groups
}

/** A `flushSync`-ish settle: one `act` turn is enough for a `useState` setter. */
async function settle(): Promise<void> {
  await act(async () => {
    await Promise.resolve()
  })
}

/* ------------------------------------------------------------------ *
 * Mounting
 * ------------------------------------------------------------------ */

/**
 * The control registry is module state, and `ToolPage` clears it on unmount
 * — but a test that throws mid-assertion, or a test file that does not
 * unmount, leaves the previous tool's controls registered. Keying off the
 * mounted labels rather than the keys alone is what makes that survivable,
 * and `clearControls` here makes the rest of it deterministic.
 */
afterEach(() => {
  cleanup()
  clearControls()
  act(() => {
    useAppStore.setState({ scenario: null })
  })
})

/**
 * Wait for a lazy tool to arrive.
 *
 * Every tool is `React.lazy` in `tools/registry.tsx`, so the first paint is
 * `LoadingTool` and every element a reader will see is one microtask of a
 * dynamic `import()` away. `findBy*` polls; the alternative — a `getBy*` in
 * the caller's first `await` — is the single most likely thing to trip a
 * later agent up, so it is handled here and the caller never writes one.
 *
 * Scoped to the container, not `screen`, because the harness reuses one body:
 * a test that opens a second tool (the `miniTools[].preset` check opens
 * twelve) would otherwise find every earlier tool's `<h1>` and the wait would
 * resolve on the wrong tree.
 *
 * The wait is on the tool's own `<h1>`, which is the one element every tool
 * renders through the shared `ToolHeader`. Polling the registry for a
 * non-empty control set would be a weaker signal: a tool whose first panel is
 * a preset could register nothing, and "nothing registered" is the same
 * answer a tool with no settings gives (the reason `ToolRenderer`'s
 * `ToolReady` exists at all).
 */
async function waitForTool(container: HTMLElement): Promise<void> {
  await within(container).findByRole('heading', { level: 1 }, { timeout: 4000 })
  // One more turn so the controls' registration effects have run. The
  // registry is read by `set`, and a value applied before a late control
  // registers is silently dropped by `applyScenarioParams`.
  await settle()
}

/**
 * Open a tool page, the way a reader opens `/tool/:id`.
 *
 * Renders the real `ToolPage` inside a `MemoryRouter` rather than the tool
 * component directly, for one reason: `ToolPage` owns the share-link reader,
 * so mounting the page is what makes a scenario payload the same code path a
 * pasted link walks, and it is the page the reader is actually looking at.
 *
 * `params` is applied after the tool has mounted, so a value belonging to a
 * control that registers late still arrives — the defect `ToolPage`'s
 * subscription and its `spent` set were written to prevent.
 */
/**
 * One tool on screen at a time, whatever the caller does.
 *
 * The share registry is module state keyed by control label, and two mounted
 * tools would merge: the `miniTools[].preset` check opens twelve in one test,
 * and without this the second tool's `snapshot()` would return the first
 * tool's controls too — silently, because every key is a real key.
 *
 * Unmounting is what clears it: `ToolPage` clears the registry in its own
 * cleanup effect. So `cleanup()` before the next mount is not tidiness, it is
 * the isolation. A consequence worth stating: a test that renders something
 * else and then calls `openTool` will have that something unmounted.
 */
function freshContainer(): void {
  cleanup()
  // A `?s=` left on the document URL would be applied by the next `ToolPage`
  // to any tool it names, so the next open starts from a clean address bar.
  window.history.replaceState({}, '', '/macro-economics/')
}

/**
 * Mounted controls a name could mean.
 *
 * A name resolves by registry key first and by visible label second, which is
 * the same order `applyScenarioParams` uses and for the same reason: a tool
 * that mounts one parameter under three labels on three panels gives those
 * controls a `paramKey`, and the key is then not the text on the control. A
 * harness that only understood keys would be unable to reach a `paramKey`
 * control by the name a reader sees.
 */
function resolve(name: string): RegisteredControl[] {
  const mounted = registeredControls()
  const byKey = mounted.filter((c) => c.key === name)
  if (byKey.length > 0) return byKey
  return mounted.filter((c) => c.label === name)
}


export async function openTool(toolId: ToolId, params?: ScenarioParams): Promise<MountedTool> {
  freshContainer()
  const view = render(toolPage(toolId))
  await waitForTool(view.container)
  const tool = makeTool(view.container)
  if (params) await tool.set(params)
  return tool
}

/**
 * Open a tool page through a share link, encoding and decoding the payload
 * exactly as a pasted URL does.
 *
 * `openTool` is the one a test should normally use: it does not involve the
 * codec. This one exists so at least one assertion per suite covers the whole
 * round trip, because the two halves of `lib/scenario.ts` can disagree in a
 * way `applyScenarioParams` never sees — a key the encode half writes and the
 * decode half drops, a value that survives as a string.
 *
 * The payload is written to the document URL as a real reader's would be, and
 * read back out of it, so the codec is genuinely exercised.
 *
 * THE PAYLOAD IS NOT APPLIED HERE, and that used to be the helper's most
 * important line. `ToolPage.tsx:66-86` subscribes to the control registry and
 * applies the arriving payload from the callback; `subscribeControls` did not
 * invoke a new listener, and React flushes child effects before parent ones,
 * so on a mount where the tool's chunk is ALREADY in memory every control
 * registered before `ToolPage` had subscribed, nothing notified afterwards, and
 * the payload was silently dropped. The first visit to a tool page worked; a
 * second one did not, which in the app means arriving at `/tool/x?s=…` from a
 * lecture's mini-tool, a case study, or the reader's own history.
 *
 * `ToolPage` now reads once as well as subscribing, so a test about the share
 * path no longer has to repair the timing itself: applying the payload here
 * would have asserted the harness rather than the page, and every second visit
 * would have looked correct for the wrong reason.
 */
export async function openSharedLink(toolId: ToolId, params: ScenarioParams): Promise<MountedTool> {
  freshContainer()
  const encoded = encodeScenario({ toolId, params })
  // The base path is the real one from `vite.config.ts`, because that is the
  // URL a reader's would have.
  window.history.replaceState({}, '', `/macro-economics/tool/${toolId}?s=${encoded}`)
  const view = render(toolPage(toolId, `?s=${encoded}`))
  await waitForTool(view.container)
  await settle()
  // Read it back off the URL rather than reusing `params`, so a codec that
  // drops a key fails the test rather than being bypassed by the caller. The
  // page has already applied what it read by now; this only checks that what it
  // read was the whole payload.
  const incoming = scenarioFromSearch(window.location.search)
  if (!incoming) throw new Error(`openSharedLink: the encoded payload did not survive the URL`)
  const kept = Object.keys(incoming.params).length
  if (kept !== Object.keys(params).length) {
    throw new Error(
      `openSharedLink: the codec kept ${kept} of ${Object.keys(params).length} parameters ` +
        `(${Object.keys(incoming.params).join(', ')})`,
    )
  }
  window.history.replaceState({}, '', '/macro-economics/')
  return makeTool(view.container)
}

/**
 * The page under test, as an element.
 *
 * `createElement` rather than JSX because this file is `.ts`: thirteen later
 * agents will import it, and a harness whose filename depends on the JSX
 * transform is a trap for whoever imports it from a `.ts` file.
 */
function toolPage(toolId: ToolId, search = ''): ReturnType<typeof createElement> {
  return createElement(
    MemoryRouter,
    { initialEntries: [`/tool/${toolId}${search}`] },
    createElement(
      Routes,
      null,
      createElement(Route, { path: '/tool/:id', element: createElement(ToolPage) }),
    ),
  )
}

function makeTool(root: HTMLElement): MountedTool {
  return {
    stat: (label) => readStat(root, label),
    stats: (label) => readStats(root, label),
    control: (label) => readControlValue(root, label),
    value: (label) => {
      // The registry's own accessor, so this is the model's number rather
      // than the rendered rounding of it. The label is resolved to a key
      // through the DOM, so `paramKey` tools are reachable by their visible
      // name too.
      const entry = resolve(label)
      if (entry.length !== 1) {
        throw new Error(`${entry.length} registered controls for "${label}"`)
      }
      return entry[0].get()
    },
    set: async (params) => {
      const keys = Object.keys(params)
      const known = new Set(registeredControls().flatMap((c) => [c.key, c.label]))
      const ambiguous = new Set(
        registeredControls()
          .map((c) => c.key)
          .filter((key, _all, all) => all.filter((k) => k === key).length > 1),
      )
      const missing = keys.filter((k) => !known.has(k) || ambiguous.has(k))
      if (missing.length > 0) {
        throw new Error(
          `setControls: ${missing.join(', ')} ${
            missing.length === 1 ? 'is' : 'are'
          } not a single mounted control. Mounted: ${[...known].sort().join(', ')}`,
        )
      }
      // Coerce, and refuse rather than skip. `applyScenarioParams` ignores a
      // value that is not a finite number, so a caller who passed `'5'` would
      // get a harness that checked the control was mounted, reported nothing
      // wrong, and moved nothing — a test that cannot fail. The string case is
      // not hypothetical: a value read off a test's own table is a string.
      const numeric: ScenarioParams = {}
      for (const [key, value] of Object.entries(params)) {
        const n = typeof value === 'number' ? value : Number(value)
        if (!Number.isFinite(n)) {
          throw new Error(`setControls: "${key}" was given ${JSON.stringify(value)}, which is not a number`)
        }
        numeric[key] = n
      }
      act(() => {
        applyScenarioParams(numeric)
      })
      await settle()
    },
    click: async (name) => {
      const button = [...root.querySelectorAll<HTMLButtonElement>('button')].find(
        (b) => text(b, 'button') === name || b.getAttribute('aria-label') === name,
      )
      if (!button) {
        const all = [...root.querySelectorAll<HTMLButtonElement>('button')].map((b) =>
          `"${text(b, 'button')}"`,
        )
        throw new Error(`no control named "${name}". Rendered: ${all.join(', ')}`)
      }
      await act(async () => {
        fireEvent.click(button)
      })
      await settle()
    },
    text: (pattern) => readBlockText(root, pattern),
    snapshot: () => snapshotControls(),
  }
}

/**
 * The text of the smallest element containing `pattern`.
 *
 * "Smallest" is by text length, which for a tool means the innermost block:
 * a claim in an `InfoBox` comes back as that paragraph, not as the page. An
 * ancestor would also match, so choosing the minimum is what makes the
 * assertion about the sentence rather than about the sentence's neighbourhood.
 */
function readBlockText(root: HTMLElement, pattern: RegExp): string {
  let best: string | null = null
  for (const element of root.querySelectorAll<HTMLElement>('p, li, div, span, td, h1, h2, h3')) {
    const content = (element.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (content.length === 0 || !pattern.test(content)) continue
    if (best === null || content.length < best.length) best = content
  }
  if (best === null) {
    const blocks = [...root.querySelectorAll<HTMLElement>('p, li')]
      .map((element) => (element.textContent ?? '').replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .slice(0, 12)
    throw new Error(
      `nothing rendered matching ${String(pattern)}. Rendered prose:\n${blocks.map((b) => `  - ${b}`).join('\n')}`,
    )
  }
  return best
}

/* ------------------------------------------------------------------ *
 * The one thing a chart cannot give you
 * ------------------------------------------------------------------ */

/**
 * `NO_CHART_DATA`: jsdom has no layout, and `tests/setup.ts` stubs
 * `ResizeObserver` with a no-op, so `ResponsiveContainer` never gets a size
 * and Recharts renders no plot. A series is drawn as an SVG `<path>` with no
 * text in it, so there is nothing to read out of the DOM for a chart's values
 * in this environment.
 *
 * This is why `modelValues.test.tsx` asserts the READOUTS a tool prints
 * beside its charts rather than the curves. A readout is the number a reader
 * reads; a path is the shape of one, and asserting a path in jsdom would be
 * asserting an artefact of a zero-size container.
 */
export const NO_CHART_DATA =
  'Recharts renders no plot under jsdom (no layout, so ResponsiveContainer has no size). Assert the tool\'s printed readout, not a series.'
