export interface Image4oRequest {
  /** 生成尺寸比例，如 '3:2' */
  size?: string
  /** 提示词 */
  prompt?: string
  /** 蒙版图片 URL */
  maskUrl?: string
  /** 是否上传到中国区 */
  uploadCn?: boolean
  /** 是否启用兜底模型 */
  enableFallback?: boolean
  /** 兜底模型名，默认 'FLUX_MAX' */
  fallbackModel?: string
}
