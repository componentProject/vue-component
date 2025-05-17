<template>
  <div class="canvas-container">
    <div class="canvas-toolbar">
      <div class="left-controls">
        <el-button-group>
          <el-button @click="undo" :disabled="!canUndo" type="default" size="small">
            <el-icon><Back /></el-icon>
            Undo
          </el-button>
          <el-button @click="redo" :disabled="!canRedo" type="default" size="small">
            <el-icon><Right /></el-icon>
            Redo
          </el-button>
        </el-button-group>
      </div>
      <div class="center-controls">
        <el-button-group>
          <el-button @click="setViewMode('desktop')" :type="editorStore.state.viewMode === 'desktop' ? 'primary' : 'default'" size="small">
            <el-icon><Monitor /></el-icon>
          </el-button>
          <el-button @click="setViewMode('tablet')" :type="editorStore.state.viewMode === 'tablet' ? 'primary' : 'default'" size="small">
            <el-icon><Cellphone /></el-icon>
          </el-button>
          <el-button @click="setViewMode('mobile')" :type="editorStore.state.viewMode === 'mobile' ? 'primary' : 'default'" size="small">
            <el-icon><Promotion /></el-icon>
          </el-button>
        </el-button-group>
      </div>
      <div class="right-controls">
        <el-button-group>
          <el-button @click="openExportDialog" type="default" size="small">
            <el-icon><Download /></el-icon>
            Export
          </el-button>
          <el-button @click="openImportDialog" type="default" size="small">
            <el-icon><Upload /></el-icon>
            Import
          </el-button>
        </el-button-group>
        <el-slider v-model="zoomLevel" :min="50" :max="150" :step="10" size="small" :format-tooltip="formatZoom" @input="updateZoom" style="width: 120px; margin-left: 10px;"></el-slider>
      </div>
    </div>

    <div 
      class="canvas-area" 
      :class="[`view-${editorStore.state.viewMode}`]"
      ref="canvasRef"
      @dragover="onDragOver"
      @drop="onDrop"
      @click="onCanvasClick"
      :style="{ 
        transform: `scale(${editorStore.state.zoom})`,
        width: getCanvasWidth,
        height: `${editorStore.state.canvasSize.height}px`
      }"
    >
      <!-- Components on canvas -->
      <component-wrapper
        v-for="component in editorStore.state.components"
        :key="component.id"
        :component="component"
        :selected="component.id === editorStore.state.selectedComponentId"
        @select="selectComponent"
      />

      <!-- Alignment guides -->
      <div v-for="(guide, index) in alignmentGuides" :key="`guide-${index}`" 
        class="alignment-guide" :style="guideStyles(guide)"></div>
    </div>

    <!-- Import/Export Dialogs -->
    <el-dialog v-model="exportDialogVisible" title="Export Design" width="500px">
      <div class="export-container">
        <p>Copy the JSON schema below:</p>
        <el-input
          type="textarea"
          v-model="exportJsonText"
          rows="10"
          readonly
        ></el-input>
        <div class="dialog-footer">
          <el-button @click="copyToClipboard">Copy to Clipboard</el-button>
          <el-button @click="downloadJson">Download JSON</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="importDialogVisible" title="Import Design" width="500px">
      <div class="import-container">
        <p>Paste your JSON schema below:</p>
        <el-input
          type="textarea"
          v-model="importJsonText"
          rows="10"
          placeholder="Paste JSON schema here..."
        ></el-input>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="importSchema">Import</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
/**
 * Canvas area for the low-code editor
 */
import { ref, computed, onMounted, reactive } from 'vue';
import { Back, Right, Monitor, Cellphone, Promotion, Download, Upload } from '@element-plus/icons-vue';
import { useEditorStore } from '../store/editorStore';
import type { ComponentDefinition, ComponentInstance } from '../types';
import { findComponentByType } from '../hooks/useComponentRegistry';
import ComponentWrapper from './ComponentWrapper.vue';
import { ElMessage } from 'element-plus';

// Editor store for state management
const editorStore = useEditorStore();

// Refs
const canvasRef = ref<HTMLElement | null>(null);
const exportDialogVisible = ref(false);
const importDialogVisible = ref(false);
const exportJsonText = ref('');
const importJsonText = ref('');

// Zoom level (50% to 150%)
const zoomLevel = ref(100);

// Alignment guides for magnetic snapping
const alignmentGuides = reactive<Array<{ type: 'horizontal' | 'vertical'; position: number }>>([]);

/**
 * Format the zoom level for display
 */
const formatZoom = (val: number) => {
  return `${val}%`;
};

/**
 * Update the zoom level in the store
 */
const updateZoom = (val: number) => {
  try {
    editorStore.setZoom(val / 100);
  } catch (error) {
    console.error('Error updating zoom:', error);
  }
};

/**
 * Get the canvas width based on the current view mode
 */
const getCanvasWidth = computed(() => {
  switch (editorStore.state.viewMode) {
    case 'desktop':
      return `${editorStore.state.canvasSize.width}px`;
    case 'tablet':
      return '768px';
    case 'mobile':
      return '375px';
    default:
      return `${editorStore.state.canvasSize.width}px`;
  }
});

/**
 * Check if undo is available
 */
const canUndo = computed(() => {
  return editorStore.state.history.past.length > 0;
});

/**
 * Check if redo is available
 */
const canRedo = computed(() => {
  return editorStore.state.history.future.length > 0;
});

/**
 * Handle undo action
 */
const undo = () => {
  try {
    editorStore.undo();
  } catch (error) {
    console.error('Error performing undo:', error);
  }
};

/**
 * Handle redo action
 */
const redo = () => {
  try {
    editorStore.redo();
  } catch (error) {
    console.error('Error performing redo:', error);
  }
};

/**
 * Set the view mode (desktop, tablet, mobile)
 */
const setViewMode = (mode: 'desktop' | 'tablet' | 'mobile') => {
  try {
    editorStore.setViewMode(mode);
  } catch (error) {
    console.error('Error setting view mode:', error);
  }
};

/**
 * Handle drag over event
 */
const onDragOver = (event: DragEvent) => {
  try {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  } catch (error) {
    console.error('Error handling drag over:', error);
  }
};

/**
 * Handle drop event to add new component to canvas
 */
const onDrop = (event: DragEvent) => {
  try {
    event.preventDefault();
    
    if (!event.dataTransfer) return;
    
    const jsonData = event.dataTransfer.getData('application/json');
    if (!jsonData) return;
    
    const componentData = JSON.parse(jsonData) as ComponentDefinition;
    const rect = canvasRef.value?.getBoundingClientRect();
    
    if (!rect) return;
    
    // Calculate position relative to canvas
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Create the new component
    const newComponent: Omit<ComponentInstance, 'id'> = {
      type: componentData.type,
      name: componentData.name,
      props: componentData.defaultProps || {},
      style: {
        ...componentData.defaultStyle || {},
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
      },
      events: componentData.defaultEvents || {},
      position: {
        x,
        y,
        width: 100,
        height: 40,
      },
      children: [],
    };
    
    editorStore.addComponent(newComponent);
  } catch (error) {
    console.error('Error handling drop:', error);
  }
};

/**
 * Handle canvas click to deselect components
 */
const onCanvasClick = (event: MouseEvent) => {
  try {
    // Only deselect if clicking directly on the canvas, not on a component
    if (event.target === canvasRef.value) {
      editorStore.selectComponent(null);
    }
  } catch (error) {
    console.error('Error handling canvas click:', error);
  }
};

/**
 * Select a component
 */
const selectComponent = (id: string) => {
  try {
    editorStore.selectComponent(id);
  } catch (error) {
    console.error('Error selecting component:', error);
  }
};

/**
 * Generate styles for alignment guides
 */
const guideStyles = (guide: { type: 'horizontal' | 'vertical', position: number }) => {
  if (guide.type === 'horizontal') {
    return {
      left: '0',
      width: '100%',
      top: `${guide.position}px`,
      height: '1px',
    };
  } else {
    return {
      top: '0',
      height: '100%',
      left: `${guide.position}px`,
      width: '1px',
    };
  }
};

/**
 * Open export dialog
 */
const openExportDialog = () => {
  try {
    exportJsonText.value = JSON.stringify(editorStore.exportSchema(), null, 2);
    exportDialogVisible.value = true;
  } catch (error) {
    console.error('Error opening export dialog:', error);
    ElMessage.error('Failed to generate export data');
  }
};

/**
 * Open import dialog
 */
const openImportDialog = () => {
  importJsonText.value = '';
  importDialogVisible.value = true;
};

/**
 * Copy export JSON to clipboard
 */
const copyToClipboard = () => {
  try {
    navigator.clipboard.writeText(exportJsonText.value);
    ElMessage.success('Copied to clipboard');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    ElMessage.error('Failed to copy to clipboard');
  }
};

/**
 * Download JSON as a file
 */
const downloadJson = () => {
  try {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJsonText.value);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "low-code-design.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  } catch (error) {
    console.error('Error downloading JSON:', error);
    ElMessage.error('Failed to download JSON');
  }
};

/**
 * Import schema from JSON
 */
const importSchema = () => {
  try {
    const schema = JSON.parse(importJsonText.value);
    editorStore.importSchema(schema);
    importDialogVisible.value = false;
    ElMessage.success('Schema imported successfully');
  } catch (error) {
    console.error('Error importing schema:', error);
    ElMessage.error('Failed to import schema. Please check your JSON format.');
  }
};

/**
 * Initialize the canvas area
 */
onMounted(() => {
  try {
    zoomLevel.value = editorStore.state.zoom * 100;
  } catch (error) {
    console.error('Error initializing canvas:', error);
  }
});
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f5f7fa;
}

.canvas-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  height: 50px;
}

.left-controls, .center-controls, .right-controls {
  display: flex;
  align-items: center;
}

.canvas-area {
  flex: 1;
  position: relative;
  margin: 20px auto;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform-origin: top center;
  transition: width 0.3s;
  overflow: hidden;
}

.view-desktop {
  max-width: 100%;
}

.view-tablet {
  max-width: 768px;
}

.view-mobile {
  max-width: 375px;
}

.alignment-guide {
  position: absolute;
  background-color: #409eff;
  pointer-events: none;
  z-index: 1000;
}

.export-container, .import-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
}
</style> 