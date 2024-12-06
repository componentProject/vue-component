import { createRouter, createWebHistory } from 'vue-router'
import Calendar from '@/components/Calendar/Calendar.vue'
import Icon from '@/components/Icon/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/calendar',
      children: [
        {
          path: '/calendar',
          name: 'Calendar',
          component: Calendar,
        },
        {
          path: '/icon',
          name: 'Icon',
          component: Icon
        }
      ]
    },
  ],
})

export default router
