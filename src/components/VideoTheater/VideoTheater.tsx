import { motion, useReducedMotion } from 'motion/react'
import type { VideoCut } from '@/routes/caseStudies'
import s from './VideoTheater.module.css'

/**
 * Four vertical cuts, shown as a dark row of 9:16 screens. When a cut has a
 * hosted source it plays with native controls; until then the screen holds a
 * placeholder so the section keeps its weight.
 */
export default function VideoTheater({ cuts }: { cuts: VideoCut[] }) {
  const reduce = useReducedMotion()
  return (
    <div className={s.grid}>
      {cuts.map((cut, i) => (
        <motion.figure
          key={cut.label}
          className={s.card}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={`${s.chip} ${cut.kind === 'final' ? s.chipFinal : ''}`}>
            {cut.label}
          </span>
          <div className={s.screen}>
            {cut.src ? (
              <video src={cut.src} poster={cut.poster} controls playsInline preload="none" />
            ) : (
              <div className={s.pending}>
                <span className={s.play} aria-hidden="true">
                  ▶
                </span>
                <span className={s.pendingText}>Hosting pending</span>
              </div>
            )}
          </div>
          {cut.note && <figcaption className={s.note}>{cut.note}</figcaption>}
        </motion.figure>
      ))}
    </div>
  )
}
