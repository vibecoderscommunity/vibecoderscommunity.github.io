---
name: add-event
description: Announce an upcoming Vibe Coders meetup on the vibecoderscommunity.github.io site by creating a folder under src/content/upcoming/ with index.md and a poster image, pulling the title, date, venue, description and cover art from a lu.ma link. Use when the user wants to add, announce, publish or list a new scheduled event, a next meetup, or an upcoming event — typically phrased as "add an event", "announce the September meetup", "add this to the site" with a luma.com URL, or "put the next Tokyo event up".
---

# Add an upcoming event

Create `src/content/upcoming/<YYYY-MM-DD-loc-slug>/` containing `index.md` and a
poster, from a lu.ma event link.

`docs/content-authoring.md` in this repo is the authority on the content format.
Read it if a question comes up that this file does not answer.

## Workflow

### 1. Get the lu.ma link

Ask the user for it if they have not given one. It is the only thing genuinely
required — everything else is fetched, then confirmed.

If the user has no lu.ma link, ask for the title, date, and description, skip to
step 4, and ask them for a poster image path.

### 2. Fetch the event

```bash
python3 .claude/skills/add-event/scripts/luma_fetch.py <url-or-slug> \
  --poster /tmp/event-poster
```

Standard library only, no install step. It prints JSON with `name`, `date`,
`time`, `meta`, `timezone`, `venue`, `calendar`, `cover_url`, `body` and
`poster_file`, and downloads the cover as a 1080px AVIF (~40KB, down from the
~2MB lu.ma serves).

`body` is lu.ma's description converted from its ProseMirror document into
Markdown — headings shifted to `##`, lists, links and emphasis already correct.
Do not hand-transcribe the description from the page; the conversion is the
point of the script.

Flags: `--no-optimize` keeps the full-size cover, `--keep-images` keeps inline
description images (dropped by default — they are lu.ma sponsor logos and venue
photos on a CDN this site should not hotlink).

### 3. Decide the folder name

`YYYY-MM-DD-<loc>-<slug>` — the date orders the band, the rest becomes the URL
(`/upcoming/<loc>-<slug>/`).

- **Date** — the `date` from the script. It is the date in the event's own
  timezone, which is not always the UTC one.
- **loc** — `tok` for `Asia/Tokyo`, `sg` for `Asia/Singapore`. Add a new short
  code for a new city.
- **slug** — 2–4 words from the distinctive part of the title, lowercase,
  hyphenated. Drop the recurring branding: `Vibe Coders Tokyo #10 - Fun Edition`
  → `fun`, `Vibe Coders SG #3 - Designing with AI, without the slop` →
  `designing-with-ai-no-slop`.

### 4. Write `index.md`

```markdown
---
title: Fun Edition
date: 2026-09-11
chapter: tokyo
flavor: red-tint
luma: https://luma.com/n31gyilz
tags:
  - Shareouts
blurb: Share anything you've vibe coded for fun.
summary: >-
  We're celebrating our tenth meetup by inviting folks to share anything
  they've vibe coded for fun. It could be a game, a silly thing, or even a
  micro interaction that made you smile.
---

<trimmed body>
```

- **title** — the distinctive part, not the full lu.ma name (`Fun Edition`, not
  `Vibe Coders Tokyo #10 - Fun Edition - our tenth meetup! 🌈 ✨`). **Quote any
  title containing `#`** — unquoted, it starts a YAML comment.
- **chapter** — `tokyo` or `singapore`, from the timezone.
- **flavor** — pick one not used by the last few events. Check with
  `grep -h '^flavor:' src/content/upcoming/*/index.md src/content/events/*/index.md`.
  Valid: `gold` `lime` `purple` `peach` `red-tint` `light-navy` `light-blue`.
  Never `navy` or `blue` — too dark behind ink text.
- **luma** — the canonical `https://luma.com/<slug>` URL.
- **tags** — usually one of `Talks`, `Shareouts`, `Workshop`, `Agents`. Infer
  from the format the description describes.
- **blurb** — one line for the event card.
- **summary** — the "Coming up" teaser, normally the first paragraph of the
  description. Use `>-` block scalar and wrap it.
- **meta** — omit it. The site derives `FRI, SEP 11 · TOKYO` on its own. Add the
  script's `meta` value only when the time or venue is worth showing.
- **eyebrow** — omit it; it defaults to `Upcoming`.

### 5. Trim the body

lu.ma descriptions are mostly standing boilerplate. The site page is not a
mirror of the listing — the signup button already goes there. Keep only what
says what *this* meetup is, and lean short: existing pages are often just the
two opening paragraphs. Add an agenda or line-up only when it names real
speakers or sessions, not a generic doors-open schedule.

Cut: "Space is limited" / registration and approval notices, "Free entry to
all", "Be present and engaged" / laptops-down rules, "Help grow the community",
partnership and Discord solicitations, generic food and venue logistics,
"Details will be sent to accepted registrants", and anything repeated verbatim
on every event.

Keep a call for volunteers or demo signups — those are specific to the meetup
and time-sensitive.

The script emits correct Markdown, so do not rewrite its syntax. Fix only what
survives trimming: a heading left with no section under it, a dangling `---`, a
list whose intro paragraph you cut.

### 6. Move the poster in

Move `poster_file` to the event folder, keeping the extension:

```bash
mv /tmp/event-poster/poster.avif src/content/upcoming/<folder>/
```

Any `poster.*` in the folder is picked up automatically — it is not referenced
in frontmatter. It renders as a square, which lu.ma covers already are.

### 7. Confirm and verify

Show the user the folder name, the frontmatter you chose, and the trimmed body,
and say which parts were inferred (flavor, tags, slug, title shortening) so they
can correct them. Then:

```bash
pnpm run dev
```

and point them at `/upcoming/<slug>/`.

## Notes

- Nothing else needs editing. Routes come from the content folder, and the
  chapter card's `NEXT →` date on the landing page is derived from the soonest
  `upcoming/` folder — never edit `site.yaml` for an event.
- After the event happens the folder can stay; publishing a recap means adding a
  separate folder under `events/`. See `docs/content-authoring.md`.
