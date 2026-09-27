import { Link } from 'react-router-dom'
import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Catches render failures anywhere below it.
 *
 * The case that matters here is a failed lazy chunk. Every tool is
 * `React.lazy`, so a deploy that invalidates the old `assets/*.js` leaves any
 * open tool page throwing on import — which Suspense cannot render, and which
 * otherwise blanks the whole app. The recovery is to reload, because the user
 * is almost certainly looking at a stale index.html.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Unhandled render error', error, info)
  }

  render(): ReactNode {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div className="mx-auto max-w-lg rounded-card border border-border bg-surface p-6">
        <div className="mb-3 flex items-center gap-2 text-micro font-bold uppercase tracking-widest text-bad-ink">
          <AlertTriangle size={15} aria-hidden="true" />
          Something broke
        </div>
        <h1 className="text-lg font-bold text-fg">This page failed to load</h1>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">
          Usually a stale tab after a redeploy. Reloading fetches the new bundle.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-card bg-surface-2 p-3 font-mono text-xs text-fg-muted">
          {error.message}
        </pre>
        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            className="button button-primary"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          {/*
            A router `Link`, not `<a href={import.meta.env.BASE_URL}>`, which
            is what this was. The boundary sits inside the shell's `<main>` and
            therefore inside the router, so the course home is a route rather
            than a document: a raw anchor throws away the loaded bundle and the
            reader's scroll position to fetch an `index.html` they were already
            on. `AGENTS.md` requires `react-router-dom` for internal navigation
            and this is internal navigation.
          */}
          <Link to="/" className="button button-secondary no-underline">
            Course home
          </Link>
        </div>
      </div>
    )
  }
}
