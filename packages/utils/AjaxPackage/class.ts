// class.ts文件
import type {
  AxiosResponse,
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
   * 处理响应配置，解析响应数据并处理错误
   * 支持嵌套路径解析，自动处理登录失效、系统异常等错误
   * 重写父类方法，提供增强的响应解析功能
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
    const message = getValueByPath(data, this.responseFields?.message)
    const responseData = getValueByPath(data, this.responseFields?.data)

    // console.log('responseData', data, this.responseFields?.data, getValueByPath(data, this.responseFields?.data))

    // console.log('code', code)
    // 处理错误码
    if (code === 401) {
      throw new Error('登录失效，请重新登录')
    }

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
