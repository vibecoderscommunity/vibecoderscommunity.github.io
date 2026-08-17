import { events, hero, site, upcoming } from 'virtual:content'
import type { Chapter, EventEntry, HeroImage, Site } from 'virtual:content'

export { events, site }
export type { Chapter, EventEntry, HeroImage, Site }

/** Flavour names that resolve to a design-system custom property. */
const FLAVOR_TOKENS = new Set([
  'gold',
  'lime',
  'purple',
  'peach',
  'red-tint',
  'light-navy',
  'light-blue',
  'navy',
  'blue',
])

/**
 * Resolves a frontmatter `flavor` into a CSS colour.
 * Accepts a design-system flavour name (`gold`), a raw value (`#e3c366`) or an
 * already-wrapped custom property (`var(--gold)`).
 */
export function flavorColor(flavor: string | undefined | null): string {
  if (!flavor) return 'var(--paper-2)'
  if (FLAVOR_TOKENS.has(flavor)) return `var(--${flavor})`
  return flavor
}

/** Events, newest first. */
export const allEvents: EventEntry[] = events

export function findEvent(slug: string): EventEntry | undefined {
  return events.find((event) => event.slug === slug)
}

/** Every upcoming event that has a page, past ones included, soonest first. */
export const allUpcoming: EventEntry[] = upcoming

export function findUpcoming(slug: string): EventEntry | undefined {
  return upcoming.find((entry) => entry.slug === slug)
}

/**
 * The events shown in the "Coming up" band — only those still in the future.
 *
 * `past` is stamped when the site is built, so an event drops out of the band
 * on the first deploy after it happens. Its page stays up either way.
 */
export const upcomingEvents: EventEntry[] = upcoming.filter((entry) => !entry.past)

/**
 * Images for the hero rotator.
 *
 * Anything in `src/content/hero/` wins. Until photos are added there, event
 * posters stand in so the hero is never empty.
 */
export const heroImages: HeroImage[] = hero.length
  ? hero
  : events
      .filter((event) => event.poster)
      .map((event) => ({ src: event.poster as string, caption: event.title }))

export function chapterById(id: string | null) {
  if (!id) return undefined
  return site.chapters.find((chapter) => chapter.id === id)
}
