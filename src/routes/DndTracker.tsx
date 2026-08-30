import { useEffect, useRef, useState } from 'react'
import PageTransition from '@/components/PageTransition'
import s from './dndTracker.module.css'

/** The tracker itself is a separate deployment; this route just frames it. */
const APP_URL = 'https://dnd-tracker-nu.vercel.app/'

export default function DndTracker() {
  const [loaded, setLoaded] = useState(false)
  // The embedded app focuses a field on load, which makes the browser scroll
  // the iframe into view and skips the reader past the intro. Undo that once,
  // unless the reader has already taken over scrolling.
  const userScrolled = useRef(false)

  useEffect(() => {
    const mark = () => {
      userScrolled.current = true
    }
    window.addEventListener('wheel', mark, { passive: true, once: true })
    window.addEventListener('touchmove', mark, { passive: true, once: true })
    window.addEventListener('keydown', mark, { once: true })
    return () => {
      window.removeEventListener('wheel', mark)
      window.removeEventListener('touchmove', mark)
      window.removeEventListener('keydown', mark)
    }
  }, [])

  const handleLoad = () => {
    setLoaded(true)
    if (userScrolled.current) return
    ;[0, 60, 180].forEach((t) =>
      window.setTimeout(() => {
        if (!userScrolled.current) window.scrollTo(0, 0)
      }, t),
    )
  }

  return (
    <PageTransition>
      <div className={s.root}>
        <header className={s.intro}>
          <p className={s.eyebrow}>Side project</p>
          <h1 className={s.title}>Barovia Campaign Tracker</h1>
          <p className={s.lede}>
            A live combat and party tracker for my table&rsquo;s run through Curse of Strahd.
            Roster, HP, gold, and spells for the whole party, in one screen, every session.{' '}
            <a className={s.openNew} href={APP_URL} target="_blank" rel="noopener noreferrer">
              Open it in a new tab ↗
            </a>
          </p>
        </header>

        <div className={s.frameWrap}>
          <div className={s.frameInner}>
            {!loaded && (
              <div className={s.fallback}>
                <p>Loading the Barovia Campaign Tracker&hellip;</p>
                <p>
                  If it doesn&rsquo;t appear,{' '}
                  <a href={APP_URL} target="_blank" rel="noopener noreferrer">
                    open it directly
                  </a>
                  .
                </p>
              </div>
            )}
            <iframe
              className={s.frame}
              src={APP_URL}
              title="Barovia Campaign Tracker application"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleLoad}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
