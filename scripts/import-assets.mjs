// Import + optimize case-study media from legacy/Images/ into public/.
// Images -> webp (<= maxW, q80). Audio copied as-is. PDFs are NOT imported
// (guide/report render as in-site filmstrips). Videos handled separately.
//
//   npm run import-assets
import sharp from 'sharp'
import { cp, mkdir, readdir, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'legacy', 'Images')
const OUT = path.join(ROOT, 'public')

const RASTER = new Set(['.png', '.jpg', '.jpeg', '.jfif', '.avif'])

/** [sourceGlobDir, destDir, { rename, maxW }] */
const JOBS = [
  // --- work thumbnails + about portrait ---
  { from: 'Thumbnails of Works/American Artist Project.png', to: 'works/thumbs/americanartistproject.webp', maxW: 1800 },
  { from: 'Thumbnails of Works/American Red Cross.jpg', to: 'works/thumbs/redcross.webp', maxW: 1800 },
  { from: 'Thumbnails of Works/Dutch Bros.avif', to: 'works/thumbs/dutchbros.webp', maxW: 1800 },
  { from: 'Thumbnails of Works/Unopened Letter.jpg', to: 'works/thumbs/unopenedletter.webp', maxW: 1800 },
  { from: 'About Me Portrait.JPG', to: 'about/portrait.webp', maxW: 1200 },

  // --- American Artist Project ---
  { from: 'American Artist Project Files/AAP Logo_Horizontal.png', to: 'works/aap/logo.webp', maxW: 900 },
  { from: 'American Artist Project Files/Amplify austin leader board/2024 Amplify Leaderboard.png', to: 'works/aap/leaderboard-2024.webp', maxW: 1400 },
  { from: 'American Artist Project Files/Amplify austin leader board/2025 Amplify Leaderboard.png', to: 'works/aap/leaderboard-2025.webp', maxW: 1400 },
  { dir: 'American Artist Project Files/Impact report', to: 'works/aap/impact-report', maxW: 1600, seq: /Page (\d+)/ },
  { dir: 'American Artist Project Files/Travel guide', to: 'works/aap/travel-guide', maxW: 1600, seq: /Page_(\d+)/ },
  { from: 'American Artist Project Files/Influencers who came out and posted us/secretAAPinfluencer.PNG', to: 'works/aap/influencer/1-secret-aap.webp', maxW: 900 },
  { from: 'American Artist Project Files/Influencers who came out and posted us/ReggetonAApImfluencer.PNG', to: 'works/aap/influencer/2-reggaeton.webp', maxW: 900 },
  { from: 'American Artist Project Files/Influencers who came out and posted us/Rainbowatxamplify.PNG', to: 'works/aap/influencer/3-rainbow.webp', maxW: 900 },

  // --- Red Cross ---
  { from: 'Redcross Files/Business cards/1 Front - Primary Design.png', to: 'works/redcross/cards/1-front.webp', maxW: 1600 },
  { from: 'Redcross Files/Business cards/2 Back - Seconds Count.png', to: 'works/redcross/cards/2-back-seconds.webp', maxW: 1600 },
  { from: 'Redcross Files/Business cards/3 Back - Fire Waits For No One.png', to: 'works/redcross/cards/3-back-fire-waits.webp', maxW: 1600 },
  { from: 'Redcross Files/Business cards/4 Back - Your Only Warning.png', to: 'works/redcross/cards/4-back-warning.webp', maxW: 1600 },
  { from: 'Redcross Files/Business cards/5 Back - Neither Should Your Alarm.png', to: 'works/redcross/cards/5-back-alarm.webp', maxW: 1600 },
  { dir: 'Redcross Files/Animation series/Dog', to: 'works/redcross/dog', maxW: 1400, seq: /Dog\s+(\d+)/, tagline: /Tagline/ },
  { dir: 'Redcross Files/Animation series/Granny', to: 'works/redcross/granny', maxW: 1400, seq: /Granny\s+(\d+)/, tagline: /Tagline/ },
  { dir: 'Redcross Files/Animation series/Bed Shaker', to: 'works/redcross/bedshaker', maxW: 1400, seq: /Bedshaker\s+(\d+)/, tagline: /Tagline/ },
  { dir: 'Redcross Files/Infographic', to: 'works/redcross/infographic', maxW: 1400, seq: /(\d+)/ },

  // --- Unopened Letter ---
  { from: 'Unopened Letter Files/Album art/Album art 1 Initial.png', to: 'works/unopenedletter/art/1-initial.webp', maxW: 1400 },
  { from: 'Unopened Letter Files/Album art/Album art 2 prototype.png', to: 'works/unopenedletter/art/2-prototype.webp', maxW: 1400 },
  { from: 'Unopened Letter Files/Album art/Album Art 3 Final.jpg', to: 'works/unopenedletter/art/3-final.webp', maxW: 1400 },
  { from: 'Unopened Letter Files/Nick Headshot.jfif', to: 'works/unopenedletter/nick.webp', maxW: 900 },
  { from: 'Unopened Letter Files/Unopened Letter.mp3', to: 'works/unopenedletter/track.mp3' },
]

async function toWebp(src, dst, maxW) {
  await mkdir(path.dirname(dst), { recursive: true })
  const img = sharp(src, { failOn: 'none' })
  const meta = await img.metadata()
  let pipe = img.rotate()
  if (meta.width && meta.width > maxW) pipe = pipe.resize({ width: maxW })
  await pipe.webp({ quality: 80, effort: 5 }).toFile(dst)
  const [a, b] = [(await stat(src)).size, (await stat(dst)).size]
  console.log(`${path.relative(OUT, dst).padEnd(46)} ${(a / 1e6).toFixed(2)} -> ${(b / 1e6).toFixed(2)} MB`)
}

async function copyFile(src, dst) {
  await mkdir(path.dirname(dst), { recursive: true })
  await cp(src, dst)
  console.log(`${path.relative(OUT, dst).padEnd(46)} (copied)`)
}

for (const job of JOBS) {
  if (job.from) {
    const src = path.join(SRC, job.from)
    if (!existsSync(src)) {
      console.warn(`MISSING  ${job.from}`)
      continue
    }
    const dst = path.join(OUT, job.to)
    if (RASTER.has(path.extname(src).toLowerCase())) await toWebp(src, dst, job.maxW ?? 1600)
    else await copyFile(src, dst)
    continue
  }

  // directory job: sequence-numbered images -> NN.webp, tagline -> tagline.webp
  const dir = path.join(SRC, job.dir)
  if (!existsSync(dir)) {
    console.warn(`MISSING DIR  ${job.dir}`)
    continue
  }
  const files = (await readdir(dir)).filter((f) => RASTER.has(path.extname(f).toLowerCase()))
  for (const f of files) {
    const src = path.join(dir, f)
    let name
    if (job.tagline && job.tagline.test(f)) {
      name = 'tagline.webp'
    } else {
      const m = f.match(job.seq)
      if (!m) {
        console.warn(`  skip (no index): ${f}`)
        continue
      }
      name = `${String(Number(m[1])).padStart(2, '0')}.webp`
    }
    await toWebp(src, path.join(OUT, job.to, name), job.maxW ?? 1600)
  }
}

console.log('done')
