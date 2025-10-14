import { ElCheckbox, ElCheckboxGroup, ElInput, ElInputNumber, ElRadio, ElRadioGroup, ElSelect } from 'element-plus'

let fieldCounter = 0

function createComponentConfig(baseConfig: any) {
  return {
    ...baseConfig,
    field: `field_${++fieldCounter}`, // 生成唯一的 field
  }
}

export const formItemObj = {
  elInput: createComponentConfig({
    label: '输入框',
    component: ElInput,
  }),
  eltextarea: createComponentConfig({
    label: '多行输入框',
    component: ElInput,
    props: {
      type: 'textarea',
    },
  }),
  elinputnumber: createComponentConfig({
    label: '数字输入框',
    component: ElInputNumber,
  }),
  elselect: createComponentConfig({
    label: '下拉框',
    component: ElSelect,
  }),
  elcheckboxgroup: createComponentConfig({
    label: '多选框组',
    component: ElCheckboxGroup,
    childComp: ElCheckbox,
  }),
  elradiogroup: createComponentConfig({
    label: '单选框组',
    component: ElRadioGroup,
    childComp: ElRadio,
  }),
}
