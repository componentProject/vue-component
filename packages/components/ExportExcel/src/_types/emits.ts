/**
 * ExportExcel 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 导出成功时触发 */
  (e: 'success'): void
  /** 导出失败时触发 */
  (e: 'error', error: Error): void
  /** 导出警告时触发 */
  (e: 'warning', message: string): void
}
