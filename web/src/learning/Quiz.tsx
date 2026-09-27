import { useMemo, useState } from 'react'
import { Check, RotateCcw, X } from 'lucide-react'
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
    <section className="card p-s-6" aria-label="Check your understanding">
      <div className="mb-s-5 flex items-center justify-between gap-3">
        {/*
          `min-w-0` on the heading, because a flex item's automatic minimum
          size is its min-content width and "Check your understanding" is one
          unbreakable phrase: at 320px with the reader's text at 130% the row
          wanted 244px in a 214px card, so 30px of the question count hung
          outside the card. Allowing the heading below its min-content lets
          its own text wrap to a second line, which is what a two-line heading
          is for, and keeps the count on the row where it belongs.
        */}
        <h2 className="min-w-0 text-lg font-semibold text-fg">Check your understanding</h2>
        {submitted ? (
          <span
            className={`rounded-pill border px-3 py-1 text-xs font-bold tabular-nums ${
              correctCount === questions.length
                ? 'border-ok/40 bg-ok/10 text-ok-ink'
                : 'border-border bg-surface-2 text-fg-muted'
            }`}
          >
            {correctCount} / {questions.length}
          </span>
        ) : (
          <span className="text-xs tabular-nums text-fg-subtle">
            {questions.length} question{questions.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <ol className="space-y-6">
        {questions.map((question, qi) => {
          const chosen = selected[question.id]
          return (
            <li key={question.id}>
              <p className="mb-s-2 font-medium text-fg">
                {qi + 1}. {question.question}
              </p>
              <div className="space-y-1.5">
                {question.options.map((option, oi) => {
                  const isChosen = chosen === oi
                  const isAnswer = question.answer === oi
                  // STRUCTURAL: an option is a hit area, so its padding stays
                  // literal. `compact` gets to shrink the card around it and
                  // the gaps above it, never the target itself. The side
                  // inset is literal for the same reason: it is the width of
                  // the target.
                  //
                  // `tap-clear` is safe on every branch because every branch
                  // has a press state: `active:` below for the answerable
                  // ones, and `.button:disabled`'s suppressed hover for the
                  // four that are locked after submission. The
                  // `active:border-*` on the selected option is the one
                  // worth naming — a selected option that did not also
                  // respond to the press would be the only control on the
                  // page where a second click did nothing at all.
                  let cls =
                    'tap-clear flex w-full items-start gap-2.5 rounded-card border px-3 py-2.5 text-left text-sm transition-colors'
                  if (!submitted) {
                    cls += isChosen
                      ? ' border-accent bg-accent/10 text-fg active:border-accent'
                      : ' border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg active:border-fg-subtle'
                  } else if (isAnswer) {
                    cls += ' border-ok/50 bg-ok/8 text-fg'
                  } else if (isChosen) {
                    cls += ' border-bad/50 bg-bad/8 text-fg'
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
                        <Check
                          size={15}
                          className="ml-auto mt-0.5 shrink-0 text-ok"
                          aria-label="Correct answer"
                        />
                      )}
                      {submitted && isChosen && !isAnswer && (
                        <X
                          size={15}
                          className="ml-auto mt-0.5 shrink-0 text-bad"
                          aria-label="Your answer"
                        />
                      )}
                    </button>
                  )
                })}
              </div>
              {submitted && (
                <p className="mt-s-2 rounded-card bg-surface-2 px-3.5 py-s-2 text-sm leading-relaxed text-fg-muted">
                  <span
                    className={`font-semibold ${
                      selected[question.id] === question.answer ? 'text-ok-ink' : 'text-bad-ink'
                    }`}
                  >
                    {selected[question.id] === question.answer ? 'Correct. ' : 'Not quite. '}
                  </span>
                  {question.explanation}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-s-6 flex gap-2">
        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered}
            className="button button-primary"
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
