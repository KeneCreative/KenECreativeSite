import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import s from './Slideshow.module.css'

export type Shot = { src: string; alt: string; caption?: string }

type Props = {
  slides: Shot[]
  /** Fit style for the frame. 'contain' keeps whole documents/screens visible. */
  fit?: 'cover' | 'contain'
  aspect?: string
  /**
   * Auto-advance interval in ms. Off by default. Pauses on hover / focus and
   * stays off under reduced motion.
   */
  autoplayMs?: number
  /** Drop the side arrows and single-column the stage, for narrow columns. */
  compact?: boolean
}

/**
 * A compact click-through image slideshow: framed image, prev/next, a dot
 * rail, and a caption that changes with the slide.
 */
export default function Slideshow({
  slides,
  fit = 'contain',
  aspect = '4 / 3',
  autoplayMs,
  compact = false,
}: Props) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const step = useCallback(
    (d: number) => setI((c) => (((c + d) % count) + count) % count),
    [count],
  )
  const shot = slides[i]

  useEffect(() => {
    if (!autoplayMs || reduce || paused || count < 2) return
    const id = window.setInterval(() => setI((c) => (c + 1) % count), autoplayMs)
    return () => window.clearInterval(id)
  }, [autoplayMs, reduce, paused, count])

  return (
    <div
      className={s.root}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={`${s.stage} ${compact ? s.stageCompact : ''}`}>
        {!compact && (
          <button
            className={`${s.nav} ${s.prev}`}
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous"
          >
            ‹
          </button>
        )}
        <div
          className={s.frame}
          style={{ aspectRatio: aspect }}
          onClick={() => step(1)}
          role="group"
          aria-roledescription="slideshow"
        >
          <motion.img
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            loading="lazy"
            decoding="async"
            style={{ objectFit: fit }}
            initial={reduce ? false : { opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.22 }}
          />
        </div>
        {!compact && (
          <button
            className={`${s.nav} ${s.next}`}
            type="button"
            onClick={() => step(1)}
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>

      <div className={s.foot}>
        <div className={s.dots} role="tablist">
          {slides.map((sl, n) => (
            <button
              key={sl.src}
              className={`${s.dot} ${n === i ? s.dotActive : ''}`}
              type="button"
              onClick={() => setI(n)}
              role="tab"
              aria-selected={n === i}
              aria-label={`Slide ${n + 1}`}
            />
          ))}
        </div>
        <span className={s.count}>
          {String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
      </div>

      {shot.caption && <p className={s.caption}>{shot.caption}</p>}
    </div>
  )
}
