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
  /**
   * Which copy of the navigation this is.
   *
   * The two copies are not the same box. The desktop one is a sticky
   * full-height column that is its own scroll container; the drawer's is the
   * content of a panel that scrolls. They used to be told apart by a
   * `@media (max-width: 768px)` block, which is where the tablet band went
   * wrong: `md` is `min-width: 768px` and `max-width: 768px` is inclusive, so
   * at exactly 768 the desktop sidebar was visible AND the media query was
   * applying, and it rendered as a 446px static column beside a 322px content
   * column. A prop says what the element is instead of guessing it from a
   * width, and the rule lives in the stylesheet (`.sidebar--drawer`) next to
   * the reasoning.
   */
  variant?: 'rail' | 'drawer'
}

function CourseProgress() {
  const { completedLectures } = useProgress()
  const done = completedLectures.length
  const total = LECTURES.length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    // The progress strip is pinned to the bottom of the sidebar. Its
    // `py-3.5` is off the 4px grid and stays literal; the 8px gap above the
    // bar is a density step.
    <div className="sticky bottom-0 border-t border-border bg-surface px-4 py-3.5">
      <div className="mb-s-2 flex items-baseline justify-between text-micro font-semibold uppercase tracking-wider text-fg-subtle">
        <span>Your progress</span>
        <span className="tabular-nums normal-case tracking-normal text-fg-muted">
          {done} / {total}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2">
        <div
          // `duration-slow` is `--dur-slow`, which multiplies
          // `--pref-motion-scale`. This used to be Tailwind's `duration-300`,
          // a literal that did not know a reader could ask for a still page —
          // so the one bar on the site that animates to a new number was the
          // one bar that kept moving under `motion: 'reduced'`.
          className="h-full rounded-full bg-accent transition-[width] duration-slow"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function Sidebar({ onNavigate, variant = 'rail' }: SidebarProps) {
  const tierLectures = TIER_ORDER.map((tier: Tier) => ({
    tier,
    meta: TIER_META[tier],
    lectures: LECTURES.filter((l) => l.tier === tier),
  })).filter((group) => group.lectures.length > 0)

  return (
    <nav
      className={variant === 'drawer' ? 'sidebar sidebar--drawer' : 'sidebar'}
      aria-label="Course navigation"
    >
      <div className="px-4 pb-s-2 pt-s-5">
        <NavLink
          to="/"
          // `hit-44` because the wordmark measures 207 x 24.3 — it clears
          // WCAG 2.5.8 on its own, so nothing is broken, but it is the first
          // thing in the list a thumb reaches for and 207x24.3 is a short band.
          // The slop extends about 10px below the link, over the top of the
          // "Interactive course" sub-label; a tap there now goes home, which is
          // where the reader was heading when they tapped the wordmark two
          // lines higher, and the label is decoration either way.
          className="hit-44 flex items-center gap-2.5 no-underline"
          onClick={onNavigate}
        >
          <BrandMark />
          <span className="text-[0.95rem] font-bold tracking-tight text-fg">MacroEconomics</span>
        </NavLink>
        <p className="mt-1 pl-[2.125rem] text-micro uppercase tracking-widest text-fg-subtle">
          Interactive course
        </p>
      </div>

      <div className="pb-s-6">
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
