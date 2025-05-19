<template>
  <div class="property-panel-container">
    <div class="panel-header">
      <h2 class="panel-title">属性配置</h2>
    </div>
    
    <!-- 没有选中组件时的空状态 -->
    <div v-if="!selectedComponent" class="empty-state">
      <el-empty description="请选择一个组件以编辑属性"></el-empty>
    </div>
    
    <!-- 选中组件后的属性编辑面板 -->
    <template v-else>
      <div class="component-info">
        <el-tag size="small">{{ selectedComponent.type }}</el-tag>
        <span class="component-id">ID: {{ selectedComponent.id }}</span>
      </div>
      
      <el-tabs v-model="activeTab" class="property-tabs">
        <!-- 属性配置选项卡 -->
        <el-tab-pane label="属性" name="props">
          <component-props-form
            :component="selectedComponent"
            :component-definition="componentDefinition"
            @update-property="handleUpdateProperty"
          />
        </el-tab-pane>
        
        <!-- 样式配置选项卡 -->
        <el-tab-pane label="样式" name="style">
          <component-style-form
            :component="selectedComponent"
            @update-style="handleUpdateStyle"
          />
        </el-tab-pane>
        
        <!-- 高级选项卡 - 仅图表组件显示 -->
        <el-tab-pane 
          v-if="isChartComponent" 
          label="图表数据" 
          name="chartData"
        >
          <chart-data-editor
            :component="selectedComponent"
            @update-chart-data="handleUpdateChartData"
          />
        </el-tab-pane>
        
        <!-- 事件选项卡 -->
        <el-tab-pane label="事件" name="events">
          <component-events-form
            :component="selectedComponent"
            @update-event="handleUpdateEvent"
          />
        </el-tab-pane>
      </el-tabs>
      
      <!-- 导出JSON按钮 -->
      <div class="export-actions">
        <el-button 
          type="primary" 
          size="small" 
          icon="el-icon-document-copy"
          @click="handleExportJson"
        >
          导出组件JSON
        </el-button>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件属性面板
 * 用于编辑选中组件的属性和样式
 */
import { ref, computed, watch } from 'vue';
import { componentRegistry } from '../utils/componentRegistry';
import { ComponentCategory } from '../types';
import type { Component } from '../types';
import { logInfo, logError } from '../utils/logger';
import ComponentPropsForm from './propertyForms/ComponentPropsForm.vue';
import ComponentStyleForm from './propertyForms/ComponentStyleForm.vue';
import ComponentEventsForm from './propertyForms/ComponentEventsForm.vue';
import ChartDataEditor from './propertyForms/ChartDataEditor.vue';

// 定义属性
const props = defineProps<{
  selectedComponent: Component | null;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'update-property', property: string, value: any): void;
}>();

// 当前激活的标签页
const activeTab = ref('props');

// 当组件选择改变时，重置当前标签页
watch(
  () => props.selectedComponent?.id,
  () => {
    activeTab.value = 'props';
  }
);

/**
 * 获取当前选中组件的组件定义
 */
const componentDefinition = computed(() => {
  try {
    if (!props.selectedComponent) return null;
    return componentRegistry.getComponent(props.selectedComponent.type);
  } catch (error) {
    logError('Failed to get component definition', error);
    return null;
  }
});

/**
 * 判断当前组件是否为图表组件
 */
const isChartComponent = computed(() => {
  try {
    return componentDefinition.value?.category === ComponentCategory.CHART;
  } catch (error) {
    logError('Failed to determine if component is a chart', error);
    return false;
  }
});

/**
 * 处理组件属性更新
 * @param property 属性名
 * @param value 属性值
 */
const handleUpdateProperty = (property: string, value: any) => {
  try {
    emit('update-property', property, value);
    logInfo('Property updated', { property, value });
  } catch (error) {
    logError('Failed to update property', error);
  }
};

/**
 * 处理组件样式更新
 * @param property 样式属性名
 * @param value 样式属性值
 */
const handleUpdateStyle = (property: string, value: any) => {
  try {
    emit('update-property', `style.${property}`, value);
    logInfo('Style updated', { property, value });
  } catch (error) {
    logError('Failed to update style', error);
  }
};

/**
 * 处理组件事件更新
 * @param eventName 事件名称
 * @param handlerCode 事件处理代码
 */
const handleUpdateEvent = (eventName: string, handlerCode: string) => {
  try {
    emit('update-property', `events.${eventName}`, handlerCode);
    logInfo('Event handler updated', { eventName, handlerCode });
  } catch (error) {
    logError('Failed to update event handler', error);
  }
};

/**
 * 处理图表数据更新
 * @param chartData 图表数据
 */
const handleUpdateChartData = (chartData: any) => {
  try {
    emit('update-property', 'props.data', chartData);
    logInfo('Chart data updated');
  } catch (error) {
    logError('Failed to update chart data', error);
  }
};

/**
 * 导出组件JSON
 */
const handleExportJson = () => {
  try {
    if (!props.selectedComponent) return;
    
    // 格式化JSON
    const json = JSON.stringify(props.selectedComponent, null, 2);
    
    // 创建临时文本区域复制到剪贴板
    const textarea = document.createElement('textarea');
    textarea.value = json;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // 提示用户
    ElMessage.success('组件JSON已复制到剪贴板');
    logInfo('Component JSON exported', { componentId: props.selectedComponent.id });
  } catch (error) {
    logError('Failed to export component JSON', error);
    ElMessage.error('导出JSON失败');
  }
};
</script>

<style scoped>
.property-panel-container {
  @apply flex flex-col h-full bg-white;
}

.panel-header {
  @apply py-3 px-4 border-b border-gray-200;
}

.panel-title {
  @apply text-lg font-medium text-gray-800;
}

.empty-state {
  @apply flex items-center justify-center h-full;
}

.component-info {
  @apply p-4 flex items-center justify-between border-b border-gray-200;
}

.component-id {
  @apply text-xs text-gray-500;
}

.property-tabs {
  @apply flex-1 overflow-auto p-4;
}

.export-actions {
  @apply p-4 border-t border-gray-200 flex justify-center;
}

/* 自定义Element UI Tab样式 */
:deep(.el-tabs__content) {
  @apply p-2;
}
</style> 