// Optimize raster images under public/works/: resize to <=1600px, convert to
// webp q82, delete the source. Run after dropping new PNG/JPGs in.
//   npm run optimize-images
import sharp from 'sharp'
import { readdir, stat, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'works')
const RASTER = new Set(['.png', '.jpg', '.jpeg', '.jfif'])
const MAX_W = 1600

async function walk(dir) {
  const out = []
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name)
    const s = await stat(p)
    if (s.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

const files = await walk(ROOT)
for (const f of files) {
  const ext = path.extname(f).toLowerCase()
  if (!RASTER.has(ext)) continue
  const before = (await stat(f)).size
  const outPath = f.slice(0, -ext.length) + '.webp'
  const img = sharp(f, { failOn: 'none' })
  const meta = await img.metadata()
  let pipe = img
  if (meta.width && meta.width > MAX_W) pipe = pipe.resize({ width: MAX_W })
  await pipe.webp({ quality: 82, effort: 5 }).toFile(outPath)
  const after = (await stat(outPath)).size
  await unlink(f)
  console.log(
    `${path.relative(ROOT, outPath).padEnd(40)} ${(before / 1e6).toFixed(2)}MB -> ${(after / 1e6).toFixed(2)}MB`,
  )
}
console.log('done')
