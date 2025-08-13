import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/views/Layout.vue"),
      children: [
        {
          path: '/manager/university-manage',
          component: () => import("@/views/manager/UniversityManage.vue")
        },
        {
          path: '/manager/people-manage',
          component: () => import("@/views/manager/PeopleManage.vue")
        },
        {
          path: '/teacher/dashboard',
          component: () => import("@/views/teacher/Dashboard.vue")
        },
        {
          path: '/teacher/score-manage',
          component: () => import("@/views/teacher/ScoreManage.vue")
        }
      ]
    },
    {
      path: '/loginRegister',
      component: () => import("@/views/LoginRegister.vue")
    }
  ],
})

export default router
