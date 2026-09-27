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
    <div className="note note--try mb-s-8">
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
                // A hit area, so the padding stays literal; the note's own
                // padding and gap are on the scale.
                //
                // `active:border-fg-subtle` is the press step, and the
                // selected branch keeps `border-accent` on press rather than
                // stepping it, so a second tap on the option already chosen
                // still looks like a press. `tap-clear` is only sound here
                // because every branch has one.
                className={`tap-clear rounded-card border px-3 py-1.5 text-sm transition-colors ${
                  chosen === i
                    ? 'border-accent bg-accent/10 font-semibold text-accent-ink active:border-accent'
                    : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg active:border-fg-subtle'
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
              className="button button-primary"
            >
              Reveal
            </button>
          </div>
        </>
      ) : (
        <div
          /*
           * `role="status"` and a focus move, both of which were missing.
           *
           * The revealed state replaces the "Reveal" button in the DOM, so a
           * reader who activated it with the keyboard had focus on an element
           * that no longer exists: focus fell back to `<body>`, so the next Tab
           * restarted from the top of the document and a screen reader said
           * nothing at all about the answer they had just asked for. The
           * result is now a live region and takes focus itself.
           *
           * `tabIndex={-1}` rather than `tabindex="0"`: this is a programmatic
           * focus target, not a control, and it should not become a stop in
           * the reader's own tab order on the way past.
           */
          role="status"
          tabIndex={-1}
          ref={(node) => node?.focus()}
          className="rounded-card border border-border bg-surface p-s-3 text-sm text-fg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <p
            className={`mb-s-1 flex items-center gap-2 font-semibold ${
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
