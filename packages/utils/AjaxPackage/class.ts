import type { AxiosResponse } from 'axios'
/*
 * @Author: moluoxixi 1983531544@qq.com
 * @Date: 2025-05-09 08:53:16
 * @LastEditors: moluoxixi 1983531544@qq.com
 * @LastEditTime: 2025-05-09 09:06:54
 * @FilePath: \vue-template\src\api\utils\index.ts
 * @Description: BaseApi 类，继承 BaseHttpClient，提供增强的响应解析和错误处理功能
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */

import type { BaseApiConfig, ExtendedAxiosRequestConfig, NotificationOptions } from './_types/index.ts'
import { h } from 'vue'
import { dynamicImports } from '../_utils/index.ts'
import createApiDialog from '../ApiDialog/index.ts'
import { extractSystemErrorInfo } from './_utils/systemErrorInfo.ts'
import BaseHttpClient from './BaseHttpClient.ts'

/**
 * BaseApi 类
 * 继承 BaseHttpClient，提供增强的响应解析和错误处理功能
 * 包括：响应字段映射、错误码处理、系统异常弹窗等
 */
export default class BaseApi extends BaseHttpClient {
  protected responseFields: Required<BaseApiConfig['responseFields']>
  protected enableSystemErrorDialog: boolean
  protected systemErrorMessage: string

  /**
   * 检查是否在浏览器环境（在类初始化时判断）
   * 注意：这是静态属性，所有实例共享
   */
  private static readonly hasDocument = typeof document !== 'undefined'

  /**
   * SystemErrorDialog 实例
   * 注意：这是实例属性，每个实例有自己的对话框实例
   * 在构造函数中初始化（如果启用系统错误弹窗）
   */
  private systemErrorDialogInstance: ReturnType<typeof createApiDialog> | null = null

  /**
   * SystemErrorDialog 初始化 Promise
   * 用于跟踪初始化状态，避免重复初始化
   */
  private readonly systemErrorDialogInitPromise: Promise<void> | null = null

  /**
   * 系统错误信息存储，用于在点击 icon 时打开详细错误弹窗
   * key: 错误ID，value: 错误信息对象
   * 注意：这是静态属性，所有实例共享同一个错误信息存储
   */
  private static systemErrorInfoMap = new Map<string, {
    response: AxiosResponse
    responseData: AxiosResponse['data']
    code: number
    message: string
  }>()

  /**
   * 获取是否在浏览器环境（实例 getter）
   * @returns 是否在浏览器环境
   */
  protected get hasDocument(): boolean {
    return BaseApi.hasDocument
  }

  /**
   * 获取系统错误信息存储（实例 getter）
   * @returns 系统错误信息存储 Map
   */
  protected get systemErrorInfoMap(): Map<string, {
    response: AxiosResponse
    responseData: AxiosResponse['data']
    code: number
    message: string
  }> {
    return BaseApi.systemErrorInfoMap
  }

  /**
   * 生成唯一错误ID（实例方法）
   * @returns 唯一错误ID
   */
  protected generateErrorId(): string {
    return `system_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 打开系统错误详细弹窗（实例方法）
   * @param errorId - 错误ID
   */
  private async openSystemErrorDialog(errorId: string): Promise<void> {
    const errorInfo = this.systemErrorInfoMap.get(errorId)
    if (!errorInfo) {
      console.warn('未找到错误信息，ID:', errorId)
      return
    }

    // 清理已使用的错误信息
    this.systemErrorInfoMap.delete(errorId)

    // 显示系统错误弹窗
    try {
      // 如果对话框实例还未初始化，等待初始化完成
      if (!this.systemErrorDialogInstance) {
        // 如果正在初始化，等待初始化完成
        if (this.systemErrorDialogInitPromise) {
          try {
            await this.systemErrorDialogInitPromise
          }
          catch {
            // 初始化失败，直接返回
            console.error('系统异常信息：', errorInfo.responseData)
            return
          }
        }
        else {
          // 如果还没有开始初始化，立即初始化
          try {
            await this.initSystemErrorDialog()
          }
          catch {
            // 初始化失败，直接返回
            console.error('系统异常信息：', errorInfo.responseData)
            return
          }
        }
        // 如果初始化后仍然没有实例，直接返回
        if (!this.systemErrorDialogInstance) {
          console.error('系统异常信息：', errorInfo.responseData)
          return
        }
      }

      // 从 response 中提取必要的信息
      const errorInfoData = extractSystemErrorInfo(
        errorInfo.response,
        errorInfo.code,
        errorInfo.message,
      )

      this.systemErrorDialogInstance.show({
        props: {
          title: '系统异常信息',
          width: 600,
          ...errorInfoData,
        },
      }).then((result: any) => {
        if (result?.reported) {
          console.log('系统异常已上报:', result)
        }
        else {
          console.log('系统异常对话框已确认')
        }
      }).catch((e: any) => {
        console.log('系统异常对话框已关闭', e)
      })
    }
    catch (error) {
      console.error('显示系统异常对话框失败：', error)
      console.error('系统异常信息：', errorInfo.responseData)
    }
  }

  /**
   * 创建 BaseApi 实例
   * @param config - API 配置对象
   */
  constructor(config: BaseApiConfig) {
    // 提取BaseApi特有的配置
    const {
      responseFields,
      enableSystemErrorDialog = true,
      systemErrorMessage = '系统错误',
      ...baseConfig
    } = config

    // 调用父类构造函数
    super(baseConfig)

    // 设置 responseFields（BaseApi 特有的功能）
    this.responseFields = {
      code: 'Code',
      message: 'Message',
      data: 'data',
      errors: 'data.errors',
      tips: 'data.tips',
      ...responseFields,
    }
    this.enableSystemErrorDialog = enableSystemErrorDialog
    this.systemErrorMessage = systemErrorMessage

    // 初始化 SystemErrorDialog 实例（如果启用系统错误弹窗且在浏览器环境）
    if (this.enableSystemErrorDialog && this.hasDocument) {
      // 启动异步初始化，不阻塞构造函数
      this.systemErrorDialogInitPromise = this.initSystemErrorDialog()
    }
  }

  /**
   * 初始化 SystemErrorDialog 实例
   * 在构造函数中调用，提前加载对话框组件
   * @returns Promise，初始化完成后 resolve
   */
  private async initSystemErrorDialog(): Promise<void> {
    try {
      const { default: SystemErrorDialog } = await dynamicImports(import('./SystemErrorDialog.ts'), ['default'] as const)
      this.systemErrorDialogInstance = createApiDialog(SystemErrorDialog)
    }
    catch (error) {
      console.warn('Failed to load SystemErrorDialog:', error)
      // 初始化失败不影响其他功能，只是无法显示系统错误弹窗
      throw error
    }
  }

  /**
   * 处理成功响应
   * 重写父类方法，在标准 HTTP 成功响应基础上，处理业务特定的响应结构
   * 支持嵌套路径解析，自动处理业务层的登录失效、系统异常等错误
   * 注意：HTTP 层的错误（如 HTTP 401、超时等）由父类 BaseHttpClient 处理
   * @param response - Axios 响应对象
   * @returns 解析后的响应数据
   */
  protected handleSuccessResponse(response: AxiosResponse): AxiosResponse['data'] {
    // 先调用父类处理标准 HTTP 成功响应（获取 response.data）
    const httpData = super.handleSuccessResponse(response)

    // 解析业务响应字段
    const parsedFields = this.parseResponseFields(httpData)
    const { code, message, responseData } = parsedFields

    const config = response.config as ExtendedAxiosRequestConfig
    const isCustomMessage = config?.isCustomMessage ?? false

    this.handleSystemError(response, code, message, responseData)

    // 如果配置了 isCustomMessage 为 true，则跳过业务错误、错误数组和提示的处理
    // 默认值为 false，即默认会执行这些处理
    if (!isCustomMessage) {
      this.handleBusinessError(code, message)
      this.handleErrorArray(httpData, response)
      this.handleTips(httpData, response)
    }

    // 返回业务数据
    return responseData
  }

  /**
   * 支持路径解析的辅助函数
   * @param obj - 要解析的对象
   * @param path - 路径字符串，支持点号分隔的嵌套路径，如 'data.errors'
   * @returns 解析后的值，如果路径不存在则返回 undefined
   */
  protected getValueByPath(obj: any, path: string | undefined): any {
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

  /**
   * 解析响应字段，支持嵌套路径解析
   * 子类可重写此方法来自定义字段解析逻辑
   * @param data - 响应数据对象
   * @returns 解析后的字段值对象
   */
  protected parseResponseFields(data: any): {
    code: any
    message: any
    responseData: any
  } {
    const code = this.getValueByPath(data, this.responseFields?.code)
    const message = this.getValueByPath(data, this.responseFields?.message)
    const responseData = this.getValueByPath(data, this.responseFields?.data)

    return { code, message, responseData }
  }

  /**
   * 处理系统异常错误（-1 - 系统异常）
   * 子类可重写此方法来自定义系统异常处理逻辑
   * @param response - Axios 响应对象
   * @param code - 响应状态码
   * @param message - 错误消息
   * @param responseData - 响应数据
   */
  protected handleSystemError(response: AxiosResponse, code: any, message: any, responseData: any): void {
    if (code === -1) {
      // 如果启用了系统异常弹窗，先显示错误消息，点击 icon 后再打开详细弹窗
      if (this.enableSystemErrorDialog) {
        this.showSystemErrorMessage(response, responseData, code, message)
      }
      throw new Error(message || '系统异常')
    }
  }

  /**
   * 显示系统错误消息（带可点击 icon）
   * 使用 vNode 渲染，点击 icon 后打开详细错误弹窗
   * @param response - Axios 响应对象
   * @param responseData - 响应数据
   * @param code - 错误状态码
   * @param message - 错误消息
   */
  private showSystemErrorMessage(response: AxiosResponse, responseData: AxiosResponse['data'], code: number, message: string): void {
    // 非浏览器环境，直接输出错误信息
    if (!this.hasDocument) {
      console.error('系统异常信息：', responseData)
      return
    }

    // 生成唯一错误ID
    const errorId = this.generateErrorId()

    // 存储错误信息，供点击 icon 时使用
    this.systemErrorInfoMap.set(errorId, {
      response,
      responseData,
      code,
      message,
    })

    // 设置清理定时器，5分钟后自动清理（避免内存泄漏）
    setTimeout(() => {
      this.systemErrorInfoMap.delete(errorId)
    }, 5 * 60 * 1000)

    // 创建点击 icon 的处理函数
    const handleIconClick = () => {
      this.openSystemErrorDialog(errorId).catch((error) => {
        console.error('打开系统错误对话框失败：', error)
      })
    }

    // 使用 vNode 创建消息内容
    const messageVNode = h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        maxWidth: '100%',
        whiteSpace: 'normal',
      },
    }, [
      h('div', {
        style: {
          color: 'var(--el-message-text-color)',
          lineHeight: '24px',
        },
      }, message || this.systemErrorMessage),
      h('svg', {
        onClick: handleIconClick,
        style: {
          cursor: 'pointer',
          color: '#F56C6C',
          width: '16px',
          height: '16px',
          flexShrink: 0,
        },
        viewBox: '0 0 1024 1024',
        fill: 'currentColor',
        xmlns: 'http://www.w3.org/2000/svg',
      }, [
        h('path', {
          d: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z',
        }),
      ]),
    ])

    // 显示错误消息（使用 vNode）
    this.messageInstance?.error({
      message: messageVNode as any,
      duration: 5 * 1000,
      customClass: 'system-error-message', // 添加自定义类名
    })

    // 确保自定义类名的样式被正确应用
    if (typeof document !== 'undefined') {
      // 获取或创建样式元素
      let styleElement = document.getElementById('system-error-message-style')
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = 'system-error-message-style'
        document.head.appendChild(styleElement)
      }
      // 设置高优先级样式
      styleElement.textContent = `
        .system-error-message {
          z-index: 99999998 !important;
        }
      `
    }
  }

  /**
   * 处理业务错误（其他非200错误码）
   * 子类可重写此方法来自定义业务错误处理逻辑
   * @param code - 响应状态码
   * @param message - 错误消息
   */
  protected handleBusinessError(code: any, message: any): void {
    if (code && code !== 200) {
      this.messageInstance?.error({
        message: message || '请求失败',
        duration: 5 * 1000,
      })
      throw new Error(message || '请求失败')
    }
  }

  /**
   * 处理错误数组 errors（如果有配置）
   * 子类可重写此方法来自定义错误数组处理逻辑
   * @param httpData - HTTP 响应数据
   * @param response - Axios 响应对象
   */
  protected handleErrorArray(httpData: any, response: AxiosResponse): void {
    const errorsField = this.responseFields?.errors
    if (errorsField) {
      const errors = this.getValueByPath(httpData, errorsField)
      if (Array.isArray(errors) && errors.length) {
        const config = response.config as ExtendedAxiosRequestConfig
        const notificationOptions = config?.errorNotificationOptions
        this.showErrorArrayNotification(errors, notificationOptions)
        throw new Error('请求错误')
      }
    }
  }

  /**
   * 显示通知的通用方法
   * @param items - 通知项数组
   * @param type - 通知类型
   * @param color - HTML 颜色
   * @param notificationOptions - 通知配置选项
   */
  private showNotification(
    items: Array<{ code: string, message: string }>,
    type: 'error' | 'warning',
    color: string,
    notificationOptions?: NotificationOptions,
  ): void {
    const defaultOptions: NotificationOptions = {
      title: '提示',
      type,
    }

    if (this.hasDocument) {
      const html = items
        .map((item: any) => `<div style="font-size: 14px;color:${color}">${item.code}：${item.message}</div>`)
        .join('')
      const finalOptions: NotificationOptions = {
        ...defaultOptions,
        ...notificationOptions,
        dangerouslyUseHTMLString: true,
        message: html,
      }
      this.notificationInstance?.(finalOptions as any)
    }
    else {
      const messages = items.map((item: any) => `${item.code}：${item.message}`).join('\n')
      const finalOptions: NotificationOptions = {
        ...defaultOptions,
        ...notificationOptions,
        message: messages,
      }
      this.notificationInstance?.(finalOptions as any)
    }
  }

  /**
   * 显示错误数组通知
   * 子类可重写此方法来自定义错误数组通知显示方式
   * @param errors - 错误数组
   * @param notificationOptions - 通知配置选项
   */
  protected showErrorArrayNotification(errors: Array<{ code: string, message: string }>, notificationOptions?: NotificationOptions): void {
    this.showNotification(errors, 'error', 'red', notificationOptions)
  }

  /**
   * 处理提示信息 tips（如果有配置）
   * 子类可重写此方法来自定义提示信息处理逻辑
   * @param httpData - HTTP 响应数据
   * @param response - Axios 响应对象
   */
  protected handleTips(httpData: any, response: AxiosResponse): void {
    const tipsField = this.responseFields?.tips
    if (tipsField) {
      const tips = this.getValueByPath(httpData, tipsField)
      if (Array.isArray(tips) && tips.length) {
        const config = response.config as ExtendedAxiosRequestConfig
        const notificationOptions = config?.tipsNotificationOptions
        this.showTipsNotification(tips, notificationOptions)
      }
    }
  }

  /**
   * 显示提示信息通知
   * 子类可重写此方法来自定义提示信息通知显示方式
   * @param tips - 提示信息数组
   * @param notificationOptions - 通知配置选项
   */
  protected showTipsNotification(tips: Array<{ code: string, message: string }>, notificationOptions?: NotificationOptions): void {
    this.showNotification(tips, 'warning', '#E6A23C', notificationOptions)
  }

  /**
   * 发送 HTTP 请求，所有 HTTP 方法最终都调用此方法
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param config - Axios 请求配置对象
   * @returns 解析后的响应数据
   */
  protected async request<R>(config: ExtendedAxiosRequestConfig): Promise<AxiosResponse['data']> {
    return super.request<R>(config)
  }

  /**
   * 发送 GET 请求
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param url - 请求 URL 路径
   * @param params - 查询参数对象
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async get<R>(url: string, params?: Record<string, any>, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse['data']> {
    return super.get<R>(url, params, config)
  }

  /**
   * 发送 POST 请求
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param url - 请求 URL 路径
   * @param data - 请求体数据
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async post<R>(url: string, data?: Record<string, any>, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse['data']> {
    return super.post<R>(url, data, config)
  }

  /**
   * 发送 DELETE 请求
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param url - 请求 URL 路径
   * @param params - 查询参数对象
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async delete<R>(url: string, params?: Record<string, any>, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse['data']> {
    return super.delete<R>(url, params, config)
  }

  /**
   * 发送 PUT 请求
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param url - 请求 URL 路径
   * @param data - 请求体数据
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async put<R>(url: string, data?: Record<string, any>, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse['data']> {
    return super.put<R>(url, data, config)
  }

  /**
   * 批量请求，并发发送多个请求
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param requests - 请求配置数组或已发起的请求 Promise 数组
   * @returns 所有请求的响应数据数组
   */
  public async all<R>(
    requests: Array<ExtendedAxiosRequestConfig | Promise<AxiosResponse<R>>>,
  ): Promise<AxiosResponse['data'][]> {
    return super.all<R>(requests)
  }

  /**
   * 文件上传，将文件包装为 FormData 发送
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param url - 上传地址
   * @param file - 文件对象
   * @param config - 额外的请求配置
   * @returns 解析后的响应数据
   */
  public async uploadFile<R>(url: string, file: File | Blob, config?: ExtendedAxiosRequestConfig): Promise<AxiosResponse['data']> {
    return super.uploadFile<R>(url, file, config)
  }

  /**
   * 下载文件，将 Blob 对象下载到本地
   * 显式声明以确保类型一致性，子类可重写此方法
   * @param blob - Blob 对象
   * @param filename - 文件名，如果不提供则使用时间戳
   */
  public downloadFile(blob: Blob, filename?: string): void {
    return super.downloadFile(blob, filename)
  }
}
