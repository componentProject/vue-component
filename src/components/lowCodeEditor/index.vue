<!-- 
  低代码编辑器Plus组件
  提供可视化搭建界面的功能，包含左侧组件面板、中间编辑区域和右侧属性编辑面板
-->
<template>
  <div class="low-code-editor-container flex h-full w-full">
    <!-- 左侧组件面板 -->
    <ComponentPanel
      class="component-panel w-64 border-r border-gray-200 overflow-y-auto"
      @drag-component="handleDragComponent"
    />

    <!-- 中间编辑区域 -->
    <ComponentRenderer
      class="component-renderer flex-1 bg-gray-50 overflow-auto"
      :page-schema="pageSchema"
      :selected-component="selectedComponent"
      @component-selected="handleComponentSelected"
      @component-moved="handleComponentMoved"
      @component-deleted="handleComponentDeleted"
    />

    <!-- 右侧属性编辑面板 -->
    <ComponentPropertyPanel
      class="property-panel w-72 border-l border-gray-200 overflow-y-auto"
      :selected-component="selectedComponent"
      @property-changed="handlePropertyChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useEditorStore } from './stores/editorStore'
import ComponentPanel from './ComponentPanel/index.vue'
import ComponentRenderer from './ComponentRenderer/index.vue'
import ComponentPropertyPanel from './ComponentPropertyPanel/index.vue'
import type { Component, PageSchema } from './types'
import { useDragDrop } from './hooks/useDragDrop'
import { DEFAULT_PAGE_SCHEMA } from './constants/schema'

/**
 * 低代码编辑器状态管理
 */
const editorStore = useEditorStore()

/**
 * 页面JSON Schema数据
 */
const pageSchema = ref<PageSchema>(DEFAULT_PAGE_SCHEMA)

/**
 * 当前选中的组件
 */
const selectedComponent = ref<Component | null>(null)

/**
 * 拖拽功能封装
 */
const { initDragDrop } = useDragDrop()

/**
 * 处理从组件面板拖拽组件到编辑区域
 */
function handleDragComponent(component: Component) {
  try {
    editorStore.addComponent(component)
    pageSchema.value = editorStore.getPageSchema()
  } catch (error) {
    console.error('添加组件失败:', error)
  }
}

/**
 * 处理选中组件
 */
function handleComponentSelected(component: Component) {
  try {
    selectedComponent.value = component
  } catch (error) {
    console.error('选中组件失败:', error)
  }
}

/**
 * 处理组件移动
 */
function handleComponentMoved(componentId: string, newParentId: string, newIndex: number) {
  try {
    editorStore.moveComponent(componentId, newParentId, newIndex)
    pageSchema.value = editorStore.getPageSchema()
  } catch (error) {
    console.error('移动组件失败:', error)
  }
}

/**
 * 处理组件删除
 */
function handleComponentDeleted(componentId: string) {
  try {
    editorStore.deleteComponent(componentId)
    pageSchema.value = editorStore.getPageSchema()
    if (selectedComponent.value?.id === componentId) {
      selectedComponent.value = null
    }
  } catch (error) {
    console.error('删除组件失败:', error)
  }
}

/**
 * 处理组件属性变更
 */
function handlePropertyChanged(componentId: string, propName: string, value: any) {
  try {
    editorStore.updateComponentProperty(componentId, propName, value)
    pageSchema.value = editorStore.getPageSchema()

    // 更新已选中组件的属性
    if (selectedComponent.value?.id === componentId) {
      selectedComponent.value = editorStore.getComponentById(componentId) || null
    }
  } catch (error) {
    console.error('更新组件属性失败:', error)
  }
}

/**
 * 组件挂载后初始化
 */
onMounted(() => {
  try {
    initDragDrop()
  } catch (error) {
    console.error('初始化拖拽功能失败:', error)
  }
})
</script>

<style scoped>
.low-code-editor-container {
  height: 100%;
  min-height: 600px;
}
</style>
