// 导入所需组件
import { ElInput, ElInputNumber } from 'element-plus'

// 表单配置相关常量定义
// 可复用的选项列表
const COMMON_OPTIONS = {
  // 表单大小选项
  formSizeOptions: [
    { label: '默认', value: 'default' },
    { label: '大型', value: 'large' },
    { label: '小型', value: 'small' },
  ],
  // 表单布局选项
  formLayoutOptions: [
    { label: '垂直布局', value: 'grid' },
    { label: '水平布局', value: 'flex' },
  ],
  // 标签位置选项
  labelPositionOptions: [
    { label: '顶部', value: 'top' },
    { label: '靠左', value: 'left' },
    { label: '靠右', value: 'right' },
  ],
  // 布尔值选项
  booleanOptions: [
    { label: '是', value: true },
    { label: '否', value: false },
  ],
  // 请求方法选项
  requestMethodOptions: [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' },
  ],
  // 组件类型选项
  componentTypeOptions: [
    { label: '输入框', value: 'ElInput' },
    { label: '多文本框', value: 'ElTextarea' },
    { label: '数字输入框', value: 'ElInputNumber' },
    { label: '下拉框', value: 'TsSelect' },
    { label: '多选', value: 'TsCheckbox' },
    { label: '单选', value: 'TsRadio' },
  ],
  // 验证触发方式选项
  validatorTriggerOptions: [
    { label: 'blur', value: 'blur' },
    { label: 'change', value: 'change' },
  ],
}

// 可复用的可见性条件
const VISIBILITY_CONDITIONS = {
  // 基于表单布局的可见性条件
  layoutFlexCondition: {
    conditions: [
      { field: 'layout', value: 'flex', type: '=' },
    ],
  },
  // 基于隐藏按钮状态的可见性条件
  showButtonCondition: {
    conditions: [
      { field: 'hideBtns', value: false, type: '=' },
    ],
  },
  // 基于数据类型为远程数据的可见性条件
  remoteDataTypeCondition: {
    conditions: [
      { field: 'dataType', value: true, type: '=' },
    ],
  },
  // 基于数据类型为静态数据的可见性条件
  staticDataTypeCondition: {
    conditions: [
      { field: 'dataType', value: false, type: '=' },
    ],
  },
  // 基于是否必填的可见性条件
  requiredFieldCondition: {
    conditions: [
      { field: 'required', value: true, type: '=' },
    ],
  },
  // 基于组件类型的可见性条件 (用于选项类组件)
  optionComponentCondition: {
    type: '|',
    conditions: [
      { field: 'component', value: 'TsSelect', type: '=' },
      { field: 'component', value: 'TsCheckbox', type: '=' },
      { field: 'component', value: 'TsRadio', type: '=' },
    ],
  },
  // 基于组件类型为数字输入框的可见性条件
  inputNumberComponentCondition: {
    conditions: [
      { field: 'component', value: 'ElInputNumber', type: '=' },
    ],
  },
}

/**
 * 默认的表单配置
 * 用于设计表单时的基础设置
 */
export const defaultFormConfig = {
  size: 'default',
  labelPosition: 'top',
  hideBtns: true,
  items: [
    // 基本信息
    {
      label: '表单名称',
      field: 'formName',
      defaultValue: '',
      component: ElInput,
      props: { clearable: true },
      rules: [{ required: true, message: '表单名称不能为空' }],
    },
    {
      label: '表单编码',
      field: 'formCode',
      defaultValue: '',
      component: ElInput,
      props: { clearable: true },
      rules: [{ required: true, message: '表单编码不能为空' }],
    },
    // 布局设置
    {
      label: '表单大小',
      field: 'size',
      defaultValue: 'default',
      component: 'TsSelect',
      props: {
        clearable: true,
        options: COMMON_OPTIONS.formSizeOptions,
      },
    },
    {
      label: '表单布局',
      field: 'layout',
      defaultValue: 'grid',
      component: 'TsSelect',
      props: {
        clearable: true,
        options: COMMON_OPTIONS.formLayoutOptions,
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
      visible: VISIBILITY_CONDITIONS.layoutFlexCondition,
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
    // 标签设置
    {
      label: '标签位置',
      field: 'labelPosition',
      defaultValue: 'right',
      component: 'TsSelect',
      props: {
        clearable: true,
        options: COMMON_OPTIONS.labelPositionOptions,
      },
    },
    {
      label: '标签宽度',
      field: 'labelWidth',
      defaultValue: 120,
      component: ElInput,
      props: { clearable: true },
    },
    // 行为设置
    {
      label: '提交时是否滚动到第一个错误位置',
      field: 'scrollToError',
      defaultValue: true,
      component: 'TsRadio',
      props: {
        options: COMMON_OPTIONS.booleanOptions,
      },
    },
    // 按钮设置
    {
      label: '隐藏表单按钮组',
      field: 'hideBtns',
      defaultValue: true,
      component: 'TsRadio',
      props: {
        options: COMMON_OPTIONS.booleanOptions,
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
      visible: VISIBILITY_CONDITIONS.showButtonCondition,
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
      visible: VISIBILITY_CONDITIONS.showButtonCondition,
    },
  ],
}

/**
 * 表单项组件配置
 * 用于设计表单项时的属性配置
 */
export const formItemConfig = {
  size: 'default',
  labelPosition: 'top',
  hideBtns: true,
  items: [
    // 基本信息
    {
      label: '组件类型',
      field: 'component',
      defaultValue: 'ElInput',
      component: 'TsSelect',
      props: {
        clearable: true,
        placeholder: '请选择组件类型',
        options: COMMON_OPTIONS.componentTypeOptions,
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

    // 布局配置
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

    // 提示信息
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

    // 选项组配置（针对下拉、多选、单选组件）
    {
      label: '选项组选名字段',
      field: 'labelKey',
      defaultValue: 'label',
      component: ElInput,
      props: { clearable: true },
      visible: VISIBILITY_CONDITIONS.optionComponentCondition,
    },
    {
      label: '选项组选值字段',
      field: 'valueKey',
      defaultValue: 'value',
      component: ElInput,
      props: { clearable: true },
      visible: VISIBILITY_CONDITIONS.optionComponentCondition,
    },
    {
      label: '数据类型',
      field: 'dataType',
      component: 'TsRadio',
      props: {
        clearable: true,
        maxheight: 40,
        options: [
          { label: '静态数据', value: false },
          { label: '远程数据', value: true },
        ],
      },
      rules: [{ required: true, message: '请选择数据类型' }],
      visible: VISIBILITY_CONDITIONS.optionComponentCondition,
    },

    // 远程数据配置
    {
      label: '请求地址',
      field: 'requestUrl',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        placeholder: '请输入API接口地址',
      },
      rules: [{ required: true, message: '请输入请求地址' }],
      visible: VISIBILITY_CONDITIONS.remoteDataTypeCondition,
    },
    {
      label: '请求方法',
      field: 'requestMethod',
      defaultValue: 'POST',
      component: 'TsSelect',
      props: {
        options: COMMON_OPTIONS.requestMethodOptions,
      },
      rules: [{ required: true, message: '请选择请求方法' }],
      visible: VISIBILITY_CONDITIONS.remoteDataTypeCondition,
    },
    {
      label: '请求参数',
      field: 'requestParams',
      component: ElInput,
      props: {
        type: 'textarea',
        rows: 3,
        placeholder: 'JSON格式，如：{"page": 1, "size": 10}',
      },
      visible: VISIBILITY_CONDITIONS.remoteDataTypeCondition,
    },
    {
      label: '响应数据路径',
      field: 'responseDataPath',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        placeholder: '如：data.list',
      },
      visible: VISIBILITY_CONDITIONS.remoteDataTypeCondition,
    },

    // 静态数据配置
    {
      label: '静态选项数据',
      field: 'options',
      component: ElInput,
      props: {
        type: 'textarea',
        rows: 4,
        placeholder: 'JSON数组格式，如：[{"label": "选项1", "value": "1"}]',
      },
      rules: [{ required: true, message: '请输入静态选项数据' }],
      visible: VISIBILITY_CONDITIONS.staticDataTypeCondition,
    },

    // 通用属性配置
    {
      label: '长度',
      field: 'maxlength',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 100,
      },
      visible: {
        conditions: [
          {
            field: 'component',
            value: 'ElInput',
            type: '=',
          },
          {
            field: 'component',
            value: 'ElInputNumber',
            type: '=',
          },
        ],
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

    // 数字输入框特有配置
    {
      label: '最小值',
      field: 'min',
      defaultValue: '',
      component: ElInput,
      props: {
        clearable: true,
        maxheight: 20,
      },
      visible: VISIBILITY_CONDITIONS.inputNumberComponentCondition,
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
      visible: VISIBILITY_CONDITIONS.inputNumberComponentCondition,
    },

    // 状态配置
    {
      label: '是否禁用',
      field: 'disabled',
      component: 'TsRadio',
      props: {
        clearable: true,
        maxheight: 40,
        options: COMMON_OPTIONS.booleanOptions,
      },
    },

    // 验证配置
    {
      label: '是否必填',
      field: 'required',
      defaultValue: false,
      component: 'TsRadio',
      props: {
        clearable: true,
        maxheight: 40,
        options: COMMON_OPTIONS.booleanOptions,
      },
    },
    {
      label: '验证方式',
      field: 'trigger',
      labelKey: 'label',
      valueKey: 'value',
      component: 'TsCheckbox',
      props: {
        clearable: true,
        options: COMMON_OPTIONS.validatorTriggerOptions,
      },
      visible: VISIBILITY_CONDITIONS.requiredFieldCondition,
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
      visible: VISIBILITY_CONDITIONS.requiredFieldCondition,
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
      visible: VISIBILITY_CONDITIONS.requiredFieldCondition,
    },
  ],
}
