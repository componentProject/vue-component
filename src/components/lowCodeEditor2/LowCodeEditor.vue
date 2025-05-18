<template>
  <div class="low-code-editor" ref="editorRef">
    <!-- 顶部操作栏 -->
    <div class="editor-header bg-white border-b border-gray-200 shadow-sm">
      <div class="container mx-auto px-4 py-2 flex items-center justify-between">
        <div class="header-left flex items-center">
          <h2 class="text-lg font-medium">低代码编辑器</h2>
        </div>

        <div class="header-center flex items-center space-x-4">
          <!-- 操作按钮组 -->
          <el-button-group>
            <el-tooltip content="撤销" placement="bottom">
              <el-button :disabled="!canUndo" @click="undo">
                <el-icon><Back /></el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="重做" placement="bottom">
              <el-button :disabled="!canRedo" @click="redo">
                <el-icon><Right /></el-icon>
              </el-button>
            </el-tooltip>

            <el-tooltip content="清空画布" placement="bottom">
              <el-button @click="clearCanvas">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </el-button-group>

          <!-- 缩放控制 -->
          <div class="scale-control flex items-center space-x-2">
            <el-tooltip content="缩小" placement="bottom">
              <el-button @click="zoomOut">
                <el-icon><ZoomOut /></el-icon>
              </el-button>
            </el-tooltip>

            <el-dropdown @command="handleZoomCommand">
              <span class="scale-value cursor-pointer">{{ Math.round(canvasScale * 100) }}%</span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="0.5">50%</el-dropdown-item>
                  <el-dropdown-item command="0.75">75%</el-dropdown-item>
                  <el-dropdown-item command="1">100%</el-dropdown-item>
                  <el-dropdown-item command="1.25">125%</el-dropdown-item>
                  <el-dropdown-item command="1.5">150%</el-dropdown-item>
                  <el-dropdown-item command="2">200%</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <el-tooltip content="放大" placement="bottom">
              <el-button @click="zoomIn">
                <el-icon><ZoomIn /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>

        <div class="header-right flex items-center space-x-2">
          <!-- 预览按钮 -->
          <el-tooltip :content="editorMode === 'edit' ? '预览' : '编辑'" placement="bottom">
            <el-button @click="toggleEditorMode">
              <el-icon>
                <component :is="editorMode === 'edit' ? 'View' : 'Edit'" />
              </el-icon>
              {{ editorMode === 'edit' ? '预览' : '编辑' }}
            </el-button>
          </el-tooltip>

          <!-- 导入/导出按钮 -->
          <el-dropdown @command="handleImportExportCommand">
            <el-button>
              <span>导入/导出</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="import">导入JSON</el-dropdown-item>
                <el-dropdown-item command="export">导出JSON</el-dropdown-item>
                <el-dropdown-item command="preview">查看JSON</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 主编辑区域 -->
    <div class="editor-main flex-1 flex overflow-hidden">
      <!-- 左侧组件面板 -->
      <div
        class="editor-sidebar w-64 bg-white border-r border-gray-200"
        v-show="editorMode === 'edit'"
      >
        <component-panel :draggable="true" @component-drag-start="handleComponentDragStart" />
      </div>

      <!-- 中间画布区域 -->
      <div class="editor-center flex-1 bg-gray-100 overflow-auto p-4" ref="canvasContainerRef">
        <div
          class="canvas-wrapper flex justify-center items-start min-h-full"
          :class="{ 'preview-mode': editorMode === 'preview' }"
        >
          <div class="canvas-wrapper-inner w-full">
            <canvas-editor
              :components="canvasComponents"
              :component-definitions="componentDefinitions"
              :selected-component-ids="selectedComponentIds"
              :canvas-width="canvasWidth"
              :canvas-height="canvasHeight"
              :scale="canvasScale"
              :show-grid="showGrid"
              :snap-to-grid="snapToGrid"
              :grid-size="gridSize"
              :canvas-background="canvasBackground"
              :mode="editorMode"
              @add-component="handleAddComponent"
              @select-component="handleSelectComponent"
              @update:props="handleUpdateComponentProps"
              @update:style="handleUpdateComponentStyle"
              @delete-component="handleDeleteComponent"
            />
          </div>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div
        class="editor-sidebar w-80 bg-white border-l border-gray-200"
        v-show="editorMode === 'edit'"
      >
        <property-panel
          :component="selectedComponent"
          :component-definition="selectedComponentDefinition"
          @update:props="handleUpdateComponentProps"
          @update:style="handleUpdateComponentStyle"
          @update:dataSource="handleUpdateComponentDataSource"
        />
      </div>
    </div>

    <!-- 导入/导出对话框 -->
    <el-dialog
      v-model="showJsonDialog"
      :title="`${jsonDialogMode === 'import' ? '导入' : jsonDialogMode === 'export' ? '导出' : '查看'} JSON`"
      width="80%"
      destroy-on-close
    >
      <div class="json-dialog-content">
        <el-input
          v-model="jsonContent"
          type="textarea"
          :rows="20"
          :readonly="jsonDialogMode !== 'import'"
          :placeholder="jsonDialogMode === 'import' ? '请输入JSON配置' : ''"
          class="w-full font-mono text-sm"
        />

        <div v-if="jsonDialogMode === 'import' && jsonError" class="text-red-500 mt-2">
          {{ jsonError }}
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showJsonDialog = false">取消</el-button>

          <template v-if="jsonDialogMode === 'export'">
            <el-button type="primary" @click="copyJsonToClipboard">复制</el-button>
            <el-button type="primary" @click="downloadJsonFile">下载</el-button>
          </template>

          <template v-if="jsonDialogMode === 'import'">
            <el-button type="primary" @click="importJson">导入</el-button>
          </template>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import {
  Back,
  Right,
  Delete,
  ZoomIn,
  ZoomOut,
  View,
  Edit,
  ArrowDown,
} from '@element-plus/icons-vue'
import { useEditorStore } from './store/editorStore'
import type { ComponentDefinition, CanvasComponent, PageSchema } from './types'
import ComponentPanel from './components/ComponentPanel/index.vue'
import CanvasEditor from './components/Canvas/index.vue'
import PropertyPanel from './components/PropertyPanel/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import copy from 'copy-to-clipboard'

/**
 * 组件属性
 */
const props = defineProps<{
  // 初始canvas宽度
  initialWidth?: number
  // 初始canvas高度
  initialHeight?: number
  // 初始配置
  initialSchema?: PageSchema
}>()

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 变更事件
  (e: 'change', schema: PageSchema): void
}>()

/**
 * 编辑器DOM引用
 */
const editorRef = ref<HTMLElement | null>(null)

/**
 * 画布容器DOM引用
 */
const canvasContainerRef = ref<HTMLElement | null>(null)

/**
 * 保存前一个网格状态（用于预览模式切换）
 */
const previousGridState = ref<{ showGrid: boolean; snapToGrid: boolean } | null>(null)

/**
 * 编辑器store实例
 */
const editorStore = useEditorStore()

/**
 * 编辑器状态
 */
const editorMode = computed(() => editorStore.state.mode)

/**
 * 组件定义列表
 */
const componentDefinitions = computed(() => editorStore.state.componentDefinitions)

/**
 * 画布组件列表
 */
const canvasComponents = computed(() => editorStore.state.canvasComponents)

/**
 * 选中的组件ID列表
 */
const selectedComponentIds = computed(() => editorStore.state.selectedComponentIds)

/**
 * 选中的第一个组件
 */
const selectedComponent = computed(() => editorStore.selectedComponent)

/**
 * 选中组件的定义
 */
const selectedComponentDefinition = computed(() => editorStore.selectedComponentDefinition)

/**
 * 画布宽度
 */
const canvasWidth = computed(() => editorStore.state.canvas.width)

/**
 * 画布高度
 */
const canvasHeight = computed(() => editorStore.state.canvas.height)

/**
 * 画布缩放比例
 */
const canvasScale = computed(() => editorStore.state.canvas.scale)

/**
 * 是否显示网格
 */
const showGrid = computed(() => editorStore.state.canvas.showGrid)

/**
 * 是否吸附到网格
 */
const snapToGrid = computed(() => editorStore.state.canvas.snapToGrid)

/**
 * 网格大小
 */
const gridSize = computed(() => editorStore.state.canvas.gridSize)

/**
 * 画布背景
 */
const canvasBackground = computed(() => editorStore.state.canvas.background)

/**
 * 是否可以撤销
 */
const canUndo = computed(() => editorStore.state.history.past.length > 0)

/**
 * 是否可以重做
 */
const canRedo = computed(() => editorStore.state.history.future.length > 0)

/**
 * JSON对话框相关状态
 */
const showJsonDialog = ref(false)
const jsonDialogMode = ref<'import' | 'export' | 'preview'>('export')
const jsonContent = ref('')
const jsonError = ref('')

/**
 * 通知编辑器状态变化
 */
const notifyChange = () => {
  try {
    const schema = editorStore.exportSchema()
    emit('change', schema)
  } catch (error) {
    console.error('通知编辑器状态变化失败:', error)
  }
}

/**
 * 处理组件拖动开始
 */
const handleComponentDragStart = (component: ComponentDefinition) => {
  try {
    // 可以在此添加拖动开始逻辑
    console.log('组件拖动开始:', component.name)
  } catch (error) {
    console.error('处理组件拖动开始失败:', error)
  }
}

/**
 * 处理添加组件
 */
const handleAddComponent = (
  componentId: string,
  position: { left: number; top: number },
  parentId?: string,
) => {
  try {
    editorStore.addCanvasComponent(componentId, position, parentId)
    notifyChange()
  } catch (error) {
    console.error('处理添加组件失败:', error)
  }
}

/**
 * 处理选择组件
 */
const handleSelectComponent = (componentId: string | null, isMultiSelect: boolean) => {
  try {
    editorStore.selectComponent(componentId, isMultiSelect)
  } catch (error) {
    console.error('处理选择组件失败:', error)
  }
}

/**
 * 处理更新组件属性
 */
const handleUpdateComponentProps = (componentId: string, props: Record<string, any>) => {
  try {
    editorStore.updateComponentProps(componentId, props)
    notifyChange()
  } catch (error) {
    console.error('处理更新组件属性失败:', error)
  }
}

/**
 * 处理更新组件样式
 */
const handleUpdateComponentStyle = (
  componentId: string,
  style: Partial<CanvasComponent['style']>,
) => {
  try {
    editorStore.updateComponentStyle(componentId, style)
    notifyChange()
  } catch (error) {
    console.error('处理更新组件样式失败:', error)
  }
}

/**
 * 处理更新组件数据源
 */
const handleUpdateComponentDataSource = (componentId: string, dataSource: any) => {
  try {
    editorStore.updateComponentDataSource(componentId, dataSource)
    notifyChange()
  } catch (error) {
    console.error('处理更新组件数据源失败:', error)
  }
}

/**
 * 处理删除组件
 */
const handleDeleteComponent = (componentId: string) => {
  try {
    editorStore.deleteComponent(componentId)
    notifyChange()
  } catch (error) {
    console.error('处理删除组件失败:', error)
  }
}

/**
 * 撤销操作
 */
const undo = () => {
  try {
    editorStore.undo()
    notifyChange()
  } catch (error) {
    console.error('撤销操作失败:', error)
  }
}

/**
 * 重做操作
 */
const redo = () => {
  try {
    editorStore.redo()
    notifyChange()
  } catch (error) {
    console.error('重做操作失败:', error)
  }
}

/**
 * 清空画布
 */
const clearCanvas = async () => {
  try {
    // 确认对话框
    await ElMessageBox.confirm('确定要清空画布吗？此操作不可恢复。', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    editorStore.clearCanvas()
    notifyChange()
  } catch (error) {
    // 用户取消操作或其他错误
    if (error !== 'cancel') {
      console.error('清空画布失败:', error)
    }
  }
}

/**
 * 切换编辑器模式
 */
const toggleEditorMode = () => {
  try {
    const newMode = editorMode.value === 'edit' ? 'preview' : 'edit'
    editorStore.setEditorMode(newMode)

    // 在预览模式下隐藏网格
    if (newMode === 'preview') {
      // 保存当前网格状态
      previousGridState.value = {
        showGrid: editorStore.state.canvas.showGrid,
        snapToGrid: editorStore.state.canvas.snapToGrid,
      }

      // 关闭网格显示
      editorStore.setCanvasConfig({
        showGrid: false,
      })
    } else {
      // 恢复之前的网格状态
      if (previousGridState.value) {
        editorStore.setCanvasConfig({
          showGrid: previousGridState.value.showGrid,
          snapToGrid: previousGridState.value.snapToGrid,
        })
      }
    }
  } catch (error) {
    console.error('切换编辑器模式失败:', error)
  }
}

/**
 * 处理缩放命令
 */
const handleZoomCommand = (command: string) => {
  try {
    setCanvasScale(parseFloat(command))
  } catch (error) {
    console.error('处理缩放命令失败:', error)
  }
}

/**
 * 缩小画布
 */
const zoomOut = () => {
  try {
    const newScale = Math.max(0.1, canvasScale.value - 0.1)
    setCanvasScale(newScale)
  } catch (error) {
    console.error('缩小画布失败:', error)
  }
}

/**
 * 放大画布
 */
const zoomIn = () => {
  try {
    const newScale = Math.min(3, canvasScale.value + 0.1)
    setCanvasScale(newScale)
  } catch (error) {
    console.error('放大画布失败:', error)
  }
}

/**
 * 设置画布缩放比例
 */
const setCanvasScale = (scale: number) => {
  try {
    editorStore.setCanvasConfig({ scale })
  } catch (error) {
    console.error('设置画布缩放比例失败:', error)
  }
}

/**
 * 处理导入/导出命令
 */
const handleImportExportCommand = (command: 'import' | 'export' | 'preview') => {
  try {
    jsonDialogMode.value = command
    jsonError.value = ''

    if (command === 'export' || command === 'preview') {
      // 导出或预览JSON
      const schema = editorStore.exportSchema()
      jsonContent.value = JSON.stringify(schema, null, 2)
    } else {
      // 导入JSON
      jsonContent.value = ''
    }

    showJsonDialog.value = true
  } catch (error) {
    console.error('处理导入/导出命令失败:', error)
  }
}

/**
 * 复制JSON到剪贴板
 */
const copyJsonToClipboard = () => {
  try {
    copy(jsonContent.value)
    ElMessage.success('JSON已复制到剪贴板')
  } catch (error) {
    console.error('复制JSON到剪贴板失败:', error)
    ElMessage.error('复制失败')
  }
}

/**
 * 下载JSON文件
 */
const downloadJsonFile = () => {
  try {
    const blob = new Blob([jsonContent.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lowcode-${new Date().getTime()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('下载JSON文件失败:', error)
    ElMessage.error('下载失败')
  }
}

/**
 * 导入JSON
 */
const importJson = () => {
  try {
    if (!jsonContent.value.trim()) {
      jsonError.value = '请输入有效的JSON配置'
      return
    }

    try {
      const schema = JSON.parse(jsonContent.value)

      // 验证基本结构
      if (!schema.components || !Array.isArray(schema.components)) {
        jsonError.value = 'JSON格式无效: 缺少components数组'
        return
      }

      if (!schema.canvas || typeof schema.canvas !== 'object') {
        jsonError.value = 'JSON格式无效: 缺少canvas配置'
        return
      }

      editorStore.importSchema(schema)
      notifyChange()
      showJsonDialog.value = false
      ElMessage.success('导入成功')
    } catch (e) {
      jsonError.value = `JSON解析失败: ${(e as Error).message}`
    }
  } catch (error) {
    console.error('导入JSON失败:', error)
    ElMessage.error('导入失败')
  }
}

/**
 * 初始化编辑器
 */
const initEditor = () => {
  try {
    // 设置初始画布大小
    if (props.initialWidth || props.initialHeight) {
      editorStore.setCanvasConfig({
        width: props.initialWidth || 1200,
        height: props.initialHeight || 800,
      })
    }

    // 导入初始配置
    if (props.initialSchema) {
      editorStore.importSchema(props.initialSchema)
    }
  } catch (error) {
    console.error('初始化编辑器失败:', error)
  }
}

/**
 * 快捷键处理函数
 */
const handleKeyDown = (e: KeyboardEvent) => {
  try {
    // 忽略输入框内的快捷键
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }

    // Ctrl+Z: 撤销
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault()
      undo()
    }

    // Ctrl+Y 或 Ctrl+Shift+Z: 重做
    if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
      e.preventDefault()
      redo()
    }

    // Delete 或 Backspace: 删除选中组件
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentIds.value.length > 0) {
      e.preventDefault()
      selectedComponentIds.value.forEach((id) => {
        editorStore.deleteComponent(id)
      })
      notifyChange()
    }

    // Escape: 取消选择
    if (e.key === 'Escape') {
      e.preventDefault()
      editorStore.selectComponent(null)
    }
  } catch (error) {
    console.error('处理快捷键失败:', error)
  }
}

// 监听变化
watch(
  () => canvasComponents.value,
  () => {
    notifyChange()
  },
  { deep: true },
)

// 组件挂载
onMounted(() => {
  try {
    initEditor()
    document.addEventListener('keydown', handleKeyDown)
  } catch (error) {
    console.error('组件挂载失败:', error)
  }
})

// 组件卸载
onUnmounted(() => {
  try {
    document.removeEventListener('keydown', handleKeyDown)
  } catch (error) {
    console.error('组件卸载失败:', error)
  }
})
</script>

<style lang="scss" scoped>
.low-code-editor {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.editor-main {
  flex: 1;
  overflow: hidden;
}

.editor-sidebar {
  overflow: auto;
}

.editor-center {
  position: relative;
}

.canvas-wrapper {
  min-height: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  box-sizing: border-box;

  &.preview-mode {
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5;
    transition: all 0.3s ease;

    .canvas-wrapper-inner {
      box-shadow: 0 8px 20px rgb(0 0 0 / 15%);
      transition: all 0.3s ease;
    }
  }
}

.canvas-wrapper-inner {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.scale-value {
  display: inline-block;
  min-width: 60px;
  text-align: center;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
}
</style>
