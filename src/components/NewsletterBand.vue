<script setup lang="ts">
/**
 * Newsletter signup. POSTs to `/api/subscribe`, which is handled by the
 * Cloudflare Worker in `worker/index.ts` and written to D1.
 *
 * The design calls for the form to be replaced in place by a confirmation, so
 * there is no navigation and no page reload.
 */
import { computed, onMounted, ref } from 'vue'
import DsButton from './ds/DsButton.vue'
import DsInput from './ds/DsInput.vue'
import DsSelect from './ds/DsSelect.vue'
import { site } from '@/lib/content'

const STORAGE_KEY = 'vbt-subscribed'

const email = ref('')
const city = ref('')
/** Honeypot: real people leave this empty, most bots do not. */
const website = ref('')

const status = ref<'idle' | 'sending' | 'done'>('idle')
const error = ref('')

// The heading is authored as "Sign up to be {highlight} of future events".
const headingParts = computed(() => {
  const [before, after = ''] = site.newsletter.heading.split('{highlight}')
  return { before, after }
})

onMounted(() => {
  try {
    if (localStorage.getItem(STORAGE_KEY) === '1') status.value = 'done'
  } catch {
    // Private-mode browsers throw on localStorage; the form still works.
  }
})

async function submit() {
  if (status.value === 'sending') return
  error.value = ''

  if (!email.value.trim()) {
    error.value = 'Email is required.'
    return
  }

  status.value = 'sending'
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: email.value.trim(),
        city: city.value || null,
        website: website.value,
      }),
    })

    const payload = (await response.json().catch(() => ({}))) as { error?: string }

    if (!response.ok) {
      error.value = payload.error || 'Something went wrong. Please try again.'
      status.value = 'idle'
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // Not being able to remember is fine — the signup still landed.
    }
    status.value = 'done'
  } catch {
    error.value = 'Could not reach the server. Please try again.'
    status.value = 'idle'
  }
}
</script>

<template>
  <section id="newsletter" class="newsletter">
    <div class="newsletter__inner container">
      <div>
        <h2 class="newsletter__heading">
          {{ headingParts.before
          }}<span class="newsletter__highlight">{{ site.newsletter.highlight }}</span
          >{{ headingParts.after }}
        </h2>
        <p class="newsletter__sub">{{ site.newsletter.sub }}</p>
      </div>

      <div v-if="status === 'done'" class="newsletter__done" role="status">
        {{ site.newsletter.success }}<span class="blink">▮</span>
      </div>

      <form v-else class="newsletter__form" novalidate @submit.prevent="submit">
        <DsInput
          v-model="email"
          label="Email"
          type="email"
          name="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
          :error="error"
        />
        <DsSelect
          v-model="city"
          label="City"
          name="city"
          placeholder="Pick one"
          :options="site.newsletter.cities"
        />
        <!-- Honeypot, hidden from people and from assistive technology. -->
        <div class="newsletter__trap" aria-hidden="true">
          <label>
            Website
            <input v-model="website" type="text" tabindex="-1" autocomplete="off" />
          </label>
        </div>
        <DsButton type="submit" variant="flavor" flavor="var(--lime)" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Signing up…' : 'Sign me up' }}
        </DsButton>
      </form>
    </div>

    <div class="newsletter__channels container">
      <div class="channels">
        <p class="channels__heading caps">{{ site.channels.heading }}</p>
        <div class="channels__list">
          <a
            v-for="channel in site.channels.links"
            :key="channel.url"
            class="channel"
            :href="channel.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="channel__label">{{ channel.label }}</span>
            <span class="channel__handle">{{ channel.handle }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.newsletter {
  background: var(--ink);
  border-top: var(--border-w-heavy) solid var(--ink);
  border-bottom: var(--border-w-heavy) solid var(--ink);
}

.newsletter__inner {
  padding-top: var(--space-7);
  padding-bottom: var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-7);
  align-items: center;
}

.newsletter__heading {
  font-family: var(--font-heading);
  color: var(--paper);
  font-size: var(--text-2xl);
  margin: 0;
  text-transform: uppercase;
}

.newsletter__highlight {
  color: var(--lime);
}

.newsletter__sub {
  color: var(--paper-3);
  font-size: var(--text-sm);
  max-width: 420px;
}

.newsletter__form {
  position: relative;
  background: var(--paper);
  border: var(--border-w) solid var(--ink);
  box-shadow: 4px 4px 0 var(--lime);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.newsletter__done {
  background: var(--paper);
  border: var(--border-w) solid var(--lime);
  box-shadow: 4px 4px 0 var(--lime);
  padding: var(--space-5);
  font-family: var(--font-pixel);
  font-weight: 700;
  text-transform: uppercase;
}

/* Channels strip — the border sits on an inner element so it lines up with the
   text above rather than the container's padding edge. */
.newsletter__channels {
  padding-bottom: var(--space-7);
}

.channels {
  border-top: var(--border-w) solid var(--ink-soft);
  padding-top: var(--space-5);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4) var(--space-5);
}

.channels__heading {
  color: var(--paper-3);
  margin: 0;
}

.channels__list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.channel {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2) var(--space-4);
  background: var(--paper);
  color: var(--ink);
  border: var(--border-w) solid var(--ink);
  box-shadow: 4px 4px 0 var(--lime);
  text-decoration: none;
  transition:
    transform var(--dur-fast) var(--ease-snap),
    box-shadow var(--dur-fast) var(--ease-snap);
}

.channel:hover,
.channel:focus-visible {
  color: var(--ink);
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--lime);
}

.channel:active {
  transform: translate(2px, 2px);
  box-shadow: none;
}

.channel__label {
  font-family: var(--font-pixel);
  font-weight: 700;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.channel__handle {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.newsletter__trap {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (max-width: 860px) {
  .newsletter__inner {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
  .newsletter__sub {
    max-width: none;
  }
}
</style>
