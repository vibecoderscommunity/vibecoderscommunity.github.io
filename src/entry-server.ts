import { renderToString } from 'vue/server-renderer'
import { createApp } from './main'
import type { HeadState } from './lib/head'

export interface RenderResult {
  html: string
  head: HeadState
}

/** Renders one route to HTML. Called by `scripts/prerender.js` at build time. */
export async function render(url: string): Promise<RenderResult> {
  const { app, router, head } = createApp(true)

  await router.push(url)
  await router.isReady()

  const html = await renderToString(app)

  return { html, head: { ...head.state } }
}

export { routesToPrerender, siteUrl } from './lib/routes'
