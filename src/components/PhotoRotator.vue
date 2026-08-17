<script setup lang="ts">
/**
 * Hero photo rotator. Cycles every 3s with an instant swap — the brand has no
 * fades. Dots jump straight to an image.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { EventEntry } from '@/lib/content'

const props = defineProps<{ items: EventEntry[] }>()

const index = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const current = computed(() => props.items[index.value])
const counter = computed(() => {
  const total = String(props.items.length).padStart(2, '0')
  return `${String(index.value + 1).padStart(2, '0')}/${total}`
})

function start() {
  stop()
  if (props.items.length < 2) return
  timer = setInterval(() => {
    index.value = (index.value + 1) % props.items.length
  }, 3000)
}

function stop() {
  if (timer) clearInterval(timer)
  timer = undefined
}

function jump(next: number) {
  index.value = next
  // Restart the clock so the picture the visitor picked gets a full interval.
  start()
}

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <div v-if="current" class="rotator">
    <div class="rotator__frame">
      <img :src="current.poster || ''" :alt="current.title" />
    </div>
    <div class="rotator__caption caps">
      <span>{{ current.title }}</span>
      <span class="rotator__counter">{{ counter }}</span>
    </div>
    <div class="rotator__dots">
      <button
        v-for="(item, n) in items"
        :key="item.slug"
        type="button"
        class="rotator__dot"
        :class="{ 'is-active': n === index }"
        :aria-label="`Show ${item.title}`"
        :aria-current="n === index"
        @click="jump(n)"
      />
    </div>
  </div>
</template>

<style scoped>
.rotator {
  justify-self: center;
  width: 100%;
  max-width: 380px;
}

.rotator__frame {
  border: var(--border-w) solid var(--ink);
  box-shadow: var(--shadow-pixel-lg);
  background: #fdfcfa;
  aspect-ratio: 1;
  overflow: hidden;
}

.rotator__frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.rotator__caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.rotator__counter {
  color: var(--text-faint);
  flex: none;
}

.rotator__dots {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.rotator__dot {
  width: 12px;
  height: 12px;
  padding: 0;
  border: var(--border-w) solid var(--ink);
  background: var(--paper);
  cursor: pointer;
}

.rotator__dot.is-active {
  background: var(--red);
}
</style>
