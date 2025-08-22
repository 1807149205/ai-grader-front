<template>
  <div>
    <!-- 搜索表单 -->
    <a-form layout="inline" @submit.prevent="handleSearch">
      <a-form-item label="教师编号">
        <a-input v-model:value="searchForm.teacherNo" placeholder="请输入教师编号" allow-clear />
      </a-form-item>
      <a-form-item label="教师姓名">
        <a-input v-model:value="searchForm.teacherName" placeholder="请输入教师姓名" allow-clear />
      </a-form-item>
      <a-form-item label="性别">
        <a-select
          v-model:value="searchForm.teacherGender"
          placeholder="选择性别"
          allow-clear
          style="width: 120px"
        >
          <a-select-option value="男">男</a-select-option>
          <a-select-option value="女">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
      </a-form-item>
      <a-form-item>
        <a-button @click="uploadExcelModal = true">导入教师数据</a-button>
      </a-form-item>
      <a-form-item>
        <a href="/ai-grader-front/file/teacher-upload.xlsx" download="教师上传模板.xlsx"
          >下载示例模板</a
        >
      </a-form-item>
    </a-form>

    <!-- 教师表格 -->
    <a-table
      :columns="columns"
      :data-source="teacherList"
      :pagination="pagination"
      row-key="teacherId"
      bordered
      @change="handleTableChange"
      style="margin-top: 16px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'courses'">
          <a-space wrap>
            <a-tag
              v-for="item in record.teacherOwnerClassCourse"
              :key="`${item.classId}-${item.courseId}`"
            >
              {{ item.className }} - {{ item.courseName }}
            </a-tag>
          </a-space>
        </template>

        <template v-else-if="column.key === 'actions'">
          <a-space>
            <a-button type="link" @click="openEdit(record)">编辑</a-button>
            <a-button type="link" danger @click="removeTeacher(record.teacherId)">删除</a-button>
          </a-space>
        </template>

        <template v-else>
          {{ record[column.dataIndex] }}
        </template>
      </template>
    </a-table>

    <!-- 导入教师Excel弹窗 -->
    <a-modal
      v-model:open="uploadExcelModal"
      title="导入教师数据"
      @ok="uploadExcelOkHandle"
      @cancel="() => (uploadExcelModal = false)"
      ok-text="确定"
      cancel-text="取消"
    >
      <a-upload
        action="http://localhost:8080/manager/teacher/addByExcel"
        accept=".xlsx, .xls"
        v-model:file-list="uploadExcelFileList"
        name="file"
        @change="uploadExcelChange"
      >
        <a-button type="primary">选择文件</a-button>
      </a-upload>
      <div v-if="uploading" style="margin-top: 16px">正在上传...</div>
      <div v-if="uploadError" style="color: red; margin-top: 16px">{{ uploadError }}</div>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="editModalOpen"
      title="编辑教师"
      @ok="handleEditOk"
      @cancel="handleEditCancel"
      destroyOnClose
    >
      <a-form :model="editForm" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="教师编号">
          <a-input v-model:value="editForm.teacherNo" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="editForm.teacherName" />
        </a-form-item>
        <a-form-item label="生日">
          <a-date-picker v-model:value="editForm.teacherBirthday" style="width: 100%" />
        </a-form-item>
        <a-form-item label="性别">
          <a-select v-model:value="editForm.teacherGender" style="width: 100%">
            <a-select-option value="男">男</a-select-option>
            <a-select-option value="女">女</a-select-option>
          </a-select>
        </a-form-item>
        <div>教师授课情况</div>
        <a-card v-for="(cls, index) in editForm.selectClassCourse" :key="index">
          <div>
            <a-select
              v-model:value="cls.classId"
              show-search
              :options="allClassData"
              placeholder="选择教师的班级"
              style="width: 200px"
            ></a-select>
            <a-select
              v-model:value="cls.courseId"
              show-search
              :options="allCourseData"
              placeholder="选择教师的课程"
              style="width: 200px"
            ></a-select>
            <a-button @click="() => editForm.selectClassCourse.splice(index, 1)">删除</a-button>
          </div>
        </a-card>
        <a-button @click="() => editForm.selectClassCourse.push({ className: '', courseName: '' })"
          >新增</a-button
        >
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import {
  listTeacher,
  deleteTeacher,
  ListTeacherVO,
  ListTeacherDTO,
  addTeacher,
  editTeacher,
} from '@/api/managerTeacher'
import { message, Modal, type UploadChangeParam } from 'ant-design-vue'
import dayjs from 'dayjs'
import { getClassByUniversityId } from '@/api/classApi'
import { useUserStore } from '@/stores/user'
import { getCourseByUniversityId } from '@/api/course'

const userStore = useUserStore()

const uploadExcelModal = ref(false)
const teacherList = ref<ListTeacherVO[]>([])
const allCourseData = ref([])
const uploadExcelFileList = ref([])
const uploading = ref(false)
const uploadError = ref('')

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
})

const searchForm = reactive<ListTeacherDTO>({
  teacherNo: '',
  teacherName: '',
  teacherGender: '',
})
const allClassData = ref([])

const columns = [
  { title: '教师编号', dataIndex: 'teacherNo', key: 'teacherNo' },
  { title: '姓名', dataIndex: 'teacherName', key: 'teacherName' },
  { title: '生日', dataIndex: 'teacherBirthday', key: 'teacherBirthday' },
  { title: '性别', dataIndex: 'teacherGender', key: 'teacherGender' },
  { title: '班级与课程', dataIndex: 'teacherOwnerClassCourse', key: 'courses' },
  { title: '操作', key: 'actions', width: 150 },
]

// 编辑弹窗控制
const editModalOpen = ref(false)

// 编辑表单
const editForm = reactive({
  teacherId: 0,
  teacherNo: '',
  teacherName: '',
  teacherBirthday: null as null | dayjs.Dayjs,
  teacherGender: '',
  selectClassCourse: [],
})

const uploadExcelOkHandle = () => {}

const uploadExcelChange = (info: UploadChangeParam) => {
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList)
  }
  if (info.file.status === 'done') {
    // message.success(`${info.file.name} file uploaded successfully`)
    console.log(info.file.response, '上传结果')
    if (info.file.response.code === 200) {
      message.success('教师数据导入成功')
      uploadExcelModal.value = false
      loadData() // 重新加载教师数据
    } else {
      uploadError.value = info.file.response.message || '导入失败，请重试'
      message.error(uploadError.value)
      uploadExcelFileList.value = [] // 清空文件列表
      uploadExcelModal.value = false // 关闭弹窗
      uploadError.value = '' // 清空错误信息
    }
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`)
  }
}

const loadData = async () => {
  try {
    const res = await listTeacher(pagination.current, pagination.pageSize, searchForm)
    teacherList.value = res.records
    pagination.total = res.total
  } catch (error) {
    message.error('加载教师列表失败')
  }
}

const loadClassData = async () => {
  try {
    const res = await getClassByUniversityId(userStore.loginUserInfo?.universityId!)
    allClassData.value = res.map((d) => {
      return {
        label: d.className,
        value: d.classId,
      }
    })
  } catch (error) {
    message.error('班级数据加载失败')
  }
}

const handleSearch = () => {
  pagination.current = 1
  loadData()
}

const handleTableChange = (pageInfo: any) => {
  pagination.current = pageInfo.current
  pagination.pageSize = pageInfo.pageSize
  loadData()
}

const openEdit = (record: ListTeacherVO) => {
  console.log(record)
  editForm.teacherId = record.teacherId
  editForm.teacherNo = record.teacherNo
  editForm.teacherName = record.teacherName
  editForm.teacherGender = record.teacherGender
  editForm.teacherBirthday = record.teacherBirthday ? dayjs(record.teacherBirthday) : null
  editForm.selectClassCourse = record.teacherOwnerClassCourse
  editModalOpen.value = true
}

const handleEditOk = async () => {
  try {
    // 调用接口编辑教师，注意日期格式转换
    await editTeacher({
      teacherId: editForm.teacherId,
      teacherNo: editForm.teacherNo,
      teacherName: editForm.teacherName,
      teacherGender: editForm.teacherGender,
      teacherBirthday: editForm.teacherBirthday
        ? editForm.teacherBirthday.format('YYYY-MM-DD')
        : null,
      selectClassCourse: editForm.selectClassCourse, // 如果需要编辑班级课程，补充这里
    })
    message.success('编辑成功')
    editModalOpen.value = false
    loadData()
  } catch (error) {
    message.error('编辑失败')
  }
}

const loadCourseData = async () => {
  try {
    // 假设有一个获取课程数据的接口
    const res = await getCourseByUniversityId(userStore.loginUserInfo?.universityId!)
    console.log(res, 'res')
    allCourseData.value = res.map((d) => {
      return {
        label: d.courseName,
        value: d.id,
      }
    })
  } catch (error) {
    message.error('课程数据加载失败')
  }
}

const handleEditCancel = () => {
  editModalOpen.value = false
}

const removeTeacher = (teacherId: number) => {
  Modal.confirm({
    title: '确认删除该教师吗？',
    async onOk() {
      try {
        await deleteTeacher(teacherId)
        message.success('删除成功')
        loadData()
      } catch (error) {
        message.error('删除失败')
      }
    },
  })
}

onMounted(() => {
  loadData()
  loadClassData()
  loadCourseData()
})
</script>
