/**
 * QrCode 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽，用于自定义二维码显示区域 */
  default?: () => any
  /** Logo插槽，用于自定义Logo显示 */
  logo?: () => any
}


