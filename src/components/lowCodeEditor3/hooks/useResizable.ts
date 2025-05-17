/**
 * 可调整大小功能 Hook
 * 为组件添加调整大小功能
 */
import { ref, onMounted, onUnmounted } from 'vue';
import { snapToGrid, calculateNewSize } from '../utils/dragUtils';

/**
 * 调整大小方向枚举
 */
export enum ResizeDirection {
  TopLeft = 'tl',
  Top = 't',
  TopRight = 'tr',
  Right = 'r',
  BottomRight = 'br',
  Bottom = 'b',
  BottomLeft = 'bl',
  Left = 'l',
}

/**
 * 可调整大小 Hook 配置参数接口
 */
interface UseResizableOptions {
  /**
   * 是否启用网格对齐
   */
  snapToGrid?: boolean;
  /**
   * 网格大小
   */
  gridSize?: number;
  /**
   * 最小宽度
   */
  minWidth?: number;
  /**
   * 最小高度
   */
  minHeight?: number;
  /**
   * 是否保持宽高比
   */
  keepRatio?: boolean;
  /**
   * 是否限制在父元素内
   */
  constrainToParent?: boolean;
  /**
   * 父元素宽度
   */
  parentWidth?: number;
  /**
   * 父元素高度
   */
  parentHeight?: number;
}

/**
 * 组件调整大小 Hook
 */
export function useResizable(element: any, options: UseResizableOptions = {}) {
  /**
   * 默认参数
   */
  const {
    snapToGrid: enableSnapToGrid = false,
    gridSize = 10,
    minWidth = 20,
    minHeight = 20,
    keepRatio = false,
    constrainToParent = true,
    parentWidth = 1200,
    parentHeight = 800,
  } = options;

  /**
   * 调整大小状态
   */
  const isResizing = ref(false);
  const originalSize = ref({ width: 0, height: 0 });
  const originalPosition = ref({ x: 0, y: 0 });
  const size = ref({ width: 0, height: 0 });
  const position = ref({ x: 0, y: 0 });
  const activeDirection = ref<ResizeDirection | null>(null);

  /**
   * 开始调整大小
   */
  const handleResizeStart = (event: MouseEvent, direction: ResizeDirection) => {
    try {
      if (!element.value) return;

      const rect = element.value.getBoundingClientRect();
      
      // 记录初始大小和位置
      originalSize.value = { width: rect.width, height: rect.height };
      originalPosition.value = { x: rect.left, y: rect.top };
      size.value = { width: rect.width, height: rect.height };
      position.value = { x: rect.left, y: rect.top };
      
      // 设置活动调整方向
      activeDirection.value = direction;
      isResizing.value = true;
      
      // 防止默认行为和冒泡
      event.preventDefault();
      event.stopPropagation();
      
      // 添加全局事件监听
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    } catch (error) {
      console.error(`开始调整大小失败: ${error}`);
    }
  };

  /**
   * 调整大小移动处理
   */
  const handleResizeMove = (event: MouseEvent) => {
    try {
      if (!isResizing.value || !activeDirection.value) return;
      
      const direction = activeDirection.value;
      const { width: originalWidth, height: originalHeight } = originalSize.value;
      const { x: originalX, y: originalY } = originalPosition.value;
      
      // 计算鼠标移动距离
      const deltaX = event.clientX - originalX;
      const deltaY = event.clientY - originalY;
      
      // 根据调整方向计算新大小和位置
      let newWidth = originalWidth;
      let newHeight = originalHeight;
      let newX = originalX;
      let newY = originalY;
      
      // 左侧调整（会改变 x 位置）
      if (direction.includes('l')) {
        newWidth = originalWidth - deltaX;
        newX = originalX + deltaX;
      }
      
      // 右侧调整
      if (direction.includes('r')) {
        newWidth = originalWidth + event.clientX - (originalX + originalWidth);
      }
      
      // 顶部调整（会改变 y 位置）
      if (direction.includes('t')) {
        newHeight = originalHeight - deltaY;
        newY = originalY + deltaY;
      }
      
      // 底部调整
      if (direction.includes('b')) {
        newHeight = originalHeight + event.clientY - (originalY + originalHeight);
      }
      
      // 确保最小尺寸
      newWidth = Math.max(minWidth, newWidth);
      newHeight = Math.max(minHeight, newHeight);
      
      // 保持宽高比
      if (keepRatio) {
        const ratio = originalWidth / originalHeight;
        
        // 根据调整方向选择保持比例的方式
        if (direction.includes('l') || direction.includes('r')) {
          // 横向调整时，调整高度来匹配宽高比
          newHeight = newWidth / ratio;
        } else {
          // 纵向调整时，调整宽度来匹配宽高比
          newWidth = newHeight * ratio;
        }
      }
      
      // 网格对齐
      if (enableSnapToGrid) {
        newWidth = snapToGrid(newWidth, gridSize);
        newHeight = snapToGrid(newHeight, gridSize);
        newX = snapToGrid(newX, gridSize);
        newY = snapToGrid(newY, gridSize);
      }
      
      // 限制在父元素内
      if (constrainToParent) {
        if (newX < 0) {
          newWidth = newWidth + newX;
          newX = 0;
        }
        
        if (newY < 0) {
          newHeight = newHeight + newY;
          newY = 0;
        }
        
        if (newX + newWidth > parentWidth) {
          newWidth = parentWidth - newX;
        }
        
        if (newY + newHeight > parentHeight) {
          newHeight = parentHeight - newY;
        }
      }
      
      // 更新大小和位置
      size.value = { width: newWidth, height: newHeight };
      position.value = { x: newX, y: newY };
      
      // 防止默认行为和冒泡
      event.preventDefault();
      event.stopPropagation();
    } catch (error) {
      console.error(`调整大小移动失败: ${error}`);
    }
  };

  /**
   * 结束调整大小
   */
  const handleResizeEnd = () => {
    try {
      isResizing.value = false;
      activeDirection.value = null;
      
      // 移除全局事件监听
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    } catch (error) {
      console.error(`结束调整大小失败: ${error}`);
    }
  };

  /**
   * 创建调整手柄
   */
  const createResizeHandles = () => {
    try {
      const directions = Object.values(ResizeDirection);
      
      return directions.map(direction => {
        const handleClass = `resize-handle resize-handle-${direction}`;
        
        const handleStyle = {
          position: 'absolute',
          width: '8px',
          height: '8px',
          backgroundColor: '#1890ff',
          borderRadius: '50%',
          zIndex: 100,
        };
        
        // 调整不同方向手柄的位置
        const positionStyle = (() => {
          switch (direction) {
            case ResizeDirection.TopLeft:
              return { top: '-4px', left: '-4px', cursor: 'nwse-resize' };
            case ResizeDirection.Top:
              return { top: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' };
            case ResizeDirection.TopRight:
              return { top: '-4px', right: '-4px', cursor: 'nesw-resize' };
            case ResizeDirection.Right:
              return { top: 'calc(50% - 4px)', right: '-4px', cursor: 'ew-resize' };
            case ResizeDirection.BottomRight:
              return { bottom: '-4px', right: '-4px', cursor: 'nwse-resize' };
            case ResizeDirection.Bottom:
              return { bottom: '-4px', left: 'calc(50% - 4px)', cursor: 'ns-resize' };
            case ResizeDirection.BottomLeft:
              return { bottom: '-4px', left: '-4px', cursor: 'nesw-resize' };
            case ResizeDirection.Left:
              return { top: 'calc(50% - 4px)', left: '-4px', cursor: 'ew-resize' };
            default:
              return {};
          }
        })();
        
        return {
          direction,
          class: handleClass,
          style: { ...handleStyle, ...positionStyle },
          onMouseDown: (e: MouseEvent) => handleResizeStart(e, direction),
        };
      });
    } catch (error) {
      console.error(`创建调整手柄失败: ${error}`);
      return [];
    }
  };

  /**
   * 返回调整大小相关状态和方法
   */
  return {
    isResizing,
    size,
    position,
    originalSize,
    originalPosition,
    handleResizeStart,
    resizeHandles: createResizeHandles(),
  };
} 