import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import { PROJECTS } from './projects'
import s from './works.module.css'

const FIELD = { 1: s.field1, 2: s.field2, 3: s.field3, 4: s.field4 } as const

export default function Works() {
  const reduce = useReducedMotion()
  const viewportRef = useRef<HTMLDivElement>(null)
  // Set true once a drag passes the threshold, so the click that follows a
  // drag does not navigate. Reset a tick after the drag ends.
  const draggedRef = useRef(false)

  const cards = PROJECTS.map((p, i) => (
    <Link
      key={p.slug}
      to={`/works/${p.slug}`}
      viewTransition
      className={s.card}
      draggable={false}
      onClickCapture={(e) => {
        if (draggedRef.current) {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
    >
      <span className={`${s.field} ${FIELD[p.field]}`} aria-hidden="true" />
      <span className={s.scrim} aria-hidden="true" />
      <span className={s.cardBody}>
        <span className={s.cardIndex}>{String(i + 1).padStart(2, '0')}</span>
        <span className={s.cardName}>{p.name}</span>
        <span className={s.cardMeta}>{p.meta}</span>
      </span>
    </Link>
  ))

  return (
    <PageTransition>
      <section className={s.stage}>
        <div className={s.head}>
          <p className={s.eyebrow}>Works</p>
          <h1 className={s.title}>Selected work</h1>
        </div>

        {reduce ? (
          <div className={s.viewportReduced}>
            <div className={s.track}>{cards}</div>
          </div>
        ) : (
          <div ref={viewportRef} className={s.viewport}>
            <motion.div
              className={s.track}
              drag="x"
              dragConstraints={viewportRef}
              dragElastic={0.06}
              dragMomentum
              onDragStart={() => {
                draggedRef.current = false
              }}
              onDrag={(_, info) => {
                if (Math.abs(info.offset.x) > 6) draggedRef.current = true
              }}
              onDragEnd={() => {
                window.setTimeout(() => {
                  draggedRef.current = false
                }, 40)
              }}
            >
              {cards}
            </motion.div>
          </div>
        )}

        <p className={s.hint}>Drag to move through the works</p>
      </section>
    </PageTransition>
  )
}
