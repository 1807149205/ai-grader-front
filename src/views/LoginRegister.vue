<template>
  <div class="login-container">
    <a-card class="login-card" :title="isLogin ? '用户登录' : '用户注册'">
      <a-form :model="form" :rules="rules" layout="vertical" @finish="onSubmit">
        <a-form-item label="用户名" name="username">
          <a-input v-model:value="form.username" placeholder="请输入用户名" />
        </a-form-item>

        <a-form-item label="密码" name="password">
          <a-input-password v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>

        <div v-if="form.role == '1' && !isLogin">
          <a-form-item label="管理员姓名" name="managerName">
            <a-input v-model:value="form.managerName" placeholder="请输入管理员姓名" />
          </a-form-item>
          <a-form-item label="所属大学" name="universityId">
            <a-select
              v-model:value="form.universityId"
              show-search
              style="width: 100%"
              :filter-option="filterOption"
              :options="universityData"
              @change="universityChange"
            ></a-select>
          </a-form-item>
        </div>

        <!-- 注册模式下多一个角色选择框 -->
        <a-form-item
          v-if="!isLogin"
          label="角色"
          name="role"
          :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]"
        >
          <a-select v-model:value="form.role" placeholder="请选择角色" allow-clear>
            <a-select-option :value="1">管理员</a-select-option>
            <a-select-option :value="2">教师</a-select-option>
            <a-select-option :value="3">学生</a-select-option>
          </a-select>
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
import { onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { login, register, type UserLoginDTO, type UserRegisterDTO } from '@/api/login'
import { useUserStore, type LoginUserInfo } from '@/stores/user'
import router from '@/router'
import { getAllUniversity } from '@/api/university'

const userStore = useUserStore()

// 是否是登录模式
const isLogin = ref(true)

// 表单数据（role 改成 number | undefined）
const form = reactive<UserLoginDTO & Partial<UserRegisterDTO>>({
  username: '',
  password: '',
  role: undefined,
  universityId: null,
  managerName: '',
})

const universityData = ref([])

const filterOption = (input: string, option: any) => {
  // console.log(input, option);
  return option.label.includes(input)
}

// 表单验证规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  managerName: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
  universityId: [{ required: true, message: '请输入所属学校', trigger: 'blur' }],
}

const loading = ref(false)

// 切换登录/注册模式
function toggleMode() {
  isLogin.value = !isLogin.value
}

const universityChange = (e) => {
  console.log(e)
}

// 提交表单
async function onSubmit() {
  loading.value = true
  try {
    if (isLogin.value) {
      const resp = await login({ username: form.username, password: form.password })
      userStore.setLoginUserInfo(resp as unknown as LoginUserInfo)
      message.success('登录成功')
      await router.push('/')
    } else {
      if (!form.role) {
        message.error('请选择角色')
        loading.value = false
        return
      }
      await register({
        username: form.username,
        password: form.password,
        role: form.role,
        managerName: form.managerName,
        universityId: form.universityId,
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

const fetchUniversityData = async () => {
  const resp = await getAllUniversity()
  universityData.value = resp.map((d) => {
    return {
      label: d.universityName,
      value: d.id,
    }
  })
}

onMounted(() => {
  fetchUniversityData()
})
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
