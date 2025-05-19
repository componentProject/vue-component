<template>
  <div 
    ref="componentRef"
    class="draggable-component"
    :class="{ 'is-selected': isSelected }"
    :style="componentStyle"
    @click.stop="handleSelect"
  >
    <!-- 组件工具栏 -->
    <div v-if="isSelected" class="component-toolbar">
      <el-button-group size="small">
        <el-button type="primary" icon="el-icon-delete" @click.stop="handleDelete"></el-button>
        <el-button type="primary" icon="el-icon-copy-document" @click.stop="handleCopy"></el-button>
      </el-button-group>
    </div>
    
    <!-- 拖拽手柄区域 -->
    <div 
      v-if="isSelected"
      class="drag-handle"
      @mousedown="handleDragStart"
    >
      <i class="el-icon-rank"></i>
    </div>
    
    <!-- 调整尺寸的手柄 -->
    <div 
      v-if="isSelected && resizable"
      class="resize-handle resize-handle-se"
      @mousedown="handleResizeStart('se')"
    ></div>
    
    <!-- 根据组件类型渲染不同内容 -->
    <component-preview
      :component="component"
      :selected="isSelected"
    />
    
    <!-- 递归渲染子组件 -->
    <template v-if="component.children && component.children.length > 0">
      <draggable-component
        v-for="child in component.children"
        :key="child.id"
        :component="child"
        :is-selected="isSelected && child.id === selectedChildId"
        :parent-selected="isSelected"
        @select="handleChildSelect"
        @move="handleChildMove"
        @delete="handleChildDelete"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
/**
 * 可拖拽组件
 * 处理单个可拖拽组件的渲染和交互逻辑
 */
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import type { Component, Position, Size } from '../types';
import { componentRegistry } from '../utils/componentRegistry';
import { logInfo, logError } from '../utils/logger';
import ComponentPreview from './ComponentPreview.vue';

// 定义组件属性
const props = defineProps<{
  component: Component;
  isSelected: boolean;
  parentSelected?: boolean;
}>();

// 定义事件
const emit = defineEmits<{
  (e: 'select', componentId: string): void;
  (e: 'move', componentId: string, position: Position): void;
  (e: 'delete', componentId: string): void;
  (e: 'copy', componentId: string): void;
  (e: 'resize', componentId: string, size: Size): void;
}>();

// 组件DOM引用
const componentRef = ref<HTMLElement | null>(null);

// 选中的子组件ID
const selectedChildId = ref<string | null>(null);

// 拖拽状态
const dragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });

// 调整尺寸状态
const resizing = ref(false);
const resizeDirection = ref('');
const initialSize = ref({ width: 0, height: 0 });
const initialPosition = ref({ x: 0, y: 0 });

// 组件定义
const componentDefinition = computed(() => {
  try {
    return componentRegistry.getComponent(props.component.type);
  } catch (error) {
    logError('Failed to get component definition', error);
    return undefined;
  }
});

// 是否可调整尺寸
const resizable = computed(() => {
  try {
    // 容器组件通常可调整尺寸
    return componentDefinition.value?.isContainer ?? false;
  } catch (error) {
    logError('Failed to determine if component is resizable', error);
    return false;
  }
});

// 组件样式
const componentStyle = computed(() => {
  try {
    return {
      ...props.component.style
    };
  } catch (error) {
    logError('Failed to compute component style', error);
    return {};
  }
});

/**
 * 处理组件选择
 */
const handleSelect = () => {
  try {
    emit('select', props.component.id);
    logInfo('Component selected', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to handle component selection', error);
  }
};

/**
 * 处理组件删除
 */
const handleDelete = () => {
  try {
    emit('delete', props.component.id);
    logInfo('Component delete requested', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to handle component deletion', error);
  }
};

/**
 * 处理组件复制
 */
const handleCopy = () => {
  try {
    emit('copy', props.component.id);
    logInfo('Component copy requested', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to handle component copy', error);
  }
};

/**
 * 处理拖拽开始
 * @param event 鼠标事件
 */
const handleDragStart = (event: MouseEvent) => {
  try {
    if (!componentRef.value) return;
    
    // 阻止事件冒泡和默认行为
    event.stopPropagation();
    event.preventDefault();
    
    // 获取当前组件位置
    const rect = componentRef.value.getBoundingClientRect();
    
    // 计算拖拽起始点与组件左上角的偏移
    dragOffset.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    
    // 设置拖拽状态
    dragging.value = true;
    
    // 添加拖拽过程和结束的事件监听
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    
    logInfo('Component drag started', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to start component drag', error);
  }
};

/**
 * 处理拖拽移动
 * @param event 鼠标事件
 */
const handleDragMove = (event: MouseEvent) => {
  try {
    if (!dragging.value || !componentRef.value) return;
    
    // 获取父容器
    const parent = componentRef.value.parentElement;
    if (!parent) return;
    
    // 计算新位置（相对于父容器）
    const parentRect = parent.getBoundingClientRect();
    const x = event.clientX - parentRect.left - dragOffset.value.x;
    const y = event.clientY - parentRect.top - dragOffset.value.y;
    
    // 约束在父容器范围内
    const maxX = parent.clientWidth - componentRef.value.offsetWidth;
    const maxY = parent.clientHeight - componentRef.value.offsetHeight;
    
    const newX = Math.max(0, Math.min(x, maxX));
    const newY = Math.max(0, Math.min(y, maxY));
    
    // 触发移动事件
    emit('move', props.component.id, { x: newX, y: newY });
  } catch (error) {
    logError('Failed during component drag', error);
    handleDragEnd();
  }
};

/**
 * 处理拖拽结束
 */
const handleDragEnd = () => {
  try {
    // 重置拖拽状态
    dragging.value = false;
    
    // 移除事件监听
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    
    logInfo('Component drag ended', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to end component drag', error);
  }
};

/**
 * 处理调整尺寸开始
 * @param direction 调整方向
 * @param event 鼠标事件
 */
const handleResizeStart = (direction: string, event?: MouseEvent) => {
  try {
    if (!componentRef.value || !event) return;
    
    // 阻止事件冒泡和默认行为
    event.stopPropagation();
    event.preventDefault();
    
    // 获取当前组件尺寸
    const rect = componentRef.value.getBoundingClientRect();
    
    // 保存初始尺寸和位置
    initialSize.value = {
      width: rect.width,
      height: rect.height
    };
    
    initialPosition.value = {
      x: event.clientX,
      y: event.clientY
    };
    
    // 设置调整尺寸状态
    resizing.value = true;
    resizeDirection.value = direction;
    
    // 添加调整尺寸过程和结束的事件监听
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
    
    logInfo('Component resize started', { 
      componentId: props.component.id,
      direction
    });
  } catch (error) {
    logError('Failed to start component resize', error);
  }
};

/**
 * 处理调整尺寸移动
 * @param event 鼠标事件
 */
const handleResizeMove = (event: MouseEvent) => {
  try {
    if (!resizing.value || !componentRef.value) return;
    
    // 计算宽高变化量
    const deltaX = event.clientX - initialPosition.value.x;
    const deltaY = event.clientY - initialPosition.value.y;
    
    // 根据调整方向计算新尺寸
    let newWidth = initialSize.value.width;
    let newHeight = initialSize.value.height;
    
    if (resizeDirection.value.includes('e')) {
      newWidth += deltaX;
    }
    
    if (resizeDirection.value.includes('s')) {
      newHeight += deltaY;
    }
    
    // 确保最小尺寸
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);
    
    // 更新尺寸
    emit('resize', props.component.id, {
      width: newWidth,
      height: newHeight
    });
  } catch (error) {
    logError('Failed during component resize', error);
    handleResizeEnd();
  }
};

/**
 * 处理调整尺寸结束
 */
const handleResizeEnd = () => {
  try {
    // 重置调整尺寸状态
    resizing.value = false;
    
    // 移除事件监听
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    logInfo('Component resize ended', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to end component resize', error);
  }
};

/**
 * 处理子组件选择
 * @param childId 子组件ID
 */
const handleChildSelect = (childId: string) => {
  try {
    selectedChildId.value = childId;
    emit('select', childId);
    logInfo('Child component selected', { 
      parentId: props.component.id,
      childId
    });
  } catch (error) {
    logError('Failed to handle child selection', error);
  }
};

/**
 * 处理子组件移动
 * @param childId 子组件ID
 * @param position 新位置
 */
const handleChildMove = (childId: string, position: Position) => {
  try {
    emit('move', childId, position);
    logInfo('Child component moved', { 
      parentId: props.component.id,
      childId,
      position
    });
  } catch (error) {
    logError('Failed to handle child move', error);
  }
};

/**
 * 处理子组件删除
 * @param childId 子组件ID
 */
const handleChildDelete = (childId: string) => {
  try {
    if (selectedChildId.value === childId) {
      selectedChildId.value = null;
    }
    
    emit('delete', childId);
    logInfo('Child component deleted', { 
      parentId: props.component.id,
      childId 
    });
  } catch (error) {
    logError('Failed to handle child deletion', error);
  }
};

// 组件挂载时
onMounted(() => {
  try {
    logInfo('Draggable component mounted', { 
      componentId: props.component.id,
      type: props.component.type
    });
  } catch (error) {
    logError('Failed to mount draggable component', error);
  }
});

// 组件卸载时确保清理事件监听
onUnmounted(() => {
  try {
    if (dragging.value) {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    }
    
    if (resizing.value) {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    }
    
    logInfo('Draggable component unmounted', { componentId: props.component.id });
  } catch (error) {
    logError('Failed to unmount draggable component', error);
  }
});

// 使用VueUse的ResizeObserver观察组件尺寸变化
useResizeObserver(componentRef, (entries) => {
  try {
    const entry = entries[0];
    if (!entry) return;
    
    logInfo('Component resized by browser', { 
      componentId: props.component.id,
      size: {
        width: entry.contentRect.width,
        height: entry.contentRect.height
      }
    });
  } catch (error) {
    logError('Failed to handle resize observation', error);
  }
});
</script>

<style scoped>
.draggable-component {
  @apply relative border border-transparent;
  min-width: 20px;
  min-height: 20px;
}

.draggable-component.is-selected {
  @apply border-blue-500 z-10;
}

.component-toolbar {
  @apply absolute -top-10 left-0 bg-white border border-gray-200 rounded shadow-sm;
  z-index: 100;
}

.drag-handle {
  @apply absolute -top-5 -left-5 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-move;
  z-index: 101;
}

.resize-handle {
  @apply absolute w-6 h-6 bg-blue-500 rounded-full;
  z-index: 101;
}

.resize-handle-se {
  @apply bottom-0 right-0 cursor-se-resize;
  transform: translate(50%, 50%);
}
</style> 