import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

/**
 * Fallback enter fade for browsers without the View Transitions API
 * (where the barline wipe can't run). Under a view transition this is
 * already complete inside the captured snapshot, so it stays invisible.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
