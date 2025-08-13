<template>
  <router-view/>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { useUserStore } from './stores/user';
import router from './router';

const userStore = useUserStore();


onMounted(() => {
  
  if (!userStore.isLogin) {
    router.push('/loginRegister')
  }
})

</script>
<style>
/* 一级标题 - Ant Design 风格 */
.ant-h1-title {
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-left: 6px solid #1677ff; /* Ant Design 主色 */
  color: rgba(0, 0, 0, 0.88);      /* 默认标题文字颜色 */
  margin-bottom: 16px;
}

/* 二级标题 - 左竖线 */
.ant-h2-title {
  display: flex;
  align-items: center;
  margin: 12px 0;
  color: rgba(0, 0, 0, 0.85); /* 二级标题颜色稍淡 */
  font-size: 18px;
  font-weight: 500;
}

.ant-h2-title::before {
  content: '';
  display: inline-block;
  width: 4px;             /* 竖线宽度 */
  height: 1em;            /* 跟文字等高 */
  background-color: #1677ff; /* 主色 */
  border-radius: 2px;     /* 圆角 */
  margin-right: 8px;
}

</style>