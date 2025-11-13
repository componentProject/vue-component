// TsButton的props组件
import type { DebounceSettings, ThrottleSettings } from 'lodash'

export type ShowType = 'content' | 'disabled'
export type ThrottleOrDebounceOptions = Partial<DebounceSettings & ThrottleSettings> & { promise?: boolean }

/**
 * TsButton 组件的 Props 类型定义
 */
export interface propsType {
  // popover 相关
  showType?: ShowType
  content?: string
  popoverProps?: Record<string, any>
  disabled?: boolean
  // 交互增强：参考 PopoverTableSelect；二者若同时传入，优先防抖
  debounce?: number
  throttle?: number
  zIndex?: number
  options?: ThrottleOrDebounceOptions
}
