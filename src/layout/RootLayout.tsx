import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from './RootLayout.module.css'

/**
 * The persistent shell. Header, Footer (and, from Step 2, the WebGL ScoreCanvas)
 * are siblings of the <Outlet> and never unmount across navigation.
 * Only the matched route inside <main> changes.
 */
export default function RootLayout() {
  const { pathname } = useLocation()

  // Scroll to top on route change (until Lenis owns scroll in Step 3).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Header />

      {/* Step 2: <ScoreCanvas /> mounts here — persistent, behind content. */}

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </>
  )
}
