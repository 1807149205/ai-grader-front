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
          component: () => import("@/views/manager/UniversityManage.vue"),
          meta: {
            breadcrumb: '管理端-大学管理'
          }
        },
        {
          path: '/manager/people-manage',
          component: () => import("@/views/manager/PeopleManage.vue"),
          meta: {
            breadcrumb: '管理端-人员管理'
          }
        },
        {
          path: '/teacher/dashboard',
          component: () => import("@/views/teacher/Dashboard.vue"),
          meta: {
            breadcrumb: '教师端-仪表盘'
          }
        },
        {
          path: '/teacher/score-manage',
          component: () => import("@/views/teacher/ScoreManage.vue"),
          meta: {
            breadcrumb: '教师端-成绩管理'
          }
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
