/**
 * The hero figure: an IS-LM equilibrium. Two axes, a grid, the goods-market
 * curve falling, the money-market curve rising, and their intersection marked
 * in the accent.
 *
 * It is the thesis of the course in a single diagram, and it is inline SVG for
 * the same reason as `BrandMark` — it inherits the theme tokens, so it inverts
 * with the site and ships no asset.
 *
 * Two implementation notes worth keeping:
 *
 *  - Every colour goes through a `style` prop, not a presentation attribute.
 *    `fill="var(--c-accent)"` is silently invalid: presentation attributes are
 *    parsed as SVG attribute values, where `var()` is not a value. Only a CSS
 *    declaration resolves custom properties, so the attribute version renders
 *    black.
 *  - Both curves are cubic Béziers whose control points share the same x, so
 *    at t=0.5 they land on the same point, (171, 123). That is where the
 *    equilibrium marker goes, and it stays on the curves if they are retuned.
 */
const GRID = { stroke: 'var(--c-border)', strokeWidth: 1, fill: 'none' } as const
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

export default function HeroFigure() {
  return (
    <svg
      viewBox="0 0 320 236"
      className="h-auto w-full"
      role="img"
      aria-label="An IS curve and an LM curve crossing at an equilibrium level of output and interest rate"
    >
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

      <g fontFamily="inherit" fontSize="11" fontWeight="600">
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

      <g fontFamily="inherit" fontSize="10.5" style={{ fill: 'var(--c-fg-subtle)' }}>
        <text x="300" y="222" textAnchor="end">
          Output (Y)
        </text>
        <text x="36" y="30" textAnchor="end" transform="rotate(-90 36 30)">
          Interest rate (r)
        </text>
      </g>
    </svg>
  )
}
