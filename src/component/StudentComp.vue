<script lang="ts" setup>
import { getClassByUniversityId, type ClassByUniversityVO } from '@/api/classApi'
import { useUserStore } from '@/stores/user'
import { onMounted, reactive, ref } from 'vue'

const userStore = useUserStore()
const searchForm = reactive({
  studentName: '',
  studentNo: '',
  classId: undefined as number | undefined,
})

const classList = ref<{ label: string; value: number }[]>([])

//获取所有班级信息
const fetchAllClassInfo = async () => {
  if (!userStore.loginUserInfo || !userStore.loginUserInfo.universityId) {
    return
  }
  const resp = await getClassByUniversityId(userStore.loginUserInfo.universityId)
  classList.value =
    resp.map((item: ClassByUniversityVO) => {
      return {
        label: item.className,
        value: item.classId,
      }
    }) || []
}

const handleSearch = async () => {}

const initPage = async () => {
  await fetchAllClassInfo()
}

onMounted(() => {
  initPage()
})
</script>

<template>
  <!-- 搜索表单 -->
  <a-form layout="inline" @submit.prevent="handleSearch">
    <a-form-item label="学生姓名">
      <a-input
        v-model:value="searchForm.studentName"
        placeholder="请输入学生姓名（支持模糊搜索）"
        allow-clear
      />
    </a-form-item>
    <a-form-item label="学生学号">
      <a-input v-model:value="searchForm.studentNo" placeholder="请输入学生学号" allow-clear />
    </a-form-item>
    <a-form-item label="学生班级">
      <a-select
        v-model:value="searchForm.classId"
        :options="classList"
        placeholder="请选择学生班级"
        allow-clear
      />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">搜索</a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="css" scoped></style>
