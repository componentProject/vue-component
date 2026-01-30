/**
 * Element Plus 通知组件的包装函数
 * 支持 SSR 环境，当 document 不存在时使用 console 输出
 */
import { ElNotification } from 'element-plus'

/**
 * 创建通知实例的包装函数（用于 errors / tips 展示）
 * @param hasDocument - 是否在浏览器环境
 * @param container - 容器元素或获取容器的函数，如果提供则通知将挂载到该容器中
 * @returns 通知函数实例，直接调用即可，支持传入 type: 'success' | 'error' | 'warning' | 'info'
 */
export function createNotificationWrapper(hasDocument: boolean, container?: HTMLElement | null | (() => HTMLElement | null)) {
  if (hasDocument) {
    /**
     * 浏览器环境下的通知函数
     * @param options - 字符串或配置对象，配置对象可以包含 type、message、title 等
     */
    return (options: string | {
      message?: string
      title?: string
      type?: 'success' | 'error' | 'warning' | 'info'
      [key: string]: any
    }) => {
      const opts = typeof options === 'string' ? { message: options } : options
      // 如果 container 是函数，则调用它获取容器；否则直接使用
      const actualContainer = typeof container === 'function' ? container() : container
      const finalOptions = actualContainer
        ? { ...opts, appendTo: actualContainer }
        : opts
      return ElNotification(finalOptions as any)
    }
  }

  const consoleNotification = (
    options: string | { message?: string, title?: string },
    level: 'success' | 'error' | 'warning' | 'info' = 'info',
  ) => {
    const opts = typeof options === 'string' ? { message: options } : options
    const message = opts?.message || ''
    const title = opts?.title || '提示'
    const logMessage = `[Notification ${level}] ${title}: ${message}`

    switch (level) {
      case 'success':
        console.log(logMessage)
        break
      case 'error':
        console.error(logMessage)
        break
      case 'warning':
        console.warn(logMessage)
        break
      default:
        console.info(logMessage)
    }
  }

  // 非浏览器环境下，返回一个函数，内部用 console 输出
  const wrapper = (options: string | {
    message?: string
    title?: string
    type?: 'success' | 'error' | 'warning' | 'info'
  }) => {
    const opts = typeof options === 'string' ? { message: options } : options
    const type = opts?.type || 'info'
    consoleNotification(options, type)
  }

  // 添加具体方法
  ;(wrapper as any).success = (options: string | { message?: string, title?: string }) =>
    consoleNotification(options, 'success')
  ;(wrapper as any).error = (options: string | { message?: string, title?: string }) =>
    consoleNotification(options, 'error')
  ;(wrapper as any).warning = (options: string | { message?: string, title?: string }) =>
    consoleNotification(options, 'warning')
  ;(wrapper as any).info = (options: string | { message?: string, title?: string }) =>
    consoleNotification(options, 'info')

  return wrapper
}

// 定义通知实例类型
export type NotificationInstance = ReturnType<typeof createNotificationWrapper>
