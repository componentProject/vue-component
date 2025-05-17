<template>
  <div class="component-panel">
    <div class="search-container">
      <el-input
        v-model="searchText"
        placeholder="Search components..."
        prefix-icon="Search"
        clearable
      />
    </div>
    
    <div class="component-categories">
      <el-tabs v-model="activeCategory">
        <el-tab-pane label="Basic" name="basic">
          <div class="component-list">
            <div
              v-for="component in basicComponents"
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon><component :is="component.icon" /></el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="Layout" name="layout">
          <div class="component-list">
            <div
              v-for="component in layoutComponents"
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon><component :is="component.icon" /></el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="Chart" name="chart">
          <div class="component-list">
            <div
              v-for="component in chartComponents"
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon><component :is="component.icon" /></el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useEditorStore } from '../../store/editor';
import type { ComponentDefinition } from '../../types';

/**
 * Component panel for selecting and dragging components
 * Organizes components by category and provides search functionality
 */
const editorStore = useEditorStore();
const searchText = ref('');
const activeCategory = ref('basic');

/**
 * Filter components by search text
 * @param components Components to filter
 * @returns Filtered components
 */
const filterComponents = (components: ComponentDefinition[]) => {
  try {
    if (!searchText.value) return components;
    
    const searchLower = searchText.value.toLowerCase();
    return components.filter(component => 
      component.name.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error filtering components:', error);
    return components;
  }
};

/**
 * Basic components list filtered by search
 */
const basicComponents = computed(() => {
  try {
    const components = editorStore.componentDefinitions.filter(
      component => component.type === 'basic'
    );
    return filterComponents(components);
  } catch (error) {
    console.error('Error computing basic components:', error);
    return [];
  }
});

/**
 * Layout components list filtered by search
 */
const layoutComponents = computed(() => {
  try {
    const components = editorStore.componentDefinitions.filter(
      component => component.type === 'layout'
    );
    return filterComponents(components);
  } catch (error) {
    console.error('Error computing layout components:', error);
    return [];
  }
});

/**
 * Chart components list filtered by search
 */
const chartComponents = computed(() => {
  try {
    const components = editorStore.componentDefinitions.filter(
      component => component.type === 'chart'
    );
    return filterComponents(components);
  } catch (error) {
    console.error('Error computing chart components:', error);
    return [];
  }
});

/**
 * Handle drag start event when dragging a component
 * @param event DragEvent object
 * @param component Component being dragged
 */
const onDragStart = (event: DragEvent, component: ComponentDefinition) => {
  try {
    if (event.dataTransfer) {
      // Set drag data
      event.dataTransfer.setData('application/json', JSON.stringify({
        componentId: component.id,
        type: component.type
      }));
      
      // Set drag effect
      event.dataTransfer.effectAllowed = 'copy';
      
      // Optional: Set drag image
      const dragImage = document.createElement('div');
      dragImage.textContent = component.name;
      dragImage.style.backgroundColor = '#409EFF';
      dragImage.style.color = 'white';
      dragImage.style.padding = '8px 12px';
      dragImage.style.borderRadius = '4px';
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-1000px';
      document.body.appendChild(dragImage);
      
      event.dataTransfer.setDragImage(dragImage, 0, 0);
      
      // Clean up the element after drag operation
      setTimeout(() => {
        document.body.removeChild(dragImage);
      }, 0);
    }
  } catch (error) {
    console.error('Error starting drag operation:', error);
  }
};
</script>

<style scoped>
.component-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.search-container {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.component-categories {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 8px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: move;
  background-color: #ffffff;
  transition: all 0.3s;
  padding: 8px;
  text-align: center;
}

.component-item:hover {
  border-color: #409EFF;
  background-color: #ecf5ff;
}

.component-item i {
  font-size: 24px;
  margin-bottom: 8px;
  color: #606266;
}

.component-item span {
  font-size: 12px;
  color: #606266;
}
</style> 