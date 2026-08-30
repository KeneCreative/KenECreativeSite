import { motion, useReducedMotion } from 'motion/react'
import CountUp from '@/components/CountUp'
import type { MarketLeaderDef } from '@/routes/caseStudies'
import s from './MarketLeader.module.css'

/**
 * The category's dominant player as a share ring: a brass wedge for the leader,
 * a thin wedge for the next competitor, the rest muted. The ring scales in and
 * the figure counts up on view.
 */
export default function MarketLeader({
  bare,
  ...def
}: MarketLeaderDef & { bare?: boolean }) {
  const { name, share, next, label, sub } = def
  const reduce = useReducedMotion()
  const b = next ? Math.min(100, share + next) : share
  return (
    <figure className={`${s.root} ${bare ? s.bare : ''}`}>
      <motion.div
        className={s.ring}
        style={
          {
            '--a': `${share}%`,
            '--b': `${b}%`,
          } as React.CSSProperties
        }
        initial={reduce ? false : { scale: 0.86, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={s.hole}>
          <span className={s.pct}>
            <CountUp to={share} decimals={share % 1 ? 1 : 0} suffix="%" />
          </span>
          <span className={s.name}>{name}</span>
        </span>
      </motion.div>
      <figcaption className={s.cap}>
        <span className={s.capLabel}>{label}</span>
        {sub && <span className={s.capSub}>{sub}</span>}
      </figcaption>
    </figure>
  )
}
