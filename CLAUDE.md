# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install       # Install dependencies
pnpm run dev       # Start Vite dev server (http://localhost:5173)
pnpm run build     # Bundle and minify for production
pnpm run preview   # Preview production build locally
```

## Architecture

This is a single-page static website with no framework — just three files:

- `index.html` — page structure and content (glassmorphism card with community links)
- `styles.css` — all styling (CSS custom properties, glassmorphism, animations, responsive layout)
- `script.js` — interactive effects (3D card tilt on mousemove, cursor-tracking glow)

Vite is used only as a dev server with HMR; it is not required for deployment. The site is served directly from the `main` branch via GitHub Pages (no Jekyll build step, hence `.nojekyll`).

The responsive breakpoint for button stacking is `640px`.
