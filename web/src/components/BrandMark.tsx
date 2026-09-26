/**
 * The site mark: an IS-LM equilibrium. Two axes, a downward goods-market
 * curve, an upward money-market curve, and the intersection marked in the
 * accent. It is the thesis of the course in 24 pixels, and it is the reason
 * the identity needs no wordmark glyph.
 *
 * Colours go through `style`, not presentation attributes: `stroke="var(--c-fg)"`
 * is silently invalid, because `var()` is a CSS value and presentation
 * attributes are not CSS declarations. The attribute form renders black.
 */
export default function BrandMark({
  size = 22,
  label,
}: {
  size?: number
  /** Omit when adjacent text already names the brand, to avoid a doubled label. */
  label?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* axes */}
      <path
        d="M4 3.5v17h16.5"
        style={{ stroke: 'var(--c-fg-subtle)', strokeWidth: 1.4, strokeLinecap: 'round' }}
      />
      {/* IS: goods market, downward sloping */}
      <path
        d="M6.5 7.5 18 17"
        style={{ stroke: 'var(--c-fg)', strokeWidth: 1.6, strokeLinecap: 'round' }}
      />
      {/* LM: money market, upward sloping */}
      <path
        d="M7 17.5 18 8"
        style={{ stroke: 'var(--c-accent)', strokeWidth: 1.6, strokeLinecap: 'round' }}
      />
      {/* equilibrium */}
      <circle cx="13" cy="13" r="1.9" style={{ fill: 'var(--c-accent)' }} />
    </svg>
  )
}
