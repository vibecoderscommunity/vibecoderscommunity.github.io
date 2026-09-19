<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import DsCard from './ds/DsCard.vue'
import { chapterById, flavorColor } from '@/lib/content'
import type { EventEntry } from '@/lib/content'

const props = defineProps<{ event: EventEntry }>()

const tags = computed(() =>
  props.event.tags.map((label) => ({ label, flavor: flavorColor(props.event.flavor) })),
)

const chapter = computed(() => chapterById(props.event.chapter))
</script>

<template>
  <RouterLink :to="event.path" class="event-card">
    <DsCard
      :image="event.poster || undefined"
      :image-alt="event.title"
      :title="event.title"
      :meta="event.meta"
      :tags="tags"
      hoverable
    >
      {{ event.blurb }}
      <template v-if="chapter" #footer>
        <span class="chip" :style="{ background: flavorColor(chapter.next?.flavor) }">
          {{ chapter.name }}
        </span>
      </template>
    </DsCard>
  </RouterLink>
</template>

<style scoped>
.event-card {
  text-decoration: none;
  color: inherit;
  display: block;
  background: none;
  height: 100%;
}

.event-card:hover {
  background: none;
  color: inherit;
}
</style>
