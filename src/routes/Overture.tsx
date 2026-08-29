import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import NameReveal from '@/components/NameReveal'
import { PROJECTS } from './projects'
import s from './routes.module.css'

export default function Overture() {
  return (
    <PageTransition>
      <section className={s.hero}>
        <p className={s.kicker}>KenE Creative</p>
        <NameReveal />
        <p className={s.lede}>
          Creative strategist and developer in Austin, Texas. Brand strategy,
          copywriting, and digital experience, composed like a score.
        </p>
      </section>

      <div className={s.page}>
        <div className={s.staff} aria-hidden="true" />

        <div className={s.heroCards}>
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              to={`/works/${p.slug}`}
              viewTransition
              className={s.heroCard}
            >
              <img className={s.heroCardImg} src={p.thumb} alt="" loading="lazy" decoding="async" />
              <span className={s.heroCardScrim} aria-hidden="true" />
              <span className={s.tag}>{p.meta}</span>
              <span className={s.name}>{p.name}</span>
            </Link>
          ))}
        </div>

        <p className={s.migrateNote}>
          <Link to="/works" viewTransition style={{ color: 'var(--brass)' }}>
            All works
          </Link>
        </p>
      </div>
    </PageTransition>
  )
}
