---
name: add-event-summary
description: Publish the recap for a Vibe Coders meetup that has happened — move its folder from src/content/upcoming/ to src/content/events/, replace the preview copy with a summary the user pastes in (usually from Discord), and import event photos at the right size and numbering. Also use to add more photos to an event already under events/. Triggers include "add the recap", "write up last night's meetup", "move the event to past events", "here's the summary from Discord", "add photos to the August meetup", or a pasted recap with a folder of photos.
---

# Publish an event recap

Two jobs, one skill. Work out which is being asked:

- **The event is still in `src/content/upcoming/`** — move it and add the recap.
  Start at step 1.
- **The event is already in `src/content/events/`** — the user only wants to add
  or replace photos, or amend the summary. Skip to *Adding photos on their own*.

Check before assuming:

```bash
ls -d src/content/{upcoming,events}/*<slug>* 2>/dev/null
```

`docs/content-authoring.md` is the authority on the content format.

## 1. Move the folder

Keep the folder name exactly as it is — the date and slug are already right, and
the slug is the URL.

```bash
git mv src/content/upcoming/<folder> src/content/events/<folder>
```

Use `git mv` so history follows the file. The poster moves with it. Nothing else
needs editing: routes are derived from the folder, and the landing page's
`NEXT →` and `LAST →` chips recompute from the folders on the next build — never
touch `site.yaml` for this.

## 2. Ask how to treat the existing body

The folder arrives with preview copy — "What to expect", "Who it's for". Ask
which the user wants, showing them the current body:

- **Replace** — the recap becomes the whole page. Reads best when the recap
  covers what actually happened.
- **Append** — keep the preview, add the recap below a `---` divider under a
  `## Summary` heading. This is what `2026-08-19-models-models-models` does.

Do not guess; the answer changes the whole page.

## 3. Get the summary and convert it

Ask the user to paste the recap if they have not. It usually comes from Discord,
sometimes from a doc or an email.

Rewrite it into the site's Markdown. **The most common mistake is pasting it
through unchanged** — Discord's conventions are not this site's.

### Paragraphs

The renderer runs with `breaks: false`, so single newlines **collapse into one
run-on paragraph**. Discord text is full of single newlines. Put a blank line
between every paragraph, and turn a run of short lines into a real list.

### Links

`linkify` is on, so a bare URL is already clickable — but it renders as the raw
URL, which reads badly. Give every link descriptive text:

```markdown
<!-- from Discord -->
Weblingo: https://weblingo.app/ Francois demonstrated a translation tool.

<!-- becomes -->
🌐 [Weblingo](https://weblingo.app/): Francois demonstrated a translation tool.
```

Link the project or person's name, not "here" or "this link". Strip Discord's
`<https://…>` embed-suppression brackets. External links open in a new tab on
their own — do not add any markup for that.

### Emoji

**Strip every Discord custom emoji.** They are references to images on Discord's
servers, so nothing renders — the reader sees the raw text.

| Form | Where it comes from |
| --- | --- |
| `<:nuu:1234567890>` | Copying a message out of Discord — the usual case |
| `<a:partyparrot:1234567890>` | The same, for an animated emoji |
| `:nuu:`, `:shipit:` | Typed by hand, or pasted from a plain-text export |

Delete the whole token, including the angle brackets and the numeric id, and
tidy the spacing it leaves behind. Replace it with a Unicode emoji only when it
carried real meaning — a 🎉 or a 👏 where the sentence now reads flat.

`src/content/events/2026-06-19-sg-just-for-the-lulz/index.md` has a live example
of what this looks like when missed: a stray `:nuu:` sitting in the recap text.

**Keep Unicode emoji exactly as they are.** 🎉 🤩 🦖 render fine and are part of
the site's voice — every recap uses them, often to open a bullet. Stripping
those is the opposite of what is wanted; only the Discord-specific `:name:` and
`<:name:id>` tokens go.

### Discord leftovers to clean up

| Discord | Do this |
| --- | --- |
| `<@1234567890>` | User mention — replace with the person's name. Ask if it is not obvious. |
| `<#1234567890>` | Channel mention — replace with the channel's name or drop. |
| `__underline__` | Discord underline, but **bold** in Markdown. Use `_italic_` or plain text. |
| `# Heading` | Discord H1 — shift to `##`, since the page renders the title as the h1. |
| `@everyone`, `@here` | Drop. |
| `||spoiler||` | Not supported. Unwrap it. |
| `𝐃𝐞𝐦𝐨𝐬`, `𝘐𝘵𝘢𝘭𝘪𝘤` | Unicode "maths bold/italic" used as fake formatting. It is not bold — it is a different set of characters, unsearchable and read out wrong by screen readers. Retype it as ASCII and use a real `##` heading or `**bold**`. |

Keep the voice as written — the emoji, the exclamation marks, the thanks. Fix
the syntax, not the tone. Standard Markdown is fine throughout: `##` headings,
`-` lists, `**bold**`, `_italic_`, blockquotes.

## 4. Update the frontmatter

Most fields stay. Change these:

- **`eyebrow`** — delete it if it says `Next up` or `Upcoming`. In `events/` the
  page hardcodes the "Recap" chip and the card ignores the field, so a leftover
  value is dead metadata.
- **`summary`** — becomes the page's `<meta name="description">`. Rewrite it in
  the past tense to describe what happened.
- **`blurb`** — the card text in the **Past events** grid. Reword if it still
  reads as an invitation ("Bring what you've been running…").
- **`luma`** — keep. On an event page it renders a *See it on Luma →* button
  linking back to the original listing.
- **`title`**, **`date`**, **`meta`**, **`chapter`**, **`flavor`**, **`tags`** —
  leave alone.

## 5. Add the photos

Ask whether there are photos. Accept a folder, a list of files, or a glob —
whatever the user has:

```bash
python3 .claude/skills/add-event-summary/scripts/import_photos.py \
  src/content/events/<folder> ~/Downloads/vc-tokyo-9 --dry-run
```

Run `--dry-run` first and show the user the mapping, then run it again without
the flag. The script numbers them `01`, `02`, … continuing after any photos
already there.

**Compression is automatic and not optional.** Every photo is capped at 1600px
and re-encoded to AVIF on the way in. Camera originals are 6000px and 10MB+,
nothing in the build resizes them, and the event page loads the whole grid at
once — so a 12MB photo becomes about 70KB, and a typical batch of ten drops from
~49MB to under 1MB. Never copy photos into `photos/` by hand; that is how the
oversized folders already in the repo got there.

A folder is sorted by filename; explicit paths keep the order given, so pass
them in the order they should appear. Non-images are skipped.

**Photos dragged or pasted into the chat already carry their paths.** Each one
arrives with a trailing `[Image: source: /Users/…/IMG_1234.jpeg]` line — read the
paths off those and pass them straight to the script, in the order the images
were sent. Do not ask the user to re-type paths they have already supplied.

Only when an image arrives with no `source:` path is there nothing to import
from; ask for a folder in that case.

## 6. Verify

```bash
pnpm run dev
```

Point the user at `/events/<slug>/` and the landing page. Confirm the recap
reads correctly, the photo grid is in the right order, and the event has left
the **Coming up** band. Show them the frontmatter you changed.

## Adding photos on their own

For an event already under `events/`, skip everything above and run the import
script from step 5 against its folder. It appends after the highest existing
number, so a second batch does not disturb the first, and mixed extensions in
the folder are fine.

To *replace* a photo, delete the old file first and let the new one take a fresh
number, or rename deliberately — the grid is sorted by filename, so numbering is
the only thing that sets the order.

## Shrinking photos already in the repo

Events imported before this skill existed hold full-size originals. `--in-place`
recompresses a folder without touching its numbering:

```bash
python3 .claude/skills/add-event-summary/scripts/import_photos.py \
  src/content/events/<folder> --in-place --dry-run
```

It replaces the originals, so it refuses to run on files git has no copy of and
lists them. Commit them first — then git holds the originals and the working
tree gets the small versions. `--force` overrides that and accepts losing them;
only use it when the user says the originals are safe elsewhere.

Photos already AVIF and within the cap are skipped, and any file the re-encode
would make *larger* is left alone, so the command is safe to re-run.
