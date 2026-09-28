import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp } from 'lucide-react'
import type { Tier, ToolId } from '../../../content/lectures'
import { lecturesTeaching } from '../lib/taughtIn'
import { TIER_META } from '../design/tokens'
import { TOOLS } from '../store'
import { useProgress } from '../learning/progress'

/**
 * Four cells, the first `level` filled. This is what communicates difficulty:
 * the four tier hues are one ordinal azure ramp and are near neighbours by
 * design, so colour alone cannot carry the ordering.
 */
export function LevelMeter({ tier }: { tier: Tier }) {
  const { level } = TIER_META[tier]
  return (
    <span className={TIER_META[tier].dot} role="img" aria-label={`Level ${level} of 4`}>
      {[1, 2, 3, 4].map((i) => (
        <i key={i} className="level-cell" />
      ))}
    </span>
  )
}

export function TierBadge({ tier }: { tier: Tier }) {
  const meta = TIER_META[tier]
  return (
    <span className={meta.badge}>
      <LevelMeter tier={tier} />
      {meta.label}
    </span>
  )
}

/**
 * The page's title block. Every route renders one of these, which makes it
 * the cheapest place for the density preference to reach: `mb-*` and `mt-*`
 * here are density steps (`s-*` in `tailwind.config.ts`), while the type,
 * the measure and the gutters are not.
 *
 * The deck carries no `text-base`. `.reading-col` sets the column's own font
 * size, because that size is what `ch` resolves against, and the whole point
 * of the class is that a page header and the prose it introduces end on the
 * same right edge — which is only true if the header asks the same question of
 * `70ch` that the body does. The deck is a paragraph of prose at the prose
 * size. See the `.reading-col` block in `index.css`.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <header className="reading-col mb-s-8">
      {eyebrow && (
        <p className="mb-s-2 text-micro font-bold uppercase tracking-widest text-fg-subtle">
          {eyebrow}
        </p>
      )}
      <h1 className="text-display-md font-bold text-fg">{title}</h1>
      {description && (
        <p className="reading-col mt-s-4 leading-relaxed text-fg-muted">{description}</p>
      )}
      {children && <div className="mt-s-6">{children}</div>}
    </header>
  )
}

/**
 * The route-level loading state: the shape a page is about to have, in the
 * plate's own colour, while its module is in flight.
 *
 * This is `pages/DataExplorer.tsx`'s loading idiom applied to a whole page,
 * and the reason it is that idiom and not a spinner is the same one given
 * there. A shimmer is an animation, and a reader who has asked for a still
 * page (`data-pref-motion="reduced"`) gets one whether or not the animation
 * honours it; a spinner is an animation that is *also* a promise about time,
 * so it either flickers for 120ms on a client-side route change or sits there
 * being wrong for two seconds on a cold deep link. Grey bars in a card are a
 * shape, and a shape is quiet.
 *
 * It reserves the geometry of a `PageHeader` plus one card, which is the
 * common floor under all twelve routes. Reserving 0px and then expanding
 * 400px when the module lands is a page that moves under the reader's eye,
 * which is the complaint `AGENTS.md` records for a chart that animates — the
 * same objection to the same animation, and the same answer.
 *
 * The label is `sr-only` rather than visible text. On a cold deep link — the
 * GitHub Pages case, a reader who followed a shared `/lecture/16` — the wait
 * is a second or two and a sentence explaining it is worth nothing they can
 * read that fast. On a client-side route change the same wait is 120ms, and
 * visible text is a flash of a sentence the reader did not finish. The bars
 * are `aria-hidden` and the status region carries the announcement, so a
 * screen reader hears "Loading page" once and a sighted reader sees the
 * shape, and neither sees the other half.
 *
 * It is deliberately not `animate-pulse`. See the paragraph above.
 */
export function PageSkeleton({ label = 'Loading page' }: { label?: string }) {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">{label}</span>
      <div className="reading-col mb-s-8" aria-hidden="true">
        <div className="h-2.5 w-24 rounded bg-surface-2" />
        <div className="mt-s-4 h-7 w-4/5 rounded bg-surface-2" />
        <div className="mt-s-4 h-2.5 rounded bg-surface-2" />
        <div className="mt-s-2 h-2.5 w-11/12 rounded bg-surface-2" />
      </div>
      <div className="card p-s-5" aria-hidden="true">
        <div className="flex flex-col gap-s-3">
          <div className="h-3 w-2/5 rounded bg-surface-2" />
          <div className="h-2 w-4/5 rounded bg-surface-2" />
          <div className="h-2 w-3/5 rounded bg-surface-2" />
          <div className="h-2 w-11/12 rounded bg-surface-2" />
          <div className="h-2 w-2/3 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  )
}

/**
 * A single number in the course-at-a-glance strip. Rendered as `dt`/`dd` so the
 * strip can be a real `dl`; `order-*` puts the value above the label
 * without inverting the markup.
 *
 * The two lines are ONE figure, and the things that make them read as one are
 * small and were not there before:
 *
 *  - the value is `tabular-nums`, so a row of them is a row of columns and
 *    not a row of guesses about the digit width;
 *  - the label is `fg-muted` rather than `fg-subtle`. Two steps of the same
 *    ramp, 3.5px of extra contrast, and the caption stops being a grey line
 *    that happens to sit under a black number. `fg-subtle` is the right
 *    colour for the *label of a label*; this is the label of the figure.
 *
 * Not a card and not interactive: the strip is a row of figures, and it has
 * no resting fill, no border, and no press state to give. Adding a hover
 * here would be the one thing on the home page that looks clickable and is
 * not — and the three section headers below it already link to the syllabus,
 * the tool index and the case index, which is where a reader who wants to go
 * somewhere from a number is sent.
 */
export function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="flex flex-col">
      <dd className="order-1 text-display-sm font-bold tabular-nums text-fg">{value}</dd>
      <dt className="order-2 mt-s-1 text-micro font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </dt>
    </div>
  )
}

/**
 * The lectures that introduce a tool, as a short "Taught in 5, 7" line.
 *
 * This is the one fact a reader cannot get anywhere else: the tool index
 * says a tool exists, the lecture says which lecture links it, and nothing
 * joined the two. On a grid of twenty it is also the difference between a
 * list and an index — it is what lets someone decide *where in the course* a
 * tool belongs before deciding to open it.
 *
 * Plain text, not a link, because it sits inside a `<Link>`: a nested anchor
 * is invalid HTML and the click would go to the card anyway.
 *
 * The lookup itself is `lecturesTeaching` in `lib/taughtIn.ts`, indexed once
 * for the whole application. Written inline here it was twenty filters over
 * twenty-five lectures on every render of this grid.
 */
export function TaughtIn({ toolId }: { toolId: ToolId }) {
  const lectures = lecturesTeaching(toolId)
  if (lectures.length === 0) return null
  const numbers = lectures.map((lecture) => lecture.n)
  return (
    <p className="mt-s-1 text-micro tabular-nums text-fg-subtle">
      Taught in {numbers.length === 1 ? 'lecture' : 'lectures'}{' '}
      {numbers.length <= 3 ? numbers.join(', ') : `${numbers[0]}–${numbers[numbers.length - 1]}`}
    </p>
  )
}


/**
 * One card in a tool grid. The three vertical margins and the padding are
 * density steps, so a grid of twenty of these is the second biggest thing
 * on the tools index that `compact` moves.
 *
 * `lift` is the whole hover story, and it replaces what used to be here:
 * `transition-shadow hover:shadow-plate`. That pair looked equivalent and was
 * not — `shadow-plate` writes `box-shadow` wholesale, so the moment the
 * pointer arrived the card lost the 1px lit top edge that is the only thing
 * giving it depth in light mode. `lift` changes `--elev-shadow` and lets the
 * surface's own `box-shadow` declaration re-resolve, so the inset survives.
 * See the `.lift` block in `index.css` for the full budget.
 *
 * There is deliberately no `:active` state and no `.tap-clear` on this row.
 * A card navigates the instant it is touched, so a press state would be a
 * state the reader never sees; and because there is no `:active` rule to
 * replace it, the browser's own tap flash is left in place as the press
 * feedback. Suppressing that flash here is the mistake `.tap-clear` exists to
 * prevent.
 *
 * The title is an `h3` because both users of this card sit under an `h2`: an
 * `h2` section on the home page, and the visually-hidden "All tools" section
 * heading on the tools index. The index used to go `h1` straight to `h3`,
 * which is a skipped level; the section heading is what fixed it, so the card
 * itself does not need a level prop.
 */
export function ToolCard({ toolId }: { toolId: ToolId }) {
  const info = TOOLS[toolId]
  if (!info) return null
  const index = (Object.keys(TOOLS) as ToolId[]).indexOf(toolId) + 1
  return (
    <Link
      to={`/tool/${toolId}`}
      className="card lift group flex flex-col p-s-4 no-underline"
    >
      <div className="mb-s-2 flex items-center gap-2">
        <span className="text-micro font-semibold tabular-nums text-fg-subtle">
          {String(index).padStart(2, '0')}
        </span>
        <TierBadge tier={info.category} />
      </div>
      <h3 className="text-base font-semibold text-fg transition-colors group-hover:text-accent-ink">
        {info.title}
      </h3>
      <p className="mt-s-1 line-clamp-3 text-xs leading-relaxed text-fg-muted">{info.description}</p>
      <TaughtIn toolId={toolId} />
      <span className="mt-s-3 inline-flex items-center gap-1 text-xs font-semibold text-fg-muted transition-colors group-hover:text-accent-ink">
        Open tool <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/**
 * "Continue where you left off" — a resume link, and the first thing a
 * returning reader sees.
 *
 * It gets `lift` even though it is flatter than a tool card: it is a
 * `<Link>` the reader is expected to press, and a banner that does not
 * acknowledge the pointer is a banner that reads as a label. The accent
 * tint on the icon and the `border-strong` step on hover were already there;
 * this only adds the depth and the press state.
 */
export function ContinueBanner() {
  const { lastPath, completedLectures } = useProgress()
  if (!lastPath || lastPath === '/') return null
  return (
    <Link
      to={lastPath}
      className="lift mb-s-6 flex items-center gap-3 rounded-card border border-border bg-surface px-4 py-s-3 text-sm no-underline"
    >
      <TrendingUp size={16} className="shrink-0 text-accent" aria-hidden="true" />
      <span className="font-semibold text-fg">Continue where you left off</span>
      <span className="ml-auto text-xs tabular-nums text-fg-subtle">
        {completedLectures.length} lecture{completedLectures.length === 1 ? '' : 's'} complete
      </span>
    </Link>
  )
}
