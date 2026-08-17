<script setup lang="ts">
/**
 * Vibe Coders Design System — Select.
 * A custom listbox (native selects can't carry the pixel border treatment),
 * wired up with the ARIA roles and keyboard handling a native select provides.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    options: { value: string; label: string }[]
    placeholder?: string
    name?: string
  }>(),
  { placeholder: 'Select…' },
)

const model = defineModel<string>({ default: '' })

const root = ref<HTMLElement | null>(null)
const open = ref(false)
const active = ref(0)

const selected = computed(() => props.options.find((o) => o.value === model.value))

function toggle() {
  open.value = !open.value
  if (open.value) {
    active.value = Math.max(
      0,
      props.options.findIndex((o) => o.value === model.value),
    )
  }
}

function choose(value: string) {
  model.value = value
  open.value = false
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false
    return
  }
  if (!open.value && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault()
    toggle()
    return
  }
  if (!open.value) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    active.value = (active.value + 1) % props.options.length
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    active.value = (active.value - 1 + props.options.length) % props.options.length
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    choose(props.options[active.value].value)
  }
}

function onPointerDown(event: MouseEvent) {
  if (root.value && !root.value.contains(event.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('mousedown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('mousedown', onPointerDown))

// Close when the field is reset from outside (e.g. after a successful submit).
watch(model, () => {
  open.value = false
})
</script>

<template>
  <div ref="root" class="ds-select">
    <span v-if="label" :id="name ? `${name}-label` : undefined" class="ds-select__label">
      {{ label }}
    </span>
    <input v-if="name" type="hidden" :name="name" :value="model" />
    <button
      type="button"
      class="ds-select__trigger"
      :class="{ 'is-open': open, 'is-placeholder': !selected }"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-labelledby="name ? `${name}-label` : undefined"
      @click="toggle"
      @keydown="onKeydown"
    >
      <span>{{ selected ? selected.label : placeholder }}</span>
      <span class="ds-select__caret" aria-hidden="true">{{ open ? '▴' : '▾' }}</span>
    </button>
    <div v-if="open" class="ds-select__menu" role="listbox">
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="ds-select__option"
        :class="{ 'is-selected': option.value === model, 'is-active': index === active }"
        role="option"
        :aria-selected="option.value === model"
        @click="choose(option.value)"
        @mouseenter="active = index"
      >
        <span>{{ option.label }}</span>
        <span v-if="option.value === model" class="ds-select__mark">▮</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ds-select {
  position: relative;
  font-family: var(--font-mono);
}

.ds-select__label {
  display: block;
  font-family: var(--font-pixel);
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-2);
}

.ds-select__trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: 10px 12px;
  text-align: left;
  background: var(--white);
  color: var(--text-body);
  border: var(--border-w) solid var(--ink);
  cursor: pointer;
}

.ds-select__trigger.is-placeholder {
  color: var(--text-faint);
}

.ds-select__trigger.is-open {
  box-shadow: var(--shadow-pixel-sm);
}

.ds-select__caret {
  font-size: 10px;
}

.ds-select__menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--white);
  border: var(--border-w) solid var(--ink);
  box-shadow: var(--shadow-pixel);
  max-height: 220px;
  overflow-y: auto;
}

.ds-select__option {
  padding: 9px 12px;
  font-size: var(--text-sm);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background: var(--white);
}

.ds-select__option.is-selected {
  background: var(--paper-2);
}

.ds-select__option.is-active {
  background: var(--red-tint);
}

.ds-select__mark {
  color: var(--red);
}
</style>
