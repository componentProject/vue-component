/**
 * 通用消息类型
 */
export interface MessageType {
  /**
   * 是否显示消息
   */
  show: boolean
  /**
   * 消息类型
   */
  type: 'success' | 'error' | 'warning' | 'info'
  /**
   * 消息内容
   */
  text: string
}

/**
 * 保存成功事件数据类型
 */
export interface SaveSuccessDataType {
  /**
   * Markdown内容
   */
  value: string
  /**
   * HTML内容
   */
  html: string
  /**
   * 保存时间（ISO 字符串）
   */
  saveTime?: string
  /**
   * 文档标题
   */
  title?: string
}
