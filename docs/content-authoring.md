# Adding events, photos and copy

Everything on the site comes from `src/content/`. You never edit HTML, Vue or
CSS to publish an event — you add a folder and some files, and the build does
the rest.

```
src/content/
├── site.yaml                          site-wide copy, chapter cards, newsletter
├── hero/                              images for the rotating frame in the hero
│   ├── 01-packed-room.jpg
│   └── 02-gemma-workshop.jpg
├── chapters/
│   ├── tokyo.avif                     chapter logos
│   └── singapore.png
└── events/
    └── 2026-07-08-local-models-with-gemma-4/
        ├── index.md                   frontmatter + recap copy
        ├── poster.avif                card image
        └── photos/                    recap photo grid (optional)
            ├── 01.jpg
            └── 02.jpg
```

---

## Adding an event

### 1. Create the folder

Name it `YYYY-MM-DD-some-slug`. The date orders the site; the rest becomes the
URL:

```
src/content/events/2026-09-16-agents-night/   →   /events/agents-night/
```

### 2. Add `index.md`

```markdown
---
title: Agents Night
date: 2026-09-16
meta: WED, SEP 16 · 7-9PM · SHIBUYA
chapter: tokyo
flavor: purple
tags:
  - Agents
  - Shareouts
blurb: An evening of agent demos, failures included.
---

We packed the room for agents night. Thanks to everyone who demoed!

## Takeaways

- 🤖 Most agent demos fail live. That's the fun part.
```

### 3. Add a poster

Drop any image named `poster.*` in the folder (`.avif`, `.webp`, `.png`,
`.jpg`). It becomes the card image on the landing page and the hero image on the
event page. It is displayed as a square, so square artwork works best.

### 4. Add photos (optional)

Create a `photos/` folder and drop images in. They render as the "Photos" grid
on the event page, **sorted by filename** — so name them `01.jpg`, `02.jpg`, and
they appear in that order. No frontmatter needed.

If there are no photos, the section is simply not rendered.

### 5. Preview

```bash
pnpm run dev
```

The dev server watches `src/content/` and reloads when you add, edit or delete a
file. Commit and push when it looks right.

---

## Frontmatter reference

| Field | Required | What it does |
| --- | --- | --- |
| `title` | ✅ | Event name. Wrap in quotes if it contains `#` — `"Tokyo Vibe Coders #3"` — because an unquoted `#` starts a YAML comment. |
| `date` | ✅ | `YYYY-MM-DD`. Sorts the site, newest first. Falls back to the date in the folder name. |
| `meta` | | The mono line under the title, e.g. `WED, SEP 16 · 7-9PM · SHIBUYA`. Free text. |
| `blurb` | | One line shown on the event card. |
| `summary` | | Longer line for the "Latest recap" teaser. Defaults to `blurb`. |
| `tags` | | List of short labels rendered as flavour-coloured tags. |
| `flavor` | | Accent colour. See the list below. Defaults to `gold`. |
| `chapter` | | `tokyo` or `singapore`. |
| `eyebrow` | | Chip text in the Latest Recap band, e.g. `Workshop, complete`. Defaults to `Recap`. |
| `featured` | | `true` pins this event to the "Latest recap" band. |
| `slug` | | Override the URL slug. Defaults to the folder name minus the date. |
| `poster` | | Override the poster path, e.g. `./art/cover.png`. |
| `photos` | | Explicit ordered photo list. Overrides the `photos/` folder. |

### Flavours

One accent colour per event, from the design system:

`gold` · `lime` · `purple` · `peach` · `red-tint` · `light-navy` · `light-blue`

`navy` and `blue` also exist as tokens but are too dark to sit behind ink text —
don't use them as an event flavour.

You can also pass a raw value (`flavor: "#e3c366"`) if you really need to.

---

## The recap body

Everything below the frontmatter is Markdown, rendered at build time:

- Paragraphs, **bold**, _italic_, `code`
- Links — external ones automatically open in a new tab
- `## Takeaways` and other `##` headings, styled as the design system's section
  headings
- Bullet and numbered lists
- Images (`![alt](./some-image.png)`), which get the standard pixel border
- Blockquotes, code blocks, horizontal rules

An event with no body still gets a page — it shows the poster, tags and a note
that the recap is coming.

---

## Hero photos

The rotating square frame on the landing page comes from `src/content/hero/`.
Drop images in; they rotate every 3 seconds, **sorted by filename**:

```
src/content/hero/
├── 01-packed-room-at-google-shibuya.jpg
├── 02-gemma-workshop.jpg
└── 03-pizza-queue.jpg
```

The caption under the frame is derived from the filename — the leading `NN-`
and the extension are stripped and dashes become spaces, so the first file above
reads as `PACKED ROOM AT GOOGLE SHIBUYA`. **To change a caption, rename the
file.**

Images are shown as a square, so square or centre-weighted photos work best.

> **While `hero/` contains no images**, the rotator falls back to event posters
> so the hero is never empty. Adding a single image replaces that fallback
> entirely — it is all or nothing, not a merge.

---

## Editing site-wide copy

`src/content/site.yaml` holds everything outside event pages:

- **`description`** — the hero paragraph, and the site's meta description
- **`about`** — the footer blurb
- **`url`** — the deployed origin, used for canonical links and `sitemap.xml`
- **`chapters`** — the "Two cities, one vibe" cards: logo, lu.ma link, the
  `NEXT →` chip (label + flavour) and the `LAST →` line
- **`newsletter`** — heading, sub-line, confirmation message, and the city
  options offered in the form

> **Updating the next meetup date** is just editing `chapters[].next.label`.

### Adding a chapter

Add an entry to `chapters` and drop its logo in `src/content/chapters/`. The
landing page grid picks it up automatically. If you add a third chapter, also
add it to `newsletter.cities` so people can pick it, **and** to `ALLOWED_CITIES`
in `worker/index.ts` so the API stores it rather than discarding it.

---

## How it works

`scripts/content-plugin.js` is a Vite plugin that reads `src/content/` and
exposes it as a `virtual:content` module. Images are turned into real `import`
statements, so Vite hashes and fingerprints them like any other asset — which is
why dropping a file into `photos/` or `hero/` is all that's required.

At build time `scripts/prerender.js` renders every route to static HTML, so each
event page is a real, crawlable page rather than something assembled in the
browser.

See [`docs/cloudflare-setup.md`](./cloudflare-setup.md) for deployment and the
newsletter database.
