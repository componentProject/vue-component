import type { cardReaderPluginType } from './api'

/**
 * CardReader 组件的 Props 类型定义
 */
export interface propsType extends Partial<cardReaderPluginType> {
  /** 输入框占位符 */
  placeholder?: string
  /** 读卡触发方式 */
  readTypes?: Array<'focus' | 'select' | 'enter'>
  showTypes?: string[]
}
