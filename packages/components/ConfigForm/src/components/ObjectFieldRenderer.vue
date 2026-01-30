<!-- ObjectFieldRenderer - 对象字段渲染器 -->
<template>
  <div class="config-form-object" :class="layoutClass">
    <!-- 对象标题 -->
    <div v-if="computedTitle" class="config-form-object__header">
      <span class="config-form-object__title">{{ computedTitle }}</span>
    </div>

    <!-- 子字段渲染 -->
    <component :is="layoutComponents.row" :gutter="16">
      <template v-for="(childField, childName) in childFields" :key="childName">
        <component :is="layoutComponents.col" v-bind="getColProps(childField)">
          <FieldRenderer
            :field="childField"
            :path="getChildPath(childName as string)"
            :context="context"
          >
            <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
              <slot :name="slotName" v-bind="slotProps" />
            </template>
          </FieldRenderer>
        </component>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { FieldConfig, FormContext, ObjectFieldConfig, UIAdapter } from '../types'
import { computed, inject } from 'vue'
import { executeExpression } from '../utils'
import FieldRenderer from './FieldRenderer.vue'

defineOptions({
  name: 'ObjectFieldRenderer',
})

const props = defineProps<{
  /** 字段配置 */
  field: ObjectFieldConfig
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
}>()

defineEmits<{
  (e: 'change', value: Record<string, any>): void
}>()

defineModel<Record<string, any>>({ default: () => ({}) })

const formHandlers = inject<Record<string, (...args: any[]) => any>>('configFormHandlers', {})

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

// 布局组件快捷访问
const layoutComponents = computed(() => adapter?.value.layout || {})

// 子字段配置
const childFields = computed<Record<string, FieldConfig>>(() => {
  return props.field.properties || {}
})

// 计算标题
const computedTitle = computed(() => {
  if (!props.field.title)
    return undefined
  return executeExpression(props.field.title, props.context, { handlers: formHandlers })
})

// 布局模式
const layout = computed(() => props.field.layout || 'horizontal')

// 布局类名
const layoutClass = computed(() => {
  return `config-form-object--${layout.value}`
})

/**
 * 获取子字段路径
 */
function getChildPath(childName: string): string {
  return props.path ? `${props.path}.${childName}` : childName
}

/**
 * 获取栅格属性
 */
function getColProps(field: FieldConfig) {
  if (field.col) {
    const col = executeExpression(field.col, props.context, { handlers: formHandlers })
    return col
  }

  // 根据布局模式设置默认栅格
  switch (layout.value) {
    case 'inline':
      return { span: 8 }
    case 'vertical':
      return { span: 24 }
    default:
      return { span: 24 }
  }
}
</script>

<style scoped>
.config-form-object {
  margin-bottom: 16px;
}

.config-form-object__header {
  margin-bottom: 12px;
}

.config-form-object__title {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.config-form-object--inline {
  :deep(.el-form-item) {
    display: inline-flex;
    margin-right: 16px;
  }
}

.config-form-object--vertical {
  :deep(.el-form-item) {
    flex-direction: column;
    align-items: flex-start;
  }

  :deep(.el-form-item__label) {
    text-align: left;
    padding-bottom: 4px;
  }
}
</style>
