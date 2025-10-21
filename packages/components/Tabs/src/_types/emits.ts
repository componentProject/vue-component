/**
 * Tabs 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 标签页切换时触发 */
  (e: 'tabChange', value: any): void
}
