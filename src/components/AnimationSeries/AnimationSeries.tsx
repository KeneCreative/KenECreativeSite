import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import s from './AnimationSeries.module.css'

export type AnimTab = {
  key: string
  label: string
  tagline: string
  desc: string
  beats: string[]
  frames: string[]
  caption: string
}

const AUTOPLAY_MS = 3000

/**
 * Dog / Granny / Bedshaker tabs. Two columns: a scrollable storyboard list on
 * the left, matched to the full height of the frame box on the right. The
 * sequence auto-advances (3s), which drives the frame; any jump restarts the
 * timer; hovering the panel pauses it. The spot's caption sits below, centred.
 */
export default function AnimationSeries({ tabs }: { tabs: AnimTab[] }) {
  const reduce = useReducedMotion()
  const [tabIdx, setTabIdx] = useState(0)
  const [beat, setBeat] = useState(0)
  const tab = tabs[tabIdx]
  const total = tab.frames.length

  const rootRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const hovering = useRef(false)
  const inView = useInView(rootRef, { amount: 0.2 })

  // Match the list column height to the whole frame box (image + counter row)
  // so the list bottom lines up with the bottom of the counter box.
  const [listH, setListH] = useState<number | null>(null)
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => {
      const labelH = labelRef.current?.offsetHeight ?? 0
      setListH(Math.max(220, box.getBoundingClientRect().height - labelH - 12))
    }
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    measure()
    return () => ro.disconnect()
  }, [])

  const selectTab = (i: number) => {
    setTabIdx(i)
    setBeat(0)
  }
  const goto = useCallback((i: number) => setBeat(((i % total) + total) % total), [total])
  const step = (d: number) => goto(beat + d)

  // On tab switch: jump the list back to the top (first beat highlighted).
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [tabIdx])

  // Follow the active beat within the current tab.
  useEffect(() => {
    const list = listRef.current
    const active = list?.children[beat] as HTMLElement | undefined
    if (!list || !active) return
    const id = requestAnimationFrame(() => {
      list.scrollTo({
        top: Math.max(0, active.offsetTop - 16),
        behavior: reduce ? 'auto' : 'smooth',
      })
    })
    return () => cancelAnimationFrame(id)
  }, [beat, reduce])

  // Pause autoplay while the pointer is over the component.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const on = () => (hovering.current = true)
    const off = () => (hovering.current = false)
    el.addEventListener('pointerenter', on)
    el.addEventListener('pointerleave', off)
    return () => {
      el.removeEventListener('pointerenter', on)
      el.removeEventListener('pointerleave', off)
    }
  }, [])

  // Autoplay: advance every 4s, which drives the frame. Any jump restarts it.
  useEffect(() => {
    if (reduce || !inView) return
    const id = window.setInterval(() => {
      if (!hovering.current) setBeat((b) => (b + 1) % total)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [reduce, inView, total, tabIdx, beat])

  return (
    <div className={s.root} ref={rootRef}>
      <div className={s.tabs} role="tablist" aria-label="Animation">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            className={`${s.tab} ${i === tabIdx ? s.tabActive : ''}`}
            type="button"
            role="tab"
            aria-selected={i === tabIdx}
            onClick={() => selectTab(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.intro}>
        <p className={s.tagline}>{tab.tagline}</p>
        <p className={s.desc}>{tab.desc}</p>
      </div>

      <div className={s.panel}>
        <div className={s.listCol}>
          <p className={s.beatsLabel} ref={labelRef}>
            Storyboard sequence and script
          </p>
          <ol
            className={s.beats}
            ref={listRef}
            style={listH ? { maxHeight: listH } : undefined}
          >
            {tab.beats.map((b, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`${s.beat} ${i === beat ? s.beatActive : ''}`}
                  onClick={() => goto(i)}
                  aria-current={i === beat}
                >
                  <span className={s.beatNo}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{b}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.visuals}>
          <div className={s.frameWrap} ref={boxRef}>
            <div className={s.frameStage}>
              <motion.img
                key={`${tab.key}-${beat}`}
                className={s.frame}
                src={tab.frames[beat]}
                alt={`${tab.label} animation, beat ${beat + 1}`}
                decoding="async"
                initial={reduce ? false : { opacity: 0.35 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className={s.frameBeat}>
              <span className={s.frameBeatNo}>{String(beat + 1).padStart(2, '0')}</span>
              {tab.beats[beat]}
            </p>
            <div className={s.frameNav}>
              <button
                type="button"
                className={s.frameBtn}
                onClick={() => step(-1)}
                aria-label="Previous frame"
              >
                ‹
              </button>
              <span className={s.frameCount}>
                {String(beat + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button
                type="button"
                className={s.frameBtn}
                onClick={() => step(1)}
                aria-label="Next frame"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={s.caption}>
        <span className={s.captionTag}>{tab.label} caption</span>
        <p>{tab.caption}</p>
      </div>
    </div>
  )
}
