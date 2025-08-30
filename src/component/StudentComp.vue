<script lang="ts" setup>
import { getClassByUniversityId, type ClassByUniversityVO } from '@/api/classApi'
import { useUserStore } from '@/stores/user'
import { onMounted, reactive, ref } from 'vue'
import columns from './StudentComp/StudentTableColumn'
import managerAPI, { type AddStudentDTO, type ListStudentDTO } from '@/api/managerAPI'
import { message } from 'ant-design-vue'

const userStore = useUserStore()
const pag = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
})
const searchForm = reactive({
  studentNo: '',
  studentName: '',
  studentGender: '',
})
const addStudentForm = reactive<AddStudentDTO>({
  studentNo: '',
  studentName: '',
  studentGender: '',
  studentAge: 22,
  classId: 1,
  studentBirthday: '',
})
const addStudentModalVisible = ref(false)
const classList = ref<{ label: string; value: number }[]>([])
const studentData = ref([])

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

const handleSearch = async () => {
  pag.current = 1
  await fetchStudentData()
}

const addStudent = async () => {
  console.log(addStudentForm)
  try {
    await managerAPI.addStudent(addStudentForm)
    addStudentModalVisible.value = false
    message.success('添加学生成功')
    await fetchStudentData()
  } catch (error) {
    console.error('添加学生失败:', error)
  }
}

const fetchStudentData = async () => {
  const resp = await managerAPI.fetchStudentData(pag.current, pag.pageSize, searchForm)
  studentData.value = resp.records
  pag.total = resp.total
}

const initPage = async () => {
  await fetchAllClassInfo()
  await fetchStudentData()
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
    <a-form-item>
      <a-button @click="addStudentModalVisible = true">添加学生</a-button>
    </a-form-item>
  </a-form>

  <a-table :columns="columns" :data-source="studentData"></a-table>

  <a-modal v-model:open="addStudentModalVisible" title="添加学生">
    <div>添加学生表单</div>
    <a-form>
      <a-form-item label="学生学号">
        <a-input
          v-model:value="addStudentForm.studentNo"
          placeholder="请输入学生学号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="学生姓名">
        <a-input
          v-model:value="addStudentForm.studentName"
          placeholder="请输入学生学号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="学生年龄">
        <a-input-number
          v-model:value="addStudentForm.studentAge"
          placeholder="请输入学生学号"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="学生姓名">
        <a-select
          v-model:value="addStudentForm.classId"
          :options="classList"
          placeholder="请选择学生班级"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="学生性别">
        <a-select
          v-model:value="addStudentForm.studentGender"
          placeholder="请选择学生性别"
          allow-clear
        >
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="学生生日">
        <a-date-picker v-model:value="addStudentForm.studentBirthday" picker="month" />
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="addStudentModalVisible = false">取消</a-button>
      <a-button type="primary" @click="addStudent">提交</a-button>
    </template>
  </a-modal>
</template>

<style lang="css" scoped></style>
