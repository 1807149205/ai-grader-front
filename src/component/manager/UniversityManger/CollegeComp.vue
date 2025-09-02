<script lang="ts" setup>
import managerAPI from '@/api/managerAPI'
import { useUserStore } from '@/stores/user'
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'

const columns = [
  { title: 'id', dataIndex: 'id', key: 'id' },
  { title: '学院名称', dataIndex: 'collegeName', key: 'collegeName' },
  { title: '创建时间', dataIndex: 'createDate', key: 'createDate' },
  { title: '更新时间', dataIndex: 'updateDate', key: 'updateDate' },
  { title: '操作', dataIndex: 'action', key: 'action' },
]
const addForm = reactive({
  collegeId: '',
  collegeName: '',
})
const addModalVisible = ref(false)
const isEdit = ref(false)
const userStore = useUserStore()
const tableData = ref([])
const editOpen = (record: { id: string; collegeName: string }) => {
  isEdit.value = true
  addModalVisible.value = true
  addForm.collegeId = record.id
  addForm.collegeName = record.collegeName
}
const modalHandleOk = async () => {
  try {
    if (isEdit.value) {
      await managerAPI.editCollege({
        collegeId: addForm.collegeId,
        collegeName: addForm.collegeName,
      })
      return
    } else {
      await managerAPI.addCollege({
        collegeName: addForm.collegeName,
        universityId: userStore.loginUserInfo?.universityId as number,
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
  tableData.value = (await managerAPI.collegeList(userStore.loginUserInfo?.universityId)) as []
}
onMounted(() => {
  fetchTableData()
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
      >新增学院</a-button
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
    :title="isEdit ? '编辑学院' : '新增学院'"
    ok-text="确认"
    cancel-text="取消"
    @ok="modalHandleOk"
  >
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
      <a-form-item
        label="学院名称"
        name="collegeName"
        :rules="[{ required: true, message: '请输入学院名称' }]"
      >
        <a-input v-model:value="addForm.collegeName" placeholder="请输入学院名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
