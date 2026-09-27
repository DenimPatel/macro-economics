import { useCallback, useMemo, useState } from 'react'

/**
 * The per-chart hidden-series state, and why it is not a preference.
 *
 * "Which series am I looking at" is a property of the reader's attention on
 * one chart. It should not survive a navigation, and two charts on the same
 * page must not be able to hide each other's series, so this is component
 * state and not a line in `lib/preferences.ts`.
 *
 * It lives here rather than beside the legend component because a module
 * that exports a component may not also export a function, and a hook
 * imported by twenty files has no business making a fast-refresh boundary
 * worse.
 */
export interface LegendItem {
  /** The series `dataKey`, or any stable id the tool maps back to it. */
  key: string
  label: string
  /** A `chartColor(i)` value. Inline on the swatch, which is the series
   * colour and therefore the one place an inline colour is the data. */
  color: string
}

export interface HiddenSeries {
  /** The keys currently hidden. */
  hidden: string[]
  isHidden: (key: string) => boolean
  toggle: (key: string) => void
  showAll: () => void
}

export function useHiddenSeries(keys: string[]): HiddenSeries {
  const [hidden, setHidden] = useState<string[]>([])

  const isHidden = useCallback((key: string) => hidden.includes(key), [hidden])

  const toggle = useCallback((key: string) => {
    setHidden((current) =>
      current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key],
    )
  }, [])

  const showAll = useCallback(() => setHidden([]), [])

  // A series can leave a chart while it is mounted — `IS-A` becomes `IS-B`
  // and back when a tool switches scenario — and a key left in the set would
  // then hide whatever took its place. Pruning on every render costs a
  // filter over at most seven strings and makes the state impossible to get
  // wrong in a way a reader would pay for.
  const live = useMemo(() => hidden.filter((key) => keys.includes(key)), [hidden, keys])

  return { hidden: live, isHidden, toggle, showAll }
}
