import { computed, ref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import BaseApi from '@moluoxixi/utils/AjaxPackage/class'

// 定义请求类型
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type RequestParamsType = 'query' | 'body' | 'form'

export interface UseOptionsProps {
  options: any[]
  requestUrl?: string
  requestParams?: Record<string, any>
  requestMethod?: RequestMethod
  requestParamsType?: RequestParamsType
  requestHeaders?: Record<string, any>
  responseDataPath?: string
}

export interface UseOptionsReturn {
  options: ComputedRef<any[]>
  isLoading: ComputedRef<boolean>
  error: ComputedRef<string | null>
}

/**
 * 用于处理 options 获取逻辑的 hook
 * 支持静态 options 和动态请求两种方式
 * @param props 包含 options、requestUrl、requestParams 等配置
 * @returns 返回处理后的 options 和加载状态
 */
export function useOptions(props: UseOptionsProps): UseOptionsReturn {
  console.log('props', props)
  const serverOrLocalOptions = ref<any[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 动态请求数据
  async function fetchDynamicData() {
    if (!props.requestUrl) {
      return []
    }

    try {
      isLoading.value = true
      error.value = null

      // 创建BaseApi实例，配置responseFields支持路径解析
      const api = new BaseApi({
        baseURL: '', // 使用完整URL，不需要baseURL
        timeout: 10000,
        responseFields: {
          code: 'code',
          message: 'message',
          data: props.responseDataPath || 'data', // 使用responseDataPath作为数据路径
        },
        onTimeout: () => {
          console.warn('请求超时')
        },
        // 将自定义请求头传给BaseApi
        headers: {
          'Content-Type': 'application/json',
          ...props.requestHeaders, // 合并自定义请求头
        },
      })

      let response

      // 根据请求类型和入参类型进行请求
      if (props.requestMethod === 'GET' || props.requestParamsType === 'query') {
        // GET请求或query类型，参数放在params中
        response = await api.get(props.requestUrl, props.requestParams)
      }
      else if (props.requestParamsType === 'body') {
        // body类型，参数放在data中
        response = await api.post(props.requestUrl, props.requestParams)
      }
      else if (props.requestParamsType === 'form') {
        // form类型，使用FormData
        const formData = new FormData()
        Object.entries(props.requestParams || {}).forEach(([key, value]) => {
          formData.append(key, String(value))
        })
        // 创建新的API实例，不设置Content-Type让浏览器自动设置
        const formApi = new BaseApi({
          baseURL: '',
          timeout: 10000,
          responseFields: {
            code: 'code',
            message: 'message',
            data: props.responseDataPath || 'data',
          },
          onTimeout: () => {
            console.warn('请求超时')
          },
          headers: {
            ...props.requestHeaders, // 不设置Content-Type
          },
        })
        response = await formApi.post(props.requestUrl, formData)
      }
      else {
        // 其他情况使用POST请求
        response = await api.post(props.requestUrl, props.requestParams)
      }
      const data = response || []
      // 确保返回的是数组
      return Array.isArray(data) ? data : []
    }
    catch (err: any) {
      // 使用BaseApi的错误处理
      error.value = err.message || '请求数据失败'
      console.error('请求数据失败:', err.message || err)
      return []
    }
    finally {
      isLoading.value = false
    }
  }

  // 监听 props 变化，更新 options
  watch(
    () => [props.options, props.requestUrl, props.requestParams],
    async ([newOptions, requestUrl]) => {
      // 优先使用动态请求
      if (requestUrl) {
        serverOrLocalOptions.value = await fetchDynamicData()
      }
      // 使用静态options
      else {
        serverOrLocalOptions.value = newOptions as any[]
      }
    },
    {
      immediate: true,
      deep: true,
    },
  )

  return {
    options: computed(() => serverOrLocalOptions.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
  }
}
