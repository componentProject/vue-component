<!--
  DecoratorWrapper - 纯装饰器层
  
  职责：
  - 决定是否需要装饰器
  - 获取装饰器组件
  - 传递装饰器 props
  - 渲染 slot（内容由上层决定）
  
  不负责：
  - 组件渲染
  - 状态管理
  - 事件处理
-->
<template>
  <!-- 有装饰器 -->
  <component
    v-if="hasDecorator"
    :is="decoratorComponent"
    v-bind="computedDecoratorProps"
  >
    <slot />
  </component>

  <!-- 无装饰器：直接渲染内容 -->
  <slot v-else />
</template>

<script setup lang="ts">
import type { Component, ComputedRef } from 'vue'
import type { UIAdapter } from '../../types'
import { computed, inject } from 'vue'

/**
 * 装饰器配置类型
 */
type DecoratorConfig = false | string | Component | [string | Component, Record<string, any>]

defineOptions({
  name: 'DecoratorWrapper',
})

const props = defineProps<{
  /**
   * 装饰器配置
   * - false: 不使用装饰器
   * - string: 从 adapter.decorators 获取
   * - Component: 直接使用组件
   * - [Component, props]: 组件 + 额外 props
   */
  decorator?: DecoratorConfig
  /**
   * 装饰器 props
   */
  decoratorProps?: Record<string, any>
  /**
   * 是否使用默认装饰器（FormItem）
   * 当 decorator 为 undefined 时生效
   * @default true
   */
  useDefaultDecorator?: boolean
}>()

// 注入 adapter
const adapter = inject<ComputedRef<UIAdapter>>('configFormAdapter')

/**
 * 是否需要装饰器
 */
const hasDecorator = computed(() => {
  // 显式设置 false 则不使用
  if (props.decorator === false) {
    return false
  }
  // 有明确指定装饰器
  if (props.decorator) {
    return true
  }
  // 使用默认装饰器
  return props.useDefaultDecorator !== false
})

/**
 * 获取装饰器组件
 *
 * 优先级：
 * 1. 数组形式 [Component, props] - 取第一个元素
 * 2. 字符串形式 - 从 adapter.decorators 查找
 * 3. 组件实例 - 直接使用
 * 4. undefined - 使用默认 FormItem
 */
const decoratorComponent = computed(() => {
  const decorator = props.decorator

  // 数组形式：[Component, extraProps]
  if (Array.isArray(decorator)) {
    const [comp] = decorator
    if (typeof comp === 'string') {
      return adapter?.value.decorators?.[comp] || adapter?.value.layout?.formItem
    }
    return comp
  }

  // 字符串形式：从 adapter.decorators 查找
  if (typeof decorator === 'string') {
    return adapter?.value.decorators?.[decorator] || adapter?.value.layout?.formItem
  }

  // 组件实例
  if (decorator) {
    return decorator
  }

  // 默认：FormItem
  return adapter?.value.layout?.formItem
})

/**
 * 计算装饰器 props
 *
 * 合并来源：
 * 1. 数组形式的第二个元素 [Component, extraProps]
 * 2. decoratorProps 属性
 */
const computedDecoratorProps = computed(() => {
  const baseProps = { ...props.decoratorProps }

  // 数组形式的额外 props
  if (Array.isArray(props.decorator) && props.decorator[1]) {
    Object.assign(baseProps, props.decorator[1])
  }

  return baseProps
})
</script>

