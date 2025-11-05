import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'

// 检查 document 是否存在
const hasDocument = typeof document !== 'undefined'

// 创建消息实例的包装函数
const createMessageWrapper = () => {
  if (hasDocument) {
    return ElMessage
  }
  return {
    success: (options) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.log(`[Message Success] ${message}`)
    },
    error: (options) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.error(`[Message Error] ${message}`)
    },
    warning: (options) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.warn(`[Message Warning] ${message}`)
    },
    info: (options) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.info(`[Message Info] ${message}`)
    },
  }
}

// 创建通知实例的包装函数
const createNotificationWrapper = () => {
  if (hasDocument) {
    return ElNotification
  }
  const consoleNotification = (options, level = 'info') => {
    const opts = typeof options === 'string' ? { message: options } : options
    const message = opts?.message || ''
    const title = opts?.title || '提示'
    const logMessage = `[Notification ${level}] ${title}: ${message}`

    switch (level) {
      case 'success':
        console.log(logMessage)
        break
      case 'error':
        console.error(logMessage)
        break
      case 'warning':
        console.warn(logMessage)
        break
      default:
        console.info(logMessage)
    }
  }

  const wrapper = (options) => {
    const opts = typeof options === 'string' ? { message: options } : options
    const type = opts?.type || 'info'
    consoleNotification(options, type)
  }

  wrapper.success = (options) => consoleNotification(options, 'success')
  wrapper.error = (options) => consoleNotification(options, 'error')
  wrapper.warning = (options) => consoleNotification(options, 'warning')
  wrapper.info = (options) => consoleNotification(options, 'info')

  return wrapper
}

const MessageWrapper = createMessageWrapper()
const NotificationWrapper = createNotificationWrapper()

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
    ...rest
  } = options

  const instance = axios.create({
    baseURL,
    timeout,
    ...rest,
  })

  // 请求拦截器 - 添加token和签名
  instance.interceptors.request.use(
    (config) => {
      // 添加token到请求头
      const token = getToken()
      if (token) {
        config.headers.Token = `${token}`
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

      // 支持路径解析的辅助函数
      function getValueByPath(obj, path) {
        if (!path)
          return obj
        const keys = path.split('.')
        let result = obj
        for (const key of keys) {
          if (result && typeof result === 'object' && key in result) {
            result = result[key]
          }
          else {
            return undefined
          }
        }
        return result
      }

      // 使用配置的字段名获取值，支持路径解析
      const code = getValueByPath(data, responseFields.code) || data.statusCode
      const message = getValueByPath(data, responseFields.message) || ''
      const responseData = getValueByPath(data, responseFields.data) || {}

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
        MessageWrapper.error({
          message,
          duration: 100 * 1000,
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
        if (hasDocument) {
          NotificationWrapper.error({
            title: '提示',
            message: html,
            dangerouslyUseHTMLString: true,
            duration: 10000,
          })
        }
        else {
          const errorMessages = errors.map(item => `${item.code}：${item.message}`).join('\n')
          NotificationWrapper.error({
            title: '提示',
            message: errorMessages,
          })
        }
        return Promise.reject(new Error('请求错误'))
      }

      // 处理提示信息
      const tips = responseData[responseFields.tips]
      if (tips?.length) {
        let html = ``
        tips.forEach((item) => {
          html += `<div style="font-size: 14px;color:#E6A23C">${item.code}：${item.message}</div>`
        })
        if (hasDocument) {
          NotificationWrapper.warning({
            title: '提示',
            message: html,
            dangerouslyUseHTMLString: true,
            duration: 10000,
          })
        }
        else {
          const tipMessages = tips.map(item => `${item.code}：${item.message}`).join('\n')
          NotificationWrapper.warning({
            title: '提示',
            message: tipMessages,
          })
        }
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
        MessageWrapper.error({
          message: '登录已过期，请重新登录',
          duration: 5 * 1000,
        })
      }
      else if (error.code === 'ECONNABORTED') {
        // timeout错误处理
        if (error.message.includes('timeout')) {
          MessageWrapper.error({
            message: '请求超时，请检查网络连接或稍后重试',
            duration: 5 * 1000,
          })
        }
        else {
          // 其他连接中止错误
          MessageWrapper.error({
            message: '网络连接异常，请检查网络设置',
            duration: 5 * 1000,
          })
        }
      }
      else {
        MessageWrapper.error({
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
export const defaultAxiosInstance = createAxiosInstance('')
export { axios as baseAxios }
