/**
 * Non-reactive signal singleton driving the ScoreCanvas.
 * Written by DOM listeners, read once per animation frame. No React involvement.
 */
export const scoreSignals = {
  /** 0 at the top of the page, 1 once the hero transition has fully resolved. */
  scroll: 0,
  /** Pointer position, normalised. y measured from the top. */
  pointerX: 0.5,
  pointerY: 0.35,
  /** Smoothed pointer speed, ~0 at rest, climbs toward ~1 on fast moves. */
  pointerVel: 0,
}

/** Scroll distance (in viewport heights) over which the hero resolves. */
const RESOLVE_VH = 1.35

let lastX = 0
let lastY = 0
let lastT = 0
let hasPointer = false

function onScroll() {
  const span = Math.max(1, window.innerHeight * RESOLVE_VH)
  scoreSignals.scroll = Math.min(1, Math.max(0, window.scrollY / span))
}

function onPointerMove(e: PointerEvent) {
  const now = performance.now()
  const x = e.clientX / window.innerWidth
  const y = e.clientY / window.innerHeight

  if (hasPointer) {
    const dt = Math.max(16, now - lastT)
    const dist = Math.hypot(x - lastX, y - lastY)
    const speed = Math.min(1, (dist / dt) * 900)
    scoreSignals.pointerVel = scoreSignals.pointerVel * 0.7 + speed * 0.3
  }

  scoreSignals.pointerX = x
  scoreSignals.pointerY = y
  lastX = x
  lastY = y
  lastT = now
  hasPointer = true
}

/** Call once. Returns a cleanup that removes every listener. */
export function installScoreListeners(): () => void {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    window.removeEventListener('pointermove', onPointerMove)
    hasPointer = false
  }
}

/** Per-frame decay so the ripple settles when the pointer stops. */
export function decaySignals() {
  scoreSignals.pointerVel *= 0.94
  if (scoreSignals.pointerVel < 0.0005) scoreSignals.pointerVel = 0
}
