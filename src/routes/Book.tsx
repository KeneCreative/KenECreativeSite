import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import PriceLadder from '@/components/PriceLadder/PriceLadder'
import Slideshow from '@/components/Slideshow/Slideshow'
import type { PriceLadderDef } from './caseStudies'
import s from './book.module.css'

/** Slide-and-fade on entry, matching About and the case studies. */
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** The Dutch Bros price ladder, same figures as the case study. */
const DUTCH_LADDER: PriceLadderDef = {
  title: 'What a cup costs across the category',
  cups: [
    { brand: '7-Eleven', price: '$3.49', scale: 0.6, kind: 'plain' },
    { brand: 'Dutch Bros', price: '$3.50', scale: 0.62, kind: 'plain', highlight: true },
    { brand: 'Dunkin', price: '$4.69', scale: 0.82, kind: 'lid' },
    { brand: 'Starbucks', price: '$5.25', scale: 1, kind: 'sleeve' },
  ],
  source: {
    label: 'Foodservice Coffee and Tea, US 2023, Mintel',
    href: 'https://store.mintel.com/report/us-foodservice-coffee-and-tea-market-report-2023',
  },
}

type Shot = { src: string; alt: string; caption: string }
type AnimationItem = { label: string; line: string; social: string }
type SlideGroup = {
  label: string
  aspect?: string
  slides: { src: string; alt: string; caption: string }[]
}

type Module = {
  name: string
  href: string
  roles: string[]
  blurb: string
  /** Mono label above the featured copy. */
  srcTag?: string
  /** Rendered largest and boldest on the page. One line, or a short series. */
  featured?: string[]
  featuredVariant?: 'small' | 'series'
  /** Uppercase poster treatment for the featured lines. */
  caps?: boolean
  /** Per-line mono labels, when the lines come from different pieces. null skips a line. */
  lineTags?: (string | null)[]
  /** Tagline plus the social copy that ran with it, one block per spot. */
  animations?: AnimationItem[]
  secondary?: string
  /** Single supporting image, sits in the right column. */
  shot?: Shot
  /** Sits in the right column. */
  ladder?: PriceLadderDef
  /** Auto-advancing set, sits in the right column. */
  slideshow?: SlideGroup
}

const MODULES: Module[] = [
  {
    name: 'American Red Cross · #SignTheAlarm',
    href: '/works/redcross',
    roles: ['Concept Development', 'Copywriting', 'Creative Strategy', 'Research'],
    blurb:
      'Campaign to raise awareness of free bed-shaker fire alarms for the Deaf and Hard of Hearing community and recruit ASL-fluent volunteers, reframed from charity to personal responsibility.',
    srcTag: 'Animation series',
    animations: [
      {
        label: 'Dog',
        line: 'Your dog waits for you. What are you waiting for?',
        social:
          '#SignTheAlarm Fire damage goes beyond flames. Request a bed shaker alarm installed and provided by the Red Cross to ensure your safety. Learn more and request yours by clicking the link in our bio.',
      },
      {
        label: 'Granny',
        line: "When you're asleep, so is your sense of smell.",
        social:
          "#SignTheAlarm Fire doesn't discriminate, and neither should someone's alarm. Consider volunteering with the Red Cross and be part of installing bed shaker alarms for people in your community. Visit the link in our bio for details.",
      },
      {
        label: 'Bedshaker',
        line: "Bedshakers are not an early warning. They're your only warning.",
        social:
          '#SignTheAlarm The speed of fire is unpredictable. Learn how to protect your home and loved ones with fire safety resources from the Red Cross. Stay informed and stay safe. Find out more at the link in our bio.',
      },
    ],
    slideshow: {
      label: 'Business cards, the four backs',
      aspect: '2 / 1',
      slides: [
        {
          src: '/works/redcross/cards/2-back-seconds.webp',
          alt: 'Business card back reading: In a fire, seconds count',
          caption: 'In a fire, seconds count',
        },
        {
          src: '/works/redcross/cards/3-back-fire-waits.webp',
          alt: 'Business card back reading: Fire waits for no one, and neither should you',
          caption: 'Fire waits for no one, and neither should you',
        },
        {
          src: '/works/redcross/cards/4-back-warning.webp',
          alt: 'Business card back reading: Your only warning',
          caption: 'Your only warning',
        },
        {
          src: '/works/redcross/cards/5-back-alarm.webp',
          alt: "Business card back reading: Fire doesn't discriminate, neither should your alarm",
          caption: "Fire doesn't discriminate, neither should your alarm",
        },
      ],
    },
  },
  {
    name: 'Unopened Letter',
    href: '/works/unopenedletter',
    roles: ['Copywriting', 'A/B Testing', 'Music Marketing'],
    blurb:
      "Music video campaign for pianist and composer Nicholas Jimenez's single, positioning the track as a soundtrack for the listener's own memories.",
    srcTag: 'A/B tested headlines',
    featuredVariant: 'small',
    caps: true,
    featured: [
      'A new piano sound for those days that feel like memories',
      'The definitive soundtrack for those days that feel like memories',
    ],
    secondary:
      'A/B testing made the call on which one to lead with. Both were deployed.',
    shot: {
      src: '/works/unopenedletter/art/3-final.webp',
      alt: 'Unopened Letter cover art, a wax-sealed paper envelope photographed in warm light',
      caption: 'Final cover art.',
    },
  },
  {
    name: 'Dutch Bros',
    href: '/works/dutchbros',
    roles: ['Strategy', 'Research', 'Concept Development', 'Copywriting (Speculative)'],
    blurb:
      "Speculative brand positioning project reframing Dutch Bros' value and quality perception to win over discerning coffee drinkers without losing its core identity.",
    featured: ['Not So Serious, On Purpose.'],
    secondary: "Good coffee doesn't have to be serious to be taken seriously.",
    ladder: DUTCH_LADDER,
  },
  {
    name: 'American Artists Project · Impact Report',
    href: '/works/americanartistproject',
    roles: ['Copywriting', 'Data Storytelling', 'Nonprofit Marketing'],
    blurb:
      "Independently researched, structured, and wrote AAP's 24-hour donor impact report, turning grant and program data into a case for continued giving.",
    featuredVariant: 'small',
    featured: [
      "AAP isn't just for artists; it's for their families, their audiences, their communities.",
      "Nothing speaks to AAP's impact better than the voices of the artists whose lives have been changed.",
      'Your support truly uplifts lives and fuels artistic journeys, one artist at a time.',
    ],
    shot: {
      src: '/works/aap/impact-report/03.webp',
      alt: 'Grant Impact spread from the 24-hour impact report, statistics beside an artist testimonial',
      caption: 'Grant Impact spread, 24-hour report.',
    },
  },
  {
    name: 'American Artists Project · Travel Guide',
    href: '/works/americanartistproject',
    roles: ['Copywriting', 'Editorial', 'Hospitality Voice'],
    blurb:
      "Independently researched, wrote, and designed a 12-page donor travel guide for AAP's Portland, Maine event weekend, cover to cover in one consistent voice, including a repeatable write-up format (name, descriptor, atmosphere note, tip) for every hotel, restaurant, and stop.",
    featuredVariant: 'small',
    lineTags: [
      null,
      null,
      'Harbor Candy Shop write-up',
      'Portland Head Light write-up',
      'Blind Tiger hotel write-up',
    ],
    featured: [
      'Portland punches above its weight in culinary delights.',
      'Craving some culture?',
      'Stepping inside feels like entering a European chocolatier.',
      'This is a prime spot for a picnic – Fort Williams has picnic tables, old fort ruins, and even a seasonal lobster roll truck if you get hungry.',
      'An intimate boutique inn occupying two restored 19th-century mansions in the West End. Each house features eclectic decor and cozy common lounges.',
    ],
    shot: {
      src: '/works/aap/travel-guide/06.webp',
      alt: 'Where to Stay spread from the Portland travel guide, boutique hotels with photos and write-ups',
      caption: 'Where to Stay spread, Portland travel guide.',
    },
  },
]

function FeaturedBlock({ m }: { m: Module }) {
  if (!m.featured) return null
  const cls = [
    s.featured,
    m.featuredVariant === 'small' ? s.featuredSm : '',
    m.featuredVariant === 'series' ? s.featuredSeries : '',
  ]
    .filter(Boolean)
    .join(' ')
  const lineCls = [s.featuredLine, m.caps ? s.featuredCaps : ''].filter(Boolean).join(' ')

  return (
    <div className={cls}>
      {m.featured.map((line, i) => (
        <Fragment key={i}>
          {m.lineTags?.[i] && (
            <p className={`${s.srcTag} ${i > 0 ? s.srcTagGap : ''}`}>{m.lineTags[i]}</p>
          )}
          <p className={lineCls}>{line}</p>
        </Fragment>
      ))}
    </div>
  )
}

function Animations({ items }: { items: AnimationItem[] }) {
  return (
    <div className={s.anims}>
      {items.map((a) => (
        <div key={a.label} className={s.animGroup}>
          <p className={s.animLabel}>{a.label}</p>
          <p className={s.animLine}>{a.line}</p>
          <p className={s.animSocialLabel}>Social caption</p>
          <p className={s.animSocial}>{a.social}</p>
        </div>
      ))}
    </div>
  )
}

export default function Book() {
  return (
    <PageTransition>
      <article className={s.root}>
        <header className={`${s.wrap} ${s.hero}`}>
          <Reveal>
            <p className={s.kicker}>Book</p>
          </Reveal>
          <Reveal>
            <h1 className={s.heroLead}>Selected copy, front and center.</h1>
          </Reveal>
          <Reveal>
            <p className={s.heroSub}>
              Four campaigns in one scroll. The featured writing is the point here. The full
              case studies live under Works.
            </p>
          </Reveal>
        </header>

        {MODULES.map((m) => {
          const hasAside = Boolean(m.shot || m.ladder || m.slideshow)
          return (
            <section key={m.name} className={`${s.wrap} ${s.module}`}>
              <Reveal>
                <div className={hasAside ? s.moduleGrid : undefined}>
                  <div className={s.moduleMain}>
                    <h2 className={s.name}>{m.name}</h2>
                    <div className={s.roles}>
                      {m.roles.map((r) => (
                        <span key={r} className={s.role}>
                          {r}
                        </span>
                      ))}
                    </div>
                    <p className={s.blurb}>{m.blurb}</p>

                    {m.srcTag && <p className={s.srcTag}>{m.srcTag}</p>}

                    {m.animations ? (
                      <Animations items={m.animations} />
                    ) : (
                      <FeaturedBlock m={m} />
                    )}

                    {m.secondary && <p className={s.secondary}>{m.secondary}</p>}
                  </div>

                  {hasAside && (
                    <div className={s.moduleAside}>
                      {m.shot && (
                        <figure className={s.shot}>
                          <img
                            src={m.shot.src}
                            alt={m.shot.alt}
                            loading="lazy"
                            decoding="async"
                          />
                          <figcaption className={s.shotCaption}>{m.shot.caption}</figcaption>
                        </figure>
                      )}
                      {m.ladder && (
                        <div className={s.ladderWrap}>
                          <PriceLadder def={m.ladder} bare narrow />
                        </div>
                      )}
                      {m.slideshow && (
                        <div className={s.slideshowBlock}>
                          <p className={s.asideLabel}>{m.slideshow.label}</p>
                          <Slideshow
                            slides={m.slideshow.slides}
                            aspect={m.slideshow.aspect}
                            fit="contain"
                            compact
                            autoplayMs={3000}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Link to={m.href} viewTransition className={s.csLink}>
                  Read the case study
                  <span className={s.arrow} aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </Reveal>
            </section>
          )
        })}
      </article>
    </PageTransition>
  )
}
