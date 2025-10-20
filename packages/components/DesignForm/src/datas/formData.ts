import { ElCheckbox, ElCheckboxGroup, ElInput, ElInputNumber, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'

// 默认的表单配置
export const defaultFormConfig = {
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
      defaultValue: 16,
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
      label: '提交时是否滚动到第一个错误位置',
      field: 'scrollToError',
      defaultValue: true,
      component: ElRadioGroup,
      childComp: ElRadio,
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
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
      label: '隐藏表单按钮组',
      field: 'hideBtns',
      defaultValue: true,
      component: ElRadioGroup,
      childComp: ElRadio,
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
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
      visible: {
        conditions: [
          {
            field: 'hideBtns',
            value: false,
            type: '=',
          },
        ],
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
      visible: {
        conditions: [
          {
            field: 'hideBtns',
            value: false,
            type: '=',
          },
        ],
      },
    },
  ],
}

//表单item组件配置
export const formItemConfig = {
  size: 'default',
  labelPosition: 'top',
  hideBtns: true,
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
          { label: '数字输入框', value: 'ElInputNumber' },
          { label: '下拉框', value: 'ElSelect' },
          { label: '增强下拉框', value: 'TsSelect' },
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
      label: '标签的宽度',
      field: 'labelWidth',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 40,
      },
    },
    {
      label: '表单项固定宽度(水平布局下有效)',
      field: 'itemWidth',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 40,
      },
    },
    {
      label: '表单项响应式宽度',
      field: 'span',
      component: ElInputNumber,
      tooltip: '在水平布局下, 如果设置表单项宽度，响应式宽度将无效',
      tips: '只能输入1-24之间的整数',
      props: {
        clearable: true,
        min: 1,
        max: 24,
        maxheight: 2,
      },
    },
    {
      label: 'tooltip提示',
      field: 'tooltip',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
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
      label: '数据类型',
      field: 'dataType',
      component: ElRadioGroup,
      childComp: ElRadio,
      props: {
        clearable: true,
        maxheight: 40,
      },
      options: [
        {
          label: '静态数据',
          value: false,
        },
        {
          label: '远程数据',
          value: true,
        },
      ],
      rules: [{ required: true, message: '请选择数据类型' }],
      visible: {
        conditions: [
          {
            field: 'component',
            value: 'TsSelect',
            type: '=',
          },
        ],
      },
    },
    // TsSelect 特有配置项
    {
      label: '请求地址(增强下拉框)',
      field: 'requestUrl',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        placeholder: '请输入API接口地址',
      },
      rules: [{ required: true, message: '请输入请求地址' }],
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '请求方法(增强下拉框)',
      field: 'requestMethod',
      defaultValue: 'POST',
      component: ElSelect,
      rules: [{ required: true, message: '请输入请求地址' }],
      props: {
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '请求参数(增强下拉框)',
      field: 'requestParams',
      defaultValue: '{}',
      component: ElInput,
      props: {
        type: 'textarea',
        rows: 3,
        placeholder: 'JSON格式，如：{"page": 1, "size": 10}',
      },
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '显示字段名(增强下拉框)',
      field: 'label',
      defaultValue: 'label',
      component: ElInput,
      props: {
        clearable: true,
      },
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '值字段名(增强下拉框)',
      field: 'value',
      defaultValue: 'value',
      component: ElInput,
      props: {
        clearable: true,
      },
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '响应数据路径(增强下拉框)',
      field: 'responseDataPath',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        placeholder: '如：data.list',
      },
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '静态选项数据(增强下拉框)',
      field: 'options',
      defaultValue: '[]',
      component: ElInput,
      props: {
        type: 'textarea',
        rows: 4,
        placeholder: 'JSON数组格式，如：[{"label": "选项1", "value": "1"}]',
      },
      rules: [{ required: true, message: '请输入静态选项数据' }],
      visible: {
        conditions: [
          {
            field: 'dataType',
            value: false,
            type: '=',
          },
        ],
      },
    },
    {
      label: '长度',
      field: 'maxlength',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
      },
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
      label: '最小值',
      field: 'min',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
      visible: {
        conditions: [
          {
            field: 'component',
            value: 'ElInputNumber',
            type: '=',
          },
        ],
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
      visible: {
        conditions: [
          {
            field: 'component',
            value: 'ElInputNumber',
            type: '=',
          },
        ],
      },
    },
    {
      label: '是否禁用',
      field: 'disabled',
      component: ElRadioGroup,
      childComp: ElRadio,
      props: {
        clearable: true,
        maxheight: 40,
      },
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
    {
      label: '是否必填',
      field: 'required',
      defaultValue: false,
      component: ElRadioGroup,
      childComp: ElRadio,
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
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
      visible: {
        conditions: [
          {
            field: 'required',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '错误信息',
      field: 'message',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
      },
      visible: {
        conditions: [
          {
            field: 'required',
            value: true,
            type: '=',
          },
        ],
      },
    },
    {
      label: '验证规则',
      field: 'validator',
      defaultValue: '',
      component: ElInput,
      props: {
        placeholder: '请输入验证规则，例如：(rule, value, callback, form) => { if (!value) { callback(new Error("该字段不能为空")); } else { callback(); } }',
        type: 'textarea',
        clearable: true,
        rows: 4,
      },
      visible: {
        conditions: [
          {
            field: 'required',
            value: true,
            type: '=',
          },
        ],
      },
    },
  ],
}
