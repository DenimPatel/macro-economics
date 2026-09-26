import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ExternalLink, Youtube } from 'lucide-react'
import { LECTURES, lectureByNumber } from '../../../content/lectures'
import { useLectureBody } from '../content/loadLectures'
import { Markdown, extractHeadings } from '../content/markdownComponents'
import TableOfContents from '../layout/TableOfContents'
import MiniTool from '../learning/MiniTool'
import Quiz from '../learning/Quiz'
import Prediction from '../learning/Prediction'
import { TierBadge } from '../components/ui'
import { useProgress, toggleLectureComplete } from '../learning/progress'

function youtubeId(url: string): string | undefined {
  return /youtu\.be\/([^?]+)/.exec(url)?.[1] ?? /v=([^&]+)/.exec(url)?.[1]
}

export default function LecturePage() {
  const params = useParams<{ n: string }>()
  const n = Number(params.n)
  const lecture = Number.isFinite(n) ? lectureByNumber(n) : undefined
  const { markdown, loading, error } = useLectureBody(lecture?.n)
  const { completedLectures } = useProgress()

  const headings = useMemo(() => (markdown ? extractHeadings(markdown) : []), [markdown])
  const index = lecture ? LECTURES.findIndex((l) => l.n === lecture.n) : -1
  const prev = index > 0 ? LECTURES[index - 1] : undefined
  const next = index >= 0 && index < LECTURES.length - 1 ? LECTURES[index + 1] : undefined

  if (!lecture) {
    return (
      <div className="card p-6">
        <h1 className="text-xl font-bold text-fg">Lecture not found</h1>
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
      <nav className="mb-4 text-xs text-fg-subtle">
        <Link to="/syllabus" className="text-fg-subtle no-underline hover:text-accent">
          Syllabus
        </Link>{' '}
        / Lecture {lecture.n}
      </nav>

      <header className="mb-6 max-w-3xl">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <TierBadge tier={lecture.tier} />
          {lecture.review && <span className="badge">Review</span>}
          <a
            href={lecture.videoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-xs text-fg-subtle no-underline hover:text-accent"
          >
            <Youtube size={13} /> Source video <ExternalLink size={11} />
          </a>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-fg">
          {lecture.n}. {lecture.title}
        </h1>
        <p className="mt-2 text-base text-fg-muted">{lecture.summary}</p>
        <button
          type="button"
          onClick={() => toggleLectureComplete(lecture.n)}
          className={`mt-4 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-colors ${
            isDone
              ? 'border-tier-beginner/40 bg-tier-beginner/10 text-tier-beginner'
              : 'border-border bg-surface text-fg-muted hover:text-fg'
          }`}
        >
          <Check size={15} /> {isDone ? 'Completed' : 'Mark as complete'}
        </button>
      </header>

      {prediction && (
        <div className="mb-8 max-w-3xl">
          <Prediction
            question={prediction.question}
            options={prediction.options}
            answer={prediction.answer}
            explanation={prediction.explanation}
          />
        </div>
      )}

      <div className="flex gap-8">
        <div className="min-w-0 flex-1">
          {loading && <p className="text-sm text-fg-muted">Loading lecture…</p>}
          {error && <p className="text-sm text-tier-advanced">Could not load the lecture: {error}</p>}
          {markdown && <Markdown>{markdown}</Markdown>}

          {videoId && (
            <details className="mt-8 max-w-3xl rounded-xl border border-border bg-surface p-4">
              <summary className="cursor-pointer text-sm font-semibold text-fg">
                Watch the source lecture
              </summary>
              <div className="mt-3 aspect-video">
                <iframe
                  className="h-full w-full rounded-lg"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`Lecture ${lecture.n}: ${lecture.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </details>
          )}

          {lecture.miniTools.length > 0 && (
            <section className="mt-10 max-w-3xl">
              <h2 className="text-xl font-bold text-fg">Try it</h2>
              <p className="mb-2 text-sm text-fg-muted">
                Move the controls and watch the model respond. The full tool opens a larger view.
              </p>
              {lecture.miniTools.map((spec) => (
                <MiniTool key={`${spec.toolId}-${spec.preset ?? ''}`} spec={spec} />
              ))}
            </section>
          )}

          {quizQuestions.length > 0 && (
            <div className="mt-10 max-w-3xl">
              <Quiz lectureKey={`lecture-${lecture.n}`} questions={quizQuestions} />
            </div>
          )}

          <nav className="mt-10 flex max-w-3xl items-center justify-between gap-3 border-t border-border pt-5">
            {prev ? (
              <Link to={`/lecture/${prev.n}`} className="inline-flex items-center gap-1 text-sm no-underline hover:underline">
                <ArrowLeft size={14} /> {prev.n}. {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/lecture/${next.n}`}
                className="inline-flex items-center gap-1 text-right text-sm no-underline hover:underline"
              >
                {next.n}. {next.title} <ArrowRight size={14} />
              </Link>
            )}
          </nav>
        </div>

        <TableOfContents headings={headings} />
      </div>
    </div>
  )
}
