// BaseHttpClient.ts文件
import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-05-09 08:53:16
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-05-09 09:06:54
 * @FilePath: \vue-template\src\api\utils\BaseHttpClient.ts
 * @Description: HTTP 客户端基础类，提供最基础的 HTTP 请求功能
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import type { BaseHttpClientConfig } from './_types/index.ts'
import type { MessageInstance, NotificationInstance } from './_utils/index.ts'
import axios from 'axios'
import {
  createMessageWrapper,
  createNotificationWrapper,
} from './_utils/index.ts'

/**
 * 默认登录失效回调，跳转到登录页
 * @param messageInstance - 消息实例，用于显示提示
 */
function defaultOnLoginRequired(messageInstance: MessageInstance) {
  messageInstance?.({
    type: 'error',
    message: '登录已过期，请重新登录',
    duration: 5 * 1000,
  })
  if (typeof window !== 'undefined') {
    window.location.href = `/login?redirect=${encodeURIComponent(window.location.href)}`
  }
}

/**
 * 默认获取 Token 函数，从 localStorage 读取
 */
function defaultGetToken() {
  return typeof localStorage !== 'undefined' ? localStorage.getItem('token') || '' : ''
}

/**
 * 生成 UUID（简单版本）
 * @returns UUID 字符串
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // 降级方案：使用 Math.random 生成
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * BaseHttpClient 基础类
 * 提供最基础的 HTTP 请求功能，包括：
 * - 创建 axios 实例
 * - 自动添加 Token
 * - 基础错误处理（401、超时等）
 * - HTTP 方法（get、post、put、delete、all）
 * - 文件上传
 */
export default class BaseHttpClient {
  protected baseURL: string = ''
  protected timeout: number = 5000
  protected onTimeout: (messageInstance: MessageInstance) => void
  protected getToken?: () => string | null
  protected onLoginRequired?: (messageInstance: MessageInstance) => void
  protected appendTo?: HTMLElement | string | null
  protected appendToFallback: string | null = 'body'
  protected containerId: string = ''
  protected popoverContainerId: string = ''
  protected messageContainerId: string = ''
  public instance: ReturnType<typeof axios.create>
  protected messageInstance: MessageInstance
  protected notificationInstance: NotificationInstance
  protected addSign?: (config: AxiosRequestConfig) => void
  // 最近的错误信息缓存，用于避免短时间内重复显示相同错误
  protected recentErrorCache: { message: string, timestamp: number } | null = null
  // 错误提示的防抖时间（毫秒）
  protected errorDebounceTime: number = 3000
  // 缓存清理定时器引用
  protected errorCacheTimer: NodeJS.Timeout | null = null

  /**
   * 检查是否在浏览器环境（在类初始化时判断）
   * 注意：这是静态属性，所有实例共享
   */
  protected static readonly hasDocument = typeof document !== 'undefined'

  /**
   * 获取是否在浏览器环境（实例 getter）
   * @returns 是否在浏览器环境
   */
  protected get hasDocument(): boolean {
    return BaseHttpClient.hasDocument
  }

  /**
   * 解析 appendTo 配置，返回目标 HTMLElement
   * @returns 目标元素，如果找不到且配置为 null 则返回 null，'body' 时返回 document.body，其他字符串作为选择器查找
   */
  protected resolveAppendToTarget(): HTMLElement | null {
    if (!this.hasDocument) {
      // 非浏览器环境不应该调用此方法，但为了类型安全返回 body
      return document.body
    }

    // 如果未配置 appendTo，默认使用 document.body
    if (!this.appendTo) {
      return document.body
    }

    // 如果是 HTMLElement，直接返回
    if (this.appendTo instanceof HTMLElement) {
      return this.appendTo
    }

    // 如果是字符串，作为选择器查询元素
    if (typeof this.appendTo === 'string') {
      const element = document.querySelector<HTMLElement>(this.appendTo)
      if (element) {
        return element
      }

      // 如果查询不到元素，根据 appendToFallback 配置处理
      if (this.appendToFallback === null) {
        // null 时返回 null，不降级，保障后续能正确添加到指定元素里
        console.warn(`appendTo 选择器 "${this.appendTo}" 未找到元素，appendToFallback 为 null，返回 null`)
        return null
      }
      else if (this.appendToFallback === 'body') {
        // 'body' 时使用 document.body
        return document.body
      }
      else if (typeof this.appendToFallback === 'string') {
        // 其他字符串作为选择器查找后备元素
        const fallbackElement = document.querySelector<HTMLElement>(this.appendToFallback)
        if (fallbackElement) {
          return fallbackElement
        }
        // 后备元素也找不到，返回 null，不降级到 body
        console.warn(`appendTo 选择器 "${this.appendTo}" 和 appendToFallback 选择器 "${this.appendToFallback}" 都未找到元素，返回 null`)
        return null
      }
    }

    // 其他情况返回 null
    return null
  }

  /**
   * 获取或创建 ajaxPackage-container 容器元素
   * @returns 容器元素，如果不是浏览器环境则返回 null
   */
  protected getContainer(): HTMLElement | null {
    if (!this.hasDocument) {
      return null
    }

    // 如果还没有生成 containerId，说明容器还没创建，需要生成唯一 ID
    if (!this.containerId) {
      const targetElementId = generateUUID()
      this.containerId = `ajaxPackage-container-${targetElementId}`
      this.popoverContainerId = `ajaxPackage-popover-${targetElementId}`
      this.messageContainerId = `ajaxPackage-message-${targetElementId}`
    }

    // 检查是否已存在容器
    let container = document.getElementById(this.containerId)
    if (!container) {
      // 创建容器元素，作为所有 AjaxPackage 弹层的统一挂载点
      container = document.createElement('div')
      container.id = this.containerId

      // 使用配置的 appendTo 目标元素，默认是 document.body
      const targetElement = this.resolveAppendToTarget()
      if (targetElement) {
        targetElement.appendChild(container)
      }
      else {
        // 如果 targetElement 为 null，说明配置了 appendTo 但找不到元素且 fallback 为 null
        // 这种情况下不应该创建容器，返回 null
        return null
      }

      // 创建 popover 子元素（用于 Dialog）
      const popoverContainer = document.createElement('div')
      popoverContainer.id = this.popoverContainerId
      // 设置较低的 zIndex 和 position，确保在 message 容器之下
      popoverContainer.style.position = 'relative'
      popoverContainer.style.zIndex = '999999'
      container.appendChild(popoverContainer)

      // 创建 message 子元素（用于 Message 和 Notification）
      const messageContainer = document.createElement('div')
      messageContainer.id = this.messageContainerId
      // 设置较高的 zIndex 和 position，确保在 popover 容器之上
      messageContainer.style.position = 'relative'
      messageContainer.style.zIndex = '99999999'
      container.appendChild(messageContainer)
    }
    return container
  }

  /**
   * 获取或创建 popover 容器元素（用于 Dialog）
   * @returns 容器元素，如果不是浏览器环境则返回 null
   */
  public getPopoverContainer(): HTMLElement | null {
    if (!this.hasDocument) {
      return null
    }

    // 确保主容器存在（每次调用时都检查，解决微前端环境容器可能未初始化的问题）
    const container = this.getContainer()
    if (!container) {
      return null
    }

    // 如果还没有生成 containerId，说明容器还没创建
    if (!this.popoverContainerId) {
      return null
    }

    // 获取或返回 popover 容器
    const popoverContainer = document.getElementById(this.popoverContainerId)

    // 如果容器存在但样式未设置，确保样式正确（zIndex 较低，确保在 message 之下）
    if (popoverContainer && !popoverContainer.style.position) {
      popoverContainer.style.position = 'relative'
      popoverContainer.style.zIndex = '999999'
    }

    return popoverContainer
  }

  /**
   * 获取或创建 message 容器元素（用于 Message 和 Notification）
   * @returns 容器元素，如果不是浏览器环境则返回 null
   */
  public getMessageContainer(): HTMLElement | null {
    if (!this.hasDocument) {
      return null
    }

    // 确保主容器存在（每次调用时都检查，解决微前端环境容器可能未初始化的问题）
    const container = this.getContainer()
    if (!container) {
      return null
    }

    // 如果还没有生成 containerId，说明容器还没创建
    if (!this.messageContainerId) {
      return null
    }

    // 获取或返回 message 容器
    const messageContainer = document.getElementById(this.messageContainerId)

    // 如果容器存在但样式未设置，确保样式正确（zIndex 最高，确保在 popover 之上）
    if (messageContainer && !messageContainer.style.position) {
      messageContainer.style.position = 'relative'
      messageContainer.style.zIndex = '99999999'
    }

    return messageContainer
  }

  /**
   * 创建 BaseHttpClient 实例
   * @param config - HTTP 客户端配置对象
   */
  constructor(config: BaseHttpClientConfig) {
    // 提取基础配置
    const {
      baseURL = '',
      timeout = 5000,
      onTimeout = () => {},
      getToken = defaultGetToken,
      onLoginRequired = defaultOnLoginRequired,
      appendTo,
      appendToFallback = 'body',
      addSign,
      ...axiosConfig
    } = config

    this.baseURL = baseURL
    this.timeout = timeout
    this.appendTo = appendTo
    this.appendToFallback = appendToFallback

    // 创建消息和通知实例，传入 hasDocument 和获取容器的函数
    // 使用函数形式，确保每次调用时都能获取到最新的容器（延迟初始化，解决微前端环境问题）
    this.messageInstance = createMessageWrapper(this.hasDocument, () => this.getMessageContainer())
    this.notificationInstance = createNotificationWrapper(this.hasDocument, () => this.getMessageContainer())
    this.onTimeout = onTimeout
    this.getToken = getToken
    this.onLoginRequired = onLoginRequired
    this.addSign = addSign

    // 创建axios实例，传入所有剩余配置
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...axiosConfig, // 将所有剩余参数传给axios.create
    })
    this.setupInterceptors()
  }

  /**
   * 处理请求配置，子类可重写此方法自定义请求配置
   * @param config - 请求配置对象
   * @returns 处理后的请求配置
   */
  processRequestConfig(config: InternalAxiosRequestConfig) {
    // 在请求发送前调用addSign函数
    if (this.addSign) {
      this.addSign(config)
    }
    return config
  }

  /**
   * 处理响应配置，子类可重写此方法自定义响应处理
   * 按照标准 HTTP 结构处理响应
   * @param response - Axios 响应对象
   * @returns 解析后的响应数据
   */
  processResponseConfig(response: AxiosResponse): AxiosResponse['data'] {
    // 检查 HTTP 状态码
    this.handleHttpStatus(response)

    // 处理成功响应
    return this.handleSuccessResponse(response)
  }

  /**
   * 处理 HTTP 状态码
   * 子类可重写此方法来自定义 HTTP 状态码处理逻辑
   * @param response - Axios 响应对象
   */
  protected handleHttpStatus(response: AxiosResponse): void {
    if (response.status !== 200) {
      throw new Error(response.data?.message || `HTTP Error: ${response.status}`)
    }
  }

  /**
   * 处理成功响应
   * 子类可重写此方法来自定义成功响应的处理逻辑
   * @param response - Axios 响应对象
   * @returns 解析后的响应数据
   */
  protected handleSuccessResponse(response: AxiosResponse): AxiosResponse['data'] {
    return response.data
  }

  /**
   * 处理响应错误，子类可重写此方法自定义错误处理
   * 按照标准 HTTP 错误结构处理错误
   * @param error - Axios 错误对象
   * @returns 处理后的错误对象
   */
  async processResponseError(error: AxiosError): Promise<AxiosError> {
    // 处理认证错误（401）
    this.handleAuthenticationError(error)

    // 处理超时错误
    this.handleTimeoutError(error)

    // 处理网络错误
    this.handleNetworkError(error)

    return error
  }

  /**
   * 处理认证错误（401 - 未授权/登录失效）
   * 子类可重写此方法来自定义认证错误处理逻辑
   * @param error - Axios 错误对象
   */
  protected handleAuthenticationError(error: AxiosError): void {
    if (error.response?.status === 401) {
      // 将 messageInstance 传递给回调函数，让调用者决定是否显示消息提示
      this.onLoginRequired?.(this.messageInstance)
    }
  }

  /**
   * 处理超时错误
   * 子类可重写此方法来自定义超时错误处理逻辑
   * @param error - Axios 错误对象
   */
  protected handleTimeoutError(error: AxiosError): void {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      // 将 messageInstance 传递给回调函数，让调用者决定是否显示消息提示
      this.onTimeout(this.messageInstance)
    }
  }

  /**
   * 处理网络错误（其他错误）
   * 子类可重写此方法来自定义网络错误处理逻辑
   * @param error - Axios 错误对象
   */
  protected handleNetworkError(error: AxiosError): void {
    // 如果不是认证错误和超时错误，则处理为网络错误
    if (error.response?.status !== 401 && error.code !== 'ECONNABORTED') {
      const fallbackError = error as AxiosError<any>
      let errorMessage = (fallbackError.response?.data as string) || fallbackError.message || '网络错误'
      const currentTime = Date.now()
      
      // 处理请求取消错误
      if (error.code === 'ERR_CANCELED') {
        errorMessage = '请求已取消'
      }
      
      // 检查是否与最近一次错误消息相同，且时间间隔小于防抖时间
      const shouldShowError = !this.recentErrorCache
        || this.recentErrorCache.message !== errorMessage
        || (currentTime - this.recentErrorCache.timestamp > this.errorDebounceTime)

      if (shouldShowError) {
        this.messageInstance?.({
          type: 'error',
          message: errorMessage,
          duration: 5 * 1000,
        })
        // 更新最近错误缓存
        this.recentErrorCache = { message: errorMessage, timestamp: currentTime }

        // 使用定时器引用管理
        if (this.errorCacheTimer) {
          clearTimeout(this.errorCacheTimer)
        }
        this.errorCacheTimer = setTimeout(() => {
          // 只有当前缓存的消息与本次显示的消息相同时才清除，避免清除其他请求设置的缓存
          if (this.recentErrorCache && this.recentErrorCache.message === errorMessage) {
            this.recentErrorCache = null
            this.errorCacheTimer = null
          }
        }, 5000) // 与错误提示显示时长一致
      }
    }
  }

  /**
   * 设置请求和响应拦截器
   * 请求拦截器：自动添加 Token
   * 响应拦截器：处理成功响应和错误响应（401、超时等）
   */
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 自动添加 Token
        const token = this.getToken?.()
        if (token) {
          config.headers = config.headers || {}
          ;(config.headers as any).Token = `${token}`
        }

        this.processRequestConfig(config)
        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (res: AxiosResponse) => {
        return this.processResponseConfig(res)
      },
      async (error: AxiosError<any>) => {
        await this.processResponseError(error)
        return Promise.reject(error)
      },
    )
  }

  /**
   * 发送 HTTP 请求，所有 HTTP 方法最终都调用此方法
   * @param config - Axios 请求配置对象
   * @returns 解析后的响应数据
   */
  protected async request<R>(config: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.instance.request<R>(config)
  }

  /**
   * 发送 GET 请求
   * @param url - 请求 URL 路径
   * @param params - 查询参数对象
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async get<R>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'get', params })
  }

  /**
   * 发送 POST 请求
   * @param url - 请求 URL 路径
   * @param data - 请求体数据
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async post<R>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'post', data })
  }

  /**
   * 发送 DELETE 请求
   * @param url - 请求 URL 路径
   * @param params - 查询参数对象
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async delete<R>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'delete', params })
  }

  /**
   * 发送 PUT 请求
   * @param url - 请求 URL 路径
   * @param data - 请求体数据
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async put<R>(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'put', data })
  }

  /**
   * 批量请求，并发发送多个请求
   * @param requests - 请求配置数组或已发起的请求 Promise 数组
   * @returns 所有请求的响应数据数组
   */
  public async all<R>(
    requests: Array<AxiosRequestConfig | Promise<AxiosResponse<R>>>,
  ): Promise<AxiosResponse['data'][]> {
    if (!requests.length)
      return []

    const firstRequest = requests[0] as any
    const isPromiseArray = typeof firstRequest?.then === 'function'

    if (isPromiseArray) {
      const responses = await Promise.all(requests as Promise<AxiosResponse<R>>[])
      return responses.map(response => response.data)
    }

    const promises = (requests as AxiosRequestConfig[]).map(config => this.request<R>(config))
    return await Promise.all(promises)
  }

  /**
   * 文件上传，将文件包装为 FormData 发送
   * @param url - 上传地址
   * @param file - 文件对象
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async uploadFile<R>(url: string, file: File | Blob, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    const formData = new FormData()
    formData.append('file', file)
    return this.post<R>(url, formData as any, {
      ...config,
      headers: {
        ...(config?.headers ?? {}),
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * 下载文件，将 Blob 对象下载到本地
   * @param blob - Blob 对象
   * @param filename - 文件名，如果不提供则使用时间戳
   */
  public downloadFile(blob: Blob, filename?: string): void {
    // 非浏览器环境，无法下载
    if (typeof window === 'undefined') {
      console.warn('downloadFile: 非浏览器环境，无法下载文件')
      return
    }

    // 创建 Blob URL
    const url = window.URL.createObjectURL(blob)

    // 创建临时链接元素
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `download-${Date.now()}`

    // 触发下载
    document.body.appendChild(link)
    link.click()

    // 清理：移除链接元素并释放 Blob URL
    link.remove()
    window.URL.revokeObjectURL(url)
  }
}
