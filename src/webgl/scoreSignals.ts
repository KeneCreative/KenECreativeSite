/**
 * Non-reactive signal singleton driving the ScoreCanvas.
 * Written by DOM listeners, read once per animation frame. No React involvement.
 */
export const scoreSignals = {
  /** Raw page progress: 0 at the top, 1 scrolled to the bottom. Drives the fade-out. */
  scroll: 0,
  /**
   * How settled the field is: 0 energetic, 1 fully calm. Same as `scroll` unless
   * a route sets a floor (the Book page starts partway settled).
   */
  calm: 0,
  /** Pointer position, normalised. y measured from the top. */
  pointerX: 0.5,
  pointerY: 0.35,
  /** Smoothed pointer speed, ~0 at rest, climbs toward ~1 on fast moves. */
  pointerVel: 0,
  /** Overall alpha multiplier. 1 normally; a reading route can knock it down. */
  dim: 1,
}

let lastX = 0
let lastY = 0
let lastT = 0
let hasPointer = false
let calmFloor = 0

function onScroll() {
  // Progress through the whole page: 0 at the top, 1 scrolled to the bottom.
  const span = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const raw = Math.min(1, Math.max(0, window.scrollY / span))
  scoreSignals.scroll = raw
  scoreSignals.calm = calmFloor + (1 - calmFloor) * raw
}

/**
 * Route-level floor for how settled the field starts. 0 everywhere except pages
 * that want a calm field from the top (Book). Re-maps immediately.
 */
export function setCalmFloor(v: number) {
  calmFloor = Math.min(1, Math.max(0, v))
  // a route that starts settled also starts a good bit dimmer
  scoreSignals.dim = calmFloor > 0 ? 0.35 : 1
  onScroll()
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
