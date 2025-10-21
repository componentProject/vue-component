/**
 * DateRangePicker 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 更新绑定值时触发 */
  (e: 'update:modelValue', value: any[]): void
  /** 日期变化时触发 */
  (e: 'change', value: any): void
}
