/**
 * Vibe Coders chapter logo, rebuilt as vector art.
 *
 * The original Tokyo logo (`src/content/chapters/tokyo.avif`) is a bitmap of
 * chunky pixel letters, each wrapped in a thin outline set about one pixel
 * away, framed by terminal-style brackets. This module redraws it on a grid:
 * letters are 11-cell-tall bitmaps, and the outline is the letter dilated by
 * `RING_OUTER` minus the letter dilated by `RING_GAP`.
 *
 * Everything here is pure string building — no DOM — so the page renders the
 * same SVG during prerender and in the browser.
 */

/** One grid cell, in SVG user units. */
const U = 10

/** Glyph height in cells. */
const GLYPH_H = 11

/** White gap between a letter and its outline, in cells. */
const RING_GAP = 0.8
/** Outer edge of the outline, in cells. The outline is RING_OUTER − RING_GAP thick. */
const RING_OUTER = 1.2
/**
 * Notches narrower than about twice this many cells are bridged before the
 * outline is traced, so it runs straight past the stair-steps of K, S and Y
 * the way the original's does instead of shadowing every one.
 */
const RING_SMOOTHING = 1

const LETTER_GAP = 1.2
const ROW_GAP = 3.6
const SPACE_W = 5

/** `#` is a filled cell. Every row of a glyph must be the same width. */
const GLYPHS: Record<string, string[]> = {
  A: ['.########.', '##########', '###....###', '###....###', '###....###', '##########', '##########', '###....###', '###....###', '###....###', '###....###'],
  B: ['#########.', '##########', '###....###', '###...####', '#########.', '#########.', '##########', '###....###', '###...####', '##########', '#########.'],
  C: ['.#########', '.#########', '####......', '###.......', '###.......', '###.......', '###.......', '###.......', '####......', '.#########', '.#########'],
  D: ['#########.', '#########.', '###...####', '###....###', '###....###', '###....###', '###....###', '###....###', '###...####', '#########.', '#########.'],
  E: ['.#########', '.#########', '###.......', '###.......', '########..', '########..', '########..', '###.......', '###.......', '.#########', '.#########'],
  F: ['.#########', '.#########', '###.......', '###.......', '########..', '########..', '########..', '###.......', '###.......', '###.......', '###.......'],
  G: ['.#########', '.#########', '####......', '###.......', '###..#####', '###..#####', '###....###', '###....###', '####..####', '.########.', '.########.'],
  H: ['###....###', '###....###', '###....###', '###....###', '##########', '##########', '##########', '###....###', '###....###', '###....###', '###....###'],
  I: ['#########', '#########', '...###...', '...###...', '...###...', '...###...', '...###...', '...###...', '...###...', '#########', '#########'],
  J: ['....######', '....######', '.......###', '.......###', '.......###', '.......###', '.......###', '###....###', '####..####', '.########.', '.########.'],
  K: ['###....###', '###...####', '###..####.', '########..', '#######...', '######....', '#######...', '########..', '###..####.', '###...####', '###....###'],
  L: ['###.......', '###.......', '###.......', '###.......', '###.......', '###.......', '###.......', '###.......', '###.......', '.#########', '.#########'],
  M: ['####..####', '##########', '##########', '###.##.###', '###.##.###', '###....###', '###....###', '###....###', '###....###', '###....###', '###....###'],
  N: ['###....###', '####...###', '#####..###', '######.###', '##########', '###.######', '###..#####', '###...####', '###....###', '###....###', '###....###'],
  O: ['.########.', '.########.', '####..####', '###....###', '###....###', '###....###', '###....###', '###....###', '####..####', '.########.', '.########.'],
  P: ['#########.', '##########', '###....###', '###....###', '##########', '#########.', '###.......', '###.......', '###.......', '###.......', '###.......'],
  Q: ['.########.', '.########.', '####..####', '###....###', '###....###', '###....###', '###.##.###', '###..#####', '####..####', '.#########', '.########.'],
  R: ['#########.', '##########', '###....###', '###....###', '##########', '#########.', '###..###..', '###..####.', '###...####', '###....###', '###....###'],
  S: ['.#########', '.#########', '###.......', '###.......', '#########.', '.#########', '.......###', '.......###', '......####', '#########.', '#########.'],
  T: ['##########', '##########', '...####...', '...####...', '...####...', '...####...', '...####...', '...####...', '...####...', '...####...', '...####...'],
  U: ['###....###', '###....###', '###....###', '###....###', '###....###', '###....###', '###....###', '###....###', '####..####', '.########.', '.########.'],
  V: ['###.....###', '###.....###', '###.....###', '###.....###', '####...####', '.####.####.', '.#########.', '..#######..', '..#######..', '...#####...', '...#####...'],
  W: ['###.....###', '###.....###', '###.....###', '###.....###', '###.###.###', '###.###.###', '###########', '###########', '.####.####.', '.###...###.', '.###...###.'],
  X: ['###....###', '###....###', '.###..###.', '..######..', '...####...', '...####...', '...####...', '..######..', '.###..###.', '###....###', '###....###'],
  Y: ['###....###', '###....###', '###....###', '##########', '.########.', '...####...', '...####...', '...####...', '...####...', '...####...', '...####...'],
  Z: ['##########', '##########', '......####', '.....####.', '....####..', '...####...', '..####....', '.####.....', '####......', '##########', '##########'],
  0: ['.########.', '.########.', '####..####', '###....###', '###.##.###', '###.##.###', '###.##.###', '###....###', '####..####', '.########.', '.########.'],
  1: ['...####...', '.######...', '.######...', '...####...', '...####...', '...####...', '...####...', '...####...', '...####...', '##########', '##########'],
  2: ['.########.', '##########', '###....###', '.......###', '......####', '....#####.', '..#####...', '.####.....', '####......', '##########', '##########'],
  3: ['#########.', '##########', '.......###', '.......###', '..#######.', '..#######.', '.......###', '.......###', '.......###', '##########', '#########.'],
  4: ['###....###', '###....###', '###....###', '###....###', '##########', '##########', '.......###', '.......###', '.......###', '.......###', '.......###'],
  5: ['##########', '##########', '###.......', '###.......', '#########.', '##########', '.......###', '.......###', '.......###', '##########', '#########.'],
  6: ['.########.', '.#########', '####......', '###.......', '#########.', '##########', '###....###', '###....###', '####..####', '.########.', '.########.'],
  7: ['##########', '##########', '.......###', '......####', '.....####.', '....####..', '...####...', '...####...', '...####...', '...####...', '...####...'],
  8: ['.########.', '##########', '###....###', '###....###', '.########.', '.########.', '###....###', '###....###', '###....###', '##########', '.########.'],
  9: ['.########.', '.########.', '####..####', '###....###', '###....###', '##########', '.#########', '.......###', '......####', '#########.', '#########.'],
  '-': ['......', '......', '......', '......', '......', '######', '######', '......', '......', '......', '......'],
  '.': ['...', '...', '...', '...', '...', '...', '...', '...', '...', '###', '###'],
  "'": ['###', '###', '###', '###', '...', '...', '...', '...', '...', '...', '...'],
  '!': ['###', '###', '###', '###', '###', '###', '###', '...', '...', '###', '###'],
}

export const SUPPORTED_CHARACTERS = Object.keys(GLYPHS).join('')

export interface LogoOptions {
  /** City name. `\n` starts another line. */
  city: string
  /** Letter colour. */
  ink: string
  /** Accent colour for the letters listed in `accents`. */
  accent: string
  /** Background colour, or `null` for transparent. */
  background: string | null
  /** Keys (`r<row>c<index>`) of letters drawn in the accent colour. */
  accents: string[]
  /** Draw the terminal-style frame around the words. */
  frame: boolean
  /** Draw the thin outline around each letter. */
  outline: boolean
  /** Pad the shorter side so the canvas is square. */
  square: boolean
  /**
   * Space around the logo on each side, as a percentage of its longer side.
   * 37 reproduces the original TOKYO logo's canvas.
   */
  margin: number
  /** Add transparent hit areas and data-key attributes for click-to-accent. */
  interactive?: boolean
}

export interface LogoResult {
  svg: string
  width: number
  height: number
  /** Characters in the input that have no glyph and were skipped. */
  unsupported: string[]
}

/** The red O in "CODERS", as in the original. */
export const DEFAULT_ACCENTS = ['r1c1']

export const DEFAULT_MARGIN = 37

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

interface PlacedLetter {
  key: string
  /** Filled cells merged into horizontal runs. */
  fill: Rect[]
  /** Same, with enclosed counters filled in — the outline hugs the outside only. */
  solid: Rect[]
  box: Rect
}

interface Row {
  letters: PlacedLetter[]
  x: number
  y: number
  w: number
}

const n = (v: number) => Number((v * U).toFixed(2))

function rectsToPath(rects: Rect[]): string {
  return rects.map((r) => `M${n(r.x)} ${n(r.y)}h${n(r.w)}v${n(r.h)}h${n(-r.w)}z`).join('')
}

/** Merges each row's filled cells into runs, offset to (ox, oy). */
function runs(grid: boolean[][], ox: number, oy: number): Rect[] {
  const out: Rect[] = []
  grid.forEach((row, y) => {
    let start = -1
    for (let x = 0; x <= row.length; x++) {
      if (x < row.length && row[x]) {
        if (start < 0) start = x
      } else if (start >= 0) {
        out.push({ x: ox + start, y: oy + y, w: x - start, h: 1 })
        start = -1
      }
    }
  })
  return out
}

/** Morphological closing with a square of radius `r`, growing the grid by `r` a side. */
function closed(grid: boolean[][], r: number): boolean[][] {
  const h = grid.length + r * 2
  const w = grid[0].length + r * 2
  const at = (g: boolean[][], x: number, y: number) => g[y]?.[x] ?? false
  const padded = Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => at(grid, x - r, y - r)),
  )
  const sweep = (g: boolean[][], hit: boolean) =>
    g.map((row, y) =>
      row.map((_, x) => {
        for (let dy = -r; dy <= r; dy++)
          for (let dx = -r; dx <= r; dx++) if (at(g, x + dx, y + dy) === hit) return hit
        return !hit
      }),
    )
  return sweep(sweep(padded, true), false)
}

/** Fills enclosed counters (the hole in O, B, R…) by flooding from the edge. */
function withCountersFilled(grid: boolean[][]): boolean[][] {
  const h = grid.length
  const w = grid[0].length
  const outside = grid.map((row) => row.map(() => false))
  const stack: [number, number][] = []
  for (let x = 0; x < w; x++) stack.push([x, 0], [x, h - 1])
  for (let y = 0; y < h; y++) stack.push([0, y], [w - 1, y])
  while (stack.length) {
    const [x, y] = stack.pop()!
    if (x < 0 || y < 0 || x >= w || y >= h || outside[y][x] || grid[y][x]) continue
    outside[y][x] = true
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  return grid.map((row, y) => row.map((cell, x) => cell || !outside[y][x]))
}

function layoutRow(text: string, rowIndex: number, unsupported: Set<string>): Row {
  const letters: PlacedLetter[] = []
  let x = 0
  let index = 0
  let pendingGap = false
  for (const char of text) {
    if (char === ' ') {
      if (letters.length) x += SPACE_W
      pendingGap = false
      continue
    }
    const glyph = GLYPHS[char]
    if (!glyph) {
      unsupported.add(char)
      continue
    }
    if (pendingGap) x += LETTER_GAP
    const grid = glyph.map((line) => [...line].map((c) => c === '#'))
    const w = glyph[0].length
    letters.push({
      key: `r${rowIndex}c${index++}`,
      fill: runs(grid, x, 0),
      solid: runs(
        withCountersFilled(closed(grid, RING_SMOOTHING)),
        x - RING_SMOOTHING,
        -RING_SMOOTHING,
      ),
      box: { x, y: 0, w, h: GLYPH_H },
    })
    x += w
    pendingGap = true
  }
  // Trailing spaces would otherwise widen the row and push it off centre.
  const w = letters.length ? Math.max(...letters.map((l) => l.box.x + l.box.w)) : 0
  return { letters, x: 0, y: 0, w }
}

function shift(rects: Rect[], dx: number, dy: number): Rect[] {
  return rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }))
}

/** The chevron, top-right corner, bracket feet and cursor, all in cells. */
function frameRects(rows: Row[]): { solid: Rect[]; hairline: Rect[] } {
  const first = rows[0]
  const middle = rows[1]
  const last = rows[rows.length - 1]
  // Clear the widest line's outline, and leave the brackets room around the
  // last line as the original does around TOKYO.
  const left = Math.min(...rows.map((r) => r.x - 2), last.x - 4.4)
  const right = Math.max(...rows.map((r) => r.x + r.w + 2), last.x + last.w + 4.4)
  const firstBottom = first.y + GLYPH_H
  const lastBottom = last.y + GLYPH_H
  const hair = RING_OUTER - RING_GAP

  const solid: Rect[] = [
    // "›" prompt beside VIBE
    { x: left, y: first.y - 4.4, w: 2.9, h: 1.6 },
    { x: left + 1.6, y: first.y - 2.8, w: 2.9, h: 1.6 },
    { x: left + 2.8, y: first.y - 1.2, w: 2.9, h: 2.8 },
    { x: left + 1.6, y: first.y + 1.6, w: 2.9, h: 1.6 },
    { x: left, y: first.y + 3.2, w: 2.9, h: 1.6 },

    // "¬" corner at the top right
    { x: right - 12.6, y: first.y - 1.4, w: 10, h: 1.2 },
    { x: right - 2.6, y: first.y - 0.6, w: 1.4, h: 1.8 },
    { x: right - 1.4, y: first.y + 1.2, w: 1.4, h: firstBottom + 1.6 - (first.y + 1.2) },

    // "[_" and "_]" around the last line
    { x: left, y: last.y - 1.2, w: 1.6, h: GLYPH_H + 1.2 },
    { x: left + 1.6, y: lastBottom + 0.4, w: 2.8, h: 1.2 },
    { x: right - 1.6, y: last.y - 1.2, w: 1.6, h: GLYPH_H + 1.2 },
    { x: right - 4.4, y: lastBottom + 0.4, w: 2.8, h: 1.2 },

    // Blinking-cursor underscore
    { x: right - 5.8, y: lastBottom + 4.8, w: 5.8, h: 1.4 },
  ]

  // The thin double rule to the left of CODERS and the single one to its right.
  const hairline: Rect[] = [
    { x: left, y: middle.y + 1.6, w: hair, h: GLYPH_H - 3.6 },
    { x: left + 0.8, y: middle.y + 1.6, w: hair, h: GLYPH_H - 3.6 },
    { x: right - hair, y: middle.y + 5.6, w: hair, h: GLYPH_H - 5.2 },
  ]

  return { solid, hairline }
}

function bounds(rects: Rect[]): Rect {
  const x0 = Math.min(...rects.map((r) => r.x))
  const y0 = Math.min(...rects.map((r) => r.y))
  const x1 = Math.max(...rects.map((r) => r.x + r.w))
  const y1 = Math.max(...rects.map((r) => r.y + r.h))
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

export function buildLogo(options: LogoOptions): LogoResult {
  const unsupported = new Set<string>()
  const lines = ['VIBE', 'CODERS', ...options.city.toUpperCase().split('\n')]
    .map((line) => line.trim())
    .filter((line, i) => i < 2 || line.length > 0)

  const rows = lines
    .map((line, i) => layoutRow(line, i, unsupported))
    .filter((row, i) => i < 2 || row.letters.length > 0)

  // Centre every line on a shared axis and stack them.
  const widest = Math.max(...rows.map((r) => r.w))
  rows.forEach((row, i) => {
    row.x = (widest - row.w) / 2
    row.y = i * (GLYPH_H + ROW_GAP)
  })

  const letters = rows.flatMap((row) =>
    row.letters.map((l) => ({
      ...l,
      fill: shift(l.fill, row.x, row.y),
      solid: shift(l.solid, row.x, row.y),
      box: { ...l.box, x: l.box.x + row.x, y: l.box.y + row.y },
    })),
  )

  const frame = options.frame ? frameRects(rows) : { solid: [], hairline: [] }

  const reach = options.outline ? RING_OUTER : 0
  const content = bounds([
    ...letters.map((l) => ({
      x: l.box.x - reach,
      y: l.box.y - reach,
      w: l.box.w + reach * 2,
      h: l.box.h + reach * 2,
    })),
    ...frame.solid,
    ...frame.hairline,
  ])

  // Margin on every side, as a fraction of the logo's longer side.
  const pad = (Math.max(content.w, content.h) * options.margin) / 100
  let w = content.w + pad * 2
  let h = content.h + pad * 2
  if (options.square) w = h = Math.max(w, h)
  const ox = content.x - (w - content.w) / 2
  const oy = content.y - (h - content.h) / 2

  const accents = new Set(options.accents)
  const colorOf = (key: string) => (accents.has(key) ? options.accent : options.ink)
  // Accented letters paint last so their outline wins where outlines overlap.
  const ordered = [...letters].sort(
    (a, b) => Number(accents.has(a.key)) - Number(accents.has(b.key)),
  )

  const miter = 'stroke-linejoin="miter" stroke-miterlimit="4"'
  const parts: string[] = []
  const vw = n(w)
  const vh = n(h)

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(ox)} ${n(oy)} ${vw} ${vh}" width="${vw}" height="${vh}">`,
  )
  parts.push(`<title>Vibe Coders ${escapeAttr(options.city.replace(/\n/g, ' ').trim())}</title>`)

  if (options.outline) {
    // Everything within RING_GAP of a letter is cut away, leaving only a thin ring.
    parts.push(
      `<defs><mask id="vc-ring-gap" maskUnits="userSpaceOnUse" x="${n(ox)}" y="${n(oy)}" width="${vw}" height="${vh}">` +
        `<rect x="${n(ox)}" y="${n(oy)}" width="${vw}" height="${vh}" fill="#fff"/>` +
        `<path d="${letters.map((l) => rectsToPath(l.solid)).join('')}" fill="#000" stroke="#000" stroke-width="${n(RING_GAP * 2)}" ${miter}/>` +
        `</mask></defs>`,
    )
  }

  if (options.background) {
    parts.push(
      `<rect x="${n(ox)}" y="${n(oy)}" width="${vw}" height="${vh}" fill="${escapeAttr(options.background)}"/>`,
    )
  }

  if (options.outline) {
    parts.push('<g mask="url(#vc-ring-gap)">')
    for (const l of ordered) {
      const c = escapeAttr(colorOf(l.key))
      parts.push(
        `<path d="${rectsToPath(l.solid)}" fill="${c}" stroke="${c}" stroke-width="${n(RING_OUTER * 2)}" ${miter}/>`,
      )
    }
    parts.push('</g>')
  }

  for (const l of letters) {
    const c = escapeAttr(colorOf(l.key))
    if (options.interactive) {
      parts.push(
        `<g data-key="${l.key}" class="logo-letter"><rect x="${n(l.box.x - 0.6)}" y="${n(l.box.y - 0.6)}" width="${n(l.box.w + 1.2)}" height="${n(l.box.h + 1.2)}" fill="transparent"/><path d="${rectsToPath(l.fill)}" fill="${c}"/></g>`,
      )
    } else {
      parts.push(`<path d="${rectsToPath(l.fill)}" fill="${c}"/>`)
    }
  }

  if (options.frame) {
    const c = escapeAttr(options.ink)
    parts.push(
      `<path d="${rectsToPath([...frame.solid.slice(0, -1), ...frame.hairline])}" fill="${c}"/>`,
    )
    const cursor = frame.solid[frame.solid.length - 1]
    parts.push(`<path class="logo-cursor" d="${rectsToPath([cursor])}" fill="${c}"/>`)
  }

  parts.push('</svg>')

  return {
    svg: parts.join(''),
    width: vw,
    height: vh,
    unsupported: [...unsupported],
  }
}
