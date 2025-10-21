/**
 * Splitter 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 面板大小变化时触发 */
  (e: 'resize', sizes: number[]): void
  /** 面板折叠状态变化时触发 */
  (e: 'collapse', panelIndex: number, collapsed: boolean): void
}
