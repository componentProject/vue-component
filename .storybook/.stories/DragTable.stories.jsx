import DragTable from '@/components/DragTable/index.vue'

/**
 *
 */
const meta = {
  title: 'DragTable',
  component: DragTable,
  args: {},
  parameters: {
    docs: {
      description: {},
    },
  },
  argTypes: {},
}
export default meta

const Template = (args) => ({
  template: `
    <DragTable v-bind="args" />`,
  components: { DragTable },
  setup() {
    return { args }
  },
})

export const dragTable = Template.bind({})
dragTable.args = {
  rowSort: true,
  colSort: true,
  theadData: [
    { title: '姓名', field: 'name', type: 'slot', slots: { edit: 'name' }, concrete: 'select' },
    { title: '年龄', field: 'age' },
    { title: '地址', field: 'address' },
  ],
  tableData: [
    { name: '张三', age: 18, address: '北京' },
    { name: '李四', age: 20, address: '上海' },
    { name: '王五', age: 22, address: '广州' },
  ],
}
