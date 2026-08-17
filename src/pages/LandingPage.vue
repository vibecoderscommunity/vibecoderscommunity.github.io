<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import SectionTitle from '@/components/SectionTitle.vue'
import PhotoRotator from '@/components/PhotoRotator.vue'
import ChapterCard from '@/components/ChapterCard.vue'
import EventCard from '@/components/EventCard.vue'
import NewsletterBand from '@/components/NewsletterBand.vue'
import DsCard from '@/components/ds/DsCard.vue'
import DsTag from '@/components/ds/DsTag.vue'
import DsButton from '@/components/ds/DsButton.vue'
import SiteWordmark from '@/components/SiteWordmark.vue'
import { allEvents, flavorColor, latestRecap, site } from '@/lib/content'
import { useHead } from '@/lib/head'

useHead(() => ({
  title: `${site.title} — Tokyo & Singapore`,
  description: site.description,
  path: '/',
}))

// Only events with artwork can appear in the hero rotator.
const rotatorItems = computed(() => allEvents.filter((event) => event.poster))
const recapFlavor = computed(() => flavorColor(latestRecap?.flavor))
</script>

<template>
  <div>
    <section id="top" class="hero">
      <div class="hero__inner container">
        <div class="hero__copy">
          <div class="caps hero__eyebrow">{{ site.tagline }}</div>
          <h1 class="hero__title">
            <SiteWordmark /><span class="blink">▮</span>
          </h1>
          <p class="hero__body">{{ site.description }}</p>
        </div>
        <PhotoRotator :items="rotatorItems" />
      </div>
    </section>

    <section id="chapters" class="section container">
      <SectionTitle>Two cities, one vibe</SectionTitle>
      <div class="chapters">
        <ChapterCard v-for="chapter in site.chapters" :key="chapter.id" :chapter="chapter" />
      </div>
    </section>

    <NewsletterBand />

    <section v-if="latestRecap" class="section container">
      <SectionTitle>Latest recap</SectionTitle>
      <div class="recap">
        <RouterLink :to="latestRecap.path" class="recap__poster" :aria-label="latestRecap.title">
          <DsCard :image="latestRecap.poster || undefined" :image-alt="latestRecap.title" />
        </RouterLink>
        <div class="recap__body">
          <div class="chip" :style="{ background: recapFlavor }">{{ latestRecap.eyebrow }}</div>
          <h3 class="recap__title">{{ latestRecap.title }}</h3>
          <div class="recap__meta">{{ latestRecap.meta }}</div>
          <p class="recap__summary">{{ latestRecap.summary }}</p>
          <div class="recap__tags">
            <DsTag v-for="tag in latestRecap.tags" :key="tag" :flavor="recapFlavor">{{ tag }}</DsTag>
          </div>
          <DsButton :to="latestRecap.path">Read the recap →</DsButton>
        </div>
      </div>
    </section>

    <section id="events" class="section container events-section">
      <SectionTitle>Past events</SectionTitle>
      <div class="events">
        <EventCard v-for="event in allEvents" :key="event.slug" :event="event" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: radial-gradient(circle at 68% 30%, #efb0a0 0%, #f2cfc2 32%, var(--paper) 68%);
  border-bottom: var(--border-w-heavy) solid var(--ink);
}

.hero__inner {
  padding-block: var(--space-8) var(--space-7);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: var(--space-7);
  align-items: center;
}

.hero__eyebrow {
  margin-bottom: var(--space-3);
}

.hero__title {
  font-family: var(--font-pixel);
  font-size: var(--text-hero);
  margin: 0;
  text-transform: uppercase;
  line-height: 1.1;
}

/* The wordmark keeps one line in the header, but the hero H1 must wrap. */
.hero__title :deep(.wordmark) {
  white-space: normal;
}

.hero__body {
  font-size: var(--text-base);
  max-width: 520px;
  margin: var(--space-5) 0 0;
}

.chapters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.recap {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--space-6);
  align-items: start;
}

.recap__poster {
  display: block;
  background: none;
  text-decoration: none;
}

.recap__poster:hover {
  background: none;
}

.recap__body {
  padding-top: var(--space-2);
}

.recap__title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  margin: var(--space-3) 0;
  text-transform: uppercase;
}

.recap__meta {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-3);
}

.recap__summary {
  max-width: 520px;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.recap__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-4) 0;
}

.events-section {
  padding-top: 0;
}

.events {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

@media (max-width: 920px) {
  .hero__inner {
    grid-template-columns: 1fr;
    gap: var(--space-6);
    padding-block: var(--space-7) var(--space-6);
  }
  .hero__body {
    max-width: none;
  }
  .events {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 780px) {
  .chapters {
    grid-template-columns: 1fr;
  }
  .recap {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .recap__poster {
    max-width: 340px;
  }
  .recap__title {
    font-size: var(--text-2xl);
  }
}

@media (max-width: 560px) {
  .events {
    grid-template-columns: 1fr;
  }
}
</style>
