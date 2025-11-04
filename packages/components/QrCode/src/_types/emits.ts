/**
 * QrCode 组件的 Emits 类型定义
 */
export interface emitsType {
  /** 二维码生成完成时触发 */
  ready: [url: string]
  /** 二维码生成失败时触发 */
  error: [error: Error]
  /** 下载时触发 */
  download: [url: string]
}


