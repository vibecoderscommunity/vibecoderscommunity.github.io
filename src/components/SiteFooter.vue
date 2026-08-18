<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SiteWordmark from './SiteWordmark.vue'
import { site } from '@/lib/content'
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner container">
      <div>
        <div class="site-footer__brand">
          <SiteWordmark suffix="Tokyo & Singapore" />
        </div>
        <p class="site-footer__about">{{ site.about }}</p>
      </div>
      <nav class="site-footer__links">
        <a
          v-for="chapter in site.chapters"
          :key="chapter.id"
          :href="chapter.luma"
          target="_blank"
          rel="noopener noreferrer"
        >
          ▸ {{ chapter.name }} on lu.ma
        </a>
        <RouterLink to="/#events">▸ Past events</RouterLink>
        <RouterLink to="/#newsletter">▸ Sign up</RouterLink>
      </nav>
    </div>
    <div class="site-footer__strip">Cozy vibes.<span class="blink">▮</span></div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--paper);
  border-top: var(--border-w-heavy) solid var(--ink);
}

.site-footer__inner {
  padding-block: var(--space-6);
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-6);
}

.site-footer__brand {
  font-size: var(--text-base);
}

.site-footer__about {
  font-size: var(--text-sm);
  color: var(--text-muted);
  max-width: 480px;
  margin: var(--space-3) 0 0;
}

.site-footer__links {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  justify-self: end;
  align-items: flex-start;
}

.site-footer__strip {
  border-top: var(--border-w) solid var(--ink);
  padding: var(--space-3) var(--space-5);
  text-align: center;
  font-size: var(--text-xs);
  color: var(--text-faint);
}

@media (max-width: 760px) {
  .site-footer__inner {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .site-footer__links {
    justify-self: start;
  }
}

@media (max-width: 420px) {
  .site-footer__brand {
    font-size: var(--text-sm);
  }
}
</style>
