import {
  ElCheckbox,
  ElCheckboxGroup,
  ElDatePicker,
  ElInput,
  ElOption,
  ElRadio,
  ElRadioGroup,
  ElSelect,
} from 'element-plus'

export default {
  size: 'default',
  labelPosition: 'right',
  layout: 'flex',

  items: [
    {
      label: 'Name',
      field: 'name',
      defaultValue: '',
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
      field: 'extra',
      defaultCollapsed: true,
      collapsedText: '更多配置',
      labelPosition: 'right',
      collapsedTriggerIndex: true,
      component: '',
      children: [
        {
          label: 'Age3',
          field: 'age3',
          defaultValue: 3,
          component: ElInput,

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
}
