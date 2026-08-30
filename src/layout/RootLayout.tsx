import { useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import ScoreCanvas from '@/webgl/ScoreCanvas'
import { useScore } from '@/store/useScore'
import { setCalmFloor } from '@/webgl/scoreSignals'
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
  const setForceMotion = useScore((s) => s.setForceMotion)

  // Reset scroll before the browser paints the new route.
  useLayoutEffect(() => {
    scrollToTop()
  }, [pathname])

  useEffect(() => {
    setPaused(HEAVY_ROUTES.has(pathname))
    // The home hero keeps drifting even with reduced-motion on; every other
    // route honors the setting and holds still.
    setForceMotion(pathname === '/')
    // Reading pages (Book and the individual case studies) start the field
    // partway settled — calm, slow and faint from the top rather than at full
    // energy. The Works index keeps the regular field.
    const calmRoute = pathname === '/book' || pathname.startsWith('/works/')
    setCalmFloor(calmRoute ? 0.55 : 0)
  }, [pathname, setPaused, setForceMotion])

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
