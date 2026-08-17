import { events, site } from 'virtual:content'

/**
 * Every route the build should emit static HTML for.
 * `/404` is written to `404.html` rather than `404/index.html` — see
 * `scripts/prerender.js` — because that is the file Cloudflare looks for.
 */
export const routesToPrerender: string[] = [
  '/',
  ...events.map((event) => event.path),
  '/404',
]

/** Canonical site origin, used when writing sitemap.xml. */
export const siteUrl: string = site.url
