/**
 * Splitter 组件的 Emits 类型定义
 */
export interface emitsType {
  /**
   * 分割面板大小改变时触发
   * @param sizes 各个面板的大小比例
   */
  (e: 'resize', sizes: number[]): void
}
