import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, reactive } from 'vue'
import Select from '@/components/Select/index.vue'

// 定义元数据
const meta: Meta<typeof Select> = {
  title: 'Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: '下拉框数据',
      control: 'object',
    },
    label: {
      description: '展示下拉框的数据字段名',
      control: 'text',
    },
    value: {
      description: '下拉框选择的值字段名',
      control: 'text',
    },
    clearable: {
      description: '是否可以清空选项',
      control: 'boolean',
    },
    filterable: {
      description: '是否可搜索',
      control: 'boolean',
    },
    filterMethod: {
      description: '自定义搜索方法',
      control: 'object',
    },
    collapseTags: {
      description: '多选时是否将选中值按文字的形式展示',
      control: 'boolean',
    },
    collapseTagsTooltip: {
      description: '当鼠标悬停于折叠标签的文本时，是否显示所有已选中的标签',
      control: 'boolean',
    },
    disabledValues: {
      description: '禁用选项的值数组',
      control: 'object',
    },
    disabledLabels: {
      description: '禁用选项的标签数组',
      control: 'object',
    },
    disabledHandler: {
      description: '自定义禁用选项处理函数',
      control: 'object',
    },
    filterFields: {
      description: '过滤字段数组',
      control: 'object',
    },
    serverProps: {
      description: '远程搜索配置',
      control: 'object',
    },
    tagType: {
      description: '多选标签类型',
      control: { type: 'select', options: ['success', 'info', 'warning', 'danger', 'primary'] },
    },
  },
}

export default meta
type Story = StoryObj<typeof Select>

// 模拟数据
const mockOptions = [
  { value: '1', label: '选项1', pyCode: 'xx1', wbCode: 'xuan1' },
  { value: '2', label: '选项2', pyCode: 'xx2', wbCode: 'xuan2' },
  { value: '3', label: '选项3', pyCode: 'xx3', wbCode: 'xuan3' },
  { value: '4', label: '选项4', pyCode: 'xx4', wbCode: 'xuan4' },
  { value: '5', label: '选项5', pyCode: 'xx5', wbCode: 'xuan5' },
  { value: '6', label: '选项6', pyCode: 'xx6', wbCode: 'xuan6' },
]

// 基础用法
export const 基础用法: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValue = ref('')
      const options = ref(mockOptions)

      return { ...args, selectedValue, options }
    },
    template: `
      <div>
        <h3>基础选择器</h3>
        <Select
          v-model="selectedValue"
          :options="options"
          style="width: 240px"
          placeholder="请选择"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValue }}</p>
        </div>
      </div>
    `,
  }),
}

// 禁用选项
export const 禁用选项: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValue = ref('')
      const options = ref(mockOptions)
      const disabledValues = ref(['2', '4'])

      return {
        ...args,
        selectedValue,
        options,
        disabledValues,
      }
    },
    template: `
      <div>
        <h3>带禁用选项的选择器</h3>
        <p>选项2和选项4被禁用</p>
        <Select
          v-model="selectedValue"
          :options="options"
          :disabledValues="disabledValues"
          style="width: 240px"
          placeholder="请选择"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValue }}</p>
        </div>
      </div>
    `,
  }),
}

// 多选模式
export const 多选模式: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValues = ref([])
      const options = ref(mockOptions)

      return { ...args, selectedValues, options }
    },
    template: `
      <div>
        <h3>多选选择器</h3>
        <Select
          v-model="selectedValues"
          :options="options"
          multiple
          style="width: 300px"
          placeholder="请选择多个选项"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValues }}</p>
        </div>
      </div>
    `,
  }),
}

// 自定义标签折叠
export const 自定义标签折叠: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValues = ref(['1', '3', '5'])
      const options = ref(mockOptions)

      return { ...args, selectedValues, options }
    },
    template: `
      <div>
        <h3>自定义标签折叠</h3>
        <p>默认选中多个值</p>
        <Select
          v-model="selectedValues"
          :options="options"
          multiple
          :collapseTags="true"
          :collapseTagsTooltip="true"
          tagType="success"
          style="width: 300px"
          placeholder="请选择多个选项"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValues }}</p>
        </div>
      </div>
    `,
  }),
}

// 自定义字段名
export const 自定义字段名: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValue = ref('')
      const options = ref([
        { id: '1', name: '自定义选项1' },
        { id: '2', name: '自定义选项2' },
        { id: '3', name: '自定义选项3' },
        { id: '4', name: '自定义选项4' },
      ])

      return { ...args, selectedValue, options }
    },
    template: `
      <div>
        <h3>自定义字段名</h3>
        <p>使用name作为标签字段，id作为值字段</p>
        <Select
          v-model="selectedValue"
          :options="options"
          label="name"
          value="id"
          style="width: 240px"
          placeholder="请选择"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValue }}</p>
        </div>
      </div>
    `,
  }),
}

// 远程搜索
export const 远程搜索: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValue = ref('')
      const serverProps = reactive({
        serverType: 'base',
        optionsParams: { dictName: 'test' },
      })

      return { ...args, selectedValue, serverProps }
    },
    template: `
      <div>
        <h3>远程搜索选择器</h3>
        <p>从服务器获取选项数据</p>
        <Select
          v-model="selectedValue"
          :serverProps="serverProps"
          style="width: 240px"
          placeholder="请选择"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValue }}</p>
        </div>
      </div>
    `,
  }),
}

// 自定义搜索字段
export const 自定义搜索字段: Story = {
  render: (args) => ({
    components: { Select },
    setup() {
      const selectedValue = ref('')
      const options = ref(mockOptions)
      // 自定义额外的搜索字段
      const filterFields = ref(['pyCode', 'wbCode'])

      return {
        ...args,
        selectedValue,
        options,
        filterFields,
      }
    },
    template: `
      <div>
        <h3>自定义搜索字段</h3>
        <p>可以通过拼音码(pyCode)和五笔码(wbCode)进行搜索</p>
        <Select
          v-model="selectedValue"
          :options="options"
          :filterFields="filterFields"
          filterable
          style="width: 240px"
          placeholder="请选择或搜索"
        />
        <div style="margin-top: 16px;">
          <p>选中的值: {{ selectedValue }}</p>
          <p>提示：可以尝试输入"xx"或"xuan"进行搜索</p>
        </div>
      </div>
    `,
  }),
}
