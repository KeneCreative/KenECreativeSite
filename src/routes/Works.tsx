import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { PROJECTS } from './projects'
import s from './routes.module.css'

export default function Works() {
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>Movement II — Works</p>
        <h1 className={s.title}>Selected work</h1>
        <p className={s.lede}>
          Four case studies. Each is being rebuilt into a four-part structure —
          Brief, Craft, Artefacts, Results.
        </p>

        <ul className={s.projectList}>
          {PROJECTS.map((p, i) => (
            <li key={p.slug} className={s.projectRow}>
              <Link to={`/works/${p.slug}`} className={s.projectLink}>
                <span className={s.projectIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={s.projectName}>{p.name}</span>
                <span className={s.projectMeta}>
                  {p.meta} · {p.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className={s.migrateNote}>
          Step 1 — parity shell. Original index preserved at <code>legacy/works.html</code>.
        </p>
      </div>
    </PageTransition>
  )
}
