/**
 * 磁吸对齐钩子
 * 提供组件拖拽时的磁吸对齐功能
 */
import { ref, computed } from 'vue';
import type { Component, Position } from '../types';
import { logInfo, logError } from '../utils/logger';

/**
 * 引导线接口
 */
interface GuideLine {
  direction: 'horizontal' | 'vertical';
  position: number;
  strength: number;
}

/**
 * 对齐参考点类型
 */
type AlignmentPoint = {
  x: number;
  y: number;
  type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';
  componentId: string;
};

/**
 * 使用磁吸对齐hook
 * 提供组件拖拽时的磁吸对齐功能
 */
export function useMagneticAlignment() {
  // 磁吸吸附范围（像素）
  const SNAP_THRESHOLD = 10;
  
  // 当前激活的引导线
  const activeGuides = ref<GuideLine[]>([]);
  
  // 是否显示引导线
  const showGuides = computed(() => activeGuides.value.length > 0);
  
  /**
   * 计算所有可能的对齐参考点
   * @param components 所有组件
   * @param excludeId 要排除的组件ID（通常是正在拖拽的组件）
   * @returns 对齐参考点列表
   */
  const calculateAlignmentPoints = (
    components: Component[],
    excludeId: string
  ): AlignmentPoint[] => {
    try {
      const points: AlignmentPoint[] = [];
      
      const processComponent = (component: Component) => {
        if (component.id === excludeId) return;
        
        // 获取组件的边界
        const element = document.getElementById(component.id);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        
        // 水平方向的参考点
        points.push({
          x: rect.left,
          y: rect.top + rect.height / 2,
          type: 'left',
          componentId: component.id
        });
        
        points.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          type: 'center',
          componentId: component.id
        });
        
        points.push({
          x: rect.right,
          y: rect.top + rect.height / 2,
          type: 'right',
          componentId: component.id
        });
        
        // 垂直方向的参考点
        points.push({
          x: rect.left + rect.width / 2,
          y: rect.top,
          type: 'top',
          componentId: component.id
        });
        
        points.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          type: 'middle',
          componentId: component.id
        });
        
        points.push({
          x: rect.left + rect.width / 2,
          y: rect.bottom,
          type: 'bottom',
          componentId: component.id
        });
        
        // 递归处理子组件
        if (component.children) {
          component.children.forEach(processComponent);
        }
        
        // 处理插槽中的组件
        if (component.slots) {
          Object.values(component.slots).forEach(slotComponents => {
            slotComponents.forEach(processComponent);
          });
        }
      };
      
      // 处理所有组件
      components.forEach(processComponent);
      
      return points;
    } catch (error) {
      logError('Failed to calculate alignment points', error);
      return [];
    }
  };
  
  /**
   * 计算磁吸引导线
   * @param position 当前位置
   * @param size 组件尺寸
   * @param components 所有组件
   * @param componentId 当前组件ID
   * @returns 应用磁吸效果后的位置
   */
  const calculateGuides = (
    position: Position,
    size: { width: number; height: number },
    components: Component[],
    componentId: string
  ): Position => {
    try {
      // 清除之前的引导线
      clearGuides();
      
      // 计算当前组件的中心点和边界点
      const left = position.x;
      const center = position.x + size.width / 2;
      const right = position.x + size.width;
      
      const top = position.y;
      const middle = position.y + size.height / 2;
      const bottom = position.y + size.height;
      
      // 获取所有可能的对齐参考点
      const alignmentPoints = calculateAlignmentPoints(components, componentId);
      
      // 查找最接近的水平对齐点
      let bestHorizontalSnap = { position: 0, distance: SNAP_THRESHOLD, type: '' };
      let bestVerticalSnap = { position: 0, distance: SNAP_THRESHOLD, type: '' };
      
      // 检查水平方向的对齐点
      alignmentPoints.forEach(point => {
        // 左边缘对齐
        const leftDistance = Math.abs(point.x - left);
        if (leftDistance < bestHorizontalSnap.distance) {
          bestHorizontalSnap = {
            position: point.x,
            distance: leftDistance,
            type: 'left'
          };
        }
        
        // 中心对齐
        const centerDistance = Math.abs(point.x - center);
        if (centerDistance < bestHorizontalSnap.distance) {
          bestHorizontalSnap = {
            position: point.x,
            distance: centerDistance,
            type: 'center'
          };
        }
        
        // 右边缘对齐
        const rightDistance = Math.abs(point.x - right);
        if (rightDistance < bestHorizontalSnap.distance) {
          bestHorizontalSnap = {
            position: point.x,
            distance: rightDistance,
            type: 'right'
          };
        }
        
        // 顶部对齐
        const topDistance = Math.abs(point.y - top);
        if (topDistance < bestVerticalSnap.distance) {
          bestVerticalSnap = {
            position: point.y,
            distance: topDistance,
            type: 'top'
          };
        }
        
        // 中部对齐
        const middleDistance = Math.abs(point.y - middle);
        if (middleDistance < bestVerticalSnap.distance) {
          bestVerticalSnap = {
            position: point.y,
            distance: middleDistance,
            type: 'middle'
          };
        }
        
        // 底部对齐
        const bottomDistance = Math.abs(point.y - bottom);
        if (bottomDistance < bestVerticalSnap.distance) {
          bestVerticalSnap = {
            position: point.y,
            distance: bottomDistance,
            type: 'bottom'
          };
        }
      });
      
      // 应用水平方向的磁吸
      let newX = position.x;
      if (bestHorizontalSnap.distance < SNAP_THRESHOLD) {
        // 根据对齐类型调整位置
        if (bestHorizontalSnap.type === 'left') {
          newX = bestHorizontalSnap.position;
          // 添加垂直引导线
          activeGuides.value.push({
            direction: 'vertical',
            position: bestHorizontalSnap.position,
            strength: 1 - bestHorizontalSnap.distance / SNAP_THRESHOLD
          });
        } else if (bestHorizontalSnap.type === 'center') {
          newX = bestHorizontalSnap.position - size.width / 2;
          // 添加垂直引导线
          activeGuides.value.push({
            direction: 'vertical',
            position: bestHorizontalSnap.position,
            strength: 1 - bestHorizontalSnap.distance / SNAP_THRESHOLD
          });
        } else if (bestHorizontalSnap.type === 'right') {
          newX = bestHorizontalSnap.position - size.width;
          // 添加垂直引导线
          activeGuides.value.push({
            direction: 'vertical',
            position: bestHorizontalSnap.position,
            strength: 1 - bestHorizontalSnap.distance / SNAP_THRESHOLD
          });
        }
      }
      
      // 应用垂直方向的磁吸
      let newY = position.y;
      if (bestVerticalSnap.distance < SNAP_THRESHOLD) {
        // 根据对齐类型调整位置
        if (bestVerticalSnap.type === 'top') {
          newY = bestVerticalSnap.position;
          // 添加水平引导线
          activeGuides.value.push({
            direction: 'horizontal',
            position: bestVerticalSnap.position,
            strength: 1 - bestVerticalSnap.distance / SNAP_THRESHOLD
          });
        } else if (bestVerticalSnap.type === 'middle') {
          newY = bestVerticalSnap.position - size.height / 2;
          // 添加水平引导线
          activeGuides.value.push({
            direction: 'horizontal',
            position: bestVerticalSnap.position,
            strength: 1 - bestVerticalSnap.distance / SNAP_THRESHOLD
          });
        } else if (bestVerticalSnap.type === 'bottom') {
          newY = bestVerticalSnap.position - size.height;
          // 添加水平引导线
          activeGuides.value.push({
            direction: 'horizontal',
            position: bestVerticalSnap.position,
            strength: 1 - bestVerticalSnap.distance / SNAP_THRESHOLD
          });
        }
      }
      
      return { x: newX, y: newY };
    } catch (error) {
      logError('Failed to calculate magnetic guides', error);
      clearGuides();
      return position;
    }
  };
  
  /**
   * 清除所有引导线
   */
  const clearGuides = () => {
    try {
      activeGuides.value = [];
    } catch (error) {
      logError('Failed to clear guides', error);
    }
  };
  
  return {
    activeGuides,
    showGuides,
    calculateGuides,
    clearGuides
  };
} 