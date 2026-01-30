/**
 * ConfigForm - Element Plus Adapter
 * Element Plus UI 适配器
 */

import type { UIAdapter } from '../types/adapter.ts'
import {
  ArrowDown,
  ArrowUp,
  CopyDocument,
  Delete,
  Plus,
  Rank,
} from '@element-plus/icons-vue'
import {
  ElAlert,
  ElButton,
  ElCard,
  ElCascader,
  ElCheckbox,
  ElCheckboxGroup,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElColorPicker,
  ElDatePicker,
  ElDivider,
  ElEmpty,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElRate,
  ElRow,
  ElSelect,
  ElSkeleton,
  ElSlider,
  ElSwitch,
  ElTabPane,
  ElTabs,
  ElTimePicker,
  ElTooltip,
  ElTreeSelect,
  ElUpload,
} from 'element-plus'
import { defineComponent, h } from 'vue'

/**
 * 创建多行文本组件包装器
 */
const TextareaComponent = defineComponent({
  name: 'ElTextarea',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ElInput, { ...attrs, type: 'textarea' })
  },
})

/**
 * 创建密码输入组件包装器
 */
const PasswordComponent = defineComponent({
  name: 'ElPassword',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ElInput, { ...attrs, type: 'password', showPassword: true })
  },
})

/**
 * 创建日期范围选择器包装器
 */
const DateRangeComponent = defineComponent({
  name: 'ElDateRangePicker',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ElDatePicker, { ...attrs, type: 'daterange' })
  },
})

/**
 * 创建日期时间选择器包装器
 */
const DatetimeComponent = defineComponent({
  name: 'ElDatetimePicker',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ElDatePicker, { ...attrs, type: 'datetime' })
  },
})

/**
 * 创建日期时间范围选择器包装器
 */
const DatetimeRangeComponent = defineComponent({
  name: 'ElDatetimeRangePicker',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ElDatePicker, { ...attrs, type: 'datetimerange' })
  },
})

/**
 * 创建富文本编辑器占位组件
 * 需要用户自行集成实际的富文本编辑器
 */
const RichTextPlaceholder = defineComponent({
  name: 'RichTextPlaceholder',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '请输入内容...' },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h(ElInput, {
      'type': 'textarea',
      'modelValue': props.modelValue,
      'placeholder': props.placeholder,
      'disabled': props.disabled,
      'readonly': props.readonly,
      'rows': 6,
      'onUpdate:modelValue': (val: string) => emit('update:modelValue', val),
      'onChange': (val: string) => emit('change', val),
    })
  },
})

/**
 * 创建代码编辑器占位组件
 * 需要用户自行集成实际的代码编辑器（如 Monaco Editor、CodeMirror）
 */
const CodeEditorPlaceholder = defineComponent({
  name: 'CodeEditorPlaceholder',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '// 请输入代码...' },
    language: { type: String, default: 'javascript' },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h(ElInput, {
      'type': 'textarea',
      'modelValue': props.modelValue,
      'placeholder': props.placeholder,
      'disabled': props.disabled,
      'readonly': props.readonly,
      'rows': 10,
      'style': { fontFamily: 'monospace' },
      'onUpdate:modelValue': (val: string) => emit('update:modelValue', val),
      'onChange': (val: string) => emit('change', val),
    })
  },
})

/**
 * 创建 Element Plus UI 适配器
 * @returns UIAdapter 实例
 */
export function createElementPlusAdapter(): UIAdapter {
  return {
    name: 'element-plus',

    // 字段组件 - 支持简写格式和完整格式
    // 简写：直接传组件（使用 dataTypeMap 的默认值）
    // 完整：{ component, dataType, defaultProps }
    fields: {
      // 字符串类
      input: ElInput,
      textarea: TextareaComponent,
      password: PasswordComponent,
      richText: RichTextPlaceholder,
      codeEditor: CodeEditorPlaceholder,
      color: ElColorPicker,

      // 数字类（完整格式，明确 dataType）
      number: { component: ElInputNumber, dataType: 'number' },
      slider: { component: ElSlider, dataType: 'number' },
      rate: { component: ElRate, dataType: 'number' },

      // 布尔类
      switch: { component: ElSwitch, dataType: 'boolean' },

      // 选择类（灵活类型）
      select: ElSelect,
      cascader: ElCascader,
      treeSelect: ElTreeSelect,
      radio: ElRadioGroup,

      // 数组类（完整格式，明确 dataType）
      multiSelect: { component: ElSelect, dataType: 'array', defaultProps: { multiple: true } },
      checkbox: { component: ElCheckboxGroup, dataType: 'array' },
      dateRange: { component: DateRangeComponent, dataType: 'array' },
      datetimeRange: { component: DatetimeRangeComponent, dataType: 'array' },
      upload: { component: ElUpload, dataType: 'array' },

      // 日期类
      date: { component: ElDatePicker, dataType: 'date' },
      time: ElTimePicker,
      datetime: { component: DatetimeComponent, dataType: 'date' },
    },

    // DataType 默认映射（用于简写格式的兜底）
    dataTypeMap: {
      // 字符串类
      input: 'string',
      textarea: 'string',
      password: 'string',
      richText: 'string',
      codeEditor: 'string',
      color: 'string',
      time: 'string',

      // 选择类（灵活类型，根据具体场景可能不同）
      select: 'any',
      cascader: 'any',
      treeSelect: 'any',
      radio: 'any',

      // 复合类型
      object: 'object',
      array: 'array',

      // 布局类（不产生数据）
      void: 'void',
      group: 'void',
      card: 'void',
      tabs: 'void',
      collapse: 'void',
      divider: 'void',
      alert: 'void',
    },

    // 布局组件
    layout: {
      form: ElForm,
      formItem: ElFormItem,
      row: ElRow,
      col: ElCol,
      card: ElCard,
      collapse: ElCollapse,
      collapseItem: ElCollapseItem,
      tabs: ElTabs,
      tabPane: ElTabPane,
      divider: ElDivider,
      button: ElButton,
      empty: ElEmpty,
      tooltip: ElTooltip,
      skeleton: ElSkeleton,
      alert: ElAlert,
    },

    // 图标组件
    icons: {
      plus: Plus,
      delete: Delete,
      arrowUp: ArrowUp,
      arrowDown: ArrowDown,
      copy: CopyDocument,
      drag: Rank,
    },

    // 反馈组件
    feedback: {
      message: {
        success: (msg: string) => ElMessage.success(msg),
        error: (msg: string) => ElMessage.error(msg),
        warning: (msg: string) => ElMessage.warning(msg),
        info: (msg: string) => ElMessage.info(msg),
      },
      messageBox: {
        confirm: async (options) => {
          try {
            await ElMessageBox.confirm(
              options.message,
              options.title || '提示',
              {
                confirmButtonText: options.confirmText || '确定',
                cancelButtonText: options.cancelText || '取消',
                type: 'warning',
              },
            )
            return true
          }
          catch {
            return false
          }
        },
        alert: async (options) => {
          await ElMessageBox.alert(
            options.message,
            options.title || '提示',
            {
              confirmButtonText: options.confirmText || '确定',
            },
          )
        },
      },
    },

    // Element Plus 属性转换器
    transformer: {
      field: (type, props) => {
        const transformed = { ...props }

        // 处理多选下拉
        if (type === 'multiSelect') {
          transformed.multiple = true
        }

        return transformed
      },
      /**
       * 阅读态样式提取
       * Element Plus 的 Input/Textarea 组件使用 inputStyle 设置内部样式
       * 其他组件使用 style
       */
      readPrettyStyle: (type, componentProps) => {
        const inputTypes = ['input', 'textarea', 'password']
        if (inputTypes.includes(type)) {
          // Element Plus Input: 优先使用 inputStyle，fallback 到 style
          return componentProps.inputStyle || componentProps.style || {}
        }
        // 其他组件直接使用 style
        return componentProps.style || {}
      },
    },

    // Element Plus 功能配置
    features: {
      // Element Plus 使用子组件渲染选项 (ElOption, ElRadio, ElCheckbox)
      optionsAsProps: false,
      // Element Plus FormItem 使用 'prop' 作为字段名属性
      formItemNameProp: 'prop',
      // 选项组件（用于 select/radio/checkbox）
      optionComponents: {
        select: ElOption,
        radio: ElRadio,
        checkbox: ElCheckbox,
      },
    },

    // Element Plus 表单方法
    formMethods: {
      validate: async (formRef) => {
        if (!formRef?.validate) {
          return true
        }
        try {
          await formRef.validate()
          return true
        }
        catch {
          return false
        }
      },
      clearValidate: (formRef, fields) => {
        formRef?.clearValidate?.(fields)
      },
      resetFields: (formRef, fields) => {
        formRef?.resetFields?.(fields)
      },
    },
  }
}

/**
 * 默认 Element Plus 适配器实例
 */
export const elementPlusAdapter = createElementPlusAdapter()
