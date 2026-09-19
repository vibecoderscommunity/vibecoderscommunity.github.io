<script setup lang="ts">
import { computed, ref } from 'vue'
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
import { allEvents, flavorColor, heroImages, site, upcomingEvents } from '@/lib/content'
import { useHead } from '@/lib/head'

useHead(() => ({
  title: `${site.title} — Tokyo, Singapore & Columbus`,
  description: site.description,
  path: '/',
}))

/** Chapters that have at least one past event, in `site.yaml` order. */
const eventChapters = site.chapters
  .map((chapter) => ({
    ...chapter,
    count: allEvents.filter((event) => event.chapter === chapter.id).length,
  }))
  .filter((chapter) => chapter.count > 0)

/** `null` shows every chapter. */
const chapterFilter = ref<string | null>(null)

const filteredEvents = computed(() =>
  chapterFilter.value
    ? allEvents.filter((event) => event.chapter === chapterFilter.value)
    : allEvents,
)
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
        <PhotoRotator :items="heroImages" />
      </div>
    </section>

    <section id="chapters" class="section container">
      <SectionTitle>Three cities, one vibe</SectionTitle>
      <div class="chapters">
        <ChapterCard v-for="chapter in site.chapters" :key="chapter.id" :chapter="chapter" />
      </div>
    </section>

    <NewsletterBand />

    <section v-if="upcomingEvents.length" id="upcoming" class="section container">
      <SectionTitle>Coming up</SectionTitle>
      <div class="upcoming">
        <div v-for="event in upcomingEvents" :key="event.slug" class="upcoming__item">
          <RouterLink :to="event.path" class="upcoming__poster" :aria-label="event.title">
            <DsCard :image="event.poster || undefined" :image-alt="event.title" />
          </RouterLink>
          <div class="upcoming__body">
            <div class="chip" :style="{ background: flavorColor(event.flavor) }">
              {{ event.eyebrow }}
            </div>
            <h3 class="upcoming__title">{{ event.title }}</h3>
            <div class="upcoming__meta">{{ event.meta }}</div>
            <p class="upcoming__summary">{{ event.summary }}</p>
            <div v-if="event.tags.length" class="upcoming__tags">
              <DsTag v-for="tag in event.tags" :key="tag" :flavor="flavorColor(event.flavor)">
                {{ tag }}
              </DsTag>
            </div>
            <div class="upcoming__cta">
              <DsButton v-if="event.luma" :href="event.luma" external>Sign up on Luma →</DsButton>
              <DsButton variant="secondary" :to="event.path">Event details →</DsButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="events" class="section container events-section">
      <SectionTitle>Past events</SectionTitle>
      <div
        v-if="eventChapters.length > 1"
        class="event-filter"
        role="group"
        aria-label="Filter past events by chapter"
      >
        <button
          type="button"
          class="event-filter__chip"
          :aria-pressed="chapterFilter === null"
          @click="chapterFilter = null"
        >
          All <span class="event-filter__count">{{ allEvents.length }}</span>
        </button>
        <button
          v-for="chapter in eventChapters"
          :key="chapter.id"
          type="button"
          class="event-filter__chip"
          :aria-pressed="chapterFilter === chapter.id"
          @click="chapterFilter = chapter.id"
        >
          {{ chapter.name }} <span class="event-filter__count">{{ chapter.count }}</span>
        </button>
      </div>
      <div class="events">
        <EventCard v-for="event in filteredEvents" :key="event.slug" :event="event" />
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
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
}

.upcoming {
  display: grid;
  gap: var(--space-7);
}

.upcoming__item {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--space-6);
  align-items: start;
}

.upcoming__poster {
  display: block;
  background: none;
  text-decoration: none;
}

.upcoming__poster:hover {
  background: none;
}

.upcoming__body {
  padding-top: var(--space-2);
}

.upcoming__title {
  font-family: var(--font-heading);
  letter-spacing: var(--tracking-heading);
  font-size: var(--text-3xl);
  margin: var(--space-3) 0;
  text-transform: uppercase;
}

.upcoming__meta {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-3);
}

.upcoming__summary {
  max-width: 520px;
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.upcoming__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-4) 0;
}

.upcoming__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.events-section {
  padding-top: 0;
}

.event-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
}

.event-filter__chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-pixel);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 6px 12px;
  color: var(--ink);
  background: var(--white);
  border: var(--border-w) solid var(--ink);
  border-radius: 0;
  box-shadow: var(--shadow-pixel-sm);
  cursor: pointer;
  transition:
    transform var(--dur-fast) var(--ease-snap),
    box-shadow var(--dur-fast) var(--ease-snap);
}

.event-filter__chip:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-pixel);
}

.event-filter__chip:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.event-filter__chip[aria-pressed='true'] {
  background: var(--ink);
  color: var(--paper);
}

.event-filter__chip:focus-visible {
  outline: var(--border-w) solid var(--focus-ring);
  outline-offset: 2px;
}

.event-filter__count {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
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
  .chapters {
    grid-template-columns: 1fr;
  }
  .events {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 780px) {
  .upcoming__item {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .upcoming__poster {
    max-width: 340px;
  }
  .upcoming__title {
    font-size: var(--text-2xl);
  }
}

@media (max-width: 560px) {
  .events {
    grid-template-columns: 1fr;
  }
}
</style>
