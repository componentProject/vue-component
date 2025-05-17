<template>
  <div
    ref="canvasRef"
    class="editor-canvas"
    :style="canvasStyle"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="handleCanvasClick"
  >
    <!-- 网格背景 -->
    <div v-if="showGrid" class="canvas-grid" :style="gridStyle"></div>

    <!-- 对齐线 -->
    <div
      v-if="alignmentLines.horizontal !== null"
      class="alignment-line horizontal"
      :style="{ top: `${alignmentLines.horizontal}px` }"
    ></div>
    <div
      v-if="alignmentLines.vertical !== null"
      class="alignment-line vertical"
      :style="{ left: `${alignmentLines.vertical}px` }"
    ></div>

    <!-- 组件列表 -->
    <template v-for="component in components" :key="component.id">
      <CanvasComponent
        :component="component"
        :selected="component.id === selectedId"
        :hovered="component.id === hoveredId"
        :scale="zoom"
        :grid-size="gridSize"
        :snap-to-grid="snapToGrid"
        :show-grid="showGrid"
        :other-components="otherComponents(component.id)"
        @select="selectComponent"
        @hover="hoverComponent"
        @update="updateComponent"
        @delete="deleteComponent"
      />
    </template>

    <!-- 空状态提示 -->
    <div v-if="components.length === 0" class="canvas-empty">
      <el-icon class="canvas-empty-icon"><Plus /></el-icon>
      <p class="canvas-empty-text">从左侧拖拽组件到此处</p>
    </div>

    <!-- 缩放控制 -->
    <div class="zoom-controls">
      <el-button size="small" circle @click="zoomOut" :disabled="zoom <= 0.2">
        <el-icon><Minus /></el-icon>
      </el-button>
      <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
      <el-button size="small" circle @click="zoomIn" :disabled="zoom >= 2">
        <el-icon><Plus /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
/**
 * 画布组件
 * 作为组件拖放的目标区域
 */
import { ref, computed, nextTick } from 'vue';
import { ElButton, ElIcon } from 'element-plus';
import { Plus, Minus } from '@element-plus/icons-vue';
import { parseDragData } from '../../utils/dragUtils';
import type { ComponentData } from '../../types';
import CanvasComponent from './CanvasComponent.vue';

interface Props {
  /**
   * 画布尺寸
   */
  width?: number;
  height?: number;
  /**
   * 组件列表
   */
  components: ComponentData[];
  /**
   * 选中组件 ID
   */
  selectedId: string | null;
  /**
   * 悬停组件 ID
   */
  hoveredId: string | null;
  /**
   * 是否显示网格
   */
  showGrid?: boolean;
  /**
   * 是否对齐网格
   */
  snapToGrid?: boolean;
  /**
   * 网格大小
   */
  gridSize?: number;
  /**
   * 缩放比例
   */
  zoom?: number;
  /**
   * 对齐线
   */
  alignmentLines?: {
    horizontal: number | null;
    vertical: number | null;
  };
}

const props = withDefaults(defineProps<Props>(), {
  width: 1200,
  height: 800,
  showGrid: true,
  snapToGrid: true,
  gridSize: 10,
  zoom: 1,
  alignmentLines: () => ({ horizontal: null, vertical: null }),
});

/**
 * 事件
 */
const emit = defineEmits<{
  /**
   * 添加组件
   */
  (e: 'add', type: string, position: { x: number; y: number }): void;
  /**
   * 选择组件
   */
  (e: 'select', id: string | null): void;
  /**
   * 悬停组件
   */
  (e: 'hover', id: string | null): void;
  /**
   * 更新组件
   */
  (e: 'update', id: string, updates: Partial<ComponentData>): void;
  /**
   * 删除组件
   */
  (e: 'delete', id: string): void;
  /**
   * 缩放变化
   */
  (e: 'zoom-change', zoom: number): void;
}>();

/**
 * 画布引用
 */
const canvasRef = ref<HTMLDivElement | null>(null);

/**
 * 画布样式
 */
const canvasStyle = computed(() => {
  return {
    width: `${props.width}px`,
    height: `${props.height}px`,
    transform: `scale(${props.zoom})`,
    transformOrigin: '0 0',
  };
});

/**
 * 网格样式
 */
const gridStyle = computed(() => {
  return {
    backgroundSize: `${props.gridSize}px ${props.gridSize}px`,
    backgroundImage:
      'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
  };
});

/**
 * 获取除自身外的其他组件
 */
const otherComponents = (id: string) => {
  try {
    return props.components.filter((comp) => comp.id !== id);
  } catch (error) {
    console.error(`获取其他组件失败: ${error}`);
    return [];
  }
};

/**
 * 处理拖拽经过
 */
const handleDragOver = (event: DragEvent) => {
  try {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  } catch (error) {
    console.error(`拖拽经过处理失败: ${error}`);
  }
};

/**
 * 处理放置
 */
const handleDrop = (event: DragEvent) => {
  try {
    event.preventDefault();
    
    if (!event.dataTransfer) return;
    
    const data = event.dataTransfer.getData('text/plain');
    const dragData = parseDragData(data);
    
    if (!dragData) return;
    
    // 获取画布相对位置
    const canvasRect = canvasRef.value?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // 计算放置位置
    let x = (event.clientX - canvasRect.left) / props.zoom;
    let y = (event.clientY - canvasRect.top) / props.zoom;
    
    // 对齐网格
    if (props.snapToGrid) {
      x = Math.round(x / props.gridSize) * props.gridSize;
      y = Math.round(y / props.gridSize) * props.gridSize;
    }
    
    // 添加组件
    emit('add', dragData.type, { x, y });
  } catch (error) {
    console.error(`拖拽放置处理失败: ${error}`);
  }
};

/**
 * 处理画布点击
 */
const handleCanvasClick = (event: MouseEvent) => {
  try {
    // 仅当点击画布背景时才取消选择
    if (event.target === canvasRef.value) {
      emit('select', null);
    }
  } catch (error) {
    console.error(`画布点击处理失败: ${error}`);
  }
};

/**
 * 选择组件
 */
const selectComponent = (id: string) => {
  try {
    emit('select', id);
  } catch (error) {
    console.error(`选择组件失败: ${error}`);
  }
};

/**
 * 悬停组件
 */
const hoverComponent = (id: string | null) => {
  try {
    emit('hover', id);
  } catch (error) {
    console.error(`悬停组件失败: ${error}`);
  }
};

/**
 * 更新组件
 */
const updateComponent = (id: string, updates: Partial<ComponentData>) => {
  try {
    emit('update', id, updates);
  } catch (error) {
    console.error(`更新组件失败: ${error}`);
  }
};

/**
 * 删除组件
 */
const deleteComponent = (id: string) => {
  try {
    emit('delete', id);
  } catch (error) {
    console.error(`删除组件失败: ${error}`);
  }
};

/**
 * 放大
 */
const zoomIn = () => {
  try {
    const newZoom = Math.min(props.zoom + 0.1, 2);
    emit('zoom-change', newZoom);
  } catch (error) {
    console.error(`放大失败: ${error}`);
  }
};

/**
 * 缩小
 */
const zoomOut = () => {
  try {
    const newZoom = Math.max(props.zoom - 0.1, 0.2);
    emit('zoom-change', newZoom);
  } catch (error) {
    console.error(`缩小失败: ${error}`);
  }
};
</script>

<style lang="scss" scoped>
.editor-canvas {
  position: relative;
  margin: 20px auto;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &:focus {
    outline: none;
  }
}

.canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.alignment-line {
  position: absolute;
  background-color: #409eff;
  z-index: 9999;
  pointer-events: none;
  
  &.horizontal {
    height: 1px;
    width: 100%;
  }
  
  &.vertical {
    width: 1px;
    height: 100%;
  }
}

.canvas-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  
  &-icon {
    font-size: 32px;
    margin-bottom: 8px;
    color: #c0c4cc;
  }
  
  &-text {
    font-size: 14px;
    margin: 0;
  }
}

.zoom-controls {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  .zoom-value {
    margin: 0 8px;
    min-width: 40px;
    text-align: center;
    user-select: none;
    font-size: 12px;
  }
}
</style> 