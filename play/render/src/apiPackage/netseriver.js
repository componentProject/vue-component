import { defaultAxiosInstance, createAxiosInstance, baseAxios } from './axios.js'
import { HttpRequest, http as defaultHttp } from './http.js'

/**
 * Vue Axios插件
 * 提供全局的$http方法，整合axios.js的实例和http.js的请求方法
 */
const VueAxiosPlugin = {
  install(app, options = {}) {
    // 创建基于不同axios实例的HttpRequest实例
    const httpInstances = {
      // 默认实例
      default: new HttpRequest(defaultAxiosInstance),

    }

    // 创建统一的HTTP服务对象
    const httpService = {
      // 各个实例
      ...httpInstances,

      // 快捷方法 - 使用默认实例
      get(url, params = {}, config = {}) {
        return httpInstances.default.get(url, params, config)
      },

      post(url, data = {}, params = {}, config = {}) {
        return httpInstances.default.post(url, data, params, config)
      },

      put(url, data = {}, params = {}, config = {}) {
        return httpInstances.default.put(url, data, params, config)
      },

      delete(url, params = {}, data = {}, config = {}) {
        return httpInstances.default.delete(url, params, data, config)
      },

      // 上传文件方法
      uploadFile(url, file, config = {}) {
        const formData = new FormData()
        formData.append('file', file)
        return httpInstances.default.upload(url, formData, config)
      },

      // 批量请求
      all(requests) {
        return httpInstances.default.all(requests)
      },
    }

    // 全局注入$http方法
    app.config.globalProperties.$http = httpService

    // 同时提供provide/inject支持
    app.provide('$http', httpService)

    // 可选：在Vue3的选项式API中也可使用
    if (options.globalMixin !== false) {
      app.mixin({
        created() {
          this.$http = httpService
        }
      })
    }

    // 同时提供默认实例的独立访问
    app.provide('$httpDefault', httpInstances.default)
  }
}

// 默认导出插件
export default VueAxiosPlugin

// 同时导出各个实例和创建函数，方便按需导入
export { defaultAxiosInstance, createAxiosInstance, baseAxios }
