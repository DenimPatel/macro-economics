import { useMemo } from 'react'
import { Markdown } from '../content/markdownComponents'
import { splitSections, derivedCount } from '../content/lectureSections'
import { LectureSectionCard } from '../components/LectureSectionCard'
import { LECTURE_ARTICLE_ID } from '../lib/readingProgress'
import { usePreferences } from '../lib/preferences'

/**
 * The lecture body, as a run of sections the reader can skim or study.
 *
 * `id` goes on the wrapper rather than on the first heading because the
 * reading-progress rail and the focus target both address the ARTICLE, and a
 * page whose `#` lands on the first section card would move the target as
 * soon as that card's heading is re-rendered.
 */
export function LectureBody({ markdown }: { markdown: string }) {
  const sections = useMemo(() => splitSections(markdown), [markdown])
  const derived = useMemo(() => derivedCount(sections), [sections])

  // The site-wide default, applied as a data attribute so the whole article
  // can be opened at once from the page's own control. The per-section toggle
  // below overrides it for the section it belongs to.
  const detail = usePreferences((p) => p.lectureDetail)

  return (
    <div id={LECTURE_ARTICLE_ID} data-lecture-detail={detail} data-derived-sections={derived}>
      <div className="space-y-s-5">
        {sections.map((section) =>
          section.heading ? (
            <LectureSectionCard key={section.id} section={section} />
          ) : (
            // The note's preamble. No toggle above the fold: a reader who has
            // not started the lecture is not the reader this is for.
            <div key={section.id} className="reading-col prose-lecture text-base">
              <Markdown>{section.detail || section.summary}</Markdown>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
