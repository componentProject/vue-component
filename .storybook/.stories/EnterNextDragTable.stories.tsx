// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryFn, StoryObj } from '@storybook/vue3'
import EnterNextDragTable from '@/components/EnterNextDragTable/index.ts'
import { ref } from 'vue'
import { ElButton, ElInput, ElMessage } from 'element-plus'

// 定义元数据
const meta: Meta<typeof EnterNextDragTable> = {
  title: 'EnterNextDragTable',
  component: EnterNextDragTable,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: '表格数据',
      control: false,
    },
    // allowSelectNextInEmpty: {
    //   description: '是否允许在select没有选中值时跳转',
    //   control: 'boolean',
    // }
  },
}

export default meta
type Story = StoryObj<typeof EnterNextDragTable>

const Template: StoryFn = args => ({
  components: { EnterNextDragTable, ElInput, ElButton },
  setup() {
    // 定义表格数据
    const tableData = ref([
      { id: 1, name: '张三', age: 25, address: '北京市海淀区', selected: '选项1' },
      { id: 2, name: '李四', age: 30, address: '上海市浦东新区', selected: '选项2' },
    ])

    // 表格列定义
    const columns = [
      { field: 'id', title: 'ID', width: 80 },
      {
        field: 'name',
        title: '姓名',
        editRender: { name: 'input' },
        width: 120,
      },
      {
        field: 'age',
        title: '年龄',
        editRender: { name: 'input', props: { type: 'number' } },
        width: 100,
      },
      {
        field: 'selected',
        title: '选择',
        editRender: {
          name: 'select',
          options: [
            { label: '选项1', value: '选项1' },
            { label: '选项2', value: '选项2' },
            { label: '选项3', value: '选项3' },
          ],
        },
        width: 120,
      },
    ]

    // 处理在最后一个输入框按下Enter的情况
    const handleNoNextInput = ({ rowIndex }) => {
      ElMessage.info(`在最后一个输入框按下了Enter，当前行：${rowIndex + 1}`)
    }

    // 添加新行
    const addRow = () => {
      const newId
        = tableData.value.length > 0 ? Math.max(...tableData.value.map(item => item.id)) + 1 : 1

      tableData.value.push({
        id: newId,
        name: '',
        age: 0,
        address: '',
        selected: '',
      })
    }

    return { tableData, columns, args, handleNoNextInput, addRow }
  },
  template: `
    <div style="width: 600px;">
      <ElButton type="primary" @click="addRow" style="margin-bottom: 10px;">添加行</ElButton>
      <EnterNextDragTable
        v-model="tableData"
        :columns="columns"
        editable
        @no-next-input="handleNoNextInput"
        style="height: 200px;"
        v-bind="args"
      >
        <template #name="{ row,column }">
          <ElInput v-model="row[column.field]" />
        </template>
        <template #age="{ row,column }">
          <ElInput v-model="row[column.field]" />
        </template>
      </EnterNextDragTable>
    </div>
  `,
})

export const enterNextDragTable: Story = Template.bind({})
enterNextDragTable.args = {
  allowSelectNextInEmpty: false,
}
