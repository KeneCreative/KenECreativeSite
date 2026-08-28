import PageTransition from '@/components/PageTransition'
import s from './routes.module.css'

/**
 * The music dashboard — a genuine data product, lazy-loaded as its own chunk.
 * Step 3: the dark→paper theme switch, visibility-gated charts, content-visibility.
 */
export default function Archive() {
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>Movement IV — The Archive</p>
        <h1 className={s.title}>Apple Music, 2018–2026</h1>
        <p className={s.lede}>
          A long-term listening analysis. This route loads as its own bundle so its
          charts never weigh on the rest of the site.
        </p>

        <div className={s.staff} aria-hidden="true" />

        <p className={s.migrateNote}>
          Step 1 — parity shell. The full dashboard (
          <code>legacy/musicdashboard.html</code>, ~1.2&nbsp;MB) gets the sanctioned
          dark→paper theme switch and per-chart <code>IntersectionObserver</code> mounting
          in Step 3.
        </p>
      </div>
    </PageTransition>
  )
}
