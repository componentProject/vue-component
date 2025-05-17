/**
 * 可拖拽功能 Hook
 * 为组件添加拖拽功能
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { snapToGrid, constrainToCanvas, calculateDragOffset, getAlignmentLines, findClosestAlignmentLine } from '../utils/dragUtils';
import type { ComponentData } from '../types';

/**
 * 可拖拽 Hook 配置参数接口
 */
interface UseDraggableOptions {
  /**
   * 是否启用网格对齐
   */
  snapToGrid?: boolean;
  /**
   * 网格大小
   */
  gridSize?: number;
  /**
   * 是否限制在父元素内
   */
  constrainToParent?: boolean;
  /**
   * 是否启用对齐线
   */
  enableAlignment?: boolean;
  /**
   * 对齐阈值
   */
  alignmentThreshold?: number;
  /**
   * 画布宽度
   */
  canvasWidth?: number;
  /**
   * 画布高度
   */
  canvasHeight?: number;
  /**
   * 其他组件
   */
  otherComponents?: ComponentData[];
}

/**
 * 组件拖拽 Hook
 */
export function useDraggable(element: any, options: UseDraggableOptions = {}) {
  /**
   * 默认参数
   */
  const {
    snapToGrid: enableSnapToGrid = false,
    gridSize = 10,
    constrainToParent = true,
    enableAlignment = true,
    alignmentThreshold = 5,
    canvasWidth = 1200,
    canvasHeight = 800,
    otherComponents = []
  } = options;

  /**
   * 拖拽状态
   */
  const isDragging = ref(false);
  const position = ref({ x: 0, y: 0 });
  const startPosition = ref({ x: 0, y: 0 });
  const dragOffset = ref({ x: 0, y: 0 });
  
  /**
   * 对齐线状态
   */
  const alignmentLines = ref<{ horizontal: number | null; vertical: number | null }>({
    horizontal: null,
    vertical: null,
  });

  /**
   * 开始拖拽处理
   */
  const handleDragStart = (event: MouseEvent) => {
    try {
      if (!element.value) return;

      const rect = element.value.getBoundingClientRect();
      position.value = { x: rect.left, y: rect.top };
      startPosition.value = { x: rect.left, y: rect.top };
      
      // 计算鼠标位置和元素位置的偏移量
      const offset = calculateDragOffset(
        event.clientX, 
        event.clientY,
        rect.left,
        rect.top
      );
      
      dragOffset.value = { x: offset.offsetX, y: offset.offsetY };
      isDragging.value = true;
      
      // 防止默认行为和冒泡
      event.preventDefault();
      event.stopPropagation();
      
      // 添加全局事件监听
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    } catch (error) {
      console.error(`拖拽开始失败: ${error}`);
    }
  };

  /**
   * 拖拽移动处理
   */
  const handleDragMove = (event: MouseEvent) => {
    try {
      if (!isDragging.value) return;
      
      // 计算新位置
      let newX = event.clientX - dragOffset.value.x;
      let newY = event.clientY - dragOffset.value.y;
      
      // 网格对齐
      if (enableSnapToGrid) {
        newX = snapToGrid(newX, gridSize);
        newY = snapToGrid(newY, gridSize);
      }
      
      // 对齐线
      if (enableAlignment && element.value && otherComponents.length > 0) {
        // 模拟当前组件数据用于对齐计算
        const currentComponent = {
          id: 'current',
          style: {
            left: newX,
            top: newY,
            width: element.value.offsetWidth,
            height: element.value.offsetHeight,
          }
        } as ComponentData;
        
        // 获取所有可能的对齐线
        const lines = getAlignmentLines(currentComponent, otherComponents);
        
        // 查找最接近的水平对齐线
        const closestHorizontalLine = findClosestAlignmentLine(
          newY, 
          lines.horizontal,
          alignmentThreshold
        );
        
        // 查找最接近的垂直对齐线
        const closestVerticalLine = findClosestAlignmentLine(
          newX,
          lines.vertical,
          alignmentThreshold
        );
        
        // 应用对齐线位置
        if (closestHorizontalLine !== null) {
          newY = closestHorizontalLine;
          alignmentLines.value.horizontal = closestHorizontalLine;
        } else {
          alignmentLines.value.horizontal = null;
        }
        
        if (closestVerticalLine !== null) {
          newX = closestVerticalLine;
          alignmentLines.value.vertical = closestVerticalLine;
        } else {
          alignmentLines.value.vertical = null;
        }
      }
      
      // 限制在父元素内
      if (constrainToParent && element.value) {
        const { left, top } = constrainToCanvas(
          newX,
          newY,
          element.value.offsetWidth,
          element.value.offsetHeight,
          canvasWidth,
          canvasHeight
        );
        
        newX = left;
        newY = top;
      }
      
      // 更新位置
      position.value = { x: newX, y: newY };
      
      // 防止默认行为和冒泡
      event.preventDefault();
      event.stopPropagation();
    } catch (error) {
      console.error(`拖拽移动失败: ${error}`);
    }
  };

  /**
   * 结束拖拽处理
   */
  const handleDragEnd = () => {
    try {
      isDragging.value = false;
      alignmentLines.value = { horizontal: null, vertical: null };
      
      // 移除全局事件监听
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    } catch (error) {
      console.error(`拖拽结束失败: ${error}`);
    }
  };

  /**
   * 挂载和卸载事件处理
   */
  onMounted(() => {
    try {
      if (element.value) {
        element.value.addEventListener('mousedown', handleDragStart);
      }
    } catch (error) {
      console.error(`挂载拖拽事件失败: ${error}`);
    }
  });

  onUnmounted(() => {
    try {
      if (element.value) {
        element.value.removeEventListener('mousedown', handleDragStart);
      }
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    } catch (error) {
      console.error(`卸载拖拽事件失败: ${error}`);
    }
  });

  /**
   * 返回拖拽相关状态和方法
   */
  return {
    isDragging,
    position,
    startPosition,
    alignmentLines,
  };
} 