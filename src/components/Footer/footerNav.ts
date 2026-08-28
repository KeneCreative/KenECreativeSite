/** Footer stave contents — one entry per glyph on the staff, in order. */
export type StaveItem =
  | {
      kind: 'note'
      label: string
      to?: string // internal route
      href?: string // external / mailto
      lift: number
      freq: number
      sharp?: boolean
      disabled?: boolean
    }
  | { kind: 'barline' }
  | { kind: 'barline-final' }

export const STAVE: StaveItem[] = [
  { kind: 'note', label: 'Home', to: '/', lift: 43, freq: 369.99, sharp: true },
  { kind: 'note', label: 'Works', to: '/works', lift: 43, freq: 369.99 },
  { kind: 'note', label: 'About', to: '/about', lift: 54, freq: 392.0 },
  { kind: 'note', label: 'Instagram', href: 'https://instagram.com', lift: 65, freq: 440.0 },

  { kind: 'barline' },

  {
    kind: 'note',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kenneth-espinoza-79941a227',
    lift: 65,
    freq: 440.0,
  },
  { kind: 'note', label: 'Youtube', href: 'https://youtube.com', lift: 54, freq: 392.0 },
  { kind: 'note', label: 'TikTok', href: 'https://tiktok.com', lift: 43, freq: 369.99, sharp: true },
  { kind: 'note', label: 'Email', href: 'mailto:kenneth@kenecreative.com', lift: 32, freq: 329.63 },

  { kind: 'barline' },

  {
    kind: 'note',
    label: 'Unopened Letter',
    to: '/works/unopenedletter',
    lift: 21,
    freq: 293.66,
  },
  { kind: 'note', label: 'AAP', to: '/works/americanartistproject', lift: 21, freq: 293.66 },
  { kind: 'note', label: 'Redcross', to: '/works/redcross', lift: 32, freq: 329.63 },
  {
    kind: 'note',
    label: 'Dutch Bros.',
    to: '/works/dutchbros',
    lift: 43,
    freq: 369.99,
    sharp: true,
  },

  { kind: 'barline' },

  {
    kind: 'note',
    label: 'Music Archive',
    to: '/musicdashboard',
    lift: 43,
    freq: 369.99,
    sharp: true,
  },
  { kind: 'note', label: 'DnD Tracker', to: '/dndtracker', lift: 32, freq: 329.63 },
  { kind: 'note', label: 'Visualizer', lift: 32, freq: 329.63, disabled: true },

  { kind: 'barline-final' },
]
