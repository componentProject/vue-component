<template>
  <div
    class="component-node component-drop-zone"
    :class="{ 'component-selected': isSelected }"
    :data-component-id="component.id"
    :data-component-type="component.type"
    @click.stop="handleClick"
    @dragover.prevent
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
  >
    <!-- 组件内容渲染 -->
    <component
      :is="componentTag"
      v-bind="componentProps"
      :style="component.style"
      class="component-content"
    >
      <!-- 如果有子组件，递归渲染 -->
      <template v-if="component.children && component.children.length">
        <component-node
          v-for="child in component.children"
          :key="child.id"
          :component="child"
          :is-selected="isSelected && selectedChildId === child.id"
          :parent-id="component.id"
          @select="handleChildSelected"
          @delete="handleChildDeleted"
          @move="handleChildMoved"
          @drop="handleChildDropped"
        />
      </template>

      <!-- 如果是文本内容的组件，显示文本 -->
      <template v-else-if="component.props?.text">
        {{ component.props.text }}
      </template>
    </component>

    <!-- 选中状态下显示的操作工具栏 -->
    <div
      v-if="isSelected"
      class="component-toolbar absolute top-0 right-0 bg-blue-500 text-white text-xs rounded-bl"
    >
      <button
        class="toolbar-btn px-2 py-1 hover:bg-blue-600"
        title="删除"
        @click.stop="handleDelete"
      >
        <i class="el-icon-delete"></i>
      </button>
    </div>

    <!-- 组件拖动操作区域 -->
    <div
      v-if="isSelected"
      class="component-drag-handle absolute left-0 top-0 bg-blue-500 cursor-move rounded-br"
      title="拖动"
      draggable="true"
      @dragstart="handleDragStart"
    >
      <i class="el-icon-rank p-1 text-white text-xs"></i>
    </div>

    <!-- 辅助信息：显示组件类型和ID的提示 -->
    <div
      v-if="isSelected"
      class="component-info absolute bottom-0 left-0 right-0 text-center text-xs text-gray-500 bg-white bg-opacity-80 py-1"
    >
      {{ component.name }} ({{ component.type }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from '../types'

/**
 * 组件属性定义
 */
const props = defineProps<{
  component: Component
  isSelected: boolean
  parentId: string
}>()

/**
 * 事件定义
 */
const emit = defineEmits<{
  (e: 'select', component: Component): void
  (e: 'delete', componentId: string): void
  (e: 'move', componentId: string, newParentId: string, newIndex: number): void
  (e: 'drop', component: Component, parentId: string, index: number): void
}>()

/**
 * 当前选中的子组件ID
 */
const selectedChildId = ref<string | null>(null)

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
    return { ...props.component.props }
  } catch (error) {
    console.error('计算组件属性失败:', error)
    return {}
  }
})

/**
 * 点击组件事件处理
 */
function handleClick() {
  try {
    emit('select', props.component)
  } catch (error) {
    console.error('处理点击事件失败:', error)
  }
}

/**
 * 删除组件事件处理
 */
function handleDelete() {
  try {
    emit('delete', props.component.id)
  } catch (error) {
    console.error('处理删除事件失败:', error)
  }
}

/**
 * 处理子组件选中
 */
function handleChildSelected(child: Component) {
  try {
    selectedChildId.value = child.id
    emit('select', child)
  } catch (error) {
    console.error('处理子组件选中失败:', error)
  }
}

/**
 * 处理子组件删除
 */
function handleChildDeleted(childId: string) {
  try {
    emit('delete', childId)
  } catch (error) {
    console.error('处理子组件删除失败:', error)
  }
}

/**
 * 处理子组件移动
 */
function handleChildMoved(childId: string, newParentId: string, newIndex: number) {
  try {
    emit('move', childId, newParentId, newIndex)
  } catch (error) {
    console.error('处理子组件移动失败:', error)
  }
}

/**
 * 处理子组件放置
 */
function handleChildDropped(component: Component, parentId: string, index: number) {
  try {
    emit('drop', component, parentId, index)
  } catch (error) {
    console.error('处理子组件放置失败:', error)
  }
}

/**
 * 拖拽开始事件处理
 */
function handleDragStart(event: DragEvent) {
  try {
    if (!event.dataTransfer) return

    // 设置拖拽数据
    event.dataTransfer.setData(
      'application/json',
      JSON.stringify({
        componentId: props.component.id,
        componentType: props.component.type,
        parentId: props.parentId,
      }),
    )

    // 设置拖拽效果
    event.dataTransfer.effectAllowed = 'move'

    // 设置拖拽图像
    const dragElement = event.target as HTMLElement
    if (dragElement) {
      event.dataTransfer.setDragImage(dragElement, 0, 0)
    }
  } catch (error) {
    console.error('处理拖拽开始事件失败:', error)
  }
}

/**
 * 拖拽进入事件处理
 */
function handleDragEnter(event: DragEvent) {
  try {
    const target = event.currentTarget as HTMLElement
    target.classList.add('drag-over')
  } catch (error) {
    console.error('处理拖拽进入事件失败:', error)
  }
}

/**
 * 拖拽离开事件处理
 */
function handleDragLeave(event: DragEvent) {
  try {
    const target = event.currentTarget as HTMLElement
    target.classList.remove('drag-over')
  } catch (error) {
    console.error('处理拖拽离开事件失败:', error)
  }
}

/**
 * 放置事件处理
 */
function handleDrop(event: DragEvent) {
  try {
    const target = event.currentTarget as HTMLElement
    target.classList.remove('drag-over')

    if (!event.dataTransfer) return

    // 获取拖拽数据
    const jsonData = event.dataTransfer.getData('application/json')
    if (!jsonData) return

    const dragData = JSON.parse(jsonData)

    // 如果是组件移动
    if (dragData.componentId) {
      // 构造移动事件
      emit('move', dragData.componentId, props.component.id, 0)
    }
    // 如果是从组件面板拖入新组件
    else if (dragData.componentType) {
      // 处理新组件放置
      emit('drop', dragData, props.component.id, 0)
    }
  } catch (error) {
    console.error('处理放置事件失败:', error)
  }
}
</script>

<style scoped>
.component-node {
  position: relative;
  min-height: 30px;
  min-width: 50px;
  border: 1px dashed transparent;
  transition: all 0.2s ease;
}

.component-node:hover {
  border-color: #e6e6e6;
}

.component-node.component-selected {
  border-color: #409eff;
  z-index: 10;
}

.component-node.drag-over {
  border-color: #67c23a;
  background-color: rgb(103 194 58 / 10%);
}

.component-toolbar {
  z-index: 100;
}

.component-drag-handle {
  z-index: 100;
}

.component-info {
  z-index: 90;
}
</style>
