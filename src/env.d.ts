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
    meta: string
    chapter: string | null
    flavor: string
    eyebrow: string
    tags: string[]
    blurb: string
    summary: string
    featured: boolean
    poster: string | null
    photos: string[]
    hasRecap: boolean
    html: string
    path: string
  }

  export interface Chapter {
    id: string
    name: string
    logo: string
    luma: string
    next: { label: string; flavor: string }
    last: string
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
  }

  export const site: Site
  export const events: EventEntry[]
}
