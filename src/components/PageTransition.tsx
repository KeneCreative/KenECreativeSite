import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Enter-only route transition. Jank-free, no location trickery.
 * Step 3 adds the full "barline wipe" overlay on top of this.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
