# Vibe Coders Design System

Design system for **Vibe Coders Tokyo** (a.k.a. "Tokyo Vibe Coders") — a cozy, playful meetup for vibe-coding novices and enthusiasts, based in Tokyo with offshoots in other cities (Singapore). No startup pitching vibes: fun project shareouts, AI-tool discussions, workshops, free pizza.

**Sources provided:** logo (`assets/logo.avif`) and 7 event artworks (`assets/events/vbt-*.avif`). No codebase, Figma, or font binaries were provided; components below are authored from scratch against the brand direction ("cozy but techy — 8-bit pixel art + heavy monospaced typography").

## CONTENT FUNDAMENTALS

- Voice: friendly organizer, first-person-plural ("Join our first 2026 meetup"), addressing "you". Casual, direct, zero corporate speak.
- Event titles: ALL-CAPS display ("TOKYO VIBE CODERS #3", "ANTIGRAVITY WORKSHOP"). Numbered editions with "#".
- Metadata lines are terse mono strings with middle-dot separators: `WED, JAN 28 · 7-9PM · Meguro`.
- Descriptions: one or two plain sentences, enthusiasm through content not punctuation ("fun project shareouts and AI tools discussions!"). One exclamation mark max.
- Playful lowercase moments allowed ("models models models").
- No emoji in copy; pixel-art icons and unicode glyphs carry the playfulness instead.
- Sentence case for body, caps for titles/labels/buttons.

## VISUAL FOUNDATIONS

- **Palette:** warm ink (#17130d) on warm paper (#f5efe1); pixel red (#e23d28, the logo's red "O") is THE accent. Each event gets a "flavor" secondary: navy/blue, lime, purple, gold, peach — used one at a time, never all at once. Semantic tokens in `tokens/colors.css`.
- **Type:** Silkscreen (pixel, 700) for hero/display/brand moments and buttons; Silkscreen (700) also for section headers and card titles, tracked tight (`--tracking-heading`, -0.08em) so the wide-set pixel face stays readable; JetBrains Mono for body and all UI; DotGothic16 for Japanese pixel accents. Loaded from Google Fonts CDN (see FLAGS). Mono runs wide — keep sizes modest, line-height 1.65 for body.
- **Backgrounds:** flat warm paper by default; soft grainy radial gradient blobs (red/purple/gold) for hero/poster moments, echoing event artwork. Optional fine grain texture. Dark mode = ink surface with paper text (used in posters, not the default site).
- **Corners:** none. `border-radius: 0` everywhere (2px max on tiny chips). Pixel-stepped corners on featured cards via clip-path.
- **Borders:** 2px solid ink (3px heavy). Borders do the work shadows normally do.
- **Shadows:** hard pixel offsets only, zero blur: `4px 4px 0 var(--ink)`. Never soft shadows.
- **Hover:** lift — translate(-2px,-2px) + shadow grows to 6px. Links get red-tint background highlight.
- **Press:** sink — translate(2px,2px), shadow collapses to none.
- **Animation:** fast (120–180ms), snappy cubic-bezier; blink/step animations (`steps()`) for cursor and playful bits. No fades, no bounces, no parallax.
- **Cards:** white surface, 2px ink border, 4px hard shadow, no rounding. Event cards carry full-bleed artwork on top.
- **Imagery:** the event posters ARE the imagery — warm, grainy, poster-like. Use them full-bleed in cards. No stock photos.
- **Layout:** centered container 1080px, text measure 680px, 8px grid. Blinking `▮` cursor as terminal-flavored punctuation.
- **Transparency/blur:** none. Everything opaque and hard-edged.

## ICONOGRAPHY

- Brand artwork uses chunky pixel-art icons (pixelated OK-hand, pizza slice) and sparkle/star shapes. These are raster art; no icon set was provided.
- In UI, use unicode glyphs styled in pixel/mono type as icons: `▸ ▾ ▮ ✚ ✕ ★ ▚ →`. Checkboxes/selects draw their marks with these.
- No icon font, no emoji, no hand-rolled SVG icons. If real pixel icons are needed, ask the organizers for exported PNGs.
- Logo: `assets/logo.avif` (stacked pixel wordmark, red O, pixel brackets). Don't redraw it; in nav use it at small size or set "VIBE CODERS TOKYO" in Silkscreen.

## FLAGS

- **Fonts load from Google Fonts CDN** (`tokens/fonts.css`), no binaries in repo. Silkscreen + JetBrains Mono + DotGothic16 are exact Google Fonts; if the real event artwork fonts (a heavy grotesque like Archivo Black for posters) should be part of the system, provide files.
- No pixel-art icon assets provided — UI uses unicode glyphs (see ICONOGRAPHY).

## Intentional additions

- `Tag` — event-flavor chip used by cards and MultiSelect; needed to render topics.

## Index

- `styles.css` — global entry; imports everything in `tokens/`.
- `tokens/` — fonts, colors, typography, spacing, effects.
- `assets/` — `logo.avif`, `events/vbt-*.avif` (event posters #2–#9).
- `guidelines/` — specimen cards for the Design System tab.
- `components/actions/` — Button. `components/forms/` — Input, Select, MultiSelect. `components/display/` — Card, Tag. `components/layout/` — Header.
- `ui_kits/website/` — landing page recreation (`index.html` + screens).
- `SKILL.md` — agent skill entry point.
