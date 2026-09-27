/**
 * Axis domains that contain their data.
 *
 * A pinned `domain` plus `allowDataOverflow` is a promise the chart cannot
 * keep. `allowDataOverflow` does not extend the axis; it tells Recharts to
 * generate ticks only inside the domain, and a series that leaves the range
 * is drawn past the plot edge and clipped by the SVG. Nothing on the screen
 * says so: the reader sees a curve that stops, and a curve that stops in
 * the same place at every setting looks like a fact about the model rather
 * than a fact about the axis.
 *
 * So a domain that has to contain data is computed from the data. Two
 * properties matter and are the reason this is not a one-liner:
 *
 *  - It snaps to ROUND numbers, because the alternative — handing Recharts
 *    `[min, max]` raw — produces tick labels like `413.27`, and a tick label
 *    is a thing a reader compares against the number in the tooltip.
 *  - It rounds OUTWARD. `floor` on the low end and `ceil` on the high end,
 *    so the round numbers bracket the data rather than clipping it, which
 *    is the defect being replaced.
 *
 * What this deliberately does not do is pin the domain, and that is worth
 * being explicit about because pinning is the usual instinct: a domain that
 * holds still is a domain a reader can learn. The trade is that a
 * zoom-to-fit domain MOVES when the data moves, so on a chart the reader
 * drags, the plot box slides under a stationary curve. For a single series
 * that is the honest picture — the data's extent really did change — and
 * the alternative, a fixed window the curve escapes, is the bug. For a
 * chart whose whole point is a COMPARISON between two series, the domain
 * should stay pinned so the two stay comparable, and a series that can leave
 * it should be reported rather than silently fitted.
 */

/**
 * A 1 / 2 / 2.5 / 5 x 10^n step at or above `raw`.
 *
 * The 2.5 is not in the textbook ladder and it is here for a specific
 * failure: without it, a span of 109 asks for a step of 21.8, normalises to
 * 2.18, and jumps the ladder's 2-to-5 gap all the way to 50 — a domain of
 * `[100, 250]` for data that lives in `[101, 209]`, with more than half the
 * plot empty. 25 gives `[100, 225]`, and 25 is as countable as 50.
 */
export function niceStep(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(raw))
  const normalised = raw / magnitude
  const multiple =
    normalised <= 1 ? 1 : normalised <= 2 ? 2 : normalised <= 2.5 ? 2.5 : normalised <= 5 ? 5 : 10
  return multiple * magnitude
}

/** Round a raw span up to a step a reader can count by. */
function stepFor(span: number, targetTicks: number): number {
  return niceStep(span / targetTicks)
}

/**
 * The smallest span that shows `targetTicks` labels without them crowding.
 * Fewer ticks is better than smaller numbers: a 1/2/5/10 sequence at a
 * coarser step is legible, and the same sequence at a finer step prints
 * `0.5 / 0.75 / 1.0` on a chart whose reader is thinking in years and
 * percentages.
 */
function chooseStep(span: number, targetTicks: number): number {
  const fine = stepFor(span, targetTicks)
  // A step that renders more than three characters at a plausible label
  // width is the point at which the labels start fighting for room.
  if (Math.abs(fine) < 0.01) return niceStep(span / (targetTicks * 2))
  return fine
}

export interface DomainOptions {
  /** Extend the low end to zero, for a quantity where zero is a real value
   * rather than an arbitrary floor — output, a level, a count. */
  includeZero?: boolean
  /** How many gridlines the reader should see. */
  ticks?: number
  /**
   * Pad outward by a fraction of the span, so a line does not touch the
   * plot edge.
   *
   * A default of 0.04, and the reason it is not 0: a series whose maximum
   * lands exactly on a snapped boundary puts the line ON the frame, and a
   * line on the frame is indistinguishable from a line that has been
   * clipped there — which is the exact ambiguity this whole module exists
   * to remove. Four per cent of a 1,200-wide axis is 48 units, or under one
   * gridline step, so it costs no tick and removes the ambiguity.
   *
   * A side pinned to zero by `includeZero` is never padded past zero, since
   * "zero is a real value here" is precisely why it was pinned.
   */
  pad?: number
}

/**
 * A round `[low, high]` that contains every finite value in `values`.
 *
 * `values` is flattened on purpose: a caller passes every series it is about
 * to plot, because a domain derived from one of two series is the same class
 * of defect as a pinned one — the other series leaves the frame and the
 * reader does not know it.
 */
export function dataDomain(
  values: ReadonlyArray<number | ReadonlyArray<number>>,
  { includeZero = false, ticks: targetTicks = 5, pad = 0.04 }: DomainOptions = {},
): [number, number] {
  const flat: number[] = []
  for (const entry of values) {
    if (typeof entry === 'number') {
      if (Number.isFinite(entry)) flat.push(entry)
    } else {
      for (const value of entry) if (Number.isFinite(value)) flat.push(value)
    }
  }

  if (flat.length === 0) return [0, 1]

  let low = Math.min(...flat)
  let high = Math.max(...flat)
  if (includeZero) {
    low = Math.min(0, low)
    high = Math.max(0, high)
  }
  if (low === high) {
    // A flat series: give it a window rather than a zero-height domain,
    // which Recharts renders as an empty plot.
    const margin = Math.abs(low) > 0 ? Math.abs(low) * 0.1 : 1
    return [low - margin, high + margin]
  }
  if (pad > 0) {
    const margin = (high - low) * pad
    if (!(includeZero && low === 0)) low -= margin
    if (!(includeZero && high === 0)) high += margin
  }

  const step = chooseStep(high - low, targetTicks)
  const snappedLow = Math.floor(low / step) * step
  const snappedHigh = Math.ceil(high / step) * step
  // `ceil` of a value a hair above a step boundary can land on a step the
  // axis then refuses to draw (a 0 span after snapping), so one more step
  // is added in that case rather than a clamp.
  return snappedHigh > snappedLow
    ? [round(snappedLow, step), round(snappedHigh, step)]
    : [round(snappedLow, step), round(snappedLow + step, step)]
}

/**
 * Snap a snapped bound back off the floating-point dust that
 * `Math.floor(x / 0.1) * 0.1` leaves behind, so a tick label reads `4.2` and
 * not `4.199999999999999`.
 */
function round(value: number, step: number): number {
  const decimals = Math.min(12, Math.max(0, Math.ceil(-Math.log10(step)) + 1))
  return Number(value.toFixed(decimals))
}
