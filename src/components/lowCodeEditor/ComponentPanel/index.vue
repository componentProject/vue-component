<template>
  <div class="component-panel">
    <div class="panel-header px-4 py-3 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-700">组件面板</h3>
    </div>

    <div class="panel-body p-4 overflow-y-auto">
      <!-- 搜索框 -->
      <div class="mb-4">
        <el-input
          v-model="searchText"
          placeholder="搜索组件"
          prefix-icon="el-icon-search"
          clearable
          @input="filterComponents"
        />
      </div>

      <!-- 分类标签页 -->
      <el-tabs v-model="activeTab" type="card" class="component-tabs">
        <!-- 基础组件 -->
        <el-tab-pane label="基础组件" name="basic">
          <div class="grid grid-cols-2 gap-3">
            <component-item
              v-for="comp in filteredComponents.basic"
              :key="comp.type"
              :component="comp"
              @drag-start="handleDragStart"
            />
          </div>
        </el-tab-pane>

        <!-- 布局组件 -->
        <el-tab-pane label="布局组件" name="layout">
          <div class="grid grid-cols-2 gap-3">
            <component-item
              v-for="comp in filteredComponents.layout"
              :key="comp.type"
              :component="comp"
              @drag-start="handleDragStart"
            />
          </div>
        </el-tab-pane>

        <!-- 图表组件 -->
        <el-tab-pane label="图表组件" name="chart">
          <div class="grid grid-cols-2 gap-3">
            <component-item
              v-for="comp in filteredComponents.chart"
              :key="comp.type"
              :component="comp"
              @drag-start="handleDragStart"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { COMPONENT_LIST } from '../constants/components'
import { ComponentCategory } from '../types'
import type { Component } from '../types'
import ComponentItem from './ComponentItem.vue'

/**
 * 当前激活的标签页
 */
const activeTab = ref<string>(ComponentCategory.BASIC)

/**
 * 搜索文本
 */
const searchText = ref('')

/**
 * 所有组件列表，按类别分组
 */
const componentList = reactive({
  [ComponentCategory.BASIC]: COMPONENT_LIST.filter(
    (comp) => comp.category === ComponentCategory.BASIC,
  ),
  [ComponentCategory.LAYOUT]: COMPONENT_LIST.filter(
    (comp) => comp.category === ComponentCategory.LAYOUT,
  ),
  [ComponentCategory.CHART]: COMPONENT_LIST.filter(
    (comp) => comp.category === ComponentCategory.CHART,
  ),
})

/**
 * 过滤后的组件列表
 */
const filteredComponents = reactive({
  [ComponentCategory.BASIC]: [...componentList[ComponentCategory.BASIC]],
  [ComponentCategory.LAYOUT]: [...componentList[ComponentCategory.LAYOUT]],
  [ComponentCategory.CHART]: [...componentList[ComponentCategory.CHART]],
})

/**
 * 根据搜索文本过滤组件
 */
function filterComponents() {
  try {
    if (!searchText.value) {
      // 重置为原始列表
      filteredComponents[ComponentCategory.BASIC] = [...componentList[ComponentCategory.BASIC]]
      filteredComponents[ComponentCategory.LAYOUT] = [...componentList[ComponentCategory.LAYOUT]]
      filteredComponents[ComponentCategory.CHART] = [...componentList[ComponentCategory.CHART]]
      return
    }

    const searchLower = searchText.value.toLowerCase()

    // 按类别过滤组件
    filteredComponents[ComponentCategory.BASIC] = componentList[ComponentCategory.BASIC].filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchLower) ||
        comp.type.toLowerCase().includes(searchLower),
    )

    filteredComponents[ComponentCategory.LAYOUT] = componentList[ComponentCategory.LAYOUT].filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchLower) ||
        comp.type.toLowerCase().includes(searchLower),
    )

    filteredComponents[ComponentCategory.CHART] = componentList[ComponentCategory.CHART].filter(
      (comp) =>
        comp.name.toLowerCase().includes(searchLower) ||
        comp.type.toLowerCase().includes(searchLower),
    )
  } catch (error) {
    console.error('过滤组件失败:', error)
  }
}

/**
 * 处理组件拖拽开始
 */
function handleDragStart(component: Component) {
  try {
    // 触发父组件的拖拽事件
    emit('drag-component', component)
  } catch (error) {
    console.error('处理组件拖拽开始失败:', error)
  }
}

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  try {
    // 可以在这里添加初始化逻辑
  } catch (error) {
    console.error('组件面板初始化失败:', error)
  }
})

// 声明触发的事件
const emit = defineEmits<{
  (e: 'drag-component', component: Component): void
}>()
</script>

<style scoped>
.component-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
}

.component-tabs :deep(.el-tabs__nav) {
  margin-bottom: 12px;
}

.component-tabs :deep(.el-tabs__header) {
  border-bottom: none;
}
</style>
