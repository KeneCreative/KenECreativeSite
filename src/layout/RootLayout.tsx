import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScoreCanvas from '@/webgl/ScoreCanvas'
import { useScore } from '@/store/useScore'
import styles from './RootLayout.module.css'

/** Routes where the persistent canvas parks its render loop. */
const HEAVY_ROUTES = new Set(['/musicdashboard'])

export default function RootLayout() {
  const { pathname } = useLocation()
  const setPaused = useScore((s) => s.setPaused)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    setPaused(HEAVY_ROUTES.has(pathname))
  }, [pathname, setPaused])

  return (
    <>
      <ScoreCanvas />
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
