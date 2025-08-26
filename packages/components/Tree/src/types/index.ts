import type { Component } from 'vue'

export type ButtonType = 'add' | 'edit' | 'delete'

export interface ButtonsItem {
  type?: ButtonType
  slot?: string | ((...args: any[]) => any)
  icon?: Component | string
  event?: (data: any, node?: any) => void
  tooltip?: string
}

export interface TreeProps<T = any> {
  data?: T[]
  childrenField?: string
  rowField?: string
  parentField?: string
  labelField?: string
  childIcon?: Component | string
  parentIcon?: Component | string
  icon?: (nodeData: T) => Component | string
  showType?: 'hover' | 'click' | 'default'
  buttons?: (nodeData: T) => ButtonsItem[]
  indent?: number
  height?: number
}


