/** 导入 VueUse 的 Arrayable 类型 */
import type { Arrayable } from '@vueuse/core'
/** 导入 Element Plus 相关类型 */
import type { ButtonProps, ElForm, ElTooltipProps, FormItemRule } from 'element-plus'
/** 导入 Vue 的 MaybeRef 类型 */
import type { MaybeRef } from 'vue'

/** 导入响应式栅格类型 */
import type { ReGridResponsive } from '../utils/useGridResponsive/types'

/** 导出响应式栅格类型 */
export { ReGridResponsive }
/** ReForm 组件属性接口定义 */
export interface ReFormProps {
  /** 获取ElForm的ref方法 */
  formRef?: (form: InstanceType<typeof ElForm> | null) => void
  /** 表单项配置内容 */
  items: ReFormItem[]
  /** 绑定表单数据-用于数据同步 */
  modelValue?: ReFormModelValue
  /** 表单栅格列数 */
  cols?: number | ReGridResponsive
  /** 表单栅格列间距 */
  colGap?: number
  /** 表单尺寸 */
  size?: 'large' | 'default' | 'small'
  /** 表单是否禁用 */
  disabled?: boolean
  /** 表单是否可编辑/只读 */
  editable?: boolean
  /** 表单校验失败是否自动滚动到第一个error字段位置 */
  scrollToError?: boolean
  /** 是否忽略表单按钮组标签宽度 */
  ignoreBtnLabel?: boolean
  /** 表单按钮组栅格占比 */
  btnSpan?: number | ReGridResponsive
  /** 表单按钮组内联样式 */
  btnSpanStyle?: string
  /** 表单布局类型：grid或flex */
  layout?: 'grid' | 'flex'
  /** 全局表单项宽度（在flex布局下生效） */
  itemWidth?: number | string
  /** 表单按钮组-提交按钮文字 */
  submitBtnText?: string
  /** 表单按钮组-取消按钮文字 */
  cancelBtnText?: string
  /** 表单按钮组-提交按钮自定义属性 */
  submitBtnProps?: ButtonProps
  /** 表单按钮组-取消按钮自定义属性 */
  cancelBtnProps?: ButtonProps
  /** 表单默认提示语自定义样式 */
  tooltipProps?: ElTooltipProps
  /** 分组表单校验失败是否自动展开分组 */
  autoCollapseInValidate?: boolean
  /** 隐藏表单按钮组 */
  hideBtns?: boolean
  /** 只读情况下空内容展示占位 */
  emptyText?: string
  /** 表单提交远程请求方法 */
  request?: (model: Record<string, any>) => Promise<any>
  /** 新增拖拽排序功能开关 */
  draggable?: boolean
}

/** ReForm 组件事件接口定义 */
export interface ReFormEmits {
  (e: 'formItemClick', val: any): void
  /** 表单字段值变化事件 */
  (
    e: 'change',
    field: string,
    value: any,
    model: MaybeRef<ReFormModelValue>
  ): void
  /** 更新表单数据事件 */
  (e: 'update:modelValue', model: MaybeRef<ReFormModelValue>): void
  /** 更新表单项配置事件 */
  (e: 'update:items', items: ReFormItem[]): void
  /** 表单提交事件 */
  (e: 'submit', model?: Record<string, any>): void
  /** 表单取消事件 */
  (e: 'cancel'): void
  /** 请求成功或失败事件 */
  (e: 'success' | 'error', res: unknown): void
}

/** 表单项接口定义，继承分组项接口 */
export interface ReFormItem extends ReFormGroupItem {
  /** 字段类型 text-纯文本字段; component-表单控件字段; group-表单字段组合，默认 component */
  type?: 'text' | 'component' | 'group'
  /** 表单字段标签名 */
  label?: string
  /** 表单字段名 */
  field: string
  /** 表单字段标签名宽度，默认继承el-form配置 */
  labelWidth?: number
  /** 表单字段标签名位置，默认继承el-form配置 */
  labelPosition?: string
  /** form-item样式类 */
  customClass?: string
  /** 控件样式 */
  controlClass?: string
  /** 表单字段栅格占比 */
  span?: number | ReGridResponsive
  /** 表单项目宽度，在flex布局下生效 */
  itemWidth?: number | string
  /** 表单字段默认值 */
  defaultValue?: any
  /** 问号提示语 */
  tooltip?: string
  /** 表单控件下方提示 */
  tips?: string
  /** 表单控件下方提示样式类 - 颜色 */
  tipsClass?: string
  /** type = "component" 生效，表单字段控件名（必须是全局组件，非全局组件请使用插槽渲染） */
  component?: string
  /** type = "component" 生效，表单字段控件需要选项组，子组件所使用组件 */
  childComp?: string
  /** 表单字段控件需要选项组，如 select -》 option，checkbox-group -》 checkbox 等需要指定 */
  options?: ReFormItemOption[]
  /** 选项组选项标签名字段 */
  labelKey?: string
  /** 选项组选项主键字段 */
  valueKey?: string
  /** 表单字段校验规则 */
  rules?: Arrayable<FormItemRule>
  /** 表单字段控件v-model关联属性： modelValue */
  modelProp?: string
  /** 表单字段控件v-model关联事件：update:modelValue */
  modelEvent?: string
  /** 表单控件属性配置 */
  props?: Record<string, any>
  /** 表单控件事件监听 */
  events?: Record<string, (val: any) => any>
  /** 表单字段组 */
  children?: ReFormItem[]
  /** 自定义插槽 */
  slot?: string
  /** 字段名插槽 */
  labelSlot?: string
  /** 表单字段是否可见 */
  visible?: boolean | ReFormItemVisibleRule | ReFormItemVisibleRuleCondition
}

/** 表单分组项接口定义 */
export interface ReFormGroupItem {
  /** 组内所有插槽名 */
  groupSlots?: [string[], string[]]
  /** 折叠面板插槽 */
  groupSlot?: string
  /** type = group 有效，默认是否展开 */
  defaultCollapsed?: boolean
  /** 折叠按钮文字配置 */
  collapsedText?: string | [string] | [string, string]
  /** 折叠按钮属性配置 */
  collapsedTriggerProps?: Partial<ButtonProps>
  /** 折叠按钮是否显示索引 */
  collapsedTriggerIndex?: boolean
}

/** 表单项选项接口定义 */
export interface ReFormItemOption {
  [key: string]: any
}

/** 表单项可见性规则接口定义 */
export interface ReFormItemVisibleRule {
  /** 多个匹配条件逻辑关系 */
  type: '&' | '|'
  /** 多个匹配条件 */
  conditions: ReFormItemVisibleRuleCondition[]
}

/** 表单项可见性规则条件接口定义 */
export interface ReFormItemVisibleRuleCondition {
  /** 关联字段名 */
  field: string
  /** 关联字段值 formData[field] 与 value的比较 formData[field].includes(value) */
  value: any
  /** 是否忽略大小写 */
  ignoreCase?: boolean
  /** 关联字段判断方式 =(等于)，!(非)，.(包含)，^(开头)，$(结尾)，&(全部匹配)，｜(部分匹配) */
  type?:
  '=' | '!=' | '.' | '!.' | '^=' | '=$' | '!^=' | '!=$' | '&.' | '!&.' | '|.'
}

/** 表单数据值类型定义 */
export type ReFormModelValue = Record<string, any>
/** 表单校验规则类型定义 */
export type ReFormRules = Record<string, Arrayable<FormItemRule>>
