<template>
  <div class="login-container">
    <a-card class="login-card" :title="isLogin ? '用户登录' : '用户注册'">
      <a-form
        :model="form"
        :rules="rules"
        layout="vertical"
        @finish="onSubmit"
      >
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="form.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>

        <!-- 注册模式下多一个角色输入 -->
        <a-form-item
          v-if="!isLogin"
          label="角色"
          name="role"
        >
          <a-input v-model:value="form.role" placeholder="请输入角色，例如 USER 或 ADMIN" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">
              {{ isLogin ? '登录' : '注册' }}
            </a-button>
            <a-button type="link" @click="toggleMode">
              {{ isLogin ? '没有账号？去注册' : '已有账号？去登录' }}
            </a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { login, register, type UserLoginDTO, type UserRegisterDTO } from '@/api/login'
import { useUserStore } from '@/stores/user'
import router from '@/router';

const userStore = useUserStore();

// 是否是登录模式
const isLogin = ref(true)

// 表单数据
const form = reactive<UserLoginDTO & Partial<UserRegisterDTO>>({
  username: '',
  password: '',
  role: ''
})

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  role: [{ required: false }] // 注册模式下会额外验证
}

const loading = ref(false)

// 切换登录/注册模式
function toggleMode() {
  isLogin.value = !isLogin.value
}

// 提交表单
async function onSubmit() {
  loading.value = true
  try {
    if (isLogin.value) {
      const resp = await login({ username: form.username, password: form.password })
      const info = resp.data;
      userStore.setLoginUserInfo(info);
      message.success('登录成功')
      await router.push('/')
      
    } else {
      if (!form.role) {
        message.error('请输入角色')
        loading.value = false
        return
      }
      await register({
        username: form.username,
        password: form.password,
        role: form.role
      })
      message.success('注册成功')
      isLogin.value = true
    }
  } catch (error) {
    // message.error('请求失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}
.login-card {
  width: 350px;
}
</style>
