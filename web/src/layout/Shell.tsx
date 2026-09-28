import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Github, Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'
import ThemeToggle from './ThemeToggle'
import FocusModeExit from './FocusModeExit'
import ReadingProgress from './ReadingProgress'
import SettingsControl from '../components/SettingsPanel'
import ErrorBoundary from '../components/ErrorBoundary'
import { PageSkeleton } from '../components/ui'
import { recordVisit } from '../learning/progress'
import { LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'
import { LECTURE_ARTICLE_ID } from '../lib/readingProgress'

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
  menuOpen,
}: {
  onOpenMenu: () => void
  menuButtonRef: RefObject<HTMLButtonElement>
  menuOpen: boolean
}) {
  const { pathname } = useLocation()
  const isLecture = pathname.startsWith('/lecture/')
  const section = sectionName(pathname)
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/85 px-3 backdrop-blur md:px-6">
      <button
        ref={menuButtonRef}
        type="button"
        onClick={onOpenMenu}
        // `hit-44` is reach, not size: a 36px box with a 44px hit area, so the
        // header keeps the proportions it was drawn at and the finger gets the
        // target. See the class in index.css for why it is a pseudo-element and
        // not padding.
        className="hit-44 pref-tap tap-clear inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg active:bg-surface-2 md:hidden"
        aria-label="Open navigation"
        // A disclosure that reports no state is a button a screen reader has
        // to press to find out what it does. The drawer it opens is a modal
        // dialog, so this is also the element that owns the transition the
        // reader is about to be moved into.
        aria-expanded={menuOpen}
        aria-controls="course-drawer"
      >
        <Menu size={18} />
      </button>
      {/* `min-w-0` so it can shrink below its content, `flex-1` so it takes
          the free space rather than letting `ml-auto` absorb all of it and
          leaving the label to compete for the leftovers, and `title` so a
          truncated label is still recoverable on hover and long-press. It is a
          `<p>` and not a control: nothing in the header's left half is
          focusable, and the section name restates the `h1` the page prints
          directly below, so it is dropped outright below 360px rather than
          left as a two-character sliver (see the `.shell-crumb` rule). */}
      <p className="shell-crumb min-w-0 flex-1 truncate text-sm font-medium text-fg-muted" title={section}>
        {section}
      </p>
      {/* `shrink-0` is load-bearing. Every control in here has a fixed width
          (or, for the focus-mode exit, a padding-derived one), but a flex item
          still shrinks below its width when the row is too narrow, and the
          thing that shrinks first is the row's only route to the settings
          panel. Measured before this: nothing, at any width — but the row had
          no floor, and at 320px with 130% text and focus mode on the breadcrumb
          was down to 32px, which is two characters. */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <a
          href="https://github.com/DenimPatel/macro-economics"
          target="_blank"
          rel="noreferrer noopener"
          className="hit-44 pref-tap tap-clear hidden items-center gap-1.5 rounded-control border border-border px-2.5 py-1.5 text-xs font-medium text-fg-muted no-underline hover:border-border-strong hover:text-fg active:text-fg-subtle sm:inline-flex"
        >
          <Github size={14} aria-hidden="true" />
          Source
        </a>
        <ThemeToggle />
        <FocusModeExit />
        <SettingsControl />
      </div>
      {isLecture && <ReadingProgress targetId={LECTURE_ARTICLE_ID} label="Reading progress" />}
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-s-8 text-xs text-fg-subtle md:px-8">
      <div className="grid gap-s-6 sm:grid-cols-3">
        <div>
          <p className="mb-s-2 text-micro font-bold uppercase tracking-widest text-fg-muted">
            This course
          </p>
          <ul className="space-y-1.5">
            <li>
              <Link to="/syllabus" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                Syllabus
              </Link>
            </li>
            <li>
              <Link to="/tools" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                Interactive tools
              </Link>
            </li>
            <li>
              <Link to="/cases" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                Case studies
              </Link>
            </li>
            <li>
              <Link to="/data" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                Data explorer
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-s-2 text-micro font-bold uppercase tracking-widest text-fg-muted">
            Reference
          </p>
          <ul className="space-y-1.5">
            <li>
              <Link to="/concepts" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                Concept map
              </Link>
            </li>
            <li>
              <Link to="/glossary" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                Glossary
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link tap-clear text-fg-muted no-underline hover:text-accent-ink active:text-accent">
                About &amp; sources
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="mb-s-2 text-micro font-bold uppercase tracking-widest text-fg-muted">
            Attribution
          </p>
          <p className="leading-relaxed">
            Lecture content follows the MIT OpenCourseWare macroeconomics series, MIT licensed. Tools,
            notes, and design are original. Progress is stored in this browser only.
          </p>
          {/* `.footer-url` on the text span is load-bearing and is the other
            *  half of this fix. A flex item's automatic minimum size is its
            *  min-content width, and a single 196.8px token has a min-content
            *  width of 196.8px however the line breaks — so as a flex line the
            *  anchor reported a minimum of 196.8 (244.2 at 130% text), its
            *  grid column offered it 141.1, and it overflowed: 95px of
            *  document overflow at 768px and 4px at 834px on every route, and
            *  72px at 768px / 58px at 844px at 130% text. The class lowers the
            *  intrinsic minimum (`overflow-wrap: anywhere`, not `break-word`,
            *  which changes where a line breaks but not what the box insists
            *  on) and removes the automatic minimum (`min-width: 0`).
            *  Measured after: 0px of overflow at every width and both text
            *  scales.
            *
            *  The icon stays a flex item with its own 13px and `shrink-0`, so
            *  it does not collapse to nothing when the column is narrow.
            *
            *  It is a real anchor, not a `Link`: it leaves the site. */}
          <a
            href="https://github.com/DenimPatel/macro-economics"
            target="_blank"
            rel="noreferrer noopener"
            className="footer-link tap-clear mt-3 text-fg-muted no-underline hover:text-accent-ink active:text-accent"
          >
            <Github size={13} aria-hidden="true" className="shrink-0" />
            <span className="footer-url">github.com/DenimPatel/macro-economics</span>
          </a>
        </div>
      </div>
    </footer>
  )
}

/** Elements that can hold focus inside the drawer. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Whether this document can answer "is this element on screen".
 *
 * The drawer's focus trap filters its candidate list down to what is actually
 * visible, because a trap that can land on a hidden control is worse than no
 * trap. The filter is `offsetParent`, which is `null` for every element in a
 * document with no layout engine — so in one, the list collapses to whatever
 * is focused, `first === last`, and the trap silently becomes a no-op. That is
 * the one place it most needs proving, so the same probe the settings panel
 * uses (`HAS_LAYOUT` there) is used here, and without a layout engine the
 * filter is skipped rather than inverted.
 */
const HAS_LAYOUT =
  typeof document !== 'undefined' && document.body.getClientRects().length > 0

export default function Shell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  // Read in the drawer's cleanup, which runs after the commit that unmounted
  // it, so the value it needs is the one from *this* render rather than the
  // one captured when the effect was created. See the focus decision below.
  const pathnameRef = useRef(location.pathname)
  pathnameRef.current = location.pathname
  // The path the drawer was opened on, written once on open.
  const openedAtRef = useRef(location.pathname)

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

  // The drawer is a route-level affordance, so a route change dismisses it
  // whether it came from a link inside it, from the reader's own history, or
  // from a hash. Without this, browser back from a drawer that was open left
  // the drawer open over a different page, with `aria-modal="true"` still
  // claiming the screen and a focus trap still running. The link taps inside
  // the drawer already called `closeMenu`; this is the path they cannot reach.
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Modal behaviour for the drawer: move focus in, trap Tab, restore focus on
  // close, and lock background scroll. Without this the element carried
  // `aria-modal="true"` but behaved like an overlay.
  useEffect(() => {
    if (!menuOpen) return

    closeButtonRef.current?.focus()
    // Captured now: reading `.current` in the cleanup would race with unmount.
    const returnFocusTo = menuButtonRef.current
    // Copied as a ref OBJECT, not as `.current`. The rule this silences
    // (`exhaustive-deps`) wants a node captured, because a node it captured
    // would be the node that existed when the drawer opened — and `<main>` is
    // keyed on the pathname, so on a navigation the one that exists at cleanup
    // time is a different element and the captured one is already unmounted.
    // Focusing the stale node is a no-op, which is the bug the rule's own
    // advice would have introduced here.
    const main = mainRef
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    openedAtRef.current = pathnameRef.current

    // ESCAPE, and who owns it.
    //
    // `FocusModeExit` also listens on `document` for Escape, so the same key
    // press reaches two handlers. The resolution is a rule rather than an
    // ordering accident: a modal owns Escape while it is in the document, and
    // the focus-mode listener stands down whenever it finds
    // `[aria-modal="true"]`. That listener is registered first (it is mounted
    // with the header, the drawer's when the drawer opens) and it bails, so
    // the drawer closes and focus mode stays on — verified in the browser at
    // 130% text in both themes, not assumed.
    //
    // `e.defaultPrevented` is the second half and it is what keeps the rule
    // from depending on registration order at all: the settings panel stops
    // propagation on its own Escape, and anything that has already claimed the
    // key wins regardless of when it attached. This handler runs after the
    // panel's, so a claim it can see is a claim it respects.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (e.defaultPrevented) return
        e.preventDefault()
        setMenuOpen(false)
        return
      }
      if (e.key !== 'Tab') return

      const root = drawerRef.current
      if (!root) return
      const focusable = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getAttribute('aria-hidden') !== 'true' &&
          (!HAS_LAYOUT || el.offsetParent !== null || el === document.activeElement),
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
      // WHERE FOCUS GOES depends on why the drawer closed, and getting this
      // wrong is what makes a modal feel broken in a way nobody can name.
      //
      //   dismissed (Escape, scrim, close button)  back to the hamburger,
      //     which is the control that opened it and the only way to open it
      //     again.
      //   navigated (a link, or history)  to `<main>`, because the reader has
      //     asked to be somewhere else. Handing focus back to the hamburger
      //     would put them on a control for the menu they are no longer in,
      //     and the next Tab would restart at the top of a page they did not
      //     ask to be at the top of. `<main>` already carries `tabIndex={-1}`
      //     and an `outline-none` for exactly this.
      if (pathnameRef.current !== openedAtRef.current) main.current?.focus()
      else returnFocusTo?.focus()
    }
  }, [menuOpen])

  return (
    <div className="app-frame flex bg-bg text-fg">
      <a href="#main-content" className="skip-link hit-44">
        Skip to main content
      </a>

      <div className="hidden md:block">
        <Sidebar />
      </div>

      {menuOpen && (
        <div
          id="course-drawer"
          className="fixed inset-0 z-40 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          {/* The scrim is a `click` handler on purpose, and the distinction is
            * the whole behaviour: a press that STARTS on the scrim and ends
            * over the panel dispatches `click` at the nearest common ancestor —
            * this dialog — so the drawer does not close, which is correct,
            * because the reader did not tap the scrim, they dragged across it.
            * A `pointerdown` handler would close on the way in and strand the
            * reader with an open drawer under their finger.
            *
            * It is a div and not a button on purpose too: it is not a
            * keyboard-reachable control, because the close button beside it is,
            * and two Escape handlers on the same key is a worse problem than
            * one. Its tap target is the whole uncovered side of the screen —
            * 102px wide at 390px and the default text size, 58.5px at 130%
            * text, and the full height in every case. */}
          <div data-drawer-scrim="" className="absolute inset-0 bg-scrim" onClick={closeMenu} />
          <div
            ref={drawerRef}
            data-drawer-panel=""
            // `h-full` is the overlay, which is `fixed inset-0`; `overscroll-
            // contain` so a flick that reaches the top or bottom of a 1900px
            // nav inside an 844px panel does not chain to the page underneath
            // (whose scroll is locked anyway, so the alternative is a rubber-
            // band on the document and a drawer that appears to move).
            className="elev-3 edge-lit absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto overscroll-contain border-r border-border bg-surface"
          >
            <div className="flex justify-end p-2">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                className="hit-44 pref-tap tap-clear inline-flex h-9 w-9 items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg active:bg-surface-2"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>
            <Sidebar onNavigate={closeMenu} variant="drawer" />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header menuButtonRef={menuButtonRef} onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          key={location.pathname}
          // The page frame's block padding is on the density scale, which is
          // where `compact` reclaims the most room on a page that is mostly
          // a list of plates. The header's own `h-14` is not: `position:
          // sticky` on the sidebar pairs with it, and every `:target` landing
          // is placed relative to it.
          className="min-w-0 flex-1 px-4 py-s-6 outline-none md:px-8 md:py-s-8"
        >
          {/* The site's one route-level `Suspense`, and it sits HERE rather
              than above this whole tree in `router.tsx` or `App.tsx`.
              Everything the twelve routes pull in is a dynamic import
              (`router.tsx`), so the first view of any route is a suspended
              one, and a boundary has to be above them. Where it goes decides
              what the reader loses while it waits:

              above `<Shell />` — the header, the sidebar, the footer and the
                skip link all unmount and come back. A route change is then a
                full-page skeleton, and every effect in here re-runs, including
                the scroll restoration that the reader would then be fighting.
              here, around the `<Outlet />` — the frame stays. The header keeps
                its section name, the sidebar keeps the current route marked,
                and the footer stays put, and only the region that is about to
                be replaced shows a skeleton. On a cold deep link this is also
                strictly better than a blank document: the chrome paints on the
                first frame and the page arrives underneath it.
              inside `<ErrorBoundary>` — deliberate order. A module that
                throws while resolving is a render throw, and the error
                boundary has to be ABOVE the boundary that catches the suspend
                to see it. Reversed, a broken page module takes down the whole
                application instead of one card.
          */}
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </div>
  )
}
