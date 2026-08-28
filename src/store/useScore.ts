import { create } from 'zustand'

/**
 * Discrete state only. Continuous values (scroll progress, pointer velocity)
 * live in the non-reactive singleton in webgl/scoreSignals.ts and never
 * trigger a React render.
 */
type ScoreState = {
  /** The heavy route parks the canvas RAF loop. */
  paused: boolean
  setPaused: (v: boolean) => void
}

export const useScore = create<ScoreState>((set) => ({
  paused: false,
  setPaused: (v) => set((s) => (s.paused === v ? s : { paused: v })),
}))
