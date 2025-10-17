import { ElCheckbox, ElCheckboxGroup, ElInput, ElInputNumber, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'

export const componentMap = {
  elinput: ElInput,
  eltextarea: ElInput,
  elinputnumber: ElInputNumber,
  elselect: ElSelect,
}

export const formItemObj = {
  elInput: {
    label: '输入框',
    component: ElInput,
    props: {
      maxlength: 5,
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
  elselect: {
    label: '下拉框',
    component: ElSelect,
  },
  elcheckboxgroup: {
    label: '多选',
    component: ElCheckboxGroup,
    childComp: ElCheckbox,
  },
  elradiogroup: {
    label: '单选',
    component: ElRadioGroup,
    childComp: ElRadio,
  },
}
