// class.ts文件
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
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

import type { BaseApiConfig } from './_types/index.ts'
import { dynamicImports } from '../_utils/index.ts'
import createApiDialog from '../ApiDialog/index.ts'
import { extractSystemErrorInfo } from './_utils/systemErrorInfo.ts'
import BaseHttpClient from './BaseHttpClient.ts'

/**
 * 检查是否在浏览器环境
 */
const hasDocument = typeof document !== 'undefined'

/**
 * SystemErrorDialog 实例缓存
 */
let systemErrorDialogInstance: ReturnType<typeof createApiDialog> | null = null

/**
 * BaseApi 类
 * 继承 BaseHttpClient，提供增强的响应解析和错误处理功能
 * 包括：响应字段映射、错误码处理、系统异常弹窗等
 */
export default class BaseApi extends BaseHttpClient {
  protected responseFields: Required<BaseApiConfig['responseFields']>
  protected enableSystemErrorDialog: boolean

  /**
   * 创建 BaseApi 实例
   * @param config - API 配置对象
   */
  constructor(config: BaseApiConfig) {
    // 提取BaseApi特有的配置
    const {
      responseFields,
      enableSystemErrorDialog = true,
      ...baseConfig
    } = config

    // 调用父类构造函数
    super(baseConfig)

    // 设置 responseFields（BaseApi 特有的功能）
    this.responseFields = {
      code: 'Code',
      message: 'Message',
      data: 'data',
      errors: 'errors',
      tips: 'tips',
      ...responseFields,
    }
    this.enableSystemErrorDialog = enableSystemErrorDialog
  }

  /**
   * 处理请求配置，子类可重写此方法自定义请求配置
   * 显式声明以确保类型一致性，避免打包后的类型不兼容问题
   * @param config - 请求配置对象
   * @returns 处理后的请求配置
   */
  processRequestConfig(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    return super.processRequestConfig(config)
  }

  /**
   * 处理响应错误，子类可重写此方法自定义错误处理
   * 显式声明以确保类型一致性，避免打包后的类型不兼容问题
   * @param error - Axios 错误对象
   * @returns 处理后的错误对象
   */
  async processResponseError(error: AxiosError): Promise<AxiosError> {
    return super.processResponseError(error)
  }

  /**
   * 处理 HTTP 状态码
   * 重写父类方法，确保子类可以重写此方法
   * @param response - Axios 响应对象
   */
  protected handleHttpStatus(response: AxiosResponse): void {
    return super.handleHttpStatus(response)
  }

  /**
   * 处理认证错误（401 - 未授权/登录失效）
   * 重写父类方法，处理 HTTP 401 错误
   * 子类可重写此方法来自定义 HTTP 认证错误处理逻辑
   * @param error - Axios 错误对象
   */
  protected handleAuthenticationError(error: AxiosError): void {
    // 调用父类处理 HTTP 401
    super.handleAuthenticationError(error)
  }

  /**
   * 处理超时错误
   * 重写父类方法，确保子类可以重写此方法
   * @param error - Axios 错误对象
   */
  protected handleTimeoutError(error: AxiosError): void {
    return super.handleTimeoutError(error)
  }

  /**
   * 处理网络错误（其他错误）
   * 重写父类方法，确保子类可以重写此方法
   * @param error - Axios 错误对象
   */
  protected handleNetworkError(error: AxiosError): void {
    return super.handleNetworkError(error)
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

    // 处理业务层的错误情况
    this.handleSystemError(response, code, message, responseData)
    this.handleBusinessError(code, message)
    this.handleErrorArray(responseData)
    this.handleTips(responseData)

    // 返回业务数据
    return responseData
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
    const message = getValueByPath(data, this.responseFields?.message)
    const responseData = getValueByPath(data, this.responseFields?.data)

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
      // 如果启用了系统异常弹窗，则显示弹窗
      if (this.enableSystemErrorDialog) {
        // 异步调用，不阻塞错误抛出
        this.showSystemExceptionDialog(response, responseData, code, message).catch((error) => {
          console.error('显示系统异常对话框失败：', error)
        })
      }
      throw new Error(message || '系统异常')
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
   * @param responseData - 响应数据
   */
  protected handleErrorArray(responseData: any): void {
    const errorsField = this.responseFields?.errors
    if (errorsField) {
      const errors = (responseData as any)?.[errorsField]
      if (Array.isArray(errors) && errors.length) {
        this.showErrorArrayNotification(errors)
        throw new Error('请求错误')
      }
    }
  }

  /**
   * 显示错误数组通知
   * 子类可重写此方法来自定义错误数组通知显示方式
   * @param errors - 错误数组
   */
  protected showErrorArrayNotification(errors: Array<{ code: string, message: string }>): void {
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
  }

  /**
   * 处理提示信息 tips（如果有配置）
   * 子类可重写此方法来自定义提示信息处理逻辑
   * @param responseData - 响应数据
   */
  protected handleTips(responseData: any): void {
    const tipsField = this.responseFields?.tips
    if (tipsField) {
      const tips = (responseData as any)?.[tipsField]
      if (Array.isArray(tips) && tips.length) {
        this.showTipsNotification(tips)
      }
    }
  }

  /**
   * 显示提示信息通知
   * 子类可重写此方法来自定义提示信息通知显示方式
   * @param tips - 提示信息数组
   */
  protected showTipsNotification(tips: Array<{ code: string, message: string }>): void {
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

  /**
   * 显示系统异常对话框，当响应状态码为 -1 时调用
   * @param response - Axios 响应对象
   * @param responseData - 响应数据
   * @param code - 错误状态码
   * @param message - 错误消息
   */
  private async showSystemExceptionDialog(response: AxiosResponse, responseData: AxiosResponse['data'], code: number, message: string): Promise<void> {
    // 非浏览器环境，直接输出错误信息
    if (!hasDocument) {
      console.error('系统异常信息：', responseData)
      return
    }

    try {
      // 动态加载 SystemErrorDialog 模块（仅在浏览器环境中）
      if (!systemErrorDialogInstance) {
        try {
          const { default: SystemErrorDialog } = await dynamicImports(import('./SystemErrorDialog.ts'), ['default'] as const)
          systemErrorDialogInstance = createApiDialog(SystemErrorDialog)
        }
        catch (error) {
          console.warn('Failed to load SystemErrorDialog:', error)
          console.error('系统异常信息：', responseData)
          return
        }
      }

      // 从 response 中提取必要的信息，避免传递大对象
      const errorInfo = extractSystemErrorInfo(response, code, message)

      systemErrorDialogInstance.show({
        props: {
          title: '系统异常信息',
          width: 600,
          ...errorInfo,
        },
      }).then((result: any) => {
        if (result?.reported) {
          console.log('系统异常已上报:', result)
          // 这里可以添加实际的错误上报逻辑
          // 例如：发送错误信息到服务器
          this.reportError(result.errorInfo)
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
      console.error('系统异常信息：', responseData)
    }
  }

  /**
   * 上报错误信息到服务器，默认实现仅显示提示，子类可重写实现真实上报
   * @param errorInfo - 错误信息对象
   */
  protected async reportError(errorInfo: any): Promise<void> {
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
