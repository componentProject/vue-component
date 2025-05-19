<template>
  <div class="low-code-editor-container">
    <!-- 左侧组件面板 -->
    <ComponentPanel 
      @drag-component="handleDragComponent"
      class="component-panel" 
    />
    
    <!-- 中间编辑区域 -->
    <ComponentRenderer 
      ref="rendererRef"
      :components="editorStore.components" 
      @select-component="handleSelectComponent"
      @update-components="handleUpdateComponents"
      class="component-renderer" 
    />
    
    <!-- 右侧属性编辑面板 -->
    <ComponentPropertyPanel 
      :selected-component="editorStore.selectedComponent" 
      @update-property="handleUpdateProperty"
      class="property-panel" 
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * 低代码编辑器组件
 * 实现组件拖拽、编辑和属性配置的可视化页面编辑功能
 */
import { ref, onMounted } from 'vue';
import { useEditorStore } from './stores/editorStore';
import ComponentPanel from './components/ComponentPanel.vue';
import ComponentRenderer from './components/ComponentRenderer.vue';
import ComponentPropertyPanel from './components/ComponentPropertyPanel.vue';
import { Component, DragComponentEvent } from './types';
import { logInfo, logError } from './utils/logger';

// 编辑器状态管理
const editorStore = useEditorStore();
const rendererRef = ref<InstanceType<typeof ComponentRenderer> | null>(null);

/**
 * 处理组件拖拽事件
 * @param event 拖拽事件数据
 */
const handleDragComponent = (event: DragComponentEvent) => {
  try {
    logInfo('Component drag started', { componentType: event.componentType });
    // 拖拽事件处理逻辑将在ComponentRenderer中实现
  } catch (error) {
    logError('Failed to handle component drag', error);
  }
};

/**
 * 处理组件选中事件
 * @param componentId 选中的组件ID
 */
const handleSelectComponent = (componentId: string) => {
  try {
    logInfo('Component selected', { componentId });
    editorStore.selectComponent(componentId);
  } catch (error) {
    logError('Failed to select component', error);
  }
};

/**
 * 处理组件更新事件
 * @param components 更新后的组件列表
 */
const handleUpdateComponents = (components: Component[]) => {
  try {
    logInfo('Components updated');
    editorStore.updateComponents(components);
  } catch (error) {
    logError('Failed to update components', error);
  }
};

/**
 * 处理属性更新事件
 * @param property 属性名
 * @param value 属性值
 */
const handleUpdateProperty = (property: string, value: any) => {
  try {
    logInfo('Property updated', { property, value });
    editorStore.updateComponentProperty(property, value);
  } catch (error) {
    logError('Failed to update property', error);
  }
};

/**
 * 导出当前页面配置为JSON Schema
 */
const exportSchema = () => {
  try {
    logInfo('Exporting schema');
    return editorStore.exportSchema();
  } catch (error) {
    logError('Failed to export schema', error);
    return null;
  }
};

/**
 * 从JSON Schema导入页面配置
 * @param schema JSON Schema配置
 */
const importSchema = (schema: any) => {
  try {
    logInfo('Importing schema');
    editorStore.importSchema(schema);
  } catch (error) {
    logError('Failed to import schema', error);
  }
};

// 暴露组件方法
defineExpose({
  exportSchema,
  importSchema
});

// 组件挂载时的初始化
onMounted(() => {
  try {
    logInfo('Low code editor component mounted');
  } catch (error) {
    logError('Failed to initialize editor component', error);
  }
});
</script>

<style scoped>
.low-code-editor-container {
  @apply flex w-full h-full;
}

.component-panel {
  @apply w-64 h-full overflow-y-auto border-r border-gray-200;
}

.component-renderer {
  @apply flex-1 h-full overflow-auto bg-gray-100;
}

.property-panel {
  @apply w-72 h-full overflow-y-auto border-l border-gray-200;
}
</style> 