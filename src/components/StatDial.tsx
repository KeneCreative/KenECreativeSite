import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import s from './StatDial.module.css'

type Props = {
  /** 0-100, or null when the figure is not available yet. */
  value: number | null
  label: string
  sub?: string
  /** Text shown at the centre instead of a percentage (e.g. "1st"). */
  display?: string
}

const R = 52
const C = 2 * Math.PI * R

export default function StatDial({ value, label, sub, display }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(0)

  const target = value ?? 0
  useEffect(() => {
    if (!inView || value == null) return
    if (reduce) {
      setShown(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1100
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(target * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, value, reduce])

  const centre = display ?? (value == null ? '—' : `${Math.round(shown)}%`)
  const offset = value == null ? C : C * (1 - shown / 100)

  return (
    <div className={s.dial} ref={ref}>
      <svg viewBox="0 0 120 120" className={s.ring} aria-hidden="true">
        <circle cx="60" cy="60" r={R} className={s.track} />
        <circle
          cx="60"
          cy="60"
          r={R}
          className={s.progress}
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ opacity: value == null ? 0.25 : 1 }}
        />
      </svg>
      <span className={s.centre}>{centre}</span>
      <span className={s.label}>{label}</span>
      {sub && <span className={s.sub}>{sub}</span>}
    </div>
  )
}
