import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { PROJECTS } from './projects'
import s from './routes.module.css'

export default function Overture() {
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>KenE Creative — Movement I</p>
        <h1 className={s.title}>
          Kenneth <em>Espinoza</em>
        </h1>
        <p className={s.lede}>
          Creative strategist and developer in Austin, Texas. Brand strategy,
          copywriting, and digital experience — composed like a score.
        </p>

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
          Step 1 — parity shell. The persistent WebGL2 <code>ScoreCanvas</code> and the
          drag carousel land in Step 2. Original hero preserved at{' '}
          <code>legacy/index.html</code>.
        </p>
      </div>
    </PageTransition>
  )
}
