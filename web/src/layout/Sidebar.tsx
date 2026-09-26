import { NavLink } from 'react-router-dom'
import { LECTURES, type Tier } from '../../../content/lectures'
import { TOOLS } from '../store'
import { TIER_META, TIER_ORDER } from '../design/tokens'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link${isActive ? ' active' : ''}`

interface SidebarProps {
  /** Called after a navigation click (used to close the mobile drawer). */
  onNavigate?: () => void
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
          <span className="grid h-8 w-8 place-items-center rounded-card bg-accent font-serif text-base font-bold text-accent-fg">
            M
          </span>
          <span className="font-serif text-[0.95rem] font-bold tracking-tight text-fg">
            MacroEconomics
          </span>
        </NavLink>
        <p className="mt-1 pl-[2.625rem] text-micro uppercase tracking-widest text-fg-subtle">
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
            <div className="section-title flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${meta.stripe}`} aria-hidden="true" />
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
    </nav>
  )
}
