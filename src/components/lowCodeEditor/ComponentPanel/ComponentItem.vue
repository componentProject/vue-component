<template>
  <div
    class="component-item p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
    draggable="true"
    @dragstart="handleDragStart"
    :data-component-type="component.type"
    :data-component-data="JSON.stringify(component)"
  >
    <div class="flex items-center">
      <div class="component-icon mr-2 text-xl text-gray-500">
        <i :class="component.icon || 'el-icon-picture'"></i>
      </div>
      <div class="component-info">
        <div class="component-name text-sm font-medium">{{ component.name }}</div>
        <div class="component-type text-xs text-gray-500">{{ component.type }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from '../types'

/**
 * 组件属性定义
 */
const props = defineProps<{
  component: Component
}>()

/**
 * 事件定义
 */
const emit = defineEmits<{
  (e: 'drag-start', component: Component): void
}>()

/**
 * 处理拖拽开始事件
 */
function handleDragStart(event: DragEvent) {
  try {
    if (!event.dataTransfer) return

    // 设置拖拽数据
    event.dataTransfer.setData('application/json', JSON.stringify(props.component))

    // 设置拖拽效果
    event.dataTransfer.effectAllowed = 'copy'

    // 触发父组件事件
    emit('drag-start', props.component)
  } catch (error) {
    console.error('拖拽开始处理失败:', error)
  }
}
</script>

<style scoped>
.component-item {
  transition: all 0.2s ease;
}

.component-item:hover {
  border-color: #409eff;
}

.component-item.dragging {
  opacity: 0.5;
}
</style>
