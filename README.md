# Vibe Coders Meetup

The website for the Vibe Coders Meetup — Tokyo & Singapore.

A Vue 3 site, prerendered to static HTML, deployed on Cloudflare Workers.
Events are Markdown files; photos are images you drop into a folder. Nobody
edits HTML to publish an event.

---

## Quick start

```bash
pnpm install
cp .env.example .env  # local secrets; gitignored, safe to leave blank at first
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
| Add an event, hero photos, or change site copy | [`docs/content-authoring.md`](docs/content-authoring.md) |
| Let Claude Code do it for you | [Authoring skills](#authoring-skills), below |
| Set up Cloudflare and the newsletter database | [`docs/cloudflare-setup.md`](docs/cloudflare-setup.md) |
| Know where secrets go (this repo is public) | [`docs/cloudflare-setup.md#secrets-and-configuration`](docs/cloudflare-setup.md#secrets-and-configuration) |
| Understand whether we need R2 (we don't, yet) | [`docs/r2-storage.md`](docs/r2-storage.md) |
| See the original design | [`docs/design-spec/`](docs/design-spec/) and [`docs/design-system/`](docs/design-system/) |

**Adding an event, in short:** create
`src/content/events/YYYY-MM-DD-your-slug/`, put an `index.md` and a `poster.avif`
in it, drop photos into a `photos/` subfolder, and push. That's the whole
workflow.

### Authoring skills

Two [Claude Code](https://claude.com/claude-code) skills in `.claude/skills/`
do that work for you. Run them from the repo root with a slash command; each
asks for what it needs and shows you the result before you commit.

| Skill | Use it when | What it does |
| --- | --- | --- |
| `/add-event` | A meetup is scheduled and listed on lu.ma | Reads the lu.ma page, writes `src/content/upcoming/YYYY-MM-DD-<loc>-<slug>/index.md`, and saves the cover as the poster |
| `/add-event-summary` | The meetup has happened and you have a write-up | Moves the folder to `events/`, converts the recap to Markdown, and imports the photos |

```bash
/add-event https://luma.com/abc123     # then confirm what it inferred
/add-event-summary                     # paste the recap, point it at the photos
```

Both are ordinary Markdown and Python — read `SKILL.md` in either folder to see
exactly what they do, and edit them when the house style moves on.

**They exist because three things here are easy to get wrong by hand:**

- **lu.ma descriptions.** The page's `og:` tags are truncated and its social
  image is a cropped 800×420 card, so `add-event` reads the event out of the
  page data instead and converts the real description to Markdown.
- **Pasted recaps.** Markdown is rendered with `breaks: false`, so the single
  newlines in a Discord message collapse into one run-on paragraph. Custom
  emoji (`<:name:123>`) and Unicode fake-bold (`𝐃𝐞𝐦𝐨𝐬`) render as garbage.
  `add-event-summary` fixes all of it and gives bare URLs real link text.
- **Photo size.** Nothing in the build resizes images and an event page loads
  its whole grid at once, so a folder of camera originals ships in full to
  every visitor. Photos are imported at 1600px AVIF — usually a 90%+ saving.

To shrink a photo folder that predates the skill:

```bash
python3 .claude/skills/add-event-summary/scripts/import_photos.py \
  src/content/events/<folder> --in-place --dry-run
```

It refuses to overwrite anything git has no copy of, so commit first.

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
│   ├── hero/                 images for the hero rotator
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

.claude/skills/               Claude Code authoring skills
├── add-event/                lu.ma link → an upcoming event
└── add-event-summary/        recap + photos → a past event

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

## Secrets

**This repo is public.** Secrets go in `.env`, which is gitignored — copy
`.env.example` to start. In production they're set with
`wrangler secret put`, never committed.

The `database_id` in `wrangler.jsonc` is *not* a secret: it's a resource
identifier that does nothing without an authenticated API token, and Wrangler
has no way to read it from `.env` anyway. Full reasoning in
[`docs/cloudflare-setup.md`](docs/cloudflare-setup.md#secrets-and-configuration).

Never prefix anything secret with `VITE_` — Vite inlines those into the browser
bundle.

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
