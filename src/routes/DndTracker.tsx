import PageTransition from '@/components/PageTransition'
import s from './routes.module.css'

export default function DndTracker() {
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>Interactive</p>
        <h1 className={s.title}>Barovia Campaign Tracker</h1>
        <p className={s.lede}>A session tracker for a Curse of Strahd campaign.</p>

        <div className={s.staff} aria-hidden="true" />

        <p className={s.migrateNote}>
          Step 1 — parity shell. Original preserved at <code>legacy/dndtracker.html</code>.
        </p>
      </div>
    </PageTransition>
  )
}
