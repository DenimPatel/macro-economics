import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Link2, RotateCcw } from 'lucide-react'
import { LECTURES, type ToolId } from '../../../content/lectures'
import { TOOLS } from '../store'
import { ToolRenderer } from '../tools/registry'
import { TierBadge } from '../components/ui'
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
        <h1 className="text-xl font-bold text-fg">Tool not found</h1>
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
      <nav className="mb-4 text-xs text-fg-subtle">
        <Link to="/tools" className="text-fg-subtle no-underline hover:text-accent">
          Tools
        </Link>{' '}
        / {info.title}
      </nav>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <TierBadge tier={info.category} />
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-fg-muted hover:text-fg"
          >
            {copied ? <Check size={13} /> : <Link2 size={13} />}
            {copied ? 'Link copied' : 'Copy scenario link'}
          </button>
          {showDataOverlay !== undefined && (
            <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-fg-muted">
              <input
                type="checkbox"
                checked={showDataOverlay}
                onChange={(e) => setShowDataOverlay(e.target.checked)}
                className="accent-[var(--c-accent)]"
              />
              Show real-data overlay where available
            </label>
          )}
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-fg">{info.title}</h1>
        <p className="mt-2 max-w-3xl text-base text-fg-muted">{info.description}</p>
      </header>

      {related.length > 0 && (
        <div className="mb-6 rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-subtle">Taught in</p>
          <div className="flex flex-wrap gap-2">
            {related.map((lecture) => (
              <Link
                key={lecture.n}
                to={`/lecture/${lecture.n}`}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-fg-muted no-underline hover:text-accent"
              >
                {lecture.n}. {lecture.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface p-3">
        <ToolRenderer toolId={toolId} />
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-fg-subtle">
        <RotateCcw size={12} /> Scenario links preserve the parameters you set here.
      </p>
    </div>
  )
}
