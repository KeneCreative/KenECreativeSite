import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import PageTransition from '@/components/PageTransition'
import s from './about.module.css'

/** A slice of what's on rotation — the full listening history lives in the Archive. */
const ROTATION = [
  { work: 'Concerto for 4 Violins & Cello in B Minor, RV 580', artist: 'Café Zimmermann' },
  { work: 'Gershwin Song Suite: I. Fascinating Rhythm', artist: 'Daniel Hope / Marcus Roberts Trio' },
  { work: 'Violin Concerto in A Minor, Op. 3 No. 6: I. Allegro', artist: 'Brecon Baroque & Rachel Podger' },
  { work: 'String Quartet No. 16 in F Major, Op. 135', artist: 'Tokyo String Quartet' },
  { work: 'String Quintet in C Major, D. 956: I. Allegro', artist: 'Borodin Quartet' },
  { work: 'Symphony No. 9 in D Minor, "Choral": I. Allegro', artist: 'Vienna Philharmonic & Leonard Bernstein' },
  { work: 'Concerto for 4 Violins: III. Allegro', artist: 'Café Zimmermann' },
  { work: 'String Quartet No. 14 in C-Sharp Minor, Op. 131', artist: 'Tokyo String Quartet' },
  { work: 'Gershwin Song Suite: II. Summertime', artist: 'Daniel Hope / Marcus Roberts Trio' },
  { work: 'Sonata in F Minor, BWV 1018: II. Allegro', artist: 'Andrew Manze & Richard Egarr' },
  { work: 'Violin Concerto in A Minor: III. Presto', artist: 'Brecon Baroque & Rachel Podger' },
  { work: 'Symphony No. 7 in A Major: I. Poco sostenuto', artist: 'Vienna Philharmonic & Carlos Kleiber' },
  { work: 'Violin Concerto in D Major, Op. 61: III. Rondo', artist: 'Perlman & Giulini' },
  { work: 'Sonata in C Minor, BWV 1017: IV. Allegro', artist: 'Andrew Manze & Richard Egarr' },
  { work: 'Symphony No. 9: II. Molto vivace', artist: 'Vienna Philharmonic & Leonard Bernstein' },
  { work: 'String Quartet No. 15 in A Minor, Op. 132', artist: 'Tokyo String Quartet' },
  { work: 'Violin Concerto in A Minor, RV 356: I. Allegro', artist: 'Israel Philharmonic & Itzhak Perlman' },
  { work: 'String Quartet No. 13: IV. Alla danza tedesca', artist: 'Tokyo String Quartet' },
]

const APPLE_MUSIC = 'https://music.apple.com/fi/playlist/replay-2026/pl.rp-v2RRuddY5BJ'

export default function About() {
  const reduce = useReducedMotion()
  return (
    <PageTransition>
      <article className={s.root}>
        <motion.div
          className={s.card}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={s.grid}>
            {/* Left: bio, portrait, philosophy */}
            <div className={s.main}>
              <section>
                <p className={s.kicker}>Introduction</p>
                <h1 className={s.lead}>
                  I&rsquo;m Kenneth Espinoza. My friends call me Ken
                  <span className={s.dim}>ny</span>E.
                </h1>
                <p className={s.leadBody}>
                  Copywriter, creative strategist, and UT Austin Advertising graduate. I believe
                  in clarity, cleverness, and truth. If you give me your attention, I&rsquo;m
                  going to earn it, whether that&rsquo;s a tagline or a whole campaign.
                </p>
              </section>

              <figure className={s.portrait}>
                <img src="/about/portrait.webp" alt="Kenneth Espinoza" loading="lazy" decoding="async" />
                <figcaption>
                  <span>Fig. 01</span>
                  <span>Austin, TX</span>
                </figcaption>
              </figure>

              <section className={s.philosophy}>
                <p className={s.kicker}>My philosophy</p>
                <blockquote className={s.quote}>&ldquo;To do is to be.&rdquo;</blockquote>
                <p className={s.body}>
                  There is no waiting period to become the person you want to be. The second you
                  start doing the work and putting in effort, you already are that person. The
                  flip side is just as real: you cannot claim to be someone without backing it up
                  with action.
                </p>
              </section>

              <section>
                <h2 className={s.h3}>The mindset</h2>
                <p className={s.body}>
                  This site is a reflection of that. Whether you&rsquo;re here to hire me,
                  collaborate, or just get inspired, welcome. Hope you find something that makes
                  you feel something.
                </p>
              </section>
            </div>

            {/* Right: status + rotation ledger */}
            <aside className={s.side}>
              <div className={s.field}>
                <p className={s.kicker}>Current status</p>
                <p className={s.status}>
                  <span className={s.dot} aria-hidden="true" />
                  Available for creative roles
                </p>
              </div>

              <div className={s.field}>
                <p className={s.kicker}>Primary focus</p>
                <p className={s.focus}>Brand strategy, copywriting, digital experience</p>
              </div>

              <div className={s.ledger}>
                <div className={s.ledgerHead}>
                  <span>Current rotation</span>
                  <span className={s.ledgerTag}>Active index</span>
                </div>
                <ol className={s.ledgerList}>
                  {ROTATION.map((t, i) => (
                    <li
                      key={`${t.artist}-${t.work}`}
                      className={`${s.ledgerItem} ${i === 0 ? s.ledgerItemNow : ''}`}
                    >
                      <span className={s.ledgerArtist}>{t.artist}</span>
                      <span className={s.ledgerWork}>{t.work}</span>
                    </li>
                  ))}
                </ol>
                <div className={s.ledgerFoot}>
                  <span>Austin strategy desk</span>
                  <a href={APPLE_MUSIC} target="_blank" rel="noopener noreferrer">
                    Apple Music ↗
                  </a>
                </div>
              </div>

              <Link to="/musicdashboard" viewTransition className={s.dashLink}>
                Eight years of tunes ↗
              </Link>

              <div className={s.sideFoot}>
                <span>Austin, Texas</span>
                <span>KenE Creative</span>
              </div>
            </aside>
          </div>
        </motion.div>
      </article>
    </PageTransition>
  )
}
