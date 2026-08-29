import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import s from './AnimationSeries.module.css'

export type AnimTab = {
  key: string
  label: string
  tagline: string
  desc: string
  beats: string[]
  frames: string[]
  caption: string
}

/**
 * Dog / Granny / Bedshaker tabs. Each drives a synced pairing: a clickable
 * beat-by-beat shot list on the left, a frame viewer on the right that follows
 * the active beat, a static final-tagline image, and the animation's caption.
 */
export default function AnimationSeries({ tabs }: { tabs: AnimTab[] }) {
  const reduce = useReducedMotion()
  const [tabIdx, setTabIdx] = useState(0)
  const [beat, setBeat] = useState(0)
  const tab = tabs[tabIdx]
  const total = tab.frames.length

  const selectTab = (i: number) => {
    setTabIdx(i)
    setBeat(0)
  }
  const stepBeat = (d: number) => setBeat((b) => Math.min(total - 1, Math.max(0, b + d)))

  return (
    <div className={s.root}>
      <div className={s.tabs} role="tablist" aria-label="Animation">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            className={`${s.tab} ${i === tabIdx ? s.tabActive : ''}`}
            type="button"
            role="tab"
            aria-selected={i === tabIdx}
            onClick={() => selectTab(i)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.narrative}>
          <p className={s.tagline}>{tab.tagline}</p>
          <p className={s.desc}>{tab.desc}</p>
          <p className={s.beatsLabel}>Storyboard sequence and script</p>
          <ol className={s.beats}>
            {tab.beats.map((b, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`${s.beat} ${i === beat ? s.beatActive : ''}`}
                  onClick={() => setBeat(i)}
                  aria-current={i === beat}
                >
                  <span className={s.beatNo}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{b}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className={s.caption}>
            <span className={s.captionTag}>{tab.label} caption</span>
            <p>{tab.caption}</p>
          </div>
        </div>

        <div className={s.visuals}>
          <div className={s.frameWrap}>
            <div className={s.frameStage}>
              <motion.img
                key={`${tab.key}-${beat}`}
                className={s.frame}
                src={tab.frames[beat]}
                alt={`${tab.label} animation, beat ${beat + 1}`}
                decoding="async"
                initial={reduce ? false : { opacity: 0.35 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p className={s.frameBeat}>
              <span className={s.frameBeatNo}>{String(beat + 1).padStart(2, '0')}</span>
              {tab.beats[beat]}
            </p>
            <div className={s.frameNav}>
              <button
                type="button"
                className={s.frameBtn}
                onClick={() => stepBeat(-1)}
                aria-label="Previous frame"
              >
                ‹
              </button>
              <span className={s.frameCount}>
                {String(beat + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button
                type="button"
                className={s.frameBtn}
                onClick={() => stepBeat(1)}
                aria-label="Next frame"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
