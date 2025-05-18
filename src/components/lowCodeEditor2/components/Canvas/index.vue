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
          :class="{ horizontal: guide.type === 'horizontal', vertical: guide.type === 'vertical' }"
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
          <el-button
            type="primary"
            size="small"
            :icon="Grid"
            plain
            :class="{ active: showGrid }"
            @click="toggleGrid"
          ></el-button>
        </el-tooltip>

        <el-tooltip content="吸附到网格" placement="top">
          <el-button
            type="primary"
            size="small"
            :icon="Magnet"
            plain
            :class="{ active: snapToGrid }"
            @click="toggleSnapToGrid"
          ></el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Grid, Magnet } from '@element-plus/icons-vue'
import { useEditorStore } from '../../store/editorStore'
import {
  calculateAlignmentGuides,
  findContainerAtPosition,
  canDropIntoContainer,
  snapToGridPosition,
} from '../../utils/dragUtils'
import type {
  CanvasComponent as CanvasComponentType,
  ComponentDefinition,
  AlignmentGuide,
} from '../../types'
import CanvasComponent from './CanvasComponent.vue'
import { ElMessage } from 'element-plus'

/**
 * 组件属性
 */
const props = defineProps<{
  /**
   * 画布上的组件数据
   */
  components: CanvasComponentType[]

  /**
   * 组件定义列表
   */
  componentDefinitions: ComponentDefinition[]

  /**
   * 选中的组件ID列表
   */
  selectedComponentIds: string[]

  /**
   * 画布宽度
   */
  canvasWidth: number

  /**
   * 画布高度
   */
  canvasHeight: number

  /**
   * 缩放比例
   */
  scale: number

  /**
   * 是否显示网格
   */
  showGrid: boolean

  /**
   * 是否吸附到网格
   */
  snapToGrid: boolean

  /**
   * 网格大小
   */
  gridSize: number

  /**
   * 画布背景颜色
   */
  canvasBackground: string

  /**
   * 编辑器模式
   */
  mode: 'edit' | 'preview'
}>()

/**
 * 组件事件
 */
const emit = defineEmits<{
  // 添加组件
  (
    e: 'add-component',
    componentId: string,
    position: { left: number; top: number },
    parentId?: string,
  ): void
  // 选择组件
  (e: 'select-component', componentId: string | null, isMultiSelect: boolean): void
  // 更新组件属性
  (e: 'update:props', componentId: string, props: Record<string, any>): void
  // 更新组件样式
  (e: 'update:style', componentId: string, style: Partial<CanvasComponentType['style']>): void
  // 删除组件
  (e: 'delete-component', componentId: string): void
}>()

/**
 * 画布DOM引用
 */
const canvasRef = ref<HTMLElement | null>(null)

/**
 * 编辑器store实例
 */
const editorStore = useEditorStore()

/**
 * 拖动相关状态
 */
const isDraggingOver = ref(false)
const dragComponentId = ref<string | null>(null)
const dropTargetId = ref<string | null>(null)
const validDropTarget = ref(false)

/**
 * 对齐辅助线列表
 */
const alignmentGuides = ref<AlignmentGuide[]>([])

/**
 * 组件定义映射
 */
const componentDefinitionsMap = computed(() => {
  try {
    return props.componentDefinitions.reduce(
      (map, def) => {
        map[def.id] = def
        return map
      },
      {} as Record<string, ComponentDefinition>,
    )
  } catch (error) {
    console.error('计算组件定义映射失败:', error)
    return {}
  }
})

/**
 * 获取组件定义
 */
const getComponentDefinition = (id: string): ComponentDefinition | undefined => {
  try {
    return componentDefinitionsMap.value[id]
  } catch (error) {
    console.error('获取组件定义失败:', error)
    return undefined
  }
}

/**
 * 检查组件是否被选中
 */
const isComponentSelected = (id: string): boolean => {
  try {
    return props.selectedComponentIds.includes(id)
  } catch (error) {
    console.error('检查组件是否被选中失败:', error)
    return false
  }
}

/**
 * 处理画布点击
 */
const handleCanvasClick = (e: MouseEvent) => {
  try {
    // 防止点击冒泡引起的可能问题
    if (!canvasRef.value) return;
    
    // 如果编辑器是预览模式，不做任何操作
    if (props.mode === 'preview') return;

    // 使用更安全的方法检查点击的是否是画布本身或画布网格（而不是组件）
    const clickTarget = e.target as HTMLElement;
    
    // 检查是否点击在画布或画布网格上
    let isCanvas = false;
    
    // 检查点击的是否是画布本身
    if (canvasRef.value === clickTarget) {
      isCanvas = true;
    }
    
    // 检查是否是画布的网格元素（第一个子元素）
    if (!isCanvas && canvasRef.value.children && canvasRef.value.children.length > 0) {
      isCanvas = clickTarget === canvasRef.value.children[0] || 
                canvasRef.value.children[0].contains(clickTarget);
    }
    
    if (isCanvas) {
      // 使用 setTimeout 延迟执行清除选择，避免可能的DOM冲突
      setTimeout(() => {
        try {
          emit('select-component', null, false);
        } catch (error) {
          console.error('清除组件选择失败:', error);
        }
      }, 10); // 增加延时以确保DOM已更新
    }
  } catch (error) {
    console.error('处理画布点击失败:', error);
    
    // 出错时不执行任何选择操作，避免可能的DOM错误
    e.stopPropagation();
    e.preventDefault();
  }
}

/**
 * 处理选择组件
 */
const handleSelectComponent = (componentId: string, isMultiSelect: boolean) => {
  try {
    emit('select-component', componentId, isMultiSelect)
  } catch (error) {
    console.error('处理选择组件失败:', error)
  }
}

/**
 * 处理拖拽经过
 */
const handleDragOver = (event: DragEvent) => {
  try {
    if (props.mode === 'preview') return;

    event.preventDefault();
    event.stopPropagation();

    // 设置放置效果
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }

    isDraggingOver.value = true;

    // 获取拖拽位置相对于画布的坐标
    if (canvasRef.value && event.dataTransfer) {
      const rect = canvasRef.value.getBoundingClientRect();
      const x = (event.clientX - rect.left) / props.scale;
      const y = (event.clientY - rect.top) / props.scale;

      // 查找可能的容器组件
      const containerComponent = findContainerAtPosition(
        { x, y },
        props.components,
        componentDefinitionsMap.value,
        dragComponentId.value || undefined,
      );

      if (containerComponent) {
        dropTargetId.value = containerComponent.id;

        // 检查是否可以放入该容器
        if (dragComponentId.value) {
          const draggedComponent = getComponentDefinition(dragComponentId.value);
          if (draggedComponent) {
            // 检查组件放置规则
            validDropTarget.value = checkDropRules(
              draggedComponent.type,
              dragComponentId.value,
              containerComponent,
              componentDefinitionsMap.value,
            );
          }
        }
      } else {
        dropTargetId.value = null;
        // 只有容器组件可以直接放在画布上
        if (dragComponentId.value) {
          const draggedComponent = getComponentDefinition(dragComponentId.value);
          validDropTarget.value = draggedComponent?.type === 'layout' && 
                                 draggedComponent.id === 'el-container';
        } else {
          validDropTarget.value = false;
        }
      }
    }
  } catch (error) {
    console.error('处理拖拽经过失败:', error);
  }
};

/**
 * 检查组件放置规则
 * 1. 基础组件只能放置在布局组件中
 * 2. 图表组件只能放置在容器组件中
 * 3. 行组件只能放置在容器组件中
 * 4. 列组件只能放置在行组件中
 * 5. 容器组件可以放置在画布上或其他容器组件中
 */
const checkDropRules = (
  componentType: string,
  componentId: string,
  containerComponent: any,
  componentDefinitions: Record<string, ComponentDefinition>
): boolean => {
  try {
    // 获取容器组件定义
    const containerDef = getComponentDefinition(containerComponent.componentId);
    if (!containerDef) return false;

    // 检查是否允许包含子组件
    if (!containerDef.allowChildren) return false;

    // 特殊规则检查
    // 1. 行组件只能放在容器组件中
    if (componentId === 'el-row') {
      return containerComponent.componentId === 'el-container';
    }
    
    // 2. 列组件只能放在行组件中
    if (componentId === 'el-col') {
      return containerComponent.componentId === 'el-row';
    }

    // 如果容器是布局组件，检查是否允许放置当前类型
    if (containerDef.type === 'layout') {
      // 布局组件类型检查
      if (componentType === 'basic') {
        // 基础组件可以放在任何布局组件中
        return true;
      } else if (componentType === 'chart') {
        // 图表组件只能放在容器(el-container)组件中
        return containerComponent.componentId === 'el-container';
      } else if (componentType === 'layout') {
        // 布局组件可以放在其他布局组件中，但要遵循特殊规则
        return true;
      }
    }

    // 默认不允许
    return false;
  } catch (error) {
    console.error('检查组件放置规则失败:', error);
    return false;
  }
};

/**
 * 处理拖拽放置
 */
const handleDrop = (event: DragEvent) => {
  try {
    if (props.mode === 'preview') return;

    event.preventDefault();
    event.stopPropagation();

    isDraggingOver.value = false;

    // 解析拖拽数据
    if (event.dataTransfer && canvasRef.value) {
      const data = event.dataTransfer.getData('application/json');
      if (!data) return;

      try {
        const dropData = JSON.parse(data);
        if (dropData.type === 'component' && dropData.componentId) {
          // 获取组件定义
          const componentDef = getComponentDefinition(dropData.componentId);
          if (!componentDef) return;

          // 获取放置位置相对于画布的坐标
          const rect = canvasRef.value.getBoundingClientRect();
          let left = (event.clientX - rect.left) / props.scale;
          let top = (event.clientY - rect.top) / props.scale;

          // 获取组件定义以获取初始尺寸
          if (componentDef && componentDef.initialSize) {
            // 将组件居中放置到鼠标位置
            left -= componentDef.initialSize.width / 2;
            top -= componentDef.initialSize.height / 2;
          }

          // 吸附到网格
          if (props.snapToGrid) {
            const snapped = snapToGridPosition({ x: left, y: top }, props.gridSize);
            left = snapped.x;
            top = snapped.y;
          }

          // 确保组件不会被放置到画布之外
          left = Math.max(
            0,
            Math.min(left, props.canvasWidth - (componentDef?.initialSize?.width || 100)),
          );
          top = Math.max(
            0,
            Math.min(top, props.canvasHeight - (componentDef?.initialSize?.height || 40)),
          );

          // 检查放置规则
          let canAdd = true;
          let targetParentId = null;
          let message = '';

          const componentId = dropData.componentId;
          const componentType = componentDef.type;

          // 根据组件类型和目标容器进行规则检查
          if (componentId === 'el-container') {
            // 容器组件可以放在画布上或其他容器组件中
            if (dropTargetId.value) {
              const containerComponent = props.components.find((c) => c.id === dropTargetId.value);
              if (containerComponent) {
                if (containerComponent.componentId === 'el-container') {
                  targetParentId = dropTargetId.value;
                } else {
                  canAdd = false;
                  message = '容器组件只能放置在其他容器组件中';
                }
              } else {
                canAdd = false;
              }
            }
            // 容器可以直接放在画布上
          } 
          else if (componentId === 'el-row') {
            // 行组件只能放在容器组件中
            if (!dropTargetId.value) {
              canAdd = false;
              message = '行组件必须放置在容器组件中';
            } else {
              const containerComponent = props.components.find((c) => c.id === dropTargetId.value);
              if (containerComponent && containerComponent.componentId === 'el-container') {
                targetParentId = dropTargetId.value;
              } else {
                canAdd = false;
                message = '行组件只能放置在容器组件中';
              }
            }
          } 
          else if (componentId === 'el-col') {
            // 列组件只能放在行组件中
            if (!dropTargetId.value) {
              canAdd = false;
              message = '列组件必须放置在行组件中';
            } else {
              const containerComponent = props.components.find((c) => c.id === dropTargetId.value);
              if (containerComponent && containerComponent.componentId === 'el-row') {
                targetParentId = dropTargetId.value;
              } else {
                canAdd = false;
                message = '列组件只能放置在行组件中';
              }
            }
          } 
          else if (componentType === 'basic') {
            // 基础组件必须放在布局组件中
            if (!dropTargetId.value) {
              canAdd = false;
              message = '基础组件必须放置在布局组件中';
            } else {
              const containerComponent = props.components.find((c) => c.id === dropTargetId.value);
              if (containerComponent) {
                const containerDef = getComponentDefinition(containerComponent.componentId);
                canAdd = containerDef?.type === 'layout' && !!containerDef.allowChildren;
                if (canAdd) {
                  targetParentId = dropTargetId.value;
                } else {
                  message = '基础组件必须放置在布局组件中';
                }
              } else {
                canAdd = false;
              }
            }
          } 
          else if (componentType === 'chart') {
            // 图表组件只能放在容器组件中
            if (!dropTargetId.value) {
              canAdd = false;
              message = '图表组件必须放置在容器(Container)组件中';
            } else {
              const containerComponent = props.components.find((c) => c.id === dropTargetId.value);
              if (containerComponent) {
                // 只有el-container可以放置图表组件
                canAdd = containerComponent.componentId === 'el-container';
                if (!canAdd) {
                  message = '图表组件只能放置在容器(Container)组件中，不能放在行或列组件中';
                } else {
                  targetParentId = dropTargetId.value;
                }
              } else {
                canAdd = false;
              }
            }
          }

          // 只有验证通过才添加组件
          if (canAdd) {
            try {
              // 添加组件到画布
              emit('add-component', dropData.componentId, { left, top }, targetParentId);
            } catch (emitError) {
              console.error('添加组件到画布失败:', emitError);
            }
          } else if (message) {
            ElMessage.warning(message);
          }
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
    // 防止insertBefore错误
    dropTargetId.value = null;
    validDropTarget.value = false;
    alignmentGuides.value = [];
  }
};

/**
 * 切换是否显示网格
 */
const toggleGrid = () => {
  try {
    editorStore.setCanvasConfig({ showGrid: !props.showGrid })
  } catch (error) {
    console.error('切换显示网格失败:', error)
  }
}

/**
 * 切换是否吸附到网格
 */
const toggleSnapToGrid = () => {
  try {
    editorStore.setCanvasConfig({ snapToGrid: !props.snapToGrid })
  } catch (error) {
    console.error('切换吸附到网格失败:', error)
  }
}

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
      }
    } else {
      return {
        left: `${guide.position}px`,
        top: '0',
        height: '100%',
        backgroundColor: guide.color,
      }
    }
  } catch (error) {
    console.error('获取对齐辅助线样式失败:', error)
    return {}
  }
}

/**
 * 获取可放置区域指示器样式
 */
const getDropIndicatorStyle = () => {
  try {
    if (dropTargetId.value) {
      // 查找目标容器组件
      const container = props.components.find((comp) => comp.id === dropTargetId.value)
      if (container) {
        return {
          left: `${container.style.left}px`,
          top: `${container.style.top}px`,
          width: `${container.style.width}px`,
          height: `${container.style.height}px`,
          backgroundColor: validDropTarget.value
            ? 'rgba(52, 152, 219, 0.15)'
            : 'rgba(231, 76, 60, 0.15)',
          borderColor: validDropTarget.value ? '#3498db' : '#e74c3c',
        }
      }
    }

    // 默认为整个画布
    return {
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(52, 152, 219, 0.1)',
      borderColor: '#3498db',
    }
  } catch (error) {
    console.error('获取可放置区域指示器样式失败:', error)
    return {}
  }
}

/**
 * 监听拖拽开始事件
 */
const handleComponentDragStart = (component: ComponentDefinition) => {
  try {
    dragComponentId.value = component.id
  } catch (error) {
    console.error('处理组件拖拽开始失败:', error)
  }
}

// 监听文档的dragstart事件，用于捕获组件面板拖拽事件
watch(
  () => props.mode,
  (newMode) => {
    if (newMode === 'edit') {
      document.addEventListener('dragstart', handleComponentDragStart)
    } else {
      document.removeEventListener('dragstart', handleComponentDragStart)
    }
  },
  { immediate: true },
)
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
  box-shadow: 0 0 10px rgb(0 0 0 / 10%);
  transform-origin: top left;
  border: 1px solid #dcdfe6;
  transition: transform 0.3s ease;
  margin: 0 auto; /* 水平居中 */
  width: 100%;
  height: 100%;
}

.grid-visible {
  background-image:
    linear-gradient(to right, rgb(0 0 0 / 5%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(0 0 0 / 5%) 1px, transparent 1px);
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
  background-color: #409eff;
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
