/**
 * ConfigForm - Ant Design Vue Adapter
 * Ant Design Vue UI 适配器
 */

import type { Component, PropType } from 'vue'
import type { UIAdapter } from '../types/adapter'
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  HolderOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import {
  Alert as AAlert,
  Button as AButton,
  Card as ACard,
  Cascader as ACascader,
  CheckboxGroup as ACheckboxGroup,
  Col as ACol,
  Collapse as ACollapse,
  CollapsePanel as ACollapsePanel,
  DatePicker as ADatePicker,
  Divider as ADivider,
  Empty as AEmpty,
  Form as AForm,
  FormItem as AFormItem,
  Input as AInput,
  InputNumber as AInputNumber,
  InputPassword as AInputPassword,
  message as AMessage,
  Modal as AModal,
  RadioGroup as ARadioGroup,
  RangePicker as ARangePicker,
  Rate as ARate,
  Row as ARow,
  Select as ASelect,
  Skeleton as ASkeleton,
  Slider as ASlider,
  Switch as ASwitch,
  TabPane as ATabPane,
  Tabs as ATabs,
  Textarea as ATextarea,
  TimePicker as ATimePicker,
  Tooltip as ATooltip,
  TreeSelect as ATreeSelect,
  Upload as AUpload,
} from 'ant-design-vue'
import { defineComponent, h } from 'vue'

/**
 * Create v-model wrapper for Ant Design Vue components
 * Ant Design Vue uses v-model:value instead of v-model
 * 为 Ant Design Vue 组件创建 v-model 包装器
 */
function createVModelWrapper(component: Component, name: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      modelValue: {
        type: [String, Number, Boolean, Array, Object, Date] as PropType<any>,
        default: undefined,
      },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { attrs, emit, slots }) {
      return () => h(component, {
        ...attrs,
        'value': props.modelValue,
        'onUpdate:value': (val: any) => emit('update:modelValue', val),
        'onChange': (val: any) => {
          // 处理不同的事件格式
          const value = val?.target?.value ?? val
          emit('change', value)
        },
      }, slots)
    },
  })
}

/**
 * Create v-model:checked wrapper for Switch/Checkbox
 * 为 Switch/Checkbox 创建 v-model:checked 包装器
 */
function createCheckedWrapper(component: Component, name: string) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { attrs, emit, slots }) {
      return () => h(component, {
        ...attrs,
        'checked': props.modelValue,
        'onUpdate:checked': (val: boolean) => emit('update:modelValue', val),
        'onChange': (val: any) => {
          const value = typeof val === 'boolean' ? val : val?.target?.checked
          emit('change', value)
        },
      }, slots)
    },
  })
}

// 封装组件以兼容 v-model
const WrappedInput = createVModelWrapper(AInput, 'WrappedAInput')
const WrappedTextarea = createVModelWrapper(ATextarea, 'WrappedATextarea')
const WrappedInputPassword = createVModelWrapper(AInputPassword, 'WrappedAInputPassword')
const WrappedInputNumber = createVModelWrapper(AInputNumber, 'WrappedAInputNumber')
const WrappedSelect = createVModelWrapper(ASelect, 'WrappedASelect')
const WrappedCascader = createVModelWrapper(ACascader, 'WrappedACascader')
const WrappedTreeSelect = createVModelWrapper(ATreeSelect, 'WrappedATreeSelect')
const WrappedRadioGroup = createVModelWrapper(ARadioGroup, 'WrappedARadioGroup')
const WrappedCheckboxGroup = createVModelWrapper(ACheckboxGroup, 'WrappedACheckboxGroup')
const WrappedSwitch = createCheckedWrapper(ASwitch, 'WrappedASwitch')
const WrappedSlider = createVModelWrapper(ASlider, 'WrappedASlider')
const WrappedRate = createVModelWrapper(ARate, 'WrappedARate')
const WrappedTimePicker = createVModelWrapper(ATimePicker, 'WrappedATimePicker')
const WrappedDatePicker = createVModelWrapper(ADatePicker, 'WrappedADatePicker')
const WrappedRangePicker = createVModelWrapper(ARangePicker, 'WrappedARangePicker')

/**
 * 创建日期时间选择器包装器
 * Ant Design Vue 需要设置 showTime 来启用时间选择
 */
const DatetimeComponent = defineComponent({
  name: 'ADatetimePicker',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number, Object, Date] as PropType<any>,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    return () => h(ADatePicker, {
      ...attrs,
      'showTime': true,
      'value': props.modelValue,
      'onUpdate:value': (val: any) => emit('update:modelValue', val),
      'onChange': (val: any) => emit('change', val),
    })
  },
})

/**
 * 创建日期时间范围选择器包装器
 * Ant Design Vue 需要设置 showTime 来启用时间选择
 */
const DatetimeRangeComponent = defineComponent({
  name: 'ADatetimeRangePicker',
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array as PropType<any[]>,
      default: undefined,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { attrs, emit }) {
    return () => h(ARangePicker as any, {
      ...attrs,
      'showTime': true,
      'value': props.modelValue,
      'onUpdate:value': (val: any) => emit('update:modelValue', val),
      'onChange': (val: any) => emit('change', val),
    })
  },
})

/**
 * 创建颜色选择器包装器
 * Ant Design Vue 没有内置颜色选择器，使用原生 input[type=color] 实现
 */
const ColorPickerComponent = defineComponent({
  name: 'AColorPicker',
  inheritAttrs: false,
  props: {
    value: String,
    modelValue: String,
  },
  emits: ['update:value', 'update:modelValue', 'change'],
  setup(props, { emit, attrs }) {
    return () => h('input', {
      ...attrs,
      type: 'color',
      value: props.modelValue || props.value || '#000000',
      style: {
        width: '100%',
        height: '32px',
        padding: '4px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        cursor: 'pointer',
      },
      onInput: (e: Event) => {
        const value = (e.target as HTMLInputElement).value
        emit('update:value', value)
        emit('update:modelValue', value)
        emit('change', value)
      },
    })
  },
})

/**
 * 创建富文本编辑器占位组件
 * 需要用户自行集成实际的富文本编辑器
 */
const RichTextPlaceholder = defineComponent({
  name: 'ARichTextPlaceholder',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '请输入内容...' },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    return () => h(ATextarea, {
      'value': props.modelValue,
      'placeholder': props.placeholder,
      'disabled': props.disabled,
      'readonly': props.readonly,
      'rows': 6,
      'onUpdate:value': (val: string) => emit('update:modelValue', val),
      'onChange': (e: any) => emit('change', e?.target?.value ?? e),
    })
  },
})

/**
 * 创建代码编辑器占位组件
 * 需要用户自行集成实际的代码编辑器（如 Monaco Editor、CodeMirror）
 */
const CodeEditorPlaceholder = defineComponent({
  name: 'ACodeEditorPlaceholder',
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
    return () => h(ATextarea, {
      'value': props.modelValue,
      'placeholder': props.placeholder,
      'disabled': props.disabled,
      'readonly': props.readonly,
      'rows': 10,
      'style': { fontFamily: 'monospace' },
      'onUpdate:value': (val: string) => emit('update:modelValue', val),
      'onChange': (e: any) => emit('change', e?.target?.value ?? e),
    })
  },
})

/**
 * 创建 Ant Design Vue UI 适配器
 * @returns UIAdapter 实例
 */
export function createAntDesignVueAdapter(): UIAdapter {
  return {
    name: 'ant-design-vue',

    // 字段组件 - key 就是 type
    fields: {
      input: WrappedInput,
      textarea: WrappedTextarea,
      password: WrappedInputPassword,
      number: WrappedInputNumber,
      select: WrappedSelect,
      multiSelect: WrappedSelect, // 使用 mode="multiple" 属性
      cascader: WrappedCascader,
      treeSelect: WrappedTreeSelect,
      radio: WrappedRadioGroup,
      checkbox: WrappedCheckboxGroup,
      switch: WrappedSwitch,
      slider: WrappedSlider,
      rate: WrappedRate,
      color: ColorPickerComponent,
      date: WrappedDatePicker,
      dateRange: WrappedRangePicker,
      time: WrappedTimePicker,
      datetime: DatetimeComponent,
      datetimeRange: DatetimeRangeComponent,
      upload: AUpload,
      richText: RichTextPlaceholder,
      codeEditor: CodeEditorPlaceholder,
    },

    // 布局组件
    layout: {
      form: AForm,
      formItem: AFormItem,
      row: ARow,
      col: ACol,
      card: ACard,
      collapse: ACollapse,
      collapseItem: ACollapsePanel,
      tabs: ATabs,
      tabPane: ATabPane,
      divider: ADivider,
      button: AButton,
      empty: AEmpty,
      tooltip: ATooltip,
      skeleton: ASkeleton,
      alert: AAlert,
    },

    // 图标组件
    icons: {
      plus: PlusOutlined,
      delete: DeleteOutlined,
      arrowUp: ArrowUpOutlined,
      arrowDown: ArrowDownOutlined,
      copy: CopyOutlined,
      drag: HolderOutlined,
    },

    // 反馈组件
    feedback: {
      message: {
        success: (msg: string) => AMessage.success(msg),
        error: (msg: string) => AMessage.error(msg),
        warning: (msg: string) => AMessage.warning(msg),
        info: (msg: string) => AMessage.info(msg),
      },
      messageBox: {
        confirm: async (options) => {
          return new Promise((resolve) => {
            AModal.confirm({
              title: options.title || '提示',
              content: options.message,
              okText: options.confirmText || '确定',
              cancelText: options.cancelText || '取消',
              onOk: () => resolve(true),
              onCancel: () => resolve(false),
            })
          })
        },
        alert: async (options) => {
          return new Promise((resolve) => {
            AModal.info({
              title: options.title || '提示',
              content: options.message,
              okText: options.confirmText || '确定',
              onOk: () => resolve(),
            })
          })
        },
      },
    },
    // Ant Design Vue 属性转换器
    transformer: {
      field: (type, props) => {
        const transformed = { ...props }

        // 处理多选下拉 - 使用 mode="multiple"
        if (type === 'multiSelect') {
          transformed.mode = 'multiple'
        }

        // Ant Design Vue 的 placeholder 与 Element Plus 相同
        // 但某些属性命名不同

        // Switch 属性映射
        if (type === 'switch') {
          if (props.activeText) {
            transformed.checkedChildren = props.activeText
            delete transformed.activeText
          }
          if (props.inactiveText) {
            transformed.unCheckedChildren = props.inactiveText
            delete transformed.inactiveText
          }
        }

        // Rate 属性映射
        if (type === 'rate') {
          if (props.texts) {
            transformed.tooltips = props.texts
            delete transformed.texts
          }
          if (props.showText !== undefined) {
            // Ant Design Vue Rate 没有 showText，只有 tooltips
            delete transformed.showText
          }
        }

        // DatePicker 属性映射
        // Ant Design Vue DatePicker 需要 valueFormat 来接受字符串值
        if (type === 'date' || type === 'datetime' || type === 'dateRange' || type === 'datetimeRange' || type === 'time') {
          // 如果用户没有配置 valueFormat，自动设置默认值
          if (!props.valueFormat) {
            if (type === 'date' || type === 'dateRange') {
              transformed.valueFormat = 'YYYY-MM-DD'
            }
            else if (type === 'datetime' || type === 'datetimeRange') {
              transformed.valueFormat = 'YYYY-MM-DD HH:mm:ss'
            }
            else if (type === 'time') {
              transformed.valueFormat = 'HH:mm:ss'
            }
          }
          // 如果有 valueFormat，同时设置 format（显示格式）
          if (props.valueFormat) {
            transformed.format = props.valueFormat
          }
        }

        // Select 属性映射
        if (type === 'select' || type === 'multiSelect') {
          if (props.filterable !== undefined) {
            transformed.showSearch = props.filterable
            delete transformed.filterable
          }
        }

        return transformed
      },
      formItem: (props) => {
        const transformed = { ...props }
        // Ant Design Vue FormItem 使用 'name' 而非 'prop'
        // 注意：'name' 已在 computedFormItemProps 中以正确的数组格式设置
        if (props.prop) {
          delete transformed.prop
        }
        return transformed
      },
      /**
       * 阅读态样式提取
       * Ant Design Vue 组件直接使用 style prop
       */
      readPrettyStyle: (_type, componentProps) => {
        // Ant Design Vue 所有组件统一使用 style
        return componentProps.style || {}
      },
    },
    // Ant Design Vue 功能配置
    features: {
      // Ant Design Vue 使用 options 属性而非子组件
      optionsAsProps: true,
      // Ant Design Vue FormItem 使用 'name' 作为字段名属性
      formItemNameProp: 'name',
      // Ant Design Vue 使用 layout + labelCol 布局属性
      formLayoutStyle: 'antd',
    },
    // Ant Design Vue 表单方法
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
        // Ant Design Vue 使用 clearValidate 配合字段名
        formRef?.clearValidate?.(fields)
      },
      resetFields: (formRef, fields) => {
        // Ant Design Vue 使用 resetFields 配合字段名
        formRef?.resetFields?.(fields)
      },
    },
  }
}

/**
 * Default Ant Design Vue adapter instance
 * 默认 Ant Design Vue 适配器实例
 */
export const antDesignVueAdapter = createAntDesignVueAdapter()
