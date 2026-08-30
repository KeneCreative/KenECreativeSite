import MarketLeader from '@/components/MarketLeader/MarketLeader'
import PriceLadder from '@/components/PriceLadder/PriceLadder'
import type { CategoryMetricsDef } from '@/routes/caseStudies'
import s from './CategoryMetrics.module.css'

/**
 * One field-metrics card: the category leader's share ring stacked above the
 * price ladder, so "who sets the reference" and "what it costs" read together.
 */
export default function CategoryMetrics({ def }: { def: CategoryMetricsDef }) {
  return (
    <figure className={s.root}>
      <figcaption className={s.head}>
        <span>{def.title ?? 'Category field metrics'}</span>
        <span className={s.status}>Verified</span>
      </figcaption>

      {def.leader && (
        <div className={s.section}>
          <MarketLeader {...def.leader} bare />
        </div>
      )}

      <div className={s.section}>
        <PriceLadder def={def.ladder} bare />
      </div>
    </figure>
  )
}
