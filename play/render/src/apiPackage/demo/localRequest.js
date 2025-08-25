import axios from 'axios'

const baseURL = import.meta.env.VITE_APP_DEV === 'development' ? 'http://192.168.31.176:26784' : 'http://localhost:26784'

// 创建 axios 实例（统一配置）
const apiClient = axios.create({
  baseURL: 'http://localhost:26784', // 本地服务地址
  timeout: 1000 * 60, // 请求超时
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    // 可添加认证头等
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
})

// 封装通用请求方法
export default {
  // GET 请求
  get(resource, params) {
    return apiClient.get(resource, { params })
  },

  // POST 请求
  post(resource, data) {
    return apiClient.post(resource, data)
  },

  // 其他方法 (PUT, DELETE 等)
  put(resource, data) {
    return apiClient.put(resource, data)
  },

  delete(resource) {
    return apiClient.delete(resource)
  },
}
