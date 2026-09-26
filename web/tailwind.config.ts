/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--c-bg)',
        surface: 'var(--c-surface)',
        'surface-2': 'var(--c-surface-2)',
        border: 'var(--c-border)',
        fg: 'var(--c-fg)',
        'fg-muted': 'var(--c-fg-muted)',
        'fg-subtle': 'var(--c-fg-subtle)',
        accent: 'var(--c-accent)',
        'accent-fg': 'var(--c-accent-fg)',
        'tier-beginner': 'var(--c-tier-beginner)',
        'tier-intermediate': 'var(--c-tier-intermediate)',
        'tier-advanced': 'var(--c-tier-advanced)',
        'tier-case': 'var(--c-tier-case)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        serif: ['Iowan Old Style', 'Palatino', 'Georgia', 'Times New Roman', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: {
        prose: '72ch',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
