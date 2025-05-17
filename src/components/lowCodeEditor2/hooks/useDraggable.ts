import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { DragEventParams } from '../types';
import { getMousePosition, snapToGridPosition } from '../utils/dragUtils';

/**
 * 可拖拽Hook
 * 实现组件的拖拽功能
 * @param options 拖拽选项
 */
export function useDraggable(options: {
  /**
   * 元素引用
   */
  elementRef: any;
  
  /**
   * 初始位置
   */
  initialPosition?: { x: number; y: number };
  
  /**
   * 是否启用拖拽
   */
  enabled?: boolean;
  
  /**
   * 是否吸附到网格
   */
  snapToGrid?: boolean;
  
  /**
   * 网格大小
   */
  gridSize?: number;
  
  /**
   * 边界限制
   */
  boundaries?: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  
  /**
   * 拖拽开始回调
   */
  onDragStart?: (params: DragEventParams) => void;
  
  /**
   * 拖拽中回调
   */
  onDrag?: (params: DragEventParams) => void;
  
  /**
   * 拖拽结束回调
   */
  onDragEnd?: (params: DragEventParams) => void;
  
  /**
   * 组件ID
   */
  componentId?: string;
}) {
  try {
    const {
      elementRef,
      initialPosition = { x: 0, y: 0 },
      enabled = true,
      snapToGrid: shouldSnapToGrid = false,
      gridSize = 10,
      boundaries,
      onDragStart,
      onDrag,
      onDragEnd,
      componentId = 'unknown',
    } = options;
    
    // 当前位置
    const position = ref(initialPosition);
    
    // 是否正在拖动
    const isDragging = ref(false);
    
    // 拖动起始点
    const startPosition = ref({ x: 0, y: 0 });
    
    // 鼠标与元素的偏移量
    const offset = ref({ x: 0, y: 0 });
    
    /**
     * 处理拖动开始
     */
    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      try {
        if (!enabled || !elementRef.value) return;
        
        isDragging.value = true;
        
        // 获取鼠标位置
        const mousePos = getMousePosition(event);
        
        // 计算偏移量：鼠标位置 - 元素当前位置
        offset.value = {
          x: mousePos.x - position.value.x,
          y: mousePos.y - position.value.y,
        };
        
        // 保存起始位置
        startPosition.value = { ...position.value };
        
        // 触发拖动开始回调
        if (onDragStart) {
          onDragStart({
            componentId,
            startPosition: startPosition.value,
            currentPosition: position.value,
            offset: offset.value,
            event,
          });
        }
        
        // 添加事件监听
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        
        // 阻止默认行为和冒泡
        event.preventDefault();
        event.stopPropagation();
      } catch (error) {
        console.error('拖动开始处理失败:', error);
      }
    };
    
    /**
     * 处理拖动过程
     */
    const handleDragMove = (event: MouseEvent | TouchEvent) => {
      try {
        if (!isDragging.value) return;
        
        // 获取鼠标位置
        const mousePos = getMousePosition(event);
        
        // 计算新位置：鼠标位置 - 初始偏移量
        let newPosition = {
          x: mousePos.x - offset.value.x,
          y: mousePos.y - offset.value.y,
        };
        
        // 应用网格吸附
        if (shouldSnapToGrid) {
          newPosition = snapToGridPosition(newPosition, gridSize);
        }
        
        // 应用边界限制
        if (boundaries) {
          newPosition.x = Math.min(Math.max(newPosition.x, boundaries.minX), boundaries.maxX);
          newPosition.y = Math.min(Math.max(newPosition.y, boundaries.minY), boundaries.maxY);
        }
        
        // 更新位置
        position.value = newPosition;
        
        // 触发拖动回调
        if (onDrag) {
          onDrag({
            componentId,
            startPosition: startPosition.value,
            currentPosition: position.value,
            offset: {
              x: position.value.x - startPosition.value.x,
              y: position.value.y - startPosition.value.y,
            },
            event,
          });
        }
        
        // 阻止默认行为和冒泡
        event.preventDefault();
        event.stopPropagation();
      } catch (error) {
        console.error('拖动过程处理失败:', error);
      }
    };
    
    /**
     * 处理拖动结束
     */
    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
      try {
        if (!isDragging.value) return;
        
        isDragging.value = false;
        
        // 触发拖动结束回调
        if (onDragEnd) {
          onDragEnd({
            componentId,
            startPosition: startPosition.value,
            currentPosition: position.value,
            offset: {
              x: position.value.x - startPosition.value.x,
              y: position.value.y - startPosition.value.y,
            },
            event,
          });
        }
        
        // 移除事件监听
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
      } catch (error) {
        console.error('拖动结束处理失败:', error);
      }
    };
    
    /**
     * 设置位置
     */
    const setPosition = (newPosition: { x: number; y: number }) => {
      try {
        position.value = newPosition;
      } catch (error) {
        console.error('设置位置失败:', error);
      }
    };
    
    /**
     * 重置位置到初始值
     */
    const resetPosition = () => {
      try {
        position.value = initialPosition;
      } catch (error) {
        console.error('重置位置失败:', error);
      }
    };
    
    // 计算样式
    const style = computed(() => {
      return {
        position: 'absolute',
        left: `${position.value.x}px`,
        top: `${position.value.y}px`,
        cursor: enabled ? (isDragging.value ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
      };
    });
    
    // 组件挂载时
    onMounted(() => {
      try {
        // 确保元素存在
        if (elementRef.value && enabled) {
          // 添加鼠标按下事件监听
          elementRef.value.addEventListener('mousedown', handleDragStart);
          elementRef.value.addEventListener('touchstart', handleDragStart);
        }
      } catch (error) {
        console.error('组件挂载处理失败:', error);
      }
    });
    
    // 组件卸载时
    onUnmounted(() => {
      try {
        // 确保元素存在
        if (elementRef.value && enabled) {
          // 移除事件监听
          elementRef.value.removeEventListener('mousedown', handleDragStart);
          elementRef.value.removeEventListener('touchstart', handleDragStart);
        }
        
        // 移除文档级事件监听
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
      } catch (error) {
        console.error('组件卸载处理失败:', error);
      }
    });
    
    return {
      position,
      isDragging,
      style,
      setPosition,
      resetPosition,
      handleDragStart,
    };
  } catch (error) {
    console.error('useDraggable hook 初始化失败:', error);
    // 返回默认值
    return {
      position: ref({ x: 0, y: 0 }),
      isDragging: ref(false),
      style: computed(() => ({})),
      setPosition: () => {},
      resetPosition: () => {},
      handleDragStart: () => {},
    };
  }
} 