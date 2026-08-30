import { motion, useReducedMotion } from 'motion/react'
import type { FourCsDef } from '@/routes/caseStudies'
import s from './FourCs.module.css'

const STAT = /^(\$?\d[\d.,]*(?:%|x|×)?)\s+(.*)/i

function Evidence({ text }: { text: string }) {
  const m = text.match(STAT)
  if (!m) return <>{text}</>
  return (
    <>
      <span className={s.stat}>{m[1]}</span> {m[2]}
    </>
  )
}

/**
 * The 4Cs read on the category — company, consumer, category, culture — as four
 * quadrant cards that converge, below them, on the single opening they share.
 */
export default function FourCs({ def }: { def: FourCsDef }) {
  const reduce = useReducedMotion()
  return (
    <div className={s.root}>
      <div className={s.axes}>
        {def.axes.map((axis, i) => (
          <motion.div
            key={axis.name}
            className={s.axis}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={s.mark} aria-hidden="true">
              C
            </span>
            <span className={s.no}>{String(i + 1).padStart(2, '0')}</span>
            <span className={s.name}>{axis.name}</span>
            <p className={s.thesis}>{axis.thesis}</p>
            <ul className={s.evidence}>
              {axis.evidence.map((e) => (
                <li key={e}>
                  <Evidence text={e} />
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className={s.converge}>
        <svg className={s.funnel} viewBox="0 0 200 34" aria-hidden="true" preserveAspectRatio="none">
          {[16, 72, 128, 184].map((x) => (
            <line key={x} x1={x} y1="0" x2="100" y2="32" />
          ))}
        </svg>
        <p className={s.opening}>{def.opening}</p>
      </div>
    </div>
  )
}
