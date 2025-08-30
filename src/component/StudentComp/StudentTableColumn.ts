import { h } from "vue";

const columns = [
  {
    title: '学号',
    dataIndex: 'studentNo',
    key: 'studentNo',
    align: 'center',
  },
  {
    title: '姓名',
    dataIndex: 'studentName',
    key: 'studentName',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'studentGender',
    key: 'studentGender',
    align: 'center',
  },
  {
    title: '生日',
    dataIndex: 'studentBirthday',
    key: 'studentBirthday',
    align: 'center',
  },
  {
    title: '年龄',
    dataIndex: 'studentAge',
    key: 'studentAge',
    align: 'center',
  },
  {
    title: '班级',
    key: 'className',
    customRender: (record: any) => {
      return h('span', record.record.classVO.className);
    }
  }
];


export default columns;
