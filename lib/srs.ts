export interface SrsState {
  repetitions: number
  intervalDays: number
  easeFactor: number
}

export interface SrsResult extends SrsState {
  dueAt: Date
}

const MIN_EASE = 1.3
const AGAIN_MINUTES = 10
const DAY_MS = 86_400_000

export function schedule(state: SrsState, remembered: boolean): SrsResult {
  const quality = remembered ? 4 : 2
  const gap = 5 - quality

  const easeFactor = Math.max(
    MIN_EASE,
    state.easeFactor + (0.1 - gap * (0.08 + gap * 0.02)),
  )

  if (!remembered) {
    return {
      repetitions: 0,
      intervalDays: 0,
      easeFactor,
      dueAt: new Date(Date.now() + AGAIN_MINUTES * 60_000),
    }
  }

  const repetitions = state.repetitions + 1
  const intervalDays =
    repetitions === 1
      ? 1
      : repetitions === 2
        ? 6
        : Math.round(state.intervalDays * easeFactor)

  return {
    repetitions,
    intervalDays,
    easeFactor,
    dueAt: new Date(Date.now() + intervalDays * DAY_MS),
  }
}
