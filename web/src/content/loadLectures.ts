/**
 * Loads lecture Markdown from `content/lecture_notes/` at build time. The
 * notes are the source of truth; nothing here duplicates them. Bodies are
 * lazy-loaded per lecture so the initial bundle stays small.
 */
import { useEffect, useState } from 'react'

type Loader = () => Promise<string>

const rawModules = import.meta.glob('../../../content/lecture_notes/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, Loader>

const lectureLoaders = new Map<number, Loader>()
for (const [path, loader] of Object.entries(rawModules)) {
  const match = /Lecture_(\d+)\.md$/.exec(path)
  if (match) lectureLoaders.set(Number(match[1]), loader)
}

/** Remove the leading `# Lecture N: Title` heading; the page renders its own. */
function stripTitle(markdown: string): string {
  return markdown.replace(/^\s*#\s+Lecture\s+\d+:.*(\r?\n)?/i, '')
}

export function hasLectureBody(n: number): boolean {
  return lectureLoaders.has(n)
}

export async function loadLectureBody(n: number): Promise<string> {
  const loader = lectureLoaders.get(n)
  if (!loader) return ''
  return stripTitle(await loader())
}

export interface LectureBodyState {
  markdown: string | null
  loading: boolean
  error: string | null
}

export function useLectureBody(n: number | undefined): LectureBodyState {
  const [state, setState] = useState<LectureBodyState>({
    markdown: null,
    loading: n != null,
    error: null,
  })

  useEffect(() => {
    if (n == null) {
      setState({ markdown: null, loading: false, error: null })
      return
    }
    let cancelled = false
    setState({ markdown: null, loading: true, error: null })
    loadLectureBody(n)
      .then((markdown) => {
        if (!cancelled) setState({ markdown, loading: false, error: null })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            markdown: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Could not load lecture',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [n])

  return state
}

export function lectureNumberFromPath(path: string): number | undefined {
  const match = /Lecture_(\d+)\.md$/.exec(path)
  return match ? Number(match[1]) : undefined
}
