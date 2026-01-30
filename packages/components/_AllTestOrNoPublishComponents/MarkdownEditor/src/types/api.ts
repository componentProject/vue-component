/**
 * 保存到 IndexedDB 的数据结构
 */
export interface SavedDocumentData {
  /**
   * 文档内容
   */
  content: string
  /**
   * 文档标题
   */
  title: string
  /**
   * 最后修改时间
   */
  lastModified: string
  /**
   * 编辑器ID
   */
  id: string
}

/**
 * 文档列表项类型
 */
export interface DocumentListItem extends SavedDocumentData {
  /**
   * 存储键名
   */
  key: string
}

/**
 * 保存到 IndexedDB 的参数类型
 */
export interface markdownEditorSaveToIndexedDBParamsType {
  /**
   * 要保存的内容
   */
  content: string
  /**
   * 文档标题（可选）
   */
  title?: string
}

/**
 * 从 IndexedDB 加载内容的参数类型
 */
export interface markdownEditorLoadFromIndexedDBParamsType {
  /**
   * 编辑器ID
   */
  id: string
}

/**
 * 删除保存文档的参数类型
 */
export interface markdownEditorDeleteSavedDocumentParamsType {
  /**
   * 文档键名
   */
  key: string
}

/**
 * 图片数据结构
 */
export interface ImageData {
  /**
   * 图片ID
   */
  id: string
  /**
   * 图片名称
   */
  name: string
  /**
   * 图片大小（字节）
   */
  size: number
  /**
   * 图片类型
   */
  type: string
  /**
   * 图片数据（base64 或 blob）
   */
  data: string
  /**
   * 上传时间
   */
  uploadTime: string
  /**
   * 编辑器ID
   */
  editorId: string
}

/**
 * 图片上传参数类型
 */
export interface markdownEditorUploadImageParamsType {
  /**
   * 文件列表
   */
  files: File[]
  /**
   * 回调函数，用于返回图片URL
   */
  callback: (urls: string[]) => void
}

/**
 * 图片删除参数类型
 */
export interface markdownEditorDeleteImageParamsType {
  /**
   * 图片ID
   */
  imageId: string
}

/**
 * 获取图片列表参数类型
 */
export interface markdownEditorGetImagesParamsType {
  /**
   * 编辑器ID
   */
  editorId: string
}
