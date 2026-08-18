<script setup lang="ts">
import DsButton from '@/components/ds/DsButton.vue'
import { site } from '@/lib/content'
import { useHead } from '@/lib/head'

useHead(() => ({
  title: `Page not found — ${site.title}`,
  description: 'That page has wandered off.',
}))
</script>

<template>
  <div class="notfound container-text">
    <div class="chip notfound__chip">404</div>
    <h1 class="notfound__title">This page has wandered off<span class="blink">▮</span></h1>
    <p class="notfound__body">
      There's nothing at this address. The events are all in one place — try there.
    </p>
    <div class="notfound__actions">
      <DsButton to="/#events">Past events →</DsButton>
      <DsButton variant="secondary" to="/">← Home</DsButton>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  padding-block: var(--space-9) var(--space-8);
}

.notfound__chip {
  background: var(--gold);
  margin-bottom: var(--space-4);
}

.notfound__title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  text-transform: uppercase;
  margin: 0 0 var(--space-4);
}

.notfound__body {
  color: var(--text-muted);
  max-width: 440px;
}

.notfound__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-6);
}

@media (max-width: 560px) {
  .notfound {
    padding-block: var(--space-7);
  }
  .notfound__title {
    font-size: var(--text-2xl);
  }
}
</style>
