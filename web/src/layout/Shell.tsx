import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Github, Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import ErrorBoundary from '../components/ErrorBoundary'
import { recordVisit } from '../learning/progress'
import { LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'

/** Human label for the current route, shown in the header. */
function sectionName(pathname: string): string {
  if (pathname === '/') return 'Course home'
  if (pathname.startsWith('/lecture/')) {
    const n = Number(pathname.split('/')[2])
    const lecture = LECTURES.find((l) => l.n === n)
    return lecture ? `Lecture ${lecture.n}. ${lecture.title}` : 'Lecture'
  }
  if (pathname.startsWith('/tool/')) {
    const id = pathname.split('/')[2]
    return TOOLS[id as keyof typeof TOOLS]?.title ?? 'Tool'
  }
  const leaf = pathname.replace(/^\//, '')
  return leaf.charAt(0).toUpperCase() + leaf.slice(1)
}

function Header({
  onOpenMenu,
  menuButtonRef,
}: {
  onOpenMenu: () => void
  menuButtonRef: RefObject<HTMLButtonElement>
}) {
  const { pathname } = useLocation()
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/85 px-3 backdrop-blur md:px-6">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:text-fg md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>
      <p className="truncate text-sm font-medium text-fg-muted">{sectionName(pathname)}</p>
      <div className="ml-auto flex items-center gap-2">
        <a
          href="https://github.com/DenimPatel/macro-economics"
          target="_blank"
          rel="noreferrer noopener"
          className="hidden items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-fg sm:inline-flex"
        >
          <Github size={14} aria-hidden="true" />
          Source
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-8 text-xs text-fg-subtle md:px-8">
      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <p className="mb-2 text-micro font-bold uppercase tracking-widest text-fg-muted">
            This course
          </p>
          <ul className="space-y-1.5">
            <li>
              <Link to="/syllabus" className="text-fg-muted no-underline hover:text-accent-ink">
                Syllabus
              </Link>
            </li>
            <li>
              <Link to="/tools" className="text-fg-muted no-underline hover:text-accent-ink">
                Interactive tools
              </Link>
            </li>
            <li>
              <Link to="/cases" className="text-fg-muted no-underline hover:text-accent-ink">
                Case studies
              </Link>
            </li>
            <li>
              <Link to="/data" className="text-fg-muted no-underline hover:text-accent-ink">
                Data explorer
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-micro font-bold uppercase tracking-widest text-fg-muted">
            Reference
          </p>
          <ul className="space-y-1.5">
            <li>
              <Link to="/concepts" className="text-fg-muted no-underline hover:text-accent-ink">
                Concept map
              </Link>
            </li>
            <li>
              <Link to="/glossary" className="text-fg-muted no-underline hover:text-accent-ink">
                Glossary
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-fg-muted no-underline hover:text-accent-ink">
                About &amp; sources
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-2 text-micro font-bold uppercase tracking-widest text-fg-muted">
            Attribution
          </p>
          <p className="leading-relaxed">
            Lecture content follows the MIT OpenCourseWare macroeconomics series, MIT licensed. Tools,
            notes, and design are original. Progress is stored in this browser only.
          </p>
          <a
            href="https://github.com/DenimPatel/macro-economics"
            target="_blank"
            rel="noreferrer noopener"
            className="mt-3 inline-flex items-center gap-1.5 text-fg-muted no-underline hover:text-accent-ink"
          >
            <Github size={13} aria-hidden="true" />
            github.com/DenimPatel/macro-economics
          </a>
        </div>
      </div>
    </footer>
  )
}

/** Elements that can hold focus inside the drawer. */
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    recordVisit(location.pathname)
  }, [location.pathname])

  // Scroll restoration. `<main key={pathname}>` remounts on navigation, but
  // remounting does not move the scroll position, so moving from the middle of
  // one lecture to another used to land you halfway down the new one.
  // `instant` rather than the CSS default, which is `smooth` and would animate
  // every route change.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Modal behaviour for the drawer: move focus in, trap Tab, restore focus to
  // the hamburger on close, and lock background scroll. Without this the
  // element carried `aria-modal="true"` but behaved like an overlay.
  useEffect(() => {
    if (!menuOpen) return

    closeButtonRef.current?.focus()
    // Captured now: reading `.current` in the cleanup would race with unmount.
    const returnFocusTo = menuButtonRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      const root = drawerRef.current
      if (!root) return
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      returnFocusTo?.focus()
    }
  }, [menuOpen])

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="hidden md:block">
        <Sidebar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/50" onClick={closeMenu} />
          <div
            ref={drawerRef}
            className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-surface shadow-pop"
          >
            <div className="flex justify-end p-2">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:text-fg"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={closeMenu} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header menuButtonRef={menuButtonRef} onOpenMenu={() => setMenuOpen(true)} />
        <main
          id="main-content"
          tabIndex={-1}
          key={location.pathname}
          className="min-w-0 flex-1 px-4 py-7 outline-none md:px-8 md:py-9"
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  )
}
