import type { CanvasComponent, AlignmentGuide } from '../types';

/**
 * 拖拽操作工具函数
 * 提供拖拽相关的辅助函数
 */

/**
 * 检查点是否在矩形区域内
 * @param point 坐标点
 * @param rect 矩形区域
 * @returns 是否在区域内
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: { left: number; top: number; width: number; height: number }
): boolean {
  try {
    return (
      point.x >= rect.left &&
      point.x <= rect.left + rect.width &&
      point.y >= rect.top &&
      point.y <= rect.top + rect.height
    );
  } catch (error) {
    console.error('检查点是否在矩形区域内失败:', error);
    return false;
  }
}

/**
 * 获取对齐到网格的坐标
 * @param value 原始值
 * @param gridSize 网格大小
 * @returns 对齐后的值
 */
export function snapToGrid(value: number, gridSize: number): number {
  try {
    return Math.round(value / gridSize) * gridSize;
  } catch (error) {
    console.error('获取对齐到网格的坐标失败:', error);
    return value;
  }
}

/**
 * 限制值在最小和最大范围内
 * @param value 原始值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的值
 */
export function clamp(value: number, min: number, max: number): number {
  try {
    return Math.max(min, Math.min(max, value));
  } catch (error) {
    console.error('限制值范围失败:', error);
    return value;
  }
}

/**
 * 计算拖动时的边界限制
 * @param component 组件
 * @param canvasWidth 画布宽度
 * @param canvasHeight 画布高度
 * @returns 边界限制
 */
export function calculateBoundaries(
  component: CanvasComponent,
  canvasWidth: number,
  canvasHeight: number
) {
  try {
    return {
      minLeft: 0,
      maxLeft: canvasWidth - component.style.width,
      minTop: 0,
      maxTop: canvasHeight - component.style.height,
    };
  } catch (error) {
    console.error('计算拖动边界失败:', error);
    return { minLeft: 0, maxLeft: canvasWidth, minTop: 0, maxTop: canvasHeight };
  }
}

/**
 * 计算组件的绝对位置（考虑父容器）
 * @param component 组件
 * @param parentPosition 父容器位置
 * @returns 绝对位置
 */
export function calculateAbsolutePosition(
  component: CanvasComponent,
  parentPosition: { left: number; top: number } = { left: 0, top: 0 }
) {
  try {
    return {
      left: parentPosition.left + component.style.left,
      top: parentPosition.top + component.style.top,
    };
  } catch (error) {
    console.error('计算组件绝对位置失败:', error);
    return { left: component.style.left, top: component.style.top };
  }
}

/**
 * 计算鼠标位置
 * 从事件对象中获取鼠标的x, y坐标
 */
export const getMousePosition = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
  try {
    let clientX = 0;
    let clientY = 0;

    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    }

    return { x: clientX, y: clientY };
  } catch (error) {
    console.error('获取鼠标位置失败:', error);
    return { x: 0, y: 0 };
  }
};

/**
 * 将位置吸附到网格
 * 根据网格大小调整坐标
 */
export const snapToGridPosition = (position: { x: number; y: number }, gridSize: number): { x: number; y: number } => {
  try {
    const x = Math.round(position.x / gridSize) * gridSize;
    const y = Math.round(position.y / gridSize) * gridSize;
    return { x, y };
  } catch (error) {
    console.error('吸附到网格失败:', error);
    return position;
  }
};

/**
 * 计算组件之间的对齐辅助线
 * 分析所有组件的位置，找出可能的对齐位置
 */
export const calculateAlignmentGuides = (
  currentComponent: CanvasComponent,
  allComponents: CanvasComponent[],
  threshold: number = 5
): AlignmentGuide[] => {
  try {
    const guides: AlignmentGuide[] = [];
    
    // 当前组件的位置和尺寸
    const { top, left, width, height } = currentComponent.style;
    const right = left + width;
    const bottom = top + height;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // 遍历所有其他组件
    allComponents.forEach(component => {
      // 跳过当前组件
      if (component.id === currentComponent.id) return;
      
      const otherLeft = component.style.left;
      const otherTop = component.style.top;
      const otherWidth = component.style.width;
      const otherHeight = component.style.height;
      const otherRight = otherLeft + otherWidth;
      const otherBottom = otherTop + otherHeight;
      const otherCenterX = otherLeft + otherWidth / 2;
      const otherCenterY = otherTop + otherHeight / 2;
      
      // 垂直对齐线
      // 左边缘对齐
      if (Math.abs(left - otherLeft) < threshold) {
        guides.push({
          position: otherLeft,
          type: 'vertical',
          color: '#ff0000',
        });
      }
      
      // 右边缘对齐
      if (Math.abs(right - otherRight) < threshold) {
        guides.push({
          position: otherRight,
          type: 'vertical',
          color: '#ff0000',
        });
      }
      
      // 中心对齐
      if (Math.abs(centerX - otherCenterX) < threshold) {
        guides.push({
          position: otherCenterX,
          type: 'vertical',
          color: '#00ff00',
        });
      }
      
      // 右边缘对左边缘
      if (Math.abs(right - otherLeft) < threshold) {
        guides.push({
          position: otherLeft,
          type: 'vertical',
          color: '#0000ff',
        });
      }
      
      // 左边缘对右边缘
      if (Math.abs(left - otherRight) < threshold) {
        guides.push({
          position: otherRight,
          type: 'vertical',
          color: '#0000ff',
        });
      }
      
      // 水平对齐线
      // 顶部对齐
      if (Math.abs(top - otherTop) < threshold) {
        guides.push({
          position: otherTop,
          type: 'horizontal',
          color: '#ff0000',
        });
      }
      
      // 底部对齐
      if (Math.abs(bottom - otherBottom) < threshold) {
        guides.push({
          position: otherBottom,
          type: 'horizontal',
          color: '#ff0000',
        });
      }
      
      // 中心对齐
      if (Math.abs(centerY - otherCenterY) < threshold) {
        guides.push({
          position: otherCenterY,
          type: 'horizontal',
          color: '#00ff00',
        });
      }
      
      // 底部对顶部
      if (Math.abs(bottom - otherTop) < threshold) {
        guides.push({
          position: otherTop,
          type: 'horizontal',
          color: '#0000ff',
        });
      }
      
      // 顶部对底部
      if (Math.abs(top - otherBottom) < threshold) {
        guides.push({
          position: otherBottom,
          type: 'horizontal',
          color: '#0000ff',
        });
      }
    });
    
    return guides;
  } catch (error) {
    console.error('计算对齐辅助线失败:', error);
    return [];
  }
};

/**
 * 根据对齐辅助线吸附位置
 * 调整组件位置以吸附到对齐线
 */
export const snapToAlignmentGuides = (
  position: { x: number; y: number },
  currentComponent: CanvasComponent,
  guides: AlignmentGuide[]
): { x: number; y: number } => {
  try {
    let { x, y } = position;
    const width = currentComponent.style.width;
    const height = currentComponent.style.height;
    
    // 处理垂直对齐
    guides
      .filter(guide => guide.type === 'vertical')
      .forEach(guide => {
        // 左边缘吸附
        if (Math.abs(x - guide.position) < 5) {
          x = guide.position;
        }
        
        // 右边缘吸附
        if (Math.abs(x + width - guide.position) < 5) {
          x = guide.position - width;
        }
        
        // 中心吸附
        if (Math.abs(x + width / 2 - guide.position) < 5) {
          x = guide.position - width / 2;
        }
      });
    
    // 处理水平对齐
    guides
      .filter(guide => guide.type === 'horizontal')
      .forEach(guide => {
        // 顶部吸附
        if (Math.abs(y - guide.position) < 5) {
          y = guide.position;
        }
        
        // 底部吸附
        if (Math.abs(y + height - guide.position) < 5) {
          y = guide.position - height;
        }
        
        // 中心吸附
        if (Math.abs(y + height / 2 - guide.position) < 5) {
          y = guide.position - height / 2;
        }
      });
    
    return { x, y };
  } catch (error) {
    console.error('吸附到对齐辅助线失败:', error);
    return position;
  }
};

/**
 * 检查组件是否可以放置在目标容器中
 * 验证组件类型是否符合容器允许的子组件类型
 */
export const canDropIntoContainer = (
  componentType: 'basic' | 'layout' | 'chart',
  containerComponent: CanvasComponent | null,
  componentDefinitions: Record<string, any>
): boolean => {
  try {
    if (!containerComponent) {
      // 可以放置在根级别
      return true;
    }
    
    // 获取容器的定义
    const containerDef = componentDefinitions[containerComponent.componentId];
    if (!containerDef) {
      return false;
    }
    
    // 检查容器是否允许包含子组件
    if (!containerDef.allowChildren) {
      return false;
    }
    
    // 检查容器是否允许包含该类型的子组件
    if (containerDef.allowedChildTypes && 
        !containerDef.allowedChildTypes.includes(componentType)) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('检查组件是否可以放置在目标容器中失败:', error);
    return false;
  }
};

/**
 * 找出鼠标位置下的容器组件
 * 确定组件应放置在哪个容器中
 */
export const findContainerAtPosition = (
  position: { x: number; y: number },
  components: CanvasComponent[],
  componentDefinitions: Record<string, any>,
  currentDraggingId?: string
): CanvasComponent | null => {
  try {
    // 按照z-index从高到低排序，以便先检查顶层组件
    const sortedComponents = [...components].sort(
      (a, b) => b.style.zIndex - a.style.zIndex
    );
    
    for (const component of sortedComponents) {
      // 跳过当前正在拖拽的组件
      if (currentDraggingId && component.id === currentDraggingId) {
        continue;
      }
      
      // 检查位置是否在组件内
      const { left, top, width, height } = component.style;
      if (
        position.x >= left &&
        position.x <= left + width &&
        position.y >= top &&
        position.y <= top + height
      ) {
        // 检查该组件是否允许包含子组件
        const componentDef = componentDefinitions[component.componentId];
        if (componentDef && componentDef.allowChildren) {
          // 递归检查子组件
          if (component.children && component.children.length > 0) {
            const childContainer = findContainerAtPosition(
              position,
              component.children,
              componentDefinitions,
              currentDraggingId
            );
            
            if (childContainer) {
              return childContainer;
            }
          }
          
          return component;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('查找位置下的容器组件失败:', error);
    return null;
  }
};

/**
 * 计算相对于容器的位置
 * 将全局坐标转换为相对于容器的坐标
 */
export const calculateRelativePosition = (
  position: { x: number; y: number },
  containerComponent: CanvasComponent | null
): { left: number; top: number } => {
  try {
    if (!containerComponent) {
      // 相对于画布的坐标
      return { left: position.x, top: position.y };
    }
    
    // 相对于容器的坐标
    return {
      left: position.x - containerComponent.style.left,
      top: position.y - containerComponent.style.top,
    };
  } catch (error) {
    console.error('计算相对于容器的位置失败:', error);
    return { left: position.x, top: position.y };
  }
};

/**
 * 检查组件是否重叠
 * 用于防止组件堆叠在一起
 */
export const checkComponentOverlap = (
  component: CanvasComponent,
  allComponents: CanvasComponent[]
): boolean => {
  try {
    const { left, top, width, height } = component.style;
    
    for (const otherComponent of allComponents) {
      // 跳过自己
      if (otherComponent.id === component.id) {
        continue;
      }
      
      const { 
        left: otherLeft, 
        top: otherTop, 
        width: otherWidth, 
        height: otherHeight 
      } = otherComponent.style;
      
      // 检查是否重叠
      if (
        left < otherLeft + otherWidth &&
        left + width > otherLeft &&
        top < otherTop + otherHeight &&
        top + height > otherTop
      ) {
        return true; // 存在重叠
      }
    }
    
    return false; // 没有重叠
  } catch (error) {
    console.error('检查组件是否重叠失败:', error);
    return false;
  }
};

/**
 * 移动组件时防止超出画布
 * @param position 位置
 * @param componentSize 组件大小
 * @param canvasSize 画布大小
 * @returns 调整后的位置
 */
export function constrainToCanvas(
  position: { left: number; top: number },
  componentSize: { width: number; height: number },
  canvasSize: { width: number; height: number }
): { left: number; top: number } {
  try {
    return {
      left: clamp(position.left, 0, canvasSize.width - componentSize.width),
      top: clamp(position.top, 0, canvasSize.height - componentSize.height),
    };
  } catch (error) {
    console.error('调整位置到画布内失败:', error);
    return position;
  }
} 