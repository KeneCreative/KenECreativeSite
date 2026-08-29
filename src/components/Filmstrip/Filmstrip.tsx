import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import s from './Filmstrip.module.css'

export type Slide = { src: string; alt: string; caption?: string }

type Props = {
  title: string
  /** Button label on the closed card, e.g. "Preview PDF" / "View Report". */
  openLabel: string
  slides: Slide[]
  /** Optional cover shown on the closed card (defaults to the first slide). */
  cover?: string
  meta?: string
}

/**
 * A closed title card that opens into a spread viewer with a numbered
 * thumbnail strip and prev/next. In-site, no download.
 */
export default function Filmstrip({ title, openLabel, slides, cover, meta }: Props) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)
  const regionId = useId()

  const count = slides.length
  const step = useCallback(
    (delta: number) => setI((cur) => (((cur + delta) % count) + count) % count),
    [count],
  )

  // Keep the active thumbnail in view.
  useEffect(() => {
    if (!open) return
    const strip = stripRef.current
    const active = strip?.children[i] as HTMLElement | undefined
    active?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }, [i, open, reduce])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      step(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      step(-1)
    }
  }

  if (!open) {
    return (
      <button className={s.card} type="button" onClick={() => setOpen(true)}>
        <img
          className={s.cardImg}
          src={cover ?? slides[0]?.src}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className={s.cardScrim} aria-hidden="true" />
        <span className={s.cardBody}>
          {meta && <span className={s.cardMeta}>{meta}</span>}
          <span className={s.cardTitle}>{title}</span>
          <span className={s.cardCta}>
            {openLabel}
            <span aria-hidden="true"> →</span>
          </span>
        </span>
      </button>
    )
  }

  const slide = slides[i]

  return (
    <section
      className={s.viewer}
      aria-label={title}
      onKeyDown={onKey}
      tabIndex={-1}
      id={regionId}
    >
      <header className={s.viewerHead}>
        <span className={s.viewerTitle}>{title}</span>
        <span className={s.counter}>
          {String(i + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button className={s.close} type="button" onClick={() => setOpen(false)}>
          Close
        </button>
      </header>

      <div className={s.stage}>
        <button
          className={`${s.nav} ${s.prev}`}
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous spread"
        >
          ‹
        </button>
        <div className={s.frame}>
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading="eager"
            decoding="async"
            initial={reduce ? false : { opacity: 0.35 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <button
          className={`${s.nav} ${s.next}`}
          type="button"
          onClick={() => step(1)}
          aria-label="Next spread"
        >
          ›
        </button>
      </div>

      {slide.caption && <p className={s.caption}>{slide.caption}</p>}

      <div className={s.strip} ref={stripRef}>
        {slides.map((sl, n) => (
          <button
            key={sl.src}
            className={`${s.thumb} ${n === i ? s.thumbActive : ''}`}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Spread ${n + 1}`}
            aria-current={n === i}
          >
            <img src={sl.src} alt="" loading="lazy" decoding="async" />
            <span className={s.thumbNo}>{String(n + 1).padStart(2, '0')}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
