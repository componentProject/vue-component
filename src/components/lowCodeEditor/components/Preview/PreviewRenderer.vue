<template>
  <div class="preview-renderer">
    <div 
      class="preview-canvas"
      :style="{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }"
    >
      <div
        v-for="component in components"
        :key="component.id"
        class="preview-component"
        :style="getComponentStyle(component)"
      >
        <component
          :is="getComponentDefinition(component.componentId)?.component || 'div'"
          v-bind="component.props"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useEditorStore } from '../../store/editor';
import type { CanvasComponent } from '../../types';

/**
 * Preview renderer component
 * Renders a read-only preview of the canvas components
 */

// Props
const props = defineProps<{
  components: CanvasComponent[];
}>();

// Store
const editorStore = useEditorStore();

/**
 * Canvas dimensions from store
 */
const canvasWidth = computed(() => editorStore.canvas.width);
const canvasHeight = computed(() => editorStore.canvas.height);

/**
 * Get component definition by ID
 * @param id Component definition ID
 */
const getComponentDefinition = (id: string) => {
  try {
    return editorStore.getComponentDefinition(id);
  } catch (error) {
    console.error('Error getting component definition:', error);
    return undefined;
  }
};

/**
 * Generate component style for preview
 * @param component Canvas component
 * @returns Style object
 */
const getComponentStyle = (component: CanvasComponent) => {
  try {
    return {
      position: 'absolute',
      top: `${component.style.top}px`,
      left: `${component.style.left}px`,
      width: `${component.style.width}px`,
      height: `${component.style.height}px`,
      zIndex: component.style.zIndex,
      backgroundColor: component.style.backgroundColor,
      color: component.style.color,
      border: component.style.border,
      borderRadius: component.style.borderRadius,
      padding: component.style.padding,
    };
  } catch (error) {
    console.error('Error generating component style:', error);
    return {};
  }
};
</script>

<style scoped>
.preview-renderer {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.preview-canvas {
  position: relative;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}

.preview-component {
  box-sizing: border-box;
  position: absolute;
}
</style> 