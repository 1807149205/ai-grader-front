<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div
        class="logo"
        style="height: 100px; color: white; text-align: center; padding-top: 20px; font-size: 17px"
      >
        智慧学生成绩管理系统
        <div style="font-size: 12px">{{ subTitle }}</div>
        <div style="font-size: 12px">{{ userStore.loginUserInfo?.university.universityName }}</div>
      </div>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0" />
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
            {{ item }}
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        毕设商城-智慧大学生成绩管理系统 ©2025 Created by bs-mall
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import router from '@/router'
import { useUserStore } from '@/stores/user'
import {
  PieChartOutlined,
  DesktopOutlined,
  DashboardOutlined,
  BarChartOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue'
import { onMounted, ref, watch, type Component } from 'vue'

// 定义菜单项类型
interface MenuItem {
  key: string
  label: string
  icon: Component
}

let menuItems: MenuItem[] = [
  { key: '1', label: 'Option 1', icon: PieChartOutlined },
  { key: '2', label: 'Option 2', icon: DesktopOutlined },
]

const teacherMenuItems: MenuItem[] = [
  { key: '/teacher/dashboard', label: '仪表盘', icon: DashboardOutlined },
  { key: '/teacher/score-manage', label: '学生成绩管理', icon: BarChartOutlined },
]

const managerMenuItems: MenuItem[] = [
  { key: '/manager/university-manage', label: '学校管理', icon: HomeOutlined },
  { key: '/manager/people-manage', label: '人员管理', icon: HomeOutlined },
]

const userStore = useUserStore()
const subTitle = ref('')
const collapsed = ref<boolean>(false)
const selectedKeys = ref<string[]>(['1'])
const breadcrumbItems = ref<string[]>([])

watch(selectedKeys, (val) => {
  router.push(val[0])
})

const setUserCustome = () => {
  console.log(userStore.loginUserInfo)
  if (userStore.loginUserInfo?.userRole === '1') {
    subTitle.value = '管理员端'
    menuItems = managerMenuItems
  } else if (userStore.loginUserInfo?.userRole === '2') {
    subTitle.value = '教师端'
    menuItems = teacherMenuItems
  } else if (userStore.loginUserInfo?.userRole === '3') {
    subTitle.value = '学生端'
    menuItems = []
  }
}

watch(router.currentRoute, (to) => {
  console.log(to)
  // selectedKeys.value = [to.path]
  // breadcrumbItems.value = to.meta.breadcrumb ? [to.meta.breadcrumb] : []
  if (typeof to.meta.breadcrumb === 'string') {
    breadcrumbItems.value = to.meta.breadcrumb.split('-').map((item: string) => item.trim())
  } else {
    breadcrumbItems.value = []
  }
})

onMounted(() => {
  setUserCustome()

  console.log(router.currentRoute.value.meta)
})
</script>
<style scoped>
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
