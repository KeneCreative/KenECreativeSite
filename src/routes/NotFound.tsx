import { Link } from 'react-router-dom'
import PageTransition from '@/components/PageTransition'
import s from './routes.module.css'

export default function NotFound() {
  return (
    <PageTransition>
      <div className={s.page}>
        <p className={s.kicker}>404</p>
        <h1 className={s.title}>
          Rest — <em>tacet</em>
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
