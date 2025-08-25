import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

/**
 * 创建基础的axios实例
 * @param {string} baseURL - 基础URL
 * @returns {import('axios').AxiosInstance}
 */
export function createAxiosInstance(baseURL) {
  const instance = axios.create({
    baseURL,
    timeout: 5000,
  })

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      config.data = {
        ...config.data,
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
      const code = data.Code || data.statusCode
      // 处理错误码
      if (code != 200) {
        ElMessage({
          message: data.Message || data.message,
          type: 'error',
        })
        return Promise.reject(new Error(data.Message || data.message || 'Error'))
      }

      // 处理错误信息
      if (data.data?.errors?.length) {
        let html = ``
        data.data.errors.forEach((item) => {
          html += `<div style="font-size: 14px;color:red">${item.code}：${item.message}</div>`
        })
        ElNotification({
          title: '提示',
          type: 'error',
          dangerouslyUseHTMLString: true,
          duration: 10000,
          message: html,
        })
        return Promise.reject(new Error(data.data?.errors || 'Error'))
      }
      // 处理提示信息
      if (data?.data?.tipss?.length) {
        let html = ``
        data.data.tipss.forEach((item) => {
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
        //登录失效，重新登录
        ElMessage.error({
          message: '登录失效，请重新登录',
          duration: 5 * 1000,
        })
      }

      ElMessage.error({
        message: error.response?.data || '',
        duration: 5 * 1000,
      })
      return Promise.reject(error)
    },
  )

  return instance
}

/**
 * 创建默认的axios实例
 * @returns {import('axios').AxiosInstance}
 */
export const defaultAxiosInstance = createAxiosInstance(import.meta.env.VITE_APP)

// 导出原始的axios实例，供特殊需求使用
export { axios as baseAxios }
