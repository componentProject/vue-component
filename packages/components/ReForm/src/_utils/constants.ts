/** 导入默认表单栅格响应式配置 */
import { DEFAULT_FORM_GRID_RESPONSIVE } from './useGridResponsive'

/** 默认表单项配置常量 */
export const DEFAULT_FORM_ITEM_CFG = {
  /** 默认字段类型为组件类型 */
  type: 'component',
  /** 默认栅格占比，应该同Form的cols，默认占满一行 */
  span: DEFAULT_FORM_GRID_RESPONSIVE,
  /** 默认标签字段名 */
  labelKey: 'label',
  /** 默认值字段名 */
  valueKey: 'value',
  /** 默认模型属性名 */
  modelProp: 'modelValue',
  /** 默认模型事件名 */
  modelEvent: 'update:modelValue',
}

/** 默认折叠按钮文字配置 */
export const DEFAULT_COLLAPSED_TEXT = ['展开', '收起']
/** 默认文本域行数 */
export const DEFAULT_TEXTAREA_ROWS = 3
/** 包含子组件的组件映射表 */
export const HAS_CHILD_COMPONENT_MAP = {
  /** ElSelect 组件的子组件 */
  ElSelect: 'el-option',
  /** ElRadioGroup 组件的子组件 */
  ElRadioGroup: 'el-radio',
  /** ElCheckboxGroup 组件的子组件 */
  ElCheckboxGroup: 'el-checkbox',
}
