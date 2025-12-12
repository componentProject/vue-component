import type { cardReaderPluginType } from './api'

/**
 * 自定义下拉选项类型
 */
export interface cardReaderCustomDropdownOptionType {
  /** 选项标签 */
  label: string
  /** 选项值 */
  value: string
  /** 其他自定义数据 */
  [key: string]: any
}

/**
 * CardReader 组件的 Props 类型定义
 */
export interface propsType extends Partial<cardReaderPluginType> {
  /** 输入框占位符 */
  placeholder?: string
  /** 显示类型 */
  showTypes?: string[]
  /** 医保扫码按钮的props */
  qrcodeButtonProps?: Record<string, any>
  qrcodeButtonText?: string
  /** 医保扫脸按钮的props */
  faceButtonProps?: Record<string, any>
  faceButtonText?: string
  /** 自定义下拉选项 */
  customDropdownOptions?: cardReaderCustomDropdownOptionType[]
  /** 是否开启轮询 */
  enablePolling?: boolean
  /** 轮询间隔时间（毫秒） */
  pollingInterval?: number
}
