<template>
  <div class="component-palette">
    <div class="palette-header">
      <h3 class="text-lg font-medium">Component Palette</h3>
      <div class="search-box">
        <el-input
          v-model="searchText"
          placeholder="Search components..."
          prefix-icon="Search"
          clearable
        />
      </div>
    </div>

    <div class="palette-content">
      <!-- Basic Element Plus Components -->
      <el-collapse v-model="activeCategories">
        <el-collapse-item title="Basic Components" name="basic">
          <div class="components-grid">
            <div 
              v-for="component in filteredComponents.basic" 
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon>
                <component :is="component.icon" />
              </el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-collapse-item>

        <!-- Layout Components -->
        <el-collapse-item title="Layout Components" name="layout">
          <div class="components-grid">
            <div 
              v-for="component in filteredComponents.layout" 
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon>
                <component :is="component.icon" />
              </el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-collapse-item>

        <!-- Chart Components -->
        <el-collapse-item title="Chart Components" name="chart">
          <div class="components-grid">
            <div 
              v-for="component in filteredComponents.chart" 
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon>
                <component :is="component.icon" />
              </el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-collapse-item>

        <!-- Custom Components -->
        <el-collapse-item title="Custom Components" name="custom">
          <div class="components-grid">
            <div 
              v-for="component in filteredComponents.custom" 
              :key="component.id"
              class="component-item"
              draggable="true"
              @dragstart="onDragStart($event, component)"
            >
              <el-icon>
                <component :is="component.icon" />
              </el-icon>
              <span>{{ component.name }}</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Component palette with draggable components
 */
import { ref, computed } from 'vue';
import type { ComponentDefinition } from '../types';
import { Search } from '@element-plus/icons-vue';
import { availableComponents } from '../hooks/useComponentRegistry';

// Track which categories are expanded
const activeCategories = ref(['basic', 'layout', 'chart', 'custom']);

// Search functionality
const searchText = ref('');

// Filter components based on search text
const filteredComponents = computed(() => {
  try {
    const result = {
      basic: [] as ComponentDefinition[],
      layout: [] as ComponentDefinition[],
      chart: [] as ComponentDefinition[],
      custom: [] as ComponentDefinition[],
    };

    if (!searchText.value) {
      // No search, return all components by category
      for (const component of availableComponents) {
        result[component.category].push(component);
      }
    } else {
      // Filter by search text
      const searchLower = searchText.value.toLowerCase();
      for (const component of availableComponents) {
        if (component.name.toLowerCase().includes(searchLower) || 
            component.type.toLowerCase().includes(searchLower)) {
          result[component.category].push(component);
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Error filtering components:', error);
    return {
      basic: [],
      layout: [],
      chart: [],
      custom: [],
    };
  }
});

/**
 * Handle drag start event for component drag and drop
 */
const onDragStart = (event: DragEvent, component: ComponentDefinition) => {
  try {
    if (event.dataTransfer) {
      // Set the drag data with component information
      event.dataTransfer.setData(
        'application/json',
        JSON.stringify(component)
      );
      event.dataTransfer.effectAllowed = 'copy';
    }
  } catch (error) {
    console.error('Error starting drag operation:', error);
  }
};
</script>

<style scoped>
.component-palette {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  background-color: #f9f9f9;
}

.palette-header {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.search-box {
  margin-top: 0.5rem;
}

.palette-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.25rem;
  background-color: white;
  cursor: grab;
  transition: all 0.2s;
}

.component-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.component-item .el-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #606266;
}

.component-item span {
  font-size: 0.8rem;
  color: #606266;
  text-align: center;
}
</style> 