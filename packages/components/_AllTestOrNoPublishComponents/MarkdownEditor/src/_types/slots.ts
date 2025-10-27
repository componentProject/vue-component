import type { EditorProps } from 'md-editor-v3'

/**
 * MarkdownEditor 组件的插槽类型定义
 */
export interface slotsType {
  /**
   * 自定义扩展页脚。可以通过该插槽来自定义页脚的内容
   */
  defFooters?: EditorProps['defFooters']
  /**
   * 自定义工具栏插槽，通过使用内置的NormalToolbar普通点击触发事件组件，DropdownToolbar下拉点击触发事件组件和ModalToolbar弹窗触发事件组件进行扩展。将defToolbars插槽中的组件下标穿插在toolbars实现展示（这并不规范）。
   */
  defToolbars?: EditorProps['defToolbars']
}
