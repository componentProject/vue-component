import type { App } from 'vue'
import type BaseApi from '../class'
/**
 * BaseApi 配置接口，用于配置 BaseApi 实例的所有选项
 */
export interface BaseApiConfig {
  /** API 基础地址 */
  baseURL?: string
  /** 请求超时时间（毫秒），默认 5000 */
  timeout?: number
  /** 响应字段映射配置 */
  responseFields?: {
    /** 响应状态码字段名，默认 'Code' */
    code?: string
    /** 响应消息字段名，默认 'Message' */
    message?: string
    /** 响应数据字段名，默认 'data' */
    data?: string
    /** 错误数组字段名 */
    errors?: string
    /** 提示信息字段名 */
    tips?: string
  }
  /** 请求超时回调函数 */
  onTimeout?: () => void
  /** 获取 token 的函数，每次请求前自动调用 */
  getToken?: () => string | null
  /** 登录失效回调函数，当检测到 401 错误时调用 */
  onLoginRequired?: () => void
  /** 是否启用 code === -1 的系统异常弹窗，默认为 true */
  enableSystemErrorDialog?: boolean
  /** 允许其他任意配置项，会直接传递给 axios.create */
  [key: string]: any
}
/**
 * Vue Axios 插件配置选项
 */
export interface vueAxiosPluginOptionsType {
  /** 默认 HTTP 服务配置 */
  default?: BaseApiConfig
  /** 是否在所有组件中通过 mixin 注入 $http，默认为 true */
  globalMixin?: boolean
}

/**
 * Vue HTTP 服务类型，在 Vue 应用中通过 this.$http 或 inject('$http') 获取
 */
export type vueHttpServiceType = BaseApi

/**
 * Vue Axios 插件类型，定义了 Vue 插件的标准接口
 */
export interface vueAxiosPluginType {
  /**
   * 安装插件
   * @param app - Vue 应用实例
   * @param options - 插件配置选项
   */
  install: (app: App, options?: vueAxiosPluginOptionsType) => void
}
