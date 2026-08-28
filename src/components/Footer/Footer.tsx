import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { STAVE } from './footerNav'
import { useFooterTones } from './useFooterTones'
import styles from './Footer.module.css'

const LOGO = 'https://static.wixstatic.com/media/705587_1dc95d7baf614605a69a707fde79aca7~mv2.png'

export default function Footer() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const { soundOn, toggleSound, playTone } = useFooterTones()

  // Reveal the notes when the stave scrolls into view — carried from legacy.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            io.disconnect()
          }
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  let noteIndex = 0

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <p className={styles.tempoMark} aria-hidden="true">
          Ode to Joy, arr. KenE
        </p>
      </div>

      <div
        ref={trackRef}
        className={`${styles.staffTrack} ${inView ? styles.inView : ''}`}
      >
        <nav className={styles.notes} aria-label="Footer navigation">
          <svg
            className={styles.staffLines}
            viewBox="0 0 1000 130"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line x1="0" y1="10" x2="1000" y2="10" />
            <line x1="0" y1="32" x2="1000" y2="32" />
            <line x1="0" y1="54" x2="1000" y2="54" />
            <line x1="0" y1="76" x2="1000" y2="76" />
            <line x1="0" y1="98" x2="1000" y2="98" />
          </svg>

          <div className={styles.logoWrap} aria-hidden="true">
            <img src={LOGO} alt="" className={styles.staffLogo} />
            <span className={styles.logoCaption}>CREATIVE</span>
          </div>

          {STAVE.map((item, i) => {
            if (item.kind === 'barline') {
              return <span key={`bar-${i}`} className={styles.barline} aria-hidden="true" />
            }
            if (item.kind === 'barline-final') {
              return (
                <span
                  key={`bar-${i}`}
                  className={`${styles.barline} ${styles.final}`}
                  aria-hidden="true"
                />
              )
            }

            const idx = noteIndex++
            const style = {
              '--lift': `${item.lift}px`,
              '--i': idx,
            } as CSSProperties

            const glyph = (
              <>
                <span className={styles.noteheadWrap} aria-hidden="true">
                  {item.sharp && <span className={styles.accidental}>♯</span>}
                  <span className={styles.stem} />
                  <span className={styles.notehead} />
                </span>
                <span className={styles.label}>{item.label}</span>
              </>
            )

            if (item.disabled) {
              // Not a link yet, but it is still a note on the staff — it sounds on hover.
              return (
                <span
                  key={item.label}
                  className={styles.note}
                  style={style}
                  aria-disabled="true"
                  onPointerEnter={() => playTone(item.freq)}
                >
                  {glyph}
                </span>
              )
            }

            if (item.to) {
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  viewTransition
                  className={styles.note}
                  style={style}
                  onPointerEnter={() => playTone(item.freq)}
                  onFocus={() => playTone(item.freq)}
                >
                  {glyph}
                </Link>
              )
            }

            const external = item.href?.startsWith('http')
            return (
              <a
                key={item.label}
                href={item.href}
                className={styles.note}
                style={style}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onPointerEnter={() => playTone(item.freq)}
                onFocus={() => playTone(item.freq)}
              >
                {glyph}
              </a>
            )
          })}
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.copyright}>© 2026 by KenE Creative. All rights reserved.</p>
        <button
          className={styles.soundToggle}
          type="button"
          aria-pressed={soundOn}
          onClick={toggleSound}
        >
          <span className={styles.dot} aria-hidden="true" />
          <span>{soundOn ? 'Sound on' : 'Sound off'}</span>
        </button>
      </div>
    </footer>
  )
}
