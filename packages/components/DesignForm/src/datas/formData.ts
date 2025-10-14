import { ElCheckbox, ElCheckboxGroup, ElInput, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'

// 表单配置
export const formConfig = {
  size: 'default',
  labelPosition: 'top',
  hideBtns: true,
  items: [
    {
      label: '表单名称',
      field: 'formName',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
      },
      rules: [{ required: true, message: '表单名称不能为空' }],
    },
    {
      label: '表单编码',
      field: 'formCode',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
      },
      rules: [{ required: true, message: '表单编码不能为空' }],
    },
    {
      label: '表单大小',
      field: 'size',
      defaultValue: 'default',
      component: ElSelect,
      props: {
        clearable: true,
        options: [
          { label: '默认', value: 'default' },
          { label: '大型', value: 'large' },
          { label: '小型', value: 'small' },
        ],
      },
    },
    {
      label: '表单布局',
      field: 'layout',
      defaultValue: 'grid',
      component: ElSelect,
      props: {
        clearable: true,
        options: [
          { label: '垂直布局', value: 'grid' },
          { label: '水平布局', value: 'flex' },
        ],
      },
    },
    {
      label: '表单项固定宽度(number|string单位px)',
      field: 'itemWidth',
      defaultValue: '',
      tooltip: '表单水平布局下，设置该属性后，每个表单项的宽度将固定为该值',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
      visible: {
        conditions: [
          {
            field: 'layout',
            value: 'flex',
            type: '=',
          },
        ],
      },
    },
    {
      label: '全局表单项间距',
      field: 'colGap',
      defaultValue: '16px',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
    },
    {
      label: '标签位置',
      field: 'labelPosition',
      defaultValue: 'right',
      component: ElSelect,
      props: {
        clearable: true,
        options: [
          { label: '顶部', value: 'top' },
          { label: '靠左', value: 'left' },
          { label: '靠右', value: 'right' },
        ],
      },
    },
    {
      label: '标签宽度',
      field: 'labelWidth',
      defaultValue: 120,
      component: ElInput,
      props: {
        clearable: true,
      },
    },
    {
      label: '提交按钮显示文字',
      field: 'submitBtnText',
      defaultValue: '确定',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
    },
    {
      label: '取消按钮显示文字',
      field: 'cancelBtnText',
      defaultValue: '取消',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
    },
  ],
}

// 表单item组件配置
export const formItemConfig = {
  size: 'default',
  labelPosition: 'top',
  items: [
    {
      label: '组件类型',
      field: 'component',
      defaultValue: 'ElInput',
      component: ElSelect,
      props: {
        clearable: true,
        placeholder: '请选择组件类型',
        options: [
          { label: '输入框', value: 'ElInput' },
          { label: '多文本框', value: 'ElTextarea' },
          { label: '下拉框', value: 'ElSelect' },
          { label: '多选', value: 'ElCheckboxGroup' },
          { label: '单选', value: 'ElRadioGroup' },
        ],
      },
      rules: [{ required: true, message: '组件类型不能为空' }],
    },
    {
      label: '字段名',
      field: 'label',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 40,
      },
      rules: [{ required: true, message: '字段名不能为空' }],
    },
    {
      label: '字段编码',
      field: 'field',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 40,
      },
      rules: [{ required: true, message: '字段编码不能为空' }],
    },
    {
      label: '默认值',
      field: 'defaultValue',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 40,
      },
    },
    {
      label: '是否必填',
      field: 'required',
      defaultValue: '2',
      component: ElRadioGroup,
      childComp: ElRadio,
      options: [
        {
          label: '是',
          value: '1',
        },
        {
          label: '否',
          value: '2',
        },
      ],
      props: {
        clearable: true,
      },
    },
    {
      label: '验证方式',
      field: 'trigger',
      labelKey: 'label',
      valueKey: 'value',
      component: ElCheckboxGroup,
      childComp: ElCheckbox,
      options: [
        {
          label: 'blur',
          value: 'blur',
        },
        {
          label: 'change',
          value: 'change',
        },
      ],
      props: {
        clearable: true,
      },
    },
    {
      label: '提示信息',
      field: 'tips',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
      },
    },
    {
      label: '长度',
      field: 'length',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
      },
    },
    {
      label: '最小值',
      field: 'min',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
    },
    {
      label: '最大值',
      field: 'max',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
    },
    {
      label: '错误信息',
      field: 'errorTips',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
      },
    },
  ],
}
