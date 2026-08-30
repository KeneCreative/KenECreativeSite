import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScoreCanvas from '@/webgl/ScoreCanvas'
import { useScore } from '@/store/useScore'
import { scrollToTop } from '@/lib/lenis'
import styles from './RootLayout.module.css'

/**
 * Routes where the persistent canvas parks its render loop. The music dashboard
 * used to sit here, but the woven field is cheap enough to keep running and the
 * page reads wrong without the motion, so nothing parks it for now.
 */
const HEAVY_ROUTES = new Set<string>()

export default function RootLayout() {
  const { pathname } = useLocation()
  const setPaused = useScore((s) => s.setPaused)

  // Reset scroll before the browser paints the new route.
  useLayoutEffect(() => {
    scrollToTop()
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
