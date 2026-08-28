<script setup lang="ts">
/** Vibe Coders Design System — Card. Square image, title, meta, blurb, tags. */
import { computed, useSlots } from 'vue'
import DsTag from './DsTag.vue'

const props = defineProps<{
  image?: string
  imageAlt?: string
  eyebrow?: string
  title?: string
  meta?: string
  tags?: { label: string; flavor?: string }[]
  flavor?: string
  hoverable?: boolean
}>()

const slots = useSlots()

/**
 * Whether anything would actually render inside the body.
 *
 * Every child below is individually `v-if`ed, so a card given only an `image`
 * — the "Coming up" posters — would otherwise render an empty padded box as a
 * white strip under the artwork.
 */
const hasBody = computed(() =>
  Boolean(
    props.eyebrow ||
      props.title ||
      props.meta ||
      props.tags?.length ||
      slots.default ||
      slots.footer,
  ),
)
</script>

<template>
  <div class="ds-card" :class="{ hoverable, 'ds-card--bare': !hasBody }">
    <img v-if="image" :src="image" :alt="imageAlt || ''" class="ds-card__image" loading="lazy" />
    <div v-if="hasBody" class="ds-card__body">
      <div
        v-if="eyebrow"
        class="ds-card__eyebrow"
        :style="flavor ? { background: flavor, color: 'var(--ink)', padding: '1px 6px' } : undefined"
      >
        {{ eyebrow }}
      </div>
      <div v-if="title" class="ds-card__title">{{ title }}</div>
      <div v-if="meta" class="ds-card__meta">{{ meta }}</div>
      <div v-if="$slots.default" class="ds-card__text"><slot /></div>
      <div v-if="tags && tags.length" class="ds-card__tags">
        <DsTag v-for="t in tags" :key="t.label" :flavor="t.flavor">{{ t.label }}</DsTag>
      </div>
      <div v-if="$slots.footer" class="ds-card__footer"><slot name="footer" /></div>
    </div>
  </div>
</template>

<style scoped>
.ds-card {
  background: var(--surface-card);
  border: var(--border-w) solid var(--ink);
  box-shadow: var(--shadow-pixel);
  display: flex;
  flex-direction: column;
  height: 100%;
  transition:
    transform var(--dur-fast) var(--ease-snap),
    box-shadow var(--dur-fast) var(--ease-snap);
}

.hoverable:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-pixel-lg);
}

.ds-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-bottom: var(--border-w) solid var(--ink);
}

/* With no body beneath it, the image's divider would sit directly on the
   card's own bottom border and read as a double-thick rule. */
.ds-card--bare .ds-card__image {
  border-bottom: 0;
}

.ds-card__body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  flex: 1;
}

.ds-card__eyebrow {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-caps);
  color: var(--red);
  align-self: flex-start;
}

.ds-card__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--text-xl);
  line-height: var(--leading-tight);
}

.ds-card__meta {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.ds-card__text {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-muted);
  line-height: var(--leading-body);
}

.ds-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  margin-top: auto;
  padding-top: var(--space-2);
}

.ds-card__footer {
  margin-top: var(--space-2);
}
</style>
