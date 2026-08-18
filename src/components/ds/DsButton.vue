<script setup lang="ts">
/** Vibe Coders Design System — Button. Pixel-hard edges, lift on hover, sink on press. */
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'inverse' | 'flavor'
    size?: 'sm' | 'md' | 'lg'
    /** CSS colour used as the background when `variant="flavor"`. */
    flavor?: string
    disabled?: boolean
    type?: 'button' | 'submit'
    /** In-app route — renders a RouterLink. */
    to?: string
    /** External URL — renders a plain anchor. */
    href?: string
    /** Opens `href` in a new tab. */
    external?: boolean
  }>(),
  { variant: 'primary', size: 'md', type: 'button' },
)

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))

const background = computed(() =>
  props.variant === 'flavor' ? props.flavor || 'var(--lime)' : undefined,
)
</script>

<template>
  <component
    :is="tag"
    class="ds-button"
    :class="[`is-${variant}`, `is-${size}`, { 'is-disabled': disabled }]"
    :style="background ? { background } : undefined"
    :type="to || href ? undefined : type"
    :disabled="to || href ? undefined : disabled"
    :to="to"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot />
  </component>
</template>

<style scoped>
.ds-button {
  display: inline-block;
  font-family: var(--font-pixel);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-align: center;
  border: var(--border-w) solid var(--ink);
  border-radius: 0;
  cursor: pointer;
  box-shadow: var(--shadow-pixel);
  transition:
    transform var(--dur-fast) var(--ease-snap),
    box-shadow var(--dur-fast) var(--ease-snap);
}

.ds-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow-pixel-lg);
}

.ds-button:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

/* Variants */
.is-primary {
  background: var(--red);
  color: var(--white);
}
.is-secondary {
  background: var(--white);
  color: var(--ink);
}
.is-inverse {
  background: var(--ink);
  color: var(--paper);
}
.is-flavor {
  background: var(--lime);
  color: var(--ink);
}

/* An anchor button must not pick up the global link hover tint. */
.ds-button:hover,
.ds-button:focus {
  color: inherit;
}
.is-primary:hover {
  background: var(--red);
  color: var(--white);
}

/* Sizes */
.is-sm {
  padding: 6px 12px;
  font-size: var(--text-xs);
}
.is-md {
  padding: 10px 20px;
  font-size: var(--text-sm);
}
.is-lg {
  padding: 14px 28px;
  font-size: var(--text-base);
}

.is-disabled,
.ds-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  box-shadow: var(--shadow-pixel-sm);
  transform: none;
}
</style>
