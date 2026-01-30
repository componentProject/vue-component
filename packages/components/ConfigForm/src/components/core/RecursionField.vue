<!--
  RecursionField - 递归字段入口
  
  职责：
  - 根据字段类型路由到正确的渲染器
  - 递归渲染嵌套字段
  
  对齐 Formily：RecursionField 是字段渲染的统一入口
  
  字段类型判断：
  - VoidField: field.layout 存在 → 布局字段
  - ArrayField: field.type === 'array' 且没有 component → 数组字段
  - ObjectField: field.type === 'object' 且没有 component → 对象字段
  - Field: 其他 → 数据字段
-->
<template>
  <!-- 布局字段（VoidField） -->
  <VoidField
    v-if="isVoidField"
    :field="voidField"
    :path="path"
    :context="context"
  />

  <!-- 数组字段 -->
  <ArrayFieldRenderer
    v-else-if="isArrayField"
    v-model="arrayValue"
    :field="arrayField"
    :path="path"
    :context="context"
    @change="handleChange"
  />

  <!-- 对象字段 -->
  <ObjectFieldRenderer
    v-else-if="isObjectField"
    v-model="objectValue"
    :field="objectField"
    :path="path"
    :context="context"
  />

  <!-- 数据字段 -->
  <Field
    v-else
    :field="field"
    :path="path"
    :context="context"
    @change="handleChange"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  />
</template>

<script setup lang="ts">
import type {
  ArrayFieldConfig,
  FieldConfig,
  FormContext,
  ObjectFieldConfig,
  VoidFieldConfig,
} from '../../types'
import { computed, defineAsyncComponent, inject } from 'vue'
import { getNestedValue, setNestedValue } from '../../utils'
import Field from './Field.vue'
import VoidField from './VoidField.vue'

// 异步加载复杂字段渲染器（避免循环依赖）
const ArrayFieldRenderer = defineAsyncComponent(() => import('../ArrayFieldRenderer.vue'))
const ObjectFieldRenderer = defineAsyncComponent(() => import('../ObjectFieldRenderer.vue'))

defineOptions({
  name: 'RecursionField',
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

// 注入表单值
const formValues = inject<any>('configFormValues')

// ==================== 字段类型判断 ====================

/**
 * 是否是布局字段（VoidField）
 * 通过 layout 属性判断
 */
const isVoidField = computed(() => {
  return 'layout' in props.field && props.field.layout != null
})

/**
 * 是否是数组字段
 * 条件：type === 'array' 且没有自定义 component
 */
const isArrayField = computed(() => {
  const f = props.field as any
  return f.type === 'array' && !f.component
})

/**
 * 是否是对象字段
 * 条件：type === 'object' 且没有自定义 component
 */
const isObjectField = computed(() => {
  const f = props.field as any
  return f.type === 'object' && !f.component
})

// ==================== 类型化字段 ====================

const voidField = computed(() => props.field as VoidFieldConfig)
const arrayField = computed(() => props.field as ArrayFieldConfig)
const objectField = computed(() => props.field as ObjectFieldConfig)

// ==================== 值处理 ====================

const arrayValue = computed({
  get() {
    return getNestedValue(formValues, props.path) || []
  },
  set(value) {
    setNestedValue(formValues, props.path, value)
  },
})

const objectValue = computed({
  get() {
    return getNestedValue(formValues, props.path) || {}
  },
  set(value) {
    setNestedValue(formValues, props.path, value)
  },
})

// ==================== 事件处理 ====================

function handleChange(value: any) {
  emit('change', value)
}
</script>

