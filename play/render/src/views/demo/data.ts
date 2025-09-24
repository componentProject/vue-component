import { ElInput } from 'element-plus'// 导入自定义组件

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
    items: [
      {
        label: 'ID',
        field: 'id',
        defaultValue: 'just text content',
        type: 'text',
        customClass: 'is-required', // 通过样式类展示必填ico，不直接绑定required属性，会有校验问题
      },
      {
        label: 'Name',
        field: 'name',
        defaultValue: '',
        component: ElInput,
        // labelSlot: "name-label", 默认字段标签名插槽命名规则 [field]-label，也可以自定义
        tooltip: '这是tooltip',
        props: {
          clearable: true,
        },
        rules: [{ required: true, message: '不能为空' }],
      },
      {
        label: 'Age',
        field: 'age',
        component: 'el-input',
        props: {
          type: 'number',
          min: 1,
          max: 9999,
        },
        // events: {
        //   focus: handleNumberFocus,
        //   blur: handleNumberBlur,
        // },
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
        component: 'el-date-picker',
        tooltip: '这是tooltip',
        props: {
          type: 'date',
          format: 'YYYY/MM/DD',
          class: 'w-full',
        },
      },
      {
        label: 'Subject',
        field: 'subject',
        component: 'el-select',
        tooltip: '这是tooltip',
        tips: '这是显眼的tips',
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
        rules: [{ required: true, message: '不能为空' }],
        props: {
          clearable: true,
        },
      },
      {
        label: 'Hobby',
        field: 'hobby',
        component: 'el-checkbox-group',
        labelKey: 'name',
        valueKey: 'id',
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
        defaultValue: ['1'],
        props: {
          clearable: true,
        },
      },
      {
        label: 'Marry',
        field: 'marry',
        component: 'el-radio-group',
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
      },
    ],
  },
}
