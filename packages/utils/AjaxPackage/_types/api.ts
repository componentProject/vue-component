import type { AxiosRequestConfig } from 'axios'
import type { App } from 'vue'
import type BaseApi from '../class'

/**
 * HTTP 服务响应字段类型，用于配置响应数据中各个字段的路径
 */
export interface httpServiceResponseFieldsType {
  /** 响应状态码字段名，支持嵌套路径 */
  code?: string
  /** 响应消息字段名，支持嵌套路径 */
  message?: string
  /** 响应数据字段名，支持嵌套路径 */
  data?: string
}

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
  /** 允许其他任意配置项，会直接传递给 axios.create */
  [key: string]: any
}

/**
 * HTTP 服务实例类型，定义了 HTTP 服务实例应该提供的所有方法
 */
export interface httpServiceInstanceType {
  /** BaseApi 实例 */
  instance: BaseApi
  /** 发送 GET 请求 */
  get: <R = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => Promise<R>
  /** 发送 POST 请求 */
  post: <R = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ) => Promise<R>
  /** 发送 PUT 请求 */
  put: <R = any>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig) => Promise<R>
  /** 发送 DELETE 请求 */
  delete: <R = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig) => Promise<R>
  /** 上传文件 */
  uploadFile: <R = any>(url: string, file: File | Blob, config?: AxiosRequestConfig) => Promise<R>
  /** 批量请求 */
  all: <R = any>(requests: Array<Promise<R>>) => Promise<R[]>
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
