import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import s from './about.module.css'

function Reveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** A slice of what's on rotation — the full listening history lives in the Archive. */
const ROTATION = [
  { work: 'Concerto for 4 Violins & Cello in B Minor, RV 580', artist: 'Café Zimmermann' },
  { work: 'Gershwin Song Suite: I. Fascinating Rhythm', artist: 'Daniel Hope / Marcus Roberts Trio' },
  { work: 'Violin Concerto in A Minor, Op. 3 No. 6: I. Allegro', artist: 'Brecon Baroque & Rachel Podger' },
  { work: 'String Quartet No. 16 in F Major, Op. 135', artist: 'Tokyo String Quartet' },
  { work: 'String Quintet in C Major, D. 956: I. Allegro', artist: 'Borodin Quartet' },
  { work: 'Symphony No. 9 in D Minor, "Choral": I. Allegro', artist: 'Vienna Philharmonic & Leonard Bernstein' },
  { work: 'String Quartet No. 14 in C-Sharp Minor, Op. 131', artist: 'Tokyo String Quartet' },
  { work: 'Sonata in F Minor, BWV 1018: II. Allegro', artist: 'Andrew Manze & Richard Egarr' },
  { work: 'Violin Concerto in D Major, Op. 61: III. Rondo', artist: 'Perlman & Giulini' },
]

export default function About() {
  return (
    <PageTransition>
      <article className={s.root}>
        <header className={`${s.wrap} ${s.hero}`}>
          <p className={s.eyebrow}>About</p>
          <h1 className={s.lead}>
            I&rsquo;m Kenneth Espinoza. My friends call me <em>KennyE</em>.
          </h1>
          <p className={s.leadBody}>
            Copywriter, creative strategist, and UT Austin Advertising graduate. I believe in
            clarity, cleverness, and truth. If you give me your attention, I&rsquo;m going to
            earn it, whether that&rsquo;s a tagline or a whole campaign.
          </p>
          <img
            className={s.portrait}
            src="/about/portrait.webp"
            alt="Kenneth Espinoza"
            loading="lazy"
            decoding="async"
          />
        </header>

        <section className={`${s.wrap} ${s.section}`}>
          <Reveal>
            <h2 className={s.sectionKicker}>Philosophy</h2>
            <p className={s.philosophyQuote}>To do is to be.</p>
            <p className={s.body}>
              There is no waiting period to become the person you want to be. The second you
              start doing the work and putting in effort, you already are that person. The flip
              side is just as real: you cannot claim to be someone without backing it up with
              action.
            </p>
            <p className={s.body}>
              This site is a reflection of that. Whether you&rsquo;re here to hire me,
              collaborate, or just get inspired, welcome.
            </p>
          </Reveal>
        </section>

        <section className={`${s.wrap} ${s.section}`}>
          <Reveal>
            <h2 className={s.sectionKicker}>Current status</h2>
            <dl className={s.statusRow}>
              <div className={s.statusItem}>
                <dt>Availability</dt>
                <dd>Open to creative roles</dd>
              </div>
              <div className={s.statusItem}>
                <dt>Primary focus</dt>
                <dd>Brand strategy, copywriting, digital experience</dd>
              </div>
              <div className={s.statusItem}>
                <dt>Based in</dt>
                <dd>Austin, Texas</dd>
              </div>
            </dl>
          </Reveal>
        </section>

        <section className={`${s.wrap} ${s.section}`}>
          <Reveal>
            <div className={s.rotationHead}>
              <h2 className={s.rotationTitle}>On rotation</h2>
              <Link to="/musicdashboard" viewTransition className={s.archiveLink}>
                Eight years in the archive
              </Link>
            </div>
            <ol className={s.rotation}>
              {ROTATION.map((t, i) => (
                <li key={t.work} className={s.track}>
                  <span className={s.trackNo}>{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className={s.trackWork}>{t.work}</span>
                    <br />
                    <span className={s.trackArtist}>{t.artist}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>
      </article>
    </PageTransition>
  )
}
