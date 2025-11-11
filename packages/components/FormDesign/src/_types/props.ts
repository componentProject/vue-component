/**
 * FormDesign 组件的 Props 类型定义
 */
// 从 type.ts 导入类型定义，保持一致性
export type MenuItem = 'delete' | 'undo' | 'redo' | 'tree' | 'save' | 'preview' | 'fullscreen' | 'viewport' | 'json-export' | 'json-import'
export type MenuRight = 'viewport' | 'json-export' | 'json-import'
export interface MenuBarData {
  left: MenuItem[]
  right: MenuRight[]
  column: boolean
}

export interface BaseFormItem {
  ControlType: string
  icon?: string
  nameCn?: string
  layout?: boolean
  [key: string]: any
}

/**
 * FormDesign 组件的 Props
 */
export interface propsType {
  /**
   * 基础控件列表
   */
  basicFields?: BaseFormItem[]
  /**
   * 布局控件列表
   */
  layoutFields?: BaseFormItem[]
  /**
   * 是否禁用快捷键
   */
  shortcutDisabled?: boolean
  /**
   * 导航头是否展示
   */
  headerShow?: boolean
  /**
   * 顶部工具栏配置
   */
  menu?: MenuBarData
  /**
   * 右侧配置属性tab
   */
  panel?: string[]
}
