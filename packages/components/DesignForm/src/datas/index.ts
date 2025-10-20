import { ElCheckbox, ElCheckboxGroup, ElInput, ElInputNumber, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'
import TsSelect from '@moluoxixi/components/TsSelect'

export const componentMap = {
  elinput: ElInput,
  eltextarea: ElInput,
  elinputnumber: ElInputNumber,
  elselect: ElSelect,
  tsselect: TsSelect,
  eloption: ElSelect.Option,
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
  elselect: {
    label: '下拉框',
    component: ElSelect,
  },
  tsselect: {
    label: '增强下拉框',
    component: TsSelect,
    props: {
      clearable: true,
      filterable: true,
    },
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
