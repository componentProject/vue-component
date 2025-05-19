<template>
  <component
    :is="componentTag"
    v-bind="componentProps"
    :style="component.style"
    class="component-preview-node"
  >
    <!-- 如果有子组件，递归渲染 -->
    <template v-if="component.children && component.children.length">
      <component-preview-node
        v-for="child in component.children"
        :key="child.id"
        :component="child"
      />
    </template>

    <!-- 如果是文本内容的组件，显示文本 -->
    <template v-else-if="component.props?.text">
      {{ component.props.text }}
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from '../types'

/**
 * 组件属性定义
 */
const props = defineProps<{
  component: Component
}>()

/**
 * 计算组件标签名
 */
const componentTag = computed(() => {
  try {
    // 如果是Element Plus组件，直接使用该标签
    if (props.component.type.startsWith('el-')) {
      return props.component.type
    }

    // 对于图表组件，使用适当的包装组件
    if (props.component.type.endsWith('-chart')) {
      return 'chart-wrapper'
    }

    // 默认使用div作为容器
    return 'div'
  } catch (error) {
    console.error('计算组件标签失败:', error)
    return 'div'
  }
})

/**
 * 计算组件属性
 */
const componentProps = computed(() => {
  try {
    // 返回组件的属性，但排除可能在预览模式下不需要的属性
    const { text, ...otherProps } = props.component.props
    return otherProps
  } catch (error) {
    console.error('计算组件属性失败:', error)
    return {}
  }
})
</script>

<style scoped>
.component-preview-node {
  position: relative;
}
</style>
