import EnterNextTable from '../../src/components/EnterNextTable/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import { ref } from 'vue'
import { ElButton, ElInput, ElMessage, ElSelect, ElOption, ElTableColumn } from 'element-plus'

const meta: Meta<any> = {
  title: 'EnterNextTable',
  component: EnterNextTable,
  tags: ['autodocs'],
  argTypes: {},
}

export default meta

export const Basic: StoryFn = () => ({
  components: {
    EnterNextTable,
    ElButton,
    ElInput,
    ElSelect,
    ElOption,
    ElTableColumn,
  },
  setup() {
    // 表格数据
    const tableData = ref([
      { name: '张三', age: '25', gender: '男', address: '北京市朝阳区' },
      { name: '李四', age: '30', gender: '女', address: '上海市浦东新区' },
    ])

    // 添加行
    const addRow = () => {
      tableData.value.push({
        name: '',
        age: '',
        gender: '',
        address: '',
      })
    }

    // 处理到达最后一个输入元素时的操作
    const handleNoNextInput = ({ rowIndex }) => {
      ElMessage.success(`已到达最后一个输入元素！当前行索引: ${rowIndex}`)
      addRow()
    }

    return { tableData, addRow, handleNoNextInput }
  },
  template: `
    <div style="width: 600px;">
      <ElButton type="primary" @click="addRow" style="margin-bottom: 10px;">添加行</ElButton>

      <EnterNextTable
        :data="tableData"
        border
        @no-next-input="handleNoNextInput"
      >
        <ElTableColumn label="姓名" prop="name" width="180">
          <template #default="scope">
            <ElInput v-model="scope.row.name" placeholder="请输入姓名"></ElInput>
          </template>
        </ElTableColumn>

        <ElTableColumn label="性别" prop="gender" width="150">
          <template #default="scope">
            <ElSelect v-model="scope.row.gender" placeholder="请选择性别">
              <ElOption label="男" value="男"></ElOption>
              <ElOption label="女" value="女"></ElOption>
            </ElSelect>
          </template>
        </ElTableColumn>

        <ElTableColumn label="年龄" prop="age" width="120">
          <template #default="scope">
            <ElInput v-model="scope.row.age" placeholder="请输入年龄"></ElInput>
          </template>
        </ElTableColumn>
      </EnterNextTable>
    </div>
  `,
})
