export type Project = {
  slug: string
  name: string
  meta: string
  year: string
  field: 1 | 2 | 3 | 4
  thumb: string
}

/** Case studies, in display order. Slugs match the legacy URL structure. */
export const PROJECTS: Project[] = [
  {
    slug: 'unopenedletter',
    name: 'Unopened Letter',
    meta: 'Brand Campaign',
    year: '2025',
    field: 1,
    thumb: '/works/thumbs/unopenedletter.webp',
  },
  {
    slug: 'americanartistproject',
    name: 'American Artist Project',
    meta: 'Creative Strategy',
    year: '2024',
    field: 2,
    thumb: '/works/thumbs/americanartistproject.webp',
  },
  {
    slug: 'redcross',
    name: 'American Red Cross · #SignTheAlarm',
    meta: 'Campaign Work',
    year: '2024',
    field: 3,
    thumb: '/works/thumbs/redcross.webp',
  },
  {
    slug: 'dutchbros',
    name: 'Dutch Bros',
    meta: 'Brand Positioning',
    year: '2023',
    field: 4,
    thumb: '/works/thumbs/dutchbros.webp',
  },
]

export const PROJECT_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]))
