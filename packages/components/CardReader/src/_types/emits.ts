/**
 * CardReader 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 读卡成功时触发 */
  (e: 'readSuccess', data: any): void
  /** 读卡失败时触发 */
  (e: 'readError', error: any): void
}
