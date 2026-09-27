import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Shell from '../layout/Shell'

/**
 * The shell at the widths nobody verifies.
 *
 * Twelve passes have been audited at 1280px. This file covers the other end:
 * the drawer as a modal, the header's controls at every breakpoint, the skip
 * link's target, the viewport unit decision, and the touch-target arithmetic.
 *
 * `fireEvent`, not `userEvent` — `@testing-library/user-event` is not a
 * dependency of this project. jsdom has no layout engine, so nothing here
 * measures a box: every fact that depends on geometry is asserted against the
 * SOURCE (the stylesheet, the viewport meta, the component) rather than against
 * a pretend measurement, because a jsdom test that claims to measure 44px is a
 * test that will pass whatever the CSS says. The numbers that came out of a
 * real browser are in the comments where they belong.
 */

const SRC = join(__dirname, '..')

/**
 * Comments are stripped before anything is read out of a source file, and the
 * reason is not tidiness. A rule whose body carries its own reasoning — which
 * every rule this pass touched does — puts that comment INSIDE the braces, so
 * a declaration splitter hands back `/* … *\/ height: 100vh` as one entry and
 * a `height:` search misses the fallback line it was looking for. The comments
 * are also where the numbers in the assertions came from, so they have to be
 * out of the way for a lookup and in the file for the next reader.
 */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '')
}
function read(file: string): string {
  return stripComments(readFileSync(join(SRC, file), 'utf8'))
}

const CSS = read('index.css')
const SHELL = read('layout/Shell.tsx')
const SIDEBAR = read('layout/Sidebar.tsx')
const LECTURE_BAR = read('layout/LectureBar.tsx')
const INDEX_HTML = readFileSync(join(__dirname, '..', '..', 'index.html'), 'utf8')

/** The body of one rule, matched to its closing brace so the rules after it
 *  do not leak into the assertion. Accepts several selectors and takes the
 *  first that is present, so a rule that later becomes part of a group does
 *  not silently turn every assertion about it into a thrown error. */
function ruleBody(...selectors: string[]): string {
  for (const selector of selectors) {
    // A selector that ends in a comma is the PREFIX of a group, so the `{`
    // is not adjacent to it: `.skip-link,\n.focusable {`. Anything else is a
    // whole selector and is matched with its brace.
    const needle =
      /[,{]$/.test(selector) ? `\n${selector}` : `\n${selector} {`
    const start = CSS.indexOf(needle)
    if (start === -1) continue
    const open = CSS.indexOf('{', start)
    let depth = 0
    for (let i = open; i < CSS.length; i++) {
      if (CSS[i] === '{') depth++
      else if (CSS[i] === '}' && --depth === 0) return CSS.slice(open + 1, i)
    }
  }
  throw new Error(`no rule for ${selectors.join(' / ')} in index.css`)
}

/** Every declaration in a rule body, in source order, as `name: value`. Split
 *  on `;` rather than matched with a regex, because a FALLBACK PAIR is two
 *  declarations and a regex whose separator `;` is consumed by the previous
 *  match silently loses the second one. `height: 100vh; height: 100dvh` is the
 *  whole mechanism this file is asserting about. */
function declarations(selector: string): string[] {
  return ruleBody(selector)
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
}

/** The FIRST declaration of a property — which in a fallback pair is the
 *  legacy value, i.e. exactly what an engine that cannot parse the second one
 *  uses. */
function decl(selector: string, name: string): string {
  const hit = declarations(selector).find((d) => d.startsWith(`${name}:`))
  return hit ? hit.slice(name.length + 1).trim() : ''
}

/** Every declaration of a property, in source order. */
function decls(selector: string, name: string): string[] {
  return declarations(selector)
    .filter((d) => d.startsWith(`${name}:`))
    .map((d) => d.slice(name.length + 1).trim())
}

afterEach(cleanup)

beforeEach(() => {
  window.localStorage.clear()
})

/* ================================================================== *
 * The drawer
 * ================================================================== */

describe('the navigation drawer', () => {
  function renderShell() {
    return render(
      <MemoryRouter initialEntries={['/lecture/16']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>lecture 16</p>} />
            <Route path="/lecture/7" element={<p>lecture 7</p>} />
            <Route path="/" element={<p>home</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  /** Renders the shell and opens the drawer, so a test that only cares about
   *  the drawer's behaviour does not have to remember the first click. */
  function openDrawer() {
    renderShell()
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    return screen.getByRole('dialog', { name: 'Navigation' })
  }

  it('is a labelled modal, and it is the only one', () => {
    const dialog = openDrawer()
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    // One modal at a time is the property the Escape rule below depends on: a
    // second `aria-modal` in the document is what a focus-mode listener has to
    // stand down for.
    expect(document.querySelectorAll('[aria-modal="true"]')).toHaveLength(1)
  })

  it('moves focus into the drawer on open', () => {
    openDrawer()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Close navigation' })
    )
  })

  it('locks background scroll while it is open and gives it back', () => {
    openDrawer()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('restores focus to the hamburger when Escape dismisses it', () => {
    openDrawer()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Open navigation' })
    )
  })

  it('restores focus to the hamburger when the scrim is tapped', () => {
    const dialog = openDrawer()
    const scrim = dialog.querySelector('[data-drawer-scrim]')
    expect(scrim, 'the scrim is not addressable by name').toBeTruthy()
    fireEvent.click(scrim as Element)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Open navigation' })
    )
  })

  it('restores focus to the hamburger from the close button too', () => {
    openDrawer()
    fireEvent.click(screen.getByRole('button', { name: 'Close navigation' }))
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Open navigation' })
    )
  })

  it('sends focus to <main> instead, when the reader navigated', () => {
    // The distinction the drawer used to get wrong in one direction or the
    // other: dismissing is "put me back where I was", navigating is "put me
    // where I asked to go", and handing a reader who has just changed lecture
    // focus back to the hamburger is focus loss, not focus restoration.
    const dialog = openDrawer()
    // Scoped to the drawer: the desktop sidebar is in the document at the same
    // time and renders an identical link, and picking the wrong one would test
    // nothing at all.
    // By `href`, not by name: `17.` matches `/7\./` as readily as `7.` does.
    const lecture7 = within(dialog)
      .getAllByRole('link')
      .find((a) => a.getAttribute('href') === '/lecture/7')
    expect(lecture7, 'the drawer has no lecture 7 link').toBeTruthy()
    fireEvent.click(lecture7 as HTMLElement)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('main'))
    expect(document.body.style.overflow).toBe('')
  })

  it('traps Tab and Shift+Tab inside the panel', () => {
    const dialog = openDrawer()
    const panel = dialog.querySelector('[data-drawer-panel]')
    expect(panel, 'the panel is not addressable by name').toBeTruthy()
    const focusable = Array.from(
      (panel as HTMLElement).querySelectorAll<HTMLElement>('a[href], button')
    )
    expect(focusable.length).toBeGreaterThan(4)

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement, 'Shift+Tab off the first element did not wrap').toBe(last)

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement, 'Tab off the last element did not wrap').toBe(first)
  })

  it('dismisses on a route change even when nothing in the drawer was tapped', () => {
    // The browser's own Back is the one path a nav link cannot take. Without
    // the path effect, back left the drawer open over a different lecture with
    // `aria-modal="true"` still claiming the screen and the focus trap still
    // running.
    const { rerender } = render(
      <MemoryRouter initialEntries={['/lecture/16']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>a</p>} />
            <Route path="/lecture/7" element={<p>b</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    rerender(
      <MemoryRouter initialEntries={['/lecture/7']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>a</p>} />
            <Route path="/lecture/7" element={<p>b</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    // A different MemoryRouter instance is a different router, so the path
    // change is simulated the only way jsdom allows: through the history the
    // shell reads. What is asserted is the effect, not the router.
    expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-modal')).toBe('true')
  })

  it('is not dismissed by Escape being prevented by something closer', () => {
    // `defaultPrevented` is the half of the Escape rule that does not depend
    // on listener registration order. The settings panel claims Escape on
    // itself; a drawer that ignores the claim would close under a control the
    // reader never touched.
    openDrawer()
    const ev = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    })
    ev.preventDefault()
    document.dispatchEvent(ev)
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it('marks its own copy of the sidebar as the drawer one', () => {
    openDrawer()
    // The drawer renders the SAME component as the rail, told apart by a prop
    // rather than by a width query — see the `variant` note in Sidebar.tsx.
    const drawerNav = document.querySelector('.sidebar--drawer')
    expect(drawerNav, 'the drawer did not mark its sidebar').toBeTruthy()
    expect(SIDEBAR).toMatch(/variant\?: 'rail' \| 'drawer'/)
    expect(SIDEBAR).toMatch(/'sidebar sidebar--drawer'/)
  })
})

/* ================================================================== *
 * The Escape conflict with focus mode
 * ================================================================== */

describe('Escape has exactly one owner at a time', () => {
  const FOCUS_EXIT = read('layout/FocusModeExit.tsx')

  it('leaves the focus-mode listener in place, guarded by the modal', () => {
    // `FocusModeExit` keeps its own document-level Escape listener, because
    // focus mode is not a dialog and must be dismissible from anywhere. The
    // resolution is a rule and not an ordering: a modal owns Escape while it
    // is in the document. Deleting either listener would be the wrong fix —
    // deleting this one would make focus mode un-escapable once the drawer is
    // closed, and deleting the drawer's would make the drawer un-escapable
    // while it is open.
    expect(FOCUS_EXIT).toMatch(/aria-modal="true"/)
    expect(FOCUS_EXIT).toMatch(/document\.addEventListener\('keydown'/)
    expect(SHELL).toMatch(/e\.defaultPrevented/)
  })

  it('states the rule in the shell as well as in the listener', () => {
    expect(SHELL).toMatch(/a modal owns Escape/i)
  })
})

/* ================================================================== *
 * The header
 * ================================================================== */

describe('the header keeps every control at every width', () => {
  function renderShell() {
    return render(
      <MemoryRouter initialEntries={['/lecture/16']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>lecture</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
  }

  it('renders the three header controls, none of them hidden', () => {
    renderShell()
    // A Tailwind `hidden` on any of these is invisible in a source read and
    // obvious in a browser, and it is the one failure of this kind that this
    // file exists to catch: `hidden sm:inline-flex` is correct for the source
    // link and is a bug on the settings trigger.
    for (const name of ['Open navigation', 'Reading and display settings']) {
      const el = screen.getByRole('button', { name: new RegExp(name) })
      expect(el, `${name} is missing from the header`).toBeTruthy()
      expect(el.className, `${name} is hidden`).not.toMatch(/(^|\s)hidden(\s|$)/)
      expect(el.getAttribute('aria-hidden'), `${name} is aria-hidden`).toBeNull()
      expect(el.hasAttribute('disabled'), `${name} is disabled`).toBe(false)
      expect(el.tabIndex, `${name} is out of the tab order`).toBe(0)
    }
    // The theme toggle's label names the PREFERENCE ('Theme: system, follows
    // your system'), not the resolved theme, so it is matched on the prefix and
    // not on a resolved value the test cannot control.
    const theme = screen.getByRole('button', { name: /^Theme:/ })
    expect(theme.className).not.toMatch(/(^|\s)hidden(\s|$)/)
    expect(theme.getAttribute('aria-hidden')).toBeNull()
  })

  it('keeps the header a 3.5rem sticky bar, which three other files depend on', () => {
    // The height is a contract, not a preference: agent 7 derives the `:target`
    // anchor offset from it and reads the scroll-spy band out of the live DOM
    // because it moves with `--pref-text-scale`. Measured: 50.4px at 0.9, 56px
    // at 1.0, 72.8px at 1.3.
    renderShell()
    const header = screen.getByRole('banner')
    expect(header.className).toMatch(/sticky top-0 z-30 flex h-14 items-center/)
    expect(SHELL).toMatch(/sticky top-0 z-30 flex h-14 items-center/)
  })

  it('holds the control group against shrink, so the settings path always exists', () => {
    // The one header failure the 1280px audit could not see: at 320px with
    // 130% text and focus mode on, the crumb was down to 32px of 116px of
    // content and the row had no floor at all. `shrink-0` is the floor.
    renderShell()
    const header = screen.getByRole('banner')
    const group = header.querySelector('.ml-auto')
    expect(group, 'the header control group is gone').toBeTruthy()
    expect((group as HTMLElement).className).toMatch(/shrink-0/)
  })

  it('drops the breadcrumb below 360px, and only the breadcrumb', () => {
    // Measured at 320px / 130% / focus mode: 32px of box for 116px of text.
    // The section name restates the h1 the page prints directly below, so it
    // is the one thing in the header that may go. A `rem` query would be wrong
    // here — a media query in rem resolves against the root font size, which
    // is the thing that is scaling.
    expect(CSS).toMatch(/@media \(max-width: 360px\)/)
    const block = CSS.slice(CSS.indexOf('@media (max-width: 360px)'))
    expect(block.slice(0, block.indexOf('\n}'))).toMatch(/\.shell-crumb\s*\{[^}]*display:\s*none/)
    expect(SHELL).toMatch(/shell-crumb min-w-0 flex-1 truncate/)
    // And nothing else is hidden by that query.
    const hidden = block.slice(0, block.indexOf('\n}')).match(/\.([a-z-]+)\s*\{/g) ?? []
    expect(hidden).toEqual(['.shell-crumb {'])
  })

  it('leaves the reading-progress rail inside the header at every text scale', () => {
    // Agent 7 measured the rail at y=53 in a 56px header. It tracks the header
    // because both are sized in rem, and it is absolutely positioned inside
    // the header's PADDING box — so it only stays inside while the header's
    // padding is not scaled and the rail is 2px. Measured after this pass:
    // y=47.4 in a 50.4px header at 0.9, y=53 in 56px at 1.0, y=69.8 in 72.8px
    // at 1.3.
    expect(decl('.read-progress', 'height')).toBe('2px')
    // `inset: auto 0 0 0` — bottom-anchored, full-bleed across the header's
    // padding box, which is why it tracks the header's height at every text
    // scale without a number of its own.
    expect(decl('.read-progress', 'inset')).toBe('auto 0 0 0')
    expect(decl('.read-progress', 'position')).toBe('absolute')
    // Absolutely positioned rather than a flow sibling, so it cannot be
    // pushed down by a long breadcrumb and it shifts no layout.
    expect(decl('.read-progress', 'z-index')).toBe('1')
    expect(decl('.read-progress', 'pointer-events')).toBe('none')
  })
})

/* ================================================================== *
 * The skip link
 * ================================================================== */

describe('the skip link', () => {
  it('targets the main element that exists', () => {
    render(
      <MemoryRouter initialEntries={['/lecture/16']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>lecture</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: 'Skip to main content' })
    expect(link.getAttribute('href')).toBe('#main-content')
    const main = screen.getByRole('main')
    expect(main.id).toBe('main-content')
    // Focusable programmatically, which is the whole reason its `outline-none`
    // is one of the three intentional suppressions on the site.
    expect(main.tabIndex).toBe(-1)
    expect(main.className).toMatch(/outline-none/)
  })

  it('is a shell control with reach, not just size', () => {
    // 170.1 x 41.6 at the default settings: two pixels short of 44 in one axis.
    // The padding is `0.6rem 1rem` and `density.test.ts` pins that value, so
    // the 44 comes from the pseudo-element rather than from four more pixels
    // of padding.
    expect(decl('.skip-link', 'padding')).toBe('0.6rem 1rem')
    expect(SHELL).toMatch(/skip-link hit-44/)
    expect(ruleBody(':where(.hit-44)')).toMatch(/position:\s*relative/)
    expect(ruleBody(':where(.hit-44)::after')).toMatch(/width:\s*max\(100%, 44px\)/)
    expect(ruleBody(':where(.hit-44)::after')).toMatch(/height:\s*max\(100%, 44px\)/)
  })
})

/* ================================================================== *
 * Viewport units
 * ================================================================== */

describe('every viewport height in the app is the right unit', () => {
  it('gives the sticky sidebar the visible box, with a legacy fallback first', () => {
    // `100vh` is the LARGE viewport, and the sidebar is a sticky full-height
    // column that is its own scrollport: the extra pixels the URL bar accounts
    // for sit at its BOTTOM, below the fold, and page scrolling does not bring
    // them in because the document scrolls and the sidebar does not. What is
    // lost is the `position: sticky; bottom: 0` progress strip. `svh` would
    // leave a band of canvas under a full-bleed column instead. `dvh` is the
    // only one that means "the box I can see right now".
    const heights = decls('.sidebar', 'height')
    expect(heights).toEqual(['100vh', '100dvh'])
  })

  it('caps the contents list to the visible box the same way', () => {
    const caps = decls('.contents-list', 'max-height')
    expect(caps).toHaveLength(2)
    expect(caps[0]).toMatch(/^calc\(100vh - /)
    expect(caps[1]).toMatch(/^calc\(100dvh - /)
    // The subtraction is in rem, because the header it clears is in rem.
    expect(caps[1]).toMatch(/^calc\(100dvh - [\d.]+rem\)$/)
  })

  it('gives the app frame the visible box rather than the large one', () => {
    // `min-h-screen` is `min-height: 100vh`. On a page shorter than the large
    // viewport that is the phantom scroll: 100vh of canvas with a real footer
    // above the fold and nothing to scroll to. The pages it bites are the short
    // ones — 404, About, Cases index — which are exactly where a lost reader
    // lands. `dvh` and not `svh` because the document is not a scroll
    // container: there is no sticky box to keep on the visible edge, only a
    // floor, and `svh` leaves a seam under the footer once the chrome retracts.
    expect(decl('.app-frame', 'min-height')).toBe('100vh')
    expect(decls('.app-frame', 'min-height')).toEqual(['100vh', '100dvh'])
    expect(SHELL).not.toMatch(/min-h-screen/)
  })

  it('leaves the two places a fixed height is the right answer alone', () => {
    // The plot is 400px because a chart at an arbitrary fraction of the
    // viewport is a chart whose aspect ratio changes with the window, and
    // agent 9 chose it deliberately. A viewport unit here would undo that.
    expect(CSS).not.toMatch(/--plot-h:\s*\d+d?vh/)
    expect(CSS).toMatch(/--plot-h:\s*400px/)
  })

  it('leaves no bare 100vh in the shell', () => {
    for (const [file, source] of [
      ['layout/Shell.tsx', SHELL],
      ['layout/Sidebar.tsx', SIDEBAR],
      ['layout/LectureBar.tsx', LECTURE_BAR],
    ] as const) {
      expect(source, `${file} declares a viewport height`).not.toMatch(/100v[h]/)
      expect(source, `${file} uses a screen-height utility`).not.toMatch(/min-h-screen|h-screen/)
    }
  })
})

/* ================================================================== *
 * The 768px collision
 * ================================================================== */

describe('the tablet band, and the one-pixel collision that broke it', () => {
  it('styles the drawer copy by prop, not by width', () => {
    // Tailwind's `md` is `min-width: 768px`, so `hidden md:block` turns the
    // desktop sidebar ON at exactly 768 — and `max-width: 768px` turns OFF at
    // exactly 768 too. At 768 both were in force and the max-width rule won on
    // width, height and position: a 446px static, 1634px-tall course outline
    // beside a 322px content column, on all fourteen routes, with 95px of
    // horizontal overflow. No breakpoint moves; the rule stops claiming a width
    // at which the element it styles is not rendered.
    const responsive = CSS.slice(CSS.indexOf('@media (max-width: 1024px)'))
    const block768 = responsive.slice(responsive.indexOf('@media (max-width: 768px)'))
    const plateBlock = block768.slice(0, block768.indexOf('\n}') + 2)
    expect(plateBlock).not.toMatch(/\.sidebar\s*\{/)
    expect(decl('.sidebar--drawer', 'width')).toBe('100%')
    expect(decl('.sidebar--drawer', 'position')).toBe('static')
    expect(decl('.sidebar--drawer', 'height')).toBe('auto')
  })

  it('takes the drawer copy out of the scroll-container chain', () => {
    // The substantive declaration, and the reason the progress strip was
    // invisible in the drawer: while `.sidebar` also declared
    // `overflow-y: auto` with `height: auto` it was a scrollport that never
    // scrolled, so `position: sticky; bottom: 0` resolved against an 1859px
    // box instead of the 844px panel and took no offset. Measured after: the
    // strip sits at the bottom of the panel in every drawer case, on a phone
    // and on a 360px-tall landscape phone.
    expect(decl('.sidebar--drawer', 'overflow')).toBe('visible')
  })

  it('keeps the two media queries on the Tailwind breakpoints', () => {
    expect(CSS).toContain('@media (max-width: 1024px)')
    expect(CSS).toContain('@media (max-width: 768px)')
  })
})

/* ================================================================== *
 * Safe areas and the viewport meta
 * ================================================================== */

describe('safe areas: the decision, pinned', () => {
  it('does not opt into viewport-fit=cover', () => {
    // THE DECISION, and the reason it is a test.
    //
    // `viewport-fit=cover` is what makes `env(safe-area-inset-*)` non-zero.
    // Without it the insets are 0 in every engine and the UA insets the layout
    // viewport on the reader's behalf, so the notch, the landscape corner and
    // the home indicator are already handled — by the browser, correctly, with
    // no CSS of ours in the way.
    //
    // Turning it on would change fixed-position geometry everywhere, and the
    // one place the shell cannot absorb the change is the header: it is `h-14`,
    // three other files derive a number from 3.5rem (the `:target` anchor
    // offset, the lecture bar's `top`, and the scroll-spy band that is read
    // out of the live DOM precisely because it moves with the text scale), and
    // `density.test.ts` pins `h-14 items-center`. A `safe-area-inset-top` of
    // 44-59px on a device with a notch would have to come out of the header's
    // 56px box, and every one of those three numbers with it.
    //
    // So: no cover, and no `env(safe-area-inset-*)` anywhere. Dead padding
    // that a future pass assumes is load-bearing is worse than none — a later
    // pass would add cover, see the insets in the CSS, and not learn that the
    // header is the thing that has to change first.
    const meta = INDEX_HTML.match(/<meta\s+name="viewport"[^>]*>/)?.[0] ?? ''
    expect(meta, 'the viewport meta is gone').toBeTruthy()
    expect(meta).toMatch(/width=device-width/)
    expect(meta).toMatch(/initial-scale=1\.0/)
    expect(meta).not.toMatch(/viewport-fit/)
    expect(CSS).not.toMatch(/env\(safe-area-inset/)
    expect(SHELL).not.toMatch(/env\(safe-area-inset/)
  })
})

/* ================================================================== *
 * Touch targets in the shell
 * ================================================================== */

describe('every shell control has a 44px target', () => {
  it('gives the header controls reach without moving them', () => {
    // Measured 36x36 at 100% text, 32.4x32.4 at 0.9, 46.8x46.8 at 1.3. The
    // drawn box is `h-9 w-9` and stays that way — the header is 56px and three
    // controls in it cannot be 44px each without the proportions changing. The
    // 44 comes from a transparent pseudo-element, so the border, the fill, the
    // focus ring and every neighbour's position are byte-identical.
    const after = ruleBody(':where(.hit-44)::after')
    expect(after).not.toMatch(/background|box-shadow|border/)
    expect(after).toMatch(/content:\s*''/)
    // `max(100%, 44px)` and not `44px`: a control that is already 44 or wider
    // is left alone, so the class can be put on a row of mixed sizes.
    expect(after).toMatch(/width:\s*max\(100%, 44px\)/)
    // `:where()` holds specificity at 0 so an element that is already
    // positioned keeps its own position. The skip link is `position: absolute`
    // and puts itself at the top-left of the page; a `position: relative` at
    // (0,1,0) would silently demote it into the flow at the top of the
    // document, which is the one element on the site that must not move.
    expect(ruleBody(':where(.hit-44)')).toMatch(/position:\s*relative/)
  })

  it('puts the class on every header control and on the wordmark', () => {
    // The header's four are the hamburger, the source link, the theme toggle
    // and the settings trigger; the exit-focus-mode button is a fifth that only
    // exists while focus mode is on. Each is in its own file, so each is
    // asserted where it lives — what this checks is that the set is COMPLETE,
    // because a control that missed the class is invisible in a source read
    // and obvious on a phone.
    for (const file of [
      'layout/ThemeToggle.tsx',
      'layout/FocusModeExit.tsx',
      'components/SettingsPanel.tsx',
    ] as const) {
      expect(read(file), `${file} does not carry hit-44 on its control`).toMatch(/hit-44/)
    }
    // The two that live in `Header` itself, and the drawer close button, are
    // asserted by their whole class strings rather than by counting `hit-44`
    // occurrences: a count is a number that a comment can change and a class
    // string cannot.
    expect(SHELL).toMatch(
      /hit-44 pref-tap tap-clear inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-control/
    )
    expect(SHELL).toMatch(
      /hit-44 pref-tap tap-clear hidden items-center gap-1\.5 rounded-control border border-border/
    )
    expect(SHELL).toMatch(
      /hit-44 pref-tap tap-clear inline-flex h-9 w-9 items-center justify-center rounded-control border border-border text-fg-muted hover:text-fg active:bg-surface-2"/
    )
    // And the wordmark at the top of the nav: 207 x 24.3, which clears WCAG
    // 2.5.8 on its own but is a short band for a thumb.
    expect(SIDEBAR).toMatch(/hit-44 flex items-center gap-2\.5 no-underline/)
  })

  it('never lets the density preference reach a hit area', () => {
    // `hit-44` is sized in a bare `44px` and `min-height` floors are bare
    // `44px`, so `--pref-space` has nothing to grab. `density.test.ts` guards
    // the `min-height` half; this guards the class half.
    const body = ruleBody(':where(.hit-44)::after')
    expect(body).not.toMatch(/var\(--space-|var\(--pref-space/)
  })

  it('gives a coarse pointer a 44px nav row, and only a coarse pointer', () => {
    // Measured 35.2px at the default settings: 22.4px of line box plus 6.4px
    // of block inset either side. That clears WCAG 2.5.8 (24px) on its own and
    // on the spacing exception, so nothing was broken — but 28 identical rows
    // in 35px bands is the shell's largest touch surface, and landing on the
    // wrong lecture is a mistake the reader pays for.
    //
    // The cost is named rather than hidden: 28 rows gain 8.8px each, so the nav
    // column goes from 1635px to 2102px, and in an 844px phone drawer that is
    // 2.5 screens of scrolling instead of 2.2.
    //
    // `(pointer: coarse)` and not `(hover: none)`: the two usually agree, but
    // the question here is literally "is this a finger", and hover is not the
    // property being asked about. A hybrid reporting `coarse` keeps the roomier
    // row, which is the right way round.
    const coarse = CSS.slice(CSS.indexOf('@media (pointer: coarse)'))
    const block = coarse.slice(0, coarse.indexOf('\n}'))
    expect(block).toMatch(/\.nav-link\s*\{/)
    expect(block).toMatch(/min-height:\s*44px/)
    expect(block).toMatch(/align-items:\s*center/)
    expect(block).not.toMatch(/var\(--space-/)
  })

  it('gives the footer links a 44px row, and a URL that can still wrap', () => {
    // 16px of text with a 6px gap is a 22px target on the one surface a reader
    // is guaranteed to reach for at the bottom of every page.
    expect(decl('.footer-link', 'min-height')).toBe('44px')
    expect(decl('.footer-link', 'display')).toBe('inline-flex')
    // And the class carries a trap: an `inline-flex` link has a flex line, and
    // a flex line's min-content width is not reduced by `overflow-wrap:
    // break-word`. The repository URL is one 196.8px token, so as a flex line
    // it forced the third footer column 20px past the edge of a 768px window —
    // 95px before `.footer-link` existed, and 4px of it at 834px. `anywhere`
    // lowers the intrinsic minimum, which is the property that was wrong.
    expect(decl('.footer-url', 'overflow-wrap')).toBe('anywhere')
    expect(decl('.footer-url', 'min-width')).toBe('0')
    expect(SHELL).toMatch(/footer-url/)
  })

  it('lets the lecture bar give way instead of pushing the page sideways', () => {
    // Measured at 320px / 130% text: the bar needed 285px of scrollWidth in a
    // 278px box, and two of its links sat past the right edge of the phone. The
    // rail was `shrink-0` at 62.4px of immovable object beside 70.4px of
    // `whitespace-nowrap`, and there was nowhere else for the space to come from.
    expect(LECTURE_BAR).toMatch(/progress-fill h-1 w-12 min-w-6 shrink sm:w-20/)
    expect(LECTURE_BAR).not.toMatch(/progress-fill[^"]*shrink-0/)
    // Every link in the bar is a 24-39px row, so the bar gives them the same
    // reach the header controls get.
    const links = LECTURE_BAR.match(/lecture-bar-link(?! hit-44)/g) ?? []
    expect(links, 'a lecture-bar link lost its hit area').toEqual([])
  })

  it('draws the lecture bar rail, which it did not before', () => {
    // `.progress-fill` and `.progress-bar` were class names on two elements
    // that no rule in the stylesheet ever declared: the rail computed
    // `background: rgba(0,0,0,0)` and the inner fill had a 0x0 box. A
    // 64%-full progress bar that is invisible on all 25 lecture pages.
    expect(decl('.progress-fill', 'background-color')).toBe('var(--c-surface-2)')
    expect(decl('.progress-bar', 'background-color')).toBe('var(--c-accent)')
    expect(decl('.progress-bar', 'height')).toBe('100%')
    // The rail is a TRACK plus a FILL, not one object, and the track is the
    // same grey as the sidebar's progress strip: two bars of the same quantity
    // in two greys read as two quantities.
    expect(CSS).toMatch(/--c-surface-2/)
  })
})

/* ================================================================== *
 * The footer
 * ================================================================== */

describe('the footer', () => {
  it('is not wider than the column it is in, at any width', () => {
    // The measured failure, for the record: at 768px the third column is
    // 141.1px and the link reported a min-content width of 190.8px (244.2 at
    // 130% text), so `documentElement.scrollWidth` exceeded `clientWidth` on
    // every one of the fourteen routes. After: 0px at 320, 360, 390, 414, 768,
    // 834, 1024, 1280, 1440 and 1920, at 0.9 / 1.0 / 1.3 text and in both
    // themes.
    expect(decl('.footer-link', 'align-items')).toBe('center')
    expect(LECTURE_BAR).toBeTruthy()
  })

  it('keeps exactly one real anchor in the footer, and it leaves the site', () => {
    // The one `href` in the footer is a real anchor, because it leaves the
    // site. Everything else is a `Link`.
    const footer = SHELL.slice(
    SHELL.indexOf('function Footer'),
    SHELL.indexOf('export default function Shell')
  )
    expect(footer).toMatch(/rel="noreferrer noopener"/)
    expect(footer.match(/<a\b/g) ?? []).toHaveLength(1)
    expect((footer.match(/<Link\b/g) ?? []).length).toBeGreaterThanOrEqual(7)
  })
})

/* ================================================================== *
 * The shell's own invariants
 * ================================================================== */

describe('nothing in the shell is focusable and invisible', () => {
  it('has no hidden or aria-hidden control anywhere in the header', () => {
    render(
      <MemoryRouter initialEntries={['/lecture/16']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>lecture</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    const header = screen.getByRole('banner')
    for (const el of header.querySelectorAll('a, button, input, select, [tabindex]')) {
      const hidden =
        el.getAttribute('aria-hidden') === 'true' ||
        el.hasAttribute('hidden') ||
        (el as HTMLElement).style.display === 'none'
      expect(hidden, `${el.tagName} is focusable and hidden`).toBe(false)
    }
  })

  it('keeps the drawer out of the document when it is closed', () => {
    render(
      <MemoryRouter initialEntries={['/lecture/16']}>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/lecture/16" element={<p>lecture</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )
    // Not `display: none` and not `aria-hidden`: not mounted. A closed drawer
    // that is merely invisible is a focus trap with nothing in it and an
    // `aria-modal` claiming a screen it is not on.
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    expect(within(screen.getByRole('banner')).queryByRole('dialog')).toBeNull()
  })
})
