import { NavLink } from 'react-router-dom'
import { LECTURES, type Tier } from '../../../content/lectures'
import { TOOLS } from '../store'
import { TIER_META, TIER_ORDER } from '../design/tokens'
import BrandMark from '../components/BrandMark'
import { LevelMeter } from '../components/ui'
import { useProgress } from '../learning/progress'

const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active' : ''}`

interface SidebarProps {
  /** Called after a navigation click (used to close the mobile drawer). */
  onNavigate?: () => void
}

function CourseProgress() {
  const { completedLectures } = useProgress()
  const done = completedLectures.length
  const total = LECTURES.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div className="sticky bottom-0 border-t border-border bg-surface px-4 py-3.5">
      <div className="mb-2 flex items-baseline justify-between text-micro font-semibold uppercase tracking-wider text-fg-subtle">
        <span>Your progress</span>
        <span className="tabular-nums normal-case tracking-normal text-fg-muted">
          {done} / {total}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const tierLectures = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: LECTURES.filter((l) => l.tier === tier),
  })).filter((group) => group.lectures.length > 0)

  return (
    <nav className="sidebar" aria-label="Course navigation">
      <div className="px-4 pb-2 pt-5">
        <NavLink to="/" className="flex items-center gap-2.5 no-underline" onClick={onNavigate}>
          <BrandMark />
          <span className="text-[0.95rem] font-bold tracking-tight text-fg">MacroEconomics</span>
        </NavLink>
        <p className="mt-1 pl-[2.125rem] text-micro uppercase tracking-widest text-fg-subtle">
          Interactive course
        </p>
      </div>

      <div className="pb-6">
        <div className="section-title">Course</div>
        <NavLink to="/" end className={linkClass} onClick={onNavigate}>
          Home
        </NavLink>
        <NavLink to="/syllabus" className={linkClass} onClick={onNavigate}>
          Syllabus
        </NavLink>
        <NavLink to="/concepts" className={linkClass} onClick={onNavigate}>
          Concept map
        </NavLink>
        <NavLink to="/glossary" className={linkClass} onClick={onNavigate}>
          Glossary
        </NavLink>

        {tierLectures.map(({ tier, meta, lectures }) => (
          <div key={tier}>
            <div className="section-title">
              <LevelMeter tier={tier} />
              {meta.label}
            </div>
            {lectures.map((lecture) => (
              <NavLink
                key={lecture.n}
                to={`/lecture/${lecture.n}`}
                className={linkClass}
                onClick={onNavigate}
              >
                <span className="text-[0.8125rem]">
                  <span className="mr-1.5 tabular-nums text-fg-subtle">{lecture.n}.</span>
                  {lecture.title}
                </span>
              </NavLink>
            ))}
          </div>
        ))}

        <div className="section-title">Practice</div>
        <NavLink to="/tools" end className={linkClass} onClick={onNavigate}>
          All tools ({Object.keys(TOOLS).length})
        </NavLink>
        <NavLink to="/cases" className={linkClass} onClick={onNavigate}>
          Case studies
        </NavLink>
        <NavLink to="/data" className={linkClass} onClick={onNavigate}>
          Data explorer
        </NavLink>

        <div className="section-title">About</div>
        <NavLink to="/about" className={linkClass} onClick={onNavigate}>
          About &amp; sources
        </NavLink>
      </div>

      <CourseProgress />
    </nav>
  )
}
