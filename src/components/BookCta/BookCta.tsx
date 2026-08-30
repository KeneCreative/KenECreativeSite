import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import s from './BookCta.module.css'

/**
 * Homepage hero call to action pointing at the Book. Slides in just after the
 * name reveal settles, then gleams on a slow loop so it reads as the one thing
 * to click. The note lifts and the rule draws on hover.
 */
export default function BookCta() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={s.wrap}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/book" viewTransition className={s.btn}>
        <span className={s.note} aria-hidden="true">
          &#9834;
        </span>
        <span className={s.label}>Read the Book</span>
        <span className={s.arrow} aria-hidden="true">
          &rarr;
        </span>
        <span className={s.gleam} aria-hidden="true" />
        <span className={s.rule} aria-hidden="true" />
      </Link>
      <span className={s.hint}>Writing samples, a 30-second read</span>
    </motion.div>
  )
}
