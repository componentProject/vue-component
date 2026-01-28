/**
 * ConfigForm - Element Plus Adapter
 * Element Plus UI 适配器
 */

import type { UIAdapter } from '../_types/adapter'
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
 * Create textarea component wrapper
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
 * Create password component wrapper
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
 * Create date range picker wrapper
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
 * Create datetime picker wrapper
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
 * Create datetime range picker wrapper
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
 * Create rich text editor placeholder wrapper
 * 创建富文本编辑器占位组件（需要用户自行集成）
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
      type: 'textarea',
      modelValue: props.modelValue,
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readonly,
      rows: 6,
      'onUpdate:modelValue': (val: string) => emit('update:modelValue', val),
      onChange: (val: string) => emit('change', val),
    })
  },
})

/**
 * Create code editor placeholder wrapper
 * 创建代码编辑器占位组件（需要用户自行集成）
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
      type: 'textarea',
      modelValue: props.modelValue,
      placeholder: props.placeholder,
      disabled: props.disabled,
      readonly: props.readonly,
      rows: 10,
      style: { fontFamily: 'monospace' },
      'onUpdate:modelValue': (val: string) => emit('update:modelValue', val),
      onChange: (val: string) => emit('change', val),
    })
  },
})

/**
 * Create Element Plus UI adapter
 * 创建 Element Plus UI 适配器
 * @returns UIAdapter instance
 */
export function createElementPlusAdapter(): UIAdapter {
  return {
    name: 'element-plus',
    components: {
      fields: {
        input: ElInput,
        textarea: TextareaComponent,
        password: PasswordComponent,
        number: ElInputNumber,
        select: ElSelect,
        multiSelect: ElSelect, // Use multiple prop
        cascader: ElCascader,
        treeSelect: ElTreeSelect,
        radio: ElRadioGroup,
        checkbox: ElCheckboxGroup,
        switch: ElSwitch,
        slider: ElSlider,
        rate: ElRate,
        color: ElColorPicker,
        date: ElDatePicker,
        dateRange: DateRangeComponent,
        time: ElTimePicker,
        datetime: DatetimeComponent,
        datetimeRange: DatetimeRangeComponent,
        upload: ElUpload,
        richText: RichTextPlaceholder,
        codeEditor: CodeEditorPlaceholder,
      },
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
      icons: {
        plus: Plus,
        delete: Delete,
        arrowUp: ArrowUp,
        arrowDown: ArrowDown,
        copy: CopyDocument,
        drag: Rank,
      },
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
    },
    // Element Plus is the baseline, no transformation needed
    transformer: {
      field: (type, props) => {
        const transformed = { ...props }

        // Handle multiSelect
        if (type === 'multiSelect') {
          transformed.multiple = true
        }

        return transformed
      },
    },
    // Element Plus features configuration
    features: {
      // Element Plus uses children for options (ElOption, ElRadio, ElCheckbox)
      optionsAsProps: false,
      // Element Plus FormItem uses 'prop' for field name
      formItemNameProp: 'prop',
      // Option components for select/radio/checkbox
      optionComponents: {
        select: ElOption,
        radio: ElRadio,
        checkbox: ElCheckbox,
      },
    },
    // Element Plus form methods
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
 * Default Element Plus adapter instance
 * 默认 Element Plus 适配器实例
 */
export const elementPlusAdapter = createElementPlusAdapter()
