import { createSSRApp } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type Router,
} from 'vue-router'
import App from './App.vue'
import LandingPage from './pages/LandingPage.vue'
import EventPage from './pages/EventPage.vue'
import UpcomingPage from './pages/UpcomingPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'
import LogoPage from './pages/LogoPage.vue'
import { createHead } from './lib/head'
import './styles/global.css'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: LandingPage },
  { path: '/events/:slug', name: 'event', component: EventPage },
  { path: '/upcoming/:slug', name: 'upcoming', component: UpcomingPage },
  { path: '/logo', name: 'logo', component: LogoPage },
  // Prerendered to `404.html`, which Cloudflare serves for unknown paths.
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
]

export function createApp(ssr = false) {
  const app = createSSRApp(App)

  const router: Router = createRouter({
    history: ssr ? createMemoryHistory() : createWebHistory(),
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 0, behavior: 'smooth' }
      return { top: 0 }
    },
  })

  const head = createHead()

  app.use(router)
  app.use(head)

  return { app, router, head }
}
