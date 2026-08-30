import { useEffect, useRef } from 'react'
import { useScore } from '@/store/useScore'
import { link } from './glUtils'
import { VERT, FRAG } from './scoreShaders'
import { scoreSignals, installScoreListeners, decaySignals } from './scoreSignals'
import styles from './ScoreCanvas.module.css'

const MAX_DPR = 1.5

/**
 * Persistent WebGL2 score field. Mounted once by RootLayout, never unmounts.
 * Reads the non-reactive signal singleton; the React coupling is the `paused`
 * flag (heavy route) and `forceMotion` (home route overrides reduced-motion).
 */
export default function ScoreCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return // no WebGL2 — the page still works, just without the field

    let program: WebGLProgram | null = null
    let vao: WebGLVertexArrayObject | null = null
    let buffer: WebGLBuffer | null = null
    let uni: Record<string, WebGLUniformLocation | null> = {}
    let raf = 0
    let running = false
    let dirty = true
    let lastScroll = -1
    const startT = performance.now()

    function buildGl() {
      if (program) return
      program = link(gl!, VERT, FRAG)
      const aPos = gl!.getAttribLocation(program, 'aPos')
      vao = gl!.createVertexArray()
      buffer = gl!.createBuffer()
      gl!.bindVertexArray(vao)
      gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer)
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl!.STATIC_DRAW)
      gl!.enableVertexAttribArray(aPos)
      gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0)
      gl!.bindVertexArray(null)
      gl!.disable(gl!.DEPTH_TEST)
      gl!.enable(gl!.BLEND)
      gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA)
      uni = {
        uRes: gl!.getUniformLocation(program, 'uRes'),
        uTime: gl!.getUniformLocation(program, 'uTime'),
        uScroll: gl!.getUniformLocation(program, 'uScroll'),
        uPointer: gl!.getUniformLocation(program, 'uPointer'),
        uVel: gl!.getUniformLocation(program, 'uVel'),
        uReduced: gl!.getUniformLocation(program, 'uReduced'),
      }
      gl!.clearColor(0, 0, 0, 1)
    }

    function teardownGl() {
      if (program) gl!.deleteProgram(program)
      if (vao) gl!.deleteVertexArray(vao)
      if (buffer) gl!.deleteBuffer(buffer)
      program = null
      vao = null
      buffer = null
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const w = Math.round(window.innerWidth * dpr)
      const h = Math.round(window.innerHeight * dpr)
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
      }
      gl!.viewport(0, 0, w, h)
      dirty = true
    }

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = mq.matches
    const onMq = () => {
      reduced = mq.matches
      dirty = true
    }
    mq.addEventListener('change', onMq)

    function frame() {
      raf = requestAnimationFrame(frame)
      if (!program) return

      // Reduced-motion holds the field still — unless the router has asked for
      // motion on this route (the home hero).
      const hold = reduced && !useScore.getState().forceMotion

      if (hold) {
        if (!dirty && scoreSignals.scroll === lastScroll) return
      } else {
        decaySignals()
      }
      lastScroll = scoreSignals.scroll
      dirty = false

      const t = (performance.now() - startT) / 1000
      gl!.useProgram(program)
      gl!.bindVertexArray(vao)
      gl!.uniform2f(uni.uRes ?? null, canvas!.width, canvas!.height)
      gl!.uniform1f(uni.uTime ?? null, t)
      gl!.uniform1f(uni.uScroll ?? null, scoreSignals.scroll)
      gl!.uniform2f(uni.uPointer ?? null, scoreSignals.pointerX, scoreSignals.pointerY)
      gl!.uniform1f(uni.uVel ?? null, scoreSignals.pointerVel)
      gl!.uniform1f(uni.uReduced ?? null, hold ? 1 : 0)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      gl!.drawArrays(gl!.TRIANGLES, 0, 3)
      gl!.bindVertexArray(null)
    }

    function play() {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    function stop() {
      running = false
      cancelAnimationFrame(raf)
    }
    function shouldRun() {
      return !useScore.getState().paused && document.visibilityState === 'visible'
    }
    function sync() {
      if (shouldRun()) play()
      else stop()
    }

    const onLost = (e: Event) => {
      e.preventDefault()
      stop()
      program = null
      vao = null
      buffer = null
    }
    const onRestored = () => {
      try {
        buildGl()
        resize()
        sync()
      } catch {
        /* leave the field off */
      }
    }
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)

    const onVisibility = () => sync()
    document.addEventListener('visibilitychange', onVisibility)
    const unsub = useScore.subscribe(sync)

    const removeSignals = installScoreListeners()
    window.addEventListener('resize', resize)

    let ok = true
    try {
      buildGl()
      resize()
    } catch (err) {
      ok = false
      console.warn('ScoreCanvas: WebGL setup failed, running without the field.', err)
    }
    if (ok) sync()

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      mq.removeEventListener('change', onMq)
      unsub()
      removeSignals()
      teardownGl()
      // Context itself is left intact — this component never truly unmounts,
      // and StrictMode remounts must not race a lost context.
    }
  }, [])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
