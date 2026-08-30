import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { ExecutionDef } from '@/routes/caseStudies'
import s from './Executions.module.css'

/**
 * A stack of creative-execution dossiers. Each is a closed header that opens to
 * the full write-up and its key-message framework. Open independently.
 */
export default function Executions({ items }: { items: ExecutionDef[] }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState<number | null>(0)
  const uid = useId()

  return (
    <div className={s.stack}>
      {items.map((ex, i) => {
        const isOpen = open === i
        const panelId = `${uid}-${i}`
        return (
          <article key={ex.title} className={`${s.card} ${isOpen ? s.cardOpen : ''}`}>
            <button
              type="button"
              className={s.header}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
            >
              <span className={s.headText}>
                <span className={s.kicker}>{ex.kicker}</span>
                <span className={s.title}>{ex.title}</span>
              </span>
              <span className={s.headMeta}>
                <span className={s.no}>{ex.no}</span>
                <span className={s.toggle} aria-hidden="true">
                  {isOpen ? 'Close' : 'Read'}
                  <span className={`${s.chev} ${isOpen ? s.chevOpen : ''}`}>›</span>
                </span>
              </span>
            </button>

            <motion.div
              id={panelId}
              className={s.panelWrap}
              initial={false}
              animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className={s.panel}>
                {ex.body.map((para, k) => (
                  <p key={k} className={s.para}>
                    {para}
                  </p>
                ))}

                <div className={s.framework}>
                  <p className={s.frameworkTitle}>{ex.framework.title}</p>
                  <ul className={s.pillars}>
                    {ex.framework.pillars.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  {ex.framework.note && <p className={s.frameworkNote}>{ex.framework.note}</p>}
                </div>
              </div>
            </motion.div>
          </article>
        )
      })}
    </div>
  )
}
