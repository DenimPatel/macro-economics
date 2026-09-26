import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import { recordVisit } from '../learning/progress'

function Header({
  onOpenMenu,
  menuButtonRef,
}: {
  onOpenMenu: () => void
  menuButtonRef: RefObject<HTMLButtonElement>
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/85 px-3 py-2.5 backdrop-blur md:px-6">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted transition-colors hover:text-fg md:hidden"
        aria-label="Open navigation"
      >
        <Menu size={18} />
      </button>
      <p className="truncate text-xs text-fg-subtle">
        MIT-style macroeconomics, made interactive. Type nothing you can break.
      </p>
      <div className="ml-auto flex items-center gap-2">
        <a
          href="https://github.com/DenimPatel/macro-economics"
          target="_blank"
          rel="noreferrer noopener"
          className="hidden rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-fg-muted no-underline transition-colors hover:border-border-strong hover:text-fg sm:inline-block"
        >
          GitHub
        </a>
        <ThemeToggle />
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 text-xs text-fg-subtle md:px-8">
      <p>
        Built for learning. Lecture content follows the MIT OpenCourseWare macroeconomics series;
        tools and notes are original implementations. MIT licensed.
      </p>
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
            className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-surface-2 shadow-pop"
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
          className="min-w-0 flex-1 px-4 py-6 outline-none md:px-8 md:py-8"
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
