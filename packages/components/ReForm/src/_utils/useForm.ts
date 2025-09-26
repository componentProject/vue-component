import {
  computed,

  ref,

  shallowRef,

  triggerRef,
  unref,
  watch,
  nextTick
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
} from './index.ts'
import type { ElForm } from 'element-plus'
import { cloneDeep, isUndefined } from 'lodash'

export default function useForm(
  items: MaybeRef<ReFormItem[]>,
  defaultValue?: MaybeRef<ReFormModelValue>,
  span?: MaybeRef<number | ReGridResponsive>,
) {
  const submiting = ref(false)
  const reFormRef = ref<InstanceType<typeof ElForm> | null>(null)
  const getFormRef = (form: MaybeRef<InstanceType<typeof ElForm> | null>) => {
    reFormRef.value = unref(form)
  }

  const formItems: ShallowRef<ReFormItem[]> = shallowRef(
    normalizeFormItems(unref(items), unref(span)),
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
    () => unref(items),
    () => {
      formItems.value = normalizeFormItems(unref(items), unref(span))
      formRules.value = normalizeFormRules(formItems.value)
      triggerRef(formItems)
      triggerRef(formRules)
    },
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
  }
}

// 添加一个缓存来存储组件配置对象
const itemConfigCache = new Map<string, ReFormItem>()

export function useWatchForm(
  formItems: ShallowRef<ReFormItem[]>,
  formData: ShallowRef<ReFormModelValue>,
  props: ReFormProps,
  emits: ReFormEmits,
) {
  const renderFormItemsCache = computed(() => unref(formItems))

  const renderFormItems = computed(() => {
    const travel = (originItems: ReFormItem[]): ReFormItem[] => {
      return originItems.map((formItem: ReFormItem) => {
        // 生成缓存key，基于field和component名称
        const cacheKey = formItem.field
          ? `${formItem.field}_${typeof formItem.component === 'string' ? formItem.component : 'component'}`
          : JSON.stringify({type: formItem.type, component: typeof formItem.component === 'string' ? formItem.component : 'component'})

        // 尝试从缓存获取配置
        if (itemConfigCache.has(cacheKey)) {
          const cachedItem = itemConfigCache.get(cacheKey)!
          // 只更新必要的属性，不重建整个对象
          if (cachedItem.props && cachedItem.field) {
            // 避免整个props对象被替换，只更新modelValue
            cachedItem.props[cachedItem.modelProp] = unref(formData)[cachedItem.field]
          }
          return cachedItem
        }

        const item: ReFormItem = cloneDeep(formItem)
        if (item.type !== 'group') {
          const field = item.field
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

          const wrapperEvent = (...rest: Function[]) => {
            const events = [...rest]
            return (value: any) => {
              for (const event of events) {
                event.apply(value)
              }
            }
          }

          if (isUndefined(item.props)) {
            item.props = {
              [item.modelProp]: unref(formData)[item.field],
            }
          }
          else {
            item.props[item.modelProp] = unref(formData)[item.field]
          }

          if (isUndefined(item.events)) {
            item.events = {
              [item.modelEvent]: updateEvent,
            }
          }
          else {
            if (isUndefined(item.events[item.modelEvent])) {
              item.events[item.modelEvent] = updateEvent
            }
            else {
              item.events[item.modelEvent] = wrapperEvent(
                updateEvent,
                item.events[item.modelEvent],
              )
            }
          }
        }
        else {
          item.children = travel(item.children)
        }

        // 存入缓存
        itemConfigCache.set(cacheKey, item)
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

// 添加清理缓存的函数，避免内存泄漏
function clearItemConfigCache() {
  itemConfigCache.clear()
}

// 导出清理函数以便在组件卸载时调用
export { clearItemConfigCache }
