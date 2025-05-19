<template>
  <div class="component-renderer" @click.self="deselectComponent">
    <!-- 渲染区域 -->
    <div class="renderer-canvas" :style="canvasStyle">
      <!-- 组件为空时显示引导信息 -->
      <div
        v-if="!pageSchema.components || pageSchema.components.length === 0"
        class="empty-container flex flex-col items-center justify-center text-gray-400"
      >
        <el-icon class="text-4xl mb-4"><Plus /></el-icon>
        <p>从左侧拖拽组件到此处开始构建页面</p>
      </div>

      <!-- 递归渲染组件 -->
      <template v-else>
        <component-node
          v-for="component in pageSchema.components"
          :key="component.id"
          :component="component"
          :is-selected="isComponentSelected(component)"
          :parent-id="pageSchema.rootId"
          @select="selectComponent"
          @delete="handleDeleteComponent"
          @move="handleMoveComponent"
          @drop="handleDropComponent"
        />
      </template>
    </div>

    <!-- 操作工具栏 -->
    <div class="toolbar absolute top-4 right-4 bg-white shadow rounded p-2 flex space-x-2">
      <el-tooltip content="预览">
        <el-button size="small" circle icon="el-icon-view" @click="togglePreview" />
      </el-tooltip>
      <el-tooltip content="撤销">
        <el-button size="small" circle icon="el-icon-back" @click="undo" :disabled="!canUndo" />
      </el-tooltip>
      <el-tooltip content="重做">
        <el-button size="small" circle icon="el-icon-right" @click="redo" :disabled="!canRedo" />
      </el-tooltip>
      <el-tooltip content="清空">
        <el-button size="small" circle icon="el-icon-delete" @click="confirmClear" />
      </el-tooltip>
      <el-tooltip content="保存">
        <el-button size="small" circle icon="el-icon-download" @click="saveSchema" />
      </el-tooltip>
    </div>

    <!-- 键盘快捷键指南 -->
    <div class="shortcuts-info absolute left-4 bottom-4 text-xs text-gray-500">
      <p>删除: Delete | 复制: Ctrl+C | 粘贴: Ctrl+V | 撤销: Ctrl+Z | 重做: Ctrl+Y</p>
    </div>

    <!-- 组件拖拽时的辅助线 -->
    <div ref="hLine" class="h-alignment-line hidden"></div>
    <div ref="vLine" class="v-alignment-line hidden"></div>

    <!-- 预览模式弹窗 -->
    <el-dialog v-model="previewVisible" title="页面预览" width="80%" top="5vh" destroy-on-close>
      <div class="preview-container" style="min-height: 70vh">
        <component-preview :page-schema="pageSchema" />
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="exportJson">导出JSON</el-button>
      </template>
    </el-dialog>

    <!-- 清空确认对话框 -->
    <el-dialog v-model="clearConfirmVisible" title="确认清空" width="400px">
      <p>确定要清空当前页面的所有组件吗？此操作不可恢复。</p>
      <template #footer>
        <el-button @click="clearConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="clearCanvas">确认清空</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useEditorStore } from '../stores/editorStore'
import type { Component, PageSchema } from '../types'
import ComponentNode from './ComponentNode.vue'
import ComponentPreview from './ComponentPreview.vue'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'

/**
 * 组件属性定义
 */
const props = defineProps<{
  pageSchema: PageSchema
  selectedComponent: Component | null
}>()

/**
 * 事件定义
 */
const emit = defineEmits<{
  (e: 'component-selected', component: Component | null): void
  (e: 'component-moved', componentId: string, newParentId: string, newIndex: number): void
  (e: 'component-deleted', componentId: string): void
}>()

/**
 * 状态仓库
 */
const editorStore = useEditorStore()

/**
 * 预览模式
 */
const previewVisible = ref(false)

/**
 * 清空确认对话框
 */
const clearConfirmVisible = ref(false)

/**
 * 水平对齐线元素
 */
const hLine = ref<HTMLElement | null>(null)

/**
 * 垂直对齐线元素
 */
const vLine = ref<HTMLElement | null>(null)

/**
 * 画布样式
 */
const canvasStyle = reactive({
  minHeight: '100%',
  padding: '20px',
  position: 'relative',
})

/**
 * 撤销功能是否可用
 */
const canUndo = computed(() => {
  return editorStore.historyIndex >= 0
})

/**
 * 重做功能是否可用
 */
const canRedo = computed(() => {
  return editorStore.historyIndex < editorStore.operationHistory.length - 1
})

/**
 * 判断组件是否被选中
 */
function isComponentSelected(component: Component): boolean {
  try {
    return props.selectedComponent?.id === component.id
  } catch (error) {
    console.error('判断组件是否选中失败:', error)
    return false
  }
}

/**
 * 选择组件
 */
function selectComponent(component: Component) {
  try {
    emit('component-selected', component)
  } catch (error) {
    console.error('选择组件失败:', error)
  }
}

/**
 * 取消选择组件
 */
function deselectComponent() {
  try {
    emit('component-selected', null)
  } catch (error) {
    console.error('取消选择组件失败:', error)
  }
}

/**
 * 处理组件删除
 */
function handleDeleteComponent(componentId: string) {
  try {
    emit('component-deleted', componentId)
  } catch (error) {
    console.error('删除组件失败:', error)
  }
}

/**
 * 处理组件移动
 */
function handleMoveComponent(componentId: string, newParentId: string, newIndex: number) {
  try {
    emit('component-moved', componentId, newParentId, newIndex)
  } catch (error) {
    console.error('移动组件失败:', error)
  }
}

/**
 * 处理组件放置
 */
function handleDropComponent(dragComponent: Component, targetParentId: string, index: number) {
  try {
    // 获取正确的组件类型
    const component = editorStore.addComponent(dragComponent, targetParentId, index)

    // 选中新添加的组件
    if (component) {
      emit('component-selected', component)
    }
  } catch (error) {
    console.error('放置组件失败:', error)
    ElMessage.error('组件放置失败: ' + (error instanceof Error ? error.message : String(error)))
  }
}

/**
 * 显示预览
 */
function togglePreview() {
  try {
    previewVisible.value = !previewVisible.value
  } catch (error) {
    console.error('切换预览模式失败:', error)
  }
}

/**
 * 确认清空画布
 */
function confirmClear() {
  try {
    clearConfirmVisible.value = true
  } catch (error) {
    console.error('确认清空失败:', error)
  }
}

/**
 * 清空画布
 */
function clearCanvas() {
  try {
    editorStore.clearEditor()
    clearConfirmVisible.value = false
    emit('component-selected', null)
    ElMessage.success('已清空画布')
  } catch (error) {
    console.error('清空画布失败:', error)
  }
}

/**
 * 撤销操作
 */
function undo() {
  try {
    if (canUndo.value) {
      const result = editorStore.undo()
      if (result) {
        // 如果当前选中的组件被撤销操作影响，需要更新选中状态
        if (props.selectedComponent) {
          const component = editorStore.getComponentById(props.selectedComponent.id)
          emit('component-selected', component)
        }

        ElMessage.success('已撤销')
      }
    }
  } catch (error) {
    console.error('撤销失败:', error)
  }
}

/**
 * 重做操作
 */
function redo() {
  try {
    if (canRedo.value) {
      const result = editorStore.redo()
      if (result) {
        // 如果当前选中的组件被重做操作影响，需要更新选中状态
        if (props.selectedComponent) {
          const component = editorStore.getComponentById(props.selectedComponent.id)
          emit('component-selected', component)
        }

        ElMessage.success('已重做')
      }
    }
  } catch (error) {
    console.error('重做失败:', error)
  }
}

/**
 * 保存Schema
 */
function saveSchema() {
  try {
    const schema = editorStore.exportSchema()
    const schemaStr = JSON.stringify(schema, null, 2)

    // 创建临时链接下载文件
    const blob = new Blob([schemaStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `page-schema-${new Date().getTime()}.json`
    document.body.appendChild(link)
    link.click()

    // 清理
    URL.revokeObjectURL(url)
    document.body.removeChild(link)

    ElMessage.success('已保存Schema')
  } catch (error) {
    console.error('保存Schema失败:', error)
    ElMessage.error('保存失败')
  }
}

/**
 * 导出JSON
 */
function exportJson() {
  try {
    saveSchema()
    previewVisible.value = false
  } catch (error) {
    console.error('导出JSON失败:', error)
  }
}

/**
 * 注册键盘快捷键
 */
const { setupKeyboardShortcuts, cleanupKeyboardShortcuts } = useKeyboardShortcuts({
  onDelete: () => {
    if (props.selectedComponent) {
      handleDeleteComponent(props.selectedComponent.id)
    }
  },
  onUndo: undo,
  onRedo: redo,
})

/**
 * 组件挂载时初始化
 */
onMounted(() => {
  try {
    setupKeyboardShortcuts()
  } catch (error) {
    console.error('组件挂载初始化失败:', error)
  }
})

/**
 * 组件卸载时清理
 */
onUnmounted(() => {
  try {
    cleanupKeyboardShortcuts()
  } catch (error) {
    console.error('组件卸载清理失败:', error)
  }
})
</script>

<style scoped>
.component-renderer {
  height: 100%;
  position: relative;
  overflow: auto;
}

.renderer-canvas {
  min-height: 100%;
  min-width: 100%;
  position: relative;
  background-color: #f5f7fa;
  background-image:
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%),
    linear-gradient(45deg, #e5e7eb 25%, transparent 25%, transparent 75%, #e5e7eb 75%);
  background-size: 20px 20px;
  background-position:
    0 0,
    10px 10px;
}

.empty-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.h-alignment-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #409eff;
  z-index: 1000;
  pointer-events: none;
}

.v-alignment-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #409eff;
  z-index: 1000;
  pointer-events: none;
}

.toolbar {
  z-index: 100;
}
</style>
