/**
 * Minimal head management.
 *
 * Pages call `useHead()` in setup. On the client the values are written to the
 * document; during the prerender pass `scripts/prerender.js` reads the same
 * object out of the SSR context and bakes the tags into the static HTML.
 */
import { inject, reactive, watchEffect, type App, type InjectionKey } from 'vue'

export interface HeadState {
  title: string
  description: string
  /** Absolute or root-relative URL of the social preview image. */
  image?: string
  /** Path of the current page, used to build the canonical URL. */
  path?: string
}

const HEAD_KEY: InjectionKey<HeadState> = Symbol('head')

export function createHead(initial: Partial<HeadState> = {}) {
  const state = reactive<HeadState>({
    title: '',
    description: '',
    ...initial,
  })

  return {
    state,
    install(app: App) {
      app.provide(HEAD_KEY, state)
    },
  }
}

export function useHead(compute: () => Partial<HeadState>) {
  const state = inject(HEAD_KEY)
  if (!state) return

  watchEffect(() => {
    Object.assign(state, compute())

    // During SSR there is no document; the prerenderer reads `state` instead.
    if (typeof document === 'undefined') return

    if (state.title) document.title = state.title
    setMeta('name', 'description', state.description)
    setMeta('property', 'og:title', state.title)
    setMeta('property', 'og:description', state.description)
  })
}

function setMeta(attr: 'name' | 'property', key: string, value: string | undefined) {
  if (!value) return
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', value)
}
