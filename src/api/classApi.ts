import request from '@/utils/http'


export interface ClassByUniversityVO {
    classId: number
    className: string
}

export function getClassByUniversityId(universityId: number) {
    return request.get<ClassByUniversityVO[]>('/manager/class/getClassByUniversityId', {
        params: {
            universityId
        }
    })
}