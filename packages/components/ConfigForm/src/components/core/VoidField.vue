<!--
  VoidField - 布局字段渲染器
  
  职责：
  - 渲染布局容器（Card/Tabs/Collapse/Group）
  - 递归渲染子字段
  - 不产生数据
  
  对齐 Formily：VoidField 用于纯布局，不参与数据管理
-->
<template>
  <template v-if="shouldRender">
    <!-- 装饰器层（布局装饰器） -->
    <DecoratorWrapper
      :decorator="layoutDecorator"
      :decorator-props="decoratorProps"
      :use-default-decorator="false"
    >
      <!-- 对于简单布局（group），直接递归渲染子字段 -->
      <template v-if="isSimpleLayout">
        <RecursionField
          v-for="(childField, childName) in field.properties"
          :key="childName"
          :field="childField"
          :path="String(childName)"
          :context="context"
        />
      </template>

      <!-- 对于复杂布局（tabs/collapse），由装饰器组件处理 -->
      <!-- 装饰器组件会递归渲染子字段 -->
    </DecoratorWrapper>
  </template>
</template>

<script setup lang="ts">
import type { Component, ComputedRef } from 'vue'
import type { FormContext, UIAdapter, VoidFieldConfig } from '../../types'
import { computed, defineAsyncComponent, inject, toRef } from 'vue'
import { useFieldExpression } from '../../composables/useFieldExpression'
import DecoratorWrapper from './DecoratorWrapper.vue'

// 内置布局装饰器
import { CardDecorator, CollapseDecorator, GroupDecorator, TabsDecorator } from '../decorators'

/**
 * 内置布局装饰器映射
 */
const builtinDecorators: Record<string, Component> = {
  card: CardDecorator,
  tabs: TabsDecorator,
  collapse: CollapseDecorator,
  group: GroupDecorator,
  void: GroupDecorator,
}

// 异步加载 RecursionField 避免循环依赖
const RecursionField = defineAsyncComponent(() => import('./RecursionField.vue'))

defineOptions({
  name: 'VoidField',
})

const props = defineProps<{
  /** 布局字段配置 */
  field: VoidFieldConfig
  /** 字段路径 */
  path: string
  /** 表单上下文 */
  context: FormContext
}>()

// ==================== 注入 ====================

const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')
const decoratorComponents = computed(() => adapter?.value.decorators || {})

// ==================== 状态计算 ====================

const {
  formValues,
  formHandlers,
  executeDisplay,
} = useFieldExpression(
  toRef(props, 'field'),
  computed(() => undefined), // VoidField 没有值
  computed(() => undefined),
  toRef(props, 'context'),
)

const formValuesJSON = computed(() => JSON.stringify(formValues))

const shouldRender = computed(() => {
  void formValuesJSON.value
  return executeDisplay() !== 'none'
})

// ==================== 布局配置 ====================

/**
 * 获取布局类型
 */
const layoutType = computed(() => props.field.layout || 'group')

/**
 * 是否是简单布局（直接渲染子字段）
 * 复杂布局（tabs/collapse）由装饰器组件处理子字段渲染
 */
const isSimpleLayout = computed(() => {
  const type = layoutType.value
  // group 和 card 是简单布局，只有 properties
  // tabs 和 collapse 是复杂布局，有 tabs/panels
  return type === 'group' || type === 'card' || type === 'void'
})

/**
 * 布局装饰器
 */
const layoutDecorator = computed<string | Component>(() => {
  const layout = layoutType.value

  // 先从 adapter.decorators 查找
  if (decoratorComponents.value[layout]) {
    return decoratorComponents.value[layout]!
  }

  // 使用内置装饰器
  return builtinDecorators[layout] || builtinDecorators.group
})

/**
 * 装饰器 props
 */
const decoratorProps = computed(() => {
  const baseProps: Record<string, any> = {
    path: props.path,
    context: props.context,
  }

  // 通用属性
  if (props.field.title) {
    baseProps.title = props.field.title
  }

  // Card/Group: properties
  if (props.field.properties) {
    baseProps.properties = props.field.properties
  }

  // Tabs: tabs 配置
  if ('tabs' in props.field && props.field.tabs) {
    baseProps.tabs = props.field.tabs
  }
  if ('tabPosition' in props.field) {
    baseProps.tabPosition = (props.field as any).tabPosition
  }
  if ('defaultActiveKey' in props.field) {
    baseProps.defaultActiveKey = (props.field as any).defaultActiveKey
  }

  // Collapse: panels 配置
  if ('panels' in props.field && props.field.panels) {
    baseProps.panels = props.field.panels
  }
  if ('accordion' in props.field) {
    baseProps.accordion = (props.field as any).accordion
  }

  // decoratorProps 透传
  if (props.field.decoratorProps) {
    Object.assign(baseProps, props.field.decoratorProps)
  }

  return baseProps
})
</script>

