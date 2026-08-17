import { events, site } from 'virtual:content'
import type { Chapter, EventEntry, Site } from 'virtual:content'

export { events, site }
export type { Chapter, EventEntry, Site }

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

/**
 * The event shown in the "Latest recap" band: an explicitly `featured: true`
 * event if one exists, otherwise the most recent event that has recap copy.
 */
export const latestRecap: EventEntry | undefined =
  events.find((event) => event.featured) ?? events.find((event) => event.hasRecap)

export function chapterById(id: string | null) {
  if (!id) return undefined
  return site.chapters.find((chapter) => chapter.id === id)
}
