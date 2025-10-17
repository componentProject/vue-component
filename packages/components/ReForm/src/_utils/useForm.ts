import {
  computed,
  nextTick,
  ref,
  shallowRef,
  triggerRef,
  unref,
  watch,
} from 'vue'
import type { MaybeRef, Ref, ShallowRef } from 'vue'
import {
  normalizeCollapsed,
  normalizeFormItems,
  normalizeFormRules,
  normalizeFormValueAndRules,
  normalizeVisible,
} from './index.ts'
import type {
  ReFormEmits,
  ReFormItem,
  ReFormModelValue,
  ReFormProps,
  ReFormRules,
  ReGridResponsive,
} from '../_types'
import type { ElForm } from 'element-plus'
import { cloneDeep, isUndefined } from 'lodash'

export default function useForm(
  items: MaybeRef<ReFormItem[]>,
  defaultValue?: MaybeRef<ReFormModelValue>,
  span?: MaybeRef<number | ReGridResponsive>,
  layout?: MaybeRef<string>,
) {
  const submiting = ref(false)
  const reFormRef = ref<InstanceType<typeof ElForm> | null>(null)
  const getFormRef = (form: MaybeRef<InstanceType<typeof ElForm> | null>) => {
    reFormRef.value = unref(form)
  }

  // 每个组件实例创建独立的缓存
  const itemConfigCache = new Map<string, ReFormItem>()
  // 添加清理缓存的方法
  const clearItemConfigCache = () => {
    itemConfigCache.clear()
  }

  const formItems: ShallowRef<ReFormItem[]> = shallowRef(
    normalizeFormItems(unref(items), unref(span), unref(layout)), // 传递 layout 参数
  )

  // 合并逻辑 - 利用相同递归
  const { modelValue, rules } = normalizeFormValueAndRules(
    formItems,
    defaultValue,
  )
  const formData: ShallowRef<ReFormModelValue> = shallowRef(modelValue)
  const formRules: ShallowRef<Partial<ReFormRules>> = shallowRef(rules)

  const { collapsedStatus, groupDependency } = normalizeCollapsed(formItems)

  const formCollapsed: Ref<Record<string, boolean>> = ref(collapsedStatus)
  const formGroupDependency: Ref<Record<string, string[]>>
    = ref(groupDependency)

  const formVisible: Ref<Record<string, boolean>> = computed(() => {
    return normalizeVisible(formItems, unref(formData))
  })

  const unwatchForm = watch(
    [() => unref(items), () => unref(layout)], // 同时监听items和layout
    () => {
      // 清除缓存，确保重新计算所有表单项的span
      clearItemConfigCache()
      // 重新计算表单配置，使用新的layout
      formItems.value = normalizeFormItems(unref(items), unref(span), unref(layout))
      formRules.value = normalizeFormRules(formItems.value)

      // 添加以下代码：重新计算表单数据，支持defaultValue动态更新
      const { modelValue: newModelValue } = normalizeFormValueAndRules(
        formItems,
        defaultValue,
      )

      // 仅更新发生变化的字段
      let hasChanges = false
      for (const field in newModelValue) {
        if (formData.value[field] !== newModelValue[field]) {
          formData.value[field] = cloneDeep(newModelValue[field])
          hasChanges = true
        }
      }

      if (hasChanges) {
        triggerRef(formData)
      }

      triggerRef(formItems)
      triggerRef(formRules)
    },
    { deep: true },
  )

  return {
    submiting,
    reFormRef,
    getFormRef,
    formData,
    formRules,
    formItems,
    formVisible,
    formCollapsed,
    formGroupDependency,
    unwatchForm,
    clearItemConfigCache, // 导出清理方法
    itemConfigCache, // 导出缓存对象，供useWatchForm使用
  }
}

export function useWatchForm(
  formItems: ShallowRef<ReFormItem[]>,
  formData: ShallowRef<ReFormModelValue>,
  props: ReFormProps,
  emits: ReFormEmits,
  itemConfigCache: Map<string, ReFormItem>, // 接收实例缓存
) {
  const renderFormItemsCache = computed(() => unref(formItems))

  const renderFormItems = computed(() => {
    // 恢复parentPath参数，确保分组层次结构被正确处理
    const travel = (originItems: ReFormItem[], parentPath = ''): ReFormItem[] => {
      return originItems.map((formItem: ReFormItem) => {
        // 生成缓存key，考虑分组层次结构
        const path = parentPath ? `${parentPath}.${formItem.field}` : formItem.field
        const cacheKey = formItem.field
          ? `${path}_${typeof formItem.component === 'string' ? formItem.component : 'component'}`
          : JSON.stringify({ type: formItem.type, component: typeof formItem.component === 'string' ? formItem.component : 'component', path })

        // 尝试从缓存获取配置，但只在非分组项上使用缓存
        if (formItem.type !== 'group' && itemConfigCache.has(cacheKey)) {
          const cachedItem = itemConfigCache.get(cacheKey)!
          // 只更新必要的属性，不重建整个对象
          if (cachedItem.props && cachedItem.field) {
            cachedItem.props[cachedItem.modelProp] = unref(formData)[cachedItem.field]
          }
          return cachedItem
        }

        // 为每个表单项创建一个新的副本，确保不影响原始配置
        const item: ReFormItem = cloneDeep(formItem)

        // 处理非分组表单项
        if (item.type !== 'group') {
          const field = item.field
          if (field) {
            // 创建更新事件处理函数
            const updateEvent = (value: any) => {
              // 使用nextTick确保更新的稳定性
              nextTick(() => {
                if (formData.value[field] !== value) {
                  formData.value[field] = value
                  emits('change', field, value, unref(formData))
                  // 只在必要时触发更新
                  triggerRef(formData)
                }
              })
            }

            // 修复wrapperEvent函数，正确调用事件处理函数
            const wrapperEvent = (originalEvent: Function | undefined, updateEvent: Function) => {
              return (value: any) => {
                // 先执行用户自定义事件
                if (typeof originalEvent === 'function') {
                  originalEvent(value)
                }
                // 然后执行表单更新事件
                updateEvent(value)
              }
            }

            // 确保props对象存在并设置modelValue
            if (isUndefined(item.props)) {
              item.props = {}
            }
            item.props[item.modelProp] = unref(formData)[field]

            // 确保events对象存在并设置事件处理函数
            if (isUndefined(item.events)) {
              item.events = {}
            }
            const originalEvent = item.events[item.modelEvent]
            item.events[item.modelEvent] = wrapperEvent(originalEvent, updateEvent)
          }

          // 存入缓存，确保组件实例的稳定性
          itemConfigCache.set(cacheKey, item)
        }
        else {
          // 检查item.children是否存在，避免处理空数组
          if (item.children && item.children.length) {
            // 传递分组路径，确保子项能够正确绑定到表单数据
            item.children = travel(item.children, formItem.field || parentPath)
          }
        }

        return item
      })
    }

    return travel(renderFormItemsCache.value)
  })

  const formDataProxy = computed(() => ({ ...unref(formData) }))

  // formData => shallwoRef
  const unwatchFormData = watch(formData, () => {
    if (!isUndefined(props.modelValue)) {
      emits('update:modelValue', unref(formData))
    }
  })

  // props.modelValue => shallwoRef
  const unwatchModelValue = watch(
    () => props.modelValue,
    () => {
      if (!isUndefined(props.modelValue)) {
        let changeFlag = false
        for (const field of Object.keys(unref(props.modelValue))) {
          if (
            Reflect.has(formData.value, field)
            && formData.value[field] !== props.modelValue[field]
          ) {
            formData.value[field] = props.modelValue[field]
            changeFlag = true
          }
        }
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

  return {
    renderFormItems,
    renderFormItemsCache,
    formDataProxy,
    unwatchModelValue,
    unwatchFormData,
  }
}
