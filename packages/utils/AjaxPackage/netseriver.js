import { createAxiosInstance } from './axios.js'
import { HttpRequest } from './http.js'

/**
 * 创建 HTTP 服务实例
 * @param {object} options - 配置选项
 * @param {string} options.baseURL - 基础URL
 * @param {number} options.timeout - 超时时间
 * @param {Function} options.getToken - 获取token的函数
 * @param {Function} options.onLoginRequired - 登录失效回调
 * @param {object} options.responseFields - 响应字段映射
 * @param {Function} options.responseHandler - 响应处理器
 * @returns {object} HTTP服务实例
 */
function createHttpService(options = {}) {
  const { baseURL = '', timeout = 5000, getToken, onLoginRequired, responseFields, ...rest } = options
  const defaultConfig = {
    baseURL,
    timeout,
    getToken: getToken || (() => localStorage.getItem('token') || ''),
    onLoginRequired: onLoginRequired || (() => {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`
    }),
    responseFields: {
      code: 'code',
      message: 'msg',
      data: 'data',
      ...responseFields,
    },
  }

  // 创建axios实例
  const axiosInstance = createAxiosInstance(
    defaultConfig.baseURL,
    defaultConfig.timeout,
    {
      getToken: defaultConfig.getToken,
      onLoginRequired: defaultConfig.onLoginRequired,
      responseFields: defaultConfig.responseFields,
      responseHandler: defaultConfig.responseHandler,
      ...rest,
    },
  )

  // 创建HTTP请求实例
  const httpInstance = new HttpRequest(axiosInstance)

  // 创建统一的HTTP服务对象
  return {
    // 核心实例
    instance: httpInstance,

    // 快捷方法
    get(url, params, config) {
      return httpInstance.get(url, params, config)
    },

    post(url, data, config, addSign) {
      // 保持现有的优先级逻辑，但移除默认值
      if (typeof addSign === 'function') {
        return httpInstance.post(url, data, config, addSign)
      }
      return httpInstance.post(url, data, config)
    },

    put(url, data, config) {
      return httpInstance.put(url, data, config)
    },

    delete(url, params, config) {
      return httpInstance.delete(url, params, config)
    },

    // 上传文件方法
    uploadFile(url, file, config) {
      const formData = new FormData()
      formData.append('file', file)
      return httpInstance.upload(url, formData, config)
    },

    // 批量请求
    all(requests) {
      return httpInstance.all(requests)
    },
  }
}

/**
 * Vue Axios插件
 * 提供全局的$http方法，支持多个配置化的axios实例
 */
const VueAxiosPlugin = {
  install(app, options = {}) {
    // 创建默认实例
    const defaultHttpService = createHttpService(options.default)

    const httpInstances = {
      default: defaultHttpService.instance,
    }

    // 创建其他配置化的实例
    if (options.instances) {
      Object.entries(options.instances).forEach(([name, config]) => {
        const instanceService = createHttpService({
          ...options.default,
          ...config,
        })
        httpInstances[name] = instanceService.instance
      })
    }

    // 创建统一的HTTP服务对象
    const httpService = {
      // 各个实例
      ...httpInstances,

      // 快捷方法 - 使用默认实例
      get(url, params, config) {
        return defaultHttpService.get(url, params, config)
      },

      post(url, data, config) {
        return defaultHttpService.post(url, data, config)
      },

      put(url, data, config) {
        return defaultHttpService.put(url, data, config)
      },

      delete(url, params, config) {
        return defaultHttpService.delete(url, params, config)
      },

      // 上传文件方法
      uploadFile(url, file, config) {
        return defaultHttpService.uploadFile(url, file, config)
      },

      // 批量请求
      all(requests) {
        return defaultHttpService.all(requests)
      },
    }

    // 全局注入$http方法
    app.config.globalProperties.$http = httpService

    // 同时提供provide/inject支持
    app.provide('$http', httpService)

    // 为每个实例提供独立的访问
    Object.entries(httpInstances).forEach(([name, instance]) => {
      app.provide(`$http${name.charAt(0).toUpperCase() + name.slice(1)}`, instance)
    })

    // 可选：在Vue3的选项式API中也可使用
    if (options.globalMixin !== false) {
      app.mixin({
        created() {
          this.$http = httpService
        },
      })
    }

    // 挂载到window对象以便非Vue环境使用
    if (typeof window !== 'undefined') {
      window.$http = httpService
    }
  },
}

// 默认导出插件
export default VueAxiosPlugin

// 导出创建函数，方便按需导入
export { createAxiosInstance, createHttpService }

export function getHttpService(options) {
  return createHttpService(options)
}
