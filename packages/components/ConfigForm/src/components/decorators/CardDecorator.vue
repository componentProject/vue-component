<!-- CardDecorator - 卡片装饰器 -->
<template>
  <component
    :is="cardComponent"
    :header="title"
    :title="title"
    class="config-form-card-decorator"
  >
    <!-- 渲染子字段 -->
    <template v-if="properties">
      <RecursionField
        v-for="(childField, childName) in properties"
        :key="childName"
        :field="childField"
        :path="getChildPath(String(childName))"
        :context="context"
      />
    </template>
    <!-- 默认 slot -->
    <slot v-else />
  </component>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { FieldConfig, FormContext, UIAdapter } from '../../types'
import { computed, defineAsyncComponent, inject } from 'vue'

defineOptions({
  name: 'CardDecorator',
})

const props = defineProps<{
  /** 卡片标题 */
  title?: string
  /** 子字段配置 */
  properties?: Record<string, FieldConfig>
  /** 当前路径 */
  path?: string
  /** 表单上下文 */
  context?: FormContext
}>()

// 异步加载 FieldRenderer 避免循环依赖
const RecursionField = defineAsyncComponent(() => import('../core/RecursionField.vue'))

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

// 获取 Card 组件
const cardComponent = computed(() => adapter?.value.layout?.card)

/**
 * 计算子字段路径
 * 布局字段不产生数据，子字段路径不嵌套
 */
function getChildPath(childName: string): string {
  return childName
}
</script>

<style scoped>
.config-form-card-decorator {
  margin-bottom: 16px;
}

.config-form-card-decorator :deep(.el-card__header),
.config-form-card-decorator :deep(.ant-card-head) {
  padding: 12px 16px;
}

.config-form-card-decorator :deep(.el-card__body),
.config-form-card-decorator :deep(.ant-card-body) {
  padding: 16px;
}
</style>

