/**
 * Generates public/og-cover.png — the 1200x630 social share card.
 * Run: node scripts/gen-og.mjs
 */
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const W = 1200
const H = 630
const ivory = '#f4f1ea'
const brass = '#f2b44b'
const dim = '#8a8783'

const staffY = 250
const staff = [0, 1, 2, 3, 4]
  .map(
    (i) =>
      `<line x1="90" y1="${staffY + i * 26}" x2="1110" y2="${staffY + i * 26}" stroke="${ivory}" stroke-opacity="0.09" stroke-width="2"/>`,
  )
  .join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0b0b0d"/>
  ${staff}
  <rect x="0" y="0" width="${W}" height="6" fill="${brass}"/>
  <text x="92" y="118" fill="${dim}" font-family="Georgia, 'Times New Roman', serif" font-size="25" letter-spacing="7">KENE CREATIVE</text>
  <text x="88" y="352" fill="${ivory}" font-family="Georgia, 'Times New Roman', serif" font-size="98" font-weight="700">Kenneth Espinoza</text>
  <text x="92" y="424" fill="${brass}" font-family="Georgia, 'Times New Roman', serif" font-size="38" font-style="italic">Creative Strategist &amp; Copywriter</text>
  <text x="92" y="556" fill="${dim}" font-family="Georgia, serif" font-size="25" letter-spacing="2">Austin, Texas &#183; kenecreative.com</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile(root + 'public/og-cover.png')

console.log('wrote public/og-cover.png')
