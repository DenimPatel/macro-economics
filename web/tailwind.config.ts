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
      },
      fontFamily: {
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
        serif: ['Literata Variable', 'Literata', 'Iowan Old Style', 'Palatino', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Editorial scale. `micro` is the uppercase small-caps label size used by
        // eyebrows, section rules, and tier micro-labels.
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.04em' }],
        'label-sm': ['0.8125rem', { lineHeight: '1.45' }],
        prose: ['1.0625rem', { lineHeight: '1.7' }],
        'prose-lg': ['1.125rem', { lineHeight: '1.75' }],
        'display-sm': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'display-md': ['2.125rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-lg': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      borderRadius: {
        card: '14px',
        plate: '18px',
        pill: '999px',
      },
      maxWidth: {
        prose: '68ch',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04), 0 1px 3px rgba(28, 25, 23, 0.05)',
        plate: '0 1px 2px rgba(28, 25, 23, 0.04), 0 10px 30px -14px rgba(28, 25, 23, 0.22)',
        pop: '0 8px 24px -6px rgba(28, 25, 23, 0.18), 0 18px 48px -24px rgba(28, 25, 23, 0.3)',
      },
    },
  },
  plugins: [],
}
