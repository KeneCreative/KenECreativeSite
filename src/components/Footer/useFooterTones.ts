import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Web Audio note tones on footer-note hover/focus — carried from legacy.
 * AudioContext is created lazily on the first user gesture and closed on unmount.
 */
export function useFooterTones() {
  const [soundOn, setSoundOn] = useState(true)
  const ctxRef = useRef<AudioContext | null>(null)

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctxRef.current = new Ctor()
    }
    if (ctxRef.current.state === 'suspended') void ctxRef.current.resume()
    return ctxRef.current
  }, [])

  // Unlock audio on the first interaction anywhere.
  useEffect(() => {
    const unlock = () => ensureCtx()
    const opts = { once: true } as const
    window.addEventListener('pointerdown', unlock, opts)
    window.addEventListener('keydown', unlock, opts)
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [ensureCtx])

  // Close the context on unmount.
  useEffect(() => {
    return () => {
      void ctxRef.current?.close()
      ctxRef.current = null
    }
  }, [])

  const playTone = useCallback(
    (freq: number) => {
      if (!soundOn) return
      const ctx = ensureCtx()
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq
      const t = ctx.currentTime
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(t + 0.36)
    },
    [soundOn, ensureCtx],
  )

  const toggleSound = useCallback(() => {
    setSoundOn((v) => !v)
    ensureCtx()
  }, [ensureCtx])

  return { soundOn, toggleSound, playTone }
}
