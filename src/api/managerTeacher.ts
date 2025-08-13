// src/api/managerTeacher.ts
import request from '@/utils/http'

// 添加教师 DTO
export interface ClassCourseDTO {
    classId: number
    courseId: number
}

export interface AddTeacherDTO {
    teacherName: string
    teacherBirthday: string // LocalDate → string (yyyy-MM-dd)
    teacherGender: string
    teacherNo: string
    selectClassCourse?: ClassCourseDTO[]
}

export interface EditTeacherDTO {
    teacherId: number
    teacherNo?: string
    teacherName?: string
    teacherBirthday?: string
    teacherGender?: string
    selectClassCourse?: ClassCourseDTO[]
}

export interface ListTeacherDTO {
    teacherId?: number
    teacherNo?: string
    teacherName?: string
    teacherGender?: string
}

export interface Page<T> {
    records: T[]
    total: number
    size: number
    current: number
}

export interface ListTeacherVO {
    teacherId: number
    teacherNo: string
    teacherName: string
    teacherBirthday: string
    teacherGender: string
    selectClassCourse: []
}

// 添加教师
export function addTeacher(data: AddTeacherDTO) {
    return request.post('/manager/teacher/add', data)
}

// 修改教师
export function editTeacher(data: EditTeacherDTO) {
    return request.post('/manager/teacher/edit', data)
}

// 删除教师
export function deleteTeacher(teacherId: number) {
    return request.get('/manager/teacher/delete', {
        params: { teacherId }
    });
}

// 分页查询教师
export function listTeacher(page: number, size: number, params: ListTeacherDTO) {
    return request.post(`/manager/teacher/list/${page}/${size}`, params)
}
