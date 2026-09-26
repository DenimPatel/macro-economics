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
    <section className="card p-5" aria-label="Check your understanding">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-fg">Check your understanding</h2>
        {submitted ? (
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
            {correctCount} / {questions.length}
          </span>
        ) : (
          <span className="text-xs text-fg-subtle">{questions.length} questions</span>
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
                    'flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors'
                  if (!submitted) {
                    cls += isChosen
                      ? ' border-accent bg-accent/10 text-fg'
                      : ' border-border bg-surface text-fg-muted hover:border-accent/50'
                  } else if (isAnswer) {
                    cls += ' border-tier-beginner/60 bg-tier-beginner/10 text-fg'
                  } else if (isChosen) {
                    cls += ' border-tier-advanced/60 bg-tier-advanced/10 text-fg'
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
                      <span className="mt-0.5 w-5 shrink-0 text-xs font-bold text-fg-subtle">
                        {'ABCD'[oi]}
                      </span>
                      <span>{option}</span>
                      {submitted && isAnswer && (
                        <CheckCircle2 size={16} className="ml-auto mt-0.5 shrink-0 text-tier-beginner" />
                      )}
                      {submitted && isChosen && !isAnswer && (
                        <XCircle size={16} className="ml-auto mt-0.5 shrink-0 text-tier-advanced" />
                      )}
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <p className="mt-2 rounded-lg bg-surface-2 px-3 py-2 text-sm text-fg-muted">
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
          <button type="button" onClick={reset} className="button button-secondary inline-flex items-center gap-2">
            <RotateCcw size={14} /> Try again
          </button>
        )}
        {!submitted && !allAnswered && (
          <span className="self-center text-xs text-fg-subtle">Answer every question to check.</span>
        )}
      </div>
    </section>
  )
}
