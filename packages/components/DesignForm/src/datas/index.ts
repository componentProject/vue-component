import { ElCheckbox, ElCheckboxGroup, ElInput, ElInputNumber, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'

const itemConfig = {
  label: '',
  field: '',
}

export const formItemObj = {
  elInput: {
    ...itemConfig,
    component: ElInput,
  },
  eltextarea: {
    ...itemConfig,
    component: ElInput,
    props: {
      type: 'textarea',
    },
  },
  elinputnumber: {
    ...itemConfig,
    component: ElInputNumber,
  },
  elselect: {
    ...itemConfig,
    component: ElSelect,
  },
  elcheckboxgroup: {
    ...itemConfig,
    component: ElCheckboxGroup,
    childComp: ElCheckbox,
  },
  elradiogroup: {
    ...itemConfig,
    component: ElRadioGroup,
    childComp: ElRadio,
  },
}
