<script setup lang="ts">
/** Vibe Coders Design System — Tag. Small flavour-filled label. */
withDefaults(defineProps<{ flavor?: string }>(), { flavor: 'var(--paper-2)' })
</script>

<template>
  <span class="ds-tag" :style="{ background: flavor }"><slot /></span>
</template>

<style scoped>
.ds-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 3px 8px;
  color: var(--ink);
  border: var(--border-w) solid var(--ink);
  border-radius: var(--radius-px);
}
</style>
