import type { Component } from 'vue'

interface ButtonsItem {
  btnType?: any | any[]
  slot?: string | ((...args: any[]) => any)
  text?: string
  icon?: Component | string
  event?: (data?: any, node?: any) => void
  tooltip?: string
}

export interface propsType {
  buttons: ButtonsItem[]
  resolveButtonIcon?: (btn: ButtonsItem) => Component | string | undefined
}
