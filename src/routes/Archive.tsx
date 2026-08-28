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
 * The Archive. Lazy route, its own chunk. The embedded dashboard already ships
 * a dark KenE theme; this route stays dark to match and nudges the frame's
 * tokens (and chart tints) onto the site's exact palette so the seam disappears.
 */
export default function Archive() {
  const reduce = useReducedMotion()
  const frameRef = useRef<HTMLIFrameElement>(null)

  const alignFrame = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    if (!doc) return
    try {
      const style = doc.createElement('style')
      style.textContent = `
        /* strip the duplicate site chrome + the frame's own title hero */
        #kene-header-root, #staffHeader, .staff-header, .staff-footer { display: none !important; }
        body > section:first-of-type { display: none !important; }
        body { padding-top: 0 !important; }

        /* pull the frame onto the site's exact tokens */
        :root {
          --kene-bg: #0b0b0d !important;
          --kene-paper: #141417 !important;
          --kene-text: #f5f3ef !important;
          --kene-muted: rgba(245,243,239,0.62) !important;
          --kene-rule: rgba(245,243,239,0.14) !important;
          --kene-gold: #f2b44b !important;
        }
        .text-brand-600, .text-brand-700, .text-amber-600, .text-amber-500 { color: #f2b44b !important; }
        .bg-brand-500, .bg-brand-600 { background-color: #f2b44b !important; color: #0b0b0d !important; }
        .border-brand-200, .border-brand-100, .border-brand-200\\/70 { border-color: rgba(242,180,75,0.28) !important; }
        .shadow-sm, .shadow, .shadow-md { box-shadow: none !important; }
      `
      doc.head.appendChild(style)
    } catch {
      /* cross-origin in some contexts — leave the frame as-is */
    }
  }, [])

  return (
    <PageTransition>
      <div className={s.root}>
        <motion.section
          className={`${s.wrap} ${s.overture}`}
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
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
        </motion.section>

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
            onLoad={alignFrame}
          />
          <p className={s.frameNote}>
            Preserved from the original build. Charts and tables mount inside the frame.
          </p>
        </section>
      </div>
    </PageTransition>
  )
}
