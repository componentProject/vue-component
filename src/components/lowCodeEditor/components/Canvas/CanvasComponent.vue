<template>
  <div
    class="canvas-component"
    :class="{ selected: selected }"
    :style="componentStyle"
    @click="handleSelect"
    ref="componentRef"
  >
    <!-- Component content based on type -->
    <component
      :is="renderComponent"
      v-bind="component.props"
    />

    <!-- Resize and drag handles (only visible when selected) -->
    <template v-if="selected">
      <div 
        v-for="(handle, index) in resizeHandles" 
        :key="index"
        class="resize-handle"
        :class="handle.class"
        @mousedown="startResize($event, handle.type)"
      ></div>
      
      <div 
        class="drag-handle"
        @mousedown="startDrag"
      >
        <el-icon><Rank /></el-icon>
      </div>
      
      <div class="delete-handle" @click.stop="handleDelete">
        <el-icon><Delete /></el-icon>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Rank, Delete } from '@element-plus/icons-vue';
import { useEditorStore } from '../../store/editor';
import type { CanvasComponent as CanvasComponentType } from '../../types';

/**
 * Component that represents an item placed on the canvas
 * Handles selection, dragging, resizing, and deletion
 */

// Props
const props = defineProps<{
  component: CanvasComponentType;
  selected: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'update:position', id: string, position: { top: number; left: number }): void;
  (e: 'update:size', id: string, size: { width: number; height: number }): void;
}>();

// Store and refs
const editorStore = useEditorStore();
const componentRef = ref<HTMLElement | null>(null);

// Dragging and resizing state
const isDragging = ref(false);
const isResizing = ref(false);
const resizeType = ref<string | null>(null);
const dragStartPos = ref({ x: 0, y: 0 });
const componentStartPos = ref({ top: 0, left: 0 });
const componentStartSize = ref({ width: 0, height: 0 });

/**
 * Get the component definition
 */
const componentDefinition = computed(() => {
  try {
    return editorStore.getComponentDefinition(props.component.componentId);
  } catch (error) {
    console.error('Error getting component definition:', error);
    return undefined;
  }
});

/**
 * Get the rendered component
 */
const renderComponent = computed(() => {
  try {
    return componentDefinition.value?.component || 'div';
  } catch (error) {
    console.error('Error computing render component:', error);
    return 'div';
  }
});

/**
 * Component style based on component props
 */
const componentStyle = computed(() => {
  try {
    return {
      top: `${props.component.style.top}px`,
      left: `${props.component.style.left}px`,
      width: `${props.component.style.width}px`,
      height: `${props.component.style.height}px`,
      zIndex: props.component.style.zIndex,
      position: 'absolute',
      // Add selected style if needed
      ...(props.selected ? { border: '2px solid #409EFF' } : {}),
    };
  } catch (error) {
    console.error('Error computing component style:', error);
    return {};
  }
});

/**
 * Resize handles configuration
 */
const resizeHandles = [
  { type: 'top-left', class: 'top-left' },
  { type: 'top-right', class: 'top-right' },
  { type: 'bottom-left', class: 'bottom-left' },
  { type: 'bottom-right', class: 'bottom-right' },
  { type: 'top', class: 'top' },
  { type: 'right', class: 'right' },
  { type: 'bottom', class: 'bottom' },
  { type: 'left', class: 'left' },
];

/**
 * Handle component selection
 * @param event Mouse event
 */
const handleSelect = (event: MouseEvent) => {
  try {
    event.stopPropagation();
    emit('select', props.component.id);
  } catch (error) {
    console.error('Error selecting component:', error);
  }
};

/**
 * Begin dragging the component
 * @param event Mouse event
 */
const startDrag = (event: MouseEvent) => {
  try {
    event.stopPropagation();
    event.preventDefault();

    // Store initial positions
    dragStartPos.value = {
      x: event.clientX,
      y: event.clientY
    };
    
    componentStartPos.value = {
      top: props.component.style.top,
      left: props.component.style.left
    };
    
    // Set dragging state
    isDragging.value = true;
    
    // Add document listeners
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  } catch (error) {
    console.error('Error starting drag:', error);
  }
};

/**
 * Handle dragging the component
 * @param event Mouse event
 */
const onDrag = (event: MouseEvent) => {
  try {
    if (!isDragging.value) return;
    
    // Calculate new position
    const deltaX = event.clientX - dragStartPos.value.x;
    const deltaY = event.clientY - dragStartPos.value.y;
    
    // Update position (with snapping to grid if needed)
    const newLeft = componentStartPos.value.left + deltaX;
    const newTop = componentStartPos.value.top + deltaY;
    
    emit('update:position', props.component.id, {
      left: Math.max(0, newLeft),
      top: Math.max(0, newTop)
    });
  } catch (error) {
    console.error('Error during drag:', error);
  }
};

/**
 * Stop dragging the component
 */
const stopDrag = () => {
  try {
    isDragging.value = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
  } catch (error) {
    console.error('Error stopping drag:', error);
  }
};

/**
 * Begin resizing the component
 * @param event Mouse event
 * @param type Resize handle type
 */
const startResize = (event: MouseEvent, type: string) => {
  try {
    event.stopPropagation();
    event.preventDefault();
    
    // Store initial positions and sizes
    dragStartPos.value = {
      x: event.clientX,
      y: event.clientY
    };
    
    componentStartPos.value = {
      top: props.component.style.top,
      left: props.component.style.left
    };
    
    componentStartSize.value = {
      width: props.component.style.width,
      height: props.component.style.height
    };
    
    // Set resizing state
    resizeType.value = type;
    isResizing.value = true;
    
    // Add document listeners
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
  } catch (error) {
    console.error('Error starting resize:', error);
  }
};

/**
 * Handle resizing the component
 * @param event Mouse event
 */
const onResize = (event: MouseEvent) => {
  try {
    if (!isResizing.value) return;
    
    const deltaX = event.clientX - dragStartPos.value.x;
    const deltaY = event.clientY - dragStartPos.value.y;
    
    // Minimum dimensions
    const minWidth = 20;
    const minHeight = 20;
    
    // Update size and position based on resize type
    let newStyle: {
      width?: number;
      height?: number;
      top?: number;
      left?: number;
    } = {};
    
    switch (resizeType.value) {
      case 'top-left':
        newStyle = {
          width: Math.max(minWidth, componentStartSize.value.width - deltaX),
          height: Math.max(minHeight, componentStartSize.value.height - deltaY),
          left: componentStartPos.value.left + Math.min(deltaX, componentStartSize.value.width - minWidth),
          top: componentStartPos.value.top + Math.min(deltaY, componentStartSize.value.height - minHeight)
        };
        break;
        
      case 'top-right':
        newStyle = {
          width: Math.max(minWidth, componentStartSize.value.width + deltaX),
          height: Math.max(minHeight, componentStartSize.value.height - deltaY),
          top: componentStartPos.value.top + Math.min(deltaY, componentStartSize.value.height - minHeight)
        };
        break;
        
      case 'bottom-left':
        newStyle = {
          width: Math.max(minWidth, componentStartSize.value.width - deltaX),
          height: Math.max(minHeight, componentStartSize.value.height + deltaY),
          left: componentStartPos.value.left + Math.min(deltaX, componentStartSize.value.width - minWidth)
        };
        break;
        
      case 'bottom-right':
        newStyle = {
          width: Math.max(minWidth, componentStartSize.value.width + deltaX),
          height: Math.max(minHeight, componentStartSize.value.height + deltaY)
        };
        break;
        
      case 'top':
        newStyle = {
          height: Math.max(minHeight, componentStartSize.value.height - deltaY),
          top: componentStartPos.value.top + Math.min(deltaY, componentStartSize.value.height - minHeight)
        };
        break;
        
      case 'right':
        newStyle = {
          width: Math.max(minWidth, componentStartSize.value.width + deltaX)
        };
        break;
        
      case 'bottom':
        newStyle = {
          height: Math.max(minHeight, componentStartSize.value.height + deltaY)
        };
        break;
        
      case 'left':
        newStyle = {
          width: Math.max(minWidth, componentStartSize.value.width - deltaX),
          left: componentStartPos.value.left + Math.min(deltaX, componentStartSize.value.width - minWidth)
        };
        break;
    }
    
    // Update position if changed
    if (newStyle.top !== undefined || newStyle.left !== undefined) {
      const position = {
        top: newStyle.top !== undefined ? newStyle.top : props.component.style.top,
        left: newStyle.left !== undefined ? newStyle.left : props.component.style.left
      };
      emit('update:position', props.component.id, position);
    }
    
    // Update size if changed
    if (newStyle.width !== undefined || newStyle.height !== undefined) {
      const size = {
        width: newStyle.width !== undefined ? newStyle.width : props.component.style.width,
        height: newStyle.height !== undefined ? newStyle.height : props.component.style.height
      };
      emit('update:size', props.component.id, size);
    }
  } catch (error) {
    console.error('Error during resize:', error);
  }
};

/**
 * Stop resizing the component
 */
const stopResize = () => {
  try {
    isResizing.value = false;
    resizeType.value = null;
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
  } catch (error) {
    console.error('Error stopping resize:', error);
  }
};

/**
 * Delete the component
 */
const handleDelete = (event: MouseEvent) => {
  try {
    event.stopPropagation();
    editorStore.removeComponent(props.component.id);
  } catch (error) {
    console.error('Error deleting component:', error);
  }
};

// Clean up event listeners when component is unmounted
onUnmounted(() => {
  try {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', stopResize);
  } catch (error) {
    console.error('Error cleaning up event listeners:', error);
  }
});
</script>

<style scoped>
.canvas-component {
  box-sizing: border-box;
  position: absolute;
  user-select: none;
  overflow: hidden;
}

.selected {
  outline: 2px solid #409EFF;
  z-index: 10; /* Bring to front when selected */
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #409EFF;
  border-radius: 50%;
  z-index: 100;
}

.top-left {
  top: -4px;
  left: -4px;
  cursor: nwse-resize;
}

.top-right {
  top: -4px;
  right: -4px;
  cursor: nesw-resize;
}

.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: nesw-resize;
}

.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: nwse-resize;
}

.top {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.right {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.bottom {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: ns-resize;
}

.left {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  cursor: ew-resize;
}

.drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px;
  background-color: #409EFF;
  color: white;
  cursor: move;
  font-size: 12px;
  z-index: 100;
}

.delete-handle {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px;
  background-color: #f56c6c;
  color: white;
  cursor: pointer;
  font-size: 12px;
  z-index: 100;
}
</style> 