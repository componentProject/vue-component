import type { Component } from 'vue'
import type { TreeNode, TreeNodeData } from 'element-plus'

export type ButtonType = 'add' | 'edit' | 'delete'

interface TreeOptionProps {
  children?: string
  label?: string
  value?: string
  disabled?: string
  class?: (data: TreeNodeData, node: TreeNode) => string | {
    [key: string]: boolean
  }
}
export interface ButtonsItem {
  type?: ButtonType
  slot?: string | ((...args: any[]) => any)
  icon?: Component | string
  event?: (data?: any, node?: any) => void
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
  indent?: number | string
  height?: number
  props?: TreeOptionProps
  /**
   * 是否显示左侧连接线
   */
  showLine?: boolean
  /**
   * 是否显示每行的连接线
   */
  showRowLine?: boolean
  /**
   * 层级选择：点击某节点时高亮该节点及其所有子孙节点
   */
  levelSelect?: boolean
}
