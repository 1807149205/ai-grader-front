import request from "@/utils/http"

export type ListStudentDTO = {
  studentId: string;
  studentNo: string;
  studentName: string;
  studentGender: string;
};

export type AddStudentDTO = {
  /** 学生姓名 */
  studentName: string;

  /** 学生学号 */
  studentNo: string;

  /** 学生性别 */
  studentGender: string;

  /** 学生年龄 */
  studentAge: number;

  /** 班级ID */
  classId: number;

  /** 学生出生日期 (后端 LocalDate 通常序列化为字符串) */
  studentBirthday: string;
};



export default {
  async fetchStudentData(page: number, pageSize: number, searchParams: ListStudentDTO) {
    return request.post(`/manager/student/list/${page}/${pageSize}`, searchParams)
  },
  async addStudent(data: AddStudentDTO) {
    return request.post('/manager/student/add', data)
  },
  async collegeList(universityId: number, collegeId?: number) {
    return request.get(`/manager/college/list`, {
      params: { universityId, collegeId }
    })
  },
  async addCollege(data: { collegeName: string; universityId: number }) {
    return request.post('/manager/college/add', data)
  },
  async editCollege(data: { collegeId: string; collegeName: string; }) {
    return request.post('/manager/college/edit', data)
  },
  async majorList(collegeId: number, majorId?: number, universityId?: number) {
    return request.get(`/manager/major/list`, {
      params: { collegeId, majorId, universityId }
    })
  },
  async majorEdit(data: { majorId: number | string; majorName: string; }) {
    return request.post('/manager/major/edit', data)
  },
  async addMajor(data: { majorName: string; collegeId: number | string }) {
    return request.post('/manager/major/add', data)
  }
}
