<template>
  <h2 class="section-title"><slot /></h2>
</template>

<style scoped>
.section-title {
  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  margin: 0 0 var(--space-5);
  text-transform: uppercase;
}

@media (max-width: 560px) {
  .section-title {
    font-size: var(--text-2xl);
  }
}
</style>
