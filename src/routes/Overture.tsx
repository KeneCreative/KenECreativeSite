import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { PROJECTS } from './projects'
import s from './routes.module.css'

export default function Overture() {
  return (
    <PageTransition>
      <section className={s.hero}>
        <p className={s.kicker}>KenE Creative</p>
        <h1 className={s.title}>
          Kenneth <em>Espinoza</em>
        </h1>
        <p className={s.lede}>
          Creative strategist and developer in Austin, Texas. Brand strategy,
          copywriting, and digital experience, composed like a score.
        </p>
      </section>

      <div className={s.page}>
        <div className={s.staff} aria-hidden="true" />

        <div className={s.heroCards}>
          {PROJECTS.map((p) => (
            <Link key={p.slug} to={`/works/${p.slug}`} className={s.heroCard}>
              <span className={s.tag}>{p.meta}</span>
              <span className={s.name}>{p.name}</span>
            </Link>
          ))}
        </div>

        <p className={s.migrateNote}>
          Step 2 — the persistent WebGL2 <code>ScoreCanvas</code> is live behind this page:
          move the pointer to conduct it, scroll to resolve it to a five-line staff. The
          drag carousel and the barline-wipe transitions land in Step 3.
        </p>
      </div>
    </PageTransition>
  )
}
