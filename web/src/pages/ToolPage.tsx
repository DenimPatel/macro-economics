import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Link2, RotateCcw } from 'lucide-react'
import { LECTURES, type ToolId } from '../../../content/lectures'
import { TOOLS } from '../store'
import { ToolRenderer } from '../tools/registry'
import { scenarioFromSearch, scenarioUrl } from '../lib/scenario'
import { useAppStore } from '../store'

export default function ToolPage() {
  const { id } = useParams<{ id: string }>()
  const toolId = id as ToolId
  const info = TOOLS[toolId]
  const [copied, setCopied] = useState(false)
  const setScenario = useAppStore((s) => s.setScenario)
  const setShowDataOverlay = useAppStore((s) => s.setShowDataOverlay)
  const showDataOverlay = useAppStore((s) => s.showDataOverlay)

  useEffect(() => {
    const scenario = scenarioFromSearch(window.location.search)
    if (scenario && scenario.toolId === toolId) setScenario(scenario.toolId, scenario.params)
  }, [toolId, setScenario])

  if (!info) {
    return (
      <div className="card p-6">
        <h1 className="font-serif text-xl font-bold text-fg">Tool not found</h1>
        <p className="mt-2 text-sm text-fg-muted">
          That tool does not exist. <Link to="/tools">Browse all tools</Link>.
        </p>
      </div>
    )
  }

  const related = LECTURES.filter((lecture) => lecture.tools.includes(toolId))

  async function copyLink() {
    const url = scenarioUrl(toolId, useAppStore.getState().scenario?.params ?? {})
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div>
      <nav className="mb-5 text-xs text-fg-subtle" aria-label="Breadcrumb">
        <Link to="/tools" className="text-fg-subtle no-underline hover:text-accent">
          Tools
        </Link>{' '}
        <span aria-hidden="true">/</span> {info.title}
      </nav>

      <header className="mb-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Link
            to="/tools"
            className="rounded-pill border border-border bg-surface px-3 py-1.5 text-xs text-fg-muted no-underline transition-colors hover:border-accent hover:text-accent"
          >
            All tools
          </Link>
          {showDataOverlay !== undefined && (
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-fg-muted">
              <input
                type="checkbox"
                checked={showDataOverlay}
                onChange={(e) => setShowDataOverlay(e.target.checked)}
                className="h-3.5 w-3.5 cursor-pointer accent-accent"
              />
              Show real-data overlay where available
            </label>
          )}
          <button
            type="button"
            onClick={copyLink}
            className="ml-auto inline-flex items-center gap-1.5 rounded-pill border border-border bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted transition-colors hover:border-accent hover:text-fg"
          >
            {copied ? <Check size={13} aria-hidden="true" /> : <Link2 size={13} aria-hidden="true" />}
            {copied ? 'Link copied' : 'Copy scenario link'}
          </button>
        </div>
        {/* The tool's own ToolHeader renders the page <h1>; repeating the title
            and description here just showed them twice in a row. */}
      </header>

      {related.length > 0 && (
        <div className="mb-7 rounded-card border border-border bg-surface-2 p-4">
          <p className="mb-2.5 text-micro font-bold uppercase tracking-widest text-fg-subtle">
            Taught in
          </p>
          <div className="flex flex-wrap gap-2">
            {related.map((lecture) => (
              <Link
                key={lecture.n}
                to={`/lecture/${lecture.n}`}
                className="rounded-pill border border-border bg-surface px-3 py-1 text-xs text-fg-muted no-underline transition-colors hover:border-accent hover:text-accent"
              >
                {lecture.n}. {lecture.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-plate border border-border bg-surface p-3">
        <ToolRenderer toolId={toolId} />
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-subtle">
        <RotateCcw size={12} aria-hidden="true" /> Scenario links preserve the parameters you set
        here.
      </p>
    </div>
  )
}
