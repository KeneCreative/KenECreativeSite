import { motion, useReducedMotion } from 'motion/react'
import CountUp from '@/components/CountUp'
import type { CraftStat } from '@/routes/caseStudies'
import s from './CraftStats.module.css'

/**
 * Craft-aside stat block. Each figure counts up on scroll-in and a brass meter
 * fills to its share of the scale, staggered top to bottom — so the tiny fills
 * (four minutes, one percent) read against the full one at a glance.
 */
export default function CraftStats({ items }: { items: CraftStat[] }) {
  const reduce = useReducedMotion()
  return (
    <div className={s.wrap}>
      {items.map((st, i) => (
        <motion.div
          key={st.label}
          className={s.row}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={s.head}>
            <span className={s.value}>
              <CountUp to={st.to} decimals={st.decimals} suffix={st.suffix} />
            </span>
            <span className={s.label}>{st.label}</span>
          </div>
          <div className={s.meter} aria-hidden="true">
            <motion.span
              className={s.fill}
              style={{ width: `${st.bar}%` }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          {st.sub && <span className={s.sub}>{st.sub}</span>}
        </motion.div>
      ))}
    </div>
  )
}
