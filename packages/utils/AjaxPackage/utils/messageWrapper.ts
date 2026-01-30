/**
 * Element Plus 消息组件的包装函数
 * 支持 SSR 环境，当 document 不存在时使用 console 输出
 */
import { ElMessage } from 'element-plus'

/**
 * 创建消息实例的包装函数
 * @param hasDocument - 是否在浏览器环境
 * @param container - 容器元素或获取容器的函数，如果提供则消息将挂载到该容器中
 * @returns 消息函数实例，直接调用即可，支持传入 type: 'success' | 'error' | 'warning' | 'info'
 */
export function createMessageWrapper(hasDocument: boolean, container?: HTMLElement | null | (() => HTMLElement | null)) {
  if (hasDocument) {
    /**
     * 浏览器环境下的消息函数
     * @param options - 字符串或配置对象，配置对象可以包含 type、message 等
     */
    return (options: string | { message?: string, type?: 'success' | 'error' | 'warning' | 'info', [key: string]: any }) => {
      const opts = typeof options === 'string' ? { message: options } : options
      // 如果 container 是函数，则调用它获取容器；否则直接使用
      const actualContainer = typeof container === 'function' ? container() : container
      const finalOptions = actualContainer
        ? { ...opts, appendTo: actualContainer }
        : opts
      return ElMessage(finalOptions as any)
    }
  }

  // 非浏览器环境下，使用 console 进行降级输出
  return (options: string | { message?: string, type?: 'success' | 'error' | 'warning' | 'info', [key: string]: any }) => {
    const opts = typeof options === 'string' ? { message: options } : options
    const message = opts?.message || ''
    const type = opts?.type || 'info'

    const logMessage = `[Message ${type}] ${message}`
    switch (type) {
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
        break
    }
  }
}

// 定义消息实例类型
export type MessageInstance = ReturnType<typeof createMessageWrapper>
