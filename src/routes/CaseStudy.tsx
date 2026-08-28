import { Link, useParams } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { PROJECT_BY_SLUG } from './projects'
import s from './routes.module.css'

const LEGACY_FILE: Record<string, string> = {
  unopenedletter: 'legacy/unopenedletter.html',
  americanartistproject: 'legacy/americanartistproject.html',
  redcross: 'legacy/americanredcross.html',
  dutchbros: 'legacy/Dutch bros.html',
}

export default function CaseStudy() {
  const { slug = '' } = useParams()
  const project = PROJECT_BY_SLUG[slug]

  if (!project) {
    return (
      <PageTransition>
        <div className={s.page}>
          <p className={s.kicker}>Not found</p>
          <h1 className={s.title}>No such case study</h1>
          <p className={s.lede}>
            <Link to="/works" style={{ color: 'var(--brass)' }}>
              Back to Works
            </Link>
          </p>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>Movement III — Case Study</p>
        <h1 className={s.title}>{project.name}</h1>
        <p className={s.lede}>
          {project.meta} · {project.year}
        </p>

        <div className={s.staff} aria-hidden="true" />

        <p className={s.migrateNote}>
          Step 1 — parity shell. Full content is being restructured into Brief / Craft /
          Artefacts / Results. Original preserved at{' '}
          <code>{LEGACY_FILE[slug] ?? 'legacy/'}</code>.
        </p>
      </div>
    </PageTransition>
  )
}
