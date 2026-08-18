<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import DsButton from '@/components/ds/DsButton.vue'
import DsTag from '@/components/ds/DsTag.vue'
import NewsletterBand from '@/components/NewsletterBand.vue'
import NotFoundPage from './NotFoundPage.vue'
import { findEvent, flavorColor, site } from '@/lib/content'
import { useHead } from '@/lib/head'

const route = useRoute()
const event = computed(() => findEvent(String(route.params.slug)))
const flavor = computed(() => flavorColor(event.value?.flavor))

// An unknown slug still matches this route on the client, so it renders the
// same NotFoundPage the prerendered 404.html contains — identical markup, which
// keeps hydration clean when Cloudflare serves 404.html at /events/<unknown>/.
useHead(() =>
  event.value
    ? {
        title: `${event.value.title} — ${site.title}`,
        description: event.value.summary,
        image: event.value.poster || undefined,
        path: route.path,
      }
    : { title: `Page not found — ${site.title}`, description: 'That page has wandered off.' },
)
</script>

<template>
  <div v-if="event">
    <article class="event container-text">
      <RouterLink to="/#events" class="event__back">← All events</RouterLink>

      <div class="chip event__eyebrow" :style="{ background: flavor }">Recap</div>
      <h1 class="event__title">{{ event.title }}</h1>
      <div class="event__meta">{{ event.meta }}</div>

      <img v-if="event.poster" class="event__poster" :src="event.poster" :alt="event.title" />

      <div v-if="event.tags.length" class="event__tags">
        <DsTag v-for="tag in event.tags" :key="tag" :flavor="flavor">{{ tag }}</DsTag>
      </div>

      <!-- Rendered at build time from the event's index.md by content-plugin.js. -->
      <div v-if="event.html" class="prose" v-html="event.html" />
      <p v-else class="event__pending">
        The recap for this one is still being written. Sign up below and it'll land in your inbox.
      </p>

      <template v-if="event.photos.length">
        <h2 class="event__heading">Photos</h2>
        <div class="event__photos">
          <a
            v-for="(photo, n) in event.photos"
            :key="photo"
            class="event__photo"
            :href="photo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img :src="photo" :alt="`${event.title} — photo ${n + 1}`" loading="lazy" />
          </a>
        </div>
      </template>



      <div class="event__cta">
        <DsButton v-if="event.luma" variant="flavor" :flavor="flavor" :href="event.luma" external>
          See it on Luma →
        </DsButton>
        <DsButton variant="secondary" to="/#events">← Back to all events</DsButton>
      </div>
    </article>

    <NewsletterBand />
  </div>

  <NotFoundPage v-else />
</template>

<style scoped>
.event {
  padding-block: var(--space-7);
}

.event__back {
  display: inline-block;
  font-size: var(--text-sm);
}

.event__eyebrow {
  /* Block so the chip starts its own line under "← All events". */
  display: block;
  width: fit-content;
  margin: var(--space-5) 0 var(--space-3);
}

.event__title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-2);
  text-transform: uppercase;
}

.event__meta {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  color: var(--text-muted);
  margin-bottom: var(--space-5);
}

.event__poster {
  display: block;
  width: 100%;
  border: var(--border-w) solid var(--ink);
  box-shadow: var(--shadow-pixel);
}

.event__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-5) 0;
}

.event__pending {
  color: var(--text-muted);
}

.event__heading {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  text-transform: uppercase;
  margin: var(--space-6) 0 var(--space-3);
}

.event__photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.event__photo {
  display: block;
  aspect-ratio: 1;
  border: var(--border-w) solid var(--ink);
  background: var(--surface-sunken);
  overflow: hidden;
}

.event__photo:hover {
  background: var(--surface-sunken);
}

.event__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.event__cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.event__note {
  background: var(--surface-sunken);
  border: var(--border-w) solid var(--ink);
  padding: var(--space-4);
  margin: var(--space-6) 0;
  font-size: var(--text-sm);
}

.event__note-label {
  font-family: var(--font-pixel);
  font-weight: 700;
  text-transform: uppercase;
  font-size: var(--text-xs);
}

@media (max-width: 560px) {
  .event__title {
    font-size: var(--text-2xl);
  }
  .event__photos {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
