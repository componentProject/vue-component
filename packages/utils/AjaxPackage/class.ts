// class.ts文件
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
 * @FilePath: \vue-template\src\api\utils\index.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import type { BaseApiConfig } from './_types'
import type { MessageInstance, NotificationInstance } from './_utils'
import axios from 'axios'
import createApiDialog from '../ApiDialog'
import {
  createMessageWrapper,
  createNotificationWrapper,
} from './_utils'
import SystemErrorDialog, { extractSystemErrorInfo } from './SystemErrorDialog'

/**
 * 检查是否在浏览器环境
 */
const hasDocument = typeof document !== 'undefined'

/**
 * 系统异常对话框实例，仅在浏览器环境创建
 */
const systemErrorDialogInstance = hasDocument ? createApiDialog(SystemErrorDialog) : null

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
 * BaseApi 类
 * 基于 axios 封装的 HTTP 请求类，提供统一的请求处理、错误处理和响应解析
 */
export default class BaseApi {
  protected baseURL: string
  protected timeout: number
  protected responseFields: Required<BaseApiConfig['responseFields']>
  protected onTimeout: () => void
  protected getToken?: () => string | null
  protected onLoginRequired?: () => void
  instance: ReturnType<typeof axios.create>
  protected messageInstance: MessageInstance
  protected notificationInstance: NotificationInstance

  /**
   * 创建 BaseApi 实例
   * @param config - API 配置对象
   */
  constructor(config: BaseApiConfig) {
    this.baseURL = config.baseURL || ''
    this.timeout = config.timeout || 5000
    this.messageInstance = createMessageWrapper()
    this.notificationInstance = createNotificationWrapper()
    this.responseFields = {
      code: 'Code',
      message: 'Message',
      data: 'data',
      errors: 'errors',
      tips: 'tips',
      ...config.responseFields,
    }
    this.onTimeout = config.onTimeout || (() => {})

    this.getToken = config.getToken || defaultGetToken
    this.onLoginRequired = config.onLoginRequired || defaultOnLoginRequired

    // 提取BaseApi特有的配置
    const {
      baseURL,
      timeout,
      responseFields,
      onTimeout,
      getToken,
      onLoginRequired,
      ...axiosConfig
    } = config

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
   * 处理响应配置，解析响应数据并处理错误
   * 支持嵌套路径解析，自动处理登录失效、系统异常等错误
   * @param response - Axios 响应对象
   * @returns 解析后的响应数据
   */
  processResponseConfig(response: AxiosResponse): AxiosResponse['data'] {
    const data = response.data
    // 支持路径解析的辅助函数
    const getValueByPath = (obj: any, path: string | undefined) => {
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
    const code = getValueByPath(data, this.responseFields?.code)
    const message = getValueByPath(data, this.responseFields?.message) || ''
    const responseData = getValueByPath(data, this.responseFields?.data) || data

    // 处理错误码
    if (code === 401) {
      throw new Error('登录失效，请重新登录')
    }

    if (code === -1) {
      this.showSystemExceptionDialog(response, responseData, code, message)
      throw new Error(message || '系统异常')
    }

    if (code && code !== 200) {
      this.messageInstance?.error({
        message: message || '请求失败',
        duration: 5 * 1000,
      })
      throw new Error(message || '请求失败')
    }

    // 处理错误数组 errors（如果有配置）
    const errorsField = this.responseFields?.errors
    if (errorsField) {
      const errors = (responseData as any)?.[errorsField]
      if (Array.isArray(errors) && errors.length) {
        const html = errors
          .map((item: any) => `<div style="font-size: 14px;color:red">${item.code}：${item.message}</div>`)
          .join('')

        if (hasDocument) {
          this.notificationInstance?.({
            title: '提示',
            message: html,
            type: 'error',
          } as any)
        }
        else {
          const errorMessages = errors.map((item: any) => `${item.code}：${item.message}`).join('\n')
          this.notificationInstance?.({
            title: '提示',
            message: errorMessages,
            type: 'error',
          } as any)
        }

        throw new Error('请求错误')
      }
    }

    // 处理提示信息 tips（如果有配置）
    const tipsField = this.responseFields?.tips
    if (tipsField) {
      const tips = (responseData as any)?.[tipsField]
      if (Array.isArray(tips) && tips.length) {
        const html = tips
          .map((item: any) => `<div style="font-size: 14px;color:#E6A23C">${item.code}：${item.message}</div>`)
          .join('')

        if (hasDocument) {
          this.notificationInstance?.({
            title: '提示',
            message: html,
            type: 'warning',
          } as any)
        }
        else {
          const tipMessages = tips.map((item: any) => `${item.code}：${item.message}`).join('\n')
          this.notificationInstance?.({
            title: '提示',
            message: tipMessages,
            type: 'warning',
          } as any)
        }
      }
    }

    return responseData
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

  /**
   * 显示系统异常对话框，当响应状态码为 -1 时调用
   * @param response - Axios 响应对象
   * @param responseData - 响应数据
   * @param code - 错误状态码
   * @param message - 错误消息
   */
  private showSystemExceptionDialog(response: AxiosResponse, responseData: AxiosResponse['data'], code: number, message: string): void {
    if (!hasDocument || !systemErrorDialogInstance) {
      console.error('系统异常信息：', responseData)
      return
    }

    try {
      // 从 response 中提取必要的信息，避免传递大对象
      const errorInfo = extractSystemErrorInfo(response, code, message, responseData)

      systemErrorDialogInstance.show({
        props: {
          title: '系统异常信息',
          width: 600,
          ...errorInfo,
        },
      }).then((result) => {
        if (result?.reported) {
          console.log('系统异常已上报:', result)
          // 这里可以添加实际的错误上报逻辑
          // 例如：发送错误信息到服务器
          this.reportError(result.errorInfo)
        }
        else {
          console.log('系统异常对话框已确认')
        }
      }).catch(() => {
        console.log('系统异常对话框已关闭')
      })
    }
    catch (error) {
      console.error('显示系统异常对话框失败：', error)
      console.error('系统异常信息：', responseData)
    }
  }

  /**
   * 上报错误信息到服务器，默认实现仅显示提示，子类可重写实现真实上报
   * @param errorInfo - 错误信息对象
   */
  private async reportError(errorInfo: any): Promise<void> {
    try {
      console.log('🚀 开始上报错误信息:', errorInfo)

      // 这里可以实现实际的错误上报逻辑
      // 例如：调用错误上报接口
      // await this.post('/api/error/report', errorInfo)

      // 临时使用 console 输出，实际项目中应该调用真实的上报接口
      console.log('✅ 错误信息上报成功')

      this.messageInstance?.success({
        message: '错误信息已成功上报',
        duration: 3 * 1000,
      })
    }
    catch (error) {
      console.error('❌ 错误信息上报失败:', error)

      this.messageInstance?.error({
        message: '错误信息上报失败，请稍后重试',
        duration: 5 * 1000,
      })
    }
  }
}
