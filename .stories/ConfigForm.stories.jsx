import ConfigForm from '@/components/ConfigForm'

/**
 * 配置化表单,目前只支持el-row布局,未来准备支持flex,grid布局,分别用 layout flex grid区分
 */
export default {
  title: '配置化表单',
  component: ConfigForm,
  // tags: ['!autodocs'],
  args: {},
  argTypes: {
    rows: {
      control: 'array',
    },
    formOptions: {
      control: 'object',
    },
  },
}

const Template = ({ rows, formOptions }) => ({
  template: `
    <div style="padding-left: 40px" class="flex-1 overflow-auto">
      <config-form :form-options="formOptions" v-model:rows="rows" />
    </div>
  `,
  components: {
    ConfigForm,
  },
  setup() {
    return {
      rows,
      formOptions,
    }
  },
})

export const 基础用法 = Template.bind({})
基础用法.args = {
  rows: [
    {
      formItems: [
        {
          type: 'input',
          prop: 'input',
          label: '输入框',
          config: {},
          colConfig: {
            span: 8,
          },
        },
        {
          type: 'switch',
          prop: 'switch',
          label: 'switch',
          config: {
            'active-value': 1,
            'inactive-value': 0,
          },
          colConfig: {
            span: 8,
            style: {
              width: '40px',
            },
          },
        },
        {
          type: 'InputNumber',
          prop: 'InputNumber',
          label: 'InputNumber',
          renderLabel: ({ label }) => {
            return (
              <el-tooltip placement="top" content="我是标题">
                <span>{label}</span>
              </el-tooltip>
            )
          },
          config: {
            min: 0,
            tooltipConfig: {
              content: '数值越大越靠前',
              placement: 'top',
            },
            placeholder: '请输入排序',
          },
          colConfig: {
            span: 8,
          },
        },
        {
          type: 'input',
          prop: 'textarea',
          label: 'input',
          required: false,
          config: {
            type: 'textarea',
            title: '描述',
            titleWidth: 80,
            placeholder: '请输入描述',
          },
        },
        {
          type: 'select',
          prop: 'select',
          label: 'select',
          config: {
            placeholder: '请输入指令内容',
            options: [
              { label: '1', value: '1' },
              { label: '2', value: '2' },
              { label: '3', value: '3' },
            ],
          },
        },
        {
          type: 'table',
          prop: 'table',
          config: {
            columns: [
              { label: '名称', prop: 'name' },
              { label: '年龄', prop: 'age' },
              { label: '性别', prop: 'sex' },
            ],
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: `80px`,
    required: true,
    model: {
      input: '',
      switch: 1,
      InputNumber: 0,
      textarea: '',
      select: '',
      table: [
        {
          name: '1',
          age: '12',
          sex: '男',
        },
      ],
    },
  },
}
