<template>
  <div class="component-panel-container">
    <div class="panel-header">
      <h2 class="panel-title">组件面板</h2>
    </div>
    
    <div class="search-container">
      <el-input
        v-model="searchText"
        placeholder="搜索组件"
        prefix-icon="el-icon-search"
        clearable
      />
    </div>
    
    <div class="component-categories">
      <el-tabs v-model="activeCategory">
        <!-- 基础组件选项卡 -->
        <el-tab-pane label="基础组件" name="basic">
          <div class="component-list">
            <div 
              v-for="component in filteredComponents.basic"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
            >
              <el-tooltip :content="component.name" placement="right">
                <div class="component-item-content">
                  <i :class="component.icon || 'el-icon-platform-eleme'" class="component-icon"></i>
                  <span class="component-name">{{ component.name }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 布局组件选项卡 -->
        <el-tab-pane label="布局组件" name="layout">
          <div class="component-list">
            <div 
              v-for="component in filteredComponents.layout"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
            >
              <el-tooltip :content="component.name" placement="right">
                <div class="component-item-content">
                  <i :class="component.icon || 'el-icon-menu'" class="component-icon"></i>
                  <span class="component-name">{{ component.name }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
        
        <!-- 图表组件选项卡 -->
        <el-tab-pane label="图表组件" name="chart">
          <div class="component-list">
            <div 
              v-for="component in filteredComponents.chart"
              :key="component.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
            >
              <el-tooltip :content="component.name" placement="right">
                <div class="component-item-content">
                  <i :class="component.icon || 'el-icon-picture'" class="component-icon"></i>
                  <span class="component-name">{{ component.name }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件面板
 * 展示可用的组件列表，支持拖拽到编辑区域
 */
import { ref, computed } from 'vue';
import { componentRegistry } from '../utils/componentRegistry';
import { ComponentCategory, type ComponentDefinition } from '../types';
import { logInfo, logError } from '../utils/logger';

// 定义事件
const emit = defineEmits<{
  (e: 'drag-component', payload: { componentType: string, componentData: ComponentDefinition }): void
}>();

// 当前激活的组件分类
const activeCategory = ref<string>(ComponentCategory.BASIC);

// 搜索文本
const searchText = ref('');

/**
 * 过滤后的组件列表
 */
const filteredComponents = computed(() => {
  try {
    const result: Record<string, ComponentDefinition[]> = {
      [ComponentCategory.BASIC]: [],
      [ComponentCategory.LAYOUT]: [],
      [ComponentCategory.CHART]: []
    };
    
    const search = searchText.value.toLowerCase().trim();
    
    // 从注册表中获取组件并按分类过滤
    for (const component of componentRegistry.getComponents()) {
      // 如果有搜索文本，则按名称和类型过滤
      if (search && !component.name.toLowerCase().includes(search) && 
          !component.type.toLowerCase().includes(search)) {
        continue;
      }
      
      result[component.category].push(component);
    }
    
    return result;
  } catch (error) {
    logError('Failed to filter components', error);
    return {
      [ComponentCategory.BASIC]: [],
      [ComponentCategory.LAYOUT]: [],
      [ComponentCategory.CHART]: []
    };
  }
});

/**
 * 处理组件拖拽开始事件
 * @param event 拖拽事件
 * @param component 被拖拽的组件定义
 */
const handleDragStart = (event: DragEvent, component: ComponentDefinition) => {
  try {
    if (!event.dataTransfer) return;
    
    // 设置拖拽数据
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify({
      componentType: component.type,
      componentData: component
    }));
    
    // 创建拖拽时的预览图
    const dragImage = document.createElement('div');
    dragImage.className = 'drag-preview';
    dragImage.textContent = component.name;
    dragImage.style.backgroundColor = '#f0f9ff';
    dragImage.style.border = '1px solid #a0cfff';
    dragImage.style.borderRadius = '4px';
    dragImage.style.padding = '8px 12px';
    dragImage.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.15)';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    
    // 设置拖拽图像
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // 延迟移除预览元素
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
    
    // 发出拖拽事件
    emit('drag-component', {
      componentType: component.type,
      componentData: component
    });
    
    logInfo('Component drag started', { componentType: component.type });
  } catch (error) {
    logError('Failed to handle drag start', error);
  }
};
</script>

<style scoped>
.component-panel-container {
  @apply flex flex-col h-full bg-white;
}

.panel-header {
  @apply py-3 px-4 border-b border-gray-200;
}

.panel-title {
  @apply text-lg font-medium text-gray-800;
}

.search-container {
  @apply p-4;
}

.component-categories {
  @apply flex-1 overflow-hidden;
}

.component-list {
  @apply grid grid-cols-2 gap-2 p-2 overflow-y-auto;
  max-height: calc(100vh - 140px);
}

.component-item {
  @apply border border-gray-200 rounded-md hover:border-blue-300 hover:bg-blue-50 cursor-move;
}

.component-item-content {
  @apply flex flex-col items-center p-3;
}

.component-icon {
  @apply text-2xl mb-1 text-gray-600;
}

.component-name {
  @apply text-xs text-center text-gray-700;
}

/* 自定义Element UI Tab样式 */
:deep(.el-tabs__header) {
  @apply m-0;
}

:deep(.el-tabs__content) {
  @apply flex-1 overflow-hidden;
}

:deep(.el-tab-pane) {
  @apply h-full overflow-auto;
}
</style> 