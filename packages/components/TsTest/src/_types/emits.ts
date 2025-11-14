/**
 * TsTest 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 点击事件 */
  (e: 'click', ev: MouseEvent): void
  /** 自定义事件 */
  (e: 'custom', data: any): void
}
