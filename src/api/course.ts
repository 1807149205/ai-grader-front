import request from '@/utils/http'

export interface Course {
    id : number;
    courseName: string;
    majorId: number;
    createDate: string;
    updateDate: string;
}

export function getCourseByUniversityId(universityId: number) {
  return request.get<Course[]>('/manager/course/getCourseByUniversityId', {
    params: {
      universityId
    }
  })
}