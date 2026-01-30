<!-- TabsDecorator - 标签页装饰器 -->
<template>
  <component
    :is="tabsComponent"
    v-model="activeKey"
    :tab-position="tabPosition"
    class="config-form-tabs-decorator"
  >
    <component
      :is="tabPaneComponent"
      v-for="tab in tabs"
      :key="tab.key"
      :name="tab.key"
      :tab="tab.title"
      :label="tab.title"
      :disabled="tab.disabled"
    >
      <!-- 渲染标签页中的子字段 -->
      <RecursionField
        v-for="(childField, childName) in tab.properties"
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
import type { FieldConfig, FormContext, TabPane, UIAdapter } from '../../types'
import { computed, defineAsyncComponent, inject, ref } from 'vue'

defineOptions({
  name: 'TabsDecorator',
})

const props = defineProps<{
  /** 标签页配置 */
  tabs?: TabPane[]
  /** 标签页位置 */
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  /** 默认激活的标签 */
  defaultActiveKey?: string
  /** 当前路径 */
  path?: string
  /** 表单上下文 */
  context?: FormContext
}>()

// 异步加载 FieldRenderer 避免循环依赖
const RecursionField = defineAsyncComponent(() => import('../core/RecursionField.vue'))

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

// 当前激活的标签页
const activeKey = ref(props.defaultActiveKey || props.tabs?.[0]?.key || '')

// 获取 Tabs 组件
const tabsComponent = computed(() => adapter?.value.layout?.tabs)

// 获取 TabPane 组件
const tabPaneComponent = computed(() => adapter?.value.layout?.tabPane)

/**
 * 计算子字段路径
 * 布局字段不产生数据，子字段路径不嵌套
 */
function getChildPath(childName: string): string {
  return childName
}
</script>

<style scoped>
.config-form-tabs-decorator {
  margin-bottom: 16px;
}

.config-form-tabs-decorator :deep(.el-tabs__content),
.config-form-tabs-decorator :deep(.ant-tabs-content) {
  padding: 16px 0;
}
</style>

