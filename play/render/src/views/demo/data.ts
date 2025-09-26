import { ElCheckboxGroup, ElDatePicker, ElInput, ElInputNumber, ElRadioGroup, ElSelect } from 'element-plus'// 导入自定义组件
import { ElCheckbox, ElOption, ElRadio } from 'element-plus'

const statusMap = {
  1: '一',
  2: '二',
  3: '三',
}

export default {
  DraggableTable: {
    // 基础数据
    columns: [
      { type: 'seq', title: '', width: 60 },
      { field: 'id', title: 'ID', width: 60, formatter: ({ row }) => {
        return statusMap[row.id] || row
      }, filterFormatter: ({ value }) => {
        return statusMap[value] || value
      } },
      { field: 'name', title: '姓名', width: 120 },
      { field: 'age', title: '年龄', sortable: true },
      {
        field: 'age1',
        title: '测试',
        sortable: true,
        children: [
          { field: 'age11', title: '测试一级1', sortable: true, children: [
            { field: 'age111', title: '测试二级1', sortable: true },
            { field: 'age112', title: '测试二级2', sortable: true },
            { field: 'age113', title: '测试二级3', sortable: true },
          ] },
          { field: 'age12', title: '测试一级2', sortable: true },
        ],
      },
      {
        field: 'action',
        align: 'center',
        title: '操作',
        width: 110,
        slots: {
          default: 'action',
        },
      },
    ],
    tableData: [
      { id: 1, name: '张三', age: '' },
      { id: 2, name: '李四', age: '' },
      { id: 3, name: '王五', age: '18' },
    ],
    id: '123456789321',
    pageId: '123456789321321',
    userId: '123456789321',
    filterable: true,
    resizable: true,
    saveType: 'server',
    isConfiguration: true,
    columndragable: true,
    // 数据绑定配置
    bindings: ['v-model=tableData'],
  },
  TsButton: {
    showType: 'disabled',
    content: '莫',
    disabled: true,
  },
  ReForm: {
    size: 'default',
    labelWidth: 100,
    labelPosition: 'right',
    Change: (formData: any) => {
      console.log('表单值发生变化', formData)
    },
    // editable: false, // 表单是否可编辑 可以用作详情使用
    // disabled: true, // 表单是否禁止编辑
    items: [
      {
        label: 'ID',
        field: 'id',
        defaultValue: 'just text content',
        type: 'text',
      },
      {
        label: 'slot',
        field: 'slot',
        defaultValue: 'slot text',
        labelSlot: 'slot-label',
        slot: 'slotControl',
        component: '',
      },
      {
        label: 'Name',
        field: 'name',
        defaultValue: '测试数据',
        component: ElInput,
        tooltip: '这是tooltip',
        props: {
          clearable: true,
        },
        rules: [{ required: true, message: '不能为空' }],
      },
      {
        label: 'Age',
        field: 'age',
        component: ElInputNumber,
        defaultValue: 1,
        props: {
          min: 1,
          max: 9999,
        },
      },
      {
        label: 'Remark',
        field: 'remark',
        component: 'el-textarea',
        props: {
          rows: 4,
        },
      },
      {
        label: 'Birthday',
        field: 'birthday',
        component: ElDatePicker,
        tooltip: '这是tooltip',
        props: {
          type: 'date',
          format: 'YYYY-MM-DD',
          class: 'w-full',
        },
      },
      {
        label: 'Subject',
        field: 'subject',
        component: ElSelect,
        childComp: ElOption,
        tooltip: '这是tooltip',
        tips: '这是说明或者提示',
        rules: [{ required: true, message: '不能为空' }],
        options: [
          {
            label: 'Subject1',
            value: '1',
          },
          {
            label: 'Subject2',
            value: '2',
          },
          {
            label: 'Subject3',
            value: '3',
          },
        ],
        props: {
          clearable: true,
        },
      },
      {
        label: 'Hobby',
        field: 'hobby',
        component: ElCheckboxGroup,
        childComp: ElCheckbox,
        labelKey: 'name',
        valueKey: 'id',
        defaultValue: ['1'],
        options: [
          {
            name: 'hobby1',
            id: '1',
          },
          {
            name: 'hobby2',
            id: '2',
          },
          {
            name: 'hobby3',
            id: '3',
          },
        ],
        props: {
          clearable: true,
        },
      },
      {
        label: 'Hobby2',
        field: 'hobby2',
        component: ElCheckboxGroup,
        childComp: ElCheckbox,
        labelKey: 'name',
        valueKey: 'id',
        defaultValue: ['1'],
        options: [
          {
            name: 'hobby1',
            id: '1',
          },
          {
            name: 'hobby2',
            id: '2',
          },
          {
            name: 'hobby3',
            id: '3',
          },
        ],
        props: {
          clearable: true,
          disabled: true,
        },
      },
      {
        label: 'Marry',
        field: 'marry',
        component: ElRadioGroup,
        childComp: ElRadio,
        options: [
          {
            label: 'married',
            value: '1',
          },
          {
            label: 'none',
            value: '2',
          },
        ],
        defaultValue: '2',
        props: {
          clearable: true,
        },
        visible: {
          type: '|',
          conditions: [
            {
              field: 'age',
              value: 2,
              type: '=',
            },
            {
              field: 'age',
              value: 3,
              type: '=',
            },
          ],
        },
      },
    ],
  },
}
