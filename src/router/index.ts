import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/views/Layout.vue"),
      children: [
        
      ]
    },
    {
      path: '/loginRegister',
      component: () => import("@/views/LoginRegister.vue")
    }
  ],
})

export default router
