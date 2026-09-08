import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import { useSeo } from '@/lib/useSeo'
import s from './routes.module.css'

export default function NotFound() {
  useSeo({
    title: 'Page not found | KenE Creative',
    description: "This page isn't in the score. Head back to the KenE Creative homepage.",
    noindex: true,
  })
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>404</p>
        <h1 className={s.title}>
          Rest. <em>Tacet</em>.
        </h1>
        <p className={s.lede}>
          This page isn&rsquo;t in the score.{' '}
          <Link to="/" style={{ color: 'var(--brass)' }}>
            Back to the top
          </Link>
          .
        </p>
      </div>
    </PageTransition>
  )
}
