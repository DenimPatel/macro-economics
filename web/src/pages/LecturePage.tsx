import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ExternalLink, List, Youtube } from 'lucide-react'
import { LECTURES, lectureByNumber, type LectureMeta } from '../../../content/lectures'
import { useLectureBody } from '../content/loadLectures'
import { contentsHeadings } from '../content/markdownComponents'
import { LectureBody } from '../components/LectureBody'
import TableOfContents, { ContentsDisclosure } from '../layout/TableOfContents'
import { useScrollSpy } from '../layout/useScrollSpy'
import LectureBar from '../layout/LectureBar'
import MiniTool from '../learning/MiniTool'
import Quiz from '../learning/Quiz'
import Prediction from '../learning/Prediction'
import { TierBadge } from '../components/ui'
import { useProgress, toggleLectureComplete } from '../learning/progress'
import { useDocumentTitle } from '../lib/useDocumentTitle'

function youtubeId(url: string): string | undefined {
  return /youtu\.be\/([^?]+)/.exec(url)?.[1] ?? /v=([^&]+)/.exec(url)?.[1]
}

/**
 * `[` and `]` step between lectures.
 *
 * Collision analysis, because a global key handler takes keys away from the
 * reader:
 *
 *  - Both are unmodified punctuation. Nothing types them into prose except a
 *    reader who is typing, and a reader who is typing is inside a control, and
 *    the handler refuses to run for any editable target. `Ctrl+[` / `Ctrl+]`
 *    are "previous/next tab" in several shells, so any modifier disqualifies
 *    the event.
 *  - It does nothing at the first and last lecture, so the bracket is never
 *    swallowed for a navigation that does not exist.
 *  - It is inert behind a modal, for the same reason Escape is: Escape belongs
 *    to whatever is open.
 *  - `event.key`, not `event.code`, so the bracket pressed is the bracket the
 *    reader's layout produces. It works on AZERTY.
 *  - Not `j`/`k`: those are the Gmail convention and what reader-mode
 *    extensions bind, so they would collide with muscle memory that already
 *    exists rather than with nothing.
 *  - Discoverable: both bar buttons carry the chord in their `title`.
 */
function useLectureKeys(prev: LectureMeta | undefined, next: LectureMeta | undefined) {
  const navigate = useNavigate()
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return
      if (event.key !== '[' && event.key !== ']') return
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          (typeof target.closest === 'function' && target.closest('[contenteditable="true"]')))
      ) {
        return
      }
      if (document.querySelector('[aria-modal="true"]')) return
      const to = event.key === '[' ? prev : next
      if (!to) return
      event.preventDefault()
      navigate(`/lecture/${to.n}`)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [navigate, prev, next])
}

export default function LecturePage() {
  const params = useParams<{ n: string }>()
  const n = Number(params.n)
  const lecture = Number.isFinite(n) ? lectureByNumber(n) : undefined
  const { markdown, loading, error } = useLectureBody(lecture?.n)
  const { completedLectures } = useProgress()

  const headings = useMemo(() => (markdown ? contentsHeadings(markdown) : []), [markdown])
  const activeId = useScrollSpy(headings)
  const index = lecture ? LECTURES.findIndex((l) => l.n === lecture.n) : -1
  const prev = index > 0 ? LECTURES[index - 1] : undefined
  const next = index >= 0 && index < LECTURES.length - 1 ? LECTURES[index + 1] : undefined

  useLectureKeys(prev, next)

  const toc = useRef<HTMLDetailsElement>(null)
  const openContents = useCallback(() => {
    const detail = toc.current
    if (!detail) return
    detail.open = true
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useDocumentTitle(
    lecture ? `${lecture.n}. ${lecture.title}` : 'Lecture not found',
    lecture?.summary,
  )

  if (!lecture) {
    return (
      <div className="card p-6">
        <h1 className="text-xl font-semibold tracking-tight text-fg">Lecture not found</h1>
        <p className="mt-2 text-sm text-fg-muted">
          That lecture number does not exist. <Link to="/syllabus">Back to the syllabus</Link>.
        </p>
      </div>
    )
  }

  const isDone = completedLectures.includes(lecture.n)
  const prediction = lecture.quiz[0]
  const quizQuestions = lecture.quiz.slice(1)
  const videoId = youtubeId(lecture.videoUrl)

  return (
    <div>
      <nav className="mb-5 text-xs text-fg-subtle" aria-label="Breadcrumb">
        <Link to="/syllabus" className="text-fg-subtle no-underline hover:text-accent-ink">
          Syllabus
        </Link>{' '}
        <span aria-hidden="true">/</span> Lecture {lecture.n}
      </nav>

      <LectureBar
        lecture={lecture}
        index={index}
        total={LECTURES.length}
        prev={prev}
        next={next}
        hasContents={headings.length > 0}
        onOpenContents={openContents}
      />

      <ContentsDisclosure headings={headings} activeId={activeId} detailRef={toc} />

      <div className="flex gap-10">
        <div className="min-w-0 flex-1">
          {/*
            The header is INSIDE the article column, and that is the whole
            measure fix.

            It used to sit above this flex row as a sibling of the contents
            rail, so it was as wide as the page and `max-w-3xl` capped it at
            768px, while the prose beside it was capped by the COLUMN — 678px
            at a 1280px viewport, because `TableOfContents` takes 224px and
            `gap-10` takes 40. One document, two right-hand edges, a 90px
            step between them, measured. Worse, 768px is wider than the
            reader's own maximum measure (70ch = 750.72px), so the widest
            block on the page was the one block that ignored the setting the
            settings panel offers.

            Sharing the column fixes the cause rather than the symptom: the
            header, the prediction, the prose, the video, the mini-tools, the
            quiz and the prev/next are now one stack in one box, and every one
            of them is a `.reading-col`, so `--pref-measure` applies to all of
            them at exactly the same widths. Below the width at which the
            column reaches 70ch they are all simply narrower than the maximum,
            which is what a measure setting is — an upper bound, not a target
            — and they agree with each other, which is what the reader can
            see.

            The cost, measured across the 25 titles: three of them wrap to a
            second line between 1280px and the ~1353px at which the column
            reaches the measure. Moving the contents rail to ~1360px instead
            would have removed that cost by removing the rail on 1280-1359px
            screens, which is a common laptop width; a missing rail is a
            capability the reader can tell they have lost, three wrapped
            titles are not.
          */}
          <header className="reading-col mb-8">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <TierBadge tier={lecture.tier} />
              {lecture.review && <span className="badge">Review</span>}
              <a
                href={lecture.videoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="hit-44 tap-clear inline-flex items-center gap-1 text-xs text-fg-subtle no-underline hover:text-accent-ink active:opacity-70"
              >
                <Youtube size={13} aria-hidden="true" /> Source video{' '}
                <ExternalLink size={11} aria-hidden="true" />
              </a>
            </div>
            <h1 className="text-display-md font-bold text-fg">
              {lecture.n}. {lecture.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">{lecture.summary}</p>
            <button
              type="button"
              onClick={() => toggleLectureComplete(lecture.n)}
              aria-pressed={isDone}
              className={`hit-44 mt-5 inline-flex items-center gap-2 rounded-card border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                isDone
                  ? 'border-ok/40 bg-ok/10 text-ok-ink'
                  : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg'
              }`}
            >
              <Check size={15} aria-hidden="true" /> {isDone ? 'Completed' : 'Mark as complete'}
            </button>
          </header>

          {prediction && (
            <div className="reading-col mb-8">
              <Prediction
                question={prediction.question}
                options={prediction.options}
                answer={prediction.answer}
                explanation={prediction.explanation}
              />
            </div>
          )}

          {loading && <p className="text-sm text-fg-subtle">Loading lecture…</p>}
          {error && <p className="text-sm text-bad-ink">Could not load the lecture: {error}</p>}
          {markdown && <LectureBody markdown={markdown} />}

          {videoId && (
            <details className="reading-col mt-8 rounded-card border border-border bg-surface p-4">
              <summary className="cursor-pointer text-sm font-semibold text-fg">
                Watch the source lecture
              </summary>
              <div className="mt-3 aspect-video overflow-hidden rounded-card">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Lecture ${lecture.n}: ${lecture.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </details>
          )}

          {lecture.miniTools.length > 0 && (
            <section className="reading-col mt-10">
              <h2 className="text-xl font-semibold tracking-tight text-fg">Try it</h2>
              <p className="mb-4 mt-1 text-sm leading-relaxed text-fg-muted">
                Move the controls and watch the model respond. The full tool opens a larger view.
              </p>
              {lecture.miniTools.map((spec) => (
                <MiniTool key={spec.toolId} spec={spec} />
              ))}
            </section>
          )}

          {quizQuestions.length > 0 && (
            <div className="reading-col mt-10">
              <Quiz lectureKey={`lecture-${lecture.n}`} questions={quizQuestions} />
            </div>
          )}

          <nav
            className="reading-col mt-12 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-border pt-5"
            aria-label="Previous and next lecture"
          >
            {prev ? (
              <Link
                to={`/lecture/${prev.n}`}
                rel="prev"
                className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-sm text-fg-muted no-underline hover:text-accent-ink"
              >
                <ArrowLeft size={14} className="shrink-0" aria-hidden="true" />{' '}
                <span className="line-clamp-2">
                  {prev.n}. {prev.title}
                </span>
              </Link>
            ) : (
              <Link
                to="/syllabus"
                className="inline-flex items-center gap-1.5 text-sm text-fg-muted no-underline hover:text-accent-ink"
              >
                <ArrowLeft size={14} className="shrink-0" aria-hidden="true" />
                <List size={14} className="shrink-0" aria-hidden="true" /> All lectures
              </Link>
            )}
            {next ? (
              <Link
                to={`/lecture/${next.n}`}
                rel="next"
                className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-right text-sm text-fg-muted no-underline hover:text-accent-ink"
              >
                <span className="line-clamp-2">
                  {next.n}. {next.title}
                </span>{' '}
                <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                to="/syllabus"
                className="inline-flex items-center gap-1.5 text-sm text-fg-muted no-underline hover:text-accent-ink"
              >
                All lectures
                <List size={14} className="shrink-0" aria-hidden="true" />
                <ArrowRight size={14} className="shrink-0" aria-hidden="true" />
              </Link>
            )}
          </nav>
        </div>

        <TableOfContents headings={headings} activeId={activeId} />
      </div>
    </div>
  )
}
