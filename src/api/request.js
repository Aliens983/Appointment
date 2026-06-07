// axios 统一封装:拦截器 + 统一错误处理
// VUE_APP_USE_MOCK=true 时挂载 mock 拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { getToken, clearToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截:自动塞 token
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截:统一拆 code,401 跳登录
service.interceptors.response.use(
  response => {
    const payload = response.data
    if (payload && typeof payload === 'object' && 'code' in payload) {
      if (payload.code === 0) return payload.data
      if (payload.code === 1001) {
        clearToken()
        ElMessage.error('登录已失效,请重新登录')
        router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
        return Promise.reject(new Error(payload.message || '未登录'))
      }
      ElMessage.error(payload.message || '请求失败')
      return Promise.reject(new Error(payload.message || 'request failed'))
    }
    return payload
  },
  error => {
    const msg = error?.response?.data?.message || error.message || '网络异常'
    ElMessage.error(msg)
    return Promise.reject(error)
  }
)

// 挂载 mock(开发环境 + VUE_APP_USE_MOCK=true)
if (process.env.VUE_APP_USE_MOCK === 'true') {
  // 动态 import 避免生产包打入
  // eslint-disable-next-line
  import('@/mock').then(({ setupMock }) => setupMock(service))
}

export default service
