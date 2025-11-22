/**
 * Element Plus 消息组件的包装函数
 * 支持 SSR 环境，当 document 不存在时使用 console 输出
 */
import { ElMessage } from 'element-plus'

// 检查 document 是否存在
const hasDocument = typeof document !== 'undefined'

/**
 * 创建消息实例的包装函数
 * @returns 消息实例，支持 success、error、warning、info 方法
 */
export function createMessageWrapper() {
  if (hasDocument) {
    return ElMessage
  }
  return {
    success: (options: string | { message?: string, [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.log(`[Message Success] ${message}`)
    },
    error: (options: string | { message?: string, [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.error(`[Message Error] ${message}`)
    },
    warning: (options: string | { message?: string, [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.warn(`[Message Warning] ${message}`)
    },
    info: (options: string | { message?: string, [key: string]: any }) => {
      const message = typeof options === 'string' ? options : options?.message || ''
      console.info(`[Message Info] ${message}`)
    },
  }
}

// 定义消息实例类型
export type MessageInstance = ReturnType<typeof createMessageWrapper>
