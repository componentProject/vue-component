import { ElInput, ElInputNumber } from 'element-plus'

export const componentMap = {
  elinput: ElInput,
  eltextarea: ElInput,
  elinputnumber: ElInputNumber,
  tsselect: 'TsSelect',
  tscheckbox: 'TsCheckbox',
  tsradio: 'TsRadio',
}

export const formItemObj = {
  elInput: {
    label: '输入框',
    component: ElInput,
    props: {
      clearable: true,
      disabled: false,
    },
  },
  eltextarea: {
    label: '多行输入框',
    component: ElInput,
    props: {
      type: 'textarea',
    },
  },
  elinputnumber: {
    label: '数字输入框',
    component: ElInputNumber,
  },
  tsselect: {
    label: '下拉框',
    component: 'TsSelect',
    props: {
      clearable: true,
      filterable: true,
      options: [{
        label: '选项1',
        value: '1',
      }, {
        label: '选项2',
        value: '2',
      }],
    },
  },
  tscheckbox: {
    label: '多选',
    component: 'TsCheckbox',
    props: {
      options: [{
        label: '多选1',
        value: '1',
      }, {
        label: '多选2',
        value: '2',
      }],
      clearable: true,
    },
  },
  tsradio: {
    label: '单选',
    component: 'TsRadio',
    props: {
      options: [{
        label: '单选1',
        value: '1',
      }, {
        label: '单选2',
        value: '2',
      }],
    },
  },
}
