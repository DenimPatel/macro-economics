/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // These resolve through the `-ch` channel vars so that Tailwind's
        // opacity modifier works: `bg-accent/10` compiles to
        // `rgb(var(--c-accent-ch) / 0.1)`. Pointing at the plain `-c-` vars
        // instead makes every `/NN` utility silently emit nothing.
        bg: 'rgb(var(--c-bg-ch) / <alpha-value>)',
        surface: 'rgb(var(--c-surface-ch) / <alpha-value>)',
        raised: 'rgb(var(--c-surface-raised-ch) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2-ch) / <alpha-value>)',
        border: 'rgb(var(--c-border-ch) / <alpha-value>)',
        'border-strong': 'rgb(var(--c-border-strong-ch) / <alpha-value>)',
        fg: 'rgb(var(--c-fg-ch) / <alpha-value>)',
        'fg-muted': 'rgb(var(--c-fg-muted-ch) / <alpha-value>)',
        'fg-subtle': 'rgb(var(--c-fg-subtle-ch) / <alpha-value>)',
        accent: 'rgb(var(--c-accent-ch) / <alpha-value>)',
        'accent-ink': 'rgb(var(--c-accent-ink-ch) / <alpha-value>)',
        'accent-fg': 'rgb(var(--c-accent-fg-ch) / <alpha-value>)',
        'tier-beginner': 'rgb(var(--c-tier-beginner-ch) / <alpha-value>)',
        'tier-intermediate': 'rgb(var(--c-tier-intermediate-ch) / <alpha-value>)',
        'tier-advanced': 'rgb(var(--c-tier-advanced-ch) / <alpha-value>)',
        'tier-case': 'rgb(var(--c-tier-case-ch) / <alpha-value>)',
        'tier-beginner-ink': 'rgb(var(--c-tier-beginner-ink-ch) / <alpha-value>)',
        'tier-intermediate-ink': 'rgb(var(--c-tier-intermediate-ink-ch) / <alpha-value>)',
        'tier-advanced-ink': 'rgb(var(--c-tier-advanced-ink-ch) / <alpha-value>)',
        'tier-case-ink': 'rgb(var(--c-tier-case-ink-ch) / <alpha-value>)',
        // Status semantics. Distinct from the tier ramp, which is ordinal:
        // these mean correct / wrong / caution and nothing else.
        ok: 'rgb(var(--c-ok-ch) / <alpha-value>)',
        'ok-ink': 'rgb(var(--c-ok-ink-ch) / <alpha-value>)',
        warn: 'rgb(var(--c-warn-ch) / <alpha-value>)',
        'warn-ink': 'rgb(var(--c-warn-ink-ch) / <alpha-value>)',
        bad: 'rgb(var(--c-bad-ch) / <alpha-value>)',
        'bad-ink': 'rgb(var(--c-bad-ink-ch) / <alpha-value>)',
      },
      fontFamily: {
        // One family, deliberately. A second display face is what made this
        // read as a warm reading nook; Inter carries prose, chrome, and
        // numbers without a size or weight jump at the seams.
        sans: [
          'Inter Variable',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // `micro` is the uppercase label size used by eyebrows, section rules,
        // and tier micro-labels.
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        'label-sm': ['0.8125rem', { lineHeight: '1.45' }],
        prose: ['1.0625rem', { lineHeight: '1.75' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.125rem', { lineHeight: '1.12', letterSpacing: '-0.028em' }],
        'display-lg': ['3rem', { lineHeight: '1.06', letterSpacing: '-0.032em' }],
      },
      borderRadius: {
        card: '10px',
        plate: '12px',
        pill: '999px',
      },
      maxWidth: {
        prose: '70ch',
      },
      boxShadow: {
        // Live in index.css so the dark theme can re-derive them.
        card: 'var(--shadow-card)',
        plate: 'var(--shadow-plate)',
        pop: 'var(--shadow-pop)',
      },
    },
  },
  plugins: [],
}
