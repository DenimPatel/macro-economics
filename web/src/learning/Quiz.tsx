import { useMemo, useState } from 'react'
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import type { QuizQuestion } from '../../../content/lectures'
import { recordQuizScore } from './progress'

interface QuizProps {
  lectureKey: string
  questions: QuizQuestion[]
}

export default function Quiz({ lectureKey, questions }: QuizProps) {
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const correctCount = useMemo(
    () => questions.filter((q) => selected[q.id] === q.answer).length,
    [questions, selected],
  )

  const allAnswered = questions.every((q) => selected[q.id] != null)

  function submit() {
    setSubmitted(true)
    recordQuizScore(lectureKey, correctCount, questions.length)
  }

  function reset() {
    setSelected({})
    setSubmitted(false)
  }

  return (
    <section className="card p-6" aria-label="Check your understanding">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg font-bold text-fg">Check your understanding</h2>
        {submitted ? (
          <span className="rounded-pill bg-accent/12 px-3 py-1 text-xs font-bold tabular-nums text-accent-ink">
            {correctCount} / {questions.length}
          </span>
        ) : (
          <span className="text-xs text-fg-subtle tabular-nums">
            {questions.length} question{questions.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <ol className="space-y-5">
        {questions.map((question, qi) => {
          const chosen = selected[question.id]
          return (
            <li key={question.id}>
              <p className="mb-2 font-medium text-fg">
                {qi + 1}. {question.question}
              </p>
              <div className="space-y-1.5">
                {question.options.map((option, oi) => {
                  const isChosen = chosen === oi
                  const isAnswer = question.answer === oi
                  let cls =
                    'flex w-full items-start gap-2 rounded-card border px-3 py-2 text-left text-sm transition-colors'
                  if (!submitted) {
                    cls += isChosen
                      ? ' border-accent bg-accent/10 text-fg'
                      : ' border-border bg-surface text-fg-muted hover:border-accent/50'
                  } else if (isAnswer) {
                    cls += ' border-tier-beginner/60 bg-tier-beginner/10 text-fg'
                  } else if (isChosen) {
                    cls += ' border-tier-case/60 bg-tier-case/10 text-fg'
                  } else {
                    cls += ' border-border bg-surface text-fg-subtle'
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => setSelected((s) => ({ ...s, [question.id]: oi }))}
                      className={cls}
                    >
                      <span className="mt-0.5 w-5 shrink-0 text-xs font-bold tabular-nums text-fg-subtle">
                        {'ABCD'[oi]}
                      </span>
                      <span>{option}</span>
                      {submitted && isAnswer && (
                        <CheckCircle2
                          size={16}
                          className="ml-auto mt-0.5 shrink-0 text-tier-beginner"
                          aria-label="Correct answer"
                        />
                      )}
                      {submitted && isChosen && !isAnswer && (
                        <XCircle
                          size={16}
                          className="ml-auto mt-0.5 shrink-0 text-tier-case"
                          aria-label="Your answer"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <p className="mt-2 rounded-card bg-surface-2 px-3.5 py-2.5 text-sm leading-relaxed text-fg-muted">
                  {selected[question.id] === question.answer ? 'Correct. ' : 'Not quite. '}
                  {question.explanation}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-5 flex gap-2">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered}
            className="button button-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check answers
          </button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="button button-secondary inline-flex items-center gap-2"
          >
            <RotateCcw size={14} aria-hidden="true" /> Try again
          </button>
        )}
        {!submitted && !allAnswered && (
          <span className="self-center text-xs text-fg-subtle">Answer every question to check.</span>
        )}
      </div>
    </section>
  )
}
