import type { App } from 'vue'
import type {
  BaseApiConfig,
  vueAxiosPluginOptionsType,
  vueAxiosPluginType,
  vueHttpServiceType,
} from './_types'
import BaseApi from './class'

declare global {
  interface Window {
    $http?: vueHttpServiceType
  }
}

/**
 * 创建 HTTP 服务实例
 * @param options - API 配置对象
 * @returns BaseApi 实例
 */
function createHttpService(options: BaseApiConfig = {}): BaseApi {
  return new BaseApi(options)
}

/**
 * Vue Axios 插件，用于在 Vue 应用中全局注册 HTTP 服务
 * 提供 this.$http、inject('$http') 和 window.$http 三种使用方式
 */
const VueAxiosPlugin: vueAxiosPluginType = {
  /**
   * 安装插件
   * @param app - Vue 应用实例
   * @param options - 插件配置选项
   */
  install(app: App, options: vueAxiosPluginOptionsType = {}) {
    const httpService = createHttpService(options.default ?? {})

    app.config.globalProperties.$http = httpService
    app.provide('$http', httpService)

    if (options.globalMixin !== false) {
      app.mixin({
        created() {
          this.$http = httpService
        },
      })
    }

    if (typeof window !== 'undefined') {
      window.$http = httpService
    }
  },
}

/**
 * 获取 HTTP 服务实例，与 createHttpService 功能相同
 * @param options - API 配置对象
 * @returns BaseApi 实例
 */
function getHttpService(options: BaseApiConfig = {}): BaseApi {
  return createHttpService(options)
}

export default VueAxiosPlugin
export { createHttpService, getHttpService }
