import { motion, useReducedMotion } from 'motion/react'
import type { PriceLadderDef, PriceCup } from '@/routes/caseStudies'
import s from './PriceLadder.module.css'

const VB_W = 64
const VB_H = 96
const FLOOR = VB_H - 8

function Cup({ scale, kind, highlight }: Pick<PriceCup, 'scale' | 'kind' | 'highlight'>) {
  const topY = FLOOR - 70 * scale
  const midY = (topY + FLOOR) / 2
  const stroke = highlight ? 'var(--brass)' : 'currentColor'
  return (
    <svg className={s.cup} viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true">
      <g fill="none" stroke={stroke} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round">
        <path d={`M14 ${topY} L50 ${topY} L45 ${FLOOR} L19 ${FLOOR} Z`} />
        <ellipse cx={32} cy={topY} rx={18} ry={4} />
        {kind === 'lid' && <path d={`M15 ${topY} Q32 ${topY - 9} 49 ${topY}`} />}
        {kind === 'sleeve' && <rect x={15.5} y={midY - 9} width={33} height={18} rx={1.5} />}
      </g>
    </svg>
  )
}

/**
 * The category price ladder: a row of coffee cups that grow with their price,
 * sharing a baseline so the gap reads at a glance. Cups rise in on scroll.
 * `bare` drops the outer border/background for nesting in another box.
 */
export default function PriceLadder({ def, bare }: { def: PriceLadderDef; bare?: boolean }) {
  const reduce = useReducedMotion()
  return (
    <figure className={`${s.root} ${bare ? s.bare : ''}`}>
      <figcaption className={s.head}>
        <span className={s.kicker}>Price ladder</span>
        <span className={s.title}>{def.title}</span>
      </figcaption>

      <div className={s.row}>
        {def.cups.map((cup, i) => (
          <motion.div
            key={cup.brand}
            className={`${s.item} ${cup.highlight ? s.itemOn : ''}`}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={s.price}>{cup.price}</span>
            <Cup scale={cup.scale} kind={cup.kind} highlight={cup.highlight} />
            <span className={s.brand}>{cup.brand}</span>
          </motion.div>
        ))}
      </div>

      {def.source && (
        <p className={s.source}>
          Source:{' '}
          <a href={def.source.href} target="_blank" rel="noopener noreferrer">
            {def.source.label}
          </a>
        </p>
      )}
    </figure>
  )
}
