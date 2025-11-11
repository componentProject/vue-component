/**
 * TsExpandable 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 展开/收起状态改变时触发 */
  change: [expanded: boolean]
  /** 展开时触发 */
  expand: []
  /** 收起时触发 */
  collapse: []
}
