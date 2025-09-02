<script lang="ts" setup>
import managerAPI from '@/api/managerAPI'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'

const columns = [
  { title: 'id', dataIndex: 'id', key: 'id' },
  { title: '学院名称', dataIndex: 'collegeName', key: 'collegeName' },
  { title: '专业名称', dataIndex: 'majorName', key: 'majorName' },
  { title: '创建时间', dataIndex: 'createDate', key: 'createDate' },
  { title: '更新时间', dataIndex: 'updateDate', key: 'updateDate' },
  { title: '操作', dataIndex: 'action', key: 'action' },
]
const addForm = reactive({
  majorId: '',
  majorName: '',
  collegeId: '',
})
const collegeOptionData = ref([])
const addModalVisible = ref(false)
const isEdit = ref(false)
const userStore = useUserStore()
const tableData = ref([])
const editOpen = (record: { id: string; collegeName: string }) => {
  isEdit.value = true
  addModalVisible.value = true
  addForm.majorId = record.id
  addForm.majorName = record.collegeName
}
const modalHandleOk = async () => {
  try {
    if (isEdit.value) {
      await managerAPI.majorEdit({
        majorId: addForm.majorId,
        majorName: addForm.majorName,
      })
      return
    } else {
      await managerAPI.addMajor({
        majorName: addForm.majorName,
        collegeId: addForm.collegeId,
      })
    }
    message.success(`${isEdit.value ? '编辑' : '新增'}成功`)
  } catch (error) {
    console.error(error)
    message.error(`${isEdit.value ? '编辑' : '新增'}失败`)
  } finally {
    addModalVisible.value = false
    await fetchTableData()
  }
}
const fetchTableData = async () => {
  tableData.value = (await managerAPI.majorList(userStore.loginUserInfo?.universityId)) as []
}
const fetchCollegeData = async () => {
  const resp = (await managerAPI.collegeList(userStore.loginUserInfo?.universityId)) as []
  collegeOptionData.value = resp.map((item: { id: string; collegeName: string }) => ({
    label: item.collegeName,
    value: item.id,
  }))
}
onMounted(() => {
  fetchTableData()
  fetchCollegeData()
})
</script>
<template>
  <a-space>
    <a-button
      type="primary"
      @click="
        () => {
          isEdit = false
          addModalVisible = true
        }
      "
      >新增专业</a-button
    >
  </a-space>
  <a-table :columns="columns" :data-source="tableData" row-key="id">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-space>
          <a-button type="link" @click="editOpen(record)">编辑</a-button>
          <!-- <a-button type="link" danger>删除</a-button> -->
        </a-space>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="addModalVisible"
    :title="isEdit ? '编辑专业' : '新增专业'"
    ok-text="确认"
    cancel-text="取消"
    @ok="modalHandleOk"
  >
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
      <a-form-item
        label="专业所属学院"
        name="collegeId"
        :rules="[{ required: true, message: '请选择所属学院' }]"
      >
        <a-select v-model:value="addForm.collegeId" placeholder="请选择专业所属学院">
          <a-select-option
            v-for="item in collegeOptionData"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        label="专业名称"
        name="majorName"
        :rules="[{ required: true, message: '请输入专业名称' }]"
      >
        <a-input v-model:value="addForm.majorName" placeholder="请输入专业名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
