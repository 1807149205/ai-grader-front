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
<style scoped>

</style>