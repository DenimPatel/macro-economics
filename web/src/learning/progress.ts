/**
 * Lightweight progress store persisted in localStorage. No backend: progress
 * is per-device and resumable.
 */
import { useEffect, useState } from 'react'

const STORAGE_KEY = 'macro-progress'

export interface ProgressState {
  completedLectures: number[]
  quizScores: Record<string, { correct: number; total: number }>
  lastPath?: string
}

const empty: ProgressState = { completedLectures: [], quizScores: {} }

function load(): ProgressState {
  if (typeof window === 'undefined') return empty
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return empty
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return {
      completedLectures: Array.isArray(parsed.completedLectures) ? parsed.completedLectures : [],
      quizScores: parsed.quizScores ?? {},
      lastPath: parsed.lastPath,
    }
  } catch {
    return empty
  }
}

let state: ProgressState = load()
const listeners = new Set<() => void>()

function persist(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore */
  }
}

function emit(): void {
  listeners.forEach((listener) => listener())
}

export function getProgress(): ProgressState {
  return state
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function markLectureComplete(n: number): void {
  if (state.completedLectures.includes(n)) return
  state = { ...state, completedLectures: [...state.completedLectures, n].sort((a, b) => a - b) }
  persist()
  emit()
}

export function toggleLectureComplete(n: number): void {
  const done = state.completedLectures.includes(n)
  state = {
    ...state,
    completedLectures: done
      ? state.completedLectures.filter((x) => x !== n)
      : [...state.completedLectures, n].sort((a, b) => a - b),
  }
  persist()
  emit()
}

export function recordQuizScore(lectureKey: string, correct: number, total: number): void {
  state = { ...state, quizScores: { ...state.quizScores, [lectureKey]: { correct, total } } }
  persist()
  emit()
}

export function recordVisit(path: string): void {
  state = { ...state, lastPath: path }
  persist()
  emit()
}

export function useProgress(): ProgressState {
  const [snapshot, setSnapshot] = useState<ProgressState>(getProgress)
  useEffect(() => subscribeProgress(() => setSnapshot(getProgress())), [])
  return snapshot
}
