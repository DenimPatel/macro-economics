import { useAppStore, TOOLS, type Category } from '../store'

const categories: { id: Category; label: string }[] = [
  { id: 'beginner', label: '🟢 Beginner' },
  { id: 'intermediate', label: '🟡 Intermediate' },
  { id: 'advanced', label: '🔴 Advanced' },
  { id: 'case-study', label: '📊 Case Studies' },
]

export default function Sidebar() {
  const currentTool = useAppStore((state) => state.currentTool)
  const setCurrentTool = useAppStore((state) => state.setCurrentTool)

  const toolsByCategory = categories.map((cat) => ({
    ...cat,
    tools: Object.entries(TOOLS).filter(([_, info]) => info.category === cat.id),
  }))

  return (
    <aside className="sidebar">
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          📈 MacroEconomics
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Interactive Learning Tools
        </p>
      </div>

      <div style={{ paddingBottom: '1rem' }}>
        {toolsByCategory.map((category) => (
          <div key={category.id}>
            <div className="section-title">{category.label}</div>
            {category.tools.map(([toolId, toolInfo]) => (
              <button
                key={toolId}
                onClick={() => setCurrentTool(toolId as any)}
                className={`nav-link ${currentTool === toolId ? 'active' : ''}`}
                style={{ width: '100%', textAlign: 'left' }}
              >
                <div style={{ fontSize: '0.875rem' }}>{toolInfo.title}</div>
              </button>
            ))}
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #334155', marginTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
        <p>💡 Select a tool to explore macroeconomic concepts interactively.</p>
      </div>
    </aside>
  )
}
