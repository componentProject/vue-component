/**
 * ConfigForm - 常量类型定义
 * 表单相关的枚举类型和常量
 */

// ==================== 表单交互模式 ====================

/**
 * 表单交互模式类型
 * - editable: 可编辑（默认）
 * - disabled: 禁用（组件灰显，不可操作）
 * - readOnly: 只读（组件正常显示，不可编辑）
 * - readPretty: 阅读态（纯文本展示，无组件边框）
 */
export type PatternType = 'editable' | 'disabled' | 'readOnly' | 'readPretty'

/**
 * 表单交互模式选项列表
 */
export const PATTERN_OPTIONS: readonly PatternType[] = ['editable', 'disabled', 'readOnly', 'readPretty'] as const

// ==================== 显示模式 ====================

/**
 * 字段显示模式类型
 * - visible: 可见（默认）
 * - hidden: 隐藏（不显示但保留值）
 * - none: 不存在（不显示且不保留值）
 */
export type DisplayType = 'visible' | 'hidden' | 'none'

/**
 * 显示模式选项列表
 */
export const DISPLAY_OPTIONS: readonly DisplayType[] = ['visible', 'hidden', 'none'] as const

// ==================== 布局类型 ====================

/**
 * 表单布局类型
 * - horizontal: 水平布局（标签在左侧）
 * - vertical: 垂直布局（标签在上方）
 * - inline: 行内布局（表单项横向排列）
 */
export type LayoutType = 'horizontal' | 'vertical' | 'inline'

/**
 * 布局类型选项列表
 */
export const LAYOUT_OPTIONS: readonly LayoutType[] = ['horizontal', 'vertical', 'inline'] as const

// ==================== 事件类型 ====================

/**
 * Handler 触发事件类型
 */
export type HandlerEventType = 'init' | 'change' | 'focus' | 'blur'

/**
 * Handler 事件选项列表
 */
export const HANDLER_EVENT_OPTIONS: readonly HandlerEventType[] = ['init', 'change', 'focus', 'blur'] as const

// ==================== 字段布局常量 ====================

/**
 * 布局字段类型列表（用于类型提示和文档参考）
 *
 * 注意：现在通过 layout 属性判断是否为布局字段，不再需要判断 type。
 * 有 layout 属性的字段不产生数据，仅用于视觉布局和字段组织。
 *
 * 设计理念：
 * - 数据字段：使用 type 属性指定（input、number、select 等）
 * - 布局字段：使用 layout 属性指定（tabs、collapse、card 等）
 * - 这样的分离使语义更清晰，判断更简单
 */
export const LAYOUT_FIELD_TYPES = [
  'void', // 通用布局容器
  'group', // 字段分组
  'card', // 卡片容器
  'collapse', // 折叠面板
  'tabs', // 标签页
  'divider', // 分割线
  'alert', // 提示信息
] as const

/**
 * 判断字段是否为布局字段
 * @param field - 字段配置
 * @returns 是否为布局字段（有 layout 属性）
 */
export function isLayoutField(field: { layout?: string }): boolean {
  return field.layout != null
}
