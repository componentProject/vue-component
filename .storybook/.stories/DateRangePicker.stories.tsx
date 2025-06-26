import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import moment from 'moment'
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
      control: { type: 'select', options: ['date', 'daterange'] },
      defaultValue: 'daterange',
    },
    format: {
      description: '显示在输入框中的格式',
      control: 'text',
      defaultValue: 'YYYY-MM-DD',
    },
    valueFormat: {
      description: '可选，绑定值的格式，对显示值无效',
      control: 'text',
      defaultValue: 'YYYY-MM-DD HH:mm:ss',
    },
    placeholder: {
      description: '非范围选择时的占位内容',
      control: 'text',
      defaultValue: '请选择日期',
    },
    startPlaceholder: {
      description: '范围选择时开始日期的占位内容',
      control: 'text',
      defaultValue: '开始日期',
    },
    endPlaceholder: {
      description: '范围选择时结束日期的占位内容',
      control: 'text',
      defaultValue: '结束日期',
    },
    rangeSeparator: {
      description: '范围分隔符',
      control: 'text',
      defaultValue: '至',
    },
    defaultToday: {
      description: '当无选定值时，是否默认返回今天的日期范围',
      control: 'boolean',
      defaultValue: false,
    },
    dateRange: {
      description: '设置日期范围，可以是数字或数组',
      control: 'object',
    },
    dateRangeType: {
      description: '日期范围类型',
      control: { type: 'select', options: ['day', 'week', 'month', 'year'] },
      defaultValue: 'day',
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
      defaultValue: false,
    },
  },
}

export default meta
type Story = StoryObj<typeof DateRangePicker>

// 基础用法
export const 基础用法: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      return { ...args, dateRange }
    },
    template: `
      <div style="width: 500px; padding: 20px;">
        <h3>基础用法</h3>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          style="width: 100%"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ dateRange }}</p>
        </div>
      </div>
    `,
  }),
}

// 默认返回今天
export const 默认返回今天: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      return { ...args, dateRange }
    },
    template: `
      <div style="width: 500px; padding: 20px;">
        <h3>默认返回今天</h3>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          :defaultToday="true"
          style="width: 100%"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ dateRange }}</p>
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
      const dateRange1 = ref([])
      const dateRange2 = ref([])
      const dateRange3 = ref([])
      const dateRange4 = ref([])

      return { ...args, dateRange1, dateRange2, dateRange3, dateRange4 }
    },
    template: `
      <div style="width: 500px; padding: 20px;">
        <h3>自定义日期范围</h3>
        <div style="margin-bottom: 20px;">
          <p>dateRange=7（今天到未来7天）</p>
          <DateRangePicker
            v-model="dateRange1"
            type="daterange"
            :dateRange="7"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange1 }}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p>dateRange=-7（过去7天到今天）</p>
          <DateRangePicker
            v-model="dateRange2"
            type="daterange"
            :dateRange="-7"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange2 }}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p>dateRange=[-7, 7]（过去7天到未来7天）</p>
          <DateRangePicker
            v-model="dateRange3"
            type="daterange"
            :dateRange="[-7, 7]"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange3 }}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p>基于昨天的过去7天到今天</p>
          <DateRangePicker
            v-model="dateRange4"
            type="daterange"
            :dateRangeBaseDate="moment().subtract(1, 'days')"
            :dateRange="-7"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange4 }}</p>
          </div>
        </div>
      </div>
    `,
  }),
}

// 禁用日期
export const 禁用日期: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange1 = ref([])
      const dateRange2 = ref([])
      const dateRange3 = ref([])

      const today = moment().format('YYYY-MM-DD')
      const futureWeek = moment().add(7, 'days').format('YYYY-MM-DD')

      return { ...args, dateRange1, dateRange2, dateRange3, today, futureWeek }
    },
    template: `
      <div style="width: 500px; padding: 20px;">
        <h3>禁用日期</h3>
        <div style="margin-bottom: 20px;">
          <p>minDate（今天之前的日期禁用）</p>
          <DateRangePicker
            v-model="dateRange1"
            type="daterange"
            :minDate="today"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange1 }}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p>maxDate（今天之后的日期禁用）</p>
          <DateRangePicker
            v-model="dateRange2"
            type="daterange"
            :maxDate="today"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange2 }}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p>disabledDateRange（只允许选择未来7天内的日期）</p>
          <DateRangePicker
            v-model="dateRange3"
            type="daterange"
            :disabledDateRange="[today, futureWeek]"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange3 }}</p>
          </div>
        </div>
      </div>
    `,
  }),
}

// 快速选择选项
export const 快速选择选项: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange = ref([])

      return { ...args, dateRange }
    },
    template: `
      <div style="width: 500px; padding: 20px;">
        <h3>快速选择选项</h3>
        <DateRangePicker
          v-model="dateRange"
          type="daterange"
          :shortcuts="true"
          style="width: 100%"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ dateRange }}</p>
        </div>
      </div>
    `,
  }),
}

// 尺寸和禁用
export const 尺寸和禁用: Story = {
  render: (args) => ({
    components: { DateRangePicker },
    setup() {
      const dateRange1 = ref([])
      const dateRange2 = ref([])

      return { ...args, dateRange1, dateRange2 }
    },
    template: `
      <div style="width: 500px; padding: 20px;">
        <h3>尺寸和禁用</h3>
        <div style="margin-bottom: 20px;">
          <p>小尺寸</p>
          <DateRangePicker
            v-model="dateRange1"
            type="daterange"
            size="small"
            style="width: 100%"
          />
        </div>

        <div style="margin-bottom: 20px;">
          <p>禁用状态</p>
          <DateRangePicker
            v-model="dateRange2"
            type="daterange"
            :disabled="true"
            :defaultToday="true"
            style="width: 100%"
          />
          <div style="margin-top: 8px;">
            <p>选中的值: {{ dateRange2 }}</p>
          </div>
        </div>
      </div>
    `,
  }),
}
