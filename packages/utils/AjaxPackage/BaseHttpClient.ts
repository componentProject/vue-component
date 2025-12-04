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
 */
function defaultOnLoginRequired() {
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
  protected onTimeout: () => void
  protected getToken?: () => string | null
  protected onLoginRequired?: () => void
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
   * @param response - Axios 响应对象
   * @returns 解析后的响应数据
   */
  processResponseConfig(response: AxiosResponse): AxiosResponse['data'] {
    // 基础类直接返回原始数据，子类可重写此方法进行自定义解析
    return response.data
  }

  /**
   * 处理响应错误，子类可重写此方法自定义错误处理
   * @param error - Axios 错误对象
   * @returns 处理后的错误对象
   */
  async processResponseError(error: AxiosError): Promise<AxiosError> {
    return error
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
        if (res.status !== 200) {
          return Promise.reject(new Error(res.data?.message || 'Error'))
        }

        return this.processResponseConfig(res)
      },
      async (error: AxiosError<any>) => {
        await this.processResponseError(error)
        // 处理 401 未授权 / 登录失效
        if (error.response?.status === 401) {
          this.onLoginRequired?.()
          this.messageInstance?.error({
            message: '登录已过期，请重新登录',
            duration: 5 * 1000,
          })
        }
        // 处理超时错误
        else if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          this.onTimeout()
          this.messageInstance?.error({
            message: '请求超时，请检查网络连接或稍后重试',
            duration: 5 * 1000,
          })
        }
        // 处理取消请求
        else {
          const fallbackError = error as AxiosError<any>
          this.messageInstance?.error({
            message: (fallbackError.response?.data as string) || fallbackError.message || '网络错误',
            duration: 5 * 1000,
          })
        }
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
}
