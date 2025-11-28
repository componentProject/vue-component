/** 导入 Vue 类型定义 */
import type { ComputedRef, MaybeRef, Ref, ShallowRef } from 'vue'
/** 导入类型定义 */
import type {
  ReFormEmits,
  ReFormItem,
  ReFormModelValue,
  ReFormProps,
  ReFormRules,
  ReGridResponsive,
} from '../_types'
/** 导入 lodash-es 工具函数 */
import { cloneDeep, isUndefined } from 'lodash-es'
/** 导入 Vue 组合式 API */
import {
  computed,
  nextTick,
  ref,
  shallowRef,
  triggerRef,
  unref,
  watch,
} from 'vue'
/** 导入工具函数 */
import {
  normalizeCollapsed,
  normalizeFormItems,
  normalizeFormRules,
  normalizeFormValueAndRules,
  normalizeVisible,
} from './index.ts'

/** useForm 返回值类型 */
export interface UseFormResult {
  /** 提交状态标记（发起 props.request 时置为 true） */
  submiting: Ref<boolean>
  /** 规范化后的表单数据模型（浅 ref，以差量更新为主） */
  formData: ShallowRef<ReFormModelValue>
  /** 汇总后的表单校验规则（与 formItems 同步） */
  formRules: ShallowRef<Partial<ReFormRules>>
  /** 规范化后的表单项 schema */
  formItems: ShallowRef<ReFormItem[]>
  /** 每个字段是否可见（由 visible 规则和 formData 推导） */
  formVisible: ComputedRef<Record<string, boolean>>
  /** 分组折叠状态（key 为分组字段名） */
  formCollapsed: Ref<Record<string, boolean>>
  /** 子字段到父分组路径映射（用于错误展开定位） */
  formGroupDependency: Ref<Record<string, string[]>>
  /** 监听 items/layout 的停止函数 */
  unwatchForm: () => void
  /** 渲染配置缓存清理函数（实例级） */
  clearItemConfigCache: () => void
  /** 渲染配置缓存（实例级，key 基于 path/field/component） */
  itemConfigCache: Map<string, ReFormItem>
}

/** useSyncFormData 返回值类型 */
export interface UseSyncFormDataResult {
  /** 供渲染使用的 items（已注入 v-model props/events，最小化变更） */
  renderFormItems: ComputedRef<ReFormItem[]>
  /** 渲染前的原始 items 引用（computed 缓存） */
  renderFormItemsCache: ComputedRef<ReFormItem[]>
  /** 提供给 ElForm 的 model 代理对象（避免直接持有 shallowRef） */
  formDataProxy: ComputedRef<ReFormModelValue>
  /** 停止外部→内部 model 同步的监听 */
  unwatchModelValue: () => void
  /** 停止内部→外部 model 同步的监听 */
  unwatchFormData: () => void
}

/**
 * 功能：
 * 统一规范化表单 schema（items）、默认值（modelValue）、列数/布局（span/layout），
 * 产出可直接驱动渲染与校验的响应式状态（formData、formRules、可见性、折叠等）。
 *
 * 作用：
 * - 聚合“表单状态层”：生成/维护表单的核心状态与派生状态；
 * - 实例级缓存 itemConfigCache：与渲染层配合，保持组件实例稳定并降本；
 * - 监听 items/layout 变化，差量更新数据与规则，触发依赖更新；
 * - 提供清理函数 clearItemConfigCache 与表单引用 getFormRef。
 *
 * @param items 表单项配置（schema）
 * @param defaultValue 默认模型值（可选）
 * @param span 列数/响应式列数配置（可选）
 * @param layout 布局类型：grid | flex（可选）
 * @returns 聚合后的表单核心状态与方法（submiting、reFormRef、formData、formRules、formItems、formVisible、formCollapsed、formGroupDependency、unwatchForm、clearItemConfigCache、itemConfigCache）
 */
export default function useForm(
  items: MaybeRef<ReFormItem[]>,
  defaultValue?: MaybeRef<ReFormModelValue>,
  span?: MaybeRef<number | ReGridResponsive>,
  layout?: MaybeRef<string>,
): UseFormResult {
  /** 提交状态 */
  const submiting = ref(false)

  /** 每个组件实例创建独立的缓存 */
  const itemConfigCache = new Map<string, ReFormItem>()
  /** 添加清理缓存的方法 */
  const clearItemConfigCache = () => {
    itemConfigCache.clear()
  }

  /** 表单配置项 */
  const formItems: ShallowRef<ReFormItem[]> = shallowRef(
    normalizeFormItems(unref(items), unref(span), unref(layout)), // 传递 layout 参数
  )

  /** 合并逻辑 - 利用相同递归 */
  const { modelValue, rules } = normalizeFormValueAndRules(
    formItems,
    defaultValue,
  )
  /** 表单数据 */
  const formData: ShallowRef<ReFormModelValue> = shallowRef(modelValue)
  /** 表单校验规则 */
  const formRules: ShallowRef<Partial<ReFormRules>> = shallowRef(rules)

  /** 获取折叠状态和分组依赖 */
  const { collapsedStatus, groupDependency } = normalizeCollapsed(formItems)

  /** 表单折叠状态 */
  const formCollapsed: Ref<Record<string, boolean>> = ref(collapsedStatus)
  /** 表单分组依赖 */
  const formGroupDependency: Ref<Record<string, string[]>>
    = ref(groupDependency)

  /** 表单字段可见性 */
  const formVisible: ComputedRef<Record<string, boolean>> = computed(() => {
    return normalizeVisible(formItems, unref(formData))
  })

  /** 监听表单配置变化 */
  const unwatchForm = watch(
    [() => unref(items), () => unref(layout)], // 同时监听items和layout
    () => {
      /** 清除缓存，确保重新计算所有表单项的span */
      clearItemConfigCache()
      /** 重新计算表单配置，使用新的layout */
      formItems.value = normalizeFormItems(unref(items), unref(span), unref(layout))
      /** 重新计算表单规则 */
      formRules.value = normalizeFormRules(formItems.value)

      /** 添加以下代码：重新计算表单数据，支持defaultValue动态更新 */
      const { modelValue: newModelValue } = normalizeFormValueAndRules(
        formItems,
        defaultValue,
      )

      /** 仅更新发生变化的字段 */
      let hasChanges = false
      /** 遍历新模型值 */
      for (const field in newModelValue) {
        /** 如果字段值发生变化 */
        if (formData.value[field] !== newModelValue[field]) {
          /** 更新字段值 */
          formData.value[field] = cloneDeep(newModelValue[field])
          /** 标记有变化 */
          hasChanges = true
        }
      }

      /** 如果有变化，触发响应式更新 */
      if (hasChanges) {
        triggerRef(formData)
      }

      /** 触发其他响应式更新 */
      triggerRef(formItems)
      triggerRef(formRules)
    },
    { deep: true },
  )

  /** 返回表单相关状态和方法 */
  return {
    submiting,
    formData,
    formRules,
    formItems,
    formVisible,
    formCollapsed,
    formGroupDependency,
    unwatchForm,
    clearItemConfigCache,
    itemConfigCache,
  }
}

/**
 * 功能：
 * 将 useForm 产出的 formItems 与 formData 适配为“可渲染的 items”（自动注入 v-model props/events），
 * 并负责内外部 model 的双向同步与事件合并（优先用户事件，再写回表单）。
 *
 * 作用：
 * - 生成 renderFormItems：最小化变更，结合 itemConfigCache 复用实例；
 * - 内→外：formData 变更时 emit('update:modelValue')；
 * - 外→内：props.modelValue 变更时差量写回 formData；
 * - 事件包装：合并原有事件与更新事件，保持用户行为与数据一致。
 *
 * @param formItems 规范化后的表单项（来自 useForm）
 * @param formData 表单数据（来自 useForm）
 * @param props 组件 props（用于同步 modelValue 等）
 * @param emits 组件 emits（用于对外派发更新/变更）
 * @param itemConfigCache 实例级渲染缓存（来自 useForm）
 * @returns 渲染与同步相关对象（renderFormItems、renderFormItemsCache、formDataProxy、unwatchModelValue、unwatchFormData）
 */
export function useSyncFormData(
  formItems: ShallowRef<ReFormItem[]>,
  formData: ShallowRef<ReFormModelValue>,
  props: ReFormProps,
  emits: ReFormEmits,
  itemConfigCache: Map<string, ReFormItem>, // 接收实例缓存
): UseSyncFormDataResult {
  /** 表单配置项缓存 */
  const renderFormItemsCache = computed(() => unref(formItems))

  /** 渲染表单配置项 */
  const renderFormItems = computed(() => {
    /** 恢复parentPath参数，确保分组层次结构被正确处理 */
    const travel = (originItems: ReFormItem[], parentPath = ''): ReFormItem[] => {
      /** 映射每个表单项 */
      return originItems.map((formItem: ReFormItem) => {
        /** 生成缓存key，考虑分组层次结构 */
        const path = parentPath ? `${parentPath}.${formItem.field}` : formItem.field
        const cacheKey = formItem.field
          ? `${path}_${typeof formItem.component === 'string' ? formItem.component : 'component'}`
          : JSON.stringify({ type: formItem.type, component: typeof formItem.component === 'string' ? formItem.component : 'component', path })

        /** 尝试从缓存获取配置，但只在非分组项上使用缓存 */
        if (formItem.type !== 'group' && itemConfigCache.has(cacheKey)) {
          const cachedItem = itemConfigCache.get(cacheKey)!
          /** 只更新必要的属性，不重建整个对象 */
          if (cachedItem.props && cachedItem.field) {
            const modelPropKey = (cachedItem.modelProp ?? 'modelValue') as string
            ;(cachedItem.props as Record<string, any>)[modelPropKey] = unref(formData)[cachedItem.field]
          }
          return cachedItem
        }

        /** 为每个表单项创建一个新的副本，确保不影响原始配置 */
        const item: ReFormItem = cloneDeep(formItem)

        /** 处理非分组表单项 */
        if (item.type !== 'group') {
          const field = item.field
          if (field) {
            /** 创建更新事件处理函数 */
            const updateEvent = (value: any) => {
              /** 使用nextTick确保更新的稳定性 */
              nextTick(() => {
                if (formData.value[field] !== value) {
                  formData.value[field] = value
                  emits('change', field, value, unref(formData))
                  /** 只在必要时触发更新 */
                  triggerRef(formData)
                }
              })
            }

            /** 修复wrapperEvent函数，正确调用事件处理函数 */
            const wrapperEvent = (originalEvent: ((v: any) => void) | undefined, updateEvent: (v: any) => void) => {
              return (value: any) => {
                /** 先执行用户自定义事件 */
                if (typeof originalEvent === 'function') {
                  originalEvent(value)
                }
                /** 然后执行表单更新事件 */
                updateEvent(value)
              }
            }

            /** 确保props对象存在并设置modelValue */
            if (isUndefined(item.props)) {
              item.props = {}
            }
            const modelPropKey = (item.modelProp ?? 'modelValue') as string
            ;(item.props as Record<string, any>)[modelPropKey] = unref(formData)[field]

            /** 确保events对象存在并设置事件处理函数 */
            if (isUndefined(item.events)) {
              item.events = {}
            }
            const modelEventKey = (item.modelEvent ?? 'update:modelValue') as string
            const originalEvent = (item.events as Record<string, any>)[modelEventKey] as ((v: any) => void) | undefined
            ;(item.events as Record<string, any>)[modelEventKey] = wrapperEvent(originalEvent, updateEvent)
          }

          /** 存入缓存，确保组件实例的稳定性 */
          itemConfigCache.set(cacheKey, item)
        }
        else {
          /** 检查item.children是否存在，避免处理空数组 */
          if (item.children && item.children.length) {
            /** 传递分组路径，确保子项能够正确绑定到表单数据 */
            item.children = travel(item.children, formItem.field || parentPath)
          }
        }

        /** 返回处理后的表单项 */
        return item
      })
    }

    /** 开始处理并返回结果 */
    return travel(renderFormItemsCache.value)
  })

  /** 表单数据代理 */
  const formDataProxy = computed(() => ({ ...unref(formData) }))

  /** formData => shallwoRef - 监听表单数据变化 */
  const unwatchFormData = watch(formData, () => {
    /** 如果props中有modelValue，触发更新事件 */
    if (!isUndefined(props.modelValue)) {
      emits('update:modelValue', unref(formData))
    }
  })

  /** props.modelValue => shallwoRef - 监听外部modelValue变化 */
  const unwatchModelValue = watch(
    () => props.modelValue,
    () => {
      /** 如果props中有modelValue */
      if (!isUndefined(props.modelValue)) {
        /** 标记是否有变化 */
        let changeFlag = false
        /** 遍历props中的modelValue字段 */
        for (const field of Object.keys(unref(props.modelValue))) {
          /** 如果表单数据中存在该字段且值不同 */
          if (
            Reflect.has(formData.value, field)
            && formData.value[field] !== props.modelValue[field]
          ) {
            /** 更新表单数据 */
            formData.value[field] = props.modelValue[field]
            /** 标记有变化 */
            changeFlag = true
          }
        }
        /** 如果有变化，触发响应式更新 */
        if (changeFlag) {
          triggerRef(formData)
        }
      }
    },
    {
      deep: true,
      immediate: false,
    },
  )

  /** 返回监听相关状态和方法 */
  return {
    renderFormItems,
    renderFormItemsCache,
    formDataProxy,
    unwatchModelValue,
    unwatchFormData,
  }
}
