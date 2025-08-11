import { message } from 'ant-design-vue'
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'


// 1. 定义后端返回的泛型结构
export interface Resp<T> {
  code: number
  msg: string
  data: T
}

// 2. 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // 你的接口前缀
  timeout: 10000
})

// 3. 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 这里可以加 token
    // config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// 4. 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<Resp<any>>) => {
    const res = response.data
    if (res.code !== 200) {
      // 这里可以用 antd message 提示
      console.error(res.msg || '请求失败')
      message.error(res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    return res.data // 直接返回 data 部分
  },
  (error) => {
    console.error('网络错误', error)
    return Promise.reject(error)
  }
)

export default request
