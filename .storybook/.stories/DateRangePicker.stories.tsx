// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import DateRangePicker from '@/components/DateRangePicker/index.ts'

// 定义元数据
const meta: Meta<typeof DateRangePicker> = {
  title: 'DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: '日期选择类型',
      control: 'select',
      options: ['date', 'daterange', 'datetime', 'datetimerange'],
    },
    format: {
      description: '显示在输入框中的格式',
      control: 'text',
    },
    valueFormat: {
      description: '可选，绑定值的格式，对显示值无效',
      control: 'text',
    },
    placeholder: {
      description: '非范围选择时的占位内容',
      control: 'text',
    },
    startPlaceholder: {
      description: '范围选择时开始日期的占位内容',
      control: 'text',
    },
    endPlaceholder: {
      description: '范围选择时结束日期的占位内容',
      control: 'text',
    },
    rangeSeparator: {
      description: '范围分隔符',
      control: 'text',
    },
    defaultToday: {
      description: '当无选定值时，是否默认返回今天的日期范围',
      control: 'boolean',
    },
    dateRange: {
      description: '设置日期范围，可以是数字或数组',
      control: 'object',
    },
    dateRangeType: {
      description: '日期范围类型',
    },
    defaultDatetimeRange: {
      control: 'object',
    },
    minDate: {
      description: '最小可选日期',
      control: 'text',
    },
    maxDate: {
      description: '最大可选日期',
      control: 'text',
    },
    disabledDateRange: {
      description: '禁用日期范围，格式为 [minDate, maxDate]',
      control: 'object',
    },
    shortcuts: {
      description: '是否显示快速选择选项',
      control: 'boolean',
    },
    dateRangeBaseDate: {
      description: '日期范围的基准日期',
      control: 'text',
    },
    modelValue: {
      control: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

const Template: StoryFn = args => ({
  template: '<DateRangePicker v-bind="args" />',
  components: { DateRangePicker },
  setup() {
    return { args }
  },
})

export const dateRangePicker: Story = Template.bind({})
const props: any = {
  type: 'date',
  format: 'YYYY-MM-DD',
  valueFormat: 'YYYY-MM-DD HH:mm:ss',
  placeholder: '请选择日期',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  rangeSeparator: '至',
  defaultToday: true,
  dateRange: [1, 7],
  dateRangeType: 'day',
  minDate: '2023-01-01',
  maxDate: '2023-12-31',
  disabledDateRange: null,
  defaultDatetimeRange: null,
  shortcuts: true,
  dateRangeBaseDate: '',
  modelValue: [],
}
dateRangePicker.args = props
