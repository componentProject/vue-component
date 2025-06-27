// noinspection JSUnusedGlobalSymbols

import ConfigForm from '@/components/ConfigForm/index.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
// import type { ConfigFormProps } from '@/components/ConfigForm/types'

/**
 * 基于element-plus的配置化表单,目前只支持el-row布局,未来准备支持flex,grid布局,分别用 layout flex grid区分
 */
const meta: Meta = {
  title: '配置化表单',
  component: ConfigForm,
  // tags: ['!autodocs'],
  args: {},
  argTypes: {
    rows: {
      control: 'object',
    },
    formOptions: {
      control: 'object',
    },
  },
}
export default meta

const Template: StoryFn = ({ rows, formOptions }) => ({
  template: `
    <div style="padding-left: 40px" class="w-full overflow-auto">
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

// 输入类组件
export const input = Template.bind({})
input.args = {
  rows: [
    {
      formItems: [
        {
          type: 'input',
          prop: 'input',
          label: '输入框',
          config: {
            placeholder: '请输入内容',
            clearable: true,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      input: '1',
    },
    rules: {},
  },
} as any

export const inputNumber = Template.bind({})
inputNumber.args = {
  rows: [
    {
      formItems: [
        {
          type: 'inputNumber',
          prop: 'inputNumber',
          label: '数字输入框',
          config: {
            min: 0,
            max: 100,
            step: 1,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      inputNumber: 0,
    },
    rules: {},
  },
} as any

export const autocomplete = Template.bind({})
autocomplete.args = {
  rows: [
    {
      formItems: [
        {
          type: 'autocomplete',
          prop: 'autocomplete',
          label: '自动完成',
          config: {
            placeholder: '请输入内容',
            fetchSuggestions: (queryString: string, cb: (suggestions: string[]) => void) => {
              const results = ['选项1', '选项2', '选项3']
              cb(results.filter((item) => item.includes(queryString)))
            },
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      autocomplete: '',
    },
    rules: {},
  },
} as any

// 选择类组件
export const select = Template.bind({})
select.args = {
  rows: [
    {
      formItems: [
        {
          type: 'select',
          prop: 'select',
          label: '选择器',
          config: {
            placeholder: '请选择',
            options: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' },
              { label: '选项3', value: '3' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      select: '',
    },
    rules: {},
  },
} as any

export const cascader = Template.bind({})
cascader.args = {
  rows: [
    {
      formItems: [
        {
          type: 'cascader',
          prop: 'cascader',
          label: '级联选择器',
          config: {
            placeholder: '请选择',
            options: [
              {
                value: '1',
                label: '选项1',
                children: [
                  { value: '1-1', label: '选项1-1' },
                  { value: '1-2', label: '选项1-2' },
                ],
              },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      cascader: [],
    },
    rules: {},
  },
} as any

export const radioGroup = Template.bind({})
radioGroup.args = {
  rows: [
    {
      formItems: [
        {
          type: 'radioGroup',
          prop: 'radioGroup',
          label: '单选框组',
          config: {
            radios: [
              { label: '选项1', value: '1' },
              { label: '选项2', value: '2' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      radioGroup: '',
    },
    rules: {},
  },
} as any

// 日期时间类组件
export const datePicker = Template.bind({})
datePicker.args = {
  rows: [
    {
      formItems: [
        {
          type: 'datePicker',
          prop: 'datePicker',
          label: '日期选择器',
          config: {
            type: 'date',
            placeholder: '选择日期',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      datePicker: '',
    },
    rules: {},
  },
} as any

export const timePicker = Template.bind({})
timePicker.args = {
  rows: [
    {
      formItems: [
        {
          type: 'timePicker',
          prop: 'timePicker',
          label: '时间选择器',
          config: {
            placeholder: '选择时间',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      timePicker: '',
    },
    rules: {},
  },
} as any

export const timeSelect = Template.bind({})
timeSelect.args = {
  rows: [
    {
      formItems: [
        {
          type: 'timeSelect',
          prop: 'timeSelect',
          label: '时间选择',
          config: {
            placeholder: '选择时间',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      timeSelect: '',
    },
    rules: {},
  },
} as any

// 展示类组件
export const table = Template.bind({})
table.args = {
  rows: [
    {
      formItems: [
        {
          type: 'table',
          prop: 'table',
          label: '表格',
          config: {
            columns: [
              { label: '名称', prop: 'name' },
              { label: '年龄', prop: 'age' },
              { label: '性别', prop: 'sex' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      table: [],
    },
    rules: {},
  },
} as any

export const tree = Template.bind({})
tree.args = {
  rows: [
    {
      formItems: [
        {
          type: 'tree',
          prop: 'tree',
          label: '树形控件',
          config: {
            data: [
              {
                label: '一级 1',
                children: [{ label: '二级 1-1' }],
              },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      tree: [],
    },
    rules: {},
  },
} as any

export const transfer = Template.bind({})
transfer.args = {
  rows: [
    {
      formItems: [
        {
          type: 'transfer',
          prop: 'transfer',
          label: '穿梭框',
          config: {
            data: [
              { key: 1, label: '选项1' },
              { key: 2, label: '选项2' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      transfer: [],
    },
    rules: {},
  },
} as any

export const timeline = Template.bind({})
timeline.args = {
  rows: [
    {
      formItems: [
        {
          type: 'timeline',
          prop: 'timeline',
          label: '时间线',
          config: {
            items: [{ content: '步骤1' }, { content: '步骤2' }],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      timeline: [],
    },
    rules: {},
  },
} as any

// 交互类组件
export const switchComponent = Template.bind({})
switchComponent.args = {
  rows: [
    {
      formItems: [
        {
          type: 'switch',
          prop: 'switch',
          label: '开关',
          config: {
            'active-value': 1,
            'inactive-value': 0,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      switch: 0,
    },
    rules: {},
  },
} as any

export const slider = Template.bind({})
slider.args = {
  rows: [
    {
      formItems: [
        {
          type: 'slider',
          prop: 'slider',
          label: '滑块',
          config: {
            min: 0,
            max: 100,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      slider: 0,
    },
    rules: {},
  },
} as any

export const progress = Template.bind({})
progress.args = {
  rows: [
    {
      formItems: [
        {
          type: 'progress',
          prop: 'progress',
          label: '进度条',
          config: {
            percentage: 50,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      progress: 0,
    },
    rules: {},
  },
} as any

// 其他组件
export const upload = Template.bind({})
upload.args = {
  rows: [
    {
      formItems: [
        {
          type: 'upload',
          prop: 'upload',
          label: '上传',
          config: {
            action: '/upload',
            multiple: true,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      upload: [],
    },
    rules: {},
  },
} as any

export const button = Template.bind({})
button.args = {
  rows: [
    {
      formItems: [
        {
          type: 'button',
          prop: 'button',
          label: '按钮',
          config: {
            type: 'primary',
            text: '提交',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      button: '',
    },
    rules: {},
  },
} as any

export const dropdown = Template.bind({})
dropdown.args = {
  rows: [
    {
      formItems: [
        {
          type: 'dropdown',
          prop: 'dropdown',
          label: '下拉菜单',
          config: {
            items: [
              { label: '选项1', command: '1' },
              { label: '选项2', command: '2' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      dropdown: '',
    },
    rules: {},
  },
} as any

export const collapse = Template.bind({})
collapse.args = {
  rows: [
    {
      formItems: [
        {
          type: 'collapse',
          prop: 'collapse',
          label: '折叠面板',
          config: {
            items: [
              { title: '面板1', content: '内容1' },
              { title: '面板2', content: '内容2' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      collapse: [],
    },
    rules: {},
  },
} as any

export const carousel = Template.bind({})
carousel.args = {
  rows: [
    {
      formItems: [
        {
          type: 'carousel',
          prop: 'carousel',
          label: '走马灯',
          config: {
            items: [
              { title: '标题1', content: '内容1' },
              { title: '标题2', content: '内容2' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      carousel: [],
    },
    rules: {},
  },
} as any

export const tag = Template.bind({})
tag.args = {
  rows: [
    {
      formItems: [
        {
          type: 'tag',
          prop: 'tag',
          label: '标签',
          config: {
            type: 'success',
            text: '标签',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      tag: '',
    },
    rules: {},
  },
} as any

export const rate = Template.bind({})
rate.args = {
  rows: [
    {
      formItems: [
        {
          type: 'rate',
          prop: 'rate',
          label: '评分',
          config: {
            max: 5,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      rate: 0,
    },
    rules: {},
  },
} as any

export const card = Template.bind({})
card.args = {
  rows: [
    {
      formItems: [
        {
          type: 'card',
          prop: 'card',
          label: '卡片',
          config: {
            header: '标题',
            body: '内容',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      card: '',
    },
    rules: {},
  },
} as any

export const breadcrumb = Template.bind({})
breadcrumb.args = {
  rows: [
    {
      formItems: [
        {
          type: 'breadcrumb',
          prop: 'breadcrumb',
          label: '面包屑',
          config: {
            items: [
              { text: '首页', to: '/' },
              { text: '列表', to: '/list' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      breadcrumb: [],
    },
    rules: {},
  },
} as any

export const badge = Template.bind({})
badge.args = {
  rows: [
    {
      formItems: [
        {
          type: 'badge',
          prop: 'badge',
          label: '徽章',
          config: {
            value: 5,
            text: '消息',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      badge: '',
    },
    rules: {},
  },
} as any

export const backtop = Template.bind({})
backtop.args = {
  rows: [
    {
      formItems: [
        {
          type: 'backtop',
          prop: 'backtop',
          label: '回到顶部',
          config: {
            visibilityHeight: 200,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      backtop: '',
    },
    rules: {},
  },
} as any

export const avatar = Template.bind({})
avatar.args = {
  rows: [
    {
      formItems: [
        {
          type: 'avatar',
          prop: 'avatar',
          label: '头像',
          config: {
            src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      avatar: '',
    },
    rules: {},
  },
} as any

export const pagination = Template.bind({})
pagination.args = {
  rows: [
    {
      formItems: [
        {
          type: 'pagination',
          prop: 'pagination',
          label: '分页',
          config: {
            total: 100,
            pageSize: 10,
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      pagination: 1,
    },
    rules: {},
  },
} as any

export const result = Template.bind({})
result.args = {
  rows: [
    {
      formItems: [
        {
          type: 'result',
          prop: 'result',
          label: '结果',
          config: {
            title: '成功',
            subTitle: '操作成功',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      result: '',
    },
    rules: {},
  },
} as any

export const image = Template.bind({})
image.args = {
  rows: [
    {
      formItems: [
        {
          type: 'image',
          prop: 'image',
          label: '图片',
          config: {
            src: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      image: '',
    },
    rules: {},
  },
} as any

export const icon = Template.bind({})
icon.args = {
  rows: [
    {
      formItems: [
        {
          type: 'icon',
          prop: 'icon',
          label: '图标',
          config: {
            name: 'el-icon-edit',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      icon: '',
    },
    rules: {},
  },
} as any

export const link = Template.bind({})
link.args = {
  rows: [
    {
      formItems: [
        {
          type: 'link',
          prop: 'link',
          label: '链接',
          config: {
            text: '链接',
            href: 'https://www.baidu.com',
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      link: '',
    },
    rules: {},
  },
} as any

export const descriptions = Template.bind({})
descriptions.args = {
  rows: [
    {
      formItems: [
        {
          type: 'descriptions',
          prop: 'descriptions',
          label: '描述列表',
          config: {
            items: [
              { label: '名称', content: '张三' },
              { label: '年龄', content: '18' },
            ],
          },
          colConfig: {
            span: 24,
          },
        },
      ],
    },
  ],
  formOptions: {
    labelWidth: '120px',
    required: true,
    model: {
      descriptions: [],
    },
    rules: {},
  },
} as any
