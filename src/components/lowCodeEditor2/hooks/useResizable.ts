import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { ResizeEventParams } from '../types';
import { getMousePosition, snapToGridPosition } from '../utils/dragUtils';

/**
 * 可调整大小Hook
 * 实现组件的大小调整功能
 * @param options 调整大小选项
 */
export function useResizable(options: {
  /**
   * 元素引用
   */
  elementRef: any;
  
  /**
   * 初始大小
   */
  initialSize?: { width: number; height: number };
  
  /**
   * 是否启用调整大小
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
   * 最小尺寸
   */
  minSize?: { width: number; height: number };
  
  /**
   * 最大尺寸
   */
  maxSize?: { width: number; height: number };
  
  /**
   * 保持宽高比
   */
  aspectRatio?: number;
  
  /**
   * 调整大小开始回调
   */
  onResizeStart?: (params: ResizeEventParams) => void;
  
  /**
   * 调整大小中回调
   */
  onResize?: (params: ResizeEventParams) => void;
  
  /**
   * 调整大小结束回调
   */
  onResizeEnd?: (params: ResizeEventParams) => void;
  
  /**
   * 组件ID
   */
  componentId?: string;
}) {
  try {
    const {
      elementRef,
      initialSize = { width: 100, height: 100 },
      enabled = true,
      snapToGrid: shouldSnapToGrid = false,
      gridSize = 10,
      minSize = { width: 20, height: 20 },
      maxSize = { width: Infinity, height: Infinity },
      aspectRatio,
      onResizeStart,
      onResize,
      onResizeEnd,
      componentId = 'unknown',
    } = options;
    
    // 当前大小
    const size = ref(initialSize);
    
    // 是否正在调整大小
    const isResizing = ref(false);
    
    // 调整开始时的大小
    const startSize = ref({ width: 0, height: 0 });
    
    // 调整方向
    const resizeDirection = ref<'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | null>(null);
    
    // 鼠标起始位置
    const startMousePosition = ref({ x: 0, y: 0 });
    
    /**
     * 创建调整大小句柄
     */
    const createResizeHandlers = () => {
      try {
        if (!elementRef.value || !enabled) return;
        
        // 创建调整大小的句柄元素
        const directions = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        
        // 移除旧句柄
        const oldHandlers = elementRef.value.querySelectorAll('.resize-handler');
        oldHandlers.forEach((handler: Element) => {
          handler.remove();
        });
        
        // 为每个方向创建句柄
        directions.forEach(direction => {
          const handler = document.createElement('div');
          handler.className = `resize-handler resize-${direction}`;
          handler.style.position = 'absolute';
          handler.style.width = '8px';
          handler.style.height = '8px';
          handler.style.backgroundColor = 'white';
          handler.style.border = '1px solid #1890ff';
          handler.style.zIndex = '1000';
          
          // 设置句柄位置
          switch (direction) {
            case 'top':
              handler.style.top = '-4px';
              handler.style.left = '50%';
              handler.style.transform = 'translateX(-50%)';
              handler.style.cursor = 'n-resize';
              break;
            case 'right':
              handler.style.top = '50%';
              handler.style.right = '-4px';
              handler.style.transform = 'translateY(-50%)';
              handler.style.cursor = 'e-resize';
              break;
            case 'bottom':
              handler.style.bottom = '-4px';
              handler.style.left = '50%';
              handler.style.transform = 'translateX(-50%)';
              handler.style.cursor = 's-resize';
              break;
            case 'left':
              handler.style.top = '50%';
              handler.style.left = '-4px';
              handler.style.transform = 'translateY(-50%)';
              handler.style.cursor = 'w-resize';
              break;
            case 'top-left':
              handler.style.top = '-4px';
              handler.style.left = '-4px';
              handler.style.cursor = 'nw-resize';
              break;
            case 'top-right':
              handler.style.top = '-4px';
              handler.style.right = '-4px';
              handler.style.cursor = 'ne-resize';
              break;
            case 'bottom-left':
              handler.style.bottom = '-4px';
              handler.style.left = '-4px';
              handler.style.cursor = 'sw-resize';
              break;
            case 'bottom-right':
              handler.style.bottom = '-4px';
              handler.style.right = '-4px';
              handler.style.cursor = 'se-resize';
              break;
          }
          
          // 添加拖动事件
          handler.addEventListener('mousedown', (e: MouseEvent) => {
            handleResizeStart(e, direction as any);
          });
          
          handler.addEventListener('touchstart', (e: TouchEvent) => {
            handleResizeStart(e, direction as any);
          });
          
          // 添加到元素
          elementRef.value.appendChild(handler);
        });
      } catch (error) {
        console.error('创建调整大小句柄失败:', error);
      }
    };
    
    /**
     * 处理调整大小开始
     */
    const handleResizeStart = (
      event: MouseEvent | TouchEvent,
      direction: 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    ) => {
      try {
        if (!enabled) return;
        
        isResizing.value = true;
        resizeDirection.value = direction;
        
        // 获取鼠标位置
        const mousePos = getMousePosition(event);
        startMousePosition.value = mousePos;
        
        // 保存开始时的大小
        startSize.value = { ...size.value };
        
        // 触发调整开始回调
        if (onResizeStart) {
          onResizeStart({
            componentId,
            startSize: startSize.value,
            currentSize: size.value,
            event,
            direction,
          });
        }
        
        // 添加事件监听
        document.addEventListener('mousemove', handleResizeMove);
        document.addEventListener('touchmove', handleResizeMove);
        document.addEventListener('mouseup', handleResizeEnd);
        document.addEventListener('touchend', handleResizeEnd);
        
        // 阻止默认行为和冒泡
        event.preventDefault();
        event.stopPropagation();
      } catch (error) {
        console.error('调整大小开始处理失败:', error);
      }
    };
    
    /**
     * 处理调整大小过程
     */
    const handleResizeMove = (event: MouseEvent | TouchEvent) => {
      try {
        if (!isResizing.value || !resizeDirection.value) return;
        
        // 获取鼠标位置
        const mousePos = getMousePosition(event);
        
        // 计算鼠标移动距离
        const deltaX = mousePos.x - startMousePosition.value.x;
        const deltaY = mousePos.y - startMousePosition.value.y;
        
        // 根据调整方向计算新尺寸
        let newWidth = startSize.value.width;
        let newHeight = startSize.value.height;
        
        switch (resizeDirection.value) {
          case 'right':
            newWidth = startSize.value.width + deltaX;
            break;
          case 'bottom':
            newHeight = startSize.value.height + deltaY;
            break;
          case 'left':
            newWidth = startSize.value.width - deltaX;
            break;
          case 'top':
            newHeight = startSize.value.height - deltaY;
            break;
          case 'bottom-right':
            newWidth = startSize.value.width + deltaX;
            newHeight = startSize.value.height + deltaY;
            break;
          case 'bottom-left':
            newWidth = startSize.value.width - deltaX;
            newHeight = startSize.value.height + deltaY;
            break;
          case 'top-right':
            newWidth = startSize.value.width + deltaX;
            newHeight = startSize.value.height - deltaY;
            break;
          case 'top-left':
            newWidth = startSize.value.width - deltaX;
            newHeight = startSize.value.height - deltaY;
            break;
        }
        
        // 应用最小/最大尺寸限制
        newWidth = Math.max(minSize.width, Math.min(maxSize.width, newWidth));
        newHeight = Math.max(minSize.height, Math.min(maxSize.height, newHeight));
        
        // 应用宽高比
        if (aspectRatio) {
          if (['right', 'left'].includes(resizeDirection.value)) {
            newHeight = newWidth / aspectRatio;
          } else if (['top', 'bottom'].includes(resizeDirection.value)) {
            newWidth = newHeight * aspectRatio;
          } else {
            // 对角线调整时，以宽度为准
            newHeight = newWidth / aspectRatio;
          }
        }
        
        // 应用网格吸附
        if (shouldSnapToGrid) {
          const snapped = snapToGridPosition({ x: newWidth, y: newHeight }, gridSize);
          newWidth = snapped.x;
          newHeight = snapped.y;
        }
        
        // 更新尺寸
        size.value = { width: newWidth, height: newHeight };
        
        // 触发调整大小回调
        if (onResize) {
          onResize({
            componentId,
            startSize: startSize.value,
            currentSize: size.value,
            event,
            direction: resizeDirection.value,
          });
        }
        
        // 阻止默认行为和冒泡
        event.preventDefault();
        event.stopPropagation();
      } catch (error) {
        console.error('调整大小过程处理失败:', error);
      }
    };
    
    /**
     * 处理调整大小结束
     */
    const handleResizeEnd = (event: MouseEvent | TouchEvent) => {
      try {
        if (!isResizing.value) return;
        
        isResizing.value = false;
        
        // 触发调整结束回调
        if (onResizeEnd && resizeDirection.value) {
          onResizeEnd({
            componentId,
            startSize: startSize.value,
            currentSize: size.value,
            event,
            direction: resizeDirection.value,
          });
        }
        
        resizeDirection.value = null;
        
        // 移除事件监听
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchend', handleResizeEnd);
      } catch (error) {
        console.error('调整大小结束处理失败:', error);
      }
    };
    
    /**
     * 设置大小
     */
    const setSize = (newSize: { width: number; height: number }) => {
      try {
        size.value = {
          width: Math.max(minSize.width, Math.min(maxSize.width, newSize.width)),
          height: Math.max(minSize.height, Math.min(maxSize.height, newSize.height)),
        };
      } catch (error) {
        console.error('设置大小失败:', error);
      }
    };
    
    /**
     * 重置大小到初始值
     */
    const resetSize = () => {
      try {
        size.value = initialSize;
      } catch (error) {
        console.error('重置大小失败:', error);
      }
    };
    
    // 计算样式
    const style = computed(() => {
      return {
        width: `${size.value.width}px`,
        height: `${size.value.height}px`,
      };
    });
    
    // 组件挂载时
    onMounted(() => {
      try {
        // 确保元素存在
        if (elementRef.value && enabled) {
          createResizeHandlers();
        }
      } catch (error) {
        console.error('组件挂载处理失败:', error);
      }
    });
    
    // 组件卸载时
    onUnmounted(() => {
      try {
        // 移除文档级事件监听
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('touchmove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.removeEventListener('touchend', handleResizeEnd);
      } catch (error) {
        console.error('组件卸载处理失败:', error);
      }
    });
    
    return {
      size,
      isResizing,
      style,
      setSize,
      resetSize,
      createResizeHandlers,
    };
  } catch (error) {
    console.error('useResizable hook 初始化失败:', error);
    // 返回默认值
    return {
      size: ref({ width: 100, height: 100 }),
      isResizing: ref(false),
      style: computed(() => ({})),
      setSize: () => {},
      resetSize: () => {},
      createResizeHandlers: () => {},
    };
  }
} 