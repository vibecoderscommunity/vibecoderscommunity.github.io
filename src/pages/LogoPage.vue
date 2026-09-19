<script setup lang="ts">
import { computed, ref } from 'vue'
import DsButton from '@/components/ds/DsButton.vue'
import { site } from '@/lib/content'
import { useHead } from '@/lib/head'
import {
  buildLogo,
  DEFAULT_ACCENTS,
  DEFAULT_MARGIN,
  SUPPORTED_CHARACTERS,
  type LogoOptions,
} from '@/lib/logo'

useHead(() => ({
  title: `Logo generator — ${site.title}`,
  description: 'Make a "Vibe Coders <City>" logo in the chapter style and export it as SVG or PNG.',
}))

type Background = 'white' | 'paper' | 'transparent' | 'dark'

const backgrounds: { value: Background; label: string }[] = [
  { value: 'white', label: 'White' },
  { value: 'paper', label: 'Paper' },
  { value: 'transparent', label: 'Clear' },
  { value: 'dark', label: 'Dark' },
]

const backgroundColor: Record<Background, string | null> = {
  white: '#ffffff',
  paper: '#f5efe1',
  transparent: null,
  dark: '#17130d',
}

/** The red sampled from the original Tokyo logo. */
const LOGO_RED = '#e90e10'

const city = ref('Tokyo')
const background = ref<Background>('white')
const accent = ref(LOGO_RED)
const accents = ref<string[]>([...DEFAULT_ACCENTS])
const frame = ref(true)
const outline = ref(true)
const square = ref(true)
const margin = ref(DEFAULT_MARGIN)
const pngWidth = ref(1200)

const options = computed<LogoOptions>(() => ({
  city: city.value,
  ink: background.value === 'dark' ? '#fffdf7' : '#000000',
  accent: accent.value,
  background: backgroundColor[background.value],
  accents: accents.value,
  frame: frame.value,
  outline: outline.value,
  square: square.value,
  margin: margin.value,
}))

const preview = computed(() => buildLogo({ ...options.value, interactive: true }))

const slug = computed(
  () =>
    city.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'logo',
)

function toggleAccent(event: MouseEvent) {
  const key = (event.target as Element).closest('[data-key]')?.getAttribute('data-key')
  if (!key) return
  accents.value = accents.value.includes(key)
    ? accents.value.filter((k) => k !== key)
    : [...accents.value, key]
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function exportSvg() {
  const { svg } = buildLogo(options.value)
  download(new Blob([svg], { type: 'image/svg+xml' }), `vibe-coders-${slug.value}.svg`)
}

async function exportPng() {
  const { svg, width, height } = buildLogo(options.value)
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  try {
    const image = new Image()
    image.src = url
    await image.decode()

    const canvas = document.createElement('canvas')
    canvas.width = pngWidth.value
    canvas.height = Math.round((pngWidth.value * height) / width)
    canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
    if (blob) download(blob, `vibe-coders-${slug.value}.png`)
  } finally {
    URL.revokeObjectURL(url)
  }
}
</script>

<template>
  <div class="logo-page container">
    <div class="chip logo-page__chip">Tools</div>
    <h1 class="logo-page__title">Chapter logo generator</h1>
    <p class="logo-page__lede">
      Type a city and get a “Vibe Coders” logo in the same pixel style as the Tokyo one. Click a
      letter to switch it between black and the accent colour.
    </p>

    <div class="logo-page__layout">
      <div
        class="logo-page__preview"
        :class="`is-${background}`"
        role="img"
        :aria-label="`Vibe Coders ${city} logo preview`"
        @click="toggleAccent"
        v-html="preview.svg"
      />

      <form class="logo-page__controls" @submit.prevent>
        <label class="field">
          <span class="field__label">City</span>
          <textarea v-model="city" rows="2" spellcheck="false" class="field__input" />
          <span class="field__note">Start a new line to stack a long name.</span>
          <span v-if="preview.unsupported.length" class="field__note is-error">
            Skipped {{ preview.unsupported.join(' ') }} — the font covers A–Z, 0–9 and
            <code>{{ SUPPORTED_CHARACTERS.replace(/[A-Z0-9]/g, '') }}</code>.
          </span>
        </label>

        <fieldset class="field">
          <legend class="field__label">Background</legend>
          <div class="segmented">
            <label v-for="b in backgrounds" :key="b.value" class="segmented__option">
              <input v-model="background" type="radio" name="background" :value="b.value" />
              <span>{{ b.label }}</span>
            </label>
          </div>
        </fieldset>

        <label class="field field--inline">
          <span class="field__label">Accent</span>
          <input v-model="accent" type="color" class="swatch" />
          <button type="button" class="link-button" @click="accent = LOGO_RED">Reset</button>
          <button type="button" class="link-button" @click="accents = []">Clear accents</button>
        </label>

        <fieldset class="field">
          <legend class="field__label">Details</legend>
          <label class="check"><input v-model="frame" type="checkbox" /> Terminal frame</label>
          <label class="check"><input v-model="outline" type="checkbox" /> Letter outlines</label>
          <label class="check"><input v-model="square" type="checkbox" /> Square canvas</label>
        </fieldset>

        <label class="field">
          <span class="field__label">Margin</span>
          <span class="range">
            <input v-model.number="margin" type="range" min="0" max="100" step="1" />
            <output class="range__value">{{ margin }}%</output>
            <button type="button" class="link-button" @click="margin = DEFAULT_MARGIN">
              Reset
            </button>
          </span>
          <span class="field__note">Space on each side, relative to the logo's width.</span>
        </label>

        <fieldset class="field">
          <legend class="field__label">Export</legend>
          <div class="logo-page__export">
            <DsButton @click="exportSvg">Download SVG</DsButton>
            <DsButton variant="secondary" @click="exportPng">Download PNG</DsButton>
          </div>
          <label class="field field--inline">
            <span class="field__note">PNG width</span>
            <select v-model.number="pngWidth" class="field__input field__input--select">
              <option :value="600">600px</option>
              <option :value="1200">1200px</option>
              <option :value="2400">2400px</option>
            </select>
          </label>
        </fieldset>
      </form>
    </div>
  </div>
</template>

<style scoped>
.logo-page {
  padding-block: var(--space-8);
}

.logo-page__chip {
  background: var(--gold);
  margin-bottom: var(--space-4);
}

.logo-page__title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  text-transform: uppercase;
  margin: 0 0 var(--space-3);
}

.logo-page__lede {
  color: var(--text-muted);
  max-width: var(--container-text);
  margin: 0 0 var(--space-6);
}

.logo-page__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--space-6);
  align-items: start;
}

.logo-page__preview {
  border: var(--border-w) solid var(--ink);
  box-shadow: var(--shadow-pixel);
  background: #fff;
  line-height: 0;
}

.logo-page__preview.is-paper {
  background: var(--paper);
}

.logo-page__preview.is-dark {
  background: var(--ink);
}

/* Checkerboard so a transparent export reads as transparent. */
.logo-page__preview.is-transparent {
  background: repeating-conic-gradient(var(--paper-2) 0 25%, var(--white) 0 50%) 0 0 / 16px 16px;
}

.logo-page__preview :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.logo-page__preview :deep(.logo-letter) {
  cursor: pointer;
}

.logo-page__preview :deep(.logo-cursor) {
  animation: px-blink 1s steps(1) infinite;
}

.logo-page__controls {
  display: grid;
  gap: var(--space-5);
}

.logo-page__export {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.field {
  display: grid;
  gap: var(--space-2);
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}

.field--inline {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.field__label {
  font-family: var(--font-pixel);
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0;
  margin-bottom: var(--space-2);
}

.field--inline .field__label {
  margin-bottom: 0;
}

.field__input {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  padding: 10px 12px;
  border: var(--border-w) solid var(--ink);
  border-radius: 0;
  background: var(--white);
  color: var(--text-body);
  resize: vertical;
  outline: none;
}

.field__input:focus {
  box-shadow: inset 3px 3px 0 var(--paper-3);
}

.field__input--select {
  font-size: var(--text-sm);
  padding: 6px 8px;
}

.field__note {
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.field__note.is-error {
  color: var(--error);
}

.segmented {
  display: flex;
  border: var(--border-w) solid var(--ink);
  width: fit-content;
}

.segmented__option {
  position: relative;
}

.segmented__option + .segmented__option {
  border-left: var(--border-w) solid var(--ink);
}

.segmented__option input {
  position: absolute;
  opacity: 0;
  inset: 0;
  cursor: pointer;
}

.segmented__option span {
  display: block;
  padding: 6px 10px;
  font-family: var(--font-pixel);
  font-size: var(--text-xs);
  text-transform: uppercase;
  background: var(--white);
}

.segmented__option input:checked + span {
  background: var(--ink);
  color: var(--paper);
}

.segmented__option input:focus-visible + span {
  outline: var(--border-w) solid var(--focus-ring);
  outline-offset: 2px;
}

.swatch {
  width: 40px;
  height: 32px;
  padding: 0;
  border: var(--border-w) solid var(--ink);
  border-radius: 0;
  background: var(--white);
  cursor: pointer;
}

.link-button {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--red);
  background: none;
  border: 0;
  padding: 0;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}

.range {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.range input {
  flex: 1;
  min-width: 0;
  accent-color: var(--ink);
}

.range__value {
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  min-width: 4ch;
  text-align: right;
}

.check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
}

.check input {
  accent-color: var(--ink);
}

@media (max-width: 860px) {
  .logo-page__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .logo-page {
    padding-block: var(--space-7);
  }
  .logo-page__title {
    font-size: var(--text-2xl);
  }
}
</style>
