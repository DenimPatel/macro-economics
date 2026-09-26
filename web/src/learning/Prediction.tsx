import { useState } from 'react'
import { Check, X } from 'lucide-react'

interface PredictionProps {
  question: string
  options: string[]
  answer: number
  explanation: string
}

/**
 * Commit to a guess before the answer is revealed. The point is to force a
 * prediction, not to score it — so this is the one note on a lecture page that
 * is styled as interactive rather than as reference material.
 */
export default function Prediction({ question, options, answer, explanation }: PredictionProps) {
  const [chosen, setChosen] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="note note--try mb-8">
      <div className="note__head">
        <span className="note__icon">
          <span aria-hidden="true" className="text-[0.6875rem] font-bold leading-none">
            ?
          </span>
        </span>
        <p className="note__label">Predict first</p>
      </div>

      <p className="font-medium text-fg">{question}</p>

      {!revealed ? (
        <>
          <div className="flex flex-wrap gap-2">
            {options.map((option, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChosen(i)}
                aria-pressed={chosen === i}
                className={`rounded-card border px-3 py-1.5 text-sm transition-colors ${
                  chosen === i
                    ? 'border-accent bg-accent/10 font-semibold text-accent-ink'
                    : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div>
            <button
              type="button"
              disabled={chosen == null}
              onClick={() => setRevealed(true)}
              className="button button-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reveal
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-card border border-border bg-surface p-3.5 text-sm text-fg-muted">
          <p
            className={`mb-1.5 flex items-center gap-2 font-semibold ${
              chosen === answer ? 'text-ok-ink' : 'text-bad-ink'
            }`}
          >
            {chosen === answer ? (
              <>
                <Check size={15} aria-hidden="true" /> Correct
              </>
            ) : (
              <>
                <X size={15} aria-hidden="true" /> The answer is {String.fromCharCode(65 + answer)}
              </>
            )}
          </p>
          <p className="leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  )
}
