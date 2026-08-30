import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { VideoCut } from '@/routes/caseStudies'
import s from './VideoTheater.module.css'

interface VimeoPlayer {
  setMuted(m: boolean): Promise<boolean>
  setVolume(v: number): Promise<number>
  setLoop(l: boolean): Promise<boolean>
  play(): Promise<void>
  pause(): Promise<void>
}
declare global {
  interface Window {
    Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayer }
  }
}

let vimeoLoader: Promise<Window['Vimeo']> | null = null
function loadVimeo(): Promise<Window['Vimeo']> {
  if (window.Vimeo) return Promise.resolve(window.Vimeo)
  if (!vimeoLoader) {
    vimeoLoader = new Promise((resolve, reject) => {
      const sc = document.createElement('script')
      sc.src = 'https://player.vimeo.com/api/player.js'
      sc.async = true
      sc.onload = () => resolve(window.Vimeo)
      sc.onerror = reject
      document.head.appendChild(sc)
    })
  }
  return vimeoLoader
}

const embed = (id: string, reduced: boolean) => {
  const p: Record<string, string> = reduced
    ? { autoplay: '0', controls: '1' }
    : { autoplay: '1', loop: '1', muted: '1', controls: '0', autopause: '0', background: '0' }
  const qs = new URLSearchParams({
    ...p,
    dnt: '1',
    title: '0',
    byline: '0',
    portrait: '0',
    badge: '0',
  })
  return `https://player.vimeo.com/video/${id}?${qs.toString()}`
}

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
 * Four vertical cuts on a dark row, embedded from Vimeo. Like the legacy page:
 * every clip autoplays muted and loops together, and a per-clip sound button
 * lets exactly one clip carry audio at a time (re-click mutes everything). A cut
 * with no `vimeo` id shows a placeholder. Under reduced motion the clips don't
 * autoplay and keep Vimeo's own controls.
 */
export default function VideoTheater({ cuts }: { cuts: VideoCut[] }) {
  const reduce = useReducedMotion()
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const players = useRef<(VimeoPlayer | null)[]>([])
  const [unmuted, setUnmuted] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  // Attach the Vimeo API to each iframe and start the shared muted playback.
  useEffect(() => {
    if (reduce) return
    let cancelled = false
    loadVimeo()
      .then((Vimeo) => {
        if (cancelled || !Vimeo) return
        players.current = iframeRefs.current.map((el) => {
          if (!el) return null
          const p = new Vimeo.Player(el)
          void p.setMuted(true)
          void p.setLoop(true)
          void p.play().catch(() => {})
          return p
        })
        setReady(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
      players.current = []
      setReady(false)
    }
  }, [reduce])

  // Exactly one clip carries audio; every clip keeps looping. Interacting with
  // any sound button also resumes clips a strict autoplay policy may have held.
  useEffect(() => {
    if (!ready) return
    players.current.forEach((p, i) => {
      if (!p) return
      const on = i === unmuted
      void p.setMuted(!on)
      if (on) void p.setVolume(1)
      void p.play().catch(() => {})
    })
  }, [unmuted, ready])

  const toggle = (i: number) => setUnmuted((cur) => (cur === i ? null : i))

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
            {cut.vimeo ? (
              <>
                <iframe
                  ref={(el) => {
                    iframeRefs.current[i] = el
                  }}
                  className={s.frame}
                  src={embed(cut.vimeo, reduce === true)}
                  title={cut.label}
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                {reduce !== true && (
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
