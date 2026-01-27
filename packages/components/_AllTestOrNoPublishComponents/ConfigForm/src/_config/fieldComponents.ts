/**
 * ConfigForm - Field Component Mapping
 * 字段类型与组件的映射配置
 */

import {
  ElCascader,
  ElCheckboxGroup,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElRate,
  ElSelect,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTreeSelect,
  ElUpload,
} from 'element-plus'
import { markRaw } from 'vue'

/**
 * 字段类型与组件的映射表
 * 使用 markRaw 包装复合组件配置，避免 Vue 响应式转换
 */
export const fieldComponentMap: Record<string, any> = {
  // 基础输入
  input: ElInput,
  textarea: markRaw({
    ...ElInput,
    props: { ...ElInput.props, type: { default: 'textarea' } },
  }),
  password: markRaw({
    ...ElInput,
    props: { ...ElInput.props, type: { default: 'password' }, showPassword: { default: true } },
  }),

  // 数字输入
  number: ElInputNumber,

  // 选择器
  select: ElSelect,
  multiSelect: markRaw({
    ...ElSelect,
    props: { ...ElSelect.props, multiple: { default: true } },
  }),
  cascader: ElCascader,
  treeSelect: ElTreeSelect,

  // 单选/多选
  radio: ElRadioGroup,
  checkbox: ElCheckboxGroup,

  // 开关/滑块/评分
  switch: ElSwitch,
  slider: ElSlider,
  rate: ElRate,

  // 颜色选择
  color: ElColorPicker,

  // 日期时间
  date: ElDatePicker,
  dateRange: markRaw({
    ...ElDatePicker,
    props: { ...ElDatePicker.props, type: { default: 'daterange' } },
  }),
  time: ElTimePicker,
  datetime: markRaw({
    ...ElDatePicker,
    props: { ...ElDatePicker.props, type: { default: 'datetime' } },
  }),
  datetimeRange: markRaw({
    ...ElDatePicker,
    props: { ...ElDatePicker.props, type: { default: 'datetimerange' } },
  }),

  // 上传
  upload: ElUpload,
}

/**
 * 获取字段对应的组件
 * @param fieldType - 字段类型
 * @param customComponent - 自定义组件名称
 * @param component - 指定的组件
 * @returns 组件
 */
export function getFieldComponent(
  fieldType: string,
  customComponent?: string,
  component?: string | [string, Record<string, any>],
): any {
  // 自定义组件
  if (fieldType === 'custom' && customComponent) {
    return customComponent
  }

  // 指定组件名
  if (component) {
    return Array.isArray(component) ? component[0] : component
  }

  // 默认映射
  return fieldComponentMap[fieldType] || ElInput
}
