# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install              # Install dependencies
pnpm run dev              # Vite dev server (http://localhost:5173)
pnpm run build            # Build + prerender all pages into dist/client
pnpm run preview          # Build, then serve via wrangler dev (http://localhost:8787)
pnpm run deploy           # Build and deploy to Cloudflare
pnpm run typecheck        # Type-check app, Worker and build scripts
pnpm run db:migrate:local # Apply D1 migrations to the local database
pnpm run db:migrate       # Apply D1 migrations to production
```

Use `pnpm run preview` when verifying anything involving `/api/*`, static
routing, or 404 behaviour — the Vite dev server alone does not exercise the
Worker.

## Architecture

Vue 3 site, prerendered to static HTML, deployed as a Cloudflare Worker.

**Content is data, not code.** Everything editable lives in `src/content/`:
`site.yaml` for site-wide copy and chapter cards, `hero/` for the hero rotator
images, and one folder per event under `events/` containing `index.md`,
`poster.*` and an optional `photos/` folder. Never hardcode event data into a
component — add or edit content files instead. See `docs/content-authoring.md`.

Hero rotator images come from `src/content/hero/`, with captions derived from
filenames. When that folder is empty the rotator falls back to event posters
(`heroImages` in `src/lib/content.ts`).

**The content pipeline** is `scripts/content-plugin.js`, a Vite plugin exposing
`src/content/` as a `virtual:content` module. It parses frontmatter with
gray-matter, renders Markdown with markdown-it, auto-discovers posters and
photos, and rewrites image paths into real `import` statements so Vite's asset
pipeline hashes them. `src/lib/content.ts` wraps that module with types and
derived values (`latestRecap`, `flavorColor`).

**Prerendering** is `scripts/prerender.js`. `pnpm run build` runs a client build,
an SSR build, then renders every route in `src/lib/routes.ts` to static HTML plus
`sitemap.xml` and `robots.txt`. Routes are derived from content, so there is no
route list to maintain when adding an event. `/404` is written to `404.html`,
which Cloudflare serves for unknown paths.

**`src/main.ts`** exports a `createApp(ssr)` factory shared by `entry-client.ts`
and `entry-server.ts`. Anything added to the app must go through it so client and
SSR stay identical — a divergence shows up as a hydration mismatch.

Note that `/events/<unknown-slug>` matches the event route on the client but is
served `404.html` by Cloudflare. `EventPage.vue` therefore renders
`NotFoundPage` when the slug is unknown, so the markup matches on both sides.

**The Worker** (`worker/index.ts`) handles only `/api/*`; `run_worker_first` in
`wrangler.jsonc` routes everything else straight to static assets. Newsletter
signups go to Cloudflare D1 (`migrations/`). See `docs/cloudflare-setup.md`.

## Secrets

**This repo is public.** Secrets go in `.env` (gitignored; `.env.example` is the
committed template) and, for production, `wrangler secret put`. Never add a
secret to `wrangler.jsonc`, and never give one a `VITE_` prefix — Vite inlines
`VITE_*` into the browser bundle.

`database_id` in `wrangler.jsonc` is committed deliberately: it is a resource
identifier rather than a credential, and Wrangler performs no variable
substitution in its config file, so it cannot be read from `.env`.

Worker error paths must not return raw errors — D1 messages carry SQL and file
paths. Catch and return a generic message, as the existing handlers do.

## Design system

The site implements the Vibe Coders Design System, whose source of truth is
`docs/design-system/`. Tokens are copied verbatim into `src/styles/tokens/` —
edit them there only to re-sync with the design system, never to tweak a value
for one component.

Non-negotiable brand rules:

- `border-radius: 0` everywhere; shadows are hard pixel offsets
  (`4px 4px 0 var(--ink)`), never blurred
- Hover lifts (`translate(-2px,-2px)`, shadow grows to 6px); press sinks
  (`translate(2px,2px)`, shadow collapses); 120–180ms; no fades or bounces
- Fonts: Silkscreen (pixel display, and section headings tracked tight with
  `--tracking-heading`), JetBrains Mono (body/UI)
- Event "flavors" are named tokens (`gold`, `lime`, `purple`, `peach`,
  `red-tint`, `light-navy`, `light-blue`) resolved by `flavorColor()`. `navy` and
  `blue` are too dark to sit behind ink text — don't use them as event flavours.

Components use scoped `<style>` blocks referencing tokens. The design reference
in `docs/design-spec/` uses inline styles because it is a React prototype; do not
copy that approach.

Layout: 1080px container, 680px text measure, 8px spacing grid. Breakpoints in
use are 920px, 860px, 780px, 620px and 560px.
