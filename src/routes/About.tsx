import PageTransition from '@/components/PageTransition'
import s from './routes.module.css'

export default function About() {
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>About</p>
        <h1 className={s.title}>
          Strategy first, <em>then</em> the words.
        </h1>
        <p className={s.lede}>
          Austin, TX. Primary focus: brand strategy, copywriting, digital experience.
          Current rotation runs to Baroque and string quartets.
        </p>

        <div className={s.staff} aria-hidden="true" />

        <p className={s.migrateNote}>
          Step 1 — parity shell. Original preserved at <code>legacy/about.html</code>.
        </p>
      </div>
    </PageTransition>
  )
}
