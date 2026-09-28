import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Markdown } from '../content/markdownComponents'
import { usePreferences } from '../lib/preferences'
import type { LectureSection } from '../content/lectureSections'

/**
 * One lecture section, with the claims up and the argument behind a toggle.
 *
 * A note is written as an argument: it introduces a distinction, builds a
 * mechanism in steps, and lands a conclusion. That is the right way to teach
 * and the wrong way to re-read, because a reader who already met the material
 * in Lecture 3 is trying to recall a claim, not rebuild it. Both readers are
 * served by showing the claims first and putting the argument one click away,
 * rather than by choosing between them once for the whole site.
 *
 * The toggle is a real disclosure — `aria-expanded`, `aria-controls`, and the
 * detail is unmounted when closed rather than hidden with CSS, so a collapsed
 * lecture does not put eight full sections of prose into the accessibility
 * tree for a reader who asked for the sketch.
 */
export function LectureSectionCard({
  section,
  open: openProp,
  onToggle,
}: {
  section: LectureSection
  /** Overrides the persisted preference; the per-page switch uses this. */
  open?: boolean
  onToggle?: (next: boolean) => void
}) {
  const preferred = usePreferences((p) => p.lectureDetail === 'full')
  const [localOpen, setLocalOpen] = useState<boolean | null>(null)
  const open = openProp ?? localOpen ?? preferred
  const panelId = useId()
  const headingId = section.anchor || `${panelId}-h`
  const hasDetail = section.detail.trim().length > 0

  const setOpen = (next: boolean) => {
    setLocalOpen(next)
    onToggle?.(next)
  }

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-plate border border-border bg-surface p-s-4 elev-1"
    >
      {section.heading ? (
        <h2
          // The slug the contents list links to, NOT `useId()`. The contents is
          // built from the markdown by `contentsHeadings`, and when the two
          // disagree every link in the rail and in the mobile disclosure is
          // dead and `useScrollSpy` observes nothing — the page looks correct
          // and none of its navigation works. `section.anchor` is
          // `headingAnchor(raw)`, and a test holds the two in agreement for
          // all 25 notes.
          id={section.anchor}
          className="flex items-baseline gap-s-3 text-heading-sm font-semibold text-fg"
        >          {section.ordinal ? (
            <span className="tabular-nums text-fg-subtle">{section.ordinal}</span>
          ) : null}
          <span>{section.heading}</span>
        </h2>
      ) : null}

      {section.summary.trim() ? (
        <div className={section.heading ? 'mt-s-3' : ''}>
          <Markdown>{section.summary}</Markdown>
        </div>
      ) : null}

      {hasDetail ? (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen(!open)}
            className="pref-tap mt-s-3 inline-flex min-h-11 items-center gap-s-2 rounded-control border border-border-strong bg-surface px-s-3 py-s-2 text-sm font-medium text-fg-muted hover:bg-surface-2 hover:text-fg"
          >
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            />
            {open ? 'Hide the detail' : 'Show the detail'}
            <span className="sr-only"> for {section.heading || 'this section'}</span>
          </button>

          {/*
            Always mounted, `hidden` when closed. The obvious version —
            `{open && <div id={panelId}>}` — was what shipped, and it broke two
            things that no unit test could see. `aria-controls` pointed at an
            element that did not exist for every collapsed section on all 25
            notes, so a reader told "Show the detail" was told about a region
            with no id. And printing a lecture to PDF, which is a documented
            use case, printed the claims and none of the prose: measured on
            /lecture/2, a print stylesheet over a collapsed note found zero
            detail panels, because they were not in the document at all — no
            stylesheet can reveal what was never rendered. `hidden` is
            `display: none`, so the collapsed page is exactly as short as it
            was, and `index.css` opens the panel for print.
          */}
          <div
            id={panelId}
            hidden={!open}
            className="prose-lecture mt-s-4 border-t border-border pt-s-4 text-base"
          >
            <Markdown>{section.detail}</Markdown>
          </div>
        </>
      ) : null}
    </section>
  )
}
