import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import s from './NameReveal.module.css'

/**
 * Homepage hero name. Opens as the "KenE" wordmark, then "neth" and "spinoza"
 * expand out to the full name. Static under reduced motion.
 */
export default function NameReveal() {
  const reduce = useReducedMotion()
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (reduce) {
      setExpanded(true)
      return
    }
    const t = window.setTimeout(() => setExpanded(true), 550)
    return () => window.clearTimeout(t)
  }, [reduce])

  return (
    <h1 className={`${s.name} ${expanded ? s.expanded : ''}`} aria-label="Kenneth Espinoza">
      <span aria-hidden="true">Ken</span>
      <span aria-hidden="true" className={s.part}>
        neth&nbsp;
      </span>
      <span aria-hidden="true" className={s.accent}>
        E
      </span>
      <span aria-hidden="true" className={`${s.part} ${s.accent}`}>
        spinoza
      </span>
    </h1>
  )
}
