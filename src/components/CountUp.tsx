import { useEffect, useRef } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'

type Props = {
  to: number
  decimals?: number
  comma?: boolean
  prefix?: string
  suffix?: string
}

/** Number that counts up once when it scrolls into view. Static under reduced motion. */
export default function CountUp({ to, decimals = 0, comma = false, prefix = '', suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduce = useReducedMotion()
  const mv = useMotionValue(0)

  const text = useTransform(mv, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
    const display = comma ? Number(n).toLocaleString('en-US') : n
    return `${prefix}${display}${suffix}`
  })

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      mv.set(to)
      return
    }
    const controls = animate(mv, to, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, to, reduce, mv])

  return <motion.span ref={ref}>{text}</motion.span>
}
