import { ElCheckboxGroup, ElDatePicker, ElInput, ElRadioGroup, ElSelect } from 'element-plus'// 导入自定义组件
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
    dialogProps: {
      title: '个性化列配置1111',
      zIndex: 10000,
    },
    // columndragable: true,
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
    labelPosition: 'right',
    layout: 'flex', // grid、flex
    // editable: false, // 表单是否可编辑 可以用作详情使用
    //disabled: true, // 表单是否禁止编辑
    itemWidth: 400,
    items: [
      {
        label: 'Name',
        field: 'name',
        defaultValue: '',
        component: ElInput,
        tooltip: '这是tooltip',
        itemWidth: 800,
        props: {
          clearable: true,
        },
        rules: [{ required: true, message: '不能为空' }],
      },
      {
        label: 'Age',
        field: 'age',
        defaultValue: 3,
        component: ElInput,
        props: {
          onInput: (val: string) => {
            console.log('onInput111111111', val)
          },
        },
      },
      {
        label: 'Birthday1',
        field: 'birthday1',
        component: ElDatePicker,
        tooltip: '这是tooltip',
        props: {
          type: 'date',
          format: 'YYYY/MM/DD',
        },
      },
      {
        label: 'Subject1',
        field: 'subject1',
        component: ElSelect,
        childComp: ElOption,
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
        type: 'group',
        field: 'extra', // 单纯为了一个唯一值，所以一定要配置，不记录表单数据
        defaultCollapsed: true, // 默认展开/收起
        collapsedText: '更多配置', // ['展开更多配置', '收起更多配置']
        labelPosition: 'right', // ['left', 'right']
        collapsedTriggerIndex: true, // 触发器缩进 - label-position === 'left' / 'right' 需要控制
        component: '',
        children: [
          {
            label: 'Age3',
            field: 'age3',
            defaultValue: 3,
            component: ElInput,
            itemWidth: 200,
            props: {
              change: (val: string) => {
                console.log('change22222222', val)
              },
            },
          },
          {
            label: 'Remark',
            field: 'remark',
            component: 'el-textarea',
            itemWidth: 200,
            props: {
              rows: 4,
              change: (val: string) => {
                console.log('change111111111', val)
              },
            },
          },
          {
            label: 'Birthday',
            field: 'birthday',
            component: ElDatePicker,
            tooltip: '这是tooltip',
            props: {
              type: 'date',
              format: 'YYYY/MM/DD',
            },
          },
          {
            label: 'Subject',
            field: 'subject',
            component: ElSelect,
            childComp: ElOption,
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
            component: ElCheckboxGroup,
            childComp: ElCheckbox,
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
          },
        ],
      },
      {
        label: '随意发挥',
        field: 'easygoing',
        defaultValue: '',
        component: 'el-textarea',
        tooltip: '这是tooltip',
        props: {
          rows: 4,
        },
        rules: [{ required: true, message: '不能为空' }],
      },
    ],
  },
  HisFooter: {
    items: [
      '© 2025 Trasen',
      { text: '官网', link: 'https://example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
      { text: '帮助中心', link: 'https://help.example.com' },
    ],
  },
}
