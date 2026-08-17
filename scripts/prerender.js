/**
 * Static site generation.
 *
 * Runs after both Vite builds:
 *   dist/client   the browser bundle + the `index.html` shell
 *   dist/server   the SSR bundle produced from `src/entry-server.ts`
 *
 * For every route the content declares, this renders the app to HTML and writes
 * it into `dist/client` as `<route>/index.html`, so Cloudflare serves a fully
 * formed page and the Vue app hydrates on top of it.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const clientDir = path.join(root, 'dist', 'client')
const serverEntry = path.join(root, 'dist', 'server', 'entry-server.js')

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Builds the per-page <head> tags injected into the shell. */
function headTags(head, route, siteUrl) {
  const canonical = siteUrl ? new URL(route, siteUrl).href : route
  const tags = [
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
  ]

  if (head.description) {
    tags.push(`<meta name="description" content="${escapeHtml(head.description)}">`)
    tags.push(`<meta property="og:description" content="${escapeHtml(head.description)}">`)
  }
  if (head.title) {
    tags.push(`<meta property="og:title" content="${escapeHtml(head.title)}">`)
  }
  if (head.image) {
    const image = siteUrl ? new URL(head.image, siteUrl).href : head.image
    tags.push(`<meta property="og:image" content="${escapeHtml(image)}">`)
    tags.push(`<meta name="twitter:card" content="summary_large_image">`)
  }

  return tags.join('\n    ')
}

async function main() {
  const template = await fs.readFile(path.join(clientDir, 'index.html'), 'utf8')
  const { render, routesToPrerender, siteUrl } = await import(pathToFileURL(serverEntry).href)

  for (const route of routesToPrerender) {
    const { html, head } = await render(route)

    let page = template
      .replace('<!--app-html-->', html)
      .replace('<!--app-head-->', headTags(head, route, siteUrl))

    if (head.title) {
      page = page.replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${escapeHtml(head.title)}</title>`,
      )
    }

    // Cloudflare's `not_found_handling: "404-page"` looks for `/404.html`.
    const outFile =
      route === '/404'
        ? path.join(clientDir, '404.html')
        : path.join(clientDir, route.replace(/^\//, ''), 'index.html')

    await fs.mkdir(path.dirname(outFile), { recursive: true })
    await fs.writeFile(outFile, page)
    console.log(`  prerendered  ${route}`)
  }

  // The 404 page is not a destination, so it stays out of the sitemap.
  await writeSitemap(
    routesToPrerender.filter((route) => route !== '/404'),
    siteUrl,
  )

  // The SSR bundle is a build-time artefact — never ship it.
  await fs.rm(path.join(root, 'dist', 'server'), { recursive: true, force: true })
}

async function writeSitemap(routes, siteUrl) {
  if (!siteUrl) return
  const urls = routes
    .map((route) => `  <url><loc>${escapeHtml(new URL(route, siteUrl).href)}</loc></url>`)
    .join('\n')

  await fs.writeFile(
    path.join(clientDir, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  )

  await fs.writeFile(
    path.join(clientDir, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', siteUrl).href}\n`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
