/** 移除未使用的类型导入 */
import { unref } from 'vue'
/** 导入 Vue 的 MaybeRef 类型 */
import type { MaybeRef } from 'vue'
/** 导入表单相关类型定义 */
import type {
  ReFormItem,
  ReFormItemVisibleRule,
  ReFormItemVisibleRuleCondition,
  ReFormModelValue,
  ReFormRules,
  ReGridResponsive,
} from '../_types'
/** 导入 lodash 工具函数 */
import { cloneDeep, isArray, isString, isUndefined } from 'lodash'
/** 导入常量定义 */
import {
  DEFAULT_COLLAPSED_TEXT,
  DEFAULT_FORM_ITEM_CFG,
  DEFAULT_TEXTAREA_ROWS,
  HAS_CHILD_COMPONENT_MAP,
} from './constants'
/** 导入栅格响应式工具函数 */
import { normalizeGridResponsive } from './useGridResponsive'

/** 获取组件名称，确保组件类型比较的一致性 */
export function getComponentName(component: any): string {
  /** 如果是字符串类型，直接返回 */
  if (typeof component === 'string') {
    return component
  }
  /** 对于组件对象，尝试获取其名称标识 */
  return component.__vccOpts?.name || component.name || component.displayName || 'unknown-component'
}

/** 解包响应式引用，将嵌套的响应式对象转换为普通对象 */
export function unwrapperShadowRef(data: MaybeRef<ReFormModelValue>) {
  /** 获取响应式数据的值 */
  const model = unref(data)
  /** 获取所有键名 */
  const keys = Object.keys(model)
  /** 遍历所有键，解包嵌套的响应式引用 */
  for (const key of keys) {
    model[key] = unref(model[key])
  }
  /** 返回深拷贝的普通对象 */
  return cloneDeep(model)
}

/** 获取表单项中所有插槽名称 */
export function getSlotsNames(items: ReFormItem[]): [string[], string[]] {
  /** 命名插槽数组 */
  const slotNames: string[] = []
  /** 作用域插槽数组 */
  const slotScopedNames: string[] = []
  /** 递归遍历表单项获取插槽名称 */
  const travelSlots = (nodes: ReFormItem[]) => {
    /** 遍历每个表单项 */
    for (const item of nodes) {
      /** 如果是分组类型 */
      if (item.type === 'group') {
        /** 如果有分组插槽，添加到命名插槽数组 */
        if (item.groupSlot) {
          slotNames.push(item.groupSlot)
        }
        /** 如果有子项，递归处理 */
        if (isArray(item.children)) {
          travelSlots(item.children)
        }
      }
      else {
        /** 如果有作用域插槽，添加到作用域插槽数组 */
        if (item.slot) {
          slotScopedNames.push(item.slot)
        }
        /** 如果有标签插槽，添加到命名插槽数组 */
        if (item.labelSlot) {
          slotNames.push(item.labelSlot)
        }
      }
    }
  }

  /** 开始遍历 */
  travelSlots(items)

  /** 返回插槽名称数组 */
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
  /** defaultKeys: type labelKey valueKey modelProp modelEvent events{[modelEvent]} */
  const travel = (nodes: ReFormItem[]) => {
    /** 映射每个表单项 */
    return nodes.map((item: ReFormItem) => {
      /** 深拷贝并合并默认配置 */
      const formItem = cloneDeep({
        ...DEFAULT_FORM_ITEM_CFG,
        ...item,
      }) as ReFormItem

      /** 根据不同布局类型设置不同的默认span值 */
      if (isUndefined(item.span)) {
        /** 如果是flex布局 */
        if (layout === 'flex') {
          /** 对于分组项，默认span为24；非分组项保持默认为6 */
          formItem.span = item.type === 'group' ? 24 : 6
        }
        /** 如果是grid布局 */
        else if (layout === 'grid') {
          formItem.span = 24
        }
        /** 如果传入了span参数 */
        else if (!isUndefined(span)) {
          formItem.span = span
        }
      }

      /** 如果不是flex或grid布局，规范化响应式span */
      if (layout !== 'flex' && layout !== 'grid') {
        formItem.span = normalizeGridResponsive(formItem.span)
      }

      /** 如果是分组类型 */
      if (formItem.type === 'group') {
        /** 设置折叠按钮属性 */
        formItem.collapsedTriggerProps = {
          link: true,
          type: 'primary',
          ...(unref(formItem.collapsedTriggerProps) || {}),
        }
        /** 规范化折叠文字 */
        formItem.collapsedText = normalizeCollapsedText(formItem.collapsedText)
        /** 递归处理子项 */
        formItem.children = travel(
          isUndefined(formItem.children) ? [] : unref(formItem.children),
        )
        /** 设置折叠按钮索引显示 */
        if (isUndefined(formItem.collapsedTriggerIndex)) {
          formItem.collapsedTriggerIndex = true
        }
        /** 自动注入插槽 */
        if (isUndefined(formItem.groupSlot)) {
          formItem.groupSlot = `${formItem.field}-group`
        }
        /** 获取分组插槽名称 */
        formItem.groupSlots = getSlotsNames(formItem.children)
      }
      else {
        /** 自动注入标签插槽 */
        if (isUndefined(formItem.labelSlot)) {
          formItem.labelSlot = `${formItem.field}-label`
        }
      }

      /** 如果是组件类型 */
      if (formItem.type === 'component') {
        /** 获取组件名称 */
        const componentName = getComponentName(formItem.component)
        /** 检查是否需要子组件 */
        if (!isUndefined(HAS_CHILD_COMPONENT_MAP[componentName])) {
          /** 如果没有设置子组件，使用默认子组件 */
          if (isUndefined(formItem.childComp)) {
            formItem.childComp = HAS_CHILD_COMPONENT_MAP[componentName]
          }
        }
        /** 如果是文本域组件 */
        if (formItem.component === 'el-textarea' || formItem.component === 'textarea') {
          /** 如果没有设置props，设置默认行数 */
          if (isUndefined(formItem.props)) {
            formItem.props = { rows: DEFAULT_TEXTAREA_ROWS }
          }
          /** 如果设置了props但没有设置行数和自动调整大小 */
          else if (
            isUndefined(formItem.props.rows)
            && isUndefined(formItem.props.autosize)
          ) {
            formItem.props.rows = DEFAULT_TEXTAREA_ROWS
          }
        }
      }

      /** 返回处理后的表单项 */
      return formItem
    })
  }
  /** 开始处理并返回结果 */
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
  /** 初始化表单数据对象 */
  const modelValue: ReFormModelValue = {}

  /** 递归遍历表单项初始化数据 */
  const travel = (nodes: ReFormItem[]) => {
    /** 遍历每个表单项 */
    for (const item of nodes) {
      /** 如果不是分组类型 */
      if (item.type !== 'group') {
        /** 设置字段值，优先使用默认值，否则使用表单项默认值 */
        modelValue[item.field] = isUndefined(defaultValue)
          ? cloneDeep(unref(item.defaultValue))
          : cloneDeep(unref(defaultValue)[item.field])
      }
      /** 如果是分组且有子项 */
      else if (Array.isArray(item.children)) {
        /** 递归处理子项 */
        travel(unref(item.children))
      }
    }
  }
  /** 开始遍历 */
  travel(unref(items))
  /** 返回表单数据 */
  return modelValue
}

/** 初始化表单校验规则 */
export function normalizeFormRules(items: MaybeRef<ReFormItem[]>): ReFormRules {
  /** 初始化规则对象 */
  const rules: ReFormRules = {}

  /** 递归遍历表单项提取规则 */
  const travel = (nodes: ReFormItem[]) => {
    /** 遍历每个表单项 */
    for (const item of nodes) {
      /** 如果不是分组类型且有规则 */
      if (item.type !== 'group') {
        if (!isUndefined(item.rules)) {
          /** 设置字段规则 */
          rules[item.field] = unref(item.rules)
        }
      }
      /** 如果是分组且有子项 */
      else if (Array.isArray(item.children)) {
        /** 递归处理子项 */
        travel(unref(item.children))
      }
    }
  }
  /** 开始遍历 */
  travel(unref(items))
  /** 返回规则对象 */
  return rules
}

/**
 * 初始化表单数据和校验规则
 * @param items 表单配置
 * @param defaultValue 默认值
 * @returns 表单数据 / 表单校验规则
 */
export function normalizeFormValueAndRules(
  items: MaybeRef<ReFormItem[]>,
  defaultValue?: MaybeRef<ReFormModelValue>,
) {
  /** 初始化表单数据对象 */
  const modelValue: ReFormModelValue = {}
  /** 初始化规则对象 */
  const rules: ReFormRules = {}

  /** 递归遍历表单项初始化数据和规则 */
  const travel = (nodes: ReFormItem[]) => {
    /** 遍历每个表单项 */
    for (const item of nodes) {
      /** 如果不是分组类型 */
      if (item.type !== 'group') {
        /** 设置字段值，优先使用默认值，否则使用表单项默认值 */
        modelValue[item.field] = isUndefined(defaultValue)
          ? cloneDeep(unref(item.defaultValue))
          : cloneDeep(unref(defaultValue)[item.field])
        /** 如果有规则，设置字段规则 */
        if (!isUndefined(item.rules)) {
          rules[item.field] = unref(item.rules)
        }
      }
      /** 如果是分组且有子项 */
      else if (Array.isArray(item.children)) {
        /** 递归处理子项 */
        travel(unref(item.children))
      }
    }
  }
  /** 开始遍历 */
  travel(unref(items))

  /** 返回数据和规则 */
  return { modelValue, rules }
}

/**
 * 获取表单字段组默认展开状态
 * @param items 表单配置
 * @returns 表单折叠状态 / 分组依赖反转字段路径-用于校验失败自动展开定位
 */
export function normalizeCollapsed(items: MaybeRef<ReFormItem[]>) {
  /** 初始化折叠状态对象 */
  const collapsedStatus: Record<string, boolean> = {}
  /** 初始化分组依赖对象 */
  const groupDependency: Record<string, string[]> = {}
  /** 递归遍历表单项处理折叠状态 */
  const travel = (nodes: ReFormItem[]) => {
    /** 遍历每个表单项 */
    for (const item of nodes) {
      /** 如果是分组类型 */
      if (item.type === 'group') {
        /** 设置分组折叠状态 */
        collapsedStatus[item.field] = !!item.defaultCollapsed || false
        /** 如果有子项 */
        if (Array.isArray(item.children)) {
          /** 遍历子项建立依赖关系 */
          for (const child of item.children) {
            /** 如果分组依赖未定义，创建新的依赖数组 */
            if (isUndefined(groupDependency[item.field])) {
              groupDependency[child.field] = [item.field] as string[]
            }
            else {
              /** 否则添加父分组到依赖数组 */
              groupDependency[child.field] = [
                item.field,
                ...groupDependency[item.field],
              ] as string[]
            }
          }
          /** 递归处理子项 */
          travel(unref(item.children))
        }
      }
    }
  }

  /** 开始遍历 */
  travel(unref(items))

  /** 返回折叠状态和分组依赖 */
  return { collapsedStatus, groupDependency }
}

/** 规范化折叠按钮文字配置 */
export function normalizeCollapsedText(
  collpasedText?: ReFormItem['collapsedText'],
): [string, string] {
  /** 初始化文字数组 */
  const text: [string, string] = ['', '']
  /** 如果未定义折叠文字 */
  if (isUndefined(collpasedText)) {
    /** 使用默认文字 */
    text[0] = DEFAULT_COLLAPSED_TEXT[0]
    text[1] = DEFAULT_COLLAPSED_TEXT[1]
  }
  /** 如果是字符串类型 */
  else if (isString(collpasedText)) {
    /** 展开和收起使用相同文字 */
    text[0] = text[1] = collpasedText
  }
  /** 如果是数组类型 */
  else if (isArray(collpasedText)) {
    /** 设置展开文字，如果没有则使用默认值 */
    text[0] = collpasedText[0] || DEFAULT_COLLAPSED_TEXT[0]
    /** 设置收起文字，如果没有则使用展开文字 */
    text[1] = collpasedText[1] || text[0]
  }
  /** 返回规范化后的文字数组 */
  return text
}

/**
 * 表单元素可视控制
 * @param items 表单元素配置
 * @param formData 表单数据
 * @returns 字段可见性状态对象
 */
export function normalizeVisible(
  items: MaybeRef<ReFormItem[]>,
  formData: MaybeRef<ReFormModelValue>,
): Record<string, boolean> {
  /** 初始化可见性状态对象 */
  const visible: Record<string, boolean> = {}
  /** 递归遍历表单项处理可见性 */
  const travel = (nodes: ReFormItem[]) => {
    /** 遍历每个表单项 */
    for (const item of nodes) {
      /** 设置字段可见性 */
      visible[item.field] = normalizeItemVisible(item, formData)
      /** 如果是分组且有子项 */
      if (item.type === 'group' && Array.isArray(item.children)) {
        /** 递归处理子项 */
        travel(item.children)
      }
    }
  }
  /** 开始遍历 */
  travel(unref(items))
  /** 返回可见性状态对象 */
  return visible
}

/** 规范化单个表单项的可见性 */
export function normalizeItemVisible(
  item: ReFormItem,
  formData: MaybeRef<ReFormModelValue>,
): boolean {
  /** 如果未定义可见性规则，默认可见 */
  if (isUndefined(item.visible))
    return true
  /** 如果是布尔值，直接返回 */
  if (typeof item.visible === 'boolean')
    return item.visible
  /** 规范化可见性规则 */
  const visibleRule = normalizeVisibleRule(item.visible)
  /** 验证可见性 */
  return validateVisible(visibleRule, formData)
}

/** 规范化可见性规则 */
export function normalizeVisibleRule(
  rule: ReFormItemVisibleRule | ReFormItemVisibleRuleCondition,
): ReFormItemVisibleRule {
  /** 如果规则没有条件数组，说明是单个条件 */
  if (isUndefined((rule as ReFormItemVisibleRule).conditions)) {
    /** 返回包装后的规则对象 */
    return {
      type: '|',
      conditions: [
        { ...rule, type: rule.type || '=' } as ReFormItemVisibleRuleCondition,
      ],
    }
  }
  /** 返回规则对象 */
  return rule as ReFormItemVisibleRule
}

/** 验证可见性规则 */
export function validateVisible(
  rule: ReFormItemVisibleRule,
  formData: MaybeRef<ReFormModelValue>,
): boolean {
  /** 根据规则类型选择验证方法 */
  const method = rule.type === '&' ? 'every' : 'some'
  /** 使用选定的方法验证所有条件 */
  return rule.conditions[method](
    (condition: ReFormItemVisibleRuleCondition): boolean => {
      /** 解构条件参数 */
      const { field, value, type, ignoreCase = false } = condition
      /** 执行自定义比较 */
      return customCompare(
        type,
        unref(formData[field]),
        unref(value),
        ignoreCase,
      )
    },
  )
}

/** 忽略大小写处理函数 */
export function ignoreCaseFunc(value: any): any {
  /** 如果是数组，递归处理每个元素 */
  return isArray(value)
    ? value.map(val => (isString(val) ? val.toLowerCase() : val))
    : isString(value)
      ? value.toLowerCase()
      : value
}

/** 自定义比较函数 */
export function customCompare(
  type: ReFormItemVisibleRuleCondition['type'],
  value: any,
  filterValue: any,
  ignoreCase = false,
): boolean {
  /** 初始化比较结果 */
  let flag = true
  /** 如果需要忽略大小写 */
  if (ignoreCase) {
    /** 转换为小写 */
    value = ignoreCaseFunc(value)
    filterValue = ignoreCaseFunc(filterValue)
  }
  /** 根据比较类型执行不同的比较逻辑 */
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

  /** 返回比较结果 */
  return flag
}
