// _utilComponents的props组件
import type { Component } from 'vue'

export interface ButtonsItem {
  btnType?: any | any[]
  slot?: string | ((...args: any[]) => any)
  text?: string
  icon?: Component | string
  event?: (data?: any, node?: any) => void
  tooltip?: string
}

/**
 * Buttons 组件的 Props 类型定义
 */
export interface propsType {
  buttons: ButtonsItem[]
  resolveButtonIcon?: (btn: ButtonsItem) => Component | string | undefined
  data?: any
  node?: any
}
