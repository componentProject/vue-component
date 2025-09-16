export interface veo3VideoGenerateParamsType {
  /** 提示词 */
  prompt?: string
  /** apikey */
  apiKey?: string
  /** 图片地址列表 */
  imageUrls?: string[]
  /** 水印 */
  watermark?: string
  /** 回调地址 */
  callBackUrl?: string
  /** 是否启用兜底模型 */
  enableFallback?: boolean
  /** 使用的模型名 */
  model?: string
  /** 宽高比，如 '16:9' */
  aspectRatio?: string
  /** 是否启用翻译 */
  enableTranslation?: boolean
  /** 随机种子 */
  seeds?: number | string | Array<number | string>
}
