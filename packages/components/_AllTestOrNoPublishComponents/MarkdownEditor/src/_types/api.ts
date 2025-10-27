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
