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
  messageInstance?.error({
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
  instance: ReturnType<typeof axios.create>
  protected messageInstance: MessageInstance
  protected notificationInstance: NotificationInstance

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
      ...axiosConfig
    } = config

    this.baseURL = baseURL
    this.timeout = timeout
    this.messageInstance = createMessageWrapper()
    this.notificationInstance = createNotificationWrapper()
    this.onTimeout = onTimeout
    this.getToken = getToken
    this.onLoginRequired = onLoginRequired

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
      this.messageInstance?.error({
        message: (fallbackError.response?.data as string) || fallbackError.message || '网络错误',
        duration: 5 * 1000,
      })
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
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}
