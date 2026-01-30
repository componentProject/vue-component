<!-- GroupDecorator - 分组装饰器 -->
<template>
  <div class="config-form-group-decorator">
    <!-- 分组标题 -->
    <div v-if="title" class="config-form-group-decorator__header">
      <span class="config-form-group-decorator__title">{{ title }}</span>
    </div>
    <!-- 分组内容 -->
    <div class="config-form-group-decorator__content">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FieldConfig, FormContext } from '../../types'
import { defineAsyncComponent } from 'vue'

defineOptions({
  name: 'GroupDecorator',
})

const props = defineProps<{
  /** 分组标题 */
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

/**
 * 计算子字段路径
 * 布局字段不产生数据，子字段路径不嵌套
 */
function getChildPath(childName: string): string {
  return childName
}
</script>

<style scoped>
.config-form-group-decorator {
  margin-bottom: 16px;
}

.config-form-group-decorator__header {
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color-light, #e4e7ed);
}

.config-form-group-decorator__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary, #303133);
}

.config-form-group-decorator__content {
  /* 子字段内容区域 */
}
</style>

