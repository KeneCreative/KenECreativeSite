import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { TimelinePoint } from '@/routes/caseStudies'
import s from './ResultsTimeline.module.css'

type Props = { points: TimelinePoint[]; start?: number }

const W = 760
const H = 380
const ML = 44
const MR = 52
const MT = 26
const MB = 40
const PLOT_W = W - ML - MR
const PLOT_H = H - MT - MB

const PL_MAX = 25
const REACH_MAX = 180_000

const fmtReach = (v: number) => {
  const k = v / 1000
  return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
}

export default function ResultsTimeline({ points, start }: Props) {
  const reduce = useReducedMotion()
  const uid = useId().replace(/[:]/g, '')
  const n = points.length
  const [idx, setIdx] = useState(
    Math.min(n - 1, Math.max(0, start ?? Math.floor(n / 2))),
  )
  const active = points[idx]

  const x = (i: number) => ML + (n === 1 ? 0 : (i / (n - 1)) * PLOT_W)
  const yPl = (v: number) => MT + PLOT_H - (v / PL_MAX) * PLOT_H
  const yRe = (v: number) => MT + PLOT_H - (v / REACH_MAX) * PLOT_H

  const plLine = points.map((p, i) => `${x(i)},${yPl(p.playlists)}`).join(' ')
  const plArea = `M ${x(0)},${MT + PLOT_H} L ${points
    .map((p, i) => `${x(i)},${yPl(p.playlists)}`)
    .join(' L ')} L ${x(n - 1)},${MT + PLOT_H} Z`
  const reLine = points.map((p, i) => `${x(i)},${yRe(p.reach)}`).join(' ')

  const gridVals = [5, 10, 15, 20, 25]

  return (
    <div className={s.root}>
      <div className={s.legend}>
        <span className={s.key}>
          <span className={`${s.swatch} ${s.swatchPl}`} /> Playlists
        </span>
        <span className={s.key}>
          <span className={`${s.swatch} ${s.swatchRe}`} /> Playlist reach
        </span>
      </div>

      <div className={s.body}>
        <div className={s.chartCol}>
          <div className={s.chartScroll}>
            <svg
              className={s.chart}
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label={`Playlist count and reach across ${n} dates, currently showing ${active.date}`}
            >
              <defs>
                <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* horizontal gridlines + left axis (playlists) */}
              {gridVals.map((v) => (
                <g key={v}>
                  <line
                    className={s.grid}
                    x1={ML}
                    y1={yPl(v)}
                    x2={W - MR}
                    y2={yPl(v)}
                  />
                  <text className={s.axisL} x={ML - 8} y={yPl(v) + 3} textAnchor="end">
                    {v}
                  </text>
                </g>
              ))}

              {/* right axis (reach) */}
              {[45_000, 90_000, 135_000, 180_000].map((v) => (
                <text
                  key={v}
                  className={s.axisR}
                  x={W - MR + 8}
                  y={yRe(v) + 3}
                  textAnchor="start"
                >
                  {fmtReach(v)}
                </text>
              ))}

              {/* active guide */}
              <line
                className={s.guide}
                x1={x(idx)}
                y1={MT}
                x2={x(idx)}
                y2={MT + PLOT_H}
              />

              {/* playlists: area + line */}
              <motion.path
                d={plArea}
                fill={`url(#fill-${uid})`}
                initial={reduce ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.polyline
                className={s.linePl}
                points={plLine}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.3, ease: 'easeInOut' }}
              />

              {/* reach: dashed line */}
              <motion.polyline
                className={s.lineRe}
                points={reLine}
                initial={reduce ? false : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.3, ease: 'easeInOut', delay: 0.15 }}
              />

              {/* points + hit targets */}
              {points.map((p, i) => (
                <g key={p.date}>
                  <circle
                    className={i === idx ? s.dotReActive : s.dotRe}
                    cx={x(i)}
                    cy={yRe(p.reach)}
                    r={i === idx ? 5 : 3}
                  />
                  <circle
                    className={i === idx ? s.dotPlActive : s.dotPl}
                    cx={x(i)}
                    cy={yPl(p.playlists)}
                    r={i === idx ? 6 : 3.5}
                  />
                  <rect
                    className={s.hit}
                    x={x(i) - PLOT_W / (n - 1) / 2}
                    y={MT}
                    width={PLOT_W / (n - 1)}
                    height={PLOT_H}
                    onClick={() => setIdx(i)}
                  />
                  <text
                    className={`${s.xLabel} ${i === idx ? s.xLabelActive : ''}`}
                    x={x(i)}
                    y={H - 14}
                    textAnchor="middle"
                  >
                    {p.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <label className={s.sliderWrap}>
            <span className={s.sliderEnds}>
              <span>{points[0].date}</span>
              <span className={s.sliderNow}>{active.date} 2026</span>
              <span>{points[n - 1].date}</span>
            </span>
            <input
              className={s.slider}
              type="range"
              min={0}
              max={n - 1}
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
              aria-label="Timeline position"
            />
          </label>
        </div>

        <motion.aside
          className={s.panel}
          key={idx}
          initial={reduce ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={s.phaseKicker}>Campaign phase</span>
          <h4 className={s.phaseTitle}>{active.phase}</h4>
          <p className={s.phaseDesc}>{active.desc}</p>
          <div className={s.miniStats}>
            <div>
              <span className={`${s.miniValue} ${s.miniPl}`}>{active.playlists}</span>
              <span className={s.miniLabel}>Playlists</span>
            </div>
            <div>
              <span className={s.miniValue}>{fmtReach(active.reach)}</span>
              <span className={s.miniLabel}>Reach</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  )
}
