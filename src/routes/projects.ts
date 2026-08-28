export type Project = {
  slug: string
  name: string
  meta: string
  year: string
}

/** Case studies, in display order. Slugs match the legacy URL structure. */
export const PROJECTS: Project[] = [
  { slug: 'unopenedletter', name: 'Unopened Letter', meta: 'Brand Campaign', year: '2025' },
  { slug: 'americanartistproject', name: 'American Artist Project', meta: 'Creative Strategy', year: '2024' },
  { slug: 'redcross', name: 'American Red Cross · #SignTheAlarm', meta: 'Campaign Work', year: '2024' },
  { slug: 'dutchbros', name: 'Dutch Bros', meta: 'Brand Positioning', year: '2023' },
]

export const PROJECT_BY_SLUG = Object.fromEntries(PROJECTS.map((p) => [p.slug, p]))
