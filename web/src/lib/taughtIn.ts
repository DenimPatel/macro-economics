/**
 * Which lectures teach which tool, indexed once.
 *
 * The tools index renders twenty cards and each one asked the same question of
 * the same constant: "which lectures mention this tool?". Written as
 * `LECTURES.filter((lecture) => lecture.tools.includes(toolId))` at the point
 * of use, that is twenty filters, each scanning `lecture.tools` across all
 * twenty-five lectures, on every render of the index and again on every
 * keystroke of the index's filter box — 500 array scans to produce twenty short
 * lists. It was also written twice, in `components/ui.tsx` and in
 * `pages/ToolPage.tsx`, which is the shape of a number that will drift.
 *
 * A `Map` rather than an object because the keys are tool ids and a `Map`
 * makes "no lecture teaches this tool" a single `undefined` instead of a
 * prototype-chain question. A tool with no lecture is a legitimate answer, not
 * a missing key, and it returns an empty list.
 *
 * It lives in `lib/` and not in `components/ui.tsx` because it is data, and a
 * non-component export from a module of components costs a fast-refresh
 * boundary in development.
 */
import { LECTURES, type ToolId } from '../../../content/lectures'

export type LectureList = typeof LECTURES

const TAUGHT_IN: Map<ToolId, LectureList> = LECTURES.reduce((byTool, lecture) => {
  for (const toolId of lecture.tools) {
    const existing = byTool.get(toolId)
    if (existing) existing.push(lecture)
    else byTool.set(toolId, [lecture])
  }
  return byTool
}, new Map<ToolId, LectureList>())

/** The lectures that list `toolId`, in course order. Empty if none do. */
export function lecturesTeaching(toolId: ToolId): LectureList {
  return TAUGHT_IN.get(toolId) ?? []
}

/** The lectures that list `toolId`, as their numbers. */
export function lectureNumbersFor(toolId: ToolId): number[] {
  return lecturesTeaching(toolId).map((lecture) => lecture.n)
}
