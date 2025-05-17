<template>
  <div class="component-panel">
    <div class="component-panel-header">
      <h2 class="component-panel-title">{{ title }}</h2>
    </div>

    <el-tabs v-model="activeTab" class="component-panel-tabs">
      <el-tab-pane label="基础组件" name="basic">
        <div class="component-list">
          <div
            v-for="component in basicComponents"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
          >
            <el-icon>
              <component :is="component.icon" />
            </el-icon>
            <span class="component-item-name">{{ component.name }}</span>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="布局组件" name="layout">
        <div class="component-list">
          <div
            v-for="component in layoutComponents"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
          >
            <el-icon>
              <component :is="component.icon" />
            </el-icon>
            <span class="component-item-name">{{ component.name }}</span>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="图表组件" name="chart">
        <div class="component-list">
          <div
            v-for="component in chartComponents"
            :key="component.type"
            class="component-item"
            draggable="true"
            @dragstart="handleDragStart($event, component)"
          >
            <el-icon>
              <component :is="component.icon" />
            </el-icon>
            <span class="component-item-name">{{ component.name }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
/**
 * 组件面板
 * 展示可拖拽的组件列表
 */
import { ref } from 'vue';
import { ElTabs, ElTabPane, ElIcon } from 'element-plus';
import type { ComponentDefinition } from '../../types';
import { BASIC_COMPONENTS, LAYOUT_COMPONENTS, CHART_COMPONENTS } from '../../constants/components';
import { createDragData } from '../../utils/dragUtils';

interface Props {
  /**
   * 面板标题
   */
  title?: string;
  /**
   * 自定义组件
   */
  customComponents?: ComponentDefinition[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '组件面板',
  customComponents: () => [],
});

/**
 * 活动标签
 */
const activeTab = ref('basic');

/**
 * 组件列表
 */
const basicComponents = [...BASIC_COMPONENTS, ...props.customComponents.filter(c => c.category === 'basic')];
const layoutComponents = [...LAYOUT_COMPONENTS, ...props.customComponents.filter(c => c.category === 'layout')];
const chartComponents = [...CHART_COMPONENTS, ...props.customComponents.filter(c => c.category === 'chart')];

/**
 * 拖拽开始事件处理
 */
const handleDragStart = (event: DragEvent, component: ComponentDefinition) => {
  try {
    if (!event.dataTransfer) return;
    
    // 设置拖拽数据和效果
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', createDragData(component.type));
    
    // 设置拖拽图像
    const dragImage = document.createElement('div');
    dragImage.className = 'drag-image';
    dragImage.textContent = component.name;
    dragImage.style.padding = '4px 8px';
    dragImage.style.background = '#f0f0f0';
    dragImage.style.border = '1px solid #ccc';
    dragImage.style.borderRadius = '4px';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // 在下一个宏任务中移除拖拽图像元素
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  } catch (error) {
    console.error(`拖拽开始处理失败: ${error}`);
  }
};
</script>

<style lang="scss" scoped>
.component-panel {
  width: 100%;
  height: 100%;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  overflow: hidden;
  
  &-header {
    padding: 12px;
    border-bottom: 1px solid #e4e7ed;
  }
  
  &-title {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: #303133;
  }
  
  &-tabs {
    flex: 1;
    overflow: auto;
  }
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s;
  
  &:hover {
    border-color: #409eff;
    background-color: #f5f7fa;
    transform: translateY(-2px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  i {
    margin-bottom: 4px;
    font-size: 20px;
    color: #606266;
  }
  
  &-name {
    font-size: 12px;
    color: #606266;
  }
}
</style> 