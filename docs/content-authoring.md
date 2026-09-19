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
│   ├── singapore.png
│   └── cbus.avif
├── upcoming/                          events that haven't happened yet
│   └── 2026-08-19-models-models-models/
│       ├── index.md                   frontmatter + what to expect
│       └── poster.avif                card image
└── events/                            events that have, with recaps
    └── 2026-07-08-local-models-with-gemma-4/
        ├── index.md                   frontmatter + recap copy
        ├── poster.avif                card image
        └── photos/                    recap photo grid (optional)
            ├── 01.jpg
            └── 02.jpg
```

`upcoming/` and `events/` take the same files and the same frontmatter. The
difference is where they show up:

| | Landing page | URL |
| --- | --- | --- |
| `upcoming/` | the **Coming up** band, while the date is in the future | `/upcoming/<slug>/` |
| `events/` | the **Past events** grid | `/events/<slug>/` |

---

## Announcing an upcoming event

### 1. Create the folder

Name it `YYYY-MM-DD-some-slug` under `upcoming/`. The date orders the band and
decides when it stops showing; the rest becomes the URL:

```
src/content/upcoming/2026-09-16-agents-night/   →   /upcoming/agents-night/
```

### 2. Add `index.md`

```markdown
---
title: Agents Night
date: 2026-09-16
meta: WED, SEP 16 · 7-9PM · SHIBUYA
chapter: tokyo
flavor: purple
luma: https://luma.com/abc123
tags:
  - Agents
  - Shareouts
blurb: An evening of agent demos, failures included.
summary: Bring an agent that half works. We'll debug it together.
---

Every month someone asks which framework to use, so this time we're doing demos.

## What to expect

- **Shareouts** — short, informal demos from whoever wants the floor.
```

`luma` is the signup button on both the band and the event page. Leave it out
and it falls back to the chapter's lu.ma calendar from `site.yaml` — so the
button is never missing, but pointing it at the specific event page is better.

The body is optional. Without one the page shows the poster, tags and the
`summary` line.

### 3. After the event

Nothing breaks. Once the date passes, the event drops out of the **Coming up**
band on the next deploy, but `/upcoming/<slug>/` stays live — links shared before
the meetup keep working, and the page says the event has already happened.

To publish a recap, add a folder under `events/` as below. The two are
independent; you can leave the `upcoming/` folder where it is.

> The date check runs **at build time**, not in the browser. A finished event
> disappears from the band on the next deploy, not at midnight.

---

## Adding a past event

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
luma: https://luma.com/abc123
tags:
  - Agents
  - Shareouts
blurb: An evening of agent demos, failures included.
---

We packed the room for agents night. Thanks to everyone who demoed!

## Takeaways

- 🤖 Most agent demos fail live. That's the fun part.
```

`luma` is optional here. When set, the event page gets a **See it on Luma →**
button so people can pull up the original listing — attendee list, venue, the
description as it was posted. Leave it out and no button renders; unlike
`upcoming/`, it does not fall back to the chapter calendar, because a calendar
of future meetups says nothing about an event that already happened.

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
| `meta` | | The mono line under the title. Defaults to the weekday, date and chapter from `date:` — `FRI, SEP 11 · TOKYO`. Set it only to add a time or venue: `WED, SEP 16 · 7-9PM · SHIBUYA`. |
| `blurb` | | One line shown on the event card. |
| `summary` | | Longer line for the "Coming up" teaser. Defaults to `blurb`. |
| `tags` | | List of short labels rendered as flavour-coloured tags. |
| `flavor` | | Accent colour. See the list below. Defaults to `gold`. |
| `chapter` | | `tokyo`, `singapore` or `columbus`. |
| `luma` | | lu.ma event page. In `upcoming/` it's the signup button and defaults to the chapter calendar; in `events/` it's an optional "See it on Luma" link with no default. |
| `eyebrow` | | Chip text, e.g. `Workshop, complete`. Defaults to `Upcoming` in `upcoming/`, `Recap` in `events/`. |
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
- **`chapters`** — the "Three cities, one vibe" cards: logo (or an `abbr` tile), lu.ma link, and the
  flavour of the `NEXT →` chip. The two **dates are derived**, not written here
- **`newsletter`** — heading, sub-line, confirmation message, and the city
  options offered in the form
- **`channels`** — the Discord / LinkedIn links under the signup form: a
  `heading` and a `links` list of `label`, `handle` and `url`

> **You do not update the next meetup date.** The `NEXT →` chip is the
> chapter's soonest folder in `upcoming/`, and `LAST →` its most recent folder
> in `events/`, both read from that event's `date:`. Adding an upcoming event,
> or moving a finished one into `events/`, updates both cards on the next
> build. Set `next.label` or `last` only to say something a date cannot — the
> chip falls back to `TBA` on its own when a chapter has nothing scheduled.

### Adding a chapter

Add an entry to `chapters` and drop its logo in `src/content/chapters/`. The
landing page grid picks it up automatically. Until a chapter has a logo, give it
an `abbr` (`CBUS`) and the card shows that as a pixel-font tile instead; until it
has a lu.ma calendar, leave `luma` out and the RSVP button and footer link are
hidden. Also add it to `newsletter.cities` so people can pick it, **and** to
`ALLOWED_CITIES` in `worker/index.ts` so the API stores it rather than discarding it.

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
