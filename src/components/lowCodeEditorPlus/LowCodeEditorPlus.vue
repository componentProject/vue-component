<template>
  <div class="low-code-editor-plus">
    <div class="editor-layout">
      <!-- Left panel: Component palette -->
      <div class="left-panel">
        <component-palette />
      </div>
      
      <!-- Middle panel: Canvas area -->
      <div class="center-panel">
        <canvas-area />
      </div>
      
      <!-- Right panel: Property editor -->
      <div class="right-panel">
        <property-editor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Low Code Editor Plus component
 * A visual editor for creating UIs with drag and drop
 */
import { onMounted, onUnmounted } from 'vue';
import ComponentPalette from './components/ComponentPalette.vue';
import CanvasArea from './components/CanvasArea.vue';
import PropertyEditor from './components/PropertyEditor.vue';
import { useEditorStore } from './store/editorStore';

// Initialize the editor store
const editorStore = useEditorStore();

/**
 * Setup keyboard shortcuts
 */
const setupKeyboardShortcuts = () => {
  try {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Use metaKey (Command) on Mac, ctrlKey on Windows/Linux
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;
      
      if (isCtrlOrCmd) {
        switch (event.key.toLowerCase()) {
          case 'z':
            // Ctrl+Z for undo
            if (!event.shiftKey) {
              event.preventDefault();
              editorStore.undo();
            }
            break;
          case 'y':
            // Ctrl+Y for redo
            event.preventDefault();
            editorStore.redo();
            break;
          case 'c':
            // Ctrl+C for copy
            if (editorStore.selectedComponent) {
              event.preventDefault();
              editorStore.copyComponent();
            }
            break;
          case 'v':
            // Ctrl+V for paste
            if (editorStore.state.clipboard) {
              event.preventDefault();
              editorStore.pasteComponent();
            }
            break;
          case 'x':
            // Ctrl+X for cut (copy + delete)
            if (editorStore.selectedComponent) {
              event.preventDefault();
              editorStore.copyComponent();
              editorStore.removeComponent(editorStore.selectedComponent.id);
            }
            break;
        }
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        // Delete for removing selected component
        if (editorStore.selectedComponent && 
            document.activeElement === document.body) {
          event.preventDefault();
          editorStore.removeComponent(editorStore.selectedComponent.id);
        }
      }
    };
    
    // Register keyboard events
    document.addEventListener('keydown', handleKeyDown);
    
    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  } catch (error) {
    console.error('Error setting up keyboard shortcuts:', error);
  }
};

onMounted(() => {
  try {
    const cleanupKeyboardShortcuts = setupKeyboardShortcuts();
    
    onUnmounted(() => {
      if (cleanupKeyboardShortcuts) cleanupKeyboardShortcuts();
    });
  } catch (error) {
    console.error('Error in editor mounting:', error);
  }
});
</script>

<style scoped>
.low-code-editor-plus {
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-panel {
  width: 240px;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

.center-panel {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.right-panel {
  width: 300px;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .left-panel {
    width: 200px;
  }
  
  .right-panel {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .editor-layout {
    flex-direction: column;
  }
  
  .left-panel, 
  .right-panel {
    width: 100%;
    height: 300px;
  }
  
  .center-panel {
    height: auto;
  }
}
</style> 