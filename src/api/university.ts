import request from '@/utils/http'

export function getAllUniversity() {
    return request.get<[]>('/university/getAll')
}