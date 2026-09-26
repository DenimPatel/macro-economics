import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import { recordVisit } from '../learning/progress'

function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/95 px-3 py-2.5 backdrop-blur md:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted md:hidden"
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
          className="hidden rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-fg-muted no-underline hover:text-fg sm:inline-block"
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

export default function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    recordVisit(location.pathname)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-surface-2 shadow-xl">
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-fg-muted"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <main key={location.pathname} className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
