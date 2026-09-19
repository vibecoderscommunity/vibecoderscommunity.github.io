import { events, site, upcoming } from 'virtual:content'

/**
 * Every route the build should emit static HTML for.
 * `/404` is written to `404.html` rather than `404/index.html` — see
 * `scripts/prerender.js` — because that is the file Cloudflare looks for.
 *
 * Upcoming events keep their page after the date passes, so a link shared
 * before the meetup still resolves afterwards.
 */
export const routesToPrerender: string[] = [
  '/',
  ...upcoming.map((entry) => entry.path),
  ...events.map((event) => event.path),
  '/logo/',
  '/404',
]

/** Canonical site origin, used when writing sitemap.xml. */
export const siteUrl: string = site.url
