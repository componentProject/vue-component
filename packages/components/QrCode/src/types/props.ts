/**
 * QrCode 组件的 Props 类型定义
 */

/**
 * 二维码错误纠正级别
 */
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

/**
 * 二维码图片类型
 */
export type ImageType = 'image/png' | 'image/jpeg' | 'image/webp'

/**
 * QrCode 组件 Props 类型
 */
export interface propsType {
  /** 要编码的文本内容 */
  text: string
  /** 二维码尺寸（像素） */
  size: number
  /** 错误纠正级别 */
  errorCorrectionLevel: ErrorCorrectionLevel
  /** 二维码颜色 */
  colorDark: string
  /** 背景颜色 */
  colorLight: string
  /** 二维码边距（模块数） */
  margin: number
  /** 是否显示边框 */
  showBorder: boolean
  /** 边框宽度（像素） */
  borderWidth: number
  /** 边框颜色 */
  borderColor: string
  /** 是否显示Logo */
  showLogo: boolean
  /** Logo图片地址 */
  logoUrl: string
  /** Logo尺寸（像素） */
  logoSize: number
  /** Logo边距（像素） */
  logoMargin: number
  /** Logo背景颜色 */
  logoBackgroundColor: string
  /** 是否支持下载 */
  downloadable: boolean
  /** 下载文件名 */
  downloadFileName: string
  /** 图片类型 */
  imageType: ImageType
  /** 图片质量（仅对JPEG有效，0-1） */
  quality: number
  /** 是否自动补全URL（如果text是URL但没有协议，自动添加https://） */
  autoCompleteUrl: boolean
}
