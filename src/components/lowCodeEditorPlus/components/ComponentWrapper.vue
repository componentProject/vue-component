<template>
  <div 
    class="component-wrapper"
    :class="{ 'selected': selected, 'locked': component.locked }"
    :style="wrapperStyles"
    @click.stop="selectComponent"
    ref="wrapperRef"
  >
    <!-- Rendered component -->
    <component
      :is="component.type"
      v-bind="componentProps"
      class="rendered-component"
    />

    <!-- Resize handles (only visible when selected and not locked) -->
    <template v-if="selected && !component.locked">
      <div 
        v-for="handle in resizeHandles" 
        :key="handle.position"
        class="resize-handle"
        :class="handle.position"
        @mousedown="(e) => startResize(e, handle.position)"
      ></div>
      
      <!-- Component controls when selected -->
      <div class="component-controls">
        <el-button-group>
          <el-button type="primary" size="small" @click.stop="toggleLock">
            <el-icon>
              <component :is="component.locked ? 'Lock' : 'Unlock'" />
            </el-icon>
          </el-button>
          <el-button type="danger" size="small" @click.stop="removeComponent">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="default" size="small" @click.stop="copyComponent">
            <el-icon><CopyDocument /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
/**
 * Component wrapper for handling resizing, moving, and selecting components on the canvas
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Delete, CopyDocument, Lock, Unlock } from '@element-plus/icons-vue';
import { useEditorStore } from '../store/editorStore';
import type { ComponentInstance } from '../types';

// Props
const props = defineProps<{
  component: ComponentInstance;
  selected: boolean;
}>();

// Emits
const emit = defineEmits<{
  select: [id: string];
}>();

// Store
const editorStore = useEditorStore();

// Refs
const wrapperRef = ref<HTMLElement | null>(null);

// Resize and drag state
const resizing = ref(false);
const dragging = ref(false);
const resizeDirection = ref('');
const startPosition = ref({ x: 0, y: 0 });
const startSize = ref({ width: 0, height: 0 });
const startComponentPosition = ref({ x: 0, y: 0 });

/**
 * Component props with special handling for slot content
 */
const componentProps = computed(() => {
  try {
    const { props, events } = props.component;
    
    // Handle special props based on component type
    switch (props.component.type) {
      case 'el-button':
        return {
          ...props,
          type: props.type || 'primary',
          children: props.text || 'Button',
        };
      case 'el-tabs':
        // Special handling for tabs
        return {
          ...props,
        };
      default:
        return {
          ...props,
        };
    }
  } catch (error) {
    console.error('Error computing component props:', error);
    return props.component.props;
  }
});

/**
 * Wrapper styles including position
 */
const wrapperStyles = computed(() => {
  try {
    return {
      ...props.component.style,
      position: 'absolute',
      top: props.component.position?.y ? `${props.component.position.y}px` : '0px',
      left: props.component.position?.x ? `${props.component.position.x}px` : '0px',
      width: props.component.position?.width ? `${props.component.position.width}px` : 'auto',
      height: props.component.position?.height ? `${props.component.position.height}px` : 'auto',
    };
  } catch (error) {
    console.error('Error computing wrapper styles:', error);
    return {};
  }
});

/**
 * List of resize handles
 */
const resizeHandles = [
  { position: 'top-left' },
  { position: 'top-right' },
  { position: 'bottom-left' },
  { position: 'bottom-right' },
  { position: 'top' },
  { position: 'right' },
  { position: 'bottom' },
  { position: 'left' },
];

/**
 * Select this component
 */
const selectComponent = () => {
  try {
    if (!props.component.locked) {
      emit('select', props.component.id);
    }
  } catch (error) {
    console.error('Error selecting component:', error);
  }
};

/**
 * Toggle the lock state of the component
 */
const toggleLock = () => {
  try {
    editorStore.toggleLock(props.component.id);
  } catch (error) {
    console.error('Error toggling lock:', error);
  }
};

/**
 * Remove the component
 */
const removeComponent = () => {
  try {
    editorStore.removeComponent(props.component.id);
  } catch (error) {
    console.error('Error removing component:', error);
  }
};

/**
 * Copy the component
 */
const copyComponent = () => {
  try {
    editorStore.copyComponent();
  } catch (error) {
    console.error('Error copying component:', error);
  }
};

/**
 * Start resizing the component
 */
const startResize = (event: MouseEvent, direction: string) => {
  try {
    event.preventDefault();
    event.stopPropagation();
    
    if (props.component.locked) return;
    
    resizing.value = true;
    resizeDirection.value = direction;
    
    // Record starting position and size
    startPosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
    
    if (props.component.position) {
      startSize.value = {
        width: props.component.position.width,
        height: props.component.position.height,
      };
      
      startComponentPosition.value = {
        x: props.component.position.x,
        y: props.component.position.y,
      };
    }
    
    // Add document-level event listeners
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  } catch (error) {
    console.error('Error starting resize:', error);
  }
};

/**
 * Handle resizing during mouse move
 */
const handleResize = (event: MouseEvent) => {
  try {
    if (!resizing.value) return;
    
    event.preventDefault();
    
    const dx = event.clientX - startPosition.value.x;
    const dy = event.clientY - startPosition.value.y;
    
    // Calculate new size and position based on resize direction
    let newPosition = { ...startComponentPosition.value };
    let newSize = { ...startSize.value };
    
    switch (resizeDirection.value) {
      case 'top-left':
        newPosition.x = startComponentPosition.value.x + dx;
        newPosition.y = startComponentPosition.value.y + dy;
        newSize.width = startSize.value.width - dx;
        newSize.height = startSize.value.height - dy;
        break;
      case 'top-right':
        newPosition.y = startComponentPosition.value.y + dy;
        newSize.width = startSize.value.width + dx;
        newSize.height = startSize.value.height - dy;
        break;
      case 'bottom-left':
        newPosition.x = startComponentPosition.value.x + dx;
        newSize.width = startSize.value.width - dx;
        newSize.height = startSize.value.height + dy;
        break;
      case 'bottom-right':
        newSize.width = startSize.value.width + dx;
        newSize.height = startSize.value.height + dy;
        break;
      case 'top':
        newPosition.y = startComponentPosition.value.y + dy;
        newSize.height = startSize.value.height - dy;
        break;
      case 'right':
        newSize.width = startSize.value.width + dx;
        break;
      case 'bottom':
        newSize.height = startSize.value.height + dy;
        break;
      case 'left':
        newPosition.x = startComponentPosition.value.x + dx;
        newSize.width = startSize.value.width - dx;
        break;
    }
    
    // Apply minimum size constraints
    newSize.width = Math.max(newSize.width, 20);
    newSize.height = Math.max(newSize.height, 20);
    
    // Update component position and size
    editorStore.updateComponent(props.component.id, {
      position: {
        x: newPosition.x,
        y: newPosition.y,
        width: newSize.width,
        height: newSize.height,
      },
    });
  } catch (error) {
    console.error('Error handling resize:', error);
  }
};

/**
 * Stop resizing and clean up
 */
const stopResize = () => {
  try {
    if (resizing.value) {
      resizing.value = false;
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', stopResize);
    }
  } catch (error) {
    console.error('Error stopping resize:', error);
  }
};

/**
 * Setup component dragging
 */
const setupDragging = () => {
  try {
    if (!wrapperRef.value) return;
    
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let componentStartX = 0;
    let componentStartY = 0;
    
    const startDrag = (event: MouseEvent) => {
      if (props.component.locked || resizing.value) return;
      
      // Skip if clicking on a resize handle
      const target = event.target as HTMLElement;
      if (target.classList.contains('resize-handle')) return;
      
      event.preventDefault();
      
      isDragging = true;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      
      if (props.component.position) {
        componentStartX = props.component.position.x;
        componentStartY = props.component.position.y;
      }
      
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    };
    
    const handleDrag = (event: MouseEvent) => {
      if (!isDragging) return;
      
      event.preventDefault();
      
      const dx = event.clientX - dragStartX;
      const dy = event.clientY - dragStartY;
      
      editorStore.updateComponent(props.component.id, {
        position: {
          x: componentStartX + dx,
          y: componentStartY + dy,
          width: props.component.position?.width || 0,
          height: props.component.position?.height || 0,
        },
      });
    };
    
    const stopDrag = () => {
      if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
      }
    };
    
    wrapperRef.value.addEventListener('mousedown', startDrag);
    
    // Cleanup function
    return () => {
      wrapperRef.value?.removeEventListener('mousedown', startDrag);
    };
  } catch (error) {
    console.error('Error setting up dragging:', error);
  }
};

onMounted(() => {
  try {
    const cleanup = setupDragging();
    onUnmounted(() => {
      if (cleanup) cleanup();
    });
  } catch (error) {
    console.error('Error in component wrapper mounting:', error);
  }
});
</script>

<style scoped>
.component-wrapper {
  position: absolute;
  box-sizing: border-box;
  cursor: move;
}

.component-wrapper.selected {
  outline: 2px solid #409eff;
  z-index: 10;
}

.component-wrapper.locked {
  cursor: not-allowed;
  opacity: 0.8;
}

.resize-handle {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border-radius: 50%;
  z-index: 100;
}

.top-left {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.top-right {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.bottom-left {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.bottom-right {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}

.top {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: n-resize;
}

.right {
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: e-resize;
}

.bottom {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  cursor: s-resize;
}

.left {
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  cursor: w-resize;
}

.component-controls {
  position: absolute;
  top: -36px;
  right: 0;
  z-index: 100;
}

.rendered-component {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style> 