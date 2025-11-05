import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig,
} from 'axios'
/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-05-09 08:53:16
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-05-09 09:06:54
 * @FilePath: \vue-template\src\api\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 检查 document 是否存在
const hasDocument = typeof document !== 'undefined'

// 创建消息实例的包装函数
function createMessageWrapper() {
  if (hasDocument) {
    return ElMessage
  }
  return {
    success: (options: string | { message?: string; [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.log(`[Message Success] ${message}`)
    },
    error: (options: string | { message?: string; [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.error(`[Message Error] ${message}`)
    },
    warning: (options: string | { message?: string; [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.warn(`[Message Warning] ${message}`)
    },
    info: (options: string | { message?: string; [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.info(`[Message Info] ${message}`)
    },
  }
}

// 定义消息实例类型
type MessageInstance = ReturnType<typeof createMessageWrapper>

// 定义配置接口
interface BaseApiConfig {
  baseURL: string
  timeout?: number
  responseFields?: {
    code?: string
    message?: string
    data?: string
    errors?: string
    tips?: string
  }
  onTimeout?: () => void
  [key: string]: any // 允许其他任意配置项
}

export default class BaseApi {
  protected baseURL: string
  protected timeout: number
  protected responseFields: Required<BaseApiConfig['responseFields']>
  protected onTimeout: () => void
  instance: ReturnType<typeof axios.create>
  private cancelTokenSources: Map<string, CancelTokenSource> = new Map()
  protected messageInstance: MessageInstance

  constructor(config: BaseApiConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 5000
    this.messageInstance = createMessageWrapper()
    this.responseFields = {
      code: 'code',
      message: 'message',
      data: 'data',
      errors: 'errors',
      tips: 'tips',
      ...config.responseFields,
    }
    this.onTimeout = config.onTimeout || (() => {})

    // 提取BaseApi特有的配置
    const { baseURL, timeout, responseFields, onTimeout, ...axiosConfig } = config

    // 创建axios实例，传入所有剩余配置
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      ...axiosConfig, // 将所有剩余参数传给axios.create
    })
    this.setupInterceptors()
  }

  processRequestConfig(config: InternalAxiosRequestConfig) {
    return config
  }

  processResponseConfig(data: AxiosResponse['data']): AxiosResponse['data'] {
    // 支持路径解析的辅助函数
    const getValueByPath = (obj: any, path: string) => {
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
    const code = getValueByPath(data, this.responseFields.code)
    const message = getValueByPath(data, this.responseFields.message) || ''
    const responseData = getValueByPath(data, this.responseFields.data) || data

    // 处理错误码
    if (code === 401) {
      throw new Error('登录失效，请重新登录')
    }

    if (code && code !== 200) {
      this.messageInstance?.error({
        message: message || '请求失败',
        duration: 5 * 1000,
      })
      throw new Error(message || '请求失败')
    }

    return responseData
  }

  async processResponseError(error: AxiosError): Promise<AxiosError> {
    return error
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
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
        else {
          return this.processResponseConfig(res.data)
        }
      },
      async (error: AxiosError) => {
        await this.processResponseError(error)
        // 处理超时错误
        if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
          this.onTimeout()
          this.messageInstance?.error({
            message: '请求超时，请检查网络连接或稍后重试',
            duration: 5 * 1000,
          })
        }
        // 处理取消请求
        else if (axios.isCancel(error)) {
          console.log('请求已取消:', error.message)
        }
        // 处理其他错误
        else {
          this.messageInstance?.error({
            message: error.response?.data as string || error.message || '网络错误',
            duration: 5 * 1000,
          })
        }
        return Promise.reject(error)
      },
    )
  }

  protected async request<R>(config: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.instance.request<R>(config)
  }

  public async get<R>(url: string, params?: any, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'get', data, params })
  }

  public async post<R>(url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'post', data, params })
  }

  public async delete<R>(url: string, params?: any, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'delete', data, params })
  }

  public async put<R>(url: string, data?: any, params?: any, config?: AxiosRequestConfig): Promise<AxiosResponse['data']> {
    return this.request<R>({ ...config, url, method: 'put', data, params })
  }

  /**
   * 创建可取消的请求
   * @param requestId 请求ID，用于标识和取消请求
   * @param config 请求配置
   * @returns Promise<AxiosResponse['data']>
   */
  public async requestWithCancel<R>(
    requestId: string,
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse['data']> {
    // 如果已存在相同ID的请求，先取消
    this.cancelRequest(requestId)

    // 创建新的取消token
    const cancelTokenSource = axios.CancelToken.source()
    this.cancelTokenSources.set(requestId, cancelTokenSource)

    try {
      const response = await this.instance.request<R>({
        ...config,
        cancelToken: cancelTokenSource.token,
      })
      return response.data
    }
    finally {
      // 请求完成后清理
      this.cancelTokenSources.delete(requestId)
    }
  }

  /**
   * 取消指定请求
   * @param requestId 请求ID
   * @param reason 取消原因
   */
  public cancelRequest(requestId: string, reason?: string): void {
    const cancelTokenSource = this.cancelTokenSources.get(requestId)
    if (cancelTokenSource) {
      cancelTokenSource.cancel(reason || '请求被取消')
      this.cancelTokenSources.delete(requestId)
    }
  }

  /**
   * 取消所有请求
   * @param reason 取消原因
   */
  public cancelAllRequests(reason?: string): void {
    this.cancelTokenSources.forEach((cancelTokenSource, requestId) => {
      cancelTokenSource.cancel(reason || '所有请求被取消')
    })
    this.cancelTokenSources.clear()
  }

  /**
   * 批量请求
   * @param requests 请求配置数组
   * @returns Promise<AxiosResponse['data'][]>
   */
  public async all<R>(requests: AxiosRequestConfig[]): Promise<AxiosResponse['data'][]> {
    try {
      const promises = requests.map(config => this.request<R>(config))
      return await Promise.all(promises)
    }
    catch (error) {
      throw error
    }
  }

  /**
   * 批量请求（可取消）
   * @param requestId 请求ID
   * @param requests 请求配置数组
   * @returns Promise<AxiosResponse['data'][]>
   */
  public async allWithCancel<R>(
    requestId: string,
    requests: AxiosRequestConfig[],
  ): Promise<AxiosResponse['data'][]> {
    // 如果已存在相同ID的请求，先取消
    this.cancelRequest(requestId)

    // 创建新的取消token
    const cancelTokenSource = axios.CancelToken.source()
    this.cancelTokenSources.set(requestId, cancelTokenSource)

    try {
      const promises = requests.map(config =>
        this.instance.request<R>({
          ...config,
          cancelToken: cancelTokenSource.token,
        }),
      )
      const responses = await Promise.all(promises)
      return responses.map(response => response.data)
    }
    finally {
      // 请求完成后清理
      this.cancelTokenSources.delete(requestId)
    }
  }

  /**
   * 获取当前活跃的请求数量
   * @returns number
   */
  public getActiveRequestsCount(): number {
    return this.cancelTokenSources.size
  }

  /**
   * 获取当前活跃的请求ID列表
   * @returns string[]
   */
  public getActiveRequestIds(): string[] {
    return Array.from(this.cancelTokenSources.keys())
  }
}
