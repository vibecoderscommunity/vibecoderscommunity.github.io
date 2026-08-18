<script setup lang="ts">
/** Vibe Coders Design System — Input. Inset pixel shadow on focus. */
import { ref } from 'vue'

withDefaults(
  defineProps<{
    label?: string
    hint?: string
    error?: string
    type?: string
    placeholder?: string
    required?: boolean
    autocomplete?: string
    name?: string
  }>(),
  { type: 'text' },
)

const model = defineModel<string>({ default: '' })
const focused = ref(false)
</script>

<template>
  <label class="ds-input">
    <span v-if="label" class="ds-input__label">{{ label }}</span>
    <span class="ds-input__field" :class="{ 'is-focused': focused, 'is-error': !!error }">
      <input
        v-model="model"
        :type="type"
        :name="name"
        :placeholder="placeholder"
        :required="required"
        :autocomplete="autocomplete"
        :aria-invalid="error ? 'true' : undefined"
        @focus="focused = true"
        @blur="focused = false"
      />
    </span>
    <span v-if="error || hint" class="ds-input__note" :class="{ 'is-error': !!error }">
      {{ error || hint }}
    </span>
  </label>
</template>

<style scoped>
.ds-input {
  display: block;
  font-family: var(--font-mono);
}

.ds-input__label {
  display: block;
  font-family: var(--font-pixel);
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-2);
}

.ds-input__field {
  display: flex;
  align-items: center;
  background: var(--white);
  border: var(--border-w) solid var(--ink);
}

.ds-input__field.is-error {
  border-color: var(--error);
}

.ds-input__field.is-focused {
  box-shadow: inset 3px 3px 0 var(--paper-3);
}

.ds-input__field.is-focused.is-error {
  box-shadow: inset 3px 3px 0 var(--red-tint);
}

.ds-input input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  padding: 10px 12px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-body);
}

.ds-input__note {
  display: block;
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-faint);
}

.ds-input__note.is-error {
  color: var(--error);
}
</style>
