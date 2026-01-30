<!-- CollapseDecorator - 折叠面板装饰器 -->
<template>
  <component
    :is="collapseComponent"
    v-model="activeKeys"
    :accordion="accordion"
    class="config-form-collapse-decorator"
  >
    <component
      :is="collapseItemComponent"
      v-for="panel in panels"
      :key="panel.key"
      :name="panel.key"
      :title="panel.title"
      :disabled="panel.disabled"
    >
      <!-- Element Plus 使用具名插槽 -->
      <template #title>
        {{ panel.title }}
      </template>
      <!-- 渲染面板中的子字段 -->
      <RecursionField
        v-for="(childField, childName) in panel.properties"
        :key="childName"
        :field="childField"
        :path="getChildPath(String(childName))"
        :context="context"
      />
    </component>
  </component>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import type { CollapsePanel, FieldConfig, FormContext, UIAdapter } from '../../types'
import { computed, defineAsyncComponent, inject, ref } from 'vue'

defineOptions({
  name: 'CollapseDecorator',
})

const props = defineProps<{
  /** 面板配置 */
  panels?: CollapsePanel[]
  /** 是否手风琴模式 */
  accordion?: boolean
  /** 默认展开的面板 */
  defaultActiveKey?: string[]
  /** 当前路径 */
  path?: string
  /** 表单上下文 */
  context?: FormContext
}>()

// 异步加载 FieldRenderer 避免循环依赖
const RecursionField = defineAsyncComponent(() => import('../core/RecursionField.vue'))

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

// 当前展开的面板
const activeKeys = ref<string[]>(props.defaultActiveKey || [props.panels?.[0]?.key || ''])

// 获取 Collapse 组件
const collapseComponent = computed(() => adapter?.value.layout?.collapse)

// 获取 CollapseItem 组件
const collapseItemComponent = computed(() => adapter?.value.layout?.collapseItem)

/**
 * 计算子字段路径
 * 布局字段不产生数据，子字段路径不嵌套
 */
function getChildPath(childName: string): string {
  return childName
}
</script>

<style scoped>
.config-form-collapse-decorator {
  margin-bottom: 16px;
}

.config-form-collapse-decorator :deep(.el-collapse-item__content),
.config-form-collapse-decorator :deep(.ant-collapse-content-box) {
  padding: 16px;
}
</style>

