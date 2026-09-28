import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { lazy, type ComponentType } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import Shell from '../layout/Shell'
import { TOOL_COMPONENTS, ToolRenderer } from '../tools/registry'
import { TOOLS } from '../store'

/**
 * The route-level loading boundary, and the two lazy mechanisms either side of
 * it.
 *
 * Item 8 made the twelve pages dynamic imports, which made this the site's
 * first route-level `Suspense`, and a boundary nobody has ever seen fail is not
 * evidence that it works. Three things are therefore asserted here, and the
 * third is the one that is easiest to break by accident:
 *
 *  1. the fallback is REACHABLE — not merely exported and not merely correct,
 *     but actually rendered by the real `Shell` when a real route element
 *     never resolves;
 *  2. it is the skeleton idiom and not a spinner — a spinner on every route
 *     change is worse than the bytes this change saves, and "we used a
 *     skeleton" is exactly the kind of claim a test should hold;
 *  3. `tools/registry.tsx`'s twenty lazy tools still resolve THROUGH the new
 *     boundary, and their own fallback is still the one that shows while a
 *     tool is in flight. The two mechanisms are independent: a route that
 *     resolves instantly around a suspended tool proves nothing about a route
 *     that suspends around a resolved tool, and vice versa.
 *
 * The last describe block is not about the boundary at all. It is about the
 * property the boundary exists to serve — the first chunk contains no charting
 * engine and no markdown engine — because a fallback nobody regresses is only
 * half the fix, and the other half is a test that goes red when somebody adds
 * a static import back.
 *
 * THE HARNESS LIMIT, stated once because it decides which of these could not
 * be written the obvious way. `setup.ts` stubs `ResizeObserver` as a no-op and
 * jsdom has no layout, so `ResponsiveContainer` measures zero and Recharts
 * draws nothing. A chart's contents are therefore untestable here, and nothing
 * below asserts one. A `Suspense` fallback is not a chart: it is DOM the test
 * makes, and the resolution half of every test here is an `await` on a real
 * module the bundler really loads.
 */

const SRC = join(__dirname, '..')

/** A page component whose module never arrives, so the fallback stays up. */
const Never = lazy(
  () =>
    new Promise<{ default: ComponentType }>(() => {
      /* never settles, which is the whole point */
    }),
)

/** `Shell` plus one index child, which is the shape the real router has. */
function renderShell(child: JSX.Element, entries: string[] = ['/']) {
  const router = createMemoryRouter(
    [{ path: '/', element: <Shell />, children: [{ index: true, element: child }] }],
    { initialEntries: entries },
  )
  return render(<RouterProvider router={router} />)
}

/* ================================================================== *
 * (a) and (b): the fallback is reachable, and it is a skeleton
 * ================================================================== */

describe('the route-level fallback', () => {
  it('is reachable, and it holds the frame open while it is up', () => {
    // The whole reason the boundary sits around the `<Outlet />` and not above
    // `<Shell />` is asserted here rather than described in a comment: the
    // header, the sidebar and the footer are outside it, so a page that never
    // arrives costs the reader the middle of the page and nothing else. A cold
    // deep link to a shared `/lecture/16` is the case that has to work, and it
    // is this DOM.
    const { container } = renderShell(<Never />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(container.querySelector('header.sticky')).not.toBeNull()
    expect(container.querySelector('footer')).not.toBeNull()
    // The skip link's target exists, so the first Tab still goes somewhere.
    expect(container.querySelector('#main-content')).not.toBeNull()
  })

  it('reserves the geometry of a page, so the content does not jump under the reader', () => {
    // Not a spinner and not a sentence. Measured in Chromium on the production
    // build at 300 kbps: a cold deep link to `/lecture/16` shows the sidebar,
    // the header crumb already reading "Lecture 16", the footer, and these
    // bars in the middle — and the header crumb is already correct while the
    // page itself has not arrived, because the crumb comes from the route and
    // not from the page.
    const { container } = renderShell(<Never />)
    const status = screen.getByRole('status')
    const bars = status.querySelectorAll('.bg-surface-2')
    expect(bars.length).toBeGreaterThan(4)
    // A title block and a card, so the reserved height is a page's height and
    // not one line's. `h-*` on these is a SIZE and stays literal; the gaps
    // between them are density steps.
    expect(status.querySelector('.card')).not.toBeNull()
    // The page has not landed, so it has not printed its own heading.
    expect(container.querySelector('main h1')).toBeNull()
  })

  it('is the skeleton idiom and not a spinner, in the DOM and in the source', () => {
    // A spinner is an SVG that rotates and a promise about time; a shimmer is a
    // CSS animation. Both are excluded on the page, not just in principle:
    // `motion.test.tsx` scans the component files for a duration literal, and
    // the assertions here close the other two doors.
    const { container } = renderShell(<Never />)
    const status = screen.getByRole('status')
    expect(status.querySelector('svg')).toBeNull()
    // …and the same for the rest of the page, so the spinner is not merely
    // absent from the fallback and present somewhere beside it.
    expect(container.querySelectorAll('svg[role="progressbar"], svg.animate-spin').length).toBe(0)

    // The source half needs the comments gone, not the file: the paragraph
    // above `ToolCard` quotes `transition-shadow` while explaining why it is
    // gone, and a source scan that reads prose as code is the single most
    // likely way to fail for the wrong reason.
    const body = stripComments(readFileSync(join(SRC, 'components', 'ui.tsx'), 'utf8'))
    const skeleton = body.slice(
      body.indexOf('export function PageSkeleton'),
      body.indexOf('export function Stat'),
    )
    expect(skeleton).toContain('PageSkeleton')
    for (const match of skeleton.match(/\b(?:animate|duration|transition)-[a-z0-9[\]-]+/g) ?? []) {
      // `transition-*` and `animate-*` are rejected outright; only the three
      // duration tokens are legal, and none of them is a spinner.
      expect(match, match).toMatch(/^duration-(fast|base|slow)$/)
    }
  })

  it('announces itself to a screen reader and hides the bars from it', () => {
    // `role="status"` carries the announcement; the bars are decorative and
    // must be `aria-hidden` or a screen reader reads nine empty rectangles. The
    // label is `sr-only` rather than visible on purpose: on a route change the
    // wait is 127ms in Chromium and a visible sentence is a flash, and on a
    // cold deep link it is a sentence nobody can read at 300 kbps. So the
    // fallback's ENTIRE text content is the hidden label and there is no
    // visible prose at all — which is the property, and "there is a `sr-only`
    // span somewhere in here" is not.
    const { container } = renderShell(<Never />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(status.querySelectorAll('.sr-only')).toHaveLength(1)
    expect(status.textContent).toBe('Loading page')
    expect(status.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(1)
    expect(container.querySelector('main .sr-only')).not.toBeNull()
  })

  it('is replaced by the page when the page arrives', async () => {
    // The other direction, and the one a dead fallback would pass: a boundary
    // that swallowed the resolved page would leave everything above green while
    // the site rendered nothing at all.
    renderShell(<LazyAbout />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull())
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})

/** The lazy page used by the last test above, at module scope so `lazy` is called once. */
const LazyAbout = lazy(() => import('../pages/About'))

/* ================================================================== *
 * (c): the lazy tool path, through and beside the new boundary
 * ================================================================== */

describe('the lazy tool path, which is a separate mechanism', () => {
  it("still resolves, with the tool's own fallback rather than the route's", async () => {
    // `ToolRenderer` is not lazy, so the route element resolves immediately and
    // the only suspended thing on screen is the tool. If this test ever shows
    // the ROUTE skeleton here, the two boundaries have been confused with one
    // another, which is the regression item 29 was written to catch.
    renderShell(<ToolRenderer toolId="multiplier-simulator" />)
    expect(screen.getByText(/Loading simulation/)).toBeInTheDocument()
    expect(screen.queryByRole('status')).toBeNull()
    await waitFor(() => expect(screen.queryByText(/Loading simulation/)).toBeNull())
    expect(document.querySelector('.slider-input')).not.toBeNull()
  })

  it('resolves a tool that sits inside a suspended route', async () => {
    // A real page is a `lazy` component that renders a tool, and it is the
    // composition the site actually ships: `ToolPage` under a route boundary,
    // the tool under a second one. Both have to settle, and a test of either
    // alone would pass while the pair regressed.
    const onReady = vi.fn()
    function ToolBearingRoute() {
      return <ToolRenderer toolId="is-lm-explorer" onReady={onReady} />
    }
    const LazyToolRoute = lazy(async () => ({ default: ToolBearingRoute }))
    renderShell(<LazyToolRoute />)
    // The ROUTE boundary is up first, because that module is not loaded yet.
    expect(screen.getByRole('status')).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull(), { timeout: 5000 })
    // `onReady` is `ToolRenderer`'s own signal that the tool's module mounted,
    // not merely that its boundary was mounted — which is the distinction the
    // two-mechanisms claim rests on.
    expect(onReady).toHaveBeenCalled()
    expect(document.querySelector('.slider-input')).not.toBeNull()
  })

  it('has a lazy component for every registered tool', () => {
    // The registry is a lookup table and a missing key is a dead button, not a
    // crash: `ToolRenderer` prints "This tool is not available yet." So the
    // two records have to agree, by property rather than by count.
    expect(Object.keys(TOOL_COMPONENTS).sort()).toEqual(Object.keys(TOOLS).sort())
  })
})

/* ================================================================== *
 * The split is still a split
 * ================================================================== */

/** Source with its block and whole-line comments removed, as `motion.test.tsx` does. */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '')
}

function appFiles(dir: string): string[] {  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    // `tests/` is not app code and is deliberately outside the two properties
    // below: a test may import Recharts to assert something about Recharts, and
    // no test is in the first chunk.
    if (entry === 'node_modules' || entry === 'dist' || entry === 'tests') return []
    if (statSync(full).isDirectory()) return appFiles(full)
    return /\.tsx?$/.test(entry) ? [full] : []
  })
}

/** Every `./…` specifier a file imports or re-exports, dynamic ones excluded. */
function staticSpecifiers(file: string): string[] {
  const source = readFileSync(file, 'utf8')
  return [
    ...source.matchAll(/^[ \t]*(?:import|export)\s+(?:[^'"]*?\s+from\s+)?['"](\.[^'"]+)['"]/gm),
  ].map((m) => m[1])
}

function resolveRelative(from: string, specifier: string): string | null {
  const base = join(from, '..', specifier)
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]) {
    try {
      if (statSync(candidate).isFile()) return candidate
    } catch {
      /* not this one */
    }
  }
  return null
}

/**
 * The modules reachable from `from` by following STATIC imports only, which is
 * exactly the set Rollup puts in the first chunk. A dynamic `import()` is the
 * escape hatch this whole change is built on and is not followed.
 */
function staticClosure(from: string): Set<string> {
  const seen = new Set<string>()
  const queue = [from]
  while (queue.length > 0) {
    const file = queue.pop() as string
    if (seen.has(file)) continue
    seen.add(file)
    for (const specifier of staticSpecifiers(file)) {
      const next = resolveRelative(file, specifier)
      if (next) queue.push(next)
    }
  }
  return seen
}

/** The same walk, but following dynamic imports too: everything a page can pull. */
function fullClosure(from: string): Set<string> {
  const seen = new Set<string>()
  const queue = [from]
  while (queue.length > 0) {
    const file = queue.pop() as string
    if (seen.has(file)) continue
    seen.add(file)
    const source = readFileSync(file, 'utf8')
    const specifiers = [
      ...staticSpecifiers(file),
      ...[...source.matchAll(/import\(\s*['"](\.[^'"]+)['"]\s*\)/g)].map((m) => m[1]),
    ]
    for (const specifier of specifiers) {
      const next = resolveRelative(file, specifier)
      if (next) queue.push(next)
    }
  }
  return seen
}

describe('the first chunk contains no charting engine and no markdown engine', () => {
  const FIRST_CHUNK = [...staticClosure(join(SRC, 'main.tsx'))]

  /**
   * The three measured groups, named rather than counted. Recharts with d3 and
   * lodash under it was 399 kB raw, KaTeX 253 kB, and the micromark/mdast
   * pipeline 154 kB — 806 kB, 67% of the eager chunk, none of which the landing
   * page runs. A count would have to be edited whenever a dependency changed
   * and would be a worse statement than the property.
   */
  const HEAVY = ['recharts', 'katex', 'react-markdown', 'remark-gfm', 'remark-math', 'rehype-katex']

  it('reaches none of them, so the home page downloads none of them', () => {
    const offenders: string[] = []
    for (const file of FIRST_CHUNK) {
      const source = readFileSync(file, 'utf8')
      for (const pkg of HEAVY) {
        if (source.includes(`'${pkg}'`) || source.includes(`"${pkg}"`)) {
          offenders.push(`${relative(SRC, file)} -> ${pkg}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it('holds the entry point itself, and the entry point is the only root', () => {
    // Without this the walk could pass by starting nowhere: an unreachable
    // closure is an empty list, and an empty list has no offenders in it.
    expect(FIRST_CHUNK.length).toBeGreaterThan(10)
    expect(FIRST_CHUNK).toContain(join(SRC, 'main.tsx'))
    expect(FIRST_CHUNK).toContain(join(SRC, 'router.tsx'))
    expect(FIRST_CHUNK).toContain(join(SRC, 'layout', 'Shell.tsx'))
  })

  it('and yet the pages themselves are all in the graph, as dynamic imports', () => {
    // The mirror image, because the failure this guards is the quiet one: a
    // first chunk with no Recharts in it, achieved by dropping the chart, is
    // indistinguishable from one that achieved it by splitting. Stated against
    // the directory rather than a list, so a thirteenth page is covered by
    // being added rather than by being remembered here.
    const router = readFileSync(join(SRC, 'router.tsx'), 'utf8')
    const pages = readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.tsx'))
    expect(pages.length).toBeGreaterThan(5)
    for (const page of pages) {
      const name = page.replace(/\.tsx$/, '')
      expect(router, page).toMatch(
        new RegExp(`lazy\\(\\(\\) => import\\('\\./pages/${name}'\\)\\)`),
      )
    }
    // …and a static import of one would satisfy the test above and fail this
    // one, which is the whole difference between renaming the bytes and
    // not fetching them.
    expect(staticSpecifiers(join(SRC, 'router.tsx'))).toEqual(['./layout/Shell'])
  })
})

describe('every module that names a Recharts component still reaches the one that silences it', () => {
  /**
   * `components/ChartPrimitives.tsx` silences Recharts' series animation by
   * mutating `defaultProps` on the component objects, and it used to be
   * imported for that side effect from `main.tsx` — which is precisely what put
   * Recharts in the first chunk, since a side-effect import of it is a static
   * import. The silencing now happens wherever the module is first evaluated,
   * which is correct only because a chart cannot be reached without passing
   * it. That is the claim; this is the check, over the full import graph
   * including dynamic imports, because "the tool imports the shells from
   * `ChartPrimitives`" is a statement about the import line and not about
   * whether the mutation ran.
   */
  const SILENCER = join(SRC, 'components', 'ChartPrimitives.tsx')
  // A VALUE import. `components/ChartTooltip.tsx` imports `recharts` for its
  // prop types and nothing else, and a type is erased before the bundler sees
  // it, so it neither pulls Recharts in nor needs the silencing — which is the
  // same distinction `charts.test.tsx` draws when it pins the two type-only
  // `recharts` imports to exactly two files.
  const users = appFiles(SRC).filter(
    (file) =>
      file !== SILENCER &&
      /^[ \t]*import\s+(?!type\b)[^'"]*from\s+['"]recharts['"]/m.test(
        stripComments(readFileSync(file, 'utf8')),
      ),
  )

  it('finds the Recharts importers, so the walk below is not vacuous', () => {
    expect(users.length).toBeGreaterThan(15)
  })

  it('reaches the silencer from every one of them', () => {
    const orphans = users
      .filter((file) => !fullClosure(file).has(SILENCER))
      .map((file) => relative(SRC, file))
    expect(orphans).toEqual([])
  })
})
