import { useEffect, useRef, useState } from 'react'
import PageTransition from '@/components/PageTransition'
import s from './dndTracker.module.css'

/** The DnD Campaign Tracker is a separate deployment; this route just frames it. */
const APP_URL = 'https://dnd-tracker-nu.vercel.app/'

const DOES = [
  'DM control panel with a separate, live player-facing display',
  'Real-time sync, no refreshing on either screen',
  'Initiative tracker with turn order and combat state',
  'HP, gold, and inventory management per character',
  'Live lookups for monster and spell data mid-session',
]

const BUILT_WITH = ['React', 'AI-assisted dev', 'GitHub', 'D&D 5e API']

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
          <p className={s.eyebrow}>
            <span className={s.live}>Live</span>
            <span>Session log · a detour</span>
          </p>
          <h1 className={s.title}>Why there&rsquo;s a D&amp;D tracker on this site</h1>

          <div className={s.grid}>
            <div className={s.body}>
              <p>
                I run a weekly D&amp;D campaign for a group of six friends. What started as loose,
                no-combat roleplay turned into a full campaign with initiative order, HP, gold,
                inventory, and enemy stats to track every session, and juggling all of it out loud,
                mid-table, was starting to slow the game down.
              </p>
              <p>
                I&rsquo;d just rebuilt this entire site by{' '}
                <em>leveraging AI to move it from default Wix blocks to custom code</em>, so I turned
                that same process on a bigger problem: a live tool I could run as Dungeon Master, with
                a synced display for my players to watch. I built it in React, learned to deploy it
                through GitHub, and wired in real D&amp;D 5th-edition data so monster and spell stats
                pull in automatically instead of me tabbing away to look them up.
              </p>
              <p>
                It&rsquo;s not a client project. It&rsquo;s here because it&rsquo;s the clearest proof
                I have of <em>how I actually use AI</em>. Not to skip the thinking, but to take a real
                problem, in a place I had zero technical background, and turn it into a working tool.
              </p>
            </div>

            <aside className={s.aside}>
              <section className={s.panel}>
                <p className={s.panelLabel}>What it does</p>
                <ul className={s.doesList}>
                  {DOES.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </section>
              <section className={s.panel}>
                <p className={s.panelLabel}>Built with</p>
                <ul className={s.tagList}>
                  {BUILT_WITH.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>

          <p className={s.cue}>
            &darr; The live tracker is below.{' '}
            <a className={s.openNew} href={APP_URL} target="_blank" rel="noopener noreferrer">
              Open it in a new tab ↗
            </a>
          </p>
        </header>

        <div className={s.frameWrap}>
          <div className={s.frameInner}>
            {!loaded && (
              <div className={s.fallback}>
                <p>Loading the DnD Campaign Tracker&hellip;</p>
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
              title="DnD Campaign Tracker application"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={handleLoad}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
