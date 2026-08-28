import type Lenis from 'lenis'

let instance: Lenis | null = null

export function setLenis(l: Lenis | null) {
  instance = l
}

/** Jump to the top of the page, working with or without Lenis active. */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}
