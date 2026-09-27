import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CASE_STUDIES, LECTURES } from '../../../content/lectures'
import { TOOLS } from '../store'
import { PageHeader } from '../components/ui'
import { InfoBox } from '../components/ToolComponents'
import { useDocumentTitle } from '../lib/useDocumentTitle'

/**
 * Every route the site has, in the order a lost reader wants them. Each `to` is
 * a real route in `router.tsx`; `pages.test.tsx` reads that file and fails if
 * one of these ever stops existing, because a dead end whose links are dead
 * ends is the one page where that is unforgivable.
 */
const ROUTES: { to: string; label: string; note: string }[] = [
  { to: '/', label: 'Home', note: 'The course at a glance, and where your progress picks up' },
  { to: '/syllabus', label: 'Syllabus', note: 'All 25 lectures in order, with the tools each one uses' },
  { to: '/tools', label: 'Interactive tools', note: 'All 20 simulations, searchable and filterable by tier' },
  { to: '/cases', label: 'Case studies', note: 'The four episodes, each with the model that fits it' },
  { to: '/concepts', label: 'Concept map', note: 'Every term, linked to the lecture and the tool that use it' },
  { to: '/glossary', label: 'Glossary', note: 'The definitions in one place' },
  { to: '/data', label: 'Data explorer', note: 'The US series the tools are drawn against' },
  { to: '/about', label: 'About & sources', note: 'What is in the course, and where the material comes from' },
]

/**
 * The one thing worth saying to somebody who hit a 404 is WHY, and for three
 * of this site's four dynamic routes the answer is a shape, not a mystery:
 * `/lecture/26` is not a broken link so much as a lecture number that does not
 * exist, and saying so — with the real count — is more use than "that route
 * does not exist" ever was.
 *
 * Every branch is driven by the same data the rest of the site renders from,
 * so none of it can drift into a lie: a hint that names a tool checks `TOOLS`,
 * and one that names a lecture range is computed from `LECTURES`.
 */
function explain(pathname: string): string | null {
  const segments = pathname.split('/').filter(Boolean)
  const [head, tail] = segments

  if (head === 'lecture') {
    if (tail === undefined) {
      return `A lecture needs its number: /lecture/1 through /lecture/${LECTURES.length}. The syllabus lists all ${LECTURES.length} in order.`
    }
    const n = Number(tail)
    if (Number.isInteger(n) && n >= 1 && n <= LECTURES.length) {
      return `Lecture ${n} exists, so this is a spelling problem in the address rather than a missing page.`
    }
    return `The course has ${LECTURES.length} lectures, numbered 1 to ${LECTURES.length}, and there is no lecture ${tail}.`
  }

  if (head === 'tool') {
    if (tail === undefined) return 'A tool needs its id: /tool/is-lm-explorer is a real one.'
    const known = Object.prototype.hasOwnProperty.call(TOOLS, tail)
    if (known) return `The tool ${tail} exists, so this is a spelling problem in the address.`
    return `There is no tool called "${tail}". The index lists all ${Object.keys(TOOLS).length} of them, and you can search it.`
  }

  if (head === 'case') {
    if (tail === undefined) return `A case study needs its slug: /case/${CASE_STUDIES[0]?.slug ?? '…'} is a real one.`
    const known = CASE_STUDIES.some((study) => study.slug === tail)
    if (known) return `The case study ${tail} exists, so this is a spelling problem in the address.`
    return `There is no case study called "${tail}". There are ${CASE_STUDIES.length}, all on one page.`
  }

  if (head === 'case-studies' || head === 'case_studies') {
    return 'Case studies live at /cases.'
  }

  if (head === 'tool-list' || head === 'tools-index') return 'The tool index lives at /tools.'

  return null
}

export default function NotFound() {
  const { pathname } = useLocation()
  useDocumentTitle('Page not found')
  const hint = explain(pathname)

  return (
    <div className="reading-col">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="Nothing is served at this address. The course is still here, and everything below is a real page of it."
      />

      {/*
        The path, echoed. A 404 that will not say which address it rejected
        leaves the reader to guess whether the site dropped a page under them
        or whether their bookmark was wrong, and those are different problems
        with different fixes. It is in the monospace face because it is a
        literal, and it is selectable because a reader who wants to report or
        fix the link needs to copy it.
      */}
      <p className="mb-s-5 flex flex-wrap items-baseline gap-x-s-2 text-sm text-fg-muted">
        <span>You asked for</span>
        <code className="rounded-control border border-border bg-surface px-s-2 py-s-1 text-xs text-fg">
          {pathname}
        </code>
      </p>

      {hint && (
        <InfoBox title="About that address">
          <p>{hint}</p>
        </InfoBox>
      )}

      <ul className="elev-1 edge-lit overflow-hidden rounded-card border border-border bg-surface">
        {ROUTES.map(({ to, label, note }) => (
          <li key={to} className="border-b border-border last:border-b-0">
            <Link
              to={to}
              className="tap-clear flex items-baseline justify-between gap-s-4 px-s-4 py-s-3 no-underline transition-colors hover:bg-surface-2 active:opacity-70"
            >
              <span className="text-sm font-semibold text-fg">{label}</span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed text-fg-muted">{note}</span>
              <ArrowRight size={14} aria-hidden="true" className="shrink-0 text-fg-subtle" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
