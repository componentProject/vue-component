/**
 * ImportExcel 组件的 Emits 类型定义
 */
export interface ImportResult {
  message: string
  data: Array<Record<string, any>>
}

export interface ImportError {
  message: string
  error?: any
}

export interface emitsType {
  /** 导入成功，抛出解析后的数组数据 */
  (e: 'success', result: ImportResult): void
  /** 导入失败或中断，抛出错误信息 */
  (e: 'error', error: ImportError): void
  /** 导入警告，抛出警告信息 */
  (e: 'warning', result: ImportResult): void
}
