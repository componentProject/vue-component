/**
 * ConfigForm - Ant Design Vue Adapter
 * Ant Design Vue UI 适配器
 */

import type { UIAdapter } from '../_types/adapter'
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
 * Create datetime picker wrapper for Ant Design Vue
 * 创建日期时间选择器包装器
 */
const DatetimeComponent = defineComponent({
  name: 'ADatetimePicker',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ADatePicker, { ...attrs, showTime: true })
  },
})

/**
 * Create datetime range picker wrapper
 * 创建日期时间范围选择器包装器
 */
const DatetimeRangeComponent = defineComponent({
  name: 'ADatetimeRangePicker',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () => h(ARangePicker, { ...attrs, showTime: true })
  },
})

/**
 * Create color picker wrapper (Ant Design Vue doesn't have built-in color picker)
 * 创建颜色选择器包装器（Ant Design Vue 没有内置颜色选择器）
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
 * Create Ant Design Vue UI adapter
 * 创建 Ant Design Vue UI 适配器
 * @returns UIAdapter instance
 */
export function createAntDesignVueAdapter(): UIAdapter {
  return {
    name: 'ant-design-vue',
    components: {
      fields: {
        input: AInput,
        textarea: ATextarea,
        password: AInputPassword,
        number: AInputNumber,
        select: ASelect,
        multiSelect: ASelect, // Use mode="multiple" prop
        cascader: ACascader,
        treeSelect: ATreeSelect,
        radio: ARadioGroup,
        checkbox: ACheckboxGroup,
        switch: ASwitch,
        slider: ASlider,
        rate: ARate,
        color: ColorPickerComponent,
        date: ADatePicker,
        dateRange: ARangePicker,
        time: ATimePicker,
        datetime: DatetimeComponent,
        datetimeRange: DatetimeRangeComponent,
        upload: AUpload,
      },
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
      icons: {
        plus: PlusOutlined,
        delete: DeleteOutlined,
        arrowUp: ArrowUpOutlined,
        arrowDown: ArrowDownOutlined,
        copy: CopyOutlined,
        drag: HolderOutlined,
      },
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
    },
    // Ant Design Vue props transformer
    transformer: {
      field: (type, props) => {
        const transformed = { ...props }

        // Handle multiSelect - use mode="multiple"
        if (type === 'multiSelect') {
          transformed.mode = 'multiple'
        }

        // Ant Design Vue uses 'placeholder' same as Element Plus
        // But some props naming differ

        // Switch props mapping
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

        // Rate props mapping
        if (type === 'rate') {
          if (props.texts) {
            transformed.tooltips = props.texts
            delete transformed.texts
          }
          if (props.showText !== undefined) {
            // Ant Design Vue Rate doesn't have showText, only tooltips
            delete transformed.showText
          }
        }

        // DatePicker props mapping
        if (type === 'date' || type === 'datetime') {
          if (props.valueFormat) {
            transformed.format = props.valueFormat
            // Keep valueFormat for v-model conversion
          }
        }

        // Select props mapping
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
        // Ant Design Vue FormItem uses 'name' instead of 'prop'
        if (props.prop) {
          transformed.name = props.prop
          delete transformed.prop
        }
        return transformed
      },
    },
  }
}

/**
 * Default Ant Design Vue adapter instance
 * 默认 Ant Design Vue 适配器实例
 */
export const antDesignVueAdapter = createAntDesignVueAdapter()
