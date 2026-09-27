import { createContext, useContext } from 'react'

/**
 * The heading level a TOOL renders its own title at.
 *
 * `ToolHeader` is the page `<h1>` on `/tool/:id`, and that is the whole reason
 * it can be one component. It is also rendered in two places where it is not
 * the page: inside a case study, and inside a lecture's "Try it" section. In
 * both of those the surrounding page already owns an `<h1>`, and `ToolHeader`
 * was producing a second one — a document with two `<h1>`s has no single
 * answer to "what is this page about", which is the question the heading is
 * there to answer.
 *
 * A prop would fix the two call sites and only the two call sites; a context
 * fixes them without a tool file knowing. The twenty tools each call
 * `<ToolHeader title=… description=… badge=… />` and none of them should have
 * to know whether it is being shown on its own page or inside a lecture, so
 * the level arrives from above and the default is the one that is right for
 * the majority of the places a tool appears.
 *
 * The level is the TAG, not a style. The rendered size is `.tool-title` in
 * `index.css`, which is a class and not an element selector, so an embedded
 * tool's title is the same size it has always been and only its place in the
 * outline changes.
 *
 * The context is exported rather than a `<HeadingLevelProvider>` wrapper
 * because a file that exports a component alongside a hook trips
 * `react-refresh/only-export-components`, and the wrapper bought nothing.
 */

/** 1 is the default because a tool on its own route IS the page. */
export const HeadingLevel = createContext<1 | 2 | 3>(1)

/**
 * The tag `ToolHeader` should render. A case study's `<h1>` is followed by
 * the tool directly, so a case study sets 2; a lecture's "Try it" is already
 * an `<h2>`, so a tool inside one sets 3.
 */
export function useHeadingLevel(): 1 | 2 | 3 {
  return useContext(HeadingLevel)
}
