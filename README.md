# Vibe Coders Meetup

The website for the Vibe Coders Meetup — Tokyo & Singapore.

A Vue 3 site, prerendered to static HTML, deployed on Cloudflare Workers.
Events are Markdown files; photos are images you drop into a folder. Nobody
edits HTML to publish an event.

---

## Quick start

```bash
pnpm install
pnpm run dev          # http://localhost:5173
```

To run the full stack, including the newsletter API and its database:

```bash
pnpm run db:migrate:local   # once — creates the local database
pnpm run preview            # http://localhost:8787
```

---

## I just want to…

| …do this | Read this |
| --- | --- |
| Add an event, photos, or change site copy | [`docs/content-authoring.md`](docs/content-authoring.md) |
| Set up Cloudflare and the newsletter database | [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md) |
| Understand whether we need R2 (we don't, yet) | [`docs/r2-storage.md`](docs/r2-storage.md) |
| See the original design | [`docs/design-spec/`](docs/design-spec/) and [`docs/design-system/`](docs/design-system/) |

**Adding an event, in short:** create
`src/content/events/YYYY-MM-DD-your-slug/`, put an `index.md` and a `poster.avif`
in it, drop photos into a `photos/` subfolder, and push. That's the whole
workflow.

---

## Tech stack

| | |
| --- | --- |
| **Vue 3.5** | Composition API, `<script setup>`, single-file components |
| **Vue Router 5** | `/` and `/events/:slug` |
| **Vite 8** | Dev server, bundling, asset pipeline |
| **Custom Vite plugin** | Turns `src/content/` into a `virtual:content` module |
| **markdown-it + gray-matter** | Markdown and frontmatter, parsed at build time |
| **Custom prerenderer** | Renders every route to static HTML via `vue/server-renderer` |
| **Cloudflare Workers** | Hosting, plus the `/api/*` endpoints |
| **Cloudflare D1** | SQLite database for newsletter signups |

No CSS framework and no component library — the design system is implemented
directly from its tokens in `src/styles/tokens/`.

---

## Project layout

```
src/
├── content/              ← everything editable lives here
│   ├── site.yaml             site copy, chapter cards, newsletter text
│   ├── chapters/             chapter logos
│   └── events/               one folder per event
├── components/
│   ├── ds/                   design-system primitives (Button, Card, Tag, …)
│   └── *.vue                 site components (header, footer, rotator, …)
├── pages/                    LandingPage, EventPage, NotFoundPage
├── lib/                      content access, head tags, route list
├── styles/                   design tokens + global styles
├── main.ts                   app + router factory (shared by client and SSR)
├── entry-client.ts           hydration entry
└── entry-server.ts           prerender entry

scripts/
├── content-plugin.js         Vite plugin: src/content/ → virtual:content
└── prerender.js              renders every route to static HTML

worker/index.ts               Cloudflare Worker — /api/subscribe → D1
migrations/                   D1 schema
wrangler.jsonc                Cloudflare config
```

---

## Commands

| Command | What it does |
| --- | --- |
| `pnpm run dev` | Vite dev server with hot reload, watching `src/content/` |
| `pnpm run build` | Build + prerender every page into `dist/client` |
| `pnpm run preview` | Build, then serve via `wrangler dev` — the closest thing to production |
| `pnpm run deploy` | Build and deploy to Cloudflare |
| `pnpm run typecheck` | Type-check the app, the Worker and the build scripts |
| `pnpm run db:migrate:local` | Apply database migrations locally |
| `pnpm run db:migrate` | Apply database migrations to production |
| `pnpm run db:subscribers` | Print the newsletter list |

---

## How the build works

1. **`vite build`** bundles the client app and processes every image referenced
   from `src/content/`, emitting hashed filenames into `dist/client/assets/`.
2. **`vite build --ssr`** builds the same app for Node, into `dist/server`.
3. **`scripts/prerender.js`** imports that bundle and renders each route —
   the landing page, every event page, and `404.html` — writing real HTML into
   `dist/client`, along with `sitemap.xml` and `robots.txt`. The SSR bundle is
   then discarded.

The result is a fully static site that hydrates into a Vue app: fast and
crawlable on first load, interactive immediately after.

Routes come from the content itself, so adding an event folder adds a page —
there is no route list to maintain.

---

## Deployment

```bash
pnpm run deploy
```

First time only, you'll need to create the Cloudflare D1 database and paste its
id into `wrangler.jsonc` — see
[`docs/cloudflare-setup.md`](docs/cloudflare-setup.md).

`wrangler.jsonc` routes `/api/*` to the Worker and serves everything else
straight from Cloudflare's asset edge, so page and image traffic never consumes
Worker CPU time.

> **Note:** this replaces the old GitHub Pages setup. The site is no longer
> served from the `main` branch as raw static files — it is built and deployed
> to Cloudflare.

---

## The newsletter

`POST /api/subscribe` writes to the `subscribers` table in D1. It:

- normalises addresses (trimmed, lower-cased) so the `UNIQUE` index works
- upserts, so signing up twice confirms rather than errors
- restricts `city` to the known chapters, discarding anything else
- silently absorbs bots via a hidden honeypot field

The form swaps to a confirmation in place, with no page reload, and remembers
the subscribed state in `localStorage`.

---

## Design

The site implements the Vibe Coders Design System. Its tokens — colours,
typography, spacing, and the pixel-hard shadow and border treatments — are in
`src/styles/tokens/`, copied verbatim from `docs/design-system/tokens/`.

Two rules worth knowing before you touch the CSS:

- **Nothing is rounded and nothing is blurred.** `border-radius: 0`, and shadows
  are hard pixel offsets like `4px 4px 0 var(--ink)`.
- **Hover lifts, press sinks.** `translate(-2px, -2px)` with a larger shadow on
  hover; `translate(2px, 2px)` with no shadow on press. 120–180ms, no fades.
