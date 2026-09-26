import { useState } from 'react'
import { CheckCircle2, Lightbulb, XCircle } from 'lucide-react'

interface PredictionProps {
  question: string
  options: string[]
  answer: number
  explanation: string
}

/**
 * Commit to a guess before the answer is revealed. The point is to force a
 * prediction, not to score it.
 */
export default function Prediction({ question, options, answer, explanation }: PredictionProps) {
  const [chosen, setChosen] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  return (
    <section className="rounded-xl border border-accent/30 bg-accent/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-accent">
        <Lightbulb size={14} /> Predict first
      </div>
      <p className="mb-3 font-medium text-fg">{question}</p>

      {!revealed ? (
        <>
          <div className="flex flex-wrap gap-2">
            {options.map((option, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setChosen(i)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  chosen === i
                    ? 'border-accent bg-accent text-accent-fg'
                    : 'border-border bg-surface text-fg-muted hover:border-accent/50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={chosen == null}
            onClick={() => setRevealed(true)}
            className="button button-primary mt-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reveal
          </button>
        </>
      ) : (
        <div className="rounded-lg bg-surface px-3 py-2 text-sm text-fg-muted">
          <p className="mb-1 flex items-center gap-2 font-semibold text-fg">
            {chosen === answer ? (
              <>
                <CheckCircle2 size={16} className="text-tier-beginner" /> Correct
              </>
            ) : (
              <>
                <XCircle size={16} className="text-tier-advanced" /> The answer is{' '}
                {String.fromCharCode(65 + answer)}
              </>
            )}
          </p>
          <p>{explanation}</p>
        </div>
      )}
    </section>
  )
}
