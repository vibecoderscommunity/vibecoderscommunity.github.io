<script setup lang="ts">
/** "VIBE CODERS COMMUNITY" with the brand's red O. */
defineProps<{ suffix?: string }>()
</script>

<template>
  <span class="wordmark">
    VIBE C<span class="wordmark__o">O</span>DERS COMMUNITY<template v-if="suffix">
      <span class="wordmark__suffix">{{ suffix }}</span>
    </template>
  </span>
</template>

<style scoped>
.wordmark {
  font-family: var(--font-pixel);
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
}

.wordmark__o {
  color: var(--red);
}

.wordmark__suffix {
  color: var(--text-faint);
  margin-left: 0.5em;
  /* The mark itself never breaks, but the suffix may wrap on narrow screens. */
  white-space: normal;
}
</style>
