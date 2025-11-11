import type { TreeNode, TreeNodeData } from 'element-plus'

/**
 * Tree 组件的 Slots 类型定义
 */
export interface slotsType {
  /** 默认插槽 */
  default?: (params: { node: TreeNode, data: TreeNodeData }) => any
  /** 标签插槽 */
  label?: (params: { node: TreeNode, data: TreeNodeData }) => any
}
