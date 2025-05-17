<template>
  <div
    class="canvas-editor"
    :class="{ 'canvas-editor-preview': mode === 'preview' }"
    ref="canvasRef"
    @dragover="handleDragOver"
    @drop="handleDrop"
    @click="handleCanvasClick"
  >
    <!-- 画布背景网格 -->
    <div
      class="canvas-grid"
      :class="{ 'grid-visible': showGrid }"
      :style="{
        width: `${canvasWidth}px`,
        height: `${canvasHeight}px`,
        transform: `scale(${scale})`,
        backgroundColor: canvasBackground,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }"
    >
      <!-- 画布上的组件 -->
      <template v-for="component in components" :key="component.id">
        <canvas-component
          :component="component"
          :component-definition="getComponentDefinition(component.componentId)"
          :is-selected="isComponentSelected(component.id)"
          :mode="mode"
          :scale="scale"
          :snap-to-grid="snapToGrid"
          :grid-size="gridSize"
          @select="handleSelectComponent"
          @update:props="(props) => $emit('update:props', component.id, props)"
          @update:style="(style) => $emit('update:style', component.id, style)"
          @delete="() => $emit('delete-component', component.id)"
        />
      </template>

      <!-- 对齐辅助线 -->
      <template v-if="mode === 'edit' && alignmentGuides.length > 0">
        <div
          v-for="(guide, index) in alignmentGuides"
          :key="`guide-${index}`"
          class="alignment-guide"
          :class="{ 'horizontal': guide.type === 'horizontal', 'vertical': guide.type === 'vertical' }"
          :style="getGuideStyle(guide)"
        ></div>
      </template>

      <!-- 可放置区域指示器 -->
      <div
        v-if="isDraggingOver && validDropTarget"
        class="drop-indicator"
        :style="getDropIndicatorStyle()"
      ></div>
    </div>

    <!-- 画布控制器（在预览模式下隐藏） -->
    <div class="canvas-controls" v-if="mode === 'edit'">
      <el-button-group>
        <el-tooltip content="显示网格" placement="top">
          <el-button type="primary" size="small" :icon="Grid" plain :class="{ active: showGrid }" @click="toggleGrid"></el-button>
        </el-tooltip>

        <el-tooltip content="吸附到网格" placement="top">
          <el-button type="primary" size="small" :icon="Magnet" plain :class="{ active: snapToGrid }" @click="toggleSnapToGrid"></el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Grid, Magnet } from '@element-plus/icons-vue';
import { useEditorStore } from '../../store/editorStore';
import { calculateAlignmentGuides, findContainerAtPosition, canDropIntoContainer } from '../../utils/dragUtils';
import type { CanvasComponent as CanvasComponentType, ComponentDefinition, AlignmentGuide } from '../../types';
import CanvasComponent from './CanvasComponent.vue';

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 画布上的组件数据
   */
  components: CanvasComponentType[];

  /**
   * 组件定义列表
   */
  componentDefinitions: ComponentDefinition[];

  /**
   * 选中的组件ID列表
   */
  selectedComponentIds: string[];

  /**
   * 画布宽度
   */
  canvasWidth: number;

  /**
   * 画布高度
   */
  canvasHeight: number;

  /**
   * 缩放比例
   */
  scale: number;

  /**
   * 是否显示网格
   */
  showGrid: boolean;

  /**
   * 是否吸附到网格
   */
  snapToGrid: boolean;

  /**
   * 网格大小
   */
  gridSize: number;

  /**
   * 画布背景颜色
   */
  canvasBackground: string;

  /**
   * 编辑器模式
   */
  mode: 'edit' | 'preview';
}>();

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 添加组件
  (e: 'add-component', componentId: string, position: { left: number; top: number }, parentId?: string): void;
  // 选择组件
  (e: 'select-component', componentId: string | null, isMultiSelect: boolean): void;
  // 更新组件属性
  (e: 'update:props', componentId: string, props: Record<string, any>): void;
  // 更新组件样式
  (e: 'update:style', componentId: string, style: Partial<CanvasComponentType['style']>): void;
  // 删除组件
  (e: 'delete-component', componentId: string): void;
}>();

/**
 * 画布DOM引用
 */
const canvasRef = ref<HTMLElement | null>(null);

/**
 * 编辑器store实例
 */
const editorStore = useEditorStore();

/**
 * 拖动相关状态
 */
const isDraggingOver = ref(false);
const dragComponentId = ref<string | null>(null);
const dropTargetId = ref<string | null>(null);
const validDropTarget = ref(false);

/**
 * 对齐辅助线列表
 */
const alignmentGuides = ref<AlignmentGuide[]>([]);

/**
 * 组件定义映射
 */
const componentDefinitionsMap = computed(() => {
  try {
    return props.componentDefinitions.reduce((map, def) => {
      map[def.id] = def;
      return map;
    }, {} as Record<string, ComponentDefinition>);
  } catch (error) {
    console.error('计算组件定义映射失败:', error);
    return {};
  }
});

/**
 * 获取组件定义
 */
const getComponentDefinition = (id: string): ComponentDefinition | undefined => {
  try {
    return componentDefinitionsMap.value[id];
  } catch (error) {
    console.error('获取组件定义失败:', error);
    return undefined;
  }
};

/**
 * 检查组件是否被选中
 */
const isComponentSelected = (id: string): boolean => {
  try {
    return props.selectedComponentIds.includes(id);
  } catch (error) {
    console.error('检查组件是否被选中失败:', error);
    return false;
  }
};

/**
 * 处理画布点击
 */
const handleCanvasClick = (e: MouseEvent) => {
  try {
    // 如果点击的是画布本身（而不是组件），则清除选择
    if (e.target === canvasRef.value || e.target === canvasRef.value?.firstElementChild) {
      emit('select-component', null, false);
    }
  } catch (error) {
    console.error('处理画布点击失败:', error);
  }
};

/**
 * 处理选择组件
 */
const handleSelectComponent = (componentId: string, isMultiSelect: boolean) => {
  try {
    emit('select-component', componentId, isMultiSelect);
  } catch (error) {
    console.error('处理选择组件失败:', error);
  }
};

/**
 * 处理拖拽经过
 */
const handleDragOver = (e: DragEvent) => {
  try {
    if (props.mode === 'preview') return;

    e.preventDefault();
    e.stopPropagation();

    // 设置放置效果
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }

    isDraggingOver.value = true;

    // 获取拖拽位置相对于画布的坐标
    if (canvasRef.value && e.dataTransfer) {
      const rect = canvasRef.value.getBoundingClientRect();
      const x = (e.clientX - rect.left) / props.scale;
      const y = (e.clientY - rect.top) / props.scale;

      // 查找可能的容器组件
      const containerComponent = findContainerAtPosition(
        { x, y },
        props.components,
        componentDefinitionsMap.value,
        dragComponentId.value || undefined
      );

      if (containerComponent) {
        dropTargetId.value = containerComponent.id;

        // 检查是否可以放入该容器
        if (dragComponentId.value) {
          const draggedComponent = getComponentDefinition(dragComponentId.value);
          if (draggedComponent) {
            validDropTarget.value = canDropIntoContainer(
              draggedComponent.type,
              containerComponent,
              componentDefinitionsMap.value
            );
          }
        }
      } else {
        dropTargetId.value = null;
        validDropTarget.value = true; // 可以放到画布上
      }
    }
  } catch (error) {
    console.error('处理拖拽经过失败:', error);
  }
};

/**
 * 处理拖拽放置
 */
const handleDrop = (e: DragEvent) => {
  try {
    if (props.mode === 'preview') return;

    e.preventDefault();
    e.stopPropagation();

    isDraggingOver.value = false;

    // 解析拖拽数据
    if (e.dataTransfer && canvasRef.value) {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;

      try {
        const dropData = JSON.parse(data);
        if (dropData.type === 'component' && dropData.componentId) {
          // 获取放置位置相对于画布的坐标
          const rect = canvasRef.value.getBoundingClientRect();
          let left = (e.clientX - rect.left) / props.scale;
          let top = (e.clientY - rect.top) / props.scale;

          // 获取组件定义以获取初始尺寸
          const componentDef = getComponentDefinition(dropData.componentId);
          if (componentDef && componentDef.initialSize) {
            // 将组件居中放置到鼠标位置
            left -= componentDef.initialSize.width / 2;
            top -= componentDef.initialSize.height / 2;
          }

          // 吸附到网格
          if (props.snapToGrid) {
            left = Math.round(left / props.gridSize) * props.gridSize;
            top = Math.round(top / props.gridSize) * props.gridSize;
          }

          // 确保组件不会被放置到画布之外
          left = Math.max(0, Math.min(left, props.canvasWidth - (componentDef?.initialSize?.width || 100)));
          top = Math.max(0, Math.min(top, props.canvasHeight - (componentDef?.initialSize?.height || 40)));

          // 添加组件到画布
          emit('add-component', dropData.componentId, { left, top }, dropTargetId.value || undefined);
        }
      } catch (error) {
        console.error('解析拖拽数据失败:', error);
      }
    }

    // 重置拖拽状态
    dropTargetId.value = null;
    validDropTarget.value = false;

    // 清除对齐辅助线
    alignmentGuides.value = [];
  } catch (error) {
    console.error('处理拖拽放置失败:', error);
  }
};

/**
 * 切换是否显示网格
 */
const toggleGrid = () => {
  try {
    editorStore.setCanvasConfig({ showGrid: !props.showGrid });
  } catch (error) {
    console.error('切换显示网格失败:', error);
  }
};

/**
 * 切换是否吸附到网格
 */
const toggleSnapToGrid = () => {
  try {
    editorStore.setCanvasConfig({ snapToGrid: !props.snapToGrid });
  } catch (error) {
    console.error('切换吸附到网格失败:', error);
  }
};

/**
 * 获取对齐辅助线样式
 */
const getGuideStyle = (guide: AlignmentGuide) => {
  try {
    if (guide.type === 'horizontal') {
      return {
        top: `${guide.position}px`,
        left: '0',
        width: '100%',
        backgroundColor: guide.color,
      };
    } else {
      return {
        left: `${guide.position}px`,
        top: '0',
        height: '100%',
        backgroundColor: guide.color,
      };
    }
  } catch (error) {
    console.error('获取对齐辅助线样式失败:', error);
    return {};
  }
};

/**
 * 获取可放置区域指示器样式
 */
const getDropIndicatorStyle = () => {
  try {
    if (dropTargetId.value) {
      // 查找目标容器组件
      const container = props.components.find(comp => comp.id === dropTargetId.value);
      if (container) {
        return {
          left: `${container.style.left}px`,
          top: `${container.style.top}px`,
          width: `${container.style.width}px`,
          height: `${container.style.height}px`,
          backgroundColor: validDropTarget.value ? 'rgba(52, 152, 219, 0.15)' : 'rgba(231, 76, 60, 0.15)',
          borderColor: validDropTarget.value ? '#3498db' : '#e74c3c',
        };
      }
    }

    // 默认为整个画布
    return {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      borderColor: '#3498db',
    };
  } catch (error) {
    console.error('获取可放置区域指示器样式失败:', error);
    return {};
  }
};

/**
 * 监听拖拽开始事件
 */
const handleComponentDragStart = (component: ComponentDefinition) => {
  try {
    dragComponentId.value = component.id;
  } catch (error) {
    console.error('处理组件拖拽开始失败:', error);
  }
};

// 监听文档的dragstart事件，用于捕获组件面板拖拽事件
watch(
  () => props.mode,
  (newMode) => {
    if (newMode === 'edit') {
      document.addEventListener('dragstart', handleComponentDragStart);
    } else {
      document.removeEventListener('dragstart', handleComponentDragStart);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.canvas-editor {
  position: relative;
  overflow: visible;
  transform-origin: top left;
}

.canvas-grid {
  position: relative;
  background-color: #f5f5f5;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transform-origin: top left;
  border: 1px solid #dcdfe6;
  transition: transform 0.3s ease;
}

.grid-visible {
  background-image:
    linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
}

.canvas-editor-preview {
  cursor: default !important;
}

.canvas-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 10px;
}

.canvas-controls .active {
  background-color: #409EFF;
  color: white;
}

.alignment-guide {
  position: absolute;
  z-index: 1000;
  pointer-events: none;
}

.alignment-guide.horizontal {
  width: 100%;
  height: 1px;
}

.alignment-guide.vertical {
  height: 100%;
  width: 1px;
}

.drop-indicator {
  position: absolute;
  z-index: 90;
  border: 2px dashed;
  border-radius: 4px;
  pointer-events: none;
}
</style>
