import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

export default createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes,
  history: createWebHistory(import.meta.env.BASE_URL),
})
