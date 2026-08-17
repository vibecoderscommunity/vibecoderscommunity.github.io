import { createApp } from './main'

const { app, router } = createApp()

// Wait for the router to settle so hydration matches the prerendered markup.
router.isReady().then(() => {
  app.mount('#app')
})
