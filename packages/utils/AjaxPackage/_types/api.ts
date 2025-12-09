import type { AxiosRequestConfig } from 'axios'
import type { App } from 'vue'
import type { MessageInstance } from '../_utils/index.ts'
import type BaseApi from '../class.ts'
/**
 * BaseHttpClient 基础配置接口，包含最基础的 HTTP 客户端配置
 */
export interface BaseHttpClientConfig {
  /** API 基础地址 */
  baseURL?: string
  /** 请求超时时间（毫秒），默认 5000 */
  timeout?: number
  /** 请求超时回调函数，接收 messageInstance 用于显示消息提示 */
  onTimeout?: (messageInstance: MessageInstance) => void
  /** 获取 token 的函数，每次请求前自动调用 */
  getToken?: () => string | null
  /** 登录失效回调函数，当检测到 401 错误时调用，接收 messageInstance 用于显示消息提示 */
  onLoginRequired?: (messageInstance: MessageInstance) => void
  /** 允许其他任意配置项，会直接传递给 axios.create */
  [key: string]: any
}
/**
 * BaseApi 配置接口，用于配置 BaseApi 实例的所有选项
 * 继承 BaseHttpClientConfig，添加响应字段映射和系统异常弹窗配置
 */
export interface BaseApiConfig extends BaseHttpClientConfig {
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
  /** 是否启用 code === -1 的系统异常弹窗，默认为 true */
  enableSystemErrorDialog?: boolean
  /** 系统错误消息提示文本，默认为 '系统错误' */
  systemErrorMessage?: string
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

/**
 * 通知配置选项
 */
export interface NotificationOptions {
  /**
   * 通知标题
   */
  title?: string
  /**
   * 通知类型
   */
  type?: 'success' | 'error' | 'warning' | 'info'
  /**
   * 通知持续时间（毫秒）
   */
  duration?: number
  /**
   * 是否显示关闭按钮
   */
  showClose?: boolean
  /**
   * 自定义类名
   */
  customClass?: string
  /**
   * 自定义样式
   */
  customStyle?: string | Record<string, any>
  /**
   * 其他通知选项
   */
  [key: string]: any
}

/**
 * 扩展 AxiosRequestConfig，支持自定义通知配置
 */
export interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  /**
   * 错误通知配置选项，用于覆盖默认的错误通知参数
   */
  errorNotificationOptions?: NotificationOptions
  /**
   * 提示通知配置选项，用于覆盖默认的提示通知参数
   */
  tipsNotificationOptions?: NotificationOptions
  /**
   * 是否使用自定义消息处理
   * 当为 true 时，handleBusinessError、handleErrorArray、handleTips 都不会执行
   * 默认值为 false
   */
  isCustomMessage?: boolean
}
