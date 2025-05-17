<template>
  <div class="low-code-editor">
    <div class="editor-toolbar">
      <el-button-group>
        <el-button @click="handleUndo" :disabled="!canUndo">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <el-button @click="handleRedo" :disabled="!canRedo">
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </el-button-group>
      
      <el-button-group>
        <el-button @click="handleShowGrid">
          <el-icon><Grid /></el-icon>
        </el-button>
        <el-dropdown @command="handleZoom">
          <el-button>
            {{ Math.round(editorStore.canvas.scale * 100) }}%
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="50">50%</el-dropdown-item>
              <el-dropdown-item command="75">75%</el-dropdown-item>
              <el-dropdown-item command="100">100%</el-dropdown-item>
              <el-dropdown-item command="125">125%</el-dropdown-item>
              <el-dropdown-item command="150">150%</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-button-group>
      
      <div class="spacer"></div>
      
      <el-button-group>
        <el-button @click="handlePreview">
          <el-icon><View /></el-icon>
        </el-button>
        <el-button @click="handleExport">
          <el-icon><Download /></el-icon>
        </el-button>
        <el-button @click="handleImport">
          <el-icon><Upload /></el-icon>
        </el-button>
        <el-button @click="handleClear" type="danger">
          <el-icon><Delete /></el-icon>
        </el-button>
      </el-button-group>
    </div>

    <div class="editor-container">
      <ComponentPanel class="component-panel" />
      
      <Canvas class="canvas-container" />
      
      <PropertyPanel 
        class="property-panel" 
        v-if="editorStore.selectedComponentId" 
      />
    </div>

    <!-- Preview Dialog -->
    <el-dialog v-model="previewVisible" title="Preview" width="80%" top="5vh">
      <div class="preview-container">
        <!-- Preview content -->
        <PreviewRenderer :components="editorStore.canvasComponents" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="previewVisible = false">Close</el-button>
          <el-button type="primary" @click="handleGenerateCode">
            Generate Code
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Export Dialog -->
    <el-dialog v-model="exportVisible" title="Export Schema" width="60%">
      <div class="export-container">
        <el-input
          v-model="exportedSchema"
          type="textarea"
          :rows="10"
          readonly
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="exportVisible = false">Close</el-button>
          <el-button type="primary" @click="handleCopySchema">
            Copy to Clipboard
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Import Dialog -->
    <el-dialog v-model="importVisible" title="Import Schema" width="60%">
      <div class="import-container">
        <el-input
          v-model="importSchema"
          type="textarea"
          :rows="10"
          placeholder="Paste JSON schema here..."
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleConfirmImport">
            Import
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowDown, 
  Grid, 
  View, 
  Download, 
  Upload, 
  Delete 
} from '@element-plus/icons-vue';
import { useEditorStore } from './store/editor';
import ComponentPanel from './components/ComponentPanel/index.vue';
import Canvas from './components/Canvas/index.vue';
import PropertyPanel from './components/PropertyPanel/index.vue';
import PreviewRenderer from './components/Preview/PreviewRenderer.vue';
import { registerBaseComponents } from './components/BaseComponents';
import { useClipboard } from '@vueuse/core';

/**
 * Main component for the low-code editor
 * Manages the overall layout and global actions
 */
const editorStore = useEditorStore();
const { copy, copied } = useClipboard();

// Dialog visibility states
const previewVisible = ref(false);
const exportVisible = ref(false);
const importVisible = ref(false);

// Export/import state
const exportedSchema = ref('');
const importSchema = ref('');

// Computed properties
const canUndo = computed(() => editorStore.canUndo);
const canRedo = computed(() => editorStore.canRedo);

/**
 * Initialize the editor
 */
onMounted(() => {
  try {
    // Register all available components
    registerBaseComponents();
  } catch (error) {
    console.error('Error initializing editor:', error);
    ElMessage.error('Failed to initialize editor');
  }
});

/**
 * Handle undo action
 */
const handleUndo = () => {
  try {
    editorStore.undo();
  } catch (error) {
    console.error('Error in undo action:', error);
    ElMessage.error('Undo operation failed');
  }
};

/**
 * Handle redo action
 */
const handleRedo = () => {
  try {
    editorStore.redo();
  } catch (error) {
    console.error('Error in redo action:', error);
    ElMessage.error('Redo operation failed');
  }
};

/**
 * Toggle grid display on canvas
 */
const handleShowGrid = () => {
  try {
    editorStore.updateCanvas({ showGrid: !editorStore.canvas.showGrid });
  } catch (error) {
    console.error('Error toggling grid:', error);
    ElMessage.error('Failed to toggle grid');
  }
};

/**
 * Handle zoom level change
 * @param command Zoom level as string percentage
 */
const handleZoom = (command: string) => {
  try {
    const scale = parseInt(command, 10) / 100;
    editorStore.updateCanvas({ scale });
  } catch (error) {
    console.error('Error changing zoom level:', error);
    ElMessage.error('Failed to update zoom level');
  }
};

/**
 * Open preview dialog
 */
const handlePreview = () => {
  try {
    if (editorStore.canvasComponents.length === 0) {
      ElMessage.warning('No components to preview');
      return;
    }
    
    previewVisible.value = true;
  } catch (error) {
    console.error('Error opening preview:', error);
    ElMessage.error('Failed to open preview');
  }
};

/**
 * Generate code from the current design
 * Not fully implemented in this version
 */
const handleGenerateCode = () => {
  try {
    ElMessage.info('Code generation feature coming soon');
    // Would implement code generation logic here
  } catch (error) {
    console.error('Error generating code:', error);
    ElMessage.error('Failed to generate code');
  }
};

/**
 * Open export dialog and generate schema
 */
const handleExport = () => {
  try {
    if (editorStore.canvasComponents.length === 0) {
      ElMessage.warning('No components to export');
      return;
    }
    
    const schema = editorStore.exportSchema();
    exportedSchema.value = JSON.stringify(schema, null, 2);
    exportVisible.value = true;
  } catch (error) {
    console.error('Error exporting schema:', error);
    ElMessage.error('Failed to export schema');
  }
};

/**
 * Copy schema to clipboard
 */
const handleCopySchema = async () => {
  try {
    await copy(exportedSchema.value);
    ElMessage.success('Schema copied to clipboard');
  } catch (error) {
    console.error('Error copying schema:', error);
    ElMessage.error('Failed to copy schema');
  }
};

/**
 * Open import dialog
 */
const handleImport = () => {
  try {
    importSchema.value = '';
    importVisible.value = true;
  } catch (error) {
    console.error('Error opening import dialog:', error);
    ElMessage.error('Failed to open import dialog');
  }
};

/**
 * Process schema import
 */
const handleConfirmImport = () => {
  try {
    if (!importSchema.value.trim()) {
      ElMessage.warning('Schema is empty');
      return;
    }
    
    try {
      const schema = JSON.parse(importSchema.value);
      editorStore.importSchema(schema);
      importVisible.value = false;
      ElMessage.success('Schema imported successfully');
    } catch (e) {
      ElMessage.error('Invalid JSON schema');
    }
  } catch (error) {
    console.error('Error importing schema:', error);
    ElMessage.error('Failed to import schema');
  }
};

/**
 * Clear the canvas after confirmation
 */
const handleClear = () => {
  try {
    if (editorStore.canvasComponents.length === 0) {
      return;
    }
    
    ElMessageBox.confirm(
      'This will clear all components from the canvas. Continue?',
      'Warning',
      {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning',
      }
    )
      .then(() => {
        editorStore.clearCanvas();
        ElMessage.success('Canvas cleared');
      })
      .catch(() => {
        // User canceled
      });
  } catch (error) {
    console.error('Error clearing canvas:', error);
    ElMessage.error('Failed to clear canvas');
  }
};
</script>

<style scoped>
.low-code-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f5f7fa;
}

.editor-toolbar {
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.spacer {
  flex: 1;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.component-panel {
  width: 280px;
  border-right: 1px solid #dcdfe6;
  background-color: #fff;
  overflow-y: auto;
}

.canvas-container {
  flex: 1;
  overflow: auto;
  position: relative;
}

.property-panel {
  width: 320px;
  border-left: 1px solid #dcdfe6;
  background-color: #fff;
  overflow-y: auto;
}

.preview-container,
.export-container,
.import-container {
  width: 100%;
  min-height: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
}
</style> 