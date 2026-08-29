import { useRef, type CSSProperties } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import s from './TiltCard.module.css'

type Props = {
  src: string
  alt: string
  caption?: string
}

/**
 * Mouse-tracked 3D tilt with a glare that follows the cursor.
 * All continuous values live in motion values, never React state.
 * Static under reduced motion.
 */
export default function TiltCard({ src, alt, caption }: Props) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 220, damping: 22, mass: 0.4 }
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), spring)
  const glareX = useTransform(px, (v) => `${v * 100}%`)
  const glareY = useTransform(py, (v) => `${v * 100}%`)
  const glare = useSpring(0, { stiffness: 200, damping: 26 })

  const onMove = (e: React.PointerEvent) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    glare.set(0.4)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    glare.set(0)
  }

  return (
    <figure className={s.wrap}>
      <motion.div
        ref={ref}
        className={s.card}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} />
        {!reduce && (
          <motion.span
            className={s.glare}
            aria-hidden="true"
            style={
              {
                opacity: glare,
                '--gx': glareX,
                '--gy': glareY,
              } as unknown as CSSProperties
            }
          />
        )}
      </motion.div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
