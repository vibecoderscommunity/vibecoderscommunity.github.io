/**
 * Vite plugin: turns `src/content/` into a `virtual:content` module.
 *
 * Everything the site renders comes from here, so adding an event never means
 * touching a `.vue` or `.html` file:
 *
 *   src/content/site.yaml                     site-wide copy + chapter cards
 *   src/content/events/<YYYY-MM-DD-slug>/
 *       index.md                              frontmatter + recap markdown
 *       poster.(avif|webp|png|jpg)            card / hero image
 *       photos/*.(avif|webp|png|jpg)          recap photo grid, sorted by name
 *
 * Images are emitted as real `import` statements so Vite hashes, optimises and
 * fingerprints them like any other asset — dropping a file into `photos/` is
 * all it takes for it to appear on the event page.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import YAML from 'yaml'

const VIRTUAL_ID = 'virtual:content'
const RESOLVED_ID = '\0' + VIRTUAL_ID

const IMAGE_RE = /\.(avif|webp|png|jpe?g|gif|svg)$/i
const SLUG_DATE_RE = /^\d{4}-\d{2}-\d{2}-/

const md = new MarkdownIt({ html: true, linkify: true, breaks: false })

// External links open in a new tab; internal ones behave normally.
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, i, options, _env, self) => self.renderToken(tokens, i, options))
md.renderer.rules.link_open = (tokens, i, options, env, self) => {
  const href = tokens[i].attrGet('href') || ''
  if (/^https?:\/\//i.test(href)) {
    tokens[i].attrSet('target', '_blank')
    tokens[i].attrSet('rel', 'noopener noreferrer')
  }
  return defaultLinkOpen(tokens, i, options, env, self)
}

/** Read a directory, returning [] instead of throwing when it does not exist. */
function readDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

/**
 * Collects asset imports while building the data module.
 *
 * Absolute filesystem paths are converted to root-relative specifiers
 * (`/src/content/...`), which Vite resolves against the project root in both
 * dev and build.
 */
class AssetRegistry {
  constructor(root) {
    this.root = root
    this.specifiers = new Map() // specifier -> variable name
  }

  /** @returns {string} a JS expression referencing the imported asset. */
  ref(absPath) {
    const specifier = '/' + path.relative(this.root, absPath).split(path.sep).join('/')
    let name = this.specifiers.get(specifier)
    if (!name) {
      name = `__asset${this.specifiers.size}`
      this.specifiers.set(specifier, name)
    }
    return name
  }

  imports() {
    return [...this.specifiers]
      .map(([specifier, name]) => `import ${name} from ${JSON.stringify(specifier)}`)
      .join('\n')
  }
}

/**
 * Serialises a value to JS source, replacing `{__asset: "<var>"}` markers with
 * bare identifiers so they reference the imported asset URLs.
 */
function serialize(value) {
  return JSON.stringify(value, null, 2).replace(
    /\{\s*"__asset": "(__asset\d+)"\s*\}/g,
    '$1',
  )
}

/** Resolves a content-relative image reference into an asset marker. */
function assetMarker(assets, baseDir, ref) {
  const abs = path.resolve(baseDir, ref)
  if (!fs.existsSync(abs)) {
    throw new Error(`Referenced image does not exist: ${ref} (looked in ${abs})`)
  }
  return { __asset: assets.ref(abs) }
}

/** Recursively swaps any image-looking string for an asset marker. */
function resolveImages(value, assets, baseDir) {
  if (typeof value === 'string') {
    return IMAGE_RE.test(value) ? assetMarker(assets, baseDir, value) : value
  }
  if (Array.isArray(value)) return value.map((v) => resolveImages(v, assets, baseDir))
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, resolveImages(v, assets, baseDir)]),
    )
  }
  return value
}

/** Formats a Date (or date string) as an ISO `YYYY-MM-DD` day. */
function isoDay(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '')
}

function loadEvent(dir, assets) {
  const folder = path.basename(dir)
  const source = fs.readFileSync(path.join(dir, 'index.md'), 'utf8')
  const { data, content } = matter(source)

  const slug = data.slug || folder.replace(SLUG_DATE_RE, '')
  const date = isoDay(data.date) || folder.slice(0, 10)

  // Poster: explicit frontmatter wins, otherwise the `poster.*` file beside it.
  let poster = data.poster
  if (!poster) {
    const found = readDir(dir).find((e) => e.isFile() && /^poster\./i.test(e.name))
    poster = found ? './' + found.name : null
  }

  // Photos: explicit frontmatter list, otherwise everything in `photos/`,
  // sorted by filename so `01.jpg`, `02.jpg`… land in a predictable order.
  let photos = data.photos
  if (!photos) {
    photos = readDir(path.join(dir, 'photos'))
      .filter((e) => e.isFile() && IMAGE_RE.test(e.name))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
      .map((name) => `./photos/${name}`)
  }

  const body = content.trim()

  return resolveImages(
    {
      slug,
      date,
      title: data.title || slug,
      meta: data.meta || '',
      chapter: data.chapter || null,
      flavor: data.flavor || 'gold',
      eyebrow: data.eyebrow || 'Recap',
      tags: data.tags || [],
      blurb: data.blurb || '',
      // `summary` is the longer line used by the Latest Recap teaser.
      summary: data.summary || data.blurb || '',
      featured: data.featured === true,
      poster,
      photos,
      hasRecap: body.length > 0,
      html: body ? md.render(body) : '',
      path: `/events/${slug}/`,
    },
    assets,
    dir,
  )
}

function loadSite(contentDir, assets) {
  const file = path.join(contentDir, 'site.yaml')
  const site = YAML.parse(fs.readFileSync(file, 'utf8')) || {}
  return resolveImages(site, assets, contentDir)
}

export function buildContent(root) {
  const contentDir = path.join(root, 'src', 'content')
  const eventsDir = path.join(contentDir, 'events')
  const assets = new AssetRegistry(root)

  const events = readDir(eventsDir)
    .filter((e) => e.isDirectory())
    .map((e) => path.join(eventsDir, e.name))
    .filter((dir) => fs.existsSync(path.join(dir, 'index.md')))
    .map((dir) => loadEvent(dir, assets))
    // Newest first — the order the landing page grid uses.
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))

  const duplicates = events
    .map((e) => e.slug)
    .filter((slug, i, all) => all.indexOf(slug) !== i)
  if (duplicates.length) {
    throw new Error(`Duplicate event slugs: ${[...new Set(duplicates)].join(', ')}`)
  }

  const site = loadSite(contentDir, assets)

  return { assets, events, site }
}

/** Routes to statically prerender. Used by the build script. */
export function contentRoutes(root) {
  const { events } = buildContent(root)
  return ['/', ...events.map((e) => e.path)]
}

export default function contentPlugin() {
  let root = process.cwd()

  return {
    name: 'vibecoders:content',

    configResolved(config) {
      root = config.root
    },

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id !== RESOLVED_ID) return
      const { assets, events, site } = buildContent(root)
      return [
        assets.imports(),
        `export const site = ${serialize(site)}`,
        `export const events = ${serialize(events)}`,
      ]
        .filter(Boolean)
        .join('\n\n')
    },

    configureServer(server) {
      const contentDir = path.join(root, 'src', 'content')
      server.watcher.add(contentDir)

      const invalidate = (file) => {
        if (!file.startsWith(contentDir)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', invalidate)
      server.watcher.on('unlink', invalidate)
      server.watcher.on('change', invalidate)
    },
  }
}
