import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Link2 } from 'lucide-react'
import type { ToolId } from '../../../content/lectures'
import { TOOLS, useAppStore, type ScenarioParams } from '../store'
import { ToolRenderer } from '../tools/registry'
import { scenarioFromSearch, scenarioUrl } from '../lib/scenario'
import {
  ambiguousKeys,
  applyScenarioParams,
  clearControls,
  snapshotControls,
  subscribeControls,
} from '../lib/controlRegistry'
import { lecturesTeaching } from '../lib/taughtIn'
import { useDocumentTitle } from '../lib/useDocumentTitle'

export default function ToolPage() {
  const { id } = useParams<{ id: string }>()
  const toolId = id as ToolId
  const info = TOOLS[toolId]
  useDocumentTitle(info?.title ?? 'Tool', info?.description)
  const setScenario = useAppStore((s) => s.setScenario)
  /*
   * `failed` and `unavailable` are two failures, not one, because the message
   * under the button is a claim about where the link is and the two cases put
   * it in different places. `failed` means the clipboard refused and the link
   * is in the address bar; `unavailable` means both routes failed and there is
   * nothing on the page to copy, which is the only state in which this
   * component can say so honestly.
   */
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed' | 'unavailable'>('idle')
  const [params, setParams] = useState<ScenarioParams>({})
  // The tool's module has mounted, so an empty registry now means a tool
  // without settings rather than a chunk that has not arrived. Every one of
  // the twenty tools has at least one control, so before this existed the
  // share control spent the whole download window telling readers their tool
  // had no settings on screen.
  const [toolReady, setToolReady] = useState(false)

  /*
   * Scenario sharing, both halves, and the reason this hook lives here rather
   * than in the tool.
   *
   * The write half is a click: read the controls the tool has actually
   * mounted, encode what they hold, copy the link. It used to read
   * `scenario?.params` out of the store, which no code in the application ever
   * wrote, so the button copied a link with an empty payload and offered a
   * file whose name promised values the file would not contain.
   *
   * The read half applies an arriving `?s=` to the controls, clamped to the
   * bounds those same controls enforce. It used to write the scenario into
   * the store, which nothing read, so a shared link arrived as a link to the
   * tool's default configuration with nothing on screen saying so.
   *
   * The timing is the one real subtlety, and it is why both halves subscribe
   * rather than read once: the tool is lazy-loaded, so on the first render
   * after a navigation no control is mounted, there is nothing to read and
   * nothing to apply a value TO. Each effect is guarded to act once.
   */
  useEffect(() => {
    const refresh = () => setParams(snapshotControls())
    refresh()
    return subscribeControls(refresh)
  }, [])

  // Controls whose label is claimed by more than one mounted control cannot be
  // named in a link, and are counted here rather than guessed at.
  const [ambiguous, setAmbiguous] = useState<string[]>([])
  useEffect(() => subscribeControls(() => setAmbiguous(ambiguousKeys())), [])

  useEffect(() => {
    // Applying once, on mount, is the obvious version and it is wrong: the
    // tool is lazy-loaded, so at that moment one control may be registered and
    // eleven have not, and a value belonging to an unregistered control has
    // nothing to move. Measured: with a `?s=` naming five parameters, the
    // first control to register received its value and the other four were
    // silently dropped — the same defect as the one this replaced, a link that
    // opens and does not restore.
    //
    // So the subscription stays open and each key is handed to whichever
    // control eventually claims it, once. A panel that mounts a beat later
    // still gets its value, and a control that remounts is not re-driven
    // because its key has already been spent.
    //
    // And the callback runs once directly, because SUBSCRIBING IS NOT THE SAME
    // AS BEING CURRENT. `subscribeControls` does not invoke a listener it has
    // just been given, and React flushes child effects before parent ones, so
    // on a warm chunk every control has already registered — and notified,
    // into an empty listener set — before this effect subscribes. Nothing
    // notifies afterwards, so on every second visit the reader's tool opened at
    // its defaults and the URL's promise was broken. Reachable in normal use:
    // follow a shared link, navigate away, come back; click a lecture's
    // mini-tool then "Open full tool", which renders the same already-loaded
    // module; or use the browser's back button onto a `?s=` URL.
    //
    // `snapshotControls` and `registeredControls` are both the wrong read here
    // and neither is called: applying a payload needs no inventory, because
    // `applyScenarioParams` resolves each key against the registry itself, and
    // the values being applied are the link's, not the tool's. What was missing
    // was the TIMING, and a second read of the registry would not supply it.
    const spent = new Set<string>()
    // Read ONCE, here, and not inside the callback. The share control writes
    // `?s=` into this same search string when the clipboard refuses, so a
    // callback that re-read the search would read the page's OWN write and
    // hand the shared values back to the controls — over whatever the reader
    // has moved since. It would read as a slider that springs back the moment
    // any panel is switched, which is the reader's edit being discarded by a
    // control that has already reported success.
    //
    // The subscription's job is late controls, not fresh links: a payload
    // belonging to a control that has not registered yet. One payload, held
    // for the life of the effect, is exactly that.
    const incoming = scenarioFromSearch(window.location.search)
    const applyIncoming = () => {
      // A link for another tool, or no link at all, is not an error: the
      // reader simply opened the tool, and the tool is what they get.
      if (incoming?.toolId === toolId) applyScenarioParams(incoming.params, spent)
    }
    // The read and the subscription share one `spent` set, and that is what
    // makes running the callback twice safe rather than merely survivable: a
    // key the read spent is one the notifications will not spend again, so no
    // control is driven twice, and a key the read could not spend — because
    // nothing had claimed it yet — is still open for the control that mounts
    // later. Both halves of the same guarantee, in one set.
    applyIncoming()
    return subscribeControls(applyIncoming)
  }, [toolId])

  // The registry is scoped to one mounted tool, so leaving the page must not
  // leave the previous tool's controls available to encode.
  useEffect(() => () => clearControls(), [])

  const controlCount = Object.keys(params).length
  const shareable = controlCount > 0

  const copyLink = useCallback(async () => {
    const current = snapshotControls()
    if (Object.keys(current).length === 0) return
    setScenario(toolId, current)
    /*
     * Built inside the guarded half, and that is not tidiness. The share key
     * is a control's visible LABEL, so building the URL runs the whole payload
     * through an encoder, and an encoder that refuses one of the labels takes
     * the whole click down with it. `encodeScenario` no longer throws on the
     * Greek and subscript letters half these tools are named in, but the
     * lesson stands: a failure to BUILD the link is the same situation as a
     * failure to copy it, and the reader gets the same honest answer rather
     * than an unhandled rejection and no status text at all.
     */
    const url = (() => {
      try {
        return scenarioUrl(toolId, current)
      } catch {
        return null
      }
    })()
    if (url) {
      try {
        await navigator.clipboard.writeText(url)
        setCopy('copied')
        return
      } catch {
        // Fall through: the clipboard is the route that just failed, and the
        // status line under the button has to be true in the state that
        // failure produces.
        try {
          /*
           * The instruction this used to print — "the link is in the address
           * bar — copy it from there" — was FALSE, because nothing put it
           * there. It is true from here, and it is true in the one state where
           * the reader has no other way to get the link.
           *
           * `replaceState`, not an assignment, for the back button: an
           * assignment would add an entry, and a reader who pressed Back after
           * a failed copy would step to the same page with a different query
           * string rather than leave it. It also leaves the route untouched —
           * the path is the one the reader is already on, only the query
           * changes — so React Router, which owns the path, never hears about
           * it.
           */
          window.history.replaceState(window.history.state, '', url)
          setCopy('failed')
          return
        } catch {
          // A sandboxed document can refuse a same-document navigation. Not
          // hypothetical, and not worth papering over with a message that
          // claims an address bar this call never wrote to.
        }
      }
    }
    setCopy('unavailable')
  }, [toolId, setScenario])

  if (!info) {
    return (
      <div className="card p-s-6">
        <h1 className="text-xl font-semibold tracking-tight text-fg">Tool not found</h1>
        <p className="mt-s-2 text-sm text-fg-muted">
          There is no tool at <span className="font-mono">{`/tool/${id ?? ''}`}</span>.{' '}
          <Link to="/tools" className="tap-clear no-underline hover:underline active:opacity-70">
            The index lists all {Object.keys(TOOLS).length}
          </Link>
          .
        </p>
      </div>
    )
  }

  // The same lookup `TaughtIn` uses, off the same memo: the tools index
  // built it for twenty cards and this page wants it for one.
  const related = lecturesTeaching(toolId)

  return (
    <div>
      <nav className="mb-s-5 text-xs text-fg-subtle" aria-label="Breadcrumb">
        <Link
          to="/tools"
          className="tap-clear text-fg-subtle no-underline hover:text-accent-ink active:opacity-70"
        >
          Tools
        </Link>{' '}
        <span aria-hidden="true">/</span> {info.title}
      </nav>

      <header className="mb-s-6">
        <div className="mb-s-4 flex flex-wrap items-center gap-s-2">
          <Link
            to="/tools"
            className="hit-44 tap-clear rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-fg active:text-fg-subtle"
          >
            All tools
          </Link>
        </div>
        {/* The tool's own ToolHeader renders the page <h1>; repeating the title
            and description here just showed them twice in a row.

            A "Show real-data overlay where available" checkbox used to sit beside
            that link, and it was the same defect as the per-tool "Hide Data"
            button it was meant to govern: it wrote `showDataOverlay` into the
            store and nothing in the product read that field, so it was a
            control over a feature that does not exist. Every series in these
            tools is the model; there is no measured series anywhere to overlay
            on it. The `showDataOverlay !== undefined` guard around it was also
            vacuous — the field is typed `boolean`, so the condition was
            always true. Both are gone rather than disabled: a checkbox that
            says "where available" and is available nowhere is worse than no
            checkbox, because it is a promise. */}
      </header>

      {/*
        "Taught in" is the one fact on this page that connects the tool to the
        course, and it is the reason the frame is a `surface-2` band rather than
        a plain paragraph: it is a distinct object (a lookup) rather than part
        of the tool's own heading, and the recessed fill is what the elevation
        scale reserves for a well. Its padding is a density step — it is not a
        tap target, and `compact` is exactly the case where twenty controls
        and a chip row need the air back.
      */}
      {related.length > 0 && (
        <div className="mb-7 flex flex-wrap items-center gap-x-s-2 gap-y-s-2 rounded-card border border-border bg-surface-2 px-s-4 py-s-3">
          <p className="mr-1 text-micro font-bold uppercase tracking-widest text-fg-subtle">
            Taught in
          </p>
          {related.map((lecture) => (
            <Link
              key={lecture.n}
              to={`/lecture/${lecture.n}`}
              className="tap-clear rounded-pill border border-border bg-surface px-2.5 py-0.5 text-xs text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-accent-ink active:border-fg-subtle"
            >
              {lecture.n}. {lecture.title}
            </Link>
          ))}
        </div>
      )}

      {/*
        A hairline frame, not a raised plate. The tool draws its chart in a
        recessed well on the canvas colour, so this is a lid over a well: at
        `--elev-2` the lid and the well's surround would both be raised and
        the page would have no depth left to spend. See the same note in
        `CaseStudyPage.tsx`, which frames a tool identically.
      */}
      <div className="rounded-plate border border-border bg-surface p-s-4">
        <ToolRenderer toolId={toolId} onReady={() => setToolReady(true)} />
      </div>

      {/*
        The share control, and both of its states are honest.

        It used to be permanently disabled with a paragraph explaining that
        sharing was not available for any tool. It is disabled now only when
        there is genuinely nothing to share — a tool with no numeric control
        mounted — and enabled otherwise, because `snapshotControls` returns
        what the controls actually hold.

        A spec listing every control's key and bounds was the other option
        and was measured first: 119 `SliderControl` / `NumberInput` call sites
        across the twenty tools, with the bounds living only in the JSX props.
        Transcribing them into a parallel record is the "two literals for one
        number" problem `lib/toolReset.ts` exists to delete, and a mistyped
        bound is worse than a missing feature — the link would open, look
        authoritative, and show a configuration the sharer never saw. So the
        controls register themselves in `lib/controlRegistry.ts` and the bound
        that gets encoded is the bound the input enforces.
      */}
      <footer className="mt-s-4 border-t border-border pt-s-4">
        <div className="flex flex-wrap items-center gap-x-s-3 gap-y-s-2">
          <button
            type="button"
            onClick={copyLink}
            disabled={!shareable || copy === 'copied'}
            aria-describedby="scenario-status"
            className="button button-secondary hit-44"
            title={
              !toolReady
                ? 'Waiting for the simulation to load'
                : shareable
                  ? 'Copy a link to this tool with the settings now on screen'
                  : 'This tool has no settings to share'
            }
          >
            <Link2 size={14} aria-hidden="true" />{' '}
            {copy === 'copied' ? 'Link copied' : 'Copy scenario link'}
          </button>
        </div>
        <p id="scenario-status" aria-live="polite" className="mt-s-3 text-xs leading-relaxed text-fg-subtle">
          {shareable ? (
            copy === 'copied' ? (
              <>
                Copied. The link carries this tool and the {controlCount}{' '}
                {controlCount === 1 ? 'setting' : 'settings'} on screen, and opens with them restored.
              </>
            ) : copy === 'failed' ? (
              <>
                The clipboard was not available, so the link has been put in your address bar
                instead — copy it from there. It carries this tool and the {controlCount}{' '}
                {controlCount === 1 ? 'setting' : 'settings'} on screen, and opens with them
                restored.
              </>
            ) : copy === 'unavailable' ? (
              <>
                The clipboard was not available and this page could not put the link in the
                address bar either, so there is nothing here to copy. The button is still
                enabled: press it again once this page has focus.
              </>
            ) : (
                <>
                  A shared link reopens this tool with the same {controlCount}{' '}
                  {controlCount === 1 ? 'setting' : 'settings'} you can see on screen.
                  {ambiguous.length > 0 && (
                    <>
                      {' '}
                      {ambiguous.length} more {ambiguous.length === 1 ? 'control shares' : 'controls share'} a
                      label with another and {ambiguous.length === 1 ? 'is' : 'are'} left out of the link
                      rather than guessed at.
                    </>
                  )}
                </>
              )
          ) : !toolReady ? (
            <>
              Loading the simulation, so there is nothing to share yet. The link becomes
              available once its settings are on screen.
            </>
          ) : (
            <>
              Not available for this tool yet: it has no settings on screen, so there is no scenario
              to put in a link.
            </>
          )}
        </p>
      </footer>
    </div>
  )
}
