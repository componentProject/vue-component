// 移除未使用的类型导入
import { unref } from 'vue'
import type { MaybeRef } from 'vue'
import type {
  ReFormItem,
  ReFormItemVisibleRule,
  ReFormItemVisibleRuleCondition,
  ReFormModelValue,
  ReFormRules,
  ReGridResponsive,
} from '../_types'
import { cloneDeep, isArray, isString, isUndefined } from 'lodash'
import {
  DEFAULT_COLLAPSED_TEXT,
  DEFAULT_FORM_ITEM_CFG,
  DEFAULT_TEXTAREA_ROWS,
  HAS_CHILD_COMPONENT_MAP,
} from './constants'
import { normalizeGridResponsive } from './useGridResponsive'

// 获取组件名称，确保组件类型比较的一致性
export function getComponentName(component: any): string {
  if (typeof component === 'string') {
    return component
  }
  // 对于组件对象，尝试获取其名称标识
  return component.__vccOpts?.name || component.name || component.displayName || 'unknown-component'
}

export function unwrapperShadowRef(data: MaybeRef<ReFormModelValue>) {
  const model = unref(data)
  const keys = Object.keys(model)
  for (const key of keys) {
    model[key] = unref(model[key])
  }
  return cloneDeep(model)
}

export function getSlotsNames(items: ReFormItem[]): [string[], string[]] {
  const slotNames: string[] = [] // 命名插槽
  const slotScopedNames: string[] = [] // 作用域插槽
  const travelSlots = (nodes: ReFormItem[]) => {
    for (const item of nodes) {
      if (item.type === 'group') {
        if (item.groupSlot) {
          slotNames.push(item.groupSlot)
        }
        if (isArray(item.children)) {
          travelSlots(item.children)
        }
      }
      else {
        if (item.slot) {
          slotScopedNames.push(item.slot)
        }
        if (item.labelSlot) {
          slotNames.push(item.labelSlot)
        }
      }
    }
  }

  travelSlots(items)

  return [slotScopedNames, slotNames]
}

/**
 * 规范化表单配置
 * @param items 表单配置
 * @param span 表单字段栅格占比
 * @param layout 布局类型
 * @returns 表单配置
 */
export function normalizeFormItems(
  items: ReFormItem[],
  span?: number | ReGridResponsive,
  layout?: string,
): ReFormItem[] {
  // defaultKeys: type labelKey valueKey modelProp modelEvent events{[modelEvent]}
  const travel = (nodes: ReFormItem[]) => {
    return nodes.map((item: ReFormItem) => {
      const formItem = cloneDeep({
        ...DEFAULT_FORM_ITEM_CFG,
        ...item,
      }) as ReFormItem

      // 根据不同布局类型设置不同的默认span值
      if (isUndefined(item.span)) {
        if (layout === 'flex') {
          formItem.span = 6
        }
        else if (layout === 'grid') {
          formItem.span = 24
        }
        else if (!isUndefined(span)) {
          formItem.span = span
        }
      }

      if (layout !== 'flex' && layout !== 'grid') {
        formItem.span = normalizeGridResponsive(formItem.span)
      }

      if (formItem.type === 'group') {
        formItem.collapsedTriggerProps = {
          link: true,
          type: 'primary',
          ...(unref(formItem.collapsedTriggerProps) || {}),
        }
        formItem.collapsedText = normalizeCollapsedText(formItem.collapsedText)
        formItem.children = travel(
          isUndefined(formItem.children) ? [] : unref(formItem.children),
        )
        if (isUndefined(formItem.collapsedTriggerIndex)) {
          formItem.collapsedTriggerIndex = true
        }
        // 自动注入插槽
        if (isUndefined(formItem.groupSlot)) {
          formItem.groupSlot = `${formItem.field}-group`
        }
        formItem.groupSlots = getSlotsNames(formItem.children)
      }
      else {
        if (isUndefined(formItem.labelSlot)) {
          formItem.labelSlot = `${formItem.field}-label`
        }
      }

      if (formItem.type === 'component') {
        const componentName = getComponentName(formItem.component)
        if (!isUndefined(HAS_CHILD_COMPONENT_MAP[componentName])) {
          if (isUndefined(formItem.childComp)) {
            formItem.childComp = HAS_CHILD_COMPONENT_MAP[componentName]
          }
        }
        if (formItem.component === 'el-textarea' || formItem.component === 'textarea') {
          if (isUndefined(formItem.props)) {
            formItem.props = { rows: DEFAULT_TEXTAREA_ROWS }
          }
          else if (
            isUndefined(formItem.props.rows)
            && isUndefined(formItem.props.autosize)
          ) {
            formItem.props.rows = DEFAULT_TEXTAREA_ROWS
          }
        }
      }

      return formItem
    })
  }
  return travel(unref(items))
}

/**
 * 初始化表单数据
 * @param items 表单配置
 * @param defaultValue 默认值
 * @returns 表单数据
 */
export function normalizeFormModelValue(
  items: MaybeRef<ReFormItem[]>,
  defaultValue?: MaybeRef<ReFormModelValue>,
): ReFormModelValue {
  const modelValue: ReFormModelValue = {}

  const travel = (nodes: ReFormItem[]) => {
    for (const item of nodes) {
      if (item.type !== 'group') {
        modelValue[item.field] = isUndefined(defaultValue)
          ? cloneDeep(unref(item.defaultValue))
          : cloneDeep(unref(defaultValue)[item.field])
      }
      else if (Array.isArray(item.children)) {
        travel(unref(item.children))
      }
    }
  }
  travel(unref(items))
  return modelValue
}

export function normalizeFormRules(items: MaybeRef<ReFormItem[]>): ReFormRules {
  const rules: ReFormRules = {}

  const travel = (nodes: ReFormItem[]) => {
    for (const item of nodes) {
      if (item.type !== 'group') {
        if (!isUndefined(item.rules)) {
          rules[item.field] = unref(item.rules)
        }
      }
      else if (Array.isArray(item.children)) {
        travel(unref(item.children))
      }
    }
  }
  travel(unref(items))
  return rules
}

/**
 * 初始化表单数据
 * @param items 表单配置
 * @param defaultValue 默认值
 * @returns 表单数据 / 表单校验规则
 */
export function normalizeFormValueAndRules(
  items: MaybeRef<ReFormItem[]>,
  defaultValue?: MaybeRef<ReFormModelValue>,
) {
  const modelValue: ReFormModelValue = {}
  const rules: ReFormRules = {}

  const travel = (nodes: ReFormItem[]) => {
    for (const item of nodes) {
      if (item.type !== 'group') {
        modelValue[item.field] = isUndefined(defaultValue)
          ? cloneDeep(unref(item.defaultValue))
          : cloneDeep(unref(defaultValue)[item.field])
        if (!isUndefined(item.rules)) {
          rules[item.field] = unref(item.rules)
        }
      }
      else if (Array.isArray(item.children)) {
        travel(unref(item.children))
      }
    }
  }
  travel(unref(items))

  return { modelValue, rules }
}

/**
 * 获取表单字段组默认展开状态
 * @param items 表单配置
 * @returns 表单折叠状态 / 分组依赖反转字段路径-用于校验失败自动展开定位
 */
export function normalizeCollapsed(items: MaybeRef<ReFormItem[]>) {
  const collapsedStatus: Record<string, boolean> = {}
  const groupDependency: Record<string, string[]> = {}
  const travel = (nodes: ReFormItem[]) => {
    for (const item of nodes) {
      if (item.type === 'group') {
        collapsedStatus[item.field] = !!item.defaultCollapsed || false
        if (Array.isArray(item.children)) {
          for (const child of item.children) {
            if (isUndefined(groupDependency[item.field])) {
              groupDependency[child.field] = [item.field] as string[]
            }
            else {
              groupDependency[child.field] = [
                item.field,
                ...groupDependency[item.field],
              ] as string[]
            }
          }
          travel(unref(item.children))
        }
      }
    }
  }

  travel(unref(items))

  return { collapsedStatus, groupDependency }
}

export function normalizeCollapsedText(
  collpasedText?: ReFormItem['collapsedText'],
): [string, string] {
  const text: [string, string] = ['', '']
  if (isUndefined(collpasedText)) {
    text[0] = DEFAULT_COLLAPSED_TEXT[0]
    text[1] = DEFAULT_COLLAPSED_TEXT[1]
  }
  else if (isString(collpasedText)) {
    text[0] = text[1] = collpasedText
  }
  else if (isArray(collpasedText)) {
    text[0] = collpasedText[0] || DEFAULT_COLLAPSED_TEXT[0]
    text[1] = collpasedText[1] || text[0]
  }
  return text
}

/**
 * 表单元素可视控制
 * @param item 表单元素
 * @param formData 表单数据
 * @returns
 */
export function normalizeVisible(
  items: MaybeRef<ReFormItem[]>,
  formData: MaybeRef<ReFormModelValue>,
): Record<string, boolean> {
  const visible: Record<string, boolean> = {}
  const travel = (nodes: ReFormItem[]) => {
    for (const item of nodes) {
      visible[item.field] = normalizeItemVisible(item, formData)
      if (item.type === 'group' && Array.isArray(item.children)) {
        travel(item.children)
      }
    }
  }
  travel(unref(items))
  return visible
}

export function normalizeItemVisible(
  item: ReFormItem,
  formData: MaybeRef<ReFormModelValue>,
): boolean {
  if (isUndefined(item.visible))
    return true
  if (typeof item.visible === 'boolean')
    return item.visible
  const visibleRule = normalizeVisibleRule(item.visible)
  return validateVisible(visibleRule, formData)
}

export function normalizeVisibleRule(
  rule: ReFormItemVisibleRule | ReFormItemVisibleRuleCondition,
): ReFormItemVisibleRule {
  if (isUndefined((rule as ReFormItemVisibleRule).conditions)) {
    return {
      type: '|',
      conditions: [
        { ...rule, type: rule.type || '=' } as ReFormItemVisibleRuleCondition,
      ],
    }
  }
  return rule as ReFormItemVisibleRule
}

export function validateVisible(
  rule: ReFormItemVisibleRule,
  formData: MaybeRef<ReFormModelValue>,
): boolean {
  const method = rule.type === '&' ? 'every' : 'some'
  return rule.conditions[method](
    (condition: ReFormItemVisibleRuleCondition): boolean => {
      const { field, value, type, ignoreCase = false } = condition
      return customCompare(
        type,
        unref(formData[field]),
        unref(value),
        ignoreCase,
      )
    },
  )
}

export function ignoreCaseFunc(value: any): any {
  return isArray(value)
    ? value.map(val => (isString(val) ? val.toLowerCase() : val))
    : isString(value)
      ? value.toLowerCase()
      : value
}

export function customCompare(
  type: ReFormItemVisibleRuleCondition['type'],
  value: any,
  filterValue: any,
  ignoreCase = false,
): boolean {
  let flag = true
  if (ignoreCase) {
    value = ignoreCaseFunc(value)
    filterValue = ignoreCaseFunc(filterValue)
  }
  switch (type) {
    case '=': // 等于
      flag = value === filterValue
      break
    case '!=': // 不等
      flag = value !== filterValue
      break
    case '.': // 在集合
      flag = filterValue.includes?.(value)
      break
    case '!.': // 不在集合
      flag = !filterValue.includes?.(value)
      break
    case '&.': // 包含 - 两个数组
      flag = value.every((val: any) => filterValue.includes(val))
      break
    case '!&.': // 没有交集 - 两个数组
      flag = !value.every((val: any) => filterValue.includes(val))
      break
    case '|.': // 交集 - 两个数组
      flag = value.some((val: any) => filterValue.includes(val))
      break
    case '^=': // 开头
      flag = value.startsWith?.(filterValue)
      break
    case '!^=': // 不以...开头
      flag = !value.startsWith?.(filterValue)
      break
    case '=$': // 结尾
      flag = value.endsWith?.(filterValue)
      break
    case '!=$': // 不以...结尾
      flag = !value.endsWith?.(filterValue)
      break
    default:
  }

  return flag
}
