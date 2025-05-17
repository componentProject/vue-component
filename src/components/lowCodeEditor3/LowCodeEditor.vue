<template>
  <div class="low-code-editor">
    <div class="editor-header">
      <div class="editor-title">
        <h1>{{ title }}</h1>
      </div>
      
      <div class="editor-toolbar">
        <el-button-group>
          <el-button size="small" @click="handleUndo" :disabled="!canUndo">
            <el-icon><Back /></el-icon>
            撤销
          </el-button>
          <el-button size="small" @click="handleRedo" :disabled="!canRedo">
            <el-icon><Right /></el-icon>
            重做
          </el-button>
        </el-button-group>
        
        <el-button-group class="ml-2">
          <el-button size="small" @click="handleCopy" :disabled="!selectedId">
            <el-icon><CopyDocument /></el-icon>
            复制
          </el-button>
          <el-button size="small" @click="handlePaste" :disabled="!canPaste">
            <el-icon><Document /></el-icon>
            粘贴
          </el-button>
          <el-button size="small" @click="handleDelete" :disabled="!selectedId">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </el-button-group>
        
        <el-button-group class="ml-2">
          <el-button size="small" @click="toggleGrid">
            <el-icon><Grid /></el-icon>
            {{ showGrid ? '隐藏网格' : '显示网格' }}
          </el-button>
          <el-button size="small" @click="toggleSnapToGrid">
            <el-icon><Position /></el-icon>
            {{ snapToGrid ? '关闭对齐' : '开启对齐' }}
          </el-button>
        </el-button-group>
        
        <div class="flex-spacer"></div>
        
        <el-button-group>
          <el-button size="small" @click="handleClear" type="danger">
            <el-icon><Delete /></el-icon>
            清空画布
          </el-button>
          <el-button size="small" @click="handleImport" type="primary">
            <el-icon><Upload /></el-icon>
            导入
          </el-button>
          <el-button size="small" @click="handleExport" type="primary">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </el-button-group>
      </div>
    </div>
    
    <div class="editor-container">
      <div class="editor-sidebar left">
        <component-panel
          :custom-components="customComponents"
        />
      </div>
      
      <div class="editor-content">
        <canvas-component
          :components="components"
          :selected-id="selectedId"
          :hovered-id="hoveredId"
          :show-grid="showGrid"
          :snap-to-grid="snapToGrid"
          :grid-size="gridSize"
          :zoom="zoom"
          :width="canvasSize.width"
          :height="canvasSize.height"
          :alignment-lines="alignmentLines"
          @add="handleAddComponent"
          @select="handleSelectComponent"
          @hover="handleHoverComponent"
          @update="handleUpdateComponent"
          @delete="handleDeleteComponent"
          @zoom-change="handleZoomChange"
        />
      </div>
      
      <div class="editor-sidebar right">
        <property-panel
          :selected-component="selectedComponent"
          @update-props="handleUpdateComponentProps"
          @update-style="handleUpdateComponentStyle"
        />
      </div>
    </div>
    
    <!-- 导入对话框 -->
    <el-dialog
      v-model="showImportDialog"
      title="导入 JSON"
      width="600px"
    >
      <el-input
        v-model="importValue"
        type="textarea"
        rows="10"
        placeholder="请粘贴JSON数据"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showImportDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmImport">确认</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 导出对话框 -->
    <el-dialog
      v-model="showExportDialog"
      title="导出 JSON"
      width="600px"
    >
      <el-input
        v-model="exportValue"
        type="textarea"
        rows="10"
        readonly
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showExportDialog = false">关闭</el-button>
          <el-button type="primary" @click="copyExportValue">复制</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 清空确认对话框 -->
    <el-dialog
      v-model="showClearDialog"
      title="确认清空"
      width="400px"
    >
      <p>确定要清空画布吗？此操作将删除所有组件且不可恢复。</p>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showClearDialog = false">取消</el-button>
          <el-button type="danger" @click="confirmClear">确认清空</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
/**
 * 低代码编辑器组件
 * 主入口文件
 */
import { ref, computed, onMounted, watch } from 'vue';
import { ElButton, ElButtonGroup, ElIcon, ElDialog, ElInput, ElMessage } from 'element-plus';
import { Back, Right, CopyDocument, Document, Delete, Grid, Position, Upload, Download } from '@element-plus/icons-vue';
import ComponentPanel from './components/ComponentPanel/index.vue';
import CanvasComponent from './components/Canvas/index.vue';
import PropertyPanel from './components/PropertyPanel/index.vue';
import { useEditorStore } from './store/editorStore';
import type { ComponentData, ComponentDefinition, LowCodeEditorConfig } from './types';

/**
 * 组件属性
 */
interface Props {
  /**
   * 编辑器标题
   */
  title?: string;
  /**
   * 初始组件数据
   */
  initialComponents?: ComponentData[];
  /**
   * 自定义组件定义
   */
  customComponents?: ComponentDefinition[];
  /**
   * 画布大小
   */
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * 组件属性默认值
 */
const props = withDefaults(defineProps<Props>(), {
  title: '低代码编辑器',
  initialComponents: () => [],
  customComponents: () => [],
  canvasWidth: 1200,
  canvasHeight: 800,
});

/**
 * 事件
 */
const emit = defineEmits<{
  /**
   * 组件变更事件
   */
  (e: 'change', components: ComponentData[]): void;
  /**
   * 选择组件事件
   */
  (e: 'select', id: string | null): void;
  /**
   * 导出事件
   */
  (e: 'export', json: string): void;
  /**
   * 导入事件
   */
  (e: 'import', json: string): void;
}>();

/**
 * 编辑器状态
 */
const editorStore = useEditorStore();

/**
 * 导入/导出对话框状态
 */
const showImportDialog = ref(false);
const showExportDialog = ref(false);
const showClearDialog = ref(false);
const importValue = ref('');
const exportValue = ref('');

/**
 * 计算属性
 */
const components = computed(() => editorStore.components);
const selectedId = computed(() => editorStore.selectedId);
const hoveredId = computed(() => editorStore.hoveredId);
const canUndo = computed(() => editorStore.canUndo);
const canRedo = computed(() => editorStore.canRedo);
const selectedComponent = computed(() => editorStore.selectedComponent);
const canPaste = computed(() => editorStore.clipboardData !== null);
const canvasSize = computed(() => editorStore.canvasSize);
const showGrid = computed(() => editorStore.showGrid);
const snapToGrid = computed(() => editorStore.snapToGrid);
const gridSize = computed(() => editorStore.gridSize);
const zoom = computed(() => editorStore.zoom);
const alignmentLines = ref({ horizontal: null, vertical: null });

/**
 * 初始化
 */
onMounted(() => {
  try {
    // 初始化编辑器状态
    editorStore.init({
      components: props.initialComponents,
      canvasSize: {
        width: props.canvasWidth,
        height: props.canvasHeight,
      },
    });
  } catch (error) {
    console.error(`初始化低代码编辑器失败: ${error}`);
  }
});

/**
 * 监听组件变化
 */
watch(components, (newComponents) => {
  try {
    emit('change', newComponents);
  } catch (error) {
    console.error(`组件变化监听失败: ${error}`);
  }
}, { deep: true });

/**
 * 监听选中组件变化
 */
watch(selectedId, (newSelectedId) => {
  try {
    emit('select', newSelectedId);
  } catch (error) {
    console.error(`选中组件变化监听失败: ${error}`);
  }
});

/**
 * 添加组件
 */
const handleAddComponent = (type: string, position: { x: number; y: number }) => {
  try {
    editorStore.addComponent(type, position);
  } catch (error) {
    console.error(`添加组件失败: ${error}`);
  }
};

/**
 * 选择组件
 */
const handleSelectComponent = (id: string | null) => {
  try {
    editorStore.selectComponent(id);
  } catch (error) {
    console.error(`选择组件失败: ${error}`);
  }
};

/**
 * 悬停组件
 */
const handleHoverComponent = (id: string | null) => {
  try {
    editorStore.hoverComponent(id);
  } catch (error) {
    console.error(`悬停组件失败: ${error}`);
  }
};

/**
 * 更新组件
 */
const handleUpdateComponent = (id: string, updates: Partial<ComponentData>) => {
  try {
    editorStore.updateComponent(id, updates);
  } catch (error) {
    console.error(`更新组件失败: ${error}`);
  }
};

/**
 * 更新组件属性
 */
const handleUpdateComponentProps = (id: string, props: Record<string, any>) => {
  try {
    editorStore.updateComponentProps(id, props);
  } catch (error) {
    console.error(`更新组件属性失败: ${error}`);
  }
};

/**
 * 更新组件样式
 */
const handleUpdateComponentStyle = (id: string, style: Partial<ComponentData['style']>) => {
  try {
    editorStore.updateComponentStyle(id, style);
  } catch (error) {
    console.error(`更新组件样式失败: ${error}`);
  }
};

/**
 * 删除组件
 */
const handleDeleteComponent = (id: string) => {
  try {
    editorStore.deleteComponent(id);
  } catch (error) {
    console.error(`删除组件失败: ${error}`);
  }
};

/**
 * 撤销操作
 */
const handleUndo = () => {
  try {
    editorStore.undo();
  } catch (error) {
    console.error(`撤销操作失败: ${error}`);
  }
};

/**
 * 重做操作
 */
const handleRedo = () => {
  try {
    editorStore.redo();
  } catch (error) {
    console.error(`重做操作失败: ${error}`);
  }
};

/**
 * 复制组件
 */
const handleCopy = () => {
  try {
    if (selectedId.value) {
      editorStore.copyComponent(selectedId.value);
      ElMessage.success('已复制到剪贴板');
    }
  } catch (error) {
    console.error(`复制组件失败: ${error}`);
  }
};

/**
 * 粘贴组件
 */
const handlePaste = () => {
  try {
    editorStore.pasteComponent();
  } catch (error) {
    console.error(`粘贴组件失败: ${error}`);
  }
};

/**
 * 删除选中组件
 */
const handleDelete = () => {
  try {
    if (selectedId.value) {
      editorStore.deleteComponent(selectedId.value);
    }
  } catch (error) {
    console.error(`删除选中组件失败: ${error}`);
  }
};

/**
 * 显示清空对话框
 */
const handleClear = () => {
  try {
    if (components.value.length > 0) {
      showClearDialog.value = true;
    } else {
      ElMessage.info('画布已经是空的了');
    }
  } catch (error) {
    console.error(`显示清空对话框失败: ${error}`);
  }
};

/**
 * 确认清空
 */
const confirmClear = () => {
  try {
    editorStore.clearCanvas();
    showClearDialog.value = false;
    ElMessage.success('画布已清空');
  } catch (error) {
    console.error(`确认清空失败: ${error}`);
  }
};

/**
 * 切换网格显示
 */
const toggleGrid = () => {
  try {
    editorStore.toggleGrid();
  } catch (error) {
    console.error(`切换网格显示失败: ${error}`);
  }
};

/**
 * 切换网格对齐
 */
const toggleSnapToGrid = () => {
  try {
    editorStore.toggleSnapToGrid();
  } catch (error) {
    console.error(`切换网格对齐失败: ${error}`);
  }
};

/**
 * 显示导入对话框
 */
const handleImport = () => {
  try {
    importValue.value = '';
    showImportDialog.value = true;
  } catch (error) {
    console.error(`显示导入对话框失败: ${error}`);
  }
};

/**
 * 确认导入
 */
const confirmImport = () => {
  try {
    if (!importValue.value.trim()) {
      ElMessage.warning('请输入有效的 JSON 数据');
      return;
    }
    
    try {
      // 尝试解析 JSON
      JSON.parse(importValue.value);
      
      // 导入到编辑器
      editorStore.importFromJSON(importValue.value);
      
      // 关闭对话框
      showImportDialog.value = false;
      
      // 触发导入事件
      emit('import', importValue.value);
      
      ElMessage.success('导入成功');
    } catch (e) {
      ElMessage.error('JSON 格式无效，请检查后重试');
    }
  } catch (error) {
    console.error(`确认导入失败: ${error}`);
  }
};

/**
 * 显示导出对话框
 */
const handleExport = () => {
  try {
    // 获取 JSON 字符串
    exportValue.value = editorStore.exportToJSON();
    
    // 触发导出事件
    emit('export', exportValue.value);
    
    // 显示对话框
    showExportDialog.value = true;
  } catch (error) {
    console.error(`显示导出对话框失败: ${error}`);
  }
};

/**
 * 复制导出值
 */
const copyExportValue = () => {
  try {
    navigator.clipboard.writeText(exportValue.value).then(() => {
      ElMessage.success('已复制到剪贴板');
    });
  } catch (error) {
    console.error(`复制导出值失败: ${error}`);
    // 降级处理：选择文本
    const textarea = document.querySelector('.export-textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.select();
      document.execCommand('copy');
      ElMessage.success('已复制到剪贴板');
    }
  }
};

/**
 * 处理缩放变化
 */
const handleZoomChange = (newZoom: number) => {
  try {
    editorStore.setZoom(newZoom);
  } catch (error) {
    console.error(`处理缩放变化失败: ${error}`);
  }
};
</script>

<style lang="scss" scoped>
.low-code-editor {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  
  .editor-header {
    padding: 8px 16px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    z-index: 10;
    
    .editor-title {
      margin-bottom: 8px;
      
      h1 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #303133;
      }
    }
    
    .editor-toolbar {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
    }
  }
  
  .editor-container {
    flex: 1;
    display: flex;
    overflow: hidden;
    
    .editor-sidebar {
      width: 280px;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      
      &.left {
        border-right: 1px solid #e4e7ed;
      }
      
      &.right {
        border-left: 1px solid #e4e7ed;
      }
    }
    
    .editor-content {
      flex: 1;
      height: 100%;
      overflow: auto;
      position: relative;
    }
  }
}

.ml-2 {
  margin-left: 8px;
}

.flex-spacer {
  flex: 1;
}

@media screen and (max-width: 1200px) {
  .editor-container {
    flex-direction: column;
    
    .editor-sidebar {
      width: 100%;
      height: auto;
      max-height: 200px;
      
      &.left {
        border-right: none;
        border-bottom: 1px solid #e4e7ed;
      }
      
      &.right {
        border-left: none;
        border-top: 1px solid #e4e7ed;
      }
    }
  }
}
</style> 