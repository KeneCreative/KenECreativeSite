import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import CountUp from '@/components/CountUp'
import Filmstrip from '@/components/Filmstrip/Filmstrip'
import Slideshow from '@/components/Slideshow/Slideshow'
import StatDial from '@/components/StatDial'
import TiltCard from '@/components/TiltCard/TiltCard'
import AnimationSeries from '@/components/AnimationSeries/AnimationSeries'
import CraftStats from '@/components/CraftStats/CraftStats'
import AlbumEvolution from '@/components/AlbumEvolution/AlbumEvolution'
import VideoTheater from '@/components/VideoTheater/VideoTheater'
import ResultsTimeline from '@/components/ResultsTimeline/ResultsTimeline'
import PriceLadder from '@/components/PriceLadder/PriceLadder'
import Executions from '@/components/Executions/Executions'
import FourCs from '@/components/FourCs/FourCs'
import MarketLeader from '@/components/MarketLeader/MarketLeader'
import { useMediaQuery } from '@/lib/useMediaQuery'
import {
  CASE_STUDIES,
  CASE_STUDY_SLUGS,
  type Artefact,
  type GalleryDef,
  type Media,
  type Stat,
  type TiltCardsDef,
} from './caseStudies'
import s from './caseStudy.module.css'
import w from './works.module.css'

const FIELD = { 1: w.field1, 2: w.field2, 3: w.field3, 4: w.field4 } as const
const NUMERALS = ['I', 'II', 'III', 'IV'] as const

/** open.spotify.com/track/ID -> the dark embed player URL for that track. */
const spotifyEmbed = (url: string) =>
  `${url.replace('open.spotify.com/', 'open.spotify.com/embed/').split('?')[0]}?theme=0`

function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function MediaRow({ media }: { media: Media[] }) {
  return (
    <div className={s.mediaRow} data-count={media.length}>
      {media.map((m) => (
        <figure key={m.image} className={s.figure}>
          <img src={m.image} alt={m.alt} loading="lazy" decoding="async" />
          {m.caption && <figcaption>{m.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}

function TiltCards({ def }: { def: TiltCardsDef }) {
  // On narrow screens the four back cards become a slideshow (top one visible).
  const narrow = useMediaQuery('(max-width: 720px)')
  return (
    <div className={s.cardsBlock}>
      <div className={s.galleryHead}>
        <h3 className={s.galleryTitle}>{def.title}</h3>
        {def.lead && <p className={s.galleryLead}>{def.lead}</p>}
      </div>
      {def.hero && (
        <div className={s.cardHero}>
          <TiltCard {...def.hero} />
        </div>
      )}
      {narrow ? (
        <Slideshow
          slides={def.items.map((c) => ({ src: c.src, alt: c.alt, caption: c.caption }))}
          fit="contain"
          aspect="16 / 9"
        />
      ) : (
        <div className={s.cardRow}>
          {def.items.map((c) => (
            <TiltCard key={c.src} {...c} />
          ))}
        </div>
      )}
    </div>
  )
}

function Gallery({ def }: { def: GalleryDef }) {
  return (
    <div className={s.gallery}>
      <div className={s.galleryHead}>
        <h3 className={s.galleryTitle}>{def.title}</h3>
        {def.lead && <p className={s.galleryLead}>{def.lead}</p>}
      </div>
      <ol className={s.galleryList}>
        {def.items.map((it, i) => (
          <li key={it.src} className={s.galleryItem}>
            <span className={s.galleryNo}>{String(i + 1).padStart(2, '0')}</span>
            <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
            <span className={s.galleryCaption}>{it.caption}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function MovementHeader({ n, title }: { n: number; title: string }) {
  return (
    <Reveal>
      <div className={s.movementHead}>
        <span className={s.numeral}>{NUMERALS[n]}</span>
        <h2 className={s.movementTitle}>{title}</h2>
      </div>
    </Reveal>
  )
}

function KineticLine({ text, emphasis }: { text: string; emphasis: string }) {
  const reduce = useReducedMotion()
  const idx = text.indexOf(emphasis)
  const before = idx >= 0 ? text.slice(0, idx) : text
  const after = idx >= 0 ? text.slice(idx + emphasis.length) : ''

  const tokens: { t: string; em?: boolean }[] = []
  before.split(/(\s+)/).forEach((p) => p && tokens.push({ t: p }))
  if (idx >= 0) tokens.push({ t: emphasis, em: true })
  after.split(/(\s+)/).forEach((p) => p && tokens.push({ t: p }))

  let wordN = 0
  return (
    <p className={s.kinetic}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok.t)) return <span key={i}> </span>
        const delay = wordN++ * 0.05
        return (
          <motion.span
            key={i}
            className={s.word}
            initial={reduce ? false : { opacity: 0, y: '0.5em' }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
          >
            {tok.em ? <em>{tok.t}</em> : tok.t}
          </motion.span>
        )
      })}
    </p>
  )
}

function StatCell({ stat }: { stat: Stat }) {
  return (
    <div className={s.stat}>
      <span className={s.statValue}>
        <CountUp
          to={stat.value}
          decimals={stat.decimals}
          comma={stat.format === 'comma'}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
      </span>
      <span className={s.statLabel}>{stat.label}</span>
      {stat.sub && <span className={s.statSub}>{stat.sub}</span>}
    </div>
  )
}

function ArtefactTile({ item }: { item: Artefact }) {
  // A stack of small images inside one tile (label sits above the stack).
  if (item.images) {
    return (
      <div className={`${s.artefact} ${s.artefactStackTile}`}>
        <span className={s.artefactStackMeta}>
          <span className={s.artefactLabel}>{item.label}</span>
          {item.note && <span className={s.artefactNote}>{item.note}</span>}
        </span>
        <span className={s.artefactStack}>
          {item.images.map((src) => (
            <img key={src} src={src} alt={item.label} loading="lazy" decoding="async" />
          ))}
        </span>
      </div>
    )
  }

  const inner = (
    <>
      {item.image ? (
        <img className={s.artefactImg} src={item.image} alt={item.label} loading="lazy" decoding="async" />
      ) : (
        <span className={`${s.artefactField} ${FIELD[item.field]}`} aria-hidden="true" />
      )}
      <span className={s.artefactScrim} aria-hidden="true" />
      <span className={s.artefactMeta}>
        <span className={s.artefactLabel}>{item.label}</span>
        {item.pending === 'video' ? (
          <span className={s.artefactNote}>Video, hosting pending</span>
        ) : (
          item.note && <span className={s.artefactNote}>{item.note}</span>
        )}
      </span>
    </>
  )

  if (item.href) {
    return (
      <a className={s.artefact} href={item.href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return <div className={s.artefact}>{inner}</div>
}

export default function CaseStudy() {
  const { slug = '' } = useParams()
  const cs = CASE_STUDIES[slug]

  if (!cs) {
    return (
      <PageTransition>
        <div className={s.wrap} style={{ paddingTop: '30vh', paddingBottom: '30vh' }}>
          <p className={s.craftKicker}>Not found</p>
          <h1 className={s.heroTitle} style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            No such case study
          </h1>
          <Link to="/works" className={s.backLink}>
            Back to Works
          </Link>
        </div>
      </PageTransition>
    )
  }

  const nextIdx = (CASE_STUDY_SLUGS.indexOf(slug) + 1) % CASE_STUDY_SLUGS.length
  const next = CASE_STUDIES[CASE_STUDY_SLUGS[nextIdx]]

  return (
    <PageTransition>
      <article className={s.root}>
        {/* hero */}
        <header className={`${s.wrap} ${s.hero}`}>
          <div className={s.disciplines}>
            {cs.disciplines.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <h1 className={s.heroTitle}>{cs.title}</h1>
          <p className={s.role}>{cs.brief.role}</p>
        </header>

        {/* Movement I — Brief */}
        <section className={`${s.wrap} ${s.movement}`}>
          <MovementHeader n={0} title="Brief" />
          <Reveal>
            <KineticLine
              text={cs.brief.strategyLine.text}
              emphasis={cs.brief.strategyLine.emphasis}
            />
          </Reveal>

          {(cs.brief.portrait || cs.audio) && (
            <Reveal>
              <div className={s.briefAside}>
                {cs.brief.portrait && (
                  <figure className={s.portrait}>
                    <img
                      src={cs.brief.portrait.image}
                      alt={cs.brief.portrait.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    {cs.brief.portrait.caption && <figcaption>{cs.brief.portrait.caption}</figcaption>}
                  </figure>
                )}
                {cs.audio && (
                  <div className={s.audio}>
                    <span className={s.audioLabel}>{cs.audio.label}</span>
                    {cs.audio.spotify ? (
                      <iframe
                        className={s.spotifyEmbed}
                        src={spotifyEmbed(cs.audio.spotify)}
                        title={`${cs.audio.label} on Spotify`}
                        loading="lazy"
                        allow="encrypted-media; clipboard-write"
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    ) : (
                      cs.audio.src && <audio controls preload="none" src={cs.audio.src} />
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {cs.brief.triad && (
            <Reveal>
              <div className={s.triad}>
                <div className={s.triadCell}>
                  <h3>Challenge</h3>
                  <p>{cs.brief.triad.challenge}</p>
                </div>
                <div className={s.triadCell}>
                  <h3>Insight</h3>
                  <p>{cs.brief.triad.insight}</p>
                </div>
                <div className={s.triadCell}>
                  <h3>Strategy</h3>
                  <p>{cs.brief.triad.strategy}</p>
                </div>
              </div>
            </Reveal>
          )}
        </section>

        {/* Movement II — Craft */}
        <section className={`${s.wrap} ${s.movement}`}>
          <MovementHeader n={1} title="Craft" />
          {cs.craft.map((sec) => (
            <Reveal key={sec.title}>
              <div className={s.craftSection}>
                <div>
                  <p className={s.craftKicker}>{sec.kicker}</p>
                  <h3 className={s.craftTitle}>{sec.title}</h3>
                  <div className={s.craftBody}>
                    {sec.body.map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </div>
                <div className={s.craftAside}>
                  {sec.pullQuote && <p className={s.pullQuote}>{sec.pullQuote}</p>}
                  {sec.marketLeader && <MarketLeader {...sec.marketLeader} />}
                  {sec.fieldNotes && (
                    <figure className={s.fieldNotes}>
                      <figcaption className={s.fieldNotesHead}>
                        <span>{sec.fieldNotes.label ?? 'Field notes'}</span>
                        {sec.fieldNotes.ref && (
                          <span className={s.fieldNotesRef}>Ref {sec.fieldNotes.ref}</span>
                        )}
                      </figcaption>
                      {sec.fieldNotes.quotes.map((q) => (
                        <blockquote key={q.attribution} className={s.fieldNote}>
                          <p>{q.text}</p>
                          <cite>{q.attribution}</cite>
                        </blockquote>
                      ))}
                    </figure>
                  )}
                  {sec.stats && <CraftStats items={sec.stats} />}
                  {sec.finalCopy && (
                    <div className={s.finalCopy}>
                      {sec.finalCopy.title && (
                        <p className={s.finalCopyTitle}>{sec.finalCopy.title}</p>
                      )}
                      <ul>
                        {sec.finalCopy.items.map((it, k) => (
                          <li key={k}>
                            {it.header && <span className={s.finalCopyHeader}>{it.header}</span>}
                            <span className={s.finalCopyText}>{it.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {sec.media && <MediaRow media={sec.media} />}
                </div>
                {sec.ladder && (
                  <div className={s.craftWide}>
                    <PriceLadder def={sec.ladder} />
                  </div>
                )}
                {sec.fourCs && (
                  <div className={s.craftWide}>
                    <FourCs def={sec.fourCs} />
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </section>

        {/* Movement III — Deliverables */}
        <section className={`${s.wrap} ${s.movement} ${s.deliverables}`}>
          <MovementHeader n={2} title={cs.artefacts.title} />
          {cs.artefacts.lead && (
            <Reveal>
              <p className={s.resultsIntro}>{cs.artefacts.lead}</p>
            </Reveal>
          )}

          {cs.artefacts.animationSeries && (
            <Reveal>
              <div className={s.showBlockWide}>
                <div className={s.galleryHead}>
                  <h3 className={s.galleryTitle}>{cs.artefacts.animationSeries.title}</h3>
                  {cs.artefacts.animationSeries.lead && (
                    <p className={s.galleryLead}>{cs.artefacts.animationSeries.lead}</p>
                  )}
                </div>
                <AnimationSeries tabs={cs.artefacts.animationSeries.tabs} />
              </div>
            </Reveal>
          )}

          {cs.artefacts.albumEvolution && (
            <Reveal>
              <div className={s.showBlockWide}>
                <div className={s.galleryHead}>
                  <h3 className={s.galleryTitle}>{cs.artefacts.albumEvolution.title}</h3>
                  {cs.artefacts.albumEvolution.lead && (
                    <p className={s.galleryLead}>{cs.artefacts.albumEvolution.lead}</p>
                  )}
                </div>
                <AlbumEvolution steps={cs.artefacts.albumEvolution.steps} />
              </div>
            </Reveal>
          )}

          {cs.artefacts.videoTheater && (
            <Reveal>
              <div className={s.showBlockWide}>
                <div className={s.galleryHead}>
                  <h3 className={s.galleryTitle}>{cs.artefacts.videoTheater.title}</h3>
                  {cs.artefacts.videoTheater.lead && (
                    <p className={s.galleryLead}>{cs.artefacts.videoTheater.lead}</p>
                  )}
                </div>
                <VideoTheater cuts={cs.artefacts.videoTheater.cuts} />
              </div>
            </Reveal>
          )}

          {cs.artefacts.executions && (
            <Reveal>
              <div className={s.showBlockWide}>
                <div className={s.galleryHead}>
                  <h3 className={s.galleryTitle}>{cs.artefacts.executions.title}</h3>
                  {cs.artefacts.executions.lead && (
                    <p className={s.galleryLead}>{cs.artefacts.executions.lead}</p>
                  )}
                </div>
                <Executions items={cs.artefacts.executions.items} />
              </div>
            </Reveal>
          )}

          {cs.artefacts.tiltCards && (
            <Reveal>
              <TiltCards def={cs.artefacts.tiltCards} />
            </Reveal>
          )}

          {cs.artefacts.filmstrips && (
            <div className={s.filmstripGrid}>
              {cs.artefacts.filmstrips.map((f) => (
                <Reveal key={f.title}>
                  <Filmstrip
                    title={f.title}
                    openLabel={f.openLabel}
                    meta={f.meta}
                    cover={f.cover}
                    tight={f.tight}
                    slides={f.slides}
                  />
                </Reveal>
              ))}
            </div>
          )}

          {cs.artefacts.gallery && (
            <Reveal>
              <Gallery def={cs.artefacts.gallery} />
            </Reveal>
          )}

          {cs.artefacts.slideshow && (
            <Reveal>
              <div className={s.showBlock}>
                <div className={s.galleryHead}>
                  <h3 className={s.galleryTitle}>{cs.artefacts.slideshow.title}</h3>
                  {cs.artefacts.slideshow.lead && (
                    <p className={s.galleryLead}>{cs.artefacts.slideshow.lead}</p>
                  )}
                </div>
                <Slideshow
                  slides={cs.artefacts.slideshow.slides}
                  fit={cs.artefacts.slideshow.fit}
                  aspect={cs.artefacts.slideshow.aspect}
                />
              </div>
            </Reveal>
          )}

          {cs.artefacts.items && (
            <>
              <div className={s.artefactRow}>
                {cs.artefacts.items.map((a) => (
                  <ArtefactTile key={a.label} item={a} />
                ))}
              </div>
              <p className={s.artefactCaption}>Drag or scroll to move through the deliverables</p>
            </>
          )}
        </section>

        {/* Movement IV — Results */}
        <section className={`${s.wrap} ${s.movement}`}>
          <MovementHeader n={3} title="Results" />
          <Reveal>
            <p className={s.resultsIntro}>{cs.results.intro}</p>
          </Reveal>
          {cs.results.stats && cs.results.stats.length > 0 && (
            <Reveal>
              <div className={s.statGrid}>
                {cs.results.stats.map((st) => (
                  <StatCell key={st.label} stat={st} />
                ))}
              </div>
            </Reveal>
          )}

          {cs.results.verdict && (
            <Reveal>
              <figure className={s.verdict}>
                <figcaption className={s.verdictHead}>
                  <span className={s.verdictDot} aria-hidden="true" />
                  Closing field note
                </figcaption>
                <h3 className={s.verdictTitle}>{cs.results.verdict.title}</h3>
                {cs.results.verdict.body.map((para, k) => (
                  <p key={k} className={s.verdictBody}>
                    {para}
                  </p>
                ))}
                {(cs.results.verdict.sign || cs.results.verdict.ref) && (
                  <p className={s.verdictSign}>
                    {cs.results.verdict.sign}
                    {cs.results.verdict.ref && (
                      <span className={s.verdictRef}>Archive {cs.results.verdict.ref}</span>
                    )}
                  </p>
                )}
              </figure>
            </Reveal>
          )}

          {cs.results.timeline && (
            <Reveal>
              <div className={s.showBlockWide}>
                <div className={s.galleryHead}>
                  <h3 className={s.galleryTitle}>{cs.results.timeline.title}</h3>
                  {cs.results.timeline.lead && (
                    <p className={s.galleryLead}>{cs.results.timeline.lead}</p>
                  )}
                </div>
                <ResultsTimeline
                  points={cs.results.timeline.points}
                  start={cs.results.timeline.start}
                />
              </div>
            </Reveal>
          )}

          {cs.results.dials && (
            <Reveal>
              <div className={s.dialGrid}>
                {cs.results.dials.map((d) => (
                  <StatDial
                    key={d.label}
                    value={d.value}
                    display={d.display}
                    label={d.label}
                    sub={d.sub}
                  />
                ))}
              </div>
            </Reveal>
          )}

          {cs.results.comparison && (
            <Reveal>
              <figure className={s.comparison}>
                <div className={s.comparisonPair}>
                  {[cs.results.comparison.before, cs.results.comparison.after].map((m) => (
                    <div key={m.image} className={s.comparisonItem}>
                      <img src={m.image} alt={m.alt} loading="lazy" decoding="async" />
                      {m.caption && <figcaption>{m.caption}</figcaption>}
                    </div>
                  ))}
                </div>
                {cs.results.comparison.caption && (
                  <figcaption className={s.comparisonNote}>
                    {cs.results.comparison.caption}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          )}

          {cs.results.media && (
            <Reveal>
              <MediaRow media={cs.results.media} />
            </Reveal>
          )}
          {cs.results.note && (
            <Reveal>
              <p className={s.resultsNote}>{cs.results.note}</p>
            </Reveal>
          )}
        </section>

        {/* next */}
        <div className={s.wrap}>
          <div className={s.nextRow}>
            <Link to="/works" className={s.backLink}>
              All works
            </Link>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                alignItems: 'flex-end',
              }}
            >
              <span className={s.nextLabel}>Next</span>
              <Link to={`/works/${next.slug}`} viewTransition className={s.nextLink}>
                {next.title}
              </Link>
            </span>
          </div>
        </div>
      </article>
    </PageTransition>
  )
}
