<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SiteWordmark from './SiteWordmark.vue'

const links = [
  { label: 'Next meetups', to: '/#chapters' },
  { label: 'Past events', to: '/#events' },
  { label: 'Sign up', to: '/#newsletter' },
]
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner container">
      <RouterLink to="/" class="site-header__brand" aria-label="Vibe Coders Meetup — home">
        <SiteWordmark />
      </RouterLink>
      <nav class="site-header__nav">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="site-header__link">
          {{ link.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--paper);
  border-bottom: var(--border-w-heavy) solid var(--ink);
  font-family: var(--font-mono);
}

.site-header__inner {
  height: 64px;
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.site-header__brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--ink);
  background: none;
  font-size: var(--text-base);
}

.site-header__brand:hover {
  background: none;
  color: var(--ink);
}

.site-header__nav {
  display: flex;
  gap: var(--space-4);
  margin-left: auto;
  align-items: center;
}

.site-header__link {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  text-decoration: none;
  color: var(--ink);
  padding: 4px 8px;
  background: none;
  border-bottom: var(--border-w) solid transparent;
  transition: background var(--dur-fast) var(--ease-snap);
}

.site-header__link:hover {
  background: var(--red-tint);
  color: var(--ink);
}

@media (max-width: 860px) {
  .site-header__inner {
    gap: var(--space-4);
  }
  .site-header__brand {
    font-size: var(--text-sm);
  }
  .site-header__nav {
    gap: var(--space-1);
  }
  .site-header__link {
    font-size: var(--text-xs);
    padding: 4px 6px;
  }
}

/* Below this the wordmark and three nav links no longer share a row. */
@media (max-width: 620px) {
  .site-header__inner {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    padding-block: var(--space-3);
  }
  .site-header__brand {
    font-size: var(--text-sm);
  }
  .site-header__nav {
    margin-left: calc(var(--space-2) * -1);
    flex-wrap: wrap;
  }
}

@media (max-width: 380px) {
  .site-header__brand {
    font-size: var(--text-xs);
  }
}
</style>
