import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import DateRangePicker from '@/components/DateRangePicker/index.vue'

// 定义元数据
const meta: Meta<typeof DateRangePicker> = {
  title: 'DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '绑定值，日期范围数组',
      control: 'object',
    },
    type: {
      description: '日期选择类型',
      control: {
        type: 'select',
        options: ['date', 'daterange', 'datetime', 'datetimerange', 'month', 'year', 'week'],
      },
    },
    format: {
      description: '显示在输入框中的格式',
      control: 'text',
    },
    valueFormat: {
      description: '绑定值的格式，对显示值无效',
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
  },
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

// 基础用法 - 单个日期选择
export const 基础用法: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateValue = ref('')

      watch(dateValue, (newVal) => {
        console.log('选择的日期:', newVal)
      })

      return { ...args, dateValue }
    },
    template: `
      <div>
        <h3>基础日期选择器</h3>
        <DateRangePicker
          v-model="dateValue"
          type="date"
          format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
        <div style="margin-top: 16px;">
          <p>选择的日期值: {{ dateValue }}</p>
        </div>
      </div>
    `,
  }),
}

// 日期范围选择
export const 日期范围选择: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      watch(dateRange, (newVal) => {
        console.log('选择的日期范围:', newVal)
      })

      return { ...args, dateRange }
    },
    template: `
      <div>
        <h3>日期范围选择器</h3>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />
        <div style="margin-top: 16px;">
          <p>选择的日期范围: {{ dateRange }}</p>
        </div>
      </div>
    `,
  }),
}

// 带快速选择选项
export const 快速选择选项: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      watch(dateRange, (newVal) => {
        console.log('选择的日期范围:', newVal)
      })

      return { ...args, dateRange }
    },
    template: `
      <div>
        <h3>带快速选择选项的日期范围选择器</h3>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          :quickOptions="true"
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />
        <div style="margin-top: 16px;">
          <p>选择的日期范围: {{ dateRange }}</p>
        </div>
      </div>
    `,
  }),
}

// 默认日期范围
export const 默认日期范围: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      watch(dateRange, (newVal) => {
        console.log('选择的日期范围:', newVal)
      })

      return { ...args, dateRange }
    },
    template: `
      <div>
        <h3>默认日期范围设置</h3>
        <p>设置dateRange为7，表示默认选择今天到未来7天</p>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          :dateRange="7"
          :quickOptions="true"
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />
        <div style="margin-top: 16px;">
          <p>选择的日期范围: {{ dateRange }}</p>
        </div>
      </div>
    `,
  }),
}

// 自定义日期范围
export const 自定义日期范围: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      return { ...args, dateRange }
    },
    template: `
      <div>
        <h3>自定义日期范围</h3>
        <p>设置dateRange为[-7, 7]，表示默认选择过去7天到未来7天</p>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          :dateRange="[-7, 7]"
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />
        <div style="margin-top: 16px;">
          <p>选择的日期范围: {{ dateRange }}</p>
        </div>
      </div>
    `,
  }),
}

// 禁用日期范围
export const 禁用日期范围: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])
      const today = new Date()
      const nextMonth = new Date(today)
      nextMonth.setMonth(today.getMonth() + 1)

      const minDate = today.toISOString().split('T')[0]
      const maxDate = nextMonth.toISOString().split('T')[0]

      return {
        ...args,
        dateRange,
        minDate,
        maxDate,
      }
    },
    template: `
      <div>
        <h3>禁用日期范围</h3>
        <p>只能选择今天到下个月同一天的日期范围</p>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          format="YYYY-MM-DD"
          :minDate="minDate"
          :maxDate="maxDate"
          startPlaceholder="开始日期"
          endPlaceholder="结束日期"
        />
        <div style="margin-top: 16px;">
          <p>选择的日期范围: {{ dateRange }}</p>
          <p>最小可选日期: {{ minDate }}</p>
          <p>最大可选日期: {{ maxDate }}</p>
        </div>
      </div>
    `,
  }),
}
