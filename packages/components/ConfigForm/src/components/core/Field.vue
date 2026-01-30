<!--
  Field - 数据字段渲染器
  
  职责：
  - 状态管理（value, disabled, readonly, readPretty）
  - 组合 DecoratorWrapper + FieldComponent
  - 事件处理
  - 表达式计算
  
  对齐 Formily：Field 组件负责数据字段的完整渲染
-->
<template>
  <template v-if="shouldRender">
    <!-- 装饰器层 -->
    <DecoratorWrapper
      :decorator="field.decorator"
      :decorator-props="decoratorProps"
      :use-default-decorator="useDefaultDecorator"
    >
      <!-- 自定义字段插槽 -->
      <template v-if="$slots[`field-${fieldName}`]">
        <slot
          :name="`field-${fieldName}`"
          :field="field"
          :path="path"
          :value="fieldValue"
          :context="context"
          :disabled="isDisabled"
          :readonly="isReadonly"
          :read-pretty="isReadPretty"
        />
      </template>

      <!-- 组件层 -->
      <FieldComponent
        v-else
        :component="componentConfig"
        :model-value="fieldValue"
        :component-props="componentProps"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :read-pretty="isReadPretty"
        :options="computedOptions"
        :field-type="fieldType"
        :formatted-value="formattedValue"
        @update:model-value="handleModelUpdate"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </DecoratorWrapper>
  </template>
</template>

<script setup lang="ts">
import type { Component, ComputedRef } from 'vue'
import type { FieldConfig, FieldState, FormContext, SelectFieldConfig, UIAdapter } from '../../types'
import { computed, inject, toRef, watch } from 'vue'
import { useFieldExpression } from '../../composables/useFieldExpression'
import { executeExpression, getNestedValue, setNestedValue } from '../../utils'
import DecoratorWrapper from './DecoratorWrapper.vue'
import FieldComponent from './FieldComponent.vue'

/**
 * 选项类型
 */
interface OptionItem {
  label: string
  value: any
  disabled?: boolean
}

defineOptions({
  name: 'Field',
})

const props = defineProps<{
  /** 字段配置 */
  field: FieldConfig
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
}>()

const emit = defineEmits<{
  (e: 'change', value: any): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

// ==================== 注入 ====================

const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')
const fieldStates = inject<Map<string, FieldState>>('configFormFieldStates', new Map())
const adapterFeatures = computed(() => adapter?.value.features || {})

// ==================== 基础计算 ====================

const fieldName = computed(() => props.field.name || props.path)
const fieldType = computed(() => (props.field as any).type as string || '')
const fieldState = computed(() => fieldStates.get(props.path))

// ==================== 字段值 ====================

const {
  formValues,
  formHandlers,
  executeDisplay,
  executePattern,
  executeRequired,
} = useFieldExpression(
  toRef(props, 'field'),
  computed({
    get: () => getNestedValue(formValues, props.path),
    set: (v) => setNestedValue(formValues, props.path, v),
  }),
  fieldState,
  toRef(props, 'context'),
)

const fieldValue = computed({
  get() {
    return getNestedValue(formValues, props.path)
  },
  set(value) {
    setNestedValue(formValues, props.path, value)
  },
})

const formValuesJSON = computed(() => JSON.stringify(formValues))

// ==================== 状态计算 ====================

const shouldRender = computed(() => {
  void formValuesJSON.value
  return executeDisplay() !== 'none'
})

const isDisabled = computed(() => {
  void formValuesJSON.value
  return executePattern() === 'disabled'
})

const isReadonly = computed(() => {
  void formValuesJSON.value
  return executePattern() === 'readOnly'
})

const isReadPretty = computed(() => {
  void formValuesJSON.value
  return executePattern() === 'readPretty'
})

// ==================== 组件配置 ====================

/**
 * 组件配置
 * 优先使用 field.component，否则使用 field.type
 */
const componentConfig = computed<string | Component | [string | Component, Record<string, any>]>(() => {
  const field = props.field as any
  if (field.component) {
    return field.component
  }
  return field.type || 'input'
})

/**
 * 组件 props
 */
const componentProps = computed(() => {
  const baseProps: Record<string, any> = {}

  if (props.field.componentProps) {
    for (const [key, value] of Object.entries(props.field.componentProps)) {
      baseProps[key] = executeExpression(value, props.context, { handlers: formHandlers })
    }
  }

  // transformer
  if (adapter?.value.transformer?.field && fieldType.value) {
    return adapter.value.transformer.field(fieldType.value, baseProps, {
      field: props.field,
      path: props.path,
    })
  }

  return baseProps
})

// ==================== 装饰器配置 ====================

/**
 * 是否使用默认装饰器
 */
const useDefaultDecorator = computed(() => {
  // array/object 类型不使用 FormItem
  const type = (props.field as any).type
  if (type === 'array' || type === 'object') {
    return false
  }
  return true
})

/**
 * 装饰器 props
 */
const decoratorProps = computed(() => {
  const baseProps: Record<string, any> = {}

  // FormItem name/prop
  const nameProp = adapterFeatures.value.formItemNameProp || 'prop'
  if (nameProp === 'name') {
    baseProps.name = props.path.includes('.') ? pathToArray(props.path) : props.path
  }
  else {
    baseProps.prop = props.path
  }

  // Label
  if (props.field.title) {
    baseProps.label = executeExpression(props.field.title, props.context, { handlers: formHandlers })
  }

  // Required
  void formValuesJSON.value
  baseProps.required = executeRequired()

  // Rules
  const rules = computedRules.value
  if (rules.length > 0) {
    baseProps.rules = rules
  }

  // decoratorProps 透传
  if (props.field.decoratorProps) {
    for (const [key, value] of Object.entries(props.field.decoratorProps)) {
      baseProps[key] = executeExpression(value, props.context, { handlers: formHandlers })
    }
  }

  // transformer
  if (adapter?.value.transformer?.formItem) {
    return adapter.value.transformer.formItem(baseProps)
  }

  return baseProps
})

// ==================== 校验规则 ====================

const computedRules = computed(() => {
  const rules: any[] = []

  void formValuesJSON.value
  const required = executeRequired()

  if (required) {
    const label = props.field.title
      ? executeExpression(props.field.title, props.context, { handlers: formHandlers })
      : fieldName.value
    rules.push({
      required: true,
      message: `${label}不能为空`,
      trigger: props.field.validateTrigger || 'blur',
    })
  }

  if (props.field.rules) {
    for (const rule of props.field.rules) {
      if ('required' in rule && rule.required) {
        rules.push({
          required: true,
          message: rule.message || '不能为空',
          trigger: rule.trigger || 'blur',
        })
      }
    }
  }

  return rules
})

// ==================== 选项 ====================

const computedOptions = computed<OptionItem[]>(() => {
  void formValuesJSON.value
  const field = props.field as SelectFieldConfig
  const dataSource = field.dataSource
  if (!dataSource) {
    return []
  }

  switch (dataSource.type) {
    case 'static':
      return (dataSource.data || []) as OptionItem[]
    case 'computed':
      if (dataSource.expr) {
        const result = executeExpression(dataSource.expr, props.context, { handlers: formHandlers })
        return Array.isArray(result) ? result : []
      }
      return []
    case 'dict':
      if (dataSource.code) {
        const dictData = props.context.$context?.dicts?.[dataSource.code]
        return Array.isArray(dictData) ? dictData : []
      }
      return []
    case 'api':
    case 'cascade':
      return fieldState.value?.dataSource || []
    default:
      return []
  }
})

// ==================== ReadPretty 格式化 ====================

const formattedValue = computed(() => {
  const value = fieldValue.value
  if (value === undefined || value === null || value === '') {
    return '-'
  }

  switch (fieldType.value) {
    case 'switch':
      return value ? '是' : '否'
    case 'select':
    case 'radio': {
      const opt = computedOptions.value.find(o => o.value === value)
      return opt?.label || value
    }
    case 'multiSelect':
    case 'checkbox': {
      if (!Array.isArray(value)) {
        return value
      }
      return value.map((v) => {
        const opt = computedOptions.value.find(o => o.value === v)
        return opt?.label || v
      }).join('、')
    }
    default:
      return typeof value === 'object' ? JSON.stringify(value) : value
  }
})

// ==================== 事件处理 ====================

function handleModelUpdate(value: any) {
  fieldValue.value = value
  emit('change', value)
}

function handleChange(value: any) {
  emit('change', value)
  if (props.field.onChange && formHandlers[props.field.onChange]) {
    formHandlers[props.field.onChange](createHandlerContext(value, 'change'))
  }
}

function handleFocus() {
  emit('focus')
  if (props.field.onFocus && formHandlers[props.field.onFocus]) {
    formHandlers[props.field.onFocus](createHandlerContext(fieldValue.value, 'focus'))
  }
}

function handleBlur() {
  emit('blur')
  if (props.field.onBlur && formHandlers[props.field.onBlur]) {
    formHandlers[props.field.onBlur](createHandlerContext(fieldValue.value, 'blur'))
  }
}

function createHandlerContext(value: unknown, event: string) {
  return {
    ...props.context,
    value,
    path: props.path,
    field: props.field,
    event,
  }
}

// ==================== 工具函数 ====================

function pathToArray(path: string): (string | number)[] {
  return path.split('.').map((key) => {
    const num = Number.parseInt(key, 10)
    return Number.isNaN(num) ? key : num
  })
}

// ==================== 生命周期 ====================

watch(
  () => props.field,
  (field) => {
    if (!field) {
      return
    }
    if (field.onInit && formHandlers[field.onInit]) {
      formHandlers[field.onInit](createHandlerContext(fieldValue.value, 'init'))
    }
  },
  { immediate: true },
)
</script>

