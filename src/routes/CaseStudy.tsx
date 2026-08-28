import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import CountUp from '@/components/CountUp'
import { CASE_STUDIES, CASE_STUDY_SLUGS, type Stat } from './caseStudies'
import s from './caseStudy.module.css'
import w from './works.module.css'

const FIELD = { 1: w.field1, 2: w.field2, 3: w.field3, 4: w.field4 } as const
const NUMERALS = ['I', 'II', 'III', 'IV'] as const

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
                <div>{sec.pullQuote && <p className={s.pullQuote}>{sec.pullQuote}</p>}</div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Movement III — Artefacts */}
        <section className={`${s.wrap} ${s.movement}`}>
          <MovementHeader n={2} title={cs.artefacts.title} />
          <div className={s.artefactRow}>
            {cs.artefacts.items.map((a) => (
              <div key={a.label} className={s.artefact}>
                <span className={`${s.artefactField} ${FIELD[a.field]}`} aria-hidden="true" />
                <span className={s.artefactLabel}>{a.label}</span>
                {a.note && <span className={s.artefactNote}>{a.note}</span>}
              </div>
            ))}
          </div>
          <p className={s.artefactCaption}>Drag or scroll to move through the artefacts</p>
          <p className={s.imgNote}>
            Placeholder tiles. This section needs the real deliverable images and video stills:{' '}
            {cs.artefacts.items.map((a) => a.label).join(', ')}.
          </p>
        </section>

        {/* Movement IV — Results */}
        <section className={`${s.wrap} ${s.movement}`}>
          <MovementHeader n={3} title="Results" />
          <Reveal>
            <p className={s.resultsIntro}>{cs.results.intro}</p>
          </Reveal>
          <Reveal>
            <div className={s.statGrid}>
              {cs.results.stats.map((st) => (
                <StatCell key={st.label} stat={st} />
              ))}
            </div>
          </Reveal>
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
            <span style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
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
