import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ORIGIN = 'https://www.kenecreative.com'
const DEFAULT_IMAGE = `${ORIGIN}/og-cover.png`

type SeoInput = {
  /** Full <title>. Include the name — that is the term worth ranking for. */
  title: string
  description: string
  /** Route path for the canonical + og:url. Defaults to the current pathname. */
  path?: string
  /** Absolute URL, or a site-root path like "/works/thumbs/x.webp". */
  image?: string
  type?: 'website' | 'article' | 'profile'
  noindex?: boolean
}

function meta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function link(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Per-route document metadata. There is no SSR here, so this runs on the client
 * after mount and updates the tags in place — the static ones in index.html
 * included — which keeps exactly one title / description / canonical rather than
 * stacking a second set the way React's own <title> hoisting would.
 *
 * A crawler that does not run JS still gets the index.html baseline (tuned for
 * the homepage); one that renders gets the per-route values. Prerendering, if it
 * lands later, is what makes these visible without JS on every route.
 */
export function useSeo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
}: SeoInput) {
  const { pathname } = useLocation()
  const routePath = path ?? pathname

  useEffect(() => {
    const url = ORIGIN + (routePath === '/' ? '/' : routePath.replace(/\/+$/, ''))
    const img = !image
      ? DEFAULT_IMAGE
      : image.startsWith('http')
        ? image
        : ORIGIN + image

    document.title = title
    meta('name', 'description', description)
    meta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    link('canonical', url)

    meta('property', 'og:title', title)
    meta('property', 'og:description', description)
    meta('property', 'og:type', type)
    meta('property', 'og:url', url)
    meta('property', 'og:image', img)
    meta('property', 'og:site_name', 'KenE Creative')

    meta('name', 'twitter:card', 'summary_large_image')
    meta('name', 'twitter:title', title)
    meta('name', 'twitter:description', description)
    meta('name', 'twitter:image', img)
  }, [title, description, routePath, image, type, noindex])
}
