/**
 * The hero figure: an IS-LM equilibrium. Two axes, a grid, the goods-market
 * curve falling, the money-market curve rising, and their intersection marked
 * in the accent.
 *
 * It is the thesis of the course in a single diagram, and it is inline SVG for
 * the same reason as `BrandMark` — it inherits the theme tokens, so it inverts
 * with the site and ships no asset.
 *
 * Four implementation notes worth keeping:
 *
 *  - Every colour goes through a `style` prop, not a presentation attribute.
 *    `fill="var(--c-accent)"` is silently invalid: presentation attributes are
 *    parsed as SVG attribute values, where `var()` is not a value. Only a CSS
 *    declaration resolves custom properties, so the attribute version renders
 *    black.
 *  - The grid strokes are `--c-grid`, the same token the Recharts plots draw
 *    their grid with (`design/chartTheme.ts`). They used to be `--c-border`,
 *    which made the hero's grid a full contrast step stronger than every real
 *    plot's: the one diagram on the page that is not data was the loudest
 *    grid in the building.
 *  - Both curves are cubic Béziers whose control points share the same x, so
 *    at t=0.5 they land on the same point, (171, 123). That is where the
 *    equilibrium marker goes, and it stays on the curves if they are retuned.
 *    Nothing here may move a control point without moving the marker.
 *  - The label sizes multiply `--pref-text-scale`. A `viewBox` is in USER
 *    UNITS, so the diagram's geometry scales with the width of the card and
 *    with nothing else: at 130% text the surrounding prose grew 30% and the
 *    labels stayed exactly where they were, which is how a figure ends up
 *    looking like a thumbnail of itself. Multiplying the label size by the
 *    same root multiplier restores the relationship, and it is safe to do
 *    because the labels are anchored, not centred in a box: every one of them
 *    has a baseline or an end anchor, so at 130% they grow up, left or right
 *    into empty plot rather than into the curves, the axes or each other.
 */
const GRID = { stroke: 'var(--c-grid)', strokeWidth: 1, fill: 'none' } as const
const AXIS = {
  stroke: 'var(--c-fg-subtle)',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  // Required: SVG's default `fill` is black, and an open multi-segment path is
  // implicitly closed for filling, which paints a large wedge.
  fill: 'none',
} as const
const CURVE = { strokeWidth: 2.25, strokeLinecap: 'round', fill: 'none' } as const
const GUIDE = { stroke: 'var(--c-accent)', strokeWidth: 1, strokeDasharray: '3 4', fill: 'none' } as const

/**
 * `px` in an SVG CSS declaration is a user unit, which is the point: this is
 * the 11 the file has always used, now expressed as a function of the
 * reader's text size.
 */
const LABEL = {
  fontFamily: 'inherit',
  fontSize: 'calc(11px * var(--pref-text-scale, 1))',
  fontWeight: 600,
} as const

const AXIS_LABEL = {
  fontFamily: 'inherit',
  fontSize: 'calc(10.5px * var(--pref-text-scale, 1))',
  fill: 'var(--c-fg-subtle)',
} as const

export default function HeroFigure() {
  return (
    <figure className="m-0">
      {/* The caption is the figure's description, so the SVG itself carries no
          accessible name. A visible caption that fully says what the picture
          means, PLUS a label on the image, is the same sentence read twice —
          and this caption has to be complete enough to stand on its own
          anyway, because it is the only description a sighted reader gets. So
          the drawing is hidden from assistive technology and the sentence is
          the content. With the caption absent this would need a label; they
          ship together. */}
      <svg viewBox="0 0 320 236" className="h-auto w-full" aria-hidden="true" focusable="false">
        <g style={GRID}>
          <path d="M44 60h256" />
          <path d="M44 95h256" />
          <path d="M44 130h256" />
          <path d="M44 165h256" />
          <path d="M82 26v178" />
          <path d="M120 26v178" />
          <path d="M158 26v178" />
          <path d="M196 26v178" />
          <path d="M234 26v178" />
          <path d="M272 26v178" />
        </g>

        <path d="M44 26v178h256" style={AXIS} />

        {/* IS: goods market, downward sloping */}
        <path d="M52 58C130 96 210 150 296 186" style={{ ...CURVE, stroke: 'var(--c-fg)' }} />

        {/* LM: money market, upward sloping */}
        <path d="M52 182C130 156 210 96 296 52" style={{ ...CURVE, stroke: 'var(--c-accent)' }} />

        {/* equilibrium, on both curves */}
        <circle cx="171" cy="123" r="10" style={{ fill: 'var(--c-accent)', fillOpacity: 0.15 }} />
        <path d="M171 123h129" style={GUIDE} />
        <path d="M171 123v81" style={GUIDE} />
        <circle cx="171" cy="123" r="3.5" style={{ fill: 'var(--c-accent)' }} />

        <g style={LABEL}>
          <text x="54" y="50" style={{ fill: 'var(--c-fg-muted)' }}>
            IS
          </text>
          <text x="296" y="46" textAnchor="end" style={{ fill: 'var(--c-accent)' }}>
            LM
          </text>
          <text x="171" y="112" textAnchor="middle" style={{ fill: 'var(--c-accent)' }}>
            Y*, r*
          </text>
        </g>

        <g style={AXIS_LABEL}>
          <text x="300" y="222" textAnchor="end">
            Output (Y)
          </text>
          <text x="36" y="30" textAnchor="end" transform="rotate(-90 36 30)">
            Interest rate (r)
          </text>
        </g>
      </svg>

      {/*
        The caption, and why it is visible and complete. An `aria-label` alone
        gives a screen reader one flat sentence and a sighted reader nothing at
        all, and this diagram is the only place on the site that says what the
        course is about before a word has been read. So the sentence is
        visible, under a hairline, and it names the axes and the marker as well
        as the shape — the two curves' meaning is not a caption's job to skip.
      */}
      <figcaption className="mt-s-4 border-t border-border pt-s-3 text-xs leading-relaxed text-fg-muted">
        The IS–LM equilibrium: output (Y) against the interest rate (r), with the goods-market
        curve falling, the money-market curve rising, and the point where the two cross — Y* and r*
        — marking the economy's equilibrium.
      </figcaption>
    </figure>
  )
}
