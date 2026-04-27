# Vibe Coders Community Website

This repository contains the placeholder website for the Vibe Coders Community.

## 🛠 Tech Stack

- **HTML5** for semantic structure
- **Vanilla CSS** for modern styling (Glassmorphism, custom CSS properties, responsive media queries, animations)
- **Vanilla JavaScript** for dynamic interactions (3D card tilt and cursor tracking glow)
- **Vite** as the fast development server

---

## 🚀 Getting Started

### Prerequisites
You will need [Node.js](https://nodejs.org/) installed along with a package manager like `npm` or `pnpm`.

### Installation
Clone the repository and install the development dependencies:

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### Development Server
To spin up a local development server with Hot Module Replacement (HMR):

```bash
# Using pnpm
pnpm run dev

# Or using npm
npm run dev
```

This will start a Vite server (usually at `http://localhost:5173`) and automatically open it in your browser. Any changes you make to `index.html`, `styles.css`, or `script.js` will be reflected instantly!

---

## 🐛 Debugging

- **Layout & CSS**: Use your browser's Developer Tools (Right-click -> Inspect). Use the device toolbar (Responsive Design Mode) to test how the layout adapts to mobile screens (the buttons should stack vertically under `640px`).
- **JavaScript & Interactions**: If the 3D tilt effect or mouse tracking glow isn't working, check the **Console** tab in Developer Tools for errors originating from `script.js`.
- **Server Issues**: If `pnpm run dev` fails to start, ensure no other service is blocking the Vite port, or try deleting the `node_modules` folder and running `pnpm install` again.

---

## 🌐 Deployment
This website is hosted via **GitHub Pages**. 

Since it relies entirely on static assets, the `main` branch can be served directly. The included `.nojekyll` file tells GitHub Pages to bypass its default Jekyll static site generator build process, ensuring all files are served exactly as they are.

If you want to bundle and minify the assets for production in the future, you can run:
```bash
npm run build
```
*(Note: Building is currently optional as we are serving the root directory directly to GitHub Pages).*
