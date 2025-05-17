/**
 * 拖拽工具函数
 * 提供对齐、网格吸附等辅助功能
 */
import type { ComponentData } from '../types';

/**
 * 对齐到网格的函数
 * 将坐标对齐到指定的网格大小
 */
export function snapToGrid(value: number, gridSize: number): number {
  try {
    return Math.round(value / gridSize) * gridSize;
  } catch (error) {
    console.error(`对齐网格失败: ${error}`);
    return value;
  }
}

/**
 * 计算组件边界
 * 返回组件的四边位置
 */
export function getComponentBounds(component: ComponentData) {
  try {
    const { left, top, width, height } = component.style;
    return {
      left,
      right: left + width,
      top,
      bottom: top + height,
    };
  } catch (error) {
    console.error(`计算组件边界失败: ${error}`);
    return { left: 0, right: 0, top: 0, bottom: 0 };
  }
}

/**
 * 检查组件碰撞
 * 判断两个组件是否碰撞
 */
export function checkCollision(componentA: ComponentData, componentB: ComponentData): boolean {
  try {
    if (componentA.id === componentB.id) return false;
    
    const boundsA = getComponentBounds(componentA);
    const boundsB = getComponentBounds(componentB);
    
    return !(
      boundsA.right < boundsB.left ||
      boundsA.left > boundsB.right ||
      boundsA.bottom < boundsB.top ||
      boundsA.top > boundsB.bottom
    );
  } catch (error) {
    console.error(`检查组件碰撞失败: ${error}`);
    return false;
  }
}

/**
 * 获取可对齐的组件边界位置
 * 用于辅助对齐线显示
 */
export function getAlignmentLines(targetComponent: ComponentData, otherComponents: ComponentData[]) {
  try {
    const targetBounds = getComponentBounds(targetComponent);
    const alignmentLines = {
      horizontal: new Set<number>(),
      vertical: new Set<number>(),
    };
    
    // 添加画布边缘
    alignmentLines.horizontal.add(0);
    alignmentLines.vertical.add(0);
    
    // 添加其他组件的边界
    otherComponents.forEach((component) => {
      if (component.id === targetComponent.id) return;
      
      const bounds = getComponentBounds(component);
      
      // 水平边界
      alignmentLines.horizontal.add(bounds.top);
      alignmentLines.horizontal.add(bounds.bottom);
      alignmentLines.horizontal.add(bounds.top + (bounds.bottom - bounds.top) / 2); // 中心线
      
      // 垂直边界
      alignmentLines.vertical.add(bounds.left);
      alignmentLines.vertical.add(bounds.right);
      alignmentLines.vertical.add(bounds.left + (bounds.right - bounds.left) / 2); // 中心线
    });
    
    return alignmentLines;
  } catch (error) {
    console.error(`获取对齐线失败: ${error}`);
    return { horizontal: new Set<number>(), vertical: new Set<number>() };
  }
}

/**
 * 查找最接近的对齐线
 * 寻找距离目标位置最近的对齐线
 */
export function findClosestAlignmentLine(
  value: number,
  alignmentLines: Set<number>,
  threshold: number = 5
): number | null {
  try {
    let closestLine: number | null = null;
    let minDistance = threshold + 1;
    
    alignmentLines.forEach((line) => {
      const distance = Math.abs(value - line);
      if (distance < minDistance) {
        minDistance = distance;
        closestLine = line;
      }
    });
    
    return minDistance <= threshold ? closestLine : null;
  } catch (error) {
    console.error(`查找最接近对齐线失败: ${error}`);
    return null;
  }
}

/**
 * 限制组件在画布范围内
 * 确保组件不会拖出画布
 */
export function constrainToCanvas(
  left: number,
  top: number,
  width: number,
  height: number,
  canvasWidth: number,
  canvasHeight: number
) {
  try {
    return {
      left: Math.max(0, Math.min(left, canvasWidth - width)),
      top: Math.max(0, Math.min(top, canvasHeight - height)),
    };
  } catch (error) {
    console.error(`限制画布范围失败: ${error}`);
    return { left, top };
  }
}

/**
 * 计算拖拽开始位置与组件位置的偏移量
 */
export function calculateDragOffset(
  mouseX: number,
  mouseY: number,
  componentLeft: number,
  componentTop: number
) {
  try {
    return {
      offsetX: mouseX - componentLeft,
      offsetY: mouseY - componentTop,
    };
  } catch (error) {
    console.error(`计算拖拽偏移量失败: ${error}`);
    return { offsetX: 0, offsetY: 0 };
  }
}

/**
 * 计算调整大小时的新尺寸
 */
export function calculateNewSize(
  original: { width: number; height: number },
  offset: { x: number; y: number },
  minSize: { width: number; height: number } = { width: 20, height: 20 },
  keepRatio: boolean = false
) {
  try {
    let newWidth = Math.max(minSize.width, original.width + offset.x);
    let newHeight = Math.max(minSize.height, original.height + offset.y);
    
    if (keepRatio) {
      const ratio = original.width / original.height;
      if (Math.abs(offset.x) > Math.abs(offset.y)) {
        newHeight = newWidth / ratio;
      } else {
        newWidth = newHeight * ratio;
      }
    }
    
    return { width: newWidth, height: newHeight };
  } catch (error) {
    console.error(`计算新尺寸失败: ${error}`);
    return original;
  }
}

/**
 * 创建拖拽数据
 * 用于拖拽时传递组件信息
 */
export function createDragData(type: string, props?: Record<string, any>): string {
  try {
    return JSON.stringify({
      type,
      props: props || {},
    });
  } catch (error) {
    console.error(`创建拖拽数据失败: ${error}`);
    return '';
  }
}

/**
 * 解析拖拽数据
 * 从拖拽事件中解析组件信息
 */
export function parseDragData(dataString: string): { type: string; props: Record<string, any> } | null {
  try {
    return JSON.parse(dataString);
  } catch (error) {
    console.error(`解析拖拽数据失败: ${error}`);
    return null;
  }
} 