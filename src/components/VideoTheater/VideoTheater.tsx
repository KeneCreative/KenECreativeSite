import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { VideoCut } from '@/routes/caseStudies'
import s from './VideoTheater.module.css'

function SpeakerOff() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M3.6 3.6 2.2 5l4.3 4.3H3v5.4h3.9L13 20V13.9l4.9 4.9c-.6.4-1.2.7-1.9.9v1.9c1.2-.3 2.3-.8 3.3-1.5l1.6 1.6 1.4-1.4L3.6 3.6ZM13 4l-2.5 2.5L13 9V4Z" />
      <path d="M17.5 12a3.6 3.6 0 0 0-1.6-3v1.9l1.6 1.6c0-.2 0-.3 0-.5ZM19 12c0 .5-.1 1-.2 1.4l1.5 1.5c.4-.9.7-1.9.7-2.9 0-3-2-5.6-4.7-6.4v2c1.6.7 2.7 2.3 2.7 4.4Z" />
    </svg>
  )
}
function SpeakerOn() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A3.6 3.6 0 0 0 14.9 9v6A3.6 3.6 0 0 0 16.5 12ZM14 3.2v2c2.9.9 5 3.5 5 6.8s-2.1 6-5 6.8v2c4-.9 7-4.5 7-8.8s-3-7.9-7-8.6Z" />
    </svg>
  )
}

/**
 * Four vertical cuts on a dark row. Like the legacy page: every clip autoplays
 * muted and loops together, and a per-clip sound button lets exactly one clip
 * carry audio at a time. When a cut has no hosted source yet the screen holds a
 * placeholder. Under reduced motion, clips don't autoplay and show controls.
 */
export default function VideoTheater({ cuts }: { cuts: VideoCut[] }) {
  const reduce = useReducedMotion()
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [unmuted, setUnmuted] = useState<number | null>(null)

  // React sets the `muted` *property* but not the attribute, and the browser's
  // autoplay policy checks the attribute — so force it via defaultMuted here.
  const refCbs = useMemo(
    () =>
      cuts.map((_, i) => (el: HTMLVideoElement | null) => {
        videoRefs.current[i] = el
        if (el) {
          el.defaultMuted = true
          el.muted = true
        }
      }),
    [cuts.length],
  )

  // Exactly one clip carries audio; the rest stay muted and keep looping.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      v.muted = i !== unmuted
      if (!reduce) void v.play().catch(() => {})
    })
  }, [unmuted, reduce])

  const toggle = (i: number) => {
    setUnmuted((cur) => (cur === i ? null : i))
    void videoRefs.current[i]?.play().catch(() => {})
  }

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
              <>
                <video
                  ref={refCbs[i]}
                  src={cut.src}
                  poster={cut.poster}
                  loop
                  muted
                  playsInline
                  autoPlay={!reduce}
                  controls={reduce === true}
                  preload="metadata"
                />
                {!reduce && (
                  <button
                    type="button"
                    className={s.sound}
                    onClick={() => toggle(i)}
                    aria-pressed={unmuted === i}
                    aria-label={unmuted === i ? `Mute ${cut.label}` : `Unmute ${cut.label}`}
                  >
                    {unmuted === i ? <SpeakerOn /> : <SpeakerOff />}
                  </button>
                )}
              </>
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
