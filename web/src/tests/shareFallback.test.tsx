/**
 * The share control's failure path — the one state in which the reader has no
 * other way to get the link.
 * ============================================================================
 *
 * When the clipboard write is refused, the status line under the button used to
 * read "The link is in the address bar — copy it from there", and nothing put
 * it there. `copyLink` set local state and stopped. So the instruction appeared
 * at exactly the moment the reader had nothing to act on, and the only honest
 * reading of it was that the page was confused.
 *
 * It is true now: a refused write puts the link in the address bar, which is
 * the only other route to it a reader has. Everything else in this file is
 * about the three things that write could have broken, none of which is
 * visible in the status text:
 *
 *  1. THE BACK BUTTON. `replaceState` rather than an assignment, because an
 *     assignment adds an entry and a reader who pressed Back afterwards would
 *     step to the same page with a different query string instead of leaving.
 *  2. THE READER'S OWN EDITS. The page's read half subscribes to the control
 *     registry, and it used to re-read `window.location.search` on every
 *     notification. Once the page writes its own `?s=` into that search, a
 *     re-read finds the page's own write and hands the shared values back to
 *     the controls — so switching a panel after a failed copy silently
 *     discarded whatever the reader had changed since. The read half now reads
 *     the payload ONCE, which is what "the link this page was OPENED with"
 *     means.
 *  3. THE HONESTY OF THE MESSAGE WHEN THE WRITE ALSO FAILS. A sandboxed
 *     document can refuse a same-document navigation; the message must not
 *     claim an address bar this call never wrote to.
 *
 * `modelAssertions.ts` is the harness for the mounted tool, and it is not used
 * here because it deliberately does not expose the container: these assertions
 * are about the address bar and the history, not about a stat tile. The mount
 * below is the same one, minus the readers that need the root.
 */
import { act, cleanup, fireEvent, render, screen, within, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ToolPage from '../pages/ToolPage'
import { clearControls, registeredControls, snapshotControls } from '../lib/controlRegistry'
import { decodeScenario, scenarioUrl } from '../lib/scenario'
import type { ToolId } from '../../../content/lectures'

const TOOL: ToolId = 'fiscal-policy-experiments'
const MPC = 'Marginal Propensity to Consume (MPC)'

const realClipboard = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard')

afterEach(() => {
  cleanup()
  clearControls()
  window.history.replaceState({}, '', '/macro-economics/')
  if (realClipboard) Object.defineProperty(window.navigator, 'clipboard', realClipboard)
  else delete (window.navigator as { clipboard?: unknown }).clipboard
})

/** A clipboard whose write the test decides the fate of. */
function stubClipboard(writeText: (text: string) => Promise<void>): void {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
}

const refuse = () => Promise.reject(new Error('Clipboard write was blocked'))
const accept = () => Promise.resolve()

async function openPage(toolId: ToolId = TOOL) {
  window.history.replaceState({}, '', `/macro-economics/tool/${toolId}`)
  const view = render(
    <MemoryRouter initialEntries={[`/tool/${toolId}`]}>
      <Routes>
        <Route path="/tool/:id" element={<ToolPage />} />
      </Routes>
    </MemoryRouter>,
  )
  await within(view.container).findByRole('heading', { level: 1 }, { timeout: 4000 })
  return view
}

const statusText = () => screen.getByText(/The (clipboard|link)/, { selector: 'p' }).textContent ?? ''

async function pressCopy() {
  const button = screen.getByRole('button', { name: /scenario link/i })
  await act(async () => {
    fireEvent.click(button)
  })
  return button
}

/** What the page's own registry says the controls hold, or a throw. */
function controlValue(key: string): number {
  const found = registeredControls().filter((c) => c.key === key)
  if (found.length !== 1) {
    throw new Error(`${found.length} registered controls for "${key}"`)
  }
  return found[0].get()
}

describe('the share control when the clipboard refuses', () => {
  it('puts the link in the address bar, and the address bar holds it', async () => {
    stubClipboard(refuse)
    await openPage()
    await pressCopy()

    // The status line makes a claim about the address bar, so the first thing
    // asserted is that the claim is checkable: a `?s=` is on the page at all.
    // Without this the rest would pass on a build that wrote nothing and a
    // status line that said nothing either.
    //
    // This is a WAIT and not a read. A refused clipboard write is a rejected
    // promise, and `replaceState` runs in its handler; `act` guarantees the
    // click was dispatched, not that the rejection has been handled. Asserting
    // synchronously raced that handler, and the race is lost whenever the
    // machine is loaded — which is why this file failed intermittently in a
    // full-suite run while passing every time it ran alone.
    await waitFor(() =>
      expect(
        new URLSearchParams(window.location.search).get('s'),
        'the page wrote no scenario into the address bar',
      ).not.toBeNull(),
    )
    const encoded = new URLSearchParams(window.location.search).get('s')

    const scenario = decodeScenario(encoded!)
    expect(scenario?.toolId).toBe(TOOL)
    // The link is the CURRENT configuration, not the defaults and not an empty
    // payload: the whole promise of the control is the settings on screen.
    expect(scenario?.params).toEqual(snapshotControls())
    expect(Object.keys(scenario?.params ?? {}).length).toBeGreaterThan(0)

    // And it is byte-for-byte the URL the clipboard was asked to hold, so a
    // reader who copies the address bar by hand gets the same link the button
    // would have given them.
    expect(window.location.href).toBe(scenarioUrl(TOOL, scenario!.params))
    expect(statusText()).toMatch(/address bar/)
  })

  it('replaces the current entry rather than pushing one, so Back still leaves', async () => {
    stubClipboard(refuse)
    await openPage()
    // Installed after the mount, because the mount itself sets the document URL
    // and a spy that counted that would be counting the harness.
    const push = vi.spyOn(window.history, 'pushState')
    const replace = vi.spyOn(window.history, 'replaceState')
    try {
      await pressCopy()
      // Paired, and the pair is the assertion. "push was never called" is
      // satisfied by a spy that was never installed, so the same test also
      // requires that the call this makes DID happen.
      expect(push, 'a new history entry was pushed').not.toHaveBeenCalled()
      expect(replace, 'the link was not written at all').toHaveBeenCalledTimes(1)
    } finally {
      push.mockRestore()
      replace.mockRestore()
    }
  })

  it('does not hand the reader their own edits back when a panel is switched', async () => {
    stubClipboard(refuse)
    await openPage()

    // The reader configures a tool, copies, fails, and keeps working. The MPC
    // slider is the control that survives every panel switch, so it is the one
    // that can be watched.
    await act(async () => {
      applyByRegistry({ [MPC]: 0.8 })
    })
    await pressCopy()
    expect(controlValue(MPC)).toBe(0.8)

    // The reader's own edit after the copy.
    await act(async () => {
      applyByRegistry({ [MPC]: 0.5 })
    })
    expect(controlValue(MPC)).toBe(0.5)

    // Switching panels unmounts one set of controls and mounts another, which
    // is what notifies the page's read half. Before the read half was changed
    // to read its payload once, this notification re-read the address bar,
    // found the `?s=` this test's own click had just written, and drove every
    // control back to 0.8 — the reader's edit gone, with nothing on screen
    // saying so.
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Exp 2: Gov Spending' }))
    })
    expect(controlValue(MPC)).toBe(0.5)
  })

  it('tells the truth when the address bar cannot be written either', async () => {
    stubClipboard(refuse)
    await openPage()
    const replace = vi
      .spyOn(window.history, 'replaceState')
      .mockImplementation(() => {
        throw new DOMException('A history state object with URL cannot be created', 'SecurityError')
      })
    try {
      const button = await pressCopy()
      const text = statusText()
      // The two failure messages are told apart by a phrase, not by a
      // keyword, because both mention the address bar — only one of them
      // claims to have written to it.
      expect(text).not.toMatch(/has been put in your address bar/)
      expect(text).toMatch(/could not put the link in the address bar/)
      // The retry is real: nothing about a failed address bar is a reason to
      // disable the control, and the usual cause of both failures is a
      // document without focus.
      expect(button).not.toBeDisabled()
    } finally {
      replace.mockRestore()
    }
  })

  it('still copies, and leaves the URL alone, when the clipboard works', async () => {
    // The failure path is the one that was wrong, and a fix that made the
    // happy path go through `replaceState` would be a worse defect: it would
    // rewrite the reader's address bar on every successful copy.
    const written: string[] = []
    const writeText = vi.fn((text: string) => {
      written.push(text)
      return accept()
    })
    stubClipboard(writeText)
    await openPage()
    const before = window.location.href
    await pressCopy()
    expect(writeText).toHaveBeenCalledTimes(1)
    expect(written[0]).toBe(scenarioUrl(TOOL, snapshotControls()))
    expect(window.location.href).toBe(before)
    expect(statusText()).not.toMatch(/address bar/)
  })
})

/** Move a control the way an arriving `?s=` does: through the control's setter. */
function applyByRegistry(params: Record<string, number>) {
  for (const [key, value] of Object.entries(params)) {
    const found = registeredControls().filter((c) => c.key === key)
    if (found.length !== 1) throw new Error(`${found.length} controls for "${key}"`)
    found[0].set(value)
  }
}
