import { createRouter, createWebHistory } from 'vue-router'
import Calendar from '@/components/Calendar/Calendar.vue'
import Icon from '@/components/Icon/index.vue'
import wlConfigForm from '@/components/wlConfigForm/index.vue';
import test from '@/components/test/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/wlConfigForm',
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
        },
        {
          path: '/wlConfigForm',
          name: 'wlConfigForm',
          component:wlConfigForm
        },
        {
          path: '/test',
          name: 'test',
          component: test
        }
      ]
    },
  ],
})

export default router
