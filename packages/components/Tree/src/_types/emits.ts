import type { TreeNode, TreeNodeData } from 'element-plus'

/**
 * Tree 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 节点点击时触发 */
  (e: 'nodeClick', data: TreeNodeData, node: TreeNode, evt: MouseEvent): void
  /** 选择变化时触发 */
  (e: 'change', rows: any[]): void
}
