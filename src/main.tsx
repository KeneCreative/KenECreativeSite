import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { inject } from '@vercel/analytics'
import SmoothScroll from './lib/SmoothScroll'
import { router } from './router'
import './styles/global.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

// Vercel Web Analytics — page views + referrer / UTM breakdown, no cookies.
// Framework-agnostic inject (no React coupling); tracks SPA route changes itself.
inject()

createRoot(rootEl).render(
  <StrictMode>
    <SmoothScroll>
      <RouterProvider router={router} />
    </SmoothScroll>
  </StrictMode>,
)
