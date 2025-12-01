/**
 * 系统错误信息提取工具函数
 */
import type { AxiosResponse } from 'axios'
import type { SystemErrorDialogPropsType } from '../_types'

/**
 * 规范化请求参数对象
 * @param payload 请求参数
 * @returns 规范化后的对象
 */
export function normalizePayload(payload: any): Record<string, any> {
  if (!payload)
    return {}

  if (typeof payload === 'string') {
    try {
      return JSON.parse(payload)
    }
    catch {
      return {}
    }
  }

  if (typeof payload === 'object')
    return payload

  return {}
}

/**
 * 解析响应头中的 TraceId
 * @param headers 响应头
 * @returns TraceId 字符串
 */
export function resolveTraceId(headers: AxiosResponse['headers'] | undefined): string {
  if (!headers)
    return ''

  // 尝试多种可能的 TraceId 字段名
  const traceIdKeys = ['TraceId', 'traceid', 'trace-id', 'X-Trace-Id', 'x-trace-id']

  for (const key of traceIdKeys) {
    const value = headers[key]
    if (value)
      return String(value)
  }

  return ''
}

/**
 * 从 localStorage 中读取 userInfo
 * @returns userInfo 对象，如果不存在则返回空对象
 */
export function getUserInfoFromLocalStorage(): Record<string, any> {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined')
    return {}

  try {
    const userInfoStr = localStorage.getItem('userInfo')

    if (!userInfoStr)
      return {}

    const userInfo = JSON.parse(userInfoStr)
    return userInfo || {}
  }
  catch (error) {
    console.warn('Failed to parse userInfo from localStorage:', error)
    return {}
  }
}

/**
 * 从 AxiosResponse 中提取系统错误信息
 * @param response Axios 响应对象
 * @param code 错误代码
 * @param message 错误消息
 * @returns 提取的错误信息
 */
export function extractSystemErrorInfo(
  response: AxiosResponse,
  code: number,
  message: string,
): Omit<SystemErrorDialogPropsType, 'title' | 'width'> {
  // 合并请求参数（URL参数和请求体参数）
  const mergedRequestPayload = {
    ...normalizePayload(response.config?.params),
    ...normalizePayload(response.config?.data),
  }

  // 拼接完整的请求URL
  function getFullRequestUrl() {
    const baseURL = response.config?.baseURL || ''
    const url = response.config?.url || ''

    // 如果 url 已经是完整的 URL（包含协议），直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // 拼接 baseURL 和 url
    return baseURL.endsWith('/') && url.startsWith('/')
      ? baseURL + url.slice(1) // 避免双斜杠
      : baseURL.endsWith('/') || url.startsWith('/') || !url
        ? baseURL + url
        : `${baseURL}/${url}`
  }

  // 从 localStorage 读取 userInfo
  const userInfo = getUserInfoFromLocalStorage()

  return {
    userName: userInfo.username ?? mergedRequestPayload.userName ?? mergedRequestPayload.username,
    userId: userInfo.id ?? mergedRequestPayload.userId ?? mergedRequestPayload.userid,
    deptName: userInfo.workDeptName ?? mergedRequestPayload.deptName ?? mergedRequestPayload.departmentName,
    deptId: userInfo.workDeptId ?? mergedRequestPayload.deptId ?? mergedRequestPayload.departmentId,
    clientIp: userInfo.loginip ?? mergedRequestPayload.clientIp ?? mergedRequestPayload.ip,
    requestUrl: getFullRequestUrl(),
    traceId: resolveTraceId(response.headers),
    errorCode: code,
    errorMessage: message,
  }
}
