import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

/**
 * 创建基础的axios实例
 * @param {string} baseURL - 基础URL
 * @param {number} timeout - 超时时间
 * @param {object} options - 额外配置选项
 * @param {Function} options.getToken - 获取token的函数
 * @param {Function} options.onLoginRequired - 需要登录回调
 * @returns {import('axios').AxiosInstance}
 */
export function createAxiosInstance(baseURL, timeout = 5000, options = {}) {
  const {
    getToken = () => '',
    onLoginRequired = () => {},
    responseFields = {
      code: 'Code', // 状态码字段名
      message: 'Message', // 消息字段名
      data: 'data', // 数据字段名
      errors: 'errors', // 错误数组字段名
      tips: 'tipss', // 提示信息字段名
    },
    // 新增自定义响应处理器
    responseHandler = null,
  } = options

  const instance = axios.create({
    baseURL,
    timeout,
  })

  // 请求拦截器 - 添加token
  instance.interceptors.request.use(
    (config) => {
      // 添加token到请求头
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      const res = response
      if (res.status !== 200) {
        return Promise.reject(new Error(res.data?.message || 'Error'))
      }

      const data = res.data
      // 使用配置的字段名获取值
      const code = data[responseFields.code] || data.statusCode
      const message = data[responseFields.message] || ''
      const responseData = data[responseFields.data] || {}

      // 如果有自定义响应处理器，优先使用
      if (responseHandler && typeof responseHandler === 'function') {
        return responseHandler(response)
      }

      // 处理token过期 (假设401表示token过期)
      if (code === 401) {
        return Promise.reject(new Error('登录失效，请重新登录'))
      }

      // 处理其他错误码
      if (code != 200) {
        ElMessage({
          message,
          type: 'error',
        })
        return Promise.reject(new Error(message || 'Error'))
      }

      // 处理错误信息
      const errors = responseData[responseFields.errors]
      if (errors?.length) {
        let html = ``
        errors.forEach((item) => {
          html += `<div style="font-size: 14px;color:red">${item.code}：${item.message}</div>`
        })
        ElNotification({
          title: '提示',
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 10000,
          message: html,
        })
        return Promise.reject(new Error('请求错误'))
      }

      // 处理提示信息
      const tips = responseData[responseFields.tips]
      if (tips?.length) {
        let html = ``
        tips.forEach((item) => {
          html += `<div style="font-size: 14px;color:#E6A23C">${item.code}：${item.message}</div>`
        })
        ElNotification({
          title: '提示',
          type: 'warning',
          dangerouslyUseHTMLString: true,
          duration: 10000,
          message: html,
        })
      }

      return {
        ...data,
        Code: code,
      }
    },
    async (error) => {
      // 处理响应错误
      if (error.response?.status === 401) {
        // token过期，触发回调
        onLoginRequired()
        ElMessage.error({
          message: '登录已过期，请重新登录',
          duration: 5 * 1000,
        })
      }
      else if (error.code === 'ECONNABORTED') {
        // timeout错误处理
        if (error.message.includes('timeout')) {
          ElMessage.error({
            message: '请求超时，请检查网络连接或稍后重试',
            duration: 5 * 1000,
          })
        }
        else {
          // 其他连接中止错误
          ElMessage.error({
            message: '网络连接异常，请检查网络设置',
            duration: 5 * 1000,
          })
        }
      }
      else {
        ElMessage.error({
          message: error.response?.data || '网络错误',
          duration: 5 * 1000,
        })
      }

      return Promise.reject(error)
    },
  )

  return instance
}

// 默认导出保持不变
export const defaultAxiosInstance = createAxiosInstance(import.meta.env.VITE_APP || '')
export { axios as baseAxios }
