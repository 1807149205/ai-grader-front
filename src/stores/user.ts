import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface University {
  id: number;
  universityName: string;
}

export interface LoginUserInfo {
  id: number;
  username: string;
  userRole: string;
  universityId: number;
  university: University;
}

export const useUserStore = defineStore('user', () => {
  const loginUserInfo = ref<LoginUserInfo>()
  const isLogin = ref(false)

  const setLoginUserInfo = (info: LoginUserInfo) => {
    loginUserInfo.value = info
    isLogin.value = true // 赋值后直接标记为已登录
  }

  return { loginUserInfo, isLogin, setLoginUserInfo }
})

