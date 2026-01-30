/**
 * ConfigForm - useFormSubmit
 * 表单提交 Composable
 */

import type { FormSchema, ReactionAction, UIAdapter } from '../types'
import type { RequestAdapter } from '../types/props'
import type { UseFormStateReturn } from './useFormState'
import type { UseFormValidationReturn } from './useFormValidation'
import { ref } from 'vue'

/**
 * 表单提交选项
 */
export interface UseFormSubmitOptions {
  /** 表单 Schema */
  schema: FormSchema
  /** 表单状态管理 */
  formState: UseFormStateReturn
  /** 表单校验 */
  formValidation: UseFormValidationReturn
  /** UI 适配器 */
  adapter?: UIAdapter
  /** 请求适配器 */
  requestAdapter?: RequestAdapter
  /** 提交前回调 */
  onBeforeSubmit?: (values: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>
  /** 提交成功回调 */
  onSubmitSuccess?: (response: any, values: Record<string, any>) => void
  /** 提交失败回调 */
  onSubmitError?: (error: Error, values: Record<string, any>) => void
}

/**
 * 表单提交返回值
 */
export interface UseFormSubmitReturn {
  /** 是否正在提交 */
  submitting: ReturnType<typeof ref<boolean>>
  /** 提交表单 */
  submit: () => Promise<any>
  /** 重置表单 */
  reset: () => Promise<void>
}

/**
 * 默认请求适配器
 */
async function defaultRequestAdapter<T = any>(config: {
  url: string
  method?: string
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
}): Promise<T> {
  const { url, method = 'POST', params, data, headers } = config

  let finalUrl = url
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString()
    finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
  }

  const response = await fetch(finalUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`)
  }

  return response.json()
}

/**
 * 表单提交 Composable
 * 提供表单提交和重置功能，支持 API 请求、数据转换、确认对话框等
 *
 * @param options - 表单提交选项
 * @returns 提交状态和方法
 */
export function useFormSubmit(options: UseFormSubmitOptions): UseFormSubmitReturn {
  const {
    schema,
    formState,
    formValidation,
    adapter,
    requestAdapter = defaultRequestAdapter,
    onBeforeSubmit,
    onSubmitSuccess,
    onSubmitError,
  } = options

  const submitting = ref(false)

  // 从 adapter 获取反馈组件，或使用控制台作为备选
  const feedback = adapter?.feedback || {
    message: {
      success: (msg: string) => console.log('[Success]', msg),
      error: (msg: string) => console.error('[Error]', msg),
      warning: (msg: string) => console.error('[Warning]', msg),
      info: (msg: string) => console.info('[Info]', msg),
    },
    messageBox: {
      confirm: async () => true,
    },
  }

  /**
   * 执行联动动作
   */
  async function executeAction(action: ReactionAction, context: any): Promise<void> {
    // 通知动作
    if ('$notify' in action) {
      const { type, message } = action.$notify
      const msgContent = formState.executor.execute(message, context)

      switch (type) {
        case 'success':
          feedback.message?.success(msgContent)
          break
        case 'error':
          feedback.message?.error(msgContent)
          break
        case 'warning':
          feedback.message?.warning(msgContent)
          break
        case 'info':
          feedback.message?.info(msgContent)
          break
      }
    }

    // 设值动作
    if ('$set' in action) {
      const { target, value } = action.$set
      const resolvedValue = formState.executor.execute(value, context)
      formState.setFieldValue(target, resolvedValue)
    }

    // 重置动作
    if ('$reset' in action) {
      const paths = Array.isArray(action.$reset) ? action.$reset : [action.$reset]
      formState.resetFields(paths)
    }

    // 函数调用动作
    if ('$fn' in action) {
      const handler = schema.handlers?.[action.$fn]
      if (handler) {
        const args = (action.args || []).map(arg =>
          formState.executor.execute(arg, context),
        )
        await handler(...args, context)
      }
    }
  }

  /**
   * 执行动作列表
   */
  async function executeActions(
    actions: ReactionAction | ReactionAction[] | undefined,
    context: any,
  ): Promise<void> {
    if (!actions)
      return

    const actionList = Array.isArray(actions) ? actions : [actions]
    for (const action of actionList) {
      await executeAction(action, context)
    }
  }

  /**
   * 提交表单
   */
  async function submit(): Promise<any> {
    if (submitting.value) {
      return
    }

    submitting.value = true
    formState.formState.submitting = true

    try {
      // 1. 校验表单
      const submitConfig = schema.submit
      if (submitConfig?.validate !== false) {
        const validationResult = await formValidation.validateFields()
        if (!validationResult.valid) {
          throw new Error('表单校验失败')
        }
      }

      // 2. 获取表单值
      let values = formState.getFieldsValue()

      // 3. 执行 beforeSubmit 转换
      if (onBeforeSubmit) {
        values = await onBeforeSubmit(values)
      }

      // 4. 执行 schema 中的 transform
      if (submitConfig?.transform && schema.transformers?.[submitConfig.transform]) {
        const transformer = schema.transformers[submitConfig.transform]
        const context = formState.getExpressionContext()
        values = transformer(values, context)
      }

      // 5. 确认对话框
      if (submitConfig?.confirm) {
        const { title, content } = submitConfig.confirm
        const confirmed = await feedback.messageBox?.confirm({
          title: title || '提示',
          message: content || '',
        })
        if (!confirmed) {
          // 用户取消
          return
        }
      }

      // 6. 发起请求
      let response: any
      if (submitConfig?.api) {
        const apiConfig = submitConfig.api
        const url = formState.executor.execute(apiConfig.url, {
          values,
          context: formState.getExpressionContext(),
        })

        response = await requestAdapter({
          url,
          method: apiConfig.method || 'POST',
          data: values,
          headers: apiConfig.headers,
        })
      }
      else {
        // 没有配置 API，直接返回值
        response = values
      }

      // 7. 执行成功回调
      if (onSubmitSuccess) {
        onSubmitSuccess(response, values)
      }

      // 8. 执行 schema 中的 onSuccess 动作
      if (submitConfig?.onSuccess) {
        const context = {
          ...formState.getExpressionContext(),
          $response: response,
        }
        await executeActions(submitConfig.onSuccess, context)
      }

      return response
    }
    catch (error) {
      // 执行失败回调
      const err = error as Error
      if (onSubmitError) {
        onSubmitError(err, formState.getFieldsValue())
      }

      // 执行 schema 中的 onError 动作
      if (schema.submit?.onError) {
        const context = {
          ...formState.getExpressionContext(),
          $error: err,
        }
        await executeActions(schema.submit.onError, context)
      }

      throw error
    }
    finally {
      submitting.value = false
      formState.formState.submitting = false
    }
  }

  /**
   * 重置表单
   */
  async function reset(): Promise<void> {
    const resetConfig = schema.reset

    // 确认对话框
    if (resetConfig?.confirm) {
      const confirmed = await feedback.messageBox?.confirm({
        title: '提示',
        message: '确定要重置表单吗？',
      })
      if (!confirmed) {
        // 用户取消
        return
      }
    }

    // 重置表单
    formState.resetFields()
    formValidation.clearValidate()

    // 执行 onReset 动作
    if (resetConfig?.onReset) {
      const context = formState.getExpressionContext()
      await executeActions(resetConfig.onReset, context)
    }
  }

  return {
    submitting,
    submit,
    reset,
  }
}
