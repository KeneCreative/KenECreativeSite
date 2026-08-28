import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'

const LOGO = 'https://static.wixstatic.com/media/705587_1dc95d7baf614605a69a707fde79aca7~mv2.png'

const NAV = [
  { to: '/', label: 'Home', note: '♫', end: true },
  { to: '/works', label: 'Works', note: '♪', end: false },
  { to: '/about', label: 'About', note: '♩', end: false },
] as const

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Shadow-on-scroll without a scroll listener — carried from legacy.
  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <NavLink
            to="/"
            className={styles.brand}
            aria-label="KenE Creative, home"
            onClick={() => setMenuOpen(false)}
          >
            <img className={styles.brandMark} src={LOGO} alt="KenE Creative" />
            <span className={styles.brandCaption} aria-hidden="true">
              CREATIVE
            </span>
          </NavLink>

          <button
            className={styles.menuToggle}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="staffNav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.srOnly}>Menu</span>
          </button>

          <nav
            id="staffNav"
            className={`${styles.nav} ${menuOpen ? styles.open : ''}`}
            aria-label="Primary"
          >
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.hlink} ${isActive ? styles.current : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.hnote} aria-hidden="true">
                  {item.note}
                </span>
                <span className={styles.hlinkLabel}>{item.label}</span>
              </NavLink>
            ))}

            <a
              className={`${styles.hlink} ${styles.hlinkMail}`}
              href="mailto:kenneth@kenecreative.com"
              aria-label="Email Kenneth"
            >
              <svg viewBox="0 0 20 16" fill="none" aria-hidden="true">
                <rect x="1" y="1" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                <path
                  d="M1.5 2L10 9L18.5 2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className={styles.hlinkLabel}>Say hello</span>
            </a>
          </nav>
        </div>
      </header>
    </>
  )
}
