<!--
  FieldComponent - 纯组件层
  
  职责：
  - 获取字段组件
  - 渲染组件 UI
  - 转发事件
  
  不负责：
  - 装饰器
  - 状态管理
  - 数据处理
-->
<template>
  <!-- ReadPretty 模式：纯文本展示 -->
  <div
    v-if="readPretty"
    class="field-component__read-pretty"
  >
    <span class="field-component__text">{{ formattedValue }}</span>
  </div>

  <!-- 标准组件渲染 -->
  <component
    v-else-if="fieldComponent"
    :is="fieldComponent"
    :model-value="modelValue"
    :disabled="disabled"
    :readonly="readonly"
    v-bind="computedProps"
    @update:model-value="handleUpdate"
    @change="handleChange"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <!-- Options 渲染（select/radio/checkbox） -->
    <template v-if="hasOptions && !useOptionsAsProps">
      <component
        v-for="opt in options"
        :key="opt.value"
        :is="optionComponent"
        :label="getOptionLabel(opt)"
        :value="opt.value"
        :disabled="opt.disabled"
      >
        <template v-if="needsOptionContent">
          {{ opt.label }}
        </template>
      </component>
    </template>

    <!-- 透传 slot -->
    <slot />
  </component>
</template>

<script setup lang="ts">
import type { Component, ComputedRef } from 'vue'
import type { UIAdapter } from '../../types'
import { computed, inject } from 'vue'
import { getFieldComponent } from '../../utils'

/**
 * 组件配置类型
 */
type ComponentConfig = string | Component | [string | Component, Record<string, any>]

/**
 * 选项类型
 */
interface OptionItem {
  label: string
  value: any
  disabled?: boolean
}

defineOptions({
  name: 'FieldComponent',
})

const props = defineProps<{
  /**
   * 组件配置
   * - string: 从 adapter.fields 获取（type 值）
   * - Component: 直接使用组件
   * - [Component, props]: 组件 + 额外 props
   */
  component: ComponentConfig
  /**
   * 组件值
   */
  modelValue?: any
  /**
   * 组件 props
   */
  componentProps?: Record<string, any>
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否只读
   */
  readonly?: boolean
  /**
   * 是否阅读态（纯文本）
   */
  readPretty?: boolean
  /**
   * 选项列表（select/radio/checkbox）
   */
  options?: OptionItem[]
  /**
   * 字段类型（用于确定 option 组件）
   */
  fieldType?: string
  /**
   * 格式化后的值（readPretty 模式显示）
   */
  formattedValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', value: any): void
  (e: 'focus'): void
  (e: 'blur'): void
}>()

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')
const adapterFeatures = computed(() => adapter?.value.features || {})
const optionComponents = computed(() => adapterFeatures.value.optionComponents || {})
const useOptionsAsProps = computed(() => adapterFeatures.value.optionsAsProps === true)

/**
 * 获取字段组件
 */
const fieldComponent = computed(() => {
  const comp = props.component

  // 数组形式：[Component, extraProps]
  if (Array.isArray(comp)) {
    const [c] = comp
    if (typeof c === 'string') {
      return getFieldComponent(adapter?.value.fields?.[c])
    }
    return c
  }

  // 字符串形式：从 adapter.fields 获取
  if (typeof comp === 'string') {
    return getFieldComponent(adapter?.value.fields?.[comp])
  }

  // 组件实例
  return comp
})

/**
 * 计算组件 props
 */
const computedProps = computed(() => {
  const baseProps = { ...props.componentProps }

  // 数组形式的额外 props
  if (Array.isArray(props.component) && props.component[1]) {
    Object.assign(baseProps, props.component[1])
  }

  // multiSelect 添加 multiple
  if (props.fieldType === 'multiSelect') {
    baseProps.multiple = true
  }

  // options 作为 props 传递
  if (useOptionsAsProps.value && props.options?.length) {
    baseProps.options = props.options
  }

  return baseProps
})

/**
 * 是否有选项
 */
const hasOptions = computed(() => {
  const type = props.fieldType
  return type ? ['select', 'multiSelect', 'radio', 'checkbox'].includes(type) : false
})

/**
 * 是否需要 option 内容（radio/checkbox）
 */
const needsOptionContent = computed(() => {
  const type = props.fieldType
  return type ? ['radio', 'checkbox'].includes(type) : false
})

/**
 * 获取 option 组件
 */
const optionComponent = computed(() => {
  const components = optionComponents.value
  switch (props.fieldType) {
    case 'select':
    case 'multiSelect':
      return components.select
    case 'radio':
      return components.radio
    case 'checkbox':
      return components.checkbox
    default:
      return components.select
  }
})

/**
 * 获取 option label
 */
function getOptionLabel(opt: OptionItem) {
  const type = props.fieldType
  if (type === 'select' || type === 'multiSelect') {
    return opt.label
  }
  return opt.value
}

/**
 * 处理值更新
 */
function handleUpdate(value: any) {
  emit('update:modelValue', value)
}

/**
 * 处理 change 事件
 */
function handleChange(value: any) {
  emit('change', value)
}
</script>

<style scoped>
.field-component__read-pretty {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-height: 32px;
  line-height: 32px;
  color: var(--el-text-color-primary, #303133);
  width: 100%;
  box-sizing: border-box;
}

.field-component__text {
  word-break: break-word;
}
</style>

