import { beforeEach, describe, expect, it, vi } from 'vitest'

async function freshProgress() {
  vi.resetModules()
  window.localStorage.clear()
  return import('../learning/progress')
}

describe('progress store', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('marks lectures complete and persists them', async () => {
    const progress = await freshProgress()
    progress.markLectureComplete(3)
    progress.markLectureComplete(1)
    expect(progress.getProgress().completedLectures).toEqual([1, 3])
    expect(window.localStorage.getItem('macro-progress')).toContain('"completedLectures":[1,3]')
  })

  it('toggles completion off', async () => {
    const progress = await freshProgress()
    progress.toggleLectureComplete(5)
    expect(progress.getProgress().completedLectures).toContain(5)
    progress.toggleLectureComplete(5)
    expect(progress.getProgress().completedLectures).not.toContain(5)
  })

  it('records quiz scores', async () => {
    const progress = await freshProgress()
    progress.recordQuizScore('lecture-1', 1, 2)
    expect(progress.getProgress().quizScores['lecture-1']).toEqual({ correct: 1, total: 2 })
  })

  it('notifies subscribers', async () => {
    const progress = await freshProgress()
    const listener = vi.fn()
    progress.subscribeProgress(listener)
    progress.markLectureComplete(2)
    expect(listener).toHaveBeenCalledTimes(1)
  })
})
