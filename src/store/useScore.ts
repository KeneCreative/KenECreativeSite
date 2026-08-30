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
  /**
   * Keep the field animating even under `prefers-reduced-motion` (the home
   * route sets this — a dead hero reads worse than a slow drift to a first-time
   * visitor on a phone with the OS setting on).
   */
  forceMotion: boolean
  setForceMotion: (v: boolean) => void
}

export const useScore = create<ScoreState>((set) => ({
  paused: false,
  setPaused: (v) => set((s) => (s.paused === v ? s : { paused: v })),
  forceMotion: false,
  setForceMotion: (v) => set((s) => (s.forceMotion === v ? s : { forceMotion: v })),
}))
