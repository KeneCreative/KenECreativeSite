import { useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import s from './archive.module.css'

const DASHBOARD_SRC = '/legacy/musicdashboard.html'

const HERO_STATS = [
  {
    label: 'All-time listening',
    value: '3,398.4',
    unit: 'hrs',
    sub: 'Across 58,677 plays, 2,307 active days',
  },
  {
    label: 'All-time anchor',
    value: 'Aphex Twin',
    sub: '366.8 hrs and 4,887 plays, the top artist',
  },
  {
    label: 'Session length',
    value: '22.9',
    unit: 'min',
    sub: 'Median, up 30% across eight years',
  },
  {
    label: 'Longest run',
    value: '58',
    unit: 'days',
    sub: 'May 3 to Jun 29, 2026, 100% active',
  },
]

/**
 * The Archive. Lazy route, its own chunk. Entering it turns the page to paper
 * (the one sanctioned theme switch). An overture screen precedes the full
 * dashboard, which is embedded from the preserved legacy build with its
 * duplicate site chrome stripped on load.
 */
export default function Archive() {
  const reduce = useReducedMotion()
  const frameRef = useRef<HTMLIFrameElement>(null)

  const stripChrome = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    if (!doc) return
    try {
      const style = doc.createElement('style')
      style.textContent = `
        #kene-header-root, #staffHeader, .staff-header, .staff-footer { display: none !important; }
        /* the legacy build's own title hero — this route's overture covers it */
        body > section:first-of-type { display: none !important; }
        body { padding-top: 0 !important; }
      `
      doc.head.appendChild(style)
    } catch {
      /* cross-origin in some contexts — leave the embedded chrome in place */
    }
  }, [])

  return (
    <PageTransition>
      <motion.div
        className={s.paper}
        initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 0.6, ease: [0.72, 0, 0.24, 1] }}
      >
        <section className={`${s.wrap} ${s.overture}`}>
          <p className={s.eyebrow}>Quantitative listening analysis, 2018 to 2026</p>
          <h1 className={s.title}>My Musical Archive</h1>
          <p className={s.intro}>
            Music is one of my favorite pleasures and a defining rhythm of my life. This
            dashboard tracks macro-genre shifts, deep-dive compositions, and daily listening
            habits over eight years.
          </p>
          <p className={s.source}>Data sourced directly from Apple Music exports.</p>

          <dl className={s.stats}>
            {HERO_STATS.map((st) => (
              <div key={st.label} className={s.stat}>
                <dt className={s.statLabel}>{st.label}</dt>
                <dd className={s.statValue} style={{ margin: 0 }}>
                  {st.value}
                  {st.unit && <small>{st.unit}</small>}
                </dd>
                <dd className={s.statSub} style={{ margin: 0 }}>
                  {st.sub}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${s.wrap} ${s.embedSection}`}>
          <div className={s.embedHead}>
            <h2 className={s.embedTitle}>The full dashboard</h2>
            <Link to="/" viewTransition className={s.returnLink}>
              Return to the score
            </Link>
          </div>
          <iframe
            ref={frameRef}
            className={s.frame}
            src={DASHBOARD_SRC}
            title="Apple Music long-term listening analysis, 2018 to 2026"
            loading="lazy"
            onLoad={stripChrome}
          />
          <p className={s.frameNote}>
            Preserved from the original build. Charts and tables mount inside the frame.
          </p>
        </section>
      </motion.div>
    </PageTransition>
  )
}
