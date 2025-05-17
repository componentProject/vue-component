<template>
  <div 
    class="canvas-wrapper"
    :style="{ transform: `scale(${scale})` }"
  >
    <div 
      class="canvas" 
      :class="{ 'show-grid': showGrid }"
      ref="canvasRef"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="clearSelection"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`
      }"
    >
      <CanvasComponent
        v-for="component in canvasComponents"
        :key="component.id"
        :component="component"
        :selected="component.id === selectedComponentId"
        @select="selectComponent"
        @update:position="updateComponentPosition"
        @update:size="updateComponentSize"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useEditorStore } from '../../store/editor';
import CanvasComponent from './CanvasComponent.vue';
import type { CanvasComponent as CanvasComponentType } from '../../types';

/**
 * Canvas component
 * Renders the editable canvas area where components can be dropped and manipulated
 */
const editorStore = useEditorStore();
const canvasRef = ref<HTMLElement | null>(null);

// Computed properties from the store
const canvasComponents = computed(() => editorStore.canvasComponents);
const selectedComponentId = computed(() => editorStore.selectedComponentId);
const canvasWidth = computed(() => editorStore.canvas.width);
const canvasHeight = computed(() => editorStore.canvas.height);
const scale = computed(() => editorStore.canvas.scale);
const showGrid = computed(() => editorStore.canvas.showGrid);

/**
 * Handle dragover event
 * @param event DragEvent object
 */
const onDragOver = (event: DragEvent) => {
  try {
    // Prevent default to allow drop
    event.preventDefault();
    
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  } catch (error) {
    console.error('Error handling dragover event:', error);
  }
};

/**
 * Calculate position relative to canvas
 * @param event Mouse event
 * @returns Position as [x, y]
 */
const getRelativePosition = (event: DragEvent): [number, number] => {
  try {
    if (!canvasRef.value) return [0, 0];
    
    const rect = canvasRef.value.getBoundingClientRect();
    const x = (event.clientX - rect.left) / scale.value;
    const y = (event.clientY - rect.top) / scale.value;
    
    return [x, y];
  } catch (error) {
    console.error('Error calculating relative position:', error);
    return [0, 0];
  }
};

/**
 * Handle drop event
 * @param event DragEvent object
 */
const onDrop = (event: DragEvent) => {
  try {
    event.preventDefault();
    
    if (!event.dataTransfer) return;
    
    const data = event.dataTransfer.getData('application/json');
    if (!data) return;
    
    const dragData = JSON.parse(data);
    const [x, y] = getRelativePosition(event);
    
    // Add the component to the canvas
    editorStore.addComponent(dragData.componentId, x, y);
  } catch (error) {
    console.error('Error handling drop event:', error);
  }
};

/**
 * Clear the current component selection
 * @param event Mouse event
 */
const clearSelection = (event: MouseEvent) => {
  try {
    // Only clear if clicking directly on the canvas
    if (event.target === canvasRef.value) {
      editorStore.selectComponent(null);
    }
  } catch (error) {
    console.error('Error clearing selection:', error);
  }
};

/**
 * Select a component on the canvas
 * @param componentId Component instance ID
 */
const selectComponent = (componentId: string) => {
  try {
    editorStore.selectComponent(componentId);
  } catch (error) {
    console.error('Error selecting component:', error);
  }
};

/**
 * Update a component's position
 * @param componentId Component instance ID
 * @param position New position
 */
const updateComponentPosition = (componentId: string, position: { top: number; left: number }) => {
  try {
    editorStore.updateComponentStyle(componentId, position);
  } catch (error) {
    console.error('Error updating component position:', error);
  }
};

/**
 * Update a component's size
 * @param componentId Component instance ID
 * @param size New size
 */
const updateComponentSize = (componentId: string, size: { width: number; height: number }) => {
  try {
    editorStore.updateComponentStyle(componentId, size);
  } catch (error) {
    console.error('Error updating component size:', error);
  }
};
</script>

<style scoped>
.canvas-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  transform-origin: center;
}

.canvas {
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: auto;
}

.show-grid {
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}
</style> 