/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

/**
 * Generated at build time by `scripts/content-plugin.js` from `src/content/`.
 */
declare module 'virtual:content' {
  export interface EventEntry {
    slug: string
    date: string
    title: string
    /** The mono line under the title. Defaults to `FRI, SEP 11 · TOKYO`,
     *  derived from `date` and `chapter`; frontmatter overrides it to add a
     *  time or venue. */
    meta: string
    chapter: string | null
    flavor: string
    eyebrow: string
    tags: string[]
    blurb: string
    summary: string
    /** lu.ma event page. Always set on `upcoming`; optional on `events`. */
    luma: string | null
    poster: string | null
    photos: string[]
    html: string
    /** Whether the date has passed, evaluated at build time. */
    past: boolean
    path: string
  }

  export interface Chapter {
    id: string
    name: string
    /** Absent until the chapter has a logo; the card shows `abbr` instead. */
    logo?: string
    abbr?: string
    /** Absent until the chapter has a lu.ma calendar. */
    luma?: string
    /** `label` is the chapter's soonest upcoming event, or `TBA`. Derived at
     *  build time unless site.yaml overrides it, so it is never missing. */
    next: { label: string; flavor: string }
    /** The chapter's most recent past event, derived the same way. */
    last: string
  }

  /** One community link in the channels strip under the newsletter form. */
  export interface Channel {
    label: string
    handle: string
    url: string
  }

  export interface Site {
    title: string
    tagline: string
    description: string
    about: string
    url: string
    chapters: Chapter[]
    newsletter: {
      heading: string
      highlight: string
      sub: string
      success: string
      cities: { value: string; label: string }[]
    }
    channels: {
      heading: string
      links: Channel[]
    }
  }

  /** One image in the hero rotator, from `src/content/hero/`. */
  export interface HeroImage {
    src: string
    /** Derived from the filename; shown as the mono caps caption. */
    caption: string
  }

  export const site: Site
  export const events: EventEntry[]
  /** Events from `src/content/upcoming/`, soonest first. */
  export const upcoming: EventEntry[]
  export const hero: HeroImage[]
}
