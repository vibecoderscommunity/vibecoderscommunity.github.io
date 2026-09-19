<script setup lang="ts">
import DsButton from './ds/DsButton.vue'
import { flavorColor } from '@/lib/content'
import type { Chapter } from '@/lib/content'

defineProps<{ chapter: Chapter }>()
</script>

<template>
  <div class="chapter-wrap">
    <div class="chapter">
      <img
        v-if="chapter.logo"
        class="chapter__logo"
        :src="chapter.logo"
        :alt="`Vibe Coders ${chapter.name} logo`"
        width="120"
        height="120"
      />
      <div v-else class="chapter__logo chapter__logo--abbr" aria-hidden="true">
        {{ chapter.abbr || chapter.name }}
      </div>
      <div class="chapter__body">
        <h3 class="chapter__name">{{ chapter.name }}</h3>
        <div class="caps">
          <span class="chip" :style="{ background: flavorColor(chapter.next.flavor) }">
            Next → {{ chapter.next.label }}
          </span>
        </div>
        <div class="caps chapter__last">Last → {{ chapter.last }}</div>
        <div v-if="chapter.luma" class="chapter__cta">
          <DsButton size="sm" :href="chapter.luma" external>RSVP on lu.ma ▸</DsButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Cards sit three-up on wide screens, too narrow for logo beside text. */
.chapter-wrap {
  container-type: inline-size;
  display: grid;
}

.chapter {
  background: var(--surface-card);
  border: var(--border-w) solid var(--ink);
  box-shadow: var(--shadow-pixel);
  padding: var(--space-5);
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: var(--space-5);
  align-items: center;
}

.chapter__logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  image-rendering: pixelated;
  border: var(--border-w) solid var(--ink);
  background: #fdfcfa;
}

/* Stand-in for a chapter that has no logo yet. */
.chapter__logo--abbr {
  display: grid;
  place-items: center;
  font-family: var(--font-pixel);
  font-weight: 700;
  font-size: var(--text-lg);
  text-transform: uppercase;
  overflow: hidden;
}

.chapter__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
  min-width: 0;
}

.chapter__name {
  font-family: var(--font-pixel);
  font-size: var(--text-xl);
  margin: 0;
  text-transform: uppercase;
}

.chapter__last {
  color: var(--text-muted);
}

.chapter__cta {
  margin-top: var(--space-2);
}

.chip {
  /* The chip may wrap on narrow cards rather than overflow the border. */
  white-space: normal;
}

@container (max-width: 420px) {
  .chapter {
    grid-template-columns: 1fr;
    align-items: start;
    align-content: start;
  }
}

@media (max-width: 460px) {
  .chapter {
    grid-template-columns: 88px 1fr;
    gap: var(--space-4);
    padding: var(--space-4);
  }
  .chapter__logo {
    width: 88px;
    height: 88px;
  }
  .chapter__logo--abbr {
    font-size: var(--text-base);
  }
  .chapter__name {
    font-size: var(--text-lg);
  }
}
</style>
