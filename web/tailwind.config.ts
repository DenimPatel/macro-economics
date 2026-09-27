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
        // The modal veil. Alpha is baked into a second var because the `-ch`
        // form only carries three channels, so `bg-scrim/40` is not available
        // here — pick the alpha by changing `--c-scrim-a` in index.css.
        scrim: 'rgb(var(--c-scrim-ch) / var(--c-scrim-a))',
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
        //
        // Every entry is `rem` or `em`, never `px`, and the line heights are
        // unitless. That is the whole mechanism behind the reader's text-size
        // preference: `--pref-text-scale` multiplies the root font size, and a
        // `rem` moves with it. A single `px` in this table would leave one
        // label or tile at its old size while everything around it grew, which
        // reads as a rendering fault rather than a preference. A unitless line
        // height does the same job for `--pref-line-height`: it is a ratio, so
        // it survives the type growing underneath it.
        micro: ['0.6875rem', { lineHeight: '1.4', letterSpacing: '0.06em' }],
        'label-sm': ['0.8125rem', { lineHeight: '1.45' }],
        prose: ['1.0625rem', { lineHeight: '1.75' }],
        'display-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'display-md': ['2.125rem', { lineHeight: '1.12', letterSpacing: '-0.028em' }],
        'display-lg': ['3rem', { lineHeight: '1.06', letterSpacing: '-0.032em' }],
      },
      borderRadius: {
        // One definition, two consumers: the values live in `:root` in
        // index.css and the tokens read them, so `rounded-card` in TSX and
        // `.card` in the stylesheet cannot drift. They are NOT density
        // steps — a corner is a shape, and a shape that changes with a
        // spacing preference reads as a rendering fault.
        //
        // `rounded-lg` (0.5rem / 8px) and `rounded-xl` (0.75rem / 12px) are
        // the same two values as `control` and `plate`; prefer the named
        // token so the corner of a card, a control and a plate are visibly
        // one vocabulary rather than three utilities that happen to match.
        control: 'var(--radius-control)',
        card: 'var(--radius-card)',
        plate: 'var(--radius-plate)',
        pill: 'var(--radius-pill)',
      },
      spacing: {
        // The density-aware half of the spacing scale, as a separate
        // namespace from Tailwind's own `spacing` scale.
        //
        // This is deliberately NOT a redefinition of `1`..`12`.
        // `theme.spacing` also backs `w-*` and `h-*`, so redefining `4`
        // would turn `h-4 w-4` — a 16px checkbox, and in the settings panel
        // a hit area — into `calc(1rem * var(--pref-space))`. Sizes have to
        // stay literal; only spacing moves. Hence `s-1`, `p-s-4`,
        // `gap-s-2`: a class you can see is density-bound and a class you
        // cannot is structural.
        //
        // At the default `--pref-space: 1` every one of these is the
        // Tailwind value it replaces, pixel for pixel, so converting a
        // class is a no-op at the default and a real saving at `compact`.
        's-hair': 'var(--space-hair)',
        's-tight': 'var(--space-tight)',
        's-1': 'var(--space-1)',
        's-2': 'var(--space-2)',
        's-3': 'var(--space-3)',
        's-4': 'var(--space-4)',
        's-5': 'var(--space-5)',
        's-6': 'var(--space-6)',
        's-8': 'var(--space-8)',
        's-10': 'var(--space-10)',
        's-inset': 'var(--space-inset)',
        's-12': 'var(--space-12)',
      },
      maxWidth: {
        // Reads the reader's measure preference rather than repeating the
        // number, so a change to the preference cannot leave this token
        // describing a width the site no longer uses. `max-w-prose` is
        // currently unreferenced — the reading columns use the `.reading-col`
        // class in `index.css`, which sits next to the prose rules it belongs
        // with — but a token that hard-coded 70ch would be a trap.
        prose: 'var(--pref-measure, 70ch)',
      },
      transitionDuration: {
        // The DEFAULT is the important one, and the reason this extension
        // exists at all. Tailwind's `transition-colors` — used in eighteen
        // places across the shell, the pages and four tools — is a
        // `transitionProperty` utility, and `transitionProperty` hard-codes its
        // own duration from `transitionDuration.DEFAULT` rather than letting it
        // float. Found in the browser, not in the source: with the tokens
        // defined and `transition-colors` in use, the computed duration was
        // still a literal `0.15s` and still ignored `--pref-motion-scale`. A
        // reader who set `motion: 'reduced'` got eighteen controls that still
        // eased. It is the same value Tailwind shipped, so nothing moves
        // differently; it is just now derived from `--dur-base` like
        // everything else.
        DEFAULT: 'var(--dur-base)',
        fast: 'var(--dur-fast)',
        base: 'var(--dur-base)',
        slow: 'var(--dur-slow)',
      },
      boxShadow: {
        // Live in index.css so the dark theme can re-derive them.
        //
        // Every value is written in the COMPOSING form — `<step>,
        // var(--elev-inset, 0 0 0 0)` — rather than as a bare step, and that
        // is the whole reason this table changed. A bare `var(--elev-2)`
        // writes `box-shadow` wholesale, so `hover:shadow-plate` on a
        // `.card` replaced `var(--elev-1), inset 0 1px 0 ...` with one
        // layer and the card visibly LOST its lit top edge for as long as
        // the pointer was over it. Reading the inset out of the same custom
        // property the surface already set means a utility can no longer drop
        // it, and `.lift` in index.css — the canonical hover-elevation
        // mechanism — uses the identical form.
        //
        // The `0 0 0 0` fallback is what keeps a shadow utility usable on an
        // element that never declared an inset: `0 0 0 0` with the surface's
        // own colour as nothing is a fully transparent shadow, so it draws
        // nothing rather than being an invalid list.
        elev1: 'var(--elev-1), var(--elev-inset, 0 0 0 0)',
        elev2: 'var(--elev-2), var(--elev-inset, 0 0 0 0)',
        elev3: 'var(--elev-3), var(--elev-inset, 0 0 0 0)',
        elev4: 'var(--elev-4), var(--elev-inset, 0 0 0 0)',
        card: 'var(--elev-1), var(--elev-inset, 0 0 0 0)',
        plate: 'var(--elev-2), var(--elev-inset, 0 0 0 0)',
        pop: 'var(--elev-3), var(--elev-inset, 0 0 0 0)',
      },
    },
  },
  plugins: [],
}
