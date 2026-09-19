# Handoff: Vibe Coders Meetup website (vibecoders.fyi)

## Overview
A small single-page-plus-detail website for the Vibe Coders Meetup (Tokyo & Singapore chapters): a landing page with hero + rotating past-event photos, links to the two city chapters (with next/last event dates), a newsletter signup that confirms in place, a latest-event recap teaser, a grid of all past events, and an about footer. Each past event links to an individual event page (recap text, takeaways, photo grid).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to ship. Recreate these designs in your target environment (Next.js/Astro/plain static — pick what fits; a static site generator is a natural fit since content is a list of events). The HTML uses React via Babel-standalone purely as a prototyping convenience.

## Fidelity
**High-fidelity.** Colors, typography, spacing, borders, shadows, and copy are final and come from the Vibe Coders Design System (included under `_ds/`). Recreate pixel-perfectly. The photo-slot placeholders and lu.ma URLs are the only stand-ins.

## Files
- `index.html` — landing page (all sections)
- `event.html` — individual event page (template; one exists for "Local Models with Gemma 4", duplicate per event)
- `shared.jsx` — shared components: SiteHeader, NewsletterBand, SiteFooter, EventCard, Blink, SectionTitle
- `data.js` — event data model (`window.VBT_EVENTS`) and chapter links (`window.VBT_LINKS`)
- `image-slot.js` — prototype-only drag-and-drop photo placeholder; in production this is just an `<img>` (or CMS-managed image)
- `assets/` — logos (`logo-tokyo.avif`, `logo-sg.png`) and event posters (`events/vbt-*.avif`)
- `_ds/` — the full design system: tokens (colors, typography, spacing, effects), global styles

## Design Tokens
All in `_ds/vibe-coders-design-system-.../tokens/*.css`. Key values:
- Ink `#17130d`, soft `#3d372c`, faint `#7a7261`; paper `#f5efe1`, paper-2 `#ece3cd`, paper-3 `#e2d6b8`, white `#fffdf7`
- Accent red `#e23d28` (hover `#b42a18`, tint `#f8d9d3`)
- Event "flavors" (one per event): gold `#e3c366`, lime `#c7e64f`, purple `#a985e8`, peach `#f0b489`, red-tint `#f8d9d3`, light-navy `#ccd4f2`, light-blue `#c6d2f7`. Dark navy/blue exist as tokens but are NOT used behind ink text (contrast).
- Fonts (Google Fonts): Silkscreen 700 (pixel display/wordmark), Silkscreen 700 tracked -0.08em (section headings), JetBrains Mono (body/UI). Body line-height 1.65.
- Corners: `border-radius: 0` everywhere. Borders: 2px solid ink (3px heavy rules). Shadows: hard pixel offsets only, e.g. `4px 4px 0 var(--ink)` — never blurred.
- Hover: translate(-2px,-2px) + shadow grows to 6px; press: translate(2px,2px) + shadow collapses. Transitions 120–180ms snappy. Links get red-tint background on hover.
- Layout: container 1080px, text measure 680px, 8px spacing grid.

## Screens / Views

### 1. Landing (`index.html`)
Sections top to bottom, all inside the 1080px container unless full-bleed:

**Header (sticky-none, static):** paper bar, 3px ink bottom rule, height 64. Left: Silkscreen wordmark "VIBE C**O**DERS MEETUP" (the O in red), links home. Right: JetBrains Mono nav links — "Next meetups" → `#chapters`, "Past events" → `#events`, "Sign up" → `#newsletter` (smooth in-page scroll). Link hover: red-tint background. No CTA button.

**Hero (`#top`):** full-bleed radial gradient `radial-gradient(circle at 68% 30%, #efb0a0 0%, #f2cfc2 32%, #f5efe1 68%)`, 3px ink bottom border. Two columns (1.2fr / 1fr):
- Left: mono caps eyebrow "TOKYO · SINGAPORE"; H1 in Silkscreen, uppercase, "VIBE CODERS MEETUP" with red O and a blinking red `▮` cursor (1s `steps(1)` blink); body paragraph: "A cozy meetup for people who build things with AI — novices and enthusiasts, fun project shareouts, AI-tool discussions, workshops, free pizza. We're an English-speaking meetup (all languages welcome though!)."
- Right: **photo rotator** — square frame (max 380px), 2px ink border, `6px 6px 0` ink shadow; cycles through past-event images every 3s with an INSTANT swap (no fades, per brand). Below: mono caps caption (current event title) + counter "01/07"; row of 12px square dot-buttons (2px ink border, red = active, paper = inactive), clickable to jump. Uses event posters as placeholders until real photos exist.

**Two cities, one vibe (`#chapters`):** Silkscreen uppercase section title. Two chapter cards (1fr/1fr grid, gap 24): white surface, 2px ink border, `4px 4px 0` ink shadow, padding 24. Inside: 120×120 logo (2px ink border, `image-rendering: pixelated`, bg `#fdfcfa`) + column: Silkscreen name ("TOKYO" / "SINGAPORE"); "NEXT → …" mono caps chip (2px ink border, flavor bg: gold for Tokyo "WED, AUG 19", lime for Singapore "TBA — JOIN THE LIST"); muted "LAST → …" line (Tokyo: "MODELS MODELS MODELS · JUL", Singapore: "FRI, JUL 31"); small primary Button "RSVP on lu.ma ▸" opening the chapter's lu.ma page in a new tab. **lu.ma URLs in `data.js` are placeholders — replace with real ones.**

**Newsletter band (`#newsletter`):** full-bleed ink background, 3px ink rules. Left: Silkscreen heading "SIGN UP TO BE **NOTIFIED** OF FUTURE EVENTS" (paper text, "NOTIFIED" in lime) + small paper-3 sub-line "The next meetup in Tokyo and Singapore, straight to your inbox. No spam, unsubscribe whenever." Right: paper form card (2px ink border, `4px 4px 0` lime shadow): Email input, City select (Tokyo / Singapore / Somewhere else), lime "Sign me up" button (ink text). On submit (email required): replace the card in place with a paper confirmation box (2px lime border, lime shadow, Silkscreen): "YOU'RE IN! SEE YOU AT THE NEXT ONE▮". Prototype persists subscribed state in `localStorage` (`vbt-subscribed`); production should POST to the mailing-list provider and keep the same in-place swap.

**Latest recap:** section title "LATEST RECAP". Grid 340px / 1fr: left poster card; right: flavor chip "WORKSHOP, COMPLETE", Silkscreen title "LOCAL MODELS WITH GEMMA 4", mono meta "WED, JUL 8 · GOOGLE SHIBUYA", 1-sentence abstract, flavor Tags, primary Button "Read the recap →" → event page.

**Past events (`#events`):** section title; 3-column grid (gap 24) of all events, newest first. Each card (design-system Card): square poster image, title, mono meta line, blurb, flavor tags; whole card is a link to that event's page; hover lift.

**Footer:** paper, 3px ink top rule. Grid 1.4fr/1fr: left — Silkscreen "VIBE CODERS MEETUP" (red O) + faint "TOKYO & SINGAPORE", muted about blurb ("A cozy meetup for vibe-coding novices and enthusiasts. Fun project shareouts, AI-tool discussions, workshops, and free pizza."); right — mono link column: "▸ Tokyo on lu.ma", "▸ Singapore on lu.ma", "▸ Past events", "▸ Sign up". Bottom strip (2px ink rule): centered faint "Cozy vibes.▮".

### 2. Event page (`event.html`)
One page per past event; the bundled file is the filled-in template for "Local Models with Gemma 4". Text-measure container (680px). Top to bottom:
- Same header (nav links point back to `index.html#...` anchors)
- "← All events" text link
- Flavor chip "RECAP"; Silkscreen H1 (event title); muted mono meta line
- Full-width poster image (2px ink border, pixel shadow); flavor Tags
- Recap paragraph (verbatim): "Gemma workshop, complete! 🎉 Thank you to everyone who braved the long lines to completely pack the room for our local models session! You can find the workshop materials on GitHub." ("on GitHub" links to https://github.com/bebechien/gemma/blob/main/workshop/20260708.VIBE%20CODERS%20TOKYO.md)
- "TAKEAWAYS" heading + bullet list: "💡 You do not need a massive GPU to start vibe coding with Gemma! You can prototype rapidly right inside Google AI Studio for free."
- "PHOTOS" heading + 3×2 grid (gap 8) of square photo slots, each 2px ink border. In the prototype these are drag-and-drop `<image-slot>` placeholders; in production, real event photos.
- Sunken note box (paper-2 bg, 2px ink border): "PHOTOS & SLIDES → shared in the newsletter. Not on it yet? Scroll down."
- Secondary Button "← Back to all events"
- Newsletter band + footer (shared)

## Interactions & Behavior
- Nav + footer anchors: smooth scroll (`scroll-behavior: smooth`) to `#chapters`, `#events`, `#newsletter`; from the event page they navigate to `index.html#...`.
- Photo rotator: 3s interval, instant swap, dots jump to index. No pause-on-hover implemented (add if desired).
- Newsletter: submit requires non-empty email; swaps form → confirmation in place, no navigation.
- Buttons/cards: brand hover lift and press sink (see tokens). Event cards: whole card clickable.
- All animation 120–180ms; blink uses `steps()`. No fades, bounces, or parallax anywhere.

## State Management
- `subscribed: boolean` (persisted; prototype uses localStorage key `vbt-subscribed`)
- `rotatorIndex: number` (client-only)
- Events are static content: `data.js` shows the model — `{id, img, title, meta, flavor, tags[], blurb, href}` plus `VBT_LINKS.{tokyo,sg}`. In production this becomes markdown/CMS entries; event pages should be generated from it.

## Assets
- `assets/logo-tokyo.avif` — Tokyo chapter logo (from the design system)
- `assets/logo-sg.png` — Singapore chapter logo (provided by organizers)
- `assets/events/vbt-{2,3,4,6,7,8,9}.avif` — event posters (from the design system)
- Fonts load from Google Fonts CDN (see `_ds/.../tokens/fonts.css`)
- Render pixel-art logos with `image-rendering: pixelated`

## Screenshots
- `screenshots/landing.png` — full landing page
- `screenshots/newsletter-subscribed-state.png` — landing after newsletter submit (in-place confirmation)
- `screenshots/event-page.png` — event page (recap + photo grid)

## Known placeholders / TODOs for implementation
- lu.ma URLs (`https://lu.ma/vibecoders-tokyo`, `https://lu.ma/vibecoders-sg`) are guesses — replace.
- Newsletter form needs a real backend/provider.
- Event photo grids and hero rotator await real photos (posters stand in).
- Only one event page exists; generate the other six from the same template.
