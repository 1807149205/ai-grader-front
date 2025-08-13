// src/api/login.ts
import type { LoginUserInfo } from '@/stores/user'
import request from '@/utils/http'

// 登录 DTO
export interface UserLoginDTO {
  username: string
  password: string
}

// 注册 DTO
export interface UserRegisterDTO {
  username: string
  password: string
  role: string,
  managerName: string;
  universityId: number
}

// 登录
export function login(data: UserLoginDTO) {
  return request.post<LoginUserInfo>('/user/login', data)
}

// 注册
export function register(data: UserRegisterDTO) {
  return request.post<void>('/user/register', data)
}
