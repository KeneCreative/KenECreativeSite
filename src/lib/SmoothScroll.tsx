import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { setLenis } from './lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * One smooth-scroll instance, one animation clock.
 * Lenis is driven from gsap.ticker so the canvas RAF, ScrollTrigger and Lenis
 * never fight over frames. Skipped entirely under reduced motion — the page
 * then uses native scrolling and ScrollTrigger still works off window scroll.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      ScrollTrigger.refresh()
      return
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })

    lenis.on('scroll', ScrollTrigger.update)
    setLenis(lenis)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      setLenis(null)
    }
  }, [])

  return <>{children}</>
}
