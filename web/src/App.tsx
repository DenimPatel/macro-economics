import { MotionConfig } from 'framer-motion'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/**
 * The app root.
 *
 * `MotionConfig reducedMotion="user"` is the one thing here that is not
 * obvious, and it is here because CSS cannot do it.
 *
 * Every reduced-motion rule in `index.css` works by setting
 * `transition-duration` and `animation-duration` to `0.01ms`. That is
 * complete for CSS transitions and CSS `@keyframes` — and it is *nothing
 * at all* for a library that drives its animations on `requestAnimationFrame`
 * or through the Web Animations API, because neither of those reads a
 * stylesheet duration. framer-motion is exactly that case: an element it
 * animates is handed inline `transform` and `opacity` values every frame,
 * and a `transition-duration: 0.01ms !important` in a universal selector
 * does not touch them. `reducedMotion="user"` is framer-motion's own
 * switch, and it reads the same OS query the stylesheet reads, so both
 * halves of the preference stay in agreement by construction.
 *
 * What this buys today, honestly: nothing renders through framer-motion yet.
 * Recharts series animation is already forced off in
 * `components/ChartPrimitives.tsx`, and there is no `requestAnimationFrame`
 * loop or animating `setInterval` in the app. This is the guarantee for the
 * day something does — the root is where that guarantee has to live, because
 * a per-component `useReducedMotion` is a thing someone can forget and a
 * component nobody thinks to check is exactly the one that starts moving.
 *
 * It costs 0.5kB in the main chunk, measured: `MotionConfig` is a React
 * context provider and the rest of the library tree-shakes away behind it, so
 * there is no runtime to pay for. The alternative is a promise in a comment.
 */
export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
