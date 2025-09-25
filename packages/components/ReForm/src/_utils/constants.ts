import { DEFAULT_FORM_GRID_RESPONSIVE } from './useGridResponsive'

export const DEFAULT_FORM_ITEM_CFG = {
  type: 'component',
  span: DEFAULT_FORM_GRID_RESPONSIVE, // 应该同Form的cols，默认占满一行
  labelKey: 'label',
  valueKey: 'value',
  modelProp: 'modelValue',
  modelEvent: 'update:modelValue',
}

export const DEFAULT_COLLAPSED_TEXT = ['展开', '收起']
export const DEFAULT_TEXTAREA_ROWS = 3
export const HAS_CHILD_COMPONENT_MAP = {
  ElSelect: 'el-option',
  ElRadioGroup: 'el-radio',
  ElCheckboxGroup: 'el-checkbox',
}
