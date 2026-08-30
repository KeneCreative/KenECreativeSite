import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '@/layout/RootLayout'
import Overture from '@/routes/Overture'
import Works from '@/routes/Works'
import Book from '@/routes/Book'
import CaseStudy from '@/routes/CaseStudy'
import About from '@/routes/About'
import DndTracker from '@/routes/DndTracker'
import NotFound from '@/routes/NotFound'

// Heavy, data-dense route — its own chunk. Charts / parsing never touch the main bundle.
const Archive = lazy(() => import('@/routes/Archive'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Overture /> },
      { path: 'works', element: <Works /> },
      { path: 'works/:slug', element: <CaseStudy /> },
      { path: 'book', element: <Book /> },
      { path: 'about', element: <About /> },
      { path: 'dndtracker', element: <DndTracker /> },
      {
        path: 'musicdashboard',
        element: (
          <Suspense fallback={<div className="route-fallback">Loading the archive…</div>}>
            <Archive />
          </Suspense>
        ),
      },
      // legacy URL kept working
      { path: 'dutchbros', element: <Navigate to="/works/dutchbros" replace /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
