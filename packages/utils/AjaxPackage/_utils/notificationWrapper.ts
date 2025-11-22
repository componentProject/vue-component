/**
 * Element Plus 通知组件的包装函数
 * 支持 SSR 环境，当 document 不存在时使用 console 输出
 */
import { ElNotification } from 'element-plus'

// 检查 document 是否存在
const hasDocument = typeof document !== 'undefined'

/**
 * 创建通知实例的包装函数（用于 errors / tips 展示）
 * @returns 通知实例，支持 success、error、warning、info 方法
 */
export function createNotificationWrapper() {
  if (hasDocument) {
    return ElNotification
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
