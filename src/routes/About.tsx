import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import s from './about.module.css'

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

type Track = { artist: string; work: string; nowPlaying?: boolean }

/** Same feed the Music Archive uses. Read-only public key, already public. */
const LASTFM_URL =
  'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=KenECreative' +
  '&api_key=4917e1f81b4801ccfae888b758279adb&format=json&limit=24'

/** Shown until Last.fm answers, and if it can't be reached. */
const FALLBACK: Track[] = [
  { work: 'Concerto for 4 Violins & Cello in B Minor, RV 580', artist: 'Café Zimmermann' },
  { work: 'Gershwin Song Suite: I. Fascinating Rhythm', artist: 'Daniel Hope / Marcus Roberts Trio' },
  { work: 'Violin Concerto in A Minor, Op. 3 No. 6: I. Allegro', artist: 'Brecon Baroque & Rachel Podger' },
  { work: 'String Quartet No. 16 in F Major, Op. 135', artist: 'Tokyo String Quartet' },
  { work: 'String Quintet in C Major, D. 956: I. Allegro', artist: 'Borodin Quartet' },
  { work: 'Symphony No. 9 in D Minor, "Choral": I. Allegro', artist: 'Vienna Philharmonic & Leonard Bernstein' },
  { work: 'Sonata in F Minor, BWV 1018: II. Allegro', artist: 'Andrew Manze & Richard Egarr' },
  { work: 'Violin Concerto in D Major, Op. 61: III. Rondo', artist: 'Perlman & Giulini' },
  { work: 'String Quartet No. 15 in A Minor, Op. 132', artist: 'Tokyo String Quartet' },
  { work: 'Symphony No. 7 in A Major: I. Poco sostenuto', artist: 'Vienna Philharmonic & Carlos Kleiber' },
  { work: 'Violin Concerto in A Minor, RV 356: I. Allegro', artist: 'Israel Philharmonic & Itzhak Perlman' },
  { work: 'String Quartet No. 13: IV. Alla danza tedesca', artist: 'Tokyo String Quartet' },
]

const tidy = (v: string) =>
  v
    .replace(/\s+/g, ' ')
    .replace(/\s*[([]\s*(official\s*)?(audio|video|lyric video|visualizer|hd|4k|remaster(ed)?)\s*[)\]]\s*$/i, '')
    .trim()

function useRecentTracks(): Track[] {
  const [tracks, setTracks] = useState<Track[]>(FALLBACK)

  useEffect(() => {
    let alive = true
    const load = async () => {
      try {
        const res = await fetch(LASTFM_URL)
        if (!res.ok) return
        const data = await res.json()
        const raw: unknown[] = data?.recenttracks?.track ?? []
        const list = raw
          .map((t): Track => {
            const item = t as {
              name?: string
              artist?: { '#text'?: string; name?: string }
              '@attr'?: { nowplaying?: string }
            }
            return {
              artist: tidy(item.artist?.['#text'] ?? item.artist?.name ?? ''),
              work: tidy(item.name ?? ''),
              nowPlaying: item['@attr']?.nowplaying === 'true',
            }
          })
          .filter((t) => t.artist && t.work)
          .filter(
            (t, i, arr) => i === 0 || t.artist !== arr[i - 1].artist || t.work !== arr[i - 1].work,
          )
        if (alive && list.length) setTracks(list)
      } catch {
        /* keep the fallback list */
      }
    }
    load()
    const id = window.setInterval(load, 90_000)
    return () => {
      alive = false
      window.clearInterval(id)
    }
  }, [])

  return tracks
}

function Ledger() {
  const tracks = useRecentTracks()
  const reduce = useReducedMotion()
  const loop = [...tracks, ...tracks]
  const viewportRef = useRef<HTMLDivElement>(null)

  // The rotation drifts on its own, but it's a real scroll container: hovering
  // (or focusing) it hands control to the wheel/trackpad, and it picks the
  // drift back up on the way out. The scrollbar itself is hidden in CSS.
  useEffect(() => {
    const el = viewportRef.current
    if (!el || reduce) return

    const SPEED = 26 // px per second
    let raf = 0
    let held = false
    let last = 0
    // Our own float cursor — `scrollTop` reads back rounded, so sub-pixel steps
    // would stall if we trusted it. `pos` accumulates; we push it to the element.
    let pos = 1

    const half = () => el.scrollHeight / 2
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      if (held) return
      const h = half()
      pos += SPEED * dt
      if (h > 0 && pos >= h) pos -= h
      el.scrollTop = pos
    }
    el.scrollTop = pos
    raf = requestAnimationFrame(tick)

    const hold = () => {
      held = true
    }
    const release = () => {
      held = false
      pos = el.scrollTop // resume the drift from wherever they left it
    }
    // Seamless loop while the reader is scrolling by hand. The 1px nudge keeps
    // the landing spot off the exact edge so it can't ping-pong there.
    const onScroll = () => {
      if (!held) return // ignore the ticker's own writes
      const h = half()
      if (h <= 0) return
      if (el.scrollTop >= h) el.scrollTop = el.scrollTop - h + 1
      else if (el.scrollTop < 1) el.scrollTop = el.scrollTop + h - 1
    }

    el.addEventListener('pointerenter', hold)
    el.addEventListener('pointerleave', release)
    el.addEventListener('wheel', hold, { passive: true })
    el.addEventListener('focusin', hold)
    el.addEventListener('focusout', release)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', hold)
      el.removeEventListener('pointerleave', release)
      el.removeEventListener('wheel', hold)
      el.removeEventListener('focusin', hold)
      el.removeEventListener('focusout', release)
      el.removeEventListener('scroll', onScroll)
    }
  }, [reduce, tracks.length])

  return (
    <div className={s.ledger}>
      <div className={s.ledgerHead}>
        <span>Current rotation</span>
        <span className={s.ledgerTag}>Live</span>
      </div>
      <div className={s.ledgerViewport} ref={viewportRef}>
        <ol className={s.ledgerTrack}>
          {loop.map((t, i) => {
            const original = i < tracks.length
            const isNow = i % tracks.length === 0 || t.nowPlaying
            return (
              <li
                key={i}
                className={`${s.ledgerItem} ${isNow ? s.ledgerItemNow : ''}`}
                aria-hidden={!original}
              >
                <span className={s.ledgerArtist}>{t.artist}</span>
                <span className={s.ledgerWork}>{t.work}</span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <PageTransition>
      <article className={s.root}>
        <header className={`${s.wrap} ${s.hero}`}>
          <Reveal>
            <p className={s.kicker}>About</p>
          </Reveal>
          <Reveal>
            <h1 className={s.name}>Kenneth Espinoza</h1>
          </Reveal>
          <Reveal>
            <p className={s.alias}>
              My friends call me Ken<span className={s.dim}>ny</span>E.
            </p>
          </Reveal>
          <Reveal>
            <p className={s.leadBody}>
              Copywriter, creative strategist, and UT Austin Advertising graduate. I believe in
              clarity, cleverness, and truth. If you give me your attention, I&rsquo;m going to
              earn it, whether that&rsquo;s a tagline or a whole campaign.
            </p>
          </Reveal>
        </header>

        <div className={`${s.wrap} ${s.body}`}>
          <div className={s.copy}>
            <Reveal className={s.block}>
              <figure className={s.portrait}>
                <img
                  src="/about/portrait.webp"
                  alt="Kenneth Espinoza"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </Reveal>

            <Reveal className={s.block}>
              <p className={s.kicker}>My philosophy</p>
              <blockquote className={s.quote}>&ldquo;To do is to be.&rdquo;</blockquote>
              <p className={s.para}>
                There is no waiting period to become the person you want to be. The second you
                start doing the work and putting in effort, you already are that person. The
                flip side is just as real: you cannot claim to be someone without backing it up
                with action.
              </p>
            </Reveal>

            <Reveal className={s.block}>
              <p className={s.kicker}>The mindset</p>
              <p className={s.para}>
                This site is a reflection of that. Whether you&rsquo;re here to hire me,
                collaborate, or just get inspired, welcome. Hope you find something that makes
                you feel something.
              </p>
            </Reveal>
          </div>

          <aside className={s.side}>
            <div className={s.sideInner}>
              <div className={s.field}>
                <p className={s.fieldLabel}>Current status</p>
                <p className={s.status}>
                  <span className={s.dot} aria-hidden="true" />
                  Available for creative roles
                </p>
              </div>

              <div className={s.field}>
                <p className={s.fieldLabel}>Primary focus</p>
                <p className={s.focus}>Copywriting, Creative Strategy, Digital Experience</p>
              </div>

              <Ledger />

              <Link to="/musicdashboard" viewTransition className={s.dashLink}>
                Eight years of tunes ↗
              </Link>

              <div className={s.sideFoot}>
                <span>Austin, Texas</span>
                <span>KenE Creative</span>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </PageTransition>
  )
}
