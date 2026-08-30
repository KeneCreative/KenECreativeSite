import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { AlbumStep } from '@/routes/caseStudies'
import s from './AlbumEvolution.module.css'

/**
 * The album cover in three passes. Image on the left over an offset backing
 * card; step number, title and copy on the right with prev/next and a
 * segmented indicator. The image and the copy crossfade on change.
 */
export default function AlbumEvolution({ steps }: { steps: AlbumStep[] }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const total = steps.length
  const go = (n: number) => setI(((n % total) + total) % total)
  const step = steps[i]

  return (
    <div className={s.root}>
      <div className={s.panel}>
        <div className={s.figure}>
          <span className={s.backing} aria-hidden="true" />
          <div className={s.frame}>
            <motion.img
              key={step.image}
              src={step.image}
              alt={step.alt}
              loading="lazy"
              decoding="async"
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className={s.detail}>
          <div className={s.count}>
            <span className={s.countNo}>
              {step.n} / {String(total).padStart(2, '0')}
            </span>
            <span className={s.rule} aria-hidden="true" />
          </div>

          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h4 className={s.title}>{step.title}</h4>
            <p className={s.text}>{step.text}</p>
          </motion.div>

          <div className={s.nav}>
            <button
              type="button"
              className={s.navBtn}
              onClick={() => go(i - 1)}
              aria-label="Previous step"
            >
              ‹
            </button>
            <button
              type="button"
              className={s.navBtn}
              onClick={() => go(i + 1)}
              aria-label="Next step"
            >
              ›
            </button>
            <div className={s.ticks} role="tablist" aria-label="Album cover steps">
              {steps.map((st, n) => (
                <button
                  key={st.n}
                  type="button"
                  className={`${s.tick} ${n === i ? s.tickActive : ''}`}
                  onClick={() => go(n)}
                  role="tab"
                  aria-selected={n === i}
                  aria-label={`Step ${n + 1}, ${st.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
