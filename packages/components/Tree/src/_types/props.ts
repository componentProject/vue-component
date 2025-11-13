import type { TreeNode, TreeNodeData } from 'element-plus'
import type { Component } from 'vue'

export type ButtonType = 'add' | 'edit' | 'delete'

interface TreeOptionProps {
  children?: string
  label?: string
  value?: string
  disabled?: string
  class?: (data?: TreeNodeData, node?: TreeNode) => string | Record<string, boolean>
}

export interface ButtonsItem {
  btnType?: ButtonType
  slot?: string | ((...args: any[]) => any)
  icon?: Component | string
  event?: (data?: any, node?: any) => void
  tooltip?: string
}

/**
 * Tree 组件的 Props 类型定义
 */
export interface propsType<T = any> {
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
  props?: TreeOptionProps
  emptyText?: string
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
  /**
   * 点击节点时是否展开所有子节点
   */
  expandAllOnClickNode?: boolean
  /**
   * 默认展开所有节点
   */
  defaultExpandAll?: boolean
}
